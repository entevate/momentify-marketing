'use client';

import { Star, User, Sparkles, CheckCircle2 } from 'lucide-react';
import { useExplorer } from '@/components/explorer/ExplorerContext';
import type { TraitSelectionStepConfig, TraitOption } from '@/lib/explorer/types';

function TraitIcon({ option }: { option: TraitOption }) {
  if (option.iconType === 'image' && option.icon) {
    return <img src={option.icon} alt="" style={{ width: 32, height: 32, objectFit: 'contain' }} />;
  }
  if (option.iconType === 'svg' && option.icon) {
    return <span dangerouslySetInnerHTML={{ __html: option.icon }} />;
  }
  // lucide or fallback: render Star as placeholder
  return <Star />;
}

export default function TraitSelectionStep({ step }: { step: TraitSelectionStepConfig }) {
  const {
    session,
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
      // Auto-advance after single selection
      setTimeout(() => nextStep(), 300);
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

  return (
    <div>
      {/* Header */}
      <div className="exp-trait-header">
        {step.showGreeting && session.visitorName && (
          <div className="exp-trait-greeting">
            Welcome, <strong>{session.visitorName}</strong>
          </div>
        )}
        <h2 className="exp-trait-title">{step.title}</h2>
        <p className="exp-trait-subtitle">{step.subtitle}</p>
      </div>

      {/* Select All */}
      {step.showSelectAll && (
        <button
          className={`exp-btn-select-all${allSelected ? ' active' : ''}`}
          onClick={handleSelectAll}
        >
          {allSelected ? 'Deselect All' : 'Select All'}
        </button>
      )}

      {/* Selection Summary Chips */}
      {(session.visitorName || session.selectedRole || session.selectedInterests.length > 0) && (
        <div className="exp-selection-summary">
          {session.visitorName && (
            <span className="exp-summary-chip chip-name">
              <User style={{ width: 12, height: 12 }} />
              {session.visitorName}
            </span>
          )}
          {session.selectedRole && (
            <span className="exp-summary-chip chip-role">
              <Sparkles style={{ width: 12, height: 12 }} />
              {session.selectedRole}
            </span>
          )}
          {session.selectedInterests.map((interest) => (
            <span className="exp-summary-chip chip-interest" key={interest}>
              <CheckCircle2 style={{ width: 12, height: 12 }} />
              {interest}
            </span>
          ))}
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
