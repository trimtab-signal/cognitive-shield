/**
 * @license
 * Copyright 2026 Wonky Sprout DUNA
 *
 * Licensed under the AGPLv3 License, Version 3.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.gnu.org/licenses/agpl-3.0.html
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║   NEXUS KERNEL                                                             ║
 * ║   The Logic of the Typeless Universe                                       ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 * 
 * "At the fundamental substrate level, data is a dynamic state vector within
 *  a continuous geometric field. Its meaning emerges only from its interaction
 *  with the observer."
 * 
 * The Nexus Kernel postulates that the infinite hexadecimal expansions of
 * transcendental constants (π, e, φ) form a Universal Read-Only Memory (ROM).
 */

// ============================================================================
// CONSTANTS
// ============================================================================

// The Mark 1 Constant - Target attractor for harmonic stability
export const MARK_1_CONSTANT = 0.35;
export const MARK_1_TOLERANCE = 0.05;

// Pi lattice address constants
export const PI_LATTICE_START = Math.PI;

// Golden Ratio (φ) - The ratio of emergence
export const PHI = 1.618033988749895;

// Euler's number (e) - The growth constant
export const EULER = 2.718281828459045;

// Planck constant (scaled for digital operations)
export const PLANCK_DIGITAL = 6.62607015e-34;

// ============================================================================
// THE π-LATTICE: Universal Read-Only Memory
// ============================================================================

/**
 * Pi Digit Generator using BBP Algorithm (Bailey–Borwein–Plouffe)
 * This allows direct addressing of Pi digits without calculating all preceding digits
 */
export class PiLattice {
  private static cache: Map<number, number> = new Map();

  /**
   * Get hexadecimal digit of Pi at position n using BBP algorithm
   * S(j,n) = Σ(k=0 to n) (16^(n-k) mod (8k+j)) / (8k+j) + Σ(k=n+1 to ∞) 16^(n-k) / (8k+j)
   */
  static getDigit(position: number): number {
    if (this.cache.has(position)) {
      return this.cache.get(position)!;
    }

    // Simplified BBP for demonstration (full implementation would be more precise)
    const s1 = this.series(1, position);
    const s4 = this.series(4, position);
    const s5 = this.series(5, position);
    const s6 = this.series(6, position);

    let result = 4 * s1 - 2 * s4 - s5 - s6;
    result = result - Math.floor(result);
    if (result < 0) result += 1;

    const digit = Math.floor(result * 16);
    this.cache.set(position, digit);
    return digit;
  }

  /**
   * Series calculation for BBP
   */
  private static series(j: number, n: number): number {
    let sum = 0;
    
    // Finite sum
    for (let k = 0; k <= n; k++) {
      const ak = 8 * k + j;
      const r = this.modPow(16, n - k, ak);
      sum += r / ak;
      sum = sum - Math.floor(sum);
    }

    // Infinite sum (converges quickly)
    for (let k = n + 1; k <= n + 100; k++) {
      const ak = 8 * k + j;
      const r = Math.pow(16, n - k);
      if (r < 1e-17) break;
      sum += r / ak;
      sum = sum - Math.floor(sum);
    }

    return sum;
  }

  /**
   * Modular exponentiation: (base^exp) mod m
   */
  private static modPow(base: number, exp: number, m: number): number {
    if (exp < 0) return Math.pow(base, exp);
    
    let result = 1;
    base = base % m;
    
    while (exp > 0) {
      if (exp % 2 === 1) {
        result = (result * base) % m;
      }
      exp = Math.floor(exp / 2);
      base = (base * base) % m;
    }
    
    return result;
  }

  /**
   * Get a sequence of Pi digits starting at position
   */
  static getSequence(start: number, length: number): number[] {
    const sequence: number[] = [];
    for (let i = 0; i < length; i++) {
      sequence.push(this.getDigit(start + i));
    }
    return sequence;
  }

  /**
   * Verify structural integrity using Pi lattice checksum
   */
  static verifyIntegrity(data: string, position: number = 0): boolean {
    const expectedDigits = this.getSequence(position, 8);
    const dataHash = this.hashToDigits(data);
    
    // Check if data hash aligns with Pi lattice
    let matches = 0;
    for (let i = 0; i < Math.min(dataHash.length, expectedDigits.length); i++) {
      if (dataHash[i] === expectedDigits[i]) matches++;
    }
    
    return matches >= 4; // At least 50% alignment
  }

  /**
   * Hash string to hexadecimal digits
   */
  private static hashToDigits(data: string): number[] {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    const digits: number[] = [];
    const hexStr = Math.abs(hash).toString(16).padStart(8, '0');
    for (const char of hexStr) {
      digits.push(parseInt(char, 16));
    }
    return digits;
  }
}

