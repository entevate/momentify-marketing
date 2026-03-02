"use client";

import { motion } from "framer-motion";

/* ── Animation variants (match existing pattern) ───── */

const headerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ── Stats data ────────────────────────────────────── */

const stats = [
  { number: "10,000+", label: "Leads generated across 50 events in 18 months" },
  { number: "40%", label: "Lead qualification improvement across active clients" },
  { number: "$411M", label: "Potential pipeline value delivered to customers and dealers" },
];

/* ── Outcome cards data ────────────────────────────── */

const outcomes = [
  {
    logo: "/logos/caterpillar.png",
    logoAlt: "Caterpillar",
    headline: "Dealer network engagement measured across 6 business units.",
    body: "Caterpillar deployed Momentify across multiple dealer groups to capture field interaction data that had never been tracked at scale. Engagement patterns surfaced across job sites, facilities, and recruiting events with consistent scoring across every touchpoint.",
    tags: ["Field Sales", "Facilities"],
  },
  {
    logo: "/logos/mustang-cat.png",
    logoAlt: "Mustang Cat",
    headline: "Recruiting events scored for the first time with qualified candidate data.",
    body: "Mustang Cat used Momentify at technical recruiting events to capture candidate intent, role fit, and engagement depth. The team identified high-fit candidates before the event closed instead of reviewing spreadsheets after the fact.",
    tags: ["Technical Recruiting"],
  },
  {
    logo: null,
    logoAlt: "Trade Show Exhibitor",
    headline: "40% improvement in lead qualification at trade show events.",
    body: "Across active clients using Momentify at trade shows, lead qualification rates improved by 40% compared to prior events using traditional badge scan methods. Follow-up speed dropped from days to hours.",
    tags: ["Trade Shows and Exhibits"],
  },
];

/* ── Logo bar data ─────────────────────────────────── */

const logos = [
  { src: "/logos/caterpillar.png", alt: "Caterpillar", height: "28px" },
  { src: "/logos/mustang-cat.png", alt: "Mustang Cat", height: "28px" },
  { src: "/logos/thompson-tractor.png", alt: "Thompson Tractor", height: "28px" },
  { src: "/logos/blanchard-machinery.png", alt: "Blanchard Machinery", height: "28px" },
];

/* ── Social Proof Section ──────────────────────────── */

