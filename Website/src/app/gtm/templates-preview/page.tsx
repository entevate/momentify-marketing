"use client"

import CanvasEditor from "@/components/social-toolkit/CanvasEditor"
import { brands, type AspectRatio } from "@/components/social-toolkit/backgroundData"

const font = "'Inter', system-ui, -apple-system, sans-serif"

const solutionBrands = [
  { brandId: "trade-shows", label: "Trade Shows & Exhibits", accent: "#6B21D4" },
  { brandId: "recruiting", label: "Technical Recruiting", accent: "#5FD9C2" },
  { brandId: "field-sales", label: "Field Sales Enablement", accent: "#F2B33D" },
  { brandId: "facilities", label: "Facilities", accent: "#7B62C9" },
  { brandId: "venues", label: "Events & Venues", accent: "#F25E3D" },
  { brandId: "momentify", label: "Momentify (Base)", accent: "#0CF4DF" },
]

const sampleHeadlines: Record<string, string> = {
  "trade-shows": "Your booth is full. Do you know what it returned?",
  recruiting: "You met 200 candidates. How many were qualified?",
  "field-sales": "Your rep was on the job site. Do you know what moved?",
  facilities: "You built the showroom. Can you prove what it produces?",
  venues: "The suite was sold out. Do you know who was inside?",
  momentify: "Stop paying for moments you can't measure.",
}

const sampleSubheads: Record<string, string> = {
  "trade-shows": "Measure engagement. Prove ROX. Win the next budget conversation.",
  recruiting: "Capture intent, not just resumes. Follow up while it still matters.",
  "field-sales": "Real-time customer engagement intelligence for every field visit.",
  facilities: "Turn every facility visit into a measured, pipeline-driving interaction.",
  venues: "From anonymous attendance to actionable guest intelligence.",
  momentify: "Engagement intelligence for teams who need outcomes, not dashboards.",
}

type LayoutVariant = {
  label: string
  textPosition: "top" | "center" | "bottom"
  headlineFontSize: number
  headlineFontWeight: number
  subheadFontSize: number
  subheadFontWeight: number
  headlineAlign: "left" | "center" | "right"
  subheadAlign: "left" | "center" | "right"
  layoutMargin: number
}

const layoutVariants: LayoutVariant[] = [
  {
    label: "3XL",
    textPosition: "center",
    headlineFontSize: 108,
    headlineFontWeight: 600,
    subheadFontSize: 44,
    subheadFontWeight: 300,
    headlineAlign: "left",
    subheadAlign: "left",
    layoutMargin: 60,
  },
  {
    label: "Statement",
    textPosition: "center",
    headlineFontSize: 120,
    headlineFontWeight: 600,
    subheadFontSize: 48,
    subheadFontWeight: 300,
    headlineAlign: "left",
    subheadAlign: "left",
    layoutMargin: 60,
  },
]

const previewAspects: { key: AspectRatio; label: string; fontScale: number; marginScale: number; logoScale: number }[] = [
  { key: "4:5", label: "Instagram (4:5)", fontScale: 1.09, marginScale: 1.5, logoScale: 127 },
  { key: "1:1", label: "Square (1:1)", fontScale: 1.1, marginScale: 1.3, logoScale: 127 },
  { key: "1.91:1", label: "LinkedIn (1.91:1)", fontScale: 0.696, marginScale: 1.0, logoScale: 100 },
  { key: "16:9", label: "Twitter/X (16:9)", fontScale: 0.66, marginScale: 1.0, logoScale: 100 },
]

