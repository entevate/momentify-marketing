'use client';

import { useState, useMemo } from 'react';
import { LayoutGrid, Columns2, Square, ChevronLeft, ChevronRight, User, Briefcase, Sparkles, Target, BookOpen, Puzzle, Star } from 'lucide-react';
import { useExplorer } from '@/components/explorer/ExplorerContext';
import type { ResultsStepConfig, ContentCard } from '@/lib/explorer/types';
import ResultCard from '@/components/explorer/ui/ResultCard';

interface ResultsStepProps {
  step: ResultsStepConfig;
  onOpenOverlay?: (card: ContentCard) => void;
}

export default function ResultsStep({ step, onOpenOverlay }: ResultsStepProps) {
  const {
    session,
    config,
    getContentByType,
    setActiveTab,
    setViewSize,
    setPageState,
  } = useExplorer();

  const activeTab = session.activeTab || step.tabs[0]?.id || '';
  const viewSize = session.viewSize || step.defaultView;
  const currentPage = session.pageState[activeTab] ?? 0;

  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Get the active tab config
  const tabConfig = step.tabs.find(t => t.id === activeTab);

  // Get cards for the active tab by mapping tab id to content type
  const tabCards = useMemo(() => {
    const typeMap: Record<string, 'outcome' | 'learn' | 'solution'> = {
      outcomes: 'outcome',
      learn: 'learn',
      solutions: 'solution',
    };
    const cardType = typeMap[activeTab] || activeTab as 'outcome' | 'learn' | 'solution';
    let cards = getContentByType(cardType);

    // Apply filter if active (for learn tab)
    if (activeFilter && tabConfig?.filters) {
      cards = cards.filter(c => c.mediaType === activeFilter);
    }

    return cards;
  }, [activeTab, activeFilter, getContentByType, tabConfig]);

  // Pagination
  const cardsPerPage = step.cardsPerPage || 6;
  const totalPages = Math.max(1, Math.ceil(tabCards.length / cardsPerPage));
  const safePage = Math.min(currentPage, totalPages - 1);
  const pageCards = tabCards.slice(safePage * cardsPerPage, (safePage + 1) * cardsPerPage);

  // Build selection summary chips
  const chips: { label: string; className: string }[] = [];
  if (session.visitorName) {
    chips.push({ label: session.visitorName, className: 'chip-name' });
  }
  if (session.selectedRole) {
    chips.push({ label: session.selectedRole, className: 'chip-role' });
  }
  session.selectedInterests.forEach(interest => {
    chips.push({ label: interest, className: 'chip-interest' });
  });

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setActiveFilter(null);
  };

  return (
    <div className="exp-results-view">
      <div className={`exp-content stretch exp-view-${viewSize}`}>
        {/* Selection summary chips */}
        {chips.length > 0 && (
          <div className="exp-selection-summary">
            {chips.map((chip, i) => (
              <span key={i} className={`exp-summary-chip ${chip.className}`}>
                {chip.className === 'chip-name' && <User />}
                {chip.className === 'chip-role' && <Briefcase />}
                {chip.className === 'chip-interest' && <Sparkles />}
                {chip.label}
              </span>
            ))}
          </div>
        )}

        {/* Results header with title and view toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h2 className="exp-trait-title" style={{ marginBottom: 2 }}>{step.title}</h2>
            <p className="exp-trait-subtitle" style={{ marginBottom: 0 }}>{step.subtitle}</p>
          </div>
          {/* Card size toggle */}
          <div className="exp-view-toggle">
            <button
              className={`exp-view-toggle-btn${viewSize === 'small' ? ' active' : ''}`}
              onClick={() => setViewSize('small')}
            >
              <LayoutGrid />
            </button>
            <button
              className={`exp-view-toggle-btn${viewSize === 'medium' ? ' active' : ''}`}
              onClick={() => setViewSize('medium')}
            >
              <Columns2 />
            </button>
            <button
              className={`exp-view-toggle-btn${viewSize === 'large' ? ' active' : ''}`}
              onClick={() => setViewSize('large')}
            >
              <Square />
            </button>
          </div>
        </div>

        {/* Learn tab filter buttons */}
        {activeTab === 'learn' && tabConfig?.filters && tabConfig.filters.length > 0 && (
          <div className="exp-learn-filters">
            <button
              className={`exp-learn-filter${!activeFilter ? ' active' : ''}`}
              onClick={() => setActiveFilter(null)}
            >
              All
            </button>
            {tabConfig.filters.map(f => (
              <button
                key={f.value}
                className={`exp-learn-filter${activeFilter === f.value ? ' active' : ''}`}
                onClick={() => setActiveFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}

        {/* Paginated card grid */}
        <div className="exp-results-body">
          <div className="exp-paginated-wrapper">
            <div className="exp-card-grid">
              {pageCards.map(card => (
                <ResultCard
                  key={card.id}
                  card={card}
                  viewSize={viewSize}
                  onOpenOverlay={onOpenOverlay}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom tab bar */}
      <div className="exp-results-tab-bar" style={{ padding: '20px 40px' }}>
        {/* Left spacer for centering */}
        <div style={{ minWidth: 100 }} />

        {/* Centered tabs */}
        <div className="exp-results-tabs">
          {step.tabs.map(tab => (
            <button
              key={tab.id}
              className={`exp-results-tab${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => handleTabChange(tab.id)}
            >
              {(() => {
                const iconMap: Record<string, React.ComponentType<{className?: string}>> = { target: Target, 'book-open': BookOpen, puzzle: Puzzle };
                const Icon = iconMap[tab.icon] || Star;
                return <Icon />;
              })()}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="exp-pagination-controls">
            <button
              className={`exp-page-btn${safePage === 0 ? ' disabled' : ''}`}
              onClick={() => setPageState(activeTab, safePage - 1)}
            >
              <ChevronLeft />
            </button>
            <span className="exp-page-text">{safePage + 1}/{totalPages}</span>
            <button
              className={`exp-page-btn${safePage >= totalPages - 1 ? ' disabled' : ''}`}
              onClick={() => setPageState(activeTab, safePage + 1)}
            >
              <ChevronRight />
            </button>
          </div>
        )}
        {totalPages <= 1 && <div style={{ minWidth: 100 }} />}
      </div>

    </div>
  );
}
