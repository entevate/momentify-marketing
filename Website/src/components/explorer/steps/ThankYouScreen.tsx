'use client';

import { RotateCcw, StickyNote } from 'lucide-react';
import { useExplorer } from '@/components/explorer/ExplorerContext';
import type { ThankYouStepConfig } from '@/lib/explorer/types';

export default function ThankYouScreen({ step, onOpenNotes }: { step: ThankYouStepConfig; onOpenNotes?: () => void }) {
  const { config, resetSession } = useExplorer();
  const logo = config.branding.logo;

  return (
    <>
      {/* Center content */}
      <div className="exp-thank-you-center">
        {logo && (
          <img
            src={logo.light}
            alt="Logo"
            style={{ width: 180, height: 'auto' }}
          />
        )}
        <h1 className="exp-thank-you-title">{step.title}</h1>
        <p className="exp-thank-you-subtitle">{step.subtitle}</p>
      </div>

      {/* Bottom actions */}
      <div className="exp-thank-you-actions">
        {step.showNewSessionButton && (
          <button className="exp-btn-new-session" onClick={resetSession}>
            <RotateCcw style={{ width: 14, height: 14, marginRight: 6, verticalAlign: -2 }} />
            Start New Session
          </button>
        )}
        {step.showAddNotesButton && (
          <button className="exp-btn-add-notes" onClick={onOpenNotes}>
            <StickyNote style={{ width: 14, height: 14, marginRight: 6, verticalAlign: -2 }} />
            Add Notes
          </button>
        )}
      </div>
    </>
  );
}
