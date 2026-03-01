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
    screenshot: "/screenshot-momentifyweb.png",
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
    screenshot: "/screenshot-momentifyexplorer_ipad.png",
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
    screenshot: "/screenshot-momentifyintelligence.png",
  },
];

function MacBookFrame({ color, screenshot }: { color: string; screenshot: string }) {
  // Screen area in viewBox (420x280): x=56 y=32 w=308 h=177
  // As percentages: left=13.33% top=11.43% width=73.33% height=63.21%
  return (
    <div className="relative w-full">
      <svg viewBox="0 0 420 280" fill="none" className="w-full">
        {/* Lid / display shell */}
        <rect x="50" y="20" width="320" height="195" rx="10" stroke="white" strokeOpacity="0.25" strokeWidth="1.5" />
        {/* Camera notch */}
        <path d="M182 20 h56 v8 a4 4 0 0 1 -4 4 h-48 a4 4 0 0 1 -4 -4 Z" fill="rgba(255,255,255,0.1)" />
        {/* Screen background */}
        <rect x="56" y="32" width="308" height="177" rx="3" fill="rgba(0,0,0,0.3)" />
        {/* Base / hinge */}
        <path d="M30 220 Q30 215 36 215 L384 215 Q390 215 390 220 L398 232 Q400 236 396 236 L24 236 Q20 236 22 232 Z" stroke="white" strokeOpacity="0.18" strokeWidth="1" fill="none" />
      </svg>
      {/* Screenshot positioned over the screen area */}
      <img
        src={screenshot}
        alt=""
        className="absolute rounded-[1px] pointer-events-none"
        style={{
          left: "13.33%",
          top: "11.43%",
          width: "73.33%",
          height: "63.21%",
          objectFit: "cover",
        }}
      />
    </div>
  );
}

function TabletPhoneFrame({ color, screenshot }: { color: string; screenshot: string }) {
  // iPad screen in viewBox (420x280): x=50 y=62 w=240 h=156
  // As percentages: left=11.9% top=22.14% width=57.14% height=55.71%
  return (
    <div className="relative w-full">
      <svg viewBox="0 0 420 280" fill="none" className="w-full">
        {/* iPad — landscape orientation */}
        <rect x="40" y="50" width="260" height="180" rx="14" stroke="white" strokeOpacity="0.25" strokeWidth="1.5" />
        {/* Camera dot */}
        <circle cx="170" cy="57" r="2.5" fill="white" fillOpacity="0.12" />
        {/* iPad screen background */}
        <rect x="50" y="62" width="240" height="156" rx="4" fill="rgba(0,0,0,0.3)" />
        {/* Home indicator */}
        <rect x="138" y="224" width="64" height="3.5" rx="1.75" fill="white" fillOpacity="0.12" />

        {/* iPhone — portrait, overlapping iPad bottom-right */}
        <rect x="280" y="100" width="80" height="155" rx="16" stroke="white" strokeOpacity="0.3" strokeWidth="1.5" fill="rgba(11,11,60,0.85)" />
        {/* Dynamic island */}
        <rect x="304" y="108" width="32" height="9" rx="4.5" fill="rgba(255,255,255,0.12)" />
        {/* Phone screen — white background with UI elements */}
        <rect x="286" y="122" width="68" height="120" rx="3" fill="white" />
        {/* Status bar */}
        <rect x="290" y="125" width="16" height="2" rx="1" fill="#333" fillOpacity="0.3" />
        <rect x="336" y="125" width="14" height="2" rx="1" fill="#333" fillOpacity="0.3" />
        {/* App header */}
        <rect x="290" y="132" width="36" height="3" rx="1.5" fill={color} fillOpacity="0.7" />
        {/* Card 1 */}
        <rect x="290" y="140" width="60" height="28" rx="3" fill="#F3F4F6" />
        <rect x="294" y="144" width="24" height="2.5" rx="1" fill="#333" fillOpacity="0.25" />
        <rect x="294" y="150" width="40" height="2" rx="1" fill="#333" fillOpacity="0.12" />
        <rect x="294" y="156" width="32" height="2" rx="1" fill="#333" fillOpacity="0.12" />
        <circle cx="340" cy="152" r="5" fill={color} fillOpacity="0.15" />
        {/* Card 2 */}
        <rect x="290" y="172" width="60" height="28" rx="3" fill="#F3F4F6" />
        <rect x="294" y="176" width="28" height="2.5" rx="1" fill="#333" fillOpacity="0.25" />
        <rect x="294" y="182" width="44" height="2" rx="1" fill="#333" fillOpacity="0.12" />
        <rect x="294" y="188" width="36" height="2" rx="1" fill="#333" fillOpacity="0.12" />
        <circle cx="340" cy="184" r="5" fill={color} fillOpacity="0.15" />
        {/* Card 3 */}
        <rect x="290" y="204" width="60" height="28" rx="3" fill="#F3F4F6" />
        <rect x="294" y="208" width="20" height="2.5" rx="1" fill="#333" fillOpacity="0.25" />
        <rect x="294" y="214" width="38" height="2" rx="1" fill="#333" fillOpacity="0.12" />
        <rect x="294" y="220" width="30" height="2" rx="1" fill="#333" fillOpacity="0.12" />
        <circle cx="340" cy="216" r="5" fill={color} fillOpacity="0.15" />
        {/* Home indicator */}
        <rect x="303" y="247" width="34" height="3" rx="1.5" fill="#333" fillOpacity="0.15" />
      </svg>
      {/* iPad screenshot positioned over screen area */}
      <img
        src={screenshot}
        alt=""
        className="absolute rounded-[1px] pointer-events-none"
        style={{
          left: "11.9%",
          top: "22.14%",
          width: "57.14%",
          height: "55.71%",
          objectFit: "cover",
        }}
      />
    </div>
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
                <MacBookFrame color={product.color} screenshot={product.screenshot} />
              ) : (
                <TabletPhoneFrame color={product.color} screenshot={product.screenshot} />
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
