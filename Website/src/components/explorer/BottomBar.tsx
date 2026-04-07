'use client';

import { useExplorer } from './ExplorerContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function BottomBar() {
  const { config, session, nextStep, prevStep, goToStep, progressDots, setVisitorName } = useExplorer();

  const currentStep = config.steps[session.currentStepIndex];
  const isRegistration = currentStep?.type === 'registration';
  const isResults = currentStep?.type === 'results';
  const isTrait = currentStep?.type === 'trait-selection';

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
    if (isSingle) return !!session.selectedRole;
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

      <div className="exp-progress-dots">
        {progressDots.map((dot) => (
          <div
            key={dot.id}
            className={`exp-progress-dot${dot.active ? ' active' : ''}${dot.completed ? ' completed' : ''}`}
          />
        ))}
      </div>

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
