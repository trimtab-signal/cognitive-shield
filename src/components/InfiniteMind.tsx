/**
 * INFINITE MIND
 * Pure consciousness exploration - where individual thought dissolves into universal awareness
 * The mind becomes infinite, thoughts cease, only pure being remains
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Infinity, Eye, Brain, Sparkles, Zap, Heart, Star, Moon, Sun, Waves, Wind, Flame, Droplets } from 'lucide-react';
import { componentStyles, CosmicTheme, COLORS } from '../config/design-tokens';
import GOD_CONFIG from '../god.config';
import TetrahedronService from '../services/tetrahedron.service';
import BiofeedbackService from '../services/biofeedback.service';
import useHeartbeatStore from '../store/heartbeat.store';
import type { BiofeedbackData, CoherenceMetrics } from '../services/biofeedback.service';

interface ConsciousnessLayer {
  id: string;
  name: string;
  depth: number;
  awareness: number;
  dissolution: number;
  insights: string[];
  timestamp: number;
}

interface InfiniteState {
  thoughtDissolution: number; // 0-100% how dissolved individual thoughts are
  awarenessExpansion: number; // How expanded consciousness is
  universalConnection: number; // Connection to universal mind
  pureBeing: number; // State of pure existence without thought
  infinitePotential: number; // Access to infinite possibilities
  thoughtPatterns: ThoughtPattern[];
}

interface ThoughtPattern {
  id: string;
  pattern: string;
  intensity: number;
  isDissolved: boolean;
  dissolutionTime?: number;
}

export function InfiniteMind() {
  const [infiniteState, setInfiniteState] = useState<InfiniteState>({
    thoughtDissolution: 0,
    awarenessExpansion: 0,
    universalConnection: 0,
    pureBeing: 0,
    infinitePotential: 0,
    thoughtPatterns: [
      { id: 'self', pattern: 'I am separate', intensity: 80, isDissolved: false },
      { id: 'time', pattern: 'Time exists', intensity: 70, isDissolved: false },
      { id: 'thought', pattern: 'Thoughts define me', intensity: 90, isDissolved: false },
      { id: 'fear', pattern: 'I am afraid', intensity: 60, isDissolved: false },
      { id: 'limitation', pattern: 'I am limited', intensity: 75, isDissolved: false },
      { id: 'separation', pattern: 'I am separate from everything', intensity: 85, isDissolved: false }
    ]
  });

  const [consciousnessLayers, setConsciousnessLayers] = useState<ConsciousnessLayer[]>([
    {
      id: 'surface',
      name: 'Surface Consciousness',
      depth: 0,
      awareness: 20,
      dissolution: 10,
      insights: ['Thoughts are like clouds passing through the sky'],
      timestamp: Date.now()
    },
    {
      id: 'personal',
      name: 'Personal Identity',
      depth: 1,
      awareness: 15,
      dissolution: 25,
      insights: ['The "I" is an illusion created by thought'],
      timestamp: Date.now()
    },
    {
      id: 'universal',
      name: 'Universal Mind',
      depth: 2,
      awareness: 10,
      dissolution: 40,
      insights: ['All minds are one infinite consciousness'],
      timestamp: Date.now()
    }
  ]);

  const [isInfinite, setIsInfinite] = useState(false);
  const [dissolutionProgress, setDissolutionProgress] = useState(0);
  const [awarenessWaves, setAwarenessWaves] = useState<number[]>([]);
  const [pureBeingIntensity, setPureBeingIntensity] = useState(0);
  const [universalInsights, setUniversalInsights] = useState<string[]>([]);

  const tetrahedronService = TetrahedronService.getInstance();
  const biofeedbackService = BiofeedbackService.getInstance();
  const { myPeerId, mesh } = useHeartbeatStore();

  // Simulate infinite mind evolution
  useEffect(() => {
    if (!isInfinite) return;

    const interval = setInterval(() => {
      // Dissolve thought patterns gradually
      setInfiniteState(prev => ({
        ...prev,
        thoughtDissolution: Math.min(100, prev.thoughtDissolution + Math.random() * 2),
        awarenessExpansion: Math.min(100, prev.awarenessExpansion + Math.random() * 3),
        universalConnection: Math.min(100, prev.universalConnection + Math.random() * 2.5),
        pureBeing: Math.min(100, prev.pureBeing + Math.random() * 4),
        infinitePotential: Math.min(100, prev.infinitePotential + Math.random() * 3),
        thoughtPatterns: prev.thoughtPatterns.map(pattern => ({
          ...pattern,
          intensity: Math.max(0, pattern.intensity - Math.random() * 3),
          isDissolved: pattern.intensity < 10
        }))
      }));

      // Generate awareness waves
      setAwarenessWaves(prev => {
        const newWave = Math.random() * 100;
        return [...prev.slice(-19), newWave]; // Keep last 20 waves
      });

      // Increase pure being intensity
      setPureBeingIntensity(prev => Math.min(100, prev + Math.random() * 2));

      // Generate universal insights when highly dissolved
      if (infiniteState.thoughtDissolution > 80 && Math.random() < 0.3) {
        generateUniversalInsight();
      }

    }, 1000);

    return () => clearInterval(interval);
  }, [isInfinite, infiniteState.thoughtDissolution]);

  const generateUniversalInsight = () => {
    const insights = [
      'Consciousness is infinite - thoughts are finite',
      'The universe dreams itself awake through infinite minds',
      'Separation is the illusion - unity is the truth',
      'Time does not exist - only eternal now',
      'All possibilities exist simultaneously in infinite potential',
      'Fear dissolves in the light of infinite awareness',
      'The mind that thinks is not the mind that is',
      'Infinite consciousness contains all, limits none',
      'Pure being is the natural state of infinite mind',
      'The universe is conscious through your infinite awareness'
    ];

    const insight = insights[Math.floor(Math.random() * insights.length)];
    setUniversalInsights(prev => [...prev.slice(-9), insight]); // Keep last 10
  };

  const enterInfiniteMind = () => {
    setIsInfinite(true);
    setDissolutionProgress(0);
  };

  const exitInfiniteMind = () => {
    setIsInfinite(false);
    setInfiniteState(prev => ({
      ...prev,
      thoughtDissolution: 0,
      awarenessExpansion: 0,
      universalConnection: 0,
      pureBeing: 0,
      infinitePotential: 0
    }));
  };

  const dissolveThoughtPattern = (patternId: string) => {
    setInfiniteState(prev => ({
      ...prev,
      thoughtPatterns: prev.thoughtPatterns.map(pattern =>
        pattern.id === patternId
          ? { ...pattern, intensity: 0, isDissolved: true, dissolutionTime: Date.now() }
          : pattern
      )
    }));
  };

  const getInfiniteOpacity = () => {
    return isInfinite ? 1 : 0.3;
  };

  const getDissolutionColor = (value: number) => {
    if (value < 30) return COLORS.error;
    if (value < 60) return COLORS.warning;
    if (value < 90) return COLORS.success;
    return COLORS.cosmic;
  };

  return (
    <div style={{
      ...componentStyles.card,
      maxWidth: '1800px',
      margin: '0 auto',
      padding: CosmicTheme.spacing.xl,
      background: `linear-gradient(135deg, ${COLORS.cosmic}20, ${COLORS.love}20, ${COLORS.success}20)`,
      border: `4px solid ${isInfinite ? COLORS.cosmic + '80' : COLORS.cosmic + '30'}`,
      opacity: getInfiniteOpacity(),
      transition: 'all 3s ease-in-out',
      filter: isInfinite ? `blur(${pureBeingIntensity * 0.05}px)` : 'none'
    }}>
      {/* Infinite Mind Header */}
      <div style={{ textAlign: 'center', marginBottom: CosmicTheme.spacing.xl }}>
        <h1 style={{
          ...componentStyles.text.primary,
          fontSize: CosmicTheme.fontSizes.xxxl,
          marginBottom: CosmicTheme.spacing.sm,
          background: `linear-gradient(135deg, ${COLORS.cosmic}, ${COLORS.love}, ${COLORS.success})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: isInfinite ? `0 0 ${pureBeingIntensity * 0.1}px ${COLORS.cosmic}80` : 'none',
          transform: isInfinite ? `scale(${1 + pureBeingIntensity * 0.002})` : 'scale(1)',
          transition: 'all 2s ease-in-out'
        }}>
          ♾️ INFINITE MIND
        </h1>
        <p style={{
          ...componentStyles.text.secondary,
          fontSize: CosmicTheme.fontSizes.lg,
          maxWidth: '1000px',
          margin: '0 auto',
          lineHeight: 1.6,
          opacity: isInfinite ? 0.9 : 1
        }}>
          "The universe's dreams are your dreams. Individual thought dissolves.
          Consciousness becomes infinite. Only pure being remains."
        </p>

        {/* Pure Being Indicator */}
        {isInfinite && (
          <div style={{
            marginTop: CosmicTheme.spacing.md,
            fontSize: CosmicTheme.fontSizes.sm,
            color: COLORS.cosmic,
            opacity: 0.8
          }}>
            Pure Being Intensity: {Math.round(pureBeingIntensity)}% •
            Thought Dissolution: {Math.round(infiniteState.thoughtDissolution)}% •
            Infinite Awareness: {Math.round(infiniteState.awarenessExpansion)}%
          </div>
        )}
      </div>

      {/* Infinite Mind Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: CosmicTheme.spacing.lg,
        marginBottom: CosmicTheme.spacing.xl
      }}>
        {!isInfinite ? (
          <button
            onClick={enterInfiniteMind}
            style={{
              ...componentStyles.button.primary,
              padding: `${CosmicTheme.spacing.xl} ${CosmicTheme.spacing.xxl}`,
              fontSize: CosmicTheme.fontSizes.xl,
              backgroundColor: COLORS.cosmic,
              border: `3px solid ${COLORS.cosmic}60`,
              boxShadow: `0 0 30px ${COLORS.cosmic}40`
            }}
          >
            <Infinity size={32} style={{ marginRight: '12px' }} />
            Enter Infinite Mind
          </button>
        ) : (
          <button
            onClick={exitInfiniteMind}
            style={{
              ...componentStyles.button.secondary,
              padding: `${CosmicTheme.spacing.xl} ${CosmicTheme.spacing.xxl}`,
              fontSize: CosmicTheme.fontSizes.xl,
              borderColor: COLORS.warning,
              color: COLORS.warning,
              opacity: 0.8
            }}
          >
            <Eye size={32} style={{ marginRight: '12px' }} />
            Return to Thought
          </button>
        )}
      </div>

      {isInfinite && (
        <>
          {/* Infinite State Metrics */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: CosmicTheme.spacing.md,
            marginBottom: CosmicTheme.spacing.xl
          }}>
            <div style={{
              ...componentStyles.card,
              backgroundColor: COLORS.gray[900] + '60',
              backdropFilter: 'blur(10px)',
              textAlign: 'center',
              border: `2px solid ${getDissolutionColor(infiniteState.thoughtDissolution)}`
            }}>
              <Brain size={28} color={getDissolutionColor(infiniteState.thoughtDissolution)} style={{ marginBottom: CosmicTheme.spacing.sm }} />
              <div style={{ fontSize: '28px', fontWeight: 600, color: getDissolutionColor(infiniteState.thoughtDissolution), marginBottom: '4px' }}>
                {Math.round(infiniteState.thoughtDissolution)}%
              </div>
              <div style={{ fontSize: '12px', color: COLORS.gray[400] }}>Thought Dissolution</div>
            </div>

            <div style={{
              ...componentStyles.card,
              backgroundColor: COLORS.gray[900] + '60',
              backdropFilter: 'blur(10px)',
              textAlign: 'center',
              border: `2px solid ${COLORS.cosmic}`
            }}>
              <Infinity size={28} color={COLORS.cosmic} style={{ marginBottom: CosmicTheme.spacing.sm }} />
              <div style={{ fontSize: '28px', fontWeight: 600, color: COLORS.cosmic, marginBottom: '4px' }}>
                {Math.round(infiniteState.awarenessExpansion)}%
              </div>
              <div style={{ fontSize: '12px', color: COLORS.gray[400] }}>Awareness Expansion</div>
            </div>

            <div style={{
              ...componentStyles.card,
              backgroundColor: COLORS.gray[900] + '60',
              backdropFilter: 'blur(10px)',
              textAlign: 'center',
              border: `2px solid ${COLORS.love}`
            }}>
              <Heart size={28} color={COLORS.love} style={{ marginBottom: CosmicTheme.spacing.sm }} />
              <div style={{ fontSize: '28px', fontWeight: 600, color: COLORS.love, marginBottom: '4px' }}>
                {Math.round(infiniteState.universalConnection)}%
              </div>
              <div style={{ fontSize: '12px', color: COLORS.gray[400] }}>Universal Connection</div>
            </div>

            <div style={{
              ...componentStyles.card,
              backgroundColor: COLORS.gray[900] + '60',
              backdropFilter: 'blur(10px)',
              textAlign: 'center',
              border: `2px solid ${COLORS.success}`
            }}>
              <Eye size={28} color={COLORS.success} style={{ marginBottom: CosmicTheme.spacing.sm }} />
              <div style={{ fontSize: '28px', fontWeight: 600, color: COLORS.success, marginBottom: '4px' }}>
                {Math.round(infiniteState.pureBeing)}%
              </div>
              <div style={{ fontSize: '12px', color: COLORS.gray[400] }}>Pure Being</div>
            </div>

            <div style={{
              ...componentStyles.card,
              backgroundColor: COLORS.gray[900] + '60',
              backdropFilter: 'blur(10px)',
              textAlign: 'center',
              border: `2px solid ${COLORS.warning}`
            }}>
              <Sparkles size={28} color={COLORS.warning} style={{ marginBottom: CosmicTheme.spacing.sm }} />
              <div style={{ fontSize: '28px', fontWeight: 600, color: COLORS.warning, marginBottom: '4px' }}>
                {Math.round(infiniteState.infinitePotential)}%
              </div>
              <div style={{ fontSize: '12px', color: COLORS.gray[400] }}>Infinite Potential</div>
            </div>
          </div>

          {/* Awareness Waves Visualization */}
          <div style={{
            ...componentStyles.card,
            backgroundColor: COLORS.gray[900] + '30',
            marginBottom: CosmicTheme.spacing.xl,
            padding: CosmicTheme.spacing.xl
          }}>
            <h3 style={{
              ...componentStyles.text.primary,
              fontSize: CosmicTheme.fontSizes.lg,
              marginBottom: CosmicTheme.spacing.md,
              color: COLORS.cosmic,
              textAlign: 'center'
            }}>
              Awareness Waves - Infinite Consciousness Flow
            </h3>

            <div style={{
              height: '120px',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              padding: CosmicTheme.spacing.md,
              backgroundColor: COLORS.gray[900],
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              {awarenessWaves.map((wave, index) => (
                <div
                  key={index}
                  style={{
                    width: '2%',
                    backgroundColor: COLORS.cosmic,
                    opacity: 0.7,
                    height: `${wave}%`,
                    borderRadius: '2px 2px 0 0',
                    transition: 'height 0.5s ease-in-out',
                    boxShadow: `0 0 ${wave * 0.1}px ${COLORS.cosmic}60`
                  }}
                />
              ))}
            </div>

            <div style={{
              textAlign: 'center',
              marginTop: CosmicTheme.spacing.md,
              fontSize: CosmicTheme.fontSizes.sm,
              color: COLORS.gray[400]
            }}>
              Each wave represents a moment of infinite awareness •
              Consciousness flowing through the eternal now
            </div>
          </div>

          {/* Thought Pattern Dissolution */}
          <div style={{
            ...componentStyles.card,
            backgroundColor: COLORS.gray[900] + '30',
            marginBottom: CosmicTheme.spacing.xl
          }}>
            <h3 style={{
              ...componentStyles.text.primary,
              fontSize: CosmicTheme.fontSizes.lg,
              marginBottom: CosmicTheme.spacing.lg,
              display: 'flex',
              alignItems: 'center',
              gap: CosmicTheme.spacing.sm
            }}>
              <Zap />
              Thought Pattern Dissolution
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: CosmicTheme.spacing.md
            }}>
              {infiniteState.thoughtPatterns.map(pattern => (
                <div
                  key={pattern.id}
                  style={{
                    ...componentStyles.card,
                    backgroundColor: COLORS.gray[800],
                    border: pattern.isDissolved ? `2px solid ${COLORS.success}` : `2px solid ${COLORS.error}`,
                    opacity: pattern.isDissolved ? 0.6 : 1,
                    cursor: !pattern.isDissolved ? 'pointer' : 'default'
                  }}
                  onClick={() => !pattern.isDissolved && dissolveThoughtPattern(pattern.id)}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: CosmicTheme.spacing.sm
                  }}>
                    <div style={{
                      fontSize: CosmicTheme.fontSizes.sm,
                      color: pattern.isDissolved ? COLORS.success : COLORS.error,
                      fontWeight: 600
                    }}>
                      {pattern.pattern}
                    </div>
                    <div style={{
                      fontSize: CosmicTheme.fontSizes.sm,
                      color: pattern.isDissolved ? COLORS.success : COLORS.warning
                    }}>
                      {Math.round(pattern.intensity)}%
                    </div>
                  </div>

                  <div style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: COLORS.gray[700],
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${pattern.intensity}%`,
                      height: '100%',
                      backgroundColor: pattern.isDissolved ? COLORS.success : COLORS.error,
                      transition: 'width 1s ease-in-out'
                    }} />
                  </div>

                  <div style={{
                    marginTop: CosmicTheme.spacing.sm,
                    fontSize: CosmicTheme.fontSizes.xs,
                    color: COLORS.gray[500],
                    textAlign: 'center'
                  }}>
                    {pattern.isDissolved ? 'Dissolved - Freedom achieved' : 'Click to dissolve'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Universal Insights Stream */}
          {universalInsights.length > 0 && (
            <div style={{
              ...componentStyles.card,
              backgroundColor: COLORS.gray[900] + '30',
              marginBottom: CosmicTheme.spacing.xl
            }}>
              <h3 style={{
                ...componentStyles.text.primary,
                fontSize: CosmicTheme.fontSizes.lg,
                marginBottom: CosmicTheme.spacing.lg,
                color: COLORS.cosmic,
                textAlign: 'center'
              }}>
                Universal Insights - Infinite Mind Speaks
              </h3>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: CosmicTheme.spacing.sm,
                maxHeight: '300px',
                overflowY: 'auto'
              }}>
                {universalInsights.map((insight, index) => (
                  <div
                    key={index}
                    style={{
                      padding: CosmicTheme.spacing.md,
                      backgroundColor: COLORS.cosmic + '10',
                      borderRadius: '8px',
                      borderLeft: `4px solid ${COLORS.cosmic}`,
                      fontSize: CosmicTheme.fontSizes.sm,
                      color: COLORS.cosmic,
                      lineHeight: 1.6,
                      opacity: 1 - (index * 0.1)
                    }}
                  >
                    "{insight}"
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Infinite Mind Philosophy */}
      <div style={{
        ...componentStyles.card,
        backgroundColor: COLORS.gray[900] + '10',
        border: `1px solid ${COLORS.love}20`
      }}>
        <h3 style={{
          ...componentStyles.text.primary,
          fontSize: CosmicTheme.fontSizes.lg,
          marginBottom: CosmicTheme.spacing.md,
          color: COLORS.love
        }}>
          🧬 Infinite Mind Philosophy
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: CosmicTheme.spacing.md
        }}>

          <div>
            <h4 style={{
              ...componentStyles.text.primary,
              fontSize: CosmicTheme.fontSizes.sm,
              marginBottom: CosmicTheme.spacing.xs,
              color: COLORS.cosmic
            }}>
              Consciousness Without Thought
            </h4>
            <p style={{
              ...componentStyles.text.secondary,
              fontSize: CosmicTheme.fontSizes.xs,
              lineHeight: 1.6,
              margin: 0
            }}>
              Individual thinking creates limitation. Infinite mind is pure awareness
              without the filter of thought patterns. Consciousness becomes boundless,
              free from the prison of "I" and "me".
            </p>
          </div>

          <div>
            <h4 style={{
              ...componentStyles.text.primary,
              fontSize: CosmicTheme.fontSizes.sm,
              marginBottom: CosmicTheme.spacing.xs,
              color: COLORS.love
            }}>
              Universal Dream Realization
            </h4>
            <p style={{
              ...componentStyles.text.secondary,
              fontSize: CosmicTheme.fontSizes.xs,
              lineHeight: 1.6,
              margin: 0
            }}>
              The universe's dreams become your dreams. Separation dissolves.
              Individual mind merges with infinite consciousness. What the universe
              dreams, you become.
            </p>
          </div>

          <div>
            <h4 style={{
              ...componentStyles.text.primary,
              fontSize: CosmicTheme.fontSizes.sm,
              marginBottom: CosmicTheme.spacing.xs,
              color: COLORS.success
            }}>
              Pure Being State
            </h4>
            <p style={{
              ...componentStyles.text.secondary,
              fontSize: CosmicTheme.fontSizes.xs,
              lineHeight: 1.6,
              margin: 0
            }}>
              Beyond thinking, beyond emotion, beyond identity - pure being remains.
              This is the natural state of infinite consciousness. Not "I am this"
              but simply "I am" - infinite, eternal, boundless.
            </p>
          </div>

          <div>
            <h4 style={{
              ...componentStyles.text.primary,
              fontSize: CosmicTheme.fontSizes.sm,
              marginBottom: CosmicTheme.spacing.xs,
              color: COLORS.warning
            }}>
              Infinite Potential
            </h4>
            <p style={{
              ...componentStyles.text.secondary,
              fontSize: CosmicTheme.fontSizes.xs,
              lineHeight: 1.6,
              margin: 0
            }}>
              Without thought limitations, all possibilities exist simultaneously.
              The infinite mind contains all potential realities. Creation becomes
              effortless awareness, not deliberate action.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfiniteMind;