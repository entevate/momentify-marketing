import { renderRichText, plainLength, truncateVisible } from "../rich-text"
import { escapeHtml } from "@/lib/gtm/link-page-types"

/** What the renderer actually does: escape, then convert markers. */
const render = (raw: string) => renderRichText(escapeHtml(raw))

describe("renderRichText", () => {
  const cases: [name: string, input: string, output: string][] = [
    ["passes plain text through untouched", "Hello world", "Hello world"],
    ["bold", "**bold**", "<strong>bold</strong>"],
    ["underline", "__under__", "<u>under</u>"],
    ["italic", "*it*", "<em>it</em>"],
    ["bold inside a sentence", "a **b** c", "a <strong>b</strong> c"],
    ["several spans of each kind", "**a** *b* __c__", "<strong>a</strong> <em>b</em> <u>c</u>"],
    ["newline becomes a br", "a\nb", "a<br>b"],
    ["CRLF and CR become one br each", "a\r\nb\rc", "a<br>b<br>c"],
    ["a span may cross a line break", "**a\nb**", "<strong>a<br>b</strong>"],
    ["bold is consumed before italic", "**b** *i*", "<strong>b</strong> <em>i</em>"],
    ["underline nested in bold", "**__x__**", "<strong><u>x</u></strong>"],
    ["bold nested in underline", "__**x**__", "<u><strong>x</strong></u>"],
    ["italic nested in bold", "***x***", "<strong><em>x</em></strong>"],
    ["non-greedy: two bolds, not one", "**a** and **b**", "<strong>a</strong> and <strong>b</strong>"],
    ["word-internal markers still convert", "sna**fu**bar", "sna<strong>fu</strong>bar"],
  ]
  it.each(cases)("%s", (_name, input, output) => {
    expect(render(input)).toBe(output)
  })

  const literals: [name: string, input: string, output: string][] = [
    ["an empty bold pair stays literal", "**", "**"],
    ["a blank italic pair stays literal", "* *", "* *"],
    ["a blank bold pair stays literal", "** **", "** **"],
    ["a lone star stays literal", "5 * 3", "5 * 3"],
    ["an unclosed bold stays literal", "**oops", "**oops"],
    ["an unclosed underline stays literal", "__oops", "__oops"],
    ["a lone underscore pair is not a marker", "snake_case_name", "snake_case_name"],
    ["a trailing star after a closed italic stays literal", "*a**", "<em>a</em>*"],
  ]
  it.each(literals)("%s", (_name, input, output) => {
    expect(render(input)).toBe(output)
  })

  it("composes with escapeHtml: markup a user types is inert", () => {
    expect(render("**<b>**")).toBe("<strong>&lt;b&gt;</strong>")
    expect(render("<script>alert(1)</script>")).toBe("&lt;script&gt;alert(1)&lt;/script&gt;")
    expect(render("*<img src=x onerror=1>*")).toBe("<em>&lt;img src=x onerror=1&gt;</em>")
  })

  it("emits no tag other than br/strong/u/em", () => {
    const out = render("**a** __b__ *c*\n<div>&'\"</div> **<span>**")
    const tags = out.match(/<\/?[a-z]+[^>]*>/g) ?? []
    for (const t of tags) expect(t).toMatch(/^<\/?(br|strong|u|em)>$/)
  })

  it("leaves an escaped entity alone", () => {
    expect(render("A & B")).toBe("A &amp; B")
    expect(render("**A & B**")).toBe("<strong>A &amp; B</strong>")
  })
})

describe("plainLength", () => {
  const cases: [input: string, expected: number][] = [
    ["", 0],
    ["abcde", 5],
    ["**abcde**", 5],
    ["__ab__", 2],
    ["*ab*", 2],
    ["**a** *b*", 3], // "a", " ", "b"
    ["a\nb", 2],
    ["a\r\nb", 2],
    ["**", 2], // literal, counts
    ["* *", 3], // literal, counts
    ["5 * 3", 5],
    ["**__x__**", 1],
  ]
  it.each(cases)("plainLength(%j) === %i", (input, expected) => {
    expect(plainLength(input)).toBe(expected)
  })
})