export default function TemplatesPreview() {
  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "48px 48px 120px" }}>
      <h1
        style={{
          fontSize: 36,
          fontWeight: 300,
          color: "var(--gtm-text-primary)",
          fontFamily: font,
          margin: 0,
          transition: "color 200ms ease",
        }}
      >
        Social Graphic Templates
      </h1>
      <p
        style={{
          fontSize: 16,
          color: "var(--gtm-text-muted)",
          fontFamily: font,
          marginTop: 8,
          marginBottom: 48,
          transition: "color 200ms ease",
        }}
      >
        All branded backgrounds by solution with 6 layout variations each. Rendered at 1:1 for comparison.
      </p>

      {solutionBrands.map(({ brandId, label, accent }) => {
        const brand = brands.find((b) => b.id === brandId)
        if (!brand) return null

        return (
          <section key={brandId} style={{ marginBottom: 80 }}>
            {/* Solution header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 32,
              }}
            >
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: accent,
                  flexShrink: 0,
                }}
              />
              <h2
                style={{
                  fontSize: 24,
                  fontWeight: 500,
                  color: "var(--gtm-text-primary)",
                  fontFamily: font,
                  margin: 0,
                  transition: "color 200ms ease",
                }}
              >
                {label}
              </h2>
              <span
                style={{
                  fontSize: 12,
                  color: "var(--gtm-text-faint)",
                  fontFamily: font,
                }}
              >
                {brand.backgrounds.length} backgrounds x {layoutVariants.length} layouts = {brand.backgrounds.length * layoutVariants.length} variations
              </span>
            </div>

            {/* Each background */}
            {brand.backgrounds.map((bg) => (
              <div key={bg.id} style={{ marginBottom: 48 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 14,
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--gtm-text-primary)",
                      fontFamily: font,
                      transition: "color 200ms ease",
                    }}
                  >
                    {bg.label}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: 4,
                      background: bg.isLight
                        ? "rgba(6,19,65,0.06)"
                        : "rgba(255,255,255,0.08)",
                      color: "var(--gtm-text-faint)",
                      fontFamily: font,
                    }}
                  >
                    {bg.isLight ? "Light" : "Dark"}
                  </span>
                  {bg.pattern && (
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "2px 8px",
                        borderRadius: 4,
                        background: "var(--gtm-accent-bg)",
                        color: "var(--gtm-accent-text)",
                        fontFamily: font,
                      }}
                    >
                      {bg.pattern}
                    </span>
                  )}
                </div>

                {/* Layout variants x aspect ratios */}
                {layoutVariants.map((layout) => (
                  <div key={layout.label} style={{ marginBottom: 24 }}>
                    <p
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--gtm-text-primary)",
                        fontFamily: font,
                        marginBottom: 10,
                        transition: "color 200ms ease",
                      }}
                    >
                      {layout.label}
                      <span style={{ fontWeight: 400, marginLeft: 6, opacity: 0.5, fontSize: 11 }}>
                        {layout.headlineFontSize}px / w{layout.headlineFontWeight}
                      </span>
                    </p>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: 16,
                      }}
                    >
                      {previewAspects.map(({ key: ar, label: arLabel, fontScale, marginScale, logoScale }) => (
                        <div key={ar}>
                          <p
                            style={{
                              fontSize: 11,
                              fontWeight: 600,
                              color: "var(--gtm-text-faint)",
                              fontFamily: font,
                              marginBottom: 6,
                              letterSpacing: "0.04em",
                            }}
                          >
                            {arLabel}
                          </p>
                          <div
                            style={{
                              borderRadius: 8,
                              overflow: "hidden",
                              border: "1px solid var(--gtm-border)",
                            }}
                          >
                            <div style={{ pointerEvents: "none" }}>
                              <CanvasEditor
                                aspectRatio={ar}
                                background={bg}
                                brandId={brandId}
                                headline={sampleHeadlines[brandId] || "Your headline here"}
                                subhead={sampleSubheads[brandId] || "Supporting message"}
                                bodyCopy=""
                                textPosition={layout.textPosition}
                                showLogo={true}
                                logoVariant="auto"
                                logoScale={logoScale}
                                showUrl={false}
                                urlScale={100}
                                headlineFontSize={Math.round(layout.headlineFontSize * fontScale)}
                                headlineFontWeight={layout.headlineFontWeight}
                                subheadFontSize={Math.round(layout.subheadFontSize * fontScale)}
                                subheadFontWeight={layout.subheadFontWeight}
                                bodyFontSize={Math.round(18 * fontScale)}
                                bodyFontWeight={300}
                                headlineAlign={layout.headlineAlign}
                                subheadAlign={layout.subheadAlign}
                                bodyAlign="left"
                                layoutMargin={Math.round(layout.layoutMargin * marginScale)}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {/* Divider */}
            <div
              style={{
                height: 1,
                background: "var(--gtm-border)",
                marginTop: 16,
              }}
            />
          </section>
        )
      })}
    </div>
  )
}
