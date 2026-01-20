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
 * Tetrahedron Component
 * 3D visualization of the four-node trust geometry
 * 
 * Uses React Three Fiber for WebGL rendering
 * Displays real-time mesh health and quantum state
 */

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Line } from '@react-three/drei';
import * as THREE from 'three';
import type { TetrahedronVisualization, TetrahedronProps } from '../../types';
import { HeartbeatConfig } from '../../config/god.config';

// ═══════════════════════════════════════════════════════════════════════════════
// NODE SPHERE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface NodeSphereProps {
  position: [number, number, number];
  label: string;
  status: string;
  nodeId: 'A' | 'B' | 'C' | 'D';
  onClick?: (nodeId: 'A' | 'B' | 'C' | 'D') => void;
  interactive?: boolean;
}

function NodeSphere({ position, label, status, nodeId, onClick, interactive }: NodeSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = React.useState(false);

  // Pulse animation for active nodes
  useFrame((state) => {
    if (meshRef.current && status === 'online') {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      meshRef.current.scale.setScalar(scale);
    }
  });

  const color = useMemo(() => {
    switch (status) {
      case 'online': return HeartbeatConfig.colors.green;
      case 'degraded': return HeartbeatConfig.colors.yellow;
      case 'offline': return HeartbeatConfig.colors.red;
      default: return '#6B7280';
    }
  }, [status]);

  const nodeColors: Record<string, string> = {
    A: '#00B4D8', // Cyan - Self
    B: '#F97316', // Orange - Other
    C: '#7C3AED', // Purple - Context
    D: '#10B981', // Green - Engine
  };

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={() => interactive && onClick?.(nodeId)}
        onPointerOver={() => interactive && setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial 
          color={hovered ? '#FFFFFF' : nodeColors[nodeId]} 
          emissive={color}
          emissiveIntensity={status === 'online' ? 0.5 : 0.1}
        />
      </mesh>
      {/* Node label */}
      <Text
        position={[0, 0.3, 0]}
        fontSize={0.12}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
      {/* Status indicator */}
      <mesh position={[0.2, 0.2, 0]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// EDGE LINE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface EdgeLineProps {
  start: [number, number, number];
  end: [number, number, number];
  strength: number;
  status: 'healthy' | 'stressed' | 'broken';
}

function EdgeLine({ start, end, strength, status }: EdgeLineProps) {
  const color = useMemo(() => {
    switch (status) {
      case 'healthy': return HeartbeatConfig.colors.green;
      case 'stressed': return HeartbeatConfig.colors.yellow;
      case 'broken': return HeartbeatConfig.colors.red;
    }
  }, [status]);

  const lineWidth = strength * 3 + 0.5;
  const opacity = strength * 0.8 + 0.2;

  return (
    <Line
      points={[start, end]}
      color={color}
      lineWidth={lineWidth}
      transparent
      opacity={opacity}
      dashed={status === 'broken'}
      dashSize={0.1}
      gapSize={0.05}
    />
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TETRAHEDRON SCENE
// ═══════════════════════════════════════════════════════════════════════════════

interface TetrahedronSceneProps {
  visualization: TetrahedronVisualization;
  interactive?: boolean;
  onNodeClick?: (node: 'A' | 'B' | 'C' | 'D') => void;
}

function TetrahedronScene({ visualization, interactive, onNodeClick }: TetrahedronSceneProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Slow rotation for visual interest
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  const { nodes, edges } = visualization;

  return (
    <group ref={groupRef}>
      {/* Ambient and directional lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[0, 0, 0]} intensity={0.3} color="#7C3AED" />

      {/* Render nodes */}
      {Object.entries(nodes).map(([id, node]) => (
        <NodeSphere
          key={id}
          nodeId={id as 'A' | 'B' | 'C' | 'D'}
          position={node.position}
          label={node.label}
          status={node.status}
          interactive={interactive}
          onClick={onNodeClick}
        />
      ))}

      {/* Render edges */}
      {edges.map((edge, index) => (
        <EdgeLine
          key={`${edge.from}-${edge.to}-${index}`}
          start={nodes[edge.from].position}
          end={nodes[edge.to].position}
          strength={edge.strength}
          status={edge.status}
        />
      ))}

      {/* Center point glow */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial 
          color="#7C3AED" 
          transparent 
          opacity={0.5} 
        />
      </mesh>
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function Tetrahedron({ 
  visualization, 
  interactive = false, 
  onNodeClick,
  size = 300 
}: TetrahedronProps) {
  return (
    <div 
      style={{ 
        position: 'relative',
        width: size, 
        height: size, 
        background: 'linear-gradient(135deg, #1F2937 0%, #111827 100%)',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
      role="img"
      aria-label={`Tetrahedron trust geometry visualization. Overall health: ${Math.round(visualization.overallHealth * 100)}%`}
    >
      <Canvas
        camera={{ position: [2, 2, 2], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <TetrahedronScene 
          visualization={visualization}
          interactive={interactive}
          onNodeClick={onNodeClick}
        />
        <OrbitControls 
          enableZoom={interactive}
          enablePan={false}
          minDistance={2}
          maxDistance={5}
        />
      </Canvas>
      
      {/* Health indicator overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: 8,
          left: 8,
          right: 8,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '4px 8px',
          background: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#FFFFFF',
        }}
      >
        <span>Mesh Health</span>
        <span style={{ 
          color: visualization.overallHealth > 0.7 
            ? HeartbeatConfig.colors.green 
            : visualization.overallHealth > 0.3 
              ? HeartbeatConfig.colors.yellow 
              : HeartbeatConfig.colors.red 
        }}>
          {Math.round(visualization.overallHealth * 100)}%
        </span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT VISUALIZATION (for when Navigator is offline)
// ═══════════════════════════════════════════════════════════════════════════════

export const defaultTetrahedronVisualization: TetrahedronVisualization = {
  nodes: {
    A: { position: [0, 1, 0], label: 'Self', status: 'online' },
    B: { position: [0.943, -0.333, 0], label: 'Other', status: 'offline' },
    C: { position: [-0.471, -0.333, 0.816], label: 'Context', status: 'online' },
    D: { position: [-0.471, -0.333, -0.816], label: 'Engine', status: 'offline' },
  },
  edges: [
    { from: 'A', to: 'B', strength: 0.3, status: 'stressed' },
    { from: 'A', to: 'C', strength: 0.8, status: 'healthy' },
    { from: 'A', to: 'D', strength: 0.3, status: 'stressed' },
    { from: 'B', to: 'C', strength: 0.2, status: 'broken' },
    { from: 'B', to: 'D', strength: 0.2, status: 'broken' },
    { from: 'C', to: 'D', strength: 0.5, status: 'stressed' },
  ],
  overallHealth: 0.38,
};

export default Tetrahedron;
