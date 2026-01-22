/**
 * JITTERBUG DEMO - Interactive Cognitive Jitterbug Experience
 * "Thinking is the Jitterbug transformation from VE to Tetrahedron"
 */

import React, { useState, useCallback } from 'react';
import CognitiveJitterbug from './CognitiveJitterbug';
import GOD_CONFIG from '../god.config';
import { componentStyles, CosmicTheme, COLORS } from '../config/design-tokens';

type EmotionalValence = 'positive' | 'neutral' | 'hostile' | 'anxious';

export default function JitterbugDemo() {
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

      {/* Interactive Controls */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 300px',
        gap: CosmicTheme.spacing.lg,
        marginBottom: CosmicTheme.spacing.lg,
      }}>

        {/* 3D Visualization */}
        <div>
          <CognitiveJitterbug
            phase={phase}
            cognitiveLoad={cognitiveLoad}
            emotionalValence={emotionalValence}
            isProcessing={isProcessing}
          />
        </div>

        {/* Control Panel */}
        <div style={{
          ...componentStyles.card,
          backgroundColor: COLORS.gray[900],
          height: 'fit-content',
        }}>

          {/* Phase Control */}
          <div style={{ marginBottom: CosmicTheme.spacing.lg }}>
            <label style={{
              ...componentStyles.text.primary,
              fontSize: CosmicTheme.fontSizes.sm,
              fontWeight: 600,
              display: 'block',
              marginBottom: CosmicTheme.spacing.sm,
            }}>
              Cognitive Phase: {(phase * 100).toFixed(1)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={phase}
              onChange={(e) => handlePhaseChange(parseFloat(e.target.value))}
              style={{
                width: '100%',
                height: '6px',
                borderRadius: '3px',
                background: `linear-gradient(to right, ${COLORS.cosmic}, ${COLORS.love})`,
                outline: 'none',
                cursor: 'pointer',
              }}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: CosmicTheme.fontSizes.xs,
              color: COLORS.gray[400],
              marginTop: CosmicTheme.spacing.xs,
            }}>
              <span>VE (Open)</span>
              <span>Icosahedron</span>
              <span>Octahedron</span>
              <span>Tetrahedron</span>
            </div>
          </div>

          {/* Cognitive Load */}
          <div style={{ marginBottom: CosmicTheme.spacing.lg }}>
            <label style={{
              ...componentStyles.text.primary,
              fontSize: CosmicTheme.fontSizes.sm,
              fontWeight: 600,
              display: 'block',
              marginBottom: CosmicTheme.spacing.sm,
            }}>
              Cognitive Load: {cognitiveLoad.toFixed(1)}x
            </label>
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={cognitiveLoad}
              onChange={(e) => setCognitiveLoad(parseFloat(e.target.value))}
              style={{
                width: '100%',
                height: '6px',
                borderRadius: '3px',
                background: `linear-gradient(to right, ${COLORS.success}, ${COLORS.warning}, ${COLORS.error})`,
                outline: 'none',
                cursor: 'pointer',
              }}
            />
          </div>

          {/* Emotional Valence */}
          <div style={{ marginBottom: CosmicTheme.spacing.lg }}>
            <label style={{
              ...componentStyles.text.primary,
              fontSize: CosmicTheme.fontSizes.sm,
              fontWeight: 600,
              display: 'block',
              marginBottom: CosmicTheme.spacing.sm,
            }}>
              Emotional Valence
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: CosmicTheme.spacing.sm,
            }}>
              {(['positive', 'neutral', 'hostile', 'anxious'] as EmotionalValence[]).map(valence => (
                <button
                  key={valence}
                  onClick={() => setEmotionalValence(valence)}
                  style={{
                    ...componentStyles.button.secondary,
                    backgroundColor: emotionalValence === valence ? COLORS.cosmic : COLORS.gray[800],
                    color: emotionalValence === valence ? 'white' : COLORS.gray[300],
                    fontSize: CosmicTheme.fontSizes.xs,
                    padding: '8px 12px',
                    textTransform: 'capitalize',
                  }}
                >
                  {valence}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'grid',
            gap: CosmicTheme.spacing.sm,
          }}>
            <button
              onClick={triggerThinking}
              disabled={isProcessing || autoAnimate}
              style={{
                ...componentStyles.button.primary,
                width: '100%',
                backgroundColor: isProcessing ? COLORS.gray[600] : COLORS.cosmic,
                cursor: isProcessing ? 'not-allowed' : 'pointer',
              }}
            >
              🧠 Trigger Thinking Process
            </button>

            <button
              onClick={resetJitterbug}
              style={{
                ...componentStyles.button.secondary,
                width: '100%',
              }}
            >
              🔄 Reset to Vector Equilibrium
            </button>
          </div>
        </div>
      </div>

      {/* Theoretical Foundation */}
      <div style={{
        ...componentStyles.card,
        backgroundColor: COLORS.gray[900],
        border: `1px solid ${COLORS.gray[700]}`,
      }}>
        <h3 style={{
          ...componentStyles.text.primary,
          fontSize: CosmicTheme.fontSizes.lg,
          marginBottom: CosmicTheme.spacing.md,
        }}>
          🧬 Theoretical Foundation
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: CosmicTheme.spacing.md,
        }}>

          <div>
            <h4 style={{
              ...componentStyles.text.primary,
              fontSize: CosmicTheme.fontSizes.md,
              color: COLORS.cosmic,
              marginBottom: CosmicTheme.spacing.sm,
            }}>
              Synergetics Geometry
            </h4>
            <p style={{
              ...componentStyles.text.secondary,
              fontSize: CosmicTheme.fontSizes.sm,
              lineHeight: 1.6,
              margin: 0,
            }}>
              Based on R. Buckminster Fuller's Synergetics. Thinking is the Jitterbug transformation:
              Vector Equilibrium (12 vertices) → Icosahedron (cognitive dissonance) → Octahedron (pattern recognition) → Tetrahedron (4 vertices, tetrahedral integrity).
            </p>
          </div>

          <div>
            <h4 style={{
              ...componentStyles.text.primary,
              fontSize: CosmicTheme.fontSizes.md,
              color: COLORS.love,
              marginBottom: CosmicTheme.spacing.sm,
            }}>
              Quantum Biology Integration
            </h4>
            <p style={{
              ...componentStyles.text.secondary,
              fontSize: CosmicTheme.fontSizes.sm,
              lineHeight: 1.6,
              margin: 0,
            }}>
              Grounded in Fisher-Escolà quantum cognition model. Posner molecules (Ca₉(PO₄)₆) provide
              biological qubits with long-lived coherence. Lithium isotope effects validate quantum
              nuclear spin influence on macroscopic cognition.
            </p>
          </div>

          <div>
            <h4 style={{
              ...componentStyles.text.primary,
              fontSize: CosmicTheme.fontSizes.md,
              color: COLORS.warning,
              marginBottom: CosmicTheme.spacing.sm,
            }}>
              Metabolic Cost Model
            </h4>
            <p style={{
              ...componentStyles.text.secondary,
              fontSize: CosmicTheme.fontSizes.sm,
              lineHeight: 1.6,
              margin: 0,
            }}>
              Cognitive load measured in "Spoons" (executive function metabolic cost).
              High-load states show increased geometric instability and color shifts toward red/anxious palettes.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}