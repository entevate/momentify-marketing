"use client"

import React, { useState, useCallback, useRef, useMemo } from "react"
import {
  Sparkles,
  Lock,
  FileText,
  Share2,
  MessageSquare,
  BookOpen,
  Phone,
  Handshake,
  Shield,
  Globe,
  FileBarChart,
  Copy,
  Check,
  RotateCw,
  ThumbsUp,
  ThumbsDown,
  BookmarkCheck,
  CalendarPlus,
  ExternalLink,
  Terminal,
} from "lucide-react"
import CanvasEditor from "@/components/social-toolkit/CanvasEditor"
import {
  type AspectRatio,
  type BackgroundDef,
  getBrand,
} from "@/components/social-toolkit/backgroundData"
import { buildAssetPrompt } from "@/lib/gtm/asset-prompts"

const font = "'Inter', system-ui, -apple-system, sans-serif"

/** Map solution IDs to brand IDs for CanvasEditor */
const solutionToBrandId: Record<string, string> = {
  "trade-shows": "trade-shows",
  recruiting: "recruiting",
  "field-sales": "field-sales",
  facilities: "facilities",
  "events-venues": "venues",
}

type Platform = "linkedin" | "instagram" | "twitter"

const platformConfig: Record<Platform, { label: string; aspect: AspectRatio; fontScale: number; marginScale: number; logoScale: number }> = {
  linkedin: { label: "LinkedIn", aspect: "1.91:1", fontScale: 0.696, marginScale: 1.0, logoScale: 100 },
  instagram: { label: "Instagram", aspect: "4:5", fontScale: 1.09, marginScale: 1.5, logoScale: 127 },
  twitter: { label: "Twitter/X", aspect: "16:9", fontScale: 0.66, marginScale: 1.0, logoScale: 100 },
}

interface PlatformContent {
  headline: string
  subhead: string
  post: string
}

interface GraphicState {
  stage: "none" | "template" | "captured"
  backgroundIndex: number
  thumbnail: string | null
}

export const contentTypes = [
  {
    key: "cold-emails",
    label: "Cold Outreach Emails",
    desc: "3-touch sequence, Day 0/4/9",
    icon: FileText,
  },
  {
    key: "social-post",
    label: "Social Post",
    desc: "3 platform versions with branded graphic",
    icon: Share2,
  },
  {
    key: "linkedin-dm",
    label: "LinkedIn DM Script",
    desc: "3-message sequence",
    icon: MessageSquare,
  },
  {
    key: "lead-magnet",
    label: "Lead Magnet Outline",
    desc: "Full content brief for designer/writer",
    icon: BookOpen,
  },
  {
    key: "discovery-script",
    label: "Discovery Call Script",
    desc: "Questions, objections, soft close",
    icon: Phone,
  },
  {
    key: "partner-pitch",
    label: "Partner Pitch Narrative",
    desc: "Co-sell model pitch",
    icon: Handshake,
  },
  {
    key: "battle-card",
    label: "Competitive Battle Card",
    desc: "Kill sheet vs Cvent, Whova, or Hopin",
    icon: Shield,
  },
  {
    key: "microsite",
    label: "Microsite Brief",
    desc: "Landing page structure and copy framework",
    icon: Globe,
  },
  {
    key: "one-pager",
    label: "One Pager",
    desc: "Single-page sales leave-behind",
    icon: FileBarChart,
  },
]

const defaultVerticals = [
  { key: "heavy-equipment", label: "Heavy Equipment" },
  { key: "energy-infrastructure", label: "Energy & Infrastructure" },
  { key: "aerospace-aviation", label: "Aerospace & Aviation" },
]

const competitors = ["Cvent", "Whova", "Hopin"]

function FieldLabel({ label, optional }: { label: string; optional?: boolean }) {
  return (
    <p
      style={{
        fontSize: 11,
        fontWeight: 600,
        color: "var(--gtm-text-faint)",
        letterSpacing: "0.1em",
        fontFamily: font,
        marginBottom: 8,
        textTransform: "uppercase",
      }}
    >
      {label}
      {optional && (
        <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>
          {" "}
          (optional)
        </span>
      )}
    </p>
  )
}

/** Parse structured multi-platform response */
function parseSocialOutput(raw: string): Record<Platform, PlatformContent> {
  const result: Record<Platform, PlatformContent> = {
    linkedin: { headline: "", subhead: "", post: "" },
    instagram: { headline: "", subhead: "", post: "" },
    twitter: { headline: "", subhead: "", post: "" },
  }

  const platformMap: Record<string, Platform> = {
    "LINKEDIN": "linkedin",
    "INSTAGRAM": "instagram",
    "TWITTER": "twitter",
  }

  for (const [marker, platform] of Object.entries(platformMap)) {
    const regex = new RegExp(`---${marker}---([\\s\\S]*?)(?=---[A-Z]+---|$)`)
    const match = raw.match(regex)
    if (!match) continue

    const section = match[1]
    const headlineMatch = section.match(/HEADLINE:\s*(.+)/i)
    const subheadMatch = section.match(/SUBHEAD:\s*(.+)/i)
    const postMatch = section.match(/POST:\s*([\s\S]*?)$/i)

    if (headlineMatch) result[platform].headline = headlineMatch[1].trim()
    if (subheadMatch) result[platform].subhead = subheadMatch[1].trim()
    if (postMatch) result[platform].post = postMatch[1].trim()
  }

  return result
}

