"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  PRICING_TIERS,
  COMPARISON_ROWS,
  PRICING_FAQ,
  ENTERPRISE_FLOOR,
  type Cadence,
  type PricingTier,
} from "@/lib/pricing-content";

const DEEP_NAVY = "#061341";
const TEAL = "#00BBA5";
const mainMinimal = "linear-gradient(135deg, #7C316D 0%, #0B0B3C 55%, #1A2E73 100%)";

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
  </svg>
);

const CheckIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={TEAL}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    style={{ flexShrink: 0 }}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};


function formatPrice(n: number) {
  return `$${n.toLocaleString("en-US")}`;
}

function TierCard({ tier, cadence }: { tier: PricingTier; cadence: Cadence }) {
  const price = cadence === "annual" ? tier.annual : tier.monthly;
  const isCustom = price === null;

  let subLine: string;
  if (tier.key === "enterprise") {
    subLine = ENTERPRISE_FLOOR;
  } else if (cadence === "annual") {
    subLine = "per month, billed annually";
  } else {
    subLine = "billed monthly";
    if (tier.onboardingShort) subLine += ` + ${tier.onboardingShort}`;
  }

  return (
    <motion.div
      {...fadeUp}
      className="relative flex flex-col h-full"
      style={{
        background: tier.highlight ? "#FFFFFF" : "#F8F9FC",
        border: tier.highlight ? `1.5px solid ${TEAL}` : "1px solid rgba(6,19,65,0.08)",
        borderRadius: "16px",
        padding: "32px 28px",
        boxShadow: tier.highlight ? "0 8px 32px rgba(0,187,165,0.12)" : "none",
      }}
    >
      {tier.highlight && (
        <span
          className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap"
          style={{
            fontFamily: "var(--font-inter)",
            fontWeight: 600,
            fontSize: "10px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#FFFFFF",
            background: "linear-gradient(135deg, #00BBA5, #1A56DB)",
            borderRadius: "999px",
            padding: "5px 14px",
          }}
        >
          Most popular
        </span>
      )}

      <h3 style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "20px", color: DEEP_NAVY, marginBottom: "6px" }}>
        {tier.name}
      </h3>
      <p style={{ fontFamily: "var(--font-inter)", fontWeight: 400, fontSize: "13px", color: "rgba(6,19,65,0.55)", lineHeight: 1.5, marginBottom: "20px", minHeight: "40px" }}>
        {tier.tagline}
      </p>

      <div style={{ marginBottom: "4px" }}>
        {isCustom ? (
          <span style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "34px", color: DEEP_NAVY, letterSpacing: "-0.02em" }}>
            Custom
          </span>
        ) : (
          <>
            <span style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "34px", color: DEEP_NAVY, letterSpacing: "-0.02em" }}>
              {formatPrice(price)}
            </span>
            <span style={{ fontFamily: "var(--font-inter)", fontWeight: 400, fontSize: "15px", color: "rgba(6,19,65,0.45)" }}>
              /mo
            </span>
          </>
        )}
      </div>
      <p style={{ fontFamily: "var(--font-inter)", fontWeight: 400, fontSize: "12px", color: "rgba(6,19,65,0.45)", marginBottom: "24px" }}>
        {subLine}
      </p>

      <ul className="space-y-2.5" style={{ marginBottom: "28px", flexGrow: 1 }}>
        {tier.bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-2.5">
            <span style={{ marginTop: "2px" }}>
              <CheckIcon size={15} />
            </span>
            <span style={{ fontFamily: "var(--font-inter)", fontWeight: 400, fontSize: "13px", color: "rgba(6,19,65,0.7)", lineHeight: 1.5 }}>
              {bullet}
            </span>
          </li>
        ))}
      </ul>

      {tier.comingSoon ? (
        <div>
          <button
            disabled
            aria-describedby={`coming-soon-${tier.key}`}
            className="w-full inline-flex items-center justify-center text-[14px] py-3 px-6"
            style={{
              fontFamily: "var(--font-inter)",
              fontWeight: 600,
              color: "#FFFFFF",
              background: "linear-gradient(135deg, #00BBA5, #1A56DB)",
              borderRadius: "8px",
              letterSpacing: "-0.01em",
              opacity: 0.55,
              cursor: "not-allowed",
            }}
          >
            Coming Soon!
          </button>
          <p id={`coming-soon-${tier.key}`} style={{ fontFamily: "var(--font-inter)", fontWeight: 400, fontSize: "11px", color: "rgba(6,19,65,0.4)", textAlign: "center", marginTop: "8px" }}>
            Self-serve checkout launching soon
          </p>
        </div>
      ) : (
        <a
          href={tier.cta.href(cadence)}
          className="w-full inline-flex items-center justify-center text-[14px] py-3 px-6 transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
          style={{
            fontFamily: "var(--font-inter)",
            fontWeight: 600,
            color: "#FFFFFF",
            background: "linear-gradient(135deg, #00BBA5, #1A56DB)",
            borderRadius: "8px",
            letterSpacing: "-0.01em",
          }}
        >
          {tier.cta.label}
        </a>
      )}
    </motion.div>
  );
}

