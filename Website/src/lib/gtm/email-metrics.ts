/**
 * GTM Email Module — metrics aggregation.
 *
 * Pure read-side rollups over the EmailSendRecord + EmailEvent stores.
 * No persistence here — call sites (the Sends tab dashboard, the
 * /api/gtm/email/metrics route) recompute on demand. At our scale this
 * is fine; if event volume grows, switch to incremental counters.
 */

import { listDrafts, listEvents, listSends } from "@/lib/gtm/email-store"
import type {
  EmailAggregateMetrics,
  EmailDraftMetrics,
  EmailStatus,
} from "@/lib/gtm/email-types"

/**
 * Build a metrics roll-up for a single draft. Counts sends from
 * EmailSendRecord and engagement events from EmailEvent. A "delivered"
 * count is necessary because Resend webhooks distinguish accepted-by-
 * SMTP (sent) from final-delivered-to-inbox (delivered) — the difference
 * matters for deliverability rate.
 */
export async function metricsForDraft(draftId: string): Promise<EmailDraftMetrics> {
  const [sends, events] = await Promise.all([
    listSends({ draftId }),
    listEvents({ draftId }),
  ])
  return rollUp(draftId, sends.length, events)
}

/**
 * Aggregate metrics across all drafts, optionally filtered by solution
 * or recency. Used for the Sends-tab top KPI cards and the per-pillar
 * EmailActivityPanel.
 */
export async function aggregateMetrics(opts?: {
  solution?: string
  since?: string
}): Promise<EmailAggregateMetrics> {
  const drafts = await listDrafts({ solution: opts?.solution })

  const allSends = await listSends(opts?.since ? { since: opts.since } : undefined)
  const allEvents = await listEvents(opts?.since ? { since: opts.since } : undefined)

  // Filter only when scoping to a specific solution — solution lives on
  // the draft, so we have to look up via draftIds. Without a solution
  // filter, count ALL sends + events regardless of whether the draft
  // was later deleted; otherwise totals would silently drop after a
  // user cleans up old drafts.
  let sends = allSends
  let events = allEvents.filter((e) => !!e.draftId)
  if (opts?.solution) {
    const draftIds = new Set(drafts.map((d) => d.id))
    sends = allSends.filter((s) => draftIds.has(s.draftId))
    events = events.filter((e) => e.draftId && draftIds.has(e.draftId))
  }

  const base = rollUp("__aggregate__", sends.length, events)
  const byStatus: Record<EmailStatus, number> = {
    draft: 0,
    scheduled: 0,
    sent: 0,
    failed: 0,
  }
  for (const d of drafts) byStatus[d.status]++

  return {
    ...base,
    totalDrafts: drafts.length,
    byStatus,
  }
}

/** Shared count + rate calculator. */
function rollUp(
  draftId: string,
  sentCount: number,
  events: { type: string }[],
): EmailDraftMetrics {
  let delivered = 0
  let opened = 0
  let clicked = 0
  let bounced = 0
  let complained = 0
  for (const e of events) {
    if (e.type === "delivered") delivered++
    else if (e.type === "opened") opened++
    else if (e.type === "clicked") clicked++
    else if (e.type === "bounced") bounced++
    else if (e.type === "complained") complained++
  }
  const deliveryRate = sentCount > 0 ? delivered / sentCount : 0
  // Open + click rates are conventionally calculated against delivered,
  // not sent (so a bounce doesn't artificially deflate engagement rates).
  const openRate = delivered > 0 ? opened / delivered : 0
  const clickRate = delivered > 0 ? clicked / delivered : 0
  const bounceRate = sentCount > 0 ? bounced / sentCount : 0
  return {
    draftId,
    sent: sentCount,
    delivered,
    opened,
    clicked,
    bounced,
    complained,
    deliveryRate,
    openRate,
    clickRate,
    bounceRate,
  }
}
