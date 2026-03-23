/* ═══════════════════════════════════════════════════════════════
   Trade Shows & Exhibits — GTM Framework Data
   All content exported as typed constants.
   ═══════════════════════════════════════════════════════════════ */

export type GTMLayer = {
  id: number
  label: string
  sections: { heading?: string; body: string }[]
}

export type VerticalTrack = {
  vertical: "heavy-equipment" | "energy-infrastructure" | "aerospace-aviation"
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
        body: "Title: VP of Marketing or VP of Sales at OEM, large dealer group, or equipment dealer\nCompany: $50M+ revenue, exhibits at 5+ shows per year\nShows: CONEXPO, MINExpo, BAUMA, World of Concrete, ICUEE",
      },
      {
        heading: "Secondary Buyer",
        body: "Title: Event Manager or Trade Show Coordinator\nThey execute, the VP approves spend",
      },
      {
        heading: "Goals",
        body: "\u2022 Justify event budget to leadership with numbers, not stories\n\u2022 Stop leads from dying in a spreadsheet after the show\n\u2022 Show pipeline contribution from shows in the CRM",
      },
      {
        heading: "Blockers",
        body: "\u2022 \"We already use Cvent or Whova\" \u2014 Momentify sits above those tools, not replacing them\n\u2022 \"IT will need to review this\" \u2014 position as a managed services engagement, not software",
      },
      {
        heading: "Budget Authority",
        body: "Marketing VP owns the line item, CFO approves anything over $25K\nEvent Manager influences but does not approve",
      },
      {
        heading: "Trigger Events",
        body: "\u2022 Just wrapped a major show with no clean follow-up story for leadership\n\u2022 New VP Marketing who wants accountability and data\n\u2022 Lost a deal that started at a show and went undocumented",
      },
    ],
  },
  {
    id: 2,
    label: "Core Message + Proof Points",
    sections: [
      {
        heading: "Headline",
        body: "\"You built the experience. You just can't prove it yet.\"",
      },
      {
        heading: "Subhead",
        body: "\"Momentify turns booth traffic into intelligence your leadership can see.\"",
      },
      {
        heading: "Key Differentiator",
        body: "Portfolio-level ROX visibility across all your shows, not just one event. No other tool in the market gives an event manager a single view across Cvent, Whova, badge scanners, and their CRM.",
      },
      {
        heading: "Proof Points",
        body: "\u2022 250+ leads captured and qualified at a single major trade show with 40% lead qualification improvement\n\u2022 $411M in potential value generated across 50+ events in 18 months\n\u2022 Follow-up speed went from days to hours with Momentify-triggered CRM sync",
      },
      {
        heading: "Objection Handling",
        body: "\u2022 \"Our badge scanner does this\" \u2014 Badge scanning captures presence. Momentify captures intent. Those are different things.\n\u2022 \"We use Cvent already\" \u2014 Cvent manages logistics. Momentify tells you what actually happened and what to do next.\n\u2022 \"We don't have budget\" \u2014 What is the cost of not knowing which $200K show is working and which is not?\n\u2022 \"We need IT involved\" \u2014 Structured as a managed services engagement to stay out of IT procurement",
      },
    ],
  },
  {
    id: 3,
    label: "Lead Magnets",
    sections: [
      {
        heading: "Primary: The Heavy Equipment Trade Show ROX Audit",
        body: "Format: 10-question self-assessment, scores their current event ROX\nGate: email required for score + recommendations\nDelivery: score + automated 3-email nurture sequence over 7 days",
      },
      {
        heading: "Secondary: The CONEXPO Intelligence Playbook",
        body: "Format: gated PDF guide\nHook: practical pre/during/post show playbook using ROX framework",
      },
      {
        heading: "Tertiary: ROX Calculator",
        body: "Live at momentifyapp.com/rox-calculator\nUse as a bottom-of-funnel touch with heavy equipment framing",
      },
    ],
  },
  {
    id: 4,
    label: "Outreach Sequences",
    sections: [
      {
        heading: "Cold Email: Touch 1 (Day 0)",
        body: "Subject: \"What did [Event] actually return?\"\nLead with the industry context: average heavy equipment exhibitor spends $150K to $300K per major show. Most walk away with a badge scan list and a spreadsheet nobody owns.\nPain: leadership wants to know what came back. The answer is usually \"we generated a lot of interest.\"\nCTA: link to ROX Audit. Framed as a benchmark, not a sales page.",
      },
      {
        heading: "Cold Email: Touch 2 (Day 4)",
        body: "Subject: \"How one exhibitor changed this\"\nLead with the result: 250+ qualified leads, 40% lead qualification improvement, follow-up in hours not days.\nTransition: \"Takes about 20 minutes to see how this maps to your setup.\"\nCTA: short demo call or 3-minute video walkthrough",
      },
      {
        heading: "Cold Email: Touch 3 (Day 9)",
        body: "Subject: \"Last one, then I will leave you alone\"\nShort. Human. No pressure.\nBody: \"Here is the ROX Calculator if nothing else. Takes 2 minutes and you will have a number to take into your next budget conversation.\"\nCTA: ROX Calculator link",
      },
      {
        heading: "LinkedIn DM Flow",
        body: "DM 1: Reference a specific show they exhibit at (research their LinkedIn or company site first). Ask one sharp question about what their post-show process looks like. No pitch.\nDM 2 (Day 5, no reply): Drop the ROX Audit link with one sentence of context. Nothing else.\nDM 3 (if they engage): Move to call or send the Momentify one-pager directly in the thread.",
      },
    ],
  },
  {
    id: 5,
    label: "Sales Enablement",
    sections: [
      {
        heading: "Discovery Opener",
        body: "\"Walk me through what happens to your leads after the show closes. Who owns that process and where do they live?\"",
      },
      {
        heading: "Top 5 Discovery Questions",
        body: "1. \"How many shows do you run per year and who owns follow-up for each one?\"\n2. \"What does your leadership expect to see after a show like CONEXPO in terms of results?\"\n3. \"How long does it typically take your team to get show leads into your CRM?\"\n4. \"If you could change one thing about how you report on event performance, what would it be?\"\n5. \"Have you ever lost a deal you traced back to a booth conversation that fell through the cracks?\"",
      },
      {
        heading: "Objection Responses",
        body: "\u2022 \"We already use Cvent / Whova\" \u2014 \"Good. We do not replace either of those. Momentify sits above them. You keep your existing stack. We give you the layer that tells you what worked across all of it.\"\n\u2022 \"We have a badge scanner\" \u2014 \"Badge scanners tell you someone was there. We tell you what they cared about, how long they engaged, and who your team needs to follow up with first.\"\n\u2022 \"Not in budget right now\" \u2014 \"What is the number you need to show leadership to justify the next show? That is exactly the number Momentify produces.\"\n\u2022 \"IT needs to approve software\" \u2014 \"We have structured this as a managed services engagement specifically to keep it out of the IT procurement process. No deployment, no integration required on your end.\"",
      },
      {
        heading: "One-Pager",
        body: "Caterpillar Electric Power case study and ROX one-pager",
      },
    ],
  },
  {
    id: 6,
    label: "ROX Metrics + KPIs",
    sections: [
      {
        heading: "Four Scored Dimensions (0 to 100)",
        body: "\u2022 Lead Capture Efficiency: leads captured vs estimated booth traffic\n\u2022 Engagement Quality: time in booth, content interactions, persona completeness score\n\u2022 Follow-Up Speed: hours from capture to first CRM touch\n\u2022 Conversion Effectiveness: MQL rate, pipeline attributed to the show",
      },
      {
        heading: "ROX Scoring Tiers",
        body: "\u2022 0 to 39: Critical Gap\n\u2022 40 to 69: Needs Optimization\n\u2022 70 to 84: High ROX\n\u2022 85 to 100: Elite ROX",
      },
      {
        heading: "Executive Reporting Framing",
        body: "\"For every $X spent on the show, Momentify helped us identify $Y in qualified pipeline within 48 hours of the show closing.\"",
      },
      {
        heading: "Report Cadence",
        body: "Live dashboard during event, 7-day post-show summary, 30-day pipeline attribution update",
      },
    ],
  },
  {
    id: 7,
    label: "Competitive Intel",
    sections: [
      {
        heading: "Comparison Table",
        body: "See structured table in the page component.",
      },
      {
        heading: "vs Cvent",
        body: "\"Cvent is the logistics platform. It manages registrations, floor plans, and schedules. It does not measure what happened in the booth or who was worth following up with. If your client uses Cvent, Momentify does not replace it. We complete it.\"\nWin condition: client is frustrated that Cvent gives them logistics but no post-show intelligence.",
      },
      {
        heading: "vs Whova",
        body: "\"Whova is built for conference attendee engagement. It is not designed for exhibitor intelligence or post-show sales follow-up in a B2B heavy equipment context. Its lead capture is a feature, not a framework.\"\nWin condition: client is using Whova's lead capture feature and complaining about data quality or follow-up speed.",
      },
      {
        heading: "vs Hopin",
        body: "\"Hopin is a virtual and hybrid event platform. If the conversation is about in-person trade show performance, Hopin is not in the room. If it comes up, it means the client is conflating virtual event tools with in-person engagement intelligence.\"\nWin condition: this competitor rarely comes up for pure trade show buyers. If it does, reframe the conversation around in-person ROX specifically.",
      },
      {
        heading: "How to Win",
        body: "1. \"We do not replace. We complete.\" Momentify never asks clients to remove their existing stack. It adds the intelligence layer above it. This removes the competitive threat framing entirely.\n2. Lead with the ROX framework. No competitor has a named, proprietary scoring framework. ROX is defensible IP. Make the conversation about scoring methodology, not features.\n3. Use the portfolio argument. Event managers running 20+ shows per year across multiple vendors have no unified view. Cvent, Whova, and badge scanners each create a silo. Momentify closes that gap. No competitor in this category does this.",
      },
    ],
  },
]

