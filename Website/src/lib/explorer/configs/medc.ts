// Explorer Config — McKinney Economic Development Corporation (MEDC)
// Public-private partnership recruiting businesses, startups, and
// developers to McKinney, TX — one of the fastest-growing cities in
// the country. No state income tax, no corporate income tax, business-
// friendly regulatory environment, and a $200K innovation fund for
// tech startups. Brand: deep teal + cream.

import type { ExplorerConfig, ThemeColors } from '../types';

const MEDC_DARK: ThemeColors = {
  // Brand-tinted dark UI tones derived from deep teal #013243
  // so dialog backgrounds and the Tools menu feel distinctly MEDC.
  bg: '#000F14',
  bgGradient: 'linear-gradient(135deg, #013243 0%, #011D27 55%, #000F14 100%)',
  surface: 'rgba(255,255,255,0.06)',
  surfaceHover: 'rgba(255,255,255,0.10)',
  border: 'rgba(255,255,255,0.12)',
  borderFocus: '#6BB1CC',
  text1: '#FFFFFF',
  text2: 'rgba(255,255,255,0.78)',
  text3: 'rgba(255,255,255,0.52)',
  inputBg: 'rgba(255,255,255,0.08)',
  inputText: '#FFFFFF',
  inputPlaceholder: 'rgba(255,255,255,0.40)',
  logoText: '#F6F1E9',
  focusRing: 'rgba(1,50,67,0.30)',
};

const MEDC_LIGHT: ThemeColors = {
  // Light theme leans into the brand cream (#F6F1E9) for a warm,
  // crisp economic-development feel.
  bg: '#F6F1E9',
  bgGradient: 'linear-gradient(180deg, #FBF8F2 0%, #F1ECE2 100%)',
  surface: 'rgba(255,255,255,0.90)',
  surfaceHover: 'rgba(255,255,255,0.98)',
  border: 'rgba(1,50,67,0.12)',
  borderFocus: '#013243',
  text1: '#013243',
  text2: 'rgba(1,50,67,0.70)',
  text3: 'rgba(1,50,67,0.45)',
  inputBg: '#FFFFFF',
  inputText: '#013243',
  inputPlaceholder: 'rgba(1,50,67,0.40)',
  logoText: '#013243',
  focusRing: 'rgba(1,50,67,0.16)',
};

