/**
 * TETRAHEDRON PROTOCOL VISUALIZATION
 * 3D visualization of Delta Topology with SIC-POVM symmetry
 * React Three Fiber implementation
 */

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import type { TetrahedronNode, TetrahedronState } from '../types/tetrahedron.types';
import { computeTetrahedronState, sicPOVMToPositions, generateSICPOVMs } from '../lib/tetrahedron-math';
import GOD_CONFIG from '../god.config';

interface TetrahedronProtocolProps {
  nodes?: TetrahedronNode[];
  onStateChange?: (state: TetrahedronState) => void;
  autoRotate?: boolean;
}

function TetrahedronMesh({
  nodes,
  onStateChange,
}: {
  nodes: TetrahedronNode[];
  onStateChange?: (state: TetrahedronState) => void;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const edgesRef = useRef<THREE.LineSegments>(null);
  const nodesRef = useRef<THREE.InstancedMesh>(null);

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
        <TetrahedronMesh nodes={nodes} onStateChange={onStateChange} />

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
      </div>
    </div>
  );
}

export default TetrahedronProtocol;

