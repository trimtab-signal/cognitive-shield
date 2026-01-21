/**
 * JITTERBUG VISUALIZER - MESMERIZING ENTROPY SHADER SHOWCASE
 * Real-time GLSL shader demonstrations of quantum entropy states
 *
 * Watch as mathematical chaos dances into beautiful entropy visualizations
 * Red=jagged (high entropy), Blue=fuzzy (thermal), Green=stable (coherence)
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { jitterbugShaders } from '../lib/jitterbug-shaders';
import GOD_CONFIG from '../god.config';

// Shader names and descriptions
const SHADER_INFO = {
  redJagged: {
    name: 'Crimson Chaos',
    description: 'High entropy jagged patterns - quantum uncertainty visualized',
    entropy: 0.9,
    color: '#ef4444'
  },
  blueFuzzy: {
    name: 'Azure Turbulence',
    description: 'Thermal noise waves - molecular vibration entropy',
    entropy: 0.7,
    color: '#3b82f6'
  },
  greenStable: {
    name: 'Emerald Harmony',
    description: 'Low entropy crystalline order - quantum coherence',
    entropy: 0.1,
    color: '#22c55e'
  },
  purpleSuperposition: {
    name: 'Violet Paradox',
    description: 'Quantum superposition interference - mixed quantum states',
    entropy: 0.5,
    color: '#8b5cf6'
  },
  rainbowDecoherence: {
    name: 'Prismatic Collapse',
    description: 'Wave function decoherence cascade - state reduction',
    entropy: 0.8,
    color: '#ec4899'
  },
  goldResonance: {
    name: 'Golden Resonance',
    description: 'Coherence amplification harmonics - field stabilization',
    entropy: 0.2,
    color: '#eab308'
  },
  voidSingularity: {
    name: 'Abyssal Void',
    description: 'Maximum entropy singularity - information black hole',
    entropy: 0.95,
    color: '#1f2937'
  }
};

interface JitterbugSceneProps {
  currentShader: string;
  entropy: number;
  playerPosition: THREE.Vector3;
  showParticles: boolean;
  showOrbs: boolean;
  showCascades: boolean;
}

// Animated shader mesh component
function ShaderMesh({ shaderName, entropy, playerPosition }: {
  shaderName: string;
  entropy: number;
  playerPosition: THREE.Vector3;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  useEffect(() => {
    const material = jitterbugShaders.getShader(shaderName);
    if (material && meshRef.current) {
      materialRef.current = material;
      meshRef.current.material = material;

      // Set initial uniforms
      material.uniforms.entropy.value = entropy;
      material.uniforms.playerPosition.value = playerPosition;
    }
  }, [shaderName]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
      materialRef.current.uniforms.entropy.value = entropy;
      materialRef.current.uniforms.playerPosition.value = playerPosition;
    }

    // Add some movement to make it more dynamic
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -2]}>
      <planeGeometry args={[8, 8, 64, 64]} />
    </mesh>
  );
}

// Quantum particle system
function QuantumParticles({ count = 50 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  useEffect(() => {
    if (!pointsRef.current) return;

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      // Quantum-inspired colors
      colors[i * 3] = Math.random() * 0.5 + 0.5;     // R
      colors[i * 3 + 1] = Math.random() * 0.5 + 0.5; // G
      colors[i * 3 + 2] = Math.random() * 0.5 + 0.5; // B
    }

    pointsRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pointsRef.current.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;

        // Quantum random walk
        positions[i3] += (Math.random() - 0.5) * 0.02;
        positions[i3 + 1] += (Math.random() - 0.5) * 0.02;
        positions[i3 + 2] += (Math.random() - 0.5) * 0.02;

        // Keep particles bounded
        positions[i3] = Math.max(-10, Math.min(10, positions[i3]));
        positions[i3 + 1] = Math.max(-10, Math.min(10, positions[i3 + 1]));
        positions[i3 + 2] = Math.max(-10, Math.min(10, positions[i3 + 2]));
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      pointsRef.current.rotation.y += 0.002;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry />
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

// Decoherence cascade effects
function DecoherenceCascades({ count = 3 }: { count?: number }) {
  const cascadesRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!cascadesRef.current) return;

    // Clear existing cascades
    while (cascadesRef.current.children.length > 0) {
      cascadesRef.current.remove(cascadesRef.current.children[0]);
    }

    // Add new cascades
    for (let i = 0; i < count; i++) {
      const cascade = jitterbugShaders.createDecoherenceCascade(
        new THREE.Vector3(
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 15
        )
      );
      cascadesRef.current.add(cascade);
    }
  }, [count]);

  return <group ref={cascadesRef} />;
}

// Superposition orbs
function SuperpositionOrbs({ count = 3 }: { count?: number }) {
  const orbsRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!orbsRef.current) return;

    // Clear existing orbs
    while (orbsRef.current.children.length > 0) {
      orbsRef.current.remove(orbsRef.current.children[0]);
    }

    // Add new orbs
    for (let i = 0; i < count; i++) {
      const orb = jitterbugShaders.createSuperpositionOrb(1 + Math.random() * 0.5);
      orb.position.set(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12
      );
      orbsRef.current.add(orb);
    }
  }, [count]);

  return <group ref={orbsRef} />;
}

// Entropy field background
function EntropyField() {
  const fieldRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (!fieldRef.current) return;

    const field = jitterbugShaders.createEntropyField(30);
    fieldRef.current.add(field);
  }, []);

  return <group ref={fieldRef} />;
}

// Main scene component
function JitterbugScene({ currentShader, entropy, playerPosition, showParticles, showOrbs, showCascades }: JitterbugSceneProps) {
  const { camera } = useThree();

  // Update camera position to match player
  useEffect(() => {
    camera.position.copy(playerPosition).add(new THREE.Vector3(0, 2, 5));
    camera.lookAt(playerPosition);
  }, [playerPosition, camera]);

  // Update global shader uniforms
  useFrame(() => {
    jitterbugShaders.updateShaders(
      performance.now() * 0.001,
      entropy,
      playerPosition
    );
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={playerPosition.toArray()} intensity={0.5} color="#8b5cf6" />

      {/* Background entropy field */}
      <EntropyField />

      {/* Main shader visualization */}
      <ShaderMesh
        shaderName={currentShader}
        entropy={entropy}
        playerPosition={playerPosition}
      />

      {/* Optional effects */}
      {showParticles && <QuantumParticles count={100} />}
      {showOrbs && <SuperpositionOrbs count={5} />}
      {showCascades && <DecoherenceCascades count={3} />}

      {/* Player indicator */}
      <mesh position={playerPosition.toArray()}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial
          color="#00ff88"
          emissive="#00ff88"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Shader info display */}
      <Html position={[0, 4, 0]}>
        <div style={{
          backgroundColor: 'rgba(0,0,0,0.8)',
          color: SHADER_INFO[currentShader as keyof typeof SHADER_INFO]?.color || '#ffffff',
          padding: '10px 15px',
          borderRadius: '8px',
          textAlign: 'center',
          fontSize: '14px',
          fontFamily: 'monospace',
          border: `2px solid ${SHADER_INFO[currentShader as keyof typeof SHADER_INFO]?.color || '#ffffff'}`
        }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '5px' }}>
            {SHADER_INFO[currentShader as keyof typeof SHADER_INFO]?.name || 'Unknown Shader'}
          </div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>
            {SHADER_INFO[currentShader as keyof typeof SHADER_INFO]?.description || ''}
          </div>
          <div style={{ fontSize: '11px', marginTop: '5px', opacity: 0.6 }}>
            Entropy: {(entropy * 100).toFixed(1)}% | Shader: {currentShader}
          </div>
        </div>
      </Html>

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        target={playerPosition}
      />
    </>
  );
}

