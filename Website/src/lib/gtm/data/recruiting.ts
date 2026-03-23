/* ═══════════════════════════════════════════════════════════════
   Technical Recruiting — GTM Framework Data
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
        body: "Title: Senior Technical Recruiter, Talent Acquisition Manager, or VP of HR at OEM or large dealer group\nCompany: $100M+ revenue, hiring 50+ technical roles per year\nEvents: SME job fairs, CONEXPO hiring events, MINExpo workforce sessions, university engineering recruiting days",
      },
      {
        heading: "Secondary Buyer",
        body: "Title: Hiring Manager (Engineering, Field Service, Product Support)\nThey own the hiring need. The TA team owns the process.",
      },
      {
        heading: "Goals",
        body: "\u2022 Reduce time-to-hire for hard-to-fill technical roles (diesel technicians, field service engineers, product support specialists)\n\u2022 Improve candidate quality from events. Too many unqualified applications, not enough signal\n\u2022 Give hiring managers visibility into who is actually pipeline-ready vs just interested\n\u2022 Justify recruiting event spend to HR leadership",
      },
      {
        heading: "Blockers",
        body: "\u2022 \"We use Handshake / LinkedIn / Indeed for recruiting.\" Those are sourcing tools. Momentify captures what happens at the in-person recruiting event.\n\u2022 \"Our ATS handles this.\" ATS tracks candidates after they apply. Momentify captures intent before the application.\n\u2022 \"Recruiting budget is separate from marketing budget.\" Address by selling to CHRO or TA leader directly, not event marketing.",
      },
      {
        heading: "Anti-ICP",
        body: "\u2022 Companies hiring primarily hourly or non-technical roles\n\u2022 Organizations with fewer than 20 technical hires per year\n\u2022 Companies that do not attend or host in-person recruiting events\n\u2022 Staffing agencies (no direct employer brand investment)",
      },
      {
        heading: "Budget Authority",
        body: "VP of HR or CHRO owns the budget, Talent Acquisition Manager influences, CFO approves above $25K",
      },
      {
        heading: "Trigger Events",
        body: "\u2022 Failed recruiting event with low-quality candidates\n\u2022 New Talent Acquisition leader\n\u2022 Engineering headcount ramp\n\u2022 Struggling to compete for talent against larger OEMs",
      },
    ],
  },
  {
    id: 2,
    label: "Core Message + Proof Points",
    sections: [
      {
        heading: "Headline",
        body: "Your next great technician was at the event. Did your team know which one?",
      },
      {
        heading: "Subhead",
        body: "Momentify gives recruiting teams real-time candidate intelligence so follow-up happens before the talent walks out the door.",
      },
      {
        heading: "Key Differentiator",
        body: "Intent capture at the event level, not just resume collection. Know which candidates engaged deeply, what roles they cared about, and who to call first.",
      },
      {
        heading: "Proof Points",
        body: "\u2022 40% lead qualification improvement across Momentify deployments applies directly to candidate qualification\n\u2022 Industrial organizations using Momentify for technical talent pipeline building alongside their event deployments\n\u2022 Recruiting teams have reimagined career fair and recruiting event strategies, transforming them into data-driven engines for attracting top talent",
      },
      {
        heading: "Objection Handling",
        body: "\u2022 \"LinkedIn does this.\" LinkedIn finds candidates. Momentify tells you which candidates at your event were serious. Different problem.\n\u2022 \"We use clipboards / iPads.\" Those collect information. Momentify captures engagement and scores candidate intent. The difference is who you call first.",
      },
    ],
  },
  {
    id: 3,
    label: "Lead Magnets",
    sections: [
      {
        heading: "Primary: The Technical Recruiting Event ROX Audit",
        body: "8-question self-assessment. How well does your team capture and qualify talent at in-person events? Scores across four dimensions: Candidate Capture Rate, Engagement Quality, Follow-Up Speed, and Conversion Effectiveness.",
      },
      {
        heading: "Secondary: The Playbook for Recruiting Technical Talent at Industry Events",
        body: "Gated PDF. Practical guide for heavy equipment TA teams covering booth setup, persona-driven engagement, lead scoring, and post-event follow-up cadences.",
      },
      {
        heading: "Tertiary: ROX Calculator for Recruiting",
        body: "Adapted ROX Calculator focused on recruiting metrics: qualified candidates per event, cost per hire vs cost per event, value per hire, and time-to-hire acceleration.",
      },
    ],
  },
  {
    id: 4,
    label: "Outreach Sequences",
    sections: [
      {
        heading: "Touch 1 (Day 0)",
        body: "Subject: \"How many qualified candidates did [last event] actually produce?\"\nPain: Recruiting teams spend $20K+ per major recruiting event and walk away with a stack of paper resumes or a contact list with no signal about who is actually serious.\nCTA: Recruiting ROX Audit",
      },
      {
        heading: "Touch 2 (Day 4)",
        body: "Subject: \"From clipboard to pipeline in 24 hours\"\nReference: Momentify's deployment with equipment dealers to capture and qualify technical talent at events. 40% improvement in candidate qualification.\nCTA: 20-minute call",
      },
      {
        heading: "Touch 3 (Day 9)",
        body: "Subject: \"One question before I stop bothering you\"\nBody: \"What does a qualified technician hire cost you in time and agency fees? That is what one missed candidate from an event costs. Worth 20 minutes?\"\nCTA: ROX Calculator for recruiting",
      },
      {
        heading: "LinkedIn DM Flow",
        body: "DM 1: Reference a specific role they are struggling to fill (research their job postings). One question about how their team currently captures candidate intent at recruiting events.\nDM 2 (Day 5): Drop the Recruiting ROX Audit with one sentence. No pitch.\nDM 3 (engaged): Offer the playbook or a short call.",
      },
    ],
  },
  {
    id: 5,
    label: "Sales Enablement",
    sections: [
      {
        heading: "Discovery Opener",
        body: "\"Walk me through what happens after your team talks to a candidate at a recruiting event. How do you know who to follow up with first?\"",
      },
      {
        heading: "Discovery Questions",
        body: "1. \"How many technical roles are you actively trying to fill right now, and which ones are hardest?\"\n2. \"How much does your team spend on recruiting events per year, and how do you measure whether they worked?\"\n3. \"After a recruiting event, how long before candidates hear back from your team?\"\n4. \"What does a bad hire cost you versus the cost of a position staying open for 90 days?\"\n5. \"If you could see, in real time, which candidates at a fair were most engaged with your team, what would you do differently?\"",
      },
      {
        heading: "Objection Responses",
        body: "\u2022 \"We have an ATS.\" Your ATS is where candidates live after they apply. Momentify is what happens before the application. Capturing intent, scoring engagement, and telling your team who to call tonight, not next week.\n\u2022 \"Our budget is in HR, not marketing.\" That is exactly the right buyer. This is a talent acquisition tool, not a marketing tool.\n\u2022 \"We do not attend that many events.\" One event with Momentify that produces 10 qualified hires instead of 2 pays for a year of the platform.",
      },
      {
        heading: "Demo Flow",
        body: "Part 1 (Web Portal): Workspace setup, event creation, lead form configuration, Smart Columns and trait tagging, lead dashboard, export and integration.\nPart 2 (Explorer): Branded launch screen, persona-based role selector, interactive trait journey, instant feedback and match, smart session end options.",
      },
    ],
  },
  {
    id: 6,
    label: "ROX Metrics + KPIs",
    sections: [
      {
        heading: "Recruiting-Specific ROX Dimensions",
        body: "\u2022 Candidate Capture Rate: candidates engaged vs estimated event foot traffic at your booth\n\u2022 Engagement Quality: depth of conversation captured (role interest, timeline, location, skill match indicators)\n\u2022 Follow-Up Speed: hours from event capture to first recruiter outreach\n\u2022 Conversion Rate: candidates captured to phone screen to offer to hire",
      },
      {
        heading: "Reporting Frame for HR Leadership",
        body: "\"At [Event], Momentify helped us identify [X] pipeline-ready candidates within [Y] hours. Our cost per qualified candidate was [Z] vs our prior event average.\"",
      },
      {
        heading: "Key Stats to Track",
        body: "\u2022 87% reduction in post-event lead sorting time\n\u2022 2x faster candidate follow-up\n\u2022 3x more qualified leads captured in the field\n\u2022 Time-to-hire acceleration per event",
      },
    ],
  },
  {
    id: 7,
    label: "Competitive Intel: Recruiting Tech",
    sections: [
      {
        heading: "Competitive Landscape",
        body: "Primary competitors in this context: Handshake (campus sourcing), LinkedIn Talent Solutions (professional sourcing), and the ATS (Workday, Greenhouse, Lever).",
      },
      {
        heading: "vs Handshake",
        body: "Handshake is for campus sourcing. It gets candidates to the event. Momentify captures what happens when they get there. They are sequential, not competitive.",
      },
      {
        heading: "vs LinkedIn Talent Solutions",
        body: "LinkedIn finds candidates before the event. Momentify captures which candidates at your event were serious. Different part of the funnel entirely.",
      },
      {
        heading: "vs ATS (Workday, Greenhouse, Lever)",
        body: "ATS is where candidates live after they apply. Momentify tells you who to prioritize before they apply, while the conversation is still warm.",
      },
      {
        heading: "How to Win",
        body: "Reframe the conversation around the post-event follow-up gap. \"Your ATS and LinkedIn solve pre- and post-event. Nobody solves what happens during the event and in the 24 hours after it.\" That is the Momentify position.",
      },
      {
        heading: "Killer Question",
        body: "\"After your last recruiting event, how long did it take your team to follow up with the top 10 candidates? How many of those candidates had accepted another offer by then?\"",
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
        body: "Title: Workforce Development Manager, Talent Acquisition Lead at utility, grid operator, EPC firm, or renewable energy company\nHard-to-fill roles: power systems engineers, field technicians, SCADA operators, project managers\nEvents: POWER-GEN workforce sessions, DistribuTECH talent programs, university engineering recruiting (Georgia Tech, Texas A&M, Penn State energy programs)",
      },
      {
        heading: "Anti-ICP",
        body: "\u2022 Companies hiring primarily operational or non-technical staff\n\u2022 Organizations without a structured TA function",
      },
    ],
  },
  {
    id: 2,
    label: "Core Message + Proof Points",
    sections: [
      {
        heading: "Headline",
        body: "The engineers you need are at the conference. The question is whether they remember you.",
      },
      {
        heading: "Key Insight",
        body: "In energy and infrastructure, the talent pool is small and relationship-driven. One missed conversation at an industry event has a 12-month cost.",
      },
      {
        heading: "Proof Points",
        body: "\u2022 Fortune 75 Manufacturer deployed Momentify at DistribuTECH for talent pipeline intelligence\n\u2022 40% lead qualification improvement across deployments applies directly to candidate qualification\n\u2022 Energy sector TA teams run 3 to 5 major recruiting events per year with no system for capturing candidate intent",
      },
    ],
  },
  {
    id: 3,
    label: "Lead Magnets",
    sections: [
      {
        heading: "Primary: Energy Sector Recruiting Event ROX Audit",
        body: "Self-assessment adapted for energy and infrastructure TA teams. Evaluates candidate capture, engagement quality, follow-up speed, and conversion across industry-specific events.",
      },
      {
        heading: "Secondary: The Energy Workforce Recruiting Playbook",
        body: "Gated PDF covering how energy companies capture and qualify technical talent at industry conferences, university recruiting days, and workforce development events.",
      },
    ],
  },
  {
    id: 4,
    label: "Outreach Sequences",
    sections: [
      {
        heading: "Touch 1 (Day 0)",
        body: "Subject: \"The engineers were at [event]. How many made it to your pipeline?\"\nPain: Energy sector hiring events produce stacks of resumes but no signal about which candidates are serious about the roles you need filled most.\nCTA: Energy Recruiting ROX Audit",
      },
      {
        heading: "Touch 2 (Day 4)",
        body: "Subject: \"From networking to pipeline in 24 hours\"\nReference: Momentify deployments that captured and qualified technical talent at energy industry events. Candidates prioritized by engagement depth, not just resume keywords.\nCTA: 20-minute call",
      },
      {
        heading: "Touch 3 (Day 9)",
        body: "Subject: \"Quick question about your last recruiting event\"\nBody: \"How long did it take your team to follow up with the top candidates from [last event]? In energy, the best engineers get multiple offers within weeks. Speed is the differentiator.\"\nCTA: ROX Calculator for recruiting",
      },
    ],
  },
  {
    id: 5,
    label: "Sales Enablement",
    sections: [
      {
        heading: "Discovery Opener",
        body: "\"Walk me through what happens after your team meets a strong candidate at a conference or university visit. How do you decide who gets called first?\"",
      },
      {
        heading: "Discovery Questions",
        body: "1. \"What are the hardest technical roles to fill in your organization right now?\"\n2. \"How many recruiting events does your team attend per year, and how do you measure their effectiveness?\"\n3. \"After a conference or career fair, how long before your top candidates hear from a recruiter?\"\n4. \"What does it cost you when a critical engineering position stays open for 90 days?\"\n5. \"If you could see which candidates at your booth were most engaged during the event, how would that change your follow-up process?\"",
      },
      {
        heading: "Objection Responses",
        body: "\u2022 \"We recruit primarily through LinkedIn and job boards.\" Those channels find candidates. Momentify captures which candidates at your in-person events were genuinely interested. Different stage of the funnel.\n\u2022 \"Our ATS handles candidate tracking.\" Your ATS tracks applicants. Momentify captures pre-applicant intent at the event level, so your team knows who to prioritize before they even apply.\n\u2022 \"We only do 2 to 3 events per year.\" That makes each one more important. One event that produces 8 qualified hires instead of 2 changes the math entirely.",
      },
    ],
  },
  {
    id: 6,
    label: "ROX Metrics + KPIs",
    sections: [
      {
        heading: "Energy-Specific ROX Dimensions",
        body: "\u2022 Candidate Capture Rate: candidates engaged at booth vs total event attendance\n\u2022 Engagement Quality: depth of role interest, timeline, location flexibility, and technical skill match indicators\n\u2022 Follow-Up Speed: hours from event capture to first recruiter outreach\n\u2022 Conversion Rate: candidates captured to interview to offer to hire",
      },
      {
        heading: "Reporting Frame for Leadership",
        body: "\"At [Conference], Momentify helped us identify [X] pipeline-ready engineering candidates within [Y] hours. Our cost per qualified candidate was [Z] versus our prior event baseline.\"",
      },
    ],
  },
  {
    id: 7,
    label: "Competitive Intel: Recruiting Tech",
    sections: [
      {
        heading: "Competitive Landscape",
        body: "Same three competitors as Heavy Equipment: Handshake, LinkedIn Talent Solutions, ATS platforms.",
      },
      {
        heading: "Energy-Specific Win Condition",
        body: "Energy sector TA teams run 3 to 5 major recruiting events per year with no system for capturing candidate intent during the event. The status quo is a clipboard and a business card bowl. Momentify is the first structured alternative.",
      },
      {
        heading: "Killer Question",
        body: "\"How many of the engineers your team spoke with at [last conference] ended up accepting offers from your competitors because your follow-up took too long?\"",
      },
    ],
  },
]

/* ── Direct to Customer: Aerospace & Aviation ── */

