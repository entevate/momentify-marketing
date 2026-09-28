import {
  buildCarouselShell,
  carouselAspectFor,
  carouselIneligibleReason,
  carouselShellSize,
  carouselTemplates,
  isCarouselEligible,
  preferredCarouselTemplateId,
} from "@/lib/gtm/carousel"
import { allTemplates } from "@/lib/gtm/templates/_registry"
import type { TemplateManifest } from "@/lib/gtm/templates/types"

const t = (id: string, aspectRatio: string, assetType = "social-post") =>
  ({ id, aspectRatio, assetType }) as unknown as Pick<TemplateManifest, "id" | "assetType" | "aspectRatio">

const palette = { primary: "#0af", light: "#6cf", dark: "#036", heroGrad: "linear-gradient(#000,#111)" }

describe("isCarouselEligible", () => {
  it("accepts 4:5 and 1:1 social-post templates", () => {
    expect(isCarouselEligible(t("bold-stat-34", "4:5"))).toBe(true)
    expect(isCarouselEligible(t("bold-stat-1x1", "1:1"))).toBe(true)
  })

  it("rejects 16:9 with a message naming the allowed aspects", () => {
    expect(isCarouselEligible(t("bold-stat-169", "16:9"))).toBe(false)
    expect(carouselIneligibleReason(t("bold-stat-169", "16:9"))).toMatch(/16:9.*4:5.*1:1/)
  })

  it("rejects non-social templates even at a carousel aspect", () => {
    expect(isCarouselEligible(t("some-infographic", "4:5", "infographic"))).toBe(false)
    expect(carouselIneligibleReason(t("some-infographic", "4:5", "infographic"))).toMatch(/social-post/)
  })

  it("excludes the fixed-content ROX families at every aspect, with a reason", () => {
    for (const id of ["rox-gauge-11", "rox-gauge-45", "rox-tiers-11", "rox-tiers-45", "rox-dimensions-11", "rox-dimensions-45"]) {
      const aspect = id.endsWith("45") ? "4:5" : "1:1"
      expect(isCarouselEligible(t(id, aspect))).toBe(false)
      expect(carouselIneligibleReason(t(id, aspect))).toMatch(/can't be a carousel card/)
    }
    // rox-report is a different family and stays eligible.
    expect(isCarouselEligible(t("rox-report-34", "4:5"))).toBe(true)
  })
})

describe("carouselTemplates against the real registry", () => {
  it("lists every eligible template, 4:5 first, and keeps the original five 1:1 ids", () => {
    expect(carouselTemplates(allTemplates).map((m) => m.id)).toEqual([
      "bold-stat-34",
      "headline-quote-34",
      "wide-banner-34",
      "rox-report-34",
      "solution-feature-34",
      "bold-stat-1x1",
      "headline-quote-11",
      "wide-banner-11",
      "rox-report-11",
      "solution-feature-11",
    ])
  })
})

describe("preferredCarouselTemplateId", () => {
  it("defaults to the first 4:5 template", () => {
    expect(preferredCarouselTemplateId(null)).toBe("bold-stat-34")
  })
  it("keeps a 4:5 carousel pick and swaps a 1:1 or 16:9 pick for its 4:5 twin", () => {
    expect(preferredCarouselTemplateId("rox-report-34")).toBe("rox-report-34")
    expect(preferredCarouselTemplateId("headline-quote-11")).toBe("headline-quote-34")
    expect(preferredCarouselTemplateId("bold-stat-1x1")).toBe("bold-stat-34")
    expect(preferredCarouselTemplateId("wide-banner-169")).toBe("wide-banner-34")
  })
  it("falls back to the default for an excluded family", () => {
    expect(preferredCarouselTemplateId("rox-gauge-45")).toBe("bold-stat-34")
  })
})

describe("carouselAspectFor", () => {
  it("prefers the stored aspect, then the template's manifest, then 1:1", () => {
    expect(carouselAspectFor("bold-stat-1x1", "4:5")).toBe("4:5")
    expect(carouselAspectFor("bold-stat-34", null)).toBe("4:5")
    expect(carouselAspectFor("bold-stat-1x1", undefined)).toBe("1:1")
    expect(carouselAspectFor(null, null)).toBe("1:1")
    expect(carouselAspectFor("no-such-template", "16:9")).toBe("1:1")
  })
})

describe("buildCarouselShell", () => {
  const urls = Array.from({ length: 6 }, (_, i) => `https://blob.test/c${i + 1}.html`)

  it("gives a 4:5 carousel a portrait track at the same height budget", () => {
    const html = buildCarouselShell(urls, palette, "4:5")
    expect(html).toContain("aspect-ratio: 4 / 5")
    expect(html).toContain("min(432px, 100%, calc((100vh - 2 * var(--pad-y)) * 4 / 5))")
    expect(html).not.toContain("aspect-ratio: 1 / 1")
    expect(carouselShellSize("4:5")).toEqual({ width: 560, height: 588 })
  })

  it("keeps a 1:1 carousel square at 540px (and defaults to 1:1)", () => {
    for (const html of [buildCarouselShell(urls, palette, "1:1"), buildCarouselShell(urls, palette)]) {
      expect(html).toContain("aspect-ratio: 1 / 1")
      expect(html).toContain("min(540px, 100%,")
    }
    expect(carouselShellSize("1:1")).toEqual({ width: 668, height: 588 })
  })

  it("escapes card URLs and emits one frame and one dot per card", () => {
    const html = buildCarouselShell(['https://x.test/a"b.html', ...urls.slice(1)], palette, "4:5")
    expect(html).toContain("a&quot;b.html")
    expect(html.match(/<iframe /g)).toHaveLength(6)
    expect(html.match(/class="dot( active)?"/g)).toHaveLength(6)
  })
})
