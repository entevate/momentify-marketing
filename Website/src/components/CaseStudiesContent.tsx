"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import FinalCTA from "@/components/FinalCTA";

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

/* ── Shared constants ──────────────────────────────── */

const mainMinimal =
  "linear-gradient(135deg, #7C316D 0%, #0B0B3C 55%, #1A2E73 100%)";

const TEAL = "#00BBA5";
const DEEP_NAVY = "#061341";

/* ── Main-Minimal SVG overlay ──────────────────────── */

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

/* ── Data: Categories ──────────────────────────────── */

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "trade-shows", label: "Trade Shows" },
  { id: "recruiting", label: "Technical Recruiting" },
  { id: "venues", label: "Venues & Events" },
  { id: "field-sales", label: "Field Sales" },
  { id: "facilities", label: "Facilities" },
] as const;

type CategoryId = (typeof CATEGORIES)[number]["id"];

/* ── Vertical color map ─────────────────────────────── */

const VERTICAL_COLORS: Record<string, { pill: string; pillBg: string }> = {
  "trade-shows": { pill: "#9B5FE8", pillBg: "rgba(155,95,232,0.1)" },
  recruiting: { pill: "#1A8A76", pillBg: "rgba(0,187,165,0.1)" },
  venues: { pill: "#F25E3D", pillBg: "rgba(242,94,61,0.1)" },
  "field-sales": { pill: "#C48A00", pillBg: "rgba(196,138,0,0.1)" },
  facilities: { pill: "#5B4499", pillBg: "rgba(91,68,153,0.1)" },
};

/* ── Data: Case Studies ─────────────────────────────── */

interface CaseStudy {
  name: string;
  category: Exclude<CategoryId, "all">;
  headline: string;
  description: string;
  logo?: string;
  stats?: { value: string; label: string }[];
  href?: string;
  published: boolean;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    name: "Mustang CAT",
    category: "recruiting",
    headline: "Paper sign-ups out. Digital pipeline in.",
    description:
      "How Mustang CAT transformed technical recruiting from paper sign-ups to a digital pipeline capturing 600+ candidates across career fairs and school visits.",
    logo: "/logos/mustang-cat-color.png",
    stats: [
      { value: "600+", label: "Candidates" },
      { value: "7", label: "Hires" },
      { value: "10/10", label: "NPS" },
    ],
    href: "/case-studies/mustang-cat",
    published: true,
  },
  {
    name: "Caterpillar at DistribuTECH",
    category: "trade-shows",
    headline: "92% more leads at the same event, three years running.",
    description:
      "How Caterpillar's Electric Power Division used Momentify across three consecutive years at DistribuTECH to grow leads by 92% with better data every time.",
    logo: "/logos/caterpillar-logo_black.png",
    stats: [
      { value: "92%", label: "Lead Growth" },
      { value: "1,952", label: "Companies" },
      { value: "544", label: "Follow-ups" },
    ],
    href: "/case-studies/distributech",
    published: true,
  },
  {
    name: "Caterpillar Global Dealer Learning",
    category: "recruiting",
    headline: "40 dealers. One platform. Zero lost candidates.",
    description:
      "Caterpillar's Global Dealer Learning group used Momentify at national student events to match technician candidates to the right dealers by interest and fit.",
    logo: "/logos/caterpillar-logo_black.png",
    stats: [
      { value: "5,400+", label: "Opt-ins" },
      { value: "40", label: "Dealers" },
      { value: "0", label: "Lost Candidates" },
    ],
    href: "/case-studies/global-dealer-learning",
    published: true,
  },
  {
    name: "Venues & Events",
    category: "venues",
    headline: "Case study coming soon.",
    description: "A detailed look at how Momentify powers engagement capture for venues and events teams.",
    published: false,
  },
  {
    name: "Field Sales",
    category: "field-sales",
    headline: "Case study coming soon.",
    description: "A detailed look at how Momentify powers engagement capture for field sales teams.",
    published: false,
  },
  {
    name: "Facilities",
    category: "facilities",
    headline: "Case study coming soon.",
    description: "A detailed look at how Momentify powers engagement capture for facility teams.",
    published: false,
  },
];

/* ── Hero graphic: abstract stat cards ──────────────── */