export default function PricingContent() {
  const [cadence, setCadence] = useState<Cadence>("annual");

  const businessTiers = PRICING_TIERS.filter((t) => t.audience === "business");

  const pillBase = "text-[13px] font-medium px-5 py-2 rounded-full transition-all duration-200 cursor-pointer";

  return (
    <>
      <Navigation />
      <main>
        {/* Hero */}
        <section
          className="relative overflow-hidden"
          style={{
            backgroundSize: "200% 200%",
            animation: "bgShift 16s ease-in-out infinite",
            backgroundImage: mainMinimal,
            minHeight: "440px",
          }}
        >
          <MainMinimalOverlay />
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute w-[600px] h-[600px] rounded-full opacity-[0.06] blur-[120px]" style={{ background: "radial-gradient(circle, #3A2073, transparent 70%)", top: "10%", left: "55%", animation: "ambientFloat1 12s ease-in-out infinite" }} />
            <div className="absolute w-[500px] h-[500px] rounded-full opacity-[0.04] blur-[100px]" style={{ background: "radial-gradient(circle, #00BBA5, transparent 70%)", bottom: "0%", left: "10%", animation: "ambientFloat2 15s ease-in-out infinite" }} />
            <div className="absolute w-[400px] h-[400px] rounded-full opacity-[0.04] blur-[80px]" style={{ background: "radial-gradient(circle, #1A56DB, transparent 70%)", top: "40%", right: "5%", animation: "ambientFloat3 18s ease-in-out infinite" }} />
          </div>
          <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12 flex items-center" style={{ minHeight: "440px" }}>
            <div>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "11px", color: TEAL, letterSpacing: "0.14em", textTransform: "uppercase" as const, marginBottom: "16px" }}
              >
                Pricing
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.18 }}
                className="leading-[1.05]"
                style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "clamp(34px, 5vw, 52px)", color: "#FFFFFF", letterSpacing: "-0.02em", marginBottom: "24px" }}
              >
                Plans for every moment
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.24 }}
                style={{ fontFamily: "var(--font-inter)", fontWeight: 300, fontSize: "15px", color: "rgba(255, 255, 255, 0.55)", lineHeight: 1.5, maxWidth: "680px" }}
              >
                From a single team running a few events a year to enterprise dealer networks.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Toggles */}
        <section style={{ padding: "56px 0 8px" }}>
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <motion.div {...fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
              {/* Cadence toggle */}
              <div className="flex items-center gap-3">
                <div
                  role="tablist"
                  aria-label="Billing cadence"
                  className="inline-flex items-center gap-1 p-1 rounded-full"
                  style={{ background: "#F0F2F7", border: "1px solid rgba(6,19,65,0.06)" }}
                >
                  <button
                    role="tab"
                    aria-selected={cadence === "annual"}
                    onClick={() => setCadence("annual")}
                    className={pillBase}
                    style={{
                      fontFamily: "var(--font-inter)",
                      background: cadence === "annual" ? "#FFFFFF" : "transparent",
                      color: cadence === "annual" ? DEEP_NAVY : "rgba(6,19,65,0.5)",
                      boxShadow: cadence === "annual" ? "0 1px 4px rgba(6,19,65,0.1)" : "none",
                    }}
                  >
                    Annual
                  </button>
                  <button
                    role="tab"
                    aria-selected={cadence === "monthly"}
                    onClick={() => setCadence("monthly")}
                    className={pillBase}
                    style={{
                      fontFamily: "var(--font-inter)",
                      background: cadence === "monthly" ? "#FFFFFF" : "transparent",
                      color: cadence === "monthly" ? DEEP_NAVY : "rgba(6,19,65,0.5)",
                      boxShadow: cadence === "monthly" ? "0 1px 4px rgba(6,19,65,0.1)" : "none",
                    }}
                  >
                    Monthly
                  </button>
                </div>
                {cadence === "annual" && (
                  <span style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "12px", color: TEAL }}>
                    save ~13% vs monthly
                  </span>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Tier cards */}
        <section style={{ padding: "48px 0 40px" }}>
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
              {businessTiers.map((tier) => (
                <TierCard key={tier.key} tier={tier} cadence={cadence} />
              ))}
            </div>
          </div>
        </section>

        {/* Trust row */}
        <section style={{ padding: "0 0 40px" }}>
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <motion.div {...fadeUp} className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              <span className="inline-flex items-center gap-2">
                <CheckIcon size={14} />
                <span style={{ fontFamily: "var(--font-inter)", fontWeight: 400, fontSize: "13px", color: "rgba(6,19,65,0.55)" }}>
                  Cancel anytime
                </span>
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckIcon size={14} />
                <span style={{ fontFamily: "var(--font-inter)", fontWeight: 400, fontSize: "13px", color: "rgba(6,19,65,0.55)" }}>
                  No setup fee on self-serve plans
                </span>
              </span>
              <a href="/platform/security" className="inline-flex items-center gap-2 transition-opacity hover:opacity-80">
                <CheckIcon size={14} />
                <span style={{ fontFamily: "var(--font-inter)", fontWeight: 400, fontSize: "13px", color: "rgba(6,19,65,0.55)", textDecoration: "underline", textUnderlineOffset: "3px" }}>
                  Enterprise-grade security
                </span>
              </a>
            </motion.div>
          </div>
        </section>

        {/* Social proof strip */}
        <section style={{ padding: "0 0 72px" }}>
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <motion.a {...fadeUp} href="/case-studies" className="block text-center group" style={{ textDecoration: "none" }}>
              <p style={{ fontFamily: "var(--font-inter)", fontWeight: 400, fontSize: "12px", color: "rgba(6,19,65,0.35)", marginBottom: "14px" }}>
                Trusted for lead capture at
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
                {["Mustang Cat", "DISTRIBUTECH", "THSCA", "THSADA", "DFW Technology Prayer Breakfast", "FFA", "SkillsUSA"].map((name) => (
                  <span
                    key={name}
                    className="transition-colors duration-200 group-hover:text-charcoal/60"
                    style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "13px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(6,19,65,0.4)" }}
                  >
                    {name}
                  </span>
                ))}
              </div>
            </motion.a>
          </div>
        </section>

        {/* Comparison table */}
        <section style={{ padding: "0 0 80px" }}>
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <motion.h2
              {...fadeUp}
              style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "clamp(24px, 3.5vw, 32px)", color: DEEP_NAVY, letterSpacing: "-0.02em", marginBottom: "8px", textAlign: "center" }}
            >
              Compare plans
            </motion.h2>
            <motion.p
              {...fadeUp}
              style={{ fontFamily: "var(--font-inter)", fontWeight: 300, fontSize: "14px", color: "rgba(6,19,65,0.5)", marginBottom: "40px", textAlign: "center" }}
            >
              Every plan captures attendee data. Pick the scale that fits.
            </motion.p>
            <motion.div {...fadeUp} className="overflow-x-auto" style={{ borderRadius: "16px", border: "1px solid rgba(6,19,65,0.08)" }}>
              <table style={{ width: "100%", minWidth: "720px", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#F8F9FC" }}>
                    <th scope="col" style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "13px", color: DEEP_NAVY, textAlign: "left", padding: "16px 20px" }}>
                      <span className="sr-only">Feature</span>
                    </th>
                    {["Basic", "Team", "Pro", "Enterprise"].map((plan) => (
                      <th
                        key={plan}
                        scope="col"
                        style={{
                          fontFamily: "var(--font-inter)",
                          fontWeight: plan === "Team" ? 600 : 500,
                          fontSize: "13px",
                          color: plan === "Team" ? TEAL : DEEP_NAVY,
                          textAlign: "left",
                          padding: "16px 20px",
                        }}
                      >
                        {plan}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_ROWS.map((row) => (
                    <tr key={row.label} style={{ borderTop: "1px solid rgba(6,19,65,0.06)" }}>
                      <td style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "13px", color: DEEP_NAVY, padding: "14px 20px", whiteSpace: "nowrap" }}>
                        {row.label}
                      </td>
                      {row.values.map((value, i) => (
                        <td
                          key={i}
                          style={{ fontFamily: "var(--font-inter)", fontWeight: 400, fontSize: "13px", color: value === "-" ? "rgba(6,19,65,0.25)" : "rgba(6,19,65,0.65)", padding: "14px 20px" }}
                        >
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>
        </section>

        {/* ROX callout */}
        <section style={{ padding: "0 0 80px" }}>
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <motion.div
              {...fadeUp}
              style={{
                background: "#F8F9FC",
                border: "1px solid rgba(6,19,65,0.08)",
                borderRadius: "20px",
                padding: "56px 48px",
                textAlign: "center",
              }}
            >
              <h2 style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "clamp(24px, 3.5vw, 32px)", color: DEEP_NAVY, letterSpacing: "-0.02em", marginBottom: "16px" }}>
                Not sure the ROI is there?
              </h2>
              <p style={{ fontFamily: "var(--font-inter)", fontWeight: 300, fontSize: "15px", color: "rgba(6,19,65,0.55)", lineHeight: 1.6, maxWidth: "560px", margin: "0 auto 32px" }}>
                Run your own numbers with our free ROX calculators, built for trade shows, recruiting, field sales, facilities, and venues.
              </p>
              <a
                href="/what-is-rox"
                className="inline-flex items-center justify-center text-[14px] py-3.5 px-8 transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 600,
                  color: "#FFFFFF",
                  background: "linear-gradient(135deg, #00BBA5, #1A56DB)",
                  borderRadius: "8px",
                  letterSpacing: "-0.01em",
                }}
              >
                Learn about ROX and run your numbers
              </a>
            </motion.div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ padding: "0 0 80px" }}>
          <div className="mx-auto max-w-3xl px-6 lg:px-12">
            <motion.h2
              {...fadeUp}
              style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "clamp(24px, 3.5vw, 32px)", color: DEEP_NAVY, letterSpacing: "-0.02em", marginBottom: "32px", textAlign: "center" }}
            >
              Frequently asked questions
            </motion.h2>
            <motion.div {...fadeUp} className="space-y-3">
              {PRICING_FAQ.map((item) => (
                <details
                  key={item.q}
                  className="group"
                  style={{
                    background: "#F8F9FC",
                    border: "1px solid rgba(6,19,65,0.08)",
                    borderRadius: "12px",
                  }}
                >
                  <summary
                    className="flex items-center justify-between cursor-pointer list-none [&::-webkit-details-marker]:hidden"
                    style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "15px", color: DEEP_NAVY, padding: "20px 24px" }}
                  >
                    <span>{item.q}</span>
                    <svg
                      className="flex-shrink-0 ml-4 transition-transform duration-200 group-open:rotate-45"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="rgba(6,19,65,0.4)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      aria-hidden="true"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </summary>
                  <p style={{ fontFamily: "var(--font-inter)", fontWeight: 400, fontSize: "14px", color: "rgba(6,19,65,0.6)", lineHeight: 1.65, padding: "0 24px 20px" }}>
                    {item.a}
                  </p>
                </details>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA band */}
        <section style={{ padding: "0 0 80px" }}>
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <motion.div
              {...fadeUp}
              style={{
                background: "linear-gradient(135deg, #0B0B3C 0%, #1A2E73 100%)",
                borderRadius: "20px",
                padding: "56px 48px",
                textAlign: "center",
              }}
            >
              <h2 style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "clamp(24px, 3.5vw, 36px)", color: "#FFFFFF", letterSpacing: "-0.02em", marginBottom: "16px" }}>
                Not sure which plan fits?
              </h2>
              <p style={{ fontFamily: "var(--font-inter)", fontWeight: 300, fontSize: "15px", color: "rgba(255,255,255,0.55)", lineHeight: 1.6, maxWidth: "520px", margin: "0 auto 32px" }}>
                Walk through your events, volume, and goals with our team. We will point you to the right plan, no pressure.
              </p>
              <a
                href="/demo?source=pricing"
                className="inline-flex items-center justify-center text-[14px] py-3.5 px-8 transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
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
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
