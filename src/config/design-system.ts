// DESIGN SYSTEM CONSTANTS (Magical Polish)
// Mathematical precision, geodesic ratios, and cosmic color

export const SPACING = {
  xs: 4,   // 4px
  sm: 8,   // 8px
  md: 12,  // 12px (tetrahedral gap)
  lg: 16,  // 16px (card padding)
  xl: 24,  // 24px (section gap)
  xxl: 32, // 32px (major section)
  phi: 13,     // ≈ φ × 8 = 1.618 × 8 ≈ 13
  sqrt3: 14,   // ≈ √3 × 8 = 1.732 × 8 ≈ 14
  invSqrt3: 5, // ≈ (1/√3) × 8 = 0.577 × 8 ≈ 5
} as const;

export const GRID_GAP = SPACING.md; // 12px
export const CARD_PADDING = SPACING.lg; // 16px
export const SECTION_GAP = SPACING.xl; // 24px

export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  base: 14, // √3 × 8
  md: 16,
  lg: 20,
  xl: 24, // √3 × 14
  xxl: 32,
  display: 48,
};

export const OPACITY = {
  disabled: 0.38, // ≈ 1/φ²
  subtle: 0.57,   // ≈ 1/√3
  normal: 0.85,
  emphasis: 1.0,
};

export const COLORS = {
  cosmic: '#C084FC', // Violet
  delta: '#34D399',  // Green
  aries: '#F59E0B',  // Gold
  saturn: '#64748B', // Gray
  love: '#FF6B9D',   // Pink
  unity: '#60A5FA',  // Blue
  signal: '#F87171', // Red
};

// Magical polish: every pixel, every ratio, every color is cosmic and precise.