import { NextResponse } from "next/server"
import { requireGtmAuth } from "@/lib/gtm/content-types"
import { launchBrowser } from "@/lib/gtm/render-png"

export const runtime = "nodejs"
export const maxDuration = 60

const FILENAME_RE = /^[a-zA-Z0-9_-]{1,80}$/
const MAX_HTML_BYTES = 2_000_000
const MIN_IN = 0.5
const MAX_IN = 24
const MIN_DPI = 72
const MAX_DPI = 600

type CollateralFormat = "pdf" | "jpg"

interface CollateralRequest {
  format: CollateralFormat
  widthIn: number
  heightIn: number
  dpi?: number
  html: string
  filename: string
}

/**
 * POST /api/gtm/render-collateral
 *
 * Generic "rasterize this HTML to a file at exact physical size" endpoint.
 * The client owns all markup (fonts, colors, layout); this route just
 * opens headless Chromium and returns either:
 *   - pdf: page.pdf({ width, height, printBackground: true })
 *   - jpg: viewport at widthIn*96 CSS px, deviceScaleFactor = dpi/96,
 *          screenshot clipped so the output is exactly widthIn*dpi
 *          by heightIn*dpi pixels.
 *
 * Multi-page PDFs fall out naturally when the HTML contains multiple
 * full-page blocks separated by `page-break-after: always` (e.g. the
 * business card = 2 pages, front + back).
 */
export async function POST(request: Request) {
  if (!(await requireGtmAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: CollateralRequest
  try {
    body = (await request.json()) as CollateralRequest
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const { format, widthIn, heightIn, dpi, html, filename } = body

  if (format !== "pdf" && format !== "jpg") {
    return NextResponse.json({ error: "format must be 'pdf' or 'jpg'" }, { status: 400 })
  }
  if (typeof widthIn !== "number" || widthIn < MIN_IN || widthIn > MAX_IN) {
    return NextResponse.json({ error: `widthIn must be ${MIN_IN}-${MAX_IN}` }, { status: 400 })
  }
  if (typeof heightIn !== "number" || heightIn < MIN_IN || heightIn > MAX_IN) {
    return NextResponse.json({ error: `heightIn must be ${MIN_IN}-${MAX_IN}` }, { status: 400 })
  }
  const resolvedDpi = typeof dpi === "number" ? dpi : 300
  if (resolvedDpi < MIN_DPI || resolvedDpi > MAX_DPI) {
    return NextResponse.json({ error: `dpi must be ${MIN_DPI}-${MAX_DPI}` }, { status: 400 })
  }
  if (typeof html !== "string" || html.length === 0) {
    return NextResponse.json({ error: "html required" }, { status: 400 })
  }
  if (html.length > MAX_HTML_BYTES) {
    return NextResponse.json({ error: `html too large (>${MAX_HTML_BYTES} bytes)` }, { status: 413 })
  }
  if (typeof filename !== "string" || !FILENAME_RE.test(filename)) {
    return NextResponse.json({ error: "filename must match [a-zA-Z0-9_-]{1,80}" }, { status: 400 })
  }

  const cssWidth = Math.round(widthIn * 96)
  const cssHeight = Math.round(heightIn * 96)

  const browser = await launchBrowser()
  try {
    const page = await browser.newPage()

    if (format === "pdf") {
      await page.setViewport({ width: cssWidth, height: cssHeight, deviceScaleFactor: 1 })
      await page.setContent(html, { waitUntil: "networkidle0", timeout: 30_000 })
      const buf = await page.pdf({
        width: `${widthIn}in`,
        height: `${heightIn}in`,
        printBackground: true,
        margin: { top: "0", right: "0", bottom: "0", left: "0" },
        preferCSSPageSize: false,
      })
      const bytes = Buffer.from(buf as Uint8Array)
      return new NextResponse(bytes as unknown as BodyInit, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${filename}.pdf"`,
          "Content-Length": String(bytes.byteLength),
          "Cache-Control": "private, no-cache",
        },
      })
    }

    // jpg
    const deviceScaleFactor = resolvedDpi / 96
    await page.setViewport({ width: cssWidth, height: cssHeight, deviceScaleFactor })
    await page.setContent(html, { waitUntil: "networkidle0", timeout: 30_000 })
    const buf = await page.screenshot({
      type: "jpeg",
      quality: 92,
      omitBackground: false,
      clip: { x: 0, y: 0, width: cssWidth, height: cssHeight },
    })
    const bytes = Buffer.from(buf as Uint8Array)
    return new NextResponse(bytes as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg",
        "Content-Disposition": `attachment; filename="${filename}.jpg"`,
        "Content-Length": String(bytes.byteLength),
        "Cache-Control": "private, no-cache",
      },
    })
  } catch (e) {
    console.error("[render-collateral] failed", e)
    const msg = e instanceof Error ? e.message : "Render failed"
    return NextResponse.json({ error: msg }, { status: 500 })
  } finally {
    await browser.close().catch(() => { /* ignore */ })
  }
}
