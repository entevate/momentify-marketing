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
              fontSize: "clamp(34px, 5vw, 60px)",
              color: "#FFFFFF",
            }}
          >
            Stop Guessing.
            <br />
            <span className="text-gradient-brand">Start Measuring.</span>
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
            Your team is already creating moments that matter. Momentify turns them into measurable outcomes you can prove, repeat, and scale.
          </motion.p>

          {/* CTA pair */}
          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-row gap-3 sm:gap-4"
          >
            {/* Primary */}
            <a
              href="/demo"
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
              href="/what-is-rox"
              aria-label="Calculate Your ROX"
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

        </motion.div>
      </div>
    </section>
  );
}
