/**
 * COHERENCE QUEST
 * Fisher-Escolà Physics Game
 *
 * Player maintains quantum coherence (H ≈ 0.35) using trimtab input (0-1 range)
 * Visual feedback: red=jagged (entropy), blue=fuzzy (noise), green=stable (coherence)
 */

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Box, Torus } from '@react-three/drei';
import * as THREE from 'three';
import { fisherEscolaEngine, type CoherenceMetrics } from '../lib/fisher-escola-physics';
import GOD_CONFIG from '../god.config';

interface GameState {
  coherence: number;
  entropy: number;
  score: number;
  time: number;
  gameOver: boolean;
  level: number;
  multiplier: number;
  achievements: string[];
  highScore: number;
}

interface TrimtabInput {
  value: number; // 0-1
  velocity: number;
  acceleration: number;
}

export default function CoherenceQuest() {
  const [gameState, setGameState] = useState<GameState>({
    coherence: 0.35,
    entropy: 0,
    score: 0,
    time: 0,
    gameOver: false,
    level: 1,
    multiplier: 1.0,
    achievements: [],
    highScore: parseInt(localStorage.getItem('coherenceQuest_highScore') || '0')
  });

  const [trimtabInput, setTrimtabInput] = useState<TrimtabInput>({
    value: 0.5,
    velocity: 0,
    acceleration: 0
  });

  const [physicsMetrics, setPhysicsMetrics] = useState<CoherenceMetrics | null>(null);
  const [moleculeCount, setMoleculeCount] = useState(0);
  const [molecules, setMolecules] = useState<any[]>([]);
  const [keyboardMode, setKeyboardMode] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Game loop
  useEffect(() => {
    const gameLoop = setInterval(() => {
      if (gameState.gameOver || isPaused) return;

      // Update physics engine
      const metrics = fisherEscolaEngine.update(100); // 100ms delta
      setPhysicsMetrics(metrics);

      const state = fisherEscolaEngine.getState();
      setMoleculeCount(state.activeMoleculeCount);
      setMolecules(state.molecules.filter(m => !m.decayTime).slice(0, 50));

      // Apply trimtab effect to coherence
      const trimtabEffect = (trimtabInput.value - 0.5) * 0.01 * (1 + gameState.level * 0.1); // Scaling difficulty
      const newCoherence = Math.max(0, Math.min(1, metrics.hurstExponent + trimtabEffect));

      // Calculate entropy (distance from target H=0.35)
      const entropy = Math.abs(newCoherence - 0.35) / 0.35;

      // Enhanced scoring with multiplier and level bonuses
      const coherenceBonus = Math.max(0, 1 - entropy * 2);
      const levelBonus = gameState.level * 0.1;
      const moleculeBonus = Math.min(state.activeMoleculeCount * 0.5, 10);
      const newScore = gameState.score + (coherenceBonus + levelBonus + moleculeBonus) * gameState.multiplier;

      // Level progression
      const newLevel = Math.floor(gameState.time / 60) + 1; // New level every minute
      const levelChanged = newLevel > gameState.level;

      // Multiplier increases with perfect coherence streaks
      const perfectCoherence = entropy < 0.05;
      const newMultiplier = perfectCoherence ?
        Math.min(gameState.multiplier + 0.01, 5.0) :
        Math.max(gameState.multiplier - 0.02, 0.5);

      // Achievements system
      let newAchievements = [...gameState.achievements];
      if (entropy < 0.1 && !newAchievements.includes('coherence_master')) {
        newAchievements.push('coherence_master');
      }
      if (state.activeMoleculeCount >= 20 && !newAchievements.includes('molecule_collector')) {
        newAchievements.push('molecule_collector');
      }
      if (newLevel >= 3 && !newAchievements.includes('quantum_survivor')) {
        newAchievements.push('quantum_survivor');
      }
      if (newMultiplier >= 3.0 && !newAchievements.includes('multiplier_mage')) {
        newAchievements.push('multiplier_mage');
      }

      // Check game over conditions (scaled by level)
      const gameOver = entropy > (0.8 - gameState.level * 0.05) || gameState.time > (300 + gameState.level * 60);

      // Update high score
      const finalScore = gameOver ? newScore : gameState.highScore;
      if (gameOver && newScore > gameState.highScore) {
        localStorage.setItem('coherenceQuest_highScore', newScore.toString());
      }

      setGameState(prev => ({
        coherence: newCoherence,
        entropy,
        score: newScore,
        time: prev.time + 0.1,
        gameOver,
        level: newLevel,
        multiplier: newMultiplier,
        achievements: newAchievements,
        highScore: finalScore
      }));

      // Apply trimtab effect to physics engine (scaled by level)
      if (Math.abs(trimtabInput.value - 0.5) > 0.1) {
        fisherEscolaEngine.applyPerturbation('field', (trimtabInput.value - 0.5) * 0.001 * gameState.level);
      }

      // Level-based molecule formation
      const formationChance = 0.02 + (gameState.level - 1) * 0.005; // More molecules at higher levels
      if (Math.random() < formationChance) {
        fisherEscolaEngine.formPosnerMolecule({
          x: (Math.random() - 0.5) * (10 + gameState.level),
          y: (Math.random() - 0.5) * (10 + gameState.level),
          z: (Math.random() - 0.5) * (10 + gameState.level)
        });
      }

      // Random perturbations at higher levels
      if (gameState.level >= 2 && Math.random() < 0.001 * gameState.level) {
        fisherEscolaEngine.applyPerturbation('thermal', Math.random() * 0.01);
      }

    }, 100);

    return () => clearInterval(gameLoop);
  }, [gameState.gameOver, trimtabInput.value, gameState.time, gameState.score]);

  const handleTrimtabChange = (value: number) => {
    setTrimtabInput(prev => ({
      value,
      velocity: value - prev.value,
      acceleration: (value - prev.value) - prev.velocity
    }));
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!keyboardMode) return;

      const step = 0.01;
      switch (event.key.toLowerCase()) {
        case 'a':
        case 'arrowleft':
          event.preventDefault();
          setTrimtabInput(prev => ({
            value: Math.max(0, prev.value - step),
            velocity: -step,
            acceleration: -step - prev.velocity
          }));
          break;
        case 'd':
        case 'arrowright':
          event.preventDefault();
          setTrimtabInput(prev => ({
            value: Math.min(1, prev.value + step),
            velocity: step,
            acceleration: step - prev.velocity
          }));
          break;
        case 's':
        case 'arrowdown':
          event.preventDefault();
          setTrimtabInput(prev => ({
            value: 0.5,
            velocity: 0.5 - prev.value,
            acceleration: (0.5 - prev.value) - prev.velocity
          }));
          break;
        case 'w':
        case 'arrowup':
          event.preventDefault();
          // Fine tune mode - smaller steps
          setTrimtabInput(prev => ({
            value: prev.value + (prev.velocity > 0 ? step * 0.1 : -step * 0.1),
            velocity: prev.velocity * 0.9,
            acceleration: 0
          }));
          break;
      }
    };

    if (keyboardMode) {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [keyboardMode]);

  const resetGame = () => {
    fisherEscolaEngine.reset();
    setGameState({
      coherence: 0.35,
      entropy: 0,
      score: 0,
      time: 0,
      gameOver: false,
      level: 1,
      multiplier: 1.0,
      achievements: [],
      highScore: gameState.highScore
    });
    setTrimtabInput({
      value: 0.5,
      velocity: 0,
      acceleration: 0
    });
  };

  const getEntropyColor = (entropy: number) => {
    if (entropy < 0.2) return '#22c55e'; // Green - coherent
    if (entropy < 0.5) return '#eab308'; // Yellow - moderate
    return '#ef4444'; // Red - high entropy
  };

  const getAchievementIcon = (achievement: string) => {
    switch (achievement) {
      case 'coherence_master': return '🎯';
      case 'molecule_collector': return '🧬';
      case 'quantum_survivor': return '⚡';
      case 'multiplier_mage': return '✨';
      default: return '🏆';
    }
  };

  const getAchievementName = (achievement: string) => {
    switch (achievement) {
      case 'coherence_master': return 'Coherence Master (Entropy < 10%)';
      case 'molecule_collector': return 'Molecule Collector (20+ molecules)';
      case 'quantum_survivor': return 'Quantum Survivor (Level 3+)';
      case 'multiplier_mage': return 'Multiplier Mage (3x+ bonus)';
      default: return achievement;
    }
  };

  const getCoherenceVisualization = () => {
    const entropy = gameState.entropy;

    if (entropy < 0.2) {
      // Green - stable tetrahedron
      return <StableTetrahedron />;
    } else if (entropy < 0.5) {
      // Yellow - vibrating tetrahedron
      return <VibratingTetrahedron />;
    } else {
      // Red - jagged entropy field
      return <EntropyField />;
    }
  };

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      position: 'relative',
      backgroundColor: GOD_CONFIG.theme.bg.primary
    }}>
      {/* 3D Game Canvas */}
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} />

        {/* Game World */}
        <GameWorld
          coherence={gameState.coherence}
          entropy={gameState.entropy}
          moleculeCount={moleculeCount}
        />

        {/* Coherence Visualization */}
        <group position={[0, 0, -2]}>
          {getCoherenceVisualization()}
        </group>

        <OrbitControls enablePan={false} enableZoom={true} />
      </Canvas>

      {/* Game UI */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '20px',
        borderRadius: '10px',
        fontFamily: 'monospace',
        fontSize: '14px',
        maxWidth: '300px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ margin: '0', color: getEntropyColor(gameState.entropy) }}>
            🔬 COHERENCE QUEST - Level {gameState.level}
          </h3>
          <button
            onClick={() => setIsPaused(!isPaused)}
            disabled={gameState.gameOver}
            style={{
              padding: '4px 8px',
              backgroundColor: isPaused ? '#22c55e' : '#eab308',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            {isPaused ? '▶' : '⏸'}
          </button>
        </div>

        {isPaused && !gameState.gameOver && (
          <div style={{
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '15px',
            textAlign: 'center',
            color: '#eab308'
          }}>
            ⏸ PAUSED - Press button to resume
          </div>
        )}

        <div style={{ marginBottom: '15px' }}>
          <div>Time: {gameState.time.toFixed(1)}s</div>
          <div>Score: {Math.floor(gameState.score)} pts</div>
          <div>High Score: {Math.floor(gameState.highScore)} pts</div>
          <div>Molecules: {moleculeCount}</div>
          <div style={{ color: gameState.multiplier > 1 ? '#22c55e' : '#6b7280' }}>
            Multiplier: {gameState.multiplier.toFixed(1)}x
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <div>Hurst Exponent: {gameState.coherence.toFixed(3)}</div>
          <div>Target: 0.350</div>
          <div style={{ color: getEntropyColor(gameState.entropy) }}>
            Entropy: {(gameState.entropy * 100).toFixed(1)}%
          </div>
        </div>

        {physicsMetrics && (
          <div style={{ marginBottom: '15px', fontSize: '12px' }}>
            <div>Coherence Time: {physicsMetrics.coherenceTime.toFixed(1)}ms</div>
            <div>Fidelity: {(physicsMetrics.fidelity * 100).toFixed(1)}%</div>
          </div>
        )}

        {/* Achievements */}
        {gameState.achievements.length > 0 && (
          <div style={{ marginBottom: '15px', fontSize: '12px' }}>
            <div style={{ color: '#eab308', marginBottom: '5px' }}>🏆 Achievements:</div>
            {gameState.achievements.map(achievement => (
              <div key={achievement} style={{ color: '#22c55e' }}>
                {getAchievementIcon(achievement)} {getAchievementName(achievement)}
              </div>
            ))}
          </div>
        )}

        {/* Mini-map */}
        <div style={{ marginBottom: '15px' }}>
          <div style={{ fontSize: '12px', marginBottom: '5px', color: '#888' }}>🗺️ Molecule Map:</div>
          <MoleculeMiniMap molecules={molecules} />
        </div>

        {/* Control Mode Toggle */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
            <input
              type="checkbox"
              checked={keyboardMode}
              onChange={(e) => setKeyboardMode(e.target.checked)}
            />
            🎮 Keyboard Controls (A/D for coarse, W/S for center/fine)
          </label>
        </div>

        {/* Trimtab Control */}
        <div style={{ marginTop: '10px' }}>
          <label style={{ display: 'block', marginBottom: '8px' }}>
            🎛️ Trimtab Input: {trimtabInput.value.toFixed(3)}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.001"
            value={trimtabInput.value}
            onChange={(e) => handleTrimtabChange(parseFloat(e.target.value))}
            disabled={keyboardMode}
            style={{
              width: '100%',
              height: '8px',
              borderRadius: '4px',
              background: keyboardMode ? '#555' : '#333',
              outline: 'none',
              opacity: keyboardMode ? 0.5 : 1,
              cursor: keyboardMode ? 'not-allowed' : 'pointer'
            }}
          />
          <div style={{ fontSize: '11px', marginTop: '5px', color: '#888' }}>
            Center (0.5) = equilibrium | Too high/low = entropy
            {keyboardMode && (
              <span style={{ color: '#22c55e' }}>
                <br />🎮 A/D: Coarse adjust | W: Fine tune | S: Center
              </span>
            )}
          </div>

          {/* Velocity/Acceleration indicators */}
          <div style={{ fontSize: '10px', marginTop: '5px', color: '#666' }}>
            Velocity: {trimtabInput.velocity.toFixed(3)} |
            Acceleration: {trimtabInput.acceleration.toFixed(3)}
          </div>
        </div>

        {gameState.gameOver && (
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <div style={{ color: '#ef4444', fontSize: '16px', marginBottom: '10px' }}>
              🎮 GAME OVER
            </div>
            <div style={{ fontSize: '12px', marginBottom: '15px' }}>
              <div>Final Score: {Math.floor(gameState.score)} pts</div>
              <div>Level Reached: {gameState.level}</div>
              <div>Max Multiplier: {gameState.multiplier.toFixed(1)}x</div>
              <div>Molecules Created: {moleculeCount}</div>
              {gameState.achievements.length > 0 && (
                <div style={{ color: '#eab308', marginTop: '5px' }}>
                  Achievements Unlocked: {gameState.achievements.length}
                </div>
              )}
              {gameState.score > gameState.highScore && (
                <div style={{ color: '#22c55e', fontWeight: 'bold' }}>
                  🎉 NEW HIGH SCORE!
                </div>
              )}
            </div>
            <button
              onClick={resetGame}
              style={{
                padding: '8px 16px',
                backgroundColor: '#22c55e',
                border: 'none',
                borderRadius: '5px',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              🔄 Play Again
            </button>
          </div>
        )}
      </div>

      {/* Enhanced Instructions */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '15px',
        borderRadius: '10px',
        fontSize: '12px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <strong>🎯 Maintain coherence at H ≈ 0.350</strong>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
          <div>
            <strong>🎮 Controls:</strong><br />
            • Trimtab: Gentle quantum field adjustment<br />
            • Center (0.5) = equilibrium<br />
            • Too far = entropy increase
          </div>

          <div>
            <strong>🏆 Scoring:</strong><br />
            • Coherence bonus: Distance from target<br />
            • Level multiplier: Increases difficulty<br />
            • Molecule bonus: +0.5 pts each<br />
            • Perfect streaks: Multiplier boost
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <span style={{ color: '#22c55e' }}>🟢 Green = Stable Ca₉(PO₄)₆</span> |
          <span style={{ color: '#eab308' }}>🟡 Yellow = Vibrating field</span> |
          <span style={{ color: '#ef4444' }}>🔴 Red = Entropy collapse</span>
        </div>

        <div style={{ textAlign: 'center', fontSize: '11px', color: '#888' }}>
          🎹 Enable keyboard mode for precise control | 🏆 Unlock achievements | ⚡ Higher levels = more molecules
        </div>
      </div>
    </div>
  );
}

// Enhanced Game World Component
function GameWorld({ coherence, entropy, moleculeCount }: {
  coherence: number;
  entropy: number;
  moleculeCount: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Rotation based on coherence and entropy
      const rotationSpeed = 0.005 * (1 - entropy) + coherence * 0.01;
      groupRef.current.rotation.y += rotationSpeed;
      groupRef.current.rotation.x += entropy * 0.002;
    }

    // Dynamic lighting based on coherence
    if (lightRef.current) {
      lightRef.current.intensity = 0.4 + coherence * 0.6;
      lightRef.current.color.setHSL(coherence * 0.3, 0.8, 0.6);
    }
  });

  // Get molecules from physics engine
  const molecules = useMemo(() => {
    return fisherEscolaEngine.getState().molecules.filter(m => !m.decayTime);
  }, [moleculeCount]);

  // Generate quantum field particles
  const fieldParticles = useMemo(() => {
    const particles = [];
    for (let i = 0; i < 200; i++) {
      const angle = (i / 200) * Math.PI * 2;
      const radius = 15 + Math.sin(i * 0.1) * 5;
      const height = Math.cos(i * 0.15) * 8;
      particles.push({
        position: [
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius
        ] as [number, number, number],
        intensity: Math.random()
      });
    }
    return particles;
  }, []);

  return (
    <group ref={groupRef}>
      {/* Dynamic lighting */}
      <pointLight
        ref={lightRef}
        position={[5, 5, 5]}
        intensity={0.4}
        distance={50}
        decay={2}
      />
      <ambientLight intensity={0.2} />

      {/* Quantum field background */}
      <mesh>
        <sphereGeometry args={[25, 64, 64]} />
        <meshBasicMaterial
          color={entropy < 0.2 ? '#001122' : entropy < 0.5 ? '#221100' : '#220011'}
          side={THREE.BackSide}
          transparent
          opacity={0.05 + entropy * 0.1}
        />
      </mesh>

      {/* Quantum field particles */}
      {fieldParticles.map((particle, i) => (
        <QuantumFieldParticle
          key={`field-${i}`}
          position={particle.position}
          intensity={particle.intensity}
          entropy={entropy}
          coherence={coherence}
        />
      ))}

      {/* Posner molecules */}
      {molecules.slice(0, 50).map((molecule) => (
        <PosnerMolecule
          key={molecule.id}
          position={[molecule.position.x * 0.08, molecule.position.y * 0.08, molecule.position.z * 0.08]}
          coherence={molecule.coherence}
        />
      ))}

      {/* Enhanced target attractor */}
      <group position={[2.5, 0, 0]}>
        {/* Central attractor */}
        <mesh>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial
            color="#22c55e"
            emissive="#22c55e"
            emissiveIntensity={0.8}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Orbital rings */}
        {[0, 1, 2].map(i => (
          <mesh key={`ring-${i}`} rotation={[Math.PI / 2, 0, i * Math.PI / 3]}>
            <torusGeometry args={[0.3 + i * 0.1, 0.02, 8, 16]} />
            <meshBasicMaterial
              color="#22c55e"
              transparent
              opacity={0.6}
            />
          </mesh>
        ))}

        {/* Target label */}
        <Text
          position={[0, 0.5, 0]}
          fontSize={0.08}
          color="#22c55e"
          anchorX="center"
          anchorY="middle"
        >
          TARGET H=0.350
        </Text>

        {/* Coherence indicator */}
        <Text
          position={[0, -0.5, 0]}
          fontSize={0.06}
          color="#22c55e"
          anchorX="center"
          anchorY="middle"
        >
          {coherence.toFixed(3)}
        </Text>
      </group>

      {/* Entropy vortex effects */}
      {entropy > 0.3 && (
        <group>
          {Array.from({ length: 5 }, (_, i) => (
            <EntropyVortex
              key={`vortex-${i}`}
              position={[
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20
              ]}
              intensity={entropy}
            />
          ))}
        </group>
      )}

      {/* Coherence wave effects */}
      {coherence > 0.6 && (
        <CoherenceWave center={[0, 0, 0]} radius={15} coherence={coherence} />
      )}
    </group>
  );
}

// Quantum field particle
function QuantumFieldParticle({ position, intensity, entropy, coherence }: {
  position: [number, number, number];
  intensity: number;
  entropy: number;
  coherence: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Quantum fluctuation animation
      const time = state.clock.elapsedTime;
      const fluctuation = Math.sin(time * 2 + intensity * 10) * 0.5 + 0.5;
      meshRef.current.scale.setScalar(fluctuation * (0.5 + coherence * 0.5));

      // Color based on entropy and coherence
      const hue = entropy * 0.1 + coherence * 0.3;
      meshRef.current.material.color.setHSL(hue, 0.8, 0.6);
      (meshRef.current.material as THREE.MeshBasicMaterial).opacity = fluctuation * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.02, 6, 6]} />
      <meshBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.3}
      />
    </mesh>
  );
}

