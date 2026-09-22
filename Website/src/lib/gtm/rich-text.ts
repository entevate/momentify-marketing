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
 * Pure: no DOM, no fs. Safe to import from client components (the slot
 * editor needs `plainLength` / `truncateVisible` for its counters).
 *
 * A value containing none of `*`, `_` or a newline renders byte-identically
 * to the pre-rich-text substitution - that guarantee is pinned by a test in
 * `templates/__tests__/render.test.ts`.
 */

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
  closer: string | null
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
    const m = MARKERS.find(
      (x) =>
        src.startsWith(x.marker, i) &&
        !isSpace(src[i + x.marker.length]) &&
        !(x.marker === "*" && src[i + 1] === "*")
    )
    if (m) {
      const inner = parseNodes(src, i + m.marker.length, m.marker)
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

function parse(src: string): RichNode[] {
  return parseNodes(src, 0, null)!.nodes
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
  return toHtml(parse(s))
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
  return visibleLen(parse(s))
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
  const nodes = parse(s)
  if (visibleLen(nodes) <= max) return s
  return cutNodes(nodes, max).text
}
