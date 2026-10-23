// Shared branding for the Blanchard Machinery recruiter templates
// (Job Fairs + Technician Recruiting). Blanchard is the authorized Cat
// dealer for South Carolina. Site palette: Cat yellow #FFC820 + near-black
// #0E0E10. Site fonts: Oswald (headings, not loadable) and Roboto (body,
// loadable) → Roboto.

import type { ExplorerConfig, ThemeColors } from '../types';

const BLANCHARD_DARK: ThemeColors = {
  bg: '#0B0B0C',
  bgGradient: 'linear-gradient(135deg, #1C1708 0%, #121210 55%, #0B0B0C 100%)',
  surface: 'rgba(255,255,255,0.06)',
  surfaceHover: 'rgba(255,255,255,0.10)',
  border: 'rgba(255,255,255,0.12)',
  borderFocus: '#FFC820',
  text1: '#FFFFFF',
  text2: 'rgba(255,255,255,0.78)',
  text3: 'rgba(255,255,255,0.52)',
  inputBg: 'rgba(255,255,255,0.08)',
  inputText: '#FFFFFF',
  inputPlaceholder: 'rgba(255,255,255,0.40)',
  logoText: '#FFFFFF',
  focusRing: 'rgba(255,200,32,0.25)',
};

const BLANCHARD_LIGHT: ThemeColors = {
  bg: '#F6F5F1',
  bgGradient: 'linear-gradient(180deg, #F8F7F3 0%, #F2F0EA 100%)',
  surface: 'rgba(255,255,255,0.92)',
  surfaceHover: 'rgba(255,255,255,1.00)',
  border: 'rgba(14,14,16,0.10)',
  // Cat yellow is too light for focus rings/text on white; deep gold.
  borderFocus: '#9C7400',
  text1: '#0E0E10',
  text2: 'rgba(14,14,16,0.66)',
  text3: 'rgba(14,14,16,0.45)',
  inputBg: '#FFFFFF',
  inputText: '#0E0E10',
  inputPlaceholder: 'rgba(14,14,16,0.36)',
  logoText: '#0E0E10',
  focusRing: 'rgba(156,116,0,0.15)',
};

const yellowGlow = (a: number, b: number, x: number, y: number) =>
  `radial-gradient(ellipse 90% 70% at 50% 70%, rgba(255,200,32,${a}) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at ${x}% ${y}%, rgba(156,116,0,${b}) 0%, transparent 55%)`;

export const BLANCHARD_BRANDING: ExplorerConfig['branding'] = {
  logo: {
    // Self-contained yellow/black badge reads on dark and light.
    dark: '/brand/assets/blanchard-machinery-logo.svg',
    light: '/brand/assets/blanchard-machinery-logo.svg',
  },
  // Badge is 276x75 (~3.7:1); 34px matches other wide lockups.
  logoHeight: 34,
  icon: '/brand/assets/blanchard-machinery-icon.svg',
  colors: {
    primary: '#FFC820',
    secondary: '#0E0E10',
    teal: '#FFC820',
    blue: '#3D3D3D',
    deepBlue: '#1A1A1A',
    navy: '#15140F',
    midnight: '#0B0B0C',
    plum: '#9C7400',
    bgDark: '#0B0B0C',
    dark: BLANCHARD_DARK,
    light: BLANCHARD_LIGHT,
  },
  font: 'Roboto',
  backgroundPattern: 'none',
  auroraOrbs: {
    orb1: 'rgba(255,200,32,0.14)',
    orb2: 'rgba(255,200,32,0.10)',
    orb3: 'rgba(156,116,0,0.12)',
  },
  ctaGradient: 'linear-gradient(135deg, #FFC820, #E0A800)',
  ctaTextColor: '#0E0E10',
  gradientWord: '#FFC820',
  roleBackgrounds: {},
};

/** Builds per-role glows for a list of role values so each role feels
 *  like its own chapter without hand-writing every gradient. */
export function blanchardRoleBackgrounds(roles: string[]): Record<string, string> {
  const spots: Array<[number, number, number, number]> = [
    [0.16, 0.10, 15, 15], [0.14, 0.12, 85, 15], [0.12, 0.14, 25, 15],
    [0.16, 0.10, 85, 25], [0.14, 0.12, 15, 25], [0.12, 0.10, 75, 15],
    [0.12, 0.08, 85, 25],
  ];
  return Object.fromEntries(roles.map((r, i) => [r, yellowGlow(...spots[i % spots.length])]));
}

