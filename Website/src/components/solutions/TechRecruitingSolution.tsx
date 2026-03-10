"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

/* ── Animation variants ─────────────────────────────── */

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

/* ── Brand-kit geometric patterns ─────────────────────── */

/**
 * TEAL-BRACKET — light teal bg with L-shaped corner brackets
 */
function TealBracket() {
  return (
    <>
      {/* Top color bar — hidden on mobile */}
      <div
        className="absolute top-0 left-0 right-0 z-[1] hidden sm:block"
        style={{ height: "3px", background: "linear-gradient(90deg, #5FD9C2, #1A8A76)" }}
      />
      {/* L-shaped corner brackets — hidden on mobile */}
      <svg
        className="pointer-events-none absolute inset-0 w-full h-full hidden sm:block"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMaxYMax slice"
        aria-hidden="true"
      >
        <path d="M 1224 900 L 1224 810 L 1440 810" stroke="#1A8A76" strokeOpacity="0.15" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M 1032 900 L 1032 684 L 1440 684" stroke="#1A8A76" strokeOpacity="0.1" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        <path d="M 816 900 L 816 531 L 1440 531" stroke="#1A8A76" strokeOpacity="0.06" strokeWidth="0.8" fill="none" strokeLinecap="round" />
        <path d="M 1152 0 L 1152 80 L 1440 80" stroke="#1A8A76" strokeOpacity="0.09" strokeWidth="1" fill="none" strokeLinecap="round" />
      </svg>
    </>
  );
}

/**
 * TEAL-LINES — dark teal bg with diagonal line pattern
 */
function TealLines() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 w-full h-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern id="diag-lines" patternUnits="userSpaceOnUse" width="40" height="40" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="40" stroke="white" strokeOpacity="0.06" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#diag-lines)" />
    </svg>
  );
}

/** Dark bracket variant for Final CTA */
function TealBracketDark() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 w-full h-full"
      viewBox="0 0 1440 900"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMaxYMax slice"
      aria-hidden="true"
    >
      <path d="M 1224 900 L 1224 810 L 1440 810" stroke="white" strokeOpacity="0.08" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M 1032 900 L 1032 684 L 1440 684" stroke="white" strokeOpacity="0.05" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M 816 900 L 816 531 L 1440 531" stroke="white" strokeOpacity="0.03" strokeWidth="0.8" fill="none" strokeLinecap="round" />
      <path d="M 1152 0 L 1152 80 L 1440 80" stroke="white" strokeOpacity="0.05" strokeWidth="1" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* ── Hero stats (industry-level) ──────────────────────── */

const heroStats = [
  { number: "$4.7K", label: "Average cost-per-hire for technical roles in the US" },
  { number: "< 10%", label: "Of recruiting teams can tie event spend to hires" },
  { number: "44 days", label: "Average time to fill a technical position" },
];

/* ── Key features ─────────────────────────────────────── */

const keyFeatures = [
  {
    headline: "Candidate Capture & Scoring",
    bullets: [
      "Capture candidate info, role interest, and experience level",
      "Score by engagement depth and fit, not just resume volume",
      "Sync qualified candidates to your ATS or CRM automatically",
    ],
    icon: "capture",
  },
  {
    headline: "Role-Specific Content Delivery",
    bullets: [
      "Deliver personalized content paths based on role and interest",
      "Replace paper handouts with interactive digital experiences",
      "Track which roles and benefits resonate most with candidates",
    ],
    icon: "content",
  },
  {
    headline: "Engagement Analytics",
    bullets: [
      "See who engaged, what they explored, and for how long",
      "Identify high-intent candidates before they leave the floor",
      "Export engagement data into your recruiting recap and ROI reports",
    ],
    icon: "analytics",
  },
  {
    headline: "ATS & Workflow Integrations",
    bullets: [
      "Connects with your existing ATS, HRIS, and recruiting tools",
      "Route top candidates to the right recruiter before event ends",
      "Trigger follow-up workflows automatically from engagement data",
    ],
    icon: "integrations",
  },
];

/* ── ROX categories ───────────────────────────────────── */

