// Explorer Config — Friends of Medicine (Mobile companion)
// Same canonical content as friends-of-medicine.ts, rendered in the locked
// mobile layout (430x932). Spread keeps steps, content, and branding in sync.

import type { ExplorerConfig } from '../types';
import { FRIENDS_OF_MEDICINE_CONFIG } from './friends-of-medicine';

export const FRIENDS_OF_MEDICINE_MOBILE_CONFIG: ExplorerConfig = {
  ...FRIENDS_OF_MEDICINE_CONFIG,
  id: 'friends-of-medicine-mobile',
  name: 'Friends of Medicine Explorer (Mobile)',
  formFactor: 'mobile',
};
