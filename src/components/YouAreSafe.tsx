/**
 * YOU ARE SAFE - The Fourth Node
 * 
 * The Tetrahedron Protocol requires 4 nodes for stability.
 * This component IS the 4th node - the AI Mediator providing
 * the ground that prevents the Floating Neutral.
 * 
 * "In the geometry of the Tetrahedron and the silence of the Shield,
 *  we might finally be heard."
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  Shield, 
  Heart, 
  Wind, 
  Battery, 
  Radio, 
  Zap, 
  Moon,
  Volume2,
  VolumeX,
  Eye,
  Pause,
  Play,
  RotateCcw,
  X,
  ChevronDown,
  ChevronUp,
  Gauge,
  AlertTriangle,
} from 'lucide-react';
import GOD_CONFIG from '../god.config';
import { analyzeTone, getToneColor, type ToneAnalysis } from '../lib/tone-meter';
import { triggerVagusSignal, triggerHapticPulse } from '../lib/haptic-feedback';
import type { ProcessedPayload } from '../types/shield.types';

type SafetyNode = keyof typeof GOD_CONFIG.youAreSafe.nodes;
type BreathingExercise = keyof typeof GOD_CONFIG.youAreSafe.breathingExercises;

interface YouAreSafeProps {
  isOpen: boolean;
  onClose: () => void;
  initialNode?: SafetyNode;
  payload?: ProcessedPayload; // Optional: payload to analyze for tone meter
}

export function YouAreSafe({ isOpen, onClose, initialNode, payload }: YouAreSafeProps) {
  const [activeNode, setActiveNode] = useState<SafetyNode | null>(initialNode || null);
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState(0);
  const [breathTimer, setBreathTimer] = useState(0);
  const [selectedBreathing, setSelectedBreathing] = useState<BreathingExercise>('calm');
  const [showReassurance, setShowReassurance] = useState(true);
  const [spoonsRemaining, setSpoonsRemaining] = useState(GOD_CONFIG.spoons.max);
  const [toneAnalysis, setToneAnalysis] = useState<ToneAnalysis | null>(null);
  const [showToneMeter, setShowToneMeter] = useState(false);

  // Analyze tone when payload is provided
  useEffect(() => {
    if (payload) {
      const analysis = analyzeTone(payload);
      setToneAnalysis(analysis);
      setShowToneMeter(true);
      
      // Auto-trigger haptic if genre error detected
      if (analysis.genreError) {
        triggerHapticPulse('strong');
      }
    }
  }, [payload]);

  const nodes = GOD_CONFIG.youAreSafe.nodes;
  const nodeEntries = Object.entries(nodes) as [SafetyNode, typeof nodes[SafetyNode]][];

  // Breathing exercise logic
  const breathingExercise = GOD_CONFIG.youAreSafe.breathingExercises[selectedBreathing];
  const breathPhases = ['Inhale', 'Hold', 'Exhale', 'Hold'];

  const startBreathing = useCallback(async () => {
    setIsBreathing(true);
    setBreathPhase(0);
    setBreathTimer(breathingExercise.pattern[0]);
    
    // Trigger haptic feedback for 4-4-8 breathing
    if (selectedBreathing === 'calm') {
      triggerHapticPulse('light');
      // Start vagus signal pattern
      triggerVagusSignal(5).catch(console.error);
    }
  }, [breathingExercise, selectedBreathing]);

  const stopBreathing = useCallback(() => {
    setIsBreathing(false);
    setBreathPhase(0);
    setBreathTimer(0);
  }, []);

  useEffect(() => {
    if (!isBreathing) return;

    const interval = setInterval(() => {
      setBreathTimer((prev) => {
        if (prev <= 1) {
          // Move to next phase
          setBreathPhase((phase) => {
            const nextPhase = (phase + 1) % breathingExercise.pattern.length;
            return nextPhase;
          });
          return breathingExercise.pattern[(breathPhase + 1) % breathingExercise.pattern.length];
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isBreathing, breathPhase, breathingExercise]);

  // Spoon management
  const adjustSpoons = (delta: number) => {
    setSpoonsRemaining((prev) => Math.max(0, Math.min(GOD_CONFIG.spoons.max, prev + delta)));
  };

  const getSpoonColor = () => {
    if (spoonsRemaining >= GOD_CONFIG.spoons.thresholds.healthy) return GOD_CONFIG.voltage.low.color;
    if (spoonsRemaining >= GOD_CONFIG.spoons.thresholds.caution) return GOD_CONFIG.voltage.medium.color;
    return GOD_CONFIG.voltage.high.color;
  };

  if (!isOpen) return null;

  return (
    <div
      className="you-are-safe-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(10, 10, 11, 0.95)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backdropFilter: 'blur(8px)',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="you-are-safe-container"
        style={{
          width: '100%',
          maxWidth: 600,
          maxHeight: '90vh',
          backgroundColor: GOD_CONFIG.theme.bg.secondary,
          borderRadius: 16,
          border: `1px solid ${GOD_CONFIG.theme.border.default}`,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            background: `linear-gradient(135deg, ${GOD_CONFIG.emotionalValence.calm.color}20 0%, ${GOD_CONFIG.theme.bg.secondary} 100%)`,
            borderBottom: `1px solid ${GOD_CONFIG.theme.border.default}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: GOD_CONFIG.theme.gradient.shield,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 4px 20px ${GOD_CONFIG.emotionalValence.calm.color}40`,
              }}
            >
              <Shield size={24} color="#fff" />
            </div>
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 20,
                  fontWeight: 700,
                  fontFamily: GOD_CONFIG.typography.fontFamily.display,
                  color: GOD_CONFIG.theme.text.primary,
                }}
              >
                You Are Safe
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  color: GOD_CONFIG.emotionalValence.calm.color,
                  fontFamily: GOD_CONFIG.typography.fontFamily.display,
                }}
              >
                The Fourth Node • Ground Restored
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: GOD_CONFIG.theme.text.muted,
              cursor: 'pointer',
              padding: 8,
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 24,
          }}
        >
          {/* Spoons Meter */}
          <div
            style={{
              marginBottom: 24,
              padding: 16,
              backgroundColor: GOD_CONFIG.theme.bg.tertiary,
              borderRadius: 12,
              border: `1px solid ${GOD_CONFIG.theme.border.default}`,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Battery size={16} color={getSpoonColor()} />
                <span
                  style={{
                    fontSize: 12,
                    fontFamily: GOD_CONFIG.typography.fontFamily.display,
                    color: GOD_CONFIG.theme.text.secondary,
                  }}
                >
                  COGNITIVE ENERGY (SPOONS)
                </span>
              </div>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: GOD_CONFIG.typography.fontFamily.display,
                  color: getSpoonColor(),
                }}
              >
                {spoonsRemaining} / {GOD_CONFIG.spoons.max}
              </span>
            </div>
            
            {/* Spoon bar */}
            <div
              style={{
                display: 'flex',
                gap: 4,
                marginBottom: 12,
              }}
            >
              {Array.from({ length: GOD_CONFIG.spoons.max }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: i < spoonsRemaining 
                      ? getSpoonColor() 
                      : GOD_CONFIG.theme.bg.accent,
                    transition: 'background-color 0.3s ease',
                  }}
                />
              ))}
            </div>

            {/* Spoon controls */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => adjustSpoons(-1)}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  backgroundColor: GOD_CONFIG.theme.bg.accent,
                  border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                  borderRadius: 6,
                  color: GOD_CONFIG.theme.text.secondary,
                  fontSize: 11,
                  fontFamily: GOD_CONFIG.typography.fontFamily.display,
                  cursor: 'pointer',
                }}
              >
                − Spent Energy
              </button>
              <button
                onClick={() => adjustSpoons(1)}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  backgroundColor: GOD_CONFIG.theme.bg.accent,
                  border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                  borderRadius: 6,
                  color: GOD_CONFIG.theme.text.secondary,
                  fontSize: 11,
                  fontFamily: GOD_CONFIG.typography.fontFamily.display,
                  cursor: 'pointer',
                }}
              >
                + Recovered
              </button>
              <button
                onClick={() => setSpoonsRemaining(GOD_CONFIG.spoons.max)}
                style={{
                  padding: '8px 12px',
                  backgroundColor: GOD_CONFIG.theme.bg.accent,
                  border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                  borderRadius: 6,
                  color: GOD_CONFIG.theme.text.muted,
                  fontSize: 11,
                  cursor: 'pointer',
                }}
              >
                <RotateCcw size={12} />
              </button>
            </div>

            {spoonsRemaining <= GOD_CONFIG.spoons.thresholds.critical && (
              <div
                style={{
                  marginTop: 12,
                  padding: 12,
                  backgroundColor: `${GOD_CONFIG.voltage.high.color}15`,
                  borderRadius: 8,
                  color: GOD_CONFIG.voltage.high.color,
                  fontSize: 12,
                  lineHeight: 1.5,
                }}
              >
                ⚠️ <strong>Critical energy level.</strong> You have permission to stop. 
                Rest is not failure—it is mandatory maintenance.
              </div>
            )}
          </div>

          {/* Core Reassurance Toggle */}
          <button
            onClick={() => setShowReassurance(!showReassurance)}
            style={{
              width: '100%',
              padding: '12px 16px',
              backgroundColor: GOD_CONFIG.theme.bg.tertiary,
              border: `1px solid ${GOD_CONFIG.emotionalValence.calm.color}40`,
              borderRadius: 8,
              color: GOD_CONFIG.emotionalValence.calm.color,
              fontSize: 13,
              fontFamily: GOD_CONFIG.typography.fontFamily.display,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: showReassurance ? 0 : 24,
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Heart size={16} />
              Core Reassurance
            </span>
            {showReassurance ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showReassurance && (
            <div
              style={{
                padding: 16,
                marginBottom: 24,
                backgroundColor: `${GOD_CONFIG.emotionalValence.calm.color}10`,
                borderRadius: '0 0 8px 8px',
                borderLeft: `3px solid ${GOD_CONFIG.emotionalValence.calm.color}`,
              }}
            >
              {Object.entries(GOD_CONFIG.youAreSafe.coreReassurance).map(([key, text]) => (
                <p
                  key={key}
                  style={{
                    margin: '0 0 12px 0',
                    fontSize: 14,
                    lineHeight: 1.7,
                    color: GOD_CONFIG.theme.text.primary,
                  }}
                >
                  {text}
                </p>
              ))}
            </div>
          )}

          {/* Tetrahedron Nodes - The 4 Safety Categories */}
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontFamily: GOD_CONFIG.typography.fontFamily.display,
                color: GOD_CONFIG.theme.text.muted,
                marginBottom: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Zap size={12} />
              WHAT ARE YOU EXPERIENCING? (Select a node)
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 8,
              }}
            >
              {nodeEntries.map(([key, node]) => (
                <button
                  key={key}
                  onClick={() => setActiveNode(activeNode === key ? null : key)}
                  style={{
                    padding: 16,
                    backgroundColor: activeNode === key 
                      ? `${node.color}20` 
                      : GOD_CONFIG.theme.bg.tertiary,
                    border: `1px solid ${activeNode === key 
                      ? node.color 
                      : GOD_CONFIG.theme.border.default}`,
                    borderRadius: 10,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div
                    style={{
                      fontSize: 24,
                      marginBottom: 8,
                    }}
                  >
                    {node.icon}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      fontFamily: GOD_CONFIG.typography.fontFamily.display,
                      color: activeNode === key ? node.color : GOD_CONFIG.theme.text.primary,
                      lineHeight: 1.3,
                    }}
                  >
                    {node.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Active Node Content */}
          {activeNode && (
            <div
              style={{
                marginBottom: 24,
                padding: 20,
                backgroundColor: `${nodes[activeNode].color}10`,
                border: `1px solid ${nodes[activeNode].color}30`,
                borderRadius: 12,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 16,
                }}
              >
                <span style={{ fontSize: 28 }}>{nodes[activeNode].icon}</span>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 16,
                    fontWeight: 600,
                    fontFamily: GOD_CONFIG.typography.fontFamily.display,
                    color: nodes[activeNode].color,
                  }}
                >
                  {nodes[activeNode].name}
                </h3>
              </div>

              {/* Validation */}
              <div style={{ marginBottom: 16 }}>
                <div
                  style={{
                    fontSize: 10,
                    fontFamily: GOD_CONFIG.typography.fontFamily.display,
                    color: GOD_CONFIG.theme.text.muted,
                    marginBottom: 6,
                  }}
                >
                  💚 VALIDATION
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 14,
                    lineHeight: 1.7,
                    color: GOD_CONFIG.theme.text.primary,
                  }}
                >
                  {nodes[activeNode].validation}
                </p>
              </div>

              {/* Physics */}
              <div style={{ marginBottom: 16 }}>
                <div
                  style={{
                    fontSize: 10,
                    fontFamily: GOD_CONFIG.typography.fontFamily.display,
                    color: GOD_CONFIG.theme.text.muted,
                    marginBottom: 6,
                  }}
                >
                  ⚙️ THE PHYSICS
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: GOD_CONFIG.theme.text.secondary,
                    fontStyle: 'italic',
                  }}
                >
                  {nodes[activeNode].physics}
                </p>
              </div>

              {/* Somatic Directive */}
              <div
                style={{
                  padding: 14,
                  backgroundColor: GOD_CONFIG.theme.bg.secondary,
                  borderRadius: 8,
                  border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    fontFamily: GOD_CONFIG.typography.fontFamily.display,
                    color: nodes[activeNode].color,
                    marginBottom: 6,
                  }}
                >
                  🫁 SOMATIC DIRECTIVE
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: GOD_CONFIG.theme.text.primary,
                  }}
                >
                  {nodes[activeNode].somatic}
                </p>
              </div>
            </div>
          )}

          {/* Breathing Exercise */}
          <div
            style={{
              padding: 20,
              backgroundColor: GOD_CONFIG.theme.bg.tertiary,
              borderRadius: 12,
              border: `1px solid ${GOD_CONFIG.theme.border.default}`,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Wind size={16} color={GOD_CONFIG.emotionalValence.calm.color} />
                <span
                  style={{
                    fontSize: 12,
                    fontFamily: GOD_CONFIG.typography.fontFamily.display,
                    color: GOD_CONFIG.theme.text.secondary,
                  }}
                >
                  BREATHING EXERCISE
                </span>
              </div>
              <select
                value={selectedBreathing}
                onChange={(e) => {
                  setSelectedBreathing(e.target.value as BreathingExercise);
                  stopBreathing();
                }}
                style={{
                  padding: '6px 10px',
                  backgroundColor: GOD_CONFIG.theme.bg.primary,
                  border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                  borderRadius: 6,
                  color: GOD_CONFIG.theme.text.primary,
                  fontSize: 11,
                  fontFamily: GOD_CONFIG.typography.fontFamily.display,
                }}
              >
                {Object.entries(GOD_CONFIG.youAreSafe.breathingExercises).map(([key, ex]) => (
                  <option key={key} value={key}>{ex.name}</option>
                ))}
              </select>
            </div>

            <p
              style={{
                margin: '0 0 16px 0',
                fontSize: 12,
                color: GOD_CONFIG.theme.text.muted,
              }}
            >
              {breathingExercise.description}
            </p>

            {/* Breathing visualization */}
            {isBreathing && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    backgroundColor: `${GOD_CONFIG.emotionalValence.calm.color}20`,
                    border: `3px solid ${GOD_CONFIG.emotionalValence.calm.color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    transition: 'transform 1s ease-in-out',
                    transform: breathPhases[breathPhase] === 'Inhale' 
                      ? 'scale(1.2)' 
                      : breathPhases[breathPhase] === 'Exhale' 
                        ? 'scale(0.9)' 
                        : 'scale(1)',
                  }}
                >
                  <div
                    style={{
                      fontSize: 32,
                      fontWeight: 700,
                      fontFamily: GOD_CONFIG.typography.fontFamily.display,
                      color: GOD_CONFIG.emotionalValence.calm.color,
                    }}
                  >
                    {breathTimer}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: GOD_CONFIG.theme.text.secondary,
                      fontFamily: GOD_CONFIG.typography.fontFamily.display,
                    }}
                  >
                    {breathPhases[breathPhase]}
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={isBreathing ? stopBreathing : startBreathing}
              style={{
                width: '100%',
                padding: '12px 20px',
                backgroundColor: isBreathing 
                  ? GOD_CONFIG.voltage.medium.color 
                  : GOD_CONFIG.emotionalValence.calm.color,
                border: 'none',
                borderRadius: 8,
                color: '#fff',
                fontSize: 13,
                fontWeight: 600,
                fontFamily: GOD_CONFIG.typography.fontFamily.display,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              {isBreathing ? (
                <>
                  <Pause size={16} />
                  Stop
                </>
              ) : (
                <>
                  <Play size={16} />
                  Begin Breathing Exercise
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: `1px solid ${GOD_CONFIG.theme.border.default}`,
            backgroundColor: GOD_CONFIG.theme.bg.tertiary,
            textAlign: 'center',
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 11,
              color: GOD_CONFIG.theme.text.muted,
              fontStyle: 'italic',
            }}
          >
            "The friction is not your fault. It is an engineering problem. You are safe."
          </p>
        </div>
      </div>
    </div>
  );
}

export default YouAreSafe;

