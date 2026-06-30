---
description: Create a new Momentify Explorer prototype for a company. Generates a complete, branded interactive kiosk experience with trait selections, personalized results, and content cards. Outputs a config file, registers the instance, and deploys to the prototypes dashboard.
---

# Momentify Explorer Skill

Create a fully branded, interactive Explorer prototype that matches the exact UX of existing Cat Defense, Momentify, Trade Group, and Freeman prototypes.

## When to Use

Invoke this skill when asked to create a new Explorer prototype, generate a new kiosk experience, or build an Explorer for a specific company.

---

## Three-Layer Architecture (LOCKED 2026-04-07)

| Layer | What changes | Where it lives |
|-------|-------------|----------------|
| Layout | NEVER (one v1.0.1 exception — see Critical Rules) | `explorer.css` (LOCKED v1.0.1) |
| Brand | Per client | `ExplorerConfig.branding` in config files |
| Content | Per experience | `ExplorerConfig.steps[]` + `content[]` in config files |

### What was done to lock it:

1. **Zero hardcoded brand colors** -- Every `rgba(0,187,165,...)`, `#00BBA5`, `#0CF4DF`, `#E5484D` in explorer.css was replaced with `var(--exp-*)` CSS variables
2. **Auto-derived tint variables** -- `theme.ts` generates opacity variants from config brand colors using `hexToRgba()`:
   - `--exp-teal-10`, `--exp-teal-30`, `--exp-teal-40` (from `branding.colors.teal`)
   - `--exp-cyan-15` (from `branding.colors.primary`)
   - `--exp-card-active-border`, `--exp-card-active-bg`, `--exp-card-selected-border`, `--exp-card-saved-bg`
   - `--exp-alert`, `--exp-alert-border`, `--exp-alert-active`, `--exp-alert-bg`
3. **Version-locked CSS header** -- The CSS file has a prominent header documenting what changes per template (config) vs what never changes (CSS)
4. **Architecture doc** -- `EXPLORER_ARCHITECTURE.md` with complete file map, config property table, and new-template guide

### Layer 1: LAYOUT (explorer.css) -- NEVER EDIT

Fixed dimensions that NEVER change:
- Shell: 1366x1024px, inner 911x683px @ 1.5x scale
- Top bar: 20px 40px padding, 36px button size, 9px border-radius
- Bottom bar: 20px 40px padding, centered progress dots
- Trait header: 135px fixed height (not min-height)
- Trait grid: 4 columns, 14px gap, 110px min-height cards
- Result grid: 3-col (small), 2-col (medium), 1-col (large)
- Cards per page: 6 (small), 2 (medium), 1 (large)
- Card title: max 2 lines (line-clamp), card description: max 2 lines small, unset medium/large
- Card base: border `rgba(255,255,255,0.08)`, bg `rgba(255,255,255,0.04)`, `blur(12px)`, inset shadow `0.05`
- Icon strokes: 1.5 for UI globally, 1.0 for trait/result card icons
- Typography scale: 64/42/28/20/18/17/16/15/14/13/12/11/9/8px
- ALL colors use `var(--exp-*)` CSS variables, ZERO hardcoded brand colors

### Layer 2: BRAND (theme.ts + config) -- Per client

| Intake Field | Config Path | CSS Variable |
|---|---|---|
| Primary color | `branding.colors.primary` | `--exp-cyan` |
| Teal/brand | `branding.colors.teal` | `--exp-teal` + auto `--exp-teal-10/30/40` |
| CTA gradient | `branding.ctaGradient` | `--exp-cta-gradient` |
| CTA text | `branding.ctaTextColor` | `--exp-cta-text` |
| Gradient word | `branding.gradientWord` | `--exp-gradient-word` |
| Font | `branding.font` | `--exp-font` |
| Logo dark/light | `branding.logo.dark/.light` | img src (not CSS) |
| Aurora orbs | `branding.auroraOrbs` | inline styles |
| Role backgrounds | `branding.roleBackgrounds` | inline styles |

### Layer 3: CONTENT (configs/*.ts) -- Per experience

Steps, content cards, registration fields, feature toggles, tab config, trait options.

### Full architecture doc: `Website/src/lib/explorer/EXPLORER_ARCHITECTURE.md`

---

## Input: Intake Form or Manual

There are two ways to provide inputs:

### Option A: Intake Form (preferred)
The user fills out the intake form at `/brand/explorer-builder`. This saves intake data to Vercel Blob storage at `explorer-intake/{slug}/intake.json` along with logos and content files. To use a saved intake:

