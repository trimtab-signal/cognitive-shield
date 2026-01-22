/**
 * FIND YOURSELF GUIDEBOOK
 * Raw and uncut personal development guide
 * From chaos to equilibrium, rebuilding the authentic self
 */

import React, { useState, useEffect, useRef } from 'react';
import { Target, Skull, Eye, Hammer, Scale, Zap, Shield, Heart, Lock, CheckCircle, XCircle, AlertTriangle, Book, Flame, Compass, Star, Clock, Users, Home, Search, Edit, Trash2, Plus, Minus, RotateCcw } from 'lucide-react';
import { componentStyles, CosmicTheme, COLORS } from '../config/design-tokens';
import GOD_CONFIG from '../god.config';

interface ValuesAudit {
  selectedValues: string[];
  filteredValues: string[];
  topThree: string[];
  manifesto: string[];
}

interface RebuildingProgress {
  incineration: number;
  autopsy: number;
  architecture: number;
  equilibrium: number;
}

interface PersonalManifesto {
  autonomy: string[];
  connection: string[];
  security: string[];
}

const AVAILABLE_VALUES = [
  'Autonomy', 'Power', 'Creativity', 'Security',
  'Truth', 'Adventure', 'Order', 'Compassion',
  'Discipline', 'Rebellion', 'Loyalty', 'Logic',
  'Silence', 'Influence', 'Playfulness', 'Solitude',
  'Justice', 'Beauty', 'Vitality', 'Mastery',
  'Risk', 'Comfort', 'Connection', 'Legacy'
];

