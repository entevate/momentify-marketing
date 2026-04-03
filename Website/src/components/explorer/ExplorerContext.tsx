'use client';

import { createContext, useContext, useCallback, useState, useRef, type ReactNode } from 'react';
import type { ExplorerConfig, ExplorerSession, ContentCard } from '@/lib/explorer/types';
import { createInitialSession, resolveNextStepId, resolvePrevStepId, buildProgressDots, getStepById } from '@/lib/explorer/step-machine';
import { generateThemeVars } from '@/lib/explorer/theme';

interface ExplorerContextValue {
  config: ExplorerConfig;
  session: ExplorerSession;
  themeVars: Record<string, string>;
  // Navigation
  goToStep: (stepId: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  // Session mutations
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  setMode: (mode: 'scan' | 'form' | 'search') => void;
  setVisitorName: (name: string) => void;
  setRegisteredEmail: (email: string) => void;
  setRegisteredPhone: (phone: string) => void;
  selectRole: (role: string) => void;
  toggleInterest: (interest: string) => void;
  setSelectedTraits: (stepId: string, values: string[]) => void;
  toggleSaveCard: (cardId: string) => void;
  isCardSaved: (cardId: string) => boolean;
  setActiveTab: (tabId: string) => void;
  setViewSize: (size: 'small' | 'medium' | 'large') => void;
  setPageState: (tabId: string, page: number) => void;
  setLeadTemp: (temp: 'hot' | 'warm' | 'cool' | 'cold') => void;
  setNotes: (notes: string) => void;
  setAssignee: (assignee: string) => void;
  resetSession: () => void;
  // Content helpers
  getContentByType: (type: 'outcome' | 'learn' | 'solution') => ContentCard[];
  getSavedCards: () => ContentCard[];
  savedCount: number;
  progressDots: { id: string; active: boolean; completed: boolean }[];
  // Toast
  showToast: (message: string) => void;
  toastMessage: string;
  toastVisible: boolean;
}

const ExplorerContext = createContext<ExplorerContextValue | null>(null);

export function useExplorer() {
  const ctx = useContext(ExplorerContext);
  if (!ctx) throw new Error('useExplorer must be used within ExplorerProvider');
  return ctx;
}

export function ExplorerProvider({ config, children }: { config: ExplorerConfig; children: ReactNode }) {
  const [session, setSession] = useState<ExplorerSession>(() => createInitialSession(config));
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const themeVars = generateThemeVars(config.branding, session.theme);

  const update = useCallback((partial: Partial<ExplorerSession>) => {
    setSession(prev => ({ ...prev, ...partial }));
  }, []);

  const goToStep = useCallback((stepId: string) => {
    const stepIndex = config.steps.findIndex(s => s.id === stepId);
    if (stepIndex >= 0) {
      update({ currentStepId: stepId, currentStepIndex: stepIndex });
    }
  }, [config.steps, update]);

  const nextStep = useCallback(() => {
    const nextId = resolveNextStepId(config, session);
    if (nextId) goToStep(nextId);
  }, [config, session, goToStep]);

  const prevStep = useCallback(() => {
    const prevId = resolvePrevStepId(config, session);
    if (prevId) goToStep(prevId);
  }, [config, session, goToStep]);

  const toggleTheme = useCallback(() => {
    setSession(prev => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark',
    }));
  }, []);

  const toggleSaveCard = useCallback((cardId: string) => {
    setSession(prev => {
      const saved = prev.savedCardIds.includes(cardId)
        ? prev.savedCardIds.filter(id => id !== cardId)
        : [...prev.savedCardIds, cardId];
      return { ...prev, savedCardIds: saved };
    });
  }, []);

  const toggleInterest = useCallback((interest: string) => {
    setSession(prev => {
      const interests = prev.selectedInterests.includes(interest)
        ? prev.selectedInterests.filter(i => i !== interest)
        : [...prev.selectedInterests, interest];
      return { ...prev, selectedInterests: interests };
    });
  }, []);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setToastVisible(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 2500);
  }, []);

  const getContentByType = useCallback((type: 'outcome' | 'learn' | 'solution') => {
    return config.content.filter(c => c.cardType === type);
  }, [config.content]);

  const getSavedCards = useCallback(() => {
    return config.content.filter(c => session.savedCardIds.includes(c.id));
  }, [config.content, session.savedCardIds]);

  const progressDots = buildProgressDots(config, session);

  const value: ExplorerContextValue = {
    config,
    session,
    themeVars,
    goToStep,
    nextStep,
    prevStep,
    setTheme: (theme) => update({ theme }),
    toggleTheme,
    setMode: (mode) => update({ mode }),
    setVisitorName: (name) => update({ visitorName: name }),
    setRegisteredEmail: (email) => update({ registeredEmail: email }),
    setRegisteredPhone: (phone) => update({ registeredPhone: phone }),
    selectRole: (role) => update({ selectedRole: role }),
    toggleInterest,
    setSelectedTraits: (stepId, values) =>
      setSession(prev => ({ ...prev, selectedTraits: { ...prev.selectedTraits, [stepId]: values } })),
    toggleSaveCard,
    isCardSaved: (cardId) => session.savedCardIds.includes(cardId),
    setActiveTab: (tabId) => update({ activeTab: tabId }),
    setViewSize: (size) => update({ viewSize: size }),
    setPageState: (tabId, page) =>
      setSession(prev => ({ ...prev, pageState: { ...prev.pageState, [tabId]: page } })),
    setLeadTemp: (temp) => update({ leadTemp: temp }),
    setNotes: (notes) => update({ notes }),
    setAssignee: (assignee) => update({ assignee }),
    resetSession: () => setSession(createInitialSession(config)),
    getContentByType,
    getSavedCards,
    savedCount: session.savedCardIds.length,
    progressDots,
    showToast,
    toastMessage,
    toastVisible,
  };

  return (
    <ExplorerContext.Provider value={value}>
      {children}
    </ExplorerContext.Provider>
  );
}
