import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { put } from "@vercel/blob"
import { kv } from "@/lib/gtm/kv-store"
import { stripEmDashes } from "@/lib/gtm/sanitize"
import { assetBlobPath, assetKvKey } from "@/lib/gtm/asset-helpers"
import { paletteFor, isPillarId } from "@/lib/gtm/pillar-palettes"
import { findTemplate, loadTemplateHtml, renderTemplate } from "@/lib/gtm/templates/render"
import { requireGtmAuth } from "@/lib/gtm/content-types"

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
    const { templateId, assetType, pillar, briefText, itemId } = body ?? {}

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

    const apiKey = process.env.GTM_ANTHROPIC_KEY || process.env.ANTHROPIC_API_KEY
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

BRIEF (use this as context, not verbatim copy):
${briefText.slice(0, 2400)}

SLOTS TO FILL (return JSON with these EXACT keys):
${slotSpec}

Return ONLY a JSON object with the slot keys above. No markdown fencing, no commentary, no prose wrapping. Example: {"LABEL": "...", "STAT": "..."}`

    // ─── Call Claude ─────────────────────────────────────────────────
    const MODEL = process.env.CLAUDE_MODEL || "claude-sonnet-4-5"
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
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
    const rawText = data.content?.[0]?.type === "text" ? data.content[0].text : ""
    if (!rawText) {
      return NextResponse.json({ error: "Empty response from Claude" }, { status: 500 })
    }

    // ─── Parse slot JSON ─────────────────────────────────────────────
    // Strip code fences if Claude wrapped despite instructions.
    const fenced = rawText.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/)
    const jsonText = (fenced ? fenced[1] : rawText).trim()

    let slots: Record<string, string>
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

    // ─── Render + persist ────────────────────────────────────────────
    const palette = paletteFor(pillar)
    const renderedHtml = renderTemplate(html, slots, palette)

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
    try {
      const baseKey = assetKvKey(pillar, assetType, itemId)
      await Promise.all([
        kv.set(baseKey, blobUrl),
        kv.set(`${baseKey}:template`, templateId),
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
    })
  } catch (error) {
    console.error("[fill-template] error", error)
    return NextResponse.json({ error: "Failed to fill template" }, { status: 500 })
  }
}
