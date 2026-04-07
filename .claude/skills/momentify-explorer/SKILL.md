---
description: Create a new Momentify Explorer prototype for a company. Generates a complete, branded interactive kiosk experience with trait selections, personalized results, and content cards. Outputs a config file, registers the instance, and deploys to the prototypes dashboard.
---

# Momentify Explorer Skill

Create a fully branded, interactive Explorer prototype that matches the exact UX of existing Cat Defense, Momentify, Trade Group, and Freeman prototypes.

## When to Use

Invoke this skill when asked to create a new Explorer prototype, generate a new kiosk experience, or build an Explorer for a specific company.

## Input: Intake Form or Manual

There are two ways to provide inputs:

### Option A: Intake Form (preferred)
The user fills out the intake form at `/brand/explorer-builder`. This saves a JSON file to `.explorer-intake/{slug}/intake.json` along with uploaded logos and content files. To use a saved intake:

1. Read the intake file: `.explorer-intake/{slug}/intake.json`
2. It contains: companyName, industry, websiteUrl, contentFiles (paths), logos (paths), colors, password, screensaver, calculator, quickLinks
3. Read any uploaded content files listed in `contentFiles` to extract content
4. Logos are already saved to `Website/public/brand/assets/`

### Option B: Manual (prompt for missing info)
If no intake exists, prompt the user for the following:

### Required Inputs
1. **Company Name** - Full company name (e.g., "Caterpillar", "Freeman")
2. **Company Logo** - Two logo files: dark background version (reverse/white) and light background version. Also need a square icon version. Ask where logos are located or if they need to be added to `/Website/public/brand/assets/`
3. **Brand Colors** - Primary accent color, secondary color, and any brand palette. If not provided, extract from their website
4. **Industry** - The company's industry vertical (e.g., "Electric Power", "Event Services", "Defense & Aerospace")
5. **Website URL or Existing Docs** - Source for extracting content to generate traits, results cards, and content

### Optional Inputs
6. **Links** - Quick links to show in the explorer (external URLs, product pages, etc.)
7. **Calculators** - An interactive calculator (e.g., ROI calculator, cost estimator) presented in a popup modal overlay. Can be an existing URL loaded in an iframe within the modal, or a custom-built calculator created as part of the prototype. Similar to the PHIL prototype's calculator but displayed in a modal rather than inline
8. **Screensaver** - Optional idle screensaver (video, YouTube, Vimeo, or image). NOT enabled by default. Only add if the user specifically requests it
9. **Password** - Access password for the prototype (default: generate one as `{companyslug}2026`)
10. **Background Style** - Gradient with aurora orbs (default) or custom background image

## Execution Steps

### Step 1: Gather Brand Information

If the user provides a website URL, use WebFetch to:
- Extract the brand color palette (primary, secondary, accent colors)
- Identify the company's products, services, and value propositions
- Understand their target personas/roles
- Catalog content types available (case studies, whitepapers, videos, webinars, etc.)
- Identify industry-specific terminology

If the user provides documents, read them and extract the same information.

**Ask the user to confirm or adjust** the extracted brand colors and content themes before proceeding.

### Step 2: Generate Theme Colors

From the brand's primary and secondary colors, generate a complete theme color system. Follow this exact pattern from the reference implementations:

```typescript
// Required color tokens — derive all of these from the brand palette
const colors = {
  primary: '#BRAND_ACCENT',      // Main accent color (maps to --cyan/--teal in CSS)
  secondary: '#BRAND_SECONDARY', // Secondary accent
  teal: '#...',                  // Teal variant
  blue: '#...',                  // Blue variant
  deepBlue: '#...',              // Deep blue
  navy: '#...',                  // Navy
  midnight: '#...',              // Near-black
  plum: '#...',                  // Warm accent (used in gradients)
  bgDark: '#...',                // Dark mode background base

  // Dark theme
  dark: {
    bg: '...',
    bgGradient: 'linear-gradient(135deg, ... 0%, ... 55%, ... 100%)',
    surface: 'rgba(255,255,255,0.06)',
    surfaceHover: 'rgba(255,255,255,0.10)',
    border: 'rgba(255,255,255,0.12)',
    borderFocus: '#BRAND_ACCENT',
    text1: '#FFFFFF',
    text2: 'rgba(255,255,255,0.75)',
    text3: 'rgba(255,255,255,0.50)',
    inputBg: 'rgba(255,255,255,0.08)',
    inputText: '#FFFFFF',
    inputPlaceholder: 'rgba(255,255,255,0.40)',
    logoText: '#FFFFFF',
    focusRing: 'rgba(ACCENT_R, ACCENT_G, ACCENT_B, 0.15)',
  },

  // Light theme
  light: {
    bg: '#F0F2F8',
    bgGradient: 'linear-gradient(160deg, #ECEEF6 0%, #F0F2F8 40%, #EAECF5 100%)',
    surface: 'rgba(255,255,255,0.55)',
    surfaceHover: 'rgba(255,255,255,0.75)',
    border: 'rgba(6,19,65,0.08)',
    borderFocus: '#BRAND_ACCENT_DARKER',
    text1: '#061341',
    text2: 'rgba(6,19,65,0.60)',
    text3: 'rgba(6,19,65,0.42)',
    inputBg: 'rgba(255,255,255,0.8)',
    inputText: '#061341',
    inputPlaceholder: 'rgba(6,19,65,0.35)',
    logoText: '#061341',
    focusRing: 'rgba(ACCENT_R, ACCENT_G, ACCENT_B, 0.12)',
  },
};
```

