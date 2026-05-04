import { NextResponse } from "next/server"
import { requireGtmAuth } from "@/lib/gtm/content-types"
import { getDraft, newId, recordSend, saveDraft } from "@/lib/gtm/email-store"
import { applyEmailWrapper } from "@/lib/gtm/email-parser"
import { send as resendSend } from "@/lib/email/resend-adapter"
import { listContacts } from "@/lib/email/resend-audiences"
import { kv } from "@/lib/gtm/kv-store"
import { KV, type CalendarTask } from "@/lib/gtm/content-types"
import type { EmailRecipient, EmailSendRecord } from "@/lib/gtm/email-types"

/**
 * POST /api/gtm/email/drafts/[id]/send
 *
 * Resolves recipients, wraps body in the branded shell (or sends raw),
 * fires Resend send() per recipient, persists one EmailSendRecord per
 * attempt, transitions the draft to "sent", marks any linked
 * CalendarTask completed.
 */
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  // Two valid auth paths:
  //   - Standard GTM cookie (user-initiated Send Now from the UI)
  //   - x-cron-secret header matching CRON_SECRET (cron auto-dispatch)
  const cronHeader = req.headers.get("x-cron-secret") || ""
  const cronOk = !!process.env.CRON_SECRET && cronHeader === process.env.CRON_SECRET
  if (!cronOk && !(await requireGtmAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { id } = await ctx.params
  const draft = await getDraft(id)
  if (!draft) return NextResponse.json({ error: "Draft not found" }, { status: 404 })
  if (draft.status === "sent") {
    return NextResponse.json({ error: "Draft has already been sent" }, { status: 400 })
  }
  if (!draft.subject?.trim()) {
    return NextResponse.json({ error: "Subject is required" }, { status: 400 })
  }
  if (!draft.bodyHtml?.trim()) {
    return NextResponse.json({ error: "Body is empty" }, { status: 400 })
  }
  if (draft.recipients.length === 0) {
    return NextResponse.json({ error: "No recipients" }, { status: 400 })
  }

  // Resolve every recipient kind into a flat list of {to, name?} pairs.
  let resolved: { to: string; name?: string }[]
  try {
    resolved = await resolveRecipients(draft.recipients)
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to resolve recipients"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
  if (resolved.length === 0) {
    return NextResponse.json({ error: "Recipient list resolved to zero addresses" }, { status: 400 })
  }

  // Wrap body once (same HTML for all recipients in v1; per-recipient
  // personalization is a v2 feature).
  const html = applyEmailWrapper(draft.bodyHtml, {
    rawHtmlMode: draft.rawHtmlMode,
    solution: draft.solution,
    ctaText: draft.ctaText,
    ctaHref: draft.ctaHref,
    headerTag: draft.headerTag,
  })

  // Fire sequentially (matches the existing sendBatch helper). Production
  // can switch to Resend's true batch API in v2 if volume warrants.
  let sentCount = 0
  let failedCount = 0
  for (const r of resolved) {
    try {
      const result = await resendSend({
        to: r.to,
        subject: draft.subject,
        html,
        from: draft.fromEmail,
        replyTo: draft.replyTo,
      })
      const record: EmailSendRecord = {
        id: newId(),
        draftId: draft.id,
        to: r.to,
        subject: draft.subject,
        sentAt: new Date().toISOString(),
        resendMessageId: result.id || undefined,
        status: "sent",
      }
      await recordSend(record)
      sentCount++
    } catch (e) {
      const record: EmailSendRecord = {
        id: newId(),
        draftId: draft.id,
        to: r.to,
        subject: draft.subject,
        sentAt: new Date().toISOString(),
        status: "failed",
        errorMessage: e instanceof Error ? e.message : "Unknown error",
      }
      await recordSend(record)
      failedCount++
    }
  }

  // Update draft status. If everyone failed, surface that.
  draft.status = sentCount > 0 ? "sent" : "failed"
  await saveDraft(draft)

  // Mark linked calendar task completed when present.
  if (draft.calendarTaskId) {
    const task = await kv.get<CalendarTask>(KV.calendar(draft.calendarTaskId))
    if (task) {
      task.completed = true
      await kv.set(KV.calendar(task.id), task)
    }
  }

  return NextResponse.json({
    success: true,
    sentCount,
    failedCount,
    total: resolved.length,
  })
}

/**
 * Expand a draft's recipient list into a flat array of addresses.
 * - "raw"      → the email is the address, name is the optional display name
 * - "contact"  → fetched individually from Resend (audienceId + contactId)
 * - "audience" → entire audience expanded via listContacts
 *
 * Unsubscribed contacts are filtered out at this layer (Resend tracks
 * unsubscribe state via webhooks; honoring it here avoids re-sending to
 * recipients who opted out).
 */
async function resolveRecipients(recipients: EmailRecipient[]): Promise<{ to: string; name?: string }[]> {
  const out: { to: string; name?: string }[] = []
  for (const r of recipients) {
    if (r.kind === "raw") {
      out.push({ to: r.email, name: r.name })
    } else if (r.kind === "audience") {
      const contacts = await listContacts(r.audienceId)
      for (const c of contacts) {
        if (c.unsubscribed) continue
        out.push({
          to: c.email,
          name: [c.firstName, c.lastName].filter(Boolean).join(" ") || undefined,
        })
      }
    } else if (r.kind === "contact") {
      // Cheaper than a single get if we ever need bulk; v1 fetches the
      // whole audience and filters client-side, which is the SDK default.
      const contacts = await listContacts(r.audienceId)
      const c = contacts.find((x) => x.id === r.contactId)
      if (c && !c.unsubscribed) {
        out.push({
          to: c.email,
          name: [c.firstName, c.lastName].filter(Boolean).join(" ") || undefined,
        })
      }
    }
  }
  // Dedupe by lowercase email so the same contact in multiple audiences
  // only receives one copy.
  const seen = new Set<string>()
  return out.filter((p) => {
    const key = p.to.toLowerCase().trim()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}
