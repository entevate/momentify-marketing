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
  { number: "611", label: "Leads captured since June 2025" },
  { number: "7", label: "Hires directly attributed to Momentify" },
  { number: "2", label: "Separate candidate pipelines built from every event" },
];

/* ── Challenge cards ─────────────────────────────────── */

const challengeCards = [
  {
    label: "No digital capture",
    body: "Every candidate interaction left the event on paper or not at all. Contact information was scattered, unreliable, and hard to share with the team.",
  },
  {
    label: "No follow-up infrastructure",
    body: "Without a system, follow-up depended on memory. Candidates who showed real intent were falling through the gap between the booth and the inbox.",
  },
  {
    label: "No way to measure what worked",
    body: "Mustang Cat attended recurring events every year with no data to tell them which ones were producing results and which ones were not.",
  },
];

/* ── Solution tiles ──────────────────────────────────── */

const solutionTiles = [
  {
    headline: "Capture at the booth",
    body: "iPad and mobile QR registration gave every candidate a way to enter their information. When schools restricted phones, Sarah passed the iPad. When there was no Wi-Fi, Momentify worked offline and synced later.",
    icon: "ipad",
  },
  {
    headline: "Two pipelines from one event",
    body: "Students went into one pipeline toward Mustang Cat's Think Big program. Advisors and instructors went into a second pipeline for ongoing school relationships, presentations, and career fairs. One event, two fully tracked outcomes.",
    icon: "people",
  },
  {
    headline: "Follow-up before the floor closes",
    body: "Leads are scored by temperature, notes are attached to names, and follow-up goes out the same day the event ends. Candidates who showed real intent no longer wait days to hear back.",
    icon: "clock",
  },
];

/* ── Results grid ────────────────────────────────────── */

const resultsCells = [
  {
    type: "single" as const,
    number: "611",
    label:
      "Total leads captured via iPad and mobile QR code since June 2025",
    tag: "Lead Capture",
  },
  {
    type: "dual" as const,
    number1: "321",
    number2: "243",
    sub1: "Students",
    sub2: "Advisors and instructors",
    label: "Two distinct pipelines from the same events.",
    tag: "Dual Pipeline",
  },
  {
    type: "single" as const,
    number: "7",
    label:
      "Hires directly attributed to Momentify touchpoints. 9 candidates interviewed, 7 offers extended.",
    tag: "Hiring Outcomes",
  },
  {
    type: "single" as const,
    number: "10 / 10",
    numberSize: "42px",
    label:
      "Likelihood to recommend Momentify to other dealers, per Sarah's pilot survey response.",
    tag: "NPS",
  },
];

/* ── Icon components ─────────────────────────────────── */

function IconIpad() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="5"
        y="3"
        width="22"
        height="26"
        rx="3"
        stroke="#5FD9C2"
        strokeWidth="1.8"
      />
      <circle cx="16" cy="25" r="1.2" fill="#5FD9C2" />
      <line
        x1="9"
        y1="6"
        x2="23"
        y2="6"
        stroke="#5FD9C2"
        strokeWidth="1"
        strokeOpacity="0.3"
      />
    </svg>
  );
}

function IconPeople() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="11" cy="10" r="4" stroke="#5FD9C2" strokeWidth="1.8" />
      <path
        d="M3 24c0-4.418 3.582-7 8-7s8 2.582 8 7"
        stroke="#5FD9C2"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="22" cy="11" r="3" stroke="#5FD9C2" strokeWidth="1.5" strokeOpacity="0.6" />
      <path
        d="M25 24c0-3.314-2.239-5.5-5-6"
        stroke="#5FD9C2"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeOpacity="0.6"
      />
    </svg>
  );
}

function IconClock() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="16" cy="16" r="11" stroke="#5FD9C2" strokeWidth="1.8" />
      <polyline
        points="16,9 16,16 22,16"
        stroke="#5FD9C2"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M25 7l3-3M28 7l-3 0M25 4l0 3"
        stroke="#5FD9C2"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeOpacity="0.5"
      />
    </svg>
  );
}

const iconMap: Record<string, () => React.ReactNode> = {
  ipad: IconIpad,
  people: IconPeople,
  clock: IconClock,
};