export default function ContentBuilder({
  solution,
  solutionLabel,
  verticals = defaultVerticals,
  onLibraryChange,
}: {
  solution: string
  solutionLabel: string
  verticals?: { key: string; label: string }[]
  onLibraryChange?: () => void
}) {
  const [motion, setMotion] = useState<"direct" | "partner" | null>(null)
  const [vertical, setVertical] = useState<string | null>(null)
  const [selectedContent, setSelectedContent] = useState<string | null>(null)
  const [competitor, setCompetitor] = useState<string | null>(null)
  const [context, setContext] = useState("")
  const [output, setOutput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null)
  const [saved, setSaved] = useState(false)
  const [showScheduler, setShowScheduler] = useState(false)
  const [scheduleDate, setScheduleDate] = useState("")
  const [scheduled, setScheduled] = useState(false)
  const [promptCopied, setPromptCopied] = useState(false)
  const [assetPromptCopied, setAssetPromptCopied] = useState(false)
  const [showAssetPrompt, setShowAssetPrompt] = useState(false)

  // Social post state
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>("linkedin")
  const [platformContent, setPlatformContent] = useState<Record<Platform, PlatformContent> | null>(null)

  // Graphic state
  const [graphicStage, setGraphicStage] = useState<"none" | "template" | "captured">("none")
  const [selectedBgIndex, setSelectedBgIndex] = useState(0)

  // Per-platform graphic cache (ref to avoid stale closures)
  const platformGraphicsRef = useRef<Record<string, GraphicState>>({})

  const isSocialPost = selectedContent === "social-post"
  const brandId = solutionToBrandId[solution] || "momentify"
  const brand = useMemo(() => getBrand(brandId), [brandId])

  const canGenerate =
    motion !== null &&
    selectedContent !== null &&
    (motion === "partner" || vertical !== null) &&
    (selectedContent !== "battle-card" || competitor !== null) &&
    !loading

  const generate = useCallback(async () => {
    if (!canGenerate) return
    setLoading(true)
    setError("")
    setOutput("")
    setFeedback(null)
    setPlatformContent(null)
    setGraphicStage("none")
    setSelectedBgIndex(0)
    platformGraphicsRef.current = {}

    try {
      const res = await fetch("/api/gtm/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          solution,
          vertical: motion === "partner" ? verticals[0]?.key || vertical : vertical,
          motion,
          contentType: selectedContent,
          additionalContext: context || undefined,
          competitor: selectedContent === "battle-card" ? competitor : undefined,
        }),
      })

      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        const raw = data.content || ""
        setOutput(raw)
        if (selectedContent === "social-post") {
          const parsed = parseSocialOutput(raw)
          setPlatformContent(parsed)
          setGraphicStage("template")
        }
      }
    } catch {
      setError("Generation failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [canGenerate, solution, vertical, motion, selectedContent, context, competitor, verticals])

  const currentPlatformText = useMemo(() => {
    if (!isSocialPost || !platformContent) return output
    return platformContent[selectedPlatform]?.post || output
  }, [isSocialPost, platformContent, selectedPlatform, output])

  const currentHeadline = platformContent?.[selectedPlatform]?.headline || ""
  const currentSubhead = platformContent?.[selectedPlatform]?.subhead || ""

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(isSocialPost ? currentPlatformText : output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [output, currentPlatformText, isSocialPost])

  const handlePlatformSwitch = useCallback((newPlatform: Platform) => {
    // Save current platform's graphic state
    platformGraphicsRef.current[selectedPlatform] = {
      stage: graphicStage,
      backgroundIndex: selectedBgIndex,
      thumbnail: null,
    }

    // Restore new platform's cached state or show fresh template
    const cached = platformGraphicsRef.current[newPlatform]
    if (cached) {
      setGraphicStage(cached.stage)
      setSelectedBgIndex(cached.backgroundIndex)
    } else {
      setGraphicStage(platformContent ? "template" : "none")
      setSelectedBgIndex(0)
    }

    setSelectedPlatform(newPlatform)
  }, [selectedPlatform, graphicStage, selectedBgIndex])

  const handleSave = useCallback(async () => {
    if (!output || !motion || !selectedContent) return

    const tags = [motion, ...(vertical ? [vertical] : []), selectedContent]

    const newItem = {
      id: `content-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      contentType: selectedContent,
      motion,
      solution,
      content: isSocialPost ? currentPlatformText : output,
      createdAt: new Date().toISOString(),
      tags,
    }

    try {
      const res = await fetch("/api/gtm/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
        onLibraryChange?.()
      }
    } catch {
      // Fall through silently
    }
  }, [output, motion, vertical, selectedContent, solution, onLibraryChange, isSocialPost, currentPlatformText])

  const handleSchedule = useCallback(async () => {
    if (!scheduleDate || !output || !motion || !selectedContent) return

    const dtParts = scheduleDate.split("T")
    const dateOnly = dtParts[0]
    const hour = dtParts[1] ? parseInt(dtParts[1].split(":")[0], 10) : 9
    const timeSlot: "morning" | "afternoon" = hour < 12 ? "morning" : "afternoon"

    const ct = contentTypes.find((c) => c.key === selectedContent)
    const categoryMap: Record<string, string> = {
      "social-post": "linkedin-post",
      "cold-emails": "cold-email",
      "linkedin-dm": "cold-email",
      "lead-magnet": "lead-magnet",
      "discovery-script": "discovery-call",
      "partner-pitch": "partner-outreach",
      "battle-card": "content-creation",
      "microsite": "content-creation",
      "one-pager": "content-creation",
    }

    const newTask = {
      id: `task-scheduled-${crypto.randomUUID().slice(0, 8)}`,
      title: `${ct?.label || selectedContent}: ${output.slice(0, 60).replace(/\n/g, " ")}...`,
      category: categoryMap[selectedContent] || "content-creation",
      solution,
      date: dateOnly,
      timeSlot,
      duration: 30,
      completed: false,
      description: output.slice(0, 500),
      sortOrder: 99,
      roxTouchpoint: "Engagement Quality",
    }

    try {
      const res = await fetch("/api/gtm/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      })
      if (res.ok) {
        setScheduled(true)
        setShowScheduler(false)
        setTimeout(() => setScheduled(false), 3000)
      }
    } catch {
      // Fall through silently
    }
  }, [scheduleDate, output, motion, selectedContent, solution])

  const contentTypeLabel =
    contentTypes.find((c) => c.key === selectedContent)?.label || ""

  // Graphic config for current platform
  const platformCfg = platformConfig[selectedPlatform]
  const currentBg: BackgroundDef | null = brand.backgrounds[selectedBgIndex] || brand.backgrounds[0]

  return (
    <div
      style={{
        display: "flex",
        minHeight: "calc(100vh - 200px)",
      }}
    >
      {/* Left Panel: Controls */}
      <div
        style={{
          width: 300,
          flexShrink: 0,
          background: "var(--gtm-bg-card)",
          borderRight: "1px solid var(--gtm-border)",
          padding: 28,
          overflowY: "auto",
          transition: "all 200ms ease",
        }}
      >
        {/* Solution (read-only) */}
        <div style={{ marginBottom: 24 }}>
          <FieldLabel label="Solution" />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 14,
              fontWeight: 700,
              color: "var(--gtm-text-primary)",
              fontFamily: font,
              transition: "color 200ms ease",
            }}
          >
            <Lock size={14} style={{ color: "var(--gtm-text-faint)" }} />
            {solutionLabel}
          </div>
        </div>

        {/* Motion */}
        <div style={{ marginBottom: 24 }}>
          <FieldLabel label="Motion" />
          <div style={{ display: "flex", gap: 6 }}>
            {(["direct", "partner"] as const).map((m) => {
              const selected = motion === m
              return (
                <button
                  key={m}
                  onClick={() => {
                    setMotion(m)
                    if (m === "partner") setVertical(null)
                    else if (verticals.length === 1) setVertical(verticals[0].key)
                  }}
                  style={{
                    flex: 1,
                    padding: "8px 14px",
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: font,
                    cursor: "pointer",
                    border: selected
                      ? "1px solid transparent"
                      : "1px solid var(--gtm-border)",
                    background: selected
                      ? "var(--gtm-text-primary)"
                      : "var(--gtm-bg-card)",
                    color: selected
                      ? "var(--gtm-bg-page)"
                      : "var(--gtm-text-muted)",
                    transition: "all 150ms ease",
                  }}
                >
                  {m === "direct" ? "Direct" : "Partners"}
                </button>
              )
            })}
          </div>
        </div>

        {/* Vertical (hidden for partner motion) */}
        {motion === "direct" && (
          <div style={{ marginBottom: 24 }}>
            <FieldLabel label="Vertical" />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {verticals.map((v) => {
                const selected = vertical === v.key
                return (
                  <button
                    key={v.key}
                    onClick={() => setVertical(v.key)}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      fontFamily: font,
                      textAlign: "left",
                      cursor: "pointer",
                      border: selected
                        ? "1px solid var(--gtm-accent)"
                        : "1px solid var(--gtm-border)",
                      background: selected
                        ? "var(--gtm-accent-bg)"
                        : "var(--gtm-bg-card)",
                      color: "var(--gtm-text-primary)",
                      transition: "all 150ms ease",
                    }}
                  >
                    {v.label}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Content Type */}
        <div style={{ marginBottom: 24 }}>
          <FieldLabel label="Content Type" />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {contentTypes.map((ct) => {
              const selected = selectedContent === ct.key
              const Icon = ct.icon
              return (
                <React.Fragment key={ct.key}>
                  <button
                    onClick={() => {
                      setSelectedContent(ct.key)
                      if (ct.key !== "battle-card") setCompetitor(null)
                    }}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      padding: "12px 14px",
                      borderRadius: 8,
                      textAlign: "left",
                      cursor: "pointer",
                      border: selected
                        ? "1px solid var(--gtm-border)"
                        : "1px solid var(--gtm-border)",
                      borderLeft: selected
                        ? "2px solid var(--gtm-accent)"
                        : "1px solid var(--gtm-border)",
                      background: selected
                        ? "var(--gtm-accent-bg)"
                        : "transparent",
                      transition: "all 150ms ease",
                    }}
                  >
                    <Icon
                      size={16}
                      style={{
                        color: "var(--gtm-accent)",
                        marginTop: 1,
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "var(--gtm-text-primary)",
                          fontFamily: font,
                          margin: 0,
                          transition: "color 200ms ease",
                        }}
                      >
                        {ct.label}
                      </p>
                      <p
                        style={{
                          fontSize: 11,
                          color: "var(--gtm-text-muted)",
                          fontFamily: font,
                          margin: "2px 0 0",
                          transition: "color 200ms ease",
                        }}
                      >
                        {ct.desc}
                      </p>
                    </div>
                  </button>

                  {/* Platform sub-selector inline under Social Post */}
                  {ct.key === "social-post" && selected && (
                    <div style={{ marginLeft: 26, marginTop: -2, marginBottom: 2 }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        {(Object.keys(platformConfig) as Platform[]).map((p) => {
                          const active = selectedPlatform === p
                          const cfg = platformConfig[p]
                          const charNote = p === "linkedin" ? "150-250 words" : p === "instagram" ? "80-150 words" : "280 chars max"
                          return (
                            <button
                              key={p}
                              onClick={() => setSelectedPlatform(p)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "5px 10px",
                                borderRadius: 6,
                                fontSize: 11,
                                fontWeight: 600,
                                fontFamily: font,
                                cursor: "pointer",
                                border: active
                                  ? "1px solid var(--gtm-accent)"
                                  : "1px solid var(--gtm-border)",
                                background: active
                                  ? "var(--gtm-accent-bg)"
                                  : "transparent",
                                color: active
                                  ? "var(--gtm-accent)"
                                  : "var(--gtm-text-muted)",
                                transition: "all 150ms ease",
                              }}
                            >
                              <span>{cfg.label}</span>
                              <span style={{ fontSize: 10, fontWeight: 400, opacity: 0.7 }}>
                                {charNote} / {cfg.aspect}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                      <p style={{
                        fontSize: 10, color: "var(--gtm-text-faint)", fontFamily: font,
                        marginTop: 4, lineHeight: 1.4, marginBottom: 0,
                      }}>
                        All 3 generate together. This sets the default view.
                      </p>
                    </div>
                  )}
                </React.Fragment>
              )
            })}
          </div>

          {/* Competitor sub-selector */}
          {selectedContent === "battle-card" && (
            <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
              {competitors.map((c) => {
                const selected = competitor === c
                return (
                  <button
                    key={c}
                    onClick={() => setCompetitor(c)}
                    style={{
                      flex: 1,
                      padding: "6px 10px",
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      fontFamily: font,
                      cursor: "pointer",
                      border: selected
                        ? "1px solid var(--gtm-accent)"
                        : "1px solid var(--gtm-border)",
                      background: selected
                        ? "var(--gtm-accent-bg)"
                        : "transparent",
                      color: selected
                        ? "var(--gtm-accent)"
                        : "var(--gtm-text-muted)",
                      transition: "all 150ms ease",
                    }}
                  >
                    {c}
                  </button>
                )
              })}
            </div>
          )}

        </div>

        {/* Additional Context */}
        <div style={{ marginBottom: 24 }}>
          <FieldLabel label="Additional Context" optional />
          <textarea
            value={context}
            onChange={(e) =>
              setContext(e.target.value.slice(0, 300))
            }
            rows={4}
            placeholder="Company name, specific event, role, custom angle..."
            style={{
              width: "100%",
              fontSize: 13,
              fontFamily: font,
              border: "1px solid var(--gtm-border)",
              borderRadius: 8,
              padding: "10px 12px",
              background: "var(--gtm-bg-card)",
              color: "var(--gtm-text-primary)",
              resize: "vertical",
              outline: "none",
              transition: "all 200ms ease",
              boxSizing: "border-box",
            }}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = "var(--gtm-accent)")
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = "var(--gtm-border)")
            }
          />
          <p
            style={{
              fontSize: 11,
              color: "var(--gtm-text-faint)",
              fontFamily: font,
              textAlign: "right",
              marginTop: 4,
            }}
          >
            {context.length} / 300
          </p>
        </div>

        {/* Generate Button */}
        <button
          onClick={generate}
          disabled={!canGenerate}
          style={{
            width: "100%",
            height: 44,
            borderRadius: 8,
            border: "none",
            background: canGenerate
              ? "var(--gtm-accent-grad)"
              : "var(--gtm-border)",
            color: canGenerate ? "#FFFFFF" : "var(--gtm-text-faint)",
            fontSize: 15,
            fontWeight: 700,
            fontFamily: font,
            cursor: canGenerate ? "pointer" : "not-allowed",
            opacity: canGenerate ? 1 : 0.4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            transition: "all 200ms ease",
          }}
        >
          <Sparkles size={16} />
          {loading ? "Generating..." : "Generate"}
        </button>

        {error && (
          <p
            style={{
              fontSize: 13,
              color: "#ef4444",
              fontFamily: font,
              marginTop: 12,
            }}
          >
            {error}
          </p>
        )}
      </div>

      {/* Right Panel: Output */}
      <div
        style={{
          flex: 1,
          background: "var(--gtm-bg-page)",
          padding: 28,
          overflowY: "auto",
          transition: "background 200ms ease",
        }}
      >
        {loading ? (
          <div style={{ padding: "60px 0" }}>
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                style={{
                  height: 14,
                  borderRadius: 6,
                  background: "var(--gtm-border)",
                  marginBottom: 12,
                  width: `${100 - n * 15}%`,
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
            ))}
            <p
              style={{
                fontSize: 13,
                color: "var(--gtm-text-muted)",
                fontFamily: font,
                marginTop: 24,
                transition: "color 200ms ease",
              }}
            >
              Building your content...
            </p>
            <style>{`@keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }`}</style>
          </div>
        ) : output ? (
          <div>
            {/* Header row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 20,
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "var(--gtm-text-primary)",
                    fontFamily: font,
                    transition: "color 200ms ease",
                  }}
                >
                  {contentTypeLabel}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "3px 8px",
                    borderRadius: 4,
                    background: "var(--gtm-accent-bg)",
                    color: "var(--gtm-accent-text)",
                    fontFamily: font,
                  }}
                >
                  {motion === "direct" ? "Direct" : "Partner"}
                </span>
                {vertical && motion === "direct" && (
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: "3px 8px",
                      borderRadius: 4,
                      background: "var(--gtm-accent-bg)",
                      color: "var(--gtm-accent-text)",
                      fontFamily: font,
                    }}
                  >
                    {verticals.find((v) => v.key === vertical)?.label}
                  </span>
                )}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={handleCopy}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 12px",
                    borderRadius: 6,
                    border: "1px solid var(--gtm-border)",
                    background: "var(--gtm-bg-card)",
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: font,
                    color: copied
                      ? "var(--gtm-accent)"
                      : "var(--gtm-text-primary)",
                    cursor: "pointer",
                    transition: "all 200ms ease",
                  }}
                >
                  {copied ? (
                    <>
                      <Check size={14} /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> Copy All
                    </>
                  )}
                </button>
                <button
                  onClick={generate}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 12px",
                    borderRadius: 6,
                    border: "1px solid var(--gtm-border)",
                    background: "var(--gtm-bg-card)",
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: font,
                    color: "var(--gtm-text-primary)",
                    cursor: "pointer",
                    transition: "all 200ms ease",
                  }}
                >
                  <RotateCw size={14} /> Regenerate
                </button>
              </div>
            </div>

            {/* Platform selector for social posts */}
            {isSocialPost && platformContent && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", gap: 4 }}>
                  {(Object.keys(platformConfig) as Platform[]).map((p) => {
                    const active = selectedPlatform === p
                    return (
                      <button
                        key={p}
                        onClick={() => handlePlatformSwitch(p)}
                        style={{
                          padding: "6px 16px",
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 600,
                          fontFamily: font,
                          cursor: "pointer",
                          border: active ? "1px solid var(--gtm-accent)" : "1px solid var(--gtm-border)",
                          background: active ? "var(--gtm-accent-bg)" : "transparent",
                          color: active ? "var(--gtm-accent)" : "var(--gtm-text-muted)",
                          transition: "all 150ms ease",
                        }}
                      >
                        {platformConfig[p].label}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Output body */}
            <div
              style={{
                background: "var(--gtm-bg-card)",
                borderRadius: 10,
                padding: 24,
                border: "1px solid var(--gtm-border)",
                transition: "all 200ms ease",
              }}
            >
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  fontFamily: font,
                  fontSize: 14,
                  lineHeight: 1.75,
                  color: "var(--gtm-text-primary)",
                  margin: 0,
                  transition: "color 200ms ease",
                  textWrap: "pretty" as React.CSSProperties["textWrap"],
                  widows: 2,
                  orphans: 2,
                }}
              >
                {isSocialPost && platformContent ? currentPlatformText : output}
              </pre>
            </div>

            {/* Branded graphic for social posts */}
            {isSocialPost && platformContent && (
              <div style={{ marginTop: 20 }}>
                {graphicStage === "none" ? (
                  <button
                    onClick={() => setGraphicStage("template")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "10px 16px",
                      borderRadius: 8,
                      border: "1px solid var(--gtm-border)",
                      background: "var(--gtm-bg-card)",
                      fontSize: 13,
                      fontWeight: 600,
                      fontFamily: font,
                      color: "var(--gtm-text-primary)",
                      cursor: "pointer",
                      transition: "all 150ms ease",
                    }}
                  >
                    <Sparkles size={14} /> Generate Graphic
                  </button>
                ) : (
                  <div
                    style={{
                      background: "var(--gtm-bg-card)",
                      borderRadius: 10,
                      padding: 20,
                      border: "1px solid var(--gtm-border)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "var(--gtm-text-primary)", fontFamily: font }}>
                        Branded Graphic ({platformCfg.label} - {platformCfg.aspect})
                      </span>
                      <div style={{ display: "flex", gap: 4 }}>
                        {brand.backgrounds.map((bg, i) => (
                          <button
                            key={bg.id}
                            onClick={() => setSelectedBgIndex(i)}
                            title={bg.label}
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: 6,
                              background: bg.gradient,
                              border: i === selectedBgIndex ? "2px solid var(--gtm-accent)" : "2px solid transparent",
                              cursor: "pointer",
                              transition: "border-color 150ms ease",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <div style={{ borderRadius: 8, overflow: "hidden", border: "1px solid var(--gtm-border)" }}>
                      <CanvasEditor
                        aspectRatio={platformCfg.aspect}
                        background={currentBg}
                        brandId={brandId}
                        headline={currentHeadline}
                        subhead={currentSubhead}
                        bodyCopy=""
                        textPosition="center"
                        showLogo={true}
                        logoVariant="auto"
                        logoScale={platformCfg.logoScale}
                        showUrl={false}
                        urlScale={100}
                        headlineFontSize={Math.round(108 * platformCfg.fontScale)}
                        headlineFontWeight={600}
                        subheadFontSize={Math.round(44 * platformCfg.fontScale)}
                        subheadFontWeight={300}
                        bodyFontSize={Math.round(18 * platformCfg.fontScale)}
                        bodyFontWeight={300}
                        headlineAlign="left"
                        subheadAlign="left"
                        bodyAlign="left"
                        layoutMargin={Math.round(60 * platformCfg.marginScale)}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Feedback row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginTop: 20,
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  color: "var(--gtm-text-muted)",
                  fontFamily: font,
                }}
              >
                Was this useful?
              </span>
              <button
                onClick={() => setFeedback("up")}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 4,
                  color:
                    feedback === "up"
                      ? "var(--gtm-accent)"
                      : "var(--gtm-text-faint)",
                  transition: "color 200ms ease",
                }}
              >
                <ThumbsUp size={16} fill={feedback === "up" ? "currentColor" : "none"} />
              </button>
              <button
                onClick={() => setFeedback("down")}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 4,
                  color: feedback === "down" ? "#ef4444" : "var(--gtm-text-faint)",
                  transition: "color 200ms ease",
                }}
              >
                <ThumbsDown
                  size={16}
                  fill={feedback === "down" ? "currentColor" : "none"}
                />
              </button>
              <span
                style={{
                  fontSize: 12,
                  color: "var(--gtm-text-faint)",
                  fontFamily: font,
                  marginLeft: "auto",
                }}
              >
                Review all content before sending.
              </span>
            </div>

            {/* Deployment actions */}
            {isSocialPost && platformContent && (
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                {selectedPlatform === "linkedin" && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(currentPlatformText)
                      window.open("https://www.linkedin.com/feed/", "_blank")
                    }}
                    style={{
                      display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 6,
                      border: "1px solid var(--gtm-border)", background: "transparent", fontSize: 12,
                      fontWeight: 600, fontFamily: font, color: "var(--gtm-text-muted)", cursor: "pointer",
                      transition: "all 150ms ease",
                    }}
                  >
                    <ExternalLink size={14} /> Copy for LinkedIn
                  </button>
                )}
                {selectedPlatform === "twitter" && (
                  <button
                    onClick={() => {
                      const text = encodeURIComponent(currentPlatformText)
                      window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank")
                    }}
                    style={{
                      display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 6,
                      border: "1px solid var(--gtm-border)", background: "transparent", fontSize: 12,
                      fontWeight: 600, fontFamily: font, color: "var(--gtm-text-muted)", cursor: "pointer",
                      transition: "all 150ms ease",
                    }}
                  >
                    <ExternalLink size={14} /> Copy for Twitter/X
                  </button>
                )}
                {selectedPlatform === "instagram" && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(currentPlatformText)
                      setCopied(true)
                      setTimeout(() => setCopied(false), 2000)
                    }}
                    style={{
                      display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 6,
                      border: "1px solid var(--gtm-border)", background: "transparent", fontSize: 12,
                      fontWeight: 600, fontFamily: font, color: "var(--gtm-text-muted)", cursor: "pointer",
                      transition: "all 150ms ease",
                    }}
                  >
                    <Copy size={14} /> Copy for Instagram
                  </button>
                )}
              </div>
            )}

            {/* Non-social deployment actions */}
            {!isSocialPost && output && (
              <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
                {selectedContent === "cold-emails" && (
                  <button
                    onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
                    style={{
                      display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 6,
                      border: "1px solid var(--gtm-border)", background: "transparent", fontSize: 12,
                      fontWeight: 600, fontFamily: font, color: "var(--gtm-text-muted)", cursor: "pointer",
                      transition: "all 150ms ease",
                    }}
                  >
                    <Copy size={14} /> Copy to Email Platform
                  </button>
                )}
                {selectedContent === "linkedin-dm" && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(output)
                      window.open("https://www.linkedin.com/sales/", "_blank")
                    }}
                    style={{
                      display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 6,
                      border: "1px solid var(--gtm-border)", background: "transparent", fontSize: 12,
                      fontWeight: 600, fontFamily: font, color: "var(--gtm-text-muted)", cursor: "pointer",
                      transition: "all 150ms ease",
                    }}
                  >
                    <ExternalLink size={14} /> Copy DM Sequence
                  </button>
                )}
                {["lead-magnet", "partner-pitch", "battle-card", "discovery-script", "one-pager"].includes(selectedContent!) && (
                  <button
                    onClick={() => setShowAssetPrompt(!showAssetPrompt)}
                    style={{
                      display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 6,
                      border: showAssetPrompt ? "1px solid var(--gtm-accent)" : "1px solid var(--gtm-border)",
                      background: showAssetPrompt ? "var(--gtm-accent-bg)" : "transparent", fontSize: 12,
                      fontWeight: 600, fontFamily: font,
                      color: showAssetPrompt ? "var(--gtm-accent)" : "var(--gtm-text-muted)", cursor: "pointer",
                      transition: "all 150ms ease",
                    }}
                  >
                    <Terminal size={14} /> {showAssetPrompt ? "Hide Asset Prompt" : "Generate Asset Prompt"}
                  </button>
                )}
              </div>
            )}

            {/* Asset prompt display */}
            {showAssetPrompt && selectedContent && output && (
              <div style={{
                marginTop: 16,
                padding: 20,
                borderRadius: 10,
                border: "1px solid var(--gtm-border)",
                background: "var(--gtm-bg-card)",
                transition: "all 200ms ease",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--gtm-text-primary)", fontFamily: font }}>
                    Claude Code Prompt
                  </span>
                  <button
                    onClick={() => {
                      const prompt = buildAssetPrompt(selectedContent, solution, output)
                      navigator.clipboard.writeText(prompt)
                      setAssetPromptCopied(true)
                      setTimeout(() => setAssetPromptCopied(false), 2000)
                    }}
                    style={{
                      display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 6,
                      border: "1px solid var(--gtm-border)",
                      background: assetPromptCopied ? "var(--gtm-accent-bg)" : "transparent",
                      fontSize: 12, fontWeight: 600, fontFamily: font,
                      color: assetPromptCopied ? "var(--gtm-accent)" : "var(--gtm-text-muted)",
                      cursor: "pointer", transition: "all 150ms ease",
                    }}
                  >
                    {assetPromptCopied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy Prompt</>}
                  </button>
                </div>
                <pre style={{
                  whiteSpace: "pre-wrap", wordBreak: "break-word", fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11, lineHeight: 1.6, color: "var(--gtm-text-muted)", margin: 0,
                  maxHeight: 300, overflow: "auto", padding: 12, borderRadius: 6,
                  background: "var(--gtm-bg-page)", border: "1px solid var(--gtm-border)",
                }}>
                  {buildAssetPrompt(selectedContent, solution, output)}
                </pre>
                <p style={{ fontSize: 11, color: "var(--gtm-text-faint)", fontFamily: font, marginTop: 8, margin: "8px 0 0" }}>
                  Copy this prompt and paste it into Claude Code to generate a branded asset from the brief above.
                </p>
              </div>
            )}

            {/* Save & Schedule actions */}
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button
                onClick={handleSave}
                disabled={saved}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 14px",
                  borderRadius: 6,
                  border: saved ? "1px solid var(--gtm-accent)" : "1px solid var(--gtm-border)",
                  background: saved ? "var(--gtm-accent-bg)" : "transparent",
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: font,
                  color: saved ? "var(--gtm-accent)" : "var(--gtm-text-muted)",
                  cursor: saved ? "default" : "pointer",
                  transition: "all 150ms ease",
                }}
              >
                {saved ? <><BookmarkCheck size={14} /> Saved to Library</> : <><BookmarkCheck size={14} /> Save to Library</>}
              </button>

              {!showScheduler && !scheduled && (
                <button
                  onClick={() => setShowScheduler(true)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 14px",
                    borderRadius: 6,
                    border: "1px solid var(--gtm-border)",
                    background: "transparent",
                    fontSize: 12,
                    fontWeight: 600,
                    fontFamily: font,
                    color: "var(--gtm-text-muted)",
                    cursor: "pointer",
                    transition: "all 150ms ease",
                  }}
                >
                  <CalendarPlus size={14} /> Schedule to Calendar
                </button>
              )}
              {showScheduler && (
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <input
                    type="datetime-local"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 6,
                      border: "1px solid var(--gtm-border)",
                      background: "var(--gtm-bg-card)",
                      color: "var(--gtm-text-primary)",
                      fontSize: 12,
                      fontFamily: font,
                    }}
                  />
                  <button
                    onClick={handleSchedule}
                    disabled={!scheduleDate}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      fontFamily: font,
                      background: scheduleDate ? "var(--gtm-accent-bg)" : "transparent",
                      border: scheduleDate ? "1px solid var(--gtm-accent)" : "1px solid var(--gtm-border)",
                      color: scheduleDate ? "var(--gtm-accent)" : "var(--gtm-text-faint)",
                      opacity: scheduleDate ? 1 : 0.5,
                      cursor: scheduleDate ? "pointer" : "not-allowed",
                      transition: "all 150ms ease",
                    }}
                  >
                    Confirm
                  </button>
                </div>
              )}
              {scheduled && (
                <span style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: font,
                  color: "var(--gtm-accent)",
                }}>
                  <CalendarPlus size={14} /> Scheduled to Execution Calendar
                </span>
              )}
            </div>

            {/* Claude Code prompt for microsites */}
            {selectedContent === "microsite" && (
              <div style={{
                marginTop: 20,
                padding: 20,
                borderRadius: 10,
                border: "1px solid var(--gtm-border)",
                background: "var(--gtm-bg-card)",
                transition: "all 200ms ease",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--gtm-text-primary)",
                    fontFamily: font,
                  }}>
                    Build with Claude Code
                  </span>
                  <button
                    onClick={() => {
                      const prompt = `Build a microsite HTML page at Brand/gtm/${solution}-${vertical || "general"}.html using the panelmatic.html reference implementation at Brand/gtm/panelmatic.html. Follow the same structure: self-contained HTML, inline CSS, no build tools. Use the brand tokens from the brief below. Include all sections (Hero, Problem, Approach, Proof, How It Works, CTA + Form). Add scroll-reveal animations and responsive mobile styles.\n\nHere is the generated brief:\n\n${output}`
                      navigator.clipboard.writeText(prompt)
                      setPromptCopied(true)
                      setTimeout(() => setPromptCopied(false), 2000)
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 12px",
                      borderRadius: 6,
                      border: "1px solid var(--gtm-border)",
                      background: promptCopied ? "var(--gtm-accent-bg)" : "transparent",
                      fontSize: 12,
                      fontWeight: 600,
                      fontFamily: font,
                      color: promptCopied ? "var(--gtm-accent)" : "var(--gtm-text-muted)",
                      cursor: "pointer",
                      transition: "all 150ms ease",
                    }}
                  >
                    {promptCopied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy Prompt</>}
                  </button>
                </div>
                <p style={{
                  fontSize: 12,
                  color: "var(--gtm-text-muted)",
                  fontFamily: font,
                  lineHeight: 1.6,
                  margin: 0,
                }}>
                  Copy this prompt and paste it into Claude Code to generate a full HTML microsite from the brief above. It references <code style={{ fontSize: 11, background: "var(--gtm-bg-page)", padding: "1px 4px", borderRadius: 3 }}>panelmatic.html</code> as the template.
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Empty state */
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              minHeight: 400,
            }}
          >
            <div
              style={{
                border: "2px dashed var(--gtm-border)",
                borderRadius: 12,
                padding: 48,
                textAlign: "center",
                maxWidth: 400,
                transition: "border-color 200ms ease",
              }}
            >
              <Sparkles
                size={32}
                style={{ color: "var(--gtm-text-faint)", marginBottom: 16 }}
              />
              <p
                style={{
                  fontSize: 14,
                  color: "var(--gtm-text-muted)",
                  fontFamily: font,
                  margin: 0,
                  transition: "color 200ms ease",
                }}
              >
                Your generated content will appear here.
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--gtm-text-faint)",
                  fontFamily: font,
                  marginTop: 6,
                  transition: "color 200ms ease",
                }}
              >
                Select your options and hit Generate.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
