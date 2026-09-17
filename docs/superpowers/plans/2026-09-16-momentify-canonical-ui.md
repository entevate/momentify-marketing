# Momentify Canonical UI + Background Image Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle Momentify's GTM engine to the fleet's canonical look in Momentify's own design tokens, rebuild the content builder as a single-column flow, and add a background-image + opacity control to social-post rendering — without changing routing, auth, or any existing behavior.

**Architecture:** One theme file (`gtm-theme.css`) becomes the canonical token + class layer and restyles ~80% of pages. The sidebar keeps its structure and gets chrome-only edits. `renderTemplate` gains two reserved keys (`BG_IMAGE`, `BG_OPACITY`) that every social-post template consumes through a `.stage .bg` layer; `fill-template` / `fill-carousel` accept the image as a data URI plus an optional `slots` override that skips Claude. A new `ContentBuilderCanonical.tsx` re-lays the existing handlers into the canonical column and passes media down to `AssetPanel`, which owns template fill, slot editing, and re-render.

**Tech Stack:** Next.js App Router (Node runtime), React 18, inline styles + CSS custom properties, Jest 29 (`next/jest`), `@vercel/blob`, puppeteer-core via `renderHtmlToPng`.

**Spec:** `docs/superpowers/specs/2026-09-16-momentify-canonical-ui-design.md` — read it first. All work happens in the worktree `~/Development/Momentify/.claude/worktrees/momentify-canonical-ui/` on branch `claude/momentify-canonical-ui`. **Every path below is relative to that worktree's `Website/` directory** unless it starts with `docs/`.

**Known-red baseline:** `src/app/api/gtm/__tests__/generate-asset-html.test.ts` fails on untouched `main` (cookie auth outside a request scope). It is *not* fixed here. The test command used throughout excludes it:

```bash
npx jest --ci --silent --testPathIgnorePatterns '/node_modules/' 'generate-asset-html'
```

