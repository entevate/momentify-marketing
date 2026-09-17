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
import { Download, ExternalLink, Loader2, RefreshCw, Upload, Wand2, LayoutGrid } from "lucide-react"
import { allTemplates } from "@/lib/gtm/templates/_registry"
import type { TemplateManifest } from "@/lib/gtm/templates/types"
import TemplatePicker from "@/components/gtm/TemplatePicker"

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
  /** Optional background photo (data URI) + opacity 0-100, applied to template renders */
  media?: { bgImage?: string; bgOpacity?: number }
  /** Template chosen before Generate (builder's pre-Generate Template step) */
  initialTemplateId?: string | null
  /** When true and initialTemplateId is set, fill it automatically on mount instead of opening the picker */
  autoFill?: boolean
  /** Reports the template id whenever a fill completes successfully, so a caller-owned
   *  templateId (e.g. the builder's pre-Generate choice) can follow "Change template" here. */
  onTemplateChange?: (id: string) => void
  /** Optional caller-controlled class for layout tweaks */
  className?: string
}

// After a graphic renders for a real library item, record the reference on the
// item so it self-carries its graphic (thumbnails in Library/History/calendar).
// Skips synthetic draft ids used by the manual builder before a save.
async function stampGraphicRef(
  itemId: string | undefined,
  ref: { blobUrl?: string; assetType?: string; templateId?: string }
) {
  if (!itemId || itemId.startsWith("draft-")) return
  try {
    await fetch(`/api/gtm/content/${encodeURIComponent(itemId)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ref),
    })
  } catch {
    // Best-effort; the graphic still exists in the asset namespace.
  }
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

export default function AssetPanel({ solution, assetType, itemId, briefText, media, initialTemplateId, autoFill, onTemplateChange, className }: AssetPanelProps) {
  const [assetUrl, setAssetUrl] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  // Last filled values, so slot edits and media changes re-render without Claude.
  const [slots, setSlots] = useState<Record<string, string> | null>(null)
  const [cards, setCards] = useState<Record<string, string>[] | null>(null)
  const [draftSlots, setDraftSlots] = useState<Record<string, string>>({})
  const [rerendering, setRerendering] = useState(false)
  const busy = generating || uploading || rerendering

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

  // Latest-value refs so the mount effect below (keyed only on solution/assetType/
  // itemId/isSocialPost) can read the current autoFill / initialTemplateId props
  // without refiring the asset-check fetch on a prop-only change.
  const autoFillRef = useRef(autoFill)
  const initialTemplateIdRef = useRef(initialTemplateId)
  const onTemplateChangeRef = useRef(onTemplateChange)
  useEffect(() => {
    autoFillRef.current = autoFill
    initialTemplateIdRef.current = initialTemplateId
    onTemplateChangeRef.current = onTemplateChange
  }, [autoFill, initialTemplateId, onTemplateChange])

  // True once the mount asset-check has resolved (success or failure), for
  // this item. Gates the controlled-template-change effect below so it never
  // races the mount effect's own first fill, and is reset at the top of the
  // mount effect for each new item (draftAssetId rotates on every Generate).
  const mountedCheckDoneRef = useRef(false)

  // On mount, check whether this item already has an asset on disk.
  //   - Confirmed to not exist (asset-check responded ok): when the caller
  //     pre-chose a template (builder's pre-Generate Template step) and asked
  //     for autoFill, fill that template automatically; otherwise, on
  //     social-post, open the picker so the user is prompted to choose one.
  //   - Asset-check FAILED (non-ok response, or the fetch itself rejected):
  //     never auto-fill — a transient failure must not risk overwriting an
  //     asset that may actually exist. Fall back to opening the picker.
  useEffect(() => {
    let cancelled = false
    mountedCheckDoneRef.current = false
    fetch(
      `/api/gtm/asset-check?solution=${encodeURIComponent(solution)}&assetType=${encodeURIComponent(assetType)}&itemId=${encodeURIComponent(itemId)}`
    )
      .then((r) => (r.ok ? r.json() : { __failed: true as const }))
      .then((d) => {
        if (cancelled) return
        mountedCheckDoneRef.current = true
        if (d?.__failed) {
          if (isSocialPost) setPickerOpen(true)
          return
        }
        if (d?.exists && d?.url) {
          setAssetUrl(d.url)
          setPickerOpen(false)
          // Restore templateId if the server cached it - lets the preview
          // iframe size itself by the template's actual aspect ratio.
          if (d?.templateId) setActiveTemplateId(d.templateId)
          if (isCarousel && Array.isArray(d?.slots)) setCards(d.slots as Record<string, string>[])
          else if (!isCarousel && d?.slots && typeof d.slots === "object" && !Array.isArray(d.slots)) { setSlots(d.slots as Record<string, string>); setDraftSlots(d.slots as Record<string, string>) }
        } else if (autoFillRef.current && initialTemplateIdRef.current) {
          fillRef.current(initialTemplateIdRef.current)
        } else if (isSocialPost) {
          setPickerOpen(true)
        }
      })
      .catch(() => {
        if (cancelled) return
        mountedCheckDoneRef.current = true
        if (isSocialPost) setPickerOpen(true)
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
        const mediaFields = media?.bgImage ? { bgImage: media.bgImage, bgOpacity: media.bgOpacity ?? 100 } : {}
        const payload = isCarousel
          ? { templateId, pillar: solution, briefText, itemId, ...mediaFields }
          : { templateId, assetType: "social-post", pillar: solution, briefText, itemId, ...mediaFields }
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
        if (isCarousel) { setCards(Array.isArray(data.cards) ? data.cards : null); setSlots(null) }
        else {
          const s = data.slots && typeof data.slots === "object" && !Array.isArray(data.slots) ? (data.slots as Record<string, string>) : null
          setSlots(s); setDraftSlots(s ?? {}); setCards(null)
        }
        setPickerOpen(false)
        stampGraphicRef(itemId, { blobUrl: data.url, assetType, templateId })
        // Report the successful fill back to the caller (e.g. the builder's
        // step-3 templateId) so it stays in sync with "Change template" here.
        onTemplateChangeRef.current?.(templateId)
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
    [solution, briefText, itemId, isCarousel, media]
  )

  // Latest-value ref for the mount effect's auto-fill call. handleFillTemplate
  // changes identity on every media/brief change; reading it via a ref (rather
  // than adding it to the mount effect's deps) keeps that effect from refiring
  // the asset-check fetch on those changes.
  const fillRef = useRef(handleFillTemplate)
  useEffect(() => {
    fillRef.current = handleFillTemplate
  }, [handleFillTemplate])

  // Controlled template changes: when the caller updates initialTemplateId
  // after the mount fill/check has already settled (e.g. the builder's step-3
  // card is used after Generate), re-fill with the new template. The mount
  // effect above owns the very first fill for a given item, so this only
  // fires for a genuine change afterward — including "Change template" here,
  // whose onTemplateChange echo back into initialTemplateId is a no-op below
  // because activeTemplateId already matches it.
  useEffect(() => {
    if (!autoFill || !initialTemplateId) return
    if (initialTemplateId === activeTemplateId) return   // already showing it (incl. the echo from onTemplateChange)
    if (busy) return
    if (!mountedCheckDoneRef.current) return             // mount effect owns the first fill
    fillRef.current(initialTemplateId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTemplateId])

  // ─── Re-render without Claude (slot edits, opacity slider) ───────────
  const rerender = useCallback(
    async (nextSlots: Record<string, string> | null, nextCards: Record<string, string>[] | null) => {
      if (!activeTemplateId) return
      if (!isCarousel && !nextSlots) return
      if (isCarousel && !nextCards) return
      setRerendering(true)
      setError(null)
      const abortCtrl = new AbortController()
      const timeoutMs = isCarousel ? 120_000 : 60_000
      const timeoutId = setTimeout(() => abortCtrl.abort(), timeoutMs)
      try {
        const mediaFields = media?.bgImage ? { bgImage: media.bgImage, bgOpacity: media.bgOpacity ?? 100 } : {}
        const endpoint = isCarousel ? "/api/gtm/fill-carousel" : "/api/gtm/fill-template"
        const payload = isCarousel
          ? { templateId: activeTemplateId, pillar: solution, briefText, itemId, cards: nextCards, ...mediaFields }
          : { templateId: activeTemplateId, assetType: "social-post", pillar: solution, briefText, itemId, slots: nextSlots, ...mediaFields }
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: abortCtrl.signal,
        })
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body.error || "Re-render failed")
        }
        const data = await res.json()
        setAssetUrl(withCacheBust(data.url))
        if (!isCarousel) {
          const s = data.slots && typeof data.slots === "object" && !Array.isArray(data.slots) ? (data.slots as Record<string, string>) : null
          if (s) { setSlots(s); setDraftSlots(s) }
        }
        if (isCarousel && Array.isArray(data.cards)) setCards(data.cards)
        stampGraphicRef(itemId, { blobUrl: data.url, assetType, templateId: activeTemplateId })
      } catch (e: unknown) {
        const err = e as { name?: string; message?: string }
        const msg = err?.name === "AbortError"
          ? "Re-render took too long and was cancelled. Try again."
          : err?.message || "Re-render failed."
        setError(msg)
      } finally {
        clearTimeout(timeoutId)
        setRerendering(false)
      }
    },
    [activeTemplateId, isCarousel, media, solution, briefText, itemId, assetType]
  )

  // Media changed after a fill (photo picked/cleared, slider released) → re-render.
  // Keyed off what is actually sent, so a slider move with no photo is a no-op and
  // two different photos of the same byte length still re-render.
  const mediaKey = media?.bgImage
    ? `${media.bgImage.length}:${media.bgImage.slice(-32)}:${media.bgOpacity ?? 100}`
    : "none"
  const lastMediaKey = useRef(mediaKey)
  const pendingMediaRerender = useRef(false)
  useEffect(() => {
    if (lastMediaKey.current === mediaKey) return
    lastMediaKey.current = mediaKey
    if (!assetUrl || !activeTemplateId) return
    if (busy) { pendingMediaRerender.current = true; return }
    void rerender(slots, cards)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaKey])
  // A media change that arrived mid-fill re-renders once the panel is idle again.
  useEffect(() => {
    if (busy || !pendingMediaRerender.current) return
    pendingMediaRerender.current = false
    if (!assetUrl || !activeTemplateId) return
    void rerender(slots, cards)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busy])

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
      stampGraphicRef(itemId, { blobUrl: data.url, assetType, templateId: undefined })
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
        stampGraphicRef(itemId, { blobUrl: data.url, assetType, templateId: undefined })
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
                background: busy ? "var(--gtm-text-faint)" : "var(--gtm-accent)",
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
                background: busy ? "var(--gtm-text-faint)" : "var(--gtm-accent)",
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
        <TemplatePicker solution={solution} templates={socialTemplates} activeId={activeTemplateId} onPick={handleFillTemplate} disabled={busy} activeLabel="Last used" />
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

      {assetUrl && !isCarousel && slots && activeTemplateId && (() => {
        const manifest = socialTemplates.find((t) => t.id === activeTemplateId)
        if (!manifest) return null
        const dirty = manifest.slots.some((s) => (draftSlots[s.key] ?? "") !== (slots[s.key] ?? ""))
        return (
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            <span className="eyebrow">Edit copy</span>
            {manifest.slots.map((s) => (
              <label key={s.key} style={{ display: "block" }}>
                <span className="field-label">{s.label} <span style={{ fontWeight: 400, color: "var(--gtm-text-faint)" }}>· max {s.maxChars}</span></span>
                <input
                  className="input"
                  value={draftSlots[s.key] ?? ""}
                  maxLength={s.maxChars}
                  onChange={(e) => setDraftSlots((d) => ({ ...d, [s.key]: e.target.value }))}
                />
              </label>
            ))}
            <div>
              <button className="btn btn-secondary btn-sm" disabled={!dirty || busy} onClick={() => void rerender(draftSlots, null)}>
                {rerendering ? "Updating…" : "Update preview"}
              </button>
            </div>
          </div>
        )
      })()}
    </div>
  )
}

// ─── Styles ──────────────────────────────────────────────────────────

const panel: React.CSSProperties = {
  border: "1px solid var(--gtm-border)",
  borderRadius: "var(--gtm-radius-card)",
  padding: 14,
  background: "var(--gtm-bg-card)",
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
  background: "var(--gtm-danger-bg)",
  border: "1px solid var(--gtm-danger-border)",
  borderRadius: 6,
  padding: 12,
  fontSize: 13,
  color: "var(--gtm-danger-text)",
  marginTop: 12,
  fontFamily: font,
}

const progressBanner: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: 12,
  background: "var(--gtm-accent-bg)",
  border: "1px solid var(--gtm-accent-bg)",
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 500,
  color: "var(--gtm-accent)",
  fontFamily: font,
  marginBottom: 12,
}

