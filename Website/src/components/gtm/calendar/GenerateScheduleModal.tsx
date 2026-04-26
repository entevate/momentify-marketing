"use client"

/**
 * GenerateScheduleModal - bulk-generate a content schedule across solutions.
 *
 * Users pick a date range, posts-per-week cadence, solutions/content-types/personas,
 * industry, motion, and optional additional context. On submit, the client
 * iterates through a planned list of (solution × contentType × persona × date)
 * entries, sequentially calling the existing APIs:
 *
 *   POST /api/gtm/generate       → Claude-generated brief text
 *   POST /api/gtm/content        → save to Library
 *   POST /api/gtm/calendar       → create calendar task linked via libraryItemId
 *
 * A "Save as weekly recurring" toggle also POSTs /api/gtm/recurring so the
 * Vercel cron re-runs the same config every Sunday.
 */

import React, { useCallback, useMemo, useRef, useState } from "react"
import { Loader2, Wand2, X, Zap, Calendar as CalendarIcon, Repeat } from "lucide-react"
import { buildSchedulePlan, contentTypeToCategory, nextSundayOn, type PlanEntry } from "@/lib/gtm/schedule-planner"
import {
  tradeShowsPersonas,
  recruitingPersonas,
  fieldSalesPersonas,
  facilitiesPersonas,
  eventsVenuesPersonas,
  pillarLabel,
  pillarMeta,
} from "@/lib/gtm/schedule-modal-data"

const font = "'Inter', system-ui, sans-serif"

/** IDs created by a single Generate run - used by the Calendar to offer Undo. */
export interface GeneratedBatch {
  taskIds: string[]
  libraryItemIds: string[]
  /** Human-readable summary, e.g. "Trade Shows · 12 tasks · Apr 22-May 6". */
  summary: string
}

export interface GenerateScheduleModalProps {
  onClose: () => void
  /** Called once all entries have been processed (success or partial). Parent should refetch calendar tasks. */
  onComplete: (batch?: GeneratedBatch) => void
}

// ─── Form option lists ────────────────────────────────────────────────────

const CONTENT_TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: "cold-emails", label: "Cold Email Sequence" },
  { value: "linkedin-dm", label: "LinkedIn DM Sequence" },
  { value: "social-post", label: "Social Post" },
  { value: "carousel", label: "Social Carousel" },
  { value: "lead-magnet", label: "Lead Magnet Outline" },
  { value: "discovery-script", label: "Discovery Script" },
  { value: "partner-pitch", label: "Partner Pitch" },
  { value: "battle-card", label: "Battle Card" },
  { value: "infographic", label: "Infographic" },
  { value: "one-pager", label: "One-Pager" },
]

