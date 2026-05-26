/**
 * Phase 8.9 — Prototype registry.
 *
 * Single source of truth for which Explorer configs ship as importable
 * prototypes. Consumed by:
 *   - /app/explorer/[id]/page.tsx       — public preview pages
 *   - /api/prototypes                   — list endpoint (Momentify Web pulls)
 *   - /api/prototypes/[slug]            — detail endpoint (Momentify Web pulls)
 *
 * The metadata index (PROTOTYPES) is what Momentify Web shows in its
 * Import Prototype modal — slug, display name, form factor, and a hint
 * about whether a paired -mobile variant exists.
 */
import type { ExplorerConfig } from '../types';
import { MOMENTIFY_DEFAULT_CONFIG } from '../defaults';
import { CLARIUM_CONFIG } from './clarium';
import { MAVEN_FP_CONFIG } from './maven-fp';
import { CDK_CONFIG } from './cdk';
import { SALESFLOWIQ_CONFIG } from './salesflowiq';
import { DEALROOM_CONFIG } from './dealroom';
import { SALAS_OBRIEN_CONFIG } from './salas-o-brien';
import { DFWPB_PICKLEBALL_CONFIG } from './dfwpb-pickleball-may132026';
import { CARTER_MACHINERY_CONFIG } from './carter-machinery';
import { FORTUNE_TIRE_CONFIG } from './fortune-tire';
import { MOMENTIFY_CONFIG } from './momentify';
import { FORMATION_CONFIG } from './formation';
// Phase 12 — `-mobile` companion files dropped. Form factor is now a
// property of the moment (set at moment-creation time in Momentify
// Web), not the template. Each prototype ships ONE canonical config.
// Mustang Cat Open Interview lives in the `interview` registry.

/** All prototype configs by slug. */
export const PROTOTYPE_CONFIGS: Record<string, ExplorerConfig> = {
  'momentify-default': MOMENTIFY_DEFAULT_CONFIG,
  'clarium': CLARIUM_CONFIG,
  'maven-fp': MAVEN_FP_CONFIG,
  'cdk': CDK_CONFIG,
  'salesflowiq': SALESFLOWIQ_CONFIG,
  'dealroom': DEALROOM_CONFIG,
  'salas-o-brien': SALAS_OBRIEN_CONFIG,
  'dfwpb-pickleball-may132026': DFWPB_PICKLEBALL_CONFIG,
  'carter-machinery': CARTER_MACHINERY_CONFIG,
  'fortune-tire': FORTUNE_TIRE_CONFIG,
  'momentify': MOMENTIFY_CONFIG,
  'formation': FORMATION_CONFIG,
};

export interface PrototypeMetadata {
  /** URL slug used in /explorer/[id] and /api/prototypes/[slug]. */
  slug: string;
  /** Display name for pickers (config.name). */
  name: string;
  /** Tablet (1366x1024) or mobile (430x932). */
  formFactor: 'tablet' | 'mobile';
  /** Slug of paired mobile variant, if one exists. */
  mobileSlug: string | null;
  /** Slug of paired tablet variant if THIS entry is the mobile one. */
  tabletSlug: string | null;
  /** Whether this config is intended as a starter (vs a finished prototype). */
  isDefault: boolean;
}

function isMobileSlug(slug: string): boolean {
  return slug.endsWith('-mobile');
}
function tabletCounterpart(slug: string): string {
  return slug.replace(/-mobile$/, '');
}
function mobileCounterpart(slug: string): string {
  return `${slug}-mobile`;
}

/** Index for the public list endpoint. Filtered to non-mobile entries —
 *  the modal shows ONE row per prototype, not two. The mobile variant
 *  comes through as a hint (`mobileSlug`) for the import flow. */
export function getPrototypeIndex(): PrototypeMetadata[] {
  const allSlugs = Object.keys(PROTOTYPE_CONFIGS);
  const tabletSlugs = allSlugs.filter((s) => !isMobileSlug(s));
  return tabletSlugs.map((slug) => {
    const config = PROTOTYPE_CONFIGS[slug];
    const mobileSlug = mobileCounterpart(slug);
    const hasMobile = allSlugs.includes(mobileSlug);
    return {
      slug,
      name: config.name,
      formFactor: (config.formFactor ?? 'tablet') as 'tablet' | 'mobile',
      mobileSlug: hasMobile ? mobileSlug : null,
      tabletSlug: null,
      isDefault: slug === 'momentify-default',
    };
  });
}

/** Detail lookup. Returns null if slug isn't registered. */
export function getPrototypeConfig(slug: string): ExplorerConfig | null {
  return PROTOTYPE_CONFIGS[slug] ?? null;
}

/** Detail metadata for a single slug — useful for the Momentify Web
 *  detail endpoint that includes both the metadata header and the full
 *  config payload. */
export function getPrototypeMetadata(slug: string): PrototypeMetadata | null {
  const config = PROTOTYPE_CONFIGS[slug];
  if (!config) return null;
  const mobile = isMobileSlug(slug);
  const counterpartSlug = mobile ? tabletCounterpart(slug) : mobileCounterpart(slug);
  const counterpartExists = !!PROTOTYPE_CONFIGS[counterpartSlug];
  return {
    slug,
    name: config.name,
    formFactor: (config.formFactor ?? 'tablet') as 'tablet' | 'mobile',
    mobileSlug: mobile ? null : (counterpartExists ? counterpartSlug : null),
    tabletSlug: mobile ? (counterpartExists ? counterpartSlug : null) : null,
    isDefault: slug === 'momentify-default',
  };
}
