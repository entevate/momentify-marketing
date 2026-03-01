"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/* ── Score tiers ─────────────────────────────────────── */

const tiers = [
  { color: "#E5484D", name: "Critical Gap", description: "Events are costing more than they're delivering." },
  { color: "#F2B33D", name: "Needs Optimization", description: "You're capturing some value, but leaving ROI on the table." },
  { color: "#5FD9C2", name: "High ROX", description: "Above average performance with room to fine-tune." },
  { color: "#0CF4DF", name: "Elite ROX", description: "Highly optimized across every category." },
];

/* ── Stat card data with target values ───────────────── */

const statCards = [
  {
    label: "Lead Capture Efficiency",
    description: "What percentage of visitors became leads.",
    target: 78,
    suffix: "%",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0CF4DF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: "Engagement Quality",
    description: "How deeply each person interacted with your content.",
    target: 65,
    suffix: "%",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0CF4DF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="2 12 5 9 8 14 11 8 14 13 17 6 20 11 22 9" />
      </svg>
    ),
  },
  {
    label: "Follow-Up Speed",
    description: "How quickly your team responded after the event.",
    target: 71,
    suffix: "%",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0CF4DF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    label: "Conversion Effectiveness",
    description: "How many leads became meetings, hires, or deals.",
    target: 68,
    suffix: "%",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0CF4DF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 22 22 22" />
        <line x1="12" y1="10" x2="12" y2="15" />
      </svg>
    ),
  },
];

/* ── Scenarios for cycling animation ─────────────────── */

const scenarios = [
  { score: 72, cards: [78, 65, 71, 68] },
  { score: 45, cards: [52, 38, 48, 42] },
  { score: 89, cards: [92, 85, 88, 91] },
];

function getTierColor(value: number): string {
  if (value >= 85) return "#0CF4DF";
  if (value >= 70) return "#5FD9C2";
  if (value >= 40) return "#F2B33D";
  return "#E5484D";
}

function getTierName(value: number): string {
  if (value >= 85) return "ELITE ROX";
  if (value >= 70) return "HIGH ROX";
  if (value >= 40) return "NEEDS OPTIMIZATION";
  return "CRITICAL GAP";
}

/* ── Category rows for body copy block ───────────────── */

const categories = [
  {
    label: "Lead Capture Efficiency",
    description: "What percentage of visitors became leads.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0CF4DF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: "Engagement Quality",
    description: "How deeply each person interacted with your content.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0CF4DF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="2 12 5 9 8 14 11 8 14 13 17 6 20 11 22 9" />
      </svg>
    ),
  },
  {
    label: "Follow-Up Speed",
    description: "How quickly your team responded after the event.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0CF4DF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    label: "Conversion Effectiveness",
    description: "How many leads became meetings, hires, or deals.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0CF4DF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 22 22 22" />
        <line x1="12" y1="10" x2="12" y2="15" />
      </svg>
    ),
  },
];

/* ── Calculator cards ────────────────────────────────── */

const calculatorCards = [
  {
    name: "Trade Shows and Exhibits",
    description: "Measure booth performance across lead capture, engagement, and conversion.",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="#0CF4DF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="10" width="28" height="18" rx="2" />
        <line x1="18" y1="4" x2="18" y2="10" />
        <line x1="10" y1="7" x2="18" y2="4" />
        <line x1="26" y1="7" x2="18" y2="4" />
        <line x1="10" y1="28" x2="10" y2="32" />
        <line x1="26" y1="28" x2="26" y2="32" />
      </svg>
    ),
  },
  {
    name: "Technical Recruiting",
    description: "Score your recruiting events on candidate quality and follow-up speed.",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="#0CF4DF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="15" cy="12" r="6" />
        <path d="M5 30c0-5.523 4.477-10 10-10s10 4.477 10 10" />
        <polyline points="25 16 28 19 33 13" />
      </svg>
    ),
  },
  {
    name: "Field Sales",
    description: "Measure rep-level engagement across job sites, facilities, and customer visits.",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="#0CF4DF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="14" cy="14" r="4" />
        <path d="M14 18c-4 0-8 3-8 8" />
        <circle cx="26" cy="24" r="4" />
        <line x1="14" y1="18" x2="26" y2="20" />
        <line x1="26" y1="28" x2="26" y2="32" />
      </svg>
    ),
  },
  {
    name: "Facilities and Venues",
    description: "Track interaction depth across showrooms, demo floors, and training centers.",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="#0CF4DF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="14" width="24" height="18" rx="2" />
        <polyline points="6 14 18 6 30 14" />
        <rect x="14" y="22" width="8" height="10" />
      </svg>
    ),
  },
];

