import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { put } from "@vercel/blob"
import { kv } from "@/lib/gtm/kv-store"
import { stripEmDashes } from "@/lib/gtm/sanitize"
import { assetBlobPath, assetKvKey, assetFilename } from "@/lib/gtm/asset-helpers"
import { paletteFor, isPillarId } from "@/lib/gtm/pillar-palettes"
import { findTemplate, loadTemplateHtml, renderTemplate, DEFAULT_CTA_ICON } from "@/lib/gtm/templates/render"
import { requireGtmAuth } from "@/lib/gtm/content-types"
import { parseRenderMedia, filterSlots, parseHiddenCards } from "@/lib/gtm/render-media"
import { solutionGuidance } from "@/lib/gtm/builder-prompts"

/**
 * Extract the LinkedIn slice from a ContentBuilder multi-platform brief.
 * See fill-template/route.ts for the rationale — the same shape applies
 * here since the carousel is fed the same brief.
 */
function extractLinkedInBrief(brief: string): string {
  const m = brief.match(/---\s*LINKEDIN\s*---([\s\S]*?)(?=---\s*(?:INSTAGRAM|TWITTER)\s*---|$)/i)
  const slice = m?.[1]?.trim()
  return slice && slice.length > 40 ? slice : brief
}

const BLOB_TOKEN = process.env.GTM_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN || ""
const ASSET_TYPE = "carousel"
const CARD_COUNT = 6

const isSafe = (v: string) => /^[a-zA-Z0-9_-]+$/.test(v)

/**
 * Whitelist of templates eligible for carousel rendering. Carousels read
 * best as a stack of 1:1 cards, so we only allow square templates.
 * Picker UI (AssetPanel) filters to the same set.
 */
const ALLOWED_TEMPLATES = new Set<string>([
  "bold-stat-1x1",
  "headline-quote-11",
  "rox-report-11",
  "solution-feature-11",
  "wide-banner-11",
])

/**
 * POST /api/gtm/fill-carousel
 *
 * Body: { templateId, pillar, briefText, itemId, cards?, bgImage?, bgOpacity?,
 *         hidden? }
 *
 * `hidden` is per card: an array of exactly 6 arrays of manifest slot keys.
 * Each card's keys render empty and get a display:none rule on that card
 * only, so one card can drop a slot the others keep.
 *
 * Generates a 6-card carousel using one social-post template, where each
 * card is a distinct slot-fill of the same template. One Claude call
 * returns an array of 6 slot objects; each is rendered against the
 * template HTML and persisted to its own blob path. A swipeable shell
 * HTML wrapping 6 iframes (one per card) is persisted at the carousel
 * asset path and returned as the proxy URL.
 *
 * Storage layout (assetType="carousel"):
 *   <pillar>-carousel-<itemId>.html        (shell, what the iframe loads)
 *   <pillar>-carousel-<itemId>_c1.html ... _c6.html (the 6 rendered cards)
 */