/* ════════════════════════════════════════════════════════
   MUSTANG CAT CASE STUDY
   ════════════════════════════════════════════════════════ */

export default function MustangCatCaseStudy() {
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
              fontSize: "clamp(36px, 5.5vw, 72px)",
              color: "#FFFFFF",
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              maxWidth: "820px",
              marginBottom: "24px",
            }}
          >
            From paper sign-ups to a digital recruiting pipeline.
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
              maxWidth: "640px",
              marginBottom: "48px",
            }}
          >
            Before Momentify, Mustang Cat had no digital recruiting process. Candidate information left the event on paper or not at all. There was no tracking, no analytics, and no consistent follow-up. Here is how they changed that and built a system that captures, scores, and follows up with every candidate before the event floor closes.
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
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex items-center gap-3"
            style={{ marginTop: "40px" }}
          >
            <img
              src="/logos/mustang-cat-color.png"
              alt="Mustang Cat"
              style={{ maxHeight: "48px", width: "auto", opacity: 0.85 }}
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
              Senior Recruiter: Sarah Bell
            </span>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ 2. CHALLENGE ═══════════════ */}
      <section style={{ background: "#FFFFFF", padding: "100px 0" }}>
        <div className="mx-auto px-6 lg:px-12" style={{ maxWidth: "1100px" }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={headerVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20"
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
                A recruiter doing everything right, with no way to show it.
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
                  Sarah Bell has been recruiting diesel technicians for Mustang Cat for years. She shows up with energy, makes intentional connections, and genuinely believes in the career she is selling. But when she walked out of a career fair, everything she had built in those conversations walked out with her.
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
                  No digital capture. No notes attached to names. No way to sort hot leads from cold ones. No analytics to tell her which events were worth going back to. The follow-up happened on memory and hope.
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
                  Mustang Cat was not doing anything wrong. They simply had no infrastructure to hold what their recruiter was building.
                </p>
              </motion.div>
            </div>

            {/* Right column: challenge cards */}
            <motion.div
              variants={stagger}
              className="flex flex-col gap-4"
            >
              {challengeCards.map((card) => (
                <motion.div
                  key={card.label}
                  variants={fadeUp}
                  style={{
                    background: "#F8F9FC",
                    borderRadius: "12px",
                    padding: "24px 28px",
                    borderLeft: "3px solid rgba(6, 19, 65, 0.12)",
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
      <section style={{ background: "#F8F9FC", padding: "100px 0" }}>
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
              One platform. Two pipelines. Double the output from every event.
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
              Momentify gave Mustang Cat a way to capture candidates and advisors from the same event, score them by intent, and follow up before the competition did.
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

      {/* ═══════════════════ 4. SARAH QUOTE 1 ══════════ */}
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
              We were really leaving a large piece of the pie at the career fairs with not capturing any information. And now we&apos;re not just capturing it, but we&apos;re capturing it in the coolest way.
            </motion.p>

            {/* Attribution */}
            <motion.div
              variants={fadeUp}
              className="flex items-center justify-center gap-4"
              style={{ marginTop: "32px" }}
            >
              {/* Photo placeholder */}
              {/* <!-- Replace with Sarah Bell headshot when available --> */}
              <div
                className="rounded-full flex-shrink-0 overflow-hidden"
                style={{
                  width: "56px",
                  height: "56px",
                  border: "2px solid rgba(95, 217, 194, 0.3)",
                }}
              >
                <img
                  src="/sarahbell.jpeg"
                  alt="Sarah Bell"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
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
                  Sarah Bell
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontWeight: 400,
                    fontSize: "13px",
                    color: "rgba(255, 255, 255, 0.50)",
                  }}
                >
                  Senior Recruiter, Mustang Cat
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ 5. RESULTS ═════════════════ */}
      <section style={{ background: "#FFFFFF", padding: "100px 0" }}>
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
                fontSize: "42px",
                color: "#061341",
                lineHeight: 1.1,
                marginBottom: "64px",
              }}
            >
              611 leads captured. 7 hired. Zero clipboards.
            </motion.h2>
          </motion.div>

          {/* Results grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            style={{ maxWidth: "900px" }}
          >
            {resultsCells.map((cell) => (
              <motion.div
                key={cell.tag}
                variants={fadeUp}
                style={{
                  background: "#F8F9FC",
                  borderRadius: "16px",
                  padding: "36px 32px",
                }}
              >
                {cell.type === "dual" ? (
                  <>
                    <div className="flex items-baseline gap-2" style={{ marginBottom: "4px" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-inter)",
                          fontWeight: 500,
                          fontSize: "36px",
                          color: "#061341",
                        }}
                      >
                        {cell.number1}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-inter)",
                          fontWeight: 500,
                          fontSize: "36px",
                          color: "#061341",
                          opacity: 0.3,
                        }}
                      >
                        +
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-inter)",
                          fontWeight: 500,
                          fontSize: "36px",
                          color: "#061341",
                        }}
                      >
                        {cell.number2}
                      </span>
                    </div>
                    <div className="flex gap-6" style={{ marginBottom: "8px" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-inter)",
                          fontWeight: 400,
                          fontSize: "13px",
                          color: "rgba(6, 19, 65, 0.40)",
                        }}
                      >
                        {cell.sub1}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-inter)",
                          fontWeight: 400,
                          fontSize: "13px",
                          color: "rgba(6, 19, 65, 0.40)",
                        }}
                      >
                        {cell.sub2}
                      </span>
                    </div>
                  </>
                ) : (
                  <p
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontWeight: 500,
                      fontSize: (cell as { numberSize?: string }).numberSize || "52px",
                      color: "#061341",
                      lineHeight: 1,
                      marginBottom: "12px",
                    }}
                  >
                    {cell.number}
                  </p>
                )}

                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontWeight: 400,
                    fontSize: "14px",
                    color: "rgba(6, 19, 65, 0.50)",
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
                    color: "#5FD9C2",
                    background: "rgba(95, 217, 194, 0.10)",
                    borderRadius: "20px",
                    padding: "4px 10px",
                  }}
                >
                  {cell.tag}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Pilot survey callout */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={fadeUp}
            style={{
              marginTop: "48px",
              maxWidth: "820px",
              background: "rgba(95, 217, 194, 0.08)",
              border: "1px solid rgba(95, 217, 194, 0.15)",
              borderRadius: "12px",
              padding: "28px 32px",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 600,
                fontSize: "10px",
                color: "#5FD9C2",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: "12px",
              }}
            >
              From the Pilot Survey
            </p>
            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 400,
                fontSize: "15px",
                color: "rgba(6, 19, 65, 0.65)",
                lineHeight: 1.7,
                fontStyle: "italic",
              }}
            >
              When asked what Momentify would cost Mustang Cat if it went away: &ldquo;We&apos;d go back to relying on paper sign-ups, spreadsheets, or memory at events, which risks losing high-quality prospects and creates gaps in our recruiting funnel. Candidates would wait longer for follow-up, which could mean losing them to other opportunities.&rdquo;
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ 6. SARAH QUOTE 2 ══════════ */}
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
              &ldquo;We didn&apos;t track anything. We didn&apos;t have anything to compare to. Having analytics to show how many people we&apos;re reaching, how many hot leads we have, is a game changer, especially coming from a company who didn&apos;t track anything.&rdquo;
            </motion.p>

            {/* Attribution */}
            <motion.div
              variants={fadeUp}
              className="flex items-center justify-center gap-4"
              style={{ marginTop: "32px" }}
            >
              {/* <!-- Replace with Sarah Bell headshot when available --> */}
              <div
                className="rounded-full flex-shrink-0 overflow-hidden"
                style={{
                  width: "56px",
                  height: "56px",
                  border: "2px solid rgba(6, 19, 65, 0.15)",
                }}
              >
                <img
                  src="/sarahbell.jpeg"
                  alt="Sarah Bell"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
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
                  Sarah Bell
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontWeight: 400,
                    fontSize: "13px",
                    color: "rgba(6, 19, 65, 0.50)",
                  }}
                >
                  Senior Recruiter, Mustang Cat
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ 7. PODCAST CTA ═════════════ */}
      <section style={{ background: "#F8F9FC", padding: "80px 0" }}>
        <div className="mx-auto px-6 lg:px-12" style={{ maxWidth: "900px" }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={headerVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16"
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
                Moments That Matter Podcast
              </motion.p>

              <motion.h3
                variants={fadeUp}
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 700,
                  fontSize: "28px",
                  color: "#061341",
                  marginBottom: "16px",
                }}
              >
                Hear the full story from Sarah.
              </motion.h3>

              <motion.p
                variants={fadeUp}
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 400,
                  fontSize: "15px",
                  color: "rgba(6, 19, 65, 0.55)",
                  lineHeight: 1.7,
                  marginBottom: "28px",
                }}
              >
                Sarah joined Jake on the Moments That Matter podcast to talk about what recruiting actually looks like on the floor, how attention has shifted, and what it takes to create a conversation a candidate remembers. It is worth 30 minutes of your time.
              </motion.p>

              <motion.a
                variants={fadeUp}
                href="#" /* <!-- Replace with actual podcast episode URL --> */
                className="inline-flex items-center gap-2 transition-all duration-200 hover:underline"
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 600,
                  fontSize: "15px",
                  color: "#5FD9C2",
                  textDecoration: "none",
                }}
              >
                Listen to Episode 004 →
              </motion.a>
            </div>

            {/* Right column: podcast card */}
            <motion.div
              variants={fadeUp}
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(6, 19, 65, 0.08)",
                borderRadius: "14px",
                padding: "28px",
                boxShadow: "0 2px 12px rgba(6, 19, 65, 0.06)",
              }}
            >
              {/* Episode pill */}
              <span
                style={{
                  display: "inline-block",
                  fontFamily: "var(--font-inter)",
                  fontWeight: 600,
                  fontSize: "11px",
                  color: "#5FD9C2",
                  background: "rgba(95, 217, 194, 0.10)",
                  borderRadius: "20px",
                  padding: "4px 12px",
                  marginBottom: "16px",
                }}
              >
                Episode 004
              </span>

              <h4
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 700,
                  fontSize: "16px",
                  color: "#061341",
                  lineHeight: 1.4,
                  marginBottom: "12px",
                }}
              >
                Sarah Bell — Recruiting in the Skilled Trades: Intentional Conversations and the Long Game
              </h4>

              <p
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 400,
                  fontSize: "13px",
                  color: "rgba(6, 19, 65, 0.50)",
                  lineHeight: 1.6,
                  marginBottom: "20px",
                }}
              >
                Sarah Bell, Senior Recruiter at Mustang Cat, on what it takes to recruit diesel technicians, why candidates now have the upper hand, and how showing up with intention changes everything.
              </p>

              {/* Play button */}
              <a
                href="#" /* <!-- Replace with actual podcast URL --> */
                className="inline-flex items-center gap-2.5 transition-opacity duration-200 hover:opacity-70"
                style={{ textDecoration: "none" }}
              >
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: "32px",
                    height: "32px",
                    background: "#061341",
                  }}
                >
                  <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
                    <path d="M1 1L11 7L1 13V1Z" fill="#FFFFFF" />
                  </svg>
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontWeight: 600,
                    fontSize: "13px",
                    color: "#061341",
                  }}
                >
                  Listen Now
                </span>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ 8. FINAL CTA ══════════════ */}
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
              Ready to build a recruiting process like this?
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
              See how Momentify helps recruiting teams capture, score, and follow up with candidates before the competition does.
            </motion.p>

            {/* CTA pair */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row items-start gap-4"
            >
              {/* Primary */}
              <a
                href="#demo"
                className="inline-block transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 600,
                  fontSize: "14px",
                  color: "#FFFFFF",
                  background: "linear-gradient(135deg, #00BBA5, #1A56DB)",
                  padding: "14px 32px",
                  borderRadius: "8px",
                  letterSpacing: "-0.01em",
                }}
              >
                Schedule a Demo
              </a>

              {/* Secondary */}
              <a
                href="#rox"
                className="inline-block transition-all duration-200"
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 500,
                  fontSize: "14px",
                  color: "#FFFFFF",
                  background: "transparent",
                  padding: "13px 28px",
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
                Calculate Your Recruiting ROX
              </a>
            </motion.div>

            {/* Trust line */}
            <motion.p
              variants={fadeUp}
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 400,
                fontSize: "13px",
                color: "rgba(255, 255, 255, 0.35)",
                marginTop: "28px",
              }}
            >
              No contracts. No IT procurement. Deploy in days.
            </motion.p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
