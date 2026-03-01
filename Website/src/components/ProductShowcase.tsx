"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const products = [
  {
    name: "Momentify Web",
    step: 1,
    headline: "Set up. Configure. Deploy.",
    color: "#5FD9C2",
    device: "macbook" as const,
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
    device: "macbook" as const,
    perspective: "none",
    shadow: "drop-shadow(0 8px 24px rgba(242,179,61,0.15))",
    textOffsetY: -20,
  },
];

function MacBookFrame({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 420 280" fill="none" className="w-full">
      <rect x="50" y="20" width="320" height="195" rx="10" stroke="white" strokeOpacity="0.25" strokeWidth="1.5" />
      <path d="M182 20 h56 v8 a4 4 0 0 1 -4 4 h-48 a4 4 0 0 1 -4 -4 Z" fill="rgba(255,255,255,0.1)" />
      <defs>
        <linearGradient id={`scr-${color.slice(1)}`} x1="56" y1="32" x2="364" y2="210" gradientUnits="userSpaceOnUse">
          <stop stopColor={color} stopOpacity="0.14" />
          <stop offset="1" stopColor={color} stopOpacity="0.03" />
        </linearGradient>
      </defs>
      <rect x="56" y="32" width="308" height="177" rx="3" fill={`url(#scr-${color.slice(1)})`} />
      <rect x="76" y="56" width="80" height="6" rx="3" fill="white" fillOpacity="0.08" />
      <rect x="76" y="72" width="140" height="4" rx="2" fill="white" fillOpacity="0.05" />
      <rect x="76" y="84" width="120" height="4" rx="2" fill="white" fillOpacity="0.05" />
      <rect x="76" y="110" width="200" height="60" rx="6" fill="white" fillOpacity="0.04" />
      <rect x="290" y="56" width="60" height="24" rx="4" fill={color} fillOpacity="0.15" />
      <path d="M30 220 Q30 215 36 215 L384 215 Q390 215 390 220 L398 232 Q400 236 396 236 L24 236 Q20 236 22 232 Z" stroke="white" strokeOpacity="0.18" strokeWidth="1" fill="none" />
    </svg>
  );
}

function TabletPhoneFrame({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 420 280" fill="none" className="w-full">
      {/* iPad — landscape orientation */}
      <rect x="40" y="50" width="260" height="180" rx="14" stroke="white" strokeOpacity="0.25" strokeWidth="1.5" />
      {/* Camera dot (top center for landscape) */}
      <circle cx="170" cy="57" r="2.5" fill="white" fillOpacity="0.12" />
      <defs>
        <linearGradient id={`ipad-${color.slice(1)}`} x1="50" y1="62" x2="290" y2="222" gradientUnits="userSpaceOnUse">
          <stop stopColor={color} stopOpacity="0.14" />
          <stop offset="1" stopColor={color} stopOpacity="0.03" />
        </linearGradient>
      </defs>
      <rect x="50" y="62" width="240" height="156" rx="4" fill={`url(#ipad-${color.slice(1)})`} />
      {/* Screen content placeholders */}
      <rect x="66" y="82" width="90" height="5" rx="2.5" fill="white" fillOpacity="0.08" />
      <rect x="66" y="96" width="140" height="3" rx="1.5" fill="white" fillOpacity="0.05" />
      <rect x="66" y="114" width="200" height="70" rx="6" fill="white" fillOpacity="0.04" />
      {/* Home indicator */}
      <rect x="138" y="224" width="64" height="3.5" rx="1.75" fill="white" fillOpacity="0.12" />

      {/* iPhone — portrait orientation, overlapping iPad bottom-right */}
      <rect x="280" y="100" width="80" height="155" rx="16" stroke="white" strokeOpacity="0.3" strokeWidth="1.5" fill="rgba(11,11,60,0.85)" />
      {/* Dynamic island */}
      <rect x="304" y="108" width="32" height="9" rx="4.5" fill="rgba(255,255,255,0.12)" />
      <defs>
        <linearGradient id={`iphone-${color.slice(1)}`} x1="286" y1="122" x2="354" y2="248" gradientUnits="userSpaceOnUse">
          <stop stopColor={color} stopOpacity="0.16" />
          <stop offset="1" stopColor={color} stopOpacity="0.04" />
        </linearGradient>
      </defs>
      <rect x="286" y="122" width="68" height="120" rx="3" fill={`url(#iphone-${color.slice(1)})`} />
      {/* Phone screen content */}
      <rect x="296" y="138" width="44" height="4" rx="2" fill="white" fillOpacity="0.08" />
      <rect x="296" y="150" width="48" height="36" rx="4" fill="white" fillOpacity="0.04" />
      {/* Home indicator */}
      <rect x="303" y="247" width="34" height="3" rx="1.5" fill="white" fillOpacity="0.12" />
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
              {product.device === "macbook" ? (
                <MacBookFrame color={product.color} />
              ) : (
                <TabletPhoneFrame color={product.color} />
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
                    color: product.color,
                    backgroundColor: `${product.color}1A`,
                    border: `1px solid ${product.color}30`,
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
