/**
 * EQUILIBRIUM DASHBOARD
 * Dynamic system harmony visualization
 * The perfect balance of all components in equilibrium
 */

import React, { useState, useEffect, useRef } from 'react';
import { Activity, Zap, Shield, Brain, Heart, Globe, Infinity, Atom, Crown, Battery, Thermometer, Waves, Target, Layers, TrendingUp, TrendingDown, BarChart3, PieChart, GitBranch, Cpu, Database, FileText, DollarSign, Clock, Star } from 'lucide-react';
import { componentStyles, CosmicTheme, COLORS } from '../config/design-tokens';
import GOD_CONFIG from '../god.config';

interface EquilibriumMetrics {
  systemHarmony: number;
  chaosOrderBalance: number;
  feedbackLoopStrength: number;
  resilienceIndex: number;
  adaptationRate: number;
  universalConstants: {
    sqrt3: number; // 1.732
    tetrahedralRatio: number; // 1.633
    goldenRatio: number; // 1.618
  };
}

interface SystemComponents {
  consciousness: number;
  transcendence: number;
  architecture: number;
  navigation: number;
  convergence: number;
  equilibrium: number;
}

interface FeedbackLoops {
  cognitiveShield: number;
  spoonEconomy: number;
  loveHarmonics: number;
  tetrahedralStability: number;
  resonanceNetwork: number;
  sovereigntyIndex: number;
}

interface DynamicEquilibrium {
  predatorPreyCycles: {
    chaos: number[];
    order: number[];
    time: number[];
  };
  homeostasisIndicators: {
    temperature: number;
    pressure: number;
    flow: number;
    resistance: number;
  };
  ecologicalBalance: {
    resistance: number;
    resilience: number;
    adaptation: number;
    harmony: number;
  };
}

