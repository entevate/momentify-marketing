import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import type { ExplorerConfig } from '@/lib/explorer/config-schema';

const KV_PREFIX = 'explorer:config:';
const KV_INDEX = 'explorer:configs:index';

// GET /api/explorer/configs/[id] - Get single config
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const config = await kv.get<ExplorerConfig>(`${KV_PREFIX}${id}`);
    if (!config) {
      return NextResponse.json({ error: 'Config not found' }, { status: 404 });
    }
    return NextResponse.json(config);
  } catch {
    return NextResponse.json({ error: 'KV not available' }, { status: 500 });
  }
}

// PUT /api/explorer/configs/[id] - Update config
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const config = await request.json() as ExplorerConfig;
    config.id = id;
    config.updatedAt = new Date().toISOString();

    await kv.set(`${KV_PREFIX}${id}`, config);
    await kv.sadd(KV_INDEX, id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update config', details: String(error) },
      { status: 500 }
    );
  }
}

// DELETE /api/explorer/configs/[id] - Delete config
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await kv.del(`${KV_PREFIX}${id}`);
    await kv.srem(KV_INDEX, id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete config', details: String(error) },
      { status: 500 }
    );
  }
}