(Do **not** add a `/.claude/` ignore: this worktree's own path contains `/.claude/`, so that pattern silently excludes every test. Momentify's app is in `Website/`, which is Jest's rootDir, so nested worktrees at the repo root are never scanned anyway.)

**Verification gate for every commit:** `npx tsc --noEmit` exits 0 **and** the command above is green. This Mac stalls on `next dev`; do not start a dev server. Visual verification happens on a Vercel preview deploy in Task 9.

---

## File structure

| File | Responsibility | Action |
|---|---|---|
| `src/styles/gtm-theme.css` | canonical tokens + shared classes (light only) | Rewrite |
| `src/app/gtm/layout.tsx` | GTM shell + sidebar | Modify: chrome only |
| `src/lib/gtm/templates/render.ts` | pure template substitution | Modify: `media` param, reserved keys |
| `src/lib/gtm/templates/__tests__/render.test.ts` | render unit tests | Create |
| `src/lib/gtm/templates/social-post/*/template.html` (15) | social-post templates | Modify via script: `.bg` hook |
| `scripts/add-bg-hook.mjs` | one-shot template patcher | Create |
| `scripts/render-parity.ts` | one-shot PNG parity check | Create |
| `src/lib/gtm/render-media.ts` | shared request validation for `bgImage` / `bgOpacity` / `slots` | Create |
| `src/lib/gtm/__tests__/render-media.test.ts` | validation unit tests | Create |
| `src/app/api/gtm/fill-template/route.ts` | social-post fill | Modify: media + slots override |
| `src/app/api/gtm/fill-carousel/route.ts` | carousel fill | Modify: media + cards override |
| `src/app/api/gtm/__tests__/fill-template.test.ts` | route tests (mocked) | Create |
| `src/components/gtm/AssetPanel.tsx` | template pick / fill / preview | Modify: `media` prop, slot editor, re-render |
| `src/components/gtm/tabs/ContentBuilderCanonical.tsx` | new single-column builder | Create |
| `src/components/gtm/tabs/SolutionTabs.tsx` | mounts the builder | Modify: import swap |
| `src/components/gtm/tabs/ContentBuilder.tsx` | old builder | Delete in Task 9 |
| `src/components/gtm/QrLibrary.tsx`, `PagesView.tsx`, `LinkInBioBuilder.tsx`, `src/app/gtm/login/page.tsx` | hardcoded-color outliers | Modify: token swaps |

---

### Task 1: Theme — canonical tokens + shared classes

**Files:**
- Modify: `jest.config.js`
- Rewrite: `src/styles/gtm-theme.css`

- [x] **Step 1: No Jest config change.** (An earlier draft added `testPathIgnorePatterns: ['/node_modules/', '/.claude/']`; that was implemented and then reverted in a follow-up commit because a bare `/.claude/` pattern matches this worktree's own path and hides every test. Leave `jest.config.js` untouched.)

> **Amended after code-quality review (2026-09-16).** The block below is the original spec; the committed file is that block plus these deltas, applied in a follow-up commit so later tasks inherit them:
> - `--gtm-accent-ink` (per solution; ≥ 4.5:1 on white — default `#067A69`, violet `#6B21D4`, recruiting `#067A69`, amber `#8F6300`, indigo `#3A2073`, crimson `#B8340F`) — `.eyebrow` and `.btn-tertiary` use it instead of the raw accent.
> - `--gtm-accent-deep-blue: #1F3395` (form labels), `--gtm-danger-text: #b91c1c`, `--gtm-bg-input: var(--gtm-bg-card)` — no hex literals remain in the class layer.
> - `--gtm-grad-action` moved under a "fleet-constant, deliberately NOT overridden per solution" comment.
> - `.input`: no `outline: none`; `:focus-visible` gets a 2px `--gtm-accent-ink` outline. `.btn` / `.chip` get the same `:focus-visible` ring; `.btn:hover { opacity: .9 }`; `.btn[aria-disabled="true"]` dims like `:disabled`; the no-op `background` transition is gone.
> - `.mono` adds `font-variant-numeric: tabular-nums`; `--gtm-font-mono` falls back to sans-serif (Space Grotesk is proportional), not monospace.
> - All shared classes are scoped `[data-theme="light"]` (not bare `[data-theme]`).
> - The gate gains a referenced-vs-defined token check (must print nothing): `comm -23 <(grep -rhoE 'var\(--gtm-[a-z0-9-]+' src | sed 's/var(//' | sort -u) <(grep -oE '^\s*--gtm-[a-z0-9-]+' src/styles/gtm-theme.css | tr -d ' ' | sort -u)`

- [x] **Step 2: Rewrite `src/styles/gtm-theme.css`** with exactly this content (the five light solution schemes are kept verbatim; the dark block and its five dark overrides are gone; new tokens and shared classes added):

```css
/* GTM Framework — Theme Variables + shared classes
   Canonical fleet visual language (STRUCTURE.md §1) expressed in Momentify's
   design-tokens.json values. Light only: the layout pins data-theme="light".
   Never use hardcoded hex values in GTM components — use these variables. */

:root,
[data-theme="light"] {
  /* surfaces */
  --gtm-bg-page:        #F4F5FA;                 /* light-mode.bg */
  --gtm-bg-card:        #FFFFFF;                 /* light-mode.surface */
  --gtm-surface-2:      #ECEEF6;                 /* light-mode.surface-2: chips, wells */
  --gtm-border:         rgba(11, 11, 60, 0.10);  /* hairline */
  --gtm-border-strong:  rgba(11, 11, 60, 0.18);  /* form-control edge */

  /* type */
  --gtm-text-primary:   #061341;                 /* deep-navy */
  --gtm-text-secondary: #555555;                 /* gray-body */
  --gtm-text-muted:     rgba(11, 11, 60, 0.50);
  --gtm-text-faint:     rgba(6, 19, 65, 0.35);
  --gtm-font-body:      var(--font-inter), system-ui, sans-serif;
  --gtm-font-mono:      var(--font-space-grotesk), ui-monospace, Menlo, monospace;

  /* accent (default; overridden per solution below) */
  --gtm-accent:         #00BBA5;                 /* teal: interactive / on-light */
  --gtm-accent-light:   #5FD9C2;
  --gtm-accent-text:    #0AA891;
  --gtm-accent-on-dark: #0CF4DF;                 /* cyan: reserved for dark surfaces */
  --gtm-accent-bg:      rgba(0, 187, 165, 0.10);
  --gtm-accent-grad:    linear-gradient(135deg, #00BBA5 0%, #254FE5 100%);
  --gtm-grad-action:    linear-gradient(135deg, #00BBA5 0%, #254FE5 100%);
  --gtm-cyan:           #0CF4DF;
  --gtm-tag-bg:         rgba(12, 244, 223, 0.10);
  --gtm-tag-text:       #0AA891;
  --gtm-layer-bg:       #FFFFFF;
  --gtm-layer-hover:    #F0F9FF;
  --gtm-danger:         #E5484D;
  --gtm-danger-bg:      rgba(229, 72, 77, 0.08);
  --gtm-danger-border:  rgba(229, 72, 77, 0.30);

  /* shape */
  --gtm-radius-card:    12px;                    /* radius.xl */
  --gtm-radius-control: 8px;                     /* radius.lg */
  --gtm-shadow:         0 4px 12px rgba(0, 0, 0, 0.06);         /* elevation.2 */
  --gtm-shadow-hover:   0 10px 15px -3px rgba(0, 0, 0, 0.10);   /* elevation.3 */
}

/* ═══ Solution Color Schemes ═══
   Each solution page sets data-solution on its wrapper.
   data-theme is on the layout parent, so use descendant selectors. */

/* Trade Shows — Violet */
[data-theme="light"] [data-solution="trade-shows"] {
  --gtm-accent:       #6B21D4;
  --gtm-accent-light: #9B5FE8;
  --gtm-accent-grad:  linear-gradient(135deg, #6B21D4, #9B5FE8);
  --gtm-accent-bg:    rgba(107, 33, 212, 0.08);
  --gtm-accent-text:  #6B21D4;
  --gtm-layer-hover:  rgba(107, 33, 212, 0.04);
}

/* Tech Recruiting — Teal */
[data-theme="light"] [data-solution="recruiting"] {
  --gtm-accent:       #0AA891;
  --gtm-accent-light: #5FD9C2;
  --gtm-accent-grad:  linear-gradient(135deg, #0AA891, #5FD9C2);
  --gtm-accent-bg:    rgba(10, 168, 145, 0.08);
  --gtm-accent-text:  #0AA891;
  --gtm-layer-hover:  rgba(10, 168, 145, 0.04);
}

/* Field Sales — Amber */
[data-theme="light"] [data-solution="field-sales"] {
  --gtm-accent:       #D4940A;
  --gtm-accent-light: #F2B33D;
  --gtm-accent-grad:  linear-gradient(135deg, #D4940A, #F2B33D);
  --gtm-accent-bg:    rgba(242, 179, 61, 0.10);
  --gtm-accent-text:  #D4940A;
  --gtm-layer-hover:  rgba(242, 179, 61, 0.04);
}

/* Facilities — Indigo */
[data-theme="light"] [data-solution="facilities"] {
  --gtm-accent:       #3A2073;
  --gtm-accent-light: #5B3DAA;
  --gtm-accent-grad:  linear-gradient(135deg, #3A2073, #5B3DAA);
  --gtm-accent-bg:    rgba(58, 32, 115, 0.08);
  --gtm-accent-text:  #3A2073;
  --gtm-layer-hover:  rgba(58, 32, 115, 0.04);
}

/* Events & Venues — Crimson */
[data-theme="light"] [data-solution="events-venues"] {
  --gtm-accent:       #D43D1A;
  --gtm-accent-light: #F25E3D;
  --gtm-accent-grad:  linear-gradient(135deg, #D43D1A, #F25E3D);
  --gtm-accent-bg:    rgba(242, 94, 61, 0.08);
  --gtm-accent-text:  #D43D1A;
  --gtm-layer-hover:  rgba(242, 94, 61, 0.04);
}

/* ═══ Shared classes (canonical vocabulary) ═══ */

[data-theme] .card {
  background: var(--gtm-bg-card);
  border: 1px solid var(--gtm-border);
  border-radius: var(--gtm-radius-card);
  padding: 20px 22px;
  box-shadow: var(--gtm-shadow);
}

[data-theme] .eyebrow {
  font-family: var(--gtm-font-mono);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--gtm-accent);
}

[data-theme] .section-note {
  font-size: 12.5px;
  line-height: 1.5;
  color: var(--gtm-text-secondary);
}

[data-theme] .mono {
  font-family: var(--gtm-font-mono);
}

[data-theme] .field-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #1F3395;
  margin-bottom: 5px;
}

[data-theme] .input {
  width: 100%;
  box-sizing: border-box;
  font-family: var(--gtm-font-body);
  font-size: 14px;
  color: var(--gtm-text-primary);
  background: #FFFFFF;
  border: 1px solid var(--gtm-border-strong);
  border-radius: var(--gtm-radius-control);
  padding: 9px 12px;
  outline: none;
}
[data-theme] .input:focus {
  border-color: var(--gtm-accent);
  box-shadow: 0 0 0 3px var(--gtm-accent-bg);
}
/* iOS zooms any input under 16px on focus (fleet MOBILE INPUT ZOOM GUARD). */
@media (max-width: 767px) {
  [data-theme] .input { font-size: 16px; }
}

[data-theme] .btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 38px;
  padding: 0 18px;
  border-radius: 9999px;
  font-family: var(--gtm-font-body);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  border: 1.5px solid transparent;
  transition: opacity 150ms ease, background 150ms ease;
  white-space: nowrap;
}
[data-theme] .btn:disabled { opacity: 0.55; cursor: not-allowed; }
[data-theme] .btn-primary { background: var(--gtm-grad-action); color: #FFFFFF; }
[data-theme] .btn-secondary { background: #FFFFFF; color: var(--gtm-text-primary); border-color: var(--gtm-border-strong); }
[data-theme] .btn-tertiary { background: transparent; color: var(--gtm-accent-text); padding: 0 8px; }
[data-theme] .btn-danger { background: var(--gtm-danger-bg); color: #b91c1c; border-color: var(--gtm-danger-border); }
[data-theme] .btn-sm { height: 30px; padding: 0 12px; font-size: 12px; }

[data-theme] .chip {
  display: inline-flex;
  align-items: center;
  border: 1.5px solid var(--gtm-border);
  border-radius: 9999px;
  padding: 5px 12px;
  font-family: var(--gtm-font-body);
  font-size: 12.5px;
  font-weight: 500;
  color: var(--gtm-text-secondary);
  background: #FFFFFF;
  cursor: pointer;
  white-space: nowrap;
}
[data-theme] .chip.on {
  background: var(--gtm-surface-2);
  border-color: var(--gtm-surface-2);
  color: var(--gtm-text-primary);
  font-weight: 600;
}

[data-theme] .error-note {
  background: var(--gtm-danger-bg);
  border: 1px solid var(--gtm-danger-border);
  border-radius: var(--gtm-radius-control);
  padding: 12px;
  font-size: 13px;
  color: #b91c1c;
}
```

- [x] **Step 3: Verify** *(done — commits `2d2f9c5c`, `de6f2ccd`, `0ba020ae`; spec + quality reviews approved)*

Run: `npx tsc --noEmit && npx jest --ci --silent --testPathIgnorePatterns '/node_modules/' 'generate-asset-html'`
Expected: tsc exits 0; Jest prints `Tests: 12 passed, 12 total` (the one remaining suite).

Run: `grep -c 'data-theme="dark"' src/styles/gtm-theme.css`
Expected: `0`

- [x] **Step 4: Commit**

```bash
git add jest.config.js src/styles/gtm-theme.css
git commit -m "Theme: canonical tokens + shared classes in Momentify design-token values

Rewrites gtm-theme.css as the fleet's canonical visual layer using
design-tokens.json values (light-mode surfaces, radius.xl cards,
elevation.2, Space Grotesk teal eyebrows). Adds the shared .card/.eyebrow/
.btn-*/.chip/.input vocabulary, declares the previously-missing
--gtm-text-secondary, and deletes the dead dark theme block.

Also ignores nested .claude worktrees in Jest (fleet gotcha).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 2: Sidebar chrome (structure untouched)

**Files:**
- Modify: `src/app/gtm/layout.tsx`

- [ ] **Step 1: Widths** — replace lines 113–114:

```ts
const EXPANDED_WIDTH = 240
const STRIP_WIDTH = 72
```
with
```ts
const EXPANDED_WIDTH = 232
const STRIP_WIDTH = 64
```

- [ ] **Step 2: Nav entry rows** — in `NavLinkRow`, replace the `style={{ ... }}` object on the `<Link>` (lines 142–159) with:

```ts
      style={{
        display: "flex",
        alignItems: "center",
        gap: 9,
        height: 38,
        margin: collapsed ? "0 auto 2px" : "0 10px 1px",
        width: collapsed ? 36 : "auto",
        padding: collapsed ? "0" : "0 10px 0 20px",
        justifyContent: collapsed ? "center" : "flex-start",
        textDecoration: "none",
        fontSize: 14,
        fontWeight: active ? 600 : 400,
        fontFamily: font,
        color: active ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.72)",
        background: active ? "rgba(255, 255, 255, 0.06)" : "transparent",
        borderRadius: 8,
        transition: "all 150ms ease",
        whiteSpace: "nowrap",
        overflow: "hidden",
      }}
```
(The `borderLeft` accent bar is removed — canonical active state is the tinted pill. The icon keeps `item.color` as its color so per-solution dots survive:) replace line 173
```tsx
      <Icon size={16} style={{ opacity: active ? 1 : 0.45, flexShrink: 0 }} />
```
with
```tsx
      <Icon size={16} style={{ opacity: active ? 1 : 0.55, flexShrink: 0, color: active ? item.color : undefined }} />
```

- [ ] **Step 3: Section labels → eyebrow treatment** — replace the section `<button>` style object (lines 316–332) with:

```ts
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "calc(100% - 20px)",
                    margin: "14px 10px 4px",
                    textAlign: "left",
                    padding: "6px 10px",
                    fontSize: 11,
                    fontWeight: 500,
                    color: "rgba(255, 255, 255, 0.55)",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    fontFamily: "var(--gtm-font-mono)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
```
and swap the button's children (lines 334–335) so the chevron sits on the right:
```tsx
                  {section.label}
                  <FoldChevron open={!isFolded} />
```

- [ ] **Step 4: Logo block + dividers** — replace line 291's padding values: `"28px 0 20px"` → `"22px 0 18px"` and `"28px 24px 20px"` → `"22px 20px 18px"`. Replace every `margin: "0 16px"` on the three divider `<div style={{ height: 1 ...}}>` lines (302, 350) with `margin: "0 14px"`, and line 311's `margin: "8px 16px"` with `margin: "10px 14px"`.

- [ ] **Step 5: Footer contract sizing** — in the collapse toggle button style (lines 391–402) change `width: 28, height: 28` → `width: 28, height: 24`, `background: "rgba(255, 255, 255, 0.04)"` → `background: "transparent"`, `border: "1px solid rgba(255, 255, 255, 0.10)"` → `border: "1px solid rgba(255, 255, 255, 0.14)"`. In the Sign Out button style (lines 366–378) change `color: "rgba(255, 255, 255, 0.40)"` → `color: "rgba(255, 255, 255, 0.70)"` and the two hover handlers (379–380) to `"rgba(255, 255, 255, 1)"` / `"rgba(255, 255, 255, 0.70)"`.

- [x] **Step 6: Verify + commit** *(done — commit `552e50b4`; combined spec + quality review approved. Polish for a later chrome sweep, not regressions: `onMouseLeave` at `layout.tsx:170` resets inactive rows to `0.70` while the resting color is `0.72`; `transition: "all"` now also animates the pill's width/margin on collapse — narrow to `background, color` if the shimmer shows.)*

Run the verification gate. Expected: tsc 0, Jest green.

```bash
git add src/app/gtm/layout.tsx
git commit -m "Sidebar: canonical chrome (232/64 widths, eyebrow labels, pill active state)

Structure, routing, folds, strip collapse, footer contract and the mobile
drawer are unchanged; only widths, typography, indents and the active
treatment move to the fleet's canonical values.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 3: `renderTemplate` media support (TDD)

**Files:**
- Create: `src/lib/gtm/templates/__tests__/render.test.ts`
- Modify: `src/lib/gtm/templates/render.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { renderTemplate } from "../render"
import type { Palette } from "@/lib/gtm/pillar-palettes"

const palette: Palette = {
  primary: "#111111",
  light: "#222222",
  dark: "#000000",
  heroGrad: "linear-gradient(#111,#000)",
  lightBg: "#fafafa",
  decorPattern: "none",
  decorSize: "auto",
} as Palette

const html = `<style>:root{--bg-image:{{BG_IMAGE}};--bg-opacity:{{BG_OPACITY}};--primary:{{PRIMARY}}}</style><h1>{{HEADLINE}}</h1>`

describe("renderTemplate media", () => {
  it("defaults BG_IMAGE to none and BG_OPACITY to 1 when no media is given", () => {
    const out = renderTemplate(html, { HEADLINE: "Hi" }, palette)
    expect(out).toContain("--bg-image:none;")
    expect(out).toContain("--bg-opacity:1;")
    expect(out).toContain("<h1>Hi</h1>")
  })

  it("substitutes a data URI wrapped in url() and a clamped opacity", () => {
    const out = renderTemplate(html, {}, palette, {
      bgImage: "data:image/png;base64,AAAA",
      bgOpacity: 62,
    })
    expect(out).toContain('--bg-image:url("data:image/png;base64,AAAA");')
    expect(out).toContain("--bg-opacity:0.62;")
  })

  it("clamps opacity into [0,1] and strips quotes/backslashes from the URI", () => {
    expect(renderTemplate(html, {}, palette, { bgOpacity: 500 })).toContain("--bg-opacity:1;")
    expect(renderTemplate(html, {}, palette, { bgOpacity: -5 })).toContain("--bg-opacity:0;")
    expect(renderTemplate(html, {}, palette, { bgImage: 'data:image/png;base64,A"B\\C' })).toContain(
      '--bg-image:url("data:image/png;base64,ABC");'
    )
  })

  it("reserved media keys win over caller slots", () => {
    const out = renderTemplate(html, { BG_IMAGE: "evil", BG_OPACITY: "9" }, palette)
    expect(out).toContain("--bg-image:none;")
    expect(out).toContain("--bg-opacity:1;")
  })
})
```

- [ ] **Step 2: Run it — expect failure**

Run: `npx jest --ci src/lib/gtm/templates/__tests__/render.test.ts`
Expected: FAIL — `--bg-image:none;` not found (the keys currently resolve to empty strings) and TS error `Expected 3 arguments, but got 4`.

- [ ] **Step 3: Implement** — replace the `renderTemplate` function in `src/lib/gtm/templates/render.ts` (lines 18–44) with:

```ts
/** Optional background photo for social-post renders. `bgOpacity` is 0–100. */
export type RenderMedia = { bgImage?: string; bgOpacity?: number }

/** Reserved keys: BG_IMAGE → `url("…")` or `none`; BG_OPACITY → 0–1. */
export function mediaMap(media?: RenderMedia): Record<string, string> {
  const uri = (media?.bgImage ?? "").replace(/["\\]/g, "").trim()
  const raw = Number(media?.bgOpacity)
  const pct = Number.isFinite(raw) ? Math.min(100, Math.max(0, raw)) : 100
  return {
    BG_IMAGE: uri ? `url("${uri}")` : "none",
    BG_OPACITY: String(Math.round(pct) / 100),
  }
}

/**
 * Replace `{{KEY}}` placeholders in `html` with values from `slots`, then
 * inject palette CSS variables via an additional replacement pass on the
 * reserved palette keys: PRIMARY, PRIMARY_LIGHT, PRIMARY_DARK, HERO_GRAD,
 * LIGHT_BG, DECOR_PATTERN, DECOR_SIZE, plus the media keys BG_IMAGE and
 * BG_OPACITY. Reserved keys always win over `slots`. Missing keys resolve to
 * empty strings (so an unfilled slot degrades gracefully, rather than
 * showing the literal `{{KEY}}`).
 */
export function renderTemplate(
  html: string,
  slots: Record<string, string>,
  palette: Palette,
  media?: RenderMedia
): string {
  const paletteMap: Record<string, string> = {
    PRIMARY: palette.primary,
    PRIMARY_LIGHT: palette.light,
    PRIMARY_DARK: palette.dark,
    HERO_GRAD: palette.heroGrad,
    LIGHT_BG: palette.lightBg,
    DECOR_PATTERN: palette.decorPattern,
    DECOR_SIZE: palette.decorSize,
    ...mediaMap(media),
  }
  return html.replace(/\{\{([A-Z0-9_]+)\}\}/g, (_m, key: string) => {
    if (key in paletteMap) return paletteMap[key]
    if (key in slots) return slots[key]
    return ""
  })
}
```

- [ ] **Step 4: Run it — expect pass**

Run: `npx jest --ci src/lib/gtm/templates/__tests__/render.test.ts`
Expected: `Tests: 4 passed, 4 total`

- [ ] **Step 5: Commit**

```bash
git add src/lib/gtm/templates/render.ts src/lib/gtm/templates/__tests__/render.test.ts
git commit -m "renderTemplate: reserved BG_IMAGE / BG_OPACITY media keys

Optional media param resolves to url(data-uri)/none and a 0-1 opacity;
reserved keys win over caller slots. Defaults leave output unchanged.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 4: Template `.bg` hook in all 15 templates + parity check

**Files:**
- Create: `scripts/add-bg-hook.mjs`
- Create: `scripts/render-parity.ts`
- Modify (via script): `src/lib/gtm/templates/social-post/*/template.html`

- [ ] **Step 1: Capture the pre-change renders** (one template per family, sample data, no media)

Create `scripts/render-parity.ts`:

```ts
/**
 * One-shot parity check. `npx tsx scripts/render-parity.ts baseline` writes
 * PNGs to .parity/baseline; `npx tsx scripts/render-parity.ts compare` renders
 * again (no media) and compares byte-for-byte, then renders each with a photo
 * at 60% into .parity/with-bg for eyeballing. Never starts a dev server.
 */
import fs from "fs"
import path from "path"
import { findTemplate, loadTemplateHtml, renderTemplate } from "../src/lib/gtm/templates/render"
import { paletteFor } from "../src/lib/gtm/pillar-palettes"
import { renderHtmlToPng } from "../src/lib/gtm/render-png"

const FAMILIES = ["bold-stat-1x1", "headline-quote-11", "wide-banner-11", "rox-report-11", "solution-feature-11"]
const OUT = path.join(process.cwd(), ".parity")
const PIXEL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg=="

async function render(id: string, withBg: boolean): Promise<Buffer> {
  const m = findTemplate("social-post", id)
  const html = await loadTemplateHtml("social-post", id)
  if (!m || !html) throw new Error(`missing template ${id}`)
  const rendered = renderTemplate(html, m.sampleData, paletteFor("trade-shows"), withBg ? { bgImage: PIXEL, bgOpacity: 60 } : undefined)
  return renderHtmlToPng(rendered)
}

async function main() {
  const mode = process.argv[2]
  if (mode !== "baseline" && mode !== "compare") throw new Error("usage: baseline | compare")
  const dir = path.join(OUT, mode === "baseline" ? "baseline" : "after")
  fs.mkdirSync(dir, { recursive: true })
  let mismatches = 0
  for (const id of FAMILIES) {
    const png = await render(id, false)
    fs.writeFileSync(path.join(dir, `${id}.png`), png)
    if (mode === "compare") {
      const base = fs.readFileSync(path.join(OUT, "baseline", `${id}.png`))
      const same = base.equals(png)
      console.log(`${same ? "SAME   " : "DIFFERS"} ${id}`)
      if (!same) mismatches++
      fs.mkdirSync(path.join(OUT, "with-bg"), { recursive: true })
      fs.writeFileSync(path.join(OUT, "with-bg", `${id}.png`), await render(id, true))
    } else {
      console.log(`wrote ${id}`)
    }
  }
  if (mode === "compare") console.log(mismatches === 0 ? "PARITY OK" : `PARITY: ${mismatches} differ — open .parity/baseline vs .parity/after and confirm visually identical (webfont timing can shift bytes)`)
}
main().catch((e) => { console.error(e); process.exit(1) })
```

Add `.parity/` to `Website/.gitignore` (append a line `.parity/`).

Run: `npx tsx scripts/render-parity.ts baseline`
Expected: five `wrote …` lines; `.parity/baseline/*.png` exist. (If `tsx` is missing: `npm i -D tsx`.)

- [ ] **Step 2: Write the patcher** `scripts/add-bg-hook.mjs`:

```js
/**
 * Adds the background-photo hook to every social-post template. Idempotent:
 * a template that already has `.stage .bg` is skipped. Fails loudly if any
 * anchor is missing so a template never ends up half-patched.
 */
import fs from "fs"
import path from "path"

const ROOT = path.join(process.cwd(), "src/lib/gtm/templates/social-post")
const ROOT_VARS = `    --bg-image:     {{BG_IMAGE}};\n    --bg-opacity:   {{BG_OPACITY}};\n`
const bgRule = (cls) => `  .${cls} .bg {\n    position: absolute; inset: 0;\n    background: var(--bg-image) center / cover no-repeat;\n    opacity: var(--bg-opacity);\n    pointer-events: none; z-index: 0;\n  }\n`
const rootTags = (html, cls) => [...html.matchAll(new RegExp(`<div class="${cls}"(?: id="[a-z0-9-]+")?>`, "g"))].map((m) => m[0])

let patched = 0, skipped = 0
for (const dir of fs.readdirSync(ROOT)) {
  const file = path.join(ROOT, dir, "template.html")
  if (!fs.existsSync(file)) continue
  let html = fs.readFileSync(file, "utf8")
  if (/\.(stage|card) \.bg \{/.test(html)) { skipped++; continue }

  // Pick the root: prefer .stage; fall back to .card only when no .stage exists
  // (wide-banner-11). Both roots are position:relative + overflow:hidden with
  // the same ::before decor / ::after overlay layering.
  let cls = "stage"
  let tags = rootTags(html, cls)
  if (tags.length === 0) { cls = "card"; tags = rootTags(html, cls) }
  if (tags.length !== 1) throw new Error(`${dir}: expected exactly one <div class="${cls}"[ id=…]> root, found ${tags.length}`)
  const rootTag = tags[0]

  const rootIdx = html.indexOf(":root {")
  if (rootIdx < 0) throw new Error(`${dir}: no ':root {'`)
  const rootLineEnd = html.indexOf("\n", rootIdx) + 1
  html = html.slice(0, rootLineEnd) + ROOT_VARS + html.slice(rootLineEnd)

  const styleEnd = html.indexOf("</style>")
  if (styleEnd < 0) throw new Error(`${dir}: no </style>`)
  html = html.slice(0, styleEnd) + bgRule(cls) + html.slice(styleEnd)

  html = html.replace(rootTag, `${rootTag}\n  <div class="bg"></div>`)

  fs.writeFileSync(file, html)
  patched++
}
console.log(`patched ${patched}, skipped ${skipped}`)
if (patched + skipped !== 15) throw new Error(`expected 15 templates, saw ${patched + skipped}`)
```

- [ ] **Step 3: Run it**

Run: `node scripts/add-bg-hook.mjs`
Expected: `patched 15, skipped 0`

Run: `node scripts/add-bg-hook.mjs`
Expected: `patched 0, skipped 15` (idempotent)

Run: `grep -L 'class="bg"' src/lib/gtm/templates/social-post/*/template.html`
Expected: no output (every template has the layer).

- [ ] **Step 4: Parity**

Run: `npx tsx scripts/render-parity.ts compare`
Expected: five `SAME` lines and `PARITY OK`. If any line says `DIFFERS`, open `.parity/baseline/<id>.png` next to `.parity/after/<id>.png`: they must be visually identical (byte drift from webfont timing is acceptable; any visible change is a bug in the hook — stop and inspect that template). Then open `.parity/with-bg/*.png`: the single-pixel photo tints the stage at 60% under the darkening overlay, text unchanged.

- [x] **Step 5: Verify gate + commit** *(done — commit `3ec73178`; 15/15 patched, `PARITY OK` on all five families. The original patcher assumed every template was rooted on a bare `<div class="stage">`; `wide-banner-11` is rooted on `<div class="card" id="card">` and `wide-banner-169` on `<div class="stage" id="stage">`, so the script above was generalized (prefer `.stage`, fall back to `.card`, tolerate an `id`).)*

> **Amended after review (2026-09-16), follow-up commit:** review found the `.bg` layer painted *above* the text in the nine light templates (`headline-quote-*`, `solution-feature-*`, `rox-report-*`), which declare no stacking at all; six of them also lacked `position: relative` on `.stage`. Parity couldn't see it — with no photo the layer paints nothing. The patcher now (a) emits `.{root} > *:not(.bg) { position: relative; z-index: 1; }` for any template with no positive `z-index` (the six dark templates keep their explicit ladders — the rule would push `.geo` above their overlay), and (b) inserts `position: relative` into the root rule when absent. `render-parity.ts compare` now throws if a with-photo render equals the no-photo render, and the five `.parity/with-bg/*.png` files are inspected by eye. Templates were re-patched from the pre-patch state (`git checkout 3ec73178^ -- …`) so the follow-up diff is insertions-only.

Run the verification gate. Expected: tsc 0, Jest green (16 tests).

```bash
git add scripts/add-bg-hook.mjs scripts/render-parity.ts .gitignore src/lib/gtm/templates/social-post
git commit -m "Templates: background photo layer in all 15 social-post templates

Adds --bg-image / --bg-opacity to :root and a .stage .bg layer (above the
decor pattern, below the darkening overlay and all text). With no photo the
layer is background:none at opacity 1, so renders are unchanged — verified
by scripts/render-parity.ts. Applied by scripts/add-bg-hook.mjs.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 5: `fill-template` / `fill-carousel` — media + slots override (TDD)

**Files:**
- Create: `src/lib/gtm/render-media.ts`
- Create: `src/lib/gtm/__tests__/render-media.test.ts`
- Create: `src/app/api/gtm/__tests__/fill-template.test.ts`
- Modify: `src/app/api/gtm/fill-template/route.ts`
- Modify: `src/app/api/gtm/fill-carousel/route.ts`

- [ ] **Step 1: Failing validation tests** — `src/lib/gtm/__tests__/render-media.test.ts`:

```ts
import { parseRenderMedia, filterSlots, MAX_BG_BYTES } from "../render-media"
import type { SlotSpec } from "@/lib/gtm/templates/types"

const png = "data:image/png;base64," + Buffer.from("hello").toString("base64")

describe("parseRenderMedia", () => {
  it("returns undefined media when nothing is supplied", () => {
    expect(parseRenderMedia({})).toEqual({ ok: true, media: undefined })
  })
  it("accepts png/jpeg/webp data URIs and 0-100 opacity", () => {
    expect(parseRenderMedia({ bgImage: png, bgOpacity: 62 })).toEqual({ ok: true, media: { bgImage: png, bgOpacity: 62 } })
  })
  it("rejects a non-image data URI", () => {
    const r = parseRenderMedia({ bgImage: "data:text/html;base64,AAAA" })
    expect(r.ok).toBe(false)
  })
  it("rejects an https URL (must be inline)", () => {
    expect(parseRenderMedia({ bgImage: "https://x/y.png" }).ok).toBe(false)
  })
  it("rejects an image over the byte cap", () => {
    const big = "data:image/png;base64," + Buffer.alloc(MAX_BG_BYTES + 1).toString("base64")
    expect(parseRenderMedia({ bgImage: big }).ok).toBe(false)
  })
  it("rejects a non-numeric or out-of-range opacity", () => {
    expect(parseRenderMedia({ bgOpacity: "abc" }).ok).toBe(false)
    expect(parseRenderMedia({ bgOpacity: 101 }).ok).toBe(false)
  })
})

describe("filterSlots", () => {
  const spec: SlotSpec[] = [
    { key: "STAT", label: "", kind: "stat_number", maxChars: 3, example: "" },
    { key: "LABEL", label: "", kind: "eyebrow", maxChars: 10, example: "" },
  ]
  it("keeps only manifest keys, truncates to maxChars, strips em-dashes", () => {
    expect(filterSlots({ STAT: "12345", LABEL: "a — b", EVIL: "x" }, spec)).toEqual({ STAT: "123", LABEL: "a - b" })
  })
  it("returns null when the input is not an object of strings", () => {
    expect(filterSlots("nope", spec)).toBeNull()
    expect(filterSlots({ STAT: 5 }, spec)).toEqual({ STAT: "5" })
  })
})
```

Run: `npx jest --ci src/lib/gtm/__tests__/render-media.test.ts`
Expected: FAIL — `Cannot find module '../render-media'`.

- [ ] **Step 2: Implement** `src/lib/gtm/render-media.ts`:

```ts
import { stripEmDashes } from "@/lib/gtm/sanitize"
import type { SlotSpec } from "@/lib/gtm/templates/types"
import type { RenderMedia } from "@/lib/gtm/templates/render"

/** Data-URI images are inlined into the stored HTML, so cap them. */
export const MAX_BG_BYTES = 4 * 1024 * 1024
const DATA_URI = /^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/=]+)$/

