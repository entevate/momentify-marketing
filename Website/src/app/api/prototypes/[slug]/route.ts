/**
 * Phase 8.9 — Public prototype detail endpoint.
 *
 * GET /api/prototypes/[slug]
 *
 * Returns the full ExplorerConfig payload + metadata header for a
 * single prototype. Used by Momentify Web's import flow:
 *
 *   1. user clicks "Import Prototype" + selects a slug
 *   2. Momentify Web's server-side fetch hits this endpoint
 *   3. response is inserted as a new gallery_templates row scoped to
 *      the calling org with kind='explorer'
 *   4. user is redirected to the new template editor
 *
 * Snapshot semantics — once imported, the org owns its copy. Future
 * edits to this prototype don't propagate to imported templates.
 */
import { NextResponse } from 'next/server';
import { getPrototypeConfig, getPrototypeMetadata } from '@/lib/explorer/configs/registry';

export const dynamic = 'force-static';
export const revalidate = 60;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const config = getPrototypeConfig(slug);
  const metadata = getPrototypeMetadata(slug);

  if (!config || !metadata) {
    return NextResponse.json(
      { error: 'Prototype not found' },
      { status: 404, headers: { 'Access-Control-Allow-Origin': '*' } },
    );
  }

  return NextResponse.json(
    { metadata, config },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    },
  );
}
