"use client";

import { motion } from "framer-motion";
import FinalCTA from "@/components/FinalCTA";

/* -- Animation variants (match codebase pattern) ----- */

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

/* -- Shared constants --------------------------------- */

const mainMinimal =
  "linear-gradient(135deg, #7C316D 0%, #0B0B3C 55%, #1A2E73 100%)";

const TEAL = "#00BBA5";
const DEEP_NAVY = "#061341";

/* -- Main-Minimal SVG overlay ------------------------- */

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

/* -- Security SVG Icons ------------------------------- */

const icons = {
  encryption: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="5" y="12" width="18" height="12" rx="3" stroke={TEAL} strokeWidth="1.5" />
      <path d="M9 12V8a5 5 0 0 1 10 0v4" stroke={TEAL} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="14" cy="18" r="2" fill={TEAL} />
    </svg>
  ),
  backup: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M7 20V8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H10a3 3 0 0 1-3-3Z" stroke={TEAL} strokeWidth="1.5" />
      <path d="M11 12h6M11 16h4" stroke={TEAL} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14 5V2" stroke={TEAL} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  workspace: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="3" y="5" width="10" height="8" rx="2" stroke={TEAL} strokeWidth="1.5" />
      <rect x="15" y="5" width="10" height="8" rx="2" stroke={TEAL} strokeWidth="1.5" />
      <rect x="3" y="15" width="10" height="8" rx="2" stroke={TEAL} strokeWidth="1.5" />
      <rect x="15" y="15" width="10" height="8" rx="2" stroke={TEAL} strokeWidth="1.5" />
    </svg>
  ),
  rbac: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="9" r="4" stroke={TEAL} strokeWidth="1.5" />
      <path d="M6 23c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke={TEAL} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M19 13l3 3 3-3" stroke={TEAL} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  sso: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="10" stroke={TEAL} strokeWidth="1.5" />
      <path d="M14 4v20M4 14h20" stroke={TEAL} strokeWidth="1.5" />
      <path d="M6 8c2.5 2 5 3 8 3s5.5-1 8-3M6 20c2.5-2 5-3 8-3s5.5 1 8 3" stroke={TEAL} strokeWidth="1.5" />
    </svg>
  ),
  mfa: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="7" y="4" width="14" height="20" rx="3" stroke={TEAL} strokeWidth="1.5" />
      <circle cx="14" cy="17" r="2" stroke={TEAL} strokeWidth="1.5" />
      <path d="M11 9h6" stroke={TEAL} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  uptime: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="10" stroke={TEAL} strokeWidth="1.5" />
      <path d="M14 8v6l4 4" stroke={TEAL} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  compliance: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M14 3L4 8v6c0 5.5 4.3 10.6 10 12 5.7-1.4 10-6.5 10-12V8L14 3Z" stroke={TEAL} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M10 14l3 3 5-6" stroke={TEAL} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  monitoring: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M3 21l5-7 4 4 5-6 5 4 3-5" stroke={TEAL} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="8" cy="14" r="2" fill={TEAL} fillOpacity="0.2" stroke={TEAL} strokeWidth="1" />
      <circle cx="17" cy="12" r="2" fill={TEAL} fillOpacity="0.2" stroke={TEAL} strokeWidth="1" />
    </svg>
  ),
};

/* -- Data: Security sections and items ---------------- */

interface SecurityItem {
  title: string;
  description: string;
  icon: keyof typeof icons;
}

interface SecuritySection {
  category: string;
  eyebrow: string;
  items: SecurityItem[];
}