export default function SocialProof() {
  return (
    <section
      id="proof"
      className="relative py-16 sm:py-24 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #F5F6F8 100%)" }}
    >
      {/* Brand geometric pattern (match Problem/Platform) */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMaxYMax slice"
        aria-hidden="true"
      >
        <path
          d="M1440 900 L1440 324 L1008 0 L528 0 L1056 396 L1056 900 Z"
          fill="#254FE5"
          fillOpacity="0.04"
        />
        <path
          d="M1440 900 L1440 540 L912 144 L432 144 L912 504 L912 900 Z"
          fill="#1F3395"
          fillOpacity="0.03"
        />
      </svg>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">

        {/* ── Section header (left-aligned) ────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={headerVariants}
        >
          <motion.p
            variants={fadeUp}
            className="uppercase font-semibold text-[12px] tracking-[0.14em] mb-4"
            style={{ color: "#00BBA5", fontFamily: "var(--font-inter)" }}
          >
            Results
          </motion.p>

          <motion.h2
            variants={fadeUp}
            className="leading-[1.1]"
            style={{
              fontFamily: "var(--font-inter)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              fontSize: "clamp(28px, 4.5vw, 52px)",
              color: "#061341",
            }}
          >
            Real teams. Real interactions. Real outcomes.
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-4 max-w-[600px]"
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "15px",
              fontWeight: 300,
              lineHeight: "1.5",
              color: "rgba(6, 19, 65, 0.6)",
            }}
          >
            Momentify is active across trade shows, recruiting events, field visits, and facilities. Here is what teams are actually seeing.
          </motion.p>
        </motion.div>

        {/* ── Stat row ─────────────────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={fadeUp}
          className="mt-16 flex flex-col sm:flex-row items-start sm:items-center gap-8 sm:gap-0"
        >
          {stats.map((stat, i) => (
            <div key={stat.number} className="flex items-center">
              {i > 0 && (
                <div
                  className="hidden sm:block"
                  style={{
                    width: "1px",
                    height: "48px",
                    background: "rgba(6, 19, 65, 0.10)",
                    marginLeft: "36px",
                    marginRight: "36px",
                  }}
                />
              )}
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontWeight: 500,
                    fontSize: "clamp(36px, 4vw, 48px)",
                    color: "#061341",
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                    marginBottom: "6px",
                  }}
                >
                  {stat.number}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontWeight: 300,
                    fontSize: "13px",
                    color: "rgba(6, 19, 65, 0.50)",
                    lineHeight: 1.4,
                    maxWidth: "200px",
                  }}
                >
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── Outcome cards ────────────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
          className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {outcomes.map((card) => (
            <motion.div
              key={card.headline}
              variants={fadeUp}
              className="group flex flex-col rounded-2xl transition-all duration-200 hover:-translate-y-1"
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(6, 19, 65, 0.08)",
                padding: "32px 28px",
                boxShadow: "0 2px 12px rgba(6, 19, 65, 0.04)",
              }}
            >
              {/* Logo or tag */}
              <div style={{ minHeight: "28px" }}>
                {card.logo ? (
                  <img
                    src={card.logo}
                    alt={card.logoAlt}
                    className="opacity-50 group-hover:opacity-80 transition-opacity duration-200"
                    style={{ maxHeight: "28px", width: "auto" }}
                  />
                ) : (
                  <span
                    style={{
                      display: "inline-block",
                      fontFamily: "var(--font-inter)",
                      fontWeight: 500,
                      fontSize: "11px",
                      color: "rgba(6, 19, 65, 0.40)",
                      background: "rgba(6, 19, 65, 0.06)",
                      borderRadius: "20px",
                      padding: "4px 12px",
                    }}
                  >
                    {card.logoAlt}
                  </span>
                )}
              </div>

              {/* Divider */}
              <div
                style={{
                  height: "1px",
                  background: "rgba(6, 19, 65, 0.08)",
                  margin: "20px 0",
                }}
              />

              {/* Outcome headline */}
              <h3
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 500,
                  fontSize: "18px",
                  color: "#061341",
                  lineHeight: 1.25,
                  letterSpacing: "-0.01em",
                  marginBottom: "12px",
                }}
              >
                {card.headline}
              </h3>

              {/* Outcome body */}
              <p
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 300,
                  fontSize: "14px",
                  color: "rgba(6, 19, 65, 0.55)",
                  lineHeight: 1.65,
                  marginBottom: "20px",
                  flex: 1,
                }}
              >
                {card.body}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {card.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontWeight: 600,
                      fontSize: "10px",
                      letterSpacing: "0.08em",
                      color: "#00BBA5",
                      background: "rgba(0, 187, 165, 0.08)",
                      borderRadius: "20px",
                      padding: "4px 10px",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Logo bar ─────────────────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={fadeUp}
          className="mt-20"
        >
          <p
            className="uppercase font-semibold text-[10px] tracking-[0.14em] mb-6"
            style={{
              fontFamily: "var(--font-inter)",
              color: "rgba(6, 19, 65, 0.30)",
            }}
          >
            Trusted By
          </p>

          <div className="flex flex-wrap items-center gap-6 sm:gap-12">
            {logos.map((logo) => (
              <img
                key={logo.alt}
                src={logo.src}
                alt={logo.alt}
                className="flex-shrink-0 grayscale hover:grayscale-0 hover:opacity-80 transition-all duration-200"
                style={{ maxHeight: logo.height, width: "auto", opacity: 0.4 }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