export type MediaParse = { ok: true; media: RenderMedia | undefined } | { ok: false; error: string }

/** Validate optional `bgImage` (inline data URI ≤ 4 MB) and `bgOpacity` (0–100). */
export function parseRenderMedia(body: { bgImage?: unknown; bgOpacity?: unknown }): MediaParse {
  const media: RenderMedia = {}
  if (body.bgImage !== undefined && body.bgImage !== null && body.bgImage !== "") {
    if (typeof body.bgImage !== "string") return { ok: false, error: "bgImage must be a data URI string" }
    const m = body.bgImage.match(DATA_URI)
    if (!m) return { ok: false, error: "bgImage must be a base64 data URI of type image/png, image/jpeg or image/webp" }
    const bytes = Math.floor((m[2].length * 3) / 4)
    if (bytes > MAX_BG_BYTES) return { ok: false, error: "Background image is larger than 4 MB" }
    media.bgImage = body.bgImage
  }
  if (body.bgOpacity !== undefined && body.bgOpacity !== null) {
    const n = typeof body.bgOpacity === "number" ? body.bgOpacity : Number(body.bgOpacity)
    if (!Number.isFinite(n) || n < 0 || n > 100 || typeof body.bgOpacity === "boolean") {
      return { ok: false, error: "bgOpacity must be a number from 0 to 100" }
    }
    media.bgOpacity = n
  }
  return { ok: true, media: Object.keys(media).length ? media : undefined }
}

/**
 * Keep only the manifest's slot keys, coerce to strings, strip em-dashes,
 * truncate to each slot's maxChars. Null when the input is not an object.
 */
export function filterSlots(input: unknown, spec: SlotSpec[]): Record<string, string> | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null
  const out: Record<string, string> = {}
  for (const s of spec) {
    const v = (input as Record<string, unknown>)[s.key]
    if (v === undefined || v === null) continue
    out[s.key] = stripEmDashes(String(v)).slice(0, s.maxChars)
  }
  return out
}
```

Run: `npx jest --ci src/lib/gtm/__tests__/render-media.test.ts`
Expected: `Tests: 8 passed, 8 total`

- [ ] **Step 3: Failing route test** — `src/app/api/gtm/__tests__/fill-template.test.ts`:

```ts
import { POST } from "../fill-template/route"
import { NextRequest } from "next/server"

jest.mock("@/lib/gtm/content-types", () => ({ requireGtmAuth: jest.fn(async () => true) }))
jest.mock("@/lib/gtm/kv-store", () => ({ kv: { set: jest.fn(async () => undefined) } }))
jest.mock("@vercel/blob", () => ({ put: jest.fn(async (p: string) => ({ url: `https://blob.test/${p}` })) }))
jest.mock("@/lib/gtm/templates/render", () => {
  const actual = jest.requireActual("@/lib/gtm/templates/render")
  return {
    ...actual,
    findTemplate: jest.fn(() => ({
      id: "bold-stat-1x1", label: "Bold Stat", assetType: "social-post", aspectRatio: "1:1", description: "",
      slots: [{ key: "STAT", label: "", kind: "stat_number", maxChars: 4, example: "" }],
      sampleData: { STAT: "1%" },
    })),
    loadTemplateHtml: jest.fn(async () => `<style>:root{--bg-image:{{BG_IMAGE}};--bg-opacity:{{BG_OPACITY}}}</style><b>{{STAT}}</b>`),
  }
})

import { put } from "@vercel/blob"

const png = "data:image/png;base64," + Buffer.from("x").toString("base64")
const base = { templateId: "bold-stat-1x1", assetType: "social-post", pillar: "trade-shows", briefText: "A brief long enough to pass validation.", itemId: "draft-1" }

function req(body: unknown) {
  return new NextRequest("http://localhost/api/gtm/fill-template", { method: "POST", body: JSON.stringify(body) })
}

