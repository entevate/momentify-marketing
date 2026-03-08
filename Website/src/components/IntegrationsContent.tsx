"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import FinalCTA from "@/components/FinalCTA";

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

const mainMinimal =
  "linear-gradient(135deg, #7C316D 0%, #0B0B3C 55%, #1A2E73 100%)";

const TEAL = "#00BBA5";
const DEEP_NAVY = "#061341";

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

/* ── Data: Categories ──────────────────────────────── */

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "crm", label: "CRM" },
  { id: "ats", label: "ATS" },
  { id: "data", label: "Data Analysis" },
  { id: "productivity", label: "Productivity" },
  { id: "automation", label: "Automation" },
  { id: "cms", label: "CMS" },
  { id: "storage", label: "File Storage" },
  { id: "registration", label: "Registration Mode" },
] as const;

type CategoryId = (typeof CATEGORIES)[number]["id"];

/* ── Data: Integrations ────────────────────────────── */

interface Integration {
  name: string;
  category: Exclude<CategoryId, "all">;
  description: string;
  logo: string;
}

const INTEGRATIONS: Integration[] = [
  // CRM
  { name: "Attio", category: "crm", logo: "/logos/integrations/attio.svg", description: "Modern CRM for relationship-driven teams. Push leads and engagement data directly into Attio workspaces." },
  { name: "Salesforce", category: "crm", logo: "/logos/integrations/salesforce.svg", description: "Enterprise CRM integration. Route scored leads and interaction data to the right Salesforce objects automatically." },
  { name: "HubSpot", category: "crm", logo: "/logos/integrations/hubspot.svg", description: "Inbound CRM platform. Sync contacts, companies, and engagement scores from Momentify into HubSpot." },
  { name: "Zoho", category: "crm", logo: "/logos/integrations/zoho.svg", description: "Unified CRM suite. Map Momentify lead fields to Zoho modules and trigger workflows on sync." },
  { name: "Microsoft Dynamics", category: "crm", logo: "/logos/integrations/dynamics.svg", description: "Enterprise relationship management. Push interaction records and lead scores into Dynamics 365." },
  { name: "Pipedrive", category: "crm", logo: "/logos/integrations/pipedrive.svg", description: "Sales-focused CRM. Create deals and contacts from Momentify lead data with automatic pipeline placement." },

  // ATS
  { name: "ADP", category: "ats", logo: "/logos/integrations/adp.svg", description: "HR and talent management platform. Sync recruiting event candidates and engagement scores." },
  { name: "Workday", category: "ats", logo: "/logos/integrations/workday.svg", description: "Enterprise HR platform. Route candidate interaction data from recruiting events into Workday." },
  { name: "iCIMS", category: "ats", logo: "/logos/integrations/icims.svg", description: "Talent acquisition suite. Push candidate profiles and engagement signals from recruiting moments." },
  { name: "UKG", category: "ats", logo: "/logos/integrations/ukg.svg", description: "Workforce management platform. Connect recruiting event data to UKG talent workflows." },

  // Data Analysis
  { name: "Tableau", category: "data", logo: "/logos/integrations/tableau.svg", description: "Advanced analytics and visualization. Export Momentify engagement data for custom dashboards and reporting." },
  { name: "Power BI", category: "data", logo: "/logos/integrations/powerbi.svg", description: "Business intelligence platform. Connect Momentify data sources for custom ROX and engagement reporting." },
  { name: "Microsoft Excel", category: "data", logo: "/logos/integrations/excel.svg", description: "Spreadsheet export and reporting. Download structured lead and engagement data in Excel format." },
  { name: "Google Sheets", category: "data", logo: "/logos/integrations/google-sheets.svg", description: "Cloud spreadsheet sync. Push real-time engagement and lead data to shared Google Sheets." },

  // Productivity
  { name: "Microsoft Teams", category: "productivity", logo: "/logos/integrations/teams.svg", description: "Team collaboration. Receive real-time Momentify notifications and lead alerts in Teams channels." },
  { name: "Slack", category: "productivity", logo: "/logos/integrations/slack.svg", description: "Messaging and alerts. Get instant lead capture notifications and ROX updates in Slack channels." },

  // Automation
  { name: "Zapier", category: "automation", logo: "/logos/integrations/zapier.svg", description: "Workflow automation. Connect Momentify to 5,000+ apps with triggers for new leads, scores, and events." },
  { name: "IFTTT", category: "automation", logo: "/logos/integrations/ifttt.svg", description: "Simple automation. Create applets that trigger actions when Momentify captures new engagement data." },

  // CMS
  { name: "Adobe Experience Manager", category: "cms", logo: "/logos/integrations/adobe.svg", description: "Enterprise content platform. Pull content from AEM into Momentify experiences for consistent brand delivery." },

  // File Storage
  { name: "SharePoint", category: "storage", logo: "/logos/integrations/sharepoint.svg", description: "Enterprise file management. Store and retrieve Momentify content assets and export reports to SharePoint." },
  { name: "Dropbox", category: "storage", logo: "/logos/integrations/dropbox.svg", description: "Cloud storage. Sync presentation content and export engagement reports to Dropbox folders." },
  { name: "Box", category: "storage", logo: "/logos/integrations/box.svg", description: "Secure file sharing. Connect Box for content delivery and lead data export storage." },

  // Registration Mode
  { name: "XPress Leads", category: "registration", logo: "/logos/integrations/xpress.svg", description: "Badge scanning integration. Scan attendee badges and enrich with Momentify engagement and scoring data." },
  { name: "Cvent", category: "registration", logo: "/logos/integrations/cvent.svg", description: "Event management platform. Pull registration data from Cvent and overlay Momentify engagement metrics." },
];

