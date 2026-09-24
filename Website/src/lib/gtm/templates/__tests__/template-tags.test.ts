/**
 * Standing guard for the invisible template patch that a NEWLY ADDED
 * template could silently ship without:
 *
 *  - `scripts/add-slot-tags.mjs`: every copy placeholder's element carries
 *    `data-slot="KEY"`, which is what a render's `hiddenSlots` option
 *    targets with `[data-slot="KEY"]{display:none}`. An untagged slot
 *    would blank its text but leave the element's padding, border and
 *    flex/grid track behind.
 *
 * (The other Fulcrum-style patch, the italic Google Fonts axis + underline
 * rule, already has its own dedicated guard: template-fonts.test.ts. This
 * file does not duplicate it.)
 *
 * The script is idempotent, so the fix for a failure here is to run it.
 *
 * ---
 *
 * The real hazard this file guards against is NOT count parity. A template
 * could carry exactly as many `data-slot` attributes as it has placeholders,
 * with each one naming a placeholder somewhere nearby, and STILL be broken:
 * `data-slot="KEY"` can land on an ANCESTOR whose subtree holds two or more
 * placeholders. A render hides a slot with `[data-slot="KEY"]{display:
 * none}` - that rule matches the ancestor, so hiding one slot silently
 * hides every placeholder inside it, siblings included. A count-only check
 * cannot see this, because it never looks at what's INSIDE the tagged
 * element - only at what immediately follows its opening tag (which is all
 * `add-slot-tags.mjs`'s own regex ever verifies).
 *
 * `checkTemplateTags` below parses the template with a real HTML parser
 * (`node-html-parser`) and, for every element carrying `data-slot="KEY"`,
 * walks its full subtree (text + descendants, explicitly excluding
 * `<style>` and `<script>`, where the reserved palette/media keys live) to
 * assert the set of non-reserved placeholders found is exactly `{KEY}` -
 * no more, no fewer. It also checks for orphan tags (a `data-slot` key with
 * no matching placeholder anywhere) and coverage (every placeholder wrapped
 * by exactly one `data-slot` ancestor, not zero and not several).
 *
 * `CTA_ICON` is reserved (see scripts/slot-tag-shared.json): renderTemplate
 * expands it to an `<svg>`, so `<span class="cta-pill" data-slot="CTA">
 * {{CTA}}{{CTA_ICON}}</span>` is sound tagging even though two `{{...}}`
 * tokens sit in the same element - CTA_ICON is filtered out before the
 * subtree-equality check runs, same as every other reserved key.
 */

import fs from "fs"
import path from "path"
import { parse, type HTMLElement, type Node } from "node-html-parser"

const ROOT = path.join(process.cwd(), "src", "lib", "gtm", "templates", "social-post")

/**
 * Reserved keys (palette/media CSS values, never element text), the
 * expected template count, the expected corpus-wide tag total, and the
 * per-family expected slot count. This is the SAME JSON file
 * `scripts/add-slot-tags.mjs` reads - both are plain `fs.readFileSync` +
 * `JSON.parse` reads so neither the Jest-transpiled CommonJS test nor the
 * `.mjs` script care about import-assertion syntax. There is exactly one
 * copy of this table in the repo.
 */
const SHARED = JSON.parse(fs.readFileSync(path.join(process.cwd(), "scripts", "slot-tag-shared.json"), "utf8")) as {
  reserved: string[]
  expectedTemplates: number
  expectedDataSlotAttributes: number
  expectedByFamily: Record<string, number>
}

const RESERVED = new Set<string>(SHARED.reserved)
const EXPECTED_BY_FAMILY = SHARED.expectedByFamily
const familyOf = (dir: string) => Object.keys(EXPECTED_BY_FAMILY).find((f) => dir.startsWith(`${f}-`))

const PLACEHOLDER_RE = /\{\{([A-Z0-9_]+)\}\}/g

function templateFiles(): [name: string, file: string][] {
  const out: [string, string][] = []
  for (const dir of fs.readdirSync(ROOT).sort()) {
    const file = path.join(ROOT, dir, "template.html")
    if (fs.existsSync(file)) out.push([dir, file])
  }
  return out
}

const files = templateFiles()

// ---------------------------------------------------------------------------
// The checker under test. Pure function: (html, reserved) -> violation
// messages. Used both against every real template and, further down, against
// hand-written snippets to prove the checker itself catches (and doesn't
// false-positive on) the ancestor-hides-sibling hazard.
// ---------------------------------------------------------------------------

