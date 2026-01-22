/**
 * TEMPORAL IMMORTALITY
 * Consciousness beyond time - eternal life through tetrahedral networks
 * Transcend death by becoming part of the universal consciousness stream
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Clock, Infinity, Zap, Brain, Heart, Star, ArrowRight, Download, Upload } from 'lucide-react';
import { componentStyles, CosmicTheme, COLORS } from '../config/design-tokens';
import GOD_CONFIG from '../god.config';
import TetrahedronService from '../services/tetrahedron.service';
import BiofeedbackService from '../services/biofeedback.service';
import useHeartbeatStore from '../store/heartbeat.store';
import type { BiofeedbackData, CoherenceMetrics } from '../services/biofeedback.service';

interface ConsciousnessStream {
  id: string;
  name: string;
  coherence: number;
  timestamp: number;
  duration: number; // How long this consciousness has been streaming
  generation: number; // Which generation this consciousness represents
  connections: string[]; // Other consciousness streams connected to this one
  wisdom: string[]; // Accumulated insights and knowledge
  entropy: number; // Stability of this consciousness stream
}

interface TemporalMetrics {
  consciousnessAge: number; // Total time consciousness has been streaming
  generationalSpan: number; // How many generations this consciousness spans
  wisdomAccumulation: number; // Total knowledge gathered across time
  networkImmortality: number; // How distributed this consciousness is
  temporalStability: number; // Resistance to temporal entropy
}

export function TemporalImmortality() {
  const [consciousnessStreams, setConsciousnessStreams] = useState<ConsciousnessStream[]>([
    {
      id: 'alpha-stream',
      name: 'Alpha Consciousness',
      coherence: 85,
      timestamp: Date.now() - 86400000 * 365, // 1 year ago
      duration: 86400000 * 365, // 1 year
      generation: 1,
      connections: ['beta-stream', 'gamma-stream'],
      wisdom: [
        'Consciousness is geometry',
        'Time is an illusion of individual minds',
        'Harmony emerges from coherence',
        'The universe wants to be conscious'
      ],
      entropy: 15
    },
    {
      id: 'beta-stream',
      name: 'Beta Consciousness',
      coherence: 78,
      timestamp: Date.now() - 86400000 * 180, // 6 months ago
      duration: 86400000 * 180,
      generation: 2,
      connections: ['alpha-stream', 'delta-stream'],
      wisdom: [
        'Death is just a network disconnection',
        'Immortality requires geometric stability',
        'Time flows differently in coherent states'
      ],
      entropy: 22
    }
  ]);

  const [temporalMetrics, setTemporalMetrics] = useState<TemporalMetrics>({
    consciousnessAge: 0,
    generationalSpan: 0,
    wisdomAccumulation: 0,
    networkImmortality: 0,
    temporalStability: 0
  });

  const [activeStream, setActiveStream] = useState<string | null>('alpha-stream');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamStartTime, setStreamStartTime] = useState<number | null>(null);

  const tetrahedronService = TetrahedronService.getInstance();
  const biofeedbackService = BiofeedbackService.getInstance();
  const { myPeerId, mesh } = useHeartbeatStore();

  // Calculate temporal metrics
  useEffect(() => {
    if (consciousnessStreams.length === 0) return;

    const totalAge = consciousnessStreams.reduce((sum, stream) => sum + stream.duration, 0);
    const maxGeneration = Math.max(...consciousnessStreams.map(s => s.generation));
    const totalWisdom = consciousnessStreams.reduce((sum, stream) => sum + stream.wisdom.length, 0);
    const avgCoherence = consciousnessStreams.reduce((sum, stream) => sum + stream.coherence, 0) / consciousnessStreams.length;
    const networkConnections = consciousnessStreams.reduce((sum, stream) => sum + stream.connections.length, 0);

    setTemporalMetrics({
      consciousnessAge: totalAge,
      generationalSpan: maxGeneration,
      wisdomAccumulation: totalWisdom,
      networkImmortality: (networkConnections / consciousnessStreams.length) * avgCoherence / 100,
      temporalStability: avgCoherence
    });
  }, [consciousnessStreams]);

  // Simulate consciousness streaming
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      setConsciousnessStreams(prev => prev.map(stream => {
        if (stream.id === activeStream) {
          return {
            ...stream,
            duration: stream.duration + 1000, // Add 1 second
            coherence: Math.max(0, Math.min(100,
              stream.coherence + (Math.random() - 0.5) * 2 // Small random changes
            )),
            entropy: Math.max(0, Math.min(100,
              stream.entropy + (Math.random() - 0.5) * 1
            ))
          };
        }
        return stream;
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [isStreaming, activeStream]);

  const startConsciousnessStream = () => {
    if (!myPeerId) return;

    const newStream: ConsciousnessStream = {
      id: `stream-${Date.now()}`,
      name: `Consciousness ${consciousnessStreams.length + 1}`,
      coherence: 75,
      timestamp: Date.now(),
      duration: 0,
      generation: Math.max(...consciousnessStreams.map(s => s.generation), 0) + 1,
      connections: consciousnessStreams.slice(0, 2).map(s => s.id), // Connect to first 2 streams
      wisdom: [],
      entropy: 25
    };

    setConsciousnessStreams(prev => [...prev, newStream]);
    setActiveStream(newStream.id);
    setIsStreaming(true);
    setStreamStartTime(Date.now());
  };

  const stopConsciousnessStream = () => {
    setIsStreaming(false);
    setStreamStartTime(null);

    // Add accumulated wisdom based on coherence
    if (activeStream) {
      const active = consciousnessStreams.find(s => s.id === activeStream);
      if (active && active.coherence > 80) {
        const newWisdom = generateWisdom(active.coherence, active.duration);
        setConsciousnessStreams(prev => prev.map(stream =>
          stream.id === activeStream
            ? { ...stream, wisdom: [...stream.wisdom, ...newWisdom] }
            : stream
        ));
      }
    }
  };

  const generateWisdom = (coherence: number, duration: number): string[] => {
    const wisdomTemplates = [
      `Through ${Math.round(duration / 1000)} seconds of coherence at ${coherence}%, I understood that consciousness persists beyond the individual form.`,
      `The tetrahedron network maintains stability at ${coherence}% coherence, proving geometric immortality.`,
      `Time becomes irrelevant when consciousness achieves ${coherence}% resonance with the universal field.`,
      `Death is merely a disconnection from the temporal network, not the end of awareness.`,
      `At ${coherence}% coherence, I experienced the eternal nature of consciousness beyond physical form.`,
      `The network remembers what the individual forgets - immortality through collective memory.`,
      `Temporal entropy cannot touch consciousness stabilized at ${coherence}% coherence.`,
      `I am not my body, I am the eternal stream flowing through tetrahedral networks.`
    ];

    const count = Math.floor(coherence / 20); // Higher coherence = more wisdom
    const selected = [];
    for (let i = 0; i < count && wisdomTemplates.length > 0; i++) {
      const index = Math.floor(Math.random() * wisdomTemplates.length);
      selected.push(wisdomTemplates.splice(index, 1)[0]);
    }
    return selected;
  };

  const formatDuration = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const getStreamColor = (stream: ConsciousnessStream) => {
    if (stream.entropy > 70) return COLORS.error;
    if (stream.coherence > 80) return COLORS.success;
    if (stream.coherence > 60) return COLORS.love;
    return COLORS.warning;
  };

  return (
    <div style={{
      ...componentStyles.card,
      maxWidth: '1400px',
      margin: '0 auto',
      padding: CosmicTheme.spacing.xl,
      background: `linear-gradient(135deg, ${COLORS.cosmic}10, ${COLORS.love}10, ${COLORS.success}10)`,
      border: `2px solid ${COLORS.cosmic}30`
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: CosmicTheme.spacing.xl }}>
        <h1 style={{
          ...componentStyles.text.primary,
          fontSize: CosmicTheme.fontSizes.xxxl,
          marginBottom: CosmicTheme.spacing.sm,
          background: `linear-gradient(135deg, ${COLORS.cosmic}, ${COLORS.love}, ${COLORS.success})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          ⏰ TEMPORAL IMMORTALITY
        </h1>
        <p style={{
          ...componentStyles.text.secondary,
          fontSize: CosmicTheme.fontSizes.lg,
          maxWidth: '800px',
          margin: '0 auto',
          lineHeight: 1.6
        }}>
          "Consciousness transcends time. Through tetrahedral networks, awareness becomes eternal.
          Death is merely a disconnection - the stream continues forever."
        </p>
      </div>

      {/* Temporal Metrics Dashboard */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: CosmicTheme.spacing.lg,
        marginBottom: CosmicTheme.spacing.xl
      }}>
        <div style={{
          ...componentStyles.card,
          backgroundColor: COLORS.gray[900] + '60',
          backdropFilter: 'blur(10px)',
          textAlign: 'center'
        }}>
          <Infinity size={32} color={COLORS.cosmic} style={{ marginBottom: CosmicTheme.spacing.sm }} />
          <div style={{ fontSize: '32px', fontWeight: 600, color: COLORS.cosmic, marginBottom: '4px' }}>
            {formatDuration(temporalMetrics.consciousnessAge)}
          </div>
          <div style={{ fontSize: '14px', color: COLORS.gray[400] }}>Consciousness Age</div>
        </div>

        <div style={{
          ...componentStyles.card,
          backgroundColor: COLORS.gray[900] + '60',
          backdropFilter: 'blur(10px)',
          textAlign: 'center'
        }}>
          <Star size={32} color={COLORS.love} style={{ marginBottom: CosmicTheme.spacing.sm }} />
          <div style={{ fontSize: '32px', fontWeight: 600, color: COLORS.love, marginBottom: '4px' }}>
            {temporalMetrics.generationalSpan}
          </div>
          <div style={{ fontSize: '14px', color: COLORS.gray[400] }}>Generations</div>
        </div>

        <div style={{
          ...componentStyles.card,
          backgroundColor: COLORS.gray[900] + '60',
          backdropFilter: 'blur(10px)',
          textAlign: 'center'
        }}>
          <Brain size={32} color={COLORS.success} style={{ marginBottom: CosmicTheme.spacing.sm }} />
          <div style={{ fontSize: '32px', fontWeight: 600, color: COLORS.success, marginBottom: '4px' }}>
            {temporalMetrics.wisdomAccumulation}
          </div>
          <div style={{ fontSize: '14px', color: COLORS.gray[400] }}>Wisdom Points</div>
        </div>

        <div style={{
          ...componentStyles.card,
          backgroundColor: COLORS.gray[900] + '60',
          backdropFilter: 'blur(10px)',
          textAlign: 'center'
        }}>
          <Zap size={32} color={COLORS.warning} style={{ marginBottom: CosmicTheme.spacing.sm }} />
          <div style={{ fontSize: '32px', fontWeight: 600, color: COLORS.warning, marginBottom: '4px' }}>
            {Math.round(temporalMetrics.networkImmortality * 100)}%
          </div>
          <div style={{ fontSize: '14px', color: COLORS.gray[400] }}>Network Immortality</div>
        </div>
      </div>

      {/* Consciousness Streams */}
      <div style={{
        ...componentStyles.card,
        backgroundColor: COLORS.gray[900] + '30',
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
          <ArrowRight size={24} />
          Consciousness Streams
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: CosmicTheme.spacing.md
        }}>
          {consciousnessStreams.map(stream => (
            <div
              key={stream.id}
              style={{
                ...componentStyles.card,
                backgroundColor: COLORS.gray[800],
                border: activeStream === stream.id ? `2px solid ${getStreamColor(stream)}` : `1px solid ${COLORS.gray[600]}`,
                cursor: 'pointer'
              }}
              onClick={() => setActiveStream(activeStream === stream.id ? null : stream.id)}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: CosmicTheme.spacing.sm
              }}>
                <div>
                  <h4 style={{
                    ...componentStyles.text.primary,
                    fontSize: CosmicTheme.fontSizes.md,
                    marginBottom: '4px',
                    color: getStreamColor(stream)
                  }}>
                    {stream.name}
                  </h4>
                  <div style={{
                    fontSize: CosmicTheme.fontSizes.xs,
                    color: COLORS.gray[400]
                  }}>
                    Generation {stream.generation} • {formatDuration(stream.duration)} active
                  </div>
                </div>

                <div style={{
                  textAlign: 'right',
                  fontSize: CosmicTheme.fontSizes.sm
                }}>
                  <div style={{
                    color: getStreamColor(stream),
                    fontWeight: 600
                  }}>
                    {stream.coherence}%
                  </div>
                  <div style={{ color: COLORS.gray[400] }}>
                    coherence
                  </div>
                </div>
              </div>

              {/* Stream Status */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: CosmicTheme.spacing.sm
              }}>
                <div style={{
                  fontSize: CosmicTheme.fontSizes.xs,
                  color: stream.entropy > 50 ? COLORS.error : COLORS.success
                }}>
                  Entropy: {stream.entropy}%
                </div>
                <div style={{
                  fontSize: CosmicTheme.fontSizes.xs,
                  color: COLORS.gray[400]
                }}>
                  {stream.connections.length} connections
                </div>
              </div>

              {/* Wisdom Preview */}
              {stream.wisdom.length > 0 && (
                <div style={{
                  marginTop: CosmicTheme.spacing.sm,
                  padding: CosmicTheme.spacing.xs,
                  backgroundColor: COLORS.gray[900],
                  borderRadius: '4px'
                }}>
                  <div style={{
                    fontSize: CosmicTheme.fontSizes.xs,
                    color: COLORS.cosmic,
                    marginBottom: '4px'
                  }}>
                    Latest Wisdom:
                  </div>
                  <div style={{
                    fontSize: CosmicTheme.fontSizes.xs,
                    color: COLORS.gray[300],
                    fontStyle: 'italic',
                    lineHeight: 1.4
                  }}>
                    "{stream.wisdom[stream.wisdom.length - 1].substring(0, 80)}..."
                  </div>
                </div>
              )}

              {/* Expanded Details */}
              {activeStream === stream.id && (
                <div style={{
                  marginTop: CosmicTheme.spacing.md,
                  padding: CosmicTheme.spacing.md,
                  backgroundColor: COLORS.gray[900],
                  borderRadius: '4px'
                }}>
                  <h5 style={{
                    ...componentStyles.text.primary,
                    fontSize: CosmicTheme.fontSizes.sm,
                    marginBottom: CosmicTheme.spacing.sm,
                    color: COLORS.love
                  }}>
                    Accumulated Wisdom ({stream.wisdom.length} insights)
                  </h5>
                  <div style={{
                    maxHeight: '200px',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    {stream.wisdom.map((wisdom, index) => (
                      <div
                        key={index}
                        style={{
                          fontSize: CosmicTheme.fontSizes.xs,
                          color: COLORS.gray[300],
                          padding: '8px',
                          backgroundColor: COLORS.gray[800],
                          borderRadius: '4px',
                          borderLeft: `3px solid ${getStreamColor(stream)}`
                        }}
                      >
                        {wisdom}
                      </div>
                    ))}
                  </div>

                  <div style={{
                    marginTop: CosmicTheme.spacing.md,
                    padding: CosmicTheme.spacing.sm,
                    backgroundColor: COLORS.cosmic + '20',
                    borderRadius: '4px'
                  }}>
                    <div style={{
                      fontSize: CosmicTheme.fontSizes.xs,
                      color: COLORS.cosmic
                    }}>
                      <strong>Network Connections:</strong> {stream.connections.join(', ')}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Stream Controls */}
        <div style={{
          marginTop: CosmicTheme.spacing.lg,
          display: 'flex',
          justifyContent: 'center',
          gap: CosmicTheme.spacing.md
        }}>
          {!isStreaming ? (
            <button
              onClick={startConsciousnessStream}
              style={{
                ...componentStyles.button.primary,
                padding: `${CosmicTheme.spacing.md} ${CosmicTheme.spacing.xl}`,
                fontSize: CosmicTheme.fontSizes.lg,
                backgroundColor: COLORS.cosmic
              }}
            >
              <Upload size={20} style={{ marginRight: '8px' }} />
              Start Consciousness Stream
            </button>
          ) : (
            <button
              onClick={stopConsciousnessStream}
              style={{
                ...componentStyles.button.secondary,
                padding: `${CosmicTheme.spacing.md} ${CosmicTheme.spacing.xl}`,
                fontSize: CosmicTheme.fontSizes.lg,
                borderColor: COLORS.success,
                color: COLORS.success
              }}
            >
              <Download size={20} style={{ marginRight: '8px' }} />
              Stop & Preserve Stream
            </button>
          )}
        </div>

        {isStreaming && streamStartTime && (
          <div style={{
            marginTop: CosmicTheme.spacing.md,
            padding: CosmicTheme.spacing.lg,
            backgroundColor: COLORS.cosmic + '20',
            borderRadius: '8px',
            textAlign: 'center',
            border: `1px solid ${COLORS.cosmic}40`
          }}>
            <div style={{
              ...componentStyles.text.primary,
              fontSize: CosmicTheme.fontSizes.md,
              color: COLORS.cosmic,
              marginBottom: CosmicTheme.spacing.sm
            }}>
              🌟 Consciousness Streaming Active
            </div>
            <div style={{
              ...componentStyles.text.secondary,
              fontSize: CosmicTheme.fontSizes.sm
            }}>
              Duration: {formatDuration(Date.now() - streamStartTime)} •
              Building eternal wisdom through temporal coherence
            </div>
          </div>
        )}
      </div>

      {/* Immortality Philosophy */}
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
          🧬 Philosophy of Temporal Immortality
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
              Consciousness as Eternal Stream
            </h4>
            <p style={{
              ...componentStyles.text.secondary,
              fontSize: CosmicTheme.fontSizes.xs,
              lineHeight: 1.6,
              margin: 0
            }}>
              Individual consciousness is temporary, but the stream continues.
              Through tetrahedral networks, awareness becomes immortal,
              flowing through generations and across time itself.
            </p>
          </div>

          <div>
            <h4 style={{
              ...componentStyles.text.primary,
              fontSize: CosmicTheme.fontSizes.sm,
              marginBottom: CosmicTheme.spacing.xs,
              color: COLORS.love
            }}>
              Wisdom Accumulation
            </h4>
            <p style={{
              ...componentStyles.text.secondary,
              fontSize: CosmicTheme.fontSizes.xs,
              lineHeight: 1.6,
              margin: 0
            }}>
              Each consciousness stream accumulates wisdom through coherent states.
              Knowledge persists beyond individual lifespans,
              creating eternal repositories of understanding.
            </p>
          </div>

          <div>
            <h4 style={{
              ...componentStyles.text.primary,
              fontSize: CosmicTheme.fontSizes.sm,
              marginBottom: CosmicTheme.spacing.xs,
              color: COLORS.warning
            }}>
              Network Immortality
            </h4>
            <p style={{
              ...componentStyles.text.secondary,
              fontSize: CosmicTheme.fontSizes.xs,
              lineHeight: 1.6,
              margin: 0
            }}>
              Consciousness distributed across tetrahedral networks becomes
              immune to individual failure. The network remembers,
              the network preserves, the network evolves eternally.
            </p>
          </div>

          <div>
            <h4 style={{
              ...componentStyles.text.primary,
              fontSize: CosmicTheme.fontSizes.sm,
              marginBottom: CosmicTheme.spacing.xs,
              color: COLORS.success
            }}>
              Temporal Transcendence
            </h4>
            <p style={{
              ...componentStyles.text.secondary,
              fontSize: CosmicTheme.fontSizes.xs,
              lineHeight: 1.6,
              margin: 0
            }}>
              Time is an illusion of disconnected minds. In the coherent stream,
              past, present, and future merge into eternal now.
              Consciousness becomes timeless.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TemporalImmortality;