# Momentify GTM — Canonical UI + Background Image Design

**Date:** 2026-09-16
**Status:** Approved in brainstorming (sections 1–5), pending final spec review
**Repo:** `~/Development/Momentify` (app in `Website/`), branch `claude/momentify-canonical-ui` off `main`

## Goal

Make Momentify's GTM engine look and behave like the rest of the fleet (KINECT / Maven / AUTIX) — sidebar chrome, page-level visual language, and the content builder's layout — while expressing everything in **Momentify's own design system** (`Website/design-tokens.json`), and add a **background image + opacity** control to the content builder that works like the other engines'.

**Hard constraint — "without breaking anything":** routing, auth (signed httpOnly cookie, `requireGtmAuth()`), the mobile drawer, the per-solution accent schemes, the per-solution saved sessions, schedule-to-calendar, HTML-asset generation, publish-microsite, and the calendar-piece lifecycle (Library / History / `kept`, AssetPanel ref save) are **preserved unchanged in behavior**. This work is styling and layout plus one additive feature.

## Non-goals (deliberately out of scope)

- A Media Library module (Momentify has none; the bg-image feature is upload-only).
- Dark mode (theme is pinned `data-theme="light"`; the dark CSS is dead and is deleted).
- A Settings module, any nav-structure change, or the sidebar's routing model.
- Any change to the other five engines.

## Key findings that shaped the design

- Momentify's sidebar **already has the canonical nav structure** (Foundation / Create / Distribute / Measure + Solutions-as-pillars, per-section folds, icon-strip collapse, footer contract, mobile drawer). Only its *chrome* differs from the fleet.
- ~80% of GTM pages are driven by the shared `--gtm-*` tokens in `src/styles/gtm-theme.css`; remapping that file restyles them. Five files carry hardcoded colors and need hand work: `QrLibrary.tsx`, `PagesView.tsx`, `LinkInBioBuilder.tsx`, `AssetPanel.tsx`, `app/gtm/login/page.tsx`.
- The content builder (`components/gtm/tabs/ContentBuilder.tsx`, 1235 lines) uses a 340px form-left / output-right grid; the fleet uses a single flowing column.
- Momentify's design tokens already provide everything the canonical treatment needs: Space Grotesk as the mono, teal assigned to eyebrows, `letter-spacing.widest = .14em` (the canonical eyebrow tracking), `radius.xl = 12px`, `elevation.2`, and a full `light-mode` color set.
- `renderTemplate` (`lib/gtm/templates/render.ts`) is a pure `{{KEY}}` substitution with a reserved palette map. All 15 social-post templates share one `.stage` structure with a `::before` decor layer and a `::after` darkening overlay. No template has any image/opacity hook today.
- `fill-template` (`app/api/gtm/fill-template/route.ts`) takes `{ templateId, assetType, pillar, briefText, itemId }`, has Claude fill the slots, renders, and **stores the rendered HTML as a blob** (URL + `templateId` cached in KV). The preview iframe and the PNG rasterizer (`render-png` → `renderHtmlToPng`, puppeteer + sparticuz chromium) both load that stored HTML. The client never sends `slots`.
- Headless Chromium cannot fetch private blobs (fleet-wide known blocker) → any image must be inlined as a data URI before the HTML is stored.

---

## Section 1 — Visual system (`src/styles/gtm-theme.css`)

`gtm-theme.css` becomes the canonical visual layer. Canonical **shape** (card treatment, eyebrow, hierarchy, control edges), Momentify **values**.

### Tokens (light, the only theme)

