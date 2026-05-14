// Interview Config: Mustang Cat Technician Open Interview (mobile)
// Spread of the tablet config with formFactor flipped. Same content,
// rendered through the locked mobile CSS at 430×932 portrait.

import type { InterviewConfig } from '../types';
import { MUSTANGCAT_INTERVIEW_CONFIG } from './mustangcat-interview';

export const MUSTANGCAT_INTERVIEW_MOBILE_CONFIG: InterviewConfig = {
  ...MUSTANGCAT_INTERVIEW_CONFIG,
  id: 'mustangcat-interview-mobile',
  name: 'Mustang Cat Technician Open Interview (Mobile)',
  formFactor: 'mobile',
  updatedAt: '2026-05-14T00:00:00.000Z',
};
