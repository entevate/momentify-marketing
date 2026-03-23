"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const font = "'Inter', system-ui, -apple-system, sans-serif"

const solutions = [
  {
    id: "trade-shows",
    label: "Trade Shows & Exhibits",
    icon: "\u{1F3DB}",
    priority: "NOW" as const,
    desc: "Turn booth investment into measurable ROX.",
    antiIcp: "Event planners without exhibitor clients. Consumer shows.",
    href: "/gtm/trade-shows",
  },
  {
    id: "recruiting",
    label: "Technical Recruiting",
    icon: "\u{1F3AF}",
    priority: "NOW" as const,
    desc: "Capture, engage, and follow up with top talent.",
    antiIcp: "High-volume hourly recruiting. Non-technical roles.",
    href: "/gtm/recruiting",
  },
  {
    id: "field-sales",
    label: "Field Sales Enablement",
    icon: "\u{1F5FA}",
    priority: "NEXT" as const,
    desc: "Smart content delivery and intent capture in the field.",
    antiIcp: "Inside sales teams. Companies without field reps.",
    href: "/gtm/field-sales",
  },
  {
    id: "facilities",
    label: "Facilities",
    icon: "\u{1F3E2}",
    priority: "NEXT" as const,
    desc: "Showrooms, demo floors, and training centers.",
    antiIcp: "Office buildings without customer-facing traffic.",
    href: "/gtm/facilities",
  },
  {
    id: "events-venues",
    label: "Events & Venues",
    icon: "\u{1F3EA}",
    priority: "LATER" as const,
    desc: "Beyond ticket sales. Interactive branded experiences.",
    antiIcp: "Small community events. Non-commercial venues.",
    href: "/gtm/events-venues",
  },
]

const healthChecks = [
  {
    num: "01",
    title: "ICP and Anti-ICP",
    question:
      "Can you describe your ICP in 5 bullet points and your Anti-ICP in 3?",
    ask: "Who do you explicitly NOT want as a customer? Have you written it down?",
  },
  {
    num: "02",
    title: "Positioning Anchor",
    question:
      "Do buyers immediately understand what Momentify does and why it is different?",
    ask: "Can you explain the positioning for each solution vertical in one sentence without using the word 'platform'?",
  },
  {
    num: "03",
    title: "Channel Focus",
    question:
      "Are you trying to run more than 2 acquisition channels at once?",
    ask: "Which one channel is generating the most qualified conversations right now?",
  },
  {
    num: "04",
    title: "Attribution",
    question:
      "Do you know where your last 3 qualified leads came from?",
    ask: "Is there a required source field in your CRM for every new opportunity?",
  },
  {
    num: "05",
    title: "Lost Reasons",
    question:
      "When was the last time you reviewed why deals did not close?",
    ask: "Do you have a required lost reason field? Are you tracking it by vertical and motion?",
  },
  {
    num: "06",
    title: "Demo Quality",
    question:
      "In your last 3 demos, did you lead with discovery or product?",
    ask: "Did you know the Status Quo, Pain, Stakeholders, and Decision process before you showed anything?",
  },
]

const executionLayers = [
  {
    num: 1,
    label: "ICP + Buyer Personas",
    desc: "Who we target, their role, pain, budget authority, and Anti-ICP",
  },
  {
    num: 2,
    label: "Core Message + Proof",
    desc: "Positioning, differentiators, proof points per segment",
  },
  {
    num: 3,
    label: "Lead Magnets",
    desc: "ROX Audit, guides, templates, calculators",
  },
  {
    num: 4,
    label: "Outreach Sequences",
    desc: "Cold email, LinkedIn, and partner pitch flows",
  },
  {
    num: 5,
    label: "Sales Enablement",
    desc: "Discovery scripts, objection handling, one-pagers",
  },
  {
    num: 6,
    label: "ROX Metrics + KPIs",
    desc: "What success looks like and how we track it",
  },
  {
    num: 7,
    label: "Competitive Intel",
    desc: "Kill sheets vs category competitors, per vertical",
  },
]

type CoverageStatus = "active" | "scope" | "not"
const coverageData: {
  solution: string
  heavy: CoverageStatus
  energy: CoverageStatus
  aerospace: CoverageStatus
  sports: CoverageStatus
}[] = [
  { solution: "Trade Shows", heavy: "active", energy: "active", aerospace: "active", sports: "scope" },
  { solution: "Recruiting", heavy: "active", energy: "scope", aerospace: "scope", sports: "not" },
  { solution: "Field Sales", heavy: "active", energy: "scope", aerospace: "scope", sports: "not" },
  { solution: "Facilities", heavy: "active", energy: "scope", aerospace: "not", sports: "not" },
  { solution: "Events & Venues", heavy: "not", energy: "not", aerospace: "not", sports: "active" },
]

