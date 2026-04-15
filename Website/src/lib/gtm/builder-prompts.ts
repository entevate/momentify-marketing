/* ═══════════════════════════════════════════════════════════════
   GTM Content Builder — Prompt Template Library
   ═══════════════════════════════════════════════════════════════ */

const verticalLabels: Record<string, string> = {
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
  additionalContext?: string
  competitor?: string
}

const solutionPalettes: Record<string, { name: string; primary: string; light: string; dark: string; heroGrad: string; lightBg: string }> = {
  "trade-shows": { name: "Violet", primary: "#6B21D4", light: "#9B5FE8", dark: "#2D0770", heroGrad: "linear-gradient(135deg, #2D0770, #4A0FA8 55%, #9B5FE8)", lightBg: "linear-gradient(145deg, #F8F4FF, #EDE6FF)" },
  recruiting: { name: "Teal", primary: "#00BBA5", light: "#5FD9C2", dark: "#040E28", heroGrad: "linear-gradient(135deg, #040E28, #1A8A76 55%, #5FD9C2)", lightBg: "linear-gradient(145deg, #E8FDF8, #F0FFFC)" },
  "field-sales": { name: "Amber", primary: "#C48A00", light: "#F2B33D", dark: "#1A1000", heroGrad: "linear-gradient(135deg, #1A1000, #8A5E00 55%, #F2B33D)", lightBg: "linear-gradient(145deg, #FFFAEE, #FFF5E0)" },
  facilities: { name: "Indigo", primary: "#3A2073", light: "#5B4499", dark: "#0D0820", heroGrad: "linear-gradient(135deg, #0D0820, #3A2073 55%, #5B4499)", lightBg: "linear-gradient(145deg, #EEF0FF, #F4F5FF)" },
  "events-venues": { name: "Crimson", primary: "#8F200A", light: "#F25E3D", dark: "#1A0400", heroGrad: "linear-gradient(135deg, #1A0400, #8F200A 55%, #F25E3D)", lightBg: "linear-gradient(145deg, #FFF2EE, #FFF7F5)" },
}

export function buildUserMessage(params: BuilderParams): string {
  const { solution, vertical, motion, contentType, additionalContext, competitor } = params
  const vertLabel = verticalLabels[vertical] || vertical
  const motionLabel = motion === "direct" ? "Direct to Customer" : "Channel Partners"
  const icpTitle = verticalICPs[vertical] || "event marketing decision-maker"
  const extra = additionalContext ? `\n\nSPECIFIC CONTEXT (incorporate this into every section of the output): ${additionalContext}` : ""
  const palette = solutionPalettes[solution]

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
