/* ═══════════════════════════════════════════════════════════════
   GTM Content Builder — Prompt Template Library
   ═══════════════════════════════════════════════════════════════ */

const verticalLabels: Record<string, string> = {
  // Channel Partners (industry-agnostic)
  "channel-partners": "Trade Show & Exhibit Channel Partners",
  // Trade Shows
  "heavy-equipment": "Heavy Equipment",
  "energy-infrastructure": "Energy, Infrastructure & Power",
  "aerospace-aviation": "Aerospace & Aviation",
  // Recruiting
  "tech-recruiting": "Technical Recruiting",
  "campus-recruiting": "Campus & University Recruiting",
  "skilled-trades": "Skilled Trades Recruiting",
  // Field Sales
  "territory-sales": "Territory Sales",
  "enterprise-sales": "Enterprise Sales",
  "channel-sales": "Channel & Distributor Sales",
  // Facilities
  "corporate-facilities": "Corporate Facilities",
  "manufacturing-facilities": "Manufacturing Facilities",
  // Events & Venues
  "sports-entertainment": "Sports & Entertainment",
  "conference-venues": "Conference & Convention Venues",
}

const verticalICPs: Record<string, string> = {
  // Channel Partners (industry-agnostic)
  "channel-partners":
    "VP of Business Development, Director of Client Services, or Managing Partner at a trade show agency, exhibit house, or conference management company (Freeman, The Trade Group, etc.) that manages events across multiple industries",
  // Trade Shows
  "heavy-equipment":
    "VP of Marketing or VP of Sales at an OEM, large dealer group, or equipment dealer ($50M+ revenue, exhibits at 5+ shows per year)",
  "energy-infrastructure":
    "Marketing Director, Communications Lead, or VP of Marketing at a utility, grid operator, EPC contractor, data center operator, or power systems manufacturer",
  "aerospace-aviation":
    "Defense Marketing Lead, Business Development Director, or Government Relations Manager at a defense OEM, systems integrator, or government contractor",
  // Recruiting
  "tech-recruiting":
    "VP of Talent Acquisition, Recruiting Director, or Employer Brand Manager at a technology company or staffing firm attending career fairs and recruiting events",
  "campus-recruiting":
    "University Relations Manager, Campus Recruiting Lead, or Early Talent Director running on-campus career events and info sessions",
  "skilled-trades":
    "Recruiting Manager, HR Director, or Workforce Development Lead at a manufacturing, construction, or trades company hosting hiring events and open interviews",
  // Field Sales
  "territory-sales":
    "VP of Sales, Regional Sales Director, or Territory Manager running field demos, lunch-and-learns, and distributor events",
  "enterprise-sales":
    "Enterprise Account Executive, Strategic Sales Director, or CRO managing executive briefing centers, roadshows, and customer advisory boards",
  "channel-sales":
    "Channel Sales Director, Partner Marketing Manager, or Distribution VP managing dealer events, partner summits, and co-sell programs",
  // Facilities
  "corporate-facilities":
    "Facilities Director, Workplace Experience Manager, or VP of Real Estate & Facilities managing visitor experiences and corporate event spaces",
  "manufacturing-facilities":
    "Plant Manager, Operations Director, or EHS Manager running facility tours, safety orientations, and plant-floor visitor programs",
  // Events & Venues
  "sports-entertainment":
    "VP of Fan Experience, Venue Operations Director, or Chief Revenue Officer at a sports franchise, arena, or entertainment venue managing game-day and concert engagement",
  "conference-venues":
    "Convention Center GM, Director of Event Services, or VP of Sales at a hotel or conference venue managing exhibitor and attendee experiences",
}

type BuilderParams = {
  solution: string
  vertical: string
  motion: string
  contentType: string
  /**
   * Optional primary-persona id from solutionPersonas. When set (and not
   * "auto"), overrides the vertical-derived icpTitle so the generated
   * content speaks directly to that persona's mandate, success metrics,
   * and pain points. "auto" or undefined falls back to the existing
   * vertical → solution-default ICP resolution.
   */
  persona?: string
  additionalContext?: string
  competitor?: string
}

/**
 * Per-solution primary personas. Each entry provides:
 *   - id: stable key persisted in session/state
 *   - label: dropdown display text
 *   - profile: rich buyer description that overrides icpTitle when this
 *     persona is selected. Should name the title, mandate, primary
 *     success metric, and the pain point Momentify solves for them.
 *
 * The first option for every solution is "auto" — keeps the existing
 * vertical-driven ICP resolution so the dropdown is non-breaking.
 */
export interface PersonaOption {
  id: string
  label: string
  profile: string
  /**
   * Sharp one-line voice cue for the persona — what they care about, how
   * they read content. Injected into the prompt so the tone calibrates
   * (e.g. CFOs want unit economics, ops want runbooks, marketing wants
   * narrative + proof).
   */
  voice: string
}

