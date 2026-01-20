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
 * ║   QUANTUM CORE - The Digital Cathedral                                     ║
 * ║   Sacred Geometry Visualization Engine                                    ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 * 
 * "MATH IS KING. THE GEOMETRY RULES."
 * 
 * Breaking barriers one qubit at a time.
 * The numbers are beautiful. The sorcery is real.
 */

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Stars, 
  Float, 
  Trail,
  MeshDistortMaterial,
  Sparkles
} from '@react-three/drei';
import * as THREE from 'three';
import { usePhenixStore } from '../store/phenix.store';

// ═══════════════════════════════════════════════════════════════════════════
// SACRED CONSTANTS - The Mathematics of Creation
// ═══════════════════════════════════════════════════════════════════════════

const PHI = (1 + Math.sqrt(5)) / 2;           // Golden Ratio: 1.618033988749895
const TAU = Math.PI * 2;                       // Full circle: 6.28318530718

// Tetrahedron vertices (normalized, centered at origin)
const TETRA_VERTICES = [
  new THREE.Vector3(1, 1, 1).normalize(),
  new THREE.Vector3(1, -1, -1).normalize(),
  new THREE.Vector3(-1, 1, -1).normalize(),
  new THREE.Vector3(-1, -1, 1).normalize(),
];

// K4 Core Node identities
const K4_NODES = [
  { id: 0x01, name: 'ARCHITECT', color: '#FFD700', role: 'Creator' },
  { id: 0x02, name: 'PHOENIX', color: '#FF6B6B', role: 'Guardian' },
  { id: 0x03, name: 'BASH', color: '#4ECDC4', role: 'Explorer' },
  { id: 0x04, name: 'WILLOW', color: '#A78BFA', role: 'Healer' },
];

// ═══════════════════════════════════════════════════════════════════════════
// QUANTUM PARTICLE SYSTEM - Wave Function Collapse Visualization
// ═══════════════════════════════════════════════════════════════════════════

