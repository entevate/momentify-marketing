/* ═══════════════════════════════════════════════════════════════
   GTM Asset Prompts — Brand-Compliant Claude Code Prompts
   ═══════════════════════════════════════════════════════════════ */

const BRAND_CONTEXT = `## Momentify Brand System (Mandatory Reference)

### Brand Identity
- **Company:** Momentify — Engagement Intelligence Platform
- **Core Framework:** ROX (Return on Experience) — proprietary scoring across 4 dimensions
- **ROX Dimensions:** Lead Capture Efficiency, Engagement Quality, Follow-Up Speed, Conversion Effectiveness
- **ROX Tiers:** 0-39 Critical Gap (#E5484D), 40-69 Needs Optimization (#F2B33D), 70-84 High ROX (#5FD9C2), 85-100 Elite ROX (#0CF4DF)

### Color System
- **Primary Gradient (Action):** linear-gradient(135deg, #00BBA5, #1A56DB)
- **Text Gradient (Action):** linear-gradient(135deg, #0CF4DF, #254FE5)
- **Cyan Accent:** #0CF4DF
- **Deep Navy:** #061341
- **Dark Background:** #070E2B
- **Light Background:** #F8F9FC

### Solution Vertical Palettes
- **Trade Shows (Violet):** Primary #6B21D4, Light #9B5FE8, BG gradient(135deg, #2D0770, #4A0FA8, #9B5FE8)
- **Recruiting (Teal):** Primary #00BBA5, Light #5FD9C2, BG gradient(135deg, #040E28, #1A8A76, #5FD9C2)
- **Field Sales (Amber):** Primary #C48A00, Light #F2B33D, BG gradient(135deg, #1A1000, #8A5E00, #F2B33D)
- **Facilities (Indigo):** Primary #3A2073, Light #5B4499, BG gradient(135deg, #0D0820, #3A2073, #5B4499)
- **Events & Venues (Crimson):** Primary #8F200A, Light #F25E3D, BG gradient(135deg, #1A0400, #8F200A, #F25E3D)

### Typography
- **Font:** Inter (Google Fonts: 300,400,500,600,700,800)
- **Headlines:** weight 500, letter-spacing -0.02em
- **Subheads:** weight 300
- **Eyebrow text:** 11px, weight 600, uppercase, letter-spacing 0.14em, color #00BBA5
- **Body:** 16px, weight 400, line-height 1.6

### Design Tokens
- **Border Radius:** Cards 12px, Buttons 8px, Badges 100px (pill)
- **Shadow:** 0 1px 3px rgba(6,19,65,0.08)
- **Shadow Hover:** 0 4px 12px rgba(6,19,65,0.12)
- **Spacing Scale:** 4, 8, 12, 16, 20, 24, 32, 48, 60, 80px

### Copy Rules
- No em dashes. Use periods or restructure
- No buzzwords: seamless, powerful, robust, revolutionary, innovative, unlock, game-changing
- Short declarative sentences
- Lead with insight and problem, not product features
- CTAs should be low-friction in early touches`

const BRAND_DIRECTIVE = `IMPORTANT: Use Momentify brand guidelines exclusively. All colors, typography, spacing, and design decisions must reference the brand system below. Do not deviate from the specified palettes, font weights, or design tokens.\n\n`

/** Solution to vertical palette mapping */
const solutionPalette: Record<string, { name: string; primary: string; light: string; gradient: string }> = {
  "trade-shows": { name: "Violet", primary: "#6B21D4", light: "#9B5FE8", gradient: "linear-gradient(135deg, #2D0770 0%, #4A0FA8 55%, #9B5FE8 100%)" },
  recruiting: { name: "Teal", primary: "#00BBA5", light: "#5FD9C2", gradient: "linear-gradient(135deg, #040E28 0%, #1A8A76 55%, #5FD9C2 100%)" },
  "field-sales": { name: "Amber", primary: "#C48A00", light: "#F2B33D", gradient: "linear-gradient(135deg, #1A1000 0%, #8A5E00 55%, #F2B33D 100%)" },
  facilities: { name: "Indigo", primary: "#3A2073", light: "#5B4499", gradient: "linear-gradient(135deg, #0D0820 0%, #3A2073 55%, #5B4499 100%)" },
  "events-venues": { name: "Crimson", primary: "#8F200A", light: "#F25E3D", gradient: "linear-gradient(135deg, #1A0400 0%, #8F200A 55%, #F25E3D 100%)" },
}

