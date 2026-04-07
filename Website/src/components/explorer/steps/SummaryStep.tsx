'use client';

import { Bookmark, Briefcase, Mail, MessageSquare, QrCode, User, Sparkles, LayoutGrid, Columns2, Square, ChevronLeft } from 'lucide-react';
import { useExplorer } from '@/components/explorer/ExplorerContext';
import type { SummaryStepConfig, ContentCard } from '@/lib/explorer/types';
import ResultCard from '@/components/explorer/ui/ResultCard';

interface SummaryStepProps {
  step: SummaryStepConfig;
  onOpenOverlay?: (card: ContentCard) => void;
  onEndSession?: () => void;
  onShare?: (type: 'email' | 'text' | 'qr') => void;
}

export default function SummaryStep({ step, onOpenOverlay, onEndSession, onShare }: SummaryStepProps) {
  const {
    config,
    session,
    getSavedCards,
    savedCount,
    setViewSize,
    goToStep,
    prevStep,
  } = useExplorer();

  const viewSize = session.viewSize || 'small';
  const savedCards = getSavedCards();


  // Group saved cards by type
  const outcomes = savedCards.filter(c => c.cardType === 'outcome');
  const learn = savedCards.filter(c => c.cardType === 'learn');
  const solutions = savedCards.filter(c => c.cardType === 'solution');

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

  const renderSection = (label: string, cards: ContentCard[]) => {
    if (cards.length === 0) return null;
    return (
      <div className="exp-summary-section">
        <div className="exp-summary-section-label">{label}</div>
        <div className="exp-summary-grid">
          {cards.map(card => (
            <ResultCard
              key={card.id}
              card={card}
              viewSize={viewSize}
              onOpenOverlay={onOpenOverlay}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="exp-results-view">
      <div className={`exp-view-${viewSize}`} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
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

        {/* Header with view toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h2 className="exp-trait-title" style={{ marginBottom: 2 }}>{step.title}</h2>
            <p className="exp-trait-subtitle" style={{ marginBottom: 0 }}>{step.subtitle}</p>
          </div>
          {savedCount > 0 && (
            <div className="exp-view-toggle">
              {(['small', 'medium', 'large'] as const).map(size => (
                <button
                  key={size}
                  className={`exp-view-toggle-btn${viewSize === size ? ' active' : ''}`}
                  onClick={() => setViewSize(size)}
                >
                  {size === 'small' ? <LayoutGrid /> : size === 'medium' ? <Columns2 /> : <Square />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="exp-summary-body">
          {savedCount === 0 ? (
            <div className="exp-summary-empty">
              <Bookmark />
              <span className="exp-summary-empty-text">No items saved yet</span>
            </div>
          ) : (
            <>
              {renderSection('Outcomes', outcomes)}
              {renderSection('Learn', learn)}
              {renderSection('Solutions', solutions)}
            </>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="exp-results-tab-bar">
        <button className="exp-btn-back" onClick={() => prevStep()}>
          <ChevronLeft />
          Back
        </button>

        <div className={`exp-share-group${savedCount > 0 ? ' attention' : ''}`}>
          <button
            className={`exp-share-btn${savedCount === 0 ? ' disabled' : ''}`}
            onClick={() => savedCount > 0 && onShare?.('email')}
          >
            <Mail />
            Email
          </button>
          <button
            className={`exp-share-btn${savedCount === 0 ? ' disabled' : ''}`}
            onClick={() => savedCount > 0 && onShare?.('text')}
          >
            <MessageSquare />
            Text
          </button>
          <button
            className={`exp-share-btn${savedCount === 0 ? ' disabled' : ''}`}
            onClick={() => savedCount > 0 && onShare?.('qr')}
          >
            <QrCode />
            QR
          </button>
        </div>

        <button className="exp-btn-end-session" onClick={onEndSession}>
          End Session
        </button>
      </div>
    </div>
  );
}
