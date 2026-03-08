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
 * INDIGO-BRACKET — light indigo bg with L-shaped corner brackets
 */
function IndigoBracket() {
  return (
    <>
      {/* Top color bar — hidden on mobile */}
      <div
        className="absolute top-0 left-0 right-0 z-[1] hidden sm:block"
        style={{ height: "3px", background: "linear-gradient(90deg, #5B4499, #3A2073)" }}
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
        <path d="M 1224 900 L 1224 810 L 1440 810" stroke="#5B4499" strokeOpacity="0.15" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M 1032 900 L 1032 684 L 1440 684" stroke="#5B4499" strokeOpacity="0.1" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        <path d="M 816 900 L 816 531 L 1440 531" stroke="#5B4499" strokeOpacity="0.06" strokeWidth="0.8" fill="none" strokeLinecap="round" />
        <path d="M 1152 0 L 1152 80 L 1440 80" stroke="#5B4499" strokeOpacity="0.09" strokeWidth="1" fill="none" strokeLinecap="round" />
      </svg>
    </>
  );
}

/**
 * INDIGO-BRACKETS — dark indigo bg with scattered bracket pattern
 */
function IndigoBrackets() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 w-full h-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern id="brackets-indigo" patternUnits="userSpaceOnUse" width="200" height="200">
          <path d="M20 10 L10 10 L10 30" stroke="white" strokeOpacity="0.08" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
          <path d="M180 170 L190 170 L190 150" stroke="white" strokeOpacity="0.06" strokeWidth="1" fill="none" strokeLinecap="round"/>
          <path d="M120 70 L110 70 L110 85" stroke="white" strokeOpacity="0.05" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#brackets-indigo)" />
    </svg>
  );
}

/** Dark bracket variant for Final CTA */
function IndigoBracketDark() {
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
  { number: "$2.4M", label: "Average annual cost of a corporate experience center" },
  { number: "70%", label: "Of enterprise buyers visit a facility before a major purchase" },
  { number: "< 10%", label: "Of facility visits generate structured engagement data" },
];

/* ── Key features ─────────────────────────────────────── */

const keyFeatures = [
  {
    headline: "Zone-Level Engagement Tracking",
    bullets: [
      "Map engagement across every station, room, and touchpoint",
      "See where visitors spend the most time and what draws attention",
      "Dwell data and interaction scores for every zone in your space",
    ],
    icon: "zones",
  },
  {
    headline: "Guided Visitor Journeys",
    bullets: [
      "Tailor each tour to the visitor's role, industry, and interests",
      "Guides follow structured playbooks that adapt in real time",
      "Every visit tells a consistent, measurable story",
    ],
    icon: "journeys",
  },
  {
    headline: "Real-Time CRM Sync",
    bullets: [
      "Visitor data flows to your CRM before the tour ends",
      "Priority scoring based on engagement depth and buying signals",
      "Full conversation context attached to every contact record",
    ],
    icon: "sync",
  },
  {
    headline: "Content Performance Analytics",
    bullets: [
      "Track which demos, videos, and displays drive engagement",
      "Compare content performance across visitor segments",
      "Optimize your facility layout based on real interaction data",
    ],
    icon: "analytics",
  },
];

/* ── ROX categories ───────────────────────────────────── */

const roxCategories = [
  { label: "Visitor Capture Rate", value: "~20%", description: "Most facilities count visitors but don't capture engagement" },
  { label: "Engagement Quality", value: "Low", description: "No data on which zones or content drive real interest" },
  { label: "Follow-Up Speed", value: "3+ days", description: "Tour notes sit in notebooks until someone types them up" },
  { label: "Pipeline Attribution", value: "Unknown", description: "No way to connect facility visits to closed deals" },
];

/* ── How It Works ─────────────────────────────────────── */

const workflowSteps = [
  { step: "01", headline: "Create Moments", body: "Map your facility zones, load content for each station, configure capture templates, and set follow-up rules for every visitor type." },
  { step: "02", headline: "Engage", body: "Guides capture visitor interactions, deliver targeted content, and log engagement data at every touchpoint throughout the tour." },
  { step: "03", headline: "Sync Insights", body: "Engagement data flows to your CRM automatically with full context, zone-level detail, and next-step recommendations." },
  { step: "04", headline: "View Insights", body: "See which zones, content, and guides drive the most pipeline. Optimize your facility based on what actually works." },
];