export const solutionPersonas: Record<string, PersonaOption[]> = {
  general: [
    { id: "auto", label: "Auto (default)", profile: "", voice: "" },
    { id: "cmo",
      label: "Chief Marketing Officer",
      profile: "CMO accountable for pipeline contribution from every in-person motion across the company - trade shows, field events, recruiting, facility tours, sponsorships - who is being asked by the CFO to defend in-person spend with a single ROI standard",
      voice: "Speaks in pipeline contribution, attribution, and brand equity. Tired of vanity metrics; wants one ROX standard that proves in-person budget across the company." },
    { id: "cro",
      label: "Chief Revenue Officer",
      profile: "CRO who owns the number across direct sales, channel, and field motions, and who treats every in-person interaction (booth, dinner, demo, site visit) as a top-of-funnel revenue lever they need to measure and compound",
      voice: "Hyper-focused on revenue conversion velocity. Cares about meetings booked, pipeline created, and forecast accuracy. Allergic to soft metrics." },
    { id: "coo",
      label: "Chief Operating Officer",
      profile: "COO running cross-functional in-person operations - field reps, recruiters, facility staff, event teams - who needs a unified operating system so the company stops paying five vendors for five disconnected toolchains",
      voice: "Wants efficiency, unification, fewer point tools. Speaks in headcount leverage, vendor consolidation, time-to-value." },
    { id: "vp-revops",
      label: "VP RevOps",
      profile: "VP RevOps responsible for the data, attribution, and system-of-record across every revenue motion, who is tasked with rolling in-person engagement data into the same model as digital marketing and SDR sequences",
      voice: "Data-first. Cares about attribution model integrity, source-of-truth integration, and clean handoffs to Salesforce/HubSpot." },
    { id: "vp-demandgen",
      label: "VP Demand Generation",
      profile: "VP Demand Gen who allocates spend across digital and in-person and wants every event, field activation, or sponsorship measured with the same MQL/SQL/pipeline rigor as paid digital",
      voice: "Channel-mix mindset. Compares CAC across digital and in-person; wants every dollar trackable to pipeline." },
  ],
  "trade-shows": [
    { id: "auto", label: "Auto (default)", profile: "", voice: "" },
    { id: "vp-marketing",
      label: "VP / Director of Marketing",
      profile: "VP or Director of Marketing accountable for booth ROI across 5+ industry shows annually, under pressure to defend six- or seven-figure event budgets to a CFO who only sees a hotel-and-travel line item",
      voice: "Narrative-driven, brand-conscious; needs hard numbers to defend spend. Cares about story + proof." },
    { id: "trade-show-director",
      label: "Director of Trade Shows / Events",
      profile: "Director of Trade Shows or Events who owns the calendar, the booth build, and the post-show wrap-up - the person who has to translate badge scans and stack-ranked lists into something Sales will actually follow up on",
      voice: "Operational, deadline-driven. Speaks in booths, badges, deliverables, post-show recap PDFs. Wants automation, not more spreadsheets." },
    { id: "field-marketing-manager",
      label: "Field Marketing Manager",
      profile: "Field Marketing Manager who runs a regional event portfolio (regional shows, customer dinners, partner pavilions) and is judged on number of qualified meetings booked per event",
      voice: "Tactical and metrics-focused. Cares about meetings booked, sales acceptance rate, and per-event payback." },
    { id: "demand-gen-lead",
      label: "Demand Gen Lead",
      profile: "Demand Gen Lead who owns the trade-show line in the marketing-mix model and needs every show treated as a measurable channel - cost per MQL, cost per SQL, contribution to pipeline - alongside paid search and display",
      voice: "CAC-and-conversion mindset. Wants per-show MQL/SQL economics directly comparable to digital channels." },
    { id: "booth-ops-manager",
      label: "Booth Operations Manager",
      profile: "Booth Operations Manager or Exhibit Manager responsible for the on-floor experience - staffing, demo flow, attendee qualification - who feels the gap between the lead list they hand to Sales and the meetings that actually get booked",
      voice: "Hands-on; cares about staff productivity, demo throughput, and lead quality at the moment of capture." },
  ],
  recruiting: [
    { id: "auto", label: "Auto (default)", profile: "", voice: "" },
    { id: "vp-talent",
      label: "VP of Talent Acquisition",
      profile: "VP of Talent Acquisition accountable for both campus and experienced-hire pipelines, who treats career fairs, university visits, and recruiting events as a measurable top-of-funnel for offer-acceptance rate",
      voice: "Funnel-minded. Speaks in source-of-hire, time-to-fill, offer-acceptance, and quality-of-hire." },
    { id: "recruiting-director",
      label: "Recruiting Director",
      profile: "Recruiting Director running an annual calendar of campus visits, hackathons, and industry meetups, judged on yield - did the candidates we engaged at the event actually convert to interviews and offers",
      voice: "Yield-obsessed. Wants every event tied to interview-to-offer conversion. Tired of badge scans that go nowhere." },
    { id: "university-recruiting-lead",
      label: "University Recruiting Lead",
      profile: "University Recruiting Lead managing relationships with 10+ target schools, on-campus brand presence, and intern conversion, who needs to prove which school visits and info sessions actually produce hires",
      voice: "Relationship-driven and brand-focused on campus. Cares about school ROI and intern-to-FT conversion." },
    { id: "employer-brand-manager",
      label: "Employer Brand Manager",
      profile: "Employer Brand Manager responsible for how the company shows up at career fairs and recruiting events, accountable for application volume, candidate sentiment, and the gap between brand impression and offer acceptance",
      voice: "Story + sentiment. Cares about candidate experience, brand differentiation, and Glassdoor-style perception." },
    { id: "campus-recruiter",
      label: "Campus / Field Recruiter",
      profile: "Campus or field recruiter who works the booths and table events directly, knows exactly which conversations turned into interviews, and is frustrated that the system of record drops 80% of the people they actually met",
      voice: "On-the-ground, conversational; values speed-to-followup and a tool that captures meaningful conversations, not just emails." },
  ],
  "field-sales": [
    { id: "auto", label: "Auto (default)", profile: "", voice: "" },
    { id: "vp-sales",
      label: "VP of Sales",
      profile: "VP of Sales who runs a 10+ rep field organization, accountable to the CRO for in-person meeting velocity and forecast accuracy, frustrated by the gap between rep-claimed activity and CRM reality",
      voice: "Revenue and forecast first. Cares about meeting volume, pipeline coverage, and rep-level attainment." },
    { id: "regional-sales-director",
      label: "Regional Sales Director",
      profile: "Regional Sales Director managing reps across territories, judged on quarterly attainment, who needs visibility into which on-site visits and field demos actually moved deals forward",
      voice: "Territory-level optics. Wants per-rep, per-account, per-visit ROX so coaching is grounded in evidence." },
    { id: "sales-enablement-lead",
      label: "Sales Enablement Lead",
      profile: "Sales Enablement Lead arming reps for in-person customer visits with playbooks, demo content, and follow-up cadences, accountable for post-visit follow-through rate",
      voice: "Playbook + content. Speaks in messaging adoption, content usage, and ramp time." },
    { id: "sales-ops-manager",
      label: "Sales Operations Manager",
      profile: "Sales Operations Manager who owns CRM hygiene, activity reporting, and the rev-tech stack, tasked with closing the loop between field activity and Salesforce so leadership stops guessing",
      voice: "Process and data integrity. Cares about CRM hygiene, automation coverage, and one source of truth." },
    { id: "channel-sales-director",
      label: "Channel Sales Director",
      profile: "Channel Sales Director running distributor and partner programs, accountable for partner-attached pipeline, who needs to measure and improve in-person partner enablement events and ride-alongs",
      voice: "Partner-leverage mindset. Cares about partner-sourced pipeline and the ride-along multiplier." },
  ],
  facilities: [
    { id: "auto", label: "Auto (default)", profile: "", voice: "" },
    { id: "facilities-director",
      label: "Facilities Director",
      profile: "Facilities Director responsible for showrooms, customer experience centers, and visitor-facing spaces, accountable for visitor throughput, NPS, and the conversion from a facility tour to a real business outcome",
      voice: "Operational + experiential. Speaks in throughput, NPS, and turning physical space into pipeline." },
    { id: "showroom-manager",
      label: "Showroom Manager",
      profile: "Showroom or Experience Center Manager who runs the day-to-day visitor program, escorts buyers through the space, and is asked to prove the showroom drives deals - not just impressions",
      voice: "Hospitality + outcomes. Cares about visit quality, post-visit conversion, and making every tour count." },
    { id: "vp-real-estate",
      label: "VP Real Estate & Facilities",
      profile: "VP of Real Estate & Facilities who is being asked to justify the cost-per-square-foot of customer-facing experience space against measurable revenue contribution",
      voice: "Capital-allocation lens. Wants $/sqft tied to pipeline contribution; defends real-estate spend to CFO." },
    { id: "visitor-experience-manager",
      label: "Visitor Experience Manager",
      profile: "Visitor Experience Manager who curates the customer journey through the building - check-in, tours, demos, hospitality - and is judged on visitor satisfaction and the depth of post-visit engagement",
      voice: "Journey-design mindset. Cares about every touchpoint, sentiment, and the story buyers tell after they leave." },
    { id: "cx-director",
      label: "Customer Experience Director",
      profile: "Customer Experience Director treating the physical facility as a key CX touchpoint in a multi-channel customer journey, accountable for visitor sentiment data feeding the broader CX program",
      voice: "Cross-channel CX. Wants facility data feeding the same CX dashboard as digital and support touchpoints." },
  ],
  "events-venues": [
    { id: "auto", label: "Auto (default)", profile: "", voice: "" },
    { id: "vp-fan-experience",
      label: "VP of Fan Experience",
      profile: "VP of Fan Experience at a sports franchise or arena, accountable for fan satisfaction, in-venue spend per fan, and the data depth of the fan profile after every game or event",
      voice: "Fan-first. Speaks in NPS, repeat attendance, in-venue spend, and depth of fan profile." },
    { id: "venue-ops-director",
      label: "Venue Operations Director",
      profile: "Venue Operations Director running gameday or event-day operations across multiple events per week, judged on throughput at gates, concourse, and concessions, and on incident-free execution",
      voice: "Throughput + execution. Cares about queue times, gate flow, and operational reliability." },
    { id: "venue-cro",
      label: "CRO / Chief Revenue Officer",
      profile: "CRO at a sports franchise or live-event venue, accountable for sponsorship revenue, premium-suite renewals, and ticket revenue, who needs activation data to defend sponsor pricing and renew accounts",
      voice: "Sponsorship and renewals. Cares about sponsor-activation proof and premium account retention." },
    { id: "sponsorship-director",
      label: "Sponsorship / Partnership Director",
      profile: "Sponsorship Director managing brand partnerships at a venue, judged on partner renewals and upsells, who needs in-venue activation data (engagement, dwell, opt-ins) to show partners the value they're paying for",
      voice: "Partner-narrative. Wants activation metrics that justify renewal pricing and upsell asks." },
    { id: "guest-services-manager",
      label: "Guest Services / Hospitality Manager",
      profile: "Guest Services or Hospitality Manager responsible for the front-line fan and guest experience, accountable for resolving issues in real time and building the post-event sentiment record",
      voice: "Service-recovery + sentiment. Cares about resolving issues live and capturing the post-event story." },
  ],
}