/* ── Direct to Customer: Energy & Infrastructure ── */

const energyLayers: GTMLayer[] = [
  {
    id: 1,
    label: "ICP + Buyer Personas",
    sections: [
      {
        heading: "Primary Buyer",
        body: "Marketing Director, Communications Lead, or VP of Marketing at utility, grid operator, EPC contractor, data center operator, or power systems manufacturer",
      },
      {
        heading: "Secondary Buyer",
        body: "Government Affairs Manager, Sustainability Program Manager, or Business Development lead pitching new infrastructure clients",
      },
      {
        heading: "Target Company Types",
        body: "\u2022 Technology and software providers (Smart Grid, AI, DERMS)\n\u2022 Equipment manufacturers and suppliers (T&D, power distribution)\n\u2022 EPC and engineering firms\n\u2022 Renewable energy integration specialists\n\u2022 Cybersecurity and data management firms\n\u2022 Utility service providers\n\u2022 Data center operators and colocation providers",
      },
      {
        heading: "Shows",
        body: "DistribuTECH, POWER-GEN International, CERAWeek, ADIPEC, IEEE PES, Data Center World",
      },
      {
        heading: "Buyer Reality",
        body: "Engineers validate claims. Executives test strategy. Procurement evaluates risk, scope, and fit. These interactions are expensive and difficult to support. Most teams leave events with limited clarity on what actually moved the conversation forward.",
      },
      {
        heading: "Goals",
        body: "\u2022 Build pipeline in a relationship-driven, long-cycle industry\n\u2022 Prove marketing drives revenue, not just awareness\n\u2022 Enable non-subject matter experts to engage visitors professionally\n\u2022 Create a shared view across marketing, sales, engineering, and leadership",
      },
      {
        heading: "Blockers",
        body: "\u2022 Long internal approval cycles\n\u2022 Reports to VP of Communications not Marketing\n\u2022 \"Our deals take 18 months\"\n\u2022 Multi-stakeholder buying committees with conflicting criteria",
      },
      {
        heading: "Trigger Events",
        body: "\u2022 Upcoming major conference\n\u2022 New budget year\n\u2022 Previous show had no measurable outcome\n\u2022 Grid modernization initiative or data center expansion project",
      },
    ],
  },
  {
    id: 2,
    label: "Core Message + Proof Points",
    sections: [
      {
        heading: "Headline",
        body: "\"Your buyers came to the booth. Do you know which ones were serious?\"",
      },
      {
        heading: "Secondary Headline",
        body: "\"Turning Exhibit Conversations Into Decision-Grade Insight\"",
      },
      {
        heading: "Key Differentiator",
        body: "Intent scoring across long sales cycles. First-touch intelligence matters most when deals take 18 months. Exhibits influence decisions only when insight is captured during the experience, not reconstructed afterward.",
      },
      {
        heading: "The Momentify Approach",
        body: "Momentify structures the exhibit experience with role-aware, objective-driven journeys. It anchors engagement around visitor goals, captures intent and constraints in real time, connects insight to specific demos and content, and creates a shared view across all stakeholders.",
      },
      {
        heading: "Proof Point",
        body: "Fortune 75 Manufacturer DistribuTECH program data (use \"Fortune 75 Manufacturer\" label, not company name)",
      },
      {
        heading: "Field Sales Enablement",
        body: "The same insight captured in the exhibit travels with the account into the field. Sales teams pick up the conversation where it left off, not where memory starts.",
      },
      {
        heading: "Key Objection",
        body: "\"Our sales cycle is 18 months.\" Counter: \"That is exactly why the first conversation matters. The one you do not document today is the deal you lose in month 14.\"",
      },
    ],
  },
  {
    id: 3,
    label: "Lead Magnets",
    sections: [
      {
        heading: "Primary",
        body: "\"Measuring Intent at High-Stakes Industry Events.\" Guide for energy, infrastructure, and data center event marketers.",
      },
      {
        heading: "Secondary",
        body: "Energy & Infrastructure ROX benchmark one-pager (anonymous industry data)",
      },
      {
        heading: "Full Library",
        body: "All lead magnets from the shared library apply: Top 10 Booth Mistakes checklist, ROX Calculator, Engagement-Driven Booth Field Guide, Instant Lead Capture Toolkit, Lead Routing Guide, Post-Show Follow-Up Templates, Trade Show Readiness Checklist, and Momentify for Exhibitors Case Study.",
      },
    ],
  },
  {
    id: 4,
    label: "Outreach Sequences",
    sections: [
      {
        heading: "Cold Email Touch 1",
        body: "Lead with the long-cycle pain. \"Most energy and infrastructure deals start with a booth conversation that never gets documented.\"",
      },
      {
        heading: "Cold Email Touch 2",
        body: "Reference DistribuTECH, POWER-GEN, or Data Center World specifically. Offer the intent measurement guide.",
      },
      {
        heading: "Cold Email Touch 3",
        body: "Short. ROX Calculator framed for energy: \"What is one qualified relationship from DistribuTECH worth to your pipeline?\"",
      },
      {
        heading: "LinkedIn DM",
        body: "Lead with an observation about the gap between the relationship you build at a show and the CRM record that comes from it. No pitch in DM 1.",
      },
      {
        heading: "Segment: Technology Providers (Smart Grid, AI, DERMS)",
        body: "Help companies capture real buyer intent during booth conversations instead of badge scans and post-event guesswork. Focus on the gap between what their platform can do and what the buyer actually needs.",
      },
      {
        heading: "Segment: Manufacturers (T&D Equipment, Hardware)",
        body: "Help teams capture what engineers, operators, and procurement leaders care about during exhibit interactions. Equipment decisions involve multiple evaluators. Momentify ensures their input is captured.",
      },
      {
        heading: "Segment: EPC and Engineering Firms",
        body: "Help bring more structure to exhibit and facility conversations where scope, constraints, and timelines are discussed. These conversations shape project direction. Momentify makes them retrievable.",
      },
      {
        heading: "Segment: Renewable Energy Integration",
        body: "Help exhibitors capture real-world integration concerns and priorities during live exhibit conversations. Buyers are evaluating interoperability, grid impact, and regulatory fit.",
      },
      {
        heading: "Segment: Cybersecurity and Data Management",
        body: "Support companies exhibiting complex infrastructure solutions by capturing structured insight during technical conversations. Security conversations involve compliance requirements and risk tolerance that standard lead capture misses.",
      },
    ],
  },
  {
    id: 5,
    label: "Sales Enablement",
    sections: [
      {
        heading: "Discovery Opener",
        body: "\"In a market where deals take 18 months, what happens to the relationships you build at shows between month 1 and month 12?\"",
      },
      {
        heading: "Key Probes",
        body: "Documentation process, CRM adoption on the show floor, how they define a qualified booth conversation, multi-stakeholder coverage per account",
      },
      {
        heading: "ENTEVATE as Strategic Partner",
        body: "Beyond the platform: deep expertise in data centers and power systems. ENTEVATE brings specialized knowledge in the environments where Momentify is deployed.",
      },
      {
        heading: "ENTEVATE Expertise Areas",
        body: "\u2022 High-Stakes Decision Environments: where uptime is non-negotiable and wrong decisions cost millions\n\u2022 Complex Transformation Journeys: navigating legacy systems, new technologies, and regulatory landscapes\n\u2022 Multi-Stakeholder Engagement: engineers, executives, procurement each with different evaluation criteria\n\u2022 Technical Evaluation Experiences: credibility built through demonstrated competence\n\u2022 Future-Readiness: connecting today's investment to tomorrow's infrastructure requirements",
      },
      {
        heading: "ENTEVATE Difference",
        body: "Faster deployment because the team understands the industry context. Smarter configuration tuned to how buyers actually evaluate. Better outcomes because insight maps to how decisions are made in power systems and data center environments.",
      },
    ],
  },
  {
    id: 6,
    label: "ROX Metrics + KPIs",
    sections: [
      {
        heading: "Emphasis",
        body: "Relationship quality scoring, re-engagement triggers, multi-touch attribution across long cycles, technical evaluation depth tracking",
      },
      {
        heading: "Technical Evaluation Metrics",
        body: "Tracks depth of technical engagement: which demos were viewed, which specifications were discussed, which integration requirements were raised. Maps signals to buying stage and account priority.",
      },
      {
        heading: "Multi-Stakeholder Tracking",
        body: "Identifies when multiple roles from the same organization visit the exhibit. Tracks whether engineering, procurement, and executive stakeholders each received role-appropriate content.",
      },
      {
        heading: "KPI Framing for Leadership",
        body: "\"X high-value contacts identified at [Show], Y re-engaged within 90 days\"",
      },
    ],
  },
  {
    id: 7,
    label: "Competitive Intel",
    sections: [
      {
        heading: "Energy and Infrastructure Context",
        body: "Standard Cvent / Whova / Hopin comparison applies with sector-specific framing. In energy and infrastructure, relationships drive procurement decisions. A badge scan from Cvent does not tell you the contact was a $10M opportunity. Momentify's intent signals do.",
      },
      {
        heading: "Primary Competitor: Status Quo",
        body: "The real competition is spreadsheets, unstructured conversations, and post-event reconstruction from memory. Most exhibitors in energy, infrastructure, and data centers have no structured system for capturing exhibit intelligence.",
      },
      {
        heading: "Key Differentiator",
        body: "Purpose-built for complex, high-stakes B2B environments where decisions are technical, timelines are long, and buying committees are diverse. Generic event tools capture attendance. Momentify captures decision-grade insight.",
      },
      {
        heading: "Win Condition",
        body: "Buyer is exhibiting at DistribuTECH, CERAWeek, POWER-GEN, or Data Center World with no structured way to capture what visitors actually care about, who they are, or what to do next.",
      },
    ],
  },
]