describe("POST /api/gtm/fill-template", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.ANTHROPIC_API_KEY = "test"
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({ content: [{ type: "text", text: JSON.stringify({ STAT: "94%" }) }] }),
    })) as unknown as typeof fetch
  })

  it("skips Claude when slots are supplied and renders them with media", async () => {
    const res = await POST(req({ ...base, slots: { STAT: "12345", EVIL: "x" }, bgImage: png, bgOpacity: 62 }))
    expect(res.status).toBe(200)
    expect(global.fetch).not.toHaveBeenCalled()
    const stored = (put as jest.Mock).mock.calls[0][1] as string
    expect(stored).toContain("<b>1234</b>")
    expect(stored).not.toContain("EVIL")
    expect(stored).toContain(`--bg-image:url("${png}")`)
    expect(stored).toContain("--bg-opacity:0.62")
    const data = await res.json()
    expect(data.slots).toEqual({ STAT: "1234" })
  })

  it("calls Claude when slots are absent and still applies media", async () => {
    const res = await POST(req({ ...base, bgImage: png, bgOpacity: 30 }))
    expect(res.status).toBe(200)
    expect(global.fetch).toHaveBeenCalledTimes(1)
    const stored = (put as jest.Mock).mock.calls[0][1] as string
    expect(stored).toContain("<b>94%</b>")
    expect(stored).toContain("--bg-opacity:0.3")
  })

  it("renders the designed state (none / 1) when no media is sent", async () => {
    await POST(req(base))
    const stored = (put as jest.Mock).mock.calls[0][1] as string
    expect(stored).toContain("--bg-image:none")
    expect(stored).toContain("--bg-opacity:1")
  })

  it("rejects a bad bgImage with 400", async () => {
    const res = await POST(req({ ...base, bgImage: "https://x/y.png" }))
    expect(res.status).toBe(400)
    expect(put).not.toHaveBeenCalled()
  })
})
```

Run: `npx jest --ci src/app/api/gtm/__tests__/fill-template.test.ts`
Expected: FAIL — test 1 fails because Claude is called and `EVIL`/media are ignored; test 4 fails (200 not 400).

- [ ] **Step 4: Implement in `fill-template/route.ts`**

Add to the imports (after line 10):
```ts
import { parseRenderMedia, filterSlots } from "@/lib/gtm/render-media"
```
Replace line 46:
```ts
    const { templateId, assetType, pillar, briefText, itemId } = body ?? {}
```
with
```ts
    const { templateId, assetType, pillar, briefText, itemId, slots: slotsOverride, bgImage, bgOpacity } = body ?? {}
```
After the manifest 404 check (after line 71) insert:
```ts
    const mediaParse = parseRenderMedia({ bgImage, bgOpacity })
    if (!mediaParse.ok) {
      return NextResponse.json({ error: mediaParse.error }, { status: 400 })
    }
    const media = mediaParse.media
```
Wrap the Claude section so it runs only without an override. Replace lines 78–176 (from `const apiKey = process.env.ANTHROPIC_API_KEY` through the closing `}` of the JSON-parse `catch`) with:

```ts
    let slots: Record<string, string>
    const overridden = slotsOverride !== undefined && slotsOverride !== null
    if (overridden) {
      // Re-render path (slot edits, opacity slider): no AI call, manifest keys only.
      const filtered = filterSlots(slotsOverride, manifest.slots)
      if (!filtered) {
        return NextResponse.json({ error: "slots must be an object of slot values" }, { status: 400 })
      }
      slots = filtered
    } else {
      const apiKey = process.env.ANTHROPIC_API_KEY
      if (!apiKey) {
        return NextResponse.json(
          { error: "Generation is not configured. No API key found." },
          { status: 500 }
        )
      }

      // ─── Build the slot-fill prompt ──────────────────────────────────
      // Compact: template's slot spec + brand-voice rules + brief. Claude
      // returns a small JSON of slot values. No HTML, no chain-of-thought.
      const slotSpec = manifest.slots
        .map((s) => `- "${s.key}" (${s.kind}, max ${s.maxChars} chars): ${s.label}. Example: ${s.example}`)
        .join("\n")

      const userPrompt = `You are writing copy for a Momentify ${manifest.aspectRatio} ${manifest.assetType} graphic.

Template: ${manifest.label}
Design intent: ${manifest.description}
Pillar palette: ${pillar}

BRAND VOICE RULES (non-negotiable):
- Momentify is a fan engagement and event technology company. Bold, energetic, sports/events-focused tone.
- Use hyphens (-), commas, or periods. NEVER use em-dashes ( - ) or en-dashes (-).
- CTAs must be action-oriented and low-friction: "Book a Demo", "Reserve Your Spot", "See It Live". NEVER "Sign up", "Subscribe", "Buy now".
- Speak to event organizers, sports teams, venues, and fan experience professionals.
- Respect every slot's maxChars. Going over breaks the layout.
- AVOID WIDOWS AND ORPHANS: never let the last line of a multi-line slot end with a single short word. Prefer copy whose word count divides evenly into 2-4 visual lines. If a sentence wraps to leave one word alone on a line, rewrite it (shorter words, restructured phrasing, or trim the overall length).
- Vary word lengths so wrapping looks balanced. Long final words help anchor the last line; short throwaways at the end create widows.

BRIEF (use this as context, not verbatim copy):
${briefText.slice(0, 2400)}

SLOTS TO FILL (return JSON with these EXACT keys):
${slotSpec}

Return ONLY a JSON object with the slot keys above. No markdown fencing, no commentary, no prose wrapping. Example: {"LABEL": "...", "STAT": "..."}`

      // ─── Call Claude ─────────────────────────────────────────────────
      const MODEL = process.env.CLAUDE_MODEL || "claude-sonnet-5"
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: MODEL,
          // Content generation needs no reasoning; disabling thinking keeps the
          // response fast and makes the first content block the text (Sonnet 5
          // runs adaptive thinking by default, which would otherwise be content[0]).
          thinking: { type: "disabled" },
          max_tokens: 800, // JSON payload only - small budget
          messages: [{ role: "user", content: userPrompt }],
        }),
      })

      if (!response.ok) {
        const err = await response.text().catch(() => "")
        console.error("[fill-template] Anthropic error", err)
        let detail: string | undefined
        try { detail = JSON.parse(err)?.error?.message } catch { /* ignore */ }
        return NextResponse.json(
          { error: detail || "Slot fill failed. Please try again." },
          { status: response.status === 401 ? 401 : 500 }
        )
      }

      const data = await response.json()
      const rawText = (data.content?.find((b: { type?: string; text?: string }) => b.type === "text")?.text) ?? ""
      if (!rawText) {
        return NextResponse.json({ error: "Empty response from Claude" }, { status: 500 })
      }

      // ─── Parse slot JSON ─────────────────────────────────────────────
      // Strip code fences if Claude wrapped despite instructions.
      const fenced = rawText.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/)
      const jsonText = (fenced ? fenced[1] : rawText).trim()

      try {
        const parsed = JSON.parse(jsonText)
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
          throw new Error("expected object")
        }
        // Coerce all values to strings + strip em-dashes per brand voice
        slots = {}
        for (const [k, v] of Object.entries(parsed)) {
          if (typeof v === "string") slots[k] = stripEmDashes(v)
          else if (v !== undefined && v !== null) slots[k] = stripEmDashes(String(v))
        }
      } catch (e) {
        console.error("[fill-template] JSON parse failed", e, rawText.slice(0, 300))
        return NextResponse.json(
          { error: "Claude returned invalid JSON. Try regenerating." },
          { status: 502 }
        )
      }
    }
```
Replace the render line (`const renderedHtml = renderTemplate(html, slots, palette)`) with:
```ts
    const renderedHtml = renderTemplate(html, slots, palette, media)
```
Update the doc comment block (lines 19–26) to add the three optional fields:
```ts
 *   slots?:     Record<string,string>  // re-render with these values (skips Claude)
 *   bgImage?:   string      // data:image/(png|jpeg|webp);base64,… ≤ 4 MB
 *   bgOpacity?: number      // 0–100
