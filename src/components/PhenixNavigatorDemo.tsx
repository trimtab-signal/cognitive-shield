/**
 * PHENIX NAVIGATOR — Interactive Quantum Security Demonstration
 *
 * "Structure determines performance."
 * — R. Buckminster Fuller, adapted
 *
 * SIC-POVM Tetrahedral Geometry for Quantum Key Distribution
 * The minimum structural system in three-dimensional space.
 */

import React, { useState, useRef, useMemo, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  Text,
  Sphere,
  Line,
  Torus
} from '@react-three/drei';
import * as THREE from 'three';
// import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
// import { BlendFunction } from 'postprocessing';
import { CosmicTheme, COLORS } from '../config/design-tokens';

// Simplified WebGL Error Boundary
class WebGLErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean; errorMessage: string }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('WebGL Error Boundary caught:', error.message, errorInfo);
    // Force re-render with fallback immediately
    this.setState({ hasError: true, errorMessage: error.message });
  }

  render() {
    if (this.state.hasError) {
      console.log('Rendering WebGL fallback due to error:', this.state.errorMessage);
      return this.props.fallback;
    }
    try {
      return this.props.children;
    } catch (error) {
      console.error('Error in WebGL boundary render:', error);
      return this.props.fallback;
    }
  }
}

// SIC-POVM Tetrahedral Bloch Vectors
// These form a regular tetrahedron with |⟨ψᵢ|ψⱼ⟩|² = 1/3 for i ≠ j
const SIC_POVM_VECTORS = [
  new THREE.Vector3(0, 0, 1),           // |ψ₀⟩ - North Pole
  new THREE.Vector3(2 * Math.sqrt(2) / 3, 0, -1 / 3),  // |ψ₁⟩
  new THREE.Vector3(-Math.sqrt(2) / 3, Math.sqrt(2/3), -1 / 3), // |ψ₂⟩ - Corrected
  new THREE.Vector3(-Math.sqrt(2) / 3, -Math.sqrt(2/3), -1 / 3) // |ψ₃⟩ - Corrected
];

// BB84 Comparison Vectors (two orthogonal squares)
const BB84_VECTORS = [
  new THREE.Vector3(1, 0, 0),   // |0⟩ horizontal
  new THREE.Vector3(0, 1, 0),   // |1⟩ vertical
  new THREE.Vector3(0, 0, 1),   // |+⟩ diagonal 1
  new THREE.Vector3(0, 0, -1)   // |-⟩ diagonal 2
];

// Fairness constant |⟨ψᵢ|ψⱼ⟩|² = 1/3

interface SystemState {
  qber: number;
  correlationI: number;
  depolarization: number;
  rotationAngle: number;
  attackDetected: boolean;
  healing: boolean;
  status: 'SECURE' | 'CAUTION' | 'ABORT';
}

const defaultState: SystemState = {
  qber: 0.02,
  correlationI: 0.98,
  depolarization: 0.0,
  rotationAngle: 0,
  attackDetected: false,
  healing: false,
  status: 'SECURE'
};

// Tetrahedron Edges (connecting vertices)
const TETRAHEDRON_EDGES = [
  [0, 1], [0, 2], [0, 3], // from top vertex
  [1, 2], [1, 3], [2, 3]  // base triangle
];

