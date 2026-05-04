import { NextResponse } from "next/server"
import { requireGtmAuth } from "@/lib/gtm/content-types"
import { listSends } from "@/lib/gtm/email-store"

/**
 * GET /api/gtm/email/sends?draftId=&since=
 * Returns EmailSendRecord array, newest first.
 */
export async function GET(request: Request) {
  if (!(await requireGtmAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { searchParams } = new URL(request.url)
  const draftId = searchParams.get("draftId") || undefined
  const since = searchParams.get("since") || undefined
  const sends = await listSends({ draftId, since })
  sends.sort((a, b) => (b.sentAt > a.sentAt ? 1 : -1))
  return NextResponse.json({ sends })
}
