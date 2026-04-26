import { NextResponse } from "next/server"
import { findTemplate, loadTemplateHtml, renderTemplate } from "@/lib/gtm/templates/render"
import { paletteFor, isPillarId } from "@/lib/gtm/pillar-palettes"

/**
 * GET /api/gtm/template-preview?templateId=<id>&pillar=<trade-shows|recruiting|field-sales|facilities|events-venues>[&assetType=social-post][&data=<url-encoded-json>]
 *
 * Renders a template HTML with slot values filled and pillar palette
 * injected. Used by the local /gtm/templates gallery for iteration - not
 * a user-facing surface (yet).
 *
 * Defaults:
 *   - assetType: "social-post"
 *   - pillar:    "events-venues"
 *   - slots:     template.sampleData
 *
 * If `data` is provided, it must be a URL-encoded JSON object whose keys
 * match the template's slot keys. Any missing keys fall back to the
 * manifest's sampleData.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const templateId = searchParams.get("templateId") ?? ""
    const assetType = searchParams.get("assetType") || "social-post"
    const pillarParam = searchParams.get("pillar") || "events-venues"
    const dataParam = searchParams.get("data")

    if (!templateId) {
      return NextResponse.json({ error: "Missing templateId" }, { status: 400 })
    }
    if (!/^[a-z0-9_-]+$/.test(templateId) || !/^[a-z0-9_-]+$/.test(assetType)) {
      return NextResponse.json({ error: "Invalid templateId or assetType" }, { status: 400 })
    }
    const pillar = isPillarId(pillarParam) ? pillarParam : "events-venues"

    const manifest = findTemplate(assetType, templateId)
    if (!manifest) {
      return NextResponse.json({ error: `Template not found: ${assetType}/${templateId}` }, { status: 404 })
    }

    const html = await loadTemplateHtml(assetType, templateId)
    if (!html) {
      return NextResponse.json({ error: "Template HTML missing on disk" }, { status: 500 })
    }

    // Merge sampleData with any provided override data
    let slots: Record<string, string> = { ...manifest.sampleData }
    if (dataParam) {
      try {
        const override = JSON.parse(dataParam) as Record<string, unknown>
        for (const [k, v] of Object.entries(override)) {
          if (typeof v === "string") slots[k] = v
        }
      } catch {
        return NextResponse.json({ error: "Invalid data JSON" }, { status: 400 })
      }
    }

    const rendered = renderTemplate(html, slots, paletteFor(pillar))

    return new Response(rendered, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": "inline",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    })
  } catch (err) {
    console.error("[template-preview] error", err)
    return NextResponse.json({ error: "Failed to render template" }, { status: 500 })
  }
}
