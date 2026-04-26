"use client"

import React, { useState, useMemo, useEffect, useRef } from "react"
import { Loader2, Copy, Save, Check, ExternalLink, RefreshCw, Send, Globe, Terminal, Trash2, Download, CalendarPlus } from "lucide-react"
import type { VerticalOption } from "./SolutionTabs"
import { dispatchLibraryChanged } from "./SolutionTabs"
import AssetPanel from "@/components/gtm/AssetPanel"

// ─── HTML-asset generation contract ───────────────────────────────────────
// Content types that have a one-click HTML asset pipeline (calls /api/gtm/generate-asset-html).
const ONE_CLICK_HTML_ASSETS = new Set(["infographic", "microsite", "carousel", "social-post", "one-pager", "pitch-deck"])
// Reserved for future manual-only asset types - currently none.
const MANUAL_HTML_ASSETS = new Set<string>([])

const font = "'Inter', system-ui, sans-serif"

const CONTENT_TYPES: { value: string; label: string; description: string }[] = [
  { value: "cold-emails", label: "Cold Email Sequence", description: "3-touch outreach sequence" },
  { value: "linkedin-dm", label: "LinkedIn DM Sequence", description: "3-message conversation flow" },
  { value: "social-post", label: "Social Post", description: "LinkedIn, Instagram, and X versions" },
  { value: "carousel", label: "Social Carousel", description: "6-card LinkedIn/Instagram carousel" },
  { value: "lead-magnet", label: "Lead Magnet Outline", description: "Gated PDF/guide structure" },
  { value: "discovery-script", label: "Discovery Call Script", description: "Sales call + objection handling" },
  { value: "partner-pitch", label: "Partner Pitch", description: "Channel/partnership narrative" },
  { value: "battle-card", label: "Battle Card", description: "Competitive positioning one-pager" },
  { value: "microsite", label: "Microsite", description: "Landing page structure + palette" },
  { value: "pitch-deck", label: "Pitch Deck", description: "8-slide presentation script" },
  { value: "infographic", label: "Infographic", description: "6-panel data-driven asset" },
  { value: "one-pager", label: "Sales One-Pager", description: "Leave-behind PDF content" },
]

const INDUSTRY_GROUPS: { label: string; industries: { value: string; label: string }[] }[] = [
  {
    label: "General",
    industries: [
      { value: "general", label: "General / All Industries" },
    ],
  },
  {
    label: "Target Industries",
    industries: [
      { value: "heavy-equipment", label: "Heavy Equipment & Industrial Manufacturing" },
      { value: "aerospace-defense", label: "Aerospace & Defense" },
      { value: "automotive-mobility", label: "Automotive & Mobility" },
      { value: "energy-utilities", label: "Energy & Utilities" },
      { value: "technology-software", label: "Technology & Software" },
      { value: "hospitality", label: "Hospitality & Travel" },
      { value: "higher-education", label: "Higher Education & Research" },
      { value: "economic-development", label: "Economic Development & Innovation Districts" },
    ],
  },
  {
    label: "Additional Industries",
    industries: [
      { value: "financial-services", label: "Financial Services & Banking" },
      { value: "healthcare-life-sciences", label: "Healthcare & Life Sciences" },
      { value: "pharmaceutical", label: "Pharmaceutical & Biotech" },
      { value: "consumer-goods", label: "Consumer Packaged Goods" },
      { value: "retail-ecommerce", label: "Retail & eCommerce" },
      { value: "transportation-logistics", label: "Transportation & Logistics" },
      { value: "construction-real-estate", label: "Construction & Real Estate" },
      { value: "telecommunications", label: "Telecommunications" },
      { value: "media-entertainment", label: "Media & Entertainment" },
      { value: "government-public-sector", label: "Government & Public Sector" },
      { value: "professional-services", label: "Professional Services" },
      { value: "insurance", label: "Insurance" },
    ],
  },
]

interface ContentBuilderProps {
  solution: string
  solutionLabel: string
  verticals: VerticalOption[]
}

