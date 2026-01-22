/**
 * TETRAHEDRON PROTOCOL MATHEMATICS
 * SIC-POVM, Quantum State Tomography, and Ollivier-Ricci Curvature
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * BEFORE YOU CALL THE EXORCIST:
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * SIC-POVM = "Symmetric Informationally Complete Positive Operator-Valued Measure"
 * It's from quantum mechanics, not occult literature.
 * 
 * References (all peer-reviewed):
 * - Renes et al., "Symmetric informationally complete quantum measurements" 
 *   Journal of Mathematical Physics, 2004
 * - Appleby, "SIC-POVMs and the Extended Clifford Group"
 *   Journal of Mathematical Physics, 2005
 * - Fuchs et al., "The SIC Question: History and State of Play"
 *   Axioms, 2017 (open access on arXiv)
 * 
 * Ollivier-Ricci Curvature:
 * - Ollivier, "Ricci curvature of Markov chains on metric spaces"
 *   Journal of Functional Analysis, 2009
 * 
 * I learned this from:
 * 1. Wikipedia
 * 2. arXiv papers (free online)
 * 3. 3Blue1Brown videos (YouTube)
 * 4. Desperation to understand family dynamics mathematically
 * 
 * The math is real. The application is creative. The custody battle continues.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type {
  TetrahedronNode,
  SICPOVM,
  DensityMatrix,
  OllivierRicciCurvature,
  TetrahedronState,
} from '../types/tetrahedron.types';

/**
 * Generate SIC-POVM states for 4 nodes (d=2 qubit space)
 *
 * For d=2, we need 4 states with overlap condition:
 * |⟨ψ_j|ψ_k⟩|² = 1/(d+1) = 1/3 for j ≠ k
 */
export function generateSICPOVMs(): SICPOVM[] {
  // For d=2, we use the standard SIC-POVM construction
  // These are 4 states on the Bloch sphere forming a regular tetrahedron

  // Standard SIC-POVM for qubits (d=2): 4 states forming a regular tetrahedron
  // on the Bloch sphere. Each state |ψₖ⟩ has Bloch vector pointing to a
  // tetrahedron vertex, with |⟨ψⱼ|ψₖ⟩|² = 1/3 for j≠k.
  //
  // The states are constructed as: |ψₖ⟩ = cos(θ/2)|0⟩ + e^(iφₖ)sin(θ/2)|1⟩
  // where θ = arccos(rz) and φₖ gives the azimuthal angle.
  //
  // Bloch vectors (forming regular tetrahedron inscribed in unit sphere):
  //   ψ₀: (0, 0, 1)                    - "north pole"
  //   ψ₁: (2√2/3, 0, -1/3)             - front
  //   ψ₂: (-√2/3, √(2/3), -1/3)        - back-left
  //   ψ₃: (-√2/3, -√(2/3), -1/3)       - back-right
  //
  // POVM operators: Πₖ = (1/2)|ψₖ⟩⟨ψₖ| (factor of 1/d = 1/2)

  const sqrt2 = Math.sqrt(2);
  const sqrt6 = Math.sqrt(6);

  const sicPOVMs: SICPOVM[] = [
    // State 0: Bloch vector (0, 0, 1) → |ψ₀⟩ = |0⟩
    // This IS a valid SIC state when the tetrahedron has one vertex at north pole
    {
      id: 0,
      state: [1, 0], // |0⟩
      operator: [[0.5, 0], [0, 0]], // Π₀ = (1/2)|0⟩⟨0|
    },
    // State 1: Bloch vector (2√2/3, 0, -1/3)
    // |ψ₁⟩ = cos(θ/2)|0⟩ + sin(θ/2)|1⟩ where cos(θ) = -1/3
    // cos(θ/2) = √((1-1/3)/2) = √(1/3) = 1/√3
    // sin(θ/2) = √((1+1/3)/2) = √(2/3)
    {
      id: 1,
      state: [1 / Math.sqrt(3), Math.sqrt(2 / 3)],
      operator: [
        [1 / 6, sqrt2 / 6],
        [sqrt2 / 6, 2 / 6],
      ], // Π₁ = (1/2)|ψ₁⟩⟨ψ₁|
    },
    // State 2: Bloch vector (-√2/3, √6/3, -1/3), phase φ = 2π/3
    // |ψ₂⟩ = (1/√3)|0⟩ + e^(2πi/3)√(2/3)|1⟩
    {
      id: 2,
      state: [1 / Math.sqrt(3), Math.sqrt(2 / 3)], // magnitude only for visualization
      operator: [
        [1 / 6, (sqrt2 / 6) * Math.cos((2 * Math.PI) / 3)],
        [(sqrt2 / 6) * Math.cos((2 * Math.PI) / 3), 2 / 6],
      ], // Π₂ = (1/2)|ψ₂⟩⟨ψ₂| (real part)
    },
    // State 3: Bloch vector (-√2/3, -√6/3, -1/3), phase φ = 4π/3
    // |ψ₃⟩ = (1/√3)|0⟩ + e^(4πi/3)√(2/3)|1⟩
    {
      id: 3,
      state: [1 / Math.sqrt(3), Math.sqrt(2 / 3)], // magnitude only for visualization
      operator: [
        [1 / 6, (sqrt2 / 6) * Math.cos((4 * Math.PI) / 3)],
        [(sqrt2 / 6) * Math.cos((4 * Math.PI) / 3), 2 / 6],
      ], // Π₃ = (1/2)|ψ₃⟩⟨ψ₃| (real part)
    },
  ];

  return sicPOVMs;
}

