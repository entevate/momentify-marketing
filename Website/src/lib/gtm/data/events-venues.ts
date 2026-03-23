/* ═══════════════════════════════════════════════════════════════
   Events & Venues — GTM Framework Data
   All content exported as typed constants.
   ═══════════════════════════════════════════════════════════════ */

export type GTMLayer = {
  id: number
  label: string
  sections: { heading?: string; body: string }[]
}

export type VerticalTrack = {
  vertical: "sports-entertainment"
  label: string
  layers: GTMLayer[]
}

export type PersonaFeatureMap = {
  persona: string
  rows: {
    painPoint: string
    objective: string
    kpi: string
    primaryFeatures: string
    secondaryFeatures: string
    competitiveAdvantage: string
  }[]
}

export type LeadMagnet = {
  title: string
  format: string
  audience: string
  problem: string
  featureHighlighted: string
  delivery: string
  sections: { heading?: string; body: string }[]
}

export type LinkedInOutreach = {
  segment: string
  subsegment?: string
  message: string
}

export type MotionTrack = {
  motion: "direct" | "partner"
  label: string
  verticals: VerticalTrack[]
}

/* ── Direct to Customer: Sports & Entertainment ── */

const sportsEntertainmentLayers: GTMLayer[] = [
  {
    id: 1,
    label: "ICP + Buyer Personas",
    sections: [
      {
        heading: "Primary Buyer",
        body: "Title: VP of Partnerships, VP of Fan Experience, or Chief Revenue Officer at a professional sports team, stadium, or live entertainment company\nOrganizations: NFL, NBA, NHL, MLS, MLB teams, college athletic programs, concert promoters, arena operators, motorsports venues",
      },
      {
        heading: "Secondary Buyer",
        body: "Title: Director of Sponsorship Activation, Premium Seating Manager, Event Operations Director\nThey execute the experience. The CRO or VP owns the revenue outcome.",
      },
      {
        heading: "Event Contexts",
        body: "\u2022 Home game days and match day activations\n\u2022 Suite and premium hospitality experiences\n\u2022 Sponsor activation zones and branded fan areas\n\u2022 Fan experience areas, concourses, and team stores\n\u2022 Pre-game and post-game events and plaza activations\n\u2022 Stadium tours ($8M to $10M annual revenue channel with zero data capture today)",
      },
      {
        heading: "Goals",
        body: "\u2022 Prove sponsor activation ROI with engagement data, not impressions reports\n\u2022 Understand which fan segments are most engaged and most valuable\n\u2022 Increase suite and premium hospitality utilization and renewal rates\n\u2022 Connect fan in-venue behavior to off-venue relationship (season ticket renewal, merchandise, memberships)\n\u2022 Transform anonymous attendees into actionable, segmented audience profiles",
      },
      {
        heading: "Blockers",
        body: "\u2022 \"We use our ticketing system for this.\" Ticketing tells you who bought a seat. Momentify tells you what that guest did when they got there.\n\u2022 \"Our sponsors have their own measurement.\" Sponsor measurement is usually impressions and signage views. Momentify captures actual fan engagement with activations.\n\u2022 \"We have an app.\" Team apps measure digital behavior. Momentify captures physical in-venue interaction.",
      },
      {
        heading: "Anti-ICP",
        body: "\u2022 Small community events with no sponsor or premium revenue model\n\u2022 Non-commercial venues (municipal parks, non-profit event spaces)\n\u2022 One-time events with no repeat audience relationship (fundraisers, galas)\n\u2022 Organizations without a structured fan experience or sponsorship program",
      },
      {
        heading: "Budget Authority",
        body: "CRO or VP of Partnerships owns revenue accountability. VP of Fan Experience or Operations owns the activation budget. For large deals, CEO or President may be involved.",
      },
      {
        heading: "Trigger Events",
        body: "\u2022 Sponsor renewal season where sponsors demand proof of activation ROI\n\u2022 New front office leadership seeking data-driven operations\n\u2022 Team moving to a new venue ($8.5B in current major league facility construction)\n\u2022 Loss of a major sponsor due to lack of measurement\n\u2022 Plug and Play Sports Tech cohort activation with a team",
      },
    ],
  },
  {
    id: 2,
    label: "Core Message + Proof Points",
    sections: [
      {
        heading: "Headline",
        body: "Thousands of fans in your building. Do you know which experiences moved them?",
      },
      {
        heading: "Subhead",
        body: "Momentify measures every activation, every suite, every fan touchpoint. So you can prove what worked and sell the next sponsorship with data, not stories.",
      },
      {
        heading: "Key Differentiator: Sponsor Activation Measurement",
        body: "No sponsor needs another impressions report. They need engagement data from the actual activation. Momentify provides it. Per-sponsor ROX scores across all activations in a season.",
      },
      {
        heading: "Key Differentiator: Premium Hospitality Intelligence",
        body: "Suite hosts and premium club operators need to know which guests engaged, what they consumed, and how to personalize the next visit. Suites are consistently sold out, but teams do not know who is inside. Momentify captures guest info with branded QR prompts and tablets, engages through real-time content (polls, trivia, giveaways), and creates digital moments that build loyalty.",
      },
      {
        heading: "Key Differentiator: Fan Journey Mapping",
        body: "From entry gate to concession to activation zone to team store. Momentify maps the in-venue journey and scores engagement quality. Every section, every suite, every hallway is an opportunity to connect.",
      },
      {
        heading: "Proof Points",
        body: "\u2022 Accepted into Plug and Play Sports Tech cohort. Validation of the solution category by a leading sports innovation accelerator.\n\u2022 ROX framework applied to in-venue engagement. Same methodology as trade shows, adapted for live entertainment context.\n\u2022 70% guest engagement rate via interactive content in suite pilot deployments\n\u2022 4x improvement in post-event audience segmentation\n\u2022 2.8x higher follow-up campaign performance vs email only",
      },
      {
        heading: "Objection Handling",
        body: "\u2022 \"Our ticketing platform (AXS / Ticketmaster) handles fan data.\" Ticketing data tells you who came. Momentify tells you what they did and how they felt about it. Both are necessary. Neither replaces the other.\n\u2022 \"We already work with StellarAlgo / Satisfi Labs.\" StellarAlgo is a fan data analytics platform focused on off-venue digital data. Satisfi Labs is a conversational AI chatbot. Neither captures physical in-venue engagement in real time the way Momentify does.",
      },
    ],
  },
  {
    id: 3,
    label: "Lead Magnets",
    sections: [
      {
        heading: "Primary: The Sponsor Activation Intelligence Gap",
        body: "Guide for VP of Partnerships on why impression-based reporting is killing sponsor renewals and what engagement intelligence looks like. Every spring, sports organizations go into renewal conversations with impressions data and a photo deck. Sponsors are increasingly demanding engagement proof. Most teams cannot provide it.",
      },
      {
        heading: "Secondary: In-Venue ROX: A New Metric for Sports and Entertainment",
        body: "One-page framework document introducing ROX in a sports and entertainment context. Four dimensions: Fan Capture Rate, Activation Engagement Quality, Sponsor Activation Score, and Premium Experience Index.",
      },
      {
        heading: "Tertiary: ROX Calculator for Sports",
        body: "Adapted ROX Calculator for sports context: engaged fans per activation, sponsor value per qualified interaction, premium hospitality renewal rate, post-event conversion attribution.",
      },
    ],
  },
  {
    id: 4,
    label: "Outreach Sequences",
    sections: [
      {
        heading: "Touch 1 (Day 0)",
        body: "Subject: \"What did your sponsor activations actually return last season?\"\nPain: Every spring, sports organizations go into sponsor renewal conversations with impressions data and a photo deck. Sponsors are increasingly demanding engagement proof. Most teams cannot provide it.\nCTA: Sponsor Activation Intelligence Gap guide",
      },
      {
        heading: "Touch 2 (Day 4)",
        body: "Subject: \"How one team changed their renewal conversation\"\nReference: Momentify's Plug and Play Sports Tech cohort acceptance. Frame as an emerging category. Teams adopting in-venue engagement intelligence now will have a 2-season head start.\nCTA: 20-minute call",
      },
      {
        heading: "Touch 3 (Day 9)",
        body: "Subject: \"Before next renewal season\"\nBody: \"Sponsor renewals are 3 to 6 months away for most organizations. The question is whether you go into that conversation with impressions data or engagement data. Worth a 20-minute call?\"\nCTA: ROX Calculator for sports",
      },
      {
        heading: "LinkedIn DM Flow",
        body: "DM 1: Reference their team or venue specifically. One sharp question about how they currently measure sponsor activation ROI. No pitch.\nDM 2 (Day 5): Drop the Sponsor Activation guide with one sentence. Nothing else.\nDM 3 (engaged): Offer a call framed around their specific renewal timeline.",
      },
    ],
  },
  {
    id: 5,
    label: "Sales Enablement",
    sections: [
      {
        heading: "Discovery Opener",
        body: "\"When you go into a sponsor renewal conversation, what data do you bring? How confident are you that it shows what the sponsor actually got from the activation?\"",
      },
      {
        heading: "Discovery Questions",
        body: "1. \"How many sponsors are you renewing in the next 6 months, and what are the top reasons sponsors have not renewed in the past?\"\n2. \"How do you currently measure fan engagement with sponsor activations during a game day?\"\n3. \"What does your premium hospitality and suite utilization look like, and how do you drive renewals in that segment?\"\n4. \"If you could know, in real time during a game, which activation zones were generating the most fan engagement, what would you do with that information?\"\n5. \"What is the revenue impact of losing a top-tier sponsorship because you could not prove ROI at renewal?\"",
      },
      {
        heading: "Objection Responses",
        body: "\u2022 \"We have fan data from our app.\" App data tells you about digital engagement. Momentify captures physical in-venue behavior. What fans did when they were actually in your building. Both matter. One currently exists in your stack.\n\u2022 \"Sponsors are not asking for this yet.\" They will be. The teams that have engagement data in the next renewal cycle will close faster and at higher values than teams presenting impressions reports.\n\u2022 \"We do not have budget for this right now.\" What does losing one mid-tier sponsor renewal cost you? One activation with Momentify data in that conversation pays for the platform.",
      },
      {
        heading: "Pilot Approach: Start in the Suites",
        body: "Recommended pilot structure: begin with premium suite guests for highest value, easiest access, and fastest proof of concept.\n\u2022 Suite guests: capture guest info via branded QR prompts and tablets, engage with trivia, polls, and sponsor activations, create digital moments for sharing\n\u2022 Tour guests: light-touch prompts at key points (entry, locker room, field access), capture names, emails, favorite players, merch interest\n\u2022 Plaza and game day: deploy branded QR codes, kiosks, and tablets at activations, use trivia, instant-win games, and selfie uploads",
      },
      {
        heading: "The 24-Hour Fan Window",
        body: "Capture the peak of emotion to create lifetime value:\n\u2022 1 hour before: anticipation and arrival energy\n\u2022 Game time: emotional highs and signature plays\n\u2022 1 to 2 hours after: sharing and reliving the moment\nMomentify captures that emotional energy and turns it into fan-submitted moments that extend your brand, actionable data that drives smarter outreach, and post-event activations that generate new revenue.",
      },
    ],
  },
  {
    id: 6,
    label: "ROX Metrics + KPIs",
    sections: [
      {
        heading: "Sports and Entertainment ROX Dimensions",
        body: "\u2022 Fan Capture Rate: engaged fans in activation zones vs estimated traffic through those areas\n\u2022 Activation Engagement Quality: dwell time, interaction depth, sentiment signals, content engagement\n\u2022 Sponsor Activation Score: per-sponsor ROX score across all activations in a season\n\u2022 Premium Experience Index: suite and premium guest engagement, NPS signals, renewal prediction indicators",
      },
      {
        heading: "Reporting Frame for Sponsor Renewal",
        body: "\"During [Season], your activation at [Location] engaged [X] fans, [Y]% of whom spent 3+ minutes. Your Sponsor ROX Score was [Z]. Here is how that compares to the category benchmark and what we are recommending for next season.\"",
      },
      {
        heading: "Reporting Frame for Team Leadership",
        body: "\"Our top 3 activations by fan engagement score drove [X]% of post-event merchandise and membership conversions. Our bottom 2 activations are candidates for redesign or reallocation.\"",
      },
      {
        heading: "Revenue Impact Channels",
        body: "\u2022 Ticketing and upsells: know the fan, not just the ticket buyer\n\u2022 Merchandising: connect in-venue engagement to purchase behavior\n\u2022 Sponsorship: prove activation ROI with engagement data\n\u2022 Tours and events: capture contactable leads from $8M to $10M annual revenue channels\n\u2022 Premium hospitality: drive suite renewal with guest-level intelligence",
      },
    ],
  },
  {
    id: 7,
    label: "Competitive Intel: Sports & Entertainment Engagement Tech",
    sections: [
      {
        heading: "Competitive Landscape",
        body: "Primary competitors: StellarAlgo (fan data analytics), Satisfi Labs (conversational AI chatbot), Qualtrics (fan NPS surveys), and basic kiosk/photo experience vendors.",
      },
      {
        heading: "vs StellarAlgo",
        body: "StellarAlgo is a fan intelligence platform built on digital and transactional data: ticketing history, streaming behavior, social signals. It is outstanding at off-venue fan analytics. Momentify captures what happens when the fan is physically in your building. They are complementary. Only one currently exists in your tech stack.",
      },
      {
        heading: "vs Satisfi Labs",
        body: "Satisfi Labs is a conversational AI chatbot for fan Q&A during events. It answers questions. Momentify captures engagement. Different problem, different solution.",
      },
      {
        heading: "vs Qualtrics",
        body: "Qualtrics sends a survey after the event. Momentify captures engagement during the event, in real time. One tells you what fans remembered. The other tells you what they actually did.",
      },
      {
        heading: "How to Win",
        body: "Lead with the sponsor renewal problem. Every sports organization faces this. The team that can walk into a renewal meeting with an Engagement ROX Score has a structural advantage over every team presenting a reach and impressions deck.",
      },
      {
        heading: "Killer Question",
        body: "\"In your last sponsor renewal conversation that did not go well, what data would you have needed to change the outcome?\"",
      },
    ],
  },
]

