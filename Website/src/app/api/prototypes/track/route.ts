import { NextRequest, NextResponse } from "next/server";
import { put, list } from "@vercel/blob";

const BLOB_NAME = "prototype-views.json";
const token = process.env.BLOB_READ_WRITE_TOKEN || "";

interface ViewEntry { views: number; lastViewed: string; }
interface ViewData { [slug: string]: ViewEntry; }

async function readData(): Promise<ViewData> {
  try {
    const { blobs } = await list({ prefix: BLOB_NAME, token });
    if (blobs.length > 0) {
      // For private blobs, use the url with token auth header
      const res = await fetch(blobs[0].url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) return await res.json();
    }
  } catch (e) {
    console.error("Blob read error:", e);
  }
  return {};
}

async function writeData(data: ViewData) {
  await put(BLOB_NAME, JSON.stringify(data), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    token,
  });
}

export async function POST(req: NextRequest) {
  const { slug } = await req.json();
  if (!slug || typeof slug !== "string") {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  if (!token) {
    return NextResponse.json({ error: "No storage token" }, { status: 500 });
  }

  try {
    const data = await readData();
    if (!data[slug]) {
      data[slug] = { views: 0, lastViewed: "" };
    }
    data[slug].views += 1;
    data[slug].lastViewed = new Date().toISOString();
    await writeData(data);
    return NextResponse.json({ slug, views: data[slug].views });
  } catch (e) {
    console.error("Blob error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function GET() {
  try {
    const data = await readData();
    return NextResponse.json(data);
  } catch (e) {
    console.error("Blob GET error:", e);
    return NextResponse.json({});
  }
}