/* ── Animated SVG constellation graphic ────────────── */

const IntegrationsGraphic = () => {
  const CENTER = 250;
  const OUTER_R = 190;
  const INNER_R = 125;
  const CARD_SIZE = 56;
  const ICON_SIZE = 40;
  const OUTER_SPEED = "120s";
  const INNER_SPEED = "90s";

  const pos = (angle: number, radius: number) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: CENTER + radius * Math.cos(rad),
      y: CENTER + radius * Math.sin(rad),
    };
  };

  const outerIcons = [
    { src: "/logos/integrations/zapier.svg", name: "Zapier", angle: 0 },
    { src: "/logos/integrations/salesforce.svg", name: "Salesforce", angle: 130 },
    { src: "/logos/integrations/google-sheets.svg", name: "Google Sheets", angle: 250 },
  ];

  const innerIcons = [
    { src: "/logos/integrations/hubspot.svg", name: "HubSpot", angle: 60 },
    { src: "/logos/integrations/dynamics.svg", name: "Dynamics", angle: 210 },
  ];

  const outerDots = [pos(65, OUTER_R), pos(190, OUTER_R), pos(310, OUTER_R)];
  const innerDots = [pos(135, INNER_R), pos(315, INNER_R)];

  return (
    <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[450px]">
      <defs>
        <linearGradient id="depthCardGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7C316D" />
          <stop offset="45%" stopColor="#0B0B3C" />
          <stop offset="100%" stopColor="#1A2E73" />
        </linearGradient>
        <linearGradient id="mfyIconBg" x1="1343.58" y1="32.2039" x2="8.27286" y2="42.5468" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00D7BE" />
          <stop offset="1" stopColor="#254FE5" />
        </linearGradient>
      </defs>
      <style>{`
        @keyframes orbitDash { 0% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: -200; } }
        @keyframes orbitRotate { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes orbitCounterRotate { 0% { transform: rotate(0deg); } 100% { transform: rotate(-360deg); } }
      `}</style>
      {/* Orbit ring dashed circles */}
      <circle
        cx={CENTER} cy={CENTER} r={OUTER_R}
        fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5"
        strokeDasharray="8 12"
        style={{ animation: "orbitDash 50s linear infinite" }}
      />
      <circle
        cx={CENTER} cy={CENTER} r={INNER_R}
        fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1"
        strokeDasharray="6 10"
        style={{ animation: "orbitDash 35s linear infinite reverse" }}
      />

      {/* Outer orbit group — rotates clockwise */}
      <g style={{ transformOrigin: `${CENTER}px ${CENTER}px`, animation: `orbitRotate ${OUTER_SPEED} linear infinite` }}>
        {outerIcons.map((icon) => {
          const p = pos(icon.angle, OUTER_R);
          return (
            <g key={icon.name}>
              <line x1={CENTER} y1={CENTER} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4 8" />
              <g style={{ transformOrigin: `${p.x}px ${p.y}px`, animation: `orbitCounterRotate ${OUTER_SPEED} linear infinite` }}>
                <rect x={p.x - CARD_SIZE / 2} y={p.y - CARD_SIZE / 2} width={CARD_SIZE} height={CARD_SIZE} rx={12} fill="url(#depthCardGrad)" stroke="rgba(255,255,255,0.12)" strokeWidth={1} opacity={0.55} />
                <image href={icon.src} x={p.x - ICON_SIZE / 2} y={p.y - ICON_SIZE / 2} width={ICON_SIZE} height={ICON_SIZE} preserveAspectRatio="xMidYMid meet" />
              </g>
            </g>
          );
        })}
        {outerDots.map((d, i) => (
          <circle key={`od${i}`} cx={d.x} cy={d.y} r={3} fill="rgba(255,255,255,0.2)" />
        ))}
      </g>

      {/* Inner orbit group — rotates counter-clockwise */}
      <g style={{ transformOrigin: `${CENTER}px ${CENTER}px`, animation: `orbitCounterRotate ${INNER_SPEED} linear infinite` }}>
        {innerIcons.map((icon) => {
          const p = pos(icon.angle, INNER_R);
          return (
            <g key={icon.name}>
              <line x1={CENTER} y1={CENTER} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4 8" />
              <g style={{ transformOrigin: `${p.x}px ${p.y}px`, animation: `orbitRotate ${INNER_SPEED} linear infinite` }}>
                <rect x={p.x - CARD_SIZE / 2} y={p.y - CARD_SIZE / 2} width={CARD_SIZE} height={CARD_SIZE} rx={12} fill="url(#depthCardGrad)" stroke="rgba(255,255,255,0.12)" strokeWidth={1} opacity={0.55} />
                <image href={icon.src} x={p.x - ICON_SIZE / 2} y={p.y - ICON_SIZE / 2} width={ICON_SIZE} height={ICON_SIZE} preserveAspectRatio="xMidYMid meet" />
              </g>
            </g>
          );
        })}
        {innerDots.map((d, i) => (
          <circle key={`id${i}`} cx={d.x} cy={d.y} r={2.5} fill="rgba(255,255,255,0.15)" />
        ))}
      </g>

      {/* Center: Primary Momentify app icon */}
      <image href="/Momentify-Icon.svg" x={CENTER - 36} y={CENTER - 36} width={72} height={72} />
    </svg>
  );
};

