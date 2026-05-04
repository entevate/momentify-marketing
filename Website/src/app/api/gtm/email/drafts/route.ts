import { NextResponse } from "next/server"
import { requireGtmAuth } from "@/lib/gtm/content-types"
import { listDrafts, newId, saveDraft } from "@/lib/gtm/email-store"
import { sanitizeEmailHtml, parseColdEmailSequence, plainTextToHtml } from "@/lib/gtm/email-parser"
import type { EmailDraft, EmailRecipient, EmailStatus } from "@/lib/gtm/email-types"
import { kv } from "@/lib/gtm/kv-store"
import { KV, type ContentItem } from "@/lib/gtm/content-types"

/**
 * GET /api/gtm/email/drafts
 *   ?solution=trade-shows         (filter by pillar)
 *   ?statuses=draft,scheduled     (comma-separated EmailStatus list)
 *   ?since=2026-04-01T00:00:00Z   (only drafts updated since this ISO)
 *
 * POST /api/gtm/email/drafts
 *   Body: { ...partial EmailDraft fields, libraryItemId?, libraryTouchIndex? }
 *   When libraryItemId is provided and a Library cold-emails brief exists,
 *   the response seeds subject/body/solution from the parsed touch.
 */
export async function GET(request: Request) {
  if (!(await requireGtmAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { searchParams } = new URL(request.url)
  const solution = searchParams.get("solution") || undefined
  const statusesParam = searchParams.get("statuses") || undefined
  const since = searchParams.get("since") || undefined
  const statuses = statusesParam
    ? (statusesParam.split(",").filter(Boolean) as EmailStatus[])
    : undefined
  const drafts = await listDrafts({ solution, statuses, since })
  drafts.sort((a, b) => (b.updatedAt > a.updatedAt ? 1 : -1))
  return NextResponse.json({ drafts })
}

export async function POST(request: Request) {
  if (!(await requireGtmAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const body = await request.json().catch(() => ({}))
    const now = new Date().toISOString()

    // Idempotency: if the caller is seeding from a Library item AND a
    // draft already exists for the same (libraryItemId, touchIndex)
    // pair in editable status (draft / scheduled), return that draft
    // instead of creating a duplicate.
    //
    // This bulletproofs the "Send via Email" entry-point against React
    // effect double-fires (Strict Mode, Suspense re-mounts, browser
    // back-nav) where the client may POST the same seed twice before
    // the URL clears.
    if (body.libraryItemId) {
      const touchIndex = Number.isFinite(body.libraryTouchIndex) ? Number(body.libraryTouchIndex) : 0
      const existing = await listDrafts({ statuses: ["draft", "scheduled"] })
      const match = existing.find(
        (d) =>
          d.libraryItemId === body.libraryItemId &&
          (d.libraryTouchIndex ?? 0) === touchIndex,
      )
      if (match) {
        return NextResponse.json({ draft: match, deduped: true })
      }
    }

    // Seed defaults from a Library cold-emails item when provided. This is
    // the "Send via Email" entry-point from ContentLibrary.
    let seeded: { subject?: string; bodyHtml?: string; solution?: string; motion?: string } = {}
    if (body.libraryItemId) {
      const item = await kv.get<ContentItem>(KV.content(body.libraryItemId))
      if (item && item.contentType === "cold-emails") {
        const touches = parseColdEmailSequence(item.content)
        const touchIndex = Number.isFinite(body.libraryTouchIndex) ? Number(body.libraryTouchIndex) : 0
        const touch = touches[touchIndex] ?? touches[0]
        if (touch) {
          seeded = {
            subject: touch.subject,
            bodyHtml: plainTextToHtml(touch.body),
            solution: item.solution,
            motion: item.motion,
          }
        }
      }
    }

    const draft: EmailDraft = {
      id: body.id ?? newId(),
      subject: (body.subject ?? seeded.subject ?? "").trim(),
      bodyHtml: sanitizeEmailHtml(body.bodyHtml ?? seeded.bodyHtml ?? ""),
      rawHtmlMode: !!body.rawHtmlMode,
      recipients: Array.isArray(body.recipients) ? (body.recipients as EmailRecipient[]) : [],
      fromEmail: body.fromEmail || undefined,
      replyTo: body.replyTo || undefined,
      libraryItemId: body.libraryItemId || undefined,
      libraryTouchIndex: Number.isFinite(body.libraryTouchIndex) ? Number(body.libraryTouchIndex) : undefined,
      status: "draft",
      autoSend: !!body.autoSend,
      solution: body.solution ?? seeded.solution,
      motion: body.motion ?? seeded.motion,
      createdAt: now,
      updatedAt: now,
    }
    const saved = await saveDraft(draft)
    return NextResponse.json({ draft: saved })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to create draft"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
