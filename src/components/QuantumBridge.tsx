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
 * ║   QUANTUM BRIDGE - Hardware ↔ Visualization Entanglement                  ║
 * ║   The Phenix Navigator's physical state drives quantum geometry           ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 * 
 * MATH IS KING. THE GEOMETRY RULES. EFFICIENT AND QUANTUMATICALLY.
 * 
 * Physical Mapping:
 * - Accelerometer X,Y,Z → Tetrahedron rotation (Euler angles)
 * - Touch X,Y → Closest K4 node selection
 * - Battery % → Energy glow intensity
 * - Mode → Visualization state (breathing = pulse, grounding = stable)
 */

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sparkles, Float } from '@react-three/drei';
import * as THREE from 'three';
import { usePhenixStore } from '../store/phenix.store';
import GOD_CONFIG from '../god.config';

// ═══════════════════════════════════════════════════════════════════════════
// QUANTUM CONSTANTS - K4 Tetrahedron vertices (SIC-POVM)
// ═══════════════════════════════════════════════════════════════════════════

const K4_VERTICES = [
  new THREE.Vector3(1, 1, 1).normalize(),
  new THREE.Vector3(1, -1, -1).normalize(),
  new THREE.Vector3(-1, 1, -1).normalize(),
  new THREE.Vector3(-1, -1, 1).normalize(),
];

const K4_LABELS = ['Self 💜', 'Other 💚', 'Context 🌊', 'AI ⚡'];
const K4_COLORS = ['#a78bfa', '#22c55e', '#0ea5e9', '#eab308'];

// Accelerometer scaling (raw values → radians)
const ACCEL_SCALE = 0.0001; // Sensitivity tuning
const SMOOTHING = 0.08;     // Lerp factor (lower = smoother)

// ═══════════════════════════════════════════════════════════════════════════
// QUANTUM TETRAHEDRON - The Core K4 Manifold
// ═══════════════════════════════════════════════════════════════════════════

function QuantumTetrahedron({
  accel,
  touch,
  mode,
  battery,
}: {
  accel: { x: number; y: number; z: number };
  touch: { active: boolean; x: number; y: number };
  mode: string;
  battery: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const targetRotation = useRef(new THREE.Euler(0, 0, 0));
  const currentRotation = useRef(new THREE.Euler(0, 0, 0));

  // Compute target rotation from accelerometer
  useEffect(() => {
    // Convert accelerometer to Euler angles
    // X tilt → pitch, Y tilt → roll, Z (gravity) → yaw hint
    const pitch = accel.y * ACCEL_SCALE;
    const roll = accel.x * ACCEL_SCALE;
    const yaw = (accel.z + 8192) * ACCEL_SCALE * 0.1; // Slight yaw from Z variance
    
    targetRotation.current.set(pitch, yaw, roll);
  }, [accel]);

  // Map touch to node selection (quadrant-based) - computed value, not state
  const selectedNode = useMemo(() => {
    if (touch.active) {
      const col = touch.x < 240 ? 0 : 1;
      const row = touch.y < 160 ? 0 : 1;
      return row * 2 + col;
    }
    return -1;
  }, [touch]);

  // Smooth animation loop
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Lerp current rotation toward target
    currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * SMOOTHING;
    currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * SMOOTHING;
    currentRotation.current.z += (targetRotation.current.z - currentRotation.current.z) * SMOOTHING;

    // Apply rotation
    groupRef.current.rotation.x = currentRotation.current.x;
    groupRef.current.rotation.y = currentRotation.current.y + delta * 0.2; // Gentle auto-spin
    groupRef.current.rotation.z = currentRotation.current.z;
  });

  // Visual state based on mode
  const modeState = useMemo(() => {
    switch (mode) {
      case 'breathing':
        return { pulse: true, speed: 2, color: '#0ea5e9' };
      case 'grounding':
        return { pulse: false, speed: 0.5, color: '#22c55e' };
      case 'heavy_work':
        return { pulse: true, speed: 4, color: '#f97316' };
      default:
        return { pulse: false, speed: 1, color: '#a78bfa' };
    }
  }, [mode]);

  // Energy glow from battery
  const glowIntensity = useMemo(() => 0.3 + (battery / 100) * 0.7, [battery]);

  return (
    <group ref={groupRef}>
      {/* The K4 Tetrahedron Edges */}
      <TetrahedronEdges color={modeState.color} intensity={glowIntensity} />

      {/* The 4 Nodes */}
      {K4_VERTICES.map((pos, i) => (
        <TetrahedronNode
          key={i}
          position={pos}
          color={K4_COLORS[i]}
          selected={selectedNode === i}
          pulse={modeState.pulse}
          pulseSpeed={modeState.speed}
          glowIntensity={glowIntensity}
        />
      ))}

      {/* Energy Field Sparkles */}
      <Sparkles
        count={50}
        size={2}
        scale={3}
        speed={0.5}
        color={modeState.color}
        opacity={glowIntensity * 0.5}
      />
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TETRAHEDRON EDGES - The 6 K4 connections
// ═══════════════════════════════════════════════════════════════════════════

function TetrahedronEdges({ color, intensity }: { color: string; intensity: number }) {
  const linesRef = useRef<THREE.LineSegments>(null);

  useEffect(() => {
    if (!linesRef.current) return;

    const positions: number[] = [];
    const colors: number[] = [];
    const edgeColor = new THREE.Color(color);

    // 6 edges of tetrahedron: 01, 02, 03, 12, 13, 23
    const pairs = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];
    
    pairs.forEach(([i, j]) => {
      const a = K4_VERTICES[i];
      const b = K4_VERTICES[j];
      positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
      colors.push(edgeColor.r, edgeColor.g, edgeColor.b);
      colors.push(edgeColor.r, edgeColor.g, edgeColor.b);
    });

    const geom = linesRef.current.geometry;
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  }, [color]);

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry />
      <lineBasicMaterial
        vertexColors
        transparent
        opacity={intensity}
        linewidth={2}
      />
    </lineSegments>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TETRAHEDRON NODE - Individual vertex with selection state
// ═══════════════════════════════════════════════════════════════════════════

function TetrahedronNode({
  position,
  color,
  selected,
  pulse,
  pulseSpeed,
  glowIntensity,
}: {
  position: THREE.Vector3;
  color: string;
  selected: boolean;
  pulse: boolean;
  pulseSpeed: number;
  glowIntensity: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const baseScale = selected ? 1.5 : 1;

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    
    let scale = baseScale;
    if (pulse) {
      scale *= 1 + Math.sin(clock.elapsedTime * pulseSpeed) * 0.2;
    }
    meshRef.current.scale.setScalar(scale * 0.12);
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
      <group position={position}>
        {/* Core sphere */}
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1, 2]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={selected ? glowIntensity * 1.5 : glowIntensity}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Selection ring */}
        {selected && (
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.15, 0.18, 32]} />
            <meshBasicMaterial color={color} transparent opacity={0.8} />
          </mesh>
        )}
      </group>
    </Float>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// BLOCH SPHERE - The containing quantum state space
