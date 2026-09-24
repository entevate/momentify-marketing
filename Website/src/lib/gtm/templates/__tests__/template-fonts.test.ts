/**
 * Rich-text slots emit <em> and <u>. A template that loads Inter with a
 * weight-only axis has no italic face, so Chromium fakes one by shearing the
 * upright glyphs. Keep every template on the two-axis link, and keep the
 * shared underline rule that makes <u> legible at display sizes.
 *
 * scripts/add-italic-axis.mjs applies both, idempotently; this is the guard
 * that a newly added template does not quietly skip them.
 */
import fs from "fs"
import path from "path"

const ROOT = path.join(process.cwd(), "src", "lib", "gtm", "templates", "social-post")
const dirs = fs.readdirSync(ROOT, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name)

describe("social-post template fonts", () => {
  it("ships the 21 templates the italic-axis script expects", () => {
    // Keep in lockstep with scripts/add-italic-axis.mjs and scripts/add-slot-tags.mjs.
    expect(dirs).toHaveLength(21)
  })

  it.each(dirs)("%s loads Inter with an italic axis and styles <u>", (dir) => {
    const src = fs.readFileSync(path.join(ROOT, dir, "template.html"), "utf-8")
    const link = src.match(/family=Inter:[^&"']+/)
    expect(link).not.toBeNull()
    const axis = link![0]
    expect(axis).toContain("ital,wght@")
    // Every weight must be present upright AND italic.
    const weights = [...axis.matchAll(/0,(\d+)/g)].map((m) => m[1])
    expect(weights.length).toBeGreaterThan(0)
    for (const w of weights) expect(axis).toContain(`1,${w}`)
    expect(src).toContain("text-decoration-thickness")
    expect(src).toContain("text-underline-offset")
  })
})
