/**
 * PERFECT ONBOARDING EXPERIENCE - Cognitive Shield
 * Multi-step guided tour with progressive disclosure
 *
 * "From confusion to creation - your journey to quantum development mastery"
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html, Sphere, Tetrahedron, Box, Torus } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import GOD_CONFIG from '../god.config';

// ═══════════════════════════════════════════════════════════════════════════════
// ONBOARDING STEPS CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const ONBOARDING_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to Cognitive Shield',
    subtitle: 'Your Sovereign Development Universe',
    description: 'Step into the future of quantum-secure development. Cognitive Shield unites game engines, quantum primitives, and hardware sovereignty in one beautiful interface.',
    visual: 'universe',
    duration: 8000,
    interactive: false,
    valueProp: 'Complete creative freedom with unbreakable security'
  },
  {
    id: 'quantum_foundation',
    title: 'Quantum Foundations',
    subtitle: 'Tetrahedral Intelligence',
    description: 'Everything begins with the tetrahedron - the fundamental unit of 3D space, quantum measurement, and Fuller\'s synergetic geometry. SIC-POVM measurements verify your creations.',
    visual: 'tetrahedron',
    duration: 10000,
    interactive: true,
    valueProp: 'Mathematical precision meets artistic expression'
  },
  {
    id: 'sovereign_privacy',
    title: 'Sovereign Privacy',
    subtitle: 'Zero-Knowledge Architecture',
    description: 'Your data never leaves your device. Post-quantum cryptography (ML-KEM-768 + X25519) protects your work. Hardware roots your identity in silicon.',
    visual: 'shield',
    duration: 8000,
    interactive: false,
    valueProp: 'Privacy by design, security by mathematics'
  },
  {
    id: 'creative_tools',
    title: 'Creative Arsenal',
    subtitle: 'Unified Development Environment',
    description: 'QG-IDE brings together Godot game engine, Luanti voxel worlds, quantum entanglement bridges, and hardware synthesis - all in your browser.',
    visual: 'tools',
    duration: 12000,
    interactive: true,
    valueProp: 'Every tool you need, nothing you don\'t'
  },
  {
    id: 'first_creation',
    title: 'Your First Creation',
    subtitle: 'Coherence Quest - Quantum Molecule Builder',
    description: 'Experience quantum biology through play. Maintain molecular coherence by balancing entropy and stability. This is quantum physics made tangible.',
    visual: 'quest',
    duration: 15000,
    interactive: true,
    valueProp: 'Learn by doing, create by playing'
  },
  {
    id: 'hardware_integration',
    title: 'Hardware Integration',
    subtitle: 'Physical Roots of Trust',
    description: 'Connect your Phenix Navigator for hardware-secured signing. ESP32 devices provide quantum-resistant communication. Physical silicon anchors digital sovereignty.',
    visual: 'hardware',
    duration: 10000,
    interactive: false,
    valueProp: 'Digital sovereignty meets physical security'
  },
  {
    id: 'ready_to_create',
    title: 'Ready to Create',
    subtitle: 'Your Quantum Development Journey Begins',
    description: 'You now hold the keys to quantum-secure creation. Build games, explore voxel worlds, manipulate quantum states, and push the boundaries of what\'s possible.',
    visual: 'launch',
    duration: 8000,
    interactive: false,
    valueProp: 'The universe is your canvas, mathematics your brush'
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

// Universe visualization with floating elements
function UniverseVisual({ progress }: { progress: number }) {
  return (
    <>
      {/* Animated background spheres */}
      {Array.from({ length: 50 }).map((_, i) => (
        <Sphere
          key={i}
          args={[0.02 + Math.random() * 0.05]}
          position={[
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20
          ]}
        >
          <meshStandardMaterial
            color={new THREE.Color().setHSL(Math.random(), 0.7, 0.6)}
            emissive={new THREE.Color().setHSL(Math.random(), 0.3, 0.2)}
            emissiveIntensity={0.5}
          />
        </Sphere>
      ))}

      {/* Central glowing core */}
      <Sphere args={[0.5]}>
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={0.8 + Math.sin(progress * Math.PI * 2) * 0.3}
        />
      </Sphere>

      {/* Rotating rings */}
      <Torus args={[2, 0.05, 8, 32]}>
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={0.4}
        />
      </Torus>

      <Torus args={[3.5, 0.03, 16, 64]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial
          color="#ec4899"
          emissive="#ec4899"
          emissiveIntensity={0.3}
        />
      </Torus>
    </>
  );
}