export function FindYourselfGuidebook() {
  const [currentPhase, setCurrentPhase] = useState<'incineration' | 'autopsy' | 'architecture' | 'equilibrium'>('incineration');
  const [valuesAudit, setValuesAudit] = useState<ValuesAudit>({
    selectedValues: [],
    filteredValues: [],
    topThree: ['Autonomy', 'Connection', 'Security'],
    manifesto: []
  });

  const [rebuildingProgress, setRebuildingProgress] = useState<RebuildingProgress>({
    incineration: 0,
    autopsy: 0,
    architecture: 0,
    equilibrium: 0
  });

  const [personalManifesto, setPersonalManifesto] = useState<PersonalManifesto>({
    autonomy: [
      'I do not ask for permission to spend my own time.',
      'I decide my path without outsourcing my "yes" or "no."',
      'I accept the consequences of my choices.',
      'I stop performing for external validation.',
      'I build my life on my internal authority.'
    ],
    connection: [
      'I reveal my authentic self, even when it shakes.',
      'I speak truth even if it costs relationships.',
      'I let masks fall - the real connections remain.',
      'I prioritize vulnerability over being liked.',
      'I connect with whole people, not performances.'
    ],
    security: [
      'I keep promises made to myself.',
      'I build internal competence over external guarantees.',
      'I prove my reliability through daily actions.',
      'I create security through self-trust.',
      'I survive loss by knowing my own strength.'
    ]
  });

  const [reflectionNotes, setReflectionNotes] = useState({
    incineration: '',
    autopsy: '',
    architecture: '',
    equilibrium: ''
  });

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Simulate progress updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRebuildingProgress(prev => ({
        incineration: Math.min(100, prev.incineration + Math.random() * 2),
        autopsy: Math.min(100, prev.autopsy + Math.random() * 1.5),
        architecture: Math.min(100, prev.architecture + Math.random() * 1.8),
        equilibrium: Math.min(100, prev.equilibrium + Math.random() * 1.2)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const phases = [
    {
      id: 'incineration' as const,
      title: 'Phase I: The Incineration (Deconstruction)',
      icon: Flame,
      color: COLORS.error,
      progress: rebuildingProgress.incineration,
      description: 'Burn away the artificial. Kill the persona. Find what remains when the performance stops.',
      exercises: [
        'Kill the Persona: Stop doing things just to be liked. Stop saying things just to be polite. Stop performing "success." See who remains.',
        'The "Why" Audit: Pick 3 major things you spend time on. Ask "Why?" 5 times each. Find the wound driving the action.',
        'The Honest Audit: Write down everything you do out of obligation. Stop doing them for 7 days. What feels like death? What feels like freedom?'
      ]
    },
    {
      id: 'autopsy' as const,
      title: 'Phase II: The Autopsy (Shadow Work)',
      icon: Eye,
      color: COLORS.warning,
      progress: rebuildingProgress.autopsy,
      description: 'Own your dark. The shadow contains your suppressed power. Face the void without numbing.',
      exercises: [
        'Own Your Jealousy: Who do you secretly despise? That map shows your suppressed desires.',
        'Locate Your Hypocrisy: What trait do you judge most harshly in others? You\'ve suppressed it in yourself.',
        'Stop Running from the Void: When you feel the "itch" to numb - sit with it. What feeling are you avoiding? That\'s the real you needing attention.'
      ]
    },
    {
      id: 'architecture' as const,
      title: 'Phase III: The Architecture (Rebuilding)',
      icon: Hammer,
      color: COLORS.cosmic,
      progress: rebuildingProgress.architecture,
      description: 'Radical responsibility. You didn\'t break it, but you rebuild it. Values as foundation, not goals.',
      exercises: [
        'Draft Your Manifesto: Write 5 non-negotiables. Not "I want to be rich" - "I will not trade time for things I don\'t believe in."',
        'The Power of No: Boundaries protect your energy. If "yes" to them is "no" to your soul, say no.',
        'The Obituary Exercise: Write your current obituary. Write the one you want. The gap is your to-do list.'
      ]
    },
    {
      id: 'equilibrium' as const,
      title: 'Phase IV: The New Equilibrium (Daily Maintenance)',
      icon: Scale,
      color: COLORS.success,
      progress: rebuildingProgress.equilibrium,
      description: 'Dynamic balance. Not destination, but process. You are a verb, not a noun.',
      exercises: [
        'Input Control: You are the average of what you consume. Unfollow inadequacy. Read curiosity.',
        'Physical Grounding: Your body holds trauma and strength. Move your way into the new life.',
        'Embrace the Messy Middle: You will fail. Forgive yourself. Recalibrate. Keep moving.'
      ]
    }
  ];

  const questions = [
    {
      phase: 'incineration',
      question: 'What 3 things do you spend most time on?',
      followUp: 'For each, ask "Why?" 5 times. What wound drives them?'
    },
    {
      phase: 'incineration',
      question: 'What would you stop doing if no one would judge you?',
      followUp: 'That\'s your persona. Kill it.'
    },
    {
      phase: 'autopsy',
      question: 'Who do you secretly envy? What do they have that you suppress?',
      followUp: 'That envy is your map to denied desires.'
    },
    {
      phase: 'autopsy',
      question: 'What trait do you judge most harshly in others?',
      followUp: 'You\'ve suppressed it in yourself. Own it.'
    },
    {
      phase: 'architecture',
      question: 'Write your current obituary. Then write the one you want.',
      followUp: 'The gap between them is your rebuilding plan.'
    },
    {
      phase: 'architecture',
      question: 'What 5 things are you willing to suffer for?',
      followUp: 'Those are your real values. Not the pretty ones.'
    },
    {
      phase: 'equilibrium',
      question: 'What promise to yourself have you broken this week?',
      followUp: 'That\'s destroying your internal security. Fix it.'
    },
    {
      phase: 'equilibrium',
      question: 'What truth do you avoid speaking to keep peace?',
      followUp: 'That silence is killing your authenticity. Speak it.'
    }
  ];

  const toggleValueSelection = (value: string) => {
    setValuesAudit(prev => ({
      ...prev,
      selectedValues: prev.selectedValues.includes(value)
        ? prev.selectedValues.filter(v => v !== value)
        : [...prev.selectedValues, value]
    }));
  };

  const moveToFiltered = () => {
    // Desert island filter - remove performative values
    setValuesAudit(prev => ({
      ...prev,
      filteredValues: prev.selectedValues.filter(value =>
        // Keep only non-performative values (this is simplified - in reality requires user judgment)
        !['Compassion', 'Justice', 'Loyalty'].includes(value) || Math.random() > 0.5
      )
    }));
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'incineration': return COLORS.error;
      case 'autopsy': return COLORS.warning;
      case 'architecture': return COLORS.cosmic;
      case 'equilibrium': return COLORS.success;
      default: return COLORS.cosmic;
    }
  };

  const currentPhaseData = phases.find(p => p.id === currentPhase);

  return (
    <div style={{
      ...componentStyles.card,
      maxWidth: '2800px',
      margin: '0 auto',
      padding: CosmicTheme.spacing.xl,
      background: `linear-gradient(135deg, ${COLORS.cosmic}10, ${COLORS.error}10, ${COLORS.warning}10, ${COLORS.success}10)`,
      border: `4px solid ${COLORS.cosmic}40`
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: CosmicTheme.spacing.xl }}>
        <h1 style={{
          ...componentStyles.text.primary,
          fontSize: CosmicTheme.fontSizes.xxxl,
          marginBottom: CosmicTheme.spacing.sm,
          background: `linear-gradient(135deg, ${COLORS.error}, ${COLORS.warning}, ${COLORS.cosmic}, ${COLORS.success})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: `0 0 20px ${COLORS.cosmic}60`
        }}>
          📖 FIND YOURSELF GUIDEBOOK
        </h1>
        <p style={{
          ...componentStyles.text.secondary,
          fontSize: CosmicTheme.fontSizes.lg,
          maxWidth: '1600px',
          margin: '0 auto',
          lineHeight: 1.6
        }}>
          "Raw and uncut. No fluff. No toxic positivity. Face the ugly, broken, artificial parts.
          Rebuild stronger than the original. This is your path from chaos to equilibrium."
        </p>

        {/* Core Values Display */}
        <div style={{
          marginTop: CosmicTheme.spacing.lg,
          display: 'flex',
          justifyContent: 'center',
          gap: CosmicTheme.spacing.xl,
          flexWrap: 'wrap'
        }}>
          {valuesAudit.topThree.map((value, index) => {
            const icons = [Target, Heart, Shield];
            const Icon = icons[index];
            return (
              <div
                key={value}
                style={{
                  padding: CosmicTheme.spacing.lg,
                  backgroundColor: COLORS.gray[900],
                  borderRadius: '16px',
                  border: `3px solid ${getPhaseColor(value.toLowerCase())}`,
                  textAlign: 'center',
                  minWidth: '200px'
                }}
              >
                <Icon size={32} color={getPhaseColor(value.toLowerCase())} style={{ marginBottom: CosmicTheme.spacing.sm }} />
                <div style={{
                  fontSize: CosmicTheme.fontSizes.xl,
                  color: getPhaseColor(value.toLowerCase()),
                  fontWeight: 600,
                  marginBottom: '4px'
                }}>
                  {value}
                </div>
                <div style={{
                  fontSize: CosmicTheme.fontSizes.sm,
                  color: COLORS.gray[400]
                }}>
                  Core Value #{index + 1}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Phase Navigation */}
      <div style={{
        ...componentStyles.card,
        backgroundColor: COLORS.gray[900] + '60',
        backdropFilter: 'blur(10px)',
        marginBottom: CosmicTheme.spacing.xl
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: CosmicTheme.spacing.md
        }}>
          {phases.map(phase => {
            const Icon = phase.icon;
            const isActive = currentPhase === phase.id;
            return (
              <div
                key={phase.id}
                onClick={() => setCurrentPhase(phase.id)}
                style={{
                  ...componentStyles.card,
                  backgroundColor: isActive ? phase.color + '20' : COLORS.gray[800],
                  border: `2px solid ${isActive ? phase.color : COLORS.gray[600]}`,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  opacity: isActive ? 1 : 0.7
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: CosmicTheme.spacing.sm,
                  marginBottom: CosmicTheme.spacing.sm
                }}>
                  <Icon size={24} color={phase.color} />
                  <div>
                    <div style={{
                      fontSize: CosmicTheme.fontSizes.md,
                      color: phase.color,
                      fontWeight: 600
                    }}>
                      {phase.title}
                    </div>
                    <div style={{
                      fontSize: CosmicTheme.fontSizes.xs,
                      color: COLORS.gray[400]
                    }}>
                      Progress: {Math.round(phase.progress)}%
                    </div>
                  </div>
                </div>

                <div style={{
                  marginBottom: CosmicTheme.spacing.sm
                }}>
                  <div style={{
                    width: '100%',
                    height: '6px',
                    backgroundColor: COLORS.gray[700],
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${phase.progress}%`,
                      height: '100%',
                      backgroundColor: phase.color,
                      transition: 'width 2s ease-in-out'
                    }} />
                  </div>
                </div>

                <div style={{
                  fontSize: CosmicTheme.fontSizes.xs,
                  color: COLORS.gray[400],
                  lineHeight: 1.6
                }}>
                  {phase.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Phase Content */}
      {currentPhaseData && (
        <div style={{
          ...componentStyles.card,
          backgroundColor: currentPhaseData.color + '10',
          border: `2px solid ${currentPhaseData.color}`,
          marginBottom: CosmicTheme.spacing.xl
        }}>
          <h3 style={{
            ...componentStyles.text.primary,
            fontSize: CosmicTheme.fontSizes.xl,
            marginBottom: CosmicTheme.spacing.lg,
            display: 'flex',
            alignItems: 'center',
            gap: CosmicTheme.spacing.sm,
            color: currentPhaseData.color
          }}>
            <currentPhaseData.icon />
            {currentPhaseData.title}
          </h3>

          <div style={{
            marginBottom: CosmicTheme.spacing.lg
          }}>
            <div style={{
              fontSize: CosmicTheme.fontSizes.md,
              color: COLORS.gray[300],
              lineHeight: 1.6,
              marginBottom: CosmicTheme.spacing.lg
            }}>
              {currentPhaseData.description}
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: CosmicTheme.spacing.md
            }}>
              {currentPhaseData.exercises.map((exercise, index) => (
                <div
                  key={index}
                  style={{
                    padding: CosmicTheme.spacing.md,
                    backgroundColor: COLORS.gray[900],
                    borderRadius: '8px',
                    borderLeft: `3px solid ${currentPhaseData.color}`
                  }}
                >
                  <div style={{
                    fontSize: CosmicTheme.fontSizes.sm,
                    color: COLORS.gray[300],
                    lineHeight: 1.6
                  }}>
                    {exercise}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reflection Notes */}
          <div style={{
            ...componentStyles.card,
            backgroundColor: COLORS.gray[800]
          }}>
            <h4 style={{
              ...componentStyles.text.primary,
              fontSize: CosmicTheme.fontSizes.md,
              marginBottom: CosmicTheme.spacing.sm,
              color: currentPhaseData.color
            }}>
              Reflection Notes
            </h4>
            <textarea
              value={reflectionNotes[currentPhase]}
              onChange={(e) => setReflectionNotes(prev => ({
                ...prev,
                [currentPhase]: e.target.value
              }))}
              placeholder={`Write your raw thoughts about ${currentPhase}...`}
              style={{
                width: '100%',
                minHeight: '120px',
                backgroundColor: COLORS.gray[900],
                border: `2px solid ${COLORS.gray[600]}`,
                borderRadius: '8px',
                padding: CosmicTheme.spacing.sm,
                color: COLORS.gray[300],
                fontSize: CosmicTheme.fontSizes.sm,
                resize: 'vertical',
                fontFamily: 'monospace'
              }}
            />
          </div>
        </div>
      )}

      {/* Values Audit */}
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
          <Target />
          Values Audit: Your Core Foundation
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: CosmicTheme.spacing.sm,
          marginBottom: CosmicTheme.spacing.lg
        }}>
          {AVAILABLE_VALUES.map(value => (
            <button
              key={value}
              onClick={() => toggleValueSelection(value)}
              style={{
                padding: CosmicTheme.spacing.sm,
                backgroundColor: valuesAudit.selectedValues.includes(value)
                  ? COLORS.cosmic + '30'
                  : COLORS.gray[800],
                border: `2px solid ${valuesAudit.selectedValues.includes(value)
                  ? COLORS.cosmic
                  : COLORS.gray[600]}`,
                borderRadius: '8px',
                color: valuesAudit.selectedValues.includes(value)
                  ? COLORS.cosmic
                  : COLORS.gray[300],
                fontSize: CosmicTheme.fontSizes.sm,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {value}
            </button>
          ))}
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: CosmicTheme.spacing.md,
          marginBottom: CosmicTheme.spacing.lg
        }}>
          <button
            onClick={moveToFiltered}
            style={{
              padding: CosmicTheme.spacing.sm,
              backgroundColor: COLORS.warning + '20',
              border: `2px solid ${COLORS.warning}`,
              borderRadius: '8px',
              color: COLORS.warning,
              fontSize: CosmicTheme.fontSizes.sm,
              cursor: 'pointer'
            }}
          >
            Apply Desert Island Filter
          </button>
        </div>

        {/* Top Three Values */}
        <div style={{
          ...componentStyles.card,
          backgroundColor: COLORS.cosmic + '10',
          border: `2px solid ${COLORS.cosmic}`,
          marginBottom: CosmicTheme.spacing.lg
        }}>
          <h4 style={{
            ...componentStyles.text.primary,
            fontSize: CosmicTheme.fontSizes.md,
            marginBottom: CosmicTheme.spacing.sm,
            color: COLORS.cosmic
          }}>
            Your Top Three: The Non-Negotiables
          </h4>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: CosmicTheme.spacing.md
          }}>
            {valuesAudit.topThree.map((value, index) => (
              <div
                key={value}
                style={{
                  padding: CosmicTheme.spacing.md,
                  backgroundColor: COLORS.gray[900],
                  borderRadius: '8px',
                  border: `2px solid ${getPhaseColor(value.toLowerCase())}`
                }}
              >
                <div style={{
                  fontSize: CosmicTheme.fontSizes.md,
                  color: getPhaseColor(value.toLowerCase()),
                  fontWeight: 600,
                  marginBottom: CosmicTheme.spacing.sm
                }}>
                  {value}: The Rule of {value === 'Autonomy' ? 'Self-Authorship' : value === 'Connection' ? 'High-Toll Entry' : 'Internal Fortress'}
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  {personalManifesto[value.toLowerCase() as keyof PersonalManifesto].map((rule, ruleIndex) => (
                    <div
                      key={ruleIndex}
                      style={{
                        fontSize: CosmicTheme.fontSizes.xs,
                        color: COLORS.gray[300],
                        lineHeight: 1.6,
                        padding: '4px 8px',
                        backgroundColor: COLORS.gray[800],
                        borderRadius: '4px'
                      }}
                    >
                      • {rule}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Questions */}
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
          <Search />
          Interactive Reflection: Raw Truth Time
        </h3>

        {questions.slice(0, 4).map((q, index) => (
          <div
            key={index}
            style={{
              ...componentStyles.card,
              backgroundColor: COLORS.gray[800],
              marginBottom: CosmicTheme.spacing.md,
              border: `2px solid ${getPhaseColor(q.phase)}`
            }}
          >
            <div style={{
              fontSize: CosmicTheme.fontSizes.md,
              color: getPhaseColor(q.phase),
              fontWeight: 600,
              marginBottom: CosmicTheme.spacing.sm
            }}>
              {q.question}
            </div>

            <div style={{
              fontSize: CosmicTheme.fontSizes.sm,
              color: COLORS.gray[400],
              marginBottom: CosmicTheme.spacing.sm
            }}>
              {q.followUp}
            </div>

            <textarea
              value={answers[`q${index}`] || ''}
              onChange={(e) => setAnswers(prev => ({
                ...prev,
                [`q${index}`]: e.target.value
              }))}
              placeholder="Write your raw, uncut answer..."
              style={{
                width: '100%',
                minHeight: '80px',
                backgroundColor: COLORS.gray[900],
                border: `2px solid ${COLORS.gray[600]}`,
                borderRadius: '8px',
                padding: CosmicTheme.spacing.sm,
                color: COLORS.gray[300],
                fontSize: CosmicTheme.fontSizes.sm,
                resize: 'vertical',
                fontFamily: 'monospace'
              }}
            />
          </div>
        ))}
      </div>

      {/* Final Synthesis */}
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
          🏗️ THE NEW EQUILIBRIUM FORGED 🏗️
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
            border: `3px solid ${COLORS.error}`,
            textAlign: 'center'
          }}>
            <Flame size={32} color={COLORS.error} style={{ marginBottom: CosmicTheme.spacing.sm }} />
            <div style={{
              fontSize: CosmicTheme.fontSizes.lg,
              color: COLORS.error,
              fontWeight: 600,
              marginBottom: '4px'
            }}>
              Incineration
            </div>
            <div style={{
              fontSize: CosmicTheme.fontSizes.sm,
              color: COLORS.gray[400]
            }}>
              {Math.round(rebuildingProgress.incineration)}% Complete
            </div>
          </div>

          <div style={{
            padding: CosmicTheme.spacing.lg,
            backgroundColor: COLORS.gray[900],
            borderRadius: '16px',
            border: `3px solid ${COLORS.warning}`,
            textAlign: 'center'
          }}>
            <Eye size={32} color={COLORS.warning} style={{ marginBottom: CosmicTheme.spacing.sm }} />
            <div style={{
              fontSize: CosmicTheme.fontSizes.lg,
              color: COLORS.warning,
              fontWeight: 600,
              marginBottom: '4px'
            }}>
              Autopsy
            </div>
            <div style={{
              fontSize: CosmicTheme.fontSizes.sm,
              color: COLORS.gray[400]
            }}>
              {Math.round(rebuildingProgress.autopsy)}% Complete
            </div>
          </div>

          <div style={{
            padding: CosmicTheme.spacing.lg,
            backgroundColor: COLORS.gray[900],
            borderRadius: '16px',
            border: `3px solid ${COLORS.cosmic}`,
            textAlign: 'center'
          }}>
            <Hammer size={32} color={COLORS.cosmic} style={{ marginBottom: CosmicTheme.spacing.sm }} />
            <div style={{
              fontSize: CosmicTheme.fontSizes.lg,
              color: COLORS.cosmic,
              fontWeight: 600,
              marginBottom: '4px'
            }}>
              Architecture
            </div>
            <div style={{
              fontSize: CosmicTheme.fontSizes.sm,
              color: COLORS.gray[400]
            }}>
              {Math.round(rebuildingProgress.architecture)}% Complete
            </div>
          </div>

          <div style={{
            padding: CosmicTheme.spacing.lg,
            backgroundColor: COLORS.gray[900],
            borderRadius: '16px',
            border: `3px solid ${COLORS.success}`,
            textAlign: 'center'
          }}>
            <Scale size={32} color={COLORS.success} style={{ marginBottom: CosmicTheme.spacing.sm }} />
            <div style={{
              fontSize: CosmicTheme.fontSizes.lg,
              color: COLORS.success,
              fontWeight: 600,
              marginBottom: '4px'
            }}>
              Equilibrium
            </div>
            <div style={{
              fontSize: CosmicTheme.fontSizes.sm,
              color: COLORS.gray[400]
            }}>
              {Math.round(rebuildingProgress.equilibrium)}% Complete
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
          "Rebuilding costs you your old life. It costs relationships that liked the 'old you' because that version was easier to control.
          You will feel lonely when you prioritize Autonomy. Exposed when you prioritize Connection. Bored when you prioritize Security.
          Stay in the discomfort. That is where the new self is forged."
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
            border: `2px solid ${COLORS.error}`
          }}>
            <div style={{
              fontSize: CosmicTheme.fontSizes.lg,
              color: COLORS.error,
              fontWeight: 600,
              marginBottom: '4px'
            }}>
              Kill the Persona
            </div>
            <div style={{
              fontSize: CosmicTheme.fontSizes.sm,
              color: COLORS.gray[400]
            }}>
              Stop performing. Find what remains.
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
              Own Your Shadow
            </div>
            <div style={{
              fontSize: CosmicTheme.fontSizes.sm,
              color: COLORS.gray[400]
            }}>
              Your dark contains your suppressed power.
            </div>
          </div>

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
              Radical Responsibility
            </div>
            <div style={{
              fontSize: CosmicTheme.fontSizes.sm,
              color: COLORS.gray[400]
            }}>
              You rebuild it. Values as foundation.
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
              Dynamic Balance
            </div>
            <div style={{
              fontSize: CosmicTheme.fontSizes.sm,
              color: COLORS.gray[400]
            }}>
              Not destination. Vibrant process.
            </div>
          </div>
        </div>

        <div style={{
          fontSize: CosmicTheme.fontSizes.sm,
          color: COLORS.gray[300]
        }}>
          Incineration • Autopsy • Architecture • Equilibrium • Values Audit • Personal Manifesto • Dynamic Balance
        </div>
      </div>
    </div>
  );
}

export default FindYourselfGuidebook;