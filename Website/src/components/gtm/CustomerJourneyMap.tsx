"use client"

import { ChevronRight } from "lucide-react"

const font = "'Inter', system-ui, -apple-system, sans-serif" as const

interface JourneyStage {
  stage: string
  description: string
  touchpoints: string[]
  rox: string
}

interface CustomerJourneyMapProps {
  solution: string
  solutionLabel: string
}

const journeyData: Record<string, JourneyStage[]> = {
  "trade-shows": [
    {
      stage: "Awareness",
      description:
        "Prospect discovers Momentify through LinkedIn content, ROX Audit, or industry event.",
      touchpoints: ["LinkedIn post", "Social post", "Event prep"],
      rox: "Engagement Quality",
    },
    {
      stage: "Interest",
      description:
        "Prospect engages with a lead magnet (ROX Calculator, Trade Show Playbook) and enters nurture sequence.",
      touchpoints: ["Lead magnet", "Cold email"],
      rox: "Lead Capture Efficiency",
    },
    {
      stage: "Consideration",
      description:
        "Prospect books a discovery call after reviewing proof points and competitive positioning.",
      touchpoints: ["Discovery call", "Follow-up"],
      rox: "Conversion Effectiveness",
    },
    {
      stage: "Evaluation",
      description:
        "Prospect receives custom ROX projection and reviews proposal with stakeholders.",
      touchpoints: ["Content creation", "Internal review"],
      rox: "Follow-Up Speed",
    },
    {
      stage: "Decision",
      description:
        "Champion presents ROX business case to leadership. Momentify provides deal support materials.",
      touchpoints: ["Partner outreach", "Content creation"],
      rox: "Conversion Effectiveness",
    },
    {
      stage: "Activation",
      description:
        "Customer onboards, runs first event, and generates initial ROX baseline data.",
      touchpoints: ["Event prep", "Follow-up"],
      rox: "Lead Capture Efficiency",
    },
  ],
  recruiting: [
    {
      stage: "Awareness",
      description:
        "Talent acquisition team learns about Momentify through recruiting community content or career fair case studies.",
      touchpoints: ["LinkedIn post", "Social post"],
      rox: "Engagement Quality",
    },
    {
      stage: "Interest",
      description:
        "HR leader downloads the Career Fair ROI Calculator or Top 10 Booth Mistakes guide.",
      touchpoints: ["Lead magnet", "Cold email"],
      rox: "Lead Capture Efficiency",
    },
    {
      stage: "Consideration",
      description:
        "Recruiting manager explores how Momentify replaces clipboard processes at career fairs and hiring events.",
      touchpoints: ["Discovery call", "Follow-up"],
      rox: "Conversion Effectiveness",
    },
    {
      stage: "Evaluation",
      description:
        "Team reviews ROX projections for candidate pipeline improvement and time-to-hire acceleration.",
      touchpoints: ["Content creation", "Internal review"],
      rox: "Follow-Up Speed",
    },
    {
      stage: "Decision",
      description:
        "VP of HR approves pilot after seeing projected ROX improvement across recruiting events.",
      touchpoints: ["Partner outreach", "Content creation"],
      rox: "Conversion Effectiveness",
    },
    {
      stage: "Activation",
      description:
        "Recruiting team deploys at first career fair and captures initial candidate engagement data.",
      touchpoints: ["Event prep", "Follow-up"],
      rox: "Lead Capture Efficiency",
    },
  ],
  "field-sales": [
    {
      stage: "Awareness",
      description:
        "Field sales leader sees content about intelligent content delivery and rep performance analytics.",
      touchpoints: ["LinkedIn post", "Social post"],
      rox: "Engagement Quality",
    },
    {
      stage: "Interest",
      description:
        "Sales manager downloads Field Rep ROX Guide or explores how persona-driven content works in the field.",
      touchpoints: ["Lead magnet", "Cold email"],
      rox: "Lead Capture Efficiency",
    },
    {
      stage: "Consideration",
      description:
        "Director books discovery call to explore how reps can deliver the right content without searching for it.",
      touchpoints: ["Discovery call", "Follow-up"],
      rox: "Conversion Effectiveness",
    },
    {
      stage: "Evaluation",
      description:
        "Sales ops reviews ROX projections for rep efficiency, content utilization, and engagement tracking.",
      touchpoints: ["Content creation", "Internal review"],
      rox: "Follow-Up Speed",
    },
    {
      stage: "Decision",
      description:
        "VP of Sales approves deployment after seeing projected ROX across field rep performance.",
      touchpoints: ["Partner outreach", "Content creation"],
      rox: "Conversion Effectiveness",
    },
    {
      stage: "Activation",
      description:
        "Field reps begin using Momentify for customer meetings and generate initial engagement intelligence.",
      touchpoints: ["Event prep", "Follow-up"],
      rox: "Lead Capture Efficiency",
    },
  ],
  facilities: [
    {
      stage: "Awareness",
      description:
        "Facility director sees content about transforming showrooms and training centers into intelligence hubs.",
      touchpoints: ["LinkedIn post", "Social post"],
      rox: "Engagement Quality",
    },
    {
      stage: "Interest",
      description:
        "Operations manager downloads Showroom ROX Assessment or reviews facility engagement case studies.",
      touchpoints: ["Lead magnet", "Cold email"],
      rox: "Lead Capture Efficiency",
    },
    {
      stage: "Consideration",
      description:
        "Facility manager explores how Momentify captures visitor engagement across fixed locations.",
      touchpoints: ["Discovery call", "Follow-up"],
      rox: "Conversion Effectiveness",
    },
    {
      stage: "Evaluation",
      description:
        "Team reviews ROX projections for visitor engagement, content utilization, and facility performance.",
      touchpoints: ["Content creation", "Internal review"],
      rox: "Follow-Up Speed",
    },
    {
      stage: "Decision",
      description:
        "VP of Operations approves deployment across priority locations after ROX analysis.",
      touchpoints: ["Partner outreach", "Content creation"],
      rox: "Conversion Effectiveness",
    },
    {
      stage: "Activation",
      description:
        "First facility goes live with Momentify and begins capturing visitor engagement intelligence.",
      touchpoints: ["Event prep", "Follow-up"],
      rox: "Lead Capture Efficiency",
    },
  ],
  "events-venues": [
    {
      stage: "Awareness",
      description:
        "Venue or entertainment executive discovers Momentify through premium experience content or ALSD presence.",
      touchpoints: ["LinkedIn post", "Social post"],
      rox: "Engagement Quality",
    },
    {
      stage: "Interest",
      description:
        "Fan experience director downloads Premium Experience ROX Guide or explores interactive engagement tools.",
      touchpoints: ["Lead magnet", "Cold email"],
      rox: "Lead Capture Efficiency",
    },
    {
      stage: "Consideration",
      description:
        "Venue ops explores how Momentify captures fan engagement and delivers personalized experiences.",
      touchpoints: ["Discovery call", "Follow-up"],
      rox: "Conversion Effectiveness",
    },
    {
      stage: "Evaluation",
      description:
        "Team reviews ROX projections for fan engagement, sponsor activation, and experience personalization.",
      touchpoints: ["Content creation", "Internal review"],
      rox: "Follow-Up Speed",
    },
    {
      stage: "Decision",
      description:
        "VP of Fan Experience approves pilot for upcoming season after reviewing ROX projections.",
      touchpoints: ["Partner outreach", "Content creation"],
      rox: "Conversion Effectiveness",
    },
    {
      stage: "Activation",
      description:
        "First event or venue deployment captures fan engagement data and generates initial ROX baseline.",
      touchpoints: ["Event prep", "Follow-up"],
      rox: "Lead Capture Efficiency",
    },
  ],
}

