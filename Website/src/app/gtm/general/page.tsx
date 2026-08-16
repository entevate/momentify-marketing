"use client"

/**
 * /gtm/general — General Momentify
 *
 * Cross-pillar framework page that introduces the Momentify platform
 * itself: features, four-step product flow, ROX framework, the five
 * solution pillars, and customer proof. Mirrors the per-pillar page
 * structure (Framework / Content Builder / Library tabs) so the same
 * authoring tools are available with `solution="general"` for emails,
 * social posts, etc. that aren't pillar-specific.
 *
 * Content is sourced verbatim from the public site at momentifyapp.com
 * (homepage hero, /platform/how-it-works, /what-is-rox).
 */

import { Suspense, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { Sparkles, ArrowRight, Layers, BarChart3, Smartphone, Zap, Cog } from "lucide-react"
import ContentBuilder from "@/components/gtm/tabs/ContentBuilder"
import ContentLibrary from "@/components/gtm/tabs/ContentLibrary"
import ContentHistory from "@/components/gtm/tabs/ContentHistory"
import LibraryCountBadge from "@/components/gtm/LibraryCountBadge"

const font = "'Inter', system-ui, -apple-system, sans-serif"

// ─── Static framework content ──────────────────────────────────────────
// Sourced from public site: momentifyapp.com homepage + /platform/how-it-works + /what-is-rox

const platformSteps = [
  {
    n: "01",
    surface: "Momentify Web",
    title: "Set up. Configure. Deploy.",
    when: "Before the moment",
    bullets: [
      "Experience and workspace setup",
      "Template and content management",
      "Lead scoring configuration",
      "Team and role management",
    ],
    icon: Cog,
  },
  {
    n: "02",
    surface: "Momentify Explorer",
    title: "Engage. Capture. Score.",
    when: "During / In the moment",
    bullets: [
      "QR code and form-based lead capture",
      "Persona-driven content delivery",
      "Offline mode with automatic sync",
      "Real-time lead temperature scoring",
    ],
    icon: Smartphone,
  },
  {
    n: "03",
    surface: "Momentify Intelligence",
    title: "AI insights. Auto-generated. Actually useful.",
    when: "In the moment analysis",
    bullets: [
      "Real-time ROX scoring during the experience",
      "Event recap auto-generated on close",
      "Lead follow-up recommendations ranked by intent",
      "Automated event summaries tailored to use case",
    ],
    icon: BarChart3,
  },
  {
    n: "04",
    surface: "Momentify Engage",
    title: "Follow up. Convert. Close the loop.",
    when: "After the moment",
    bullets: [
      "Automated lead routing by score and role",
      "Personalized follow-up sequence triggers",
      "CRM and ATS push on experience close",
      "Follow-up speed tracking in Intelligence",
    ],
    icon: Zap,
  },
] as const

const roxDimensions = [
  {
    label: "Lead Capture Efficiency",
    weight: "25%",
    desc: "Percentage of actual visitors converted to leads with sufficient context for action — beyond simple badge scans.",
  },
  {
    label: "Engagement Quality",
    weight: "25%",
    desc: "Depth of visitor interaction with content and demos. Distinguishes lingering explorers from casual brochure-grabbers.",
  },
  {
    label: "Follow-Up Speed",
    weight: "25%",
    desc: "Time elapsed between event conclusion and team outreach. Industry baseline is 5–7 days; best practice is same-day.",
  },
  {
    label: "Conversion Effectiveness",
    weight: "25%",
    desc: "Pipeline conversion rate — leads that became meetings, hires, or closed opportunities.",
  },
] as const

const roxTiers = [
  { range: "0–39", tier: "Critical Gap", color: "#E5484D", desc: "Events are costing more than they are delivering." },
  { range: "40–69", tier: "Needs Optimization", color: "#F2B33D", desc: "Capturing some value, but leaving ROI on the table." },
  { range: "70–84", tier: "High ROX", color: "#5FD9C2", desc: "Strong capture, solid engagement, timely follow-up." },
  { range: "85–100", tier: "Elite ROX", color: "#0CF4DF", desc: "Highly optimized across every category." },
] as const

const proofPoints = [
  { stat: "$50B", label: "Spent annually on in-person events (US)" },
  { stat: "10,000+", label: "Qualified leads from 50 events in 18 months" },
  { stat: "65%+", label: "Lead qualification rate (vs. 20% industry avg)" },
  { stat: "$411M", label: "Potential pipeline value delivered" },
  { stat: "92%", label: "More leads across three consecutive years" },
] as const

const solutionPillars = [
  { id: "trade-shows", label: "Trade Shows & Exhibits", color: "#9B5FE8", desc: "Turn booth investment into measurable ROX." },
  { id: "recruiting", label: "Technical Recruiting", color: "#5FD9C2", desc: "Capture, engage, and follow up with top talent." },
  { id: "field-sales", label: "Field Sales Enablement", color: "#F2B33D", desc: "On-The-Go content delivery + intent capture in the field." },
  { id: "facilities", label: "Facilities", color: "#5B4499", desc: "Showrooms, demo floors, and training centers as pipeline." },
  { id: "events-venues", label: "Events & Venues", color: "#F25E3D", desc: "Beyond ticket sales — interactive branded experiences." },
] as const

const platformFeatures = [
  { title: "Lead Capture with Context", desc: "Conversations documented with role, interest, and intent data — not just badge scans." },
  { title: "Real-Time Scoring", desc: "Immediate lead qualification before the event ends, so follow-up starts hot." },
  { title: "Cross-Event Benchmarking", desc: "Performance comparison across multiple shows / events to spot what's working." },
  { title: "Automated Routing", desc: "Candidate and lead distribution based on fit matching — no manual triage." },
  { title: "Mobile-First Engagement", desc: "iPad and mobile capture during interactions, fully offline-capable." },
] as const

// ─── Page ──────────────────────────────────────────────────────────────

function GeneralContent() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<"framework" | "builder" | "library" | "history">(
    searchParams.get("builder") === "true" ? "builder" : "framework",
  )

  return (
    <div data-solution="general">
      {/* ── Page header ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 48px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24, flexWrap: "wrap" }}>
          <div>
            <Image src="/Momentify-Icon.svg" alt="Momentify" width={28} height={28} style={{ height: 28, width: "auto", marginBottom: 14 }} />
            <p style={eyebrow}>GENERAL MOMENTIFY — PLATFORM OVERVIEW</p>
            <h1 style={h1}>Momentify Platform</h1>
            <p style={subhead}>The operating system for in-person engagement. Cross-pillar features, the ROX framework, and platform-wide proof.</p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <StatChip label="4 Platform Modes" />
            <StatChip label="5 Solution Pillars" />
            <StatChip label="ROX Scoring" />
          </div>
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div style={tabBarOuter}>
        <div style={tabBarInner}>
          {([
            { key: "framework", label: "Framework", icon: null },
            { key: "builder", label: "Content Builder", icon: Sparkles },
            { key: "library", label: "Library", icon: null },
            { key: "history", label: "History", icon: null },
          ] as const).map((tab) => {
            const active = activeTab === tab.key
            const Icon = tab.icon
            return (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                style={{
                  height: 44, padding: "0 20px", background: "transparent", border: "none",
                  borderBottom: active ? "2px solid var(--gtm-accent)" : "2px solid transparent",
                  cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: font,
                  color: active ? "var(--gtm-accent)" : "var(--gtm-text-muted)",
                  display: "flex", alignItems: "center", gap: 6, transition: "all 200ms ease",
                }}
              >
                {Icon && <Icon size={14} />}
                {tab.label}
                {tab.key === "library" && <LibraryCountBadge solution="general" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Tab content ── */}
      {activeTab === "builder" ? (
        <ContentBuilder
          solution="general"
          solutionLabel="Momentify Platform"
          verticals={[{ id: "general", label: "General / All Industries" }]}
        />
      ) : activeTab === "library" ? (
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 48px 80px" }}>
          <ContentLibrary solution="general" solutionLabel="Momentify Platform" />
        </div>
      ) : activeTab === "history" ? (
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 48px 80px" }}>
          <ContentHistory solution="general" solutionLabel="Momentify Platform" />
        </div>
      ) : (
        <FrameworkContent />
      )}
    </div>
  )
}

