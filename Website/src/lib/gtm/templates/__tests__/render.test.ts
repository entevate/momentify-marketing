import { renderTemplate } from "../render"
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
