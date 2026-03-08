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
 * AMBER-BRACKET — light amber bg with L-shaped corner brackets
 */
function AmberBracket() {
  return (
    <>
      {/* Top color bar — hidden on mobile */}
      <div
        className="absolute top-0 left-0 right-0 z-[1] hidden sm:block"
        style={{ height: "3px", background: "linear-gradient(90deg, #F2B33D, #A86B00)" }}
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
        <path d="M 1224 900 L 1224 810 L 1440 810" stroke="#A86B00" strokeOpacity="0.15" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M 1032 900 L 1032 684 L 1440 684" stroke="#A86B00" strokeOpacity="0.1" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        <path d="M 816 900 L 816 531 L 1440 531" stroke="#A86B00" strokeOpacity="0.06" strokeWidth="0.8" fill="none" strokeLinecap="round" />
        <path d="M 1152 0 L 1152 80 L 1440 80" stroke="#A86B00" strokeOpacity="0.09" strokeWidth="1" fill="none" strokeLinecap="round" />
      </svg>
    </>
  );
}

/**
 * AMBER-CROSSES — dark amber bg with scattered cross pattern
 */
function AmberCrosses() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 w-full h-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern id="crosses-amber" patternUnits="userSpaceOnUse" width="140" height="140">
          <line x1="30" y1="22" x2="30" y2="38" stroke="white" strokeOpacity="0.07" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="22" y1="30" x2="38" y2="30" stroke="white" strokeOpacity="0.07" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="95" y1="80" x2="95" y2="92" stroke="white" strokeOpacity="0.05" strokeWidth="1" strokeLinecap="round"/>
          <line x1="89" y1="86" x2="101" y2="86" stroke="white" strokeOpacity="0.05" strokeWidth="1" strokeLinecap="round"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#crosses-amber)"/>
    </svg>
  );
}

/** Dark bracket variant for Final CTA */
function AmberBracketDark() {
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
  { number: "$890B", label: "US field sales market spend annually" },
  { number: "65%", label: "Of field content goes unused by reps" },
  { number: "3+ days", label: "Average lag from site visit to CRM entry" },
];

/* ── Key features ─────────────────────────────────────── */

const keyFeatures = [
  {
    headline: "Offline-Ready Field Capture",
    bullets: [
      "Works in low-connectivity environments without dropping data",
      "Syncs automatically when connection restores",
      "Captures role, interest, and conversation notes in seconds",
    ],
    icon: "capture",
  },
  {
    headline: "Smart Content Delivery",
    bullets: [
      "Role-based content recommendations at point of conversation",
      "Track which assets get shared and which get opened",
      "Reps always have the right spec sheet, case study, or demo",
    ],
    icon: "content",
  },
  {
    headline: "Real-Time Follow-Up Triggers",
    bullets: [
      "Engagement data routes to the right rep before they leave the site",
      "Priority scoring based on conversation depth and content interaction",
      "Automated CRM sync with full conversation context",
    ],
    icon: "analytics",
  },
  {
    headline: "Integrations That Work",
    bullets: [
      "Native CRM connectors for Salesforce, HubSpot, and Dynamics",
      "Content library sync from SharePoint, Google Drive, or Box",
      "API-ready for custom field workflows and reporting",
    ],
    icon: "integrations",
  },
];

/* ── ROX categories ───────────────────────────────────── */

const roxCategories = [
  { label: "Interaction Capture Rate", value: "~25%", description: "Most reps capture fewer than 1 in 4 meaningful field interactions" },
  { label: "Content Engagement", value: "Low", description: "No visibility into which content prospects actually consume" },
  { label: "Follow-Up Speed", value: "3+ days", description: "CRM entries lag days behind the actual conversation" },
  { label: "Deal Progression", value: "Unknown", description: "No way to tie field visits to pipeline movement" },
];

/* ── How It Works ─────────────────────────────────────── */

const workflowSteps = [
  { step: "01", headline: "Create Moments", body: "Build your field playbook, load content libraries, configure capture templates, and set follow-up rules before reps hit the road." },
  { step: "02", headline: "Engage", body: "Reps capture conversations, deliver targeted content, and log interactions from any device, online or off." },
  { step: "03", headline: "Sync Insights", body: "Engagement data flows to your CRM automatically with full context, priority scoring, and next-step triggers." },
  { step: "04", headline: "View Insights", body: "See which reps, regions, and content are driving pipeline. Optimize what works, fix what does not." },
];

