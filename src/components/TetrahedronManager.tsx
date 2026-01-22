/**
 * TETRAHEDRON MANAGER COMPONENT
 * UI for managing K4 topology groups and monitoring heartbeats
 */

import React, { useState, useEffect } from 'react';
import { Users, Heart, Zap, Battery, Brain, AlertTriangle } from 'lucide-react';
import { componentStyles } from '../config/design-tokens';
import GOD_CONFIG from '../god.config';
import TetrahedronService from '../services/tetrahedron.service';
import useHeartbeatStore from '../store/heartbeat.store';
import type { TetrahedronGroup, TetrahedronHeartbeat } from '../types/heartbeat.types';

export function TetrahedronManager() {
  const [tetrahedrons, setTetrahedrons] = useState<TetrahedronGroup[]>([]);
  const [selectedTetrahedron, setSelectedTetrahedron] = useState<string | null>(null);
  const [heartbeats, setHeartbeats] = useState<Map<string, TetrahedronHeartbeat[]>>(new Map());
  const [neuralEntropy, setNeuralEntropy] = useState(50);

  const tetrahedronService = TetrahedronService.getInstance();
  const { myPeerId, mesh } = useHeartbeatStore();

  useEffect(() => {
    // Load tetrahedrons
    setTetrahedrons(tetrahedronService.getActiveTetrahedrons());

    // Simulate accelerometer data (would be real sensor data in hardware)
    const interval = setInterval(() => {
      const x = (Math.random() - 0.5) * 2;
      const y = (Math.random() - 0.5) * 2;
      const z = (Math.random() - 0.5) * 2;
      tetrahedronService.addAccelerometerSample(x, y, z);

      const entropy = tetrahedronService.calculateNeuralEntropy();
      setNeuralEntropy(entropy);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleCreateTetrahedron = () => {
    if (!myPeerId) return;

    // Generate mock member IDs for demonstration
    const members: [string, string, string, string] = [
      myPeerId,
      `peer-${Date.now()}-1`,
      `peer-${Date.now()}-2`,
      `peer-${Date.now()}-3`
    ];

    try {
      const tetrahedron = tetrahedronService.registerTetrahedron(members);
      setTetrahedrons([...tetrahedrons, tetrahedron]);
    } catch (error) {
      console.error('Failed to create tetrahedron:', error);
    }
  };

  const handleSendHeartbeat = (tetrahedronId: string) => {
    if (!myPeerId || !mesh) return;

    const heartbeat = tetrahedronService.generateHeartbeat(myPeerId, tetrahedronId);
    mesh.sendTetrahedronHeartbeat(heartbeat, tetrahedronId);
  };

  const getEntropyColor = (entropy: number) => {
    if (entropy < 30) return GOD_CONFIG.theme.colors.error; // Frozen
    if (entropy > 70) return GOD_CONFIG.theme.colors.warning; // Chaotic
    return GOD_CONFIG.theme.colors.success; // Flow state
  };

  const getEntropyLabel = (entropy: number) => {
    if (entropy < 30) return 'Frozen';
    if (entropy > 70) return 'Chaotic';
    return 'Flow';
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{
        ...componentStyles.card,
        marginBottom: '24px'
      }}>
        <h2 style={{
          ...componentStyles.text.primary,
          fontSize: '24px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Users size={28} />
          Tetrahedron Protocol (K₄ Topology)
        </h2>

        <p style={{
          ...componentStyles.text.secondary,
          marginBottom: '20px',
          lineHeight: 1.6
        }}>
          "The minimum structural system in Universe. Four vertices enclose volume,
          creating the distinction between Inside (High Trust) and Outside (Low Trust)."
        </p>

        {/* Neural Entropy Monitor */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '24px',
          padding: '16px',
          backgroundColor: GOD_CONFIG.theme.bg.secondary,
          borderRadius: '8px'
        }}>
          <Brain size={24} color={getEntropyColor(neuralEntropy)} />
          <div>
            <div style={{
              ...componentStyles.text.primary,
              fontSize: '18px',
              fontWeight: '600',
              color: getEntropyColor(neuralEntropy)
            }}>
              Neural Entropy: {neuralEntropy.toFixed(1)}%
            </div>
            <div style={{
              ...componentStyles.text.secondary,
              fontSize: '14px'
            }}>
              {getEntropyLabel(neuralEntropy)} State
            </div>
          </div>
        </div>

        {/* Create Tetrahedron Button */}
        <button
          onClick={handleCreateTetrahedron}
          disabled={!myPeerId}
          style={{
            ...componentStyles.button.primary,
            width: '100%',
            marginBottom: '24px'
          }}
        >
          Create New Tetrahedron (K₄ Group)
        </button>
      </div>

      {/* Tetrahedron List */}
      <div style={{
        display: 'grid',
        gap: '16px'
      }}>
        {tetrahedrons.map(tetrahedron => (
          <div
            key={tetrahedron.id}
            style={{
              ...componentStyles.card,
              cursor: 'pointer',
              border: selectedTetrahedron === tetrahedron.id
                ? `2px solid ${GOD_CONFIG.theme.colors.cosmic}`
                : `1px solid ${GOD_CONFIG.theme.colors.gray[700]}`,
            }}
            onClick={() => setSelectedTetrahedron(
              selectedTetrahedron === tetrahedron.id ? null : tetrahedron.id
            )}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '12px'
            }}>
              <div>
                <h3 style={{
                  ...componentStyles.text.primary,
                  fontSize: '18px',
                  marginBottom: '4px'
                }}>
                  Tetrahedron {tetrahedron.id.slice(0, 8)}...
                </h3>
                <p style={{
                  ...componentStyles.text.secondary,
                  fontSize: '14px'
                }}>
                  Created {new Date(tetrahedron.created).toLocaleDateString()}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSendHeartbeat(tetrahedron.id);
                }}
                style={{
                  ...componentStyles.button.secondary,
                  padding: '8px 16px'
                }}
              >
                <Heart size={16} style={{ marginRight: '8px' }} />
                Send Heartbeat
              </button>
            </div>

            {/* Members */}
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{
                ...componentStyles.text.primary,
                fontSize: '14px',
                marginBottom: '8px'
              }}>
                Members (K₄ Topology):
              </h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '8px'
              }}>
                {tetrahedron.members.map((memberId, index) => (
                  <div
                    key={memberId}
                    style={{
                      padding: '8px',
                      backgroundColor: memberId === myPeerId
                        ? GOD_CONFIG.theme.colors.cosmic + '20'
                        : GOD_CONFIG.theme.bg.secondary,
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontFamily: 'monospace',
                      border: memberId === myPeerId
                        ? `1px solid ${GOD_CONFIG.theme.colors.cosmic}`
                        : 'none'
                    }}
                  >
                    {memberId === myPeerId ? '👤 ' : '👥 '}
                    {memberId.slice(0, 8)}...
                  </div>
                ))}
              </div>
            </div>

            {/* Expanded Details */}
            {selectedTetrahedron === tetrahedron.id && (
              <div style={{
                marginTop: '16px',
                padding: '16px',
                backgroundColor: GOD_CONFIG.theme.bg.secondary,
                borderRadius: '8px'
              }}>
                <h4 style={{
                  ...componentStyles.text.primary,
                  fontSize: '16px',
                  marginBottom: '12px'
                }}>
                  Tetrahedron Properties
                </h4>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px'
                }}>
                  <div>
                    <strong>Topology:</strong> K₄ (Complete Graph)
                  </div>
                  <div>
                    <strong>Vertices:</strong> 4
                  </div>
                  <div>
                    <strong>Edges:</strong> 6
                  </div>
                  <div>
                    <strong>Rigidity:</strong> Isostatically Rigid
                  </div>
                  <div>
                    <strong>Connectivity:</strong> Degree 3
                  </div>
                  <div>
                    <strong>Trust Model:</strong> Simmelian Ties
                  </div>
                </div>

                <div style={{
                  marginTop: '16px',
                  padding: '12px',
                  backgroundColor: GOD_CONFIG.theme.bg.tertiary,
                  borderRadius: '6px'
                }}>
                  <p style={{
                    ...componentStyles.text.secondary,
                    fontSize: '14px',
                    margin: 0,
                    fontStyle: 'italic'
                  }}>
                    "The tetrahedron is the first shape to enclose volume. Four points define
                    the boundary between Inside (High Trust) and Outside (Low Trust)."
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}

        {tetrahedrons.length === 0 && (
          <div style={{
            ...componentStyles.card,
            textAlign: 'center',
            padding: '40px'
          }}>
            <Users size={48} color={GOD_CONFIG.theme.colors.gray[500]} />
            <h3 style={{
              ...componentStyles.text.primary,
              marginTop: '16px',
              marginBottom: '8px'
            }}>
              No Tetrahedrons Yet
            </h3>
            <p style={{
              ...componentStyles.text.secondary,
              marginBottom: '24px'
            }}>
              Create your first K₄ group to establish High Trust zones in the mesh.
            </p>
            <button
              onClick={handleCreateTetrahedron}
              disabled={!myPeerId}
              style={componentStyles.button.primary}
            >
              Create Genesis Tetrahedron
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TetrahedronManager;