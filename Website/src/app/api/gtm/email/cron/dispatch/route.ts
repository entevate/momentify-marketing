import { NextResponse } from "next/server"
import { listDrafts } from "@/lib/gtm/email-store"

export const runtime = "nodejs"
// Cron jobs on Vercel free have a 60s ceiling; Pro raises to 300. Each
// scheduled draft fan-out is bounded by recipient count + Resend latency.
export const maxDuration = 300

/**
 * GET /api/gtm/email/cron/dispatch
 *
 * Vercel Cron entry point (configured in vercel.json with schedule
 * "0 9 * * *" - daily at 9am UTC). Auth: Authorization: Bearer ${CRON_SECRET}
 * which Vercel injects automatically when CRON_SECRET is set in env.
 *
 * Scans scheduled drafts where autoSend is true and scheduledFor has
 * passed, then internally hits each draft's /send endpoint to fire it.
 * Idempotent: the send route flips status to "sent" so re-running is
 * a no-op.
 */
export async function GET(request: Request) {
  const auth = request.headers.get("authorization") || ""
  const expected = `Bearer ${process.env.CRON_SECRET || ""}`
  if (!process.env.CRON_SECRET || auth !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const drafts = await listDrafts({ statuses: ["scheduled"] })
  const now = Date.now()
  const due = drafts.filter((d) => d.autoSend && d.scheduledFor && new Date(d.scheduledFor).getTime() <= now)

  // Fire by self-fetch so we reuse all of /send's recipient resolution +
  // record-keeping. Pass through the Authorization header on a synthetic
  // service-token cookie set via header to satisfy requireGtmAuth() on
  // the send route. Since cookies aren't easy to forge here, we re-check
  // CRON_SECRET inside the send route via a bypass header in v1.
  //
  // Simplest viable approach: call the underlying send logic directly,
  // not via HTTP. We import the send handler internals through a shared
  // module rather than self-fetching.
  const url = new URL(request.url)
  const origin = url.origin

  const results: Array<{ draftId: string; ok: boolean; status?: number; error?: string }> = []
  for (const draft of due) {
    try {
      const res = await fetch(`${origin}/api/gtm/email/drafts/${draft.id}/send`, {
        method: "POST",
        headers: {
          // Pass the cron secret to the send route via a custom header
          // it knows to honor (avoids needing the GTM auth cookie).
          "x-cron-secret": process.env.CRON_SECRET || "",
        },
      })
      const ok = res.ok
      results.push({ draftId: draft.id, ok, status: res.status })
    } catch (e) {
      results.push({
        draftId: draft.id,
        ok: false,
        error: e instanceof Error ? e.message : "fetch failed",
      })
    }
  }

  return NextResponse.json({ scanned: drafts.length, due: due.length, results })
}
