"use client"

import { useState, useEffect, useRef, useCallback, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { ChevronDown, Copy, Check, Sparkles, ArrowRight } from "lucide-react"
import Image from "next/image"
import {
  motions,
  comparisonTable,
  personaFeatureMap,
  leadMagnets,
  linkedInOutreach,
  entevatePositioning,
} from "@/lib/gtm/data/trade-shows"
import type { GTMLayer } from "@/lib/gtm/data/trade-shows"
import ContentBuilder from "@/components/gtm/tabs/ContentBuilder"
import ContentLibrary from "@/components/gtm/tabs/ContentLibrary"
import LibraryCountBadge from "@/components/gtm/LibraryCountBadge"
import CustomerJourneyMap from "@/components/gtm/CustomerJourneyMap"

const font = "'Inter', system-ui, -apple-system, sans-serif"

/* ── Stat Chip ── */
function StatChip({ label }: { label: string }) {
  return (
    <div
      style={{
        background: "var(--gtm-bg-card)",
        border: "1px solid var(--gtm-border)",
        borderRadius: 8,
        padding: "8px 14px",
        fontSize: 13,
        fontWeight: 600,
        color: "var(--gtm-text-primary)",
        fontFamily: font,
        whiteSpace: "nowrap",
        transition: "all 200ms ease",
      }}
    >
      {label}
    </div>
  )
}

/* ── Number Pill ── */
function NumberPill({ num }: { num: number }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 28,
        height: 28,
        borderRadius: "50%",
        background: "var(--gtm-accent-grad)",
        fontSize: 13,
        fontWeight: 800,
        color: "#FFFFFF",
        fontFamily: font,
        flexShrink: 0,
      }}
    >
      {num}
    </span>
  )
}

/* ── Copy Button ── */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    },
    [text]
  )

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={handleCopy}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleCopy(e as any) }}
      title="Copy to clipboard"
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: 4,
        color: copied ? "var(--gtm-accent)" : "var(--gtm-text-faint)",
        transition: "color 200ms ease",
        display: "flex",
        alignItems: "center",
        gap: 4,
        fontSize: 11,
        fontFamily: font,
      }}
    >
      {copied ? (
        <>
          <Check size={14} /> Copied
        </>
      ) : (
        <Copy size={14} />
      )}
    </span>
  )
}

/* ── Layer Accordion Card ── */
function LayerCard({
  layer,
  defaultOpen,
}: {
  layer: GTMLayer
  defaultOpen: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  const bodyRef = useRef<HTMLDivElement>(null)
  const [bodyHeight, setBodyHeight] = useState(0)

  useEffect(() => {
    if (bodyRef.current) {
      setBodyHeight(bodyRef.current.scrollHeight)
    }
  }, [open, layer])

  // Build plain text for copy
  const plainText = layer.sections
    .map((s) => (s.heading ? `${s.heading}\n${s.body}` : s.body))
    .join("\n\n")

  return (
    <div
      style={{
        background: "var(--gtm-layer-bg)",
        border: "1px solid var(--gtm-border)",
        borderRadius: 12,
        overflow: "hidden",
        transition: "all 200ms ease",
      }}
    >
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "16px 24px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          transition: "background 150ms ease",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "var(--gtm-layer-hover)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "transparent")
        }
      >
        <NumberPill num={layer.id} />
        <span
          style={{
            flex: 1,
            textAlign: "left",
            fontSize: 15,
            fontWeight: 700,
            color: "var(--gtm-text-primary)",
            fontFamily: font,
            transition: "color 200ms ease",
          }}
        >
          {layer.label}
        </span>
        <CopyButton text={plainText} />
        <ChevronDown
          size={16}
          style={{
            color: "var(--gtm-text-faint)",
            transition: "transform 300ms ease",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {/* Body */}
      <div
        style={{
          maxHeight: open ? bodyHeight : 0,
          overflow: "hidden",
          transition: "max-height 300ms ease",
        }}
      >
        <div ref={bodyRef} style={{ padding: "0 24px 24px 64px" }}>
          {layer.sections.map((section, i) => (
            <div key={i} style={{ marginTop: i === 0 ? 0 : 20 }}>
              {section.heading && (
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--gtm-text-primary)",
                    fontFamily: font,
                    marginBottom: 6,
                    transition: "color 200ms ease",
                  }}
                >
                  {section.heading}
                </p>
              )}
              <p
                style={{
                  fontSize: 14,
                  color: "var(--gtm-text-muted)",
                  fontFamily: font,
                  lineHeight: 1.7,
                  whiteSpace: "pre-line",
                  transition: "color 200ms ease",
                }}
              >
                {section.body}
              </p>
            </div>
          ))}

          {/* Render comparison table inline for Layer 7 Heavy Equipment */}
          {layer.id === 7 &&
            layer.sections[0]?.body.includes("structured table") && (
              <ComparisonTable />
            )}
        </div>
      </div>
    </div>
  )
}