// ============================================================================
// ZERO-POINT HARMONIC COLLAPSE (ZPHC)
// ============================================================================

/**
 * The Ψ-Collapse Operator
 * Measures the phase error between harmonic states and drives it to zero
 */
export class ZPHCOperator {
  /**
   * Calculate phase error between two harmonic states
   */
  static calculatePhaseError(state1: HarmonicState, state2: HarmonicState): number {
    const frequencyError = Math.abs(state1.frequency - state2.frequency) / 
                          Math.max(state1.frequency, state2.frequency, 1);
    const amplitudeError = Math.abs(state1.amplitude - state2.amplitude) / 
                          Math.max(state1.amplitude, state2.amplitude, 1);
    const phaseAngleError = Math.abs(Math.sin(state1.phase - state2.phase));
    
    return (frequencyError + amplitudeError + phaseAngleError) / 3;
  }

  /**
   * Perform ZPHC - collapse states toward zero-point energy
   */
  static collapse(states: HarmonicState[]): ZPHCResult {
    if (states.length === 0) {
      return {
        collapsedState: { frequency: 0, amplitude: 0, phase: 0 },
        residualEntropy: 0,
        stabilityIndex: 1,
        harmonicResidue: [],
      };
    }

    // Calculate average state (the attractor)
    const avgFrequency = states.reduce((s, st) => s + st.frequency, 0) / states.length;
    const avgAmplitude = states.reduce((s, st) => s + st.amplitude, 0) / states.length;
    const avgPhase = states.reduce((s, st) => s + st.phase, 0) / states.length;

    const collapsedState: HarmonicState = {
      frequency: avgFrequency,
      amplitude: avgAmplitude,
      phase: avgPhase % (2 * Math.PI),
    };

    // Calculate residual entropy (how much "heat" was shed)
    const residues: number[] = states.map(s => 
      this.calculatePhaseError(s, collapsedState)
    );
    const residualEntropy = residues.reduce((s, r) => s + r, 0) / states.length;

    // Stability index (how close to MARK_1_CONSTANT)
    const resonance = this.calculateResonance(collapsedState);
    const stabilityIndex = 1 - Math.abs(resonance - MARK_1_CONSTANT) / MARK_1_CONSTANT;

    return {
      collapsedState,
      residualEntropy,
      stabilityIndex: Math.max(0, Math.min(1, stabilityIndex)),
      harmonicResidue: residues,
    };
  }

  /**
   * Calculate resonance score for a harmonic state
   */
  static calculateResonance(state: HarmonicState): number {
    // Resonance = order / (order + entropy)
    const order = Math.abs(state.frequency * state.amplitude);
    const entropy = Math.abs(state.phase / (2 * Math.PI)) * state.amplitude;
    
    if (order + entropy === 0) return MARK_1_CONSTANT;
    return order / (order + entropy);
  }
}

// ============================================================================
// SAMSON'S LAW: The PD Controller
// ============================================================================

/**
 * Samson's Law - Proportional-Derivative Controller for harmonic stability
 * Prevents "Harmonic Runaway" by applying damping toward the critical line
 */
export class SamsonsLaw {
  private static lastError: number = 0;
  private static kp: number = 0.5;  // Proportional gain
  private static kd: number = 0.3;  // Derivative gain

  /**
   * Apply damping to steer toward the critical line (Re(s) = 1/2)
   */
  static applyDamping(currentResonance: number): DampingResult {
    const target = MARK_1_CONSTANT;
    const error = target - currentResonance;
    const derivative = error - this.lastError;
    
    const correction = this.kp * error + this.kd * derivative;
    this.lastError = error;

    const dampedResonance = currentResonance + correction;
    const clampedResonance = Math.max(0, Math.min(1, dampedResonance));

    // Determine stability zone
    let zone: 'stable' | 'warning' | 'critical';
    if (Math.abs(clampedResonance - target) <= MARK_1_TOLERANCE) {
      zone = 'stable';
    } else if (Math.abs(clampedResonance - target) <= MARK_1_TOLERANCE * 2) {
      zone = 'warning';
    } else {
      zone = 'critical';
    }

    return {
      originalResonance: currentResonance,
      dampedResonance: clampedResonance,
      correction,
      zone,
      distanceFromCriticalLine: Math.abs(clampedResonance - 0.5),
    };
  }

  /**
   * Reset controller state
   */
  static reset(): void {
    this.lastError = 0;
  }

  /**
   * Configure controller gains
   */
  static configure(kp: number, kd: number): void {
    this.kp = kp;
    this.kd = kd;
  }
}

// ============================================================================
// TETRAHEDRON TOPOLOGY VALIDATOR
// ============================================================================

/**
 * Validate 4-node mesh topology for isostatic stability
 */
