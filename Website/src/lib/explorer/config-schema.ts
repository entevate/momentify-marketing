// Explorer Builder Config Schema
// Maps to template variables in explorer-template.html and explorer-template-kiosk.html

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
  focusRing: string;
}

export interface RegistrationField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'tel';
  placeholder: string;
  required: boolean;
  halfWidth: boolean;
}

export interface TraitOption {
  value: string;
  label: string;
  icon: string; // SVG path content
}

export interface SelectionStep {
  id: string;
  type: 'trait-selection';
  title: string;
  subtitle: string;
  selectionMode: 'single' | 'multi';
  showGreeting: boolean;
  showSelectAll: boolean;
  options: TraitOption[];
  nextStepMapping?: Record<string, string>;
}

export interface ContentDescription {
  small: string;
  medium: string;
  large: string;
  overlay: string;
}

export interface OutcomeCard {
  key: string;
  title: string;
  icon: string;
  description: ContentDescription;
}

export interface LearnCard {
  title: string;
  type: 'blog' | 'webinar' | 'podcast' | 'whitepaper' | 'video' | 'website';
  roles: string[];
  objectives: string[];
  url: string;
  description: ContentDescription;
}

export interface SolutionCard {
  id: string;
  title: string;
  icon: string;
  industries: string;
  description: ContentDescription;
}

export interface QuickLink {
  label: string;
  url: string;
  icon?: string;
}

export interface ExplorerConfig {
  id: string;
  name: string;
  version: number;
  createdAt: string;
  updatedAt: string;