const SECTIONS: SecuritySection[] = [
  {
    category: "Data Security",
    eyebrow: "ENCRYPTION + BACKUP",
    items: [
      {
        title: "Complete Encryption",
        description:
          "All customer data is encrypted at rest and in transit using industry-standard encryption protocols (AES-256 and TLS 1.2+). Your event, facility, and lead data remains secure throughout its lifecycle.",
        icon: "encryption",
      },
      {
        title: "Data Backup and Recovery",
        description:
          "Daily backups of all data with 14-week retention. Backup processes are regularly tested to ensure rapid restoration and business continuity.",
        icon: "backup",
      },
      {
        title: "Infrastructure Monitoring",
        description:
          "24/7 automated monitoring across all production systems. Anomalies are flagged instantly for rapid response, and infrastructure health dashboards are reviewed daily.",
        icon: "monitoring",
      },
    ],
  },
  {
    category: "Product Security",
    eyebrow: "ACCESS + AUTHENTICATION",
    items: [
      {
        title: "Workspace-Level Security",
        description:
          "Event and facility data segmentation limits access to appropriate teams. Each workspace is isolated so teams only see the data relevant to their role and region.",
        icon: "workspace",
      },
      {
        title: "Role-Based Access Control",
        description:
          "Access is restricted by user roles and permissions within workspaces. Backend controls limit authorization so users can only perform actions appropriate to their level.",
        icon: "rbac",
      },
      {
        title: "Multi-Factor Authentication",
        description:
          "MFA is available for all users and required for administrators. Supports authenticator apps and hardware security keys for defense-in-depth account protection.",
        icon: "mfa",
      },
    ],
  },
  {
    category: "Enterprise Security",
    eyebrow: "COMPLIANCE + RELIABILITY",
    items: [
      {
        title: "Single Sign-On (SSO)",
        description:
          "Support for Okta, Google, and Microsoft Azure. SSO simplifies user provisioning and de-provisioning across your organization while maintaining centralized access control.",
        icon: "sso",
      },
      {
        title: "99.9% Uptime SLA",
        description:
          "Our infrastructure is designed for high availability with redundant systems across multiple regions. We maintain a 99.9% uptime commitment backed by an enterprise SLA.",
        icon: "uptime",
      },
      {
        title: "SOC 2 Compliance",
        description:
          "Momentify is built to meet SOC 2 Type II standards for security, availability, and confidentiality. We undergo regular third-party audits to validate our security posture.",
        icon: "compliance",
      },
    ],
  },
];

/* -- Shield Hero Graphic ------------------------------ */