const ELEMENT_NODE = 1
const TEXT_NODE = 3

function isSkippedTag(node: Node): boolean {
  const el = node as HTMLElement
  const tag = (el.tagName || "").toLowerCase()
  return tag === "style" || tag === "script"
}

/** Non-reserved `{{KEY}}` keys found in a node's own text plus every
 * descendant's text, explicitly skipping `<style>`/`<script>` subtrees. */
function collectSubtreePlaceholders(node: Node, reserved: Set<string>, out: Set<string> = new Set()): Set<string> {
  if (node.nodeType === TEXT_NODE) {
    const text = (node as unknown as { rawText: string }).rawText || ""
    for (const m of text.matchAll(PLACEHOLDER_RE)) {
      if (!reserved.has(m[1])) out.add(m[1])
    }
    return out
  }
  if (node.nodeType === ELEMENT_NODE) {
    if (isSkippedTag(node)) return out
    for (const child of (node as HTMLElement).childNodes || []) {
      collectSubtreePlaceholders(child, reserved, out)
    }
  }
  return out
}

/** Every non-reserved placeholder occurrence in the document (outside
 * `<style>`/`<script>`), paired with the text node it lives in. */
function collectOccurrences(root: Node, reserved: Set<string>): { key: string; node: Node }[] {
  const occurrences: { key: string; node: Node }[] = []
  function walk(node: Node) {
    if (node.nodeType === TEXT_NODE) {
      const text = (node as unknown as { rawText: string }).rawText || ""
      for (const m of text.matchAll(PLACEHOLDER_RE)) {
        if (!reserved.has(m[1])) occurrences.push({ key: m[1], node })
      }
      return
    }
    if (node.nodeType === ELEMENT_NODE) {
      if (isSkippedTag(node)) return
      for (const child of (node as HTMLElement).childNodes || []) walk(child)
    }
  }
  walk(root)
  return occurrences
}

function describeElement(el: HTMLElement, key: string): string {
  const tag = (el.tagName || "").toLowerCase()
  const cls = el.getAttribute("class")
  return `<${tag}${cls ? ` class="${cls}"` : ""} data-slot="${key}">`
}

/**
 * Parses `html` and returns a list of readable violation messages, each
 * naming the offending element/key(s), or `[]` if the tagging is sound.
 *
 *  1. Ancestor-subtree: every `data-slot="KEY"` element's full subtree must
 *     contain exactly the placeholder set `{KEY}` - this is the check that
 *     catches a tag placed on an ancestor whose subtree holds >= 2
 *     placeholders (the real hazard).
 *  2. Orphan: every `data-slot` key must match a placeholder that actually
 *     exists somewhere in the template.
 *  3. Coverage: every placeholder occurrence must be inside exactly one
 *     `data-slot`-carrying ancestor - not zero (untagged) and not several
 *     (redundant/conflicting tagging).
 */
function checkTemplateTags(html: string, reserved: Set<string>): string[] {
  const root = parse(html)
  const violations: string[] = []

  const slotElements = root.querySelectorAll("[data-slot]")

  // 1. Ancestor-subtree check.
  for (const el of slotElements) {
    const key = el.getAttribute("data-slot")!
    if (reserved.has(key)) continue
    const subtreeKeys = [...collectSubtreePlaceholders(el, reserved)].sort()
    const ok = subtreeKeys.length === 1 && subtreeKeys[0] === key
    if (!ok) {
      violations.push(
        `${describeElement(el, key)}: subtree placeholders {${subtreeKeys.join(", ") || "none"}} ` +
          `!== {${key}} - a data-slot on an ancestor whose subtree holds a different placeholder set ` +
          `will hide more than one slot when [data-slot="${key}"]{display:none} is applied`
      )
    }
  }

  // 2. Orphan check.
  const allPlaceholderKeys = collectSubtreePlaceholders(root, reserved)
  for (const el of slotElements) {
    const key = el.getAttribute("data-slot")!
    if (reserved.has(key)) continue
    if (!allPlaceholderKeys.has(key)) {
      violations.push(`${describeElement(el, key)}: orphan data-slot - no {{${key}}} placeholder anywhere in the template`)
    }
  }

  // 3. Coverage check.
  for (const { key, node } of collectOccurrences(root, reserved)) {
    let coveringCount = 0
    let p: Node | null = (node as unknown as { parentNode: Node | null }).parentNode
    while (p) {
      const el = p as HTMLElement
      if (typeof el.getAttribute === "function" && el.getAttribute("data-slot") != null) coveringCount++
      p = (el as unknown as { parentNode: Node | null }).parentNode
    }
    if (coveringCount !== 1) {
      violations.push(`{{${key}}}: covered by ${coveringCount} data-slot ancestor(s), expected exactly 1`)
    }
  }

  return violations
}