export async function POST(request: Request) {
  if (!(await requireGtmAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { templateId, pillar, briefText, itemId, cards: cardsOverride, bgImage, bgOpacity, hidden: hiddenInput } = body ?? {}

    // ─── Validation ─────────────────────────────────────────────────────
    if (!templateId || !pillar || !briefText) {
      return NextResponse.json(
        { error: "Missing templateId, pillar, or briefText" },
        { status: 400 }
      )
    }
    if (!isSafe(templateId)) {
      return NextResponse.json({ error: "Invalid templateId format" }, { status: 400 })
    }
    if (!ALLOWED_TEMPLATES.has(templateId)) {
      return NextResponse.json(
        { error: `Template ${templateId} is not eligible for carousel. Use a 1:1 template.` },
        { status: 400 }
      )
    }
    if (!isPillarId(pillar)) {
      return NextResponse.json({ error: "Invalid pillar" }, { status: 400 })
    }
    if (itemId && !isSafe(itemId)) {
      return NextResponse.json({ error: "Invalid itemId format" }, { status: 400 })
    }
    if (typeof briefText !== "string" || briefText.length < 20) {
      return NextResponse.json({ error: "briefText must be at least 20 characters" }, { status: 400 })
    }

    // Templates live under social-post on disk (the template family); the
    // carousel namespace is used only for storage of the rendered output.
    const manifest = findTemplate("social-post", templateId)
    if (!manifest) {
      return NextResponse.json({ error: `Template not found: ${templateId}` }, { status: 404 })
    }
    const templateHtml = await loadTemplateHtml("social-post", templateId)
    if (!templateHtml) {
      return NextResponse.json({ error: "Template HTML missing on disk" }, { status: 500 })
    }

    const mediaParse = parseRenderMedia({ bgImage, bgOpacity })
    if (!mediaParse.ok) {
      return NextResponse.json({ error: mediaParse.error }, { status: 400 })
    }
    const media = mediaParse.media

    // Per-card hidden slot keys. A wrong shape degrades to 6 empty arrays
    // rather than an error, so hidden can never desynchronise from cards.
    const hidden = parseHiddenCards(hiddenInput, manifest.slots, CARD_COUNT)

    const overridden = cardsOverride !== undefined && cardsOverride !== null
    let cards: Record<string, string>[]
    if (!overridden) {
      const apiKey = process.env.ANTHROPIC_API_KEY
      if (!apiKey) {
        return NextResponse.json(
          { error: "Generation is not configured. No API key found." },
          { status: 500 }
        )
      }

      // ─── Build prompt asking for 6 slot-fill variants in one call ───────
      // Icon slots hold an editor-chosen icon id, not copy - keep them out
      // of the prompt so Claude never sees or invents a value.
      const slotSpec = manifest.slots
        .filter((s) => s.kind !== "icon")
        .map((s) => `- "${s.key}" (${s.kind}, max ${s.maxChars} chars): ${s.label}. Example: ${s.example}`)
        .join("\n")

      // Pillar-specific reorientation. Prepended so Claude anchors the six
      // cards in the right domain (trade shows vs recruiting vs field sales,
      // etc.) BEFORE brand-voice rules and the brief. Without this the six
      // cards collapse to a generic "engagement" narrative.
      const guidance = solutionGuidance[pillar] || ""
      // Ground the fill in the LinkedIn slice of the multi-platform brief.
      const focusedBrief = extractLinkedInBrief(briefText).slice(0, 2400)

      const userPrompt = `You are writing copy for a Momentify ${manifest.aspectRatio} carousel of ${CARD_COUNT} swipeable cards. Each card is one instance of the template "${manifest.label}" (${manifest.description}).

Pillar palette: ${pillar}

${guidance ? `${guidance}\n\n` : ""}BRAND VOICE RULES (non-negotiable):
- Momentify is an in-person engagement operating system (ROX framework). Confident, evidence-first, sharp cadence.
- Use hyphens (-), commas, or periods. NEVER use em-dashes or en-dashes.
- CTAs must be action-oriented and low-friction: "Book a ROX Audit", "See a Demo", "Reserve a Spot". NEVER "Sign up", "Subscribe", "Buy now".
- Speak to the buyer the guidance block above named. Do not drift into a different pillar's vocabulary.
- Respect every slot's maxChars. Going over breaks the layout.
- Prefer copy whose word count divides evenly into 2-4 visual lines; vary word lengths so wrapping looks balanced.

BRIEF (context, not verbatim copy):
${focusedBrief}

TASK:
Produce ${CARD_COUNT} DISTINCT cards that read as ONE story arc, not six unrelated posts. Structure:
- Card 1 = hook (a sharp observation, question, or contrarian take that stops the scroll)
- Cards 2-4 = the argument (each card advances the point with a new angle, proof, contrast, or mechanism — never restates the previous card)
- Card 5 = the turn (name the outcome, quantify the win, cite a proof point from the brief)
- Card 6 = the CTA (one action, low-friction, on-brand from the CTA list above)
Every card must move the reader forward. If a card could be swapped with an earlier one without confusion, rewrite it.

DATA DISCIPLINE — read this before you invent numbers:
- Use ONLY statistics that appear in the BRIEF above, or the signature Momentify proof points: $50B measured, 10,000+ engagements tracked, 65%+ ROX lift, $411M influenced pipeline, 92% platform utilization. Never fabricate percentages, dollar amounts, headcounts, or timeframes.
- If the template asks for more stats than the brief supplies, RECAST the same evidence a new way (comparison, ratio, before/after, per-unit) rather than making up new ones.
- If a stat slot has no honest value, use a descriptive label instead of a fake number. Cards without contrived precision are more credible than cards with invented stats.

SLOTS PER CARD (return each card as a JSON object with these EXACT keys):
${slotSpec}

Return ONLY a JSON object of the shape: {"cards": [<card1>, <card2>, ..., <card${CARD_COUNT}>]}. No markdown fencing, no commentary, no prose wrapping. Exactly ${CARD_COUNT} entries in the cards array.`

      // ─── Call Claude ────────────────────────────────────────────────────
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
          max_tokens: 3000, // 6 cards * ~400 chars JSON each, with margin
          messages: [{ role: "user", content: userPrompt }],
        }),
      })

      if (!response.ok) {
        const err = await response.text().catch(() => "")
        console.error("[fill-carousel] Anthropic error", err)
        let detail: string | undefined
        try { detail = JSON.parse(err)?.error?.message } catch { /* ignore */ }
        return NextResponse.json(
          { error: detail || "Carousel fill failed. Please try again." },
          { status: response.status === 401 ? 401 : 500 }
        )
      }

      const data = await response.json()
      const rawText = (data.content?.find((b: { type?: string; text?: string }) => b.type === "text")?.text) ?? ""
      if (!rawText) {
        return NextResponse.json({ error: "Empty response from Claude" }, { status: 500 })
      }

      // ─── Parse + normalize cards ────────────────────────────────────────
      const fenced = rawText.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/)
      const jsonText = (fenced ? fenced[1] : rawText).trim()

      try {
        const parsed = JSON.parse(jsonText)
        if (!parsed || typeof parsed !== "object") throw new Error("expected object")
        const arr = Array.isArray(parsed?.cards) ? parsed.cards : null
        if (!arr || arr.length !== CARD_COUNT) {
          throw new Error(`expected cards array of length ${CARD_COUNT}, got ${arr ? arr.length : "n/a"}`)
        }
        // Per-slot maxChars enforcement. Same rationale as fill-template:
        // a slot longer than the manifest allows silently breaks the CSS-
        // fixed layout; trim on a word boundary when possible.
        const maxByKey = new Map(manifest.slots.map((s) => [s.key, s.maxChars]))
        const truncateSlot = (cardIdx: number, key: string, val: string): string => {
          const max = maxByKey.get(key)
          if (!max || val.length <= max) return val
          const soft = val.slice(0, max + 1)
          const lastSpace = soft.lastIndexOf(" ")
          const cut = lastSpace >= Math.floor(max * 0.7) ? soft.slice(0, lastSpace) : val.slice(0, max)
          console.warn(`[fill-carousel] card ${cardIdx + 1} truncated ${key} from ${val.length} to ${cut.length} chars (maxChars=${max})`)
          return cut
        }
        cards = arr.map((card: unknown, i: number) => {
          if (!card || typeof card !== "object" || Array.isArray(card)) {
            throw new Error("each card must be a JSON object")
          }
          const out: Record<string, string> = {}
          for (const [k, v] of Object.entries(card as Record<string, unknown>)) {
            if (!maxByKey.has(k)) continue
            const raw = typeof v === "string" ? v : v === undefined || v === null ? "" : String(v)
            out[k] = truncateSlot(i, k, stripEmDashes(raw))
          }
          for (const s of manifest.slots) {
            // Icon slots are never asked of Claude - seed the default.
            if (s.kind === "icon" && !out[s.key]) out[s.key] = DEFAULT_CTA_ICON
            if (!(s.key in out)) console.warn(`[fill-carousel] card ${i + 1} missing slot: ${s.key}`)
          }
          return out
        })
      } catch (e) {
        console.error("[fill-carousel] JSON parse failed", e, rawText.slice(0, 500))
        return NextResponse.json(
          { error: "Claude returned invalid JSON. Try regenerating." },
          { status: 502 }
        )
      }
    } else {
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
    }

    // ─── Render + persist 6 cards ───────────────────────────────────────
    const palette = paletteFor(pillar)
    const baseItemId = itemId || `c-${Date.now().toString(36)}`

    const cardUrls: string[] = []
    for (let i = 0; i < CARD_COUNT; i++) {
      const cardItemId = `${baseItemId}_c${i + 1}`
      const cardHtml = renderTemplate(templateHtml, cards[i], palette, media, hidden[i])
      const cardBlobPath = assetBlobPath(pillar, ASSET_TYPE, cardItemId)
      if (!cardBlobPath) {
        return NextResponse.json({ error: `Could not build blob path for card ${i + 1}` }, { status: 500 })
      }
      const cardUrl = await persistHtml(cardBlobPath, cardHtml, pillar, ASSET_TYPE, cardItemId)
      cardUrls.push(cardUrl)
    }

    // ─── Build + persist the carousel shell ─────────────────────────────
    const shellHtml = buildCarouselShell(cardUrls, palette)
    const shellBlobPath = assetBlobPath(pillar, ASSET_TYPE, baseItemId)
    if (!shellBlobPath) {
      return NextResponse.json({ error: "Could not build shell blob path" }, { status: 500 })
    }
    const shellBlobUrl = await persistHtml(shellBlobPath, shellHtml, pillar, ASSET_TYPE, baseItemId)

    // Cache the shell URL + templateId in KV so reload finds it.
    try {
      const baseKey = assetKvKey(pillar, ASSET_TYPE, baseItemId)
      await Promise.all([
        kv.set(baseKey, shellBlobUrl),
        kv.set(`${baseKey}:template`, templateId),
        // Cache the per-card URLs so the zip-download endpoint can pull
        // each card without re-running Claude.
        kv.set(`${baseKey}:cards`, JSON.stringify(cardUrls)),
        // Cache the raw filtered card slot values, so a restored carousel
        // can populate the slot editor + media re-render.
        kv.set(`${baseKey}:slots`, JSON.stringify(cards)),
        // ...and which slots each card hides, so the toggles restore too.
        kv.set(`${baseKey}:hidden`, JSON.stringify(hidden)),
      ])
    } catch {
      /* KV cache is best-effort */
    }

    const proxyUrl = shellBlobUrl.startsWith("http")
      ? `/api/gtm/asset-preview?solution=${encodeURIComponent(pillar)}&assetType=${encodeURIComponent(ASSET_TYPE)}&itemId=${encodeURIComponent(baseItemId)}`
      : shellBlobUrl

    return NextResponse.json({
      success: true,
      url: proxyUrl,
      filename: assetFilename(pillar, ASSET_TYPE, baseItemId),
      templateId,
      cardCount: CARD_COUNT,
      cards,
      hidden,
    })
  } catch (error) {
    console.error("[fill-carousel] error", error)
    return NextResponse.json({ error: "Failed to build carousel" }, { status: 500 })
  }
}

