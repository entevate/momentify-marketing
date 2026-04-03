import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import type { ExplorerConfig } from '@/lib/explorer/config-schema';

const KV_PREFIX = 'explorer:config:';
const KV_INDEX = 'explorer:configs:index';

// GET /api/explorer/configs - List all configs
export async function GET() {
  try {
    const index = await kv.smembers(KV_INDEX) as string[];
    const configs: Partial<ExplorerConfig>[] = [];

    for (const id of index) {
      const config = await kv.get<ExplorerConfig>(`${KV_PREFIX}${id}`);
      if (config) {
        configs.push({
          id: config.id,
          name: config.name,
          version: config.version,
          createdAt: config.createdAt,
          updatedAt: config.updatedAt,
          branding: {
            ...config.branding,
            // Only include minimal branding for list view
            colors: undefined as unknown as ExplorerConfig['branding']['colors'],
          },
        });
      }
    }

    return NextResponse.json({ configs });
  } catch {
    // KV not available (local dev without Vercel KV)
    return NextResponse.json({ configs: [] });
  }
}

// POST /api/explorer/configs - Create new config
export async function POST(request: Request) {
  try {
    const config = await request.json() as ExplorerConfig;

    if (!config.id) {
      config.id = `explorer-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    }

    config.createdAt = new Date().toISOString();
    config.updatedAt = new Date().toISOString();

    await kv.set(`${KV_PREFIX}${config.id}`, config);
    await kv.sadd(KV_INDEX, config.id);

    return NextResponse.json({ id: config.id, success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save config', details: String(error) },
      { status: 500 }
    );
  }
}
