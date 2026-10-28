"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TeamConfig } from "@/lib/fan-gallery/types";
import { DEFAULT_CONFIG } from "@/lib/fan-gallery/defaults";

/* ── Semantic colors ── */
const ERROR = "#E5484D";

/** Convert a hex color to an r,g,b string for use in rgba() */
function hexRgb(hex: string): string {
  const h = hex.replace("#", "");
  return `${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)}`;
}

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
   MAIN COMPONENT — 4 screens
   0: Gallery + CTA
   1: Capture
   2: Contact + Submit
   3: Confirmation (with inline giveaway)
   ════════════════════════════════════════════════════ */

/** Relative luminance (0-1) of a hex color — used for contrast checks */
function luminance(hex: string): number {
  const h = hex.replace("#", "");
  const srgb = [h.slice(0, 2), h.slice(2, 4), h.slice(4, 6)].map((c) => {
    const v = parseInt(c, 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

/** Lighten a hex color by a percentage (0-100) */
function lightenHex(hex: string, pct: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const amt = Math.round(255 * (pct / 100));
  const nr = Math.min(255, r + amt);
  const ng = Math.min(255, g + amt);
  const nb = Math.min(255, b + amt);
  return `#${nr.toString(16).padStart(2, "0")}${ng.toString(16).padStart(2, "0")}${nb.toString(16).padStart(2, "0")}`.toUpperCase();
}

export default function FanGalleryContent({ config = DEFAULT_CONFIG }: { config?: TeamConfig }) {
  const ACCENT = config.accentColor;
  const ACCENT_RGB = hexRgb(ACCENT);
  const CTA_GRADIENT = config.ctaGradient;
  // Ensure accent is visible on dark surfaces (lum < 0.15 → lighten it)
  const ACCENT_ON_DARK = luminance(ACCENT) < 0.15 ? lightenHex(ACCENT, 25) : ACCENT;
  // Ensure accent is visible on light surfaces (lum > 0.4 → use the raw color, which is darker)
  const ACCENT_ON_LIGHT = luminance(ACCENT) > 0.4 ? ACCENT : ACCENT;
  const FANS = config.fans.map(f => f.name);
  const FAN_CAPTIONS: Record<string, string> = Object.fromEntries(config.fans.map(f => [f.name, f.caption]));
  const HASHTAGS = config.hashtags;
  const THANK_YOUS = config.thankYouMessages;

  const [screen, setScreen] = useState(0);
  const [direction, setDirection] = useState(1);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedPhotoUrl, setSubmittedPhotoUrl] = useState<string | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [thankYou, setThankYou] = useState(() => THANK_YOUS[Math.floor(Math.random() * THANK_YOUS.length)]);
  const [emailError, setEmailError] = useState("");
  const [triviaAnswer, setTriviaAnswer] = useState<string | null>(null);
  const [triviaOpen, setTriviaOpen] = useState(false);
  const [triviaWrong, setTriviaWrong] = useState(false);
  const [surveyOpen, setSurveyOpen] = useState(false);
  const [surveyAnswers, setSurveyAnswers] = useState<Record<string, string>>({});
  const [surveySubmitted, setSurveySubmitted] = useState(false);

  // disclaimerOpen removed — consent is now inline on screen 2
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [promoOpen, setPromoOpen] = useState(false);
  const [promoOptIn, setPromoOptIn] = useState(true);
  const [promoAnswer, setPromoAnswer] = useState<string | null>(config.promo.options[0]);

  const [caption, setCaption] = useState("");
  const [viewerPhoto, setViewerPhoto] = useState<{ name: string; caption: string; dataUrl?: string; frameStyle?: string } | null>(null);
  const [myMoments, setMyMoments] = useState<Array<{ dataUrl: string; caption: string; frameStyle: "default" | "none" | "banner" | "minimal" }>>([]);
  const [editingMomentIndex, setEditingMomentIndex] = useState<number | null>(null);
  const [momentSwipeIndex, setMomentSwipeIndex] = useState(0);
  const swipeRef = useRef<HTMLDivElement>(null);

  /* Photo editor state */
  const [frameStyle, setFrameStyle] = useState<"default" | "none" | "banner" | "minimal">("default");
  const [activeTool, setActiveTool] = useState<"frame" | "crop" | null>(null);
  const [cropScale, setCropScale] = useState(1);
  const [cropOffset, setCropOffset] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [dragStart, setDragStart] = useState<{ x: number; y: number; ox: number; oy: number } | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerW, setContainerW] = useState(375);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setContainerW(entry.contentRect.width));
    ro.observe(el);
    setContainerW(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  /** Layout breakpoint: "mobile" | "tablet" | "desktop" */
  const layout = containerW >= 1024 ? "desktop" : containerW >= 600 ? "tablet" : "mobile";
  const isWide = layout !== "mobile";

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

  const t = theme === "dark" ? config.darkTokens : config.lightTokens;

  const goTo = useCallback((i: number) => {
    setDirection(i > screen ? 1 : -1);
    setScreen(i);
  }, [screen]);

  const resetEditorState = useCallback(() => {
    setFrameStyle("default");
    setActiveTool(null);
    setCropScale(1);
    setCropOffset({ x: 0, y: 0 });
    setRotation(0);
    setCaption("");
  }, []);

  const handleFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const resized = await resizeImage(reader.result as string);
      setPhotoDataUrl(resized);
      resetEditorState();
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }, [resetEditorState]);

  const isValidEmail = useCallback((v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), []);

  /* Bake crop/rotate/zoom transforms into the actual image data */
  const bakeTransforms = useCallback((dataUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => {
        const isRotated = rotation % 180 !== 0;
        const w = isRotated ? img.height : img.width;
        const h = isRotated ? img.width : img.height;
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d")!;
        ctx.translate(w / 2, h / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(cropScale, cropScale);
        ctx.translate(cropOffset.x / cropScale, cropOffset.y / cropScale);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = dataUrl;
    });
  }, [rotation, cropScale, cropOffset]);

  const handleSubmit = useCallback(async () => {
    if (!email || !phone || !photoDataUrl) return;
    if (!isValidEmail(email)) { setEmailError("Please enter a valid email address"); return; }
    setEmailError("");
    setSubmitting(true);
    const finalPhoto = await bakeTransforms(photoDataUrl);
    try {
      await fetch("/api/fan-gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone, photoDataUrl: finalPhoto }),
      });
    } catch { /* continue to confirmation for demo */ }
    /* Save to My Moments */
    if (editingMomentIndex !== null) {
      setMyMoments((prev) => prev.map((m, i) => i === editingMomentIndex ? { dataUrl: finalPhoto, caption, frameStyle } : m));
    } else {
      setMyMoments((prev) => [...prev, { dataUrl: finalPhoto, caption, frameStyle }]);
    }
    setEditingMomentIndex(null);
    setSubmittedPhotoUrl(finalPhoto);
    setPhotoDataUrl(null);
    resetEditorState();
    setSubmitting(false);
    setThankYou(THANK_YOUS[Math.floor(Math.random() * THANK_YOUS.length)]);
    setDirection(1);
    setScreen(3);
  }, [email, phone, photoDataUrl, isValidEmail, bakeTransforms, caption, frameStyle, editingMomentIndex, resetEditorState]);

  /* ── Reusable styles ── */

  const btnPrimary: React.CSSProperties = {
    width: "100%", padding: "16px 28px", border: "none", borderRadius: 12,
    background: CTA_GRADIENT, color: "#fff",
    fontFamily: "var(--font-inter)", fontSize: 16, fontWeight: 600,
    cursor: "pointer", display: "flex", alignItems: "center",
    justifyContent: "center", gap: 10, transition: "opacity 150ms, transform 150ms",
    minHeight: 52,
  };

  const btnOutline: React.CSSProperties = {
    width: "100%", padding: "14px 24px",
    border: `1.5px solid ${t.outlineBorder}`, borderRadius: 12,
    background: "transparent", color: t.text,
    fontFamily: "var(--font-inter)", fontSize: 15, fontWeight: 500,
    cursor: "pointer", transition: "border-color 150ms, box-shadow 150ms",
    minHeight: 48,
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "14px 16px", boxSizing: "border-box",
    border: `1.5px solid ${t.outlineBorder}`, borderRadius: 12,
    background: t.surface, color: t.text,
    fontFamily: "var(--font-inter)", fontSize: 16, fontWeight: 400,
    outline: "none", transition: "border-color 220ms, box-shadow 220ms",
    minHeight: 48,
  };

  const bottomBar: React.CSSProperties = {
    flexShrink: 0, padding: "20px 24px",
    paddingBottom: "calc(20px + env(safe-area-inset-bottom, 16px))",
    borderTop: `1px solid ${t.border}`, background: t.bg,
  };

  const titleCss: React.CSSProperties = {
    fontWeight: 500, fontSize: 26,
    color: t.text, letterSpacing: "-0.015em", lineHeight: 1.25, marginBottom: 8,
  };

  const subCss: React.CSSProperties = {
    fontWeight: 300, fontSize: 15, color: t.textMuted, lineHeight: 1.6,
  };

  /* ── Small shared components ── */

  const MIcon = () => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={config.iconPath} alt="Momentify" width={28} height={28} style={{ flexShrink: 0, borderRadius: 6 }} />
  );

  const Back = ({ to }: { to: number }) => (
    <button onClick={() => goTo(to)} style={{
      background: "none", border: "none", color: t.textMuted,
      fontFamily: "var(--font-inter)", fontSize: 14, fontWeight: 500,
      cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
      padding: 0, minHeight: 44,
    }}>
      <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
        <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Back
    </button>
  );

  const ThemeBtn = () => {
    const iconColor = theme === "dark" ? ACCENT_ON_DARK : t.accent;
    return (
      <button onClick={toggleTheme} aria-label="Toggle theme" style={{
        background: theme === "dark" ? `rgba(255,255,255,0.08)` : t.surface,
        border: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.15)" : t.border}`,
        borderRadius: 8,
        width: 36, height: 36, display: "flex", alignItems: "center",
        justifyContent: "center", cursor: "pointer", flexShrink: 0,
      }}>
        {theme === "dark" ? (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="3.5" stroke={iconColor} strokeWidth="1.5" />
            <path d="M9 2v2M9 14v2M2 9h2M14 9h2M4.2 4.2l1.4 1.4M12.4 12.4l1.4 1.4M4.2 13.8l1.4-1.4M12.4 5.6l1.4-1.4" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M15.1 11.3A6.5 6.5 0 016.7 2.9a7 7 0 108.4 8.4z" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
    );
  };

  const dateStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  /* Photo overlay with frame variants */
  const PhotoOverlay = ({ compact, variant }: { compact?: boolean; variant?: "default" | "none" | "banner" | "minimal" }) => {
    const v = variant ?? frameStyle;
    if (v === "none") return null;

    if (v === "minimal") return (
      <div style={{ position: "absolute", bottom: compact ? 4 : 10, right: compact ? 4 : 10, opacity: 0.8 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={config.iconPath} alt="" width={compact ? 14 : 22} height={compact ? 14 : 22} style={{ borderRadius: 4, display: "block" }} />
      </div>
    );

    if (v === "banner") return (
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        background: "rgba(0,0,0,0.75)",
        padding: compact ? "5px 6px" : "8px 14px",
        display: "flex", alignItems: "center", gap: compact ? 4 : 8,
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={config.iconPath} alt="" width={compact ? 12 : 16} height={compact ? 12 : 16} style={{ borderRadius: 3, flexShrink: 0 }} />
        <div style={{ fontSize: compact ? 7 : 10, fontWeight: 500, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {config.locationLabel} &middot; {dateStr}
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
        <img src={config.iconPath} alt="" width={compact ? 14 : 20} height={compact ? 14 : 20} style={{ borderRadius: 4, flexShrink: 0 }} />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: compact ? 8 : 11, fontWeight: 500, color: "#fff", lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {config.locationLabel}
          </div>
          <div style={{ fontSize: compact ? 7 : 9, fontWeight: 300, color: "rgba(255,255,255,0.55)", lineHeight: 1.4 }}>
            {dateStr}
          </div>
        </div>
      </div>
    );
  };

  const PhotoPH = ({ name, photoUrl }: { name: string; photoUrl?: string }) => (
    <div
      onClick={() => setViewerPhoto({ name, caption: FAN_CAPTIONS[name] || "", dataUrl: photoUrl })}
      style={{
        borderRadius: 12, overflow: "hidden", aspectRatio: "3/4",
        border: `1px solid ${t.border}`, background: t.surface2,
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", gap: 4, position: "relative",
        boxShadow: "0 4px 12px rgba(0,0,0,0.06)", cursor: "pointer",
      }}
    >
      {photoUrl ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photoUrl} alt={name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          <PhotoOverlay />
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            background: "linear-gradient(transparent, rgba(0,0,0,0.5))",
            padding: "16px 8px 8px", zIndex: 1,
          }}>
            <span style={{ fontSize: 11, fontWeight: 500, color: "#fff" }}>{name}</span>
          </div>
        </>
      ) : (
        <>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: t.placeholder }} />
          <span style={{ fontSize: 11, fontWeight: 500, color: t.textMuted, background: `${t.surface}cc`, padding: "2px 8px", borderRadius: 4 }}>
            {name}
          </span>
        </>
      )}
    </div>
  );

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = t.focusBorder;
    e.currentTarget.style.boxShadow = t.focusRing;
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = t.outlineBorder;
    e.currentTarget.style.boxShadow = "none";
  };

  /* Hidden file input */
  const fileInput = (
    <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
  );

  /* ═══════════════════════════════════════
     SCREENS
     ═══════════════════════════════════════ */

  const screens = [

    /* ── SCREEN 0: GALLERY + CTA ── */
    () => (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ flex: 1, overflowY: "auto", padding: isWide ? "28px 40px" : "20px 24px", paddingBottom: "calc(20px + env(safe-area-inset-bottom, 16px))" }}>

          <div style={{
            display: isWide ? "flex" : "block",
            gap: isWide ? 40 : 0,
            alignItems: "flex-start",
          }}>
            {/* Left column on wide: Hero CTA + My Moments */}
            <div style={{
              ...(isWide ? { width: 280, flexShrink: 0, position: "sticky" as const, top: 0 } : {}),
            }}>
              {/* Hero CTA */}
              <motion.div initial="hidden" animate="visible" variants={stagger}>
                <motion.div variants={fadeUp} style={{ marginBottom: 28 }}>
                  <h1 style={{ ...titleCss, fontSize: isWide ? 24 : 28, marginBottom: 6 }}>{config.galleryTitle}</h1>
                  <p style={{ ...subCss, marginBottom: 20 }}>{config.gallerySubtitle}</p>
                  <button onClick={() => { setPhotoDataUrl(null); resetEditorState(); setEditingMomentIndex(null); goTo(1); }} style={{
                    ...btnPrimary,
                    fontSize: isWide ? 15 : 17, padding: isWide ? "14px 24px" : "18px 28px", minHeight: isWide ? 48 : 56,
                  }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                      <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
                      <path d="M12 8v8M8 12h8" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Add Your Photo
                  </button>
                </motion.div>
              </motion.div>

              {/* My Moments — swipeable carousel */}
              {myMoments.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: t.accent, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 12 }}>
                    My Moments{myMoments.length > 1 && ` (${myMoments.length})`}
                  </div>
                  <div
                    ref={swipeRef}
                    onScroll={() => {
                      if (!swipeRef.current) return;
                      const idx = Math.round(swipeRef.current.scrollLeft / swipeRef.current.clientWidth);
                      setMomentSwipeIndex(idx);
                    }}
                    style={{
                      display: "flex", gap: 12, overflowX: "auto",
                      scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch",
                      scrollbarWidth: "none", msOverflowStyle: "none",
                      borderRadius: 12,
                    }}
                  >
                    {myMoments.map((moment, idx) => (
                      <div
                        key={idx}
                        onClick={() => setViewerPhoto({ name: "You", caption: moment.caption, dataUrl: moment.dataUrl, frameStyle: moment.frameStyle })}
                        style={{
                          scrollSnapAlign: "start", flexShrink: 0,
                          width: "100%", borderRadius: 12, overflow: "hidden",
                          aspectRatio: "3/4", border: `1px solid ${t.border}`,
                          position: "relative", boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                          cursor: "pointer",
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={moment.dataUrl} alt={`Moment ${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <PhotoOverlay variant={moment.frameStyle} />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingMomentIndex(idx);
                            setPhotoDataUrl(moment.dataUrl);
                            setCaption(moment.caption);
                            setFrameStyle(moment.frameStyle);
                            goTo(1);
                          }}
                          style={{
                            position: "absolute", top: 10, right: 10,
                            background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)",
                            border: "none", borderRadius: 8,
                            padding: "6px 12px", cursor: "pointer",
                            display: "flex", alignItems: "center", gap: 6,
                            color: "#fff", fontFamily: "var(--font-inter)",
                            fontSize: 12, fontWeight: 500,
                          }}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                          Edit
                        </button>
                        {moment.caption && (
                          <div style={{
                            position: "absolute", bottom: 0, left: 0, right: 0,
                            background: "linear-gradient(transparent, rgba(0,0,0,0.6))",
                            padding: "24px 12px 10px",
                          }}>
                            <p style={{ fontSize: 11, fontWeight: 400, color: "rgba(255,255,255,0.85)", margin: 0, lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {moment.caption}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {/* Dot indicators */}
                  {myMoments.length > 1 && (
                    <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 10 }}>
                      {myMoments.map((_, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            swipeRef.current?.scrollTo({ left: idx * (swipeRef.current?.clientWidth || 0), behavior: "smooth" });
                          }}
                          style={{
                            width: momentSwipeIndex === idx ? 20 : 6, height: 6,
                            borderRadius: 3, cursor: "pointer",
                            background: momentSwipeIndex === idx ? ACCENT : t.border,
                            transition: "all 200ms ease",
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right column on wide: Gallery grid */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: t.accent, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 12 }}>Gallery</div>
              <div style={{ display: "grid", gridTemplateColumns: layout === "desktop" ? "1fr 1fr 1fr 1fr" : isWide ? "1fr 1fr 1fr" : "1fr 1fr", gap: 14, paddingBottom: 16 }}>
                {config.fans.map((f) => <PhotoPH key={f.name} name={f.name} photoUrl={f.photoUrl} />)}
              </div>
            </div>
          </div>
        </div>

        {/* Anchored banner ad */}
        <div style={{
          flexShrink: 0,
          borderTop: `1px solid ${t.border}`,
          background: t.surface,
          padding: "10px 16px",
          paddingBottom: "calc(10px + env(safe-area-inset-bottom, 0px))",
        }}>
          <div style={{
            background: CTA_GRADIENT,
            borderRadius: 10,
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            cursor: "pointer",
          }}>
            <img src={config.iconPath} alt="Momentify" style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#fff", lineHeight: 1.3 }}>{config.bannerText}</div>
              <div style={{ fontSize: 11, fontWeight: 300, color: "rgba(255,255,255,0.7)", lineHeight: 1.4 }}>{config.bannerSubtext}</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        </div>

      </div>
    ),

    /* ── SCREEN 1: CAPTURE + EDIT ── */
    () => {
      const toolBtn = (icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void) => (
        <button onClick={onClick} style={{
          background: "none", border: "none", cursor: "pointer",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
          padding: "6px 4px", minWidth: 52, minHeight: 44,
          color: isActive ? t.accent : t.textMuted,
          fontFamily: "var(--font-inter)", transition: "color 150ms",
        }}>
          {icon}
          <span style={{ fontSize: 10, fontWeight: 500 }}>{label}</span>
        </button>
      );

      const imgTransform = `scale(${cropScale}) translate(${cropOffset.x}px, ${cropOffset.y}px) rotate(${rotation}deg)`;

      const handlePointerDown = (e: React.PointerEvent) => {
        if (activeTool !== "crop") return;
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        setDragStart({ x: e.clientX, y: e.clientY, ox: cropOffset.x, oy: cropOffset.y });
      };
      const handlePointerMove = (e: React.PointerEvent) => {
        if (!dragStart || activeTool !== "crop") return;
        const dx = (e.clientX - dragStart.x) / cropScale;
        const dy = (e.clientY - dragStart.y) / cropScale;
        setCropOffset({ x: dragStart.ox + dx, y: dragStart.oy + dy });
      };
      const handlePointerUp = () => setDragStart(null);

      return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <div style={{ flex: 1, overflowY: "auto" }}>
            <motion.div style={{ padding: isWide ? "20px 40px 8px" : "16px 24px 8px" }} initial="hidden" animate="visible" variants={stagger}>
              <motion.h1 variants={fadeUp} style={{ ...titleCss, fontSize: 22 }}>
                {photoDataUrl ? "Edit Your Moment" : "Capture Your Moment"}
              </motion.h1>
              {!photoDataUrl && (
                <motion.p variants={fadeUp} style={{ ...subCss, fontSize: 14 }}>Tap below to take a photo or pick from your camera roll.</motion.p>
              )}
            </motion.div>

            {/* Wide: side-by-side viewfinder + controls */}
            <div style={{
              display: isWide ? "flex" : "block",
              gap: isWide ? 32 : 0,
              padding: isWide ? "0 40px" : "0",
              alignItems: "flex-start",
            }}>

            {/* Viewfinder / Photo preview */}
            <div style={{ padding: isWide ? "0" : "0 24px", marginBottom: 12, ...(isWide ? { width: "45%", flexShrink: 0 } : {}) }}>
              <div
                onClick={() => { if (!photoDataUrl) fileRef.current?.click(); }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                style={{
                  background: photoDataUrl ? "#000" : t.surface2,
                  border: `1.5px solid ${photoDataUrl ? t.border : t.accent}`,
                  borderRadius: 16, aspectRatio: "3/4",
                  ...(isWide ? { maxHeight: "55vh" } : {}),
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", gap: 16,
                  position: "relative", overflow: "hidden",
                  cursor: !photoDataUrl ? "pointer" : activeTool === "crop" ? "grab" : "default",
                  touchAction: activeTool === "crop" ? "none" : "auto",
                }}
              >
                {!photoDataUrl && (
                  <>
                    <img src={config.iconPath} alt="Momentify" style={{ width: 72, height: 72, borderRadius: 16, opacity: 0.35 }} />
                    <span style={{ fontSize: 16, fontWeight: 300, color: t.textMuted }}>
                      Tap to add photo
                    </span>
                  </>
                )}
                {photoDataUrl && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ position: "absolute", inset: 0 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photoDataUrl} alt="Your photo"
                      draggable={false}
                      style={{
                        width: "100%", height: "100%", objectFit: "cover",
                        transform: imgTransform, transformOrigin: "center center",
                        transition: dragStart ? "none" : "transform 200ms ease",
                        pointerEvents: "none",
                      }}
                    />
                    {/* Frame overlay on photo */}
                    <PhotoOverlay />
                    {/* Crop grid overlay */}
                    {activeTool === "crop" && (
                      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                        <div style={{ position: "absolute", top: "33.33%", left: 0, right: 0, height: 1, background: "rgba(255,255,255,0.3)" }} />
                        <div style={{ position: "absolute", top: "66.66%", left: 0, right: 0, height: 1, background: "rgba(255,255,255,0.3)" }} />
                        <div style={{ position: "absolute", left: "33.33%", top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.3)" }} />
                        <div style={{ position: "absolute", left: "66.66%", top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.3)" }} />
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Right column on wide: editor tools */}
            <div style={{ flex: 1, minWidth: 0 }}>
            {/* Editor tools + inline caption */}
            {photoDataUrl && !activeTool && (
              <>
                <div style={{
                  display: "flex", justifyContent: "center", gap: 8,
                  padding: isWide ? "0" : "0 24px", marginBottom: 12,
                }}>
                  {toolBtn(
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="2" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" /><rect x="4.5" y="4.5" width="11" height="11" rx="1" stroke="currentColor" strokeWidth="1" strokeDasharray="2 1.5" /></svg>,
                    "Frame", false, () => setActiveTool("frame")
                  )}
                  {toolBtn(
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 2v4H2M14 2v4h4M6 18v-4H2M14 18v-4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>,
                    "Crop", false, () => setActiveTool("crop")
                  )}
                  {toolBtn(
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M2 10a8 8 0 0114-5.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M16 2v3h-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M18 10a8 8 0 01-14 5.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M4 18v-3h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>,
                    "Rotate", false, () => setRotation((r) => (r + 90) % 360)
                  )}
                  {toolBtn(
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="5" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" /><circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" /></svg>,
                    "Retake", false, () => { setPhotoDataUrl(null); resetEditorState(); fileRef.current?.click(); }
                  )}
                  {toolBtn(
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 6h10l-1 11H6L5 6zM3.5 6h13M8 6V4.5a1.5 1.5 0 013 0V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>,
                    "Delete", false, () => {
                      if (editingMomentIndex !== null) {
                        setMyMoments((prev) => prev.filter((_, i) => i !== editingMomentIndex));
                        setMomentSwipeIndex((idx) => Math.max(0, idx - 1));
                        setEditingMomentIndex(null);
                      }
                      setPhotoDataUrl(null);
                      resetEditorState();
                      goTo(0);
                    }
                  )}
                </div>

                {/* Caption + hashtags inline */}
                <div style={{ padding: isWide ? "0" : "0 24px", marginBottom: 8 }}>
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Write a caption..."
                    maxLength={200}
                    style={{
                      width: "100%", padding: "12px 14px",
                      border: `1.5px solid ${t.outlineBorder}`, borderRadius: 12,
                      background: t.surface, color: t.text,
                      fontFamily: "var(--font-inter)", fontSize: 14, fontWeight: 400,
                      outline: "none", resize: "none", minHeight: 60,
                      lineHeight: 1.5,
                      transition: "border-color 220ms, box-shadow 220ms",
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = t.focusBorder; e.currentTarget.style.boxShadow = t.focusRing; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = t.outlineBorder; e.currentTarget.style.boxShadow = "none"; }}
                  />
                  <div style={{ fontSize: 11, color: t.textMuted, textAlign: "right", marginTop: 3, marginBottom: 8 }}>
                    {caption.length}/200
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {HASHTAGS.map((tag) => {
                      const isSelected = caption.includes(tag);
                      return (
                        <button
                          key={tag}
                          onClick={() => {
                            if (isSelected) {
                              setCaption((c) => c.replace(tag, "").replace(/  +/g, " ").trim());
                            } else {
                              setCaption((c) => (c ? c.trimEnd() + " " + tag : tag));
                            }
                          }}
                          style={{
                            padding: "5px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500,
                            border: `1.5px solid ${isSelected ? ACCENT : t.outlineBorder}`,
                            background: isSelected ? `${ACCENT}18` : "transparent",
                            color: isSelected ? ACCENT : t.textMuted,
                            fontFamily: "var(--font-inter)", cursor: "pointer",
                            transition: "all 150ms",
                          }}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* Frame selector panel */}
            {photoDataUrl && activeTool === "frame" && (
              <div style={{ padding: isWide ? "0" : "0 24px", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" }}>Choose Frame</span>
                  <button onClick={() => setActiveTool(null)} style={{
                    background: "none", border: "none", color: t.accent,
                    fontFamily: "var(--font-inter)", fontSize: 13, fontWeight: 500, cursor: "pointer",
                  }}>Done</button>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  {([["default", "Classic"], ["banner", "Bar"], ["minimal", "Logo"], ["none", "None"]] as const).map(([key, label]) => (
                    <button key={key} onClick={() => setFrameStyle(key)} style={{
                      width: 60, height: 60, borderRadius: 10, overflow: "hidden",
                      border: frameStyle === key ? `2px solid ${t.accent}` : `1.5px solid ${t.border}`,
                      background: t.surface, cursor: "pointer", position: "relative",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: frameStyle === key ? t.focusRing : "none",
                      padding: 0, flexShrink: 0, flexDirection: "column",
                    }}>
                      <div style={{ position: "absolute", inset: 0, background: CTA_GRADIENT, opacity: 0.3 }} />
                      {key !== "none" && <PhotoOverlay compact variant={key} />}
                      {key === "none" && (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ position: "relative", zIndex: 1 }}>
                          <path d="M3 13L13 3" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      )}
                      <span style={{ position: "absolute", bottom: 2, fontSize: 8, fontWeight: 500, color: "rgba(255,255,255,0.7)", zIndex: 1 }}>{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Crop controls */}
            {photoDataUrl && activeTool === "crop" && (
              <div style={{ padding: isWide ? "0" : "0 24px", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="5" stroke={t.textMuted} strokeWidth="1.2" /><path d="M8 5.5v5M5.5 8h5" stroke={t.textMuted} strokeWidth="1.2" strokeLinecap="round" /></svg>
                  <input
                    type="range" min="1" max="3" step="0.05"
                    value={cropScale}
                    onChange={(e) => setCropScale(parseFloat(e.target.value))}
                    style={{
                      flex: 1, height: 4, appearance: "none", WebkitAppearance: "none",
                      background: `linear-gradient(to right, ${t.accent} ${((cropScale - 1) / 2) * 100}%, ${t.border} ${((cropScale - 1) / 2) * 100}%)`,
                      borderRadius: 2, outline: "none", cursor: "pointer",
                    }}
                  />
                  <span style={{ fontSize: 12, fontWeight: 500, color: t.textMuted, minWidth: 32, textAlign: "right" }}>{cropScale.toFixed(1)}x</span>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => { setCropScale(1); setCropOffset({ x: 0, y: 0 }); setActiveTool(null); }} style={{
                    ...btnOutline, flex: 1, padding: "10px 16px", minHeight: 40, fontSize: 14, textAlign: "center",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>Cancel</button>
                  <button onClick={() => setActiveTool(null)} style={{
                    flex: 1, padding: "10px 16px", minHeight: 40, fontSize: 14, fontWeight: 600,
                    border: "none", borderRadius: 12, background: CTA_GRADIENT, color: "#fff",
                    fontFamily: "var(--font-inter)", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>Done</button>
                </div>
              </div>
            )}
            </div>{/* close right column */}
            </div>{/* close flex row wrapper */}
          </div>

          {!activeTool && (
            <div style={bottomBar}>
              <button
                onClick={() => myMoments.length > 0 ? setPromoOpen(true) : (() => { setActiveTool(null); goTo(2); })()}
                disabled={!photoDataUrl}
                style={{ ...btnPrimary, opacity: photoDataUrl ? 1 : 0.4, pointerEvents: photoDataUrl ? "auto" : "none", ...(isWide ? { maxWidth: 400, margin: "0 auto" } : {}) }}
              >
                Use This Photo
              </button>
            </div>
          )}

          {/* Disclaimer removed — consent is now inline on screen 2 */}

          {/* Promo + Info Collect modal (2nd+ photos) */}
          <AnimatePresence>
            {promoOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: "absolute", inset: 0, zIndex: 100,
                  background: theme === "dark" ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.85)", backdropFilter: "blur(4px)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  padding: 12,
                }}
                onClick={() => { setPromoOpen(false); setPromoOptIn(true); setPromoAnswer(config.promo.options[0]); }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.2 }}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    background: t.surface, borderRadius: 20,
                    padding: "24px 22px", maxWidth: 380, width: "100%",
                    border: `1px solid ${t.border}`,
                    boxShadow: "0 16px 48px rgba(0,0,0,0.3)",
                    maxHeight: "85vh", overflowY: "auto",
                  }}
                >
                  {/* Sponsor promo */}
                  <div style={{
                    background: CTA_GRADIENT, borderRadius: 14,
                    padding: "18px 16px", marginBottom: 20,
                    display: "flex", alignItems: "center", gap: 14,
                  }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                      background: "rgba(255,255,255,0.15)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.4l-6.4 4.8 2.4-7.2-6-4.8h7.6z" fill="rgba(255,255,255,0.9)" />
                      </svg>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: "#fff", lineHeight: 1.3 }}>
                        {config.promo.headline}
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 300, color: "rgba(255,255,255,0.75)", lineHeight: 1.4, marginTop: 2 }}>
                        {config.promo.description}
                      </div>
                    </div>
                  </div>

                  {/* Quick info collect */}
                  <div style={{ marginBottom: 20 }}>
                    <p style={{ fontSize: 14, fontWeight: 500, color: t.text, marginBottom: 12 }}>
                      Quick question before you go:
                    </p>
                    <p style={{ fontSize: 14, fontWeight: 400, color: t.textMuted, marginBottom: 14, lineHeight: 1.5 }}>
                      {config.promo.question}
                    </p>
                    <div style={{ display: "flex", gap: 8 }}>
                      {config.promo.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => { setPromoAnswer(opt); setPromoOptIn(opt !== config.promo.options[config.promo.options.length - 1]); }}
                          style={{
                            flex: 1, padding: "10px 8px", borderRadius: 10, fontSize: 12, fontWeight: 500,
                            border: `1.5px solid ${promoAnswer === opt ? ACCENT : t.outlineBorder}`,
                            background: promoAnswer === opt ? `${ACCENT}18` : "transparent",
                            color: promoAnswer === opt ? ACCENT : t.text,
                            fontFamily: "var(--font-inter)", cursor: "pointer",
                            textAlign: "center", lineHeight: 1.3,
                            transition: "all 150ms",
                          }}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Opt-in checkbox */}
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
                    <label style={{
                      display: "inline-flex", alignItems: "flex-start", gap: 10,
                      cursor: "pointer", userSelect: "none", maxWidth: "90%",
                    }}>
                      <input
                        type="checkbox"
                        checked={promoOptIn}
                        onChange={(e) => setPromoOptIn(e.target.checked)}
                        style={{
                          width: 18, height: 18, marginTop: 2, flexShrink: 0,
                          accentColor: ACCENT, cursor: "pointer",
                        }}
                      />
                      <span style={{ fontSize: 13, lineHeight: 1.5, color: t.textMuted }}>
                        Send me exclusive offers and event updates
                      </span>
                    </label>
                  </div>

                  {/* Submit button */}
                  <button
                    onClick={async () => {
                      if (!photoDataUrl) return;
                      const finalPhoto = await bakeTransforms(photoDataUrl);
                      setMyMoments((prev) => [...prev, { dataUrl: finalPhoto, caption, frameStyle }]);
                      setPhotoDataUrl(null);
                      resetEditorState();
                      setPromoOpen(false);
                      setPromoOptIn(false);
                      setPromoAnswer(null);
                      goTo(0);
                    }}
                    style={{
                      ...btnPrimary, width: "100%", fontSize: 14, padding: "14px 20px", minHeight: 46,
                    }}
                  >
                    Submit &amp; Return to Gallery
                  </button>

                  <button
                    onClick={() => { setPromoOpen(false); setPromoOptIn(true); setPromoAnswer(config.promo.options[0]); }}
                    style={{
                      background: "none", border: "none", color: t.textMuted,
                      fontFamily: "var(--font-inter)", fontSize: 13, fontWeight: 500,
                      cursor: "pointer", width: "100%", padding: "10px 0", marginTop: 8,
                      textAlign: "center",
                    }}
                  >
                    Cancel
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    },

    /* ── SCREEN 2: CONTACT + SUBMIT ── */
    () => (
      <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%" }}>
        <div style={{ flex: 1, overflowY: "auto", width: "100%", ...(isWide ? { display: "flex", justifyContent: "center" } : {}) }}>
          <div style={{ ...(isWide ? { maxWidth: 520, width: "100%" } : { width: "100%" }) }}>
          <motion.div style={{ padding: isWide ? "28px 40px" : "20px 24px" }} initial="hidden" animate="visible" variants={stagger}>
            <motion.h1 variants={fadeUp} style={{ ...titleCss, fontSize: 24 }}>Almost there</motion.h1>
            <motion.p variants={fadeUp} style={subCss}>Where should we send your gallery link?</motion.p>
          </motion.div>

          {/* Photo thumbnail */}
          {photoDataUrl && (
            <div style={{ padding: "0 24px", marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 72, height: 72, borderRadius: 12, overflow: "hidden",
                  border: `1px solid ${t.border}`, flexShrink: 0, position: "relative",
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photoDataUrl} alt="Your photo" style={{
                    width: "100%", height: "100%", objectFit: "cover",
                    transform: `scale(${cropScale}) translate(${cropOffset.x}px, ${cropOffset.y}px) rotate(${rotation}deg)`,
                  }} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: t.text }}>Your photo</div>
                  <button onClick={() => goTo(1)} style={{
                    background: "none", border: "none", color: t.accent, padding: 0,
                    fontFamily: "var(--font-inter)", fontSize: 13, fontWeight: 500,
                    cursor: "pointer", marginTop: 2,
                  }}>
                    Change photo
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Inputs */}
          <div style={{ padding: "0 24px" }}>
            <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: t.text, marginBottom: 8 }}>
              Email <span style={{ color: ERROR }}>*</span>
            </label>
            <input
              type="email" placeholder="you@email.com" value={email}
              onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(""); }}
              onFocus={handleFocus}
              onBlur={(e) => { handleBlur(e); if (email && !isValidEmail(email)) setEmailError("Please enter a valid email address"); }}
              style={{ ...inputStyle, marginBottom: emailError ? 4 : 20, borderColor: emailError ? ERROR : undefined, boxShadow: emailError ? "0 0 0 2px rgba(229,72,77,0.08)" : undefined }}
            />
            {emailError && <p style={{ fontSize: 12, color: ERROR, marginBottom: 16 }}>{emailError}</p>}

            <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: t.text, marginBottom: 8 }}>
              Phone <span style={{ color: ERROR }}>*</span>
            </label>
            <input
              type="tel" placeholder="(214) 555-0100" value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onFocus={handleFocus} onBlur={handleBlur}
              style={inputStyle}
            />

            {/* Consent & Disclaimer */}
            <div style={{
              display: "flex", alignItems: "flex-start", gap: 10,
              cursor: "pointer", userSelect: "none", marginTop: 20,
            }} onClick={() => setAgeConfirmed(!ageConfirmed)}>
              <input
                type="checkbox"
                checked={ageConfirmed}
                onChange={(e) => setAgeConfirmed(e.target.checked)}
                style={{
                  width: 18, minWidth: 18, height: 18, marginTop: 2, flexShrink: 0,
                  accentColor: ACCENT, cursor: "pointer",
                }}
              />
              <span style={{ fontSize: 13, lineHeight: 1.5, color: t.text, textWrap: "wrap" as const }}>
                I confirm I am 13 or older (or have parent/guardian permission).
              </span>
            </div>
            <p style={{ fontSize: 12, fontWeight: 300, color: t.textMuted, lineHeight: 1.6, marginTop: 14, textWrap: "wrap" as const }}>
              By publishing you agree to the{" "}
              <span
                onClick={() => setTermsOpen(true)}
                style={{ color: t.accent, cursor: "pointer", fontWeight: 500 }}
              >fan gallery terms</span>. By submitting your photo, you grant Momentify and the event organizer permission to display it in the gallery and related marketing.
            </p>
          </div>
          </div>{/* close centering wrapper */}
        </div>

        <div style={bottomBar}>
          <button
            onClick={handleSubmit}
            disabled={!email || !phone || !ageConfirmed || submitting}
            style={{ ...btnPrimary, opacity: email && phone && ageConfirmed && !submitting ? 1 : 0.4, pointerEvents: email && phone && ageConfirmed && !submitting ? "auto" : "none", ...(isWide ? { maxWidth: 520, margin: "0 auto" } : {}) }}
          >
            {submitting ? "Publishing..." : "Publish My Photo"}
          </button>
        </div>

        {/* Fan Gallery Terms Modal */}
        <AnimatePresence>
          {termsOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setTermsOpen(false)}
              style={{
                position: "absolute", inset: 0, zIndex: 100,
                background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: 12,
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: t.surface, borderRadius: 20,
                  padding: "28px 24px", maxWidth: 380, width: "100%",
                  border: `1px solid ${t.border}`,
                  boxShadow: "0 16px 48px rgba(0,0,0,0.3)",
                  maxHeight: "80vh", overflowY: "auto",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                  <img src={config.iconPath} alt="Momentify" style={{ width: 34, height: 34, borderRadius: 8, flexShrink: 0 }} />
                  <h3 style={{ fontSize: 21, fontWeight: 500, color: t.text, margin: 0, lineHeight: 1.3 }}>Fan Gallery Terms</h3>
                </div>
                <div style={{ fontSize: 14, lineHeight: 1.7, color: t.textMuted, display: "flex", flexDirection: "column", gap: 14 }}>
                  <p style={{ margin: 0 }}>
                    <strong style={{ color: t.text }}>Photo Usage.</strong> By submitting a photo to the fan gallery, you grant Momentify and the event organizer a non-exclusive, royalty-free license to display, reproduce, and distribute your photo in connection with this event and related promotional materials.
                  </p>
                  <p style={{ margin: 0 }}>
                    <strong style={{ color: t.text }}>Content Guidelines.</strong> Photos must not contain offensive, inappropriate, or copyrighted content. Momentify and the event organizer reserve the right to remove any photo at their sole discretion.
                  </p>
                  <p style={{ margin: 0 }}>
                    <strong style={{ color: t.text }}>Privacy.</strong> Your contact information (email and phone number) will only be used to send you your gallery link and will not be shared with third parties for marketing purposes.
                  </p>
                  <p style={{ margin: 0 }}>
                    <strong style={{ color: t.text }}>Removal.</strong> You may request removal of your photo at any time by contacting the event organizer or emailing hello@entevate.com.
                  </p>
                  <p style={{ margin: 0 }}>
                    <strong style={{ color: t.text }}>Age Requirement.</strong> You must be at least 13 years of age, or have a parent or guardian&apos;s consent, to submit a photo.
                  </p>
                </div>
                <button
                  onClick={() => setTermsOpen(false)}
                  style={{
                    ...btnPrimary, width: "100%", fontSize: 14, padding: "14px 20px",
                    minHeight: 46, marginTop: 24,
                  }}
                >
                  Got It
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    ),

    /* ── SCREEN 3: CONFIRMATION ── */
    () => (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ flex: 1, overflowY: "auto", padding: isWide ? "28px 40px" : "20px 24px", ...(isWide ? { display: "flex", justifyContent: "center" } : {}) }}>
          <div style={{ ...(isWide ? { maxWidth: 600, width: "100%" } : { width: "100%" }) }}>
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.h1 variants={fadeUp} style={titleCss}>{thankYou}</motion.h1>
            <motion.p variants={fadeUp} style={subCss}>Your photo is live in the gallery.</motion.p>
          </motion.div>

          {/* Success banner */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{
            marginTop: 24, marginBottom: 20,
            background: theme === "dark" ? `rgba(${ACCENT_RGB},0.06)` : `rgba(${ACCENT_RGB},0.08)`,
            border: `1px solid ${theme === "dark" ? `rgba(${ACCENT_RGB},0.15)` : `rgba(${ACCENT_RGB},0.2)`}`,
            borderRadius: 12, padding: 20,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                background: `rgba(${ACCENT_RGB},0.15)`,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M6 12.5l4 4 8-9" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 500, color: t.text, lineHeight: 1.3 }}>Photo submitted</div>
                <div style={{ fontSize: 13, fontWeight: 300, color: t.textMuted, lineHeight: 1.5, marginTop: 2 }}>
                  We&apos;ll text a gallery link<br />to you right away!
                </div>
              </div>
              {submittedPhotoUrl && (
                <div
                  onClick={() => {
                    goTo(0);
                    setViewerPhoto({ name: "You", caption, dataUrl: submittedPhotoUrl, frameStyle });
                  }}
                  style={{
                    width: 52, height: 52, borderRadius: 8, overflow: "hidden",
                    border: `1px solid ${t.border}`, flexShrink: 0, cursor: "pointer",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={submittedPhotoUrl} alt="Your photo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              )}
            </div>
          </motion.div>

          {/* Inline giveaway trivia */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <button onClick={() => setTriviaOpen(!triviaOpen)} style={{
              width: "100%", background: CTA_GRADIENT,
              borderRadius: 12, padding: "18px 20px", border: "none",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              cursor: "pointer", marginBottom: triviaOpen ? 0 : 24,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.4l-6.4 4.8 2.4-7.2-6-4.8h7.6z" fill="rgba(255,255,255,0.9)" />
                </svg>
                <span style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>
                  {triviaAnswer ? "Entry submitted" : `Enter to Win ${config.prizeLabel}`}
                </span>
              </div>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{
                transform: triviaOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 200ms",
              }}>
                <path d="M6 8l4 4 4-4" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <AnimatePresence>
              {triviaOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{ overflow: "hidden" }}
                >
                  <div style={{
                    background: t.cardBg, border: `1px solid ${t.border}`,
                    borderTop: "none", borderRadius: "0 0 12px 12px",
                    padding: 20, marginBottom: 24,
                  }}>
                    {!triviaAnswer ? (
                      <>
                        <p style={{ fontSize: 15, fontWeight: 500, color: t.text, marginBottom: 16 }}>
                          {config.trivia.question}
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          {config.trivia.options.map((opt) => (
                            <button
                              key={opt}
                              onClick={() => {
                                setTriviaAnswer(opt);
                                if (opt !== config.trivia.options[config.trivia.correctIndex]) setTriviaWrong(true);
                                else setTriviaWrong(false);
                              }}
                              style={{
                                ...btnOutline, textAlign: "center",
                                fontSize: 15, fontWeight: 500,
                              }}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                        {triviaWrong && triviaAnswer && (
                          <p style={{ fontSize: 13, color: ERROR, marginTop: 12 }}>
                            Not quite, but you&apos;re still entered!
                          </p>
                        )}
                      </>
                    ) : (
                      <div style={{ textAlign: "center", padding: "8px 0" }}>
                        <div style={{
                          width: 48, height: 48, borderRadius: "50%",
                          background: `rgba(${ACCENT_RGB},0.12)`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          margin: "0 auto 12px",
                        }}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M6 12.5l4 4 8-9" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <p style={{ fontSize: 15, fontWeight: 500, color: t.text }}>You&apos;re entered!</p>
                        <p style={{ fontSize: 13, fontWeight: 300, color: t.textMuted, marginTop: 4 }}>
                          {triviaWrong ? "Not the right answer, but you're still in the drawing." : "Correct! Winner announced at halftime."}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Quick survey for data capture */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <button onClick={() => setSurveyOpen(!surveyOpen)} style={{
              width: "100%", background: t.cardBg,
              borderRadius: 12, padding: "18px 20px",
              border: `1px solid ${t.border}`,
              display: "flex", alignItems: "center", justifyContent: "space-between",
              cursor: "pointer", marginBottom: surveyOpen ? 0 : 24,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 11l3 3L22 4" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={{ fontSize: 15, fontWeight: 600, color: t.text }}>
                  {surveySubmitted ? "Thanks for sharing!" : "Tell Us About You"}
                </span>
              </div>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{
                transform: surveyOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 200ms",
              }}>
                <path d="M6 8l4 4 4-4" stroke={t.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <AnimatePresence>
              {surveyOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{ overflow: "hidden" }}
                >
                  <div style={{
                    background: t.cardBg, border: `1px solid ${t.border}`,
                    borderTop: "none", borderRadius: "0 0 12px 12px",
                    padding: 20, marginBottom: 24,
                  }}>
                    {!surveySubmitted ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                        {/* Question 1 */}
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 500, color: t.text, marginBottom: 10 }}>
                            How did you hear about this event?
                          </p>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                            {["Social media", "Friends/family", "Email", "Radio/TV", "Other"].map((opt) => (
                              <button
                                key={opt}
                                onClick={() => setSurveyAnswers(prev => ({ ...prev, heard: opt }))}
                                style={{
                                  ...btnOutline, padding: "8px 14px", fontSize: 13, fontWeight: 500,
                                  background: surveyAnswers.heard === opt ? ACCENT : "transparent",
                                  color: surveyAnswers.heard === opt ? "#fff" : t.text,
                                  borderColor: surveyAnswers.heard === opt ? ACCENT : t.border,
                                }}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Question 2 */}
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 500, color: t.text, marginBottom: 10 }}>
                            How many events do you attend per year?
                          </p>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                            {["1-2", "3-5", "6-10", "10+"].map((opt) => (
                              <button
                                key={opt}
                                onClick={() => setSurveyAnswers(prev => ({ ...prev, frequency: opt }))}
                                style={{
                                  ...btnOutline, padding: "8px 14px", fontSize: 13, fontWeight: 500,
                                  background: surveyAnswers.frequency === opt ? ACCENT : "transparent",
                                  color: surveyAnswers.frequency === opt ? "#fff" : t.text,
                                  borderColor: surveyAnswers.frequency === opt ? ACCENT : t.border,
                                }}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Question 3 */}
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 500, color: t.text, marginBottom: 10 }}>
                            Would you share your experience on social?
                          </p>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                            {["Absolutely!", "Maybe", "Not likely"].map((opt) => (
                              <button
                                key={opt}
                                onClick={() => setSurveyAnswers(prev => ({ ...prev, social: opt }))}
                                style={{
                                  ...btnOutline, padding: "8px 14px", fontSize: 13, fontWeight: 500,
                                  background: surveyAnswers.social === opt ? ACCENT : "transparent",
                                  color: surveyAnswers.social === opt ? "#fff" : t.text,
                                  borderColor: surveyAnswers.social === opt ? ACCENT : t.border,
                                }}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Submit button */}
                        <button
                          onClick={() => setSurveySubmitted(true)}
                          disabled={Object.keys(surveyAnswers).length < 3}
                          style={{
                            ...btnPrimary,
                            marginTop: 4,
                            opacity: Object.keys(surveyAnswers).length >= 3 ? 1 : 0.4,
                            pointerEvents: Object.keys(surveyAnswers).length >= 3 ? "auto" : "none",
                          }}
                        >
                          Submit
                        </button>
                      </div>
                    ) : (
                      <div style={{ textAlign: "center", padding: "8px 0" }}>
                        <div style={{
                          width: 48, height: 48, borderRadius: "50%",
                          background: `rgba(${ACCENT_RGB},0.12)`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          margin: "0 auto 12px",
                        }}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M6 12.5l4 4 8-9" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <p style={{ fontSize: 15, fontWeight: 500, color: t.text }}>Thanks for sharing!</p>
                        <p style={{ fontSize: 13, fontWeight: 300, color: t.textMuted, marginTop: 4 }}>
                          Your feedback helps us create better events.
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Featured promotion / sponsor */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} style={{ marginBottom: 24 }}>
            <div style={{
              background: t.cardBg, border: `1px solid ${t.border}`,
              borderRadius: 12, padding: 20, textAlign: "center",
            }}>
              <p style={{ fontSize: 11, fontWeight: 500, color: t.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>
                Featured Promotion
              </p>
              <div style={{
                background: theme === "dark" ? `rgba(${ACCENT_RGB},0.06)` : `rgba(${ACCENT_RGB},0.05)`,
                border: `1px dashed ${theme === "dark" ? `rgba(${ACCENT_RGB},0.2)` : `rgba(${ACCENT_RGB},0.25)`}`,
                borderRadius: 10, padding: "24px 16px",
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 10,
                  background: CTA_GRADIENT,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 14px",
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M20 7h-3V4a1 1 0 00-1-1H8a1 1 0 00-1 1v3H4a1 1 0 00-1 1v12a1 1 0 001 1h16a1 1 0 001-1V8a1 1 0 00-1-1z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 11v6M9 14h6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p style={{ fontSize: 15, fontWeight: 500, color: t.text, marginBottom: 4 }}>Sponsor or Promotion</p>
                <p style={{ fontSize: 13, fontWeight: 300, color: t.textMuted, lineHeight: 1.5 }}>
                  This space is reserved for a featured sponsor, offer, or promotion to drive engagement.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <button onClick={() => goTo(0)} style={btnOutline}>
              Back to the Game
            </button>
            <button onClick={() => { setPhotoDataUrl(null); resetEditorState(); setEditingMomentIndex(null); goTo(1); }} style={{
              background: "none", border: "none", color: t.accent,
              fontFamily: "var(--font-inter)", fontSize: 14, fontWeight: 500,
              cursor: "pointer", padding: "8px 0", textAlign: "center",
            }}>
              Add another photo
            </button>
          </div>
          </div>{/* close centering wrapper */}
        </div>
      </div>
    ),
  ];

  const CurrentScreen = screens[screen];

  /* ═══════════════════════════════════════
     RENDER
     ═══════════════════════════════════════ */

  return (
    <div ref={containerRef} style={{
      width: "100%", height: "100dvh",
      background: t.bg, color: t.text,
      fontFamily: "var(--font-inter)",
      display: "flex", flexDirection: "column",
      position: "relative", overflow: "hidden",
    }}>
      {fileInput}

      {/* ── Slim 1-row header ── */}
      <div style={{
        background: t.headerBg, backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: `1px solid ${t.border}`,
        padding: isWide ? "12px 40px" : "12px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {screen > 0 && screen < 3 ? <Back to={screen - 1} /> : <MIcon />}
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: t.text }}>{config.eventName}</div>
            {config.eventDate && (
              <div style={{ fontSize: 11, fontWeight: 300, color: t.textMuted, marginTop: 1 }}>
                {new Date(config.eventDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
              </div>
            )}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {screen === 0 && (
            <div style={{
              fontSize: 11, fontWeight: 600, textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: luminance(theme === "dark" ? ACCENT : t.accent) > 0.4 ? "#000" : "#fff",
              background: theme === "dark" ? ACCENT_ON_DARK : t.accent,
              borderRadius: 4,
              padding: "3px 8px", lineHeight: 1.3,
            }}>
              LIVE
            </div>
          )}
          <ThemeBtn />
        </div>
      </div>

      {/* ── Screen content with transitions ── */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden", width: "100%" }}>
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={screen}
            custom={direction}
            variants={screenVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
            style={{ position: "absolute", inset: 0 }}
          >
            {CurrentScreen()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Photo viewer modal — rendered outside screen transitions */}
      <AnimatePresence>
        {viewerPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setViewerPhoto(null)}
            style={{
              position: "absolute", inset: 0, zIndex: 200,
              background: theme === "dark" ? "rgba(0,0,0,0.75)" : "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)",
              display: "flex", flexDirection: "column",
            }}
          >
            {/* Close button */}
            <div style={{ padding: "16px 20px", display: "flex", justifyContent: "flex-end", flexShrink: 0 }}>
              <button
                onClick={() => setViewerPhoto(null)}
                style={{
                  background: theme === "dark" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)",
                  border: "none", borderRadius: "50%",
                  width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M5 5l8 8M13 5l-8 8" stroke={theme === "dark" ? "#fff" : t.text} strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Photo area */}
            <div
              onClick={(e) => e.stopPropagation()}
              style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 20px", overflow: "auto" }}
            >
              <div style={{
                borderRadius: 16, overflow: "hidden", aspectRatio: "3/4",
                position: "relative", background: t.surface,
                boxShadow: theme === "dark" ? "0 8px 32px rgba(0,0,0,0.4)" : "0 8px 32px rgba(0,0,0,0.12)", flexShrink: 0,
              }}>
                {viewerPhoto.dataUrl ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={viewerPhoto.dataUrl} alt="Your photo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <PhotoOverlay variant={viewerPhoto.frameStyle as "default" | "none" | "banner" | "minimal" | undefined} />
                  </>
                ) : (
                  <div style={{
                    width: "100%", height: "100%",
                    background: `linear-gradient(135deg, ${t.surface2}, ${t.placeholder})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <div style={{
                      width: 64, height: 64, borderRadius: "50%",
                      background: t.placeholder, opacity: 0.6,
                    }} />
                    <PhotoOverlay />
                  </div>
                )}
              </div>

              {/* Caption + name */}
              <div style={{ marginTop: 16, paddingBottom: 20, flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: viewerPhoto.name === "You" ? CTA_GRADIENT : t.placeholder,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    {viewerPhoto.name === "You" ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                        <circle cx="12" cy="7" r="4" stroke="#fff" strokeWidth="2" />
                      </svg>
                    ) : (
                      <span style={{ fontSize: 14, fontWeight: 600, color: t.textMuted }}>
                        {viewerPhoto.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: theme === "dark" ? "#fff" : t.text }}>{viewerPhoto.name}</div>
                    <div style={{ fontSize: 11, fontWeight: 300, color: theme === "dark" ? "rgba(255,255,255,0.55)" : t.textMuted }}>{dateStr}</div>
                  </div>
                </div>
                {viewerPhoto.caption && (
                  <p style={{ fontSize: 14, fontWeight: 400, color: theme === "dark" ? "rgba(255,255,255,0.85)" : t.text, lineHeight: 1.6, margin: 0, paddingLeft: 42 }}>
                    {viewerPhoto.caption.split(/(#\w+)/g).map((part, i) =>
                      part.startsWith("#") ? (
                        <span key={i} style={{ color: theme === "dark" ? ACCENT_ON_DARK : t.accent, fontWeight: 500 }}>{part}</span>
                      ) : (
                        <span key={i}>{part}</span>
                      )
                    )}
                  </p>
                )}

                {/* Share button — only for My Moments photos */}
                {viewerPhoto.name === "You" && (
                  <div style={{ marginTop: 20, paddingLeft: 42 }}>
                    <button
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({ title: "My Fan Gallery Moment", text: caption || "Check out my photo!", url: window.location.href });
                        }
                      }}
                      style={{
                        display: "flex", alignItems: "center", gap: 10,
                        background: CTA_GRADIENT, border: "none", borderRadius: 12,
                        padding: "12px 20px", cursor: "pointer",
                        fontFamily: "var(--font-inter)", fontSize: 14, fontWeight: 600,
                        color: "#fff",
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M4 12v7a2 2 0 002 2h12a2 2 0 002-2v-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <polyline points="16 6 12 2 8 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <line x1="12" y1="2" x2="12" y2="15" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      Share My Moment
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