export default function CustomerJourneyMap({
  solution,
  solutionLabel,
}: CustomerJourneyMapProps) {
  const stages = journeyData[solution] || journeyData["trade-shows"]

  return (
    <div style={{ marginTop: 48, fontFamily: font }}>
      <div style={{ marginBottom: 24 }}>
        <h3
          style={{
            fontSize: 20,
            fontWeight: 500,
            color: "var(--gtm-text-primary)",
            margin: 0,
            marginBottom: 6,
          }}
        >
          Customer Journey Map
        </h3>
        <p
          style={{
            fontSize: 14,
            color: "var(--gtm-text-muted)",
            margin: 0,
          }}
        >
          ROX-driven touchpoints from awareness to activation
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          gap: 0,
          overflowX: "auto",
          paddingBottom: 8,
        }}
      >
        {stages.map((stage, idx) => (
          <div
            key={stage.stage}
            style={{
              display: "flex",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            {/* Stage Card */}
            <div
              style={{
                width: 200,
                background: "var(--gtm-bg-card)",
                border: "1px solid var(--gtm-border)",
                borderRadius: 12,
                padding: 20,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {/* Stage number pill */}
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, var(--gtm-accent), var(--gtm-cyan))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#fff",
                  flexShrink: 0,
                }}
              >
                {idx + 1}
              </div>

              {/* Stage label */}
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--gtm-text-primary)",
                }}
              >
                {stage.stage}
              </div>

              {/* Description */}
              <div
                style={{
                  fontSize: 12,
                  color: "var(--gtm-text-muted)",
                  lineHeight: 1.6,
                }}
              >
                {stage.description}
              </div>

              {/* Touchpoints */}
              <div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "var(--gtm-text-faint)",
                    marginBottom: 6,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  Touchpoints:
                </div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 4,
                  }}
                >
                  {stage.touchpoints.map((tp) => (
                    <span
                      key={tp}
                      style={{
                        fontSize: 10,
                        fontWeight: 500,
                        color: "var(--gtm-accent)",
                        background: "var(--gtm-accent)",
                        backgroundColor: "rgba(0, 187, 165, 0.1)",
                        borderRadius: 6,
                        padding: "2px 8px",
                      }}
                    >
                      {tp}
                    </span>
                  ))}
                </div>
              </div>

              {/* ROX dimension */}
              <div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "var(--gtm-text-faint)",
                    marginBottom: 6,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  ROX:
                </div>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 500,
                    color: "var(--gtm-cyan)",
                    background: "rgba(12, 244, 223, 0.1)",
                    borderRadius: 6,
                    padding: "2px 8px",
                  }}
                >
                  {stage.rox}
                </span>
              </div>
            </div>

            {/* Arrow between cards */}
            {idx < stages.length - 1 && (
              <div
                style={{
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  padding: "0 4px",
                }}
              >
                <ChevronRight
                  size={16}
                  style={{ color: "var(--gtm-text-faint)" }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
