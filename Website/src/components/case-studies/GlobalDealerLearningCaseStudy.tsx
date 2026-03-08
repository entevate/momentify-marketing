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
  { number: "5,400+", label: "Opt-ins from students, advisors, and teachers" },
  { number: "40", label: "Dealers receiving matched candidates" },
  { number: "0", label: "Lost candidates across all events" },
];

/* ── Challenge cards ─────────────────────────────────── */

const challengeCards = [
  {
    label: "No candidate routing",
    body: "Students met Caterpillar at national events but had no direct connection to the local dealer who could offer them a job. Intent was captured but never delivered.",
  },
  {
    label: "Inconsistent capture across events",
    body: "Each event operated differently. Some captured data on paper, some on spreadsheets. There was no single system connecting SkillsUSA, FFA, and dealer pilot events.",
  },
  {
    label: "No visibility for dealers",
    body: "Dealers had no way to see which candidates were interested in their region. Qualified students were invisible until someone manually forwarded a list.",
  },
];

/* ── Solution tiles ──────────────────────────────────── */

const solutionTiles = [
  {
    headline: "Unified event capture",
    body: "One consistent experience across SkillsUSA, FFA, and dealer pilot events. Every candidate interaction captured digitally with the same platform, the same data structure, the same quality.",
    icon: "unified",
  },
  {
    headline: "Persona-driven qualification",
    body: "Students were profiled by interest area, program fit, and geographic preference. The platform sorted candidates by who they were and where they wanted to work.",
    icon: "persona",
  },
  {
    headline: "Automatic dealer routing",
    body: "Qualified candidates were matched to the nearest participating dealer and delivered with context attached. No manual handoffs. No spreadsheet forwarding. No lost names.",
    icon: "routing",
  },
];

/* ── Results grid ────────────────────────────────────── */

const resultsCells = [
  {
    type: "single" as const,
    number: "5,400+",
    label:
      "Opt-ins captured from students, advisors, and teachers across SkillsUSA, FFA, and dealer pilot events.",
    tag: "Candidate Capture",
  },
  {
    type: "single" as const,
    number: "40",
    label:
      "Dealers receiving qualified, matched candidates from a single national recruiting program.",
    tag: "Dealer Network",
  },
  {
    type: "single" as const,
    number: "0",
    label:
      "Lost candidates. Every student engagement was captured, scored, and routed to the right dealer automatically.",
    tag: "Zero Drop-off",
  },
  {
    type: "single" as const,
    number: "1",
    label:
      "Platform connecting events, schools, and dealers through one consistent recruiting experience.",
    tag: "Unified System",
  },
];

/* ── Icon components ─────────────────────────────────── */

function IconUnified() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Top-left square */}
      <rect
        x="4"
        y="4"
        width="10"
        height="10"
        rx="2"
        stroke="#5FD9C2"
        strokeWidth="1.8"
      />
      {/* Top-right square */}
      <rect
        x="18"
        y="4"
        width="10"
        height="10"
        rx="2"
        stroke="#5FD9C2"
        strokeWidth="1.8"
      />
      {/* Bottom-left square */}
      <rect
        x="4"
        y="18"
        width="10"
        height="10"
        rx="2"
        stroke="#5FD9C2"
        strokeWidth="1.8"
      />
      {/* Bottom-right square */}
      <rect
        x="18"
        y="18"
        width="10"
        height="10"
        rx="2"
        stroke="#5FD9C2"
        strokeWidth="1.8"
      />
      {/* Connecting lines */}
      <line x1="14" y1="9" x2="18" y2="9" stroke="#5FD9C2" strokeWidth="1.2" strokeOpacity="0.5" />
      <line x1="14" y1="23" x2="18" y2="23" stroke="#5FD9C2" strokeWidth="1.2" strokeOpacity="0.5" />
      <line x1="9" y1="14" x2="9" y2="18" stroke="#5FD9C2" strokeWidth="1.2" strokeOpacity="0.5" />
      <line x1="23" y1="14" x2="23" y2="18" stroke="#5FD9C2" strokeWidth="1.2" strokeOpacity="0.5" />
    </svg>
  );
}

function IconPersona() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Person head */}
      <circle cx="13" cy="10" r="4" stroke="#5FD9C2" strokeWidth="1.8" />
      {/* Person body */}
      <path
        d="M5 26c0-4.418 3.582-7 8-7s8 2.582 8 7"
        stroke="#5FD9C2"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Badge/card */}
      <rect
        x="20"
        y="12"
        width="9"
        height="12"
        rx="2"
        stroke="#5FD9C2"
        strokeWidth="1.5"
        strokeOpacity="0.6"
      />
      {/* Badge line 1 */}
      <line x1="22.5" y1="16" x2="26.5" y2="16" stroke="#5FD9C2" strokeWidth="1" strokeOpacity="0.4" />
      {/* Badge line 2 */}
      <line x1="22.5" y1="19" x2="26.5" y2="19" stroke="#5FD9C2" strokeWidth="1" strokeOpacity="0.4" />
    </svg>
  );
}

function IconRouting() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main stem */}
      <path
        d="M6 16h10"
        stroke="#5FD9C2"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Top branch */}
      <path
        d="M16 16L24 8"
        stroke="#5FD9C2"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Middle branch */}
      <path
        d="M16 16h10"
        stroke="#5FD9C2"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Bottom branch */}
      <path
        d="M16 16L24 24"
        stroke="#5FD9C2"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Arrow tip - top */}
      <path
        d="M21 6l3 2-3 2"
        stroke="#5FD9C2"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Arrow tip - middle */}
      <path
        d="M23 14l3 2-3 2"
        stroke="#5FD9C2"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Arrow tip - bottom */}
      <path
        d="M21 22l3 2-3 2"
        stroke="#5FD9C2"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Start node */}
      <circle cx="6" cy="16" r="2" fill="#5FD9C2" fillOpacity="0.3" stroke="#5FD9C2" strokeWidth="1" />
    </svg>
  );
}