const aerospaceAviationLayers: GTMLayer[] = [
  {
    id: 1,
    label: "ICP + Buyer Personas",
    sections: [
      {
        heading: "Primary Buyer",
        body: "Title: Defense HR Director, Talent Acquisition Manager at defense OEM or systems integrator\nHard-to-fill roles: systems engineers, program managers, cleared professionals, avionics specialists\nEvents: AUSA hiring events, AFCEA recruiting, university ROTC and engineering recruiting, Sea-Air-Space talent sessions",
      },
      {
        heading: "Security Clearance Sensitivity",
        body: "Momentify does not touch or process clearance data. The platform captures engagement metadata and candidate interest signals only. No clearance-related data is collected or stored.",
      },
      {
        heading: "Anti-ICP",
        body: "\u2022 Companies without cleared hiring programs\n\u2022 Organizations that do not attend industry events",
      },
    ],
  },
  {
    id: 2,
    label: "Core Message + Proof Points",
    sections: [
      {
        heading: "Headline",
        body: "Cleared talent is rare. The conversation you do not document is the hire you lose.",
      },
      {
        heading: "ITAR/Security Framing",
        body: "Momentify captures engagement metadata and candidate interest signals. No clearance-related data is collected or stored. The platform operates above the security boundary, focusing on behavioral and engagement intelligence.",
      },
      {
        heading: "Proof Points",
        body: "\u2022 A defense industry client deployed services-based engagement at DSEI, IDEX, and AUSA\n\u2022 40% improvement in lead qualification applies to candidate qualification in defense context\n\u2022 In aerospace and defense, the real competitor is a spreadsheet and a business card stack",
      },
    ],
  },
  {
    id: 3,
    label: "Lead Magnets",
    sections: [
      {
        heading: "Primary: Defense Recruiting Event ROX Audit",
        body: "Self-assessment for defense TA teams. Evaluates how well your team captures and qualifies cleared talent at military transition, ROTC, and industry recruiting events.",
      },
      {
        heading: "Secondary: Recruiting Cleared Talent at Industry Events",
        body: "Gated PDF covering best practices for engaging cleared professionals and transitioning military talent at defense and aerospace events. Emphasis on compliance-safe engagement capture.",
      },
    ],
  },
  {
    id: 4,
    label: "Outreach Sequences",
    sections: [
      {
        heading: "Touch 1 (Day 0)",
        body: "Subject: \"How many cleared candidates from [last event] made it to your pipeline?\"\nPain: Defense recruiting events produce handshakes and business cards but no structured way to assess which candidates were genuinely interested in your roles.\nCTA: Defense Recruiting ROX Audit",
      },
      {
        heading: "Touch 2 (Day 4)",
        body: "Subject: \"From handshake to pipeline in hours, not weeks\"\nReference: Defense-sector deployments where Momentify captured candidate engagement at AUSA and AFCEA events without touching clearance data.\nCTA: 20-minute call",
      },
      {
        heading: "Touch 3 (Day 9)",
        body: "Subject: \"One question about your talent pipeline\"\nBody: \"In defense, a missed candidate at an event can mean a 12-month search restart. How does your team know which conversations to prioritize after a recruiting event?\"\nCTA: Short call or case study",
      },
    ],
  },
  {
    id: 5,
    label: "Sales Enablement",
    sections: [
      {
        heading: "Discovery Opener",
        body: "\"Walk me through what happens after your team meets a strong candidate at a defense industry event. How do you assess fit and intent when clearance requirements limit your candidate pool?\"",
      },
      {
        heading: "Discovery Questions",
        body: "1. \"What are the hardest cleared roles to fill in your organization right now?\"\n2. \"How does your team currently capture candidate interest at AUSA, AFCEA, or university ROTC events?\"\n3. \"After a recruiting event, how long before your top candidates hear from someone on your team?\"\n4. \"What does a 6-month vacancy in a cleared engineering role cost your program?\"\n5. \"If you could see which candidates at your booth were most engaged, without collecting any clearance data, how would that change your follow-up?\"",
      },
      {
        heading: "Objection Responses",
        body: "\u2022 \"Security concerns with candidate data.\" Momentify captures engagement metadata and interest signals only. No clearance data, no ITAR-restricted information, no classified details. The platform operates above the security boundary.\n\u2022 \"We have internal HR systems.\" Those systems track applicants after they apply. Momentify tells you who to prioritize before the application, based on event engagement.\n\u2022 \"Our events are small and specialized.\" That makes each interaction more valuable. In defense, the cost of a missed candidate is measured in months, not dollars.",
      },
    ],
  },
  {
    id: 6,
    label: "ROX Metrics + KPIs",
    sections: [
      {
        heading: "Aerospace-Specific ROX Dimensions",
        body: "\u2022 Candidate Capture Rate: cleared candidates engaged vs total event interaction count\n\u2022 Engagement Quality: depth of role interest, program alignment, and timeline indicators\n\u2022 Follow-Up Speed: hours from event interaction to recruiter outreach\n\u2022 Conversion Rate: candidates captured to security screening to offer",
      },
      {
        heading: "Reporting Frame for Leadership",
        body: "\"At [Event], Momentify helped us identify [X] pipeline-ready cleared candidates within [Y] hours. Our cost per qualified candidate was [Z] versus our prior event baseline, with zero collection of clearance-restricted data.\"",
      },
    ],
  },
  {
    id: 7,
    label: "Competitive Intel: Recruiting Tech",
    sections: [
      {
        heading: "Competitive Landscape",
        body: "Same three competitors: Handshake, LinkedIn Talent Solutions, ATS platforms. In aerospace and defense, the most common competitor is not a named tool but the status quo: spreadsheets, business cards, and manual notes.",
      },
      {
        heading: "Aerospace-Specific Win Condition",
        body: "No enterprise recruiting tool addresses in-person event capture for cleared hiring programs. Momentify fills a gap that does not have an incumbent solution.",
      },
      {
        heading: "Killer Question",
        body: "\"After your last AUSA or AFCEA event, how did your team decide which candidates to call first? And how many had already accepted other offers by the time you reached out?\"",
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
        body: "Title: Technical Recruiting Agency Director, Workforce Development Director at industry association\nPartner types: recruiting agencies specializing in technical talent (engineering, defense, energy), workforce development organizations, industry associations with career placement programs (SME, NDIA, AEM)",
      },
      {
        heading: "Partner Pain",
        body: "Clients ask what came back from the recruiting event investment. The agency has no structured answer. Candidate quality data stays in recruiters' heads, not in reports.",
      },
      {
        heading: "Anti-ICP",
        body: "\u2022 Generalist staffing agencies\n\u2022 Consumer-facing HR consultancies",
      },
    ],
  },
  {
    id: 2,
    label: "Partner Message",
    sections: [
      {
        heading: "Headline",
        body: "Add candidate intelligence to every recruiting event you run.",
      },
      {
        heading: "Partner Pitch",
        body: "You bring the candidates. Momentify tells you which ones your clients should call first. That is the intelligence gap you can close right now.",
      },
      {
        heading: "Co-Sell Model",
        body: "Partner delivers the recruiting experience. Momentify delivers the candidate intelligence layer. One unified post-event report showing qualified pipeline, not just attendance.",
      },
    ],
  },
  {
    id: 3,
    label: "Lead Magnets",
    sections: [
      {
        heading: "Primary: Partner Intelligence Briefing",
        body: "30-minute briefing showing how recruiting agencies and workforce development organizations add a candidate intelligence layer to every event they run, without building internal tools.",
      },
      {
        heading: "Secondary: The Co-Sell Playbook for Recruiting Partners",
        body: "Gated PDF explaining the partner revenue model, implementation timeline, and case study framework for pitching Momentify alongside existing recruiting services.",
      },
    ],
  },
  {
    id: 4,
    label: "Outreach Sequences",
    sections: [
      {
        heading: "Touch 1 (Day 0)",
        body: "Subject: \"Your clients are asking what the recruiting event returned\"\nPain: Recruiting agencies run events for their clients and walk away with attendance lists, not candidate intelligence. The client wants proof. The agency has none.\nCTA: Partner Intelligence Briefing",
      },
      {
        heading: "Touch 2 (Day 4)",
        body: "Subject: \"One report that changes the partner conversation\"\nReference: How agencies using Momentify deliver a unified post-event candidate intelligence report that clients cannot get anywhere else.\nCTA: 20-minute call",
      },
      {
        heading: "Touch 3 (Day 9)",
        body: "Subject: \"Build vs buy: candidate intelligence for your events\"\nBody: \"Building a candidate scoring system is a 12-month project. Momentify activates in one event. Worth a quick look?\"\nCTA: Short call",
      },
    ],
  },
  {
    id: 5,
    label: "Sales Enablement",
    sections: [
      {
        heading: "Discovery Opener",
        body: "\"When your clients ask you what their recruiting event actually produced, what do you show them today?\"",
      },
      {
        heading: "Discovery Questions",
        body: "1. \"How many recruiting events do you run per year for your clients?\"\n2. \"How do you currently report on candidate quality and engagement back to the hiring organization?\"\n3. \"Have any of your clients asked for more structured event intelligence or candidate scoring?\"\n4. \"What would it mean for your agency if you could deliver a candidate intelligence report alongside your recruiting services?\"\n5. \"How long would it take you to build something like this internally?\"",
      },
      {
        heading: "Objection Responses",
        body: "\u2022 \"We have our own processes.\" This does not replace your process. It adds an intelligence layer on top of it. Your clients get a report they cannot get from anyone else.\n\u2022 \"Our clients have not asked for this.\" They will. The question is whether you bring it to them first or a competitor does.\n\u2022 \"We need to see the economics.\" The revenue share model means this generates new revenue, not new cost. One client deployment pays for itself.",
      },
    ],
  },
  {
    id: 6,
    label: "ROX Metrics + KPIs",
    sections: [
      {
        heading: "Partner-Specific ROX Dimensions",
        body: "\u2022 Client-Facing Metrics: candidates captured, engagement scores, pipeline velocity by event\n\u2022 Partner Metrics: events deployed, revenue per event, client retention and expansion\n\u2022 Operational: time from deployment decision to live event, partner team ramp time",
      },
      {
        heading: "Partner Reporting Frame",
        body: "\"We deployed Momentify at [X] recruiting events for [Client]. The platform identified [Y] pipeline-ready candidates within [Z] hours of each event. Our clients now have a structured view of candidate quality they never had before.\"",
      },
    ],
  },
  {
    id: 7,
    label: "Competitive Intel",
    sections: [
      {
        heading: "Competitive Landscape",
        body: "Partner motion competes against the build-vs-partner decision, not named tools. The alternative is the agency building its own candidate scoring system internally.",
      },
      {
        heading: "Win Condition",
        body: "Building a candidate scoring system is a 12-month project. Momentify activates in one event. The partner gets a differentiated offering without the development timeline or risk.",
      },
      {
        heading: "Killer Question",
        body: "\"If your biggest client asked you tomorrow to add candidate intelligence to your next recruiting event, how long would it take you to deliver that?\"",
      },
    ],
  },
]

