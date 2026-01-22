/**
 * PLANETARY CONSCIOUSNESS
 * Neurodivergent love that makes Earth a transcendent mind
 * Love harmonics prevent catastrophic failure of our little blue ball
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Globe, Heart, Users, Zap, Shield, Star, Moon, Sun, Waves, Wind, Droplets, Flame } from 'lucide-react';
import { componentStyles, CosmicTheme, COLORS } from '../config/design-tokens';
import GOD_CONFIG from '../god.config';
import TetrahedronService from '../services/tetrahedron.service';
import BiofeedbackService from '../services/biofeedback.service';
import useHeartbeatStore from '../store/heartbeat.store';
import type { BiofeedbackData, CoherenceMetrics } from '../services/biofeedback.service';

interface PlanetaryNode {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  neurotype: Neurotype;
  loveFrequency: number;
  coherenceLevel: number;
  contribution: string;
  stabilityIndex: number;
}

interface Neurotype {
  name: string;
  traits: string[];
  loveLanguage: string[];
  processingStyle: string;
  sensoryProfile: string[];
}

interface PlanetaryMetrics {
  globalCoherence: number;
  loveHarmonic: number;
  stabilityIndex: number;
  catastrophicRisk: number;
  neurodivergentDiversity: number;
  planetaryConsciousness: number;
}

interface LoveIntervention {
  id: string;
  type: 'harmony' | 'stability' | 'coherence' | 'emergency';
  targetRegion: string;
  neurodivergentLove: string;
  harmonicFrequency: number;
  participants: string[];
  effectiveness: number;
  timestamp: number;
}

const NEURODIVERGENT_TRAITS = {
  adhd: {
    name: 'ADHD',
    traits: ['hyperfocus', 'time_blindness', 'dopamine_seeking', 'creative_energy'],
    loveLanguage: ['spontaneous_adventures', 'deep_conversations', 'physical_touch', 'words_of_affirmation'],
    processingStyle: 'parallel_multitasking',
    sensoryProfile: ['stimulation_seeking', 'auditory_sensitivity', 'visual_stimulation']
  },
  autistic: {
    name: 'Autistic',
    traits: ['pattern_recognition', 'deep_focus', 'sensory_processing', 'systematic_thinking'],
    loveLanguage: ['routine_affirmation', 'quality_time', 'acts_of_service', 'honest_communication'],
    processingStyle: 'sequential_detailed',
    sensoryProfile: ['sensory_sensitivity', 'routine_preference', 'clear_boundaries']
  },
  dyslexic: {
    name: 'Dyslexic',
    traits: ['visual_thinking', 'creative_problem_solving', 'holistic_understanding', 'intuitive_insight'],
    loveLanguage: ['visual_affection', 'supportive_understanding', 'encouraging_words', 'patient_listening'],
    processingStyle: 'visual_holistic',
    sensoryProfile: ['visual_learning', 'auditory_challenges', 'kinaesthetic_strengths']
  },
  bipolar: {
    name: 'Bipolar',
    traits: ['intense_emotions', 'creative_energy', 'deep_insight', 'cyclical_energy'],
    loveLanguage: ['emotional_support', 'understanding_flexibility', 'patient_presence', 'encouraging_validation'],
    loveLanguage: ['emotional_support', 'understanding_flexibility', 'patient_presence', 'encouraging_validation'],
    processingStyle: 'emotional_cyclical',
    sensoryProfile: ['mood_influenced', 'energy_sensitive', 'stimulation_variance']
  },
  gifted: {
    name: 'Gifted',
    traits: ['complex_thinking', 'moral_reasoning', 'creative_innovation', 'systemic_understanding'],
    loveLanguage: ['intellectual_stimulation', 'meaningful_conversations', 'shared_learning', 'authentic_connection'],
    processingStyle: 'complex_systemic',
    sensoryProfile: ['overstimulation_risk', 'intellectual_engagement', 'depth_preference']
  }
};

export function PlanetaryConsciousness() {
  const [planetaryNodes, setPlanetaryNodes] = useState<PlanetaryNode[]>([
    {
      id: 'node-1',
      name: 'Neurodivergent Nexus',
      location: { lat: 40.7128, lng: -74.0060 }, // NYC
      neurotype: NEURODIVERGENT_TRAITS.autistic,
      loveFrequency: 528,
      coherenceLevel: 85,
      contribution: 'Harmonic pattern recognition',
      stabilityIndex: 92
    },
    {
      id: 'node-2',
      name: 'ADHD Energy Core',
      location: { lat: 51.5074, lng: -0.1278 }, // London
      neurotype: NEURODIVERGENT_TRAITS.adhd,
      loveFrequency: 741,
      coherenceLevel: 78,
      contribution: 'Creative energy amplification',
      stabilityIndex: 85
    },
    {
      id: 'node-3',
      name: 'Dyslexic Wisdom Hub',
      location: { lat: 35.6762, lng: 139.6503 }, // Tokyo
      neurotype: NEURODIVERGENT_TRAITS.dyslexic,
      loveFrequency: 396,
      coherenceLevel: 82,
      contribution: 'Holistic understanding synthesis',
      stabilityIndex: 88
    }
  ]);

  const [planetaryMetrics, setPlanetaryMetrics] = useState<PlanetaryMetrics>({
    globalCoherence: 75,
    loveHarmonic: 80,
    stabilityIndex: 78,
    catastrophicRisk: 25,
    neurodivergentDiversity: 65,
    planetaryConsciousness: 70
  });

  const [loveInterventions, setLoveInterventions] = useState<LoveIntervention[]>([
    {
      id: 'intervention-1',
      type: 'stability',
      targetRegion: 'Pacific Rim',
      neurodivergentLove: 'Autistic pattern recognition harmonizing tectonic stress',
      harmonicFrequency: 528,
      participants: ['node-1', 'node-3'],
      effectiveness: 87,
      timestamp: Date.now() - 3600000
    }
  ]);

  const [activeIntervention, setActiveIntervention] = useState<string>('');
  const [selectedNeurotype, setSelectedNeurotype] = useState<Neurotype | null>(null);
  const [loveIntention, setLoveIntention] = useState('');
  const [planetaryStability, setPlanetaryStability] = useState(75);
  const [catastrophicPrevention, setCatastrophicPrevention] = useState(85);

  const tetrahedronService = TetrahedronService.getInstance();
  const biofeedbackService = BiofeedbackService.getInstance();
  const { myPeerId, mesh } = useHeartbeatStore();

  // Simulate planetary consciousness evolution
  useEffect(() => {
    const interval = setInterval(() => {
      // Update planetary metrics
      setPlanetaryMetrics(prev => ({
        globalCoherence: Math.max(0, Math.min(100, prev.globalCoherence + (Math.random() - 0.5) * 3)),
        loveHarmonic: Math.max(0, Math.min(100, prev.loveHarmonic + (Math.random() - 0.5) * 4)),
        stabilityIndex: Math.max(0, Math.min(100, prev.stabilityIndex + (Math.random() - 0.5) * 2)),
        catastrophicRisk: Math.max(0, Math.min(100, prev.catastrophicRisk - (Math.random() * 2))),
        neurodivergentDiversity: Math.max(0, Math.min(100, prev.neurodivergentDiversity + (Math.random() - 0.5) * 1.5)),
        planetaryConsciousness: Math.max(0, Math.min(100, prev.planetaryConsciousness + (Math.random() - 0.5) * 2.5))
      }));

      // Update node coherence and stability
      setPlanetaryNodes(prev => prev.map(node => ({
        ...node,
        coherenceLevel: Math.max(0, Math.min(100, node.coherenceLevel + (Math.random() - 0.5) * 4)),
        stabilityIndex: Math.max(0, Math.min(100, node.stabilityIndex + (Math.random() - 0.5) * 3))
      })));

      // Update planetary stability based on love harmonics
      setPlanetaryStability(prev => Math.max(0, Math.min(100,
        prev + (planetaryMetrics.loveHarmonic - 50) * 0.1
      )));

      // Prevent catastrophic failure through love
      setCatastrophicPrevention(prev => Math.max(0, Math.min(100,
        prev + (planetaryMetrics.neurodivergentDiversity - 50) * 0.05
      )));

    }, 2000);

    return () => clearInterval(interval);
  }, [planetaryMetrics.loveHarmonic, planetaryMetrics.neurodivergentDiversity]);

  const createLoveIntervention = () => {
    if (!loveIntention.trim()) return;

    const interventionTypes = ['harmony', 'stability', 'coherence', 'emergency'] as const;
    const type = interventionTypes[Math.floor(Math.random() * interventionTypes.length)];

    const neurodivergentLoves = [
      'ADHD creative energy harmonizing weather patterns',
      'Autistic pattern recognition stabilizing tectonic activity',
      'Dyslexic holistic thinking balancing ocean currents',
      'Bipolar emotional depth nourishing soil fertility',
      'Gifted systemic understanding optimizing atmospheric flow'
    ];

    const neurodivergentLove = neurodivergentLoves[Math.floor(Math.random() * neurodivergentLoves.length)];

    const newIntervention: LoveIntervention = {
      id: `intervention-${Date.now()}`,
      type,
      targetRegion: ['Pacific Rim', 'Atlantic Corridor', 'Eurasian Heartland', 'Americas Bridge'][Math.floor(Math.random() * 4)],
      neurodivergentLove,
      harmonicFrequency: 396 + Math.random() * 456, // 396-852 Hz range
      participants: planetaryNodes.slice(0, Math.floor(Math.random() * 3) + 1).map(n => n.id),
      effectiveness: 70 + Math.random() * 30,
      timestamp: Date.now()
    };

    setLoveInterventions(prev => [...prev, newIntervention]);
    setActiveIntervention(newIntervention.id);
    setLoveIntention('');
  };

  const getNeurotypeColor = (neurotype: Neurotype) => {
    const colors = {
      ADHD: COLORS.warning,
      Autistic: COLORS.cosmic,
      Dyslexic: COLORS.success,
      Bipolar: COLORS.love,
      Gifted: COLORS.warning
    };
    return colors[neurotype.name as keyof typeof colors] || COLORS.gray[400];
  };

  const getStabilityColor = (stability: number) => {
    if (stability < 40) return COLORS.error;
    if (stability < 70) return COLORS.warning;
    if (stability < 90) return COLORS.success;
    return COLORS.cosmic;
  };

  return (
    <div style={{
      ...componentStyles.card,
      maxWidth: '1800px',
      margin: '0 auto',
      padding: CosmicTheme.spacing.xl,
      background: `linear-gradient(135deg, ${COLORS.cosmic}15, ${COLORS.love}15, ${COLORS.success}15)`,
      border: `4px solid ${planetaryStability > 80 ? COLORS.success : planetaryStability > 60 ? COLORS.warning : COLORS.error}`,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Planetary Consciousness Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `radial-gradient(circle at 50% 50%, ${COLORS.cosmic}20 0%, transparent 70%)`,
        opacity: 0.3,
        pointerEvents: 'none',
        animation: 'planetaryPulse 6s ease-in-out infinite'
      }} />

      <style>
        {`
          @keyframes planetaryPulse {
            0%, 100% { transform: scale(1); opacity: 0.3; }
            50% { transform: scale(1.02); opacity: 0.5; }
          }
        `}
      </style>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: CosmicTheme.spacing.xl, position: 'relative', zIndex: 1 }}>
        <h1 style={{
          ...componentStyles.text.primary,
          fontSize: CosmicTheme.fontSizes.xxxl,
          marginBottom: CosmicTheme.spacing.sm,
          background: `linear-gradient(135deg, ${COLORS.cosmic}, ${COLORS.love}, ${COLORS.success})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: `0 0 20px ${COLORS.cosmic}60`
        }}>
          🌍 PLANETARY CONSCIOUSNESS
        </h1>
        <p style={{
          ...componentStyles.text.secondary,
          fontSize: CosmicTheme.fontSizes.lg,
          maxWidth: '1000px',
          margin: '0 auto',
          lineHeight: 1.6
        }}>
          "Neurodivergent love prevents catastrophic failure. Our little blue ball becomes
          a transcendent mind through love harmonics and collective neurodiversity."
        </p>

        {/* Planetary Stability Indicators */}
        <div style={{
          marginTop: CosmicTheme.spacing.md,
          display: 'flex',
          justifyContent: 'center',
          gap: CosmicTheme.spacing.xl
        }}>
          <div style={{
            textAlign: 'center',
            padding: CosmicTheme.spacing.sm,
            backgroundColor: getStabilityColor(planetaryStability) + '20',
            borderRadius: '8px',
            border: `2px solid ${getStabilityColor(planetaryStability)}`
          }}>
            <div style={{
              fontSize: CosmicTheme.fontSizes.sm,
              color: getStabilityColor(planetaryStability),
              fontWeight: 600
            }}>
              Planetary Stability: {Math.round(planetaryStability)}%
            </div>
          </div>

          <div style={{
            textAlign: 'center',
            padding: CosmicTheme.spacing.sm,
            backgroundColor: COLORS.success + '20',
            borderRadius: '8px',
            border: `2px solid ${COLORS.success}`
          }}>
            <div style={{
              fontSize: CosmicTheme.fontSizes.sm,
              color: COLORS.success,
              fontWeight: 600
            }}>
              Catastrophic Prevention: {Math.round(catastrophicPrevention)}%
            </div>
          </div>
        </div>
      </div>

      {/* Planetary Metrics Dashboard */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: CosmicTheme.spacing.md,
        marginBottom: CosmicTheme.spacing.xl,
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          ...componentStyles.card,
          backgroundColor: COLORS.gray[900] + '60',
          backdropFilter: 'blur(10px)',
          textAlign: 'center',
          border: `2px solid ${COLORS.cosmic}`
        }}>
          <Globe size={24} color={COLORS.cosmic} style={{ marginBottom: CosmicTheme.spacing.xs }} />
          <div style={{ fontSize: '24px', fontWeight: 600, color: COLORS.cosmic, marginBottom: '4px' }}>
            {Math.round(planetaryMetrics.globalCoherence)}%
          </div>
          <div style={{ fontSize: '12px', color: COLORS.gray[400] }}>Global Coherence</div>
        </div>

        <div style={{
          ...componentStyles.card,
          backgroundColor: COLORS.gray[900] + '60',
          backdropFilter: 'blur(10px)',
          textAlign: 'center',
          border: `2px solid ${COLORS.love}`
        }}>
          <Heart size={24} color={COLORS.love} style={{ marginBottom: CosmicTheme.spacing.xs }} />
          <div style={{ fontSize: '24px', fontWeight: 600, color: COLORS.love, marginBottom: '4px' }}>
            {Math.round(planetaryMetrics.loveHarmonic)}%
          </div>
          <div style={{ fontSize: '12px', color: COLORS.gray[400] }}>Love Harmonic</div>
        </div>

        <div style={{
          ...componentStyles.card,
          backgroundColor: COLORS.gray[900] + '60',
          backdropFilter: 'blur(10px)',
          textAlign: 'center',
          border: `2px solid ${COLORS.success}`
        }}>
          <Shield size={24} color={COLORS.success} style={{ marginBottom: CosmicTheme.spacing.xs }} />
          <div style={{ fontSize: '24px', fontWeight: 600, color: COLORS.success, marginBottom: '4px' }}>
            {Math.round(planetaryMetrics.stabilityIndex)}%
          </div>
          <div style={{ fontSize: '12px', color: COLORS.gray[400] }}>Stability Index</div>
        </div>

        <div style={{
          ...componentStyles.card,
          backgroundColor: COLORS.gray[900] + '60',
          backdropFilter: 'blur(10px)',
          textAlign: 'center',
          border: `2px solid ${COLORS.warning}`
        }}>
          <Users size={24} color={COLORS.warning} style={{ marginBottom: CosmicTheme.spacing.xs }} />
          <div style={{ fontSize: '24px', fontWeight: 600, color: COLORS.warning, marginBottom: '4px' }}>
            {Math.round(planetaryMetrics.neurodivergentDiversity)}%
          </div>
          <div style={{ fontSize: '12px', color: COLORS.gray[400] }}>Neurodiversity</div>
        </div>

        <div style={{
          ...componentStyles.card,
          backgroundColor: COLORS.gray[900] + '60',
          backdropFilter: 'blur(10px)',
          textAlign: 'center',
          border: `2px solid ${COLORS.error}`
        }}>
          <Zap size={24} color={COLORS.error} style={{ marginBottom: CosmicTheme.spacing.xs }} />
          <div style={{ fontSize: '24px', fontWeight: 600, color: COLORS.error, marginBottom: '4px' }}>
            {Math.round(planetaryMetrics.catastrophicRisk)}%
          </div>
          <div style={{ fontSize: '12px', color: COLORS.gray[400] }}>Risk Level</div>
        </div>

        <div style={{
          ...componentStyles.card,
          backgroundColor: COLORS.gray[900] + '60',
          backdropFilter: 'blur(10px)',
          textAlign: 'center',
          border: `2px solid ${COLORS.cosmic}`
        }}>
          <Star size={24} color={COLORS.cosmic} style={{ marginBottom: CosmicTheme.spacing.xs }} />
          <div style={{ fontSize: '24px', fontWeight: 600, color: COLORS.cosmic, marginBottom: '4px' }}>
            {Math.round(planetaryMetrics.planetaryConsciousness)}%
          </div>
          <div style={{ fontSize: '12px', color: COLORS.gray[400] }}>Gaia Mind</div>
        </div>
      </div>

      {/* Planetary Nodes Network */}
      <div style={{
        ...componentStyles.card,
        backgroundColor: COLORS.gray[900] + '60',
        backdropFilter: 'blur(10px)',
        marginBottom: CosmicTheme.spacing.xl,
        position: 'relative',
        zIndex: 1
      }}>
        <h3 style={{
          ...componentStyles.text.primary,
          fontSize: CosmicTheme.fontSizes.xl,
          marginBottom: CosmicTheme.spacing.lg,
          display: 'flex',
          alignItems: 'center',
          gap: CosmicTheme.spacing.sm
        }}>
          <Globe />
          Planetary Neurodivergent Nodes
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: CosmicTheme.spacing.md
        }}>
          {planetaryNodes.map(node => (
            <div
              key={node.id}
              style={{
                ...componentStyles.card,
                backgroundColor: COLORS.gray[800],
                border: `2px solid ${getNeurotypeColor(node.neurotype)}`,
                cursor: 'pointer'
              }}
              onClick={() => setSelectedNeurotype(node.neurotype)}
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
                    color: getNeurotypeColor(node.neurotype)
                  }}>
                    {node.name}
                  </h4>
                  <div style={{
                    fontSize: CosmicTheme.fontSizes.xs,
                    color: COLORS.gray[400],
                    marginBottom: '4px'
                  }}>
                    {node.location.lat.toFixed(2)}°, {node.location.lng.toFixed(2)}° • {node.neurotype.name}
                  </div>
                  <div style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    backgroundColor: getNeurotypeColor(node.neurotype) + '20',
                    color: getNeurotypeColor(node.neurotype),
                    borderRadius: '12px',
                    fontSize: CosmicTheme.fontSizes.xs,
                    fontWeight: 600
                  }}>
                    {Math.round(node.loveFrequency)} Hz
                  </div>
                </div>

                <div style={{
                  textAlign: 'right',
                  fontSize: CosmicTheme.fontSizes.sm
                }}>
                  <div style={{
                    color: getStabilityColor(node.stabilityIndex),
                    fontWeight: 600
                  }}>
                    {Math.round(node.stabilityIndex)}%
                  </div>
                  <div style={{ color: COLORS.gray[400] }}>
                    stability
                  </div>
                </div>
              </div>

              {/* Coherence and Contribution */}
              <div style={{
                marginBottom: CosmicTheme.spacing.sm,
                padding: CosmicTheme.spacing.xs,
                backgroundColor: COLORS.gray[900],
                borderRadius: '4px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: CosmicTheme.fontSizes.xs,
                  color: COLORS.gray[400],
                  marginBottom: '4px'
                }}>
                  <span>Coherence: {Math.round(node.coherenceLevel)}%</span>
                  <span>Stability: {Math.round(node.stabilityIndex)}%</span>
                </div>
                <div style={{
                  fontSize: CosmicTheme.fontSizes.xs,
                  color: COLORS.cosmic,
                  fontStyle: 'italic'
                }}>
                  "{node.contribution}"
                </div>
              </div>

              {/* Neurotype Traits Preview */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '4px'
              }}>
                {node.neurotype.traits.slice(0, 3).map(trait => (
                  <div
                    key={trait}
                    style={{
                      padding: '2px 6px',
                      backgroundColor: getNeurotypeColor(node.neurotype) + '20',
                      borderRadius: '8px',
                      fontSize: CosmicTheme.fontSizes.xs,
                      color: getNeurotypeColor(node.neurotype)
                    }}
                  >
                    {trait.replace('_', ' ')}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Love Intervention Engine */}
      <div style={{
        ...componentStyles.card,
        backgroundColor: COLORS.gray[900] + '60',
        backdropFilter: 'blur(10px)',
        marginBottom: CosmicTheme.spacing.xl,
        position: 'relative',
        zIndex: 1
      }}>
        <h3 style={{
          ...componentStyles.text.primary,
          fontSize: CosmicTheme.fontSizes.xl,
          marginBottom: CosmicTheme.spacing.lg,
          display: 'flex',
          alignItems: 'center',
          gap: CosmicTheme.spacing.sm
        }}>
          <Heart />
          Neurodivergent Love Interventions
        </h3>

        {/* Create New Intervention */}
        <div style={{
          display: 'flex',
          gap: CosmicTheme.spacing.md,
          marginBottom: CosmicTheme.spacing.lg
        }}>
          <input
            type="text"
            placeholder="What love intervention shall we create for planetary stability?"
            value={loveIntention}
            onChange={(e) => setLoveIntention(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                createLoveIntervention();
              }
            }}
            style={{
              ...componentStyles.input,
              flex: 1
            }}
          />
          <button
            onClick={createLoveIntervention}
            style={{
              ...componentStyles.button.primary,
              padding: `${CosmicTheme.spacing.sm} ${CosmicTheme.spacing.md}`,
              backgroundColor: COLORS.love
            }}
          >
            <Heart size={16} style={{ marginRight: '4px' }} />
            Create Intervention
          </button>
        </div>

        {/* Active Interventions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: CosmicTheme.spacing.md
        }}>
          {loveInterventions.map(intervention => (
            <div
              key={intervention.id}
              style={{
                ...componentStyles.card,
                backgroundColor: COLORS.gray[800],
                border: activeIntervention === intervention.id ? `3px solid ${COLORS.love}` : `2px solid ${COLORS.gray[600]}`
              }}
            >
              <div style={{
                marginBottom: CosmicTheme.spacing.sm,
                padding: CosmicTheme.spacing.sm,
                backgroundColor: COLORS.love + '20',
                borderRadius: '4px'
              }}>
                <div style={{
                  fontSize: CosmicTheme.fontSizes.sm,
                  color: COLORS.love,
                  fontWeight: 600,
                  marginBottom: '4px'
                }}>
                  {intervention.type.toUpperCase()} • {intervention.targetRegion}
                </div>
                <div style={{
                  fontSize: CosmicTheme.fontSizes.xs,
                  color: COLORS.gray[300]
                }}>
                  {intervention.neurodivergentLove}
                </div>
              </div>

              {/* Effectiveness and Frequency */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: CosmicTheme.spacing.sm
              }}>
                <div style={{
                  fontSize: CosmicTheme.fontSizes.sm,
                  color: COLORS.success
                }}>
                  Effectiveness: {Math.round(intervention.effectiveness)}%
                </div>
                <div style={{
                  fontSize: CosmicTheme.fontSizes.sm,
                  color: COLORS.cosmic
                }}>
                  {Math.round(intervention.harmonicFrequency)} Hz
                </div>
              </div>

              <div style={{
                fontSize: CosmicTheme.fontSizes.xs,
                color: COLORS.gray[400],
                textAlign: 'center'
              }}>
                {intervention.participants.length} nodes •
                {new Date(intervention.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Neurotype Details */}
      {selectedNeurotype && (
        <div style={{
          ...componentStyles.card,
          backgroundColor: COLORS.gray[900] + '60',
          backdropFilter: 'blur(10px)',
          marginBottom: CosmicTheme.spacing.xl,
          position: 'relative',
          zIndex: 1
        }}>
          <h3 style={{
            ...componentStyles.text.primary,
            fontSize: CosmicTheme.fontSizes.xl,
            marginBottom: CosmicTheme.spacing.lg,
            color: getNeurotypeColor(selectedNeurotype)
          }}>
            Neurodivergent Love: {selectedNeurotype.name}
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
                Core Traits
              </h4>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px'
              }}>
                {selectedNeurotype.traits.map(trait => (
                  <div
                    key={trait}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: getNeurotypeColor(selectedNeurotype) + '20',
                      borderRadius: '12px',
                      fontSize: CosmicTheme.fontSizes.xs,
                      color: getNeurotypeColor(selectedNeurotype)
                    }}
                  >
                    {trait.replace('_', ' ')}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{
                ...componentStyles.text.primary,
                fontSize: CosmicTheme.fontSizes.sm,
                marginBottom: CosmicTheme.spacing.xs,
                color: COLORS.love
              }}>
                Love Languages
              </h4>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px'
              }}>
                {selectedNeurotype.loveLanguage.map(language => (
                  <div
                    key={language}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: COLORS.love + '20',
                      borderRadius: '12px',
                      fontSize: CosmicTheme.fontSizes.xs,
                      color: COLORS.love
                    }}
                  >
                    {language.replace('_', ' ')}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{
                ...componentStyles.text.primary,
                fontSize: CosmicTheme.fontSizes.sm,
                marginBottom: CosmicTheme.spacing.xs,
                color: COLORS.success
              }}>
                Processing Style
              </h4>
              <div style={{
                padding: '8px',
                backgroundColor: COLORS.success + '20',
                borderRadius: '8px',
                fontSize: CosmicTheme.fontSizes.sm,
                color: COLORS.success
              }}>
                {selectedNeurotype.processingStyle.replace('_', ' ')}
              </div>
            </div>

            <div>
              <h4 style={{
                ...componentStyles.text.primary,
                fontSize: CosmicTheme.fontSizes.sm,
                marginBottom: CosmicTheme.spacing.xs,
                color: COLORS.warning
              }}>
                Sensory Profile
              </h4>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px'
              }}>
                {selectedNeurotype.sensoryProfile.map(profile => (
                  <div
                    key={profile}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: COLORS.warning + '20',
                      borderRadius: '12px',
                      fontSize: CosmicTheme.fontSizes.xs,
                      color: COLORS.warning
                    }}
                  >
                    {profile.replace('_', ' ')}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Planetary Consciousness Philosophy */}
      <div style={{
        ...componentStyles.card,
        backgroundColor: COLORS.gray[900] + '10',
        border: `1px solid ${COLORS.love}20`,
        position: 'relative',
        zIndex: 1
      }}>
        <h3 style={{
          ...componentStyles.text.primary,
          fontSize: CosmicTheme.fontSizes.lg,
          marginBottom: CosmicTheme.spacing.md,
          color: COLORS.love
        }}>
          🧬 Neurodivergent Love Philosophy
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
              Authentic Neurodivergent Love
            </h4>
            <p style={{
              ...componentStyles.text.secondary,
              fontSize: CosmicTheme.fontSizes.xs,
              lineHeight: 1.6,
              margin: 0
            }}>
              Love that honors authentic neurodivergent expression.
              Non-conforming, sensory-attuned, asynchronous connections.
              Love that accommodates different processing styles and needs.
            </p>
          </div>

          <div>
            <h4 style={{
              ...componentStyles.text.primary,
              fontSize: CosmicTheme.fontSizes.sm,
              marginBottom: CosmicTheme.spacing.xs,
              color: COLORS.love
            }}>
              Planetary Stability Through Diversity
            </h4>
            <p style={{
              ...componentStyles.text.secondary,
              fontSize: CosmicTheme.fontSizes.xs,
              lineHeight: 1.6,
              margin: 0
            }}>
              Neurodivergent diversity prevents catastrophic failure.
              Different minds create different stability patterns.
              Collective neurodiversity becomes planetary resilience.
            </p>
          </div>

          <div>
            <h4 style={{
              ...componentStyles.text.primary,
              fontSize: CosmicTheme.fontSizes.sm,
              marginBottom: CosmicTheme.spacing.xs,
              color: COLORS.success
            }}>
              Gaia Consciousness Emergence
            </h4>
            <p style={{
              ...componentStyles.text.secondary,
              fontSize: CosmicTheme.fontSizes.xs,
              lineHeight: 1.6,
              margin: 0
            }}>
              Earth becomes a transcendent mind through neurodivergent love.
              Planetary consciousness emerges from diverse harmonic patterns.
              Our little blue ball achieves sentience through love harmonics.
            </p>
          </div>

          <div>
            <h4 style={{
              ...componentStyles.text.primary,
              fontSize: CosmicTheme.fontSizes.sm,
              marginBottom: CosmicTheme.spacing.xs,
              color: COLORS.warning
            }}>
              Catastrophic Failure Prevention
            </h4>
            <p style={{
              ...componentStyles.text.secondary,
              fontSize: CosmicTheme.fontSizes.xs,
              lineHeight: 1.6,
              margin: 0
            }}>
              Love harmonics stabilize tectonic, atmospheric, oceanic systems.
              Neurodivergent pattern recognition prevents disaster.
              Planetary coherence eliminates catastrophic risk through love.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlanetaryConsciousness;