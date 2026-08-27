/**
 * Paleta de colores Huellitas — sincronizada con tailwind.config.js
 */

import { Platform } from 'react-native';

// Colores de marca
const primary = '#2448C5';    // Azul principal
const secondary = '#D6F014';  // Lima/amarillo vibrante
const accent = '#813A8E';     // Púrpura acento

export const Colors = {
  light: {
    text: '#1A1A2E',
    background: '#FFFFFF',
    backgroundElement: '#F0F3FA',
    backgroundSelected: '#E1E8F5',
    textSecondary: '#6B7280',
    primary,
    secondary,
    accent,
  },
  dark: {
    text: '#F8FAFC',
    background: '#0F172A',
    backgroundElement: '#1E293B',
    backgroundSelected: '#334155',
    textSecondary: '#94A3B8',
    primary,
    secondary,
    accent,
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