/* ── Direct to Customer: Aerospace & Aviation ── */

const aerospaceLayers: GTMLayer[] = [
  {
    id: 1,
    label: "ICP + Buyer Personas",
    sections: [
      {
        heading: "Primary Buyer",
        body: "Defense Marketing Lead, Business Development Director, Government Relations Manager\nCompany: defense OEM, systems integrator, government contractor",
      },
      {
        heading: "Shows",
        body: "DSEI, IDEX, AUSA, Paris Air Show, Sea-Air-Space, MRO Americas",
      },
      {
        heading: "ITAR Sensitivity",
        body: "Data handling matters. Address proactively.",
      },
      {
        heading: "Goals",
        body: "\u2022 BD pipeline visibility from events\n\u2022 Documenting mission-critical conversations\n\u2022 Executive-level reporting on show ROI",
      },
      {
        heading: "Trigger Events",
        body: "\u2022 Post-DSEI / IDEX review\n\u2022 BD team restructure\n\u2022 New program pursuit phase",
      },
    ],
  },
  {
    id: 2,
    label: "Core Message + Proof Points",
    sections: [
      {
        heading: "Headline",
        body: "\"You know who you talked to. Do you know what moved?\"",
      },
      {
        heading: "Key Differentiator",
        body: "Secure, structured data capture in a sector where conversations are the entire sales motion",
      },
      {
        heading: "Proof Point",
        body: "Defense sector deployment covering DSEI, IDEX, AUSA (reference without sensitive details)",
      },
      {
        heading: "ITAR Framing",
        body: "\"Momentify captures engagement metadata and intent signals. Not classified information. No ITAR exposure.\"",
      },
    ],
  },
  {
    id: 3,
    label: "Lead Magnets",
    sections: [
      {
        heading: "Primary",
        body: "\"The Defense Exhibitor's Intelligence Gap\" \u2014 addresses undocumented BD pipeline from defense shows",
      },
      {
        heading: "Secondary",
        body: "Defense industry case study (placeholder until published)",
      },
    ],
  },
  {
    id: 4,
    label: "Outreach Sequences",
    sections: [
      {
        heading: "Touch 1",
        body: "\"Every conversation at DSEI is a potential program relationship. Most go undocumented.\"",
      },
      {
        heading: "Touch 2",
        body: "Reference defense sector deployment model (services-based, no IT procurement friction). Offer the intelligence gap guide.",
      },
      {
        heading: "Touch 3",
        body: "\"20 minutes to show you how other defense exhibitors are structuring this.\" Low-friction CTA.",
      },
      {
        heading: "LinkedIn DM",
        body: "Observe the BD pipeline visibility problem in defense shows. No product pitch in DM 1.",
      },
    ],
  },
  {
    id: 5,
    label: "Sales Enablement",
    sections: [
      {
        heading: "Discovery Opener",
        body: "\"After DSEI or AUSA, how does your BD team capture and track the conversations that will become program relationships 18 months from now?\"",
      },
      {
        heading: "Key Objection",
        body: "\"We have security concerns\" \u2014 \"We capture intent signals and engagement data. Same category as your CRM. Nothing classified touches the platform.\"",
      },
      {
        heading: "Positioning Note",
        body: "Always use services-based language, not licensing or software language. Avoids IT procurement and security review triggers.",
      },
    ],
  },
  {
    id: 6,
    label: "ROX Metrics + KPIs",
    sections: [
      {
        heading: "Emphasis",
        body: "BD pipeline creation rate, conversation documentation rate, follow-up speed on high-value contacts, executive briefing cadence",
      },
      {
        heading: "KPI Framing",
        body: "\"X program-relevant conversations documented at [Show], Y qualified for BD follow-up within 72 hours\"",
      },
    ],
  },
  {
    id: 7,
    label: "Competitive Intel",
    sections: [
      {
        heading: "Defense-Specific Context",
        body: "\u2022 Cvent is sometimes used by defense event organizers, not exhibitors. If the buyer uses Cvent, they are the event host, not an exhibitor. Different conversation.\n\u2022 Whova is not present in this space at all. If mentioned, it signals a buyer who has not found the right solution yet.\n\u2022 The real competitive threat in aerospace and defense is \"we use a spreadsheet and WhatsApp.\" Position Momentify against the status quo, not named competitors.",
      },
      {
        heading: "Win Condition",
        body: "BD team running defense shows with no structured system. The Momentify pitch is \"this is what a real BD intelligence layer looks like.\"",
      },
    ],
  },
]

