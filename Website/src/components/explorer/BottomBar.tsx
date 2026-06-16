'use client';

import { useExplorer } from './ExplorerContext';
import { ChevronLeft, ChevronRight, QrCode, UserRound, Search } from 'lucide-react';

const modeIcons = {
  scan: QrCode,
  form: UserRound,
  search: Search,
} as const;

export default function BottomBar() {
  const { config, session, nextStep, prevStep, goToStep, progressDots, setVisitorName, setMode } = useExplorer();

  const currentStep = config.steps[session.currentStepIndex];
  const isRegistration = currentStep?.type === 'registration';
  const isResults = currentStep?.type === 'results';
  const isTrait = currentStep?.type === 'trait-selection';
  const isMobile = config.formFactor === 'mobile';
  const showMobileModeSwitcher =
    isMobile && isRegistration && config.registration.modes.length > 1;

  // Find the summary step for the Done button
  const summaryStep = config.steps.find((s) => s.type === 'summary');

  const handleSkipRegistration = () => {
    if (!session.visitorName) setVisitorName('Guest');
    nextStep();
  };

  // Check if trait-selection step has valid selections
  const traitHasSelection = (() => {
    if (!isTrait || currentStep?.type !== 'trait-selection') return true;
    const isSingle = currentStep.selectionMode === 'single';
    // The first single-select step is the "role" step (writes to selectedRole);
    // every other single-select step writes to selectedTraits[step.id].
    const firstTraitStep = config.steps.find(s => s.type === 'trait-selection');
    const isRoleStep = isSingle && firstTraitStep?.id === currentStep.id;
    if (isRoleStep) return !!session.selectedRole;
    if (isSingle) {
      return (session.selectedTraits[currentStep.id]?.length ?? 0) > 0;
    }
    // Multi-select: check selectedTraits map first, then selectedInterests
    const traitValues = session.selectedTraits[currentStep.id];
    if (traitValues && traitValues.length > 0) return true;
    if (session.selectedInterests.length > 0) return true;
    return false;
  })();

  return (
    <div className="exp-bottom-bar">
      <button className="exp-btn-back" onClick={prevStep}>
        <ChevronLeft />
        Back
      </button>

      {showMobileModeSwitcher ? (
        <div className="exp-mobile-mode-row">
          {config.registration.modes.map((mode) => {
            const Icon = modeIcons[mode];
            return (
              <button
                key={mode}
                className={`exp-mode-btn${session.mode === mode ? ' active' : ''}`}
                onClick={() => setMode(mode)}
                aria-label={`Switch to ${mode} mode`}
              >
                <Icon />
              </button>
            );
          })}
        </div>
      ) : (
        <div className="exp-progress-dots">
          {progressDots.map((dot) => (
            <div
              key={dot.id}
              className={`exp-progress-dot${dot.active ? ' active' : ''}${dot.completed ? ' completed' : ''}`}
            />
          ))}
        </div>
      )}

      {isRegistration && config.registration.skipEnabled && !session.visitorName ? (
        <button className="exp-btn-skip" onClick={handleSkipRegistration}>
          Skip
          <ChevronRight />
        </button>
      ) : isRegistration && session.visitorName ? (
        <button className="exp-btn-next" onClick={nextStep}>
          Next
          <ChevronRight />
        </button>
      ) : isResults && summaryStep ? (
        <button className="exp-btn-next" onClick={() => goToStep(summaryStep.id)}>
          Done
        </button>
      ) : isTrait ? (
        <button
          className="exp-btn-next"
          onClick={nextStep}
          disabled={!traitHasSelection}
          style={!traitHasSelection ? { opacity: 0.35, pointerEvents: 'none' } : undefined}
        >
          Next
          <ChevronRight />
        </button>
      ) : (
        <button className="exp-btn-next" onClick={nextStep}>
          Next
          <ChevronRight />
        </button>
      )}
    </div>
  );
}