// Tetrahedron visualization with quantum effects
function TetrahedronVisual({ progress }: { progress: number }) {
  const meshRef = React.useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group>
      {/* Main tetrahedron */}
      <mesh ref={meshRef}>
        <tetrahedronGeometry args={[2]} />
        <meshStandardMaterial
          color="#22c55e"
          emissive="#22c55e"
          emissiveIntensity={0.3}
          wireframe={progress < 0.5}
          transparent={progress > 0.5}
          opacity={progress > 0.5 ? 0.8 : 1}
        />
      </mesh>

      {/* Quantum measurement points (SIC-POVM) */}
      {[
        [1.5, 1.5, 1.5],
        [-1.5, -1.5, 1.5],
        [-1.5, 1.5, -1.5],
        [1.5, -1.5, -1.5]
      ].map((pos, i) => (
        <Sphere key={i} args={[0.1]} position={pos as [number, number, number]}>
          <meshStandardMaterial
            color="#8b5cf6"
            emissive="#8b5cf6"
            emissiveIntensity={0.8 + Math.sin(progress * Math.PI * 4 + i) * 0.4}
          />
        </Sphere>
      ))}

      {/* Connection lines */}
      <group>
        {[
          [[1.5, 1.5, 1.5], [-1.5, -1.5, 1.5]],
          [[1.5, 1.5, 1.5], [-1.5, 1.5, -1.5]],
          [[1.5, 1.5, 1.5], [1.5, -1.5, -1.5]],
          [[-1.5, -1.5, 1.5], [-1.5, 1.5, -1.5]],
          [[-1.5, -1.5, 1.5], [1.5, -1.5, -1.5]],
          [[-1.5, 1.5, -1.5], [1.5, -1.5, -1.5]]
        ].map(([start, end], i) => (
          <line key={i}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([...start, ...end])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial
              color="#06b6d4"
              opacity={progress > 0.3 ? 0.6 : 0}
              transparent
            />
          </line>
        ))}
      </group>
    </group>
  );
}