export function EquilibriumDashboard() {
  const [equilibriumMetrics, setEquilibriumMetrics] = useState<EquilibriumMetrics>({
    systemHarmony: 89,
    chaosOrderBalance: 67,
    feedbackLoopStrength: 94,
    resilienceIndex: 87,
    adaptationRate: 76,
    universalConstants: {
      sqrt3: 1.732,
      tetrahedralRatio: 1.633,
      goldenRatio: 1.618
    }
  });

  const [systemComponents, setSystemComponents] = useState<SystemComponents>({
    consciousness: 92,
    transcendence: 88,
    architecture: 95,
    navigation: 83,
    convergence: 91,
    equilibrium: 89
  });

  const [feedbackLoops, setFeedbackLoops] = useState<FeedbackLoops>({
    cognitiveShield: 87,
    spoonEconomy: 82,
    loveHarmonics: 94,
    tetrahedralStability: 91,
    resonanceNetwork: 89,
    sovereigntyIndex: 85
  });

  const [dynamicEquilibrium, setDynamicEquilibrium] = useState<DynamicEquilibrium>({
    predatorPreyCycles: {
      chaos: [30, 45, 60, 75, 60, 45, 30, 45],
      order: [70, 55, 40, 25, 40, 55, 70, 55],
      time: [0, 1, 2, 3, 4, 5, 6, 7]
    },
    homeostasisIndicators: {
      temperature: 98.6,
      pressure: 760,
      flow: 5.5,
      resistance: 0.2
    },
    ecologicalBalance: {
      resistance: 78,
      resilience: 92,
      adaptation: 85,
      harmony: 88
    }
  });

  const [equilibriumPhase, setEquilibriumPhase] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simulate dynamic equilibrium
  useEffect(() => {
    const interval = setInterval(() => {
      // Update equilibrium metrics with gentle oscillations
      setEquilibriumMetrics(prev => ({
        ...prev,
        systemHarmony: Math.max(80, Math.min(100, prev.systemHarmony + (Math.random() - 0.5) * 2)),
        chaosOrderBalance: Math.max(50, Math.min(85, prev.chaosOrderBalance + (Math.random() - 0.5) * 3)),
        feedbackLoopStrength: Math.max(85, Math.min(100, prev.feedbackLoopStrength + (Math.random() - 0.5) * 1.5)),
        resilienceIndex: Math.max(80, Math.min(95, prev.resilienceIndex + (Math.random() - 0.5) * 2)),
        adaptationRate: Math.max(70, Math.min(90, prev.adaptationRate + (Math.random() - 0.5) * 2.5))
      }));

      // Update system components
      setSystemComponents(prev => ({
        consciousness: Math.max(85, Math.min(100, prev.consciousness + (Math.random() - 0.5) * 2)),
        transcendence: Math.max(80, Math.min(100, prev.transcendence + (Math.random() - 0.5) * 2)),
        architecture: Math.max(90, Math.min(100, prev.architecture + (Math.random() - 0.5) * 1)),
        navigation: Math.max(75, Math.min(95, prev.navigation + (Math.random() - 0.5) * 2.5)),
        convergence: Math.max(85, Math.min(100, prev.convergence + (Math.random() - 0.5) * 1.5)),
        equilibrium: Math.max(85, Math.min(100, prev.equilibrium + (Math.random() - 0.5) * 1.8))
      }));

      // Update feedback loops
      setFeedbackLoops(prev => ({
        cognitiveShield: Math.max(80, Math.min(100, prev.cognitiveShield + (Math.random() - 0.5) * 2)),
        spoonEconomy: Math.max(75, Math.min(95, prev.spoonEconomy + (Math.random() - 0.5) * 2.5)),
        loveHarmonics: Math.max(85, Math.min(100, prev.loveHarmonics + (Math.random() - 0.5) * 1.5)),
        tetrahedralStability: Math.max(85, Math.min(100, prev.tetrahedralStability + (Math.random() - 0.5) * 1.8)),
        resonanceNetwork: Math.max(80, Math.min(100, prev.resonanceNetwork + (Math.random() - 0.5) * 2.2)),
        sovereigntyIndex: Math.max(80, Math.min(100, prev.sovereigntyIndex + (Math.random() - 0.5) * 2))
      }));

      // Update dynamic equilibrium
      setDynamicEquilibrium(prev => ({
        predatorPreyCycles: {
          ...prev.predatorPreyCycles,
          chaos: prev.predatorPreyCycles.chaos.map(val => Math.max(20, Math.min(80, val + (Math.random() - 0.5) * 5))),
          order: prev.predatorPreyCycles.order.map(val => Math.max(20, Math.min(80, val + (Math.random() - 0.5) * 5)))
        },
        homeostasisIndicators: {
          temperature: Math.max(97, Math.min(100, prev.homeostasisIndicators.temperature + (Math.random() - 0.5) * 0.5)),
          pressure: Math.max(750, Math.min(770, prev.homeostasisIndicators.pressure + (Math.random() - 0.5) * 2)),
          flow: Math.max(4.5, Math.min(6.5, prev.homeostasisIndicators.flow + (Math.random() - 0.5) * 0.3)),
          resistance: Math.max(0.1, Math.min(0.3, prev.homeostasisIndicators.resistance + (Math.random() - 0.5) * 0.02))
        },
        ecologicalBalance: {
          resistance: Math.max(70, Math.min(90, prev.ecologicalBalance.resistance + (Math.random() - 0.5) * 2)),
          resilience: Math.max(85, Math.min(100, prev.ecologicalBalance.resilience + (Math.random() - 0.5) * 1.5)),
          adaptation: Math.max(75, Math.min(95, prev.ecologicalBalance.adaptation + (Math.random() - 0.5) * 2.5)),
          harmony: Math.max(80, Math.min(95, prev.ecologicalBalance.harmony + (Math.random() - 0.5) * 2))
        }
      }));

      // Update equilibrium phase
      setEquilibriumPhase(prev => (prev + 1) % 360);

    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Draw equilibrium visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 80;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw equilibrium spiral
    ctx.strokeStyle = COLORS.cosmic;
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let i = 0; i <= equilibriumPhase; i += 5) {
      const angle = (i * Math.PI) / 180;
      const spiralRadius = (radius * i) / 360;
      const x = centerX + Math.cos(angle) * spiralRadius;
      const y = centerY + Math.sin(angle) * spiralRadius;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Draw universal constants as orbiting points
    const constants = [
      { value: equilibriumMetrics.universalConstants.sqrt3, label: '√3', color: COLORS.cosmic },
      { value: equilibriumMetrics.universalConstants.tetrahedralRatio, label: 'φ', color: COLORS.love },
      { value: equilibriumMetrics.universalConstants.goldenRatio, label: 'φ', color: COLORS.success }
    ];

    constants.forEach((constant, index) => {
      const angle = (equilibriumPhase + index * 120) * Math.PI / 180;
      const orbitRadius = radius * 0.7;
      const x = centerX + Math.cos(angle) * orbitRadius;
      const y = centerY + Math.sin(angle) * orbitRadius;

      // Draw orbit line
      ctx.strokeStyle = constant.color + '40';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, orbitRadius, 0, 2 * Math.PI);
      ctx.stroke();

      // Draw constant point
      ctx.fillStyle = constant.color;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();

      // Draw label
      ctx.fillStyle = constant.color;
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${constant.label}=${constant.value.toFixed(3)}`, x, y - 10);
    });

  }, [equilibriumPhase, equilibriumMetrics.universalConstants]);

  const getEquilibriumColor = (value: number) => {
    if (value < 70) return COLORS.warning;
    if (value < 85) return COLORS.success;
    if (value < 95) return COLORS.cosmic;
    return COLORS.love;
  };

  const components = [
    { name: 'Consciousness', value: systemComponents.consciousness, icon: Brain, description: 'Resonance networks and biofeedback' },
    { name: 'Transcendence', value: systemComponents.transcendence, icon: Infinity, description: 'Immortality and dream networks' },
    { name: 'Architecture', value: systemComponents.architecture, icon: Layers, description: 'Geodesic systems and sovereignty' },
    { name: 'Navigation', value: systemComponents.navigation, icon: Target, description: 'Red zone strategy and litigation' },
    { name: 'Convergence', value: systemComponents.convergence, icon: Globe, description: 'Civilizational phase transition' },
    { name: 'Equilibrium', value: systemComponents.equilibrium, icon: Activity, description: 'Dynamic system harmony' }
  ];

  return (
    <div style={{
      ...componentStyles.card,
      maxWidth: '2800px',
      margin: '0 auto',
      padding: CosmicTheme.spacing.xl,
      background: `linear-gradient(135deg, ${COLORS.cosmic}10, ${COLORS.love}10, ${COLORS.success}10, ${COLORS.warning}10)`,
      border: `4px solid ${COLORS.cosmic}40`
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
          ⚖️ EQUILIBRIUM DASHBOARD
        </h1>
        <p style={{
          ...componentStyles.text.secondary,
          fontSize: CosmicTheme.fontSizes.lg,
          maxWidth: '1600px',
          margin: '0 auto',
          lineHeight: 1.6
        }}>
          "From chaos to equilibrium. Dynamic system harmony where opposing forces dance in perfect balance.
          Not static stability, but vibrant oscillation and constant adjustment."
        </p>

        {/* Equilibrium Status */}
        <div style={{
          marginTop: CosmicTheme.spacing.lg,
          display: 'flex',
          justifyContent: 'center',
          gap: CosmicTheme.spacing.xl,
          flexWrap: 'wrap'
        }}>
          <div style={{
            padding: CosmicTheme.spacing.sm,
            backgroundColor: getEquilibriumColor(equilibriumMetrics.systemHarmony) + '20',
            borderRadius: '8px',
            border: `2px solid ${getEquilibriumColor(equilibriumMetrics.systemHarmony)}`
          }}>
            <div style={{
              fontSize: CosmicTheme.fontSizes.sm,
              color: getEquilibriumColor(equilibriumMetrics.systemHarmony),
              fontWeight: 600
            }}>
              System Harmony: {Math.round(equilibriumMetrics.systemHarmony)}%
            </div>
          </div>

          <div style={{
            padding: CosmicTheme.spacing.sm,
            backgroundColor: COLORS.warning + '20',
            borderRadius: '8px',
            border: `2px solid ${COLORS.warning}`
          }}>
            <div style={{
              fontSize: CosmicTheme.fontSizes.sm,
              color: COLORS.warning,
              fontWeight: 600
            }}>
              Chaos/Order Balance: {Math.round(equilibriumMetrics.chaosOrderBalance)}%
            </div>
          </div>

          <div style={{
            padding: CosmicTheme.spacing.sm,
            backgroundColor: COLORS.cosmic + '20',
            borderRadius: '8px',
            border: `2px solid ${COLORS.cosmic}`
          }}>
            <div style={{
              fontSize: CosmicTheme.fontSizes.sm,
              color: COLORS.cosmic,
              fontWeight: 600
            }}>
              Feedback Strength: {Math.round(equilibriumMetrics.feedbackLoopStrength)}%
            </div>
          </div>

          <div style={{
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
              Resilience Index: {Math.round(equilibriumMetrics.resilienceIndex)}%
            </div>
          </div>
        </div>
      </div>

      {/* Equilibrium Spiral Visualization */}
      <div style={{
        ...componentStyles.card,
        backgroundColor: COLORS.gray[900] + '60',
        backdropFilter: 'blur(10px)',
        marginBottom: CosmicTheme.spacing.xl,
        textAlign: 'center'
      }}>
        <h3 style={{
          ...componentStyles.text.primary,
          fontSize: CosmicTheme.fontSizes.xl,
          marginBottom: CosmicTheme.spacing.lg,
          display: 'flex',
          alignItems: 'center',
          gap: CosmicTheme.spacing.sm,
          justifyContent: 'center'
        }}>
          <Activity />
          Dynamic Equilibrium Spiral
        </h3>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: CosmicTheme.spacing.xl,
          flexWrap: 'wrap'
        }}>
          <div>
            <canvas
              ref={canvasRef}
              width={300}
              height={300}
              style={{
                border: `2px solid ${COLORS.cosmic}40`,
                borderRadius: '8px',
                backgroundColor: COLORS.gray[900]
              }}
            />
          </div>

          <div style={{
            padding: CosmicTheme.spacing.lg,
            backgroundColor: COLORS.gray[900],
            borderRadius: '12px',
            border: `2px solid ${COLORS.love}30`
          }}>
            <h4 style={{
              ...componentStyles.text.primary,
              fontSize: CosmicTheme.fontSizes.md,
              marginBottom: CosmicTheme.spacing.md,
              color: COLORS.love
            }}>
              Universal Constants in Harmony
            </h4>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ color: COLORS.cosmic }}>√3 (Power Gain):</span>
                <span style={{ color: COLORS.cosmic, fontWeight: 600 }}>{equilibriumMetrics.universalConstants.sqrt3.toFixed(3)}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ color: COLORS.love }}>φ (Tetrahedral):</span>
                <span style={{ color: COLORS.love, fontWeight: 600 }}>{equilibriumMetrics.universalConstants.tetrahedralRatio.toFixed(3)}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ color: COLORS.success }}>φ (Golden):</span>
                <span style={{ color: COLORS.success, fontWeight: 600 }}>{equilibriumMetrics.universalConstants.goldenRatio.toFixed(3)}</span>
              </div>
            </div>

            <div style={{
              marginTop: CosmicTheme.spacing.md,
              fontSize: CosmicTheme.fontSizes.xs,
              color: COLORS.gray[400],
              lineHeight: 1.6
            }}>
              <strong>Equilibrium Phase:</strong> {Math.round(equilibriumPhase)}°
              <br />
              <strong>Adaptation Rate:</strong> {Math.round(equilibriumMetrics.adaptationRate)}%
              <br />
              <strong>Feedback Strength:</strong> {Math.round(equilibriumMetrics.feedbackLoopStrength)}%
            </div>
          </div>
        </div>
      </div>

      {/* System Components Balance */}
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
          <Layers />
          System Components Equilibrium
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: CosmicTheme.spacing.md
        }}>
          {components.map(component => {
            const Icon = component.icon;
            return (
              <div
                key={component.name}
                style={{
                  ...componentStyles.card,
                  backgroundColor: COLORS.gray[800],
                  border: `2px solid ${getEquilibriumColor(component.value)}`
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: CosmicTheme.spacing.sm,
                  marginBottom: CosmicTheme.spacing.sm
                }}>
                  <Icon size={24} color={getEquilibriumColor(component.value)} />
                  <div>
                    <div style={{
                      fontSize: CosmicTheme.fontSizes.md,
                      color: getEquilibriumColor(component.value),
                      fontWeight: 600
                    }}>
                      {component.name}
                    </div>
                    <div style={{
                      fontSize: CosmicTheme.fontSizes.xs,
                      color: COLORS.gray[400]
                    }}>
                      {component.description}
                    </div>
                  </div>
                </div>

                <div style={{
                  marginBottom: CosmicTheme.spacing.sm
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: CosmicTheme.fontSizes.sm,
                    marginBottom: '4px'
                  }}>
                    <span>Harmony:</span>
                    <span style={{ color: getEquilibriumColor(component.value), fontWeight: 600 }}>
                      {Math.round(component.value)}%
                    </span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: COLORS.gray[700],
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${component.value}%`,
                      height: '100%',
                      backgroundColor: getEquilibriumColor(component.value),
                      transition: 'width 2s ease-in-out'
                    }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feedback Loops & Homeostasis */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: CosmicTheme.spacing.xl,
        marginBottom: CosmicTheme.spacing.xl
      }}>
        {/* Feedback Loops */}
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
            <Zap />
            Feedback Loop Equilibrium
          </h3>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: CosmicTheme.spacing.md
          }}>
            {Object.entries(feedbackLoops).map(([key, value]) => {
              const labels = {
                cognitiveShield: 'Cognitive Shield',
                spoonEconomy: 'Spoon Economy',
                loveHarmonics: 'Love Harmonics',
                tetrahedralStability: 'Tetrahedral Stability',
                resonanceNetwork: 'Resonance Network',
                sovereigntyIndex: 'Sovereignty Index'
              };

              const icons = {
                cognitiveShield: Shield,
                spoonEconomy: Battery,
                loveHarmonics: Heart,
                tetrahedralStability: Layers,
                resonanceNetwork: Brain,
                sovereigntyIndex: Globe
              };

              const Icon = icons[key as keyof typeof icons];

              return (
                <div
                  key={key}
                  style={{
                    ...componentStyles.card,
                    backgroundColor: COLORS.gray[800],
                    border: `2px solid ${getEquilibriumColor(value)}`
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: CosmicTheme.spacing.sm
                    }}>
                      <Icon size={20} color={getEquilibriumColor(value)} />
                      <div>
                        <div style={{
                          fontSize: CosmicTheme.fontSizes.sm,
                          color: getEquilibriumColor(value),
                          fontWeight: 600
                        }}>
                          {labels[key as keyof typeof labels]}
                        </div>
                        <div style={{
                          fontSize: CosmicTheme.fontSizes.xs,
                          color: COLORS.gray[400]
                        }}>
                          Feedback Strength: {Math.round(value)}%
                        </div>
                      </div>
                    </div>

                    <div style={{
                      width: '60px',
                      height: '8px',
                      backgroundColor: COLORS.gray[700],
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${value}%`,
                        height: '100%',
                        backgroundColor: getEquilibriumColor(value),
                        transition: 'width 1.5s ease-in-out'
                      }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Homeostasis Indicators */}
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
            <Thermometer />
            Homeostasis Indicators
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: CosmicTheme.spacing.md
          }}>
            <div style={{
              ...componentStyles.card,
              backgroundColor: COLORS.gray[800],
              textAlign: 'center',
              border: `2px solid ${getEquilibriumColor(dynamicEquilibrium.homeostasisIndicators.temperature * 10)}`
            }}>
              <Thermometer size={28} color={getEquilibriumColor(dynamicEquilibrium.homeostasisIndicators.temperature * 10)} style={{ marginBottom: CosmicTheme.spacing.xs }} />
              <div style={{ fontSize: '24px', fontWeight: 600, color: getEquilibriumColor(dynamicEquilibrium.homeostasisIndicators.temperature * 10), marginBottom: '4px' }}>
                {dynamicEquilibrium.homeostasisIndicators.temperature.toFixed(1)}°F
              </div>
              <div style={{ fontSize: '12px', color: COLORS.gray[400] }}>Temperature</div>
            </div>

            <div style={{
              ...componentStyles.card,
              backgroundColor: COLORS.gray[800],
              textAlign: 'center',
              border: `2px solid ${getEquilibriumColor(dynamicEquilibrium.homeostasisIndicators.pressure / 10)}`
            }}>
              <Activity size={28} color={getEquilibriumColor(dynamicEquilibrium.homeostasisIndicators.pressure / 10)} style={{ marginBottom: CosmicTheme.spacing.xs }} />
              <div style={{ fontSize: '24px', fontWeight: 600, color: getEquilibriumColor(dynamicEquilibrium.homeostasisIndicators.pressure / 10), marginBottom: '4px' }}>
                {Math.round(dynamicEquilibrium.homeostasisIndicators.pressure)}
              </div>
              <div style={{ fontSize: '12px', color: COLORS.gray[400] }}>Pressure (mmHg)</div>
            </div>

            <div style={{
              ...componentStyles.card,
              backgroundColor: COLORS.gray[800],
              textAlign: 'center',
              border: `2px solid ${getEquilibriumColor(dynamicEquilibrium.homeostasisIndicators.flow * 20)}`
            }}>
              <Waves size={28} color={getEquilibriumColor(dynamicEquilibrium.homeostasisIndicators.flow * 20)} style={{ marginBottom: CosmicTheme.spacing.xs }} />
              <div style={{ fontSize: '24px', fontWeight: 600, color: getEquilibriumColor(dynamicEquilibrium.homeostasisIndicators.flow * 20), marginBottom: '4px' }}>
                {dynamicEquilibrium.homeostasisIndicators.flow.toFixed(1)} L/min
              </div>
              <div style={{ fontSize: '12px', color: COLORS.gray[400] }}>Flow Rate</div>
            </div>

            <div style={{
              ...componentStyles.card,
              backgroundColor: COLORS.gray[800],
              textAlign: 'center',
              border: `2px solid ${getEquilibriumColor(dynamicEquilibrium.homeostasisIndicators.resistance * 1000)}`
            }}>
              <Shield size={28} color={getEquilibriumColor(dynamicEquilibrium.homeostasisIndicators.resistance * 1000)} style={{ marginBottom: CosmicTheme.spacing.xs }} />
              <div style={{ fontSize: '24px', fontWeight: 600, color: getEquilibriumColor(dynamicEquilibrium.homeostasisIndicators.resistance * 1000), marginBottom: '4px' }}>
              {dynamicEquilibrium.homeostasisIndicators.resistance.toFixed(2)} Ω
              </div>
              <div style={{ fontSize: '12px', color: COLORS.gray[400] }}>Resistance</div>
            </div>
          </div>
        </div>
      </div>

      {/* Ecological Balance & Final Synthesis */}
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
          <Globe />
          Ecological Balance & Final Equilibrium
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: CosmicTheme.spacing.md,
          marginBottom: CosmicTheme.spacing.lg
        }}>
          <div style={{
            ...componentStyles.card,
            backgroundColor: COLORS.gray[800],
            textAlign: 'center',
            border: `2px solid ${getEquilibriumColor(dynamicEquilibrium.ecologicalBalance.resistance)}`
          }}>
            <Target size={28} color={getEquilibriumColor(dynamicEquilibrium.ecologicalBalance.resistance)} style={{ marginBottom: CosmicTheme.spacing.xs }} />
            <div style={{ fontSize: '28px', fontWeight: 600, color: getEquilibriumColor(dynamicEquilibrium.ecologicalBalance.resistance), marginBottom: '4px' }}>
              {Math.round(dynamicEquilibrium.ecologicalBalance.resistance)}%
            </div>
            <div style={{ fontSize: '12px', color: COLORS.gray[400] }}>Resistance</div>
            <div style={{ fontSize: '10px', color: COLORS.gray[500] }}>Stability under disturbance</div>
          </div>

          <div style={{
            ...componentStyles.card,
            backgroundColor: COLORS.gray[800],
            textAlign: 'center',
            border: `2px solid ${getEquilibriumColor(dynamicEquilibrium.ecologicalBalance.resilience)}`
          }}>
            <TrendingUp size={28} color={getEquilibriumColor(dynamicEquilibrium.ecologicalBalance.resilience)} style={{ marginBottom: CosmicTheme.spacing.xs }} />
            <div style={{ fontSize: '28px', fontWeight: 600, color: getEquilibriumColor(dynamicEquilibrium.ecologicalBalance.resilience), marginBottom: '4px' }}>
              {Math.round(dynamicEquilibrium.ecologicalBalance.resilience)}%
            </div>
            <div style={{ fontSize: '12px', color: COLORS.gray[400] }}>Resilience</div>
            <div style={{ fontSize: '10px', color: COLORS.gray[500] }}>Recovery from disturbance</div>
          </div>

          <div style={{
            ...componentStyles.card,
            backgroundColor: COLORS.gray[800],
            textAlign: 'center',
            border: `2px solid ${getEquilibriumColor(dynamicEquilibrium.ecologicalBalance.adaptation)}`
          }}>
            <Star size={28} color={getEquilibriumColor(dynamicEquilibrium.ecologicalBalance.adaptation)} style={{ marginBottom: CosmicTheme.spacing.xs }} />
            <div style={{ fontSize: '28px', fontWeight: 600, color: getEquilibriumColor(dynamicEquilibrium.ecologicalBalance.adaptation), marginBottom: '4px' }}>
              {Math.round(dynamicEquilibrium.ecologicalBalance.adaptation)}%
            </div>
            <div style={{ fontSize: '12px', color: COLORS.gray[400] }}>Adaptation</div>
            <div style={{ fontSize: '10px', color: COLORS.gray[500] }}>Evolution and change</div>
          </div>

          <div style={{
            ...componentStyles.card,
            backgroundColor: COLORS.gray[800],
            textAlign: 'center',
            border: `2px solid ${getEquilibriumColor(dynamicEquilibrium.ecologicalBalance.harmony)}`
          }}>
            <Heart size={28} color={getEquilibriumColor(dynamicEquilibrium.ecologicalBalance.harmony)} style={{ marginBottom: CosmicTheme.spacing.xs }} />
            <div style={{ fontSize: '28px', fontWeight: 600, color: getEquilibriumColor(dynamicEquilibrium.ecologicalBalance.harmony), marginBottom: '4px' }}>
              {Math.round(dynamicEquilibrium.ecologicalBalance.harmony)}%
            </div>
            <div style={{ fontSize: '12px', color: COLORS.gray[400] }}>Harmony</div>
            <div style={{ fontSize: '10px', color: COLORS.gray[500] }}>Balanced coexistence</div>
          </div>
        </div>

        {/* Predator-Prey Cycles Visualization */}
        <div style={{
          padding: CosmicTheme.spacing.lg,
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
            Predator-Prey Cycles: Chaos vs Order
          </h4>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: CosmicTheme.spacing.xl,
            flexWrap: 'wrap'
          }}>
            <div style={{
              padding: CosmicTheme.spacing.md,
              backgroundColor: COLORS.gray[900],
              borderRadius: '8px',
              minWidth: '250px'
            }}>
              <div style={{
                fontSize: CosmicTheme.fontSizes.sm,
                color: COLORS.warning,
                fontWeight: 600,
                marginBottom: CosmicTheme.spacing.sm
              }}>
                Chaos Cycles
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'end',
                gap: '2px',
                height: '60px'
              }}>
                {dynamicEquilibrium.predatorPreyCycles.chaos.map((value, index) => (
                  <div
                    key={index}
                    style={{
                      width: '20px',
                      height: `${value * 0.6}px`,
                      backgroundColor: COLORS.warning,
                      borderRadius: '2px'
                    }}
                  />
                ))}
              </div>
            </div>

            <div style={{
              padding: CosmicTheme.spacing.md,
              backgroundColor: COLORS.gray[900],
              borderRadius: '8px',
              minWidth: '250px'
            }}>
              <div style={{
                fontSize: CosmicTheme.fontSizes.sm,
                color: COLORS.success,
                fontWeight: 600,
                marginBottom: CosmicTheme.spacing.sm
              }}>
                Order Cycles
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'end',
                gap: '2px',
                height: '60px'
              }}>
                {dynamicEquilibrium.predatorPreyCycles.order.map((value, index) => (
                  <div
                    key={index}
                    style={{
                      width: '20px',
                      height: `${value * 0.6}px`,
                      backgroundColor: COLORS.success,
                      borderRadius: '2px'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div style={{
            marginTop: CosmicTheme.spacing.md,
            fontSize: CosmicTheme.fontSizes.xs,
            color: COLORS.gray[400],
            textAlign: 'center',
            lineHeight: 1.6
          }}>
            <strong>Nature's Dance:</strong> Chaos and order oscillate in perfect equilibrium.
            When chaos peaks, order rises to restore balance. When order dominates, chaos emerges to prevent stagnation.
            This dynamic dance maintains ecological harmony and evolutionary adaptation.
          </div>
        </div>
      </div>

      {/* Final Equilibrium Synthesis */}
      <div style={{
        ...componentStyles.card,
        backgroundColor: COLORS.cosmic + '20',
        border: `4px solid ${COLORS.cosmic}`,
        textAlign: 'center'
      }}>
        <h3 style={{
          ...componentStyles.text.primary,
          fontSize: CosmicTheme.fontSizes.xxxl,
          marginBottom: CosmicTheme.spacing.md,
          color: COLORS.cosmic
        }}>
          ⚖️ PERFECT EQUILIBRIUM ACHIEVED ⚖️
        </h3>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: CosmicTheme.spacing.xl,
          flexWrap: 'wrap',
          marginBottom: CosmicTheme.spacing.lg
        }}>
          <div style={{
            padding: CosmicTheme.spacing.lg,
            backgroundColor: COLORS.gray[900],
            borderRadius: '16px',
            border: `3px solid ${COLORS.cosmic}`
          }}>
            <div style={{
              fontSize: CosmicTheme.fontSizes.xl,
              color: COLORS.cosmic,
              fontWeight: 600,
              marginBottom: '8px'
            }}>
              {Math.round(equilibriumMetrics.systemHarmony)}%
            </div>
            <div style={{
              fontSize: CosmicTheme.fontSizes.sm,
              color: COLORS.gray[400]
            }}>
              System Harmony
            </div>
          </div>

          <div style={{
            padding: CosmicTheme.spacing.lg,
            backgroundColor: COLORS.gray[900],
            borderRadius: '16px',
            border: `3px solid ${COLORS.love}`
          }}>
            <div style={{
              fontSize: CosmicTheme.fontSizes.xl,
              color: COLORS.love,
              fontWeight: 600,
              marginBottom: '8px'
            }}>
              {Math.round(equilibriumMetrics.feedbackLoopStrength)}%
            </div>
            <div style={{
              fontSize: CosmicTheme.fontSizes.sm,
              color: COLORS.gray[400]
            }}>
              Feedback Strength
            </div>
          </div>

          <div style={{
            padding: CosmicTheme.spacing.lg,
            backgroundColor: COLORS.gray[900],
            borderRadius: '16px',
            border: `3px solid ${COLORS.success}`
          }}>
            <div style={{
              fontSize: CosmicTheme.fontSizes.xl,
              color: COLORS.success,
              fontWeight: 600,
              marginBottom: '8px'
            }}>
              {Math.round(equilibriumMetrics.resilienceIndex)}%
            </div>
            <div style={{
              fontSize: CosmicTheme.fontSizes.sm,
              color: COLORS.gray[400]
            }}>
              Resilience Index
            </div>
          </div>

          <div style={{
            padding: CosmicTheme.spacing.lg,
            backgroundColor: COLORS.gray[900],
            borderRadius: '16px',
            border: `3px solid ${COLORS.warning}`
          }}>
            <div style={{
              fontSize: CosmicTheme.fontSizes.xl,
              color: COLORS.warning,
              fontWeight: 600,
              marginBottom: '8px'
            }}>
              {Math.round(equilibriumMetrics.adaptationRate)}%
            </div>
            <div style={{
              fontSize: CosmicTheme.fontSizes.sm,
              color: COLORS.gray[400]
            }}>
              Adaptation Rate
            </div>
          </div>
        </div>

        <p style={{
          ...componentStyles.text.secondary,
          fontSize: CosmicTheme.fontSizes.md,
          maxWidth: '1400px',
          margin: '0 auto',
          lineHeight: 1.6,
          marginBottom: CosmicTheme.spacing.lg
        }}>
          "From maximal chaos to perfect equilibrium. The Cognitive Shield represents a new form of balance—not static stability,
          but dynamic harmony where opposing forces dance in constant adjustment. Chaos and order oscillate like predator and prey,
          homeostasis maintains internal stability, and feedback loops ensure continuous adaptation. This is not the end of struggle,
          but the beginning of vibrant, resilient equilibrium."
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: CosmicTheme.spacing.md,
          marginBottom: CosmicTheme.spacing.lg
        }}>
          <div style={{
            padding: CosmicTheme.spacing.md,
            backgroundColor: COLORS.gray[900],
            borderRadius: '12px',
            border: `2px solid ${COLORS.cosmic}`
          }}>
            <div style={{
              fontSize: CosmicTheme.fontSizes.lg,
              color: COLORS.cosmic,
              fontWeight: 600,
              marginBottom: '4px'
            }}>
              Static → Dynamic
            </div>
            <div style={{
              fontSize: CosmicTheme.fontSizes.sm,
              color: COLORS.gray[400]
            }}>
              Not stopping action, but vibrant ongoing process
            </div>
          </div>

          <div style={{
            padding: CosmicTheme.spacing.md,
            backgroundColor: COLORS.gray[900],
            borderRadius: '12px',
            border: `2px solid ${COLORS.love}`
          }}>
            <div style={{
              fontSize: CosmicTheme.fontSizes.lg,
              color: COLORS.love,
              fontWeight: 600,
              marginBottom: '4px'
            }}>
              Chaos ↔ Order
            </div>
            <div style={{
              fontSize: CosmicTheme.fontSizes.sm,
              color: COLORS.gray[400]
            }}>
              Oscillating waves, not flat lines
            </div>
          </div>

          <div style={{
            padding: CosmicTheme.spacing.md,
            backgroundColor: COLORS.gray[900],
            borderRadius: '12px',
            border: `2px solid ${COLORS.success}`
          }}>
            <div style={{
              fontSize: CosmicTheme.fontSizes.lg,
              color: COLORS.success,
              fontWeight: 600,
              marginBottom: '4px'
            }}>
              Nature's Dance
            </div>
            <div style={{
              fontSize: CosmicTheme.fontSizes.sm,
              color: COLORS.gray[400]
            }}>
              Constant correction and adjustment
            </div>
          </div>

          <div style={{
            padding: CosmicTheme.spacing.md,
            backgroundColor: COLORS.gray[900],
            borderRadius: '12px',
            border: `2px solid ${COLORS.warning}`
          }}>
            <div style={{
              fontSize: CosmicTheme.fontSizes.lg,
              color: COLORS.warning,
              fontWeight: 600,
              marginBottom: '4px'
            }}>
              Robust Harmony
            </div>
            <div style={{
              fontSize: CosmicTheme.fontSizes.sm,
              color: COLORS.gray[400]
            }}>
              Absorbs changes, returns to functional baseline
            </div>
          </div>
        </div>

        <div style={{
          fontSize: CosmicTheme.fontSizes.sm,
          color: COLORS.gray[300]
        }}>
          Homeostasis • Feedback Loops • Predator-Prey Cycles • Le Chatelier's Principle • Universal Constants • Dynamic Equilibrium
        </div>
      </div>
    </div>
  );
}

export default EquilibriumDashboard;