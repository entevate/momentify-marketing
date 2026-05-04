import { NextResponse } from "next/server"
import { requireGtmAuth } from "@/lib/gtm/content-types"
import { removeContact } from "@/lib/email/resend-audiences"

/** DELETE /api/gtm/email/audiences/[id]/contacts/[cid] */
export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string; cid: string }> }) {
  if (!(await requireGtmAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id, cid } = await ctx.params
  try {
    await removeContact(id, cid)
    return NextResponse.json({ success: true })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to remove contact"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
