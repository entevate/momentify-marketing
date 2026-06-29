// Explorer Config — Success North Dallas (SND)
// Professional networking and development organization operating in
// DFW since 1988. Members include C-suite executives, founders,
// young executives, and ambitious professionals. Servant-leadership
// philosophy: Relationships. Resources. Results.
// Brand: warm orange (#CE8224) + black.

import type { ExplorerConfig, ThemeColors } from '../types';

const SND_DARK: ThemeColors = {
  // Brand-tinted dark UI tones — warm near-black derived from the
  // SND orange hue so dialog backgrounds and the Tools menu read
  // distinctly SND rather than generic dark mode.
  bg: '#100806',
  bgGradient: 'linear-gradient(135deg, #1A0E07 0%, #100806 55%, #000000 100%)',
  surface: 'rgba(255,255,255,0.06)',
  surfaceHover: 'rgba(255,255,255,0.10)',
  border: 'rgba(255,255,255,0.12)',
  borderFocus: '#E89A47',
  text1: '#FFFFFF',
  text2: 'rgba(255,255,255,0.78)',
  text3: 'rgba(255,255,255,0.52)',
  inputBg: 'rgba(255,255,255,0.08)',
  inputText: '#FFFFFF',
  inputPlaceholder: 'rgba(255,255,255,0.40)',
  logoText: '#FFFFFF',
  focusRing: 'rgba(206,130,36,0.28)',
};

const SND_LIGHT: ThemeColors = {
  // Light theme — warm off-white that pairs with the SND orange
  // without competing.
  bg: '#FBF6EF',
  bgGradient: 'linear-gradient(180deg, #FBF6EF 0%, #F4EDE1 100%)',
  surface: 'rgba(255,255,255,0.90)',
  surfaceHover: 'rgba(255,255,255,0.98)',
  border: 'rgba(31,18,8,0.12)',
  borderFocus: '#A6661A',
  text1: '#1F1208',
  text2: 'rgba(31,18,8,0.70)',
  text3: 'rgba(31,18,8,0.45)',
  inputBg: '#FFFFFF',
  inputText: '#1F1208',
  inputPlaceholder: 'rgba(31,18,8,0.40)',
  logoText: '#1F1208',
  focusRing: 'rgba(206,130,36,0.18)',
};

