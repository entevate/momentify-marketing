"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { TeamConfig, FanGalleryThemeTokens } from "@/lib/fan-gallery/types";
import { DEFAULT_CONFIG } from "@/lib/fan-gallery/defaults";
import FanGalleryContent from "@/components/FanGalleryContent";

/* ── HSL helpers ── */

function hexToHsl(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16) / 255;
  const g = parseInt(h.substring(2, 4), 16) / 255;
  const b = parseInt(h.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let s = 0;
  let hu = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) hu = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) hu = ((b - r) / d + 2) / 6;
    else hu = ((r - g) / d + 4) / 6;
  }
  return [Math.round(hu * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  const sn = s / 100;
  const ln = l / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = ln - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  const toHex = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function hexRgb(hex: string): string {
  const h = hex.replace("#", "");
  return `${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)}`;
}

function generateThemeFromColors(
  primary: string,
  secondary: string,
  background: string,
): {
  darkTokens: FanGalleryThemeTokens;
  lightTokens: FanGalleryThemeTokens;
  ctaGradient: string;
} {
  const [bh, bs] = hexToHsl(background);
  const accent = primary.toUpperCase();
  const accentRgb = hexRgb(accent);
  const secRgb = hexRgb(secondary);

  const darkBg = hslToHex(bh, Math.min(bs, 40), 3);
  const darkSurface = hslToHex(bh, Math.min(bs, 35), 7);
  const darkSurface2 = hslToHex(bh, Math.min(bs, 30), 10);
  const darkPlaceholder = hslToHex(bh, Math.min(bs, 30), 13);
  const darkText = hslToHex(bh, 15, 95);
  const darkHeaderRgb = hexRgb(darkBg);

  const darkTokens: FanGalleryThemeTokens = {
    bg: darkBg,
    surface: darkSurface,
    surface2: darkSurface2,
    border: "rgba(255,255,255,0.08)",
    borderHover: "rgba(255,255,255,0.20)",
    text: darkText,
    textMuted: "rgba(245,237,233,0.5)",
    accent,
    headerBg: `rgba(${darkHeaderRgb},0.94)`,
    placeholder: darkPlaceholder,
    focusBorder: `rgba(${accentRgb},0.5)`,
    focusRing: `0 0 0 2px rgba(${accentRgb},0.08)`,
    outlineBorder: "rgba(255,255,255,0.15)",
    cardBg: darkSurface,
  };

  const [ph, ps] = hexToHsl(primary);
  const lightSurface2 = hslToHex(ph, Math.min(ps, 60), 95);
  const lightText = hslToHex(ph, Math.min(ps, 40), 5);
  const lightPlaceholder = hslToHex(ph, Math.min(ps, 50), 92);
  const lightAccent = hslToHex(ph, Math.min(ps + 10, 100), Math.max(hexToHsl(primary)[2] - 15, 15));

  const lightTokens: FanGalleryThemeTokens = {
    bg: "#FFFFFF",
    surface: "#FFFFFF",
    surface2: lightSurface2,
    border: "rgba(26,4,0,0.08)",
    borderHover: `rgba(${secRgb},0.3)`,
    text: lightText,
    textMuted: "rgba(26,4,0,0.5)",
    accent: lightAccent,
    headerBg: "rgba(255,255,255,0.96)",
    placeholder: lightPlaceholder,
    focusBorder: `rgba(${accentRgb},0.5)`,
    focusRing: `0 0 0 2px rgba(${accentRgb},0.08)`,
    outlineBorder: "rgba(26,4,0,0.12)",
    cardBg: "#FFFFFF",
  };

  const ctaGradient = `linear-gradient(135deg, ${secondary.toUpperCase()} 0%, ${accent} 100%)`;
  return { darkTokens, lightTokens, ctaGradient };
}

function toSlug(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

/* ── Design System Tokens ── */

const DS = {
  color: {
    teal: "#00BBA5",
    deepNavy: "#061341",
    midnight: "#0B0B3C",
    error: "#E5484D",
    success: "#22c55e",
  },
  gradient: {
    action: "linear-gradient(135deg, #0CF4DF 0%, #254FE5 100%)",
    brand: "linear-gradient(135deg, #00BBA5 0%, #254FE5 100%)",
  },
  radius: { sm: 4, md: 6, lg: 8, xl: 12, "2xl": 16 },
  spacing: { 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40 },
  elevation: {
    1: "0 1px 0 rgba(0,0,0,0.06)",
    2: "0 4px 12px rgba(0,0,0,0.06)",
    3: "0 10px 15px -3px rgba(0,0,0,0.1)",
  },
  font: "'Inter', sans-serif",
};

/* ── Admin Theme Tokens ── */

interface AdminTokens {
  bg: string;
  surface: string;
  surface2: string;
  border: string;
  borderHover: string;
  text: string;
  textMuted: string;
  textFaint: string;
  inputBg: string;
  inputBorder: string;
  cardShadow: string;
  sectionBg: string;
}

const ADMIN_DARK: AdminTokens = {
  bg: "#07081F",
  surface: "#0F1035",
  surface2: "#161840",
  border: "rgba(255,255,255,0.08)",
  borderHover: "rgba(255,255,255,0.16)",
  text: "#E8EAF6",
  textMuted: "rgba(232,234,246,0.5)",
  textFaint: "rgba(232,234,246,0.3)",
  inputBg: "#0F1035",
  inputBorder: "rgba(255,255,255,0.1)",
  cardShadow: "0 4px 12px rgba(0,0,0,0.3)",
  sectionBg: "#0F1035",
};

const ADMIN_LIGHT: AdminTokens = {
  bg: "#F4F5FA",
  surface: "#FFFFFF",
  surface2: "#ECEEF6",
  border: "rgba(11,11,60,0.1)",
  borderHover: "rgba(11,11,60,0.2)",
  text: "#0B0B3C",
  textMuted: "rgba(11,11,60,0.5)",
  textFaint: "rgba(11,11,60,0.3)",
  inputBg: "#FFFFFF",
  inputBorder: "rgba(11,11,60,0.12)",
  cardShadow: "0 4px 12px rgba(0,0,0,0.06)",
  sectionBg: "#FFFFFF",
};

/* ── Preview presets ── */
const PREVIEW_PRESETS = [
  { label: "Mobile", w: 375, h: 812 },
  { label: "Tablet", w: 768, h: 1024 },
  { label: "Desktop", w: 1280, h: 800 },
];

/* ── Initial state ── */
const INITIAL_PRIMARY = "#F25E3D";
const INITIAL_SECONDARY = "#8F200A";
const INITIAL_BG = "#1A0A06";

function buildInitialConfig(): TeamConfig {
  const { darkTokens, lightTokens, ctaGradient } = generateThemeFromColors(INITIAL_PRIMARY, INITIAL_SECONDARY, INITIAL_BG);
  return { ...DEFAULT_CONFIG, slug: "", published: false, accentColor: INITIAL_PRIMARY, darkTokens, lightTokens, ctaGradient };
}

/* ── Reusable styled components ── */

function Section({ title, children, t }: { title: string; children: React.ReactNode; t: AdminTokens }) {
  return (
    <div style={{
      background: t.sectionBg,
      borderRadius: DS.radius["2xl"],
      border: `1px solid ${t.border}`,
      padding: `${DS.spacing[5]}px ${DS.spacing[6]}px`,
      marginBottom: DS.spacing[4],
      boxShadow: t.cardShadow,
    }}>
      <div style={{
        fontSize: 11,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        color: DS.color.teal,
        marginBottom: DS.spacing[4],
      }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function Label({ children, t }: { children: React.ReactNode; t: AdminTokens }) {
  return (
    <label style={{
      display: "block",
      fontSize: 12,
      fontWeight: 500,
      color: t.textMuted,
      marginBottom: 4,
      marginTop: DS.spacing[3],
    }}>
      {children}
    </label>
  );
}

function inputStyle(t: AdminTokens): React.CSSProperties {
  return {
    width: "100%",
    padding: "10px 12px",
    background: t.inputBg,
    border: `1px solid ${t.inputBorder}`,
    borderRadius: DS.radius.lg,
    color: t.text,
    fontSize: 14,
    fontFamily: DS.font,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 150ms ease",
  };
}

function textareaStyle(t: AdminTokens): React.CSSProperties {
  return {
    ...inputStyle(t),
    resize: "vertical" as const,
    minHeight: 64,
  };
}

/* ── Component ── */

export default function FanGalleryAdmin() {
  const [teams, setTeams] = useState<TeamConfig[]>([]);
  const [config, setConfig] = useState<TeamConfig>(buildInitialConfig);
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [secondaryColor, setSecondaryColor] = useState(INITIAL_SECONDARY);
  const [bgColor, setBgColor] = useState(INITIAL_BG);
  const [adminTheme, setAdminTheme] = useState<"dark" | "light">("dark");

  // Sync admin theme from BrandNav's mk-theme localStorage key
  useEffect(() => {
    const saved = localStorage.getItem("mk-theme");
    if (saved === "light" || saved === "dark") setAdminTheme(saved);
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "mk-theme" && (e.newValue === "light" || e.newValue === "dark")) {
        setAdminTheme(e.newValue);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);
  const [previewScale, setPreviewScale] = useState(50);
  const [previewDevice, setPreviewDevice] = useState(0); // index into PREVIEW_PRESETS
  const previewAreaRef = useRef<HTMLDivElement>(null);

  const t = adminTheme === "dark" ? ADMIN_DARK : ADMIN_LIGHT;
  const device = PREVIEW_PRESETS[previewDevice];

  /* ── Fetch teams ── */
  const fetchTeams = useCallback(async () => {
    try {
      const res = await fetch("/api/fan-gallery/teams");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setTeams(data);
      }
    } catch { /* silent */ }
  }, []);

  useEffect(() => { fetchTeams(); }, [fetchTeams]);

  /* ── Field updater ── */
  const set = useCallback(<K extends keyof TeamConfig>(key: K, val: TeamConfig[K]) => {
    setConfig((prev) => {
      const next = { ...prev, [key]: val };
      if (key === "eventName" && (!prev.slug || prev.slug === toSlug(prev.eventName))) {
        next.slug = toSlug(val as string);
      }
      return next;
    });
  }, []);

  const extractSecondary = (gradient: string): string => {
    const match = gradient.match(/#[0-9A-Fa-f]{6}/);
    return match ? match[0].toUpperCase() : INITIAL_SECONDARY;
  };

  const extractBgTint = (tokens: FanGalleryThemeTokens): string => {
    return tokens.surface2 && tokens.surface2.startsWith("#") ? tokens.surface2 : INITIAL_BG;
  };

  /* ── Team selection ── */
  const handleSelectTeam = useCallback(
    (slug: string) => {
      setSelectedSlug(slug);
      if (slug === "__new__") {
        setConfig(buildInitialConfig());
        setSecondaryColor(INITIAL_SECONDARY);
        setBgColor(INITIAL_BG);
        setStatus(null);
        return;
      }
      const team = teams.find((tm) => tm.slug === slug);
      if (team) {
        setConfig({ ...team });
        setSecondaryColor(extractSecondary(team.ctaGradient));
        setBgColor(extractBgTint(team.darkTokens));
        setStatus(null);
      }
    },
    [teams]
  );

  /* ── Auto-generate theme whenever colors change ── */
  useEffect(() => {
    const { darkTokens, lightTokens, ctaGradient } = generateThemeFromColors(config.accentColor, secondaryColor, bgColor);
    setConfig((prev) => ({ ...prev, darkTokens, lightTokens, ctaGradient }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.accentColor, secondaryColor, bgColor]);

  /* ── Save ── */
  const handleSave = useCallback(
    async (publish: boolean) => {
      const toSave: TeamConfig = { ...config, published: publish };
      if (!toSave.slug) {
        setStatus({ type: "error", msg: "Slug is required." });
        return;
      }
      setLoading(true);
      setStatus(null);
      try {
        const isExisting = teams.some((tm) => tm.slug === toSave.slug);
        const method = isExisting ? "PUT" : "POST";
        const res = await fetch("/api/fan-gallery/teams", {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(toSave),
        });
        const data = await res.json();
        if (res.ok) {
          setConfig(toSave);
          setSelectedSlug(toSave.slug);
          setStatus({ type: "success", msg: `${publish ? "Published" : "Draft saved"} -- /fan-gallery/${toSave.slug}` });
          await fetchTeams();
        } else {
          setStatus({ type: "error", msg: data.error || "Save failed." });
        }
      } catch {
        setStatus({ type: "error", msg: "Network error." });
      } finally {
        setLoading(false);
      }
    },
    [config, teams, fetchTeams]
  );

  /* ── Fan helpers ── */
  const updateFan = (index: number, field: "name" | "caption" | "photoUrl", value: string | undefined) => {
    setConfig((prev) => {
      const fans = [...prev.fans];
      fans[index] = { ...fans[index], [field]: value };
      return { ...prev, fans };
    });
  };
  const handleFanPhoto = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onload = () => { updateFan(index, "photoUrl", reader.result as string); };
    reader.readAsDataURL(file);
  };
  const addFan = () => {
    setConfig((prev) => ({ ...prev, fans: [...prev.fans, { name: "", caption: "" }] }));
  };
  const removeFan = (index: number) => {
    setConfig((prev) => ({ ...prev, fans: prev.fans.filter((_, i) => i !== index) }));
  };

  /* ── Trivia / Promo helpers ── */
  const updateTriviaOption = (index: number, value: string) => {
    setConfig((prev) => {
      const options = [...prev.trivia.options];
      options[index] = value;
      return { ...prev, trivia: { ...prev.trivia, options } };
    });
  };
  const updatePromoOption = (index: number, value: string) => {
    setConfig((prev) => {
      const options = [...prev.promo.options];
      options[index] = value;
      return { ...prev, promo: { ...prev.promo, options } };
    });
  };

  /* ── Auto-fit preview scale to available height ── */
  const computeAutoScale = useCallback(() => {
    if (!previewAreaRef.current) return 50;
    // Available height minus toolbar (~80px) and size indicator (~30px)
    const availH = previewAreaRef.current.clientHeight;
    const availW = previewAreaRef.current.clientWidth;
    const d = PREVIEW_PRESETS[previewDevice];
    const scaleH = (availH / d.h) * 100;
    const scaleW = (availW / d.w) * 100;
    return Math.min(Math.floor(Math.min(scaleH, scaleW)), 100);
  }, [previewDevice]);

  // Auto-fit on mount, device change, and window resize
  useEffect(() => {
    const fit = () => setPreviewScale(computeAutoScale());
    const timer = setTimeout(fit, 50);
    window.addEventListener("resize", fit);
    return () => { clearTimeout(timer); window.removeEventListener("resize", fit); };
  }, [computeAutoScale]);

  /* ── Computed preview dimensions ── */
  const scaleFactor = previewScale / 100;
  const previewW = device.w * scaleFactor;
  const previewH = device.h * scaleFactor;

  /* ── Button styles ── */
  const btnBase: React.CSSProperties = {
    padding: "10px 20px",
    borderRadius: DS.radius.lg,
    fontSize: 13,
    fontWeight: 600,
    fontFamily: DS.font,
    cursor: "pointer",
    transition: "all 150ms ease",
    border: "none",
  };

  return (
    <>
      <style>{`
        @media (max-width: 1080px) {
          .admin-layout { flex-direction: column !important; }
          .admin-left, .admin-right { width: 100% !important; min-width: 0 !important; max-height: none !important; border-right: none !important; }
        }
        .admin-input:focus { border-color: ${DS.color.teal} !important; }
        .admin-select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg width='10' height='14' viewBox='0 0 10 14' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 9L5 13L9 9' stroke='${adminTheme === "dark" ? "%23E8EAF6" : "%230B0B3C"}' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M1 5L5 1L9 5' stroke='${adminTheme === "dark" ? "%23E8EAF6" : "%230B0B3C"}' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 36px !important; }
        .admin-slider { -webkit-appearance: none; appearance: none; height: 4px; border-radius: 2px; background: ${t.border}; outline: none; }
        .admin-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: ${DS.color.teal}; cursor: pointer; border: 2px solid ${t.surface}; box-shadow: 0 1px 4px rgba(0,0,0,0.2); }
        .color-swatch { border: 2px solid ${t.border}; border-radius: ${DS.radius.lg}px; overflow: hidden; cursor: pointer; transition: border-color 150ms ease; }
        .color-swatch:hover { border-color: ${t.borderHover}; }
        .preview-device-frame { overflow: hidden; }
        .preview-device-frame > div { height: 100% !important; max-height: 100% !important; width: 100% !important; }
      `}</style>
      <div className="admin-layout" style={{
        display: "flex",
        minHeight: "100vh",
        background: t.bg,
        color: t.text,
        fontFamily: DS.font,
        fontSize: 14,
      }}>
        {/* ── Left Panel: Editor ── */}
        <div className="admin-left" style={{
          width: "50%",
          minWidth: 440,
          padding: `${DS.spacing[6]}px ${DS.spacing[8]}px`,
          overflowY: "auto",
          maxHeight: "100vh",
          borderRight: `1px solid ${t.border}`,
        }}>
          {/* ── Team Selector ── */}
          <Section title="Team" t={t}>
            <div style={{ display: "flex", gap: DS.spacing[2], alignItems: "center" }}>
              <div style={{ flex: 1, position: "relative" }}>
                <select
                  className="admin-input admin-select"
                  style={{ ...inputStyle(t), paddingRight: 40, cursor: "pointer" }}
                  value={selectedSlug}
                  onChange={(e) => handleSelectTeam(e.target.value)}
                >
                  <option value="">Select team...</option>
                  {teams.map((tm) => (
                    <option key={tm.slug} value={tm.slug}>
                      {tm.eventName} ({tm.slug}){!tm.published ? " [draft]" : ""}
                    </option>
                  ))}
                </select>
                <div style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}>
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path d="M1 5L5 1L9 5" stroke={t.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path d="M1 1L5 5L9 1" stroke={t.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              <button
                onClick={() => handleSelectTeam("__new__")}
                style={{
                  ...btnBase,
                  background: DS.gradient.brand,
                  color: "#fff",
                  whiteSpace: "nowrap",
                }}
              >
                + New Team
              </button>
            </div>
          </Section>

          {/* ── General ── */}
          <Section title="General" t={t}>
            <Label t={t}>Slug</Label>
            <input className="admin-input" style={inputStyle(t)} value={config.slug} onChange={(e) => set("slug", e.target.value)} placeholder="auto-generated-from-event-name" />

            <Label t={t}>Event Name</Label>
            <input className="admin-input" style={inputStyle(t)} value={config.eventName} onChange={(e) => set("eventName", e.target.value)} placeholder="Mavs vs. Lakers" />

            <Label t={t}>Event Date</Label>
            <input type="date" className="admin-input" style={inputStyle(t)} value={config.eventDate || ""} onChange={(e) => set("eventDate", e.target.value)} />

            <Label t={t}>Gallery Title</Label>
            <input className="admin-input" style={inputStyle(t)} value={config.galleryTitle} onChange={(e) => set("galleryTitle", e.target.value)} placeholder="Suite 214 Gallery" />

            <Label t={t}>Gallery Subtitle</Label>
            <textarea className="admin-input" style={textareaStyle(t)} value={config.gallerySubtitle} onChange={(e) => set("gallerySubtitle", e.target.value)} placeholder="Add your photo for a chance to win 2 Club Seats." />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: DS.spacing[3], marginTop: DS.spacing[1] }}>
              <div>
                <Label t={t}>Location Label</Label>
                <input className="admin-input" style={inputStyle(t)} value={config.locationLabel} onChange={(e) => set("locationLabel", e.target.value)} />
              </div>
              <div>
                <Label t={t}>Prize Label</Label>
                <input className="admin-input" style={inputStyle(t)} value={config.prizeLabel} onChange={(e) => set("prizeLabel", e.target.value)} />
              </div>
            </div>
          </Section>

          {/* ── Branding ── */}
          <Section title="Branding" t={t}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: DS.spacing[5] }}>
              {/* Primary */}
              <div>
                <Label t={t}>Primary</Label>
                <div style={{ display: "flex", gap: DS.spacing[2], alignItems: "center", marginTop: 4 }}>
                  <label className="color-swatch" style={{ width: 40, height: 40, display: "block", flexShrink: 0 }}>
                    <div style={{ width: "100%", height: "100%", background: config.accentColor }} />
                    <input
                      type="color"
                      value={config.accentColor}
                      onChange={(e) => set("accentColor", e.target.value.toUpperCase())}
                      style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
                    />
                  </label>
                  <input
                    className="admin-input"
                    style={{ ...inputStyle(t), fontSize: 12, padding: "8px 10px" }}
                    value={config.accentColor}
                    onChange={(e) => set("accentColor", e.target.value)}
                  />
                </div>
                <div style={{ fontSize: 10, color: t.textFaint, marginTop: 4 }}>Buttons, links, accents</div>
              </div>
              {/* Secondary */}
              <div>
                <Label t={t}>Secondary</Label>
                <div style={{ display: "flex", gap: DS.spacing[2], alignItems: "center", marginTop: 4 }}>
                  <label className="color-swatch" style={{ width: 40, height: 40, display: "block", flexShrink: 0 }}>
                    <div style={{ width: "100%", height: "100%", background: secondaryColor }} />
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value.toUpperCase())}
                      style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
                    />
                  </label>
                  <input
                    className="admin-input"
                    style={{ ...inputStyle(t), fontSize: 12, padding: "8px 10px" }}
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                  />
                </div>
                <div style={{ fontSize: 10, color: t.textFaint, marginTop: 4 }}>Gradient dark end</div>
              </div>
              {/* Background */}
              <div>
                <Label t={t}>Background</Label>
                <div style={{ display: "flex", gap: DS.spacing[2], alignItems: "center", marginTop: 4 }}>
                  <label className="color-swatch" style={{ width: 40, height: 40, display: "block", flexShrink: 0 }}>
                    <div style={{ width: "100%", height: "100%", background: bgColor }} />
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value.toUpperCase())}
                      style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
                    />
                  </label>
                  <input
                    className="admin-input"
                    style={{ ...inputStyle(t), fontSize: 12, padding: "8px 10px" }}
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                  />
                </div>
                <div style={{ fontSize: 10, color: t.textFaint, marginTop: 4 }}>Dark mode base tint</div>
              </div>
            </div>

            {/* Palette previews */}
            <div style={{ marginTop: DS.spacing[5] }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: t.textFaint, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Dark Mode Palette
              </div>
              <div style={{ display: "flex", gap: 2, borderRadius: DS.radius.lg, overflow: "hidden", height: 28 }}>
                <div style={{ flex: 1, background: config.accentColor }} title="Accent" />
                <div style={{ flex: 1, background: config.ctaGradient }} title="CTA Gradient" />
                <div style={{ flex: 1, background: config.darkTokens.bg }} title="BG" />
                <div style={{ flex: 1, background: config.darkTokens.surface }} title="Surface" />
                <div style={{ flex: 1, background: config.darkTokens.surface2 }} title="Surface 2" />
                <div style={{ flex: 1, background: config.darkTokens.text }} title="Text" />
              </div>
            </div>
            <div style={{ marginTop: DS.spacing[3] }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: t.textFaint, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Light Mode Palette
              </div>
              <div style={{ display: "flex", gap: 2, borderRadius: DS.radius.lg, overflow: "hidden", height: 28, border: `1px solid ${t.border}` }}>
                <div style={{ flex: 1, background: config.lightTokens.accent }} title="Accent" />
                <div style={{ flex: 1, background: config.ctaGradient }} title="CTA Gradient" />
                <div style={{ flex: 1, background: config.lightTokens.bg }} title="BG" />
                <div style={{ flex: 1, background: config.lightTokens.surface2 }} title="Surface 2" />
                <div style={{ flex: 1, background: config.lightTokens.placeholder }} title="Placeholder" />
                <div style={{ flex: 1, background: config.lightTokens.text }} title="Text" />
              </div>
            </div>

            <Label t={t}>Icon Path</Label>
            <input className="admin-input" style={inputStyle(t)} value={config.iconPath} onChange={(e) => set("iconPath", e.target.value)} />
          </Section>

          {/* ── Gallery Fans ── */}
          <Section title="Gallery Fans" t={t}>
            {config.fans.map((fan, i) => (
              <div key={i} style={{
                display: "flex",
                gap: DS.spacing[2],
                alignItems: "center",
                marginBottom: DS.spacing[2],
                padding: DS.spacing[2],
                background: t.surface2,
                borderRadius: DS.radius.xl,
                border: `1px solid ${t.border}`,
              }}>
                {/* Thumbnail / upload */}
                <label style={{
                  width: 48,
                  height: 48,
                  borderRadius: DS.radius.lg,
                  border: fan.photoUrl ? "none" : `2px dashed ${t.borderHover}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  overflow: "hidden",
                  flexShrink: 0,
                  background: fan.photoUrl ? "none" : t.inputBg,
                  transition: "border-color 150ms ease",
                }}>
                  {fan.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={fan.photoUrl} alt={fan.name || "Fan"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M12 5v14m-7-7h14" stroke={t.textFaint} strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )}
                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFanPhoto(i, file);
                  }} />
                </label>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
                  <input className="admin-input" style={{ ...inputStyle(t), padding: "7px 10px", fontSize: 13 }} value={fan.name} onChange={(e) => updateFan(i, "name", e.target.value)} placeholder="Name" />
                  <input className="admin-input" style={{ ...inputStyle(t), padding: "7px 10px", fontSize: 13 }} value={fan.caption} onChange={(e) => updateFan(i, "caption", e.target.value)} placeholder="Caption" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
                  <button onClick={() => removeFan(i)} style={{
                    ...btnBase,
                    padding: "6px 10px",
                    fontSize: 11,
                    background: "transparent",
                    border: `1px solid rgba(229,72,77,0.3)`,
                    color: DS.color.error,
                  }}>
                    Remove
                  </button>
                  {fan.photoUrl && (
                    <button onClick={() => updateFan(i, "photoUrl", undefined)} style={{
                      fontSize: 10,
                      color: t.textMuted,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      fontFamily: DS.font,
                    }}>
                      Clear photo
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button onClick={addFan} style={{
              ...btnBase,
              width: "100%",
              padding: "10px",
              background: "transparent",
              border: `2px dashed ${t.borderHover}`,
              color: t.textMuted,
              marginTop: DS.spacing[2],
            }}>
              + Add Fan
            </button>
          </Section>

          {/* ── Hashtags ── */}
          <Section title="Hashtags" t={t}>
            <Label t={t}>Comma-separated</Label>
            <input
              className="admin-input"
              style={inputStyle(t)}
              value={config.hashtags.join(", ")}
              onChange={(e) => set("hashtags", e.target.value.split(",").map((h) => h.trim()).filter(Boolean))}
              placeholder="#Suite214, #GameDay, #FanGallery"
            />
          </Section>

          {/* ── Trivia ── */}
          <Section title="Trivia" t={t}>
            <Label t={t}>Question</Label>
            <input
              className="admin-input"
              style={inputStyle(t)}
              value={config.trivia.question}
              onChange={(e) => setConfig((p) => ({ ...p, trivia: { ...p.trivia, question: e.target.value } }))}
            />
            {config.trivia.options.map((opt, i) => (
              <div key={i} style={{ display: "flex", gap: DS.spacing[2], alignItems: "center", marginTop: DS.spacing[2] }}>
                <input
                  type="radio"
                  name="triviaCorrect"
                  checked={config.trivia.correctIndex === i}
                  onChange={() => setConfig((p) => ({ ...p, trivia: { ...p.trivia, correctIndex: i } }))}
                  style={{ accentColor: DS.color.teal, width: 16, height: 16, flexShrink: 0 }}
                />
                <input
                  className="admin-input"
                  style={{ ...inputStyle(t), flex: 1 }}
                  value={opt}
                  onChange={(e) => updateTriviaOption(i, e.target.value)}
                  placeholder={`Option ${i + 1}`}
                />
              </div>
            ))}
          </Section>

          {/* ── Promo ── */}
          <Section title="Promo" t={t}>
            <Label t={t}>Headline</Label>
            <input className="admin-input" style={inputStyle(t)} value={config.promo.headline}
              onChange={(e) => setConfig((p) => ({ ...p, promo: { ...p.promo, headline: e.target.value } }))} />
            <Label t={t}>Description</Label>
            <input className="admin-input" style={inputStyle(t)} value={config.promo.description}
              onChange={(e) => setConfig((p) => ({ ...p, promo: { ...p.promo, description: e.target.value } }))} />
            <Label t={t}>Question</Label>
            <input className="admin-input" style={inputStyle(t)} value={config.promo.question}
              onChange={(e) => setConfig((p) => ({ ...p, promo: { ...p.promo, question: e.target.value } }))} />
            {config.promo.options.map((opt, i) => (
              <div key={i} style={{ marginTop: DS.spacing[2] }}>
                <input className="admin-input" style={inputStyle(t)} value={opt}
                  onChange={(e) => updatePromoOption(i, e.target.value)} placeholder={`Option ${i + 1}`} />
              </div>
            ))}
          </Section>

          {/* ── Banner ── */}
          <Section title="Banner" t={t}>
            <Label t={t}>Banner Text</Label>
            <input className="admin-input" style={inputStyle(t)} value={config.bannerText} onChange={(e) => set("bannerText", e.target.value)} />
            <Label t={t}>Banner Subtext</Label>
            <input className="admin-input" style={inputStyle(t)} value={config.bannerSubtext} onChange={(e) => set("bannerSubtext", e.target.value)} />
          </Section>

          {/* ── Thank You Messages ── */}
          <Section title="Thank You Messages" t={t}>
            <Label t={t}>Comma-separated</Label>
            <input
              className="admin-input"
              style={inputStyle(t)}
              value={config.thankYouMessages.join(", ")}
              onChange={(e) => set("thankYouMessages", e.target.value.split(",").map((m) => m.trim()).filter(Boolean))}
              placeholder="Lookin' good!, Nice photo!, Nailed it!"
            />
          </Section>

          {/* ── Actions ── */}
          <div style={{
            display: "flex",
            gap: DS.spacing[3],
            alignItems: "center",
            padding: `${DS.spacing[5]}px 0`,
            marginBottom: DS.spacing[10],
          }}>
            <button
              onClick={() => handleSave(false)}
              disabled={loading}
              style={{
                ...btnBase,
                background: t.surface2,
                color: t.text,
                border: `1px solid ${t.border}`,
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? "Saving..." : "Save Draft"}
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={loading}
              style={{
                ...btnBase,
                background: DS.gradient.brand,
                color: "#fff",
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? "Publishing..." : "Publish"}
            </button>
          </div>

          {status && (
            <div style={{
              padding: `${DS.spacing[3]}px ${DS.spacing[4]}px`,
              borderRadius: DS.radius.lg,
              fontSize: 13,
              marginBottom: DS.spacing[6],
              background: status.type === "success" ? "rgba(34,197,94,0.08)" : "rgba(229,72,77,0.08)",
              border: `1px solid ${status.type === "success" ? "rgba(34,197,94,0.25)" : "rgba(229,72,77,0.25)"}`,
              color: status.type === "success" ? DS.color.success : DS.color.error,
            }}>
              {status.msg}
            </div>
          )}
        </div>

        {/* ── Right Panel: Preview ── */}
        <div className="admin-right" style={{
          width: "50%",
          padding: DS.spacing[6],
          overflowY: "auto",
          maxHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}>
          {/* Preview toolbar */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: DS.spacing[4],
            flexShrink: 0,
          }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: t.textMuted }}>
              Preview{config.slug ? ` -- /fan-gallery/${config.slug}` : ""}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: DS.spacing[3] }}>
              {/* Device presets */}
              <div style={{
                display: "flex",
                borderRadius: DS.radius.md,
                overflow: "hidden",
                border: `1px solid ${t.border}`,
              }}>
                {PREVIEW_PRESETS.map((preset, i) => (
                  <button
                    key={preset.label}
                    onClick={() => setPreviewDevice(i)}
                    style={{
                      padding: "6px 12px",
                      fontSize: 11,
                      fontWeight: 500,
                      fontFamily: DS.font,
                      border: "none",
                      cursor: "pointer",
                      background: previewDevice === i ? DS.color.teal : "transparent",
                      color: previewDevice === i ? "#fff" : t.textMuted,
                      borderRight: i < PREVIEW_PRESETS.length - 1 ? `1px solid ${t.border}` : "none",
                      transition: "all 150ms ease",
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Scale slider */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: DS.spacing[3],
            marginBottom: DS.spacing[4],
            flexShrink: 0,
          }}>
            <span style={{ fontSize: 11, color: t.textFaint, whiteSpace: "nowrap" }}>Scale</span>
            <input
              className="admin-slider"
              type="range"
              min={25}
              max={100}
              value={previewScale}
              onChange={(e) => setPreviewScale(Number(e.target.value))}
              style={{ flex: 1 }}
            />
            <span style={{ fontSize: 11, color: t.textMuted, fontVariantNumeric: "tabular-nums", minWidth: 36, textAlign: "right" }}>
              {previewScale}%
            </span>
          </div>

          {/* Preview container */}
          <div ref={previewAreaRef} style={{
            flex: 1,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            overflow: "auto",
          }}>
            <div style={{
              width: previewW,
              height: previewH,
              borderRadius: DS.radius["2xl"],
              overflow: "hidden",
              border: `1px solid ${t.border}`,
              boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
              flexShrink: 0,
              position: "relative",
              background: "#000",
            }}>
              <div className="preview-device-frame" style={{
                transform: `scale(${scaleFactor})`,
                transformOrigin: "top left",
                width: device.w,
                height: device.h,
              }}>
                <FanGalleryContent config={config} />
              </div>
            </div>
          </div>

          {/* Size indicator */}
          <div style={{
            textAlign: "center",
            fontSize: 10,
            color: t.textFaint,
            marginTop: DS.spacing[3],
            flexShrink: 0,
          }}>
            {device.w} x {device.h} @ {previewScale}%
          </div>
        </div>
      </div>
    </>
  );
}