/**
 * Convert SIC-POVM states to 3D positions on Bloch sphere
 * Maps quantum states to tetrahedron vertices
 */
export function sicPOVMToPositions(sicPOVMs: SICPOVM[]): [number, number, number][] {
  // For d=2, map to Bloch sphere coordinates
  // Regular tetrahedron inscribed in unit sphere
  
  const positions: [number, number, number][] = [
    // Vertex 0: North Pole
    [0, 0, 1],
    // Vertex 1: Front
    [2 * Math.sqrt(2) / 3, 0, -1 / 3],
    // Vertex 2: Back-left
    [-Math.sqrt(2) / 3, Math.sqrt(2 / 3), -1 / 3],
    // Vertex 3: Back-right
    [-Math.sqrt(2) / 3, -Math.sqrt(2 / 3), -1 / 3],
  ];

  return positions;
}

/**
 * Reconstruct density matrix from SIC-POVM measurements
 * 
 * Formula: ρ = Σ(k=0 to 3) [3p_k - 1/2] Π_k
 * where p_k are the measurement probabilities
 */
export function reconstructDensityMatrix(
  probabilities: number[], // p_k for each SIC-POVM
  sicPOVMs: SICPOVM[]
): DensityMatrix {
  if (probabilities.length !== 4 || sicPOVMs.length !== 4) {
    throw new Error('Requires exactly 4 probabilities and 4 SIC-POVMs');
  }

  // Initialize 2x2 density matrix
  const matrix: number[][] = [
    [0, 0],
    [0, 0],
  ];

  // Reconstruct: ρ = Σ [3p_k - 1/2] Π_k
  for (let k = 0; k < 4; k++) {
    const coefficient = 3 * probabilities[k] - 0.5;
    const operator = sicPOVMs[k].operator;

    // Add weighted operator to matrix
        for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        const opValue = typeof operator[i][j] === 'number' ? operator[i][j] : 0;
        matrix[i][j] += coefficient * opValue;
      }
    }
  }

  // Calculate trace (should be 1 for valid state)
  const trace = matrix[0][0] + matrix[1][1];

  // Calculate purity: Tr(ρ²)
  const rhoSquared = [
    [
      matrix[0][0] * matrix[0][0] + matrix[0][1] * matrix[1][0],
      matrix[0][0] * matrix[0][1] + matrix[0][1] * matrix[1][1],
    ],
    [
      matrix[1][0] * matrix[0][0] + matrix[1][1] * matrix[1][0],
      matrix[1][0] * matrix[0][1] + matrix[1][1] * matrix[1][1],
    ],
  ];
  const purity = rhoSquared[0][0] + rhoSquared[1][1];

  return {
    matrix,
    trace,
    purity: Math.max(0, Math.min(1, purity)), // Clamp to [0,1]
  };
}

/**
 * Calculate Ollivier-Ricci Curvature (κ) for network topology
 * 
 * Positive κ (κ > 0): Convergent paths, "Informational Gravity Well"
 * Negative κ (κ < 0): Divergent paths, "Entropy Spike"
 * 
 * Simplified calculation for tetrahedron:
 * κ = (average path convergence) - (average path divergence)
 */
export function calculateOllivierRicciCurvature(
  nodes: TetrahedronNode[]
): OllivierRicciCurvature {
  if (nodes.length !== 4) {
    return {
      kappa: 0,
      status: 'neutral',
      threshold: 0.1,
    };
  }

  // Calculate average distance between nodes
  let totalDistance = 0;
  let pairCount = 0;

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const [x1, y1, z1] = nodes[i].position;
      const [x2, y2, z2] = nodes[j].position;
      const distance = Math.sqrt(
        Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2)
      );
      totalDistance += distance;
      pairCount++;
    }
  }

  const averageDistance = totalDistance / pairCount;

  // For a perfect tetrahedron, all edges should be equal
  // Expected edge length for unit sphere: √(8/3) ≈ 1.6329931618...
  const expectedDistance = Math.sqrt(8 / 3); // 1.6329931618554521

  // Calculate curvature: negative deviation = divergence, positive = convergence
  const kappa = (expectedDistance - averageDistance) / expectedDistance;

  const threshold = 0.1;
  let status: 'convergent' | 'divergent' | 'neutral' = 'neutral';
  if (kappa > threshold) status = 'convergent';
  else if (kappa < -threshold) status = 'divergent';

  return {
    kappa,
    status,
    threshold,
  };
}