/* ── Channel Partners (unified track) ── */

const partnerLayers: GTMLayer[] = [
  {
    id: 1,
    label: "Partner ICP",
    sections: [
      {
        heading: "Primary",
        body: "VP of Client Services or Account Director at Freeman, Clarion Events, exhibit house, or industry association (AEM, NDIA)",
      },
      {
        heading: "Secondary",
        body: "Business Development lead pitching new exhibitor clients",
      },
      {
        heading: "Pain",
        body: "Clients ask \"what did we get from this show?\" and the agency has no defensible answer. Risk of losing accounts to any competitor who offers measurement.",
      },
      {
        heading: "Trigger Events",
        body: "\u2022 Losing a client\n\u2022 Responding to an RFP that asks for measurement capabilities\n\u2022 Pitching a new enterprise client",
      },
    ],
  },
  {
    id: 2,
    label: "Partner Message + Proof",
    sections: [
      {
        heading: "Headline",
        body: "\"Add an intelligence layer to every exhibit you manage.\"",
      },
      {
        heading: "Subhead",
        body: "\"Differentiate with ROX. Retain clients with proof.\"",
      },
      {
        heading: "Key Differentiator",
        body: "Momentify is invisible to the end client if preferred. The agency delivers the insight, powered by Momentify.",
      },
      {
        heading: "Revenue Model",
        body: "Rev share per event or per seat licensed through partner. White-label available for agencies running 10+ events per year.",
      },
    ],
  },
  {
    id: 3,
    label: "Partner Lead Magnets",
    sections: [
      {
        heading: "Primary",
        body: "\"The Agency Guide to Selling Engagement Intelligence\" \u2014 how to pitch ROX to exhibitor clients",
      },
      {
        heading: "Secondary",
        body: "Partner ROX deck \u2014 co-branded slide deck for client pitches",
      },
    ],
  },
  {
    id: 4,
    label: "Partner Outreach",
    sections: [
      {
        heading: "Touch 1",
        body: "\"Your clients want to know what the show returned. You do not have a good answer yet.\" Link to the agency guide.",
      },
      {
        heading: "Touch 2",
        body: "Reference Freeman or comparable agency. \"Leading exhibit agencies are adding a retained intelligence layer to every client engagement. Here is how the model works.\"",
      },
      {
        heading: "Touch 3",
        body: "\"30-minute partner briefing. No pitch. Just the co-sell model.\" Low-friction ask.",
      },
      {
        heading: "LinkedIn DM",
        body: "Lead with an observation about what agencies are missing in post-show reporting. Drop the guide. No product pitch in DM 1.",
      },
    ],
  },
  {
    id: 5,
    label: "Partner Sales Enablement",
    sections: [
      {
        heading: "Partner Pitch Narrative",
        body: "\"You already deliver world-class event experiences. Momentify is the intelligence layer that lets you prove it. Add it to your client offering. They get ROX visibility. You get a differentiated service and a new revenue line. We split it.\"",
      },
      {
        heading: "Co-Sell Motion",
        body: "Partner owns event delivery, Momentify owns the intelligence platform, one unified post-show report.",
      },
      {
        heading: "One-Liner for Partner to Use",
        body: "\"We now offer post-show engagement intelligence through our partnership with Momentify. Your ROX score is included with every engagement.\"",
      },
    ],
  },
  {
    id: 6,
    label: "Partner ROX Metrics",
    sections: [
      {
        heading: "Tracking",
        body: "Partner-sourced pipeline, events activated per partner, client retention rate for accounts using Momentify vs not, partner NPS",
      },
    ],
  },
  {
    id: 7,
    label: "Competitive Intel (Partner Motion)",
    sections: [
      {
        heading: "Key Point",
        body: "Exhibit agencies are not evaluating Momentify against Cvent or Whova. They are evaluating whether to build something internally, white-label a solution, or partner.",
      },
      {
        heading: "Win Condition vs Build",
        body: "\"Building an analytics layer is a 12-month engineering project. Momentify is live in one event cycle.\"",
      },
      {
        heading: "Win Condition vs Other Vendors",
        body: "No other platform offers a co-sell model with rev share specifically designed for exhibit agencies.",
      },
      {
        heading: "Framing",
        body: "This is a partner enablement conversation, not a features comparison. Lead with the business model, not the product.",
      },
    ],
  },
]

