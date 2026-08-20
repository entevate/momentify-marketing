'use client'

import { useState } from 'react'

const PLATFORM_LABELS: Record<string, string> = {
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
  x: 'X (Twitter)',
  facebook: 'Facebook',
}

const ACCENT = '#1A56DB'

interface CaptionsPanelProps {
  captions: Record<string, string>
  /** editable mode (Content Builder); read-only elsewhere */
  onChange?: (captions: Record<string, string>) => void
  compact?: boolean
}

/**
 * Platform captions as a grid of per-platform cards with copy buttons; editable
 * when onChange is given. Canonical output-panel form (replaces marker tabs).
 */
export default function CaptionsPanel({ captions, onChange, compact }: CaptionsPanelProps) {
  const [copied, setCopied] = useState<string | null>(null)
  const platforms = Object.keys(PLATFORM_LABELS).filter((p) => captions[p])
  if (platforms.length === 0) return null

  const copy = async (platform: string) => {
    try {
      await navigator.clipboard.writeText(captions[platform])
      setCopied(platform)
      setTimeout(() => setCopied(null), 1500)
    } catch {
      /* ignore */
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: compact ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))', gap: 12 }}>
      {platforms.map((p) => (
        <div key={p} style={{ background: 'var(--gtm-bg-page)', border: '1px solid var(--gtm-border)', borderRadius: 6, padding: '12px 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--gtm-text-primary)' }}>
              {PLATFORM_LABELS[p]}
              {p === 'x' && (
                <span style={{ marginLeft: 8, fontWeight: 500, textTransform: 'none', letterSpacing: 0, color: captions[p].length > 280 ? '#c62828' : 'var(--gtm-text-faint)' }}>
                  {captions[p].length}/280
                </span>
              )}
            </span>
            <button
              onClick={() => copy(p)}
              style={{ fontSize: 11, fontWeight: 700, padding: '4px 11px', borderRadius: 5, border: 'none', background: copied === p ? '#00a651' : ACCENT, color: '#fff', cursor: 'pointer' }}
            >
              {copied === p ? 'Copied ✓' : 'Copy'}
            </button>
          </div>
          {onChange ? (
            <textarea
              value={captions[p]}
              onChange={(e) => onChange({ ...captions, [p]: e.target.value })}
              rows={p === 'x' || p === 'facebook' ? 3 : 5}
              style={{ width: '100%', padding: '8px 10px', fontSize: 12.5, lineHeight: 1.55, border: '1px solid var(--gtm-border)', borderRadius: 5, resize: 'vertical', color: 'var(--gtm-text-primary)', background: '#fff', boxSizing: 'border-box' }}
            />
          ) : (
            <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.55, color: 'var(--gtm-text-primary)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{captions[p]}</p>
          )}
        </div>
      ))}
    </div>
  )
}