const CaseStudyGraphic = () => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[500px]">
    <defs>
      <linearGradient id="csCardGrad1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="rgba(0,187,165,0.25)" />
        <stop offset="100%" stopColor="rgba(26,86,219,0.15)" />
      </linearGradient>
      <linearGradient id="csCardGrad2" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="rgba(124,49,109,0.3)" />
        <stop offset="100%" stopColor="rgba(26,46,115,0.2)" />
      </linearGradient>
      <filter id="csGlow">
        <feGaussianBlur stdDeviation="20" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    {/* Glow */}
    <circle cx="200" cy="200" r="80" fill="rgba(0,187,165,0.08)" filter="url(#csGlow)" />

    {/* Card 1 - back */}
    <g transform="rotate(-6 200 200)">
      <rect x="80" y="100" width="240" height="140" rx="16" fill="url(#csCardGrad2)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <rect x="100" y="125" width="60" height="8" rx="4" fill="rgba(255,255,255,0.15)" />
      <rect x="100" y="145" width="180" height="6" rx="3" fill="rgba(255,255,255,0.08)" />
      <rect x="100" y="160" width="140" height="6" rx="3" fill="rgba(255,255,255,0.06)" />
      <text x="100" y="205" fontFamily="var(--font-inter)" fontWeight="600" fontSize="28" fill="rgba(0,187,165,0.5)">92%</text>
      <text x="160" y="205" fontFamily="var(--font-inter)" fontWeight="600" fontSize="28" fill="rgba(255,255,255,0.2)">600+</text>
    </g>

    {/* Card 2 - front */}
    <g transform="rotate(3 200 220)">
      <rect x="95" y="170" width="240" height="140" rx="16" fill="url(#csCardGrad1)" stroke="rgba(0,187,165,0.2)" strokeWidth="1" />
      <rect x="115" y="195" width="80" height="8" rx="4" fill="rgba(255,255,255,0.2)" />
      <rect x="115" y="215" width="180" height="6" rx="3" fill="rgba(255,255,255,0.1)" />
      <rect x="115" y="230" width="150" height="6" rx="3" fill="rgba(255,255,255,0.07)" />

      {/* Stat chips */}
      <rect x="115" y="255" width="55" height="28" rx="8" fill="rgba(0,187,165,0.15)" stroke="rgba(0,187,165,0.2)" strokeWidth="0.5" />
      <text x="142" y="274" fontFamily="var(--font-inter)" fontWeight="600" fontSize="12" fill="rgba(0,187,165,0.7)" textAnchor="middle">7 Hires</text>

      <rect x="180" y="255" width="55" height="28" rx="8" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
      <text x="207" y="274" fontFamily="var(--font-inter)" fontWeight="600" fontSize="12" fill="rgba(255,255,255,0.35)" textAnchor="middle">10/10</text>

      <rect x="245" y="255" width="70" height="28" rx="8" fill="rgba(155,95,232,0.12)" stroke="rgba(155,95,232,0.2)" strokeWidth="0.5" />
      <text x="280" y="274" fontFamily="var(--font-inter)" fontWeight="600" fontSize="12" fill="rgba(155,95,232,0.6)" textAnchor="middle">1,952</text>
    </g>

    {/* Floating accent dots */}
    <circle cx="60" cy="160" r="4" fill="rgba(0,187,165,0.25)" />
    <circle cx="350" cy="280" r="3" fill="rgba(155,95,232,0.2)" />
    <circle cx="340" cy="130" r="5" fill="rgba(0,187,165,0.15)" />
    <circle cx="70" cy="310" r="3.5" fill="rgba(124,49,109,0.2)" />
  </svg>
);

/* ── Main component ──────────────────────────────────── */

