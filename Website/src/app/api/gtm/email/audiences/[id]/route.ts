import { NextResponse } from "next/server"
import { requireGtmAuth } from "@/lib/gtm/content-types"
import { deleteAudience } from "@/lib/email/resend-audiences"

/** DELETE /api/gtm/email/audiences/[id] */
export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await requireGtmAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await ctx.params
  try {
    await deleteAudience(id)
    return NextResponse.json({ success: true })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to delete audience"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
