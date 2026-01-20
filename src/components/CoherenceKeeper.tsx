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

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Text, Stars, OrbitControls } from '@react-three/drei';
import { Physics, RigidBody, RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { usePhenixStore } from '../store/phenix.store';

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const TARGET_FREQUENCY = 0.35; // Harmonic Resonance Attractor (~pi/9)
const FREQUENCY_TOLERANCE = 0.05;
const ENTROPY_RATE = 0.001;
const COHERENCE_DECAY = 0.05;
const COHERENCE_GROWTH = 0.1;

// ═══════════════════════════════════════════════════════════════════════════
// POSNER MOLECULE (The Qubit)
// ═══════════════════════════════════════════════════════════════════════════

function PosnerMolecule({ frequency, coherence }: { frequency: number; coherence: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Spin based on Larmor Frequency
      groupRef.current.rotation.y += frequency * delta * 10;
      groupRef.current.rotation.x += frequency * delta * 5;
      
      // Jitter based on low coherence (Decoherence)
      if (coherence < 50) {
        const jitter = (100 - coherence) * 0.001;
        groupRef.current.position.x = (Math.random() - 0.5) * jitter;
        groupRef.current.position.y = (Math.random() - 0.5) * jitter;
      } else {
        groupRef.current.position.set(0, 0, 0);
      }
    }
  });

  // Color shift: Red (Chaos) -> Blue (Order) -> White (Gamma Burst)
  const color = new THREE.Color();
  if (coherence > 90) {
    color.setHSL(0.6, 1, 1); // Blue/White
    color.lerp(new THREE.Color('white'), (coherence - 90) / 10);
  } else {
    color.setHSL(coherence / 100 * 0.6, 1, 0.5); // Red to Blue
  }

  return (
    <group ref={groupRef}>
      {/* Central Calcium Cluster */}
      <Sphere args={[1, 32, 32]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={coherence / 50} />
      </Sphere>
      
      {/* Orbiting Phosphate Ions */}
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const r = 2;
        return (
          <Sphere key={i} args={[0.4, 16, 16]} position={[Math.cos(angle) * r, Math.sin(angle) * r, 0]}>
            <meshStandardMaterial color="white" />
          </Sphere>
        );
      })}
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// GAME LOGIC
// ═══════════════════════════════════════════════════════════════════════════

export default function CoherenceKeeper() {
  const { deviceState, triggerHaptic } = usePhenixStore();
  const [frequency, setFrequency] = useState(0.1);
  const [coherence, setCoherence] = useState(0);
  const [gammaBurst, setGammaBurst] = useState(false);
  
  // Game Loop
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Apply Entropy (Drift)
      setFrequency(f => {
        const drift = (Math.random() - 0.5) * ENTROPY_RATE * 10;
        return Math.max(0, Math.min(1, f + drift));
      });

      // 2. Apply User Input (Knob)
      if (deviceState?.encoderDelta) {
        setFrequency(f => {
          const change = deviceState.encoderDelta! * 0.01;
          return Math.max(0, Math.min(1, f + change));
        });
      }

      // 3. Calculate Coherence
      const diff = Math.abs(frequency - TARGET_FREQUENCY);
      if (diff < FREQUENCY_TOLERANCE) {
        setCoherence(c => Math.min(100, c + COHERENCE_GROWTH));
        // Haptic feedback for "in the zone"
        if (Math.random() < 0.1) triggerHaptic('detent');
      } else {
        setCoherence(c => Math.max(0, c - COHERENCE_DECAY));
      }

      // 4. Check Win State (Gamma Burst)
      if (coherence >= 100 && !gammaBurst) {
        setGammaBurst(true);
        triggerHaptic('success');
        setTimeout(() => {
            setGammaBurst(false);
            setCoherence(50); // Reset to mid-point
        }, 2000);
      }

    }, 16); // ~60fps logic loop

    return () => clearInterval(interval);
  }, [frequency, coherence, deviceState?.encoderDelta, gammaBurst, triggerHaptic]);

  return (
    <div style={{ width: '100%', height: '600px', background: 'black', position: 'relative', borderRadius: '16px', overflow: 'hidden' }}>
      {/* HUD */}
      <div style={{ position: 'absolute', top: 20, left: 20, color: 'cyan', fontFamily: 'monospace', zIndex: 10 }}>
        <h3 style={{ margin: 0 }}>COHERENCE KEEPER</h3>
        <p style={{ margin: '4px 0' }}>NODE: {deviceState?.callsign || 'DISCONNECTED'}</p>
        <p style={{ margin: '4px 0' }}>FREQ: {frequency.toFixed(3)} Hz (TARGET: {TARGET_FREQUENCY})</p>
        <p style={{ margin: '4px 0' }}>COHERENCE: {coherence.toFixed(1)}%</p>
        <div style={{ width: '200px', height: '20px', border: '1px solid cyan', marginTop: '10px' }}>
          <div style={{ width: `${coherence}%`, height: '100%', background: coherence > 90 ? 'white' : 'cyan' }} />
        </div>
      </div>

      {/* Gamma Burst Flash */}
      {gammaBurst && (
        <div style={{
          position: 'absolute', inset: 0, background: 'white', zIndex: 20,
          animation: 'flash 2s ease-out forwards', pointerEvents: 'none'
        }} />
      )}

      <Canvas camera={{ position: [0, 0, 10] }}>
        <color attach="background" args={['#050505']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <Physics gravity={[0, 0, 0]}>
          <PosnerMolecule frequency={frequency} coherence={coherence} />
        </Physics>
        
        <OrbitControls enableZoom={false} />
      </Canvas>
      
      <style>{`
        @keyframes flash {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
