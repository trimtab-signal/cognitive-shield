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
 * ║   SACRED GEOMETRY - Mathematical Constants & Utilities                     ║
 * ║   The Numbers Are Beautiful                                               ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 * 
 * "Breaking barriers one qubit at a time"
 * 
 * This module contains the sacred mathematical constants and functions
 * that underpin the entire Cognitive Shield architecture.
 */

// ═══════════════════════════════════════════════════════════════════════════
// FUNDAMENTAL CONSTANTS - The Building Blocks of Reality
// ═══════════════════════════════════════════════════════════════════════════

/** Golden Ratio (φ) - The divine proportion */
export const PHI = (1 + Math.sqrt(5)) / 2;  // 1.618033988749895

/** Golden Ratio Conjugate (Φ) */
export const PHI_CONJUGATE = PHI - 1;  // 0.618033988749895

/** Golden Angle in radians - For optimal sphere packing */
export const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));  // ~2.39996

/** Tau (τ) - Full circle, superior to π */
export const TAU = Math.PI * 2;  // 6.283185307179586

/** Euler's Number (e) */
export const E = Math.E;  // 2.718281828459045

/** Square roots of small primes */
export const SQRT_2 = Math.sqrt(2);  // 1.4142135623730951
export const SQRT_3 = Math.sqrt(3);  // 1.7320508075688772
export const SQRT_5 = Math.sqrt(5);  // 2.23606797749979

/** Planck's reduced constant (ℏ) in eV·s - For quantum calculations */
export const H_BAR = 6.582119569e-16;

/** Fine structure constant (α) - The magic number of physics */
export const ALPHA = 1 / 137.035999084;

// ═══════════════════════════════════════════════════════════════════════════
// FIBONACCI SEQUENCE - Nature's Algorithm
// ═══════════════════════════════════════════════════════════════════════════

/** Generate Fibonacci sequence up to n terms */
export function fibonacci(n: number): number[] {
  const seq = [0, 1];
  for (let i = 2; i < n; i++) {
    seq.push(seq[i - 1] + seq[i - 2]);
  }
  return seq.slice(0, n);
}

/** Get nth Fibonacci number using Binet's formula (O(1)) */
export function fibonacciBinet(n: number): number {
  return Math.round((Math.pow(PHI, n) - Math.pow(-PHI, -n)) / SQRT_5);
}

/** Check if number is Fibonacci */
export function isFibonacci(n: number): boolean {
  // A number is Fibonacci if and only if one or both of 
  // (5*n^2 + 4) or (5*n^2 - 4) is a perfect square
  const test1 = 5 * n * n + 4;
  const test2 = 5 * n * n - 4;
  return isPerfectSquare(test1) || isPerfectSquare(test2);
}

function isPerfectSquare(n: number): boolean {
  const sqrt = Math.sqrt(n);
  return sqrt === Math.floor(sqrt);
}

// ═══════════════════════════════════════════════════════════════════════════
// GEOMETRIC PRIMITIVES - Platonic Solids
// ═══════════════════════════════════════════════════════════════════════════

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

// Note: normalize is defined here before TETRAHEDRON_VERTICES uses it
function normalizeVec(v: Vector3): Vector3 {
  const len = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  return { x: v.x / len, y: v.y / len, z: v.z / len };
}

/** Tetrahedron vertices (4 vertices, 4 faces) */
export const TETRAHEDRON_VERTICES: Vector3[] = [
  { x: 1, y: 1, z: 1 },
  { x: 1, y: -1, z: -1 },
  { x: -1, y: 1, z: -1 },
  { x: -1, y: -1, z: 1 },
].map(v => normalizeVec(v));

/** Cube vertices (8 vertices, 6 faces) */
export const CUBE_VERTICES: Vector3[] = [
  { x: -1, y: -1, z: -1 },
  { x: 1, y: -1, z: -1 },
  { x: 1, y: 1, z: -1 },
  { x: -1, y: 1, z: -1 },
  { x: -1, y: -1, z: 1 },
  { x: 1, y: -1, z: 1 },
  { x: 1, y: 1, z: 1 },
  { x: -1, y: 1, z: 1 },
];

/** Octahedron vertices (6 vertices, 8 faces) */
export const OCTAHEDRON_VERTICES: Vector3[] = [
  { x: 1, y: 0, z: 0 },
  { x: -1, y: 0, z: 0 },
  { x: 0, y: 1, z: 0 },
  { x: 0, y: -1, z: 0 },
  { x: 0, y: 0, z: 1 },
  { x: 0, y: 0, z: -1 },
];

