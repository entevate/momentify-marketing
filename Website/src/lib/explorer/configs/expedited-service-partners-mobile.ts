// Explorer Config — Expedited Service Partners (Mobile companion)
// Same canonical content as expedited-service-partners.ts, rendered in the
// locked mobile layout (430x932). Kept DRY by spreading the tablet config
// so there is a single source of truth for steps, content, and branding.

import type { ExplorerConfig } from '../types';
import { EXPEDITED_SERVICE_PARTNERS_CONFIG } from './expedited-service-partners';

export const EXPEDITED_SERVICE_PARTNERS_MOBILE_CONFIG: ExplorerConfig = {
  ...EXPEDITED_SERVICE_PARTNERS_CONFIG,
  id: 'expedited-service-partners-mobile',
  name: 'Expedited Service Partners Explorer (Mobile)',
  formFactor: 'mobile',
};