const INDUSTRY_GROUPS: { label: string; industries: { value: string; label: string }[] }[] = [
  { label: "General", industries: [{ value: "general", label: "General / All Industries" }] },
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

// Service (vertical) defaults per solution - used when the generator constructs
// the /api/gtm/generate payload.
const DEFAULT_VERTICAL: Record<string, string> = {
  "trade-shows":   "trade-shows-exhibits",
  "recruiting":    "recruiting-talent",
  "field-sales":   "field-sales-enablement",
  "facilities":    "facilities-management",
  "events-venues": "events-venues",
}

function todayIso(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

function plusDaysIso(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() + n)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

/** Last calendar-day of the current month. */
function endOfMonthIso(): string {
  const now = new Date()
  const last = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  const y = last.getFullYear()
  const m = String(last.getMonth() + 1).padStart(2, "0")
  const day = String(last.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

type RangePreset = "7d" | "14d" | "month" | "custom"

const RANGE_PRESETS: { id: RangePreset; label: string }[] = [
  { id: "7d", label: "Next 7 days" },
  { id: "14d", label: "Next 14 days" },
  { id: "month", label: "This month" },
  { id: "custom", label: "Custom" },
]

function resolvePreset(preset: RangePreset): { start: string; end: string } | null {
  if (preset === "custom") return null
  if (preset === "7d") return { start: todayIso(), end: plusDaysIso(7) }
  if (preset === "14d") return { start: todayIso(), end: plusDaysIso(14) }
  if (preset === "month") return { start: todayIso(), end: endOfMonthIso() }
  return null
}

export default function GenerateScheduleModal({ onClose, onComplete }: GenerateScheduleModalProps) {
  // ─── Form state ────────────────────────────────────────────────────────
  const [rangePreset, setRangePreset] = useState<RangePreset>("14d")
  const [startDate, setStartDate] = useState<string>(todayIso())
  const [endDate, setEndDate] = useState<string>(plusDaysIso(14))

  const applyPreset = useCallback((id: RangePreset) => {
    setRangePreset(id)
    const resolved = resolvePreset(id)
    if (resolved) {
      setStartDate(resolved.start)
      setEndDate(resolved.end)
    }
  }, [])

  const [postsPerWeek, setPostsPerWeek] = useState<number>(3)
  const [weekdaysOnly, setWeekdaysOnly] = useState(true)
  const [pillars, setPillars] = useState<string[]>(["trade-shows"])
  const [contentTypes, setContentTypes] = useState<string[]>(["cold-emails", "social-post", "linkedin-dm"])
  const [industry, setIndustry] = useState<string>("general")
  const [motion, setMotion] = useState<"direct" | "partner">("direct")
  const [personas, setPersonas] = useState<string[]>([])
  const [additionalContext, setAdditionalContext] = useState<string>("")
  const [recurring, setRecurring] = useState(false)

  // ─── Generation state ──────────────────────────────────────────────────
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState<{ done: number; total: number; current?: string }>({ done: 0, total: 0 })
  const [errors, setErrors] = useState<string[]>([])
  const abortRef = useRef<AbortController | null>(null)

  // ─── Derived ───────────────────────────────────────────────────────────
  const availablePersonas = useMemo(() => {
    const byPillar: Record<string, string[]> = {
      "trade-shows":   tradeShowsPersonas,
      "recruiting":    recruitingPersonas,
      "field-sales":   fieldSalesPersonas,
      "facilities":    facilitiesPersonas,
      "events-venues": eventsVenuesPersonas,
    }
    const set = new Set<string>()
    pillars.forEach((p) => (byPillar[p] || []).forEach((x) => set.add(x)))
    return Array.from(set)
  }, [pillars])

  const plannedEntries: PlanEntry[] = useMemo(() => {
    if (!pillars.length || !contentTypes.length) return []
    return buildSchedulePlan({
      startDate,
      endDate,
      postsPerWeek,
      weekdaysOnly,
      pillars,
      contentTypes,
      industry,
      motion,
      personas,
      additionalContext: additionalContext.trim() || undefined,
    })
  }, [startDate, endDate, postsPerWeek, weekdaysOnly, pillars, contentTypes, industry, motion, personas, additionalContext])

  const canGenerate = pillars.length > 0 && contentTypes.length > 0 && plannedEntries.length > 0 && !generating

  // ─── Actions ────────────────────────────────────────────────────────────
  function togglePillar(p: string) {
    setPillars((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]))
  }
  function toggleContentType(ct: string) {
    setContentTypes((prev) => (prev.includes(ct) ? prev.filter((x) => x !== ct) : [...prev, ct]))
  }
  function togglePersona(p: string) {
    setPersonas((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]))
  }

  async function saveRecurringIfEnabled() {
    if (!recurring) return
    try {
      await fetch("/api/gtm/recurring", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pillars,
          contentTypes,
          industry,
          motion,
          personas,
          additionalContext: additionalContext.trim() || undefined,
          postsPerWeek,
          weekdaysOnly,
          enabled: true,
          nextRunOn: nextSundayOn(),
        }),
      })
    } catch {
      // non-fatal - the manual run will still succeed
    }
  }

  async function handleGenerate() {
    if (!canGenerate) return
    setGenerating(true)
    setErrors([])
    setProgress({ done: 0, total: plannedEntries.length })
    const ctrl = new AbortController()
    abortRef.current = ctrl

    await saveRecurringIfEnabled()

    const newErrors: string[] = []
    const createdTaskIds: string[] = []
    const createdLibraryItemIds: string[] = []
    for (let i = 0; i < plannedEntries.length; i++) {
      if (ctrl.signal.aborted) break
      const entry = plannedEntries[i]
      const vertical = DEFAULT_VERTICAL[entry.solution] || "trade-shows-exhibits"

      const personaSuffix = entry.persona ? `\nPersona focus: ${entry.persona}` : ""
      const userContext = (entry.additionalContext || "") + personaSuffix
      setProgress({
        done: i,
        total: plannedEntries.length,
        current: `${pillarLabel(entry.solution)} · ${entry.contentType}${entry.persona ? ` · ${entry.persona}` : ""}`,
      })

      try {
        // 1. Generate brief
        const genRes = await fetch("/api/gtm/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            solution: entry.solution,
            vertical,
            industry: entry.industry,
            motion: entry.motion,
            contentType: entry.contentType,
            additionalContext: userContext.trim() || undefined,
          }),
          signal: ctrl.signal,
        })
        if (!genRes.ok) throw new Error(`generate ${genRes.status}`)
        const { content } = await genRes.json()
        if (!content) throw new Error("empty generation")

        // 2. Save to Library
        const saveRes = await fetch("/api/gtm/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            solution: entry.solution,
            contentType: entry.contentType,
            motion: entry.motion,
            content,
            tags: [vertical, entry.industry, entry.persona].filter(Boolean),
            createdAt: new Date().toISOString(),
          }),
          signal: ctrl.signal,
        })
        if (!saveRes.ok) throw new Error(`save ${saveRes.status}`)
        const { id: libraryItemId } = await saveRes.json()

        // 3. Create calendar task linked to the library item
        const titleSeed = content.split("\n").find((l: string) => l.trim().length > 8) || entry.contentType
        const taskBody = {
          id: `task-${Date.now()}-${i}`,
          title: titleSeed.replace(/[#*:]+/g, "").trim().slice(0, 80),
          category: contentTypeToCategory(entry.contentType),
          solution: entry.solution,
          date: entry.date,
          duration: 30,
          completed: false,
          description: `Auto-generated ${entry.contentType} for ${pillarLabel(entry.solution)}.`,
          sortOrder: i,
          libraryItemId,
          industry: entry.industry,
          persona: entry.persona || undefined,
          motion: entry.motion,
          additionalContext: entry.additionalContext,
        }
        const taskRes = await fetch("/api/gtm/calendar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(taskBody),
          signal: ctrl.signal,
        })
        if (taskRes.ok) {
          createdTaskIds.push(taskBody.id)
          createdLibraryItemIds.push(libraryItemId)
        }

        setProgress({ done: i + 1, total: plannedEntries.length })
      } catch (e: unknown) {
        if (e instanceof Error && e.name === "AbortError") break
        const msg = e instanceof Error ? e.message : "failed"
        newErrors.push(`[${entry.date} ${entry.solution}/${entry.contentType}] ${msg}`)
      }
    }

    setErrors(newErrors)
    setGenerating(false)
    abortRef.current = null

    // Report the batch so the Calendar can offer Undo.
    const batch: GeneratedBatch | undefined = createdTaskIds.length
      ? {
          taskIds: createdTaskIds,
          libraryItemIds: createdLibraryItemIds,
          summary: `${createdTaskIds.length} task${createdTaskIds.length === 1 ? "" : "s"} · ${pillars.map((p) => pillarLabel(p)).join(", ")} · ${startDate} to ${endDate}`,
        }
      : undefined
    onComplete(batch)

    // Auto-close on full success
    if (newErrors.length === 0) {
      setTimeout(() => onClose(), 800)
    }
  }

  function handleCancel() {
    if (generating) abortRef.current?.abort()
    else onClose()
  }

  return (
    <div onClick={(e) => { if (e.target === e.currentTarget && !generating) onClose() }} style={backdrop}>
      <div style={modal} role="dialog" aria-modal="true">
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid var(--gtm-border)" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <Zap size={16} style={{ color: "#00BBA5" }} />
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "var(--gtm-text-primary)", fontFamily: font }}>
              Generate Schedule
            </h2>
          </div>
          <button onClick={onClose} disabled={generating} style={iconBtn} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={body}>
          {/* Date range presets */}
          <Field label="Date range">
            <div style={chipRow}>
              {RANGE_PRESETS.map((p) => {
                const active = rangePreset === p.id
                return (
                  <button
                    key={p.id}
                    onClick={() => applyPreset(p.id)}
                    style={{
                      ...chip,
                      background: active ? "rgba(36,123,150,0.08)" : "#fff",
                      borderColor: active ? "#00BBA5" : "var(--gtm-border)",
                      color: active ? "#00BBA5" : "var(--gtm-text-secondary)",
                    }}
                  >
                    {p.label}
                  </button>
                )
              })}
            </div>
          </Field>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Field label="Start date">
              <input
                type="date"
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); setRangePreset("custom") }}
                style={input}
              />
            </Field>
            <Field label="End date">
              <input
                type="date"
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); setRangePreset("custom") }}
                style={input}
              />
            </Field>
            <Field label="Posts per week">
              <input
                type="number"
                min={1}
                max={10}
                value={postsPerWeek}
                onChange={(e) => setPostsPerWeek(Math.max(1, Math.min(10, Number(e.target.value) || 1)))}
                style={input}
              />
            </Field>
            <Field label="Distribution">
              <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--gtm-text-secondary)", fontFamily: font, cursor: "pointer" }}>
                <input type="checkbox" checked={weekdaysOnly} onChange={(e) => setWeekdaysOnly(e.target.checked)} />
                Weekdays only (Mon to Fri)
              </label>
            </Field>
          </div>

          <Field label="Solutions (pick one or more)">
            <div style={chipRow}>
              {(Object.entries(pillarMeta) as [string, { label: string; color: string }][]).map(([id, meta]) => {
                const active = pillars.includes(id)
                return (
                  <button key={id} onClick={() => togglePillar(id)} style={{
                    ...chip,
                    background: active ? `${meta.color}14` : "#fff",
                    borderColor: active ? meta.color : "var(--gtm-border)",
                    color: active ? meta.color : "var(--gtm-text-secondary)",
                  }}>
                    {meta.label}
                  </button>
                )
              })}
            </div>
          </Field>

          <Field label="Content types (mix)">
            <div style={chipRow}>
              {CONTENT_TYPE_OPTIONS.map((ct) => {
                const active = contentTypes.includes(ct.value)
                return (
                  <button key={ct.value} onClick={() => toggleContentType(ct.value)} style={{
                    ...chip,
                    background: active ? "rgba(0, 187, 165, 0.08)" : "#fff",
                    borderColor: active ? "#00BBA5" : "var(--gtm-border)",
                    color: active ? "#00BBA5" : "var(--gtm-text-secondary)",
                  }}>
                    {ct.label}
                  </button>
                )
              })}
            </div>
          </Field>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
            <Field label="Industry">
              <select value={industry} onChange={(e) => setIndustry(e.target.value)} style={select}>
                {INDUSTRY_GROUPS.map((g) => (
                  <optgroup key={g.label} label={g.label}>
                    {g.industries.map((i) => <option key={i.value} value={i.value}>{i.label}</option>)}
                  </optgroup>
                ))}
              </select>
            </Field>
            <Field label="Motion">
              <div style={{ display: "flex", gap: 8 }}>
                {(["direct", "partner"] as const).map((m) => {
                  const active = motion === m
                  return (
                    <button key={m} onClick={() => setMotion(m)} style={{
                      ...chip,
                      flex: 1,
                      background: active ? "rgba(0, 187, 165, 0.08)" : "#fff",
                      borderColor: active ? "#00BBA5" : "var(--gtm-border)",
                      color: active ? "#00BBA5" : "var(--gtm-text-secondary)",
                      textTransform: "capitalize",
                    }}>
                      {m === "direct" ? "Direct" : "Partner"}
                    </button>
                  )
                })}
              </div>
            </Field>
          </div>

          {availablePersonas.length > 0 && (
            <Field label="Personas (optional, rotates across selected)">
              <div style={chipRow}>
                {availablePersonas.map((p) => {
                  const active = personas.includes(p)
                  return (
                    <button key={p} onClick={() => togglePersona(p)} style={{
                      ...chip,
                      background: active ? "rgba(0, 187, 165, 0.08)" : "#fff",
                      borderColor: active ? "#00BBA5" : "var(--gtm-border)",
                      color: active ? "#00BBA5" : "var(--gtm-text-secondary)",
                    }}>
                      {p}
                    </button>
                  )
                })}
              </div>
            </Field>
          )}

          <Field label="Additional context (optional)">
            <textarea
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
              placeholder="Trigger events, customer examples, tone cues, campaign themes..."
              style={{ ...input, minHeight: 72, resize: "vertical", height: "auto" }}
            />
          </Field>

          <label style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: 12, background: "var(--gtm-bg-page)", border: "1px solid var(--gtm-border)", borderRadius: 6, cursor: "pointer", fontFamily: font, fontSize: 13, color: "var(--gtm-text-primary)" }}>
            <input type="checkbox" checked={recurring} onChange={(e) => setRecurring(e.target.checked)} />
            <Repeat size={14} style={{ color: "#00BBA5" }} />
            <span>Save as weekly recurring. Runs every Sunday at 08:00 UTC and auto-generates the upcoming week.</span>
          </label>

          {/* Plan summary */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, background: "var(--gtm-bg-page)", border: "1px solid var(--gtm-border)", borderRadius: 6 }}>
            <CalendarIcon size={14} style={{ color: "var(--gtm-text-faint)" }} />
            <div style={{ fontSize: 12, color: "var(--gtm-text-secondary)", fontFamily: font }}>
              {plannedEntries.length === 0
                ? "Select at least one solution + content type to build a plan."
                : `Plan: ${plannedEntries.length} pieces across ${new Set(plannedEntries.map((e) => e.date)).size} days · ~${Math.round(plannedEntries.length * 20)}s estimated total generation time`}
            </div>
          </div>

          {/* Progress */}
          {generating && (
            <div style={{ padding: 12, background: "rgba(0, 187, 165, 0.06)", border: "1px solid rgba(0, 187, 165, 0.2)", borderRadius: 6, fontFamily: font }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#00BBA5" }}>
                Generating {progress.done + 1} of {progress.total}
              </div>
              {progress.current && (
                <div style={{ fontSize: 12, color: "var(--gtm-text-secondary)", marginTop: 4 }}>
                  {progress.current}
                </div>
              )}
              <div style={{ marginTop: 10, height: 4, background: "var(--gtm-border)", borderRadius: 100, overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${(progress.done / Math.max(1, progress.total)) * 100}%`,
                  background: "linear-gradient(90deg, #00BBA5, #0CF4DF)",
                  transition: "width 200ms ease",
                }} />
              </div>
            </div>
          )}

          {/* Errors summary */}
          {errors.length > 0 && (
            <div style={{ padding: 12, background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: 6, fontSize: 12, color: "#b91c1c", fontFamily: font }}>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>{errors.length} piece{errors.length === 1 ? "" : "s"} failed (others saved)</div>
              <ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 3 }}>
                {errors.slice(0, 5).map((err, i) => <li key={i}>{err}</li>)}
                {errors.length > 5 && <li>+{errors.length - 5} more</li>}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, padding: "16px 24px", borderTop: "1px solid var(--gtm-border)" }}>
          <button onClick={handleCancel} style={secondaryBtn}>
            {generating ? "Cancel" : "Close"}
          </button>
          <button
            onClick={handleGenerate}
            disabled={!canGenerate}
            style={{
              ...primaryBtn,
              background: !canGenerate ? "var(--gtm-text-faint)" : "#00BBA5",
              cursor: !canGenerate ? "not-allowed" : "pointer",
            }}
          >
            {generating ? (
              <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />Generating...</>
            ) : (
              <><Wand2 size={14} />Generate {plannedEntries.length > 0 ? `${plannedEntries.length} ` : ""}Pieces</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Small layout pieces ────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--gtm-text-faint)", fontFamily: font }}>
        {label}
      </span>
      {children}
    </label>
  )
}

// ─── Styles ──────────────────────────────────────────────────────────────

const backdrop: React.CSSProperties = {
  position: "fixed", inset: 0, background: "rgba(24,24,24,0.55)",
  display: "flex", alignItems: "center", justifyContent: "center",
  zIndex: 100, padding: 20,
  fontFamily: font,
}

const modal: React.CSSProperties = {
  background: "var(--gtm-bg-card)",
  border: "1px solid var(--gtm-border)",
  borderRadius: 6,
  width: "100%",
  maxWidth: 720,
  maxHeight: "90vh",
  display: "flex",
  flexDirection: "column",
  boxShadow: "0 20px 60px rgba(24,24,24,0.25)",
}

const body: React.CSSProperties = {
  padding: "20px 24px",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: 16,
}

const input: React.CSSProperties = {
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

const select: React.CSSProperties = { ...input, cursor: "pointer" }

const chip: React.CSSProperties = {
  padding: "6px 12px",
  fontSize: 12,
  fontWeight: 600,
  fontFamily: font,
  border: "1px solid var(--gtm-border)",
  borderRadius: 100,
  cursor: "pointer",
  transition: "all 150ms ease",
}

const chipRow: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 6,
}

const primaryBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  height: 38,
  padding: "0 18px",
  fontSize: 13,
  fontWeight: 600,
  fontFamily: font,
  border: "none",
  borderRadius: 6,
  color: "#fff",
  background: "#00BBA5",
  cursor: "pointer",
}

const secondaryBtn: React.CSSProperties = {
  ...primaryBtn,
  background: "#fff",
  color: "var(--gtm-text-secondary)",
  border: "1px solid var(--gtm-border)",
}

const iconBtn: React.CSSProperties = {
  width: 30,
  height: 30,
  padding: 0,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "transparent",
  border: "none",
  borderRadius: 6,
  color: "var(--gtm-text-secondary)",
  cursor: "pointer",
}
