/**
 * TETRAHEDRON PROTOCOL VISUALIZATION
 * 3D visualization of Delta Topology with SIC-POVM symmetry
 * React Three Fiber implementation with live measurement simulation
 */

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';
import type { TetrahedronNode, TetrahedronState } from '../types/tetrahedron.types';
import { computeTetrahedronState, sicPOVMToPositions, generateSICPOVMs } from '../lib/tetrahedron-math';
import PQCDemo from './PQCDemo';
import WebSerialDemo from './WebSerialDemo';
import WebContainerIDE from './WebContainerIDE';
import QuantumEntanglementDemo from './QuantumEntanglementDemo';
import CoherenceQuest from './CoherenceQuest';
import GodotWASMStudio from './GodotWASMStudio';
import LuantiVoxelStudio from './LuantiVoxelStudio';
import JitterbugVisualizer from './JitterbugVisualizer';
import DriveLibrarianDemo from './DriveLibrarianDemo';
import CognitiveHubDemo from './CognitiveHubDemo';
import TimeInfrastructureAnalysis from './TimeInfrastructureAnalysis';
import GOD_CONFIG from '../god.config';

interface TetrahedronProtocolProps {
  nodes?: TetrahedronNode[];
  onStateChange?: (state: TetrahedronState) => void;
  autoRotate?: boolean;
  enableSimulation?: boolean;
}

interface QuantumState {
  theta: number; // Polar angle
  phi: number;   // Azimuthal angle
  purity: number;
}

interface MeasurementResult {
  outcome: string;
  probability: number;
  timestamp: number;
}