1. Fetch all intakes via GET `/api/explorer/intake` -- returns `{ intakes: [...] }`
2. Each intake contains: companyName, industry, websiteUrl, contentFiles (blob URLs), logos (blob URLs), colors, password, screensaver, calculator, quickLinks
3. Fetch content files from their blob URLs to extract content (requires `Authorization: Bearer $BLOB_READ_WRITE_TOKEN` header for private blobs)
4. Logo blob URLs can be used to download logos for placement in `Website/public/brand/assets/`

### Option B: Manual (prompt for missing info)
If no intake exists, prompt the user for the following:

### Required Inputs
1. **Company Name** - Full company name (e.g., "Caterpillar", "Freeman")
2. **Company Logo** - Two logo files: dark background version (reverse/white) and light background version. Also need a square icon version. Ask where logos are located or if they need to be added to `/Website/public/brand/assets/`
3. **Brand Colors** - Primary accent color, secondary color, and any brand palette. If not provided, extract from their website
4. **Brand Font** - The brand's primary typeface, written to `branding.font`. If not provided, detect it from their website (see Step 1). Defaults to Inter.
5. **Industry** - The company's industry vertical (e.g., "Electric Power", "Event Services", "Defense & Aerospace")
6. **Website URL or Existing Docs** - Source for extracting content to generate traits, results cards, and content

### Optional Inputs
7. **Links** - Quick links to show in the explorer (external URLs, product pages, etc.)
8. **Calculators** - An interactive calculator (e.g., ROI calculator, cost estimator) presented in a popup modal overlay. Can be an existing URL loaded in an iframe within the modal, or a custom-built calculator created as part of the prototype. Similar to the PHIL prototype's calculator but displayed in a modal rather than inline
9. **Screensaver** - Optional idle screensaver (video, YouTube, Vimeo, or image). NOT enabled by default. Only add if the user specifically requests it
10. **Password** - Access password for the prototype (default: generate one as `{companyslug}2026`)
11. **Background Style** - Gradient with aurora orbs (default) or custom background image

## Execution Steps

### Step 1: Gather Brand Information

If the user provides a website URL, use WebFetch to:
- Extract the brand color palette (primary, secondary, accent colors)
- **Detect the brand's primary typeface** — inspect the homepage for the dominant `font-family` (headings/body), any `fonts.googleapis.com` stylesheet `<link>`s, and `@font-face` declarations. Take the leading family name.
- Identify the company's products, services, and value propositions
- Understand their target personas/roles
- Catalog content types available (case studies, whitepapers, videos, webinars, etc.)
- Identify industry-specific terminology

If the user provides documents, read them and extract the same information.

**Setting `branding.font`:** write the detected typeface as a **bare family name** (e.g. `"Poppins"`, `"Montserrat"`), NOT a full CSS stack — Momentify Web builds the fallback chain and loads the font file itself. Momentify Web only *loads* a curated set of Google families; pick the detected family if it's in the list below, otherwise choose the closest match, otherwise leave it as `Inter` (the default). Any non-loadable family silently falls back to Inter, so don't set an obscure or licensed-only typeface expecting it to render.

Curated loadable families (kept in sync with `fan-gallery/src/lib/fonts.ts` → `CURATED_FONTS`): Inter, Poppins, Montserrat, Roboto, Lato, Open Sans, Work Sans, DM Sans, Plus Jakarta Sans, Source Sans 3, Manrope, Nunito, Raleway, Outfit, Figtree, Sora, Space Grotesk, Playfair Display.

