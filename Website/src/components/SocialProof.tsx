"use client";

import { motion } from "framer-motion";

/* ── Animation variants (match existing pattern) ───── */

const headerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ── Stats data ────────────────────────────────────── */

const stats = [
  { number: "10,000+", label: "Leads captured (with more than just a badge scan) across 50 events in 18 months" },
  { number: "65%+", label: "Of captured leads qualified for follow-up, versus an industry average below 20%" },
  { number: "$411M", label: "Potential pipeline value delivered to customers and dealers" },
];

/* ── Outcome cards data ────────────────────────────── */

const outcomes = [
  {
    logo: "/logos/caterpillar-logo_black.png",
    logoAlt: "Caterpillar",
    headline: "92% more leads across three consecutive years at the same industry event.",
    body: "The Electric Power Division used Momentify across three consecutive years at DistribuTECH. Same booth. Same show. Better data every time. Engagement depth, opt-in rates, and follow-up speed all improved year over year. The results compounded because the team could finally see what was working and what was not.",
    tags: ["Trade Shows and Exhibits"],
    link: "#",
  },
  {
    logo: "/logos/mustang-cat-color.png",
    logoAlt: "Mustang CAT",
    headline: "7 hires traced back to a digital recruiting process that did not exist a year ago.",
    body: "This dealer had no digital recruiting process before Momentify. Every candidate interaction left on paper or not at all. Now every student and advisor engagement is captured on iPad and mobile, scored by fit, and followed up with context attached. The pipeline built itself because the data was finally there.",
    tags: ["Technical Recruiting"],
    link: "/case-studies/mustang-cat",
  },
  {
    logo: "/logos/caterpillar-logo_black.png",
    logoAlt: "Caterpillar",
    headline: "40 dealers received matched candidates from a single national recruiting program.",
    body: "The Global Dealer Learning group used Momentify at national student events to identify technician candidates and route them to the right dealers. Students were matched by interest and fit before anyone left the floor. What used to end with a stack of business cards ended with qualified candidates delivered automatically.",
    tags: ["Technical Recruiting", "Trade Shows and Exhibits"],
    link: "#",
  },
];


/* ── Tag color map (matches Platform solution colors) ── */

const tagColors: Record<string, { color: string; bg: string }> = {
  "Trade Shows and Exhibits": { color: "#6B21D4", bg: "rgba(107, 33, 212, 0.08)" },
  "Technical Recruiting": { color: "#1A8A76", bg: "rgba(95, 217, 194, 0.10)" },
  "Field Sales Enablement": { color: "#A86B00", bg: "rgba(242, 179, 61, 0.10)" },
  "Facilities": { color: "#3A2073", bg: "rgba(58, 32, 115, 0.08)" },
  "Events and Venues": { color: "#C4391E", bg: "rgba(242, 94, 61, 0.08)" },
};

/* ── Social Proof Section ──────────────────────────── */

export default function SocialProof() {
  return (
    <section
      id="proof"
      className="relative py-16 sm:py-24 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #F5F6F8 100%)" }}
    >
      {/* Brand geometric pattern (match Problem/Platform) */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMaxYMax slice"
        aria-hidden="true"
      >
        <path
          d="M1440 900 L1440 324 L1008 0 L528 0 L1056 396 L1056 900 Z"
          fill="#254FE5"
          fillOpacity="0.04"
        />
        <path
          d="M1440 900 L1440 540 L912 144 L432 144 L912 504 L912 900 Z"
          fill="#1F3395"
          fillOpacity="0.03"
        />
      </svg>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">

        {/* ── Section header (left-aligned) ────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={headerVariants}
        >
          <motion.p
            variants={fadeUp}
            className="uppercase font-semibold text-[12px] tracking-[0.14em] mb-4"
            style={{ color: "#00BBA5", fontFamily: "var(--font-inter)" }}
          >
            Results
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
            Real teams. Real interactions. Real outcomes.
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
            Momentify is active across trade shows, recruiting events, field visits, and facilities. Here is what teams are actually seeing.
          </motion.p>
        </motion.div>

        {/* ── Stat row ─────────────────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={fadeUp}
          className="mt-16 flex flex-col sm:flex-row items-start sm:items-center gap-8 sm:gap-0"
        >
          {stats.map((stat, i) => (
            <div key={stat.number} className="flex items-center">
              {i > 0 && (
                <div
                  className="hidden sm:block"
                  style={{
                    width: "1px",
                    height: "48px",
                    background: "rgba(6, 19, 65, 0.10)",
                    marginLeft: "36px",
                    marginRight: "36px",
                  }}
                />
              )}
              <div>
                <p
                  className="text-gradient-brand"
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
                    fontWeight: 300,
                    fontSize: "13px",
                    color: "rgba(6, 19, 65, 0.50)",
                    lineHeight: 1.4,
                    maxWidth: "280px",
                  }}
                >
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── Outcome cards ────────────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
          className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {outcomes.map((card) => (
            <motion.div
              key={card.headline}
              variants={fadeUp}
              className="group flex flex-col rounded-2xl transition-all duration-200 hover:-translate-y-1"
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(6, 19, 65, 0.08)",
                padding: "32px 28px",
                boxShadow: "0 2px 12px rgba(6, 19, 65, 0.04)",
              }}
            >
              {/* Logo or pill tag */}
              <div style={{ minHeight: "32px", display: "flex", alignItems: "center" }}>
                {card.logo ? (
                  <img
                    src={card.logo}
                    alt={card.logoAlt}
                    className=""
                    style={{ maxHeight: "32px", width: "auto" }}
                  />
                ) : (
                  <span
                    style={{
                      display: "inline-block",
                      fontFamily: "var(--font-inter)",
                      fontWeight: 600,
                      fontSize: "13px",
                      letterSpacing: "0.02em",
                      color: "#061341",
                      background: "rgba(6, 19, 65, 0.08)",
                      borderRadius: "20px",
                      padding: "6px 16px",
                    }}
                  >
                    {card.logoAlt}
                  </span>
                )}
              </div>

              {/* Divider */}
              <div
                style={{
                  height: "1px",
                  background: "rgba(6, 19, 65, 0.08)",
                  margin: "20px 0",
                }}
              />

              {/* Outcome headline */}
              <h3
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 500,
                  fontSize: "18px",
                  color: "#061341",
                  lineHeight: 1.25,
                  letterSpacing: "-0.01em",
                  marginBottom: "12px",
                }}
              >
                {card.headline}
              </h3>

              {/* Outcome body */}
              <p
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 300,
                  fontSize: "14px",
                  color: "rgba(6, 19, 65, 0.55)",
                  lineHeight: 1.65,
                  marginBottom: "20px",
                  flex: 1,
                }}
              >
                {card.body}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {card.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontWeight: 600,
                      fontSize: "10px",
                      letterSpacing: "0.08em",
                      color: tagColors[tag]?.color ?? "#00BBA5",
                      background: tagColors[tag]?.bg ?? "rgba(0, 187, 165, 0.08)",
                      borderRadius: "20px",
                      padding: "4px 10px",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Learn More */}
              <a
                href={item.link}
                className="inline-flex items-center gap-1 mt-5 group/link"
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 500,
                  fontSize: "13px",
                  color: "#00BBA5",
                  textDecoration: "none",
                }}
              >
                Learn More
                <span className="inline-block transition-transform duration-200 group-hover/link:translate-x-1">→</span>
              </a>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
