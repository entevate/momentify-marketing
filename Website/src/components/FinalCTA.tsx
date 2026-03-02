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

/* ── Final CTA Section ─────────────────────────────── */

export default function FinalCTA() {
  return (
    <section
      id="demo"
      className="relative py-16 sm:py-24 overflow-hidden"
      style={{
        backgroundSize: "200% 200%",
        animation: "bgShift 16s ease-in-out infinite",
        backgroundImage:
          "linear-gradient(135deg, #1A0533 0%, #070E2B 40%, #061341 70%, #070E2B 100%)",
      }}
    >
      {/* Geometric pattern overlay (match ROX/Hero) */}
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
          fillOpacity="0.02"
        />
        <path
          d="M1440 900 L1440 540 L912 144 L432 144 L912 504 L912 900 Z"
          fill="white"
          fillOpacity="0.015"
        />
      </svg>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={headerVariants}
          className="max-w-[640px]"
        >
          {/* Eyebrow */}
          <motion.p
            variants={fadeUp}
            className="uppercase font-semibold text-[12px] tracking-[0.14em] mb-4"
            style={{ color: "#00BBA5", fontFamily: "var(--font-inter)" }}
          >
            Get Started
          </motion.p>

          {/* Headline */}
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
            Stop guessing. Start measuring.
          </motion.h2>

          {/* Subhead */}
          <motion.p
            variants={fadeUp}
            className="mt-4 max-w-[560px]"
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "15px",
              fontWeight: 300,
              lineHeight: "1.5",
              color: "rgba(255, 255, 255, 0.6)",
            }}
          >
            Every interaction your team has is worth something. Momentify makes sure you know what.
          </motion.p>

          {/* CTA pair */}
          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-col sm:flex-row items-start gap-4"
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
              Calculate Your ROX
            </a>
          </motion.div>

          {/* Trust line */}
          <motion.p
            variants={fadeUp}
            className="mt-8"
            style={{
              fontFamily: "var(--font-inter)",
              fontWeight: 300,
              fontSize: "13px",
              color: "rgba(255, 255, 255, 0.35)",
              letterSpacing: "0.02em",
            }}
          >
            No contracts. No IT procurement. Deploy in days.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