/* ── Competitive Comparison Table Data ── */

export const comparisonTable = {
  headers: ["Capability", "Momentify", "Cvent", "Whova", "Hopin"],
  rows: [
    [
      "In-booth intent capture",
      "Yes. Real-time, persona-driven",
      "No. Logistics only",
      "Limited. Check-in only",
      "No. Virtual/hybrid focus",
    ],
    [
      "ROX scoring framework",
      "Yes. 4-dimension proprietary score",
      "No",
      "No",
      "No",
    ],
    [
      "Portfolio-level view across multiple shows",
      "Yes. Unified dashboard",
      "Partial. Event-by-event silos",
      "No",
      "No",
    ],
    [
      "Works above existing tools",
      "Yes. Sits above Cvent, Whova, badges",
      "N/A. Replaces other tools",
      "N/A. Replaces other tools",
      "N/A. Replaces other tools",
    ],
    [
      "Industry-specific templates",
      "Yes. Heavy equipment, defense, energy",
      "Generic",
      "Generic",
      "Generic",
    ],
    [
      "CRM / ATS trigger on engagement",
      "Yes. Real-time triggers",
      "Limited. Post-event export",
      "No",
      "No",
    ],
    [
      "On-site managed services",
      "Yes",
      "No",
      "No",
      "No",
    ],
    [
      "Target market",
      "B2B enterprise exhibitors",
      "Large event planners and corporates",
      "SMB events and conferences",
      "Virtual and hybrid events",
    ],
  ],
}

