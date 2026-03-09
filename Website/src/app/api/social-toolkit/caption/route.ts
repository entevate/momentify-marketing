import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { headline, subhead, bodyCopy, brand } = body;

    if (!headline && !subhead && !bodyCopy) {
      return NextResponse.json(
        { error: "At least one text field (headline, subhead, or body) is required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Caption generation is not configured. ANTHROPIC_API_KEY is missing." },
        { status: 500 }
      );
    }

    const systemPrompt = `You are a B2B content strategist writing LinkedIn posts for Momentify, a platform that measures in-person event engagement. Momentify's voice is direct, honest, and outcome-focused. No buzzwords. No filler. Write for event professionals, exhibitors, and enterprise marketers. Return ONLY valid JSON with two keys: "caption" (string) and "hashtags" (array of strings). No markdown, no preamble.`;

    const userPrompt = [
      headline ? `Headline: ${headline}` : "",
      subhead ? `Subhead: ${subhead}` : "",
      bodyCopy ? `Body: ${bodyCopy}` : "",
      brand ? `Brand context: ${brand}` : "",
      "",
      "Write a LinkedIn caption and hashtag set for this graphic.",
    ]
      .filter(Boolean)
      .join("\n");

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Anthropic API error:", response.status, errorText);
      return NextResponse.json(
        { error: "Failed to generate caption. Please try again." },
        { status: 500 }
      );
    }

    const data = await response.json();
    const textContent = data.content?.[0]?.text;

    if (!textContent) {
      return NextResponse.json(
        { error: "Empty response from caption generator." },
        { status: 500 }
      );
    }

    // Parse the JSON response from Claude
    const parsed = JSON.parse(textContent);

    return NextResponse.json({
      caption: parsed.caption || "",
      hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags : [],
    });
  } catch (error) {
    console.error("Caption generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate caption. Please try again." },
      { status: 500 }
    );
  }
}