const roxCategories = [
  { label: "Candidate Capture Rate", value: "~25%", description: "Most booths collect resumes without qualifying candidates" },
  { label: "Engagement Quality", value: "Low", description: "No data on which roles or programs resonated with each candidate" },
  { label: "Time to First Contact", value: "5+ days", description: "Top candidates accept other offers while your team sorts through stacks" },
  { label: "Conversion to Hire", value: "Unknown", description: "No way to tie recruiting event spend to actual hires" },
];

/* ── How It Works ─────────────────────────────────────── */

const workflowSteps = [
  { step: "01", headline: "Create Moments", body: "Build your recruiting event, configure role-specific content, and define follow-up flows before the doors open." },
  { step: "02", headline: "Engage", body: "Candidates interact through iPads and mobile. Every role interest, experience level, and preference is captured live." },
  { step: "03", headline: "Score & Route", body: "Candidates are scored by engagement depth and fit. Top talent routes to the right recruiter automatically." },
  { step: "04", headline: "View Insights", body: "ROX dashboard updates in real time. Compare candidate quality and conversion across your entire event calendar." },
];

/* ── Testimonials ─────────────────────────────────────── */

const testimonials = [
  { quote: "Momentify replaced our clipboard-and-spreadsheet process with something our recruiters actually want to use. We finally know who is worth the follow-up.", role: "Director of Talent Acquisition" },
  { quote: "We went from losing half our candidate data after every career fair to routing qualified leads to the right recruiter before the event was over.", role: "Campus Recruiting Manager" },
  { quote: "The engagement data changed how we staff events. We now know which roles draw interest and which content actually moves candidates forward.", role: "Technical Recruiting Lead" },
];

/* ── Case study stats ─────────────────────────────────── */

const caseStudyStats = [
  { number: "7", label: "Hires traced back to a digital recruiting process that did not exist a year ago" },
  { number: "1,681", label: "Opt-ins captured across recruiting events" },
  { number: "544", label: "Follow-ups routed to the right recruiters" },
];

/* ── Icon components ──────────────────────────────────── */

function IconCapture() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="3" width="22" height="26" rx="3" stroke="#5FD9C2" strokeWidth="1.8" />
      <circle cx="16" cy="25" r="1.2" fill="#5FD9C2" />
      <line x1="9" y1="6" x2="23" y2="6" stroke="#5FD9C2" strokeWidth="1" strokeOpacity="0.3" />
      <circle cx="16" cy="14" r="3" stroke="#5FD9C2" strokeWidth="1.4" />
      <path d="M12 18h8" stroke="#5FD9C2" strokeWidth="1" strokeOpacity="0.5" strokeLinecap="round" />
    </svg>
  );
}

function IconContent() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="24" height="24" rx="3" stroke="#5FD9C2" strokeWidth="1.8" />
      <path d="M10 11h12M10 16h8M10 21h10" stroke="#5FD9C2" strokeWidth="1.4" strokeLinecap="round" strokeOpacity="0.7" />
    </svg>
  );
}

function IconAnalytics() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polyline points="4,24 12,14 18,18 28,6" stroke="#5FD9C2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="14" r="2" stroke="#5FD9C2" strokeWidth="1.2" />
      <circle cx="18" cy="18" r="2" stroke="#5FD9C2" strokeWidth="1.2" />
      <circle cx="28" cy="6" r="2" stroke="#5FD9C2" strokeWidth="1.2" />
    </svg>
  );
}

function IconIntegrations() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="5" stroke="#5FD9C2" strokeWidth="1.8" />
      <path d="M16 3v3M16 26v3M3 16h3M26 16h3M7.1 7.1l2.1 2.1M22.8 22.8l2.1 2.1M7.1 24.9l2.1-2.1M22.8 9.2l2.1-2.1" stroke="#5FD9C2" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

const featureIconMap: Record<string, () => React.ReactNode> = {
  capture: IconCapture,
  content: IconContent,
  analytics: IconAnalytics,
  integrations: IconIntegrations,
};

