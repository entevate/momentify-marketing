import { NextResponse } from 'next/server';
import { put, list } from '@vercel/blob';

const token = process.env.GTM_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN || '';
const INTAKE_PREFIX = 'explorer-intake/';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const dataField = formData.get('data');
    if (!dataField || typeof dataField !== 'string') {
      return NextResponse.json({ error: 'Missing data field' }, { status: 400 });
    }

    const intake = JSON.parse(dataField);
    const slug = intake.slug as string;

    if (!slug) {
      return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
    }

    // Save logo files to blob storage
    const logoKeys = ['logo-dark', 'logo-light', 'logo-icon'] as const;
    const logoPaths: Record<string, string> = {};

    for (const key of logoKeys) {
      const file = formData.get(key);
      if (file && file instanceof File && file.size > 0) {
        const ext = file.name.split('.').pop() ?? 'png';
        const suffix = key.replace('logo-', '');
        const blobName = `${INTAKE_PREFIX}${slug}/logos/${slug}-${suffix}.${ext}`;
        const buffer = Buffer.from(await file.arrayBuffer());
        const blob = await put(blobName, buffer, {
          access: 'private',
          addRandomSuffix: false,
          allowOverwrite: true,
          token,
        });
        logoPaths[key] = blob.url;
      }
    }

    // Save content files to blob storage
    const contentPaths: string[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('content-') && value instanceof File && value.size > 0) {
        const blobName = `${INTAKE_PREFIX}${slug}/content/${value.name}`;
        const buffer = Buffer.from(await value.arrayBuffer());
        const blob = await put(blobName, buffer, {
          access: 'private',
          addRandomSuffix: false,
          allowOverwrite: true,
          token,
        });
        contentPaths.push(blob.url);
      }
    }

    // Save the intake JSON
    const intakeRecord = {
      ...intake,
      logos: logoPaths,
      contentFiles: contentPaths,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    };

    await put(
      `${INTAKE_PREFIX}${slug}/intake.json`,
      JSON.stringify(intakeRecord, null, 2),
      {
        access: 'private',
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