/**
 * Calculate symmetry score (0-1) for tetrahedron
 * 1 = perfect symmetry, 0 = maximum deformation
 */
export function calculateSymmetry(nodes: TetrahedronNode[]): number {
  if (nodes.length !== 4) return 0;

  // Calculate all edge lengths
  const edges: number[] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const [x1, y1, z1] = nodes[i].position;
      const [x2, y2, z2] = nodes[j].position;
      const distance = Math.sqrt(
        Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2)
      );
      edges.push(distance);
    }
  }

  // For perfect tetrahedron, all 6 edges should be equal
  const expectedLength = edges.reduce((a, b) => a + b, 0) / edges.length;
  const variance = edges.reduce((sum, edge) => {
    return sum + Math.pow(edge - expectedLength, 2);
  }, 0) / edges.length;

  // Normalize variance to symmetry score (0-1)
  // Lower variance = higher symmetry
  const maxVariance = expectedLength * expectedLength; // Theoretical maximum
  const symmetry = Math.max(0, Math.min(1, 1 - variance / maxVariance));

  return symmetry;
}

/**
 * Compute complete tetrahedron state
 */
export function computeTetrahedronState(
  nodes: TetrahedronNode[]
): TetrahedronState {
  const sicPOVMs = generateSICPOVMs();
  
  // Calculate measurement probabilities from node states
  const probabilities = nodes.map((node, i) => {
    // Simplified: probability based on state vector magnitude
    const magnitude = Math.sqrt(
      node.state.reduce((sum, val) => sum + val * val, 0)
    );
    return Math.max(0, Math.min(1, magnitude / Math.sqrt(2))); // Normalize
  });

  const densityMatrix = reconstructDensityMatrix(probabilities, sicPOVMs);
  const curvature = calculateOllivierRicciCurvature(nodes);
  const symmetry = calculateSymmetry(nodes);

  return {
    nodes,
    sicPOVMs,
    densityMatrix,
    curvature,
    symmetry,
    ontologicalSecurity: symmetry > 0.8 && curvature.status !== 'divergent',
  };
}

/**
 * Perform SIC-POVM measurement on a quantum state
 * Returns the measurement outcome and probability
 */
export function performSICPOVMMeasurement(quantumState: { theta: number; phi: number; purity: number }) {
  // Generate SIC-POVM states
  const sicPOVMs = generateSICPOVMs();

  // Convert quantum state to Bloch vector
  const blochVector = {
    x: quantumState.purity * Math.sin(quantumState.theta) * Math.cos(quantumState.phi),
    y: quantumState.purity * Math.cos(quantumState.theta),
    z: quantumState.purity * Math.sin(quantumState.theta) * Math.sin(quantumState.phi)
  };

  // Calculate probabilities for each SIC-POVM outcome
  const probabilities = sicPOVMs.map(povm => {
    // Quantum measurement probability: Tr(ρ M) where M is the POVM element
    // For SIC-POVM, each element is |ψ⟩⟨ψ|
    const fidelity = Math.pow(
      povm.vector.x * blochVector.x +
      povm.vector.y * blochVector.y +
      povm.vector.z * blochVector.z + 1, // +1 for the identity term
      2
    ) / 4; // Normalize

    return Math.max(0, Math.min(1, fidelity)); // Clamp to [0,1]
  });

  // Normalize probabilities (should sum to 1, but floating point errors)
  const totalProb = probabilities.reduce((sum, p) => sum + p, 0);
  const normalizedProbabilities = probabilities.map(p => p / totalProb);

  // Sample from the probability distribution
  const randomValue = Math.random();
  let cumulativeProb = 0;
  let outcomeIndex = 0;

  for (let i = 0; i < normalizedProbabilities.length; i++) {
    cumulativeProb += normalizedProbabilities[i];
    if (randomValue <= cumulativeProb) {
      outcomeIndex = i;
      break;
    }
  }

  // Map index to outcome label
  const outcomeLabels = ['ALPHA', 'BETA', 'GAMMA', 'DELTA'];

  return {
    outcome: outcomeLabels[outcomeIndex],
    probability: normalizedProbabilities[outcomeIndex],
    allProbabilities: normalizedProbabilities,
    blochVector
  };
}