/* ── Testimonials ─────────────────────────────────────── */

const testimonials = [
  { quote: "We built a $3M experience center and had no way to prove it was working. Momentify gave us the data to show the board exactly what those visits produce.", role: "VP of Corporate Marketing" },
  { quote: "Every tour used to depend on who was giving it. Now our guides follow structured playbooks and we capture consistent data from every single visit.", role: "Director of Experience Centers" },
  { quote: "We used to lose visitor context the moment they walked out the door. Now our sales team gets a full engagement profile before the visitor reaches the parking lot.", role: "Head of Sales Operations" },
];

/* ── Case study stats (placeholder) ───────────────────── */

const caseStudyStats = [
  { number: "TBD", label: "Visitor engagement improvement" },
  { number: "TBD", label: "Tours with structured data capture" },
  { number: "TBD", label: "Follow-ups routed automatically" },
];

/* ── Icon components ──────────────────────────────────── */

function IconZones() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Map/grid icon */}
      <rect x="4" y="4" width="10" height="10" rx="2" stroke="#5B4499" strokeWidth="1.8" />
      <rect x="18" y="4" width="10" height="10" rx="2" stroke="#5B4499" strokeWidth="1.8" />
      <rect x="4" y="18" width="10" height="10" rx="2" stroke="#5B4499" strokeWidth="1.8" />
      <rect x="18" y="18" width="10" height="10" rx="2" stroke="#5B4499" strokeWidth="1.8" />
      <circle cx="9" cy="9" r="1.5" fill="#5B4499" fillOpacity="0.5" />
      <circle cx="23" cy="23" r="1.5" fill="#5B4499" fillOpacity="0.5" />
    </svg>
  );
}

function IconJourneys() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Route/path icon */}
      <circle cx="8" cy="8" r="3" stroke="#5B4499" strokeWidth="1.8" />
      <circle cx="24" cy="24" r="3" stroke="#5B4499" strokeWidth="1.8" />
      <path d="M8 11v4c0 4 4 4 8 4h1" stroke="#5B4499" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M21 19l3 3-3 3" stroke="#5B4499" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.7" />
    </svg>
  );
}

function IconSync() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Sync/arrows icon */}
      <path d="M24 12a8 8 0 00-14.4-3.2" stroke="#5B4499" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8 20a8 8 0 0014.4 3.2" stroke="#5B4499" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M6 8.8l3.6 0 0 3.6" stroke="#5B4499" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.7" />
      <path d="M26 23.2l-3.6 0 0-3.6" stroke="#5B4499" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.7" />
    </svg>
  );
}

function IconAnalytics() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Chart icon */}
      <rect x="4" y="18" width="5" height="10" rx="1.5" stroke="#5B4499" strokeWidth="1.8" />
      <rect x="13.5" y="12" width="5" height="16" rx="1.5" stroke="#5B4499" strokeWidth="1.8" />
      <rect x="23" y="4" width="5" height="24" rx="1.5" stroke="#5B4499" strokeWidth="1.8" />
      <line x1="4" y1="30" x2="28" y2="30" stroke="#5B4499" strokeWidth="1.4" strokeOpacity="0.4" strokeLinecap="round" />
    </svg>
  );
}

const featureIconMap: Record<string, () => React.ReactNode> = {
  zones: IconZones,
  journeys: IconJourneys,
  sync: IconSync,
  analytics: IconAnalytics,
};

/* ════════════════════════════════════════════════════════
   FACILITIES SOLUTION PAGE
   ════════════════════════════════════════════════════════ */

