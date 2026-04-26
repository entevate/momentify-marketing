"use client"

/**
 * RecurringSchedulesPanel - compact list of active weekly recurring schedules.
 *
 * Rendered above the calendar. Shows one pill-card per schedule:
 *   solution chips · posts/week · next run · enable/disable toggle · delete
 *
 * Source of truth: GET /api/gtm/recurring. Toggling calls PUT /api/gtm/recurring/[id],
 * deleting calls DELETE /api/gtm/recurring/[id].
 */

import React, { useEffect, useState, useCallback } from "react"
import { Repeat, Trash2, Power } from "lucide-react"
import { pillarMeta, pillarLabel } from "@/lib/gtm/schedule-modal-data"

const font = "'Inter', system-ui, sans-serif"

interface RecurringSchedule {
  id: string
  createdAt: string
  lastRunAt?: string
  nextRunOn: string
  enabled: boolean
  pillars: string[]
  contentTypes: string[]
  industry: string
  motion: "direct" | "partner"
  personas: string[]
  additionalContext?: string
  postsPerWeek: number
  weekdaysOnly: boolean
}

interface Props {
  /** Bump to force a refetch (incremented by parent after modal close) */
  refreshKey?: number
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
  } catch {
    return iso
  }
}

export default function RecurringSchedulesPanel({ refreshKey = 0 }: Props) {
  const [schedules, setSchedules] = useState<RecurringSchedule[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSchedules = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/gtm/recurring")
      if (!res.ok) throw new Error("fetch failed")
      const data = await res.json()
      setSchedules(Array.isArray(data.schedules) ? data.schedules : [])
    } catch {
      setSchedules([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchSchedules() }, [fetchSchedules, refreshKey])

  async function toggleEnabled(id: string, enabled: boolean) {
    setSchedules((prev) => prev.map((s) => s.id === id ? { ...s, enabled } : s))
    try {
      await fetch(`/api/gtm/recurring/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled }),
      })
    } catch {
      fetchSchedules()
    }
  }

  async function removeSchedule(id: string) {
    if (!confirm("Delete this recurring schedule? Tasks already generated are not removed.")) return
    setSchedules((prev) => prev.filter((s) => s.id !== id))
    try {
      await fetch(`/api/gtm/recurring/${id}`, { method: "DELETE" })
    } catch {
      fetchSchedules()
    }
  }

  if (loading && schedules.length === 0) return null
  if (!loading && schedules.length === 0) return null

  return (
    <div style={{ marginBottom: 20, fontFamily: font }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <Repeat size={14} style={{ color: "#247b96" }} />
        <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#247b96" }}>
          Weekly Recurring
        </span>
        <span style={{ fontSize: 11, color: "var(--gtm-text-faint)" }}>
          {schedules.length} active · runs every Sunday 08:00 UTC
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {schedules.map((s) => (
          <div key={s.id} style={cardStyle}>
            {/* Solution chips */}
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap", flex: 1, minWidth: 0 }}>
              {s.pillars.map((p) => {
                const meta = pillarMeta[p]
                return (
                  <span key={p} style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
                    color: meta?.color || "#6b6b6b",
                    background: meta ? `${meta.color}14` : "var(--gtm-bg-page)",
                    borderRadius: 100, padding: "3px 8px",
                  }}>
                    {pillarLabel(p)}
                  </span>
                )
              })}
            </div>

            {/* Meta */}
            <div style={{ display: "flex", gap: 14, alignItems: "center", fontSize: 11, color: "var(--gtm-text-secondary)", flexShrink: 0 }}>
              <span>{s.postsPerWeek}/week</span>
              <span>Next: {formatDate(s.nextRunOn)}</span>
              {s.lastRunAt && <span style={{ color: "var(--gtm-text-faint)" }}>Last: {formatDate(s.lastRunAt)}</span>}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
              <button
                onClick={() => toggleEnabled(s.id, !s.enabled)}
                title={s.enabled ? "Pause" : "Resume"}
                style={{
                  ...iconBtn,
                  color: s.enabled ? "#247b96" : "var(--gtm-text-faint)",
                  background: s.enabled ? "rgba(36,123,150,0.08)" : "#fff",
                  borderColor: s.enabled ? "rgba(36,123,150,0.3)" : "var(--gtm-border)",
                }}
              >
                <Power size={12} />
              </button>
              <button
                onClick={() => removeSchedule(s.id)}
                title="Delete"
                style={{ ...iconBtn, color: "#b91c1c", borderColor: "rgba(239,68,68,0.25)" }}
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const cardStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 16,
  padding: "10px 14px",
  background: "#fff",
  border: "1px solid var(--gtm-border)",
  borderRadius: 6,
  flexWrap: "wrap",
}

const iconBtn: React.CSSProperties = {
  width: 28,
  height: 28,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#fff",
  border: "1px solid var(--gtm-border)",
  borderRadius: 6,
  cursor: "pointer",
  padding: 0,
}
