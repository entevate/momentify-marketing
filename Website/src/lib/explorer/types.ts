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
  /** When true, applies `filter: brightness(0)` to the logo on light theme.
   * Use when the light-mode logo asset is white-on-transparent and would otherwise be invisible. */
  invertLogoOnLight?: boolean;
  /** Optional per-config logo height in px. Overrides the locked 28px default in explorer.css. */
  logoHeight?: number;
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
  gradientWordLight?: string;
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
  /** Optional conditional-mapping hint. On a multi-select interests step,
   *  declares which role values this option is relevant for. Currently
   *  informational — consumed by ingest pipelines / template editors to
   *  build a role→interest graph for downstream filtering. The runtime
   *  shows every option regardless. */
  relevantRoles?: string[];
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
  /** Optional typewriter mode. When set, replaces the static gradientWord with a
   *  rotating typewriter that cycles through these words. The gradient cycles
   *  continuously across the 6 brand gradients via CSS animation. */
  typewriterWords?: string[];
  /** Optional override of the cycling gradient. If omitted, uses the Momentify
   *  6-stop brand cycle (action → violet → sol-teal → amber → indigo → crimson). */
  typewriterGradient?: string;
  /** Optional background image rendered behind the splash content (under the
   *  aurora orbs and brand gradient). Use a public asset path like
   *  `/brand/assets/mybg.jpg`. A dark overlay is applied automatically for
   *  readability — tune with `backgroundImageOverlay` if needed. */
  backgroundImage?: string;
  /** CSS background-position for `backgroundImage`. Defaults to `center`. */
  backgroundImagePosition?: string;
  /** Optional dark overlay color stacked on top of `backgroundImage` so the
   *  headline + CTA stay legible. Defaults to `rgba(0,0,0,0.55)`. */
  backgroundImageOverlay?: string;
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
  /** Layout for the option grid. 'grid' (default) uses the locked 4-col tablet /
   *  2-col mobile grid. 'list' renders a vertically-scrolling single-column list
   *  with shorter rows — best for long option sets (10+ items). */
  layout?: 'grid' | 'list';
  /** Override the grid column count. If set, takes precedence over `layout`.
   *  Pairs with `overflow-y: auto` so the grid scrolls when items overflow. */
  gridColumns?: number;
  /** When true, the step renders a pinned "Most Selected" row at the top
   *  showing the most popular options across all prior sessions. Backed by the
   *  /api/prototypes/trait-counts endpoint. Empty until enough data accrues. */
  showMostSelected?: boolean;
  /** How many "most selected" rows to pin. Default 3. */
  mostSelectedLimit?: number;
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

export type FormFactor = 'tablet' | 'mobile';

export interface ExplorerConfig {
  id: string;
  name: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  /**
   * Layout form factor. Selects between the locked tablet CSS (1366x1024 landscape)
   * and the locked mobile CSS (430x932 portrait). Default: 'tablet'.
   */
  formFactor?: FormFactor;
  /**
   * Template kind this prototype presents/ingests as. 'recruiter' is the
   * Technical Recruiting variant — identical Explorer runtime, but the
   * prototypes dashboard and Momentify Web label it "Recruiter" and ingest
   * creates a recruiter-kind template. Set when the intake's Solution Type
   * is Technical Recruiting. Default: 'explorer'.
   */
  kind?: 'explorer' | 'recruiter';
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
