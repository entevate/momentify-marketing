// Explorer Config — The Expo Group (Mobile companion)
// Same canonical content as the-expo-group.ts, rendered in the locked
// mobile layout (430x932). Splash overrides use shorter text to fit the
// narrow 430px viewport — "Communities." overflows at splash font size.

import type { ExplorerConfig } from '../types';
import { THE_EXPO_GROUP_CONFIG } from './the-expo-group';

export const THE_EXPO_GROUP_MOBILE_CONFIG: ExplorerConfig = {
  ...THE_EXPO_GROUP_CONFIG,
  id: 'the-expo-group-mobile',
  name: 'The Expo Group Explorer (Mobile)',
  formFactor: 'mobile',
  steps: [
    {
      ...THE_EXPO_GROUP_CONFIG.steps[0],
      title: 'We Design',
      gradientWord: 'Impact.',
      subtitle: "35 years of trade show expertise, CROWDPulse intelligence, and Single Source Solution® — all in one partner.",
    },
    ...THE_EXPO_GROUP_CONFIG.steps.slice(1),
  ],
};
