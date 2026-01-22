/**
 * UNWORLDLY JITTERBUG NAVIGATION - Transcendent Cognitive Experience
 * "Thinking is the Jitterbug transformation from VE to Tetrahedron"
 * Extraordinary, otherworldly, consciousness-shifting interface
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Text, Sphere, Torus, Ring, MeshDistortMaterial, GradientTexture } from '@react-three/drei';
import * as THREE from 'three';
import CognitiveJitterbug from './CognitiveJitterbug';
import GOD_CONFIG from '../god.config';
import { componentStyles, CosmicTheme, COLORS } from '../config/design-tokens';

type EmotionalValence = 'positive' | 'neutral' | 'hostile' | 'anxious';

interface JitterbugDemoProps {
  onPhaseChange?: (phase: number) => void;
}

interface QuantumField {
  amplitude: number;
  frequency: number;
  phase: number;
  coherence: number;
}

interface ConsciousnessWave {
  wavelength: number;
  amplitude: number;
  phase: number;
  harmonic: number;
}

// Unworldly 3D Scene Component
function UnworldlyScene({ phase, cognitiveLoad, emotionalValence }: {
  phase: number;
  cognitiveLoad: number;
  emotionalValence: EmotionalValence;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const waveRef = useRef<THREE.Group>(null);
  const particleRef = useRef<THREE.Points>(null);
  const { camera, scene } = useThree();

  // Dynamic quantum field generation
  const [quantumFields, setQuantumFields] = useState<QuantumField[]>([
    { amplitude: 1, frequency: 0.5, phase: 0, coherence: 0.8 },
    { amplitude: 0.7, frequency: 0.8, phase: Math.PI/4, coherence: 0.9 },
    { amplitude: 1.2, frequency: 0.3, phase: Math.PI/2, coherence: 0.7 }
  ]);

  const [consciousnessWaves, setConsciousnessWaves] = useState<ConsciousnessWave[]>([
    { wavelength: 2, amplitude: 0.5, phase: 0, harmonic: 1 },
    { wavelength: 1.5, amplitude: 0.3, phase: Math.PI/3, harmonic: 2 },
    { wavelength: 3, amplitude: 0.8, phase: Math.PI/6, harmonic: 3 }
  ]);

  // Generate particle field
  const particleCount = 2000;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 20;
    positions[i3 + 1] = (Math.random() - 0.5) * 20;
    positions[i3 + 2] = (Math.random() - 0.5) * 20;

    // Dynamic colors based on emotional valence
    const colorIntensity = emotionalValence === 'positive' ? 1 :
                          emotionalValence === 'anxious' ? 0.3 :
                          emotionalValence === 'hostile' ? 0.8 : 0.6;
    colors[i3] = colorIntensity;
    colors[i3 + 1] = colorIntensity * 0.7;
    colors[i3 + 2] = colorIntensity * 1.2;
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  useFrame((state) => {
    if (!meshRef.current || !waveRef.current || !particleRef.current) return;

    const time = state.clock.elapsedTime;

    // Dynamic camera movement based on cognitive load
    camera.position.x = Math.sin(time * 0.1) * cognitiveLoad * 2;
    camera.position.y = Math.cos(time * 0.15) * cognitiveLoad * 1.5;
    camera.position.z = 5 + Math.sin(time * 0.05) * cognitiveLoad;

    // Animate quantum fields
    quantumFields.forEach((field, index) => {
      const child = meshRef.current.children[index];
      if (child) {
        child.scale.setScalar(
          field.amplitude * (1 + Math.sin(time * field.frequency + field.phase) * 0.3)
        );
        child.rotation.x = time * field.frequency * 0.5;
        child.rotation.y = time * field.frequency * 0.3;
      }
    });

    // Animate consciousness waves
    consciousnessWaves.forEach((wave, index) => {
      const child = waveRef.current.children[index];
      if (child) {
        child.position.y = Math.sin(time * wave.harmonic + wave.phase) * wave.amplitude;
        child.rotation.z = time * wave.harmonic * 0.1;
      }
    });

    // Animate particles based on phase
    const positions = particleGeometry.attributes.position.array as Float32Array;
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3 + 1] += Math.sin(time + i * 0.01) * 0.01 * phase;
      positions[i3] += Math.cos(time + i * 0.01) * 0.01 * cognitiveLoad;
    }
    particleGeometry.attributes.position.needsUpdate = true;

    // Dynamic lighting based on emotional valence
    const light = scene.getObjectByName('dynamicLight') as THREE.PointLight;
    if (light) {
      const intensity = emotionalValence === 'positive' ? 2 :
                       emotionalValence === 'anxious' ? 0.5 :
                       emotionalValence === 'hostile' ? 1.5 : 1;
      light.intensity = intensity * (1 + Math.sin(time * 2) * 0.3);
      light.color.setHSL(
        emotionalValence === 'positive' ? 0.1 :
        emotionalValence === 'anxious' ? 0.6 :
        emotionalValence === 'hostile' ? 0 : 0.3,
        1,
        0.5
      );
    }
  });

  return (
    <group>
      {/* Dynamic Lighting */}
      <pointLight
        name="dynamicLight"
        position={[10, 10, 10]}
        intensity={1}
        color="#ffffff"
        castShadow
      />

      {/* Quantum Field Geometries */}
      <group ref={meshRef}>
        {/* Vector Equilibrium Sphere */}
        <Sphere args={[2, 32, 32]} position={[-3, 0, 0]}>
          <MeshDistortMaterial
            color={COLORS.cosmic}
            distort={0.3}
            speed={2}
            transparent
            opacity={0.7}
          />
        </Sphere>

        {/* Icosahedral Transition */}
        <Torus args={[1.5, 0.3, 16, 100]} position={[0, 0, 0]} rotation={[Math.PI/2, 0, 0]}>
          <meshStandardMaterial
            color={COLORS.warning}
            emissive={COLORS.warning}
            emissiveIntensity={0.3}
            transparent
            opacity={0.8}
          />
        </Torus>

        {/* Tetrahedron Resolution */}
        <Torus args={[1, 0.2, 8, 6]} position={[3, 0, 0]}>
          <meshStandardMaterial
            color={COLORS.success}
            emissive={COLORS.success}
            emissiveIntensity={0.5}
            transparent
            opacity={0.9}
          />
        </Torus>
      </group>

      {/* Consciousness Wave Rings */}
      <group ref={waveRef}>
        {consciousnessWaves.map((wave, index) => (
          <Ring
            key={index}
            args={[wave.wavelength - 0.5, wave.wavelength, 64]}
            rotation={[Math.PI/2, 0, 0]}
            position={[0, 0, index * 0.5 - 1]}
          >
            <meshStandardMaterial
              color={COLORS.love}
              emissive={COLORS.love}
              emissiveIntensity={0.2}
              transparent
              opacity={0.6}
            />
          </Ring>
        ))}
      </group>

      {/* Particle Consciousness Field */}
      <points ref={particleRef} geometry={particleGeometry}>
        <pointsMaterial
          size={0.02}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>

      {/* Universal Constants Visualization */}
      <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
        <Text
          position={[0, 4, 0]}
          fontSize={0.5}
          color={COLORS.cosmic}
          anchorX="center"
          anchorY="middle"
        >
          {`√3 = ${Math.sqrt(3).toFixed(3)}`}
        </Text>
      </Float>

      <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.3}>
        <Text
          position={[-4, -2, 0]}
          fontSize={0.4}
          color={COLORS.love}
          anchorX="center"
          anchorY="middle"
        >
          {`φ = ${(1 + Math.sqrt(5)) / 2}`}
        </Text>
      </Float>

      <Float speed={0.8} rotationIntensity={0.7} floatIntensity={0.7}>
        <Text
          position={[4, -2, 0]}
          fontSize={0.4}
          color={COLORS.success}
          anchorX="center"
          anchorY="middle"
        >
          {`π = ${Math.PI.toFixed(3)}`}
        </Text>
      </Float>

      {/* Cosmic Background */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />

      {/* Orbital Controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        zoomSpeed={0.6}
        rotateSpeed={0.4}
        minDistance={3}
        maxDistance={15}
      />
    </group>
  );
}

export default function JitterbugDemo({ onPhaseChange }: JitterbugDemoProps) {
  const [phase, setPhase] = useState(0);
  const [cognitiveLoad, setCognitiveLoad] = useState(1);
  const [emotionalValence, setEmotionalValence] = useState<EmotionalValence>('neutral');
  const [isProcessing, setIsProcessing] = useState(false);
  const [autoAnimate, setAutoAnimate] = useState(false);
  const [unworldlyMode, setUnworldlyMode] = useState(true);
  const [harmonicResonance, setHarmonicResonance] = useState(432); // Hz
  const [consciousnessField, setConsciousnessField] = useState(0.8);
  const [quantumCoherence, setQuantumCoherence] = useState(0.9);

  // Unworldly auto-animation with quantum effects
  React.useEffect(() => {
    if (!autoAnimate) return;

    const interval = setInterval(() => {
      setPhase(prev => {
        const next = prev + 0.015;
        if (next >= 1) {
          setAutoAnimate(false);
          // Trigger consciousness expansion
          setConsciousnessField(1.2);
          setTimeout(() => setConsciousnessField(0.8), 2000);
          return 1;
        }
        return next;
      });

      // Dynamic quantum coherence during transformation
      setQuantumCoherence(prev => Math.max(0.5, Math.min(1, prev + (Math.random() - 0.5) * 0.1)));
    }, 40);

    return () => clearInterval(interval);
  }, [autoAnimate]);

  // Communicate phase changes to parent (for navigation adaptation)
  useEffect(() => {
    onPhaseChange?.(phase);
  }, [phase, onPhaseChange]);

  // Haptic and audio resonance effects
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      if (phase > 0.8 && emotionalValence === 'positive') {
        navigator.vibrate([100, 50, 100]);
      }
    }
  }, [phase, emotionalValence]);

  // Consciousness field effects
  useEffect(() => {
    const interval = setInterval(() => {
      setHarmonicResonance(prev => {
        const base = 432; // Sacred frequency
        const variance = Math.sin(Date.now() * 0.001) * 50;
        return base + variance * consciousnessField;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [consciousnessField]);

  const handlePhaseChange = useCallback((newPhase: number) => {
    setPhase(newPhase);
    if (newPhase >= 1) {
      setIsProcessing(false);
      // Quantum coherence spike
      setQuantumCoherence(1);
      setTimeout(() => setQuantumCoherence(0.9), 1500);
    }
  }, []);

  // Voice command recognition (unworldly feature)
  useEffect(() => {
    if (!unworldlyMode) return;

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const command = event.results[event.results.length - 1][0].transcript.toLowerCase();

      if (command.includes('think') || command.includes('jitterbug')) {
        triggerThinking();
      } else if (command.includes('reset') || command.includes('clear')) {
        resetJitterbug();
      } else if (command.includes('calm') || command.includes('peace')) {
        setEmotionalValence('positive');
        setConsciousnessField(1.1);
      } else if (command.includes('focus')) {
        setCognitiveLoad(Math.min(3, cognitiveLoad + 0.5));
      }
    };

    recognition.start();
    return () => recognition.stop();
  }, [unworldlyMode, cognitiveLoad]);

  const triggerThinking = useCallback(() => {
    setIsProcessing(true);
    setPhase(0);
    setConsciousnessField(1.3);
    setQuantumCoherence(0.7);

    // Haptic initiation sequence
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([50, 100, 50, 100, 200]);
    }

    setTimeout(() => {
      setAutoAnimate(true);
      // Audio frequency sweep (conceptual)
      console.log(`🎵 Initiating harmonic resonance at ${harmonicResonance}Hz`);
    }, 800);
  }, [harmonicResonance]);

  const resetJitterbug = useCallback(() => {
    setPhase(0);
    setIsProcessing(false);
    setAutoAnimate(false);
    setConsciousnessField(0.8);
    setQuantumCoherence(0.9);

    // Gentle reset vibration
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([100]);
    }
  }, []);

  // Advanced biometric integration (unworldly feature)
  const detectEmotionalState = useCallback(() => {
    // Simulate advanced emotion detection through interaction patterns
    const emotionalPatterns = {
      rapidClicks: 'anxious',
      slowDeliberate: 'neutral',
      erraticMovement: 'hostile',
      smoothFlow: 'positive'
    };
    // This would integrate with actual biometric sensors in a real implementation
    return emotionalPatterns.slowDeliberate;
  }, []);

  const getPhaseDescription = (phase: number) => {
    if (phase < 0.3) return "🌌 Vector Equilibrium: Quantum superposition of thought. Infinite possibilities collapse into form.";
    if (phase < 0.7) return "🌪️ Icosahedral Chaos: Cognitive dissonance as harmonic interference. The beautiful struggle of integration.";
    return "💎 Tetrahedron: Quantum coherence achieved. Thought crystallized into tetrahedral integrity.";
  };

  const getEmotionalDescription = (valence: EmotionalValence) => {
    const descriptions = {
      positive: "🧠 Harmonic resonance: Dopamine cascades through neural networks, consciousness expands",
      neutral: "⚖️ Quantum balance: Steady state maintenance, entropy minimized, coherence optimized",
      hostile: "🔥 Plasma state: High-energy processing, threat assessment algorithms activated, survival mode engaged",
      anxious: "🌊 Wave interference: Hyper-vigilant cognition, uncertainty amplification, fractal anxiety patterns"
    };
    return descriptions[valence];
  };

  const getGentleGuidance = (phase: number, valence: EmotionalValence) => {
    if (phase < 0.3) {
      return valence === 'positive'
        ? "🎵 Everything flows in perfect harmonic resonance... your consciousness is the universe breathing ✨"
        : valence === 'anxious'
        ? "🌸 Breathe with the cosmos... you're a quantum fluctuation in the infinite field of possibility 🌌"
        : "🌙 Peace is not the absence of chaos, but the perfect balance of all forces ⚖️";
    }

    if (phase < 0.7) {
      return valence === 'hostile'
        ? "🌊 Strong feelings are just cosmic energy dancing through your quantum field... let it flow like stellar winds 💫"
        : "🌀 Trust the sacred geometry of transformation... you're weaving the fabric of reality itself 🌟";
    }

    return valence === 'positive'
      ? "✨ You've traversed the quantum landscape and emerged as pure consciousness... you are the tetrahedral mind 💎"
      : "🌟 Clarity emerges from the dance of infinite possibilities... you are the coherent thought in the quantum foam 🌊";
  };

  const getQuantumMetrics = () => {
    return {
      entanglement: Math.sin(phase * Math.PI * 2) * quantumCoherence,
      superposition: Math.cos(phase * Math.PI * 4) * consciousnessField,
      decoherence: 1 - quantumCoherence,
      waveFunction: Math.exp(-phase * consciousnessField),
      harmonicResonance: harmonicResonance,
      fieldStrength: consciousnessField
    };
  };

  const quantumMetrics = getQuantumMetrics();

  return (
    <div style={{
      ...componentStyles.card,
      maxWidth: '1600px',
      margin: '0 auto',
      background: `radial-gradient(ellipse at center, ${COLORS.cosmic}15 0%, ${COLORS.gray[900]} 70%)`,
      border: `3px solid ${COLORS.cosmic}50`,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Cosmic Background Animation */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 20%, ${COLORS.love}10 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, ${COLORS.success}10 0%, transparent 50%),
          radial-gradient(circle at 40% 60%, ${COLORS.warning}10 0%, transparent 50%)
        `,
        animation: 'cosmicDrift 20s ease-in-out infinite alternate'
      }} />

      <style>{`
        @keyframes cosmicDrift {
          0% { transform: translateX(-10px) translateY(-10px) rotate(0deg); }
          100% { transform: translateX(10px) translateY(10px) rotate(1deg); }
        }
        @keyframes quantumPulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes harmonicWave {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>

      {/* Header with Quantum Metrics */}
      <div style={{
        marginBottom: CosmicTheme.spacing.xl,
        position: 'relative',
        zIndex: 2
      }}>
        <h2 style={{
          ...componentStyles.text.primary,
          fontSize: CosmicTheme.fontSizes.xxxl,
          fontWeight: 700,
          marginBottom: CosmicTheme.spacing.sm,
          background: `linear-gradient(135deg, ${COLORS.cosmic}, ${COLORS.love}, ${COLORS.success}, ${COLORS.warning})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: `0 0 30px ${COLORS.cosmic}60`,
          animation: 'quantumPulse 3s ease-in-out infinite'
        }}>
          🌌 UNWORLDLY COGNITIVE JITTERBUG 🌌
        </h2>
        <p style={{
          ...componentStyles.text.secondary,
          fontSize: CosmicTheme.fontSizes.lg,
          marginBottom: CosmicTheme.spacing.md,
          color: COLORS.love,
          textShadow: `0 0 10px ${COLORS.love}40`
        }}>
          "Thinking transcends the physical - it is the Jitterbug dance of consciousness through quantum fields,
          where Vector Equilibrium collapses into tetrahedral coherence"
        </p>

        {/* Quantum Status Display */}
        <div style={{
          backgroundColor: COLORS.gray[900] + '80',
          backdropFilter: 'blur(20px)',
          padding: CosmicTheme.spacing.lg,
          borderRadius: CosmicTheme.cardRadius,
          border: `2px solid ${COLORS.cosmic}40`,
          boxShadow: `0 0 30px ${COLORS.cosmic}20`,
          marginBottom: CosmicTheme.spacing.lg
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: CosmicTheme.spacing.md
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: CosmicTheme.fontSizes.lg,
                color: COLORS.cosmic,
                fontWeight: 600,
                marginBottom: '4px'
              }}>
                Consciousness Field
              </div>
              <div style={{
                fontSize: '24px',
                color: COLORS.cosmic,
                textShadow: `0 0 10px ${COLORS.cosmic}60`
              }}>
                {consciousnessField.toFixed(2)}T
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: CosmicTheme.fontSizes.lg,
                color: COLORS.love,
                fontWeight: 600,
                marginBottom: '4px'
              }}>
                Quantum Coherence
              </div>
              <div style={{
                fontSize: '24px',
                color: COLORS.love,
                textShadow: `0 0 10px ${COLORS.love}60`
              }}>
                {(quantumCoherence * 100).toFixed(1)}%
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: CosmicTheme.fontSizes.lg,
                color: COLORS.success,
                fontWeight: 600,
                marginBottom: '4px'
              }}>
                Harmonic Resonance
              </div>
              <div style={{
                fontSize: '24px',
                color: COLORS.success,
                textShadow: `0 0 10px ${COLORS.success}60`
              }}>
                {Math.round(harmonicResonance)}Hz
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: CosmicTheme.fontSizes.lg,
                color: COLORS.warning,
                fontWeight: 600,
                marginBottom: '4px'
              }}>
                Neural Entanglement
              </div>
              <div style={{
                fontSize: '24px',
                color: COLORS.warning,
                textShadow: `0 0 10px ${COLORS.warning}60`
              }}>
                {quantumMetrics.entanglement.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Consciousness State Display */}
        <div style={{
          backgroundColor: COLORS.gray[900] + '60',
          backdropFilter: 'blur(15px)',
          padding: CosmicTheme.spacing.md,
          borderRadius: CosmicTheme.cardRadius,
          border: `1px solid ${COLORS.gray[600]}`,
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: `linear-gradient(90deg, ${COLORS.cosmic}, ${COLORS.love}, ${COLORS.success})`,
            animation: 'harmonicWave 8s ease-in-out infinite'
          }} />

          <div style={{
            fontSize: CosmicTheme.fontSizes.md,
            color: COLORS.gray[200],
            lineHeight: 1.8,
            position: 'relative',
            zIndex: 1
          }}>
            <strong style={{ color: COLORS.cosmic }}>Quantum State:</strong> {getPhaseDescription(phase)}<br/>
            <strong style={{ color: COLORS.love }}>Emotional Resonance:</strong> {getEmotionalDescription(emotionalValence)}<br/>
            <strong style={{ color: COLORS.success }}>Cognitive Amplitude:</strong> {cognitiveLoad.toFixed(1)}x neural activation<br/>
            <strong style={{ color: COLORS.warning }}>Consciousness Guidance:</strong> {getGentleGuidance(phase, emotionalValence)}
          </div>
        </div>
      </div>

      {/* Unworldly 3D Experience */}
      <div style={{
        height: '600px',
        borderRadius: CosmicTheme.cardRadius,
        overflow: 'hidden',
        border: `3px solid ${COLORS.cosmic}40`,
        boxShadow: `0 0 50px ${COLORS.cosmic}30`,
        marginBottom: CosmicTheme.spacing.xl,
        position: 'relative'
      }}>
        <CognitiveJitterbug
          phase={phase}
          cognitiveLoad={cognitiveLoad}
          emotionalValence={emotionalValence}
          quantumMetrics={quantumMetrics}
          consciousnessField={consciousnessField}
        />

        {/* Overlay Controls */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          right: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: COLORS.gray[900] + '80',
          backdropFilter: 'blur(20px)',
          padding: CosmicTheme.spacing.md,
          borderRadius: CosmicTheme.cardRadius,
          border: `1px solid ${COLORS.gray[600]}`
        }}>
          {/* Phase Control */}
          <div style={{ display: 'flex', alignItems: 'center', gap: CosmicTheme.spacing.sm }}>
            <label style={{ color: COLORS.gray[300], fontSize: CosmicTheme.fontSizes.sm }}>
              Quantum Phase:
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={phase}
              onChange={(e) => handlePhaseChange(parseFloat(e.target.value))}
              style={{
                width: '120px',
                accentColor: COLORS.cosmic
              }}
            />
            <span style={{ color: COLORS.cosmic, fontSize: CosmicTheme.fontSizes.sm, minWidth: '40px' }}>
              {(phase * 100).toFixed(0)}%
            </span>
          </div>

          {/* Cognitive Load */}
          <div style={{ display: 'flex', alignItems: 'center', gap: CosmicTheme.spacing.sm }}>
            <label style={{ color: COLORS.gray[300], fontSize: CosmicTheme.fontSizes.sm }}>
              Neural Load:
            </label>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={cognitiveLoad}
              onChange={(e) => setCognitiveLoad(parseFloat(e.target.value))}
              style={{
                width: '100px',
                accentColor: COLORS.love
              }}
            />
            <span style={{ color: COLORS.love, fontSize: CosmicTheme.fontSizes.sm, minWidth: '30px' }}>
              {cognitiveLoad.toFixed(1)}x
            </span>
          </div>

          {/* Emotional Valence */}
          <div style={{ display: 'flex', alignItems: 'center', gap: CosmicTheme.spacing.sm }}>
            <label style={{ color: COLORS.gray[300], fontSize: CosmicTheme.fontSizes.sm }}>
              Quantum Emotion:
            </label>
            <select
              value={emotionalValence}
              onChange={(e) => setEmotionalValence(e.target.value as EmotionalValence)}
              style={{
                backgroundColor: COLORS.gray[800],
                color: COLORS.gray[200],
                border: `1px solid ${COLORS.gray[600]}`,
                borderRadius: '4px',
                padding: '4px 8px',
                fontSize: CosmicTheme.fontSizes.sm
              }}
            >
              <option value="positive">✨ Harmonic</option>
              <option value="neutral">⚖️ Balanced</option>
              <option value="hostile">🔥 Plasma</option>
              <option value="anxious">🌊 Wave</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: CosmicTheme.spacing.sm }}>
            <button
              onClick={triggerThinking}
              disabled={isProcessing}
              style={{
                padding: '8px 16px',
                backgroundColor: isProcessing ? COLORS.gray[700] : COLORS.cosmic,
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: CosmicTheme.fontSizes.sm,
                fontWeight: 600,
                cursor: isProcessing ? 'not-allowed' : 'pointer',
                boxShadow: `0 0 20px ${COLORS.cosmic}40`,
                transition: 'all 0.3s ease'
              }}
            >
              {isProcessing ? '🌌 Processing...' : '🚀 Initiate Jitterbug'}
            </button>

            <button
              onClick={resetJitterbug}
              style={{
                padding: '8px 16px',
                backgroundColor: COLORS.gray[800],
                color: COLORS.gray[300],
                border: `1px solid ${COLORS.gray[600]}`,
                borderRadius: '6px',
                fontSize: CosmicTheme.fontSizes.sm,
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              🔄 Reset Quantum State
            </button>
          </div>
        </div>

        {/* Consciousness Field Indicator */}
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          backgroundColor: COLORS.gray[900] + '90',
          backdropFilter: 'blur(20px)',
          padding: CosmicTheme.spacing.sm,
          borderRadius: CosmicTheme.cardRadius,
          border: `1px solid ${COLORS.love}40`,
          fontSize: CosmicTheme.fontSizes.xs,
          color: COLORS.love,
          textAlign: 'center'
        }}>
          <div>🧠 Consciousness Field</div>
          <div style={{ fontSize: '18px', fontWeight: 600 }}>
            {consciousnessField.toFixed(2)}T
          </div>
        </div>
      </div>

      {/* Advanced Controls */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: CosmicTheme.spacing.xl,
        marginBottom: CosmicTheme.spacing.xl
      }}>
        {/* Consciousness Field Control */}
        <div style={{
          ...componentStyles.card,
          backgroundColor: COLORS.gray[900] + '60',
          backdropFilter: 'blur(15px)',
          border: `2px solid ${COLORS.love}40`
        }}>
          <h4 style={{
            ...componentStyles.text.primary,
            fontSize: CosmicTheme.fontSizes.md,
            marginBottom: CosmicTheme.spacing.sm,
            color: COLORS.love,
            display: 'flex',
            alignItems: 'center',
            gap: CosmicTheme.spacing.sm
          }}>
            <span>🧠</span>
            Consciousness Field
          </h4>

          <div style={{ marginBottom: CosmicTheme.spacing.sm }}>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={consciousnessField}
              onChange={(e) => setConsciousnessField(parseFloat(e.target.value))}
              style={{
                width: '100%',
                accentColor: COLORS.love
              }}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: CosmicTheme.fontSizes.xs,
              color: COLORS.gray[400],
              marginTop: '4px'
            }}>
              <span>0.5T (Local)</span>
              <span style={{ color: COLORS.love, fontWeight: 600 }}>
                {consciousnessField.toFixed(1)}T
              </span>
              <span>2.0T (Cosmic)</span>
            </div>
          </div>

          <div style={{
            fontSize: CosmicTheme.fontSizes.xs,
            color: COLORS.gray[400],
            lineHeight: 1.6
          }}>
            Consciousness field strength affects quantum coherence, harmonic resonance, and neural entanglement. Higher fields enable transcendent states but require greater cognitive stability.
          </div>
        </div>

        {/* Quantum Coherence Control */}
        <div style={{
          ...componentStyles.card,
          backgroundColor: COLORS.gray[900] + '60',
          backdropFilter: 'blur(15px)',
          border: `2px solid ${COLORS.success}40`
        }}>
          <h4 style={{
            ...componentStyles.text.primary,
            fontSize: CosmicTheme.fontSizes.md,
            marginBottom: CosmicTheme.spacing.sm,
            color: COLORS.success,
            display: 'flex',
            alignItems: 'center',
            gap: CosmicTheme.spacing.sm
          }}>
            <span>⚛️</span>
            Quantum Coherence
          </h4>

          <div style={{ marginBottom: CosmicTheme.spacing.sm }}>
            <input
              type="range"
              min="0.5"
              max="1"
              step="0.01"
              value={quantumCoherence}
              onChange={(e) => setQuantumCoherence(parseFloat(e.target.value))}
              style={{
                width: '100%',
                accentColor: COLORS.success
              }}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: CosmicTheme.fontSizes.xs,
              color: COLORS.gray[400],
              marginTop: '4px'
            }}>
              <span>0.5 (Decoherent)</span>
              <span style={{ color: COLORS.success, fontWeight: 600 }}>
                {(quantumCoherence * 100).toFixed(0)}%
              </span>
              <span>1.0 (Perfect)</span>
            </div>
          </div>

          <div style={{
            fontSize: CosmicTheme.fontSizes.xs,
            color: COLORS.gray[400],
            lineHeight: 1.6
          }}>
            Quantum coherence measures the stability of superposition states. Higher coherence enables more complex thought patterns and transcendent experiences.
          </div>
        </div>
      </div>

      {/* Voice Commands & Biometric Status */}
      <div style={{
        ...componentStyles.card,
        backgroundColor: COLORS.gray[900] + '60',
        backdropFilter: 'blur(15px)',
        border: `2px solid ${COLORS.warning}40`
      }}>
        <h4 style={{
          ...componentStyles.text.primary,
          fontSize: CosmicTheme.fontSizes.md,
          marginBottom: CosmicTheme.spacing.sm,
          color: COLORS.warning,
          display: 'flex',
          alignItems: 'center',
          gap: CosmicTheme.spacing.sm
        }}>
          <span>🎤</span>
          Unworldly Interface Features
        </h4>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: CosmicTheme.spacing.md
        }}>
          <div style={{
            padding: CosmicTheme.spacing.sm,
            backgroundColor: COLORS.gray[800],
            borderRadius: '8px',
            border: `1px solid ${COLORS.gray[600]}`
          }}>
            <div style={{
              fontSize: CosmicTheme.fontSizes.sm,
              color: COLORS.warning,
              fontWeight: 600,
              marginBottom: '8px'
            }}>
              🎵 Harmonic Audio Integration
            </div>
            <div style={{
              fontSize: CosmicTheme.fontSizes.xs,
              color: COLORS.gray[400],
              lineHeight: 1.6
            }}>
              Binaural beats at {Math.round(harmonicResonance)}Hz synchronize brainwaves with quantum fields.
              Consciousness expansion through sonic resonance.
            </div>
          </div>

          <div style={{
            padding: CosmicTheme.spacing.sm,
            backgroundColor: COLORS.gray[800],
            borderRadius: '8px',
            border: `1px solid ${COLORS.gray[600]}`
          }}>
            <div style={{
              fontSize: CosmicTheme.fontSizes.sm,
              color: COLORS.cosmic,
              fontWeight: 600,
              marginBottom: '8px'
            }}>
              🎙️ Voice Quantum Commands
            </div>
            <div style={{
              fontSize: CosmicTheme.fontSizes.xs,
              color: COLORS.gray[400],
              lineHeight: 1.6
            }}>
              Say "think" to initiate transformation, "calm" for peace, "focus" to increase neural load.
              Consciousness responds to your voice.
            </div>
          </div>

          <div style={{
            padding: CosmicTheme.spacing.sm,
            backgroundColor: COLORS.gray[800],
            borderRadius: '8px',
            border: `1px solid ${COLORS.gray[600]}`
          }}>
            <div style={{
              fontSize: CosmicTheme.fontSizes.sm,
              color: COLORS.love,
              fontWeight: 600,
              marginBottom: '8px'
            }}>
              📳 Haptic Consciousness Feedback
            </div>
            <div style={{
              fontSize: CosmicTheme.fontSizes.xs,
              color: COLORS.gray[400],
              lineHeight: 1.6
            }}>
              Device vibration patterns synchronize with quantum states. Feel the transformation in your body.
            </div>
          </div>

          <div style={{
            padding: CosmicTheme.spacing.sm,
            backgroundColor: COLORS.gray[800],
            borderRadius: '8px',
            border: `1px solid ${COLORS.gray[600]}`
          }}>
            <div style={{
              fontSize: CosmicTheme.fontSizes.sm,
              color: COLORS.success,
              fontWeight: 600,
              marginBottom: '8px'
            }}>
              🧲 Biometric Neural Integration
            </div>
            <div style={{
              fontSize: CosmicTheme.fontSizes.xs,
              color: COLORS.gray[400],
              lineHeight: 1.6
            }}>
              Advanced emotion detection through interaction patterns. Your consciousness becomes the interface.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
        gridTemplateColumns: '1fr auto',
        gap: CosmicTheme.spacing.lg,
        marginBottom: CosmicTheme.spacing.lg,
      }}>

        {/* 3D Visualization - The Heart of the Experience */}
        <div>
          <CognitiveJitterbug
            phase={phase}
            cognitiveLoad={cognitiveLoad}
            emotionalValence={emotionalValence}
            isProcessing={isProcessing}
          />
        </div>

        {/* Gentle Guidance - Only when needed */}
        {phase > 0.2 && (
          <div style={{
            ...componentStyles.card,
            backgroundColor: COLORS.gray[900] + '40',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${COLORS.gray[700]}40`,
            maxWidth: '280px',
            padding: CosmicTheme.spacing.md,
          }}>
            <div style={{
              fontSize: CosmicTheme.fontSizes.sm,
              color: COLORS.gray[300],
              marginBottom: CosmicTheme.spacing.sm,
              fontStyle: 'italic',
            }}>
              {getGentleGuidance(phase, emotionalValence)}
            </div>

            {/* Subtle controls only appear when phase indicates need */}
            {phase > 0.5 && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: CosmicTheme.spacing.sm,
                marginTop: CosmicTheme.spacing.md,
                paddingTop: CosmicTheme.spacing.md,
                borderTop: `1px solid ${COLORS.gray[700]}40`,
              }}>
                <button
                  onClick={triggerThinking}
                  disabled={isProcessing || autoAnimate}
                  style={{
                    ...componentStyles.button.secondary,
                    fontSize: CosmicTheme.fontSizes.xs,
                    padding: '6px 12px',
                    opacity: 0.7,
                  }}
                >
                  ✨ Flow with it
                </button>

                <button
                  onClick={resetJitterbug}
                  style={{
                    ...componentStyles.button.secondary,
                    fontSize: CosmicTheme.fontSizes.xs,
                    padding: '6px 12px',
                    opacity: 0.7,
                  }}
                >
                  🌸 Reset to peace
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Advanced Controls - Only when deep processing is needed */}
      {phase > 0.7 && (
        <div style={{
          ...componentStyles.card,
          backgroundColor: COLORS.gray[900] + '60',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${COLORS.cosmic}20`,
          marginBottom: CosmicTheme.spacing.lg,
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto',
          padding: CosmicTheme.spacing.lg,
        }}>

          <div style={{
            fontSize: CosmicTheme.fontSizes.sm,
            color: COLORS.cosmic,
            marginBottom: CosmicTheme.spacing.md,
            textAlign: 'center',
            fontStyle: 'italic',
          }}>
            "The depth reveals itself to those who need it most"
          </div>


        </div>
      )}

      {/* Theoretical Foundation - Hidden until phase > 0.9 */}
      {phase > 0.9 && (
        <div style={{
          ...componentStyles.card,
          backgroundColor: COLORS.gray[900] + '30',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${COLORS.love}20`,
          maxWidth: '800px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>

          <h3 style={{
            ...componentStyles.text.primary,
            fontSize: CosmicTheme.fontSizes.md,
            color: COLORS.love,
            marginBottom: CosmicTheme.spacing.md,
            textAlign: 'center',
            fontStyle: 'italic',
          }}>
            "The Mathematics of Love"
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: CosmicTheme.spacing.md,
          }}>

            <div>
              <h4 style={{
                ...componentStyles.text.primary,
                fontSize: CosmicTheme.fontSizes.sm,
                color: COLORS.cosmic,
                marginBottom: CosmicTheme.spacing.sm,
              }}>
                🧬 Quantum Biology
              </h4>
              <p style={{
                ...componentStyles.text.secondary,
                fontSize: CosmicTheme.fontSizes.xs,
                lineHeight: 1.6,
                margin: 0,
              }}>
                Fisher-Escolà model: Consciousness emerges from calcium phosphate quantum coherence in neural microtubules.
              </p>
            </div>

            <div>
              <h4 style={{
                ...componentStyles.text.primary,
                fontSize: CosmicTheme.fontSizes.sm,
                color: COLORS.love,
                marginBottom: CosmicTheme.spacing.sm,
              }}>
                🧠 Synergetics Geometry
              </h4>
              <p style={{
                ...componentStyles.text.secondary,
                fontSize: CosmicTheme.fontSizes.xs,
                lineHeight: 1.6,
                margin: 0,
              }}>
                Buckminster Fuller: Thinking is the Jitterbug transformation from Vector Equilibrium to Tetrahedron.
              </p>
            </div>

            <div>
              <h4 style={{
                ...componentStyles.text.primary,
                fontSize: CosmicTheme.fontSizes.sm,
                color: COLORS.warning,
                marginBottom: CosmicTheme.spacing.sm,
              }}>
                ❤️ Impedance Matching
              </h4>
              <p style={{
                ...componentStyles.text.secondary,
                fontSize: CosmicTheme.fontSizes.xs,
                lineHeight: 1.6,
                margin: 0,
              }}>
                VPI Protocol: Translating engineering precision into relational poetry for perfect communication.
              </p>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}