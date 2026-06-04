// Explorer Config — Credit Union of Texas (CUTX)
// Member-owned credit union serving North + East Texas. Better banking,
// real community investment ($19.8M+ to date), member benefits like
// free telehealth, scholarships, and the Save the Change program.
// Brand: CUTX blue + CUTX green.

import type { ExplorerConfig, ThemeColors } from '../types';

const CUTX_DARK: ThemeColors = {
  // bg drives --exp-bg → Tools dropdown / menu backgrounds.
  // Tinted toward CUTX blue so menus feel branded.
  bg: '#001628',
  bgGradient: 'linear-gradient(135deg, #005290 0%, #003C6B 55%, #001628 100%)',
  surface: 'rgba(255,255,255,0.06)',
  surfaceHover: 'rgba(255,255,255,0.10)',
  border: 'rgba(255,255,255,0.12)',
  borderFocus: '#3399D6',
  text1: '#FFFFFF',
  text2: 'rgba(255,255,255,0.78)',
  text3: 'rgba(255,255,255,0.52)',
  inputBg: 'rgba(255,255,255,0.08)',
  inputText: '#FFFFFF',
  inputPlaceholder: 'rgba(255,255,255,0.40)',
  logoText: '#FFFFFF',
  focusRing: 'rgba(0,82,144,0.22)',
};

const CUTX_LIGHT: ThemeColors = {
  bg: '#F4F6FA',
  bgGradient: 'linear-gradient(180deg, #F4F6FA 0%, #EDF2F8 100%)',
  surface: 'rgba(255,255,255,0.88)',
  surfaceHover: 'rgba(255,255,255,0.96)',
  border: 'rgba(0,60,107,0.10)',
  borderFocus: '#003C6B',
  text1: '#001628',
  text2: 'rgba(0,22,40,0.68)',
  text3: 'rgba(0,22,40,0.45)',
  inputBg: '#FFFFFF',
  inputText: '#001628',
  inputPlaceholder: 'rgba(0,22,40,0.38)',
  logoText: '#001628',
  focusRing: 'rgba(0,82,144,0.14)',
};