/* ════════════════════════════════════════════════════════
   INTEGRATIONS PAGE
   ════════════════════════════════════════════════════════ */

export default function IntegrationsContent() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");
  const [formData, setFormData] = useState({ name: "", email: "", company: "", integration: "" });
  const [submitted, setSubmitted] = useState(false);

  const filtered =
    activeCategory === "all"
      ? INTEGRATIONS
      : INTEGRATIONS.filter((i) => i.category === activeCategory);

  const activeLabel =
    CATEGORIES.find((c) => c.id === activeCategory)?.label ?? "All";

  return (
    <>
      {/* ═══════════════════ 1. HERO ═══════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundSize: "200% 200%",
          animation: "bgShift 16s ease-in-out infinite",
          backgroundImage: mainMinimal,
          minHeight: "540px",
        }}
      >
        {/* Geometric SVG overlay */}
        <MainMinimalOverlay />

        {/* Ambient glow orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute w-[600px] h-[600px] rounded-full opacity-[0.06] blur-[120px]" style={{ background: "radial-gradient(circle, #3A2073, transparent 70%)", top: "10%", left: "55%", animation: "ambientFloat1 12s ease-in-out infinite" }} />
          <div className="absolute w-[500px] h-[500px] rounded-full opacity-[0.04] blur-[100px]" style={{ background: "radial-gradient(circle, #00BBA5, transparent 70%)", bottom: "0%", left: "10%", animation: "ambientFloat2 15s ease-in-out infinite" }} />
          <div className="absolute w-[400px] h-[400px] rounded-full opacity-[0.04] blur-[80px]" style={{ background: "radial-gradient(circle, #1A56DB, transparent 70%)", top: "40%", right: "5%", animation: "ambientFloat3 18s ease-in-out infinite" }} />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12 flex items-center" style={{ minHeight: "540px" }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: text content */}
            <div>
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
                  marginBottom: "24px",
                }}
              >
                Integrations
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
                }}
              >
                Connect Momentify to the tools your team already uses. Push leads, sync data, and automate follow-up without leaving the platform.
              </motion.p>

              {/* CTA buttons */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.32 }}
                className="flex flex-row gap-3 sm:gap-4"
                style={{ marginTop: "32px" }}
              >
                <a
                  href="/demo?source=integrations"
                  className="inline-flex items-center justify-center flex-1 sm:flex-initial sm:min-w-[200px] text-[12px] sm:text-[14px] py-2.5 sm:py-3.5 px-3 sm:px-7 transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
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
                <a
                  href="#integrations-grid"
                  className="inline-flex items-center justify-center flex-1 sm:flex-initial sm:min-w-[200px] text-[12px] sm:text-[14px] py-2.5 sm:py-3.5 px-3 sm:px-7 transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontWeight: 500,
                    color: "#FFFFFF",
                    background: "transparent",
                    borderRadius: "8px",
                    border: "1.5px solid rgba(255, 255, 255, 0.20)",
                  }}
                >
                  Browse Integrations
                </a>
              </motion.div>
            </div>

            {/* Right: animated constellation graphic */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="hidden lg:flex items-center justify-center"
              style={{ marginTop: "10px" }}
            >
              <IntegrationsGraphic />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ 1b. FILTER BAR ═══════════════════ */}
      <section id="integrations-grid" style={{ background: "#F8F9FC", paddingTop: "48px" }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          {/* Category filter pills */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex gap-3 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible sm:pb-0"
          >
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className="flex-shrink-0 transition-all duration-200 cursor-pointer"
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontWeight: 600,
                    fontSize: "13px",
                    color: isActive ? "#FFFFFF" : "rgba(6,19,65,0.45)",
                    background: isActive ? TEAL : "transparent",
                    border: isActive
                      ? `1px solid ${TEAL}`
                      : "1px solid rgba(6,19,65,0.12)",
                    padding: "8px 20px",
                    borderRadius: "20px",
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </motion.div>

          {/* Count line */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            style={{
              fontFamily: "var(--font-inter)",
              fontWeight: 500,
              fontSize: "13px",
              color: "rgba(6, 19, 65, 0.45)",
              marginTop: "24px",
            }}
          >
            Showing {filtered.length} {activeCategory === "all" ? "integrations" : `${activeLabel} integration${filtered.length !== 1 ? "s" : ""}`}
          </motion.p>
        </div>
      </section>

      {/* ═══════════════════ 2. INTEGRATION CARDS GRID ═══════════════════ */}
      <section style={{ background: "#F8F9FC", padding: "48px 0 80px" }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          {/* Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
              variants={stagger}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((integration) => {
                const catLabel = CATEGORIES.find((c) => c.id === integration.category)?.label ?? "";
                return (
                  <motion.div
                    key={integration.name}
                    variants={fadeUp}
                    className="transition-all duration-200 hover:-translate-y-1"
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid rgba(6,19,65,0.08)",
                      borderRadius: "16px",
                      padding: "28px 24px",
                      boxShadow: "0 4px 24px rgba(6,19,65,0.04)",
                    }}
                  >
                    {/* Integration logo */}
                    <div style={{ marginBottom: "16px", height: "48px", display: "flex", alignItems: "center" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={integration.logo}
                        alt={`${integration.name} logo`}
                        style={{ height: "40px", width: "auto", maxWidth: "120px" }}
                      />
                    </div>

                    {/* Name */}
                    <p
                      style={{
                        fontFamily: "var(--font-inter)",
                        fontWeight: 500,
                        fontSize: "16px",
                        color: DEEP_NAVY,
                        marginBottom: "8px",
                      }}
                    >
                      {integration.name}
                    </p>

                    {/* Category pill */}
                    <span
                      style={{
                        display: "inline-block",
                        fontFamily: "var(--font-inter)",
                        fontWeight: 600,
                        fontSize: "10px",
                        color: TEAL,
                        background: "rgba(0,187,165,0.1)",
                        borderRadius: "20px",
                        padding: "3px 10px",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase" as const,
                        marginBottom: "12px",
                      }}
                    >
                      {catLabel}
                    </span>

                    {/* Description */}
                    <p
                      style={{
                        fontFamily: "var(--font-inter)",
                        fontWeight: 400,
                        fontSize: "14px",
                        color: "rgba(6,19,65,0.55)",
                        lineHeight: 1.6,
                      }}
                    >
                      {integration.description}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ═══════════════════ 3. REQUEST FORM ═══════════════════ */}
      <section style={{ background: "#FFFFFF", padding: "100px 0" }}>
        <div className="mx-auto max-w-[720px] px-6 lg:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={headerVariants}
            className="text-center"
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
              Request an Integration
            </motion.p>

            <motion.h2
              variants={fadeUp}
              className="leading-[1.1]"
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 500,
                fontSize: "clamp(28px, 4.5vw, 38px)",
                color: DEEP_NAVY,
                letterSpacing: "-0.02em",
                marginBottom: "16px",
              }}
            >
              Don&apos;t see the integration you need?
            </motion.h2>

            <motion.p
              variants={fadeUp}
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 300,
                fontSize: "15px",
                color: "rgba(6,19,65,0.55)",
                lineHeight: 1.65,
                marginBottom: "48px",
              }}
            >
              Let us know what you are looking for. Our team reviews every request and will notify you when it is available.
            </motion.p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={fadeUp}
          >
            {submitted ? (
              <div
                className="text-center"
                style={{
                  background: "rgba(0,187,165,0.06)",
                  border: "1px solid rgba(0,187,165,0.15)",
                  borderRadius: "16px",
                  padding: "48px 32px",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontWeight: 500,
                    fontSize: "18px",
                    color: DEEP_NAVY,
                    marginBottom: "8px",
                  }}
                >
                  Thank you!
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontWeight: 400,
                    fontSize: "14px",
                    color: "rgba(6,19,65,0.55)",
                  }}
                >
                  Your request has been submitted. Our team will notify you when it is available.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <input
                  type="text"
                  placeholder="Name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="focus:outline-none"
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontWeight: 400,
                    fontSize: "14px",
                    color: DEEP_NAVY,
                    background: "#F8F9FC",
                    border: "1px solid rgba(6,19,65,0.1)",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    width: "100%",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = TEAL; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(6,19,65,0.1)"; }}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="focus:outline-none"
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontWeight: 400,
                    fontSize: "14px",
                    color: DEEP_NAVY,
                    background: "#F8F9FC",
                    border: "1px solid rgba(6,19,65,0.1)",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    width: "100%",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = TEAL; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(6,19,65,0.1)"; }}
                />
                <input
                  type="text"
                  placeholder="Company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="focus:outline-none"
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontWeight: 400,
                    fontSize: "14px",
                    color: DEEP_NAVY,
                    background: "#F8F9FC",
                    border: "1px solid rgba(6,19,65,0.1)",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    width: "100%",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = TEAL; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(6,19,65,0.1)"; }}
                />
                <input
                  type="text"
                  placeholder="Requested Integration"
                  required
                  value={formData.integration}
                  onChange={(e) => setFormData({ ...formData, integration: e.target.value })}
                  className="focus:outline-none"
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontWeight: 400,
                    fontSize: "14px",
                    color: DEEP_NAVY,
                    background: "#F8F9FC",
                    border: "1px solid rgba(6,19,65,0.1)",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    width: "100%",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = TEAL; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(6,19,65,0.1)"; }}
                />
                <button
                  type="submit"
                  className="md:col-span-2 transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 cursor-pointer"
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontWeight: 600,
                    fontSize: "14px",
                    color: "#FFFFFF",
                    background: "linear-gradient(135deg, #00BBA5, #1A56DB)",
                    borderRadius: "8px",
                    padding: "14px 32px",
                    border: "none",
                    letterSpacing: "-0.01em",
                    marginTop: "8px",
                    width: "100%",
                  }}
                >
                  Submit Request
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ 4. FINAL CTA ═══════════════════ */}
      <FinalCTA />
    </>
  );
}
