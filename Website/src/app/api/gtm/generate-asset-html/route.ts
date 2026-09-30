import { NextResponse } from "next/server"
import { requireGtmAuth } from "@/lib/gtm/content-types"
import fs from "fs"
import path from "path"
import { put } from "@vercel/blob"
import { kv } from "@/lib/gtm/kv-store"
import { assetBlobPath, assetKvKey } from "@/lib/gtm/asset-helpers"

const BLOB_TOKEN = process.env.GTM_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN || ""

export const runtime = "nodejs"
// A full page takes 1-3 minutes to generate; the platform default is too short.
export const maxDuration = 300

// A self-contained page with inline CSS runs 6-10k tokens. The old 4096 cap
// cut every infographic off before </html>.
const MAX_OUTPUT_TOKENS = 16000

// Claude cannot open the reference files the prompts name, and tends to wrap
// its reply in a code fence or a sentence of preamble.
const OUTPUT_CONTRACT = `

OUTPUT RULES:
- Reply with the complete HTML document only. Start with <!DOCTYPE html> and end with </html>.
- No markdown code fences and no commentary before or after the document.
- You cannot open the reference files named above; follow the structure described instead.
- Keep the CSS compact so the whole document fits in one reply.`

/** The document itself, without any code fence or prose around it. Null when it has no start or no </html>. */
function extractHtmlDocument(text: string): string | null {
  const lower = text.toLowerCase()
  const doctype = lower.indexOf("<!doctype")
  const start = doctype >= 0 ? doctype : lower.indexOf("<html")
  const end = lower.lastIndexOf("</html>")
  if (start < 0 || end < start) return null
  return text.slice(start, end + "</html>".length)
}

// Parameter sanitization: solution/assetType must be safe for filesystem + URLs
const isValidParameter = (param: string): boolean => /^[a-zA-Z0-9_-]+$/.test(param)

const assetPrompts: Record<string, (brief: string, solution: string) => string> = {
  infographic: (brief, solution) => `Build an infographic HTML page at Brand/gtm/${solution}-infographic.html using the rox-infographic.html reference implementation at Brand/rox-infographic.html. Follow the same structure: self-contained HTML, inline CSS, no build tools. Use the brand tokens from the brief below. Render as a single-page infographic with all sections (title, eyebrow, headline, subhead, gauge section, categories grid, footer CTA) laid out vertically.\n\nHere is the generated brief:\n\n${brief}`,

  microsite: (brief, solution) => `Build a microsite HTML page at Brand/gtm/${solution}-microsite.html using the panelmatic.html reference implementation at Brand/gtm/panelmatic.html. Follow the same structure: self-contained HTML, inline CSS, no build tools. Use the brand tokens from the brief below. Include all sections (Hero, Problem, Approach, Proof, How It Works, CTA + Form). Add scroll-reveal animations and responsive mobile styles.\n\nHere is the generated brief:\n\n${brief}`,

  carousel: (brief, solution) => `Build a carousel HTML page at Brand/gtm/${solution}-carousel.html with exactly 6 swipeable cards in a horizontal scrolling carousel. Create self-contained HTML with inline CSS and vanilla JavaScript for carousel functionality. Extract 6 distinct tips, insights, or content blocks from the brief below and create one card for each. Each card must have: a headline (max 8 words), description (2-3 sentences), and an icon or visual element. Use the solution's brand colors and tokens from the brief below. Implement working prev/next buttons and indicator dots. Make it responsive and mobile-optimized with smooth scrolling.\n\nREQUIREMENT: Render all 6 cards visibly in the HTML with proper carousel JavaScript that allows users to navigate between them. Do NOT hide cards - they must be accessible via carousel navigation.\n\nHere is the generated brief:\n\n${brief}`,

  "pitch-deck": (brief, solution) => `Build a pitch deck HTML page at Brand/gtm/${solution}-pitch-deck.html with 8 slides in 16:9 aspect ratio. Create self-contained HTML with inline CSS and vanilla JavaScript for slide navigation. Use the solution's brand colors and tokens from the brief below. Each slide should be a full-page section with branded header, content, and footer. Make it presentation-ready with keyboard navigation.\n\nHere is the generated brief:\n\n${brief}`,

  "one-pager": (brief, solution) => `Build a one-pager HTML page at Brand/gtm/${solution}-one-pager.html as a single-page sales leave-behind. Create self-contained HTML with inline CSS. Use the solution's brand colors and tokens from the brief below. Include sections for headline, value prop, 3-4 key benefits, social proof, and CTA. Optimize for printing and screen viewing.\n\nHere is the generated brief:\n\n${brief}`,
}