// ─── Framework tab body ────────────────────────────────────────────────

function FrameworkContent() {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 48px 80px" }}>
      {/* Hero / value proposition */}
      <section style={section}>
        <div style={heroCard}>
          <p style={{ ...eyebrow, color: "rgba(255,255,255,0.78)", marginBottom: 14 }}>EMPOWER EVERY MOMENT</p>
          <h2 style={{ fontSize: 32, fontWeight: 300, color: "#fff", margin: 0, lineHeight: 1.15, fontFamily: font }}>
            The operating system for in-person engagement.
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.78)", marginTop: 14, lineHeight: 1.55, maxWidth: 720, fontFamily: font }}>
            Momentify converts attention into outcomes your team can measure and prove. Trade shows, recruiting, field sales, facility tours, venue activations — every in-person interaction becomes structured data that drives pipeline.
          </p>
        </div>
      </section>

      {/* The four-step platform */}
      <section style={section}>
        <SectionHeading
          eyebrow="HOW IT WORKS"
          title="Four steps. One platform. Every interaction measured."
          desc="The platform spans four integrated surfaces. Set up before the moment, engage during, analyze instantly, then route follow-up automatically."
        />
        <div style={fourCol}>
          {platformSteps.map((s) => {
            const Icon = s.icon
            return (
              <article key={s.n} style={stepCard}>
                <div style={stepCardHeader}>
                  <span style={stepNum}>{s.n}</span>
                  <Icon size={18} style={{ color: "var(--gtm-text-faint)" }} />
                </div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--gtm-cyan, #00BBA5)", margin: "12px 0 4px 0", fontFamily: font }}>
                  {s.surface}
                </p>
                <h3 style={{ fontSize: 16, fontWeight: 500, color: "var(--gtm-text-primary)", margin: "0 0 4px 0", fontFamily: font, lineHeight: 1.3 }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: 11, fontStyle: "italic", color: "var(--gtm-text-faint)", margin: "0 0 14px 0", fontFamily: font }}>
                  {s.when}
                </p>
                <ul style={bullets}>
                  {s.bullets.map((b) => <li key={b} style={bulletItem}>{b}</li>)}
                </ul>
              </article>
            )
          })}
        </div>
      </section>

      {/* ROX framework */}
      <section style={section}>
        <SectionHeading
          eyebrow="ROX FRAMEWORK"
          title="ROI tells you what you spent. ROX tells you whether it worked."
          desc="Return on Experience (ROX)™ scores the quality of every interaction across four equally-weighted categories. One number, four levers, every pillar."
        />
        <div style={twoCol}>
          <div style={roxColumn}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--gtm-text-faint)", marginBottom: 12, fontFamily: font }}>
              Four dimensions
            </p>
            {roxDimensions.map((d) => (
              <div key={d.label} style={roxDimCard}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "var(--gtm-text-primary)" }}>{d.label}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "var(--gtm-cyan, #00BBA5)" }}>{d.weight}</span>
                </div>
                <p style={{ fontSize: 13, color: "var(--gtm-text-muted)", lineHeight: 1.55, margin: 0, fontFamily: font }}>{d.desc}</p>
              </div>
            ))}
          </div>
          <div style={roxColumn}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--gtm-text-faint)", marginBottom: 12, fontFamily: font }}>
              Scoring tiers
            </p>
            {roxTiers.map((t) => (
              <div key={t.tier} style={{ ...roxDimCard, borderLeft: `3px solid ${t.color}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "var(--gtm-text-primary)" }}>{t.tier}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: t.color }}>{t.range}</span>
                </div>
                <p style={{ fontSize: 13, color: "var(--gtm-text-muted)", lineHeight: 1.55, margin: 0, fontFamily: font }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution pillars */}
      <section style={section}>
        <SectionHeading
          eyebrow="SOLUTION PILLARS"
          title="Five pillars. Same platform. Same ROX."
          desc="Every pillar runs the same four-step Web → Explorer → Intelligence → Engage flow. Pillar-specific GTM frameworks, content templates, and prompts live on each solution page."
        />
        <div style={pillarsGrid}>
          {solutionPillars.map((p) => (
            <Link key={p.id} href={`/gtm/${p.id}`} style={pillarCard}>
              <div style={{ ...pillarDot, background: p.color }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--gtm-text-primary)", margin: 0, fontFamily: font }}>
                  {p.label}
                </p>
                <p style={{ fontSize: 12, color: "var(--gtm-text-muted)", margin: "2px 0 0 0", lineHeight: 1.45, fontFamily: font }}>
                  {p.desc}
                </p>
              </div>
              <ArrowRight size={14} style={{ color: "var(--gtm-text-faint)", flexShrink: 0 }} />
            </Link>
          ))}
        </div>
      </section>

      {/* Platform features */}
      <section style={section}>
        <SectionHeading
          eyebrow="PLATFORM FEATURES"
          title="Five capabilities every pillar inherits."
          desc="Cross-cutting platform features that apply equally whether you're at a trade show booth, a job fair table, a customer's parking lot, or a venue concourse."
        />
        <div style={featuresGrid}>
          {platformFeatures.map((f) => (
            <article key={f.title} style={featureCard}>
              <Layers size={16} style={{ color: "var(--gtm-cyan, #00BBA5)" }} />
              <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--gtm-text-primary)", margin: "10px 0 4px 0", fontFamily: font }}>
                {f.title}
              </h3>
              <p style={{ fontSize: 13, color: "var(--gtm-text-muted)", lineHeight: 1.55, margin: 0, fontFamily: font }}>
                {f.desc}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Proof points */}
      <section style={section}>
        <SectionHeading
          eyebrow="PROOF"
          title="Numbers from the field."
          desc="Customer-agnostic platform aggregates from the public website. Update as new milestones land."
        />
        <div style={proofGrid}>
          {proofPoints.map((p) => (
            <div key={p.label} style={proofCard}>
              <p style={{ fontSize: 32, fontWeight: 600, color: "var(--gtm-text-primary)", margin: 0, lineHeight: 1, letterSpacing: "-0.02em", fontFamily: font }}>
                {p.stat}
              </p>
              <p style={{ fontSize: 12, color: "var(--gtm-text-muted)", margin: "10px 0 0 0", lineHeight: 1.5, fontFamily: font }}>
                {p.label}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

// ─── Bits ──────────────────────────────────────────────────────────────

function StatChip({ label }: { label: string }) {
  return (
    <div style={{ background: "var(--gtm-bg-card)", border: "1px solid var(--gtm-border)", borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 600, color: "var(--gtm-text-primary)", fontFamily: font, whiteSpace: "nowrap" }}>
      {label}
    </div>
  )
}

function SectionHeading({ eyebrow, title, desc }: { eyebrow: string; title: string; desc: string }) {
  return (
    <div style={{ marginBottom: 24, maxWidth: 720 }}>
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gtm-cyan, #00BBA5)", margin: 0, fontFamily: font }}>
        {eyebrow}
      </p>
      <h2 style={{ fontSize: 22, fontWeight: 500, color: "var(--gtm-text-primary)", margin: "8px 0 6px 0", fontFamily: font, lineHeight: 1.25 }}>
        {title}
      </h2>
      <p style={{ fontSize: 14, color: "var(--gtm-text-muted)", lineHeight: 1.55, margin: 0, fontFamily: font }}>
        {desc}
      </p>
    </div>
  )
}

// ─── Page export ───────────────────────────────────────────────────────

export default function GeneralPage() {
  return (
    <Suspense fallback={null}>
      <GeneralContent />
    </Suspense>
  )
}

// ─── Styles ────────────────────────────────────────────────────────────

const eyebrow: React.CSSProperties = { fontSize: 11, fontWeight: 600, color: "var(--gtm-accent, var(--gtm-cyan, #00BBA5))", letterSpacing: "0.14em", fontFamily: font, marginBottom: 10, textTransform: "uppercase" }
const h1: React.CSSProperties = { fontSize: 32, fontWeight: 300, color: "var(--gtm-text-primary)", fontFamily: font, margin: 0, transition: "color 200ms ease" }
const subhead: React.CSSProperties = { fontSize: 16, fontWeight: 400, color: "var(--gtm-text-muted)", fontFamily: font, marginTop: 8 }

const tabBarOuter: React.CSSProperties = { position: "sticky", top: 0, zIndex: 50, background: "var(--gtm-bg-card)", borderBottom: "1px solid var(--gtm-border)", marginTop: 32 }
const tabBarInner: React.CSSProperties = { maxWidth: 1200, margin: "0 auto", padding: "0 48px", display: "flex", gap: 0 }

const section: React.CSSProperties = { marginTop: 40 }

const heroCard: React.CSSProperties = {
  borderRadius: 16,
  padding: "40px 36px",
  background: "linear-gradient(135deg, #061341 0%, #1A56DB 55%, #0CF4DF 100%)",
  position: "relative",
  overflow: "hidden",
}

const fourCol: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }
const stepCard: React.CSSProperties = { background: "var(--gtm-bg-card)", border: "1px solid var(--gtm-border)", borderRadius: 12, padding: "20px 22px" }
const stepCardHeader: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center" }
const stepNum: React.CSSProperties = { fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: "var(--gtm-text-faint)", fontFamily: font }
const bullets: React.CSSProperties = { listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 6 }
const bulletItem: React.CSSProperties = { fontSize: 12, color: "var(--gtm-text-secondary)", lineHeight: 1.55, paddingLeft: 14, position: "relative", fontFamily: font }

const twoCol: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }
const roxColumn: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 8 }
const roxDimCard: React.CSSProperties = { background: "var(--gtm-bg-card)", border: "1px solid var(--gtm-border)", borderRadius: 10, padding: "14px 16px" }

const pillarsGrid: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 8 }
const pillarCard: React.CSSProperties = { display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", background: "var(--gtm-bg-card)", border: "1px solid var(--gtm-border)", borderRadius: 12, textDecoration: "none", transition: "border-color 200ms ease" }
const pillarDot: React.CSSProperties = { width: 10, height: 10, borderRadius: "50%", flexShrink: 0 }

const featuresGrid: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }
const featureCard: React.CSSProperties = { background: "var(--gtm-bg-card)", border: "1px solid var(--gtm-border)", borderRadius: 12, padding: "18px 20px" }

const proofGrid: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }
const proofCard: React.CSSProperties = { background: "var(--gtm-bg-card)", border: "1px solid var(--gtm-border)", borderRadius: 12, padding: "20px 22px", minHeight: 110 }
