"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const products = [
  {
    name: "Momentify Web",
    step: 1,
    headline: "Set up. Configure. Deploy.",
    color: "#5FD9C2",
    device: "macbook-web" as const,
    perspective: "none",
    shadow: "drop-shadow(0 8px 24px rgba(95,217,194,0.15))",
    textOffsetY: -20,
  },
  {
    name: "Momentify Explorer",
    step: 2,
    headline: "Engage. Capture. Contextualize.",
    color: "#6B21D4",
    device: "ipad-iphone" as const,
    perspective: "perspective(600px) rotateY(-16deg) rotateX(5deg)",
    shadow: "drop-shadow(0 12px 32px rgba(107,33,212,0.25))",
    textOffsetY: 0,
  },
  {
    name: "Momentify Intelligence",
    step: 3,
    headline: "Analyze. Score. Prove.",
    color: "#F2B33D",
    device: "macbook-intel" as const,
    perspective: "none",
    shadow: "drop-shadow(0 8px 24px rgba(242,179,61,0.15))",
    textOffsetY: -20,
  },
];

/* Step 1: Momentify Web — dashboard with sidebar, event content, right panel */
function WebDashboardFrame({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 420 280" fill="none" className="w-full">
      <rect x="50" y="20" width="320" height="195" rx="10" stroke="white" strokeOpacity="0.25" strokeWidth="1.5" />
      <path d="M182 20 h56 v8 a4 4 0 0 1 -4 4 h-48 a4 4 0 0 1 -4 -4 Z" fill="rgba(255,255,255,0.1)" />
      {/* Screen */}
      <rect x="56" y="32" width="308" height="177" rx="3" fill="#1a1a3e" />
      {/* Sidebar */}
      <defs>
        <linearGradient id="sidebar-grad" x1="56" y1="32" x2="56" y2="209" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7C316D" stopOpacity="0.6" />
          <stop offset="1" stopColor="#1a1a3e" />
        </linearGradient>
      </defs>
      <rect x="56" y="32" width="52" height="177" rx="3" fill="url(#sidebar-grad)" />
      {/* Sidebar logo */}
      <rect x="62" y="40" width="20" height="3" rx="1.5" fill={color} fillOpacity="0.8" />
      <rect x="62" y="45" width="12" height="2" rx="1" fill="white" fillOpacity="0.2" />
      {/* Sidebar nav items */}
      <rect x="62" y="58" width="36" height="3" rx="1.5" fill="white" fillOpacity="0.35" />
      <rect x="62" y="68" width="30" height="3" rx="1.5" fill="white" fillOpacity="0.15" />
      <rect x="62" y="78" width="34" height="3" rx="1.5" fill="white" fillOpacity="0.15" />
      <rect x="62" y="88" width="28" height="3" rx="1.5" fill="white" fillOpacity="0.15" />
      {/* Main content area */}
      {/* Event image placeholder */}
      <rect x="116" y="40" width="110" height="60" rx="4" fill={color} fillOpacity="0.08" />
      <rect x="148" y="62" width="46" height="16" rx="3" fill={color} fillOpacity="0.12" />
      {/* Stats row */}
      <rect x="116" y="108" width="34" height="20" rx="3" fill="white" fillOpacity="0.06" />
      <rect x="120" y="112" width="14" height="2" rx="1" fill="white" fillOpacity="0.15" />
      <rect x="120" y="118" width="22" height="5" rx="1" fill={color} fillOpacity="0.4" />
      <rect x="156" y="108" width="34" height="20" rx="3" fill="white" fillOpacity="0.06" />
      <rect x="160" y="112" width="14" height="2" rx="1" fill="white" fillOpacity="0.15" />
      <rect x="160" y="118" width="18" height="5" rx="1" fill={color} fillOpacity="0.3" />
      {/* Table rows */}
      <rect x="116" y="136" width="170" height="2" rx="1" fill="white" fillOpacity="0.06" />
      <rect x="116" y="144" width="170" height="2" rx="1" fill="white" fillOpacity="0.04" />
      <rect x="116" y="152" width="170" height="2" rx="1" fill="white" fillOpacity="0.04" />
      <rect x="116" y="160" width="170" height="2" rx="1" fill="white" fillOpacity="0.04" />
      <rect x="116" y="168" width="170" height="2" rx="1" fill="white" fillOpacity="0.04" />
      {/* Right panel — Manage Event */}
      <rect x="294" y="32" width="70" height="177" rx="3" fill="rgba(255,255,255,0.06)" />
      <rect x="300" y="40" width="40" height="3" rx="1.5" fill="white" fillOpacity="0.3" />
      <rect x="348" y="39" width="10" height="5" rx="2.5" fill="white" fillOpacity="0.12" />
      {/* Form fields */}
      <rect x="300" y="52" width="16" height="2" rx="1" fill="white" fillOpacity="0.15" />
      <rect x="300" y="58" width="56" height="10" rx="2" fill="white" fillOpacity="0.05" />
      <rect x="300" y="74" width="20" height="2" rx="1" fill="white" fillOpacity="0.15" />
      <rect x="300" y="80" width="56" height="10" rx="2" fill="white" fillOpacity="0.05" />
      <rect x="300" y="96" width="24" height="2" rx="1" fill="white" fillOpacity="0.15" />
      <rect x="300" y="102" width="56" height="18" rx="2" fill="white" fillOpacity="0.05" />
      <rect x="300" y="126" width="18" height="2" rx="1" fill="white" fillOpacity="0.15" />
      <rect x="300" y="132" width="56" height="10" rx="2" fill="white" fillOpacity="0.05" />
      <rect x="300" y="148" width="22" height="2" rx="1" fill="white" fillOpacity="0.15" />
      <rect x="300" y="154" width="56" height="10" rx="2" fill="white" fillOpacity="0.05" />
      {/* CTA button */}
      <rect x="300" y="172" width="56" height="12" rx="3" fill={color} fillOpacity="0.25" />
      {/* Base / hinge */}
      <path d="M30 220 Q30 215 36 215 L384 215 Q390 215 390 220 L398 232 Q400 236 396 236 L24 236 Q20 236 22 232 Z" stroke="white" strokeOpacity="0.18" strokeWidth="1" fill="none" />
    </svg>
  );
}