function TetrahedronMesh({
  nodes,
  onStateChange,
  enableSimulation = false,
}: {
  nodes: TetrahedronNode[];
  onStateChange?: (state: TetrahedronState) => void;
  enableSimulation?: boolean;
}) {
  const [quantumState, setQuantumState] = useState<QuantumState>({
    theta: Math.PI / 4,
    phi: Math.PI / 4,
    purity: 1.0
  });

  const [measurementHistory, setMeasurementHistory] = useState<MeasurementResult[]>([]);
  const [isMeasuring, setIsMeasuring] = useState(false);

  // Perform SIC-POVM measurement
  const performMeasurement = async () => {
    if (isMeasuring) return;

    setIsMeasuring(true);

    try {
      // Simulate measurement delay for dramatic effect
      await new Promise(resolve => setTimeout(resolve, 500));

      // Perform SIC-POVM measurement (simplified for demo)
      const result = {
        outcome: Math.floor(Math.random() * 4), // 4 possible outcomes for tetrahedron
        probability: quantumState.purity * 0.25 + (1 - quantumState.purity) * (1/4)
      };

      // Add to history
      const measurementResult: MeasurementResult = {
        outcome: result.outcome,
        probability: result.probability,
        timestamp: Date.now()
      };

      setMeasurementHistory(prev => [measurementResult, ...prev.slice(0, 9)]); // Keep last 10

      // Add some noise to demonstrate decoherence
      setQuantumState(prev => ({
        ...prev,
        purity: Math.max(0.3, prev.purity - 0.05) // Gradual decoherence
      }));

    } catch (error) {
      console.error('Measurement failed:', error);
    } finally {
      setIsMeasuring(false);
    }
  };

  // Reset quantum state
  const resetState = () => {
    setQuantumState({
      theta: Math.PI / 4,
      phi: Math.PI / 4,
      purity: 1.0
    });
    setMeasurementHistory([]);
  };
  const meshRef = useRef<THREE.Group>(null);
  const edgesRef = useRef<THREE.LineSegments>(null);
  const nodesRef = useRef<THREE.InstancedMesh>(null);
  const quantumStateRef = useRef<THREE.Group>(null);

  // Compute tetrahedron state
  const state = useMemo(() => computeTetrahedronState(nodes), [nodes]);

  // Update positions from SIC-POVM
  const positions = useMemo(() => sicPOVMToPositions(state.sicPOVMs), [state.sicPOVMs]);

  // Determine visual state
  const visualState = useMemo(() => {
    if (state.ontologicalSecurity) {
      return {
        color: GOD_CONFIG.tetrahedron.visualization.colors.stable,
        glow: GOD_CONFIG.tetrahedron.visualization.glowIntensity.stable,
      };
    }
    if (state.curvature.status === 'convergent') {
      return {
        color: GOD_CONFIG.tetrahedron.visualization.colors.convergent,
        glow: GOD_CONFIG.tetrahedron.visualization.glowIntensity.convergent,
      };
    }
    if (state.curvature.status === 'divergent') {
      return {
        color: GOD_CONFIG.tetrahedron.visualization.colors.divergent,
        glow: GOD_CONFIG.tetrahedron.visualization.glowIntensity.divergent,
      };
    }
    return {
      color: GOD_CONFIG.tetrahedron.visualization.colors.neutral,
      glow: GOD_CONFIG.tetrahedron.visualization.glowIntensity.neutral,
    };
  }, [state]);

  // Calculate deformation scale based on symmetry
  const scale = useMemo(() => {
    // Deform if symmetry is low
    return 0.8 + state.symmetry * 0.2; // Scale between 0.8 and 1.0
  }, [state.symmetry]);

  // Update edges (6 edges in a tetrahedron)
  useEffect(() => {
    if (!edgesRef.current) return;

    const edges: number[] = [];
    const colors: number[] = [];

    // Define 6 edges of tetrahedron
    const edgePairs = [
      [0, 1],
      [0, 2],
      [0, 3],
      [1, 2],
      [1, 3],
      [2, 3],
    ];

    edgePairs.forEach(([i, j]) => {
      const [x1, y1, z1] = positions[i];
      const [x2, y2, z2] = positions[j];

      edges.push(x1 * scale, y1 * scale, z1 * scale);
      edges.push(x2 * scale, y2 * scale, z2 * scale);

      // Color based on visual state
      const color = new THREE.Color(visualState.color);
      colors.push(color.r, color.g, color.b);
      colors.push(color.r, color.g, color.b);
    });

    edgesRef.current.geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(edges, 3)
    );
    edgesRef.current.geometry.setAttribute(
      'color',
      new THREE.Float32BufferAttribute(colors, 3)
    );
  }, [positions, scale, visualState.color]);

  // Update nodes
  useEffect(() => {
    if (!nodesRef.current) return;

    const tempObject = new THREE.Object3D();
    positions.forEach(([x, y, z], i) => {
      tempObject.position.set(x * scale, y * scale, z * scale);
      tempObject.scale.set(1, 1, 1);
      tempObject.updateMatrix();
      nodesRef.current!.setMatrixAt(i, tempObject.matrix);
    });
    nodesRef.current.instanceMatrix.needsUpdate = true;
  }, [positions, scale]);

  // Animate glow effect
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const glowIntensity = visualState.glow + Math.sin(clock.elapsedTime * 2) * 0.1;
      meshRef.current.children.forEach((child) => {
        if (child instanceof THREE.Mesh) {
          (child.material as THREE.MeshStandardMaterial).emissiveIntensity = glowIntensity;
        }
      });
    }
  });

  // Notify parent of state changes
  useEffect(() => {
    onStateChange?.(state);
  }, [state, onStateChange]);

  return (
    <group ref={meshRef}>
      {/* Edges */}
      <lineSegments ref={edgesRef}>
        <bufferGeometry />
        <lineBasicMaterial vertexColors />
      </lineSegments>

      {/* Nodes */}
      <instancedMesh
        ref={nodesRef}
        args={[undefined, undefined, 4]}
        position={[0, 0, 0]}
      >
        <sphereGeometry args={[GOD_CONFIG.tetrahedron.visualization.nodeSize, 16, 16]} />
        <meshStandardMaterial
          color={visualState.color}
          emissive={visualState.color}
          emissiveIntensity={visualState.glow}
        />
      </instancedMesh>

      {/* Node Labels */}
      {nodes.map((node, i) => {
        const [x, y, z] = positions[i];
        return (
          <Text
            key={node.id}
            position={[x * scale * 1.3, y * scale * 1.3, z * scale * 1.3]}
            fontSize={0.1}
            color={visualState.color}
            anchorX="center"
            anchorY="middle"
          >
            {node.label}
          </Text>
        );
      })}

      {/* SIC-POVM Simulation: Bloch Sphere and Quantum State */}
      {enableSimulation && (
        <>
          {/* Bloch Sphere */}
          <Sphere args={[1.5, 32, 32]} position={[3, 0, 0]}>
            <meshBasicMaterial
              color="#1a1a2e"
              wireframe
              transparent
              opacity={0.3}
            />
          </Sphere>

          {/* Quantum State Vector */}
          <group ref={quantumStateRef}>
            <arrowHelper
              args={[
                new THREE.Vector3(
                  Math.sin(quantumState.theta) * Math.cos(quantumState.phi),
                  Math.cos(quantumState.theta),
                  Math.sin(quantumState.theta) * Math.sin(quantumState.phi)
                ),
                new THREE.Vector3(3, 0, 0),
                1.3,
                quantumState.purity > 0.8 ? '#22c55e' : quantumState.purity > 0.5 ? '#eab308' : '#ef4444',
                0.08,
                0.04
              ]}
            />
          </group>

          {/* SIC-POVM Measurement Points */}
          {state.sicPOVMs.map((povm, index) => (
            <Sphere
              key={index}
              args={[0.03, 8, 8]}
              position={[
                3 + povm.vector.x * 1.5,
                povm.vector.y * 1.5,
                povm.vector.z * 1.5
              ]}
            >
              <meshBasicMaterial
                color="#a78bfa"
                emissive="#a78bfa"
                emissiveIntensity={0.3}
              />
            </Sphere>
          ))}
        </>
      )}
    </group>
  );
}

