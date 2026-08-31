'use client'

import { useState } from 'react'
import LinkInBioBuilder from '@/components/gtm/LinkInBioBuilder'
import LinkPageAnalytics from '@/components/gtm/LinkPageAnalytics'

const NAVY = '#061341'

export default function Page() {
  const [tab, setTab] = useState<'build' | 'stats'>('build')

  return (
    <div>
      <div style={{ display: 'flex', gap: 4, padding: '20px 40px 0' }}>
        {(['build', 'stats'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '9px 16px',
              fontSize: 13,
              fontWeight: t === tab ? 700 : 500,
              color: t === tab ? NAVY : 'rgba(0,0,0,0.5)',
              borderBottom: `2px solid ${t === tab ? '#0CF4DF' : 'transparent'}`,
              background: 'none',
              cursor: 'pointer',
            }}
          >
            {t === 'build' ? 'Builder' : 'Analytics'}
          </button>
        ))}
      </div>

      {tab === 'build' ? (
        <LinkInBioBuilder />
      ) : (
        <div style={{ padding: '28px 40px 80px', maxWidth: 1000 }}>
          <p style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#0CF4DF' }}>Distribute</p>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: NAVY, margin: '4px 0 20px' }}>Link in Bio — Analytics</h1>
          <LinkPageAnalytics />
        </div>
      )}
    </div>
  )
}