/* ── Channel Partners ── */

const channelPartnerLayers: GTMLayer[] = [
  {
    id: 1,
    label: "Partner ICP",
    sections: [
      {
        heading: "Primary Partner",
        body: "Title: SVP or Director of Sports Marketing at an agency managing team sponsorship portfolios or activation programs\nPartner types: sports marketing agencies, sponsorship consulting firms, stadium experience design firms (Populous, Legends, Legends Hospitality)",
      },
      {
        heading: "Secondary Partner",
        body: "Title: Consulting lead at a firm advising teams on fan experience strategy\nThey design the activation strategy. They need proof that it worked.",
      },
      {
        heading: "Partner Pain",
        body: "Agencies sell activation strategies but cannot prove they worked. Sponsors are cutting agencies that cannot demonstrate measurable engagement ROI. The agency that brings ROX to their clients first owns the category.",
      },
      {
        heading: "Anti-ICP",
        body: "\u2022 PR and media agencies without activation or experiential arms\n\u2022 Digital-only marketing firms with no in-venue component",
      },
    ],
  },
  {
    id: 2,
    label: "Partner Message",
    sections: [
      {
        heading: "Headline",
        body: "You design activations that move fans. Prove it.",
      },
      {
        heading: "Partner Pitch",
        body: "Your clients are asking for engagement proof. Momentify gives you the data layer to provide it. Add ROX scoring to every activation you deliver. Win more pitches. Retain more clients.",
      },
      {
        heading: "Revenue Model",
        body: "Per-event ROX reporting package bundled into activation fee, or revenue share on Momentify platform license. The agency adds a measurable outcomes guarantee to every proposal.",
      },
    ],
  },
  {
    id: 3,
    label: "Lead Magnets",
    sections: [
      {
        heading: "Primary: Agency Activation Intelligence Briefing",
        body: "30-minute briefing for sports marketing agency leaders on how to add engagement scoring to every activation they deliver. Covers the ROX framework, client value proposition, and revenue model.",
      },
      {
        heading: "Secondary: The Measurable Activation Playbook",
        body: "Gated PDF for sports marketing agencies. How to position engagement intelligence as part of every activation proposal. Includes sponsor case study framework, ROX scoring methodology, and pricing guidance.",
      },
    ],
  },
  {
    id: 4,
    label: "Outreach Sequences",
    sections: [
      {
        heading: "Touch 1 (Day 0)",
        body: "Subject: \"Your client's activation was electric. Can you prove what it returned?\"\nPain: Sports marketing agencies design brilliant activations. But when the sponsor asks what it actually produced in fan engagement, the agency has impressions data and a photo deck. Not enough for renewal.\nCTA: Agency Activation Intelligence Briefing",
      },
      {
        heading: "Touch 2 (Day 4)",
        body: "Subject: \"Add ROX scoring to every activation you deliver\"\nReference: How agencies using Momentify differentiate their pitches by including per-activation engagement scores. The sponsor gets proof. The agency gets retained.\nCTA: 20-minute call",
      },
      {
        heading: "Touch 3 (Day 9)",
        body: "Subject: \"First-mover advantage in activation intelligence\"\nBody: \"No sports marketing agency currently offers a proprietary engagement scoring framework tied to activation delivery. Momentify is the first. The agency that brings ROX to their clients first owns the category. Worth a quick look?\"\nCTA: Short call",
      },
    ],
  },
  {
    id: 5,
    label: "Sales Enablement",
    sections: [
      {
        heading: "Discovery Opener",
        body: "\"When your client asks you what their activation produced in fan engagement, what do you show them today?\"",
      },
      {
        heading: "Discovery Questions",
        body: "1. \"How many activation programs are you managing across your client portfolio this season?\"\n2. \"When a sponsor asks for ROI proof on their activation, what data do you currently provide?\"\n3. \"Have any sponsors not renewed because the engagement measurement was not strong enough?\"\n4. \"What would it mean for your agency if every activation proposal included a measurable engagement guarantee?\"\n5. \"How do you currently differentiate from other agencies in competitive pitches for activation work?\"",
      },
      {
        heading: "Objection Responses",
        body: "\u2022 \"Our clients have not asked for this.\" They will. As sponsor budgets tighten, engagement proof will become table stakes. The agency that provides it first wins the renewal and the next pitch.\n\u2022 \"We are a strategy firm, not a technology company.\" Exactly. Momentify is the technology layer. Your firm is the strategy and creative. Together you deliver activations that are both brilliant and measurable.\n\u2022 \"This adds complexity to our delivery.\" Momentify deploys at the activation without additional infrastructure. Setup takes minutes. The data appears in real time. Your team focuses on the experience. Momentify handles the measurement.",
      },
    ],
  },
  {
    id: 6,
    label: "ROX Metrics + KPIs",
    sections: [
      {
        heading: "Partner-Specific ROX Dimensions",
        body: "\u2022 Client-Facing Metrics: fans engaged per activation, sponsor ROX scores, premium guest engagement rates\n\u2022 Partner Metrics: activations deployed, client retention rate, new business attributed to ROX capability\n\u2022 Operational: time from activation design to Momentify live, client team training and adoption",
      },
      {
        heading: "Partner Reporting Frame",
        body: "\"Across [X] activations for [Client], Momentify captured [Y] fan engagement interactions. The Sponsor ROX Score for the season was [Z], representing a [X]% improvement over impression-based benchmarks. This data directly supported a [revenue amount] renewal.\"",
      },
    ],
  },
  {
    id: 7,
    label: "Competitive Intel",
    sections: [
      {
        heading: "Competitive Landscape",
        body: "No sports marketing agency currently offers a proprietary engagement scoring framework tied to activation delivery. Momentify is the first. The competitive set is other agencies who cannot prove their work drives measurable fan engagement.",
      },
      {
        heading: "Win Condition",
        body: "The agency that brings ROX to their clients first owns the category. Every activation pitch becomes a measurable outcomes proposal instead of a creative presentation with an impressions estimate.",
      },
      {
        heading: "Killer Question",
        body: "\"If your biggest client asked you tomorrow to prove what their activation produced in real fan engagement, not impressions, what would you show them?\"",
      },
    ],
  },
]

