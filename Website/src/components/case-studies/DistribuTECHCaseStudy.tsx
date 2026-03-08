"use client";

import { motion } from "framer-motion";

/* ── Animation variants (match existing site pattern) ── */

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

/* ── Stats data ──────────────────────────────────────── */

const heroStats = [
  { number: "92%", label: "Lead growth over three consecutive years" },
  { number: "1,952", label: "Companies captured and qualified" },
  { number: "47%", label: "Increase in qualified leads" },
];

/* ── Challenge cards ─────────────────────────────────── */

const challengeCards = [
  {
    label: "No visitor qualification",
    body: "Badge scans captured a name but not a reason. Reps had no way to sort genuine interest from casual foot traffic.",
  },
  {
    label: "No structured follow-up",
    body: "Without engagement data attached to names, the follow-up was generic. High-intent visitors got the same email as everyone else.",
  },
  {
    label: "No executive visibility",
    body: "Leadership wanted to see ROI from trade show spend, but there was no data connecting booth interactions to pipeline outcomes.",
  },
];

/* ── Solution tiles ──────────────────────────────────── */

const solutionTiles = [
  {
    headline: "Persona-driven visitor journeys",
    body: "Each visitor was guided through a tailored experience based on their role and interests. The platform matched them to relevant solutions in real time, turning passive booth visits into structured engagement.",
    icon: "journey",
  },
  {
    headline: "Live lead qualification",
    body: "Reps could see which visitors were high-intent as conversations happened. Lead scores updated in real time, so the team focused energy where it mattered most.",
    icon: "score",
  },
  {
    headline: "Real-time lead routing",
    body: "Qualified leads were routed to the right follow-up team before the visitor left the booth. No waiting. No spreadsheets. No lost context.",
    icon: "route",
  },
];

/* ── Results grid ────────────────────────────────────── */

const resultsCells = [
  {
    type: "single" as const,
    number: "92%",
    label: "Total lead growth across three consecutive years at DistribuTECH. Same event, same booth, compounding results.",
    tag: "Lead Growth",
  },
  {
    type: "single" as const,
    number: "1,952",
    label: "Companies captured and qualified through Momentify's guided engagement experience across three years.",
    tag: "Companies Reached",
  },
  {
    type: "single" as const,
    number: "544",
    label: "Follow-up conversations initiated with context, interest data, and lead scores attached.",
    tag: "Qualified Follow-ups",
  },
  {
    type: "single" as const,
    number: "47%",
    label: "Increase in qualified leads, driven by persona-based visitor journeys and real-time scoring.",
    tag: "Lead Quality",
  },
];

/* ── Icon components ─────────────────────────────────── */

function IconJourney() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="6" cy="8" r="2.5" stroke="#C4A5F0" strokeWidth="1.8" />
      <circle cx="26" cy="24" r="2.5" stroke="#C4A5F0" strokeWidth="1.8" />
      <circle cx="16" cy="16" r="1.5" fill="#C4A5F0" fillOpacity="0.4" />
      <path
        d="M8.5 8C12 8 12 16 16 16C20 16 20 24 23.5 24"
        stroke="#C4A5F0"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function IconScore() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 22A11 11 0 0 1 27 22"
        stroke="#C4A5F0"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M16 22L22 12"
        stroke="#C4A5F0"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="16" cy="22" r="2" fill="#C4A5F0" fillOpacity="0.4" />
      <line x1="8" y1="22" x2="8" y2="20" stroke="#C4A5F0" strokeWidth="1.2" strokeOpacity="0.4" />
      <line x1="24" y1="22" x2="24" y2="20" stroke="#C4A5F0" strokeWidth="1.2" strokeOpacity="0.4" />
      <line x1="16" y1="11" x2="16" y2="13" stroke="#C4A5F0" strokeWidth="1.2" strokeOpacity="0.4" />
    </svg>
  );
}

function IconRoute() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 6V16"
        stroke="#C4A5F0"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M16 16C16 16 16 20 10 26"
        stroke="#C4A5F0"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M16 16C16 16 16 20 22 26"
        stroke="#C4A5F0"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="16" cy="6" r="2" stroke="#C4A5F0" strokeWidth="1.5" />
      <circle cx="10" cy="26" r="2" fill="#C4A5F0" fillOpacity="0.4" />
      <circle cx="22" cy="26" r="2" fill="#C4A5F0" fillOpacity="0.4" />
    </svg>
  );
}