  branding: {
    logo: { dark: string; light: string };
    icon: string;
    companyName: string;
    colors: {
      primary: string;
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
    backgroundPattern: 'dots-grid-contour' | 'dots-grid' | 'dots' | 'none';
    backgroundImage?: string;
    auroraOrbs: { orb1: string; orb2: string; orb3: string };
    ctaGradient: string;
    ctaTextColor: string;
    gradientWord: string;
    roleBackgrounds: Record<string, string>;
  };

  splash: {
    title: string;
    gradientWord: string;
    subtitle: string;
    buttonText: string;
  };

  registration: {
    modes: ('form' | 'search' | 'scan')[];
    defaultMode: 'form' | 'search' | 'scan';
    formTitle: string;
    formSubtitle: string;
    scanLabel: string;
    scanHint: string;
    searchPlaceholder: string;
    fields: RegistrationField[];
    optInText: string;
    showLocaleButton: boolean;
    skipEnabled: boolean;
    idleTimeoutMs: number;
  };

  steps: SelectionStep[];

  branching: {
    topRoles: string[];
    topPathSteps: string[];
    bottomPathSteps: string[];
  };

  content: {
    outcomes: OutcomeCard[];
    learnCards: LearnCard[];
    solutions: SolutionCard[];
  };

  features: {
    darkMode: boolean;
    lightMode: boolean;
    defaultTheme: 'dark' | 'light';
    briefcase: boolean;
    share: { email: boolean; text: boolean; qr: boolean };
    notes: boolean;
    voiceCapture: boolean;
    mediaCapture: boolean;
    captureInfo: boolean;
    contentLibrary: boolean;
    quickLinks: QuickLink[];
  };

  thankYou: {
    title: string;
    subtitle: string;
    showNewSession: boolean;
    showAddNotes: boolean;
  };
}

export const DEFAULT_CONFIG: ExplorerConfig = {
  id: '',
  name: 'New Explorer',
  version: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  branding: {
    logo: { dark: '/brand/assets/Momentify-Logo_Reverse.svg', light: '/brand/assets/Momentify-Logo.svg' },
    icon: '/brand/assets/Momentify-Icon.svg',
    companyName: 'Momentify',
    colors: {
      primary: '#0CF4DF',
      teal: '#00BBA5',
      blue: '#254FE5',
      deepBlue: '#1F3395',
      navy: '#1A2E73',
      midnight: '#0B0B3C',
      plum: '#7C316D',
      bgDark: '#07081F',
      dark: {
        bg: '#07081F',
        bgGradient: 'linear-gradient(135deg, #7C316D 0%, #0B0B3C 55%, #1A2E73 100%)',
        surface: 'rgba(255,255,255,0.06)',
        surfaceHover: 'rgba(255,255,255,0.10)',
        border: 'rgba(255,255,255,0.12)',
        borderFocus: '#0CF4DF',
        text1: '#FFFFFF',
        text2: 'rgba(255,255,255,0.75)',
        text3: 'rgba(255,255,255,0.50)',
        inputBg: 'rgba(255,255,255,0.08)',
        inputText: '#FFFFFF',
        inputPlaceholder: 'rgba(255,255,255,0.40)',
        focusRing: 'rgba(12,244,223,0.15)',
      },
      light: {
        bg: '#F0F2F8',
        bgGradient: 'linear-gradient(160deg, #ECEEF6 0%, #F0F2F8 40%, #EAECF5 100%)',
        surface: 'rgba(255,255,255,0.55)',
        surfaceHover: 'rgba(255,255,255,0.75)',
        border: 'rgba(6,19,65,0.08)',
        borderFocus: '#00BBA5',
        text1: '#061341',
        text2: 'rgba(6,19,65,0.60)',
        text3: 'rgba(6,19,65,0.42)',
        inputBg: 'rgba(255,255,255,0.8)',
        inputText: '#061341',
        inputPlaceholder: 'rgba(6,19,65,0.35)',
        focusRing: 'rgba(0,187,165,0.12)',
      },
    },
    font: "'Inter', -apple-system, sans-serif",
    backgroundPattern: 'dots-grid-contour',
    auroraOrbs: { orb1: 'rgba(12,244,223,0.12)', orb2: 'rgba(37,79,229,0.15)', orb3: 'rgba(124,49,109,0.1)' },
    ctaGradient: 'linear-gradient(135deg, #00BBA5, #1A56DB)',
    ctaTextColor: '#FFFFFF',
    gradientWord: 'linear-gradient(135deg, #0CF4DF, #254FE5)',
    roleBackgrounds: {
      executive: 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(124,49,109,0.45) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 15% 15%, rgba(31,51,149,0.3) 0%, transparent 55%)',
      vp: 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(31,51,149,0.4) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 85% 15%, rgba(0,187,165,0.25) 0%, transparent 55%)',
      manager: 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(0,187,165,0.35) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 15% 25%, rgba(12,244,223,0.2) 0%, transparent 55%)',
      engineer: 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(37,79,229,0.4) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 85% 25%, rgba(12,244,223,0.3) 0%, transparent 55%)',
      purchasing: 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(0,187,165,0.35) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 25% 15%, rgba(124,49,109,0.25) 0%, transparent 55%)',
      operations: 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(12,244,223,0.3) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 75% 15%, rgba(31,51,149,0.35) 0%, transparent 55%)',
      student: 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(37,79,229,0.35) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 15% 15%, rgba(124,49,109,0.3) 0%, transparent 55%)',
      other: 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(124,49,109,0.3) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 85% 25%, rgba(0,187,165,0.2) 0%, transparent 55%)',
    },
  },
  splash: {
    title: 'Empower Every',
    gradientWord: 'Moment.',
    subtitle: 'Discover personalized outcomes, content, and solutions tailored to your needs.',
    buttonText: 'Tap to Begin',
  },
  registration: {
    modes: ['scan', 'form', 'search'],
    defaultMode: 'scan',
    formTitle: 'Tell us about yourself',
    formSubtitle: 'Please fill in the form to continue.',
    scanLabel: 'Please Scan Your Badge',
    scanHint: 'Hold the QR code in front of the camera',
    searchPlaceholder: 'Search by last name...',
    fields: [
      { id: 'firstName', label: 'First Name', type: 'text', placeholder: 'First name', required: true, halfWidth: true },
      { id: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Last name', required: true, halfWidth: true },
      { id: 'email', label: 'Email', type: 'email', placeholder: 'name@company.com', required: true, halfWidth: true },
      { id: 'phone', label: 'Phone', type: 'tel', placeholder: '(555) 555-5555', required: false, halfWidth: true },
      { id: 'company', label: 'Company', type: 'text', placeholder: 'Company', required: false, halfWidth: true },
    ],
    optInText: 'By submitting this form, you agree to receive personalized content and communications based on your selections.',
    showLocaleButton: true,
    skipEnabled: true,
    idleTimeoutMs: 10000,
  },
  steps: [],
  branching: { topRoles: [], topPathSteps: [], bottomPathSteps: [] },
  content: { outcomes: [], learnCards: [], solutions: [] },
  features: {
    darkMode: true,
    lightMode: true,
    defaultTheme: 'dark',
    briefcase: true,
    share: { email: true, text: true, qr: true },
    notes: true,
    voiceCapture: true,
    mediaCapture: true,
    captureInfo: true,
    contentLibrary: true,
    quickLinks: [],
  },
  thankYou: {
    title: 'Thank you, {name}!',
    subtitle: 'Your personalized content will be sent to you shortly.',
    showNewSession: true,
    showAddNotes: true,
  },
};