export default function CaseStudiesContent() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");

  const filtered =
    activeCategory === "all"
      ? CASE_STUDIES
      : CASE_STUDIES.filter((cs) => cs.category === activeCategory);

  const activeLabel =
    CATEGORIES.find((c) => c.id === activeCategory)?.label ?? "";

  return (
    <>
      {/* ═══════════════════ 1. HERO ═══════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundImage: mainMinimal,
          backgroundSize: "200% 200%",
          animation: "bgShift 16s ease-in-out infinite",
          minHeight: "540px",
        }}
      >
        <MainMinimalOverlay />

        {/* Ambient orbs */}
        <div
          className="pointer-events-none absolute"
          style={{
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, rgba(0,187,165,0.08) 0%, transparent 70%)",
            top: "-100px",
            right: "-100px",
            animation: "ambientFloat1 20s ease-in-out infinite",
          }}
        />
        <div
          className="pointer-events-none absolute"
          style={{
            width: "400px",
            height: "400px",
            background: "radial-gradient(circle, rgba(124,49,109,0.1) 0%, transparent 70%)",
            bottom: "-80px",
            left: "-60px",
            animation: "ambientFloat2 25s ease-in-out infinite",
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12 flex items-center" style={{ minHeight: "540px" }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: text content */}
            <div>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 600,
                  fontSize: "11px",
                  color: TEAL,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase" as const,
                  marginBottom: "16px",
                }}
              >
                Customer Stories
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.18 }}
                className="leading-[1.05]"
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 500,
                  fontSize: "clamp(34px, 5vw, 52px)",
                  color: "#FFFFFF",
                  letterSpacing: "-0.02em",
                  marginBottom: "24px",
                }}
              >
                Case Studies
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.24 }}
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 300,
                  fontSize: "15px",
                  color: "rgba(255, 255, 255, 0.55)",
                  lineHeight: 1.5,
                  maxWidth: "680px",
                }}
              >
                See how teams use Momentify to capture engagement, prove ROI, and turn every interaction into structured pipeline data.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.32 }}
                className="flex flex-row gap-3 sm:gap-4"
                style={{ marginTop: "32px" }}
              >
                <a
                  href="/demo?source=case-studies"
                  className="inline-flex items-center justify-center flex-1 sm:flex-initial sm:min-w-[200px] text-[12px] sm:text-[14px] py-2.5 sm:py-3.5 px-3 sm:px-7 transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
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
                <a
                  href="#case-studies-grid"
                  className="inline-flex items-center justify-center flex-1 sm:flex-initial sm:min-w-[200px] text-[12px] sm:text-[14px] py-2.5 sm:py-3.5 px-3 sm:px-7 transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontWeight: 500,
                    color: "#FFFFFF",
                    background: "transparent",
                    borderRadius: "8px",
                    border: "1.5px solid rgba(255, 255, 255, 0.20)",
                  }}
                >
                  Browse Case Studies
                </a>
              </motion.div>
            </div>

            {/* Right: abstract graphic */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="hidden lg:flex items-center justify-center"
              style={{ marginTop: "10px" }}
            >
              <CaseStudyGraphic />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ 2. FILTER BAR ═══════════════════ */}
      <section id="case-studies-grid" style={{ background: "#F8F9FC", paddingTop: "48px" }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex gap-3 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible sm:pb-0"
          >
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className="flex-shrink-0 transition-all duration-200 cursor-pointer"
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontWeight: 600,
                    fontSize: "13px",
                    color: isActive ? "#FFFFFF" : "rgba(6,19,65,0.45)",
                    background: isActive ? TEAL : "transparent",
                    border: isActive
                      ? `1px solid ${TEAL}`
                      : "1px solid rgba(6,19,65,0.12)",
                    padding: "8px 20px",
                    borderRadius: "20px",
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            style={{
              fontFamily: "var(--font-inter)",
              fontWeight: 500,
              fontSize: "13px",
              color: "rgba(6, 19, 65, 0.45)",
              marginTop: "24px",
            }}
          >
            Showing {filtered.length}{" "}
            {activeCategory === "all"
              ? `case ${filtered.length !== 1 ? "studies" : "study"}`
              : `${activeLabel} case ${filtered.length !== 1 ? "studies" : "study"}`}
          </motion.p>
        </div>
      </section>

      {/* ═══════════════════ 3. CASE STUDY CARDS ═══════════════════ */}
      <section style={{ background: "#F8F9FC", padding: "48px 0 80px" }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
              variants={stagger}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {filtered.map((cs) => {
                const colors = VERTICAL_COLORS[cs.category] ?? {
                  pill: TEAL,
                  pillBg: "rgba(0,187,165,0.1)",
                };
                const catLabel =
                  CATEGORIES.find((c) => c.id === cs.category)?.label ?? "";

                return (
                  <motion.div
                    key={cs.name}
                    variants={fadeUp}
                    className={`transition-all duration-200 ${cs.published ? "hover:-translate-y-1" : ""}`}
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid rgba(6,19,65,0.08)",
                      borderRadius: "16px",
                      padding: "32px 28px",
                      boxShadow: "0 4px 24px rgba(6,19,65,0.04)",
                      opacity: cs.published ? 1 : 0.6,
                    }}
                  >
                    {/* Logo area */}
                    <div
                      style={{
                        marginBottom: "16px",
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {cs.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={cs.logo}
                          alt={`${cs.name} logo`}
                          style={{
                            height: "32px",
                            width: "auto",
                            maxWidth: "140px",
                          }}
                        />
                      ) : (
                        <span
                          style={{
                            fontFamily: "var(--font-inter)",
                            fontWeight: 600,
                            fontSize: "13px",
                            color: cs.published
                              ? "rgba(6,19,65,0.35)"
                              : "rgba(6,19,65,0.2)",
                            letterSpacing: "0.06em",
                            textTransform: "uppercase" as const,
                          }}
                        >
                          {cs.published ? cs.name : "Partner Logo"}
                        </span>
                      )}
                    </div>

                    {/* Headline */}
                    <p
                      style={{
                        fontFamily: "var(--font-inter)",
                        fontWeight: 500,
                        fontSize: "18px",
                        color: DEEP_NAVY,
                        marginBottom: "10px",
                        lineHeight: 1.3,
                      }}
                    >
                      {cs.headline}
                    </p>

                    {/* Vertical pill */}
                    <span
                      style={{
                        display: "inline-block",
                        fontFamily: "var(--font-inter)",
                        fontWeight: 600,
                        fontSize: "10px",
                        color: colors.pill,
                        background: colors.pillBg,
                        borderRadius: "20px",
                        padding: "3px 10px",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase" as const,
                        marginBottom: "14px",
                      }}
                    >
                      {catLabel}
                    </span>

                    {/* Description */}
                    <p
                      style={{
                        fontFamily: "var(--font-inter)",
                        fontWeight: 400,
                        fontSize: "14px",
                        color: "rgba(6,19,65,0.55)",
                        lineHeight: 1.6,
                        marginBottom: cs.stats ? "20px" : "16px",
                      }}
                    >
                      {cs.description}
                    </p>

                    {/* Stats row */}
                    {cs.stats && (
                      <div
                        className="flex flex-wrap gap-2"
                        style={{ marginBottom: "20px" }}
                      >
                        {cs.stats.map((stat) => (
                          <span
                            key={stat.label}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "5px",
                              fontFamily: "var(--font-inter)",
                              fontSize: "12px",
                              color: "rgba(6,19,65,0.5)",
                              background: "rgba(6,19,65,0.04)",
                              borderRadius: "8px",
                              padding: "5px 10px",
                            }}
                          >
                            <span
                              style={{
                                fontWeight: 700,
                                color: TEAL,
                                fontSize: "13px",
                              }}
                            >
                              {stat.value}
                            </span>
                            <span style={{ fontWeight: 400 }}>
                              {stat.label}
                            </span>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* CTA */}
                    {cs.published && cs.href ? (
                      <a
                        href={cs.href}
                        className="inline-flex items-center gap-1.5 transition-all duration-200 hover:gap-2.5"
                        style={{
                          fontFamily: "var(--font-inter)",
                          fontWeight: 600,
                          fontSize: "13px",
                          color: TEAL,
                        }}
                      >
                        Read Case Study
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12h14" />
                          <path d="M12 5l7 7-7 7" />
                        </svg>
                      </a>
                    ) : (
                      <span
                        style={{
                          fontFamily: "var(--font-inter)",
                          fontWeight: 500,
                          fontSize: "12px",
                          color: "rgba(6,19,65,0.3)",
                          letterSpacing: "0.06em",
                          textTransform: "uppercase" as const,
                        }}
                      >
                        Coming Soon
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ═══════════════════ 4. FINAL CTA ═══════════════════ */}
      <FinalCTA />
    </>
  );
}
