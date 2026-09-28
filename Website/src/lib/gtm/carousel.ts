/**
 * Carousel rules shared by the server routes (fill-carousel,
 * carousel-download) and the client pickers (AssetPanel,
 * ContentBuilderCanonical). Client-safe: no fs, only the JSON-backed
 * registry and pure string building.
 *
 * A carousel is six slot-fills of ONE social-post template, so the
 * template's manifest decides everything: whether it can be a carousel
 * card at all, and the aspect every surface uses (the swipe shell, the
 * in-builder preview, the PNG export).
 *
 * 4:5 (1080x1350) is the default: it is the Instagram portrait carousel
 * size and takes the most feed height. 1:1 stays selectable, and every
 * carousel saved before 4:5 existed is 1:1, so any record that does not
 * say otherwise resolves to 1:1.
 */

import type { TemplateManifest } from "./templates/types"
import { allTemplates } from "./templates/_registry"

export type CarouselAspect = "4:5" | "1:1"

/** Picker order: portrait first. */
export const CAROUSEL_ASPECTS: readonly CarouselAspect[] = ["4:5", "1:1"]
export const DEFAULT_CAROUSEL_ASPECT: CarouselAspect = "4:5"
/** What a stored carousel with no recorded aspect or template was built at. */
export const LEGACY_CAROUSEL_ASPECT: CarouselAspect = "1:1"

/**
 * Template families that pass the manifest test but cannot work as a
 * repeated card. Matched on the id prefix, so a future size of the same
 * family (rox-gauge-169, ...) is excluded too.
 */
export const CAROUSEL_EXCLUDED_FAMILIES: Readonly<Record<string, string>> = {
  // The whole card is one gauge driven by a numeric SCORE (0-100, max 3
  // chars). Six cards need six scores, and the carousel prompt forbids
  // invented stats and asks for a descriptive label when there is no honest
  // value. A label is not a number, and the template's needle script falls
  // back to a silent 78 on NaN, so an honest card would show a made-up score.
  "rox-gauge": "it is a single-score gauge; six cards would need six real ROX scores, and a non-numeric value silently renders as 78",
  // Tier names, ranges, and colors are fixed brand facts. Every card would
  // repeat the same four-tier ladder with only the blurbs changed, which
  // breaks the hook / argument / CTA arc the carousel prompt asks for.
  "rox-tiers": "every card would repeat the same fixed four-tier ROX ladder",
  // Same shape as rox-tiers: the four ROX categories are a fixed 2x2 grid.
  "rox-dimensions": "every card would repeat the same fixed four-category ROX grid",
}

type ManifestLike = Pick<TemplateManifest, "id" | "assetType" | "aspectRatio">

export function isCarouselAspect(v: unknown): v is CarouselAspect {
  return v === "4:5" || v === "1:1"
}

function excludedFamily(id: string): string | null {
  for (const family of Object.keys(CAROUSEL_EXCLUDED_FAMILIES)) {
    if (id.startsWith(`${family}-`)) return family
  }
  return null
}

/**
 * Why a template cannot be a carousel, or null when it can. The route
 * returns this text as its 400 error, so it is written for a person.
 */
export function carouselIneligibleReason(t: ManifestLike): string | null {
  if (t.assetType !== "social-post") {
    return `Template ${t.id} is a ${t.assetType} template. Carousels use social-post templates.`
  }
  if (!isCarouselAspect(t.aspectRatio)) {
    return `Template ${t.id} is ${t.aspectRatio}. Carousels need a 4:5 (portrait) or 1:1 (square) template.`
  }
  const family = excludedFamily(t.id)
  if (family) {
    return `Template ${t.id} can't be a carousel card: ${CAROUSEL_EXCLUDED_FAMILIES[family]}.`
  }
  return null
}

/** The one eligibility predicate: social-post, 4:5 or 1:1, not excluded. */
export function isCarouselEligible(t: ManifestLike): boolean {
  return carouselIneligibleReason(t) === null
}

/** Eligible templates, 4:5 first, registry order kept within each aspect. */
export function carouselTemplates<T extends ManifestLike>(templates: readonly T[]): T[] {
  const eligible = templates.filter(isCarouselEligible)
  return CAROUSEL_ASPECTS.flatMap((a) => eligible.filter((t) => t.aspectRatio === a))
}