/* ── Comparison Table ── */

export const comparisonTable = {
  headers: [
    "Capability",
    "Momentify",
    "StellarAlgo",
    "Satisfi Labs",
    "Qualtrics",
  ],
  rows: [
    [
      "In-venue real-time engagement capture",
      "Yes",
      "No. Off-venue digital data",
      "No. Chatbot only",
      "No. Survey only",
    ],
    [
      "Sponsor activation ROX scoring",
      "Yes",
      "No",
      "No",
      "No",
    ],
    [
      "Fan journey mapping (physical)",
      "Yes",
      "Partial. Digital only",
      "No",
      "No",
    ],
    [
      "Premium hospitality intelligence",
      "Yes",
      "Limited",
      "No",
      "Partial. Survey",
    ],
    [
      "Works across venue types and touring events",
      "Yes",
      "No. Venue data sets only",
      "Partial",
      "No",
    ],
    [
      "Feeds partnership/CRM with engagement signals",
      "Yes",
      "Partial",
      "No",
      "No",
    ],
  ],
}

/* ── Motion Exports ── */

export const motions: MotionTrack[] = [
  {
    motion: "direct",
    label: "Direct to Customer",
    verticals: [
      {
        vertical: "sports-entertainment",
        label: "Sports & Entertainment",
        layers: sportsEntertainmentLayers,
      },
    ],
  },
  {
    motion: "partner",
    label: "Channel Partners",
    verticals: [
      {
        vertical: "sports-entertainment",
        label: "All Verticals",
        layers: channelPartnerLayers,
      },
    ],
  },
]

