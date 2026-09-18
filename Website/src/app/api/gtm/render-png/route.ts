import { NextResponse } from "next/server"
import { kv } from "@/lib/gtm/kv-store"
import { assetKvKey, isValidAssetParam } from "@/lib/gtm/asset-helpers"
import { resolveAssetUrl } from "@/lib/gtm/blob-url"
import { requireGtmAuth } from "@/lib/gtm/content-types"
import { renderHtmlToPng, dimensionsForAspect } from "@/lib/gtm/render-png"
import { findTemplate } from "@/lib/gtm/templates/render"

// Force the Node.js runtime - puppeteer-core + @sparticuz/chromium are
// not compatible with the Edge runtime.
export const runtime = "nodejs"
// PNG render takes ~3-6s; allow up to 60s on Vercel before timeout.
export const maxDuration = 60

/**
 * GET /api/gtm/render-png?solution=<pillar>&assetType=<type>&itemId=<id>
 *
 * Streams a single PNG of the rendered template HTML at 1080x1080.
 * Used by the AssetPanel Download action for social-post (and any
 * other single-graphic asset stored under a templated namespace).
 *
 * The HTML is fetched from the cached blob URL (assetKvKey lookup), then
 * rendered via headless Chromium (Sparticuz on Vercel, system Chrome on
 * dev). Carousels use /api/gtm/carousel-download for a zip of 6 PNGs.
 */
export async function GET(request: Request) {
  if (!(await requireGtmAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const url = new URL(request.url)
  const solution = url.searchParams.get("solution") || ""
  const assetType = url.searchParams.get("assetType") || ""
  const itemId = url.searchParams.get("itemId") || ""

  if (!solution || !assetType || !itemId) {
    return NextResponse.json(
      { error: "Missing solution, assetType, or itemId" },
      { status: 400 }
    )
  }
  for (const v of [solution, assetType, itemId]) {
    if (!isValidAssetParam(v)) {
      return NextResponse.json({ error: "Invalid parameter format" }, { status: 400 })
    }
  }

  const blobUrl = await resolveAssetUrl(solution, assetType, itemId)
  if (!blobUrl) {
    return NextResponse.json(
      { error: "Asset not found. Generate the graphic first." },
      { status: 404 }
    )
  }

  // Fetch the rendered HTML from blob (or local fs path in dev).
  const resolvedUrl = blobUrl.startsWith("http") ? blobUrl : `${url.origin}${blobUrl}`
  let html: string
  try {
    const r = await fetch(resolvedUrl)
    if (!r.ok) throw new Error(`fetch ${resolvedUrl} -> ${r.status}`)
    html = await r.text()
  } catch (e) {
    console.error("[render-png] fetch failed", e)
    return NextResponse.json({ error: "Could not fetch rendered HTML" }, { status: 502 })
  }

  // Look up which template was used so we can render at its native
  // aspect ratio. fill-template caches the templateId under baseKey:template
  // whenever it fills. Missing entry (legacy assets or in-flight cache miss)
  // falls back to 1080x1080 — the historical behavior, matching 1:1 templates.
  let dims = { width: 1080, height: 1080 }
  try {
    const tplId = await kv.get<string>(`${assetKvKey(solution, assetType, itemId)}:template`)
    if (tplId) {
      const manifest = findTemplate(assetType, tplId)
      if (manifest?.aspectRatio) dims = dimensionsForAspect(manifest.aspectRatio)
    }
  } catch {
    // KV lookup is best-effort; fall through to defaults.
  }

  let png: Buffer
  try {
    png = await renderHtmlToPng(html, dims)
  } catch (e) {
    console.error("[render-png] render failed", e)
    const msg = e instanceof Error ? e.message : "Render failed"
    return NextResponse.json({ error: msg }, { status: 500 })
  }

  return new NextResponse(png as unknown as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename="momentify-${solution}-${assetType}-${itemId}.png"`,
      "Content-Length": String(png.byteLength),
      "Cache-Control": "private, no-cache",
    },
  })
}
