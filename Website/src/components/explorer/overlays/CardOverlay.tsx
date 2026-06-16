'use client';

import { useState } from 'react';
import { X, Bookmark, Play, FileText, Headphones, Globe, Maximize2 } from 'lucide-react';
import { useExplorer } from '@/components/explorer/ExplorerContext';
import type { ContentCard } from '@/lib/explorer/types';

interface CardOverlayProps {
  card: ContentCard | null;
  onClose: () => void;
}

const mediaIcons: Record<string, typeof Play> = {
  video: Play,
  pdf: FileText,
  podcast: Headphones,
  website: Globe,
  blog: FileText,
  webinar: Play,
  whitepaper: FileText,
};

export default function CardOverlay({ card, onClose }: CardOverlayProps) {
  const { toggleSaveCard, isCardSaved, showToast } = useExplorer();
  const [pdfFullscreen, setPdfFullscreen] = useState(false);

  if (!card) return null;

  const saved = isCardSaved(card.id);

  const handleSave = () => {
    toggleSaveCard(card.id);
    showToast(saved ? 'Removed from briefcase' : 'Saved to briefcase');
  };

  const MediaIcon = card.mediaType ? mediaIcons[card.mediaType] || Globe : null;

  return (
    <div className={`exp-card-overlay${card ? ' open' : ''}`} onClick={onClose}>
      <div className="exp-card-overlay-inner" onClick={e => e.stopPropagation()}>
        <button className="exp-card-overlay-close" onClick={onClose}>
          <X />
        </button>

        <div className="exp-card-overlay-content">
          {/* Type label */}
          <span className="exp-overlay-type">{card.cardType}</span>

          {/* Title */}
          <h2 className="exp-overlay-title">{card.title}</h2>

          {/* Stat for outcome cards */}
          {card.cardType === 'outcome' && card.stat && (
            <div className="exp-overlay-stat">{card.stat}</div>
          )}

          {/* Description */}
          <p className="exp-overlay-desc">{card.description.overlay}</p>

          {/* Direct video file → inline HTML5 player */}
          {card.mediaType === 'video' && card.url && /\.(mp4|webm|mov|m4v)(\?|$)/i.test(card.url) ? (
            <div
              style={{
                width: '100%',
                aspectRatio: '16/9',
                borderRadius: 12,
                overflow: 'hidden',
                background: '#000',
                border: '1px solid var(--exp-card-border)',
              }}
            >
              <video
                key={card.url}
                src={card.url}
                controls
                autoPlay
                muted
                playsInline
                preload="auto"
                style={{ width: '100%', height: '100%', display: 'block', background: '#000', objectFit: 'contain' }}
              />
            </div>
          ) : /* PDF inline embed with fullscreen expand */
          card.mediaType === 'pdf' && card.url ? (
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '4/3',
                borderRadius: 12,
                overflow: 'hidden',
                background: '#fff',
                border: '1px solid var(--exp-card-border)',
              }}
            >
              <iframe
                src={card.url}
                title={card.title}
                style={{ width: '100%', height: '100%', border: 'none', background: '#fff' }}
              />
              <button
                onClick={() => setPdfFullscreen(true)}
                title="View full document"
                style={{
                  position: 'absolute',
                  bottom: 12,
                  right: 12,
                  width: 36,
                  height: 36,
                  borderRadius: 9,
                  border: 'none',
                  background: 'rgba(0,0,0,0.7)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <Maximize2 style={{ width: 16, height: 16 }} />
              </button>
            </div>
          ) : card.url ? (
            // Non-PDF URL with a real destination: render a scan-to-view
            // QR card. Most external sites (banks especially) refuse to
            // load in an iframe due to X-Frame-Options, so the kiosk-
            // appropriate path is a QR that visitors scan with their
            // phone to open the URL there. Caption shows the media type
            // ("Scan to view website") plus the bare host so the visitor
            // knows where they're being sent.
            <div
              style={{
                width: '100%',
                borderRadius: 12,
                background: 'var(--exp-card-bg)',
                border: '1px solid var(--exp-card-border)',
                padding: 18,
                display: 'flex',
                gap: 18,
                alignItems: 'center',
              }}
            >
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=8&bgcolor=ffffff&color=0F172A&data=${encodeURIComponent(card.url)}`}
                alt={`Scan to view ${card.title}`}
                width={180}
                height={180}
                style={{
                  width: 180,
                  height: 180,
                  flexShrink: 0,
                  borderRadius: 10,
                  background: '#FFFFFF',
                  padding: 6,
                  boxSizing: 'border-box',
                }}
              />
              <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    color: 'var(--exp-text-3)',
                    fontSize: 12,
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  {MediaIcon && <MediaIcon style={{ width: 14, height: 14, strokeWidth: 1.5 }} />}
                  <span>Scan to view {card.mediaType ?? 'link'}</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--exp-text-1)', lineHeight: 1.35 }}>
                  Open on your phone
                </div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 300,
                    color: 'var(--exp-text-2)',
                    wordBreak: 'break-all',
                    lineHeight: 1.45,
                  }}
                >
                  {card.url.replace(/^https?:\/\//, '')}
                </div>
              </div>
            </div>
          ) : card.mediaType ? (
            <div
              style={{
                width: '100%',
                aspectRatio: '16/9',
                borderRadius: 12,
                background: 'var(--exp-card-bg)',
                border: '1px solid var(--exp-card-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                color: 'var(--exp-text-3)',
                fontSize: 14,
              }}
            >
              {MediaIcon && <MediaIcon style={{ width: 24, height: 24 }} />}
              <span>{card.mediaType} preview</span>
            </div>
          ) : null}

          {/* Save button */}
          <button
            className={`exp-overlay-save-btn${saved ? ' saved' : ''}`}
            onClick={handleSave}
          >
            <Bookmark fill={saved ? 'currentColor' : 'none'} />
            {saved ? 'Saved' : 'Save to Briefcase'}
          </button>
        </div>
      </div>

      {/* Fullscreen PDF viewer */}
      {pdfFullscreen && card.mediaType === 'pdf' && card.url && (
        <div
          onClick={(e) => { e.stopPropagation(); setPdfFullscreen(false); }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 11000,
            background: 'rgba(0,0,0,0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setPdfFullscreen(false); }}
            title="Close"
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              width: 40,
              height: 40,
              borderRadius: 10,
              border: 'none',
              background: 'rgba(255,255,255,0.15)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 1,
            }}
          >
            <X style={{ width: 18, height: 18 }} />
          </button>
          <iframe
            src={card.url}
            title={`${card.title} (fullscreen)`}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '90%',
              height: '90vh',
              border: 'none',
              borderRadius: 10,
              background: '#fff',
            }}
          />
        </div>
      )}
    </div>
  );
}
