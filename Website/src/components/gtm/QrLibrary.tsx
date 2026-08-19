'use client'

/**
 * QR Library tab (Analytics): build downloadable QR codes (PNG / SVG / JPEG,
 * brand colors, campaign tag) and track scans per code. Codes are dynamic —
 * they encode /q/<id>, so destinations stay editable after printing.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import QRCode from 'qrcode'
// Auth rides Momentify's signed httpOnly cookie — same-origin fetch, no header.
import {
  QR_BG_PRESETS,
  QR_FG_PRESETS,
  QR_PILLARS,
  shortUrlFor,
  type QrCode as QrCodeModel,
  type QrCodeWithStats,
  type QrScan,
  type QrScanDetail,
} from '@/lib/gtm/qr-types'
// Delete confirm is an inline ConfirmModal below — Fulcrum has no ConfirmDialog.

const card: React.CSSProperties = {
  background: '#fff',
  border: '1px solid rgba(0,0,0,0.1)',
  borderRadius: '8px',
  padding: '20px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
}

const label: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '1px',
  color: 'rgba(0,0,0,0.45)',
  marginBottom: '6px',
}

const input: React.CSSProperties = {
  width: '100%',
  padding: '9px 11px',
  fontSize: '13px',
  border: '1px solid rgba(0,0,0,0.15)',
  borderRadius: '6px',
  boxSizing: 'border-box',
  color: '#12243f',
  background: '#fff',
}

const DEVICE_ICONS: Record<string, string> = { mobile: '📱', tablet: '📲', desktop: '💻', other: '❓' }

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 10_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString()
}

function newId(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID().split('-')[0] + crypto.randomUUID().split('-')[1]
    : Math.random().toString(36).slice(2, 10)
}

function qrColors(fg: string, bg: string) {
  return { dark: fg, light: bg === 'transparent' ? '#0000' : bg }
}

/** WCAG relative luminance of a #rrggbb color (0 = black, 1 = white). */
function luminance(hex: string): number {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim())
  if (!m) return 1
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(m[1].slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** Contrast ratio between two colors (1–21). Transparent bg is treated as white. */
function contrastRatio(fg: string, bg: string): number {
  const l1 = luminance(fg)
  const l2 = bg === 'transparent' ? 1 : luminance(bg)
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1]
  return (hi + 0.05) / (lo + 0.05)
}

async function downloadQr(code: QrCodeModel, format: 'png' | 'svg' | 'jpeg', size: number): Promise<void> {
  const url = shortUrlFor(code.id)
  const base = (code.name || 'qr-code').replace(/[^a-z0-9-_ ]/gi, '').trim().replace(/\s+/g, '-').toLowerCase() || 'qr-code'
  const opts = { errorCorrectionLevel: 'M' as const, margin: 2, color: qrColors(code.fg, code.bg) }

  let href: string
  if (format === 'svg') {
    const svg = await QRCode.toString(url, { ...opts, type: 'svg', width: size })
    href = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }))
  } else if (format === 'png') {
    href = await QRCode.toDataURL(url, { ...opts, width: size })
  } else {
    // JPEG has no alpha — composite onto the background (white if transparent)
    const png = await QRCode.toDataURL(url, { ...opts, width: size })
    href = await new Promise<string>((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext('2d')!
        ctx.fillStyle = code.bg === 'transparent' ? '#ffffff' : code.bg
        ctx.fillRect(0, 0, size, size)
        ctx.drawImage(img, 0, 0, size, size)
        resolve(canvas.toDataURL('image/jpeg', 0.92))
      }
      img.onerror = reject
      img.src = png
    })
  }

  const a = document.createElement('a')
  a.href = href
  a.download = `${base}-${size}.${format === 'jpeg' ? 'jpg' : format}`
  a.click()
  if (href.startsWith('blob:')) URL.revokeObjectURL(href)
}