/* ── Gauge SVG component ─────────────────────────────── */

function ROXGauge({ animatedScore }: { animatedScore: number }) {
  const cx = 200;
  const cy = 200;
  const r = 140;

  const polarToCart = (angleDeg: number) => {
    const rad = (Math.PI * (180 - angleDeg)) / 180;
    return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
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
    { start: 151.2, end: 180, color: "#0CF4DF" },
  ];

  const needleAngle = (animatedScore / 100) * 180;
  const needleEnd = polarToCart(needleAngle);

  return (
    <svg viewBox="0 0 400 240" className="w-full mx-auto">
      <path d={arcPath(0, 180)} stroke="rgba(255,255,255,0.08)" strokeWidth="18" fill="none" strokeLinecap="round" />
      {zones.map((z) => (
        <path key={z.color} d={arcPath(z.start, z.end)} stroke={z.color} strokeWidth="18" fill="none" strokeLinecap="round" />
      ))}
      <line x1={cx} y1={cy} x2={needleEnd.x} y2={needleEnd.y} stroke="white" strokeWidth="3" />
      <circle cx={cx} cy={cy} r="6" fill="white" />
    </svg>
  );
}

/* ── Pulse keyframe ──────────────────────────────────── */

const pulseCSS = `
@keyframes roxPulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.7; }
}
`;

/* ── Animation variants (matching site pattern) ──────── */

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

/* ── Main ROX Section ────────────────────────────────── */

