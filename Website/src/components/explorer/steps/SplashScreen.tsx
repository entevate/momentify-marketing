'use client';

import { ArrowRight } from 'lucide-react';
import { useExplorer } from '@/components/explorer/ExplorerContext';
import type { SplashStepConfig } from '@/lib/explorer/types';

export default function SplashScreen({ step }: { step: SplashStepConfig }) {
  const { config, nextStep } = useExplorer();
  const orbs = config.branding.auroraOrbs;

  // Split title at the line break before the gradient word
  const titleParts = step.title.split('\n');

  return (
    <>
      {/* Aurora orbs background */}
      <div className="exp-aurora-orbs">
        {orbs && (
          <>
            <div
              className="exp-aurora-orb exp-aurora-orb-1"
              style={{ background: orbs.orb1 }}
            />
            <div
              className="exp-aurora-orb exp-aurora-orb-2"
              style={{ background: orbs.orb2 }}
            />
            <div
              className="exp-aurora-orb exp-aurora-orb-3"
              style={{ background: orbs.orb3 }}
            />
          </>
        )}
      </div>

      {/* Welcome content */}
      <div className="exp-welcome">
        <div className="exp-welcome-content">
          <h1 className="exp-welcome-title">
            {titleParts.map((part, i) => (
              <span key={i}>
                {i > 0 && <br />}
                {part}
              </span>
            ))}
            {step.gradientWord && (
              <>
                <br />
                <span className="exp-gradient-word">{step.gradientWord}</span>
              </>
            )}
          </h1>
          <p className="exp-welcome-subtitle">{step.subtitle}</p>
          <button className="exp-btn-tap-begin" onClick={nextStep}>
            {step.buttonText || 'Tap to Begin'}
            <ArrowRight />
          </button>
        </div>
      </div>
    </>
  );
}
