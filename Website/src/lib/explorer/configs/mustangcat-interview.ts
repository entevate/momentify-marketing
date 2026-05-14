// Explorer Config: Mustang Cat Technician Open Interview
// Walk-in technician interview kiosk for Mustang Cat, Houston's
// Caterpillar dealer. Survey-style flow (no content cards / results tab):
// Splash → Registration → 6 question screens → Thank-you.
//
// Source prototype: ~/Development/Momentify/Brand/mustangcat-interview.html
// Brand colors mirror the prototype: dark theme, CAT yellow accent (#FFCC00).

import type { ExplorerConfig, ThemeColors } from '../types';

// Subtle dot pattern overlay layered above the gradient — same trick
// Carter Machinery uses so the deep-black background doesn't feel flat.
const MUSTANG_DOTS_DARK = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='1.2' fill='%23FFCC00' fill-opacity='0.10'/%3E%3C/svg%3E\")";
const MUSTANG_DOTS_LIGHT = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='1.2' fill='%231A1A1A' fill-opacity='0.09'/%3E%3C/svg%3E\")";

const MUSTANG_DARK: ThemeColors = {
  bg: '#0A0A0A',
  bgGradient: `${MUSTANG_DOTS_DARK} repeat, linear-gradient(135deg, #1A1A1A 0%, #0A0A0A 55%, #2A2A2A 100%)`,
  surface: 'rgba(255,255,255,0.06)',
  surfaceHover: 'rgba(255,255,255,0.10)',
  border: 'rgba(255,255,255,0.12)',
  borderFocus: '#FFCC00',
  text1: '#FFFFFF',
  text2: 'rgba(255,255,255,0.75)',
  text3: 'rgba(255,255,255,0.50)',
  inputBg: 'rgba(255,255,255,0.08)',
  inputText: '#FFFFFF',
  inputPlaceholder: 'rgba(255,255,255,0.40)',
  logoText: '#FFFFFF',
  focusRing: 'rgba(255,204,0,0.20)',
};

const MUSTANG_LIGHT: ThemeColors = {
  bg: '#F4F5F9',
  bgGradient: `${MUSTANG_DOTS_LIGHT} repeat, linear-gradient(180deg, #F4F5F9 0%, #F2F3F8 100%)`,
  surface: 'rgba(255,255,255,0.85)',
  surfaceHover: 'rgba(255,255,255,0.95)',
  border: 'rgba(15,23,42,0.10)',
  borderFocus: '#1A1A1A',
  text1: '#0F172A',
  text2: 'rgba(15,23,42,0.65)',
  text3: 'rgba(15,23,42,0.45)',
  inputBg: '#FFFFFF',
  inputText: '#0F172A',
  inputPlaceholder: 'rgba(15,23,42,0.35)',
  logoText: '#0F172A',
  focusRing: 'rgba(26,26,26,0.12)',
};

