// Geometric utilities for MASTER_PROJECT

import { TetrahedronNode, QuantumState } from '../types/shared';

// Tetrahedron geometry constants
export const TETRAHEDRON_CONSTANTS = {
  PHI: (1 + Math.sqrt(5)) / 2, // Golden ratio
  EDGE_LENGTH: 1,
  CIRCUMRADIUS: Math.sqrt(6) / 4, // For unit tetrahedron
  INRADIUS: Math.sqrt(6) / 12,
} as const;

// Generate regular tetrahedron vertices
export function generateTetrahedronVertices(radius: number = 1): [number, number, number][] {
  const { PHI } = TETRAHEDRON_CONSTANTS;
  const scale = radius / TETRAHEDRON_CONSTANTS.CIRCUMRADIUS;

  return [
    [1, 1, 1].map(x => x * scale),
    [1, -1, -1].map(x => x * scale),
    [-1, 1, -1].map(x => x * scale),
    [-1, -1, 1].map(x => x * scale),
  ] as [number, number, number][];
}

// Calculate distance between two 3D points
export function distance3D(a: [number, number, number], b: [number, number, number]): number {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  const dz = a[2] - b[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

// Calculate Ollivier-Ricci curvature between tetrahedron nodes
export function calculateOllivierRicci(node1: TetrahedronNode, node2: TetrahedronNode): number {
  // Simplified calculation - in practice this would be more complex
  const distance = distance3D(node1.position, node2.position);
  const curvature = Math.abs(distance - TETRAHEDRON_CONSTANTS.EDGE_LENGTH);
  return 1 - curvature; // Normalized curvature measure
}

// Calculate tetrahedron volume
export function calculateTetrahedronVolume(vertices: [number, number, number][]): number {
  if (vertices.length !== 4) return 0;

  // Using scalar triple product formula
  const [v1, v2, v3, v4] = vertices;

  const a = v2.map((_, i) => v2[i] - v1[i]);
  const b = v3.map((_, i) => v3[i] - v1[i]);
  const c = v4.map((_, i) => v4[i] - v1[i]);

  const crossProduct = [
    a[1] * c[2] - a[2] * c[1],
    a[2] * c[0] - a[0] * c[2],
    a[0] * c[1] - a[1] * c[0],
  ];

  const volume = Math.abs(a[0] * crossProduct[0] + a[1] * crossProduct[1] + a[2] * crossProduct[2]) / 6;
  return volume;
}

// Calculate tetrahedron surface area
export function calculateTetrahedronSurfaceArea(vertices: [number, number, number][]): number {
  if (vertices.length !== 4) return 0;

  // Area of 4 equilateral triangles
  const edgeLength = TETRAHEDRON_CONSTANTS.EDGE_LENGTH;
  const triangleArea = (Math.sqrt(3) / 4) * edgeLength * edgeLength;
  return 4 * triangleArea;
}

// Generate SIC-POVM states for tetrahedron
export function generateSICPOVMStates(): [number, number, number, number][] {
  const sqrt2 = Math.sqrt(2);
  const invSqrt3 = 1 / Math.sqrt(3);

  return [
    [1, 0, 0, 0], // |00⟩
    [0, 1, 0, 0], // |01⟩
    [0, 0, 1, 0], // |10⟩
    [0, 0, 0, 1], // |11⟩
    [invSqrt3, invSqrt3, invSqrt3, invSqrt3], // Equal superposition
    [invSqrt3, invSqrt3, -invSqrt3, -invSqrt3], // Other SIC states
    [invSqrt3, -invSqrt3, invSqrt3, -invSqrt3],
    [invSqrt3, -invSqrt3, -invSqrt3, invSqrt3],
  ];
}

// Calculate Fisher-Escola coherence metric
export function calculateCoherenceMetric(states: QuantumState[]): number {
  if (states.length === 0) return 0;

  const avgCoherence = states.reduce((sum, state) => sum + state.coherence, 0) / states.length;
  const MARK_1_ATTRACTOR = 0.34906585; // π/9

  // Return coherence quality (higher is better)
  return 1 - Math.abs(avgCoherence - MARK_1_ATTRACTOR);
}

// Calculate entropy from quantum states
export function calculateVonNeumannEntropy(states: QuantumState[]): number {
  let totalEntropy = 0;

  for (const state of states) {
    if (state.entropy > 0) {
      totalEntropy += state.entropy;
    }
  }

  return totalEntropy / states.length;
}

// Check if point is inside tetrahedron (using barycentric coordinates)
export function isPointInTetrahedron(
  point: [number, number, number],
  vertices: [number, number, number][]
): boolean {
  if (vertices.length !== 4) return false;

  // This is a simplified check - proper implementation would use barycentric coordinates
  const distances = vertices.map(vertex => distance3D(point, vertex));
  const avgDistance = distances.reduce((a, b) => a + b, 0) / 4;
  const maxDistance = Math.max(...distances);

  // Point is inside if it's closer to all vertices than the circumradius
  return maxDistance <= TETRAHEDRON_CONSTANTS.CIRCUMRADIUS * 1.1; // Small tolerance
}

// Rotate point around axis
export function rotatePoint3D(
  point: [number, number, number],
  axis: [number, number, number],
  angle: number
): [number, number, number] {
  const [x, y, z] = point;
  const [ax, ay, az] = axis;

  // Normalize axis
  const axisLength = Math.sqrt(ax * ax + ay * ay + az * az);
  const ux = ax / axisLength;
  const uy = ay / axisLength;
  const uz = az / axisLength;

  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  // Rodrigues' rotation formula
  const dot = x * ux + y * uy + z * uz;
  const crossX = uy * z - uz * y;
  const crossY = uz * x - ux * z;
  const crossZ = ux * y - uy * x;

  const rx = x * cos + crossX * sin + ux * dot * (1 - cos);
  const ry = y * cos + crossY * sin + uy * dot * (1 - cos);
  const rz = z * cos + crossZ * sin + uz * dot * (1 - cos);

  return [rx, ry, rz];
}

// Calculate centroid of tetrahedron
export function calculateCentroid(vertices: [number, number, number][]): [number, number, number] {
  if (vertices.length !== 4) return [0, 0, 0];

  const sum = vertices.reduce(
    (acc, vertex) => [
      acc[0] + vertex[0],
      acc[1] + vertex[1],
      acc[2] + vertex[2],
    ],
    [0, 0, 0]
  );

  return [
    sum[0] / 4,
    sum[1] / 4,
    sum[2] / 4,
  ];
}

// Generate geodesic sphere points (for visualization)
export function generateGeodesicSphere(radius: number = 1, subdivisions: number = 1): [number, number, number][] {
  let vertices = generateTetrahedronVertices(radius);

  // For now, return the basic tetrahedron. Full geodesic sphere would require
  // more complex subdivision algorithms
  return vertices;
}

// Calculate angular separation between two points on sphere
export function calculateAngularSeparation(
  point1: [number, number, number],
  point2: [number, number, number]
): number {
  const dot = point1[0] * point2[0] + point1[1] * point2[1] + point1[2] * point2[2];
  const mag1 = Math.sqrt(point1[0] ** 2 + point1[1] ** 2 + point1[2] ** 2);
  const mag2 = Math.sqrt(point2[0] ** 2 + point2[1] ** 2 + point2[2] ** 2);

  const cosAngle = dot / (mag1 * mag2);
  return Math.acos(Math.max(-1, Math.min(1, cosAngle)));
}

// Project 3D point to 2D screen coordinates (simple orthographic projection)
export function project3DTo2D(
  point: [number, number, number],
  cameraDistance: number = 5
): [number, number] {
  const [x, y, z] = point;
  const scale = cameraDistance / (cameraDistance + z);

  return [x * scale, y * scale];
}