/** Live QR preview image, regenerated when id/colors change. */
function QrPreview({ id, fg, bg, px }: { id: string; fg: string; bg: string; px: number }) {
  const [src, setSrc] = useState('')
  useEffect(() => {
    let alive = true
    QRCode.toDataURL(shortUrlFor(id), { errorCorrectionLevel: 'M', margin: 2, width: px * 2, color: qrColors(fg, bg) })
      .then((s) => alive && setSrc(s))
      .catch(() => alive && setSrc(''))
    return () => {
      alive = false
    }
  }, [id, fg, bg, px])
  return (
    <div style={{ width: px, height: px, borderRadius: '8px', border: '1px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'repeating-conic-gradient(#f0f0f0 0% 25%, #fff 0% 50%) 0 0 / 16px 16px', overflow: 'hidden', flexShrink: 0 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {src ? <img src={src} alt="QR preview" width={px} height={px} style={{ display: 'block' }} /> : <span style={{ fontSize: '11px', color: 'rgba(0,0,0,0.4)' }}>…</span>}
    </div>
  )
}

/* --------------------------------- Builder --------------------------------- */

interface BuilderProps {
  initial: QrCodeModel | null
  campaigns: string[]
  onSaved: () => void
  onCancel: () => void
}

function Builder({ initial, campaigns, onSaved, onCancel }: BuilderProps) {
  const [id] = useState(() => initial?.id || newId())
  const [name, setName] = useState(initial?.name || '')
  const [destination, setDestination] = useState(initial?.destination || '')
  const [campaign, setCampaign] = useState(initial?.campaign || '')
  const [pillars, setPillars] = useState<string[]>(initial?.pillars || [])
  const [fg, setFg] = useState(initial?.fg || '#12243f')
  const [bg, setBg] = useState(initial?.bg || '#ffffff')
  const [size, setSize] = useState(1024)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const shortUrl = shortUrlFor(id)
  const draft: QrCodeModel = { id, name, destination, campaign: campaign || undefined, fg, bg, createdAt: initial?.createdAt || '' }

  // Scroll the builder into view when it opens — the app scrolls an inner
  // pane, so window.scrollTo() would be a silent no-op here.
  const panelRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  // Warnings for anything that would break scanning or surprise on edit.
  const ratio = contrastRatio(fg, bg)
  const inverted = luminance(fg) > (bg === 'transparent' ? 1 : luminance(bg))
  const unscannable = ratio < 2.5
  const weakContrast = !unscannable && ratio < 4
  const destinationChanged = !!initial && destination.trim() !== initial.destination
  const colorsChanged = !!initial && (fg !== initial.fg || bg !== initial.bg)

  const save = async () => {
    setError('')
    if (!name.trim()) return setError('Give the code a name.')
    if (!/^https?:\/\//i.test(destination.trim())) return setError('Destination must be a full URL starting with http(s)://')
    setSaving(true)
    try {
      const res = await fetch('/api/gtm/qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: { id, name, destination: destination.trim(), campaign, pillars, fg, bg } }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Save failed')
      onSaved()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const swatch = (color: string, active: boolean, onClick: () => void) => (
    <button
      key={color}
      onClick={onClick}
      title={color}
      style={{
        width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer', padding: 0,
        background: color === 'transparent' ? 'repeating-conic-gradient(#e0e0e0 0% 25%, #fff 0% 50%) 0 0 / 10px 10px' : color,
        border: active ? '2px solid #1A56DB' : '1px solid rgba(0,0,0,0.15)',
        boxShadow: active ? '0 0 0 2px rgba(246,138,50,0.25)' : 'none',
      }}
    />
  )

  const warnBox = (tone: 'red' | 'amber' | 'info', text: string) => (
    <p
      style={{
        margin: '0 0 10px 0',
        fontSize: '11.5px',
        lineHeight: 1.55,
        padding: '8px 11px',
        borderRadius: '6px',
        background: tone === 'red' ? '#fee2e2' : tone === 'amber' ? '#fef3c7' : 'rgba(25,34,77,0.05)',
        border: `1px solid ${tone === 'red' ? '#fecaca' : tone === 'amber' ? '#fde68a' : 'rgba(25,34,77,0.12)'}`,
        color: tone === 'red' ? '#b91c1c' : tone === 'amber' ? '#92400e' : '#3a4152',
      }}
    >
      {text}
    </p>
  )

  return (
    <div ref={panelRef} style={{ ...card, marginBottom: '24px', borderTop: '3px solid #1A56DB', scrollMarginTop: '12px' }}>
      <p style={{ margin: '0 0 18px 0', fontSize: '15px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em', color: '#12243f' }}>
        {initial ? `Edit QR Code${initial.name ? ` — ${initial.name}` : ''}` : 'New QR Code'}
      </p>
      <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
        {/* Form */}
        <div style={{ flex: '1 1 340px', minWidth: '300px' }}>
          <div style={{ marginBottom: '14px' }}>
            <label style={label}>Name</label>
            <input style={input} placeholder="e.g. Spring Camp Flyer" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={label}>Destination URL</label>
            <input style={input} placeholder="https://proven-athlete.com/signup" value={destination} onChange={(e) => setDestination(e.target.value)} />
            <p style={{ margin: '6px 0 0 0', fontSize: '11px', color: 'rgba(0,0,0,0.45)', lineHeight: 1.5 }}>
              The QR encodes a short tracking link, so you can change this later — even after printing.
            </p>
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={label}>Campaign</label>
            <input style={input} placeholder="e.g. spring-2026" value={campaign} onChange={(e) => setCampaign(e.target.value)} list="qr-campaigns" />
            {campaigns.length > 0 && (
              <datalist id="qr-campaigns">
                {campaigns.map((c) => <option key={c} value={c} />)}
              </datalist>
            )}
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={label}>Pillars</label>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {QR_PILLARS.map((p) => {
                const on = pillars.includes(p.id)
                return (
                  <button
                    key={p.id}
                    onClick={() => setPillars(on ? pillars.filter((x) => x !== p.id) : [...pillars, p.id])}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px',
                      fontSize: '11.5px', fontWeight: on ? 700 : 500, borderRadius: '999px', cursor: 'pointer',
                      background: on ? 'rgba(25,34,77,0.92)' : '#fff', color: on ? '#fff' : '#12243f',
                      border: on ? '1px solid #12243f' : '1px solid rgba(0,0,0,0.18)',
                    }}
                  >
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.color, flexShrink: 0 }} />
                    {p.label}
                    {on && <span style={{ fontSize: '10px' }}>✓</span>}
                  </button>
                )
              })}
            </div>
            <p style={{ margin: '6px 0 0 0', fontSize: '11px', color: 'rgba(0,0,0,0.45)' }}>Tag one or more pillars to sort and filter the library.</p>
          </div>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '14px' }}>
            <div>
              <label style={label}>Code Color</label>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                {QR_FG_PRESETS.map((c) => swatch(c, fg === c, () => setFg(c)))}
                <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} title="Custom color" style={{ width: '28px', height: '28px', padding: 0, border: '1px solid rgba(0,0,0,0.15)', borderRadius: '6px', cursor: 'pointer', background: '#fff' }} />
              </div>
            </div>
            <div>
              <label style={label}>Background</label>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                {QR_BG_PRESETS.map((c) => swatch(c, bg === c, () => setBg(c)))}
                <input type="color" value={bg === 'transparent' ? '#ffffff' : bg} onChange={(e) => setBg(e.target.value)} title="Custom color" style={{ width: '28px', height: '28px', padding: 0, border: '1px solid rgba(0,0,0,0.15)', borderRadius: '6px', cursor: 'pointer', background: '#fff' }} />
              </div>
            </div>
          </div>
          {unscannable && warnBox('red', `Not enough contrast between the code and background (ratio ${ratio.toFixed(1)}:1) — scanners won't read this. Pick a darker code color or lighter background.`)}
          {!unscannable && inverted && warnBox('amber', 'Light code on a dark background: many camera apps fail on inverted QR codes. Dark-on-light is the safe choice for print.')}
          {weakContrast && !inverted && warnBox('amber', `Low contrast (ratio ${ratio.toFixed(1)}:1) — this may scan poorly in bad lighting or from a distance. Aim for a clearly dark code on a light background.`)}
          {destinationChanged && warnBox('amber', 'Destination changed: the moment you save, every existing copy of this code — including anything already printed — sends people to the new URL. Scan history is kept.')}
          {colorsChanged && warnBox('info', 'Color changes only affect files you download from now on. Already-printed codes keep their old look and keep working — the tracking link inside is unchanged.')}
          {error && <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#c62828' }}>{error}</p>}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={save} disabled={saving} style={{ padding: '10px 22px', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', background: '#00a651', color: '#fff', borderRadius: '6px', cursor: saving ? 'wait' : 'pointer' }}>
              {saving ? 'Saving...' : initial ? 'Save Changes' : 'Create QR Code'}
            </button>
            <button onClick={onCancel} style={{ padding: '10px 18px', fontSize: '13px', fontWeight: 600, background: '#fff', color: '#12243f', border: '1px solid rgba(0,0,0,0.2)', borderRadius: '6px', cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>

        {/* Preview + download */}
        <div style={{ flex: '0 1 260px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <QrPreview id={id} fg={fg} bg={bg} px={200} />
          <button
            onClick={() => { navigator.clipboard.writeText(shortUrl); setCopied(true); setTimeout(() => setCopied(false), 1600) }}
            title="Copy tracking link"
            style={{ fontSize: '11.5px', color: copied ? '#00753a' : 'rgba(0,0,0,0.55)', background: 'rgba(0,0,0,0.045)', border: 'none', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer', fontFamily: 'monospace' }}
          >
            {copied ? '✓ Copied' : shortUrl.replace(/^https?:\/\//, '')}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ ...label, marginBottom: 0 }}>Size</label>
            <select value={size} onChange={(e) => setSize(Number(e.target.value))} style={{ ...input, width: 'auto', padding: '6px 8px', fontSize: '12px' }}>
              {[512, 1024, 2048].map((s) => <option key={s} value={s}>{s} px</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['png', 'svg', 'jpeg'] as const).map((f) => (
              <button key={f} onClick={() => downloadQr(draft, f, size)} style={{ padding: '8px 16px', fontSize: '12px', fontWeight: 800, letterSpacing: '0.05em', background: '#12243f', color: '#fff', borderRadius: '6px', cursor: 'pointer', textTransform: 'uppercase' }}>
                {f}
              </button>
            ))}
          </div>
          {!initial && <p style={{ margin: 0, fontSize: '10.5px', color: 'rgba(0,0,0,0.4)', textAlign: 'center', lineHeight: 1.5 }}>Save before printing so the tracking link goes live.</p>}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------- Scan detail ------------------------------- */

function ScanDetail({ detail }: { detail: QrScanDetail }) {
  const days = 14
  const { bars, max } = useMemo(() => {
    const byDay = new Map<string, number>()
    for (let i = 0; i < days; i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      byDay.set(d.toISOString().slice(0, 10), 0)
    }
    for (const e of detail.events) {
      const day = e.at.slice(0, 10)
      if (byDay.has(day)) byDay.set(day, (byDay.get(day) || 0) + 1)
    }
    const bars = [...byDay.entries()].reverse()
    return { bars, max: Math.max(1, ...bars.map(([, v]) => v)) }
  }, [detail.events])

  const breakdown = (pick: (e: QrScan) => string) => {
    const m = new Map<string, number>()
    for (const e of detail.events) m.set(pick(e), (m.get(pick(e)) || 0) + 1)
    return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)
  }
  const devices = breakdown((e) => e.device)
  const countries = breakdown((e) => e.country || '—')

  if (detail.events.length === 0) {
    return <p style={{ margin: '14px 0 0 0', fontSize: '12.5px', color: 'rgba(0,0,0,0.45)' }}>No scans yet. Metrics appear the first time someone scans this code.</p>
  }

  return (
    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
      <p style={{ ...label, marginBottom: '10px' }}>Scans — last {days} days</p>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '54px', marginBottom: '4px' }}>
        {bars.map(([day, v]) => (
          <div key={day} title={`${day}: ${v} scan${v === 1 ? '' : 's'}`} style={{ flex: 1, height: `${Math.max(4, (v / max) * 100)}%`, background: v ? '#1A56DB' : 'rgba(0,0,0,0.08)', borderRadius: '2px 2px 0 0' }} />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'rgba(0,0,0,0.4)', marginBottom: '14px' }}>
        <span>{bars[0][0].slice(5)}</span>
        <span>{bars[bars.length - 1][0].slice(5)}</span>
      </div>
      <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
        <div>
          <p style={{ ...label, marginBottom: '8px' }}>Devices</p>
          {devices.map(([d, v]) => (
            <p key={d} style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#12243f' }}>
              {DEVICE_ICONS[d] || ''} <span style={{ textTransform: 'capitalize' }}>{d}</span>
              <span style={{ color: 'rgba(0,0,0,0.45)' }}> — {v} ({Math.round((v / detail.events.length) * 100)}%)</span>
            </p>
          ))}
        </div>
        <div>
          <p style={{ ...label, marginBottom: '8px' }}>Countries</p>
          {countries.map(([c, v]) => (
            <p key={c} style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#12243f' }}>
              {c}<span style={{ color: 'rgba(0,0,0,0.45)' }}> — {v}</span>
            </p>
          ))}
        </div>
        <div>
          <p style={{ ...label, marginBottom: '8px' }}>Recent</p>
          {detail.events.slice(0, 5).map((e, i) => (
            <p key={i} style={{ margin: '0 0 4px 0', fontSize: '12px', color: 'rgba(0,0,0,0.6)' }}>
              {new Date(e.at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
              {' · '}{DEVICE_ICONS[e.device] || e.device}{e.country ? ` · ${e.country}` : ''}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}

/* --------------------------------- Library --------------------------------- */

export default function QrLibrary() {
  const [codes, setCodes] = useState<QrCodeWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [building, setBuilding] = useState(false)
  const [editing, setEditing] = useState<QrCodeModel | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [details, setDetails] = useState<Record<string, QrScanDetail>>({})
  const [deleting, setDeleting] = useState<QrCodeWithStats | null>(null)
  const [campaignFilter, setCampaignFilter] = useState('')
  const [pillarFilter, setPillarFilter] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/gtm/qr')
      if (res.ok) setCodes((await res.json()).codes || [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const toggleDetail = async (id: string) => {
    if (expanded === id) return setExpanded(null)
    setExpanded(id)
    if (!details[id]) {
      const res = await fetch(`/api/gtm/qr?id=${id}`)
      if (res.ok) {
        const d = (await res.json()) as QrScanDetail
        setDetails((prev) => ({ ...prev, [id]: d }))
      }
    }
  }

  const remove = async (id: string) => {
    setDeleting(null)
    await fetch(`/api/gtm/qr?id=${id}`, { method: 'DELETE' })
    setCodes((prev) => prev.filter((c) => c.id !== id))
  }

  const campaigns = useMemo(() => [...new Set(codes.map((c) => c.campaign).filter((c): c is string => !!c))].sort(), [codes])
  const visible = codes
    .filter((c) => !campaignFilter || c.campaign === campaignFilter)
    .filter((c) => !pillarFilter || (c.pillars || []).includes(pillarFilter))
  const totalScans = codes.reduce((s, c) => s + c.scans, 0)
  const top = codes.length ? codes.reduce((a, b) => (b.scans > a.scans ? b : a)) : null

  return (
    <div>
      {/* Summary + actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
          {[
            ['QR Codes', fmt(codes.length)],
            ['Total Scans', fmt(totalScans)],
            ['Top Performer', top && top.scans > 0 ? top.name : '—'],
          ].map(([l, v]) => (
            <div key={l}>
              <p style={{ ...label, marginBottom: '2px' }}>{l}</p>
              <p style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#12243f', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v}</p>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {codes.some((c) => c.pillars?.length) && (
            <select value={pillarFilter} onChange={(e) => setPillarFilter(e.target.value)} style={{ ...input, width: 'auto', padding: '8px 10px', fontSize: '12px' }}>
              <option value="">All pillars</option>
              {QR_PILLARS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
          )}
          {campaigns.length > 0 && (
            <select value={campaignFilter} onChange={(e) => setCampaignFilter(e.target.value)} style={{ ...input, width: 'auto', padding: '8px 10px', fontSize: '12px' }}>
              <option value="">All campaigns</option>
              {campaigns.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          )}
          {!building && !editing && (
            <button onClick={() => setBuilding(true)} style={{ padding: '10px 20px', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', background: '#1A56DB', color: '#fff', borderRadius: '6px', cursor: 'pointer' }}>
              ＋ New QR Code
            </button>
          )}
        </div>
      </div>

      {(building || editing) && (
        <Builder
          key={editing?.id || 'new'}
          initial={editing}
          campaigns={campaigns}
          onSaved={() => { setBuilding(false); setEditing(null); load() }}
          onCancel={() => { setBuilding(false); setEditing(null) }}
        />
      )}

      {/* Library */}
      {loading && codes.length === 0 ? (
        <p style={{ fontSize: '13px', color: 'rgba(0,0,0,0.45)' }}>Loading QR codes...</p>
      ) : visible.length === 0 ? (
        <div style={{ ...card, textAlign: 'center', padding: '48px 24px' }}>
          <p style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: 700, color: '#12243f' }}>
            {campaignFilter ? 'No codes in this campaign' : 'No QR codes yet'}
          </p>
          <p style={{ margin: 0, fontSize: '13px', color: 'rgba(0,0,0,0.5)' }}>
            {campaignFilter ? 'Try a different campaign filter.' : 'Create your first trackable QR code — every scan is logged here.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
          {visible.map((c) => (
            <div key={c.id} style={{ ...card, padding: '16px' }}>
              <div style={{ display: 'flex', gap: '14px' }}>
                <QrPreview id={c.id} fg={c.fg} bg={c.bg} px={84} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#12243f', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</p>
                    {c.campaign && (
                      <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', padding: '3px 9px', borderRadius: '999px', background: 'rgba(246,138,50,0.14)', color: '#b05a10', whiteSpace: 'nowrap' }}>{c.campaign}</span>
                    )}
                  </div>
                  {(c.pillars?.length ?? 0) > 0 && (
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '4px' }}>
                      {c.pillars!.map((pid) => {
                        const p = QR_PILLARS.find((x) => x.id === pid)
                        return p ? (
                          <span key={pid} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '9.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', padding: '2px 8px', borderRadius: '999px', background: 'rgba(25,34,77,0.06)', color: '#12243f', whiteSpace: 'nowrap' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: p.color }} />{p.label}
                          </span>
                        ) : null
                      })}
                    </div>
                  )}
                  <p style={{ margin: '3px 0 8px 0', fontSize: '11.5px', color: 'rgba(0,0,0,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={c.destination}>
                    → {c.destination.replace(/^https?:\/\//, '')}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                    <span style={{ fontSize: '24px', fontWeight: 800, color: '#12243f', lineHeight: 1 }}>{fmt(c.scans)}</span>
                    <span style={{ fontSize: '11px', color: 'rgba(0,0,0,0.45)' }}>
                      scan{c.scans === 1 ? '' : 's'}
                      {c.lastScanAt && ` · last ${new Date(c.lastScanAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '6px', marginTop: '12px', flexWrap: 'wrap' }}>
                <button onClick={() => toggleDetail(c.id)} style={{ padding: '6px 12px', fontSize: '11.5px', fontWeight: 700, background: expanded === c.id ? '#12243f' : 'rgba(25,34,77,0.08)', color: expanded === c.id ? '#fff' : '#12243f', borderRadius: '5px', cursor: 'pointer' }}>
                  {expanded === c.id ? 'Hide Metrics' : 'Metrics'}
                </button>
                <button onClick={() => downloadQr(c, 'png', 1024)} style={{ padding: '6px 12px', fontSize: '11.5px', fontWeight: 600, background: '#fff', color: '#12243f', border: '1px solid rgba(0,0,0,0.15)', borderRadius: '5px', cursor: 'pointer' }}>
                  ↓ PNG
                </button>
                <button onClick={() => downloadQr(c, 'svg', 1024)} style={{ padding: '6px 12px', fontSize: '11.5px', fontWeight: 600, background: '#fff', color: '#12243f', border: '1px solid rgba(0,0,0,0.15)', borderRadius: '5px', cursor: 'pointer' }}>
                  ↓ SVG
                </button>
                <button
                  onClick={() => { navigator.clipboard.writeText(shortUrlFor(c.id)); setCopiedId(c.id); setTimeout(() => setCopiedId(null), 1600) }}
                  style={{ padding: '6px 12px', fontSize: '11.5px', fontWeight: 600, background: '#fff', color: copiedId === c.id ? '#00753a' : '#12243f', border: '1px solid rgba(0,0,0,0.15)', borderRadius: '5px', cursor: 'pointer' }}
                >
                  {copiedId === c.id ? '✓ Copied' : 'Copy Link'}
                </button>
                <button onClick={() => { setEditing(c); setBuilding(false); setExpanded(null) }} style={{ padding: '6px 12px', fontSize: '11.5px', fontWeight: 600, background: '#fff', color: '#12243f', border: '1px solid rgba(0,0,0,0.15)', borderRadius: '5px', cursor: 'pointer' }}>
                  Edit
                </button>
                <button onClick={() => setDeleting(c)} style={{ padding: '6px 12px', fontSize: '11.5px', fontWeight: 600, background: '#fff', color: '#c62828', border: '1px solid rgba(198,40,40,0.3)', borderRadius: '5px', cursor: 'pointer', marginLeft: 'auto' }}>
                  Delete
                </button>
              </div>

              {expanded === c.id && (
                details[c.id]
                  ? <ScanDetail detail={details[c.id]} />
                  : <p style={{ margin: '14px 0 0 0', fontSize: '12px', color: 'rgba(0,0,0,0.45)' }}>Loading scans...</p>
              )}
            </div>
          ))}
        </div>
      )}

      {deleting && (
        <ConfirmModal
          title={`Delete "${deleting.name}"?`}
          message={`This removes the QR code and its ${fmt(deleting.scans)} logged scan${deleting.scans === 1 ? '' : 's'} for the whole team. Printed codes will stop working and redirect to the site root.`}
          onConfirm={() => remove(deleting.id)}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  )
}

function ConfirmModal({ title, message, onConfirm, onCancel }: { title: string; message: string; onConfirm: () => void; onCancel: () => void }) {
  const font = "'Inter', system-ui, -apple-system, sans-serif"
  return (
    <div
      onClick={onCancel}
      style={{ position: 'fixed', inset: 0, background: 'rgba(18,36,63,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, fontFamily: font }}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: 10, padding: 24, maxWidth: 440, width: '90%', boxShadow: '0 12px 40px rgba(0,0,0,0.25)' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: 16, fontWeight: 700, color: '#12243f' }}>{title}</p>
        <p style={{ margin: '0 0 20px 0', fontSize: 13, color: 'rgba(0,0,0,0.65)', lineHeight: 1.55 }}>{message}</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={{ padding: '9px 16px', fontSize: 13, fontWeight: 600, background: '#fff', color: '#12243f', border: '1px solid rgba(0,0,0,0.2)', borderRadius: 6, cursor: 'pointer' }}>
            Cancel
          </button>
          <button onClick={onConfirm} style={{ padding: '9px 16px', fontSize: 13, fontWeight: 700, background: '#c62828', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