/** Dodecahedron vertices (20 vertices, 12 faces) */
export const DODECAHEDRON_VERTICES: Vector3[] = (() => {
  const verts: Vector3[] = [];
  
  // Cube vertices
  for (let i = -1; i <= 1; i += 2) {
    for (let j = -1; j <= 1; j += 2) {
      for (let k = -1; k <= 1; k += 2) {
        verts.push({ x: i, y: j, z: k });
      }
    }
  }
  
  // Rectangle vertices using golden ratio
  const coords = [
    [0, PHI, 1/PHI],
    [0, PHI, -1/PHI],
    [0, -PHI, 1/PHI],
    [0, -PHI, -1/PHI],
    [1/PHI, 0, PHI],
    [-1/PHI, 0, PHI],
    [1/PHI, 0, -PHI],
    [-1/PHI, 0, -PHI],
    [PHI, 1/PHI, 0],
    [PHI, -1/PHI, 0],
    [-PHI, 1/PHI, 0],
    [-PHI, -1/PHI, 0],
  ];
  
  coords.forEach(([x, y, z]) => verts.push({ x, y, z }));
  
  return verts;
})();

/** Icosahedron vertices (12 vertices, 20 faces) */
export const ICOSAHEDRON_VERTICES: Vector3[] = (() => {
  const verts: Vector3[] = [];
  
  // Golden rectangles in 3 orthogonal planes
  const coords = [
    [0, 1, PHI],
    [0, 1, -PHI],
    [0, -1, PHI],
    [0, -1, -PHI],
    [1, PHI, 0],
    [1, -PHI, 0],
    [-1, PHI, 0],
    [-1, -PHI, 0],
    [PHI, 0, 1],
    [-PHI, 0, 1],
    [PHI, 0, -1],
    [-PHI, 0, -1],
  ];
  
  coords.forEach(([x, y, z]) => verts.push(normalize({ x, y, z })));
  
  return verts;
})();

// ═══════════════════════════════════════════════════════════════════════════
// VECTOR OPERATIONS
// ═══════════════════════════════════════════════════════════════════════════

export function normalize(v: Vector3): Vector3 {
  return normalizeVec(v);  // Delegate to the internal function
}

export function dot(a: Vector3, b: Vector3): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

export function cross(a: Vector3, b: Vector3): Vector3 {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
}

export function add(a: Vector3, b: Vector3): Vector3 {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}

export function scale(v: Vector3, s: number): Vector3 {
  return { x: v.x * s, y: v.y * s, z: v.z * s };
}

export function distance(a: Vector3, b: Vector3): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dz = b.z - a.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

// ═══════════════════════════════════════════════════════════════════════════
// SACRED GEOMETRY PATTERNS
// ═══════════════════════════════════════════════════════════════════════════

/** Generate Flower of Life circle centers */
export function flowerOfLife(layers: number): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [{ x: 0, y: 0 }];
  
  for (let layer = 1; layer <= layers; layer++) {
    const count = 6 * layer;
    for (let i = 0; i < count; i++) {
      const angle = (TAU * i) / count;
      const r = layer;
      points.push({
        x: r * Math.cos(angle),
        y: r * Math.sin(angle),
      });
    }
  }
  
  return points;
}

/** Generate Metatron's Cube vertices */
export function metatronsCube(): Vector3[] {
  // 13 circles: 1 center + 6 inner + 6 outer
  const points: Vector3[] = [{ x: 0, y: 0, z: 0 }];
  
  // Inner hexagon
  for (let i = 0; i < 6; i++) {
    const angle = (TAU * i) / 6;
    points.push({
      x: Math.cos(angle),
      y: Math.sin(angle),
      z: 0,
    });
  }
  
  // Outer hexagon (rotated 30°)
  for (let i = 0; i < 6; i++) {
    const angle = (TAU * i) / 6 + Math.PI / 6;
    points.push({
      x: 2 * Math.cos(angle),
      y: 2 * Math.sin(angle),
      z: 0,
    });
  }
  
  return points;
}

/** Generate Sri Yantra triangles (simplified) */
export function sriYantra(): { up: Vector3[]; down: Vector3[] }[] {
  const triangles: { up: Vector3[]; down: Vector3[] }[] = [];
  
  const sizes = [1, 0.8, 0.6, 0.4, 0.2];
  
  sizes.forEach((size, i) => {
    // Upward triangles
    const upAngle = -Math.PI / 2 + (i * Math.PI / 20);
    const up: Vector3[] = [];
    for (let j = 0; j < 3; j++) {
      const angle = upAngle + (TAU * j) / 3;
      up.push({
        x: size * Math.cos(angle),
        y: size * Math.sin(angle),
        z: 0,
      });
    }
    
    // Downward triangles
    const downAngle = Math.PI / 2 + (i * Math.PI / 20);
    const down: Vector3[] = [];
    for (let j = 0; j < 3; j++) {
      const angle = downAngle + (TAU * j) / 3;
      down.push({
        x: size * Math.cos(angle),
        y: size * Math.sin(angle),
        z: 0,
      });
    }
    
    triangles.push({ up, down });
  });
  
  return triangles;
}