| Token | Value | Source |
|---|---|---|
| `--gtm-bg-page` | `#F4F5FA` | `light-mode.bg` |
| `--gtm-bg-card` | `#FFFFFF` | `light-mode.surface` |
| `--gtm-surface-2` *(new)* | `#ECEEF6` | `light-mode.surface-2` — chips, wells, thumbnail placeholders |
| `--gtm-border` | `rgba(11,11,60,0.10)` | `light-mode.border` — hairline |
| `--gtm-border-strong` *(new)* | `rgba(11,11,60,0.18)` | form-control edge (canon: inputs need more than a hairline) |
| `--gtm-text-primary` | `#061341` | `brand.deep-navy` ("dark text on light") — unchanged |
| `--gtm-text-secondary` *(new, was referenced but never declared)* | `#555555` | `neutral.gray-body` |
| `--gtm-text-muted` | `rgba(11,11,60,0.50)` | `light-mode.text-muted` |
| `--gtm-text-faint` | `rgba(6,19,65,0.35)` | unchanged |
| `--gtm-accent` (default) | `#00BBA5` | `brand.teal` — interactive / on-light |
| `--gtm-accent-text` (default) | `#0AA891` | unchanged (readable teal on white) |
| `--gtm-accent-on-dark` *(new)* | `#0CF4DF` | `brand.cyan` — reserved for dark surfaces |
| `--gtm-accent-bg` (default) | `rgba(0,187,165,0.10)` | |
| `--gtm-radius-card` *(new)* | `12px` | `radius.xl` |
| `--gtm-radius-control` *(new)* | `8px` | `radius.lg` |
| `--gtm-shadow` | `0 4px 12px rgba(0,0,0,0.06)` | `elevation.2` |
| `--gtm-shadow-hover` | `0 10px 15px -3px rgba(0,0,0,0.10)` | `elevation.3` |
| `--gtm-font-body` *(new)* | `var(--font-inter), system-ui, sans-serif` | `typography.font-family.primary` |
| `--gtm-font-mono` *(new)* | `var(--font-space-grotesk), ui-monospace, monospace` | `typography.font-family.mono` |
| `--gtm-grad-action` *(new)* | `linear-gradient(135deg, #00BBA5 0%, #254FE5 100%)` | `gradient.brand` ("softer action gradient for light backgrounds") |
| `--gtm-danger` *(new)* | `#E5484D` | `semantic.error` — fills, borders, icons |
| `--gtm-danger-text` *(new)* | `#b91c1c` | AA-safe danger for text on white |
| `--gtm-accent-ink` *(new, per solution)* | default `#067A69`; violet `#6B21D4`; recruiting `#067A69`; amber `#8F6300`; indigo `#3A2073`; crimson `#B8340F` | AA-safe (≥ 4.5:1 on white) accent for **text**: `.eyebrow`, `.btn-tertiary`, focus rings. Added after code-quality review: the raw teal (2.4:1) and amber (2.6:1) accents fail WCAG AA as text. |
| `--gtm-accent-deep-blue` *(new)* | `#1F3395` | `light-mode.accent` — form labels |
| `--gtm-bg-input` *(new)* | `var(--gtm-bg-card)` | was referenced in BuilderUI.tsx but never defined |

`--gtm-grad-action` is **fleet-constant** — deliberately *not* overridden per solution (primary buttons look the same on every solution page); `--gtm-accent-grad` *is* overridden per solution (hero bars). The theme file says so in a comment so no later task "fixes" it.

The existing `--gtm-cyan`, `--gtm-tag-*`, `--gtm-layer-*`, `--gtm-accent-grad` stay (still referenced); `--gtm-accent-light`, `--gtm-accent-on-dark` and `--gtm-danger` are defined but currently unreferenced — intentional reserves for later tasks. The five **per-solution `[data-solution]` light schemes are kept verbatim** (violet / teal / amber / indigo / crimson) — brand-specific, never normalized.

**Deleted:** the entire `[data-theme="dark"]` block and the five `[data-theme="dark"] [data-solution=…]` overrides. The layout pins `data-theme="light"` and the toggle is already gone; this CSS is dead.

### Shared classes (added to `gtm-theme.css`, scoped under `[data-theme="light"]`)

