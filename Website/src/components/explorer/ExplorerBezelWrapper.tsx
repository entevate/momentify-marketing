'use client';

import { useState, useEffect } from 'react';
import ExplorerRenderer from './ExplorerRenderer';
import type { ExplorerConfig } from '@/lib/explorer/types';

/**
 * Wraps ExplorerRenderer in an iPad Pro 12.9" landscape bezel.
 * The ExplorerShell renders at 1366x1024 fixed. This component
 * provides the bezel frame and scales the whole thing to fit the viewport.
 */
export default function ExplorerBezelWrapper({ config }: { config: ExplorerConfig }) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function resize() {
      const w = window.innerWidth;
      const h = window.innerHeight - 48;
      const sx = w / 1398;
      const sy = h / 1056;
      setScale(Math.min(sx, sy, 1));
    }
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        background: '#000E1F',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: 1398 * scale,
          height: 1056 * scale,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: 'relative',
            width: 1398,
            height: 1056,
            background: '#0a1628',
            borderRadius: 22,
            border: '1.5px solid rgba(255,255,255,0.1)',
            boxShadow:
              '0 0 0 1px rgba(255,255,255,0.03), 0 30px 100px rgba(0,0,0,0.65), 0 6px 24px rgba(0,0,0,0.4), inset 0 0.5px 0 rgba(255,255,255,0.08)',
            padding: 16,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          {/* Camera dot (landscape = right edge) */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              right: 5,
              transform: 'translateY(-50%)',
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#0a1628',
              border: '0.5px solid rgba(255,255,255,0.06)',
            }}
          />
          <div
            style={{
              width: 1366,
              height: 1024,
              borderRadius: 6,
              overflow: 'hidden',
              background: '#000E1F',
            }}
          >
            <ExplorerRenderer config={config} />
          </div>
        </div>
      </div>
      <div
        style={{
          fontSize: 11,
          color: 'rgba(255,255,255,0.2)',
          letterSpacing: '0.03em',
          whiteSpace: 'nowrap',
          textAlign: 'center',
          fontFamily: "'Inter', sans-serif",
          marginTop: 12,
          flexShrink: 0,
        }}
      >
        {config.name} &mdash; iPad Pro 12.9&quot; Landscape
      </div>
    </div>
  );
}
