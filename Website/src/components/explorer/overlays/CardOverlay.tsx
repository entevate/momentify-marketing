'use client';

import { X, Bookmark, Play, FileText, Headphones, Globe } from 'lucide-react';
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

          {/* Media preview placeholder */}
          {card.mediaType && (
            <div
              style={{
                width: '100%',
                aspectRatio: '16/9',
                borderRadius: 12,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
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
          )}

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
    </div>
  );
}