const iconMap: Record<string, () => React.ReactNode> = {
  journey: IconJourney,
  score: IconScore,
  route: IconRoute,
};

/* ════════════════════════════════════════════════════════
   DISTRIBUTECH CASE STUDY
   ════════════════════════════════════════════════════════ */

export default function DistribuTECHCaseStudy() {
  return (
    <>
      {/* ═══════════════════ 1. HERO ═══════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundSize: "200% 200%",
          animation: "bgShift 16s ease-in-out infinite",
          backgroundImage:
            "linear-gradient(135deg, #040E28 0%, #0B0B3C 30%, #5B2E91 60%, #040E28 100%)",
          minHeight: "560px",
        }}
      >
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div
            className="absolute w-[600px] h-[600px] rounded-full opacity-[0.07] blur-[120px]"
            style={{
              background: "radial-gradient(circle, #9B5FE8, transparent 70%)",
              top: "10%",
              left: "60%",
              animation: "ambientFloat1 12s ease-in-out infinite",
            }}
          />
          <div
            className="absolute w-[500px] h-[500px] rounded-full opacity-[0.05] blur-[100px]"
            style={{
              background: "radial-gradient(circle, #7C316D, transparent 70%)",
              bottom: "0%",
              left: "10%",
              animation: "ambientFloat2 15s ease-in-out infinite",
            }}
          />
        </div>

        {/* ARC pattern */}
        <div
          className="absolute inset-0 pointer-events-none z-[1] overflow-hidden"
          style={{ animation: "arcDrift 20s ease-in-out infinite" }}
        >
          <svg
            viewBox="0 0 600 500"
            fill="none"
            className="absolute w-full h-full"
            style={{ top: 0, right: 0 }}
            preserveAspectRatio="xMaxYMax meet"
          >
            <path d="M 600 300 A 200 200 0 0 0 400 500" stroke="white" strokeOpacity="0.08" strokeWidth="1.4" fill="none" />
            <path d="M 600 150 A 350 350 0 0 0 250 500" stroke="white" strokeOpacity="0.05" strokeWidth="1" fill="none" />
            <path d="M 600 0 A 500 500 0 0 0 100 500" stroke="white" strokeOpacity="0.03" strokeWidth="0.8" fill="none" />
          </svg>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12" style={{ paddingTop: "140px", paddingBottom: "100px" }}>
          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              fontFamily: "var(--font-inter)",
              fontWeight: 600,
              fontSize: "11px",
              color: "#C4A5F0",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            Case Study / Trade Shows
          </motion.p>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            style={{
              fontFamily: "var(--font-inter)",
              fontWeight: 500,
              fontSize: "clamp(28px, 4.5vw, 52px)",
              color: "#FFFFFF",
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              maxWidth: "820px",
              marginBottom: "24px",
            }}
          >
            Same booth. Same show.<br />92% more leads.
          </motion.h1>

          {/* Subhead */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            style={{
              fontFamily: "var(--font-inter)",
              fontWeight: 300,
              fontSize: "15px",
              color: "rgba(255, 255, 255, 0.60)",
              lineHeight: 1.5,
              marginBottom: "48px",
            }}
          >
            How Caterpillar grew qualified trade show leads 92% over three consecutive years at DistribuTECH.
          </motion.p>

          {/* Stat row */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.26 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-8 sm:gap-0"
          >
            {heroStats.map((stat, i) => (
              <div key={stat.number} className="flex items-center">
                {i > 0 && (
                  <div
                    className="hidden sm:block"
                    style={{
                      width: "1px",
                      height: "48px",
                      background: "rgba(255, 255, 255, 0.15)",
                      marginLeft: "24px",
                      marginRight: "24px",
                    }}
                  />
                )}
                <div>
                  <p
                    className="text-gradient-hero"
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontWeight: 500,
                      fontSize: "clamp(44px, 5vw, 64px)",
                      lineHeight: 1,
                      letterSpacing: "-0.02em",
                      marginBottom: "6px",
                    }}
                  >
                    {stat.number}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontWeight: 400,
                      fontSize: "13px",
                      color: "rgba(255, 255, 255, 0.50)",
                      lineHeight: 1.4,
                      maxWidth: "200px",
                    }}
                  >
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Client tag row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.34 }}
            className="flex items-center gap-3"
            style={{ marginTop: "40px" }}
          >
            <img
              src="/logos/caterpillar.png"
              alt="Caterpillar"
              style={{ maxHeight: "36px", width: "auto", opacity: 0.85 }}
            />
            <span style={{ color: "rgba(255, 255, 255, 0.20)", fontSize: "12px" }}>·</span>
            <span
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 500,
                fontSize: "12px",
                color: "rgba(255, 255, 255, 0.50)",
              }}
            >
              Electric Power Division
            </span>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ 2. CHALLENGE ═══════════════ */}
      <section
        style={{ background: "#FFFFFF", padding: "100px 0" }}
      >
        <div className="mx-auto px-6 lg:px-12" style={{ maxWidth: "1100px" }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={headerVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
          >
            {/* Left column */}
            <div>
              <motion.p
                variants={fadeUp}
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 600,
                  fontSize: "10px",
                  color: "#C4A5F0",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  marginBottom: "16px",
                }}
              >
                The Challenge
              </motion.p>

              <motion.h2
                variants={fadeUp}
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 500,
                  fontSize: "36px",
                  color: "#061341",
                  lineHeight: 1.15,
                  marginBottom: "24px",
                }}
              >
                A world-class product lineup. No way to measure who cared.
              </motion.h2>

              <motion.div variants={fadeUp}>
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontWeight: 400,
                    fontSize: "16px",
                    color: "rgba(6, 19, 65, 0.55)",
                    lineHeight: 1.75,
                    marginBottom: "20px",
                  }}
                >
                  Caterpillar&apos;s Electric Power Division showed up to DistribuTECH every year with a strong booth, experienced reps, and a product portfolio that covered the full range of power generation. But when the show floor closed, the data walked out the door.
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontWeight: 400,
                    fontSize: "16px",
                    color: "rgba(6, 19, 65, 0.55)",
                    lineHeight: 1.75,
                    marginBottom: "20px",
                  }}
                >
                  Badge scans told the team someone stopped by. They did not tell them why. There was no way to measure real engagement, qualify leads by intent, or connect what happened on the floor to what happened after.
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontWeight: 400,
                    fontSize: "16px",
                    color: "rgba(6, 19, 65, 0.55)",
                    lineHeight: 1.75,
                  }}
                >
                  EPD was not lacking leads. They were lacking context. The volume was there but the signal was buried.
                </p>
              </motion.div>
            </div>

            {/* Right column: challenge cards */}
            <motion.div
              variants={stagger}
              className="flex flex-col gap-4"
            >
              {challengeCards.map((card, i) => (
                <motion.div
                  key={card.label}
                  variants={fadeUp}
                  style={{
                    background: "#FFFFFF",
                    borderRadius: "12px",
                    padding: "24px 28px",
                    borderLeft: `3px solid ${
                      ["#C4A5F0", "#9B5FE8", "#7B3EC8"][i]
                    }`,
                    boxShadow: "0 2px 12px rgba(155, 95, 232, 0.08)",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontWeight: 700,
                      fontSize: "14px",
                      color: "#061341",
                      marginBottom: "8px",
                    }}
                  >
                    {card.label}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontWeight: 400,
                      fontSize: "13px",
                      color: "rgba(6, 19, 65, 0.55)",
                      lineHeight: 1.6,
                    }}
                  >
                    {card.body}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ 3. SOLUTION ════════════════ */}
      <section className="relative overflow-hidden" style={{ background: "#F8F9FC", padding: "100px 0" }}>
        {/* Subtle violet diagonal lines */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.08,
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 40px,
              #9B5FE8 40px,
              #9B5FE8 41px
            )`,
          }}
        />
        <div className="relative z-10 mx-auto px-6 lg:px-12" style={{ maxWidth: "1100px" }}>
          {/* Section header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={headerVariants}
          >
            <motion.p
              variants={fadeUp}
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 600,
                fontSize: "10px",
                color: "#C4A5F0",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: "16px",
              }}
            >
              The Solution
            </motion.p>

            <motion.h2
              variants={fadeUp}
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 500,
                fontSize: "36px",
                color: "#061341",
                lineHeight: 1.15,
                maxWidth: "720px",
                marginBottom: "16px",
              }}
            >
              From badge scans to guided conversations. Every visitor gets a journey.
            </motion.h2>

            <motion.p
              variants={fadeUp}
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 400,
                fontSize: "17px",
                color: "rgba(6, 19, 65, 0.50)",
                lineHeight: 1.65,
                maxWidth: "600px",
                marginBottom: "64px",
              }}
            >
              Momentify gave EPD a guided, objective-based visitor experience that captured intent, matched visitors to the right solutions, and routed qualified leads before the show floor closed.
            </motion.p>
          </motion.div>

          {/* Solution tiles */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {solutionTiles.map((tile) => {
              const Icon = iconMap[tile.icon];
              return (
                <motion.div
                  key={tile.headline}
                  variants={fadeUp}
                  className="transition-all duration-200 hover:-translate-y-1"
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid rgba(6, 19, 65, 0.08)",
                    borderRadius: "16px",
                    padding: "36px 28px",
                  }}
                >
                  <div style={{ marginBottom: "20px" }}>
                    <Icon />
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontWeight: 700,
                      fontSize: "17px",
                      color: "#061341",
                      lineHeight: 1.3,
                      marginBottom: "12px",
                    }}
                  >
                    {tile.headline}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontWeight: 400,
                      fontSize: "14px",
                      color: "rgba(6, 19, 65, 0.55)",
                      lineHeight: 1.65,
                    }}
                  >
                    {tile.body}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ PHOTO STRIP ═════════════════ */}
      <section style={{ padding: 0, overflow: "hidden" }}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6 }}
          className="flex overflow-x-auto md:grid md:grid-cols-3"
          style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
        >
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="relative overflow-hidden flex-shrink-0 w-[85vw] md:w-auto flex items-center justify-center"
              style={{ height: "360px", scrollSnapAlign: "start", background: "#E5E7EB" }}
            >
              <span
                style={{
                  color: "rgba(6,19,65,0.3)",
                  fontSize: "14px",
                  fontWeight: 500,
                  fontFamily: "var(--font-inter)",
                }}
              >
                Photo placeholder
              </span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ═══════════════════ 4. QUOTE 1 (DARK) ══════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundSize: "200% 200%",
          animation: "bgShift 16s ease-in-out infinite",
          backgroundImage:
            "linear-gradient(135deg, #040E28 0%, #0B0B3C 30%, #5B2E91 60%, #040E28 100%)",
          padding: "80px 0",
        }}
      >
        {/* Geometric overlay */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMaxYMax slice"
          aria-hidden="true"
        >
          <path d="M1440 900 L1440 324 L1008 0 L528 0 L1056 396 L1056 900 Z" fill="white" fillOpacity="0.02" />
          <path d="M1440 900 L1440 540 L912 144 L432 144 L912 504 L912 900 Z" fill="white" fillOpacity="0.015" />
        </svg>

        <div className="relative z-10 mx-auto max-w-[800px] px-6 lg:px-12 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={headerVariants}
          >
            {/* Open quote */}
            <motion.span
              variants={fadeUp}
              style={{
                display: "block",
                fontFamily: "var(--font-inter)",
                fontWeight: 500,
                fontSize: "96px",
                color: "#C4A5F0",
                opacity: 0.4,
                lineHeight: 0.8,
                marginBottom: "8px",
              }}
            >
              &ldquo;
            </motion.span>

            {/* Quote text */}
            <motion.p
              variants={fadeUp}
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 500,
                fontSize: "clamp(18px, 2.5vw, 24px)",
                color: "#FFFFFF",
                lineHeight: 1.6,
                fontStyle: "italic",
              }}
            >
              Placeholder for customer quote. Replace with actual testimonial when available.
            </motion.p>

            {/* Attribution */}
            <motion.div
              variants={fadeUp}
              className="flex items-center justify-center gap-4"
              style={{ marginTop: "32px" }}
            >
              {/* Initials circle */}
              <div
                className="rounded-full flex-shrink-0 flex items-center justify-center"
                style={{
                  width: "56px",
                  height: "56px",
                  background: "rgba(196, 165, 240, 0.2)",
                  border: "2px solid rgba(155, 95, 232, 0.3)",
                }}
              >
                <span
                  style={{
                    color: "#C4A5F0",
                    fontWeight: 700,
                    fontSize: "18px",
                    fontFamily: "var(--font-inter)",
                  }}
                >
                  EP
                </span>
              </div>
              <div className="text-left">
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontWeight: 700,
                    fontSize: "15px",
                    color: "#FFFFFF",
                  }}
                >
                  Name TBD
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontWeight: 400,
                    fontSize: "13px",
                    color: "rgba(255, 255, 255, 0.50)",
                  }}
                >
                  Electric Power Division, Caterpillar
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ 5. RESULTS ═════════════════ */}
      <section style={{ background: "rgba(155, 95, 232, 0.07)", padding: "100px 0" }}>
        <div className="mx-auto px-6 lg:px-12" style={{ maxWidth: "1100px" }}>
          {/* Section header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={headerVariants}
          >
            <motion.p
              variants={fadeUp}
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 600,
                fontSize: "10px",
                color: "#C4A5F0",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: "16px",
              }}
            >
              The Results
            </motion.p>

            <motion.h2
              variants={fadeUp}
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 500,
                fontSize: "clamp(32px, 4vw, 48px)",
                color: "#061341",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                marginBottom: "64px",
              }}
            >
              <span className="text-gradient-brand" style={{ fontWeight: 600 }}>92%</span> lead growth.<br /><span className="text-gradient-brand" style={{ fontWeight: 600 }}>1,952</span> companies. <span className="text-gradient-brand" style={{ fontWeight: 600 }}>3</span> years compounding.
            </motion.h2>
          </motion.div>

          {/* Results grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {resultsCells.map((cell, i) => {
              const accentColors = ["#C4A5F0", "#9B5FE8", "#7B3EC8", "#5B2E91"];
              return (
              <motion.div
                key={cell.tag}
                variants={fadeUp}
                style={{
                  background: "#FFFFFF",
                  borderRadius: "16px",
                  padding: "40px 32px",
                  borderTop: `3px solid ${accentColors[i]}`,
                  boxShadow: "0 4px 24px rgba(6, 19, 65, 0.06)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Decorative accent glow */}
                <div
                  style={{
                    position: "absolute",
                    top: "-20px",
                    right: "-20px",
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${accentColors[i]}15, transparent 70%)`,
                    pointerEvents: "none",
                  }}
                />

                <p
                  className="text-gradient-brand"
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontWeight: 600,
                    fontSize: "56px",
                    lineHeight: 1,
                    marginBottom: "12px",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {cell.number}
                </p>

                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontWeight: 400,
                    fontSize: "14px",
                    color: "rgba(6, 19, 65, 0.55)",
                    lineHeight: 1.5,
                    marginBottom: "16px",
                  }}
                >
                  {cell.label}
                </p>

                {/* Tag */}
                <span
                  style={{
                    display: "inline-block",
                    fontFamily: "var(--font-inter)",
                    fontWeight: 600,
                    fontSize: "10px",
                    letterSpacing: "0.08em",
                    color: "#9B5FE8",
                    background: "rgba(155,95,232,0.10)",
                    borderRadius: "20px",
                    padding: "5px 12px",
                  }}
                >
                  {cell.tag}
                </span>
              </motion.div>
              );
            })}
          </motion.div>

          {/* Results callout block */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={fadeUp}
            style={{
              marginTop: "24px",
              background: "linear-gradient(135deg, #040E28 0%, #0B0B3C 50%, #5B2E91 100%)",
              borderRadius: "16px",
              padding: "40px 40px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative arc */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ opacity: 0.06 }}
            >
              <svg viewBox="0 0 800 200" fill="none" className="absolute w-full h-full" preserveAspectRatio="xMaxYMax meet">
                <path d="M 800 100 A 200 200 0 0 0 600 200" stroke="white" strokeWidth="1.5" fill="none" />
                <path d="M 800 0 A 300 300 0 0 0 500 200" stroke="white" strokeWidth="1" fill="none" />
              </svg>
            </div>
            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 600,
                fontSize: "10px",
                color: "#C4A5F0",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: "12px",
                position: "relative",
                zIndex: 1,
              }}
            >
              From the Results
            </p>
            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 400,
                fontSize: "16px",
                color: "rgba(255, 255, 255, 0.70)",
                lineHeight: 1.7,
                fontStyle: "italic",
                position: "relative",
                zIndex: 1,
              }}
            >
              Over three consecutive years, EPD saw engagement depth, opt-in rates, and follow-up speed all improve year over year. The results compounded because the team could finally see what was working and what was not.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ 6. QUOTE 2 (WHITE BG) ══════ */}
      <section
        style={{
          background: "#FFFFFF",
          padding: "60px 0",
          borderTop: "1px solid rgba(6, 19, 65, 0.06)",
          borderBottom: "1px solid rgba(6, 19, 65, 0.06)",
        }}
      >
        <div className="mx-auto max-w-[760px] px-6 lg:px-12 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={headerVariants}
          >
            <motion.p
              variants={fadeUp}
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 500,
                fontSize: "clamp(17px, 2.2vw, 22px)",
                color: "#061341",
                lineHeight: 1.65,
                fontStyle: "italic",
              }}
            >
              &ldquo;Placeholder for customer quote. Replace with actual testimonial when available.&rdquo;
            </motion.p>

            {/* Attribution */}
            <motion.div
              variants={fadeUp}
              className="flex items-center justify-center gap-4"
              style={{ marginTop: "32px" }}
            >
              {/* Initials circle */}
              <div
                className="rounded-full flex-shrink-0 flex items-center justify-center"
                style={{
                  width: "56px",
                  height: "56px",
                  background: "rgba(6,19,65,0.08)",
                  border: "2px solid rgba(6, 19, 65, 0.15)",
                }}
              >
                <span
                  style={{
                    color: "#061341",
                    fontWeight: 700,
                    fontSize: "18px",
                    fontFamily: "var(--font-inter)",
                  }}
                >
                  EP
                </span>
              </div>
              <div className="text-left">
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontWeight: 700,
                    fontSize: "15px",
                    color: "#061341",
                  }}
                >
                  Name TBD
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontWeight: 400,
                    fontSize: "13px",
                    color: "rgba(6, 19, 65, 0.50)",
                  }}
                >
                  Electric Power Division, Caterpillar
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ 7. FINAL CTA ══════════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundSize: "200% 200%",
          animation: "bgShift 16s ease-in-out infinite",
          backgroundImage:
            "linear-gradient(135deg, #040E28 0%, #0B0B3C 30%, #5B2E91 60%, #040E28 100%)",
          padding: "120px 0",
        }}
      >
        {/* Geometric overlay */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMaxYMax slice"
          aria-hidden="true"
        >
          <path d="M1440 900 L1440 324 L1008 0 L528 0 L1056 396 L1056 900 Z" fill="white" fillOpacity="0.02" />
          <path d="M1440 900 L1440 540 L912 144 L432 144 L912 504 L912 900 Z" fill="white" fillOpacity="0.015" />
        </svg>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={headerVariants}
            style={{ maxWidth: "640px" }}
          >
            {/* Eyebrow */}
            <motion.p
              variants={fadeUp}
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 600,
                fontSize: "11px",
                color: "#C4A5F0",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: "16px",
              }}
            >
              Get Started
            </motion.p>

            {/* Headline */}
            <motion.h2
              variants={fadeUp}
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 500,
                fontSize: "clamp(32px, 4vw, 44px)",
                color: "#FFFFFF",
                lineHeight: 1.1,
                marginBottom: "20px",
              }}
            >
              Ready to transform your next trade show?
            </motion.h2>

            {/* Subhead */}
            <motion.p
              variants={fadeUp}
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 400,
                fontSize: "17px",
                color: "rgba(255, 255, 255, 0.60)",
                lineHeight: 1.65,
                maxWidth: "520px",
                marginBottom: "40px",
              }}
            >
              See how Momentify helps trade show teams capture, qualify, and follow up with leads before the competition does.
            </motion.p>

            {/* CTA pair */}
            <motion.div
              variants={fadeUp}
              className="flex flex-row gap-3 sm:gap-4"
            >
              {/* Primary */}
              <a
                href="/demo?source=case-study-distributech"
                className="inline-flex items-center justify-center flex-1 sm:flex-initial text-[12px] sm:text-[14px] py-2.5 sm:py-3.5 px-3 sm:px-7 transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
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

              {/* Secondary */}
              <a
                href="/rox/trade-shows"
                className="inline-flex items-center justify-center flex-1 sm:flex-initial text-[12px] sm:text-[14px] py-2.5 sm:py-3.5 px-3 sm:px-7 transition-all duration-200"
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 500,
                  color: "#FFFFFF",
                  background: "transparent",
                  borderRadius: "8px",
                  border: "1.5px solid rgba(255, 255, 255, 0.20)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.20)";
                }}
              >
                Calculate Your Trade Show ROX™
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
