'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import './explorer.css';
import { useExplorer } from './ExplorerContext';
import TopBar from './TopBar';
import BottomBar from './BottomBar';
import SplashScreen from './steps/SplashScreen';
import RegistrationStep from './steps/RegistrationStep';
import TraitSelectionStep from './steps/TraitSelectionStep';
import ResultsStep from './steps/ResultsStep';
import ContentLibraryStep from './steps/ContentLibraryStep';
import SummaryStep from './steps/SummaryStep';
import ThankYouScreen from './steps/ThankYouScreen';
import CardOverlay from './overlays/CardOverlay';
import EndSessionDialog from './overlays/EndSessionDialog';
import ShareDialog from './overlays/ShareDialog';
import NotesDialog from './overlays/NotesDialog';
import VoiceCaptureDialog from './overlays/VoiceCaptureDialog';
import MediaCaptureDialog from './overlays/MediaCaptureDialog';
import type { ContentCard } from '@/lib/explorer/types';

export default function ExplorerShell() {
  const { config, session, themeVars, toastMessage, toastVisible, goToStep, resetSession } = useExplorer();

  // Viewport scaling: render at 1366x1024 and scale to fit
  const shellRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const updateScale = useCallback(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const sx = w / 1366;
    const sy = h / 1024;
    setScale(Math.min(sx, sy));
  }, []);

  useEffect(() => {
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [updateScale]);

  // Overlay state
  const [overlayCard, setOverlayCard] = useState<ContentCard | null>(null);
  const [endSessionOpen, setEndSessionOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState<{ open: boolean; type: 'email' | 'text' | 'qr' }>({ open: false, type: 'email' });
  const [notesOpen, setNotesOpen] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);

  const currentStep = config.steps[session.currentStepIndex];
  const isSplash = currentStep?.type === 'splash';
  const isThankYou = currentStep?.type === 'thank-you';
  const isRegistration = currentStep?.type === 'registration';
  const hideBottomBar = isSplash || isThankYou;

  const auroraOrbs = config.branding.auroraOrbs;

  // Determine content width class
  const isWideStep = currentStep?.type === 'trait-selection' || currentStep?.type === 'results' ||
    currentStep?.type === 'summary' || currentStep?.type === 'content-library';
  const isStretchStep = currentStep?.type === 'results' || currentStep?.type === 'summary' ||
    currentStep?.type === 'content-library';

  // Role background gradient
  const roleGradient = session.selectedRole && config.branding.roleBackgrounds?.[session.selectedRole]
    ? (typeof config.branding.roleBackgrounds[session.selectedRole] === 'string'
      ? config.branding.roleBackgrounds[session.selectedRole] as string
      : (config.branding.roleBackgrounds[session.selectedRole] as { gradient?: string })?.gradient)
    : undefined;

  const renderCurrentStep = () => {
    if (!currentStep) return null;

    switch (currentStep.type) {
      case 'splash':
        return <SplashScreen step={currentStep} />;
      case 'registration':
        return <RegistrationStep />;
      case 'trait-selection':
        return <TraitSelectionStep step={currentStep} />;
      case 'results':
        return <ResultsStep step={currentStep} onOpenOverlay={setOverlayCard} />;
      case 'content-library':
        return <ContentLibraryStep step={currentStep} />;
      case 'summary':
        return (
          <SummaryStep
            step={currentStep}
            onOpenOverlay={setOverlayCard}
            onEndSession={() => setEndSessionOpen(true)}
            onShare={(type) => setShareOpen({ open: true, type })}
          />
        );
      case 'thank-you':
        return <ThankYouScreen step={currentStep} onOpenNotes={() => setNotesOpen(true)} />;
      default:
        return null;
    }
  };

  const handleConfirmEndSession = () => {
    setEndSessionOpen(false);
    const thankYouStep = config.steps.find(s => s.type === 'thank-you');
    if (thankYouStep) goToStep(thankYouStep.id);
  };

  return (
    <div
      ref={shellRef}
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: '#07081F',
      }}
    >
    <div
      className="explorer-shell"
      style={{
        ...themeVars as React.CSSProperties,
        width: 1366,
        height: 1024,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
      }}
    >
      <div className="exp-shell-inner">
        {/* Role background overlay */}
        <div
          className={`exp-role-bg${session.selectedRole && !isSplash && !isThankYou ? ' active' : ''}`}
          style={roleGradient ? { background: roleGradient } : undefined}
        />

        {/* Aurora orbs on splash and thank you */}
        {(isSplash || isThankYou) && auroraOrbs && (
          <div className="exp-aurora-orbs">
            <div className="exp-aurora-orb exp-aurora-orb-1" style={{ background: auroraOrbs.orb1 }} />
            <div className="exp-aurora-orb exp-aurora-orb-2" style={{ background: auroraOrbs.orb2 }} />
            <div className="exp-aurora-orb exp-aurora-orb-3" style={{ background: auroraOrbs.orb3 }} />
          </div>
        )}

        <TopBar
          showModeSwitcher={isRegistration}
          onOpenNotes={() => setNotesOpen(true)}
          onOpenVoice={() => setVoiceOpen(true)}
          onOpenMedia={() => setMediaOpen(true)}
        />

        {isSplash || isThankYou ? (
          <div className="exp-center" style={{ alignItems: 'stretch', justifyContent: 'center', padding: 0 }}>
            {renderCurrentStep()}
          </div>
        ) : (
          <div className={`exp-center${isStretchStep ? ' stretch' : ''}`}>
            <div className={`exp-content${isWideStep ? ' wide' : ''}${isStretchStep ? ' stretch' : ''}`}>
              {renderCurrentStep()}
            </div>
          </div>
        )}

        {!hideBottomBar && <BottomBar />}

        {/* Toast */}
        <div className={`exp-toast${toastVisible ? ' visible' : ''}`}>
          {toastMessage}
        </div>
      </div>

      {/* Overlays */}
      <CardOverlay card={overlayCard} onClose={() => setOverlayCard(null)} />
      <EndSessionDialog
        open={endSessionOpen}
        onClose={() => setEndSessionOpen(false)}
        onConfirm={handleConfirmEndSession}
      />
      <ShareDialog
        open={shareOpen.open}
        type={shareOpen.type}
        onClose={() => setShareOpen({ ...shareOpen, open: false })}
      />
      <NotesDialog open={notesOpen} onClose={() => setNotesOpen(false)} />
      <VoiceCaptureDialog open={voiceOpen} onClose={() => setVoiceOpen(false)} />
      <MediaCaptureDialog open={mediaOpen} onClose={() => setMediaOpen(false)} />
    </div>
    </div>
  );
}