function NumberPill({ num }: { num: string | number }) {
  const size = typeof num === "number" ? 28 : 24
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #0CF4DF, #1A56DB)",
        fontSize: typeof num === "number" ? 13 : 11,
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

function PriorityBadge({ priority }: { priority: "NOW" | "NEXT" | "LATER" }) {
  const colors = {
    NOW: { bg: "rgba(12, 244, 223, 0.10)", text: "#0AA891" },
    NEXT: { bg: "rgba(242, 179, 61, 0.12)", text: "#D4940A" },
    LATER: { bg: "var(--gtm-border)", text: "var(--gtm-text-faint)" },
  }
  const c = colors[priority]
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.02em",
        padding: "4px 10px",
        borderRadius: 4,
        background: c.bg,
        color: c.text,
        fontFamily: font,
      }}
    >
      {priority}
    </span>
  )
}

function Tag({ label }: { label: string }) {
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.02em",
        padding: "4px 10px",
        borderRadius: 4,
        background: "var(--gtm-tag-bg)",
        color: "var(--gtm-tag-text)",
        fontFamily: font,
      }}
    >
      {label}
    </span>
  )
}

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

function CoverageCell({ status }: { status: CoverageStatus }) {
  if (status === "active") {
    return (
      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "var(--gtm-cyan)",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "var(--gtm-cyan)",
            fontFamily: font,
          }}
        >
          Active
        </span>
      </span>
    )
  }
  if (status === "scope") {
    return (
      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "var(--gtm-text-faint)",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontSize: 12,
            color: "var(--gtm-text-faint)",
            fontFamily: font,
          }}
        >
          In Scope
        </span>
      </span>
    )
  }
  return (
    <span
      style={{
        fontSize: 12,
        color: "var(--gtm-text-faint)",
        fontFamily: font,
      }}
    >
      &mdash;
    </span>
  )
}

