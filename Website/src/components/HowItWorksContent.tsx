"use client";

import { FireIcon } from "@heroicons/react/24/solid";
import { ScanBarcode } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import ShinyText from "@/components/ShinyText";

/* ── Animation variants (match codebase pattern) ───── */

const headerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ── Shared constants ──────────────────────────────── */

const depthGradient =
  "linear-gradient(135deg, #1A0533 0%, #070E2B 40%, #061341 70%, #070E2B 100%)";

const mainMinimal =
  "linear-gradient(135deg, #7C316D 0%, #0B0B3C 55%, #1A2E73 100%)";

const TEAL = "#00BBA5";

/** Heroicons Fire solid — temperature / intent indicator */
const FIRE_SOLID_RED = "rgb(232, 58, 90)";
const DEEP_NAVY = "#061341";
/** Primary Momentify blue — solid surfaces, CTAs */
const MOMENTIFY_BLUE = "#254FE5";
const AMBER = "#F2B33D";

/* ── Step colors (from brand palette) ──────────────── */

const STEP_COLORS = {
  web: "#00BBA5",
  explorer: "#00BBA5",
  intelligence: "#00BBA5",
  engage: "#00BBA5",
};

/* ── Main-Minimal SVG overlay ──────────────────────── */

const MainMinimalOverlay = () => (
  <svg
    className="pointer-events-none absolute inset-0 h-full w-full"
    viewBox="0 0 600 500"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMaxYMax slice"
    aria-hidden="true"
  >
    <path d="M600 500 L600 180 L420 0 L220 0 L440 220 L440 500 Z" fill="white" fillOpacity="0.05" />
    <path d="M600 500 L600 300 L380 80 L180 80 L380 280 L380 500 Z" fill="white" fillOpacity="0.04" />
    <path d="M600 500 L600 420 L510 330 L350 330 L510 500 Z" fill="white" fillOpacity="0.03" />
  </svg>
);

/* ── Data: Step nav pills ──────────────────────────── */

const stepNav = [
  { id: "web", label: "01 Web", color: STEP_COLORS.web },
  { id: "explorer", label: "02 Explorer", color: STEP_COLORS.explorer },
  { id: "intelligence", label: "03 Intelligence", color: STEP_COLORS.intelligence },
  { id: "engage", label: "04 Engage", color: STEP_COLORS.engage },
];

/* ── Data: Platform overview columns ───────────────── */

const platformColumns = [
  {
    label: "Before the moment",
    description: "Set up, configure, and deploy your custom experience in Momentify Web.",
    color: STEP_COLORS.web,
  },
  {
    label: "During the moment",
    description:
      "Engage visitors through Explorer on iPad, touch display, or mobile.",
    color: STEP_COLORS.explorer,
  },
  {
    label: "In the moment",
    description:
      "Score leads and uncover insights and ROX through Momentify Intelligence.",
    color: STEP_COLORS.intelligence,
  },
  {
    label: "After the moment",
    description:
      "Route follow-ups automatically with Momentify Engage.",
    color: STEP_COLORS.engage,
  },
];

/* ── Data: Key capabilities ────────────────────────── */

const capabilities = [
  {
    icon: "templates",
    name: "Moments and Templates",
    description:
      "Pre-built and custom templates for every vertical. Configure once, deploy across every moment on your calendar.",
  },
  {
    icon: "badge",
    name: "Badge Scanning and API Integration",
    description:
      "Works with XPress Leads, Cvent, and other badge scanning systems. Existing scan data flows into Momentify automatically.",
  },
  {
    icon: "capture",
    name: "Lead Capture",
    description:
      "QR code, form, database, and offline modes. Every visitor captured regardless of phone access or Wi-Fi availability.",
  },
  {
    icon: "analytics",
    name: "Detailed Analytics and Insights",
    description:
      "Real-time dashboards for every moment. Visitor counts, engagement depth, temperature breakdowns, and ROX score tracked live.",
  },
  {
    icon: "integrations",
    name: "Integrations and Intelligence",
    description:
      "CRM and ATS push on experience close. Lead data routes to the right system without manual export or data entry.",
  },
  {
    icon: "multichannel",
    name: "Multi-Channel Engagement",
    description:
      "iPad, touch display, mobile QR, and offline iPad modes. Momentify works in any environment your team operates in.",
  },
];

/* ── SVG Icon components ───────────────────────────── */

