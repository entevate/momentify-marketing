// Explorer Config — LG NOVA (Technology / Corporate Innovation)
// Event kiosk for LG NOVA, LG Electronics' North American Innovation
// Center (Silicon Valley; operations in Morgantown, WV). LG NOVA builds
// AI-first ventures across HealthTech, CleanTech and Transformational
// Tech (LG's "ABC" strategy), runs the Innovation Program / Commercial
// Acceleration Program for startups, Elevate WV for Appalachia, the
// Coalition for Innovation, and the Mission Hub content platform.
// Brand: LG red #A50034 + gray #6B6B6B (intake). Site font is LGSmart
// (licensed, not loadable) → Inter.
// Content sourced from lgnova.com (home, about, ventures, join the
// mission, innovation program, Elevate WV, West Virginia, coalition,
// mission hub, webinars & events, CES 2026 highlights, news, startups).

import type { ExplorerConfig, ThemeColors } from '../types';

const NOVA_DARK: ThemeColors = {
  // Charcoal with a faint red cast so dialogs read LG, not generic dark.
  bg: '#0B090B',
  bgGradient: 'linear-gradient(135deg, #2A0613 0%, #150C10 55%, #0B090B 100%)',
  surface: 'rgba(255,255,255,0.06)',
  surfaceHover: 'rgba(255,255,255,0.10)',
  border: 'rgba(255,255,255,0.12)',
  borderFocus: '#F0386F',
  text1: '#FFFFFF',
  text2: 'rgba(255,255,255,0.78)',
  text3: 'rgba(255,255,255,0.52)',
  inputBg: 'rgba(255,255,255,0.08)',
  inputText: '#FFFFFF',
  inputPlaceholder: 'rgba(255,255,255,0.40)',
  logoText: '#FFFFFF',
  focusRing: 'rgba(240,56,111,0.25)',
};

const NOVA_LIGHT: ThemeColors = {
  // Clean neutral white; LG red carries focus and accents.
  bg: '#F5F5F7',
  bgGradient: 'linear-gradient(180deg, #F7F7F9 0%, #F1F1F4 100%)',
  surface: 'rgba(255,255,255,0.92)',
  surfaceHover: 'rgba(255,255,255,1.00)',
  border: 'rgba(20,20,24,0.10)',
  borderFocus: '#A50034',
  text1: '#141418',
  text2: 'rgba(20,20,24,0.66)',
  text3: 'rgba(20,20,24,0.46)',
  inputBg: '#FFFFFF',
  inputText: '#141418',
  inputPlaceholder: 'rgba(20,20,24,0.36)',
  logoText: '#141418',
  focusRing: 'rgba(165,0,52,0.15)',
};

const ROLES = ['founder', 'investor', 'corporate', 'health', 'energy', 'public-sector', 'browsing'];
const glow = (a: string, b: string, x: number, y: number) =>
  `radial-gradient(ellipse 90% 70% at 50% 70%, ${a} 0%, transparent 65%), radial-gradient(ellipse 70% 60% at ${x}% ${y}%, ${b} 0%, transparent 55%)`;
const GLOWS = [
  glow('rgba(165,0,52,0.18)', 'rgba(107,107,107,0.12)', 15, 15),
  glow('rgba(240,56,111,0.14)', 'rgba(165,0,52,0.10)', 85, 15),
  glow('rgba(107,107,107,0.16)', 'rgba(165,0,52,0.12)', 25, 15),
  glow('rgba(165,0,52,0.16)', 'rgba(240,56,111,0.08)', 85, 25),
  glow('rgba(240,56,111,0.12)', 'rgba(107,107,107,0.10)', 15, 25),
  glow('rgba(165,0,52,0.14)', 'rgba(107,107,107,0.10)', 75, 15),
  glow('rgba(107,107,107,0.14)', 'rgba(165,0,52,0.08)', 85, 25),
];

const ALL = ROLES;

