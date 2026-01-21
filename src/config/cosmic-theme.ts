// UNIVERSAL COSMIC THEME ENGINE
// All colors, gradients, shadows, and animations are derived from math

import { SPACING, FONT_SIZES, COLORS, OPACITY } from './design-system';

export const CosmicTheme = {
  // Mathematical gradients
  backgroundGradient: `radial-gradient(circle at 60% 20%, ${COLORS.cosmic}22 0%, ${COLORS.saturn} 100%)`,
  cardGradient: `linear-gradient(135deg, ${COLORS.delta}22 0%, ${COLORS.love}22 100%)`,
  cosmicGlow: `0 0 64px 8px ${COLORS.cosmic}55, 0 0 128px 32px ${COLORS.love}22`,
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
  // Card and grid spacing
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
};

// All theme values are derived from math and cosmic constants. Use CosmicTheme everywhere for universal beauty.