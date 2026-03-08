"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Tier helpers ─────────────────────────────────────── */

function getTierColor(value: number): string {
  if (value >= 85) return "#0CF4DF";
  if (value >= 70) return "#5FD9C2";
  if (value >= 40) return "#F2B33D";
  return "#E5484D";
}

function getTierName(value: number): string {
  if (value >= 85) return "Elite ROX";
  if (value >= 70) return "High ROX";
  if (value >= 40) return "Needs Optimization";
  return "Critical Gap";
}

/* ── Gauge SVG ───────────────────────────────────────── */

function CalcGauge({ score, size = "normal" }: { score: number; size?: "normal" | "large" }) {
  const cx = 200;
  const cy = 200;
  const r = 140;

  const polarToCart = (angleDeg: number) => {
    const rad = (Math.PI * (180 - angleDeg)) / 180;
    return { x: Math.round((cx + r * Math.cos(rad)) * 100) / 100, y: Math.round((cy - r * Math.sin(rad)) * 100) / 100 };
  };

  const arcPath = (startDeg: number, endDeg: number) => {
    const s = polarToCart(startDeg);
    const e = polarToCart(endDeg);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
  };

  const zones = [
    { start: 0, end: 70.2, color: "#E5484D" },
    { start: 70.2, end: 124.2, color: "#F2B33D" },
    { start: 124.2, end: 151.2, color: "#5FD9C2" },
    { start: 151.2, end: 180, color: "#0CF4DF" },
  ];

  const needleAngle = (score / 100) * 180;
  const needleEnd = polarToCart(needleAngle);

  const w = size === "large" ? "500px" : "280px";

  return (
    <svg viewBox="0 0 400 240" style={{ width: w, maxWidth: "100%", margin: "0 auto", display: "block" }}>
      <path d={arcPath(0, 180)} stroke="rgba(6,19,65,0.06)" strokeWidth="18" fill="none" strokeLinecap="round" />
      {zones.map((z) => (
        <path key={z.color} d={arcPath(z.start, z.end)} stroke={z.color} strokeWidth="18" fill="none" strokeLinecap="round" />
      ))}
      <line
        x1={cx}
        y1={cy}
        x2={needleEnd.x}
        y2={needleEnd.y}
        stroke="#061341"
        strokeWidth="3"
        style={{ transition: "all 600ms ease" }}
      />
      <circle cx={cx} cy={cy} r="6" fill="#061341" />
    </svg>
  );
}

/* ── Hero animated gauge ─────────────────────────────── */

const heroScores = [22, 54, 78, 92, 45, 87, 68, 95, 33, 81];

function HeroGauge() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % heroScores.length), 2400);
    return () => clearInterval(id);
  }, []);
  const score = heroScores[idx];
  const tier = getTierName(score);
  const color = getTierColor(score);

  const cx = 200, cy = 200, r = 140;
  const polarToCart = (angleDeg: number) => {
    const rad = (Math.PI * (180 - angleDeg)) / 180;
    return { x: Math.round((cx + r * Math.cos(rad)) * 100) / 100, y: Math.round((cy - r * Math.sin(rad)) * 100) / 100 };
  };
  const arcPath = (startDeg: number, endDeg: number) => {
    const s = polarToCart(startDeg);
    const e = polarToCart(endDeg);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
  };
  const zones = [
    { start: 0, end: 70.2, color: "#E5484D" },
    { start: 70.2, end: 124.2, color: "#F2B33D" },
    { start: 124.2, end: 151.2, color: "#5FD9C2" },
    { start: 151.2, end: 180, color: "#0CF4DF" },
  ];
  const needleAngle = (score / 100) * 180;
  const needleEnd = polarToCart(needleAngle);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg viewBox="0 0 400 240" style={{ width: "340px", maxWidth: "100%", display: "block" }}>
        <path d={arcPath(0, 180)} stroke="rgba(255,255,255,0.08)" strokeWidth="18" fill="none" strokeLinecap="round" />
        {zones.map((z) => (
          <path key={z.color} d={arcPath(z.start, z.end)} stroke={z.color} strokeWidth="18" fill="none" strokeLinecap="round" />
        ))}
        <line x1={cx} y1={cy} x2={needleEnd.x} y2={needleEnd.y} stroke="#FFFFFF" strokeWidth="3" style={{ transition: "all 800ms cubic-bezier(0.34, 1.56, 0.64, 1)" }} />
        <circle cx={cx} cy={cy} r="6" fill="#FFFFFF" />
      </svg>
      <p
        style={{
          fontFamily: "var(--font-inter)",
          fontWeight: 600,
          fontSize: "42px",
          color,
          lineHeight: 1,
          marginTop: "-12px",
          transition: "color 600ms ease",
        }}
      >
        {score}
      </p>
      <p
        style={{
          fontFamily: "var(--font-inter)",
          fontWeight: 500,
          fontSize: "14px",
          color: "rgba(255,255,255,0.5)",
          letterSpacing: "0.06em",
          textTransform: "uppercase" as const,
          marginTop: "4px",
          transition: "color 600ms ease",
        }}
      >
        {tier}
      </p>
    </div>
  );
}

/* ── Animation variants ──────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

/* ── Shared input styles (hoisted) ───────────────────── */

const inputStyle: React.CSSProperties = {
  background: "#FFFFFF",
  border: "1px solid rgba(212,66,26,0.15)",
  borderRadius: "8px",
  padding: "12px 16px",
  fontFamily: "var(--font-inter)",
  fontWeight: 400,
  fontSize: "15px",
  color: "#061341",
  width: "100%",
  outline: "none",
  transition: "border-color 200ms ease, box-shadow 200ms ease",
};

const inputFocusStyle = "focus:border-[#F25E3D] focus:shadow-[0_0_0_3px_rgba(242,94,61,0.15)]";

/* ── Category card (hoisted) ─────────────────────────── */

