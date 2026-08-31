'use client'

/**
 * Link in Bio builder (Distribute route /links). Two columns: a form (AUTIX light
 * admin theme) and a live phone preview. The preview is an <iframe srcDoc> fed by the
 * SAME renderLinkPageHtml the public /links route uses (preview == production).
 *
 * Persistence is the authed team API (not localStorage) — one shared always-live
 * page. Media inputs are plain URL fields.
 */

import { useEffect, useMemo, useState } from 'react'
import { renderLinkPageHtml } from '@/lib/gtm/render-link-page'
import {
  LOGO_SIZE,
  newLinkId,
  SOCIAL_IDS,
  type LinkButton,
  type LinkPageConfig,
  type SocialId,
} from '@/lib/gtm/link-page-types'

const ACCENT = '#0CF4DF'
const INK = '#061341'
const PILLAR_SWATCHES = ['#0CF4DF', '#9B5FE8', '#F2B33D', '#5FD9C2']

const SOCIAL_LABELS: Record<SocialId, string> = {
  instagram: 'Instagram',
  x: 'X',
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
}

const card: React.CSSProperties = {
  background: '#fff',
  border: '1px solid rgba(0,0,0,0.1)',
  borderRadius: 8,
  padding: 14,
  margin: 0,
  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
}
const input: React.CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  fontSize: 13,
  border: '1px solid rgba(0,0,0,0.18)',
  borderRadius: 6,
  color: INK,
  background: '#fff',
}
const label: React.CSSProperties = { fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'rgba(0,0,0,0.45)' }

function defaultConfig(): LinkPageConfig {
  return { header: { showLogo: true, logoSize: LOGO_SIZE.default, headline: '', bio: '' }, accent: ACCENT, links: [], socials: {}, seo: { title: '', description: '' }, updatedAt: '' }
}

function comparable(c: LinkPageConfig): string {
  return JSON.stringify({
    header: c.header, accent: c.accent, background: c.background ?? null, featured: c.featured ?? null,
    links: c.links, socials: c.socials, footerUrl: c.footerUrl ?? '', seo: { title: c.seo.title, description: c.seo.description },
  })
}

