/**
 * COGNITIVE JITTERBUG - The Geometry of Thinking
 * "Thinking is not a static state but a dynamic phase transition"
 *
 * Implements the Jitterbug transformation: Vector Equilibrium → Tetrahedron
 * Visualizes the process of cognition as geometric collapse
 */

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import GOD_CONFIG from '../god.config';

interface CognitiveJitterbugProps {
  /** Phase of transformation: 0.0 = VE (Open), 1.0 = Tetrahedron (Closed) */
  phase: number;
  /** Cognitive load affects animation characteristics */
  cognitiveLoad?: number;
  /** Emotional valence determines color palette */
  emotionalValence?: 'positive' | 'neutral' | 'hostile' | 'anxious';
  /** Whether the transformation is actively processing */
  isProcessing?: boolean;
  /** Quantum metrics for unworldly visualization */
  quantumMetrics?: {
    entanglement: number;
    superposition: number;
    decoherence: number;
    waveFunction: number;
    harmonicResonance: number;
    fieldStrength: number;
  };
  /** Consciousness field strength */
  consciousnessField?: number;
}

interface JitterbugState {
  phase: number;
  cognitiveLoad: number;
  emotionalValence: 'positive' | 'neutral' | 'hostile' | 'anxious';
  isProcessing: boolean;
}

// ============================================================================
// UNWORLDLY 3D SCENE COMPONENT
// ============================================================================

interface UnworldlySceneProps {
  phase: number;
  cognitiveLoad: number;
  emotionalValence: 'positive' | 'neutral' | 'hostile' | 'anxious';
  quantumMetrics: {
    entanglement: number;
    superposition: number;
    decoherence: number;
    waveFunction: number;
    harmonicResonance: number;
    fieldStrength: number;
  };
  consciousnessField: number;
}

