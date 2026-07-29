// Recruiter Config — Warren CAT (Technical Recruiting)
// Career fair / campus recruiting kiosk for the Cat dealer serving
// West Texas & Oklahoma (100,000+ sq mi, 17 locations, family-run
// since 1985). Programs: Warren U Technical Institute (1-yr academy,
// Brownfield TX), ThinkBIG @ OSUIT (2-yr AAS, $30,800 tuition
// reimbursement), Permian Basin Internship Program, Technicians for
// the World (free online), Technician Trainees, and the 12-month
// Leadership Development Program.
// Brand: CAT yellow #FFCC00 + black. Site font is Univers Next Pro
// (licensed) with Roboto as the loaded Google family → Roboto.
// Content sourced from the three intake program fliers (self-hosted
// at /brand/assets/) + warrencat.com/careers + @warrencat YouTube.

import type { ExplorerConfig, ThemeColors } from '../types';

const WARREN_DARK: ThemeColors = {
  // Warm yellow-tinted near-black so dialogs and the Tools menu read
  // Warren CAT rather than generic dark mode.
  bg: '#0B0A05',
  bgGradient: 'linear-gradient(135deg, #1A1500 0%, #0F0D04 55%, #0B0A05 100%)',
  surface: 'rgba(255,255,255,0.06)',
  surfaceHover: 'rgba(255,255,255,0.10)',
  border: 'rgba(255,255,255,0.12)',
  borderFocus: '#FFCC00',
  text1: '#FFFFFF',
  text2: 'rgba(255,255,255,0.78)',
  text3: 'rgba(255,255,255,0.52)',
  inputBg: 'rgba(255,255,255,0.08)',
  inputText: '#FFFFFF',
  inputPlaceholder: 'rgba(255,255,255,0.40)',
  logoText: '#FFFFFF',
  focusRing: 'rgba(255,204,0,0.25)',
};

const WARREN_LIGHT: ThemeColors = {
  // Clean warm off-white; the yellow accent carries the brand.
  bg: '#F7F6F1',
  bgGradient: 'linear-gradient(180deg, #F8F7F2 0%, #F3F1EA 100%)',
  surface: 'rgba(255,255,255,0.92)',
  surfaceHover: 'rgba(255,255,255,1.00)',
  border: 'rgba(20,18,5,0.10)',
  borderFocus: '#C9A200',
  text1: '#0B0A05',
  text2: 'rgba(11,10,5,0.66)',
  text3: 'rgba(11,10,5,0.45)',
  inputBg: '#FFFFFF',
  inputText: '#0B0A05',
  inputPlaceholder: 'rgba(11,10,5,0.36)',
  logoText: '#0B0A05',
  focusRing: 'rgba(201,162,0,0.15)',
};