/* ── Export Motion Tracks ── */

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
        label: "Energy, Infrastructure & Power",
        layers: energyLayers,
      },
      {
        vertical: "aerospace-aviation",
        label: "Aerospace & Aviation",
        layers: aerospaceLayers,
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
        layers: partnerLayers,
      },
    ],
  },
]

/* ── Persona Feature Mapping ── */

export const personaFeatureMap: PersonaFeatureMap[] = [
  {
    persona: "Event Marketing Manager / Trade Show Manager",
    rows: [
      {
        painPoint: "Manual lead capture with little context",
        objective: "Digitize and streamline lead capture",
        kpi: "# of leads captured/qualified",
        primaryFeatures: "Instant lead capture form with persona-tagging",
        secondaryFeatures: "QR registration, Smart Columns",
        competitiveAdvantage: "Captures both who engaged and how they engaged in real time",
      },
      {
        painPoint: "Inability to measure booth engagement",
        objective: "Track real-time content and interaction data",
        kpi: "Booth traffic, content interactions",
        primaryFeatures: "ROX Dashboard with heatmaps and engagement tracking",
        secondaryFeatures: "Device naming for zone-level insights",
        competitiveAdvantage: "Provides experience-first analytics, not just attendance",
      },
      {
        painPoint: "Difficulty aligning booth content to audience",
        objective: "Deliver tailored, persona-driven content experiences",
        kpi: "Content viewed per persona, conversion %",
        primaryFeatures: "Role-based content paths, swipeable displays",
        secondaryFeatures: "AI content matching (roadmap)",
        competitiveAdvantage: "Most platforms offer static content. Momentify offers live interaction and real-time adaptation",
      },
      {
        painPoint: "Missed follow-up opportunities post-event",
        objective: "Prioritize leads and automate personalized follow-up",
        kpi: "Time to follow-up, lead-to-MQL rate",
        primaryFeatures: "Engagement-based lead scoring and CRM exports",
        secondaryFeatures: "Post-event automation, email templates",
        competitiveAdvantage: "Other tools stop at data collection. Momentify closes the loop from booth to pipeline",
      },
    ],
  },
  {
    persona: "VP of Marketing / Marketing Manager / Demand Gen / Sales Enablement Lead",
    rows: [
      {
        painPoint: "Leads collected at events rarely make it to sales",
        objective: "Ensure MQL quality and faster handoff",
        kpi: "% of leads marked MQL, follow-up velocity",
        primaryFeatures: "Integrated CRM/ATS export with filters",
        secondaryFeatures: "Smart Columns for routing",
        competitiveAdvantage: "Other platforms stop at badge scan. Momentify tracks behavioral context and lead intent",
      },
      {
        painPoint: "Difficult to prove ROI of events",
        objective: "Show impact beyond leads",
        kpi: "ROX score, post-event engagement",
        primaryFeatures: "Real-time dashboards, conversion analytics",
        secondaryFeatures: "One-click report exports",
        competitiveAdvantage: "Introduces ROX as a performance layer that sales and marketing both trust",
      },
      {
        painPoint: "Disconnected event data from marketing and sales systems",
        objective: "Create a seamless funnel from booth to CRM",
        kpi: "Data sync speed, lead source accuracy",
        primaryFeatures: "CRM integration with persona tagging",
        secondaryFeatures: "Event-based scoring and filtering",
        competitiveAdvantage: "Bridges the gap between engagement and conversion with real-time, usable insights",
      },
      {
        painPoint: "Field reps lack visibility into content impact",
        objective: "Understand what works and why",
        kpi: "Content engagement %, sales asset use",
        primaryFeatures: "Content tracking and engagement scoring",
        secondaryFeatures: "Integration with sales enablement tools",
        competitiveAdvantage: "Connects engagement behavior directly to sales performance insights",
      },
    ],
  },
]

/* ── Lead Magnets ── */

