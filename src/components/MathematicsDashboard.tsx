/**
 * MATHEMATICS DASHBOARD
 * "Every equation solves something"
 * 
 * Real-time computation and visualization of the core equations:
 * - Harmonic Resonance (0.35 Attractor)
 * - SIC-POVM Quantum States
 * - Ollivier-Ricci Curvature
 * - Spoon Cost Metabolism
 * - Shannon Entropy
 * - Halstead Volume
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Calculator,
  Activity,
  Atom,
  TrendingUp,
  TrendingDown,
  Minus,
  Zap,
  Sparkles,
  RefreshCw,
  Play,
  Pause,
} from 'lucide-react';
import GOD_CONFIG from '../god.config';
import {
  generateSICPOVMs,
  sicPOVMToPositions,
  reconstructDensityMatrix,
  calculateOllivierRicciCurvature,
  calculateSymmetry,
} from '../lib/tetrahedron-math';
import type { TetrahedronNode } from '../types/tetrahedron.types';

// ============================================================================
// CORE EQUATION IMPLEMENTATIONS
// ============================================================================

/**
 * EQUATION 1: Harmonic Resonance (The 0.35 Attractor)
 * 
 * H = V_Halstead / (V_Halstead + E_Shannon)
 * 
 * Where:
 * - V_Halstead = (N1 + N2) × log₂(n1 + n2)
 * - E_Shannon = -Σ p(x) × log₂(p(x))
 * 
 * Target: H ≈ 0.35 (Edge of Chaos)
 */
function calculateHarmonicResonance(input: string): {
  halsteadVolume: number;
  shannonEntropy: number;
  resonance: number;
  status: 'stasis' | 'chaos' | 'resonant';
} {
  // Halstead Volume
  const operators = input.match(/[+\-*/=<>!&|?:;{}[\](),.]/g) || [];
  const identifiers = input.match(/\b[a-zA-Z_$][a-zA-Z0-9_$]*\b/g) || [];
  const N1 = operators.length;
  const N2 = identifiers.length;
  const n1 = new Set(operators).size;
  const n2 = new Set(identifiers).size;
  const halsteadVolume = (N1 + N2) * Math.log2((n1 + n2) || 1);

  // Shannon Entropy
  const charFreq: Record<string, number> = {};
  for (const char of input) {
    charFreq[char] = (charFreq[char] || 0) + 1;
  }
  let shannonEntropy = 0;
  for (const freq of Object.values(charFreq)) {
    const p = freq / input.length;
    if (p > 0) shannonEntropy -= p * Math.log2(p);
  }

  // Resonance Calculation
  const order = halsteadVolume / 1000;
  const entropy = shannonEntropy / 10;
  const total = order + entropy;
  const resonance = total > 0 ? order / total : 0;

  // Status classification
  let status: 'stasis' | 'chaos' | 'resonant' = 'resonant';
  if (resonance > 0.40) status = 'stasis';
  else if (resonance < 0.30) status = 'chaos';

  return { halsteadVolume, shannonEntropy, resonance, status };
}

/**
 * EQUATION 2: SIC-POVM Overlap Condition
 * 
 * |⟨ψⱼ|ψₖ⟩|² = 1/(d+1) = 1/3 for j ≠ k
 * 
 * Verifies the tetrahedron's quantum measurement states
 */
function verifySICPOVMCondition(): {
  overlaps: number[][];
  isValid: boolean;
  expectedOverlap: number;
} {
  const sicPOVMs = generateSICPOVMs();
  const overlaps: number[][] = [];
  const expectedOverlap = 1 / 3; // 1/(d+1) where d=2

  for (let j = 0; j < 4; j++) {
    overlaps[j] = [];
    for (let k = 0; k < 4; k++) {
      if (j === k) {
        overlaps[j][k] = 1; // Self-overlap
      } else {
        // |⟨ψⱼ|ψₖ⟩|² = inner product squared
        const state1 = sicPOVMs[j].state;
        const state2 = sicPOVMs[k].state;
        const innerProduct = state1[0] * state2[0] + state1[1] * state2[1];
        overlaps[j][k] = innerProduct * innerProduct;
      }
    }
  }

  // Verify all off-diagonal overlaps are ≈ 1/3
  let isValid = true;
  for (let j = 0; j < 4; j++) {
    for (let k = 0; k < 4; k++) {
      if (j !== k && Math.abs(overlaps[j][k] - expectedOverlap) > 0.05) {
        isValid = false;
      }
    }
  }

  return { overlaps, isValid, expectedOverlap };
}