/* Step 2: Momentify Explorer — iPad role selection + iPhone session list */
function ExplorerFrame({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 420 280" fill="none" className="w-full">
      {/* iPad — landscape */}
      <rect x="40" y="50" width="260" height="180" rx="14" stroke="white" strokeOpacity="0.25" strokeWidth="1.5" />
      <circle cx="170" cy="57" r="2.5" fill="white" fillOpacity="0.12" />
      {/* iPad screen — gradient background matching Explorer screenshot */}
      <defs>
        <linearGradient id="explorer-bg" x1="50" y1="62" x2="290" y2="218" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2a6b5e" />
          <stop offset="1" stopColor="#1a3a5c" />
        </linearGradient>
      </defs>
      <rect x="50" y="62" width="240" height="156" rx="4" fill="url(#explorer-bg)" />
      {/* Header — Momentify Explorer */}
      <rect x="60" y="70" width="14" height="5" rx="1" fill={color} fillOpacity="0.5" />
      <rect x="78" y="71" width="30" height="3" rx="1.5" fill="white" fillOpacity="0.4" />
      {/* Left card — Visitor info */}
      <rect x="60" y="84" width="80" height="62" rx="6" fill="white" fillOpacity="0.1" />
      <rect x="68" y="92" width="40" height="3.5" rx="1.5" fill="white" fillOpacity="0.5" />
      <circle cx="72" cy="104" r="4" fill="white" fillOpacity="0.15" />
      <rect x="80" y="102" width="36" height="2.5" rx="1" fill="white" fillOpacity="0.3" />
      <circle cx="72" cy="116" r="4" fill="white" fillOpacity="0.15" />
      <rect x="80" y="112" width="16" height="2" rx="1" fill="white" fillOpacity="0.2" />
      <rect x="80" y="118" width="44" height="2.5" rx="1" fill="white" fillOpacity="0.3" />
      {/* Right card — My Role selection */}
      <rect x="148" y="84" width="132" height="62" rx="6" fill="white" fillOpacity="0.1" />
      <circle cx="160" cy="93" r="5" fill={color} fillOpacity="0.2" />
      <rect x="170" y="90" width="30" height="4" rx="2" fill="white" fillOpacity="0.5" />
      <rect x="170" y="97" width="80" height="2.5" rx="1" fill="white" fillOpacity="0.2" />
      {/* Role option cards */}
      <rect x="156" y="108" width="34" height="28" rx="4" fill={color} fillOpacity="0.15" />
      <rect x="162" y="114" width="10" height="10" rx="2" fill="white" fillOpacity="0.2" />
      <rect x="160" y="128" width="26" height="2" rx="1" fill="white" fillOpacity="0.3" />
      <rect x="196" y="108" width="34" height="28" rx="4" fill={color} fillOpacity="0.1" />
      <rect x="202" y="114" width="10" height="10" rx="2" fill="white" fillOpacity="0.2" />
      <rect x="200" y="128" width="26" height="2" rx="1" fill="white" fillOpacity="0.3" />
      <rect x="236" y="108" width="34" height="28" rx="4" fill={color} fillOpacity="0.1" />
      <rect x="242" y="114" width="10" height="10" rx="2" fill="white" fillOpacity="0.2" />
      <rect x="240" y="128" width="26" height="2" rx="1" fill="white" fillOpacity="0.3" />
      {/* Next button */}
      <rect x="248" y="156" width="30" height="14" rx="4" fill="white" fillOpacity="0.2" />
      <rect x="254" y="161" width="18" height="3" rx="1.5" fill="white" fillOpacity="0.5" />
      {/* Bottom controls */}
      <circle cx="62" cy="208" r="6" fill="white" fillOpacity="0.08" />
      <rect x="238" y="204" width="42" height="10" rx="4" fill="white" fillOpacity="0.08" />
      {/* Home indicator */}
      <rect x="138" y="224" width="64" height="3.5" rx="1.75" fill="white" fillOpacity="0.12" />

      {/* iPhone — portrait, overlapping iPad bottom-right */}
      <rect x="280" y="100" width="80" height="155" rx="16" stroke="white" strokeOpacity="0.3" strokeWidth="1.5" fill="rgba(11,11,60,0.85)" />
      <rect x="304" y="108" width="32" height="9" rx="4.5" fill="rgba(255,255,255,0.12)" />
      {/* Phone screen — white bg with session list */}
      <rect x="286" y="122" width="68" height="120" rx="3" fill="white" />
      <rect x="290" y="125" width="16" height="2" rx="1" fill="#333" fillOpacity="0.3" />
      <rect x="336" y="125" width="14" height="2" rx="1" fill="#333" fillOpacity="0.3" />
      <rect x="290" y="132" width="36" height="3" rx="1.5" fill={color} fillOpacity="0.7" />
      {/* Session cards */}
      <rect x="290" y="140" width="60" height="28" rx="3" fill="#F3F4F6" />
      <rect x="294" y="144" width="24" height="2.5" rx="1" fill="#333" fillOpacity="0.25" />
      <rect x="294" y="150" width="40" height="2" rx="1" fill="#333" fillOpacity="0.12" />
      <rect x="294" y="156" width="32" height="2" rx="1" fill="#333" fillOpacity="0.12" />
      <circle cx="340" cy="152" r="5" fill={color} fillOpacity="0.15" />
      <rect x="290" y="172" width="60" height="28" rx="3" fill="#F3F4F6" />
      <rect x="294" y="176" width="28" height="2.5" rx="1" fill="#333" fillOpacity="0.25" />
      <rect x="294" y="182" width="44" height="2" rx="1" fill="#333" fillOpacity="0.12" />
      <rect x="294" y="188" width="36" height="2" rx="1" fill="#333" fillOpacity="0.12" />
      <circle cx="340" cy="184" r="5" fill={color} fillOpacity="0.15" />
      <rect x="290" y="204" width="60" height="28" rx="3" fill="#F3F4F6" />
      <rect x="294" y="208" width="20" height="2.5" rx="1" fill="#333" fillOpacity="0.25" />
      <rect x="294" y="214" width="38" height="2" rx="1" fill="#333" fillOpacity="0.12" />
      <rect x="294" y="220" width="30" height="2" rx="1" fill="#333" fillOpacity="0.12" />
      <circle cx="340" cy="216" r="5" fill={color} fillOpacity="0.15" />
      <rect x="303" y="247" width="34" height="3" rx="1.5" fill="#333" fillOpacity="0.15" />
    </svg>
  );
}