export const leadMagnets: LeadMagnet[] = [
  {
    title: "Top 10 Trade Show Booth Mistakes to Avoid",
    format: "PDF Checklist",
    audience: "Event Marketing Managers, Trade Show Coordinators, first-time exhibitors",
    problem: "Most exhibitors repeat the same avoidable mistakes that reduce engagement, waste budget, and produce weak leads",
    featureHighlighted: "ROX Dashboard, Lead Capture, Engagement Tracking",
    delivery: "Gated PDF download via landing page",
    sections: [
      { heading: "No Clear Booth Objective", body: "Exhibiting without defined goals leads to unfocused engagement. Every show should have a measurable objective tied to pipeline or relationship outcomes." },
      { heading: "Passive Booth Experience", body: "Static displays and brochure walls do not create engagement. Interactive, role-driven content paths increase time in booth and lead quality." },
      { heading: "Treating All Visitors the Same", body: "Engineers, executives, and procurement evaluate differently. Without persona-driven paths, your booth experience is generic and forgettable." },
      { heading: "No Lead Scoring or Prioritization", body: "Collecting names without context creates a follow-up bottleneck. Engagement-based scoring ensures sales focuses on the right leads first." },
      { heading: "Delayed or Generic Follow-Up", body: "Following up days later with a generic email loses the momentum built during the event. Speed and personalization determine conversion." },
    ],
  },
  {
    title: "Trade Show ROI & ROX Calculator",
    format: "Interactive Web Tool",
    audience: "VP of Marketing, Event Marketing Managers, Demand Gen leaders",
    problem: "Exhibitors struggle to quantify event performance beyond lead counts, making it difficult to justify spend or optimize across shows",
    featureHighlighted: "ROX Framework, Analytics Dashboard",
    delivery: "Ungated interactive tool at momentifyapp.com/rox-calculator with optional email gate for detailed report",
    sections: [
      { heading: "Input Your Event Data", body: "Enter booth cost, staffing, travel, and estimated traffic to establish your baseline investment per event." },
      { heading: "Engagement Metrics", body: "Input leads captured, average engagement time, content interactions, and follow-up speed to calculate your engagement quality score." },
      { heading: "Conversion Tracking", body: "Map leads to MQLs, opportunities, and pipeline value to see the full funnel from booth to revenue." },
      { heading: "ROX Score Output", body: "Receive a composite ROX score across four dimensions: Lead Capture Efficiency, Engagement Quality, Follow-Up Speed, and Conversion Effectiveness." },
      { heading: "Benchmark Comparison", body: "Compare your score against industry benchmarks to identify where your event program is strong and where it needs improvement." },
    ],
  },
  {
    title: "Field Guide: Designing an Engagement-Driven Booth",
    format: "Visual One-Pager",
    audience: "Event Marketing Managers, Exhibit Designers, Agency Partners",
    problem: "Most booth designs prioritize aesthetics over engagement. Visitors walk through without meaningful interaction or data capture.",
    featureHighlighted: "Smart Columns, Role-Based Content Paths, Device Naming",
    delivery: "Gated PDF download, also available as a print-ready handout for pre-show planning",
    sections: [
      { heading: "Zone Your Booth by Visitor Intent", body: "Divide your booth into zones based on what visitors want to accomplish: learn, evaluate, or connect. Each zone should have its own content path and capture mechanism." },
      { heading: "Place Interactive Touchpoints Strategically", body: "Position Smart Columns and interactive displays at natural stopping points. Engagement increases when visitors encounter content at the moment they are most receptive." },
      { heading: "Design for Multiple Personas", body: "Engineers want specs. Executives want outcomes. Procurement wants scope and pricing. Design content paths that serve each without making any feel like they are in the wrong place." },
    ],
  },
  {
    title: "Instant Lead Capture Toolkit for Exhibitors",
    format: "Downloadable Kit",
    audience: "Trade Show Coordinators, Booth Staff Leads, Event Operations Managers",
    problem: "Lead capture at events is slow, inconsistent, and loses context. Paper forms, scattered notes, and badge scans without qualification create follow-up chaos.",
    featureHighlighted: "Instant Lead Capture Forms, Persona-Tagging, QR Registration",
    delivery: "Gated download containing setup guides, configuration templates, and training materials",
    sections: [
      { heading: "Pre-Show Setup Checklist", body: "Step-by-step guide to configuring lead capture forms, persona tags, and device assignments before the event. Covers team roles, content mapping, and CRM connection testing." },
      { heading: "On-Site Capture Best Practices", body: "How to capture leads in real time without disrupting the conversation. Includes guidelines for tagging visitor role, interest area, and engagement level during the interaction." },
      { heading: "Post-Show Data Handoff", body: "Exporting captured leads with full context into your CRM. Includes templates for segmenting by priority, persona, and follow-up urgency." },
    ],
  },
  {
    title: "How to Route Leads by Territory or Product Line",
    format: "Educational PDF",
    audience: "Sales Operations, Event Marketing Managers, CRM Administrators",
    problem: "Leads captured at events often go to a single inbox or spreadsheet. Without routing logic, high-value leads sit unassigned while sales teams wait.",
    featureHighlighted: "Smart Columns, CRM Integration, Lead Routing",
    delivery: "Gated PDF download with routing logic diagrams and CRM configuration examples",
    sections: [
      { heading: "Define Your Routing Rules", body: "Map lead attributes to routing destinations. Territory, product interest, company size, and engagement score can all drive assignment logic." },
      { heading: "Configure Real-Time Assignment", body: "Set up automated routing so leads are assigned to the right rep or team within minutes of capture, not days after the event." },
      { heading: "Handle Edge Cases", body: "What happens when a lead matches multiple territories or product lines. Define fallback rules and escalation paths to prevent leads from falling through cracks." },
      { heading: "Measure Routing Effectiveness", body: "Track time-to-assignment, first-touch speed, and conversion by route to continuously improve your lead handoff process." },
    ],
  },
  {
    title: "Post-Show Follow-Up Email Templates for Exhibitors",
    format: "Editable Email Templates",
    audience: "Event Marketing Managers, Sales Development Reps, Demand Gen teams",
    problem: "Post-event follow-up is often delayed, generic, and disconnected from the actual booth conversation. Leads go cold before sales ever reaches out.",
    featureHighlighted: "Engagement-Based Lead Scoring, CRM Integration, Post-Event Automation",
    delivery: "Downloadable template pack with editable email copy for multiple personas and engagement levels",
    sections: [
      { heading: "High-Engagement Follow-Up", body: "Template for leads who spent significant time in the booth, viewed multiple content pieces, or requested a demo. Tone is direct and references their specific interests." },
      { heading: "Moderate-Engagement Follow-Up", body: "Template for leads who engaged briefly or visited one zone. Tone is informative and offers additional resources relevant to their role." },
      { heading: "Low-Engagement or Badge-Scan Follow-Up", body: "Template for leads captured via badge scan only with minimal context. Tone is exploratory and invites them to engage with a specific resource or tool." },
      { heading: "Executive Follow-Up", body: "Template tailored for senior decision-makers. Focuses on outcomes, ROX data, and offers a concise summary of what was discussed at the booth." },
    ],
  },
  {
    title: "Trade Show Readiness Checklist",
    format: "Interactive Checklist",
    audience: "Event Marketing Managers, Trade Show Coordinators, Operations Leads",
    problem: "Pre-show preparation is fragmented across teams and tools. Critical steps are missed, leading to poor execution and lost opportunities on the show floor.",
    featureHighlighted: "Momentify Platform Setup, Device Configuration, Content Path Design",
    delivery: "Interactive web-based checklist with optional PDF export for team distribution",
    sections: [
      { heading: "8 Weeks Out: Strategy and Goals", body: "Define event objectives, target personas, and success metrics. Align marketing, sales, and leadership on what a successful show looks like." },
      { heading: "4 Weeks Out: Content and Configuration", body: "Finalize booth content, configure Momentify devices, set up lead capture forms, and test CRM integrations." },
      { heading: "1 Week Out: Team Preparation", body: "Brief booth staff on personas, content paths, and lead capture process. Run a rehearsal to ensure everyone knows their role." },
      { heading: "Day Of: Final Checks", body: "Verify device connectivity, test lead capture flow end-to-end, confirm CRM sync is active, and ensure all content is loaded and accessible." },
      { heading: "Post-Show: Data and Follow-Up", body: "Export leads, review ROX dashboard, prioritize follow-up by engagement score, and schedule post-show debrief with the team." },
    ],
  },
  {
    title: "Momentify for Exhibitors Case Study",
    format: "Case Study PDF",
    audience: "VP of Marketing, Event Marketing Managers, Sales Leadership",
    problem: "Exhibitors investing six figures per show have no way to prove what those events returned. Leadership sees cost, not pipeline.",
    featureHighlighted: "ROX Dashboard, Lead Capture, CRM Integration, Portfolio Analytics",
    delivery: "Gated PDF download, also used as a sales enablement asset for demos and proposals",
    sections: [
      { heading: "The Challenge", body: "A major exhibitor was spending over $200K per event across multiple shows annually with no structured way to measure engagement quality, lead intent, or pipeline contribution." },
      { heading: "The Approach", body: "Momentify was deployed as a managed services engagement across their show calendar. The platform captured persona-tagged leads, tracked content interactions, and produced real-time ROX scores." },
      { heading: "The Results", body: "Lead qualification improved by 40%. Follow-up speed went from days to hours. Leadership received a unified view of event performance across the entire show portfolio for the first time." },
      { heading: "Key Takeaway", body: "Events are not a cost center. They are a pipeline accelerator. Momentify provides the proof that turns event marketing from a budget line into a revenue driver." },
    ],
  },
]

