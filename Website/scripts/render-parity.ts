/**
 * One-shot parity check. `npx tsx scripts/render-parity.ts baseline` writes
 * PNGs to .parity/baseline; `npx tsx scripts/render-parity.ts compare` renders
 * again (no media) and compares byte-for-byte, then renders each with a photo
 * at 60% into .parity/with-bg for eyeballing. Never starts a dev server.
 */
import fs from "fs"
import path from "path"
import { findTemplate, loadTemplateHtml, renderTemplate } from "../src/lib/gtm/templates/render"
import { paletteFor } from "../src/lib/gtm/pillar-palettes"
import { renderHtmlToPng } from "../src/lib/gtm/render-png"

const FAMILIES = ["bold-stat-1x1", "headline-quote-11", "wide-banner-11", "rox-report-11", "solution-feature-11"]
const OUT = path.join(process.cwd(), ".parity")
const PIXEL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg=="

async function render(id: string, withBg: boolean): Promise<Buffer> {
  const m = findTemplate("social-post", id)
  const html = await loadTemplateHtml("social-post", id)
  if (!m || !html) throw new Error(`missing template ${id}`)
  const rendered = renderTemplate(html, m.sampleData, paletteFor("trade-shows"), withBg ? { bgImage: PIXEL, bgOpacity: 60 } : undefined)
  return renderHtmlToPng(rendered)
}

async function main() {
  const mode = process.argv[2]
  if (mode !== "baseline" && mode !== "compare") throw new Error("usage: baseline | compare")
  const dir = path.join(OUT, mode === "baseline" ? "baseline" : "after")
  fs.mkdirSync(dir, { recursive: true })
  let mismatches = 0
  for (const id of FAMILIES) {
    const png = await render(id, false)
    fs.writeFileSync(path.join(dir, `${id}.png`), png)
    if (mode === "compare") {
      const base = fs.readFileSync(path.join(OUT, "baseline", `${id}.png`))
      const same = base.equals(png)
      console.log(`${same ? "SAME   " : "DIFFERS"} ${id}`)
      if (!same) mismatches++
      fs.mkdirSync(path.join(OUT, "with-bg"), { recursive: true })
      const withBg = await render(id, true)
      fs.writeFileSync(path.join(OUT, "with-bg", `${id}.png`), withBg)
      if (withBg.equals(png)) throw new Error(`${id}: with-bg render is identical to the no-bg render — the photo layer is not painting`)
    } else {
      console.log(`wrote ${id}`)
    }
  }
  if (mode === "compare") console.log(mismatches === 0 ? "PARITY OK — now open .parity/with-bg/*.png: the 60% red wash must sit UNDER all text, logos, and CTAs" : `PARITY: ${mismatches} differ — open .parity/baseline vs .parity/after and confirm visually identical (webfont timing can shift bytes)`)
}
main().catch((e) => { console.error(e); process.exit(1) })
