/**
 * FISHER-ESCOLÀ PHYSICS ENGINE
 * Quantum Biology Simulation: Posner Molecules & Coherence Dynamics
 *
 * Based on Matthew P.A. Fisher's quantum brain hypothesis:
 * - Posner molecules (Ca₉(PO₄)₆) as biological qubits
 * - Calcium phosphate clusters with phosphorus-31 nuclear spins
 * - Quantum coherence in biological systems at body temperature
 *
 * References:
 * - Fisher, "Quantum cognition: The possibility of processing with nuclear spins in the brain"
 * - Straub et al., "Evidence for a possible quantum effect on the formation of lithium-doped amorphous calcium phosphate"
 * - 2025 PNAS paper validating lithium isotope effects
 */

export interface PosnerMolecule {
  id: string;
  position: { x: number; y: number; z: number };
  calciumAtoms: CalciumAtom[];
  phosphateGroups: PhosphateGroup[];
  coherence: number; // 0-1, quantum coherence level
  entanglement: Map<string, number>; // Entanglement with other molecules
  formationTime: number;
  decayTime?: number;
}

export interface CalciumAtom {
  id: string;
  position: { x: number; y: number; z: number };
  charge: number;
  spin: number; // Nuclear spin (Ca-43 has I=7/2)
}

export interface PhosphateGroup {
  id: string;
  position: { x: number; y: number; z: number };
  phosphorus: PhosphorusAtom;
  oxygenAtoms: OxygenAtom[];
}

export interface PhosphorusAtom {
  id: string;
  nuclearSpin: number; // P-31 has I=1/2 (the biological qubit)
  magneticMoment: number;
  entanglementPhase: number;
}

export interface OxygenAtom {
  id: string;
  charge: number;
}

export interface QuantumField {
  calciumConcentration: number; // [Ca²⁺] in mM
  phosphateConcentration: number; // [PO₄³⁻] in mM
  ph: number; // Affects cluster formation
  temperature: number; // Affects coherence time
  electromagneticField: { frequency: number; amplitude: number }; // External EM fields
}

export interface CoherenceMetrics {
  hurstExponent: number; // H ≈ 0.35 target
  entropy: number; // Distance from attractor
  coherenceTime: number; // T₂ in milliseconds
  fidelity: number; // Quantum state preservation
  entanglementStrength: number;
}

export class FisherEscolaPhysics {
  private posnerMolecules: Map<string, PosnerMolecule> = new Map();
  private quantumField: QuantumField;
  private time: number = 0;
  private coherenceHistory: CoherenceMetrics[] = [];

  constructor(initialField?: Partial<QuantumField>) {
    this.quantumField = {
      calciumConcentration: 2.5, // mM, typical intracellular
      phosphateConcentration: 1.0, // mM
      ph: 7.2, // Physiological pH
      temperature: 310.15, // 37°C in Kelvin
      electromagneticField: { frequency: 40, amplitude: 0.001 }, // 40Hz gamma
      ...initialField
    };
  }

  /**
   * Simulate Posner molecule formation
   * Based on 2025 PNAS lithium isotope experiment
   */
  formPosnerMolecule(position: { x: number; y: number; z: number }): PosnerMolecule | null {
    // Formation probability based on concentrations and pH
    const formationProb = this.calculateFormationProbability();

    if (Math.random() > formationProb) {
      return null;
    }

    // Create calcium atoms (9 atoms)
    const calciumAtoms: CalciumAtom[] = [];
    for (let i = 0; i < 9; i++) {
      calciumAtoms.push({
        id: `ca_${i}_${Date.now()}`,
        position: {
          x: position.x + (Math.random() - 0.5) * 0.1,
          y: position.y + (Math.random() - 0.5) * 0.1,
          z: position.z + (Math.random() - 0.5) * 0.1
        },
        charge: 2,
        spin: 7/2 // Ca-43 nuclear spin
      });
    }

    // Create phosphate groups (6 groups)
    const phosphateGroups: PhosphateGroup[] = [];
    for (let i = 0; i < 6; i++) {
      const phosphorus: PhosphorusAtom = {
        id: `p_${i}_${Date.now()}`,
        nuclearSpin: 1/2, // P-31 qubit
        magneticMoment: 1.131, // Nuclear magneton units
        entanglementPhase: Math.random() * 2 * Math.PI
      };

      const oxygenAtoms: OxygenAtom[] = [];
      for (let j = 0; j < 4; j++) {
        oxygenAtoms.push({
          id: `o_${i}_${j}_${Date.now()}`,
          charge: -2
        });
      }

      phosphateGroups.push({
        id: `po4_${i}_${Date.now()}`,
        position: {
          x: position.x + (Math.random() - 0.5) * 0.08,
          y: position.y + (Math.random() - 0.5) * 0.08,
          z: position.z + (Math.random() - 0.5) * 0.08
        },
        phosphorus,
        oxygenAtoms
      });
    }

    const molecule: PosnerMolecule = {
      id: `posner_${Date.now()}`,
      position,
      calciumAtoms,
      phosphateGroups,
      coherence: this.calculateInitialCoherence(),
      entanglement: new Map(),
      formationTime: this.time
    };

    this.posnerMolecules.set(molecule.id, molecule);
    return molecule;
  }

