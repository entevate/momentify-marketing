'use client'

/**
 * Link in Bio analytics — self-contained (Fulcrum has no analytics dashboard to fold
 * into), so it owns its own 7/28/90 range selector. First-party + always fresh.
 * Rendered as the "Stats" tab of the /gtm/link-in-bio page.
 */

import { useEffect, useState } from 'react'

const ACCENT = '#0CF4DF'
const INK = '#061341'
const card: React.CSSProperties = { background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }
const RANGES = [7, 28, 90] as const

type LinkRow = { id: string; label: string; enabled: boolean; social: boolean; clicks: number; clicksWindow: number }
type Stats = {
  configured: boolean
  viewsWindow?: number; viewsTotal?: number; uniques?: number
  clicksWindow?: number; clicksTotal?: number; ctr?: number
  links?: LinkRow[]
}

export default function LinkPageAnalytics() {
  const [days, setDays] = useState<number>(28)
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/gtm/link-page?stats=1&days=${days}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { setStats(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [days])

  if (loading && !stats) return <p style={{ fontSize: 13, color: 'rgba(0,0,0,0.5)' }}>Loading…</p>
  if (!stats?.configured) {
    return <p style={{ fontSize: 13, color: 'rgba(0,0,0,0.5)' }}>No Link in Bio page yet. Build one in the Builder tab, and its stats appear here.</p>
  }

  const links = (stats.links ?? []).slice().sort((a, b) => b.clicksWindow - a.clicksWindow)
  const maxClicks = Math.max(1, ...links.map((l) => l.clicksWindow))
  const ctrPct = ((stats.ctr ?? 0) * 100).toFixed(1)
  const kpis = [
    { label: `Page Views (${days}d)`, value: stats.viewsWindow ?? 0 },
    { label: 'Unique Visitors', value: stats.uniques ?? 0 },
    { label: `Link Clicks (${days}d)`, value: stats.clicksWindow ?? 0 },
    { label: 'Click-Through', value: `${ctrPct}%` },
  ]

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <a href="/links" target="_blank" rel="noreferrer" style={{ fontSize: 12.5, color: ACCENT }}>Open /links ↗</a>
        <span style={{ marginLeft: 'auto', display: 'inline-flex', border: '1px solid rgba(0,0,0,0.15)', borderRadius: 6, overflow: 'hidden' }}>
          {RANGES.map((r) => (
            <button key={r} onClick={() => setDays(r)} style={{ padding: '6px 14px', fontSize: 12, fontWeight: days === r ? 700 : 500, background: days === r ? INK : '#fff', color: days === r ? '#fff' : INK, cursor: 'pointer', border: 'none' }}>{r}d</button>
          ))}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 20 }}>
        {kpis.map((k) => (
          <div key={k.label} style={{ ...card, borderTop: `3px solid ${ACCENT}` }}>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(0,0,0,0.45)' }}>{k.label}</p>
            <p style={{ margin: '8px 0 0', fontSize: 28, fontWeight: 800, color: INK, lineHeight: 1 }}>{k.value}</p>
          </div>
        ))}
      </div>

      <div style={card}>
        <p style={{ margin: '0 0 4px', fontSize: 13.5, fontWeight: 700, color: INK }}>Clicks by link ({days}d)</p>
        <p style={{ margin: '0 0 14px', fontSize: 12, color: 'rgba(0,0,0,0.5)' }}>Removed links keep their history and show as “(removed link)”.</p>
        {links.length === 0 ? (
          <p style={{ fontSize: 13, color: 'rgba(0,0,0,0.5)' }}>No clicks recorded in this window yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {links.map((l) => (
              <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span title={l.label} style={{ width: 150, flex: 'none', fontSize: 13, color: l.enabled ? INK : 'rgba(0,0,0,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.label}</span>
                <div style={{ flex: 1, height: 22, background: 'rgba(0,0,0,0.06)', borderRadius: 6, overflow: 'hidden' }}>
                  <div style={{ width: `${(l.clicksWindow / maxClicks) * 100}%`, height: '100%', background: l.social ? INK : ACCENT, borderRadius: 6, minWidth: l.clicksWindow > 0 ? 3 : 0 }} />
                </div>
                <span style={{ width: 40, flex: 'none', textAlign: 'right', fontSize: 12, color: INK }}>{l.clicksWindow}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
