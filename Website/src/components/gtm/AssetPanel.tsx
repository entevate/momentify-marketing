"use client"

/**
 * AssetPanel - shared asset generate/upload/preview surface.
 *
 * TWO paths depending on assetType:
 *
 *   1. social-post: TEMPLATE-BASED flow. User picks a pre-approved static
 *      HTML template from a grid; Claude fills the slot JSON; server renders
 *      + saves to Blob. ~5-10s per fill, always on-brand.
 *
 *   2. any other assetType (infographic, microsite, carousel, one-pager,
 *      pitch-deck): CLAUDE-GENERATES-HTML flow via /api/gtm/generate-asset-html.
 *      Slower (~30-140s) and more variable, but handles complex asset types
 *      without pre-authored templates.
 *
 * Originally inlined inside ContentLibrary's expanded cards. Now consumed by
 * TaskDetailModal too when a calendar task is library-linked.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Check, Download, ExternalLink, Loader2, RefreshCw, Upload, Wand2, LayoutGrid } from "lucide-react"
import { allTemplates } from "@/lib/gtm/templates/_registry"
import type { TemplateManifest } from "@/lib/gtm/templates/types"

const font = "'Inter', system-ui, sans-serif"

export interface AssetPanelProps {
  /** Momentify solution id (trade-shows / recruiting / field-sales / facilities / events-venues) */
  solution: string
  /** Content type - "social-post" uses templates; others use full HTML generation */
  assetType: string
  /** Library item id - scopes the generated/filled file so each item has its own asset */
  itemId: string
  /** The saved brief text - passed to Claude as fill context */
  briefText: string
  /** Optional caller-controlled class for layout tweaks */
  className?: string
}

/** Append a cache-bust param, respecting existing query strings. */
function withCacheBust(url: string): string {
  const sep = url.includes("?") ? "&" : "?"
  return `${url}${sep}t=${Date.now()}`
}

/** Strip the cache-bust `t=...` param from a URL (for Open-in-new-tab). */
function stripCacheBust(url: string): string {
  return url.replace(/([?&])t=\d+(&|$)/, (_m, before, after) => (after ? before : "")).replace(/[?&]$/, "")
}

function iframeHeightFor(contentType: string): number {
  if (contentType === "microsite") return 720
  if (contentType === "carousel") return 520
  if (contentType === "pitch-deck") return 640
  if (contentType === "social-post") return 560
  return 600
}

