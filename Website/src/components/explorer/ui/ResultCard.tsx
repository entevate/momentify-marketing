'use client';

import { Bookmark, BookmarkCheck, Zap, TrendingUp, Filter, BarChart2, Clock, Activity, Play, FileText, Headphones, Video, Cpu, Scan, Send, Repeat, GitMerge, Star, Target } from 'lucide-react';
import { useExplorer } from '@/components/explorer/ExplorerContext';
import type { ContentCard } from '@/lib/explorer/types';

// Map icon name strings to lucide components
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  'zap': Zap,
  'trending-up': TrendingUp,
  'filter': Filter,
  'bar-chart-2': BarChart2,
  'clock': Clock,
  'activity': Activity,
  'play': Play,
  'file-text': FileText,
  'headphones': Headphones,
  'video': Video,
  'cpu': Cpu,
  'scan': Scan,
  'send': Send,
  'repeat': Repeat,
  'git-merge': GitMerge,
  'star': Star,
  'target': Target,
  'puzzle': Star,
  'book-open': FileText,
};

interface ResultCardProps {
  card: ContentCard;
  viewSize: 'small' | 'medium' | 'large';
  onOpenOverlay?: (card: ContentCard) => void;
}

export default function ResultCard({ card, viewSize, onOpenOverlay }: ResultCardProps) {
  const { toggleSaveCard, isCardSaved, showToast } = useExplorer();
  const saved = isCardSaved(card.id);
  const description = card.description[viewSize];

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSaveCard(card.id);
    showToast(saved ? 'Removed from briefcase' : 'Saved to briefcase');
  };

  const IconComponent = card.iconType === 'lucide' ? ICON_MAP[card.icon] : null;

  return (
    <div className="exp-result-card" onClick={() => onOpenOverlay?.(card)}>
      {card.cardType === 'learn' && card.mediaType && (
        <span className="exp-card-type-label">{card.mediaType}</span>
      )}

      <div className="exp-card-top">
        <div className="exp-card-icon">
          {IconComponent ? (
            <IconComponent />
          ) : card.iconType === 'image' ? (
            <img src={card.icon} alt="" style={{ width: '100%', height: '100%' }} />
          ) : (
            <Star />
          )}
        </div>
        <span className="exp-card-title">{card.title}</span>
        <button className={`exp-btn-save${saved ? ' saved' : ''}`} onClick={handleSave}>
          {saved ? <BookmarkCheck /> : <Bookmark />}
        </button>
      </div>

      {/* Stat for outcome cards in medium/large */}
      {card.cardType === 'outcome' && card.stat && viewSize !== 'small' && (
        <div style={{
          fontSize: viewSize === 'large' ? 52 : 36,
          fontWeight: 600,
          color: 'var(--exp-teal)',
          letterSpacing: '-0.02em',
          lineHeight: 1,
          padding: viewSize === 'large' ? '8px 0' : '4px 0',
        }}>
          {card.stat}
        </div>
      )}

      <p className="exp-card-desc">{description}</p>
    </div>
  );
}