// ═══════════════════════════════════════════════════════════════════════════
// QUANTUM-INSPIRED FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/** Quantum superposition state representation */
export interface QuantumState {
  amplitude: number;
  phase: number;
}

/** Create superposition of basis states */
export function superposition(states: number[]): QuantumState[] {
  const norm = 1 / Math.sqrt(states.length);
  return states.map((_, i) => ({
    amplitude: norm,
    phase: (TAU * i) / states.length,
  }));
}

/** Calculate probability from quantum amplitude */
export function probability(state: QuantumState): number {
  return state.amplitude * state.amplitude;
}

/** Quantum interference pattern */
export function interference(state1: QuantumState, state2: QuantumState): number {
  const phaseDiff = state1.phase - state2.phase;
  return state1.amplitude * state2.amplitude * Math.cos(phaseDiff);
}

/** Bloch sphere coordinates from quantum state */
export function blochSphere(theta: number, phi: number): Vector3 {
  return {
    x: Math.sin(theta) * Math.cos(phi),
    y: Math.sin(theta) * Math.sin(phi),
    z: Math.cos(theta),
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// FRACTAL FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/** Mandelbrot set iteration count */
export function mandelbrot(cx: number, cy: number, maxIter: number): number {
  let x = 0;
  let y = 0;
  let iter = 0;
  
  while (x * x + y * y <= 4 && iter < maxIter) {
    const xTemp = x * x - y * y + cx;
    y = 2 * x * y + cy;
    x = xTemp;
    iter++;
  }
  
  return iter;
}

/** Julia set iteration count */
export function julia(
  zx: number, 
  zy: number, 
  cx: number, 
  cy: number, 
  maxIter: number
): number {
  let x = zx;
  let y = zy;
  let iter = 0;
  
  while (x * x + y * y <= 4 && iter < maxIter) {
    const xTemp = x * x - y * y + cx;
    y = 2 * x * y + cy;
    x = xTemp;
    iter++;
  }
  
  return iter;
}

/** Sierpinski triangle check */
export function sierpinski(x: number, y: number, depth: number): boolean {
  for (let i = 0; i < depth; i++) {
    if ((Math.floor(x) & 1) === 1 && (Math.floor(y) & 1) === 1) {
      return false;
    }
    x /= 2;
    y /= 2;
  }
  return true;
}

// ═══════════════════════════════════════════════════════════════════════════
// NOISE FUNCTIONS - For procedural generation
// ═══════════════════════════════════════════════════════════════════════════

/** Simple hash function */
function hash(x: number, y: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

/** 2D Value noise */
export function valueNoise(x: number, y: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  
  // Smoothstep interpolation
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  
  const a = hash(ix, iy);
  const b = hash(ix + 1, iy);
  const c = hash(ix, iy + 1);
  const d = hash(ix + 1, iy + 1);
  
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}

/** Fractal Brownian Motion */
export function fbm(x: number, y: number, octaves: number = 6): number {
  let value = 0;
  let amplitude = 0.5;
  let frequency = 1;
  
  for (let i = 0; i < octaves; i++) {
    value += amplitude * valueNoise(x * frequency, y * frequency);
    amplitude *= 0.5;
    frequency *= PHI; // Use golden ratio for frequency scaling
  }
  
  return value;
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/** Linear interpolation */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Clamp value to range */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Map value from one range to another */
export function map(
  value: number, 
  inMin: number, 
  inMax: number, 
  outMin: number, 
  outMax: number
): number {
  return outMin + (outMax - outMin) * ((value - inMin) / (inMax - inMin));
}

/** Smooth step function */
export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/** Convert degrees to radians */
export function degToRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/** Convert radians to degrees */
export function radToDeg(radians: number): number {
  return radians * (180 / Math.PI);
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS - The Sacred API
// ═══════════════════════════════════════════════════════════════════════════

export const SacredGeometry = {
  // Constants
  PHI,
  PHI_CONJUGATE,
  GOLDEN_ANGLE,
  TAU,
  SQRT_2,
  SQRT_3,
  SQRT_5,
  
  // Platonic solids
  tetrahedron: TETRAHEDRON_VERTICES,
  cube: CUBE_VERTICES,
  octahedron: OCTAHEDRON_VERTICES,
  dodecahedron: DODECAHEDRON_VERTICES,
  icosahedron: ICOSAHEDRON_VERTICES,
  
  // Patterns
  flowerOfLife,
  metatronsCube,
  sriYantra,
  
  // Fibonacci
  fibonacci,
  fibonacciBinet,
  isFibonacci,
  
  // Fractals
  mandelbrot,
  julia,
  sierpinski,
  
  // Noise
  valueNoise,
  fbm,
  
  // Quantum
  superposition,
  probability,
  interference,
  blochSphere,
  
  // Utilities
  lerp,
  clamp,
  map,
  smoothstep,
};

export default SacredGeometry;