**Ask the user to confirm or adjust** the extracted brand colors, typeface, and content themes before proceeding.

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
  navy: '#...',                  // Dark UI tone derived from brand (drives dialog overlay backdrop)
  midnight: '#...',              // Near-black UI tone derived from brand (drives dialog background)
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

  // Light theme -- aim for clean, white, crisp feel
  light: {
    bg: '#F4F5F9',                            // Light gray, not pure white
    bgGradient: 'linear-gradient(180deg, #F4F5F9 0%, #F2F3F8 100%)',  // Very subtle gradient
    surface: 'rgba(255,255,255,0.85)',         // Mostly white cards
    surfaceHover: 'rgba(255,255,255,0.95)',    // Near-white on hover
    border: 'rgba(15,23,42,0.10)',             // Subtle dark border
    borderFocus: '#BRAND_ACCENT_DARKER',
    text1: '#0F172A',                          // Near-black text
    text2: 'rgba(15,23,42,0.65)',
    text3: 'rgba(15,23,42,0.45)',
    inputBg: '#FFFFFF',                        // Solid white inputs
    inputText: '#0F172A',
    inputPlaceholder: 'rgba(15,23,42,0.35)',
    logoText: '#0F172A',
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
  gateLogo: '/brand/assets/{slug}-logo-reverse.{ext}',  // MUST be reverse/white logo for dark gate bg
  accentColor: '{primary_accent_color}',
  createdAt: '{YYYY-MM-DD}',
  password: '{slug}2026',
}
```

**Important instance rules:**
- **`gateLogo`** MUST be the reverse/white version of the logo (the gate has a dark background). If only a dark-on-light logo exists, create a reverse version with white fills.
- **Do NOT set `bezel: 'ipad-landscape'`** on instances where `prototypeFile` points to a React route (`/explorer/{slug}`). The React route already renders its own `ExplorerBezelWrapper` -- adding `bezel` causes a double bezel. Only set `bezel` for instances pointing to static HTML files (`/brand/...html`).
- The layout at `[slug]/layout.tsx` automatically generates `<title>` and OG metadata from the instance data (name, company, industry, accent color). No extra work needed.
- A dynamic OG preview image is generated at `/api/prototypes/og?slug={slug}` showing the logo, name, industry, and accent-colored orbs.

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

1. **DO NOT edit `explorer.css` for ANY reason.** It is LOCKED v1.0.1 (was v1.0.0 2026-04-07; bumped 2026-05-14 for Phase 8.10h universal search-mode top anchor — additive `:has(.exp-search-view)` rule mirrored into the fan-gallery runtime). All layout, positioning, sizing, typography, animations, and glassmorphic effects are final. All brand colors are CSS variables generated by theme.ts from the config. There is nothing in this file that needs to change for a new template. The Phase 8.10h patch was a universal UX fix (iPad keyboard overlap on database-search mode), NOT a per-template change.
2. **DO NOT alter the layout or placement of any buttons or UI/UX elements.** The ExplorerShell, TopBar, BottomBar, overlays, and all step components are shared. You are ONLY creating a config file.
3. **DO NOT modify any existing component files** (ExplorerShell.tsx, TopBar.tsx, BottomBar.tsx, ResultsStep.tsx, NotesDialog.tsx, etc.)
4. **DO NOT modify any existing prototype configs** or the Momentify default config
4. **Colors MUST be accessibility compliant** in both dark and light themes
5. **Content descriptions MUST have all four sizes** (small, medium, large, overlay)
6. **Trait options MUST use valid Lucide icon names** (check lucide.dev/icons)
7. **The steps array order is sacred** - splash, registration, trait selections, results, summary, content-library, thank-you
8. **Role backgrounds MUST use the exact radial-gradient pattern** from the Momentify default. Keep opacity subtle (0.08-0.20 range). In light mode, ExplorerShell reduces role bg opacity to 0.45 automatically.
9. **Aurora orbs MUST use rgba values with low opacity** (0.10-0.20) derived from brand colors. In light mode, ExplorerShell reduces orb opacity to 0.5 automatically.
10. **Do NOT automatically push to git** - only commit/push when asked
11. **Screensaver is OFF by default** - only enable if user explicitly provides a screensaver asset
12. **Calculator is OFF by default** - only enable if user provides a calculator URL or requests a custom-built calculator. Calculator MUST be presented in a popup modal overlay, not embedded inline
13. **Quick Links are empty by default** - only populate if user provides specific URLs
14. **Registration reminder on summary** - if user skipped or has incomplete required fields, prompt them to complete before sharing results
15. **Next button is disabled on trait-selection steps** until at least one selection is made (single-select: role selected; multi-select: at least one interest). This is built into BottomBar.tsx and requires no config.
16. **Gate logo must be the reverse/white version** -- the password gate has a dark background. Never use a dark-on-light logo for `gateLogo`.
17. **Do NOT set `bezel` on React-route instances** -- React explorer routes (`/explorer/{slug}`) already render their own `ExplorerBezelWrapper`. Setting `bezel: 'ipad-landscape'` on the instance causes a double bezel. Only use `bezel` for static HTML prototypes.
18. **Light/dark mode theming is handled by ExplorerShell.tsx via a `<style>` block** that overrides locked CSS hardcoded dark-mode values using theme-aware CSS variables from `theme.ts`:
    - **Cards** (`exp-result-card`, `exp-trait-card`): `--exp-card-bg` (dark: `rgba(255,255,255,0.04)`, light: `rgba(255,255,255,0.65)`), `--exp-card-border`, `--exp-card-shadow`
    - **Selected trait cards**: `--exp-selected-bg`, `--exp-selected-border` (light: full-opacity accent border for clear contrast)
    - **Dialogs & card overlays**: `--exp-dialog-bg` (dark: derived from `branding.colors.midnight` at 0.92 opacity, light: solid `#FFFFFF`), `--exp-dialog-border`, `--exp-dialog-shadow`. `midnight` and `navy` are dark UI tones you derive from the brand palette (not client-provided colors) -- theme.ts uses `hexToRgba()` on them to generate dialog/overlay backgrounds per brand.
    - **Overlay backdrops**: `--exp-dialog-overlay-bg` (dark: derived from `branding.colors.navy` at 0.60, light: same navy at 0.18).
    - **Summary chips**: same as card bg/border
    - **Separator lines removed**: `exp-results-tab-bar` border-top set to none
    - **Overflow hidden** on `exp-center` to prevent cards bleeding into bottom bar
    - **BottomBar alignment**: constrained to `max-width: 860px; margin: auto; padding: 20px 24px` so buttons align with card edges across all steps
    - **Results tab bar**: `padding: 20px 0` to match button alignment with BottomBar
    - **Results header**: `.exp-results-view .exp-trait-header` uses `height: auto; min-height: 100px` to accommodate chips without overflow
    - **Small card grid**: `.exp-view-small .exp-paginated-wrapper` uses flex column layout, `.exp-card-grid` uses `flex: 1; min-height: 0; grid-template-rows: 1fr 1fr` to fill vertical space
    - **CardOverlay media preview**: uses `var(--exp-card-bg)` and `var(--exp-card-border)` instead of hardcoded rgba values