/* ── Persona Feature Mapping ── */

export const personaFeatureMap: PersonaFeatureMap[] = [
  {
    persona: "Director of Sponsorship Activation / Premium Seating Manager / Event Ops Director",
    rows: [
      {
        painPoint: "No way to prove sponsor activation engagement beyond impressions",
        objective: "Capture real-time fan engagement data per activation per sponsor",
        kpi: "Fans engaged per activation, dwell time, interaction depth",
        primaryFeatures: "Sponsor Activation ROX Scoring with per-sponsor dashboards",
        secondaryFeatures: "Real-time engagement alerts, activation zone heat maps",
        competitiveAdvantage: "Only platform that provides per-sponsor engagement scores tied to actual fan behavior, not impressions",
      },
      {
        painPoint: "Suites are sold out but teams do not know who is inside",
        objective: "Capture guest identity and engagement in premium hospitality",
        kpi: "Guest capture rate, engagement depth per suite",
        primaryFeatures: "Suite Guest Capture via branded QR prompts, tablets, and screensavers",
        secondaryFeatures: "Guest affiliation mapping, sponsor-tagged suite experiences",
        competitiveAdvantage: "Complements the suite experience without disrupting it. Builds richer guest profiles that feed CRM.",
      },
      {
        painPoint: "Fan moments and emotional peaks go uncaptured",
        objective: "Capture fan-submitted moments for social amplification and brand extension",
        kpi: "Moments uploaded, social shares, engagement rate",
        primaryFeatures: "Live Moment Gallery with fan photo uploads and sharing",
        secondaryFeatures: "Jumbotron and LED wall integration, auto-moderation",
        competitiveAdvantage: "Encourages participation and social sharing during the event, creating energy fans want to be part of",
      },
      {
        painPoint: "Underperforming activations are invisible until post-event analysis",
        objective: "Monitor activation performance in real time during the event",
        kpi: "Suite-by-suite engagement rate, activation participation levels",
        primaryFeatures: "Real-Time Engagement Leaderboard and Heat Map",
        secondaryFeatures: "Alerts for underperforming areas, in-event intervention prompts",
        competitiveAdvantage: "Enables teams to intervene during the event, not just analyze after",
      },
    ],
  },
  {
    persona: "VP of Partnerships / CRO / VP of Fan Experience",
    rows: [
      {
        painPoint: "Sponsor renewals based on impressions data, not engagement proof",
        objective: "Walk into renewal conversations with ROX engagement data",
        kpi: "Sponsor ROX score, renewal rate, deal value increase",
        primaryFeatures: "Season-Level Sponsor ROX Reports with benchmark comparison",
        secondaryFeatures: "Sponsor-specific engagement dashboards, activation comparison",
        competitiveAdvantage: "Teams with engagement data close renewals faster and at higher values than teams presenting impressions decks",
      },
      {
        painPoint: "No connection between in-venue behavior and off-venue revenue",
        objective: "Connect fan engagement to ticketing, merch, and membership outcomes",
        kpi: "Post-event conversion rate, lifetime fan value",
        primaryFeatures: "Fan Lifecycle Attribution from in-venue engagement to revenue",
        secondaryFeatures: "CRM integration, post-event drip campaigns, merch and ticket upsells",
        competitiveAdvantage: "Every moment fans experience in the building becomes a new revenue opportunity when captured and connected",
      },
      {
        painPoint: "Tours generate $8M to $10M annually with zero data capture",
        objective: "Transform stadium tours into data-rich fan acquisition channels",
        kpi: "Tour guest capture rate, post-tour conversion, email opt-in rate",
        primaryFeatures: "Tour Guest Engagement with light-touch prompts at key stops",
        secondaryFeatures: "Favorite player capture, merch interest, fan club enrollment",
        competitiveAdvantage: "Turns every tour into a data opportunity that opens the door for remarketing, fan club enrollment, and merchandise sales",
      },
      {
        painPoint: "Fragmented fan data across ticketing, app, and activation systems",
        objective: "Unified view of fan engagement across all in-venue touchpoints",
        kpi: "Total fan engagement signals, cross-touchpoint attribution",
        primaryFeatures: "Unified In-Venue Intelligence Dashboard across suites, activations, concourses, and retail",
        secondaryFeatures: "Guest affiliation mapping, gamification modules, social handle capture",
        competitiveAdvantage: "One platform captures what ticketing, apps, and surveys cannot: physical in-venue behavior in real time",
      },
    ],
  },
]