export const MEDC_CONFIG: ExplorerConfig = {
  id: 'medc',
  name: 'McKinney EDC Explorer',
  version: 1,
  createdAt: '2026-06-23T00:00:00.000Z',
  updatedAt: '2026-06-23T00:00:00.000Z',

  branding: {
    logo: {
      dark: '/brand/assets/medc-logo-reverse.png',  // cream wordmark for dark bg
      light: '/brand/assets/medc-logo.png',         // teal wordmark for light bg
    },
    // MEDC wordmark — 993×472 cropped (~2.1:1 aspect). 42px gives
    // both the Texas-with-star mark and the "McKINNEY EDC" type
    // room to breathe at kiosk distance.
    logoHeight: 42,
    icon: '/brand/assets/medc-icon.jpg',
    colors: {
      primary: '#013243',   // MEDC deep teal — main accent
      secondary: '#F6F1E9', // MEDC cream — second anchor
      teal: '#6BB1CC',      // brighter sky teal for hover/focus on dark
      blue: '#013243',
      deepBlue: '#011D27',
      // midnight + navy drive dialog backgrounds + overlay backdrop.
      // Both pulled from the deep teal hue so dialogs stay on-brand.
      navy: '#012E3D',
      midnight: '#001218',
      plum: '#3A2A1F',      // warm brown — complements the cream
      bgDark: '#000F14',
      dark: MEDC_DARK,
      light: MEDC_LIGHT,
    },
    font: "'Inter', -apple-system, sans-serif",
    backgroundPattern: 'none',
    auroraOrbs: {
      orb1: 'rgba(1,50,67,0.22)',      // deep teal
      orb2: 'rgba(107,177,204,0.16)',  // bright sky teal
      orb3: 'rgba(246,241,233,0.10)',  // cream highlight
    },
    // CTA = deep teal → bright sky teal (within-brand, polished feel)
    ctaGradient: 'linear-gradient(135deg, #013243 0%, #1A6280 100%)',
    ctaTextColor: '#F6F1E9',
    // Headline gradient: cream → bright sky teal pops on the dark splash
    gradientWord: 'linear-gradient(135deg, #F6F1E9 0%, #6BB1CC 100%)',
    // Per-role glows: each role lands on a slightly different teal /
    // cream / warm-brown mix so navigating roles feels like chapters.
    roleBackgrounds: {
      'site-selector': 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(1,50,67,0.32) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 15% 15%, rgba(107,177,204,0.18) 0%, transparent 55%)',
      'business-owner': 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(107,177,204,0.22) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 85% 15%, rgba(1,50,67,0.18) 0%, transparent 55%)',
      'tech-startup': 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(26,98,128,0.28) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 25% 15%, rgba(107,177,204,0.18) 0%, transparent 55%)',
      'developer': 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(1,50,67,0.30) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 85% 25%, rgba(246,241,233,0.10) 0%, transparent 55%)',
      'resident': 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(58,42,31,0.22) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 15% 25%, rgba(107,177,204,0.14) 0%, transparent 55%)',
      'visitor': 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(107,177,204,0.22) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 75% 15%, rgba(246,241,233,0.10) 0%, transparent 55%)',
      'press': 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(58,42,31,0.26) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 85% 25%, rgba(1,50,67,0.18) 0%, transparent 55%)',
      'browsing': 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(1,50,67,0.18) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 15% 15%, rgba(107,177,204,0.10) 0%, transparent 55%)',
    },
  },

  registration: {
    modes: ['form', 'scan', 'search'],
    defaultMode: 'form',
    formTitle: 'Welcome to McKinney EDC',
    formSubtitle: 'Share a quick intro so we can tailor your tour.',
    scanLabel: 'Scan Your Badge',
    scanHint: 'Hold the QR code in front of the camera',
    searchPlaceholder: 'Search by last name...',
    optInText: 'By sharing your information you consent to McKinney Economic Development Corporation processing your data to fulfill your request and send relevant follow-up communications.',
    showLocaleButton: false,
    idleTimeoutMs: 10000,
    skipEnabled: true,
    fields: [
      { id: 'firstName', label: 'First Name', type: 'text', placeholder: 'First name', required: true, halfWidth: true },
      { id: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Last name', required: true, halfWidth: true },
      { id: 'email', label: 'Work Email', type: 'email', placeholder: 'name@company.com', required: true, halfWidth: true },
      { id: 'phone', label: 'Phone', type: 'tel', placeholder: '(555) 555-5555', required: false, halfWidth: true },
      { id: 'company', label: 'Company', type: 'text', placeholder: 'Company or project name', required: false, halfWidth: true },
      { id: 'title', label: 'Title', type: 'text', placeholder: 'Your role', required: false, halfWidth: true },
    ],
  },

  steps: [
    {
      type: 'splash',
      id: 'welcome',
      // Two-line headline: solid white line + gradient line
      title: 'Texas\'s Fastest',
      gradientWord: 'Growing Opportunity.',
      subtitle: 'No state income tax, no corporate income tax, and the #1 real estate market in America. McKinney EDC connects site selectors, founders, and developers with the people, incentives, and infrastructure to thrive in North Texas.',
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
      title: 'What brings you to McKinney?',
      subtitle: 'Select the option that fits you best.',
      showGreeting: true,
      showSelectAll: false,
      options: [
        { value: 'site-selector', label: 'Site Selector', icon: 'search', iconType: 'lucide' },
        { value: 'business-owner', label: 'Business Owner', icon: 'store', iconType: 'lucide' },
        { value: 'tech-startup', label: 'Tech Startup', icon: 'rocket', iconType: 'lucide' },
        { value: 'developer', label: 'Real Estate Developer', icon: 'landmark', iconType: 'lucide' },
        { value: 'resident', label: 'Resident / Community', icon: 'heart', iconType: 'lucide' },
        { value: 'visitor', label: 'Visitor / Planner', icon: 'map-pin', iconType: 'lucide' },
        { value: 'press', label: 'Press / Media', icon: 'megaphone', iconType: 'lucide' },
        { value: 'browsing', label: 'Just Visiting', icon: 'compass', iconType: 'lucide' },
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
        { value: 'incentives', label: 'Incentive Packages', icon: 'dollar-sign', iconType: 'lucide',
          relevantRoles: ['site-selector', 'business-owner', 'developer', 'tech-startup'] },
        { value: 'site-selection', label: 'Site Selection', icon: 'search', iconType: 'lucide',
          relevantRoles: ['site-selector', 'business-owner', 'developer'] },
        { value: 'innovation-fund', label: 'Innovation Fund', icon: 'rocket', iconType: 'lucide',
          relevantRoles: ['tech-startup', 'business-owner', 'site-selector'] },
        { value: 'real-estate', label: 'Real Estate', icon: 'landmark', iconType: 'lucide',
          relevantRoles: ['developer', 'business-owner', 'site-selector', 'resident'] },
        { value: 'workforce', label: 'Workforce & Talent', icon: 'users', iconType: 'lucide',
          relevantRoles: ['business-owner', 'tech-startup', 'site-selector', 'developer'] },
        { value: 'quality-of-life', label: 'Quality of Life', icon: 'heart', iconType: 'lucide',
          relevantRoles: ['resident', 'visitor', 'business-owner', 'press', 'browsing'] },
        { value: 'business-resources', label: 'Business Resources', icon: 'briefcase', iconType: 'lucide',
          relevantRoles: ['business-owner', 'tech-startup', 'site-selector'] },
        { value: 'browsing', label: 'Just Browsing', icon: 'compass', iconType: 'lucide',
          relevantRoles: ['site-selector', 'business-owner', 'tech-startup', 'developer', 'resident', 'visitor', 'press', 'browsing'] },
      ],
    },
    {
      type: 'results',
      id: 'results',
      title: 'Your Personalized Tour',
      subtitle: 'Programs, incentives, and stories tailored to why you stopped by.',
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
            { label: 'PDF', value: 'pdf' },
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
      subtitle: 'Review your picks and a McKinney EDC partner will follow up.',
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
      subtitle: 'A McKinney EDC partner will be in touch shortly.',
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
    //   site-selector  : incentives, site-selection, innovation-fund,
    //                    real-estate, workforce, business-resources, browsing
    //   business-owner : incentives, site-selection, innovation-fund,
    //                    real-estate, workforce, quality-of-life,
    //                    business-resources, browsing
    //   tech-startup   : innovation-fund, workforce, business-resources,
    //                    browsing
    //   developer      : incentives, site-selection, real-estate,
    //                    workforce, browsing
    //   resident       : real-estate, quality-of-life, browsing
    //   visitor        : quality-of-life, browsing
    //   press          : quality-of-life, browsing
    //   browsing       : (catch-all — all interests)
    // ─────────────────────────────────────────────────────────────────

    // ── Outcomes / Impact (7) ─────────────────────────
    {
      id: 'o1',
      title: '#1 Best Real Estate Market',
      cardType: 'outcome',
      icon: 'award',
      iconType: 'lucide',
      stat: '#1',
      description: {
        small: 'Ranked #1 Best Real Estate Market by Wallethub (2024).',
        medium: 'McKinney ranked the #1 Best Real Estate Market in America by Wallethub in 2024.',
        large: 'McKinney took the #1 spot on Wallethub\'s 2024 Best Real Estate Markets ranking — outperforming every other US metro on demand, growth, and affordability.',
        overlay: 'Wallethub\'s 2024 Best Real Estate Markets study ranked McKinney #1 in America — beating every other US metro on the composite of housing demand, price growth, days-on-market, and affordability. The same fundamentals that earn a top consumer real-estate ranking also signal a long runway for commercial development and corporate relocation.',
      },
      tags: ['real-estate'],
      targetRoles: ['site-selector', 'business-owner', 'developer', 'resident', 'browsing'],
      targetInterests: ['real-estate', 'quality-of-life'],
    },
    {
      id: 'o2',
      title: '379% Population Growth',
      cardType: 'outcome',
      icon: 'trending-up',
      iconType: 'lucide',
      stat: '379%',
      description: {
        small: '379% population growth from 1999 to 2019.',
        medium: 'McKinney grew 379% in population over a 20-year window (1999-2019).',
        large: 'A 379% population gain from 1999 to 2019 puts McKinney in a different growth class than virtually every other US city. The 4th-fastest-growing-city ranking is the byproduct.',
        overlay: 'From 1999 to 2019 McKinney\'s population grew 379%. That kind of compounding growth attracts the rooftops, the labor pool, and the rooftop-driven commercial demand a relocating business needs. The city is one of the 4 fastest-growing in the United States and the trajectory hasn\'t slowed.',
      },
      tags: ['workforce', 'quality-of-life'],
      targetRoles: ['site-selector', 'business-owner', 'developer', 'tech-startup', 'press', 'browsing'],
      targetInterests: ['workforce', 'quality-of-life', 'real-estate'],
    },
    {
      id: 'o3',
      title: '224,043 Residents',
      cardType: 'outcome',
      icon: 'users',
      iconType: 'lucide',
      stat: '224K',
      description: {
        small: 'McKinney population: 224,043 and growing.',
        medium: 'A city of 224,043 inside the Dallas-Fort Worth Metroplex — with a 601,539 county workforce.',
        large: 'McKinney is home to 224,043 residents inside the DFW Metroplex. The Collin County labor pool is 601,539 strong — most highly-educated workforce in Texas.',
        overlay: 'McKinney itself is a city of 224,043 — large enough to deliver scale, small enough to keep its character. The broader Collin County workforce — 601,539 strong — is the candidate pool you draw from when you site here. Median age of 34 means a young, growing, prime-of-career workforce.',
      },
      tags: ['workforce'],
      targetRoles: ['business-owner', 'site-selector', 'tech-startup', 'developer'],
      targetInterests: ['workforce'],
    },
    {
      id: 'o4',
      title: '$200K Innovation Grants',
      cardType: 'outcome',
      icon: 'rocket',
      iconType: 'lucide',
      stat: '$200K',
      description: {
        small: 'Up to $200K nondilutive grants for tech startups.',
        medium: 'The McKinney Innovation Fund deploys up to $200,000 in nondilutive grants to qualifying tech startups.',
        large: 'McKinney EDC operates a dedicated Innovation Fund that awards up to $200,000 in nondilutive grants to early-stage tech companies relocating to or expanding in McKinney.',
        overlay: 'The McKinney Innovation Fund awards qualifying early-stage tech companies up to $200,000 in NONDILUTIVE grants — no equity, no convertible note, no royalty take. The capital is paired with introductions to McKinney\'s tech-employer ecosystem and city-government access for permits, hiring, and infrastructure. Eligibility is rolling — talk to the EDC about your raise.',
      },
      tags: ['innovation-fund', 'incentives'],
      targetRoles: ['tech-startup', 'business-owner', 'site-selector'],
      targetInterests: ['innovation-fund', 'incentives'],
    },
    {
      id: 'o5',
      title: '4th Fastest Growing City',
      cardType: 'outcome',
      icon: 'rocket',
      iconType: 'lucide',
      stat: '4th',
      description: {
        small: '4th fastest growing city in the United States.',
        medium: 'McKinney is one of the 4 fastest-growing cities in the United States.',
        large: 'Per US Census data, McKinney consistently ranks among the top 4 fastest-growing cities in America — driven by relocations, jobs, and quality of life.',
        overlay: 'A top-4 fastest-growing-city ranking isn\'t a one-year statistical blip — McKinney has been on the list multiple years running, fueled by company relocations, the DFW labor draw, a top school district, and one of the lowest tax burdens in the country.',
      },
      tags: ['workforce', 'quality-of-life'],
      targetRoles: ['site-selector', 'business-owner', 'developer', 'press', 'visitor', 'browsing'],
      targetInterests: ['workforce', 'real-estate', 'quality-of-life'],
    },
    {
      id: 'o6',
      title: 'Zero State Income Tax',
      cardType: 'outcome',
      icon: 'dollar-sign',
      iconType: 'lucide',
      stat: '0%',
      description: {
        small: 'No state personal or corporate income tax.',
        medium: 'Texas has no state personal income tax and no corporate income tax. Franchise tax is 2% or below.',
        large: 'Texas\'s no-personal-income-tax and no-corporate-income-tax regime is one of the most business-friendly in the country. Franchise tax (the closest equivalent to a state corporate tax) stays at 2% or below.',
        overlay: 'Texas charges no state personal income tax and no state corporate income tax. The franchise tax (the state\'s margin tax) maxes out at 2% — and for many revenue tiers, zero. Combined with McKinney\'s local incentive packages, the effective tax cost of doing business here is among the lowest in the United States.',
      },
      tags: ['incentives'],
      targetRoles: ['site-selector', 'business-owner', 'tech-startup', 'developer', 'browsing'],
      targetInterests: ['incentives', 'business-resources'],
    },
    {
      id: 'o7',
      title: '33.6% Bachelor\'s or Higher',
      cardType: 'outcome',
      icon: 'graduation-cap',
      iconType: 'lucide',
      stat: '33.6%',
      description: {
        small: '33.6% of residents hold a bachelor\'s degree or higher.',
        medium: 'Educated workforce: 33.6% hold a bachelor\'s, 19.9% a graduate degree or higher.',
        large: '33.6% of the local workforce (246,796 people) holds a bachelor\'s degree or higher, and 19.9% (146,230 people) hold a graduate degree — both well above national averages.',
        overlay: 'McKinney\'s workforce skews highly educated — 33.6% (246,796 people) hold a bachelor\'s degree or higher, and 19.9% (146,230 people) hold a graduate degree or higher. Both figures are well above the national average and reflect the quality of the talent pool that comes with the DFW metro, top-rated K-12, and major university access.',
      },
      tags: ['workforce'],
      targetRoles: ['business-owner', 'tech-startup', 'site-selector', 'developer'],
      targetInterests: ['workforce'],
    },

    // ── Learn / Discover (8) ──────────────────────────
    {
      id: 'l1',
      title: 'About McKinney EDC',
      cardType: 'learn',
      mediaType: 'website',
      icon: 'info',
      iconType: 'lucide',
      url: 'https://uniquemckinney.com/',
      description: {
        small: 'How McKinney EDC partners with relocating businesses.',
        medium: 'How McKinney EDC partners with site selectors, founders, and developers to recruit and retain businesses.',
        large: 'McKinney EDC is the public-private partner that markets the city to relocating businesses, runs the incentive program, manages the Innovation Fund, and connects companies with permits, talent, and infrastructure.',
        overlay: 'McKinney EDC is the city\'s public-private partner for business attraction, retention, and expansion. The team handles incentive packaging, site identification, infrastructure questions, workforce connections, and government navigation — one phone call replaces a dozen.',
      },
      tags: ['business-resources'],
      targetRoles: ['site-selector', 'business-owner', 'developer', 'tech-startup', 'press', 'browsing'],
      targetInterests: ['business-resources', 'browsing'],
    },
    {
      id: 'l2',
      title: 'Incentive Packages Overview',
      cardType: 'learn',
      mediaType: 'website',
      icon: 'dollar-sign',
      iconType: 'lucide',
      url: 'https://uniquemckinney.com/',
      description: {
        small: 'Tax abatements, grants, and incentive structures.',
        medium: 'How McKinney EDC structures incentive packages — tax abatements, performance grants, infrastructure cost-share.',
        large: 'McKinney EDC tailors incentive packages to each relocating or expanding company — tax abatements, performance grants, infrastructure cost-share, and workforce training credits. Talk to the EDC for your specific terms.',
        overlay: 'McKinney EDC tailors incentive packages to the relocating business: real and personal property tax abatements, performance grants tied to capital investment + job creation, infrastructure cost-share (utilities, road improvements), workforce training credits, and fast-track permitting. Every package is structured around the company\'s capex commitment, headcount, and average wage targets.',
      },
      tags: ['incentives'],
      targetRoles: ['site-selector', 'business-owner', 'tech-startup', 'developer'],
      targetInterests: ['incentives'],
    },
    {
      id: 'l3',
      title: 'McKinney Innovation Fund',
      cardType: 'learn',
      mediaType: 'website',
      icon: 'rocket',
      iconType: 'lucide',
      url: 'https://uniquemckinney.com/',
      description: {
        small: 'How tech startups apply for up to $200K nondilutive.',
        medium: 'Eligibility, criteria, and application process for the McKinney Innovation Fund.',
        large: 'The McKinney Innovation Fund awards qualifying early-stage tech startups up to $200,000 in nondilutive grant capital. This page covers eligibility (revenue stage, tech sector, McKinney commitment), criteria, and how to apply.',
        overlay: 'The McKinney Innovation Fund deploys up to $200,000 per company in nondilutive grants for early-stage tech startups committed to McKinney. Eligibility centers on tech focus, growth potential, jobs created, and capital invested locally. Applications run rolling — start with a conversation with the EDC team to understand fit before formal application.',
      },
      tags: ['innovation-fund', 'incentives'],
      targetRoles: ['tech-startup', 'business-owner', 'site-selector'],
      targetInterests: ['innovation-fund', 'incentives'],
    },
    {
      id: 'l4',
      title: 'Demographics & Workforce Data',
      cardType: 'learn',
      mediaType: 'website',
      icon: 'users',
      iconType: 'lucide',
      url: 'https://uniquemckinney.com/',
      description: {
        small: 'Population, workforce, education, income data.',
        medium: 'Detailed demographics and workforce data for McKinney and Collin County.',
        large: 'A complete demographics + workforce dashboard for McKinney and Collin County — population, age, education levels, household income, commute patterns, and labor-force participation.',
        overlay: 'Everything a site selector needs: McKinney population (224,043), Collin County workforce (601,539), median age (34), education levels (33.6% bachelor\'s or higher), median household income, commute patterns, and labor-force participation rates. Used by EDC analysts and shared on request.',
      },
      tags: ['workforce'],
      targetRoles: ['site-selector', 'business-owner', 'tech-startup', 'developer', 'press'],
      targetInterests: ['workforce'],
    },
    {
      id: 'l5',
      title: 'McKinney National Airport',
      cardType: 'learn',
      mediaType: 'website',
      icon: 'send',
      iconType: 'lucide',
      url: 'https://uniquemckinney.com/',
      description: {
        small: 'Corporate jet access via McKinney National Airport.',
        medium: 'McKinney National Airport provides direct corporate jet access — a runway, hangars, and ground services.',
        large: 'McKinney National Airport offers corporate and general aviation access — runway capacity for business jets, hangar leases, FBO services, and a clear path to commercial service expansion.',
        overlay: 'McKinney National Airport (KTKI) is the corporate-aviation arm of the city: capacity for mid-size business jets, hangar leases for corporate flight departments, FBO services, and access to the DFW air corridor without DFW traffic. Long-term plans include scoping toward commercial passenger service.',
      },
      tags: ['business-resources'],
      targetRoles: ['site-selector', 'business-owner', 'developer'],
      targetInterests: ['business-resources'],
    },
    {
      id: 'l6',
      title: 'Schools & Higher Education',
      cardType: 'learn',
      mediaType: 'website',
      icon: 'graduation-cap',
      iconType: 'lucide',
      url: 'https://uniquemckinney.com/',
      description: {
        small: 'Top-ranked K-12 + access to DFW universities.',
        medium: 'Top-rated McKinney ISD schools plus direct access to UNT, UT Dallas, SMU, and Collin College.',
        large: 'McKinney ISD\'s top-ranked schools are a key relocation draw. Higher education access includes UT Dallas, UNT, SMU, Collin College, and dozens of other regional institutions inside the DFW metro.',
        overlay: 'McKinney Independent School District is consistently among the top-rated districts in Texas and a primary draw for relocating families. For postsecondary talent, Collin College (multi-campus, McKinney-adjacent), UT Dallas, UNT, SMU, and over a dozen other DFW-metro institutions feed the local talent pipeline.',
      },
      tags: ['workforce', 'quality-of-life'],
      targetRoles: ['business-owner', 'tech-startup', 'resident', 'site-selector'],
      targetInterests: ['workforce', 'quality-of-life'],
    },
    {
      id: 'l7',
      title: 'Quality of Life in McKinney',
      cardType: 'learn',
      mediaType: 'website',
      icon: 'heart',
      iconType: 'lucide',
      url: 'https://uniquemckinney.com/',
      description: {
        small: 'Dining, shopping, parks, historic downtown.',
        medium: 'Historic downtown, miles of parks, recognized safety, and a vibrant dining + events scene.',
        large: 'McKinney consistently ranks among the safest US cities, has a vibrant historic downtown, miles of parks and natural spaces, and a dining + events calendar that draws across the metro.',
        overlay: 'Beyond the business case: McKinney consistently ranks among the safest US cities, has a historic downtown that draws regional visitors, miles of parks and natural spaces, top dining, and a year-round events calendar. The quality-of-life pitch makes recruiting easier — your future employees can imagine living here.',
      },
      tags: ['quality-of-life'],
      targetRoles: ['resident', 'visitor', 'business-owner', 'press', 'browsing'],
      targetInterests: ['quality-of-life'],
    },
    {
      id: 'l8',
      title: 'Schedule a Site Visit',
      cardType: 'learn',
      mediaType: 'website',
      icon: 'calendar',
      iconType: 'lucide',
      url: 'https://uniquemckinney.com/',
      description: {
        small: 'Book a 1:1 tour with the McKinney EDC team.',
        medium: 'Schedule a private tour — sites, incentives, infrastructure, and city leadership intros.',
        large: 'Book a private site visit with the McKinney EDC team. Customized agenda covering candidate sites, incentive structuring, infrastructure walkthroughs, and intros to city leadership.',
        overlay: 'Book a private site visit with the McKinney EDC team. They\'ll build the agenda around your priorities: candidate properties (existing buildings, greenfield sites), incentive structuring conversations, infrastructure walkthroughs (utilities, fiber, road access), and direct intros to city leadership for fast permitting and partnership work. Hosted in McKinney at 7300 SH 121 SB Suite 200.',
      },
      tags: ['site-selection', 'business-resources'],
      targetRoles: ['site-selector', 'business-owner', 'tech-startup', 'developer'],
      targetInterests: ['site-selection', 'business-resources'],
    },

    // ── Solutions / Programs (7) ──────────────────────
    {
      id: 's1',
      title: 'Site Selection Services',
      cardType: 'solution',
      icon: 'search',
      iconType: 'lucide',
      url: 'https://uniquemckinney.com/',
      description: {
        small: 'Free property search + matching with EDC analysts.',
        medium: 'EDC analysts work site selectors through every available property — existing buildings, greenfield, mixed-use.',
        large: 'McKinney EDC\'s site-selection team operates a free, fast service for relocating and expanding businesses: candidate property lists, walkthroughs, infrastructure verification, and competitive intelligence on neighboring markets.',
        overlay: 'McKinney EDC operates a no-cost site-selection service. Tell the team your spec (sq ft, lot size, infrastructure, headcount, timeline) and they return a candidate list with current property availability, walkthroughs, infrastructure verification, neighboring-market comparables, and incentive scope. Most engagements move from intro call to candidate shortlist in under a week.',
      },
      tags: ['site-selection'],
      targetRoles: ['site-selector', 'business-owner', 'developer'],
      targetInterests: ['site-selection'],
    },
    {
      id: 's2',
      title: 'Economic Incentives',
      cardType: 'solution',
      icon: 'dollar-sign',
      iconType: 'lucide',
      url: 'https://uniquemckinney.com/',
      description: {
        small: 'Tax abatements, performance grants, cost-share.',
        medium: 'Structured packages: tax abatements, performance grants, infrastructure cost-share, workforce training credits.',
        large: 'Every relocating or expanding business in McKinney gets a custom incentive package — built around capex, jobs created, and average wage targets. Tax abatements, performance grants, infrastructure cost-share, and training credits.',
        overlay: 'McKinney EDC custom-structures incentive packages for relocating + expanding businesses. The toolkit: real and personal property tax abatements (negotiated terms), performance grants paid against capex + headcount milestones, infrastructure cost-share for utilities and road improvements, workforce training credits via partner colleges, and fast-track permitting. Every package is built around the specific company, not a one-size template.',
      },
      tags: ['incentives'],
      targetRoles: ['site-selector', 'business-owner', 'tech-startup', 'developer'],
      targetInterests: ['incentives'],
    },
    {
      id: 's3',
      title: 'McKinney Innovation Fund',
      cardType: 'solution',
      icon: 'rocket',
      iconType: 'lucide',
      url: 'https://uniquemckinney.com/',
      description: {
        small: 'Up to $200K nondilutive for qualifying tech startups.',
        medium: 'Up to $200,000 in nondilutive grants for early-stage tech startups committing to McKinney.',
        large: 'The Innovation Fund deploys up to $200,000 per company in nondilutive grant capital to qualifying early-stage tech startups — paired with intros, permits, and city access. No equity, no convertible note.',
        overlay: 'The Innovation Fund is McKinney EDC\'s startup-specific incentive vehicle: up to $200,000 in NONDILUTIVE grant capital for qualifying early-stage tech companies committed to building in McKinney. The capital comes with introductions to the local tech-employer ecosystem, city-government access for permits and infrastructure, and the EDC team\'s active sponsorship. No equity, no convertible note, no royalty take.',
      },
      tags: ['innovation-fund', 'incentives'],
      targetRoles: ['tech-startup', 'business-owner', 'site-selector'],
      targetInterests: ['innovation-fund', 'incentives'],
    },
    {
      id: 's4',
      title: 'Business Relocation Support',
      cardType: 'solution',
      icon: 'briefcase',
      iconType: 'lucide',
      url: 'https://uniquemckinney.com/',
      description: {
        small: 'End-to-end relocation: sites, permits, talent.',
        medium: 'Single-point-of-contact relocation support: sites, incentives, permits, talent, infrastructure.',
        large: 'McKinney EDC acts as a single point of contact for relocating businesses — coordinating sites, incentive packaging, permits, talent acquisition intros, infrastructure, and the city-government navigation in between.',
        overlay: 'When you relocate or expand to McKinney, the EDC team is your single point of contact. They coordinate site identification, incentive packaging, the permitting walkthrough, infrastructure verification (utilities, fiber, freight), talent acquisition intros (recruiters, partner colleges), and the entire city-government navigation. One relationship instead of a dozen agency contacts.',
      },
      tags: ['business-resources', 'site-selection'],
      targetRoles: ['site-selector', 'business-owner', 'tech-startup', 'developer'],
      targetInterests: ['business-resources', 'site-selection'],
    },
    {
      id: 's5',
      title: 'Expansion & Retention',
      cardType: 'solution',
      icon: 'trending-up',
      iconType: 'lucide',
      url: 'https://uniquemckinney.com/',
      description: {
        small: 'Support for businesses already located here.',
        medium: 'Expansion incentives, additional permits, workforce reskilling for existing McKinney employers.',
        large: 'McKinney EDC\'s expansion + retention program supports businesses already located here — expansion incentives, additional permits, workforce reskilling, supplier development, and connection to other local employers.',
        overlay: 'If you already operate in McKinney, the EDC team supports your next chapter: expansion incentive packages for additional capex or headcount, fast-track permits for new facilities or upfits, workforce reskilling through Collin College partnerships, supplier development to keep more procurement local, and intros to peer employers for shared services. The Innovation Fund extends to existing companies launching new ventures.',
      },
      tags: ['incentives', 'business-resources'],
      targetRoles: ['business-owner', 'tech-startup', 'developer'],
      targetInterests: ['incentives', 'business-resources'],
    },
    {
      id: 's6',
      title: 'Infrastructure & Development',
      cardType: 'solution',
      icon: 'landmark',
      iconType: 'lucide',
      url: 'https://uniquemckinney.com/',
      description: {
        small: 'Roads, utilities, fiber, airport, freight access.',
        medium: 'Infrastructure readiness — roads, utilities, fiber, McKinney National Airport, freight access.',
        large: 'McKinney\'s infrastructure: arterial road network across the city, multi-utility capacity, fiber availability, McKinney National Airport for corporate aviation, and freight access via SH 121 / US 75 corridors.',
        overlay: 'Infrastructure is the under-the-fold story that decides whether a relocation happens: McKinney runs a planned arterial network with multi-utility capacity, fiber availability with the major providers, McKinney National Airport for corporate aviation, freight access via the SH 121 and US 75 corridors, and water/sewer planning that anticipates the next 20 years of growth — not the last 20.',
      },
      tags: ['real-estate', 'business-resources'],
      targetRoles: ['developer', 'site-selector', 'business-owner'],
      targetInterests: ['real-estate', 'business-resources'],
    },
    {
      id: 's7',
      title: 'Workforce & Talent',
      cardType: 'solution',
      icon: 'users',
      iconType: 'lucide',
      url: 'https://uniquemckinney.com/',
      description: {
        small: 'Talent pipeline + partner-college training.',
        medium: 'Talent pipeline from McKinney ISD, Collin College, and the broader DFW university network.',
        large: 'McKinney\'s workforce pipeline: McKinney ISD K-12 (top-ranked), Collin College (CTE + transfer), UT Dallas / UNT / SMU within commute, and 600K+ Collin County labor pool.',
        overlay: 'Talent strategy in McKinney sits on a four-leg base: McKinney ISD (top-ranked K-12 producing high school grads with technical and college-readiness paths), Collin College (multi-campus CTE + university transfer programs custom-shaped to employer demand), UT Dallas + UNT + SMU within reasonable commute distance, and a 601,539-strong Collin County labor pool. The EDC plugs companies into all four.',
      },
      tags: ['workforce'],
      targetRoles: ['business-owner', 'tech-startup', 'site-selector', 'developer'],
      targetInterests: ['workforce'],
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