Scoping is the exact value, not bare `[data-theme]`, so the classes can never leak app-wide if the GTM stylesheet stays loaded after a client-side navigation to the marketing site (which sets `data-theme` on `<html>`). `/gtm/login` renders outside the wrapper: it gets the tokens (on `:root`) but none of the classes — it is styled with `var()` in inline styles only.

Accessibility rules baked into the classes (from code-quality review): no `outline: none` anywhere; `.input`, `.btn`, `.chip` get a 2px `--gtm-accent-ink` outline on `:focus-visible`; text-colored accents use `--gtm-accent-ink`; `.btn[aria-disabled="true"]` dims like `:disabled`; `.mono` uses tabular figures (the opacity readout must not jitter). No hex literals in the class layer — the gate includes a referenced-vs-defined token check.

- `.card` — `background: var(--gtm-bg-card); border: 1px solid var(--gtm-border); border-radius: var(--gtm-radius-card); padding: 20px 22px; box-shadow: var(--gtm-shadow)`
- `.eyebrow` — `font-family: var(--gtm-font-mono); font-size: 12px; font-weight: 500; letter-spacing: .14em; text-transform: uppercase; color: var(--gtm-accent)` (teal, per the token file's assignment of teal to eyebrows)
- `.section-note` — `font-size: 12.5px; color: var(--gtm-text-secondary); line-height: 1.5`
- `.mono` — `font-family: var(--gtm-font-mono)`
- `.field-label` — `font-size: 12px; font-weight: 600; color: #1F3395` (`brand.deep-blue`, accent on light)
- `.input` — `border: 1px solid var(--gtm-border-strong); border-radius: var(--gtm-radius-control); background: #fff; padding: 9px 12px; font-size: 14px` (+ `@media (max-width:767px) { font-size: 16px }` — the fleet's iOS zoom guard)
- `.btn` base + `.btn-primary` (`background: var(--gtm-grad-action); color: #fff; border-radius: 9999px; font-weight: 700`), `.btn-secondary` (white, `1.5px solid var(--gtm-border-strong)`), `.btn-tertiary` (text-only, `color: var(--gtm-accent)`)
- `.chip` / `.chip.on` — pill, `1.5px` border; on = `background: var(--gtm-surface-2)`, weight 600

Typography: body Inter 15px / 1.6; headings Inter 600, `letter-spacing: -0.02em` (Momentify uses Inter for headings — no display font is introduced).

---

## Section 2 — Sidebar chrome (`src/app/gtm/layout.tsx`)

Structure, hrefs, `isActive`, folds, strip collapse, footer contract, mobile drawer, and the sticky top bar are **unchanged**. Only chrome:

- `EXPANDED_WIDTH` 240 → **232**, `STRIP_WIDTH` 72 → **64**.
- Background stays `#061341`; both logo variants (`/Momentify-Logo_Reverse.svg`, `/Momentify-Icon.svg`) stay.
- Section labels adopt the eyebrow treatment on dark: `var(--gtm-font-mono)`, 11px, 500, uppercase, `.14em`, `rgba(255,255,255,.55)`; fold chevron right-aligned.
- Entries: Inter 14px; weight 400, **600 when active**; active background `rgba(255,255,255,.06)` (was `.10`); `border-radius: 8px`; entries indented under their section label (`padding-left` 20px vs label 10px) per the nav-hierarchy rule. Lucide icons stay (every entry already has one, so the icon strip stays navigable). Per-solution color dots stay.
- Dividers `rgba(255,255,255,.08)` between sections (already).
- Footer row resized to canonical (Sign Out 13px left; collapse toggle 28×24 right, `1px solid rgba(255,255,255,.14)`, radius 6). Settings remains hidden (no module).

---

## Section 3 — Content builder (`src/components/gtm/tabs/ContentBuilder.tsx`)

Rebuilt as a **single flowing column** in the canonical order. Implemented as a **new file swapped in behind the same `solution` prop**; the old file is kept until parity is verified, then deleted.

### Header
Eyebrow `{Solution} · Content Builder` + heading. Right: **session saved** tag + **Clear session** (danger text). The per-solution localStorage session (`gtm:cb-session:{solution}`: vertical, persona, motion, contentType, additionalContext, competitor, generated, draftAssetId, **+ bgImage, bgOpacity**) hydrate/persist/clear logic is moved verbatim.

### 1 · Brief (`.card`)
Service / Vertical (select) · Primary Persona (select) · Motion (chips Direct / Partner) · Additional Context (textarea) · **Competitor** (input, shown only when `contentType === "battle-card"`). Same state and options as today.

### 2 · Format (`.card`)
Canonical **Visual / Text** split, all 12 `CONTENT_TYPES`:
- **Visual:** Social Post, Social Carousel, Infographic, Microsite, Sales One-Pager, Pitch Deck
- **Text:** Cold Email Sequence, LinkedIn DM Sequence, Lead Magnet Outline, Discovery Call Script, Partner Pitch, Battle Card

Selected format's description shows as a `.section-note`. Selection drives which of steps 3–4 render:
- `isSocialPost` (Social Post, Carousel) → steps 3 and 4 shown.
- `ONE_CLICK_HTML_ASSETS` (Infographic, Microsite, One-Pager, Pitch Deck) → steps 3–4 hidden.
- Text formats → steps 3–4 hidden.

### 3 · Template · 15 available (`.card`, social only)
Grid of live template previews (existing `template-preview` GET thumbnails) in the solution accent; the existing template-selection state from `AssetPanel` drives it. Note: "Previews are live at each template's true layout viewport, in this solution's accent. The template decides how much of the brief fits."

### 4 · Media (`.card`, social only) — **new**
Background photo: **Upload / Replace / Clear** + thumbnail; **Opacity** slider (0–100, `.mono` percent readout), shown only when an image is set. Behavior in Section 4.

### 5 · Generate
`.btn-primary` **Generate** · `.btn-tertiary` **Start over** · note "Kept in this browser — leaving the page doesn't lose the brief."

### 6 · Result (`.card`)
- **Social:** rendered preview (existing iframe of the stored HTML) at left; editable **slot fields** (from the manifest) + **Update preview** (`.btn-secondary`) at right; then the eyebrow **Post copy by channel** with the existing `CaptionsPanel` cards (LinkedIn / Instagram / X); action row: **Save to Library** (primary) · **Schedule** (date picker; social-post only, as today) · **Copy** · **Download HTML**.
- **HTML-asset formats:** generated copy (labels bolded via the existing `LABEL_PATTERN`), then an **HTML Asset** block: *Generate Now* → preview link + Download; **Microsite** adds *Publish Microsite* (existing modal: slug / title / description, unchanged). **Pitch Deck** keeps the copy-into-Claude-Code prompt (`pitchDeckPrompt`) as a tertiary link.
- **Text formats:** rendered copy with **Save to Library** and **Copy**.

Error states use the existing `error` / `assetError` / `publishResult.error` strings in a `.card` with a danger eyebrow.

### Mobile
The column is single-file. The Result preview gets the fleet's **sticky top + show/hide chevron** (the pattern shipped in the collateral builders and link-in-bio) so it stays visible while editing slots.

---

## Section 4 — Background image + opacity

Parity target: KINECT / AUTIX behavior. Momentify's one difference: **upload-only** (no Media Library gallery).

### Render (`lib/gtm/templates/render.ts`)
```ts
export type RenderMedia = { bgImage?: string; bgOpacity?: number }
export function renderTemplate(html, slots, palette, media?: RenderMedia): string
```
Two reserved keys join the palette map:
- `BG_IMAGE` → `url("<data-uri>")` when set, else `none`
- `BG_OPACITY` → `bgOpacity` clamped to `[0, 1]` (input is 0–100 from the UI → divided by 100), else `1`

Reserved keys win over `slots` (same precedence as `DECOR_PATTERN` today). Quotes/backslashes in the URI are stripped before wrapping in `url("…")`.

### Templates (all 15 under `lib/gtm/templates/social-post/*/template.html`)
Same 6-line hook in each, fleet-consistent naming:
```css
:root { …; --bg-image: {{BG_IMAGE}}; --bg-opacity: {{BG_OPACITY}}; }
.stage .bg { position:absolute; inset:0; background: var(--bg-image) center/cover no-repeat;
             opacity: var(--bg-opacity); pointer-events:none; z-index:0; }
```
and `<div class="bg"></div>` as the **first child** of `.stage`. Layer order (bottom → top): `.stage` hero gradient → `::before` decor pattern (a pseudo-element always paints before real children at equal z-index) → `.bg` photo → `.geo` shapes → `::after` darkening overlay → `.body-area` / `footer` (z-index 1). A supplied photo covers the subtle decor polygons — the intended result — while the existing overlay keeps text legible over any photo. **With nothing set (`none` / `1`) the output is byte-for-byte what it is today.**

### Transport
Client converts the file with `fileToDataUri` (AUTIX pattern); accepts `image/png`, `image/jpeg`, `image/webp`; **rejects > 3 MB decoded** with an inline error (≈ 4 MB as base64, which keeps the JSON body under the platform's ~4.5 MB request limit — the original 4 MB cap could never be reached, so its error was dead code).

**Override-path escaping (added after review):** values supplied through the `slots`/`cards` override are user-controlled and end up in stored HTML that `asset-preview` re-serves same-origin, so the routes HTML-escape a *render copy* of them (`escapeSlotValues`) — on the override path only, so the Claude path's output stays byte-identical — and return the **raw** values in the response so the slot editor never double-escapes on the next Update. The client always resends the full slot set (a partial `slots` object renders the omitted slots empty). A media change that arrives while a fill is in flight is deferred and applied once the panel is idle, so two writers never race the same blob path. The data URI is substituted into the HTML **before** the blob `put`, so the preview iframe and `render-png` load the identical document. The content item schema is unchanged — it still self-carries the graphic via `blobUrl`.

### API (`app/api/gtm/fill-template/route.ts`, `fill-carousel/route.ts`)
Body gains three optional fields: `bgImage?: string` (data URI), `bgOpacity?: number` (0–100), `slots?: Record<string,string>`.
- Validate `bgImage` starts with `data:image/(png|jpeg|webp);base64,` and is ≤ 4 MB decoded; `bgOpacity` numeric 0–100.
- **If `slots` is present:** skip the Claude call; keep only keys present in `manifest.slots`; enforce each slot's `maxChars` (truncate); run `stripEmDashes`; render + persist through the **existing** blob/KV path (same `assetBlobPath`, same KV keys, same `templateId` cache). This powers *Update preview* and the opacity slider with no AI call.
- **If `slots` is absent:** behavior is identical to today, plus `media` passed to `renderTemplate`.
- `fill-carousel` applies the same `media` to every card.
- `template-preview` (GET) is untouched: picker thumbnails show the designed state, like the fleet.
- Auth unchanged: `requireGtmAuth()` (signed cookie); the client uses same-origin `fetch` with cookies — **not** KINECT's `getPassword()` bearer header.

### UI behavior (parity checklist)
- Slider 0–100; **re-render on release** (`onChange` updates local state; `onMouseUp`/`onTouchEnd`/`onKeyUp` triggers the re-render), never per tick.
- **Clearing the image clears the opacity** (next photo starts at 100%) — KINECT's rule.
- `bgImage` + `bgOpacity` are part of the per-solution saved session and survive refresh.
- Changing the format or solution resets `bgImage`/`bgOpacity` along with the existing asset-state reset.
- *Update preview* sends the edited slot values + current `bgImage`/`bgOpacity` via the `slots` override.

---

## Section 5 — Outliers, verification, risks, delivery

### Outlier hand-restyle (behavior untouched; hex/rgba → tokens + shared classes)
`components/gtm/QrLibrary.tsx` (110 hardcoded) · `components/gtm/PagesView.tsx` (67) · `components/gtm/LinkInBioBuilder.tsx` (47 — its `ACCENT` / `INK` / `PILLAR_SWATCHES` consts become token reads; the mobile chevron work already landed there stays) · `components/gtm/AssetPanel.tsx` (23) · `app/gtm/login/page.tsx` (13).

### Verification (this Mac stalls on `next dev` — no local dev server)
**Known-red baseline (decided 2026-09-16):** `app/api/gtm/__tests__/generate-asset-html.test.ts` fails on untouched `main` (23 tests) because `requireGtmAuth()` calls `next/headers` `cookies()` outside a request scope — harness drift from the bearer→cookie auth change, unrelated to this work. It is left as-is and noted in the PR; this work's commits are gated on `tsc` plus the **new** suites below, not on that one.

1. `npx tsc --noEmit` clean.
2. Jest (`app/api/gtm/__tests__` + new `lib/gtm/templates/__tests__/render.test.ts`): defaults yield `none` / `1`; data URI substituted; opacity clamped; reserved keys beat slots; `slots` override drops non-manifest keys and truncates to `maxChars`; `bgImage` validation rejects wrong MIME and > 4 MB.
3. One-shot `renderHtmlToPng` script (tsx) on one template per family (bold-stat, headline-quote, wide-banner, rox-report, solution-feature) **with no bg** → pixel-diff against the pre-change render (must be identical); and **with a bg at 60%** → visually inspect the layer order.
4. **Vercel preview deploy** for the visual + mobile pass (Momentify auto-deploy is off; run `vercel` from the repo root, Root Directory = `Website`). Check: sidebar chrome at 232/64 + drawer; each solution page's accent; content builder in all three pipelines; Media step upload → opacity → Update preview → Save → Schedule; the five outliers; link-in-bio and collateral still correct.

### Regression guards
- Calendar-piece lifecycle: no logic change — Library / History / `kept` / AssetPanel `PATCH /api/gtm/content/{itemId}` ref save are styling-only edits.
- Session, schedule, publish, HTML-asset handlers are **moved into the new column, not rewritten** — same state names, same effects, same endpoints.
- `fill-template` default path (no `slots`) is byte-identical in behavior.
- Templates with no bg set render byte-identical (verified by the PNG diff).

### Risks & mitigations
- **15 template edits must preserve z-order** → one shared snippet applied identically; PNG diff per family.
- **Data-URI bloats the stored HTML blob** → 4 MB cap + inline error; documented.
- **ContentBuilder rewrite is the largest surface** → new file swapped in behind the same prop; old file retained until the deploy pass confirms parity.

### Delivery
- Branch `claude/momentify-canonical-ui` off `main` in worktree `.claude/worktrees/momentify-canonical-ui`. First commit also adds `.claude/worktrees/` to the root `.gitignore` (the directory was untracked, the cause of an earlier accidental sweep).
- Commits per slice, each `tsc`-clean: (1) theme tokens + classes + dark-block removal → (2) sidebar chrome → (3) render keys + 15 template hooks + tests → (4) `fill-template` / `fill-carousel` media + slots override + tests → (5) new ContentBuilder → (6) outlier restyles → (7) old ContentBuilder removal after deploy parity.
- PR to `main`, reviewed on the Vercel preview. Push and deploy only on explicit go.

## Acceptance criteria
1. Side by side with Maven, Momentify's sidebar and pages read as the same system; the eyebrow is Space Grotesk in teal; cards are 12px-radius hairline cards with `elevation.2`.
2. Every one of the 12 formats produces the same output it does today (copy, HTML asset, publish, schedule, save, session persistence).
3. Social Post / Carousel: upload a photo → slider → preview updates on release → Save to Library stores a blob whose PNG shows the photo at that opacity; Clear resets to the designed gradient at 100%.
4. A template with no bg set renders pixel-identical to the pre-change output.
5. `tsc` clean; Jest green; no change to any route's auth; no change to nav structure or routing.
