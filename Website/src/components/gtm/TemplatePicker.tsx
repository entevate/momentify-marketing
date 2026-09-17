"use client"

/**
 * TemplatePicker - the scaled template grid shared by the pre-Generate Template
 * step in ContentBuilderCanonical and AssetPanel's "Change template" flow.
 *
 * Extracted from AssetPanel so the same grid can be shown before Generate
 * (builder picks the template, AssetPanel auto-fills it on mount) and after
 * (AssetPanel's own "Change template" button, which still opens this grid).
 */

import React from "react"
import { Check } from "lucide-react"
import type { TemplateManifest } from "@/lib/gtm/templates/types"

export default function TemplatePicker({
  solution,
  templates,
  activeId,
  onPick,
  disabled,
  activeLabel = "Selected",
}: {
  solution: string
  templates: TemplateManifest[]
  activeId: string | null
  onPick: (id: string) => void
  disabled?: boolean
  /** badge on the active card: "Selected" (builder) or "Last used" (AssetPanel) */
  activeLabel?: string
}) {
  return (
    <div style={pickerWrap}>
      <div style={pickerHeader}>
        <span style={pickerLabel}>Choose a template</span>
        <span style={pickerHint}>{templates.length} designs · rendered in your pillar palette</span>
      </div>
      <div style={pickerGrid}>
        {templates.map((t) => {
          const isActive = activeId === t.id
          // Each iframe is rendered at NATIVE size so the template's
          // clamp()-based font math hits the sizes designers tuned it for,
          // then CSS-scaled down to fit inside the thumbnail box.
          const is169 = t.aspectRatio === "16:9"
          const nativeW = is169 ? 1920 : 1080
          const nativeH =
            t.aspectRatio === "1:1" ? 1080
            : t.aspectRatio === "3:4" ? 1440
            : 1080 // 16:9
          return (
            <button
              key={t.id}
              onClick={() => onPick(t.id)}
              disabled={disabled}
              style={{
                ...pickerCard,
                borderColor: isActive ? "var(--gtm-accent)" : "var(--gtm-border)",
                boxShadow: isActive ? "0 0 0 2px var(--gtm-accent-bg)" : "none",
              }}
            >
              <div style={pickerThumbWrap(t.aspectRatio)}>
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: nativeW,
                    height: nativeH,
                    transformOrigin: "top left",
                    transform: `scale(${THUMB_WIDTH / nativeW})`,
                    pointerEvents: "none",
                  }}
                >
                  <iframe
                    src={`/api/gtm/template-preview?assetType=${encodeURIComponent(t.assetType)}&templateId=${encodeURIComponent(t.id)}&pillar=${encodeURIComponent(solution)}`}
                    title={`${t.label} thumbnail`}
                    style={{ width: nativeW, height: nativeH, border: "none", display: "block" }}
                  />
                </div>
              </div>
              <div style={{ padding: "8px 10px" }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--gtm-text-primary)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 6 }}>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.label}</span>
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", color: "var(--gtm-text-secondary)", background: "var(--gtm-surface-2)", padding: "2px 6px", borderRadius: 100 }}>
                    {t.aspectRatio}
                  </span>
                </div>
                {isActive && (
                  <div style={{ fontSize: 10, color: "var(--gtm-accent)", marginTop: 4, display: "inline-flex", alignItems: "center", gap: 4 }}>
                    <Check size={10} /> {activeLabel}
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Styles ──────────────────────────────────────────────────────────

const font = "'Inter', system-ui, sans-serif"

const pickerWrap: React.CSSProperties = {
  background: "var(--gtm-bg-page)",
  border: "1px solid var(--gtm-border)",
  borderRadius: 6,
  padding: 12,
  marginBottom: 12,
}

const pickerHeader: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "baseline",
  marginBottom: 10,
  gap: 8,
}

const pickerLabel: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--gtm-text-secondary)",
  fontFamily: font,
}

const pickerHint: React.CSSProperties = {
  fontSize: 11,
  color: "var(--gtm-text-faint)",
  fontFamily: font,
}

// Fixed thumbnail width so we can pre-compute the transform scale.
const THUMB_WIDTH = 200

const pickerGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: `repeat(auto-fill, ${THUMB_WIDTH}px)`,
  gap: 12,
  justifyContent: "start",
}

const pickerCard: React.CSSProperties = {
  padding: 0,
  background: "#fff",
  border: "1px solid var(--gtm-border)",
  borderRadius: 6,
  cursor: "pointer",
  textAlign: "left",
  overflow: "hidden",
  fontFamily: font,
  transition: "border-color 150ms ease, box-shadow 150ms ease",
}

function pickerThumbWrap(aspect: "1:1" | "3:4" | "16:9"): React.CSSProperties {
  let height: number
  if (aspect === "1:1") height = THUMB_WIDTH
  else if (aspect === "3:4") height = Math.round((THUMB_WIDTH * 4) / 3)
  else height = Math.round((THUMB_WIDTH * 9) / 16) // 16:9 landscape
  return {
    width: THUMB_WIDTH,
    height,
    background: "var(--gtm-surface-2)",
    borderBottom: "1px solid var(--gtm-border)",
    overflow: "hidden",
    position: "relative",
  }
}