export default function ROX() {
  const gaugeRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState(0);
  const [cardValues, setCardValues] = useState([0, 0, 0, 0]);
  const [animationStarted, setAnimationStarted] = useState(false);

  useEffect(() => {
    const el = gaugeRef.current;
    if (!el) return;

    let intervalId: ReturnType<typeof setInterval>;
    const valuesRef = { score: 0, cards: [0, 0, 0, 0] };

    const animateTo = (
      toScore: number,
      toCards: number[],
      duration: number,
      onComplete?: () => void
    ) => {
      const fromScore = valuesRef.score;
      const fromCards = [...valuesRef.cards];
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        const newScore = Math.round(fromScore + eased * (toScore - fromScore));
        const newCards = fromCards.map((from, i) =>
          Math.round(from + eased * (toCards[i] - from))
        );
        valuesRef.score = newScore;
        valuesRef.cards = newCards;
        setScore(newScore);
        setCardValues(newCards);
        if (t < 1) {
          requestAnimationFrame(tick);
        } else {
          onComplete?.();
        }
      };
      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimationStarted(true);
          const first = scenarios[0];
          animateTo(first.score, first.cards, 1200, () => {
            let currentIndex = 0;
            intervalId = setInterval(() => {
              currentIndex = (currentIndex + 1) % scenarios.length;
              const next = scenarios[currentIndex];
              animateTo(next.score, next.cards, 1200);
            }, 6000);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return (
    <section
      id="rox"
      className="relative py-16 sm:py-24 overflow-hidden"
      style={{
        backgroundSize: "200% 200%",
        animation: "bgShift 16s ease-in-out infinite",
        backgroundImage:
          "linear-gradient(135deg, #7C316D 0%, #0B0B3C 30%, #1A2E73 60%, #0B0B3C 100%)",
      }}
    >
      <style>{pulseCSS}</style>

      {/* Geometric pattern overlay (main-minimal) */}
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
          fill="white"
          fillOpacity="0.04"
        />
        <path
          d="M1440 900 L1440 540 L912 144 L432 144 L912 504 L912 900 Z"
          fill="white"
          fillOpacity="0.03"
        />
      </svg>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">

        {/* ── 1-3. Section header ─────────────────────── */}
        <div className="flex items-start justify-between gap-6">
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
              Return on Experience
            </motion.p>

            <motion.h2
              variants={fadeUp}
              className="leading-[1.1]"
              style={{
                fontFamily: "var(--font-inter)",
                letterSpacing: "-0.02em",
              }}
            >
              <span
                className="block"
                style={{
                  fontWeight: 500,
                  fontSize: "clamp(28px, 4.5vw, 52px)",
                  color: "#FFFFFF",
                }}
              >
                Your Events Have a Score.
              </span>
              <span
                className="block text-gradient-brand"
                style={{
                  fontWeight: 500,
                  fontSize: "clamp(22px, 3.5vw, 38px)",
                  WebkitBackgroundClip: "text",
                }}
              >
                Do You Know What It Is?
              </span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mt-4 max-w-[640px]"
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "15px",
                fontWeight: 300,
                lineHeight: "1.5",
                color: "rgba(255, 255, 255, 0.6)",
              }}
            >
              One score across four categories that tells you whether your events actually worked. Most teams have never seen this number.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden md:block flex-shrink-0 pt-1"
          >
            <a
              href="#"
              className="inline-flex items-center justify-center font-semibold text-[13px] py-3 px-6 rounded-lg transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
              style={{
                background: "linear-gradient(135deg, #0CF4DF, #1A56DB)",
                color: "#FFFFFF",
                fontFamily: "var(--font-inter)",
                whiteSpace: "nowrap",
              }}
            >
              Calculate Your ROX
            </a>
          </motion.div>
        </div>

        {/* ── 4. Score preview visual (two-column) ──── */}
        <motion.div
          ref={gaugeRef}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
          className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch"
        >
          {/* Left: Gauge dial */}
          <motion.div
            variants={fadeUp}
            className="mx-auto lg:mx-0 w-full flex flex-col items-center justify-center"
            style={{
              background: "rgba(6, 19, 65, 0.5)",
              border: "2px solid rgba(12, 244, 223, 0.12)",
              borderRadius: "20px",
              padding: "28px 32px 24px",
            }}
          >
            <ROXGauge animatedScore={score} />
            <div className="text-center -mt-6">
              <p
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 600,
                  fontSize: "80px",
                  color: getTierColor(score),
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                  transition: "color 0.3s ease",
                }}
              >
                {score}
              </p>
              <p
                className="mt-2 uppercase font-semibold text-[13px] tracking-[0.14em]"
                style={{
                  fontFamily: "var(--font-inter)",
                  color: "rgba(255, 255, 255, 0.5)",
                }}
              >
                ROX SCORE
              </p>
              <p
                className="mt-0.5"
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 600,
                  fontSize: "17px",
                  color: getTierColor(score),
                  letterSpacing: "0.05em",
                  transition: "color 0.3s ease",
                }}
              >
                {getTierName(score)}
              </p>
            </div>
            <p
              className="text-center mt-3"
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 300,
                fontSize: "12px",
                color: "rgba(255, 255, 255, 0.3)",
              }}
            >
              Your numbers. Updated in real time.
            </p>
          </motion.div>

          {/* Right: Stat cards */}
          <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3">
            {statCards.map((card, i) => (
              <div
                key={card.label}
                className="flex flex-col"
                style={{
                  background: "rgba(6, 19, 65, 0.5)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "14px",
                  padding: "20px",
                }}
              >
                <div>
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="flex-shrink-0 opacity-70">{card.icon}</div>
                    <p
                      className="uppercase"
                      style={{
                        fontFamily: "var(--font-inter)",
                        fontWeight: 500,
                        fontSize: "11px",
                        color: "rgba(255, 255, 255, 0.45)",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {card.label}
                    </p>
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontWeight: 300,
                      fontSize: "14px",
                      color: "rgba(255, 255, 255, 0.4)",
                      lineHeight: "1.5",
                      marginBottom: "10px",
                    }}
                  >
                    {card.description}
                  </p>
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontWeight: 600,
                    fontSize: "48px",
                    color: animationStarted ? getTierColor(cardValues[i]) : "rgba(255, 255, 255, 0.3)",
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                    transition: "color 0.3s ease",
                    ...((!animationStarted) ? { animation: "roxPulse 1.5s ease-in-out infinite" } : {}),
                  }}
                >
                  {animationStarted ? `${cardValues[i]}${card.suffix}` : "--"}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── 5. Score range strip ───────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
          className="mt-16 grid grid-cols-2 lg:grid-cols-4"
          style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}
        >
          {tiers.map((tier) => (
            <motion.div
              key={tier.name}
              variants={fadeUp}
              style={{
                borderTop: `3px solid ${tier.color}`,
                padding: "24px 20px",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 500,
                  fontSize: "17px",
                  color: "#FFFFFF",
                  marginBottom: "4px",
                }}
              >
                {tier.name}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 300,
                  fontSize: "13px",
                  color: "rgba(255, 255, 255, 0.5)",
                  lineHeight: "1.5",
                }}
              >
                {tier.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* ── 6. Body copy block ─────────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
          className="mt-16 grid grid-cols-1 lg:grid-cols-[45%_55%] gap-12 lg:gap-16"
        >
          <motion.div variants={fadeUp}>
            <p
              className="uppercase font-semibold text-[12px] tracking-[0.14em] mb-4"
              style={{
                fontFamily: "var(--font-inter)",
                color: "#00BBA5",
              }}
            >
              What ROX Measures That ROI Misses
            </p>
            <p
              className="mb-4"
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 300,
                fontSize: "15px",
                color: "rgba(255, 255, 255, 0.6)",
                lineHeight: "1.5",
              }}
            >
              ROI tells you what you spent. ROX tells you whether it worked. Most event teams walk away with badge scan counts and a rough sense of booth traffic. They have no visibility into how deeply people engaged, which conversations revealed real intent, or how fast their team followed up. Those gaps are exactly where deals are lost and hiring pipelines stall.
            </p>
            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 300,
                fontSize: "15px",
                color: "rgba(255, 255, 255, 0.6)",
                lineHeight: "1.5",
              }}
            >
              ROX fills that gap with a scored, comparable number your team can actually act on.
            </p>
          </motion.div>

          <motion.div variants={fadeUp}>
            {categories.map((cat, i) => (
              <div
                key={cat.label}
                className="flex items-start gap-4"
                style={{
                  padding: "18px 0",
                  borderBottom:
                    i < categories.length - 1
                      ? "1px solid rgba(255, 255, 255, 0.06)"
                      : "none",
                }}
              >
                <div className="flex-shrink-0 mt-0.5">{cat.icon}</div>
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontWeight: 500,
                      fontSize: "14px",
                      color: "#FFFFFF",
                      marginBottom: "2px",
                    }}
                  >
                    {cat.label}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontWeight: 300,
                      fontSize: "13px",
                      color: "rgba(255, 255, 255, 0.5)",
                      lineHeight: "1.5",
                    }}
                  >
                    {cat.description}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── 7. Calculator CTA block ────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={headerVariants}
          className="mt-16"
        >
          <motion.h3
            variants={fadeUp}
            className="leading-[1.1] mb-3"
            style={{
              fontFamily: "var(--font-inter)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              fontSize: "clamp(22px, 3.5vw, 36px)",
              color: "#FFFFFF",
            }}
          >
            See where your team stands.
          </motion.h3>

          <motion.p
            variants={fadeUp}
            className="mb-10 max-w-[480px]"
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "15px",
              fontWeight: 300,
              lineHeight: "1.5",
              color: "rgba(255, 255, 255, 0.6)",
            }}
          >
            Run your numbers in under two minutes. No login required.
          </motion.p>

          <motion.div
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {calculatorCards.map((card) => (
              <motion.div
                key={card.name}
                variants={fadeUp}
                className="text-left transition-all duration-200 hover:-translate-y-[3px] cursor-pointer"
                style={{
                  background: "rgba(6, 19, 65, 0.5)",
                  border: "1px solid rgba(12, 244, 223, 0.12)",
                  borderRadius: "14px",
                  padding: "28px 24px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(12, 244, 223, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(12, 244, 223, 0.12)";
                }}
              >
                <div className="mb-4">{card.icon}</div>
                <p
                  className="mb-2"
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontWeight: 500,
                    fontSize: "15px",
                    color: "#FFFFFF",
                  }}
                >
                  {card.name}
                </p>
                <p
                  className="mb-5"
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontWeight: 300,
                    fontSize: "13px",
                    color: "rgba(255, 255, 255, 0.55)",
                    lineHeight: "1.5",
                  }}
                >
                  {card.description}
                </p>
                <a
                  href="#"
                  className="hover:underline"
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontWeight: 500,
                    fontSize: "13px",
                    color: "#0CF4DF",
                    textDecoration: "none",
                  }}
                >
                  Calculate &rarr;
                </a>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="mt-10">
            <a
              href="#"
              className="inline-flex items-center justify-center font-semibold text-[14px] py-3.5 px-7 rounded-lg transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
              style={{
                background: "linear-gradient(135deg, #0CF4DF, #1A56DB)",
                color: "#FFFFFF",
                fontFamily: "var(--font-inter)",
              }}
            >
              Calculate Your ROX
            </a>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="mt-4"
            style={{
              fontFamily: "var(--font-inter)",
              fontWeight: 300,
              fontSize: "14px",
              color: "rgba(255, 255, 255, 0.45)",
            }}
          >
            Or{" "}
            <a
              href="#demo"
              className="hover:underline"
              style={{ color: "#0CF4DF", textDecoration: "none" }}
            >
              schedule a demo
            </a>{" "}
            to see ROX dashboards live.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
