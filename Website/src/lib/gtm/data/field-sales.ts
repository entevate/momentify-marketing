/* ═══════════════════════════════════════════════════════════════
   Field Sales Enablement — GTM Framework Data
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
        body: "Title: VP of Sales, National Sales Manager, or Sales Operations Director at OEM, distributor, or large dealer group\nCompany: distributor or dealer with 10+ field reps visiting customer sites, job sites, and shop floors on a regular cadence\nInteraction contexts: customer shop floor visits, job site walk-arounds, product demo days, customer appreciation events, dealer open houses",
      },
      {
        heading: "Secondary Buyer",
        body: "Title: Regional Sales Manager who owns field rep performance\nThey manage the reps. The VP owns the number.",
      },
      {
        heading: "Goals",
        body: "\u2022 Know what content field reps are actually using in customer conversations\n\u2022 Understand customer intent signals before the rep files a call report 5 days later\n\u2022 Equip reps with the right content for the right persona at the right time (not a PDF folder)\n\u2022 Give sales leadership visibility into field engagement without waiting for CRM updates",
      },
      {
        heading: "Blockers",
        body: "\u2022 \"Our CRM handles field activity.\" CRM captures what the rep logs. Momentify captures what the customer engaged with. Those are different.\n\u2022 \"Our reps use their own materials.\" That is the problem we are solving, not the reason to not solve it.\n\u2022 \"This is a Salesforce / HubSpot question.\" Frame as a field-layer tool that feeds those systems, not replaces them.",
      },
      {
        heading: "Anti-ICP",
        body: "\u2022 Inside sales teams with no field motion\n\u2022 Organizations where reps work from a central office and customers come to them\n\u2022 Companies with fewer than 10 field reps\n\u2022 Businesses where product is sold entirely through a digital or inbound channel",
      },
      {
        heading: "Budget Authority",
        body: "VP of Sales owns the budget, Sales Operations influences, CFO approves above $25K",
      },
      {
        heading: "Trigger Events",
        body: "\u2022 Field rep turnover exposing inconsistent materials\n\u2022 Lost deal where wrong content was used\n\u2022 Sales leadership asking why CRM data is always late and incomplete",
      },
    ],
  },
  {
    id: 2,
    label: "Core Message + Proof Points",
    sections: [
      {
        heading: "Headline",
        body: "Your rep was on the job site. Do you know what moved?",
      },
      {
        heading: "Subhead",
        body: "Momentify gives field teams persona-driven content and gives leadership real-time visibility into what is actually working in the field.",
      },
      {
        heading: "Key Differentiator",
        body: "Content delivery and intent capture together in one field interaction. Not just a content library. Not just a CRM note. Both, in real time.",
      },
      {
        heading: "Proof Points",
        body: "\u2022 Equipment dealer field deployment: persona-driven content delivery, engagement capture, real-time rep insights\n\u2022 40% improvement in lead qualification across deployments applies directly to field sales qualification accuracy\n\u2022 Field reps equipped with Momentify can deliver the right content for the right persona without searching through folders or emailing their marketing team",
      },
      {
        heading: "Objection Handling",
        body: "\u2022 \"Showpad / Highspot does this.\" Those are content libraries. They tell you what content was opened on a device. Momentify captures how the customer engaged with it during the actual interaction.\n\u2022 \"Our reps already have tablets.\" The tablet is the device. Momentify is the intelligence layer that makes what happens on the tablet visible to leadership.",
      },
    ],
  },
  {
    id: 3,
    label: "Lead Magnets",
    sections: [
      {
        heading: "Primary: The Field Sales Visibility Gap",
        body: "Guide for VP Sales and Sales Ops on the intelligence lost between field visits and CRM entry. Covers what data disappears in the 3 to 5 day CRM lag, the cost of invisible field engagement, and how to close the gap without adding more process to your reps.",
      },
      {
        heading: "Secondary: Field Sales ROX Audit",
        body: "Self-assessment on how well your field team captures and acts on customer intent. Scores across four dimensions: Content Delivery Accuracy, Customer Engagement Depth, CRM Sync Speed, and Opportunity Conversion.",
      },
      {
        heading: "Tertiary: ROX Calculator for Field Sales",
        body: "Adapted ROX Calculator focused on field sales metrics: qualified opportunities per field rep per month, value per qualified field interaction, CRM data completeness improvement.",
      },
    ],
  },
  {
    id: 4,
    label: "Outreach Sequences",
    sections: [
      {
        heading: "Touch 1 (Day 0)",
        body: "Subject: \"What actually happened in that customer visit last Tuesday?\"\nPain: Field reps visit 8 to 12 customers per week. CRM notes arrive 3 to 5 days later, if at all. Leadership is flying blind on what content works and who is actually interested.\nCTA: Field Sales ROX Audit",
      },
      {
        heading: "Touch 2 (Day 4)",
        body: "Subject: \"How equipment dealers changed field rep performance\"\nReference: Momentify's dealer network deployment. Persona-driven content in the field, real-time engagement capture. Reps spent less time searching for materials and more time in the conversation.\nCTA: 20-minute call",
      },
      {
        heading: "Touch 3 (Day 9)",
        body: "Subject: \"One last question then I will leave you alone\"\nBody: \"How much pipeline do your field reps generate per month? How confident are you in that number? Worth a 20-minute conversation to find out what you are missing?\"\nCTA: ROX Calculator for field sales",
      },
      {
        heading: "LinkedIn DM Flow",
        body: "DM 1: Reference their field team size or a specific customer segment they serve. One question about how their reps currently share content during customer visits.\nDM 2 (Day 5): Drop the Field Sales Visibility Gap guide with one sentence. No pitch.\nDM 3 (engaged): Offer a call or the ROX Audit.",
      },
    ],
  },
  {
    id: 5,
    label: "Sales Enablement",
    sections: [
      {
        heading: "Discovery Opener",
        body: "\"Walk me through what happens after one of your field reps visits a customer site. How does that information get back to you, and how long does it take?\"",
      },
      {
        heading: "Discovery Questions",
        body: "1. \"How many field reps do you have and how many customer touchpoints do they handle per week?\"\n2. \"When a rep visits a job site or shop floor, how do you know what content they used and how the customer reacted?\"\n3. \"How long on average between a field visit and a CRM update? What do you think you are missing in that gap?\"\n4. \"If you could see in real time what your best rep does differently from your average rep, what would you change?\"\n5. \"What does a qualified field opportunity look like, and how do you currently identify one?\"",
      },
      {
        heading: "Objection Responses",
        body: "\u2022 \"We use Salesforce for this.\" Salesforce is where the rep logs the outcome. Momentify captures the interaction itself. What content the customer engaged with, how long, and what they cared about. That is the data that makes the CRM record meaningful.\n\u2022 \"Our reps are resistant to new tools.\" Momentify works through a tablet or phone the rep already has. The interface is designed for a 60-second setup at the start of a visit, not a training program.\n\u2022 \"We have Highspot / Showpad.\" Those solve content storage and delivery. Momentify captures the customer's response to the content in real time. They are complementary.",
      },
    ],
  },
  {
    id: 6,
    label: "ROX Metrics + KPIs",
    sections: [
      {
        heading: "Field Sales ROX Dimensions",
        body: "\u2022 Content Delivery Accuracy: right content for the right persona in the right context\n\u2022 Customer Engagement Depth: time with content, questions captured, persona signals\n\u2022 CRM Sync Speed: hours from field interaction to CRM record creation\n\u2022 Opportunity Conversion: field visits to qualified pipeline, by rep and by region",
      },
      {
        heading: "Reporting Frame for Sales Leadership",
        body: "\"In Q[X], Momentify-enabled field reps generated [X]% more qualified pipeline per visit than non-enabled reps. Average CRM lag dropped from [X] days to [X] hours.\"",
      },
      {
        heading: "Key Metrics to Track",
        body: "\u2022 Qualified opportunities per field rep per month\n\u2022 Content utilization rate by persona and product line\n\u2022 Average CRM entry lag (days to hours)\n\u2022 Pipeline attribution to field interactions vs other sources",
      },
    ],
  },
  {
    id: 7,
    label: "Competitive Intel: Sales Enablement Platforms",
    sections: [
      {
        heading: "Competitive Landscape",
        body: "Primary competitors: Showpad, Highspot, Seismic. These are content management and delivery platforms, not field engagement intelligence tools.",
      },
      {
        heading: "vs Showpad",
        body: "Showpad tells you what content a rep accessed on their device. Momentify tells you how the customer engaged with it during the visit. One is rep behavior data. The other is customer intent data. Both matter. Only one affects your pipeline.",
      },
      {
        heading: "vs Highspot",
        body: "Highspot is a strong content governance tool. If their primary problem is content chaos, Highspot solves it. If their problem is invisible field engagement, that is the Momentify conversation.",
      },
      {
        heading: "vs Seismic",
        body: "Seismic is built for inside and enterprise sales teams with structured content programs. It is not designed for field reps in a job site context or a shop floor. The UX does not survive a field environment.",
      },
      {
        heading: "How to Win",
        body: "Lead with the CRM lag problem. \"What happens between the visit and the CRM entry is where deals are won and lost. No sales enablement platform solves that. Momentify does.\"",
      },
      {
        heading: "Killer Question",
        body: "\"If I could show you which of your field reps are generating 80% of your qualified pipeline and exactly what they do differently, would that change how you train and equip the rest?\"",
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
        body: "Title: VP of Sales or Regional Sales Manager at energy equipment distributor, utility services company, or EPC firm\nField contexts: power generation site visits, substation walkdowns, construction site check-ins, customer operations center tours",
      },
      {
        heading: "Anti-ICP",
        body: "\u2022 Utilities with no field sales function\n\u2022 Project-only businesses with no ongoing sales relationship",
      },
    ],
  },
  {
    id: 2,
    label: "Core Message + Proof Points",
    sections: [
      {
        heading: "Headline",
        body: "Your rep walked the substation. Do you know what the customer cared about?",
      },
      {
        heading: "Key Insight",
        body: "In energy infrastructure, field relationships precede procurement decisions by 18 to 24 months. Every field visit is the start of a future deal or the end of one.",
      },
      {
        heading: "Proof Points",
        body: "\u2022 Fortune 75 Manufacturer deployed Momentify for field engagement intelligence at energy customer sites\n\u2022 40% improvement in lead qualification across deployments\n\u2022 Energy field reps visit the same customers repeatedly. Without structured capture, each visit starts from zero.",
      },
    ],
  },
  {
    id: 3,
    label: "Lead Magnets",
    sections: [
      {
        heading: "Primary: Energy Field Sales Visibility Gap Guide",
        body: "Adapted for energy sales leaders. Covers the intelligence lost between substation walkdowns, site visits, and CRM updates. The 18 to 24 month relationship cycle means every lost data point compounds.",
      },
      {
        heading: "Secondary: Energy Field Sales ROX Audit",
        body: "Self-assessment for energy field teams. Evaluates content delivery, customer engagement depth, follow-up speed, and opportunity conversion in the energy infrastructure context.",
      },
    ],
  },
  {
    id: 4,
    label: "Outreach Sequences",
    sections: [
      {
        heading: "Touch 1 (Day 0)",
        body: "Subject: \"What did the customer care about during that site visit?\"\nPain: Energy field reps visit substations, operations centers, and construction sites regularly. The customer conversation contains critical intent signals. Most of it never makes it to a CRM.\nCTA: Energy Field Sales ROX Audit",
      },
      {
        heading: "Touch 2 (Day 4)",
        body: "Subject: \"From site visit to pipeline in hours, not weeks\"\nReference: Momentify field deployments where engagement intelligence from customer visits was captured in real time and synced to CRM before the rep drove to the next site.\nCTA: 20-minute call",
      },
      {
        heading: "Touch 3 (Day 9)",
        body: "Subject: \"Quick question about your field team\"\nBody: \"In energy, the field relationship drives the procurement decision 18 to 24 months later. How much of that relationship intelligence is in your CRM today? Worth 20 minutes to find out what you are missing.\"\nCTA: ROX Calculator for field sales",
      },
    ],
  },
  {
    id: 5,
    label: "Sales Enablement",
    sections: [
      {
        heading: "Discovery Opener",
        body: "\"Walk me through what happens after one of your reps visits a customer site or walks a substation. How does that conversation get documented, and how long before leadership sees it?\"",
      },
      {
        heading: "Discovery Questions",
        body: "1. \"How many field reps cover your territory, and how many customer sites do they visit per week?\"\n2. \"When a rep walks a substation or visits a customer operations center, how do you know what the customer was focused on?\"\n3. \"How long between a field visit and a CRM update? What intelligence do you think disappears in that window?\"\n4. \"If you could see which product categories or service lines your customers are engaging with most, how would that change your forecast?\"\n5. \"What does a strong field opportunity look like, and how early in the relationship can you identify one?\"",
      },
      {
        heading: "Objection Responses",
        body: "\u2022 \"Our CRM is where we track this.\" Your CRM tracks what the rep enters. Momentify captures what the customer engaged with during the visit. The difference is intent data vs activity data.\n\u2022 \"Our reps have been doing this for 20 years without tools.\" Your best reps have. Your average reps have not. Momentify gives every rep the content and capture tools your best reps already use intuitively.\n\u2022 \"Energy sales cycles are long. We do not need real-time data.\" Long cycles make every data point more valuable. A signal missed today becomes a lost deal 18 months from now.",
      },
    ],
  },
  {
    id: 6,
    label: "ROX Metrics + KPIs",
    sections: [
      {
        heading: "Energy Field Sales ROX Dimensions",
        body: "\u2022 Content Delivery Accuracy: right product or service content for the right stakeholder role\n\u2022 Customer Engagement Depth: topics explored, time spent, follow-up questions captured\n\u2022 CRM Sync Speed: hours from site visit to CRM record\n\u2022 Opportunity Conversion: field visits to qualified pipeline, tracked over the long energy sales cycle",
      },
      {
        heading: "Reporting Frame for Leadership",
        body: "\"In Q[X], field reps using Momentify captured [X] customer intent signals per visit versus [Y] from manual CRM entry. Pipeline attribution from field visits increased by [Z]%.\"",
      },
    ],
  },
  {
    id: 7,
    label: "Competitive Intel: Sales Enablement Platforms",
    sections: [
      {
        heading: "Competitive Landscape",
        body: "Same three competitors as Heavy Equipment: Showpad, Highspot, Seismic. In energy and infrastructure, the Seismic and Highspot conversation almost never happens.",
      },
      {
        heading: "Energy-Specific Win Condition",
        body: "The real competition is a physical product binder and a rep's notebook. Momentify is the first structured field intelligence layer in this context. Energy field teams have no existing tooling for capturing customer engagement during site visits.",
      },
      {
        heading: "Killer Question",
        body: "\"When your rep visits a substation or customer site, how much of that conversation makes it into your CRM? And how much do you think drives the procurement decision 18 months from now?\"",
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
        body: "Title: Business Development Director, Program Sales Manager at defense prime or subcontractor\nField contexts: base visits, program office check-ins, depot tours, customer facility walk-arounds at defense installations",
      },
      {
        heading: "Security Sensitivity",
        body: "Same ITAR framing as Trade Shows and Recruiting. Momentify captures engagement metadata only. No clearance-related, ITAR-restricted, or classified data is collected or stored.",
      },
      {
        heading: "Anti-ICP",
        body: "\u2022 Companies without a field BD motion\n\u2022 Purely inbound government contractors",
      },
    ],
  },
  {
    id: 2,
    label: "Core Message + Proof Points",
    sections: [
      {
        heading: "Headline",
        body: "Program relationships are built in the room. What happened in the room?",
      },
      {
        heading: "Key Insight",
        body: "Defense BD is entirely relationship and conversation driven. The rep who documents the visit wins the program. Most do not document at all.",
      },
      {
        heading: "Proof Points",
        body: "\u2022 A defense industry client deployed services-based engagement at DSEI, IDEX, AUSA for both trade show and field BD contexts\n\u2022 40% improvement in lead qualification across deployments\n\u2022 Defense BD teams have no sales enablement tooling designed for their context. The competitive set is a Word document and a SharePoint folder.",
      },
    ],
  },
  {
    id: 3,
    label: "Lead Magnets",
    sections: [
      {
        heading: "Primary: Defense BD Field Visibility Guide",
        body: "Guide for BD Directors on the intelligence lost between base visits, program office meetings, and internal reporting. Covers compliance-safe engagement capture and how to build institutional knowledge from field interactions.",
      },
      {
        heading: "Secondary: Defense Field ROX Audit",
        body: "Self-assessment for defense BD teams. Evaluates how well your team captures program intelligence, customer engagement signals, and relationship context during field interactions.",
      },
    ],
  },
  {
    id: 4,
    label: "Outreach Sequences",
    sections: [
      {
        heading: "Touch 1 (Day 0)",
        body: "Subject: \"What happened in the program office last week?\"\nPain: Defense BD reps visit bases, depots, and program offices regularly. The conversations shape program direction. The details are lost to memory and scattered notes.\nCTA: Defense Field ROX Audit",
      },
      {
        heading: "Touch 2 (Day 4)",
        body: "Subject: \"From base visit to capture report in hours\"\nReference: Defense-sector deployments where Momentify captured engagement intelligence from field BD interactions without touching classified or ITAR-restricted data.\nCTA: 20-minute call",
      },
      {
        heading: "Touch 3 (Day 9)",
        body: "Subject: \"One question about your BD pipeline\"\nBody: \"In defense, the BD team that documents the relationship wins the program. How much of your field intelligence makes it into a structured system today?\"\nCTA: Short call",
      },
    ],
  },
  {
    id: 5,
    label: "Sales Enablement",
    sections: [
      {
        heading: "Discovery Opener",
        body: "\"Walk me through what happens after your BD team visits a base or meets with a program office. How does that intelligence get captured and shared internally?\"",
      },
      {
        heading: "Discovery Questions",
        body: "1. \"How many BD reps or program managers do you have making regular field visits?\"\n2. \"When your team visits a base or depot, how do you capture what the customer was focused on?\"\n3. \"How long between a field visit and an internal debrief or CRM entry? What do you think gets lost?\"\n4. \"If you could see which program interests or capability areas your customers engage with most, how would that change your capture strategy?\"\n5. \"What does a strong program signal look like, and how early can your team typically identify one?\"",
      },
      {
        heading: "Objection Responses",
        body: "\u2022 \"Security concerns with field data.\" Momentify captures engagement metadata only. No classified, ITAR-restricted, or clearance-related data. The platform operates above the security boundary.\n\u2022 \"We use SharePoint and call reports.\" SharePoint stores documents. Call reports capture the rep's summary. Neither captures how the customer actually engaged with your content or capabilities presentation during the visit.\n\u2022 \"Our BD process is too relationship-driven for tools.\" Relationship-driven means every interaction matters more. Momentify does not replace the relationship. It makes the relationship visible to the rest of your organization.",
      },
    ],
  },
  {
    id: 6,
    label: "ROX Metrics + KPIs",
    sections: [
      {
        heading: "Defense BD ROX Dimensions",
        body: "\u2022 Content Delivery Accuracy: right capabilities and program-relevant content for the right stakeholder\n\u2022 Customer Engagement Depth: program areas explored, capability interests, follow-up signals\n\u2022 Capture Speed: hours from field visit to structured intelligence entry\n\u2022 Pipeline Progression: field interactions to capture team decisions, by program and by account",
      },
      {
        heading: "Reporting Frame for Leadership",
        body: "\"In Q[X], BD reps using Momentify captured [X] structured program signals per field visit versus [Y] from manual call reports. Pipeline attribution from field interactions increased by [Z]%, with zero collection of classified or ITAR-restricted data.\"",
      },
    ],
  },
  {
    id: 7,
    label: "Competitive Intel: Sales Enablement Platforms",
    sections: [
      {
        heading: "Competitive Landscape",
        body: "Defense BD teams have no sales enablement tooling designed for their context. The competitive set is a Word document and a SharePoint folder. Momentify wins by default on tooling maturity.",
      },
      {
        heading: "Win Condition",
        body: "No enterprise sales enablement platform is built for defense field BD. Showpad, Highspot, and Seismic are designed for commercial sales teams. The UX, compliance model, and deployment context do not translate to base visits and program office check-ins.",
      },
      {
        heading: "Killer Question",
        body: "\"When one of your BD reps leaves the company, how much program intelligence walks out the door with them? And how long does it take the replacement to rebuild those relationships from scratch?\"",
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
        body: "Title: VP of Channel Sales, Channel Development Manager at OEM managing a dealer or rep network\nPartner types: manufacturers' rep agencies, distributor sales organizations, OEM channel teams that support dealer field reps",
      },
      {
        heading: "Partner Pain",
        body: "OEM has no visibility into what field reps at the dealer level are doing in customer conversations. Momentify gives the OEM an intelligence layer across the dealer network.",
      },
      {
        heading: "Anti-ICP",
        body: "\u2022 Channel programs with fewer than 20 field-facing reps across all partners",
      },
    ],
  },
  {
    id: 2,
    label: "Partner Message",
    sections: [
      {
        heading: "Headline",
        body: "Your dealers are in the field every day. You just cannot see what is happening.",
      },
      {
        heading: "Partner Pitch",
        body: "Momentify gives your channel the content they need and gives you the engagement data you cannot get from a dealer CRM report.",
      },
      {
        heading: "Co-Sell Model",
        body: "OEM provides the content and the platform. Dealer reps use it in the field. The OEM gets engagement intelligence across the entire network. Dealers get better tools. Everyone gets visibility.",
      },
    ],
  },
  {
    id: 3,
    label: "Lead Magnets",
    sections: [
      {
        heading: "Primary: Channel Visibility Intelligence Briefing",
        body: "30-minute briefing for OEM channel leaders on how to gain visibility into dealer field engagement without requiring changes to the dealer's CRM or process.",
      },
      {
        heading: "Secondary: The Channel Enablement Playbook",
        body: "Gated PDF explaining how OEMs deploy Momentify across a dealer network: content management, engagement capture, and unified reporting across all channel partners.",
      },
    ],
  },
  {
    id: 4,
    label: "Outreach Sequences",
    sections: [
      {
        heading: "Touch 1 (Day 0)",
        body: "Subject: \"How do you know what your dealer reps are saying in the field?\"\nPain: OEMs invest in content, training, and brand materials for their dealer network. But once it reaches the dealer, visibility ends. The OEM has no idea what content is being used, how customers respond, or whether the messaging is landing.\nCTA: Channel Visibility Intelligence Briefing",
      },
      {
        heading: "Touch 2 (Day 4)",
        body: "Subject: \"One dashboard for your entire dealer network\"\nReference: How OEMs using Momentify see engagement data from every field interaction across their dealer network, without requiring dealers to change their CRM.\nCTA: 20-minute call",
      },
      {
        heading: "Touch 3 (Day 9)",
        body: "Subject: \"Build vs buy: channel intelligence at scale\"\nBody: \"Building a channel engagement system is a 12-month project that requires dealer adoption of your tools. Momentify activates across the network in weeks. Worth a quick look?\"\nCTA: Short call",
      },
    ],
  },
  {
    id: 5,
    label: "Sales Enablement",
    sections: [
      {
        heading: "Discovery Opener",
        body: "\"When your dealers visit customers in the field, how much visibility do you have into what content they use and how the customer responds?\"",
      },
      {
        heading: "Discovery Questions",
        body: "1. \"How many dealers or channel partners are in your network, and how many field-facing reps are across all of them?\"\n2. \"How do you currently distribute content and materials to your dealer network?\"\n3. \"When a dealer rep visits a customer, do you get any engagement data back? How?\"\n4. \"What would it mean for your channel strategy if you could see which product lines or messaging resonates most across all your dealers?\"\n5. \"Have you tried to build channel visibility tools internally? How did that go?\"",
      },
      {
        heading: "Objection Responses",
        body: "\u2022 \"Our dealers have their own CRMs.\" Exactly. And you cannot see what is in them. Momentify gives you an engagement layer that sits above the dealer's CRM, so you get intelligence without requiring them to change anything.\n\u2022 \"Dealers will resist another tool.\" Momentify is a content tool for the rep and an intelligence tool for the OEM. Dealers get better materials. You get visibility. The value proposition works for both sides.\n\u2022 \"We tried channel enablement tools and adoption was low.\" Adoption fails when the tool adds process. Momentify replaces the PDF folder the rep already uses. Adoption follows when the tool is better than the alternative.",
      },
    ],
  },
  {
    id: 6,
    label: "ROX Metrics + KPIs",
    sections: [
      {
        heading: "Channel-Specific ROX Dimensions",
        body: "\u2022 Content Distribution: percentage of dealer reps actively using OEM-provided content\n\u2022 Engagement Visibility: customer interactions captured across the network per period\n\u2022 Network Coverage: percentage of dealers with active Momentify deployment\n\u2022 Pipeline Attribution: opportunities identified through channel engagement data",
      },
      {
        heading: "Channel Reporting Frame",
        body: "\"Across [X] dealer partners, Momentify captured [Y] customer engagement signals per month. Product line content utilization varied by [Z]%, informing our next content investment and training priorities.\"",
      },
    ],
  },
  {
    id: 7,
    label: "Competitive Intel",
    sections: [
      {
        heading: "Competitive Landscape",
        body: "Channel-focused sales enablement tools like Allego exist but are not common in heavy equipment or defense dealer networks. The real competition is the status quo: dealer reps using their own materials and filing incomplete CRM reports.",
      },
      {
        heading: "Win Condition",
        body: "Momentify wins by making the invisible visible. OEMs have never had real-time engagement intelligence from their dealer network. The alternative is building it internally, which takes 12+ months and requires dealer adoption of the OEM's systems.",
      },
      {
        heading: "Killer Question",
        body: "\"If your top-performing dealer does something different in the field than your bottom performer, do you know what that is? And can you replicate it across the network?\"",
      },
    ],
  },
]

/* ── Comparison Table ── */

