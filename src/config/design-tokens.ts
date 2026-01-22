// UNIFIED DESIGN TOKENS
// Single source of truth for all design values across the Cognitive Shield

import { SPACING, FONT_SIZES, COLORS, OPACITY } from './design-system';
import GOD_CONFIG from './god.config';

// Create CosmicTheme locally to avoid circular dependency
const CosmicTheme = {
  // Mathematical gradients
  backgroundGradient: `radial-gradient(circle at 60% 20%, ${COLORS.cosmic}22 0%, ${COLORS.gray[800]} 100%)`,
  cardGradient: `linear-gradient(135deg, ${COLORS.delta}22 0%, ${COLORS.love}22 100%)`,
  cosmicGlow: `0 0 64px 8px ${COLORS.cosmic}55, 0 0 128px 32px ${COLORS.love}22`,

  // UI gradients
  gradients: {
    shield: `linear-gradient(135deg, ${COLORS.cosmic} 0%, ${COLORS.unity} 50%, ${COLORS.delta} 100%)`,
    voltage: {
      low: `linear-gradient(90deg, ${COLORS.success}, #4ade80)`,
      medium: `linear-gradient(90deg, ${COLORS.warning}, #facc15)`,
      high: `linear-gradient(90deg, ${COLORS.error}, #f87171)`,
    },
    quantum: `linear-gradient(45deg, ${COLORS.quantum.psi0}, ${COLORS.quantum.psi1}, ${COLORS.quantum.psi2}, ${COLORS.quantum.psi3})`,
  },

  ratioOverlay: {
    text: '√3 = 1.732 | φ = 1.618 | 1/√3 = 0.577 | 1/3 = 0.333',
    style: {
      fontSize: FONT_SIZES.md,
      color: COLORS.cosmic,
      fontWeight: 700,
      opacity: 0.85,
      textShadow: `0 0 16px ${COLORS.cosmic}, 0 0 32px ${COLORS.love}`,
      filter: 'drop-shadow(0 0 8px #fff)',
      background: `linear-gradient(90deg, ${COLORS.cosmic}, ${COLORS.love}, ${COLORS.delta})`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      letterSpacing: '0.04em',
    },
  },

  // Starfield animation config
  starfield: {
    count: 64,
    color: COLORS.cosmic,
    minSize: 1,
    maxSize: 3,
    minOpacity: 0.3,
    maxOpacity: 1,
    minGlow: 8,
    maxGlow: 20,
    minDuration: 2,
    maxDuration: 5,
  },

  // Layout constants
  spacing: SPACING,
  cardRadius: SPACING.lg,
  cardPadding: SPACING.lg,
  gridGap: SPACING.md,
  sectionGap: SPACING.xl,

  // Typography
  fontSizes: FONT_SIZES,

  // Opacity
  opacity: OPACITY,

  // Colors
  colors: COLORS,

  // Shadows and effects
  shadows: {
    subtle: `0 1px 3px ${COLORS.gray[800]}40`,
    medium: `0 4px 6px ${COLORS.gray[800]}40`,
    strong: `0 10px 15px ${COLORS.gray[800]}40`,
    cosmic: `0 0 20px ${COLORS.cosmic}40`,
    quantum: `0 0 30px ${COLORS.quantum.psi0}60`,
  },

  // Borders
  borders: {
    subtle: `1px solid ${COLORS.gray[700]}`,
    medium: `1px solid ${COLORS.gray[600]}`,
    strong: `1px solid ${COLORS.gray[500]}`,
    accent: `1px solid ${COLORS.cosmic}`,
    success: `1px solid ${COLORS.success}`,
    warning: `1px solid ${COLORS.warning}`,
    error: `1px solid ${COLORS.error}`,
  },

  // Focus and interaction states
  focus: {
    outline: `2px solid ${COLORS.cosmic}`,
    outlineOffset: '2px',
  },

  hover: {
    transform: 'translateY(-1px)',
    boxShadow: `0 4px 12px ${COLORS.gray[800]}60`,
  },
};

export { SPACING, FONT_SIZES, COLORS, OPACITY } from './design-system';
export { CosmicTheme };
export { GOD_CONFIG };

// Re-export commonly used values for convenience
export const spacing = CosmicTheme.spacing;
export const colors = CosmicTheme.colors;
export const gradients = CosmicTheme.gradients;
export const shadows = CosmicTheme.shadows;
export const borders = CosmicTheme.borders;
export const focus = CosmicTheme.focus;
export const hover = CosmicTheme.hover;
export const cardRadius = CosmicTheme.cardRadius;
export const cardPadding = CosmicTheme.cardPadding;
export const gridGap = CosmicTheme.gridGap;
export const sectionGap = CosmicTheme.sectionGap;
export const fontSizes = CosmicTheme.fontSizes;
export const opacity = CosmicTheme.opacity;

// Type definitions for design system usage
export type SpacingToken = keyof typeof SPACING;
export type ColorToken = keyof typeof COLORS;
export type FontSizeToken = keyof typeof FONT_SIZES;
export type OpacityToken = keyof typeof OPACITY;

// Utility functions for design system usage
export const getSpacing = (token: SpacingToken): number => SPACING[token];
export const getColor = (token: ColorToken): string => COLORS[token as keyof typeof COLORS];
export const getFontSize = (token: FontSizeToken): number => FONT_SIZES[token];
export const getOpacity = (token: OpacityToken): number => OPACITY[token];

// Component-specific design patterns
export const componentStyles = {
  card: {
    backgroundColor: colors.gray[800],
    border: borders.subtle,
    borderRadius: cardRadius,
    padding: cardPadding,
    boxShadow: shadows.subtle,
  },

  button: {
    primary: {
      background: gradients.shield,
      color: colors.white,
      border: 'none',
      borderRadius: spacing.sm,
      padding: `${spacing.sm}px ${spacing.lg}px`,
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      ...hover,
    },

    secondary: {
      backgroundColor: 'transparent',
      color: colors.cosmic,
      border: borders.accent,
      borderRadius: spacing.sm,
      padding: `${spacing.sm}px ${spacing.lg}px`,
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
  },

  input: {
    backgroundColor: GOD_CONFIG.theme.colors.surface.dark,
    border: `1px solid ${GOD_CONFIG.theme.colors.neutral}`,
    borderRadius: spacing.sm,
    padding: `${spacing.sm}px ${spacing.md}px`,
    color: GOD_CONFIG.theme.colors.primary,
    fontSize: fontSizes.base,
    fontFamily: GOD_CONFIG.theme.fonts.primary,
    outline: 'none',
    transition: 'border-color 0.2s ease',

    '&:focus': {
      borderColor: GOD_CONFIG.theme.colors.secondary,
      boxShadow: `0 0 0 2px ${GOD_CONFIG.theme.colors.secondary}20`,
    },
  },

  text: {
    primary: {
      color: colors.white,
      fontSize: fontSizes.base,
    },

    secondary: {
      color: colors.gray[400],
      fontSize: fontSizes.sm,
    },

    muted: {
      color: colors.gray[500],
      fontSize: fontSizes.xs,
    },

    accent: {
      color: colors.cosmic,
      fontWeight: 600,
    },
  },
} as const;

// Ensure all components use these unified tokens for design synergy