/* ═══════════════════════════════════════════════════════════════
   Facilities — GTM Framework Data
   All content exported as typed constants.
   ═══════════════════════════════════════════════════════════════ */

export type GTMLayer = {
  id: number
  label: string
  sections: { heading?: string; body: string }[]
}

export type VerticalTrack = {
  vertical: "heavy-equipment" | "energy-infrastructure"
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

/* ── Direct to Customer: Heavy Equipment ── */

const heavyEquipmentLayers: GTMLayer[] = [
  {
    id: 1,
    label: "ICP + Buyer Personas",
    sections: [
      {
        heading: "Primary Buyer",
        body: "Title: VP of Marketing, VP of Sales, or Director of Customer Experience at OEM or large dealer group\nFacility types: equipment showrooms, product demo floors, dealer experience centers, training and certification facilities, customer visit centers, field service training bays",
      },
      {
        heading: "Secondary Buyer",
        body: "Title: Facility Manager or Showroom Manager who owns the day-to-day experience\nThey run the facility. The VP owns the business outcome.",
      },
      {
        heading: "Goals",
        body: "\u2022 Understand what visitors actually engage with during facility visits\n\u2022 Capture buyer intent during demo floor tours and showroom visits\n\u2022 Give field sales reps intelligence from facility visits to use in follow-up\n\u2022 Justify the capital investment in a world-class facility with outcome data",
      },
      {
        heading: "Blockers",
        body: "\u2022 \"We don't think of our showroom as an event.\" Reframe: every facility visit is a high-value interaction. It just goes unmeasured.\n\u2022 \"We already have foot traffic counters / cameras.\" Those measure presence. Momentify measures engagement and intent.\n\u2022 \"This is a facilities/operations budget question.\" Often true. Position around the marketing and sales outcome value, not the operational cost.",
      },
      {
        heading: "Anti-ICP",
        body: "\u2022 Facilities with no customer-facing traffic (warehouses, back-office, manufacturing-only sites)\n\u2022 Companies whose showroom visits are fewer than 50 per year\n\u2022 Organizations where facility visits are purely transactional (parts pickup, service drop-off)",
      },
      {
        heading: "Budget Authority",
        body: "VP of Marketing or VP of Sales depending on org structure. Facility investment is often capital, but Momentify is an operational overlay. Recurring services model avoids capex approval.",
      },
      {
        heading: "Trigger Events",
        body: "\u2022 Major capital investment in a new experience center\n\u2022 OEM mandate to improve dealer experience quality\n\u2022 Upcoming major customer visit program\n\u2022 New regional leadership who wants accountability on facility ROI",
      },
    ],
  },
  {
    id: 2,
    label: "Core Message + Proof Points",
    sections: [
      {
        heading: "Headline",
        body: "You built the showroom. Do you know what it's doing for your pipeline?",
      },
      {
        heading: "Subhead",
        body: "Momentify turns every facility visit into measured engagement. So you know what moved, what missed, and where to invest next.",
      },
      {
        heading: "Key Differentiator",
        body: "Same ROX framework applied to facilities as to events. Portfolio visibility includes both. No other platform ties showroom engagement to sales pipeline outcomes.",
      },
      {
        heading: "Proof Points",
        body: "\u2022 Equipment dealer experience center deployments with structured engagement intelligence\n\u2022 Consistent intelligence layer across events AND facilities. One platform, unified view\n\u2022 $411M in potential value generated across 50+ events and 6 customers. Facilities extend that same framework to fixed locations.",
      },
      {
        heading: "Objection Handling",
        body: "\u2022 \"We have digital signage.\" Digital signage delivers content. It does not capture who engaged, how deeply, or what they decided. Different layer entirely.\n\u2022 \"We have kiosks.\" Kiosks collect form fills. Momentify captures engagement behavior, persona signals, and product interest across the entire visit.",
      },
    ],
  },
  {
    id: 3,
    label: "Lead Magnets",
    sections: [
      {
        heading: "Primary: The Facility Experience ROX Audit",
        body: "Self-assessment for dealer principals and experience center managers. How well does your facility capture visitor intent, measure engagement quality, and contribute to pipeline? Scores across four dimensions: Visitor Capture Rate, Engagement Depth, Follow-Up Speed, and Pipeline Conversion.",
      },
      {
        heading: "Secondary: What Your Showroom Is Not Telling You",
        body: "Guide on the intelligence gap in facility-based customer engagement. Covers what data disappears after a facility visit, the cost of unmeasured showroom experiences, and how to transform a passive facility into an active engagement intelligence node.",
      },
      {
        heading: "Tertiary: ROX Calculator for Facilities",
        body: "Adapted ROX Calculator for facility context: qualified opportunities per facility visitor, value per engaged visitor, facility ROI attribution to pipeline outcomes.",
      },
    ],
  },
  {
    id: 4,
    label: "Outreach Sequences",
    sections: [
      {
        heading: "Touch 1 (Day 0)",
        body: "Subject: \"You spent $2M on the experience center. What did it return last quarter?\"\nPain: Heavy equipment dealers and OEMs invest heavily in customer-facing facilities. Most cannot quantify what those facilities contribute to pipeline.\nCTA: Facility ROX Audit",
      },
      {
        heading: "Touch 2 (Day 4)",
        body: "Subject: \"What happens when a customer walks out of your demo floor\"\nReference: Momentify's facility deployments. Connect showroom engagement to sales follow-up speed. The customer who spent 20 minutes with your large excavator display is a different follow-up than the customer who walked through in 3 minutes.\nCTA: 20-minute call",
      },
      {
        heading: "Touch 3 (Day 9)",
        body: "Subject: \"One question\"\nBody: \"How many customers visited your facility last quarter? How many turned into qualified pipeline conversations? Worth 20 minutes to close that gap?\"\nCTA: ROX Calculator",
      },
      {
        heading: "LinkedIn DM Flow",
        body: "DM 1: Reference their facility investment or a recent experience center project. One question about how they currently measure what those visits produce.\nDM 2 (Day 5): Drop the \"What Your Showroom Is Not Telling You\" guide with one sentence. No pitch.\nDM 3 (engaged): Offer the ROX Audit or a short call.",
      },
    ],
  },
  {
    id: 5,
    label: "Sales Enablement",
    sections: [
      {
        heading: "Discovery Opener",
        body: "\"When a customer tours your facility or demo floor, what does your team capture from that interaction, and when does it make it into your CRM?\"",
      },
      {
        heading: "Discovery Questions",
        body: "1. \"How many customer visits does your facility host in a typical month, and what types of visitors come through?\"\n2. \"After a facility tour, how does your sales team follow up, and how quickly?\"\n3. \"Do you have a way to know which products or areas of the facility a visitor engaged with most?\"\n4. \"What did your last major facility investment cost, and how do you measure whether it is contributing to sales outcomes?\"\n5. \"If you could know, in real time, that a visitor just spent 20 minutes with your large excavator display and is ready for a follow-up call, what would that change?\"",
      },
      {
        heading: "Objection Responses",
        body: "\u2022 \"We have a CRM.\" CRM captures what the sales rep logs after the fact. Momentify captures what the customer engaged with during the visit. Both are necessary. Only one currently exists in your facility.\n\u2022 \"Our visitors are already customers.\" A current customer who walks your demo floor and engages deeply with a new product line is a cross-sell opportunity. Knowing that in real time changes the follow-up.\n\u2022 \"Budget is in facilities, not marketing.\" The outcome is a marketing and sales outcome. Momentify is structured as a managed services engagement. No capex, no facilities project approval required.",
      },
    ],
  },
  {
    id: 6,
    label: "ROX Metrics + KPIs",
    sections: [
      {
        heading: "Facility-Specific ROX Dimensions",
        body: "\u2022 Visitor Capture Rate: registered engaged visitors vs total foot traffic\n\u2022 Engagement Depth: dwell time by area, content interactions, product interest signals\n\u2022 Follow-Up Speed: hours from facility visit to first sales outreach\n\u2022 Pipeline Conversion: facility visitors to qualified opportunities, by facility and by product area",
      },
      {
        heading: "Reporting Frame for Leadership",
        body: "\"Last quarter, [X] customers toured our experience center. Momentify identified [Y] as high-intent. Our sales team followed up within [Z] hours. [X] of those are now active pipeline.\"",
      },
      {
        heading: "Key Metrics to Track",
        body: "\u2022 Qualified opportunities per facility visitor\n\u2022 Value per engaged visitor\n\u2022 Dwell time by product area or zone\n\u2022 Facility contribution to pipeline vs other lead sources",
      },
    ],
  },
  {
    id: 7,
    label: "Competitive Intel: Facility & Experience Tech",
    sections: [
      {
        heading: "Competitive Landscape",
        body: "There is no direct named competitor for the Momentify facilities use case. The competition is the absence of a solution. Relevant adjacent categories: digital signage platforms (Daktronics, BrightSign, Signagelive), kiosk/interactive display vendors, and basic foot traffic counters (Density, Verkada).",
      },
      {
        heading: "Category Creation Opportunity",
        body: "This sale is not competitive displacement. It is category creation. The question is not \"why Momentify instead of X.\" It is \"why does your facility have no intelligence layer at all?\"",
      },
      {
        heading: "vs Digital Signage",
        body: "Digital signage delivers content to a screen. Momentify captures who engaged with what, how deeply, and what it means for sales follow-up. Signage is a delivery mechanism. Momentify is an intelligence layer.",
      },
      {
        heading: "vs Kiosk Vendors",
        body: "Kiosks collect form fills and static data entry. Momentify captures dynamic engagement behavior, persona signals, and product interest across the entire visit. Kiosks are a touchpoint. Momentify is a system.",
      },
      {
        heading: "vs Foot Traffic Counters",
        body: "Traffic counters tell you how many people walked through. Momentify tells you who they were, what they cared about, and whether they are a pipeline opportunity. Counting is not intelligence.",
      },
      {
        heading: "Killer Question",
        body: "\"If you could know which visitor who toured your facility last week is most likely to place an order in the next 90 days, would that change how your sales team spends their time tomorrow morning?\"",
      },
    ],
  },
]

/* ── Direct to Customer: Energy & Infrastructure ── */

const energyInfrastructureLayers: GTMLayer[] = [
  {
    id: 1,
    label: "ICP + Buyer Personas",
    sections: [
      {
        heading: "Primary Buyer",
        body: "Title: Marketing Director or Operations Experience Manager at utility, energy services company, or EPC firm\nFacility types: operations centers, energy solutions experience centers, training facilities, customer briefing rooms, innovation labs, field service centers",
      },
      {
        heading: "Anti-ICP",
        body: "\u2022 Back-office facilities with no customer traffic\n\u2022 Purely industrial sites without customer-facing components",
      },
    ],
  },
  {
    id: 2,
    label: "Core Message + Proof Points",
    sections: [
      {
        heading: "Headline",
        body: "Your operations center hosts customer visits. Do you know what those visits produced?",
      },
      {
        heading: "Key Insight",
        body: "Utilities and energy companies invest in customer briefing and innovation centers as relationship tools. None of them measure what those visits return in pipeline or relationship quality.",
      },
      {
        heading: "Proof Points",
        body: "\u2022 Fortune 75 Manufacturer deployed structured engagement intelligence at customer-facing facilities\n\u2022 Energy companies invest millions in experience and innovation centers with zero measurement layer\n\u2022 The same ROX framework that measures events can measure every facility visit in the same portfolio view",
      },
    ],
  },
  {
    id: 3,
    label: "Lead Magnets",
    sections: [
      {
        heading: "Primary: Energy Facility Experience ROX Audit",
        body: "Self-assessment for energy facility managers and marketing leaders. Evaluates how well customer briefing rooms, innovation labs, and training facilities capture visitor intelligence and contribute to pipeline.",
      },
      {
        heading: "Secondary: The Unmeasured Facility Investment",
        body: "Guide for energy marketing and operations leaders on why customer-facing facilities are the most expensive unmeasured touchpoint in the business. Covers the ROX framework applied to fixed locations.",
      },
    ],
  },
  {
    id: 4,
    label: "Outreach Sequences",
    sections: [
      {
        heading: "Touch 1 (Day 0)",
        body: "Subject: \"Your innovation center costs $X per year to operate. What does it return?\"\nPain: Energy companies build customer briefing rooms, innovation labs, and experience centers as relationship tools. Leadership assumes they add value. Nobody can prove it.\nCTA: Energy Facility ROX Audit",
      },
      {
        heading: "Touch 2 (Day 4)",
        body: "Subject: \"What your customer briefing room is not capturing\"\nReference: Momentify deployments that transformed passive facility visits into structured engagement data. Same ROX framework used for trade shows and field sales, now applied to fixed locations.\nCTA: 20-minute call",
      },
      {
        heading: "Touch 3 (Day 9)",
        body: "Subject: \"Quick question about your facility visits\"\nBody: \"How many customers toured your operations center or briefing room last quarter? How many became active pipeline conversations? The gap between those two numbers is what Momentify closes.\"\nCTA: ROX Calculator",
      },
    ],
  },
  {
    id: 5,
    label: "Sales Enablement",
    sections: [
      {
        heading: "Discovery Opener",
        body: "\"When a customer visits your operations center or briefing room, what does your team capture from that interaction, and how does it connect to your sales process?\"",
      },
      {
        heading: "Discovery Questions",
        body: "1. \"How many customer visits does your facility host per quarter, and what types of stakeholders come through?\"\n2. \"After a customer briefing or facility tour, how does your team follow up, and how quickly?\"\n3. \"Do you have visibility into which solutions or technology areas a visitor engaged with most during their visit?\"\n4. \"What did your customer-facing facility investment cost, and can you attribute any pipeline outcomes to it?\"\n5. \"If a visitor spent 30 minutes in your grid modernization display and asked detailed questions, would your sales team know about that the same day?\"",
      },
      {
        heading: "Objection Responses",
        body: "\u2022 \"We host these visits for relationship building, not lead generation.\" Relationship quality is measurable. Knowing what a customer cared about during their visit makes the next conversation more relevant. That is relationship intelligence, not lead gen.\n\u2022 \"Our facilities team manages this.\" The facility runs the visit. The sales team needs the intelligence. Momentify bridges that gap without adding work to either side.\n\u2022 \"We only host a few visits per quarter.\" That makes each one more valuable. A high-value customer visit with no structured capture is a missed intelligence opportunity.",
      },
    ],
  },
  {
    id: 6,
    label: "ROX Metrics + KPIs",
    sections: [
      {
        heading: "Energy Facility ROX Dimensions",
        body: "\u2022 Visitor Capture Rate: stakeholders engaged vs total facility visitors\n\u2022 Engagement Depth: solution areas explored, time with specific technology displays, questions captured\n\u2022 Follow-Up Speed: hours from facility visit to sales or BD outreach\n\u2022 Pipeline Conversion: facility visitors to qualified opportunities, by solution area",
      },
      {
        heading: "Reporting Frame for Leadership",
        body: "\"Last quarter, [X] customers visited our innovation center. Momentify identified [Y] high-intent visitors focused on [solution area]. Sales follow-up occurred within [Z] hours. [X] are now active pipeline conversations.\"",
      },
    ],
  },
  {
    id: 7,
    label: "Competitive Intel: Facility & Experience Tech",
    sections: [
      {
        heading: "Competitive Landscape",
        body: "Same as Heavy Equipment: no direct named competitor. The competition is the absence of any measurement layer for customer-facing facilities.",
      },
      {
        heading: "Energy-Specific Category Creation",
        body: "In energy and infrastructure, facility-based engagement intelligence does not exist as a category. Momentify creates it. Customer briefing rooms, innovation labs, and operations centers currently operate as unmeasured relationship investments.",
      },
      {
        heading: "Killer Question",
        body: "\"Your operations center hosts [X] customer visits per year. Can you tell me which of those visitors became active pipeline, and which solution area drove their interest? If not, that is exactly what Momentify measures.\"",
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
        body: "Title: Director of Client Services at an experience design or exhibit house firm that specializes in building dealer experience centers\nPartner types: exhibit house and experience design firms that design and build showrooms and experience centers for heavy equipment dealers and OEMs",
      },
      {
        heading: "Partner Pain",
        body: "Clients invest $500K to $5M in facility builds with no measurement layer. The firm cannot prove the ROI of their design work. Momentify makes that possible.",
      },
      {
        heading: "Anti-ICP",
        body: "\u2022 Residential or retail interior design firms\n\u2022 Firms that do not specialize in customer-facing industrial or commercial facilities",
      },
    ],
  },
  {
    id: 2,
    label: "Partner Message",
    sections: [
      {
        heading: "Headline",
        body: "You design the experience. Momentify proves what it returns.",
      },
      {
        heading: "Partner Pitch",
        body: "Your clients spend millions on experience centers and have no way to measure what they produce. Add Momentify to every facility build. Your clients get ROX visibility. You differentiate your firm with a measurable outcomes guarantee.",
      },
      {
        heading: "Co-Sell Model",
        body: "Design firm delivers the experience. Momentify delivers the intelligence layer. Client gets a facility that does not just look world-class but proves its value to the business. The design firm adds a recurring revenue stream and a measurable differentiator.",
      },
    ],
  },
  {
    id: 3,
    label: "Lead Magnets",
    sections: [
      {
        heading: "Primary: Partner Intelligence Briefing",
        body: "30-minute briefing for experience design firm leaders on how to add a measurement layer to every facility build. Covers the ROX framework, client value proposition, and revenue model.",
      },
      {
        heading: "Secondary: The Measurable Experience Center Playbook",
        body: "Gated PDF for exhibit and experience design firms. How to position engagement intelligence as part of every facility proposal. Includes case study framework and pricing guidance.",
      },
    ],
  },
  {
    id: 4,
    label: "Outreach Sequences",
    sections: [
      {
        heading: "Touch 1 (Day 0)",
        body: "Subject: \"Your client's experience center is beautiful. Can they prove what it returns?\"\nPain: Experience design firms build stunning facilities for their clients. But when leadership asks what those facilities contributed to sales, neither the client nor the design firm has an answer.\nCTA: Partner Intelligence Briefing",
      },
      {
        heading: "Touch 2 (Day 4)",
        body: "Subject: \"Add measurement to every facility build\"\nReference: How design firms using Momentify differentiate their proposals by including an engagement intelligence layer. The client gets ROX visibility. The firm gets recurring revenue and a competitive edge.\nCTA: 20-minute call",
      },
      {
        heading: "Touch 3 (Day 9)",
        body: "Subject: \"First-mover advantage in facility intelligence\"\nBody: \"No exhibit design firm currently offers a measurement layer post-build. This is a first-mover opportunity. Worth a quick look at how it works?\"\nCTA: Short call",
      },
    ],
  },
  {
    id: 5,
    label: "Sales Enablement",
    sections: [
      {
        heading: "Discovery Opener",
        body: "\"When your clients open their new experience center, how do they measure whether the design is actually driving the business outcomes they invested in?\"",
      },
      {
        heading: "Discovery Questions",
        body: "1. \"How many experience center or showroom projects does your firm complete per year?\"\n2. \"After a facility opens, do your clients ever come back asking you to prove the ROI of the build?\"\n3. \"Have any of your clients asked for a measurement or analytics layer as part of the facility design?\"\n4. \"What would it mean for your firm if every proposal included a measurable outcomes guarantee?\"\n5. \"How do you currently differentiate from other experience design firms in competitive pitches?\"",
      },
      {
        heading: "Objection Responses",
        body: "\u2022 \"Our clients have not asked for this.\" They will. As facility investments grow, leadership will demand measurement. The question is whether your firm brings that capability first or a competitor does.\n\u2022 \"We are a design firm, not a technology company.\" Exactly. Momentify is the technology layer. Your firm is the design expertise. Together, you deliver a facility that is both beautiful and measurable. No capability gap on either side.\n\u2022 \"Adding technology complicates the build.\" Momentify is an overlay, not an infrastructure project. It deploys after the build is complete and requires no changes to the facility design.",
      },
    ],
  },
  {
    id: 6,
    label: "ROX Metrics + KPIs",
    sections: [
      {
        heading: "Partner-Specific ROX Dimensions",
        body: "\u2022 Client-Facing Metrics: visitor engagement scores, product area dwell time, pipeline attribution by facility\n\u2022 Partner Metrics: facilities deployed, recurring revenue per facility, client retention and expansion\n\u2022 Operational: time from facility open to Momentify live, client team training and adoption",
      },
      {
        heading: "Partner Reporting Frame",
        body: "\"We deployed Momentify at [X] client facilities. Each facility now captures structured visitor engagement data, with an average of [Y] high-intent visitors identified per month. Clients have a direct line from facility visit to pipeline for the first time.\"",
      },
    ],
  },
  {
    id: 7,
    label: "Competitive Intel",
    sections: [
      {
        heading: "Competitive Landscape",
        body: "No exhibit design firm currently offers a measurement layer post-build. This is a first-mover opportunity for the right partner. The competitive set is other design firms who cannot prove their work drives business outcomes.",
      },
      {
        heading: "Win Condition",
        body: "The firm that adds engagement intelligence to its facility builds differentiates on outcomes, not just aesthetics. Momentify is the only platform that ties facility visitor engagement to pipeline outcomes using the ROX framework.",
      },
      {
        heading: "Killer Question",
        body: "\"When your client's CEO asks whether the $3M experience center was worth it, what does your client say today? And what could they say if every visitor interaction was measured?\"",
      },
    ],
  },
]

/* ── Comparison Table ── */

export const comparisonTable = {
  headers: [
    "Capability",
    "Momentify",
    "Digital Signage",
    "Kiosk Vendors",
    "Foot Traffic Counters",
  ],
  rows: [
    [
      "Visitor intent capture",
      "Yes",
      "No. Delivery only",
      "Partial. Form fills only",
      "No. Count only",
    ],
    [
      "Engagement quality scoring",
      "Yes",
      "No",
      "No",
      "No",
    ],
    [
      "ROX reporting tied to pipeline",
      "Yes",
      "No",
      "No",
      "No",
    ],
    [
      "Connects to CRM and sales follow-up",
      "Yes",
      "No",
      "No",
      "No",
    ],
    [
      "Works across facility types and events",
      "Yes. Unified layer",
      "No. Fixed install",
      "No. Fixed install",
      "No",
    ],
    [
      "Industry-specific templates",
      "Yes",
      "Generic",
      "Generic",
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
        vertical: "heavy-equipment",
        label: "Heavy Equipment",
        layers: heavyEquipmentLayers,
      },
      {
        vertical: "energy-infrastructure",
        label: "Energy & Infrastructure",
        layers: energyInfrastructureLayers,
      },
    ],
  },
  {
    motion: "partner",
    label: "Channel Partners",
    verticals: [
      {
        vertical: "heavy-equipment",
        label: "All Verticals",
        layers: channelPartnerLayers,
      },
    ],
  },
]

