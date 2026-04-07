// Explorer Builder — CSS Variable Theme System
// Generates scoped CSS variables from a BrandingConfig

import type { BrandingConfig, ThemeColors } from './types';

/** Convert hex color to rgba string */
function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/** Generates a CSS custom properties object for the explorer shell */
export function generateThemeVars(
  branding: BrandingConfig,
  theme: 'dark' | 'light'
): Record<string, string> {
  const colors = theme === 'dark' ? branding.colors.dark : branding.colors.light;

  return {
    // Brand palette
    '--exp-cyan': branding.colors.primary,
    '--exp-teal': branding.colors.teal,
    '--exp-blue': branding.colors.blue,
    '--exp-deep-blue': branding.colors.deepBlue,
    '--exp-navy': branding.colors.navy,
    '--exp-midnight': branding.colors.midnight,
    '--exp-plum': branding.colors.plum,
    '--exp-bg-dark': branding.colors.bgDark,

    // Theme-dependent
    '--exp-bg': colors.bg,
    '--exp-bg-gradient': colors.bgGradient,
    '--exp-surface': colors.surface,
    '--exp-surface-hover': colors.surfaceHover,
    '--exp-border': colors.border,
    '--exp-border-focus': colors.borderFocus,
    '--exp-text-1': colors.text1,
    '--exp-text-2': colors.text2,
    '--exp-text-3': colors.text3,
    '--exp-input-bg': colors.inputBg,
    '--exp-input-text': colors.inputText,
    '--exp-input-placeholder': colors.inputPlaceholder,
    '--exp-logo-text': colors.logoText,
    '--exp-focus-ring': colors.focusRing,

    // CTA
    '--exp-cta-gradient': branding.ctaGradient,
    '--exp-cta-text': branding.ctaTextColor,
    '--exp-gradient-word': branding.gradientWord,

    // Accent tints (10% opacity versions for backgrounds)
    '--exp-teal-10': hexToRgba(branding.colors.teal, 0.1),
    '--exp-teal-30': hexToRgba(branding.colors.teal, 0.3),
    '--exp-teal-40': hexToRgba(branding.colors.teal, 0.4),
    '--exp-cyan-15': hexToRgba(branding.colors.primary, 0.15),

    // Card selection states (derived from accent)
    '--exp-card-active-border': hexToRgba(branding.colors.teal, 0.3),
    '--exp-card-active-bg': 'rgba(255,255,255,0.08)',
    '--exp-card-selected-border': hexToRgba(branding.colors.teal, 0.5),
    '--exp-card-saved-bg': hexToRgba(branding.colors.teal, 0.1),

    // Alert
    '--exp-alert': '#E5484D',
    '--exp-alert-border': 'rgba(229,72,77,0.25)',
    '--exp-alert-active': 'rgba(229,72,77,0.4)',
    '--exp-alert-bg': 'rgba(229,72,77,0.08)',

    // Transition
    '--exp-transition': '0.3s cubic-bezier(0.4, 0, 0.2, 1)',

    // Font
    '--exp-font': branding.font ? `'${branding.font}', Inter, -apple-system, sans-serif` : "'Inter', -apple-system, sans-serif",
  };
}

/** Converts a theme vars object to a React inline style */
export function themeVarsToStyle(vars: Record<string, string>): React.CSSProperties {
  return vars as unknown as React.CSSProperties;
}

/** Default Momentify dark theme colors */
export const MOMENTIFY_DARK: ThemeColors = {
  bg: '#07081F',
  bgGradient: 'linear-gradient(135deg, #7C316D 0%, #0B0B3C 55%, #1A2E73 100%)',
  surface: 'rgba(255,255,255,0.06)',
  surfaceHover: 'rgba(255,255,255,0.10)',
  border: 'rgba(255,255,255,0.12)',
  borderFocus: '#0CF4DF',
  text1: '#FFFFFF',
  text2: 'rgba(255,255,255,0.75)',
  text3: 'rgba(255,255,255,0.50)',
  inputBg: 'rgba(255,255,255,0.08)',
  inputText: '#FFFFFF',
  inputPlaceholder: 'rgba(255,255,255,0.40)',
  logoText: '#FFFFFF',
  focusRing: 'rgba(12,244,223,0.15)',
};

/** Default Momentify light theme colors */
export const MOMENTIFY_LIGHT: ThemeColors = {
  bg: '#F0F2F8',
  bgGradient: 'linear-gradient(160deg, #ECEEF6 0%, #F0F2F8 40%, #EAECF5 100%)',
  surface: 'rgba(255,255,255,0.55)',
  surfaceHover: 'rgba(255,255,255,0.75)',
  border: 'rgba(6,19,65,0.08)',
  borderFocus: '#00BBA5',
  text1: '#061341',
  text2: 'rgba(6,19,65,0.60)',
  text3: 'rgba(6,19,65,0.42)',
  inputBg: 'rgba(255,255,255,0.8)',
  inputText: '#061341',
  inputPlaceholder: 'rgba(6,19,65,0.35)',
  logoText: '#061341',
  focusRing: 'rgba(0,187,165,0.12)',
};