/* ── LinkedIn Outreach Templates (Data Centers + Power Systems) ── */

export const linkedInOutreach: LinkedInOutreach[] = [
  {
    segment: "Technology Providers and Software Firms",
    subsegment: "Smart Grid, AI, DERMS",
    message: "Your platform solves complex grid and energy challenges. But at events like DistribuTECH, the conversation between your team and a potential buyer holds more signal than any badge scan. Most of that signal disappears after the show. We help exhibitors capture what visitors actually care about during the interaction, not after. If your team is exhibiting this year, it might be worth a quick look at how structured exhibit intelligence changes the post-show conversation.",
  },
  {
    segment: "Manufacturers and Infrastructure Suppliers",
    subsegment: "T&D Equipment, Hardware",
    message: "Your booth at a major industry event draws engineers, operators, and procurement leaders. Each one evaluates your equipment differently. Most exhibit setups treat them all the same. We help manufacturers capture what each visitor role cares about during the exhibit interaction, so your follow-up is specific, fast, and relevant. If your team is preparing for an upcoming show, it might be worth seeing how this works in practice.",
  },
  {
    segment: "EPC and Engineering Firms",
    subsegment: undefined,
    message: "At industry events and facility tours, your team has detailed conversations about scope, constraints, timelines, and project requirements. Those conversations shape project direction, but the details are often lost to memory and scattered notes. We help EPC firms structure those interactions so the insight captured during the event or visit is retrievable, shareable, and actionable. If your team is exhibiting or hosting site visits, this might be relevant.",
  },
  {
    segment: "Renewable Energy Integration Specialists",
    subsegment: undefined,
    message: "Buyers evaluating renewable energy solutions at industry events are weighing interoperability, grid impact, regulatory compliance, and long-term performance. Those are complex evaluation criteria that do not fit on a badge scan. We help exhibitors capture the specific concerns, priorities, and integration requirements that surface during live exhibit conversations. If your team is exhibiting at an upcoming energy event, it could be worth a quick conversation.",
  },
  {
    segment: "Cybersecurity and Data Management Firms",
    subsegment: undefined,
    message: "When you exhibit infrastructure security or data management solutions, the conversations are deeply technical. Visitors are evaluating compliance requirements, integration constraints, and risk tolerance. Standard lead capture tools miss all of that context. We help exhibitors capture structured insight during technical conversations so your follow-up reflects what the visitor actually discussed, not just that they stopped by. If your team is planning for an upcoming event, this might be worth exploring.",
  },
]

/* ── ENTEVATE Positioning ── */

export const entevatePositioning = {
  headline: "Beyond the Platform: ENTEVATE as Your Strategic Partner",
  subhead: "Momentify is the technology. ENTEVATE is the expertise that makes it work in your industry, your events, and your sales process.",
  expertiseAreas: [
    {
      title: "High-Stakes Decision Environments",
      description: "Where the cost of a wrong decision is measured in millions and timelines stretch across years. ENTEVATE understands how buyers evaluate in these environments and configures Momentify to capture the signals that matter.",
    },
    {
      title: "Complex Transformation Journeys",
      description: "Where organizations navigate legacy systems, new technologies, and evolving regulatory landscapes simultaneously. ENTEVATE brings context that generic implementation teams cannot.",
    },
    {
      title: "Multi-Stakeholder Engagement Dynamics",
      description: "Where engineers, executives, procurement, and operations each bring different criteria to the same evaluation. ENTEVATE designs exhibit experiences that serve all of them.",
    },
    {
      title: "Technical Evaluation Experiences",
      description: "Where credibility is built through demonstrated competence, not sales pitches. ENTEVATE structures booth interactions so that technical depth is captured and communicated.",
    },
    {
      title: "Future-Readiness and Emerging Technology Adoption",
      description: "Where buyers need to see how today's investment connects to tomorrow's requirements. ENTEVATE helps exhibitors position their offerings within the broader technology trajectory of their industry.",
    },
  ],
  capabilities: [
    "Managed services deployment for exhibitors who want results without internal resource strain",
    "Industry-specific configuration for data centers, power systems, heavy equipment, aerospace, and energy",
    "Multi-event portfolio management with unified ROX reporting across your entire show calendar",
    "Post-event intelligence activation connecting booth insight to field sales and CRM workflows",
  ],
  industries: [
    "Data Centers and Power Systems",
    "Heavy Equipment and Construction",
    "Aerospace and Defense",
    "Energy and Infrastructure",
  ],
  differentiators: [
    "Faster deployment because the team understands your industry context and buyer behavior",
    "Smarter configuration because the platform is tuned to how your buyers actually evaluate at events",
    "Better outcomes because the insight captured maps to how decisions are actually made in your market",
  ],
}
