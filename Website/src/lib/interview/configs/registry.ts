/**
 * Interview Prototype Registry — parallels the Explorer registry.
 *
 * Source of truth for which interview-kind configs ship as importable
 * prototypes. Consumed by:
 *   - /api/prototypes              (merged list, kind-tagged)
 *   - /api/prototypes/[slug]       (kind-aware detail lookup)
 *   - fan-gallery ingest endpoint  (creates gallery_templates with kind='interview')
 */

import type { InterviewConfig } from '../types';
import { MUSTANGCAT_INTERVIEW_CONFIG } from './mustangcat-interview';
// Phase 12 — `-mobile` companion configs dropped. Form factor is now a
// property of the moment, not the template. One canonical config per
// interview prototype.

/** All interview prototype configs by slug. */
export const INTERVIEW_PROTOTYPE_CONFIGS: Record<string, InterviewConfig> = {
  'mustangcat-interview': MUSTANGCAT_INTERVIEW_CONFIG,
};

export interface InterviewPrototypeMetadata {
  slug: string;
  name: string;
  kind: 'interview';
  formFactor: 'tablet' | 'mobile';
  mobileSlug: string | null;
  tabletSlug: string | null;
  isDefault: boolean;
}

function isMobileSlug(slug: string): boolean {
  return slug.endsWith('-mobile');
}
function mobileCounterpart(slug: string): string {
  return `${slug}-mobile`;
}

/** Index for the public list endpoint. Filtered to tablet entries —
 *  the modal shows ONE row per prototype; mobile pairing comes through
 *  as `mobileSlug` so the ingest flow can offer both with one click. */
export function getInterviewPrototypeIndex(): InterviewPrototypeMetadata[] {
  const allSlugs = Object.keys(INTERVIEW_PROTOTYPE_CONFIGS);
  const tabletSlugs = allSlugs.filter((s) => !isMobileSlug(s));
  return tabletSlugs.map((slug) => {
    const config = INTERVIEW_PROTOTYPE_CONFIGS[slug];
    const mobileSlug = mobileCounterpart(slug);
    const hasMobile = allSlugs.includes(mobileSlug);
    return {
      slug,
      name: config.name,
      kind: 'interview' as const,
      formFactor: (config.formFactor ?? 'tablet') as 'tablet' | 'mobile',
      mobileSlug: hasMobile ? mobileSlug : null,
      tabletSlug: null,
      isDefault: false,
    };
  });
}

/** Detail lookup. Returns null if slug isn't registered. */
export function getInterviewPrototypeConfig(slug: string): InterviewConfig | null {
  return INTERVIEW_PROTOTYPE_CONFIGS[slug] ?? null;
}
