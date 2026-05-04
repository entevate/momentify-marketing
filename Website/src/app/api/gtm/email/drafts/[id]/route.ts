import { NextResponse } from "next/server"
import { requireGtmAuth } from "@/lib/gtm/content-types"
import { deleteDraft, getDraft, saveDraft } from "@/lib/gtm/email-store"
import { sanitizeEmailHtml } from "@/lib/gtm/email-parser"

/** Per-draft GET / PATCH / DELETE. Auth-gated. */

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await requireGtmAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await ctx.params
  const draft = await getDraft(id)
  if (!draft) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ draft })
}

export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await requireGtmAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await ctx.params
  const existing = await getDraft(id)
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })
  const patch = await request.json().catch(() => ({}))
  const merged = {
    ...existing,
    ...patch,
    id: existing.id, // never overwrite id
    bodyHtml: patch.bodyHtml !== undefined ? sanitizeEmailHtml(patch.bodyHtml) : existing.bodyHtml,
  }
  const saved = await saveDraft(merged)
  return NextResponse.json({ draft: saved })
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await requireGtmAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await ctx.params
  await deleteDraft(id)
  return NextResponse.json({ success: true })
}
