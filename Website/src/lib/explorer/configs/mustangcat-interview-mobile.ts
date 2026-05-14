// Explorer Config: Mustang Cat Open Interview (Mobile variant)
// Clones MUSTANGCAT_INTERVIEW_CONFIG and flips formFactor to 'mobile' so the
// same content renders through the locked mobile CSS (explorer-mobile.css) at
// 430x932 portrait. Tablet config stays at `configs/mustangcat-interview.ts`.

import type { ExplorerConfig } from '../types';
import { MUSTANGCAT_INTERVIEW_CONFIG } from './mustangcat-interview';

export const MUSTANGCAT_INTERVIEW_MOBILE_CONFIG: ExplorerConfig = {
  ...MUSTANGCAT_INTERVIEW_CONFIG,
  id: 'mustangcat-interview-mobile',
  name: 'Mustang Cat Technician Open Interview (Mobile)',
  formFactor: 'mobile',
  updatedAt: '2026-05-14T00:00:00.000Z',
};