export const CUTX_CONFIG: ExplorerConfig = {
  id: 'cutx',
  name: 'CUTX Explorer',
  version: 1,
  createdAt: '2026-06-03T00:00:00.000Z',
  updatedAt: '2026-06-03T00:00:00.000Z',

  branding: {
    logo: {
      dark: '/brand/assets/cutx-logo-reverse.png',
      light: '/brand/assets/cutx-logo.png',
    },
    // CUTX wordmark — 1080×320 (3.375:1 aspect). 36px matches the
    // standard horizontal-wordmark treatment.
    logoHeight: 36,
    icon: '/brand/assets/cutx-icon.jpg',
    colors: {
      primary: '#005290',   // CUTX blue
      secondary: '#7FBE00', // CUTX green
      teal: '#3399D6',      // lighter CUTX blue for hover/focus
      blue: '#005290',
      deepBlue: '#003C6B',
      // midnight + navy are dark UI tones — drive dialog backgrounds
      // and overlay backdrops. Tinted with the CUTX blue hue so
      // dialogs feel distinctly CUTX-branded.
      navy: '#00304E',
      midnight: '#001A30',
      plum: '#4D7300',      // darker CUTX green for warm variety
      bgDark: '#001628',
      dark: CUTX_DARK,
      light: CUTX_LIGHT,
    },
    font: "'Inter', -apple-system, sans-serif",
    backgroundPattern: 'none',
    auroraOrbs: {
      orb1: 'rgba(0,82,144,0.18)',     // CUTX blue
      orb2: 'rgba(127,190,0,0.16)',    // CUTX green
      orb3: 'rgba(0,60,107,0.12)',     // deep blue anchor
    },
    // CTA: CUTX blue → CUTX green (the signature brand combo)
    ctaGradient: 'linear-gradient(135deg, #005290 0%, #7FBE00 100%)',
    ctaTextColor: '#FFFFFF',
    // Headline gradient: brighter stops for splash punch
    gradientWord: 'linear-gradient(135deg, #3399D6 0%, #A6E635 100%)',
    // Per-role glows mix CUTX blue, green, and deep blue so each
    // role lands on a distinct brand color.
    roleBackgrounds: {
      'new-member': 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(0,82,144,0.30) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 15% 15%, rgba(127,190,0,0.16) 0%, transparent 55%)',
      'current-member': 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(51,153,214,0.22) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 85% 15%, rgba(0,82,144,0.18) 0%, transparent 55%)',
      'homebuyer': 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(127,190,0,0.22) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 25% 15%, rgba(0,82,144,0.18) 0%, transparent 55%)',
      'auto-shopper': 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(0,82,144,0.26) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 85% 25%, rgba(51,153,214,0.16) 0%, transparent 55%)',
      'business-owner': 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(0,60,107,0.30) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 15% 25%, rgba(127,190,0,0.16) 0%, transparent 55%)',
      'student-family': 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(127,190,0,0.24) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 75% 15%, rgba(51,153,214,0.16) 0%, transparent 55%)',
      'community-partner': 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(77,115,0,0.22) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 85% 25%, rgba(0,82,144,0.16) 0%, transparent 55%)',
      'visiting': 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(0,82,144,0.18) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 15% 15%, rgba(127,190,0,0.12) 0%, transparent 55%)',
    },
  },

  registration: {
    modes: ['form', 'scan', 'search'],
    defaultMode: 'form',
    formTitle: 'Welcome to CUTX',
    formSubtitle: 'Share a quick intro so we can tailor your experience.',
    scanLabel: 'Scan Your Badge',
    scanHint: 'Hold the QR code in front of the camera',
    searchPlaceholder: 'Search by last name...',
    optInText: 'By sharing your information you consent to Credit Union of Texas processing your data to fulfill your request and send relevant follow-up communications.',
    showLocaleButton: false,
    idleTimeoutMs: 10000,
    skipEnabled: true,
    fields: [
      { id: 'firstName', label: 'First Name', type: 'text', placeholder: 'First name', required: true, halfWidth: true },
      { id: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Last name', required: true, halfWidth: true },
      { id: 'email', label: 'Email', type: 'email', placeholder: 'name@email.com', required: true, halfWidth: true },
      { id: 'phone', label: 'Phone', type: 'tel', placeholder: '(555) 555-5555', required: false, halfWidth: true },
      { id: 'company', label: 'Employer / School', type: 'text', placeholder: 'Where you work or attend', required: false, halfWidth: true },
      { id: 'title', label: 'Role', type: 'text', placeholder: 'Your role', required: false, halfWidth: true },
    ],
  },

  steps: [
    {
      type: 'splash',
      id: 'welcome',
      // Two-line headline: solid white line + gradient line
      title: 'Banking that Builds',
      gradientWord: 'Texas Stronger.',
      subtitle: 'Member-owned, North Texas-based — and reinvesting $19.8M+ back into the communities we serve. Better banking starts here.',
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
      title: 'What brings you in today?',
      subtitle: 'Select the option that fits you best.',
      showGreeting: true,
      showSelectAll: false,
      options: [
        { value: 'new-member', label: 'New / Curious', icon: 'sparkles', iconType: 'lucide' },
        { value: 'current-member', label: 'Current Member', icon: 'heart', iconType: 'lucide' },
        { value: 'homebuyer', label: 'Home Buyer', icon: 'landmark', iconType: 'lucide' },
        { value: 'auto-shopper', label: 'Auto Shopper', icon: 'car', iconType: 'lucide' },
        { value: 'business-owner', label: 'Business Owner', icon: 'briefcase', iconType: 'lucide' },
        { value: 'student-family', label: 'Student / Family', icon: 'graduation-cap', iconType: 'lucide' },
        { value: 'community-partner', label: 'Community Partner', icon: 'handshake', iconType: 'lucide' },
        { value: 'visiting', label: 'Just Visiting', icon: 'compass', iconType: 'lucide' },
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
      // Conditional role → interest mapping. `relevantRoles` declares
      // which roles each interest belongs to. Currently informational
      // for the runtime (all options always render), but read by the
      // ingest pipeline / template editor to build the personalization
      // graph. Always include `browsing` as a relevant role on every
      // option so curious visitors still see the full menu when picked.
      options: [
        { value: 'checking-savings', label: 'Checking & Savings', icon: 'piggy-bank', iconType: 'lucide',
          relevantRoles: ['new-member', 'current-member', 'homebuyer', 'auto-shopper', 'student-family', 'visiting'] },
        { value: 'auto-loans', label: 'Auto Loans', icon: 'car', iconType: 'lucide',
          relevantRoles: ['new-member', 'current-member', 'auto-shopper'] },
        { value: 'mortgage', label: 'Mortgage & Home', icon: 'landmark', iconType: 'lucide',
          relevantRoles: ['new-member', 'current-member', 'homebuyer'] },
        { value: 'credit-cards', label: 'Credit Cards', icon: 'credit-card', iconType: 'lucide',
          relevantRoles: ['new-member', 'current-member', 'homebuyer', 'auto-shopper', 'student-family', 'business-owner'] },
        { value: 'business', label: 'Business Banking', icon: 'briefcase', iconType: 'lucide',
          relevantRoles: ['business-owner', 'community-partner'] },
        { value: 'invest', label: 'Invest & CDs', icon: 'trending-up', iconType: 'lucide',
          relevantRoles: ['new-member', 'current-member', 'business-owner', 'student-family'] },
        { value: 'community', label: 'Community Programs', icon: 'heart', iconType: 'lucide',
          relevantRoles: ['new-member', 'current-member', 'student-family', 'community-partner', 'visiting'] },
        { value: 'browsing', label: 'Just Browsing', icon: 'compass', iconType: 'lucide',
          relevantRoles: ['new-member', 'current-member', 'homebuyer', 'auto-shopper', 'business-owner', 'student-family', 'community-partner', 'visiting'] },
      ],
    },
    {
      type: 'results',
      id: 'results',
      title: 'Your Personalized Tour',
      subtitle: 'Products, programs, and stories tailored to why you stopped by.',
      tabs: [
        // Short single-word labels so they never wrap to two lines.
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
        { id: 'solutions', label: 'Products', icon: 'layers' },
      ],
      cardsPerPage: 6,
      defaultView: 'small',
    },
    {
      type: 'summary',
      id: 'summary',
      title: 'Your Saved Items',
      subtitle: 'Review your picks and a CUTX team member will follow up.',
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
      subtitle: 'A CUTX team member will be in touch shortly.',
      showNewSessionButton: true,
      showAddNotesButton: true,
    },
  ],

  content: [
    // ─────────────────────────────────────────────────────────────────
    // Conditional trait-mapping graph
    //
    // Every card carries `targetRoles` + `targetInterests` so the
    // ingest pipeline / template editor can build a full
    //   role × interest → card[]
    // matrix. The runtime currently shows all cards in their tab; the
    // mapping is read downstream for personalization rules in the
    // ingested template.
    //
    // Interest → cards that surface for that interest:
    //   checking-savings : o2, o6, o7, l4, l7, l8, l9, l10, s1, s5, s7
    //   auto-loans       : l8, s2
    //   mortgage         : l5, l8, s3
    //   credit-cards     : l8, s4
    //   business         : l8, l11, s6
    //   invest           : l8, l9, s5
    //   community        : o1, o3, o4, o5, o6, l1, l2, l3, l6
    //   browsing         : l1, l7, l10  (catch-all)
    //
    // Real PDFs (mediaType: 'pdf') — embed inline via CardOverlay iframe:
    //   l9  CUTX Rates — Truth in Savings
    //   l10 Consumer Account Agreement
    //   l11 Business Account Agreement
    //
    // Role → primary interests (mirrored on each interest option's
    // `relevantRoles`):
    //   new-member        : checking-savings, auto-loans, mortgage,
    //                       credit-cards, invest, community, browsing
    //   current-member    : (broad — same as new-member)
    //   homebuyer         : mortgage, checking-savings, credit-cards
    //   auto-shopper      : auto-loans, credit-cards, checking-savings
    //   business-owner    : business, invest, credit-cards
    //   student-family    : checking-savings, credit-cards, community, invest
    //   community-partner : community, business
    //   visiting          : checking-savings, community, browsing
    // ─────────────────────────────────────────────────────────────────

    // ── Outcomes / Impact (7) ─────────────────────────
    {
      id: 'o1',
      title: '$19.8M+ Reinvested in Texas',
      cardType: 'outcome',
      icon: 'heart',
      iconType: 'lucide',
      stat: '$19.8M+',
      description: {
        small: '$19.8M+ donated, sponsored, and granted back to our communities.',
        medium: 'Over $19,802,084 invested back into our communities through donations, sponsorships, and community programs.',
        large: 'Membership has its impact. CUTX has reinvested over $19,802,084 back into North and East Texas communities through donations, sponsorships, scholarships, and community programs.',
        overlay: 'Because CUTX is member-owned and not-for-profit, profits don\'t go to shareholders — they go back to members and the community. To date, that has meant $19,802,084+ reinvested through donations, sponsorships, scholarships, the CUTX Charitable Foundation, and direct community programs across North and East Texas.',
      },
      tags: ['community'],
      targetRoles: ['new-member', 'current-member', 'community-partner', 'visiting'],
      targetInterests: ['community'],
    },
    {
      id: 'o2',
      title: '80,000+ Free ATMs',
      cardType: 'outcome',
      icon: 'credit-card',
      iconType: 'lucide',
      stat: '80,000+',
      description: {
        small: 'Surcharge-free access at 80,000+ ATMs nationwide.',
        medium: 'CUTX members access 80,000+ surcharge-free ATMs across the country — coast to coast.',
        large: 'No matter where life takes you, your money goes too. CUTX members get surcharge-free access to 80,000+ ATMs nationwide through the CO-OP shared ATM network.',
        overlay: 'CUTX members enjoy surcharge-free access to 80,000+ ATMs nationwide through the CO-OP shared ATM network — more no-fee locations than most national mega-banks. Find one at a 7-Eleven, Costco, Circle K, or thousands of other locations across all 50 states.',
      },
      tags: ['checking-savings'],
      targetRoles: ['new-member', 'current-member', 'homebuyer', 'auto-shopper', 'student-family', 'visiting'],
      targetInterests: ['checking-savings'],
    },
    {
      id: 'o3',
      title: '38+ School District Partners',
      cardType: 'outcome',
      icon: 'graduation-cap',
      iconType: 'lucide',
      stat: '38+',
      description: {
        small: 'Partnered with 38+ school districts across Texas.',
        medium: 'Partnered with 38+ school districts and dozens of local non-profits supporting students and families.',
        large: 'CUTX is partnered with 38+ Texas school districts and dozens of local non-profits and service organizations — supporting students, teachers, and families across the region.',
        overlay: 'Partnered with 38+ Texas school districts and dozens of local non-profits and service-based organizations. The partnerships fund scholarships, the Pay for Grades program, financial literacy curriculum, sports sponsorships, and direct teacher support — all reinvested through the CUTX Charitable Foundation.',
      },
      tags: ['community'],
      targetRoles: ['student-family', 'community-partner', 'current-member'],
      targetInterests: ['community'],
    },
    {
      id: 'o4',
      title: '7,798 Volunteer Hours',
      cardType: 'outcome',
      icon: 'handshake',
      iconType: 'lucide',
      stat: '7,798',
      description: {
        small: '7,798 employee volunteer hours over the past 8 years.',
        medium: 'CUTX employees have volunteered 7,798 hours over the past 8 years to support the community.',
        large: 'CUTX employees have logged 7,798 volunteer hours over the past 8 years — directly supporting the community\'s most-needed causes alongside our financial giving.',
        overlay: 'CUTX employees have logged 7,798 volunteer hours over the past 8 years — directly supporting the community\'s most needed causes. Volunteer days are a paid benefit so the entire CUTX team can show up for school events, food drives, and non-profit service across North and East Texas.',
      },
      tags: ['community'],
      targetRoles: ['community-partner', 'current-member', 'visiting'],
      targetInterests: ['community'],
    },
    {
      id: 'o5',
      title: '$1.5M to Children\'s Advocacy',
      cardType: 'outcome',
      icon: 'award',
      iconType: 'lucide',
      stat: '$1.5M',
      description: {
        small: '$1.5M donation to Children\'s Advocacy Center of Collin County.',
        medium: 'CUTX donated $1.5M to the Children\'s Advocacy Center of Collin County to expand services for kids.',
        large: 'CUTX has donated $1.5M to the Children\'s Advocacy Center of Collin County to expand services for children and families across our service area.',
        overlay: 'A single $1.5M donation to the Children\'s Advocacy Center of Collin County — one of the largest gifts in CUTX history. The investment expanded services for children and families and demonstrates the scale of impact a member-owned credit union can deliver to the community it serves.',
      },
      tags: ['community'],
      targetRoles: ['community-partner', 'current-member', 'student-family'],
      targetInterests: ['community'],
    },
    {
      id: 'o6',
      title: 'Free Member Benefits',
      cardType: 'outcome',
      icon: 'gift',
      iconType: 'lucide',
      stat: 'Free',
      description: {
        small: 'Free telehealth, estate planning, and more — included.',
        medium: 'Free telehealth visits, will & estate planning resources, and other member-only benefits.',
        large: 'Membership unlocks free telehealth visits, will and estate planning resources, the referral program, Pay for Grades, scholarships, and the Save the Change rewards program — all included.',
        overlay: 'Membership comes with real perks, not fine print. Free telehealth visits 24/7, will and estate planning resources, the referral program that pays you to refer friends, Pay for Grades rewards for students, scholarships through the Foundation, and the Save the Change rewards program. All included — not add-ons.',
      },
      tags: ['checking-savings', 'community'],
      targetRoles: ['new-member', 'current-member', 'student-family'],
      targetInterests: ['checking-savings', 'community'],
    },
    {
      id: 'o7',
      title: 'Save the Change: $120',
      cardType: 'outcome',
      icon: 'piggy-bank',
      iconType: 'lucide',
      stat: '$120',
      description: {
        small: 'CUTX adds $120 once you save $240 with Save the Change.',
        medium: 'Round up debit purchases — save $240 and CUTX kicks in $120 more.',
        large: 'Save the Change rounds up every debit purchase into a savings account. Save your first $240 in round-ups and CUTX gives you an additional $120 reward.',
        overlay: 'The Save the Change program rounds up every CUTX debit purchase to the nearest dollar and sweeps the change into your savings. Save $240 in round-ups and CUTX kicks in an additional $120 — a built-in habit-builder that funds the savings account for you.',
      },
      tags: ['checking-savings'],
      targetRoles: ['new-member', 'student-family', 'current-member'],
      targetInterests: ['checking-savings'],
    },

    // ── Learn / Discover (8) ──────────────────────────
    {
      id: 'l1',
      title: 'About CUTX',
      cardType: 'learn',
      mediaType: 'website',
      icon: 'info',
      iconType: 'lucide',
      url: 'https://www.cutx.org/about',
      description: {
        small: 'The CUTX story, mission, and what membership means.',
        medium: 'Read the CUTX story: mission, member-owned model, and how we reinvest in Texas communities.',
        large: 'Read the full CUTX story — mission, the member-owned credit union model, leadership, and how every member shapes how we reinvest in North and East Texas.',
        overlay: 'CUTX exists "to create opportunity for you and your community by providing responsible financial products and services, and actively giving back through substantial donations, volunteering, and support." Read the founding story, the not-for-profit member-owned model, and meet the leadership team behind it.',
      },
      tags: ['community'],
      targetRoles: ['new-member', 'visiting', 'community-partner'],
      targetInterests: ['community', 'browsing'],
    },
    {
      id: 'l2',
      title: 'CUTX Charitable Foundation',
      cardType: 'learn',
      mediaType: 'website',
      icon: 'heart',
      iconType: 'lucide',
      url: 'https://www.cutx.org/charitable-foundation',
      description: {
        small: 'How the Foundation distributes $19.8M+ across Texas.',
        medium: 'The CUTX Charitable Foundation funds scholarships, food trucks, school partners, and community grants.',
        large: 'The CUTX Charitable Foundation channels the credit union\'s giving — scholarships, school district partnerships, the food truck operation, Gilmer Gathers Event Center, and direct community grants.',
        overlay: 'The CUTX Charitable Foundation channels the credit union\'s giving into the community: scholarships for students, partnerships with 38+ school districts, the community food truck operation, the Gilmer Gathers Event Center, the Special Needs Greeter Initiative, and direct grants to local non-profits and service-based organizations.',
      },
      tags: ['community'],
      targetRoles: ['community-partner', 'student-family', 'current-member', 'new-member'],
      targetInterests: ['community'],
    },
    {
      id: 'l3',
      title: 'Pay for Grades & Scholarships',
      cardType: 'learn',
      mediaType: 'website',
      icon: 'graduation-cap',
      iconType: 'lucide',
      url: 'https://www.cutx.org/',
      description: {
        small: 'Earn rewards for grades. Apply for CUTX scholarships.',
        medium: 'Pay for Grades rewards student members for academic achievement. Foundation scholarships open to members.',
        large: 'Student members earn rewards through Pay for Grades for academic achievement. CUTX Foundation scholarships are open to member students pursuing higher education — apply through the website each year.',
        overlay: 'Two programs designed for student members: Pay for Grades rewards student account holders for academic achievement throughout the school year, and the CUTX Foundation scholarships fund higher education for member students. Both administered through the Charitable Foundation — full eligibility and application details on the website.',
      },
      tags: ['community'],
      targetRoles: ['student-family', 'current-member', 'new-member'],
      targetInterests: ['community'],
    },
    {
      id: 'l4',
      title: 'Save the Change Program',
      cardType: 'learn',
      mediaType: 'website',
      icon: 'piggy-bank',
      iconType: 'lucide',
      url: 'https://www.cutx.org/',
      description: {
        small: 'How the round-up + $120 reward program works.',
        medium: 'Round up debit purchases, save the change, and earn a $120 reward when you hit $240.',
        large: 'Save the Change rounds up every debit purchase to the next dollar and sweeps the change into a savings account. Hit $240 in round-ups and CUTX kicks in an additional $120 reward.',
        overlay: 'How Save the Change works: every CUTX debit purchase rounds up to the nearest dollar, and the change sweeps automatically into your savings account. Once you\'ve saved $240 through round-ups, CUTX kicks in an additional $120 reward. A built-in habit-builder that funds the savings goal for you — no schedules, no transfers to remember.',
      },
      tags: ['checking-savings'],
      targetRoles: ['new-member', 'current-member', 'student-family'],
      targetInterests: ['checking-savings'],
    },
    {
      id: 'l5',
      title: 'First-Time Homebuyer Guide',
      cardType: 'learn',
      // CUTX doesn't ship a public homebuyer PDF — point to the live
      // mortgage hub page so the card overlay opens a working URL
      // instead of a broken file-link.
      mediaType: 'website',
      icon: 'landmark',
      iconType: 'lucide',
      url: 'https://www.cutx.org/mortgage-loans',
      description: {
        small: 'Step-by-step homebuying guide for first-time buyers.',
        medium: 'A first-time buyer\'s guide — preapproval, $0 down options, closing process, and the CUTX mortgage advantage.',
        large: 'A first-time homebuyer\'s guide from CUTX — preapproval, $0 down options, the closing process, government loan programs, and the credit union mortgage advantage.',
        overlay: 'A step-by-step homebuyer\'s guide from CUTX: how to get preapproved, $0 down loan options, jumbo loan thresholds, government-backed (FHA, VA, USDA) programs, the closing timeline, and how member-owned rates and service compare to traditional banks. Includes a closing-cost worksheet you can fill out at the kiosk.',
      },
      tags: ['mortgage'],
      targetRoles: ['homebuyer', 'new-member', 'current-member'],
      targetInterests: ['mortgage'],
    },
    {
      id: 'l6',
      title: 'Special Needs Greeter Initiative',
      cardType: 'learn',
      mediaType: 'website',
      icon: 'sparkles',
      iconType: 'lucide',
      url: 'https://www.cutx.org/charitable-foundation',
      description: {
        small: 'How the Greeter program builds inclusive workplaces.',
        medium: 'The Special Needs Greeter Initiative hires young adults with special needs to greet members at CUTX branches.',
        large: 'The Special Needs Greeter Initiative hires young adults with special needs to greet members at CUTX branches — building inclusive workplaces and meaningful careers, one branch at a time.',
        overlay: 'The Special Needs Greeter Initiative hires young adults with special needs as branch greeters — building inclusive workplaces, meaningful careers, and warmer branch experiences for every member. The program is one of the CUTX Charitable Foundation\'s flagship community efforts and has expanded across multiple branches.',
      },
      tags: ['community'],
      targetRoles: ['community-partner', 'current-member', 'visiting', 'new-member'],
      targetInterests: ['community'],
    },
    {
      id: 'l7',
      title: 'Find a Branch or ATM',
      cardType: 'learn',
      mediaType: 'website',
      icon: 'map-pin',
      iconType: 'lucide',
      url: 'https://www.cutx.org/locations',
      description: {
        small: 'Find your nearest branch or surcharge-free ATM.',
        medium: 'Locate the nearest CUTX branch or one of the 80,000+ surcharge-free ATMs across the country.',
        large: 'Locator for the full CUTX branch network across North and East Texas — plus the CO-OP shared ATM network giving members surcharge-free access to 80,000+ ATMs nationwide.',
        overlay: 'Locate the nearest CUTX branch across North and East Texas — or find one of the 80,000+ surcharge-free ATMs available to members through the CO-OP shared ATM network. Branch and ATM finder, hours, and contact details for every location.',
      },
      tags: ['checking-savings'],
      targetRoles: ['new-member', 'current-member', 'visiting', 'homebuyer', 'auto-shopper', 'business-owner'],
      targetInterests: ['checking-savings', 'browsing'],
    },
    {
      id: 'l8',
      title: 'Schedule an Appointment',
      cardType: 'learn',
      mediaType: 'website',
      icon: 'calendar',
      iconType: 'lucide',
      url: 'https://www.cutx.org/',
      description: {
        small: 'Book a sit-down with a CUTX member services rep.',
        medium: 'Schedule a 30-minute appointment with a CUTX member services rep — in-branch or virtual.',
        large: 'Book a sit-down with a CUTX member services representative — in-branch or virtual. Open accounts, apply for loans, or talk through your financial goals in person.',
        overlay: 'Skip the line. Book a 30-minute appointment with a CUTX member services rep — in-branch at the location of your choice or virtual from your phone. Open accounts, apply for an auto loan or mortgage, set up business banking, or talk through your full financial picture with someone who knows credit unions.',
      },
      tags: ['checking-savings', 'auto-loans', 'mortgage', 'business'],
      targetRoles: ['new-member', 'homebuyer', 'auto-shopper', 'business-owner', 'current-member'],
      targetInterests: ['checking-savings', 'auto-loans', 'mortgage', 'credit-cards', 'business', 'invest'],
    },
    {
      id: 'l9',
      title: 'CUTX Rates — Truth in Savings',
      cardType: 'learn',
      // Real CUTX-published PDF — current DFW rates, dated Jan 2026.
      // Embeds inline via the CardOverlay PDF iframe.
      mediaType: 'pdf',
      icon: 'file-text',
      iconType: 'lucide',
      url: 'https://www.momentifyapp.com/brand/assets/cutx-rates-truth-in-savings.pdf',
      description: {
        small: 'Current DFW rate sheet — checking, savings, CDs, IRAs.',
        medium: 'Official CUTX Truth in Savings disclosure — current rates for every checking, savings, CD, and IRA product.',
        large: 'The official CUTX Truth in Savings disclosure — current DFW-area rates and fees for every checking, savings, CD, IRA, and Money Market product. Updated regularly.',
        overlay: 'The official Truth in Savings disclosure for CUTX. Current rates and fees for every checking, savings, CD, IRA, and Money Market product across the DFW service area — the same document tellers reference when opening accounts. Embedded inline; tap the fullscreen icon to read the whole PDF.',
      },
      tags: ['checking-savings', 'invest'],
      targetRoles: ['new-member', 'current-member', 'student-family', 'business-owner', 'homebuyer'],
      targetInterests: ['checking-savings', 'invest'],
    },
    {
      id: 'l10',
      title: 'Consumer Account Agreement',
      cardType: 'learn',
      mediaType: 'pdf',
      icon: 'file-text',
      iconType: 'lucide',
      url: 'https://www.momentifyapp.com/brand/assets/cutx-consumer-account-agreement.pdf',
      description: {
        small: 'The official CUTX Consumer Account Agreement.',
        medium: 'The full Consumer Account Agreement — your rights and responsibilities as a CUTX member.',
        large: 'The complete CUTX Consumer Account Agreement — covering deposits, withdrawals, dispute resolution, electronic services, and your rights and responsibilities as a CUTX member.',
        overlay: 'The complete Consumer Account Agreement governing your CUTX membership. Deposits, withdrawals, dispute resolution, electronic services, Reg E, Reg CC, Reg D, member liability, and every other piece of small-print you should know before opening an account. Embedded inline — fullscreen icon for the full document.',
      },
      tags: ['checking-savings', 'browsing'],
      targetRoles: ['new-member', 'current-member', 'student-family', 'visiting'],
      targetInterests: ['checking-savings', 'browsing'],
    },
    {
      id: 'l11',
      title: 'Business Account Agreement',
      cardType: 'learn',
      mediaType: 'pdf',
      icon: 'file-text',
      iconType: 'lucide',
      url: 'https://www.momentifyapp.com/brand/assets/cutx-business-account-agreement.pdf',
      description: {
        small: 'CUTX Business Membership & Account Agreement.',
        medium: 'The Business Membership & Account Agreement — terms for business checking, money market, and treasury services.',
        large: 'The CUTX Business Membership and Account Agreement — full terms for business checking, money market, certificates, treasury services, and the operational details that matter to owners.',
        overlay: 'The complete CUTX Business Membership and Account Agreement. Covers business checking, business money market, certificates, treasury services (ACH, wires, positive pay), member liability, account authority, and every operational detail your CFO or controller will want to read before you open a business account. Embedded inline.',
      },
      tags: ['business'],
      targetRoles: ['business-owner', 'community-partner', 'current-member'],
      targetInterests: ['business'],
    },

    // ── Solutions / Products (7) ──────────────────────
    {
      id: 's1',
      title: 'Checking & Savings',
      cardType: 'solution',
      icon: 'piggy-bank',
      iconType: 'lucide',
      url: 'https://www.cutx.org/',
      description: {
        small: 'Secure Checking, Plus, Student — plus High Yield Savings.',
        medium: 'Secure Checking, Secure Plus, Student Checking — plus Member\'s Choice, High Yield, Holiday, and Kids Savings.',
        large: 'Choose from Secure Checking, Secure Plus, and Student Checking. Pair it with Member\'s Choice savings, High Yield Savings, Holiday Savings, or a Kids Savings account.',
        overlay: 'CUTX checking and savings is built around real life. Secure Checking covers the basics, Secure Plus adds perks for primary banking, and Student Checking is built for members 13-25. On the savings side: Member\'s Choice (your starter), High Yield Savings, Holiday Savings (for end-of-year goals), and Kids Savings for the youngest members. Pair any combo and add Save the Change to fund savings automatically.',
      },
      tags: ['checking-savings'],
      targetRoles: ['new-member', 'current-member', 'student-family', 'homebuyer', 'auto-shopper', 'visiting'],
      targetInterests: ['checking-savings'],
    },
    {
      id: 's2',
      title: 'Auto Loans',
      cardType: 'solution',
      icon: 'car',
      iconType: 'lucide',
      url: 'https://www.cutx.org/auto-loans',
      description: {
        small: 'Member-rate auto loans for new, used, and refi.',
        medium: 'New + used auto loans, refinance, and recreational (boats, RVs) — credit-union rates with member service.',
        large: 'CUTX auto loans cover new, used, and refinance — plus recreational vehicle loans for boats, RVs, and motorcycles. Member-owned rates, no surprise fees, and fast preapproval.',
        overlay: 'Preapproval in minutes, member-owned rates that consistently beat dealer financing, and no surprise fees. CUTX auto loans cover new vehicles, used vehicles, and refinance — plus recreational vehicle loans for boats, RVs, and motorcycles. Apply online, in-branch, or at the kiosk; take the preapproval to any dealer.',
      },
      tags: ['auto-loans'],
      targetRoles: ['auto-shopper', 'new-member', 'current-member'],
      targetInterests: ['auto-loans'],
    },
    {
      id: 's3',
      title: 'Mortgage & Home Loans',
      cardType: 'solution',
      icon: 'landmark',
      iconType: 'lucide',
      url: 'https://www.cutx.org/mortgage-loans',
      description: {
        small: 'Jumbo, $0 Down, Government, Specialty + Home Equity.',
        medium: 'Mortgage options: Jumbo, $0 Down, Government (FHA/VA/USDA), and Specialty loans. Plus Home Equity.',
        large: 'CUTX offers the full mortgage menu — Jumbo, $0 Down, Government-backed (FHA, VA, USDA), and Specialty programs. Add Home Equity loans or HELOCs to tap your home\'s value.',
        overlay: 'Whether it\'s your first home or your fifth, CUTX has the menu: Jumbo loans above conforming limits, $0 Down options for qualifying buyers, Government-backed programs (FHA, VA, USDA), and Specialty programs for unique situations. Tap existing equity through Home Equity loans or HELOCs. Local underwriting and member-owned pricing.',
      },
      tags: ['mortgage'],
      targetRoles: ['homebuyer', 'new-member', 'current-member'],
      targetInterests: ['mortgage'],
    },
    {
      id: 's4',
      title: 'Credit Cards',
      cardType: 'solution',
      icon: 'credit-card',
      iconType: 'lucide',
      url: 'https://www.cutx.org/credit-cards/compare',
      description: {
        small: 'Platinum + Secured cards with credit-union rates.',
        medium: 'CUTX Platinum and Secured credit cards — competitive rates, no annual fees, and member rewards.',
        large: 'CUTX Platinum credit card for everyday spending and Secured for credit-building. Both come with competitive rates, no annual fees, and credit-union member service.',
        overlay: 'Two cards, two missions. CUTX Platinum is the everyday card — competitive APR, no annual fee, and rewards that actually pay out. CUTX Secured is the credit-building card — perfect for new credit, rebuilding, or for student members learning responsible use. Both backed by credit-union service and zero hidden fees.',
      },
      tags: ['credit-cards'],
      targetRoles: ['new-member', 'current-member', 'student-family', 'homebuyer', 'auto-shopper'],
      targetInterests: ['credit-cards'],
    },
    {
      id: 's5',
      title: 'Invest & Deposit',
      cardType: 'solution',
      icon: 'trending-up',
      iconType: 'lucide',
      url: 'https://www.cutx.org/',
      description: {
        small: 'CDs (6–60 mo), IRAs, Money Market, Digital Currency.',
        medium: 'Certificates of Deposit (6 to 60 month terms), IRAs, Money Market accounts, and Digital Currency.',
        large: 'Grow your money with CUTX: CDs from 6 to 60 month terms, traditional and Roth IRAs, Money Market accounts, and digital currency options.',
        overlay: 'For members ready to put cash to work: Certificates of Deposit with terms from 6 to 60 months and competitive rates, traditional and Roth IRAs for retirement, Money Market accounts for liquid yields, and digital currency offerings for members exploring crypto. Rates and terms updated regularly — see the website or talk to a member services rep.',
      },
      tags: ['invest', 'checking-savings'],
      targetRoles: ['current-member', 'new-member', 'business-owner', 'student-family'],
      targetInterests: ['invest', 'checking-savings'],
    },
    {
      id: 's6',
      title: 'Business Banking',
      cardType: 'solution',
      icon: 'briefcase',
      iconType: 'lucide',
      url: 'https://www.cutx.org/business/compare-credit-union-business-checking-accounts',
      description: {
        small: 'Checking, Certificates, Money Market, Treasury — for SMBs.',
        medium: 'Business Checking, Business Certificates, Business Money Market, and Treasury Services for SMBs and non-profits.',
        large: 'CUTX Business Banking covers Business Checking, Business Certificates of Deposit, Business Money Market, and Treasury Services — built for small businesses and non-profits across North and East Texas.',
        overlay: 'Built for Texas small businesses and non-profits: Business Checking with the features your operations need, Business Certificates and Money Market for short-term cash, and Treasury Services for payroll, ACH, wires, and fraud prevention. Local relationship managers, credit-union pricing, and the operational support a community bank used to offer.',
      },
      tags: ['business'],
      targetRoles: ['business-owner', 'community-partner', 'current-member'],
      targetInterests: ['business'],
    },
    {
      id: 's7',
      title: 'Digital Banking & Zelle',
      cardType: 'solution',
      icon: 'smartphone',
      iconType: 'lucide',
      url: 'https://www.cutx.org/',
      description: {
        small: 'Mobile + online banking, Zelle, Ria money transfer.',
        medium: 'Full mobile and online banking, Zelle peer-to-peer payments, and Ria international money transfer.',
        large: 'Digital banking from CUTX: full mobile and online banking, Zelle for instant peer-to-peer payments, Ria for international money transfer, plus mobile deposit and bill pay.',
        overlay: 'Full digital banking suite: mobile and online banking with bill pay, mobile check deposit, account-to-account transfers, alerts, and biometric login. Zelle for instant peer-to-peer payments. Ria Money Transfer for sending money internationally. All included with membership — no separate sign-up.',
      },
      tags: ['checking-savings'],
      targetRoles: ['new-member', 'current-member', 'student-family', 'business-owner'],
      targetInterests: ['checking-savings'],
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
