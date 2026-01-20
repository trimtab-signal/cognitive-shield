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

import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Line } from '@react-three/drei';
import * as THREE from 'three';
import { firstLight } from '../../../src/lib/first-light';
import type { PhenixTelemetry, ConnectionState } from '../../../src/lib/first-light';

/**
 * PHENIX TELEMETRY DISPLAY
 * 
 * Real-time 3D visualization of the Hardware Root of Trust.
 * Displays the four tetrahedral vertices:
 * 1. Power (Voltage) - Blue pulsing sphere
 * 2. Signal (RSSI) - Red signal strength bars
 * 3. Orientation (Heading) - Green arrow pointing direction
 * 4. Identity (DeviceId) - Purple floating text
 * 
 * GEOMETRY: The tetrahedron as minimum structural system.
 * RATIO: √3 = 1.732 governs spacing and scaling.
 */

// ============================================================================
// TETRAHEDRAL VERTEX COMPONENTS
// ============================================================================

/**
 * PowerVertex - The Blue Pulsing Sphere
 * Represents battery voltage (3.0V - 4.2V LiPo range)
 */
function PowerVertex({ voltage }: { voltage: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Normalize voltage to 0-1 range
  const normalized = (voltage - 3.0) / (4.2 - 3.0);
  
  // Pulse animation based on voltage
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const pulse = Math.sin(clock.elapsedTime * 2) * 0.1 + 1;
      meshRef.current.scale.setScalar(normalized * pulse);
    }
  });
  
  return (
    <mesh ref={meshRef} position={[0, Math.sqrt(2/3) * 2, 0]}>
      <sphereGeometry args={[0.3, 32, 32]} />
      <meshStandardMaterial 
        color="#00BFFF" 
        emissive="#00BFFF"
        emissiveIntensity={normalized}
        metalness={0.8}
        roughness={0.2}
      />
      <Text
        position={[0, 0.5, 0]}
        fontSize={0.15}
        color="#00BFFF"
        anchorX="center"
        anchorY="middle"
      >
        {voltage.toFixed(2)}V
      </Text>
    </mesh>
  );
}

/**
 * SignalVertex - The Red Signal Bars
 * Represents LoRa RSSI (-150 to 0 dBm)
 */
function SignalVertex({ rssi }: { rssi: number }) {
  // Normalize RSSI to 0-1 range (better signal = higher number)
  const normalized = (rssi + 150) / 150;
  const barCount = Math.ceil(normalized * 5);
  
  // Calculate position (tetrahedron vertex)
  const x = -Math.sqrt(3) / 3 * 2;
  const y = -Math.sqrt(1/3) * 2;
  const z = 0;
  
  return (
    <group position={[x, y, z]}>
      {Array.from({ length: 5 }).map((_, i) => {
        const active = i < barCount;
        return (
          <mesh 
            key={i} 
            position={[i * 0.15 - 0.3, i * 0.1, 0]}
          >
            <boxGeometry args={[0.1, 0.1 + i * 0.1, 0.1]} />
            <meshStandardMaterial 
              color={active ? "#FF4444" : "#330000"}
              emissive={active ? "#FF4444" : "#000000"}
              emissiveIntensity={active ? 0.5 : 0}
            />
          </mesh>
        );
      })}
      <Text
        position={[0, -0.5, 0]}
        fontSize={0.12}
        color="#FF4444"
        anchorX="center"
        anchorY="middle"
      >
        {rssi.toFixed(0)}dBm
      </Text>
    </group>
  );
}

/**
 * OrientationVertex - The Green Compass Arrow
 * Represents heading (0-360 degrees)
 */
function OrientationVertex({ heading }: { heading: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Smoothly rotate to heading
  useFrame(() => {
    if (groupRef.current) {
      const targetRotation = (heading * Math.PI) / 180;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotation,
        0.05
      );
    }
  });
  
  // Calculate position (tetrahedron vertex)
  const x = Math.sqrt(3) / 3 * 2;
  const y = -Math.sqrt(1/3) * 2;
  const z = 0;
  
  return (
    <group ref={groupRef} position={[x, y, z]}>
      {/* Arrow shaft */}
      <mesh position={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.05, 0.05, 0.6, 8]} />
        <meshStandardMaterial color="#00FF00" />
      </mesh>
      {/* Arrow head */}
      <mesh position={[0, 0, 0.7]} rotation={[0, 0, 0]}>
        <coneGeometry args={[0.15, 0.3, 8]} />
        <meshStandardMaterial color="#00FF00" emissive="#00FF00" emissiveIntensity={0.3} />
      </mesh>
      <Text
        position={[0, -0.5, 0]}
        fontSize={0.12}
        color="#00FF00"
        anchorX="center"
        anchorY="middle"
      >
        {heading.toFixed(0)}°
      </Text>
    </group>
  );
}

/**
 * IdentityVertex - The Purple Floating Text
 * Represents DeviceId (truncated UUID)
 */
function IdentityVertex({ deviceId }: { deviceId: string }) {
  // Calculate position (tetrahedron center bottom)
  const y = -Math.sqrt(1/3) * 2;
  
  // Truncate UUID for display
  const shortId = deviceId.split('-')[0];
  
  return (
    <group position={[0, y - 0.8, 0]}>
      <Text
        fontSize={0.15}
        color="#BB44FF"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#000000"
      >
        ID: {shortId}
      </Text>
    </group>
  );
}

/**
 * TetrahedralFrame - The Wireframe Structure
 * Shows the geometric skeleton connecting all vertices
 */
