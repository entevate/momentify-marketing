import { NextResponse } from "next/server"
import { requireGtmAuth } from "@/lib/gtm/content-types"
import { createAudience, listAudiences } from "@/lib/email/resend-audiences"

/**
 * GET  /api/gtm/email/audiences          - list all Resend audiences
 * POST /api/gtm/email/audiences { name } - create a new audience
 *
 * Auth-gated. RESEND_API_KEY never leaves the server - the client only
 * ever sees audience metadata returned through this proxy.
 */
export async function GET() {
  if (!(await requireGtmAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const audiences = await listAudiences()
    return NextResponse.json({ audiences })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to list audiences"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function POST(request: Request) {
  if (!(await requireGtmAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const { name } = await request.json().catch(() => ({}))
    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "name is required" }, { status: 400 })
    }
    const audience = await createAudience(name.trim())
    return NextResponse.json({ audience })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to create audience"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