/**
 * Persist an HTML string to Vercel Blob, with a local-fs fallback for
 * dev environments that don't have BLOB_READ_WRITE_TOKEN configured.
 * Mirrors the pattern used by /api/gtm/fill-template.
 */
async function persistHtml(
  blobPath: string,
  html: string,
  pillar: string,
  assetType: string,
  itemId: string
): Promise<string> {
  try {
    const blob = await put(blobPath, html, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "text/html; charset=utf-8",
      token: BLOB_TOKEN || undefined,
    })
    return blob.url
  } catch (blobErr) {
    console.error("[fill-carousel] blob put failed, falling back to public/gtm", blobErr)
    const dir = path.join(process.cwd(), "public/gtm")
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    const filename = assetFilename(pillar, assetType, itemId)
    fs.writeFileSync(path.join(dir, filename), html, "utf-8")
    return `/gtm/${filename}`
  }
}

/**
 * Build the swipeable carousel shell HTML. Each card is loaded in its own
 * iframe so the templates' full-viewport styling stays self-contained and
 * doesn't collide with sibling cards. Vanilla JS handles prev/next, dots,
 * keyboard, and pointer/touch swipe.
 */
function buildCarouselShell(cardUrls: string[], palette: { primary: string; light: string; dark: string; heroGrad: string }): string {
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
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { width: 100%; height: 100%; background: #06060f; overflow: hidden; font-family: 'Inter', system-ui, sans-serif; color: #fff; }
    .stage { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; padding: 24px 64px; }
    .track { position: relative; aspect-ratio: 1 / 1; max-height: 100%; max-width: 100%; width: min(540px, 100%); overflow: hidden; border-radius: 14px; box-shadow: 0 30px 80px rgba(0,0,0,0.45); background: #000; }
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
      .stage { padding: 12px 48px; }
      .nav.prev { left: 6px; }
      .nav.next { right: 6px; }
    }
  </style>
</head>
<body>
  <div class="stage">
    <div class="track" id="track">
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

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;")
}