// Entropy vortex effect
function EntropyVortex({ position, intensity }: {
  position: [number, number, number];
  intensity: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += intensity * 0.05;
      groupRef.current.rotation.x += intensity * 0.03;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {Array.from({ length: 3 }, (_, i) => (
        <mesh key={`vortex-ring-${i}`} rotation={[Math.PI / 2, 0, i * Math.PI / 3]}>
          <torusGeometry args={[0.5 + i * 0.2, 0.05, 6, 8]} />
          <meshBasicMaterial
            color="#ef4444"
            transparent
            opacity={intensity * 0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

// Coherence wave effect
function CoherenceWave({ center, radius, coherence }: {
  center: [number, number, number];
  radius: number;
  coherence: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      const wavePhase = (time * 2) % (Math.PI * 2);
      meshRef.current.material.opacity = coherence * 0.2 * Math.sin(wavePhase);
    }
  });

  return (
    <mesh ref={meshRef} position={center}>
      <ringGeometry args={[radius - 0.5, radius + 0.5, 64]} />
      <meshBasicMaterial
        color="#22c55e"
        transparent
        opacity={0.2}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Enhanced Posner Molecule Visualization
function PosnerMolecule({ position, coherence }: { position: [number, number, number]; coherence: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Quantum rotation based on coherence
      const quantumPhase = coherence * Math.PI * 2;
      groupRef.current.rotation.x += 0.01 + coherence * 0.02;
      groupRef.current.rotation.y += 0.01 + coherence * 0.02;
      groupRef.current.rotation.z += quantumPhase * 0.001;

      // Pulsing scale based on coherence
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 3 + quantumPhase) * coherence * 0.2;
      groupRef.current.scale.setScalar(pulse);
    }
  });

  // Posner molecule structure: Ca₉(PO₄)₆
  // Calcium atoms (green spheres)
  const calciumPositions = [
    [0, 0, 0], // Central calcium
    [1, 1, 1], [-1, 1, 1], [1, -1, 1], [1, 1, -1], // Corner calciums
    [-1, -1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, -1] // Edge calciums
  ];

  // Phosphate groups (blue tetrahedrons)
  const phosphatePositions = [
    [0.5, 0, 0], [-0.5, 0, 0], [0, 0.5, 0], [0, -0.5, 0],
    [0, 0, 0.5], [0, 0, -0.5]
  ];

  const moleculeSize = 0.03;

  return (
    <group ref={groupRef} position={position}>
      {/* Calcium atoms */}
      {calciumPositions.map((pos, i) => (
        <mesh key={`ca-${i}`} position={[pos[0] * moleculeSize * 2, pos[1] * moleculeSize * 2, pos[2] * moleculeSize * 2]}>
          <sphereGeometry args={[moleculeSize * 0.8, 8, 8]} />
          <meshStandardMaterial
            color="#22c55e"
            emissive="#22c55e"
            emissiveIntensity={coherence * 0.4}
            transparent
            opacity={0.7 + coherence * 0.3}
          />
        </mesh>
      ))}

      {/* Phosphate tetrahedrons */}
      {phosphatePositions.map((pos, i) => (
        <mesh key={`po4-${i}`} position={[pos[0] * moleculeSize * 3, pos[1] * moleculeSize * 3, pos[2] * moleculeSize * 3]}>
          <tetrahedronGeometry args={[moleculeSize * 1.2, 0]} />
          <meshStandardMaterial
            color="#3b82f6"
            emissive="#3b82f6"
            emissiveIntensity={coherence * 0.6}
            transparent
            opacity={0.5 + coherence * 0.5}
            wireframe={coherence < 0.3}
          />
        </mesh>
      ))}

      {/* Quantum coherence field */}
      <mesh>
        <sphereGeometry args={[moleculeSize * 4, 16, 16]} />
        <meshBasicMaterial
          color={coherence > 0.7 ? '#22c55e' : coherence > 0.4 ? '#eab308' : '#ef4444'}
          transparent
          opacity={coherence * 0.1}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Orbital electrons visualization */}
      {coherence > 0.5 && (
        <group>
          {Array.from({ length: 3 }, (_, i) => {
            const angle = (i / 3) * Math.PI * 2;
            const radius = moleculeSize * 5;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            return (
              <mesh key={`electron-${i}`} position={[x, 0, z]}>
                <sphereGeometry args={[moleculeSize * 0.3, 6, 6]} />
                <meshBasicMaterial
                  color="#ffffff"
                  emissive="#ffffff"
                  emissiveIntensity={0.8}
                />
              </mesh>
            );
          })}
        </group>
      )}
    </group>
  );
}

// Stable Tetrahedron (Green State)
function StableTetrahedron() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <mesh ref={meshRef}>
      <tetrahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#22c55e"
        emissive="#22c55e"
        emissiveIntensity={0.2}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

// Vibrating Tetrahedron (Yellow State)
function VibratingTetrahedron() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.02;
      meshRef.current.position.x = Math.sin(state.clock.elapsedTime * 5) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef}>
      <tetrahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#eab308"
        emissive="#eab308"
        emissiveIntensity={0.3}
        transparent
        opacity={0.7}
      />
    </mesh>
  );
}

