import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { put } from "@vercel/blob"
import { kv } from "@vercel/kv"
import { assetBlobPath, assetKvKey } from "@/lib/gtm/asset-helpers"

const BLOB_TOKEN = process.env.GTM_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN || ""

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

    const apiKey = process.env.GTM_ANTHROPIC_KEY || process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      console.error(
        "Missing API key. GTM_ANTHROPIC_KEY:",
        !!process.env.GTM_ANTHROPIC_KEY,
        "ANTHROPIC_API_KEY:",
        !!process.env.ANTHROPIC_API_KEY
      )
      return NextResponse.json(
        { error: "Generation is not configured. No API key found." },
        { status: 500 }
      )
    }

    // Fix #3: Hardcoded model name - use environment variable with fallback
    const MODEL = process.env.CLAUDE_MODEL || "claude-opus-4-1"

    const prompt = assetPrompts[assetType](brief, solution)

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 4096,
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

    const content = data.content[0]
    if (content.type !== "text") {
      return NextResponse.json(
        { error: "Expected text response from Claude" },
        { status: 500 }
      )
    }

    const htmlContent: string = content.text

    // Fix #5: Weak HTML validation - upgrade validation checks
    if (!htmlContent.includes("<!DOCTYPE") && !htmlContent.includes("<html")) {
      return NextResponse.json(
        { error: "Invalid HTML: missing DOCTYPE or html tag" },
        { status: 400 }
      )
    }
    if (!htmlContent.includes("</html>")) {
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
