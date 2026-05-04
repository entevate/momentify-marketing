/**
 * Server-side proxy around Resend's Audiences + Contacts SDK.
 *
 * Resend is the source of truth for contact and list data — we never
 * persist contacts in our KV. Every call here must be invoked from an
 * auth-gated API route so RESEND_API_KEY stays server-side.
 *
 * SDK reference: https://resend.com/docs/api-reference/audiences/list
 */

import { Resend } from "resend"
import { kv } from "@/lib/gtm/kv-store"
import type { ResendAudience, ResendContact } from "@/lib/gtm/email-types"

/**
 * Per-contact metadata (company, etc.) — kept in our KV because
 * Resend's Audiences API has no custom field support. Keyed by Resend
 * contact id. List enrichment merges this into ResendContact at read
 * time. Worth ~one KV round-trip per contact, batched per audience.
 */
interface ContactMeta {
  company?: string
}
const metaKey = (contactId: string) => `gtm:email:contact-meta:${contactId}`

async function getMeta(contactId: string): Promise<ContactMeta> {
  return (await kv.get<ContactMeta>(metaKey(contactId))) || {}
}
async function setMeta(contactId: string, meta: ContactMeta): Promise<void> {
  // Skip the write entirely when there's nothing to store - keeps the
  // KV namespace lean for contacts without extra fields.
  if (!meta.company) return
  await kv.set(metaKey(contactId), meta)
}
async function delMeta(contactId: string): Promise<void> {
  await kv.del(metaKey(contactId))
}

let _resend: Resend | null = null
function getClient(): Resend {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY)
  return _resend
}

// ─── Audiences ─────────────────────────────────────────────────────────

export async function listAudiences(): Promise<ResendAudience[]> {
  const result = await getClient().audiences.list()
  if (result.error) throw new Error(result.error.message)
  // Resend returns { data: [{ id, name, created_at }, ...] } shape.
  // Normalize snake_case → camelCase for our types.
  // The SDK paginates; v1 fetches the first page only (free tier rarely exceeds).
  const items = (result.data?.data ?? []) as Array<{ id: string; name: string; created_at: string }>
  return items.map((a) => ({ id: a.id, name: a.name, createdAt: a.created_at }))
}

export async function createAudience(name: string): Promise<ResendAudience> {
  const result = await getClient().audiences.create({ name })
  if (result.error) throw new Error(result.error.message)
  const a = result.data as { id: string; name: string }
  return { id: a.id, name: a.name, createdAt: new Date().toISOString() }
}

export async function deleteAudience(id: string): Promise<void> {
  const result = await getClient().audiences.remove(id)
  if (result.error) throw new Error(result.error.message)
}

// ─── Contacts (within an audience) ─────────────────────────────────────

interface ResendContactRaw {
  id: string
  email: string
  first_name?: string | null
  last_name?: string | null
  unsubscribed: boolean
  created_at: string
}

function mapContact(audienceId: string, c: ResendContactRaw, meta: ContactMeta = {}): ResendContact {
  return {
    id: c.id,
    email: c.email,
    firstName: c.first_name ?? undefined,
    lastName: c.last_name ?? undefined,
    company: meta.company,
    audienceId,
    unsubscribed: c.unsubscribed,
    createdAt: c.created_at,
  }
}

export async function listContacts(audienceId: string): Promise<ResendContact[]> {
  const result = await getClient().contacts.list({ audienceId })
  if (result.error) throw new Error(result.error.message)
  const items = (result.data?.data ?? []) as ResendContactRaw[]
  // Fetch metadata in parallel so company shows up alongside name+email
  // without a noticeable serial-fetch latency.
  const metas = await Promise.all(items.map((c) => getMeta(c.id)))
  return items.map((c, i) => mapContact(audienceId, c, metas[i]))
}

export async function createContact(
  audienceId: string,
  email: string,
  firstName?: string,
  lastName?: string,
  company?: string,
): Promise<ResendContact> {
  const result = await getClient().contacts.create({
    audienceId,
    email: email.toLowerCase().trim(),
    firstName,
    lastName,
    unsubscribed: false,
  })
  if (result.error) throw new Error(result.error.message)
  const c = result.data as { id: string }
  // Persist company in our KV-backed metadata store. Only writes when
  // company is set; clean contacts skip the round-trip.
  if (company?.trim()) {
    await setMeta(c.id, { company: company.trim() })
  }
  return {
    id: c.id,
    email,
    firstName,
    lastName,
    company: company?.trim() || undefined,
    audienceId,
    unsubscribed: false,
    createdAt: new Date().toISOString(),
  }
}

export async function getContact(audienceId: string, contactId: string): Promise<ResendContact | null> {
  const result = await getClient().contacts.get({ audienceId, id: contactId })
  if (result.error) return null
  const c = result.data as ResendContactRaw
  const meta = await getMeta(contactId)
  return mapContact(audienceId, c, meta)
}

export async function removeContact(audienceId: string, contactId: string): Promise<void> {
  const result = await getClient().contacts.remove({ audienceId, id: contactId })
  if (result.error) throw new Error(result.error.message)
  // Clean up our metadata stub so we don't leak storage on heavy
  // create/delete cycles.
  await delMeta(contactId)
}
