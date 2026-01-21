// Magical Math Overlay for Systemizer UX
import React from 'react';
import { SPACING, FONT_SIZES, COLORS, OPACITY } from '../../config/design-system';

export function MathOverlay() {
  // Example: show spacing, ratios, and font sizes visually
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      zIndex: 9999,
      background: 'none',
    }}>
      {/* Spacing grid */}
      {[...Array(64)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: i * SPACING.sm,
          left: 0,
          width: '100vw',
          height: '1px',
          background: COLORS.cosmic,
          opacity: OPACITY.subtle,
        }} />
      ))}
      {/* Font size markers */}
      {Object.entries(FONT_SIZES).map(([key, size], idx) => (
        <div key={key} style={{
          position: 'absolute',
          top: idx * 48 + 16,
          left: '8px',
          fontSize: size,
          color: COLORS.love,
          opacity: OPACITY.normal,
          fontWeight: 700,
        }}>
          {key}: {size}px
        </div>
      ))}
      {/* Ratio overlays */}
      <div style={{
        position: 'absolute',
        bottom: 32,
        left: '50%',
        transform: 'translateX(-50%)',
        color: COLORS.delta,
        fontSize: FONT_SIZES.lg,
        fontWeight: 600,
        opacity: OPACITY.normal,
        background: '#111827CC',
        borderRadius: 8,
        padding: '8px 16px',
        border: `1px solid ${COLORS.cosmic}`,
      }}>
        √3 = 1.732 | φ = 1.618 | 1/√3 = 0.577 | 1/3 = 0.333
      </div>
    </div>
  );
}
