'use client';

import { useExplorer } from './ExplorerContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function BottomBar() {
  const { config, session, nextStep, prevStep, goToStep, progressDots } = useExplorer();

  const currentStep = config.steps[session.currentStepIndex];
  const isRegistration = currentStep?.type === 'registration';
  const isResults = currentStep?.type === 'results';

  // Find the summary step for the Done button
  const summaryStep = config.steps.find((s) => s.type === 'summary');

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

      {isRegistration && config.registration.skipEnabled ? (
        <button className="exp-btn-skip" onClick={nextStep}>
          Skip
          <ChevronRight />
        </button>
      ) : isResults && summaryStep ? (
        <button className="exp-btn-next" onClick={() => goToStep(summaryStep.id)}>
          Done
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