  /**
   * Calculate formation probability based on chemical conditions
   * Based on experimental calcium phosphate nucleation kinetics
   */
  private calculateFormationProbability(): number {
    const { calciumConcentration, phosphateConcentration, ph, temperature } = this.quantumField;

    // Solubility product approximation for calcium phosphate
    const ionicProduct = calciumConcentration * Math.pow(phosphateConcentration, 3);

    // pH dependence (apatite formation optimal at pH 7-8)
    const phFactor = Math.exp(-Math.pow(ph - 7.4, 2) / 2);

    // Temperature dependence (Arrhenius-like)
    const tempFactor = Math.exp(-1000 / temperature);

    // Base formation rate (empirical)
    const baseRate = 0.001;

    return Math.min(1, baseRate * ionicProduct * phFactor * tempFactor);
  }

  /**
   * Calculate initial quantum coherence
   * Based on Fisher's quantum dynamical selection
   */
  private calculateInitialCoherence(): number {
    const { temperature, electromagneticField } = this.quantumField;

    // Thermal decoherence time (T₂)
    const t2 = 1e-3 * Math.exp(1000 / temperature); // ms

    // Electromagnetic field coupling
    const fieldCoupling = electromagneticField.amplitude *
      Math.exp(-Math.pow(electromagneticField.frequency - 40, 2) / 100);

    // Initial coherence based on formation conditions
    const thermalCoherence = Math.exp(-this.time / t2);
    const fieldEnhancedCoherence = thermalCoherence * (1 + fieldCoupling);

    return Math.max(0, Math.min(1, fieldEnhancedCoherence));
  }

  /**
   * Update physics simulation
   */
  update(deltaTime: number): CoherenceMetrics {
    this.time += deltaTime;

    // Update molecular dynamics
    for (const [id, molecule] of this.posnerMolecules) {
      this.updateMolecule(molecule, deltaTime);

      // Check for decay
      if (this.shouldDecay(molecule)) {
        molecule.decayTime = this.time;
      }
    }

    // Calculate global coherence metrics
    const metrics = this.calculateCoherenceMetrics();
    this.coherenceHistory.push(metrics);

    // Keep only recent history
    if (this.coherenceHistory.length > 100) {
      this.coherenceHistory.shift();
    }

    return metrics;
  }

  /**
   * Update individual molecule physics
   */
  private updateMolecule(molecule: PosnerMolecule, deltaTime: number): void {
    // Decoherence over time
    const decayRate = 0.001; // per millisecond
    molecule.coherence *= Math.exp(-decayRate * deltaTime);

    // Electromagnetic field coupling
    const fieldEffect = this.quantumField.electromagneticField.amplitude *
      Math.sin(2 * Math.PI * this.quantumField.electromagneticField.frequency * this.time / 1000);

    molecule.coherence += fieldEffect * 0.01;
    molecule.coherence = Math.max(0, Math.min(1, molecule.coherence));

    // Update entanglement phases
    for (const phosphate of molecule.phosphateGroups) {
      phosphate.phosphorus.entanglementPhase += deltaTime * 0.001;
    }
  }