/* Step 3: Momentify Intelligence — analytics dashboard with charts */
function IntelligenceDashboardFrame({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 420 280" fill="none" className="w-full">
      <rect x="50" y="20" width="320" height="195" rx="10" stroke="white" strokeOpacity="0.25" strokeWidth="1.5" />
      <path d="M182 20 h56 v8 a4 4 0 0 1 -4 4 h-48 a4 4 0 0 1 -4 -4 Z" fill="rgba(255,255,255,0.1)" />
      {/* Screen — light background like Intelligence screenshot */}
      <defs>
        <linearGradient id="intel-bg" x1="56" y1="32" x2="364" y2="209" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f8f4ff" />
          <stop offset="1" stopColor="#fef3e2" />
        </linearGradient>
      </defs>
      <rect x="56" y="32" width="308" height="177" rx="3" fill="url(#intel-bg)" />
      {/* Overview header */}
      <rect x="64" y="40" width="36" height="4" rx="2" fill="#333" fillOpacity="0.3" />
      {/* Top stat cards row */}
      <rect x="64" y="50" width="70" height="30" rx="5" fill="white" />
      <rect x="64" y="50" width="70" height="30" rx="5" stroke="#e5e7eb" strokeWidth="0.5" fill="none" />
      <circle cx="74" cy="58" r="4" fill="#3B82F6" fillOpacity="0.15" />
      <rect x="82" y="56" width="30" height="2.5" rx="1" fill="#333" fillOpacity="0.2" />
      <rect x="70" y="66" width="28" height="7" rx="1" fill="#333" fillOpacity="0.5" />
      <rect x="142" y="50" width="70" height="30" rx="5" fill="white" />
      <rect x="142" y="50" width="70" height="30" rx="5" stroke="#e5e7eb" strokeWidth="0.5" fill="none" />
      <circle cx="152" cy="58" r="4" fill="#3B82F6" fillOpacity="0.15" />
      <rect x="160" y="56" width="26" height="2.5" rx="1" fill="#333" fillOpacity="0.2" />
      <rect x="148" y="66" width="22" height="7" rx="1" fill="#333" fillOpacity="0.5" />
      {/* Lead Temperatures card with donut chart */}
      <rect x="64" y="86" width="110" height="68" rx="5" fill="white" />
      <rect x="64" y="86" width="110" height="68" rx="5" stroke="#e5e7eb" strokeWidth="0.5" fill="none" />
      <rect x="72" y="92" width="44" height="3" rx="1.5" fill="#333" fillOpacity="0.2" />
      <rect x="72" y="100" width="20" height="6" rx="1" fill="#333" fillOpacity="0.45" />
      {/* Donut chart */}
      <circle cx="108" cy="126" r="18" stroke="#e5e7eb" strokeWidth="5" fill="none" />
      <circle cx="108" cy="126" r="18" stroke={color} strokeWidth="5" fill="none" strokeDasharray="28 85" strokeDashoffset="0" />
      <circle cx="108" cy="126" r="18" stroke="#EF4444" strokeWidth="5" fill="none" strokeDasharray="8 105" strokeDashoffset="-28" />
      <circle cx="108" cy="126" r="18" stroke="#3B82F6" strokeWidth="5" fill="none" strokeDasharray="12 101" strokeDashoffset="-36" />
      {/* Legend dots */}
      <circle cx="140" cy="110" r="2" fill="#EF4444" />
      <rect x="145" y="109" width="10" height="2.5" rx="1" fill="#333" fillOpacity="0.2" />
      <circle cx="140" cy="118" r="2" fill={color} />
      <rect x="145" y="117" width="14" height="2.5" rx="1" fill="#333" fillOpacity="0.2" />
      <circle cx="140" cy="126" r="2" fill="#3B82F6" />
      <rect x="145" y="125" width="10" height="2.5" rx="1" fill="#333" fillOpacity="0.2" />
      {/* Lead Owner Assignments card with pie chart */}
      <rect x="182" y="86" width="110" height="68" rx="5" fill="white" />
      <rect x="182" y="86" width="110" height="68" rx="5" stroke="#e5e7eb" strokeWidth="0.5" fill="none" />
      <rect x="190" y="92" width="52" height="3" rx="1.5" fill="#333" fillOpacity="0.2" />
      <rect x="190" y="100" width="14" height="6" rx="1" fill="#333" fillOpacity="0.45" />
      {/* Pie chart */}
      <circle cx="240" cy="126" r="18" fill="#3B82F6" fillOpacity="0.15" />
      <path d="M240 108 A18 18 0 0 1 258 126 L240 126 Z" fill="#3B82F6" fillOpacity="0.5" />
      <path d="M258 126 A18 18 0 0 1 240 144 L240 126 Z" fill={color} fillOpacity="0.5" />
      <path d="M240 144 A18 18 0 0 1 222 126 L240 126 Z" fill="#8B5CF6" fillOpacity="0.4" />
      <path d="M222 126 A18 18 0 0 1 240 108 L240 126 Z" fill="#10B981" fillOpacity="0.4" />
      {/* Average Session Duration — bottom bar chart */}
      <rect x="64" y="160" width="228" height="44" rx="5" fill="white" />
      <rect x="64" y="160" width="228" height="44" rx="5" stroke="#e5e7eb" strokeWidth="0.5" fill="none" />
      <rect x="72" y="166" width="56" height="3" rx="1.5" fill="#333" fillOpacity="0.2" />
      <rect x="72" y="174" width="24" height="5" rx="1" fill="#333" fillOpacity="0.45" />
      {/* Bar chart segments */}
      <rect x="72" y="186" width="60" height="10" rx="2" fill="#3B82F6" fillOpacity="0.4" />
      <rect x="132" y="186" width="80" height="10" rx="2" fill={color} fillOpacity="0.5" />
      <rect x="212" y="186" width="60" height="10" rx="2" fill="#8B5CF6" fillOpacity="0.35" />
      {/* Base / hinge */}
      <path d="M30 220 Q30 215 36 215 L384 215 Q390 215 390 220 L398 232 Q400 236 396 236 L24 236 Q20 236 22 232 Z" stroke="white" strokeOpacity="0.18" strokeWidth="1" fill="none" />
    </svg>
  );
}

