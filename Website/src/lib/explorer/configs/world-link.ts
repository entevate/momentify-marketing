// Explorer Config — WorldLink
// Enterprise digital transformation, data, and GenAI consulting firm
// ("An Adi Group company", HQ Frisco TX, 25 years, global "WorldLinkers"
// across 9 time zones). Serves Fortune 100/500 CTOs, CDOs, CIOs, and
// CPOs across Financial Services, Supply Chain, Manufacturing, Telecom,
// Healthcare, Airlines, and Defense. Brand: crimson red + deep maroon,
// mark is a red gradient double-slash ("//") standing in for the "W".

import type { ExplorerConfig, ThemeColors } from '../types';

const WORLD_LINK_DARK: ThemeColors = {
  // Brand-tinted near-black UI tones derived from the WorldLink crimson
  // so dialog backgrounds and the Tools menu feel distinctly WorldLink
  // rather than generic dark mode.
  bg: '#0D0303',
  bgGradient: 'linear-gradient(135deg, #1A0505 0%, #120404 55%, #0D0303 100%)',
  surface: 'rgba(255,255,255,0.06)',
  surfaceHover: 'rgba(255,255,255,0.10)',
  border: 'rgba(255,255,255,0.12)',
  borderFocus: '#FF5C6C',
  text1: '#FFFFFF',
  text2: 'rgba(255,255,255,0.78)',
  text3: 'rgba(255,255,255,0.52)',
  inputBg: 'rgba(255,255,255,0.08)',
  inputText: '#FFFFFF',
  inputPlaceholder: 'rgba(255,255,255,0.40)',
  logoText: '#FFFFFF',
  focusRing: 'rgba(239,45,62,0.28)',
};

const WORLD_LINK_LIGHT: ThemeColors = {
  // Light theme — warm off-white with a faint red undertone so the
  // crimson accent still reads as "brand" rather than generic red.
  bg: '#FAF7F7',
  bgGradient: 'linear-gradient(180deg, #FAF7F7 0%, #F3EDED 100%)',
  surface: 'rgba(255,255,255,0.90)',
  surfaceHover: 'rgba(255,255,255,0.98)',
  border: 'rgba(26,5,5,0.12)',
  borderFocus: '#B20D1B',
  text1: '#1A0505',
  text2: 'rgba(26,5,5,0.70)',
  text3: 'rgba(26,5,5,0.45)',
  inputBg: '#FFFFFF',
  inputText: '#1A0505',
  inputPlaceholder: 'rgba(26,5,5,0.40)',
  logoText: '#1A0505',
  focusRing: 'rgba(239,45,62,0.18)',
};

