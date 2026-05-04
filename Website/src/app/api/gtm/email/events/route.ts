import { NextResponse } from "next/server"
import { requireGtmAuth } from "@/lib/gtm/content-types"
import { listEvents } from "@/lib/gtm/email-store"

/**
 * GET /api/gtm/email/events?draftId=&type=&since=&limit=50
 * Returns EmailEvent array, newest first. Powers the live event feed
 * in the metrics dashboard.
 */
export async function GET(request: Request) {
  if (!(await requireGtmAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { searchParams } = new URL(request.url)
  const draftId = searchParams.get("draftId") || undefined
  const type = searchParams.get("type") || undefined
  const since = searchParams.get("since") || undefined
  const limitStr = searchParams.get("limit")
  const limit = limitStr ? Math.min(500, Math.max(1, parseInt(limitStr, 10) || 50)) : 50
  const events = await listEvents({ draftId, type, since, limit })
  return NextResponse.json({ events })
}
