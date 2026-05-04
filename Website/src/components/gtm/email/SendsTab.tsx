"use client"

/**
 * SendsTab — top: aggregate metrics dashboard. Bottom: per-draft table
 * showing sent count + open/click/bounce rates, sortable. Click a row
 * to drill into the draft's full event log.
 */

import { useEffect, useState } from "react"
import MetricsDashboard from "./MetricsDashboard"
import type { EmailDraft, EmailDraftMetrics, EmailEvent } from "@/lib/gtm/email-types"

const font = "'Inter', system-ui, -apple-system, sans-serif"

export default function SendsTab() {
  const [drafts, setDrafts] = useState<EmailDraft[]>([])
  const [perDraft, setPerDraft] = useState<Record<string, EmailDraftMetrics>>({})
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null)
  const [drilldownEvents, setDrilldownEvents] = useState<EmailEvent[]>([])

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/gtm/email/drafts?statuses=sent,scheduled,failed")
      const data = await res.json()
      const sentDrafts = (data.drafts || []) as EmailDraft[]
      setDrafts(sentDrafts)
      // Fetch metrics for sent drafts in parallel.
      const sent = sentDrafts.filter((d) => d.status === "sent")
      const metricsArr = await Promise.all(
        sent.map((d) =>
          fetch(`/api/gtm/email/drafts/${d.id}/metrics`).then((r) => r.json()).then((m) => m.metrics as EmailDraftMetrics)
        )
      )
      const map: Record<string, EmailDraftMetrics> = {}
      metricsArr.forEach((m) => { if (m) map[m.draftId] = m })
      setPerDraft(map)
    }
    load()
  }, [])

  useEffect(() => {
    if (!activeDraftId) { setDrilldownEvents([]); return }
    fetch(`/api/gtm/email/events?draftId=${activeDraftId}&limit=500`)
      .then((r) => r.json())
      .then((d) => setDrilldownEvents(d.events || []))
      .catch(() => setDrilldownEvents([]))
  }, [activeDraftId])

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, fontFamily: font }}>
      <MetricsDashboard />

      <section style={panel}>
        <div style={panelHeader}>Per-draft activity ({drafts.length})</div>
        {drafts.length === 0 && <div style={empty}>No sends yet. Author a draft and hit Send Now.</div>}
        {drafts.length > 0 && (
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Subject</th>
                <th style={th}>Status</th>
                <th style={th}>Sent</th>
                <th style={th}>Delivered</th>
                <th style={th}>Open %</th>
                <th style={th}>Click %</th>
                <th style={th}>Bounce %</th>
                <th style={th}>Updated</th>
              </tr>
            </thead>
            <tbody>
              {drafts.map((d) => {
                const m = perDraft[d.id]
                const active = activeDraftId === d.id
                return (
                  <tr
                    key={d.id}
                    onClick={() => setActiveDraftId(active ? null : d.id)}
                    style={{
                      cursor: "pointer",
                      background: active ? "rgba(0,187,165,0.04)" : "transparent",
                    }}
                  >
                    <td style={td}>{d.subject || "(no subject)"}</td>
                    <td style={td}><StatusPill status={d.status} /></td>
                    <td style={td}>{m?.sent ?? "-"}</td>
                    <td style={td}>{m?.delivered ?? "-"}</td>
                    <td style={td}>{m ? `${Math.round(m.openRate * 100)}%` : "-"}</td>
                    <td style={td}>{m ? `${Math.round(m.clickRate * 100)}%` : "-"}</td>
                    <td style={td}>{m ? `${Math.round(m.bounceRate * 100)}%` : "-"}</td>
                    <td style={td}>{relDate(d.updatedAt)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </section>

      {activeDraftId && (
        <section style={panel}>
          <div style={panelHeader}>Event log for selected draft</div>
          {drilldownEvents.length === 0 && <div style={empty}>No events for this draft.</div>}
          {drilldownEvents.length > 0 && (
            <table style={table}>
              <thead>
                <tr>
                  <th style={th}>Type</th>
                  <th style={th}>Recipient (msg id)</th>
                  <th style={th}>URL / detail</th>
                  <th style={th}>When</th>
                </tr>
              </thead>
              <tbody>
                {drilldownEvents.map((e) => (
                  <tr key={e.id}>
                    <td style={td}>{e.type}</td>
                    <td style={td}><code style={{ fontSize: 11 }}>{e.resendMessageId.slice(0, 16)}...</code></td>
                    <td style={td}>{e.url || e.bounceType || "-"}</td>
                    <td style={td}>{new Date(e.occurredAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}
    </div>
  )
}

function StatusPill({ status }: { status: string }) {
  const colors: Record<string, { bg: string; fg: string }> = {
    sent: { bg: "rgba(0,187,165,0.10)", fg: "#0AA891" },
    scheduled: { bg: "rgba(26,86,219,0.10)", fg: "#1A56DB" },
    failed: { bg: "rgba(212,61,26,0.10)", fg: "#D43D1A" },
    draft: { bg: "rgba(6,19,65,0.06)", fg: "var(--gtm-text-secondary)" },
  }
  const c = colors[status] || colors.draft
  return (
    <span style={{ display: "inline-block", padding: "2px 8px", fontSize: 10, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", background: c.bg, color: c.fg, borderRadius: 999 }}>
      {status}
    </span>
  )
}

function relDate(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime()
  if (ms < 86_400_000) return "today"
  return new Date(iso).toLocaleDateString()
}

const panel: React.CSSProperties = { background: "#fff", border: "1px solid var(--gtm-border)", borderRadius: 8, overflow: "hidden" }
const panelHeader: React.CSSProperties = { padding: "10px 14px", fontSize: 12, fontWeight: 600, color: "var(--gtm-text-secondary)", background: "var(--gtm-bg-page)", borderBottom: "1px solid var(--gtm-border)" }
const empty: React.CSSProperties = { padding: 24, textAlign: "center", color: "var(--gtm-text-faint)", fontSize: 13 }
const table: React.CSSProperties = { width: "100%", borderCollapse: "collapse" }
const th: React.CSSProperties = { textAlign: "left", padding: "10px 14px", fontSize: 11, fontWeight: 600, color: "var(--gtm-text-faint)", letterSpacing: "0.04em", textTransform: "uppercase", background: "var(--gtm-bg-page)", borderBottom: "1px solid var(--gtm-border)" }
const td: React.CSSProperties = { padding: "10px 14px", fontSize: 13, color: "var(--gtm-text-primary)", borderBottom: "1px solid var(--gtm-border)" }