// Entropy Field (Red State)
function EntropyField() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x += 0.03;
      groupRef.current.rotation.z += 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Jagged geometry representing entropy */}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh key={i} position={[
          Math.sin(i) * 0.8,
          Math.cos(i) * 0.8,
          Math.sin(i * 2) * 0.8
        ]}>
          <tetrahedronGeometry args={[0.2, 0]} />
          <meshStandardMaterial
            color="#ef4444"
            emissive="#ef4444"
            emissiveIntensity={0.5}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

// Molecule Mini-Map Component
function MoleculeMiniMap({ molecules }: { molecules: any[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, 0, 120, 80);

    // Draw grid
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      ctx.beginPath();
      ctx.moveTo(i * 30, 0);
      ctx.lineTo(i * 30, 80);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * 20);
      ctx.lineTo(120, i * 20);
      ctx.stroke();
    }

    // Draw molecules
    molecules.forEach(molecule => {
      const x = ((molecule.position.x + 10) / 20) * 120;
      const y = ((molecule.position.y + 10) / 20) * 80;

      if (x >= 0 && x < 120 && y >= 0 && y < 80) {
        // Molecule dot
        ctx.fillStyle = molecule.coherence > 0.7 ? '#22c55e' :
                       molecule.coherence > 0.4 ? '#eab308' : '#ef4444';
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, 2 * Math.PI);
        ctx.fill();

        // Coherence ring
        ctx.strokeStyle = ctx.fillStyle;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, y, 4 * molecule.coherence, 0, 2 * Math.PI);
        ctx.stroke();
      }
    });

    // Draw center target
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(60, 40, 3, 0, 2 * Math.PI);
    ctx.stroke();

  }, [molecules]);

  return (
    <canvas
      ref={canvasRef}
      width={120}
      height={80}
      style={{
        border: '1px solid rgba(255,255,255,0.3)',
        borderRadius: '4px',
        backgroundColor: 'rgba(0,0,0,0.5)'
      }}
    />
  );
}