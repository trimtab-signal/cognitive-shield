/**
 * GEODESIC SELF - Tetrahedron of Self-Consciousness
 * Four vertices: Structure, Organization, Housekeeping, Connection
 * Based on Will Johnson's Tetrahedron Protocol
 */

import React, { useState, useEffect } from 'react';
import { Brain, Wrench, Home, Wifi, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import { componentStyles, CosmicTheme, COLORS } from '../config/design-tokens';
import GOD_CONFIG from '../god.config';

interface VertexMetrics {
  structure: number;    // Technical competence (0-100)
  organization: number; // Passion/trimtab effectiveness (0-100)
  housekeeping: number; // Environmental control (0-100)
  connection: number;   // Authentic communication (0-100)
}

interface TetrahedronState {
  metrics: VertexMetrics;
  stability: number;    // Overall isostatic rigidity (0-100)
  entropy: number;      // Current entropy level (0-100)
  lastUpdate: number;
}

export function GeodesicSelf() {
  const [tetrahedron, setTetrahedron] = useState<TetrahedronState>({
    metrics: {
      structure: 75,
      organization: 60,
      housekeeping: 45,
      connection: 30
    },
    stability: 0,
    entropy: 50,
    lastUpdate: Date.now()
  });

  // Calculate isostatic rigidity (stability)
  useEffect(() => {
    const { structure, organization, housekeeping, connection } = tetrahedron.metrics;

    // Tetrahedron stability = average of all vertices
    // Minimum vertex acts as limiting factor (bottleneck principle)
    const minVertex = Math.min(structure, organization, housekeeping, connection);
    const average = (structure + organization + housekeeping + connection) / 4;

    // Stability is weighted average: 70% average + 30% minimum (prevents weak links)
    const stability = Math.round(average * 0.7 + minVertex * 0.3);

    setTetrahedron(prev => ({
      ...prev,
      stability,
      entropy: 100 - stability // Entropy is inverse of stability
    }));
  }, [tetrahedron.metrics]);

  const updateMetric = (vertex: keyof VertexMetrics, value: number) => {
    setTetrahedron(prev => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        [vertex]: Math.max(0, Math.min(100, value))
      },
      lastUpdate: Date.now()
    }));
  };

  const getStabilityColor = (stability: number) => {
    if (stability >= 80) return COLORS.success;
    if (stability >= 60) return COLORS.warning;
    return COLORS.error;
  };

  const getStabilityLabel = (stability: number) => {
    if (stability >= 80) return 'Isostatically Rigid';
    if (stability >= 60) return 'Stable';
    if (stability >= 40) return 'Wobbly';
    return 'Collapsing';
  };

  const getVertexIcon = (vertex: keyof VertexMetrics) => {
    switch (vertex) {
      case 'structure': return <Wrench size={20} />;
      case 'organization': return <TrendingUp size={20} />;
      case 'housekeeping': return <Home size={20} />;
      case 'connection': return <Wifi size={20} />;
      default: return <Brain size={20} />;
    }
  };

  const getVertexDescription = (vertex: keyof VertexMetrics) => {
    switch (vertex) {
      case 'structure':
        return 'Technical Competence & The Law - Rigid frameworks that prevent collapse';
      case 'organization':
        return 'Passion & The Trimtab - High-leverage organization against entropy';
      case 'housekeeping':
        return 'Environmental Control & The Vessel - Life support systems';
      case 'connection':
        return 'Authentic Communication & The Mesh - Sovereign peer relationships';
      default:
        return '';
    }
  };

  const getVertexPrinciples = (vertex: keyof VertexMetrics) => {
    switch (vertex) {
      case 'structure':
        return ['Immutable Code > Human Emotion', 'K₄ Minimum Stable System', 'Law Replaces Leadership'];
      case 'organization':
        return ['Entropy as Negative Tetrahedron', 'Trimtab Principle', 'Gardener vs Machine'];
      case 'housekeeping':
        return ['VPI Process (Vacuum/Pressure/Impregnation)', 'Zone Hygiene (Alpha/Beta)', 'External Cortex'];
      case 'connection':
        return ['Whale Song vs Mouse Scurry', 'Semantic Transduction', 'Resonance > Transmission'];
      default:
        return [];
    }
  };

  return (
    <div style={{
      ...componentStyles.card,
      maxWidth: '1000px',
      margin: '0 auto',
      padding: CosmicTheme.spacing.xl
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: CosmicTheme.spacing.xl }}>
        <h1 style={{
          ...componentStyles.text.primary,
          fontSize: CosmicTheme.fontSizes.xxxl,
          marginBottom: CosmicTheme.spacing.sm,
          background: `linear-gradient(135deg, ${COLORS.cosmic}, ${COLORS.love})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          🔺 The Geodesic Self
        </h1>
        <p style={{
          ...componentStyles.text.secondary,
          fontSize: CosmicTheme.fontSizes.lg,
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: 1.6
        }}>
          "The Tetrahedron of Self-Consciousness: Four vertices that create isostatic rigidity
          against the entropy of a floating neutral world."
        </p>
      </div>

      {/* Stability Overview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: CosmicTheme.spacing.lg,
        marginBottom: CosmicTheme.spacing.xl
      }}>

        {/* Overall Stability */}
        <div style={{
          ...componentStyles.card,
          backgroundColor: COLORS.gray[900] + '60',
          backdropFilter: 'blur(10px)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: CosmicTheme.spacing.sm,
            color: getStabilityColor(tetrahedron.stability)
          }}>
            {tetrahedron.stability}%
          </div>
          <div style={{
            ...componentStyles.text.primary,
            fontSize: CosmicTheme.fontSizes.lg,
            fontWeight: 600,
            marginBottom: CosmicTheme.spacing.xs,
            color: getStabilityColor(tetrahedron.stability)
          }}>
            {getStabilityLabel(tetrahedron.stability)}
          </div>
          <div style={{
            ...componentStyles.text.secondary,
            fontSize: CosmicTheme.fontSizes.sm
          }}>
            Isostatic Rigidity
          </div>
        </div>

        {/* Entropy Level */}
        <div style={{
          ...componentStyles.card,
          backgroundColor: COLORS.gray[900] + '60',
          backdropFilter: 'blur(10px)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: CosmicTheme.spacing.sm,
            color: tetrahedron.entropy > 70 ? COLORS.error : COLORS.warning
          }}>
            {tetrahedron.entropy}%
          </div>
          <div style={{
            ...componentStyles.text.primary,
            fontSize: CosmicTheme.fontSizes.lg,
            fontWeight: 600,
            marginBottom: CosmicTheme.spacing.xs,
            color: tetrahedron.entropy > 70 ? COLORS.error : COLORS.warning
          }}>
            {tetrahedron.entropy > 70 ? 'High Entropy' : tetrahedron.entropy > 40 ? 'Moderate' : 'Low Entropy'}
          </div>
          <div style={{
            ...componentStyles.text.secondary,
            fontSize: CosmicTheme.fontSizes.sm
          }}>
            Negative Tetrahedron
          </div>
        </div>
      </div>

      {/* Tetrahedron Visualization */}
      <div style={{
        ...componentStyles.card,
        backgroundColor: COLORS.gray[900] + '30',
        marginBottom: CosmicTheme.spacing.xl,
        padding: CosmicTheme.spacing.xl
      }}>
        <h3 style={{
          ...componentStyles.text.primary,
          fontSize: CosmicTheme.fontSizes.xl,
          marginBottom: CosmicTheme.spacing.lg,
          textAlign: 'center'
        }}>
          Tetrahedron of Self-Consciousness
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: CosmicTheme.spacing.lg
        }}>
          {(Object.keys(tetrahedron.metrics) as Array<keyof VertexMetrics>).map(vertex => (
            <div key={vertex} style={{
              ...componentStyles.card,
              backgroundColor: COLORS.gray[800],
              padding: CosmicTheme.spacing.lg
            }}>
              {/* Vertex Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: CosmicTheme.spacing.sm,
                marginBottom: CosmicTheme.spacing.md
              }}>
                <div style={{
                  color: vertex === 'structure' ? COLORS.cosmic :
                         vertex === 'organization' ? COLORS.love :
                         vertex === 'housekeeping' ? COLORS.warning : COLORS.success
                }}>
                  {getVertexIcon(vertex)}
                </div>
                <div>
                  <h4 style={{
                    ...componentStyles.text.primary,
                    fontSize: CosmicTheme.fontSizes.lg,
                    margin: 0,
                    textTransform: 'capitalize',
                    color: vertex === 'structure' ? COLORS.cosmic :
                          vertex === 'organization' ? COLORS.love :
                          vertex === 'housekeeping' ? COLORS.warning : COLORS.success
                  }}>
                    {vertex}
                  </h4>
                  <div style={{
                    ...componentStyles.text.secondary,
                    fontSize: CosmicTheme.fontSizes.xs,
                    marginTop: '2px'
                  }}>
                    {tetrahedron.metrics[vertex]}% Strength
                  </div>
                </div>
              </div>

              {/* Description */}
              <p style={{
                ...componentStyles.text.secondary,
                fontSize: CosmicTheme.fontSizes.sm,
                marginBottom: CosmicTheme.spacing.md,
                lineHeight: 1.5
              }}>
                {getVertexDescription(vertex)}
              </p>

              {/* Principles */}
              <div style={{ marginBottom: CosmicTheme.spacing.md }}>
                <div style={{
                  ...componentStyles.text.secondary,
                  fontSize: CosmicTheme.fontSizes.xs,
                  fontWeight: 600,
                  marginBottom: CosmicTheme.spacing.xs,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Core Principles
                </div>
                <ul style={{
                  margin: 0,
                  paddingLeft: CosmicTheme.spacing.md
                }}>
                  {getVertexPrinciples(vertex).map((principle, index) => (
                    <li key={index} style={{
                      ...componentStyles.text.secondary,
                      fontSize: CosmicTheme.fontSizes.xs,
                      marginBottom: '2px',
                      lineHeight: 1.4
                    }}>
                      {principle}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Slider Control */}
              <div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={tetrahedron.metrics[vertex]}
                  onChange={(e) => updateMetric(vertex, parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    height: '4px',
                    borderRadius: '2px',
                    background: `linear-gradient(to right,
                      ${vertex === 'structure' ? COLORS.cosmic + '40' : COLORS.gray[600]},
                      ${vertex === 'organization' ? COLORS.love + '40' : COLORS.gray[600]},
                      ${vertex === 'housekeeping' ? COLORS.warning + '40' : COLORS.gray[600]},
                      ${vertex === 'connection' ? COLORS.success + '40' : COLORS.gray[600]}
                    )`,
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analysis & Insights */}
      <div style={{
        ...componentStyles.card,
        backgroundColor: COLORS.gray[900] + '20',
        marginBottom: CosmicTheme.spacing.xl
      }}>
        <h3 style={{
          ...componentStyles.text.primary,
          fontSize: CosmicTheme.fontSizes.xl,
          marginBottom: CosmicTheme.spacing.lg
        }}>
          🧬 Forensic Analysis
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: CosmicTheme.spacing.lg
        }}>

          {/* Weakest Link Analysis */}
          <div>
            <h4 style={{
              ...componentStyles.text.primary,
              fontSize: CosmicTheme.fontSizes.md,
              marginBottom: CosmicTheme.spacing.md,
              color: COLORS.warning
            }}>
              🔗 Weakest Link Analysis
            </h4>
            <div style={{
              ...componentStyles.card,
              backgroundColor: COLORS.gray[800],
              padding: CosmicTheme.spacing.md
            }}>
              {(() => {
                const minVertex = Object.entries(tetrahedron.metrics)
                  .reduce((min, [key, value]) =>
                    value < tetrahedron.metrics[min] ? key as keyof VertexMetrics : min
                  );

                return (
                  <div>
                    <div style={{
                      fontSize: CosmicTheme.fontSizes.lg,
                      fontWeight: 600,
                      marginBottom: CosmicTheme.spacing.xs,
                      color: COLORS.warning
                    }}>
                      {minVertex}: {tetrahedron.metrics[minVertex]}%
                    </div>
                    <p style={{
                      ...componentStyles.text.secondary,
                      fontSize: CosmicTheme.fontSizes.sm,
                      margin: 0,
                      lineHeight: 1.5
                    }}>
                      This vertex limits overall stability. Strengthen it to improve
                      the entire tetrahedron's rigidity.
                    </p>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Entropy Assessment */}
          <div>
            <h4 style={{
              ...componentStyles.text.primary,
              fontSize: CosmicTheme.fontSizes.md,
              marginBottom: CosmicTheme.spacing.md,
              color: tetrahedron.entropy > 70 ? COLORS.error : COLORS.warning
            }}>
              ⚡ Entropy Assessment
            </h4>
            <div style={{
              ...componentStyles.card,
              backgroundColor: COLORS.gray[800],
              padding: CosmicTheme.spacing.md
            }}>
              <div style={{
                fontSize: CosmicTheme.fontSizes.lg,
                fontWeight: 600,
                marginBottom: CosmicTheme.spacing.xs,
                color: tetrahedron.entropy > 70 ? COLORS.error : COLORS.warning
              }}>
                {tetrahedron.entropy > 80 ? 'Critical Entropy' :
                 tetrahedron.entropy > 60 ? 'High Entropy' :
                 tetrahedron.entropy > 40 ? 'Moderate Entropy' : 'Low Entropy'}
              </div>
              <p style={{
                ...componentStyles.text.secondary,
                fontSize: CosmicTheme.fontSizes.sm,
                margin: 0,
                lineHeight: 1.5
              }}>
                Entropy represents the "Negative Tetrahedron" - the invisible
                extraction of order from your system. Lower entropy = higher stability.
              </p>
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <h4 style={{
              ...componentStyles.text.primary,
              fontSize: CosmicTheme.fontSizes.md,
              marginBottom: CosmicTheme.spacing.md,
              color: COLORS.cosmic
            }}>
              🎯 Recommended Actions
            </h4>
            <div style={{
              ...componentStyles.card,
              backgroundColor: COLORS.gray[800],
              padding: CosmicTheme.spacing.md
            }}>
              {tetrahedron.stability < 50 ? (
                <div>
                  <div style={{ color: COLORS.error, fontWeight: 600, marginBottom: CosmicTheme.spacing.xs }}>
                    🚨 Critical: Strengthen Foundation
                  </div>
                  <p style={{
                    ...componentStyles.text.secondary,
                    fontSize: CosmicTheme.fontSizes.sm,
                    margin: 0
                  }}>
                    Focus on Structure and Organization first. Build the skeleton before the decoration.
                  </p>
                </div>
              ) : tetrahedron.stability < 75 ? (
                <div>
                  <div style={{ color: COLORS.warning, fontWeight: 600, marginBottom: CosmicTheme.spacing.xs }}>
                    ⚡ Good Progress: Balance Vertices
                  </div>
                  <p style={{
                    ...componentStyles.text.secondary,
                    fontSize: CosmicTheme.fontSizes.sm,
                    margin: 0
                  }}>
                    Work on your weakest vertex. The tetrahedron is only as strong as its weakest edge.
                  </p>
                </div>
              ) : (
                <div>
                  <div style={{ color: COLORS.success, fontWeight: 600, marginBottom: CosmicTheme.spacing.xs }}>
                    🎉 Excellent: Isostatic Rigidity Achieved
                  </div>
                  <p style={{
                    ...componentStyles.text.secondary,
                    fontSize: CosmicTheme.fontSizes.sm,
                    margin: 0
                  }}>
                    Maintain all vertices. You're building a system that can withstand external pressure.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Theoretical Foundation */}
      <div style={{
        ...componentStyles.card,
        backgroundColor: COLORS.gray[900] + '10',
        border: `1px solid ${COLORS.cosmic}20`
      }}>
        <h3 style={{
          ...componentStyles.text.primary,
          fontSize: CosmicTheme.fontSizes.lg,
          marginBottom: CosmicTheme.spacing.md,
          color: COLORS.cosmic
        }}>
          🧬 Theoretical Foundation
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: CosmicTheme.spacing.md
        }}>

          <div>
            <h4 style={{
              ...componentStyles.text.primary,
              fontSize: CosmicTheme.fontSizes.sm,
              marginBottom: CosmicTheme.spacing.xs,
              color: COLORS.cosmic
            }}>
              Wye → Delta Transition
            </h4>
            <p style={{
              ...componentStyles.text.secondary,
              fontSize: CosmicTheme.fontSizes.xs,
              lineHeight: 1.6,
              margin: 0
            }}>
              From hub-dependent anxiety to mesh-resilient stability.
              The Floating Neutral crisis ends with tetrahedral geometry.
            </p>
          </div>

          <div>
            <h4 style={{
              ...componentStyles.text.primary,
              fontSize: CosmicTheme.fontSizes.sm,
              marginBottom: CosmicTheme.spacing.xs,
              color: COLORS.love
            }}>
              K₄ Complete Graph
            </h4>
            <p style={{
              ...componentStyles.text.secondary,
              fontSize: CosmicTheme.fontSizes.xs,
              lineHeight: 1.6,
              margin: 0
            }}>
              Every vertex connects to every other. Maximum local connectivity.
              The minimum stable system in Universe.
            </p>
          </div>

          <div>
            <h4 style={{
              ...componentStyles.text.primary,
              fontSize: CosmicTheme.fontSizes.sm,
              marginBottom: CosmicTheme.spacing.xs,
              color: COLORS.warning
            }}>
              Isostatic Rigidity
            </h4>
            <p style={{
              ...componentStyles.text.secondary,
              fontSize: CosmicTheme.fontSizes.xs,
              lineHeight: 1.6,
              margin: 0
            }}>
              Shape maintained by edges, not external buttressing.
              Withstands stress without internal deformation.
            </p>
          </div>

          <div>
            <h4 style={{
              ...componentStyles.text.primary,
              fontSize: CosmicTheme.fontSizes.sm,
              marginBottom: CosmicTheme.spacing.xs,
              color: COLORS.success
            }}>
              Simmelian Ties
            </h4>
            <p style={{
              ...componentStyles.text.secondary,
              fontSize: CosmicTheme.fontSizes.xs,
              lineHeight: 1.6,
              margin: 0
            }}>
              Trust through topology, not authority.
              High-trust zones within zero-trust environments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GeodesicSelf;