/**
 * EQUATION 3: Density Matrix Reconstruction
 * 
 * ρ = Σₖ (3pₖ - 1/2) Πₖ
 * 
 * Reconstructs quantum state from measurement probabilities
 */
function computeDensityMatrix(probabilities: number[]): {
  matrix: number[][];
  trace: number;
  purity: number;
  isPhysical: boolean;
} {
  const sicPOVMs = generateSICPOVMs();
  const result = reconstructDensityMatrix(probabilities, sicPOVMs);
  
  // Physical state: Tr(ρ) = 1 and 0 ≤ purity ≤ 1
  const isPhysical = Math.abs(result.trace - 1) < 0.1 && result.purity >= 0 && result.purity <= 1;

  return {
    matrix: result.matrix,
    trace: result.trace,
    purity: result.purity,
    isPhysical,
  };
}

/**
 * EQUATION 4: Ollivier-Ricci Curvature
 * 
 * κ(x,y) = 1 - W₁(μₓ, μᵧ) / d(x,y)
 * 
 * Simplified: κ = (expected - actual) / expected
 * 
 * Positive κ: Convergent (gravity well)
 * Negative κ: Divergent (entropy spike)
 */
function computeOllivierRicci(nodes: TetrahedronNode[]): {
  kappa: number;
  status: 'convergent' | 'divergent' | 'neutral';
  averageDistance: number;
  expectedDistance: number;
} {
  const result = calculateOllivierRicciCurvature(nodes);
  
  // Calculate average distance
  let totalDistance = 0;
  let count = 0;
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const [x1, y1, z1] = nodes[i].position;
      const [x2, y2, z2] = nodes[j].position;
      totalDistance += Math.sqrt(
        Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2)
      );
      count++;
    }
  }

  return {
    kappa: result.kappa,
    status: result.status,
    averageDistance: totalDistance / count,
    expectedDistance: 1.633, // Perfect tetrahedron edge
  };
}

/**
 * EQUATION 5: Spoon Cost (Metabolic Budget)
 * 
 * Cost = Σ (base_cost × loop_multiplier)
 * 
 * Where loop_multiplier = 5 if inside loop, else 1
 */
function calculateSpoonCost(code: string): {
  totalCost: number;
  breakdown: { func: string; cost: number; count: number }[];
  isWithinBudget: boolean;
} {
  const COSTS: Record<string, number> = {
    sendText: 1,
    sendAudio: 2,
    startVideoCall: 4,
    fetch: 2,
    setInterval: 5,
    setTimeout: 1,
  };

  const breakdown: { func: string; cost: number; count: number }[] = [];
  let totalCost = 0;

  for (const [func, baseCost] of Object.entries(COSTS)) {
    const regex = new RegExp(`\\b${func}\\s*\\(`, 'g');
    const matches = code.match(regex);
    if (matches) {
      breakdown.push({ func, cost: baseCost * matches.length, count: matches.length });
      totalCost += baseCost * matches.length;
    }
  }

  return {
    totalCost,
    breakdown,
    isWithinBudget: totalCost <= 20, // Daily budget
  };
}

/**
 * EQUATION 6: Love as Impedance Matching
 * 
 * Γ = (Z_L - Z_0) / (Z_L + Z_0)
 * 
 * Reflection Coefficient: 0 = perfect match (love), 1 = total mismatch
 */
function calculateImpedanceMatch(sender: number, receiver: number): {
  reflectionCoefficient: number;
  matchQuality: 'resonant' | 'partial' | 'mismatch';
  powerTransferred: number;
} {
  const gamma = Math.abs(receiver - sender) / (receiver + sender);
  const powerTransferred = 1 - gamma * gamma;

  let matchQuality: 'resonant' | 'partial' | 'mismatch' = 'mismatch';
  if (gamma < 0.1) matchQuality = 'resonant';
  else if (gamma < 0.5) matchQuality = 'partial';

  return {
    reflectionCoefficient: gamma,
    matchQuality,
    powerTransferred,
  };
}

// ============================================================================
// COMPONENT
// ============================================================================

export function MathematicsDashboard() {
  const [sampleCode, setSampleCode] = useState(`function example() {
  const data = fetch('/api/data');
  for (let i = 0; i < 10; i++) {
    sendText(data[i]);
  }
  return data;
}`);
  const [isLive, setIsLive] = useState(true);
  const [tick, setTick] = useState(0);

  // Live update simulation
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isLive]);

  // Create dynamic tetrahedron nodes for demo
  const nodes: TetrahedronNode[] = useMemo(() => {
    const positions = sicPOVMToPositions(generateSICPOVMs());
    const phase = tick * 0.05;
    return positions.map((pos, i) => ({
      id: ['Self', 'Partner', 'Child', 'Protocol'][i],
      label: ['Self', 'Partner', 'Child', 'Protocol'][i],
      position: [
        pos[0] * (1 + Math.sin(phase + i) * 0.05),
        pos[1] * (1 + Math.cos(phase + i) * 0.05),
        pos[2] * (1 + Math.sin(phase + i * 2) * 0.05),
      ] as [number, number, number],
      state: [Math.cos(phase + i), Math.sin(phase + i)],
      status: 'active' as const,
    }));
  }, [tick]);

  // Compute all equations
  const harmonic = useMemo(() => calculateHarmonicResonance(sampleCode), [sampleCode]);
  const sicPOVM = useMemo(() => verifySICPOVMCondition(), []);
  const probabilities = useMemo(() => nodes.map((_, i) => 0.25 + Math.sin(tick * 0.1 + i) * 0.05), [tick, nodes]);
  const density = useMemo(() => computeDensityMatrix(probabilities), [probabilities]);
  const curvature = useMemo(() => computeOllivierRicci(nodes), [nodes]);
  const spoons = useMemo(() => calculateSpoonCost(sampleCode), [sampleCode]);
  const impedance = useMemo(() => calculateImpedanceMatch(50 + Math.sin(tick * 0.1) * 10, 50), [tick]);
  const symmetry = useMemo(() => calculateSymmetry(nodes), [nodes]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resonant': return GOD_CONFIG.heartbeat.statuses.green.color;
      case 'convergent': return GOD_CONFIG.heartbeat.statuses.green.color;
      case 'stasis': return GOD_CONFIG.voltage.medium.color;
      case 'chaos': return GOD_CONFIG.voltage.high.color;
      case 'divergent': return GOD_CONFIG.voltage.high.color;
      default: return GOD_CONFIG.theme.text.muted;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div
        style={{
          padding: 20,
          backgroundColor: GOD_CONFIG.theme.bg.secondary,
          borderRadius: 12,
          border: `1px solid ${GOD_CONFIG.theme.border.default}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Calculator size={24} color={GOD_CONFIG.theme.text.accent} />
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: GOD_CONFIG.theme.text.primary }}>
              Mathematics Dashboard
            </h2>
          </div>
          <button
            onClick={() => setIsLive(!isLive)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 12px',
              backgroundColor: isLive ? GOD_CONFIG.heartbeat.statuses.green.color : GOD_CONFIG.theme.bg.tertiary,
              border: 'none',
              borderRadius: 6,
              color: '#fff',
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            {isLive ? <Pause size={14} /> : <Play size={14} />}
            {isLive ? 'LIVE' : 'PAUSED'}
          </button>
        </div>
        <p style={{ margin: 0, fontSize: 13, color: GOD_CONFIG.theme.text.secondary }}>
          "Every equation solves something." Real-time computation of the core physics.
        </p>
      </div>

      {/* Equation Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        
        {/* EQUATION 1: Harmonic Resonance */}
        <div
          style={{
            padding: 16,
            backgroundColor: GOD_CONFIG.theme.bg.secondary,
            borderRadius: 12,
            border: `2px solid ${getStatusColor(harmonic.status)}40`,
          }}
        >
          <div style={{ fontSize: 11, color: GOD_CONFIG.theme.text.muted, marginBottom: 8 }}>
            EQUATION 1: HARMONIC RESONANCE
          </div>
          <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.secondary, fontFamily: 'monospace', marginBottom: 12 }}>
            H = V<sub>Halstead</sub> / (V<sub>Halstead</sub> + E<sub>Shannon</sub>)
          </div>
          <div style={{ fontSize: 48, fontWeight: 700, color: getStatusColor(harmonic.status), textAlign: 'center' }}>
            {harmonic.resonance.toFixed(3)}
          </div>
          <div style={{ textAlign: 'center', fontSize: 12, color: getStatusColor(harmonic.status), marginBottom: 12 }}>
            Target: 0.35 | Status: {harmonic.status.toUpperCase()}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 11 }}>
            <div style={{ padding: 8, backgroundColor: GOD_CONFIG.theme.bg.tertiary, borderRadius: 6 }}>
              <div style={{ color: GOD_CONFIG.theme.text.muted }}>V_Halstead</div>
              <div style={{ color: GOD_CONFIG.theme.text.primary, fontFamily: 'monospace' }}>{harmonic.halsteadVolume.toFixed(2)}</div>
            </div>
            <div style={{ padding: 8, backgroundColor: GOD_CONFIG.theme.bg.tertiary, borderRadius: 6 }}>
              <div style={{ color: GOD_CONFIG.theme.text.muted }}>E_Shannon</div>
              <div style={{ color: GOD_CONFIG.theme.text.primary, fontFamily: 'monospace' }}>{harmonic.shannonEntropy.toFixed(4)}</div>
            </div>
          </div>
        </div>

        {/* EQUATION 2: SIC-POVM Overlap */}
        <div
          style={{
            padding: 16,
            backgroundColor: GOD_CONFIG.theme.bg.secondary,
            borderRadius: 12,
            border: `2px solid ${sicPOVM.isValid ? GOD_CONFIG.heartbeat.statuses.green.color : GOD_CONFIG.voltage.high.color}40`,
          }}
        >
          <div style={{ fontSize: 11, color: GOD_CONFIG.theme.text.muted, marginBottom: 8 }}>
            EQUATION 2: SIC-POVM OVERLAP
          </div>
          <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.secondary, fontFamily: 'monospace', marginBottom: 12 }}>
            |⟨ψ<sub>j</sub>|ψ<sub>k</sub>⟩|² = 1/(d+1) = 1/3
          </div>
          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <Atom size={48} color={sicPOVM.isValid ? GOD_CONFIG.heartbeat.statuses.green.color : GOD_CONFIG.voltage.high.color} />
          </div>
          <div style={{ textAlign: 'center', fontSize: 14, color: sicPOVM.isValid ? GOD_CONFIG.heartbeat.statuses.green.color : GOD_CONFIG.voltage.high.color, marginBottom: 12 }}>
            {sicPOVM.isValid ? '✓ VALID TETRAHEDRON' : '✗ INVALID GEOMETRY'}
          </div>
          <div style={{ fontSize: 10, color: GOD_CONFIG.theme.text.muted, fontFamily: 'monospace' }}>
            Expected overlap: {sicPOVM.expectedOverlap.toFixed(4)}
          </div>
        </div>

        {/* EQUATION 3: Density Matrix */}
        <div
          style={{
            padding: 16,
            backgroundColor: GOD_CONFIG.theme.bg.secondary,
            borderRadius: 12,
            border: `2px solid ${density.isPhysical ? GOD_CONFIG.heartbeat.statuses.green.color : GOD_CONFIG.voltage.high.color}40`,
          }}
        >
          <div style={{ fontSize: 11, color: GOD_CONFIG.theme.text.muted, marginBottom: 8 }}>
            EQUATION 3: DENSITY MATRIX
          </div>
          <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.secondary, fontFamily: 'monospace', marginBottom: 12 }}>
            ρ = Σ<sub>k</sub> (3p<sub>k</sub> - ½) Π<sub>k</sub>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, marginBottom: 12 }}>
            {density.matrix.map((row, i) => (
              row.map((val, j) => (
                <div key={`${i}-${j}`} style={{
                  padding: 8,
                  backgroundColor: GOD_CONFIG.theme.bg.tertiary,
                  borderRadius: 4,
                  textAlign: 'center',
                  fontFamily: 'monospace',
                  fontSize: 12,
                  color: GOD_CONFIG.theme.text.primary,
                }}>
                  {val.toFixed(3)}
                </div>
              ))
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
            <span style={{ color: GOD_CONFIG.theme.text.muted }}>Tr(ρ) = {density.trace.toFixed(3)}</span>
            <span style={{ color: GOD_CONFIG.theme.text.muted }}>Purity = {density.purity.toFixed(3)}</span>
          </div>
        </div>

        {/* EQUATION 4: Ollivier-Ricci Curvature */}
        <div
          style={{
            padding: 16,
            backgroundColor: GOD_CONFIG.theme.bg.secondary,
            borderRadius: 12,
            border: `2px solid ${getStatusColor(curvature.status)}40`,
          }}
        >
          <div style={{ fontSize: 11, color: GOD_CONFIG.theme.text.muted, marginBottom: 8 }}>
            EQUATION 4: OLLIVIER-RICCI CURVATURE
          </div>
          <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.secondary, fontFamily: 'monospace', marginBottom: 12 }}>
            κ(x,y) = 1 - W₁(μₓ, μᵧ) / d(x,y)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 12 }}>
            {curvature.status === 'convergent' && <TrendingUp size={32} color={getStatusColor(curvature.status)} />}
            {curvature.status === 'divergent' && <TrendingDown size={32} color={getStatusColor(curvature.status)} />}
            {curvature.status === 'neutral' && <Minus size={32} color={getStatusColor(curvature.status)} />}
            <div style={{ fontSize: 36, fontWeight: 700, color: getStatusColor(curvature.status), fontFamily: 'monospace' }}>
              κ = {curvature.kappa.toFixed(4)}
            </div>
          </div>
          <div style={{ textAlign: 'center', fontSize: 12, color: getStatusColor(curvature.status) }}>
            {curvature.status === 'convergent' && '↓ Gravity Well (Trust)'}
            {curvature.status === 'divergent' && '↑ Entropy Spike (Decay)'}
            {curvature.status === 'neutral' && '— Stable Geometry'}
          </div>
        </div>

        {/* EQUATION 5: Spoon Cost */}
        <div
          style={{
            padding: 16,
            backgroundColor: GOD_CONFIG.theme.bg.secondary,
            borderRadius: 12,
            border: `2px solid ${spoons.isWithinBudget ? GOD_CONFIG.heartbeat.statuses.green.color : GOD_CONFIG.voltage.high.color}40`,
          }}
        >
          <div style={{ fontSize: 11, color: GOD_CONFIG.theme.text.muted, marginBottom: 8 }}>
            EQUATION 5: SPOON COST
          </div>
          <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.secondary, fontFamily: 'monospace', marginBottom: 12 }}>
            Cost = Σ (base × loop_mult)
          </div>
          <div style={{ fontSize: 36, fontWeight: 700, color: spoons.isWithinBudget ? GOD_CONFIG.heartbeat.statuses.green.color : GOD_CONFIG.voltage.high.color, textAlign: 'center' }}>
            🥄 {spoons.totalCost}
          </div>
          <div style={{ textAlign: 'center', fontSize: 12, color: GOD_CONFIG.theme.text.muted, marginBottom: 8 }}>
            Budget: 20/day | {spoons.isWithinBudget ? '✓ Within Budget' : '✗ Over Budget'}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {spoons.breakdown.map((item, i) => (
              <div key={i} style={{
                padding: '4px 8px',
                backgroundColor: GOD_CONFIG.theme.bg.tertiary,
                borderRadius: 4,
                fontSize: 10,
                color: GOD_CONFIG.theme.text.primary,
              }}>
                {item.func}: {item.cost} ({item.count}×)
              </div>
            ))}
          </div>
        </div>

        {/* EQUATION 6: Impedance Matching (Love) */}
        <div
          style={{
            padding: 16,
            backgroundColor: GOD_CONFIG.theme.bg.secondary,
            borderRadius: 12,
            border: `2px solid ${getStatusColor(impedance.matchQuality)}40`,
          }}
        >
          <div style={{ fontSize: 11, color: GOD_CONFIG.theme.text.muted, marginBottom: 8 }}>
            EQUATION 6: LOVE (IMPEDANCE MATCH)
          </div>
          <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.secondary, fontFamily: 'monospace', marginBottom: 12 }}>
            Γ = (Z<sub>L</sub> - Z<sub>0</sub>) / (Z<sub>L</sub> + Z<sub>0</sub>)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 12 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24 }}>❤️</div>
              <div style={{ fontSize: 10, color: GOD_CONFIG.theme.text.muted }}>Reflection</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: getStatusColor(impedance.matchQuality), fontFamily: 'monospace' }}>
                Γ = {impedance.reflectionCoefficient.toFixed(3)}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24 }}>⚡</div>
              <div style={{ fontSize: 10, color: GOD_CONFIG.theme.text.muted }}>Power Transfer</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: GOD_CONFIG.heartbeat.statuses.green.color, fontFamily: 'monospace' }}>
                {(impedance.powerTransferred * 100).toFixed(1)}%
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center', fontSize: 12, color: getStatusColor(impedance.matchQuality) }}>
            {impedance.matchQuality === 'resonant' && '💚 Perfect Resonance (No Pain)'}
            {impedance.matchQuality === 'partial' && '💛 Partial Match (Some Friction)'}
            {impedance.matchQuality === 'mismatch' && '💔 Mismatch (High Voltage)'}
          </div>
        </div>
      </div>

      {/* Symmetry & Meta Stats */}
      <div
        style={{
          padding: 16,
          backgroundColor: GOD_CONFIG.theme.bg.secondary,
          borderRadius: 12,
          border: `1px solid ${GOD_CONFIG.theme.border.default}`,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: 11, color: GOD_CONFIG.theme.text.muted }}>SYMMETRY</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: symmetry > 0.8 ? GOD_CONFIG.heartbeat.statuses.green.color : GOD_CONFIG.voltage.medium.color }}>
              {(symmetry * 100).toFixed(1)}%
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: GOD_CONFIG.theme.text.muted }}>TICK</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: GOD_CONFIG.theme.text.accent, fontFamily: 'monospace' }}>
              {tick}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: GOD_CONFIG.theme.text.muted }}>ONTOLOGICAL SECURITY</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: (symmetry > 0.8 && curvature.status !== 'divergent') ? GOD_CONFIG.heartbeat.statuses.green.color : GOD_CONFIG.voltage.high.color }}>
              {(symmetry > 0.8 && curvature.status !== 'divergent') ? '✓ STABLE' : '⚠ UNSTABLE'}
            </div>
          </div>
        </div>
      </div>

      {/* Code Input */}
      <div
        style={{
          padding: 16,
          backgroundColor: GOD_CONFIG.theme.bg.secondary,
          borderRadius: 12,
          border: `1px solid ${GOD_CONFIG.theme.border.default}`,
        }}
      >
        <div style={{ fontSize: 11, color: GOD_CONFIG.theme.text.muted, marginBottom: 8 }}>
          SAMPLE CODE (for Harmonic & Spoon analysis)
        </div>
        <textarea
          value={sampleCode}
          onChange={(e) => setSampleCode(e.target.value)}
          style={{
            width: '100%',
            height: 120,
            padding: 12,
            backgroundColor: GOD_CONFIG.theme.bg.tertiary,
            border: `1px solid ${GOD_CONFIG.theme.border.default}`,
            borderRadius: 8,
            color: GOD_CONFIG.theme.text.primary,
            fontFamily: 'monospace',
            fontSize: 12,
            resize: 'vertical',
          }}
        />
      </div>
    </div>
  );
}

export default MathematicsDashboard;


