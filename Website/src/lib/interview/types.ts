/**
 * Interview Template Kind — Config + Session shapes.
 *
 * The `interview` kind covers structured candidate-intake kiosk flows
 * (walk-in open interviews, scheduled panels, screening surveys).
 * Distinct from Explorer because:
 *   - Single-question screens with bigger answer cards (not trait grids)
 *   - Per-question conditional follow-up text inputs (referrals, etc.)
 *   - Multi-select location pickers with name + sublabel
 *   - Documents step: PDF cards + email/SMS share dialog
 *   - Its own CSS port from each tenant's prototype
 *
 * Mirrored at fan-gallery/src/lib/interview/types.ts — the Publisher
 * authors configs here; the fan-gallery runtime consumes them after
 * ingest. Keep the two files in lockstep.
 */

export type FormFactor = 'tablet' | 'mobile';

/* ── Branding ──────────────────────────────────────────────────── */

export interface InterviewBranding {
  /** Single full-color brand mark; rendered against the dark surface. */
  logo: string;
  /** Accent color used for CTAs, selected states, focused borders. */
  primary: string;
  /** Text color rendered ON the primary color (CTA labels). */
  textOnPrimary: string;
  /** Page background color (typically near-black). */
  bg: string;
  /** Resting card / surface color. */
  surface: string;
  surfaceHover: string;
  border: string;
  text1: string;
  text2: string;
  text3: string;
  /** Gradient used on the splash "gradient word" (the highlighted phrase). */
  gradient: string;
  /** Optional fullscreen background image overlay. */
  bgImage?: string;
}

/* ── Registration ──────────────────────────────────────────────── */

export type InterviewFieldId = 'fullName' | 'firstName' | 'lastName' | 'email' | 'phone' | string;

export interface InterviewRegistrationField {
  id: InterviewFieldId;
  label: string;
  placeholder: string;
  required: boolean;
  /** Defaults inferred from id when omitted: fullName/firstName/lastName→text,
   *  email→email, phone→tel. */
  type?: 'text' | 'email' | 'tel';
  /** Half-width on tablet for side-by-side fields (firstName/lastName).
   *  Mobile always renders fields full-width. */
  halfWidth?: boolean;
  /** When set, the field's value lands under sessions.extra_data[extraDataKey]
   *  instead of a top-level column. Defaults: known ids map to columns
   *  (fullName/firstName/lastName→name, email→email, phone→phone). */
  extraDataKey?: string;
}

export interface InterviewRegistrationConfig {
  formTitle: string;
  formSubtitle: string;
  fields: InterviewRegistrationField[];
}

/* ── Steps ─────────────────────────────────────────────────────── */

export type InterviewStep =
  | InterviewSplashStep
  | InterviewRegistrationStep
  | InterviewQuestionStep
  | InterviewMultiSelectStep
  | InterviewDocumentsStep;

export interface InterviewSplashStep {
  type: 'splash';
  id: string;
  /** Pre-gradient title text, e.g. "Welcome to". */
  title: string;
  /** Highlighted gradient word, e.g. "Open Interviews.". */
  gradientWord: string;
  subtitle: string;
  buttonText: string;
}

export interface InterviewRegistrationStep {
  type: 'registration';
  id: string;
}

export interface InterviewAnswerOption {
  value: string;
  label: string;
  /** Optional lucide icon name. Defaults to a generic dot when omitted. */
  icon?: string;
}

export interface InterviewFollowUpField {
  /** Field id used as the key under sessions.extra_data. */
  id: string;
  label: string;
  placeholder: string;
  /** Renders the input only when the picked option's value matches. */
  showWhenValue: string;
  required?: boolean;
}

export interface InterviewQuestionStep {
  type: 'question';
  id: string;
  /** "Question 1 of 7" — renders above the title in a smaller eyebrow style. */
  stepLabel: string;
  title: string;
  options: InterviewAnswerOption[];
  /** Optional conditional text input. Value lands in sessions.extra_data. */
  followUpField?: InterviewFollowUpField;
}

export interface InterviewMultiSelectOption {
  value: string;
  label: string;
  /** Secondary line, e.g. "Machinery, Rental, Power" under "Houston". */
  sublabel?: string;
}

export interface InterviewMultiSelectStep {
  type: 'multi-select';
  id: string;
  stepLabel: string;
  title: string;
  subtitle?: string;
  options: InterviewMultiSelectOption[];
  /** Minimum picks required to advance. Default 1. */
  minSelected?: number;
}

export interface InterviewDocument {
  id: string;
  title: string;
  description: string;
  /** Absolute URL (PDF or web page). Renders as a card-style link. */
  url: string;
  /** Optional lucide icon name. Default 'file-text'. */
  icon?: string;
}

export interface InterviewDocumentsStep {
  type: 'documents';
  id: string;
  title: string;
  subtitle: string;
  documents: InterviewDocument[];
  /** When true, render the "Send Documents to Myself" CTA + dialog. */
  shareEnabled: boolean;
  /** Channels offered in the share dialog. */
  shareChannels: Array<'email' | 'text'>;
  /** View shown after the share form is submitted (success state copy). */
  postShare?: { title: string; subtitle: string };
}

/* ── Top-level Config ──────────────────────────────────────────── */

export interface InterviewConfig {
  id: string;
  name: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  formFactor?: FormFactor;
  branding: InterviewBranding;
  registration: InterviewRegistrationConfig;
  steps: InterviewStep[];
}

/* ── Runtime Session ───────────────────────────────────────────── */

export interface InterviewSession {
  currentStepIndex: number;
  currentStepId: string;
  /** Form values keyed by registration field id. */
  registrationData: Record<string, string>;
  /** Selected option values per step. Single-select stores a 1-elt array
   *  for shape parity with multi-select; serializer flattens identically. */
  answers: Record<string, string[]>;
  /** Conditional follow-up text values keyed by `followUpField.id`. */
  followUpValues: Record<string, string>;
  /** Document interactions: id → open time + accumulated dwell. */
  documentsViewed: Record<string, { openedAt: string; secondsViewed: number }>;
  /** Share-dialog result (recorded by the share endpoint, also mirrored here). */
  documentsSentTo?: {
    email?: string;
    sms?: string;
    channels: Array<'email' | 'text'>;
    at: string;
  };
  firstInteractionAt: string | null;
  lastInteractionAt: string | null;
  interactionCount: number;
}
