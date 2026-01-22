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
  // Core semantic colors
  cosmic: '#C084FC', // Violet - spiritual, quantum
  delta: '#34D399',  // Green - growth, nature, delta topology
  aries: '#F59E0B',  // Gold - energy, fire, transformation
  saturn: '#64748B', // Gray - structure, discipline, boundaries
  love: '#FF6B9D',   // Pink - connection, empathy, love
  unity: '#60A5FA',  // Blue - harmony, communication, unity
  signal: '#F87171', // Red - warning, danger, high voltage

  // Extended palette for UI states
  success: '#10B981',    // Green - success, security
  warning: '#F59E0B',    // Amber - caution, warning
  error: '#EF4444',      // Red - error, danger
  info: '#3B82F6',       // Blue - information, calm

  // Neutrals
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Quantum colors (SIC-POVM inspired)
  quantum: {
    psi0: '#FF6B9D',  // |ψ₀⟩ - Love state
    psi1: '#60A5FA',  // |ψ₁⟩ - Unity state
    psi2: '#34D399',  // |ψ₂⟩ - Delta state
    psi3: '#F59E0B',  // |ψ₃⟩ - Aries state
  }
};

// Magical polish: every pixel, every ratio, every color is cosmic and precise.