"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Theme tokens from design-tokens.json ── */

const darkTokens = {
  bg: "#07081F",
  surface: "#0F1035",
  surface2: "#161840",
  border: "rgba(255,255,255,0.08)",
  text: "#E8EAF6",
  textMuted: "rgba(232,234,246,0.5)",
  accent: "#0CF4DF",
  headerBg: "rgba(7,8,31,0.94)",
  placeholder: "#1a1d4a",
  focusRing: "rgba(12,244,223,0.15)",
};

const lightTokens = {
  bg: "#F4F5FA",
  surface: "#FFFFFF",
  surface2: "#ECEEF6",
  border: "rgba(11,11,60,0.1)",
  text: "#0B0B3C",
  textMuted: "rgba(11,11,60,0.5)",
  accent: "#1F3395",
  headerBg: "rgba(244,245,250,0.96)",
  placeholder: "#dde0ef",
  focusRing: "rgba(31,51,149,0.15)",
};

const CRIMSON = "#F25E3D";
const ACTION_GRADIENT = "linear-gradient(135deg, #0CF4DF 0%, #254FE5 100%)";
const FANS = ["Marcus W.", "Jordan K.", "Riley M.", "Devon T.", "Sam L."];
const THANK_YOUS = ["Lookin' good!", "Nice photo!", "Nailed it!", "Great shot!", "Love it!", "You're in!"];

/* ── Animation variants ── */

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const screenVariants = {
  enter: (dir: number) => ({ x: dir * 60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir * -60, opacity: 0 }),
};

/* ── Helper: resize image ── */

function resizeImage(dataUrl: string, maxW = 1200): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxW / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.8));
    };
    img.src = dataUrl;
  });
}

/* ════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════ */

