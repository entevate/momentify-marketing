/**
 * Phase 8.9 — Public prototype list endpoint.
 *
 * GET /api/prototypes
 *
 * Returns the metadata index for every Explorer prototype shipped with
 * the Website repo. Consumed by Momentify Web's "Import Prototype"
 * modal to render a pickable list. The full config payload for any
 * single prototype lives at /api/prototypes/[slug].
 *
 * Public, no auth — these prototypes are meant to be importable by any
 * Momentify Web workspace and are already published as visitable pages
 * at /explorer/[id].
 */
import { NextResponse } from 'next/server';
import { getPrototypeIndex } from '@/lib/explorer/configs/registry';
import { getInterviewPrototypeIndex } from '@/lib/interview/configs/registry';

export const dynamic = 'force-static';
export const revalidate = 60;

export async function GET() {
  // Merge Explorer + Interview kinds into one listing. Each entry now
  // carries an explicit `kind` so consumers (Momentify Web ingest) can
  // route the slug to the right gallery_templates.kind on insert.
  const explorerIndex = getPrototypeIndex().map((p) => ({ ...p, kind: 'explorer' as const }));
  const interviewIndex = getInterviewPrototypeIndex();
  const prototypes = [...explorerIndex, ...interviewIndex];
  return NextResponse.json({ prototypes }, {
    headers: {
      // CORS — Momentify Web's server-side fetch happens from a
      // different origin in production (momentify-web vs momentifyapp).
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
}
