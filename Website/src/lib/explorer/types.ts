// Explorer Builder — Config Schema Types

// ─── Branding ────────────────────────────────────────

export interface ThemeColors {
  bg: string;
  bgGradient: string;
  surface: string;
  surfaceHover: string;
  border: string;
  borderFocus: string;
  text1: string;
  text2: string;
  text3: string;
  inputBg: string;
  inputText: string;
  inputPlaceholder: string;
  logoText: string;
  focusRing: string;
}

export interface BrandingConfig {
  logo: { dark: string; light: string };
  icon: string;
  colors: {
    primary: string;    // accent color (maps to --cyan/--teal)
    secondary: string;  // secondary accent (maps to --blue)
    teal: string;
    blue: string;
    deepBlue: string;
    navy: string;
    midnight: string;
    plum: string;
    bgDark: string;
    dark: ThemeColors;
    light: ThemeColors;
  };
  font: string;
  backgroundImage?: string;
  backgroundPattern?: 'dots' | 'grid' | 'hatching' | 'contour' | 'none';
  roleBackgrounds?: Record<string, string | { gradient?: string; image?: string; pattern?: string }>;
  auroraOrbs?: {
    orb1: string;
    orb2: string;
    orb3: string;
  };
  ctaGradient: string;
  ctaTextColor: string;
  gradientWord: string;
}

// ─── Registration ────────────────────────────────────

export interface RegistrationField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'select';
  placeholder: string;
  required: boolean;
  halfWidth: boolean;
  options?: string[];
}

export interface RegistrationConfig {
  modes: ('scan' | 'form' | 'search')[];
  defaultMode: 'scan' | 'form' | 'search';
  fields: RegistrationField[];
  formTitle: string;
  formSubtitle: string;
  scanLabel: string;
  scanHint: string;
  searchPlaceholder: string;
  optInText?: string;
  showLocaleButton: boolean;
  idleTimeoutMs: number;
  skipEnabled: boolean;
}

// ─── Steps ───────────────────────────────────────────

export interface TraitOption {
  value: string;
  label: string;
  icon: string;          // SVG string
  iconType: 'svg' | 'lucide' | 'image';
  backgroundImage?: string;
}

export type StepConfig =
  | SplashStepConfig
  | RegistrationStepConfig
  | TraitSelectionStepConfig
  | ResultsStepConfig
  | ContentLibraryStepConfig
  | SummaryStepConfig
  | ThankYouStepConfig;

export interface SplashStepConfig {
  type: 'splash';
  id: string;
  title: string;
  gradientWord: string;
  subtitle: string;
  buttonText: string;
  screensaver?: {
    type: 'video' | 'youtube' | 'vimeo' | 'image';
    url: string;
    idleTimeoutMs: number;
  };
}

export interface RegistrationStepConfig {
  type: 'registration';
  id: string;
}

export interface TraitSelectionStepConfig {
  type: 'trait-selection';
  id: string;
  selectionMode: 'single' | 'multi';
  title: string;
  subtitle: string;
  showGreeting: boolean;
  showSelectAll: boolean;
  options: TraitOption[];
  /** Maps option value → next step ID for branching */
  nextStepMapping?: Record<string, string>;
}

export interface ResultsTabConfig {
  id: string;
  label: string;
  icon: string;
  filters?: { label: string; value: string }[];
}

export interface ResultsStepConfig {
  type: 'results';
  id: string;
  title: string;
  subtitle: string;
  tabs: ResultsTabConfig[];
  cardsPerPage: number;
  defaultView: 'small' | 'medium' | 'large';
}

export interface ContentLibraryStepConfig {
  type: 'content-library';
  id: string;
  title: string;
  subtitle: string;
}

export interface SummaryStepConfig {
  type: 'summary';
  id: string;
  title: string;
  subtitle: string;
}

export interface ThankYouStepConfig {
  type: 'thank-you';
  id: string;
  title: string;
  subtitle: string;
  showNewSessionButton: boolean;
  showAddNotesButton: boolean;
}

// ─── Content ─────────────────────────────────────────

export interface ContentCard {
  id: string;
  title: string;
  description: {
    small: string;
    medium: string;
    large: string;
    overlay: string;
  };
  cardType: 'outcome' | 'learn' | 'solution';
  mediaType?: 'video' | 'pdf' | 'podcast' | 'website' | 'blog' | 'webinar' | 'whitepaper';
  url?: string;
  icon: string;
  iconType: 'svg' | 'lucide' | 'image';
  stat?: string;
  tags: string[];
  targetRoles?: string[];
  targetInterests?: string[];
}

// ─── Features ────────────────────────────────────────

export interface FeaturesConfig {
  screensaver: boolean;
  darkMode: boolean;
  lightMode: boolean;
  defaultTheme: 'dark' | 'light';
  briefcase: boolean;
  share: { email: boolean; text: boolean; qr: boolean };
  notes: boolean;
  voiceCapture: boolean;
  mediaCapture: boolean;
  calculator: boolean;
  captureInfo: boolean;
}

// ─── Top-level Config ────────────────────────────────

export interface ExplorerConfig {
  id: string;
  name: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  branding: BrandingConfig;
  registration: RegistrationConfig;
  steps: StepConfig[];
  content: ContentCard[];
  features: FeaturesConfig;
}

// ─── Session State (runtime) ─────────────────────────

export interface ExplorerSession {
  currentStepIndex: number;
  currentStepId: string;
  theme: 'dark' | 'light';
  mode: 'scan' | 'form' | 'search';
  visitorName: string;
  registeredEmail: string;
  registeredPhone: string;
  selectedRole: string | null;
  selectedInterests: string[];
  selectedTraits: Record<string, string[]>;
  savedCardIds: string[];
  activeTab: string;
  viewSize: 'small' | 'medium' | 'large';
  pageState: Record<string, number>;
  rolePath: 'top' | 'bottom' | null;
  leadTemp: 'hot' | 'warm' | 'cool' | 'cold' | null;
  notes: string;
  assignee: string | null;
}