/* ── Persona Feature Mapping ── */

export const personaFeatureMap: PersonaFeatureMap[] = [
  {
    persona: "Facility Manager / Showroom Manager / Experience Center Director",
    rows: [
      {
        painPoint: "No structured way to capture visitor behavior during tours",
        objective: "Capture visitor engagement data across every facility zone",
        kpi: "Visitors captured, engagement signals per visit",
        primaryFeatures: "Zone-Based Engagement Capture with persona tagging",
        secondaryFeatures: "Device naming by area, interactive touchpoints",
        competitiveAdvantage: "Captures who engaged with what, not just who walked through the door",
      },
      {
        painPoint: "Cannot connect facility visits to sales outcomes",
        objective: "Provide sales team with real-time visitor intelligence for follow-up",
        kpi: "Follow-up speed, pipeline from facility visits",
        primaryFeatures: "Real-Time Sales Alerts with visitor engagement context",
        secondaryFeatures: "CRM integration, visit summary export",
        competitiveAdvantage: "Sales team knows what the visitor cared about before making the follow-up call",
      },
      {
        painPoint: "No ROI data for facility investment decisions",
        objective: "Generate ROX reports that justify facility spend to leadership",
        kpi: "Facility ROX score, pipeline attribution",
        primaryFeatures: "Facility ROX Dashboard with zone-level analytics",
        secondaryFeatures: "Trend reporting, benchmark comparison",
        competitiveAdvantage: "First platform that ties showroom engagement to pipeline outcomes with a structured scoring framework",
      },
      {
        painPoint: "Inconsistent visitor experience across facility zones",
        objective: "Standardize engagement paths with persona-driven content flows",
        kpi: "Content consistency %, engagement depth by zone",
        primaryFeatures: "Persona-Driven Facility Flows with guided visitor journeys",
        secondaryFeatures: "Template library, staff training tools",
        competitiveAdvantage: "Every visitor gets a tailored experience based on who they are and what they care about",
      },
    ],
  },
  {
    persona: "VP of Marketing / VP of Sales / Director of Customer Experience",
    rows: [
      {
        painPoint: "Facility investment with no measurable business outcome",
        objective: "Prove facility ROI with pipeline and revenue attribution",
        kpi: "Pipeline from facility visitors, ROX score trend",
        primaryFeatures: "Pipeline Attribution from facility engagement to CRM opportunity",
        secondaryFeatures: "Executive dashboard, quarterly ROX reporting",
        competitiveAdvantage: "Transforms the facility from a cost center to a measurable pipeline contributor",
      },
      {
        painPoint: "No visibility into what visitors engage with most",
        objective: "Understand product interest signals and dwell patterns",
        kpi: "Zone engagement %, product area interest ranking",
        primaryFeatures: "Engagement Heatmaps with product area and zone analytics",
        secondaryFeatures: "Visitor persona breakdown, content effectiveness",
        competitiveAdvantage: "Data-driven decisions on where to invest in facility upgrades and which products to feature",
      },
      {
        painPoint: "Facility and event data live in separate systems",
        objective: "Unified portfolio view across events and facilities",
        kpi: "Total ROX across all engagement touchpoints",
        primaryFeatures: "Unified ROX Portfolio across events, facilities, and field interactions",
        secondaryFeatures: "Cross-channel visitor tracking, consolidated reporting",
        competitiveAdvantage: "One platform, one framework, one view across every customer-facing interaction",
      },
      {
        painPoint: "Sales team does not leverage facility visit intelligence",
        objective: "Close the loop between facility engagement and sales follow-up",
        kpi: "Follow-up rate from facility visits, conversion rate",
        primaryFeatures: "Sales Alert System with engagement-based visitor prioritization",
        secondaryFeatures: "Automated CRM record creation, follow-up templates",
        competitiveAdvantage: "Sales reps receive visitor intelligence the same day, not weeks later through word of mouth",
      },
    ],
  },
]

