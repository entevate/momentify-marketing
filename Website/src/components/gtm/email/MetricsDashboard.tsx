"use client"

/**
 * MetricsDashboard — top-of-Sends-tab roll-up.
 *
 * Reads aggregate metrics + recent events from the auth-gated API
 * routes. Polls the events feed every 10s for a live drip of incoming
 * webhook events.
 */

import { useEffect, useState } from "react"
import type { EmailAggregateMetrics, EmailEvent } from "@/lib/gtm/email-types"

const font = "'Inter', system-ui, -apple-system, sans-serif"

interface Props {
  /** Optional pillar filter — narrows roll-up to one solution. */
  solution?: string
}

export default function MetricsDashboard({ solution }: Props) {
  const [metrics, setMetrics] = useState<EmailAggregateMetrics | null>(null)
  const [events, setEvents] = useState<EmailEvent[]>([])

  useEffect(() => {
    let stopped = false
    async function refresh() {
      try {
        const qs = solution ? `?solution=${encodeURIComponent(solution)}` : ""
        const [m, e] = await Promise.all([
          fetch(`/api/gtm/email/metrics${qs}`).then((r) => r.json()),
          fetch(`/api/gtm/email/events?limit=50`).then((r) => r.json()),
        ])
        if (stopped) return
        setMetrics(m.metrics || null)
        setEvents(e.events || [])
      } catch {
        // best-effort polling - don't surface transient errors
      }
    }
    refresh()
    const tick = setInterval(refresh, 10_000)
    return () => { stopped = true; clearInterval(tick) }
  }, [solution])

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16, fontFamily: font, alignItems: "start" }}>
      <div>
        <div style={kpiGrid}>
          <KpiCard label="Sent"      value={metrics?.sent ?? 0} />
          <KpiCard label="Delivered" value={metrics?.delivered ?? 0} hint={pct(metrics?.deliveryRate ?? 0)} />
          <KpiCard label="Opened %"  value={pct(metrics?.openRate ?? 0)} hint={`${metrics?.opened ?? 0} opens`} />
          <KpiCard label="Clicked %" value={pct(metrics?.clickRate ?? 0)} hint={`${metrics?.clicked ?? 0} clicks`} />
          <KpiCard label="Bounced %" value={pct(metrics?.bounceRate ?? 0)} hint={`${metrics?.bounced ?? 0} bounces`} bad />
        </div>
        <div style={{ marginTop: 16, ...panel }}>
          <div style={panelHeader}>By status</div>
          <div style={{ display: "flex", gap: 0, flexWrap: "wrap" }}>
            {(["draft", "scheduled", "sent", "failed"] as const).map((s) => (
              <div key={s} style={statusCell}>
                <span style={{ fontSize: 11, color: "var(--gtm-text-faint)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s}</span>
                <span style={{ fontSize: 22, fontWeight: 600, color: "var(--gtm-text-primary)" }}>{metrics?.byStatus?.[s] ?? 0}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <aside style={panel}>
        <div style={panelHeader}>Live event feed</div>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, maxHeight: 480, overflow: "auto" }}>
          {events.length === 0 && <li style={{ padding: 16, fontSize: 12, color: "var(--gtm-text-faint)", textAlign: "center" }}>No events yet.</li>}
          {events.map((e) => (
            <li key={e.id} style={eventRow}>
              <span style={{ ...eventBadge, ...badgeStyle(e.type) }}>{e.type}</span>
              <span style={{ flex: 1, fontSize: 12, color: "var(--gtm-text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {e.url ? e.url : `msg ${e.resendMessageId.slice(0, 12)}...`}
              </span>
              <span style={{ fontSize: 11, color: "var(--gtm-text-faint)", whiteSpace: "nowrap" }}>{relTime(e.occurredAt)}</span>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  )
}

function KpiCard({ label, value, hint, bad }: { label: string; value: string | number; hint?: string; bad?: boolean }) {
  return (
    <div style={{ ...kpi, borderColor: bad ? "rgba(212,61,26,0.25)" : "var(--gtm-border)" }}>
      <span style={kpiLabel}>{label}</span>
      <span style={{ ...kpiValue, color: bad ? "#D43D1A" : "var(--gtm-text-primary)" }}>{value}</span>
      {hint && <span style={kpiHint}>{hint}</span>}
    </div>
  )
}

// ─── helpers ───────────────────────────────────────────────────────────

function pct(rate: number): string {
  if (!isFinite(rate) || rate <= 0) return "0%"
  return `${Math.round(rate * 100)}%`
}

function relTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime()
  if (ms < 60_000) return "just now"
  const min = Math.round(ms / 60_000)
  if (min < 60) return `${min}m ago`
  const hr = Math.round(min / 60)
  if (hr < 24) return `${hr}h ago`
  const d = Math.round(hr / 24)
  return `${d}d ago`
}

function badgeStyle(type: string): React.CSSProperties {
  switch (type) {
    case "delivered": return { background: "rgba(0,187,165,0.10)", color: "#0AA891" }
    case "opened":    return { background: "rgba(26,86,219,0.10)", color: "#1A56DB" }
    case "clicked":   return { background: "rgba(155,95,232,0.12)", color: "#6B21D4" }
    case "bounced":   return { background: "rgba(212,61,26,0.10)", color: "#D43D1A" }
    case "complained":return { background: "rgba(212,61,26,0.20)", color: "#D43D1A" }
    default:          return { background: "rgba(6,19,65,0.06)", color: "var(--gtm-text-secondary)" }
  }
}

// styles
const kpiGrid: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10 }
const kpi: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 4, padding: 16, background: "#fff", border: "1px solid var(--gtm-border)", borderRadius: 8 }
const kpiLabel: React.CSSProperties = { fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--gtm-text-faint)" }
const kpiValue: React.CSSProperties = { fontSize: 28, fontWeight: 600 }
const kpiHint: React.CSSProperties = { fontSize: 11, color: "var(--gtm-text-faint)" }

const panel: React.CSSProperties = { background: "#fff", border: "1px solid var(--gtm-border)", borderRadius: 8, overflow: "hidden" }
const panelHeader: React.CSSProperties = { padding: "10px 14px", fontSize: 12, fontWeight: 600, color: "var(--gtm-text-secondary)", background: "var(--gtm-bg-page)", borderBottom: "1px solid var(--gtm-border)" }

const statusCell: React.CSSProperties = { flex: 1, minWidth: 100, display: "flex", flexDirection: "column", gap: 4, padding: 14, borderRight: "1px solid var(--gtm-border)" }

const eventRow: React.CSSProperties = { display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderBottom: "1px solid var(--gtm-border)", fontFamily: font }
const eventBadge: React.CSSProperties = { padding: "2px 8px", fontSize: 10, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", borderRadius: 999 }