/* ════════════════════════════════════════════════════════
   TECHNICAL RECRUITING SOLUTION PAGE
   ════════════════════════════════════════════════════════ */

export default function TechRecruitingSolution() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  return (
    <>
      {/* ═══════════════════ 1. HERO ═══════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundSize: "200% 200%",
          animation: "bgShift 16s ease-in-out infinite",
          backgroundImage: "linear-gradient(135deg, #040E28 0%, #1A8A76 55%, #5FD9C2 100%)",
          minHeight: "560px",
        }}
      >
        <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMaxYMax slice" aria-hidden="true">
          <path d="M1440 900 L1440 270 L960 0 L480 0 L1008 360 L1008 900 Z" fill="white" fillOpacity="0.05" />
          <path d="M1440 900 L1440 468 L864 108 L384 108 L864 468 L864 900 Z" fill="white" fillOpacity="0.04" />
        </svg>

        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute w-[600px] h-[600px] rounded-full opacity-[0.07] blur-[120px]" style={{ background: "radial-gradient(circle, #A3EBD8, transparent 70%)", top: "10%", left: "60%", animation: "ambientFloat1 12s ease-in-out infinite" }} />
          <div className="absolute w-[500px] h-[500px] rounded-full opacity-[0.05] blur-[100px]" style={{ background: "radial-gradient(circle, #1A8A76, transparent 70%)", bottom: "0%", left: "10%", animation: "ambientFloat2 15s ease-in-out infinite" }} />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12" style={{ paddingTop: "140px", paddingBottom: "100px" }}>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            style={{
              fontFamily: "var(--font-inter)",
              fontWeight: 600,
              fontSize: "11px",
              color: "#5FD9C2",
              letterSpacing: "0.14em",
              textTransform: "uppercase" as const,
              marginBottom: "16px",
            }}
          >
            Technical Recruiting
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="leading-[1.08]"
            style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "clamp(32px, 5.5vw, 52px)", color: "#FFFFFF", letterSpacing: "-0.02em", maxWidth: "820px", marginBottom: "20px" }}
          >
            Your recruiting events deserve more than resumes.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "clamp(16px, 2vw, 20px)", color: "rgba(255, 255, 255, 0.85)", letterSpacing: "-0.01em", maxWidth: "660px", marginBottom: "16px" }}
          >
            The engagement platform between<br className="sm:hidden" /> &ldquo;Hello&rdquo; and ATS.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            style={{ fontFamily: "var(--font-inter)", fontWeight: 300, fontSize: "15px", color: "rgba(255, 255, 255, 0.55)", lineHeight: 1.5, maxWidth: "560px", marginBottom: "48px" }}
          >
            Capture candidate intent at the event. Score by fit, not just interest. Follow up before the best talent accepts somewhere else.
          </motion.p>

          {/* CTA pair */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.30 }} className="flex flex-col sm:flex-row items-start gap-4" style={{ marginTop: "48px" }}>
            <a href="/rox/recruiting" className="inline-flex items-center justify-center font-semibold text-[14px] py-3.5 px-7 rounded-lg transition-all duration-200 hover:opacity-90 hover:scale-[1.02]" style={{ fontFamily: "var(--font-inter)", color: "#FFFFFF", background: "linear-gradient(135deg, rgba(95, 217, 194, 0.5), rgba(163, 235, 216, 0.4))", border: "1.5px solid rgba(163, 235, 216, 0.35)" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(163, 235, 216, 0.6)"; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(163, 235, 216, 0.35)"; }}>
              Calculate Your Recruiting ROX
            </a>
            <a href="/demo?source=technical-recruiting" className="inline-flex items-center justify-center font-semibold text-[14px] text-white py-3.5 px-7 rounded-lg transition-all duration-200 hover:bg-white/[0.08]" style={{ fontFamily: "var(--font-inter)", border: "1.5px solid rgba(255, 255, 255, 0.35)", background: "transparent" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.6)"; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.35)"; }}>
              Schedule a Demo
            </a>
          </motion.div>

          {/* Stat row */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.42 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-8 sm:gap-0"
            style={{ marginTop: "40px" }}
          >
            {heroStats.map((stat, i) => (
              <div key={stat.number} className="flex items-center">
                {i > 0 && <div className="hidden sm:block" style={{ width: "1px", height: "48px", background: "rgba(255, 255, 255, 0.15)", marginLeft: "24px", marginRight: "24px" }} />}
                <div>
                  <p style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "clamp(36px, 4vw, 44px)", color: "#FFFFFF", lineHeight: 1, letterSpacing: "-0.02em", marginBottom: "6px" }}>{stat.number}</p>
                  <p style={{ fontFamily: "var(--font-inter)", fontWeight: 400, fontSize: "13px", color: "rgba(255, 255, 255, 0.50)", lineHeight: 1.4, maxWidth: "160px" }}>{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* ═══════════════════ 2. WHY MOMENTIFY + FEATURES ════════ */}
      {/* TEAL-BRACKET background from brand kit */}
      <section
        className="relative py-16 sm:py-24 overflow-hidden"
        style={{ background: "linear-gradient(145deg, #E8FDF8 0%, #F0FFFC 100%)" }}
      >
        <TealBracket />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
          {/* Two-column: copy left, iPad right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center" style={{ marginBottom: "64px" }}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={headerVariants}>
              <motion.p variants={fadeUp} className="uppercase font-semibold text-[12px] tracking-[0.14em] mb-4" style={{ color: "#1A8A76", fontFamily: "var(--font-inter)" }}>
                Why Momentify for Technical Recruiting
              </motion.p>
              <motion.h2 variants={fadeUp} className="leading-[1.1]" style={{ fontFamily: "var(--font-inter)", fontWeight: 500, letterSpacing: "-0.02em", fontSize: "clamp(28px, 4.5vw, 42px)", color: "#061341", marginBottom: "20px" }}>
                From handshake to hire, all in one platform
              </motion.h2>
              <motion.p variants={fadeUp} style={{ fontFamily: "var(--font-inter)", fontWeight: 300, fontSize: "15px", color: "rgba(6, 19, 65, 0.6)", lineHeight: 1.5, maxWidth: "480px", marginBottom: "28px" }}>
                Momentify works alongside your existing ATS and recruiting tools to capture what they miss: candidate engagement context, role interest signals, and conversation quality data.
              </motion.p>
              <motion.ul variants={fadeUp} className="space-y-3">
                {[
                  "Deliver personalized content paths based on role, program, and interest level",
                  "Score candidates by engagement depth and fit, not just resume volume",
                  "Track who engaged, what they explored, and for how long",
                  "Cross-event consistency across job fairs, hiring events, and campus visits",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-[7px] h-[6px] w-[6px] rounded-full flex-shrink-0" style={{ backgroundColor: "#5FD9C2" }} />
                    <span className="text-[14px] leading-[1.6]" style={{ fontFamily: "var(--font-inter)", fontWeight: 400, color: "rgba(6, 19, 65, 0.6)" }}>{item}</span>
                  </li>
                ))}
              </motion.ul>
            </motion.div>

            {/* iPad image */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="flex items-center justify-center">
              <div className="relative w-full" style={{ maxWidth: "520px" }}>
                <Image src="/TradeShowsiPad.png" alt="Momentify running on iPad at a recruiting event" width={1200} height={900} className="w-full h-auto" />
              </div>
            </motion.div>
          </div>

          {/* Feature grid */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {keyFeatures.map((feature) => {
              const Icon = featureIconMap[feature.icon];
              return (
                <motion.div key={feature.headline} variants={fadeUp} className="transition-all duration-200 hover:-translate-y-1" style={{ background: "rgba(255, 255, 255, 0.85)", backdropFilter: "blur(8px)", border: "1px solid rgba(26, 138, 118, 0.1)", borderRadius: "16px", padding: "32px 28px" }}>
                  <div className="flex items-center gap-3" style={{ marginBottom: "16px" }}>
                    <Icon />
                    <h3 style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "17px", color: "#061341" }}>{feature.headline}</h3>
                  </div>
                  <ul className="space-y-2">
                    {feature.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2.5">
                        <span className="mt-[7px] h-[5px] w-[5px] rounded-full flex-shrink-0" style={{ backgroundColor: "#5FD9C2" }} />
                        <span className="text-[13px] leading-[1.6]" style={{ fontFamily: "var(--font-inter)", fontWeight: 400, color: "rgba(6, 19, 65, 0.55)", textWrap: "pretty" as never }}>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ 3. ROX + HOW IT WORKS ═════════════ */}
      {/* TEAL-DOTS background from brand kit */}
      <section
        id="rox"
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #040E28 0%, #1A8A76 55%, #5FD9C2 100%)", padding: "100px 0" }}
      >
        <TealLines />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
          {/* ROX header */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={headerVariants} style={{ textAlign: "center", marginBottom: "48px" }}>
            <motion.p variants={fadeUp} className="uppercase font-semibold text-[12px] tracking-[0.14em] mb-4" style={{ color: "rgba(255, 255, 255, 0.6)", fontFamily: "var(--font-inter)" }}>
              Technical Recruiting
              <br />
              Return on Experience (ROX)™
            </motion.p>
            <motion.h2 variants={fadeUp} className="leading-[1.1] mx-auto" style={{ fontFamily: "var(--font-inter)", fontWeight: 500, letterSpacing: "-0.02em", fontSize: "clamp(31px, 5vw, 46px)", color: "#FFFFFF", maxWidth: "770px" }}>
              Do you know your
              <br />
              <span style={{ background: "linear-gradient(135deg, #A3EBD8, #5FD9C2)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                recruiting ROX score?
              </span>
            </motion.h2>
          </motion.div>

          {/* ROX gauge + categories — two column */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
            className="grid grid-cols-1 lg:grid-cols-[374px_1fr] gap-8"
            style={{ maxWidth: "1056px", margin: "0 auto 40px" }}
          >
            {/* Gauge card */}
            <motion.div
              variants={fadeUp}
              style={{ background: "rgba(6, 19, 65, 0.5)", border: "1px solid rgba(163, 235, 216, 0.15)", borderRadius: "16px", padding: "40px 36px", textAlign: "center" }}
            >
              <svg width="320" height="175" viewBox="-20 -2 220 120" style={{ margin: "0 auto 16px" }}>
                {/* Background arc */}
                <path d="M 20 100 A 70 70 0 0 1 160 100" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="16" strokeLinecap="round" />
                {/* Zone 2: Needs Optimization (70.2° → 124.2°) */}
                <path d="M 66.3 34.1 A 70 70 0 0 1 129.3 42.1" fill="none" stroke="#F2B33D" strokeWidth="8" />
                {/* Zone 3: High ROX (124.2° → 151.2°) */}
                <path d="M 129.3 42.1 A 70 70 0 0 1 151.3 66.3" fill="none" stroke="#5FD9C2" strokeWidth="8" />
                {/* Zone 4: Elite ROX (151.2° → 180°) */}
                <path d="M 151.3 66.3 A 70 70 0 0 1 160 100" fill="none" stroke="#0CF4DF" strokeWidth="8" strokeLinecap="round" />
                {/* Zone 1: Critical Gap (0° → 70.2°) — drawn last so red is top layer */}
                <path d="M 20 100 A 70 70 0 0 1 66.3 34.1" fill="none" stroke="#E5484D" strokeWidth="16" strokeLinecap="round" />
                {/* Score */}
                <text x="90" y="106" textAnchor="middle" fill="#FFFFFF" fontFamily="var(--font-inter)" fontWeight="600" fontSize="40">32</text>
                {/* Zone labels */}
                <text x="20.5" y="49" textAnchor="end" fill="rgba(255,255,255,0.45)" fontFamily="var(--font-inter)" fontWeight="500" fontSize="6">Critical</text>
                <text x="100.7" y="13" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontFamily="var(--font-inter)" fontWeight="500" fontSize="6">Optimize</text>
                <text x="152.8" y="40" textAnchor="start" fill="rgba(255,255,255,0.45)" fontFamily="var(--font-inter)" fontWeight="500" fontSize="6">High ROX</text>
                <text x="172.3" y="77" textAnchor="start" fill="rgba(255,255,255,0.45)" fontFamily="var(--font-inter)" fontWeight="500" fontSize="6">Elite</text>
              </svg>
              <p style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "13px", color: "#E5484D", letterSpacing: "0.08em", textTransform: "uppercase" }}>Critical Gap</p>
              <p style={{ fontFamily: "var(--font-inter)", fontWeight: 300, fontSize: "14px", color: "rgba(255, 255, 255, 0.50)", marginTop: "4px" }}>Industry average without Momentify</p>
              <div style={{ marginTop: "22px", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "18px" }}>
                <p style={{ fontFamily: "var(--font-inter)", fontWeight: 300, fontSize: "13px", color: "rgba(255, 255, 255, 0.35)" }}>Momentify clients average 2-3x improvement across all four ROX categories.</p>
              </div>
            </motion.div>

            {/* ROX category cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {roxCategories.map((cat) => (
                <motion.div
                  key={cat.label}
                  variants={fadeUp}
                  style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(163, 235, 216, 0.12)", borderRadius: "12px", padding: "26px 22px", backdropFilter: "blur(8px)" }}
                >
                  <p style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "14px", color: "#A3EBD8", marginBottom: "6px" }}>{cat.label}</p>
                  <p style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "32px", color: "#FFFFFF", letterSpacing: "-0.02em", marginBottom: "6px" }}>{cat.value}</p>
                  <p style={{ fontFamily: "var(--font-inter)", fontWeight: 300, fontSize: "13px", color: "rgba(255, 255, 255, 0.45)", lineHeight: 1.5 }}>{cat.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: "center", marginBottom: "80px" }}
          >
            <a href="/rox/recruiting" className="inline-flex items-center justify-center font-semibold text-[14px] py-3.5 px-7 rounded-lg transition-all duration-200 hover:opacity-90 hover:scale-[1.02]" style={{ fontFamily: "var(--font-inter)", color: "#FFFFFF", background: "linear-gradient(135deg, rgba(95, 217, 194, 0.6), rgba(163, 235, 216, 0.5))", border: "1.5px solid rgba(163, 235, 216, 0.35)" }}>
              Calculate Your Recruiting ROX
            </a>
            <p className="mt-3" style={{ fontFamily: "var(--font-inter)", fontWeight: 300, fontSize: "13px", color: "rgba(255, 255, 255, 0.40)" }}>
              Run your numbers in under two minutes. No login required.
            </p>
          </motion.div>

          {/* How It Works */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={headerVariants} style={{ marginBottom: "16px" }}>
            <motion.p variants={fadeUp} className="uppercase font-semibold text-[12px] tracking-[0.14em] mb-4" style={{ color: "rgba(255, 255, 255, 0.6)", fontFamily: "var(--font-inter)" }}>
              Built for Recruiting Teams on the Ground
            </motion.p>
            <motion.h2 variants={fadeUp} className="leading-[1.1]" style={{ fontFamily: "var(--font-inter)", fontWeight: 500, letterSpacing: "-0.02em", fontSize: "clamp(24px, 3.5vw, 36px)", color: "#FFFFFF", marginBottom: "40px", whiteSpace: "nowrap" as const }}>
              Show up.{" "}
              <span style={{ background: "linear-gradient(135deg, #A3EBD8, #FFFFFF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Stand out.
              </span>
              {" "}Follow up.
            </motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.map((step) => (
              <motion.div key={step.step} variants={fadeUp} className="transition-all duration-200 hover:-translate-y-1" style={{ background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(163, 235, 216, 0.12)", borderRadius: "16px", padding: "32px 24px", backdropFilter: "blur(8px)" }}>
                <p style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "32px", color: "rgba(163, 235, 216, 0.3)", lineHeight: 1, marginBottom: "16px" }}>{step.step}</p>
                <h3 style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "17px", color: "#FFFFFF", marginBottom: "10px" }}>{step.headline}</h3>
                <p style={{ fontFamily: "var(--font-inter)", fontWeight: 400, fontSize: "12px", color: "rgba(255, 255, 255, 0.55)", lineHeight: 1.6 }}>{step.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ 4. SOCIAL PROOF + CASE STUDY ══════ */}
      <section
        className="relative overflow-hidden"
        style={{ background: "#FFFFFF", padding: "100px 0" }}
      >
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
          {/* Testimonial strip — compact carousel */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={fadeUp}
            style={{
              background: "linear-gradient(145deg, #E8FDF8 0%, #D8FAF2 100%)",
              border: "1px solid rgba(26, 138, 118, 0.1)",
              borderRadius: "16px",
              padding: "36px 40px",
              marginBottom: "64px",
            }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="flex-1 min-w-0">
                <p style={{ fontFamily: "var(--font-inter)", fontWeight: 400, fontSize: "16px", color: "#061341", lineHeight: 1.7, marginBottom: "8px" }}>
                  &ldquo;{testimonials[activeTestimonial].quote}&rdquo;
                </p>
                <p style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "12px", color: "#1A8A76" }}>
                  {testimonials[activeTestimonial].role}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  onClick={() => setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                  className="transition-all duration-200 cursor-pointer hover:bg-[rgba(26,138,118,0.08)] rounded-full"
                  style={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(26, 138, 118, 0.2)", background: "transparent", padding: 0 }}
                  aria-label="Previous testimonial"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1A8A76" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                </button>
                <div className="flex items-center gap-2">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveTestimonial(i)}
                      className="transition-all duration-200 cursor-pointer"
                      style={{ width: i === activeTestimonial ? "20px" : "8px", height: "8px", borderRadius: "4px", background: i === activeTestimonial ? "#1A8A76" : "rgba(26, 138, 118, 0.2)", border: "none", padding: 0 }}
                      aria-label={`View testimonial ${i + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length)}
                  className="transition-all duration-200 cursor-pointer hover:bg-[rgba(26,138,118,0.08)] rounded-full"
                  style={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(26, 138, 118, 0.2)", background: "transparent", padding: 0 }}
                  aria-label="Next testimonial"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1A8A76" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Case Study */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={headerVariants}>
            <motion.p variants={fadeUp} className="uppercase font-semibold text-[12px] tracking-[0.14em] mb-4" style={{ color: "#1A8A76", fontFamily: "var(--font-inter)" }}>In the Field</motion.p>
            <motion.h2 variants={fadeUp} className="leading-[1.1]" style={{ fontFamily: "var(--font-inter)", fontWeight: 500, letterSpacing: "-0.02em", fontSize: "clamp(28px, 4.5vw, 42px)", color: "#061341", maxWidth: "700px", marginBottom: "40px" }}>
              7 hires traced back to a digital recruiting process that did not exist a year ago.
            </motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={fadeUp} style={{ background: "#F8F9FC", border: "1px solid rgba(6, 19, 65, 0.08)", borderRadius: "20px", padding: "48px" }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              <div>
                <Image src="/logos/mustang-cat-color.png" alt="Mustang CAT" width={200} height={40} style={{ height: "32px", width: "auto", marginBottom: "20px", objectFit: "contain" }} />
                <h3 style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "22px", color: "#061341", marginBottom: "16px" }}>Mustang CAT, Technical Recruiting Program</h3>
                <ul className="space-y-2" style={{ marginBottom: "24px" }}>
                  {[
                    "Deployed Momentify across campus recruiting events and career fairs",
                    "Every candidate interaction captured on iPad and mobile, scored by fit",
                    "1,681 opt-ins captured, 544 follow-ups routed to the right recruiters",
                    "7 hires traced directly to the Momentify-powered recruiting process",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="mt-[7px] h-[5px] w-[5px] rounded-full flex-shrink-0" style={{ backgroundColor: "#5FD9C2" }} />
                      <span className="text-[14px] leading-[1.6]" style={{ fontFamily: "var(--font-inter)", fontWeight: 400, color: "rgba(6, 19, 65, 0.55)" }}>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2" style={{ marginBottom: "24px" }}>
                  {["Technical Recruiting", "Campus Recruiting"].map((tag) => (
                    <span key={tag} style={{ display: "inline-block", fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "11px", color: "#1A8A76", background: "rgba(26, 138, 118, 0.08)", borderRadius: "20px", padding: "4px 12px" }}>{tag}</span>
                  ))}
                </div>
                <a href="/case-studies/mustang-cat" className="inline-flex items-center justify-center font-semibold text-[14px] py-3 px-6 rounded-lg transition-all duration-200 hover:opacity-90 hover:scale-[1.02]" style={{ fontFamily: "var(--font-inter)", color: "#FFFFFF", background: "linear-gradient(135deg, #1A8A76, #5FD9C2)", border: "1.5px solid rgba(95, 217, 194, 0.4)" }}>
                  Read the Full Case Study
                </a>
              </div>
              <div className="flex flex-col gap-4">
                {caseStudyStats.map((stat) => (
                  <div key={stat.label} style={{ background: "#FFFFFF", border: "1px solid rgba(6, 19, 65, 0.08)", borderRadius: "12px", padding: "20px 24px" }}>
                    <span style={{ display: "inline-block", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "40px", lineHeight: 1, letterSpacing: "-0.02em", marginBottom: "6px", background: "linear-gradient(135deg, #00BBA5, #1A56DB)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{stat.number}</span>
                    <p style={{ fontFamily: "var(--font-inter)", fontWeight: 400, fontSize: "13px", color: "rgba(6, 19, 65, 0.50)", lineHeight: 1.4 }}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ 5. FINAL CTA ════════════ */}
      <section
        id="demo"
        className="relative overflow-hidden"
        style={{
          backgroundSize: "200% 200%",
          animation: "bgShift 16s ease-in-out infinite",
          backgroundImage: "linear-gradient(135deg, #040E28 0%, #1A8A76 55%, #5FD9C2 100%)",
          padding: "96px 0",
        }}
      >
        <TealBracketDark />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={headerVariants} style={{ maxWidth: "640px" }}>
              <motion.p variants={fadeUp} className="uppercase font-semibold text-[12px] tracking-[0.14em] mb-4" style={{ color: "rgba(255, 255, 255, 0.6)", fontFamily: "var(--font-inter)" }}>Get Started</motion.p>
              <motion.h2 variants={fadeUp} className="leading-[1.08]" style={{ fontFamily: "var(--font-inter)", fontWeight: 500, letterSpacing: "-0.02em", fontSize: "clamp(32px, 4.5vw, 44px)", color: "#FFFFFF", marginBottom: "20px" }}>
                Make every recruiting moment count.
              </motion.h2>
              <motion.p variants={fadeUp} className="max-w-[560px]" style={{ fontFamily: "var(--font-inter)", fontWeight: 300, fontSize: "15px", color: "rgba(255, 255, 255, 0.60)", lineHeight: 1.5, marginBottom: "40px" }}>
                Discover how Momentify turns recruiting event chaos into clarity, with better tools, better data, and better hires.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-start gap-4">
                <a href="/rox/recruiting" className="inline-flex items-center justify-center font-semibold text-[14px] py-3.5 px-7 rounded-lg transition-all duration-200 hover:opacity-90 hover:scale-[1.02]" style={{ fontFamily: "var(--font-inter)", color: "#FFFFFF", background: "linear-gradient(135deg, rgba(95, 217, 194, 0.5), rgba(163, 235, 216, 0.4))", border: "1.5px solid rgba(163, 235, 216, 0.35)" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(163, 235, 216, 0.6)"; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(163, 235, 216, 0.35)"; }}>
                  Calculate Your Recruiting ROX
                </a>
                <a href="/demo?source=technical-recruiting" className="inline-flex items-center justify-center font-semibold text-[14px] text-white py-3.5 px-7 rounded-lg transition-all duration-200 hover:bg-white/[0.08]" style={{ fontFamily: "var(--font-inter)", border: "1.5px solid rgba(255, 255, 255, 0.35)", background: "transparent" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.6)"; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.35)"; }}>
                  Schedule a Demo
                </a>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>
    </>
  );
}