export default function PhenixNavigatorDemo() {
  const [systemState, setSystemState] = useState<SystemState>(defaultState);
  const [selectedState, setSelectedState] = useState<number | null>(null);
  const [showBB84, setShowBB84] = useState(false);
  const [demoMode, setDemoMode] = useState<'prepare' | 'channel' | 'tomography' | 'autopoiesis'>('prepare');

  // Apply channel effects to vectors
  const transformedVectors = useMemo(() => {
    const { depolarization, rotationAngle, attackDetected } = systemState;
    const rotationMatrix = new THREE.Matrix4().makeRotationY(rotationAngle);

    return SIC_POVM_VECTORS.map(vector => {
      const v = vector.clone();

      // Apply rotation (reference frame drift)
      v.applyMatrix4(rotationMatrix);

      // Apply depolarization (shrink toward origin)
      v.multiplyScalar(1 - depolarization);

      // Apply anisotropic attack (ellipsoidal deformation)
      if (attackDetected) {
        v.x *= 1.5; // stretch X
        v.y *= 0.7; // compress Y
        v.z *= 0.8; // compress Z
      }

      return v;
    });
  }, [systemState]);

  const resetSystem = useCallback(() => {
    setSystemState(defaultState);
    setSelectedState(null);
  }, []);

  const applyDepolarization = useCallback(() => {
    setSystemState(prev => ({
      ...prev,
      depolarization: Math.min(0.8, prev.depolarization + 0.2),
      qber: Math.min(0.15, prev.qber + 0.03),
      correlationI: Math.max(0.3, prev.correlationI - 0.15)
    }));
  }, []);

  const applyAttack = useCallback(() => {
    setSystemState(prev => ({
      ...prev,
      attackDetected: true,
      qber: 0.25,
      correlationI: 0.1,
      status: 'ABORT'
    }));
  }, []);

  const applyRotation = useCallback((angle: number) => {
    setSystemState(prev => ({
      ...prev,
      rotationAngle: angle,
      correlationI: Math.max(0.8, prev.correlationI) // I remains stable under rotation
    }));
  }, []);

  const triggerAutopoiesis = useCallback(() => {
    setSystemState(prev => ({ ...prev, healing: true, status: 'CAUTION' }));

    // Simulate healing process
    setTimeout(() => {
      setSystemState(prev => ({
        ...prev,
        healing: false,
        rotationAngle: 0, // snap back to alignment
        status: 'SECURE',
        correlationI: 0.95
      }));
    }, 3000);
  }, []);

  return (
    <WebGLErrorBoundary fallback={
      <div style={{
        width: '100%',
        height: '100vh',
        background: CosmicTheme.gradients.quantum,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: COLORS.quantum.psi1,
        fontFamily: 'monospace',
        textAlign: 'center',
        padding: '20px'
      }}>
        <div>
          <h2>⚠️ WebGL Context Unavailable</h2>
          <p>The 3D visualization requires WebGL support.</p>
          <p>Try refreshing the page or using a different browser.</p>
          <p>The Cognitive Shield core functionality remains available.</p>
        </div>
      </div>
    }>
      <div style={{
        width: '100%',
        height: '100vh',
        background: CosmicTheme.gradients.quantum,
        position: 'relative',
        overflow: 'hidden'
      }}>

      {/* HUD Overlay */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        right: '20px',
        zIndex: 100,
        pointerEvents: 'none'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          fontFamily: 'monospace',
          fontSize: '14px',
          color: COLORS.quantum.psi1
        }}>

          {/* System Status */}
          <div style={{
            background: 'rgba(0, 10, 20, 0.8)',
            border: `1px solid ${systemState.status === 'SECURE' ? COLORS.quantum.psi2 : systemState.status === 'CAUTION' ? COLORS.quantum.psi3 : COLORS.signal}`,
            borderRadius: '8px',
            padding: '15px',
            minWidth: '200px'
          }}>
            <div style={{ marginBottom: '10px', fontSize: '18px', fontWeight: 'bold' }}>
              PHENIX NAVIGATOR
            </div>
            <div>STATUS: <span style={{
              color: systemState.status === 'SECURE' ? COLORS.quantum.psi2 : systemState.status === 'CAUTION' ? COLORS.quantum.psi3 : COLORS.signal
            }}>{systemState.status}</span></div>
            <div>QBER: {(systemState.qber * 100).toFixed(1)}%</div>
            <div>CORRELATION I: {(systemState.correlationI * 100).toFixed(1)}%</div>
            <div>DETECTED: {systemState.attackDetected ? 'ANISOTROPIC ATTACK' : 'ISOTROPIC NOISE'}</div>
          </div>

          {/* Philosophy Panel */}
          <div style={{
            background: 'rgba(0, 10, 20, 0.8)',
            border: '1px solid #00ffff',
            borderRadius: '8px',
            padding: '15px',
            maxWidth: '300px',
            fontSize: '12px',
            lineHeight: '1.4'
          }}>
            <div style={{ fontSize: '14px', marginBottom: '10px', fontWeight: 'bold' }}>
              🔺 SIC-POVM GEOMETRY
            </div>
            <div style={{ marginBottom: '10px' }}>
              4 non-orthogonal states arranged as tetrahedral vertices on the Bloch sphere.
            </div>
            <div style={{ marginBottom: '10px' }}>
              Fairness: |⟨ψᵢ|ψⱼ⟩|² = 1/3 for all i ≠ j
            </div>
            <div style={{ fontStyle: 'italic', borderTop: `1px solid ${COLORS.quantum.psi1}`, paddingTop: '10px' }}>
              "The tetrahedron is the minimum structural system in three-dimensional space. It cannot be deformed without breaking. This is why Phenix uses it — security based on geometry, not computational complexity."
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        right: '20px',
        zIndex: 100
      }}>

        {/* Mode Selector */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '20px',
          justifyContent: 'center'
        }}>
          {[
            { id: 'prepare', label: 'State Preparation' },
            { id: 'channel', label: 'Channel Effects' },
            { id: 'tomography', label: 'Tomography' },
            { id: 'autopoiesis', label: 'Autopoiesis' }
          ].map(mode => (
            <button
              key={mode.id}
              onClick={() => setDemoMode(mode.id as any)}
              style={{
                padding: '10px 20px',
                background: demoMode === mode.id ? COLORS.quantum.psi1 : 'rgba(0, 10, 20, 0.8)',
                color: demoMode === mode.id ? COLORS.black : COLORS.quantum.psi1,
                border: `1px solid ${COLORS.quantum.psi1}`,
                borderRadius: '5px',
                cursor: 'pointer',
                fontFamily: 'monospace',
                fontSize: '12px'
              }}
            >
              {mode.label}
            </button>
          ))}
        </div>

        {/* Mode-specific controls */}
        {demoMode === 'prepare' && (
          <div style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'center',
            marginBottom: '20px'
          }}>
            {[0, 1, 2, 3].map(i => (
              <button
                key={i}
                onClick={() => setSelectedState(i)}
                style={{
                  padding: '15px',
                  background: selectedState === i ? COLORS.quantum.psi2 : 'rgba(0, 10, 20, 0.8)',
                  color: COLORS.quantum.psi1,
                  border: '1px solid #00ffff',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontFamily: 'monospace',
                  fontSize: '16px',
                  width: '60px',
                  height: '60px'
                }}
              >
                |ψ{i}⟩
              </button>
            ))}
          </div>
        )}

        {demoMode === 'channel' && (
          <div style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <div style={{ textAlign: 'center' }}>
              <label style={{ color: '#00ffff', fontFamily: 'monospace', display: 'block', marginBottom: '5px' }}>
                Rotation (Reference Frame Drift)
              </label>
              <input
                type="range"
                min="0"
                max={2 * Math.PI}
                step="0.1"
                value={systemState.rotationAngle}
                onChange={(e) => applyRotation(parseFloat(e.target.value))}
                style={{ width: '150px' }}
              />
            </div>

            <button
              onClick={applyDepolarization}
              style={{
                padding: '10px 20px',
                background: 'rgba(0, 100, 0, 0.8)',
                color: COLORS.quantum.psi2,
                border: `1px solid ${COLORS.quantum.psi2}`,
                borderRadius: '5px',
                cursor: 'pointer',
                fontFamily: 'monospace'
              }}
            >
              Apply Noise (Safe)
            </button>

            <button
              onClick={applyAttack}
              style={{
                padding: '10px 20px',
                background: 'rgba(100, 0, 0, 0.8)',
                color: COLORS.signal,
                border: `1px solid ${COLORS.signal}`,
                borderRadius: '5px',
                cursor: 'pointer',
                fontFamily: 'monospace'
              }}
            >
              Simulate Eavesdropper
            </button>
          </div>
        )}

        {demoMode === 'autopoiesis' && (
          <div style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center'
          }}>
            <button
              onClick={triggerAutopoiesis}
              disabled={systemState.healing}
              style={{
                padding: '15px 30px',
                background: systemState.healing ? COLORS.quantum.psi3 : COLORS.quantum.psi2,
                color: systemState.healing ? '#000' : '#fff',
                border: `1px solid ${COLORS.quantum.psi2}`,
                borderRadius: '5px',
                cursor: systemState.healing ? 'not-allowed' : 'pointer',
                fontFamily: 'monospace',
                fontSize: '16px'
              }}
            >
              {systemState.healing ? 'HEALING...' : 'TRIGGER AUTOPOIESIS'}
            </button>

            <button
              onClick={() => setShowBB84(!showBB84)}
              style={{
                padding: '15px 30px',
                background: 'rgba(0, 10, 20, 0.8)',
                color: COLORS.quantum.psi1,
                border: '1px solid #00ffff',
                borderRadius: '5px',
                cursor: 'pointer',
                fontFamily: 'monospace'
              }}
            >
              {showBB84 ? 'Hide' : 'Show'} BB84 Comparison
            </button>
          </div>
        )}

        <div style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
          marginTop: '20px'
        }}>
          <button
            onClick={resetSystem}
            style={{
              padding: '10px 20px',
              background: 'rgba(0, 10, 20, 0.8)',
              color: COLORS.quantum.psi1,
              border: '1px solid #00ffff',
              borderRadius: '5px',
              cursor: 'pointer',
              fontFamily: 'monospace'
            }}
          >
            Reset System
          </button>
        </div>
      </div>

      {/* Three.js Canvas */}
      <Canvas
        camera={{ position: [3, 3, 3], fov: 50 }}
        gl={{
          antialias: false, // Reduce GPU load
          alpha: true,
          powerPreference: "default" // Reduce GPU load
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
        dpr={[1, 1]} // Limit pixel ratio to reduce GPU load
      >
        <color attach="background" args={['#0a0a0f']} />

        {/* Simplified Lighting */}
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.4} />

        {/* Temporarily disabled complex geometry to prevent WebGL context loss */}
        {/* <BlochSphere /> */}

        {/* SIC-POVM Tetrahedron - simplified */}
        <Tetrahedron
          vectors={transformedVectors}
          selectedState={selectedState}
          healing={systemState.healing}
        />

        {/* Disabled BB84 and controls to reduce complexity */}
        {/* {showBB84 && (
          <BB84Geometry />
        )} */}

        {/* <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={2}
          maxDistance={10}
        /> */}

        {/* Post-processing effects - Temporarily disabled due to Vite optimization issues */}
        {/* <EffectComposer>
          <Bloom
            intensity={0.5}
            kernelSize={3}
            luminanceThreshold={0.1}
            luminanceSmoothing={0.9}
          />
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={[0.002, 0.002]}
          />
        </EffectComposer> */}
        </Canvas>
      </div>
    </WebGLErrorBoundary>
  );
}