export default function ContentBuilder({
  solution,
  solutionLabel,
  verticals,
}: ContentBuilderProps) {
  const [vertical, setVertical] = useState(verticals[0]?.id ?? "")
  const [industry, setIndustry] = useState(INDUSTRY_GROUPS[0].industries[0].value)
  const [motion, setMotion] = useState<"direct" | "partner">("direct")
  const [contentType, setContentType] = useState(CONTENT_TYPES[0].value)
  const [additionalContext, setAdditionalContext] = useState("")
  const [competitor, setCompetitor] = useState("")
  const [loading, setLoading] = useState(false)
  const [generated, setGenerated] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activePlatform, setActivePlatform] = useState<"linkedin" | "instagram" | "twitter">("linkedin")
  // Synthetic itemId that scopes the social-post template render to this
  // specific Content Builder session. Rotates on every new generation so
  // the rendered blob/KV entry doesn't collide with prior drafts.
  const [draftAssetId, setDraftAssetId] = useState<string | null>(null)

  // Schedule-on-calendar flow state (social-post only for now).
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [scheduleBusy, setScheduleBusy] = useState(false)
  const [scheduled, setScheduled] = useState(false)
  const [scheduleDate, setScheduleDate] = useState<string>(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
  })

  // ─── Session persistence ─────────────────────────────────────────────
  // localStorage-backed session per solution. Survives tab navigation,
  // full page refresh, and cross-tab usage. Cleared via the Clear button.
  const storageKey = `gtm:cb-session:${solution}`
  const hydrated = useRef(false)

  // Hydrate on mount (and re-hydrate when switching solutions).
  useEffect(() => {
    hydrated.current = false
    if (typeof window === "undefined") return
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) {
        const s = JSON.parse(raw) as Record<string, unknown>
        if (typeof s.vertical === "string") setVertical(s.vertical)
        if (typeof s.industry === "string") setIndustry(s.industry)
        if (s.motion === "direct" || s.motion === "partner") setMotion(s.motion)
        if (typeof s.contentType === "string") setContentType(s.contentType)
        if (typeof s.additionalContext === "string") setAdditionalContext(s.additionalContext)
        if (typeof s.competitor === "string") setCompetitor(s.competitor)
        if (typeof s.generated === "string") setGenerated(s.generated)
        if (typeof s.draftAssetId === "string") setDraftAssetId(s.draftAssetId)
      }
    } catch {
      /* corrupted storage is non-fatal */
    }
    hydrated.current = true
  }, [solution, storageKey])

  // Persist on every relevant change (after hydration).
  useEffect(() => {
    if (!hydrated.current || typeof window === "undefined") return
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          vertical, industry, motion, contentType,
          additionalContext, competitor, generated, draftAssetId,
        })
      )
    } catch {
      /* storage full / disabled - silently skip */
    }
  }, [storageKey, vertical, industry, motion, contentType, additionalContext, competitor, generated, draftAssetId])

  function handleClearSession() {
    setVertical(verticals[0]?.id ?? "")
    setIndustry(INDUSTRY_GROUPS[0].industries[0].value)
    setMotion("direct")
    setContentType(CONTENT_TYPES[0].value)
    setAdditionalContext("")
    setCompetitor("")
    setGenerated(null)
    setDraftAssetId(null)
    setError(null)
    setSaved(false)
    setCopied(false)
    try { localStorage.removeItem(storageKey) } catch { /* ignore */ }
  }

  const showCompetitor = contentType === "battle-card"
  const isSocialPost = contentType === "social-post"
  const isOneClickHtmlAsset = ONE_CLICK_HTML_ASSETS.has(contentType)
  const isManualHtmlAsset = MANUAL_HTML_ASSETS.has(contentType)

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

  // Parse social-post output into platform sections
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

  // Reset platform tab when new content is generated
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

  // Raw content (for copy to clipboard) - filtered by active platform for social posts
  const rawContent = useMemo(() => {
    if (!generated) return ""
    if (isSocialPost && socialSections) {
      const section = socialSections[activePlatform]
      return section || generated
    }
    return generated
  }, [generated, isSocialPost, socialSections, activePlatform])

  // Preprocess content for markdown rendering: bold known labels, preserve line breaks
  const displayContent = useMemo(() => {
    if (!rawContent) return ""
    const LABEL_PATTERN = /^(HEADLINE|SUBHEAD|POST|SUBJECT|BODY|CTA|TITLE|SUBTITLE|HOOK|SECTIONS|CONCLUSION|GATE REQUIREMENT|OPENING|DISCOVERY QUESTIONS|TRANSITION|TOP OBJECTIONS|SOFT CLOSE|PAGE TITLE|META DESCRIPTION|DESIGN NOTES|PROOF POINT|LAYOUT|SERIES_CAPTION|COMPETITOR SNAPSHOT|WHEN YOU HEAR THEM|HOW TO RESPOND|THEIR STRENGTHS|OUR ADVANTAGE|KILLER QUESTION|PROOF POINT TO USE|THE PROBLEM|OUR SERVICES APPROACH|HOW WE ENGAGE|CALL TO ACTION|OPENING PARAGRAPH|SECOND PARAGRAPH|THIRD PARAGRAPH|ONE-LINER|HERO SECTION|EMAIL [0-9]+ - Day [0-9]+)\s*:/gim
    return rawContent
      .replace(LABEL_PATTERN, (_m, label) => `**${label}:**`)
      .replace(/(?<!\n)\n(?!\n)/g, "  \n")
  }, [rawContent])

  // Pitch-deck manual template: the prompt users copy into Claude Code
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
          solution,
          vertical,
          industry,
          motion,
          contentType,
          additionalContext: additionalContext || undefined,
          competitor: showCompetitor ? competitor || undefined : undefined,
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || "Generation failed")
      }
      const data = await res.json()
      setGenerated(data.content || "")
      // Rotate the synthetic itemId so a fresh template render doesn't pick
      // up a stale blob from the previous generation for this session.
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
    } catch {
      // ignore
    }
  }

  /**
   * Save the generated brief to the Library. For social-post items that
   * already have a draft-rendered graphic (draftAssetId), link that graphic
   * to the new library item's id so it stays discoverable when the user
   * re-opens the item later.
   *
   * Returns the new library itemId on success, or null on failure, so
   * other flows (Schedule) can chain off a successful save.
   */
  async function handleSave(): Promise<string | null> {
    if (!generated) return null
    try {
      const res = await fetch("/api/gtm/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          solution,
          contentType,
          motion,
          content: generated,
          tags: [vertical, industry].filter(Boolean),
          createdAt: new Date().toISOString(),
        }),
      })
      if (!res.ok) throw new Error("Save failed")
      const { id: libraryItemId } = await res.json()

      // Link the draft-rendered social-post graphic to the new library id
      // so AssetPanel in the Library finds it on reopen.
      if (isSocialPost && draftAssetId && libraryItemId) {
        try {
          await fetch("/api/gtm/asset-link", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              pillar: solution,
              assetType: "social-post",
              fromItemId: draftAssetId,
              toItemId: libraryItemId,
            }),
          })
        } catch {
          // Non-fatal; the brief is saved. User can re-render if needed.
        }
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

  /**
   * Download the rendered social-post graphic as a standalone .html file.
   */
  async function handleDownloadGraphic() {
    if (!isSocialPost || !draftAssetId) return
    try {
      const url = `/api/gtm/asset-preview?solution=${encodeURIComponent(solution)}&assetType=social-post&itemId=${encodeURIComponent(draftAssetId)}`
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

  /**
   * Schedule flow: save the brief to Library, then create a calendar task
   * on the chosen date with libraryItemId linkage.
   */
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
        category: contentType,
        solution,
        date: dateIso,
        duration: 30,
        completed: false,
        description: `Scheduled from Content Builder.`,
        sortOrder: Date.now(),
        libraryItemId,
        industry,
        motion,
      }
      const res = await fetch("/api/gtm/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskBody),
      })
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

  // ─── HTML asset generation (infographic / microsite / carousel / one-pager) ───
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
        body: JSON.stringify({
          brief: generated,
          assetType: contentType,
          solution,
        }),
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
      if (err?.name === "AbortError") {
        setAssetError("Generation took longer than 150s and was cancelled. Try a shorter brief.")
      } else {
        setAssetError(err.message || "HTML generation failed. Please try again.")
      }
    } finally {
      clearTimeout(timeoutId)
      setGeneratingAsset(null)
    }
  }

  // ─── Microsite publish (pushes HTML to Vercel Blob + KV) ──────────────────
  async function handlePublishMicrosite() {
    if (!assetUrl || contentType !== "microsite") return
    setPublishing(true)
    setPublishResult(null)
    try {
      const htmlRes = await fetch(assetUrl.replace(/([?&])t=\d+(&|$)/, (_m, b, a) => a ? b : "").replace(/[?&]$/, ""))
      if (!htmlRes.ok) throw new Error("Couldn't read the generated microsite file")
      const html = await htmlRes.text()

      const res = await fetch("/api/gtm/microsites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: publishSlug.trim(),
          title: publishTitle.trim() || `${solutionLabel} Microsite`,
          description: publishDesc.trim() || undefined,
          solution,
          html,
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || "Publish failed")
      }
      const data = await res.json()
      setPublishResult({ blobUrl: data.blobUrl })
    } catch (e: unknown) {
      const err = e as { message?: string }
      setPublishResult({ error: err.message || "Publish failed" })
    } finally {
      setPublishing(false)
    }
  }

  return (
    <div style={{ fontFamily: font, display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>
    <div style={{ display: "grid", gridTemplateColumns: "340px minmax(0, 1fr)", gap: 24, alignItems: "start", width: "100%" }}>
      {/* Form */}
      <div
        style={{
          background: "var(--gtm-bg-card)",
          border: "1px solid var(--gtm-border)",
          borderRadius: 6,
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "var(--gtm-text-primary)" }}>
          Generate for {solutionLabel}
        </h3>

        <FormField label="Service / Vertical">
          <select
            value={vertical}
            onChange={(e) => setVertical(e.target.value)}
            style={selectStyle}
          >
            {verticals.map((v) => (
              <option key={v.id} value={v.id}>
                {v.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Industry">
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            style={selectStyle}
          >
            {INDUSTRY_GROUPS.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.industries.map((ind) => (
                  <option key={ind.value} value={ind.value}>
                    {ind.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </FormField>

        <FormField label="Motion">
          <div style={{ display: "flex", gap: 8 }}>
            {(["direct", "partner"] as const).map((m) => {
              const isActive = motion === m
              return (
                <button
                  key={m}
                  onClick={() => setMotion(m)}
                  style={{
                    flex: 1,
                    height: 38,
                    padding: "0 12px",
                    fontSize: 12,
                    fontWeight: 600,
                    fontFamily: font,
                    border: `1px solid ${isActive ? "#247b96" : "var(--gtm-border)"}`,
                    background: isActive ? "rgba(36, 123, 150, 0.08)" : "#fff",
                    color: isActive ? "#247b96" : "var(--gtm-text-secondary)",
                    borderRadius: 6,
                    cursor: "pointer",
                    textTransform: "capitalize",
                    boxSizing: "border-box",
                  }}
                >
                  {m === "direct" ? "Direct to Enterprise" : "Channel Partners"}
                </button>
              )
            })}
          </div>
        </FormField>

        <FormField label="Content Type">
          <select
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
            style={selectStyle}
          >
            {CONTENT_TYPES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <p style={{ margin: "6px 0 0 0", fontSize: 11, color: "var(--gtm-text-faint)" }}>
            {CONTENT_TYPES.find((c) => c.value === contentType)?.description}
          </p>
        </FormField>

        {showCompetitor && (
          <FormField label="Competitor">
            <input
              type="text"
              value={competitor}
              onChange={(e) => setCompetitor(e.target.value)}
              placeholder="e.g. Cvent"
              style={inputStyle}
            />
          </FormField>
        )}

        <FormField label="Additional Context (optional)">
          <textarea
            value={additionalContext}
            onChange={(e) => setAdditionalContext(e.target.value)}
            placeholder="Specific customer, trigger event, or positioning angle to incorporate..."
            style={{ ...inputStyle, height: "auto", minHeight: 80, resize: "vertical" }}
          />
        </FormField>

        <button
          onClick={handleGenerate}
          disabled={loading || !vertical}
          style={{
            height: 38,
            padding: "0 16px",
            background: loading ? "var(--gtm-text-faint)" : "#247b96",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            fontFamily: font,
            fontSize: 13,
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            boxSizing: "border-box",
          }}
        >
          {loading ? (
            <>
              <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
              Generating...
            </>
          ) : (
            "Generate Content"
          )}
        </button>
      </div>

      {/* Output */}
      <div
        style={{
          background: "var(--gtm-bg-card)",
          border: "1px solid var(--gtm-border)",
          borderRadius: 6,
          padding: 20,
          minHeight: 400,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "var(--gtm-text-primary)" }}>
            Output
          </h3>
          {generated && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", position: "relative" }}>
              <button onClick={handleCopy} style={outputActionStyle}>
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? "Copied" : "Copy"}
              </button>
              <button
                onClick={() => void handleSave()}
                style={{ ...outputActionStyle, background: saved ? "rgba(43, 191, 168, 0.12)" : "rgba(36, 123, 150, 0.08)", color: saved ? "#2bbfa8" : "#247b96" }}
              >
                {saved ? <Check size={12} /> : <Save size={12} />}
                {saved ? "Saved" : "Save to Library"}
              </button>

              {/* Schedule + Download are social-post specific */}
              {isSocialPost && draftAssetId && (
                <>
                  <button
                    onClick={() => setScheduleOpen((v) => !v)}
                    style={{ ...outputActionStyle, background: scheduled ? "rgba(43, 191, 168, 0.12)" : "rgba(36, 123, 150, 0.08)", color: scheduled ? "#2bbfa8" : "#247b96" }}
                  >
                    {scheduled ? <Check size={12} /> : <CalendarPlus size={12} />}
                    {scheduled ? "Scheduled" : "Schedule"}
                  </button>
                  <button
                    onClick={handleDownloadGraphic}
                    style={outputActionStyle}
                    title="Download the rendered social-post HTML"
                  >
                    <Download size={12} />
                    Download
                  </button>

                  {/* Inline date picker popover */}
                  {scheduleOpen && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        right: 0,
                        marginTop: 8,
                        zIndex: 20,
                        background: "#fff",
                        border: "1px solid var(--gtm-border)",
                        borderRadius: 6,
                        boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                        padding: 14,
                        minWidth: 240,
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                        fontFamily: font,
                      }}
                    >
                      <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--gtm-text-faint)" }}>
                        Schedule date
                        <input
                          type="date"
                          value={scheduleDate}
                          onChange={(e) => setScheduleDate(e.target.value)}
                          style={{
                            marginTop: 2,
                            fontFamily: font,
                            fontSize: 13,
                            padding: "8px 10px",
                            border: "1px solid var(--gtm-border)",
                            borderRadius: 6,
                            color: "var(--gtm-text-primary)",
                            outline: "none",
                            textTransform: "none",
                            letterSpacing: "normal",
                            fontWeight: 400,
                          }}
                        />
                      </label>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
                        <button
                          onClick={() => setScheduleOpen(false)}
                          style={{ ...outputActionStyle, background: "#fff", color: "var(--gtm-text-secondary)" }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSchedule(scheduleDate)}
                          disabled={scheduleBusy}
                          style={{ ...outputActionStyle, background: "#247b96", color: "#fff", borderColor: "transparent", cursor: scheduleBusy ? "not-allowed" : "pointer" }}
                        >
                          {scheduleBusy ? <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} /> : <CalendarPlus size={12} />}
                          {scheduleBusy ? "Scheduling..." : "Save + Schedule"}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              <button
                onClick={() => {
                  if (confirm("Clear this Content Builder session? The generated brief and form inputs will be reset.")) {
                    handleClearSession()
                  }
                }}
                style={{ ...outputActionStyle, background: "rgba(239, 68, 68, 0.06)", color: "#b91c1c", borderColor: "rgba(239, 68, 68, 0.25)" }}
                title="Clear session (form inputs + generated output)"
              >
                <Trash2 size={12} />
                Clear
              </button>
            </div>
          )}
        </div>

        {error && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.08)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: 6,
              padding: 12,
              fontSize: 13,
              color: "#b91c1c",
              marginBottom: 12,
            }}
          >
            {error}
          </div>
        )}

        {!generated && !loading && !error && (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--gtm-text-faint)",
              fontSize: 13,
              textAlign: "center",
              padding: 40,
            }}
          >
            Fill in the form and click Generate to produce content tailored to your solution, service, and motion.
          </div>
        )}

        {loading && (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--gtm-text-secondary)",
              fontSize: 13,
              gap: 10,
            }}
          >
            <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
            Generating content - this takes ~5-15 seconds...
          </div>
        )}

        {generated && isSocialPost && socialSections && (
          <div style={{ display: "flex", gap: 4, marginBottom: 12, background: "var(--gtm-bg-page)", borderRadius: 6, padding: 4 }}>
            {(["linkedin", "instagram", "twitter"] as const).map((p) => {
              const isActive = activePlatform === p
              const labels = { linkedin: "LinkedIn", instagram: "Instagram", twitter: "Twitter / X" }
              const hasContent = socialSections[p].length > 0
              return (
                <button
                  key={p}
                  onClick={() => setActivePlatform(p)}
                  disabled={!hasContent}
                  style={{
                    flex: 1,
                    height: 30,
                    padding: "0 12px",
                    fontSize: 12,
                    fontWeight: 600,
                    fontFamily: font,
                    border: "none",
                    background: isActive ? "#fff" : "transparent",
                    color: isActive ? "#247b96" : hasContent ? "var(--gtm-text-secondary)" : "var(--gtm-text-faint)",
                    borderRadius: 4,
                    cursor: hasContent ? "pointer" : "not-allowed",
                    boxShadow: isActive ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                    transition: "all 150ms ease",
                    opacity: hasContent ? 1 : 0.5,
                  }}
                >
                  {labels[p]}
                </button>
              )
            })}
          </div>
        )}

        {generated && (
          <div
            style={{
              margin: 0,
              padding: "16px 20px",
              background: "var(--gtm-bg-page)",
              borderRadius: 6,
              fontSize: 13,
              lineHeight: 1.65,
              color: "var(--gtm-text-primary)",
              fontFamily: font,
              flex: 1,
              overflow: "auto",
              minWidth: 0,
              wordBreak: "break-word",
            }}
          >
            <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word", fontFamily: font, fontSize: 13, lineHeight: 1.65 }}>
              {displayContent}
            </pre>
          </div>
        )}
      </div>
    </div>

    {/* ─── Social Post: inline template picker + slot fill ──────────────── */}
    {generated && isSocialPost && draftAssetId && (
      <AssetPanel
        solution={solution}
        assetType="social-post"
        itemId={draftAssetId}
        briefText={rawContent}
      />
    )}

    {/* ─── HTML Asset section (one-click full-HTML for non-templated types) ── */}
    {generated && isOneClickHtmlAsset && !isSocialPost && (
      <div
        style={{
          background: "var(--gtm-bg-card)",
          border: "1px solid var(--gtm-border)",
          borderRadius: 6,
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          width: "100%",
          minWidth: 0,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "var(--gtm-text-primary)" }}>HTML Asset</h3>
            <p style={{ margin: "4px 0 0 0", fontSize: 12, color: "var(--gtm-text-faint)" }}>
              {generatingAsset
                ? "Claude is writing a fully-branded HTML file. Takes 30-90 seconds."
                : `One-click rendered ${contentType === "one-pager" ? "one-pager" : contentType} grounded in the brief above.`}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              onClick={handleGenerateAsset}
              disabled={!!generatingAsset}
              style={{
                height: 38,
                padding: "0 16px",
                background: generatingAsset ? "var(--gtm-text-faint)" : "#247b96",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                fontFamily: font,
                fontSize: 13,
                fontWeight: 600,
                cursor: generatingAsset ? "not-allowed" : "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {generatingAsset ? (
                <>
                  <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
                  Generating...
                </>
              ) : assetUrl ? (
                <>
                  <RefreshCw size={14} /> Regenerate
                </>
              ) : (
                "Generate Now"
              )}
            </button>
            {assetUrl && (
              <a
                href={assetUrl.replace(/([?&])t=\d+(&|$)/, (_m, b, a) => a ? b : "").replace(/[?&]$/, "")}
                target="_blank"
                rel="noopener"
                style={{
                  ...outputActionStyle,
                  height: 38,
                  padding: "0 12px",
                  textDecoration: "none",
                  fontSize: 12,
                }}
              >
                <ExternalLink size={12} /> Open
              </a>
            )}
            {assetUrl && contentType === "microsite" && (
              <button
                onClick={() => setPublishOpen(true)}
                style={{
                  ...outputActionStyle,
                  height: 38,
                  padding: "0 12px",
                  fontSize: 12,
                  background: "rgba(43, 191, 168, 0.08)",
                  color: "#2bbfa8",
                  borderColor: "rgba(43, 191, 168, 0.32)",
                }}
              >
                <Globe size={12} /> Publish Microsite
              </button>
            )}
          </div>
        </div>

        {assetError && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.08)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: 6,
              padding: 12,
              fontSize: 13,
              color: "#b91c1c",
            }}
          >
            {assetError}
          </div>
        )}

        {!assetUrl && !generatingAsset && !assetError && (
          <div
            style={{
              border: "1px dashed var(--gtm-border)",
              borderRadius: 6,
              padding: 40,
              textAlign: "center",
              color: "var(--gtm-text-faint)",
              fontSize: 13,
            }}
          >
            Click <strong style={{ color: "var(--gtm-text-secondary)" }}>Generate Now</strong> to render a fully-branded HTML version of this brief.
            A preview will appear here when it&rsquo;s ready (~20-40s).
          </div>
        )}

        {assetUrl && (
          <div
            style={{
              background: "var(--gtm-bg-page)",
              border: "1px solid var(--gtm-border)",
              borderRadius: 6,
              overflow: "hidden",
            }}
          >
            <iframe
              key={assetUrl}
              src={assetUrl}
              title={`${contentType} preview`}
              style={{
                width: "100%",
                height:
                  contentType === "microsite" ? 720 :
                  contentType === "carousel" ? 520 :
                  contentType === "pitch-deck" ? 640 :
                  600,
                border: "none",
                display: "block",
                background: "#fff",
              }}
            />
          </div>
        )}
      </div>
    )}

    {/* ─── Build-with-Claude-Code panel (pitch-deck manual flow) ──────────── */}
    {generated && isManualHtmlAsset && (
      <div
        style={{
          background: "var(--gtm-bg-card)",
          border: "1px solid var(--gtm-border)",
          borderRadius: 6,
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          width: "100%",
          minWidth: 0,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "var(--gtm-text-primary)", display: "inline-flex", alignItems: "center", gap: 8 }}>
              <Terminal size={14} style={{ color: "#247b96" }} />
              Build with Claude Code
            </h3>
            <p style={{ margin: "6px 0 0 0", fontSize: 13, color: "var(--gtm-text-secondary)", lineHeight: 1.55, maxWidth: "64ch" }}>
              Pitch decks use a manual Claude Code workflow for best results. Copy the prompt below, run it in Claude Code alongside the brief, and the deck will be saved to <code style={{ background: "rgba(36,123,150,0.08)", padding: "1px 6px", borderRadius: 4, fontSize: 12, fontFamily: "ui-monospace, Menlo, monospace" }}>public/gtm/{solution}-pitch-deck.html</code>.
            </p>
          </div>
          <button
            onClick={() => { navigator.clipboard.writeText(pitchDeckPrompt); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
            style={{ ...outputActionStyle, height: 38, padding: "0 14px", fontSize: 12 }}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "Copied" : "Copy Prompt"}
          </button>
        </div>
        <pre
          style={{
            margin: 0,
            padding: "16px 20px",
            background: "var(--gtm-bg-page)",
            border: "1px solid var(--gtm-border)",
            borderRadius: 6,
            fontSize: 12,
            lineHeight: 1.55,
            color: "var(--gtm-text-primary)",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            maxHeight: 360,
            overflow: "auto",
          }}
        >{pitchDeckPrompt}</pre>
      </div>
    )}

    {/* ─── Publish-to-Microsite modal ────────────────────────────────────── */}
    {publishOpen && (
      <div
        onClick={(e) => { if (e.target === e.currentTarget) setPublishOpen(false) }}
        style={{
          position: "fixed", inset: 0, background: "rgba(24,24,24,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 100, padding: 20,
        }}
      >
        <div
          style={{
            background: "var(--gtm-bg-card)",
            border: "1px solid var(--gtm-border)",
            borderRadius: 6,
            padding: 24,
            width: "100%", maxWidth: 480,
            display: "flex", flexDirection: "column", gap: 16,
            fontFamily: font,
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "var(--gtm-text-primary)" }}>Publish Microsite</h3>
            <p style={{ margin: "4px 0 0 0", fontSize: 13, color: "var(--gtm-text-secondary)" }}>
              Publishes the generated HTML to Vercel Blob at a permanent URL.
            </p>
          </div>

          {publishResult?.blobUrl ? (
            <div style={{ background: "rgba(43, 191, 168, 0.08)", border: "1px solid rgba(43, 191, 168, 0.3)", borderRadius: 6, padding: 12 }}>
              <p style={{ margin: "0 0 8px 0", fontSize: 13, fontWeight: 600, color: "#2bbfa8" }}>Published.</p>
              <a href={publishResult.blobUrl} target="_blank" rel="noopener" style={{ fontSize: 12, color: "#247b96", wordBreak: "break-all" }}>
                {publishResult.blobUrl}
              </a>
            </div>
          ) : (
            <>
              <FormField label="Slug">
                <input
                  type="text"
                  value={publishSlug}
                  onChange={(e) => setPublishSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                  placeholder="e.g. acme-2026-activation"
                  style={inputStyle}
                  autoFocus
                />
              </FormField>
              <FormField label="Title">
                <input
                  type="text"
                  value={publishTitle}
                  onChange={(e) => setPublishTitle(e.target.value)}
                  placeholder={`${solutionLabel} Microsite`}
                  style={inputStyle}
                />
              </FormField>
              <FormField label="Description (optional)">
                <input
                  type="text"
                  value={publishDesc}
                  onChange={(e) => setPublishDesc(e.target.value)}
                  placeholder="One-line summary"
                  style={inputStyle}
                />
              </FormField>
            </>
          )}

          {publishResult?.error && (
            <div style={{ background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: 6, padding: 12, fontSize: 13, color: "#b91c1c" }}>
              {publishResult.error}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button
              onClick={() => { setPublishOpen(false); setPublishResult(null); setPublishSlug(""); setPublishTitle(""); setPublishDesc("") }}
              style={{ ...outputActionStyle, height: 38, padding: "0 14px", fontSize: 12 }}
            >
              {publishResult?.blobUrl ? "Close" : "Cancel"}
            </button>
            {!publishResult?.blobUrl && (
              <button
                onClick={handlePublishMicrosite}
                disabled={!publishSlug.trim() || publishing}
                style={{
                  height: 38, padding: "0 16px",
                  background: publishing || !publishSlug.trim() ? "var(--gtm-text-faint)" : "#247b96",
                  color: "#fff", border: "none", borderRadius: 6,
                  fontFamily: font, fontSize: 13, fontWeight: 600,
                  cursor: publishing || !publishSlug.trim() ? "not-allowed" : "pointer",
                  display: "inline-flex", alignItems: "center", gap: 8,
                }}
              >
                {publishing ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Publishing...</> : <><Send size={14} /> Publish</>}
              </button>
            )}
          </div>
        </div>
      </div>
    )}

    </div>
  )
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--gtm-text-faint)" }}>
        {label}
      </span>
      {children}
    </label>
  )
}

const inputStyle: React.CSSProperties = {
  fontFamily: font,
  fontSize: 13,
  padding: "10px 12px",
  height: 38,
  boxSizing: "border-box",
  border: "1px solid var(--gtm-border)",
  borderRadius: 6,
  background: "#fff",
  color: "var(--gtm-text-primary)",
  outline: "none",
}

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: "pointer",
}

const outputActionStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  padding: "4px 10px",
  fontSize: 11,
  fontWeight: 600,
  fontFamily: font,
  border: "1px solid var(--gtm-border)",
  background: "#fff",
  color: "var(--gtm-text-secondary)",
  borderRadius: 6,
  cursor: "pointer",
}