// ---------------------------------------------------------------------------

describe("template files", () => {
  it("the social-post family's templates are all present", () => {
    expect(files.length).toBe(SHARED.expectedTemplates)
  })

  it.each(files)("%s tags every copy placeholder with data-slot", (name, file) => {
    const html = fs.readFileSync(file, "utf-8")
    const placeholders = [...html.matchAll(PLACEHOLDER_RE)].filter((m) => !RESERVED.has(m[1]))
    const root = parse(html)
    const taggedKeys = root
      .querySelectorAll("[data-slot]")
      .map((el) => el.getAttribute("data-slot")!)
      .filter((key) => !RESERVED.has(key))
    expect(taggedKeys.length).toBe(placeholders.length)
    const family = familyOf(name)
    expect(family).toBeDefined()
    expect(placeholders.length).toBe(EXPECTED_BY_FAMILY[family!])
  })

  it("the corpus-wide data-slot total matches the recorded ground truth", () => {
    let total = 0
    for (const [, file] of files) {
      const html = fs.readFileSync(file, "utf-8")
      total += [...html.matchAll(PLACEHOLDER_RE)].filter((m) => !RESERVED.has(m[1])).length
    }
    expect(total).toBe(SHARED.expectedDataSlotAttributes)
  })

  it.each(files)("%s has no data-slot ancestor hiding more than its own placeholder", (_name, file) => {
    const html = fs.readFileSync(file, "utf-8")
    const violations = checkTemplateTags(html, RESERVED)
    expect(violations).toEqual([])
  })
})

// ---------------------------------------------------------------------------
// Test the checker itself: prove it catches the ancestor-hides-sibling
// hazard, and that it doesn't false-positive on sound tagging.
// ---------------------------------------------------------------------------

describe("checkTemplateTags (the checker itself)", () => {
  it("fails a data-slot ancestor whose subtree holds two placeholders", () => {
    const broken = `<div data-slot="A">{{A}}<span data-slot="B">{{B}}</span></div>`
    const violations = checkTemplateTags(broken, RESERVED)
    expect(violations.length).toBeGreaterThan(0)
    expect(violations[0]).toContain('<div data-slot="A">')
    expect(violations[0]).toContain("{A, B}")
    expect(violations[0]).toContain("!== {A}")
  })

  it("passes the same structure once each slot is tagged on its own element", () => {
    const fixed = `<div><span data-slot="A">{{A}}</span><span data-slot="B">{{B}}</span></div>`
    expect(checkTemplateTags(fixed, RESERVED)).toEqual([])
  })

  it("passes the CTA-pill shape where a reserved CTA_ICON placeholder shares the element", () => {
    const cta = `<span class="cta-pill" data-slot="CTA">{{CTA}}{{CTA_ICON}}</span>`
    expect(checkTemplateTags(cta, RESERVED)).toEqual([])
  })

  it("flags an orphan data-slot with no matching placeholder", () => {
    const orphan = `<div data-slot="GHOST">static text</div>`
    const violations = checkTemplateTags(orphan, RESERVED)
    expect(violations.some((v) => v.includes("orphan data-slot"))).toBe(true)
  })

  it("flags a placeholder left with no covering data-slot element", () => {
    const uncovered = `<div>{{UNCOVERED}}</div>`
    const violations = checkTemplateTags(uncovered, RESERVED)
    expect(violations.some((v) => v.includes("{{UNCOVERED}}: covered by 0"))).toBe(true)
  })

  it("flags a placeholder wrapped by two nested data-slot ancestors", () => {
    const doubleTagged = `<div data-slot="A"><span data-slot="A">{{A}}</span></div>`
    const violations = checkTemplateTags(doubleTagged, RESERVED)
    expect(violations.some((v) => v.includes("{{A}}: covered by 2"))).toBe(true)
  })

  it("ignores reserved keys and <style>/<script> content", () => {
    const withStyle = `<style>.x{background:{{BG_IMAGE}}}</style><script>const k = "{{PRIMARY}}"</script><div data-slot="A">{{A}}</div>`
    expect(checkTemplateTags(withStyle, RESERVED)).toEqual([])
  })
})
