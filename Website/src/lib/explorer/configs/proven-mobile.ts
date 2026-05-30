// Explorer Config — PROVEN (Mobile companion)
// Same canonical content as proven.ts, rendered in the locked mobile
// layout (430x932). Kept DRY by spreading PROVEN_CONFIG so there is a
// single source of truth for steps, content, and branding.

import type { ExplorerConfig } from '../types';
import { PROVEN_CONFIG } from './proven';

export const PROVEN_MOBILE_CONFIG: ExplorerConfig = {
  ...PROVEN_CONFIG,
  id: 'proven-mobile',
  name: 'PROVEN Explorer (Mobile)',
  formFactor: 'mobile',
};
