'use client';

import { useState, useRef } from 'react';
import './explorer.css';
import './explorer-mobile.css';
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
import TireAdvisorDialog from './overlays/TireAdvisorDialog';
import RoxCalculatorDialog from './overlays/RoxCalculatorDialog';
import type { ContentCard } from '@/lib/explorer/types';

export default function ExplorerShell() {
  const { config, session, themeVars, toastMessage, toastVisible, goToStep, resetSession } = useExplorer();

  const shellRef = useRef<HTMLDivElement>(null);

  // Overlay state
  const [overlayCard, setOverlayCard] = useState<ContentCard | null>(null);
  const [endSessionOpen, setEndSessionOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState<{ open: boolean; type: 'email' | 'text' | 'qr' }>({ open: false, type: 'email' });
  const [notesOpen, setNotesOpen] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [calculatorOpen, setCalculatorOpen] = useState(false);

  const currentStep = config.steps[session.currentStepIndex];
  const isSplash = currentStep?.type === 'splash';
  const isThankYou = currentStep?.type === 'thank-you';
  const isRegistration = currentStep?.type === 'registration';
  const isResults = currentStep?.type === 'results';
  const isSummary = currentStep?.type === 'summary';
  const isContentLibrary = currentStep?.type === 'content-library';
  // Results, summary, and content library have their own tab bar — hide main bottom bar
  const hideBottomBar = isSplash || isThankYou || isResults || isSummary || isContentLibrary;

  const auroraOrbs = config.branding.auroraOrbs;

  // Splash typewriter — if the splash step ships `typewriterWords`, render
  // 6 cycling gradient ORBS at the SHELL level. Each orb is a brand-colored
  // radial gradient anchored to a different position on the canvas; opacity
  // is staggered so they cascade through one-by-one over a 24s loop.
  // Together they read as "the gradient cycle is here right now" while still
  // feeling like a constellation of glows rather than a flat panning sheet.
  const splashStep = currentStep?.type === 'splash' ? currentStep : null;
  const showCyclingGlow =
    isSplash && splashStep && Array.isArray(splashStep.typewriterWords) && splashStep.typewriterWords.length > 0;
  // Each orb anchors to a different region so the cycle visually traverses
  // the canvas as it advances through the 6 brand solutions.
  const CYCLING_ORBS: { color: string; x: string; y: string; label: string }[] = [
    { color: '#254FE5', x: '22%', y: '28%', label: 'action' },         // brand blue — top-left
    { color: '#6B21D4', x: '78%', y: '22%', label: 'violet' },         // Trade Shows — top-right
    { color: '#5FD9C2', x: '85%', y: '58%', label: 'sol-teal' },       // Tech Recruiting — right
    { color: '#F2B33D', x: '68%', y: '85%', label: 'amber' },          // Field Sales — bottom-right
    { color: '#5B4499', x: '28%', y: '82%', label: 'indigo' },         // Facilities — bottom-left
    { color: '#F25E3D', x: '12%', y: '58%', label: 'crimson' },        // Venues & Events — left
  ];

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

  const formFactor = config.formFactor ?? 'tablet';
  const shellWidth = formFactor === 'mobile' ? 430 : 1366;
  const shellHeight = formFactor === 'mobile' ? 932 : 1024;

  return (
    <div
      ref={shellRef}
      className="explorer-shell"
      data-form={formFactor}
      style={{
        ...themeVars as React.CSSProperties,
        width: shellWidth,
        height: shellHeight,
      }}
    >
      {/* Theme-aware overrides for locked CSS hardcoded dark-mode values */}
      <style>{`
        .explorer-shell .exp-result-card {
          background: var(--exp-card-bg);
          border-color: var(--exp-card-border);
          box-shadow: var(--exp-card-shadow);
        }
        .explorer-shell .exp-trait-card {
          background: var(--exp-card-bg);
          border-color: var(--exp-card-border);
          box-shadow: var(--exp-card-shadow);
        }
        .explorer-shell .exp-trait-card.selected {
          background: var(--exp-selected-bg);
          border-color: var(--exp-selected-border);
          box-shadow: 0 2px 16px var(--exp-selected-glow), inset 0 1px 0 var(--exp-selected-inset);
        }
        .explorer-shell .exp-center {
          overflow: hidden;
        }
        .explorer-shell .exp-results-tab-bar {
          border-top: none;
        }
        .explorer-shell .exp-summary-chip {
          background: var(--exp-card-bg);
          border-color: var(--exp-card-border);
        }
        .explorer-shell .exp-bottom-bar {
          max-width: 860px;
          margin-left: auto;
          margin-right: auto;
          padding: 20px 24px;
        }
        .explorer-shell .exp-results-tab-bar {
          padding: 20px 0;
        }
        .explorer-shell .exp-results-view .exp-trait-header {
          height: auto;
          min-height: 100px;
        }
        .explorer-shell .exp-view-small .exp-paginated-wrapper {
          display: flex;
          flex-direction: column;
        }
        .explorer-shell .exp-view-small .exp-card-grid {
          flex: 1;
          min-height: 0;
          grid-template-rows: 1fr 1fr;
        }
        .explorer-shell .exp-card-overlay-inner {
          background: var(--exp-dialog-bg) !important;
          border-color: var(--exp-dialog-border) !important;
          box-shadow: var(--exp-dialog-shadow) !important;
        }
        .explorer-shell .exp-card-overlay {
          background: var(--exp-dialog-overlay-bg) !important;
        }
        .explorer-shell .exp-dialog {
          background: var(--exp-dialog-bg) !important;
          border-color: var(--exp-dialog-border) !important;
          box-shadow: var(--exp-dialog-shadow) !important;
        }
        .explorer-shell .exp-dialog-overlay.open {
          background: var(--exp-dialog-overlay-bg) !important;
        }
      `}</style>
      {/* Splash orb pulse keyframes + transparent top-bar override.
          Both scoped to the splash via the showCyclingGlow gate — when the
          user leaves splash this style tag unmounts and the top bar reverts.
          Each orb runs the same 24s pulse but staggered by -4s per orb so
          they cascade one-by-one through the 6 brand colors. */}
      {showCyclingGlow && (
        <style>{`
          @keyframes exp-orb-pulse {
            0%,  100% { opacity: 0;    transform: translate(-50%, -50%) scale(0.85); }
            12%       { opacity: 0.55; transform: translate(-50%, -50%) scale(1.05); }
            22%       { opacity: 0.55; transform: translate(-50%, -50%) scale(1.05); }
            34%       { opacity: 0;    transform: translate(-50%, -50%) scale(0.95); }
          }
          .explorer-shell .exp-top-bar {
            background: transparent !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            border-bottom: none !important;
            box-shadow: none !important;
          }
        `}</style>
      )}

      <div className="exp-shell-inner">
        {/* Role background overlay */}
        <div
          className={`exp-role-bg${session.selectedRole && !isSplash && !isThankYou ? ' active' : ''}`}
          style={roleGradient ? { background: roleGradient, ...(session.theme === 'light' ? { opacity: 0.45 } : {}) } : undefined}
        />

        {/* Splash cycling brand-gradient ORBS. Each orb is a soft radial
            gradient in one brand color, anchored to a different region of
            the canvas. Opacity is staggered so they cascade one-by-one
            through the 6 brand solutions over a 24s loop. Sits ABOVE the
            theme bg, BELOW the top bar/aurora/content, full-bleed so the
            glow extends behind the top bar with no seam. */}
        {showCyclingGlow && (
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 0,
              pointerEvents: 'none',
              overflow: 'hidden',
            }}
          >
            {CYCLING_ORBS.map((orb, i) => (
              <div
                key={orb.label}
                style={{
                  position: 'absolute',
                  left: orb.x,
                  top: orb.y,
                  width: '70%',
                  height: '70%',
                  // Soft, edge-faded radial gradient — single brand color
                  // bleeds out to transparent so the orb feels organic.
                  backgroundImage: `radial-gradient(circle, ${orb.color} 0%, ${orb.color}66 28%, transparent 65%)`,
                  filter: 'blur(40px)',
                  opacity: 0,
                  transformOrigin: 'center',
                  animation: 'exp-orb-pulse 24s ease-in-out infinite',
                  // Stagger so the orbs cascade — orb 0 starts at 0s, orb 1
                  // peaks 4s later, and so on. Negative delay = already in
                  // progress on mount, so the cycle is mid-flight immediately.
                  animationDelay: `${i * -4}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Aurora orbs on splash and thank you */}
        {(isSplash || isThankYou) && auroraOrbs && (
          <div className="exp-aurora-orbs" style={session.theme === 'light' ? { opacity: 0.5 } : undefined}>
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
          onOpenCalculator={() => setCalculatorOpen(true)}
          onEndSession={() => setEndSessionOpen(true)}
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
      {config.id === 'fortune-tire' && (
        <TireAdvisorDialog open={calculatorOpen} onClose={() => setCalculatorOpen(false)} />
      )}
      {config.id === 'momentify' && (
        <RoxCalculatorDialog open={calculatorOpen} onClose={() => setCalculatorOpen(false)} />
      )}
    </div>
  );
}