function CategoryCard({
  num,
  name,
  weight,
  score,
  children,
}: {
  num: string;
  name: string;
  weight: string;
  score: number | null;
  children: React.ReactNode;
}) {
  const barWidth = score !== null ? `${Math.min(score, 100)}%` : "0%";
  const barColor = score !== null ? getTierColor(score) : "rgba(249,160,142,0.12)";

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.9)",
        border: "1px solid rgba(212,66,26,0.1)",
        borderRadius: "16px",
        padding: "32px",
        boxShadow: "0 1px 3px rgba(212,66,26,0.04)",
      }}
    >
      <span
        style={{
          display: "inline-block",
          fontFamily: "var(--font-inter)",
          fontWeight: 700,
          fontSize: "11px",
          color: "#D4421A",
          background: "rgba(212,66,26,0.08)",
          borderRadius: "20px",
          padding: "4px 10px",
          marginBottom: "8px",
        }}
      >
        {num}
      </span>
      <h3 style={{ fontFamily: "var(--font-inter)", fontWeight: 700, fontSize: "18px", color: "#061341", marginBottom: "4px" }}>
        {name}
      </h3>
      <p style={{ fontFamily: "var(--font-inter)", fontWeight: 400, fontSize: "12px", color: "rgba(6,19,65,0.4)", marginBottom: "24px" }}>
        {weight}
      </p>
      {children}
      {/* Category score bar */}
      <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid rgba(6,19,65,0.06)" }}>
        <div className="flex items-center justify-between mb-2">
          <span style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "12px", color: "rgba(6,19,65,0.45)" }}>Category Score</span>
          <span style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "13px", color: "#061341" }}>
            {score !== null ? Math.round(score) : "--"}
          </span>
        </div>
        <div style={{ height: "4px", borderRadius: "2px", background: "rgba(212,66,26,0.08)", overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: barWidth,
              background: barColor,
              borderRadius: "2px",
              transition: "width 400ms ease, background 400ms ease",
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* ── Live Score Panel (hoisted) ──────────────────────── */

function LiveScorePanel({
  totalScore,
  categoryNames,
  categoryScores,
  skippedCount,
  bonusValue,
}: {
  totalScore: number | null;
  categoryNames: string[];
  categoryScores: (number | null)[];
  skippedCount: number;
  bonusValue: number | null;
}) {
  const displayScore = totalScore !== null ? Math.round(totalScore) : 0;
  const hasData = totalScore !== null;

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.9)",
        border: "1px solid rgba(212,66,26,0.1)",
        borderRadius: "20px",
        padding: "32px",
        boxShadow: "0 2px 8px rgba(212,66,26,0.06)",
      }}
    >
      <CalcGauge score={hasData ? displayScore : 0} />
      <div className="text-center -mt-2">
        <p
          style={{
            fontFamily: "var(--font-inter)",
            fontWeight: 600,
            fontSize: "56px",
            color: hasData ? getTierColor(displayScore) : "rgba(6,19,65,0.2)",
            lineHeight: 1,
            letterSpacing: "-0.03em",
            transition: "color 600ms ease",
          }}
        >
          {hasData ? displayScore : "--"}
        </p>
        <p
          className="mt-1 uppercase"
          style={{
            fontFamily: "var(--font-inter)",
            fontWeight: 600,
            fontSize: "11px",
            color: "rgba(6,19,65,0.4)",
            letterSpacing: "0.14em",
          }}
        >
          ROX SCORE
        </p>
        <p
          className="mt-1"
          style={{
            fontFamily: "var(--font-inter)",
            fontWeight: 600,
            fontSize: "14px",
            color: hasData ? getTierColor(displayScore) : "rgba(6,19,65,0.3)",
            transition: "color 600ms ease",
          }}
        >
          {hasData ? getTierName(displayScore) : "Enter your data to see your score"}
        </p>
      </div>

      {/* Category bars */}
      <div className="mt-6 space-y-3">
        {categoryNames.map((name, i) => {
          const s = categoryScores[i];
          const val = s !== null ? Math.round(s) : null;
          return (
            <div key={name}>
              <div className="flex items-center justify-between mb-1">
                <span style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "12px", color: "rgba(6,19,65,0.45)" }}>{name}</span>
                <span style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "13px", color: "#061341" }}>{val !== null ? val : "--"}</span>
              </div>
              <div style={{ height: "3px", borderRadius: "1.5px", background: "rgba(6,19,65,0.06)" }}>
                <div
                  style={{
                    height: "100%",
                    width: val !== null ? `${Math.min(val, 100)}%` : "0%",
                    background: val !== null ? getTierColor(val) : "transparent",
                    borderRadius: "1.5px",
                    transition: "width 400ms ease, background 400ms ease",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {skippedCount > 0 && (
        <p style={{ fontFamily: "var(--font-inter)", fontWeight: 400, fontSize: "11px", color: "rgba(6,19,65,0.35)", marginTop: "12px" }}>
          {skippedCount} field(s) skipped. Score calculated from available data.
        </p>
      )}

      {/* Bonus value row */}
      <div style={{ borderTop: "1px solid rgba(6,19,65,0.06)", marginTop: "16px", paddingTop: "16px" }}>
        <div className="flex items-center justify-between">
          <span style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "12px", color: "rgba(242,179,61,0.8)" }}>Potential Value</span>
          <span style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "14px", color: bonusValue ? "#F2B33D" : "rgba(6,19,65,0.25)" }}>
            {bonusValue ? `$${bonusValue.toLocaleString()}` : "--"}
          </span>
        </div>
      </div>

      {/* Panel footer */}
      <div style={{ borderTop: "1px solid rgba(6,19,65,0.06)", marginTop: "16px", paddingTop: "16px" }}>
        <p style={{ fontFamily: "var(--font-inter)", fontWeight: 400, fontSize: "12px", color: "rgba(6,19,65,0.35)" }}>
          Fill in what you know. Skip the rest.
        </p>
      </div>
    </div>
  );
}

/* ── Types ────────────────────────────────────────────── */

interface FieldState {
  value: string;
  skipped: boolean;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  jobTitle: string;
  phone: string;
  eventsPerYear: string;
}

/* ── Score calculation ───────────────────────────────── */

function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

/* ── Tier interpretation content ─────────────────────── */

const tierInterpretations: Record<string, { headline: string; body: string }> = {
  "Critical Gap": {
    headline: "Your events are costing more than they are delivering.",
    body: "Attendee capture is inconsistent, engagement depth is low, follow-up is slow, and sponsor conversions are not tracking. You likely lack the visibility and tools to identify and act on your best opportunities. Every category has room to improve, and improvement in any one of them compounds across the others.",
  },
  "Needs Optimization": {
    headline: "You are capturing some value, but leaving sponsor ROX on the table.",
    body: "You are getting results from your events, but there are clear inefficiencies. Engagement quality or follow-up speed is likely dragging your score down. High-value guests are slipping away in the gap between the event floor and the follow-up inbox. Closing those gaps compounds quickly.",
  },
  "High ROX": {
    headline: "Your events are performing above average. Now prove it with real data.",
    body: "Strong capture, good engagement, and timely follow-up. Some of your scores may be based on estimates rather than actual tracked behavior. Momentify can validate your assumptions, surface the gaps you cannot see yet, and push you into the Elite tier.",
  },
  "Elite ROX": {
    headline: "Highly optimized across every category. Keep it that way.",
    body: "You are in the top-performing tier. This level requires constant visibility and quick reaction to maintain. Momentify provides the ongoing analytics, trend tracking, and multi-event scalability that keeps Elite performance from slipping.",
  },
};

/* ── Impact lines per category ───────────────────────── */

