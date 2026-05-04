/**
 * KV CRUD wrappers for the GTM email module.
 *
 * Drafts, send records, and webhook events all live in the project's
 * shared kv-store wrapper (Vercel KV with file fallback in local dev).
 * Audiences and contacts are NOT here — they live in Resend's Audience
 * API; see resend-audiences.ts for those.
 */

import { kv } from "@/lib/gtm/kv-store"
import {
  EMAIL_KV,
  type EmailDraft,
  type EmailEvent,
  type EmailSendRecord,
  type EmailStatus,
} from "@/lib/gtm/email-types"
import { createHash } from "crypto"

// ─── id helpers ────────────────────────────────────────────────────────

/**
 * Short opaque id, alphanumeric only so it's safe for blob paths and URLs.
 * Format: `<time36><rand4>`. Collision-resistant enough for our scale.
 */
export function newId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
}

/**
 * Deterministic event id so we can dedupe webhook deliveries (Resend may
 * retry on transient errors).
 */
export function eventId(messageId: string, type: string, occurredAt: string): string {
  return createHash("sha1").update(`${messageId}|${type}|${occurredAt}`).digest("hex").slice(0, 24)
}

// ─── Drafts ────────────────────────────────────────────────────────────

export async function listDraftIds(): Promise<string[]> {
  return kv.smembers(EMAIL_KV.draftIndex)
}

export async function listDrafts(filters?: {
  solution?: string
  statuses?: EmailStatus[]
  since?: string
}): Promise<EmailDraft[]> {
  const ids = await listDraftIds()
  if (ids.length === 0) return []
  const drafts = (
    await Promise.all(ids.map((id) => kv.get<EmailDraft>(EMAIL_KV.draft(id))))
  ).filter((d): d is EmailDraft => !!d)
  return drafts.filter((d) => {
    if (filters?.solution && d.solution !== filters.solution) return false
    if (filters?.statuses && !filters.statuses.includes(d.status)) return false
    if (filters?.since && new Date(d.updatedAt) < new Date(filters.since)) return false
    return true
  })
}

export async function getDraft(id: string): Promise<EmailDraft | null> {
  return kv.get<EmailDraft>(EMAIL_KV.draft(id))
}

export async function saveDraft(draft: EmailDraft): Promise<EmailDraft> {
  draft.updatedAt = new Date().toISOString()
  await kv.set(EMAIL_KV.draft(draft.id), draft)
  await kv.sadd(EMAIL_KV.draftIndex, draft.id)
  return draft
}

export async function deleteDraft(id: string): Promise<void> {
  await kv.del(EMAIL_KV.draft(id))
  await kv.srem(EMAIL_KV.draftIndex, id)
}

// ─── Send records ──────────────────────────────────────────────────────

export async function recordSend(send: EmailSendRecord): Promise<EmailSendRecord> {
  await kv.set(EMAIL_KV.send(send.id), send)
  await kv.sadd(EMAIL_KV.sendIndex, send.id)
  if (send.resendMessageId) {
    // Reverse lookup so the webhook handler can resolve messageId → sendId
    // (and from there → draftId) without scanning the index.
    await kv.set(EMAIL_KV.sendByMessageId(send.resendMessageId), send.id)
  }
  return send
}

export async function getSend(id: string): Promise<EmailSendRecord | null> {
  return kv.get<EmailSendRecord>(EMAIL_KV.send(id))
}

export async function getSendByMessageId(messageId: string): Promise<EmailSendRecord | null> {
  const sendId = await kv.get<string>(EMAIL_KV.sendByMessageId(messageId))
  if (!sendId) return null
  return getSend(sendId)
}

export async function listSends(filters?: {
  draftId?: string
  since?: string
}): Promise<EmailSendRecord[]> {
  const ids = await kv.smembers(EMAIL_KV.sendIndex)
  if (ids.length === 0) return []
  const sends = (
    await Promise.all(ids.map((id) => kv.get<EmailSendRecord>(EMAIL_KV.send(id))))
  ).filter((s): s is EmailSendRecord => !!s)
  return sends.filter((s) => {
    if (filters?.draftId && s.draftId !== filters.draftId) return false
    if (filters?.since && new Date(s.sentAt) < new Date(filters.since)) return false
    return true
  })
}

// ─── Webhook events ────────────────────────────────────────────────────

export async function recordEvent(event: EmailEvent): Promise<EmailEvent> {
  await kv.set(EMAIL_KV.event(event.id), event)
  await kv.sadd(EMAIL_KV.eventIndex, event.id)
  if (event.draftId) {
    await kv.sadd(EMAIL_KV.eventsByDraft(event.draftId), event.id)
  }
  return event
}

export async function listEvents(filters?: {
  draftId?: string
  type?: string
  since?: string
  limit?: number
}): Promise<EmailEvent[]> {
  // Per-draft scan uses the secondary index for speed; otherwise scan global.
  const ids = filters?.draftId
    ? await kv.smembers(EMAIL_KV.eventsByDraft(filters.draftId))
    : await kv.smembers(EMAIL_KV.eventIndex)
  if (ids.length === 0) return []
  const events = (
    await Promise.all(ids.map((id) => kv.get<EmailEvent>(EMAIL_KV.event(id))))
  ).filter((e): e is EmailEvent => !!e)
  let filtered = events
  if (filters?.type) filtered = filtered.filter((e) => e.type === filters.type)
  if (filters?.since) {
    filtered = filtered.filter((e) => new Date(e.occurredAt) >= new Date(filters.since!))
  }
  // Newest first for live-feed UI.
  filtered.sort((a, b) => (b.occurredAt > a.occurredAt ? 1 : -1))
  if (filters?.limit) filtered = filtered.slice(0, filters.limit)
  return filtered
}