/* ── Lead Magnets ── */

export const leadMagnets: LeadMagnet[] = [
  {
    title: "The Sponsor Activation Intelligence Gap",
    format: "PDF Guide",
    audience: "VP of Partnerships, CRO, Sponsorship Activation Directors",
    problem: "Impression-based reporting is killing sponsor renewals. Sponsors want engagement proof. Most teams cannot provide it.",
    featureHighlighted: "Sponsor Activation ROX Scoring, Per-Sponsor Dashboards",
    delivery: "Gated PDF download via landing page",
    sections: [
      { heading: "The Impressions Problem", body: "Sponsors are paying for engagement but receiving impressions reports. The gap between what they pay for and what they can prove is widening every renewal cycle." },
      { heading: "What Engagement Data Looks Like", body: "Per-activation fan engagement scores. Dwell time at sponsor zones. Interaction depth with branded content. Comparison across activations and across seasons." },
      { heading: "The Renewal Conversation", body: "Teams with engagement data walk into renewal meetings with proof. Teams with impressions walk in with hope. One closes faster and at higher values." },
      { heading: "How to Get There", body: "The ROX framework applied to every sponsor activation. Real-time capture during the event. Aggregated scoring across the season. One report per sponsor, one framework for the portfolio." },
    ],
  },
  {
    title: "In-Venue ROX: A New Metric for Sports and Entertainment",
    format: "One-Page Framework",
    audience: "VP of Fan Experience, CRO, Front Office Leadership",
    problem: "No structured framework for measuring the quality of in-venue fan engagement across activations, suites, and touchpoints",
    featureHighlighted: "ROX Framework, Four-Dimension Scoring",
    delivery: "Ungated one-pager, also used as a sales asset in proposals",
    sections: [
      { heading: "Fan Capture Rate", body: "Engaged fans in activation zones vs estimated traffic through those areas. Measures reach with intent, not just presence." },
      { heading: "Activation Engagement Quality", body: "Dwell time, interaction depth, sentiment signals, and content engagement. Measures how deeply fans connected with the experience." },
      { heading: "Sponsor Activation Score", body: "Per-sponsor ROX score across all activations in a season. The metric sponsors actually need for renewal decisions." },
      { heading: "Premium Experience Index", body: "Suite and premium guest engagement, NPS signals, and renewal prediction indicators. The metric hospitality teams need for retention." },
    ],
  },
  {
    title: "ROX Calculator for Sports",
    format: "Interactive Web Tool",
    audience: "CRO, VP of Partnerships, CFO",
    problem: "No way to quantify the revenue impact of unmeasured in-venue fan engagement",
    featureHighlighted: "ROX Dashboard, Sponsor ROI Attribution",
    delivery: "Ungated interactive tool with optional email gate for detailed report",
    sections: [
      { heading: "Input Your Venue Metrics", body: "Enter average attendance, number of sponsor activations per event, suite inventory, and current sponsor renewal rate." },
      { heading: "Engagement Gap Analysis", body: "Estimate how much fan engagement data your venue captures today. The calculator shows the gap between captured and available intelligence." },
      { heading: "Revenue Impact Model", body: "See how improved sponsor measurement translates to higher renewal rates, increased deal values, and new sponsor acquisition." },
      { heading: "ROX Score Output", body: "Receive a composite ROX score across four in-venue dimensions: Fan Capture, Activation Quality, Sponsor Score, and Premium Experience Index." },
    ],
  },
  {
    title: "Suite Engagement Pilot Playbook",
    format: "Downloadable Kit",
    audience: "Premium Seating Managers, Suite Operations, VP of Fan Experience",
    problem: "Suites are sold out but teams capture zero data on who actually attends and what they engage with",
    featureHighlighted: "Suite Guest Capture, QR Prompts, Branded Trivia, Gamification",
    delivery: "Gated download with setup guides and pilot framework",
    sections: [
      { heading: "Pilot Scope: Start in the Suites", body: "Premium guests offer the highest value and easiest access for a proof of concept. Begin with in-suite QR prompts, branded trivia, and guest moment capture." },
      { heading: "Guest Capture Flow", body: "Screen QR code, tablet kiosk, or signage prompt. Guest enters info and immediately engages with branded content: polls, trivia, sponsor activations, and photo uploads." },
      { heading: "Gamification and Incentives", body: "Suite vs suite leaderboards, trivia challenges, merch discounts, VIP upgrades. Win chances increase with engagement. Drives repeat participation and dwell time." },
      { heading: "Scale Path", body: "From suites to fan zones, concourses, retail, and plaza activations. Proven in the premium tier, then expanded across the venue." },
    ],
  },
  {
    title: "Feature Enhancement Roadmap for Venues",
    format: "Strategic Overview",
    audience: "VP of Fan Experience, Event Operations, Technology Leadership",
    problem: "Venues need a clear view of where in-venue engagement intelligence is headed",
    featureHighlighted: "Guest Affiliation Mapping, Live Moment Walls, Dynamic Sponsor Spotlights, VIP Segmentation",
    delivery: "Included in proposals, shared during discovery calls",
    sections: [
      { heading: "Guest Affiliation Mapping", body: "Identify the company, sponsor, or individual responsible for each suite guest. Auto-tag guests by suite number. Generate post-event reports by sponsor or host group." },
      { heading: "Live Moment Wall and Gallery Screens", body: "Display guest-uploaded photos, trivia winners, or fan messages in real-time on jumbotron, suite TV, or LED walls. Auto-moderation or admin approval before live display." },
      { heading: "Dynamic Sponsor Spotlight Moments", body: "Rotate sponsor-branded moments like trivia, video intros, or giveaways into each guest interaction. Trigger additional content based on guest interests." },
      { heading: "Suite Host Interface", body: "Mobile web interface for suite hosts to monitor guest participation, send personal invites, and see live responses for icebreaker and trivia moments." },
    ],
  },
]

