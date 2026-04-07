import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const ASSETS_DIR = join(process.cwd(), 'public', 'brand', 'assets');
const INTAKE_DIR = join(process.cwd(), '.explorer-intake');

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

    // Create directories
    await mkdir(ASSETS_DIR, { recursive: true });
    const intakeDir = join(INTAKE_DIR, slug);
    await mkdir(intakeDir, { recursive: true });

    // Save logo files
    const logoKeys = ['logo-dark', 'logo-light', 'logo-icon'] as const;
    const logoPaths: Record<string, string> = {};

    for (const key of logoKeys) {
      const file = formData.get(key);
      if (file && file instanceof File && file.size > 0) {
        const ext = file.name.split('.').pop() ?? 'png';
        const suffix = key.replace('logo-', '');
        const filename = `${slug}-${suffix}.${ext}`;
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(join(ASSETS_DIR, filename), buffer);
        logoPaths[key] = `/brand/assets/${filename}`;
      }
    }

    // Save content files to intake directory
    const contentPaths: string[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('content-') && value instanceof File && value.size > 0) {
        const filename = value.name;
        const buffer = Buffer.from(await value.arrayBuffer());
        const filePath = join(intakeDir, filename);
        await writeFile(filePath, buffer);
        contentPaths.push(filePath);
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

    await writeFile(
      join(intakeDir, 'intake.json'),
      JSON.stringify(intakeRecord, null, 2),
    );

    return NextResponse.json({
      success: true,
      intakeId: slug,
      slug,
      password: intake.password,
      intakePath: intakeDir,
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
    const { readdir, readFile } = await import('fs/promises');
    const dirs = await readdir(INTAKE_DIR).catch(() => [] as string[]);
    const intakes = [];

    for (const dir of dirs) {
      try {
        const raw = await readFile(join(INTAKE_DIR, dir, 'intake.json'), 'utf8');
        intakes.push(JSON.parse(raw));
      } catch {
        // skip invalid entries
      }
    }

    return NextResponse.json({ intakes });
  } catch {
    return NextResponse.json({ intakes: [] });
  }
}