function IconTemplates() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="10" height="10" rx="2" stroke={TEAL} strokeWidth="1.8" />
      <rect x="18" y="4" width="10" height="10" rx="2" stroke={TEAL} strokeWidth="1.8" />
      <rect x="4" y="18" width="10" height="10" rx="2" stroke={TEAL} strokeWidth="1.8" />
      <rect x="18" y="18" width="10" height="10" rx="2" stroke={TEAL} strokeWidth="1.8" />
    </svg>
  );
}

function IconBadge() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="2" width="20" height="24" rx="3" stroke={TEAL} strokeWidth="1.8" />
      <circle cx="16" cy="12" r="4" stroke={TEAL} strokeWidth="1.8" />
      <line x1="11" y1="20" x2="21" y2="20" stroke={TEAL} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 26L16 30L20 26" stroke={TEAL} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconCapture() {
  return (
    <ScanBarcode aria-hidden width={32} height={32} className="shrink-0" color={TEAL} strokeWidth={1.8} />
  );
}

function IconAnalytics() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polyline points="4,24 10,16 16,20 22,8 28,12" stroke={TEAL} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="16" r="2" stroke={TEAL} strokeWidth="1.2" />
      <circle cx="16" cy="20" r="2" stroke={TEAL} strokeWidth="1.2" />
      <circle cx="22" cy="8" r="2" stroke={TEAL} strokeWidth="1.2" />
      <circle cx="28" cy="12" r="2" stroke={TEAL} strokeWidth="1.2" />
    </svg>
  );
}

function IconIntegrations() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="4" stroke={TEAL} strokeWidth="1.8" />
      <line x1="16" y1="4" x2="16" y2="12" stroke={TEAL} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="16" y1="20" x2="16" y2="28" stroke={TEAL} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="4" y1="16" x2="12" y2="16" stroke={TEAL} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="20" y1="16" x2="28" y2="16" stroke={TEAL} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="16" cy="4" r="2" stroke={TEAL} strokeWidth="1.2" />
      <circle cx="16" cy="28" r="2" stroke={TEAL} strokeWidth="1.2" />
      <circle cx="4" cy="16" r="2" stroke={TEAL} strokeWidth="1.2" />
      <circle cx="28" cy="16" r="2" stroke={TEAL} strokeWidth="1.2" />
    </svg>
  );
}

function IconMultichannel() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="3" stroke={TEAL} strokeWidth="1.8" />
      <path d="M16 6a10 10 0 017.07 2.93" stroke={TEAL} strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M16 6a10 10 0 00-7.07 2.93" stroke={TEAL} strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M16 26a10 10 0 007.07-2.93" stroke={TEAL} strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M16 26a10 10 0 01-7.07-2.93" stroke={TEAL} strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <circle cx="24" cy="8" r="2" stroke={TEAL} strokeWidth="1.4" />
      <circle cx="8" cy="8" r="2" stroke={TEAL} strokeWidth="1.4" />
      <circle cx="24" cy="24" r="2" stroke={TEAL} strokeWidth="1.4" />
      <circle cx="8" cy="24" r="2" stroke={TEAL} strokeWidth="1.4" />
    </svg>
  );
}

const iconMap: Record<string, () => React.ReactNode> = {
  templates: IconTemplates,
  badge: IconBadge,
  capture: IconCapture,
  analytics: IconAnalytics,
  integrations: IconIntegrations,
  multichannel: IconMultichannel,
};

/* ── Reusable sub-components ───────────────────────── */

function StepBadge({ num, dark, color = TEAL }: { num: string; dark?: boolean; color?: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: "var(--font-inter)",
        fontWeight: 600,
        fontSize: "11px",
        color,
        background: dark ? `${color}26` : `${color}14`,
        borderRadius: "20px",
        padding: "4px 12px",
        letterSpacing: "0.12em",
        marginBottom: "16px",
      }}
    >
      STEP {num}
    </span>
  );
}

function BulletList({ items, dark, color = TEAL }: { items: string[]; dark?: boolean; color?: string }) {
  return (
    <ul style={{ marginTop: "28px" }} className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-3">
          <span
            className="flex-shrink-0"
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: color,
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-inter)",
              fontWeight: 500,
              fontSize: "14px",
              color: dark ? "rgba(255,255,255,0.7)" : "rgba(6,19,65,0.6)",
            }}
          >
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

