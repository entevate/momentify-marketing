/**
 * Tags every copy placeholder's element with `data-slot="KEY"` across the
 * social-post templates, so a rendered graphic can hide an individual slot
 * with a single `[data-slot="KEY"]{display:none}` rule.
 *
 * Every non-reserved `{{KEY}}` in these templates is the sole text of its
 * element (two carry a trailing ` &rarr;`), so the opening tag immediately
 * preceding the placeholder is the element to tag.
 *
 * Reserved keys are palette/media CSS values that live inside `<style>` or
 * inline `style=` attributes - they are never text nodes, so they are skipped.
 *
 * Idempotent: an opening tag that already carries `data-slot=` is left alone,
 * so a second run produces no diff. Fails loudly (non-zero exit) if a
 * template's tagged count does not equal its non-reserved placeholder count,
 * so a template never ends up half-tagged.
 */
import fs from "fs"
import path from "path"

const ROOT = path.join(process.cwd(), "src/lib/gtm/templates/social-post")

/**
 * Reserved keys, the expected template count, the expected corpus-wide tag
 * total, and the per-family slot count are the shared ground truth for this
 * script AND for src/lib/gtm/templates/__tests__/template-tags.test.ts. Both
 * read the same JSON file (plain fs.readFileSync + JSON.parse) so the two
 * can never drift.
 */
const SHARED = JSON.parse(fs.readFileSync(path.join(process.cwd(), "scripts", "slot-tag-shared.json"), "utf8"))

/**
 * Palette + media keys: CSS values, never element text. CTA_ICON is
 * expanded by renderTemplate to an <svg data-slot="CTA_ICON"> - never
 * element text, so it is not a copy slot and must not be tagged/counted.
 */
const RESERVED = new Set(SHARED.reserved)

/** Expected copy-slot count per template family - the assertion's ground truth. */
const EXPECTED = SHARED.expectedByFamily

const familyOf = (dir) => Object.keys(EXPECTED).find((f) => dir.startsWith(`${f}-`))

/** Count non-reserved `{{KEY}}` occurrences, whatever their position. */
function copyPlaceholders(html) {
  return [...html.matchAll(/\{\{([A-Z0-9_]+)\}\}/g)].filter((m) => !RESERVED.has(m[1])).length
}

let total = 0
let dirs = 0
const failures = []

for (const dir of fs.readdirSync(ROOT).sort()) {
  const file = path.join(ROOT, dir, "template.html")
  if (!fs.existsSync(file)) continue
  dirs++

  const before = fs.readFileSync(file, "utf8")
  const expectedPlaceholders = copyPlaceholders(before)

  let tagged = 0
  let alreadyTagged = 0
  const after = before.replace(
    /<([a-z][a-z0-9]*)([^>]*)>(\s*)\{\{([A-Z0-9_]+)\}\}/g,
    (whole, tag, attrs, gap, key) => {
      if (RESERVED.has(key)) return whole
      if (/data-slot=/.test(attrs)) {
        alreadyTagged++
        return whole
      }
      tagged++
      return `<${tag}${attrs} data-slot="${key}">${gap}{{${key}}}`
    }
  )

  const covered = tagged + alreadyTagged
  const family = familyOf(dir)
  const expectedFamily = family ? EXPECTED[family] : undefined

  if (after !== before) fs.writeFileSync(file, after)

  console.log(
    `${dir.padEnd(22)} tagged ${String(tagged).padStart(2)}  already ${String(alreadyTagged).padStart(2)}  placeholders ${expectedPlaceholders}`
  )

  if (covered !== expectedPlaceholders) {
    failures.push(`${dir}: tagged ${covered} of ${expectedPlaceholders} copy placeholders`)
  }
  if (expectedFamily === undefined) {
    failures.push(`${dir}: no expected count for this template family`)
  } else if (covered !== expectedFamily) {
    failures.push(`${dir}: expected ${expectedFamily} slots for family ${family}, tagged ${covered}`)
  }
  total += covered
}

console.log(`\n${dirs} templates, ${total} data-slot attributes`)

if (dirs !== SHARED.expectedTemplates) failures.push(`expected ${SHARED.expectedTemplates} templates, saw ${dirs}`)
if (total !== SHARED.expectedDataSlotAttributes) {
  failures.push(`expected ${SHARED.expectedDataSlotAttributes} data-slot attributes total, tagged ${total}`)
}
if (failures.length) {
  for (const f of failures) console.error(`FAIL ${f}`)
  process.exit(1)
}