/** "bold-stat-1x1" / "bold-stat-34" / "rox-gauge-45" -> "bold-stat" / "rox-gauge". */
function templateFamily(id: string): string {
  return id.replace(/-(?:\d+x\d+|\d+)$/, "")
}

/**
 * The template the carousel format should start on. Keeps a current choice
 * that is already an eligible 4:5 template; swaps an eligible or ineligible
 * choice for its own family's 4:5 carousel twin when there is one (a 1:1
 * Bold Stat picked for a single post becomes the 4:5 Bold Stat); otherwise
 * the first eligible 4:5 template.
 */
export function preferredCarouselTemplateId(
  currentId: string | null | undefined,
  templates: readonly ManifestLike[] = allTemplates
): string | null {
  const eligible = carouselTemplates(templates)
  const portrait = eligible.filter((t) => t.aspectRatio === DEFAULT_CAROUSEL_ASPECT)
  if (currentId) {
    if (portrait.some((t) => t.id === currentId)) return currentId
    const family = templateFamily(currentId)
    const twin = portrait.find((t) => templateFamily(t.id) === family)
    if (twin) return twin.id
  }
  return portrait[0]?.id ?? eligible[0]?.id ?? null
}

/**
 * Resolve a stored carousel's aspect. Order: the aspect fill-carousel
 * recorded, then the recorded template's manifest, then 1:1 (every
 * carousel from before this field existed was square).
 */
export function carouselAspectFor(
  templateId: string | null | undefined,
  storedAspect?: string | null,
  templates: readonly ManifestLike[] = allTemplates
): CarouselAspect {
  if (isCarouselAspect(storedAspect)) return storedAspect
  if (templateId) {
    const t = templates.find((m) => m.id === templateId)
    if (t && isCarouselAspect(t.aspectRatio)) return t.aspectRatio
  }
  return LEGACY_CAROUSEL_ASPECT
}

// ─── Swipe shell ─────────────────────────────────────────────────────────

/**
 * Card height budget in the shell, in CSS px. A 1:1 card is 540x540 (the
 * size it has always been); a 4:5 card keeps the same height and narrows
 * to 432x540, so it stands as a portrait instead of being squashed.
 */
export const CAROUSEL_TRACK_HEIGHT = 540
const SHELL_PAD_X = 64
const SHELL_PAD_Y = 24

export function carouselTrackSize(aspect: CarouselAspect): { width: number; height: number } {
  const [w, h] = aspect === "4:5" ? [4, 5] : [1, 1]
  return { width: Math.round((CAROUSEL_TRACK_HEIGHT * w) / h), height: CAROUSEL_TRACK_HEIGHT }
}

/** The shell's natural viewport: the card plus the stage padding around it. */
export function carouselShellSize(aspect: CarouselAspect): { width: number; height: number } {
  const t = carouselTrackSize(aspect)
  return { width: t.width + SHELL_PAD_X * 2, height: t.height + SHELL_PAD_Y * 2 }
}

export type ShellPalette = { primary: string; light: string; dark: string; heroGrad: string }

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;")
}

/**
 * Build the swipeable carousel shell HTML. Each card is loaded in its own
 * iframe so the templates' full-viewport styling stays self-contained and
 * doesn't collide with sibling cards. Vanilla JS handles prev/next, dots,
 * keyboard, and pointer/touch swipe.
 *
 * The track takes the template's aspect. Its width is the smallest of the
 * natural card width, the stage width, and the width the stage HEIGHT
 * allows at that ratio, so a short viewport shrinks the card in proportion
 * rather than clipping or squashing it.
 */
