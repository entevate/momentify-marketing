import { NextRequest, NextResponse } from "next/server";
import { put, list } from "@vercel/blob";
import type { SessionRecord, AnalyticsSummary } from "@/app/prototypes/explorer/analytics-types";
import { classifySource } from "@/app/prototypes/explorer/analytics-types";

const MAX_SESSIONS = 200;
const token = process.env.GTM_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN || "";

function blobName(slug: string) {
  return `prototype-sessions-${slug}.json`;
}

async function readSessions(slug: string): Promise<SessionRecord[]> {
  try {
    const { blobs } = await list({ prefix: blobName(slug), token });
    if (blobs.length > 0) {
      const res = await fetch(blobs[0].url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) return await res.json();
    }
  } catch (e) {
    console.error("Analytics blob read error:", e);
  }
  return [];
}

async function writeSessions(slug: string, sessions: SessionRecord[]) {
  await put(blobName(slug), JSON.stringify(sessions), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    token,
  });
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("text/plain")) {
    const text = await req.text();
    body = JSON.parse(text);
  } else {
    body = await req.json();
  }

  const { action, sessionId, slug } = body as {
    action: string;
    sessionId: string;
    slug: string;
  };

  if (!action || !sessionId || !slug) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (!token) {
    return NextResponse.json({ error: "No storage token" }, { status: 500 });
  }

  try {
    if (action === "start") {
      const sessions = await readSessions(slug);
      const record: SessionRecord = {
        id: sessionId,
        startedAt: new Date().toISOString(),
        durationMs: null,
        referrer: (body.referrer as string) || "Direct",
        utmSource: (body.utmSource as string) || null,
        utmMedium: (body.utmMedium as string) || null,
        utmCampaign: (body.utmCampaign as string) || null,
        country: req.headers.get("x-vercel-ip-country") || null,
        city: req.headers.get("x-vercel-ip-city") ? decodeURIComponent(req.headers.get("x-vercel-ip-city")!) : null,
        region: req.headers.get("x-vercel-ip-country-region") || null,
      };
      sessions.unshift(record);
      if (sessions.length > MAX_SESSIONS) sessions.length = MAX_SESSIONS;
      await writeSessions(slug, sessions);
      return NextResponse.json({ ok: true });
    }

    if (action === "end") {
      const durationMs = body.durationMs as number;
      if (typeof durationMs !== "number") {
        return NextResponse.json({ error: "Missing durationMs" }, { status: 400 });
      }
      const sessions = await readSessions(slug);
      const idx = sessions.findIndex((s) => s.id === sessionId);
      if (idx !== -1) {
        sessions[idx].durationMs = durationMs;
        await writeSessions(slug, sessions);
      }
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (e) {
    console.error("Analytics POST error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  try {
    const sessions = await readSessions(slug);

    const withDuration = sessions.filter((s) => s.durationMs != null);
    const avgDurationMs =
      withDuration.length > 0
        ? Math.round(withDuration.reduce((sum, s) => sum + s.durationMs!, 0) / withDuration.length)
        : 0;

    const sourceCounts: Record<string, number> = {};
    for (const s of sessions) {
      const src = classifySource(s);
      sourceCounts[src] = (sourceCounts[src] || 0) + 1;
    }
    const sources = Object.entries(sourceCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const locationCounts: Record<string, number> = {};
    for (const s of sessions) {
      const parts = [s.city, s.region, s.country].filter(Boolean);
      const loc = parts.length > 0 ? parts.join(", ") : "Unknown";
      locationCounts[loc] = (locationCounts[loc] || 0) + 1;
    }
    const locations = Object.entries(locationCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const summary: AnalyticsSummary = {
      totalSessions: sessions.length,
      avgDurationMs,
      sources,
      locations,
      recentSessions: sessions.slice(0, 20),
    };

    return NextResponse.json(summary);
  } catch (e) {
    console.error("Analytics GET error:", e);
    return NextResponse.json(
      { totalSessions: 0, avgDurationMs: 0, sources: [], locations: [], recentSessions: [] } satisfies AnalyticsSummary
    );
  }
}
