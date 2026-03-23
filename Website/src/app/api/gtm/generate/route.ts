import { NextResponse } from "next/server"
import { buildUserMessage, systemPrompt } from "@/lib/gtm/builder-prompts"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { solution, vertical, motion, contentType, additionalContext, competitor } = body

    if (!solution || !motion || !contentType) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      )
    }

    const apiKey = process.env.GTM_ANTHROPIC_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "Generation is not configured." },
        { status: 500 }
      )
    }

    const userMessage = buildUserMessage({
      solution,
      vertical,
      motion,
      contentType,
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
        model: "claude-sonnet-4-20250514",
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
