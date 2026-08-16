import { NextResponse } from "next/server"
import { requireGtmAuth } from "@/lib/gtm/content-types"
import { buildUserMessage, systemPrompt } from "@/lib/gtm/builder-prompts"

export async function POST(request: Request) {
  // Gated: spends Anthropic tokens. It used to be open to anyone who found the URL.
  if (!(await requireGtmAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { solution, vertical, motion, contentType, persona, additionalContext, competitor } = body

    if (!solution || !motion || !contentType) {
      return NextResponse.json(
        { error: "Missing required fields." },
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

    // Fleet convention (STRUCTURE.md §4): the model is CLAUDE_MODEL, not a
    // hardcoded ID. This route used to pin a retired Sonnet 4 snapshot, which
    // returned not_found once that model was deprecated for the account.
    const MODEL = process.env.CLAUDE_MODEL || "claude-sonnet-5"

    const userMessage = buildUserMessage({
      solution,
      vertical,
      motion,
      contentType,
      persona,
      additionalContext,
      competitor,
    })

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
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
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
    const text =
      data.content?.[0]?.type === "text" ? data.content[0].text : ""

    return NextResponse.json({ content: text })
  } catch (err) {
    console.error("GTM generate error:", err)
    return NextResponse.json(
      { error: "Generation failed. Please try again." },
      { status: 500 }
    )
  }
}
