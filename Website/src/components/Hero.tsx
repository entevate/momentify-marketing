"use client";

import { useEffect, useCallback, useState } from "react";
import { motion } from "framer-motion";

const words = [
  "Trade Show.",
  "Exhibit.",
  "Demo.",
  "Moment.",
  "Career Fair.",
  "Job Fair.",
  "Handshake.",
  "Moment.",
  "Field Visit.",
  "Facility Tour.",
  "Experience.",
  "Conversation.",
  "Moment.",
];

/* ── Style option configs ──────────────────────────────── */

const headline = { weight: 500, size: "clamp(42px,5.5vw,72px)", tracking: "-0.02em" };

const subhead = { weight: 400, size: "15px", leading: "1.5" };

const eyebrowStyle = {
  display: "inline-block" as const,
  fontSize: "10px",
  fontWeight: 600,
  textTransform: "uppercase" as const,
  letterSpacing: "0.10em",
  color: "#0B0B3C",
  background: "linear-gradient(135deg, #0CF4DF, #5BA8F5)",
  borderRadius: "999px",
  padding: "5px 14px",
};

/* ── Typewriter ────────────────────────────────────────── */

function TypewriterWord() {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const type = useCallback(() => {
    const currentWord = words[wordIndex];
    if (isPaused) return;

    if (!isDeleting) {
      if (displayText.length < currentWord.length) {
        setDisplayText(currentWord.slice(0, displayText.length + 1));
      } else {
        setIsPaused(true);
        setTimeout(() => {
          setIsPaused(false);
          setIsDeleting(true);
        }, 1500);
      }
    } else {
      if (displayText.length > 0) {
        setDisplayText(displayText.slice(0, -1));
      } else {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }
    }
  }, [displayText, isDeleting, wordIndex, isPaused]);

  useEffect(() => {
    const speed = isDeleting ? 25 : 40;
    const timer = setTimeout(type, speed);
    return () => clearTimeout(timer);
  }, [type, isDeleting]);

  useEffect(() => {
    const interval = setInterval(() => setShowCursor((prev) => !prev), 530);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="text-gradient-hero">
      {displayText}
      <span
        className="inline-block ml-0.5"
        style={{
          opacity: showCursor ? 1 : 0,
          WebkitTextFillColor: "#FFFFFF",
          color: "#FFFFFF",
          fontWeight: 100,
          transform: "scaleX(0.5)",
        }}
      >
        |
      </span>
    </span>
  );
}

/* ── Client logos ─────────────────────────────────────── */

const logos = [
  { src: "/logos/caterpillar.png", alt: "Caterpillar", height: "22px" },
  { src: "/logos/mustang-cat.png", alt: "Mustang Cat", height: "28px" },
  { src: "/logos/thompson-tractor.png", alt: "Thompson Tractor", height: "28px" },
  { src: "/logos/blanchard-machinery.png", alt: "Blanchard Machinery", height: "28px" },
];

const logoSet = logos.map((logo) => (
  <img
    key={logo.alt}
    src={logo.src}
    alt={logo.alt}
    className="flex-shrink-0 opacity-50 hover:opacity-90 transition-opacity duration-200"
    style={{ height: logo.height, width: "auto" }}
  />
));

/* ── Hero ──────────────────────────────────────────────── */

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundSize: "200% 200%",
        animation: "bgShift 16s ease-in-out infinite",
        backgroundImage:
          "linear-gradient(135deg, #7C316D 0%, #0B0B3C 30%, #1A2E73 60%, #0B0B3C 100%)",
      }}
    >
      {/* Subtle animated ambient glow */}
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
        <div
          className="absolute w-[400px] h-[400px] rounded-full opacity-[0.04] blur-[80px]"
          style={{
            background: "radial-gradient(circle, #254FE5, transparent 70%)",
            top: "40%",
            right: "5%",
            animation: "ambientFloat3 18s ease-in-out infinite",
          }}
        />
      </div>

      {/* ARC pattern overlay */}
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

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12 pt-36 pb-16 sm:pt-44 sm:pb-20 lg:pt-40 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 lg:gap-16 items-start">
          {/* ── Left column: copy ──────────────────── */}
          <div>
            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="text-white leading-[1.08]"
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: headline.size,
                fontWeight: headline.weight,
                letterSpacing: headline.tracking,
              }}
            >
              Empower Every
              <br />
              <TypewriterWord />
            </motion.h1>

            {/* Subhead */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-10 text-white/60 max-w-xl"
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: subhead.size,
                fontWeight: subhead.weight,
                lineHeight: subhead.leading,
              }}
            >
              The operating system for in-person engagement. Momentify converts attention
              into outcomes your team can measure&nbsp;and&nbsp;prove.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.32 }}
              className="mt-12 grid grid-cols-2 sm:flex sm:flex-row gap-4"
            >
              <a
                href="/platform/how-it-works"
                className="inline-flex items-center justify-center font-semibold text-[11px] sm:text-[14px] py-3.5 px-4 sm:px-7 rounded-lg bg-white text-midnight transition-all duration-200 hover:bg-white/90 hover:scale-[1.02] sm:min-w-[200px]"
              >
                See How It Works
              </a>
              <a
                href="/what-is-rox"
                aria-label="Calculate Your ROX"
                className="inline-flex items-center justify-center font-semibold text-[11px] sm:text-[14px] text-white py-3.5 px-4 sm:px-7 rounded-lg transition-all duration-200 hover:bg-white/[0.08] sm:min-w-[200px]"
                style={{
                  border: "1.5px solid rgba(255, 255, 255, 0.25)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.5)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.25)")}
              >
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                  <span className="leading-none">Calculate Your</span>
                  <img
                    src="/rox-wordmark.png"
                    alt=""
                    width={44}
                    height={20}
                    className="h-[1.25em] w-auto translate-y-[0.14em] object-contain"
                    aria-hidden
                  />
                </span>
              </a>
            </motion.div>

          </div>

        </div>

        {/* ── Proof Bar / Logo Ticker ────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12"
        >
          {/* Divider */}
          <div className="w-full h-px bg-white/[0.12]" />

          <div className="flex items-center gap-6 sm:gap-16 pt-8">
            {/* Static label */}
            <span
              className="flex-shrink-0 text-white/40 font-semibold text-[11px] tracking-[0.12em] uppercase"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              TRUSTED BY
            </span>

            {/* Scrolling logos on mobile, static on sm+ */}
            <div className="sm:hidden overflow-hidden flex-1">
              <div className="flex items-center gap-10" style={{ animation: "tickerScroll 12s linear infinite", width: "max-content" }}>
                {logoSet}
                {logoSet}
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-16">
              {logoSet}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
