"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Arrow icon ─────────────────────────────────────── */

function ArrowRightIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7l7 7-7 7" />
    </svg>
  );
}

/* ── Solution data ──────────────────────────────────── */

const solutions = [
  {
    tab: "Trade Shows and Exhibits",
    color: "#6B21D4",
    label: "TRADE SHOWS AND EXHIBITS",
    headline: "From branded space to outcome-driven experience.",
    body: "Most booths collect badge scans. Momentify captures what visitors actually cared about. Every conversation is contextualized, every lead is scored, and your team knows exactly who to follow up with before the show ends.",
    bullets: [
      "Capture every conversation with role, interest, and intent attached",
      "Know which leads are hot before the booth closes at the end of the day",
      "Compare performance across every show in your calendar, not just this one",
    ],
    cta: "Explore Trade Shows and Exhibits",
    bg: "linear-gradient(135deg, #2D0770 0%, #4A0FA8 55%, #9B5FE8 100%)",
    geoFill1: "white",
    geoOpacity1: 0.05,
    geoFill2: "white",
    geoOpacity2: 0.04,
    textLight: true,
    bulletDotColor: "#9B5FE8",
    ctaColor: "#C4A5F0",
  },
  {
    tab: "Technical Recruiting",
    color: "#5FD9C2",
    label: "TECHNICAL RECRUITING",
    headline: "Give your recruiters the tools the role demands.",
    body: "Technical recruiting events move fast. Momentify gives your team mobile-first capture, role-specific content delivery, and engagement analytics that tell you who is worth the follow-up call and who was just picking up swag.",
    bullets: [
      "Mobile lead capture built for fast-moving recruiting floors",
      "Persona-based content paths by role, program, and interest level",
      "Cross-event consistency across SkillsUSA, FFA, campus visits, and dealer networks",
    ],
    cta: "Explore Technical Recruiting",
    bg: "linear-gradient(135deg, #040E28 0%, #1A8A76 55%, #5FD9C2 100%)",
    geoFill1: "white",
    geoOpacity1: 0.06,
    geoFill2: "white",
    geoOpacity2: 0.04,
    textLight: true,
    bulletDotColor: "#5FD9C2",
    ctaColor: "#5FD9C2",
  },
  {
    tab: "Field Sales Enablement",
    color: "#F2B33D",
    label: "FIELD SALES ENABLEMENT",
    headline: "What happens at the job site should not stay at the job site.",
    body: "Field reps make the drive. They have the conversation. Then the insight disappears. Momentify captures what happened, delivers the right content in the moment, and syncs everything to your CRM before they get back on the road.",
    bullets: [
      "Offline-capable capture for low-connectivity environments",
      "Role-based content delivery on any device at the point of conversation",
      "Engagement-triggered exports with conversation context intact",
    ],
    cta: "Explore Field Sales Enablement",
    bg: "linear-gradient(135deg, #1A0A00 0%, #A86B00 55%, #F2B33D 100%)",
    geoFill1: "white",
    geoOpacity1: 0.06,
    geoFill2: "white",
    geoOpacity2: 0.04,
    textLight: true,
    bulletDotColor: "#F2B33D",
    ctaColor: "#F2B33D",
  },
  {
    tab: "Facilities",
    color: "#3A2073",
    label: "FACILITIES",
    headline: "Your facility is doing more work than you know. Start measuring it.",
    body: "Showrooms, training centers, and demo floors host real buyers every day. Momentify turns those visits into structured data. You will know what content resonated, what questions came up, and which visits are worth a follow-up.",
    bullets: [
      "Zone-level engagement tracking across facility touchpoints",
      "Consistent lead capture and content delivery at every station",
      "ROX reporting that connects facility investment to pipeline",
    ],
    cta: "Explore Facilities",
    bg: "linear-gradient(135deg, #0D0820 0%, #3A2073 55%, #5B4499 100%)",
    geoFill1: "white",
    geoOpacity1: 0.05,
    geoFill2: "white",
    geoOpacity2: 0.04,
    textLight: true,
    bulletDotColor: "#9B5FE8",
    ctaColor: "#B8A0D8",
  },
  {
    tab: "Events and Venues",
    color: "#F25E3D",
    label: "EVENTS AND VENUES",
    headline: "A full suite is not a strategy. Knowing what it produced is.",
    body: "Ticket sales and attendance numbers tell you who showed up. Momentify tells you what happened after they walked in. Sponsor accountability, guest engagement, and follow-up clarity in one platform.",
    bullets: [
      "Multi-point engagement capture across zones, suites, and activations",
      "Sponsor-specific tracking with exportable ROX reports",
      "Persona-based content and experiences by section, suite, and guest type",
    ],
    cta: "Explore Events and Venues",
    bg: "linear-gradient(135deg, #1A0400 0%, #8F200A 55%, #F25E3D 100%)",
    geoFill1: "white",
    geoOpacity1: 0.06,
    geoFill2: "white",
    geoOpacity2: 0.04,
    textLight: true,
    bulletDotColor: "#F25E3D",
    ctaColor: "#F9A08E",
  },
];

