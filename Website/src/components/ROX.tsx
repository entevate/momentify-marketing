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

  // Arc helper: angle in degrees (0 = left of semicircle, 180 = right)
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

  // Zones mapped to 180-degree arc
  const zones = [
    { start: 0, end: 70.2, color: "#E5484D" },
    { start: 70.2, end: 124.2, color: "#F2B33D" },
    { start: 124.2, end: 151.2, color: "#5FD9C2" },
    { start: 151.2, end: 180, color: "#0CF4DF" },
  ];

  // Needle position
  const needleAngle = (animatedScore / 100) * 180;
  const needleEnd = polarToCart(needleAngle);

  return (
    <svg viewBox="0 0 400 240" className="w-full max-w-[360px] mx-auto">
      {/* Background track */}
      <path d={arcPath(0, 180)} stroke="rgba(255,255,255,0.08)" strokeWidth="12" fill="none" strokeLinecap="round" />
      {/* Color zones */}
      {zones.map((z) => (
        <path key={z.color} d={arcPath(z.start, z.end)} stroke={z.color} strokeWidth="12" fill="none" strokeLinecap="round" />
      ))}
      {/* Needle */}
      <line x1={cx} y1={cy} x2={needleEnd.x} y2={needleEnd.y} stroke="white" strokeWidth="2" />
      <circle cx={cx} cy={cy} r="4" fill="white" />
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

  useEffect(() => {
    const el = gaugeRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const start = performance.now();
          const duration = 1200;
          const tick = (now: number) => {
            const t = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            setScore(Math.round(eased * 72));
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="rox"
      className="relative py-16 sm:py-24 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #1A0533 0%, #070E2B 50%, #061341 100%)",
      }}
    >
      <style>{pulseCSS}</style>

      <div className="mx-auto max-w-7xl px-6 lg:px-12">

        {/* ── 1-3. Section header (eyebrow + headline + subhead) ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={headerVariants}
        >
          <motion.p
            variants={fadeUp}
            className="uppercase font-semibold text-[12px] tracking-[0.14em] mb-4"
            style={{ color: "#0CF4DF", fontFamily: "var(--font-inter)" }}
          >
            Return on Experience
          </motion.p>

          <motion.h2
            variants={fadeUp}
            className="leading-[1.1]"
            style={{
              fontFamily: "var(--font-inter)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              fontSize: "clamp(28px, 4.5vw, 52px)",
              color: "#FFFFFF",
            }}
          >
            Your events have a score. Do you know what it is?
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
            Return on Experience measures the quality of your engagement, not just the quantity. Four categories determine your score: lead capture efficiency, engagement quality, follow-up speed, and conversion effectiveness. Most teams have never seen the number. Momentify surfaces it in real time.
          </motion.p>
        </motion.div>

        {/* ── 4. Score preview visual ────────────────── */}
        <motion.div
          ref={gaugeRef}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={fadeUp}
          className="mt-12 mx-auto"
          style={{
            maxWidth: "520px",
            background: "rgba(6, 19, 65, 0.6)",
            border: "2px solid rgba(12, 244, 223, 0.15)",
            borderRadius: "20px",
            padding: "40px",
          }}
        >
          {/* Gauge */}
          <ROXGauge animatedScore={score} />

          {/* Score number */}
          <div className="text-center -mt-4">
            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 600,
                fontSize: "56px",
                color: "#FFFFFF",
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
            >
              {score}
            </p>
            <p
              className="mt-2 uppercase font-semibold text-[12px] tracking-[0.14em]"
              style={{
                fontFamily: "var(--font-inter)",
                color: "#0CF4DF",
              }}
            >
              ROX SCORE
            </p>
            <p
              className="mt-1"
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 500,
                fontSize: "13px",
                color: "#5FD9C2",
              }}
            >
              HIGH ROX
            </p>
          </div>

          {/* Four stat tiles */}
          <div className="grid grid-cols-2 gap-3 mt-8">
            {["Lead Capture Efficiency", "Engagement Quality", "Follow-Up Speed", "Conversion Effectiveness"].map(
              (label) => (
                <div
                  key={label}
                  style={{
                    background: "#061341",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "10px",
                    padding: "16px 20px",
                  }}
                >
                  <p
                    className="uppercase"
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontWeight: 500,
                      fontSize: "11px",
                      color: "rgba(255, 255, 255, 0.45)",
                      letterSpacing: "0.1em",
                      marginBottom: "6px",
                    }}
                  >
                    {label}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontWeight: 600,
                      fontSize: "22px",
                      color: "#FFFFFF",
                      animation: "roxPulse 1.5s ease-in-out infinite",
                    }}
                  >
                    --
                  </p>
                </div>
              )
            )}
          </div>

          {/* Caption */}
          <p
            className="text-center mt-5"
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
                  fontSize: "14px",
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
          {/* Left column */}
          <motion.div variants={fadeUp}>
            <p
              className="uppercase font-semibold text-[12px] tracking-[0.14em] mb-4"
              style={{
                fontFamily: "var(--font-inter)",
                color: "#0CF4DF",
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

          {/* Right column */}
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

          {/* Calculator cards */}
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
                  background: "rgba(6, 19, 65, 0.6)",
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

          {/* Primary CTA */}
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

          {/* Secondary line */}
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
