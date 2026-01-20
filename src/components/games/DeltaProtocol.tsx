/**
 * @license
 * Copyright 2026 Wonky Sprout DUNA
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/**
 * THE DELTA PROTOCOL - Playable Prototype
 * Build your first Tetrahedron and resist the Convergence
 */

import React, { useState, useCallback, useEffect } from 'react';

type NodeType = 'Sensor' | 'Pattern' | 'HyperFocus' | 'Connector';
type FactionType = 'Singular' | 'Delta' | 'Convergence' | null;

interface Node {
  id: string;
  type: NodeType;
  faction: FactionType;
  vpiPhase: number; // 0-4 (unhardened to fully hardened)
  stress: number; // 0-100
  connectionStrength: number; // 0-100
}

const NODE_INFO: Record<NodeType, { 
  color: string;
  icon: string;
  strength: string;
  weakness: string;
  description: string;
}> = {
  Sensor: {
    color: '#3B82F6',
    icon: '👁️',
    strength: 'Detects threats early',
    weakness: 'Overloads under many signals',
    description: 'High sensory sensitivity. Sees danger others miss.',
  },
  Pattern: {
    color: '#8B5CF6',
    icon: '🧩',
    strength: 'Optimizes routes',
    weakness: 'Gets stuck in loops',
    description: 'Pattern recognition master. Finds the hidden structure.',
  },
  HyperFocus: {
    color: '#10B981',
    icon: '🎯',
    strength: 'Deep work maintenance',
    weakness: 'Tunnel vision',
    description: 'Sustained attention. Builds infrastructure that lasts.',
  },
  Connector: {
    color: '#F59E0B',
    icon: '🤝',
    strength: 'Translates between types',
    weakness: 'Burnout from translation',
    description: 'Social bridge. Makes the incompatible work together.',
  },
};

const VPI_PHASES = [
  'Porous',
  'Vacuum',
  'Resin',
  'Pressure',
  'Cured',
];

