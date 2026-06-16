'use client';

import { useEffect, useState, useRef } from 'react';
import { Star, User, Sparkles, CheckCircle2, Flame } from 'lucide-react';
import { useExplorer } from '@/components/explorer/ExplorerContext';
import { getLucideIcon } from '@/components/explorer/ui/iconMap';
import type { TraitSelectionStepConfig, TraitOption } from '@/lib/explorer/types';

function TraitIcon({ option }: { option: TraitOption }) {
  if (option.iconType === 'image' && option.icon) {
    return <img src={option.icon} alt="" style={{ width: 32, height: 32, objectFit: 'contain' }} />;
  }
  if (option.iconType === 'svg' && option.icon) {
    return <span dangerouslySetInnerHTML={{ __html: option.icon }} />;
  }
  if (option.iconType === 'lucide' && option.icon) {
    const Icon = getLucideIcon(option.icon);
    return <Icon />;
  }
  return <Star />;
}

export default function TraitSelectionStep({ step }: { step: TraitSelectionStepConfig }) {
  const {
    session,
    config,
    selectRole,
    toggleInterest,
    setSelectedTraits,
    nextStep,
  } = useExplorer();

  const isSingle = step.selectionMode === 'single';

  // ── Most Selected (analytics-driven) ────────────
  // Fetch popular options for this step from /api/prototypes/trait-counts.
  // Renders a pinned row at the top with the top-N most popular values.
  // No-ops if showMostSelected isn't set.
  const [popular, setPopular] = useState<string[]>([]);
  useEffect(() => {
    if (!step.showMostSelected) return;
    let cancelled = false;
    const limit = step.mostSelectedLimit ?? 3;
    fetch(`/api/prototypes/trait-counts?slug=${encodeURIComponent(config.id)}&stepId=${encodeURIComponent(step.id)}`, { cache: 'no-store' })
      .then(r => r.json())
      .then((data: { counts?: Record<string, number> }) => {
        if (cancelled) return;
        const counts = data.counts ?? {};
        const sorted = Object.entries(counts)
          .filter(([v]) => step.options.some(o => o.value === v))
          .sort((a, b) => b[1] - a[1])
          .slice(0, limit)
          .map(([v]) => v);
        setPopular(sorted);
      })
      .catch(() => { if (!cancelled) setPopular([]); });
    return () => { cancelled = true; };
  }, [step.showMostSelected, step.mostSelectedLimit, step.id, step.options, config.id]);

  // Stash latest selections in a ref so the unmount cleanup can POST them.
  const latestSelectionsRef = useRef<string[]>([]);
  useEffect(() => {
    return () => {
      const values = latestSelectionsRef.current;
      if (!values || values.length === 0) return;
      fetch('/api/prototypes/trait-counts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: config.id, stepId: step.id, values }),
        keepalive: true,
      }).catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step.id]);

  // The FIRST single-select trait step is treated as "the role step" — its
  // value lives in session.selectedRole (drives role-background gradients and
  // legacy chip logic). Every OTHER single-select step writes to selectedTraits
  // so it can't clobber the role.
  const firstTraitStepEarly = config.steps.find(s => s.type === 'trait-selection');
  const isRoleStep =
    isSingle && firstTraitStepEarly?.id === step.id;

  // Determine currently selected values for this step
  const selectedValues: string[] = (() => {
    if (isRoleStep) return session.selectedRole ? [session.selectedRole] : [];
    const fromTraits = session.selectedTraits[step.id];
    if (fromTraits && fromTraits.length > 0) return fromTraits;
    // Backward compat for legacy multi-select interest step.
    if (!isSingle && session.selectedInterests.length > 0) return session.selectedInterests;
    return [];
  })();

  // Keep latest selections current for the unmount tracker.
  latestSelectionsRef.current = selectedValues;

  const allSelected = selectedValues.length === step.options.length;

  function handleCardClick(value: string) {
    if (isRoleStep) {
      selectRole(value);
      return;
    }
    if (isSingle) {
      // Subsequent single-select steps: store as a single-element array on the
      // step's id so prior selections (role, interests) stay intact.
      setSelectedTraits(step.id, [value]);
      return;
    }
    const current = selectedValues;
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    setSelectedTraits(step.id, next);
  }

  function handleSelectAll() {
    if (allSelected) {
      // Deselect all
      setSelectedTraits(step.id, []);
    } else {
      setSelectedTraits(step.id, step.options.map((o) => o.value));
    }
  }

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

  // Build chips that ACCUMULATE across prior trait-selection steps. On step N,
  // show the name chip plus one chip per prior step's selection(s). Skip the
  // first trait-selection step (no priors).
  const firstTraitStep = config.steps.find(s => s.type === 'trait-selection');
  const isFirstTraitStep = firstTraitStep?.id === step.id;

  type Chip = { id: string; kind: 'name' | 'role' | 'interest'; label: string };
  const accumulatedChips: Chip[] = [];

  if (!isFirstTraitStep) {
    if (session.visitorName) {
      accumulatedChips.push({ id: '__name', kind: 'name', label: session.visitorName });
    }
    // Walk prior trait-selection steps and read their selections.
    const myIndex = config.steps.findIndex(s => s.id === step.id);
    for (let i = 0; i < myIndex; i++) {
      const prior = config.steps[i];
      if (prior.type !== 'trait-selection') continue;
      const isSingleStep = prior.selectionMode === 'single';
      if (isSingleStep) {
        // Single-select writes to session.selectedRole when the step is the
        // "role" step; multi/branching single also write to selectedTraits.
        const valueFromTraits = session.selectedTraits[prior.id]?.[0];
        const valueFromRole = prior.id === firstTraitStep?.id ? session.selectedRole : undefined;
        const v = valueFromTraits ?? valueFromRole ?? undefined;
        if (v) {
          accumulatedChips.push({ id: `${prior.id}:${v}`, kind: 'role', label: getOptionLabel(v) });
        }
      } else {
        const fromTraits = session.selectedTraits[prior.id] ?? [];
        const fromInterests = (prior.id === 'interests' || fromTraits.length === 0) ? session.selectedInterests : [];
        const seen = new Set<string>();
        [...fromTraits, ...fromInterests].forEach(v => {
          if (seen.has(v)) return;
          seen.add(v);
          accumulatedChips.push({ id: `${prior.id}:${v}`, kind: 'interest', label: getOptionLabel(v) });
        });
      }
    }
  }
  const hasChips = accumulatedChips.length > 0;

  const isMobile = config.formFactor === 'mobile';

  const chips = hasChips && (
    <div className="exp-selection-summary">
      {accumulatedChips.map(chip => (
        <span key={chip.id} className={`exp-summary-chip chip-${chip.kind}`}>
          {chip.kind === 'name'
            ? <User style={{ width: 12, height: 12 }} />
            : chip.kind === 'role'
              ? <Sparkles style={{ width: 12, height: 12 }} />
              : <CheckCircle2 style={{ width: 12, height: 12 }} />}
          {chip.label}
        </span>
      ))}
    </div>
  );

  const greeting = step.showGreeting && session.visitorName && (
    <div className="exp-trait-greeting">
      Welcome, <strong>{session.visitorName}</strong>
    </div>
  );

  const selectAllBtn = step.showSelectAll && (
    <button
      className={`exp-btn-select-all${allSelected ? ' active' : ''}`}
      onClick={handleSelectAll}
    >
      {allSelected ? 'Deselect All' : 'Select All'}
    </button>
  );

  // Trait grid layout: explicit gridColumns wins; otherwise 'list' = 1 col,
  // 'grid' (default) = let the locked CSS pick (4-col tablet, 2-col mobile).
  const colsOverride =
    typeof step.gridColumns === 'number'
      ? step.gridColumns
      : step.layout === 'list'
        ? 1
        : undefined;
  const gridStyle: React.CSSProperties = {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    alignContent: 'start',
    gridAutoRows: 'auto',
    WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'],
    paddingRight: 4,
    ...(colsOverride ? { gridTemplateColumns: `repeat(${colsOverride}, 1fr)` } : {}),
    ...(step.layout === 'list' ? { gap: 8 } : {}),
  };
  const rootStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: 0,
    width: '100%',
  };

  return (
    <div style={rootStyle}>
      {isMobile ? (
        /* Mobile: subtitle and Select All share a flex row so they're vertically centred */
        <div className="exp-trait-header">
          {chips}
          {greeting}
          <h2 className="exp-trait-title">{step.title}</h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <p className="exp-trait-subtitle" style={{ margin: 0 }}>{step.subtitle}</p>
            {selectAllBtn}
          </div>
        </div>
      ) : (
        <>
          {/* Tablet: header + zero-height float trick for Select All */}
          <div className="exp-trait-header">
            {chips}
            {greeting}
            <h2 className="exp-trait-title">{step.title}</h2>
            <p className="exp-trait-subtitle">{step.subtitle}</p>
          </div>
          {step.showSelectAll && (
            <div style={{ position: 'relative', maxWidth: 820, width: '100%', height: 0 }}>
              <button
                className={`exp-btn-select-all${allSelected ? ' active' : ''}`}
                onClick={handleSelectAll}
                style={{ position: 'absolute', bottom: 12, right: 0 }}
              >
                {allSelected ? 'Deselect All' : 'Select All'}
              </button>
            </div>
          )}
        </>
      )}

      {/* Pinned "Most Selected" row (analytics-driven, top-N).
          Renders only when the step opts in (showMostSelected) AND the
          trait-counts API has returned at least one match. */}
      {step.showMostSelected && popular.length > 0 && (() => {
        const popularOptions = popular
          .map(v => step.options.find(o => o.value === v))
          .filter(Boolean) as TraitOption[];
        if (popularOptions.length === 0) return null;
        return (
          <div
            style={{
              flexShrink: 0,
              marginBottom: 12,
              paddingBottom: 12,
              borderBottom: '1px solid var(--exp-border)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginBottom: 8,
                color: 'var(--exp-teal)',
                fontSize: 11,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              <Flame style={{ width: 12, height: 12 }} />
              Most Selected
            </div>
            <div
              style={{
                display: step.layout === 'list' ? 'flex' : 'grid',
                gridTemplateColumns: step.layout === 'list' ? undefined : `repeat(${Math.min(3, popularOptions.length)}, 1fr)`,
                flexDirection: step.layout === 'list' ? 'column' : undefined,
                gap: step.layout === 'list' ? 8 : 14,
              }}
            >
              {popularOptions.map((option) => {
                const isSelected = selectedValues.includes(option.value);
                const cardStyle: React.CSSProperties = step.layout === 'list'
                  ? {
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      gap: 14,
                      minHeight: 56,
                      padding: '12px 18px',
                      textAlign: 'left',
                    }
                  : {};
                return (
                  <button
                    key={`popular-${option.value}`}
                    className={`exp-trait-card${isSelected ? ' selected' : ''}${step.layout === 'list' ? ' exp-trait-card-row' : ''}`}
                    onClick={() => handleCardClick(option.value)}
                    style={cardStyle}
                  >
                    <TraitIcon option={option} />
                    <span
                      className="exp-trait-card-label"
                      style={step.layout === 'list' ? { fontSize: 15, fontWeight: 500 } : undefined}
                    >
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Trait Grid (scrolls when items exceed available space) */}
      <div className="exp-trait-grid" style={gridStyle}>
        {step.options.map((option) => {
          const isSelected = selectedValues.includes(option.value);
          const cardStyle: React.CSSProperties = step.layout === 'list'
            ? {
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: 14,
                minHeight: 56,
                padding: '12px 18px',
                textAlign: 'left',
                ...(option.backgroundImage
                  ? { backgroundImage: `url(${option.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                  : {}),
              }
            : (option.backgroundImage
                ? { backgroundImage: `url(${option.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                : {});
          return (
            <button
              key={option.value}
              className={`exp-trait-card${isSelected ? ' selected' : ''}${step.layout === 'list' ? ' exp-trait-card-row' : ''}`}
              onClick={() => handleCardClick(option.value)}
              style={cardStyle}
            >
              <TraitIcon option={option} />
              <span
                className="exp-trait-card-label"
                style={step.layout === 'list' ? { fontSize: 15, fontWeight: 500 } : undefined}
              >
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