/* ── LinkedIn Outreach Templates ── */

export const linkedInOutreach: LinkedInOutreach[] = [
  {
    segment: "Professional Sports Teams",
    subsegment: "VP of Partnerships, CRO",
    message: "Your sponsors are asking what their activation actually returned. Not impressions. Not foot traffic. Actual fan engagement. Most teams go into renewal conversations with a photo deck and a reach number. We help teams capture real-time engagement data from every activation, every suite, and every fan touchpoint. So the renewal conversation starts with proof, not a pitch.",
  },
  {
    segment: "Premium Hospitality and Suite Operations",
    subsegment: "Premium Seating Managers",
    message: "Your suites are consistently sold out. But you do not know who is inside. High-value guests experience elite service and leave without a digital connection. We help premium hospitality teams capture guest identity and engagement in-suite with branded prompts and interactive content. No disruption to the experience. Just richer data that feeds CRM, strengthens renewals, and personalizes the next visit.",
  },
  {
    segment: "Stadium and Arena Operations",
    subsegment: "VP of Fan Experience, Event Ops Directors",
    message: "Thousands of fans move through your venue on game day. Most interactions are in-person only and never linked to fan data. Your tours alone generate $8M to $10M annually with zero data capture. We help venues capture fan engagement at every touchpoint: activations, concourses, retail, and tours. So every moment in your building can become a data-driven opportunity.",
  },
  {
    segment: "Sports Marketing Agencies",
    subsegment: "SVP of Sports Marketing",
    message: "You design activations that move fans. But when the sponsor asks what it returned, you have impressions data and a photo deck. Sponsors are cutting agencies that cannot demonstrate measurable engagement ROI. We help agencies add ROX scoring to every activation they deliver. Your clients get engagement proof. You win more pitches and retain more clients. No agency currently offers this. First-mover advantage is real.",
  },
  {
    segment: "College Athletics",
    subsegment: "Athletic Directors, Associate ADs",
    message: "Your program hosts thousands of fans across football, basketball, and other sports. Sponsors and boosters want to see engagement, not just attendance. We help college athletics programs capture fan engagement data from game day activations and premium hospitality, so you can prove the value of every partnership and every facility investment.",
  },
]