function BlochSphere() {
  const sphereRef = useRef<THREE.Mesh>(null);

  return (
    <mesh ref={sphereRef} position={[0, 0, 0]}>
      <sphereGeometry args={[GOD_CONFIG.tetrahedron.visualization.sphereRadius, 32, 32]} />
      <meshStandardMaterial
        color={GOD_CONFIG.theme.bg.tertiary}
        wireframe
        opacity={0.2}
        transparent
      />
    </mesh>
  );
}

export function TetrahedronProtocol({
  nodes: providedNodes,
  onStateChange,
  autoRotate = true,
  enableSimulation = false,
}: TetrahedronProtocolProps) {
  // Default nodes if not provided
  const nodes = useMemo<TetrahedronNode[]>(() => {
    if (providedNodes) return providedNodes;

    // Default: A, B, Context, AI
    const sicPOVMs = generateSICPOVMs();
    const positions = sicPOVMToPositions(sicPOVMs);
    return [
      {
        id: 'node-a',
        label: 'A',
        position: positions[0],
        state: [1, 0],
      },
      {
        id: 'node-b',
        label: 'B',
        position: positions[1],
        state: [0.707, 0.707],
      },
      {
        id: 'node-context',
        label: 'Context',
        position: positions[2],
        state: [0.707, -0.707],
      },
      {
        id: 'node-ai',
        label: 'AI',
        position: positions[3],
        state: [0.5, 0.866],
      },
    ];
  }, [providedNodes]);

  return (
    <div
      style={{
        width: '100%',
        height: '500px',
        backgroundColor: GOD_CONFIG.theme.bg.primary,
        borderRadius: 12,
        border: `1px solid ${GOD_CONFIG.theme.border.default}`,
        overflow: 'hidden',
      }}
    >
      <Canvas camera={{ position: [4, 4, 4], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        <BlochSphere />
        <TetrahedronMesh nodes={nodes} onStateChange={onStateChange} enableSimulation={enableSimulation} />

        <OrbitControls
          autoRotate={autoRotate}
          autoRotateSpeed={0.5}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>

      {/* Status Display */}
      <div
        style={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          right: 16,
          padding: 12,
          backgroundColor: `${GOD_CONFIG.theme.bg.secondary}E6`,
          borderRadius: 8,
          backdropFilter: 'blur(10px)',
        }}
      >
        <TetrahedronStatusDisplay nodes={nodes} />
      </div>
    </div>
  );
}

function TetrahedronStatusDisplay({ nodes }: { nodes: TetrahedronNode[] }) {
  const state = useMemo(() => computeTetrahedronState(nodes), [nodes]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div
          style={{
            fontSize: 11,
            fontFamily: GOD_CONFIG.typography.fontFamily.display,
            color: GOD_CONFIG.theme.text.muted,
          }}
        >
          TETRAHEDRON PROTOCOL
        </div>
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            fontFamily: GOD_CONFIG.typography.fontFamily.display,
            color: state.ontologicalSecurity
              ? GOD_CONFIG.tetrahedron.visualization.colors.stable
              : GOD_CONFIG.tetrahedron.visualization.colors.divergent,
          }}
        >
          {state.ontologicalSecurity ? '✓ Ontologically Secure' : '⚠ Entropy Detected'}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        <div>
          <div style={{ fontSize: 9, color: GOD_CONFIG.theme.text.muted, marginBottom: 2 }}>
            Symmetry
          </div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              fontFamily: GOD_CONFIG.typography.fontFamily.display,
              color: GOD_CONFIG.theme.text.primary,
            }}
          >
            {(state.symmetry * 100).toFixed(1)}%
          </div>
        </div>
        <div>
          <div style={{ fontSize: 9, color: GOD_CONFIG.theme.text.muted, marginBottom: 2 }}>
            Curvature (κ)
          </div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              fontFamily: GOD_CONFIG.typography.fontFamily.display,
              color:
                state.curvature.status === 'convergent'
                  ? GOD_CONFIG.tetrahedron.visualization.colors.convergent
                  : state.curvature.status === 'divergent'
                  ? GOD_CONFIG.tetrahedron.visualization.colors.divergent
                  : GOD_CONFIG.theme.text.muted,
            }}
          >
            {state.curvature.kappa.toFixed(3)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 9, color: GOD_CONFIG.theme.text.muted, marginBottom: 2 }}>
            Purity
          </div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              fontFamily: GOD_CONFIG.typography.fontFamily.display,
              color: GOD_CONFIG.theme.text.primary,
            }}
          >
            {state.densityMatrix.purity.toFixed(3)}
          </div>
        </div>

        {/* SIC-POVM Measurement Simulation */}
        {enableSimulation && (
          <>
            <div style={{ marginTop: 24, padding: 16, backgroundColor: GOD_CONFIG.theme.bg.secondary, borderRadius: 8 }}>
              <h3 style={{ margin: '0 0 16px 0', color: GOD_CONFIG.theme.text.primary, fontSize: 16 }}>
                🔬 SIC-POVM Measurement Simulation
              </h3>

            {/* Quantum State Controls */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: GOD_CONFIG.theme.text.secondary }}>
                  Polar Angle (θ): {quantumState.theta.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max={Math.PI.toString()}
                  step="0.1"
                  value={quantumState.theta}
                  onChange={(e) => setQuantumState(prev => ({ ...prev, theta: parseFloat(e.target.value) }))}
                  style={{ width: 120 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: GOD_CONFIG.theme.text.secondary }}>
                  Azimuthal Angle (φ): {quantumState.phi.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max={(2 * Math.PI).toString()}
                  step="0.1"
                  value={quantumState.phi}
                  onChange={(e) => setQuantumState(prev => ({ ...prev, phi: parseFloat(e.target.value) }))}
                  style={{ width: 120 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: GOD_CONFIG.theme.text.secondary }}>
                  Purity: {quantumState.purity.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={quantumState.purity}
                  onChange={(e) => setQuantumState(prev => ({ ...prev, purity: parseFloat(e.target.value) }))}
                  style={{ width: 120 }}
                />
              </div>
            </div>

            {/* Control Buttons */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <button
                onClick={performMeasurement}
                disabled={isMeasuring}
                style={{
                  padding: '8px 16px',
                  backgroundColor: isMeasuring ? GOD_CONFIG.theme.bg.tertiary : GOD_CONFIG.theme.text.accent,
                  border: 'none',
                  borderRadius: 6,
                  color: isMeasuring ? GOD_CONFIG.theme.text.muted : '#fff',
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: isMeasuring ? 'not-allowed' : 'pointer',
                }}
              >
                {isMeasuring ? '🔄 Measuring...' : '⚛️ Perform SIC-POVM Measurement'}
              </button>

              <button
                onClick={resetState}
                style={{
                  padding: '8px 16px',
                  backgroundColor: GOD_CONFIG.theme.bg.tertiary,
                  border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                  borderRadius: 6,
                  color: GOD_CONFIG.theme.text.secondary,
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                🔄 Reset State
              </button>
            </div>

            {/* Measurement History */}
            {measurementHistory.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: 14, color: GOD_CONFIG.theme.text.primary }}>
                  📊 Recent Measurements
                </h4>
                <div style={{ maxHeight: 120, overflowY: 'auto', backgroundColor: GOD_CONFIG.theme.bg.primary, borderRadius: 4, padding: 8 }}>
                  {measurementHistory.slice(0, 5).map((measurement, index) => (
                    <div key={measurement.timestamp} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '4px 0',
                      borderBottom: index < measurementHistory.length - 1 ? `1px solid ${GOD_CONFIG.theme.border.default}` : 'none',
                      fontSize: 12,
                      color: GOD_CONFIG.theme.text.secondary
                    }}>
                      <span style={{ fontWeight: 500 }}>{measurement.outcome}</span>
                      <span>{(measurement.probability * 100).toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Demo Components */}
      <>
        {/* Post-Quantum Cryptography Demo */}
        <PQCDemo />

        {/* Web Serial Bridge Demo */}
        <WebSerialDemo />

        {/* WebContainer IDE Demo */}
        <WebContainerIDE />

        {/* Quantum Entanglement Bridge Demo */}
        <QuantumEntanglementDemo />

        {/* Coherence Quest Game */}
        <CoherenceQuest />

        {/* Godot WASM Studio */}
        <GodotWASMStudio />

        {/* Luanti Voxel Studio */}
        <LuantiVoxelStudio />

        {/* Jitterbug Entropy Visualizer */}
        <JitterbugVisualizer />

        {/* Drive Librarian Demo */}
        <DriveLibrarianDemo />

        {/* Cognitive Hub Demo */}
        <CognitiveHubDemo />

        {/* Time Infrastructure Analysis */}
        <TimeInfrastructureAnalysis />
      </>
    </div>
    </div>
  );
}

export default TetrahedronProtocol;

