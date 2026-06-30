// Explorer Config — Essntl Wellness (Essntl Supplements)
// Physician-supervised hormone restoration and metabolic performance
// telehealth clinic — GLP-1 weight loss, TRT/HRT, peptide therapy,
// and NAD+ longevity programs. FDA-regulated GLP-1s sourced from
// 503A pharmacies; peptides from US-licensed manufacturers.
// Brand: warm taupe (#918974) + black, clinical-luxury feel.

import type { ExplorerConfig, ThemeColors } from '../types';

const ESSNTL_DARK: ThemeColors = {
  // Brand-tinted near-black UI tones derived from the warm taupe hue
  // so dialog backgrounds and the Tools menu feel distinctly ESSNTL
  // rather than generic dark mode.
  bg: '#0C0B09',
  bgGradient: 'linear-gradient(135deg, #1A1814 0%, #100F0C 55%, #0C0B09 100%)',
  surface: 'rgba(255,255,255,0.06)',
  surfaceHover: 'rgba(255,255,255,0.10)',
  border: 'rgba(255,255,255,0.12)',
  borderFocus: '#BFA980',
  text1: '#FFFFFF',
  text2: 'rgba(255,255,255,0.78)',
  text3: 'rgba(255,255,255,0.52)',
  inputBg: 'rgba(255,255,255,0.08)',
  inputText: '#FFFFFF',
  inputPlaceholder: 'rgba(255,255,255,0.40)',
  logoText: '#FFFFFF',
  focusRing: 'rgba(145,137,116,0.28)',
};

const ESSNTL_LIGHT: ThemeColors = {
  // Light theme — warm off-white that lets the taupe accent read as
  // clinical-luxury rather than clinical-cold.
  bg: '#FAF9F6',
  bgGradient: 'linear-gradient(180deg, #FAF9F6 0%, #F3F1EC 100%)',
  surface: 'rgba(255,255,255,0.90)',
  surfaceHover: 'rgba(255,255,255,0.98)',
  border: 'rgba(20,18,14,0.12)',
  borderFocus: '#6B6354',
  text1: '#141209',
  text2: 'rgba(20,18,14,0.70)',
  text3: 'rgba(20,18,14,0.45)',
  inputBg: '#FFFFFF',
  inputText: '#141209',
  inputPlaceholder: 'rgba(20,18,14,0.40)',
  logoText: '#141209',
  focusRing: 'rgba(145,137,116,0.18)',
};