/* ── Testimonials ─────────────────────────────────────── */

const testimonials = [
  { quote: "Our reps used to come back from job sites with nothing but business cards and memory. Now every conversation is captured with context before they leave the parking lot.", role: "VP of Field Sales" },
  { quote: "We finally know which content is actually being used in the field and what prospects care about. It changed how we build our sales materials.", role: "Director of Sales Enablement" },
  { quote: "Follow-up used to take days. Now our CRM is updated before the rep finishes their drive home. The speed alone has been worth it.", role: "Head of Sales Operations" },
];

/* ── Case study stats (placeholder) ─────────────────── */

const caseStudyStats = [
  { number: "TBD", label: "Field rep adoption rate" },
  { number: "TBD", label: "Conversations captured per quarter" },
  { number: "TBD", label: "Follow-ups routed automatically" },
];

/* ── Icon components ──────────────────────────────────── */

function IconCapture() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Device with signal slash — wifi-off style */}
      <rect x="6" y="4" width="20" height="24" rx="3" stroke="#F2B33D" strokeWidth="1.8" />
      <circle cx="16" cy="24" r="1.2" fill="#F2B33D" />
      <path d="M10 11c1.5-2 3.5-3 6-3s4.5 1 6 3" stroke="#F2B33D" strokeWidth="1.4" strokeLinecap="round" strokeOpacity="0.5" />
      <path d="M12.5 14c1-1.2 2.1-1.8 3.5-1.8s2.5.6 3.5 1.8" stroke="#F2B33D" strokeWidth="1.4" strokeLinecap="round" strokeOpacity="0.7" />
      <line x1="9" y1="7" x2="23" y2="19" stroke="#F2B33D" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconContent() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Document/content style */}
      <rect x="6" y="3" width="16" height="22" rx="2.5" stroke="#F2B33D" strokeWidth="1.8" />
      <path d="M22 9h2a2 2 0 012 2v16a2 2 0 01-2 2H12" stroke="#F2B33D" strokeWidth="1.4" strokeLinecap="round" strokeOpacity="0.5" />
      <path d="M10 9h8M10 13h6M10 17h7" stroke="#F2B33D" strokeWidth="1.4" strokeLinecap="round" strokeOpacity="0.7" />
    </svg>
  );
}

function IconAnalytics() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Bell/notification style */}
      <path d="M16 4c-4.4 0-8 3.6-8 8v5l-2 3h20l-2-3v-5c0-4.4-3.6-8-8-8z" stroke="#F2B33D" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M13 24c0 1.7 1.3 3 3 3s3-1.3 3-3" stroke="#F2B33D" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="22" cy="8" r="3.5" fill="#F2B33D" fillOpacity="0.3" stroke="#F2B33D" strokeWidth="1.2" />
    </svg>
  );
}

function IconIntegrations() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="5" stroke="#F2B33D" strokeWidth="1.8" />
      <path d="M16 3v3M16 26v3M3 16h3M26 16h3M7.1 7.1l2.1 2.1M22.8 22.8l2.1 2.1M7.1 24.9l2.1-2.1M22.8 9.2l2.1-2.1" stroke="#F2B33D" strokeWidth="1.8" strokeLinecap="round" />
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
   FIELD SALES ENABLEMENT SOLUTION PAGE
   ════════════════════════════════════════════════════════ */