export const BLANCHARD_FEATURES: ExplorerConfig['features'] = {
  screensaver: false,
  darkMode: true,
  lightMode: true,
  defaultTheme: 'dark',
  briefcase: true,
  share: { email: true, text: true, qr: true },
  notes: true,
  voiceCapture: true,
  mediaCapture: true,
  calculator: false,
  captureInfo: true,
};

export const BLANCHARD_REGISTRATION: ExplorerConfig['registration'] = {
  modes: ['form', 'scan', 'search'],
  defaultMode: 'form',
  formTitle: 'Join the Blanchard Team',
  formSubtitle: 'Share your info and our recruiting team will follow up with openings and next steps.',
  scanLabel: 'Scan Your QR Code',
  scanHint: 'Hold your QR code in front of the camera',
  searchPlaceholder: 'Search by last name...',
  optInText: 'Marketing Communication: by sharing your information you consent to Blanchard Machinery processing your data to fulfill your request and send relevant follow-up communications about careers and openings. Message and data rates may apply; reply STOP to opt out of texts.',
  showLocaleButton: false,
  idleTimeoutMs: 10000,
  skipEnabled: true,
  fields: [
    { id: 'firstName', label: 'First Name', type: 'text', placeholder: 'First name', required: true, halfWidth: true },
    { id: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Last name', required: true, halfWidth: true },
    { id: 'email', label: 'Email', type: 'email', placeholder: 'name@example.com', required: true, halfWidth: true },
    { id: 'phone', label: 'Phone', type: 'tel', placeholder: '(555) 555-5555', required: false, halfWidth: true },
    { id: 'company', label: 'School / Current Employer', type: 'text', placeholder: 'School or employer (optional)', required: false, halfWidth: true },
    { id: 'title', label: 'Position of Interest', type: 'text', placeholder: 'Role you\'re interested in (optional)', required: false, halfWidth: true },
  ],
};

export const BLANCHARD_LINKS = {
  careers: 'https://www.blanchardmachinery.com/about/careers/',
  technicianCareers: 'https://www.blanchardmachinery.com/about/careers/technician-careers/',
  benefits: 'https://www.blanchardmachinery.com/about/careers/employee-benefits/',
  thinkBig: 'https://www.blanchardmachinery.com/about/careers/think-big/',
  thinkBigHeavy: 'https://www.blanchardmachinery.com/about/careers/think-big/heavy-equipment/',
  thinkBigPower: 'https://www.blanchardmachinery.com/about/careers/think-big/electrical-power/',
  thinkBigChecklists: 'https://www.blanchardmachinery.com/about/careers/think-big/heavy-equipment/checklists/',
  thinkBigFaqs: 'https://www.blanchardmachinery.com/about/careers/think-big/heavy-equipment/faqs',
  thinkBigCurriculum: 'https://www.blanchardmachinery.com/about/careers/think-big/heavy-equipment/sample-curriculum',
  techTraining: 'https://www.blanchardmachinery.com/training/technician-training/',
  // iCIMS: careers2 = technician + transport driver postings; careers = admin, sales, parts & service ops.
  applyTech: 'https://careers2-blanchard.icims.com/jobs/search',
  applyMarine: 'https://careers2-blanchard.icims.com/jobs/search?ss=1&searchCategory=26867',
  applyCorporate: 'https://careers-blanchard.icims.com/jobs/search',
  techVideo: 'https://www.youtube.com/watch?v=36y3ycHDknE',
  roadToSuccess: 'https://www.blanchardmachinery.com/wp-content/uploads/2022/12/Your-Road-To-Success-MP4-Original.mp4',
  youtube: 'https://www.youtube.com/@Blanchardmachinery',
};

export const BLANCHARD_HISTORY = {
  small: 'South Carolina\'s authorized Cat dealer, building partnerships since 1982.',
  medium: 'Blanchard Machinery is the authorized Caterpillar dealer for South Carolina, providing equipment, parts, and service since 1982.',
  large: 'Blanchard Machinery is a leading provider of equipment, parts, and service solutions across South Carolina. As the state\'s authorized Cat dealer, we support construction, mining, forestry, power generation, and agriculture.',
  overlay: 'Blanchard Machinery is a leading provider of equipment, parts, and service solutions across South Carolina. As the authorized Caterpillar (CAT) dealer for the state, we support a wide range of industries including construction, mining, forestry, power generation, and agriculture. With decades of experience and a commitment to excellence, Blanchard offers new and used equipment sales, rental services, maintenance and repair, and advanced technology solutions. At Blanchard, we don\'t just sell machines; we build partnerships that power progress across the communities we serve.',
};
