"use client";

import { motion } from "framer-motion";

/* ── Animation variants (match codebase pattern) ───── */

const headerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ── Data: ROX categories ──────────────────────────── */

const categories = [
  {
    num: "01",
    name: "Lead Capture Efficiency",
    accent: "#00BBA5",
    description:
      "How many of the people who showed up actually became a lead? Most teams count badge scans and call it a win. But a scan is not a lead. This category measures the percentage of real visitors who were captured with enough context to act on. Without a structured capture process, most booths lose more than half their traffic before it even enters the system.",
  },
  {
    num: "02",
    name: "Engagement Quality",
    accent: "#1A56DB",
    description:
      "Not everyone who stops by is worth the same follow-up. This category measures how deeply visitors actually interacted with your content, demos, or conversations. It separates the people who lingered, explored, and asked questions from the ones who grabbed a brochure and moved on. Most teams have no way to measure this without a platform tracking it in real time.",
  },
  {
    num: "03",
    name: "Follow-Up Speed",
    accent: "#F2B33D",
    description:
      "Intent fades fast. The best lead in the room becomes a cold contact if your team waits five days to reach out. This category measures how quickly your team followed up after the event ended. Best-in-class teams follow up same day. The industry average is five to seven days. By then, the competition has already made the call.",
  },
  {
    num: "04",
    name: "Conversion Effectiveness",
    accent: "#6B21D4",
    description:
      "This is the bottom line. How many of the leads you captured actually turned into a meeting, a hire, or a closed opportunity? Most event teams cannot answer this question because the data trail breaks between the event floor and the CRM. This category closes the loop and tells you whether your events actually produced outcomes.",
  },
];

/* ── Data: Score tiers ─────────────────────────────── */

const tiers = [
  {
    range: "0-39",
    color: "#E5484D",
    name: "Critical Gap",
    headline: "Events are costing more than they are delivering.",
    body: "Lead capture is inconsistent, engagement is low, follow-up is slow. You lack the visibility to find and act on your best opportunities.",
  },
  {
    range: "40-69",
    color: "#F2B33D",
    name: "Needs Optimization",
    headline: "You are capturing some value, but leaving ROI on the table.",
    body: "Clear inefficiencies in one or two categories are dragging your score. High-intent leads are slipping away between the floor and the inbox.",
  },
  {
    range: "70-84",
    color: "#5FD9C2",
    name: "High ROX",
    headline: "Above average. Now prove it with real data.",
    body: "Strong capture, solid engagement, timely follow-up. Some scores may be based on estimates. Validation closes the gap to Elite.",
  },
  {
    range: "85-100",
    color: "#00BBA5",
    name: "Elite ROX",
    headline: "Highly optimized across every category.",
    body: "Top-performing tier. Requires constant visibility to maintain. Ongoing analytics and trend tracking keep Elite from slipping.",
  },
];

/* ── Data: Verticals ───────────────────────────────── */

const verticals = [
  {
    name: "Trade Shows & Exhibits",
    context: "Lead capture rate, engagement depth, follow-up speed, and conversion from booth traffic to pipeline.",
    linkText: "Calculate Trade Show ROX",
    href: "/rox/trade-shows",
    active: true,
    color: "#A855F7",
    bgTint: "rgba(107, 33, 212, 0.06)",
    borderColor: "rgba(107, 33, 212, 0.15)",
  },
  {
    name: "Technical Recruiting",
    context: "Candidate capture rate, engagement quality by role, time to first contact, and conversion to interview or hire.",
    linkText: "Calculate Recruiting ROX",
    href: "/rox/recruiting",
    active: true,
    color: "#5FD9C2",
    bgTint: "rgba(95, 217, 194, 0.06)",
    borderColor: "rgba(95, 217, 194, 0.15)",
  },
  {
    name: "Field Sales",
    context: "Interaction capture rate at job sites and facilities, content engagement, follow-up speed, and deal progression.",
    linkText: "Calculate Field Sales ROX",
    href: "/rox/field-sales",
    active: true,
    color: "#F2B33D",
    bgTint: "rgba(242, 179, 61, 0.06)",
    borderColor: "rgba(242, 179, 61, 0.15)",
  },
  {
    name: "Facilities",
    context: "Visitor capture across showrooms and demo floors, content depth, engagement duration, and intent signals.",
    linkText: "Calculate Facilities ROX",
    href: "/rox/facilities",
    active: true,
    color: "#8B5CF6",
    bgTint: "rgba(58, 32, 115, 0.06)",
    borderColor: "rgba(58, 32, 115, 0.15)",
  },
  {
    name: "Venues & Events",
    context: "Attendee engagement beyond ticket scans, content interaction, sponsor ROX, and post-event conversion.",
    linkText: "Calculate Events ROX",
    href: "/rox/venues",
    active: true,
    color: "#F25E3D",
    bgTint: "rgba(242, 94, 61, 0.06)",
    borderColor: "rgba(242, 94, 61, 0.15)",
  },
];