export const DeltaProtocol: React.FC = () => {
  const [gamePhase, setGamePhase] = useState<'intro' | 'building' | 'vpi' | 'abdication' | 'victory'>('intro');
  const [nodes, setNodes] = useState<Node[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);
  const [convergenceAttacks, setConvergenceAttacks] = useState(0);

  // Initialize 4 nodes
  useEffect(() => {
    if (nodes.length === 0 && gamePhase === 'building') {
      setNodes([
        { id: 'n1', type: 'Sensor', faction: null, vpiPhase: 0, stress: 0, connectionStrength: 0 },
        { id: 'n2', type: 'Pattern', faction: null, vpiPhase: 0, stress: 0, connectionStrength: 0 },
        { id: 'n3', type: 'HyperFocus', faction: null, vpiPhase: 0, stress: 0, connectionStrength: 0 },
        { id: 'n4', type: 'Connector', faction: null, vpiPhase: 0, stress: 0, connectionStrength: 0 },
      ]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gamePhase]);

  const claimNode = useCallback((nodeId: string, faction: FactionType) => {
    setNodes(prev => prev.map(n => 
      n.id === nodeId ? { ...n, faction } : n
    ));
    
    if (faction === 'Delta') {
      setMessage(`✅ ${nodes.find(n => n.id === nodeId)?.type} node joined the Delta!`);
      setScore(prev => prev + 10);
    }
  }, [nodes]);

  const performVPI = useCallback(() => {
    if (!selectedNode) return;
    
    setNodes(prev => prev.map(n => {
      if (n.id === selectedNode && n.vpiPhase < 4) {
        const newPhase = n.vpiPhase + 1;
        setMessage(`🛡️ VPI Phase ${newPhase}: ${VPI_PHASES[newPhase]}`);
        setScore(s => s + 25);
        return { ...n, vpiPhase: newPhase, stress: Math.max(0, n.stress - 20) };
      }
      return n;
    }));
  }, [selectedNode]);

  const attemptAbdication = useCallback(() => {
    const deltaNodes = nodes.filter(n => n.faction === 'Delta');
    const fullyHardened = deltaNodes.filter(n => n.vpiPhase === 4);
    
    if (fullyHardened.length === 4) {
      setGamePhase('abdication');
      setMessage('🜂 ALL NODES HARDENED! Performing Abdication...');
      setScore(prev => prev + 100);
      setTimeout(() => {
        setGamePhase('victory');
        setMessage('💚 GREEN BOARD! The Tetrahedron is headless and immortal!');
      }, 2000);
    } else {
      setMessage(`⚠️ Need all 4 nodes fully hardened. Currently: ${fullyHardened.length}/4`);
    }
  }, [nodes]);

  const resistConvergence = useCallback(() => {
    // Convergence attacks random node
    const vulnerableNodes = nodes.filter(n => n.faction === 'Delta' && n.vpiPhase < 4);
    if (vulnerableNodes.length > 0) {
      const target = vulnerableNodes[Math.floor(Math.random() * vulnerableNodes.length)];
      setNodes(prev => prev.map(n => 
        n.id === target.id ? { ...n, stress: Math.min(100, n.stress + 30) } : n
      ));
      setMessage(`⚠️ Convergence attacked ${target.type} node! Stress increased!`);
      setConvergenceAttacks(prev => prev + 1);
      
      if (target.stress > 70 && target.vpiPhase < 2) {
        setMessage(`🔴 ${target.type} node compromised! Perform VPI immediately!`);
      }
    }
  }, [nodes]);

  const tetrahedronComplete = nodes.filter(n => n.faction === 'Delta').length === 4;
  const allHardened = nodes.filter(n => n.vpiPhase === 4).length === 4;

  if (gamePhase === 'intro') {
    return (
      <div style={{
        background: '#1F2937',
        borderRadius: '16px',
        padding: '32px',
        border: '2px solid #374151',
        maxWidth: '800px',
        margin: '0 auto',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🜂</div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 700,
            color: '#F3F4F6',
            margin: '0 0 8px 0',
          }}>
            THE DELTA PROTOCOL
          </h1>
          <p style={{ fontSize: '16px', color: '#9CA3AF', margin: 0 }}>
            Playable Prototype - Act I: The Porous Self
          </p>
        </div>

        <div style={{
          background: '#111827',
          padding: '24px',
          borderRadius: '12px',
          marginBottom: '24px',
        }}>
          <h2 style={{ fontSize: '18px', color: '#10B981', marginBottom: '12px' }}>Your Mission:</h2>
          <ol style={{ color: '#D1D5DB', fontSize: '14px', lineHeight: '1.8', paddingLeft: '20px' }}>
            <li>Claim 4 different node types for the Delta</li>
            <li>Harden each node using the VPI Protocol (4 phases)</li>
            <li>Resist Convergence attacks</li>
            <li>Perform the Abdication Ritual</li>
          </ol>
        </div>

        <div style={{
          background: '#1E293B',
          padding: '16px',
          borderRadius: '8px',
          borderLeft: '3px solid #F59E0B',
          marginBottom: '24px',
        }}>
          <p style={{ fontSize: '13px', color: '#F59E0B', margin: 0 }}>
            <strong>Remember:</strong> Diversity creates stability. A Tetrahedron needs 4 DIFFERENT nodes. 
            Connection without protocol is assimilation. Protocol without connection is isolation.
          </p>
        </div>

        <button
          onClick={() => setGamePhase('building')}
          style={{
            width: '100%',
            padding: '16px',
            background: 'linear-gradient(135deg, #0891B2 0%, #06B6D4 100%)',
            border: 'none',
            borderRadius: '12px',
            color: '#FFF',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          🚀 Begin Mission
        </button>
      </div>
    );
  }

  if (gamePhase === 'victory') {
    return (
      <div style={{
        background: '#1F2937',
        borderRadius: '16px',
        padding: '32px',
        border: '2px solid #10B981',
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '80px', marginBottom: '16px' }}>💚</div>
        <h1 style={{ fontSize: '36px', color: '#10B981', marginBottom: '12px' }}>
          GREEN BOARD
        </h1>
        <p style={{ fontSize: '18px', color: '#D1D5DB', marginBottom: '24px' }}>
          The Tetrahedron is Complete
        </p>
        
        <div style={{
          background: '#111827',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '24px',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>
            ▲▼
          </div>
          <p style={{ fontSize: '14px', color: '#9CA3AF', fontStyle: 'italic' }}>
            "We are not assimilated. We are not isolated. We are federated."
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          marginBottom: '24px',
        }}>
          <div style={{ background: '#1E293B', padding: '16px', borderRadius: '8px' }}>
            <div style={{ fontSize: '24px', color: '#10B981', fontWeight: 600 }}>
              {score}
            </div>
            <div style={{ fontSize: '12px', color: '#9CA3AF' }}>Points Earned</div>
          </div>
          <div style={{ background: '#1E293B', padding: '16px', borderRadius: '8px' }}>
            <div style={{ fontSize: '24px', color: '#F59E0B', fontWeight: 600 }}>
              {convergenceAttacks}
            </div>
            <div style={{ fontSize: '12px', color: '#9CA3AF' }}>Attacks Resisted</div>
          </div>
        </div>

        <div style={{
          background: '#1E293B',
          padding: '16px',
          borderRadius: '8px',
          borderLeft: '3px solid #10B981',
          marginBottom: '24px',
        }}>
          <p style={{ fontSize: '13px', color: '#10B981', margin: 0 }}>
            <strong>Achievement Unlocked:</strong> "The First Tetrahedron" - You've built your first headless mesh cluster. 
            The protocol is now autonomous and immortal.
          </p>
        </div>

        <button
          onClick={() => {
            setGamePhase('intro');
            setNodes([]);
            setScore(0);
            setConvergenceAttacks(0);
            setMessage('');
          }}
          style={{
            width: '100%',
            padding: '16px',
            background: 'linear-gradient(135deg, #0891B2 0%, #06B6D4 100%)',
            border: 'none',
            borderRadius: '12px',
            color: '#FFF',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          🔄 Play Again
        </button>
      </div>
    );
  }

  return (
    <div style={{
      background: '#1F2937',
      borderRadius: '16px',
      padding: '24px',
      border: '2px solid #374151',
      maxWidth: '1000px',
      margin: '0 auto',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
      }}>
        <div>
          <h2 style={{ fontSize: '24px', color: '#F3F4F6', margin: 0 }}>
            🜂 Delta Protocol
          </h2>
          <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '4px 0 0 0' }}>
            Build your Tetrahedron
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', color: '#10B981', fontWeight: 600 }}>
              {score}
            </div>
            <div style={{ fontSize: '10px', color: '#9CA3AF' }}>SCORE</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', color: '#F59E0B', fontWeight: 600 }}>
              {nodes.filter(n => n.faction === 'Delta').length}/4
            </div>
            <div style={{ fontSize: '10px', color: '#9CA3AF' }}>NODES</div>
          </div>
        </div>
      </div>

      {/* Message Bar */}
      {message && (
        <div style={{
          background: '#111827',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '16px',
          border: '1px solid #374151',
        }}>
          <p style={{ fontSize: '13px', color: '#D1D5DB', margin: 0 }}>
            {message}
          </p>
        </div>
      )}

      {/* Nodes Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px',
        marginBottom: '20px',
      }}>
        {nodes.map(node => {
          const info = NODE_INFO[node.type];
          const isSelected = selectedNode === node.id;
          
          return (
            <div
              key={node.id}
              onClick={() => setSelectedNode(node.id)}
              style={{
                background: isSelected ? '#1E293B' : '#111827',
                padding: '16px',
                borderRadius: '12px',
                border: `2px solid ${isSelected ? info.color : '#374151'}`,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '24px' }}>{info.icon}</span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: info.color }}>
                      {node.type}
                    </div>
                    <div style={{ fontSize: '10px', color: '#9CA3AF' }}>
                      {node.faction || 'Unclaimed'}
                    </div>
                  </div>
                </div>
                {node.faction === 'Delta' && (
                  <div style={{
                    background: node.vpiPhase === 4 ? '#10B98120' : '#F59E0B20',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    color: node.vpiPhase === 4 ? '#10B981' : '#F59E0B',
                    fontWeight: 600,
                  }}>
                    VPI: {VPI_PHASES[node.vpiPhase]}
                  </div>
                )}
              </div>

              {node.faction === 'Delta' && (
                <>
                  {/* Stress Bar */}
                  <div style={{ marginBottom: '8px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '10px',
                      color: '#9CA3AF',
                      marginBottom: '4px',
                    }}>
                      <span>Stress</span>
                      <span>{node.stress}%</span>
                    </div>
                    <div style={{
                      height: '4px',
                      background: '#374151',
                      borderRadius: '2px',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        width: `${node.stress}%`,
                        height: '100%',
                        background: node.stress > 70 ? '#EF4444' : node.stress > 40 ? '#F59E0B' : '#10B981',
                        transition: 'all 0.3s',
                      }} />
                    </div>
                  </div>

                  {/* Info */}
                  <p style={{ fontSize: '11px', color: '#9CA3AF', margin: '0 0 8px 0' }}>
                    {info.description}
                  </p>
                  <div style={{ fontSize: '10px' }}>
                    <div style={{ color: '#10B981', marginBottom: '2px' }}>
                      ✓ {info.strength}
                    </div>
                    <div style={{ color: '#EF4444' }}>
                      ✗ {info.weakness}
                    </div>
                  </div>
                </>
              )}

              {!node.faction && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    claimNode(node.id, 'Delta');
                  }}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: 'linear-gradient(135deg, #0891B2 0%, #06B6D4 100%)',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#FFF',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginTop: '8px',
                  }}
                >
                  Claim for Delta
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        <button
          onClick={performVPI}
          disabled={!selectedNode || nodes.find(n => n.id === selectedNode)?.vpiPhase === 4}
          style={{
            padding: '12px',
            background: selectedNode && nodes.find(n => n.id === selectedNode)?.vpiPhase !== 4
              ? 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'
              : '#37415150',
            border: 'none',
            borderRadius: '8px',
            color: '#FFF',
            fontSize: '13px',
            fontWeight: 600,
            cursor: selectedNode ? 'pointer' : 'not-allowed',
          }}
        >
          🛡️ Perform VPI
        </button>

        <button
          onClick={resistConvergence}
          disabled={!tetrahedronComplete}
          style={{
            padding: '12px',
            background: tetrahedronComplete
              ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
              : '#37415150',
            border: 'none',
            borderRadius: '8px',
            color: '#FFF',
            fontSize: '13px',
            fontWeight: 600,
            cursor: tetrahedronComplete ? 'pointer' : 'not-allowed',
          }}
        >
          ⚔️ Resist Attack
        </button>

        <button
          onClick={attemptAbdication}
          disabled={!allHardened}
          style={{
            padding: '12px',
            background: allHardened
              ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
              : '#37415150',
            border: 'none',
            borderRadius: '8px',
            color: '#FFF',
            fontSize: '13px',
            fontWeight: 600,
            cursor: allHardened ? 'pointer' : 'not-allowed',
          }}
        >
          🜂 Abdicate
        </button>
      </div>

      {/* Progress Indicator */}
      <div style={{
        marginTop: '20px',
        padding: '16px',
        background: '#111827',
        borderRadius: '8px',
      }}>
        <div style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '8px' }}>
          Progress to Abdication:
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px',
        }}>
          {nodes.map((node, i) => (
            <div key={i} style={{
              padding: '8px',
              background: node.vpiPhase === 4 ? '#10B98120' : '#37415120',
              borderRadius: '6px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '18px', marginBottom: '4px' }}>
                {node.vpiPhase === 4 ? '✅' : node.faction === 'Delta' ? '🔄' : '⭕'}
              </div>
              <div style={{
                fontSize: '10px',
                color: node.vpiPhase === 4 ? '#10B981' : '#9CA3AF',
              }}>
                {VPI_PHASES[node.vpiPhase]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