export default function FieldSalesSolution() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  return (
    <>
      {/* ═══════════════════ 1. HERO ═══════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundSize: "200% 200%",
          animation: "bgShift 16s ease-in-out infinite",
          backgroundImage: "linear-gradient(135deg, #1A0A00 0%, #A86B00 55%, #F2B33D 100%)",
          minHeight: "560px",
        }}
      >
        <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMaxYMax slice" aria-hidden="true">
          <path d="M1440 900 L1440 270 L960 0 L480 0 L1008 360 L1008 900 Z" fill="white" fillOpacity="0.05" />
          <path d="M1440 900 L1440 468 L864 108 L384 108 L864 468 L864 900 Z" fill="white" fillOpacity="0.04" />
        </svg>

        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute w-[600px] h-[600px] rounded-full opacity-[0.07] blur-[120px]" style={{ background: "radial-gradient(circle, #F5D590, transparent 70%)", top: "10%", left: "60%", animation: "ambientFloat1 12s ease-in-out infinite" }} />
          <div className="absolute w-[500px] h-[500px] rounded-full opacity-[0.05] blur-[100px]" style={{ background: "radial-gradient(circle, #C48A00, transparent 70%)", bottom: "0%", left: "10%", animation: "ambientFloat2 15s ease-in-out infinite" }} />
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
              color: "#F5D590",
              letterSpacing: "0.14em",
              textTransform: "uppercase" as const,
              marginBottom: "16px",
            }}
          >
            Field Sales Enablement
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="leading-[1.08]"
            style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "clamp(36px, 5.5vw, 52px)", color: "#FFFFFF", letterSpacing: "-0.02em", maxWidth: "820px", marginBottom: "20px" }}
          >
            What happens in the field
            <br className="hidden sm:block" />
            {" "}should not stay in the field.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "clamp(16px, 2vw, 20px)", color: "rgba(255, 255, 255, 0.85)", letterSpacing: "-0.01em", maxWidth: "660px", marginBottom: "16px" }}
          >
            The engagement platform between the conversation and the CRM.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            style={{ fontFamily: "var(--font-inter)", fontWeight: 300, fontSize: "15px", color: "rgba(255, 255, 255, 0.55)", lineHeight: 1.5, maxWidth: "680px", marginBottom: "48px" }}
          >
            Capture what your reps learn in the field. Deliver the right content in the moment.
            <br className="hidden sm:block" />{" "}
            Follow up before they get back on the road.
          </motion.p>

          {/* CTA pair */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.30 }} className="flex flex-col sm:flex-row items-start gap-4" style={{ marginTop: "48px" }}>
            <a href="/rox/field-sales" className="inline-flex items-center justify-center font-semibold text-[14px] py-3.5 px-7 rounded-lg transition-all duration-200 hover:opacity-90 hover:scale-[1.02]" style={{ fontFamily: "var(--font-inter)", color: "#FFFFFF", background: "linear-gradient(135deg, rgba(242, 179, 61, 0.5), rgba(245, 213, 144, 0.4))", border: "1.5px solid rgba(245, 213, 144, 0.35)" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(245, 213, 144, 0.6)"; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(245, 213, 144, 0.35)"; }}>
              Calculate Your Field Sales ROX
            </a>
            <a href="#demo" className="inline-flex items-center justify-center font-semibold text-[14px] text-white py-3.5 px-7 rounded-lg transition-all duration-200 hover:bg-white/[0.08]" style={{ fontFamily: "var(--font-inter)", border: "1.5px solid rgba(255, 255, 255, 0.35)", background: "transparent" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.6)"; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.35)"; }}>
              Schedule a Demo
            </a>
          </motion.div>

          {/* Video walkthrough — mobile: inline before stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.36 }}
            className="lg:hidden cursor-pointer group"
            style={{ marginTop: "40px", maxWidth: "400px" }}
          >
            <div className="relative w-full" style={{ aspectRatio: "16 / 9", background: "rgba(6, 19, 65, 0.4)", border: "1px solid rgba(245, 213, 144, 0.15)", borderRadius: "16px", overflow: "hidden", backdropFilter: "blur(12px)" }}>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div className="flex items-center justify-center transition-transform duration-200 group-hover:scale-110" style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(255, 255, 255, 0.12)", border: "1.5px solid rgba(255, 255, 255, 0.20)" }}>
                  <svg width="20" height="24" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 2L22 14L4 26V2Z" fill="white" fillOpacity="0.9" /></svg>
                </div>
                <p style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "12px", color: "rgba(255, 255, 255, 0.60)", letterSpacing: "0.02em" }}>Field Sales Video Walk-Thru</p>
              </div>
            </div>
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

          {/* Desktop: absolutely positioned, centered with content area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.44 }}
            className="hidden lg:flex items-center absolute cursor-pointer group"
            style={{ top: "140px", bottom: "100px", right: "48px", width: "380px" }}
          >
            <div className="relative w-full" style={{ aspectRatio: "1 / 1", background: "rgba(6, 19, 65, 0.4)", border: "1px solid rgba(245, 213, 144, 0.15)", borderRadius: "16px", overflow: "hidden", backdropFilter: "blur(12px)" }}>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div className="flex items-center justify-center transition-transform duration-200 group-hover:scale-110" style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(255, 255, 255, 0.12)", border: "1.5px solid rgba(255, 255, 255, 0.20)" }}>
                  <svg width="24" height="28" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 2L22 14L4 26V2Z" fill="white" fillOpacity="0.9" /></svg>
                </div>
                <p style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "13px", color: "rgba(255, 255, 255, 0.60)", letterSpacing: "0.02em" }}>Field Sales Video Walk-Thru</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ 2. WHY MOMENTIFY + FEATURES ════════ */}
      {/* AMBER-BRACKET background from brand kit */}
      <section
        className="relative py-16 sm:py-24 overflow-hidden sm:mt-0"
        style={{ background: "linear-gradient(145deg, #FFF9E8 0%, #FFFCF0 100%)", marginTop: "-2px" }}
      >
        <AmberBracket />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
          {/* Two-column: copy left, iPad right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center" style={{ marginBottom: "64px" }}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={headerVariants}>
              <motion.p variants={fadeUp} className="uppercase font-semibold text-[12px] tracking-[0.14em] mb-4" style={{ color: "#A86B00", fontFamily: "var(--font-inter)" }}>
                Why Momentify for Field Sales
              </motion.p>
              <motion.h2 variants={fadeUp} className="leading-[1.1]" style={{ fontFamily: "var(--font-inter)", fontWeight: 500, letterSpacing: "-0.02em", fontSize: "clamp(28px, 4.5vw, 42px)", color: "#061341", marginBottom: "20px" }}>
                From job site to CRM, nothing gets lost.
              </motion.h2>
              <motion.p variants={fadeUp} style={{ fontFamily: "var(--font-inter)", fontWeight: 300, fontSize: "15px", color: "rgba(6, 19, 65, 0.6)", lineHeight: 1.5, maxWidth: "480px", marginBottom: "28px" }}>
                Momentify works alongside your existing CRM and content tools to capture what they miss: conversation context, content engagement, and real-time follow-up triggers from the field.
              </motion.p>
              <motion.ul variants={fadeUp} className="space-y-3">
                {[
                  "Capture every field interaction with role, interest, and context",
                  "Deliver the right content to the right person at the point of need",
                  "Track what reps share and what prospects actually engage with",
                  "Export field insights directly into your CRM and pipeline tools",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-[7px] h-[6px] w-[6px] rounded-full flex-shrink-0" style={{ backgroundColor: "#F2B33D" }} />
                    <span className="text-[14px] leading-[1.6]" style={{ fontFamily: "var(--font-inter)", fontWeight: 400, color: "rgba(6, 19, 65, 0.6)" }}>{item}</span>
                  </li>
                ))}
              </motion.ul>
            </motion.div>

            {/* iPad image */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="flex items-center justify-center">
              <div className="relative w-full" style={{ maxWidth: "520px" }}>
                <Image src="/TradeShowsiPad.png" alt="Momentify running on iPad in the field" width={1200} height={900} className="w-full h-auto" />
              </div>
            </motion.div>
          </div>

          {/* Feature grid */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {keyFeatures.map((feature) => {
              const Icon = featureIconMap[feature.icon];
              return (
                <motion.div key={feature.headline} variants={fadeUp} className="transition-all duration-200 hover:-translate-y-1" style={{ background: "rgba(255, 255, 255, 0.85)", backdropFilter: "blur(8px)", border: "1px solid rgba(168, 107, 0, 0.1)", borderRadius: "16px", padding: "32px 28px" }}>
                  <div className="flex items-center gap-3" style={{ marginBottom: "16px" }}>
                    <Icon />
                    <h3 style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "17px", color: "#061341" }}>{feature.headline}</h3>
                  </div>
                  <ul className="space-y-2">
                    {feature.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2.5">
                        <span className="mt-[7px] h-[5px] w-[5px] rounded-full flex-shrink-0" style={{ backgroundColor: "#F2B33D" }} />
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
      {/* AMBER-CROSSES background from brand kit */}
      <section
        id="rox"
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1A0A00 0%, #A86B00 55%, #F2B33D 100%)", padding: "100px 0" }}
      >
        <AmberCrosses />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
          {/* ROX header */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={headerVariants} style={{ textAlign: "center", marginBottom: "48px" }}>
            <motion.p variants={fadeUp} className="uppercase font-semibold text-[12px] tracking-[0.14em] mb-4" style={{ color: "rgba(255, 255, 255, 0.6)", fontFamily: "var(--font-inter)" }}>
              Field Sales Enablement
              <br className="sm:hidden" />{" "}
              Return on Experience (ROX)&#8482;
            </motion.p>
            <motion.h2 variants={fadeUp} className="leading-[1.1] mx-auto" style={{ fontFamily: "var(--font-inter)", fontWeight: 500, letterSpacing: "-0.02em", fontSize: "clamp(31px, 5vw, 46px)", color: "#FFFFFF", maxWidth: "770px" }}>
              Do you know your
              <br />
              <span style={{ background: "linear-gradient(135deg, #F5D590, #F2B33D)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                field sales ROX score?
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
              style={{ background: "rgba(6, 19, 65, 0.5)", border: "1px solid rgba(245, 213, 144, 0.15)", borderRadius: "16px", padding: "40px 36px", textAlign: "center" }}
            >
              <svg width="320" height="175" viewBox="-20 -2 220 120" style={{ margin: "0 auto 16px" }}>
                {/* Background arc */}
                <path d="M 20 100 A 70 70 0 0 1 160 100" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="16" strokeLinecap="round" />
                {/* Zone 2: Needs Optimization (70.2deg to 124.2deg) */}
                <path d="M 66.3 34.1 A 70 70 0 0 1 129.3 42.1" fill="none" stroke="#F2B33D" strokeWidth="8" />
                {/* Zone 3: High ROX (124.2deg to 151.2deg) */}
                <path d="M 129.3 42.1 A 70 70 0 0 1 151.3 66.3" fill="none" stroke="#5FD9C2" strokeWidth="8" />
                {/* Zone 4: Elite ROX (151.2deg to 180deg) */}
                <path d="M 151.3 66.3 A 70 70 0 0 1 160 100" fill="none" stroke="#0CF4DF" strokeWidth="8" strokeLinecap="round" />
                {/* Zone 1: Critical Gap (0deg to 70.2deg) — drawn last so red is top layer */}
                <path d="M 20 100 A 70 70 0 0 1 66.3 34.1" fill="none" stroke="#E5484D" strokeWidth="16" strokeLinecap="round" />
                {/* Score */}
                <text x="90" y="106" textAnchor="middle" fill="#FFFFFF" fontFamily="var(--font-inter)" fontWeight="600" fontSize="40">36</text>
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
                  style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(245, 213, 144, 0.12)", borderRadius: "12px", padding: "26px 22px", backdropFilter: "blur(8px)" }}
                >
                  <p style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "14px", color: "#F5D590", marginBottom: "6px" }}>{cat.label}</p>
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
            <a href="/rox/field-sales" className="inline-flex items-center justify-center font-semibold text-[14px] py-3.5 px-7 rounded-lg transition-all duration-200 hover:opacity-90 hover:scale-[1.02]" style={{ fontFamily: "var(--font-inter)", color: "#FFFFFF", background: "linear-gradient(135deg, rgba(242, 179, 61, 0.6), rgba(245, 213, 144, 0.5))", border: "1.5px solid rgba(245, 213, 144, 0.35)" }}>
              Calculate Your Field Sales ROX
            </a>
            <p className="mt-3" style={{ fontFamily: "var(--font-inter)", fontWeight: 300, fontSize: "13px", color: "rgba(255, 255, 255, 0.40)" }}>
              Run your numbers in under two minutes. No login required.
            </p>
          </motion.div>

          {/* How It Works */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={headerVariants} style={{ marginBottom: "16px" }}>
            <motion.p variants={fadeUp} className="uppercase font-semibold text-[12px] tracking-[0.14em] mb-4" style={{ color: "rgba(255, 255, 255, 0.6)", fontFamily: "var(--font-inter)" }}>
              Built for Field Teams on the Road
            </motion.p>
            <motion.h2 variants={fadeUp} className="leading-[1.1]" style={{ fontFamily: "var(--font-inter)", fontWeight: 500, letterSpacing: "-0.02em", fontSize: "clamp(24px, 3.5vw, 36px)", color: "#FFFFFF", maxWidth: "500px", marginBottom: "40px" }}>
              Plug in.{" "}
              <span style={{ background: "linear-gradient(135deg, #F5D590, #FFFFFF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Power up.
              </span>
              {" "}Perform.
            </motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.map((step) => (
              <motion.div key={step.step} variants={fadeUp} className="transition-all duration-200 hover:-translate-y-1" style={{ background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(245, 213, 144, 0.12)", borderRadius: "16px", padding: "32px 24px", backdropFilter: "blur(8px)" }}>
                <p style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "32px", color: "rgba(245, 213, 144, 0.3)", lineHeight: 1, marginBottom: "16px" }}>{step.step}</p>
                <h3 style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "17px", color: "#FFFFFF", marginBottom: "10px" }}>{step.headline}</h3>
                <p style={{ fontFamily: "var(--font-inter)", fontWeight: 400, fontSize: "12px", color: "rgba(255, 255, 255, 0.55)", lineHeight: 1.6 }}>{step.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ 4. SOCIAL PROOF ══════ */}
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
              background: "linear-gradient(145deg, #FFF9E8 0%, #FFF3CC 100%)",
              border: "1px solid rgba(168, 107, 0, 0.1)",
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
                <p style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "12px", color: "#C48A00" }}>
                  {testimonials[activeTestimonial].role}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  onClick={() => setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                  className="transition-all duration-200 cursor-pointer hover:bg-[rgba(168,107,0,0.08)] rounded-full"
                  style={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(168, 107, 0, 0.2)", background: "transparent", padding: 0 }}
                  aria-label="Previous testimonial"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C48A00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                </button>
                <div className="flex items-center gap-2">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveTestimonial(i)}
                      className="transition-all duration-200 cursor-pointer"
                      style={{ width: i === activeTestimonial ? "20px" : "8px", height: "8px", borderRadius: "4px", background: i === activeTestimonial ? "#C48A00" : "rgba(168, 107, 0, 0.2)", border: "none", padding: 0 }}
                      aria-label={`View testimonial ${i + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length)}
                  className="transition-all duration-200 cursor-pointer hover:bg-[rgba(168,107,0,0.08)] rounded-full"
                  style={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(168, 107, 0, 0.2)", background: "transparent", padding: 0 }}
                  aria-label="Next testimonial"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C48A00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Case Study */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={headerVariants}>
            <motion.p variants={fadeUp} className="uppercase font-semibold text-[12px] tracking-[0.14em] mb-4" style={{ color: "#A86B00", fontFamily: "var(--font-inter)" }}>In the Field</motion.p>
            <motion.h2 variants={fadeUp} className="leading-[1.1]" style={{ fontFamily: "var(--font-inter)", fontWeight: 500, letterSpacing: "-0.02em", fontSize: "clamp(28px, 4.5vw, 42px)", color: "#061341", maxWidth: "700px", marginBottom: "40px" }}>
              Case study coming soon.
            </motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={fadeUp} style={{ background: "#F8F9FC", border: "1px solid rgba(6, 19, 65, 0.08)", borderRadius: "20px", padding: "48px" }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              <div>
                <div style={{ height: "32px", marginBottom: "20px", display: "flex", alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "14px", color: "rgba(6, 19, 65, 0.25)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Partner Logo</span>
                </div>
                <h3 style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "22px", color: "#061341", marginBottom: "16px" }}>Field Sales Case Study</h3>
                <ul className="space-y-2" style={{ marginBottom: "24px" }}>
                  {[
                    "Deployed Momentify across a distributed field sales team",
                    "Captured structured engagement data from every job site visit",
                    "Connected field conversations to pipeline progression in real time",
                    "Reduced follow-up time from days to hours",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="mt-[7px] h-[5px] w-[5px] rounded-full flex-shrink-0" style={{ backgroundColor: "#F2B33D" }} />
                      <span className="text-[14px] leading-[1.6]" style={{ fontFamily: "var(--font-inter)", fontWeight: 400, color: "rgba(6, 19, 65, 0.55)" }}>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2" style={{ marginBottom: "24px" }}>
                  {["Field Sales", "Sales Enablement"].map((tag) => (
                    <span key={tag} style={{ display: "inline-block", fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "11px", color: "#C48A00", background: "rgba(196, 138, 0, 0.08)", borderRadius: "20px", padding: "4px 12px" }}>{tag}</span>
                  ))}
                </div>
                <span className="inline-flex items-center justify-center font-semibold text-[14px] py-3 px-6 rounded-lg" style={{ fontFamily: "var(--font-inter)", color: "#FFFFFF", background: "linear-gradient(135deg, #C48A00, #F2B33D)", border: "1.5px solid rgba(196, 138, 0, 0.4)", opacity: 0.5, cursor: "not-allowed" }}>
                  Coming Soon
                </span>
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
          backgroundImage: "linear-gradient(135deg, #1A0A00 0%, #A86B00 55%, #F2B33D 100%)",
          padding: "96px 0",
        }}
      >
        <AmberBracketDark />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={headerVariants} style={{ maxWidth: "640px" }}>
              <motion.p variants={fadeUp} className="uppercase font-semibold text-[12px] tracking-[0.14em] mb-4" style={{ color: "rgba(255, 255, 255, 0.6)", fontFamily: "var(--font-inter)" }}>Get Started</motion.p>
              <motion.h2 variants={fadeUp} className="leading-[1.08]" style={{ fontFamily: "var(--font-inter)", fontWeight: 500, letterSpacing: "-0.02em", fontSize: "clamp(32px, 4.5vw, 44px)", color: "#FFFFFF", marginBottom: "20px" }}>
                Make every field visit measurable.
              </motion.h2>
              <motion.p variants={fadeUp} className="max-w-[560px]" style={{ fontFamily: "var(--font-inter)", fontWeight: 300, fontSize: "15px", color: "rgba(255, 255, 255, 0.60)", lineHeight: 1.5, marginBottom: "40px" }}>
                Discover how Momentify turns event chaos into clarity, with better tools, better data, and better outcomes.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-start gap-4">
                <a href="/rox/field-sales" className="inline-flex items-center justify-center font-semibold text-[14px] py-3.5 px-7 rounded-lg transition-all duration-200 hover:opacity-90 hover:scale-[1.02]" style={{ fontFamily: "var(--font-inter)", color: "#FFFFFF", background: "linear-gradient(135deg, rgba(242, 179, 61, 0.5), rgba(245, 213, 144, 0.4))", border: "1.5px solid rgba(245, 213, 144, 0.35)" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(245, 213, 144, 0.6)"; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(245, 213, 144, 0.35)"; }}>
                  Calculate Your Field Sales ROX
                </a>
                <a href="#demo" className="inline-flex items-center justify-center font-semibold text-[14px] text-white py-3.5 px-7 rounded-lg transition-all duration-200 hover:bg-white/[0.08]" style={{ fontFamily: "var(--font-inter)", border: "1.5px solid rgba(255, 255, 255, 0.35)", background: "transparent" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.6)"; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.35)"; }}>
                  Schedule a Demo
                </a>
              </motion.div>
            </motion.div>

            {/* Placeholder graphic */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="hidden lg:flex items-center justify-center"
            >
              <div
                style={{
                  width: "100%",
                  maxWidth: "340px",
                  aspectRatio: "1 / 1",
                  borderRadius: "20px",
                  background: "rgba(255, 255, 255, 0.06)",
                  border: "1.5px solid rgba(255, 255, 255, 0.12)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "16px",
                }}
              >
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(245,213,144,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <p style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "13px", color: "rgba(255, 255, 255, 0.35)" }}>
                  Graphic or Screenshot
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
