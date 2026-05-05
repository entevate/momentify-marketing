// Explorer Config: Carter Machinery (Mobile variant)
// Clones CARTER_MACHINERY_CONFIG and flips formFactor to 'mobile' so the same
// content renders through the locked mobile CSS (explorer-mobile.css) at 430x932
// portrait. Tablet Carter remains untouched at `configs/carter-machinery.ts`.

import type { ExplorerConfig } from '../types';
import { CARTER_MACHINERY_CONFIG } from './carter-machinery';

export const CARTER_MACHINERY_MOBILE_CONFIG: ExplorerConfig = {
  ...CARTER_MACHINERY_CONFIG,
  id: 'carter-machinery-mobile',
  name: 'Carter Machinery Careers Explorer (Mobile)',
  formFactor: 'mobile',
  updatedAt: '2026-05-05T00:00:00.000Z',
};