export default function FanGalleryContent() {
  const [screen, setScreen] = useState(0);
  const [direction, setDirection] = useState(1);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [showPreview, setShowPreview] = useState(false);
  const [overlayStyle, setOverlayStyle] = useState<"default" | "none" | "banner" | "minimal" | "corner">("default");
  const [thankYou, setThankYou] = useState(() => THANK_YOUS[Math.floor(Math.random() * THANK_YOUS.length)]);
  const [camMode, setCamMode] = useState<"camera" | "roll">("camera");
  const [emailError, setEmailError] = useState("");
  const [triviaAnswer, setTriviaAnswer] = useState<string | null>(null);
  const [selectedOffers, setSelectedOffers] = useState<Set<string>>(new Set());
  const [showDealForm, setShowDealForm] = useState(false);
  const [fanName, setFanName] = useState("");
  const [fanBirthday, setFanBirthday] = useState("");
  const [fanZip, setFanZip] = useState("");
  const [gamesPerYear, setGamesPerYear] = useState<string | null>(null);
  const [favPlayer, setFavPlayer] = useState<string | null>(null);
  const [triviaWrong, setTriviaWrong] = useState(false);
  const [dealFormSent, setDealFormSent] = useState(false);

  const cameraRef = useRef<HTMLInputElement>(null);
  const rollRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("fan-gallery-theme") as "dark" | "light" | null;
    if (saved) setTheme(saved);
    else if (window.matchMedia("(prefers-color-scheme: light)").matches) setTheme("light");
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("fan-gallery-theme", next);
      return next;
    });
  }, []);

  const t = theme === "dark" ? darkTokens : lightTokens;

  const goTo = useCallback((i: number) => {
    setDirection(i > screen ? 1 : -1);
    setScreen(i);
  }, [screen]);

  const next = useCallback(() => {
    if (screen < 5) { setDirection(1); setScreen((s) => s + 1); }
  }, [screen]);

  const handleFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const resized = await resizeImage(reader.result as string);
      setPhotoDataUrl(resized);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }, []);

  const isValidEmail = useCallback((v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), []);

  const handleSubmit = useCallback(async () => {
    if (!email || !phone || !photoDataUrl) return;
    if (!isValidEmail(email)) { setEmailError("Please enter a valid email address"); return; }
    setEmailError("");
    setSubmitting(true);
    try {
      await fetch("/api/fan-gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone, photoDataUrl }),
      });
    } catch { /* continue to confirmation for demo */ }
    setSubmitting(false);
    setThankYou(THANK_YOUS[Math.floor(Math.random() * THANK_YOUS.length)]);
    setDirection(1);
    setScreen(3);
  }, [email, phone, photoDataUrl, isValidEmail]);

  /* ── Reusable styles ── */

  const btnPrimary: React.CSSProperties = {
    width: "100%", padding: 16, border: "none", borderRadius: 12,
    background: ACTION_GRADIENT, color: "#fff",
    fontFamily: "var(--font-inter)", fontSize: 16, fontWeight: 600,
    cursor: "pointer", display: "flex", alignItems: "center",
    justifyContent: "center", gap: 8, transition: "opacity 0.15s",
  };

  const btnOutline: React.CSSProperties = {
    width: "100%", padding: 14,
    border: `1.5px solid ${t.border}`, borderRadius: 12,
    background: "transparent", color: t.text,
    fontFamily: "var(--font-inter)", fontSize: 14, fontWeight: 500,
    cursor: "pointer", transition: "border-color 0.15s",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "14px 16px",
    border: `1px solid ${t.border}`, borderRadius: 8,
    background: t.surface, color: t.text,
    fontFamily: "var(--font-inter)", fontSize: 15, fontWeight: 400,
    outline: "none", transition: "border-color 0.2s, box-shadow 0.2s",
  };

  const headerBar: React.CSSProperties = {
    background: t.headerBg, backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    borderBottom: `1px solid ${t.border}`,
    padding: "16px 20px", display: "flex", alignItems: "center",
    justifyContent: "space-between", flexShrink: 0,
  };

  const bottomBar: React.CSSProperties = {
    flexShrink: 0, padding: "16px 20px",
    paddingBottom: "calc(16px + env(safe-area-inset-bottom, 16px))",
    borderTop: `1px solid ${t.border}`, background: t.bg,
  };

  const titleCss: React.CSSProperties = {
    fontWeight: 500, fontSize: "clamp(24px, 7vw, 28px)",
    color: t.text, letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: 8,
  };

  const subCss: React.CSSProperties = {
    fontWeight: 300, fontSize: 14, color: t.textMuted, lineHeight: 1.6,
  };

  /* ── Small shared components ── */

  const MIcon = () => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/Momentify-Icon.svg" alt="Momentify" width={28} height={28} style={{ flexShrink: 0, borderRadius: 6 }} />
  );

  const Back = ({ to }: { to: number }) => (
    <button onClick={() => goTo(to)} style={{
      background: "none", border: "none", color: t.textMuted,
      fontFamily: "var(--font-inter)", fontSize: 13, fontWeight: 500,
      cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
    }}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Back
    </button>
  );

  const ThemeBtn = () => (
    <button onClick={toggleTheme} aria-label="Toggle theme" style={{
      background: t.surface, border: `1px solid ${t.border}`, borderRadius: 8,
      width: 36, height: 36, display: "flex", alignItems: "center",
      justifyContent: "center", cursor: "pointer", flexShrink: 0,
    }}>
      {theme === "dark" ? (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="3.5" stroke={t.accent} strokeWidth="1.5" />
          <path d="M9 2v2M9 14v2M2 9h2M14 9h2M4.2 4.2l1.4 1.4M12.4 12.4l1.4 1.4M4.2 13.8l1.4-1.4M12.4 5.6l1.4-1.4" stroke={t.accent} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M15.1 11.3A6.5 6.5 0 016.7 2.9a7 7 0 108.4 8.4z" stroke={t.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );

  const PhotoPH = ({ name }: { name: string }) => (
    <div style={{
      borderRadius: 6, overflow: "hidden", aspectRatio: "1",
      border: `1px solid ${t.border}`, background: t.surface2,
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", gap: 4, position: "relative",
    }}>
      <div style={{ width: 28, height: 28, borderRadius: "50%", background: t.placeholder }} />
      <span style={{ fontSize: 10, fontWeight: 500, color: t.textMuted, background: `${t.surface}cc`, padding: "2px 6px", borderRadius: 3 }}>
        {name}
      </span>
      <PhotoOverlay compact />
    </div>
  );

  const dateStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const PhotoOverlay = ({ compact, style: ovStyle }: { compact?: boolean; style?: typeof overlayStyle }) => {
    const s = ovStyle ?? overlayStyle;
    if (s === "none") return null;

    if (s === "minimal") return (
      <div style={{ position: "absolute", bottom: compact ? 4 : 8, right: compact ? 4 : 8, opacity: 0.7 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/Momentify-Icon.svg" alt="" width={compact ? 16 : 24} height={compact ? 16 : 24} style={{ borderRadius: 4, display: "block" }} />
      </div>
    );

    if (s === "corner") return (
      <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/Momentify-Icon.svg" alt="" width={compact ? 12 : 18} height={compact ? 12 : 18}
          style={{ position: "absolute", top: compact ? 4 : 8, left: compact ? 4 : 8, borderRadius: 3, opacity: 0.8 }} />
        <div style={{
          position: "absolute", bottom: compact ? 4 : 8, right: compact ? 4 : 8,
          textAlign: "right",
        }}>
          <div style={{ fontSize: compact ? 7 : 9, fontWeight: 500, color: "#fff", textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
            Suite 214
          </div>
          <div style={{ fontSize: compact ? 6 : 8, fontWeight: 300, color: "rgba(255,255,255,0.65)", textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
            {dateStr}
          </div>
        </div>
      </>
    );

    if (s === "banner") return (
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        background: "rgba(0,0,0,0.75)",
        padding: compact ? "5px 6px" : "8px 14px",
        display: "flex", alignItems: "center", gap: compact ? 4 : 8,
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/Momentify-Icon.svg" alt="" width={compact ? 12 : 16} height={compact ? 12 : 16} style={{ borderRadius: 3, flexShrink: 0 }} />
        <div style={{ fontSize: compact ? 7 : 9, fontWeight: 500, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          Suite 214 &middot; {dateStr}
        </div>
      </div>
    );

    // default
    return (
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        background: "linear-gradient(transparent, rgba(0,0,0,0.65))",
        padding: compact ? "20px 8px 8px" : "32px 14px 12px",
        display: "flex", alignItems: "center", gap: compact ? 5 : 8,
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/Momentify-Icon.svg" alt="" width={compact ? 14 : 20} height={compact ? 14 : 20} style={{ borderRadius: 4, flexShrink: 0 }} />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: compact ? 8 : 11, fontWeight: 500, color: "#fff", lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            Suite 214 &middot; Champions Club
          </div>
          <div style={{ fontSize: compact ? 7 : 9, fontWeight: 300, color: "rgba(255,255,255,0.55)", lineHeight: 1.4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {dateStr} &middot; Mavs vs. Lakers
          </div>
        </div>
      </div>
    );
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = t.accent;
    e.currentTarget.style.boxShadow = `0 0 0 3px ${t.focusRing}`;
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = t.border;
    e.currentTarget.style.boxShadow = "none";
  };

  /* ═══════════════════════════════════════
     SCREENS
     ═══════════════════════════════════════ */

  const screens = [

    /* ── SCREEN 0: GALLERY ── */
    () => (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", paddingBottom: "calc(16px + env(safe-area-inset-bottom, 16px))" }}>

          {/* Add Photo CTA — full-width banner when no photo yet */}
          {!photoDataUrl && (
            <button onClick={next} style={{
              width: "100%", borderRadius: 10, border: "none", background: ACTION_GRADIENT,
              display: "flex", alignItems: "center", gap: 12,
              padding: "14px 18px", cursor: "pointer", marginBottom: 20,
            }}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ flexShrink: 0 }}>
                <circle cx="14" cy="14" r="10" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                <path d="M14 9.5v9M9.5 14h9" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <div style={{ textAlign: "left" }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#fff", lineHeight: 1.3, display: "block" }}>Add Your Photo</span>
                <span style={{ fontSize: 11, fontWeight: 300, color: "rgba(255,255,255,0.7)", lineHeight: 1.3 }}>Win 2 Club Seats</span>
              </div>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ marginLeft: "auto", flexShrink: 0 }}>
                <path d="M7 4.5l4.5 4.5L7 13.5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}

          {/* My Moments section — shown after first photo */}
          {photoDataUrl && (
            <>
              <div style={{ fontSize: 12, fontWeight: 500, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>My Moments</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                {/* Add another photo CTA as first grid cell */}
                <button onClick={next} style={{
                  borderRadius: 6, overflow: "hidden", aspectRatio: "1",
                  border: `1.5px dashed ${t.accent}`, background: theme === "dark" ? "rgba(12,244,223,0.04)" : "rgba(31,51,149,0.04)",
                  display: "flex", flexDirection: "column", alignItems: "center",
                  justifyContent: "center", gap: 6, cursor: "pointer", padding: 12,
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke={t.accent} strokeWidth="1.2" strokeDasharray="3 2" />
                    <path d="M12 8.5v7M8.5 12h7" stroke={t.accent} strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <span style={{ fontSize: 11, fontWeight: 500, color: t.accent, lineHeight: 1.2 }}>Add Photo</span>
                </button>
                {/* User's existing photo */}
                <div style={{ borderRadius: 6, overflow: "hidden", aspectRatio: "1", border: `1px solid ${t.border}`, background: t.surface2, position: "relative" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photoDataUrl} alt="Your photo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <PhotoOverlay compact />
                </div>
              </div>
            </>
          )}

          {/* Suite Gallery section */}
          <div style={{ fontSize: 12, fontWeight: 500, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Suite 214 Gallery</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {FANS.map((n) => <PhotoPH key={n} name={n} />)}
          </div>
        </div>
      </div>
    ),

    /* ── SCREEN 1: CAMERA ── */
    () => (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <div style={{ flex: 1, overflowY: "auto" }}>
            <motion.div style={{ padding: 20 }} initial="hidden" animate="visible" variants={stagger}>
              <motion.h1 variants={fadeUp} style={{ ...titleCss, fontSize: "clamp(20px, 6vw, 24px)" }}>Capture Your Moment.</motion.h1>
              <motion.p variants={fadeUp} style={{ ...subCss, fontSize: 13 }}>Take a photo or grab one from your camera roll.</motion.p>
            </motion.div>

            {/* Viewfinder */}
            <div style={{ padding: "0 20px", marginBottom: 16 }}>
              <div
                onClick={() => {
                  if (photoDataUrl) return;
                  if (camMode === "camera") cameraRef.current?.click();
                  else rollRef.current?.click();
                }}
                style={{
                  background: photoDataUrl ? "transparent" : t.surface2,
                  border: `1px solid ${t.border}`, borderRadius: 12,
                  aspectRatio: "1/1", display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", gap: 12,
                  position: "relative", overflow: "hidden",
                  cursor: photoDataUrl ? "default" : "pointer",
                }}
              >
                {!photoDataUrl && (
                  <>
                    <div style={{ position: "absolute", top: 14, left: 14, width: 24, height: 24, borderTop: `2px solid ${t.accent}`, borderLeft: `2px solid ${t.accent}`, "--vf-dir": "translate(4px,4px)", animation: "vfPulse 2.5s ease-in-out infinite" } as React.CSSProperties} />
                    <div style={{ position: "absolute", top: 14, right: 14, width: 24, height: 24, borderTop: `2px solid ${t.accent}`, borderRight: `2px solid ${t.accent}`, "--vf-dir": "translate(-4px,4px)", animation: "vfPulse 2.5s ease-in-out infinite" } as React.CSSProperties} />
                    <div style={{ position: "absolute", bottom: 14, left: 14, width: 24, height: 24, borderBottom: `2px solid ${t.accent}`, borderLeft: `2px solid ${t.accent}`, "--vf-dir": "translate(4px,-4px)", animation: "vfPulse 2.5s ease-in-out infinite" } as React.CSSProperties} />
                    <div style={{ position: "absolute", bottom: 14, right: 14, width: 24, height: 24, borderBottom: `2px solid ${t.accent}`, borderRight: `2px solid ${t.accent}`, "--vf-dir": "translate(-4px,-4px)", animation: "vfPulse 2.5s ease-in-out infinite" } as React.CSSProperties} />
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                      <circle cx="24" cy="24" r="10" stroke={t.textMuted} strokeWidth="1.5" />
                      <path d="M24 8v8M24 32v8M8 24h8M32 24h8" stroke={t.textMuted} strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <span style={{ fontSize: 13, fontWeight: 300, color: t.textMuted }}>
                      Tap to {camMode === "camera" ? "take photo" : "choose from roll"}
                    </span>
                  </>
                )}
                {photoDataUrl && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ position: "absolute", inset: 0 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photoDataUrl} alt="Your photo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </motion.div>
                )}
              </div>
            </div>

            {/* Camera / Roll buttons */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: "0 20px", marginBottom: 16 }}>
              <button onClick={() => { setCamMode("camera"); if (!photoDataUrl) cameraRef.current?.click(); }}
                style={{ ...btnOutline, borderColor: camMode === "camera" ? t.accent : t.border, color: camMode === "camera" ? t.text : t.textMuted, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, boxShadow: camMode === "camera" ? `0 0 0 3px ${t.focusRing}` : "none" }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                  <rect x="1.5" y="4" width="13" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                Take photo
              </button>
              <button onClick={() => { setCamMode("roll"); if (!photoDataUrl) rollRef.current?.click(); }}
                style={{ ...btnOutline, borderColor: camMode === "roll" ? t.accent : t.border, color: camMode === "roll" ? t.text : t.textMuted, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, boxShadow: camMode === "roll" ? `0 0 0 3px ${t.focusRing}` : "none" }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="1.5" y="1.5" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M1.5 10.5l3.5-3.5 3 3 3-4 3.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Camera roll
              </button>
            </div>

            <input ref={cameraRef} type="file" accept="image/*" capture="environment" onChange={handleFile} style={{ display: "none" }} />
            <input ref={rollRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
          </div>

          <div style={bottomBar}>
            <button onClick={next} disabled={!photoDataUrl} style={{ ...btnPrimary, opacity: photoDataUrl ? 1 : 0.4, pointerEvents: photoDataUrl ? "auto" : "none" }}>
              Use This Photo
            </button>
            <p style={{ textAlign: "center", fontSize: 11, color: t.textMuted, marginTop: 8 }}>
              {photoDataUrl ? "Looks good? Use it." : "Tap the viewfinder or a button above"}
            </p>
          </div>
        </div>
    ),

    /* ── SCREEN 2: ONE FIELD ── */
    () => (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ flex: 1, overflowY: "auto" }}>
          <motion.div style={{ padding: 20 }} initial="hidden" animate="visible" variants={stagger}>
            <motion.h1 variants={fadeUp} style={{ ...titleCss, fontSize: "clamp(20px, 6vw, 24px)" }}>Almost there.</motion.h1>
            <motion.p variants={fadeUp} style={{ ...subCss, fontSize: 13 }}>Where should we send your gallery link?</motion.p>
          </motion.div>

          {/* Photo preview with overlay picker */}
          <div style={{ padding: "0 20px", marginBottom: 16 }}>
            <div style={{ display: "flex", gap: 10, maxWidth: 340, margin: "0 auto" }}>
              {/* Overlay picker */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
                <span style={{ fontSize: 9, fontWeight: 500, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.06em" }}>Overlay</span>
                {(["default", "banner", "minimal", "corner", "none"] as const).map((s) => (
                  <button key={s} onClick={() => setOverlayStyle(s)} style={{
                    width: 56, height: 56, borderRadius: 6, overflow: "hidden",
                    border: overlayStyle === s ? `2px solid ${t.accent}` : `1px solid ${t.border}`,
                    background: t.surface2, cursor: "pointer", position: "relative",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: overlayStyle === s ? `0 0 0 2px ${t.focusRing}` : "none",
                    padding: 0, flexShrink: 0,
                  }}>
                    {/* Mini preview swatch */}
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #8e44ad, #e74c3c)", opacity: 0.3 }} />
                    {s !== "none" && <PhotoOverlay compact style={s} />}
                    {s === "none" && (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ position: "relative", zIndex: 1 }}>
                        <path d="M3 13L13 3" stroke={t.textMuted} strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>

              {/* Photo */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", border: `2px solid ${t.accent}`, boxShadow: `0 0 0 4px ${t.focusRing}`, background: t.surface2 }}>
                  {photoDataUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photoDataUrl} alt="Your photo" style={{ width: "100%", display: "block" }} />
                  )}
                  <PhotoOverlay />
                  {/* Edit button */}
                  <button onClick={() => { setPhotoDataUrl(null); goTo(1); }} style={{
                    position: "absolute", top: 8, right: 8, width: 28, height: 28,
                    borderRadius: "50%", border: "none",
                    background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
                    display: "flex", alignItems: "center",
                    justifyContent: "center", cursor: "pointer",
                  }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M8.5 2.5l3 3M2.5 8.5l6-6 3 3-6 6H2.5v-3z" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
                {/* Preview button */}
                <button onClick={() => setShowPreview(true)} style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  margin: "10px auto 0", background: "none", border: "none",
                  color: t.accent, fontSize: 12, fontWeight: 500,
                  fontFamily: "var(--font-inter)", cursor: "pointer",
                }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2" />
                    <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                  Preview in gallery
                </button>
              </div>
            </div>
          </div>

          {/* Inputs */}
          <div style={{ padding: "0 20px" }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: t.textMuted, marginBottom: 6 }}>Email <span style={{ color: CRIMSON }}>*</span></label>
            <input type="email" placeholder="you@email.com" value={email} onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(""); }} onFocus={handleFocus} onBlur={(e) => { handleBlur(e); if (email && !isValidEmail(email)) setEmailError("Please enter a valid email address"); }} style={{ ...inputStyle, marginBottom: emailError ? 4 : 16, borderColor: emailError ? CRIMSON : undefined }} />
            {emailError && <p style={{ fontSize: 11, color: CRIMSON, marginBottom: 12 }}>{emailError}</p>}
            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: t.textMuted, marginBottom: 6 }}>Phone <span style={{ color: CRIMSON }}>*</span></label>
            <input type="tel" placeholder="(214) 555-0100" value={phone} onChange={(e) => setPhone(e.target.value)} onFocus={handleFocus} onBlur={handleBlur} style={inputStyle} />
            <p style={{ fontSize: 11, fontWeight: 300, color: t.textMuted, lineHeight: 1.6, marginTop: 16 }}>
              By publishing you agree to the fan gallery terms. We&apos;ll text you when winners are announced and email your gallery link after the game. We never sell your data.
            </p>
          </div>
        </div>

        <div style={bottomBar}>
          <button onClick={handleSubmit} disabled={!email || !phone || submitting} style={{ ...btnPrimary, opacity: email && phone && !submitting ? 1 : 0.4, pointerEvents: email && phone && !submitting ? "auto" : "none" }}>
            {submitting ? "Publishing..." : "Publish My Photo"}
          </button>
          <p style={{ textAlign: "center", fontSize: 11, color: t.textMuted, marginTop: 8 }}>Takes under 10 seconds to review</p>
        </div>
      </div>
    ),

    /* ── SCREEN 3: CONFIRMATION ── */
    () => (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ flex: 1, overflowY: "auto" }}>
          <motion.div style={{ padding: 20 }} initial="hidden" animate="visible" variants={stagger}>
            <motion.h1 variants={fadeUp} style={titleCss}>{thankYou}</motion.h1>
            <motion.p variants={fadeUp} style={subCss}>Your photo is live in under 60 seconds.</motion.p>
          </motion.div>

          {/* Success banner */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{
            margin: "0 20px 16px", background: theme === "dark" ? "rgba(52,199,89,0.06)" : "rgba(52,199,89,0.08)",
            border: `1px solid ${theme === "dark" ? "rgba(52,199,89,0.15)" : "rgba(52,199,89,0.2)"}`,
            borderRadius: 12, padding: "16px 16px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(52,199,89,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 12.5l4 4 8-9" stroke="#34C759" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 500, color: t.text, lineHeight: 1.3 }}>Photo submitted</div>
                <div style={{ fontSize: 12, fontWeight: 300, color: t.textMuted, lineHeight: 1.4 }}>
                  Check your texts for a gallery link now.
                </div>
              </div>
            </div>
          </motion.div>

          {/* Enter to Win */}
          <motion.div onClick={() => goTo(4)} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} style={{
            margin: "0 20px 16px", background: ACTION_GRADIENT,
            borderRadius: 12, padding: "14px 16px",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
            cursor: "pointer",
          }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", lineHeight: 1.3 }}>Enter to Win 2 Club Seats</div>
              <div style={{ fontSize: 11, fontWeight: 300, color: "rgba(255,255,255,0.7)", lineHeight: 1.4, marginTop: 2 }}>Takes 10 seconds. Winners drawn at halftime.</div>
            </div>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
              <path d="M7 4l6 6-6 6" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>

          {/* Gallery with user photo */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: "0 20px", marginBottom: 12 }}>
            <div style={{ borderRadius: 6, overflow: "hidden", aspectRatio: "1", border: `1px solid ${t.border}`, background: t.surface2, position: "relative" }}>
              {photoDataUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoDataUrl} alt="Your photo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              )}
              <div style={{ position: "absolute", top: 8, right: 8, background: `${CRIMSON}1f`, border: `1px solid ${CRIMSON}44`, borderRadius: 9999, padding: "4px 10px", fontSize: 11, fontWeight: 600, color: CRIMSON }}>In Review</div>
              <PhotoOverlay compact />
            </div>
            {FANS.slice(0, 5).map((n) => <PhotoPH key={n} name={n} />)}
          </div>

          <p style={{ textAlign: "center", fontSize: 11, color: t.textMuted, marginBottom: 16, padding: "0 20px" }}>24 photos &middot; 10 fans &middot; Suite 214</p>

          {/* Share / Add another */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: "0 20px", marginBottom: 16 }}>
            <button onClick={() => { if (navigator.share) navigator.share({ title: "Fan Gallery", url: window.location.href }); }}
              style={{ ...btnOutline, display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9.5 4a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM4.5 8.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM9.5 13a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM5.8 7.8l2.9 1.8M8.7 4.5L5.8 6.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              Share
            </button>
            <button onClick={() => { setPhotoDataUrl(null); setEmail(""); setPhone(""); goTo(1); }}
              style={{ ...btnOutline, display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" /><path d="M7 4.5v5M4.5 7h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              Add another
            </button>
          </div>
        </div>

        <div style={bottomBar}>
          <button onClick={() => goTo(0)} style={btnPrimary}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 4L6 8l4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Back to the Game
          </button>
          <p style={{ textAlign: "center", fontSize: 11, fontWeight: 300, color: t.textMuted, marginTop: 8 }}>We&apos;ll email you the full gallery after the final whistle</p>
        </div>
      </div>
    ),

    /* ── SCREEN 4: ENTER TO WIN ── */
    () => (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ flex: 1, overflowY: "auto" }}>
          <motion.div style={{ padding: 20 }} initial="hidden" animate="visible" variants={stagger}>
            <motion.h1 variants={fadeUp} style={{ ...titleCss, fontSize: "clamp(20px, 6vw, 24px)" }}>Win 2 Club Seats.</motion.h1>
            <motion.p variants={fadeUp} style={{ ...subCss, fontSize: 13 }}>Answer one question and you&apos;re entered. Winners drawn at halftime.</motion.p>
          </motion.div>

          {/* Prize card */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} style={{
            margin: "0 20px 20px", background: ACTION_GRADIENT,
            borderRadius: 12, padding: "20px", position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
            <div style={{ position: "absolute", bottom: -10, left: -10, width: 50, height: 50, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 12, position: "relative" }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "#fff", lineHeight: 1.3 }}>2 Club Level Seats</div>
                <div style={{ fontSize: 12, fontWeight: 300, color: "rgba(255,255,255,0.7)", lineHeight: 1.4, marginTop: 2 }}>Next home game, any matchup</div>
              </div>
            </div>
          </motion.div>

          {/* Trivia question */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} style={{ padding: "0 20px" }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 12 }}>Who scored the first basket tonight?</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {["Cooper Flagg", "Kyrie Irving", "Klay Thompson", "PJ Washington"].map((name) => {
                const isSelected = triviaAnswer === name;
                const isWrongSelected = triviaWrong && isSelected && name !== "Cooper Flagg";
                const isCorrectRevealed = triviaWrong && name === "Cooper Flagg";
                const borderClr = isWrongSelected ? CRIMSON : isCorrectRevealed ? "#34C759" : isSelected ? t.accent : t.border;
                const ringClr = isWrongSelected ? `${CRIMSON}22` : isCorrectRevealed ? "rgba(52,199,89,0.15)" : isSelected ? t.focusRing : "none";
                const radioBg = isWrongSelected ? CRIMSON : isCorrectRevealed ? "#34C759" : isSelected ? t.accent : "transparent";
                const radioBorder = isWrongSelected ? CRIMSON : isCorrectRevealed ? "#34C759" : isSelected ? t.accent : t.border;
                return (
                  <button key={name} onClick={() => { if (!triviaWrong) setTriviaAnswer(name); }} style={{
                    ...btnOutline, textAlign: "left" as const,
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "14px 16px",
                    borderColor: borderClr,
                    boxShadow: ringClr !== "none" ? `0 0 0 3px ${ringClr}` : "none",
                    opacity: triviaWrong && !isWrongSelected && !isCorrectRevealed ? 0.4 : 1,
                    pointerEvents: triviaWrong ? "none" as const : "auto" as const,
                  }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: "50%",
                      border: `1.5px solid ${radioBorder}`,
                      background: radioBg,
                      flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {isWrongSelected && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M3 3l4 4M7 3l-4 4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" /></svg>
                      )}
                      {(isSelected && !isWrongSelected || isCorrectRevealed) && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2.5 5.5l2 2 3.5-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      )}
                    </div>
                    <span style={{ flex: 1 }}>{name}</span>
                    {isCorrectRevealed && <span style={{ fontSize: 11, fontWeight: 500, color: "#34C759" }}>Correct answer</span>}
                  </button>
                );
              })}
            </div>
            {triviaWrong && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} style={{
                display: "flex", alignItems: "center", gap: 8, marginTop: 12,
                background: `${CRIMSON}0f`, border: `1px solid ${CRIMSON}22`,
                borderRadius: 8, padding: "10px 14px",
              }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke={CRIMSON} strokeWidth="1.2" /><path d="M8 5v3.5M8 10.5v.5" stroke={CRIMSON} strokeWidth="1.5" strokeLinecap="round" /></svg>
                <span style={{ fontSize: 12, fontWeight: 500, color: CRIMSON }}>Not quite! But you&apos;re still entered to win.</span>
              </motion.div>
            )}
            <p style={{ fontSize: 11, fontWeight: 300, color: t.textMuted, lineHeight: 1.6, marginTop: 16 }}>
              No purchase necessary. Correct answer not required to win. Winners selected at random at halftime. Must be present to claim.
            </p>
          </motion.div>
        </div>

        <div style={bottomBar}>
          {!triviaWrong ? (
            <button onClick={() => {
              if (triviaAnswer === "Cooper Flagg") { goTo(5); }
              else { setTriviaWrong(true); }
            }} disabled={!triviaAnswer} style={{ ...btnPrimary, opacity: triviaAnswer ? 1 : 0.4, pointerEvents: triviaAnswer ? "auto" : "none" }}>
              Submit Entry
            </button>
          ) : (
            <button onClick={() => goTo(5)} style={btnPrimary}>
              Continue
            </button>
          )}
          <button onClick={() => goTo(3)} style={{
            background: "none", border: "none", color: t.textMuted,
            fontFamily: "var(--font-inter)", fontSize: 12, fontWeight: 400,
            cursor: "pointer", width: "100%", textAlign: "center", marginTop: 8,
          }}>
            Skip for now
          </button>
        </div>
      </div>
    ),

    /* ── SCREEN 5: GIVEAWAY RESULTS + SPONSOR OFFERS ── */
    () => {
      const OFFERS = [
        { id: "drink", emoji: "🍺", title: "$5 Draft Beer", desc: "Any draft, any size", from: "Suite Bar" },
        { id: "merch", emoji: "🧢", title: "20% Off Merch", desc: "Team store, tonight only", from: "Team Shop" },
        { id: "food", emoji: "🌮", title: "Free Nachos", desc: "With any entree purchase", from: "Club Grill" },
        { id: "rideshare", emoji: "🚗", title: "$10 Off Ride Home", desc: "Valid within 2 hours", from: "Uber" },
      ];
      const toggleOffer = (id: string) => {
        setSelectedOffers((prev) => {
          const next = new Set(prev);
          if (next.has(id)) next.delete(id); else next.add(id);
          return next;
        });
      };
      return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <div style={{ flex: 1, overflowY: "auto" }}>
            <motion.div style={{ padding: 20 }} initial="hidden" animate="visible" variants={stagger}>
              <motion.h1 variants={fadeUp} style={{ ...titleCss, fontSize: "clamp(20px, 6vw, 24px)" }}>You&apos;re entered!</motion.h1>
              <motion.p variants={fadeUp} style={{ ...subCss, fontSize: 13 }}>Winners announced at halftime. Grab some deals while you wait.</motion.p>
            </motion.div>

            {/* Entry confirmation */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} style={{
              margin: "0 20px 20px", background: theme === "dark" ? "rgba(52,199,89,0.06)" : "rgba(52,199,89,0.08)",
              border: `1px solid ${theme === "dark" ? "rgba(52,199,89,0.15)" : "rgba(52,199,89,0.2)"}`,
              borderRadius: 12, padding: "12px 16px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(52,199,89,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 12.5l4 4 8-9" stroke="#34C759" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>Giveaway entry confirmed</div>
              </div>
            </motion.div>

            {/* Sponsor offers 2x2 grid */}
            <div style={{ padding: "0 20px" }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Tonight&apos;s Deals</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {OFFERS.map((offer) => {
                  const selected = selectedOffers.has(offer.id);
                  return (
                    <motion.button key={offer.id} onClick={() => toggleOffer(offer.id)} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                      style={{
                        background: selected ? (theme === "dark" ? "rgba(12,244,223,0.06)" : "rgba(31,51,149,0.06)") : t.surface,
                        border: `1.5px solid ${selected ? t.accent : t.border}`,
                        borderRadius: 12, padding: "14px 12px", cursor: "pointer",
                        textAlign: "left", position: "relative",
                        boxShadow: selected ? `0 0 0 2px ${t.focusRing}` : "none",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {/* Checkmark */}
                      {selected && (
                        <div style={{
                          position: "absolute", top: 8, right: 8, width: 20, height: 20,
                          borderRadius: "50%", background: t.accent,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2.5 5.5l2 2 3.5-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </div>
                      )}
                      <div style={{ fontSize: 24, marginBottom: 8 }}>{offer.emoji}</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: t.text, lineHeight: 1.3, marginBottom: 2 }}>{offer.title}</div>
                      <div style={{ fontSize: 11, fontWeight: 300, color: t.textMuted, lineHeight: 1.4, marginBottom: 6 }}>{offer.desc}</div>
                      <div style={{ fontSize: 10, fontWeight: 500, color: t.textMuted, opacity: 0.7 }}>{offer.from}</div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          <div style={bottomBar}>
            {selectedOffers.size > 0 ? (
              <button onClick={() => setShowDealForm(true)} style={btnPrimary}>
                Send {selectedOffers.size} {selectedOffers.size === 1 ? "Deal" : "Deals"} to My Phone &rarr;
              </button>
            ) : (
              <button onClick={() => goTo(0)} style={btnPrimary}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 4L6 8l4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Back to the Game
              </button>
            )}
            {selectedOffers.size > 0 && (
              <button onClick={() => goTo(0)} style={{
                background: "none", border: "none", color: t.textMuted,
                fontFamily: "var(--font-inter)", fontSize: 12, fontWeight: 400,
                cursor: "pointer", width: "100%", textAlign: "center", marginTop: 8,
              }}>
                No thanks, back to the game
              </button>
            )}
          </div>
        </div>
      );
    },
  ];

  const renderScreen = screens[screen];

  return (
    <>
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } } @keyframes vfPulse { 0%, 100% { opacity: 0.6; transform: translate(0,0); } 50% { opacity: 1; transform: var(--vf-dir); } }`}</style>
      <div style={{ minHeight: "100vh", background: t.bg, display: "flex", justifyContent: "center", fontFamily: "var(--font-inter)", transition: "background 0.3s ease" }}>
        <div style={{ width: "100%", maxWidth: 430, display: "flex", flexDirection: "column", height: "100dvh" }}>

          {/* Persistent status area */}
          <div style={{
            flexShrink: 0, padding: "16px 20px", borderBottom: `1px solid ${t.border}`,
            background: t.headerBg, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
          }}>
            {/* Row 1: Back (conditional) + Logo + suite info + live + theme */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {screen > 0 && (
                  <button onClick={() => goTo(screen === 3 ? 0 : screen === 4 ? 3 : screen === 5 ? 3 : screen - 1)} style={{
                    background: "none", border: "none", color: t.textMuted,
                    fontFamily: "var(--font-inter)", fontSize: 13, fontWeight: 500,
                    cursor: "pointer", display: "flex", alignItems: "center", gap: 2, padding: 0, marginRight: 4,
                  }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                )}
                <MIcon />
                <div style={{ width: 1, height: 20, background: t.border }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: t.text, lineHeight: 1.2 }}>Suite 214</div>
                  <div style={{ fontSize: 11, fontWeight: 400, color: t.textMuted }}>Champions Club</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: CRIMSON, animation: "pulse 2s infinite" }} />
                  <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.14em", color: CRIMSON, textTransform: "uppercase" }}>Live</span>
                </div>
                <ThemeBtn />
              </div>
            </div>

            {/* Row 2: Event info */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, paddingTop: 2, marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: t.text, lineHeight: 1 }}>Mavs vs. Lakers</span>
              <span style={{ fontSize: 10, color: t.textMuted, lineHeight: 1 }}>&middot;</span>
              <span style={{ fontSize: 11, fontWeight: 300, color: t.textMuted, lineHeight: 1 }}>Mar 9, 2026</span>
            </div>

            {/* Row 3: Stats strip */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><rect x="1" y="3.5" width="12" height="9" rx="2" stroke={t.textMuted} strokeWidth="1.2" /><path d="M4.5 3.5L5.5 1.5h3l1 2" stroke={t.textMuted} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="7" cy="8" r="2" stroke={t.textMuted} strokeWidth="1.2" /></svg>
                <span style={{ fontSize: 12, fontWeight: 500, color: t.text }}>23</span>
                <span style={{ fontSize: 10, color: t.textMuted }}>photos</span>
              </div>
              <div style={{ width: 1, height: 14, background: t.border }} />
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="5" r="2.5" stroke={t.textMuted} strokeWidth="1.2" /><path d="M2.5 12.5c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4" stroke={t.textMuted} strokeWidth="1.2" strokeLinecap="round" /></svg>
                <span style={{ fontSize: 12, fontWeight: 500, color: t.text }}>9</span>
                <span style={{ fontSize: 10, color: t.textMuted }}>fans</span>
              </div>
              <div style={{ width: 1, height: 14, background: t.border }} />
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke={t.textMuted} strokeWidth="1.2" /><path d="M7 4v3.5l2.5 1.5" stroke={t.textMuted} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <span style={{ fontSize: 12, fontWeight: 500, color: t.text }}>Q2</span>
                <span style={{ fontSize: 10, color: t.textMuted }}>live</span>
              </div>
            </div>
          </div>

          {/* Animated screen content */}
          <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div key={screen} custom={direction} variants={screenVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: "easeOut" }} style={{ height: "100%" }}>
                {renderScreen()}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* Preview modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowPreview(false)}
            style={{
              position: "fixed", inset: 0, zIndex: 100,
              background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: 24, cursor: "pointer",
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{ width: "100%", maxWidth: 340, position: "relative", borderRadius: 12, overflow: "hidden", cursor: "default" }}
            >
              {photoDataUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoDataUrl} alt="Preview" style={{ width: "100%", display: "block" }} />
              )}
              <PhotoOverlay />
              <button onClick={() => setShowPreview(false)} style={{
                position: "absolute", top: 10, right: 10, width: 32, height: 32,
                borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.5)",
                color: "#fff", fontSize: 18, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 3l8 8M11 3l-8 8" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
              <div style={{ textAlign: "center", padding: "12px 0 0", color: "rgba(255,255,255,0.5)", fontSize: 11 }}>
                This is how your photo will appear in the gallery
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Deal data capture modal */}
      <AnimatePresence>
        {showDealForm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => { setShowDealForm(false); setDealFormSent(false); }}
            style={{
              position: "fixed", inset: 0, zIndex: 100,
              background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: 20, cursor: "pointer",
            }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%", maxWidth: 340, position: "relative",
                borderRadius: 16, background: t.surface,
                padding: 24, cursor: "default",
                maxHeight: "85dvh", overflowY: "auto",
                boxShadow: "0 24px 48px rgba(0,0,0,0.3)",
              }}
            >
              {dealFormSent ? (
                /* ── Thank you state ── */
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
                  style={{ textAlign: "center", padding: "12px 0" }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: "50%", margin: "0 auto 16px",
                    background: "rgba(52,199,89,0.12)", display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <path d="M6 12.5l4 4 8-9" stroke="#34C759" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 500, color: t.text, marginBottom: 6 }}>You&apos;re all set!</div>
                  <div style={{ fontSize: 13, fontWeight: 300, color: t.textMuted, lineHeight: 1.5, marginBottom: 4 }}>
                    {selectedOffers.size} {selectedOffers.size === 1 ? "deal is" : "deals are"} on the way to your phone.
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 300, color: t.textMuted, lineHeight: 1.4, marginBottom: 24 }}>
                    Thanks for sharing. Enjoy the game!
                  </div>
                  <button onClick={() => { setShowDealForm(false); setDealFormSent(false); goTo(0); }} style={{ ...btnPrimary, padding: 14, fontSize: 15 }}>
                    Back to the Game
                  </button>
                </motion.div>
              ) : (
                /* ── Form state ── */
                <>
                  {/* Close button */}
                  <button onClick={() => setShowDealForm(false)} style={{
                    position: "absolute", top: 12, right: 12, width: 28, height: 28,
                    borderRadius: "50%", border: `1px solid ${t.border}`,
                    background: t.surface2, color: t.textMuted, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                      <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </button>

                  {/* Header */}
                  <div style={{ marginBottom: 20, paddingRight: 28 }}>
                    <div style={{ fontSize: 18, fontWeight: 500, color: t.text, lineHeight: 1.3 }}>One more thing...</div>
                    <div style={{ fontSize: 12, fontWeight: 300, color: t.textMuted, marginTop: 4, lineHeight: 1.4 }}>Help us personalize your experience</div>
                  </div>

                  {/* Name */}
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: t.textMuted, marginBottom: 5, letterSpacing: "0.02em" }}>Name</label>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={fanName}
                      onChange={(e) => setFanName(e.target.value)}
                      style={{ ...inputStyle, padding: "11px 14px", fontSize: 14 }}
                    />
                  </div>

                  {/* Birthday + Zip row */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: t.textMuted, marginBottom: 5, letterSpacing: "0.02em" }}>Birthday</label>
                      <input
                        type="text"
                        placeholder="MM/DD"
                        inputMode="numeric"
                        value={fanBirthday}
                        onChange={(e) => {
                          let v = e.target.value.replace(/[^\d/]/g, "");
                          if (v.length === 2 && !v.includes("/") && fanBirthday.length < v.length) v += "/";
                          if (v.length > 5) v = v.slice(0, 5);
                          setFanBirthday(v);
                        }}
                        style={{ ...inputStyle, padding: "11px 14px", fontSize: 14 }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: t.textMuted, marginBottom: 5, letterSpacing: "0.02em" }}>Zip code</label>
                      <input
                        type="text"
                        placeholder="75001"
                        inputMode="numeric"
                        maxLength={5}
                        value={fanZip}
                        onChange={(e) => setFanZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
                        style={{ ...inputStyle, padding: "11px 14px", fontSize: 14 }}
                      />
                    </div>
                  </div>

                  {/* Games per season */}
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: t.textMuted, marginBottom: 8, letterSpacing: "0.02em" }}>Games per season</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {["First game", "A few", "5-10", "Season tix"].map((opt) => {
                        const sel = gamesPerYear === opt;
                        return (
                          <button key={opt} onClick={() => setGamesPerYear(sel ? null : opt)} style={{
                            padding: "7px 14px", fontSize: 12, fontWeight: 500,
                            borderRadius: 9999, cursor: "pointer", transition: "all 0.15s ease",
                            border: `1.5px solid ${sel ? t.accent : t.border}`,
                            background: sel ? (theme === "dark" ? "rgba(12,244,223,0.1)" : "rgba(31,51,149,0.08)") : "transparent",
                            color: sel ? t.accent : t.textMuted,
                            fontFamily: "var(--font-inter)",
                          }}>
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Favorite player */}
                  <div style={{ marginBottom: 22 }}>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: t.textMuted, marginBottom: 8, letterSpacing: "0.02em" }}>Favorite player</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {["Cooper Flagg", "Kyrie Irving", "Klay Thompson", "PJ Washington"].map((name) => {
                        const sel = favPlayer === name;
                        return (
                          <button key={name} onClick={() => setFavPlayer(sel ? null : name)} style={{
                            padding: "7px 14px", fontSize: 12, fontWeight: 500,
                            borderRadius: 9999, cursor: "pointer", transition: "all 0.15s ease",
                            border: `1.5px solid ${sel ? t.accent : t.border}`,
                            background: sel ? (theme === "dark" ? "rgba(12,244,223,0.1)" : "rgba(31,51,149,0.08)") : "transparent",
                            color: sel ? t.accent : t.textMuted,
                            fontFamily: "var(--font-inter)",
                          }}>
                            {name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Submit */}
                  <button onClick={() => setDealFormSent(true)} style={{ ...btnPrimary, padding: 14, fontSize: 15 }}>
                    Send My Deals &rarr;
                  </button>
                  <button onClick={() => { setShowDealForm(false); goTo(0); }} style={{
                    background: "none", border: "none", color: t.textMuted,
                    fontFamily: "var(--font-inter)", fontSize: 12, fontWeight: 400,
                    cursor: "pointer", width: "100%", textAlign: "center", marginTop: 10,
                  }}>
                    Skip, just send the deals
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