19. **No separator lines** -- The results tab bar separator and any other divider lines have been removed. Do not add `border-top`, `border-bottom`, or `<hr>` elements to any explorer components.
20. **Light mode must feel clean, white, and crisp** -- Unselected cards should be translucent white (0.65), selected cards must have clear accent-colored border contrast. Card overlays and dialogs must be solid white. Avoid heavy gradients or strong orb colors in light mode.
21. **Form factor is a top-level config field.** Add `formFactor: "mobile"` to the `ExplorerConfig` for phone experiences; default is `"tablet"`.
    - Tablet layout: `explorer.css` (LOCKED v1.0.1), 1366x1024 landscape, iPad Pro 12.9" bezel.
    - Mobile layout: `explorer-mobile.css` (LOCKED v1.0.0-mobile), 430x932 portrait, iPhone 14 Pro Max bezel.
    - **Do NOT edit `explorer-mobile.css` for new templates** — same lock rule as the tablet CSS. All mobile rules are scoped under `.explorer-shell[data-form="mobile"]`.
    - Mobile UX is thumb-first, not just a shrink: bottom-sheet dialogs, fullscreen card overlay, sticky trait headers, hidden view toggle (always medium cards), hidden progress dots, horizontal-scroll tabs, 44pt minimum touch targets, `env(safe-area-inset-*)` respected.
    - Content (`steps[]`, `content[]`) works unchanged across tablet and mobile — only pick `formFactor` based on the deployment surface (kiosk = tablet, QR microsite = mobile).
    - For instances in `instances.ts`: use `bezel: "iphone-portrait"` for mobile static HTML prototypes; for React-route mobile instances set `formFactor: "mobile"` on both the instance (informational, drives dashboard badge) and the `ExplorerConfig` (actually drives layout).

## Reference Files

Read these files to understand the system before generating:
- `Website/src/lib/explorer/types.ts` - Full TypeScript interfaces
- `Website/src/lib/explorer/defaults.ts` - Reference implementation (Momentify)
- `Website/src/lib/explorer/configs/clarium.ts` - Reference config (Clarium Health)
- `Website/src/lib/explorer/configs/maven-fp.ts` - Reference config (Maven Financial Partners)
- `Website/src/lib/explorer/theme.ts` - Theme color system
- `Website/src/components/explorer/ExplorerShell.tsx` - Shell layout
- `Website/src/components/explorer/ExplorerContext.tsx` - State management
- `Website/src/components/explorer/BottomBar.tsx` - Navigation bar (skip/next/done logic, trait selection gating)
- `Website/src/app/prototypes/explorer/instances.ts` - Instance registry
- `Website/src/app/prototypes/explorer/[slug]/layout.tsx` - Per-prototype metadata (title, OG image)
- `Website/src/app/api/prototypes/og/route.tsx` - Dynamic OG image generator

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
