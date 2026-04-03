// Explorer Builder — Step Navigation State Machine
// Supports linear sequences and branching paths

import type { StepConfig, ExplorerSession, ExplorerConfig } from './types';

export interface StepMachineActions {
  goToStep: (stepId: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  canGoNext: () => boolean;
  canGoBack: () => boolean;
  getCurrentStep: () => StepConfig | undefined;
  getStepSequence: () => string[];
  getProgressDots: () => { id: string; active: boolean; completed: boolean }[];
  reset: () => void;
}

/** Get the ordered step IDs based on current session state (handles branching) */
export function getStepSequence(
  config: ExplorerConfig,
  session: ExplorerSession
): string[] {
  const sequence: string[] = [];

  for (const step of config.steps) {
    // For trait-selection steps with branching, check if this step is on our path
    if (step.type === 'trait-selection' && step.nextStepMapping) {
      sequence.push(step.id);
      // The next step after this one will be determined by the selected option
      // We don't skip steps here; the branching is handled at navigation time
      continue;
    }
    sequence.push(step.id);
  }

  return sequence;
}

/** Resolve the next step ID considering branching */
export function resolveNextStepId(
  config: ExplorerConfig,
  session: ExplorerSession
): string | null {
  const currentStep = config.steps.find(s => s.id === session.currentStepId);
  if (!currentStep) return null;

  // Check if current step has branching logic
  if (
    currentStep.type === 'trait-selection' &&
    currentStep.nextStepMapping &&
    session.selectedRole
  ) {
    const branchedNextId = currentStep.nextStepMapping[session.selectedRole];
    if (branchedNextId) return branchedNextId;
  }

  // Default: go to next step in the array
  const currentIndex = config.steps.findIndex(s => s.id === session.currentStepId);
  if (currentIndex < config.steps.length - 1) {
    return config.steps[currentIndex + 1].id;
  }

  return null;
}

/** Resolve the previous step ID */
export function resolvePrevStepId(
  config: ExplorerConfig,
  session: ExplorerSession
): string | null {
  const currentIndex = config.steps.findIndex(s => s.id === session.currentStepId);
  if (currentIndex > 0) {
    return config.steps[currentIndex - 1].id;
  }
  return null;
}

/** Get step config by ID */
export function getStepById(
  config: ExplorerConfig,
  stepId: string
): StepConfig | undefined {
  return config.steps.find(s => s.id === stepId);
}

/** Get the index of a step within the config */
export function getStepIndex(
  config: ExplorerConfig,
  stepId: string
): number {
  return config.steps.findIndex(s => s.id === stepId);
}

/** Create the initial session state */
export function createInitialSession(config: ExplorerConfig): ExplorerSession {
  const firstStep = config.steps[0];
  const resultsStep = config.steps.find(s => s.type === 'results');

  return {
    currentStepIndex: 0,
    currentStepId: firstStep?.id ?? '',
    theme: config.features.defaultTheme,
    mode: config.registration.defaultMode,
    visitorName: '',
    registeredEmail: '',
    registeredPhone: '',
    selectedRole: null,
    selectedInterests: [],
    selectedTraits: {},
    savedCardIds: [],
    activeTab: resultsStep?.type === 'results' ? resultsStep.tabs[0]?.id ?? '' : '',
    viewSize: (resultsStep?.type === 'results' ? resultsStep.defaultView : 'small') as 'small' | 'medium' | 'large',
    pageState: {},
    rolePath: null,
    leadTemp: null,
    notes: '',
    assignee: null,
  };
}

/** Build progress dot state for the bottom bar */
export function buildProgressDots(
  config: ExplorerConfig,
  session: ExplorerSession
): { id: string; active: boolean; completed: boolean }[] {
  // Don't show dots for splash or thank-you
  const visibleSteps = config.steps.filter(
    s => s.type !== 'splash' && s.type !== 'thank-you'
  );

  const currentIdx = visibleSteps.findIndex(s => s.id === session.currentStepId);

  return visibleSteps.map((step, i) => ({
    id: step.id,
    active: step.id === session.currentStepId,
    completed: i < currentIdx,
  }));
}
