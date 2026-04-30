import { NextResponse } from "next/server"
import { isValidAssetParam } from "@/lib/gtm/asset-helpers"
import { resolveAssetUrl } from "@/lib/gtm/blob-url"
import { requireGtmAuth } from "@/lib/gtm/content-types"
import { renderHtmlToPng } from "@/lib/gtm/render-png"

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

  let png: Buffer
  try {
    png = await renderHtmlToPng(html)
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
