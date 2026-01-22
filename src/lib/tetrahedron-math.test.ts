/**
 * Tetrahedron Math Tests
 * Testing the core quantum mathematical computations
 */

import { describe, it, expect } from 'vitest'
import {
  generateSICPOVMs,
  calculateSymmetry,
  calculateOllivierRicciCurvature,
  reconstructDensityMatrix,
} from './tetrahedron-math'

describe('Tetrahedron Math', () => {
  describe('SIC-POVM Generation', () => {
    it('should generate valid SIC-POVM states', () => {
      const states = generateSICPOVMs()

      expect(states).toHaveLength(4) // Tetrahedron has 4 vertices

      // Each state should be normalized (length ≈ 1)
      states.forEach(state => {
        const magnitude = Math.sqrt(
          state.x * state.x + state.y * state.y + state.z * state.z
        )
        expect(magnitude).toBeCloseTo(1, 3)
      })
    })

    it('should satisfy SIC-POVM overlap condition', () => {
      const states = generateSICPOVMs()

      // Check pairwise overlaps |⟨ψᵢ|ψⱼ⟩|² = 1/3 for i ≠ j
      for (let i = 0; i < states.length; i++) {
        for (let j = i + 1; j < states.length; j++) {
          const overlap = Math.abs(
            states[i].x * states[j].x +
            states[i].y * states[j].y +
            states[i].z * states[j].z
          )

          expect(overlap * overlap).toBeCloseTo(1/3, 2)
        }
      }
    })
  })

  describe('Symmetry Calculation', () => {
    it('should calculate symmetry for tetrahedral configuration', () => {
      const nodes = [
        { position: { x: 1, y: 1, z: 1 }, connections: [1, 2, 3] },
        { position: { x: -1, y: -1, z: 1 }, connections: [0, 2, 3] },
        { position: { x: -1, y: 1, z: -1 }, connections: [0, 1, 3] },
        { position: { x: 1, y: -1, z: -1 }, connections: [0, 1, 2] },
      ]

      const symmetry = calculateSymmetry(nodes)
      expect(symmetry).toBeGreaterThan(0)
      expect(symmetry).toBeLessThanOrEqual(1)
    })
  })

  describe('Ollivier-Ricci Curvature', () => {
    it('should compute curvature for tetrahedral graph', () => {
      const nodes = [
        { position: { x: 0, y: 0, z: 1 }, connections: [1, 2, 3] },
        { position: { x: 1, y: 0, z: -1/3 }, connections: [0, 2, 3] },
        { position: { x: -0.5, y: Math.sqrt(3)/2, z: -1/3 }, connections: [0, 1, 3] },
        { position: { x: -0.5, y: -Math.sqrt(3)/2, z: -1/3 }, connections: [0, 1, 2] },
      ]

      const result = calculateOllivierRicciCurvature(nodes)

      expect(result.averageCurvature).toBeDefined()
      expect(result.nodeCurvatures).toHaveLength(4)
      expect(result.transportPlan).toBeDefined()
    })
  })

  describe('Density Matrix Reconstruction', () => {
    it('should reconstruct density matrix from SIC-POVM measurements', () => {
      const measurements = [0.25, 0.25, 0.25, 0.25] // Equal probabilities
      const densityMatrix = reconstructDensityMatrix(measurements)

      expect(densityMatrix).toBeDefined()
      expect(densityMatrix.length).toBe(4) // 2x2 density matrix flattened

      // Trace should be 1
      expect(densityMatrix[0] + densityMatrix[3]).toBeCloseTo(1, 5)
    })
  })
})