/* ── Comparison Table ── */
function ComparisonTable() {
  return (
    <div
      style={{
        overflowX: "auto",
        marginTop: 16,
        border: "1px solid var(--gtm-border)",
        borderRadius: 10,
        transition: "border-color 200ms ease",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "separate",
          borderSpacing: 0,
          fontFamily: font,
          fontSize: 12,
        }}
      >
        <thead>
          <tr>
            {comparisonTable.headers.map((h) => (
              <th
                key={h}
                style={{
                  textAlign: "left",
                  padding: "10px 14px",
                  fontWeight: 600,
                  color: "var(--gtm-text-faint)",
                  background: "var(--gtm-bg-page)",
                  borderBottom: "1px solid var(--gtm-border)",
                  whiteSpace: "nowrap",
                  transition: "all 200ms ease",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {comparisonTable.rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  style={{
                    padding: "10px 14px",
                    color:
                      j === 1
                        ? "var(--gtm-accent)"
                        : "var(--gtm-text-muted)",
                    fontWeight: j === 0 ? 600 : 400,
                    borderBottom:
                      i < comparisonTable.rows.length - 1
                        ? "1px solid var(--gtm-border)"
                        : "none",
                    transition: "all 200ms ease",
                    minWidth: j === 0 ? 180 : 140,
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ── Main Page ── */
function TradeShowsContent() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<"framework" | "builder" | "library">(
    searchParams.get("builder") === "true" ? "builder" : "framework"
  )
  const [motionIndex, setMotionIndex] = useState(0)
  const [verticalIndex, setVerticalIndex] = useState(0)

  const currentMotion = motions[motionIndex]
  const currentVertical = currentMotion.verticals[verticalIndex] || currentMotion.verticals[0]
  const layers = currentVertical?.layers || []

  // Reset vertical when switching motion
  useEffect(() => {
    setVerticalIndex(0)
  }, [motionIndex])

  return (
    <div data-solution="trade-shows">
      {/* ── Page Header ── */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "48px 48px 0",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          <div>
            <Image
              src="/Momentify-Icon.svg"
              alt="Momentify"
              width={28}
              height={28}
              style={{ height: 28, width: "auto", marginBottom: 14 }}
            />
            <p
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "var(--gtm-accent)",
                letterSpacing: "0.14em",
                fontFamily: font,
                marginBottom: 10,
                textTransform: "uppercase",
              }}
            >
              SOLUTION 01 — TRADE SHOWS & EXHIBITS
            </p>
            <h1
              style={{
                fontSize: 32,
                fontWeight: 300,
                color: "var(--gtm-text-primary)",
                fontFamily: font,
                margin: 0,
                transition: "color 200ms ease",
              }}
            >
              Trade Shows & Exhibits
            </h1>
            <p
              style={{
                fontSize: 16,
                fontWeight: 400,
                color: "var(--gtm-text-muted)",
                fontFamily: font,
                marginTop: 8,
                transition: "color 200ms ease",
              }}
            >
              Two motions. Three verticals. Seven layers.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <StatChip label="2 Motions" />
            <StatChip label="3 Verticals" />
            <StatChip label="7 Layers" />
          </div>
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "var(--gtm-bg-card)",
          borderBottom: "1px solid var(--gtm-border)",
          marginTop: 32,
          transition: "all 200ms ease",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 48px",
            display: "flex",
            gap: 0,
          }}
        >
          {(
            [
              { key: "framework", label: "Framework", icon: null },
              { key: "builder", label: "Content Builder", icon: Sparkles },
              { key: "library", label: "Library", icon: null },
            ] as const
          ).map((tab) => {
            const active = activeTab === tab.key
            const Icon = tab.icon
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  height: 44,
                  padding: "0 20px",
                  background: "transparent",
                  border: "none",
                  borderBottom: active
                    ? "2px solid var(--gtm-accent)"
                    : "2px solid transparent",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: font,
                  color: active
                    ? "var(--gtm-accent)"
                    : "var(--gtm-text-muted)",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  transition: "all 200ms ease",
                }}
              >
                {Icon && <Icon size={14} />}
                {tab.label}
                {tab.key === "library" && <LibraryCountBadge solution="trade-shows" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Tab Content ── */}
      {activeTab === "builder" ? (
        <ContentBuilder
          solution="trade-shows"
          solutionLabel="Trade Shows & Exhibits"
          verticals={[
            { id: "general", label: "General / All Industries" },
            { id: "heavy-equipment", label: "Heavy Equipment" },
            { id: "energy-infrastructure", label: "Energy, Infrastructure & Power" },
            { id: "aerospace-aviation", label: "Aerospace & Aviation" },
          ]}
        />
      ) : activeTab === "library" ? (
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 48px 80px" }}>
          <ContentLibrary solution="trade-shows" solutionLabel="Trade Shows & Exhibits" />
        </div>
      ) : (
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "32px 48px 80px",
          }}
        >
            {/* Motion Selector */}
            <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
              {motions.map((m, i) => {
                const selected = motionIndex === i
                return (
                  <button
                    key={m.motion}
                    onClick={() => setMotionIndex(i)}
                    style={{
                      padding: "10px 20px",
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 600,
                      fontFamily: font,
                      cursor: "pointer",
                      border: selected
                        ? "1px solid transparent"
                        : "1px solid var(--gtm-border)",
                      background: selected
                        ? "var(--gtm-text-primary)"
                        : "var(--gtm-bg-card)",
                      color: selected
                        ? "var(--gtm-bg-page)"
                        : "var(--gtm-text-primary)",
                      transition: "all 150ms ease",
                    }}
                  >
                    {m.label}
                  </button>
                )
              })}
            </div>

            {/* Vertical Tabs (Direct motion only) */}
            {currentMotion.motion === "direct" && (
              <div
                style={{
                  display: "flex",
                  gap: 0,
                  borderBottom: "1px solid var(--gtm-border)",
                  marginBottom: 32,
                  transition: "border-color 200ms ease",
                }}
              >
                {currentMotion.verticals.map((v, i) => {
                  const active = verticalIndex === i
                  return (
                    <button
                      key={v.vertical}
                      onClick={() => setVerticalIndex(i)}
                      style={{
                        padding: "10px 20px",
                        background: "transparent",
                        border: "none",
                        borderBottom: active
                          ? "2px solid var(--gtm-accent)"
                          : "2px solid transparent",
                        cursor: "pointer",
                        fontSize: 14,
                        fontWeight: 500,
                        fontFamily: font,
                        color: active
                          ? "var(--gtm-accent)"
                          : "var(--gtm-text-muted)",
                        transition: "all 200ms ease",
                      }}
                    >
                      {v.label}
                    </button>
                  )
                })}
              </div>
            )}

            {/* Layer Cards */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: 12 }}
            >
              {layers.map((layer, i) => (
                <LayerCard
                  key={`${currentMotion.motion}-${currentVertical.vertical}-${layer.id}`}
                  layer={layer}
                  defaultOpen={i === 0}
                />
              ))}
            </div>

            <CustomerJourneyMap solution="trade-shows" solutionLabel="Trade Shows & Exhibits" />

            {/* ── Supplemental: Persona Feature Mapping ── */}
            <section style={{ marginTop: 56 }}>
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 500,
                  color: "var(--gtm-text-primary)",
                  fontFamily: font,
                  margin: 0,
                  marginBottom: 20,
                  transition: "color 200ms ease",
                }}
              >
                Persona Feature Mapping
              </h2>
              {personaFeatureMap.map((pm) => (
                <div key={pm.persona} style={{ marginBottom: 24 }}>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "var(--gtm-text-primary)",
                      fontFamily: font,
                      marginBottom: 12,
                      transition: "color 200ms ease",
                    }}
                  >
                    {pm.persona}
                  </p>
                  <div
                    style={{
                      overflowX: "auto",
                      border: "1px solid var(--gtm-border)",
                      borderRadius: 10,
                      transition: "border-color 200ms ease",
                    }}
                  >
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "separate",
                        borderSpacing: 0,
                        fontFamily: font,
                        fontSize: 12,
                      }}
                    >
                      <thead>
                        <tr>
                          {["Pain Point", "Objective", "KPI", "Primary Features", "Competitive Advantage"].map(
                            (h) => (
                              <th
                                key={h}
                                style={{
                                  textAlign: "left",
                                  padding: "10px 14px",
                                  fontWeight: 600,
                                  color: "var(--gtm-text-faint)",
                                  background: "var(--gtm-bg-page)",
                                  borderBottom: "1px solid var(--gtm-border)",
                                  whiteSpace: "nowrap",
                                  transition: "all 200ms ease",
                                }}
                              >
                                {h}
                              </th>
                            )
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {pm.rows.map((row, ri) => (
                          <tr key={ri}>
                            {[row.painPoint, row.objective, row.kpi, row.primaryFeatures, row.competitiveAdvantage].map(
                              (cell, ci) => (
                                <td
                                  key={ci}
                                  style={{
                                    padding: "10px 14px",
                                    color: "var(--gtm-text-muted)",
                                    borderBottom:
                                      ri < pm.rows.length - 1
                                        ? "1px solid var(--gtm-border)"
                                        : "none",
                                    transition: "all 200ms ease",
                                    minWidth: 150,
                                  }}
                                >
                                  {cell}
                                </td>
                              )
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </section>

            {/* ── Supplemental: Lead Magnets ── */}
            <section style={{ marginTop: 56 }}>
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 500,
                  color: "var(--gtm-text-primary)",
                  fontFamily: font,
                  margin: 0,
                  marginBottom: 20,
                  transition: "color 200ms ease",
                }}
              >
                Lead Magnet Library
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: 12,
                }}
              >
                {leadMagnets.map((lm) => (
                  <div
                    key={lm.title}
                    style={{
                      background: "var(--gtm-bg-card)",
                      border: "1px solid var(--gtm-border)",
                      borderRadius: 10,
                      padding: 20,
                      transition: "all 200ms ease",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: "0.02em",
                        padding: "3px 8px",
                        borderRadius: 4,
                        background: "var(--gtm-accent-bg, var(--gtm-tag-bg))",
                        color: "var(--gtm-accent-text, var(--gtm-tag-text))",
                        fontFamily: font,
                      }}
                    >
                      {lm.format}
                    </span>
                    <p
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "var(--gtm-text-primary)",
                        fontFamily: font,
                        marginTop: 10,
                        transition: "color 200ms ease",
                      }}
                    >
                      {lm.title}
                    </p>
                    <p
                      style={{
                        fontSize: 12,
                        color: "var(--gtm-text-muted)",
                        fontFamily: font,
                        marginTop: 6,
                        lineHeight: 1.6,
                        transition: "color 200ms ease",
                      }}
                    >
                      {lm.problem}
                    </p>
                    <p
                      style={{
                        fontSize: 11,
                        color: "var(--gtm-text-faint)",
                        fontFamily: font,
                        marginTop: 8,
                        transition: "color 200ms ease",
                      }}
                    >
                      Audience: {lm.audience}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Supplemental: LinkedIn Outreach Templates ── */}
            <section style={{ marginTop: 56 }}>
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 500,
                  color: "var(--gtm-text-primary)",
                  fontFamily: font,
                  margin: 0,
                  marginBottom: 20,
                  transition: "color 200ms ease",
                }}
              >
                LinkedIn Outreach Templates
              </h2>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {linkedInOutreach.map((lo) => (
                  <div
                    key={lo.segment}
                    style={{
                      background: "var(--gtm-bg-card)",
                      border: "1px solid var(--gtm-border)",
                      borderRadius: 10,
                      padding: "16px 20px",
                      transition: "all 200ms ease",
                    }}
                  >
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "var(--gtm-text-primary)",
                        fontFamily: font,
                        transition: "color 200ms ease",
                      }}
                    >
                      {lo.segment}
                      {lo.subsegment && (
                        <span
                          style={{
                            fontWeight: 400,
                            color: "var(--gtm-text-faint)",
                            marginLeft: 8,
                          }}
                        >
                          {lo.subsegment}
                        </span>
                      )}
                    </p>
                    <p
                      style={{
                        fontSize: 13,
                        color: "var(--gtm-text-muted)",
                        fontFamily: font,
                        marginTop: 8,
                        lineHeight: 1.65,
                        whiteSpace: "pre-line",
                        transition: "color 200ms ease",
                      }}
                    >
                      {lo.message}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Supplemental: ENTEVATE Positioning ── */}
            <section style={{ marginTop: 56, marginBottom: 40 }}>
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 500,
                  color: "var(--gtm-text-primary)",
                  fontFamily: font,
                  margin: 0,
                  transition: "color 200ms ease",
                }}
              >
                {entevatePositioning.headline}
              </h2>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--gtm-text-muted)",
                  fontFamily: font,
                  marginTop: 8,
                  marginBottom: 24,
                  lineHeight: 1.65,
                  transition: "color 200ms ease",
                }}
              >
                {entevatePositioning.subhead}
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: 12,
                }}
              >
                {entevatePositioning.expertiseAreas.map((ea) => (
                  <div
                    key={ea.title}
                    style={{
                      background: "var(--gtm-bg-card)",
                      border: "1px solid var(--gtm-border)",
                      borderRadius: 10,
                      padding: 20,
                      transition: "all 200ms ease",
                    }}
                  >
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "var(--gtm-text-primary)",
                        fontFamily: font,
                        transition: "color 200ms ease",
                      }}
                    >
                      {ea.title}
                    </p>
                    <p
                      style={{
                        fontSize: 12,
                        color: "var(--gtm-text-muted)",
                        fontFamily: font,
                        marginTop: 6,
                        lineHeight: 1.6,
                        transition: "color 200ms ease",
                      }}
                    >
                      {ea.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
        </div>
      )}
    </div>
  )
}

export default function TradeShowsPage() {
  return (
    <Suspense>
      <TradeShowsContent />
    </Suspense>
  )
}