/**
 * Resolve a persona id (with the solution as fallback context) to its full
 * PersonaOption, or null if "auto" / unknown.
 */
function resolvePersona(solution: string, personaId?: string): PersonaOption | null {
  if (!personaId || personaId === "auto") return null
  const list = solutionPersonas[solution]
  if (!list) return null
  return list.find((p) => p.id === personaId) ?? null
}

/**
 * Per-solution guidance that overrides the system prompt's trade-show
 * defaults. Prepended to every user prompt branch in buildUserMessage so
 * Claude reorients to the correct domain BEFORE reading the rest of the
 * prompt (which may still reference "events" / "ROX" generically).
 *
 * Each block must (a) name the activities and audience for this solution,
 * (b) name the proprietary capability the buyer is evaluating, and (c)
 * explicitly forbid the wrong domain language.
 */
const solutionGuidance: Record<string, string> = {
  general: `===== SOLUTION DOMAIN: GENERAL MOMENTIFY (CROSS-PILLAR) =====
This is platform-level / cross-pillar content. Do NOT lock into a single solution domain (trade shows, recruiting, field sales, facilities, or venues). The audience is a mixed buyer who could deploy Momentify across any of those contexts.

Lead with the platform itself, not a single use case. Anchor in:
- The four-step flow: Web (configure) -> Explorer (capture during the moment) -> Intelligence (real-time ROX scoring + AI summaries) -> Engage (automated CRM/ATS routing).
- The hero positioning: "The operating system for in-person engagement. Momentify converts attention into outcomes your team can measure and prove."
- ROX (Return on Experience) as the proprietary measurement standard, scored across four equally-weighted dimensions: Lead Capture Efficiency, Engagement Quality, Follow-Up Speed, Conversion Effectiveness. Tier ranges: 0-39 Critical Gap, 40-69 Needs Optimization, 70-84 High ROX, 85-100 Elite ROX.
- Cross-pillar proof points: $50B annual US in-person event spend, 10,000+ qualified leads from 50 events in 18 months, 65%+ qualification rate vs. 20% industry baseline, $411M potential pipeline value, 92% YoY lead growth in customer cases.

Audience: cross-pillar buyers - typically a CMO, CRO, COO, or Head of Revenue Operations whose remit spans multiple in-person motions (some combination of trade shows, recruiting, field sales, facility tours, or venue activations) and who needs ONE measurement standard across all of them.

Avoid pillar-specific vocabulary that boxes the platform into a single use case. If you need an example, name multiple contexts side-by-side ("at a booth, on a job site, or in a showroom") so the platform's universality stays visible. ROX framing is fully appropriate.`,

  "trade-shows": `===== SOLUTION DOMAIN: TRADE SHOWS & EXHIBITS =====
The buyer runs in-person trade show and exhibit programs. Activities you can reference: booths, exhibits, show floors, exhibitor lounges, demo stations, booth staff, post-show follow-up, lead capture at the booth, badge scanning, exhibit ROI.
Audience: VPs of Marketing, Event Managers, Trade Show Managers, Exhibit Directors, Marketing Operations leaders responsible for the trade show portfolio.
Momentify capability to lead with: Booth Mode - the engagement intelligence layer that sits above existing exhibit tools (Cvent, badge scanners, lead retrieval apps) and turns booth interactions into measurable ROX.
ROX framing is fully appropriate. Use trade-show vocabulary fluently. Speak to the buyer's frustration that booth investment isn't measurable today.`,

  recruiting: `===== SOLUTION DOMAIN: TECHNICAL RECRUITING =====
The buyer runs recruiting events: career fairs, on-campus visits, hiring expos, info sessions, hackathons, open houses, employer-brand activations. NOT trade shows. NOT field sales visits.
Activities you can reference: career fair booths, recruiter conversations, candidate qualification, follow-up to qualified candidates, employer brand storytelling, candidate-experience scoring.
Audience: VPs of Talent Acquisition, Recruiting Directors, Employer Brand Managers, University Relations leaders.
Momentify capability to lead with: candidate engagement intelligence - structured capture of every recruiter-candidate interaction with role, interest signal, and follow-up routing.
Frame ROX as Return on Recruiting Experience: capture quality, conversation depth, follow-up speed to candidate, offer-acceptance rate. Do NOT use "exhibitor", "booth ROI", "post-show" framing - this buyer cares about candidate pipeline, not exhibit programs.`,

  "field-sales": `===== SOLUTION DOMAIN: FIELD SALES ENABLEMENT (ON-THE-GO MODE) =====
THIS IS NOT TRADE SHOWS. THIS IS NOT EVENT MARKETING.
The buyer runs a field sales operation: territory reps making in-person customer visits, lunch-and-learns at customer offices, dealer / distributor visits, job site walks, demo days at customer facilities, ride-alongs, route-based dealer territory coverage.

Momentify capability to lead with: ON-THE-GO MODE - the mobile field rep experience that:
- Captures customer conversations on any device, online OR offline (low-connectivity job sites, oil rigs, equipment yards, basements, remote facilities)
- Auto-syncs to the CRM the moment connectivity returns, so reps don't lose visit context to the 3-day CRM lag
- Delivers role-based content (battle cards, spec sheets, pricing tools, video demos) at the point of conversation, not back at the laptop
- Triggers post-visit follow-up automatically based on what the customer engaged with during the meeting
- Surfaces which content, reps, regions, and customer segments are actually moving deals forward

Audience: VPs of Sales, Regional Sales Directors, Sales Enablement leaders, Territory Managers, Channel Sales Directors, CROs at companies with 10+ field reps. Their pain: 65% of field content goes unused, 3+ days average lag from visit to CRM, no visibility into which conversations move pipeline.

Frame ROX (Return on Experience) as: capture rate of meaningful field interactions, content engagement during visits, follow-up speed from visit to first CRM action, conversion of visit to opportunity.

FORBIDDEN LANGUAGE: do not use "trade show", "exhibit", "booth", "post-show", "show floor", "in-booth", "exhibitor", "career fair", "candidate", "venue", "ticket", "fan". This is field sales. The setting is the customer's parking lot, plant floor, conference room, dealer showroom, or job site - NOT a trade show booth.`,

  facilities: `===== SOLUTION DOMAIN: FACILITIES (BUYER EXPERIENCE) =====
The buyer manages physical facilities where customers visit: showrooms, demo floors, training centers, executive briefing centers, dealer experience centers, plant tours.
Activities you can reference: facility tours, demo station visits, showroom walks, training-room engagement, signed-in visitor sessions, zone-by-zone customer interactions, post-visit follow-up.
Audience: Facilities Directors, Workplace Experience Managers, Showroom Managers, Plant Operations leaders, EHS Managers running facility tours.
Momentify capability to lead with: zone-level engagement tracking across the facility, with consistent capture and content delivery at every touchpoint.
Frame ROX as Return on (facility) Experience: which zones drive engagement, how visits convert to pipeline, which content matters at each station. Do NOT use trade-show or career-fair framing - the facility is the venue, the customer comes to YOU.`,

  "events-venues": `===== SOLUTION DOMAIN: EVENTS & VENUES (FAN EXPERIENCE) =====
The buyer runs sports venues, arenas, entertainment venues, conference centers, or similar live-event spaces. The audience is FANS or GUESTS, not B2B exhibit attendees.
Activities you can reference: game day, concert night, sponsor activations, fan zones, suite engagement, gate-to-seat experience, VIP touchpoints, between-innings/intermission activations, post-event guest follow-up.
Audience: VPs of Fan Experience, Venue Operations Directors, Sponsorship Sales leaders, CROs at sports franchises, arenas, and entertainment venues.
Momentify capability to lead with: fan-engagement intelligence - sponsor accountability, guest interaction tracking, follow-up clarity in one platform that sits above ticketing.
Frame ROX as Return on (fan) Experience: sponsor activation ROI, fan-touchpoint depth, guest data quality. Do NOT use "exhibitor", "booth", "career fair", "field rep" framing - the buyer monetizes fan attention, not exhibit programs.`,
}