export default function LinkInBioBuilder() {
  const [config, setConfig] = useState<LinkPageConfig | null>(null)
  const [savedSnap, setSavedSnap] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/gtm/link-page')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        const c: LinkPageConfig = d?.config ?? defaultConfig()
        setConfig(c)
        setSavedSnap(comparable(c))
        setLoading(false)
      })
      .catch(() => { setConfig(defaultConfig()); setLoading(false) })
  }, [])

  const dirty = useMemo(() => (config ? comparable(config) !== savedSnap : false), [config, savedSnap])
  const previewHtml = useMemo(() => (config ? renderLinkPageHtml(config, { origin: '', beacon: false }) : ''), [config])

  function patch(p: Partial<LinkPageConfig>) { setConfig((c) => (c ? { ...c, ...p } : c)) }
  function patchHeader(p: Partial<LinkPageConfig['header']>) { setConfig((c) => (c ? { ...c, header: { ...c.header, ...p } } : c)) }
  function patchLink(i: number, p: Partial<LinkButton>) { setConfig((c) => (c ? { ...c, links: c.links.map((l, j) => (j === i ? { ...l, ...p } : l)) } : c)) }
  function moveLink(i: number, dir: -1 | 1) {
    setConfig((c) => {
      if (!c) return c
      const j = i + dir
      if (j < 0 || j >= c.links.length) return c
      const links = c.links.slice()
      ;[links[i], links[j]] = [links[j], links[i]]
      return { ...c, links }
    })
  }
  function addLink() {
    setConfig((c) => (c && c.links.length < 20 ? { ...c, links: [...c.links, { id: newLinkId(), label: '', url: '', style: 'filled', enabled: true }] } : c))
  }
  function deleteLink(i: number) {
    if (!window.confirm('Delete this link? Its click history is kept and shows as "(removed link)" in Analytics. To hide it without losing history, toggle it off instead.')) return
    setConfig((c) => (c ? { ...c, links: c.links.filter((_, j) => j !== i) } : c))
  }
  function setSocial(id: SocialId, v: string) { setConfig((c) => (c ? { ...c, socials: { ...c.socials, [id]: v } } : c)) }

  async function save(regenerateOg = false) {
    if (!config) return
    setSaving(true)
    try {
      const res = await fetch('/api/gtm/link-page', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...config, regenerateOg }) })
      if (res.ok) {
        const d = await res.json()
        if (d?.config) { setConfig(d.config); setSavedSnap(comparable(d.config)) }
      }
    } finally { setSaving(false) }
  }

  if (loading || !config) {
    return <div style={{ padding: '32px 40px' }}><h1 style={{ fontSize: 28, color: INK }}>Link in Bio</h1><p style={{ color: 'rgba(0,0,0,0.5)', marginTop: 12 }}>Loading…</p></div>
  }

  return (
    <div style={{ padding: '28px 40px 80px', maxWidth: 1180 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap', marginBottom: 22 }}>
        <div style={{ flex: 1, minWidth: 260 }}>
          <p style={{ ...label, color: ACCENT }}>Distribute</p>
          <h1 style={{ fontSize: 30, fontWeight: 900, color: INK, margin: '4px 0 6px' }}>Link in Bio</h1>
          <p style={{ fontSize: 13.5, color: 'rgba(0,0,0,0.6)', maxWidth: 560 }}>One always-live branded page at <code>/links</code> — the destination for your Instagram bio. Saving publishes immediately.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {dirty && <span title="Unsaved changes" style={{ width: 8, height: 8, borderRadius: '50%', background: '#F4B400' }} />}
          <a href="/links" target="_blank" rel="noreferrer" style={{ fontSize: 12.5, color: 'rgba(0,0,0,0.55)' }}>View live ↗</a>
          <button onClick={() => save(false)} disabled={saving} style={{ padding: '9px 18px', borderRadius: 6, fontSize: 13, fontWeight: 700, color: '#fff', background: dirty ? '#00A14B' : ACCENT, cursor: saving ? 'wait' : 'pointer', opacity: saving ? 0.6 : 1 }}>
            {saving ? 'Saving…' : 'Save & Publish'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 420px', minWidth: 320, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Card title="Header">
            <Toggle label="Show logo" on={config.header.showLogo} onToggle={() => patchHeader({ showLogo: !config.header.showLogo })} />
            {config.header.showLogo && (
              <>
                <Field l="Logo image URL — replaces the brand logo when set">
                  <input style={input} value={config.header.logoUrl ?? ''} onChange={(e) => patchHeader({ logoUrl: e.target.value })} placeholder="https://… .svg / .png (blank = brand logo)" />
                </Field>
                <Field l={`Logo size — ${config.header.logoSize ?? LOGO_SIZE.default}px`}>
                  <input type="range" min={LOGO_SIZE.min} max={LOGO_SIZE.max} value={config.header.logoSize ?? LOGO_SIZE.default} onChange={(e) => patchHeader({ logoSize: Number(e.target.value) })} style={{ width: '100%', accentColor: ACCENT }} />
                </Field>
              </>
            )}
            <Field l="Avatar image URL"><input style={input} value={config.header.avatarUrl ?? ''} onChange={(e) => patchHeader({ avatarUrl: e.target.value })} placeholder="https://…" /></Field>
            <Field l="Headline"><input style={input} maxLength={120} value={config.header.headline} onChange={(e) => patchHeader({ headline: e.target.value })} placeholder="Your name or brand" /></Field>
            <Field l="Bio"><textarea style={{ ...input, resize: 'vertical' }} rows={2} maxLength={400} value={config.header.bio} onChange={(e) => patchHeader({ bio: e.target.value })} placeholder="One line about you" /></Field>
          </Card>

          <Card title="Background Video">
            <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.5)', marginBottom: 8 }}>A muted, looping video behind everything. A scrim keeps text readable; reduced-motion visitors see the gradient instead.</p>
            <Toggle label="Enable background video" on={!!config.background?.enabled} onToggle={() => patch({ background: { enabled: !config.background?.enabled, url: config.background?.url ?? '' } })} />
            <Field l="Video URL"><input style={input} value={config.background?.url ?? ''} onChange={(e) => patch({ background: { enabled: config.background?.enabled ?? false, url: e.target.value } })} placeholder="https://… .mp4" /></Field>
          </Card>

          <Card title={`Links (${config.links.length}/20)`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {config.links.map((l, i) => (
                <div key={l.id} style={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8, padding: 12, background: '#fafafa' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <Toggle compact label="On" on={l.enabled} onToggle={() => patchLink(i, { enabled: !l.enabled })} />
                    <button onClick={() => patchLink(i, { featured: !l.featured })} title="Featured (large card)" style={{ fontSize: 12, padding: '3px 8px', borderRadius: 6, border: '1px solid rgba(0,0,0,0.15)', color: l.featured ? ACCENT : 'rgba(0,0,0,0.5)', fontWeight: l.featured ? 700 : 500, cursor: 'pointer', background: '#fff' }}>★ Featured</button>
                    <span style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
                      <IconBtn label="Move up" onClick={() => moveLink(i, -1)}>▲</IconBtn>
                      <IconBtn label="Move down" onClick={() => moveLink(i, 1)}>▼</IconBtn>
                      <IconBtn label="Delete" onClick={() => deleteLink(i)}>✕</IconBtn>
                    </span>
                  </div>
                  <input style={{ ...input, marginBottom: 6 }} maxLength={60} value={l.label} onChange={(e) => patchLink(i, { label: e.target.value })} placeholder="Label" />
                  <input style={{ ...input, marginBottom: 6 }} value={l.url} onChange={(e) => patchLink(i, { url: e.target.value })} placeholder="https://…" />
                  <input style={{ ...input, marginBottom: 8 }} maxLength={80} value={l.note ?? ''} onChange={(e) => patchLink(i, { note: e.target.value })} placeholder="Subtitle (optional)" />
                  <StyleSwatches link={l} onPick={(p) => patchLink(i, p)} />
                </div>
              ))}
            </div>
            {config.links.length < 20 && (
              <button onClick={addLink} style={{ marginTop: 12, fontSize: 12.5, padding: '9px 12px', borderRadius: 6, border: '1px dashed rgba(0,0,0,0.25)', color: INK, width: '100%', cursor: 'pointer', background: '#fff' }}>+ Add Link</button>
            )}
          </Card>

          <Card title="Social Icons">
            <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.5)', marginBottom: 8 }}>Blank hides the icon.</p>
            {SOCIAL_IDS.map((id) => (
              <Field key={id} l={SOCIAL_LABELS[id]}><input style={input} value={config.socials[id] ?? ''} onChange={(e) => setSocial(id, e.target.value)} placeholder="https://…" /></Field>
            ))}
          </Card>

          <Card title="Page Settings">
            <Field l="Accent color">
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input type="color" value={config.accent} onChange={(e) => patch({ accent: e.target.value })} style={{ width: 40, height: 32, border: 'none', background: 'none', padding: 0 }} />
                <input style={{ ...input, flex: 1 }} value={config.accent} onChange={(e) => patch({ accent: e.target.value })} />
              </div>
            </Field>
            <Field l="Footer link"><input style={input} value={config.footerUrl ?? ''} onChange={(e) => patch({ footerUrl: e.target.value })} placeholder="momentify.com" /></Field>
            <Field l="SEO title"><input style={input} maxLength={120} value={config.seo.title} onChange={(e) => patch({ seo: { ...config.seo, title: e.target.value } })} /></Field>
            <Field l="SEO description"><textarea style={{ ...input, resize: 'vertical' }} rows={2} maxLength={300} value={config.seo.description} onChange={(e) => patch({ seo: { ...config.seo, description: e.target.value } })} /></Field>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
              {config.seo.ogImage ? <img src={config.seo.ogImage} alt="OG preview" style={{ width: 96, height: 50, objectFit: 'cover', borderRadius: 6, border: '1px solid rgba(0,0,0,0.12)' }} /> : <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>No preview image yet.</span>}
              <button onClick={() => save(true)} disabled={saving} style={{ fontSize: 12, padding: '7px 11px', borderRadius: 6, border: '1px solid rgba(0,0,0,0.18)', color: INK, cursor: 'pointer', background: '#fff' }}>Refresh preview image</button>
            </div>
          </Card>
        </div>

        <div style={{ flex: '0 0 360px', position: 'sticky', top: 20 }}>
          <p style={{ ...label, marginBottom: 10 }}>Live preview</p>
          <div style={{ border: '10px solid #111', borderRadius: 34, overflow: 'hidden', boxShadow: '0 16px 44px rgba(0,0,0,0.25)', width: 340, margin: '0 auto' }}>
            <iframe title="Link in Bio preview" srcDoc={previewHtml} style={{ width: 340, height: 700, border: 0, display: 'block' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return <div style={card}><p style={{ ...label, marginBottom: 10 }}>{title}</p>{children}</div>
}
function Field({ l, children }: { l: string; children: React.ReactNode }) {
  return <div style={{ marginBottom: 7 }}><span style={label}>{l}</span><div style={{ marginTop: 4 }}>{children}</div></div>
}
function Toggle({ label: lbl, on, onToggle, compact }: { label: string; on: boolean; onToggle: () => void; compact?: boolean }) {
  return (
    <button onClick={onToggle} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: compact ? 0 : 10, cursor: 'pointer', background: 'none' }}>
      <span style={{ width: 34, height: 20, borderRadius: 10, background: on ? ACCENT : 'rgba(0,0,0,0.2)', position: 'relative', flex: 'none', transition: 'background .15s' }}>
        <span style={{ position: 'absolute', top: 2, left: on ? 16 : 2, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left .15s' }} />
      </span>
      <span style={{ fontSize: 13, color: INK }}>{lbl}</span>
    </button>
  )
}
function IconBtn({ label: lbl, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} title={lbl} aria-label={lbl} style={{ width: 26, height: 24, borderRadius: 6, border: '1px solid rgba(0,0,0,0.15)', color: 'rgba(0,0,0,0.5)', fontSize: 11, cursor: 'pointer', background: '#fff' }}>{children}</button>
}
function StyleSwatches({ link, onPick }: { link: LinkButton; onPick: (p: Partial<LinkButton>) => void }) {
  const activeFilled = link.style === 'filled'
  function chip(bg: string, active: boolean, onClick: () => void, title: string, border?: string) {
    return <button key={title} title={title} onClick={onClick} style={{ width: 22, height: 22, borderRadius: 6, background: bg, border: active ? `2px solid ${INK}` : border || '1px solid rgba(0,0,0,0.15)', flex: 'none', cursor: 'pointer' }} />
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
      {PILLAR_SWATCHES.map((c) => chip(c, activeFilled && link.color === c, () => onPick({ style: 'filled', color: c }), c))}
      {chip('rgba(0,0,0,0.08)', link.style === 'glass', () => onPick({ style: 'glass' }), 'Glass', '1px solid rgba(0,0,0,0.25)')}
      {chip('#fff', link.style === 'ghost', () => onPick({ style: 'ghost' }), 'Outline', '1.5px solid rgba(0,0,0,0.4)')}
    </div>
  )
}
