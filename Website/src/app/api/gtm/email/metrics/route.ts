import { NextResponse } from "next/server"
import { requireGtmAuth } from "@/lib/gtm/content-types"
import { aggregateMetrics } from "@/lib/gtm/email-metrics"

/**
 * GET /api/gtm/email/metrics?solution=&since=
 * Aggregate roll-up across all drafts (optionally scoped by solution
 * and recency). Powers the Sends-tab top KPI cards and the per-pillar
 * EmailActivityPanel.
 */
export async function GET(request: Request) {
  if (!(await requireGtmAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { searchParams } = new URL(request.url)
  const solution = searchParams.get("solution") || undefined
  const since = searchParams.get("since") || undefined
  const metrics = await aggregateMetrics({ solution, since })
  return NextResponse.json({ metrics })
}