export function buildCarouselShell(cardUrls: string[], palette: ShellPalette, aspect: CarouselAspect = LEGACY_CAROUSEL_ASPECT): string {
  const track = carouselTrackSize(aspect)
  const [rw, rh] = aspect === "4:5" ? [4, 5] : [1, 1]
  const iframes = cardUrls
    .map((u, i) => `        <div class="card" data-idx="${i}"><iframe src="${escapeHtml(u)}" title="Card ${i + 1}" loading="${i === 0 ? "eager" : "lazy"}"></iframe></div>`)
    .join("\n")
  const dots = cardUrls
    .map((_, i) => `        <button class="dot${i === 0 ? " active" : ""}" data-idx="${i}" aria-label="Go to card ${i + 1}"></button>`)
    .join("\n")

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Momentify Carousel</title>
  <style>
    :root {
      --primary: ${palette.primary};
      --primary-light: ${palette.light};
      --primary-dark: ${palette.dark};
      --hero-grad: ${palette.heroGrad};
      --pad-y: ${SHELL_PAD_Y}px;
      --pad-x: ${SHELL_PAD_X}px;
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { width: 100%; height: 100%; background: #06060f; overflow: hidden; font-family: 'Inter', system-ui, sans-serif; color: #fff; }
    .stage { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; padding: var(--pad-y) var(--pad-x); }
    .track { position: relative; flex: none; aspect-ratio: ${rw} / ${rh}; width: min(${track.width}px, 100%, calc((100vh - 2 * var(--pad-y)) * ${rw} / ${rh})); max-width: 100%; overflow: hidden; border-radius: 14px; box-shadow: 0 30px 80px rgba(0,0,0,0.45); background: #000; }
    .card { position: absolute; inset: 0; opacity: 0; transition: opacity 320ms ease, transform 320ms ease; transform: translateX(8px); pointer-events: none; }
    .card.active { opacity: 1; transform: translateX(0); pointer-events: auto; }
    .card iframe { width: 100%; height: 100%; border: 0; display: block; background: #000; }
    .nav { position: absolute; top: 50%; transform: translateY(-50%); width: 44px; height: 44px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.18); background: rgba(0,0,0,0.45); color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(6px); transition: background 160ms ease, border-color 160ms ease; }
    .nav:hover { background: var(--primary); border-color: var(--primary); }
    .nav:disabled { opacity: 0.35; cursor: not-allowed; }
    .nav.prev { left: 12px; }
    .nav.next { right: 12px; }
    .nav svg { width: 20px; height: 20px; }
    .dots { position: absolute; bottom: 14px; left: 50%; transform: translateX(-50%); display: flex; gap: 8px; }
    .dot { width: 8px; height: 8px; border-radius: 50%; border: 0; cursor: pointer; background: rgba(255,255,255,0.35); transition: background 160ms ease, transform 160ms ease; padding: 0; }
    .dot.active { background: var(--primary-light); transform: scale(1.25); }
    .counter { position: absolute; top: 14px; right: 18px; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.7); }
    @media (max-width: 640px) {
      :root { --pad-y: 12px; --pad-x: 48px; }
      .nav.prev { left: 6px; }
      .nav.next { right: 6px; }
    }
  </style>
</head>
<body>
  <div class="stage">
    <div class="track" id="track" data-aspect="${aspect}">
${iframes}
      <button class="nav prev" id="prev" aria-label="Previous card">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18 9 12l6-6"/></svg>
      </button>
      <button class="nav next" id="next" aria-label="Next card">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>
      </button>
      <div class="counter"><span id="cur">1</span> / ${cardUrls.length}</div>
      <div class="dots" id="dots">
${dots}
      </div>
    </div>
  </div>
  <script>
    (function() {
      const total = ${cardUrls.length};
      let idx = 0;
      const cards = document.querySelectorAll('.card');
      const dots = document.querySelectorAll('.dot');
      const prev = document.getElementById('prev');
      const next = document.getElementById('next');
      const cur = document.getElementById('cur');
      function render() {
        cards.forEach((c, i) => c.classList.toggle('active', i === idx));
        dots.forEach((d, i) => d.classList.toggle('active', i === idx));
        cur.textContent = String(idx + 1);
        prev.disabled = idx === 0;
        next.disabled = idx === total - 1;
      }
      function go(n) { idx = Math.max(0, Math.min(total - 1, n)); render(); }
      prev.addEventListener('click', () => go(idx - 1));
      next.addEventListener('click', () => go(idx + 1));
      dots.forEach((d, i) => d.addEventListener('click', () => go(i)));
      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') go(idx - 1);
        else if (e.key === 'ArrowRight') go(idx + 1);
      });
      // Pointer/touch swipe
      let startX = 0, swiping = false;
      const track = document.getElementById('track');
      track.addEventListener('pointerdown', (e) => { startX = e.clientX; swiping = true; });
      track.addEventListener('pointerup', (e) => {
        if (!swiping) return;
        const dx = e.clientX - startX;
        if (Math.abs(dx) > 40) go(dx < 0 ? idx + 1 : idx - 1);
        swiping = false;
      });
      track.addEventListener('pointercancel', () => { swiping = false; });
      cards[0].classList.add('active');
      render();
    })();
  </script>
</body>
</html>`
}