**Accessibility requirements:**
- All text must meet WCAG AA contrast (4.5:1 for body, 3:1 for large text)
- accent color on dark bg must be legible
- accent color on light bg must be legible
- CTA button text on CTA gradient must be legible
- Chip/pill colors must be readable

### Step 3: Generate Trait Steps

Create 2-3 trait selection steps based on the company's industry. Follow this pattern:

**Step A: Role Selection** (always first, single-select, auto-advances)
- 6-8 role options relevant to the company's target audience
- Each role gets a Lucide icon name and a role background gradient
- Role names should be industry-specific (not generic)

**Step B: Interests / Challenges / Focus Areas** (multi-select)
- 6-8 options representing what visitors want to explore
- These should map to content categories
- Include a "Just Browsing" or equivalent catch-all

**Optional Step C: Additional trait** (if the company has a distinct product line or use case dimension)

For each trait option:
```typescript
{
  value: 'slug-name',        // kebab-case identifier
  label: 'Display Label',     // Human-readable
  icon: 'lucide-icon-name',   // Valid Lucide icon
  iconType: 'lucide',
}
```

### Step 4: Generate Content Cards

Generate 18+ content cards (6+ per type) from the company's website/docs:

**Outcomes (6+):** Measurable results and business impact
- Each MUST have a `stat` field (e.g., "40%", "3x", "85%")
- Titles should be metric-driven (e.g., "40% Faster Deployment")
- `targetRoles` and `tags` for personalization matching

**Learn (6+):** Educational content across multiple media types
- MUST include variety: video, pdf, blog, webinar, podcast, whitepaper, website
- Set `mediaType` correctly for filtering
- Include real URLs when available, `'#'` as placeholder

**Solutions (6+):** Products, services, or solution offerings
- Map to the company's actual product/service catalog
- Include relevant tags for matching

**Every card MUST have four description depths:**
```typescript
description: {
  small: '...',    // 1 sentence, ~60 chars — for small card view
  medium: '...',   // 2 sentences, ~120 chars — for medium card view
  large: '...',    // 3-4 sentences, ~200 chars — for large card view
  overlay: '...',  // Full paragraph, ~300 chars — for card overlay/detail
}
```

### Step 5: Create the Config File

Write the complete ExplorerConfig to:
```
Website/src/lib/explorer/configs/{slug}.ts
```

Use this exact structure (reference: `Website/src/lib/explorer/defaults.ts`):

```typescript
import type { ExplorerConfig } from '../types';

export const {CONST_NAME}_CONFIG: ExplorerConfig = {
  id: '{slug}',
  name: '{Company} Explorer',
  version: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  branding: { /* ... full branding object ... */ },
  registration: { /* ... */ },
  steps: [ /* splash, registration, trait steps, results, summary, content-library, thank-you */ ],
  content: [ /* all 18+ content cards */ ],
  features: { /* ... */ },
};
```

The steps array MUST follow this exact order:
1. `splash` - Welcome screen
2. `registration` - Form/QR/Search
3. `trait-selection` (role) - Single select
4. `trait-selection` (interests) - Multi select
5. (optional additional trait steps)
6. `results` - Outcomes/Learn/Solutions tabs
7. `summary` - Saved items review + registration reminder
8. `content-library` - Full content browse
9. `thank-you` - End screen

**Registration Reminder:** On the summary/share results step, if the user skipped registration or left required fields incomplete (e.g., no email), display a gentle reminder prompting them to complete their info before sharing. This ensures contact details are captured before results are emailed/texted.

**Optional features in the config:**
- `features.screensaver`: Default `false`. Only set to `true` if user explicitly provides a screensaver asset. When enabled, add a `screensaver` object to the splash step config
- `features.calculator`: Default `false`. Only set to `true` if user provides a calculator URL or requests a custom calculator. Calculator is presented in a popup modal overlay, not inline
- Quick links: Only populate `features.quickLinks` if the user provides specific URLs

### Step 6: Register in the Explorer Route