/* ── Lead Magnets ── */

export const leadMagnets: LeadMagnet[] = [
  {
    title: "The Facility Experience ROX Audit",
    format: "Self-Assessment Tool",
    audience: "Dealer Principals, Experience Center Managers, VP of Marketing",
    problem: "No structured way to evaluate how well a customer-facing facility captures visitor intelligence and contributes to pipeline",
    featureHighlighted: "ROX Framework, Facility Engagement Analytics",
    delivery: "Interactive web-based assessment with PDF report output",
    sections: [
      { heading: "Visitor Capture Rate", body: "How many of your facility visitors are captured with structured data? What percentage leave without any record of their visit?" },
      { heading: "Engagement Depth", body: "Do you know which products, zones, or displays each visitor engaged with? Can you measure dwell time and interaction quality?" },
      { heading: "Follow-Up Speed", body: "How long between a facility visit and a sales follow-up? Is the follow-up informed by what the visitor actually experienced?" },
      { heading: "Pipeline Conversion", body: "Can you attribute pipeline or revenue to specific facility visits? Do you know your conversion rate from visitor to qualified opportunity?" },
    ],
  },
  {
    title: "What Your Showroom Is Not Telling You",
    format: "PDF Guide",
    audience: "VP of Marketing, VP of Sales, Director of Customer Experience",
    problem: "Customer-facing facilities are the most expensive unmeasured touchpoint in the business. Leadership assumes they add value but cannot prove it.",
    featureHighlighted: "Facility ROX Dashboard, Pipeline Attribution",
    delivery: "Gated PDF download via landing page",
    sections: [
      { heading: "The Measurement Gap", body: "Companies invest millions in showrooms and experience centers. Most cannot answer a basic question: what did that facility contribute to pipeline last quarter?" },
      { heading: "What Disappears After the Visit", body: "Visitor engagement with specific products. Questions that signal buying intent. Persona-level interest data. Cross-sell signals from existing customers exploring new product lines." },
      { heading: "The Cost of Unmeasured Experiences", body: "Without measurement, facility investments are justified by anecdote. Leadership sees cost, not outcomes. Next year's budget is a negotiation, not a data-driven decision." },
      { heading: "Transforming the Facility into an Intelligence Node", body: "The same ROX framework that measures events can measure every facility visit. Every visitor interaction becomes a data point. Every demo becomes a scored event." },
    ],
  },
  {
    title: "ROX Calculator for Facilities",
    format: "Interactive Web Tool",
    audience: "VP of Marketing, VP of Sales, CFO",
    problem: "No way to quantify the value of facility visitor engagement or the ROI of experience center investments",
    featureHighlighted: "ROX Dashboard, Pipeline Attribution, Facility Analytics",
    delivery: "Ungated interactive tool with optional email gate for detailed report",
    sections: [
      { heading: "Input Your Facility Metrics", body: "Enter annual facility visitors, facility operating cost, average deal size, and current conversion rate from facility visits." },
      { heading: "Engagement Quality Score", body: "Estimate how much visitor engagement data your facility captures today. The calculator shows the gap between captured and available intelligence." },
      { heading: "Pipeline Impact Model", body: "See how improved visitor capture and follow-up speed translate to pipeline attribution and facility ROI." },
      { heading: "ROX Score Output", body: "Receive a composite ROX score across four facility dimensions: Visitor Capture Rate, Engagement Depth, Follow-Up Speed, and Pipeline Conversion." },
    ],
  },
  {
    title: "Facility Engagement Zones Playbook",
    format: "Visual Guide",
    audience: "Facility Managers, Experience Center Directors, Marketing Operations",
    problem: "Facility layouts are designed for aesthetics and flow, not for structured engagement capture",
    featureHighlighted: "Zone-Based Engagement, Device Configuration, Persona Flows",
    delivery: "Gated PDF download, print-ready for facility planning sessions",
    sections: [
      { heading: "Zone Your Facility by Visitor Intent", body: "Divide your facility into zones based on what visitors want to accomplish: explore products, evaluate capabilities, or connect with experts. Each zone gets its own content path and capture mechanism." },
      { heading: "Place Interactive Touchpoints Strategically", body: "Position Momentify devices at natural stopping points. Engagement increases when visitors encounter relevant content at the moment they are most receptive." },
      { heading: "Design for Multiple Visitor Types", body: "Operators want to see the equipment. Engineers want specs. Decision-makers want outcomes and ROI. Design content paths that serve each visitor type." },
      { heading: "Connect Zones to Sales Follow-Up", body: "Each zone generates engagement data that feeds directly into sales follow-up workflows. The visitor who spent 20 minutes in the excavator zone gets a different follow-up than the one who focused on service and parts." },
    ],
  },
  {
    title: "Facility ROI Attribution Framework",
    format: "Educational PDF",
    audience: "CFO, VP of Marketing, VP of Sales, Facilities Leadership",
    problem: "No structured framework for connecting facility investment to business outcomes",
    featureHighlighted: "ROX Framework, Pipeline Attribution, Portfolio Analytics",
    delivery: "Gated download, included in proposals for facility intelligence projects",
    sections: [
      { heading: "The Attribution Challenge", body: "Facility investments are justified by assumptions, not data. The showroom looks great, but leadership cannot connect a visitor walk-through to a purchase order." },
      { heading: "The ROX Framework Applied to Facilities", body: "Four dimensions of facility ROX: Visitor Capture, Engagement Quality, Follow-Up Speed, and Pipeline Conversion. Each dimension is measurable and benchmarkable." },
      { heading: "Building the Data Pipeline", body: "How Momentify connects facility engagement data to CRM, enabling attribution from visitor interaction to closed deal." },
      { heading: "Quarterly Reporting Model", body: "Template for quarterly facility ROX reports to leadership. Includes visitor volume, engagement quality, pipeline attribution, and facility-to-facility comparison." },
    ],
  },
]