const impactLines: Record<string, { headline: string; body: string }> = {
  "Attendee Capture Rate": {
    headline: "Momentify captures every interaction, not just the gate scans.",
    body: "Zone tracking, check-in flows, and engagement tagging give you a true capture rate across every touchpoint.",
  },
  "Engagement Quality": {
    headline: "See exactly what each guest cared about.",
    body: "Content selections, session attendance, and activation notes are all tracked in real time.",
  },
  "Follow-Up Speed": {
    headline: "High-value guests route to the right person before the event ends.",
    body: "Smart Columns score and assign leads automatically. Same-day follow-up becomes the default.",
  },
  "Sponsor Conversion": {
    headline: "Attribute sponsor value to real outcomes, not impressions.",
    body: "Engagement-based scoring surfaces your highest-value sponsor activations so your team focuses where it counts.",
  },
};

/* ── Follow-up context messages ──────────────────────── */

function getFollowUpContext(days: number): { text: string; color: string } {
  if (days === 0) return { text: "Same-day follow-up. Elite performance.", color: "#0CF4DF" };
  if (days <= 3) return { text: "Strong. Most event teams average 5-7 days.", color: "#5FD9C2" };
  if (days <= 7) return { text: "Room to improve. Guest intent fades fast after an event.", color: "#F2B33D" };
  return { text: "High risk of lost leads. Speed is the biggest gap.", color: "#E5484D" };
}

/* ── Main component ──────────────────────────────────── */

