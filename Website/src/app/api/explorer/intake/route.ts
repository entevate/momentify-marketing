import { NextResponse } from 'next/server';
import { put, list } from '@vercel/blob';

const token = process.env.GTM_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN || '';
const INTAKE_PREFIX = 'explorer-intake/';

export async function POST(request: Request) {
  try {
    // Accept JSON body — files are uploaded directly to Vercel Blob from the
    // client via /api/explorer/intake/upload, so only URLs arrive here.
    const intake = await request.json();
    const slug = intake.slug as string;

    if (!slug) {
      return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
    }

    // Save the intake JSON
    const intakeRecord = {
      ...intake,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    };

    await put(
      `${INTAKE_PREFIX}${slug}/intake.json`,
      JSON.stringify(intakeRecord, null, 2),
      {
        access: 'public',
        addRandomSuffix: false,
        allowOverwrite: true,
        token,
      },
    );

    return NextResponse.json({
      success: true,
      intakeId: slug,
      slug,
      password: intake.password,
    });
  } catch (error) {
    console.error('Explorer intake error:', error);
    return NextResponse.json(
      { error: 'Failed to save intake', details: String(error) },
      { status: 500 },
    );
  }
}

// GET: List all pending intakes
export async function GET() {
  try {
    const { blobs } = await list({ prefix: INTAKE_PREFIX, token });
    const intakeBlobs = blobs.filter(b => b.pathname.endsWith('/intake.json'));
    const intakes = [];

    for (const blob of intakeBlobs) {
      try {
        const res = await fetch(blob.url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          intakes.push(await res.json());
        }
      } catch {
        // skip invalid entries
      }
    }

    return NextResponse.json({ intakes });
  } catch {
    return NextResponse.json({ intakes: [] });
  }
}
