// Explorer Config — DFWTPB Pickleball Social (Mobile variant)
// Clones DFWPB_PICKLEBALL_CONFIG and flips formFactor to 'mobile' so the same content
// renders through the locked mobile CSS (explorer-mobile.css) at 430x932 portrait.

import type { ExplorerConfig } from '../types';
import { DFWPB_PICKLEBALL_CONFIG } from './dfwpb-pickleball-may132026';

export const DFWPB_PICKLEBALL_MOBILE_CONFIG: ExplorerConfig = {
  ...DFWPB_PICKLEBALL_CONFIG,
  id: 'dfwpb-pickleball-may132026-mobile',
  name: 'DFWTPB Explorer (Mobile)',
  formFactor: 'mobile',
  updatedAt: '2026-05-04T00:00:00.000Z',
};
