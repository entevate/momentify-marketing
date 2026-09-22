import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { put } from "@vercel/blob"
import { kv } from "@/lib/gtm/kv-store"
import { stripEmDashes } from "@/lib/gtm/sanitize"
import { plainLength, truncateVisible } from "@/lib/gtm/rich-text"
import { assetBlobPath, assetKvKey } from "@/lib/gtm/asset-helpers"
import { paletteFor, isPillarId } from "@/lib/gtm/pillar-palettes"
import { findTemplate, loadTemplateHtml, renderTemplate, DEFAULT_CTA_ICON } from "@/lib/gtm/templates/render"
import { requireGtmAuth } from "@/lib/gtm/content-types"
import { parseRenderMedia, filterSlots, parseHidden } from "@/lib/gtm/render-media"
import { solutionGuidance } from "@/lib/gtm/builder-prompts"

/**
 * The social-post brief that ContentBuilder saves ships three platform
 * sections concatenated with `---LINKEDIN---`, `---INSTAGRAM---`, and
 * `---TWITTER---` markers. A single social-post graphic is almost always
 * LinkedIn-shaped (long-form professional voice, headline + subhead
 * pattern), so grounding the fill in the LinkedIn slice removes tone
 * ambiguity. Fallback: if the brief has no markers (e.g. a legacy save
 * or a fresh manual paste) we use the whole thing.
 */
function extractLinkedInBrief(brief: string): string {
  const m = brief.match(/---\s*LINKEDIN\s*---([\s\S]*?)(?=---\s*(?:INSTAGRAM|TWITTER)\s*---|$)/i)
  const slice = m?.[1]?.trim()
  return slice && slice.length > 40 ? slice : brief
}

const BLOB_TOKEN = process.env.GTM_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN || ""

const isSafe = (v: string) => /^[a-zA-Z0-9_-]+$/.test(v)

/**
 * POST /api/gtm/fill-template
 *
 * Body: {
 *   templateId: string      // e.g. "bold-stat-1x1"
 *   assetType:  string      // currently always "social-post"
 *   pillar:     PillarId    // trade-shows | recruiting | field-sales | facilities | events-venues
 *   briefText:  string      // the saved Library brief - context for Claude
 *   itemId?:    string      // Library item id; scopes the rendered file so
 *                           // different items don't overwrite each other
 *   slots?:     Record<string,string>  // re-render with these values (skips Claude)
 *   bgImage?:   string      // data:image/(png|jpeg|webp);base64,… ≤ 4 MB
 *   bgOpacity?: number      // 0–100
 *   hidden?:    string[]    // manifest slot keys toggled off; they render
 *                           // empty and get a display:none rule
 * }
 *
 * Flow:
 *   1. Load template manifest + HTML from src/lib/gtm/templates/...
 *   2. Ask Claude for a JSON of slot values grounded in briefText (small,
 *      fast prompt - typically 5-10s)
 *   3. Render template HTML via pure string substitution (render helper)
 *   4. Persist rendered HTML to Vercel Blob at the shared asset path
 *   5. Cache the blob URL in KV so /api/gtm/asset-check finds it later
 *   6. Return the same-origin /api/gtm/asset-preview proxy URL so an
 *      iframe can render it inline (Vercel Blob forces .html downloads
 *      with strict CSP otherwise)
 */