export default function JitterbugVisualizer() {
  const [currentShader, setCurrentShader] = useState('redJagged');
  const [entropy, setEntropy] = useState(0.5);
  const [autoCycleShaders, setAutoCycleShaders] = useState(false);
  const [playerPosition, setPlayerPosition] = useState(new THREE.Vector3(0, 0, 0));
  const [showParticles, setShowParticles] = useState(true);
  const [showOrbs, setShowOrbs] = useState(true);
  const [showCascades, setShowCascades] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Auto-cycle shaders
  useEffect(() => {
    if (!autoCycleShaders) return;

    const shaderNames = jitterbugShaders.getShaderNames();
    let currentIndex = shaderNames.indexOf(currentShader);

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % shaderNames.length;
      setCurrentShader(shaderNames[currentIndex]);

      // Update entropy based on shader type
      const shaderInfo = SHADER_INFO[shaderNames[currentIndex] as keyof typeof SHADER_INFO];
      if (shaderInfo) {
        setEntropy(shaderInfo.entropy);
      }
    }, 8000); // Change every 8 seconds

    return () => clearInterval(interval);
  }, [autoCycleShaders, currentShader]);

  // Random player movement
  useEffect(() => {
    const interval = setInterval(() => {
      setPlayerPosition(new THREE.Vector3(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 8
      ));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const shaderNames = jitterbugShaders.getShaderNames();

  return (
    <div style={{
      width: '100%',
      height: isFullscreen ? '100vh' : '800px',
      position: isFullscreen ? 'fixed' : 'relative',
      top: 0,
      left: 0,
      zIndex: isFullscreen ? 9999 : 'auto',
      backgroundColor: '#000011',
      borderRadius: isFullscreen ? 0 : '12px',
      overflow: 'hidden'
    }}>
      {/* Control Panel */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 100,
        backgroundColor: 'rgba(0,0,0,0.9)',
        padding: '20px',
        borderRadius: '12px',
        border: '2px solid #8b5cf6',
        minWidth: '300px'
      }}>
        <h2 style={{
          margin: '0 0 15px 0',
          color: '#8b5cf6',
          fontSize: '18px',
          fontFamily: 'monospace'
        }}>
          🌌 JITTERBUG VISUALIZER
        </h2>

        {/* Shader Selection */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#ffffff' }}>
            Shader Effect:
          </label>
          <select
            value={currentShader}
            onChange={(e) => setCurrentShader(e.target.value)}
            disabled={autoCycleShaders}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#1a1a1a',
              border: '1px solid #8b5cf6',
              borderRadius: '4px',
              color: '#ffffff',
              fontSize: '14px'
            }}
          >
            {shaderNames.map(name => {
              const info = SHADER_INFO[name as keyof typeof SHADER_INFO];
              return (
                <option key={name} value={name}>
                  {info?.name || name}
                </option>
              );
            })}
          </select>
        </div>

        {/* Entropy Control */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#ffffff' }}>
            Entropy Level: {(entropy * 100).toFixed(1)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={entropy}
            onChange={(e) => setEntropy(parseFloat(e.target.value))}
            style={{
              width: '100%',
              height: '6px',
              borderRadius: '3px',
              background: '#333',
              outline: 'none'
            }}
          />
        </div>

        {/* Effect Toggles */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#ffffff' }}>
            Visual Effects:
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center', fontSize: '12px', color: '#cccccc' }}>
              <input
                type="checkbox"
                checked={showParticles}
                onChange={(e) => setShowParticles(e.target.checked)}
                style={{ marginRight: '5px' }}
              />
              Particles
            </label>
            <label style={{ display: 'flex', alignItems: 'center', fontSize: '12px', color: '#cccccc' }}>
              <input
                type="checkbox"
                checked={showOrbs}
                onChange={(e) => setShowOrbs(e.target.checked)}
                style={{ marginRight: '5px' }}
              />
              Orbs
            </label>
            <label style={{ display: 'flex', alignItems: 'center', fontSize: '12px', color: '#cccccc' }}>
              <input
                type="checkbox"
                checked={showCascades}
                onChange={(e) => setShowCascades(e.target.checked)}
                style={{ marginRight: '5px' }}
              />
              Cascades
            </label>
          </div>
        </div>

        {/* Control Buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setAutoCycleShaders(!autoCycleShaders)}
            style={{
              padding: '8px 12px',
              backgroundColor: autoCycleShaders ? '#22c55e' : '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            {autoCycleShaders ? '⏸ Auto' : '▶ Auto'}
          </button>

          <button
            onClick={toggleFullscreen}
            style={{
              padding: '8px 12px',
              backgroundColor: '#8b5cf6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            {isFullscreen ? '🗗 Exit' : '🗖 Full'}
          </button>

          <button
            onClick={() => {
              const randomShader = shaderNames[Math.floor(Math.random() * shaderNames.length)];
              setCurrentShader(randomShader);
              const info = SHADER_INFO[randomShader as keyof typeof SHADER_INFO];
              if (info) setEntropy(info.entropy);
            }}
            style={{
              padding: '8px 12px',
              backgroundColor: '#ec4899',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            🎲 Random
          </button>
        </div>

        {/* Current Shader Info */}
        <div style={{
          marginTop: '15px',
          padding: '10px',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          borderRadius: '6px',
          border: '1px solid rgba(139, 92, 246, 0.3)'
        }}>
          <div style={{
            fontSize: '12px',
            color: SHADER_INFO[currentShader as keyof typeof SHADER_INFO]?.color || '#ffffff',
            fontWeight: 'bold'
          }}>
            {SHADER_INFO[currentShader as keyof typeof SHADER_INFO]?.name || 'Unknown'}
          </div>
          <div style={{ fontSize: '11px', color: '#cccccc', marginTop: '3px' }}>
            {SHADER_INFO[currentShader as keyof typeof SHADER_INFO]?.description || ''}
          </div>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [5, 2, 5], fov: 75 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
      >
        <JitterbugScene
          currentShader={currentShader}
          entropy={entropy}
          playerPosition={playerPosition}
          showParticles={showParticles}
          showOrbs={showOrbs}
          showCascades={showCascades}
        />
      </Canvas>

      {/* Performance Info */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: '#ffffff',
        padding: '10px',
        borderRadius: '6px',
        fontSize: '11px',
        fontFamily: 'monospace'
      }}>
        <div>Shaders: {shaderNames.length} loaded</div>
        <div>Entropy: {(entropy * 100).toFixed(1)}%</div>
        <div>Effects: {[
          showParticles && 'Particles',
          showOrbs && 'Orbs',
          showCascades && 'Cascades'
        ].filter(Boolean).join(', ') || 'None'}</div>
        {autoCycleShaders && <div>🔄 Auto-cycling active</div>}
      </div>

      {/* Instructions Overlay */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        right: '340px',
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: '#ffffff',
        padding: '15px',
        borderRadius: '10px',
        fontSize: '12px',
        maxHeight: '120px',
        overflowY: 'auto'
      }}>
        <strong>🎭 Jitterbug Controls:</strong><br />
        • Select shaders to explore different entropy visualizations<br />
        • Adjust entropy level to see state transitions<br />
        • Toggle effects for mesmerizing combinations<br />
        • Enable auto-cycle for continuous shader evolution<br />
        • Go fullscreen for immersive quantum chaos experience<br />
        <span style={{ color: '#8b5cf6', fontStyle: 'italic' }}>
          <br />"Watch as mathematics dances into visual poetry..."
        </span>
      </div>
    </div>
  );
}