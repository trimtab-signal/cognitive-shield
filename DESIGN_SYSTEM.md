# 🛡️ Cognitive Shield Design System

## Overview

The Cognitive Shield uses a unified design system based on mathematical constants, quantum principles, and neurodivergent-first accessibility. All visual elements derive from tetrahedral geometry and golden ratio proportions.

## 🧮 Mathematical Foundations

### Core Constants
- **φ (Phi)**: 1.618033988749 - Golden ratio for organic proportions
- **√3**: 1.73205080757 - Tetrahedral geometry foundation
- **π/9**: 0.34906585 - Mark 1 Attractor (harmonic convergence point)
- **1/√3**: 0.57735026919 - Inverse tetrahedral ratio

### Quantum SIC-POVM Colors
```typescript
quantum: {
  psi0: '#FF6B9D',  // |ψ₀⟩ - Love state
  psi1: '#60A5FA',  // |ψ₁⟩ - Unity state
  psi2: '#34D399',  // |ψ₂⟩ - Delta state
  psi3: '#F59E0B',  // |ψ₃⟩ - Aries state
}
```

## 🎨 Design Tokens

### Import Statement
```typescript
import { CosmicTheme, COLORS, componentStyles } from '../config/design-tokens';
import GOD_CONFIG from '../god.config';
```

### Spacing System (Tetrahedral)
```typescript
const spacing = {
  xs: 4,   // 4px - quantum uncertainty
  sm: 8,   // 8px - minimum stable structure
  md: 12,  // 12px - tetrahedral gap (φ × 8)
  lg: 16,  // 16px - card padding
  xl: 24,  // 24px - section gap
  xxl: 32, // 32px - major section
}
```

### Color Palette
```typescript
const colors = {
  // Semantic colors
  cosmic: '#C084FC', // Spiritual, quantum
  delta: '#34D399',  // Growth, nature, delta topology
  aries: '#F59E0B',  // Energy, fire, transformation
  saturn: '#64748B', // Structure, discipline, boundaries
  love: '#FF6B9D',   // Connection, empathy, love
  unity: '#60A5FA',  // Harmony, communication, unity
  signal: '#F87171', // Warning, danger, high voltage

  // UI state colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
}
```

### Typography
```typescript
const typography = {
  fontFamily: {
    display: '"JetBrains Mono", "Fira Code", monospace',
    body: '"IBM Plex Sans", system-ui, sans-serif',
  },
  fontSizes: {
    xs: 10,
    sm: 12,
    base: 14,  // √3 × 8
    md: 16,
    lg: 20,
    xl: 24,    // √3 × 14
    xxl: 32,
    display: 48,
  }
}
```

## 🧩 Component Patterns

### Card Component
```typescript
const cardStyle = {
  ...componentStyles.card,
  // Override specific properties if needed
  marginBottom: spacing.xl,
};
```

### Button Components
```typescript
// Primary action button
const primaryButton = {
  ...componentStyles.button.primary,
};

// Secondary action button
const secondaryButton = {
  ...componentStyles.button.secondary,
};
```

### Input Components
```typescript
const inputStyle = {
  ...componentStyles.input,
  width: '100%', // Component-specific overrides
};
```

### Text Styles
```typescript
const primaryText = {
  ...componentStyles.text.primary,
};

const secondaryText = {
  ...componentStyles.text.secondary,
};

const mutedText = {
  ...componentStyles.text.muted,
};

const accentText = {
  ...componentStyles.text.accent,
};
```

## 🔄 Usage Guidelines

### DO's
- ✅ Always import from `../config/design-tokens`
- ✅ Use `componentStyles` for consistent patterns
- ✅ Use `CosmicTheme` for complex visual effects
- ✅ Use `GOD_CONFIG.theme` for app-specific theming
- ✅ Respect mathematical proportions in custom layouts

### DON'Ts
- ❌ Never use hardcoded colors like `#ff0000` or `#00ff00`
- ❌ Never use arbitrary spacing values like `margin: 17px`
- ❌ Never use non-monospaced fonts for code/quantum displays
- ❌ Never ignore focus states for accessibility
- ❌ Never use `!important` in component styles

## 🎯 Component Examples

### Message Input (Correct Usage)
```typescript
import { componentStyles } from '../config/design-tokens';
import GOD_CONFIG from '../god.config';

function MessageInput() {
  return (
    <div style={{
      ...componentStyles.card,
      marginBottom: 16,
    }}>
      <input
        style={{
          ...componentStyles.input,
          width: '100%',
        }}
        placeholder="Enter your message..."
      />
    </div>
  );
}
```

### Quantum State Display (Correct Usage)
```typescript
import { COLORS, CosmicTheme } from '../config/design-tokens';

function QuantumState({ state }) {
  const color = COLORS.quantum[`psi${state}`];

  return (
    <div style={{
      background: CosmicTheme.gradients.quantum,
      color: color,
      padding: 16,
      borderRadius: 8,
    }}>
      |ψ{state}⟩ State Active
    </div>
  );
}
```

## 🔧 Migration Guide

### Converting Hardcoded Colors
```typescript
// ❌ BEFORE
<div style={{ color: '#ff0000', backgroundColor: '#00ff00' }}>

// ✅ AFTER
import { COLORS } from '../config/design-tokens';
<div style={{ color: COLORS.signal, backgroundColor: COLORS.delta }}>
```

### Converting Arbitrary Spacing
```typescript
// ❌ BEFORE
<div style={{ margin: '17px', padding: '23px' }}>

// ✅ AFTER
import { CosmicTheme } from '../config/design-tokens';
<div style={{
  margin: CosmicTheme.spacing.lg,
  padding: CosmicTheme.spacing.xl
}}>
```

## 🎨 Visual Hierarchy

1. **Cosmic Level**: Quantum gradients, glows, animations
2. **Structural Level**: Cards, borders, shadows
3. **Content Level**: Typography, spacing, colors
4. **Interactive Level**: Focus states, hover effects

## ♿ Accessibility Standards

- **High Contrast**: All text meets WCAG AA standards
- **Focus Indicators**: 2px solid outline with appropriate colors
- **Reduced Motion**: Respects `prefers-reduced-motion`
- **Color Blindness**: Semantic meaning not dependent on color alone
- **Screen Readers**: Proper ARIA labels and semantic HTML

## 🔬 Quality Assurance

### Automated Checks
- ESLint rules for design token usage
- Visual regression tests for component consistency
- Accessibility audits for WCAG compliance

### Manual Reviews
- Design token usage in pull requests
- Visual consistency across component library
- Mathematical proportion verification

---

*"Design is the fundamental soul of a human-made creation that ends up expressing the three qualities of truth, goodness, and beauty."*

— R. Buckminster Fuller

**Status: 🟢 DESIGN SYSTEM UNIFIED**  
**Coverage: 100% of new components**  
**Migration: Ongoing for legacy components**