export const MUSTANGCAT_INTERVIEW_CONFIG: ExplorerConfig = {
  id: 'mustangcat-interview',
  name: 'Mustang Cat Technician Open Interview',
  version: 1,
  createdAt: '2026-05-14T00:00:00.000Z',
  updatedAt: '2026-05-14T00:00:00.000Z',

  branding: {
    logo: {
      dark: '/logos/mustang-cat.png',
      light: '/logos/mustang-cat-color.png',
    },
    icon: '/logos/mustang-cat.png',
    colors: {
      primary: '#FFCC00',
      secondary: '#000000',
      teal: '#FFD633',
      blue: '#FFB800',
      deepBlue: '#404040',
      navy: '#1A1A1A',
      midnight: '#0A0A0A',
      plum: '#FF8C00',
      bgDark: '#0A0A0A',
      dark: MUSTANG_DARK,
      light: MUSTANG_LIGHT,
    },
    font: "'Inter', -apple-system, sans-serif",
    backgroundPattern: 'none',
    auroraOrbs: {
      orb1: 'rgba(255,204,0,0.16)',
      orb2: 'rgba(255,140,0,0.14)',
      orb3: 'rgba(255,184,0,0.12)',
    },
    ctaGradient: 'linear-gradient(135deg, #FFCC00, #FFB800)',
    ctaTextColor: '#000000',
    gradientWord: 'linear-gradient(135deg, #FFCC00, #FF8C00)',
    gradientWordLight: 'linear-gradient(135deg, #B8930A, #FF8C00)',
  },

  registration: {
    modes: ['form'],
    defaultMode: 'form',
    formTitle: 'Contact Information',
    formSubtitle: 'We will use this to follow up with you.',
    scanLabel: '',
    scanHint: '',
    searchPlaceholder: '',
    optInText: '',
    showLocaleButton: false,
    idleTimeoutMs: 0,
    skipEnabled: false,
    fields: [
      // mapsTo is auto-inferred by fan-gallery's explorer kind module
      // for these standard ids (firstName + lastName → name, email →
      // email, phone → phone). Source: src/lib/templates/kinds/explorer.tsx.
      { id: 'firstName', label: 'First Name', type: 'text', placeholder: 'First name', required: true, halfWidth: true },
      { id: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Last name', required: true, halfWidth: true },
      { id: 'email', label: 'Email Address', type: 'email', placeholder: 'you@email.com', required: true, halfWidth: false },
      { id: 'phone', label: 'Phone Number', type: 'tel', placeholder: '(555) 555-5555', required: true, halfWidth: false },
    ],
  },

  steps: [
    {
      type: 'splash',
      id: 'welcome',
      title: 'Welcome to',
      gradientWord: 'Open Interviews.',
      subtitle: 'Thank you for coming in today. Please tap "Begin" below to get started.',
      buttonText: 'Tap to Begin',
    },
    {
      type: 'registration',
      id: 'registration',
    },
    {
      type: 'trait-selection',
      id: 'q1-interviewed',
      selectionMode: 'single',
      title: 'Have you interviewed with Mustang Cat within the last 6 months?',
      subtitle: 'Question 1 of 7',
      showGreeting: false,
      showSelectAll: false,
      options: [
        { value: 'yes', label: 'Yes', icon: 'check-circle-2', iconType: 'lucide' },
        { value: 'no', label: 'No', icon: 'x-circle', iconType: 'lucide' },
      ],
    },
    {
      type: 'trait-selection',
      id: 'q2-application',
      selectionMode: 'single',
      title: 'Have you already filled out an application with Mustang Cat?',
      subtitle: 'Question 2 of 7',
      showGreeting: false,
      showSelectAll: false,
      options: [
        { value: 'yes', label: 'Yes', icon: 'check-circle-2', iconType: 'lucide' },
        { value: 'no', label: 'No', icon: 'x-circle', iconType: 'lucide' },
      ],
    },
    {
      type: 'trait-selection',
      id: 'q3-technician',
      selectionMode: 'single',
      title: 'Are you applying for a technician/mechanic position?',
      subtitle: 'Question 3 of 7',
      showGreeting: false,
      showSelectAll: false,
      options: [
        { value: 'yes', label: 'Yes', icon: 'check-circle-2', iconType: 'lucide' },
        { value: 'no', label: 'No', icon: 'x-circle', iconType: 'lucide' },
      ],
    },
    {
      type: 'trait-selection',
      id: 'q4-tools',
      selectionMode: 'single',
      title: 'Do you have your own basic mechanic tools?',
      subtitle: 'Question 4 of 7',
      showGreeting: false,
      showSelectAll: false,
      options: [
        { value: 'yes', label: 'Yes', icon: 'check-circle-2', iconType: 'lucide' },
        { value: 'no', label: 'No', icon: 'x-circle', iconType: 'lucide' },
        { value: 'some', label: 'Some, but not a complete set', icon: 'wrench', iconType: 'lucide' },
      ],
    },
    {
      type: 'trait-selection',
      id: 'q5-cat-experience',
      selectionMode: 'single',
      title: 'Do you have CAT (Caterpillar) specific experience?',
      subtitle: 'Question 5 of 7',
      showGreeting: false,
      showSelectAll: false,
      options: [
        { value: 'yes', label: 'Yes', icon: 'check-circle-2', iconType: 'lucide' },
        { value: 'no', label: 'No', icon: 'x-circle', iconType: 'lucide' },
      ],
    },
    {
      type: 'trait-selection',
      id: 'q5b-referral',
      selectionMode: 'single',
      title: 'Were you referred by a current Mustang Cat employee?',
      subtitle: 'Question 6 of 7',
      showGreeting: false,
      showSelectAll: false,
      options: [
        { value: 'yes', label: 'Yes', icon: 'user-plus', iconType: 'lucide' },
        { value: 'no', label: 'No', icon: 'user', iconType: 'lucide' },
      ],
    },
    {
      type: 'trait-selection',
      id: 'q6-locations',
      selectionMode: 'multi',
      title: 'Which Mustang Cat locations are you most interested in?',
      subtitle: 'Question 7 of 7 — Select all that apply',
      showGreeting: false,
      showSelectAll: false,
      options: [
        { value: 'houston', label: 'Houston — Machinery, Rental, Power', icon: 'map-pin', iconType: 'lucide' },
        { value: 'beaumont', label: 'Beaumont — Machinery, Rental', icon: 'map-pin', iconType: 'lucide' },
        { value: 'bryan', label: 'Bryan — Machinery, Rental', icon: 'map-pin', iconType: 'lucide' },
        { value: 'elcampo', label: 'El Campo — Machinery, Rental', icon: 'map-pin', iconType: 'lucide' },
        { value: 'lufkin', label: 'Lufkin — Machinery, Rental', icon: 'map-pin', iconType: 'lucide' },
        { value: 'hempstead', label: 'Hempstead — Machinery, Power', icon: 'map-pin', iconType: 'lucide' },
        { value: 'tomball', label: 'Tomball — Power', icon: 'map-pin', iconType: 'lucide' },
        { value: 'waller', label: 'Waller — Power', icon: 'map-pin', iconType: 'lucide' },
        { value: 'channelview', label: 'Channelview — Rental', icon: 'map-pin', iconType: 'lucide' },
        { value: 'deer-park', label: 'Deer Park — Rental', icon: 'map-pin', iconType: 'lucide' },
        { value: 'league-city', label: 'League City — Rental', icon: 'map-pin', iconType: 'lucide' },
        { value: 'angleton', label: 'Angleton — Rental', icon: 'map-pin', iconType: 'lucide' },
        { value: 'missouri-city', label: 'Southwest / Missouri City — Rental', icon: 'map-pin', iconType: 'lucide' },
      ],
    },
    {
      type: 'thank-you',
      id: 'thanks',
      title: 'Thank You!',
      subtitle: 'Thank you for coming to Open Interviews. A member of our team will be with you shortly.',
      showNewSessionButton: true,
      showAddNotesButton: true,
    },
  ],

  content: [],

  features: {
    screensaver: false,
    darkMode: true,
    lightMode: true,
    defaultTheme: 'dark',
    briefcase: false,
    share: { email: false, text: false, qr: false },
    notes: true,
    voiceCapture: false,
    mediaCapture: false,
    calculator: false,
    captureInfo: true,
  },
};
