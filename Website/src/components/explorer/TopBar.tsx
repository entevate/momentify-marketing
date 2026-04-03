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
  Wrench,
  StickyNote,
  Mic,
  Camera,
  UserPlus,
} from 'lucide-react';

interface TopBarProps {
  showModeSwitcher: boolean;
  onOpenNotes?: () => void;
  onOpenVoice?: () => void;
  onOpenMedia?: () => void;
}

const modeIcons = {
  scan: QrCode,
  form: UserRound,
  search: Search,
} as const;

const toolItems = [
  { id: 'notes', label: 'Notes', icon: StickyNote },
  { id: 'voice', label: 'Voice', icon: Mic },
  { id: 'media', label: 'Media', icon: Camera },
  { id: 'capture', label: 'Capture Info', icon: UserPlus },
] as const;

export default function TopBar({ showModeSwitcher, onOpenNotes, onOpenVoice, onOpenMedia }: TopBarProps) {
  const { config, session, toggleTheme, setMode, savedCount } = useExplorer();
  const [toolsOpen, setToolsOpen] = useState(false);

  const currentStep = config.steps[session.currentStepIndex];
  const isSplash = currentStep?.type === 'splash';
  const isThankYou = currentStep?.type === 'thank-you';
  const showPersistent = !isSplash && !isThankYou;

  const logoSrc = session.theme === 'dark'
    ? config.branding.logo.dark
    : config.branding.logo.light;

  return (
    <div className="exp-top-bar">
      <div className="exp-logo">
        <img src={logoSrc} alt={config.name} />
      </div>

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
        {showPersistent && (
          <div className="exp-persistent-actions">
            <button className="exp-btn-persistent exp-btn-briefcase" aria-label="Briefcase">
              <Briefcase />
              <span className={`exp-briefcase-count${savedCount > 0 ? ' visible' : ''}`}>
                {savedCount}
              </span>
            </button>

            <div className="exp-tools-wrapper">
              <button
                className="exp-btn-persistent"
                onClick={() => setToolsOpen(!toolsOpen)}
                aria-label="Tools"
              >
                <Wrench />
              </button>
              <div className={`exp-tools-dropdown${toolsOpen ? ' open' : ''}`}>
                {toolItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      className="exp-tools-dropdown-item"
                      onClick={() => {
                        setToolsOpen(false);
                        if (item.id === 'notes') onOpenNotes?.();
                        if (item.id === 'voice') onOpenVoice?.();
                        if (item.id === 'media') onOpenMedia?.();
                      }}
                    >
                      <Icon />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <button className="exp-theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {session.theme === 'dark' ? <Sun /> : <Moon />}
        </button>
      </div>
    </div>
  );
}
