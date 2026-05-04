import { NextResponse } from "next/server"
import { requireGtmAuth } from "@/lib/gtm/content-types"
import { createContact } from "@/lib/email/resend-audiences"

/**
 * POST /api/gtm/email/audiences/[id]/contacts/import
 *
 * Body: { contacts: [{ email, firstName?, lastName? }, ...] }
 *
 * Bulk-creates contacts in a Resend audience. Resend's contacts API has
 * no native bulk endpoint, so we fan out sequentially - same pattern as
 * sendBatch in resend-adapter.ts. Per-contact failures (duplicate email,
 * invalid format) are captured but don't abort the whole import.
 *
 * Returns: { added, skipped, failed: [{email, error}] }
 *
 * Caller (AudiencesTab) parses CSV client-side and POSTs the array;
 * the server is provider-agnostic about file format.
 */
export async function POST(request: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await requireGtmAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { id: audienceId } = await ctx.params

  let body: { contacts?: Array<{ email?: string; firstName?: string; lastName?: string }> }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }
  if (!body.contacts || !Array.isArray(body.contacts)) {
    return NextResponse.json({ error: "contacts array is required" }, { status: 400 })
  }
  if (body.contacts.length === 0) {
    return NextResponse.json({ error: "contacts array is empty" }, { status: 400 })
  }
  if (body.contacts.length > 1000) {
    return NextResponse.json({ error: "Max 1000 contacts per import" }, { status: 400 })
  }

  let added = 0
  let skipped = 0
  const failed: Array<{ email: string; error: string }> = []
  // Dedupe within the import payload (case-insensitive); a CSV often has
  // accidental duplicates and we'd rather skip than waste a Resend call.
  const seen = new Set<string>()

  for (const raw of body.contacts) {
    const email = (raw.email || "").trim().toLowerCase()
    if (!/.+@.+\..+/.test(email)) {
      failed.push({ email: email || "(blank)", error: "Invalid email format" })
      continue
    }
    if (seen.has(email)) {
      skipped++
      continue
    }
    seen.add(email)
    try {
      await createContact(audienceId, email, raw.firstName?.trim() || undefined, raw.lastName?.trim() || undefined)
      added++
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error"
      // Resend returns a "already exists" style message for duplicates;
      // count those as skipped rather than failed.
      if (/already exists|duplicate/i.test(msg)) {
        skipped++
      } else {
        failed.push({ email, error: msg })
      }
    }
  }

  return NextResponse.json({
    added,
    skipped,
    failed,
    total: body.contacts.length,
  })
}
