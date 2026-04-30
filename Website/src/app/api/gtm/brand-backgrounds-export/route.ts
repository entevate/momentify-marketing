import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"
import JSZip from "jszip"
import { requireGtmAuth } from "@/lib/gtm/content-types"
import { renderSizedHtmlBatch } from "@/lib/gtm/render-png"

// 25 backgrounds × 3 aspects = 75 PNGs. Sequential renders at ~1-2s each.
export const runtime = "nodejs"
export const maxDuration = 300

const ASPECTS = [
  { id: "1x1", width: 1080, height: 1080 },
  { id: "3x4", width: 1080, height: 1440 },
  { id: "16x9", width: 1920, height: 1080 },
] as const

const BG_IDS = [
  // Main brand
  "main-minimal", "main-light", "main-midnight", "main-frost", "main-arc", "main-grid",
  // Trade Shows / Violet
  "violet-minimal", "violet-light", "violet-diamonds", "violet-bracket",
  // Recruiting / Teal
  "teal-minimal", "teal-light", "teal-dots", "teal-lines",
  // Field Sales / Amber
  "amber-minimal", "amber-light", "amber-dots", "amber-crosses",
  // Facilities / Indigo
  "indigo-minimal", "indigo-light", "indigo-arc", "indigo-bracket",
  // Events & Venues / Crimson
  "crimson-minimal", "crimson-light", "crimson-lines", "crimson-crosses",
] as const

/**
 * Shared CSS for every standalone background doc. Mirrors the relevant
 * rules from /brand/backgrounds.html so the rendered PNG is pixel-faithful
 * to what the brand reference page shows. The .bg-preview itself is
 * forced to fill the viewport (no aspect-ratio constraint - the viewport
 * dimensions on the puppeteer page set the aspect).
 */
