import { NextResponse } from "next/server";

interface FanGallerySubmission {
  email: string;
  phone?: string;
  photoDataUrl: string;
}

export async function POST(request: Request) {
  try {
    const data: FanGallerySubmission = await request.json();

    if (!data.email || !data.photoDataUrl) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Stub: In production, upload photo to storage and save to database
    return NextResponse.json({ success: true, photoId: crypto.randomUUID() });
  } catch (err) {
    console.error("Fan gallery submission error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
