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

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import * as THREE from 'three';

/**
 * POSNER MOLECULE SIMULATION
 * 
 * Implements the Fisher-Escola Q Distribution for quantum consciousness
 * visualization. Based on Ca₉(PO₄)₆ Posner molecules that protect
 * nuclear spins (qubits) from decoherence.
 * 
 * Game Objective: Maintain "Quantum Coherence"
 * - User adjusts "Trimtab" to keep system aligned with Mark 1 Attractor (H ≈ 0.35)
 * - Entropy visualization via color/geometry changes
 * - Gamified meditation and focus tracking
 */

interface PosnerProps {
  coherence: number; // 0-1, where 1 is perfect coherence
}

const PosnerCore: React.FC<PosnerProps> = ({ coherence }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hue, setHue] = useState(210); // Start with blue

  useFrame((state) => {
    if (!meshRef.current) return;

    // Pulse based on coherence
    const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1 * coherence;
    meshRef.current.scale.set(scale, scale, scale);

    // Rotate based on coherence
    meshRef.current.rotation.y += 0.01 * coherence;

    // Color shift: Blue (high coherence) → Red (low coherence)
    const targetHue = 210 - (1 - coherence) * 210; // 210 (blue) to 0 (red)
    setHue((prev) => prev + (targetHue - prev) * 0.1);
  });

  // Geometry complexity based on coherence
  const segments = Math.max(8, Math.floor(32 * coherence));

  return (
    <Sphere ref={meshRef} args={[1, segments, segments]}>
      <meshStandardMaterial
        color={`hsl(${hue}, 70%, 50%)`}
        emissive={`hsl(${hue}, 70%, 30%)`}
        emissiveIntensity={0.5}
        roughness={0.3}
        metalness={0.7}
        wireframe={coherence < 0.3}
      />
    </Sphere>
  );
};

export const PosnerMolecule: React.FC = () => {
  const [coherence, setCoherence] = useState(0.7);
  const [entropy, setEntropy] = useState(0.3);

  // Simulate "Trimtab" adjustment
  const adjustCoherence = (delta: number) => {
    setCoherence((prev) => Math.max(0, Math.min(1, prev + delta)));
    setEntropy((prev) => Math.max(0, Math.min(1, prev - delta)));
  };

  // Mark 1 Attractor constant (H ≈ 0.35 from research)
  const mark1Target = 0.35;
  const deviation = Math.abs(entropy - mark1Target);
  const isAligned = deviation < 0.1;

  return (
    <div style={{
      background: '#1F2937',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid #374151',
      height: '600px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      {/* Header */}
      <div>
        <h2 style={{
          fontSize: '20px',
          fontWeight: 600,
          color: '#F3F4F6',
          margin: '0 0 8px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          ⚛️ Posner Molecule Simulation
        </h2>
        <p style={{ fontSize: '13px', color: '#9CA3AF', margin: 0 }}>
          Fisher-Escola Q Distribution • Quantum Coherence Visualization
        </p>
      </div>

      {/* 3D Canvas */}
      <div style={{
        flex: 1,
        background: '#111827',
        borderRadius: '12px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <Canvas
          camera={{ position: [0, 0, 4], fov: 50 }}
          style={{ width: '100%', height: '100%' }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <spotLight position={[-10, -10, -10]} angle={0.3} penumbra={1} intensity={0.5} />
          
          <PosnerCore coherence={coherence} />
          
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>

        {/* Status overlay */}
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: isAligned ? '#10B98120' : '#EF444420',
          backdropFilter: 'blur(8px)',
          padding: '8px 12px',
          borderRadius: '8px',
          border: `1px solid ${isAligned ? '#10B981' : '#EF4444'}`,
          color: isAligned ? '#10B981' : '#EF4444',
          fontSize: '12px',
          fontWeight: 600
        }}>
          {isAligned ? '✓ COHERENT' : '⚠ DECOHERENT'}
        </div>
      </div>

      {/* Controls */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px'
      }}>
        {/* Coherence Meter */}
        <div style={{
          background: '#111827',
          padding: '12px',
          borderRadius: '8px'
        }}>
          <div style={{
            fontSize: '12px',
            color: '#9CA3AF',
            marginBottom: '6px'
          }}>
            Quantum Coherence
          </div>
          <div style={{
            height: '8px',
            background: '#374151',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${coherence * 100}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #3B82F6, #10B981)',
              transition: 'width 0.3s ease'
            }} />
          </div>
          <div style={{
            fontSize: '16px',
            color: '#F3F4F6',
            fontWeight: 600,
            marginTop: '6px'
          }}>
            {(coherence * 100).toFixed(1)}%
          </div>
        </div>

        {/* Entropy Meter */}
        <div style={{
          background: '#111827',
          padding: '12px',
          borderRadius: '8px'
        }}>
          <div style={{
            fontSize: '12px',
            color: '#9CA3AF',
            marginBottom: '6px'
          }}>
            Entropy (H)
          </div>
          <div style={{
            height: '8px',
            background: '#374151',
            borderRadius: '4px',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <div style={{
              width: `${entropy * 100}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #F59E0B, #EF4444)',
              transition: 'width 0.3s ease'
            }} />
            {/* Mark 1 Attractor indicator */}
            <div style={{
              position: 'absolute',
              left: `${mark1Target * 100}%`,
              top: '-2px',
              width: '2px',
              height: 'calc(100% + 4px)',
              background: '#10B981',
              boxShadow: '0 0 8px #10B981'
            }} />
          </div>
          <div style={{
            fontSize: '16px',
            color: '#F3F4F6',
            fontWeight: 600,
            marginTop: '6px'
          }}>
            H = {entropy.toFixed(3)}
          </div>
        </div>
      </div>

      {/* Trimtab Controls */}
      <div style={{
        display: 'flex',
        gap: '8px',
        justifyContent: 'center'
      }}>
        <button
          onClick={() => adjustCoherence(-0.05)}
          style={{
            padding: '12px 24px',
            background: '#374151',
            border: '1px solid #4B5563',
            borderRadius: '8px',
            color: '#F3F4F6',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = '#4B5563'}
          onMouseOut={(e) => e.currentTarget.style.background = '#374151'}
        >
          ← Decrease Coherence
        </button>
        <button
          onClick={() => adjustCoherence(0.05)}
          style={{
            padding: '12px 24px',
            background: '#374151',
            border: '1px solid #4B5563',
            borderRadius: '8px',
            color: '#F3F4F6',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = '#4B5563'}
          onMouseOut={(e) => e.currentTarget.style.background = '#374151'}
        >
          Increase Coherence →
        </button>
      </div>

      {/* Info */}
      <div style={{
        padding: '12px',
        background: '#C084FC15',
        borderRadius: '8px',
        borderLeft: '3px solid #C084FC'
      }}>
        <p style={{ fontSize: '12px', color: '#C084FC', margin: 0 }}>
          <strong>Goal:</strong> Keep entropy (H) near 0.35 (green line) to maintain quantum coherence.
          The molecule becomes jagged and red when decoherent, smooth and blue when aligned.
        </p>
      </div>
    </div>
  );
};
