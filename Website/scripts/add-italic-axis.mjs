/**
 * Give every social-post template a real italic axis, plus a legible
 * underline at display sizes.
 *
 * Rich-text slots can now emit <em> and <u>. The templates load Inter with a
 * weight-only axis (`family=Inter:wght@300;…;700`), which has no italic
 * faces - headless Chromium would synthesise an oblique by shearing the
 * upright glyphs. This rewrites each link to the two-axis form
 * (`ital,wght@0,300;…;1,700`, keeping whatever weights that file asked for)
 * and adds one shared rule beside the template's :root vars:
 *
 *   u { text-decoration-thickness: .06em; text-underline-offset: .08em; }
 *
 * <strong> needs nothing - the UA default of 700 already has a face.
 *
 * Idempotent: run it twice and the second run reports 0 changes. Fails loudly
 * if any template ends up without both patches.
 *
 *   node scripts/add-italic-axis.mjs
 */
import fs from "fs"
import path from "path"

const ROOT = path.join(process.cwd(), "src", "lib", "gtm", "templates", "social-post")
const UNDERLINE_RULE = "u { text-decoration-thickness: .06em; text-underline-offset: .08em; }"
const LINK_RE = /family=Inter:wght@([\d;]+)/g

/** `300;400;700` -> `ital,wght@0,300;0,400;0,700;1,300;1,400;1,700` */
function italAxis(weights) {
  const list = weights.split(";").filter(Boolean)
  return "ital,wght@" + [...list.map((w) => `0,${w}`), ...list.map((w) => `1,${w}`)].join(";")
}

/** Index just past the `}` that closes the first `:root {` block. */
function endOfRootBlock(src) {
  const start = src.search(/:root\s*\{/)
  if (start < 0) return -1
  let depth = 0
  for (let i = src.indexOf("{", start); i < src.length; i++) {
    if (src[i] === "{") depth++
    else if (src[i] === "}" && --depth === 0) return i + 1
  }
  return -1
}

const files = fs
  .readdirSync(ROOT, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => path.join(ROOT, d.name, "template.html"))
  .filter((f) => fs.existsSync(f))

let changedLink = 0
let changedRule = 0
const bad = []

for (const file of files) {
  const before = fs.readFileSync(file, "utf-8")
  let src = before

  if (LINK_RE.test(src)) {
    LINK_RE.lastIndex = 0
    src = src.replace(LINK_RE, (_m, weights) => `family=Inter:${italAxis(weights)}`)
    changedLink++
  }
  LINK_RE.lastIndex = 0

  if (!src.includes("text-underline-offset")) {
    const end = endOfRootBlock(src)
    if (end < 0) {
      bad.push(`${file}: no :root block to anchor the underline rule to`)
    } else {
      src = src.slice(0, end) + `\n  ${UNDERLINE_RULE}` + src.slice(end)
      changedRule++
    }
  }

  if (src !== before) fs.writeFileSync(file, src, "utf-8")

  const after = fs.readFileSync(file, "utf-8")
  if (!/family=Inter:ital,wght@/.test(after)) bad.push(`${file}: font link still has no italic axis`)
  if (/family=Inter:wght@/.test(after)) bad.push(`${file}: an upright-only Inter link is still present`)
  if (!after.includes(UNDERLINE_RULE)) bad.push(`${file}: underline rule missing`)
}

console.log(`templates: ${files.length}`)
console.log(`font links rewritten this run: ${changedLink}`)
console.log(`underline rules added this run: ${changedRule}`)
if (bad.length) {
  for (const b of bad) console.error("FAIL " + b)
  process.exit(1)
}
if (files.length !== 15) {
  console.error(`FAIL expected 15 templates, found ${files.length}`)
  process.exit(1)
}
console.log(changedLink + changedRule === 0 ? "OK 15/15 already patched (no-op)" : "OK 15/15 patched")