export default function EventsVenuesROXCalculator() {
  // Calculator vs Results state
  const [showResults, setShowResults] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Engagement quality toggle: false = Option B (default), true = Option A
  const [engagementOptionA, setEngagementOptionA] = useState(false);

  // Category 1 fields
  const [c1_attendees, setC1Attendees] = useState<FieldState>({ value: "", skipped: false });
  const [c1_captured, setC1Captured] = useState<FieldState>({ value: "", skipped: false });

  // Category 2 fields (Option A)
  const [c2a_avgTime, setC2aAvgTime] = useState<FieldState>({ value: "", skipped: false });
  const [c2a_targetTime, setC2aTargetTime] = useState<FieldState>({ value: "", skipped: false });

  // Category 2 fields (Option B)
  const [c2b_meaningful, setC2bMeaningful] = useState<FieldState>({ value: "", skipped: false });
  const [c2b_totalCaptured, setC2bTotalCaptured] = useState<FieldState>({ value: "", skipped: false });

  // Category 3 fields
  const [c3_days, setC3Days] = useState<FieldState>({ value: "", skipped: false });

  // Category 4 fields
  const [c4_conversions, setC4Conversions] = useState<FieldState>({ value: "", skipped: false });
  const [c4_totalCaptured, setC4TotalCaptured] = useState<FieldState>({ value: "", skipped: false });

  // Bonus fields
  const [bonus_qualifiedLeads, setBonusQualifiedLeads] = useState<FieldState>({ value: "", skipped: false });
  const [bonus_valuePerLead, setBonusValuePerLead] = useState<FieldState>({ value: "", skipped: false });

  // Consultation form
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    jobTitle: "",
    phone: "",
    eventsPerYear: "",
  });

  // Auto-populate total captured from Category 1 to Category 2B and 4
  const lastAutoC2b = useRef("");
  const lastAutoC4 = useRef("");
  useEffect(() => {
    const capturedVal = c1_captured.value;
    if (capturedVal && !c2b_totalCaptured.skipped && (c2b_totalCaptured.value === "" || c2b_totalCaptured.value === lastAutoC2b.current)) {
      setC2bTotalCaptured((prev) => ({ ...prev, value: capturedVal }));
      lastAutoC2b.current = capturedVal;
    }
    if (capturedVal && !c4_totalCaptured.skipped && (c4_totalCaptured.value === "" || c4_totalCaptured.value === lastAutoC4.current)) {
      setC4TotalCaptured((prev) => ({ ...prev, value: capturedVal }));
      lastAutoC4.current = capturedVal;
    }
  }, [c1_captured.value, c2b_totalCaptured.value, c2b_totalCaptured.skipped, c4_totalCaptured.value, c4_totalCaptured.skipped]);

  // Category scores
  const calcCategory1 = useCallback((): number | null => {
    if (c1_attendees.skipped && c1_captured.skipped) return null;
    const attendees = parseFloat(c1_attendees.value);
    const captured = parseFloat(c1_captured.value);
    if (!attendees || !captured || attendees === 0) return null;
    if (c1_attendees.skipped || c1_captured.skipped) return null;
    return clamp((captured / attendees) * 100, 0, 100);
  }, [c1_attendees, c1_captured]);

  const calcCategory2 = useCallback((): number | null => {
    if (engagementOptionA) {
      if (c2a_avgTime.skipped && c2a_targetTime.skipped) return null;
      const avg = parseFloat(c2a_avgTime.value);
      const target = parseFloat(c2a_targetTime.value);
      if (!avg || !target || target === 0) return null;
      if (c2a_avgTime.skipped || c2a_targetTime.skipped) return null;
      return clamp((avg / target) * 100, 0, 100);
    } else {
      if (c2b_meaningful.skipped && c2b_totalCaptured.skipped) return null;
      const meaningful = parseFloat(c2b_meaningful.value);
      const total = parseFloat(c2b_totalCaptured.value);
      if (!meaningful || !total || total === 0) return null;
      if (c2b_meaningful.skipped || c2b_totalCaptured.skipped) return null;
      return clamp((meaningful / total) * 100, 0, 100);
    }
  }, [engagementOptionA, c2a_avgTime, c2a_targetTime, c2b_meaningful, c2b_totalCaptured]);

  const calcCategory3 = useCallback((): number | null => {
    if (c3_days.skipped) return null;
    const days = parseFloat(c3_days.value);
    if (days === undefined || days === null || isNaN(days)) return null;
    return clamp(100 - days * 5, 0, 100);
  }, [c3_days]);

  const calcCategory4 = useCallback((): number | null => {
    if (c4_conversions.skipped && c4_totalCaptured.skipped) return null;
    const conversions = parseFloat(c4_conversions.value);
    const total = parseFloat(c4_totalCaptured.value);
    if (!conversions || !total || total === 0) return null;
    if (c4_conversions.skipped || c4_totalCaptured.skipped) return null;
    return clamp((conversions / total) * 100, 0, 100);
  }, [c4_conversions, c4_totalCaptured]);

  const categoryScores = useMemo(() => {
    return [calcCategory1(), calcCategory2(), calcCategory3(), calcCategory4()];
  }, [calcCategory1, calcCategory2, calcCategory3, calcCategory4]);

  const categoryNames = ["Attendee Capture Rate", "Engagement Quality", "Follow-Up Speed", "Sponsor Conversion"];

  const totalScore = useMemo(() => {
    const valid = categoryScores.filter((s) => s !== null) as number[];
    if (valid.length === 0) return null;
    const avg = valid.reduce((a, b) => a + b, 0) / valid.length;
    return Math.round(avg * 10) / 10;
  }, [categoryScores]);

  const skippedCount = useMemo(() => {
    const fields = [c1_attendees, c1_captured, c2a_avgTime, c2a_targetTime, c2b_meaningful, c2b_totalCaptured, c3_days, c4_conversions, c4_totalCaptured];
    return fields.filter((f) => f.skipped).length;
  }, [c1_attendees, c1_captured, c2a_avgTime, c2a_targetTime, c2b_meaningful, c2b_totalCaptured, c3_days, c4_conversions, c4_totalCaptured]);

  // Bonus calculation
  const bonusValue = useMemo(() => {
    const q = parseFloat(bonus_qualifiedLeads.value);
    const v = parseFloat(bonus_valuePerLead.value);
    if (!q || !v || q <= 0 || v <= 0) return null;
    return q * v;
  }, [bonus_qualifiedLeads.value, bonus_valuePerLead.value]);

  // Results: lowest 3 categories
  const lowestCategories = useMemo(() => {
    const scored = categoryNames.map((name, i) => ({ name, score: categoryScores[i] })).filter((c) => c.score !== null) as { name: string; score: number }[];
    scored.sort((a, b) => a.score - b.score);
    return scored.slice(0, 3);
  }, [categoryScores]);

  const handleCalculate = () => {
    if (totalScore === null) return;
    setShowResults(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRecalculate = () => {
    setShowResults(false);
    setFormSubmitted(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // <!-- On submit: POST to HubSpot Forms API. Also trigger booking link redirect or modal (Superhuman or Google Calendar). Replace action URL when HubSpot form ID is available. -->
    setFormSubmitted(true);
  };

  /* ── Shared field input renderer ───────────────────── */

  function renderField(
    label: string,
    description: string,
    fieldState: FieldState,
    setFieldState: React.Dispatch<React.SetStateAction<FieldState>>,
    placeholder: string,
    prefix?: string,
    maxVal?: number,
    capNote?: string
  ) {
    const isSkipped = fieldState.skipped;
    const numVal = parseFloat(fieldState.value);
    const showCap = capNote && maxVal && !isNaN(numVal) && numVal > maxVal;

    return (
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1.5">
          <label
            style={{
              fontFamily: "var(--font-inter)",
              fontWeight: 500,
              fontSize: "13px",
              color: isSkipped ? "rgba(6,19,65,0.25)" : "rgba(6,19,65,0.6)",
              textDecoration: isSkipped ? "line-through" : "none",
            }}
          >
            {label}
          </label>
          <button
            type="button"
            onClick={() => setFieldState((prev) => ({ ...prev, skipped: !prev.skipped }))}
            style={{
              fontFamily: "var(--font-inter)",
              fontWeight: 400,
              fontSize: "12px",
              color: "rgba(6,19,65,0.35)",
              textDecoration: "underline",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            {isSkipped ? "Undo skip" : "Skip"}
          </button>
        </div>
        <div className="relative">
          {prefix && (
            <span
              className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "15px", color: "rgba(6,19,65,0.4)" }}
            >
              {prefix}
            </span>
          )}
          <input
            type="number"
            placeholder={placeholder}
            value={fieldState.value}
            onChange={(e) => setFieldState((prev) => ({ ...prev, value: e.target.value }))}
            disabled={isSkipped}
            className={inputFocusStyle}
            style={{
              ...inputStyle,
              ...(prefix ? { paddingLeft: "32px" } : {}),
              ...(isSkipped ? { opacity: 0.3, background: "rgba(6,19,65,0.02)" } : {}),
            }}
          />
        </div>
        <p style={{ fontFamily: "var(--font-inter)", fontWeight: 400, fontSize: "12px", color: "rgba(6,19,65,0.45)", marginTop: "6px", lineHeight: 1.5 }}>
          {description}
        </p>
        {showCap && (
          <p style={{ fontFamily: "var(--font-inter)", fontWeight: 400, fontSize: "12px", color: "#E5484D", marginTop: "4px" }}>
            {capNote}
          </p>
        )}
      </div>
    );
  }

  /* ── Results Screen ────────────────────────────────── */

  function ResultsScreen() {
    const displayScore = totalScore !== null ? Math.round(totalScore) : 0;
    const tierName = getTierName(displayScore);
    const tierColor = getTierColor(displayScore);
    const interp = tierInterpretations[tierName];

    const handleDownloadPDF = async () => {
      const el = document.getElementById("rox-results");
      if (!el) return;
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;
      // Clone element at fixed 900px width for consistent PDF layout
      const clone = el.cloneNode(true) as HTMLElement;
      clone.style.width = "900px";
      clone.style.minWidth = "900px";
      clone.style.maxWidth = "900px";
      clone.style.padding = "48px 40px";
      clone.style.background = "linear-gradient(135deg, #1A0400 0%, #8F200A 55%, #F25E3D 100%)";
      clone.style.borderRadius = "0";
      clone.style.position = "fixed";
      clone.style.left = "-10000px";
      clone.style.top = "0";
      clone.style.zIndex = "-1";
      document.body.appendChild(clone);
      const canvas = await html2canvas(clone, { scale: 2, backgroundColor: "#1A0400", useCORS: true });
      document.body.removeChild(clone);
      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = 595; // A4 width in points
      const pdfHeight = (canvas.height / canvas.width) * pdfWidth;
      const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: [pdfWidth, pdfHeight + 80] });
      // Header
      pdf.setFillColor(26, 4, 0);
      pdf.rect(0, 0, pdfWidth, 40, "F");
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.setTextColor(255, 255, 255);
      pdf.text("MOMENTIFY  |  Venues & Events ROX\u2122 Scorecard", 24, 26);
      pdf.setFontSize(9);
      pdf.setTextColor(249, 160, 142);
      pdf.text("momentify.com/rox/venues", pdfWidth - 24, 26, { align: "right" });
      pdf.addImage(imgData, "PNG", 0, 40, pdfWidth, pdfHeight);
      pdf.save(`Momentify-Venues-Events-ROX-Score-${displayScore}.pdf`);
    };

    const handleEmailResults = () => {
      const subject = encodeURIComponent(`My Venues & Events ROX Score: ${displayScore} (${tierName})`);
      const body = encodeURIComponent(
        `My Venues & Events ROX Score: ${displayScore} / 100\nTier: ${tierName}\n\n` +
        categoryNames.map((name, i) => `${name}: ${categoryScores[i] !== null ? Math.round(categoryScores[i]!) : "--"}`).join("\n") +
        (bonusValue ? `\n\nPotential Value Generated: $${bonusValue.toLocaleString()}` : "") +
        `\n\nCalculate your own ROX score: ${typeof window !== "undefined" ? window.location.href : ""}`
      );
      window.open(`mailto:?subject=${subject}&body=${body}`, "_self");
    };

    return (
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 0 64px" }}>
        {/* Results header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <p style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "11px", color: "rgba(255,255,255,0.5)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "8px" }}>
              YOUR RESULTS
            </p>
            <h2 style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "clamp(32px, 3.5vw, 46px)", lineHeight: 1.15, letterSpacing: "-0.02em" }}>
              <span style={{ color: "#FFFFFF" }}>Venues &amp; Events</span><br />
              <span style={{ background: "linear-gradient(135deg, #F25E3D, #F9A08E)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>ROX&#8482; Scorecard</span>
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 transition-all duration-200 hover:opacity-80 cursor-pointer"
              style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "13px", color: "#FFFFFF", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px", padding: "10px 16px" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
              Download PDF
            </button>
            <button
              onClick={handleEmailResults}
              className="flex items-center gap-2 transition-all duration-200 hover:opacity-80 cursor-pointer"
              style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "13px", color: "#FFFFFF", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px", padding: "10px 16px" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
              Email Results
            </button>
          </div>
        </div>

        {/* Back link */}
        <button
          onClick={handleRecalculate}
          style={{
            fontFamily: "var(--font-inter)",
            fontWeight: 500,
            fontSize: "13px",
            color: "rgba(255,255,255,0.6)",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          Recalculate
        </button>

        <div id="rox-results">
        {/* Score display */}
        <div className="mb-8" style={{ background: "rgba(255,255,255,0.9)", borderRadius: "20px", padding: "48px 32px", border: "1px solid rgba(212,66,26,0.1)", boxShadow: "0 1px 3px rgba(212,66,26,0.04)" }}>
          <div style={{ textAlign: "center", maxWidth: "480px", margin: "0 auto" }}>
            <CalcGauge score={displayScore} size="large" />
            <p
              className="-mt-4"
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 600,
                fontSize: "11px",
                color: "rgba(6,19,65,0.4)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: "8px",
              }}
            >
              YOUR ROX TIER
            </p>
            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 600,
                fontSize: "80px",
                color: tierColor,
                lineHeight: 1,
                letterSpacing: "-0.03em",
              }}
            >
              {displayScore}
            </p>
            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 700,
                fontSize: "20px",
                color: tierColor,
                marginTop: "8px",
              }}
            >
              {tierName}
            </p>
          </div>
        </div>

        {/* Score breakdown 2x2 grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {categoryNames.map((name, i) => {
            const s = categoryScores[i];
            const val = s !== null ? Math.round(s) : 0;
            const catTier = getTierName(val);
            const catColor = getTierColor(val);
            const interpretations: Record<string, string> = {
              "Attendee Capture Rate": s !== null && s >= 70 ? "Strong capture rate relative to total attendance." : "Too many attendees are leaving without being captured.",
              "Engagement Quality": s !== null && s >= 70 ? "Guests are spending meaningful time engaging with your content." : "Interactions are shallow. Guests are not engaging deeply.",
              "Follow-Up Speed": s !== null && s >= 70 ? "Your team is following up quickly after the event." : "Guests are going cold before your team reaches out.",
              "Sponsor Conversion": s !== null && s >= 70 ? "Strong post-event conversion from attendees to outcomes." : "Captured attendees are not converting to meetings or renewals.",
            };

            return (
              <div
                key={name}
                style={{
                  background: "rgba(255,255,255,0.9)",
                  border: "1px solid rgba(212,66,26,0.1)",
                  borderRadius: "14px",
                  padding: "24px 28px",
                  boxShadow: "0 1px 3px rgba(212,66,26,0.04)",
                }}
              >
                <p style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "13px", color: "rgba(6,19,65,0.45)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>
                  {name}
                </p>
                <p style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "36px", color: catColor, lineHeight: 1, marginBottom: "4px" }}>
                  {s !== null ? val : "--"}
                </p>
                <p style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "12px", color: catColor, marginBottom: "8px" }}>
                  {s !== null ? catTier : "No data"}
                </p>
                <p style={{ fontFamily: "var(--font-inter)", fontWeight: 400, fontSize: "13px", color: "rgba(6,19,65,0.5)", lineHeight: 1.5 }}>
                  {interpretations[name]}
                </p>
              </div>
            );
          })}
        </div>

        {/* Potential Value callout (conditional) */}
        {bonusValue && (
          <div
            className="mb-8"
            style={{
              background: "rgba(255,255,255,0.9)",
              border: "1px solid rgba(242,179,61,0.2)",
              borderRadius: "16px",
              padding: "24px 28px",
            }}
          >
            <p style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "10px", color: "#F2B33D", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "12px" }}>
              POTENTIAL VALUE GENERATED
            </p>
            <p style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "56px", color: "#F2B33D", lineHeight: 1, marginBottom: "8px" }}>
              ${bonusValue.toLocaleString()}
            </p>
            <p style={{ fontFamily: "var(--font-inter)", fontWeight: 400, fontSize: "14px", color: "rgba(6,19,65,0.5)", marginBottom: "16px" }}>
              Based on {bonus_qualifiedLeads.value} qualified leads at ${parseFloat(bonus_valuePerLead.value).toLocaleString()} per lead.
            </p>
            <p style={{ fontFamily: "var(--font-inter)", fontWeight: 400, fontSize: "14px", color: "rgba(6,19,65,0.55)", lineHeight: 1.7 }}>
              This is the estimated pipeline value sitting inside your captured attendees. Your ROX score tells you how effectively your process converts that opportunity. A Critical Gap score with high potential value means the pipeline is there. The process to capture it is not.
            </p>
            {totalScore !== null && totalScore < 70 && (
              <p style={{ fontFamily: "var(--font-inter)", fontWeight: 400, fontSize: "14px", color: "rgba(242,179,61,0.9)", lineHeight: 1.7, marginTop: "12px" }}>
                Improving your lowest-scoring categories directly increases the share of this value your team actually closes.
              </p>
            )}
          </div>
        )}

        {/* Tier interpretation */}
        {interp && (
          <div
            className="mb-8"
            style={{
              background: "rgba(255,255,255,0.9)",
              borderLeft: `3px solid ${tierColor}`,
              borderRadius: "0 14px 14px 0",
              padding: "28px 32px",
            }}
          >
            <h3 style={{ fontFamily: "var(--font-inter)", fontWeight: 700, fontSize: "20px", color: "#061341", marginBottom: "12px" }}>
              {interp.headline}
            </h3>
            <p style={{ fontFamily: "var(--font-inter)", fontWeight: 400, fontSize: "15px", color: "rgba(6,19,65,0.55)", lineHeight: 1.7 }}>
              {interp.body}
            </p>
          </div>
        )}

        {/* Momentify impact block */}
        {lowestCategories.length > 0 && (
          <div className="mb-12" style={{ background: "rgba(255,255,255,0.9)", borderRadius: "16px", padding: "32px", border: "1px solid rgba(212,66,26,0.1)", boxShadow: "0 1px 3px rgba(212,66,26,0.04)" }}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {lowestCategories.map((cat) => {
                const impact = impactLines[cat.name];
                if (!impact) return null;
                return (
                  <div key={cat.name}>
                    <p style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "11px", color: "#D4421A", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>
                      {cat.name}
                    </p>
                    <h4 style={{ fontFamily: "var(--font-inter)", fontWeight: 700, fontSize: "16px", color: "#061341", marginBottom: "6px", lineHeight: 1.4 }}>
                      {impact.headline}
                    </h4>
                    <p style={{ fontFamily: "var(--font-inter)", fontWeight: 400, fontSize: "13px", color: "rgba(6,19,65,0.5)", lineHeight: 1.5 }}>
                      {impact.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        </div>

        {/* Consultation form */}
        <div
          style={{
            background: "rgba(255,255,255,0.9)",
            border: "1px solid rgba(212,66,26,0.1)",
            borderRadius: "20px",
            padding: "40px 48px",
            boxShadow: "0 2px 8px rgba(212,66,26,0.06)",
          }}
        >
          <AnimatePresence mode="wait">
            {!formSubmitted ? (
              <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                <p style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "11px", color: "#D4421A", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "12px" }}>
                  FREE 30-MINUTE CONSULTATION
                </p>
                <h3 style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "28px", color: "#061341", marginBottom: "8px" }}>
                  See how much your score could improve with{" "}
                  <span style={{ background: "linear-gradient(135deg, #0CF4DF, #254FE5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Momentify</span>.
                </h3>
                <p style={{ fontFamily: "var(--font-inter)", fontWeight: 400, fontSize: "15px", color: "rgba(6,19,65,0.55)", lineHeight: 1.65, marginBottom: "32px", maxWidth: "600px" }}>
                  We&apos;ll walk through your results and show you exactly where Momentify moves the needle on your lowest-scoring categories.
                </p>

                <form onSubmit={handleFormSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    {[
                      { key: "firstName", label: "First Name", type: "text", required: true },
                      { key: "lastName", label: "Last Name", type: "text", required: true },
                      { key: "email", label: "Work Email", type: "email", required: true },
                      { key: "company", label: "Company", type: "text", required: true },
                      { key: "jobTitle", label: "Job Title", type: "text", required: false },
                      { key: "phone", label: "Phone", type: "tel", required: false },
                    ].map((field) => (
                      <div key={field.key}>
                        <label style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "13px", color: "rgba(6,19,65,0.6)", marginBottom: "6px", display: "block" }}>
                          {field.label}{field.required && <span style={{ color: "#D4421A" }}> *</span>}
                        </label>
                        <input
                          type={field.type}
                          required={field.required}
                          value={formData[field.key as keyof FormData]}
                          onChange={(e) => setFormData((prev) => ({ ...prev, [field.key]: e.target.value }))}
                          className={inputFocusStyle}
                          style={inputStyle}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mb-6">
                    <label style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "13px", color: "rgba(6,19,65,0.6)", marginBottom: "6px", display: "block" }}>
                      How many events does your team produce or host per year?
                    </label>
                    <select
                      value={formData.eventsPerYear}
                      onChange={(e) => setFormData((prev) => ({ ...prev, eventsPerYear: e.target.value }))}
                      className={inputFocusStyle}
                      style={{ ...inputStyle, appearance: "none" }}
                    >
                      <option value="">Select...</option>
                      <option value="1-3">1-3</option>
                      <option value="4-8">4-8</option>
                      <option value="9-15">9-15</option>
                      <option value="16+">16+</option>
                      <option value="Not sure yet">Not sure yet</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full transition-all duration-200 hover:opacity-90 hover:-translate-y-[1px] cursor-pointer"
                    style={{
                      background: "linear-gradient(135deg, #D4421A, #F25E3D)",
                      color: "#FFFFFF",
                      fontFamily: "var(--font-inter)",
                      fontWeight: 700,
                      fontSize: "16px",
                      padding: "16px",
                      borderRadius: "8px",
                      border: "none",
                    }}
                  >
                    Book My Free Consultation
                  </button>
                  <p style={{ fontFamily: "var(--font-inter)", fontWeight: 400, fontSize: "12px", color: "rgba(6,19,65,0.35)", marginTop: "12px", textAlign: "center" }}>
                    No commitment. No sales pressure. Just your data and a conversation.
                  </p>
                </form>
              </motion.div>
            ) : (
              <motion.div key="confirmation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="text-center py-8">
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    border: "2px solid #D4421A",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4421A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 style={{ fontFamily: "var(--font-inter)", fontWeight: 700, fontSize: "24px", color: "#061341", marginBottom: "12px" }}>
                  You&apos;re on the calendar.
                </h3>
                <p style={{ fontFamily: "var(--font-inter)", fontWeight: 400, fontSize: "15px", color: "rgba(6,19,65,0.55)", lineHeight: 1.6, maxWidth: "480px", margin: "0 auto" }}>
                  We will be in touch shortly to confirm your consultation time. In the meantime, explore how Momentify works for events and venues teams.
                </p>
                <a
                  href="/solutions/venues"
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontWeight: 500,
                    fontSize: "14px",
                    color: "#D4421A",
                    textDecoration: "none",
                    marginTop: "16px",
                    display: "inline-block",
                  }}
                  className="hover:underline"
                >
                  See how it works &rarr;
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  /* ── Render ─────────────────────────────────────────── */

  return (
    <>
      {/* ═══════════════════ FULL-PAGE LAYOUT ═══════════════════ */}
      <section
        style={{
          position: "relative",
          backgroundImage: "linear-gradient(135deg, #1A0400 0%, #8F200A 55%, #F25E3D 100%)",
          paddingTop: "140px",
          paddingBottom: "120px",
        }}
      >
        {/* Decorative background layer (clipped to prevent horizontal scroll) */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMaxYMax slice" style={{ width: "100%", height: "100%" }}>
            <path d="M1440 900 L1440 270 L960 0 L480 0 L1008 360 L1008 900 Z" fill="white" fillOpacity="0.05" />
            <path d="M1440 900 L1440 468 L864 108 L384 108 L864 468 L864 900 Z" fill="white" fillOpacity="0.04" />
          </svg>
          {/* Ambient glow orbs */}
          <div style={{ position: "absolute", top: "20%", right: "-10%", width: "600px", height: "600px", borderRadius: "50%", background: "#F9A08E", opacity: 0.07, filter: "blur(120px)" }} />
          <div style={{ position: "absolute", bottom: "-20%", left: "10%", width: "500px", height: "500px", borderRadius: "50%", background: "#D4421A", opacity: 0.05, filter: "blur(100px)" }} />
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-12" style={{ position: "relative", zIndex: 1 }}>
          <AnimatePresence mode="wait">
            {!showResults ? (
              <motion.div
                key="calculator"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
                  {/* ── Left column: hero copy + calculator inputs ── */}
                  <div>
                    <motion.div initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}>
                      {/* Eyebrow */}
                      <motion.p
                        variants={fadeUp}
                        style={{
                          fontFamily: "var(--font-inter)",
                          fontWeight: 600,
                          fontSize: "12px",
                          letterSpacing: "0.14em",
                          textTransform: "uppercase" as const,
                          color: "rgba(255,255,255,0.6)",
                          marginBottom: "24px",
                        }}
                      >
                        Venues &amp; Events ROX Calculator
                      </motion.p>

                      <motion.h2
                        variants={fadeUp}
                        style={{
                          fontFamily: "var(--font-inter)",
                          fontWeight: 500,
                          fontSize: "clamp(28px, 4vw, 42px)",
                          color: "#FFFFFF",
                          lineHeight: 1.15,
                          marginBottom: "24px",
                        }}
                      >
                        You&apos;re investing thousands
                        <br className="hidden sm:block" />
                        {" "}in events, do you know
                        <br className="hidden sm:block" />
                        {" "}what&apos;s working?
                      </motion.h2>
                      <motion.p
                        variants={fadeUp}
                        style={{
                          fontFamily: "var(--font-inter)",
                          fontWeight: 300,
                          fontSize: "clamp(16px, 2vw, 20px)",
                          color: "rgba(255,255,255,0.7)",
                          lineHeight: 1.4,
                          marginBottom: "36px",
                        }}
                      >
                        Prove the value. Justify the investment. Optimize every guest interaction.
                      </motion.p>
                      <motion.p
                        variants={fadeUp}
                        style={{
                          fontFamily: "var(--font-inter)",
                          fontWeight: 300,
                          fontSize: "15px",
                          color: "rgba(255,255,255,0.6)",
                          lineHeight: 1.7,
                          marginBottom: "28px",
                        }}
                      >
                        Use our free Venues &amp; Events ROX Calculator to measure the true return on your event investments. Go beyond ticket sales and score what actually drives results:
                      </motion.p>

                      {/* Bullet points -- 2x2 grid */}
                      <motion.div variants={fadeUp} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "48px" }}>
                        {[
                          { icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75", label: "Attendees captured vs. engaged" },
                          { icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8", label: "Engagement depth by zone" },
                          { icon: "M18 20V10M12 20V4M6 20v-6", label: "Conversion to meetings or renewals" },
                          { icon: "M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83", label: "Time-to-follow-up speed" },
                        ].map((item) => (
                          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div
                              style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "8px",
                                background: "rgba(249,160,142,0.12)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F9A08E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d={item.icon} />
                              </svg>
                            </div>
                            <span
                              style={{
                                fontFamily: "var(--font-inter)",
                                fontWeight: 400,
                                fontSize: "15px",
                                color: "rgba(255,255,255,0.75)",
                              }}
                            >
                              {item.label}
                            </span>
                          </div>
                        ))}
                      </motion.div>
                    </motion.div>

                    {/* Score panel on mobile (before inputs) */}
                    <div className="lg:hidden mb-8">
                      <LiveScorePanel totalScore={totalScore} categoryNames={categoryNames} categoryScores={categoryScores} skippedCount={skippedCount} bonusValue={bonusValue} />
                    </div>

                    {/* Reset button */}
                    <div className="flex justify-end mb-2">
                      <button
                        type="button"
                        onClick={() => {
                          setC1Attendees({ value: "", skipped: false });
                          setC1Captured({ value: "", skipped: false });
                          setC2aAvgTime({ value: "", skipped: false });
                          setC2aTargetTime({ value: "", skipped: false });
                          setC2bMeaningful({ value: "", skipped: false });
                          setC2bTotalCaptured({ value: "", skipped: false });
                          setC3Days({ value: "", skipped: false });
                          setC4Conversions({ value: "", skipped: false });
                          setC4TotalCaptured({ value: "", skipped: false });
                          setBonusQualifiedLeads({ value: "", skipped: false });
                          setBonusValuePerLead({ value: "", skipped: false });
                          setEngagementOptionA(false);
                          lastAutoC2b.current = "";
                          lastAutoC4.current = "";
                        }}
                        className="flex items-center gap-1.5 transition-all duration-200 hover:opacity-80 cursor-pointer"
                        style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "13px", color: "rgba(255,255,255,0.5)", background: "none", border: "none", padding: 0 }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 2v6h6" /><path d="M2.5 8a10 10 0 1 1 2.3 5.5" /></svg>
                        Reset Fields
                      </button>
                    </div>

                    {/* Calculator inputs */}
                    <div className="space-y-6">
                    {/* Category 1 */}
                    <CategoryCard num="01" name="Attendee Capture Rate" weight="Worth 25% of your total score" score={categoryScores[0]}>
                      {renderField("Total Event Attendees", "Estimated total number of people who attended your event. Use registration count or gate scan data if available.", c1_attendees, setC1Attendees, "e.g. 2000")}
                      {renderField("Total Attendees Captured", "Total contacts captured via check-in, engagement touchpoint, or any other method.", c1_captured, setC1Captured, "e.g. 400")}
                      {categoryScores[0] !== null && (
                        <div className="mt-2">
                          <p style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "13px", color: "#061341" }}>
                            Capture Rate: {Math.round(categoryScores[0])}%
                          </p>
                          <p style={{ fontFamily: "var(--font-inter)", fontWeight: 400, fontSize: "11px", color: "rgba(6,19,65,0.35)", marginTop: "2px" }}>
                            Industry average: ~15-25%
                          </p>
                        </div>
                      )}
                    </CategoryCard>

                    {/* Category 2 */}
                    <CategoryCard num="02" name="Engagement Quality" weight="Worth 25% of your total score" score={categoryScores[1]}>
                      {/* Toggle */}
                      <div className="flex items-center gap-1 mb-6" style={{ background: "rgba(212,66,26,0.06)", borderRadius: "24px", padding: "3px", width: "fit-content" }}>
                        <button
                          type="button"
                          onClick={() => setEngagementOptionA(false)}
                          className="cursor-pointer transition-all duration-200"
                          style={{
                            fontFamily: "var(--font-inter)",
                            fontWeight: 500,
                            fontSize: "12px",
                            padding: "6px 14px",
                            borderRadius: "20px",
                            border: "none",
                            background: !engagementOptionA ? "#D4421A" : "transparent",
                            color: !engagementOptionA ? "#FFFFFF" : "rgba(6,19,65,0.45)",
                          }}
                        >
                          I&apos;ll estimate by interactions
                        </button>
                        <button
                          type="button"
                          onClick={() => setEngagementOptionA(true)}
                          className="cursor-pointer transition-all duration-200"
                          style={{
                            fontFamily: "var(--font-inter)",
                            fontWeight: 500,
                            fontSize: "12px",
                            padding: "6px 14px",
                            borderRadius: "20px",
                            border: "none",
                            background: engagementOptionA ? "#D4421A" : "transparent",
                            color: engagementOptionA ? "#FFFFFF" : "rgba(6,19,65,0.45)",
                          }}
                        >
                          I have engagement time data
                        </button>
                      </div>
                      {engagementOptionA ? (
                        <>
                          {renderField("Average Time Engaged (minutes)", "How long did the average guest spend interacting with your content or activations?", c2a_avgTime, setC2aAvgTime, "e.g. 8")}
                          {renderField("Target Engagement Time (minutes)", "What is your ideal engagement duration for a meaningful guest interaction?", c2a_targetTime, setC2aTargetTime, "e.g. 10")}
                        </>
                      ) : (
                        <>
                          {renderField("Guests with a Meaningful Interaction", "How many guests attended a session, visited a sponsor activation, or had a recorded interaction?", c2b_meaningful, setC2bMeaningful, "e.g. 120")}
                          {renderField("Total Attendees Captured", "Same number from Category 1. Auto-populated if already entered above.", c2b_totalCaptured, setC2bTotalCaptured, "e.g. 400")}
                        </>
                      )}
                    </CategoryCard>

                    {/* Category 3 */}
                    <CategoryCard num="03" name="Follow-Up Speed" weight="Worth 25% of your total score" score={categoryScores[2]}>
                      {renderField(
                        "Average Days to First Follow-Up",
                        "How many days on average before your team sent the first follow-up after the event ended?",
                        c3_days,
                        setC3Days,
                        "e.g. 4",
                        undefined,
                        20,
                        "Scores above 20 days are capped at 0 points for this category."
                      )}
                      {categoryScores[2] !== null && (
                        <div className="mt-2">
                          <p style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "13px", color: "#061341" }}>
                            Follow-Up Score: {Math.round(categoryScores[2])}
                          </p>
                          {(() => {
                            const days = parseFloat(c3_days.value);
                            if (isNaN(days)) return null;
                            const ctx = getFollowUpContext(days);
                            return (
                              <p style={{ fontFamily: "var(--font-inter)", fontWeight: 400, fontSize: "12px", color: ctx.color, marginTop: "4px" }}>
                                {ctx.text}
                              </p>
                            );
                          })()}
                        </div>
                      )}
                    </CategoryCard>

                    {/* Category 4 */}
                    <CategoryCard num="04" name="Sponsor Conversion" weight="Worth 25% of your total score" score={categoryScores[3]}>
                      {renderField("Post-Event Conversions", "How many attendees converted to a meeting booked, sponsor follow-up, or renewal after the event?", c4_conversions, setC4Conversions, "e.g. 30")}
                      {renderField("Total Attendees Captured", "Same number from Category 1. Auto-populated if already entered above.", c4_totalCaptured, setC4TotalCaptured, "e.g. 400")}
                      {categoryScores[3] !== null && (
                        <div className="mt-2">
                          <p style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "13px", color: "#061341" }}>
                            Conversion Rate: {Math.round(categoryScores[3])}%
                          </p>
                          <p style={{ fontFamily: "var(--font-inter)", fontWeight: 400, fontSize: "11px", color: "rgba(6,19,65,0.35)", marginTop: "2px" }}>
                            Industry average: ~5-10% post-event conversion
                          </p>
                        </div>
                      )}
                    </CategoryCard>

                    {/* Bonus */}
                    <div
                      style={{
                        background: "rgba(255,255,255,0.9)",
                        border: "1px solid rgba(212,66,26,0.1)",
                        borderLeft: "3px solid #F2B33D",
                        borderRadius: "16px",
                        padding: "32px",
                        boxShadow: "0 1px 3px rgba(212,66,26,0.04)",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          fontFamily: "var(--font-inter)",
                          fontWeight: 700,
                          fontSize: "11px",
                          color: "#F2B33D",
                          background: "rgba(242,179,61,0.12)",
                          borderRadius: "20px",
                          padding: "4px 10px",
                          marginBottom: "8px",
                        }}
                      >
                        BONUS
                      </span>
                      <h3 style={{ fontFamily: "var(--font-inter)", fontWeight: 700, fontSize: "18px", color: "#061341", marginBottom: "4px" }}>
                        Potential Value Generated
                      </h3>
                      <p style={{ fontFamily: "var(--font-inter)", fontWeight: 400, fontSize: "12px", color: "rgba(6,19,65,0.45)", marginBottom: "24px" }}>
                        Optional. Does not affect your ROX score.
                      </p>
                      {renderField("Qualified Leads", "How many of your captured attendees were qualified for follow-up? A qualified lead had a meaningful interaction and fits your target profile.", bonus_qualifiedLeads, setBonusQualifiedLeads, "e.g. 45")}
                      {renderField("Estimated Value Per Qualified Lead", "What is the average deal value, sponsorship renewal, or revenue opportunity associated with a qualified lead from an event? Use your best estimate if exact figures are unavailable.", bonus_valuePerLead, setBonusValuePerLead, "e.g. 5000", "$")}
                      <div style={{ marginTop: "16px" }}>
                        {bonusValue ? (
                          <>
                            <p style={{ fontFamily: "var(--font-inter)", fontWeight: 700, fontSize: "20px", color: "#F2B33D" }}>
                              Potential Value: ${bonusValue.toLocaleString()}
                            </p>
                            <p style={{ fontFamily: "var(--font-inter)", fontWeight: 400, fontSize: "12px", color: "rgba(6,19,65,0.45)", marginTop: "4px" }}>
                              Based on {bonus_qualifiedLeads.value} qualified leads at ${parseFloat(bonus_valuePerLead.value).toLocaleString()} each.
                            </p>
                          </>
                        ) : (
                          <p style={{ fontFamily: "var(--font-inter)", fontWeight: 400, fontSize: "12px", color: "rgba(6,19,65,0.3)" }}>
                            Enter both fields to calculate.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Calculate button */}
                    <div style={{ marginTop: "32px" }}>
                      <button
                        onClick={handleCalculate}
                        disabled={totalScore === null}
                        className="w-full transition-all duration-200 hover:opacity-90 hover:-translate-y-[1px] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{
                          background: "linear-gradient(135deg, #D4421A, #F25E3D)",
                          color: "#FFFFFF",
                          fontFamily: "var(--font-inter)",
                          fontWeight: 700,
                          fontSize: "17px",
                          padding: "18px",
                          borderRadius: "8px",
                          border: "none",
                          width: "100%",
                        }}
                      >
                        Calculate My ROX Score
                      </button>
                      <p style={{ fontFamily: "var(--font-inter)", fontWeight: 400, fontSize: "12px", color: "rgba(255,255,255,0.35)", marginTop: "12px", textAlign: "center" }}>
                        Your data stays in this browser. Nothing is submitted until you request a consultation.
                      </p>
                    </div>
                  </div>
                  </div>

                  {/* ── Right column: sticky score panel (desktop) ── */}
                  <div className="hidden lg:block">
                    <div className="sticky top-[100px]">
                      <LiveScorePanel totalScore={totalScore} categoryNames={categoryNames} categoryScores={categoryScores} skippedCount={skippedCount} bonusValue={bonusValue} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <ResultsScreen />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}
