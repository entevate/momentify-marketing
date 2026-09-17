"use client"

/**
 * TemplatePreviewModal - the enlarged template preview the fleet's template
 * galleries open on click. Renders the template at its native stage size,
 * scaled to fit the viewport, with the builder's background photo applied,
 * plus the manifest's description, aspect, layout viewport, and slot list.
 * "Use this template" hands the choice back to the picker.
 */

import React, { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import type { TemplateManifest } from "@/lib/gtm/templates/types"
import { applyMediaToFrame, nativeSize, templatePreviewSrc, type PickerMedia } from "@/components/gtm/template-frame"

const font = "var(--gtm-font-body)"

export default function TemplatePreviewModal({
  manifest,
  solution,
  media,
  isActive,
  onUse,
  onClose,
}: {
  manifest: TemplateManifest
  solution: string
  media?: PickerMedia
  isActive: boolean
  /** Omitted while the picker is disabled (a fill is in flight). */
  onUse?: () => void
  onClose: () => void
}) {
  const size = nativeSize(manifest.aspectRatio)
  const frameRef = useRef<HTMLIFrameElement | null>(null)
  const boxRef = useRef<HTMLDivElement | null>(null)
  const [scale, setScale] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  // Scale the native-size iframe to whatever width the box ends up with.
  useEffect(() => {
    const el = boxRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 0
      // Never leave the frame hidden: a 0 measurement falls back to 1:1.
      setScale(w > 0 ? w / size.width : 1)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [size.width, mounted])

  useEffect(() => {
    if (frameRef.current) applyMediaToFrame(frameRef.current, media)
  }, [media])

  if (!mounted) return null

  // Fit both directions: width-bound for landscape, height-bound for portrait.
  const boxWidth = `min(920px, 100%, calc(60vh * ${size.width} / ${size.height}))`

  return createPortal(
    // data-theme: the shell sets it on a wrapper <div>, not <html>, and the
    // theme's classes (.btn, .mono, .field-label, .section-note) are scoped to
    // it — a portal to <body> escapes that scope unless the backdrop re-asserts it.
    <div
      data-theme="light"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      style={backdrop}
    >
      <div role="dialog" aria-modal="true" aria-label={`${manifest.label} preview`} style={panel}>
        <div style={header}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap", minWidth: 0 }}>
            <span style={{ fontSize: 17, fontWeight: 600, color: "var(--gtm-text-primary)" }}>{manifest.label}</span>
            <span className="mono" style={{ fontSize: 11, color: "var(--gtm-text-muted)" }}>{manifest.id}</span>
          </div>
          <button type="button" autoFocus onClick={onClose} aria-label="Close preview" style={closeButton}>
            <X size={16} />
          </button>
        </div>

        <div style={body}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div ref={boxRef} style={{ width: boxWidth, aspectRatio: `${size.width} / ${size.height}`, position: "relative", overflow: "hidden", borderRadius: 8, border: "1px solid var(--gtm-border)", background: "var(--gtm-surface-2)" }}>
              <div style={{ position: "absolute", top: 0, left: 0, width: size.width, height: size.height, transformOrigin: "top left", transform: `scale(${scale})`, visibility: scale ? "visible" : "hidden" }}>
                <iframe
                  ref={frameRef}
                  onLoad={(e) => applyMediaToFrame(e.currentTarget, media)}
                  src={templatePreviewSrc(manifest, solution)}
                  title={`${manifest.label} enlarged preview`}
                  style={{ width: size.width, height: size.height, border: "none", display: "block" }}
                />
              </div>
            </div>
          </div>

          <p className="section-note" style={{ margin: 0 }}>{manifest.description}</p>

          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <Meta label="Aspect" value={manifest.aspectRatio} />
            <Meta label="Layout viewport" value={`${size.width}×${size.height}`} />
            <Meta label="Slots" value={String(manifest.slots.length)} />
          </div>

          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {manifest.slots.map((slot) => (
              <span key={slot.key} className="mono" title={`${slot.label} · ${slot.kind}`} style={slotChip}>
                {slot.key}
                <span style={{ color: "var(--gtm-accent-ink)", marginLeft: 4 }}>{slot.maxChars}</span>
              </span>
            ))}
          </div>
        </div>

        <div style={footer}>
          <button type="button" className="btn btn-tertiary" onClick={onClose}>
            Close
          </button>
          {onUse && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                onUse()
                onClose()
              }}
            >
              {isActive ? "Keep this template" : "Use this template"}
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <span className="field-label" style={{ marginBottom: 0 }}>{label}</span>
      <span className="mono" style={{ fontSize: 12, color: "var(--gtm-text-primary)" }}>{value}</span>
    </div>
  )
}

// ─── Styles ──────────────────────────────────────────────────────────

// Scrim: text-primary navy at 60% — the shell's modals use the same literal
// pattern (no scrim token exists in gtm-theme.css).
const backdrop: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(6, 19, 65, 0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 16,
  zIndex: 1100, // above the shell's mobile drawer (1000) and app bar (500)
  fontFamily: font,
}

const panel: React.CSSProperties = {
  background: "var(--gtm-bg-card)",
  border: "1px solid var(--gtm-border)",
  borderRadius: "var(--gtm-radius-card)",
  width: "min(1040px, 100%)",
  maxHeight: "92vh",
  display: "flex",
  flexDirection: "column",
  boxShadow: "var(--gtm-shadow-hover)",
}

const header: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  padding: "16px 20px",
  borderBottom: "1px solid var(--gtm-border)",
}

const body: React.CSSProperties = {
  padding: 20,
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: 16,
}

const footer: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 8,
  padding: "12px 20px",
  borderTop: "1px solid var(--gtm-border)",
}

const closeButton: React.CSSProperties = {
  width: 30,
  height: 30,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
  borderRadius: "var(--gtm-radius-control)",
  border: "1px solid var(--gtm-border)",
  background: "transparent",
  color: "var(--gtm-text-secondary)",
  cursor: "pointer",
  flex: "none",
}

const slotChip: React.CSSProperties = {
  fontSize: 10,
  padding: "3px 7px",
  borderRadius: 5,
  background: "var(--gtm-surface-2)",
  border: "1px solid var(--gtm-border)",
  color: "var(--gtm-text-muted)",
}