// ═══════════════════════════════════════════════════════════════════════════

function BlochSphere() {
  return (
    <mesh>
      <sphereGeometry args={[1.8, 32, 32]} />
      <meshStandardMaterial
        color={GOD_CONFIG.theme.bg.tertiary}
        wireframe
        transparent
        opacity={0.15}
      />
    </mesh>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// QUANTUM BRIDGE - Main exported component
// ═══════════════════════════════════════════════════════════════════════════

export default function QuantumBridge() {
  const { deviceState, isConnected } = usePhenixStore();

  // Extract sensor data with defaults
  const accel = deviceState?.accelerometer ?? { x: 0, y: 0, z: -8192 };
  const touch = deviceState?.touch ?? { active: false, x: 0, y: 0 };
  const mode = deviceState?.mode ?? 'normal';
  const battery = deviceState?.battery ?? 100;

  return (
    <div className="relative w-full h-[500px] rounded-xl overflow-hidden"
         style={{ 
           backgroundColor: GOD_CONFIG.theme.bg.primary,
           border: `1px solid ${GOD_CONFIG.theme.border.default}`,
         }}>
      
      {/* Connection Status Overlay */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-zinc-600'}`} />
        <span className="text-xs font-mono" style={{ color: GOD_CONFIG.theme.text.muted }}>
          {isConnected ? 'QUANTUM LINK ACTIVE' : 'AWAITING ENTANGLEMENT'}
        </span>
      </div>

      {/* Sensor Data Display */}
      {isConnected && (
        <div className="absolute top-4 right-4 z-10 text-right space-y-1">
          <div className="text-xs font-mono" style={{ color: GOD_CONFIG.theme.text.accent }}>
            ⚡ {mode.toUpperCase()}
          </div>
          <div className="text-xs font-mono" style={{ color: GOD_CONFIG.theme.text.muted }}>
            🔋 {battery}%
          </div>
          <div className="text-xs font-mono" style={{ color: GOD_CONFIG.theme.text.muted }}>
            📐 X:{accel.x.toFixed(0)} Y:{accel.y.toFixed(0)}
          </div>
          {touch.active && (
            <div className="text-xs font-mono" style={{ color: K4_COLORS[Math.floor(touch.y / 160) * 2 + Math.floor(touch.x / 240)] }}>
              👆 {K4_LABELS[Math.floor(touch.y / 160) * 2 + Math.floor(touch.x / 240)]}
            </div>
          )}
        </div>
      )}

      {/* 3D Canvas */}
      <Canvas camera={{ position: [3, 3, 3], fov: 50 }}>
        <color attach="background" args={[GOD_CONFIG.theme.bg.primary]} />
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
        <pointLight position={[-5, -5, -5]} intensity={0.3} color="#a78bfa" />

        <BlochSphere />
        <QuantumTetrahedron
          accel={accel}
          touch={touch}
          mode={mode}
          battery={battery}
        />

        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={2}
          maxDistance={8}
        />
      </Canvas>

      {/* Bottom Status Bar */}
      <div 
        className="absolute bottom-0 left-0 right-0 p-3 backdrop-blur-md"
        style={{ 
          backgroundColor: `${GOD_CONFIG.theme.bg.secondary}CC`,
          borderTop: `1px solid ${GOD_CONFIG.theme.border.default}`,
        }}
      >
        <div className="flex justify-between items-center">
          <span className="text-xs font-mono" style={{ color: GOD_CONFIG.theme.text.muted }}>
            K4 TOPOLOGY • SIC-POVM MANIFOLD
          </span>
          <span className="text-xs font-mono" style={{ color: GOD_CONFIG.theme.text.accent }}>
            MATH IS KING 👑
          </span>
        </div>
      </div>
    </div>
  );
}