function TetrahedralFrame() {
  // Tetrahedron vertex positions
  const top = new THREE.Vector3(0, Math.sqrt(2/3) * 2, 0);
  const left = new THREE.Vector3(-Math.sqrt(3) / 3 * 2, -Math.sqrt(1/3) * 2, 0);
  const right = new THREE.Vector3(Math.sqrt(3) / 3 * 2, -Math.sqrt(1/3) * 2, 0);
  const center = new THREE.Vector3(0, -Math.sqrt(1/3) * 2, 0);
  
  const edges = [
    [top, left],
    [top, right],
    [top, center],
    [left, right],
    [left, center],
    [right, center],
  ];
  
  return (
    <>
      {edges.map((edge, i) => (
        <Line
          key={i}
          points={edge}
          color="#444444"
          lineWidth={1}
          dashed={false}
        />
      ))}
    </>
  );
}

// Generate star positions once (outside component to avoid impure function warnings)
const generateStarfield = () => {
  const pos = new Float32Array(1000 * 3);
  for (let i = 0; i < 1000; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 50;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 50;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 50;
  }
  return pos;
};

const STAR_POSITIONS = generateStarfield();

/**
 * Starfield Background
 * Provides depth perception and "space" aesthetic
 */
function Starfield() {
  const stars = useRef<THREE.Points>(null);
  
  // Gentle rotation
  useFrame(({ clock }) => {
    if (stars.current) {
      stars.current.rotation.y = clock.elapsedTime * 0.02;
    }
  });
  
  return (
    <points ref={stars}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={1000}
          array={STAR_POSITIONS}
          itemSize={3}
          args={[STAR_POSITIONS, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#ffffff" transparent opacity={0.6} />
    </points>
  );
}

/**
 * Scene - The Complete 3D Visualization
 */
function Scene({ telemetry }: { telemetry: PhenixTelemetry | null }) {
  if (!telemetry) {
    return (
      <Text
        position={[0, 0, 0]}
        fontSize={0.3}
        color="#666666"
        anchorX="center"
        anchorY="middle"
      >
        Awaiting First Light...
      </Text>
    );
  }
  
  return (
    <>
      <Starfield />
      <TetrahedralFrame />
      <PowerVertex voltage={telemetry.voltage} />
      <SignalVertex rssi={telemetry.rssi} />
      <OrientationVertex heading={telemetry.heading} />
      <IdentityVertex deviceId={telemetry.deviceId} />
      
      {/* Ambient lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#4444FF" />
    </>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function PhenixTelemetryDisplay() {
  const [telemetry, setTelemetry] = useState<PhenixTelemetry | null>(null);
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [error, setError] = useState<string | null>(null);
  
  const handleConnect = async () => {
    setError(null);
    
    const result = await firstLight({
      timeout: 5000,
      baudRate: 115200,
      onTelemetry: (data: PhenixTelemetry) => {
        setTelemetry(data);
      },
      onStateChange: (state: ConnectionState) => {
        setConnectionState(state);
      },
    });
    
    if (result.success) {
      setTelemetry(result.telemetry);
    } else {
      setError(result.error.message);
    }
  };
  
  const stateColors: Record<ConnectionState, string> = {
    disconnected: '#666666',
    requesting: '#FFAA00',
    connecting: '#FFAA00',
    authenticating: '#00AAFF',
    connected: '#00FF00',
  };
  
  const stateLabels: Record<ConnectionState, string> = {
    disconnected: 'Disconnected',
    requesting: 'Requesting Permission...',
    connecting: 'Opening Connection...',
    authenticating: 'Verifying SE050 Signature...',
    connected: 'Connected - First Light Achieved! 🌅',
  };
  
  return (
    <div style={{ 
      width: '100%', 
      height: '100vh', 
      background: 'linear-gradient(to bottom, #000000, #0a0a1a)',
      position: 'relative'
    }}>
      {/* Connection Status Bar */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        zIndex: 10,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 20px',
        background: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 10,
        border: `2px solid ${stateColors[connectionState]}`,
      }}>
        <div style={{ color: stateColors[connectionState], fontWeight: 'bold' }}>
          {stateLabels[connectionState]}
        </div>
        
        {connectionState === 'disconnected' && (
          <button
            onClick={handleConnect}
            style={{
              padding: '10px 20px',
              background: '#00BFFF',
              color: 'white',
              border: 'none',
              borderRadius: 5,
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Initiate First Light
          </button>
        )}
        
        {connectionState === 'connected' && telemetry && (
          <div style={{ color: '#00FF00', fontSize: 14 }}>
            Temp: {telemetry.temperature.toFixed(1)}°C
          </div>
        )}
      </div>
      
      {/* Error Display */}
      {error && (
        <div style={{
          position: 'absolute',
          top: 100,
          left: 20,
          right: 20,
          zIndex: 10,
          padding: 15,
          background: 'rgba(255, 0, 0, 0.2)',
          border: '2px solid #FF4444',
          borderRadius: 10,
          color: '#FF4444',
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
      >
        <Scene telemetry={telemetry} />
        <OrbitControls 
          enablePan={false}
          minDistance={5}
          maxDistance={15}
        />
      </Canvas>
      
      {/* Legend */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        right: 20,
        zIndex: 10,
        padding: 15,
        background: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 10,
        color: 'white',
        fontSize: 12,
      }}>
        <div style={{ marginBottom: 5 }}>
          <span style={{ color: '#00BFFF' }}>●</span> Power (Voltage)
        </div>
        <div style={{ marginBottom: 5 }}>
          <span style={{ color: '#FF4444' }}>●</span> Signal (RSSI)
        </div>
        <div style={{ marginBottom: 5 }}>
          <span style={{ color: '#00FF00' }}>●</span> Orientation (Heading)
        </div>
        <div>
          <span style={{ color: '#BB44FF' }}>●</span> Identity (DeviceId)
        </div>
      </div>
    </div>
  );
}
