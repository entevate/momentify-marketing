// Explorer Config — BioLabs
// Global innovation infrastructure company: an international,
// membership-based network of premium shared lab + office facilities
// in key biotech innovation clusters. 19 locations across the US,
// Europe, and Asia (Boston/Tufts, NYU Langone, San Diego, Philly,
// Princeton, RTP, North Texas, Rochester MN, Toronto, Berlin Charite,
// Heidelberg, Munich, Paris Hotel-Dieu, Tokyo, Kawasaki, and more).
// 85+ Golden Tickets awarded since 2018. "Building Better Biotechs."
// Brand: slate #4D5868 + deep teal #0C6363. Site fonts are Avenir /
// Helvetica (licensed) with Lato loaded — Lato is in the curated set.
// Content sourced from biolabs.io (about, features & fees, golden
// tickets, locations) + @biolabsglobal YouTube (b.empowered podcast).

import type { ExplorerConfig, ThemeColors } from '../types';

const BIOLABS_DARK: ThemeColors = {
  // Slate-teal tinted near-black so dialogs and the Tools menu read
  // BioLabs rather than generic dark mode.
  bg: '#060B0D',
  bgGradient: 'linear-gradient(135deg, #0E1B1E 0%, #091114 55%, #060B0D 100%)',
  surface: 'rgba(255,255,255,0.06)',
  surfaceHover: 'rgba(255,255,255,0.10)',
  border: 'rgba(255,255,255,0.12)',
  borderFocus: '#1FB5B5',
  text1: '#FFFFFF',
  text2: 'rgba(255,255,255,0.78)',
  text3: 'rgba(255,255,255,0.52)',
  inputBg: 'rgba(255,255,255,0.08)',
  inputText: '#FFFFFF',
  inputPlaceholder: 'rgba(255,255,255,0.40)',
  logoText: '#FFFFFF',
  focusRing: 'rgba(12,99,99,0.30)',
};

const BIOLABS_LIGHT: ThemeColors = {
  // Clean lab-white with a cool cast; teal accent carries the brand.
  bg: '#F4F6F7',
  bgGradient: 'linear-gradient(180deg, #F6F8F9 0%, #F0F3F4 100%)',
  surface: 'rgba(255,255,255,0.88)',
  surfaceHover: 'rgba(255,255,255,0.97)',
  border: 'rgba(13,30,32,0.10)',
  borderFocus: '#0C6363',
  text1: '#0D1E20',
  text2: 'rgba(13,30,32,0.68)',
  text3: 'rgba(13,30,32,0.45)',
  inputBg: '#FFFFFF',
  inputText: '#0D1E20',
  inputPlaceholder: 'rgba(13,30,32,0.38)',
  focusRing: 'rgba(12,99,99,0.15)',
  logoText: '#0D1E20',
};