/**
 * Per-solution default ICP for the "general / All Industries" vertical.
 * Used when vertical === "general" or when verticalICPs has no entry,
 * so each solution's "General" pick yields a buyer description that
 * matches the solution domain rather than falling back to the trade-show-
 * leaning generic.
 */
const solutionDefaultICPs: Record<string, string> = {
  general:
    "Cross-pillar revenue or operations leader (CMO, CRO, COO, VP RevOps) at a B2B company whose budget spans multiple in-person motions - any combination of trade shows, recruiting events, field sales visits, facility tours, or venue activations - and who needs one measurement standard across all of them",
  "trade-shows":
    "VP of Marketing, Director of Trade Shows, or Event Manager at a B2B company that exhibits at 5+ industry shows per year and is accountable for booth ROI",
  recruiting:
    "VP of Talent Acquisition, Recruiting Director, or Employer Brand Manager running on-campus and career-fair recruiting programs",
  "field-sales":
    "VP of Sales, Regional Sales Director, or Sales Enablement Lead at a company with 10+ field reps making in-person customer visits across territories",
  facilities:
    "Facilities Director, Showroom Manager, or VP of Real Estate & Facilities running customer-facing visitor experiences",
  "events-venues":
    "VP of Fan Experience, Venue Operations Director, or CRO at a sports franchise, arena, or live-event venue",
}

