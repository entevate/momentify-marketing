"use client"

/**
 * EmailActivityPanel — compact summary mounted at the top of the per-pillar
 * Library tab. Shows scheduled-this-week count, recent sent count, and
 * aggregate open rate scoped to the pillar.
 */

import { useEffect, useState } from "react"
import Link from "next/link"
import { Mail } from "lucide-react"
import type { EmailAggregateMetrics, EmailDraft } from "@/lib/gtm/email-types"

const font = "'Inter', system-ui, -apple-system, sans-serif"

interface Props {
  solution: string
}

export default function EmailActivityPanel({ solution }: Props) {
  const [metrics, setMetrics] = useState<EmailAggregateMetrics | null>(null)
  const [scheduledThisWeek, setScheduledThisWeek] = useState<EmailDraft[]>([])

  useEffect(() => {
    const sevenDaysAgo = new Date(Date.now() - 7 * 86_400_000).toISOString()
    Promise.all([
      fetch(`/api/gtm/email/metrics?solution=${solution}&since=${sevenDaysAgo}`).then((r) => r.json()),
      fetch(`/api/gtm/email/drafts?solution=${solution}&statuses=scheduled`).then((r) => r.json()),
    ])
      .then(([m, d]) => {
        setMetrics(m.metrics || null)
        const drafts = (d.drafts || []) as EmailDraft[]
        const weekFromNow = Date.now() + 7 * 86_400_000
        setScheduledThisWeek(
          drafts.filter((x) => x.scheduledFor && new Date(x.scheduledFor).getTime() <= weekFromNow),
        )
      })
      .catch(() => {})
  }, [solution])

  return (
    <div style={panel}>
      <div style={header}>
        <Mail size={14} />
        <span>Email Activity</span>
      </div>
      <div style={body}>
        <Stat label="Scheduled this week" value={scheduledThisWeek.length} />
        <Stat label="Sent (last 7d)" value={metrics?.sent ?? 0} />
        <Stat label="Open rate" value={metrics ? `${Math.round(metrics.openRate * 100)}%` : "—"} />
        <Link href="/gtm/email" style={openBtn}>
          Open Email →
        </Link>
      </div>
      {scheduledThisWeek.length > 0 && (
        <ul style={list}>
          {scheduledThisWeek.slice(0, 4).map((d) => (
            <li key={d.id} style={listItem}>
              <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {d.subject || "(no subject)"}
              </span>
              <span style={{ fontSize: 11, color: "var(--gtm-text-faint)" }}>
                {d.scheduledFor ? new Date(d.scheduledFor).toLocaleDateString() : "—"}
              </span>
              <span style={{
                fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 999,
                background: d.autoSend ? "rgba(26,86,219,0.10)" : "rgba(6,19,65,0.06)",
                color: d.autoSend ? "#1A56DB" : "var(--gtm-text-secondary)",
              }}>
                {d.autoSend ? "auto" : "manual"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--gtm-text-faint)" }}>{label}</span>
      <span style={{ fontSize: 18, fontWeight: 600, color: "var(--gtm-text-primary)" }}>{value}</span>
    </div>
  )
}

const panel: React.CSSProperties = { background: "#fff", border: "1px solid var(--gtm-border)", borderRadius: 8, marginBottom: 16, fontFamily: font }
const header: React.CSSProperties = { display: "flex", alignItems: "center", gap: 6, padding: "10px 14px", fontSize: 12, fontWeight: 600, color: "var(--gtm-text-secondary)", background: "var(--gtm-bg-page)", borderBottom: "1px solid var(--gtm-border)" }
const body: React.CSSProperties = { display: "flex", alignItems: "center", gap: 24, padding: "14px 16px" }
const openBtn: React.CSSProperties = { marginLeft: "auto", padding: "8px 14px", fontSize: 12, fontWeight: 600, fontFamily: font, border: "1px solid var(--gtm-border)", borderRadius: 6, color: "var(--gtm-text-primary)", textDecoration: "none", background: "#fff" }
const list: React.CSSProperties = { listStyle: "none", margin: 0, padding: "0 16px 12px 16px", display: "flex", flexDirection: "column", gap: 4 }
const listItem: React.CSSProperties = { display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", fontSize: 12, color: "var(--gtm-text-secondary)", background: "var(--gtm-bg-page)", borderRadius: 4 }