const iconMap: Record<string, () => React.ReactNode> = {
  unified: IconUnified,
  persona: IconPersona,
  routing: IconRouting,
};

/* ════════════════════════════════════════════════════════
   GLOBAL DEALER LEARNING CASE STUDY
   ════════════════════════════════════════════════════════ */

export default function GlobalDealerLearningCaseStudy() {
  return (
    <>
      {/* ═══════════════════ 1. HERO ═══════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundSize: "200% 200%",
          animation: "bgShift 16s ease-in-out infinite",
          backgroundImage:
            "linear-gradient(135deg, #040E28 0%, #0B0B3C 30%, #1A8A76 60%, #040E28 100%)",
          minHeight: "560px",
        }}
      >
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div
            className="absolute w-[600px] h-[600px] rounded-full opacity-[0.07] blur-[120px]"
            style={{
              background: "radial-gradient(circle, #0CF4DF, transparent 70%)",
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
              color: "#5FD9C2",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            Case Study / Technical Recruiting
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
            40 dealers. One platform.<br />Zero lost candidates.
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
            Unified recruiting across SkillsUSA and FFA. Qualified candidates routed to 40 dealers in real time.
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
                      fontSize: (stat as { numberSize?: string }).numberSize || "clamp(44px, 5vw, 64px)",
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
              Global Dealer Learning
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
                  color: "#5FD9C2",
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
                A national recruiting effort with no way to connect the dots.
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
                  Caterpillar&apos;s Global Dealer Learning group runs one of the largest technician recruiting programs in the industry. They attend SkillsUSA and FFA events nationwide, meeting thousands of students who are already interested in skilled trades careers.
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
                  But the gap between the event and the dealer was a dead zone. Candidates who expressed interest at a national event had no clear path to the local dealer who could actually hire them. Information was captured on paper or not at all.
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
                  Follow-up depended on someone remembering to pass a name along. Qualified candidates were falling through the gap between a national conversation and a local opportunity.
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
                      ["#5FD9C2", "#3AB8A0", "#1A8A76"][i]
                    }`,
                    boxShadow: "0 2px 12px rgba(95, 217, 194, 0.08)",
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
        {/* Subtle teal diagonal lines */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.08,
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 40px,
              #5FD9C2 40px,
              #5FD9C2 41px
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
                color: "#5FD9C2",
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
              One platform connecting events, schools, and dealers. Candidates routed in{"\u00A0"}real{"\u00A0"}time.
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
              Momentify gave GDL a unified recruiting platform that captured candidates at every event and routed them to the right dealer based on interest and location.
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
              style={{
                height: "360px",
                scrollSnapAlign: "start",
                background: "#E5E7EB",
              }}
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

      {/* ═══════════════════ 4. QUOTE 1 (dark gradient) ══════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundSize: "200% 200%",
          animation: "bgShift 16s ease-in-out infinite",
          backgroundImage:
            "linear-gradient(135deg, #040E28 0%, #0B0B3C 30%, #1A8A76 60%, #040E28 100%)",
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
                color: "#5FD9C2",
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
                  background: "rgba(95, 217, 194, 0.15)",
                  border: "2px solid rgba(95, 217, 194, 0.3)",
                }}
              >
                <span
                  style={{
                    color: "#5FD9C2",
                    fontWeight: 700,
                    fontSize: "18px",
                    fontFamily: "var(--font-inter)",
                  }}
                >
                  GD
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
                  Global Dealer Learning, Caterpillar
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ 5. RESULTS ═════════════════ */}
      <section style={{ background: "rgba(95, 217, 194, 0.07)", padding: "100px 0" }}>
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
                color: "#5FD9C2",
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
              <span className="text-gradient-brand" style={{ fontWeight: 600 }}>5,400+</span> opt-ins.<br /><span className="text-gradient-brand" style={{ fontWeight: 600 }}>40</span> dealers. <span className="text-gradient-brand" style={{ fontWeight: 600 }}>0</span> lost candidates.
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
              const accentColors = ["#5FD9C2", "#3AB8A0", "#1A8A76", "#00BBA5"];
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
                    fontSize: (cell as { numberSize?: string }).numberSize || "56px",
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
                    color: accentColors[i],
                    background: `${accentColors[i]}14`,
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

          {/* Results callout - full width */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={fadeUp}
            style={{
              marginTop: "24px",
              background: "linear-gradient(135deg, #040E28 0%, #0B0B3C 50%, #1A8A76 100%)",
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
                color: "#5FD9C2",
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
              By connecting national events to local dealers through a single platform, GDL established the benchmark for scalable, data-driven technician recruiting across the Caterpillar dealer network.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ 6. QUOTE 2 (white bg) ══════════ */}
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
                  GD
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
                  Global Dealer Learning, Caterpillar
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
            "linear-gradient(135deg, #040E28 0%, #0B0B3C 30%, #1A8A76 60%, #040E28 100%)",
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
                color: "#5FD9C2",
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
              Ready to unify your recruiting program?
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
              See how Momentify helps recruiting teams capture, qualify, and route candidates to the right teams in real time.
            </motion.p>

            {/* CTA pair */}
            <motion.div
              variants={fadeUp}
              className="flex flex-row gap-3 sm:gap-4"
            >
              {/* Primary */}
              <a
                href="/demo?source=case-study-global-dealer-learning"
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
                href="/rox/recruiting"
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
                Calculate Your Recruiting ROX™
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
