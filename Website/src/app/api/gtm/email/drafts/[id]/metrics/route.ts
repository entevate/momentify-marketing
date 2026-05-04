import { NextResponse } from "next/server"
import { requireGtmAuth } from "@/lib/gtm/content-types"
import { metricsForDraft } from "@/lib/gtm/email-metrics"

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await requireGtmAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await ctx.params
  const metrics = await metricsForDraft(id)
  return NextResponse.json({ metrics })
}
