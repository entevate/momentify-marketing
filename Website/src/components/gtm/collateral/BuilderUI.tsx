"use client"

/**
 * Shared form primitives for the /gtm collateral builders (Email Signature,
 * Business Card, Letterhead). Every visual choice — colors, fonts, spacing —
 * lives in this file, so restyling all three tools is a one-file edit.
 *
 * Company-specific surface is intentionally limited to the constants at the
 * top of this module (COLORS, ACCENTS, FONT_STACK, ASSET_ORIGIN). A future
 * fork into a non-Momentify Growth Engine only touches those.
 */

import { useEffect, useState } from "react"
import type { CSSProperties, ChangeEvent, HTMLAttributes, ReactNode } from "react"

// ─── Company-specific knobs ─────────────────────────────────────────────
// Momentify brand tokens. Match Website/design-tokens.json.
export const COLORS = {
  ink: "#061341",       // deep-navy — headline / body ink on white
  navy: "#0B0B3C",      // midnight — hero anchor
  muted: "#555555",     // gray-body — subheads, secondary text
  border: "#DDE6F0",    // border on light surfaces
  cyan: "#0CF4DF",      // primary accent on dark, elite ROX
  teal: "#00BBA5",      // eyebrows, links, interactive accents
  blue: "#254FE5",      // action gradient endpoint
  paper: "#FFFFFF",
  pageBg: "#F8F9FB",
}

export const ACCENTS: { id: string; label: string; hex: string }[] = [
  { id: "teal",    label: "Teal",    hex: "#00BBA5" },
  { id: "cyan",    label: "Cyan",    hex: "#0CF4DF" },
  { id: "blue",    label: "Blue",    hex: "#254FE5" },
  { id: "navy",    label: "Navy",    hex: "#061341" },
  { id: "violet",  label: "Violet",  hex: "#6B21D4" },
  { id: "amber",   label: "Amber",   hex: "#F2B33D" },
  { id: "crimson", label: "Crimson", hex: "#F25E3D" },
  { id: "indigo",  label: "Indigo",  hex: "#3A2073" },
]

// Font stack used inside every generated HTML string. Uses Inter with a
// system fallback so emails/docs that can't load a webfont still render
// in the right family category.
export const FONT_STACK =
  "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"

// Where server-rendered exports fetch brand assets from. Must be public
// (no auth) since headless Chromium fetches these URLs server-side.
export const ASSET_ORIGIN = "https://www.momentifyapp.com"

// ─── Responsive builder layout ──────────────────────────────────────────
// Desktop: form left, sticky preview right. Mobile: the preview pins to the
// top with a show/hide chevron and the form stacks below, so the preview
// stays visible while the fields scroll.
export function BuilderLayout({ form, preview }: { form: ReactNode; preview: ReactNode }) {
  const [isMobile, setIsMobile] = useState(false)
  const [open, setOpen] = useState(true)
  useEffect(() => {
    const c = () => setIsMobile(window.innerWidth < 768)
    c()
    window.addEventListener("resize", c)
    return () => window.removeEventListener("resize", c)
  }, [])

  if (isMobile) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ position: "sticky", top: 0, zIndex: 30, background: COLORS.pageBg, paddingBottom: 10, borderBottom: `1px solid ${COLORS.border}` }}>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "10px 12px", background: COLORS.paper, border: `1px solid ${COLORS.border}`, borderRadius: 9, color: COLORS.ink, fontFamily: FONT_STACK, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
          >
            <span>Live preview</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .15s ease", flex: "none" }}><polyline points="6 9 12 15 18 9" /></svg>
          </button>
          {open && <div style={{ marginTop: 10, maxHeight: "46vh", overflow: "auto" }}>{preview}</div>}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>{form}</div>
      </div>
    )
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 380px) minmax(0, 1fr)", gap: 20, alignItems: "start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>{form}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 16, minWidth: 0 }}>{preview}</div>
    </div>
  )
}