const SHARED_CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body {
    width: 100%; height: 100%;
    margin: 0; padding: 0;
    background: #06060f;
    overflow: hidden;
  }
  .bg-preview {
    position: relative;
    width: 100%; height: 100%;
    overflow: hidden;
  }
  /* Gradients (verbatim from /brand/backgrounds.html) */
  .grad-depth        { background: linear-gradient(135deg, #7C316D 0%, #0B0B3C 55%, #1A2E73 100%); }
  .grad-midnight     { background: #07081F; }
  .grad-white        { background: #FFFFFF; }
  .grad-frost        { background: linear-gradient(145deg, #EEF2FF 0%, #F5F7FF 100%); }
  .grad-violet       { background: linear-gradient(135deg, #2D0770 0%, #4A0FA8 55%, #9B5FE8 100%); }
  .grad-violet-light { background: linear-gradient(145deg, #F8F4FF 0%, #EDE6FF 100%); }
  .grad-teal-sol     { background: linear-gradient(135deg, #040E28 0%, #1A8A76 55%, #5FD9C2 100%); }
  .grad-teal-light   { background: linear-gradient(145deg, #E8FDF8 0%, #F0FFFC 100%); }
  .grad-amber        { background: linear-gradient(135deg, #1A0A00 0%, #A86B00 55%, #F2B33D 100%); }
  .grad-amber-light  { background: linear-gradient(145deg, #FFF9E8 0%, #FFFCF0 100%); }
  .grad-indigo       { background: linear-gradient(135deg, #0D0820 0%, #3A2073 55%, #5B4499 100%); }
  .grad-indigo-light { background: linear-gradient(145deg, #EEF0FF 0%, #F4F5FF 100%); }
  .grad-crimson      { background: linear-gradient(135deg, #1A0400 0%, #8F200A 55%, #F25E3D 100%); }
  .grad-crimson-light { background: linear-gradient(145deg, #FFF2EE 0%, #FFF7F5 100%); }
  /* Accent bars + decorative SVGs */
  .bg-color-bar { position: absolute; top: 0; left: 0; right: 0; height: 6px; z-index: 2; }
  .light-accent-bar {
    position: absolute; top: 0; left: 0; right: 0; height: 4px;
    background: linear-gradient(to right, #0CF4DF, #1F3395);
    z-index: 2;
  }
  .bg-geo {
    position: absolute;
    bottom: 0; right: 0;
    width: 52%; height: auto;
    pointer-events: none; z-index: 0;
  }
`

/**
 * GET /api/gtm/brand-backgrounds-export
 *
 * Renders every background defined on /brand/backgrounds.html at 1:1, 3:4,
 * and 16:9 aspect ratios as PNGs and returns them as a zip.
 *
 * Implementation: parses the source page once at request time, extracts
 * the inner markup of each known .bg-preview element (the SVG overlays
 * and accent bars), wraps each in a standalone HTML doc, and renders
 * the doc via headless Chromium at the target viewport dimensions.
 *
 * Output: 25 backgrounds × 3 aspects = 75 PNGs, organized as:
 *   1x1/<bg-name>.png    (1080×1080)
 *   3x4/<bg-name>.png    (1080×1440)
 *   16x9/<bg-name>.png   (1920×1080)
 */
export async function GET() {
  if (!(await requireGtmAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Read /brand/backgrounds.html once and extract each bg-preview block.
  const sourcePath = path.join(process.cwd(), "public", "brand", "backgrounds.html")
  let source: string
  try {
    source = await fs.readFile(sourcePath, "utf-8")
  } catch (e) {
    console.error("[brand-backgrounds-export] could not read source", e)
    return NextResponse.json(
      { error: "Could not read /public/brand/backgrounds.html" },
      { status: 500 }
    )
  }

  const blocks: Map<string, string> = new Map()
  for (const id of BG_IDS) {
    const block = extractBgPreview(source, id)
    if (!block) {
      console.warn(`[brand-backgrounds-export] could not extract #${id}`)
      continue
    }
    blocks.set(id, block)
  }
  if (blocks.size === 0) {
    return NextResponse.json({ error: "No backgrounds extracted from source" }, { status: 500 })
  }

  // Build a render job per (bg, aspect).
  const jobs: Array<{ html: string; width: number; height: number; filename: string }> = []
  for (const aspect of ASPECTS) {
    for (const id of BG_IDS) {
      const block = blocks.get(id)
      if (!block) continue
      jobs.push({
        html: buildDoc(block),
        width: aspect.width,
        height: aspect.height,
        filename: `${aspect.id}/${id}.png`,
      })
    }
  }

  let pngs: Buffer[]
  try {
    pngs = await renderSizedHtmlBatch(
      jobs.map((j) => ({ html: j.html, width: j.width, height: j.height }))
    )
  } catch (e) {
    console.error("[brand-backgrounds-export] render failed", e)
    const msg = e instanceof Error ? e.message : "Render failed"
    return NextResponse.json({ error: msg }, { status: 500 })
  }

  const zip = new JSZip()
  pngs.forEach((buf, i) => {
    zip.file(jobs[i].filename, buf)
  })

  const zipBlob = await zip.generateAsync({ type: "uint8array" })

  return new NextResponse(zipBlob as unknown as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="momentify-brand-backgrounds.zip"`,
      "Content-Length": String(zipBlob.byteLength),
      "Cache-Control": "private, no-cache",
    },
  })
}

/**
 * Find the `<div class="bg-preview ..." id="<id>">...</div>` block in
 * the source HTML and return its outer HTML. Uses a balanced-div counter
 * because some bg-previews contain nested <div>s (e.g. .bg-color-bar,
 * .light-accent-bar). Returns null if the id isn't found.
 */
function extractBgPreview(source: string, id: string): string | null {
  // Match the opening tag of the target bg-preview.
  const openRe = new RegExp(
    `<div\\s+class="bg-preview[^"]*"\\s+id="${escapeRegex(id)}"[^>]*>`,
    "i"
  )
  const openMatch = openRe.exec(source)
  if (!openMatch) return null

  const start = openMatch.index
  let i = start + openMatch[0].length
  let depth = 1
  // Walk through the source counting <div> opens / closes until depth = 0.
  while (i < source.length && depth > 0) {
    const nextOpen = source.indexOf("<div", i)
    const nextClose = source.indexOf("</div>", i)
    if (nextClose === -1) return null
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++
      i = nextOpen + 4
    } else {
      depth--
      i = nextClose + 6
    }
  }
  if (depth !== 0) return null
  return source.slice(start, i)
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/**
 * Wrap an extracted bg-preview block in a standalone HTML doc with the
 * shared CSS. The viewport dimensions on the headless page determine
 * aspect ratio; the .bg-preview fills the viewport.
 */
function buildDoc(bgPreviewBlock: string): string {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"/><style>${SHARED_CSS}</style></head>
<body>${bgPreviewBlock}</body></html>`
}