/* ── Comparison Table ── */

export const comparisonTable = {
  headers: [
    "Capability",
    "Momentify",
    "Handshake",
    "LinkedIn Talent",
    "ATS (Workday etc)",
  ],
  rows: [
    [
      "In-event candidate intent capture",
      "Yes",
      "No. Sourcing only",
      "No. Sourcing only",
      "No. Post-apply only",
    ],
    [
      "Real-time engagement scoring",
      "Yes",
      "No",
      "No",
      "No",
    ],
    [
      "Event-specific ROX reporting",
      "Yes",
      "No",
      "No",
      "No",
    ],
    [
      "Works at in-person recruiting events",
      "Yes",
      "Limited. Campus focus",
      "No",
      "No",
    ],
    [
      "Integrates above existing ATS",
      "Yes. Sits above, not replacing",
      "N/A",
      "N/A",
      "N/A",
    ],
    [
      "Industry-specific templates",
      "Yes. Heavy equipment, defense, energy",
      "Generic",
      "Generic",
      "Generic",
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
      {
        vertical: "aerospace-aviation",
        label: "Aerospace & Aviation",
        layers: aerospaceAviationLayers,
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
    persona: "Recruiter / Recruitment Specialist / Trainer",
    rows: [
      {
        painPoint: "Manual lead capture with clipboards and paper forms",
        objective: "Capture qualified leads efficiently with instant digital capture",
        kpi: "# of leads captured, data accuracy rate",
        primaryFeatures: "Lead Capture and Custom Forms with role-specific fields",
        secondaryFeatures: "QR registration, device naming by zone",
        competitiveAdvantage: "Captures both who engaged and how deeply they engaged, not just contact info",
      },
      {
        painPoint: "Generic conversations that fail to differentiate candidates",
        objective: "Personalize conversations in real time using role-based content",
        kpi: "Content interactions per candidate, engagement depth",
        primaryFeatures: "Persona-Based Content Delivery with interactive journeys",
        secondaryFeatures: "Role selector, trait tagging, guided flows",
        competitiveAdvantage: "Most tools collect data. Momentify drives the conversation with tailored content paths",
      },
      {
        painPoint: "No way to prioritize follow-up after events",
        objective: "Track engagement to prioritize high-interest candidates",
        kpi: "Time to follow-up, candidate temperature scoring",
        primaryFeatures: "Engagement Analytics Dashboard with sorting and filtering",
        secondaryFeatures: "Hot/warm/cold scoring, trait-based segmentation",
        competitiveAdvantage: "Recruiters know who to call first based on behavior, not guesswork",
      },
      {
        painPoint: "Inconsistent booth execution across team members",
        objective: "Train and support booth staff with preloaded content and roles",
        kpi: "Staff readiness score, content consistency %",
        primaryFeatures: "User Access and Role Assignment with pre-assigned permissions",
        secondaryFeatures: "Template library, device content preloading",
        competitiveAdvantage: "Every team member delivers a consistent, brand-controlled experience",
      },
    ],
  },
  {
    persona: "HR Manager / VP of HR / Recruiting Manager / Training Manager",
    rows: [
      {
        painPoint: "Cannot measure recruiting event ROI",
        objective: "Improve recruiting pipeline performance with measurable analytics",
        kpi: "ROX score, cost per qualified candidate, conversion rate",
        primaryFeatures: "Post-Event Analytics and ROX Reporting",
        secondaryFeatures: "One-click report exports, benchmark comparisons",
        competitiveAdvantage: "Introduces ROX as a performance layer that HR leadership can trust and act on",
      },
      {
        painPoint: "Inconsistent employer brand across events and regions",
        objective: "Ensure brand consistency with centralized content management",
        kpi: "Content compliance %, messaging consistency",
        primaryFeatures: "Centralized Content Management across field teams",
        secondaryFeatures: "Template library, guided journeys",
        competitiveAdvantage: "One platform controls all recruiting content across every event and location",
      },
      {
        painPoint: "Leads get lost between event and hiring manager",
        objective: "Accelerate time-to-hire with smart lead routing",
        kpi: "Time to assignment, follow-up velocity, handoff accuracy",
        primaryFeatures: "Smart Lead Routing via Smart Columns by region, role, and location",
        secondaryFeatures: "CRM/ATS integration, automated assignment",
        competitiveAdvantage: "Leads reach the right hiring manager in minutes, not days",
      },
      {
        painPoint: "Recruiting disconnected from workforce development",
        objective: "Align recruiting with broader workforce and training goals",
        kpi: "Pipeline to onboarding handoff rate, training program enrollment",
        primaryFeatures: "Template Library and Guided Journeys aligned to onboarding paths",
        secondaryFeatures: "Training-aligned messaging, development pathway content",
        competitiveAdvantage: "Bridges recruiting and training from day one of the candidate relationship",
      },
    ],
  },
]

/* ── Lead Magnets ── */

export const leadMagnets: LeadMagnet[] = [
  {
    title: "Top 10 Career Fair Booth Mistakes to Avoid",
    format: "PDF Checklist",
    audience: "Recruiters, Trainers, Campus Recruiting Teams",
    problem: "Poor booth engagement and missed candidate opportunities from common, avoidable mistakes",
    featureHighlighted: "Preloaded Content Templates, Engagement Tracking",
    delivery: "Gated landing page, email campaign",
    sections: [
      { heading: "Bringing Clipboards Instead of Tools", body: "Paper forms slow you down, get lost, and delay follow-up. Go digital with real-time lead capture." },
      { heading: "Treating Every Candidate the Same", body: "Not everyone is looking for the same path. Tailor your pitch by role, background, and interest using personalized content." },
      { heading: "Forgetting to Train Your Team", body: "Even the best tech fails if your booth team is not ready. Pre-event onboarding ensures alignment and confidence from the first handshake." },
      { heading: "Not Knowing Who to Follow Up With", body: "If you do not know who is engaged, you are guessing. Use engagement analytics to prioritize high-interest candidates immediately." },
      { heading: "Letting Leads Slip Through the Cracks", body: "Lack of ownership means lost opportunities. Use smart routing to ensure every lead is followed up by the right person, fast." },
    ],
  },
  {
    title: "Recruiting ROI and ROX Calculator",
    format: "Interactive Web Tool",
    audience: "HR Managers, VPs of HR, Recruiting Leadership",
    problem: "No clear way to quantify impact or effectiveness of recruiting events",
    featureHighlighted: "ROX Dashboard, Analytics, Cost-per-Hire Tracking",
    delivery: "Website popup, dedicated webpage, social ad",
    sections: [
      { heading: "Input Your Event Data", body: "Enter event cost, staffing, travel, and estimated candidate traffic to establish your baseline investment per recruiting event." },
      { heading: "Engagement Metrics", body: "Input candidates captured, average engagement time, content interactions, and follow-up speed to calculate your engagement quality score." },
      { heading: "Conversion Tracking", body: "Map candidates to phone screens, offers, and hires to see the full funnel from booth to placement." },
      { heading: "ROX Score Output", body: "Receive a composite ROX score across four recruiting dimensions: Candidate Capture Rate, Engagement Quality, Follow-Up Speed, and Conversion Effectiveness." },
    ],
  },
  {
    title: "Field Guide: Designing an Engaging Recruiting Booth",
    format: "Visual One-Pager",
    audience: "Recruitment Specialists, Campus Recruiters, Event Marketers",
    problem: "Flat or generic booth setups that fail to convert interest into qualified candidate conversations",
    featureHighlighted: "Real-Time Engagement Tracking, Persona-Based Content",
    delivery: "LinkedIn ad, career fair QR handout, website popup",
    sections: [
      { heading: "Zone Your Booth by Visitor Intent", body: "Divide your booth into zones: learn about the company, explore specific roles, and connect with a recruiter. Each zone gets its own content path." },
      { heading: "Place Interactive Touchpoints Strategically", body: "Position tablets and kiosks at natural stopping points. Engagement increases when candidates encounter relevant content at the moment they are most receptive." },
      { heading: "Design for Multiple Candidate Types", body: "Technicians want job details. Students want career paths. Experienced hires want culture and growth. Design content paths that serve each persona." },
    ],
  },
  {
    title: "Instant Lead Capture Toolkit for Recruiters",
    format: "Downloadable Kit",
    audience: "Recruiters, Training Managers, Event Operations",
    problem: "Manual, delayed lead entry and lack of real-time tracking at recruiting events",
    featureHighlighted: "Lead Capture Forms, QR Config, Device Naming, Smart Routing",
    delivery: "Gated thank-you page, partner email",
    sections: [
      { heading: "Booth Setup Diagram", body: "Visual layout showing Welcome Zone, Engagement Zone, Lead Capture Zone, and Analytics Zone with recommended device placement and staffing." },
      { heading: "Lead Form Template", body: "Structured lead capture form with routing fields: name, email, role, zip code (regional routing), interest area (content stream routing), and follow-up preferences." },
      { heading: "Pre-Show Setup Worksheet", body: "Step-by-step preparation: define target personas, match content to personas, set up Smart Routing logic, device naming by zone, and final checklist." },
      { heading: "Post-Event Email Templates", body: "Three templates by persona: Technical Candidate follow-up, Student/New Grad follow-up, and Passive Candidate follow-up. Each references booth engagement for personalized outreach." },
    ],
  },
  {
    title: "How to Route Leads by Region or Role",
    format: "Educational PDF",
    audience: "HR Ops, Regional Managers, CRM Administrators",
    problem: "Leads getting lost or delayed due to unclear ownership after recruiting events",
    featureHighlighted: "Smart Columns, Lead Routing, CRM Integration",
    delivery: "Newsletter, gated blog post",
    sections: [
      { heading: "Define Your Routing Rules", body: "Map candidate attributes to routing destinations. Region, role interest, and engagement score all drive assignment logic." },
      { heading: "Configure Real-Time Assignment", body: "Set up automated routing so candidates are assigned to the right recruiter or hiring manager within minutes of capture." },
      { heading: "Handle Edge Cases", body: "What happens when a candidate matches multiple regions or roles. Define fallback rules to prevent candidates from falling through cracks." },
      { heading: "Measure Routing Effectiveness", body: "Track time-to-assignment, first-touch speed, and conversion by route to continuously improve your candidate handoff process." },
    ],
  },
  {
    title: "Candidate Follow-Up Email Templates",
    format: "Editable Templates",
    audience: "Recruiters, HR Managers, Campus Recruiting Teams",
    problem: "Inconsistent or generic follow-up that loses momentum after events",
    featureHighlighted: "Content Personalization, Engagement-Based Scoring",
    delivery: "Email sequence, community post",
    sections: [
      { heading: "Technical Candidate Follow-Up", body: "References specific role interest and booth engagement. Direct, professional, and connects to next steps." },
      { heading: "Student / New Grad Follow-Up", body: "Warm, encouraging tone. Highlights apprenticeship and training paths. Invites continued engagement." },
      { heading: "Passive Candidate Follow-Up", body: "Low-pressure. Shares relevant resources and keeps the door open without pushing for commitment." },
    ],
  },
  {
    title: "Recruiting Readiness: Device and Content Setup Guide",
    format: "Setup Guide",
    audience: "Event Coordinators, Recruiting Operations, IT Support",
    problem: "Devices and content not properly configured before recruiting events, leading to missed capture opportunities",
    featureHighlighted: "Device Naming, Content Preloading, Smart Columns",
    delivery: "Included in onboarding package, gated download",
    sections: [
      { heading: "Device Naming by Zone", body: "Name each device by function: Front Desk, Resume Drop Station, Demo Station, Role Info Kiosk, Exit Interaction. Enables zone-level reporting and targeted content delivery." },
      { heading: "Content Preloading by Role or Region", body: "Assign different content templates to devices based on job role, target region, or recruiting objectives. Ensures the right content reaches the right audience." },
      { heading: "Pre-Event Checklist", body: "Devices named by location. Templates assigned correctly. Smart Columns active. Each device tested in Preview Mode. Team members trained on which device to use where." },
    ],
  },
  {
    title: "Momentify for Recruiting: Case Study",
    format: "Case Study PDF",
    audience: "All Recruiting Personas, HR Leadership",
    problem: "Lack of proof or clarity around platform success and impact for recruiting use cases",
    featureHighlighted: "Full Platform ROI, Engagement Analytics, Smart Routing",
    delivery: "Sponsored LinkedIn post, gated download page",
    sections: [
      { heading: "The Challenge", body: "Equipment dealers were spending significant budgets on career fairs and recruiting events with no structured way to measure candidate quality, engagement depth, or pipeline contribution." },
      { heading: "The Approach", body: "Momentify was deployed at career fairs and recruiting events to capture candidate details instantly, score engagement, and route leads to the right follow-up owners automatically." },
      { heading: "The Results", body: "Teams walked away knowing who they met, what candidates cared about, and how to follow up while the conversation was still fresh. 40% improvement in candidate qualification. Follow-up speed went from days to hours." },
      { heading: "Key Takeaway", body: "Recruiting events are not a cost center. They are a talent pipeline accelerator. Momentify provides the proof that turns recruiting events from a budget line into a hiring engine." },
    ],
  },
]

/* ── LinkedIn Outreach Templates ── */

export const linkedInOutreach: LinkedInOutreach[] = [
  {
    segment: "Dealer Networks and Heavy Equipment",
    subsegment: "Recruiters and TA Leaders",
    message: "Several industrial dealers have reimagined their career fair strategies, transforming them into data-driven engines for attracting top talent. They are not just collecting resumes anymore. They walk away from every event knowing who they met, what those candidates cared about, and how to follow up while the conversation is still fresh. That is the difference between showing up and building a real talent pipeline.",
  },
  {
    segment: "Energy and Infrastructure",
    subsegment: "Workforce Development Leaders",
    message: "In energy and infrastructure, the talent pool for engineers and field technicians is small and relationship-driven. One missed conversation at an industry event has a 12-month cost. We help workforce development teams capture candidate intent during the event, not after. So your follow-up is specific, fast, and relevant. If your team is attending POWER-GEN or DistribuTECH talent programs, it might be worth a quick look.",
  },
  {
    segment: "Aerospace and Defense",
    subsegment: "Defense HR and TA Leaders",
    message: "Cleared talent is rare. The conversation you do not document is the hire you lose. At events like AUSA and AFCEA, your team meets candidates who are evaluating multiple employers simultaneously. We help defense TA teams capture engagement signals, without touching clearance data, so you know who to call first. No clipboards. No guesswork. Just structured candidate intelligence from every event.",
  },
  {
    segment: "Recruiting Agencies and Workforce Partners",
    subsegment: "Agency Directors",
    message: "Your clients are asking what the recruiting event returned. Most agencies have attendance lists and anecdotes. We help recruiting agencies add a candidate intelligence layer to every event they run. Your team delivers the experience. Momentify delivers the data. One unified post-event report that your clients cannot get anywhere else.",
  },
  {
    segment: "University and Campus Recruiting",
    subsegment: "Campus Recruiters",
    message: "Your campus recruiting events bring hundreds of students through in a single day. Most of those interactions are forgotten by the time your team is on the drive home. We help campus recruiters capture what each student was interested in, which roles they explored, and how engaged they were during the conversation. So your follow-up feels personal, not generic.",
  },
]

/* ── ENTEVATE Positioning ── */

export const entevatePositioning = {
  headline: "Beyond the Platform: ENTEVATE as Your Recruiting Intelligence Partner",
  subhead: "Momentify is the technology. ENTEVATE is the expertise that makes it work for technical recruiting, workforce development, and talent acquisition at scale.",
  expertiseAreas: [
    {
      title: "Technical Talent Environments",
      description: "Where the candidates you need are scarce, competition is fierce, and the cost of a missed hire is measured in months, not days. ENTEVATE understands how technical talent evaluates opportunities and configures Momentify to capture the signals that matter.",
    },
    {
      title: "Multi-Event Recruiting Programs",
      description: "Where organizations run 5 to 20 recruiting events per year across career fairs, university visits, and industry conferences. ENTEVATE brings portfolio-level intelligence so each event builds on the last.",
    },
    {
      title: "Workforce Development Alignment",
      description: "Where recruiting and training need to work together from day one. ENTEVATE designs engagement experiences that bridge talent acquisition and onboarding pathways.",
    },
    {
      title: "Industry-Specific Candidate Engagement",
      description: "Where diesel technicians, systems engineers, and cleared professionals each require different engagement approaches. ENTEVATE configures persona-driven content paths that feel relevant, not generic.",
    },
    {
      title: "Compliance-Safe Engagement Intelligence",
      description: "Where security clearances, ITAR restrictions, and regulatory requirements constrain what data can be captured. ENTEVATE ensures Momentify operates above the compliance boundary while still delivering actionable candidate intelligence.",
    },
  ],
  capabilities: [
    "Managed services deployment for recruiting teams who want results without internal resource strain",
    "Industry-specific configuration for heavy equipment, energy, aerospace, and defense recruiting",
    "Multi-event portfolio management with unified ROX reporting across your entire recruiting calendar",
    "Post-event intelligence activation connecting candidate engagement to ATS and hiring workflows",
  ],
  industries: [
    "Heavy Equipment and Construction",
    "Energy and Infrastructure",
    "Aerospace and Defense",
    "Technical Staffing and Workforce Development",
  ],
  differentiators: [
    "Faster deployment because the team understands your industry and the talent landscape you compete in",
    "Smarter configuration because the platform is tuned to how your candidates actually engage at events",
    "Better outcomes because the intelligence captured maps to how hiring decisions are actually made in your market",
  ],
}
