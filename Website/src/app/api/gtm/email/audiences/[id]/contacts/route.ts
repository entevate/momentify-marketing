import { NextResponse } from "next/server"
import { requireGtmAuth } from "@/lib/gtm/content-types"
import { createContact, listContacts } from "@/lib/email/resend-audiences"

/**
 * GET  /api/gtm/email/audiences/[id]/contacts
 * POST /api/gtm/email/audiences/[id]/contacts { email, firstName?, lastName? }
 */
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await requireGtmAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await ctx.params
  try {
    const contacts = await listContacts(id)
    return NextResponse.json({ contacts })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to list contacts"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function POST(request: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await requireGtmAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await ctx.params
  try {
    const { email, firstName, lastName, company } = await request.json().catch(() => ({}))
    if (!email || typeof email !== "string" || !/.+@.+\..+/.test(email)) {
      return NextResponse.json({ error: "valid email is required" }, { status: 400 })
    }
    const contact = await createContact(id, email, firstName, lastName, company)
    return NextResponse.json({ contact })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to create contact"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