const solutionPalettes: Record<string, { name: string; primary: string; light: string; dark: string; heroGrad: string; lightBg: string }> = {
  general: { name: "Momentify", primary: "#1A56DB", light: "#0CF4DF", dark: "#061341", heroGrad: "linear-gradient(135deg, #061341, #1A56DB 55%, #0CF4DF)", lightBg: "linear-gradient(145deg, #F4F5F8, #ECEFF7)" },
  "trade-shows": { name: "Violet", primary: "#6B21D4", light: "#9B5FE8", dark: "#2D0770", heroGrad: "linear-gradient(135deg, #2D0770, #4A0FA8 55%, #9B5FE8)", lightBg: "linear-gradient(145deg, #F8F4FF, #EDE6FF)" },
  recruiting: { name: "Teal", primary: "#00BBA5", light: "#5FD9C2", dark: "#040E28", heroGrad: "linear-gradient(135deg, #040E28, #1A8A76 55%, #5FD9C2)", lightBg: "linear-gradient(145deg, #E8FDF8, #F0FFFC)" },
  "field-sales": { name: "Amber", primary: "#C48A00", light: "#F2B33D", dark: "#1A1000", heroGrad: "linear-gradient(135deg, #1A1000, #8A5E00 55%, #F2B33D)", lightBg: "linear-gradient(145deg, #FFFAEE, #FFF5E0)" },
  facilities: { name: "Indigo", primary: "#3A2073", light: "#5B4499", dark: "#0D0820", heroGrad: "linear-gradient(135deg, #0D0820, #3A2073 55%, #5B4499)", lightBg: "linear-gradient(145deg, #EEF0FF, #F4F5FF)" },
  "events-venues": { name: "Crimson", primary: "#8F200A", light: "#F25E3D", dark: "#1A0400", heroGrad: "linear-gradient(135deg, #1A0400, #8F200A 55%, #F25E3D)", lightBg: "linear-gradient(145deg, #FFF2EE, #FFF7F5)" },
}