export async function POST(request: Request) {
  if (!(await requireGtmAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { templateId, assetType, pillar, briefText, itemId, slots: slotsOverride, bgImage, bgOpacity, hidden: hiddenInput } = body ?? {}

    // ─── Validation ──────────────────────────────────────────────────
    if (!templateId || !assetType || !pillar || !briefText) {
      return NextResponse.json(
        { error: "Missing templateId, assetType, pillar, or briefText" },
        { status: 400 }
      )
    }
    if (!isSafe(templateId) || !isSafe(assetType)) {
      return NextResponse.json({ error: "Invalid templateId or assetType format" }, { status: 400 })
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

    const manifest = findTemplate(assetType, templateId)
    if (!manifest) {
      return NextResponse.json({ error: `Template not found: ${assetType}/${templateId}` }, { status: 404 })
    }

    const html = await loadTemplateHtml(assetType, templateId)
    if (!html) {
      return NextResponse.json({ error: "Template HTML missing on disk" }, { status: 500 })
    }

    const mediaParse = parseRenderMedia({ bgImage, bgOpacity })
    if (!mediaParse.ok) {
      return NextResponse.json({ error: mediaParse.error }, { status: 400 })
    }
    const media = mediaParse.media

    // Slot keys toggled off in the editor. Filtered to the manifest's own
    // keys, so a rendered style tag can only ever name a real slot.
    const hidden = parseHidden(hiddenInput, manifest.slots)

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
      // Icon slots hold an icon id chosen in the editor, not copy - keep
      // them out of the prompt so Claude never sees or invents a value.
      const slotSpec = manifest.slots
        .filter((s) => s.kind !== "icon")
        .map((s) => `- "${s.key}" (${s.kind}, max ${s.maxChars} chars): ${s.label}. Example: ${s.example}`)
        .join("\n")

      // Pillar-specific reorientation. Prepended so Claude fixes the domain
      // (trade shows vs recruiting vs field sales, etc.) BEFORE it sees the
      // brand-voice rules and the brief. Without this the fill leans on
      // whatever trade-show flavored slot examples happen to be in the
      // manifest and produces off-domain copy.
      const guidance = solutionGuidance[pillar] || ""

      // Ground the fill in the LinkedIn slice of the brief when the brief
      // is the ContentBuilder's ---PLATFORM--- multi-section output. A
      // single social-post graphic maps to LinkedIn's voice cleanest, and
      // fill quality collapses when Claude has to arbitrate between three
      // conflicting tones in one blob.
      const focusedBrief = extractLinkedInBrief(briefText).slice(0, 2400)

      const userPrompt = `You are writing copy for a Momentify ${manifest.aspectRatio} ${manifest.assetType} graphic.

Template: ${manifest.label}
Design intent: ${manifest.description}
Pillar palette: ${pillar}

${guidance ? `${guidance}\n\n` : ""}BRAND VOICE RULES (non-negotiable):
- Momentify is an in-person engagement operating system (ROX framework). Confident, evidence-first, sharp cadence.
- Use hyphens (-), commas, or periods. NEVER use em-dashes ( - ) or en-dashes (-).
- CTAs must be action-oriented and low-friction: "Book a ROX Audit", "See a Demo", "Reserve a Spot". NEVER "Sign up", "Subscribe", "Buy now".
- Speak to the buyer the guidance block above named. Do not drift into a different pillar's vocabulary.
- Respect every slot's maxChars. Going over breaks the layout.
- Prefer copy whose word count divides evenly into 2-4 visual lines; vary word lengths so wrapping looks balanced.
- DATA DISCIPLINE: any stat slot must use a number from the BRIEF or from Momentify's signature proof points ($50B measured, 10,000+ engagements, 65%+ ROX lift, $411M influenced pipeline, 92% utilization). Never fabricate percentages, dollar amounts, headcounts, or timeframes. If no honest number fits, use a descriptive label instead.

BRIEF (context, not verbatim copy):
${focusedBrief}

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
        // Per-slot maxChars enforcement, counted in VISIBLE characters
        // (rich-text markers ride free). Trim on a word boundary when
        // possible so a truncated headline doesn't end mid-word; fall
        // back to a hard slice if there's no whitespace to break at.
        // The layout is CSS-fixed for the manifest maxChars — silent
        // overflow was the audit's finding #8, producing cropped/broken
        // graphics with no signal.
        const maxByKey = new Map(manifest.slots.map((s) => [s.key, s.maxChars]))
        const truncate = (key: string, val: string): string => {
          const max = maxByKey.get(key)
          if (!max || plainLength(val) <= max) return val
          const soft = truncateVisible(val, max + 1)
          const lastSpace = soft.lastIndexOf(" ")
          // Measure the word boundary in VISIBLE characters so a rich-text
          // marker in the copy can't shift where the break lands - with no
          // markers this is the same index the old .slice used.
          const visibleBeforeSpace = lastSpace < 0 ? -1 : plainLength(soft.slice(0, lastSpace))
          const cut =
            visibleBeforeSpace >= Math.floor(max * 0.7)
              ? truncateVisible(val, visibleBeforeSpace)
              : truncateVisible(val, max)
          console.warn(`[fill-template] truncated ${key} from ${plainLength(val)} to ${plainLength(cut)} visible chars (maxChars=${max})`)
          return cut
        }

        // Coerce all values to strings, strip em-dashes, enforce maxChars.
        slots = {}
        for (const [k, v] of Object.entries(parsed)) {
          if (!maxByKey.has(k)) continue  // ignore keys the manifest doesn't declare
          const raw = typeof v === "string" ? v : v === undefined || v === null ? "" : String(v)
          slots[k] = truncate(k, stripEmDashes(raw))
        }
        // Icon slots are never asked of Claude - seed the default so the
        // first render carries an icon and the editor's select has a value.
        for (const s of manifest.slots) {
          if (s.kind === "icon" && !slots[s.key]) slots[s.key] = DEFAULT_CTA_ICON
        }
        // Warn on missing slots — they'll render blank, which is layout-broken.
        for (const s of manifest.slots) {
          if (!(s.key in slots)) console.warn(`[fill-template] missing slot from Claude: ${s.key}`)
        }
      } catch (e) {
        console.error("[fill-template] JSON parse failed", e, rawText.slice(0, 300))
        return NextResponse.json(
          { error: "Claude returned invalid JSON. Try regenerating." },
          { status: 502 }
        )
      }
    }

    // ─── Render + persist ────────────────────────────────────────────
    const palette = paletteFor(pillar)
    const renderedHtml = renderTemplate(html, slots, palette, media, hidden)

    const blobPath = assetBlobPath(pillar, assetType, itemId)
    if (!blobPath) {
      return NextResponse.json({ error: "Could not build asset blob path" }, { status: 400 })
    }
    const filename = itemId ? `${pillar}-${assetType}-${itemId}.html` : `${pillar}-${assetType}.html`

    let blobUrl: string
    try {
      const blob = await put(blobPath, renderedHtml, {
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: "text/html; charset=utf-8",
        token: BLOB_TOKEN || undefined,
      })
      blobUrl = blob.url
    } catch (blobErr) {
      // Local-dev fallback: write to public/gtm if blob isn't configured.
      console.error("[fill-template] blob put failed, trying local fs fallback", blobErr)
      try {
        const dir = path.join(process.cwd(), "public/gtm")
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
        fs.writeFileSync(path.join(dir, filename), renderedHtml, "utf-8")
        blobUrl = `/gtm/${filename}`
      } catch (fsErr) {
        console.error("[fill-template] fs fallback failed", fsErr)
        return NextResponse.json(
          { error: "Could not persist rendered HTML. Configure BLOB_READ_WRITE_TOKEN." },
          { status: 500 }
        )
      }
    }

    // Cache the raw blob URL AND the templateId used, so the preview
    // iframe can restore aspect-ratio sizing on reload. Key pattern:
    //   <assetKvKey>           = blob URL (existing)
    //   <assetKvKey>:template  = templateId (new)
    //   <assetKvKey>:slots     = raw filtered slots, so a restored graphic
    //                            can populate the slot editor + re-render
    //   <assetKvKey>:hidden    = the hidden slot keys, so the editor's
    //                            toggles restore in the same state
    try {
      const baseKey = assetKvKey(pillar, assetType, itemId)
      await Promise.all([
        kv.set(baseKey, blobUrl),
        kv.set(`${baseKey}:template`, templateId),
        kv.set(`${baseKey}:slots`, JSON.stringify(slots)),
        kv.set(`${baseKey}:hidden`, JSON.stringify(hidden)),
      ])
    } catch {
      /* KV cache is best-effort */
    }

    // Always return the proxy URL so the iframe can render inline.
    const proxyUrl = blobUrl.startsWith("http")
      ? `/api/gtm/asset-preview?solution=${encodeURIComponent(pillar)}&assetType=${encodeURIComponent(assetType)}${itemId ? `&itemId=${encodeURIComponent(itemId)}` : ""}`
      : blobUrl

    return NextResponse.json({
      success: true,
      url: proxyUrl,
      filename,
      templateId,
      slots,
      hidden,
    })
  } catch (error) {
    console.error("[fill-template] error", error)
    return NextResponse.json({ error: "Failed to fill template" }, { status: 500 })
  }
}
