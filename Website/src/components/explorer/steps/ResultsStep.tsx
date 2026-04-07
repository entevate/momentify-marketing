'use client';

import { useState, useMemo } from 'react';
import { LayoutGrid, Columns2, Square, ChevronLeft, ChevronRight, User, Briefcase, Sparkles, Star } from 'lucide-react';
import { useExplorer } from '@/components/explorer/ExplorerContext';
import { getLucideIcon } from '@/components/explorer/ui/iconMap';
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
    prevStep,
    nextStep,
    goToStep,
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

  // Pagination — cards per page varies by view size (matches Cat Defense prototype)
  const cardsPerPage = viewSize === 'large' ? 1 : viewSize === 'medium' ? 2 : (step.cardsPerPage || 6);
  const totalPages = Math.max(1, Math.ceil(tabCards.length / cardsPerPage));
  const safePage = Math.min(currentPage, totalPages - 1);
  const pageCards = tabCards.slice(safePage * cardsPerPage, (safePage + 1) * cardsPerPage);

  // Helper: look up label from trait-selection step options by value
  const getOptionLabel = (value: string): string => {
    for (const s of config.steps) {
      if (s.type === 'trait-selection') {
        const match = s.options.find((o: { value: string; label: string }) => o.value === value);
        if (match) return match.label;
      }
    }
    return value;
  };

  // Build selection summary chips
  const chips: { label: string; className: string }[] = [];
  if (session.visitorName) {
    chips.push({ label: session.visitorName, className: 'chip-name' });
  }
  if (session.selectedRole) {
    chips.push({ label: getOptionLabel(session.selectedRole), className: 'chip-role' });
  }
  session.selectedInterests.forEach(interest => {
    chips.push({ label: getOptionLabel(interest), className: 'chip-interest' });
  });

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setActiveFilter(null);
  };

  const handlePageNav = (delta: number) => {
    const newPage = Math.max(0, Math.min(totalPages - 1, safePage + delta));
    setPageState(activeTab, newPage);
  };

  return (
    <div className="exp-results-view">
      {/* Trait header — same position as trait selection steps */}
      <div className="exp-trait-header">
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
        <h2 className="exp-trait-title">{step.title}</h2>
        <p className="exp-trait-subtitle">{step.subtitle}</p>
      </div>

      {/* Results body — view-size class goes here like Cat Defense */}
      <div className={`exp-results-body exp-view-${viewSize}`}>
        {/* Results controls bar — filters, pagination, view toggle */}
        <div className="exp-results-controls">
          {/* Learn tab filter buttons */}
          {activeTab === 'learn' && tabConfig?.filters && tabConfig.filters.length > 0 && (
            <div className="exp-learn-filters">
              <button
                className={`exp-learn-filter${!activeFilter ? ' active' : ''}`}
                onClick={() => setActiveFilter(null)}
              >
                All
              </button>
              {tabConfig.filters.filter(f => f.value !== 'all').map(f => (
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

          {/* Pagination controls — show when more than 1 page */}
          {totalPages > 1 && (
            <div className="exp-pagination-controls">
              <button
                className={`exp-page-btn${safePage === 0 ? ' disabled' : ''}`}
                onClick={() => handlePageNav(-1)}
              >
                <ChevronLeft />
              </button>
              <span className="exp-page-text">{safePage + 1}/{totalPages}</span>
              <button
                className={`exp-page-btn${safePage === totalPages - 1 ? ' disabled' : ''}`}
                onClick={() => handlePageNav(1)}
              >
                <ChevronRight />
              </button>
            </div>
          )}

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

        {/* Paginated card grid */}
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

      {/* Bottom tab bar */}
      <div className="exp-results-tab-bar">
        <button className="exp-btn-back" onClick={() => prevStep()}>
          <ChevronLeft />
          Back
        </button>

        {/* Centered tabs */}
        <div className="exp-results-tabs">
          {step.tabs.map(tab => (
            <button
              key={tab.id}
              className={`exp-results-tab${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => handleTabChange(tab.id)}
            >
              {(() => {
                const Icon = getLucideIcon(tab.icon);
                return <Icon />;
              })()}
              {tab.label}
            </button>
          ))}
        </div>

        <button className="exp-btn-done" onClick={() => {
          const summaryStep = config.steps.find(s => s.type === 'summary');
          if (summaryStep) goToStep(summaryStep.id); else nextStep();
        }}>
          Finish
        </button>
      </div>

    </div>
  );
}
