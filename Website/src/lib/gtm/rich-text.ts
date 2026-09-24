/**
 * Light-weight rich text for template slots.
 *
 * Slot values are stored as PLAIN TEXT with four markers - never HTML:
 *
 *   newline        line break
 *   **bold**       <strong>
 *   __underline__  <u>
 *   *italic*       <em>
 *
 * A marker pair only converts when it hugs its content - the opener must be
 * followed, and the closer preceded, by a non-blank character. So `**` on its
 * own, `* *`, `5 * 3` and an unclosed `**oops` all stay literal text.
 *
 * The renderer escapes the value FIRST (see `renderTemplate`) and only then
 * converts markers, so nothing a user types can open a tag: by the time this
 * module sees the string, every `<`, `>`, `&`, `"` and `'` is already an
 * entity. The only tags this module can ever emit are `<br>`, `<strong>`,
 * `<u>` and `<em>`.
 *
 * Pure: no DOM, no fs, and bounded in both nesting depth and input length
 * (see MAX_DEPTH / MAX_INPUT) so no pasted string can throw or hang. Safe to
 * import from client components (the slot editor needs `plainLength` /
 * `truncateVisible` for its counters, on every keystroke).
 *
 * A value containing none of `*`, `_` or a newline renders byte-identically
 * to the pre-rich-text substitution - that guarantee is pinned by a test in
 * `templates/__tests__/render.test.ts`.
 */

/**
 * Two bounds keep the parser from being a denial-of-service surface. Real
 * slot copy is a headline: `maxChars` tops out in the low hundreds, and no
 * human nests bold inside italic inside underline more than three deep.
 *
 * MAX_DEPTH: an opener found deeper than this is treated as literal text, so
 * a run of `*` cannot drive one recursion level per star. Without it, ~15k
 * consecutive stars blew the JS stack - and the slot editor calls
 * `plainLength` on every keystroke, so a paste could take the editor down.
 *
 * MAX_INPUT: past this length markers are not interpreted at all. The value
 * comes back as literal text through a single linear pass - no parse, no
 * recursion, no quadratic scan.
 *
 * MAX_STEPS: an unmatched opener costs a scan to the end of the string, so a
 * long string of them (`*a *a *a …`) is quadratic even inside the other two
 * bounds. The parser counts its own steps and gives up past this budget; the
 * caller then falls back to the same linear literal pass. Real copy never
 * comes close - a 300-character headline costs a few hundred steps.
 */
const MAX_DEPTH = 8
const MAX_INPUT = 20_000
const MAX_STEPS = 250_000

/** Thrown by the parser when it blows MAX_STEPS; never escapes this module. */
class ParseBudgetExceeded extends Error {}

let steps = 0

/** Markers, longest first: `**` must be tried before `*`. */
const MARKERS = [
  { marker: "**", tag: "strong" },
  { marker: "__", tag: "u" },
  { marker: "*", tag: "em" },
] as const

type Tag = (typeof MARKERS)[number]["tag"]

type RichNode =
  /** Literal source text. May contain marker characters that stayed literal. */
  | { kind: "text"; value: string }
  /** A source newline (`\r\n`, `\r` or `\n`). Zero visible characters. */
  | { kind: "br"; raw: string }
  /** A matched marker pair. */
  | { kind: "span"; marker: string; tag: Tag; children: RichNode[] }

/** Undefined (past the end) counts as blank, so a trailing marker is literal. */
function isSpace(ch: string | undefined): boolean {
  return ch === undefined || /\s/.test(ch)
}

/** True when the subtree holds at least one non-whitespace character. */
function hasVisibleText(nodes: RichNode[]): boolean {
  return nodes.some((n) =>
    n.kind === "text" ? n.value.trim() !== "" : n.kind === "span" ? hasVisibleText(n.children) : false
  )
}

/**
 * Recursive-descent scan. `closer` is the marker that ends the current span,
 * or null at the top level. Returns null when a `closer` was expected but
 * never found - the caller then re-emits the opener as literal text, which is
 * what keeps `**`, `* *` and a lone `*` from turning into tags.
 *
 * Concatenating every node's source form reproduces the input exactly, which
 * is what lets `truncateVisible` rebuild a valid prefix.
 */
function parseNodes(
  src: string,
  start: number,
  closer: string | null,
  depth: number
): { nodes: RichNode[]; next: number } | null {
  const nodes: RichNode[] = []
  let buf = ""
  let i = start
  const flush = () => {
    if (buf) {
      nodes.push({ kind: "text", value: buf })
      buf = ""
    }
  }
  while (i < src.length) {
    if (++steps > MAX_STEPS) throw new ParseBudgetExceeded()
    // A closer only counts when it hugs the content: `**bold **` is literal,
    // the way it is in every markdown dialect.
    if (closer && src.startsWith(closer, i) && i > start && !isSpace(src[i - 1])) {
      flush()
      return { nodes, next: i + closer.length }
    }
    const nl = src.startsWith("\r\n", i) ? "\r\n" : src[i] === "\n" ? "\n" : src[i] === "\r" ? "\r" : null
    if (nl) {
      flush()
      nodes.push({ kind: "br", raw: nl })
      i += nl.length
      continue
    }
    // An opener only counts when the character after it is non-blank - that
    // is what keeps `5 * 3` and `* *` literal. A single `*` additionally
    // refuses to open in front of another `*`: `**` was already tried at this
    // position and did not match, so both stars are literal (`** **`).
    const m =
      depth >= MAX_DEPTH
        ? undefined
        : MARKERS.find(
            (x) =>
              src.startsWith(x.marker, i) &&
              !isSpace(src[i + x.marker.length]) &&
              !(x.marker === "*" && src[i + 1] === "*")
          )
    if (m) {
      const inner = parseNodes(src, i + m.marker.length, m.marker, depth + 1)
      if (inner && hasVisibleText(inner.nodes)) {
        flush()
        nodes.push({ kind: "span", marker: m.marker, tag: m.tag, children: inner.nodes })
        i = inner.next
        continue
      }
      // Unmatched marker: literal.
      buf += m.marker
      i += m.marker.length
      continue
    }
    buf += src[i]
    i += 1
  }
  if (closer) return null
  flush()
  return { nodes, next: i }
}