export default function ProductShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % products.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const product = products[activeIndex];

  return (
    <div className="relative w-full flex flex-col">
      {/* Fixed-height device area */}
      <div className="relative overflow-hidden" style={{ height: "280px" }}>
        {/* Accent glow */}
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-700"
          style={{
            background: `radial-gradient(ellipse at center 40%, ${product.color}18 0%, transparent 70%)`,
          }}
        />

        {/* Device + overlay container */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -60, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* Device frame with perspective */}
            <div
              className="w-full"
              style={{
                transform: product.perspective,
                filter: product.shadow,
                transformStyle: "preserve-3d",
              }}
            >
              {product.device === "macbook-web" && (
                <WebDashboardFrame color={product.color} />
              )}
              {product.device === "ipad-iphone" && (
                <ExplorerFrame color={product.color} />
              )}
              {product.device === "macbook-intel" && (
                <IntelligenceDashboardFrame color={product.color} />
              )}
            </div>

            {/* Text overlay — offset to center on screen, not full device */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{ marginTop: product.textOffsetY }}
            >
              <div
                className="text-center px-6 py-4 rounded-xl"
                style={{
                  background: "linear-gradient(135deg, rgba(11,11,60,0.7) 0%, rgba(11,11,60,0.5) 100%)",
                  backdropFilter: "blur(4px)",
                }}
              >
                {/* Step pill */}
                <span
                  className="inline-block rounded-full px-3 py-0.5 mb-2"
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    fontFamily: "var(--font-inter)",
                    letterSpacing: "0.08em",
                    color: "#0CF4DF",
                    backgroundColor: "rgba(12,244,223,0.1)",
                    border: "1px solid rgba(12,244,223,0.19)",
                  }}
                >
                  STEP {product.step}
                </span>
                {/* Product name */}
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontWeight: 500,
                    fontSize: "15px",
                    color: "rgba(255,255,255,0.9)",
                    marginTop: "4px",
                  }}
                >
                  {product.name}
                </p>
                {/* Headline */}
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontWeight: 500,
                    fontSize: "19px",
                    letterSpacing: "-0.01em",
                    color: "white",
                    marginTop: "4px",
                  }}
                >
                  {product.headline}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Step progress indicator — anchored below fixed device area */}
      <div className="flex items-center justify-center gap-0 mt-5">
        {products.map((p, i) => (
          <div key={p.name} className="flex items-center">
            {i > 0 && (
              <div
                className="h-px w-8 transition-all duration-500"
                style={{
                  background: i <= activeIndex ? "linear-gradient(135deg, #0CF4DF, #5BA8F5)" : "rgba(255,255,255,0.15)",
                }}
              />
            )}
            <button
              onClick={() => setActiveIndex(i)}
              className="relative flex items-center justify-center w-6 h-6 rounded-full transition-all duration-400"
              style={{
                background: i === activeIndex ? "linear-gradient(135deg, #0CF4DF, #5BA8F5)" : "transparent",
                border: `1.5px solid ${i <= activeIndex ? "#0CF4DF" : "rgba(255,255,255,0.2)"}`,
              }}
              aria-label={p.name}
            >
              <span
                className="text-[10px] font-bold transition-colors duration-300"
                style={{
                  fontFamily: "var(--font-inter)",
                  color: i === activeIndex ? "#0B0B3C" : i < activeIndex ? "#0CF4DF" : "rgba(255,255,255,0.3)",
                }}
              >
                {p.step}
              </span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
