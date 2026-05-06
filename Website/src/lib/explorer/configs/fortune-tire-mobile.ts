// Explorer Config: Fortune Tire (Mobile variant)
// Clones FORTUNE_TIRE_CONFIG and flips formFactor to 'mobile' so the same
// content renders through the locked mobile CSS (explorer-mobile.css) at 430x932
// portrait. Tablet Fortune Tire remains untouched at `configs/fortune-tire.ts`.

import type { ExplorerConfig } from '../types';
import { FORTUNE_TIRE_CONFIG } from './fortune-tire';

export const FORTUNE_TIRE_MOBILE_CONFIG: ExplorerConfig = {
  ...FORTUNE_TIRE_CONFIG,
  id: 'fortune-tire-mobile',
  name: 'Fortune Tire Explorer (Mobile)',
  formFactor: 'mobile',
  updatedAt: '2026-05-05T00:00:00.000Z',
};