```

Run: `npx jest --ci src/app/api/gtm/__tests__/fill-template.test.ts`
Expected: `Tests: 4 passed, 4 total`

- [ ] **Step 5: `fill-carousel`** — same media handling, per card, plus a `cards` override and `cards` in the response.

Add the import after the route's existing render import:
```ts
import { parseRenderMedia, filterSlots } from "@/lib/gtm/render-media"
```
Locate the two anchors first:

Run: `grep -nE "const \{.*briefText|findTemplate\(|ANTHROPIC_API_KEY" src/app/api/gtm/fill-carousel/route.ts`
Expected: three lines — the body destructure, the `manifest` assignment via `findTemplate(`, and the API-key read, in that order.

Extend the body destructure with `, cards: cardsOverride, bgImage, bgOpacity`. Immediately after the `manifest` assignment's not-found check (and before the `ANTHROPIC_API_KEY` line), insert:
```ts
    const mediaParse = parseRenderMedia({ bgImage, bgOpacity })
    if (!mediaParse.ok) {
      return NextResponse.json({ error: mediaParse.error }, { status: 400 })
    }
    const media = mediaParse.media
```
Change the card loop render (line 205):
```ts
      const cardHtml = renderTemplate(templateHtml, cards[i], palette)
```
to
```ts
      const cardHtml = renderTemplate(templateHtml, cards[i], palette, media)
```
Wrap the Claude call + parse (from the `apiKey` check through the end of the `cards = arr.map(...)` `catch`) in `if (cardsOverride === undefined || cardsOverride === null) { … } else { … }` where the else branch is:
```ts
      if (!Array.isArray(cardsOverride) || cardsOverride.length !== CARD_COUNT) {
        return NextResponse.json({ error: `cards must be an array of ${CARD_COUNT} slot objects` }, { status: 400 })
      }
      const filteredCards: Record<string, string>[] = []
      for (const c of cardsOverride) {
        const f = filterSlots(c, manifest.slots)
        if (!f) return NextResponse.json({ error: "each card must be an object of slot values" }, { status: 400 })
        filteredCards.push(f)
      }
      cards = filteredCards
```
(declare `let cards: Record<string, string>[]` before the `if`, removing the inner `let cards` declaration). In the final `NextResponse.json({ … })` of the route add `cards,` so the client can re-render later.

- [ ] **Step 6: Verify gate + commit** *(Tasks 3 and 5 done — commits `d792ffa5`, `5c1cdc04`, `015ddea5`; review approved after fixes. The review's own probe suite confirmed: override-path values are HTML-escaped exactly once for rendering and returned raw; the Claude path is byte-identical (pinned by a regression test); every user-controlled `{{…}}` in all 15 templates is an HTML text node, so entity-escaping is sufficient; `MAX_BG_BYTES` = 3 MB decoded ≈ 4.0 MB base64, under the ~4.5 MB platform body limit; `bgOpacity` accepts numbers / numeric strings only, `0` preserved. Jest is 34 after the added tests. **Deferred follow-ups (pre-existing, out of scope):** Claude-generated slot markup and the unauthenticated `template-preview` GET still reach stored HTML unescaped — a separate security ticket; a committed `fill-carousel` test; the "client always resends the full slot set" contract is unwritten — note it at the `AssetPanel` call site if a partial-update path is ever added.)*

Run the verification gate. Expected: tsc 0; Jest `Tests: 28 passed` (12 + 4 + 8 + 4).

```bash
git add src/lib/gtm/render-media.ts src/lib/gtm/__tests__/render-media.test.ts src/app/api/gtm/__tests__/fill-template.test.ts src/app/api/gtm/fill-template/route.ts src/app/api/gtm/fill-carousel/route.ts
git commit -m "fill-template / fill-carousel: background media + slots override

Routes accept an inline data-URI bgImage (png/jpeg/webp, ≤4 MB) and a
0-100 bgOpacity, substituted into the stored HTML so the preview iframe and
PNG rasterizer render identically. A slots (or cards) override re-renders
without calling Claude — manifest keys only, maxChars enforced — powering
slot edits and the opacity slider. Default path is unchanged.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 6: `AssetPanel` — media prop, slot editor, re-render

**Files:**
- Modify: `src/components/gtm/AssetPanel.tsx`

- [ ] **Step 1: Props + state.** Replace the `AssetPanelProps` interface (lines 28–39) with:

```ts
export interface AssetPanelProps {
  /** Momentify solution id (trade-shows / recruiting / field-sales / facilities / events-venues) */
  solution: string
  /** Content type - "social-post" uses templates; others use full HTML generation */
  assetType: string
  /** Library item id - scopes the generated/filled file so each item has its own asset */
  itemId: string
  /** The saved brief text - passed to Claude as fill context */
  briefText: string
  /** Optional background photo (data URI) + opacity 0-100, applied to template renders */
  media?: { bgImage?: string; bgOpacity?: number }
  /** Optional caller-controlled class for layout tweaks */
  className?: string
}
```
Update the component signature (line 79) to destructure `media`:
```ts
export default function AssetPanel({ solution, assetType, itemId, briefText, media, className }: AssetPanelProps) {
```
After `const [pickerOpen, setPickerOpen] = useState(false)` (line 85) add:
```ts
  // Last filled values, so slot edits and media changes re-render without Claude.
  const [slots, setSlots] = useState<Record<string, string> | null>(null)
  const [cards, setCards] = useState<Record<string, string>[] | null>(null)
  const [draftSlots, setDraftSlots] = useState<Record<string, string>>({})
  const [rerendering, setRerendering] = useState(false)
```
and change `const busy = generating || uploading` to `const busy = generating || uploading || rerendering`.

- [ ] **Step 2: Send media on fill; keep the returned slots.** In `handleFillTemplate`, replace the `payload` const (lines 147–149) with:

```ts
        const mediaFields = media?.bgImage ? { bgImage: media.bgImage, bgOpacity: media.bgOpacity ?? 100 } : {}
        const payload = isCarousel
          ? { templateId, pillar: solution, briefText, itemId, ...mediaFields }
          : { templateId, assetType: "social-post", pillar: solution, briefText, itemId, ...mediaFields }
```
After `setAssetUrl(withCacheBust(data.url))` (line 161) add:
```ts
        if (isCarousel) { setCards(Array.isArray(data.cards) ? data.cards : null); setSlots(null) }
        else { setSlots(data.slots ?? null); setDraftSlots(data.slots ?? {}); setCards(null) }
```
and add `media` to the `useCallback` deps: `[solution, briefText, itemId, isCarousel, media]`.

- [ ] **Step 3: Re-render helper + media effect.** After `handleFillTemplate` (after line 176) insert:

```ts
  // ─── Re-render without Claude (slot edits, opacity slider) ───────────
  const rerender = useCallback(
    async (nextSlots: Record<string, string> | null, nextCards: Record<string, string>[] | null) => {
      if (!activeTemplateId) return
      if (!isCarousel && !nextSlots) return
      if (isCarousel && !nextCards) return
      setRerendering(true)
      setError(null)
      try {
        const mediaFields = media?.bgImage ? { bgImage: media.bgImage, bgOpacity: media.bgOpacity ?? 100 } : {}
        const endpoint = isCarousel ? "/api/gtm/fill-carousel" : "/api/gtm/fill-template"
        const payload = isCarousel
          ? { templateId: activeTemplateId, pillar: solution, briefText, itemId, cards: nextCards, ...mediaFields }
          : { templateId: activeTemplateId, assetType: "social-post", pillar: solution, briefText, itemId, slots: nextSlots, ...mediaFields }
        const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body.error || "Re-render failed")
        }
        const data = await res.json()
        setAssetUrl(withCacheBust(data.url))
        if (!isCarousel && data.slots) { setSlots(data.slots); setDraftSlots(data.slots) }
        if (isCarousel && Array.isArray(data.cards)) setCards(data.cards)
        stampGraphicRef(itemId, { blobUrl: data.url, assetType, templateId: activeTemplateId })
      } catch (e: unknown) {
        const err = e as { message?: string }
        setError(err?.message || "Re-render failed.")
      } finally {
        setRerendering(false)
      }
    },
    [activeTemplateId, isCarousel, media, solution, briefText, itemId, assetType]
  )

  // Media changed after a fill (photo picked/cleared, slider released) → re-render.
  const mediaKey = `${media?.bgImage ? media.bgImage.length : 0}:${media?.bgOpacity ?? ""}`
  const lastMediaKey = useRef(mediaKey)
  useEffect(() => {
    if (lastMediaKey.current === mediaKey) return
    lastMediaKey.current = mediaKey
    if (!assetUrl || !activeTemplateId) return
    void rerender(slots, cards)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaKey])
```

- [ ] **Step 4: Slot editor UI (social-post only).** Directly after the preview block — i.e. after the `})()}` that closes `{assetUrl && !busy && (() => { … })()}` (line 487) and before the panel's closing `</div>` (line 488) — insert:

```tsx
      {assetUrl && !isCarousel && slots && activeTemplateId && (() => {
        const manifest = socialTemplates.find((t) => t.id === activeTemplateId)
        if (!manifest) return null
        const dirty = manifest.slots.some((s) => (draftSlots[s.key] ?? "") !== (slots[s.key] ?? ""))
        return (
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            <span className="eyebrow">Edit copy</span>
            {manifest.slots.map((s) => (
              <label key={s.key} style={{ display: "block" }}>
                <span className="field-label">{s.label} <span style={{ fontWeight: 400, color: "var(--gtm-text-faint)" }}>· max {s.maxChars}</span></span>
                <input
                  className="input"
                  value={draftSlots[s.key] ?? ""}
                  maxLength={s.maxChars}
                  onChange={(e) => setDraftSlots((d) => ({ ...d, [s.key]: e.target.value }))}
                />
              </label>
            ))}
            <div>
              <button className="btn btn-secondary btn-sm" disabled={!dirty || busy} onClick={() => void rerender(draftSlots, null)}>
                {rerendering ? "Updating…" : "Update preview"}
              </button>
            </div>
          </div>
        )
      })()}
```

- [ ] **Step 5: Token swaps in this file** (it is one of the outliers). Apply exactly:

| find | replace |
|---|---|
| `background: "#ffffff",` (in `panel`) | `background: "var(--gtm-bg-card)",` |
| `borderRadius: 6,` in `panel` | `borderRadius: "var(--gtm-radius-card)",` |
| every `"#00BBA5"` | `"var(--gtm-accent)"` |
| `color: "#181818"` | `color: "var(--gtm-text-primary)"` |
| both `color: "#6b6b6b"` | `color: "var(--gtm-text-secondary)"` |
| both `background: "#f6f8fb"` | `background: "var(--gtm-surface-2)"` |
| `"rgba(36,123,150,0.16)"` | `"var(--gtm-accent-bg)"` |
| `"rgba(239, 68, 68, 0.08)"` / `"rgba(239, 68, 68, 0.3)"` | `"var(--gtm-danger-bg)"` / `"var(--gtm-danger-border)"` |
| `"rgba(0, 187, 165, 0.06)"` / `"rgba(0, 187, 165, 0.2)"` | `"var(--gtm-accent-bg)"` / `"var(--gtm-accent-bg)"` |

Run: `grep -nE '#00BBA5|#181818|#6b6b6b|#f6f8fb|#ffffff"' src/components/gtm/AssetPanel.tsx`
Expected: no output.

- [x] **Step 6: Verify gate + commit** *(done — commits `4279eb7d` + `dc79d569`; combined review approved after fixes: three missed token swaps, a busy-aware deferred re-render so a media change mid-fill never races the blob path, abort/timeout on `rerender`, content-sensitive `mediaKey`, `data.slots` shape guard. Deferred follow-up: an asset restored from KV on mount has no `slots`, so the slot editor and media re-render are unavailable until the user re-fills — fix belongs in `fill-*`/`asset-check` caching `slots`/`cards` in KV. The plan's Step-5 grep was narrower than the acceptance rule; use the widened one: `#00BBA5|#181818|#6b6b6b|#f6f8fb|#b91c1c|rgba\(36,123,150|rgba\(239, 68, 68|rgba\(0, 187, 165`.)*

Run the verification gate. Expected: tsc 0, Jest green.

```bash
git add src/components/gtm/AssetPanel.tsx
git commit -m "AssetPanel: media prop, slot editor, Claude-free re-render

Passes bgImage/bgOpacity into template fills, keeps the returned slots
(cards for carousel), re-renders through the slots override when media
changes or the user edits copy and clicks Update preview. Tokenized.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 7: New `ContentBuilderCanonical.tsx` + import swap

**Files:**
- Create: `src/components/gtm/tabs/ContentBuilderCanonical.tsx`
- Modify: `src/components/gtm/tabs/SolutionTabs.tsx` (import swap)

- [ ] **Step 1: Create the file.** Every handler is the existing one, moved; the additions are `bgImage`/`bgOpacity` state (persisted in the session), the Media step, the Visual/Text format chips, and the mobile sticky preview.

```tsx
"use client"

import React, { useState, useMemo, useEffect, useRef } from "react"
import { Loader2, Copy, Save, Check, ExternalLink, RefreshCw, Send, Globe, Terminal, Trash2, Download, CalendarPlus, ImagePlus, X } from "lucide-react"
import type { VerticalOption } from "./SolutionTabs"
import { dispatchLibraryChanged } from "./SolutionTabs"
import AssetPanel from "@/components/gtm/AssetPanel"
import CaptionsPanel from "@/components/gtm/CaptionsPanel"
import { solutionPersonas } from "@/lib/gtm/builder-prompts"

// ─── HTML-asset generation contract ───────────────────────────────────────
// Content types that have a one-click HTML asset pipeline (calls /api/gtm/generate-asset-html).
// social-post AND carousel use the template-selector flow instead (see isSocialPost below).
const ONE_CLICK_HTML_ASSETS = new Set(["infographic", "microsite", "one-pager", "pitch-deck"])

const CONTENT_TYPES: { value: string; label: string; description: string; visual: boolean }[] = [
  { value: "social-post", label: "Social Post", description: "LinkedIn, Instagram, and X versions", visual: true },
  { value: "carousel", label: "Social Carousel", description: "6-card LinkedIn/Instagram carousel", visual: true },
  { value: "infographic", label: "Infographic", description: "6-panel data-driven asset", visual: true },
  { value: "microsite", label: "Microsite", description: "Landing page structure + palette", visual: true },
  { value: "one-pager", label: "Sales One-Pager", description: "Leave-behind PDF content", visual: true },
  { value: "pitch-deck", label: "Pitch Deck", description: "8-slide presentation script", visual: true },
  { value: "cold-emails", label: "Cold Email Sequence", description: "3-touch outreach sequence", visual: false },
  { value: "linkedin-dm", label: "LinkedIn DM Sequence", description: "3-message conversation flow", visual: false },
  { value: "lead-magnet", label: "Lead Magnet Outline", description: "Gated PDF/guide structure", visual: false },
  { value: "discovery-script", label: "Discovery Call Script", description: "Sales call + objection handling", visual: false },
  { value: "partner-pitch", label: "Partner Pitch", description: "Channel/partnership narrative", visual: false },
  { value: "battle-card", label: "Battle Card", description: "Competitive positioning one-pager", visual: false },
]

const MAX_BG_BYTES = 4 * 1024 * 1024

function fileToDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result))
    r.onerror = () => reject(new Error("Could not read the image"))
    r.readAsDataURL(file)
  })
}

interface ContentBuilderProps {
  solution: string
  solutionLabel: string
  verticals: VerticalOption[]
}

