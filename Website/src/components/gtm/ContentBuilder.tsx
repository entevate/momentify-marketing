"use client"

import { useState, useCallback } from "react"
import {
  Sparkles,
  Lock,
  FileText,
  Linkedin,
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
} from "lucide-react"

const font = "'Inter', system-ui, -apple-system, sans-serif"

export const contentTypes = [
  {
    key: "cold-emails",
    label: "Cold Outreach Emails",
    desc: "3-touch sequence, Day 0/4/9",
    icon: FileText,
  },
  {
    key: "linkedin-post",
    label: "LinkedIn Post",
    desc: "Single post, 150-250 words",
    icon: Linkedin,
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

    try {
      const res = await fetch("/api/gtm/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          solution,
          vertical: motion === "partner" ? "heavy-equipment" : vertical,
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
        setOutput(data.content || "")
      }
    } catch {
      setError("Generation failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [canGenerate, solution, vertical, motion, selectedContent, context, competitor])

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [output])

  const handleSave = useCallback(async () => {
    if (!output || !motion || !selectedContent) return

    const tags = [motion, ...(vertical ? [vertical] : []), selectedContent]

    const newItem = {
      id: `content-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      contentType: selectedContent,
      motion,
      solution,
      content: output,
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
  }, [output, motion, vertical, selectedContent, solution, onLibraryChange])

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

  return (
    <div
      style={{
        display: "flex",
        minHeight: "calc(100vh - 200px)",
      }}
    >
      {/* ── Left Panel: Controls ── */}
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
                <button
                  key={ct.key}
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

      {/* ── Right Panel: Output ── */}
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
          /* Loading state */
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
          /* Output state */
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
                }}
              >
                {output}
              </pre>
            </div>

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