export const ESSNTL_SUPPLEMENTS_CONFIG: ExplorerConfig = {
  id: 'essntl-supplements',
  name: 'Essntl Wellness Explorer',
  version: 1,
  createdAt: '2026-06-30T00:00:00.000Z',
  updatedAt: '2026-06-30T00:00:00.000Z',

  branding: {
    logo: {
      dark: '/brand/assets/essntl-supplements-logo-reverse.png',  // white wordmark for dark bg
      light: '/brand/assets/essntl-supplements-logo.png',         // black/taupe wordmark for light bg
    },
    // Stacked lockup (bars icon + ESSNTL wordmark + WELLNESS subtitle),
    // 542x215 (~2.5:1) trimmed. 60px keeps all three elements legible
    // at kiosk distance without crowding the top bar.
    logoHeight: 60,
    icon: '/brand/assets/essntl-supplements-icon.png',
    colors: {
      primary: '#918974',   // ESSNTL warm taupe — main accent
      secondary: '#000000', // ESSNTL black — second anchor
      teal: '#BFA980',      // brighter warm sand for hover/focus on dark
      blue: '#918974',
      deepBlue: '#6B6354',
      // midnight + navy drive dialog backgrounds + overlay backdrop.
      // Both pulled from the warm-taupe hue so dialogs stay on-brand.
      navy: '#1A1814',
      midnight: '#0C0B09',
      plum: '#3A2A1F',      // deep warm brown — complements the taupe
      bgDark: '#0C0B09',
      dark: ESSNTL_DARK,
      light: ESSNTL_LIGHT,
    },
    // Detected brand font is "Albert Sans" (computed style across h1/h2/p/a/
    // button on shop.essntlsupplements.com). Not in Momentify Web's curated
    // loadable set, so using the closest geometric-sans match, Plus Jakarta Sans.
    font: "'Plus Jakarta Sans', -apple-system, sans-serif",
    backgroundPattern: 'none',
    auroraOrbs: {
      orb1: 'rgba(145,137,116,0.20)',  // taupe
      orb2: 'rgba(191,169,128,0.16)',  // bright sand
      orb3: 'rgba(58,42,31,0.14)',     // deep brown
    },
    // CTA = deep taupe → deep brown (darker stops keep white CTA text legible)
    ctaGradient: 'linear-gradient(135deg, #6B6354 0%, #3A2A1F 100%)',
    ctaTextColor: '#FFFFFF',
    // Headline gradient: light sand → bright warm gold pops on the dark splash
    gradientWord: 'linear-gradient(135deg, #E8DFC8 0%, #BFA980 100%)',
    // Per-role glows: each role lands on a slightly different taupe /
    // sand / brown mix so navigating roles feels like chapters.
    roleBackgrounds: {
      'weight-loss': 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(145,137,116,0.30) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 15% 15%, rgba(191,169,128,0.18) 0%, transparent 55%)',
      'trt-hrt': 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(107,99,84,0.28) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 85% 15%, rgba(145,137,116,0.18) 0%, transparent 55%)',
      'peptide-therapy': 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(191,169,128,0.24) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 25% 15%, rgba(145,137,116,0.16) 0%, transparent 55%)',
      'longevity': 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(145,137,116,0.26) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 85% 25%, rgba(58,42,31,0.14) 0%, transparent 55%)',
      'athlete-performance': 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(191,169,128,0.22) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 15% 25%, rgba(107,99,84,0.16) 0%, transparent 55%)',
      'busy-professional': 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(107,99,84,0.22) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 75% 15%, rgba(191,169,128,0.14) 0%, transparent 55%)',
      'provider-partner': 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(58,42,31,0.24) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 85% 25%, rgba(145,137,116,0.16) 0%, transparent 55%)',
      'browsing': 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(145,137,116,0.16) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 15% 15%, rgba(191,169,128,0.10) 0%, transparent 55%)',
    },
  },

  registration: {
    modes: ['form', 'scan', 'search'],
    defaultMode: 'form',
    formTitle: 'Welcome to Essntl Wellness',
    formSubtitle: 'Share a quick intro so we can tailor your visit.',
    scanLabel: 'Scan Your Badge',
    scanHint: 'Hold the QR code in front of the camera',
    searchPlaceholder: 'Search by last name...',
    optInText: 'By sharing your information you consent to Essntl Wellness processing your data to follow up about programs, pricing, and scheduling a physician consultation.',
    showLocaleButton: false,
    idleTimeoutMs: 10000,
    skipEnabled: true,
    fields: [
      { id: 'firstName', label: 'First Name', type: 'text', placeholder: 'First name', required: true, halfWidth: true },
      { id: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Last name', required: true, halfWidth: true },
      { id: 'email', label: 'Email', type: 'email', placeholder: 'name@email.com', required: true, halfWidth: true },
      { id: 'phone', label: 'Phone', type: 'tel', placeholder: '(555) 555-5555', required: false, halfWidth: true },
      { id: 'company', label: 'Company', type: 'text', placeholder: 'Company (optional)', required: false, halfWidth: true },
      { id: 'title', label: 'Title', type: 'text', placeholder: 'Your role (optional)', required: false, halfWidth: true },
    ],
  },

  steps: [
    {
      type: 'splash',
      id: 'welcome',
      title: 'This Is Where',
      gradientWord: 'Results Begin.',
      subtitle: 'Physician-supervised hormone restoration and metabolic performance, built around you. GLP-1 weight loss, TRT/HRT, peptide therapy, and longevity programs — all medically supervised. Tap to begin.',
      buttonText: 'Tap to Begin',
    },
    {
      type: 'registration',
      id: 'registration',
    },
    {
      type: 'trait-selection',
      id: 'role',
      selectionMode: 'single',
      title: 'What brings you to Essntl?',
      subtitle: 'Select the option that fits you best.',
      showGreeting: true,
      showSelectAll: false,
      options: [
        { value: 'weight-loss', label: 'Weight Loss', icon: 'scale', iconType: 'lucide' },
        { value: 'trt-hrt', label: 'TRT / HRT', icon: 'activity', iconType: 'lucide' },
        { value: 'peptide-therapy', label: 'Peptide Therapy', icon: 'flask-conical', iconType: 'lucide' },
        { value: 'longevity', label: 'Longevity & Vitality', icon: 'sparkles', iconType: 'lucide' },
        { value: 'athlete-performance', label: 'Athlete / Performance', icon: 'zap', iconType: 'lucide' },
        { value: 'busy-professional', label: 'Busy Professional', icon: 'briefcase', iconType: 'lucide' },
        { value: 'provider-partner', label: 'Provider / Clinic Partner', icon: 'stethoscope', iconType: 'lucide' },
        { value: 'browsing', label: 'Just Browsing', icon: 'compass', iconType: 'lucide' },
      ],
    },
    {
      type: 'trait-selection',
      id: 'interests',
      selectionMode: 'multi',
      title: 'What are you here to explore?',
      subtitle: 'Select all that apply.',
      showGreeting: false,
      showSelectAll: true,
      // Conditional mapping — role → relevant interests.
      options: [
        { value: 'glp1-program', label: 'GLP-1 Weight Loss', icon: 'scale', iconType: 'lucide',
          relevantRoles: ['weight-loss', 'busy-professional', 'longevity', 'browsing'] },
        { value: 'trt-hrt-program', label: 'TRT & HRT', icon: 'activity', iconType: 'lucide',
          relevantRoles: ['trt-hrt', 'athlete-performance', 'longevity', 'browsing'] },
        { value: 'peptides', label: 'Peptide Therapy', icon: 'flask-conical', iconType: 'lucide',
          relevantRoles: ['peptide-therapy', 'athlete-performance', 'longevity', 'trt-hrt', 'browsing'] },
        { value: 'nad-longevity', label: 'NAD+ & Longevity', icon: 'sparkles', iconType: 'lucide',
          relevantRoles: ['longevity', 'busy-professional', 'peptide-therapy', 'browsing'] },
        { value: 'physician-care', label: 'Physician Supervision', icon: 'stethoscope', iconType: 'lucide',
          relevantRoles: ['weight-loss', 'trt-hrt', 'peptide-therapy', 'longevity', 'athlete-performance', 'busy-professional', 'provider-partner', 'browsing'] },
        { value: 'how-it-works', label: 'How It Works', icon: 'circle-help', iconType: 'lucide',
          relevantRoles: ['weight-loss', 'trt-hrt', 'peptide-therapy', 'longevity', 'athlete-performance', 'busy-professional', 'browsing'] },
        { value: 'provider-partnership', label: 'Clinic Partnership', icon: 'handshake', iconType: 'lucide',
          relevantRoles: ['provider-partner', 'browsing'] },
        { value: 'browsing', label: 'Just Browsing', icon: 'compass', iconType: 'lucide',
          relevantRoles: ['weight-loss', 'trt-hrt', 'peptide-therapy', 'longevity', 'athlete-performance', 'busy-professional', 'provider-partner', 'browsing'] },
      ],
    },
    {
      type: 'results',
      id: 'results',
      title: 'Your Personalized Tour',
      subtitle: 'Programs, science, and proof tailored to why you stopped by.',
      tabs: [
        { id: 'outcomes', label: 'Impact', icon: 'trending-up' },
        {
          id: 'learn',
          label: 'Discover',
          icon: 'book-open',
          filters: [
            { label: 'All', value: 'all' },
            { label: 'Website', value: 'website' },
            { label: 'Blog', value: 'blog' },
            { label: 'Video', value: 'video' },
          ],
        },
        { id: 'solutions', label: 'Programs', icon: 'layers' },
      ],
      cardsPerPage: 6,
      defaultView: 'small',
    },
    {
      type: 'summary',
      id: 'summary',
      title: 'Your Saved Items',
      subtitle: 'Review your picks and an Essntl Wellness coordinator will follow up.',
    },
    {
      type: 'content-library',
      id: 'library',
      title: 'Explore Everything',
      subtitle: 'Browse all available content.',
    },
    {
      type: 'thank-you',
      id: 'thanks',
      title: 'Thank You!',
      subtitle: 'An Essntl Wellness coordinator will be in touch shortly.',
      showNewSessionButton: true,
      showAddNotesButton: true,
    },
  ],

  content: [
    // ─────────────────────────────────────────────────────────────────
    // Conditional trait-mapping graph
    //
    // Role → primary interests (mirrored on each interest option's
    // `relevantRoles`):
    //   weight-loss          : glp1-program, physician-care, how-it-works, browsing
    //   trt-hrt               : trt-hrt-program, peptides, physician-care,
    //                          how-it-works, browsing
    //   peptide-therapy       : peptides, nad-longevity, physician-care,
    //                          how-it-works, browsing
    //   longevity             : glp1-program, trt-hrt-program, peptides,
    //                          nad-longevity, physician-care, how-it-works, browsing
    //   athlete-performance   : trt-hrt-program, peptides, physician-care,
    //                          how-it-works, browsing
    //   busy-professional     : glp1-program, nad-longevity, physician-care,
    //                          how-it-works, browsing
    //   provider-partner      : physician-care, provider-partnership, browsing
    //   browsing              : (catch-all — all interests)
    // ─────────────────────────────────────────────────────────────────

    // ── Outcomes / Impact (7) ─────────────────────────
    {
      id: 'o1',
      title: '99% Reported Satisfaction',
      cardType: 'outcome',
      icon: 'award',
      iconType: 'lucide',
      stat: '99%',
      description: {
        small: '99% of Essntl patients report satisfaction with their program.',
        medium: 'Essntl Wellness patients report a 99% satisfaction rate across its physician-supervised programs.',
        large: 'Across GLP-1, TRT/HRT, peptide, and longevity programs, Essntl Wellness patients report a 99% satisfaction rate — a reflection of the physician-supervised model and ongoing care coordination.',
        overlay: 'A 99% reported satisfaction rate spans every Essntl Wellness program — GLP-1 weight loss, TRT/HRT, peptide therapy, and NAD+ longevity. The number reflects more than the medication itself: physician supervision, proactive check-ins, and a coordinator who stays with you through the program are the difference-makers patients cite most.',
      },
      tags: ['physician-care'],
      targetRoles: ['weight-loss', 'trt-hrt', 'peptide-therapy', 'longevity', 'athlete-performance', 'busy-professional', 'browsing'],
      targetInterests: ['physician-care', 'how-it-works'],
    },
    {
      id: 'o2',
      title: '70+ Curated Products',
      cardType: 'outcome',
      icon: 'layers',
      iconType: 'lucide',
      stat: '70+',
      description: {
        small: 'A curated catalog of 70+ wellness products.',
        medium: 'Essntl Wellness offers a curated catalog of 70+ high-quality products across weight loss, hormone, and longevity care.',
        large: 'From GLP-1s to peptides to hormone therapies, the Essntl catalog spans 70+ curated products — every one vetted for sourcing and quality before it reaches a patient.',
        overlay: 'Seventy-plus products, one curated catalog. Essntl Wellness doesn\'t carry everything on the market — every GLP-1, peptide, and hormone therapy in the catalog has been vetted for sourcing and quality first. Breadth without compromising the sourcing standard.',
      },
      tags: ['catalog'],
      targetRoles: ['weight-loss', 'trt-hrt', 'peptide-therapy', 'longevity', 'athlete-performance', 'busy-professional', 'browsing'],
      targetInterests: ['glp1-program', 'trt-hrt-program', 'peptides', 'nad-longevity', 'browsing'],
    },
    {
      id: 'o3',
      title: 'FDA-Regulated GLP-1s',
      cardType: 'outcome',
      icon: 'shield-check',
      iconType: 'lucide',
      stat: 'FDA',
      description: {
        small: 'All GLP-1s are FDA-regulated and physician-prescribed.',
        medium: 'Every GLP-1 in the Essntl catalog is FDA-regulated, physician-prescribed, and sourced from 503A pharmacies.',
        large: 'Semaglutide, Tirzepatide, and Retatrutide are all FDA-regulated, prescribed under physician supervision, and sourced exclusively from 503A compounding pharmacies — not gray-market suppliers.',
        overlay: 'Every GLP-1 Essntl prescribes — Semaglutide, Tirzepatide, Retatrutide — is FDA-regulated and sourced from 503A compounding pharmacies, the same regulatory category licensed pharmacies operate under. No gray-market sourcing, no unregulated suppliers. The prescription, the sourcing, and the supervision are all accountable to a physician.',
      },
      tags: ['glp1-program', 'sourcing'],
      targetRoles: ['weight-loss', 'busy-professional', 'longevity', 'browsing'],
      targetInterests: ['glp1-program', 'physician-care'],
    },
    {
      id: 'o4',
      title: 'US-Licensed Peptide Sourcing',
      cardType: 'outcome',
      icon: 'flask-conical',
      iconType: 'lucide',
      stat: 'US',
      description: {
        small: 'Peptides sourced from US-licensed manufacturers.',
        medium: 'Every peptide in the Essntl catalog is sourced from US-licensed manufacturers — no overseas gray-market product.',
        large: 'BPC-157, Tesamorelin, and the rest of the peptide line are sourced exclusively from US-licensed manufacturers, with the same quality bar applied to GLP-1s and hormone therapies.',
        overlay: 'Peptide sourcing is where a lot of wellness brands cut corners — Essntl doesn\'t. Every peptide, from BPC-157 to Tesamorelin, comes from US-licensed manufacturers, held to the same sourcing standard as the FDA-regulated GLP-1 line. If a supplier can\'t meet that bar, it\'s not in the catalog.',
      },
      tags: ['peptides', 'sourcing'],
      targetRoles: ['peptide-therapy', 'athlete-performance', 'longevity', 'trt-hrt', 'browsing'],
      targetInterests: ['peptides', 'physician-care'],
    },
    {
      id: 'o5',
      title: 'Physician-Supervised, Always',
      cardType: 'outcome',
      icon: 'stethoscope',
      iconType: 'lucide',
      stat: 'MD',
      description: {
        small: 'Every program is built and monitored by a physician.',
        medium: 'No program at Essntl runs without physician oversight — from intake through ongoing dose management.',
        large: 'Physician supervision isn\'t a checkbox at Essntl — it\'s the operating model. Intake, prescribing, and ongoing dose management all run through a licensed physician.',
        overlay: 'The model is simple: nothing gets prescribed without a physician behind it. Intake starts with a clinical history, prescribing decisions are made by a licensed physician, and dose management continues as you progress through a program. The medication is the tool; physician oversight is the safety system around it.',
      },
      tags: ['physician-care'],
      targetRoles: ['weight-loss', 'trt-hrt', 'peptide-therapy', 'longevity', 'athlete-performance', 'busy-professional', 'provider-partner', 'browsing'],
      targetInterests: ['physician-care', 'how-it-works', 'browsing'],
    },
    {
      id: 'o6',
      title: '6 Core Hormone & Peptide Therapies',
      cardType: 'outcome',
      icon: 'list-checks',
      iconType: 'lucide',
      stat: '6',
      description: {
        small: 'Six flagship therapies anchor the Essntl catalog.',
        medium: 'Semaglutide, Tirzepatide, Retatrutide, NAD+, Tesamorelin, and BPC-157 anchor the program lineup.',
        large: 'Six flagship compounds — three GLP-1s (Semaglutide, Tirzepatide, Retatrutide) plus NAD+, Tesamorelin, and BPC-157 — cover weight loss, longevity, and recovery in one coordinated catalog.',
        overlay: 'Six compounds do most of the work across the Essntl catalog: Semaglutide, Tirzepatide, and Retatrutide for weight loss; NAD+ for cellular longevity; Tesamorelin and BPC-157 for recovery and hormone support. Each is available as a standalone program or layered into a broader plan with your physician.',
      },
      tags: ['glp1-program', 'peptides', 'nad-longevity'],
      targetRoles: ['weight-loss', 'trt-hrt', 'peptide-therapy', 'longevity', 'athlete-performance', 'browsing'],
      targetInterests: ['glp1-program', 'peptides', 'nad-longevity', 'trt-hrt-program'],
    },
    {
      id: 'o7',
      title: 'Health & Vitality, TRT & HRT, Weight Loss',
      cardType: 'outcome',
      icon: 'layout-grid',
      iconType: 'lucide',
      stat: '4 Tracks',
      description: {
        small: 'Four collections cover the full Essntl program lineup.',
        medium: 'Health & Vitality, TRT & HRT, Weight Loss, and Medical Services organize the full Essntl program lineup.',
        large: 'Every Essntl program sits inside one of four collections — Health & Vitality, TRT & HRT, Weight Loss, or Medical Services — making it easy to find the right starting point.',
        overlay: 'Four collections organize everything Essntl offers: Health & Vitality (longevity, NAD+, general wellness), TRT & HRT (hormone optimization), Weight Loss (GLP-1 programs), and Medical Services (consultations and ongoing care). Whatever brought you here today, there\'s a clear on-ramp.',
      },
      tags: ['catalog'],
      targetRoles: ['weight-loss', 'trt-hrt', 'peptide-therapy', 'longevity', 'athlete-performance', 'busy-professional', 'provider-partner', 'browsing'],
      targetInterests: ['how-it-works', 'browsing'],
    },

    // ── Learn / Discover (8) ─────────────────────────
    {
      id: 'l1',
      title: 'Visit Essntl Wellness',
      cardType: 'learn',
      mediaType: 'website',
      icon: 'globe',
      iconType: 'lucide',
      url: 'https://shop.essntlsupplements.com/',
      description: {
        small: 'The full Essntl Wellness shop, online.',
        medium: 'The official Essntl Wellness shop — full catalog, program details, and how to get started.',
        large: 'shop.essntlsupplements.com is the front door — browse the full GLP-1, TRT/HRT, peptide, and longevity catalog and start an intake.',
        overlay: 'Bookmark the Essntl Wellness shop — the full catalog of GLP-1, TRT/HRT, peptide, and longevity programs, along with the path to start a physician intake. The fastest way to see pricing and program details before your follow-up call.',
      },
      tags: ['website'],
      targetRoles: ['weight-loss', 'trt-hrt', 'peptide-therapy', 'longevity', 'athlete-performance', 'busy-professional', 'provider-partner', 'browsing'],
      targetInterests: ['how-it-works', 'browsing'],
    },
    {
      id: 'l2',
      title: 'Inside the GLP-1 Program',
      cardType: 'learn',
      mediaType: 'blog',
      icon: 'scale',
      iconType: 'lucide',
      url: 'https://shop.essntlsupplements.com/',
      description: {
        small: 'How the Essntl GLP-1 weight loss program works.',
        medium: 'A walk-through of the Essntl GLP-1 program — intake, prescribing, and ongoing dose management.',
        large: 'From first consultation to ongoing dose management, see how Essntl structures its GLP-1 weight loss programs around Semaglutide, Tirzepatide, and Retatrutide.',
        overlay: 'A practical walk-through of the GLP-1 program: clinical intake, physician prescribing decision, and the cadence of check-ins as your dose is managed over time. Covers all three GLP-1 options in the catalog — Semaglutide, Tirzepatide, and Retatrutide — and how a physician decides which fits your history.',
      },
      tags: ['glp1-program'],
      targetRoles: ['weight-loss', 'busy-professional', 'longevity', 'browsing'],
      targetInterests: ['glp1-program', 'how-it-works'],
    },
    {
      id: 'l3',
      title: 'Understanding TRT & HRT',
      cardType: 'learn',
      mediaType: 'blog',
      icon: 'activity',
      iconType: 'lucide',
      url: 'https://shop.essntlsupplements.com/',
      description: {
        small: 'What hormone replacement therapy looks like at Essntl.',
        medium: 'How Essntl approaches testosterone and hormone replacement therapy under physician supervision.',
        large: 'A look at what hormone restoration involves at Essntl — labs, physician evaluation, and an ongoing TRT/HRT plan built around your results.',
        overlay: 'Hormone restoration starts with labs, not guesswork. This piece walks through how Essntl\'s TRT/HRT programs begin with a physician evaluation and bloodwork, then build an ongoing plan calibrated to your results — not a one-size-fits-all dose.',
      },
      tags: ['trt-hrt-program'],
      targetRoles: ['trt-hrt', 'athlete-performance', 'longevity', 'browsing'],
      targetInterests: ['trt-hrt-program', 'how-it-works'],
    },
    {
      id: 'l4',
      title: 'Peptide Therapy 101',
      cardType: 'learn',
      mediaType: 'blog',
      icon: 'flask-conical',
      iconType: 'lucide',
      url: 'https://shop.essntlsupplements.com/',
      description: {
        small: 'An introduction to BPC-157, Tesamorelin, and peptide therapy.',
        medium: 'What peptide therapy is, how BPC-157 and Tesamorelin fit into a recovery or hormone plan.',
        large: 'A primer on the Essntl peptide line — what BPC-157 and Tesamorelin are used for, and how they\'re sourced from US-licensed manufacturers.',
        overlay: 'Peptide therapy is one of the fastest-growing categories in wellness — and one of the easiest to get wrong on sourcing. This primer covers what BPC-157 and Tesamorelin are used for, how they fit alongside hormone or longevity programs, and why Essntl sources exclusively from US-licensed manufacturers.',
      },
      tags: ['peptides'],
      targetRoles: ['peptide-therapy', 'athlete-performance', 'longevity', 'trt-hrt', 'browsing'],
      targetInterests: ['peptides', 'how-it-works'],
    },
    {
      id: 'l5',
      title: 'How Physician Supervision Works',
      cardType: 'learn',
      mediaType: 'video',
      icon: 'video',
      iconType: 'lucide',
      url: 'https://shop.essntlsupplements.com/',
      description: {
        small: 'A short video on the Essntl physician care model.',
        medium: 'See how intake, prescribing, and ongoing check-ins work under the Essntl physician-supervised model.',
        large: 'A short video walking through the Essntl care model — clinical intake, the physician prescribing decision, and the ongoing check-in cadence for every program.',
        overlay: 'A short video that demystifies the process: what the clinical intake covers, how a physician makes a prescribing decision, and what the ongoing check-in cadence looks like once you\'re on a program. The same physician-supervised model applies whether you\'re on a GLP-1, TRT/HRT, or peptide plan.',
      },
      tags: ['physician-care'],
      targetRoles: ['weight-loss', 'trt-hrt', 'peptide-therapy', 'longevity', 'athlete-performance', 'busy-professional', 'provider-partner', 'browsing'],
      targetInterests: ['physician-care', 'how-it-works'],
    },
    {
      id: 'l6',
      title: 'NAD+ and Cellular Longevity',
      cardType: 'learn',
      mediaType: 'blog',
      icon: 'sparkles',
      iconType: 'lucide',
      url: 'https://shop.essntlsupplements.com/',
      description: {
        small: 'What NAD+ therapy is and who it\'s built for.',
        medium: 'An overview of NAD+ therapy and how it fits into a longevity-focused wellness plan.',
        large: 'NAD+ is one of the most-requested additions to an Essntl longevity plan — this piece covers what it is, how it\'s administered, and who tends to add it.',
        overlay: 'NAD+ shows up most often in longevity-focused plans and for busy professionals managing fatigue and recovery. This piece covers what NAD+ is, how the 100mg program is structured, and how it\'s typically layered alongside other Essntl programs by physicians who manage longevity-track patients.',
      },
      tags: ['nad-longevity'],
      targetRoles: ['longevity', 'busy-professional', 'peptide-therapy', 'browsing'],
      targetInterests: ['nad-longevity', 'how-it-works'],
    },
    {
      id: 'l7',
      title: 'Why Sourcing Matters: 503A Pharmacies',
      cardType: 'learn',
      mediaType: 'blog',
      icon: 'shield-check',
      iconType: 'lucide',
      url: 'https://shop.essntlsupplements.com/',
      description: {
        small: 'Why 503A pharmacy sourcing matters for GLP-1s.',
        medium: 'A look at why Essntl sources every GLP-1 from 503A compounding pharmacies instead of gray-market suppliers.',
        large: 'Not every wellness brand sources GLP-1s the same way. This piece explains the 503A compounding pharmacy standard and why it\'s the line Essntl won\'t cross.',
        overlay: 'The wellness-and-weight-loss category has a sourcing problem, and most patients never see it. This piece walks through what a 503A compounding pharmacy actually is, why FDA regulation at that level matters for GLP-1 safety, and why it\'s the non-negotiable standard behind every Essntl prescription.',
      },
      tags: ['sourcing', 'glp1-program'],
      targetRoles: ['weight-loss', 'busy-professional', 'provider-partner', 'browsing'],
      targetInterests: ['glp1-program', 'physician-care'],
    },
    {
      id: 'l8',
      title: 'The Essntl Onboarding Process',
      cardType: 'learn',
      mediaType: 'blog',
      icon: 'list-checks',
      iconType: 'lucide',
      url: 'https://shop.essntlsupplements.com/',
      description: {
        small: 'What to expect from intake to your first prescription.',
        medium: 'A step-by-step look at the Essntl onboarding process — intake, physician review, and getting started.',
        large: 'From the first form to your first prescription, this piece maps out exactly what to expect when you start with Essntl Wellness.',
        overlay: 'Most patients\' biggest question is "what actually happens after I sign up?" This piece maps the full onboarding sequence: intake form, physician clinical review, prescribing decision, pharmacy fulfillment, and your first check-in — so there are no surprises between today and your first dose.',
      },
      tags: ['how-it-works'],
      targetRoles: ['weight-loss', 'trt-hrt', 'peptide-therapy', 'longevity', 'athlete-performance', 'busy-professional', 'browsing'],
      targetInterests: ['how-it-works', 'browsing'],
    },

    // ── Solutions / Programs (7) ─────────────────────────
    {
      id: 's1',
      title: 'GLP-1 Weight Loss Program',
      cardType: 'solution',
      icon: 'scale',
      iconType: 'lucide',
      description: {
        small: 'Semaglutide, Tirzepatide, or Retatrutide — physician-managed.',
        medium: 'Choose from Semaglutide, Tirzepatide, or Retatrutide — each prescribed and dose-managed by a physician.',
        large: 'The GLP-1 program offers Semaglutide (10mg), Tirzepatide (5mg), or Retatrutide (10mg) — all FDA-regulated, 503A-sourced, and managed through ongoing physician check-ins.',
        overlay: 'Three GLP-1 options, one physician-managed program: Semaglutide 10mg, Tirzepatide 5mg, or Retatrutide 10mg. Every prescription is FDA-regulated and sourced from 503A compounding pharmacies, with dose adjustments managed by your physician as you progress.',
      },
      tags: ['glp1-program'],
      targetRoles: ['weight-loss', 'busy-professional', 'longevity', 'browsing'],
      targetInterests: ['glp1-program', 'physician-care'],
    },
    {
      id: 's2',
      title: 'TRT & HRT Program',
      cardType: 'solution',
      icon: 'activity',
      iconType: 'lucide',
      description: {
        small: 'Testosterone and hormone replacement, lab-guided.',
        medium: 'A physician-supervised TRT/HRT program built around lab work and ongoing hormone monitoring.',
        large: 'The TRT & HRT program starts with a physician evaluation and labs, then builds an ongoing hormone optimization plan calibrated to your results.',
        overlay: 'Hormone restoration done the lab-guided way. The TRT & HRT program starts with bloodwork and a physician evaluation, then builds an ongoing optimization plan with regular monitoring — not a fixed dose handed out without follow-up.',
      },
      tags: ['trt-hrt-program'],
      targetRoles: ['trt-hrt', 'athlete-performance', 'longevity', 'browsing'],
      targetInterests: ['trt-hrt-program', 'physician-care'],
    },
    {
      id: 's3',
      title: 'Peptide Therapy',
      cardType: 'solution',
      icon: 'flask-conical',
      iconType: 'lucide',
      description: {
        small: 'BPC-157 and Tesamorelin, sourced from US manufacturers.',
        medium: 'BPC-157 (10mg) and Tesamorelin (10mg) — peptide options sourced exclusively from US-licensed manufacturers.',
        large: 'The peptide line includes BPC-157 and Tesamorelin, often layered into a recovery or hormone plan under physician guidance.',
        overlay: 'BPC-157 and Tesamorelin anchor the Essntl peptide line, sourced exclusively from US-licensed manufacturers. Frequently layered into a broader recovery or hormone-support plan, always under physician guidance on dosing and combination.',
      },
      tags: ['peptides'],
      targetRoles: ['peptide-therapy', 'athlete-performance', 'longevity', 'trt-hrt', 'browsing'],
      targetInterests: ['peptides', 'physician-care'],
    },
    {
      id: 's4',
      title: 'NAD+ Therapy',
      cardType: 'solution',
      icon: 'sparkles',
      iconType: 'lucide',
      description: {
        small: 'NAD+ 100mg for cellular energy and longevity.',
        medium: 'A 100mg NAD+ program supporting cellular energy, recovery, and longevity goals.',
        large: 'NAD+ (100mg) is one of the most-requested additions to a longevity plan — often paired with GLP-1 or peptide programs under physician guidance.',
        overlay: 'NAD+ 100mg is built for patients focused on cellular energy and longevity — frequently paired with a GLP-1 or peptide program as part of a broader plan, with the combination and cadence set by your physician.',
      },
      tags: ['nad-longevity'],
      targetRoles: ['longevity', 'busy-professional', 'peptide-therapy', 'browsing'],
      targetInterests: ['nad-longevity', 'physician-care'],
    },
    {
      id: 's5',
      title: 'Health & Vitality Collection',
      cardType: 'solution',
      icon: 'layout-grid',
      iconType: 'lucide',
      description: {
        small: 'The broader wellness and longevity collection.',
        medium: 'Health & Vitality spans the broader longevity and general-wellness side of the Essntl catalog.',
        large: 'For patients not chasing a single goal, the Health & Vitality collection covers the broader longevity and general-wellness catalog — NAD+, foundational hormone support, and more.',
        overlay: 'Not every patient is chasing one specific outcome. The Health & Vitality collection is the broad on-ramp — NAD+, foundational hormone support, and general longevity programs — for patients who want to start with a physician conversation about what fits.',
      },
      tags: ['nad-longevity', 'catalog'],
      targetRoles: ['longevity', 'busy-professional', 'browsing'],
      targetInterests: ['nad-longevity', 'how-it-works', 'browsing'],
    },
    {
      id: 's6',
      title: 'Medical Services & Consultations',
      cardType: 'solution',
      icon: 'stethoscope',
      iconType: 'lucide',
      description: {
        small: 'Physician consultations and ongoing care coordination.',
        medium: 'Every Essntl program runs through a physician consultation and ongoing care coordination.',
        large: 'Medical Services covers the physician consultations, lab review, and care coordination underneath every Essntl program — the layer that makes the medication safe and effective.',
        overlay: 'Medical Services is the layer underneath every program — physician consultations, lab review, and ongoing care coordination. It\'s not a separate add-on; it\'s the reason a GLP-1, TRT/HRT, or peptide program at Essntl is managed care rather than a self-serve prescription.',
      },
      tags: ['physician-care'],
      targetRoles: ['weight-loss', 'trt-hrt', 'peptide-therapy', 'longevity', 'athlete-performance', 'busy-professional', 'provider-partner', 'browsing'],
      targetInterests: ['physician-care', 'how-it-works'],
    },
    {
      id: 's7',
      title: 'Provider Partnership Program',
      cardType: 'solution',
      icon: 'handshake',
      iconType: 'lucide',
      description: {
        small: 'Partner with Essntl as a referring clinic or provider.',
        medium: 'For clinics and providers — refer patients into Essntl\'s physician-supervised programs with coordinated care.',
        large: 'The Provider Partnership Program lets referring clinics and providers route patients into Essntl\'s GLP-1, TRT/HRT, and peptide programs with coordinated, transparent care.',
        overlay: 'For referring clinics and providers, the Provider Partnership Program offers a coordinated way to route patients into Essntl\'s physician-supervised programs — with shared visibility into care plans and a direct line to the prescribing physician team.',
      },
      tags: ['provider-partnership'],
      targetRoles: ['provider-partner', 'browsing'],
      targetInterests: ['provider-partnership', 'physician-care', 'browsing'],
    },
  ],

  features: {
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
  },
};