export const LGNOVA_CONFIG: ExplorerConfig = {
  id: 'lgnova',
  name: 'LG NOVA Explorer',
  version: 1,
  createdAt: '2026-11-12T00:00:00.000Z',
  updatedAt: '2026-11-12T00:00:00.000Z',

  branding: {
    logo: {
      dark: '/brand/assets/lgnova-logo-reverse.svg', // white LG NOVA wordmark
      light: '/brand/assets/lgnova-logo.svg',        // gray LG NOVA wordmark
    },
    // Wordmark is 173x30 (~5.8:1); 26px keeps it inside the top bar.
    logoHeight: 26,
    icon: '/brand/assets/lgnova-icon.png',
    colors: {
      primary: '#F0386F',   // lifted LG red, legible accent on charcoal
      secondary: '#A50034', // LG red
      teal: '#F0386F',      // hover/focus/selection on dark
      blue: '#6B6B6B',      // LG gray
      deepBlue: '#3A3A3E',
      navy: '#170D11',
      midnight: '#0B090B',
      plum: '#7A0026',      // deep LG red, gradient support
      bgDark: '#0B090B',
      dark: NOVA_DARK,
      light: NOVA_LIGHT,
    },
    font: 'Inter',
    backgroundPattern: 'none',
    auroraOrbs: {
      orb1: 'rgba(165,0,52,0.20)',
      orb2: 'rgba(240,56,111,0.12)',
      orb3: 'rgba(107,107,107,0.14)',
    },
    // White on LG red passes AA comfortably.
    ctaGradient: 'linear-gradient(135deg, #C8174F 0%, #A50034 100%)',
    ctaTextColor: '#FFFFFF',
    gradientWord: 'linear-gradient(135deg, #FF6A93 0%, #F0386F 50%, #C8174F 100%)',
    roleBackgrounds: Object.fromEntries(ROLES.map((r, i) => [r, GLOWS[i]])),
  },

  registration: {
    modes: ['form', 'scan', 'search'],
    defaultMode: 'form',
    formTitle: 'Join the Mission',
    formSubtitle: 'Share a quick intro and the LG NOVA team will follow up with the ventures, programs and resources you pick.',
    scanLabel: 'Scan Your Badge',
    scanHint: 'Hold the QR code in front of the camera',
    searchPlaceholder: 'Search by last name...',
    optInText: 'By sharing your information you consent to LG NOVA processing your data to fulfill your request and send relevant follow-up communications. See lg.com/us/privacy for details.',
    showLocaleButton: false,
    idleTimeoutMs: 10000,
    skipEnabled: true,
    fields: [
      { id: 'firstName', label: 'First Name', type: 'text', placeholder: 'First name', required: true, halfWidth: true },
      { id: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Last name', required: true, halfWidth: true },
      { id: 'email', label: 'Email', type: 'email', placeholder: 'name@company.com', required: true, halfWidth: true },
      { id: 'phone', label: 'Phone', type: 'tel', placeholder: '(555) 555-5555', required: false, halfWidth: true },
      { id: 'company', label: 'Company / Organization', type: 'text', placeholder: 'Company or organization', required: false, halfWidth: true },
      { id: 'title', label: 'Title', type: 'text', placeholder: 'Your role', required: false, halfWidth: true },
    ],
  },

  steps: [
    {
      type: 'splash',
      id: 'welcome',
      title: 'AI for a',
      gradientWord: 'Brighter Future.',
      subtitle: 'LG NOVA is LG Electronics\' North American Innovation Center. We build AI-first ventures that transform industries and unlock entirely new ways to live, work and play. Tap to explore.',
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
      title: 'What brings you to LG NOVA?',
      subtitle: 'Select the option that fits you best.',
      showGreeting: true,
      showSelectAll: false,
      options: [
        { value: 'founder', label: 'Startup Founder', icon: 'rocket', iconType: 'lucide' },
        { value: 'investor', label: 'Investor / VC', icon: 'trending-up', iconType: 'lucide' },
        { value: 'corporate', label: 'Industry / Corporate Leader', icon: 'building-2', iconType: 'lucide' },
        { value: 'health', label: 'Healthcare Provider', icon: 'heart-pulse', iconType: 'lucide' },
        { value: 'energy', label: 'Energy / Data Center Leader', icon: 'zap', iconType: 'lucide' },
        { value: 'public-sector', label: 'Government / University', icon: 'landmark', iconType: 'lucide' },
        { value: 'browsing', label: 'Just Exploring', icon: 'compass', iconType: 'lucide' },
      ],
    },
    {
      type: 'trait-selection',
      id: 'interests',
      selectionMode: 'multi',
      title: 'What are you interested in?',
      subtitle: 'Select all that apply.',
      showGreeting: false,
      showSelectAll: true,
      options: [
        { value: 'healthtech', label: 'HealthTech', icon: 'heart-pulse', iconType: 'lucide' },
        { value: 'cleantech', label: 'CleanTech & Energy', icon: 'leaf', iconType: 'lucide' },
        { value: 'transformational', label: 'Transformational AI', icon: 'cpu', iconType: 'lucide' },
        { value: 'ventures', label: 'LG NOVA Ventures', icon: 'layers', iconType: 'lucide' },
        { value: 'partner', label: 'Partnering With LG', icon: 'handshake', iconType: 'lucide' },
        { value: 'invest', label: 'Investing', icon: 'dollar-sign', iconType: 'lucide' },
        { value: 'appalachia', label: 'West Virginia & Appalachia', icon: 'map-pin', iconType: 'lucide' },
        { value: 'browsing', label: 'Just Browsing', icon: 'compass', iconType: 'lucide' },
      ],
    },
    {
      type: 'results',
      id: 'results',
      title: 'Your Innovation Path',
      subtitle: 'Ventures, programs and insights matched to your interests.',
      tabs: [
        { id: 'outcomes', label: 'Impact', icon: 'trending-up' },
        {
          id: 'learn',
          label: 'Learn',
          icon: 'book-open',
          filters: [
            { label: 'All', value: 'all' },
            { label: 'Webinar', value: 'webinar' },
            { label: 'Video', value: 'video' },
            { label: 'Blog', value: 'blog' },
            { label: 'Website', value: 'website' },
          ],
        },
        { id: 'solutions', label: 'Ventures & Programs', icon: 'layers' },
      ],
      cardsPerPage: 6,
      defaultView: 'small',
    },
    {
      type: 'summary',
      id: 'summary',
      title: 'Your Saved Items',
      subtitle: 'Review your picks and the LG NOVA team will follow up.',
    },
    {
      type: 'content-library',
      id: 'library',
      title: 'Explore Everything',
      subtitle: 'Browse all LG NOVA ventures, programs and resources.',
    },
    {
      type: 'thank-you',
      id: 'thanks',
      title: 'Thank You!',
      subtitle: 'The LG NOVA team will be in touch soon. Let\'s build a brighter future together.',
      showNewSessionButton: true,
      showAddNotesButton: true,
    },
  ],

  content: [
    // ── Outcomes / Impact (7) ────────────────────────────────────────
    {
      id: 'o1',
      title: '3,895 Startup Applicants',
      cardType: 'outcome', icon: 'users', iconType: 'lucide', stat: '3,895',
      url: 'https://lgnova.com/about',
      description: {
        small: 'Nearly 3,900 startups have applied to work with LG NOVA.',
        medium: '3,895 startups have applied to LG NOVA programs to date, and 100 have been selected to explore collaboration.',
        large: 'LG NOVA\'s outside-in model draws founders from everywhere: 3,895 startup applicants to date, with 100 selected to explore collaboration with LG.',
        overlay: 'LG NOVA changes how innovation happens by bringing outside ideas in. To date, 3,895 startups have applied to its programs, and 100 have been selected to explore collaboration with LG. Selected companies join the Mission Partner Network, with marketing, networking and investment opportunities under the LG brand.',
      },
      tags: ['partner'], targetRoles: ALL,
      targetInterests: ['partner', 'ventures', 'browsing'],
    },
    {
      id: 'o2',
      title: '100 Startups Selected',
      cardType: 'outcome', icon: 'award', iconType: 'lucide', stat: '100',
      url: 'https://lgnova.com/2024-2025-startups',
      description: {
        small: '100 startups selected to explore collaboration with LG.',
        medium: 'The 2024–2025 Mission Partner cohort was chosen from more than 1,000 submissions.',
        large: 'Getting in is competitive: the 2024–2025 Mission Partner companies were chosen from more than 1,000 submissions, across HealthTech, CleanTech and AI.',
        overlay: 'LG NOVA has selected 100 startups to explore collaboration with LG. The 2024–2025 Mission Partner companies alone were chosen from more than 1,000 submissions, and include HealthTech leaders like Canary Speech, an AI voice biomarker company screening for mental health and neurological conditions. Mission Partners get marketing, networking and investment opportunities through the program.',
      },
      tags: ['partner', 'healthtech'], targetRoles: ['founder', 'investor', 'corporate', 'browsing'],
      targetInterests: ['partner', 'healthtech', 'ventures'],
    },
    {
      id: 'o3',
      title: 'Up to $100K in Grant Funding',
      cardType: 'outcome', icon: 'gift', iconType: 'lucide', stat: '$100K',
      url: 'https://lgnova.com/join-the-mission',
      description: {
        small: 'Selected startups can receive up to $100K in grant funding.',
        medium: 'LG NOVA offers up to $100K in grant funding to support pilots, proofs of concept and joint product development.',
        large: 'Mission for the Future startups get joint collaboration with LG, investment introductions, and up to $100K in grants for pilots, POCs and joint product development.',
        overlay: 'The Mission for the Future invites startups to build with LG. Selected companies get deep joint collaboration toward multi-million to billion-dollar ventures, investment recommendations from capital partners including the NOVA Prime Fund and LG NOVA Capital Alliance, and up to $100K of grant funding to support pilots, proofs of concept and joint product development.',
      },
      tags: ['partner', 'invest'], targetRoles: ['founder', 'investor', 'browsing'],
      targetInterests: ['partner', 'invest'],
    },
    {
      id: 'o4',
      title: '10–20 Companies a Year, 1–2 New Ventures',
      cardType: 'outcome', icon: 'rocket', iconType: 'lucide', stat: '10–20',
      url: 'https://lgnova.com/join-the-mission/innovation-program',
      description: {
        small: 'Up to 20 companies a year, with 1–2 new ventures launched.',
        medium: 'LG NOVA aims to select 10–20 companies a year for its program and launch 1–2 new business ventures.',
        large: 'Selection is focused: 10–20 companies a year join the program, working with an entrepreneur-in-residence, and LG NOVA aims to launch 1–2 new ventures each year.',
        overlay: 'LG NOVA intends to select 10–20 companies a year for its Innovation Program and launch 1–2 new business ventures, each of which may combine multiple companies. Selected startups work with a dedicated entrepreneur-in-residence on a joint proposal and proof of concept, then move on an accelerated path to joint go-to-market with LG Electronics.',
      },
      tags: ['partner', 'ventures'], targetRoles: ['founder', 'investor', 'corporate', 'browsing'],
      targetInterests: ['partner', 'ventures'],
    },
    {
      id: 'o5',
      title: 'Built on LG\'s ABC Strategy',
      cardType: 'outcome', icon: 'target', iconType: 'lucide', stat: 'A·B·C',
      url: 'https://lgnova.com/about',
      description: {
        small: 'AI, BioTech and CleanTech, LG\'s three innovation pillars.',
        medium: 'LG NOVA follows LG\'s ABC strategy: Transformational Tech (AI), HealthTech (BioTech) and CleanTech.',
        large: 'Every LG NOVA venture maps to LG\'s ABC strategy: AI-driven Transformational Tech, HealthTech for better access and care, and CleanTech for a sustainable, resilient future.',
        overlay: 'LG NOVA\'s innovation strategy follows LG\'s corporate ABC approach. (AI) Transformational Tech targets market areas where AI disrupts how industries operate. (BioTech) HealthTech applies AI to help providers deliver better care with greater access. (CleanTech) uses AI, analytics and data to advance a sustainable future and resilient infrastructure.',
      },
      tags: ['healthtech', 'cleantech', 'transformational'], targetRoles: ALL,
      targetInterests: ['healthtech', 'cleantech', 'transformational', 'browsing'],
    },
    {
      id: 'o6',
      title: '9–12 Months to an AI-First Business',
      cardType: 'outcome', icon: 'calendar', iconType: 'lucide', stat: '9–12 mo',
      url: 'https://lgnova.com/elevate-wv',
      description: {
        small: 'Elevate WV turns pre-seed startups into AI-first businesses.',
        medium: 'Elevate WV is a 9–12 month venture-building program for founders in West Virginia and Appalachia.',
        large: 'In 9–12 months, Elevate WV works to develop pre-seed startups into globally scalable, AI-first businesses, with LG NOVA incubation, investor introductions and pilot customers.',
        overlay: 'Elevate WV is LG NOVA\'s structured venture-building program for West Virginia and the Appalachian region. Selected entrepreneurs join a 9–12 month process designed to develop pre-seed startups into unicorn-scale, AI-first businesses, with joint collaboration with the LG NOVA incubation team, potential investment from LG NOVA\'s capital partners, and support finding pilots and customers.',
      },
      tags: ['appalachia', 'partner'], targetRoles: ['founder', 'public-sector', 'investor', 'browsing'],
      targetInterests: ['appalachia', 'partner'],
    },
    {
      id: 'o7',
      title: 'Remote Breast Cancer Care, Proven in Pilot',
      cardType: 'outcome', icon: 'heart-pulse', iconType: 'lucide', stat: 'Pilot',
      url: 'https://lgnova.com/news/primefocus-health-and-marshall-health-network-extend-collaboration-to-support-breast-cancer-clinic?hsLang=en',
      description: {
        small: 'Primefocus Health and Marshall Health extended their collaboration.',
        medium: 'After strong engagement and improved outcomes in a pilot, Primefocus Health and Marshall Health Network extended their work.',
        large: 'LG NOVA venture Primefocus Health and Marshall Health Network extended their collaboration to support a breast cancer clinic, after a pilot showed strong engagement and improved outcomes.',
        overlay: 'Announced at CES 2026: Primefocus Health, an LG NOVA venture reimagining specialist care for rural and underserved patients, and Marshall Health Network extended their collaboration to support a breast cancer clinic. Strong engagement and improved outcomes in the initial pilot demonstrated the potential of effective remote care for breast cancer.',
      },
      tags: ['healthtech', 'ventures'], targetRoles: ['health', 'investor', 'corporate', 'public-sector', 'browsing'],
      targetInterests: ['healthtech', 'ventures', 'appalachia'],
    },

    // ── Learn (9) ────────────────────────────────────────────────────
    {
      id: 'l1',
      title: 'LG NOVA at CES 2026',
      cardType: 'learn', mediaType: 'website', icon: 'star', iconType: 'lucide',
      url: 'https://lgnova.com/ces2026-highlights',
      description: {
        small: 'Highlights, announcements and sessions from CES 2026.',
        medium: 'See LG NOVA\'s CES 2026 booth, startup partners, on-stage sessions and announcements.',
        large: 'At CES 2026, LG NOVA showcased startup partners in HealthTech, CleanTech and Native AI, and announced news from NovaWave Capital, Primefocus Health and PADO.',
        overlay: 'LG NOVA brought AI-first innovation to CES 2026 in Las Vegas, featuring startup partners in HealthTech, CleanTech and Native AI at its Eureka Park booth. Announcements included NovaWave Capital\'s Arizona AI venture studio collaboration, Primefocus Health\'s extended work with Marshall Health Network, and PADO\'s partnership with VESSL. Catch the Tech Talk sessions and on-stage panels.',
      },
      tags: ['ventures', 'browsing'], targetRoles: ALL,
      targetInterests: ['ventures', 'browsing', 'healthtech', 'cleantech'],
    },
    {
      id: 'l2',
      title: 'Webinar: The Changing Power Dynamic in Data Centers',
      cardType: 'learn', mediaType: 'webinar', icon: 'zap', iconType: 'lucide',
      url: 'https://lgnova.com/webinars-and-events',
      description: {
        small: 'How supporting high-density AI becomes a financial advantage.',
        medium: 'A PADO on-demand webinar on supporting high-density AI in existing data centers.',
        large: 'PADO explains how supporting high-density AI workloads within your existing environment translates into a measurable competitive and financial advantage.',
        overlay: 'AI workloads are rewriting data center economics. In this on-demand webinar from LG NOVA venture PADO, learn how supporting high-density AI within your existing environment, by orchestrating power, cooling and compute together, translates into a measurable competitive and financial advantage. Watch on the LG NOVA Mission Hub.',
      },
      tags: ['cleantech'], targetRoles: ['energy', 'corporate', 'investor', 'browsing'],
      targetInterests: ['cleantech', 'ventures'],
    },
    {
      id: 'l3',
      title: 'Webinar: Agentic AI in Practice',
      cardType: 'learn', mediaType: 'webinar', icon: 'cpu', iconType: 'lucide',
      url: 'https://lgnova.com/webinars-and-events',
      description: {
        small: 'From digital reasoning to physical-world action.',
        medium: 'Harvard Professor Na (Lina) Li and PADO on building trustworthy autonomous AI systems.',
        large: 'AI is moving from digital reasoning to physical action. Harvard Professor Na (Lina) Li and PADO break down the "reality gap" and how to build trustworthy autonomous systems.',
        overlay: 'This on-demand session explores the transition of AI from digital reasoning to physical-world action. Harvard Professor Na (Lina) Li and the PADO team break down the "reality gap" between models and the real world and share insights on building trustworthy autonomous systems. Available on the LG NOVA Mission Hub.',
      },
      tags: ['transformational', 'cleantech'], targetRoles: ['energy', 'corporate', 'investor', 'founder', 'public-sector', 'browsing'],
      targetInterests: ['transformational', 'cleantech'],
    },
    {
      id: 'l4',
      title: 'Webinar: Remote Therapeutic Monitoring with ReliefAI',
      cardType: 'learn', mediaType: 'webinar', icon: 'heart-pulse', iconType: 'lucide',
      url: 'https://lgnova.com/webinars-and-events',
      description: {
        small: 'What the 2027 Physician Fee Schedule means for behavioral health.',
        medium: 'ReliefAI unpacks how CMS\'s 2027 Physician Fee Schedule is reshaping behavioral healthcare delivery.',
        large: 'CMS\'s 2027 Physician Fee Schedule is reshaping behavioral healthcare. ReliefAI explains remote therapeutic monitoring and how practices can adapt.',
        overlay: 'The Centers for Medicare & Medicaid Services has released the 2027 Physician Fee Schedule, and it is starting to fundamentally reshape behavioral healthcare delivery. In this on-demand webinar, LG NOVA venture ReliefAI explains remote therapeutic monitoring and how practices can adapt workflows and data tools to keep delivering effective care.',
      },
      tags: ['healthtech'], targetRoles: ['health', 'investor', 'corporate', 'browsing'],
      targetInterests: ['healthtech', 'ventures'],
    },
    {
      id: 'l5',
      title: 'Webinar: A Look at the Commercial Acceleration Program',
      cardType: 'learn', mediaType: 'webinar', icon: 'rocket', iconType: 'lucide',
      url: 'https://lgnova.com/webinars-and-events',
      description: {
        small: 'How startups and LG NOVA build ventures together.',
        medium: 'An on-demand look at how the Commercial Acceleration Program pairs companies with the LG NOVA team.',
        large: 'Curious about the Commercial Acceleration Program? This recorded session shows how companies and the LG NOVA team collaborate to create impactful new ventures.',
        overlay: 'Discover how LG NOVA\'s Commercial Acceleration Program (CAP) fosters collaboration between companies and the LG NOVA team to drive innovation and create impactful solutions. Selected companies work with a dedicated entrepreneur-in-residence who champions the joint proposal and finds opportunities across LG\'s global portfolio. Recorded May 2024, available on the Mission Hub.',
      },
      tags: ['partner'], targetRoles: ['founder', 'investor', 'corporate', 'browsing'],
      targetInterests: ['partner', 'ventures'],
    },
    {
      id: 'l6',
      title: 'Corporate Venture Building: What Good Looks Like',
      cardType: 'learn', mediaType: 'blog', icon: 'book-open', iconType: 'lucide',
      url: 'https://lgnova.com/news/corporate-venture-building-what-it-is-why-it-matters-and-what-good-looks-like',
      description: {
        small: 'What corporate venture building is and how to do it well.',
        medium: 'LG NOVA\'s perspective on corporate venture building: what it is, why it matters and how to do it well.',
        large: 'Turning corporate innovation into real companies is hard. This LG NOVA piece explains corporate venture building and what separates the programs that work.',
        overlay: 'Corporations have resources startups dream of, and startups move in ways corporations can\'t. Corporate venture building tries to capture both. In this article, LG NOVA explains what corporate venture building is, why it matters, and what good looks like, drawing on its own model of incubating AI-first ventures with founders and partners.',
      },
      tags: ['partner', 'ventures'], targetRoles: ['corporate', 'investor', 'founder', 'browsing'],
      targetInterests: ['partner', 'ventures', 'invest'],
    },
    {
      id: 'l7',
      title: 'OnVibe: Content Worth Posting in the Age of AI Slop',
      cardType: 'learn', mediaType: 'blog', icon: 'megaphone', iconType: 'lucide',
      url: 'https://lgnova.com/news/as-ai-slop-floods-social-feeds-onvibes-social-media-marketing-platform-enhanced-with-agentic-ai-delivers-content-worth-posting',
      description: {
        small: 'How OnVibe uses agentic AI to create authentic social content.',
        medium: 'As AI slop floods social feeds, LG NOVA venture OnVibe uses agentic AI to deliver content worth posting.',
        large: 'OnVibe learns a brand\'s voice, surfaces relevant trends and automates publishing, now enhanced with agentic AI to cut through the flood of low-quality AI content.',
        overlay: 'Social feeds are filling with low-quality AI content. LG NOVA venture OnVibe takes the opposite approach: AI that learns a creator or small business\'s authentic voice, surfaces relevant trends and automates publishing. With new agentic AI capabilities, it turns constant content creation into a strategic, manageable engine for growth.',
      },
      tags: ['transformational', 'ventures'], targetRoles: ['corporate', 'investor', 'founder', 'browsing'],
      targetInterests: ['transformational', 'ventures'],
    },
    {
      id: 'l8',
      title: 'LG NOVA on YouTube',
      cardType: 'learn', mediaType: 'video', icon: 'play-circle', iconType: 'lucide',
      url: 'https://www.youtube.com/channel/UCHi4zPM0ga1eEOSVIrOewPg',
      description: {
        small: 'Talks, panels and venture stories from LG NOVA.',
        medium: 'Watch LG NOVA keynotes, InnoFest sessions, webinars and venture stories on YouTube.',
        large: 'The LG NOVA YouTube channel collects keynotes, InnoFest sessions, panels and stories from the ventures building AI-first businesses.',
        overlay: 'See LG NOVA in action: keynotes from Head of LG NOVA Sokwoo Rhee, InnoFest sessions, expert panels and stories from ventures like ReliefAI, PADO, Primefocus Health and OnVibe. Scan to watch, or save the card and the channel link arrives in your follow-up email.',
      },
      tags: ['browsing'], targetRoles: ALL,
      targetInterests: ['browsing', 'ventures'],
    },
    {
      id: 'l9',
      title: 'The LG NOVA Mission Hub',
      cardType: 'learn', mediaType: 'website', icon: 'globe', iconType: 'lucide',
      url: 'https://lgnova.com/mission-hub',
      description: {
        small: 'On-demand webinars, InnoFest recordings and more.',
        medium: 'Join the Mission Hub for on-demand webinars, InnoFest recordings and video playlists by topic.',
        large: 'The Mission Hub is LG NOVA\'s content platform: on-demand webinars, InnoFest keynotes and breakouts, topic playlists and expert speaker pages, free to join.',
        overlay: 'Mission Hub members get on-demand webinars like "24/7 CleanPower: The Path to a Decarbonized Future" and "Innovation 2025: Trends, Opportunities and Highlights," InnoFest keynote and breakout recordings, video playlists on venture building, ecosystem development, CleanTech, HealthTech and AI, and speaker pages for LG NOVA\'s experts. Registration is free.',
      },
      tags: ['browsing'], targetRoles: ALL,
      targetInterests: ['browsing', 'healthtech', 'cleantech', 'transformational'],
    },

    // ── Solutions / Ventures & Programs (12) ─────────────────────────
    {
      id: 's1',
      title: 'ReliefAI',
      cardType: 'solution', icon: 'heart-pulse', iconType: 'lucide',
      url: 'https://reliefai.co/',
      description: {
        small: 'Real-time mood insights for therapists through voice biomarkers.',
        medium: 'ReliefAI gives therapists continuous insight into patients\' emotional patterns through voice biomarkers.',
        large: 'Transforming mental healthcare: ReliefAI lets therapists access real-time mood insights through voice biomarkers, enabling faster interventions and better outcomes.',
        overlay: 'ReliefAI is an LG NOVA venture transforming mental healthcare. Using voice biomarkers, it gives therapists real-time mood insights so they can understand patients\' emotional patterns continuously, not just in session. The result is faster interventions, better outcomes and the ability to support more people, with growing relevance under the 2027 Physician Fee Schedule.',
      },
      tags: ['healthtech', 'ventures'], targetRoles: ['health', 'investor', 'corporate', 'browsing'],
      targetInterests: ['healthtech', 'ventures'],
    },
    {
      id: 's2',
      title: 'Primefocus Health',
      cardType: 'solution', icon: 'shield-check', iconType: 'lucide',
      url: 'https://primefocushealth.com/',
      description: {
        small: 'Specialist care for rural and underserved patients, delivered remotely.',
        medium: 'Primefocus Health brings specialist care once confined to urban centers to rural and underserved areas.',
        large: 'Reimagining specialist care delivery: Primefocus Health makes specialist care accessible remotely, expanding access and creating new economic models for healthcare.',
        overlay: 'Primefocus Health is an LG NOVA venture reimagining specialist care for patients in rural and underserved areas. Care once confined to urban medical centers is now accessible remotely, expanding access, improving outcomes and creating new economic models for healthcare delivery. Its work with Marshall Health Network now supports a breast cancer clinic.',
      },
      tags: ['healthtech', 'ventures', 'appalachia'], targetRoles: ['health', 'public-sector', 'investor', 'corporate', 'browsing'],
      targetInterests: ['healthtech', 'ventures', 'appalachia'],
    },
    {
      id: 's3',
      title: 'PADO AI',
      cardType: 'solution', icon: 'zap', iconType: 'lucide',
      url: 'https://pado.co/',
      description: {
        small: 'Real-time energy orchestration for AI data centers.',
        medium: 'PADO orchestrates power, cooling and compute in real time so data centers can run larger AI workloads.',
        large: 'PADO revolutionizes data center energy management, orchestrating power, cooling and compute in real time to handle larger AI workloads while cutting costs.',
        overlay: 'PADO AI is an LG NOVA venture turning energy from a constraint into a competitive advantage. By orchestrating power, cooling and computing in real time, data centers can handle exponentially larger AI workloads while reducing costs and generating new revenue. Its partnership with VESSL adds grid-aware MLOps to keep heavy AI workloads efficient.',
      },
      tags: ['cleantech', 'ventures'], targetRoles: ['energy', 'corporate', 'investor', 'browsing'],
      targetInterests: ['cleantech', 'ventures', 'transformational'],
    },
    {
      id: 's4',
      title: 'OnVibe',
      cardType: 'solution', icon: 'megaphone', iconType: 'lucide',
      url: 'https://onvibe.co/',
      description: {
        small: 'AI that learns your voice and runs your social presence.',
        medium: 'OnVibe helps creators and small businesses build an authentic social presence with AI that learns their voice.',
        large: 'OnVibe empowers creators and small businesses with AI that learns their voice, surfaces relevant trends and automates publishing.',
        overlay: 'OnVibe is an LG NOVA venture empowering content creators and small businesses to build an authentic social media presence. Its AI learns their voice, surfaces relevant trends and automates publishing, turning what was a full-time job of constant content creation into a strategic, manageable engine for growth.',
      },
      tags: ['transformational', 'ventures'], targetRoles: ['corporate', 'investor', 'founder', 'browsing'],
      targetInterests: ['transformational', 'ventures'],
    },
    {
      id: 's5',
      title: 'Praxium AI',
      cardType: 'solution', icon: 'graduation-cap', iconType: 'lucide',
      url: 'https://getpraxium.ai/',
      description: {
        small: 'Turn technical documents into training experiences.',
        medium: 'Praxium AI turns technical documents and knowledge into training for sales, marketing and L&D teams.',
        large: 'An LG NOVA seed project: Praxium AI turns technical documentation and knowledge into training experiences for sales, marketing and learning and development teams.',
        overlay: 'Praxium AI is one of LG NOVA\'s seed companies in the works. It is a platform for turning technical documents and institutional knowledge into training experiences for sales, marketing and learning and development teams, so expertise locked in documentation becomes something people can actually learn from.',
      },
      tags: ['transformational', 'ventures'], targetRoles: ['corporate', 'investor', 'founder', 'browsing'],
      targetInterests: ['transformational', 'ventures'],
    },
    {
      id: 's6',
      title: 'Prospectus',
      cardType: 'solution', icon: 'briefcase', iconType: 'lucide',
      url: 'https://www.lgnova.com/projects/prospectus',
      description: {
        small: 'AI that helps workers find and move to their next job.',
        medium: 'Prospectus is an AI platform helping workers optimize the value of their skills when changing jobs.',
        large: 'Prospectus supports workers in transitioning to new employment, and helps employers offboard people with dignity, treating them as alumni rather than a closed file.',
        overlay: 'Prospectus is an AI-enabled platform from LG NOVA that helps workers optimize the value of their skillset when finding and transitioning to new employment. For employers, it reframes layoffs around what happens next: offboarding people with dignity and treating them as alumni, not a closed file.',
      },
      tags: ['transformational', 'ventures'], targetRoles: ['corporate', 'investor', 'public-sector', 'browsing'],
      targetInterests: ['transformational', 'ventures'],
    },
    {
      id: 's7',
      title: 'LG NOVA Innovation Program',
      cardType: 'solution', icon: 'rocket', iconType: 'lucide',
      url: 'https://lgnova.com/join-the-mission/innovation-program',
      description: {
        small: 'Bring your startup to LG for collaboration and growth.',
        medium: 'Selected startups work with an LG NOVA entrepreneur-in-residence toward a POC and joint go-to-market with LG.',
        large: 'Apply anytime: selected startups co-develop a proposal and proof of concept with an LG NOVA entrepreneur-in-residence, then accelerate toward joint business with LG.',
        overlay: 'The LG NOVA Innovation Program is a call for startups to present ideas for collaboration and commercial opportunities with LG Electronics. Companies apply anytime; selected ones work closely with an entrepreneur-in-residence on a business proposal and proof of concept, and successful POCs move to an accelerated path for joint go-to-market. Selected startups also join the Mission Partner Network.',
      },
      tags: ['partner'], targetRoles: ['founder', 'investor', 'browsing'],
      targetInterests: ['partner', 'healthtech', 'cleantech', 'transformational'],
    },
    {
      id: 's8',
      title: 'Mission Partner Network',
      cardType: 'solution', icon: 'handshake', iconType: 'lucide',
      url: 'https://lgnova.com/2024-2025-startups',
      description: {
        small: 'Marketing, networking and investment access under the LG brand.',
        medium: 'Selected startups join LG NOVA\'s Mission Partner Network for marketing, networking and investment opportunities.',
        large: 'Startups chosen for LG NOVA\'s programs join the Mission Partner Network, gaining marketing, networking and investment opportunities under the LG brand.',
        overlay: 'Every startup selected for LG NOVA\'s programs becomes part of the Mission Partner Network, an exclusive group of companies chosen to explore business collaboration with LG. Members get access to marketing, networking and investment opportunities through LG NOVA, plus visibility alongside partners showcased at events like CES.',
      },
      tags: ['partner'], targetRoles: ['founder', 'investor', 'corporate', 'browsing'],
      targetInterests: ['partner', 'invest'],
    },
    {
      id: 's9',
      title: 'Elevate WV',
      cardType: 'solution', icon: 'map-pin', iconType: 'lucide',
      url: 'https://lgnova.com/elevate-wv',
      description: {
        small: 'Venture building for West Virginia and Appalachian founders.',
        medium: 'A 9–12 month program turning Appalachian startups into globally scalable, AI-first businesses.',
        large: 'Elevate WV pairs West Virginia and Appalachian entrepreneurs with LG NOVA\'s incubation team, investor network and pilot customers.',
        overlay: 'Elevate WV is LG NOVA\'s venture-building program for West Virginia and the Appalachian region. Selected founders work directly with the LG NOVA incubation team for 9–12 months, with potential investment from capital partners and access to pilots, customers, public-sector partnerships and LG\'s corporate network, focused on HealthTech, CleanTech and Transformational Tech.',
      },
      tags: ['appalachia', 'partner'], targetRoles: ['founder', 'public-sector', 'investor', 'browsing'],
      targetInterests: ['appalachia', 'partner'],
    },
    {
      id: 's10',
      title: 'West Virginia Innovation Hub',
      cardType: 'solution', icon: 'landmark', iconType: 'lucide',
      url: 'https://lgnova.com/west-virginia',
      description: {
        small: 'Building an AI-first innovation hub in West Virginia.',
        medium: 'LG NOVA is working with the State to grow an innovation hub of AI-first businesses, based in Morgantown.',
        large: 'With state government, business, academia and local organizations, LG NOVA is nurturing an innovation hub of AI-first businesses in West Virginia.',
        overlay: 'LG NOVA is collaborating with the State of West Virginia to nurture an innovation hub of new AI-first, technology-driven businesses. Based in Morgantown, near leading universities and innovation centers, it works with businesses, corporations and investors to bring innovation and economic development to the region across CleanTech, HealthTech and Transformational Tech.',
      },
      tags: ['appalachia'], targetRoles: ['public-sector', 'founder', 'investor', 'corporate', 'browsing'],
      targetInterests: ['appalachia', 'partner'],
    },
    {
      id: 's11',
      title: 'Coalition for Innovation',
      cardType: 'solution', icon: 'users', iconType: 'lucide',
      url: 'https://lgnova.com/coalition-for-innovation',
      description: {
        small: 'Collaborate with leaders shaping your industry\'s future.',
        medium: 'A coalition of leaders, innovators and experts collaborating on initiatives that impact markets and communities.',
        large: 'Join leaders, innovators and technologists to share trends and challenges, lead working groups, speak at events and gain recognition for your contribution.',
        overlay: 'The Coalition for Innovation brings together leaders, innovators, entrepreneurs, practitioners and technologists with expertise in a specific domain to collaborate on initiatives impacting the marketplace. Members connect with peers, can be named chair or co-chair of a group, gain speaking and media opportunities, and are recognized as contributing members.',
      },
      tags: ['partner'], targetRoles: ['corporate', 'public-sector', 'health', 'energy', 'investor', 'browsing'],
      targetInterests: ['partner', 'browsing'],
    },
    {
      id: 's12',
      title: 'Partner With LG NOVA',
      cardType: 'solution', icon: 'building-2', iconType: 'lucide',
      url: 'https://lgnova.com/contact',
      description: {
        small: 'Lead your industry\'s AI transformation with LG NOVA.',
        medium: 'Industry leaders, investors and collaborators can partner with LG NOVA\'s ventures and team.',
        large: 'Your industry is being transformed by AI. Partner with LG NOVA\'s ventures to lead that change, invest alongside us, or bring your expertise as a collaborator.',
        overlay: 'There are several ways to shape the future with LG NOVA. Industry leaders can partner with its ventures to lead their sector\'s AI transformation. Investors can back AI-first ventures through NovaWave Capital and LG NOVA\'s capital partners. Founders and domain experts can bring ideas where AI creates 10x impact. Save this card and the team will follow up.',
      },
      tags: ['partner', 'invest'], targetRoles: ALL,
      targetInterests: ['partner', 'invest', 'browsing'],
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