/* ── LinkedIn Outreach Templates ── */

export const linkedInOutreach: LinkedInOutreach[] = [
  {
    segment: "Heavy Equipment Dealers and OEMs",
    subsegment: "VP of Marketing, Dealer Principals",
    message: "You built a showroom or experience center that customers visit regularly. But when leadership asks what those visits contributed to pipeline, the answer is usually anecdotal. We help facility operators capture structured visitor engagement data during every tour, demo, and walk-through. So the showroom is not just impressive. It is measurable.",
  },
  {
    segment: "Energy and Infrastructure",
    subsegment: "Marketing Directors, Operations Leaders",
    message: "Your operations center or innovation lab hosts customer visits that shape long-term relationships and procurement decisions. But none of that engagement is structured or measured. We help energy companies capture visitor intelligence from every facility interaction, so leadership can see what those visits actually produce. Same ROX framework used at events, now applied to your fixed locations.",
  },
  {
    segment: "Experience Design and Exhibit Firms",
    subsegment: "Client Services Directors",
    message: "Your firm designs world-class experience centers. Your clients invest millions. But when their CEO asks what the facility returned, neither you nor the client has a data-driven answer. We help design firms add a measurement layer to every facility build. Your clients get ROX visibility. You differentiate with a measurable outcomes guarantee. No exhibit design firm currently offers this. First-mover advantage is real.",
  },
  {
    segment: "Dealer Experience Centers",
    subsegment: "Dealer Principals, Regional VPs",
    message: "Your dealer experience center is your most expensive customer touchpoint. Customers walk the floor, engage with products, and leave. Your sales team follows up based on memory and guesswork. We help dealers capture what visitors actually engaged with during their visit, so follow-up is specific, fast, and informed by real data.",
  },
]

