import { NextResponse } from "next/server"
import JSZip from "jszip"
import { pillarPalettes, type PillarId } from "@/lib/gtm/pillar-palettes"
import { requireGtmAuth } from "@/lib/gtm/content-types"
import { renderSizedHtmlBatch } from "@/lib/gtm/render-png"

// PNG rendering needs Node + a longer budget. 5 pillars × 3 aspects = 15
// PNGs at ~2-4s each on Vercel cold-start.
export const runtime = "nodejs"
export const maxDuration = 180

const ASPECTS = [
  { id: "1x1", width: 1080, height: 1080, label: "1:1" },
  { id: "3x4", width: 1080, height: 1440, label: "3:4" },
  { id: "16x9", width: 1920, height: 1080, label: "16:9" },
] as const

const PILLAR_ORDER: PillarId[] = [
  "trade-shows",
  "recruiting",
  "field-sales",
  "facilities",
  "events-venues",
]

/**
 * GET /api/gtm/backgrounds-export
 *
 * Returns a zip of every Momentify pillar background at every supported
 * aspect ratio. The "background" is the same composition the GTM social
 * templates use as their stage:
 *   - hero gradient (`heroGrad`)
 *   - decorative pattern overlay (`decorPattern` × `decorSize`)
 *   - the standard top-to-bottom dark vignette the templates apply via
 *     `.stage::after`
 *
 * No headline / stat / logo content - this is the bare branded canvas.
 *
 * Output: 5 pillars × 3 aspect ratios = 15 PNGs, named:
 *   trade-shows-1x1.png, trade-shows-3x4.png, trade-shows-16x9.png,
 *   recruiting-1x1.png, ... events-venues-16x9.png
 */
export async function GET() {
  if (!(await requireGtmAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Build a render job per (pillar, aspect). The HTML body is just the
  // stage div; the page is sized to the target dimensions via viewport.
  const jobs: Array<{ html: string; width: number; height: number; filename: string }> = []
  for (const pillar of PILLAR_ORDER) {
    const p = pillarPalettes[pillar]
    for (const a of ASPECTS) {
      jobs.push({
        html: buildBackgroundHtml(p),
        width: a.width,
        height: a.height,
        filename: `${pillar}-${a.id}.png`,
      })
    }
  }

  let pngs: Buffer[]
  try {
    pngs = await renderSizedHtmlBatch(
      jobs.map((j) => ({ html: j.html, width: j.width, height: j.height }))
    )
  } catch (e) {
    console.error("[backgrounds-export] render failed", e)
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
      "Content-Disposition": `attachment; filename="momentify-backgrounds.zip"`,
      "Content-Length": String(zipBlob.byteLength),
      "Cache-Control": "private, no-cache",
    },
  })
}

/**
 * Self-contained HTML that paints the pillar background to a viewport-
 * sized stage. The stage CSS mirrors the layering used in the social-post
 * templates (`html, body { width:100%; height:100% }` + a `.stage` that
 * fills, with `::before` for decor and `::after` for the dark vignette).
 */
function buildBackgroundHtml(p: typeof pillarPalettes[PillarId]): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 100%; height: 100%; overflow: hidden; background: #06060f; }
  .stage {
    width: 100%; height: 100%;
    background: ${p.heroGrad};
    position: relative;
    overflow: hidden;
  }
  .stage::before {
    content: "";
    position: absolute; inset: 0;
    background-image: ${p.decorPattern};
    background-size: ${p.decorSize};
    pointer-events: none; z-index: 0;
  }
  .stage::after {
    content: "";
    position: absolute; inset: 0;
    background: linear-gradient(180deg, rgba(7,8,31,0.30) 0%, transparent 45%, rgba(7,8,31,0.55) 100%);
    pointer-events: none; z-index: 0;
  }
</style>
</head>
<body><div class="stage"></div></body>
</html>`
}
