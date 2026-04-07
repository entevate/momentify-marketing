'use client';

import { useState, useMemo } from 'react';
import { Search, LayoutGrid, Columns2, Square, Bookmark, BookmarkCheck, Star, ChevronLeft } from 'lucide-react';
import type { ContentLibraryStepConfig, ContentCard } from '@/lib/explorer/types';
import { useExplorer } from '../ExplorerContext';
import { getLucideIcon } from '../ui/iconMap';

interface ContentLibraryStepProps {
  step: ContentLibraryStepConfig;
}

type SortMode = 'category' | 'alpha' | 'type';

export default function ContentLibraryStep({ step }: ContentLibraryStepProps) {
  const { config, session, toggleSaveCard, isCardSaved, setViewSize, prevStep, goToStep } = useExplorer();
  const [sortMode, setSortMode] = useState<SortMode>('category');
  const [searchQuery, setSearchQuery] = useState('');

  const allCards = config.content;

  const filteredCards = useMemo(() => {
    let cards = [...allCards];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      cards = cards.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.description.small.toLowerCase().includes(q)
      );
    }
    return cards;
  }, [allCards, searchQuery]);

  const groupedCards = useMemo(() => {
    if (sortMode === 'alpha') {
      return { 'All Content': [...filteredCards].sort((a, b) => a.title.localeCompare(b.title)) };
    }
    if (sortMode === 'type') {
      const groups: Record<string, ContentCard[]> = {};
      filteredCards.forEach(c => {
        const type = c.mediaType || c.cardType;
        const label = type.charAt(0).toUpperCase() + type.slice(1);
        if (!groups[label]) groups[label] = [];
        groups[label].push(c);
      });
      return groups;
    }
    // category (default)
    const groups: Record<string, ContentCard[]> = {};
    filteredCards.forEach(c => {
      const label = c.cardType === 'outcome' ? 'Outcomes' : c.cardType === 'learn' ? 'Learn' : 'Solutions';
      if (!groups[label]) groups[label] = [];
      groups[label].push(c);
    });
    return groups;
  }, [filteredCards, sortMode]);

  const descForCard = (card: ContentCard) => {
    if (session.viewSize === 'large') return card.description.large;
    if (session.viewSize === 'medium') return card.description.medium;
    return card.description.small;
  };

  return (
    <div className="exp-results-view">
      {/* Header */}
      <div className="exp-trait-header" style={{ height: 'auto', marginBottom: 16 }}>
        <h1 className="exp-trait-title">{step.title}</h1>
        <p className="exp-trait-subtitle">{step.subtitle}</p>
      </div>

      {/* Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 12,
        flexShrink: 0,
      }}>
        {/* Search */}
        <div className="exp-search-box" style={{ marginBottom: 0, flex: 1, maxWidth: 320 }}>
          <Search style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: 'var(--exp-text-3)', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search content..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ padding: '10px 14px 10px 40px', fontSize: 14 }}
          />
        </div>

        {/* Sort buttons */}
        <div style={{ display: 'flex', gap: 6 }}>
          {(['category', 'alpha', 'type'] as SortMode[]).map(mode => (
            <button
              key={mode}
              className={`exp-learn-filter ${sortMode === mode ? 'active' : ''}`}
              onClick={() => setSortMode(mode)}
            >
              {mode === 'category' ? 'Category' : mode === 'alpha' ? 'A-Z' : 'Type'}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="exp-view-toggle">
          {(['small', 'medium', 'large'] as const).map(size => (
            <button
              key={size}
              className={`exp-view-toggle-btn ${session.viewSize === size ? 'active' : ''}`}
              onClick={() => setViewSize(size)}
            >
              {size === 'small' ? <LayoutGrid /> : size === 'medium' ? <Columns2 /> : <Square />}
            </button>
          ))}
        </div>
      </div>

      {/* Card groups */}
      <div className={`exp-view-${session.viewSize}`} style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        {Object.entries(groupedCards).map(([label, cards]) => (
          <div key={label} style={{ marginBottom: 24 }}>
            <div className="exp-summary-section-label">{label}</div>
            <div className="exp-card-grid">
              {cards.map(card => (
                <div key={card.id} className="exp-result-card">
                  <div className="exp-card-top">
                    <div className="exp-card-icon">
                      {(() => {
                        if (card.iconType === 'lucide' && card.icon) {
                          const Icon = getLucideIcon(card.icon);
                          return <Icon />;
                        }
                        if (card.iconType === 'image' && card.icon) {
                          return <img src={card.icon} alt="" style={{ width: '100%', height: '100%' }} />;
                        }
                        return <Star />;
                      })()}
                    </div>
                    <span className="exp-card-title">{card.title}</span>
                    <button
                      className={`exp-btn-save ${isCardSaved(card.id) ? 'saved' : ''}`}
                      onClick={e => { e.stopPropagation(); toggleSaveCard(card.id); }}
                    >
                      {isCardSaved(card.id) ? <BookmarkCheck /> : <Bookmark />}
                    </button>
                  </div>
                  {card.mediaType && (
                    <span className="exp-card-type-label">{card.mediaType}</span>
                  )}
                  <div className="exp-card-desc">{descForCard(card)}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="exp-results-tab-bar">
        <button className="exp-btn-back" onClick={() => prevStep()}>
          <ChevronLeft />
          Back
        </button>
        <div />
        <button className="exp-btn-next" onClick={() => {
          const summaryStep = config.steps.find(s => s.type === 'summary');
          if (summaryStep) goToStep(summaryStep.id);
        }}>
          Done
        </button>
      </div>
    </div>
  );
}