export async function POST(request: Request) {
  // Gated: spends Anthropic tokens. It used to be open to anyone who found the URL.
  if (!(await requireGtmAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { brief, assetType, solution } = await request.json()

    if (!brief || !assetType || !solution) {
      return NextResponse.json(
        { error: "Missing brief, assetType, or solution" },
        { status: 400 }
      )
    }

    // Fix #1: Path traversal vulnerability - sanitize parameters
    if (!isValidParameter(solution) || !isValidParameter(assetType)) {
      return NextResponse.json(
        { error: "Invalid solution or assetType format" },
        { status: 400 }
      )
    }

    if (!assetPrompts[assetType]) {
      return NextResponse.json(
        { error: "Unsupported asset type" },
        { status: 400 }
      )
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      console.error("Missing API key. ANTHROPIC_API_KEY is not set.")
      return NextResponse.json(
        { error: "Generation is not configured. No API key found." },
        { status: 500 }
      )
    }

    // Fix #3: Hardcoded model name - use environment variable with fallback
    const MODEL = process.env.CLAUDE_MODEL || "claude-sonnet-5"

    const prompt = assetPrompts[assetType](brief, solution) + OUTPUT_CONTRACT

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
        max_tokens: MAX_OUTPUT_TOKENS,
        messages: [{ role: "user", content: prompt }],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error("Anthropic API error:", err)
      return NextResponse.json(
        { error: "Generation failed. Please try again." },
        { status: 500 }
      )
    }

    const data = await response.json()

    // Fix #4: Missing type guards - validate response structure
    if (!data.content || !Array.isArray(data.content) || !data.content.length) {
      return NextResponse.json(
        { error: "Empty response from Claude" },
        { status: 500 }
      )
    }

    const content = data.content?.find((b: { type?: string; text?: string }) => b.type === "text")
    if (!content) {
      return NextResponse.json(
        { error: "Expected text response from Claude" },
        { status: 500 }
      )
    }

    const rawText: string = content.text

    // Fix #5: Weak HTML validation - upgrade validation checks
    if (!rawText.includes("<!DOCTYPE") && !rawText.includes("<html")) {
      return NextResponse.json(
        { error: "Invalid HTML: missing DOCTYPE or html tag" },
        { status: 400 }
      )
    }
    const htmlContent = extractHtmlDocument(rawText)
    if (!htmlContent) {
      if (data.stop_reason === "max_tokens") {
        console.error(`[generate-asset-html] ${assetType} hit the ${MAX_OUTPUT_TOKENS}-token output cap`)
        return NextResponse.json(
          { error: "The page was too long to generate in one pass and was cut off. Shorten the brief and try again." },
          { status: 502 }
        )
      }
      return NextResponse.json(
        { error: "Invalid HTML: missing closing html tag" },
        { status: 400 }
      )
    }

    const filename = `${solution}-${assetType}.html`

    // Persist to Vercel Blob (Vercel's serverless FS is read-only, so writes
    // to public/gtm fail in prod). Deterministic path + addRandomSuffix:false
    // lets us regenerate in place, and we cache the resulting URL in KV.
    const blobPath = assetBlobPath(solution, assetType)
    let previewUrl: string
    if (blobPath) {
      try {
        const blob = await put(blobPath, htmlContent, {
          access: "public",
          addRandomSuffix: false,
          contentType: "text/html; charset=utf-8",
          token: BLOB_TOKEN || undefined,
        })
        previewUrl = blob.url

        // Cache the blob URL so asset-check can find it on page-load.
        try {
          await kv.set(assetKvKey(solution, assetType), previewUrl)
        } catch {
          /* KV cache is best-effort */
        }

        return NextResponse.json({
          success: true,
          url: previewUrl,
          filename,
        })
      } catch (blobErr) {
        // Local-dev fallback: when no BLOB_READ_WRITE_TOKEN is configured,
        // fall back to the filesystem so devs without blob setup still get a preview.
        console.error("[generate-asset-html] blob put failed, trying local fs fallback", blobErr)
      }
    }

    // Filesystem fallback (local dev only — Vercel prod has a read-only FS)
    const dir = path.join(process.cwd(), "public/gtm")
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    const filePath = path.join(dir, filename)
    fs.writeFileSync(filePath, htmlContent, "utf-8")

    // Fix #2: Hardcoded preview URL - return asset-type-specific URL
    previewUrl = `/${solution}-${assetType}.html`
    return NextResponse.json({
      success: true,
      url: previewUrl,
      filename,
    })
  } catch (error) {
    console.error("Error generating asset HTML:", error)
    return NextResponse.json(
      { error: "Failed to generate asset" },
      { status: 500 }
    )
  }
}
