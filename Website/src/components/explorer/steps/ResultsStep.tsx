'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { LayoutGrid, Columns2, Square, ChevronLeft, ChevronRight, User, Briefcase, Sparkles, Star, Send } from 'lucide-react';
import { useExplorer } from '@/components/explorer/ExplorerContext';
import { getLucideIcon } from '@/components/explorer/ui/iconMap';
import type { ResultsStepConfig, ContentCard } from '@/lib/explorer/types';
import ResultCard from '@/components/explorer/ui/ResultCard';

interface ResultsStepProps {
  step: ResultsStepConfig;
  onOpenOverlay?: (card: ContentCard) => void;
  onShare?: (type: 'email' | 'text' | 'qr') => void;
}

export default function ResultsStep({ step, onOpenOverlay, onShare }: ResultsStepProps) {
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
  // Mobile always uses medium view so stat is visible and card sizing is consistent
  const viewSize = config.formFactor === 'mobile' ? 'medium' : (session.viewSize || step.defaultView);
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
    const allCards = getContentByType(cardType);

    // Personalization filter — two-stage, role-first.
    //
    // Stage 1 (HARD): role gate. Role is required by the flow (Next is
    // disabled on the role step until a role is picked), so we always
    // narrow to cards that target the selected role. Cards with no
    // role targeting pass through ("everyone-relevant"). Tabs CAN end
    // up empty by design — the Content Library tool in the top bar is
    // the "view everything" escape, not this step.
    //
    // Stage 2 (SOFT): interest gate. If the user selected interests,
    // prefer cards that match. If that combo returns zero, fall back
    // to the role-filtered list (still role-respecting, never "all").
    // "Browsing" interest bypasses the interest gate entirely.
    const selectedRole = session.selectedRole;
    const selectedInterests = session.selectedInterests ?? [];
    const hasBrowsing = selectedInterests.includes('browsing');

    const roleFiltered = selectedRole
      ? allCards.filter(c => {
          const hasRoleTargeting = c.targetRoles && c.targetRoles.length > 0;
          return !hasRoleTargeting || c.targetRoles!.includes(selectedRole);
        })
      : allCards;

    let cards = roleFiltered;
    if (selectedInterests.length > 0 && !hasBrowsing) {
      const interestFiltered = roleFiltered.filter(c => {
        const interestPool = new Set<string>([
          ...(c.targetInterests ?? []),
          ...(c.tags ?? []),
        ]);
        // "Everyone-relevant" cards (no interest targeting) always pass.
        if (interestPool.size === 0) return true;
        return selectedInterests.some(i => interestPool.has(i));
      });
      // Soft fallback — never escape the role gate.
      cards = interestFiltered.length > 0 ? interestFiltered : roleFiltered;
    }

    // Apply mediaType filter (learn tab) AFTER personalization so the
    // user-facing filter buttons still narrow correctly.
    if (activeFilter && tabConfig?.filters) {
      cards = cards.filter(c => c.mediaType === activeFilter);
    }

    return cards;
  }, [activeTab, activeFilter, getContentByType, tabConfig, session.selectedRole, session.selectedInterests]);

  // Single-video Results path — when this tab has exactly one card and it's a
  // direct video file, we'll render the video full-bleed INLINE (no modal,
  // zero clicks). Detected here so the return branches early below.
  const singleVideoCard =
    tabCards.length === 1 &&
    tabCards[0].mediaType === 'video' &&
    tabCards[0].url &&
    /\.(mp4|webm|mov|m4v)(\?|$)/i.test(tabCards[0].url)
      ? tabCards[0]
      : null;
  // Suppress legacy auto-open-overlay behavior (we render the video inline now).
  const autoOpenedRef = useRef(false);
  useEffect(() => {
    autoOpenedRef.current = true;
  }, []);

  // Mobile scrolls the full list instead of paginating
  const isMobile = config.formFactor === 'mobile';

  // Pagination — cards per page varies by view size (matches Cat Defense prototype)
  const cardsPerPage = viewSize === 'large' ? 1 : viewSize === 'medium' ? 2 : (step.cardsPerPage || 6);
  const totalPages = isMobile ? 1 : Math.max(1, Math.ceil(tabCards.length / cardsPerPage));
  const safePage = Math.min(currentPage, totalPages - 1);
  const pageCards = isMobile
    ? tabCards
    : tabCards.slice(safePage * cardsPerPage, (safePage + 1) * cardsPerPage);

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
  // Multi-select traits write to session.selectedTraits[stepId]; older flow wrote
  // to session.selectedInterests. Merge both sources (deduped) so chips show
  // regardless of which path the selection took.
  const interestValues = new Set<string>(session.selectedInterests);
  Object.entries(session.selectedTraits).forEach(([stepId, values]) => {
    // Skip the role step (single-select) — already rendered above
    if (stepId === 'role') return;
    values.forEach(v => interestValues.add(v));
  });
  interestValues.forEach(interest => {
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

  // ── Single-video full-bleed Results screen ──
  if (singleVideoCard) {
    return (
      <div
        className="exp-results-view"
        style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}
      >
        <div className="exp-trait-header" style={{ flexShrink: 0 }}>
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
        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 4px 4px',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 14,
              overflow: 'hidden',
              background: '#000',
              border: '1px solid var(--exp-card-border)',
              boxShadow: '0 12px 48px rgba(0,0,0,0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <video
              key={singleVideoCard.url}
              src={singleVideoCard.url}
              controls
              autoPlay
              muted
              playsInline
              preload="auto"
              style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', background: '#000' }}
            />
          </div>
        </div>

        {/* Bottom tab bar — Watch tab becomes a "Send to me" CTA that opens
            the email share dialog (pre-filled with registered email). */}
        <div className="exp-results-tab-bar">
          <button className="exp-btn-back" onClick={() => prevStep()}>
            <ChevronLeft />
            Back
          </button>
          <div className="exp-results-tabs">
            <button
              className="exp-results-tab active"
              onClick={() => onShare?.('email')}
              style={{ gap: 8 }}
            >
              <Send />
              Send to Me
            </button>
          </div>
          <button
            className="exp-btn-done"
            onClick={() => {
              // Skip the Summary / Saved Items step on the single-video flow —
              // recruiting kiosks don't need a save-and-share intermediate.
              // Jump straight to Thank You.
              const thankYouStep = config.steps.find(s => s.type === 'thank-you');
              if (thankYouStep) goToStep(thankYouStep.id);
              else nextStep();
            }}
          >
            End Session
          </button>
        </div>
      </div>
    );
  }

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