// Shield visualization with security elements
function ShieldVisual({ progress }: { progress: number }) {
  return (
    <group>
      {/* Main shield */}
      <Box args={[3, 4, 0.2]} position={[0, 0, -1]}>
        <meshStandardMaterial
          color="#ef4444"
          emissive="#ef4444"
          emissiveIntensity={0.2}
          transparent
          opacity={0.8}
        />
      </Box>

      {/* Lock symbols */}
      <group position={[0, 0.5, 0]}>
        <Torus args={[0.3, 0.05, 8, 16]}>
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
        </Torus>
        <Box args={[0.4, 0.3, 0.1]} position={[0, -0.3, 0]}>
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
        </Box>
      </group>

      {/* Encryption particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <Sphere
          key={i}
          args={[0.02]}
          position={[
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 2
          ]}
        >
          <meshStandardMaterial
            color={progress > 0.5 ? "#22c55e" : "#8b5cf6"}
            emissive={progress > 0.5 ? "#22c55e" : "#8b5cf6"}
            emissiveIntensity={0.6}
          />
        </Sphere>
      ))}
    </group>
  );
}

// Tools visualization showing the creative arsenal
function ToolsVisual({ progress }: { progress: number }) {
  const tools = [
    { name: 'QG-IDE', color: '#8b5cf6', position: [-3, 2, 0] },
    { name: 'Godot', color: '#06b6d4', position: [0, 2, 0] },
    { name: 'Luanti', color: '#22c55e', position: [3, 2, 0] },
    { name: 'Hardware', color: '#ef4444', position: [-3, -2, 0] },
    { name: 'Quantum', color: '#ec4899', position: [0, -2, 0] },
    { name: 'PQC', color: '#fbbf24', position: [3, -2, 0] }
  ];

  return (
    <group>
      {tools.map((tool, i) => {
        const activationTime = i * 0.15;
        const isActive = progress > activationTime;

        return (
          <group key={tool.name} position={tool.position as [number, number, number]}>
            <Box
              args={[1, 1, 0.2]}
              scale={isActive ? [1, 1, 1] : [0.1, 0.1, 0.1]}
            >
              <meshStandardMaterial
                color={tool.color}
                emissive={tool.color}
                emissiveIntensity={isActive ? 0.4 : 0}
                transparent={!isActive}
                opacity={isActive ? 1 : 0}
              />
            </Box>
            {isActive && (
              <Html position={[0, -1.5, 0]}>
                <div style={{
                  color: tool.color,
                  fontSize: '14px',
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}>
                  {tool.name}
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}

// Quest visualization for the coherence game
function QuestVisual({ progress }: { progress: number }) {
  return (
    <group>
      {/* Central molecule */}
      <Sphere args={[0.5]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={0.6}
        />
      </Sphere>

      {/* Calcium atoms */}
      {Array.from({ length: 9 }).map((_, i) => {
        const angle = (i / 9) * Math.PI * 2;
        const radius = 1.5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = (i % 2 === 0 ? 0.5 : -0.5);

        return (
          <Sphere
            key={`ca-${i}`}
            args={[0.15]}
            position={[x, y, z]}
          >
            <meshStandardMaterial
              color="#22c55e"
              emissive="#22c55e"
              emissiveIntensity={0.4}
            />
          </Sphere>
        );
      })}

      {/* Phosphate groups */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2 + Math.PI / 6;
        const radius = 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <Tetrahedron
            key={`po4-${i}`}
            args={[0.3]}
            position={[x, 0, z]}
          >
            <meshStandardMaterial
              color="#ec4899"
              emissive="#ec4899"
              emissiveIntensity={0.3}
            />
          </Tetrahedron>
        );
      })}

      {/* Coherence aura */}
      <Sphere args={[3]}>
        <meshBasicMaterial
          color="#06b6d4"
          transparent
          opacity={0.1 + progress * 0.2}
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  );
}