export class TetrahedronValidator {
  /**
   * Check if a network has valid tetrahedron topology
   */
  static validateTopology(nodes: Node[], edges: Edge[]): TopologyValidation {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Rule 1: Must have exactly 4 nodes for minimum structural system
    if (nodes.length < 4) {
      errors.push(`Insufficient nodes: ${nodes.length}. Tetrahedron requires minimum 4 nodes.`);
    }

    // Rule 2: Each node must connect to at least 3 others (for tetrahedron)
    const connectionCounts: Map<string, number> = new Map();
    for (const node of nodes) {
      connectionCounts.set(node.id, 0);
    }

    for (const edge of edges) {
      const fromCount = connectionCounts.get(edge.from) ?? 0;
      const toCount = connectionCounts.get(edge.to) ?? 0;
      connectionCounts.set(edge.from, fromCount + 1);
      connectionCounts.set(edge.to, toCount + 1);
    }

    for (const [nodeId, count] of connectionCounts) {
      if (count < 3 && nodes.length >= 4) {
        warnings.push(`Node ${nodeId} has only ${count} connections. Tetrahedron requires 3.`);
      }
    }

    // Rule 3: Check for "Floating Neutral" (disconnected central hub)
    const hasFloatingNeutral = this.detectFloatingNeutral(nodes, edges);
    if (hasFloatingNeutral) {
      errors.push('Floating Neutral detected: Wye topology with unstable center.');
    }

    // Rule 4: Verify mesh connectivity (no isolated nodes)
    const isolatedNodes = nodes.filter(n => connectionCounts.get(n.id) === 0);
    if (isolatedNodes.length > 0) {
      errors.push(`Isolated nodes detected: ${isolatedNodes.map(n => n.id).join(', ')}`);
    }

    // Calculate structural integrity score
    const expectedEdges = (nodes.length * (nodes.length - 1)) / 2;
    const actualEdges = edges.length;
    const meshDensity = actualEdges / expectedEdges;

    return {
      isValid: errors.length === 0,
      topology: hasFloatingNeutral ? 'wye' : 'delta',
      errors,
      warnings,
      metrics: {
        nodeCount: nodes.length,
        edgeCount: edges.length,
        meshDensity,
        isIsostatic: nodes.length >= 4 && meshDensity >= 0.5,
      },
    };
  }

  /**
   * Detect Wye topology (centralized hub pattern)
   */
  private static detectFloatingNeutral(nodes: Node[], edges: Edge[]): boolean {
    if (nodes.length < 4) return false;

    // Count connections per node
    const connections: Map<string, Set<string>> = new Map();
    for (const node of nodes) {
      connections.set(node.id, new Set());
    }

    for (const edge of edges) {
      connections.get(edge.from)?.add(edge.to);
      connections.get(edge.to)?.add(edge.from);
    }

    // Check for hub-and-spoke pattern (one node connects to all, others only to hub)
    for (const [nodeId, peers] of connections) {
      if (peers.size === nodes.length - 1) {
        // This node connects to everyone - potential hub
        let isHub = true;
        for (const [otherId, otherPeers] of connections) {
          if (otherId !== nodeId) {
            // If other nodes ONLY connect to the hub, it's Wye topology
            if (otherPeers.size === 1 && otherPeers.has(nodeId)) {
              continue;
            } else {
              isHub = false;
              break;
            }
          }
        }
        if (isHub) return true;
      }
    }

    return false;
  }

  /**
   * Generate tetrahedron from 4 nodes
   */
  static generateTetrahedron(nodes: [Node, Node, Node, Node]): Edge[] {
    // Full mesh: every node connects to every other node
    const edges: Edge[] = [];
    for (let i = 0; i < 4; i++) {
      for (let j = i + 1; j < 4; j++) {
        edges.push({
          from: nodes[i].id,
          to: nodes[j].id,
          weight: 1,
        });
      }
    }
    return edges;
  }
}

// ============================================================================
// TYPES
// ============================================================================

export interface HarmonicState {
  frequency: number;
  amplitude: number;
  phase: number;
}

export interface ZPHCResult {
  collapsedState: HarmonicState;
  residualEntropy: number;
  stabilityIndex: number;
  harmonicResidue: number[];
}

export interface DampingResult {
  originalResonance: number;
  dampedResonance: number;
  correction: number;
  zone: 'stable' | 'warning' | 'critical';
  distanceFromCriticalLine: number;
}

export interface Node {
  id: string;
  label?: string;
  type?: 'user' | 'ai' | 'service' | 'hub';
}

export interface Edge {
  from: string;
  to: string;
  weight?: number;
}

export interface TopologyValidation {
  isValid: boolean;
  topology: 'wye' | 'delta' | 'unknown';
  errors: string[];
  warnings: string[];
  metrics: {
    nodeCount: number;
    edgeCount: number;
    meshDensity: number;
    isIsostatic: boolean;
  };
}