  /**
   * Check if molecule should decay
   */
  private shouldDecay(molecule: PosnerMolecule): boolean {
    const lifetime = this.time - molecule.formationTime;
    const decayProbability = 1 - Math.exp(-lifetime / 10000); // 10 second half-life

    return Math.random() < decayProbability;
  }

  /**
   * Calculate global coherence metrics
   */
  private calculateCoherenceMetrics(): CoherenceMetrics {
    const activeMolecules = Array.from(this.posnerMolecules.values())
      .filter(m => !m.decayTime);

    if (activeMolecules.length === 0) {
      return {
        hurstExponent: 0,
        entropy: 1,
        coherenceTime: 0,
        fidelity: 0,
        entanglementStrength: 0
      };
    }

    // Calculate Hurst exponent (simplified)
    const coherenceValues = activeMolecules.map(m => m.coherence);
    const hurstExponent = this.calculateHurstExponent(coherenceValues);

    // Calculate entropy as distance from target H = 0.35
    const entropy = Math.abs(hurstExponent - 0.35) / 0.35;

    // Calculate average coherence time
    const avgCoherence = coherenceValues.reduce((sum, c) => sum + c, 0) / coherenceValues.length;

    // Calculate entanglement strength (simplified)
    const entanglementStrength = activeMolecules.reduce((sum, m) =>
      sum + Array.from(m.entanglement.values()).reduce((s, e) => s + e, 0), 0
    ) / activeMolecules.length;

    return {
      hurstExponent,
      entropy,
      coherenceTime: avgCoherence * 1000, // Convert to ms
      fidelity: avgCoherence,
      entanglementStrength
    };
  }

  /**
   * Calculate Hurst exponent from time series
   * Simplified implementation for real-time performance
   */
  private calculateHurstExponent(values: number[]): number {
    if (values.length < 10) return 0.5;

    // Simplified R/S analysis
    const n = values.length;
    const mean = values.reduce((sum, v) => sum + v, 0) / n;

    // Calculate cumulative deviations
    const cumulative = [];
    let sum = 0;
    for (const value of values) {
      sum += value - mean;
      cumulative.push(sum);
    }

    // Calculate range
    const range = Math.max(...cumulative) - Math.min(...cumulative);

    // Calculate standard deviation
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / n;
    const stdDev = Math.sqrt(variance);

    if (stdDev === 0) return 0.5;

    const rs = range / stdDev;

    // Estimate Hurst exponent (simplified)
    // H ≈ log(R/S) / log(n/2)
    const h = Math.log(rs) / Math.log(n / 2);

    return Math.max(0, Math.min(1, h));
  }

  /**
   * Apply external perturbation (for gameplay/coherence control)
   */
  applyPerturbation(type: 'calcium' | 'phosphate' | 'ph' | 'field', magnitude: number): void {
    switch (type) {
      case 'calcium':
        this.quantumField.calciumConcentration += magnitude;
        break;
      case 'phosphate':
        this.quantumField.phosphateConcentration += magnitude;
        break;
      case 'ph':
        this.quantumField.ph += magnitude;
        break;
      case 'field':
        this.quantumField.electromagneticField.amplitude += magnitude;
        break;
    }
  }

  /**
   * Get current physics state
   */
  getState() {
    return {
      molecules: Array.from(this.posnerMolecules.values()),
      quantumField: this.quantumField,
      time: this.time,
      activeMoleculeCount: Array.from(this.posnerMolecules.values()).filter(m => !m.decayTime).length,
      coherenceMetrics: this.coherenceHistory[this.coherenceHistory.length - 1] || null
    };
  }

  /**
   * Reset simulation
   */
  reset(): void {
    this.posnerMolecules.clear();
    this.time = 0;
    this.coherenceHistory = [];
    this.quantumField = {
      calciumConcentration: 2.5,
      phosphateConcentration: 1.0,
      ph: 7.2,
      temperature: 310.15,
      electromagneticField: { frequency: 40, amplitude: 0.001 }
    };
  }
}

/**
 * Singleton instance for global physics simulation
 */
export const fisherEscolaEngine = new FisherEscolaPhysics();