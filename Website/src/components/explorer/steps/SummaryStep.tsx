'use client';

import { Briefcase, Mail, MessageSquare, QrCode, User, Sparkles, LayoutGrid, Columns2, Square, AlertCircle } from 'lucide-react';
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
  } = useExplorer();

  const viewSize = session.viewSize || 'small';
  const savedCards = getSavedCards();

  // Check for incomplete registration (missing required fields)
  const hasEmail = !!session.registeredEmail;
  const hasName = !!session.visitorName;
  const registrationIncomplete = !hasEmail || !hasName;
  const registrationStepId = config.steps.find(s => s.type === 'registration')?.id;

  // Group saved cards by type
  const outcomes = savedCards.filter(c => c.cardType === 'outcome');
  const learn = savedCards.filter(c => c.cardType === 'learn');
  const solutions = savedCards.filter(c => c.cardType === 'solution');

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
              <Briefcase />
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

      {/* Registration reminder */}
      {registrationIncomplete && savedCount > 0 && (
        <div
          className="exp-registration-reminder"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 20px',
            borderRadius: 12,
            background: 'var(--exp-surface)',
            border: '1px solid var(--exp-border)',
            marginBottom: 8,
          }}
        >
          <AlertCircle style={{ width: 18, height: 18, color: 'var(--exp-cyan)', flexShrink: 0 }} />
          <span style={{ fontSize: 14, color: 'var(--exp-text-2)', flex: 1 }}>
            {!hasEmail && !hasName
              ? 'Complete your registration to share results via email or text.'
              : !hasEmail
                ? 'Add your email to receive your personalized results.'
                : 'Add your name so we can personalize your results.'}
          </span>
          {registrationStepId && (
            <button
              onClick={() => goToStep(registrationStepId)}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                border: '1px solid var(--exp-cyan)',
                background: 'transparent',
                color: 'var(--exp-cyan)',
                fontSize: 13,
                fontWeight: 500,
                fontFamily: 'inherit',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Complete Info
            </button>
          )}
        </div>
      )}

      {/* Bottom bar */}
      <div className="exp-results-tab-bar" style={{ padding: '20px 0' }}>
        <div style={{ minWidth: 100 }} />

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
