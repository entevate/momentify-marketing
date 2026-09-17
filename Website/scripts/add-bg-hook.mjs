/**
 * Adds the background-photo hook to every social-post template. Idempotent:
 * a template that already has a `.bg` layer rule is skipped. Fails loudly if
 * any anchor is missing so a template never ends up half-patched.
 *
 * Root element: the single `<div class="stage"…>` (optionally with an id);
 * templates with no `.stage` root use their single `<div class="card"…>`
 * root instead (wide-banner-11). The hook's CSS selector follows the root.
 *
 * Stacking: the photo is an absolutely-positioned `.bg` layer, so any
 * template with no explicit z-index ladder needs its content lifted above
 * it (`.stage > *:not(.bg) { position: relative; z-index: 1 }`); templates
 * that already run a positive z-index ladder (the dark ones) skip this, since
 * it would push their own layers out of order. The root also needs
 * `position: relative` (or `absolute`) so the photo's `inset: 0` resolves
 * against it rather than the viewport; the hook adds it if missing.
 */
import fs from "fs"
import path from "path"

const ROOT = path.join(process.cwd(), "src/lib/gtm/templates/social-post")
const ROOT_VARS = `    --bg-image:     {{BG_IMAGE}};\n    --bg-opacity:   {{BG_OPACITY}};\n`
const bgRule = (cls) => `  .${cls} .bg {\n    position: absolute; inset: 0;\n    background: var(--bg-image) center / cover no-repeat;\n    opacity: var(--bg-opacity);\n    pointer-events: none; z-index: 0;\n  }\n`
const rootTags = (html, cls) => [...html.matchAll(new RegExp(`<div class="${cls}"(?: id="[a-z0-9-]+")?>`, "g"))].map((m) => m[0])

let patched = 0, skipped = 0
for (const dir of fs.readdirSync(ROOT)) {
  const file = path.join(ROOT, dir, "template.html")
  if (!fs.existsSync(file)) continue
  let html = fs.readFileSync(file, "utf8")
  if (/\.(stage|card) \.bg \{/.test(html)) { skipped++; continue }

  // Pick the root: prefer .stage; fall back to .card only when no .stage exists.
  let cls = "stage"
  let tags = rootTags(html, cls)
  if (tags.length === 0) { cls = "card"; tags = rootTags(html, cls) }
  if (tags.length !== 1) throw new Error(`${dir}: expected exactly one <div class="${cls}"[ id=…]> root, found ${tags.length}`)
  const rootTag = tags[0]

  const rootIdx = html.indexOf(":root {")
  if (rootIdx < 0) throw new Error(`${dir}: no ':root {'`)
  const rootLineEnd = html.indexOf("\n", rootIdx) + 1
  html = html.slice(0, rootLineEnd) + ROOT_VARS + html.slice(rootLineEnd)

  // Light templates declare no stacking at all, so an absolutely-positioned photo
  // would paint above their text. Lift every non-photo child above it. Dark
  // templates already run an explicit z-index ladder and must NOT get this rule
  // (it would push .geo above the darkening overlay).
  const hasStacking = /z-index:\s*[1-9]/.test(html)
  const CONTENT_RULE = hasStacking ? "" : `  .${cls} > *:not(.bg) {\n    position: relative; z-index: 1;\n  }\n`

  // The photo's inset:0 must resolve against the root, not the viewport.
  const rootRuleStart = html.indexOf(`\n  .${cls} {`)
  if (rootRuleStart < 0) throw new Error(`${dir}: no '.${cls} {' rule`)
  const rootRuleOpenEnd = html.indexOf("\n", rootRuleStart + 1) + 1
  const rootRuleClose = html.indexOf("\n  }", rootRuleOpenEnd)
  if (rootRuleClose < 0) throw new Error(`${dir}: unterminated '.${cls} {' rule`)
  const rootRuleBody = html.slice(rootRuleOpenEnd, rootRuleClose)
  if (!/position:\s*(relative|absolute)/.test(rootRuleBody)) {
    html = html.slice(0, rootRuleOpenEnd) + "    position: relative;\n" + html.slice(rootRuleOpenEnd)
  }

  const styleEnd = html.indexOf("</style>")
  if (styleEnd < 0) throw new Error(`${dir}: no </style>`)
  html = html.slice(0, styleEnd) + bgRule(cls) + CONTENT_RULE + html.slice(styleEnd)

  html = html.replace(rootTag, `${rootTag}\n  <div class="bg"></div>`)

  fs.writeFileSync(file, html)
  patched++
}
console.log(`patched ${patched}, skipped ${skipped}`)
if (patched + skipped !== 15) throw new Error(`expected 15 templates, saw ${patched + skipped}`)
