/**
 * GENSYNC TRANSLATOR - Impedance Matching for Relationships
 * Convert engineering logic to relational dialects using VPI Protocol
 */

import React, { useState, useCallback } from 'react';
import { Heart, Sparkles, Zap, Radio, Target } from 'lucide-react';
import { CosmicTheme, componentStyles, COLORS } from '../../config/design-tokens';
import VPIProtocolService, { type ImpedanceMatch } from '../../services/vpi-protocol.service';
import type { ProcessedPayload } from '../../types/shield.types';

// GenSync Translation Matrix - Engineering to Relational Dialects
interface TranslationPair {
  engineering: string;
  [key: string]: string; // astrology, cosmetology, etc.
}

const TRANSLATION_MATRIX: TranslationPair[] = [
  {
    engineering: 'Floating Neutral',
    astrology: 'Mercury Retrograde',
    cosmetology: 'Hot Roots'
  },
  {
    engineering: 'High Impedance',
    astrology: 'Saturn Return',
    cosmetology: 'Low Porosity'
  },
  {
    engineering: 'Low Impedance',
    astrology: 'Neptune Transit',
    cosmetology: 'High Porosity'
  },
  {
    engineering: 'Wye Topology',
    astrology: 'Age of Pisces',
    cosmetology: 'Old Routine'
  },
  {
    engineering: 'Delta Topology',
    astrology: 'Age of Aquarius',
    cosmetology: 'New Regimen'
  },
  {
    engineering: 'Phase Shift',
    astrology: 'Jupiter Transit',
    cosmetology: 'Growing Out'
  },
  {
    engineering: 'Voltage Drop',
    astrology: 'Mars Square',
    cosmetology: 'Split Ends'
  },
  {
    engineering: 'Ground Fault',
    astrology: 'Chiron Return',
    cosmetology: 'Root Damage'
  }
];

interface GenSyncTranslatorProps {
  recipientDialect?: 'astrology' | 'cosmetology';
  context?: string;
}