export default function ContentBuilderCanonical({ solution, solutionLabel, verticals }: ContentBuilderProps) {
  const [vertical, setVertical] = useState(verticals[0]?.id ?? "")
  const personaOptions = solutionPersonas[solution] ?? solutionPersonas.general ?? []
  const [persona, setPersona] = useState<string>(personaOptions[0]?.id ?? "auto")
  const [motion, setMotion] = useState<"direct" | "partner">("direct")
  // Default format is unchanged from the previous builder (Cold Email Sequence).
  const [contentType, setContentType] = useState("cold-emails")
  const [additionalContext, setAdditionalContext] = useState("")
  const [competitor, setCompetitor] = useState("")
  const [loading, setLoading] = useState(false)
  const [generated, setGenerated] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activePlatform, setActivePlatform] = useState<"linkedin" | "instagram" | "twitter">("linkedin")
  const [draftAssetId, setDraftAssetId] = useState<string | null>(null)

  // Background photo (data URI) + opacity 0-100 for template renders. Part of the session.
  const [bgImage, setBgImage] = useState<string | null>(null)
  const [bgOpacity, setBgOpacity] = useState(100)
  // Slider drags update `sliderValue`; `bgOpacity` (what AssetPanel re-renders on) commits on release.
  const [sliderValue, setSliderValue] = useState(100)
  const [bgError, setBgError] = useState<string | null>(null)
  const bgInputRef = useRef<HTMLInputElement | null>(null)

  // Schedule-on-calendar flow state (social-post only for now).
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [scheduleBusy, setScheduleBusy] = useState(false)
  const [scheduled, setScheduled] = useState(false)
  const [scheduleDate, setScheduleDate] = useState<string>(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
  })

  // Mobile: preview pins to the top with a show/hide chevron (fleet pattern).
  const [isMobile, setIsMobile] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(true)
  useEffect(() => {
    const c = () => setIsMobile(window.innerWidth < 768)
    c()
    window.addEventListener("resize", c)
    return () => window.removeEventListener("resize", c)
  }, [])

  // ─── Session persistence ─────────────────────────────────────────────
  const storageKey = `gtm:cb-session:${solution}`
  const hydrated = useRef(false)

  useEffect(() => {
    hydrated.current = false
    if (typeof window === "undefined") return
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) {
        const s = JSON.parse(raw) as Record<string, unknown>
        if (typeof s.vertical === "string") setVertical(s.vertical)
        if (typeof s.persona === "string") setPersona(s.persona)
        if (s.motion === "direct" || s.motion === "partner") setMotion(s.motion)
        if (typeof s.contentType === "string") setContentType(s.contentType)
        if (typeof s.additionalContext === "string") setAdditionalContext(s.additionalContext)
        if (typeof s.competitor === "string") setCompetitor(s.competitor)
        if (typeof s.generated === "string") setGenerated(s.generated)
        if (typeof s.draftAssetId === "string") setDraftAssetId(s.draftAssetId)
        if (typeof s.bgImage === "string") setBgImage(s.bgImage)
        if (typeof s.bgOpacity === "number") { setBgOpacity(s.bgOpacity); setSliderValue(s.bgOpacity) }
      }
    } catch {
      /* corrupted storage is non-fatal */
    }
    hydrated.current = true
  }, [solution, storageKey])

  useEffect(() => {
    if (!hydrated.current || typeof window === "undefined") return
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ vertical, persona, motion, contentType, additionalContext, competitor, generated, draftAssetId, bgImage, bgOpacity })
      )
    } catch {
      /* storage full / disabled - silently skip */
    }
  }, [storageKey, vertical, persona, motion, contentType, additionalContext, competitor, generated, draftAssetId, bgImage, bgOpacity])

  function handleClearSession() {
    setVertical(verticals[0]?.id ?? "")
    setPersona(personaOptions[0]?.id ?? "auto")
    setMotion("direct")
    setContentType("cold-emails")
    setAdditionalContext("")
    setCompetitor("")
    setGenerated(null)
    setDraftAssetId(null)
    setBgImage(null)
    setBgOpacity(100)
    setSliderValue(100)
    setError(null)
    setSaved(false)
    setCopied(false)
    try { localStorage.removeItem(storageKey) } catch { /* ignore */ }
  }

  const showCompetitor = contentType === "battle-card"
  const isSocialPost = contentType === "social-post" || contentType === "carousel"
  const isOneClickHtmlAsset = ONE_CLICK_HTML_ASSETS.has(contentType)
  const currentType = CONTENT_TYPES.find((c) => c.value === contentType)

  // ─── HTML asset generation state ─────────────────────────────────────────
  const [generatingAsset, setGeneratingAsset] = useState<string | null>(null)
  const [assetUrl, setAssetUrl] = useState<string | null>(null)
  const [assetError, setAssetError] = useState<string | null>(null)

  // Microsite publish modal
  const [publishOpen, setPublishOpen] = useState(false)
  const [publishSlug, setPublishSlug] = useState("")
  const [publishTitle, setPublishTitle] = useState("")
  const [publishDesc, setPublishDesc] = useState("")
  const [publishing, setPublishing] = useState(false)
  const [publishResult, setPublishResult] = useState<{ blobUrl?: string; error?: string } | null>(null)

  const socialSections = useMemo(() => {
    if (!generated || !isSocialPost) return null
    const result: Record<"linkedin" | "instagram" | "twitter", string> = { linkedin: "", instagram: "", twitter: "" }
    const linkedinMatch = generated.match(/---\s*LINKEDIN\s*---([\s\S]*?)(?=---\s*(?:INSTAGRAM|TWITTER)\s*---|$)/i)
    const instagramMatch = generated.match(/---\s*INSTAGRAM\s*---([\s\S]*?)(?=---\s*(?:LINKEDIN|TWITTER)\s*---|$)/i)
    const twitterMatch = generated.match(/---\s*TWITTER\s*---([\s\S]*?)(?=---\s*(?:LINKEDIN|INSTAGRAM)\s*---|$)/i)
    if (linkedinMatch) result.linkedin = linkedinMatch[1].trim()
    if (instagramMatch) result.instagram = instagramMatch[1].trim()
    if (twitterMatch) result.twitter = twitterMatch[1].trim()
    return result
  }, [generated, isSocialPost])

  const socialCaptions = useMemo<Record<string, string> | null>(() => {
    if (!socialSections) return null
    const out: Record<string, string> = {}
    if (socialSections.linkedin) out.linkedin = socialSections.linkedin
    if (socialSections.instagram) out.instagram = socialSections.instagram
    if (socialSections.twitter) out.x = socialSections.twitter
    if (Object.keys(out).length === 0 && generated) out.linkedin = generated.trim()
    return Object.keys(out).length ? out : null
  }, [socialSections, generated])

  useEffect(() => {
    if (isSocialPost) setActivePlatform("linkedin")
  }, [generated, isSocialPost])

  // Reset HTML asset state whenever the brief or content type changes
  useEffect(() => {
    setAssetUrl(null)
    setAssetError(null)
    setGeneratingAsset(null)
    setPublishResult(null)
    setPublishOpen(false)
  }, [generated, contentType, solution])

  // Switching format drops the photo (it belongs to a template render). Done in the
  // chip click handler — not an effect — so session hydration never wipes a restored photo.
  function selectFormat(value: string) {
    if (value === contentType) return
    setContentType(value)
    setBgImage(null)
    setBgOpacity(100)
    setSliderValue(100)
    setBgError(null)
  }

  const rawContent = useMemo(() => {
    if (!generated) return ""
    if (isSocialPost && socialSections) {
      const section = socialSections[activePlatform]
      return section || generated
    }
    return generated
  }, [generated, isSocialPost, socialSections, activePlatform])

  const displayContent = useMemo(() => {
    if (!rawContent) return ""
    const LABEL_PATTERN = /^(HEADLINE|SUBHEAD|POST|SUBJECT|BODY|CTA|TITLE|SUBTITLE|HOOK|SECTIONS|CONCLUSION|GATE REQUIREMENT|OPENING|DISCOVERY QUESTIONS|TRANSITION|TOP OBJECTIONS|SOFT CLOSE|PAGE TITLE|META DESCRIPTION|DESIGN NOTES|PROOF POINT|LAYOUT|SERIES_CAPTION|COMPETITOR SNAPSHOT|WHEN YOU HEAR THEM|HOW TO RESPOND|THEIR STRENGTHS|OUR ADVANTAGE|KILLER QUESTION|PROOF POINT TO USE|THE PROBLEM|OUR SERVICES APPROACH|HOW WE ENGAGE|CALL TO ACTION|OPENING PARAGRAPH|SECOND PARAGRAPH|THIRD PARAGRAPH|ONE-LINER|HERO SECTION|EMAIL [0-9]+ - Day [0-9]+)\s*:/gim
    return rawContent
      .replace(LABEL_PATTERN, (_m, label) => `**${label}:**`)
      .replace(/(?<!\n)\n(?!\n)/g, "  \n")
  }, [rawContent])

  const pitchDeckPrompt = useMemo(() => {
    return `Build a pitch deck HTML file at public/gtm/${solution}-pitch-deck.html for Momentify.

Design-system constraints:
- Font: Inter (Google Fonts); H1 clamp(32px,5vw,44px)/300/-0.02em, H2 clamp(22px,3vw,28px)/300/-0.01em, body 13-15px
- Cards: border-radius 6px, 1px solid #dde6f0, padding 20-24px
- Buttons: height 38px, border-radius 6px, font-size 13px/weight 600
- Text tokens: text-primary #181818, text-secondary #6b6b6b, border #dde6f0, bg-card #fff

Voice: solutions-led (activate, measure, grow). Momentify is an experiential marketing activation platform.

8 slides, 16:9 aspect ratio, keyboard navigation (ArrowLeft/Right), self-contained HTML + inline CSS + vanilla JS.

Brief to ground every slide:
---
${rawContent || "[Generate the text brief in Content Builder first, then paste it here]"}
---`
  }, [solution, rawContent])

  // ─── Handlers (unchanged behavior) ───────────────────────────────────────
  async function handleGenerate() {
    setLoading(true)
    setError(null)
    setGenerated(null)
    setSaved(false)
    try {
      const res = await fetch("/api/gtm/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          solution, vertical, persona, motion, contentType,
          additionalContext: additionalContext || undefined,
          competitor: showCompetitor ? competitor || undefined : undefined,
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || "Generation failed")
      }
      const data = await res.json()
      setGenerated(data.content || "")
      setDraftAssetId(`draft-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`)
    } catch (e: unknown) {
      const err = e as { message?: string }
      setError(err.message || "Generation failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    if (!rawContent) return
    try {
      await navigator.clipboard.writeText(rawContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* ignore */ }
  }

  async function handleSave(): Promise<string | null> {
    if (!generated) return null
    try {
      const res = await fetch("/api/gtm/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ solution, contentType, motion, content: generated, tags: [vertical], createdAt: new Date().toISOString(), kept: true }),
      })
      if (!res.ok) throw new Error("Save failed")
      const { id: libraryItemId } = await res.json()
      if (isSocialPost && draftAssetId && libraryItemId) {
        try {
          await fetch("/api/gtm/asset-link", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pillar: solution, assetType: contentType === "carousel" ? "carousel" : "social-post", fromItemId: draftAssetId, toItemId: libraryItemId }),
          })
        } catch { /* Non-fatal; the brief is saved. */ }
      }
      setSaved(true)
      dispatchLibraryChanged(solution)
      setTimeout(() => setSaved(false), 2500)
      return libraryItemId ?? null
    } catch {
      setError("Failed to save to Library. Is GTM auth active?")
      return null
    }
  }

  async function handleDownloadGraphic() {
    if (!isSocialPost || !draftAssetId) return
    try {
      const downloadAssetType = contentType === "carousel" ? "carousel" : "social-post"
      const url = `/api/gtm/asset-preview?solution=${encodeURIComponent(solution)}&assetType=${downloadAssetType}&itemId=${encodeURIComponent(draftAssetId)}`
      const res = await fetch(url, { cache: "no-store" })
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`)
      const html = await res.text()
      const blob = new Blob([html], { type: "text/html" })
      const a = document.createElement("a")
      a.href = URL.createObjectURL(blob)
      a.download = `momentify-${solution}-${contentType}-${Date.now()}.html`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(a.href), 1000)
    } catch (e: unknown) {
      const err = e as { message?: string }
      setError(err?.message || "Download failed.")
    }
  }

  async function handleSchedule(dateIso: string) {
    if (!dateIso) return
    setScheduleBusy(true)
    try {
      const libraryItemId = await handleSave()
      if (!libraryItemId) throw new Error("Library save failed")
      const titleSeed = generated!.split("\n").find((l) => l.trim().length > 8) || contentType
      const taskBody = {
        id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        title: titleSeed.replace(/[#*:]+/g, "").trim().slice(0, 80),
        category: contentType, solution, date: dateIso, duration: 30, completed: false,
        description: `Scheduled from Content Builder.`, sortOrder: Date.now(), libraryItemId,
        assetType: contentType, motion,
      }
      const res = await fetch("/api/gtm/calendar", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(taskBody) })
      if (!res.ok) throw new Error(`Calendar create ${res.status}`)
      setScheduled(true)
      setScheduleOpen(false)
      setTimeout(() => setScheduled(false), 2500)
    } catch (e: unknown) {
      const err = e as { message?: string }
      setError(err?.message || "Schedule failed.")
    } finally {
      setScheduleBusy(false)
    }
  }

  async function handleGenerateAsset() {
    if (!generated || !isOneClickHtmlAsset) return
    setGeneratingAsset(contentType)
    setAssetError(null)
    setAssetUrl(null)
    const timeoutMs = contentType === "pitch-deck" ? 240_000 : 150_000
    const abortCtrl = new AbortController()
    const timeoutId = setTimeout(() => abortCtrl.abort(), timeoutMs)
    try {
      const res = await fetch("/api/gtm/generate-asset-html", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief: generated, assetType: contentType, solution }),
        signal: abortCtrl.signal,
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || "HTML generation failed")
      }
      const data = await res.json()
      const sep = data.url.includes("?") ? "&" : "?"
      setAssetUrl(`${data.url}${sep}t=${Date.now()}`)
    } catch (e: unknown) {
      const err = e as { name?: string; message?: string }
      if (err?.name === "AbortError") setAssetError("Generation took longer than 150s and was cancelled. Try a shorter brief.")
      else setAssetError(err.message || "HTML generation failed. Please try again.")
    } finally {
      clearTimeout(timeoutId)
      setGeneratingAsset(null)
    }
  }

  async function handlePublishMicrosite() {
    if (!assetUrl || contentType !== "microsite") return
    setPublishing(true)
    setPublishResult(null)
    try {
      const htmlRes = await fetch(assetUrl.replace(/([?&])t=\d+(&|$)/, (_m, b, a) => a ? b : "").replace(/[?&]$/, ""))
      if (!htmlRes.ok) throw new Error("Couldn't read the generated microsite file")
      const html = await htmlRes.text()
      const res = await fetch("/api/gtm/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: publishSlug.trim(), title: publishTitle.trim() || `${solutionLabel} Microsite`, description: publishDesc.trim() || undefined, pillars: [solution], source: "builder", html }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || "Publish failed")
      }
      const data = await res.json()
      setPublishResult({ blobUrl: `${window.location.origin}/p/${data.page?.slug ?? publishSlug.trim()}` })
    } catch (e: unknown) {
      const err = e as { message?: string }
      setPublishResult({ error: err.message || "Publish failed" })
    } finally {
      setPublishing(false)
    }
  }

  // ─── Background photo (new) ───────────────────────────────────────────────
  async function handleBgPicked(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return
    setBgError(null)
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) { setBgError("Use a PNG, JPEG, or WebP image."); return }
    if (file.size > MAX_BG_BYTES) { setBgError("Image is larger than 4 MB. Resize it and try again."); return }
    try {
      setBgImage(await fileToDataUri(file))
      setBgOpacity(100)
      setSliderValue(100)
    } catch (err: unknown) {
      setBgError((err as { message?: string })?.message || "Could not read the image.")
    }
  }
  function handleBgClear() {
    // Clearing the photo clears its opacity too, so the next photo starts at 100%.
    setBgImage(null)
    setBgOpacity(100)
    setSliderValue(100)
    setBgError(null)
  }
  const commitOpacity = () => { if (sliderValue !== bgOpacity) setBgOpacity(sliderValue) }

  const assetType = contentType === "carousel" ? "carousel" : "social-post"
  const media = bgImage ? { bgImage, bgOpacity } : undefined

  // ─── Sections ─────────────────────────────────────────────────────────────
  const resultCard = generated && (
    <div className="card" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
        <span className="eyebrow">Result</span>
        <span className="section-note">
          {isSocialPost ? "Pick a template, edit any slot, update the preview, then save, schedule, or export." : isOneClickHtmlAsset ? "Generated copy below. Render it as a branded HTML asset when it reads right." : "Generated copy below."}
        </span>
      </div>

      {isSocialPost && draftAssetId && (
        <AssetPanel solution={solution} assetType={assetType} itemId={draftAssetId} briefText={rawContent} media={media} />
      )}

      {isSocialPost && socialCaptions ? (
        <>
          <span className="eyebrow">Post copy by channel</span>
          <CaptionsPanel captions={socialCaptions} />
        </>
      ) : (
        <div style={{ padding: "16px 20px", background: "var(--gtm-bg-page)", borderRadius: "var(--gtm-radius-control)", fontSize: 13, lineHeight: 1.65, color: "var(--gtm-text-primary)", overflow: "auto", minWidth: 0, wordBreak: "break-word" }}>
          <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word", fontFamily: "var(--gtm-font-body)", fontSize: 13, lineHeight: 1.65 }}>{displayContent}</pre>
        </div>
      )}

      {isOneClickHtmlAsset && (
        <div style={{ borderTop: "1px solid var(--gtm-border)", paddingTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div>
              <span className="eyebrow">HTML asset</span>
              <p className="section-note" style={{ margin: "4px 0 0" }}>
                {generatingAsset ? "Claude is writing a fully-branded HTML file. Takes 30-90 seconds." : `One-click rendered ${contentType === "one-pager" ? "one-pager" : contentType} grounded in the brief above.`}
              </p>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="btn btn-primary btn-sm" onClick={handleGenerateAsset} disabled={!!generatingAsset}>
                {generatingAsset ? <><Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> Generating…</> : assetUrl ? <><RefreshCw size={13} /> Regenerate</> : "Generate Now"}
              </button>
              {assetUrl && (
                <a className="btn btn-secondary btn-sm" href={assetUrl.replace(/([?&])t=\d+(&|$)/, (_m, b, a) => a ? b : "").replace(/[?&]$/, "")} target="_blank" rel="noopener" style={{ textDecoration: "none" }}>
                  <ExternalLink size={13} /> Open
                </a>
              )}
              {assetUrl && contentType === "microsite" && (
                <button className="btn btn-secondary btn-sm" onClick={() => setPublishOpen(true)}><Globe size={13} /> Publish Microsite</button>
              )}
              {contentType === "pitch-deck" && (
                <button className="btn btn-tertiary btn-sm" onClick={() => { navigator.clipboard.writeText(pitchDeckPrompt); setCopied(true); setTimeout(() => setCopied(false), 2000) }} title="Copy a Claude Code prompt that builds the deck from this brief">
                  <Terminal size={13} /> {copied ? "Copied" : "Copy Claude Code prompt"}
                </button>
              )}
            </div>
          </div>
          {assetError && <div className="error-note">{assetError}</div>}
          {!assetUrl && !generatingAsset && !assetError && (
            <div style={{ border: "1px dashed var(--gtm-border)", borderRadius: "var(--gtm-radius-control)", padding: 32, textAlign: "center", color: "var(--gtm-text-faint)", fontSize: 13 }}>
              Click <strong style={{ color: "var(--gtm-text-secondary)" }}>Generate Now</strong> to render a fully-branded HTML version of this brief. A preview appears here when it&rsquo;s ready (~20-40s).
            </div>
          )}
          {assetUrl && (
            <div style={{ background: "var(--gtm-bg-page)", border: "1px solid var(--gtm-border)", borderRadius: "var(--gtm-radius-control)", overflow: "hidden" }}>
              <iframe key={assetUrl} src={assetUrl} title={`${contentType} preview`} style={{ width: "100%", height: contentType === "microsite" ? 720 : contentType === "pitch-deck" ? 640 : 600, border: "none", display: "block", background: "#fff" }} />
            </div>
          )}
        </div>
      )}

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", borderTop: "1px solid var(--gtm-border)", paddingTop: 12, position: "relative" }}>
        <button className="btn btn-primary btn-sm" onClick={() => void handleSave()}>{saved ? <Check size={13} /> : <Save size={13} />} {saved ? "Saved" : "Save to Library"}</button>
        {isSocialPost && draftAssetId && (
          <>
            <button className="btn btn-secondary btn-sm" onClick={() => setScheduleOpen((v) => !v)}>{scheduled ? <Check size={13} /> : <CalendarPlus size={13} />} {scheduled ? "Scheduled" : "Schedule"}</button>
            <button className="btn btn-secondary btn-sm" onClick={handleDownloadGraphic} title="Download the rendered HTML"><Download size={13} /> Download HTML</button>
          </>
        )}
        <button className="btn btn-secondary btn-sm" onClick={handleCopy}>{copied ? <Check size={13} /> : <Copy size={13} />} {copied ? "Copied" : "Copy"}</button>
        {scheduleOpen && (
          <div className="card" style={{ position: "absolute", top: "100%", left: 0, marginTop: 8, zIndex: 20, padding: 14, minWidth: 260, display: "flex", flexDirection: "column", gap: 10 }}>
            <label style={{ display: "block" }}>
              <span className="field-label">Schedule date</span>
              <input className="input" type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} />
            </label>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setScheduleOpen(false)}>Cancel</button>
              <button className="btn btn-primary btn-sm" onClick={() => handleSchedule(scheduleDate)} disabled={scheduleBusy}>
                {scheduleBusy ? <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> : <CalendarPlus size={13} />} {scheduleBusy ? "Scheduling…" : "Save + Schedule"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div style={{ fontFamily: "var(--gtm-font-body)", display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12, flexWrap: "wrap" }}>
        <div>
          <span className="eyebrow">{solutionLabel} · Content Builder</span>
          <h2 style={{ margin: "4px 0 0", fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--gtm-text-primary)" }}>Turn a brief into on-brand content.</h2>
        </div>
        {generated && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="mono" style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--gtm-text-secondary)", background: "var(--gtm-surface-2)", borderRadius: 4, padding: "2px 6px" }}>session saved</span>
            <button className="btn btn-tertiary btn-sm" style={{ color: "#b91c1c" }} onClick={() => { if (confirm("Clear this Content Builder session? The generated brief and form inputs will be reset.")) handleClearSession() }}>
              <Trash2 size={13} /> Clear session
            </button>
          </div>
        )}
      </div>

      {/* Mobile: the result pins to the top with a chevron so it stays visible while editing. */}
      {isMobile && generated && (
        <div style={{ position: "sticky", top: 0, zIndex: 30, background: "var(--gtm-bg-page)", paddingBottom: 10, borderBottom: "1px solid var(--gtm-border)" }}>
          <button type="button" className="btn btn-secondary" style={{ width: "100%", justifyContent: "space-between", borderRadius: 9 }} onClick={() => setPreviewOpen((o) => !o)} aria-expanded={previewOpen}>
            <span>Result</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ transform: previewOpen ? "rotate(180deg)" : "none", transition: "transform .15s ease" }}><polyline points="6 9 12 15 18 9" /></svg>
          </button>
          {previewOpen && <div style={{ marginTop: 10, maxHeight: "52vh", overflow: "auto" }}>{resultCard}</div>}
        </div>
      )}

      {/* 1 · Brief */}
      <div className="card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <span className="eyebrow">Brief</span>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
          <label style={{ display: "block" }}>
            <span className="field-label">Service / Vertical</span>
            <select className="input" value={vertical} onChange={(e) => setVertical(e.target.value)}>
              {verticals.map((v) => <option key={v.id} value={v.id}>{v.label}</option>)}
            </select>
          </label>
          {personaOptions.length > 0 && (
            <label style={{ display: "block" }}>
              <span className="field-label">Primary Persona</span>
              <select className="input" value={persona} onChange={(e) => setPersona(e.target.value)}>
                {personaOptions.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
              <span className="section-note" style={{ display: "block", marginTop: 4 }}>{persona === "auto" ? "Targets the vertical's default buyer." : "Tailors voice, pain points, and proof to this persona."}</span>
            </label>
          )}
        </div>
        <div>
          <span className="field-label">Motion</span>
          <div style={{ display: "flex", gap: 6 }}>
            {(["direct", "partner"] as const).map((m) => (
              <button key={m} type="button" className={`chip${motion === m ? " on" : ""}`} onClick={() => setMotion(m)}>{m === "direct" ? "Direct to Enterprise" : "Channel Partners"}</button>
            ))}
          </div>
        </div>
        {showCompetitor && (
          <label style={{ display: "block" }}>
            <span className="field-label">Competitor</span>
            <input className="input" type="text" value={competitor} onChange={(e) => setCompetitor(e.target.value)} placeholder="e.g. Cvent" />
          </label>
        )}
        <label style={{ display: "block" }}>
          <span className="field-label">Additional context <span style={{ fontWeight: 400, color: "var(--gtm-text-secondary)" }}>(optional)</span></span>
          <textarea className="input" value={additionalContext} onChange={(e) => setAdditionalContext(e.target.value)} placeholder="Specific customer, trigger event, or positioning angle to incorporate..." style={{ minHeight: 80, resize: "vertical" }} />
        </label>
      </div>

      {/* 2 · Format */}
      <div className="card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <span className="eyebrow">Format</span>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
          {([["Visual", true], ["Text", false]] as const).map(([label, visual]) => (
            <div key={label}>
              <span className="field-label">{label}</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {CONTENT_TYPES.filter((c) => c.visual === visual).map((c) => (
                  <button key={c.value} type="button" className={`chip${contentType === c.value ? " on" : ""}`} onClick={() => selectFormat(c.value)} title={c.description}>{c.label}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
        {currentType && <span className="section-note">{currentType.description}</span>}
      </div>

      {/* 4 · Media (social only; the template picker — step 3 — lives inside AssetPanel in Result) */}
      {isSocialPost && (
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
            <span className="eyebrow">Media</span>
            <span className="section-note">Optional background photo for the rendered graphic. Leave it unset and the template renders its designed gradient.</span>
          </div>
          <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
            {bgImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={bgImage} alt="Background photo" style={{ width: 96, height: 64, objectFit: "cover", borderRadius: "var(--gtm-radius-control)", border: "2px solid var(--gtm-accent)", flex: "none" }} />
            ) : (
              <div style={{ width: 96, height: 64, borderRadius: "var(--gtm-radius-control)", background: "var(--gtm-surface-2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gtm-text-faint)", flex: "none" }}><ImagePlus size={18} /></div>
            )}
            <div style={{ flex: 1, minWidth: 220, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "baseline" }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--gtm-text-primary)" }}>Background photo</span>
                <button type="button" className="btn btn-tertiary btn-sm" onClick={() => bgInputRef.current?.click()}>{bgImage ? "Replace" : "Upload"}</button>
                {bgImage && <button type="button" className="btn btn-tertiary btn-sm" style={{ color: "#b91c1c" }} onClick={handleBgClear}><X size={12} /> Clear</button>}
                <input ref={bgInputRef} type="file" accept="image/png,image/jpeg,image/webp" style={{ display: "none" }} onChange={(e) => void handleBgPicked(e)} />
              </div>
              {bgImage && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, maxWidth: 440 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--gtm-text-primary)" }}>Opacity</span>
                  <input
                    type="range" min={0} max={100} step={1} value={sliderValue}
                    aria-label="Background image opacity"
                    onChange={(e) => setSliderValue(Number(e.target.value))}
                    onMouseUp={commitOpacity} onTouchEnd={commitOpacity} onKeyUp={commitOpacity}
                    style={{ flex: 1, accentColor: "var(--gtm-accent)" }}
                  />
                  <span className="mono" style={{ fontSize: 12, width: 40, textAlign: "right", color: "var(--gtm-text-primary)" }}>{sliderValue}%</span>
                </div>
              )}
              {bgError && <span style={{ fontSize: 12, color: "#b91c1c" }}>{bgError}</span>}
              <span className="section-note">PNG, JPEG, or WebP up to 4 MB. The photo is embedded in the render, so the preview and the PNG export always match. Changes re-render when you release the slider.</span>
            </div>
          </div>
        </div>
      )}

      {/* 5 · Generate */}
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <button className="btn btn-primary" onClick={handleGenerate} disabled={loading || !vertical}>
          {loading ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Generating…</> : generated ? "Regenerate" : "Generate"}
        </button>
        {generated && <button className="btn btn-tertiary" onClick={() => { if (confirm("Start over? The generated brief will be cleared (form inputs stay).")) { setGenerated(null); setDraftAssetId(null); setError(null) } }}>Start over</button>}
        <span className="section-note" style={{ marginLeft: "auto" }}>Kept in this browser — leaving the page doesn&rsquo;t lose the brief.</span>
      </div>

      {error && <div className="error-note">{error}</div>}
      {loading && (
        <div className="card" style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--gtm-text-secondary)", fontSize: 13 }}>
          <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Generating content - this takes ~5-15 seconds...
        </div>
      )}

      {/* 6 · Result (desktop; on mobile it is pinned above) */}
      {!isMobile && resultCard}

      {/* Publish-to-Microsite modal */}
      {publishOpen && (
        <div onClick={(e) => { if (e.target === e.currentTarget) setPublishOpen(false) }} style={{ position: "fixed", inset: 0, background: "rgba(6,19,65,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
          <div className="card" style={{ width: "100%", maxWidth: 480, display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <span className="eyebrow">Publish Microsite</span>
              <p className="section-note" style={{ margin: "4px 0 0" }}>Publishes the generated HTML to a permanent, tracked /p/&lt;slug&gt; URL.</p>
            </div>
            {publishResult?.blobUrl ? (
              <div style={{ background: "var(--gtm-accent-bg)", border: "1px solid var(--gtm-accent)", borderRadius: "var(--gtm-radius-control)", padding: 12 }}>
                <p style={{ margin: "0 0 8px 0", fontSize: 13, fontWeight: 600, color: "var(--gtm-accent-text)" }}>Published.</p>
                <a href={publishResult.blobUrl} target="_blank" rel="noopener" style={{ fontSize: 12, color: "var(--gtm-accent-text)", wordBreak: "break-all" }}>{publishResult.blobUrl}</a>
              </div>
            ) : (
              <>
                <label style={{ display: "block" }}><span className="field-label">Slug</span><input className="input" type="text" value={publishSlug} onChange={(e) => setPublishSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} placeholder="e.g. acme-2026-activation" autoFocus /></label>
                <label style={{ display: "block" }}><span className="field-label">Title</span><input className="input" type="text" value={publishTitle} onChange={(e) => setPublishTitle(e.target.value)} placeholder={`${solutionLabel} Microsite`} /></label>
                <label style={{ display: "block" }}><span className="field-label">Description <span style={{ fontWeight: 400 }}>(optional)</span></span><input className="input" type="text" value={publishDesc} onChange={(e) => setPublishDesc(e.target.value)} placeholder="One-line summary" /></label>
              </>
            )}
            {publishResult?.error && <div className="error-note">{publishResult.error}</div>}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button className="btn btn-secondary btn-sm" onClick={() => { setPublishOpen(false); setPublishResult(null); setPublishSlug(""); setPublishTitle(""); setPublishDesc("") }}>{publishResult?.blobUrl ? "Close" : "Cancel"}</button>
              {!publishResult?.blobUrl && (
                <button className="btn btn-primary btn-sm" onClick={handlePublishMicrosite} disabled={!publishSlug.trim() || publishing}>
                  {publishing ? <><Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> Publishing…</> : <><Send size={13} /> Publish</>}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Swap the imports — all seven consumers.** The builder is imported by `src/components/gtm/tabs/SolutionTabs.tsx` (`from "./ContentBuilder"`) AND rendered directly by the six solution pages (`src/app/gtm/{field-sales,general,events-venues,trade-shows,recruiting,facilities}/page.tsx`, each `from "@/components/gtm/tabs/ContentBuilder"`). Change every one of those import paths to `…/ContentBuilderCanonical` (the local binding `ContentBuilder` stays, so no JSX changes). Verify: `grep -rn 'tabs/ContentBuilder"\|from "./ContentBuilder"' src` → nothing; `grep -rn 'ContentBuilderCanonical"' src | wc -l` → `7`. *(An earlier draft assumed a single consumer; the implementer's gate caught the other six.)*

- [ ] **Step 3: Verify gate + commit**

Run the verification gate. Expected: tsc 0, Jest green. Also run `npx next lint --dir src/components/gtm/tabs` — Expected: no errors (warnings about the intentional `eslint-disable` lines are fine).

```bash
git add src/components/gtm/tabs/ContentBuilderCanonical.tsx src/components/gtm/tabs/SolutionTabs.tsx
git commit -m "Content builder: canonical single-column flow with background photo

Rebuilds the builder as Brief → Format (Visual/Text) → Media → Generate →
Result in the shared .card/.eyebrow vocabulary. Every existing handler
(session persistence, save, schedule, download, HTML asset, publish
microsite, pitch-deck prompt) is moved, not rewritten. Adds the background
photo + opacity control (data URI, ≤4 MB, re-render on slider release,
persisted in the session) and the fleet's mobile sticky-preview chevron.
Old ContentBuilder.tsx is retained until the deploy pass confirms parity.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 8: Outlier restyles (tokens only, behavior untouched)

**Files:**
- Modify: `src/components/gtm/LinkInBioBuilder.tsx`, `src/components/gtm/QrLibrary.tsx`, `src/components/gtm/PagesView.tsx`, `src/app/gtm/login/page.tsx`

- [ ] **Step 1: LinkInBioBuilder** — replace lines 23–25:

```ts
const ACCENT = '#0CF4DF'
const INK = '#061341'
const PILLAR_SWATCHES = ['#0CF4DF', '#9B5FE8', '#F2B33D', '#5FD9C2']
```
with
```ts
const ACCENT_CSS = 'var(--gtm-accent)'   // inline styles only
const ACCENT = '#0CF4DF'                 // DATA: defaultConfig() accent — persisted, rendered into the public link page, bound to <input type="color">; must match the link-page route's fallback
const INK = 'var(--gtm-text-primary)'
// Solution accents (design-tokens.json color.solution) — brand, never normalized.
// DATA: compared with persisted link.color via ===, so the values must not change.
const PILLAR_SWATCHES = ['#0CF4DF', '#9B5FE8', '#F2B33D', '#5FD9C2']
```
Every *style* usage of `ACCENT` (inline `style`, `accentColor`, template-literal borders) becomes `ACCENT_CSS`; only `defaultConfig()` keeps the hex `ACCENT`.

> **Corrected after review (2026-09-16):** the first version of this step turned `ACCENT` into a CSS var and changed `PILLAR_SWATCHES[0]`; both are *data* (persisted config / `===` comparisons), which broke the public link renderer's hex regex and orphaned saved links. Likewise in Step 2, `PagesView.tsx`'s `PAGE_PILLARS` colors (`general #1A56DB`, `recruiting #0AA891`) are data mirroring `pillar-palettes.ts` and stay literal — the blanket sed must not touch that array. Rule: a `var(--gtm-…)` string is valid only where the browser renders it; anything persisted, compared, passed to a library, or emitted into exported HTML stays hex.
Then apply these exact substitutions across the file:

```bash
f=src/components/gtm/LinkInBioBuilder.tsx
sed -i '' \
  -e "s/'rgba(0,0,0,0.45)'/'var(--gtm-text-muted)'/g" \
  -e "s/'rgba(0,0,0,0.5)'/'var(--gtm-text-muted)'/g" \
  -e "s/'rgba(0,0,0,0.55)'/'var(--gtm-text-secondary)'/g" \
  -e "s/'rgba(0,0,0,0.6)'/'var(--gtm-text-secondary)'/g" \
  -e "s/'1px solid rgba(0,0,0,0.15)'/'1px solid var(--gtm-border-strong)'/g" \
  -e "s/'1px solid rgba(0,0,0,0.18)'/'1px solid var(--gtm-border-strong)'/g" \
  -e "s/'1px solid rgba(0,0,0,0.12)'/'1px solid var(--gtm-border)'/g" \
  -e "s/'1px solid rgba(0,0,0,0.1)'/'1px solid var(--gtm-border)'/g" \
  -e "s/'1px solid rgba(0,0,0,0.08)'/'1px solid var(--gtm-border)'/g" \
  -e "s/'1px solid rgba(0,0,0,0.06)'/'1px solid var(--gtm-border)'/g" \
  -e "s/'1px dashed rgba(0,0,0,0.25)'/'1px dashed var(--gtm-border-strong)'/g" \
  -e "s/'#fafafa'/'var(--gtm-bg-page)'/g" \
  "$f"
```
In the `card` const (line 35) set `borderRadius: 12` and add `boxShadow: 'var(--gtm-shadow)'`; in `input` (line 43) set `borderRadius: 8`. Leave the mobile-chevron block (added earlier) and the `#111` phone frame as-is.

- [ ] **Step 2: QrLibrary + PagesView** — same vocabulary. Run:

```bash
for f in src/components/gtm/QrLibrary.tsx src/components/gtm/PagesView.tsx; do
sed -i '' \
  -e 's/#12243f/var(--gtm-text-primary)/g' \
  -e 's/#3a4152/var(--gtm-text-secondary)/g' \
  -e 's/rgba(0,0,0,0\.45)/var(--gtm-text-muted)/g' \
  -e 's/rgba(0,0,0,0\.5)/var(--gtm-text-muted)/g' \
  -e 's/rgba(0,0,0,0\.55)/var(--gtm-text-secondary)/g' \
  -e 's/rgba(0,0,0,0\.6)/var(--gtm-text-secondary)/g' \
  -e 's/rgba(0,0,0,0\.65)/var(--gtm-text-secondary)/g' \
  -e 's/rgba(0,0,0,0\.4)/var(--gtm-text-muted)/g' \
  -e 's/1px solid rgba(0,0,0,0\.15)/1px solid var(--gtm-border-strong)/g' \
  -e 's/1px solid rgba(0,0,0,0\.18)/1px solid var(--gtm-border-strong)/g' \
  -e 's/1px solid rgba(0,0,0,0\.2)/1px solid var(--gtm-border-strong)/g' \
  -e 's/1px solid rgba(0,0,0,0\.25)/1px solid var(--gtm-border-strong)/g' \
  -e 's/1px solid rgba(0,0,0,0\.12)/1px solid var(--gtm-border)/g' \
  -e 's/1px solid rgba(0,0,0,0\.1)/1px solid var(--gtm-border)/g' \
  -e 's/1px solid rgba(0,0,0,0\.08)/1px solid var(--gtm-border)/g' \
  -e 's/1px solid rgba(0,0,0,0\.06)/1px solid var(--gtm-border)/g' \
  -e 's/rgba(18,36,63,0\.45)/var(--gtm-text-muted)/g' \
  -e 's/rgba(18,36,63,0\.08)/var(--gtm-surface-2)/g' \
  -e 's/rgba(18,36,63,0\.06)/var(--gtm-surface-2)/g' \
  -e 's/rgba(25,34,77,0\.92)/var(--gtm-text-primary)/g' \
  -e 's/rgba(25,34,77,0\.12)/var(--gtm-border)/g' \
  -e 's/rgba(25,34,77,0\.08)/var(--gtm-surface-2)/g' \
  -e 's/rgba(25,34,77,0\.06)/var(--gtm-surface-2)/g' \
  -e 's/rgba(25,34,77,0\.05)/var(--gtm-surface-2)/g' \
  -e 's/#1A56DB/var(--gtm-accent-text)/g' \
  -e 's/#0AA891/var(--gtm-accent-text)/g' \
  -e 's/#f5f5f5/var(--gtm-surface-2)/g' \
  -e 's/#f0f0f0/var(--gtm-surface-2)/g' \
  -e 's/#e0e0e0/var(--gtm-border-strong)/g' \
  -e 's/#eef2fb/var(--gtm-surface-2)/g' \
  -e 's/#c62828/var(--gtm-danger)/g' \
  -e 's/rgba(198,40,40,0\.3)/var(--gtm-danger-border)/g' \
  -e 's/#00753a/#0AA891/g' \
  -e 's/#00a651/#0AA891/g' \
  "$f"
done
```
The remaining literals are semantic and stay: `#fff`/`#ffffff` (paper), the amber status pair `#fef3c7 / #fde68a / #92400e / #b05a10`, the red status pair `#fee2e2 / #fecaca / #b91c1c`, the solution hex values in PagesView (`#6B21D4 #3A2073 #D4940A #D43D1A`), and the modal scrims `rgba(0,0,0,0.5)`-style backdrops that the sed above converted — **revert those two** in each file to a navy scrim: any `background: 'var(--gtm-text-muted)'` on a `position: 'fixed', inset: 0` overlay becomes `background: 'rgba(6,19,65,0.5)'`. Find them with:

Run: `grep -n "inset: 0" src/components/gtm/QrLibrary.tsx src/components/gtm/PagesView.tsx`
Expected: the overlay lines; fix each one's `background` as above.

Finally, on every top-level card container in both files (`borderRadius: 6` on a `border: '1px solid var(--gtm-border)'` box with `padding` ≥ 14), set `borderRadius: 12` and add `boxShadow: 'var(--gtm-shadow)'`.

Run: `grep -cE '#12243f|#1A56DB|#0AA891"|rgba\(0,0,0,0\.45\)|rgba\(25,34,77' src/components/gtm/QrLibrary.tsx src/components/gtm/PagesView.tsx`
Expected: `0` for both files.

- [ ] **Step 3: Login page** — it renders outside the `data-theme="light"` shell (`layout.tsx` early-returns children for `/gtm/login`), so the shared classes (`.card`, `.btn`, `.input`) do NOT apply there and must not be used; tokens do resolve (they live on `:root`), so use `var(--gtm-*)` in inline styles where a token exists. Apply:

| line | find | replace |
|---|---|---|
| 46 | `background: "#061341",` | keep (brand navy page) |
| 66 | card `background: "#FFFFFF",` block | add `borderRadius: 12, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.25)",` |
| 125 | `color: "#ef4444"` | `color: "#E5484D"` |
| 142 | `background: "linear-gradient(135deg, #0CF4DF, #1A56DB)",` | `background: "linear-gradient(135deg, #00BBA5 0%, #254FE5 100%)", borderRadius: 9999,` |
| input(s) | `border: "1px solid rgba(6, 19, 65, 0.15)"` | `border: "1px solid rgba(11, 11, 60, 0.18)", borderRadius: 8` |

- [x] **Step 4: Verify gate + commit** *(done — commits `8b3f92d7` + `1e429e4a`; combined review approved after the data-color fixes. Deferred, non-blocking follow-ups from review: `--gtm-text-primary` used as a `background` at `QrLibrary.tsx:280/343/581` and `PagesView.tsx:202/205/442` (mirrors the pre-existing navy fills — wants a surface token); login `boxShadow` literal → `var(--gtm-shadow-hover)`; consider renaming the data constant to `ACCENT_DATA` and pinning `defaultConfig().accent === '#0CF4DF'` with a one-line test.)*

Run the verification gate. Expected: tsc 0, Jest green.

```bash
git add src/components/gtm/LinkInBioBuilder.tsx src/components/gtm/QrLibrary.tsx src/components/gtm/PagesView.tsx src/app/gtm/login/page.tsx
git commit -m "Outliers: tokenize QrLibrary, PagesView, LinkInBioBuilder, login

Replaces hardcoded colors with the canonical --gtm-* tokens and the
12px-radius card treatment; brand solution accents and semantic status
colors are kept. No behavior changes.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 9: Preview deploy, parity pass, cleanup

**Files:**
- Delete: `src/components/gtm/tabs/ContentBuilder.tsx`

- [ ] **Step 1: Deploy a preview** (auto-deploy is off; never a production alias). From the **repo root of the worktree** (`~/Development/Momentify/.claude/worktrees/momentify-canonical-ui`), where Vercel's Root Directory is `Website`:

Run: `vercel deploy --target preview 2>&1 | tail -3`
Expected: a `https://…vercel.app` preview URL. Open it and log in.

- [ ] **Step 2: Walk the spec's acceptance criteria on the preview** (desktop and a phone-width window):

1. Sidebar: 232px expanded / 64px strip; Space Grotesk teal-ish eyebrow section labels; pill active state; folds, strip toggle, Sign Out, mobile drawer all work.
2. Each solution page: its accent (violet / teal / amber / indigo / crimson) is intact on chips, eyebrows, and the template picker highlight.
3. Content builder, Social Post: Generate → pick a template → upload a photo → drag the slider and release → preview re-renders → edit a slot → Update preview → Save to Library → Schedule. Then Clear → the photo is gone and the next upload starts at 100%. Refresh mid-way → session (including the photo) is restored.
4. Content builder, Carousel: pick a 1:1 template with a photo set → six cards carry the photo; Download .zip works.
5. Content builder, Microsite: Generate → Generate Now → Publish Microsite → the /p/ URL opens. Pitch Deck: the Copy Claude Code prompt button copies the prompt.
6. A Text format (Cold Email): Generate → Save → Copy.
7. Library / History / calendar task detail still open items and show thumbnails (lifecycle untouched).
8. Outliers: QR Codes, Pages, Link in Bio, login page read as the same system; nothing is unstyled or invisible.
9. Phone width: the Result pins to the top with the chevron; no horizontal scroll anywhere; inputs don't zoom on focus.
10. Keyboard: Tab through every input and button on one solution page — each shows a clearly visible focus outline (the `:focus-visible` ring).
11. Contrast: on the Field Sales page the amber eyebrows and tertiary buttons are legible on white (they use `--gtm-accent-ink`, not the raw accent).

Record anything off; fix, commit, redeploy until the list is clean.

- [ ] **Step 3: Remove the old builder**

Run: `grep -rn 'tabs/ContentBuilder"' src --include=*.tsx --include=*.ts`
Expected: no output (nothing imports it).

```bash
git rm src/components/gtm/tabs/ContentBuilder.tsx
```
Run the verification gate. Expected: tsc 0, Jest green.

```bash
git commit -m "Remove the pre-canonical ContentBuilder after parity verification

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

- [ ] **Step 4: Open the PR** (push only on Jake's explicit go)

```bash
git push -u origin claude/momentify-canonical-ui
gh pr create --base main --head claude/momentify-canonical-ui \
  --title "Momentify GTM: canonical UI in Momentify tokens + background photo" \
  --body "$(cat <<'EOF'
## Summary
- Restyles the GTM engine to the fleet's canonical visual language, expressed in `design-tokens.json` values (12px cards, elevation.2, Space Grotesk teal eyebrows, canonical sidebar chrome at 232/64).
- Rebuilds the content builder as the canonical single-column flow (Brief → Format → Media → Generate → Result) with every existing capability preserved.
- Adds a background photo + opacity control for social-post / carousel renders (inline data URI ≤4 MB; slot edits and the slider re-render without Claude).
- Tokenizes the five hardcoded-color outliers. Deletes the dead dark theme.

## Not changed
Routing, signed-cookie auth, mobile drawer, per-solution accents, calendar-piece lifecycle, `fill-template` default path.

## Verification
`tsc` clean; Jest green for all suites except the pre-existing `generate-asset-html` baseline (cookie auth outside request scope — unrelated, documented in the spec). Template parity confirmed by `scripts/render-parity.ts`. Visual + mobile pass on a Vercel preview.

Spec: `docs/superpowers/specs/2026-09-16-momentify-canonical-ui-design.md`

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```
