/**
 * JITTERBUG DEMO - Interactive Cognitive Jitterbug Experience
 * "Thinking is the Jitterbug transformation from VE to Tetrahedron"
 */

import React, { useState, useCallback, useEffect } from 'react';
import CognitiveJitterbug from './CognitiveJitterbug';
import GOD_CONFIG from '../god.config';
import { componentStyles, CosmicTheme, COLORS } from '../config/design-tokens';

type EmotionalValence = 'positive' | 'neutral' | 'hostile' | 'anxious';

interface JitterbugDemoProps {
  onPhaseChange?: (phase: number) => void;
}

export default function JitterbugDemo({ onPhaseChange }: JitterbugDemoProps) {
  const [phase, setPhase] = useState(0);
  const [cognitiveLoad, setCognitiveLoad] = useState(1);
  const [emotionalValence, setEmotionalValence] = useState<EmotionalValence>('neutral');
  const [isProcessing, setIsProcessing] = useState(false);
  const [autoAnimate, setAutoAnimate] = useState(false);

  // Auto-animation effect
  React.useEffect(() => {
    if (!autoAnimate) return;

    const interval = setInterval(() => {
      setPhase(prev => {
        const next = prev + 0.02;
        if (next >= 1) {
          setAutoAnimate(false);
          return 1;
        }
        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [autoAnimate]);

  // Communicate phase changes to parent (for navigation adaptation)
  useEffect(() => {
    onPhaseChange?.(phase);
  }, [phase, onPhaseChange]);

  const handlePhaseChange = useCallback((newPhase: number) => {
    setPhase(newPhase);
    if (newPhase >= 1) {
      setIsProcessing(false);
    }
  }, []);

  const triggerThinking = useCallback(() => {
    setIsProcessing(true);
    setPhase(0);
    setTimeout(() => setAutoAnimate(true), 500);
  }, []);

  const resetJitterbug = useCallback(() => {
    setPhase(0);
    setIsProcessing(false);
    setAutoAnimate(false);
  }, []);

  const getPhaseDescription = (phase: number) => {
    if (phase < 0.3) return "Vector Equilibrium: Open, receptive mind. Pure potential.";
    if (phase < 0.7) return "Icosahedron: Cognitive dissonance. The 'wobbly' phase of thinking.";
    return "Tetrahedron: Resolved thought. Tetrahedral integrity achieved.";
  };

  const getEmotionalDescription = (valence: EmotionalValence) => {
    const descriptions = {
      positive: "Harmonious processing, dopamine-rich resolution",
      neutral: "Balanced cognition, steady state maintenance",
      hostile: "High-alert processing, threat assessment active",
      anxious: "Hyper-vigilant cognition, uncertainty amplification"
    };
    return descriptions[valence];
  };

  const getGentleGuidance = (phase: number, valence: EmotionalValence) => {
    if (phase < 0.3) {
      return valence === 'positive'
        ? "Everything flows as it should... ✨"
        : valence === 'anxious'
        ? "Breathe... you're held by the universe 🌸"
        : "Peace is always available to you 🌙";
    }

    if (phase < 0.7) {
      return valence === 'hostile'
        ? "Strong feelings are just energy moving through... 🌊"
        : "Trust the process, beautiful soul 💫";
    }

    return valence === 'positive'
      ? "You've found your way through ✨"
      : "Clarity emerges from the dance of thoughts 🌟";
  };

  return (
    <div style={{
      ...componentStyles.card,
      maxWidth: '1200px',
      margin: '0 auto',
    }}>
      <div style={{
        marginBottom: CosmicTheme.spacing.lg,
      }}>
        <h2 style={{
          ...componentStyles.text.primary,
          fontSize: CosmicTheme.fontSizes.xl,
          fontWeight: 700,
          marginBottom: CosmicTheme.spacing.sm,
          background: `linear-gradient(135deg, ${COLORS.cosmic}, ${COLORS.love})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          🧠 Cognitive Jitterbug
        </h2>
        <p style={{
          ...componentStyles.text.secondary,
          fontSize: CosmicTheme.fontSizes.md,
          marginBottom: CosmicTheme.spacing.md,
        }}>
          "Thinking is not a static state but a dynamic phase transition - the Jitterbug transformation from Vector Equilibrium to Tetrahedron"
        </p>

        <div style={{
          backgroundColor: COLORS.gray[900],
          padding: CosmicTheme.spacing.md,
          borderRadius: CosmicTheme.cardRadius,
          border: `1px solid ${COLORS.gray[700]}`,
        }}>
          <div style={{
            fontSize: CosmicTheme.fontSizes.sm,
            color: COLORS.gray[300],
            lineHeight: 1.6,
          }}>
            <strong>Current State:</strong> {getPhaseDescription(phase)}<br/>
            <strong>Emotional Valence:</strong> {getEmotionalDescription(emotionalValence)}<br/>
            <strong>Cognitive Load:</strong> {cognitiveLoad.toFixed(1)}x metabolic demand
          </div>
        </div>
      </div>

      {/* Interactive Experience */}
      <div style={{
        display: 'grid',
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