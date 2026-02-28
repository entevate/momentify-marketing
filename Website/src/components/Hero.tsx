"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

const words = [
  "Trade Show.",
  "Recruiting Event.",
  "Field Interaction.",
  "Facility Visit.",
  "Live Experience.",
  "Moment.",
];

/* ── Style option configs ──────────────────────────────── */

const headline = { weight: 500, size: "clamp(36px,5.5vw,72px)", tracking: "-0.02em" };

const subheadOptions = [
  { label: "400 / 14px", weight: 400, size: "14px", leading: "1.5" },
  { label: "300 / 14px", weight: 300, size: "14px", leading: "1.5" },
  { label: "400 / 15px", weight: 400, size: "15px", leading: "1.5" },
  { label: "300 / 15px", weight: 300, size: "15px", leading: "1.5" },
];

const eyebrowOptions = [
  {
    label: "Outlined Pill",
    style: {
      display: "inline-block" as const,
      fontSize: "10px",
      fontWeight: 600,
      textTransform: "uppercase" as const,
      letterSpacing: "0.10em",
      color: "#0CF4DF",
      border: "1px solid rgba(12,244,223,0.3)",
      borderRadius: "999px",
      padding: "5px 14px",
    },
  },
  {
    label: "Filled Pill",
    style: {
      display: "inline-block" as const,
      fontSize: "10px",
      fontWeight: 600,
      textTransform: "uppercase" as const,
      letterSpacing: "0.10em",
      color: "#0B0B3C",
      background: "linear-gradient(135deg, #0CF4DF, #5BA8F5)",
      borderRadius: "999px",
      padding: "5px 14px",
    },
  },
  {
    label: "Ghost Pill",
    style: {
      display: "inline-block" as const,
      fontSize: "10px",
      fontWeight: 500,
      textTransform: "uppercase" as const,
      letterSpacing: "0.10em",
      color: "#0CF4DF",
      background: "rgba(12,244,223,0.08)",
      borderRadius: "999px",
      padding: "5px 14px",
    },
  },
  {
    label: "Dot Pill",
    style: {
      display: "inline-flex" as const,
      alignItems: "center" as const,
      gap: "8px",
      fontSize: "10px",
      fontWeight: 600,
      textTransform: "uppercase" as const,
      letterSpacing: "0.10em",
      color: "#0CF4DF",
      border: "1px solid rgba(12,244,223,0.2)",
      borderRadius: "999px",
      padding: "5px 14px 5px 10px",
    },
  },
];

/* ── Picker pill component ─────────────────────────────── */

function OptionPicker({
  label,
  options,
  active,
  onChange,
}: {
  label: string;
  options: { label: string }[];
  active: number;
  onChange: (i: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-white/30 uppercase tracking-wider font-medium shrink-0">
        {label}
      </span>
      <div className="flex items-center gap-1 bg-white/[0.07] backdrop-blur-sm rounded-full p-0.5 border border-white/[0.1]">
        {options.map((opt, i) => (
          <button
            key={opt.label}
            onClick={() => onChange(i)}
            className={`text-[10px] px-2.5 py-1 rounded-full transition-all whitespace-nowrap ${
              active === i
                ? "bg-white/15 text-white font-medium"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

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
          WebkitTextFillColor: "#0CF4DF",
          color: "#0CF4DF",
        }}
      >
        |
      </span>
    </span>
  );
}

/* ── Hero ──────────────────────────────────────────────── */

export default function Hero() {
  const [subheadIdx, setSubheadIdx] = useState(3);
  const [eyebrowIdx, setEyebrowIdx] = useState(0);

  const sh = subheadOptions[subheadIdx];
  const ey = eyebrowOptions[eyebrowIdx];

  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundSize: "200% 200%",
        animation: "bgShift 20s ease-in-out infinite",
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

      {/* Style pickers — top right */}
      <div className="absolute top-20 right-6 lg:right-12 z-20 flex flex-col gap-2 items-end">
        <OptionPicker label="Sub" options={subheadOptions} active={subheadIdx} onChange={setSubheadIdx} />
        <OptionPicker label="Eye" options={eyebrowOptions} active={eyebrowIdx} onChange={setEyebrowIdx} />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12 pt-32 pb-20 sm:pt-36 sm:pb-24 lg:pt-40 lg:pb-28">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-5"
          >
            <span style={ey.style}>
              {ey.label === "Dot Pill" && (
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#0CF4DF",
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
              )}
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
            className="mt-6 text-white/60 max-w-xl"
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: sh.size,
              fontWeight: sh.weight,
              lineHeight: sh.leading,
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
            className="mt-8 flex flex-wrap gap-3"
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
