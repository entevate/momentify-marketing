'use client';



import { useExplorer } from '@/components/explorer/ExplorerContext';
import type { ThankYouStepConfig } from '@/lib/explorer/types';

export default function ThankYouScreen({ step, onOpenNotes }: { step: ThankYouStepConfig; onOpenNotes?: () => void }) {
  const { config, session, resetSession } = useExplorer();
  const logo = config.branding.logo;
  const logoSrc = session.theme === 'dark' ? logo.dark : logo.light;

  return (
    <>
      {/* Center content */}
      <div className="exp-thank-you-center">
        {logo && (
          <img
            src={logoSrc}
            alt="Logo"
            style={{ width: 'auto', height: 40 }}
          />
        )}
        <h1 className="exp-thank-you-title">{step.title}</h1>
        <p className="exp-thank-you-subtitle">{step.subtitle}</p>
      </div>

      {/* Bottom actions */}
      <div className="exp-thank-you-actions">
        {step.showNewSessionButton && (
          <button className="exp-btn-new-session" onClick={resetSession}>
            New Session
          </button>
        )}
        {step.showAddNotesButton && (
          <button className="exp-btn-add-notes" onClick={onOpenNotes}>
            Add Notes
          </button>
        )}
      </div>
    </>
  );
}