function QuantumParticles({ count = 2000, voltage = 5 }) {
  const mesh = useRef<THREE.Points>(null);
  const light = useRef<THREE.PointLight>(null);
  
  const [positions, velocities, phases] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const pha = new Float32Array(count);
    
    // Seeded pseudo-random using golden ratio (deterministic)
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
      return x - Math.floor(x);
    };
    
    for (let i = 0; i < count; i++) {
      // Spherical distribution with golden angle
      const theta = TAU * i / PHI;
      const phi = Math.acos(1 - 2 * (i + 0.5) / count);
      const r = 3 + seededRandom(i * PHI) * 2;
      
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      
      vel[i * 3] = (seededRandom(i * 1.1) - 0.5) * 0.02;
      vel[i * 3 + 1] = (seededRandom(i * 2.2) - 0.5) * 0.02;
      vel[i * 3 + 2] = (seededRandom(i * 3.3) - 0.5) * 0.02;
      
      pha[i] = seededRandom(i * PHI * PHI) * TAU;
    }
    
    return [pos, vel, pha];
  }, [count]);
  
  useFrame((state) => {
    if (!mesh.current) return;
    
    const time = state.clock.elapsedTime;
    const posArray = mesh.current.geometry.attributes.position.array as Float32Array;
    const energyFactor = voltage / 10;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const phase = phases[i];
      
      // Quantum oscillation with Schrödinger-like wave function
      const psi = Math.sin(time * (1 + energyFactor) + phase);
      const amplitude = 0.1 * (1 + energyFactor * 2);
      
      // Orbital motion around tetrahedron vertices
      const vertexIndex = i % 4;
      const target = TETRA_VERTICES[vertexIndex];
      
      posArray[i3] += velocities[i3] * psi * amplitude;
      posArray[i3 + 1] += velocities[i3 + 1] * psi * amplitude;
      posArray[i3 + 2] += velocities[i3 + 2] * psi * amplitude;
      
      // Attract to tetrahedron structure
      const dx = target.x * 2 - posArray[i3];
      const dy = target.y * 2 - posArray[i3 + 1];
      const dz = target.z * 2 - posArray[i3 + 2];
      
      posArray[i3] += dx * 0.001;
      posArray[i3 + 1] += dy * 0.001;
      posArray[i3 + 2] += dz * 0.001;
    }
    
    mesh.current.geometry.attributes.position.needsUpdate = true;
    mesh.current.rotation.y = time * 0.05;
    
    if (light.current) {
      light.current.intensity = 2 + Math.sin(time * 2) * energyFactor;
    }
  });
  
  return (
    <>
      <pointLight ref={light} position={[0, 0, 0]} color="#00ffff" intensity={2} distance={20} />
      <points ref={mesh}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          color="#00ffff"
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SACRED TETRAHEDRON - K4 Complete Graph Visualization
// ═══════════════════════════════════════════════════════════════════════════

function SacredTetrahedron({ activeNode = 0 }) {
  const groupRef = useRef<THREE.Group>(null);
  const edgesRef = useRef<THREE.LineSegments>(null);
  
  const edgeGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions: number[] = [];
    
    // K4 complete graph - every vertex connected to every other
    for (let i = 0; i < 4; i++) {
      for (let j = i + 1; j < 4; j++) {
        const v1 = TETRA_VERTICES[i].clone().multiplyScalar(2);
        const v2 = TETRA_VERTICES[j].clone().multiplyScalar(2);
        positions.push(v1.x, v1.y, v1.z, v2.x, v2.y, v2.z);
      }
    }
    
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, []);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    
    const time = state.clock.elapsedTime;
    groupRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
    groupRef.current.rotation.y = time * 0.2;
    groupRef.current.rotation.z = Math.cos(time * 0.2) * 0.05;
  });
  
  return (
    <group ref={groupRef}>
      {/* K4 Edges - The bonds between nodes */}
      <lineSegments ref={edgesRef} geometry={edgeGeometry}>
        <lineBasicMaterial color="#ffd700" transparent opacity={0.6} linewidth={2} />
      </lineSegments>
      
      {/* Node spheres with identity */}
      {K4_NODES.map((node, i) => (
        <Float key={node.id} speed={2} rotationIntensity={0.5} floatIntensity={0.3}>
          <group position={TETRA_VERTICES[i].clone().multiplyScalar(2).toArray()}>
            {/* Core sphere */}
            <mesh>
              <sphereGeometry args={[0.2, 32, 32]} />
              <MeshDistortMaterial
                color={node.color}
                emissive={node.color}
                emissiveIntensity={activeNode === i ? 1 : 0.3}
                distort={0.3}
                speed={2}
                roughness={0.2}
                metalness={0.8}
              />
            </mesh>
            
            {/* Glow ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.35, 0.02, 16, 32]} />
              <meshBasicMaterial 
                color={node.color} 
                transparent 
                opacity={activeNode === i ? 0.8 : 0.3}
              />
            </mesh>
            
            {/* Energy aura */}
            {activeNode === i && (
              <Sparkles 
                count={50} 
                scale={1} 
                size={3} 
                speed={0.5} 
                color={node.color}
              />
            )}
          </group>
        </Float>
      ))}
      
      {/* Central core - The nexus */}
      <mesh>
        <icosahedronGeometry args={[0.3, 2]} />
        <MeshDistortMaterial
          color="#ffffff"
          emissive="#00ffff"
          emissiveIntensity={0.5}
          distort={0.4}
          speed={3}
          roughness={0}
          metalness={1}
        />
      </mesh>
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// GOLDEN SPIRAL - Fibonacci Manifestation
// ═══════════════════════════════════════════════════════════════════════════

function GoldenSpiral({ scale = 1 }) {
  const ref = useRef<THREE.Line>(null);
  
  const geometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const turns = 6;
    const pointsPerTurn = 100;
    
    for (let i = 0; i < turns * pointsPerTurn; i++) {
      const t = i / pointsPerTurn;
      const theta = t * TAU;
      const r = Math.pow(PHI, theta / (TAU / 4)) * 0.1 * scale;
      
      points.push(new THREE.Vector3(
        r * Math.cos(theta),
        t * 0.1 - 0.3,
        r * Math.sin(theta)
      ));
    }
    
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [scale]);
  
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.5;
  });
  
  return (
    <line ref={ref} geometry={geometry}>
      <lineBasicMaterial color="#ffd700" transparent opacity={0.4} />
    </line>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ENERGY FIELD - Voltage Visualization
// ═══════════════════════════════════════════════════════════════════════════

function EnergyField({ voltage = 5, spoons = 10 }) {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!ref.current) return;
    
    const time = state.clock.elapsedTime;
    const material = ref.current.material as THREE.ShaderMaterial;
    
    if (material.uniforms) {
      material.uniforms.uTime.value = time;
      material.uniforms.uVoltage.value = voltage / 10;
      material.uniforms.uSpoons.value = spoons / 20;
    }
  });
  
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uVoltage: { value: 0.5 },
        uSpoons: { value: 0.5 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uVoltage;
        uniform float uSpoons;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        // Golden ratio
        const float PHI = 1.618033988749895;
        
        // Fractal noise
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }
        
        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          
          return mix(
            mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
            mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
            f.y
          );
        }
        
        float fbm(vec2 p) {
          float value = 0.0;
          float amplitude = 0.5;
          
          for (int i = 0; i < 5; i++) {
            value += amplitude * noise(p);
            p *= PHI;
            amplitude *= 0.5;
          }
          
          return value;
        }
        
        void main() {
          vec2 uv = vUv - 0.5;
          float dist = length(uv);
          
          // Sacred geometry pattern
          float angle = atan(uv.y, uv.x);
          float spiral = sin(angle * 6.0 + dist * 20.0 - uTime * 2.0);
          
          // Energy waves based on voltage
          float energy = fbm(uv * 10.0 + uTime * 0.5) * uVoltage;
          
          // Spoon rings
          float rings = sin(dist * 40.0 - uTime) * uSpoons;
          
          // Color mixing
          vec3 goldColor = vec3(1.0, 0.84, 0.0);
          vec3 cyanColor = vec3(0.0, 1.0, 1.0);
          vec3 violetColor = vec3(0.6, 0.3, 0.9);
          
          vec3 color = mix(goldColor, cyanColor, energy);
          color = mix(color, violetColor, spiral * 0.3);
          
          // Radial fade
          float alpha = smoothstep(0.5, 0.2, dist) * 0.3;
          alpha *= (0.5 + energy * 0.5 + rings * 0.1);
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
  }, []);
  
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} material={shaderMaterial}>
      <planeGeometry args={[12, 12, 64, 64]} />
    </mesh>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MESH NETWORK VISUALIZATION - LoRa Topology