export const WARREN_CAT_CONFIG: ExplorerConfig = {
  id: 'warren-cat',
  name: 'Warren CAT Talent Recruiter',
  kind: 'recruiter',
  version: 1,
  createdAt: '2026-07-29T00:00:00.000Z',
  updatedAt: '2026-07-29T00:00:00.000Z',

  branding: {
    logo: {
      // The Warren CAT badge is self-contained (white frame, yellow
      // field, black CAT square) — the same lockup works on dark and
      // light backgrounds.
      dark: '/brand/assets/warren-cat-logo-reverse.svg',
      light: '/brand/assets/warren-cat-logo.svg',
    },
    // Badge lockup is ~3.5:1 (113x32 viewBox). 34px matches the other
    // wide-lockup prototypes in the top bar.
    logoHeight: 34,
    icon: '/brand/assets/warren-cat-icon.jpg',
    colors: {
      primary: '#FFCC00',   // CAT yellow, main accent
      secondary: '#000000', // black, second anchor
      teal: '#FFCC00',      // yellow doubles as hover/focus on dark
      blue: '#3D3D3D',
      deepBlue: '#1F1F1F',
      // midnight + navy drive dialog backgrounds + overlay backdrop —
      // warm yellow-black tones.
      navy: '#15130A',
      midnight: '#0B0A05',
      plum: '#7A6300',      // deep gold, gradient support
      bgDark: '#0B0A05',
      dark: WARREN_DARK,
      light: WARREN_LIGHT,
    },
    // Site font is Univers Next Pro (licensed, not loadable) — Roboto
    // is the Google family warrencat.com actually loads.
    font: "'Roboto', -apple-system, sans-serif",
    backgroundPattern: 'none',
    auroraOrbs: {
      orb1: 'rgba(255,204,0,0.14)',
      orb2: 'rgba(255,204,0,0.10)',
      orb3: 'rgba(122,99,0,0.12)',
    },
    // CTA = CAT yellow → deep gold; black text for contrast on yellow
    ctaGradient: 'linear-gradient(135deg, #FFCC00, #C9A200)',
    ctaTextColor: '#0B0A05',
    // Headline gradient: bright CAT yellow → gold
    gradientWord: 'linear-gradient(135deg, #FFD633 0%, #FFCC00 55%, #E0B400 100%)',
    // Per-role glows: yellow / gold mixes so each role feels like its
    // own chapter.
    roleBackgrounds: {
      'student': 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(255,204,0,0.16) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 15% 15%, rgba(122,99,0,0.10) 0%, transparent 55%)',
      'experienced-tech': 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(224,180,0,0.16) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 85% 15%, rgba(255,204,0,0.10) 0%, transparent 55%)',
      'veteran': 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(122,99,0,0.18) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 25% 15%, rgba(255,204,0,0.10) 0%, transparent 55%)',
      'advisor': 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(255,204,0,0.14) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 85% 15%, rgba(100,80,0,0.12) 0%, transparent 55%)',
      'parent': 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(200,160,0,0.14) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 15% 25%, rgba(255,204,0,0.08) 0%, transparent 55%)',
      'exploring': 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(255,204,0,0.12) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 85% 25%, rgba(122,99,0,0.10) 0%, transparent 55%)',
    },
  },

  registration: {
    modes: ['form', 'scan', 'search'],
    defaultMode: 'form',
    formTitle: 'Stay Connected',
    formSubtitle: 'Share your info and our recruiting team will follow up with program details and next steps.',
    scanLabel: 'Scan Your Resume QR',
    scanHint: 'Hold your QR code in front of the camera',
    searchPlaceholder: 'Search by last name...',
    optInText: 'By sharing your information you consent to Warren CAT processing your data to fulfill your request and send relevant follow-up communications about careers and training programs.',
    showLocaleButton: false,
    idleTimeoutMs: 10000,
    skipEnabled: true,
    fields: [
      { id: 'firstName', label: 'First Name', type: 'text', placeholder: 'First name', required: true, halfWidth: true },
      { id: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Last name', required: true, halfWidth: true },
      { id: 'email', label: 'Email', type: 'email', placeholder: 'name@example.com', required: true, halfWidth: true },
      { id: 'phone', label: 'Phone', type: 'tel', placeholder: '(555) 555-5555', required: false, halfWidth: true },
      { id: 'company', label: 'School', type: 'text', placeholder: 'School or program (optional)', required: false, halfWidth: true },
      { id: 'title', label: 'Grad Year', type: 'text', placeholder: 'Expected grad year (optional)', required: false, halfWidth: true },
    ],
  },

  steps: [
    {
      type: 'splash',
      id: 'welcome',
      title: 'A Career',
      gradientWord: 'With a Path.',
      subtitle: 'Family-run since 1985, Warren CAT keeps West Texas and Oklahoma running with 17 locations across 100,000+ square miles. Paid training, an $8,000 tool package, and a clear pathway from student to Cat technician. Tap to find yours.',
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
      title: 'What describes you best?',
      subtitle: 'Select the option that fits you best.',
      showGreeting: true,
      showSelectAll: false,
      options: [
        { value: 'student', label: 'Student / Job Seeker', icon: 'graduation-cap', iconType: 'lucide' },
        { value: 'experienced-tech', label: 'Experienced Technician', icon: 'wrench', iconType: 'lucide' },
        { value: 'veteran', label: 'Veteran / Military', icon: 'shield', iconType: 'lucide' },
        { value: 'advisor', label: 'Advisor / Instructor', icon: 'book-open', iconType: 'lucide' },
        { value: 'parent', label: 'Parent / Family', icon: 'users', iconType: 'lucide' },
        { value: 'exploring', label: 'Just Exploring', icon: 'compass', iconType: 'lucide' },
      ],
    },
    {
      type: 'trait-selection',
      id: 'interests',
      selectionMode: 'multi',
      title: 'What are you most interested in?',
      subtitle: 'Select all that apply.',
      showGreeting: false,
      showSelectAll: true,
      // Conditional mapping — role → relevant interests.
      options: [
        { value: 'warren-u', label: 'Warren U Technical Institute', icon: 'school', iconType: 'lucide',
          relevantRoles: ['student', 'veteran', 'advisor', 'parent', 'exploring'] },
        { value: 'thinkbig', label: 'ThinkBIG @ OSUIT', icon: 'zap', iconType: 'lucide',
          relevantRoles: ['student', 'veteran', 'advisor', 'parent', 'exploring'] },
        { value: 'pbip', label: 'Permian Basin Internship', icon: 'map-pin', iconType: 'lucide',
          relevantRoles: ['student', 'advisor', 'parent', 'exploring'] },
        { value: 't4w', label: 'Free Online Training', icon: 'laptop', iconType: 'lucide',
          relevantRoles: ['student', 'experienced-tech', 'veteran', 'advisor', 'exploring'] },
        { value: 'leadership', label: 'Leadership Development', icon: 'trending-up', iconType: 'lucide',
          relevantRoles: ['experienced-tech', 'student', 'veteran', 'exploring'] },
        { value: 'benefits', label: 'Pay & Benefits', icon: 'award', iconType: 'lucide',
          relevantRoles: ['student', 'experienced-tech', 'veteran', 'parent', 'exploring'] },
        { value: 'veteran-programs', label: 'Veteran Programs', icon: 'shield', iconType: 'lucide',
          relevantRoles: ['veteran', 'exploring'] },
        { value: 'browsing', label: 'Just Browsing', icon: 'compass', iconType: 'lucide',
          relevantRoles: ['student', 'experienced-tech', 'veteran', 'advisor', 'parent', 'exploring'] },
      ],
    },
    {
      type: 'results',
      id: 'results',
      title: 'Your Path at Warren CAT',
      subtitle: 'Programs, pay, and real stories matched to you.',
      tabs: [
        { id: 'outcomes', label: 'Why Warren', icon: 'trending-up' },
        {
          id: 'learn',
          label: 'Discover',
          icon: 'book-open',
          filters: [
            { label: 'All', value: 'all' },
            { label: 'Video', value: 'video' },
            { label: 'PDF', value: 'pdf' },
            { label: 'Website', value: 'website' },
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
      title: 'Your Picks',
      subtitle: 'Review your saved items and our recruiting team will follow up.',
    },
    {
      type: 'content-library',
      id: 'library',
      title: 'All Programs & Resources',
      subtitle: 'Browse everything Warren CAT has to offer.',
    },
    {
      type: 'thank-you',
      id: 'thanks',
      title: 'Thanks for Stopping By!',
      subtitle: 'We\'ll follow up with the resources you selected. Check your inbox soon.',
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
    //   student          : warren-u, thinkbig, pbip, t4w, leadership,
    //                      benefits, browsing
    //   experienced-tech : t4w, leadership, benefits, browsing
    //   veteran          : warren-u, thinkbig, t4w, leadership,
    //                      benefits, veteran-programs, browsing
    //   advisor          : warren-u, thinkbig, pbip, t4w, browsing
    //   parent           : warren-u, thinkbig, pbip, benefits, browsing
    //   exploring        : (catch-all — all interests)
    //
    // Program facts come from the three intake fliers (self-hosted at
    // /brand/assets/warren-cat-*.pdf) and warrencat.com/careers.
    // ─────────────────────────────────────────────────────────────────

    // ── Outcomes / Why Warren (8) ─────────────────────────
    {
      id: 'o1',
      title: '$8,000 Tool Package Included',
      cardType: 'outcome',
      icon: 'wrench',
      iconType: 'lucide',
      stat: '$8K',
      url: 'https://warrencat.com/careers/technician-development/',
      description: {
        small: 'Every program includes an $8,000 tool and toolbox package.',
        medium: 'Warren U, ThinkBIG, and the Permian Basin Internship all include an $8,000 tool and toolbox package.',
        large: 'You don\'t buy your way into this trade, Warren CAT hands you an $8,000 tool and toolbox package in every program: Warren U, ThinkBIG at OSUIT, and the Permian Basin Internship.',
        overlay: 'The tool wall is the biggest hidden cost of starting a technician career, and Warren CAT removes it: every pathway (Warren U Technical Institute, the ThinkBIG program at OSUIT, and the Permian Basin Internship) includes an $8,000 tool and toolbox package. Use the tools from day one; full ownership vests after the program\'s employment period. Start the career without starting in debt.',
      },
      tags: ['benefits'],
      targetRoles: ['student', 'veteran', 'parent', 'advisor', 'exploring'],
      targetInterests: ['benefits', 'warren-u', 'thinkbig', 'pbip'],
    },
    {
      id: 'o2',
      title: '$30,800 Tuition Paid Back',
      cardType: 'outcome',
      icon: 'graduation-cap',
      iconType: 'lucide',
      stat: '$30.8K',
      url: 'https://www.momentifyapp.com/brand/assets/warren-cat-thinkbig-flier.pdf',
      description: {
        small: 'ThinkBIG repays $30,800 in tuition over four years.',
        medium: 'Complete ThinkBIG and Warren CAT repays $30,800 in tuition over your first four years on the team.',
        large: 'ThinkBIG graduates get their education paid back: $30,800 in tuition reimbursement over four years of employment: $4,000, $6,000, $8,400, then $12,400 at each year-end.',
        overlay: 'The ThinkBIG deal: finish the two-year Cat Dealer Prep program at OSU Institute of Technology, join Warren CAT, and the company repays $30,800 of your tuition over your first four years: $4,000 after year one, $6,000 after year two, $8,400 after year three, and $12,400 after year four. Add GPA pay ($750 per semester for a 3.0-3.49, $1,500 for 3.5+), in-state tuition for all participants, and semester-over-semester internship raises, and the degree can effectively pay for itself.',
      },
      tags: ['thinkbig', 'benefits'],
      targetRoles: ['student', 'veteran', 'parent', 'advisor', 'exploring'],
      targetInterests: ['thinkbig', 'benefits'],
    },
    {
      id: 'o3',
      title: 'Paid From Day One',
      cardType: 'outcome',
      icon: 'dollar-sign',
      iconType: 'lucide',
      stat: 'Paid',
      url: 'https://warrencat.com/careers/technician-development/',
      description: {
        small: 'Every Warren CAT training pathway is a paid position.',
        medium: 'Warren U, ThinkBIG, and PBIP are all paid, with raises tied to performance and progression.',
        large: 'No unpaid apprenticeships here: Warren U pays a competitive internship wage with six-month performance raises, ThinkBIG pays through every dealership rotation with raises each semester, and PBIP is paid throughout.',
        overlay: 'Every Warren CAT pathway pays while you learn. Warren U interns earn a competitive wage with performance-based raises at six months and promotion to Tech I after year one. ThinkBIG students earn during every dealership internship rotation, with pay increases each semester plus GPA bonuses. Permian Basin interns are paid throughout. You\'re building a paycheck history and a career at the same time, not choosing between them.',
      },
      tags: ['benefits'],
      targetRoles: ['student', 'veteran', 'parent', 'exploring'],
      targetInterests: ['benefits', 'warren-u', 'thinkbig', 'pbip'],
    },
    {
      id: 'o4',
      title: '17 Locations, 100,000+ Sq Miles',
      cardType: 'outcome',
      icon: 'map',
      iconType: 'lucide',
      stat: '17',
      url: 'https://warrencat.com/locations/',
      description: {
        small: 'Warren CAT serves West Texas and Oklahoma from 17 locations.',
        medium: 'From Amarillo to Tulsa to Odessa, 17 locations across more than 100,000 square miles of West Texas and Oklahoma.',
        large: 'Warren U graduates are placed at one of 17 Warren CAT locations spanning 100,000+ square miles: Amarillo, Lubbock, Midland, Odessa, Oklahoma City, Tulsa, Abilene, San Angelo, and more.',
        overlay: 'Warren CAT\'s territory covers more than 100,000 square miles of West Texas and Oklahoma through 17 locations: Amarillo, Dalhart, Lubbock, Brownfield, Midland, Odessa, San Angelo, Abilene, Wichita Falls, Elk City, Oklahoma City, Norman, Enid, Tulsa, Tulsa West, Poteau, and Ardmore. Warren U students are placed at a Warren CAT location on completion, with up to $500 in relocation assistance to get there. Wherever you want to put down roots in the territory, there\'s a shop nearby.',
      },
      tags: ['warren-u'],
      targetRoles: ['student', 'veteran', 'parent', 'advisor', 'exploring'],
      targetInterests: ['warren-u', 'benefits', 'browsing'],
    },
    {
      id: 'o5',
      title: 'Family-Run for 40 Years',
      cardType: 'outcome',
      icon: 'heart-handshake',
      iconType: 'lucide',
      stat: '1985',
      url: 'https://warrencat.com/about-us/',
      description: {
        small: 'Family-owned since 1985, 40 years and counting.',
        medium: 'The Warren family bought its first Cat dealership in 1985. Forty years later it\'s still family-run, still people-first.',
        large: 'Warren CAT started in 1985 when the Warren family purchased Treanor Equipment in Abilene and Odessa. Four decades later, the no-quit attitude and family-run, people-first culture are still the difference.',
        overlay: 'Warren CAT was built on more than metal and machines. The Warren family bought its first Cat dealership, Treanor Equipment of Abilene and Odessa, in 1985, then merged in West Texas Equipment to form West Texas Cat, and grew into Oklahoma. The company celebrated its 40th anniversary in 2025, still family-run, still carrying the values that set it apart from day one: a no-quit attitude and a culture that puts people first: employees, customers, and partners.',
      },
      tags: ['browsing'],
      targetRoles: ['student', 'experienced-tech', 'veteran', 'advisor', 'parent', 'exploring'],
      targetInterests: ['browsing', 'benefits'],
    },
    {
      id: 'o6',
      title: 'State-of-the-Art Training Center',
      cardType: 'outcome',
      icon: 'school',
      iconType: 'lucide',
      stat: '2022',
      url: 'https://warrencat.com/careers/technician-development/warren-u/',
      description: {
        small: 'Warren U runs from a 2022-built training facility in Brownfield, TX.',
        medium: 'Warren CAT opened its state-of-the-art service and training center in Brownfield, Texas in 2022, home of Warren U.',
        large: 'Warren U isn\'t a corner of a warehouse, it\'s headquartered in a state-of-the-art service and training facility completed in Brownfield, Texas in 2022, purpose-built for hands-on technician training.',
        overlay: 'In 2022 Warren CAT completed a state-of-the-art service and training facility in Brownfield, Texas, the headquarters of Warren U Technical Institute. Students train hands-on with cutting-edge Cat machinery under experienced CAT trainers, in a building designed for exactly this. It\'s a physical signal of how seriously Warren CAT takes growing its own technicians.',
      },
      tags: ['warren-u'],
      targetRoles: ['student', 'advisor', 'parent', 'veteran', 'exploring'],
      targetInterests: ['warren-u', 'browsing'],
    },
    {
      id: 'o7',
      title: 'Up to $9,600 PBIP Tuition Help',
      cardType: 'outcome',
      icon: 'banknote',
      iconType: 'lucide',
      stat: '$9.6K',
      url: 'https://www.momentifyapp.com/brand/assets/warren-cat-pbip-flier.pdf',
      description: {
        small: 'Permian Basin interns get up to $9,600 in tuition reimbursement.',
        medium: 'The Permian Basin Internship Program pays diesel students and reimburses up to $9,600 in tuition.',
        large: 'For diesel students at partner technical schools in West Texas: the Permian Basin Internship pays you, reimburses up to $9,600 in tuition, and includes the $8,000 toolbox. A full-time technician role is waiting at the end.',
        overlay: 'The Permian Basin Internship Program is the West Texas fast track: diesel students at partner technical schools earn a paycheck, receive up to $9,600 in tuition reimbursement (based on individual costs), and get the $8,000 toolbox and tools, theirs to keep after the 24-month scholarship reimbursement period. Successful interns step straight into full-time Warren CAT technician roles keeping the Permian Basin\'s machines, engines, and power systems running.',
      },
      tags: ['pbip', 'benefits'],
      targetRoles: ['student', 'parent', 'advisor', 'exploring'],
      targetInterests: ['pbip', 'benefits'],
    },
    {
      id: 'o8',
      title: 'GI Bill Accepted for ThinkBIG',
      cardType: 'outcome',
      icon: 'shield-check',
      iconType: 'lucide',
      stat: 'GI Bill',
      url: 'https://warrencat.com/careers/veterans/',
      description: {
        small: 'GI Bill benefits apply to ThinkBIG at OSU Institute of Technology.',
        medium: 'Veterans can apply GI Bill benefits toward the ThinkBIG Technician Internship Program at OSUIT.',
        large: 'Your service transfers: GI Bill benefits can be applied at OSU Institute of Technology toward the Warren CAT ThinkBIG program, a paid, two-year pathway from military service to a Cat technician career.',
        overlay: 'Warren CAT actively recruits service members, veterans, and military spouses. The discipline, technical aptitude, and work ethic transfer directly to the shop floor. GI Bill benefits can be applied at OSU Institute of Technology toward the ThinkBIG Technician Internship Program, stacking your earned benefits on top of ThinkBIG\'s paid internships and tuition reimbursement. Warren CAT also supports the military community through its Folds of Honor partnership.',
      },
      tags: ['veteran-programs', 'thinkbig'],
      targetRoles: ['veteran', 'exploring'],
      targetInterests: ['veteran-programs', 'thinkbig', 'benefits'],
    },

    // ── Learn / Discover (9) — fliers, videos, careers hub ───────────
    // PDFs are the intake program fliers, self-hosted at absolute
    // momentifyapp.com URLs so they render inline in the overlay and
    // survive ingestion into Momentify Web. Videos are @warrencat
    // YouTube (render as scan-to-watch QR cards).
    {
      id: 'l1',
      title: 'Warren U Program Flier',
      cardType: 'learn',
      mediaType: 'pdf',
      icon: 'file-text',
      iconType: 'lucide',
      url: 'https://www.momentifyapp.com/brand/assets/warren-cat-warren-u-flier.pdf',
      description: {
        small: 'The official Warren U Technical Institute flier.',
        medium: 'The Warren U flier: one-year program, benefits, locations map, and recruiting contacts.',
        large: 'The official Warren U flier covers the one-year academy\'s benefits, placement, relocation assistance, the $8,000 tool package, housing reimbursement, plus the 17-location map and who to contact.',
        overlay: 'Everything Warren U on one flier: the one-year hands-on-plus-classroom format, placement at a Warren CAT location on completion, up to $500 relocation assistance, the $8,000 tool and toolbox package, housing reimbursement, and the paid internship with six-month performance raises. Includes the full 17-location territory map and direct contacts for recruiters Cody Cooksey and Bailey Nesmith. Read it right here, or save the card and it lands in your follow-up email.',
      },
      tags: ['warren-u'],
      targetRoles: ['student', 'veteran', 'advisor', 'parent', 'exploring'],
      targetInterests: ['warren-u', 'benefits'],
    },
    {
      id: 'l2',
      title: 'ThinkBIG Program Flier',
      cardType: 'learn',
      mediaType: 'pdf',
      icon: 'file-text',
      iconType: 'lucide',
      url: 'https://www.momentifyapp.com/brand/assets/warren-cat-thinkbig-flier.pdf',
      description: {
        small: 'The official ThinkBIG technician intern program flier.',
        medium: 'The ThinkBIG flier: the OSUIT two-year program, tuition reimbursement schedule, and GPA pay.',
        large: 'The ThinkBIG flier lays out the two-year OSUIT Cat Dealer Prep program: half campus instruction, half paid dealership internships, the $30,800 four-year tuition reimbursement schedule, and GPA pay.',
        overlay: 'The full ThinkBIG picture on one flier: the AED-accredited, two-year Cat Dealer Prep program at OSU Institute of Technology, half on campus learning the latest diagnostic and service procedures, half in paid internships at Warren CAT dealerships. Covers the $30,800 tuition reimbursement schedule ($4,000/$6,000/$8,400/$12,400 by year), GPA performance pay ($750-$1,500), in-state tuition for all participants, the $8,000 starting tool package, and financial aid resources. Read inline or save the card for your follow-up email.',
      },
      tags: ['thinkbig'],
      targetRoles: ['student', 'veteran', 'advisor', 'parent', 'exploring'],
      targetInterests: ['thinkbig', 'benefits'],
    },
    {
      id: 'l3',
      title: 'Permian Basin Internship Flier',
      cardType: 'learn',
      mediaType: 'pdf',
      icon: 'file-text',
      iconType: 'lucide',
      url: 'https://www.momentifyapp.com/brand/assets/warren-cat-pbip-flier.pdf',
      description: {
        small: 'The official Permian Basin Internship Program flier.',
        medium: 'The PBIP flier: who can apply, the benefits, and the pathway to a full-time technician role.',
        large: 'The PBIP flier covers the paid West Texas internship for diesel students: eligibility, the $8,000 toolbox, up to $9,600 tuition reimbursement, and the direct pathway to a full-time Warren CAT career.',
        overlay: 'The Permian Basin Internship Program flier in full: who can apply (diesel students at partner technical schools), what you get (paid internship, $8,000 toolbox and tools, up to $9,600 tuition reimbursement), and where it leads (full-time technician roles at Warren CAT on completion). Working on heavy machines, industrial engines, electric power generation, and rental equipment across West Texas. Read inline or save the card for the link.',
      },
      tags: ['pbip'],
      targetRoles: ['student', 'advisor', 'parent', 'exploring'],
      targetInterests: ['pbip', 'benefits'],
    },
    {
      id: 'l4',
      title: 'On the Job: Rental Technician',
      cardType: 'learn',
      mediaType: 'video',
      icon: 'video',
      iconType: 'lucide',
      url: 'https://www.youtube.com/watch?v=nlXmfCmk5ek',
      description: {
        small: 'Ride along with a Warren CAT rental technician.',
        medium: 'From the "On The Job With Jaron" series, a day in the life of a Warren CAT rental technician.',
        large: 'Warren CAT\'s "On The Job With Jaron" series shows the real work. This episode rides along with a rental technician, the machines, the shop, and what the day actually looks like.',
        overlay: 'The "On The Job With Jaron" series is Warren CAT\'s unfiltered look at the actual work, no stock footage, real employees. This episode follows a rental technician through the day: the equipment, the troubleshooting, the shop culture. If you\'re weighing a technician career, this is what the job looks like from inside. Scan the QR to watch, or save the card for the link in your follow-up email.',
      },
      tags: ['warren-u', 'pbip'],
      targetRoles: ['student', 'veteran', 'parent', 'exploring'],
      targetInterests: ['warren-u', 'pbip', 'thinkbig', 'browsing'],
    },
    {
      id: 'l5',
      title: 'On the Job: Field Service',
      cardType: 'learn',
      mediaType: 'video',
      icon: 'video',
      iconType: 'lucide',
      url: 'https://www.youtube.com/watch?v=9_-Bsfy2nS0',
      description: {
        small: 'What field service techs actually do all day.',
        medium: 'Ride along on a field service call: the trucks, the machines, and the problem-solving.',
        large: 'Field service is the frontier job: a fully rigged service truck, machines down on job sites, and a technician trusted to figure it out. This episode shows the real thing.',
        overlay: 'Field service technicians are Warren CAT\'s road warriors, dispatched in fully rigged service trucks to job sites across the territory when machines go down and every hour counts. This "On The Job With Jaron" episode captures the independence, the problem-solving, and the trust customers put in the tech who shows up. For anyone who\'d rather work everywhere than one bay. Scan the QR to watch now.',
      },
      tags: ['warren-u', 'thinkbig'],
      targetRoles: ['student', 'veteran', 'exploring'],
      targetInterests: ['warren-u', 'thinkbig', 'browsing'],
    },
    {
      id: 'l6',
      title: 'On the Job: President & CEO',
      cardType: 'learn',
      mediaType: 'video',
      icon: 'video',
      iconType: 'lucide',
      url: 'https://www.youtube.com/watch?v=WM66uPwDP1Y',
      description: {
        small: 'Jaron shadows the Warren CAT President and CEO.',
        medium: 'The same ride-along series goes all the way to the top: a day with Warren CAT\'s President and CEO.',
        large: 'The "On The Job" series goes to the corner office: Jaron shadows Warren CAT\'s President and CEO for a day, a window into the leadership and culture at the top of the family-run company.',
        overlay: 'A company\'s culture shows in whether the CEO will do the same ride-along as the rental tech, and Warren CAT\'s did. This episode shadows the President and CEO through a working day, showing how a family-run, 40-year-old Cat dealership is actually led. Good viewing for anyone (or any parent) asking what kind of company this is. Scan the QR to watch.',
      },
      tags: ['leadership', 'browsing'],
      targetRoles: ['student', 'experienced-tech', 'parent', 'advisor', 'exploring'],
      targetInterests: ['leadership', 'browsing'],
    },
    {
      id: 'l7',
      title: 'Team Warren CAT',
      cardType: 'learn',
      mediaType: 'video',
      icon: 'play-circle',
      iconType: 'lucide',
      url: 'https://www.youtube.com/watch?v=vZgovtyJ4f4',
      description: {
        small: 'The people of Warren CAT, in their own words.',
        medium: 'The Team Warren CAT film: the people, the culture, and the pride behind the yellow iron.',
        large: 'Team Warren CAT is the culture film: the technicians, drivers, and support teams across West Texas and Oklahoma who keep the machines and the communities running.',
        overlay: 'Team Warren CAT is the two-minute answer to "what\'s it like to work there?", the technicians, parts pros, heavy haulers, and support teams across 17 locations, in their own words. It\'s the family-run, no-quit culture the company was built on in 1985, on camera. Scan the QR to watch, or save the card for your follow-up email.',
      },
      tags: ['browsing', 'benefits'],
      targetRoles: ['student', 'experienced-tech', 'veteran', 'advisor', 'parent', 'exploring'],
      targetInterests: ['browsing', 'benefits'],
    },
    {
      id: 'l8',
      title: 'Tech Wars 2026',
      cardType: 'learn',
      mediaType: 'video',
      icon: 'trophy',
      iconType: 'lucide',
      url: 'https://www.youtube.com/watch?v=yGu38qnObgc',
      description: {
        small: 'Warren CAT technicians go head-to-head at Tech Wars.',
        medium: 'Tech Wars 2026, Warren CAT\'s technician skills competition, on video.',
        large: 'Tech Wars is where Warren CAT\'s best technicians compete head-to-head on diagnostics and speed, proof this trade has a competitive, high-skill ceiling worth chasing.',
        overlay: 'Tech Wars 2026 is Warren CAT\'s technician skills competition, the best in the territory going head-to-head on diagnostics, repairs, and speed. It\'s also the answer to anyone who thinks technician work is a fallback career: this trade has a skill ceiling worth competing over, and the company celebrates the people climbing it. Scan the QR to watch the highlights.',
      },
      tags: ['browsing', 'warren-u'],
      targetRoles: ['student', 'experienced-tech', 'veteran', 'exploring'],
      targetInterests: ['browsing', 'warren-u', 'thinkbig'],
    },
    {
      id: 'l9',
      title: 'Careers at Warren CAT',
      cardType: 'learn',
      mediaType: 'website',
      icon: 'briefcase',
      iconType: 'lucide',
      url: 'https://warrencat.com/careers/',
      description: {
        small: 'The full careers hub: openings, benefits, and programs.',
        medium: 'The Warren CAT careers hub, open positions, the benefits package, and every development program.',
        large: 'Everything in one place: current openings across 17 locations, the industry-leading benefits package, technician development programs, leadership development, and veteran resources.',
        overlay: 'The Warren CAT careers hub collects it all: current openings across the 17-location territory, the industry-leading benefits package for full-time employees, the technician development pathway (Warren U, ThinkBIG, PBIP, Technicians for the World), the Leadership Development Program, and veteran resources. Or skip the website and call the recruiting team directly at 866-292-7736. Save this card and the link comes to your inbox.',
      },
      tags: ['benefits', 'browsing'],
      targetRoles: ['student', 'experienced-tech', 'veteran', 'advisor', 'parent', 'exploring'],
      targetInterests: ['benefits', 'browsing'],
    },

    // ── Solutions / Programs (8) ─────────────────────────
    {
      id: 's1',
      title: 'Warren U Technical Institute',
      cardType: 'solution',
      icon: 'school',
      iconType: 'lucide',
      url: 'https://warrencat.com/careers/technician-development/warren-u/',
      description: {
        small: 'The one-year Cat technician academy in Brownfield, TX.',
        medium: 'Warren CAT\'s own one-year academy: hands-on plus classroom, ending with placement at a Warren CAT location.',
        large: 'Warren U is Warren CAT\'s premier technician program, one intensive year of hands-on and classroom training at the Brownfield facility, taught by experienced CAT trainers, ending in placement at one of 17 locations.',
        overlay: 'Warren U Technical Institute is the straightest line from "interested" to "employed Cat technician": one intensive year at the state-of-the-art Brownfield, Texas training center, combining classroom instruction with hands-on work on cutting-edge Cat machinery, taught by experienced CAT trainers. Graduates are placed at a Warren CAT location with relocation assistance, housing reimbursement, the $8,000 tool package, and a paid-internship wage with performance raises along the way. Built by Warren CAT because the demand for qualified Cat technicians outruns supply.',
      },
      tags: ['warren-u'],
      targetRoles: ['student', 'veteran', 'advisor', 'parent', 'exploring'],
      targetInterests: ['warren-u', 'benefits'],
    },
    {
      id: 's2',
      title: 'ThinkBIG @ OSU Institute of Technology',
      cardType: 'solution',
      icon: 'zap',
      iconType: 'lucide',
      url: 'https://warrencat.com/careers/technician-development/thinkbig-internship/',
      description: {
        small: 'The two-year Cat Dealer Prep degree with paid internships.',
        medium: 'ThinkBIG: a two-year AAS at OSUIT, half campus instruction, half paid Warren CAT internships.',
        large: 'ThinkBIG is the degree route: a two-year, AED-accredited Associate in Applied Science at OSU Institute of Technology, alternating campus instruction with paid internship rotations at Warren CAT dealerships.',
        overlay: 'ThinkBIG is Caterpillar\'s flagship dealer-technician program, delivered at OSU Institute of Technology: a two-year, AED-accredited Associate in Applied Science where students alternate between campus instruction on the latest Cat diagnostic and service procedures and paid internship rotations at Warren CAT dealerships. The financial stack is unmatched, in-state tuition for everyone, $8,000 tool package at the start, GPA pay up to $1,500 a semester, raises each rotation, and $30,800 in tuition reimbursement across your first four years of employment.',
      },
      tags: ['thinkbig'],
      targetRoles: ['student', 'veteran', 'advisor', 'parent', 'exploring'],
      targetInterests: ['thinkbig', 'benefits'],
    },
    {
      id: 's3',
      title: 'Permian Basin Internship Program',
      cardType: 'solution',
      icon: 'map-pin',
      iconType: 'lucide',
      url: 'https://www.momentifyapp.com/brand/assets/warren-cat-pbip-flier.pdf',
      description: {
        small: 'Paid West Texas internships for diesel students.',
        medium: 'A paid, career-focused internship for diesel students at partner technical schools in the Permian Basin.',
        large: 'PBIP puts diesel students to work in West Texas: paid internships with mentorship, the $8,000 toolbox, up to $9,600 tuition reimbursement, and a prepared path into full-time technician roles.',
        overlay: 'The Permian Basin Internship Program recruits diesel students already enrolled at partner technical schools and gives them the Warren CAT version of work-study: paid, mentored, real-world shop experience on heavy machines, industrial engines, power generation, and rental equipment across West Texas. The package includes the $8,000 toolbox and tools (yours after the 24-month reimbursement period) and up to $9,600 in tuition reimbursement, and successful interns are prepared for full-time technician roles on completion.',
      },
      tags: ['pbip'],
      targetRoles: ['student', 'advisor', 'parent', 'exploring'],
      targetInterests: ['pbip', 'benefits'],
    },
    {
      id: 's4',
      title: 'Technicians for the World (Free)',
      cardType: 'solution',
      icon: 'laptop',
      iconType: 'lucide',
      url: 'https://warrencat.com/careers/technician-development/technicians-for-the-world/',
      description: {
        small: 'Caterpillar\'s free 22-course online technician curriculum.',
        medium: 'T4W is a free, Caterpillar-sponsored online program, 22 courses from the Global Service Technician training curriculum.',
        large: 'Zero-cost entry point: Technicians for the World is Caterpillar\'s free online program, 22 courses covering diesel engines, electricity, hydraulics, and power train, drawn from Cat\'s own Global Service Technician training.',
        overlay: 'Not sure yet? Start free. Technicians for the World is a no-cost online program sponsored by Caterpillar for anyone exploring a service technician career, 22 courses pulled from Cat\'s own Global Service Technician training program, covering diesel engine basics, electricity, hydraulics, power train, and more. Finish it and you\'ll know whether this career fits, and you\'ll walk into Warren U, ThinkBIG, or a trainee role already ahead.',
      },
      tags: ['t4w'],
      targetRoles: ['student', 'experienced-tech', 'veteran', 'advisor', 'exploring'],
      targetInterests: ['t4w', 'browsing'],
    },
    {
      id: 's5',
      title: 'Technician Trainee Roles',
      cardType: 'solution',
      icon: 'wrench',
      iconType: 'lucide',
      url: 'https://warrencat.com/careers/technician-development/technician-trainees/',
      description: {
        small: 'Direct-hire trainee roles for hands-on learners.',
        medium: 'Skip the classroom-first route: technician trainee roles put you in a Warren CAT shop, learning on the job.',
        large: 'For hands-on learners ready to work now: technician trainee roles hire you into a Warren CAT shop directly, developing your skills on the job across construction, ag, diesel engine, material handling, and commercial engine work.',
        overlay: 'Not every path runs through a classroom. Warren CAT\'s technician trainee roles hire motivated people directly into the shop, where you develop diagnostic and repair skills on the job across construction equipment, agricultural equipment, heavy diesel engines, material handling, and commercial engines. Depending on your experience level, Warren CAT matches you to the right development track, and the careers in every one of those fields are rewarding, challenging, and in demand.',
      },
      tags: ['warren-u', 't4w'],
      targetRoles: ['student', 'experienced-tech', 'veteran', 'exploring'],
      targetInterests: ['warren-u', 't4w', 'benefits'],
    },
    {
      id: 's6',
      title: 'Leadership Development Program',
      cardType: 'solution',
      icon: 'trending-up',
      iconType: 'lucide',
      url: 'https://warrencat.com/careers/leadership-development/',
      description: {
        small: 'A 12-month rotational program for future leaders.',
        medium: 'The 12-month LDP rotates select employees through multiple business areas, building leaders from within.',
        large: 'The Leadership Development Program is Warren CAT\'s grow-from-within engine: 12 months of on-the-job rotations across business divisions, ending with placement, participants call it a career jumpstart.',
        overlay: 'Warren CAT promotes from within, and the Leadership Development Program is the engine: select employees spend 12 months rotating through multiple areas of the business, sales, service, parts, operations, building a holistic view of how the dealership works and relationships across every division, before being placed at the end of the program. Alumni describe it as a career jumpstart that pairs leadership development with long-term growth. The ceiling here isn\'t Tech I, it\'s leadership.',
      },
      tags: ['leadership'],
      targetRoles: ['student', 'experienced-tech', 'veteran', 'exploring'],
      targetInterests: ['leadership', 'browsing'],
    },
    {
      id: 's7',
      title: 'Veterans & Folds of Honor',
      cardType: 'solution',
      icon: 'shield',
      iconType: 'lucide',
      url: 'https://warrencat.com/careers/veterans/',
      description: {
        small: 'Career pathways built for veterans and military families.',
        medium: 'Warren CAT recruits veterans and military spouses, GI Bill applies to ThinkBIG, and Folds of Honor is a company cause.',
        large: 'Military service translates here: Warren CAT actively recruits veterans and military spouses, accepts GI Bill benefits toward ThinkBIG at OSUIT, and backs the military community through Folds of Honor.',
        overlay: 'Warren CAT\'s core values, discipline, excellence, respect, no-quit, map straight from military service, and the company recruits accordingly. Veterans and military spouses get a dedicated pathway: GI Bill benefits apply toward the ThinkBIG Technician Internship at OSU Institute of Technology, stacking earned benefits on top of the program\'s pay and tuition reimbursement. Beyond hiring, Warren CAT supports the military community through its Folds of Honor partnership, funding scholarships for the families of fallen and disabled service members.',
      },
      tags: ['veteran-programs'],
      targetRoles: ['veteran', 'exploring'],
      targetInterests: ['veteran-programs', 'thinkbig', 'benefits'],
    },
    {
      id: 's8',
      title: 'Open Positions & Benefits',
      cardType: 'solution',
      icon: 'briefcase',
      iconType: 'lucide',
      url: 'https://warrencat.com/careers/',
      description: {
        small: 'Browse openings and the full-time benefits package.',
        medium: 'Current openings across 17 locations, plus the industry-leading benefits package for full-time employees.',
        large: 'Ready now? Browse current openings across all 17 Warren CAT locations and the industry-leading benefits package, or call the recruiting team directly at 866-292-7736.',
        overlay: 'If you\'re ready to apply rather than train, start here: current openings across all 17 Warren CAT locations in West Texas and Oklahoma, technicians, parts, operations, drivers, and more, plus the industry-leading benefits package for full-time employees. The recruiting team is a phone call away at 866-292-7736, or save this card and the link arrives in your follow-up email with the rest of your picks.',
      },
      tags: ['benefits'],
      targetRoles: ['student', 'experienced-tech', 'veteran', 'exploring'],
      targetInterests: ['benefits', 'browsing'],
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
