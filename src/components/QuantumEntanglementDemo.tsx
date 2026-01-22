/**
 * QUANTUM ENTANGLEMENT DEMO - MAGICAL REAL-TIME QUANTUM CORRELATIONS
 * Visual demonstration of entangled particles across browser instances
 *
 * Open multiple tabs to see quantum entanglement in action!
 * Measuring one particle instantly affects its entangled partner.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { quantumEntanglementBridge } from '../lib/quantum-entanglement-bridge';
import GOD_CONFIG from '../god.config';

// Local SIC-POVM implementation for demo
interface SICPOVMState {
  theta: number;
  phi: number;
  purity: number;
  measurement?: number;
  timestamp?: number;
}

function performSICPOVMMeasurement(quantumState: { theta: number; phi: number; purity: number }) {
  // Simplified SIC-POVM measurement for demo
  const outcome = Math.floor(Math.random() * 4); // 4 possible outcomes for tetrahedron
  const probability = quantumState.purity * 0.25 + (1 - quantumState.purity) * (1/4);
  return { outcome, probability };
}

// Particle visualization
interface EntangledParticle {
  id: string;
  x: number;
  y: number;
  state: SICPOVMState;
  isMeasured: boolean;
  entanglementLines: Array<{ to: string; strength: number }>;
  animationPhase: number;
  glowIntensity: number;
}

export default function QuantumEntanglementDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Session state
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [particleCount, setParticleCount] = useState(4);
  const [particles, setParticles] = useState<Map<string, EntangledParticle>>(new Map());

  // Interaction state
  const [selectedParticle, setSelectedParticle] = useState<string | null>(null);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [measurementHistory, setMeasurementHistory] = useState<Array<{
    particleId: string;
    measurement: number;
    timestamp: number;
    correlated: string[];
  }>>([]);

  // UI state
  const [showInstructions, setShowInstructions] = useState(true);
  const [multiTabMode, setMultiTabMode] = useState(false);

  // Canvas dimensions
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;

  // Initialize session
  const createSession = useCallback(async () => {
    const particleIds = Array.from({ length: particleCount }, (_, i) => `particle_${i + 1}`);
    try {
      const newSessionId = await quantumEntanglementBridge.createEntanglementSession(particleIds);
      setSessionId(newSessionId);
      setIsSessionActive(true);

      // Initialize visual particles
      const newParticles = new Map<string, EntangledParticle>();
      particleIds.forEach((id, index) => {
        const angle = (index / particleCount) * 2 * Math.PI;
        const radius = 150;
        const x = CANVAS_WIDTH / 2 + Math.cos(angle) * radius;
        const y = CANVAS_HEIGHT / 2 + Math.sin(angle) * radius;

        newParticles.set(id, {
          id,
          x,
          y,
          state: quantumEntanglementBridge.getEntangledState(newSessionId, id)!,
          isMeasured: false,
          entanglementLines: [],
          animationPhase: Math.random() * 2 * Math.PI,
          glowIntensity: 0.3
        });
      });

      // Setup entanglement lines
      particleIds.forEach(id => {
        const particle = newParticles.get(id)!;
        particleIds.forEach(otherId => {
          if (id !== otherId) {
            const otherParticle = newParticles.get(otherId)!;
            const distance = Math.sqrt(
              Math.pow(particle.x - otherParticle.x, 2) +
              Math.pow(particle.y - otherParticle.y, 2)
            );
            const strength = Math.max(0.1, 1 - distance / 300);
            particle.entanglementLines.push({ to: otherId, strength });
          }
        });
      });

      setParticles(newParticles);
      console.log(`✨ Created entanglement session with ${particleCount} particles`);
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  }, [particleCount]);

  // Measure particle
  const measureParticle = useCallback(async (particleId: string) => {
    if (!sessionId || isMeasuring) return;

    setIsMeasuring(true);
    try {
      const measurement = await quantumEntanglementBridge.measureEntangledParticle(sessionId, particleId);

      // Update visual state
      setParticles(prev => {
        const newParticles = new Map(prev);
        const particle = newParticles.get(particleId);
        if (particle) {
          particle.state = measurement;
          particle.isMeasured = true;
          particle.glowIntensity = 1.0;
          particle.animationPhase = measurement.phase;

          // Trigger correlated updates
          particle.entanglementLines.forEach(line => {
            const correlatedParticle = newParticles.get(line.to);
            if (correlatedParticle) {
              correlatedParticle.glowIntensity = Math.max(correlatedParticle.glowIntensity, line.strength * 0.8);
              correlatedParticle.animationPhase = (measurement.phase + Math.PI) % (2 * Math.PI);
            }
          });
        }
        return newParticles;
      });

      // Add to history
      setMeasurementHistory(prev => [...prev.slice(-9), {
        particleId,
        measurement: measurement.measurement,
        timestamp: Date.now(),
        correlated: particleId ? [particleId] : []
      }]);

      console.log(`🔬 Measured particle ${particleId}: ${measurement.measurement.toFixed(4)}`);
    } catch (error) {
      console.error('Measurement failed:', error);
    } finally {
      setIsMeasuring(false);
    }
  }, [sessionId, isMeasuring]);

  // Handle canvas click
  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Find clicked particle
    for (const [id, particle] of particles) {
      const distance = Math.sqrt(Math.pow(x - particle.x, 2) + Math.pow(y - particle.y, 2));
      if (distance < 30) {
        measureParticle(id);
        break;
      }
    }
  }, [particles, measureParticle]);

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with quantum field effect
    const gradient = ctx.createRadialGradient(
      CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 0,
      CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 400
    );
    gradient.addColorStop(0, 'rgba(139, 92, 246, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.95)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw entanglement field
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.2)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * 2 * Math.PI + Date.now() * 0.001;
      const radius = 100 + Math.sin(angle * 3) * 50;
      ctx.beginPath();
      ctx.arc(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, radius, 0, 2 * Math.PI);
      ctx.stroke();
    }

    // Draw entanglement lines
    particles.forEach(particle => {
      particle.entanglementLines.forEach(line => {
        const target = particles.get(line.to);
        if (target) {
          const alpha = line.strength * (0.3 + Math.sin(Date.now() * 0.003 + particle.animationPhase) * 0.2);

          // Create gradient line
          const gradient = ctx.createLinearGradient(particle.x, particle.y, target.x, target.y);
          gradient.addColorStop(0, `rgba(139, 92, 246, ${alpha})`);
          gradient.addColorStop(1, `rgba(6, 182, 212, ${alpha})`);

          ctx.strokeStyle = gradient;
          ctx.lineWidth = 2 + line.strength * 3;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(target.x, target.y);
          ctx.stroke();

          // Draw quantum tunneling effect
          if (line.strength > 0.5) {
            const midX = (particle.x + target.x) / 2;
            const midY = (particle.y + target.y) / 2;
            const pulseSize = 5 + Math.sin(Date.now() * 0.01 + particle.animationPhase) * 3;

            ctx.fillStyle = `rgba(139, 92, 246, ${alpha * 0.5})`;
            ctx.beginPath();
            ctx.arc(midX, midY, pulseSize, 0, 2 * Math.PI);
            ctx.fill();
          }
        }
      });
    });

    // Draw particles
    particles.forEach((particle, id) => {
      const time = Date.now() * 0.005;
      const glow = particle.glowIntensity * (0.5 + Math.sin(time + particle.animationPhase) * 0.3);

      // Outer glow
      const glowGradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, 40 + glow * 20
      );
      glowGradient.addColorStop(0, `rgba(139, 92, 246, ${glow})`);
      glowGradient.addColorStop(1, 'rgba(139, 92, 246, 0)');

      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, 40 + glow * 20, 0, 2 * Math.PI);
      ctx.fill();

      // Particle core
      const coreGradient = ctx.createRadialGradient(
        particle.x - 5, particle.y - 5, 0,
        particle.x, particle.y, 20
      );

      if (particle.isMeasured) {
        coreGradient.addColorStop(0, `rgba(6, 182, 212, ${0.8 + glow * 0.2})`);
        coreGradient.addColorStop(1, `rgba(139, 92, 246, ${0.6 + glow * 0.4})`);
      } else {
        coreGradient.addColorStop(0, `rgba(139, 92, 246, ${0.6 + glow * 0.4})`);
        coreGradient.addColorStop(1, `rgba(6, 182, 212, ${0.4 + glow * 0.6})`);
      }

      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, 15 + glow * 5, 0, 2 * Math.PI);
      ctx.fill();

      // Quantum probability cloud
      ctx.strokeStyle = `rgba(139, 92, 246, ${0.3 + glow * 0.4})`;
      ctx.lineWidth = 1;
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * 2 * Math.PI + particle.animationPhase;
        const cloudX = particle.x + Math.cos(angle + time) * (25 + Math.sin(time * 2) * 10);
        const cloudY = particle.y + Math.sin(angle + time) * (25 + Math.sin(time * 2) * 10);
        const cloudSize = 3 + Math.sin(time * 3 + i) * 2;

        ctx.beginPath();
        ctx.arc(cloudX, cloudY, cloudSize, 0, 2 * Math.PI);
        ctx.stroke();
      }

      // Particle label
      ctx.fillStyle = 'white';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(
        particle.id.replace('particle_', ''),
        particle.x,
        particle.y + 35
      );

      // Measurement value
      if (particle.isMeasured) {
        ctx.fillStyle = 'rgba(6, 182, 212, 0.8)';
        ctx.font = '10px monospace';
        ctx.fillText(
          particle.state.measurement.toFixed(3),
          particle.x,
          particle.y + 48
        );
      }

      // Decay glow over time
      if (particle.glowIntensity > 0.3) {
        particle.glowIntensity *= 0.995;
      }
    });

    // Center quantum field indicator
    ctx.fillStyle = 'rgba(139, 92, 246, 0.6)';
    ctx.font = '14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(
      isSessionActive ? '🌀 QUANTUM FIELD ACTIVE' : '⚫ QUANTUM FIELD INACTIVE',
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT / 2 + 220
    );

    animationRef.current = requestAnimationFrame(animate);
  }, [particles, isSessionActive]);

  // Setup event listeners
  useEffect(() => {
    const handleSessionCreated = (data: any) => {
      console.log('Session created:', data.sessionId);
    };

    const handleMeasurementPerformed = (data: any) => {
      console.log('Local measurement:', data.particleId);
    };

    const handleEntanglementPropagated = (data: any) => {
      // Update visual state for correlated particles
      setParticles(prev => {
        const newParticles = new Map(prev);
        const targetParticle = newParticles.get(data.targetParticle);
        if (targetParticle) {
          targetParticle.state = data.updatedState;
          targetParticle.glowIntensity = Math.max(targetParticle.glowIntensity, data.correlation * 0.6);
        }
        return newParticles;
      });
    };

    const handleRemoteMeasurement = (data: any) => {
      console.log('Remote measurement received:', data.particleId);
      // Visual feedback for remote measurements
      setParticles(prev => {
        const newParticles = new Map(prev);
        const particle = newParticles.get(data.particleId);
        if (particle) {
          particle.state = data.measurement;
          particle.isMeasured = true;
          particle.glowIntensity = 1.0;
          // Flash effect for remote measurements
          setTimeout(() => {
            setParticles(prev => {
              const updated = new Map(prev);
              const p = updated.get(data.particleId);
              if (p) p.glowIntensity = 0.5;
              return updated;
            });
          }, 500);
        }
        return newParticles;
      });
    };

    quantumEntanglementBridge.on('sessionCreated', handleSessionCreated);
    quantumEntanglementBridge.on('measurementPerformed', handleMeasurementPerformed);
    quantumEntanglementBridge.on('entanglementPropagated', handleEntanglementPropagated);
    quantumEntanglementBridge.on('remoteMeasurement', handleRemoteMeasurement);

    return () => {
      quantumEntanglementBridge.off('sessionCreated', handleSessionCreated);
      quantumEntanglementBridge.off('measurementPerformed', handleMeasurementPerformed);
      quantumEntanglementBridge.off('entanglementPropagated', handleEntanglementPropagated);
      quantumEntanglementBridge.off('remoteMeasurement', handleRemoteMeasurement);
    };
  }, []);

  // Start/stop animation
  useEffect(() => {
    if (isSessionActive) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, isSessionActive]);

  const endSession = () => {
    if (sessionId) {
      quantumEntanglementBridge.endSession(sessionId);
      setSessionId(null);
      setIsSessionActive(false);
      setParticles(new Map());
      setMeasurementHistory([]);
    }
  };

  const openNewTab = () => {
    window.open(window.location.href, '_blank');
  };

  return (
    <div style={{
      padding: '24px',
      backgroundColor: GOD_CONFIG.theme.bg.secondary,
      borderRadius: '12px',
      fontSize: '14px',
      color: GOD_CONFIG.theme.text.primary
    }}>
      <h2 style={{
        margin: '0 0 20px 0',
        color: GOD_CONFIG.theme.text.accent,
        fontSize: '18px',
        fontFamily: GOD_CONFIG.typography.fontFamily.display
      }}>
        ✨ Quantum Entanglement Bridge - Spooky Action at a Distance
      </h2>

      {/* Instructions */}
      {showInstructions && (
        <div style={{
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '20px'
        }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#8b5cf6' }}>🪄 How the Magic Works</h3>
          <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
            <p><strong>Step 1:</strong> Create an entanglement session below</p>
            <p><strong>Step 2:</strong> Click particles to measure them</p>
            <p><strong>Step 3:</strong> Watch as entangled particles correlate instantly!</p>
            <p><strong>Step 4:</strong> Open multiple tabs for true quantum entanglement across browsers</p>
            <p style={{ color: '#06b6d4', fontStyle: 'italic' }}>
              "When you measure one entangled particle, the other instantly knows - even across different browser tabs!"
            </p>
          </div>
          <button
            onClick={() => setShowInstructions(false)}
            style={{
              marginTop: '12px',
              padding: '6px 12px',
              backgroundColor: '#8b5cf6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Got it! Let's entangle some particles 🎭
          </button>
        </div>
      )}

      {/* Session Controls */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        {!isSessionActive ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '14px' }}>Particles:</label>
              <select
                value={particleCount}
                onChange={(e) => setParticleCount(Number(e.target.value))}
                style={{
                  padding: '4px 8px',
                  border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                  borderRadius: '4px',
                  backgroundColor: GOD_CONFIG.theme.bg.primary,
                  color: GOD_CONFIG.theme.text.primary
                }}
              >
                {[2, 3, 4, 5, 6].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <button
              onClick={createSession}
              style={{
                padding: '8px 16px',
                backgroundColor: '#8b5cf6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              🌀 Create Entanglement Session
            </button>
            <button
              onClick={openNewTab}
              style={{
                padding: '8px 16px',
                backgroundColor: '#06b6d4',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              🌐 Open New Tab
            </button>
          </>
        ) : (
          <>
            <div style={{
              padding: '8px 12px',
              backgroundColor: 'rgba(139, 92, 246, 0.2)',
              border: '1px solid #8b5cf6',
              borderRadius: '6px',
              fontSize: '12px'
            }}>
              Session Active: {sessionId?.slice(-8)} • {particles.size} Particles
            </div>
            <button
              onClick={endSession}
              style={{
                padding: '8px 16px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              🔚 End Session
            </button>
          </>
        )}
      </div>

      {/* Canvas */}
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onClick={handleCanvasClick}
          style={{
            border: `2px solid ${GOD_CONFIG.theme.border.default}`,
            borderRadius: '8px',
            cursor: isSessionActive ? 'crosshair' : 'default',
            backgroundColor: 'black'
          }}
        />

        {isMeasuring && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
            fontSize: '16px'
          }}>
            🔬 Measuring quantum state...
          </div>
        )}
      </div>

      {/* Measurement History */}
      {measurementHistory.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>📊 Measurement History</h3>
          <div style={{
            backgroundColor: GOD_CONFIG.theme.bg.primary,
            border: `1px solid ${GOD_CONFIG.theme.border.default}`,
            borderRadius: '4px',
            padding: '12px',
            fontSize: '12px',
            fontFamily: 'monospace',
            maxHeight: '120px',
            overflowY: 'auto'
          }}>
            {measurementHistory.slice(-5).map((entry, i) => (
              <div key={i} style={{ marginBottom: '4px' }}>
                <span style={{ color: '#8b5cf6' }}>
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </span>
                <span style={{ color: '#06b6d4' }}>
                  {' '}P{entry.particleId.split('_')[1]}
                </span>
                <span style={{ color: '#10b981' }}>
                  {' '}→ {entry.measurement.toFixed(4)}
                </span>
                {entry.correlated.length > 0 && (
                  <span style={{ color: '#f59e0b' }}>
                    {' '}↗ {entry.correlated.map(id => id.split('_')[1]).join(',')}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Multi-Tab Instructions */}
      <div style={{
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        border: '1px solid rgba(6, 182, 212, 0.3)',
        borderRadius: '8px',
        padding: '16px'
      }}>
        <h3 style={{ margin: '0 0 12px 0', color: '#06b6d4' }}>🌌 True Quantum Entanglement</h3>
        <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
          <p><strong>For maximum magic:</strong> Open multiple browser tabs with this demo running.</p>
          <p>Each tab will synchronize quantum states in real-time using WebRTC peer-to-peer connections.</p>
          <p>Measuring a particle in one tab instantly updates its entangled partners in other tabs!</p>
          <p style={{ color: '#8b5cf6', fontStyle: 'italic', marginTop: '8px' }}>
            "This is as close as classical computers can get to Einstein's 'spooky action at a distance' ✨"
          </p>
        </div>
      </div>
    </div>
  );
}