"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const products = [
  {
    name: "Momentify Web",
    color: "#5FD9C2",
    device: "macbook" as const,
  },
  {
    name: "Momentify Explorer",
    color: "#6B21D4",
    device: "ipad-iphone" as const,
  },
  {
    name: "Momentify Intelligence",
    color: "#F2B33D",
    device: "macbook" as const,
  },
];

function MacBookFrame({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 380 250" fill="none" className="w-full">
      {/* Screen bezel */}
      <rect x="30" y="10" width="320" height="195" rx="10" stroke="white" strokeOpacity="0.25" strokeWidth="1.5" />
      {/* Notch */}
      <path d="M162 10 h56 v8 a4 4 0 0 1 -4 4 h-48 a4 4 0 0 1 -4 -4 Z" fill="rgba(255,255,255,0.1)" />
      {/* Screen content */}
      <defs>
        <linearGradient id={`scr-${color.slice(1)}`} x1="36" y1="22" x2="344" y2="200" gradientUnits="userSpaceOnUse">
          <stop stopColor={color} stopOpacity="0.14" />
          <stop offset="1" stopColor={color} stopOpacity="0.03" />
        </linearGradient>
      </defs>
      <rect x="36" y="22" width="308" height="177" rx="3" fill={`url(#scr-${color.slice(1)})`} />
      {/* Fake UI lines */}
      <rect x="56" y="46" width="80" height="6" rx="3" fill="white" fillOpacity="0.08" />
      <rect x="56" y="62" width="140" height="4" rx="2" fill="white" fillOpacity="0.05" />
      <rect x="56" y="74" width="120" height="4" rx="2" fill="white" fillOpacity="0.05" />
      <rect x="56" y="100" width="200" height="60" rx="6" fill="white" fillOpacity="0.04" />
      <rect x="270" y="46" width="60" height="24" rx="4" fill={color} fillOpacity="0.15" />
      {/* Hinge/base */}
      <path d="M10 210 Q10 205 16 205 L364 205 Q370 205 370 210 L378 222 Q380 226 376 226 L4 226 Q0 226 2 222 Z" stroke="white" strokeOpacity="0.18" strokeWidth="1" fill="none" />
    </svg>
  );
}

function TabletPhoneFrame({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 380 280" fill="none" className="w-full">
      {/* iPad frame */}
      <rect x="40" y="8" width="210" height="264" rx="14" stroke="white" strokeOpacity="0.25" strokeWidth="1.5" />
      {/* iPad screen */}
      <defs>
        <linearGradient id={`ipad-${color.slice(1)}`} x1="48" y1="18" x2="242" y2="262" gradientUnits="userSpaceOnUse">
          <stop stopColor={color} stopOpacity="0.14" />
          <stop offset="1" stopColor={color} stopOpacity="0.03" />
        </linearGradient>
      </defs>
      <rect x="48" y="18" width="194" height="244" rx="4" fill={`url(#ipad-${color.slice(1)})`} />
      {/* iPad fake UI */}
      <rect x="68" y="42" width="70" height="5" rx="2.5" fill="white" fillOpacity="0.08" />
      <rect x="68" y="56" width="110" height="3" rx="1.5" fill="white" fillOpacity="0.05" />
      <rect x="68" y="76" width="154" height="80" rx="6" fill="white" fillOpacity="0.04" />
      {/* iPad home indicator */}
      <rect x="112" y="252" width="66" height="4" rx="2" fill="white" fillOpacity="0.12" />

      {/* iPhone frame (overlapping bottom-right) */}
      <rect x="230" y="116" width="110" height="164" rx="16" stroke="white" strokeOpacity="0.3" strokeWidth="1.5" fill="rgba(11,11,60,0.85)" />
      {/* Dynamic island */}
      <rect x="264" y="122" width="42" height="10" rx="5" fill="rgba(255,255,255,0.12)" />
      {/* iPhone screen */}
      <defs>
        <linearGradient id={`iphone-${color.slice(1)}`} x1="236" y1="138" x2="334" y2="270" gradientUnits="userSpaceOnUse">
          <stop stopColor={color} stopOpacity="0.16" />
          <stop offset="1" stopColor={color} stopOpacity="0.04" />
        </linearGradient>
      </defs>
      <rect x="236" y="138" width="98" height="128" rx="3" fill={`url(#iphone-${color.slice(1)})`} />
      {/* iPhone fake UI */}
      <rect x="248" y="156" width="50" height="4" rx="2" fill="white" fillOpacity="0.08" />
      <rect x="248" y="168" width="74" height="40" rx="4" fill="white" fillOpacity="0.04" />
      {/* iPhone home indicator */}
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
    <div className="relative w-full">
      {/* Accent glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(ellipse at center 40%, ${product.color}18 0%, transparent 70%)`,
        }}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {product.device === "macbook" ? (
            <MacBookFrame color={product.color} />
          ) : (
            <TabletPhoneFrame color={product.color} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Product name */}
      <AnimatePresence mode="wait">
        <motion.p
          key={`name-${activeIndex}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.4 }}
          className="text-center mt-3"
          style={{
            fontFamily: "var(--font-inter)",
            fontWeight: 500,
            fontSize: "17px",
            letterSpacing: "-0.01em",
            color: product.color,
          }}
        >
          {product.name}
        </motion.p>
      </AnimatePresence>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {products.map((p, i) => (
          <button
            key={p.name}
            onClick={() => setActiveIndex(i)}
            className="w-1.5 h-1.5 rounded-full transition-all duration-300"
            style={{
              backgroundColor: i === activeIndex ? p.color : "rgba(255,255,255,0.2)",
              transform: i === activeIndex ? "scale(1.4)" : "scale(1)",
            }}
            aria-label={p.name}
          />
        ))}
      </div>
    </div>
  );
}
