"use client";

import { useEffect, useCallback, useState } from "react";
import { motion } from "framer-motion";

const words = [
  "Trade Show.",
  "Exhibit.",
  "Fan Engagement.",
  "Demo.",
  "Moment.",
  "Recruiting Event.",
  "Job Fair.",
  "Booth Conversation.",
  "Handshake.",
  "Moment.",
  "Field Interaction.",
  "Facility Visit.",
  "Live Experience.",
  "Conversation.",
  "Moment.",
];

/* ── Style option configs ──────────────────────────────── */

const headline = { weight: 500, size: "clamp(36px,5.5vw,72px)", tracking: "-0.02em" };

const subhead = { weight: 300, size: "15px", leading: "1.5" };

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

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12 pt-36 pb-28 sm:pt-44 sm:pb-32 lg:pt-48 lg:pb-36">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <span style={eyebrowStyle}>
              CONTACT. CONVERSATION. CONTEXT.
            </span>
          </motion.div>

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
            The operating system for in-person engagement. Built to convert attention
            into outcomes your team can measure&nbsp;and&nbsp;prove.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.32 }}
            className="mt-12 flex flex-wrap gap-3"
          >
            <a
              href="#platform"
              className="bg-white text-midnight font-medium text-[13px] py-2.5 px-6 rounded-md hover:bg-white/90 transition-colors"
            >
              See How It Works
            </a>
            <a
              href="#demo"
              className="border border-white/20 text-white font-medium text-[13px] py-2.5 px-6 rounded-md hover:border-white/40 transition-colors"
            >
              Schedule a Demo
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