// ═══════════════════════════════════════════════════════════════════════════

function MeshNetwork({ nodeCount = 12, connected = false }) {
  const groupRef = useRef<THREE.Group>(null);
  const [pulseNodes, setPulseNodes] = useState<number[]>([]);
  
  const nodes = useMemo(() => {
    const positions: THREE.Vector3[] = [];
    
    // Generate nodes in tetrahedron-of-tetrahedrons pattern (fractal K4)
    for (let i = 0; i < nodeCount; i++) {
      const tetraIndex = Math.floor(i / 4);
      const vertexIndex = i % 4;
      
      // Offset each tetrahedron group
      const groupOffset = new THREE.Vector3(
        (tetraIndex % 3 - 1) * 4,
        Math.floor(tetraIndex / 3) * 3,
        Math.sin(tetraIndex) * 2
      );
      
      const pos = TETRA_VERTICES[vertexIndex].clone()
        .multiplyScalar(1.5)
        .add(groupOffset);
      
      positions.push(pos);
    }
    
    return positions;
  }, [nodeCount]);
  
  // Simulate network pulses
  useEffect(() => {
    if (!connected) return;
    
    const interval = setInterval(() => {
      const randomNode = Math.floor(Math.random() * nodeCount);
      setPulseNodes(prev => [...prev.slice(-5), randomNode]);
    }, 500);
    
    return () => clearInterval(interval);
  }, [connected, nodeCount]);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
  });
  
  return (
    <group ref={groupRef} position={[0, 0, -5]}>
      {nodes.map((pos, i) => (
        <group key={i} position={pos.toArray()}>
          <Trail
            width={0.5}
            length={5}
            color={K4_NODES[i % 4].color}
            attenuation={(t) => t * t}
          >
            <mesh>
              <octahedronGeometry args={[0.1, 0]} />
              <meshBasicMaterial 
                color={K4_NODES[i % 4].color}
                transparent
                opacity={pulseNodes.includes(i) ? 1 : 0.5}
              />
            </mesh>
          </Trail>
          
          {pulseNodes.includes(i) && (
            <Sparkles count={20} scale={0.5} size={2} speed={1} color={K4_NODES[i % 4].color} />
          )}
        </group>
      ))}
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// HUD OVERLAY - Sacred Metrics Display
// ═══════════════════════════════════════════════════════════════════════════

function HUD({ voltage, spoons, meshConnected }: { voltage: number; spoons: number; meshConnected: boolean }) {
  return (
    <div className="absolute inset-0 pointer-events-none font-mono text-xs">
      {/* Top Left - System Status */}
      <div className="absolute top-4 left-4 space-y-1">
        <div className="text-cyan-400 opacity-70">╔═══ QUANTUM CORE v1.0 ═══╗</div>
        <div className="text-cyan-300 opacity-60">║ MATH IS KING            ║</div>
        <div className="text-cyan-300 opacity-60">║ THE GEOMETRY RULES      ║</div>
        <div className="text-cyan-400 opacity-70">╚═════════════════════════╝</div>
      </div>
      
      {/* Top Right - Telemetry */}
      <div className="absolute top-4 right-4 text-right space-y-1">
        <div className="text-amber-400">
          ⚡ VOLTAGE: {voltage}/10
          <div className="h-1 w-24 bg-zinc-800 ml-auto mt-1">
            <div 
              className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-400"
              style={{ width: `${voltage * 10}%` }}
            />
          </div>
        </div>
        <div className="text-cyan-400 mt-2">
          🥄 SPOONS: {spoons}/20
          <div className="h-1 w-24 bg-zinc-800 ml-auto mt-1">
            <div 
              className="h-full bg-gradient-to-r from-red-400 via-yellow-400 to-cyan-400"
              style={{ width: `${spoons * 5}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Bottom Left - K4 Topology */}
      <div className="absolute bottom-4 left-4 space-y-1">
        <div className="text-violet-400 opacity-80">K₄ TETRAHEDRON TOPOLOGY</div>
        <div className="grid grid-cols-2 gap-x-4 text-[10px]">
          {K4_NODES.map((node) => (
            <div key={node.id} className="flex items-center gap-1">
              <span 
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: node.color }}
              />
              <span style={{ color: node.color }}>{node.name}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Bottom Right - Connection Status */}
      <div className="absolute bottom-4 right-4 text-right">
        <div className={`flex items-center gap-2 ${meshConnected ? 'text-green-400' : 'text-zinc-500'}`}>
          <span className={`w-2 h-2 rounded-full ${meshConnected ? 'bg-green-400 animate-pulse' : 'bg-zinc-600'}`} />
          MESH: {meshConnected ? 'CONNECTED' : 'OFFLINE'}
        </div>
        <div className="text-amber-400/60 text-[10px] mt-1">
          φ = {PHI.toFixed(10)}
        </div>
      </div>
      
      {/* Center - Sacred Constants */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center opacity-20">
        <div className="text-6xl text-amber-400">⬡</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ACCELEROMETER-DRIVEN CAMERA - Device orientation controls the view
// ═══════════════════════════════════════════════════════════════════════════

function AccelerometerCamera({ accelX = 0, accelY = 0 }: { accelX?: number; accelY?: number; accelZ?: number }) {
  const { camera } = useThree();
  const targetRef = useRef({ x: 0, y: 2 });
  
  useFrame(() => {
    // Normalize accelerometer values (typically -8192 to 8192)
    const nx = accelX / 8192;
    const ny = accelY / 8192;
    
    // Smoothly interpolate camera position based on device tilt
    targetRef.current.x = nx * 4;
    targetRef.current.y = 2 + ny * 2;
    
    // Lerp camera position (useFrame is the correct place for this in R3F)
    camera.position.lerp(
      new THREE.Vector3(targetRef.current.x, targetRef.current.y, 8), 
      0.05
    );
    camera.lookAt(0, 0, 0);
  });
  
  return null;
}

// ═══════════════════════════════════════════════════════════════════════════
// TOUCH ENERGY PULSE - Explodes when device is touched
// ═══════════════════════════════════════════════════════════════════════════

function TouchPulse({ touchActive = false, touchX = 0, touchY = 0 }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const pulseScaleRef = useRef(0);
  const lastTouch = useRef(false);
  
  useFrame(() => {
    if (!meshRef.current) return;
    
    // Detect new touch and trigger pulse
    if (touchActive && !lastTouch.current) {
      pulseScaleRef.current = 1;
    }
    lastTouch.current = touchActive;
    
    // Decay pulse
    if (pulseScaleRef.current > 0.01) {
      pulseScaleRef.current *= 0.95;
      meshRef.current.scale.setScalar(pulseScaleRef.current * 3);
      (meshRef.current.material as THREE.MeshBasicMaterial).opacity = pulseScaleRef.current * 0.5;
    } else {
      meshRef.current.scale.setScalar(0);
    }
  });
  
  // Convert touch coords (0-480, 0-320) to 3D space
  const posX = ((touchX / 480) - 0.5) * 4;
  const posY = ((1 - touchY / 320) - 0.5) * 3;
  
  return (
    <mesh ref={meshRef} position={[posX, posY, 0]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial 
        color="#00ffff" 
        transparent 
        opacity={0}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// BATTERY ENERGY FIELD - Battery level drives field intensity
// ═══════════════════════════════════════════════════════════════════════════

function BatteryAura({ batteryPercent = 100 }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.elapsedTime;
    const intensity = batteryPercent / 100;
    
    // Pulse based on battery
    meshRef.current.scale.setScalar(3 + Math.sin(time * 2) * 0.2 * intensity);
    (meshRef.current.material as THREE.ShaderMaterial).uniforms.uIntensity.value = intensity;
  });
  
  const auraShader = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
      uIntensity: { value: 1 },
    },
    vertexShader: `
      varying vec3 vPosition;
      void main() {
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uIntensity;
      varying vec3 vPosition;
      
      void main() {
        float dist = length(vPosition);
        float alpha = (1.0 - dist / 3.0) * 0.1 * uIntensity;
        vec3 color = mix(vec3(1.0, 0.0, 0.0), vec3(0.0, 1.0, 0.5), uIntensity);
        gl_FragColor = vec4(color, alpha);
      }
    `,
  }), []);
  
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[3, 32, 32]} />
      <shaderMaterial 
        {...auraShader}
        transparent
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// WIFI SIGNAL RINGS - Network strength visualization
// ═══════════════════════════════════════════════════════════════════════════

function WifiRings({ wifiConnected = false, rssi = -70 }) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Convert RSSI to 0-1 strength (-30 best, -90 worst)
  const strength = Math.max(0, Math.min(1, (rssi + 90) / 60));
  const ringCount = Math.ceil(strength * 3);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
  });
  
  if (!wifiConnected) return null;
  
  return (
    <group ref={groupRef} position={[0, 4, 0]}>
      {[...Array(ringCount)].map((_, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]} position={[0, -i * 0.3, 0]}>
          <torusGeometry args={[0.5 + i * 0.3, 0.02, 16, 32]} />
          <meshBasicMaterial 
            color="#00ff88" 
            transparent 
            opacity={0.5 - i * 0.1}
          />
        </mesh>
      ))}
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT - The Digital Cathedral (Hardware-Synchronized)
// ═══════════════════════════════════════════════════════════════════════════

export default function QuantumCore() {
  const { deviceState, isConnected, connect } = usePhenixStore();
  const [activeNode, setActiveNode] = useState(0);
  const [useDeviceCamera, setUseDeviceCamera] = useState(true);
  
  // Cycle through active nodes
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNode(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  
  // Extract device metrics with defaults
  const voltage = deviceState?.voltage ?? 5;
  const spoons = deviceState?.spoons ?? 10;
  const battery = deviceState?.battery ?? 100;
  const accelX = deviceState?.accelerometer?.x ?? 0;
  const accelY = deviceState?.accelerometer?.y ?? 0;
  const accelZ = deviceState?.accelerometer?.z ?? -8192;
  const touchActive = deviceState?.touch?.active ?? false;
  const touchX = deviceState?.touch?.x ?? 0;
  const touchY = deviceState?.touch?.y ?? 0;
  const wifiConnected = deviceState?.wifi?.connected ?? false;
  const rssi = deviceState?.wifi?.rssi ?? -70;
  
  return (
    <div className="relative w-full h-[600px] bg-black rounded-xl overflow-hidden border border-zinc-800">
      {/* Connection prompt */}
      {!isConnected && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
          <button
            onClick={connect}
            className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 rounded-lg text-cyan-400 hover:bg-cyan-500/30 transition-all flex items-center gap-2"
          >
            <span className="animate-pulse">◉</span>
            Connect Phenix Navigator
          </button>
        </div>
      )}
      
      <Canvas
        camera={{ position: [0, 2, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        {/* Ambient lighting */}
        <ambientLight intensity={0.1} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        
        {/* Starfield background */}
        <Stars 
          radius={50} 
          depth={50} 
          count={3000} 
          factor={4} 
          saturation={0} 
          fade 
          speed={0.5}
        />
        
        {/* HARDWARE-DRIVEN ELEMENTS */}
        
        {/* Accelerometer-driven camera (when connected) */}
        {isConnected && useDeviceCamera && (
          <AccelerometerCamera accelX={accelX} accelY={accelY} accelZ={accelZ} />
        )}
        
        {/* Touch pulse effect */}
        <TouchPulse touchActive={touchActive} touchX={touchX} touchY={touchY} />
        
        {/* Battery energy aura */}
        <BatteryAura batteryPercent={battery} />
        
        {/* WiFi signal rings */}
        <WifiRings wifiConnected={wifiConnected} rssi={rssi} />
        
        {/* CORE VISUALIZATION */}
        
        {/* Quantum particle field - intensity from voltage */}
        <QuantumParticles count={1500} voltage={voltage} />
        
        {/* Sacred tetrahedron */}
        <SacredTetrahedron activeNode={activeNode} />
        
        {/* Golden spiral */}
        <GoldenSpiral scale={1.5} />
        
        {/* Energy field floor - responds to spoons */}
        <EnergyField voltage={voltage} spoons={spoons} />
        
        {/* Mesh network visualization */}
        <MeshNetwork nodeCount={12} connected={isConnected} />
        
        {/* Camera controls (disabled when using device orientation) */}
        <OrbitControls 
          enabled={!isConnected || !useDeviceCamera}
          enableZoom={true}
          enablePan={false}
          minDistance={4}
          maxDistance={20}
          autoRotate={!isConnected}
          autoRotateSpeed={0.3}
        />
      </Canvas>
      
      {/* Enhanced HUD Overlay */}
      <HUD 
        voltage={voltage} 
        spoons={spoons} 
        meshConnected={isConnected}
      />
      
      {/* Hardware Status Panel */}
      {isConnected && (
        <div className="absolute bottom-4 left-4 bg-black/80 rounded-lg p-3 border border-cyan-500/30 font-mono text-xs">
          <div className="text-cyan-400 font-bold mb-2">⚡ PHENIX LINK</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-zinc-400">
            <span>Battery:</span>
            <span className={battery > 20 ? 'text-green-400' : 'text-red-400'}>{battery}%</span>
            <span>Accel X:</span>
            <span className="text-amber-400">{accelX}</span>
            <span>Accel Y:</span>
            <span className="text-amber-400">{accelY}</span>
            <span>Accel Z:</span>
            <span className="text-amber-400">{accelZ}</span>
            <span>Touch:</span>
            <span className={touchActive ? 'text-pink-400' : 'text-zinc-600'}>
              {touchActive ? `${touchX},${touchY}` : 'idle'}
            </span>
            <span>WiFi:</span>
            <span className={wifiConnected ? 'text-green-400' : 'text-zinc-600'}>
              {wifiConnected ? `${rssi}dBm` : 'off'}
            </span>
          </div>
          <button
            onClick={() => setUseDeviceCamera(!useDeviceCamera)}
            className={`mt-2 w-full py-1 rounded text-xs ${
              useDeviceCamera 
                ? 'bg-cyan-500/30 text-cyan-400' 
                : 'bg-zinc-700/50 text-zinc-500'
            }`}
          >
            {useDeviceCamera ? '🎮 Device Camera ON' : '🖱️ Mouse Camera'}
          </button>
        </div>
      )}
      
      {/* Scan lines effect */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.03) 2px, rgba(0,255,255,0.03) 4px)'
        }}
      />
    </div>
  );
}