function PlaceholderCard({
  label,
  dark,
  height = "400px",
  comment,
}: {
  label: string;
  dark?: boolean;
  height?: string;
  comment?: string;
}) {
  return (
    <div
      style={{
        background: dark ? "rgba(6,19,65,0.4)" : "#F0F2F8",
        border: dark
          ? "1px solid rgba(255,255,255,0.08)"
          : "1px solid rgba(6,19,65,0.08)",
        borderRadius: "16px",
        height,
        overflow: "hidden",
        boxShadow: dark ? "none" : "0 8px 40px rgba(6,19,65,0.08)",
        backdropFilter: dark ? "blur(12px)" : "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* {comment} */}
      <p
        style={{
          fontFamily: "var(--font-inter)",
          fontWeight: 600,
          fontSize: "16px",
          color: dark ? "rgba(255,255,255,0.25)" : "rgba(6,19,65,0.3)",
        }}
      >
        {label}
      </p>
    </div>
  );
}

/* ── Step 1 auto-cycling slideshow ────────────────────── */

const step1Images = [
  "/how-it-works/step1/1.png",
  "/how-it-works/step1/2.png",
  "/how-it-works/step1/3.png",
  "/how-it-works/step1/4.png",
];

function Step1Slideshow() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % step1Images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        transform: "scale(1.1)",
        transformOrigin: "center center",
      }}
    >
      {step1Images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`Momentify Web - step ${i + 1}`}
          style={{
            position: i === 0 ? "relative" : "absolute",
            inset: 0,
            width: "100%",
            height: "auto",
            display: "block",
            opacity: active === i ? 1 : 0,
            transition: "opacity 1s ease-in-out",
          }}
        />
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   HOW IT WORKS PAGE
   ════════════════════════════════════════════════════════ */