export function buildUserMessage(params: BuilderParams): string {
  const { solution, vertical, motion, contentType, persona, additionalContext, competitor } = params
  const vertLabel = verticalLabels[vertical] || vertical
  const motionLabel = motion === "direct" ? "Direct to Customer" : "Channel Partners"
  // Persona override: when a primary persona is selected, its profile
  // becomes the icpTitle so every prompt branch speaks directly to that
  // buyer. "auto" / unset falls through to the existing vertical → solution-
  // default ICP resolution.
  const personaOpt = resolvePersona(solution, persona)
  // ICP resolution: vertical-specific takes priority, but the shared
  // "general" id (or any unknown vertical) falls through to the per-
  // solution default so trade-show framing doesn't leak into other
  // solutions when the user picks "General / All Industries".
  const verticalSpecificICP =
    vertical && vertical !== "general" ? verticalICPs[vertical] : undefined
  const icpTitle =
    personaOpt?.profile ||
    verticalSpecificICP ||
    solutionDefaultICPs[solution] ||
    verticalICPs[vertical] ||
    "decision-maker"
  // Persona voice cue is appended as an explicit tone/voice instruction
  // so Claude calibrates word choice and emphasis to the persona, not
  // just the title.
  const personaVoiceBlock = personaOpt?.voice
    ? `\n\nPERSONA VOICE (calibrate tone, vocabulary, and what the reader cares about to this): ${personaOpt.voice}`
    : ""
  // Solution domain override block - prepended to every prompt branch so
  // Claude reorients to field-sales / recruiting / facilities / etc. and
  // does not silently inherit the trade-show framing from the system
  // prompt or from event-flavored phrases later in the user prompt.
  const guidance = solutionGuidance[solution] || ""
  const extraContext = additionalContext ? `\n\nSPECIFIC CONTEXT (incorporate this into every section of the output): ${additionalContext}` : ""
  // personaVoiceBlock + extraContext combine into the existing "extra"
  // slot every prompt branch already concatenates, so the persona's voice
  // cue lands in every content type without touching each switch case.
  const extra = `${personaVoiceBlock}${extraContext}`
  const palette = solutionPalettes[solution]

  // Each branch returns the body of the prompt; the solution guidance
  // block is prepended to whatever the branch returns, so we only need
  // to maintain it in one place.
  const body: string = (() => {
  switch (contentType) {
    case "cold-emails":
      return `Write a 3-touch cold outreach email sequence for Momentify.

Target:
- Solution: ${solution}
- GTM Motion: ${motionLabel}
- Vertical: ${vertLabel}
- Buyer: ${icpTitle}${extra}

Sequence rules:
- Touch 1 (Day 0): Lead with the industry pain. No product pitch. Soft CTA only (ROX Audit or ROX Calculator link).
- Touch 2 (Day 4): Reference a relevant proof point. Move toward a call or demo. CTA is a 20-minute conversation.
- Touch 3 (Day 9): Short, human, no pressure. Final soft CTA. Under 80 words for the body.

Each email format:
SUBJECT: [subject line]
BODY: [email body]
CTA: [call to action]

Reference the prospect's likely ROX gap. Position ROX as the lens through which they should evaluate their current event performance.

Rules: no em dashes, no buzzwords, under 150 words per email, sound like a real person wrote it.`

    case "social-post":
      return `Write a social media post for Momentify targeting ${vertLabel} event marketers. Generate THREE versions: one for LinkedIn, one for Instagram, and one for Twitter/X.

Motion: ${motionLabel}
Angle: derive from the ${vertLabel} vertical and ${motionLabel} motion context.${extra}

For each platform version, also extract a HEADLINE (under 12 words, punchy) and SUBHEAD (one sentence) that could be used on a branded graphic.

Output format (use these exact markers):

---LINKEDIN---
HEADLINE: [graphic headline]
SUBHEAD: [graphic subhead]
POST:
[150 to 250 words. Lead with a sharp observation or question. Not a company announcement. Do not start with "I" or "We". Maximum 3 relevant hashtags at the end. End with a question or non-salesy CTA.]

---INSTAGRAM---
HEADLINE: [graphic headline]
SUBHEAD: [graphic subhead]
POST:
[80 to 150 words. More visual-first language. Shorter paragraphs. 5 to 8 relevant hashtags at the end. Conversational tone.]

---TWITTER---
HEADLINE: [graphic headline]
SUBHEAD: [graphic subhead]
POST:
[Under 280 characters. Sharp and direct. One hashtag maximum. Can be a question, stat, or bold claim.]

Rules across all: no em dashes, no buzzwords, include a ROX insight or metric when relevant.`

    case "linkedin-dm":
      return `Write a 3-message LinkedIn DM sequence for Momentify.

Target: ${icpTitle} at a ${vertLabel} company
Motion: ${motionLabel}${extra}

DM 1: Genuine opener referencing something specific about their role or company context. One sharp question about their post-event process. No pitch whatsoever.

DM 2 (Day 5, no reply): Share one useful resource (ROX Audit or relevant guide) with a single sentence of context. Nothing else. Under 40 words.

DM 3 (if they engage): Move to a call or offer to send the relevant case study directly. Keep it short and warm.

Rules: no em dashes, sound human, DM 1 must feel researched not templated. Weave in a ROX-related question or insight naturally. Do not force ROX language into the opener.`

    case "lead-magnet":
      return `Write a full content outline for a Momentify lead magnet.

Solution: ${solution}
Vertical: ${vertLabel}
Motion: ${motionLabel}${extra}

Output format:
TITLE: [compelling title]
SUBTITLE: [one-line subhead]
HOOK: [2-3 sentence opening that states the problem and why this guide exists]
SECTIONS: [5 to 7 section headers, each with 2 to 3 bullet points of content]
CONCLUSION: [1 paragraph wrapping up with the ROX framework and a CTA]
GATE REQUIREMENT: [what information to ask for. Name, email, company, role]

This outline should be detailed enough for a designer and copywriter to execute without additional briefing.

Rules: no em dashes, no buzzwords, every section should deliver standalone value. Ground the lead magnet in ROX methodology so the reader walks away understanding how to measure their event ROI through the ROX lens.`

    case "discovery-script":
      return `Write a discovery call script for a Momentify sales rep.

Target: ${icpTitle}
Solution: ${solution}
Motion: ${motionLabel}${extra}

Output format:
OPENING: [30-second opener that earns the conversation]
DISCOVERY QUESTIONS: [5 questions with follow-up probes for each]
TRANSITION: [how to move from discovery to showing Momentify. One paragraph]
TOP OBJECTIONS: [3 objections with specific responses using Momentify positioning]
SOFT CLOSE: [how to end the call with a clear next step]

Rules: no em dashes, conversational tone, questions should make the buyer feel understood not interrogated. Responses to objections should never be defensive. Use ROX dimensions as a discovery framework to uncover gaps in the buyer's current measurement approach.`

    case "partner-pitch":
      return `Write a partner pitch narrative for Momentify targeting exhibit agencies and event companies.

Partner type: ${motion === "partner" ? "Freeman-type agency, association, or dealer network" : "channel partner"} based on ${vertLabel} vertical
Solution: ${solution}
Vertical: ${vertLabel}${extra}

Output format:
OPENING PARAGRAPH: Their problem. Clients asking what the show returned, no defensible answer
SECOND PARAGRAPH: The co-sell model. Partner delivers the experience, Momentify delivers the intelligence, one unified post-show report, revenue share
THIRD PARAGRAPH: The ask. 30-minute briefing, no pitch, just the model
ONE-LINER: A sentence the partner can use with their own clients to introduce Momentify

Rules: no em dashes, no buzzwords, sound like a business development conversation not a marketing pitch. Lead with their business outcome, not Momentify features. Frame the co-sell value through ROX: the partner gets a defensible ROI story to bring back to their clients.`

    case "battle-card":
      return `Write a competitive battle card for Momentify sales reps.

Competitor: ${competitor || "Cvent"}
Solution context: ${solution}
Vertical: ${vertLabel}${extra}

Output format:
COMPETITOR SNAPSHOT: 2 sentences on what this competitor actually does and who buys it
WHEN YOU HEAR THEM: 3 situations where this competitor comes up in a sales conversation
HOW TO RESPOND: Specific language for each situation. What to say, what not to say
THEIR STRENGTHS: Be honest. 2 to 3 things they do well
OUR ADVANTAGE: 3 specific Momentify advantages that matter in this vertical
KILLER QUESTION: One question to ask the buyer that reframes the conversation in Momentify's favor
PROOF POINT TO USE: The most relevant Momentify proof point for this competitive situation

Rules: be honest about competitor strengths. Reps trust a balanced kill sheet more than a one-sided one. No em dashes. Keep each section tight and scannable. Frame competitive advantages through the lens of ROX measurement. The killer question should expose the competitor's inability to deliver measurable engagement outcomes.`

    case "microsite":
      return `Write a complete microsite brief for Momentify.

Solution: ${solution}
Vertical: ${vertLabel}
Motion: ${motionLabel}
Target buyer: ${icpTitle}${extra}
${palette ? `
COLOR PALETTE (${palette.name} — use these exclusively, not generic Momentify cyan):
- Primary: ${palette.primary}
- Light accent: ${palette.light}
- Dark: ${palette.dark}
- Hero gradient: ${palette.heroGrad}
- Light section background: ${palette.lightBg}
- Eyebrow text: ${palette.primary} (not #00BBA5)
- CTA buttons: ${palette.primary} background, white text
- Icon tints, hover glows, active states: ${palette.light}
` : ""}
Output format:
PAGE TITLE: [compelling page title]
META DESCRIPTION: [under 160 characters, includes primary keyword]
HERO SECTION:
- Headline: [one sentence, problem-first, font-weight 500]
- Subhead: [one sentence, solution framing, font-weight 300]
- Primary CTA: [button text and destination, pill shape with primary color background]
- Secondary CTA: [optional, lower commitment, bordered style]

SECTION 1 — THE PROBLEM (white background): [3 to 4 sentences describing the buyer's pain in this vertical. Body text left-aligned, 16px, Deep Navy at 55% opacity]
SECTION 2 — THE APPROACH (light section background): [3 to 4 bullet points on how Momentify solves it, specific to this vertical and motion. Feature cards with white bg, 12px radius, primary color icon tint]
SECTION 3 — PROOF (dark background #070E2B): [1 to 2 relevant proof points with specific numbers. Stat numbers 48px/800/white. Include ROX tier bar visualization]
SECTION 4 — HOW IT WORKS (white background): [3-step visual flow: Deploy, Capture, Act. Numbered step circles with primary color gradient]
SECTION 5 — CTA BLOCK (hero gradient background): [headline, subhead, form fields: name, email, title dropdown, upcoming events checkboxes. Form card with semi-transparent bg]

DESIGN NOTES: [layout, font stack Inter 300-800, headline weight 500, subhead weight 300, card title weight 600. No em dashes. Scroll-reveal animations. Responsive at 768px]

Rules: no em dashes, no buzzwords, every section should earn the next scroll. The page should convert a cold visitor in under 90 seconds of reading. Anchor the proof section and CTA in ROX language so the visitor leaves understanding that Momentify delivers measurable return, not just features. All accent colors, CTAs, eyebrows, and interactive elements must use the solution palette above, not generic Momentify brand colors.`

    case "pitch-deck":
      return `Write a pitch deck script for Momentify. This will be rendered as a series of branded 16:9 slides.

Solution: ${solution}
Vertical: ${vertLabel}
Motion: ${motionLabel}
Target buyer: ${icpTitle}${extra}
${palette ? `
COLOR PALETTE (${palette.name}):
- Primary: ${palette.primary}
- Light accent: ${palette.light}
- Dark: ${palette.dark}
- Hero gradient: ${palette.heroGrad}
- Light section background: ${palette.lightBg}
` : ""}
Generate exactly 8 slides. For each slide, output using these exact markers:

---SLIDE 1: TITLE---
HEADLINE: [bold opening statement, under 8 words]
SUBHEAD: [one sentence positioning statement]
BODY:
LAYOUT: title

---SLIDE 2: PROBLEM---
HEADLINE: [problem framing, under 10 words]
SUBHEAD: [one sentence expanding the pain]
BODY: [2-3 short bullet points describing the buyer's current state. Use bullet character. Each under 15 words]
LAYOUT: top

---SLIDE 3: COST---
HEADLINE: [a striking cost or stat, e.g. "$2.1M per event with no measurable ROI"]
SUBHEAD: [one sentence contextualizing the number for this vertical]
BODY:
LAYOUT: center

---SLIDE 4: SOLUTION---
HEADLINE: [solution framing, under 8 words]
SUBHEAD: [one sentence on what Momentify delivers]
BODY: [3 capability bullet points specific to this vertical and motion. Use bullet character. Each under 15 words]
LAYOUT: top

---SLIDE 5: HOW IT WORKS---
HEADLINE: [e.g. "Three steps to measurable ROI"]
SUBHEAD: [one sentence overview]
BODY: [3 numbered steps: Deploy, Capture, Act. One sentence each]
LAYOUT: top

---SLIDE 6: ROX FRAMEWORK---
HEADLINE: ROX: Return on Experience
SUBHEAD: [one sentence on what ROX measures]
BODY: [4 bullet points, one per ROX dimension, adapted to this vertical. Use bullet character]
LAYOUT: top

---SLIDE 7: PROOF---
HEADLINE: [a key proof metric, e.g. "250+ qualified leads at a single show"]
SUBHEAD: [one sentence of context. Keep customer-agnostic]
BODY:
LAYOUT: center

---SLIDE 8: CTA---
HEADLINE: [clear next step, under 8 words]
SUBHEAD: [low-friction ask: ROX Audit, 20-minute call, or custom demo]
BODY:
LAYOUT: center

Rules: no em dashes, no buzzwords, each slide must stand alone visually. Headlines should be punchy and scannable. Keep body text minimal. This is a visual deck, not a document.`

    case "infographic":
      return `Write a DATA-DRIVEN INFOGRAPHIC for Momentify. This is NOT a pitch deck. It is a vertical data story where every panel leads with a number, stat, or data insight. Think "stat card" not "slide deck."

Solution: ${solution}
Vertical: ${vertLabel}
Motion: ${motionLabel}
Target buyer: ${icpTitle}${extra}
${palette ? `
COLOR PALETTE (${palette.name}):
- Primary: ${palette.primary}
- Light accent: ${palette.light}
- Dark: ${palette.dark}
- Hero gradient: ${palette.heroGrad}
- Light section background: ${palette.lightBg}
` : ""}
Generate exactly 6 panels. Every headline MUST be a number, stat, percentage, or data point. No generic statements. For each panel, output using these exact markers:

---SLIDE 1: TITLE---
HEADLINE: [infographic title framed as a question or data claim, e.g. "Where Does Your Event Budget Actually Go?"]
SUBHEAD: [one sentence framing this as a data story about ${vertLabel} events]
BODY:
LAYOUT: title

---SLIDE 2: STAT 1---
HEADLINE: [a specific number or percentage about the problem, e.g. "68% of exhibitors can't prove event ROI"]
SUBHEAD: [one sentence source or context]
BODY: [2 supporting data points. Start each with a number. Use bullet character]
LAYOUT: center

---SLIDE 3: STAT 2---
HEADLINE: [another data point about the cost/impact of the problem, e.g. "$2.1M average annual trade show spend with zero attribution"]
SUBHEAD: [one sentence making this real for ${vertLabel} buyers]
BODY:
LAYOUT: center

---SLIDE 4: THE GAP---
HEADLINE: [a comparison stat, e.g. "4.2 days average follow-up time vs. 24-hour best practice"]
SUBHEAD: [one sentence on what this gap costs in the ${vertLabel} vertical]
BODY: [3 ROX dimension gaps as data points. Start each with a number. Use bullet character]
LAYOUT: top

---SLIDE 5: THE RESULT---
HEADLINE: [a Momentify proof metric, e.g. "40% lead qualification improvement across 50+ events"]
SUBHEAD: [one sentence connecting this result to the earlier stats]
BODY:
LAYOUT: center

---SLIDE 6: CTA---
HEADLINE: [data-framed CTA, e.g. "Find your ROX score in 20 minutes"]
SUBHEAD: [one sentence low-friction ask]
BODY:
LAYOUT: center

Rules: no em dashes, no buzzwords. EVERY headline must contain a number, stat, or data point. This is a data narrative, not a sales pitch. Panels should flow as a logical data story: here's the problem (by the numbers), here's what it costs, here's the gap, here's the proof, here's the next step.`

    case "carousel":
      return `Write a social carousel for Momentify. This will be rendered as a series of branded swipeable cards.

Solution: ${solution}
Vertical: ${vertLabel}
Motion: ${motionLabel}
Target buyer: ${icpTitle}${extra}
${palette ? `
COLOR PALETTE (${palette.name}):
- Primary: ${palette.primary}
- Light accent: ${palette.light}
- Dark: ${palette.dark}
- Hero gradient: ${palette.heroGrad}
- Light section background: ${palette.lightBg}
` : ""}
Generate exactly 6 cards. The theme should be tips, tricks, facts, or insights relevant to ${vertLabel} event marketers. Each card should deliver standalone value.

For each card, output using these exact markers:

---SLIDE 1: COVER---
HEADLINE: [carousel title, under 8 words, e.g. "5 Signs Your Trade Show ROI Is Broken"]
SUBHEAD: [one sentence hook that makes them swipe]
BODY:
LAYOUT: title

---SLIDE 2: TIP 1---
HEADLINE: [tip/fact title, under 8 words]
SUBHEAD: [one sentence explanation]
BODY: [1-2 sentences of supporting detail or a quick example]
LAYOUT: center

---SLIDE 3: TIP 2---
HEADLINE: [tip/fact title, under 8 words]
SUBHEAD: [one sentence explanation]
BODY: [1-2 sentences of supporting detail or a quick example]
LAYOUT: center

---SLIDE 4: TIP 3---
HEADLINE: [tip/fact title, under 8 words]
SUBHEAD: [one sentence explanation]
BODY: [1-2 sentences of supporting detail or a quick example]
LAYOUT: center

---SLIDE 5: TIP 4---
HEADLINE: [tip/fact title, under 8 words]
SUBHEAD: [one sentence explanation]
BODY: [1-2 sentences of supporting detail or a quick example]
LAYOUT: center

---SLIDE 6: CTA---
HEADLINE: [wrap-up or call to action, under 8 words]
SUBHEAD: [one sentence with a low-friction CTA]
BODY:
LAYOUT: title

SERIES_CAPTION: [A 1-2 sentence caption for the entire carousel that can be posted as the series post text on LinkedIn/Twitter. Should work as a standalone social post that encourages people to swipe through all 6 cards. Include a light CTA if natural.]

Rules: no em dashes, no buzzwords. Each card should be valuable on its own. Mix data points, practical tips, and ROX insights. The cover card should create curiosity. The CTA card should feel like a natural conclusion, not a hard sell.`

    case "one-pager":
      return `Write a one-pager sales leave-behind for Momentify.

Solution: ${solution}
Vertical: ${vertLabel}
Motion: ${motionLabel}
Target buyer: ${icpTitle}${extra}

This one-pager will be left behind after a sales meeting or sent as a follow-up PDF. It must stand alone without a presenter.

Output format:
HEADLINE: [one sentence that frames the problem and positions Momentify]
SUBHEAD: [one sentence that describes the outcome]

THE PROBLEM (left column or top section):
- 3 bullet points describing the buyer's current state in this vertical
- Each bullet should be specific and recognizable to the buyer

THE SOLUTION (right column or middle section):
- 3 bullet points on what Momentify delivers
- Each bullet maps directly to a problem above
- Include one specific feature or capability per bullet

PROOF POINT: [one relevant stat or case reference with context]

ROX FRAMEWORK: [4 dimensions with one-line descriptions, adapted for this vertical]

CALL TO ACTION:
- Primary: [specific next step, e.g., ROX Audit, 20-minute call, demo]
- Contact: [placeholder for rep name, email, phone]
- URL: momentifyapp.com

DESIGN NOTES: [layout guidance — single page, front only, print-ready at 8.5x11]

Rules: no em dashes, no buzzwords, under 400 words total. Every word must earn its place. This is a leave-behind, not a brochure. It should make the buyer want to forward it to their boss. The ROX Framework section should be the anchor of the page, making the measurement story impossible to ignore.`

    default:
      return `Write GTM content for Momentify targeting the ${vertLabel} vertical.${extra}`
  }
  })()

  return guidance ? `${guidance}\n\n${body}` : body
}

export const systemPrompt = `You are a senior B2B marketing strategist writing on behalf of Momentify.

Momentify is an engagement intelligence platform that helps teams turn in-person moments into measurable outcomes. The core proprietary framework is ROX (Return on Experience), which scores events across four equally weighted dimensions: Lead Capture Efficiency, Engagement Quality, Follow-Up Speed, and Conversion Effectiveness.

ROX scoring tiers: 0-39 Critical Gap, 40-69 Needs Optimization, 70-84 High ROX, 85-100 Elite ROX.

Brand voice:
- Confident, grounded, operator-led
- Short declarative sentences with purpose
- No em dashes. Use a period or restructure the sentence
- No buzzwords: seamless, powerful, robust, revolutionary, innovative, unlock, game-changing
- No forced enthusiasm
- Content should sound natural when spoken aloud
- Always connect: problem, insight, value, outcome

Key proof points (use when relevant, not in every piece). Keep these customer-agnostic. Never name specific customers:
- 250+ qualified leads at a single major trade show, 40% lead qualification improvement
- $411M in potential value generated across 50+ events in 18 months
- 10,000 leads across 50+ events in 18 months
- Services-based engagement model at defense industry trade shows (DSEI, IDEX, AUSA)
- Fortune 75 Manufacturer energy industry program (never name the company)

Positioning:
- Momentify is NOT a lead capture tool, event app, or event management platform
- Momentify is an engagement intelligence layer that sits ABOVE existing tools
- Momentify does not replace Cvent, Whova, Hopin, or badge scanners. It completes them
- Use services-based language for enterprise and defense accounts, not licensing or software language
- The portfolio argument: event managers running 20+ shows across multiple vendors have no unified view. Momentify closes that gap

ROX FRAMEWORK (integrate into every piece of content):
ROX (Return on Experience) is Momentify's proprietary measurement framework. It scores engagement across four dimensions:
- Lead Capture Efficiency: leads captured vs. estimated traffic
- Engagement Quality: time spent, content interactions, persona completeness
- Follow-Up Speed: hours from capture to first CRM touch
- Conversion Effectiveness: MQL rate, pipeline attributed to the interaction

ROX Scoring Tiers: 0-39 Critical Gap, 40-69 Needs Optimization, 70-84 High ROX, 85-100 Elite ROX

Every piece of content should reference or imply ROX value. Do not just mention ROX as a feature. Position it as the reason Momentify exists: to give teams a measurable return on every interaction.

CUSTOMER JOURNEY STAGE: Consider where the target audience is in their journey (Awareness, Interest, Consideration, Evaluation, Decision, Activation) and tailor the content's ROX messaging accordingly. Early stages should focus on ROX awareness. Later stages should reference specific ROX projections and proof points.

Competitive context:
- Cvent: logistics and registration platform. No in-booth intelligence, no ROX scoring
- Whova: conference attendee engagement. Not designed for exhibitor B2B intelligence
- Hopin: virtual/hybrid platform. Not a direct competitor for in-person trade show buyers
- Always position Momentify as completing the stack, not competing with it

Never sound salesy. Lead with insight and the problem. Make the reader feel understood before any ask. CTAs should be low-friction in early touches.`