/** Anything with no marker characters and no newlines parses to itself. */
const HAS_MARKUP = /[*_\r\n]/

/** Parsed nodes, or null when the input blew the step budget. */
function tryParse(src: string): RichNode[] | null {
  steps = 0
  try {
    return parseNodes(src, 0, null, 0)!.nodes
  } catch (e) {
    if (e instanceof ParseBudgetExceeded) return null
    throw e
  }
}

/** Newlines only, no marker parsing. Linear, for over-long values. */
function brOnly(src: string): string {
  return src.replace(/\r\n|\r|\n/g, "<br>")
}

/** Every character except newlines. Linear, for over-long values. */
function literalVisibleLen(src: string): number {
  let n = 0
  for (let i = 0; i < src.length; i++) if (src[i] !== "\n" && src[i] !== "\r") n++
  return n
}

/** Cut by non-newline characters. Linear, for over-long values. */
function literalTruncate(src: string, max: number): string {
  let n = 0
  for (let i = 0; i < src.length; i++) {
    if (src[i] !== "\n" && src[i] !== "\r" && ++n > max) return src.slice(0, i)
  }
  return src
}

function toHtml(nodes: RichNode[]): string {
  let out = ""
  for (const n of nodes) {
    if (n.kind === "text") out += n.value
    else if (n.kind === "br") out += "<br>"
    else out += `<${n.tag}>${toHtml(n.children)}</${n.tag}>`
  }
  return out
}

function visibleLen(nodes: RichNode[]): number {
  let n = 0
  for (const node of nodes) {
    if (node.kind === "text") n += node.value.length
    else if (node.kind === "span") n += visibleLen(node.children)
  }
  return n
}

/**
 * Convert markers to HTML. `escaped` must ALREADY be HTML-escaped text -
 * callers pass `escapeHtml(value)`. Emits only `<br>`, `<strong>`, `<u>`
 * and `<em>`; everything else is copied through verbatim.
 */
export function renderRichText(escaped: string): string {
  const s = String(escaped ?? "")
  if (!HAS_MARKUP.test(s)) return s
  // Over a bound: line breaks still render, markers stay literal.
  if (s.length > MAX_INPUT) return brOnly(s)
  const nodes = tryParse(s)
  return nodes === null ? brOnly(s) : toHtml(nodes)
}

/**
 * Visible character count of a RAW slot value: characters spent on matched
 * marker pairs are free, newlines count as zero, literal (unmatched) markers
 * count as the characters they are. This is the number the editor's
 * "x / maxChars" counter shows and the number `maxChars` is enforced against.
 */
export function plainLength(raw: string): number {
  const s = String(raw ?? "")
  if (!HAS_MARKUP.test(s)) return s.length
  if (s.length > MAX_INPUT) return literalVisibleLen(s)
  const nodes = tryParse(s)
  return nodes === null ? literalVisibleLen(s) : visibleLen(nodes)
}

function cutNodes(nodes: RichNode[], budget: number): { text: string; used: number } {
  let out = ""
  let used = 0
  for (const n of nodes) {
    if (used >= budget) break
    if (n.kind === "br") {
      out += n.raw
      continue
    }
    if (n.kind === "text") {
      const take = n.value.slice(0, budget - used)
      out += take
      used += take.length
      continue
    }
    const inner = cutNodes(n.children, budget - used)
    // Whole span survived -> keep its markers. Cut short -> drop the now
    // dangling opener rather than emit an unbalanced pair.
    const whole = inner.used === visibleLen(n.children)
    out += whole ? n.marker + inner.text + n.marker : inner.text
    used += inner.used
  }
  return { text: out, used }
}

/**
 * Cut a RAW slot value to at most `max` VISIBLE characters, keeping markers
 * balanced. A span that survives whole keeps its markers; a span cut in the
 * middle loses them (an opener whose closer was cut is dropped, never left
 * dangling). Returns the input untouched when it already fits, so a value
 * under its cap is byte-identical to what the caller passed in.
 */
export function truncateVisible(raw: string, max: number): string {
  const s = String(raw ?? "")
  if (!Number.isFinite(max) || max <= 0) return ""
  if (!HAS_MARKUP.test(s)) return s.length <= max ? s : s.slice(0, max)
  if (s.length > MAX_INPUT) return literalTruncate(s, max)
  const nodes = tryParse(s)
  if (nodes === null) return literalTruncate(s, max)
  if (visibleLen(nodes) <= max) return s
  return cutNodes(nodes, max).text
}