// Hardware visualization
function HardwareVisual({ progress }: { progress: number }) {
  return (
    <group>
      {/* ESP32 board */}
      <Box args={[2, 1, 0.1]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#10b981" />
      </Box>

      {/* Antenna */}
      <Box args={[0.1, 2, 0.1]} position={[0.8, 1, 0]}>
        <meshStandardMaterial color="#6b7280" />
      </Box>

      {/* LEDs */}
      {[
        [-0.5, 0.3, 0.06],
        [-0.2, 0.3, 0.06],
        [0.2, 0.3, 0.06],
        [0.5, 0.3, 0.06]
      ].map((pos, i) => (
        <Sphere key={i} args={[0.05]} position={pos as [number, number, number]}>
          <meshStandardMaterial
            color={progress > 0.5 ? "#22c55e" : "#ef4444"}
            emissive={progress > 0.5 ? "#22c55e" : "#ef4444"}
            emissiveIntensity={0.8}
          />
        </Sphere>
      ))}

      {/* USB connection */}
      <Box args={[0.3, 0.1, 0.2]} position={[-1, -0.3, 0]}>
        <meshStandardMaterial color="#374151" />
      </Box>
    </group>
  );
}

// Launch visualization
function LaunchVisual({ progress }: { progress: number }) {
  return (
    <group>
      {/* Central creation sphere */}
      <Sphere args={[1]}>
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={0.5 + progress * 0.5}
        />
      </Sphere>

      {/* Expanding rings */}
      {[2, 3, 4, 5].map((radius, i) => (
        <Torus
          key={i}
          args={[radius, 0.05, 8, 32]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <meshStandardMaterial
            color="#06b6d4"
            emissive="#06b6d4"
            emissiveIntensity={0.3}
            transparent
            opacity={(4 - i) / 4}
          />
        </Torus>
      ))}

      {/* Creation particles */}
      {Array.from({ length: 30 }).map((_, i) => {
        const angle = (i / 30) * Math.PI * 2;
        const radius = 3 + Math.sin(progress * Math.PI * 2 + angle) * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(progress * Math.PI * 4 + angle) * 1;

        return (
          <Sphere
            key={i}
            args={[0.05]}
            position={[x, y, z]}
          >
            <meshStandardMaterial
              color={new THREE.Color().setHSL((i / 30), 0.8, 0.6)}
              emissive={new THREE.Color().setHSL((i / 30), 0.6, 0.4)}
              emissiveIntensity={0.6}
            />
          </Sphere>
        );
      })}
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN ONBOARDING COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface PerfectOnboardingProps {
  onComplete?: () => void;
  onNavigateToCoherenceQuest?: () => void;
}

export default function PerfectOnboarding({ onComplete, onNavigateToCoherenceQuest }: PerfectOnboardingProps = {}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showSkip, setShowSkip] = useState(false);

  const currentStepData = ONBOARDING_STEPS[currentStep];
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

  // Auto-progress through steps
  useEffect(() => {
    if (!isPlaying) return;

    const stepDuration = currentStepData.duration;
    let startTime = Date.now();
    let animationFrame: number;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const stepProgress = Math.min(elapsed / stepDuration, 1);
      setProgress(stepProgress);

      if (stepProgress >= 1) {
        if (isLastStep) {
          // Onboarding complete
          setTimeout(() => {
            onComplete?.();
          }, 2000);
        } else {
          // Move to next step
          setCurrentStep(prev => prev + 1);
          setProgress(0);
          startTime = Date.now();
        }
      } else {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [currentStep, isPlaying, isLastStep, currentStepData.duration]);

  // Show skip option after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowSkip(true), 3000);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const handleNext = useCallback(() => {
    if (isLastStep) {
      onComplete?.();
    } else {
      setCurrentStep(prev => prev + 1);
      setProgress(0);
    }
  }, [isLastStep, onComplete]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setProgress(0);
    }
  }, [currentStep]);

  const handleSkip = useCallback(() => {
    onComplete?.();
  }, [onComplete]);

  const handlePause = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const renderVisual = () => {
    const props = { progress };

    switch (currentStepData.visual) {
      case 'universe': return <UniverseVisual {...props} />;
      case 'tetrahedron': return <TetrahedronVisual {...props} />;
      case 'shield': return <ShieldVisual {...props} />;
      case 'tools': return <ToolsVisual {...props} />;
      case 'quest': return <QuestVisual {...props} />;
      case 'hardware': return <HardwareVisual {...props} />;
      case 'launch': return <LaunchVisual {...props} />;
      default: return <UniverseVisual {...props} />;
    }
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: `linear-gradient(135deg, ${GOD_CONFIG.theme.bg.primary} 0%, #0f0f23 100%)`,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* 3D Canvas Background */}
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1
        }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.4} color="#8b5cf6" />
        {renderVisual()}
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate={currentStepData.visual !== 'quest'}
          autoRotateSpeed={0.5}
        />
      </Canvas>

      {/* UI Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem'
      }}>
        {/* Progress Indicator */}
        <div style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          right: '2rem',
          zIndex: 20
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {ONBOARDING_STEPS.map((_, index) => (
                <div
                  key={index}
                  style={{
                    width: '2rem',
                    height: '0.25rem',
                    borderRadius: '0.125rem',
                    backgroundColor: index <= currentStep
                      ? (index === currentStep ? '#8b5cf6' : '#22c55e')
                      : '#374151',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </div>

            <AnimatePresence>
              {showSkip && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={handleSkip}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: '#9ca3af',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    backdropFilter: 'blur(8px)'
                  }}
                >
                  Skip Tour
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Step Progress Bar */}
          <div style={{
            width: '100%',
            height: '0.25rem',
            backgroundColor: 'rgba(0,0,0,0.3)',
            borderRadius: '0.125rem',
            overflow: 'hidden'
          }}>
            <motion.div
              style={{
                height: '100%',
                backgroundColor: '#8b5cf6',
                borderRadius: '0.125rem'
              }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>

        {/* Main Content */}
        <div style={{
          textAlign: 'center',
          maxWidth: '800px',
          zIndex: 20,
          backdropFilter: 'blur(16px)',
          backgroundColor: 'rgba(0,0,0,0.7)',
          padding: '3rem',
          borderRadius: '1rem',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}>
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h1 style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              background: `linear-gradient(135deg, ${GOD_CONFIG.theme.text.primary}, #8b5cf6)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '0.5rem'
            }}>
              {currentStepData.title}
            </h1>

            <h2 style={{
              fontSize: '1.5rem',
              color: '#8b5cf6',
              marginBottom: '1.5rem',
              fontWeight: '500'
            }}>
              {currentStepData.subtitle}
            </h2>

            <p style={{
              fontSize: '1.25rem',
              color: '#d1d5db',
              lineHeight: '1.6',
              marginBottom: '2rem',
              maxWidth: '600px',
              margin: '0 auto 2rem auto'
            }}>
              {currentStepData.description}
            </p>

            <div style={{
              fontSize: '1.125rem',
              color: '#22c55e',
              fontWeight: '600',
              padding: '1rem',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              borderRadius: '0.5rem',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              marginBottom: '2rem'
            }}>
              💡 {currentStepData.valueProp}
            </div>

            {/* Interactive Elements */}
            {currentStepData.interactive && (
              <div style={{
                marginBottom: '2rem',
                padding: '1.5rem',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                borderRadius: '0.75rem',
                border: '1px solid rgba(139, 92, 246, 0.3)'
              }}>
                {currentStep === 1 && (
                  <div>
                    <p style={{ color: '#d1d5db', marginBottom: '1rem' }}>
                      Try rotating the tetrahedron with your mouse to explore quantum measurement points!
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                      <button
                        onClick={handlePause}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#8b5cf6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.5rem',
                          cursor: 'pointer'
                        }}
                      >
                        {isPlaying ? 'Pause' : 'Play'} Animation
                      </button>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div>
                    <p style={{ color: '#d1d5db', marginBottom: '1rem' }}>
                      Each tool activates as you progress - this is your complete creative arsenal!
                    </p>
                  </div>
                )}

                {currentStep === 4 && (
                  <div>
                    <p style={{ color: '#d1d5db', marginBottom: '1rem' }}>
                      Ready to try the Coherence Quest? This quantum molecule builder teaches through play.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                      <button
                        onClick={() => onNavigateToCoherenceQuest?.()}
                        style={{
                          padding: '0.75rem 1.5rem',
                          backgroundColor: '#22c55e',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.5rem',
                          cursor: 'pointer',
                          fontSize: '1rem',
                          fontWeight: '600'
                        }}
                      >
                        🚀 Try Coherence Quest Now
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center' }}>
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: currentStep === 0 ? '#374151' : '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                  opacity: currentStep === 0 ? 0.5 : 1
                }}
              >
                ← Previous
              </button>

              <div style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'rgba(139, 92, 246, 0.2)',
                color: '#8b5cf6',
                borderRadius: '0.5rem',
                fontWeight: '600'
              }}>
                {currentStep + 1} of {ONBOARDING_STEPS.length}
              </div>

              <button
                onClick={handleNext}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: isLastStep ? '#22c55e' : '#8b5cf6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                {isLastStep ? '🚀 Begin Creating' : 'Next →'}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          left: '2rem',
          right: '2rem',
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '0.875rem',
          zIndex: 20
        }}>
          <p>
            Press <kbd style={{ padding: '0.125rem 0.375rem', backgroundColor: '#374151', borderRadius: '0.25rem' }}>space</kbd> to pause/resume •
            Use mouse to explore 3D visualizations •
            Cognitive Shield v1.0.0
          </p>
        </div>
      </div>

      {/* Keyboard Controls */}
      <div
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === ' ') {
            e.preventDefault();
            handlePause();
          } else if (e.key === 'ArrowLeft') {
            handlePrevious();
          } else if (e.key === 'ArrowRight') {
            handleNext();
          } else if (e.key === 'Escape') {
            handleSkip();
          }
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0
        }}
      />
    </div>
  );
}