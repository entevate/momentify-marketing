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
import {
  getInterviewPrototypeConfig,
  getInterviewPrototypeIndex,
} from '@/lib/interview/configs/registry';

export const dynamic = 'force-static';
export const revalidate = 60;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug: rawSlug } = await params;
  // Phase 12 — `-mobile` slug variants no longer exist as separate
  // configs. Strip the suffix so legacy callers (older Momentify Web
  // deploys, bookmarked links) still resolve to the canonical config.
  const slug = rawSlug.endsWith("-mobile") ? rawSlug.replace(/-mobile$/, "") : rawSlug;

  // Try Explorer first (the historical default), then Interview. Both
  // registries use the same slug → response shape contract so the
  // ingest endpoint downstream can branch on metadata.kind.
  const explorerConfig = getPrototypeConfig(slug);
  if (explorerConfig) {
    const metadata = getPrototypeMetadata(slug);
    if (!metadata) {
      return notFound();
    }
    return NextResponse.json(
      { metadata: { ...metadata, kind: 'explorer' as const }, config: explorerConfig, kind: 'explorer' as const },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      },
    );
  }

  const interviewConfig = getInterviewPrototypeConfig(slug);
  if (interviewConfig) {
    // The interview registry only exposes tablet rows from getIndex();
    // detail metadata for mobile is synthesized here.
    const tabletMeta = getInterviewPrototypeIndex().find((p) => p.slug === slug);
    const metadata = tabletMeta ?? {
      slug,
      name: interviewConfig.name,
      kind: 'interview' as const,
      formFactor: (interviewConfig.formFactor ?? 'tablet') as 'tablet' | 'mobile',
      mobileSlug: null,
      tabletSlug: slug.endsWith('-mobile') ? slug.replace(/-mobile$/, '') : null,
      isDefault: false,
    };
    return NextResponse.json(
      { metadata, config: interviewConfig, kind: 'interview' as const },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      },
    );
  }

  return notFound();
}

function notFound() {
  return NextResponse.json(
    { error: 'Prototype not found' },
    { status: 404, headers: { 'Access-Control-Allow-Origin': '*' } },
  );
}