/* ── Animation variants ─────────────────────────────── */

const headerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

/* ── Platform / Solutions Section ────────────────────── */

export default function Platform() {
  const [activeTab, setActiveTab] = useState(0);
  const sol = solutions[activeTab];

  return (
    <section
      id="platform"
      className="py-16 sm:py-20 lg:py-24"
      style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #F5F6F8 100%)" }}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-12">

        {/* ── Section header ──────────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={headerVariants}
        >
          <motion.p
            variants={fadeUp}
            className="uppercase text-[12px] tracking-[0.14em] mb-4"
            style={{
              fontFamily: "var(--font-inter)",
              fontWeight: 600,
              color: "#00BBA5",
            }}
          >
            Our Solutions
          </motion.p>

          <motion.h2
            variants={fadeUp}
            className="leading-[1.1]"
            style={{
              fontFamily: "var(--font-inter)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              fontSize: "clamp(28px, 4.5vw, 52px)",
              color: "#061341",
            }}
          >
            One Platform. Every Interaction.
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-4 max-w-[600px]"
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "15px",
              fontWeight: 300,
              lineHeight: "1.5",
              color: "rgba(6, 19, 65, 0.6)",
            }}
          >
            Momentify works across every context where in-person engagement happens, but effective and meaningful measurement has been missing.
          </motion.p>
        </motion.div>

        {/* ── Tab bar ─────────────────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={fadeUp}
          className="mt-10"
        >
          <div
            className="scrollbar-hide overflow-x-auto"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <div className="flex gap-3">
              {solutions.map((s, i) => {
                const isActive = i === activeTab;
                const textColor = isActive
                  ? "#FFFFFF"
                  : "rgba(6, 19, 65, 0.4)";

                return (
                  <button
                    key={s.tab}
                    onClick={(e) => {
                      setActiveTab(i);
                      e.currentTarget.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
                    }}
                    className="flex-shrink-0 rounded-full py-3 px-5 text-[15px] font-semibold transition-all duration-150 whitespace-nowrap cursor-pointer"
                    style={{
                      fontFamily: "var(--font-inter)",
                      color: textColor,
                      backgroundColor: isActive ? s.color : "transparent",
                      border: isActive ? `1.5px solid ${s.color}` : "1.5px solid rgba(6, 19, 65, 0.12)",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.color = "rgba(6, 19, 65, 0.7)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.color = "rgba(6, 19, 65, 0.4)";
                    }}
                  >
                    {s.tab}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Content panel (full-width colored background) ── */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={fadeUp}
        className="mt-8"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative overflow-hidden rounded-2xl mx-4 sm:mx-6 lg:mx-auto lg:max-w-7xl"
            style={{ background: sol.bg }}
          >
            {/* Geometric pattern overlay */}
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 1440 900"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMaxYMax slice"
              aria-hidden="true"
            >
              <path
                d="M1440 900 L1440 270 L960 0 L480 0 L1008 360 L1008 900 Z"
                fill={sol.geoFill1}
                fillOpacity={sol.geoOpacity1}
              />
              <path
                d="M1440 900 L1440 468 L864 108 L384 108 L864 468 L864 900 Z"
                fill={sol.geoFill2}
                fillOpacity={sol.geoOpacity2}
              />
            </svg>

            {/* Content grid */}
            <div className="relative px-8 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20">
              <div className="grid grid-cols-1 lg:grid-cols-[50%_50%] gap-10 lg:gap-16 items-center">

                {/* ── Left column: copy ─────────────── */}
                <div>
                  {/* Solution label */}
                  <p
                    className="text-[12px] uppercase tracking-[0.14em] mb-4"
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontWeight: 600,
                      color: "rgba(255, 255, 255, 0.6)",
                    }}
                  >
                    {sol.label}
                  </p>

                  {/* Headline */}
                  <h3
                    className="leading-[1.05] mb-5"
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontWeight: 500,
                      letterSpacing: "-0.02em",
                      fontSize: "clamp(24px, 3.5vw, 40px)",
                      color: "#FFFFFF",
                    }}
                  >
                    {sol.headline}
                  </h3>

                  {/* Body */}
                  <p
                    className="text-[14px] leading-[1.7] max-w-[480px] mb-8"
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontWeight: 400,
                      color: "rgba(255, 255, 255, 0.65)",
                    }}
                  >
                    {sol.body}
                  </p>

                  {/* Capability bullets */}
                  <ul className="space-y-3 mb-10">
                    {sol.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3">
                        <span
                          className="mt-[7px] h-[6px] w-[6px] rounded-full flex-shrink-0"
                          style={{ backgroundColor: sol.bulletDotColor }}
                        />
                        <span
                          className="text-[13px] leading-[1.6]"
                          style={{
                            fontFamily: "var(--font-inter)",
                            fontWeight: 400,
                            color: "rgba(255, 255, 255, 0.85)",
                          }}
                        >
                          {bullet}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA button */}
                  <a
                    href="#"
                    className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-[14px] font-semibold transition-all duration-150 hover:bg-white/10"
                    style={{
                      fontFamily: "var(--font-inter)",
                      color: "#FFFFFF",
                      background: "transparent",
                      border: "1.5px solid rgba(255, 255, 255, 0.5)",
                    }}
                  >
                    {sol.cta}
                    <ArrowRightIcon />
                  </a>
                </div>

                {/* ── Right column: mockup placeholders (desktop) */}
                <div className="hidden lg:flex items-center justify-center">
                  <div className="relative">
                    {/* Primary mockup */}
                    <div
                      className="rounded-2xl shadow-lg flex items-center justify-center p-6"
                      style={{
                        width: 380,
                        height: 260,
                        backgroundColor: "rgba(255, 255, 255, 0.08)",
                        border: "1.5px dashed rgba(255, 255, 255, 0.25)",
                      }}
                    >
                      <p
                        className="text-center text-[13px] italic leading-[1.6] max-w-[300px]"
                        style={{
                          fontFamily: "var(--font-inter)",
                          fontWeight: 500,
                          color: "rgba(255, 255, 255, 0.4)",
                        }}
                      >
                        iPad or mobile mockup showing the Momentify attendee-facing experience for {sol.tab}.
                      </p>
                    </div>

                    {/* Secondary mockup — overlapping */}
                    <div
                      className="absolute rounded-xl shadow-xl flex items-center justify-center p-5"
                      style={{
                        width: 290,
                        height: 190,
                        top: 100,
                        left: 100,
                        backgroundColor: "rgba(255, 255, 255, 0.12)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      <p
                        className="text-center text-[13px] italic leading-[1.6] max-w-[260px]"
                        style={{
                          fontFamily: "var(--font-inter)",
                          fontWeight: 500,
                          color: "rgba(255, 255, 255, 0.4)",
                        }}
                      >
                        ROX analytics dashboard screenshot for {sol.tab}.
                      </p>
                    </div>
                  </div>
                </div>

                {/* ── Right column: mockup placeholders (mobile) */}
                <div className="flex flex-col gap-4 lg:hidden items-center justify-center">
                  <div
                    className="w-full rounded-2xl shadow-lg flex items-center justify-center p-6"
                    style={{
                      height: 200,
                      backgroundColor: "rgba(255, 255, 255, 0.08)",
                      border: "1.5px dashed rgba(255, 255, 255, 0.25)",
                    }}
                  >
                    <p
                      className="text-center text-[13px] italic leading-[1.6]"
                      style={{
                        fontFamily: "var(--font-inter)",
                        fontWeight: 500,
                        color: "rgba(255, 255, 255, 0.4)",
                      }}
                    >
                      iPad or mobile mockup for {sol.tab}.
                    </p>
                  </div>
                  <div
                    className="w-full rounded-xl shadow-xl flex items-center justify-center p-5"
                    style={{
                      height: 160,
                      backgroundColor: "rgba(255, 255, 255, 0.12)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                    }}
                  >
                    <p
                      className="text-center text-[13px] italic leading-[1.6]"
                      style={{
                        fontFamily: "var(--font-inter)",
                        fontWeight: 500,
                        color: "rgba(255, 255, 255, 0.4)",
                      }}
                    >
                      ROX dashboard for {sol.tab}.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