function UnworldlyScene({
  phase,
  cognitiveLoad,
  emotionalValence,
  quantumMetrics,
  consciousnessField
}: UnworldlySceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const particleRef = useRef<THREE.Points>(null);

  // Generate quantum particle field
  const particleCount = 1000;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 15;
      pos[i3 + 1] = (Math.random() - 0.5) * 15;
      pos[i3 + 2] = (Math.random() - 0.5) * 15;
    }
    return pos;
  }, []);

  const colors = useMemo(() => {
    const cols = new Float32Array(particleCount * 3);
    const colorMap = {
      positive: [1, 0.8, 0.6],
      neutral: [0.6, 0.8, 1],
      hostile: [1, 0.4, 0.4],
      anxious: [0.8, 0.6, 1]
    };
    const [r, g, b] = colorMap[emotionalValence];
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      cols[i3] = r + (Math.random() - 0.5) * 0.2;
      cols[i3 + 1] = g + (Math.random() - 0.5) * 0.2;
      cols[i3 + 2] = b + (Math.random() - 0.5) * 0.2;
    }
    return cols;
  }, [emotionalValence]);

  useFrame((state) => {
    if (!groupRef.current || !particleRef.current) return;

    const time = state.clock.elapsedTime;

    // Animate quantum fields based on consciousness
    if (groupRef.current.children.length > 0) {
      groupRef.current.children.forEach((child, index) => {
        const freq = quantumMetrics.harmonicResonance / 100;
        child.rotation.x = time * freq * (index + 1) * 0.1;
        child.rotation.y = time * freq * (index + 1) * 0.15;
        child.position.y = Math.sin(time * freq + index) * quantumMetrics.superposition * 0.5;
      });
    }

    // Animate consciousness particles
    if (particleRef.current.geometry.attributes.position) {
      const positions = particleRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += Math.sin(time + i * 0.01) * 0.01 * consciousnessField;
        positions[i3] += Math.cos(time + i * 0.01) * 0.01 * cognitiveLoad;
        positions[i3 + 2] += Math.sin(time * 0.7 + i * 0.005) * 0.005 * quantumMetrics.entanglement;
      }
      particleRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Consciousness Particle Field */}
      <points ref={particleRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleCount}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          vertexColors
          transparent
          opacity={0.7}
          sizeAttenuation
        />
      </points>

      {/* Quantum Resonance Rings */}
      {Array.from({ length: 3 }, (_, i) => (
        <mesh key={i} position={[0, 0, i * 0.3 - 0.3]}>
          <ringGeometry args={[2 + i * 0.5, 2.2 + i * 0.5, 64]} />
          <meshStandardMaterial
            color={
              emotionalValence === 'positive' ? '#ff6b6b' :
              emotionalValence === 'anxious' ? '#a855f7' :
              emotionalValence === 'hostile' ? '#f59e0b' : '#3b82f6'
            }
            emissive={
              emotionalValence === 'positive' ? '#ff6b6b' :
              emotionalValence === 'anxious' ? '#a855f7' :
              emotionalValence === 'hostile' ? '#f59e0b' : '#3b82f6'
            }
            emissiveIntensity={0.2}
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Universal Constants Visualization */}
      <mesh position={[4, 2, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial
          color="#10b981"
          emissive="#10b981"
          emissiveIntensity={0.5}
        />
      </mesh>

      <mesh position={[-4, 2, 0]}>
        <octahedronGeometry args={[0.1, 0]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#f59e0b"
          emissiveIntensity={0.5}
        />
      </mesh>

      <mesh position={[0, -3, 0]}>
        <tetrahedronGeometry args={[0.15, 0]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}

// ============================================================================
// GEOMETRIC CONSTANTS (Synergetics)
// ============================================================================

const VE_VERTICES = 12; // Vector Equilibrium
const TETRAHEDRON_VERTICES = 4;
const ICOSAHEDRON_VERTICES = 12;
const OCTAHEDRON_VERTICES = 6;

// Golden ratio for tetrahedral proportions
const PHI = (1 + Math.sqrt(5)) / 2;

// Jitterbug transformation phases
const PHASES = {
  VECTOR_EQUILIBRIUM: 0.0,    // Open, receptive state
  ICOSAHEDRON: 0.3,           // Cognitive dissonance, "wobbly" phase
  OCTAHEDRON: 0.7,            // Pattern recognition, convergence
  TETRAHEDRON: 1.0            // Resolved, tetrahedral integrity
};

// ============================================================================
// COLOR PALETTES (Emotional Valence)
// ============================================================================

const COLOR_PALETTES = {
  positive: {
    ve: new THREE.Color('#00ffff'),      // Cyan (open, receptive)
    ico: new THREE.Color('#87ceeb'),     // Sky blue (processing)
    oct: new THREE.Color('#98fb98'),     // Pale green (converging)
    tet: new THREE.Color('#ffd700'),     // Gold (resolved)
  },
  neutral: {
    ve: new THREE.Color('#708090'),      // Slate gray
    ico: new THREE.Color('#a9a9a9'),     // Dark gray
    oct: new THREE.Color('#c0c0c0'),     // Silver
    tet: new THREE.Color('#ffffff'),     // White
  },
  hostile: {
    ve: new THREE.Color('#ff6b6b'),      // Light red
    ico: new THREE.Color('#ff4757'),     // Red
    oct: new THREE.Color('#ff3838'),     // Dark red
    tet: new THREE.Color('#8b0000'),     // Dark red
  },
  anxious: {
    ve: new THREE.Color('#dda0dd'),      // Plum
    ico: new THREE.Color('#ba55d3'),     // Medium orchid
    oct: new THREE.Color('#9932cc'),     // Dark orchid
    tet: new THREE.Color('#4b0082'),     // Indigo
  }
};

// ============================================================================
// JITTERBUG GEOMETRY ENGINE
// ============================================================================

function generateJitterbugGeometry(phase: number): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry();

  // Interpolate between VE (12 vertices) and Tetrahedron (4 vertices)
  const vertexCount = Math.round(
    THREE.MathUtils.lerp(VE_VERTICES, TETRAHEDRON_VERTICES, phase)
  );

  const positions = new Float32Array(vertexCount * 3);
  const colors = new Float32Array(vertexCount * 3);

  // Calculate transformation parameters
  const radius = THREE.MathUtils.lerp(1.0, 0.612, phase); // Synergetics contraction
  const twist = THREE.MathUtils.lerp(0, Math.PI / 3, phase); // 60-degree twist

  // Generate vertices based on phase
  for (let i = 0; i < vertexCount; i++) {
    const angle = (i / vertexCount) * Math.PI * 2;
    const height = Math.sin(angle) * radius;

    // Apply twist transformation
    const twistedAngle = angle + twist;
    const x = Math.cos(twistedAngle) * radius * (1 - phase * 0.3);
    const z = Math.sin(twistedAngle) * radius * (1 - phase * 0.3);
    const y = height * (1 - phase * 0.5);

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    // Color interpolation based on phase
    const color = new THREE.Color();
    if (phase < 0.3) {
      color.copy(COLOR_PALETTES.positive.ve);
    } else if (phase < 0.7) {
      color.lerpColors(COLOR_PALETTES.positive.ve, COLOR_PALETTES.positive.ico, (phase - 0.3) / 0.4);
    } else {
      color.lerpColors(COLOR_PALETTES.positive.ico, COLOR_PALETTES.positive.tet, (phase - 0.7) / 0.3);
    }

    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // Generate faces based on phase
  if (phase < 0.5) {
    // VE-like structure (more complex)
    generateVEFaces(geometry, vertexCount);
  } else {
    // Tetrahedron-like structure (simpler)
    generateTetrahedronFaces(geometry, vertexCount);
  }

  return geometry;
}

function generateVEFaces(geometry: THREE.BufferGeometry, vertexCount: number) {
  const indices: number[] = [];

  // Create triangular faces for VE-like structure
  for (let i = 0; i < vertexCount; i++) {
    const next = (i + 1) % vertexCount;
    const skip = (i + 2) % vertexCount;

    // Central vertex (approximated)
    const center = Math.floor(vertexCount / 2);
    indices.push(center, i, next);
    indices.push(i, next, skip);
  }

  geometry.setIndex(indices);
}

function generateTetrahedronFaces(geometry: THREE.BufferGeometry, vertexCount: number) {
  const indices = [
    0, 1, 2,  // Base triangle
    0, 1, 3,  // Side triangle
    0, 2, 3,  // Side triangle
    1, 2, 3   // Side triangle
  ];

  geometry.setIndex(indices);
}

// ============================================================================
// JITTERBUG COMPONENT
// ============================================================================

function JitterbugMesh({ state }: { state: JitterbugState & {
  quantumMetrics?: any;
  consciousnessField?: number;
} }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometryRef = useRef<THREE.BufferGeometry>();

  // Generate geometry based on current phase
  const geometry = useMemo(() => {
    return generateJitterbugGeometry(state.phase);
  }, [state.phase]);

  useFrame((frameState) => {
    if (!meshRef.current) return;

    const mesh = meshRef.current;

    // Add breathing animation for VE state
    if (state.phase < 0.1) {
      const breath = Math.sin(frameState.clock.elapsedTime * 2) * 0.05;
      mesh.scale.setScalar(1 + breath);
    } else {
      mesh.scale.setScalar(1);
    }

    // Add jitter for processing states
    if (state.isProcessing && state.phase > 0.2 && state.phase < 0.8) {
      const jitter = Math.sin(frameState.clock.elapsedTime * 10) * 0.02 * state.cognitiveLoad;
      mesh.rotation.x += jitter;
      mesh.rotation.y += jitter * 0.7;
      mesh.rotation.z += jitter * 0.5;
    }

    // Color animation based on emotional valence
    const palette = COLOR_PALETTES[state.emotionalValence];
    let targetColor: THREE.Color;

    if (state.phase < PHASES.ICOSAHEDRON) {
      targetColor = palette.ve;
    } else if (state.phase < PHASES.OCTAHEDRON) {
      targetColor = palette.ico;
    } else {
      targetColor = palette.tet;
    }

    if (mesh.material instanceof THREE.MeshBasicMaterial) {
      mesh.material.color.lerp(targetColor, 0.05);
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshBasicMaterial
        vertexColors
        transparent
        opacity={0.8}
        side={THREE.DoubleSide}
        wireframe={state.phase < 0.5} // Wireframe for open states
      />
    </mesh>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function CognitiveJitterbug({
  phase = 0,
  cognitiveLoad = 1,
  emotionalValence = 'neutral',
  isProcessing = false,
  quantumMetrics = {
    entanglement: 0,
    superposition: 0,
    decoherence: 0,
    waveFunction: 1,
    harmonicResonance: 432,
    fieldStrength: 0.8
  },
  consciousnessField = 0.8
}: CognitiveJitterbugProps) {

  const state: JitterbugState = {
    phase: Math.max(0, Math.min(1, phase)),
    cognitiveLoad: Math.max(0.1, Math.min(5, cognitiveLoad)),
    emotionalValence,
    isProcessing
  };

  const enhancedState = {
    ...state,
    quantumMetrics,
    consciousnessField
  };

  return (
    <div style={{
      width: '100%',
      height: '400px',
      borderRadius: '12px',
      overflow: 'hidden',
      background: `linear-gradient(135deg, ${GOD_CONFIG.theme.bg.secondary} 0%, ${GOD_CONFIG.theme.bg.primary} 100%)`,
      position: 'relative'
    }}>
      <Canvas
        camera={{ position: [3, 2, 3], fov: 50 }}
        style={{ background: 'transparent' }}
        gl={{
          antialias: false,
          powerPreference: "high-performance",
          alpha: true
        }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.2} color="#ffffff" castShadow />

        {/* Unworldly 3D Scene */}
        <UnworldlyScene
          phase={phase}
          cognitiveLoad={cognitiveLoad}
          emotionalValence={emotionalValence}
          quantumMetrics={quantumMetrics}
          consciousnessField={consciousnessField}
        />

        <JitterbugMesh state={enhancedState} />

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={15}
          zoomSpeed={0.8}
          rotateSpeed={0.6}
        />
      </Canvas>

      {/* Phase Indicator */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        right: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(0,0,0,0.7)',
        padding: '12px 16px',
        borderRadius: '8px',
        fontSize: '14px',
        color: 'white'
      }}>
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
            Cognitive State: {getPhaseName(state.phase)}
          </div>
          <div style={{ opacity: 0.8 }}>
            Phase: {(state.phase * 100).toFixed(1)}% • Load: {state.cognitiveLoad.toFixed(1)}x
          </div>
        </div>

        <div style={{
          width: '120px',
          height: '8px',
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${state.phase * 100}%`,
            height: '100%',
            background: getPhaseColor(state.emotionalValence, state.phase),
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function getPhaseName(phase: number): string {
  if (phase < PHASES.ICOSAHEDRON) return 'Vector Equilibrium';
  if (phase < PHASES.OCTAHEDRON) return 'Icosahedron';
  if (phase < PHASES.TETRAHEDRON) return 'Octahedron';
  return 'Tetrahedron';
}

function getPhaseColor(valence: string, phase: number): string {
  const palette = COLOR_PALETTES[valence as keyof typeof COLOR_PALETTES] || COLOR_PALETTES.neutral;

  if (phase < PHASES.ICOSAHEDRON) return `#${palette.ve.getHexString()}`;
  if (phase < PHASES.OCTAHEDRON) return `#${palette.ico.getHexString()}`;
  return `#${palette.tet.getHexString()}`;
}