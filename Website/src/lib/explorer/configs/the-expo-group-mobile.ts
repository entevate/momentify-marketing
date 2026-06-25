// Explorer Config — The Expo Group (Mobile companion)
// Same canonical content as the-expo-group.ts, rendered in the locked
// mobile layout (430x932). Spread keeps steps, content, and branding in sync.

import type { ExplorerConfig } from '../types';
import { THE_EXPO_GROUP_CONFIG } from './the-expo-group';

export const THE_EXPO_GROUP_MOBILE_CONFIG: ExplorerConfig = {
  ...THE_EXPO_GROUP_CONFIG,
  id: 'the-expo-group-mobile',
  name: 'The Expo Group Explorer (Mobile)',
  formFactor: 'mobile',
};