export const comparisonTable = {
  headers: [
    "Capability",
    "Momentify",
    "Showpad",
    "Highspot",
    "Seismic",
  ],
  rows: [
    [
      "In-field customer intent capture",
      "Yes",
      "No. Content delivery only",
      "No. Content delivery only",
      "No. Content delivery only",
    ],
    [
      "Real-time rep-level engagement insights",
      "Yes",
      "Partial. Device usage only",
      "Partial. Device usage only",
      "Partial. Device usage only",
    ],
    [
      "ROX scoring framework",
      "Yes",
      "No",
      "No",
      "No",
    ],
    [
      "Works at physical job sites / shop floors",
      "Yes. Offline capable",
      "Limited",
      "Limited",
      "No",
    ],
    [
      "Feeds CRM with engagement data",
      "Yes. Real-time",
      "Export only",
      "Export only",
      "Export only",
    ],
    [
      "Industry-specific persona templates",
      "Yes. Heavy equipment, defense, energy",
      "Generic",
      "Generic",
      "Generic",
    ],
    [
      "Pricing model",
      "Enterprise, services-based",
      "Per seat SaaS",
      "Per seat SaaS",
      "Per seat SaaS",
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
    persona: "Field Sales Rep / Account Manager",
    rows: [
      {
        painPoint: "Searching for the right content during a customer visit",
        objective: "Deliver persona-driven content instantly from a tablet or phone",
        kpi: "Content delivery speed, content relevance score",
        primaryFeatures: "Persona-Based Content Delivery with role-specific paths",
        secondaryFeatures: "Offline mode, device preloading",
        competitiveAdvantage: "Content is organized by customer persona, not by product folder. Reps find what they need in seconds.",
      },
      {
        painPoint: "No way to capture customer reactions during the visit",
        objective: "Capture engagement signals in real time during field interactions",
        kpi: "Engagement signals per visit, intent indicators captured",
        primaryFeatures: "In-field Engagement Capture with trait tagging",
        secondaryFeatures: "Session scoring, note capture",
        competitiveAdvantage: "Most tools track rep behavior. Momentify tracks customer behavior during the interaction.",
      },
      {
        painPoint: "CRM updates are delayed and incomplete",
        objective: "Sync visit data to CRM automatically after each interaction",
        kpi: "CRM sync time, data completeness %",
        primaryFeatures: "Real-Time CRM Integration with engagement context",
        secondaryFeatures: "Automated export, visit summary generation",
        competitiveAdvantage: "CRM gets populated with engagement data, not just a rep's summary note 5 days later.",
      },
      {
        painPoint: "Inconsistent visit quality across the team",
        objective: "Standardize field interactions with guided content flows",
        kpi: "Visit quality score, content consistency %",
        primaryFeatures: "Guided Visit Flows with persona-driven templates",
        secondaryFeatures: "Best practice sharing, rep benchmarking",
        competitiveAdvantage: "Every rep delivers a consistent, data-rich customer experience regardless of tenure.",
      },
    ],
  },
  {
    persona: "VP of Sales / Sales Ops Director / Regional Sales Manager",
    rows: [
      {
        painPoint: "No visibility into field engagement between CRM updates",
        objective: "See real-time field engagement data across all reps",
        kpi: "Field interactions captured per day, engagement trends",
        primaryFeatures: "Field Engagement Dashboard with real-time visibility",
        secondaryFeatures: "Rep comparison, territory heat maps",
        competitiveAdvantage: "Leadership sees what is happening in the field today, not what the rep logged last week.",
      },
      {
        painPoint: "Cannot identify what top reps do differently",
        objective: "Benchmark rep performance and replicate best practices",
        kpi: "Pipeline per rep, engagement depth per visit",
        primaryFeatures: "Rep Performance Analytics with engagement scoring",
        secondaryFeatures: "Content utilization comparison, win pattern analysis",
        competitiveAdvantage: "Data-driven coaching based on customer engagement, not just quota attainment.",
      },
      {
        painPoint: "Field pipeline attribution is unreliable",
        objective: "Connect field visits to pipeline and revenue outcomes",
        kpi: "Pipeline from field interactions, conversion rate by rep",
        primaryFeatures: "Pipeline Attribution from field engagement to CRM opportunity",
        secondaryFeatures: "ROX reporting, territory ROI analysis",
        competitiveAdvantage: "First tool that connects what happened during the visit to whether it became pipeline.",
      },
      {
        painPoint: "Channel partners are invisible in the field",
        objective: "Gain engagement visibility across dealer and partner networks",
        kpi: "Network coverage %, dealer engagement rate",
        primaryFeatures: "Channel Engagement Intelligence across partner network",
        secondaryFeatures: "Unified OEM reporting, content distribution tracking",
        competitiveAdvantage: "OEMs see field engagement from every dealer rep, not just what the dealer chooses to report.",
      },
    ],
  },
]

/* ── Lead Magnets ── */

export const leadMagnets: LeadMagnet[] = [
  {
    title: "The Field Sales Visibility Gap",
    format: "PDF Guide",
    audience: "VP of Sales, Sales Ops Directors, National Sales Managers",
    problem: "Sales leadership has no visibility into what happens during field visits until the rep logs a CRM note days later. The intelligence lost in that gap affects pipeline accuracy and coaching quality.",
    featureHighlighted: "Field Engagement Dashboard, Real-Time CRM Integration",
    delivery: "Gated PDF download via landing page",
    sections: [
      { heading: "The CRM Lag Problem", body: "Field reps visit 8 to 12 customers per week. CRM notes arrive 3 to 5 days later, if at all. By then, the detail is gone and the opportunity context is a summary, not intelligence." },
      { heading: "What Disappears in the Gap", body: "Customer reactions to specific products. Questions that signal buying intent. Persona-level engagement data. Competitive mentions. All of this lives in the rep's memory until it fades." },
      { heading: "The Cost of Invisible Engagement", body: "Inaccurate pipeline forecasts. Coaching based on outcomes instead of behavior. Content investments with no usage data. Lost opportunities that never made it to a CRM record." },
      { heading: "How to Close the Gap", body: "Structured field engagement capture that happens during the visit, not after it. Real-time sync to CRM so leadership sees engagement data the same day." },
    ],
  },
  {
    title: "Field Sales ROX Audit",
    format: "Self-Assessment Tool",
    audience: "VP of Sales, Sales Ops Directors, Regional Sales Managers",
    problem: "No structured way to evaluate how well a field sales team captures and acts on customer intent during field visits",
    featureHighlighted: "ROX Framework, Field Engagement Analytics",
    delivery: "Interactive web-based assessment with PDF report output",
    sections: [
      { heading: "Content Delivery Accuracy", body: "How often do your reps deliver the right content for the right persona? Is content selection persona-driven or rep-driven?" },
      { heading: "Customer Engagement Depth", body: "How much customer behavior data does your team capture during a visit? Are you measuring time with content, questions asked, and persona signals?" },
      { heading: "CRM Sync Speed", body: "How long between a field visit and a CRM entry? What data quality is lost in that window?" },
      { heading: "Opportunity Conversion", body: "Can you attribute pipeline to specific field interactions? Do you know which reps generate the most qualified pipeline per visit?" },
    ],
  },
  {
    title: "ROX Calculator for Field Sales",
    format: "Interactive Web Tool",
    audience: "VP of Sales, Sales Ops, CFO",
    problem: "No way to quantify the value of field engagement intelligence or the cost of invisible field activity",
    featureHighlighted: "ROX Dashboard, Pipeline Attribution",
    delivery: "Ungated interactive tool with optional email gate for detailed report",
    sections: [
      { heading: "Input Your Field Metrics", body: "Enter number of field reps, average visits per week, average deal size, and current pipeline conversion rate." },
      { heading: "Engagement Quality Score", body: "Estimate how much customer engagement data your team captures per visit today. The calculator shows the gap between captured and available intelligence." },
      { heading: "Pipeline Impact Model", body: "See how improved engagement capture translates to pipeline accuracy, faster follow-up, and higher conversion rates." },
      { heading: "ROX Score Output", body: "Receive a composite ROX score across four field dimensions: Content Delivery Accuracy, Customer Engagement Depth, CRM Sync Speed, and Opportunity Conversion." },
    ],
  },
  {
    title: "Field Rep Enablement Quick Start Kit",
    format: "Downloadable Kit",
    audience: "Sales Ops, Field Sales Managers, Training Leads",
    problem: "Field reps are equipped with PDF folders and generic materials that do not match the customer conversation",
    featureHighlighted: "Persona-Based Content Delivery, Device Preloading, Guided Flows",
    delivery: "Gated download with setup guides and templates",
    sections: [
      { heading: "Content Organization by Persona", body: "How to restructure your field materials from product-centric folders to persona-driven content paths that match how customers actually evaluate." },
      { heading: "Device Setup for Field Use", body: "Step-by-step guide for configuring tablets and phones with preloaded content, offline mode, and visit-specific templates." },
      { heading: "Visit Flow Design", body: "Templates for structuring a customer visit: opening, persona identification, content delivery, engagement capture, and next steps." },
      { heading: "Post-Visit Automation", body: "How to set up automated CRM sync, visit summaries, and follow-up triggers based on engagement data." },
    ],
  },
  {
    title: "Competitive Positioning Guide: Momentify vs Sales Enablement Platforms",
    format: "Battle Card PDF",
    audience: "Sales Ops, VP of Sales, Procurement",
    problem: "Confusion between traditional sales enablement platforms (Showpad, Highspot, Seismic) and field engagement intelligence",
    featureHighlighted: "In-Field Engagement Capture, Customer Intent Data",
    delivery: "Internal sales asset, included in proposals and competitive situations",
    sections: [
      { heading: "The Category Distinction", body: "Sales enablement platforms manage and deliver content. Momentify captures how customers engage with that content in real time during field interactions. Both are important. They solve different problems." },
      { heading: "When to Position Momentify", body: "When the problem is invisible field engagement, CRM lag, or no customer intent data from field visits. Not when the problem is content chaos or version control." },
      { heading: "Complementary Positioning", body: "Momentify sits alongside Showpad or Highspot. Showpad manages the content library. Momentify captures what happens when the content meets the customer." },
    ],
  },
]

/* ── LinkedIn Outreach Templates ── */

export const linkedInOutreach: LinkedInOutreach[] = [
  {
    segment: "Heavy Equipment OEMs and Dealers",
    subsegment: "VP of Sales, Sales Ops",
    message: "Your field reps are visiting customer job sites and shop floors every day. The conversations they have drive your pipeline. But most of that intelligence never makes it into your CRM. By the time the rep logs a note, the detail is gone. We help field teams capture customer engagement in real time during the visit, so leadership sees what is happening today, not what the rep remembered to log last Friday.",
  },
  {
    segment: "Energy and Infrastructure",
    subsegment: "Regional Sales Managers",
    message: "In energy, field relationships precede procurement decisions by 18 to 24 months. Every site visit is either building toward a deal or letting one slip away. Most of those interactions live in the rep's memory and a notebook. We help energy field teams capture structured customer engagement data during the visit, not after it. If your reps are covering substations, operations centers, or construction sites, this might be relevant.",
  },
  {
    segment: "Aerospace and Defense",
    subsegment: "BD Directors",
    message: "Defense BD is built on relationships and in-person interactions. Base visits, program office check-ins, and depot tours are where programs are won or lost. But the intelligence from those visits is scattered across call reports, emails, and SharePoint folders. We help defense BD teams capture engagement signals during field interactions, without touching classified or ITAR-restricted data. If your team is in the field regularly, this could be worth a quick conversation.",
  },
  {
    segment: "OEM Channel Teams",
    subsegment: "VP of Channel Sales",
    message: "You invest in content, training, and brand materials for your dealer network. Once it reaches the dealer, visibility ends. You have no idea what your dealer reps are using in the field, how customers respond, or whether the messaging is landing. We help OEMs gain engagement intelligence from every dealer field interaction without requiring dealers to change their CRM. One dashboard across your entire network.",
  },
]

/* ── ENTEVATE Positioning ── */

export const entevatePositioning = {
  headline: "Beyond the Platform: ENTEVATE as Your Field Intelligence Partner",
  subhead: "Momentify is the technology. ENTEVATE is the expertise that makes it work for field sales teams, dealer networks, and channel programs in your industry.",
  expertiseAreas: [
    {
      title: "Field Sales Operations",
      description: "Where 10 to 200 field reps visit customer sites daily and leadership needs visibility without adding process. ENTEVATE configures Momentify for fast adoption and real-time CRM integration.",
    },
    {
      title: "Dealer and Channel Networks",
      description: "Where OEMs need engagement intelligence from dealer reps without requiring changes to the dealer's CRM or process. ENTEVATE designs the deployment model that works for both sides.",
    },
    {
      title: "Industrial and Energy Field Contexts",
      description: "Where customer visits happen on shop floors, job sites, substations, and construction sites. ENTEVATE understands the field environment and configures Momentify for offline capability, fast setup, and rugged use cases.",
    },
    {
      title: "Defense and Regulated Environments",
      description: "Where field BD interactions involve compliance constraints, security requirements, and long program cycles. ENTEVATE ensures Momentify operates above the compliance boundary while still delivering actionable intelligence.",
    },
    {
      title: "Sales Performance Optimization",
      description: "Where leadership wants to understand what top performers do differently and replicate it across the team. ENTEVATE builds the analytics framework that connects field behavior to pipeline outcomes.",
    },
  ],
  capabilities: [
    "Managed services deployment for field teams who need results without IT overhead",
    "Industry-specific configuration for heavy equipment, energy, defense, and manufacturing",
    "Channel deployment model design for OEM-dealer and manufacturer-rep networks",
    "CRM integration with real-time engagement data sync from field interactions",
  ],
  industries: [
    "Heavy Equipment and Construction",
    "Energy and Infrastructure",
    "Aerospace and Defense",
    "Industrial Manufacturing and Distribution",
  ],
  differentiators: [
    "Faster deployment because the team understands your field environment and rep workflow",
    "Smarter configuration because the platform is tuned to how your customers engage during field visits",
    "Better outcomes because the intelligence captured connects directly to pipeline and revenue attribution",
  ],
}