// Bloch Sphere Component
// function BlochSphere() {
//   return (
//     <group>
//       {/* Wireframe Sphere */}
//       <Sphere args={[1, 32, 32]} position={[0, 0, 0]}>
//         <meshBasicMaterial
//           color="#00ffff"
//           wireframe={true}
//           transparent={true}
//           opacity={0.1}
//         />
//       </Sphere>

//       {/* Equatorial Circle */}
//       <Torus args={[1, 0.01, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
//         <meshBasicMaterial color="#00ffff" transparent opacity={0.3} />
//       </Torus>

//       {/* Poles */}
//       <Sphere args={[0.05, 8, 8]} position={[0, 0, 1]}>
//         <meshBasicMaterial color="#ffffff" />
//       </Sphere>
//       <Text
//         position={[0, 0, 1.2]}
//         fontSize={0.1}
//         color="#ffffff"
//         anchorX="center"
//         anchorY="middle"
//       >
//         |0⟩
//       </Text>

//       <Sphere args={[0.05, 8, 8]} position={[0, 0, -1]}>
//         <meshBasicMaterial color="#ffffff" />
//       </Sphere>
//       <Text
//         position={[0, 0, -1.2]}
//         fontSize={0.1}
//         color="#ffffff"
//         anchorX="center"
//         anchorY="middle"
//       >
//         |1⟩
//       </Text>
//     </group>
//   );
// }

