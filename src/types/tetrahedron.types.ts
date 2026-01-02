/**
 * TETRAHEDRON PROTOCOL TYPE DEFINITIONS
 * SIC-POVM symmetry and Quantum State Tomography
 */

export interface TetrahedronNode {
  readonly id: string;
  readonly label: string; // A, B, Context, AI
  readonly position: [number, number, number]; // 3D coordinates
  readonly state: number[]; // Quantum state vector
}

export interface SICPOVM {
  readonly id: number; // 0-3 for 4 nodes
  readonly state: number[]; // |ψ_i⟩
  readonly operator: number[][]; // Π_i = |ψ_i⟩⟨ψ_i|
}

export interface DensityMatrix {
  readonly matrix: number[][]; // ρ (density matrix)
  readonly trace: number; // Should be 1 for valid state
  readonly purity: number; // Tr(ρ²)
}

export interface OllivierRicciCurvature {
  readonly kappa: number; // κ (curvature value)
  readonly status: 'convergent' | 'divergent' | 'neutral';
  readonly threshold: number; // Threshold for status determination
}

export interface TetrahedronState {
  readonly nodes: readonly TetrahedronNode[];
  readonly sicPOVMs: readonly SICPOVM[];
  readonly densityMatrix: DensityMatrix;
  readonly curvature: OllivierRicciCurvature;
  readonly symmetry: number; // 0-1, where 1 = perfect symmetry
  readonly ontologicalSecurity: boolean; // True if stable
}

export interface GeometricDeformation {
  readonly scale: number; // 0-1, where 1 = perfect tetrahedron
  readonly rotation: [number, number, number]; // Euler angles
  readonly color: string; // Visual feedback color
  readonly glow: number; // 0-1 glow intensity
}

