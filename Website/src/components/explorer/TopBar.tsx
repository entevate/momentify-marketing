'use client';

import { useState } from 'react';
import { useExplorer } from './ExplorerContext';
import {
  QrCode,
  UserRound,
  Search,
  Sun,
  Moon,
  Briefcase,
  LayoutGrid,
  StickyNote,
  Mic,
  Camera,
  UserPlus,
  Library,
  Power,
} from 'lucide-react';

interface TopBarProps {
  showModeSwitcher: boolean;
  onOpenNotes?: () => void;
  onOpenVoice?: () => void;
  onOpenMedia?: () => void;
  onEndSession?: () => void;
}

const modeIcons = {
  scan: QrCode,
  form: UserRound,
  search: Search,
} as const;

export default function TopBar({ showModeSwitcher, onOpenNotes, onOpenVoice, onOpenMedia, onEndSession }: TopBarProps) {
  const { config, session, toggleTheme, setMode, savedCount, goToStep } = useExplorer();
  const [toolsOpen, setToolsOpen] = useState(false);

  const currentStep = config.steps[session.currentStepIndex];
  const isSplash = currentStep?.type === 'splash';
  const isThankYou = currentStep?.type === 'thank-you';
  const showPersistent = !isSplash && !isThankYou;

  const features = config.features as unknown as Record<string, unknown>;
  const registrationIncomplete = !session.registeredEmail || !session.visitorName;

  const logoSrc = session.theme === 'dark'
    ? config.branding.logo.dark
    : config.branding.logo.light;

  // Build tools dropdown items (Content Library + feature-gated items)
  const toolItems: { id: string; label: string; icon: typeof Mic; onClick: () => void }[] = [];

  // Content Library is always first in tools dropdown if a content-library step exists
  const contentLibStep = config.steps.find(s => s.type === 'content-library');
  if (contentLibStep) {
    toolItems.push({
      id: 'library',
      label: 'Content Library',
      icon: Library,
      onClick: () => { setToolsOpen(false); goToStep(contentLibStep.id); },
    });
  }

  if (features.notes !== false) {
    toolItems.push({
      id: 'notes',
      label: 'Capture Notes',
      icon: StickyNote,
      onClick: () => { setToolsOpen(false); onOpenNotes?.(); },
    });
  }
  if (features.voiceCapture !== false) {
    toolItems.push({
      id: 'voice',
      label: 'Capture Voice',
      icon: Mic,
      onClick: () => { setToolsOpen(false); onOpenVoice?.(); },
    });
  }
  if (features.mediaCapture !== false) {
    toolItems.push({
      id: 'media',
      label: 'Capture Media',
      icon: Camera,
      onClick: () => { setToolsOpen(false); onOpenMedia?.(); },
    });
  }

  return (
    <div className="exp-top-bar">
      {!isThankYou && (
        <div className="exp-logo">
          <img src={logoSrc} alt={config.name} />
        </div>
      )}

      {showPersistent && (
        <div className="exp-persistent-actions">
          {/* Tools dropdown — Content Library, Notes, Voice, Media */}
          {toolItems.length > 0 && (
            <div className="exp-tools-wrapper">
              <button
                className="exp-btn-persistent"
                onClick={() => setToolsOpen(!toolsOpen)}
                aria-label="Tools"
              >
                <LayoutGrid />
              </button>
              <div className={`exp-tools-dropdown${toolsOpen ? ' open' : ''}`}>
                {toolItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      className="exp-tools-dropdown-item"
                      onClick={item.onClick}
                    >
                      <Icon />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Briefcase — saved items */}
          <button
            className="exp-btn-persistent exp-btn-briefcase"
            aria-label="Saved items"
            onClick={() => {
              const summaryStep = config.steps.find(s => s.type === 'summary');
              if (summaryStep) goToStep(summaryStep.id);
            }}
          >
            <Briefcase />
            <span className={`exp-briefcase-count${savedCount > 0 ? ' visible' : ''}`}>
              {savedCount}
            </span>
          </button>

          {/* Capture Info */}
          {features.captureInfo !== false && (
            <button
              className="exp-btn-persistent"
              aria-label="Capture lead info"
              onClick={() => {
                const regStep = config.steps.find(s => s.type === 'registration');
                if (regStep) goToStep(regStep.id);
              }}
            >
              <UserPlus />
              {registrationIncomplete && (
                <span className="exp-btn-alert" />
              )}
            </button>
          )}

          {/* End Session */}
          <button
            className="exp-btn-persistent exp-btn-end"
            aria-label="End session"
            onClick={onEndSession}
          >
            <Power />
          </button>
        </div>
      )}

      {showModeSwitcher && config.registration.modes.length > 1 && (
        <div className="exp-mode-switcher">
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
      )}

      <div className="exp-top-right">
        {isSplash && (
          <button className="exp-theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
            {session.theme === 'dark' ? <Sun /> : <Moon />}
          </button>
        )}
      </div>
    </div>
  );
}
