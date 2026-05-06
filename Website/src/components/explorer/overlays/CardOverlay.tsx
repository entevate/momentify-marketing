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

          {/* PDF inline embed with fullscreen expand */}
          {card.mediaType === 'pdf' && card.url ? (
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