// ─── Text helpers ──────────────────────────────────────────────────────
export function escapeHtml(v: string): string {
  return v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

export function normalizeUrl(v: string): string {
  const trimmed = (v || "").trim()
  if (!trimmed) return ""
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

// ─── Style tokens for form primitives ───────────────────────────────────
const font = "'Inter', system-ui, sans-serif"

const cardStyle: CSSProperties = {
  background: "var(--gtm-bg-card)",
  border: "1px solid var(--gtm-border)",
  borderRadius: 8,
  padding: 20,
  display: "flex",
  flexDirection: "column",
  gap: 16,
  fontFamily: font,
}

const labelStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: "var(--gtm-text-secondary)",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: 6,
  fontFamily: font,
}

const inputBase: CSSProperties = {
  width: "100%",
  height: 36,
  padding: "0 10px",
  border: "1px solid var(--gtm-border)",
  borderRadius: 6,
  background: "var(--gtm-bg-input, #fff)",
  color: "var(--gtm-text-primary)",
  fontSize: 13,
  fontFamily: font,
  boxSizing: "border-box",
  outline: "none",
}

// ─── Buttons ────────────────────────────────────────────────────────────
export const primaryBtn: CSSProperties = {
  height: 36,
  padding: "0 14px",
  background: `linear-gradient(135deg, ${COLORS.cyan} 0%, ${COLORS.blue} 100%)`,
  color: "#fff",
  border: "none",
  borderRadius: 6,
  fontSize: 12.5,
  fontWeight: 600,
  fontFamily: font,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  boxSizing: "border-box",
}

export const ghostBtn: CSSProperties = {
  ...primaryBtn,
  background: "transparent",
  color: "var(--gtm-text-primary)",
  border: "1px solid var(--gtm-border)",
}

// ─── Primitives ────────────────────────────────────────────────────────
export function Card({
  children,
  title,
  style,
}: {
  children: ReactNode
  title?: string
  style?: CSSProperties
}) {
  return (
    <div style={{ ...cardStyle, ...style }}>
      {title && (
        <h3
          style={{
            margin: 0,
            fontSize: 14,
            fontWeight: 600,
            color: "var(--gtm-text-primary)",
            fontFamily: font,
          }}
        >
          {title}
        </h3>
      )}
      {children}
    </div>
  )
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: ReactNode
}) {
  return (
    <div>
      <div style={labelStyle}>{label}</div>
      {children}
      {hint && (
        <p
          style={{
            margin: "6px 0 0 0",
            fontSize: 11,
            color: "var(--gtm-text-faint)",
            fontFamily: font,
          }}
        >
          {hint}
        </p>
      )}
    </div>
  )
}

export function Input(
  props: {
    value: string
    onChange: (v: string) => void
    placeholder?: string
    type?: string
  } & Omit<HTMLAttributes<HTMLInputElement>, "onChange">
) {
  const { value, onChange, placeholder, type = "text", style, ...rest } = props
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      style={{ ...inputBase, ...style }}
      {...rest}
    />
  )
}

export function Textarea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rows?: number
}) {
  return (
    <textarea
      value={value}
      placeholder={placeholder}
      rows={rows}
      onChange={(e) => onChange(e.target.value)}
      style={{
        ...inputBase,
        height: "auto",
        minHeight: rows * 22 + 10,
        padding: "8px 10px",
        resize: "vertical",
      }}
    />
  )
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <label
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        fontSize: 12.5,
        fontFamily: font,
        color: "var(--gtm-text-primary)",
        cursor: "pointer",
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ margin: 0 }}
      />
      {label}
    </label>
  )
}

export function Chip({
  label,
  active,
  onClick,
  swatch,
}: {
  label: string
  active: boolean
  onClick: () => void
  swatch?: string
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        height: 30,
        padding: "0 10px",
        borderRadius: 999,
        border: `1px solid ${active ? COLORS.teal : "var(--gtm-border)"}`,
        background: active ? "rgba(0,187,165,0.08)" : "transparent",
        color: active ? COLORS.teal : "var(--gtm-text-secondary)",
        fontSize: 12,
        fontFamily: font,
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      {swatch && (
        <span
          style={{
            width: 12,
            height: 12,
            borderRadius: 3,
            background: swatch,
            border: "1px solid rgba(0,0,0,0.08)",
          }}
        />
      )}
      {label}
    </button>
  )
}

export function AccentPicker({
  value,
  onChange,
}: {
  value: string
  onChange: (hex: string) => void
}) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {ACCENTS.map((a) => (
        <Chip
          key={a.id}
          label={a.label}
          active={value.toLowerCase() === a.hex.toLowerCase()}
          onClick={() => onChange(a.hex)}
          swatch={a.hex}
        />
      ))}
    </div>
  )
}

export function PresetSwitcher({
  presets,
  active,
  onChange,
}: {
  presets: { id: string; label: string }[]
  active: string
  onChange: (id: string) => void
}) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {presets.map((p) => (
        <Chip
          key={p.id}
          label={p.label}
          active={active === p.id}
          onClick={() => onChange(p.id)}
        />
      ))}
    </div>
  )
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string
  title: string
  subtitle?: string
}) {
  return (
    <div style={{ marginBottom: 20, fontFamily: font }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: COLORS.teal,
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          marginBottom: 8,
        }}
      >
        {eyebrow}
      </div>
      <h1
        style={{
          margin: 0,
          fontSize: 26,
          fontWeight: 500,
          letterSpacing: "-0.02em",
          color: "var(--gtm-text-primary)",
          lineHeight: 1.15,
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          style={{
            margin: "8px 0 0 0",
            fontSize: 13,
            fontWeight: 300,
            color: "var(--gtm-text-secondary)",
            lineHeight: 1.6,
            maxWidth: 640,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}

// ─── localStorage merge helper ─────────────────────────────────────────
/**
 * Load a saved config for a preset, merged over the preset's defaults.
 * Missing keys fall through to the defaults so schema additions don't
 * strand old saved sessions.
 */
export function loadSavedConfig<T extends object>(key: string, defaults: T): T {
  if (typeof window === "undefined") return defaults
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return defaults
    const parsed = JSON.parse(raw) as Partial<T>
    return { ...defaults, ...parsed }
  } catch {
    return defaults
  }
}

export function saveConfig<T extends object>(key: string, value: T): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage full / disabled — silently skip */
  }
}
