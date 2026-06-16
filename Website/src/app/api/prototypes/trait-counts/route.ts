/**
 * Trait selection counts — aggregate counter per (slug, stepId, value).
 *
 * Used by TraitSelectionStep to render a pinned "Most Selected" row showing
 * the most popular choices across all prior sessions. Empty until enough
 * sessions have submitted selections.
 *
 * POST { slug, stepId, values: string[] }       → increments each value by 1
 * GET  ?slug={slug}&stepId={stepId}              → returns { counts: Record<value, number> }
 */
import { NextRequest, NextResponse } from "next/server";
import { put, list } from "@vercel/blob";

const BLOB_NAME = "prototype-trait-counts.json";
const token = process.env.GTM_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN || "";

interface TraitCounts {
  // { [slug]: { [stepId]: { [value]: count } } }
  [slug: string]: { [stepId: string]: { [value: string]: number } };
}

async function readData(): Promise<TraitCounts> {
  try {
    const { blobs } = await list({ prefix: BLOB_NAME, token });
    if (blobs.length > 0) {
      const res = await fetch(blobs[0].url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) return await res.json();
    }
  } catch (e) {
    console.error("trait-counts read error:", e);
  }
  return {};
}

async function writeData(data: TraitCounts) {
  await put(BLOB_NAME, JSON.stringify(data), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    token,
  });
}

export async function POST(req: NextRequest) {
  let body: { slug?: string; stepId?: string; values?: string[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { slug, stepId, values } = body;
  if (!slug || !stepId || !Array.isArray(values) || values.length === 0) {
    return NextResponse.json({ error: "Missing slug, stepId, or values" }, { status: 400 });
  }
  if (!token) {
    return NextResponse.json({ error: "No storage token" }, { status: 500 });
  }

  try {
    const data = await readData();
    if (!data[slug]) data[slug] = {};
    if (!data[slug][stepId]) data[slug][stepId] = {};
    for (const v of values) {
      if (typeof v !== "string" || !v) continue;
      data[slug][stepId][v] = (data[slug][stepId][v] || 0) + 1;
    }
    await writeData(data);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("trait-counts write error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  const stepId = searchParams.get("stepId");
  if (!slug || !stepId) {
    return NextResponse.json({ error: "Missing slug or stepId" }, { status: 400 });
  }
  try {
    const data = await readData();
    const counts = data[slug]?.[stepId] ?? {};
    return NextResponse.json({ counts });
  } catch (e) {
    console.error("trait-counts GET error:", e);
    return NextResponse.json({ counts: {} });
  }
}