export const BIOLABS_CONFIG: ExplorerConfig = {
  id: 'biolabs',
  name: 'BioLabs Explorer',
  version: 1,
  createdAt: '2026-08-12T00:00:00.000Z',
  updatedAt: '2026-08-12T00:00:00.000Z',

  branding: {
    logo: {
      dark: '/brand/assets/biolabs-logo-reverse.png',  // white wordmark for dark bg
      light: '/brand/assets/biolabs-logo.png',         // dark wordmark for light bg
    },
    // Wordmark is 155x42 (~3.7:1). 34px matches the other wide-lockup
    // prototypes in the top bar.
    logoHeight: 34,
    icon: '/brand/assets/biolabs-icon.png',
    colors: {
      primary: '#4D5868',   // BioLabs slate, main accent
      secondary: '#0C6363', // BioLabs deep teal, second anchor
      teal: '#1FB5B5',      // brightened teal for hover/focus/selection on dark
      blue: '#4D5868',
      deepBlue: '#37404C',
      // midnight + navy drive dialog backgrounds + overlay backdrop —
      // teal-slate tones so dialogs stay on-brand.
      navy: '#0E1B1E',
      midnight: '#081113',
      plum: '#134A52',      // deep sea teal, gradient support
      bgDark: '#060B0D',
      dark: BIOLABS_DARK,
      light: BIOLABS_LIGHT,
    },
    // Site fonts are Avenir/Helvetica (licensed); Lato is the loaded
    // Google family and is in the curated loadable set.
    font: "'Lato', -apple-system, sans-serif",
    backgroundPattern: 'none',
    auroraOrbs: {
      orb1: 'rgba(12,99,99,0.20)',    // deep teal
      orb2: 'rgba(31,181,181,0.12)',  // bright teal
      orb3: 'rgba(77,88,104,0.16)',   // slate
    },
    // CTA = deep teal → slate (white text stays legible)
    ctaGradient: 'linear-gradient(135deg, #0C6363 0%, #37404C 100%)',
    ctaTextColor: '#FFFFFF',
    // Headline gradient: bright teal → deep teal pops on the dark splash
    gradientWord: 'linear-gradient(135deg, #3ED6D6 0%, #1FB5B5 55%, #0C8484 100%)',
    // Per-role glows: teal / slate mixes so each role feels like its
    // own chapter.
    roleBackgrounds: {
      'founder': 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(12,99,99,0.28) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 15% 15%, rgba(31,181,181,0.14) 0%, transparent 55%)',
      'scientist': 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(31,181,181,0.20) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 85% 15%, rgba(12,99,99,0.16) 0%, transparent 55%)',
      'investor': 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(77,88,104,0.26) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 25% 15%, rgba(31,181,181,0.12) 0%, transparent 55%)',
      'pharma-partner': 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(12,99,99,0.24) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 85% 25%, rgba(77,88,104,0.16) 0%, transparent 55%)',
      'university': 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(19,74,82,0.26) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 15% 25%, rgba(31,181,181,0.12) 0%, transparent 55%)',
      'service-provider': 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(77,88,104,0.22) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 75% 15%, rgba(12,99,99,0.14) 0%, transparent 55%)',
      'economic-dev': 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(19,74,82,0.24) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 85% 25%, rgba(31,181,181,0.10) 0%, transparent 55%)',
      'browsing': 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(12,99,99,0.16) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 15% 15%, rgba(31,181,181,0.08) 0%, transparent 55%)',
    },
  },

  registration: {
    modes: ['form', 'scan', 'search'],
    defaultMode: 'form',
    formTitle: 'Welcome to BioLabs',
    formSubtitle: 'Share a quick intro so we can tailor your tour and follow up.',
    scanLabel: 'Scan Your Badge',
    scanHint: 'Hold the QR code in front of the camera',
    searchPlaceholder: 'Search by last name...',
    optInText: 'By sharing your information you consent to BioLabs processing your data to fulfill your request and send relevant follow-up communications.',
    showLocaleButton: false,
    idleTimeoutMs: 10000,
    skipEnabled: true,
    fields: [
      { id: 'firstName', label: 'First Name', type: 'text', placeholder: 'First name', required: true, halfWidth: true },
      { id: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Last name', required: true, halfWidth: true },
      { id: 'email', label: 'Work Email', type: 'email', placeholder: 'name@company.com', required: true, halfWidth: true },
      { id: 'phone', label: 'Phone', type: 'tel', placeholder: '(555) 555-5555', required: false, halfWidth: true },
      { id: 'company', label: 'Company', type: 'text', placeholder: 'Company or institution', required: false, halfWidth: true },
      { id: 'title', label: 'Title', type: 'text', placeholder: 'Your role', required: false, halfWidth: true },
    ],
  },

  steps: [
    {
      type: 'splash',
      id: 'welcome',
      title: 'Empowering Innovation',
      gradientWord: 'Worldwide.',
      subtitle: 'BioLabs is the international, membership-based network of premium shared labs in the world\'s key biotech clusters. More than 20 sites in 5 countries, home to 440 resident companies. Turnkey facilities, deep capital connections, and science on day one. Tap to explore.',
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
      title: 'What brings you to BioLabs?',
      subtitle: 'Select the option that fits you best.',
      showGreeting: true,
      showSelectAll: false,
      options: [
        { value: 'founder', label: 'Founder / Startup CEO', icon: 'rocket', iconType: 'lucide' },
        { value: 'scientist', label: 'Scientist / Researcher', icon: 'flask-conical', iconType: 'lucide' },
        { value: 'investor', label: 'Investor / VC', icon: 'landmark', iconType: 'lucide' },
        { value: 'pharma-partner', label: 'Pharma / Corporate Partner', icon: 'building-2', iconType: 'lucide' },
        { value: 'university', label: 'University / Tech Transfer', icon: 'graduation-cap', iconType: 'lucide' },
        { value: 'service-provider', label: 'Vendor / Service Provider', icon: 'handshake', iconType: 'lucide' },
        { value: 'economic-dev', label: 'Economic Development', icon: 'globe', iconType: 'lucide' },
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
        { value: 'lab-space', label: 'Lab & Office Space', icon: 'flask-conical', iconType: 'lucide',
          relevantRoles: ['founder', 'scientist', 'university', 'browsing'] },
        { value: 'equipment', label: 'Equipment & Facilities', icon: 'flask-conical', iconType: 'lucide',
          relevantRoles: ['founder', 'scientist', 'browsing'] },
        { value: 'golden-tickets', label: 'Golden Tickets', icon: 'gift', iconType: 'lucide',
          relevantRoles: ['founder', 'pharma-partner', 'investor', 'browsing'] },
        { value: 'network', label: 'Global Network', icon: 'globe', iconType: 'lucide',
          relevantRoles: ['founder', 'scientist', 'investor', 'pharma-partner', 'university', 'service-provider', 'economic-dev', 'browsing'] },
        { value: 'programming', label: 'Community & Programming', icon: 'users', iconType: 'lucide',
          relevantRoles: ['founder', 'investor', 'pharma-partner', 'economic-dev', 'browsing'] },
        { value: 'sponsorship', label: 'Sponsorship & Partnership', icon: 'handshake', iconType: 'lucide',
          relevantRoles: ['pharma-partner', 'service-provider', 'university', 'economic-dev', 'browsing'] },
        { value: 'membership', label: 'Features & Fees', icon: 'list-checks', iconType: 'lucide',
          relevantRoles: ['founder', 'scientist', 'browsing'] },
        { value: 'browsing', label: 'Just Browsing', icon: 'compass', iconType: 'lucide',
          relevantRoles: ['founder', 'scientist', 'investor', 'pharma-partner', 'university', 'service-provider', 'economic-dev', 'browsing'] },
      ],
    },
    {
      type: 'results',
      id: 'results',
      title: 'Your Personalized Tour',
      subtitle: 'Spaces, programs, and stories matched to why you stopped by.',
      tabs: [
        { id: 'outcomes', label: 'Impact', icon: 'trending-up' },
        {
          id: 'learn',
          label: 'Discover',
          icon: 'book-open',
          filters: [
            { label: 'All', value: 'all' },
            { label: 'Video', value: 'video' },
            { label: 'Website', value: 'website' },
          ],
        },
        { id: 'solutions', label: 'Offerings', icon: 'layers' },
      ],
      cardsPerPage: 6,
      defaultView: 'small',
    },
    {
      type: 'summary',
      id: 'summary',
      title: 'Your Saved Items',
      subtitle: 'Review your picks and the BioLabs team will follow up.',
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
      subtitle: 'A member of the BioLabs team will be in touch shortly.',
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
    //   founder          : lab-space, equipment, golden-tickets, network,
    //                      programming, membership, browsing
    //   scientist        : lab-space, equipment, network, membership, browsing
    //   investor         : golden-tickets, network, programming, browsing
    //   pharma-partner   : golden-tickets, network, programming,
    //                      sponsorship, browsing
    //   university       : lab-space, network, sponsorship, browsing
    //   service-provider : network, sponsorship, browsing
    //   economic-dev     : network, programming, sponsorship, browsing
    //   browsing         : (catch-all — all interests)
    // ─────────────────────────────────────────────────────────────────

    // ── Outcomes / Impact (7) ─────────────────────────
    {
      id: 'o1',
      title: '85+ Golden Tickets Awarded',
      cardType: 'outcome',
      icon: 'gift',
      iconType: 'lucide',
      stat: '85+',
      url: 'https://www.biolabs.io/goldentickets',
      description: {
        small: 'BioLabs and its partners have awarded 85+ Golden Tickets since 2018.',
        medium: 'Since 2018, BioLabs and its strategic partners have awarded more than 85 Golden Tickets, sponsored bench time for standout startups.',
        large: 'The Golden Ticket program pairs sponsors with rising biotechs: partners host competitions and award winners sponsored lab residency. More than 85 tickets have been awarded across the network since 2018.',
        overlay: 'Golden Tickets are BioLabs\' signature launch mechanism: strategic partners and sponsors host competitions, curate the startups that align with their scientific interests, and award winners sponsored bench time in a BioLabs facility. Since 2018, more than 85 Golden Tickets have been awarded across the network, putting promising science into world-class labs and sponsors face-to-face with the pipeline they want to see first. In 2025 alone: 24 tickets awarded from 330 applicants, backed by a bench of 65+ sponsors and industry partners who hosted 675 sponsored events across the network.',
      },
      tags: ['golden-tickets'],
      targetRoles: ['founder', 'pharma-partner', 'investor', 'browsing'],
      targetInterests: ['golden-tickets', 'programming'],
    },
    {
      id: 'o2',
      title: '20+ Sites, 3 Continents',
      cardType: 'outcome',
      icon: 'globe',
      iconType: 'lucide',
      stat: '20+',
      url: 'https://www.biolabs.io/locations',
      description: {
        small: 'More than twenty BioLabs sites in five countries.',
        medium: 'The network spans 20+ sites in 5 countries across 3 continents, from Boston and San Diego to Berlin, Paris, and Tokyo.',
        large: 'BioLabs operates 20+ sites across three continents: Boston, Watertown, Burlington, New Haven, NYC, Princeton, Philadelphia, RTP, North Texas, Rochester MN, LA, San Diego, Toronto, Berlin, Heidelberg, Munich, Paris, Tokyo, and Kawasaki.',
        overlay: 'One membership, twenty-plus doors: Greater Boston (Tufts Launchpad, Watertown, Burlington), New Haven, New York (NYU Langone), Princeton, Philadelphia, Research Triangle, North Texas, Rochester MN, Los Angeles, San Diego, Toronto, Berlin (Charite), Heidelberg, Munich, Paris (Hotel-Dieu), Tokyo, and Kawasaki. Every site sits inside a key innovation cluster, so residents plug into local capital, talent, and pharma wherever their science needs to go next.',
      },
      tags: ['network'],
      targetRoles: ['founder', 'scientist', 'investor', 'pharma-partner', 'university', 'economic-dev', 'browsing'],
      targetInterests: ['network', 'browsing'],
    },
    {
      id: 'o3',
      title: 'Science on Day One',
      cardType: 'outcome',
      icon: 'zap',
      iconType: 'lucide',
      stat: 'Day 1',
      url: 'https://www.biolabs.io/featuresandfees',
      description: {
        small: 'Turnkey labs mean experiments start the day you move in.',
        medium: 'Fully equipped, fully licensed labs let residents start science on day one instead of spending months on buildout.',
        large: 'The buildout problem disappears: BioLabs facilities come fully licensed and fully equipped, so a new resident runs experiments the day they move in, cutting capital costs and months of dead time.',
        overlay: 'A traditional lab buildout costs seven figures and takes the better part of a year before the first experiment runs. BioLabs removes that entirely: fully licensed facilities, premium equipment already installed and maintained, EH&S handled, and operations staff on site. Residents start science on day one and pour the capital they saved into the research itself. That time-and-capital arbitrage is the core of the model.',
      },
      tags: ['lab-space', 'equipment'],
      targetRoles: ['founder', 'scientist', 'university', 'browsing'],
      targetInterests: ['lab-space', 'equipment', 'membership'],
    },
    {
      id: 'o4',
      title: '14,000 Sq Ft Boston Flagship',
      cardType: 'outcome',
      icon: 'building-2',
      iconType: 'lucide',
      stat: '14K',
      url: 'https://www.biolabs.io/tufts-boston',
      description: {
        small: 'Tufts Launchpad | BioLabs: 14,000 sq ft of licensed co-working lab.',
        medium: 'The Boston flagship, Tufts Launchpad | BioLabs, offers 14,000 square feet of fully licensed co-working lab space.',
        large: 'Tufts Launchpad | BioLabs is 14,000 square feet of state-of-the-art, fully licensed co-working lab in Boston, with resident access to Tufts University core facilities including mass spectrometry and animal testing services.',
        overlay: 'The Boston flagship shows the model at full strength: Tufts Launchpad | BioLabs is a 14,000-square-foot, fully licensed co-working lab built for early-stage scientific ventures. Through the strategic alliance with Tufts University, residents reach core facilities most startups could never access alone, mass spectrometry, animal testing services, and more, with experienced staff running daily operations so founders stay focused on their science.',
      },
      tags: ['lab-space', 'network'],
      targetRoles: ['founder', 'scientist', 'university', 'browsing'],
      targetInterests: ['lab-space', 'network'],
    },
    {
      id: 'o5',
      title: 'Anchored by World-Class Institutions',
      cardType: 'outcome',
      icon: 'award',
      iconType: 'lucide',
      stat: '6+',
      url: 'https://www.biolabs.io/locations',
      description: {
        small: 'Sites anchored by Tufts, NYU Langone, Charite, Mayo, and more.',
        medium: 'BioLabs sites are anchored by institutional alliances: Tufts, NYU Langone, Charite Berlin, Mayo Clinic\'s Rochester, and Paris\'s Hotel-Dieu.',
        large: 'The network is built on institutional partnerships, Tufts University in Boston, NYU Langone in New York, Charite in Berlin, the Mayo Clinic ecosystem in Rochester MN, and Hotel-Dieu in Paris, putting residents inside the world\'s best medical research environments.',
        overlay: 'BioLabs doesn\'t just rent space near great institutions, it partners with them. Tufts Launchpad in Boston, NYU Langone in Manhattan, Charite in Berlin, Rochester MN in the Mayo Clinic ecosystem, Hotel-Dieu with AP-HP in Paris, and Heidelberg in Germany\'s oldest university city. Residents work inside these ecosystems: core facilities, clinical partners, and academic talent are down the hall, not across town.',
      },
      tags: ['network'],
      targetRoles: ['founder', 'university', 'investor', 'pharma-partner', 'economic-dev', 'browsing'],
      targetInterests: ['network', 'browsing'],
    },
    {
      id: 'o6',
      title: 'Three Paths, One Membership',
      cardType: 'outcome',
      icon: 'route',
      iconType: 'lucide',
      stat: '3',
      url: 'https://www.biolabs.io/featuresandfees',
      description: {
        small: 'Bench, private lab, or graduate suite: grow without moving out.',
        medium: 'Members scale from a coworking bench to a private lab to a graduate suite without ever leaving the building.',
        large: 'The membership grows with the company: start at a coworking lab bench, move to a private lab as the team expands, then into a graduate suite, same building, same community, no relocation tax.',
        overlay: 'Most startups outgrow their first lab and lose months to the move. BioLabs is built to absorb that growth: begin at a fully equipped coworking bench, expand into a private lab when the team scales, then step up to a graduate suite, all inside the same facility, keeping your equipment access, your community, and your momentum. Office-side, the same ladder runs from open desks to private offices.',
      },
      tags: ['membership', 'lab-space'],
      targetRoles: ['founder', 'scientist', 'browsing'],
      targetInterests: ['membership', 'lab-space'],
    },
    {
      id: 'o7',
      title: 'The 2025 Impact Report',
      cardType: 'outcome',
      icon: 'trending-up',
      iconType: 'lucide',
      stat: '2025',
      // Assembled from the report page's full-res infographic images and
      // self-hosted so the overlay renders the report inline as a PDF.
      mediaType: 'pdf',
      url: 'https://www.momentifyapp.com/brand/assets/biolabs-2025-impact-report.pdf',
      description: {
        small: '440 resident companies, 70 clinical trials, 1,206 jobs enabled.',
        medium: 'The 2025 scoreboard: 440 resident companies, 70 clinical trials, 26,000+ trial participants, and 1,206 jobs enabled.',
        large: 'The 2025 Impact Report by the numbers: 440 resident companies across 20+ sites in 5 countries, 85% in human health research, 70 clinical trials with 26,000+ participants, and 1,206 resident jobs enabled.',
        overlay: 'The 2025 Impact Report is the network\'s scoreboard, readable right here on the kiosk: 440 resident companies across 20+ sites in 5 countries on 3 continents, 85% focused on human health. Therapeutics leads at 51% of research areas, with residents running 70 clinical trials reaching 26,000+ participants and enabling 1,206 jobs in 2025 alone. Save the card and the full report lands in your follow-up email.',
      },
      tags: ['network', 'browsing'],
      targetRoles: ['investor', 'pharma-partner', 'economic-dev', 'university', 'browsing'],
      targetInterests: ['network', 'programming', 'browsing'],
    },

    // ── Learn / Discover (9) — podcast episodes, aftermovie, site hubs ─
    // Videos are @biolabsglobal YouTube (render as scan-to-watch QR
    // cards in the overlay).
    {
      id: 'l1',
      title: 'b.empowered: How to Dish',
      cardType: 'learn',
      mediaType: 'video',
      icon: 'mic',
      iconType: 'lucide',
      url: 'https://www.youtube.com/watch?v=kauTPUR69ic',
      description: {
        small: 'BioLabs founder Johannes Fruehauf on the b.empowered podcast.',
        medium: 'BioLabs founder Johannes Fruehauf joins the b.empowered podcast, the philosophy behind the network, firsthand.',
        large: 'Start with the founder: Johannes Fruehauf on the b.empowered podcast, on how shared lab infrastructure changes the economics of starting a biotech, the thinking behind the whole network.',
        overlay: 'The b.empowered podcast is BioLabs\' interview series with the people building and backing biotech. This episode features BioLabs founder Johannes Fruehauf on the thinking behind the network: why lab infrastructure was the bottleneck holding back early-stage biotech, and how the shared model rewrites a startup\'s first two years. The best 30-minute introduction to what BioLabs is. Save the card and the episode arrives in your follow-up email.',
      },
      tags: ['programming', 'browsing'],
      targetRoles: ['founder', 'scientist', 'investor', 'pharma-partner', 'university', 'economic-dev', 'browsing'],
      targetInterests: ['programming', 'browsing'],
    },
    {
      id: 'l2',
      title: 'b.empowered with Mayo Clinic',
      cardType: 'learn',
      mediaType: 'video',
      icon: 'mic',
      iconType: 'lucide',
      url: 'https://www.youtube.com/watch?v=_ujmguVWw8k',
      description: {
        small: 'Mayo Clinic\'s Geof Hannigan on the 2026 podcast season.',
        medium: 'Geof Hannigan of Mayo Clinic opens the b.empowered 2026 season, recorded at the BIO convention.',
        large: 'The 2026 season opener: Mayo Clinic\'s Geof Hannigan on clinical innovation and the Rochester MN ecosystem, where BioLabs operates inside the Mayo orbit.',
        overlay: 'Episode one of the b.empowered 2026 season, recorded at BIO: Geof Hannigan of Mayo Clinic on where clinical innovation is heading, and the Rochester, Minnesota ecosystem, home to a BioLabs site inside the Mayo Clinic orbit. The season\'s guest list runs from AbbVie and Daiichi Sankyo to resident founders, a window into the caliber of the network\'s connections. Save the card and the episode arrives in your follow-up email.',
      },
      tags: ['programming', 'network'],
      targetRoles: ['founder', 'investor', 'pharma-partner', 'university', 'browsing'],
      targetInterests: ['programming', 'network'],
    },
    {
      id: 'l3',
      title: 'b.empowered with AbbVie',
      cardType: 'learn',
      mediaType: 'video',
      icon: 'mic',
      iconType: 'lucide',
      url: 'https://www.youtube.com/watch?v=dOb5doG6yH4',
      description: {
        small: 'AbbVie\'s Natacha Raphael on partnering with early biotech.',
        medium: 'Natacha Raphael of AbbVie on the b.empowered podcast, how big pharma engages the startup ecosystem.',
        large: 'How pharma sees the pipeline: AbbVie\'s Natacha Raphael on the b.empowered podcast, on what big pharma looks for in early-stage biotech and how ecosystems like BioLabs shorten the distance.',
        overlay: 'For founders wondering how the pharma partnership actually starts, and for corporates weighing ecosystem engagement: AbbVie\'s Natacha Raphael on the b.empowered 2026 season, on what big pharma looks for in early-stage science and how innovation networks compress the path from first meeting to deal. Recorded at BIO, where BioLabs convenes exactly these conversations. Save the card and the episode arrives in your follow-up email.',
      },
      tags: ['programming', 'sponsorship'],
      targetRoles: ['founder', 'pharma-partner', 'investor', 'browsing'],
      targetInterests: ['programming', 'sponsorship', 'golden-tickets'],
    },
    {
      id: 'l4',
      title: 'BioLabs at BIO: Aftermovie',
      cardType: 'learn',
      mediaType: 'video',
      icon: 'play-circle',
      iconType: 'lucide',
      // Self-hosted mp4 (BioLabs' own aftermovie) so the overlay plays
      // it inline instead of falling back to a QR card.
      url: 'https://www.momentifyapp.com/brand/assets/biolabs-bio-aftermovie.mp4',
      description: {
        small: 'The BioLabs presence at the BIO convention, in two minutes.',
        medium: 'The aftermovie from BioLabs at BIO, the booth, the community, and the energy of the network in one cut.',
        large: 'What the BioLabs community looks like assembled in one place: the BIO convention aftermovie captures the booth, the b.empowered recordings, and the global network meeting in person.',
        overlay: 'Once a year the whole network converges at the BIO International Convention, and the aftermovie captures it: the BioLabs booth as a meeting point for residents, sponsors, investors, and site teams from three continents, with the b.empowered podcast recording live in the middle of it. Two minutes of what "innovation community" actually looks like. It plays right here on the kiosk, and BioLabs will be at the next BIO.',
      },
      tags: ['programming', 'browsing'],
      targetRoles: ['founder', 'pharma-partner', 'investor', 'service-provider', 'economic-dev', 'browsing'],
      targetInterests: ['programming', 'browsing'],
    },
    {
      id: 'l5',
      title: 'Explore Every Location',
      cardType: 'learn',
      mediaType: 'website',
      icon: 'map-pin',
      iconType: 'lucide',
      url: 'https://www.biolabs.io/locations',
      description: {
        small: 'The full 20+ site directory, from Boston to Tokyo.',
        medium: 'Browse every BioLabs site, teams, spaces, and local ecosystems across the US, Europe, and Asia.',
        large: 'The locations directory covers the full network: photos, local team rosters, space specifics, and the innovation ecosystem each site plugs into, from Kendall Square to Charite to Kawasaki.',
        overlay: 'Every BioLabs site has its own page in the directory: the space itself, the local team who runs it, the equipment on site, and the innovation ecosystem around it, Greater Boston, New Haven, New York, Princeton, Philadelphia, Research Triangle, North Texas, Rochester MN, LA, San Diego, Toronto, Berlin, Heidelberg, Munich, Paris, Tokyo, and Kawasaki. Wherever your science needs to be, start here. Save the card and the link comes to your inbox.',
      },
      tags: ['network'],
      targetRoles: ['founder', 'scientist', 'investor', 'pharma-partner', 'university', 'service-provider', 'economic-dev', 'browsing'],
      targetInterests: ['network', 'lab-space', 'browsing'],
    },
    {
      id: 'l6',
      title: 'Features & Fees',
      cardType: 'learn',
      mediaType: 'website',
      icon: 'list-checks',
      iconType: 'lucide',
      url: 'https://www.biolabs.io/featuresandfees',
      description: {
        small: 'What membership includes and how pricing works.',
        medium: 'The full membership breakdown: bench, private lab, offices, graduate suites, and the equipment included.',
        large: 'The transparent look at how membership works: monthly membership plus a lab bench or private lab, open desks or private offices, graduate suites, and the premium equipment floor included at every site.',
        overlay: 'BioLabs publishes how the membership works: a monthly membership covers conference rooms, event space, and amenities, then add a coworking lab bench or private lab, an open desk or private office, or a graduate suite as you scale. Every site includes the premium equipment floor, cold storage from minus-80 freezers to 4C fridges, Eppendorf and PHCbi incubators, an Agilent 1260 HPLC, autoclave and glassware sterilization. Pricing varies by site; the structure doesn\'t.',
      },
      tags: ['membership', 'equipment'],
      targetRoles: ['founder', 'scientist', 'browsing'],
      targetInterests: ['membership', 'equipment', 'lab-space'],
    },
    {
      id: 'l7',
      title: 'The Golden Ticket Program',
      cardType: 'learn',
      mediaType: 'website',
      icon: 'gift',
      iconType: 'lucide',
      url: 'https://www.biolabs.io/goldentickets',
      description: {
        small: 'How Golden Ticket competitions work, for startups and sponsors.',
        medium: 'The Golden Ticket hub: open competitions for startups, and how sponsors curate their innovation pipeline.',
        large: 'Golden Tickets explained from both sides: startups compete for sponsored residency in a BioLabs facility; sponsors host the competitions and get first look at the science that matches their strategy.',
        overlay: 'The Golden Ticket page runs both directions. Startups: browse the competitions currently accepting applications and win sponsored bench time in a BioLabs facility. Sponsors: host a competition, define the scientific scope that matches your strategic interests, and curate a roster of companies you want in your orbit. More than 85 tickets awarded since 2018 make this one of biotech\'s most productive matchmaking mechanisms. Applications are open now.',
      },
      tags: ['golden-tickets'],
      targetRoles: ['founder', 'pharma-partner', 'investor', 'browsing'],
      targetInterests: ['golden-tickets', 'sponsorship'],
    },
    {
      id: 'l8',
      title: 'News & Events',
      cardType: 'learn',
      mediaType: 'website',
      icon: 'file-text',
      iconType: 'lucide',
      url: 'https://www.biolabs.io/news-and-events',
      description: {
        small: 'What\'s happening across the BioLabs network.',
        medium: 'Network news, site openings, resident milestones, and upcoming events across three continents.',
        large: 'The running feed of the network: new site announcements, resident company milestones, Golden Ticket winners, Investor Days, and events across the US, Europe, and Asia.',
        overlay: 'The news and events hub is the pulse of the network: site expansions and openings, resident companies hitting milestones and raising rounds, Golden Ticket competition winners, Investor Days, and the event calendar across the whole network. A good five-minute read on the network\'s momentum before you decide where you fit in it.',
      },
      tags: ['programming', 'network'],
      targetRoles: ['founder', 'investor', 'pharma-partner', 'economic-dev', 'browsing'],
      targetInterests: ['programming', 'network', 'browsing'],
    },
    {
      id: 'l9',
      title: 'The BioLabs Marketplace',
      cardType: 'learn',
      mediaType: 'website',
      icon: 'shopping-cart',
      iconType: 'lucide',
      url: 'https://www.biolabs.io/marketplace',
      description: {
        small: 'Preferred vendors and member pricing for residents.',
        medium: 'The Marketplace connects residents with preferred vendors, member pricing, and centralized procurement.',
        large: 'Resident buying power, aggregated: the Marketplace gives member companies preferred-vendor relationships, negotiated pricing, and centralized procurement support across the network.',
        overlay: 'A startup buying reagents alone pays list price; a network of resident companies doesn\'t. The BioLabs Marketplace aggregates the network\'s buying power into preferred-vendor relationships and member pricing, backed by centralized procurement support from the BioLabs global team. The 2025 numbers: 535 companies buying through the platform from 1,400 vendors, with 60,000+ purchase orders supported. Built by scientists for scientists; for vendors, it\'s the front door to the whole resident base in one motion.',
      },
      tags: ['membership', 'sponsorship'],
      targetRoles: ['founder', 'scientist', 'service-provider', 'browsing'],
      targetInterests: ['membership', 'sponsorship'],
    },

    // ── Solutions / Offerings (8) ─────────────────────────
    {
      id: 's1',
      title: 'Coworking Lab Bench',
      cardType: 'solution',
      icon: 'flask-conical',
      iconType: 'lucide',
      url: 'https://www.biolabs.io/featuresandfees',
      description: {
        small: 'A fully equipped bench in a licensed shared lab.',
        medium: 'The entry point: a bench in a fully equipped, fully licensed coworking lab, with everything shared and maintained.',
        large: 'The classic BioLabs start: a lab bench inside a fully licensed, fully equipped shared facility, premium instruments, EH&S, and operations handled, so a company of two runs like a company of fifty.',
        overlay: 'The coworking lab bench is where most resident companies begin: a bench in a fully licensed shared laboratory where the equipment floor, environmental health and safety, waste handling, and daily operations are all provided. A two-person startup gets the working infrastructure of an established company from its first day, at a monthly membership instead of a seven-figure buildout.',
      },
      tags: ['lab-space', 'membership'],
      targetRoles: ['founder', 'scientist', 'browsing'],
      targetInterests: ['lab-space', 'membership', 'equipment'],
    },
    {
      id: 's2',
      title: 'Private Labs & Graduate Suites',
      cardType: 'solution',
      icon: 'building-2',
      iconType: 'lucide',
      url: 'https://www.biolabs.io/featuresandfees',
      description: {
        small: 'Dedicated lab space that scales with your team.',
        medium: 'Private labs for growing teams and graduate suites for companies ready for their own footprint, without leaving the network.',
        large: 'When the bench gets crowded: private labs give growing teams dedicated space, and graduate suites give maturing companies their own footprint, both inside the facility, keeping equipment access and community intact.',
        overlay: 'Growth inside the network instead of out of it: private labs give expanding teams dedicated, secure space with full access to the shared equipment floor and amenities, while graduate suites serve companies ready for a real footprint of their own but not ready to leave the ecosystem. Sizes and pricing vary by site; the principle is constant, scale up without a relocation, a re-permit, or a lost quarter.',
      },
      tags: ['lab-space', 'membership'],
      targetRoles: ['founder', 'scientist', 'browsing'],
      targetInterests: ['lab-space', 'membership'],
    },
    {
      id: 's3',
      title: 'Premium Equipment Floor',
      cardType: 'solution',
      icon: 'flask-conical',
      iconType: 'lucide',
      url: 'https://www.biolabs.io/featuresandfees',
      description: {
        small: 'HPLC, incubators, cold storage, and sterilization on site.',
        medium: 'State-of-the-art shared instruments: Agilent HPLC, Eppendorf and PHCbi incubators, full cold storage, autoclave.',
        large: 'The equipment startups can\'t justify buying: an Agilent 1260 HPLC, temperature and CO2-controlled incubators from Eppendorf and PHCbi, minus-80 to 4C cold storage, and on-site autoclave and glassware sterilization.',
        overlay: 'Every BioLabs site carries a premium equipment floor so residents skip the capital line entirely: an Agilent 1260 HPLC with vial sampler and quaternary pump, shaking and static incubators from Eppendorf and PHCbi with temperature and CO2 control, cold storage from minus-80 and minus-20 freezers to 4C fridges, and autoclave plus glassware washer for sterilization. Maintained, calibrated, and included, start science on day one and put the capital into the research. Local offerings vary by site.',
      },
      tags: ['equipment'],
      targetRoles: ['founder', 'scientist', 'browsing'],
      targetInterests: ['equipment', 'lab-space', 'membership'],
    },
    {
      id: 's4',
      title: 'Golden Ticket Competitions',
      cardType: 'solution',
      icon: 'gift',
      iconType: 'lucide',
      url: 'https://www.biolabs.io/goldentickets',
      description: {
        small: 'Win sponsored residency, or sponsor the next winner.',
        medium: 'Startups win sponsored bench time; sponsors curate a pipeline of companies aligned with their science.',
        large: 'The network\'s matchmaking engine: sponsors host Golden Ticket competitions scoped to their strategic interests, and winning startups receive sponsored residency in a BioLabs facility. Applications are open.',
        overlay: 'Golden Tickets serve both sides of the innovation market. For startups: compete for a sponsored residency, bench time, equipment, and community, underwritten by a sponsor who wants your science to succeed. For sponsors: host a competition scoped to your scientific and strategic interests and curate the roster of companies you want in your pipeline. With 85+ awarded since 2018, it\'s a proven first handshake between rising biotechs and the partners who back them. Competitions are accepting applications now.',
      },
      tags: ['golden-tickets', 'sponsorship'],
      targetRoles: ['founder', 'pharma-partner', 'investor', 'browsing'],
      targetInterests: ['golden-tickets', 'sponsorship', 'programming'],
    },
    {
      id: 's5',
      title: 'Sponsorship & Partnerships',
      cardType: 'solution',
      icon: 'handshake',
      iconType: 'lucide',
      url: 'https://www.biolabs.io/sponsors',
      description: {
        small: 'Put your brand inside the world\'s biotech startup pipeline.',
        medium: 'Sponsors embed in the network, visibility, programming, and first-look access to hundreds of resident biotechs.',
        large: 'For pharma, vendors, and institutions: sponsorship embeds your organization in the network\'s daily life, site presence, programming, Golden Ticket hosting, and relationships with residents from day zero.',
        overlay: 'BioLabs sponsors don\'t buy a logo on a wall, they buy proximity to the pipeline. Sponsorship embeds your organization across the network: presence in the sites where hundreds of resident biotechs work daily, programming and event slots, Golden Ticket competition hosting, and Marketplace positioning. For pharma it\'s first-look access to emerging science; for vendors it\'s the most concentrated customer base in biotech; for institutions it\'s a channel into the startup economy.',
      },
      tags: ['sponsorship'],
      targetRoles: ['pharma-partner', 'service-provider', 'university', 'economic-dev', 'browsing'],
      targetInterests: ['sponsorship', 'golden-tickets', 'network'],
    },
    {
      id: 's6',
      title: 'Investor Days & Programming',
      cardType: 'solution',
      icon: 'users',
      iconType: 'lucide',
      url: 'https://www.biolabs.io/news-and-events',
      description: {
        small: 'Curated capital connections and entrepreneurial programming.',
        medium: 'Investor Days put residents in front of capital; year-round programming builds the skills and connections between.',
        large: 'The community layer: Investor Days connect resident companies with active life-science capital, and year-round entrepreneurial programming, workshops, talks, the b.empowered series, compounds the network effect.',
        overlay: 'Space is the product; the community is the moat. BioLabs Investor Days put resident companies directly in front of active life-science investors across the network. Between them runs year-round entrepreneurial programming: workshops, expert talks, site events, and the b.empowered podcast series bringing leaders from Mayo Clinic, AbbVie, and Daiichi Sankyo into the conversation. Residents don\'t just get a bench, they get the room.',
      },
      tags: ['programming'],
      targetRoles: ['founder', 'investor', 'pharma-partner', 'browsing'],
      targetInterests: ['programming', 'network', 'golden-tickets'],
    },
    {
      id: 's7',
      title: 'One Network, Global Reach',
      cardType: 'solution',
      icon: 'globe',
      iconType: 'lucide',
      url: 'https://www.biolabs.io/locations',
      description: {
        small: 'Land in any cluster the science needs: 20+ sites, 3 continents.',
        medium: 'Membership travels: expand from Boston to Berlin to Tokyo inside one network instead of starting cold in each market.',
        large: 'For companies going multi-market: the network gives residents a soft landing at 20+ sites across the US, Europe, and Asia, local teams, local ecosystems, and familiar infrastructure on arrival.',
        overlay: 'When the science demands a second market, a European trial, a Japanese partnership, a US expansion, BioLabs residents don\'t start cold. The network\'s 20+ sites across three continents share one operating model, so landing in Berlin, Tokyo, or San Diego means a known infrastructure, a local site team, and an established ecosystem from day one. For economic development organizations, it\'s also the mechanism that brings global biotechs into your cluster.',
      },
      tags: ['network'],
      targetRoles: ['founder', 'pharma-partner', 'university', 'economic-dev', 'browsing'],
      targetInterests: ['network', 'lab-space'],
    },
    {
      id: 's8',
      title: 'Apply for Residency',
      cardType: 'solution',
      icon: 'rocket',
      iconType: 'lucide',
      url: 'https://www.biolabs.io/',
      description: {
        small: 'Start the application and pick your site.',
        medium: 'Applications are online: choose your site, size your space, and the local team takes it from there.',
        large: 'The path in is short: apply online, pick the site that fits your science and your market, and the local team works out bench count, equipment needs, and timing with you directly.',
        overlay: 'Residency starts with a short online application: tell BioLabs about your science, choose the site that fits your team and your market, and the local site team follows up on space, equipment needs, and move-in timing. Companies routinely go from application to running experiments in weeks, not quarters. Save this card and the application link arrives in your follow-up email, or talk to the team at the booth right now.',
      },
      tags: ['membership', 'lab-space'],
      targetRoles: ['founder', 'scientist', 'browsing'],
      targetInterests: ['membership', 'lab-space', 'browsing'],
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
