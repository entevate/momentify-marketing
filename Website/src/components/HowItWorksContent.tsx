"use client";

import { motion } from "framer-motion";
import ProductShowcase from "./ProductShowcase";

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

export default function HowItWorksContent() {
  return (
    <section
      className="relative overflow-hidden min-h-screen"
      style={{
        backgroundSize: "200% 200%",
        animation: "bgShift 16s ease-in-out infinite",
        backgroundImage:
          "linear-gradient(135deg, #7C316D 0%, #0B0B3C 30%, #1A2E73 60%, #0B0B3C 100%)",
      }}
    >
      {/* Ambient glow effects */}
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

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12 pt-36 pb-16 sm:pt-44 sm:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left column: text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <span style={eyebrowStyle}>PLATFORM</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="text-white leading-[1.08]"
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "clamp(36px, 5.5vw, 56px)",
                fontWeight: 500,
                letterSpacing: "-0.02em",
              }}
            >
              How It Works
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-white/60 max-w-md"
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "15px",
                fontWeight: 300,
                lineHeight: "1.5",
              }}
            >
              Three steps from setup to intelligence. One platform that captures,
              contextualizes, and proves the value of every in-person interaction.
            </motion.p>
          </div>

          {/* Right column: product showcase */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <ProductShowcase />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
