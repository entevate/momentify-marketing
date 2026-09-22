import { renderTemplate, mediaMap, ctaIconSvg, CTA_ICONS, DEFAULT_CTA_ICON } from "../render"
import type { RenderMedia } from "../render"
import { templateRegistry } from "../_registry"
import { escapeHtml } from "@/lib/gtm/link-page-types"
import type { Palette } from "@/lib/gtm/pillar-palettes"

const palette: Palette = {
  primary: "#111111",
  light: "#222222",
  dark: "#000000",
  heroGrad: "linear-gradient(#111,#000)",
  lightBg: "#fafafa",
  decorPattern: "none",
  decorSize: "auto",
} as Palette

const html = `<style>:root{--bg-image:{{BG_IMAGE}};--bg-opacity:{{BG_OPACITY}};--primary:{{PRIMARY}}}</style><h1>{{HEADLINE}}</h1>`

describe("renderTemplate media", () => {
  it("defaults BG_IMAGE to none and BG_OPACITY to 1 when no media is given", () => {
    const out = renderTemplate(html, { HEADLINE: "Hi" }, palette)
    expect(out).toContain("--bg-image:none;")
    expect(out).toContain("--bg-opacity:1;")
    expect(out).toContain("<h1>Hi</h1>")
  })

  it("substitutes a data URI wrapped in url() and a clamped opacity", () => {
    const out = renderTemplate(html, {}, palette, {
      bgImage: "data:image/png;base64,AAAA",
      bgOpacity: 62,
    })
    expect(out).toContain('--bg-image:url("data:image/png;base64,AAAA");')
    expect(out).toContain("--bg-opacity:0.62;")
  })

  it("clamps opacity into [0,1] and strips quotes/backslashes from the URI", () => {
    expect(renderTemplate(html, {}, palette, { bgOpacity: 500 })).toContain("--bg-opacity:1;")
    expect(renderTemplate(html, {}, palette, { bgOpacity: -5 })).toContain("--bg-opacity:0;")
    expect(renderTemplate(html, {}, palette, { bgImage: 'data:image/png;base64,A"B\\C' })).toContain(
      '--bg-image:url("data:image/png;base64,ABC");'
    )
  })

  it("reserved media keys win over caller slots", () => {
    const out = renderTemplate(html, { BG_IMAGE: "evil", BG_OPACITY: "9" }, palette)
    expect(out).toContain("--bg-image:none;")
    expect(out).toContain("--bg-opacity:1;")
  })

  it("HTML-escapes caller slot values but leaves reserved keys raw", () => {
    const out = renderTemplate(html, { HEADLINE: '<img src=x onerror=1> & "q" \'s\'' }, palette, { bgImage: "data:image/png;base64,AA" })
    expect(out).toContain("<h1>&lt;img src=x onerror=1&gt; &amp; &quot;q&quot; &#39;s&#39;</h1>")
    expect(out).not.toContain("<img src=x")
    expect(out).toContain('--bg-image:url("data:image/png;base64,AA");')   // reserved: raw
    expect(out).toContain("--primary:#111111")                               // reserved: raw
  })
})