describe("truncateVisible", () => {
  const cases: [name: string, raw: string, max: number, out: string][] = [
    ["returns the input untouched when it fits", "abcde", 10, "abcde"],
    ["hard cut with no markers matches slice", "abcdefgh", 3, "abcdefgh".slice(0, 3)],
    ["markers are free: a value that fits keeps them", "**abc**", 3, "**abc**"],
    ["a whole span that fits keeps its markers", "**ab** cd", 5, "**ab** cd"],
    ["a span cut in the middle drops the dangling opener", "**abcdef**", 3, "abc"],
    ["text after a cut span is dropped", "**ab**cdef", 3, "**ab**c"],
    ["nested spans keep their markers when whole", "**__ab__**", 2, "**__ab__**"],
    ["nested spans lose markers when cut", "**__abcd__**", 2, "ab"],
    ["newlines cost nothing", "a\nb\nc", 3, "a\nb\nc"],
    ["literal markers count against the budget", "5 * 3 = 15", 5, "5 * 3"],
    ["zero max yields an empty string", "**abc**", 0, ""],
  ]
  it.each(cases)("%s", (_name, raw, max, out) => {
    expect(truncateVisible(raw, max)).toBe(out)
  })

  it("never returns more visible characters than max", () => {
    const samples = ["**Big bold headline**", "a *b* c __d__ e", "plain copy here", "**a**\n**b**", "***x***"]
    for (const s of samples) {
      for (let max = 1; max <= plainLength(s) + 2; max++) {
        expect(plainLength(truncateVisible(s, max))).toBeLessThanOrEqual(max)
      }
    }
  })

  it("always leaves markers balanced - the render round-trips to valid nesting", () => {
    const s = "**bold** and *italic* and __under__"
    for (let max = 1; max <= plainLength(s); max++) {
      const html = renderRichText(escapeHtml(truncateVisible(s, max)))
      const opens = html.match(/<(strong|u|em)>/g) ?? []
      const closes = html.match(/<\/(strong|u|em)>/g) ?? []
      expect(opens.length).toBe(closes.length)
    }
  })
})

// ─────────────────────────────────────────────────────────────────────────
// Bounds. SlotEditor calls plainLength on every keystroke, so a pasted blob
// must never throw or hang - an unbounded recursive parser overflowed the
// stack at ~15k consecutive markers.
// ─────────────────────────────────────────────────────────────────────────

describe("rich-text bounds", () => {
  const within = (ms: number, fn: () => void) => {
    const t = Date.now()
    fn()
    const took = Date.now() - t
    expect(took).toBeLessThan(ms)
  }

  const blobs: [name: string, value: string][] = [
    ["50k stars", "*".repeat(50_000)],
    ["50k underscores", "_".repeat(50_000)],
    ["50k alternating bold markers", "**".repeat(25_000)],
    ["20k unclosed italic openers", "*a ".repeat(6_633)],
    ["20k unclosed bold openers", "**a ".repeat(4_975)],
    ["20k unclosed underline openers", "__a ".repeat(4_975)],
    ["20k mixed unmatched markers", "*a __b c** ".repeat(1_800)],
  ]

  it.each(blobs)("%s: renders, measures and truncates under 100ms without throwing", (_name, value) => {
    within(100, () => {
      expect(() => renderRichText(value)).not.toThrow()
      expect(() => plainLength(value)).not.toThrow()
      expect(() => truncateVisible(value, 40)).not.toThrow()
    })
  })

  it("hands back an over-long marker blob as literal text", () => {
    const stars = "*".repeat(50_000)
    expect(renderRichText(stars)).toBe(stars)
    expect(plainLength(stars)).toBe(50_000)
    expect(truncateVisible(stars, 40)).toBe("*".repeat(40))
  })

  it("still renders line breaks in an over-long value", () => {
    const long = "a".repeat(20_001) + "\n" + "*b*"
    const out = renderRichText(long)
    expect(out).toContain("<br>")
    expect(out).toContain("*b*") // markers are literal past the ceiling
    expect(plainLength(long)).toBe(20_001 + 3)
  })

  it("caps nesting rather than recursing once per opener", () => {
    const deep = "**".repeat(20) + "x" + "**".repeat(20)
    const out = renderRichText(deep)
    let depth = 0
    let max = 0
    for (const tag of out.match(/<\/?strong>/g) ?? []) {
      depth += tag === "<strong>" ? 1 : -1
      max = Math.max(max, depth)
    }
    expect(max).toBeLessThanOrEqual(8)
    expect(depth).toBe(0) // balanced
  })

  it("keeps ordinary copy on the parsed path", () => {
    const copy = "Bold **headline** with *italic* and __under__. ".repeat(420)
    expect(renderRichText(copy)).toContain("<strong>headline</strong>")
    // 10 marker characters per sentence: **…** + *…* + __…__
    expect(plainLength(copy)).toBe(copy.length - 420 * 10)
  })
})