export function buildAssetPrompt(contentType: string, solution: string, content: string): string {
  const palette = solutionPalette[solution] || solutionPalette["trade-shows"]

  switch (contentType) {
    case "lead-magnet":
      return `${BRAND_DIRECTIVE}${BRAND_CONTEXT}

## Task
Design a lead magnet PDF layout for Momentify using the ${palette.name} palette (${solution}).

**Solution palette:** Primary ${palette.primary}, Light ${palette.light}, Gradient ${palette.gradient}

**Requirements:**
- Cover page with headline from the brief below, Momentify logo (white reverse), solution gradient background
- Interior pages: clean white backgrounds, section headers in ${palette.primary}, body text in #061341
- Sidebar callouts with ROX dimension highlights on pale tinted background
- Footer with Momentify logo, page numbers, and momentifyapp.com
- Gate form on the last page or as a separate landing page brief
- All typography uses Inter font family
- Print-ready at 8.5x11, exportable as PDF

**Content brief to design from:**

${content}`

    case "partner-pitch":
      return `${BRAND_DIRECTIVE}${BRAND_CONTEXT}

## Task
Design a partner pitch deck (6-8 slides) for Momentify using the ${palette.name} palette (${solution}).

**Solution palette:** Primary ${palette.primary}, Light ${palette.light}, Gradient ${palette.gradient}

**Requirements:**
- Title slide: solution gradient background, white text, Momentify logo
- Problem slide: white background, 3 pain points with icons
- Co-sell model slide: visual showing Partner + Momentify = unified report
- ROX Framework slide: 4 dimensions with tier visualization
- Case reference slide: key proof points (keep customer-agnostic)
- Ask slide: gradient background, CTA for 30-minute briefing
- All typography uses Inter. Headlines weight 500, body weight 400
- 16:9 aspect ratio, presentation-ready

**Content brief to design from:**

${content}`

    case "battle-card":
      return `${BRAND_DIRECTIVE}${BRAND_CONTEXT}

## Task
Design a competitive battle card (single page, front and back) for Momentify sales reps using the ${palette.name} palette (${solution}).

**Solution palette:** Primary ${palette.primary}, Light ${palette.light}, Gradient ${palette.gradient}

**Requirements:**
- Front: Competitor snapshot, "When You Hear Them" scenarios, response language
- Back: Strengths (honest), Our advantages, Killer question, Proof point
- Color coding: competitor info in neutral gray cards, Momentify advantages in ${palette.primary} tinted cards
- ROX advantage callout box with gradient border
- Print-ready at 8.5x11, scannable layout with clear section headers
- All typography uses Inter. Section headers weight 600, body weight 400

**Content brief to design from:**

${content}`

    case "one-pager":
      return `${BRAND_DIRECTIVE}${BRAND_CONTEXT}

## Task
Design a one-pager sales leave-behind for Momentify using the ${palette.name} palette (${solution}).

**Solution palette:** Primary ${palette.primary}, Light ${palette.light}, Gradient ${palette.gradient}

**Requirements:**
- Single page, front only, print-ready at 8.5x11
- Top section: Momentify logo, headline, subhead on white or light background
- Two-column layout: Problem (left) vs Solution (right) with bullet points
- Proof point callout box with ${palette.primary} left border
- ROX Framework section: 4 dimensions in a 2x2 grid with icons
- CTA block at bottom with gradient background and contact placeholder
- All typography uses Inter. Under 400 words total

**Content brief to design from:**

${content}`

    case "cold-emails":
      return `${BRAND_DIRECTIVE}${BRAND_CONTEXT}

## Task
Create email templates for a 3-touch cold outreach sequence for Momentify using the ${palette.name} palette (${solution}).

**Solution palette:** Primary ${palette.primary}, Light ${palette.light}

**Requirements:**
- HTML email templates compatible with HubSpot/Salesforce email builders
- Clean, minimal design. No heavy graphics. Text-forward
- Momentify logo in header, solution accent color for CTA buttons
- CTA buttons: pill shape, background ${palette.primary}, white text
- Mobile-responsive, under 600px width
- Each email under 150 words in the body
- Footer: Momentify | momentifyapp.com | unsubscribe link placeholder

**Content brief to design from:**

${content}`

    case "linkedin-dm":
      return `${BRAND_DIRECTIVE}${BRAND_CONTEXT}

## Task
Format LinkedIn DM sequences as ready-to-use templates for Momentify using the ${palette.name} palette (${solution}).

**Solution palette:** Primary ${palette.primary}, Light ${palette.light}

**Requirements:**
- Create a printable reference card (PDF or HTML) with all 3 DMs
- DM 1: opener with personalization placeholders [COMPANY], [NAME], [RECENT_POST]
- DM 2: resource share with link placeholder
- DM 3: conversion DM with call booking link
- Clean card layout with numbered steps and timing notes
- Include "Personalization Checklist" sidebar

**Content brief to design from:**

${content}`

    case "discovery-script":
      return `${BRAND_DIRECTIVE}${BRAND_CONTEXT}

## Task
Design a discovery call reference card for Momentify sales reps using the ${palette.name} palette (${solution}).

**Solution palette:** Primary ${palette.primary}, Light ${palette.light}

**Requirements:**
- Two-page reference card (or single page, front and back)
- Section 1: Opening script with timing notes
- Section 2: Discovery questions with follow-up probes indented
- Section 3: Transition language to demo
- Section 4: Objection handling table (objection | response)
- Section 5: Soft close with next step options
- Color-coded sections using ${palette.primary} headers
- Print-friendly, scannable format for desk reference

**Content brief to design from:**

${content}`

    case "microsite":
      return `${BRAND_DIRECTIVE}${BRAND_CONTEXT}

## Task
Build a microsite HTML page at Brand/gtm/${solution}-microsite.html using the panelmatic.html reference implementation at Brand/gtm/panelmatic.html.

**Solution palette:** Primary ${palette.primary}, Light ${palette.light}, Gradient ${palette.gradient}

**Requirements:**
- Self-contained HTML with inline CSS. No build tools, no React, no Tailwind
- Follow panelmatic.html structure: Hero, Problem, Approach, Proof, How It Works, CTA + Form
- Use the ${palette.name} palette for all accent colors, gradients, and section backgrounds
- Google Fonts: Inter (300,400,500,600,700,800)
- Shared nav: ../brand-nav.css + ../brand-nav.js with window.BRAND_SKIP_AUTH = true
- Scroll-reveal animations via IntersectionObserver
- Responsive at 768px breakpoint
- Form: client-side only, swap to thank-you on submit

**Content brief to design from:**

${content}`

    default:
      return `${BRAND_DIRECTIVE}${BRAND_CONTEXT}

## Task
Create a branded asset for Momentify using the ${palette.name} palette (${solution}).

**Solution palette:** Primary ${palette.primary}, Light ${palette.light}, Gradient ${palette.gradient}

**Content to work from:**

${content}`
  }
}