export default function FacilitiesSolution() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  return (
    <>
      {/* ═══════════════════ 1. HERO ═══════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundSize: "200% 200%",
          animation: "bgShift 16s ease-in-out infinite",
          backgroundImage: "linear-gradient(135deg, #0D0820 0%, #3A2073 55%, #5B4499 100%)",
          minHeight: "560px",
        }}
      >
        <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMaxYMax slice" aria-hidden="true">
          <path d="M1440 900 L1440 270 L960 0 L480 0 L1008 360 L1008 900 Z" fill="white" fillOpacity="0.05" />
          <path d="M1440 900 L1440 468 L864 108 L384 108 L864 468 L864 900 Z" fill="white" fillOpacity="0.04" />
        </svg>

        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute w-[600px] h-[600px] rounded-full opacity-[0.07] blur-[120px]" style={{ background: "radial-gradient(circle, #B8A0D8, transparent 70%)", top: "10%", left: "60%", animation: "ambientFloat1 12s ease-in-out infinite" }} />
          <div className="absolute w-[500px] h-[500px] rounded-full opacity-[0.05] blur-[100px]" style={{ background: "radial-gradient(circle, #6B3FA0, transparent 70%)", bottom: "0%", left: "10%", animation: "ambientFloat2 15s ease-in-out infinite" }} />
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
              color: "#B8A0D8",
              letterSpacing: "0.14em",
              textTransform: "uppercase" as const,
              marginBottom: "16px",
            }}
          >
            Facilities
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="leading-[1.08]"
            style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "clamp(36px, 5.5vw, 52px)", color: "#FFFFFF", letterSpacing: "-0.02em", maxWidth: "820px", marginBottom: "20px" }}
          >
            Your showroom is always on.
            <br className="hidden sm:block" />
            {" "}Your data should be too.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "clamp(16px, 2vw, 20px)", color: "rgba(255, 255, 255, 0.85)", letterSpacing: "-0.01em", maxWidth: "660px", marginBottom: "16px" }}
          >
            The engagement platform that turns facility visits into structured pipeline data.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            style={{ fontFamily: "var(--font-inter)", fontWeight: 300, fontSize: "15px", color: "rgba(255, 255, 255, 0.55)", lineHeight: 1.5, maxWidth: "680px", marginBottom: "48px" }}
          >
            Capture what happens across every zone. Track which content resonates, which questions come up, and which visits are worth the follow-up.
          </motion.p>

          {/* CTA pair */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.30 }} className="flex flex-col sm:flex-row items-start gap-4" style={{ marginTop: "48px" }}>
            <a href="/rox/facilities" className="flex-1 sm:flex-initial inline-flex items-center justify-center font-semibold text-[14px] py-3.5 px-7 rounded-lg transition-all duration-200 hover:opacity-90 hover:scale-[1.02]" style={{ fontFamily: "var(--font-inter)", color: "#FFFFFF", background: "linear-gradient(135deg, rgba(107, 63, 160, 0.5), rgba(184, 160, 216, 0.4))", border: "1.5px solid rgba(184, 160, 216, 0.35)" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(184, 160, 216, 0.6)"; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(184, 160, 216, 0.35)"; }}>
              Calculate Your Facilities ROX
            </a>
            <a href="#demo" className="flex-1 sm:flex-initial inline-flex items-center justify-center font-semibold text-[14px] text-white py-3.5 px-7 rounded-lg transition-all duration-200 hover:bg-white/[0.08]" style={{ fontFamily: "var(--font-inter)", border: "1.5px solid rgba(255, 255, 255, 0.35)", background: "transparent" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.6)"; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.35)"; }}>
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
            <div className="relative w-full" style={{ aspectRatio: "16 / 9", background: "rgba(6, 19, 65, 0.4)", border: "1px solid rgba(184, 160, 216, 0.15)", borderRadius: "16px", overflow: "hidden", backdropFilter: "blur(12px)" }}>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div className="flex items-center justify-center transition-transform duration-200 group-hover:scale-110" style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(255, 255, 255, 0.12)", border: "1.5px solid rgba(255, 255, 255, 0.20)" }}>
                  <svg width="20" height="24" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 2L22 14L4 26V2Z" fill="white" fillOpacity="0.9" /></svg>
                </div>
                <p style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "12px", color: "rgba(255, 255, 255, 0.60)", letterSpacing: "0.02em" }}>Facilities Video Walk-Thru</p>
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
            <div className="relative w-full" style={{ aspectRatio: "1 / 1", background: "rgba(6, 19, 65, 0.4)", border: "1px solid rgba(184, 160, 216, 0.15)", borderRadius: "16px", overflow: "hidden", backdropFilter: "blur(12px)" }}>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div className="flex items-center justify-center transition-transform duration-200 group-hover:scale-110" style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(255, 255, 255, 0.12)", border: "1.5px solid rgba(255, 255, 255, 0.20)" }}>
                  <svg width="24" height="28" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 2L22 14L4 26V2Z" fill="white" fillOpacity="0.9" /></svg>
                </div>
                <p style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "13px", color: "rgba(255, 255, 255, 0.60)", letterSpacing: "0.02em" }}>Facilities Video Walk-Thru</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ 2. WHY MOMENTIFY + FEATURES ════════ */}
      {/* INDIGO-BRACKET background from brand kit */}
      <section
        className="relative py-16 sm:py-24 overflow-hidden sm:mt-0"
        style={{ background: "linear-gradient(145deg, #EEF0FF 0%, #F4F5FF 100%)", marginTop: "-2px" }}
      >
        <IndigoBracket />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
          {/* Two-column: copy left, iPad right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center" style={{ marginBottom: "64px" }}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={headerVariants}>
              <motion.p variants={fadeUp} className="uppercase font-semibold text-[12px] tracking-[0.14em] mb-4" style={{ color: "#5B4499", fontFamily: "var(--font-inter)" }}>
                Why Momentify for Facilities
              </motion.p>
              <motion.h2 variants={fadeUp} className="leading-[1.1]" style={{ fontFamily: "var(--font-inter)", fontWeight: 500, letterSpacing: "-0.02em", fontSize: "clamp(28px, 4.5vw, 42px)", color: "#061341", marginBottom: "20px" }}>
                Every visit tells a story.<br className="hidden sm:block" />{" "}Start capturing it.
              </motion.h2>
              <motion.p variants={fadeUp} style={{ fontFamily: "var(--font-inter)", fontWeight: 300, fontSize: "15px", color: "rgba(6, 19, 65, 0.6)", lineHeight: 1.5, maxWidth: "480px", marginBottom: "28px" }}>
                Momentify works alongside your existing CRM and content tools to capture what they miss: zone-level engagement, content interaction, and real-time visitor intelligence from your facility floor.
              </motion.p>
              <motion.ul variants={fadeUp} className="space-y-3">
                {[
                  "Capture every visitor interaction with role, interest, and engagement depth",
                  "Deliver the right content at every station based on visitor profile",
                  "Track which zones and demos drive the deepest engagement",
                  "Export visitor insights directly into your CRM and pipeline tools",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-[7px] h-[6px] w-[6px] rounded-full flex-shrink-0" style={{ backgroundColor: "#9B5FE8" }} />
                    <span className="text-[14px] leading-[1.6]" style={{ fontFamily: "var(--font-inter)", fontWeight: 400, color: "rgba(6, 19, 65, 0.6)" }}>{item}</span>
                  </li>
                ))}
              </motion.ul>
            </motion.div>

            {/* iPad image */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="flex items-center justify-center">
              <div className="relative w-full" style={{ maxWidth: "520px" }}>
                <Image src="/TradeShowsiPad.png" alt="Momentify running on iPad in a facility" width={1200} height={900} className="w-full h-auto" />
              </div>
            </motion.div>
          </div>

          {/* Feature grid */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {keyFeatures.map((feature) => {
              const Icon = featureIconMap[feature.icon];
              return (
                <motion.div key={feature.headline} variants={fadeUp} className="transition-all duration-200 hover:-translate-y-1" style={{ background: "rgba(255, 255, 255, 0.85)", backdropFilter: "blur(8px)", border: "1px solid rgba(91, 68, 153, 0.1)", borderRadius: "16px", padding: "32px 28px" }}>
                  <div className="flex items-center gap-3" style={{ marginBottom: "16px" }}>
                    <Icon />
                    <h3 style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "17px", color: "#061341" }}>{feature.headline}</h3>
                  </div>
                  <ul className="space-y-2">
                    {feature.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2.5">
                        <span className="mt-[7px] h-[5px] w-[5px] rounded-full flex-shrink-0" style={{ backgroundColor: "#9B5FE8" }} />
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
      {/* INDIGO-BRACKETS background from brand kit */}
      <section
        id="rox"
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0D0820 0%, #3A2073 55%, #5B4499 100%)", padding: "100px 0" }}
      >
        <IndigoBrackets />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
          {/* ROX header */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={headerVariants} style={{ textAlign: "center", marginBottom: "48px" }}>
            <motion.p variants={fadeUp} className="uppercase font-semibold text-[12px] tracking-[0.14em] mb-4" style={{ color: "rgba(255, 255, 255, 0.6)", fontFamily: "var(--font-inter)" }}>
              Facilities
              <br className="sm:hidden" />{" "}
              Return on Experience (ROX)&#8482;
            </motion.p>
            <motion.h2 variants={fadeUp} className="leading-[1.1] mx-auto" style={{ fontFamily: "var(--font-inter)", fontWeight: 500, letterSpacing: "-0.02em", fontSize: "clamp(32px, 3.5vw, 46px)", color: "#FFFFFF", maxWidth: "770px" }}>
              Do you know your
              <br />
              <span style={{ background: "linear-gradient(135deg, #B8A0D8, #5B4499)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                facility ROX score?
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
              style={{ background: "rgba(6, 19, 65, 0.5)", border: "1px solid rgba(184, 160, 216, 0.15)", borderRadius: "16px", padding: "40px 36px", textAlign: "center" }}
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
                  style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(184, 160, 216, 0.12)", borderRadius: "12px", padding: "26px 22px", backdropFilter: "blur(8px)" }}
                >
                  <p style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "14px", color: "#B8A0D8", marginBottom: "6px" }}>{cat.label}</p>
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
            <a href="/rox/facilities" className="inline-flex items-center justify-center font-semibold text-[14px] py-3.5 px-7 rounded-lg transition-all duration-200 hover:opacity-90 hover:scale-[1.02]" style={{ fontFamily: "var(--font-inter)", color: "#FFFFFF", background: "linear-gradient(135deg, rgba(107, 63, 160, 0.6), rgba(184, 160, 216, 0.5))", border: "1.5px solid rgba(184, 160, 216, 0.35)" }}>
              Calculate Your Facilities ROX
            </a>
            <p className="mt-3" style={{ fontFamily: "var(--font-inter)", fontWeight: 300, fontSize: "13px", color: "rgba(255, 255, 255, 0.40)" }}>
              Run your numbers in under two minutes. No login required.
            </p>
          </motion.div>

          {/* How It Works */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={headerVariants} style={{ marginBottom: "16px" }}>
            <motion.p variants={fadeUp} className="uppercase font-semibold text-[12px] tracking-[0.14em] mb-4" style={{ color: "rgba(255, 255, 255, 0.6)", fontFamily: "var(--font-inter)" }}>
              Built for Facility Teams on the Floor
            </motion.p>
            <motion.h2 variants={fadeUp} className="leading-[1.1]" style={{ fontFamily: "var(--font-inter)", fontWeight: 500, letterSpacing: "-0.02em", fontSize: "clamp(24px, 3.5vw, 36px)", color: "#FFFFFF", maxWidth: "500px", marginBottom: "40px" }}>
              Plug in.{" "}
              <span style={{ background: "linear-gradient(135deg, #B8A0D8, #5B4499)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Power up.
              </span>
              {" "}Perform.
            </motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.map((step) => (
              <motion.div key={step.step} variants={fadeUp} className="transition-all duration-200 hover:-translate-y-1" style={{ background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(184, 160, 216, 0.12)", borderRadius: "16px", padding: "32px 24px", backdropFilter: "blur(8px)" }}>
                <p style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "32px", color: "rgba(184, 160, 216, 0.3)", lineHeight: 1, marginBottom: "16px" }}>{step.step}</p>
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
              background: "linear-gradient(145deg, #EEF0FF 0%, #E4E0F8 100%)",
              border: "1px solid rgba(91, 68, 153, 0.1)",
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
                <p style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "12px", color: "#6B3FA0" }}>
                  {testimonials[activeTestimonial].role}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  onClick={() => setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                  className="transition-all duration-200 cursor-pointer hover:bg-[rgba(107,63,160,0.08)] rounded-full"
                  style={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(107, 63, 160, 0.2)", background: "transparent", padding: 0 }}
                  aria-label="Previous testimonial"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B3FA0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                </button>
                <div className="flex items-center gap-2">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveTestimonial(i)}
                      className="transition-all duration-200 cursor-pointer"
                      style={{ width: i === activeTestimonial ? "20px" : "8px", height: "8px", borderRadius: "4px", background: i === activeTestimonial ? "#6B3FA0" : "rgba(107, 63, 160, 0.2)", border: "none", padding: 0 }}
                      aria-label={`View testimonial ${i + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length)}
                  className="transition-all duration-200 cursor-pointer hover:bg-[rgba(107,63,160,0.08)] rounded-full"
                  style={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(107, 63, 160, 0.2)", background: "transparent", padding: 0 }}
                  aria-label="Next testimonial"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B3FA0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Case Study */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={headerVariants}>
            <motion.p variants={fadeUp} className="uppercase font-semibold text-[12px] tracking-[0.14em] mb-4" style={{ color: "#5B4499", fontFamily: "var(--font-inter)" }}>In the Field</motion.p>
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
                <h3 style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "22px", color: "#061341", marginBottom: "16px" }}>Facilities Case Study</h3>
                <ul className="space-y-2" style={{ marginBottom: "24px" }}>
                  {[
                    "Deployed Momentify across a multi-zone experience center",
                    "Captured structured engagement data from every visitor touchpoint",
                    "Connected facility visits to pipeline progression for the first time",
                    "Reduced follow-up time from days to hours",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="mt-[7px] h-[5px] w-[5px] rounded-full flex-shrink-0" style={{ backgroundColor: "#9B5FE8" }} />
                      <span className="text-[14px] leading-[1.6]" style={{ fontFamily: "var(--font-inter)", fontWeight: 400, color: "rgba(6, 19, 65, 0.55)" }}>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2" style={{ marginBottom: "24px" }}>
                  {["Facilities", "Experience Center"].map((tag) => (
                    <span key={tag} style={{ display: "inline-block", fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "11px", color: "#6B3FA0", background: "rgba(107, 63, 160, 0.08)", borderRadius: "20px", padding: "4px 12px" }}>{tag}</span>
                  ))}
                </div>
                <span className="inline-flex items-center justify-center font-semibold text-[14px] py-3 px-6 rounded-lg" style={{ fontFamily: "var(--font-inter)", color: "#FFFFFF", background: "linear-gradient(135deg, #6B3FA0, #5B4499)", border: "1.5px solid rgba(107, 63, 160, 0.4)", opacity: 0.5, cursor: "not-allowed" }}>
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
          backgroundImage: "linear-gradient(135deg, #0D0820 0%, #3A2073 55%, #5B4499 100%)",
          padding: "96px 0",
        }}
      >
        <IndigoBracketDark />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={headerVariants} style={{ maxWidth: "640px" }}>
              <motion.p variants={fadeUp} className="uppercase font-semibold text-[12px] tracking-[0.14em] mb-4" style={{ color: "#B8A0D8", fontFamily: "var(--font-inter)" }}>Get Started</motion.p>
              <motion.h2 variants={fadeUp} className="leading-[1.08]" style={{ fontFamily: "var(--font-inter)", fontWeight: 500, letterSpacing: "-0.02em", fontSize: "clamp(32px, 4.5vw, 44px)", color: "#FFFFFF", marginBottom: "20px" }}>
                Make every facility visit count.
              </motion.h2>
              <motion.p variants={fadeUp} className="max-w-[560px]" style={{ fontFamily: "var(--font-inter)", fontWeight: 300, fontSize: "15px", color: "rgba(255, 255, 255, 0.60)", lineHeight: 1.5, marginBottom: "40px" }}>
                See how Momentify helps facility teams capture engagement, prove ROI, and turn every visit into structured pipeline data.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-start gap-4">
                <a href="/rox/facilities" className="flex-1 sm:flex-initial inline-flex items-center justify-center font-semibold text-[14px] py-3.5 px-7 rounded-lg transition-all duration-200 hover:opacity-90 hover:scale-[1.02]" style={{ fontFamily: "var(--font-inter)", color: "#FFFFFF", background: "linear-gradient(135deg, rgba(107, 63, 160, 0.5), rgba(184, 160, 216, 0.4))", border: "1.5px solid rgba(184, 160, 216, 0.35)" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(184, 160, 216, 0.6)"; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(184, 160, 216, 0.35)"; }}>
                  Calculate Your Facilities ROX
                </a>
                <a href="#demo" className="flex-1 sm:flex-initial inline-flex items-center justify-center font-semibold text-[14px] text-white py-3.5 px-7 rounded-lg transition-all duration-200 hover:bg-white/[0.08]" style={{ fontFamily: "var(--font-inter)", border: "1.5px solid rgba(255, 255, 255, 0.35)", background: "transparent" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.6)"; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.35)"; }}>
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
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(184,160,216,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