export default function GTMDashboard() {
  const [progress, setProgress] = useState<Record<string, number>>({})

  useEffect(() => {
    const p: Record<string, number> = {}
    solutions.forEach((s) => {
      const val = localStorage.getItem(`gtm_progress_${s.id}`)
      p[s.id] = val ? parseInt(val, 10) : 0
    })
    setProgress(p)
  }, [])

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "48px 48px",
      }}
    >
      {/* ── Section 1: Page Header ── */}
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
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "var(--gtm-cyan)",
              letterSpacing: "0.14em",
              fontFamily: font,
              marginBottom: 10,
              textTransform: "uppercase",
            }}
          >
            GTM COMMAND CENTER
          </p>
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
            Go-to-Market Framework
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
            5 solutions. 3 verticals. 2 motions. 7 execution layers.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <StatChip label="5 Solutions" />
          <StatChip label="7 Execution Layers" />
          <StatChip label="2 GTM Motions" />
        </div>
      </div>

      {/* ── Section 2: GTM Health Check ── */}
      <section style={{ marginTop: 56 }}>
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
          GTM Health Check
        </h2>
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
          Six questions to run before any outreach or content push.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: 16,
            marginTop: 24,
          }}
        >
          {healthChecks.map((hc) => (
            <div
              key={hc.num}
              style={{
                background: "var(--gtm-bg-card)",
                border: "1px solid var(--gtm-border)",
                borderRadius: 12,
                padding: "20px 22px",
                transition: "all 200ms ease",
              }}
            >
              <NumberPill num={hc.num} />
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
                {hc.question}
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
                <span style={{ fontWeight: 600 }}>Ask yourself:</span> {hc.ask}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 3: Solution Cards ── */}
      <section style={{ marginTop: 56 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 16,
          }}
        >
          {solutions.map((s) => {
            const built = progress[s.id] || 0
            const pct = (built / 7) * 100
            return (
              <div
                key={s.id}
                style={{
                  background: "var(--gtm-bg-card)",
                  border: "1px solid var(--gtm-border)",
                  borderRadius: 12,
                  padding: 24,
                  transition: "all 200ms ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "var(--gtm-shadow-hover)"
                  e.currentTarget.style.transform = "translateY(-3px)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none"
                  e.currentTarget.style.transform = "translateY(0)"
                }}
              >
                {/* Row 1: icon + priority */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 24 }}>{s.icon}</span>
                  <PriorityBadge priority={s.priority} />
                </div>

                {/* Solution name */}
                <p
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "var(--gtm-text-primary)",
                    fontFamily: font,
                    marginTop: 12,
                    transition: "color 200ms ease",
                  }}
                >
                  {s.label}
                </p>

                {/* Description */}
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--gtm-text-muted)",
                    fontFamily: font,
                    marginTop: 6,
                    lineHeight: 1.6,
                    transition: "color 200ms ease",
                  }}
                >
                  {s.desc}
                </p>

                {/* Anti-ICP hint */}
                <p
                  style={{
                    fontSize: 11,
                    fontStyle: "italic",
                    color: "var(--gtm-text-faint)",
                    fontFamily: font,
                    marginTop: 8,
                    transition: "color 200ms ease",
                  }}
                >
                  Anti-ICP: {s.antiIcp}
                </p>

                {/* Layer progress */}
                <div style={{ marginTop: 16 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 12,
                      color: "var(--gtm-text-faint)",
                      fontFamily: font,
                      marginBottom: 6,
                      transition: "color 200ms ease",
                    }}
                  >
                    <span>Layers built</span>
                    <span>{built} / 7</span>
                  </div>
                  <div
                    style={{
                      height: 4,
                      borderRadius: 2,
                      background: "var(--gtm-border)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        borderRadius: 2,
                        background:
                          "linear-gradient(135deg, #0CF4DF, #1A56DB)",
                        transition: "width 300ms ease",
                      }}
                    />
                  </div>
                </div>

                {/* Footer link */}
                <Link
                  href={s.href}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--gtm-cyan)",
                    fontFamily: font,
                    textDecoration: "none",
                    marginTop: 16,
                  }}
                >
                  View Framework <ArrowRight size={14} />
                </Link>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Section 4: GTM Motions ── */}
      <section style={{ marginTop: 56 }}>
        <h2
          style={{
            fontSize: 24,
            fontWeight: 500,
            color: "var(--gtm-text-primary)",
            fontFamily: font,
            margin: 0,
            marginBottom: 24,
            transition: "color 200ms ease",
          }}
        >
          Two GTM Motions
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
          }}
        >
          {/* Motion A */}
          <div
            style={{
              background: "var(--gtm-bg-card)",
              border: "1px solid var(--gtm-border)",
              borderRadius: 12,
              padding: 24,
              transition: "all 200ms ease",
            }}
          >
            <Tag label="MOTION A" />
            <p
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "var(--gtm-text-primary)",
                fontFamily: font,
                marginTop: 12,
                transition: "color 200ms ease",
              }}
            >
              Direct to Customer
            </p>
            <p
              style={{
                fontSize: 14,
                color: "var(--gtm-text-muted)",
                fontFamily: font,
                marginTop: 8,
                lineHeight: 1.65,
                transition: "color 200ms ease",
              }}
            >
              We own the full sales motion. Target marketing and events
              decision-makers at OEMs, operators, and enterprise accounts.
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                marginTop: 16,
              }}
            >
              {[
                "VP Marketing",
                "Event Manager",
                "Marketing Director",
                "Business Dev Lead",
              ].map((r) => (
                <Tag key={r} label={r} />
              ))}
            </div>
            <p
              style={{
                fontSize: 12,
                color: "var(--gtm-text-faint)",
                fontFamily: font,
                marginTop: 12,
                transition: "color 200ms ease",
              }}
            >
              Verticals: Heavy Equipment, Energy & Infrastructure, Aerospace &
              Aviation
            </p>
          </div>

          {/* Motion B */}
          <div
            style={{
              background: "var(--gtm-bg-card)",
              border: "1px solid var(--gtm-border)",
              borderRadius: 12,
              padding: 24,
              transition: "all 200ms ease",
            }}
          >
            <Tag label="MOTION B" />
            <p
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "var(--gtm-text-primary)",
                fontFamily: font,
                marginTop: 12,
                transition: "color 200ms ease",
              }}
            >
              Channel Partners
            </p>
            <p
              style={{
                fontSize: 14,
                color: "var(--gtm-text-muted)",
                fontFamily: font,
                marginTop: 8,
                lineHeight: 1.65,
                transition: "color 200ms ease",
              }}
            >
              We arm partners with the intelligence layer. Target exhibit
              agencies, associations, and dealer networks.
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                marginTop: 16,
              }}
            >
              {[
                "Freeman",
                "Clarion Events",
                "Exhibit Houses",
                "AEM",
                "NDIA",
                "Cat Dealer Network",
              ].map((r) => (
                <Tag key={r} label={r} />
              ))}
            </div>
            <p
              style={{
                fontSize: 12,
                fontStyle: "italic",
                color: "var(--gtm-text-faint)",
                fontFamily: font,
                marginTop: 12,
                transition: "color 200ms ease",
              }}
            >
              Rev share per event or per seat licensed through partner
            </p>
          </div>
        </div>
      </section>

      {/* ── Section 5: Vertical Coverage Matrix ── */}
      <section style={{ marginTop: 56 }}>
        <h2
          style={{
            fontSize: 24,
            fontWeight: 500,
            color: "var(--gtm-text-primary)",
            fontFamily: font,
            margin: 0,
            marginBottom: 24,
            transition: "color 200ms ease",
          }}
        >
          Vertical Coverage
        </h2>

        <div
          style={{
            overflowX: "auto",
            border: "1px solid var(--gtm-border)",
            borderRadius: 12,
            transition: "border-color 200ms ease",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: 0,
              fontFamily: font,
            }}
          >
            <thead>
              <tr>
                {[
                  "Solution",
                  "Heavy Equipment",
                  "Energy & Infra.",
                  "Aerospace & Aviation",
                  "Sports & Entertainment",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "12px 16px",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--gtm-text-faint)",
                      background: "var(--gtm-bg-page)",
                      borderBottom: "1px solid var(--gtm-border)",
                      transition: "all 200ms ease",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {coverageData.map((row, i) => (
                <tr key={row.solution}>
                  <td
                    style={{
                      padding: "12px 16px",
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--gtm-text-primary)",
                      borderBottom:
                        i < coverageData.length - 1
                          ? "1px solid var(--gtm-border)"
                          : "none",
                      transition: "all 200ms ease",
                    }}
                  >
                    {row.solution}
                  </td>
                  {(
                    ["heavy", "energy", "aerospace", "sports"] as const
                  ).map((col) => (
                    <td
                      key={col}
                      style={{
                        padding: "12px 16px",
                        borderBottom:
                          i < coverageData.length - 1
                            ? "1px solid var(--gtm-border)"
                            : "none",
                        transition: "border-color 200ms ease",
                      }}
                    >
                      <CoverageCell status={row[col]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Section 6: 7 Execution Layers ── */}
      <section style={{ marginTop: 56 }}>
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
          7 Execution Layers
        </h2>
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
          Every solution page is built across these 7 layers, adapted per motion
          and vertical.
        </p>

        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 24,
            overflowX: "auto",
            paddingBottom: 8,
          }}
        >
          {executionLayers.map((layer) => (
            <div
              key={layer.num}
              style={{
                minWidth: 210,
                background: "var(--gtm-bg-card)",
                border: "1px solid var(--gtm-border)",
                borderRadius: 10,
                padding: 18,
                flexShrink: 0,
                transition: "all 200ms ease",
              }}
            >
              <NumberPill num={layer.num} />
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--gtm-text-primary)",
                  fontFamily: font,
                  marginTop: 10,
                  transition: "color 200ms ease",
                }}
              >
                {layer.label}
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--gtm-text-muted)",
                  fontFamily: font,
                  marginTop: 4,
                  lineHeight: 1.5,
                  transition: "color 200ms ease",
                }}
              >
                {layer.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 7: Quick Actions ── */}
      <section
        style={{
          marginTop: 56,
          display: "flex",
          gap: 12,
        }}
      >
        <Link
          href="/gtm/trade-shows?builder=true"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            height: 44,
            padding: "12px 24px",
            background: "linear-gradient(135deg, #0CF4DF, #1A56DB)",
            color: "#FFFFFF",
            fontSize: 15,
            fontWeight: 700,
            fontFamily: font,
            borderRadius: 8,
            textDecoration: "none",
            border: "none",
            transition: "all 200ms ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.9"
            e.currentTarget.style.transform = "translateY(-2px)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1"
            e.currentTarget.style.transform = "translateY(0)"
          }}
        >
          Open Trade Shows Builder
        </Link>

        <Link
          href="/gtm/trade-shows"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            height: 44,
            padding: "12px 24px",
            background: "var(--gtm-bg-card)",
            color: "var(--gtm-text-primary)",
            fontSize: 15,
            fontWeight: 600,
            fontFamily: font,
            borderRadius: 8,
            textDecoration: "none",
            border: "1px solid var(--gtm-border)",
            transition: "all 200ms ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--gtm-cyan)"
            e.currentTarget.style.color = "var(--gtm-cyan)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--gtm-border)"
            e.currentTarget.style.color = "var(--gtm-text-primary)"
          }}
        >
          View Full Framework
        </Link>
      </section>
    </div>
  )
}
