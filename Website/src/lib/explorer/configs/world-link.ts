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
    // ─────────────────────────────────────────────────────────────────

    // ── Outcomes / Impact (8) — all real case studies ─────────────────
    {
      id: 'o1',
      title: '$4B Reduction in Forecasting Error',
      cardType: 'outcome',
      icon: 'trending-up',
      iconType: 'lucide',
      stat: '$4B',
      description: {
        small: 'An improved sales forecasting system cut error by $4B annually.',
        medium: 'For an F15 healthcare wholesaler, WorldLink built an improved sales forecasting system that reduced forecasting error by $4B annually against the baseline dataset.',
        large: 'A Fortune 15 healthcare wholesaler needed sharper demand signals. WorldLink\'s improved sales forecasting system cut forecasting error by $4B annually versus the baseline — turning guesswork into a planning advantage.',
        overlay: 'A Fortune 15 healthcare wholesaler partnered with WorldLink to rebuild its sales forecasting system from the ground up. The result: a $4B annual reduction in forecasting error against the baseline dataset — the kind of precision that reshapes inventory planning, supplier negotiations, and working capital at enterprise scale.',
      },
      tags: ['data-analytics', 'industry-expertise'],
      targetRoles: ['cdo', 'cpo', 'line-of-business', 'browsing'],
      targetInterests: ['data-analytics', 'industry-expertise'],
    },
    {
      id: 'o2',
      title: '25% Lower Operating Cost',
      cardType: 'outcome',
      icon: 'package',
      iconType: 'lucide',
      stat: '25%',
      description: {
        small: 'Empty container placement optimization cut operating costs 25%.',
        medium: 'A logistics and distribution optimization of empty container placement delivered a 25% reduction in overall operating cost.',
        large: 'WorldLink optimized empty container placement for a logistics and distribution client, delivering a 25% reduction in overall operating cost through smarter positioning and routing logic.',
        overlay: 'Empty containers sitting in the wrong place cost logistics operators millions in repositioning and idle time. WorldLink\'s empty container placement optimization solution delivered a 25% reduction in overall operating cost — a featured case study in operational efficiency through applied GenAI and optimization modeling.',
      },
      tags: ['genai-solutions', 'industry-expertise'],
      targetRoles: ['cto', 'cio', 'line-of-business', 'browsing'],
      targetInterests: ['genai-solutions', 'industry-expertise'],
    },
    {
      id: 'o3',
      title: '$75M in Labor Cost Savings',
      cardType: 'outcome',
      icon: 'shield-check',
      iconType: 'lucide',
      stat: '$75M',
      description: {
        small: 'GenAI-powered control and risk monitoring saved $75M in labor costs.',
        medium: 'For an F100 financial services institution, a GenAI-based control and risk monitoring solution generated $75M in labor cost savings.',
        large: 'WorldLink developed a control and risk monitoring solution powered by Gen AI for a Fortune 100 financial services institution, generating $75M in labor cost savings.',
        overlay: 'Manual control and risk monitoring at Fortune 100 scale is labor-intensive and error-prone. WorldLink developed a Gen AI-powered control and risk monitoring solution for an F100 financial services institution that generated $75M in labor cost savings — freeing analysts to focus on judgment calls, not repetitive review.',
      },
      tags: ['genai-solutions', 'industry-expertise'],
      targetRoles: ['cto', 'cdo', 'browsing'],
      targetInterests: ['genai-solutions', 'industry-expertise'],
    },
    {
      id: 'o4',
      title: '$70.5M Retention Opportunity',
      cardType: 'outcome',
      icon: 'plane',
      iconType: 'lucide',
      stat: '$70.5M',
      description: {
        small: 'Predictive analytics identified $70.5M in incremental revenue retention.',
        medium: 'For a destination airline, predictive analytics on attrition identified $70.5M as an incremental revenue retention opportunity.',
        large: 'WorldLink applied predictive analytics to customer attrition for a destination airline, identifying $70.5M in incremental revenue retention opportunity.',
        overlay: 'Every churned customer is revenue walking out the door. WorldLink\'s predictive analytics attrition model for a destination airline identified $70.5M in incremental revenue retention opportunity — turning a lagging indicator (churn) into a leading one (at-risk customers, flagged early).',
      },
      tags: ['data-analytics', 'industry-expertise'],
      targetRoles: ['cdo', 'line-of-business', 'browsing'],
      targetInterests: ['data-analytics', 'industry-expertise'],
    },
    {
      id: 'o5',
      title: '30% Supply Chain Cost Reduction',
      cardType: 'outcome',
      icon: 'truck',
      iconType: 'lucide',
      stat: '30%',
      description: {
        small: 'IoT-optimized supply chain cut costs 30% for a national defense agency.',
        medium: 'For a national defense agency, an IoT-optimized supply chain delivered a 30% cost reduction without compromising availability or reliability.',
        large: 'WorldLink optimized supply chain operations with IoT data for a national defense agency, delivering a 30% cost reduction while maintaining availability and reliability standards.',
        overlay: 'Defense-grade supply chains can\'t trade cost for reliability. WorldLink\'s IoT-optimized supply chain solution for a national defense agency delivered a 30% cost reduction without compromising availability or reliability — proof that efficiency and mission-readiness aren\'t mutually exclusive.',
      },
      tags: ['technology-innovation', 'industry-expertise'],
      targetRoles: ['cto', 'cio', 'line-of-business', 'browsing'],
      targetInterests: ['technology-innovation', 'industry-expertise'],
    },
    {
      id: 'o6',
      title: '15% Revenue Increase',
      cardType: 'outcome',
      icon: 'line-chart',
      iconType: 'lucide',
      stat: '15%',
      description: {
        small: 'Unsupervised learning on customer intelligence lifted revenue 15%.',
        medium: 'For an F100 commercial bank, unsupervised learning applied to customer intelligence increased revenue 15% through enhanced customer insight.',
        large: 'WorldLink built a customer intelligence solution using unsupervised learning for a Fortune 100 commercial bank, increasing revenue 15% through sharper customer insight.',
        overlay: 'A Fortune 100 commercial bank wanted to understand its customers beyond the obvious segments. WorldLink\'s unsupervised learning approach to customer intelligence uncovered patterns traditional segmentation missed — driving a 15% revenue increase through enhanced customer insight.',
      },
      tags: ['data-analytics', 'industry-expertise'],
      targetRoles: ['cdo', 'cio', 'browsing'],
      targetInterests: ['data-analytics', 'industry-expertise'],
    },
    {
      id: 'o7',
      title: '100% SLA Enablement',
      cardType: 'outcome',
      icon: 'wifi',
      iconType: 'lucide',
      stat: '100%',
      description: {
        small: 'IoT predictive maintenance enabled 100% network uptime SLA.',
        medium: 'For a Global 10 network gear manufacturer, IoT predictive maintenance and network performance prediction enabled 100% of the network uptime SLA.',
        large: 'WorldLink built IoT predictive maintenance and network performance prediction for a Global 10 network gear manufacturer, enabling 100% enablement of SLA for network uptime.',
        overlay: 'Network uptime SLAs are unforgiving. WorldLink\'s IoT predictive maintenance and network performance prediction solution for a Global 10 network gear manufacturer enabled 100% enablement of the network uptime SLA — catching failures before they became outages.',
      },
      tags: ['technology-innovation', 'industry-expertise'],
      targetRoles: ['cto', 'cio', 'browsing'],
      targetInterests: ['technology-innovation', 'industry-expertise'],
    },
    {
      id: 'o8',
      title: '3% Savings on Multi-Million-Dollar Bids',
      cardType: 'outcome',
      icon: 'target',
      iconType: 'lucide',
      stat: '3%',
      description: {
        small: 'An ML bid win predictor saved 3% on multi-million-dollar projects.',
        medium: 'For a commercial steel manufacturer, an ML model for bid win prediction saved 3% on multi-million-dollar projects through better win-rate prediction.',
        large: 'WorldLink built a machine learning bid win predictor for a commercial steel manufacturer, saving 3% on multi-million-dollar projects by better predicting win rates before bids were submitted.',
        overlay: 'Bidding on multi-million-dollar projects without a read on win probability is expensive guesswork. WorldLink\'s ML model for bid win prediction gave a commercial steel manufacturer a data-driven read on which bids to pursue and how to price them — saving 3% across multi-million-dollar projects.',
      },
      tags: ['genai-solutions', 'industry-expertise'],
      targetRoles: ['cpo', 'line-of-business', 'browsing'],
      targetInterests: ['genai-solutions', 'industry-expertise'],
    },

    // ── Learn / Discover (7) ─────────────────────────
    {
      id: 'l1',
      title: 'Visit WorldLink',
      cardType: 'learn',
      mediaType: 'website',
      icon: 'globe',
      iconType: 'lucide',
      url: 'https://worldlink-us.ai/',
      description: {
        small: 'The full WorldLink story, online.',
        medium: 'The official WorldLink site — services, insights, case studies, and how to get started.',
        large: 'worldlink-us.ai is the front door — services across Strategic Advisory, Technology Innovation, and Transformation Enablement, plus the full case study library.',
        overlay: 'Bookmark the WorldLink homepage — every service line, the Insights library, and the path to start a conversation with a WorldLink partner. The fastest way to see the case studies and results that matter to your industry before your follow-up call.',
      },
      tags: ['website'],
      targetRoles: ['cto', 'cdo', 'cio', 'cpo', 'innovation-lead', 'line-of-business', 'partner-vendor', 'browsing'],
      targetInterests: ['browsing'],
    },
    {
      id: 'l2',
      title: 'Harnessing GenAI for Competitive Advantage',
      cardType: 'learn',
      mediaType: 'blog',
      icon: 'sparkles',
      iconType: 'lucide',
      url: 'https://worldlink-us.ai/',
      description: {
        small: 'A strategic guide to GenAI for enterprises.',
        medium: 'A featured article on harnessing GenAI for competitive advantage — a strategic guide for enterprises.',
        large: 'WorldLink\'s featured guide on harnessing GenAI for competitive advantage walks enterprise leaders through where GenAI creates real differentiation versus where it\'s commodity.',
        overlay: 'Not every GenAI initiative creates competitive advantage — most create parity at best. This featured guide walks through where GenAI investment actually differentiates an enterprise, how to sequence pilots into production, and the governance guardrails that keep custom GenAI both powerful and safe.',
      },
      tags: ['genai-solutions'],
      targetRoles: ['cto', 'cdo', 'cpo', 'innovation-lead', 'browsing'],
      targetInterests: ['genai-solutions'],
    },
    {
      id: 'l3',
      title: 'Implementing AI Solutions: Secure, Trusted, Customized',
      cardType: 'learn',
      mediaType: 'blog',
      icon: 'shield-check',
      iconType: 'lucide',
      url: 'https://worldlink-us.ai/',
      description: {
        small: 'What it takes to implement AI securely and reliably.',
        medium: 'A featured article on implementing AI solutions that are secure, trusted, and customized for your business.',
        large: 'This featured article covers what enterprise-grade AI implementation actually requires — security, trust, and customization to the business, not off-the-shelf models bolted onto a workflow.',
        overlay: 'Enterprise AI lives or dies on trust. This featured article covers WorldLink\'s approach to implementing AI solutions that are secure by design, auditable enough for regulated industries, and customized to the specific business problem — rather than a generic model dropped into a workflow.',
      },
      tags: ['genai-solutions', 'strategic-advisory'],
      targetRoles: ['cto', 'cio', 'cdo', 'browsing'],
      targetInterests: ['genai-solutions', 'strategic-advisory'],
    },
    {
      id: 'l4',
      title: 'Case Study: Empty Container Placement',
      cardType: 'learn',
      mediaType: 'blog',
      icon: 'package',
      iconType: 'lucide',
      url: 'https://worldlink-us.ai/',
      description: {
        small: 'How WorldLink cut logistics costs 25% with optimization.',
        medium: 'The full case study behind the empty container placement optimization that cut operating costs 25% for a logistics client.',
        large: 'A deep dive into the empty container placement optimization project — the modeling approach, the data pipeline, and the 25% operating cost reduction it delivered.',
        overlay: 'The full story behind the 25% operating cost reduction: how WorldLink modeled empty container placement across a logistics and distribution network, what data pipeline fed the optimization, and how the recommendation engine was rolled into daily operations without disrupting existing workflows.',
      },
      tags: ['genai-solutions', 'industry-expertise'],
      targetRoles: ['cto', 'cio', 'line-of-business', 'browsing'],
      targetInterests: ['genai-solutions', 'industry-expertise'],
    },
    {
      id: 'l5',
      title: 'Empowering Operational Efficiency With GenAI',
      cardType: 'learn',
      mediaType: 'blog',
      icon: 'zap',
      iconType: 'lucide',
      url: 'https://worldlink-us.ai/',
      description: {
        small: 'How GenAI drives operational efficiency across the enterprise.',
        medium: 'A featured case study on empowering operational efficiency with GenAI across enterprise workflows.',
        large: 'This featured case study covers how WorldLink applies GenAI to operational efficiency — surfacing where automation and augmentation change the cost structure of core workflows.',
        overlay: 'Operational efficiency gains from GenAI rarely come from replacing a whole workflow — they come from surgical automation of the highest-friction steps. This featured case study walks through WorldLink\'s approach to finding those steps and applying GenAI where it moves the needle fastest.',
      },
      tags: ['genai-solutions', 'transformation-enablement'],
      targetRoles: ['cio', 'cpo', 'innovation-lead', 'browsing'],
      targetInterests: ['genai-solutions', 'transformation-enablement'],
    },
    {
      id: 'l6',
      title: 'Our Purpose & Mission',
      cardType: 'learn',
      mediaType: 'website',
      icon: 'compass',
      iconType: 'lucide',
      url: 'https://worldlink-us.ai/',
      description: {
        small: 'What drives WorldLink as a technology partner.',
        medium: 'WorldLink\'s purpose and mission — an innovative global technology firm partnering with leading enterprises on their most important challenges.',
        large: 'WorldLink is an innovative global technology firm that partners with leading enterprises to tackle their most important challenges, fostering an environment of innovation and forward-thinking.',
        overlay: '"We are an innovative global technology firm that partners with leading enterprises to tackle their most important challenges. Every day, we nurture an environment that fosters innovation and forward-thinking, driving us closer to our vision of a brighter, tech-driven future. Together, we are shaping the world, one transformative solution at a time."',
      },
      tags: ['strategic-advisory'],
      targetRoles: ['cdo', 'cio', 'partner-vendor', 'browsing'],
      targetInterests: ['strategic-advisory', 'browsing'],
    },
    {
      id: 'l7',
      title: '25 Years, Global Reach',
      cardType: 'learn',
      mediaType: 'website',
      icon: 'globe-2',
      iconType: 'lucide',
      url: 'https://worldlink-us.ai/',
      description: {
        small: '25 years of excellence, WorldLinkers across 9 time zones.',
        medium: '25 years of excellence and WorldLinkers working across 9 time zones on projects spanning Financial Services, Supply Chain, Manufacturing, and Telecom.',
        large: 'With 25 years of mastery and a global team of WorldLinkers across 9 time zones, WorldLink engineers digital solutions fueling innovation and growth for enterprises worldwide.',
        overlay: '"With a global reach and 25 years of mastery, we engineer digital solutions fueling innovation and growth. Our technical excellence and industry-leading insights make us the right partner to build the cutting-edge solutions that elevate your competitive advantage." WorldLinkers across 9 time zones support projects in Financial Services, Supply Chain, Manufacturing, and Telecom.',
      },
      tags: ['strategic-advisory', 'industry-expertise'],
      targetRoles: ['cdo', 'cpo', 'partner-vendor', 'browsing'],
      targetInterests: ['industry-expertise', 'browsing'],
    },

    // ── Solutions (7) ─────────────────────────
    {
      id: 's1',
      title: 'Strategic Advisory',
      cardType: 'solution',
      icon: 'compass',
      iconType: 'lucide',
      description: {
        small: 'Enterprise strategy for data, AI, and digital transformation.',
        medium: 'Strategic Advisory helps enterprises define the right data, AI, and transformation strategy before committing engineering resources.',
        large: 'WorldLink\'s Strategic Advisory practice works with executive teams to define the right data, AI, and digital transformation strategy — sequencing initiatives so investment goes toward what actually moves the business.',
        overlay: 'Before any code gets written, Strategic Advisory answers the harder question: which initiatives actually matter? WorldLink works directly with executive teams — as testimonials describe, "engagement with our entire executive team" — to build a holistic strategy tailored to specific business challenges, not a generic playbook.',
      },
      tags: ['strategic-advisory'],
      targetRoles: ['cdo', 'cio', 'innovation-lead', 'partner-vendor', 'browsing'],
      targetInterests: ['strategic-advisory'],
    },
    {
      id: 's2',
      title: 'Technology Innovation',
      cardType: 'solution',
      icon: 'cpu',
      iconType: 'lucide',
      description: {
        small: 'Applying emerging tech — AI, IoT, ML — to enterprise problems.',
        medium: 'Technology Innovation applies AI, IoT, and machine learning to hard enterprise problems, from predictive maintenance to bid-win prediction.',
        large: 'WorldLink\'s Technology Innovation practice builds custom AI, IoT, and ML solutions — the same engineering behind the network-uptime, supply-chain, and forecasting case studies in the Impact tab.',
        overlay: 'Technology Innovation is where WorldLink\'s case studies come from — the IoT predictive maintenance that hit 100% SLA enablement, the ML bid-win predictor that saved 3% on steel manufacturing bids, the supply-chain optimization that cut defense-agency costs 30%. Applied engineering, not research-lab experiments.',
      },
      tags: ['technology-innovation'],
      targetRoles: ['cto', 'cio', 'innovation-lead', 'browsing'],
      targetInterests: ['technology-innovation'],
    },
    {
      id: 's3',
      title: 'Transformation Enablement',
      cardType: 'solution',
      icon: 'rocket',
      iconType: 'lucide',
      description: {
        small: 'Turning strategy into adopted, running change.',
        medium: 'Transformation Enablement carries a strategy through execution — change management, adoption, and operational rollout.',
        large: 'The gap between a good strategy and a shipped transformation is where most enterprise initiatives die. WorldLink\'s Transformation Enablement practice closes that gap with hands-on execution support.',
        overlay: 'A brilliant data strategy that never gets adopted is worth nothing. Transformation Enablement is WorldLink\'s answer to the execution gap — change management, stakeholder alignment, and operational rollout support that gets a strategy from PowerPoint into production and actually adopted by the teams who have to live with it.',
      },
      tags: ['transformation-enablement'],
      targetRoles: ['cio', 'cpo', 'innovation-lead', 'line-of-business', 'browsing'],
      targetInterests: ['transformation-enablement'],
    },
    {
      id: 's4',
      title: 'Data & Analytics Solutions',
      cardType: 'solution',
      icon: 'database',
      iconType: 'lucide',
      description: {
        small: 'Forecasting, customer intelligence, and predictive analytics.',
        medium: 'Data & Analytics Solutions cover forecasting, customer intelligence, and predictive analytics — the engine behind several of WorldLink\'s headline case studies.',
        large: 'From the $4B forecasting-error reduction to the 15% revenue lift from unsupervised customer intelligence, Data & Analytics Solutions is where WorldLink turns enterprise data into decisions.',
        overlay: 'Data & Analytics Solutions is the practice behind some of WorldLink\'s biggest numbers: the $4B annual forecasting-error reduction for a healthcare wholesaler, the $70.5M attrition-retention opportunity for an airline, the 15% revenue increase from unsupervised customer intelligence at a Fortune 100 bank. Forecasting, segmentation, and predictive analytics, built for enterprise scale.',
      },
      tags: ['data-analytics'],
      targetRoles: ['cto', 'cdo', 'cio', 'line-of-business', 'browsing'],
      targetInterests: ['data-analytics'],
    },
    {
      id: 's5',
      title: 'Managed Services',
      cardType: 'solution',
      icon: 'settings',
      iconType: 'lucide',
      description: {
        small: 'Ongoing operation and support after go-live.',
        medium: 'Managed Services keeps data, AI, and technology solutions running, monitored, and improving after the initial build is complete.',
        large: 'WorldLink\'s Managed Services offering covers sustained operations after deployment — monitoring, support, and continuous improvement so a solution keeps delivering value long after go-live.',
        overlay: 'A model that isn\'t monitored drifts. Managed Services is WorldLink\'s commitment past go-live — ongoing operations, monitoring, and continuous improvement for data pipelines, AI models, and the infrastructure underneath them, so the ROI from a project doesn\'t decay six months after launch.',
      },
      tags: ['managed-services'],
      targetRoles: ['cto', 'cio', 'browsing'],
      targetInterests: ['managed-services'],
    },
    {
      id: 's6',
      title: 'Custom GenAI Solutions',
      cardType: 'solution',
      icon: 'sparkles',
      iconType: 'lucide',
      description: {
        small: 'Purpose-built GenAI, not off-the-shelf models.',
        medium: 'Custom GenAI Solutions are built around your specific enterprise problem — not a generic model dropped into an existing workflow.',
        large: 'WorldLink\'s custom GenAI solutions unlock enterprise-specific value: the control and risk monitoring model that saved $75M in labor costs is one example of GenAI purpose-built for a specific business problem.',
        overlay: '"Unlock the potential of your enterprise with our cutting-edge custom GenAI solutions." WorldLink builds GenAI purpose-fit to a specific enterprise problem rather than adapting a generic model — the $75M labor-cost-saving control and risk monitoring solution for an F100 financial institution is a direct example of what custom, trustworthy GenAI can unlock.',
      },
      tags: ['genai-solutions'],
      targetRoles: ['cto', 'cdo', 'cpo', 'innovation-lead', 'browsing'],
      targetInterests: ['genai-solutions'],
    },
    {
      id: 's7',
      title: 'WorldLink Labs — The AI Foundry',
      cardType: 'solution',
      icon: 'flask-conical',
      iconType: 'lucide',
      description: {
        small: 'A hands-on lab building and testing the latest AI technologies.',
        medium: 'WorldLink Labs is WorldLink\'s AI foundry — a hands-on lab where new AI technologies are built, tested, and deployed before they reach client engagements.',
        large: 'WorldLink Labs operates as an AI foundry: a dedicated lab environment where WorldLink builds, tests, and deploys solutions using the latest AI technologies ahead of production client work.',
        overlay: 'WorldLink Labs is the R&D layer behind WorldLink\'s client work — an AI foundry where new techniques, models, and architectures get built and stress-tested in a hands-on lab before they show up in a client\'s production environment. It\'s how WorldLink stays ahead of the GenAI curve rather than reacting to it.',
      },
      tags: ['genai-solutions', 'technology-innovation'],
      targetRoles: ['cto', 'innovation-lead', 'browsing'],
      targetInterests: ['genai-solutions', 'technology-innovation'],
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