// Tetrahedron Component
function Tetrahedron({
  vectors,
  selectedState,
  healing
}: {
  vectors: THREE.Vector3[];
  selectedState: number | null;
  healing: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  // Temporarily disabled Tetrahedron animation to prevent WebGL context loss
  // useFrame((state) => {
  //   if (groupRef.current && healing) {
  //     // Healing animation - gentle pulsing
  //     groupRef.current.rotation.y += 0.02;
  //     const scale = 1 + Math.sin(state.clock.elapsedTime * 5) * 0.1;
  //     groupRef.current.scale.setScalar(scale);
  //   } else if (groupRef.current) {
  //     groupRef.current.scale.setScalar(1);
  //   }
  // });

  return (
    <group ref={groupRef}>
      {/* Tetrahedron Edges */}
      {TETRAHEDRON_EDGES.map(([i, j], index) => (
        <Line
          key={index}
          points={[vectors[i], vectors[j]]}
          color="#00ffff"
          lineWidth={3}
        />
      ))}

      {/* State Vertices */}
      {vectors.map((vector, index) => (
        <QuantumState
          key={index}
          position={vector}
          stateIndex={index}
          selected={selectedState === index}
        />
      ))}
    </group>
  );
}

// Individual Quantum State Component
function QuantumState({
  position,
  stateIndex,
  selected,
  healing
}: {
  position: THREE.Vector3;
  stateIndex: number;
  selected: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Temporarily disabled animations to prevent WebGL context loss
  // useFrame((state) => {
  //   if (meshRef.current) {
  //     if (selected) {
  //       // Selected state animation
  //       const scale = 1 + Math.sin(state.clock.elapsedTime * 8) * 0.3;
  //       meshRef.current.scale.setScalar(scale);
  //     } else if (healing) {
  //       // Healing state animation
  //       const scale = 1 + Math.sin(state.clock.elapsedTime * 6 + stateIndex) * 0.2;
  //       meshRef.current.scale.setScalar(scale);
  //     } else {
  //       meshRef.current.scale.setScalar(1);
  //     }
  //   }
  // });

  return (
    <group position={position}>
      <Sphere ref={meshRef} args={[0.08, 16, 16]}>
        <meshBasicMaterial
          color={selected ? COLORS.quantum.psi2 : COLORS.quantum.psi1}
        />
      </Sphere>

      {/* State Label */}
      <Text
        position={[0, 0.15, 0]}
        fontSize={0.08}
        color={selected ? "#00ff00" : "#00ffff"}
        anchorX="center"
        anchorY="middle"
      >
        |ψ{stateIndex}⟩
      </Text>

      {/* Bloch Vector Line (when selected) */}
      {selected && (
        <Line
          points={[new THREE.Vector3(0, 0, 0), position]}
          color={COLORS.quantum.psi2}
          lineWidth={2}
        />
      )}
    </group>
  );
}

// BB84 Comparison Component
// function BB84Geometry() {
//   return (
//     <group position={[-3, 0, 0]}>
//       {/* BB84 Square 1 (XY plane) */}
//       <Line
//         points={[
//           new THREE.Vector3(1, 0, 0),
//           new THREE.Vector3(0, 1, 0),
//           new THREE.Vector3(-1, 0, 0),
//           new THREE.Vector3(0, -1, 0),
//           new THREE.Vector3(1, 0, 0)
//         ]}
//         color="#ff6600"
//         lineWidth={2}
//       />

//       {/* BB84 Square 2 (XZ plane) */}
//       <Line
//         points={[
//           new THREE.Vector3(0, 0, 1),
//           new THREE.Vector3(1, 0, 0),
//           new THREE.Vector3(0, 0, -1),
//           new THREE.Vector3(-1, 0, 0),
//           new THREE.Vector3(0, 0, 1)
//         ]}
//         color="#ff6600"
//         lineWidth={2}
//       />

//       {/* BB84 State Points */}
//       {BB84_VECTORS.map((vector, index) => (
//         <Sphere key={index} args={[0.05, 8, 8]} position={vector}>
//           <meshBasicMaterial color="#ff6600" />
//         </Sphere>
//       ))}

//       {/* Label */}
//       <Text
//         position={[0, 1.5, 0]}
//         fontSize={0.15}
//         color="#ff6600"
//         anchorX="center"
//         anchorY="middle"
//       >
//         BB84 (2 Bases × 2 States)
//       </Text>
//     </group>
//   );
// }