describe("renderTemplate hidden slots", () => {
  const doc = `<html><head><title>t</title></head><body><h1>{{HEADLINE}}</h1><p>{{SUB}}</p></body></html>`

  it("renders a hidden key as empty text and adds one display:none rule", () => {
    const out = renderTemplate(doc, { HEADLINE: "Visible", SUB: "Gone" }, palette, undefined, ["SUB"])
    expect(out).toContain("<h1>Visible</h1>")
    expect(out).toContain("<p></p>")
    expect(out).not.toContain("Gone")
    expect(out).toContain('[data-slot="SUB"]{display:none !important}')
  })

  it("hides a key even when a slot value is supplied for it", () => {
    const out = renderTemplate(doc, { HEADLINE: "A", SUB: "B" }, palette, undefined, ["HEADLINE", "SUB"])
    expect(out).toContain("<h1></h1>")
    expect(out).toContain("<p></p>")
    expect(out).toContain('[data-slot="HEADLINE"]{display:none !important}')
    expect(out).toContain('[data-slot="SUB"]{display:none !important}')
  })

  it("emits one style tag holding a rule per hidden key", () => {
    const out = renderTemplate(doc, {}, palette, undefined, ["HEADLINE", "SUB"])
    const styleTags = out.match(/<style>\[data-slot=/g) ?? []
    expect(styleTags).toHaveLength(1)
  })

  it("injects the style tag immediately before </head>", () => {
    const out = renderTemplate(doc, { HEADLINE: "x" }, palette, undefined, ["SUB"])
    expect(out).toContain('<style>[data-slot="SUB"]{display:none !important}</style></head>')
  })

  it("prepends the style tag when the document has no </head>", () => {
    const out = renderTemplate(`<div>{{HEADLINE}}</div>`, {}, palette, undefined, ["HEADLINE"])
    expect(out.startsWith('<style>[data-slot="HEADLINE"]{display:none !important}</style>')).toBe(true)
  })

  it("drops keys that are not plain [A-Z0-9_] so nothing unescaped reaches the style tag", () => {
    const out = renderTemplate(doc, { HEADLINE: "Hi" }, palette, undefined, ['"]{}</style><script>evil', "sub", "OK_1"])
    expect(out).not.toContain("<script>")
    expect(out).not.toContain("evil")
    expect(out).not.toContain("</style><script")
    expect(out).toContain('<style>[data-slot="OK_1"]{display:none !important}</style>')
  })

  it("expands CTA_ICON to a thin-stroke svg tagged for the hidden rule, never escaped", () => {
    const pill = `<span data-slot="CTA">{{CTA}}{{CTA_ICON}}</span>`
    const out = renderTemplate(pill, { CTA: "Book a Demo", CTA_ICON: "calendar" }, palette)
    expect(out).toContain('<svg class="cta-icon" data-slot="CTA_ICON"')
    expect(out).toContain('stroke-width="1.75"')
    expect(out).toContain(CTA_ICONS.calendar.path)
    expect(out).not.toContain("&lt;svg")
  })

  it("renders no icon for an unknown id, 'none', or a missing value", () => {
    const pill = `<span data-slot="CTA">{{CTA}}{{CTA_ICON}}</span>`
    const variants: Record<string, string>[] = [{ CTA_ICON: "not-an-icon" }, { CTA_ICON: "none" }, {}]
    for (const v of variants) {
      const out = renderTemplate(pill, { CTA: "Go", ...v }, palette)
      expect(out).toBe(`<span data-slot="CTA">Go</span>`)
    }
  })

  it("hidden CTA_ICON emits neither the svg nor its markup, plus the display:none rule", () => {
    const pill = `<span data-slot="CTA">{{CTA}}{{CTA_ICON}}</span>`
    const out = renderTemplate(pill, { CTA: "Go", CTA_ICON: DEFAULT_CTA_ICON }, palette, undefined, ["CTA_ICON"])
    expect(out).not.toContain("<svg")
    expect(out).toContain('[data-slot="CTA_ICON"]{display:none !important}')
  })

  it("injects nothing when hidden is absent or empty - byte-identical to no arg", () => {
    const withoutArg = renderTemplate(doc, { HEADLINE: "A", SUB: "B" }, palette)
    expect(renderTemplate(doc, { HEADLINE: "A", SUB: "B" }, palette, undefined, [])).toBe(withoutArg)
    expect(renderTemplate(doc, { HEADLINE: "A", SUB: "B" }, palette, undefined, undefined)).toBe(withoutArg)
    expect(withoutArg).not.toContain("display:none")
    // only invalid keys -> still nothing injected
    expect(renderTemplate(doc, { HEADLINE: "A", SUB: "B" }, palette, undefined, ["nope!"])).toBe(withoutArg)
  })
})

// ─────────────────────────────────────────────────────────────────────────
// Rich-text slots
// ─────────────────────────────────────────────────────────────────────────

describe("renderTemplate rich-text markers", () => {
  const doc = `<h1>{{HEADLINE}}</h1>`

  it("converts the four markers to their tags", () => {
    expect(renderTemplate(doc, { HEADLINE: "**big**" }, palette)).toContain("<h1><strong>big</strong></h1>")
    expect(renderTemplate(doc, { HEADLINE: "__line__" }, palette)).toContain("<h1><u>line</u></h1>")
    expect(renderTemplate(doc, { HEADLINE: "*lean*" }, palette)).toContain("<h1><em>lean</em></h1>")
    expect(renderTemplate(doc, { HEADLINE: "a\nb" }, palette)).toContain("<h1>a<br>b</h1>")
  })

  it("escapes before converting, so a typed tag can never open an element", () => {
    const out = renderTemplate(doc, { HEADLINE: "**<img src=x onerror=1>**" }, palette)
    expect(out).toBe("<h1><strong>&lt;img src=x onerror=1&gt;</strong></h1>")
    expect(out).not.toContain("<img")
  })

  it("leaves unmatched or empty markers literal", () => {
    expect(renderTemplate(doc, { HEADLINE: "5 * 3 ** 2" }, palette)).toBe("<h1>5 * 3 ** 2</h1>")
  })

  it("does not convert markers in reserved palette/media values", () => {
    const styled = `<style>--p:{{PRIMARY}}</style>`
    const out = renderTemplate(styled, {}, palette, { bgImage: "data:image/png;base64,A*B" })
    expect(out).not.toContain("<em>")
  })

  it("a hidden slot stays empty whatever markers it holds", () => {
    const out = renderTemplate(doc, { HEADLINE: "**x**" }, palette, undefined, ["HEADLINE"])
    expect(out).toContain("<h1></h1>")
    expect(out).not.toContain("<strong>")
  })
})

describe("renderTemplate byte-identity for marker-free values", () => {
  // The substitution exactly as it was before rich text landed, kept here as
  // the reference the new renderer must still match for any value holding no
  // `*`, `_`, or newline.
  function renderTemplateBefore(
    html: string,
    slots: Record<string, string>,
    p: Palette,
    media?: RenderMedia,
    hidden?: string[]
  ): string {
    const hiddenSet = new Set(
      (hidden ?? []).filter((k) => typeof k === "string" && /^[A-Z0-9_]+$/.test(k))
    )
    const hiddenKeys = [...hiddenSet]
    const paletteMap: Record<string, string> = {
      PRIMARY: p.primary,
      PRIMARY_LIGHT: p.light,
      PRIMARY_DARK: p.dark,
      HERO_GRAD: p.heroGrad,
      LIGHT_BG: p.lightBg,
      DECOR_PATTERN: p.decorPattern,
      DECOR_SIZE: p.decorSize,
      ...mediaMap(media),
    }
    const filled = html.replace(/\{\{([A-Z0-9_]+)\}\}/g, (_m, key: string) => {
      if (key in paletteMap) return paletteMap[key]
      if (hiddenSet.has(key)) return ""
      if (key === "CTA_ICON") return ctaIconSvg(slots[key])
      if (key in slots) return escapeHtml(slots[key])
      return ""
    })
    if (hiddenKeys.length === 0) return filled
    const rules = hiddenKeys.map((k) => `[data-slot="${k}"]{display:none !important}`).join("")
    const styleTag = `<style>${rules}</style>`
    const headClose = filled.indexOf("</head>")
    return headClose < 0
      ? styleTag + filled
      : filled.slice(0, headClose) + styleTag + filled.slice(headClose)
  }

  const doc =
    `<html><head><style>:root{--bg:{{BG_IMAGE}};--o:{{BG_OPACITY}};--p:{{PRIMARY}};--g:{{HERO_GRAD}}}</style></head>` +
    `<body><span data-slot="LABEL">{{LABEL}}</span><h1 data-slot="STAT">{{STAT}}</h1>` +
    `<p data-slot="TAGLINE">{{TAGLINE}}</p><span data-slot="CTA">{{CTA}}{{CTA_ICON}}</span><i>{{MISSING}}</i></body></html>`

  const values: Record<string, string>[] = [
    {},
    { LABEL: "Fan Attendance · 2025", STAT: "2.4M", TAGLINE: "fans connected to their favorite moments." },
    { LABEL: "Q&A", STAT: '"98%"', TAGLINE: "<b>not a tag</b> & 'quoted'", CTA: "Book a Demo", CTA_ICON: "calendar" },
    { STAT: "12", CTA: "Learn more", CTA_ICON: "none" },
  ]

  it.each(values.map((v, i) => [i, v] as const))(
    "no-marker slot set #%i renders byte-identically to the pre-change substitution",
    (_i, slots) => {
      for (const media of [undefined, { bgImage: "data:image/png;base64,AA", bgOpacity: 60 }]) {
        for (const hidden of [undefined, [], ["TAGLINE"], ["LABEL", "CTA_ICON"]]) {
          expect(renderTemplate(doc, slots, palette, media, hidden)).toBe(
            renderTemplateBefore(doc, slots, palette, media, hidden)
          )
        }
      }
    }
  )

  it("every shipped template's sampleData is marker-free and renders byte-identically", () => {
    for (const t of templateRegistry["social-post"]) {
      expect(Object.values(t.sampleData).join("\u0000")).not.toMatch(/[*_\r\n]/)
      expect(renderTemplate(doc, t.sampleData, palette)).toBe(renderTemplateBefore(doc, t.sampleData, palette))
    }
  })
})