/* ── ENTEVATE Positioning ── */

export const entevatePositioning = {
  headline: "Beyond the Platform: ENTEVATE as Your In-Venue Intelligence Partner",
  subhead: "Momentify is the technology. ENTEVATE is the expertise that makes it work for sports teams, venues, and live entertainment at scale.",
  expertiseAreas: [
    {
      title: "Sponsor Activation Intelligence",
      description: "Where sponsors demand proof of engagement ROI and teams need to win renewal conversations with data. ENTEVATE configures Momentify to capture per-sponsor engagement scores across every activation in the venue.",
    },
    {
      title: "Premium Hospitality and Suite Intelligence",
      description: "Where suites are sold out but guest identity and engagement data does not exist. ENTEVATE designs the in-suite capture experience that complements hospitality without disrupting it.",
    },
    {
      title: "Fan Journey Mapping",
      description: "Where thousands of fans move through the venue and most interactions go uncaptured. ENTEVATE maps the touchpoints, designs the engagement prompts, and configures the analytics that connect in-venue behavior to revenue outcomes.",
    },
    {
      title: "Game Day and Live Event Operations",
      description: "Where setup has to be fast, execution has to be frictionless, and the data has to appear in real time. ENTEVATE deploys Momentify in live event contexts with zero disruption to game day operations.",
    },
    {
      title: "Sports Tech Innovation",
      description: "Where Momentify was accepted into the Plug and Play Sports Tech cohort and is positioned at the leading edge of in-venue engagement intelligence. ENTEVATE brings the industry context and deployment expertise that accelerates adoption.",
    },
  ],
  capabilities: [
    "Managed services deployment for sports teams and venues that need results without IT overhead",
    "Sponsor activation ROX scoring across the full season portfolio",
    "Suite and premium hospitality engagement capture with guest affiliation mapping",
    "Post-event intelligence activation connecting in-venue engagement to CRM, ticketing, and merchandise systems",
  ],
  industries: [
    "Professional Sports (NFL, NBA, NHL, MLS, MLB)",
    "College Athletics",
    "Concert and Live Entertainment",
    "Stadium and Arena Operations",
  ],
  differentiators: [
    "Faster deployment because Momentify works with QR codes, tablets, and screensavers. No app downloads, no badge scanning, no IT integration required.",
    "Smarter configuration because the team understands how fans, sponsors, and premium guests engage in live venue environments",
    "Better outcomes because engagement data is connected to sponsor renewal, hospitality retention, and fan lifecycle revenue",
  ],
}