export const SND_CONFIG: ExplorerConfig = {
  id: 'snd',
  name: 'Success North Dallas Explorer',
  version: 1,
  createdAt: '2026-06-29T00:00:00.000Z',
  updatedAt: '2026-06-29T00:00:00.000Z',

  branding: {
    logo: {
      dark: '/brand/assets/snd-logo-reverse.png',  // white wordmark for dark bg
      light: '/brand/assets/snd-logo.png',         // dark wordmark for light bg
    },
    // SND wordmark — 300x100 (3:1 aspect). 44px lets the
    // full "SUCCESS NORTH DALLAS" wordmark read at kiosk distance.
    logoHeight: 44,
    icon: '/brand/assets/snd-icon.png',
    colors: {
      primary: '#CE8224',   // SND warm orange — main accent
      secondary: '#000000', // SND black — second anchor
      teal: '#E89A47',      // brighter ember orange for hover/focus on dark
      blue: '#CE8224',
      deepBlue: '#A6661A',
      // midnight + navy drive dialog backgrounds + overlay backdrop.
      // Both pulled from the warm-orange hue so dialogs stay on-brand.
      navy: '#1F1208',
      midnight: '#0C0603',
      plum: '#3D2410',      // deep brown — complements the orange
      bgDark: '#100806',
      dark: SND_DARK,
      light: SND_LIGHT,
    },
    font: "'Inter', -apple-system, sans-serif",
    backgroundPattern: 'none',
    auroraOrbs: {
      orb1: 'rgba(206,130,36,0.22)',   // SND orange
      orb2: 'rgba(232,154,71,0.18)',   // ember orange
      orb3: 'rgba(166,102,26,0.14)',   // deep amber
    },
    // CTA = SND orange → deep amber (within-brand gradient)
    ctaGradient: 'linear-gradient(135deg, #CE8224 0%, #A6661A 100%)',
    ctaTextColor: '#FFFFFF',
    // Headline gradient: SND orange → bright ember pops on the dark splash
    gradientWord: 'linear-gradient(135deg, #E89A47 0%, #CE8224 100%)',
    // Per-role glows: each role gets a slightly different amber /
    // brown / orange mix so navigating roles feels like chapters.
    roleBackgrounds: {
      'executive': 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(206,130,36,0.30) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 15% 15%, rgba(232,154,71,0.16) 0%, transparent 55%)',
      'entrepreneur': 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(232,154,71,0.24) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 85% 15%, rgba(206,130,36,0.18) 0%, transparent 55%)',
      'young-executive': 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(206,130,36,0.26) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 25% 15%, rgba(232,154,71,0.20) 0%, transparent 55%)',
      'sales-bizdev': 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(166,102,26,0.28) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 85% 25%, rgba(206,130,36,0.16) 0%, transparent 55%)',
      'service-pro': 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(206,130,36,0.22) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 15% 25%, rgba(166,102,26,0.16) 0%, transparent 55%)',
      'investor': 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(232,154,71,0.22) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 75% 15%, rgba(166,102,26,0.18) 0%, transparent 55%)',
      'nonprofit': 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(206,130,36,0.20) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 85% 25%, rgba(232,154,71,0.14) 0%, transparent 55%)',
      'browsing': 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(206,130,36,0.16) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 15% 15%, rgba(232,154,71,0.10) 0%, transparent 55%)',
    },
  },

  registration: {
    modes: ['form', 'scan', 'search'],
    defaultMode: 'form',
    formTitle: 'Welcome to Success North Dallas',
    formSubtitle: 'A quick intro lets us tailor your visit and follow up with the right connections.',
    scanLabel: 'Scan Your Badge',
    scanHint: 'Hold the QR code in front of the camera',
    searchPlaceholder: 'Search by last name...',
    optInText: 'By sharing your information you consent to Success North Dallas processing your data to follow up with you about membership, events, and relevant introductions.',
    showLocaleButton: false,
    idleTimeoutMs: 10000,
    skipEnabled: true,
    fields: [
      { id: 'firstName', label: 'First Name', type: 'text', placeholder: 'First name', required: true, halfWidth: true },
      { id: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Last name', required: true, halfWidth: true },
      { id: 'email', label: 'Work Email', type: 'email', placeholder: 'name@company.com', required: true, halfWidth: true },
      { id: 'phone', label: 'Phone', type: 'tel', placeholder: '(555) 555-5555', required: false, halfWidth: true },
      { id: 'company', label: 'Company', type: 'text', placeholder: 'Your company', required: false, halfWidth: true },
      { id: 'title', label: 'Title', type: 'text', placeholder: 'Your role', required: false, halfWidth: true },
    ],
  },

  steps: [
    {
      type: 'splash',
      id: 'welcome',
      title: 'The Right People.',
      gradientWord: 'Right Reasons. Right Time.',
      subtitle: 'Connecting DFW\'s most influential leaders since 1988. Servant leadership. Genuine connections. Mutual growth. Tap to discover what Success North Dallas can mean for you.',
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
      title: 'Which best describes you?',
      subtitle: 'Pick the option closest to where you are today.',
      showGreeting: true,
      showSelectAll: false,
      options: [
        { value: 'executive', label: 'Executive / CEO', icon: 'briefcase', iconType: 'lucide' },
        { value: 'entrepreneur', label: 'Founder / Entrepreneur', icon: 'rocket', iconType: 'lucide' },
        { value: 'young-executive', label: 'Young Executive (Under 39)', icon: 'sparkles', iconType: 'lucide' },
        { value: 'sales-bizdev', label: 'Sales / Biz Dev', icon: 'trending-up', iconType: 'lucide' },
        { value: 'service-pro', label: 'CPA / Attorney / Consultant', icon: 'scale', iconType: 'lucide' },
        { value: 'investor', label: 'Investor / Advisor', icon: 'landmark', iconType: 'lucide' },
        { value: 'nonprofit', label: 'Nonprofit / Community Leader', icon: 'heart', iconType: 'lucide' },
        { value: 'browsing', label: 'Just Visiting', icon: 'compass', iconType: 'lucide' },
      ],
    },
    {
      type: 'trait-selection',
      id: 'interests',
      selectionMode: 'multi',
      title: 'What brought you here?',
      subtitle: 'Select all that apply.',
      showGreeting: false,
      showSelectAll: true,
      // Conditional mapping — role → relevant interests.
      options: [
        { value: 'monthly-meetings', label: 'Monthly Meetings & Speakers', icon: 'mic', iconType: 'lucide',
          relevantRoles: ['executive', 'entrepreneur', 'young-executive', 'sales-bizdev', 'service-pro', 'investor', 'nonprofit', 'browsing'] },
        { value: 'young-execs', label: 'Young Executives Group', icon: 'sparkles', iconType: 'lucide',
          relevantRoles: ['young-executive', 'entrepreneur', 'sales-bizdev'] },
        { value: 'town-halls', label: 'Town Hall Series', icon: 'video', iconType: 'lucide',
          relevantRoles: ['executive', 'entrepreneur', 'investor', 'service-pro', 'nonprofit'] },
        { value: 'networking', label: 'Network & Connect', icon: 'users', iconType: 'lucide',
          relevantRoles: ['executive', 'entrepreneur', 'young-executive', 'sales-bizdev', 'service-pro', 'investor', 'nonprofit', 'browsing'] },
        { value: 'mentorship', label: 'Mentorship & Giving', icon: 'hand-heart', iconType: 'lucide',
          relevantRoles: ['executive', 'entrepreneur', 'young-executive', 'service-pro', 'investor', 'nonprofit'] },
        { value: 'member-spotlights', label: 'Member Spotlights', icon: 'star', iconType: 'lucide',
          relevantRoles: ['executive', 'entrepreneur', 'sales-bizdev', 'investor', 'browsing'] },
        { value: 'community', label: 'Community Outreach', icon: 'globe', iconType: 'lucide',
          relevantRoles: ['executive', 'nonprofit', 'service-pro', 'investor', 'browsing'] },
        { value: 'browsing', label: 'Just Browsing', icon: 'compass', iconType: 'lucide',
          relevantRoles: ['executive', 'entrepreneur', 'young-executive', 'sales-bizdev', 'service-pro', 'investor', 'nonprofit', 'browsing'] },
      ],
    },
    {
      type: 'results',
      id: 'results',
      title: 'Your SND Tour',
      subtitle: 'People, programs, and stories tailored to why you came.',
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
        { id: 'solutions', label: 'Membership', icon: 'layers' },
      ],
      cardsPerPage: 6,
      defaultView: 'small',
    },
    {
      type: 'summary',
      id: 'summary',
      title: 'Your Saved Items',
      subtitle: 'Review your picks and an SND ambassador will follow up.',
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
      subtitle: 'An SND ambassador will be in touch shortly.',
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
    //   executive       : monthly-meetings, town-halls, networking,
    //                     mentorship, member-spotlights, community, browsing
    //   entrepreneur    : monthly-meetings, young-execs, town-halls,
    //                     networking, mentorship, member-spotlights, browsing
    //   young-executive : monthly-meetings, young-execs, networking,
    //                     mentorship, browsing
    //   sales-bizdev    : monthly-meetings, young-execs, networking,
    //                     member-spotlights, browsing
    //   service-pro     : monthly-meetings, town-halls, networking,
    //                     mentorship, community, browsing
    //   investor        : monthly-meetings, town-halls, networking,
    //                     mentorship, member-spotlights, community, browsing
    //   nonprofit       : monthly-meetings, town-halls, networking,
    //                     mentorship, community, browsing
    //   browsing        : (catch-all — all interests)
    // ─────────────────────────────────────────────────────────────────

    // ── Outcomes / Impact (7) ─────────────────────────
    {
      id: 'o1',
      title: '38 Years Strong',
      cardType: 'outcome',
      icon: 'award',
      iconType: 'lucide',
      stat: '1988',
      description: {
        small: 'Connecting DFW leaders since 1988.',
        medium: 'Success North Dallas has been connecting the right people, for the right reasons, since 1988.',
        large: 'For 38 years and counting, SND has been the place where DFW\'s most influential leaders meet, share, and build meaningful relationships.',
        overlay: 'Since 1988, Success North Dallas has been bringing together the region\'s C-suite, founders, and emerging leaders around a single idea: connecting the right people, for the right reasons, at the right time. Almost four decades of compounding relationships is the moat.',
      },
      tags: ['legacy', 'community'],
      targetRoles: ['executive', 'entrepreneur', 'young-executive', 'sales-bizdev', 'service-pro', 'investor', 'nonprofit', 'browsing'],
      targetInterests: ['monthly-meetings', 'networking', 'browsing'],
    },
    {
      id: 'o2',
      title: '200+ Leaders Monthly',
      cardType: 'outcome',
      icon: 'users',
      iconType: 'lucide',
      stat: '200+',
      description: {
        small: 'Around 200 influential leaders gather each month.',
        medium: 'Each monthly meeting brings together roughly 200 of DFW\'s most influential professionals.',
        large: 'Monthly meetings on the third Wednesday convene ~200 senior leaders — C-suite, founders, advisors, investors — for a featured keynote and curated connection time.',
        overlay: 'On the third Wednesday of every month, ~200 of DFW\'s most influential leaders walk into the same room. Featured keynote speakers, curated tables, and a culture of generous introductions turn a meeting into a relationship engine that compounds over time.',
      },
      tags: ['networking', 'monthly-meetings'],
      targetRoles: ['executive', 'entrepreneur', 'young-executive', 'sales-bizdev', 'service-pro', 'investor', 'nonprofit', 'browsing'],
      targetInterests: ['monthly-meetings', 'networking', 'member-spotlights'],
    },
    {
      id: 'o3',
      title: '6+ Annual Town Halls',
      cardType: 'outcome',
      icon: 'video',
      iconType: 'lucide',
      stat: '6+',
      description: {
        small: '6+ Town Halls per year for distant members.',
        medium: 'Members 100+ miles from Dallas get 6+ Town Hall meetings annually — full SND value, remote.',
        large: 'The Town Hall series brings the SND experience to members who live 100+ miles from Dallas — 6 or more sessions a year with the same speaker quality and connection culture.',
        overlay: 'For members based 100+ miles from Dallas, the Town Hall series brings the same caliber of speakers, peers, and curated conversation to a remote-friendly format — 6+ times a year. SND membership doesn\'t penalize geography; the relationships stay live.',
      },
      tags: ['town-halls', 'remote'],
      targetRoles: ['executive', 'entrepreneur', 'investor', 'service-pro', 'nonprofit'],
      targetInterests: ['town-halls', 'networking'],
    },
    {
      id: 'o4',
      title: 'Relationships. Resources. Results.',
      cardType: 'outcome',
      icon: 'sparkles',
      iconType: 'lucide',
      stat: '3 Pillars',
      description: {
        small: 'Three pillars: Relationships, Resources, Results.',
        medium: 'SND\'s entire model rests on three pillars — Relationships, Resources, and Results.',
        large: 'The SND playbook is simple: invest in the right Relationships, share the right Resources, and the Results compound. Servant leadership is the operating system.',
        overlay: 'Three pillars define SND: Relationships (the right people, intentionally introduced), Resources (the right insights and tools, shared generously), and Results (the outcomes that flow when leaders give before they ask). Servant leadership and a giver mentality are not slogans here — they\'re the membership filter.',
      },
      tags: ['culture', 'values'],
      targetRoles: ['executive', 'entrepreneur', 'young-executive', 'sales-bizdev', 'service-pro', 'investor', 'nonprofit', 'browsing'],
      targetInterests: ['monthly-meetings', 'networking', 'mentorship', 'browsing'],
    },
    {
      id: 'o5',
      title: 'Young Executives Under 39',
      cardType: 'outcome',
      icon: 'sparkles',
      iconType: 'lucide',
      stat: '<39',
      description: {
        small: 'Special-interest group for emerging leaders under 39.',
        medium: 'The Young Executives group is a dedicated track for ambitious DFW professionals under 39.',
        large: 'Young Executives is a special-interest community inside SND for rising professionals under 39 — peer cohort, accelerated mentorship, and direct access to the senior membership.',
        overlay: 'The Young Executives community is SND\'s answer to "where do the next 20 years of DFW\'s leaders come from?" Under-39 founders, operators, and emerging executives get their own peer cohort plus a direct line into the senior membership for mentorship, sponsorship, and warm intros that would otherwise take a decade to earn.',
      },
      tags: ['young-execs', 'mentorship'],
      targetRoles: ['young-executive', 'entrepreneur', 'sales-bizdev'],
      targetInterests: ['young-execs', 'mentorship', 'networking'],
    },
    {
      id: 'o6',
      title: 'Servant Leadership Culture',
      cardType: 'outcome',
      icon: 'hand-heart',
      iconType: 'lucide',
      stat: 'Give First',
      description: {
        small: 'A culture built on servant leadership and giving first.',
        medium: 'Members are expected to define personal success, honor commitments, and adopt a giver mentality.',
        large: 'SND filters for "givers." Members commit to defining their own version of success, honoring their word, and putting service ahead of self-interest. That filter is the moat.',
        overlay: 'The unwritten rule at SND: come as a giver, not a taker. Members are expected to define what success means for them personally, honor commitments, and prioritize others\' growth. The "giver" filter is the reason this network has compounded for 38 years — and the reason new members get the warm welcome they do.',
      },
      tags: ['culture', 'mentorship'],
      targetRoles: ['executive', 'entrepreneur', 'young-executive', 'service-pro', 'investor', 'nonprofit'],
      targetInterests: ['mentorship', 'networking', 'community'],
    },
    {
      id: 'o7',
      title: 'Premier DFW Partners',
      cardType: 'outcome',
      icon: 'building',
      iconType: 'lucide',
      stat: 'Tier 1',
      description: {
        small: 'Members include leaders from premier DFW firms.',
        medium: 'Partner organizations include Digital MPs, City Central, MBG CPA, NBA G League Texas, and more.',
        large: 'SND\'s membership spans premier DFW firms — Digital MPs, City Central, MBG CPA, Revenue Growth Company, Emmaus Lens, NBA G League Texas, Prestonwood Country Club, and dozens more.',
        overlay: 'A snapshot of the SND ecosystem: Digital MPs, City Central, MBG CPA, Revenue Growth Company, Emmaus Lens, NBA G League Texas, Prestonwood Country Club — and dozens more across professional services, financial services, real estate, hospitality, technology, and community organizations across DFW.',
      },
      tags: ['member-spotlights', 'community'],
      targetRoles: ['executive', 'entrepreneur', 'sales-bizdev', 'investor', 'browsing'],
      targetInterests: ['member-spotlights', 'networking', 'community'],
    },

    // ── Learn / Discover (8) ─────────────────────────
    {
      id: 'l1',
      title: 'Visit SuccessNorthDallas.com',
      cardType: 'learn',
      mediaType: 'website',
      icon: 'globe',
      iconType: 'lucide',
      url: 'https://successnorthdallas.com',
      description: {
        small: 'The full SND home base online.',
        medium: 'The official SND website — membership, events, leadership, and how to get involved.',
        large: 'SuccessNorthDallas.com is the front door — events calendar, leadership team, member testimonials, and the path to join.',
        overlay: 'Bookmark the SND home base — every event date, every speaker line-up, the path to join, and the back-catalog of member content. The fastest way to see what membership feels like before you ever walk into a room.',
      },
      tags: ['website'],
      targetRoles: ['executive', 'entrepreneur', 'young-executive', 'sales-bizdev', 'service-pro', 'investor', 'nonprofit', 'browsing'],
      targetInterests: ['monthly-meetings', 'networking', 'browsing'],
    },
    {
      id: 'l2',
      title: 'Inside a Monthly Meeting',
      cardType: 'learn',
      mediaType: 'blog',
      icon: 'mic',
      iconType: 'lucide',
      url: 'https://successnorthdallas.com',
      description: {
        small: 'A walk-through of the third-Wednesday format.',
        medium: 'What a typical SND monthly meeting feels like — keynote, networking, and warm introductions.',
        large: 'Every third Wednesday: doors open, ~200 leaders in the room, a featured keynote on growth, leadership, or industry insight, then structured connection time.',
        overlay: 'Doors open before the program — that\'s when the warm intros happen. ~200 of DFW\'s most influential leaders move through the room, the keynote runs about 30 minutes, and structured connection time follows. The whole arc is engineered for "I want to introduce you to..." moments.',
      },
      tags: ['monthly-meetings'],
      targetRoles: ['executive', 'entrepreneur', 'young-executive', 'sales-bizdev', 'service-pro', 'investor', 'nonprofit', 'browsing'],
      targetInterests: ['monthly-meetings', 'networking'],
    },
    {
      id: 'l3',
      title: 'CEO Casey Hasten on SND',
      cardType: 'learn',
      mediaType: 'video',
      icon: 'video',
      iconType: 'lucide',
      url: 'https://successnorthdallas.com',
      description: {
        small: 'A short video from CEO Casey Hasten.',
        medium: 'CEO Casey Hasten on SND\'s philosophy, the membership filter, and what 38 years has built.',
        large: 'CEO Casey Hasten walks through SND\'s servant-leadership philosophy, who thrives in the membership, and the relationships that have compounded over four decades.',
        overlay: 'Hear directly from CEO Casey Hasten on why SND has lasted 38 years, what kind of leader thrives in the membership, the role of servant leadership in the culture, and how she thinks about the next decade of the organization.',
      },
      tags: ['leadership'],
      targetRoles: ['executive', 'entrepreneur', 'young-executive', 'sales-bizdev', 'service-pro', 'investor', 'nonprofit', 'browsing'],
      targetInterests: ['monthly-meetings', 'networking', 'mentorship'],
    },
    {
      id: 'l4',
      title: 'The Town Hall Series',
      cardType: 'learn',
      mediaType: 'blog',
      icon: 'video',
      iconType: 'lucide',
      url: 'https://successnorthdallas.com',
      description: {
        small: 'How SND serves members 100+ miles from Dallas.',
        medium: 'Town Halls are the SND model adapted for members who live more than 100 miles from Dallas.',
        large: 'For members based outside the DFW core, Town Halls bring the same speaker quality, peer caliber, and connection culture in a 6+ times-per-year format.',
        overlay: 'Living outside DFW shouldn\'t cost you the relationships. The Town Hall series convenes the same speaker quality and peer caliber as monthly meetings, 6+ times a year, in a format that respects the travel ask. The most underrated benefit of being a remote SND member.',
      },
      tags: ['town-halls'],
      targetRoles: ['executive', 'entrepreneur', 'investor', 'service-pro', 'nonprofit'],
      targetInterests: ['town-halls', 'networking'],
    },
    {
      id: 'l5',
      title: 'Young Executives Profile',
      cardType: 'learn',
      mediaType: 'blog',
      icon: 'sparkles',
      iconType: 'lucide',
      url: 'https://successnorthdallas.com',
      description: {
        small: 'A profile of the Young Executives community.',
        medium: 'Inside the Young Executives community — rising leaders under 39, mentored by SND\'s senior membership.',
        large: 'Young Executives is its own community within SND — under-39 founders and operators, paired with senior-member mentors, on a path that compounds faster than going it alone.',
        overlay: 'A deep look at the Young Executives community: who joins, what the cadence feels like, the senior-member mentors who show up, and the kinds of breakthroughs members credit to the group. If you\'re under 39 and ambitious in DFW, this is the on-ramp.',
      },
      tags: ['young-execs'],
      targetRoles: ['young-executive', 'entrepreneur', 'sales-bizdev'],
      targetInterests: ['young-execs', 'mentorship'],
    },
    {
      id: 'l6',
      title: 'Member Spotlight Stories',
      cardType: 'learn',
      mediaType: 'blog',
      icon: 'star',
      iconType: 'lucide',
      url: 'https://successnorthdallas.com',
      description: {
        small: 'Stories from SND members about what membership unlocked.',
        medium: 'Short-form stories from members on the introductions, deals, and friendships that came from SND.',
        large: 'Members share the introductions, partnerships, and friendships that came out of SND — the kind of relational ROI that\'s hard to manufacture from cold outreach.',
        overlay: 'Members share specific introductions, deals, partnerships, and friendships that traced back to SND. Patterns emerge: the right introduction at the right moment, a warm referral that closed a deal, a mentor who shaped a decade of career. The compounding effect of being in the room.',
      },
      tags: ['member-spotlights'],
      targetRoles: ['executive', 'entrepreneur', 'sales-bizdev', 'investor', 'browsing'],
      targetInterests: ['member-spotlights', 'networking'],
    },
    {
      id: 'l7',
      title: 'The Servant Leadership Playbook',
      cardType: 'learn',
      mediaType: 'blog',
      icon: 'hand-heart',
      iconType: 'lucide',
      url: 'https://successnorthdallas.com',
      description: {
        small: 'How SND practices servant leadership.',
        medium: 'The playbook: define personal success, honor commitments, give before asking.',
        large: 'A practical look at how SND\'s servant-leadership culture shows up in the room — and why "give before you ask" is the most asymmetric strategy in networking.',
        overlay: 'A practitioner-level walk through the SND servant-leadership playbook: define what success means for YOU, honor your word, and put others\' growth ahead of your own ask. Why this approach compounds over a career, and how SND\'s membership filter keeps the culture intact.',
      },
      tags: ['culture', 'mentorship'],
      targetRoles: ['executive', 'entrepreneur', 'young-executive', 'service-pro', 'investor', 'nonprofit'],
      targetInterests: ['mentorship', 'networking', 'community'],
    },
    {
      id: 'l8',
      title: 'Community Outreach at SND',
      cardType: 'learn',
      mediaType: 'blog',
      icon: 'globe',
      iconType: 'lucide',
      url: 'https://successnorthdallas.com',
      description: {
        small: 'How SND members give back to DFW.',
        medium: 'SND community outreach — the way members invest back into the DFW community they\'ve been blessed by.',
        large: 'Community outreach is a core SND throughline — members organize around DFW nonprofits, mentorship of next-gen leaders, and concrete service to the broader community.',
        overlay: 'SND members don\'t just network with each other — they organize around DFW nonprofits, mentor the next generation of leaders, and put their time and resources into concrete community service. The community outreach pillar is how members translate "giver mentality" into measurable impact across the region.',
      },
      tags: ['community'],
      targetRoles: ['executive', 'nonprofit', 'service-pro', 'investor', 'browsing'],
      targetInterests: ['community', 'mentorship'],
    },

    // ── Solutions / Membership (7) ─────────────────────────
    {
      id: 's1',
      title: 'Standard Membership',
      cardType: 'solution',
      icon: 'briefcase',
      iconType: 'lucide',
      description: {
        small: 'Full SND membership for established leaders.',
        medium: 'Full membership grants access to monthly meetings, Town Halls, and the broader SND network.',
        large: 'Standard membership unlocks every SND benefit — monthly meetings, Town Halls, member directory, and curated introductions to the broader DFW leadership network.',
        overlay: 'Standard membership is the full SND experience: third-Wednesday monthly meetings, access to all Town Halls, the member directory, curated introductions, and the cultural expectation that you show up as a giver. Most members describe the first year as a ramp; the relationships compound from year two onward.',
      },
      tags: ['membership'],
      targetRoles: ['executive', 'entrepreneur', 'sales-bizdev', 'service-pro', 'investor', 'nonprofit'],
      targetInterests: ['monthly-meetings', 'networking', 'town-halls', 'browsing'],
    },
    {
      id: 's2',
      title: 'Young Executives Membership',
      cardType: 'solution',
      icon: 'sparkles',
      iconType: 'lucide',
      description: {
        small: 'Dedicated track for leaders under 39.',
        medium: 'For ambitious DFW professionals under 39 — peer cohort plus access to senior membership.',
        large: 'Young Executives is SND\'s dedicated track for leaders under 39 — peer cohort, mentorship from senior members, and an accelerated path into the broader network.',
        overlay: 'A dedicated under-39 track that pairs a peer cohort of rising leaders with direct mentorship from SND\'s senior membership. The whole design compresses what would otherwise be a decade of slow relationship-building into a few intentional years.',
      },
      tags: ['young-execs', 'membership'],
      targetRoles: ['young-executive', 'entrepreneur', 'sales-bizdev'],
      targetInterests: ['young-execs', 'mentorship', 'networking'],
    },
    {
      id: 's3',
      title: 'Monthly Meeting Program',
      cardType: 'solution',
      icon: 'mic',
      iconType: 'lucide',
      description: {
        small: 'Third Wednesday every month, ~200 leaders.',
        medium: 'Monthly meetings on the third Wednesday — featured keynote and curated connection time.',
        large: 'Cornerstone of SND — every third Wednesday, ~200 of DFW\'s top leaders gather for a featured speaker plus structured networking.',
        overlay: 'The cornerstone of SND. Third Wednesday every month, ~200 of DFW\'s most influential leaders convene for a featured keynote on growth, leadership, or industry insight, followed by structured connection time engineered for warm introductions. It is the single highest-leverage hour-and-a-half a member spends each month.',
      },
      tags: ['monthly-meetings'],
      targetRoles: ['executive', 'entrepreneur', 'young-executive', 'sales-bizdev', 'service-pro', 'investor', 'nonprofit'],
      targetInterests: ['monthly-meetings', 'networking'],
    },
    {
      id: 's4',
      title: 'Town Hall Program',
      cardType: 'solution',
      icon: 'video',
      iconType: 'lucide',
      description: {
        small: '6+ Town Halls a year for distant members.',
        medium: 'Town Halls bring the SND model to members 100+ miles from Dallas, 6+ times a year.',
        large: 'For members based outside the DFW core, Town Halls deliver the same speaker quality and connection culture in a 6+ times-per-year, remote-friendly format.',
        overlay: 'Town Halls deliver the SND model to members based 100+ miles from Dallas. Same speaker caliber, same peer quality, 6+ sessions a year, in a format engineered around the travel ask. The reason an SND membership outside DFW doesn\'t feel like a downgrade.',
      },
      tags: ['town-halls'],
      targetRoles: ['executive', 'entrepreneur', 'investor', 'service-pro', 'nonprofit'],
      targetInterests: ['town-halls', 'networking'],
    },
    {
      id: 's5',
      title: 'Networking Events',
      cardType: 'solution',
      icon: 'users',
      iconType: 'lucide',
      description: {
        small: 'Curated networking beyond monthly meetings.',
        medium: 'Special events — intimate dinners, off-sites, and curated introductions throughout the year.',
        large: 'Beyond the third-Wednesday cadence, SND runs intimate dinners, off-site experiences, and curated 1:1 introductions throughout the year.',
        overlay: 'Outside the third-Wednesday rhythm, SND curates a year-round calendar of smaller-format experiences — intimate executive dinners, off-site retreats, and curated 1:1 introductions. The connective tissue that turns 200-person rooms into deep relationships.',
      },
      tags: ['networking'],
      targetRoles: ['executive', 'entrepreneur', 'young-executive', 'sales-bizdev', 'service-pro', 'investor', 'nonprofit'],
      targetInterests: ['networking', 'member-spotlights'],
    },
    {
      id: 's6',
      title: 'Mentorship Program',
      cardType: 'solution',
      icon: 'hand-heart',
      iconType: 'lucide',
      description: {
        small: 'Senior leaders mentoring next-gen executives.',
        medium: 'Senior SND members mentor next-generation leaders — Young Executives and beyond.',
        large: 'Senior SND members invest in next-generation leaders through structured and informal mentorship — the lived expression of servant leadership and the giver mentality.',
        overlay: 'Mentorship is how SND\'s servant-leadership philosophy translates into action. Senior members invest time and access into next-generation leaders — Young Executives, emerging founders, rising operators. The single highest-leverage way to give back inside the network, and one of the most underrated reasons to join.',
      },
      tags: ['mentorship'],
      targetRoles: ['executive', 'entrepreneur', 'young-executive', 'service-pro', 'investor', 'nonprofit'],
      targetInterests: ['mentorship', 'networking', 'young-execs'],
    },
    {
      id: 's7',
      title: 'Community Outreach',
      cardType: 'solution',
      icon: 'globe',
      iconType: 'lucide',
      description: {
        small: 'Member-led service to the DFW community.',
        medium: 'SND organizes around DFW nonprofits and community causes — the giver mentality applied at scale.',
        large: 'SND members organize collectively around DFW nonprofits and community causes — turning the giver mentality into concrete, measurable impact across the region.',
        overlay: 'Community outreach is SND\'s collective expression of the giver mentality. Members organize around DFW nonprofits, mentor next-gen leaders, and put their time and resources into concrete service projects across the region. The "Results" pillar isn\'t just about members\' careers — it\'s the community impact they create together.',
      },
      tags: ['community'],
      targetRoles: ['executive', 'nonprofit', 'service-pro', 'investor', 'browsing'],
      targetInterests: ['community', 'mentorship', 'networking'],
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
