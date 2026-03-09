"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

/* ── Constants ────────────────────────────────────── */

const DEEP_NAVY = "#061341";
const TEAL = "#00BBA5";

const REFERRAL_OPTIONS = [
  { value: "", label: "Select one..." },
  { value: "google-search", label: "Google Search" },
  { value: "social-media", label: "Social Media" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "trade-show", label: "Trade Show or Conference" },
  { value: "word-of-mouth", label: "Word of Mouth" },
  { value: "referral", label: "Referral" },
  { value: "email", label: "Email" },
  { value: "other", label: "Other" },
];

const SOLUTION_OPTIONS = [
  { value: "", label: "Select a solution..." },
  { value: "trade-shows", label: "Trade Shows & Exhibits" },
  { value: "technical-recruiting", label: "Technical Recruiting" },
  { value: "field-sales", label: "Field Sales Enablement" },
  { value: "facilities", label: "Facilities" },
  { value: "venues-events", label: "Venues & Events" },
  { value: "multiple", label: "Multiple Solutions" },
  { value: "not-sure", label: "Not Sure Yet" },
];

const COMPANY_SIZE_OPTIONS = [
  { value: "", label: "Select company size..." },
  { value: "1-50", label: "1 - 50 employees" },
  { value: "51-200", label: "51 - 200 employees" },
  { value: "201-1000", label: "201 - 1,000 employees" },
  { value: "1001-5000", label: "1,001 - 5,000 employees" },
  { value: "5001+", label: "5,000+ employees" },
];

const EVENTS_OPTIONS = [
  { value: "", label: "Select a range..." },
  { value: "1-5", label: "1 - 5 per year" },
  { value: "6-15", label: "6 - 15 per year" },
  { value: "16-50", label: "16 - 50 per year" },
  { value: "50+", label: "50+ per year" },
];

/* ── Animation variants ───────────────────────────── */

const headerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

/* ── Shared input style ───────────────────────────── */

const inputStyle: React.CSSProperties = {
  fontFamily: "var(--font-inter)",
  fontWeight: 400,
  fontSize: "14px",
  color: DEEP_NAVY,
  background: "#F8F9FC",
  border: "1px solid rgba(6,19,65,0.10)",
  borderRadius: "8px",
  padding: "12px 16px",
  width: "100%",
  transition: "border-color 0.2s",
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23061341' stroke-opacity='0.35' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 16px center",
  paddingRight: "40px",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-inter)",
  fontWeight: 500,
  fontSize: "12px",
  color: "rgba(6,19,65,0.50)",
  letterSpacing: "0.01em",
  marginBottom: "6px",
  display: "block",
};

function handleFocus(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
  e.currentTarget.style.borderColor = TEAL;
}
function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
  e.currentTarget.style.borderColor = "rgba(6,19,65,0.10)";
}

/* ── Trust bullets ────────────────────────────────── */

