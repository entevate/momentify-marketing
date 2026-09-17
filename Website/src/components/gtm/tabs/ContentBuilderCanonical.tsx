"use client"

import React, { useState, useMemo, useEffect, useRef } from "react"
import { Loader2, Copy, Save, Check, ExternalLink, RefreshCw, Send, Globe, Terminal, Trash2, Download, CalendarPlus, ImagePlus, X } from "lucide-react"
import type { VerticalOption } from "./SolutionTabs"
import { dispatchLibraryChanged } from "./SolutionTabs"
import AssetPanel from "@/components/gtm/AssetPanel"
import CaptionsPanel from "@/components/gtm/CaptionsPanel"
import { solutionPersonas } from "@/lib/gtm/builder-prompts"

// ─── HTML-asset generation contract ───────────────────────────────────────
// Content types that have a one-click HTML asset pipeline (calls /api/gtm/generate-asset-html).
// social-post AND carousel use the template-selector flow instead (see isSocialPost below).
const ONE_CLICK_HTML_ASSETS = new Set(["infographic", "microsite", "one-pager", "pitch-deck"])

const CONTENT_TYPES: { value: string; label: string; description: string; visual: boolean }[] = [
  { value: "social-post", label: "Social Post", description: "LinkedIn, Instagram, and X versions", visual: true },
  { value: "carousel", label: "Social Carousel", description: "6-card LinkedIn/Instagram carousel", visual: true },
  { value: "infographic", label: "Infographic", description: "6-panel data-driven asset", visual: true },
  { value: "microsite", label: "Microsite", description: "Landing page structure + palette", visual: true },
  { value: "one-pager", label: "Sales One-Pager", description: "Leave-behind PDF content", visual: true },
  { value: "pitch-deck", label: "Pitch Deck", description: "8-slide presentation script", visual: true },
  { value: "cold-emails", label: "Cold Email Sequence", description: "3-touch outreach sequence", visual: false },
  { value: "linkedin-dm", label: "LinkedIn DM Sequence", description: "3-message conversation flow", visual: false },
  { value: "lead-magnet", label: "Lead Magnet Outline", description: "Gated PDF/guide structure", visual: false },
  { value: "discovery-script", label: "Discovery Call Script", description: "Sales call + objection handling", visual: false },
  { value: "partner-pitch", label: "Partner Pitch", description: "Channel/partnership narrative", visual: false },
  { value: "battle-card", label: "Battle Card", description: "Competitive positioning one-pager", visual: false },
]

const MAX_BG_BYTES = 3 * 1024 * 1024

// Height of the layout's sticky mobile app bar (src/app/gtm/layout.tsx); the pinned
// Result must sit below it or it scrolls underneath. Keep in sync with that bar.
const MOBILE_BAR_H = 54

function fileToDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result))
    r.onerror = () => reject(new Error("Could not read the image"))
    r.readAsDataURL(file)
  })
}

interface ContentBuilderProps {
  solution: string
  solutionLabel: string
  verticals: VerticalOption[]
}