export const WORLD_LINK_CONFIG: ExplorerConfig = {
  id: 'world-link',
  name: 'WorldLink Explorer',
  version: 1,
  createdAt: '2026-07-10T00:00:00.000Z',
  updatedAt: '2026-07-10T00:00:00.000Z',

  branding: {
    logo: {
      dark: '/brand/assets/world-link-logo-reverse.svg',  // white "//ORLDLINK" + An Adi Group Company for dark bg
      light: '/brand/assets/world-link-logo.png',         // black "//ORLDLINK" wordmark for light bg
    },
    // Dark lockup includes the "An Adi Group Company" tagline (509x100,
    // ~5.1:1). The wordmark is wide, so a modest height keeps it from
    // dominating the top bar.
    logoHeight: 30,
    icon: '/brand/assets/world-link-icon.png',
    colors: {
      primary: '#EF2D3E',    // WorldLink crimson — main accent
      secondary: '#B20D1B',  // WorldLink deep red — second anchor
      teal: '#FF5C6C',       // bright coral-red for hover/focus on dark
      blue: '#EF2D3E',
      deepBlue: '#881A23',   // deep maroon — matches the actual "//" mark gradient stop
      // midnight + navy drive dialog backgrounds + overlay backdrop.
      // Both pulled from the crimson hue so dialogs stay on-brand.
      navy: '#1A0505',
      midnight: '#0D0303',
      plum: '#3D0F14',       // deep wine — complements the crimson
      bgDark: '#0D0303',
      dark: WORLD_LINK_DARK,
      light: WORLD_LINK_LIGHT,
    },
    font: "'Plus Jakarta Sans', -apple-system, sans-serif",
    backgroundPattern: 'none',
    auroraOrbs: {
      orb1: 'rgba(239,45,62,0.20)',   // crimson
      orb2: 'rgba(255,92,108,0.16)',  // bright coral
      orb3: 'rgba(61,15,20,0.14)',    // deep wine
    },
    // CTA = deep red → deep wine (darker stops keep white CTA text legible)
    ctaGradient: 'linear-gradient(135deg, #B20D1B 0%, #3D0F14 100%)',
    ctaTextColor: '#FFFFFF',
    // Headline gradient: logo crimson → deep red, matching the "//" mark
    gradientWord: 'linear-gradient(135deg, #FF4453 0%, #EF2D3E 60%, #C41220 100%)',
    // Per-role glows: each role lands on a slightly different crimson /
    // coral / wine mix so navigating roles feels like chapters.
    roleBackgrounds: {
      'cto': 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(239,45,62,0.30) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 15% 15%, rgba(255,92,108,0.18) 0%, transparent 55%)',
      'cdo': 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(178,13,27,0.28) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 85% 15%, rgba(239,45,62,0.18) 0%, transparent 55%)',
      'cio': 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(255,92,108,0.24) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 25% 15%, rgba(239,45,62,0.16) 0%, transparent 55%)',
      'cpo': 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(239,45,62,0.26) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 85% 25%, rgba(61,15,20,0.14) 0%, transparent 55%)',
      'innovation-lead': 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(255,92,108,0.22) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 15% 25%, rgba(178,13,27,0.16) 0%, transparent 55%)',
      'line-of-business': 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(178,13,27,0.22) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 75% 15%, rgba(255,92,108,0.14) 0%, transparent 55%)',
      'partner-vendor': 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(61,15,20,0.24) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 85% 25%, rgba(239,45,62,0.16) 0%, transparent 55%)',
      'browsing': 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(239,45,62,0.16) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 15% 15%, rgba(255,92,108,0.10) 0%, transparent 55%)',
    },
  },

  registration: {
    modes: ['form', 'scan', 'search'],
    defaultMode: 'form',
    formTitle: 'Welcome to WorldLink',
    formSubtitle: 'Share a quick intro so we can tailor your visit.',
    scanLabel: 'Scan Your Badge',
    scanHint: 'Hold the QR code in front of the camera',
    searchPlaceholder: 'Search by last name...',
    optInText: 'By sharing your information you consent to WorldLink processing your data to follow up about strategic advisory, technology innovation, and transformation solutions.',
    showLocaleButton: false,
    idleTimeoutMs: 10000,
    skipEnabled: true,
    fields: [
      { id: 'firstName', label: 'First Name', type: 'text', placeholder: 'First name', required: true, halfWidth: true },
      { id: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Last name', required: true, halfWidth: true },
      { id: 'email', label: 'Work Email', type: 'email', placeholder: 'name@company.com', required: true, halfWidth: true },
      { id: 'phone', label: 'Phone', type: 'tel', placeholder: '(555) 555-5555', required: false, halfWidth: true },
      { id: 'company', label: 'Company', type: 'text', placeholder: 'Company', required: false, halfWidth: true },
      { id: 'title', label: 'Title', type: 'text', placeholder: 'Your role', required: false, halfWidth: true },
    ],
  },

  steps: [
    {
      type: 'splash',
      id: 'welcome',
      title: 'Inspired Intellect.',
      gradientWord: 'Unleash Tomorrow\'s Power Today.',
      subtitle: '25 years of digital transformation, data, and GenAI expertise, delivered by WorldLinkers across 9 time zones. We partner with Fortune 100 enterprises to tackle their most important challenges. Tap to begin.',
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
      title: 'What brings you to WorldLink?',
      subtitle: 'Select the option that fits you best.',
      showGreeting: true,
      showSelectAll: false,
      options: [
        { value: 'cto', label: 'CTO', icon: 'cpu', iconType: 'lucide' },
        { value: 'cdo', label: 'Chief Data Officer', icon: 'database', iconType: 'lucide' },
        { value: 'cio', label: 'CIO', icon: 'server', iconType: 'lucide' },
        { value: 'cpo', label: 'Chief Product Officer', icon: 'box', iconType: 'lucide' },
        { value: 'innovation-lead', label: 'Innovation / Transformation Lead', icon: 'rocket', iconType: 'lucide' },
        { value: 'line-of-business', label: 'Line of Business Leader', icon: 'briefcase', iconType: 'lucide' },
        { value: 'partner-vendor', label: 'Partner / Vendor', icon: 'handshake', iconType: 'lucide' },
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
        { value: 'genai-solutions', label: 'Custom GenAI Solutions', icon: 'sparkles', iconType: 'lucide',
          relevantRoles: ['cto', 'cdo', 'cpo', 'innovation-lead', 'browsing'] },
        { value: 'data-analytics', label: 'Data & Analytics Strategy', icon: 'bar-chart-3', iconType: 'lucide',
          relevantRoles: ['cto', 'cdo', 'cio', 'line-of-business', 'browsing'] },
        { value: 'strategic-advisory', label: 'Strategic Advisory', icon: 'compass', iconType: 'lucide',
          relevantRoles: ['cdo', 'cio', 'innovation-lead', 'partner-vendor', 'browsing'] },
        { value: 'technology-innovation', label: 'Technology Innovation', icon: 'cpu', iconType: 'lucide',
          relevantRoles: ['cto', 'cio', 'innovation-lead', 'browsing'] },
        { value: 'transformation-enablement', label: 'Transformation Enablement', icon: 'rocket', iconType: 'lucide',
          relevantRoles: ['cio', 'cpo', 'innovation-lead', 'line-of-business', 'browsing'] },
        { value: 'managed-services', label: 'Managed Services', icon: 'settings', iconType: 'lucide',
          relevantRoles: ['cto', 'cio', 'browsing'] },
        { value: 'industry-expertise', label: 'Industry Case Studies', icon: 'award', iconType: 'lucide',
          relevantRoles: ['cdo', 'cpo', 'line-of-business', 'partner-vendor', 'browsing'] },
        { value: 'browsing', label: 'Just Browsing', icon: 'compass', iconType: 'lucide',
          relevantRoles: ['cto', 'cdo', 'cio', 'cpo', 'innovation-lead', 'line-of-business', 'partner-vendor', 'browsing'] },
      ],
    },
    {
      type: 'results',
      id: 'results',
      title: 'Your Personalized Tour',
      subtitle: 'Solutions, proof, and results tailored to why you stopped by.',
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
          ],
        },
        { id: 'solutions', label: 'Solutions', icon: 'layers' },
      ],
      cardsPerPage: 6,
      defaultView: 'small',
    },
    {
      type: 'summary',
      id: 'summary',
      title: 'Your Saved Items',
      subtitle: 'Review your picks and a WorldLink partner will follow up.',
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
      subtitle: 'A WorldLink partner will be in touch shortly.',
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
    //   cto                : genai-solutions, data-analytics, technology-innovation,
    //                        managed-services, browsing
    //   cdo                : genai-solutions, data-analytics, strategic-advisory,
    //                        industry-expertise, browsing
    //   cio                : data-analytics, strategic-advisory, technology-innovation,
    //                        transformation-enablement, managed-services, browsing
    //   cpo                : genai-solutions, transformation-enablement,
    //                        industry-expertise, browsing
    //   innovation-lead    : genai-solutions, strategic-advisory, technology-innovation,
    //                        transformation-enablement, browsing
    //   line-of-business   : data-analytics, transformation-enablement,
    //                        industry-expertise, browsing
    //   partner-vendor     : strategic-advisory, industry-expertise, browsing
    //   browsing           : (catch-all — all interests)
    //
    // Content sourced from the live worldlink-us.ai app (case-study
    // registry + accelerator pages extracted 2026-07-10). All URLs are
    // live routes; all stats are WorldLink's own published figures.
    // ─────────────────────────────────────────────────────────────────

    // ── Outcomes / Impact (8) — real case studies with live URLs ──────
    {
      id: 'o1',
      title: '$88M in Tariff Exemptions Secured',
      cardType: 'outcome',
      icon: 'shield-check',
      iconType: 'lucide',
      stat: '$88M',
      url: 'https://worldlink-us.ai/case-studies/tariff-management',
      description: {
        small: 'AI-powered tariff analytics secured $88M in exemptions plus $10M in recovered overpayments.',
        medium: 'For a global equipment manufacturer, WorldLink\'s AI-powered tariff analytics recovered $10M in overpayments and secured $88M in tariff exemptions.',
        large: 'Proactive tariff management for a global equipment manufacturer: WorldLink\'s AI analyzed the full import portfolio, recovering $10M in historical overpayments and securing $88M in tariff exemptions the manual process had been missing.',
        overlay: 'Most enterprises overpay on import tariffs because manual compliance misses exemptions, misclassifies products, and leaves trade-agreement benefits unclaimed. WorldLink\'s AI-powered tariff analytics scanned a global equipment manufacturer\'s import history, recovered $10M in overpayments, and secured $88M in tariff exemptions — turning trade compliance from a cost center into one of the company\'s largest savings programs.',
      },
      tags: ['data-analytics', 'industry-expertise'],
      targetRoles: ['cto', 'cdo', 'line-of-business', 'browsing'],
      targetInterests: ['data-analytics', 'industry-expertise'],
    },
    {
      id: 'o2',
      title: '$10-20M Annual Steel Savings',
      cardType: 'outcome',
      icon: 'factory',
      iconType: 'lucide',
      stat: '$20M',
      url: 'https://worldlink-us.ai/case-studies/steel-supply-chain-optimization',
      description: {
        small: 'AI/ML steel sourcing optimization worth $10-20M a year.',
        medium: 'An AI/ML optimization model for steel sourcing, routing, and fabrication flows, with estimated annual savings of $10-20M across a $200M+ material category.',
        large: 'For a global heavy equipment manufacturer, WorldLink built an AI/ML optimization model covering steel sourcing, routing, and fabrication flows — with estimated annual savings of $10-20M across a $200M+ material category.',
        overlay: 'Steel is one of heavy manufacturing\'s largest and most volatile spend categories. WorldLink built an AI/ML optimization model for a global heavy equipment manufacturer covering sourcing, routing, and fabrication flows across a $200M+ material category — surfacing an estimated $10-20M in annual savings by optimizing decisions that had previously been made plant-by-plant on tribal knowledge.',
      },
      tags: ['data-analytics', 'industry-expertise'],
      targetRoles: ['cto', 'line-of-business', 'innovation-lead', 'browsing'],
      targetInterests: ['data-analytics', 'industry-expertise'],
    },
    {
      id: 'o3',
      title: '80% Analyst Workload Reduction',
      cardType: 'outcome',
      icon: 'sparkles',
      iconType: 'lucide',
      stat: '80%',
      url: 'https://worldlink-us.ai/case-studies/text-to-sql',
      description: {
        small: 'GenAI Text-to-SQL cut query creation from hours to under a minute.',
        medium: 'A GenAI-powered Text-to-SQL solution cut SQL query creation from hours to under a minute at a global financial institution, reducing analyst workload by 80%.',
        large: 'WorldLink\'s Generative AI Text-to-SQL solution let a global financial institution\'s teams query enterprise data in plain English — cutting query creation from hours to under a minute and reducing analyst workload by 80%.',
        overlay: 'Every data question that needs a hand-written SQL query is a bottleneck. WorldLink deployed a GenAI-powered Text-to-SQL solution at a global financial institution that turns natural-language questions into validated queries — cutting query creation from hours to under a minute and reducing analyst workload by 80%. The same pattern now powers WorldLink\'s Intelligent KYC Data Retrieval engine.',
      },
      tags: ['genai-solutions', 'industry-expertise'],
      targetRoles: ['cdo', 'cto', 'innovation-lead', 'browsing'],
      targetInterests: ['genai-solutions', 'data-analytics'],
    },
    {
      id: 'o4',
      title: '8 Incidents/Day Down to 1 a Month',
      cardType: 'outcome',
      icon: 'activity',
      iconType: 'lucide',
      stat: '8→1',
      url: 'https://worldlink-us.ai/case-studies/operational-reliability',
      description: {
        small: 'Production incidents cut from ~8 per day to ~1 every 1-2 months.',
        medium: 'Legacy code remediation and AI-assisted development cut a global financial institution\'s production incidents from roughly 8 per day to about 1 every 1-2 months.',
        large: 'For a global financial institution, WorldLink combined legacy code remediation, process coordination, and AI-assisted development to reduce production incidents from roughly 8 per day to about 1 every 1-2 months across core AI workflows.',
        overlay: 'Eight production incidents a day is an operations team in permanent firefighting mode. WorldLink stabilized a global financial institution\'s core AI workflows through legacy code remediation, process coordination, and AI-assisted development — cutting incidents from roughly 8 per day to about 1 every one-to-two months. Reliability engineering, accelerated by the same AI development tools WorldLink advises clients on.',
      },
      tags: ['technology-innovation', 'managed-services'],
      targetRoles: ['cto', 'cio', 'browsing'],
      targetInterests: ['technology-innovation', 'managed-services'],
    },
    {
      id: 'o5',
      title: '$32M in Dealer Incentive Savings',
      cardType: 'outcome',
      icon: 'target',
      iconType: 'lucide',
      stat: '$32M',
      url: 'https://worldlink-us.ai/case-studies/dealer-incentive-allocation',
      description: {
        small: 'AI/ML incentive optimization found $32M in one product segment.',
        medium: 'A scalable AI/ML optimization model replaced broad historical incentive allocation, identifying $32M in potential savings in a single product segment.',
        large: 'WorldLink replaced a global manufacturer\'s broad, historical dealer incentive allocation with a scalable AI/ML optimization model — improving investment quality, strengthening market penetration, and identifying $32M in potential savings in one product segment.',
        overlay: 'Incentive dollars allocated by historical precedent quietly leak margin. WorldLink built a scalable AI/ML optimization model for a global manufacturer\'s dealer incentive program that allocates investment where it actually moves the market — improving investment quality, strengthening market penetration, and identifying $32M in potential savings in a single product segment alone.',
      },
      tags: ['data-analytics', 'industry-expertise'],
      targetRoles: ['cpo', 'line-of-business', 'browsing'],
      targetInterests: ['data-analytics', 'industry-expertise'],
    },
    {
      id: 'o6',
      title: 'Price Benchmarks Across 300,000+ Parts',
      cardType: 'outcome',
      icon: 'line-chart',
      iconType: 'lucide',
      stat: '300K+',
      url: 'https://worldlink-us.ai/case-studies/pricing-models',
      description: {
        small: 'Scalable price-prediction models across 300,000+ parts, savings in the millions.',
        medium: 'Scalable price-prediction models gave a global heavy equipment manufacturer\'s buyers expected-price benchmarks across 300,000+ parts, unlocking savings in the millions.',
        large: 'WorldLink built scalable price-prediction models covering 300,000+ parts, giving a global heavy equipment manufacturer\'s buyers stronger expected-price benchmarks for negotiations — and unlocking savings in the millions.',
        overlay: 'A buyer negotiating without an expected-price benchmark is negotiating blind. WorldLink\'s scalable price-prediction models cover 300,000+ parts for a global heavy equipment manufacturer, giving every buyer a data-driven read on what a part should cost before the negotiation starts. The result: stronger negotiations and savings in the millions across the procurement organization.',
      },
      tags: ['data-analytics', 'industry-expertise'],
      targetRoles: ['cpo', 'cdo', 'line-of-business', 'browsing'],
      targetInterests: ['data-analytics', 'industry-expertise'],
    },
    {
      id: 'o7',
      title: '$4B Reduction in Forecasting Error',
      cardType: 'outcome',
      icon: 'trending-up',
      iconType: 'lucide',
      stat: '$4B',
      url: 'https://worldlink-us.ai/case-studies',
      description: {
        small: 'ML sales forecasting cut error by $4B annually with 85% forecast accuracy.',
        medium: 'An ML sales forecasting system for a Fortune 15 healthcare wholesaler cut forecasting error by $4B annually, achieving 85% forecast accuracy and a 60% reduction in excess inventory.',
        large: 'WorldLink\'s machine learning forecasting system for a Fortune 15 healthcare wholesaler incorporated historical sales, seasonality, market trends, and external factors — cutting forecasting error by $4B annually, hitting 85% forecast accuracy, and reducing excess inventory 60%.',
        overlay: 'A Fortune 15 healthcare wholesaler rebuilt its sales forecasting on WorldLink\'s machine learning system, which blends historical sales, seasonal patterns, market trends, and external signals across global markets. The results: a $4B annual reduction in forecasting error against baseline, 85% forecast accuracy, a 60% reduction in excess inventory, and real-time adaptation as market conditions shift.',
      },
      tags: ['data-analytics', 'industry-expertise'],
      targetRoles: ['cdo', 'cpo', 'line-of-business', 'browsing'],
      targetInterests: ['data-analytics', 'industry-expertise'],
    },
    {
      id: 'o8',
      title: '100% Deterministic Data Outputs',
      cardType: 'outcome',
      icon: 'database',
      iconType: 'lucide',
      stat: '100%',
      url: 'https://worldlink-us.ai/case-studies/deterministic-processing',
      description: {
        small: 'A transparent PySpark framework cut reconciliation effort 30-40%.',
        medium: 'Replacing undocumented legacy logic with a transparent PySpark framework achieved 100% deterministic outputs and cut reconciliation effort by 30-40%.',
        large: 'WorldLink replaced a global financial institution\'s undocumented, non-deterministic legacy data logic with a transparent PySpark framework — achieving 100% deterministic outputs and cutting reconciliation effort by 30-40%.',
        overlay: 'When legacy data pipelines produce different answers on different runs, every downstream report is suspect. WorldLink replaced a global financial institution\'s undocumented, non-deterministic legacy logic with a transparent PySpark framework: 100% deterministic outputs, full auditability, and a 30-40% cut in reconciliation effort. Data integrity as an engineering guarantee, not an aspiration.',
      },
      tags: ['data-analytics', 'technology-innovation'],
      targetRoles: ['cdo', 'cio', 'cto', 'browsing'],
      targetInterests: ['data-analytics', 'technology-innovation'],
    },

    // ── Learn / Discover (8) — live pages on worldlink-us.ai ──────────
    {
      id: 'l1',
      title: 'Case Study Library',
      cardType: 'learn',
      mediaType: 'website',
      icon: 'library',
      iconType: 'lucide',
      url: 'https://worldlink-us.ai/case-studies',
      description: {
        small: 'Fourteen detailed case studies across GenAI, Supply Chain, and Data Engineering.',
        medium: 'The full WorldLink case study library — fourteen detailed engagements spanning GenAI, Supply Chain, and Data Engineering.',
        large: 'Browse fourteen detailed case studies: tariff management, steel supply chain optimization, Text-to-SQL, KYC data retrieval, deterministic processing, dealer incentives, pricing models, risk reporting governance, and more.',
        overlay: 'The complete WorldLink case study library spans three practice areas — GenAI (Text-to-SQL, intelligent KYC retrieval, customer support assistants, operational reliability), Supply Chain (tariff management, steel optimization, dealer incentives, pricing models, end-to-end visibility), and Data Engineering (deterministic processing, smart industrial data foundations, risk reporting governance). Each one names the problem, the build, and the measured result.',
      },
      tags: ['industry-expertise'],
      targetRoles: ['cto', 'cdo', 'cio', 'cpo', 'innovation-lead', 'line-of-business', 'partner-vendor', 'browsing'],
      targetInterests: ['industry-expertise', 'browsing'],
    },
    {
      id: 'l2',
      title: 'WorldLink Labs: The AI Foundry',
      cardType: 'learn',
      mediaType: 'website',
      icon: 'flask-conical',
      iconType: 'lucide',
      url: 'https://worldlink-us.ai/wl-labs',
      description: {
        small: 'AI solutions, accelerators, and use cases — code you fully own.',
        medium: 'WorldLink Labs builds AI solutions and accelerators as production-ready code that clients fully own, including complete source code.',
        large: 'WorldLink Labs is the AI foundry: proven solutions deployed in client and internal environments, offered as ready-to-use accelerators. No concepts, no platform lock-in — tailored, production-ready code you fully own.',
        overlay: '"We don\'t deliver concepts or lock you into platforms. We deliver tailored, production-ready code that you fully own — including complete source code — so you can extend, adapt, and scale without dependency." WorldLink Labs packages proven solutions as ready-to-use accelerators: Enterprise Cost Optimization AI, Customer Loyalty & Personalization AI, and Operational Efficiency Automation, each customized to your business and deployed into your existing tech stack.',
      },
      tags: ['genai-solutions', 'technology-innovation'],
      targetRoles: ['cto', 'cdo', 'innovation-lead', 'browsing'],
      targetInterests: ['genai-solutions', 'technology-innovation'],
    },
    {
      id: 'l3',
      title: 'Tariff Optimization Knowledge Hub',
      cardType: 'learn',
      mediaType: 'blog',
      icon: 'ship',
      iconType: 'lucide',
      url: 'https://worldlink-us.ai/supply-chain-use-cases',
      description: {
        small: 'How to legally reduce import tariffs with AI and analytics.',
        medium: 'A deep FAQ hub on legally reducing import tariffs: FTAs, duty drawback, classification optimization, and AI-powered compliance.',
        large: 'WorldLink\'s tariff optimization hub answers the questions importers actually ask — how to legally reduce tariffs via FTAs and duty drawback, find refund opportunities in three years of import history, and automate USMCA certifications.',
        overlay: 'A comprehensive knowledge hub on AI-powered tariff optimization: legal strategies to reduce import duties (Free Trade Agreements, duty drawback, classification opportunities, foreign trade zones), how to identify overpayments and refund opportunities from the past three years of customs entries, automating USMCA/FTA certifications (up to 90% less paperwork), and how clients typically achieve 15-35% annual duty cost reductions.',
      },
      tags: ['data-analytics', 'industry-expertise'],
      targetRoles: ['cto', 'cdo', 'line-of-business', 'browsing'],
      targetInterests: ['data-analytics', 'industry-expertise'],
    },
    {
      id: 'l4',
      title: 'AI-Assisted Development Expertise',
      cardType: 'learn',
      mediaType: 'blog',
      icon: 'code',
      iconType: 'lucide',
      url: 'https://worldlink-us.ai/devin',
      description: {
        small: 'Expert guidance on Devin, Copilot, Claude, Cursor, and AI dev tools.',
        medium: 'WorldLink\'s guide to AI-assisted development: Devin ACU optimization, playbooks, knowledge snapshots, and expert oversight.',
        large: 'Deep experience with Devin, GitHub Copilot, Supermaven, Claude, and Cursor — including ACU compute optimization, playbooks, knowledge snapshots, faster onboarding, and the expert oversight that keeps AI-generated code production-grade.',
        overlay: 'WorldLink works hands-on with the full AI development toolchain — Devin, GitHub Copilot, Supermaven, Claude, Cursor, and emerging tools. The knowledge hub covers optimizing Devin\'s ACU compute units, building playbooks and knowledge snapshots, AI-accelerated onboarding and documentation, legacy code modernization, and why experienced developer oversight is what separates production-grade AI-assisted development from expensive experiments.',
      },
      tags: ['technology-innovation', 'genai-solutions'],
      targetRoles: ['cto', 'cio', 'innovation-lead', 'browsing'],
      targetInterests: ['technology-innovation', 'genai-solutions'],
    },
    {
      id: 'l5',
      title: 'Compliance-by-Design, Explained',
      cardType: 'learn',
      mediaType: 'blog',
      icon: 'scale',
      iconType: 'lucide',
      url: 'https://worldlink-us.ai/grc',
      description: {
        small: 'What proactive, AI-driven GRC actually looks like.',
        medium: 'How AI turns governance, risk, and compliance from reactive audit-prep into proactive, continuous alignment.',
        large: 'Proactive compliance means finding gaps before they become violations. This hub explains AI-driven GRC: continuous policy evaluation, architecture- and code-level validation, human-in-the-loop review, and full explainability for auditors.',
        overlay: 'Traditional GRC is manual, reactive, and fragmented — teams drown in framework interpretation and audit prep while gaps slip through. This knowledge hub explains the proactive alternative: AI that continuously evaluates policies, risks, and controls against regulatory frameworks; validates system architectures and even source code for compliance before implementation; keeps a human-in-the-loop on every recommendation; and documents its reasoning so every decision is traceable, explainable, and defensible in front of an auditor.',
      },
      tags: ['strategic-advisory', 'industry-expertise'],
      targetRoles: ['cio', 'cdo', 'partner-vendor', 'browsing'],
      targetInterests: ['strategic-advisory', 'industry-expertise'],
    },
    {
      id: 'l6',
      title: 'The Enterprise AI Adoption Roadmap',
      cardType: 'learn',
      mediaType: 'blog',
      icon: 'map',
      iconType: 'lucide',
      url: 'https://worldlink-us.ai/wl-labs',
      description: {
        small: 'A four-stage path from AI maturity assessment to enterprise scale.',
        medium: 'WorldLink\'s four-stage AI adoption framework: assess maturity, pilot high-value/low-risk, scale to production, expand across the enterprise.',
        large: 'The WorldLink AI adoption roadmap: evaluate your organization\'s AI maturity and identify impact areas; run a high-value, low-risk pilot with defined success criteria; scale into production with monitoring and governance; then expand enterprise-wide.',
        overlay: 'Most AI programs stall between the pilot and production. WorldLink\'s adoption framework is a four-stage arc: (1) evaluate current AI maturity and identify business areas where AI can drive impact, with a clear adoption roadmap; (2) choose a high-value, low-risk pilot with technical feasibility, business alignment, and defined success criteria; (3) scale and integrate the pilot into production with monitoring and governance frameworks; (4) expand across business units while fostering an AI-driven culture through training and continuous optimization.',
      },
      tags: ['strategic-advisory', 'transformation-enablement'],
      targetRoles: ['cio', 'cpo', 'innovation-lead', 'line-of-business', 'browsing'],
      targetInterests: ['strategic-advisory', 'transformation-enablement'],
    },
    {
      id: 'l7',
      title: 'Executive Testimonials',
      cardType: 'learn',
      mediaType: 'website',
      icon: 'quote',
      iconType: 'lucide',
      url: 'https://worldlink-us.ai/',
      description: {
        small: 'Fortune 100 CTOs, CDOs, and CIOs on working with WorldLink.',
        medium: 'What Fortune 100 executives say — from payment processing, pharma wholesale, delivery, and machinery manufacturing.',
        large: 'Testimonials from the C-suite: a Fortune 100 payment processor\'s CTO, a Fortune 100 pharmaceutical wholesaler\'s CDO, a division CIO/CDO at one of the largest US delivery companies, and a CPO in ag and construction machinery.',
        overlay: '"I was thoroughly impressed by WorldLink\'s expertise in the data space... making it easy to recommend WorldLink to another Fortune 100 company" — CTO, Fortune 100 payment processor. Additional testimonials come from the CDO of a Fortune 100 pharmaceutical wholesaler, a division CIO/CDO at one of the largest US delivery companies, the CPO of an ag and construction machinery manufacturer, and the CIO of a private-equity-owned youth enrichment platform — a pattern of executive-level trust across industries.',
      },
      tags: ['industry-expertise', 'strategic-advisory'],
      targetRoles: ['cdo', 'cpo', 'partner-vendor', 'line-of-business', 'browsing'],
      targetInterests: ['industry-expertise', 'browsing'],
    },
    {
      id: 'l8',
      title: 'Partners & The ADI Group',
      cardType: 'learn',
      mediaType: 'website',
      icon: 'handshake',
      iconType: 'lucide',
      url: 'https://worldlink-us.ai/partners',
      description: {
        small: 'WorldLink\'s partner ecosystem and its ADI Group parent.',
        medium: 'WorldLink is an ADI Group company — a collection of organizations driving enterprise and social innovation together.',
        large: 'Explore WorldLink\'s partner ecosystem and its parent, the ADI Group — a collection of organizations that collectively drives both enterprise and social innovation, spanning strategy through managed services.',
        overlay: 'WorldLink operates inside the ADI Group, "a collection of organizations that collectively drives both enterprise and social innovation" — spanning AI, cloud, and data engineering from strategy through managed services, alongside the ADI Group Foundation\'s social mission. The partners page maps the ecosystem WorldLink brings to an engagement beyond its own bench.',
      },
      tags: ['strategic-advisory'],
      targetRoles: ['partner-vendor', 'cdo', 'cio', 'browsing'],
      targetInterests: ['strategic-advisory', 'browsing'],
    },

    // ── Solutions (8) — live accelerators & practice areas ────────────
    {
      id: 's1',
      title: 'CodifAI: AI-Powered GRC',
      cardType: 'solution',
      icon: 'scale',
      iconType: 'lucide',
      url: 'https://worldlink-us.ai/grc',
      description: {
        small: 'Compliance intelligence for Basel III, PCI-DSS, SOC 2, ISO 27001, GDPR, DORA.',
        medium: 'CodifAI is an AI-driven compliance intelligence fabric for BFSI — continuous alignment with Basel III, PCI-DSS, SOC 2, ISO 27001, GDPR, and DORA.',
        large: 'Built for banking, financial services, and insurance, CodifAI evaluates policies, risks, and controls in real time against major frameworks — cutting compliance documentation time 60-70% and audit prep cycles 40-50%, with value in 4-6 weeks.',
        overlay: 'CodifAI replaces manual, reactive GRC with an AI-driven, on-demand compliance intelligence fabric. Query compliance requirements in natural language, validate architecture diagrams and source code against regulatory requirements before implementation, and maintain continuous alignment with Basel III, PCI-DSS, SOC 2, ISO 27001, GDPR, and DORA. Human-in-the-loop validation and full audit trails keep every recommendation explainable. Reported results: 60-70% less compliance documentation time, 40-50% faster audit prep, 30-40% fewer gaps found in audits — with initial value in four to six weeks.',
      },
      tags: ['genai-solutions', 'strategic-advisory'],
      targetRoles: ['cio', 'cdo', 'cto', 'browsing'],
      targetInterests: ['genai-solutions', 'strategic-advisory', 'industry-expertise'],
    },
    {
      id: 's2',
      title: 'AI-Powered Tariff Optimization',
      cardType: 'solution',
      icon: 'ship',
      iconType: 'lucide',
      url: 'https://worldlink-us.ai/supply-chain-use-cases',
      description: {
        small: '15-35% annual duty savings through intelligent trade analytics.',
        medium: 'AI that classifies products, monitors regulations, and finds duty exemptions automatically — clients save 15-35% annually on import tariffs.',
        large: 'The tariff optimization platform automates classification, monitors global trade policy in real time, flags exemptions before goods clear customs, and recovers up to three years of overpayments. Typical results: 15-35% annual duty reduction, 60-80% of compliance automated.',
        overlay: 'WorldLink\'s tariff optimization platform combines ML-based tariff classification, real-time regulatory monitoring, and predictive duty planning across your entire import portfolio. It flags exemptions and preferential rates before goods clear customs, automates USMCA/FTA certification, and analyzes three years of history for refund claims. Published client results: a global manufacturer cut annual duty costs 28% ($4.2M), an e-commerce retailer recovered $1.8M in overpayments, a distributor cut customs clearance time 65%. Deploys in 4-8 weeks via API integration with existing ERP and customs systems.',
      },
      tags: ['data-analytics', 'industry-expertise'],
      targetRoles: ['cto', 'cdo', 'line-of-business', 'browsing'],
      targetInterests: ['data-analytics', 'industry-expertise'],
    },
    {
      id: 's3',
      title: 'Intelligent Workforce Orchestration Layer',
      cardType: 'solution',
      icon: 'network',
      iconType: 'lucide',
      url: 'https://worldlink-us.ai/iwol',
      description: {
        small: 'A multi-agent mesh that answers questions across all your systems.',
        medium: 'IWOL is a multi-agent orchestrator: ask a question in plain English and an agentic mesh retrieves, reconciles, and analyzes data across enterprise systems.',
        large: 'The Intelligent Workforce Orchestration Layer connects enterprise systems through an agentic mesh — ask "what\'s our headcount by department?" and specialized agents retrieve, reconcile, and analyze data across platforms, instantly and compliantly.',
        overlay: 'IWOL eliminates data silos with an agentic mesh: when a user asks a question in plain English, the platform determines which systems hold the answer, coordinates specialized agents to retrieve from them simultaneously, reconciles discrepancies with confidence scoring and data lineage, and returns a unified, compliant answer in real time. Built on a modern stack — FastAPI, Qwen 2.5 72B, Milvus vector search, PostgreSQL, Model Context Protocol, and LangGraph multi-agent orchestration. HR is the flagship use case: headcount, attrition, payroll reconciliation, and recruitment pipeline questions answered without touching five systems.',
      },
      tags: ['genai-solutions', 'technology-innovation'],
      targetRoles: ['cto', 'cio', 'innovation-lead', 'line-of-business', 'browsing'],
      targetInterests: ['genai-solutions', 'technology-innovation', 'transformation-enablement'],
    },
    {
      id: 's4',
      title: 'AI Enablement Layer',
      cardType: 'solution',
      icon: 'layers',
      iconType: 'lucide',
      url: 'https://worldlink-us.ai/ai-layer',
      description: {
        small: 'Centralized GenAI orchestration with enterprise-grade security.',
        medium: 'A centralized GenAI orchestration layer enabling context-aware reasoning with internal data security, governance, and visibility.',
        large: 'The AI Enablement Layer is the governance backbone for enterprise GenAI — centralized orchestration that gives every AI application context-aware reasoning over internal data while enforcing security, compliance, and visibility.',
        overlay: 'Enterprises adopting GenAI piecemeal end up with ungoverned AI sprawl. The AI Enablement Layer centralizes GenAI orchestration into one governed layer: context-aware reasoning over internal data, security and access control enforced at the platform level, and full visibility into what every AI application is doing. It\'s the difference between fifty disconnected AI experiments and one enterprise AI capability that compounds.',
      },
      tags: ['genai-solutions', 'technology-innovation'],
      targetRoles: ['cto', 'cio', 'cdo', 'browsing'],
      targetInterests: ['genai-solutions', 'technology-innovation'],
    },
    {
      id: 's5',
      title: 'WorldLink Labs Accelerators',
      cardType: 'solution',
      icon: 'rocket',
      iconType: 'lucide',
      url: 'https://worldlink-us.ai/wl-labs',
      description: {
        small: 'Ready-to-use AI accelerators, customized and fully owned.',
        medium: 'Proven AI solutions offered as ready-to-use accelerators: cost optimization, customer loyalty and personalization, and operational efficiency automation.',
        large: 'WorldLink Labs accelerators are proven solutions from client and internal deployments, packaged for rapid customization: Enterprise Cost Optimization AI, Customer Loyalty & Personalization AI, and Operational Efficiency Automation — delivered as code you own.',
        overlay: 'The Labs accelerator portfolio turns WorldLink\'s deployed solutions into fast starting points: Enterprise Cost Optimization AI, Customer Loyalty & Personalization AI, and Operational Efficiency Automation, plus supply chain intelligence (tariffs, risk, route optimization) and AI-powered GRC. Every accelerator deploys into your existing tech stack and ships as tailored, production-ready code with complete source — extend, adapt, and scale with no platform dependency.',
      },
      tags: ['genai-solutions', 'technology-innovation', 'transformation-enablement'],
      targetRoles: ['cto', 'innovation-lead', 'cpo', 'browsing'],
      targetInterests: ['genai-solutions', 'technology-innovation', 'transformation-enablement'],
    },
    {
      id: 's6',
      title: 'Semantic Model Migration Accelerator',
      cardType: 'solution',
      icon: 'database',
      iconType: 'lucide',
      url: 'https://worldlink-us.ai/wl-labs',
      description: {
        small: 'Power BI to Databricks metric views in minutes, not days.',
        medium: 'Migrates Power BI semantic models to governed Databricks Unity Catalog metric views — a 2-3 day manual job done in under two minutes per model.',
        large: 'A WorldLink Labs accelerator for semantic-layer modernization: deterministic DAX-to-SQL conversion, KPI parity validation against the Power BI baseline, and Genie-ready Unity Catalog metric views — 60-80% faster than manual migration.',
        overlay: 'Enterprises have years invested in Power BI semantic models that stay stuck in legacy BI tooling as the lakehouse becomes the platform of record. This accelerator converts Power BI TMDL into governed Unity Catalog metric views through a deterministic pipeline — DAX-to-SQL translation, flagged-measure review bundles, and KPI parity validation against the Power BI baseline. A model that takes an engineer 2-3 days manually processes in under two minutes, with migrated metrics landing as first-class governed objects ready for Databricks Genie natural-language queries. Net effect: 60-80% faster migration.',
      },
      tags: ['data-analytics', 'technology-innovation'],
      targetRoles: ['cdo', 'cto', 'cio', 'browsing'],
      targetInterests: ['data-analytics', 'technology-innovation'],
    },
    {
      id: 's7',
      title: 'AI-Accelerated Development',
      cardType: 'solution',
      icon: 'code',
      iconType: 'lucide',
      url: 'https://worldlink-us.ai/devin',
      description: {
        small: 'Context-engineering with Devin, Copilot, Claude, and Cursor.',
        medium: 'WorldLink pairs AI coding tools with expert oversight — optimized playbooks, knowledge snapshots, and production-grade quality assurance.',
        large: 'Context-engineering accelerated development: WorldLink brings deep, hands-on expertise with Devin, GitHub Copilot, Supermaven, Claude, and Cursor — plus the experienced-developer oversight that keeps AI-generated code secure, performant, and maintainable.',
        overlay: 'AI coding tools multiply output only when someone knows how to run them. WorldLink\'s AI-accelerated development practice covers Devin ACU compute optimization, playbook and knowledge-snapshot engineering, AI-generated documentation and wikis for faster onboarding, legacy modernization, and CI/CD integration — all under experienced developer oversight so AI-generated solutions meet production standards for security, performance, and maintainability. The same practice that helped cut a financial institution\'s production incidents from 8 a day to 1 a month.',
      },
      tags: ['technology-innovation', 'transformation-enablement'],
      targetRoles: ['cto', 'cio', 'innovation-lead', 'browsing'],
      targetInterests: ['technology-innovation', 'transformation-enablement', 'managed-services'],
    },
    {
      id: 's8',
      title: 'Strategy Through Managed Services',
      cardType: 'solution',
      icon: 'compass',
      iconType: 'lucide',
      url: 'https://worldlink-us.ai/',
      description: {
        small: 'End-to-end: advisory, innovation, enablement, and operations.',
        medium: 'The full WorldLink arc — Strategic Advisory, Technology Innovation, and Transformation Enablement, sustained by managed services after go-live.',
        large: 'WorldLink covers the full lifecycle: Strategic Advisory to pick the right initiatives, Technology Innovation to build them, Transformation Enablement to land them in the organization, and managed services to keep them delivering after go-live.',
        overlay: 'Most transformation failures happen in the handoffs — strategy that never ships, builds that never get adopted, systems that decay after launch. WorldLink\'s model closes the loop: Strategic Advisory (use-case design and executive-team alignment), Technology Innovation (custom AI, data, and cloud engineering), Transformation Enablement (change management and adoption), and sustained managed services. One partner, 25 years of practice, from the first workshop to steady-state operations.',
      },
      tags: ['strategic-advisory', 'transformation-enablement', 'managed-services'],
      targetRoles: ['cio', 'cdo', 'cpo', 'innovation-lead', 'partner-vendor', 'browsing'],
      targetInterests: ['strategic-advisory', 'transformation-enablement', 'managed-services'],
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