const trustBullets = [
  {
    title: "Personalized walkthrough",
    description: "Tailored to your use case and team size.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2v16M2 10h16" stroke="#0CF4DF" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="10" cy="10" r="3" stroke="#0CF4DF" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: "Live platform demo",
    description: "See Momentify running with real data.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="3" width="16" height="11" rx="2" stroke="#0CF4DF" strokeWidth="1.5" />
        <path d="M7 17h6M10 14v3" stroke="#0CF4DF" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "ROX strategy session",
    description: "Build a measurement plan for your next event.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 17l4-6 3 3 4-5 3 4" stroke="#0CF4DF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

/* ── Component ────────────────────────────────────── */

export default function DemoContent() {
  const searchParams = useSearchParams();
  const sourceParam = searchParams.get("source") || "";

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    jobTitle: "",
    solution: "",
    companySize: "",
    eventsPerYear: "",
    referral: "",
    sourcePage: sourceParam,
    message: "",
    website: "",
  });

  useEffect(() => {
    if (sourceParam) {
      setFormData((prev) => ({ ...prev, sourcePage: sourceParam }));
    }
  }, [sourceParam]);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Submission failed. Please try again.");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-screen">
      {/* Full-width dark hero strip behind fixed nav */}
      <div
        className="relative px-6 lg:px-12 pt-28 pb-16 lg:pt-32 lg:pb-20 overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(135deg, #1A0533 0%, #070E2B 40%, #061341 70%, #070E2B 100%)",
        }}
      >
        {/* Geometric overlay */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          width="100%"
          height="100%"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M1440 900 L1440 324 L1008 0 L528 0 L1056 396 L1056 900 Z"
            fill="white"
            fillOpacity="0.02"
          />
          <path
            d="M1440 900 L1440 540 L912 144 L432 144 L912 504 L912 900 Z"
            fill="white"
            fillOpacity="0.015"
          />
        </svg>

        <div className="relative z-10 mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={headerVariants}
          >
            {/* Eyebrow */}
            <motion.p
              variants={fadeUp}
              className="uppercase font-semibold text-[12px] tracking-[0.14em] mb-4"
              style={{ color: TEAL, fontFamily: "var(--font-inter)" }}
            >
              Schedule a Demo
            </motion.p>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="leading-[1.08]"
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 500,
                letterSpacing: "-0.025em",
                fontSize: "clamp(34px, 5vw, 56px)",
                color: "#FFFFFF",
              }}
            >
              See Momentify{" "}
              <span className="text-gradient-brand">in{"\u00A0"}action.</span>
            </motion.h1>

            {/* Subhead */}
            <motion.p
              variants={fadeUp}
              className="mt-5 max-w-[520px]"
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "15px",
                fontWeight: 300,
                lineHeight: "1.6",
                color: "rgba(255, 255, 255, 0.55)",
              }}
            >
              Tell us about your team and goals. We will tailor a walkthrough to show exactly how Momentify fits your workflow.
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* ── Split: Trust bullets + Form ────────────── */}
      <div className="px-6 lg:px-12">
      <div className="relative flex flex-col lg:flex-row mx-auto max-w-7xl py-12 lg:py-20 gap-12 lg:gap-20">
        {/* ── Left: Trust bullets ─────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={headerVariants}
          className="lg:w-[35%] lg:pt-8"
        >
          <motion.p
            variants={fadeUp}
            className="mb-6"
            style={{
              fontFamily: "var(--font-inter)",
              fontWeight: 500,
              fontSize: "18px",
              color: DEEP_NAVY,
            }}
          >
            What to expect
          </motion.p>
          <motion.div variants={fadeUp} className="space-y-6">
            {trustBullets.map((bullet) => (
              <div key={bullet.title} className="flex items-start gap-3">
                <div
                  className="flex-shrink-0 mt-0.5 flex items-center justify-center rounded-lg"
                  style={{
                    width: "40px",
                    height: "40px",
                    background: "rgba(0, 187, 165, 0.08)",
                    border: "1px solid rgba(0, 187, 165, 0.12)",
                    borderRadius: "10px",
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    {bullet.title === "Personalized walkthrough" && (
                      <>
                        <path d="M10 2v16M2 10h16" stroke={TEAL} strokeWidth="1.5" strokeLinecap="round" />
                        <circle cx="10" cy="10" r="3" stroke={TEAL} strokeWidth="1.5" />
                      </>
                    )}
                    {bullet.title === "Live platform demo" && (
                      <>
                        <rect x="2" y="3" width="16" height="11" rx="2" stroke={TEAL} strokeWidth="1.5" />
                        <path d="M7 17h6M10 14v3" stroke={TEAL} strokeWidth="1.5" strokeLinecap="round" />
                      </>
                    )}
                    {bullet.title === "ROX strategy session" && (
                      <path d="M3 17l4-6 3 3 4-5 3 4" stroke={TEAL} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    )}
                  </svg>
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontWeight: 500,
                      fontSize: "14px",
                      color: DEEP_NAVY,
                      marginBottom: "2px",
                    }}
                  >
                    {bullet.title}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontWeight: 400,
                      fontSize: "13px",
                      color: "rgba(6, 19, 65, 0.45)",
                      lineHeight: "1.5",
                    }}
                  >
                    {bullet.description}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Right: Form ─────────────────────────── */}
        <div className="lg:w-[65%]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-[540px]"
          >
            {submitted ? (
              /* ── Success state ──────────────────── */
              <div
                className="text-center"
                style={{
                  background: "rgba(0,187,165,0.06)",
                  border: "1px solid rgba(0,187,165,0.15)",
                  borderRadius: "16px",
                  padding: "48px 32px",
                }}
              >
                <div
                  className="mx-auto mb-4 flex items-center justify-center"
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    background: "rgba(0,187,165,0.12)",
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 13l4 4L19 7"
                      stroke={TEAL}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontWeight: 600,
                    fontSize: "20px",
                    color: DEEP_NAVY,
                    marginBottom: "8px",
                  }}
                >
                  You are on the list.
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontWeight: 400,
                    fontSize: "14px",
                    color: "rgba(6,19,65,0.55)",
                    lineHeight: "1.6",
                    maxWidth: "360px",
                    margin: "0 auto",
                  }}
                >
                  Our team will reach out within one business day to schedule your personalized demo.
                </p>
              </div>
            ) : (
              /* ── Form ───────────────────────────── */
              <>
                <h2
                  className="mb-2"
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontWeight: 500,
                    fontSize: "24px",
                    color: DEEP_NAVY,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Request a demo
                </h2>
                <p
                  className="mb-8"
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontWeight: 400,
                    fontSize: "14px",
                    color: "rgba(6,19,65,0.45)",
                    lineHeight: "1.5",
                  }}
                >
                  Fill out the form and a member of our team will be in touch.
                </p>

                {error && (
                  <div
                    className="mb-6"
                    style={{
                      background: "rgba(229,72,77,0.06)",
                      border: "1px solid rgba(229,72,77,0.15)",
                      borderRadius: "8px",
                      padding: "12px 16px",
                      fontFamily: "var(--font-inter)",
                      fontSize: "13px",
                      color: "#E5484D",
                    }}
                  >
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* First + Last Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label style={labelStyle}>First Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => updateField("firstName", e.target.value)}
                        className="focus:outline-none"
                        style={inputStyle}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Last Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => updateField("lastName", e.target.value)}
                        className="focus:outline-none"
                        style={inputStyle}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label style={labelStyle}>Work Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className="focus:outline-none"
                      style={inputStyle}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                  </div>

                  {/* Company + Job Title */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label style={labelStyle}>Company *</label>
                      <input
                        type="text"
                        required
                        value={formData.company}
                        onChange={(e) => updateField("company", e.target.value)}
                        className="focus:outline-none"
                        style={inputStyle}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Job Title</label>
                      <input
                        type="text"
                        value={formData.jobTitle}
                        onChange={(e) => updateField("jobTitle", e.target.value)}
                        className="focus:outline-none"
                        style={inputStyle}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                      />
                    </div>
                  </div>

                  {/* Solution Interest */}
                  <div>
                    <label style={labelStyle}>Solution Interest *</label>
                    <select
                      required
                      value={formData.solution}
                      onChange={(e) => updateField("solution", e.target.value)}
                      className="focus:outline-none"
                      style={{
                        ...selectStyle,
                        color: formData.solution ? DEEP_NAVY : "rgba(6,19,65,0.35)",
                      }}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    >
                      {SOLUTION_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value} disabled={opt.value === ""}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Company Size + Events per Year */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label style={labelStyle}>Company Size</label>
                      <select
                        value={formData.companySize}
                        onChange={(e) => updateField("companySize", e.target.value)}
                        className="focus:outline-none"
                        style={{
                          ...selectStyle,
                          color: formData.companySize ? DEEP_NAVY : "rgba(6,19,65,0.35)",
                        }}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                      >
                        {COMPANY_SIZE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value} disabled={opt.value === ""}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Events / Activations per Year</label>
                      <select
                        value={formData.eventsPerYear}
                        onChange={(e) => updateField("eventsPerYear", e.target.value)}
                        className="focus:outline-none"
                        style={{
                          ...selectStyle,
                          color: formData.eventsPerYear ? DEEP_NAVY : "rgba(6,19,65,0.35)",
                        }}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                      >
                        {EVENTS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value} disabled={opt.value === ""}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* How did you find us */}
                  <div>
                    <label style={labelStyle}>How did you find us?</label>
                    <select
                      value={formData.referral}
                      onChange={(e) => updateField("referral", e.target.value)}
                      className="focus:outline-none"
                      style={{
                        ...selectStyle,
                        color: formData.referral ? DEEP_NAVY : "rgba(6,19,65,0.35)",
                      }}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    >
                      {REFERRAL_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value} disabled={opt.value === ""}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Hidden: source page from URL param */}
                  <input type="hidden" name="sourcePage" value={formData.sourcePage} />

                  {/* Honeypot: hidden from real users, bots will fill it */}
                  <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: "-9999px", opacity: 0, height: 0, overflow: "hidden", tabIndex: -1 } as React.CSSProperties}>
                    <label htmlFor="website">Website</label>
                    <input
                      type="text"
                      id="website"
                      name="website"
                      autoComplete="off"
                      tabIndex={-1}
                      value={formData.website}
                      onChange={(e) => updateField("website", e.target.value)}
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label style={labelStyle}>Anything else we should know?</label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => updateField("message", e.target.value)}
                      className="focus:outline-none resize-none"
                      style={{
                        ...inputStyle,
                        lineHeight: "1.5",
                      }}
                      onFocus={handleFocus as unknown as React.FocusEventHandler<HTMLTextAreaElement>}
                      onBlur={handleBlur as unknown as React.FocusEventHandler<HTMLTextAreaElement>}
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
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
                      marginTop: "4px",
                    }}
                  >
                    {submitting ? "Submitting..." : "Request a Demo"}
                  </button>

                  <p
                    className="text-center"
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: "11px",
                      color: "rgba(6,19,65,0.30)",
                      lineHeight: "1.5",
                      marginTop: "12px",
                    }}
                  >
                    By submitting, you agree to receive communications from Momentify. We respect your privacy.
                  </p>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </div>
      </div>
    </section>
  );
}