export default function ContentBuilderCanonical({ solution, solutionLabel, verticals }: ContentBuilderProps) {
  const [vertical, setVertical] = useState(verticals[0]?.id ?? "")
  const personaOptions = solutionPersonas[solution] ?? solutionPersonas.general ?? []
  const [persona, setPersona] = useState<string>(personaOptions[0]?.id ?? "auto")
  const [motion, setMotion] = useState<"direct" | "partner">("direct")
  // Default format is unchanged from the previous builder (Cold Email Sequence).
  const [contentType, setContentType] = useState("cold-emails")
  const [additionalContext, setAdditionalContext] = useState("")
  const [competitor, setCompetitor] = useState("")
  const [loading, setLoading] = useState(false)
  const [generated, setGenerated] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activePlatform, setActivePlatform] = useState<"linkedin" | "instagram" | "twitter">("linkedin")
  const [draftAssetId, setDraftAssetId] = useState<string | null>(null)

  // Background photo (data URI) + opacity 0-100 for template renders. Part of the session.
  const [bgImage, setBgImage] = useState<string | null>(null)
  const [bgOpacity, setBgOpacity] = useState(100)
  // Slider drags update `sliderValue`; `bgOpacity` (what AssetPanel re-renders on) commits on release.
  const [sliderValue, setSliderValue] = useState(100)
  const [bgError, setBgError] = useState<string | null>(null)
  const bgInputRef = useRef<HTMLInputElement | null>(null)

  // Schedule-on-calendar flow state (social-post only for now).
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [scheduleBusy, setScheduleBusy] = useState(false)
  const [scheduled, setScheduled] = useState(false)
  const [scheduleDate, setScheduleDate] = useState<string>(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
  })

  // Mobile: preview pins to the top with a show/hide chevron (fleet pattern).
  const [isMobile, setIsMobile] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(true)
  useEffect(() => {
    const c = () => setIsMobile(window.innerWidth < 768)
    c()
    window.addEventListener("resize", c)
    return () => window.removeEventListener("resize", c)
  }, [])

  // ─── Session persistence ─────────────────────────────────────────────
  const storageKey = `gtm:cb-session:${solution}`
  const hydrated = useRef(false)

  useEffect(() => {
    hydrated.current = false
    if (typeof window === "undefined") return
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) {
        const s = JSON.parse(raw) as Record<string, unknown>
        if (typeof s.vertical === "string") setVertical(s.vertical)
        if (typeof s.persona === "string") setPersona(s.persona)
        if (s.motion === "direct" || s.motion === "partner") setMotion(s.motion)
        if (typeof s.contentType === "string") setContentType(s.contentType)
        if (typeof s.additionalContext === "string") setAdditionalContext(s.additionalContext)
        if (typeof s.competitor === "string") setCompetitor(s.competitor)
        if (typeof s.generated === "string") setGenerated(s.generated)
        if (typeof s.draftAssetId === "string") setDraftAssetId(s.draftAssetId)
        if (typeof s.bgImage === "string") setBgImage(s.bgImage)
        if (typeof s.bgOpacity === "number") { setBgOpacity(s.bgOpacity); setSliderValue(s.bgOpacity) }
      }
    } catch {
      /* corrupted storage is non-fatal */
    }
    hydrated.current = true
  }, [solution, storageKey])

  useEffect(() => {
    if (!hydrated.current || typeof window === "undefined") return
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ vertical, persona, motion, contentType, additionalContext, competitor, generated, draftAssetId, bgImage, bgOpacity })
      )
    } catch {
      /* storage full / disabled - silently skip */
    }
  }, [storageKey, vertical, persona, motion, contentType, additionalContext, competitor, generated, draftAssetId, bgImage, bgOpacity])

  function handleClearSession() {
    setVertical(verticals[0]?.id ?? "")
    setPersona(personaOptions[0]?.id ?? "auto")
    setMotion("direct")
    setContentType("cold-emails")
    setAdditionalContext("")
    setCompetitor("")
    setGenerated(null)
    setDraftAssetId(null)
    setBgImage(null)
    setBgOpacity(100)
    setSliderValue(100)
    setError(null)
    setSaved(false)
    setCopied(false)
    try { localStorage.removeItem(storageKey) } catch { /* ignore */ }
  }

  const showCompetitor = contentType === "battle-card"
  const isSocialPost = contentType === "social-post" || contentType === "carousel"
  const isOneClickHtmlAsset = ONE_CLICK_HTML_ASSETS.has(contentType)
  const currentType = CONTENT_TYPES.find((c) => c.value === contentType)

  // ─── HTML asset generation state ─────────────────────────────────────────
  const [generatingAsset, setGeneratingAsset] = useState<string | null>(null)
  const [assetUrl, setAssetUrl] = useState<string | null>(null)
  const [assetError, setAssetError] = useState<string | null>(null)

  // Microsite publish modal
  const [publishOpen, setPublishOpen] = useState(false)
  const [publishSlug, setPublishSlug] = useState("")
  const [publishTitle, setPublishTitle] = useState("")
  const [publishDesc, setPublishDesc] = useState("")
  const [publishing, setPublishing] = useState(false)
  const [publishResult, setPublishResult] = useState<{ blobUrl?: string; error?: string } | null>(null)

  const socialSections = useMemo(() => {
    if (!generated || !isSocialPost) return null
    const result: Record<"linkedin" | "instagram" | "twitter", string> = { linkedin: "", instagram: "", twitter: "" }
    const linkedinMatch = generated.match(/---\s*LINKEDIN\s*---([\s\S]*?)(?=---\s*(?:INSTAGRAM|TWITTER)\s*---|$)/i)
    const instagramMatch = generated.match(/---\s*INSTAGRAM\s*---([\s\S]*?)(?=---\s*(?:LINKEDIN|TWITTER)\s*---|$)/i)
    const twitterMatch = generated.match(/---\s*TWITTER\s*---([\s\S]*?)(?=---\s*(?:LINKEDIN|INSTAGRAM)\s*---|$)/i)
    if (linkedinMatch) result.linkedin = linkedinMatch[1].trim()
    if (instagramMatch) result.instagram = instagramMatch[1].trim()
    if (twitterMatch) result.twitter = twitterMatch[1].trim()
    return result
  }, [generated, isSocialPost])

  const socialCaptions = useMemo<Record<string, string> | null>(() => {
    if (!socialSections) return null
    const out: Record<string, string> = {}
    if (socialSections.linkedin) out.linkedin = socialSections.linkedin
    if (socialSections.instagram) out.instagram = socialSections.instagram
    if (socialSections.twitter) out.x = socialSections.twitter
    if (Object.keys(out).length === 0 && generated) out.linkedin = generated.trim()
    return Object.keys(out).length ? out : null
  }, [socialSections, generated])

  useEffect(() => {
    if (isSocialPost) setActivePlatform("linkedin")
  }, [generated, isSocialPost])

  // Reset HTML asset state whenever the brief or content type changes
  useEffect(() => {
    setAssetUrl(null)
    setAssetError(null)
    setGeneratingAsset(null)
    setPublishResult(null)
    setPublishOpen(false)
  }, [generated, contentType, solution])

  // Switching format drops the photo (it belongs to a template render). Done in the
  // chip click handler — not an effect — so session hydration never wipes a restored photo.
  function selectFormat(value: string) {
    if (value === contentType) return
    setContentType(value)
    setBgImage(null)
    setBgOpacity(100)
    setSliderValue(100)
    setBgError(null)
  }

  const rawContent = useMemo(() => {
    if (!generated) return ""
    if (isSocialPost && socialSections) {
      const section = socialSections[activePlatform]
      return section || generated
    }
    return generated
  }, [generated, isSocialPost, socialSections, activePlatform])

  const displayContent = useMemo(() => {
    if (!rawContent) return ""
    const LABEL_PATTERN = /^(HEADLINE|SUBHEAD|POST|SUBJECT|BODY|CTA|TITLE|SUBTITLE|HOOK|SECTIONS|CONCLUSION|GATE REQUIREMENT|OPENING|DISCOVERY QUESTIONS|TRANSITION|TOP OBJECTIONS|SOFT CLOSE|PAGE TITLE|META DESCRIPTION|DESIGN NOTES|PROOF POINT|LAYOUT|SERIES_CAPTION|COMPETITOR SNAPSHOT|WHEN YOU HEAR THEM|HOW TO RESPOND|THEIR STRENGTHS|OUR ADVANTAGE|KILLER QUESTION|PROOF POINT TO USE|THE PROBLEM|OUR SERVICES APPROACH|HOW WE ENGAGE|CALL TO ACTION|OPENING PARAGRAPH|SECOND PARAGRAPH|THIRD PARAGRAPH|ONE-LINER|HERO SECTION|EMAIL [0-9]+ - Day [0-9]+)\s*:/gim
    return rawContent
      .replace(LABEL_PATTERN, (_m, label) => `**${label}:**`)
      .replace(/(?<!\n)\n(?!\n)/g, "  \n")
  }, [rawContent])

  const pitchDeckPrompt = useMemo(() => {
    return `Build a pitch deck HTML file at public/gtm/${solution}-pitch-deck.html for Momentify.

Design-system constraints:
- Font: Inter (Google Fonts); H1 clamp(32px,5vw,44px)/300/-0.02em, H2 clamp(22px,3vw,28px)/300/-0.01em, body 13-15px
- Cards: border-radius 6px, 1px solid #dde6f0, padding 20-24px
- Buttons: height 38px, border-radius 6px, font-size 13px/weight 600
- Text tokens: text-primary #181818, text-secondary #6b6b6b, border #dde6f0, bg-card #fff

Voice: solutions-led (activate, measure, grow). Momentify is an experiential marketing activation platform.

8 slides, 16:9 aspect ratio, keyboard navigation (ArrowLeft/Right), self-contained HTML + inline CSS + vanilla JS.

Brief to ground every slide:
---
${rawContent || "[Generate the text brief in Content Builder first, then paste it here]"}
---`
  }, [solution, rawContent])

  // ─── Handlers (unchanged behavior) ───────────────────────────────────────
  async function handleGenerate() {
    setLoading(true)
    setError(null)
    setGenerated(null)
    setSaved(false)
    try {
      const res = await fetch("/api/gtm/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          solution, vertical, persona, motion, contentType,
          additionalContext: additionalContext || undefined,
          competitor: showCompetitor ? competitor || undefined : undefined,
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || "Generation failed")
      }
      const data = await res.json()
      const content: string = data.content || ""
      setGenerated(content)
      if (!content) setError("The model returned no content. Try a more specific brief.")
      setDraftAssetId(`draft-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`)
    } catch (e: unknown) {
      const err = e as { message?: string }
      setError(err.message || "Generation failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    if (!rawContent) return
    try {
      await navigator.clipboard.writeText(rawContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* ignore */ }
  }

  async function handleSave(): Promise<string | null> {
    if (!generated) return null
    try {
      const res = await fetch("/api/gtm/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ solution, contentType, motion, content: generated, tags: [vertical], createdAt: new Date().toISOString(), kept: true }),
      })
      if (!res.ok) throw new Error("Save failed")
      const { id: libraryItemId } = await res.json()
      if (isSocialPost && draftAssetId && libraryItemId) {
        try {
          await fetch("/api/gtm/asset-link", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pillar: solution, assetType: contentType === "carousel" ? "carousel" : "social-post", fromItemId: draftAssetId, toItemId: libraryItemId }),
          })
        } catch { /* Non-fatal; the brief is saved. */ }
      }
      setSaved(true)
      dispatchLibraryChanged(solution)
      setTimeout(() => setSaved(false), 2500)
      return libraryItemId ?? null
    } catch {
      setError("Failed to save to Library. Is GTM auth active?")
      return null
    }
  }

  async function handleDownloadGraphic() {
    if (!isSocialPost || !draftAssetId) return
    try {
      const downloadAssetType = contentType === "carousel" ? "carousel" : "social-post"
      const url = `/api/gtm/asset-preview?solution=${encodeURIComponent(solution)}&assetType=${downloadAssetType}&itemId=${encodeURIComponent(draftAssetId)}`
      const res = await fetch(url, { cache: "no-store" })
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`)
      const html = await res.text()
      const blob = new Blob([html], { type: "text/html" })
      const a = document.createElement("a")
      a.href = URL.createObjectURL(blob)
      a.download = `momentify-${solution}-${contentType}-${Date.now()}.html`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(a.href), 1000)
    } catch (e: unknown) {
      const err = e as { message?: string }
      setError(err?.message || "Download failed.")
    }
  }

  async function handleSchedule(dateIso: string) {
    if (!dateIso) return
    setScheduleBusy(true)
    try {
      const libraryItemId = await handleSave()
      if (!libraryItemId) throw new Error("Library save failed")
      const titleSeed = generated!.split("\n").find((l) => l.trim().length > 8) || contentType
      const taskBody = {
        id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        title: titleSeed.replace(/[#*:]+/g, "").trim().slice(0, 80),
        category: contentType, solution, date: dateIso, duration: 30, completed: false,
        description: `Scheduled from Content Builder.`, sortOrder: Date.now(), libraryItemId,
        assetType: contentType, motion,
      }
      const res = await fetch("/api/gtm/calendar", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(taskBody) })
      if (!res.ok) throw new Error(`Calendar create ${res.status}`)
      setScheduled(true)
      setScheduleOpen(false)
      setTimeout(() => setScheduled(false), 2500)
    } catch (e: unknown) {
      const err = e as { message?: string }
      setError(err?.message || "Schedule failed.")
    } finally {
      setScheduleBusy(false)
    }
  }

  async function handleGenerateAsset() {
    if (!generated || !isOneClickHtmlAsset) return
    setGeneratingAsset(contentType)
    setAssetError(null)
    setAssetUrl(null)
    const timeoutMs = contentType === "pitch-deck" ? 240_000 : 150_000
    const abortCtrl = new AbortController()
    const timeoutId = setTimeout(() => abortCtrl.abort(), timeoutMs)
    try {
      const res = await fetch("/api/gtm/generate-asset-html", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief: generated, assetType: contentType, solution }),
        signal: abortCtrl.signal,
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || "HTML generation failed")
      }
      const data = await res.json()
      const sep = data.url.includes("?") ? "&" : "?"
      setAssetUrl(`${data.url}${sep}t=${Date.now()}`)
    } catch (e: unknown) {
      const err = e as { name?: string; message?: string }
      if (err?.name === "AbortError") setAssetError("Generation took longer than 150s and was cancelled. Try a shorter brief.")
      else setAssetError(err.message || "HTML generation failed. Please try again.")
    } finally {
      clearTimeout(timeoutId)
      setGeneratingAsset(null)
    }
  }

  async function handlePublishMicrosite() {
    if (!assetUrl || contentType !== "microsite") return
    setPublishing(true)
    setPublishResult(null)
    try {
      const htmlRes = await fetch(assetUrl.replace(/([?&])t=\d+(&|$)/, (_m, b, a) => a ? b : "").replace(/[?&]$/, ""))
      if (!htmlRes.ok) throw new Error("Couldn't read the generated microsite file")
      const html = await htmlRes.text()
      const res = await fetch("/api/gtm/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: publishSlug.trim(), title: publishTitle.trim() || `${solutionLabel} Microsite`, description: publishDesc.trim() || undefined, pillars: [solution], source: "builder", html }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || "Publish failed")
      }
      const data = await res.json()
      setPublishResult({ blobUrl: `${window.location.origin}/p/${data.page?.slug ?? publishSlug.trim()}` })
    } catch (e: unknown) {
      const err = e as { message?: string }
      setPublishResult({ error: err.message || "Publish failed" })
    } finally {
      setPublishing(false)
    }
  }

  // ─── Background photo (new) ───────────────────────────────────────────────
  async function handleBgPicked(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return
    setBgError(null)
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) { setBgError("Use a PNG, JPEG, or WebP image."); return }
    if (file.size > MAX_BG_BYTES) { setBgError("Image is larger than 3 MB. Resize it and try again."); return }
    try {
      setBgImage(await fileToDataUri(file))
      setBgOpacity(100)
      setSliderValue(100)
    } catch (err: unknown) {
      setBgError((err as { message?: string })?.message || "Could not read the image.")
    }
  }
  function handleBgClear() {
    // Clearing the photo clears its opacity too, so the next photo starts at 100%.
    setBgImage(null)
    setBgOpacity(100)
    setSliderValue(100)
    setBgError(null)
  }
  const commitOpacity = () => { if (sliderValue !== bgOpacity) setBgOpacity(sliderValue) }

  const assetType = contentType === "carousel" ? "carousel" : "social-post"
  const media = bgImage ? { bgImage, bgOpacity } : undefined

  // ─── Sections ─────────────────────────────────────────────────────────────
  const resultCard = generated && (
    <div className="card" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
        <span className="eyebrow">Result</span>
        <span className="section-note">
          {isSocialPost ? "Pick a template, edit any slot, update the preview, then save, schedule, or export." : isOneClickHtmlAsset ? "Generated copy below. Render it as a branded HTML asset when it reads right." : "Generated copy below."}
        </span>
      </div>

      {isSocialPost && draftAssetId && (
        <AssetPanel solution={solution} assetType={assetType} itemId={draftAssetId} briefText={rawContent} media={media} />
      )}

      {isSocialPost && socialCaptions ? (
        <>
          <span className="eyebrow">Post copy by channel</span>
          <CaptionsPanel captions={socialCaptions} />
        </>
      ) : (
        <div style={{ padding: "16px 20px", background: "var(--gtm-bg-page)", borderRadius: "var(--gtm-radius-control)", fontSize: 13, lineHeight: 1.65, color: "var(--gtm-text-primary)", overflow: "auto", minWidth: 0, wordBreak: "break-word" }}>
          <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word", fontFamily: "var(--gtm-font-body)", fontSize: 13, lineHeight: 1.65 }}>{displayContent}</pre>
        </div>
      )}

      {isOneClickHtmlAsset && (
        <div style={{ borderTop: "1px solid var(--gtm-border)", paddingTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div>
              <span className="eyebrow">HTML asset</span>
              <p className="section-note" style={{ margin: "4px 0 0" }}>
                {generatingAsset ? "Claude is writing a fully-branded HTML file. Takes 30-90 seconds." : `One-click rendered ${contentType === "one-pager" ? "one-pager" : contentType} grounded in the brief above.`}
              </p>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="btn btn-primary btn-sm" onClick={handleGenerateAsset} disabled={!!generatingAsset}>
                {generatingAsset ? <><Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> Generating…</> : assetUrl ? <><RefreshCw size={13} /> Regenerate</> : "Generate Now"}
              </button>
              {assetUrl && (
                <a className="btn btn-secondary btn-sm" href={assetUrl.replace(/([?&])t=\d+(&|$)/, (_m, b, a) => a ? b : "").replace(/[?&]$/, "")} target="_blank" rel="noopener" style={{ textDecoration: "none" }}>
                  <ExternalLink size={13} /> Open
                </a>
              )}
              {assetUrl && contentType === "microsite" && (
                <button className="btn btn-secondary btn-sm" onClick={() => setPublishOpen(true)}><Globe size={13} /> Publish Microsite</button>
              )}
              {contentType === "pitch-deck" && (
                <button className="btn btn-tertiary btn-sm" onClick={() => { navigator.clipboard.writeText(pitchDeckPrompt); setCopied(true); setTimeout(() => setCopied(false), 2000) }} title="Copy a Claude Code prompt that builds the deck from this brief">
                  <Terminal size={13} /> {copied ? "Copied" : "Copy Claude Code prompt"}
                </button>
              )}
            </div>
          </div>
          {assetError && <div className="error-note">{assetError}</div>}
          {!assetUrl && !generatingAsset && !assetError && (
            <div style={{ border: "1px dashed var(--gtm-border)", borderRadius: "var(--gtm-radius-control)", padding: 32, textAlign: "center", color: "var(--gtm-text-faint)", fontSize: 13 }}>
              Click <strong style={{ color: "var(--gtm-text-secondary)" }}>Generate Now</strong> to render a fully-branded HTML version of this brief. A preview appears here when it&rsquo;s ready (~20-40s).
            </div>
          )}
          {assetUrl && (
            <div style={{ background: "var(--gtm-bg-page)", border: "1px solid var(--gtm-border)", borderRadius: "var(--gtm-radius-control)", overflow: "hidden" }}>
              <iframe key={assetUrl} src={assetUrl} title={`${contentType} preview`} style={{ width: "100%", height: contentType === "microsite" ? 720 : contentType === "pitch-deck" ? 640 : 600, border: "none", display: "block", background: "#fff" }} />
            </div>
          )}
        </div>
      )}

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", borderTop: "1px solid var(--gtm-border)", paddingTop: 12, position: "relative" }}>
        <button className="btn btn-primary btn-sm" onClick={() => void handleSave()}>{saved ? <Check size={13} /> : <Save size={13} />} {saved ? "Saved" : "Save to Library"}</button>
        {isSocialPost && draftAssetId && (
          <>
            <button className="btn btn-secondary btn-sm" onClick={() => setScheduleOpen((v) => !v)}>{scheduled ? <Check size={13} /> : <CalendarPlus size={13} />} {scheduled ? "Scheduled" : "Schedule"}</button>
            <button className="btn btn-secondary btn-sm" onClick={handleDownloadGraphic} title="Download the rendered HTML"><Download size={13} /> Download HTML</button>
          </>
        )}
        <button className="btn btn-secondary btn-sm" onClick={handleCopy}>{copied ? <Check size={13} /> : <Copy size={13} />} {copied ? "Copied" : "Copy"}</button>
        {scheduleOpen && (
          <div className="card" style={{ position: "absolute", top: "100%", left: 0, marginTop: 8, zIndex: 20, padding: 14, minWidth: 260, display: "flex", flexDirection: "column", gap: 10 }}>
            <label style={{ display: "block" }}>
              <span className="field-label">Schedule date</span>
              <input className="input" type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} />
            </label>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setScheduleOpen(false)}>Cancel</button>
              <button className="btn btn-primary btn-sm" onClick={() => handleSchedule(scheduleDate)} disabled={scheduleBusy}>
                {scheduleBusy ? <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> : <CalendarPlus size={13} />} {scheduleBusy ? "Scheduling…" : "Save + Schedule"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div style={{ fontFamily: "var(--gtm-font-body)", display: "flex", flexDirection: "column", gap: 16, width: "100%", boxSizing: "border-box", maxWidth: 1200, margin: "0 auto", padding: isMobile ? "16px 16px 64px" : "32px 48px 80px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12, flexWrap: "wrap" }}>
        <div>
          <span className="eyebrow">{solutionLabel} · Content Builder</span>
          <h2 style={{ margin: "4px 0 0", fontSize: 24, fontWeight: 400, letterSpacing: "-0.02em", color: "var(--gtm-text-primary)" }}>Turn a brief into on-brand content.</h2>
        </div>
        {generated && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="mono" style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--gtm-text-secondary)", background: "var(--gtm-surface-2)", borderRadius: 4, padding: "2px 6px" }}>session saved</span>
            <button className="btn btn-tertiary btn-sm" style={{ color: "var(--gtm-danger-text)" }} onClick={() => { if (confirm("Clear this Content Builder session? The generated brief and form inputs will be reset.")) handleClearSession() }}>
              <Trash2 size={13} /> Clear session
            </button>
          </div>
        )}
      </div>

      {/* 1 · Brief */}
      <div className="card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <span className="eyebrow">Brief</span>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
          <label style={{ display: "block" }}>
            <span className="field-label">Service / Vertical</span>
            <select className="input" value={vertical} onChange={(e) => setVertical(e.target.value)}>
              {verticals.map((v) => <option key={v.id} value={v.id}>{v.label}</option>)}
            </select>
          </label>
          {personaOptions.length > 0 && (
            <label style={{ display: "block" }}>
              <span className="field-label">Primary Persona</span>
              <select className="input" value={persona} onChange={(e) => setPersona(e.target.value)}>
                {personaOptions.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
              <span className="section-note" style={{ display: "block", marginTop: 4 }}>{persona === "auto" ? "Targets the vertical's default buyer." : "Tailors voice, pain points, and proof to this persona."}</span>
            </label>
          )}
        </div>
        <div>
          <span className="field-label">Motion</span>
          <div style={{ display: "flex", gap: 6 }}>
            {(["direct", "partner"] as const).map((m) => (
              <button key={m} type="button" className={`chip${motion === m ? " on" : ""}`} aria-pressed={motion === m} onClick={() => setMotion(m)}>{m === "direct" ? "Direct to Enterprise" : "Channel Partners"}</button>
            ))}
          </div>
        </div>
        {showCompetitor && (
          <label style={{ display: "block" }}>
            <span className="field-label">Competitor</span>
            <input className="input" type="text" value={competitor} onChange={(e) => setCompetitor(e.target.value)} placeholder="e.g. Cvent" />
          </label>
        )}
        <label style={{ display: "block" }}>
          <span className="field-label">Additional context <span style={{ fontWeight: 400, color: "var(--gtm-text-secondary)" }}>(optional)</span></span>
          <textarea className="input" value={additionalContext} onChange={(e) => setAdditionalContext(e.target.value)} placeholder="Specific customer, trigger event, or positioning angle to incorporate..." style={{ minHeight: 80, resize: "vertical" }} />
        </label>
      </div>

      {/* 2 · Format */}
      <div className="card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <span className="eyebrow">Format</span>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
          {([["Visual", true], ["Text", false]] as const).map(([label, visual]) => (
            <div key={label}>
              <span className="field-label">{label}</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {CONTENT_TYPES.filter((c) => c.visual === visual).map((c) => (
                  <button key={c.value} type="button" className={`chip${contentType === c.value ? " on" : ""}`} aria-pressed={contentType === c.value} onClick={() => selectFormat(c.value)} title={c.description}>{c.label}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
        {currentType && <span className="section-note">{currentType.description}</span>}
      </div>

      {/* 4 · Media (social only; the template picker — step 3 — lives inside AssetPanel in Result) */}
      {isSocialPost && (
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
            <span className="eyebrow">Media</span>
            <span className="section-note">Optional background photo for the rendered graphic. Leave it unset and the template renders its designed gradient.</span>
          </div>
          <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
            {bgImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={bgImage} alt="Background photo" style={{ width: 96, height: 64, objectFit: "cover", borderRadius: "var(--gtm-radius-control)", border: "2px solid var(--gtm-accent)", flex: "none" }} />
            ) : (
              <div style={{ width: 96, height: 64, borderRadius: "var(--gtm-radius-control)", background: "var(--gtm-surface-2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gtm-text-faint)", flex: "none" }}><ImagePlus size={18} /></div>
            )}
            <div style={{ flex: 1, minWidth: 220, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "baseline" }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--gtm-text-primary)" }}>Background photo</span>
                <button type="button" className="btn btn-tertiary btn-sm" onClick={() => bgInputRef.current?.click()}>{bgImage ? "Replace" : "Upload"}</button>
                {bgImage && <button type="button" className="btn btn-tertiary btn-sm" style={{ color: "var(--gtm-danger-text)" }} onClick={handleBgClear}><X size={12} /> Clear</button>}
                <input ref={bgInputRef} type="file" accept="image/png,image/jpeg,image/webp" style={{ display: "none" }} onChange={(e) => void handleBgPicked(e)} />
              </div>
              {bgImage && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, maxWidth: 440 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--gtm-text-primary)" }}>Opacity</span>
                  <input
                    type="range" min={0} max={100} step={1} value={sliderValue}
                    aria-label="Background image opacity"
                    onChange={(e) => setSliderValue(Number(e.target.value))}
                    onMouseUp={commitOpacity} onTouchEnd={commitOpacity} onKeyUp={commitOpacity} onPointerUp={commitOpacity} onBlur={commitOpacity}
                    style={{ flex: 1, accentColor: "var(--gtm-accent)" }}
                  />
                  <span className="mono" style={{ fontSize: 12, width: 40, textAlign: "right", color: "var(--gtm-text-primary)" }}>{sliderValue}%</span>
                </div>
              )}
              {bgError && <span style={{ fontSize: 12, color: "var(--gtm-danger-text)" }}>{bgError}</span>}
              <span className="section-note">PNG, JPEG, or WebP up to 3 MB. The photo is embedded in the render, so the preview and the PNG export always match. Changes re-render when you release the slider.</span>
            </div>
          </div>
        </div>
      )}

      {/* 5 · Generate */}
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <button className="btn btn-primary" onClick={handleGenerate} disabled={loading || !vertical}>
          {loading ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Generating…</> : generated ? "Regenerate" : "Generate"}
        </button>
        {generated && <button className="btn btn-tertiary" onClick={() => { if (confirm("Start over? The generated brief will be cleared (form inputs stay).")) { setGenerated(null); setDraftAssetId(null); setError(null) } }}>Start over</button>}
        <span className="section-note" style={{ marginLeft: "auto" }}>Kept in this browser — leaving the page doesn&rsquo;t lose the brief.</span>
      </div>

      {error && <div className="error-note">{error}</div>}
      {loading && (
        <div className="card" style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--gtm-text-secondary)", fontSize: 13 }}>
          <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Generating content - this takes ~5-15 seconds...
        </div>
      )}

      {/* 6 · Result — mounted once so AssetPanel never remounts. DOM-last so desktop
          focus/reading order matches the visual order; on mobile flex `order: -1`
          lifts the same node to the top, where it pins BELOW the layout's mobile app
          bar (layout.tsx: sticky, top 0, z-index 500, MOBILE_BAR_H tall) with a
          show/hide chevron that hides (not unmounts) the card. */}
      {generated && (
        <div
          style={isMobile
            ? { order: -1, position: "sticky", top: MOBILE_BAR_H, zIndex: 30, background: "var(--gtm-bg-page)", paddingBottom: 10, borderBottom: "1px solid var(--gtm-border)" }
            : undefined}
        >
          {isMobile && (
            <button type="button" className="btn btn-secondary" style={{ width: "100%", justifyContent: "space-between", borderRadius: "var(--gtm-radius-control)" }} onClick={() => setPreviewOpen((o) => !o)} aria-expanded={previewOpen}>
              <span>Result</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ transform: previewOpen ? "rotate(180deg)" : "none", transition: "transform .15s ease" }}><polyline points="6 9 12 15 18 9" /></svg>
            </button>
          )}
          <div hidden={isMobile && !previewOpen} style={isMobile ? { marginTop: 10, maxHeight: "52vh", overflow: "auto" } : undefined}>
            {resultCard}
          </div>
        </div>
      )}

      {/* Publish-to-Microsite modal */}
      {publishOpen && (
        <div onClick={(e) => { if (e.target === e.currentTarget) setPublishOpen(false) }} style={{ position: "fixed", inset: 0, background: "rgba(6,19,65,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
          <div className="card" style={{ width: "100%", maxWidth: 480, display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <span className="eyebrow">Publish Microsite</span>
              <p className="section-note" style={{ margin: "4px 0 0" }}>Publishes the generated HTML to a permanent, tracked /p/&lt;slug&gt; URL.</p>
            </div>
            {publishResult?.blobUrl ? (
              <div style={{ background: "var(--gtm-accent-bg)", border: "1px solid var(--gtm-accent)", borderRadius: "var(--gtm-radius-control)", padding: 12 }}>
                <p style={{ margin: "0 0 8px 0", fontSize: 13, fontWeight: 600, color: "var(--gtm-accent-text)" }}>Published.</p>
                <a href={publishResult.blobUrl} target="_blank" rel="noopener" style={{ fontSize: 12, color: "var(--gtm-accent-text)", wordBreak: "break-all" }}>{publishResult.blobUrl}</a>
              </div>
            ) : (
              <>
                <label style={{ display: "block" }}><span className="field-label">Slug</span><input className="input" type="text" value={publishSlug} onChange={(e) => setPublishSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} placeholder="e.g. acme-2026-activation" autoFocus /></label>
                <label style={{ display: "block" }}><span className="field-label">Title</span><input className="input" type="text" value={publishTitle} onChange={(e) => setPublishTitle(e.target.value)} placeholder={`${solutionLabel} Microsite`} /></label>
                <label style={{ display: "block" }}><span className="field-label">Description <span style={{ fontWeight: 400 }}>(optional)</span></span><input className="input" type="text" value={publishDesc} onChange={(e) => setPublishDesc(e.target.value)} placeholder="One-line summary" /></label>
              </>
            )}
            {publishResult?.error && <div className="error-note">{publishResult.error}</div>}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button className="btn btn-secondary btn-sm" onClick={() => { setPublishOpen(false); setPublishResult(null); setPublishSlug(""); setPublishTitle(""); setPublishDesc("") }}>{publishResult?.blobUrl ? "Close" : "Cancel"}</button>
              {!publishResult?.blobUrl && (
                <button className="btn btn-primary btn-sm" onClick={handlePublishMicrosite} disabled={!publishSlug.trim() || publishing}>
                  {publishing ? <><Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> Publishing…</> : <><Send size={13} /> Publish</>}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