/* ── Shared styles ─────────────────────────────────── */

const depthGradient =
  "linear-gradient(135deg, #1A0533 0%, #070E2B 40%, #061341 70%, #070E2B 100%)";

const mainMinimal =
  "linear-gradient(135deg, #7C316D 0%, #0B0B3C 55%, #1A2E73 100%)";

const MainMinimalOverlay = () => (
  <svg
    className="pointer-events-none absolute inset-0 h-full w-full"
    viewBox="0 0 600 500"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMaxYMax slice"
    aria-hidden="true"
  >
    <path d="M600 500 L600 180 L420 0 L220 0 L440 220 L440 500 Z" fill="white" fillOpacity="0.05" />
    <path d="M600 500 L600 300 L380 80 L180 80 L380 280 L380 500 Z" fill="white" fillOpacity="0.04" />
    <path d="M600 500 L600 420 L510 330 L350 330 L510 500 Z" fill="white" fillOpacity="0.03" />
  </svg>
);

/* ════════════════════════════════════════════════════════
   WHAT IS ROX? PAGE
   ════════════════════════════════════════════════════════ */

export default function WhatIsROX() {
  return (
    <>
      {/* ═══════════════════ 1. HERO ═══════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundSize: "200% 200%",
          animation: "bgShift 16s ease-in-out infinite",
          backgroundImage: mainMinimal,
          minHeight: "500px",
        }}
      >
        {/* Geometric SVG overlay (main-minimal) */}
        <MainMinimalOverlay />

        {/* Ambient glow orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute w-[700px] h-[700px] rounded-full opacity-[0.08] blur-[140px]" style={{ background: "radial-gradient(circle, #3A2073, transparent 70%)", top: "5%", left: "50%", animation: "ambientFloat1 12s ease-in-out infinite" }} />
          <div className="absolute w-[500px] h-[500px] rounded-full opacity-[0.06] blur-[100px]" style={{ background: "radial-gradient(circle, #00BBA5, transparent 70%)", bottom: "-5%", left: "5%", animation: "ambientFloat2 15s ease-in-out infinite" }} />
          <div className="absolute w-[400px] h-[400px] rounded-full opacity-[0.05] blur-[120px]" style={{ background: "radial-gradient(circle, #1A56DB, transparent 70%)", top: "30%", right: "10%", animation: "ambientFloat3 18s ease-in-out infinite" }} />
          <div className="absolute w-[300px] h-[300px] rounded-full opacity-[0.04] blur-[80px]" style={{ background: "radial-gradient(circle, #5FD9C2, transparent 70%)", top: "60%", left: "35%", animation: "arcDrift 20s ease-in-out infinite" }} />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12" style={{ paddingTop: "160px", paddingBottom: "120px" }}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between lg:gap-12">

            {/* Left column: text + buttons */}
            <div className="flex-1 min-w-0">
              {/* Eyebrow */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 600,
                  fontSize: "11px",
                  color: "#00BBA5",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase" as const,
                  marginBottom: "16px",
                }}
              >
                Return on Experience (ROX)
              </motion.p>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.18 }}
                className="leading-[1.05]"
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 500,
                  fontSize: "clamp(28px, 5vw, 52px)",
                  color: "#FFFFFF",
                  letterSpacing: "-0.02em",
                  maxWidth: "860px",
                  marginBottom: "32px",
                }}
              >
                ROI tells you what you spent.
                <br className="hidden sm:block" />{" "}
                ROX tells you whether it worked.
              </motion.h1>

              {/* Subhead */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.24 }}
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 400,
                  fontSize: "15px",
                  color: "rgba(255, 255, 255, 0.55)",
                  lineHeight: 1.5,
                  maxWidth: "660px",
                  marginBottom: "32px",
                }}
              >
                Return on Experience (ROX)™ is our proprietary measurement standard for in-person engagement. It scores the quality of every interaction, not just the count. <strong style={{ fontWeight: 600, color: "rgba(255,255,255,0.75)" }}>Momentify built ROX because badge scans were never enough.</strong>
              </motion.p>

              {/* Mobile-only gauge (between subhead and calculate buttons) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.28 }}
                className="flex lg:hidden flex-col items-center my-8 mx-auto w-full"
              >
                <svg viewBox="0 0 400 270" className="w-full">
                  {(() => {
                    const cx = 200; const cy = 210; const r = 150;
                    const rnd = (n: number) => Math.round(n * 1000) / 1000;
                    const polarToCart = (angleDeg: number) => {
                      const rad = (Math.PI * (180 - angleDeg)) / 180;
                      return { x: rnd(cx + r * Math.cos(rad)), y: rnd(cy - r * Math.sin(rad)) };
                    };
                    const arcPath = (startDeg: number, endDeg: number) => {
                      const s = polarToCart(startDeg);
                      const e = polarToCart(endDeg);
                      const large = endDeg - startDeg > 180 ? 1 : 0;
                      return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
                    };
                    const zones = [
                      { start: 0, end: 70.2, color: "#E5484D" },
                      { start: 70.2, end: 124.2, color: "#F2B33D" },
                      { start: 124.2, end: 151.2, color: "#5FD9C2" },
                      { start: 151.2, end: 180, color: "#00BBA5" },
                    ];
                    const needleAngle = (78 / 100) * 180;
                    const needleEnd = polarToCart(needleAngle);
                    return (
                      <>
                        <path d={arcPath(0, 180)} stroke="rgba(255,255,255,0.08)" strokeWidth="18" fill="none" strokeLinecap="round" />
                        {zones.map((z) => (
                          <path key={z.color} d={arcPath(z.start, z.end)} stroke={z.color} strokeWidth="18" fill="none" strokeLinecap="round" />
                        ))}
                        <line x1={cx} y1={cy} x2={needleEnd.x} y2={needleEnd.y} stroke="white" strokeWidth="3" opacity="0.35" />
                        <circle cx={cx} cy={cy} r="6" fill="white" opacity="0.35" />
                        <text x={cx} y={cy - 40} textAnchor="middle" style={{ fontFamily: "var(--font-inter)", fontWeight: 800, fontSize: "56px", fill: "#FFFFFF" }}>78</text>
                        <text x={cx} y={cy - 12} textAnchor="middle" style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "12px", fill: "#5FD9C2", letterSpacing: "0.12em" }}>HIGH ROX</text>
                      </>
                    );
                  })()}
                </svg>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-2 justify-items-center w-full" style={{ maxWidth: "320px" }}>
                  {[
                    { range: "0-39", color: "#E5484D", label: "Critical" },
                    { range: "40-69", color: "#F2B33D", label: "Optimize" },
                    { range: "70-84", color: "#5FD9C2", label: "High ROX" },
                    { range: "85-100", color: "#00BBA5", label: "Elite" },
                  ].map((t) => (
                    <div key={t.range} className="flex items-center gap-2">
                      <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: t.color, flexShrink: 0 }} />
                      <span style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "11px", color: "rgba(255,255,255,0.55)" }}>
                        {t.range} {t.label}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* CTA line + 5 vertical quick-links */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.28 }}
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 500,
                  fontSize: "14px",
                  color: "rgba(255, 255, 255, 0.45)",
                  marginBottom: "16px",
                }}
              >
                Calculate your ROX score by vertical:
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.34 }}
                className="flex flex-col gap-3"
              >
                {/* Desktop: row 1 (3 buttons) + row 2 (2 buttons) */}
                <div className="hidden sm:flex flex-wrap items-center gap-3">
                  {verticals.slice(0, 3).map((v) => (
                    <a
                      key={v.name}
                      href={v.active ? v.href : "#verticals"}
                      className="inline-flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5"
                      style={{
                        fontFamily: "var(--font-inter)",
                        fontWeight: 600,
                        fontSize: "13px",
                        color: "rgba(255,255,255,0.7)",
                        padding: "9px 18px",
                        borderRadius: "8px",
                        background: "transparent",
                        border: "1.5px solid rgba(255,255,255,0.25)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = v.color;
                        e.currentTarget.style.color = v.color;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
                        e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                      }}
                    >
                      {v.name}
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>
                    </a>
                  ))}
                </div>
                <div className="hidden sm:flex flex-wrap items-center gap-3">
                  {verticals.slice(3).map((v) => (
                    <a
                      key={v.name}
                      href={v.active ? v.href : "#verticals"}
                      className="inline-flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5"
                      style={{
                        fontFamily: "var(--font-inter)",
                        fontWeight: 600,
                        fontSize: "13px",
                        color: "rgba(255,255,255,0.7)",
                        padding: "9px 18px",
                        borderRadius: "8px",
                        background: "transparent",
                        border: "1.5px solid rgba(255,255,255,0.25)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = v.color;
                        e.currentTarget.style.color = v.color;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
                        e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                      }}
                    >
                      {v.name}
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>
                    </a>
                  ))}
                </div>
                {/* Mobile: 2-col grid, 5th item spans full width */}
                <div className="grid sm:hidden grid-cols-2 gap-2">
                  {verticals.map((v, i) => (
                    <a
                      key={v.name}
                      href={v.active ? v.href : "#verticals"}
                      className="inline-flex items-center justify-center gap-1.5 transition-all duration-200 text-center"
                      style={{
                        fontFamily: "var(--font-inter)",
                        fontWeight: 600,
                        fontSize: "11px",
                        color: "rgba(255,255,255,0.7)",
                        padding: "8px 10px",
                        borderRadius: "6px",
                        background: "transparent",
                        border: "1.5px solid rgba(255,255,255,0.25)",
                      }}
                    >
                      {v.name}
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>
                    </a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right column: Static ROX gauge (matches Trade Shows gauge) */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="hidden lg:flex items-center justify-center mt-12 lg:mt-0 overflow-visible"
              style={{ width: "360px", flexShrink: 0, marginTop: "-50px" }}
            >
              <div className="flex flex-col items-center overflow-visible" style={{ width: "440px" }}>
                {/* Gauge SVG — scaled larger than column, overflow visible */}
                <svg viewBox="0 0 400 240" style={{ width: "440px", height: "auto" }}>
                  {(() => {
                    const cx = 200;
                    const cy = 200;
                    const r = 140;
                    const rnd = (n: number) => Math.round(n * 1000) / 1000;
                    const polarToCart = (angleDeg: number) => {
                      const rad = (Math.PI * (180 - angleDeg)) / 180;
                      return { x: rnd(cx + r * Math.cos(rad)), y: rnd(cy - r * Math.sin(rad)) };
                    };
                    const arcPath = (startDeg: number, endDeg: number) => {
                      const s = polarToCart(startDeg);
                      const e = polarToCart(endDeg);
                      const large = endDeg - startDeg > 180 ? 1 : 0;
                      return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
                    };
                    const zones = [
                      { start: 0, end: 70.2, color: "#E5484D" },
                      { start: 70.2, end: 124.2, color: "#F2B33D" },
                      { start: 124.2, end: 151.2, color: "#5FD9C2" },
                      { start: 151.2, end: 180, color: "#00BBA5" },
                    ];
                    const needleAngle = (78 / 100) * 180;
                    const needleEnd = polarToCart(needleAngle);
                    return (
                      <>
                        <path d={arcPath(0, 180)} stroke="rgba(255,255,255,0.08)" strokeWidth="18" fill="none" strokeLinecap="round" />
                        {zones.map((z) => (
                          <path key={z.color} d={arcPath(z.start, z.end)} stroke={z.color} strokeWidth="18" fill="none" strokeLinecap="round" />
                        ))}
                        {/* Needle — less opaque, behind score */}
                        <line x1={cx} y1={cy} x2={needleEnd.x} y2={needleEnd.y} stroke="white" strokeWidth="3" opacity="0.35" />
                        <circle cx={cx} cy={cy} r="6" fill="white" opacity="0.35" />
                        {/* Score — on top */}
                        <text x={cx} y={cy - 40} textAnchor="middle" style={{ fontFamily: "var(--font-inter)", fontWeight: 800, fontSize: "56px", fill: "#FFFFFF" }}>
                          78
                        </text>
                        <text x={cx} y={cy - 12} textAnchor="middle" style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "12px", fill: "#5FD9C2", letterSpacing: "0.12em" }}>
                          HIGH ROX
                        </text>
                      </>
                    );
                  })()}
                </svg>

                {/* Score range legend — 2x2 grid */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-3 mt-4 w-full max-w-[320px]">
                  {[
                    { range: "0-39", color: "#E5484D", label: "Critical" },
                    { range: "40-69", color: "#F2B33D", label: "Optimize" },
                    { range: "70-84", color: "#5FD9C2", label: "High ROX" },
                    { range: "85-100", color: "#00BBA5", label: "Elite" },
                  ].map((t) => (
                    <div key={t.range} className="flex items-center gap-2">
                      <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: t.color, flexShrink: 0 }} />
                      <span style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "13px", color: "rgba(255,255,255,0.55)" }}>
                        {t.range} {t.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ═══════════════════ 2. ROI vs ROX ═══════════════════ */}
      <section style={{ background: "#FFFFFF", padding: "100px 0" }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={headerVariants}>
            <motion.p variants={fadeUp} style={{
              fontFamily: "var(--font-inter)",
              fontWeight: 600,
              fontSize: "11px",
              color: "#1A56DB",
              letterSpacing: "0.14em",
              textTransform: "uppercase" as const,
              marginBottom: "16px",
            }}>The Problem with ROI</motion.p>
            <motion.h2
              variants={fadeUp}
              className="leading-[1.15]"
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 500,
                fontSize: "clamp(28px, 4.5vw, 42px)",
                color: "#061341",
                letterSpacing: "-0.02em",
                maxWidth: "780px",
                marginBottom: "48px",
              }}
            >
              Most teams measure what they spent. Almost none measure what happened after they paid for it.
            </motion.h2>
          </motion.div>

          {/* Comparison cards */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger} className="grid grid-cols-1 md:grid-cols-2 gap-8" style={{ marginBottom: "48px" }}>
            {/* ROI card */}
            <motion.div
              variants={fadeUp}
              style={{
                background: "#F8F9FC",
                borderRadius: "16px",
                padding: "36px 32px",
                borderTop: "3px solid rgba(6,19,65,0.15)",
              }}
            >
              <p style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "10px", color: "rgba(6,19,65,0.4)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "16px" }}>
                Traditional ROI
              </p>
              <h3 style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "22px", color: "#061341", marginBottom: "20px" }}>
                What you spent.
              </h3>
              <div className="space-y-3" style={{ marginBottom: "24px" }}>
                {["Total event cost", "Cost per lead", "Number of badge scans", "General booth traffic estimate"].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(6,19,65,0.3)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    <span style={{ fontFamily: "var(--font-inter)", fontWeight: 300, fontSize: "15px", color: "rgba(6,19,65,0.6)" }}>{item}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: "1px solid rgba(6,19,65,0.06)", paddingTop: "16px" }}>
                <p style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "14px", color: "rgba(6,19,65,0.5)", fontStyle: "italic", lineHeight: 1.6 }}>
                  What is missing: depth of engagement, lead intent, follow-up speed, and whether any of it converted. No visibility into what actually happened across your moments and experiences.
                </p>
              </div>
            </motion.div>

            {/* ROX card */}
            <motion.div
              variants={fadeUp}
              style={{
                background: "#061341",
                borderRadius: "16px",
                padding: "36px 32px",
                borderTop: "3px solid #00BBA5",
              }}
            >
              <p style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "10px", color: "#00BBA5", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "16px" }}>
                Return on Experience
              </p>
              <h3 style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "22px", color: "#FFFFFF", marginBottom: "20px" }}>
                What actually happened.
              </h3>
              <div className="space-y-3" style={{ marginBottom: "24px" }}>
                {[
                  "Quality of leads captured, not just quantity",
                  "How deeply each visitor engaged with your content",
                  "How fast your team followed up after the event",
                  "How many leads converted to pipeline or hires",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00BBA5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    <span style={{ fontFamily: "var(--font-inter)", fontWeight: 300, fontSize: "15px", color: "rgba(255,255,255,0.8)" }}>{item}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "16px" }}>
                <p style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "14px", color: "rgba(0,187,165,0.8)", fontStyle: "italic", lineHeight: 1.6 }}>
                  One score from 0 to 100. Four categories. Every interaction measured the same way, so you can compare events, reps, and tactics with data instead of instinct.
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Body paragraph — spans both columns */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <p style={{
              fontFamily: "var(--font-inter)",
              fontWeight: 300,
              fontSize: "15px",
              color: "rgba(6,19,65,0.55)",
              lineHeight: 1.75,
              gridColumn: "1 / -1",
            }}>
              Most event teams walk away with a cost per lead and a rough headcount. Those numbers tell you what you invested. They tell you nothing about which conversations revealed intent, which rep had the best interactions, how long people engaged, or whether your follow-up happened in time to matter. ROI answers the finance question. ROX answers the performance question. Both matter. Only one of them has been missing.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ 3. WHAT ROX MEASURES ═══════════════════ */}
      <section style={{ background: "#F8F9FC", padding: "100px 0" }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={headerVariants}>
            <motion.p variants={fadeUp} style={{
              fontFamily: "var(--font-inter)",
              fontWeight: 600,
              fontSize: "11px",
              color: "#00BBA5",
              letterSpacing: "0.14em",
              textTransform: "uppercase" as const,
              marginBottom: "16px",
            }}>How ROX Is Scored</motion.p>
            <motion.h2
              variants={fadeUp}
              className="leading-[1.1]"
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 500,
                fontSize: "clamp(28px, 4.5vw, 42px)",
                color: "#061341",
                letterSpacing: "-0.02em",
                marginBottom: "16px",
              }}
            >
              Four categories. One score.
              <br />
              Every event measured the same way.
            </motion.h2>
            <motion.p
              variants={fadeUp}
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 300,
                fontSize: "15px",
                color: "rgba(6,19,65,0.5)",
                lineHeight: 1.65,
                maxWidth: "620px",
                marginBottom: "64px",
              }}
            >
              Each category is worth 25% of your total ROX score. Skip the ones you do not have data for. Your score calculates from what you know.
            </motion.p>
          </motion.div>

          {/* 2x2 category grid with unique accent colors */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger} className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ marginBottom: "32px" }}>
            {categories.map((cat) => (
              <motion.div
                key={cat.num}
                variants={fadeUp}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(6,19,65,0.08)",
                  borderLeft: `3px solid ${cat.accent}`,
                  borderRadius: "16px",
                  padding: "36px 32px",
                  boxShadow: "0 2px 12px rgba(6,19,65,0.06)",
                }}
              >
                <div className="flex items-center gap-3" style={{ marginBottom: "8px" }}>
                  <span style={{
                    fontFamily: "var(--font-inter)",
                    fontWeight: 600,
                    fontSize: "11px",
                    color: cat.accent,
                    background: `${cat.accent}14`,
                    borderRadius: "20px",
                    padding: "4px 10px",
                  }}>
                    {cat.num}
                  </span>
                  <span style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "11px", color: "rgba(6,19,65,0.35)" }}>
                    25% of ROX score
                  </span>
                </div>
                <h3 style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "22px", color: "#061341", marginBottom: "12px" }}>
                  {cat.name}
                </h3>
                <p style={{ fontFamily: "var(--font-inter)", fontWeight: 300, fontSize: "15px", color: "rgba(6,19,65,0.55)", lineHeight: 1.6 }}>
                  {cat.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Skip note — spans both columns */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <p style={{
              fontFamily: "var(--font-inter)",
              fontWeight: 300,
              fontSize: "15px",
              color: "rgba(6,19,65,0.5)",
              lineHeight: 1.65,
              gridColumn: "1 / -1",
            }}>
              Don&apos;t have all four numbers? That is the point. Most teams don&apos;t. Run the calculator with what you have and see where the gaps are.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ 4. SCORE TIERS ═══════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundSize: "200% 200%",
          animation: "bgShift 16s ease-in-out infinite",
          backgroundImage: mainMinimal,
          padding: "100px 0",
        }}
      >
        {/* Geometric SVG overlay (main-minimal) */}
        <MainMinimalOverlay />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={headerVariants}>
            <motion.p variants={fadeUp} style={{
              fontFamily: "var(--font-inter)",
              fontWeight: 600,
              fontSize: "11px",
              color: "#F2B33D",
              letterSpacing: "0.14em",
              textTransform: "uppercase" as const,
              marginBottom: "16px",
            }}>ROX Score Ranges</motion.p>
            <motion.h2
              variants={fadeUp}
              className="leading-[1.1]"
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 500,
                fontSize: "clamp(28px, 4.5vw, 42px)",
                color: "#FFFFFF",
                letterSpacing: "-0.02em",
                maxWidth: "600px",
                marginBottom: "48px",
              }}
            >
              Where does your score land?
            </motion.h2>
          </motion.div>

          {/* Tier bar */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={fadeUp}>
            <div style={{ display: "flex", height: "12px", borderRadius: "6px", overflow: "hidden", marginBottom: "8px" }}>
              {tiers.map((t) => (
                <div key={t.range} style={{ flex: 1, background: t.color }} />
              ))}
            </div>
            <div style={{ display: "flex", marginBottom: "24px" }}>
              {tiers.map((t) => (
                <p key={t.range} style={{ flex: 1, textAlign: "center", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
                  {t.range}
                </p>
              ))}
            </div>
          </motion.div>

          {/* Tier cards */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger} className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-4">
            {tiers.map((t) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  borderTop: `3px solid ${t.color}`,
                  borderRadius: "0 0 12px 12px",
                  padding: "24px 20px",
                }}
              >
                <div className="flex items-center gap-2" style={{ marginBottom: "12px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: t.color }} />
                  <span style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "16px", color: "#FFFFFF" }}>{t.name}</span>
                </div>
                <p style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "14px", color: "rgba(255,255,255,0.8)", lineHeight: 1.3, marginBottom: "10px" }}>
                  {t.headline}
                </p>
                <p style={{ fontFamily: "var(--font-inter)", fontWeight: 300, fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                  {t.body}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ 5. ROX ACROSS VERTICALS ═══════════════════ */}
      <section id="verticals" style={{ background: "#FFFFFF", padding: "100px 0" }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={headerVariants}>
            <motion.p variants={fadeUp} style={{
              fontFamily: "var(--font-inter)",
              fontWeight: 600,
              fontSize: "11px",
              color: "#6B21D4",
              letterSpacing: "0.14em",
              textTransform: "uppercase" as const,
              marginBottom: "16px",
            }}>ROX by Vertical</motion.p>
            <motion.h2
              variants={fadeUp}
              className="leading-[1.1]"
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 500,
                fontSize: "clamp(28px, 4.5vw, 42px)",
                color: "#061341",
                letterSpacing: "-0.02em",
                maxWidth: "700px",
                marginBottom: "16px",
              }}
            >
              The same score.
              <br />
              Five different contexts.
            </motion.h2>
            <motion.p
              variants={fadeUp}
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 300,
                fontSize: "15px",
                color: "rgba(6,19,65,0.5)",
                lineHeight: 1.65,
                maxWidth: "620px",
                marginBottom: "48px",
              }}
            >
              ROX applies wherever your team engages in person. The four categories stay the same. The inputs and benchmarks shift to match your vertical.
            </motion.p>
          </motion.div>

          {/* Vertical cards */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {verticals.map((v) => (
              <motion.div
                key={v.name}
                variants={fadeUp}
                style={{
                  background: v.bgTint,
                  border: `1px solid ${v.borderColor}`,
                  borderLeft: `3px solid ${v.color}`,
                  borderRadius: "16px",
                  padding: "32px 28px",
                }}
              >
                <div className="flex items-center gap-2.5" style={{ marginBottom: "12px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: v.color, flexShrink: 0 }} />
                  <p style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "18px", color: "#061341" }}>
                    {v.name}
                  </p>
                </div>
                <p style={{ fontFamily: "var(--font-inter)", fontWeight: 300, fontSize: "14px", color: "rgba(6,19,65,0.55)", lineHeight: 1.55, marginBottom: "20px" }}>
                  {v.context}
                </p>
                <div>
                  {v.active ? (
                    <a
                      href={v.href}
                      className="inline-flex items-center gap-1.5 transition-all duration-200 hover:opacity-75"
                      style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "13px", color: v.color }}
                    >
                      {v.linkText}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>
                    </a>
                  ) : (
                    <span style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "13px", color: "rgba(6,19,65,0.3)" }}>
                      Coming soon
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ 6. FINAL CTA ═══════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundSize: "200% 200%",
          animation: "bgShift 16s ease-in-out infinite",
          backgroundImage: mainMinimal,
          padding: "120px 0",
        }}
      >
        {/* Geometric SVG overlay (main-minimal) */}
        <MainMinimalOverlay />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={headerVariants}
            style={{ maxWidth: "640px" }}
          >
            <motion.p variants={fadeUp} style={{
              fontFamily: "var(--font-inter)",
              fontWeight: 600,
              fontSize: "11px",
              color: "#00BBA5",
              letterSpacing: "0.14em",
              textTransform: "uppercase" as const,
              marginBottom: "16px",
            }}>Get Started</motion.p>

            <motion.h2
              variants={fadeUp}
              className="leading-[1.08]"
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 500,
                fontSize: "clamp(26px, 4.5vw, 44px)",
                color: "#FFFFFF",
                letterSpacing: "-0.02em",
                marginBottom: "20px",
              }}
            >
              Your next moment has a score.
              <br className="sm:hidden" />{" "}
              Find out what it is.
            </motion.h2>

            <motion.p
              variants={fadeUp}
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 300,
                fontSize: "15px",
                color: "rgba(255, 255, 255, 0.55)",
                lineHeight: 1.65,
                maxWidth: "540px",
                marginBottom: "40px",
              }}
            >
              Run your numbers in under two minutes. Or schedule a demo to see ROX dashboards live with your team&apos;s data.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-row gap-3 sm:gap-4">
              {/* Primary: Schedule a Demo */}
              <a
                href="#demo"
                className="inline-flex items-center justify-center flex-1 sm:flex-initial text-[12px] sm:text-[16px] py-2.5 sm:py-4 px-3 sm:px-9 transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 600,
                  color: "#FFFFFF",
                  background: "linear-gradient(135deg, #00BBA5, #1A56DB)",
                  borderRadius: "8px",
                  letterSpacing: "-0.01em",
                }}
              >
                Schedule a Demo
              </a>

              {/* Secondary: Calculate Your ROX */}
              <a
                href="/rox/trade-shows"
                className="inline-flex items-center justify-center flex-1 sm:flex-initial text-[12px] sm:text-[16px] py-2.5 sm:py-4 px-3 sm:px-9 transition-all duration-200"
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 500,
                  color: "#FFFFFF",
                  background: "transparent",
                  borderRadius: "8px",
                  border: "1.5px solid rgba(255, 255, 255, 0.25)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.5)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.25)"; }}
              >
                Calculate Your ROX
              </a>
            </motion.div>

          </motion.div>
        </div>
      </section>
    </>
  );
}
