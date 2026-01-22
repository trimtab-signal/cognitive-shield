/**
 * LIVING DOCUMENT SYSTEM
 * Google Workspace integration with tetrahedral architecture
 * Self-sovereign living documents with cognitive jitterbug UI
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FileText, Folder, Database, Shield, Zap, Users, Globe, Brain, Infinity, Star, AlertTriangle, CheckCircle, Clock, Target } from 'lucide-react';
import { componentStyles, CosmicTheme, COLORS } from '../config/design-tokens';
import GOD_CONFIG from '../god.config';

interface DocumentNode {
  id: string;
  name: string;
  type: 'folder' | 'document' | 'sheet' | 'slide';
  path: string[];
  tetrahedralVertices: {
    structure: number; // Technical competence
    organization: number; // Passion & trimtab
    housekeeping: number; // Environmental control
    connection: number; // Authentic communication
  };
  entropy: number; // Current disorder level
  lastModified: Date;
  owner: string;
  permissions: string[];
  tags: string[];
  coherence: number;
  jitterbugPhase: number; // 0-1 representing thinking process
}

interface TetrahedralPod {
  id: string;
  name: string;
  members: string[];
  documents: string[];
  coherence: number;
  stabilityIndex: number;
  creationPotential: number;
  entropy: number;
}

interface SystemMetrics {
  globalCoherence: number;
  dataIntegrity: number;
  processEfficiency: number;
  entropyLevel: number;
  tetrahedralStability: number;
  floatingNeutralRisk: number;
}

export function LivingDocumentSystem() {
  const [documentTree, setDocumentTree] = useState<DocumentNode[]>([
    {
      id: 'root',
      name: 'Geodesic Workspace',
      type: 'folder',
      path: [],
      tetrahedralVertices: { structure: 85, organization: 78, housekeeping: 92, connection: 88 },
      entropy: 15,
      lastModified: new Date(),
      owner: 'Operator',
      permissions: ['admin'],
      tags: ['root', 'immutable'],
      coherence: 88,
      jitterbugPhase: 0.2
    },
    {
      id: 'biography',
      name: '01_Geodesic_Self',
      type: 'folder',
      path: ['Geodesic Workspace'],
      tetrahedralVertices: { structure: 92, organization: 85, housekeeping: 88, connection: 95 },
      entropy: 8,
      lastModified: new Date(Date.now() - 86400000),
      owner: 'Operator',
      permissions: ['admin', 'contributors'],
      tags: ['biography', 'narrative', 'identity'],
      coherence: 92,
      jitterbugPhase: 0.1
    },
    {
      id: 'defensive-publication',
      name: '02_Iron_Dome',
      type: 'folder',
      path: ['Geodesic Workspace'],
      tetrahedralVertices: { structure: 95, organization: 88, housekeeping: 90, connection: 82 },
      entropy: 12,
      lastModified: new Date(Date.now() - 43200000),
      owner: 'Operator',
      permissions: ['admin', 'legal'],
      tags: ['defensive', 'publication', 'patent', 'ip'],
      coherence: 89,
      jitterbugPhase: 0.3
    },
    {
      id: 'quantum-biology',
      name: '03_Fisher_Escola',
      type: 'folder',
      path: ['Geodesic Workspace'],
      tetrahedralVertices: { structure: 98, organization: 85, housekeeping: 92, connection: 87 },
      entropy: 6,
      lastModified: new Date(Date.now() - 21600000),
      owner: 'Operator',
      permissions: ['admin', 'science'],
      tags: ['quantum', 'biology', 'posner', 'coherence'],
      coherence: 95,
      jitterbugPhase: 0.05
    },
    {
      id: 'business-plan',
      name: '04_Tetrahedral_Business',
      type: 'folder',
      path: ['Geodesic Workspace'],
      tetrahedralVertices: { structure: 88, organization: 95, housekeeping: 82, connection: 90 },
      entropy: 18,
      lastModified: new Date(Date.now() - 3600000),
      owner: 'Operator',
      permissions: ['admin', 'business'],
      tags: ['business', 'tetrahedral', 'strategy', 'delta'],
      coherence: 86,
      jitterbugPhase: 0.7
    }
  ]);

  const [tetrahedralPods, setTetrahedralPods] = useState<TetrahedralPod[]>([
    {
      id: 'core-pod',
      name: 'Core Tetrahedron',
      members: ['Operator', 'AI-Assistant', 'Validation-System'],
      documents: ['biography', 'defensive-publication', 'quantum-biology'],
      coherence: 89,
      stabilityIndex: 94,
      creationPotential: 91,
      entropy: 9
    },
    {
      id: 'business-pod',
      name: 'Business Tetrahedron',
      members: ['Operator', 'Strategy-AI', 'Financial-System'],
      documents: ['business-plan'],
      coherence: 82,
      stabilityIndex: 87,
      creationPotential: 85,
      entropy: 15
    }
  ]);

  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    globalCoherence: 87,
    dataIntegrity: 94,
    processEfficiency: 89,
    entropyLevel: 12,
    tetrahedralStability: 91,
    floatingNeutralRisk: 8
  });

  const [selectedDocument, setSelectedDocument] = useState<string | null>('biography');
  const [activePod, setActivePod] = useState<string>('core-pod');
  const [jitterbugPhase, setJitterbugPhase] = useState(0);
  const [showJitterbug, setShowJitterbug] = useState(false);

  // Simulate system evolution
  useEffect(() => {
    const interval = setInterval(() => {
      // Update document coherence and entropy
      setDocumentTree(prev => prev.map(doc => ({
        ...doc,
        coherence: Math.max(0, Math.min(100, doc.coherence + (Math.random() - 0.5) * 2)),
        entropy: Math.max(0, Math.min(100, doc.entropy + (Math.random() - 0.5) * 1.5)),
        jitterbugPhase: Math.max(0, Math.min(1, doc.jitterbugPhase + (Math.random() - 0.5) * 0.1))
      })));

      // Update pod metrics
      setTetrahedralPods(prev => prev.map(pod => ({
        ...pod,
        coherence: Math.max(0, Math.min(100, pod.coherence + (Math.random() - 0.5) * 3)),
        stabilityIndex: Math.max(0, Math.min(100, pod.stabilityIndex + (Math.random() - 0.5) * 2)),
        entropy: Math.max(0, Math.min(100, pod.entropy + (Math.random() - 0.5) * 1))
      })));

      // Update system metrics
      const docs = documentTree;
      const pods = tetrahedralPods;
      const avgDocCoherence = docs.reduce((sum, doc) => sum + doc.coherence, 0) / docs.length;
      const avgPodStability = pods.reduce((sum, pod) => sum + pod.stabilityIndex, 0) / pods.length;
      const totalEntropy = docs.reduce((sum, doc) => sum + doc.entropy, 0) +
                          pods.reduce((sum, pod) => sum + pod.entropy, 0);

      setSystemMetrics({
        globalCoherence: avgDocCoherence,
        dataIntegrity: 95 + (Math.random() - 0.5) * 5,
        processEfficiency: avgPodStability,
        entropyLevel: totalEntropy / (docs.length + pods.length),
        tetrahedralStability: avgPodStability,
        floatingNeutralRisk: Math.max(0, 50 - avgDocCoherence)
      });

    }, 3000);

    return () => clearInterval(interval);
  }, [documentTree, tetrahedralPods]);

  const getJitterbugColor = (phase: number) => {
    if (phase < 0.3) return COLORS.cosmic; // Vector Equilibrium - Open
    if (phase < 0.7) return COLORS.warning; // Icosahedron - Processing
    return COLORS.success; // Tetrahedron - Resolved
  };

  const getStabilityColor = (value: number) => {
    if (value < 40) return COLORS.error;
    if (value < 70) return COLORS.warning;
    if (value < 90) return COLORS.success;
    return COLORS.cosmic;
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'folder': return Folder;
      case 'document': return FileText;
      case 'sheet': return Database;
      case 'slide': return Target;
      default: return FileText;
    }
  };

  const calculateTetrahedralStability = (vertices: DocumentNode['tetrahedralVertices']) => {
    const values = Object.values(vertices);
    const average = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / values.length;
    return Math.max(0, 100 - variance); // Lower variance = higher stability
  };

  return (
    <div style={{
      ...componentStyles.card,
      maxWidth: '2000px',
      margin: '0 auto',
      padding: CosmicTheme.spacing.xl,
      background: `linear-gradient(135deg, ${COLORS.cosmic}15, ${COLORS.love}15, ${COLORS.success}15, ${COLORS.warning}15)`,
      border: `4px solid ${COLORS.cosmic}60`
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: CosmicTheme.spacing.xl }}>
        <h1 style={{
          ...componentStyles.text.primary,
          fontSize: CosmicTheme.fontSizes.xxxl,
          marginBottom: CosmicTheme.spacing.sm,
          background: `linear-gradient(135deg, ${COLORS.cosmic}, ${COLORS.love}, ${COLORS.success}, ${COLORS.warning})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: `0 0 20px ${COLORS.cosmic}60`
        }}>
          📄 LIVING DOCUMENT SYSTEM
        </h1>
        <p style={{
          ...componentStyles.text.secondary,
          fontSize: CosmicTheme.fontSizes.lg,
          maxWidth: '1200px',
          margin: '0 auto',
          lineHeight: 1.6
        }}>
          "Self-sovereign workspace architecture. Tetrahedral pods prevent floating neutral failure.
          Cognitive jitterbug transforms thinking into geometric reality."
        </p>

        {/* System Status */}
        <div style={{
          marginTop: CosmicTheme.spacing.lg,
          display: 'flex',
          justifyContent: 'center',
          gap: CosmicTheme.spacing.xl
        }}>
          <div style={{
            padding: CosmicTheme.spacing.sm,
            backgroundColor: getStabilityColor(systemMetrics.globalCoherence) + '20',
            borderRadius: '8px',
            border: `2px solid ${getStabilityColor(systemMetrics.globalCoherence)}`
          }}>
            <div style={{
              fontSize: CosmicTheme.fontSizes.sm,
              color: getStabilityColor(systemMetrics.globalCoherence),
              fontWeight: 600
            }}>
              Global Coherence: {Math.round(systemMetrics.globalCoherence)}%
            </div>
          </div>

          <div style={{
            padding: CosmicTheme.spacing.sm,
            backgroundColor: getStabilityColor(systemMetrics.tetrahedralStability) + '20',
            borderRadius: '8px',
            border: `2px solid ${getStabilityColor(systemMetrics.tetrahedralStability)}`
          }}>
            <div style={{
              fontSize: CosmicTheme.fontSizes.sm,
              color: getStabilityColor(systemMetrics.tetrahedralStability),
              fontWeight: 600
            }}>
              Tetrahedral Stability: {Math.round(systemMetrics.tetrahedralStability)}%
            </div>
          </div>

          <div style={{
            padding: CosmicTheme.spacing.sm,
            backgroundColor: COLORS.error + '20',
            borderRadius: '8px',
            border: `2px solid ${COLORS.error}`
          }}>
            <div style={{
              fontSize: CosmicTheme.fontSizes.sm,
              color: COLORS.error,
              fontWeight: 600
            }}>
              Floating Neutral Risk: {Math.round(systemMetrics.floatingNeutralRisk)}%
            </div>
          </div>
        </div>
      </div>

      {/* Tetrahedral Pods */}
      <div style={{
        ...componentStyles.card,
        backgroundColor: COLORS.gray[900] + '60',
        backdropFilter: 'blur(10px)',
        marginBottom: CosmicTheme.spacing.xl
      }}>
        <h3 style={{
          ...componentStyles.text.primary,
          fontSize: CosmicTheme.fontSizes.xl,
          marginBottom: CosmicTheme.spacing.lg,
          display: 'flex',
          alignItems: 'center',
          gap: CosmicTheme.spacing.sm
        }}>
          <Users />
          Tetrahedral Pods
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: CosmicTheme.spacing.md
        }}>
          {tetrahedralPods.map(pod => (
            <div
              key={pod.id}
              style={{
                ...componentStyles.card,
                backgroundColor: activePod === pod.id ? COLORS.gray[800] : COLORS.gray[900],
                border: activePod === pod.id ? `3px solid ${COLORS.cosmic}` : `2px solid ${COLORS.gray[600]}`,
                cursor: 'pointer'
              }}
              onClick={() => setActivePod(activePod === pod.id ? '' : pod.id)}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: CosmicTheme.spacing.sm
              }}>
                <div style={{
                  fontSize: CosmicTheme.fontSizes.md,
                  color: COLORS.cosmic,
                  fontWeight: 600
                }}>
                  {pod.name}
                </div>
                <div style={{
                  fontSize: CosmicTheme.fontSizes.sm,
                  color: COLORS.gray[400]
                }}>
                  {pod.members.length} members • {pod.documents.length} docs
                </div>
              </div>

              {/* Pod Metrics */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: CosmicTheme.spacing.sm,
                marginBottom: CosmicTheme.spacing.sm
              }}>
                <div style={{
                  textAlign: 'center',
                  padding: CosmicTheme.spacing.xs,
                  backgroundColor: COLORS.gray[900],
                  borderRadius: '4px'
                }}>
                  <div style={{
                    fontSize: CosmicTheme.fontSizes.sm,
                    color: getStabilityColor(pod.coherence),
                    fontWeight: 600
                  }}>
                    {Math.round(pod.coherence)}%
                  </div>
                  <div style={{ fontSize: CosmicTheme.fontSizes.xs, color: COLORS.gray[500] }}>
                    Coherence
                  </div>
                </div>

                <div style={{
                  textAlign: 'center',
                  padding: CosmicTheme.spacing.xs,
                  backgroundColor: COLORS.gray[900],
                  borderRadius: '4px'
                }}>
                  <div style={{
                    fontSize: CosmicTheme.fontSizes.sm,
                    color: getStabilityColor(pod.stabilityIndex),
                    fontWeight: 600
                  }}>
                    {Math.round(pod.stabilityIndex)}%
                  </div>
                  <div style={{ fontSize: CosmicTheme.fontSizes.xs, color: COLORS.gray[500] }}>
                    Stability
                  </div>
                </div>
              </div>

              {/* Members and Documents */}
              <div style={{
                marginTop: CosmicTheme.spacing.sm
              }}>
                <div style={{
                  fontSize: CosmicTheme.fontSizes.xs,
                  color: COLORS.gray[400],
                  marginBottom: '4px'
                }}>
                  Members: {pod.members.join(', ')}
                </div>
                <div style={{
                  fontSize: CosmicTheme.fontSizes.xs,
                  color: COLORS.gray[400]
                }}>
                  Entropy: {Math.round(pod.entropy)}% • Creation Potential: {Math.round(pod.creationPotential)}%
                </div>
              </div>

              {/* Expanded Pod Details */}
              {activePod === pod.id && (
                <div style={{
                  marginTop: CosmicTheme.spacing.md,
                  padding: CosmicTheme.spacing.md,
                  backgroundColor: COLORS.gray[900],
                  borderRadius: '8px'
                }}>
                  <h4 style={{
                    ...componentStyles.text.primary,
                    fontSize: CosmicTheme.fontSizes.sm,
                    marginBottom: CosmicTheme.spacing.sm,
                    color: COLORS.love
                  }}>
                    Pod Documents
                  </h4>

                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}>
                    {pod.documents.map(docId => {
                      const doc = documentTree.find(d => d.id === docId);
                      return doc ? (
                        <div
                          key={doc.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: CosmicTheme.spacing.sm,
                            padding: '6px',
                            backgroundColor: COLORS.gray[800],
                            borderRadius: '4px'
                          }}
                        >
                          {React.createElement(getDocumentIcon(doc.type), {
                            size: 16,
                            color: COLORS.gray[400]
                          })}
                          <span style={{
                            fontSize: CosmicTheme.fontSizes.xs,
                            color: COLORS.gray[300]
                          }}>
                            {doc.name}
                          </span>
                          <div style={{
                            marginLeft: 'auto',
                            fontSize: CosmicTheme.fontSizes.xs,
                            color: getStabilityColor(doc.coherence)
                          }}>
                            {Math.round(doc.coherence)}%
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Document Tree */}
      <div style={{
        ...componentStyles.card,
        backgroundColor: COLORS.gray[900] + '60',
        backdropFilter: 'blur(10px)',
        marginBottom: CosmicTheme.spacing.xl
      }}>
        <h3 style={{
          ...componentStyles.text.primary,
          fontSize: CosmicTheme.fontSizes.xl,
          marginBottom: CosmicTheme.spacing.lg,
          display: 'flex',
          alignItems: 'center',
          gap: CosmicTheme.spacing.sm
        }}>
          <Folder />
          Living Document Tree
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: CosmicTheme.spacing.md
        }}>
          {documentTree.map(doc => (
            <div
              key={doc.id}
              style={{
                ...componentStyles.card,
                backgroundColor: selectedDocument === doc.id ? COLORS.gray[800] : COLORS.gray[900],
                border: selectedDocument === doc.id ? `3px solid ${getJitterbugColor(doc.jitterbugPhase)}` : `2px solid ${COLORS.gray[600]}`,
                cursor: 'pointer'
              }}
              onClick={() => {
                setSelectedDocument(selectedDocument === doc.id ? null : doc.id);
                if (doc.jitterbugPhase > 0.1) setShowJitterbug(true);
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: CosmicTheme.spacing.sm,
                marginBottom: CosmicTheme.spacing.sm
              }}>
                {React.createElement(getDocumentIcon(doc.type), {
                  size: 20,
                  color: getJitterbugColor(doc.jitterbugPhase)
                })}
                <div>
                  <div style={{
                    fontSize: CosmicTheme.fontSizes.sm,
                    color: getJitterbugColor(doc.jitterbugPhase),
                    fontWeight: 600
                  }}>
                    {doc.name}
                  </div>
                  <div style={{
                    fontSize: CosmicTheme.fontSizes.xs,
                    color: COLORS.gray[400]
                  }}>
                    {doc.path.join(' > ')} • {doc.owner}
                  </div>
                </div>
              </div>

              {/* Tetrahedral Vertices */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '4px',
                marginBottom: CosmicTheme.spacing.sm,
                fontSize: CosmicTheme.fontSizes.xs
              }}>
                <div style={{ color: COLORS.cosmic }}>Structure: {doc.tetrahedralVertices.structure}%</div>
                <div style={{ color: COLORS.love }}>Organization: {doc.tetrahedralVertices.organization}%</div>
                <div style={{ color: COLORS.success }}>Housekeeping: {doc.tetrahedralVertices.housekeeping}%</div>
                <div style={{ color: COLORS.warning }}>Connection: {doc.tetrahedralVertices.connection}%</div>
              </div>

              {/* Document Metrics */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: CosmicTheme.fontSizes.xs,
                color: COLORS.gray[400]
              }}>
                <span>Coherence: {Math.round(doc.coherence)}%</span>
                <span>Entropy: {Math.round(doc.entropy)}%</span>
                <span>Phase: {doc.jitterbugPhase.toFixed(2)}</span>
              </div>

              {/* Jitterbug Visualization */}
              {selectedDocument === doc.id && (
                <div style={{
                  marginTop: CosmicTheme.spacing.md,
                  padding: CosmicTheme.spacing.md,
                  backgroundColor: COLORS.gray[900],
                  borderRadius: '8px'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: CosmicTheme.spacing.sm
                  }}>
                    <div style={{
                      fontSize: CosmicTheme.fontSizes.sm,
                      color: getJitterbugColor(doc.jitterbugPhase),
                      fontWeight: 600
                    }}>
                      Cognitive Jitterbug Phase
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowJitterbug(!showJitterbug);
                      }}
                      style={{
                        ...componentStyles.button.primary,
                        padding: `${CosmicTheme.spacing.xs} ${CosmicTheme.spacing.sm}`,
                        fontSize: CosmicTheme.fontSizes.xs
                      }}
                    >
                      {showJitterbug ? 'Hide' : 'Show'} 3D
                    </button>
                  </div>

                  <div style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: COLORS.gray[700],
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${doc.jitterbugPhase * 100}%`,
                      height: '100%',
                      backgroundColor: getJitterbugColor(doc.jitterbugPhase),
                      transition: 'width 1s ease-in-out'
                    }} />
                  </div>

                  <div style={{
                    marginTop: '8px',
                    fontSize: CosmicTheme.fontSizes.xs,
                    color: COLORS.gray[400],
                    textAlign: 'center'
                  }}>
                    {doc.jitterbugPhase < 0.3 ? 'Vector Equilibrium - Open Potential' :
                     doc.jitterbugPhase < 0.7 ? 'Icosahedral Processing - Active Thinking' :
                     'Tetrahedral Resolution - Complete Thought'}
                  </div>

                  {/* Tags */}
                  <div style={{
                    marginTop: CosmicTheme.spacing.sm,
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '4px'
                  }}>
                    {doc.tags.map(tag => (
                      <div
                        key={tag}
                        style={{
                          padding: '2px 6px',
                          backgroundColor: COLORS.cosmic + '20',
                          borderRadius: '10px',
                          fontSize: CosmicTheme.fontSizes.xs,
                          color: COLORS.cosmic
                        }}
                      >
                        #{tag}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* System Integrity Dashboard */}
      <div style={{
        ...componentStyles.card,
        backgroundColor: COLORS.gray[900] + '60',
        backdropFilter: 'blur(10px)'
      }}>
        <h3 style={{
          ...componentStyles.text.primary,
          fontSize: CosmicTheme.fontSizes.xl,
          marginBottom: CosmicTheme.spacing.lg,
          display: 'flex',
          alignItems: 'center',
          gap: CosmicTheme.spacing.sm
        }}>
          <Shield />
          System Integrity Dashboard
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: CosmicTheme.spacing.md
        }}>
          <div style={{
            ...componentStyles.card,
            backgroundColor: COLORS.gray[800],
            textAlign: 'center',
            border: `2px solid ${getStabilityColor(systemMetrics.dataIntegrity)}`
          }}>
            <Database size={28} color={getStabilityColor(systemMetrics.dataIntegrity)} style={{ marginBottom: CosmicTheme.spacing.xs }} />
            <div style={{ fontSize: '28px', fontWeight: 600, color: getStabilityColor(systemMetrics.dataIntegrity), marginBottom: '4px' }}>
              {Math.round(systemMetrics.dataIntegrity)}%
            </div>
            <div style={{ fontSize: '12px', color: COLORS.gray[400] }}>Data Integrity</div>
          </div>

          <div style={{
            ...componentStyles.card,
            backgroundColor: COLORS.gray[800],
            textAlign: 'center',
            border: `2px solid ${getStabilityColor(systemMetrics.processEfficiency)}`
          }}>
            <Zap size={28} color={getStabilityColor(systemMetrics.processEfficiency)} style={{ marginBottom: CosmicTheme.spacing.xs }} />
            <div style={{ fontSize: '28px', fontWeight: 600, color: getStabilityColor(systemMetrics.processEfficiency), marginBottom: '4px' }}>
              {Math.round(systemMetrics.processEfficiency)}%
            </div>
            <div style={{ fontSize: '12px', color: COLORS.gray[400] }}>Process Efficiency</div>
          </div>

          <div style={{
            ...componentStyles.card,
            backgroundColor: COLORS.gray[800],
            textAlign: 'center',
            border: `2px solid ${COLORS.error}`
          }}>
            <AlertTriangle size={28} color={COLORS.error} style={{ marginBottom: CosmicTheme.spacing.xs }} />
            <div style={{ fontSize: '28px', fontWeight: 600, color: COLORS.error, marginBottom: '4px' }}>
              {Math.round(systemMetrics.entropyLevel)}%
            </div>
            <div style={{ fontSize: '12px', color: COLORS.gray[400] }}>System Entropy</div>
          </div>

          <div style={{
            ...componentStyles.card,
            backgroundColor: COLORS.gray[800],
            textAlign: 'center',
            border: `2px solid ${COLORS.success}`
          }}>
            <CheckCircle size={28} color={COLORS.success} style={{ marginBottom: CosmicTheme.spacing.xs }} />
            <div style={{ fontSize: '28px', fontWeight: 600, color: COLORS.success, marginBottom: '4px' }}>
              {Math.round(systemMetrics.tetrahedralStability)}%
            </div>
            <div style={{ fontSize: '12px', color: COLORS.gray[400] }}>Tetrahedral Stability</div>
          </div>
        </div>

        {/* System Philosophy */}
        <div style={{
          marginTop: CosmicTheme.spacing.xl,
          padding: CosmicTheme.spacing.xl,
          backgroundColor: COLORS.cosmic + '10',
          borderRadius: '12px',
          border: `2px solid ${COLORS.cosmic}30`
        }}>
          <h4 style={{
            ...componentStyles.text.primary,
            fontSize: CosmicTheme.fontSizes.md,
            marginBottom: CosmicTheme.spacing.md,
            color: COLORS.cosmic,
            textAlign: 'center'
          }}>
            🧬 Living Document Philosophy
          </h4>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: CosmicTheme.spacing.md
          }}>
            <div>
              <h5 style={{
                ...componentStyles.text.primary,
                fontSize: CosmicTheme.fontSizes.sm,
                marginBottom: CosmicTheme.spacing.xs,
                color: COLORS.cosmic
              }}>
                Tetrahedral Architecture
              </h5>
              <p style={{
                ...componentStyles.text.secondary,
                fontSize: CosmicTheme.fontSizes.xs,
                lineHeight: 1.6,
                margin: 0
              }}>
                Four vertices ensure structural integrity: Structure (competence), Organization (passion),
                Housekeeping (control), Connection (communication). No floating neutral failures.
              </p>
            </div>

            <div>
              <h5 style={{
                ...componentStyles.text.primary,
                fontSize: CosmicTheme.fontSizes.sm,
                marginBottom: CosmicTheme.spacing.xs,
                color: COLORS.love
              }}>
              Cognitive Jitterbug Process
              </h5>
              <p style={{
                ...componentStyles.text.secondary,
                fontSize: CosmicTheme.fontSizes.xs,
                lineHeight: 1.6,
                margin: 0
              }}>
                Thinking as geometric transformation: Vector Equilibrium (open potential) → Icosahedron (processing)
                → Tetrahedron (resolution). Visualizes the metabolic cost of cognition.
              </p>
            </div>

            <div>
              <h5 style={{
                ...componentStyles.text.primary,
                fontSize: CosmicTheme.fontSizes.sm,
                marginBottom: CosmicTheme.spacing.xs,
                color: COLORS.success
              }}>
                Self-Sovereign Operations
              </h5>
              <p style={{
                ...componentStyles.text.secondary,
                fontSize: CosmicTheme.fontSizes.xs,
                lineHeight: 1.6,
                margin: 0
              }}>
                Delta topology prevents central hub failures. Tetrahedral pods distribute load.
                Living documents evolve with coherence, not external mandates.
              </p>
            </div>

            <div>
              <h5 style={{
                ...componentStyles.text.primary,
                fontSize: CosmicTheme.fontSizes.sm,
                marginBottom: CosmicTheme.spacing.xs,
                color: COLORS.warning
              }}>
                Quantum Biology Integration
              </h5>
              <p style={{
                ...componentStyles.text.secondary,
                fontSize: CosmicTheme.fontSizes.xs,
                lineHeight: 1.6,
                margin: 0
              }}>
                Fisher-Escolà model grounds system in physical reality. Posner molecules and lithium
                isotopes explain cognitive coherence and metabolic stability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LivingDocumentSystem;