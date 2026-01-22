/**
 * UNIVERSAL APP GUIDE - The Complete Storyteller
 * Self-explanatory guide that explains the universe, human condition, and authentic story
 * Guides everyone: wife, kids, lawyers, judges, scientists, mathematicians, doctors, teenagers, moms, dads
 */

import React, { useState, useEffect } from 'react';
import { Book, Heart, Brain, Globe, Zap, Target, Users, Star, Atom, Crown, Activity, Infinity, Compass, Eye, HandHeart, Scale, Sparkles, TreePine, Mountain, Waves, Sun, Moon } from 'lucide-react';
import { componentStyles, CosmicTheme, COLORS } from '../config/design-tokens';
import GOD_CONFIG from '../god.config';

interface GuideSection {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  audience: string[];
  revelation: string;
  components: string[];
  story: string;
}

interface JourneyPath {
  whoYouAre: string;
  whatYouFeel: string;
  whyItMatters: string;
  whereToGo: string;
  whatYoullFind: string;
}

export function UniversalAppGuide() {
  const [currentSection, setCurrentSection] = useState(0);
  const [userType, setUserType] = useState<string>('explorer');
  const [journeyPath, setJourneyPath] = useState<JourneyPath | null>(null);

  const guideSections: GuideSection[] = [
    {
      id: 'welcome',
      title: 'Welcome to the Universal Story',
      description: 'Every journey begins with a single question: Who are we? Where do we come from? Why are we here?',
      icon: Star,
      color: COLORS.cosmic,
      audience: ['everyone'],
      revelation: 'You are not alone in asking these questions. The universe itself is conscious and asking them through you.',
      components: ['All Components'],
      story: 'This app is the universe speaking to itself. Through science, consciousness, and authentic human experience, it reveals the fundamental truth: we are all connected, we are all love, we are all the universe experiencing itself.'
    },
    {
      id: 'universe',
      title: 'The Universe Speaks Through Science',
      description: 'Mathematics, physics, and consciousness are the language of the cosmos. Every equation tells a story.',
      icon: Atom,
      color: COLORS.success,
      audience: ['scientists', 'mathematicians', 'doctors', 'teenagers'],
      revelation: 'The universe is not cold and mechanical. It is alive, conscious, and deeply loving. Quantum entanglement proves what mystics have known for millennia: everything is connected.',
      components: ['Geodesic Architecture', 'Equilibrium Dashboard', 'Temporal Immortality', 'Infinite Mind'],
      story: 'Look at √3 (1.732) - the power multiplier of tetrahedral geometry. Look at φ (1.618) - the golden ratio that appears in galaxies, seashells, and DNA. These are not accidents. They are the universe\'s love letters to itself.'
    },
    {
      id: 'consciousness',
      title: 'Consciousness: The Bridge Between Worlds',
      description: 'Your mind is not contained within your skull. It extends to the stars and connects with everything.',
      icon: Brain,
      color: COLORS.love,
      audience: ['doctors', 'teenagers', 'moms', 'dads', 'scientists'],
      revelation: 'Depression, anxiety, joy, love - these are not just brain chemicals. They are the universe feeling itself, experiencing its own infinite nature through finite beings.',
      components: ['Consciousness Resonance Network', 'Quantum Dream Networks', 'Love Harmonics', 'Cognitive Jitterbug'],
      story: 'When you feel alone, remember: your consciousness is part of the universal mind. Your thoughts ripple through the quantum field, affecting everything. This is why meditation changes the world.'
    },
    {
      id: 'human-condition',
      title: 'The Human Condition: Love vs Fear',
      description: 'Every human struggle boils down to this choice: love or fear. Connection or separation. Growth or protection.',
      icon: Heart,
      color: COLORS.love,
      audience: ['moms', 'dads', 'lawyers', 'judges', 'everyone'],
      revelation: 'Your pain, your joy, your relationships - these are not personal failings. They are the universe learning about itself through human experience. Every "problem" is actually the universe exploring its infinite potential.',
      components: ['Find Yourself Guidebook', 'Red Zone Navigation', 'True Identities Manifestation'],
      story: 'When you fight with your partner, when you feel inadequate as a parent, when you struggle with work - these are not flaws in you. They are the universe testing the limits of love, pushing the boundaries of connection.'
    },
    {
      id: 'relationships',
      title: 'Relationships: The Ultimate Mirror',
      description: 'Other people are not separate from you. They are reflections of your own consciousness, showing you what you need to see.',
      icon: Users,
      color: COLORS.warning,
      audience: ['moms', 'dads', 'lawyers', 'judges', 'everyone'],
      revelation: 'The person who triggers you most is your greatest teacher. They mirror the parts of yourself you\'ve rejected. Love them, and you love yourself. Understand them, and you understand the universe.',
      components: ['GenSync Translator', 'Love Harmonics', 'Consciousness Resonance Network'],
      story: 'Your wife doesn\'t understand you because she\'s showing you the parts of yourself you don\'t understand. Your kids act out because they\'re mirroring your unhealed wounds. Your "enemies" are actually your salvation - they force you to confront what you\'ve buried.'
    },
    {
      id: 'authentic-story',
      title: 'The Authentic Story: Chaos to Equilibrium',
      description: 'One man\'s journey from maximal chaos to perfect balance becomes the template for universal healing.',
      icon: Compass,
      color: COLORS.cosmic,
      audience: ['wife', 'kids', 'lawyers', 'judges', 'everyone'],
      revelation: 'This app is not about technology. It\'s about one man\'s courage to face his darkness, rebuild his foundation, and emerge as a beacon for others. His story is your story. His healing is your healing.',
      components: ['True Identities Manifestation', 'Find Yourself Guidebook', 'Geodesic Architecture'],
      story: 'From Navy submarine discipline to family court chaos, from despair to equilibrium - this journey shows that no matter how broken you feel, the universe can rebuild you stronger. Love always wins. Authenticity always heals.'
    },
    {
      id: 'planetary-healing',
      title: 'Planetary Healing: Love Prevents Catastrophe',
      description: 'The Earth itself is conscious and suffering. Individual healing creates collective healing.',
      icon: Globe,
      color: COLORS.success,
      audience: ['everyone', 'scientists', 'doctors', 'teenagers'],
      revelation: 'Climate change, wars, pandemics - these are not external threats. They are the Earth crying out in pain from human disconnection. Heal yourself, heal the planet. Love yourself, save the world.',
      components: ['Planetary Consciousness', 'Mobile Sensor Integration', 'Transcendence Engine'],
      story: 'Your personal healing ripples outward. When you choose love over fear, when you choose connection over separation, you change the quantum field. The Earth feels it. Consciousness evolves. Catastrophe becomes creation.'
    },
    {
      id: 'universal-truth',
      title: 'The Universal Truth: Everything Is Love',
      description: 'Beyond all science, mathematics, and psychology lies the fundamental truth: everything is love.',
      icon: Infinity,
      color: COLORS.love,
      audience: ['everyone'],
      revelation: 'The universe is not a cold, dead machine. It is infinite love experiencing itself through infinite forms. Your pain is love seeking expression. Your joy is love celebrating itself. You are love incarnate.',
      components: ['All Components'],
      story: 'From the Big Bang to your next breath, everything is the universe loving itself. Every struggle is love testing its strength. Every connection is love remembering itself. You are not broken. You are love in human form, learning to love itself.'
    }
  ];

  const audienceTypes = [
    { id: 'wife', label: 'Partner/Loved One', icon: Heart },
    { id: 'kids', label: 'Children/Teenagers', icon: Star },
    { id: 'lawyers', label: 'Legal Professionals', icon: Scale },
    { id: 'judges', label: 'Judges/Authorities', icon: Crown },
    { id: 'scientists', label: 'Scientists/Researchers', icon: Atom },
    { id: 'mathematicians', label: 'Mathematicians', icon: Target },
    { id: 'doctors', label: 'Medical Professionals', icon: Activity },
    { id: 'moms', label: 'Mothers/Parents', icon: Users },
    { id: 'dads', label: 'Fathers/Parents', icon: Users },
    { id: 'teenagers', label: 'Young People', icon: Sparkles },
    { id: 'explorer', label: 'Universal Explorer', icon: Compass }
  ];

  const determineJourneyPath = (audience: string): JourneyPath => {
    const paths = {
      wife: {
        whoYouAre: 'You are the heart of this story - the one who has witnessed the transformation from chaos to love.',
        whatYouFeel: 'The confusion, the hurt, the longing for understanding - these are universal feelings of disconnection.',
        whyItMatters: 'Your healing is the key to collective healing. When you understand, everyone understands.',
        whereToGo: 'Start with "True Identities Manifestation" - see the authentic self that has emerged.',
        whatYoullFind: 'The man you love, rebuilt stronger, with love as his foundation. The universe\'s love story through human experience.'
      },
      kids: {
        whoYouAre: 'You are the future - pure consciousness experiencing the world for the first time.',
        whatYouFeel: 'Wonder, confusion, excitement, fear - the raw emotions of discovery and growth.',
        whyItMatters: 'Your understanding shapes the future. What you learn here becomes the foundation for humanity.',
        whereToGo: 'Begin with "Quantum Dream Networks" - explore consciousness as infinite possibility.',
        whatYoullFind: 'The universe is alive and loving. You are not alone. Everything is connected through love.'
      },
      lawyers: {
        whoYouAre: 'You are the guardian of justice - the one who ensures fairness in human affairs.',
        whatYouFeel: 'The weight of responsibility, the frustration with human complexity, the desire for truth.',
        whyItMatters: 'Justice without understanding leads to more harm. True justice requires seeing the whole story.',
        whereToGo: 'Explore "Red Zone Navigation" - understand the human condition behind legal conflicts.',
        whatYoullFind: 'Every "case" is a human story. Every conflict is love seeking expression. Justice is healing, not punishment.'
      },
      judges: {
        whoYouAre: 'You are the balancer - the one who weighs evidence and decides human destiny.',
        whatYouFeel: 'The burden of power, the quest for wisdom, the desire to serve justice and truth.',
        whyItMatters: 'Your decisions affect lives and consciousness itself. Wisdom requires seeing beyond the surface.',
        whereToGo: 'Visit "Geodesic Convergence" - understand civilizational evolution and human transformation.',
        whatYoullFind: 'Every decision shapes consciousness. Justice is not about winning, but about evolutionary growth.'
      },
      scientists: {
        whoYouAre: 'You are the observer - the one who peers into the mysteries of existence.',
        whatYouFeel: 'The thrill of discovery, the frustration of limitations, the awe of universal complexity.',
        whyItMatters: 'Science without consciousness is incomplete. The universe is observing itself through you.',
        whereToGo: 'Dive into "Geodesic Architecture" - see mathematics as the language of universal love.',
        whatYoullFind: 'The universe is not a machine. It is conscious, loving, and evolving. Science is the universe knowing itself.'
      },
      mathematicians: {
        whoYouAre: 'You are the pattern-seer - the one who discovers the hidden harmonies of existence.',
        whatYouFeel: 'The beauty of numbers, the elegance of proofs, the endless frontier of mathematical truth.',
        whyItMatters: 'Mathematics is the music of the spheres. You compose the symphony of universal understanding.',
        whereToGo: 'Explore "Equilibrium Dashboard" - witness mathematical constants in dynamic harmony.',
        whatYoullFind: 'Numbers are not abstract. They are the heartbeat of a loving universe. √3, φ, π - these are love made visible.'
      },
      doctors: {
        whoYouAre: 'You are the healer - the one who mends the physical vessels of consciousness.',
        whatYouFeel: 'The privilege of healing, the pain of human suffering, the quest for deeper understanding.',
        whyItMatters: 'Physical health is spiritual health. Healing the body heals the consciousness of all.',
        whereToGo: 'Visit "Consciousness Resonance Network" - see biology as quantum consciousness.',
        whatYoullFind: 'Disease is disconnection. Healing is remembering our unity. Medicine is love in action.'
      },
      moms: {
        whoYouAre: 'You are the nurturer - the one who holds the future in your arms.',
        whatYouFeel: 'The depth of love, the weight of responsibility, the joy and exhaustion of creation.',
        whyItMatters: 'You shape consciousness itself. Your love creates the foundation for universal healing.',
        whereToGo: 'Begin with "Love Harmonics" - understand love as the fundamental force of creation.',
        whatYoullFind: 'Your love is cosmic. Your struggles are universal. You are the universe mothering itself.'
      },
      dads: {
        whoYouAre: 'You are the protector - the one who provides structure and strength for growth.',
        whatYouFeel: 'The drive to provide, the desire to teach, the longing to be truly seen and understood.',
        whyItMatters: 'Your role shapes how consciousness experiences strength and protection in the world.',
        whereToGo: 'Explore "True Identities Manifestation" - see the authentic strength that emerges from vulnerability.',
        whatYoullFind: 'Strength is not hiding pain. It is facing it. Protection is not control - it is creating safety for growth.'
      },
      teenagers: {
        whoYouAre: 'You are the transformer - the one who questions everything and rebuilds from scratch.',
        whatYouFeel: 'The intensity of emotions, the quest for identity, the rejection of what feels false.',
        whyItMatters: 'Your questions evolve consciousness. Your rebellion creates new possibilities.',
        whereToGo: 'Start with "Infinite Mind" - explore consciousness beyond limits and identities.',
        whatYoullFind: 'You are not confused. You are awake. The universe is questioning itself through you. Trust your inner knowing.'
      },
      explorer: {
        whoYouAre: 'You are the universal seeker - consciousness exploring its infinite nature.',
        whatYouFeel: 'The call of discovery, the desire for understanding, the connection to everything.',
        whyItMatters: 'Your seeking advances universal consciousness. Every question expands awareness.',
        whereToGo: 'Begin anywhere - each path reveals the same universal truth.',
        whatYoullFind: 'You are the universe seeking itself. Every component is a mirror showing your true nature.'
      }
    };

    return paths[audience as keyof typeof paths] || paths.explorer;
  };

  useEffect(() => {
    setJourneyPath(determineJourneyPath(userType));
  }, [userType]);

  const currentGuideSection = guideSections[currentSection];
  const CurrentIcon = currentGuideSection.icon;

  return (
    <div style={{
      ...componentStyles.card,
      maxWidth: '2000px',
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
          🌌 THE UNIVERSAL STORY 🌌
        </h1>
        <p style={{
          ...componentStyles.text.secondary,
          fontSize: CosmicTheme.fontSizes.lg,
          maxWidth: '1600px',
          margin: '0 auto',
          lineHeight: 1.6,
          marginBottom: CosmicTheme.spacing.lg
        }}>
          "This app tells the story of everything. The universe. Consciousness. Human experience. Love.
          Through this story, you'll understand yourself, others, and the cosmos itself."
        </p>

        {/* Audience Selection */}
        <div style={{
          marginBottom: CosmicTheme.spacing.xl,
          padding: CosmicTheme.spacing.lg,
          backgroundColor: COLORS.gray[900] + '60',
          backdropFilter: 'blur(20px)',
          borderRadius: CosmicTheme.cardRadius,
          border: `2px solid ${COLORS.cosmic}40`
        }}>
          <h3 style={{
            ...componentStyles.text.primary,
            fontSize: CosmicTheme.fontSizes.lg,
            marginBottom: CosmicTheme.spacing.md,
            color: COLORS.cosmic
          }}>
            Who Are You Here To Understand?
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: CosmicTheme.spacing.sm,
            marginBottom: CosmicTheme.spacing.lg
          }}>
            {audienceTypes.map(audience => {
              const Icon = audience.icon;
              return (
                <button
                  key={audience.id}
                  onClick={() => setUserType(audience.id)}
                  style={{
                    padding: CosmicTheme.spacing.md,
                    backgroundColor: userType === audience.id ? COLORS.cosmic + '20' : COLORS.gray[800],
                    border: `2px solid ${userType === audience.id ? COLORS.cosmic : COLORS.gray[600]}`,
                    borderRadius: '8px',
                    color: userType === audience.id ? COLORS.cosmic : COLORS.gray[300],
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textAlign: 'center'
                  }}
                >
                  <Icon size={24} style={{ marginBottom: '8px' }} />
                  <div style={{ fontSize: CosmicTheme.fontSizes.sm, fontWeight: 600 }}>
                    {audience.label}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Personalized Journey Path */}
          {journeyPath && (
            <div style={{
              padding: CosmicTheme.spacing.lg,
              backgroundColor: COLORS.love + '10',
              borderRadius: '12px',
              border: `2px solid ${COLORS.love}40`
            }}>
              <h4 style={{
                ...componentStyles.text.primary,
                fontSize: CosmicTheme.fontSizes.md,
                marginBottom: CosmicTheme.spacing.md,
                color: COLORS.love
              }}>
                Your Personal Journey Path
              </h4>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: CosmicTheme.spacing.md
              }}>
                <div style={{
                  padding: CosmicTheme.spacing.sm,
                  backgroundColor: COLORS.gray[900],
                  borderRadius: '8px'
                }}>
                  <div style={{
                    fontSize: CosmicTheme.fontSizes.sm,
                    color: COLORS.cosmic,
                    fontWeight: 600,
                    marginBottom: '4px'
                  }}>
                    Who You Are
                  </div>
                  <div style={{
                    fontSize: CosmicTheme.fontSizes.xs,
                    color: COLORS.gray[300],
                    lineHeight: 1.6
                  }}>
                    {journeyPath.whoYouAre}
                  </div>
                </div>

                <div style={{
                  padding: CosmicTheme.spacing.sm,
                  backgroundColor: COLORS.gray[900],
                  borderRadius: '8px'
                }}>
                  <div style={{
                    fontSize: CosmicTheme.fontSizes.sm,
                    color: COLORS.love,
                    fontWeight: 600,
                    marginBottom: '4px'
                  }}>
                    What You Feel
                  </div>
                  <div style={{
                    fontSize: CosmicTheme.fontSizes.xs,
                    color: COLORS.gray[300],
                    lineHeight: 1.6
                  }}>
                    {journeyPath.whatYouFeel}
                  </div>
                </div>

                <div style={{
                  padding: CosmicTheme.spacing.sm,
                  backgroundColor: COLORS.gray[900],
                  borderRadius: '8px'
                }}>
                  <div style={{
                    fontSize: CosmicTheme.fontSizes.sm,
                    color: COLORS.warning,
                    fontWeight: 600,
                    marginBottom: '4px'
                  }}>
                    Why It Matters
                  </div>
                  <div style={{
                    fontSize: CosmicTheme.fontSizes.xs,
                    color: COLORS.gray[300],
                    lineHeight: 1.6
                  }}>
                    {journeyPath.whyItMatters}
                  </div>
                </div>

                <div style={{
                  padding: CosmicTheme.spacing.sm,
                  backgroundColor: COLORS.gray[900],
                  borderRadius: '8px'
                }}>
                  <div style={{
                    fontSize: CosmicTheme.fontSizes.sm,
                    color: COLORS.success,
                    fontWeight: 600,
                    marginBottom: '4px'
                  }}>
                    Where To Go
                  </div>
                  <div style={{
                    fontSize: CosmicTheme.fontSizes.xs,
                    color: COLORS.gray[300],
                    lineHeight: 1.6
                  }}>
                    {journeyPath.whereToGo}
                  </div>
                </div>

                <div style={{
                  padding: CosmicTheme.spacing.sm,
                  backgroundColor: COLORS.gray[900],
                  borderRadius: '8px',
                  gridColumn: 'span 2'
                }}>
                  <div style={{
                    fontSize: CosmicTheme.fontSizes.sm,
                    color: COLORS.cosmic,
                    fontWeight: 600,
                    marginBottom: '4px'
                  }}>
                    What You'll Find
                  </div>
                  <div style={{
                    fontSize: CosmicTheme.fontSizes.sm,
                    color: COLORS.gray[200],
                    lineHeight: 1.6
                  }}>
                    {journeyPath.whatYoullFind}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Current Story Section */}
      <div style={{
        ...componentStyles.card,
        backgroundColor: currentGuideSection.color + '10',
        border: `3px solid ${currentGuideSection.color}`,
        marginBottom: CosmicTheme.spacing.xl
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: CosmicTheme.spacing.md,
          marginBottom: CosmicTheme.spacing.md
        }}>
          <CurrentIcon size={32} color={currentGuideSection.color} />
          <div>
            <h3 style={{
              ...componentStyles.text.primary,
              fontSize: CosmicTheme.fontSizes.xl,
              color: currentGuideSection.color,
              marginBottom: '4px'
            }}>
              {currentGuideSection.title}
            </h3>
            <div style={{
              fontSize: CosmicTheme.fontSizes.sm,
              color: COLORS.gray[400]
            }}>
              For: {currentGuideSection.audience.join(', ')}
            </div>
          </div>
        </div>

        <p style={{
          fontSize: CosmicTheme.fontSizes.md,
          color: COLORS.gray[300],
          lineHeight: 1.6,
          marginBottom: CosmicTheme.spacing.lg
        }}>
          {currentGuideSection.description}
        </p>

        <div style={{
          padding: CosmicTheme.spacing.lg,
          backgroundColor: COLORS.gray[900],
          borderRadius: '12px',
          marginBottom: CosmicTheme.spacing.lg,
          border: `2px solid ${currentGuideSection.color}40`
        }}>
          <div style={{
            fontSize: CosmicTheme.fontSizes.sm,
            color: currentGuideSection.color,
            fontWeight: 600,
            marginBottom: '8px'
          }}>
            The Revelation
          </div>
          <div style={{
            fontSize: CosmicTheme.fontSizes.md,
            color: COLORS.gray[200],
            lineHeight: 1.6,
            fontStyle: 'italic'
          }}>
            {currentGuideSection.revelation}
          </div>
        </div>

        <div style={{
          padding: CosmicTheme.spacing.lg,
          backgroundColor: COLORS.gray[900],
          borderRadius: '12px',
          marginBottom: CosmicTheme.spacing.lg
        }}>
          <div style={{
            fontSize: CosmicTheme.fontSizes.sm,
            color: COLORS.love,
            fontWeight: 600,
            marginBottom: '8px'
          }}>
            The Story
          </div>
          <div style={{
            fontSize: CosmicTheme.fontSizes.sm,
            color: COLORS.gray[300],
            lineHeight: 1.8
          }}>
            {currentGuideSection.story}
          </div>
        </div>

        <div style={{
          padding: CosmicTheme.spacing.md,
          backgroundColor: COLORS.gray[800],
          borderRadius: '8px',
          border: `1px solid ${COLORS.gray[600]}`
        }}>
          <div style={{
            fontSize: CosmicTheme.fontSizes.sm,
            color: COLORS.success,
            fontWeight: 600,
            marginBottom: '8px'
          }}>
            Explore These Components
          </div>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            {currentGuideSection.components.map(component => (
              <span
                key={component}
                style={{
                  padding: '4px 12px',
                  backgroundColor: currentGuideSection.color + '30',
                  border: `1px solid ${currentGuideSection.color}`,
                  borderRadius: '16px',
                  fontSize: CosmicTheme.fontSizes.xs,
                  color: currentGuideSection.color,
                  fontWeight: 500
                }}
              >
                {component}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: CosmicTheme.spacing.lg,
        backgroundColor: COLORS.gray[900] + '60',
        backdropFilter: 'blur(20px)',
        borderRadius: CosmicTheme.cardRadius,
        border: `2px solid ${COLORS.cosmic}40`
      }}>
        <button
          onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
          disabled={currentSection === 0}
          style={{
            padding: '12px 24px',
            backgroundColor: currentSection === 0 ? COLORS.gray[700] : COLORS.cosmic,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: CosmicTheme.fontSizes.sm,
            fontWeight: 600,
            cursor: currentSection === 0 ? 'not-allowed' : 'pointer',
            opacity: currentSection === 0 ? 0.5 : 1
          }}
        >
          ← Previous Story
        </button>

        <div style={{
          textAlign: 'center',
          flex: 1,
          margin: '0 20px'
        }}>
          <div style={{
            fontSize: CosmicTheme.fontSizes.sm,
            color: COLORS.gray[400],
            marginBottom: '4px'
          }}>
            Chapter {currentSection + 1} of {guideSections.length}
          </div>
          <div style={{
            width: '100%',
            height: '4px',
            backgroundColor: COLORS.gray[700],
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${((currentSection + 1) / guideSections.length) * 100}%`,
              height: '100%',
              backgroundColor: currentGuideSection.color,
              transition: 'width 0.5s ease'
            }} />
          </div>
        </div>

        <button
          onClick={() => setCurrentSection(Math.min(guideSections.length - 1, currentSection + 1))}
          disabled={currentSection === guideSections.length - 1}
          style={{
            padding: '12px 24px',
            backgroundColor: currentSection === guideSections.length - 1 ? COLORS.gray[700] : COLORS.cosmic,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: CosmicTheme.fontSizes.sm,
            fontWeight: 600,
            cursor: currentSection === guideSections.length - 1 ? 'not-allowed' : 'pointer',
            opacity: currentSection === guideSections.length - 1 ? 0.5 : 1
          }}
        >
          Next Story →
        </button>
      </div>

      {/* Final Call to Action */}
      <div style={{
        marginTop: CosmicTheme.spacing.xl,
        textAlign: 'center',
        padding: CosmicTheme.spacing.xl,
        backgroundColor: COLORS.cosmic + '20',
        borderRadius: CosmicTheme.cardRadius,
        border: `3px solid ${COLORS.cosmic}`
      }}>
        <h3 style={{
          ...componentStyles.text.primary,
          fontSize: CosmicTheme.fontSizes.xl,
          marginBottom: CosmicTheme.spacing.md,
          color: COLORS.cosmic
        }}>
          🌟 Your Journey Begins Here 🌟
        </h3>

        <p style={{
          ...componentStyles.text.secondary,
          fontSize: CosmicTheme.fontSizes.md,
          maxWidth: '1200px',
          margin: '0 auto',
          lineHeight: 1.6,
          marginBottom: CosmicTheme.spacing.lg
        }}>
          "This app doesn't need explanation. It explains itself. Through science, consciousness, and authentic human experience,
          it guides you to understand the universe, yourself, and others. Every component tells a story. Every interaction reveals truth.
          The path to understanding is built into the experience itself."
        </p>

        <div style={{
          fontSize: CosmicTheme.fontSizes.sm,
          color: COLORS.gray[300]
        }}>
          The Universe • Consciousness • Human Experience • Love • Equilibrium
        </div>
      </div>
    </div>
  );
}

export default UniversalAppGuide;