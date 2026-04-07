'use client';

import { Star, User, Sparkles, CheckCircle2 } from 'lucide-react';
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

  // Determine currently selected values for this step
  const selectedValues: string[] = (() => {
    // Check if this is a role-type step (single select with role-like id)
    if (session.selectedRole && isSingle) return [session.selectedRole];
    // Check selectedTraits map
    if (session.selectedTraits[step.id]) return session.selectedTraits[step.id];
    // Interests (multi-select)
    if (!isSingle && session.selectedInterests.length > 0) return session.selectedInterests;
    return [];
  })();

  const allSelected = selectedValues.length === step.options.length;

  function handleCardClick(value: string) {
    if (isSingle) {
      selectRole(value);
    } else {
      toggleInterest(value);
    }
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

  // Build chips from previous steps only — no chips on the first trait-selection step
  const firstTraitStep = config.steps.find(s => s.type === 'trait-selection');
  const isFirstTraitStep = firstTraitStep?.id === step.id;
  const showName = !isFirstTraitStep && !!session.visitorName;
  const showRole = !isFirstTraitStep && !isSingle && !!session.selectedRole;
  const hasChips = showName || showRole;

  return (
    <div>
      {/* Header — chips sit INSIDE header, above the title */}
      <div className="exp-trait-header">
        {hasChips && (
          <div className="exp-selection-summary">
            {showName && (
              <span className="exp-summary-chip chip-name">
                <User style={{ width: 12, height: 12 }} />
                {session.visitorName}
              </span>
            )}
            {showRole && (
              <span className="exp-summary-chip chip-role">
                <Sparkles style={{ width: 12, height: 12 }} />
                {getOptionLabel(session.selectedRole!)}
              </span>
            )}
          </div>
        )}
        {step.showGreeting && session.visitorName && (
          <div className="exp-trait-greeting">
            Welcome, <strong>{session.visitorName}</strong>
          </div>
        )}
        <h2 className="exp-trait-title">{step.title}</h2>
        <p className="exp-trait-subtitle">{step.subtitle}</p>
      </div>

      {/* Select All — positioned right, between header and grid */}
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

      {/* Trait Grid */}
      <div className="exp-trait-grid">
        {step.options.map((option) => {
          const isSelected = selectedValues.includes(option.value);
          return (
            <button
              key={option.value}
              className={`exp-trait-card${isSelected ? ' selected' : ''}`}
              onClick={() => handleCardClick(option.value)}
              style={
                option.backgroundImage
                  ? { backgroundImage: `url(${option.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                  : undefined
              }
            >
              <TraitIcon option={option} />
              <span className="exp-trait-card-label">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
