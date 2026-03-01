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
  },
  {
    name: "Momentify Explorer",
    step: 2,
    headline: "Engage. Capture. Contextualize.",
    color: "#6B21D4",
    device: "ipad-iphone" as const,
    perspective: "perspective(600px) rotateY(-16deg) rotateX(5deg)",
    shadow: "drop-shadow(0 12px 32px rgba(107,33,212,0.25))",
  },
  {
    name: "Momentify Intelligence",
    step: 3,
    headline: "Analyze. Score. Prove.",
    color: "#F2B33D",
    device: "macbook" as const,
    perspective: "none",
    shadow: "drop-shadow(0 8px 24px rgba(242,179,61,0.15))",
  },
];

function MacBookFrame({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 380 250" fill="none" className="w-full">
      <rect x="30" y="10" width="320" height="195" rx="10" stroke="white" strokeOpacity="0.25" strokeWidth="1.5" />
      <path d="M162 10 h56 v8 a4 4 0 0 1 -4 4 h-48 a4 4 0 0 1 -4 -4 Z" fill="rgba(255,255,255,0.1)" />
      <defs>
        <linearGradient id={`scr-${color.slice(1)}`} x1="36" y1="22" x2="344" y2="200" gradientUnits="userSpaceOnUse">
          <stop stopColor={color} stopOpacity="0.14" />
          <stop offset="1" stopColor={color} stopOpacity="0.03" />
        </linearGradient>
      </defs>
      <rect x="36" y="22" width="308" height="177" rx="3" fill={`url(#scr-${color.slice(1)})`} />
      <rect x="56" y="46" width="80" height="6" rx="3" fill="white" fillOpacity="0.08" />
      <rect x="56" y="62" width="140" height="4" rx="2" fill="white" fillOpacity="0.05" />
      <rect x="56" y="74" width="120" height="4" rx="2" fill="white" fillOpacity="0.05" />
      <rect x="56" y="100" width="200" height="60" rx="6" fill="white" fillOpacity="0.04" />
      <rect x="270" y="46" width="60" height="24" rx="4" fill={color} fillOpacity="0.15" />
      <path d="M10 210 Q10 205 16 205 L364 205 Q370 205 370 210 L378 222 Q380 226 376 226 L4 226 Q0 226 2 222 Z" stroke="white" strokeOpacity="0.18" strokeWidth="1" fill="none" />
    </svg>
  );
}

function TabletPhoneFrame({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 380 280" fill="none" className="w-full">
      <rect x="40" y="8" width="210" height="264" rx="14" stroke="white" strokeOpacity="0.25" strokeWidth="1.5" />
      <defs>
        <linearGradient id={`ipad-${color.slice(1)}`} x1="48" y1="18" x2="242" y2="262" gradientUnits="userSpaceOnUse">
          <stop stopColor={color} stopOpacity="0.14" />
          <stop offset="1" stopColor={color} stopOpacity="0.03" />
        </linearGradient>
      </defs>
      <rect x="48" y="18" width="194" height="244" rx="4" fill={`url(#ipad-${color.slice(1)})`} />
      <rect x="68" y="42" width="70" height="5" rx="2.5" fill="white" fillOpacity="0.08" />
      <rect x="68" y="56" width="110" height="3" rx="1.5" fill="white" fillOpacity="0.05" />
      <rect x="68" y="76" width="154" height="80" rx="6" fill="white" fillOpacity="0.04" />
      <rect x="112" y="252" width="66" height="4" rx="2" fill="white" fillOpacity="0.12" />
      <rect x="230" y="116" width="110" height="164" rx="16" stroke="white" strokeOpacity="0.3" strokeWidth="1.5" fill="rgba(11,11,60,0.85)" />
      <rect x="264" y="122" width="42" height="10" rx="5" fill="rgba(255,255,255,0.12)" />
      <defs>
        <linearGradient id={`iphone-${color.slice(1)}`} x1="236" y1="138" x2="334" y2="270" gradientUnits="userSpaceOnUse">
          <stop stopColor={color} stopOpacity="0.16" />
          <stop offset="1" stopColor={color} stopOpacity="0.04" />
        </linearGradient>
      </defs>
      <rect x="236" y="138" width="98" height="128" rx="3" fill={`url(#iphone-${color.slice(1)})`} />
      <rect x="248" y="156" width="50" height="4" rx="2" fill="white" fillOpacity="0.08" />
      <rect x="248" y="168" width="74" height="40" rx="4" fill="white" fillOpacity="0.04" />
      <rect x="262" y="272" width="46" height="3" rx="1.5" fill="white" fillOpacity="0.12" />
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
    <div className="relative w-full overflow-hidden">
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
          className="relative"
        >
          {/* Device frame with perspective */}
          <div
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

          {/* Text overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
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

      {/* Step progress indicator */}
      <div className="flex items-center justify-center gap-0 mt-5">
        {products.map((p, i) => (
          <div key={p.name} className="flex items-center">
            {/* Connector line (before nodes 2 and 3) */}
            {i > 0 && (
              <div
                className="h-px w-8 transition-all duration-500"
                style={{
                  backgroundColor: i <= activeIndex ? products[i - 1].color : "rgba(255,255,255,0.15)",
                }}
              />
            )}
            {/* Step node */}
            <button
              onClick={() => setActiveIndex(i)}
              className="relative flex items-center justify-center w-6 h-6 rounded-full transition-all duration-400"
              style={{
                backgroundColor: i === activeIndex ? p.color : "transparent",
                border: `1.5px solid ${i <= activeIndex ? p.color : "rgba(255,255,255,0.2)"}`,
              }}
              aria-label={p.name}
            >
              <span
                className="text-[10px] font-bold transition-colors duration-300"
                style={{
                  fontFamily: "var(--font-inter)",
                  color: i === activeIndex ? "#0B0B3C" : i < activeIndex ? p.color : "rgba(255,255,255,0.3)",
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