export default function HowItWorksContent() {
  const [activeStep, setActiveStep] = useState("web");

  useEffect(() => {
    const sectionIds = ["web", "explorer", "intelligence", "engage"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveStep(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* ═══════════════════ 1. HERO ═══════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundSize: "200% 200%",
          animation: "bgShift 16s ease-in-out infinite",
          backgroundImage: mainMinimal,
          minHeight: "480px",
        }}
      >
        {/* Geometric SVG overlay (main-minimal) */}
        <MainMinimalOverlay />

        {/* Ambient glow orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute w-[600px] h-[600px] rounded-full opacity-[0.06] blur-[120px]" style={{ background: "radial-gradient(circle, #3A2073, transparent 70%)", top: "10%", left: "55%", animation: "ambientFloat1 12s ease-in-out infinite" }} />
          <div className="absolute w-[500px] h-[500px] rounded-full opacity-[0.04] blur-[100px]" style={{ background: "radial-gradient(circle, #00BBA5, transparent 70%)", bottom: "0%", left: "10%", animation: "ambientFloat2 15s ease-in-out infinite" }} />
          <div className="absolute w-[400px] h-[400px] rounded-full opacity-[0.04] blur-[80px]" style={{ background: "radial-gradient(circle, #1A56DB, transparent 70%)", top: "40%", right: "5%", animation: "ambientFloat3 18s ease-in-out infinite" }} />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12" style={{ paddingTop: "140px", paddingBottom: "80px" }}>
          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              fontFamily: "var(--font-inter)",
              fontWeight: 600,
              fontSize: "11px",
              color: TEAL,
              letterSpacing: "0.14em",
              textTransform: "uppercase" as const,
              marginBottom: "16px",
            }}
          >
            The Momentify Platform
          </motion.p>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18 }}
            className="leading-[1.05]"
            style={{
              fontFamily: "var(--font-inter)",
              fontWeight: 500,
              fontSize: "clamp(34px, 5vw, 52px)",
              color: "#FFFFFF",
              letterSpacing: "-0.02em",
              maxWidth: "820px",
              marginBottom: "24px",
            }}
          >
            Four steps.
            <br className="sm:hidden" />{" "}
            One platform.
            <br />
            Every interaction measured.
          </motion.h1>

          {/* Subhead */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            style={{
              fontFamily: "var(--font-inter)",
              fontWeight: 300,
              fontSize: "15px",
              color: "rgba(255, 255, 255, 0.55)",
              lineHeight: 1.5,
              maxWidth: "680px",
              marginBottom: "48px",
            }}
          >
            Momentify runs before, during, and after every moment. Setup happens in <strong>Web</strong>.
            <br className="hidden sm:block" />{" "}
            Engagement happens through <strong>Explorer</strong>. Insight comes from <strong>Intelligence</strong>.
            <br className="hidden sm:block" />{" "}
            Follow-up closes the loop with <strong>Engage</strong>.
          </motion.p>

          {/* Step nav pills */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.32 }}
            className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3"
          >
            {stepNav.map((step) => {
              const isActive = activeStep === step.id;
              return (
                <a
                  key={step.id}
                  href={`#${step.id}`}
                  className="transition-all duration-200"
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontWeight: 600,
                    fontSize: "13px",
                    color: isActive ? "#FFFFFF" : "rgba(255,255,255,0.4)",
                    background: isActive ? step.color : "transparent",
                    border: isActive
                      ? `1px solid ${step.color}`
                      : "1px solid rgba(255,255,255,0.15)",
                    padding: "8px 20px",
                    borderRadius: "20px",
                  }}
                >
                  {step.label}
                </a>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ 2. PLATFORM OVERVIEW STRIP ═══════════════════ */}
      <section style={{ background: "#FFFFFF", padding: "48px 0", borderBottom: "1px solid rgba(6,19,65,0.06)" }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
          className="mx-auto max-w-[1000px] px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0"
        >
          {platformColumns.map((col, i) => (
            <motion.div
              key={col.label}
              variants={fadeUp}
              style={{
                borderRight:
                  i < 3 ? "1px solid rgba(6,19,65,0.08)" : "none",
              }}
              className={`py-4 lg:py-0 border-b lg:border-b-0 border-b-[rgba(6,19,65,0.06)] last:border-b-0 ${i < 3 ? "lg:pr-8" : ""} ${i > 0 ? "lg:pl-8" : ""}`}
            >
              <div style={{ width: "24px", height: "3px", background: col.color, borderRadius: "2px", marginBottom: "12px" }} />
              <p
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 700,
                  fontSize: "13px",
                  color: DEEP_NAVY,
                  marginBottom: "6px",
                }}
              >
                {col.label}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 400,
                  fontSize: "13px",
                  color: "rgba(6,19,65,0.5)",
                  lineHeight: 1.5,
                }}
              >
                {col.description}
              </p>
              {col.label === "After the moment" && (
                <span
                  style={{
                    display: "inline-block",
                    fontFamily: "var(--font-inter)",
                    fontWeight: 600,
                    fontSize: "10px",
                    color: AMBER,
                    background: "rgba(242,179,61,0.12)",
                    borderRadius: "20px",
                    padding: "3px 10px",
                    marginTop: "8px",
                  }}
                >
                  Coming Soon
                </span>
              )}
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══════════════════ 3. STEP 1 — MOMENTIFY WEB ═══════════════════ */}
      <section id="web" style={{ background: "#F8F9FC", padding: "100px 0" }}>
        <div className="mx-auto max-w-[1100px] px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: copy */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={headerVariants}
            >
              <motion.div variants={fadeUp}>
                <StepBadge num="01" color={STEP_COLORS.web} />
              </motion.div>
              <motion.h2
                variants={fadeUp}
                className="leading-[1.1]"
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 500,
                  fontSize: "clamp(28px, 4.5vw, 40px)",
                  color: DEEP_NAVY,
                  letterSpacing: "-0.02em",
                  marginBottom: "8px",
                }}
              >
                Set up. Configure. Deploy.
              </motion.h2>
              <motion.p
                variants={fadeUp}
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 600,
                  fontSize: "16px",
                  color: STEP_COLORS.web,
                  marginBottom: "24px",
                }}
              >
                Momentify Web
              </motion.p>
              <motion.div variants={fadeUp}>
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontWeight: 400,
                    fontSize: "16px",
                    color: "rgba(6,19,65,0.55)",
                    lineHeight: 1.75,
                    marginBottom: "20px",
                  }}
                >
                  Before your team engages a single visitor, everything is already configured. Momentify Web is the admin and management layer. Experiences are created, templates are built, personas are defined, and content is loaded ahead of time.
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontWeight: 400,
                    fontSize: "16px",
                    color: "rgba(6,19,65,0.55)",
                    lineHeight: 1.75,
                  }}
                >
                  Whether it is a trade show booth, a field sales visit, or a facility tour, your team arrives ready. Web handles the configuration so Explorer can handle the moment.
                </p>
              </motion.div>
              <motion.div variants={fadeUp}>
                <BulletList
                  color={STEP_COLORS.web}
                  items={[
                    "Experience and workspace setup",
                    "Template and content management",
                    "Lead scoring configuration",
                    "Team and role management",
                  ]}
                />
              </motion.div>
            </motion.div>

            {/* Right: auto-cycling screenshots */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Step1Slideshow />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ 4. STEP 2 — MOMENTIFY EXPLORER ═══════════════════ */}
      <section id="explorer" style={{ background: "#FFFFFF", padding: "100px 0" }}>
        <div className="mx-auto max-w-[1100px] px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Visual placeholder (left on desktop, below on mobile) */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="order-2 lg:order-first"
            >
              {/* Replace with Momentify Explorer iPad and mobile UI screenshots */}
              <PlaceholderCard label="Momentify Explorer" height="480px" comment="Replace with Momentify Explorer iPad and mobile UI screenshots" />
            </motion.div>

            {/* Copy (right on desktop, first on mobile) */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={headerVariants}
              className="order-1 lg:order-last"
            >
              <motion.div variants={fadeUp}>
                <StepBadge num="02" color={STEP_COLORS.explorer} />
              </motion.div>
              <motion.h2
                variants={fadeUp}
                className="leading-[1.1]"
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 500,
                  fontSize: "clamp(28px, 4.5vw, 40px)",
                  color: DEEP_NAVY,
                  letterSpacing: "-0.02em",
                  marginBottom: "8px",
                }}
              >
                Engage. Capture. Score.
              </motion.h2>
              <motion.p
                variants={fadeUp}
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 600,
                  fontSize: "16px",
                  color: STEP_COLORS.explorer,
                  marginBottom: "24px",
                }}
              >
                Momentify Explorer
              </motion.p>
              <motion.div variants={fadeUp}>
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontWeight: 400,
                    fontSize: "16px",
                    color: "rgba(6,19,65,0.55)",
                    lineHeight: 1.75,
                    marginBottom: "20px",
                  }}
                >
                  Momentify Explorer is the visitor-facing layer. It runs on iPads, touch displays, and mobile devices. Visitors interact with role-specific content journeys, enter their information, and engage with your team in a way that feels like a product experience, not a clipboard.
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontWeight: 400,
                    fontSize: "16px",
                    color: "rgba(6,19,65,0.55)",
                    lineHeight: 1.75,
                  }}
                >
                  Every content selection, every conversation note, every opt-in is captured in real time. Explorer works offline too. If there is no Wi-Fi, interactions queue and sync when connectivity returns. No lost data, no workarounds. It works at a booth, in a lobby, or out in the field.
                </p>
              </motion.div>
              <motion.div variants={fadeUp}>
                <BulletList
                  color={STEP_COLORS.explorer}
                  items={[
                    "QR code and form-based lead capture",
                    "Persona-driven content delivery",
                    "Offline mode with automatic sync",
                    "Real-time lead temperature scoring",
                  ]}
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ 5. STEP 3 — MOMENTIFY INTELLIGENCE (AI Insights) ═══════════════════ */}
      <section
        id="intelligence"
        className="relative overflow-hidden"
        style={{
          backgroundImage: "linear-gradient(145deg, #EEF2FF 0%, #F5F7FF 100%)",
          padding: "100px 0",
        }}
      >
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 600 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMaxYMax slice"
          aria-hidden="true"
        >
          <path d="M600 500 L600 180 L420 0 L220 0 L440 220 L440 500 Z" fill="#254FE5" fillOpacity="0.04" />
          <path d="M600 500 L600 300 L380 80 L180 80 L380 280 L380 500 Z" fill="#1F3395" fillOpacity="0.03" />
        </svg>

        <div className="relative z-10 mx-auto max-w-[1100px] px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 lg:gap-16 items-center">
            {/* Left: step + copy */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={headerVariants}
            >
              <motion.div variants={fadeUp}>
                <StepBadge num="03" color={STEP_COLORS.intelligence} />
              </motion.div>
              <motion.p
                variants={fadeUp}
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 600,
                  fontSize: "11px",
                  color: TEAL,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase" as const,
                  marginBottom: "16px",
                }}
              >
                Momentify Intelligence
              </motion.p>
              <motion.h2
                variants={fadeUp}
                className="leading-[1.1]"
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 500,
                  fontSize: "clamp(28px, 4.5vw, 40px)",
                  color: DEEP_NAVY,
                  letterSpacing: "-0.02em",
                  marginBottom: "24px",
                }}
              >
                AI Insights. Auto-generated.
                <br />
                Actually useful.
              </motion.h2>
              <motion.div variants={fadeUp}>
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontWeight: 400,
                    fontSize: "16px",
                    color: "rgba(6,19,65,0.55)",
                    lineHeight: 1.75,
                    marginBottom: "20px",
                  }}
                >
                  Momentify Intelligence already surfaces your ROX score in real time. AI Insights takes it further. After every experience, you receive an auto-generated summary tailored to your use case, with specific recommendations on which leads to follow up with and why.
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontWeight: 400,
                    fontSize: "16px",
                    color: "rgba(6,19,65,0.55)",
                    lineHeight: 1.75,
                  }}
                >
                  Not a generic report. A summary that knows the difference between a trade show lead and a recruiting candidate. One that tells you what happened, what it means, and what to do next.
                </p>
              </motion.div>

              <motion.div variants={fadeUp} style={{ marginTop: "32px" }} className="space-y-5">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: TEAL, flexShrink: 0 }} />
                    <span style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "14px", color: DEEP_NAVY }}>
                      Event recap on close
                    </span>
                  </div>
                  <p style={{ fontFamily: "var(--font-inter)", fontWeight: 400, fontSize: "13px", color: "rgba(6,19,65,0.5)", lineHeight: 1.5, paddingLeft: "18px" }}>
                    Auto-generated summary the moment your experience ends. No manual writeup.
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: TEAL, flexShrink: 0 }} />
                    <span style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "14px", color: DEEP_NAVY }}>
                      Lead follow-up recommendations
                    </span>
                  </div>
                  <p style={{ fontFamily: "var(--font-inter)", fontWeight: 400, fontSize: "13px", color: "rgba(6,19,65,0.5)", lineHeight: 1.5, paddingLeft: "18px" }}>
                    Ranked list of who to contact first, based on engagement signals and intent data.
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right: Intelligence recap mock */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div
                style={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(6,19,65,0.08)",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 4px 24px rgba(6,19,65,0.06)",
                  minHeight: "420px",
                }}
              >
                <div
                  style={{
                    background: "linear-gradient(90deg, #1637AB 0%, #E83A5A 100%)",
                    padding: "18px 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "14px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "14px", minWidth: 0, flex: 1 }}>
                    <div
                      className="flex shrink-0 items-center justify-center rounded-full border border-white/28 bg-white/12"
                      style={{ width: 44, height: 44 }}
                    >
                      <img
                        src="/how-it-works/ai-sparkle-icon.png"
                        alt=""
                        width={20}
                        height={20}
                        className="size-5 object-contain"
                        aria-hidden
                      />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p
                        style={{
                          fontFamily: "var(--font-inter)",
                          margin: 0,
                          lineHeight: 1.25,
                        }}
                      >
                        <ShinyText
                          text="AI Event Summary"
                          className="font-bold text-[15px] tracking-[-0.02em]"
                          color="rgba(255,255,255,0.72)"
                          shineColor="#ffffff"
                          speed={2.5}
                          spread={100}
                        />
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--font-inter)",
                          fontWeight: 400,
                          fontSize: "11px",
                          color: "rgba(255,255,255,0.78)",
                          marginTop: "4px",
                          lineHeight: 1.35,
                        }}
                      >
                        Powered by Momentify Intelligence
                      </p>
                    </div>
                  </div>
                  <span
                    className="inline-flex shrink-0 items-center gap-1.5"
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontWeight: 600,
                      fontSize: "10px",
                      color: "#FFFFFF",
                      letterSpacing: "0.02em",
                      borderRadius: "9999px",
                      padding: "6px 12px 6px 10px",
                      background: "rgba(255,255,255,0.2)",
                      border: "1px solid rgba(255,255,255,0.28)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.22)",
                    }}
                  >
                    <img
                      src="/icons/crown-pro-filled.png"
                      alt=""
                      width={14}
                      height={14}
                      className="shrink-0 size-[14px] opacity-95"
                      aria-hidden
                    />
                    Pro Plan
                  </span>
                </div>

                <div style={{ padding: "24px 24px 28px" }}>
                <div style={{ marginBottom: "20px" }}>
                  <p style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "10px", color: "rgba(6,19,65,0.35)", textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: "8px" }}>
                    Event Summary
                  </p>
                  <p style={{ fontFamily: "var(--font-inter)", fontWeight: 400, fontSize: "13px", color: "rgba(6,19,65,0.55)", lineHeight: 1.6 }}>
                    347 visitors engaged across 2 days. Lead capture rate exceeded benchmark by 18%. Strongest engagement on Day 1 during morning sessions.
                  </p>
                </div>

                <div style={{ height: "1px", background: "rgba(6,19,65,0.06)", marginBottom: "20px" }} />

                <div style={{ marginBottom: "24px" }}>
                  <p style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "10px", color: "rgba(6,19,65,0.35)", textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: "8px" }}>
                    Key Recommendation
                  </p>
                  <p style={{ fontFamily: "var(--font-inter)", fontWeight: 400, fontSize: "13px", color: "rgba(6,19,65,0.55)", lineHeight: 1.6 }}>
                    Follow up with 12 high-intent leads within 24 hours. Three visitors returned to the booth twice and requested pricing.
                  </p>
                </div>

                <div style={{ height: "1px", background: "rgba(6,19,65,0.06)", marginBottom: "20px" }} />

                <p style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "12px", color: "rgba(6,19,65,0.45)", marginBottom: "12px" }}>
                  Top Leads to Follow Up With
                </p>
                <div className="space-y-3">
                  {[
                    { name: "Sarah M.", time: "Day 1, 10:42 AM" },
                    { name: "James R.", time: "Day 1, 2:18 PM" },
                    { name: "Lisa K.", time: "Day 2, 9:05 AM" },
                  ].map((lead) => (
                    <div key={lead.name} className="flex items-center justify-between">
                      <span style={{ fontFamily: "var(--font-inter)", fontWeight: 400, fontSize: "13px", color: "rgba(6,19,65,0.5)" }}>
                        {lead.name}
                      </span>
                      <div className="flex items-center gap-3">
                        <span style={{ fontFamily: "var(--font-inter)", fontWeight: 400, fontSize: "11px", color: "rgba(6,19,65,0.3)" }}>
                          {lead.time}
                        </span>
                        <FireIcon aria-hidden className="h-4 w-4 flex-shrink-0" style={{ color: FIRE_SOLID_RED }} />
                      </div>
                    </div>
                  ))}
                </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ 6. STEP 4 — MOMENTIFY ENGAGE ═══════════════════ */}
      <section id="engage" style={{ background: "#FFFFFF", padding: "100px 0" }}>
        <div className="mx-auto max-w-[1100px] px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Visual placeholder (left on desktop, below on mobile) */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="order-2 lg:order-first"
            >
              {/* Replace with Momentify Engage UI screenshot when available */}
              <PlaceholderCard label="Momentify Engage" height="400px" comment="Replace with Momentify Engage UI screenshot when available" />
            </motion.div>

            {/* Copy (right on desktop, first on mobile) */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={headerVariants}
              className="order-1 lg:order-last"
            >
              <motion.div variants={fadeUp}>
                <StepBadge num="04" color={STEP_COLORS.engage} />
              </motion.div>
              <motion.h2
                variants={fadeUp}
                className="leading-[1.1]"
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 500,
                  fontSize: "clamp(28px, 4.5vw, 40px)",
                  color: DEEP_NAVY,
                  letterSpacing: "-0.02em",
                  marginBottom: "8px",
                }}
              >
                Follow up. Convert.
                <br className="sm:hidden" />{" "}
                Close the loop.
              </motion.h2>
              <motion.p
                variants={fadeUp}
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 600,
                  fontSize: "16px",
                  color: STEP_COLORS.engage,
                  marginBottom: "24px",
                }}
              >
                Momentify Engage
              </motion.p>
              <motion.div variants={fadeUp}>
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontWeight: 400,
                    fontSize: "16px",
                    color: "rgba(6,19,65,0.55)",
                    lineHeight: 1.75,
                    marginBottom: "20px",
                  }}
                >
                  Momentify Engage automates the follow-up process. Leads are scored and routed to the right rep before the experience ends. Personalized outreach goes out the same day, not the same week. The gap between the interaction and the inbox closes.
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontWeight: 400,
                    fontSize: "16px",
                    color: "rgba(6,19,65,0.55)",
                    lineHeight: 1.75,
                  }}
                >
                  Follow-up speed is one of the four ROX categories for a reason. Intent fades fast after any interaction. Engage makes same-day contact the default, not the exception.
                </p>
              </motion.div>
              <motion.div variants={fadeUp}>
                <BulletList
                  color={STEP_COLORS.engage}
                  items={[
                    "Automated lead routing by score and role",
                    "Personalized follow-up sequence triggers",
                    "CRM and ATS push on experience close",
                    "Follow-up speed tracking in Intelligence",
                  ]}
                />
              </motion.div>
              {/* Coming Soon tag */}
              <motion.div variants={fadeUp} style={{ marginTop: "24px" }}>
                <span
                  style={{
                    display: "inline-block",
                    fontFamily: "var(--font-inter)",
                    fontWeight: 600,
                    fontSize: "11px",
                    color: AMBER,
                    background: "rgba(242,179,61,0.1)",
                    borderRadius: "20px",
                    padding: "4px 12px",
                  }}
                >
                  Coming Soon
                </span>
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontWeight: 400,
                    fontSize: "13px",
                    color: "rgba(6,19,65,0.4)",
                    lineHeight: 1.5,
                    marginTop: "8px",
                  }}
                >
                  Engage is in active development. Current customers receive follow-up workflow setup as part of onboarding.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ 7. KEY CAPABILITIES ═══════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundSize: "200% 200%",
          animation: "bgShift 16s ease-in-out infinite",
          backgroundImage: mainMinimal,
          padding: "100px 0",
        }}
      >
        <MainMinimalOverlay />
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute w-[500px] h-[500px] rounded-full opacity-[0.06] blur-[120px]" style={{ background: "radial-gradient(circle, #7C316D, transparent 70%)", top: "10%", right: "25%", animation: "ambientFloat1 12s ease-in-out infinite" }} />
          <div className="absolute w-[400px] h-[400px] rounded-full opacity-[0.04] blur-[100px]" style={{ background: "radial-gradient(circle, #1A56DB, transparent 70%)", bottom: "5%", left: "15%", animation: "ambientFloat2 15s ease-in-out infinite" }} />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={headerVariants}
          >
            <motion.p
              variants={fadeUp}
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 600,
                fontSize: "11px",
                color: TEAL,
                letterSpacing: "0.14em",
                textTransform: "uppercase" as const,
                marginBottom: "16px",
              }}
            >
              Key Capabilities
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="leading-[1.15]"
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 500,
                fontSize: "clamp(28px, 4.5vw, 38px)",
                color: "#FFFFFF",
                letterSpacing: "-0.02em",
                maxWidth: "640px",
                marginBottom: "16px",
              }}
            >
              Everything your team needs.
              <br />
              Nothing they don&apos;t.
            </motion.h2>
            <motion.p
              variants={fadeUp}
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 300,
                fontSize: "15px",
                color: "rgba(255,255,255,0.55)",
                lineHeight: 1.65,
                marginBottom: "64px",
              }}
            >
              Momentify is built for the teams doing the work, not for the teams writing the report about it.
            </motion.p>
          </motion.div>

          {/* 3x2 tile grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {capabilities.map((cap) => {
              const Icon = iconMap[cap.icon];
              return (
                <motion.div
                  key={cap.name}
                  variants={fadeUp}
                  className="transition-all duration-200 hover:-translate-y-1"
                  style={{
                    background: "rgba(6, 19, 65, 0.35)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "16px",
                    padding: "32px 28px",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <div style={{ marginBottom: "16px" }}>
                    {Icon && <Icon />}
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontWeight: 500,
                      fontSize: "16px",
                      color: "#FFFFFF",
                      marginBottom: "8px",
                    }}
                  >
                    {cap.name}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontWeight: 400,
                      fontSize: "14px",
                      color: "rgba(255,255,255,0.55)",
                      lineHeight: 1.6,
                    }}
                  >
                    {cap.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ 8. FINAL CTA ═══════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundSize: "200% 200%",
          animation: "bgShift 16s ease-in-out infinite",
          backgroundImage: mainMinimal,
        }}
      >
        {/* Geometric SVG overlay (main-minimal) */}
        <MainMinimalOverlay />

        {/* Ambient glow orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute w-[500px] h-[500px] rounded-full opacity-[0.06] blur-[120px]" style={{ background: "radial-gradient(circle, #7C316D, transparent 70%)", top: "20%", right: "30%", animation: "ambientFloat1 12s ease-in-out infinite" }} />
          <div className="absolute w-[400px] h-[400px] rounded-full opacity-[0.04] blur-[100px]" style={{ background: "radial-gradient(circle, #1A56DB, transparent 70%)", bottom: "10%", left: "20%", animation: "ambientFloat2 15s ease-in-out infinite" }} />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12" style={{ paddingTop: "80px", paddingBottom: "120px" }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={headerVariants}
            style={{ maxWidth: "640px" }}
          >
            <motion.p
              variants={fadeUp}
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 600,
                fontSize: "11px",
                color: TEAL,
                letterSpacing: "0.14em",
                textTransform: "uppercase" as const,
                marginBottom: "16px",
              }}
            >
              Get Started
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="leading-[1.1]"
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 500,
                fontSize: "clamp(32px, 4.5vw, 44px)",
                color: "#FFFFFF",
                letterSpacing: "-0.02em",
                marginBottom: "20px",
              }}
            >
              See it running on your next experience.
            </motion.h2>
            <motion.p
              variants={fadeUp}
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 300,
                fontSize: "15px",
                color: "rgba(255,255,255,0.6)",
                lineHeight: 1.65,
                maxWidth: "520px",
                marginBottom: "40px",
              }}
            >
              Book a demo and we will walk through the full platform with your team&apos;s use case in mind.
            </motion.p>

            {/* CTA pair */}
            <motion.div
              variants={fadeUp}
              className="flex flex-row gap-3 sm:gap-4"
            >
              {/* Primary */}
              <a
                href="/demo?source=how-it-works"
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
    </>
  );
}