const ShieldGraphic = () => {
  /* Shield visual center */
  const sc = { x: 250, y: 240 };

  return (
    <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[420px]">
      <defs>
        <linearGradient id="shieldGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00BBA5" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#1A56DB" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="shieldStroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00BBA5" />
          <stop offset="100%" stopColor="#1A56DB" />
        </linearGradient>
        <linearGradient id="mGrad1" x1="44" y1="28" x2="73" y2="122" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0CF4DF" />
          <stop offset="1" stopColor="#1F3395" />
        </linearGradient>
        <linearGradient id="mGrad2" x1="91" y1="31" x2="113" y2="131" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0CF4DF" />
          <stop offset="1" stopColor="#1F3395" />
        </linearGradient>
      </defs>
      <style>{`
        @keyframes shieldPulse { 0%, 100% { opacity: 0.15; } 50% { opacity: 0.25; } }
        @keyframes ringRotate { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>

      {/* Outer ring - centered on shield */}
      <circle
        cx={sc.x} cy={sc.y} r="200"
        fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1"
        strokeDasharray="8 12"
        style={{ transformOrigin: `${sc.x}px ${sc.y}px`, animation: "ringRotate 90s linear infinite" }}
      />
      {/* Middle ring */}
      <circle
        cx={sc.x} cy={sc.y} r="160"
        fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1"
        strokeDasharray="6 10"
        style={{ transformOrigin: `${sc.x}px ${sc.y}px`, animation: "ringRotate 60s linear infinite reverse" }}
      />

      {/* Glow behind shield */}
      <ellipse cx={sc.x} cy={sc.y} rx="100" ry="110" fill="url(#shieldGrad)" style={{ animation: "shieldPulse 4s ease-in-out infinite" }} />

      {/* Shield shape */}
      <path
        d="M250 120L160 170v70c0 55 38 106 90 120 52-14 90-65 90-120v-70L250 120Z"
        fill="rgba(6,19,65,0.6)"
        stroke="url(#shieldStroke)"
        strokeWidth="2"
      />

      {/* Momentify M mark centered in shield */}
      <g transform="translate(210, 200) scale(0.5)">
        <path d="M18.1 94.945L52.9693 9.30142C54.5558 5.4049 59.761 4.67828 62.3539 7.9914L89.2188 40.2078C91.0252 42.5161 90.6939 45.8374 88.467 47.7433L26.7328 101.171C22.3709 104.904 15.935 100.263 18.1 94.945Z" fill="url(#mGrad1)" />
        <path d="M144.078 104.749L118.647 74.4723C117.414 72.8031 115.107 71.7273 112.772 72.8031L60.3303 98.7056C54.5564 101.365 49.649 93.7043 54.4786 89.571L148.324 9.25522C152.167 5.96628 158.034 9.20015 157.304 14.2055L153.863 102.234C153.162 107.043 147.011 108.624 144.078 104.749Z" fill="url(#mGrad2)" />
      </g>

      {/* Floating badge pills (1.5x size) */}
      {[
        { cx: 90, cy: 130, label: "AES-256" },
        { cx: 410, cy: 140, label: "TLS 1.2+" },
        { cx: 75, cy: 350, label: "SOC 2" },
        { cx: 425, cy: 340, label: "SSO" },
        { cx: 250, cy: 440, label: "MFA" },
      ].map((node) => (
        <g key={node.label}>
          <line x1={sc.x} y1={sc.y} x2={node.cx} y2={node.cy} stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="4 8" />
          <rect
            x={node.cx - 40} y={node.cy - 17.5}
            width="80" height="35" rx="10"
            fill="rgba(6,19,65,0.5)"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1"
          />
          <text
            x={node.cx} y={node.cy + 4.5}
            textAnchor="middle"
            fill="rgba(255,255,255,0.6)"
            fontSize="12.5"
            fontFamily="var(--font-inter), system-ui, sans-serif"
            fontWeight="600"
            letterSpacing="0.05em"
          >
            {node.label}
          </text>
        </g>
      ))}
    </svg>
  );
};

/* =====================================================
   SECURITY PAGE
   ===================================================== */

export default function SecurityContent() {
  return (
    <>
      {/* ================ 1. HERO ================ */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundSize: "200% 200%",
          animation: "bgShift 16s ease-in-out infinite",
          backgroundImage: mainMinimal,
          minHeight: "540px",
        }}
      >
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
                Safe, Secure, and{" "}
                <span className="text-gradient-brand">Private.</span>
              </motion.h1>

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
                We take the protection of your data seriously. Momentify is built with enterprise-grade security, privacy, and reliability so you can confidently deploy across your global events, facilities, and field sales operations.
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
                  href="/demo?source=security"
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
                  href="#security-overview"
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
                  Learn More
                </a>
              </motion.div>
            </div>

            {/* Right: shield graphic */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="hidden lg:flex items-center justify-center"
              style={{ marginTop: "10px" }}
            >
              <ShieldGraphic />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================ 2. SECURITY SECTIONS ================ */}
      {SECTIONS.map((section, sectionIdx) => (
        <section
          key={section.category}
          id={sectionIdx === 0 ? "security-overview" : undefined}
          style={{
            background: sectionIdx % 2 === 0 ? "#F8F9FC" : "#FFFFFF",
            padding: "80px 0",
          }}
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={headerVariants}
              className="mb-12"
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
                  marginBottom: "12px",
                }}
              >
                {section.eyebrow}
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
                }}
              >
                {section.category}
              </motion.h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={stagger}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {section.items.map((item) => (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  className="transition-all duration-200 hover:-translate-y-1"
                  style={{
                    background: sectionIdx % 2 === 0 ? "#FFFFFF" : "#F8F9FC",
                    border: "1px solid rgba(6,19,65,0.08)",
                    borderRadius: "16px",
                    padding: "32px 28px",
                    boxShadow: "0 4px 24px rgba(6,19,65,0.04)",
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "12px",
                      background: "rgba(0,187,165,0.08)",
                      border: "1px solid rgba(0,187,165,0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "20px",
                    }}
                  >
                    {icons[item.icon]}
                  </div>

                  {/* Title */}
                  <p
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontWeight: 500,
                      fontSize: "17px",
                      color: DEEP_NAVY,
                      marginBottom: "10px",
                    }}
                  >
                    {item.title}
                  </p>

                  {/* Description */}
                  <p
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontWeight: 400,
                      fontSize: "14px",
                      color: "rgba(6,19,65,0.55)",
                      lineHeight: 1.65,
                    }}
                  >
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      ))}

      {/* ================ 3. FINAL CTA ================ */}
      <FinalCTA />
    </>
  );
}