Add the new config import and entry to `Website/src/app/explorer/[id]/page.tsx`:

```typescript
import { {CONST_NAME}_CONFIG } from '@/lib/explorer/configs/{slug}';

// Add to the CONFIGS map:
const CONFIGS: Record<string, ExplorerConfig> = {
  'momentify-default': MOMENTIFY_DEFAULT_CONFIG,
  '{slug}': {CONST_NAME}_CONFIG,  // <-- add this
};
```

Also add to `generateStaticParams` so it pre-renders.

### Step 7: Register the Instance Card

Add the new instance to `Website/src/app/prototypes/explorer/instances.ts`:

```typescript
{
  slug: '{slug}',
  name: '{Company} Explorer',
  company: '{Company Name}',
  industry: '{Industry}',
  prototypeFile: '/explorer/{slug}',  // Points to the React [id] route
  logo: '/brand/assets/{slug}-icon.{ext}',
  gateLogo: '/brand/assets/{slug}-logo.{ext}',  // Optional, for password gate
  accentColor: '{primary_accent_color}',
  createdAt: '{YYYY-MM-DD}',
  password: '{slug}2026',
  bezel: 'ipad-landscape',
}
```

### Step 8: Asset Checklist

Verify or prompt for:
- [ ] Dark logo at `/Website/public/brand/assets/{slug}-logo-reverse.svg` (or .png)
- [ ] Light logo at `/Website/public/brand/assets/{slug}-logo.svg` (or .png)
- [ ] Square icon at `/Website/public/brand/assets/{slug}-icon.svg` (or .png)
- [ ] Any background images placed in `/Website/public/brand/assets/`

### Step 9: Validate and Preview

After creating all files:
1. Run `cd /Users/jakehamann/Development/Momentify/Website && npx tsc --noEmit` to check for type errors
2. Verify the config matches the `ExplorerConfig` interface in `Website/src/lib/explorer/types.ts`
3. Tell the user how to preview: `npm run dev` then visit `http://localhost:3000/prototypes/explorer`

## Critical Rules (DO NOT VIOLATE)

1. **DO NOT alter the layout or placement of any buttons or UI/UX elements.** The ExplorerShell, TopBar, BottomBar, overlays, and all step components are shared. You are ONLY creating a config file.
2. **DO NOT modify any existing component files** (ExplorerShell.tsx, TopBar.tsx, BottomBar.tsx, ResultsStep.tsx, NotesDialog.tsx, etc.)
3. **DO NOT modify any existing prototype configs** or the Momentify default config
4. **Colors MUST be accessibility compliant** in both dark and light themes
5. **Content descriptions MUST have all four sizes** (small, medium, large, overlay)
6. **Trait options MUST use valid Lucide icon names** (check lucide.dev/icons)
7. **The steps array order is sacred** - splash, registration, trait selections, results, summary, content-library, thank-you
8. **Role backgrounds MUST use the exact radial-gradient pattern** from the Momentify default
9. **Aurora orbs MUST use rgba values with low opacity** (0.10-0.20) derived from brand colors
10. **Do NOT automatically push to git** - only commit/push when asked
11. **Screensaver is OFF by default** - only enable if user explicitly provides a screensaver asset
12. **Calculator is OFF by default** - only enable if user provides a calculator URL or requests a custom-built calculator. Calculator MUST be presented in a popup modal overlay, not embedded inline
13. **Quick Links are empty by default** - only populate if user provides specific URLs
14. **Registration reminder on summary** - if user skipped or has incomplete required fields, prompt them to complete before sharing results

## Reference Files

Read these files to understand the system before generating:
- `Website/src/lib/explorer/types.ts` - Full TypeScript interfaces
- `Website/src/lib/explorer/defaults.ts` - Reference implementation (Momentify)
- `Website/src/lib/explorer/theme.ts` - Theme color system
- `Website/src/components/explorer/ExplorerShell.tsx` - Shell layout
- `Website/src/components/explorer/ExplorerContext.tsx` - State management
- `Website/src/app/prototypes/explorer/instances.ts` - Instance registry

## Output Summary

After completion, provide:
1. **Dashboard URL:** `https://www.momentifyapp.com/prototypes/explorer`
2. **Direct link:** `https://www.momentifyapp.com/prototypes/explorer/{slug}?pw={password}`
3. **Files created/modified:**
   - `Website/src/lib/explorer/configs/{slug}.ts` (NEW - config)
   - `Website/src/app/explorer/[id]/page.tsx` (MODIFIED - added config import + CONFIGS entry)
   - `Website/src/app/prototypes/explorer/instances.ts` (MODIFIED - added instance card)
4. **Assets needed** (list any missing logo/icon files)
5. **Content quality notes** - Flag any traits, cards, or mappings that may need human review