/* ── ENTEVATE Positioning ── */

export const entevatePositioning = {
  headline: "Beyond the Platform: ENTEVATE as Your Facility Intelligence Partner",
  subhead: "Momentify is the technology. ENTEVATE is the expertise that transforms customer-facing facilities from passive spaces into active intelligence assets.",
  expertiseAreas: [
    {
      title: "Experience Center Intelligence",
      description: "Where companies invest millions in showrooms and demo floors with no measurement layer. ENTEVATE deploys Momentify as the intelligence overlay that proves facility ROI without changing the physical design.",
    },
    {
      title: "Facility-to-Pipeline Attribution",
      description: "Where leadership needs to see the line from facility visit to pipeline. ENTEVATE builds the data pipeline that connects visitor engagement to CRM opportunity, giving CFOs the ROI data they need.",
    },
    {
      title: "Zone-Based Engagement Design",
      description: "Where facility layouts need structured engagement capture without disrupting the visitor experience. ENTEVATE designs touchpoint placement, content paths, and capture flows that feel natural, not intrusive.",
    },
    {
      title: "Unified Portfolio Intelligence",
      description: "Where the same customer visits a facility AND attends an event. ENTEVATE ensures both interactions are captured in a single ROX view, giving sales and marketing a complete picture of customer engagement.",
    },
    {
      title: "Partner Enablement for Design Firms",
      description: "Where exhibit and experience design firms want to add measurement to their builds. ENTEVATE provides the partnership model, training, and deployment support that makes the design firm's value proposition measurable.",
    },
  ],
  capabilities: [
    "Managed services deployment for facilities that need results without IT infrastructure projects",
    "Zone-based engagement configuration tailored to each facility's layout and visitor flow",
    "CRM integration with real-time visitor intelligence for same-day sales follow-up",
    "Unified ROX reporting across events, facilities, and field interactions in one portfolio view",
  ],
  industries: [
    "Heavy Equipment and Construction",
    "Energy and Infrastructure",
    "Industrial Manufacturing and Distribution",
    "Experience Design and Exhibit Firms",
  ],
  differentiators: [
    "Faster deployment because Momentify is an overlay, not an infrastructure project. No construction required.",
    "Smarter configuration because the team understands how visitors engage in industrial and technical facilities",
    "Better outcomes because facility engagement is measured with the same ROX framework as events, enabling portfolio-level intelligence",
  ],
}