export default function AssetPanel({ solution, assetType, itemId, briefText, className }: AssetPanelProps) {
  const [assetUrl, setAssetUrl] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const busy = generating || uploading

  const isCarousel = assetType === "carousel"
  // "Templated" mode = template picker + slot-fill flow. Both social-post
  // and carousel render through social-post template families; carousel
  // restricts to 1:1 templates and routes to /api/gtm/fill-carousel.
  const isSocialPost = assetType === "social-post" || isCarousel
  const socialTemplates: TemplateManifest[] = useMemo(
    () =>
      allTemplates
        .filter((t) => t.assetType === "social-post")
        .filter((t) => (isCarousel ? t.aspectRatio === "1:1" : true)),
    [isCarousel]
  )

  // On mount, check whether this item already has an asset on disk.
  // If it doesn't AND we're on social-post, open the picker so the user
  // is prompted to choose a template right away.
  useEffect(() => {
    let cancelled = false
    fetch(
      `/api/gtm/asset-check?solution=${encodeURIComponent(solution)}&assetType=${encodeURIComponent(assetType)}&itemId=${encodeURIComponent(itemId)}`
    )
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (cancelled) return
        if (d?.exists && d?.url) {
          setAssetUrl(d.url)
          setPickerOpen(false)
          // Restore templateId if the server cached it - lets the preview
          // iframe size itself by the template's actual aspect ratio.
          if (d?.templateId) setActiveTemplateId(d.templateId)
        } else if (isSocialPost) {
          setPickerOpen(true)
        }
      })
      .catch(() => {
        if (isSocialPost && !cancelled) setPickerOpen(true)
      })
    return () => {
      cancelled = true
    }
  }, [solution, assetType, itemId, isSocialPost])

  // ─── Template fill (social-post + carousel) ─────────────────────────
  // Carousel routes through /api/gtm/fill-carousel, which fans the chosen
  // 1:1 template into 6 slot-filled variants and assembles a swipeable
  // shell. Social-post stays on /api/gtm/fill-template (single render).
  const handleFillTemplate = useCallback(
    async (templateId: string) => {
      setGenerating(true)
      setError(null)
      setActiveTemplateId(templateId)
      const abortCtrl = new AbortController()
      // Carousel = 1 Claude call producing 6 cards, plus 6 + 1 blob writes.
      // Bump timeout to 120s vs social-post's 60s.
      const timeoutMs = isCarousel ? 120_000 : 60_000
      const timeoutId = setTimeout(() => abortCtrl.abort(), timeoutMs)
      try {
        const endpoint = isCarousel ? "/api/gtm/fill-carousel" : "/api/gtm/fill-template"
        const payload = isCarousel
          ? { templateId, pillar: solution, briefText, itemId }
          : { templateId, assetType: "social-post", pillar: solution, briefText, itemId }
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: abortCtrl.signal,
        })
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body.error || "Template fill failed")
        }
        const data = await res.json()
        setAssetUrl(withCacheBust(data.url))
        setPickerOpen(false)
      } catch (e: unknown) {
        const err = e as { name?: string; message?: string }
        const msg = err?.name === "AbortError"
          ? "Template fill took too long and was cancelled. Try again."
          : err?.message || "Template fill failed."
        setError(msg)
      } finally {
        clearTimeout(timeoutId)
        setGenerating(false)
      }
    },
    [solution, briefText, itemId, isCarousel]
  )

  // ─── Claude full-HTML generation (non-social-post asset types) ──────
  const handleGenerate = useCallback(async () => {
    setGenerating(true)
    setError(null)
    const timeoutMs = assetType === "pitch-deck" ? 240_000 : 150_000
    const abortCtrl = new AbortController()
    const timeoutId = setTimeout(() => abortCtrl.abort(), timeoutMs)
    try {
      const res = await fetch("/api/gtm/generate-asset-html", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief: briefText, assetType, solution, itemId }),
        signal: abortCtrl.signal,
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || "Generation failed")
      }
      const data = await res.json()
      setAssetUrl(withCacheBust(data.url))
    } catch (e: unknown) {
      const err = e as { name?: string; message?: string }
      const msg = err?.name === "AbortError"
        ? `Generation took longer than ${timeoutMs / 1000}s and was cancelled.`
        : err?.message || "Generation failed."
      setError(msg)
    } finally {
      clearTimeout(timeoutId)
      setGenerating(false)
    }
  }, [assetType, briefText, itemId, solution])

  function openFilePicker() {
    const input = fileInputRef.current
    if (input) {
      input.value = ""
      input.click()
    }
  }

  const handleFilePicked = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      setUploading(true)
      setError(null)
      try {
        const htmlContent = await file.text()
        if (!htmlContent.includes("<!doctype") && !htmlContent.includes("<!DOCTYPE") && !htmlContent.includes("<html")) {
          throw new Error("File doesn't look like HTML - missing <!DOCTYPE> or <html>.")
        }
        const res = await fetch("/api/gtm/asset-upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ solution, assetType, htmlContent, itemId }),
        })
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body.error || "Upload failed")
        }
        const data = await res.json()
        setAssetUrl(withCacheBust(data.url))
        setPickerOpen(false)
      } catch (e: unknown) {
        const err = e as { message?: string }
        setError(err?.message || "Upload failed.")
      } finally {
        setUploading(false)
      }
    },
    [assetType, itemId, solution]
  )

  // ─── Render ────────────────────────────────────────────────────────
  return (
    <div className={className} style={panel}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
          marginBottom: assetUrl || busy || pickerOpen ? 12 : 0,
        }}
      >
        <div>
          <h4 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "var(--gtm-text-primary)", fontFamily: font }}>
            Visual Asset
          </h4>
          <p style={{ margin: "2px 0 0 0", fontSize: 11, color: "var(--gtm-text-faint)", fontFamily: font }}>
            {busy
              ? generating
                ? isCarousel
                  ? "Claude is filling 6 carousel cards. Takes 15 to 30 seconds."
                  : isSocialPost
                    ? "Claude is filling the template. Takes 5 to 15 seconds."
                    : "Claude is rendering a fully-branded graphic. Takes 30 to 140 seconds."
                : "Uploading..."
              : assetUrl
                ? isCarousel
                  ? "Preview below. Pick a different 1:1 template to regenerate the 6 cards."
                  : isSocialPost
                    ? "Preview below. Pick a different template or upload a replacement any time."
                    : "Preview below. Regenerate or upload a replacement any time."
                : isCarousel
                  ? "Pick a 1:1 template below - Claude fills 6 distinct cards using this brief."
                  : isSocialPost
                    ? "Pick a template below - Claude fills the slots with copy from this brief."
                    : "Generate a rendered graphic from this brief, or upload your own HTML."}
          </p>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {isSocialPost ? (
            <button
              onClick={() => setPickerOpen((v) => !v)}
              disabled={busy}
              style={{
                ...smallBtn,
                background: busy ? "var(--gtm-text-faint)" : "#00BBA5",
                color: "#fff",
                borderColor: "transparent",
                cursor: busy ? "not-allowed" : "pointer",
              }}
            >
              <LayoutGrid size={12} />
              {assetUrl ? "Change template" : "Pick template"}
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={busy}
              style={{
                ...smallBtn,
                background: busy ? "var(--gtm-text-faint)" : "#00BBA5",
                color: "#fff",
                borderColor: "transparent",
                cursor: busy ? "not-allowed" : "pointer",
              }}
            >
              {generating ? (
                <>
                  <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} />
                  Generating...
                </>
              ) : assetUrl ? (
                <>
                  <RefreshCw size={12} />
                  Regenerate
                </>
              ) : (
                <>
                  <Wand2 size={12} />
                  Generate Asset
                </>
              )}
            </button>
          )}
          <button onClick={openFilePicker} disabled={busy} style={{ ...smallBtn, cursor: busy ? "not-allowed" : "pointer" }}>
            {uploading ? (
              <>
                <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={12} />
                Upload HTML
              </>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".html,text/html"
            style={{ display: "none" }}
            onChange={handleFilePicked}
          />
          {/* Single-graphic download (social-post and any other non-carousel
              templated asset) -> server-rendered PNG via headless Chromium. */}
          {assetUrl && !isCarousel && (
            <a
              href={`/api/gtm/render-png?solution=${encodeURIComponent(solution)}&assetType=${encodeURIComponent(assetType)}&itemId=${encodeURIComponent(itemId)}`}
              style={{ ...smallBtn, textDecoration: "none" }}
              title="Render this graphic as a 1080x1080 PNG"
            >
              <Download size={12} />
              Download .png
            </a>
          )}
          {/* Carousel zip - 6 PNGs + 6 HTMLs + the swipeable shell. */}
          {assetUrl && isCarousel && (
            <a
              href={`/api/gtm/carousel-download?solution=${encodeURIComponent(solution)}&itemId=${encodeURIComponent(itemId)}&format=both`}
              style={{ ...smallBtn, textDecoration: "none" }}
              title="Download a zip with 6 PNG cards, the source HTMLs, and the swipeable carousel"
            >
              <Download size={12} />
              Download .zip
            </a>
          )}
        </div>
      </div>

      {error && <div style={errBanner}>{error}</div>}

      {/* Claude-fill progress spinner (social-post shows template card highlighted) */}
      {busy && generating && isSocialPost && activeTemplateId && (
        <div style={progressBanner}>
          <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
          {isCarousel ? "Filling 6 cards from " : "Filling template "}
          <strong style={{ marginLeft: 4 }}>{activeTemplateId}</strong>…
        </div>
      )}

      {/* Template picker (social-post only) */}
      {isSocialPost && pickerOpen && !busy && (
        <div style={pickerWrap}>
          <div style={pickerHeader}>
            <span style={pickerLabel}>Choose a template</span>
            <span style={pickerHint}>{socialTemplates.length} designs · rendered in your pillar palette</span>
          </div>
          <div style={pickerGrid}>
            {socialTemplates.map((t) => {
              const isActive = activeTemplateId === t.id
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
                  onClick={() => handleFillTemplate(t.id)}
                  style={{
                    ...pickerCard,
                    borderColor: isActive ? "#00BBA5" : "var(--gtm-border)",
                    boxShadow: isActive ? "0 0 0 2px rgba(36,123,150,0.16)" : "none",
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
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#181818", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 6 }}>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.label}</span>
                      <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", color: "#6b6b6b", background: "#f6f8fb", padding: "2px 6px", borderRadius: 100 }}>
                        {t.aspectRatio}
                      </span>
                    </div>
                    {isActive && (
                      <div style={{ fontSize: 10, color: "#00BBA5", marginTop: 4, display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <Check size={10} /> Last used
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {assetUrl && !busy && (() => {
        // Default to 1:1 when social-post has no known templateId (e.g., a
        // previously-filled asset from before we started persisting templateId).
        const activeTemplate = isSocialPost && activeTemplateId
          ? socialTemplates.find((t) => t.id === activeTemplateId)
          : null
        const socialAspect: "1:1" | "3:4" | "16:9" | null = isSocialPost
          ? (activeTemplate?.aspectRatio ?? "1:1")
          : null
        if (socialAspect) {
          return <SocialPostPreview assetUrl={assetUrl} aspect={socialAspect} />
        }
        // Non-social-post: fall back to fixed-height.
        return (
          <div style={{ background: "var(--gtm-bg-page)", border: "1px solid var(--gtm-border)", borderRadius: 6, overflow: "hidden" }}>
            <iframe
              key={assetUrl}
              src={assetUrl}
              title={`${assetType} preview`}
              style={{ width: "100%", height: iframeHeightFor(assetType), border: "none", display: "block", background: "#fff" }}
            />
          </div>
        )
      })()}
    </div>
  )
}

// ─── Styles ──────────────────────────────────────────────────────────

const panel: React.CSSProperties = {
  border: "1px solid var(--gtm-border)",
  borderRadius: 6,
  padding: 14,
  background: "#ffffff",
}

const smallBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  height: 30,
  padding: "0 10px",
  fontSize: 11,
  fontWeight: 600,
  fontFamily: font,
  border: "1px solid var(--gtm-border)",
  background: "#fff",
  color: "var(--gtm-text-secondary)",
  borderRadius: 6,
  cursor: "pointer",
}

/**
 * Renders a filled social-post asset at its native design viewport, then
 * CSS-scales the iframe to fit the parent width.
 */
function SocialPostPreview({ assetUrl, aspect }: { assetUrl: string; aspect: "1:1" | "3:4" | "16:9" }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  const nativeW = aspect === "16:9" ? 1920 : 1080
  const nativeH = aspect === "1:1" ? 1080 : aspect === "3:4" ? 1440 : 1080

  const maxW = aspect === "1:1" ? 540 : aspect === "3:4" ? 480 : 720

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const update = () => {
      const w = el.clientWidth
      if (w > 0) setScale(w / nativeW)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [nativeW])

  const cssAspect = aspect === "1:1" ? "1 / 1" : aspect === "3:4" ? "3 / 4" : "16 / 9"

  return (
    <div
      ref={wrapRef}
      style={{
        background: "var(--gtm-bg-page)",
        border: "1px solid var(--gtm-border)",
        borderRadius: 6,
        overflow: "hidden",
        maxWidth: maxW,
        width: "100%",
        aspectRatio: cssAspect,
        margin: "0 auto",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: nativeW,
          height: nativeH,
          transformOrigin: "top left",
          transform: `scale(${scale})`,
        }}
      >
        <iframe
          key={assetUrl}
          src={assetUrl}
          title="Social post preview"
          style={{ width: nativeW, height: nativeH, border: "none", display: "block", background: "#fff" }}
        />
      </div>
    </div>
  )
}

const errBanner: React.CSSProperties = {
  background: "rgba(239, 68, 68, 0.08)",
  border: "1px solid rgba(239, 68, 68, 0.3)",
  borderRadius: 6,
  padding: 12,
  fontSize: 13,
  color: "#b91c1c",
  marginTop: 12,
  fontFamily: font,
}

const progressBanner: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: 12,
  background: "rgba(0, 187, 165, 0.06)",
  border: "1px solid rgba(0, 187, 165, 0.2)",
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 500,
  color: "#00BBA5",
  fontFamily: font,
  marginBottom: 12,
}

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
  color: "#6b6b6b",
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
    background: "#f6f8fb",
    borderBottom: "1px solid var(--gtm-border)",
    overflow: "hidden",
    position: "relative",
  }
}