export default function GenSyncTranslator({
  recipientDialect = 'astrology',
  context = 'general'
}: GenSyncTranslatorProps) {
  const [activeTranslation, setActiveTranslation] = useState<ImpedanceMatch | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const [showVPIDetails, setShowVPIDetails] = useState(false);

  const vpiService = VPIProtocolService.getInstance();

  const performTranslation = useCallback(async (
    message: string,
    fromDialect: 'engineering' | 'astrology' | 'cosmetology',
    toDialect: 'engineering' | 'astrology' | 'cosmetology'
  ) => {
    setIsTranslating(true);
    try {
      const result = await vpiService.translate(message, fromDialect, toDialect);
      setActiveTranslation(result);
    } catch (error) {
      console.error('VPI Translation failed:', error);
    } finally {
      setIsTranslating(false);
    }
  }, [vpiService]);

  const handleCustomTranslation = useCallback(async () => {
    if (!customMessage.trim()) return;
    await performTranslation(customMessage, 'engineering', recipientDialect);
  }, [customMessage, recipientDialect, performTranslation]);
  return (
    <div style={{
      ...componentStyles.card,
      maxWidth: 1000,
      margin: '0 auto',
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: CosmicTheme.spacing.xl,
      }}>
        <div style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${CosmicTheme.colors.love}, ${CosmicTheme.colors.cosmic})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
        }}>
          <Heart size={40} color="white" />
        </div>

        <h1 style={{
          ...componentStyles.text.primary,
          fontSize: CosmicTheme.fontSizes.xxl,
          margin: '0 0 8px 0',
          background: `linear-gradient(90deg, ${CosmicTheme.colors.love}, ${CosmicTheme.colors.cosmic})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          💕 GenSync Translator
        </h1>

        <p style={{
          ...componentStyles.text.secondary,
          margin: '0 auto',
          maxWidth: 600,
          fontSize: CosmicTheme.fontSizes.md,
        }}>
          Convert Engineering Logic to Relational Dialects
          <br />
          <em>Impedance Matching for Hearts and Homes</em>
        </p>
      </div>

      {/* VPI Protocol Status */}
      <div style={{
        ...componentStyles.card,
        marginBottom: CosmicTheme.spacing.xl,
        background: `linear-gradient(135deg, ${COLORS.signal}10, ${COLORS.love}10)`
      }}>
        <h3 style={{
          ...componentStyles.text.primary,
          margin: '0 0 16px 0',
          fontSize: CosmicTheme.fontSizes.md,
          display: 'flex',
          alignItems: 'center',
          gap: CosmicTheme.spacing.sm,
        }}>
          <Radio size={20} color={COLORS.signal} />
          VPI Protocol Status
        </h3>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: CosmicTheme.spacing.md,
          marginBottom: CosmicTheme.spacing.md,
        }}>
          <div style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: COLORS.signal,
            animation: 'pulse 2s infinite',
          }} />
          <span style={{
            ...componentStyles.text.secondary,
            fontSize: CosmicTheme.fontSizes.sm,
          }}>
            Impedance Matching Active • Translation Matrix Loaded
          </span>
        </div>

        <button
          onClick={() => setShowVPIDetails(!showVPIDetails)}
          style={{
            ...componentStyles.button.secondary,
            fontSize: CosmicTheme.fontSizes.sm,
          }}
        >
          {showVPIDetails ? 'Hide' : 'Show'} VPI Protocol Details
        </button>

        {showVPIDetails && (
          <div style={{
            marginTop: CosmicTheme.spacing.md,
            padding: CosmicTheme.spacing.md,
            backgroundColor: CosmicTheme.colors.gray[900],
            borderRadius: CosmicTheme.spacing.sm,
          }}>
            <h4 style={{
              ...componentStyles.text.primary,
              margin: '0 0 8px 0',
              fontSize: CosmicTheme.fontSizes.sm,
              color: COLORS.signal,
            }}>
              VPI Communication Sequence:
            </h4>
            <ol style={{
              ...componentStyles.text.secondary,
              fontSize: CosmicTheme.fontSizes.sm,
              margin: 0,
              paddingLeft: CosmicTheme.spacing.lg,
            }}>
              <li>Pull Vacuum: Cease arguments, create low-pressure zone</li>
              <li>Flood with Resin: Use validation/empathy to seal anxiety</li>
              <li>Cure: Allow external pressure to harden boundaries</li>
            </ol>
          </div>
        )}
      </div>

      {/* Translation Matrix */}
      <div style={{ marginBottom: CosmicTheme.spacing.xl }}>
        <h2 style={{
          ...componentStyles.text.primary,
          marginBottom: CosmicTheme.spacing.md,
        }}>
          Impedance Matching Matrix
        </h2>

        <div style={{ display: 'grid', gap: CosmicTheme.spacing.md }}>
          {TRANSLATION_MATRIX.map((pair, index) => (
            <div
              key={index}
              style={{
                ...componentStyles.card,
                cursor: 'pointer',
                border: activeTranslation?.translatedMessage.includes(pair[recipientDialect])
                  ? `2px solid ${COLORS.love}`
                  : componentStyles.card.border,
                transition: 'all 0.2s ease',
              }}
              onClick={() => performTranslation(pair.engineering, 'engineering', recipientDialect)}
            >
              <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr auto',
                gap: CosmicTheme.spacing.md,
                alignItems: 'center',
              }}>
                <div>
                  <div style={{
                    ...componentStyles.text.secondary,
                    fontSize: CosmicTheme.fontSizes.sm,
                    marginBottom: 4,
                    fontWeight: 600,
                  }}>
                    Engineering Logic
                  </div>
                  <div style={{
                    ...componentStyles.text.primary,
                    fontSize: CosmicTheme.fontSizes.md,
                    fontWeight: 600,
                    color: COLORS.cosmic,
                  }}>
                    {pair.engineering}
                  </div>
                </div>

                <div>
                  <div style={{
                    ...componentStyles.text.secondary,
                    fontSize: CosmicTheme.fontSizes.sm,
                    marginBottom: 4,
                    fontWeight: 600,
                  }}>
                    💫 {recipientDialect === 'astrology' ? 'Astrology' : 'Cosmetology'}
                  </div>
                  <div style={{
                    ...componentStyles.text.primary,
                    fontSize: CosmicTheme.fontSizes.md,
                    color: recipientDialect === 'astrology' ? COLORS.love : COLORS.aries,
                  }}>
                    {pair[recipientDialect]}
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: CosmicTheme.spacing.xs,
                }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard?.writeText(pair[recipientDialect]);
                    }}
                    style={{
                      ...componentStyles.button.secondary,
                      padding: `${CosmicTheme.spacing.xs} ${CosmicTheme.spacing.sm}`,
                      fontSize: CosmicTheme.fontSizes.sm,
                    }}
                  >
                    Copy
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      performTranslation(pair.engineering, 'engineering', recipientDialect);
                    }}
                    disabled={isTranslating}
                    style={{
                      ...componentStyles.button.primary,
                      padding: `${CosmicTheme.spacing.xs} ${CosmicTheme.spacing.sm}`,
                      fontSize: CosmicTheme.fontSizes.sm,
                      opacity: isTranslating ? 0.6 : 1,
                    }}
                  >
                    {isTranslating ? '...' : 'Translate'}
                  </button>
                </div>
              </div>

              <div style={{
                marginTop: CosmicTheme.spacing.md,
                padding: CosmicTheme.spacing.sm,
                backgroundColor: CosmicTheme.colors.gray[900],
                borderRadius: CosmicTheme.spacing.xs,
              }}>
                <div style={{
                  ...componentStyles.text.secondary,
                  fontSize: CosmicTheme.fontSizes.sm,
                  fontWeight: 600,
                  marginBottom: 4,
                  color: COLORS.delta,
                }}>
                  Purpose: {pair.purpose}
                </div>
                <div style={{
                  ...componentStyles.text.muted,
                  fontSize: CosmicTheme.fontSizes.sm,
                }}>
                  <strong>Use when:</strong> {pair.context}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Translation Result */}
      {activeTranslation && (
        <div style={{
          ...componentStyles.card,
          marginBottom: CosmicTheme.spacing.xl,
          background: `linear-gradient(135deg, ${COLORS.love}10, ${COLORS.cosmic}10)`,
        }}>
          <h3 style={{
            ...componentStyles.text.primary,
            margin: '0 0 16px 0',
            fontSize: CosmicTheme.fontSizes.md,
            display: 'flex',
            alignItems: 'center',
            gap: CosmicTheme.spacing.sm,
          }}>
            <Zap size={20} color={COLORS.love} />
            VPI Translation Result
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: CosmicTheme.spacing.md,
            marginBottom: CosmicTheme.spacing.md,
          }}>
            <div>
              <div style={{
                ...componentStyles.text.secondary,
                fontSize: CosmicTheme.fontSizes.sm,
                marginBottom: 4,
              }}>
                Original ({activeTranslation.sourceDialect})
              </div>
              <div style={{
                ...componentStyles.text.primary,
                fontSize: CosmicTheme.fontSizes.sm,
                padding: CosmicTheme.spacing.sm,
                backgroundColor: CosmicTheme.colors.gray[900],
                borderRadius: CosmicTheme.spacing.xs,
              }}>
                {activeTranslation.originalMessage}
              </div>
            </div>

            <div>
              <div style={{
                ...componentStyles.text.secondary,
                fontSize: CosmicTheme.fontSizes.sm,
                marginBottom: 4,
              }}>
                Translated ({activeTranslation.targetDialect})
              </div>
              <div style={{
                ...componentStyles.text.primary,
                fontSize: CosmicTheme.fontSizes.sm,
                padding: CosmicTheme.spacing.sm,
                backgroundColor: activeTranslation.resonance ? COLORS.success + '20' : CosmicTheme.colors.gray[900],
                borderRadius: CosmicTheme.spacing.xs,
                border: activeTranslation.resonance ? `1px solid ${COLORS.success}` : 'none',
              }}>
                {activeTranslation.translatedMessage}
              </div>
            </div>
          </div>

          {/* Impedance Metrics */}
          <div style={{
            padding: CosmicTheme.spacing.md,
            backgroundColor: CosmicTheme.colors.gray[900],
            borderRadius: CosmicTheme.spacing.sm,
          }}>
            <h4 style={{
              ...componentStyles.text.primary,
              margin: '0 0 12px 0',
              fontSize: CosmicTheme.fontSizes.sm,
              color: COLORS.signal,
            }}>
              Impedance Matching Metrics
            </h4>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: CosmicTheme.spacing.sm,
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  ...componentStyles.text.primary,
                  fontSize: CosmicTheme.fontSizes.lg,
                  fontWeight: 700,
                  color: activeTranslation.resonance ? COLORS.success : COLORS.warning,
                }}>
                  {activeTranslation.powerTransfer.toFixed(2)}
                </div>
                <div style={{
                  ...componentStyles.text.secondary,
                  fontSize: CosmicTheme.fontSizes.xs,
                }}>
                  Power Transfer
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{
                  ...componentStyles.text.primary,
                  fontSize: CosmicTheme.fontSizes.lg,
                  fontWeight: 700,
                  color: activeTranslation.resonance ? COLORS.success : COLORS.warning,
                }}>
                  {Math.abs(activeTranslation.impedanceRatio).toFixed(2)}
                </div>
                <div style={{
                  ...componentStyles.text.secondary,
                  fontSize: CosmicTheme.fontSizes.xs,
                }}>
                  Reflection (Γ)
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{
                  ...componentStyles.text.primary,
                  fontSize: CosmicTheme.fontSizes.lg,
                  fontWeight: 700,
                  color: activeTranslation.resonance ? COLORS.success : COLORS.warning,
                }}>
                  {activeTranslation.confidence.toFixed(2)}
                </div>
                <div style={{
                  ...componentStyles.text.secondary,
                  fontSize: CosmicTheme.fontSizes.xs,
                }}>
                  Confidence
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{
                  ...componentStyles.text.primary,
                  fontSize: CosmicTheme.fontSizes.lg,
                  fontWeight: 700,
                  color: activeTranslation.resonance ? COLORS.success : COLORS.error,
                }}>
                  {activeTranslation.resonance ? '✓' : '✗'}
                </div>
                <div style={{
                  ...componentStyles.text.secondary,
                  fontSize: CosmicTheme.fontSizes.xs,
                }}>
                  Resonance
                </div>
              </div>
            </div>

            <div style={{
              marginTop: CosmicTheme.spacing.md,
              padding: CosmicTheme.spacing.sm,
              backgroundColor: activeTranslation.resonance ? COLORS.success + '10' : COLORS.warning + '10',
              borderRadius: CosmicTheme.spacing.xs,
            }}>
              <div style={{
                ...componentStyles.text.secondary,
                fontSize: CosmicTheme.fontSizes.sm,
                fontStyle: 'italic',
              }}>
                {activeTranslation.explanation}
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: CosmicTheme.spacing.sm,
            marginTop: CosmicTheme.spacing.md,
          }}>
            <button
              onClick={() => navigator.clipboard?.writeText(activeTranslation.translatedMessage)}
              style={{
                ...componentStyles.button.primary,
                flex: 1,
              }}
            >
              Copy Translation
            </button>

            <button
              onClick={() => setActiveTranslation(null)}
              style={{
                ...componentStyles.button.secondary,
                flex: 1,
              }}
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Custom Translation */}
      <div style={{
        ...componentStyles.card,
        marginBottom: CosmicTheme.spacing.xl,
      }}>
        <h3 style={{
          ...componentStyles.text.primary,
          margin: '0 0 16px 0',
          fontSize: CosmicTheme.fontSizes.md,
          display: 'flex',
          alignItems: 'center',
          gap: CosmicTheme.spacing.sm,
        }}>
          <Target size={20} color={COLORS.cosmic} />
          Custom Translation
        </h3>

        <div style={{ marginBottom: CosmicTheme.spacing.md }}>
          <label style={{
            ...componentStyles.text.secondary,
            display: 'block',
            marginBottom: CosmicTheme.spacing.sm,
            fontSize: CosmicTheme.fontSizes.sm,
            fontWeight: 600,
          }}>
            Engineering Concept or Message
          </label>
          <textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="e.g., 'I need space to process this', 'The system is overloaded', 'Circuit breaker tripped'"
            style={{
              ...componentStyles.input,
              width: '100%',
              minHeight: 80,
              resize: 'vertical',
            }}
          />
        </div>

        <button
          onClick={handleCustomTranslation}
          disabled={!customMessage.trim() || isTranslating}
          style={{
            ...componentStyles.button.primary,
            width: '100%',
            opacity: (!customMessage.trim() || isTranslating) ? 0.6 : 1,
            cursor: (!customMessage.trim() || isTranslating) ? 'not-allowed' : 'pointer',
          }}
        >
          <Sparkles size={16} style={{ marginRight: 8 }} />
          {isTranslating ? 'Translating...' : `Translate to ${recipientDialect === 'astrology' ? 'Astrology' : 'Cosmetology'}`}
        </button>
      </div>
    </div>
  );
}