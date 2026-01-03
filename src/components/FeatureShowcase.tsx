/**
 * FEATURE SHOWCASE
 * Interactive demonstration of all Cognitive Shield features
 */

import { useState } from 'react';
import {
  Shield,
  Send,
  Heart,
  Radio,
  Box,
  Activity,
  Brain,
  Calculator,
  Book,
  HelpCircle,
  CheckCircle2,
  Zap,
  Volume2,
  Flower2,
  DoorOpen,
  Hammer,
  Code2,
  Lock,
  Globe,
  ChevronRight,
  Play,
  Star,
} from 'lucide-react';
import GOD_CONFIG from '../god.config';

interface Feature {
  id: string;
  name: string;
  category: string;
  icon: typeof Shield;
  description: string;
  howTo: string[];
  demo?: string;
  tab?: string;
}

const FEATURES: Feature[] = [
  // CORE
  {
    id: 'shield',
    name: 'Message Shield',
    category: 'Core',
    icon: Shield,
    description: 'Analyzes incoming messages for emotional voltage, genre, and potential triggers. Transforms high-voltage content into receivable form.',
    howTo: [
      'Go to the Shield tab',
      'Paste or type a message in the input box',
      'Click "Process" to analyze',
      'View the voltage gauge and breakdown',
      'Use the translated version for safer communication',
    ],
    tab: 'shield',
  },
  {
    id: 'compose',
    name: 'Response Composer',
    category: 'Core',
    icon: Send,
    description: 'AI-assisted response generation with tone control. Creates regulated responses to difficult messages.',
    howTo: [
      'Process a message first (Shield tab)',
      'Go to Compose tab',
      'Select your desired tone (Calm, Firm, etc.)',
      'Click "Generate Response"',
      'Edit and refine as needed',
      'Copy to clipboard when ready',
    ],
    tab: 'compose',
  },
  {
    id: 'safe',
    name: 'You Are Safe Protocol',
    category: 'Safety',
    icon: Heart,
    description: '4-node validation check before high-stakes communication. Ensures you\'re grounded and ready.',
    howTo: [
      'Click the "Safe" tab (shows heart icon)',
      'Answer each validation question honestly:',
      '  1. Somatic Valence (body check)',
      '  2. Safety Integrity (immediate safety)',
      '  3. Regulatory Status (nervous system)',
      '  4. Connection Readiness (social)',
      'All 4 must be green to proceed',
    ],
    tab: 'safe',
  },

  // SOMATIC
  {
    id: 'lime-drag',
    name: 'Lime Drag Protocol',
    category: 'Somatic',
    icon: Zap,
    description: 'Trigeminal nerve activation using ice + lime + salt. Jolts the RAS into high-alert state for focus.',
    howTo: [
      'Go to Somatic tab',
      'Find the green "LIME DRAG" button',
      'Physical version: Hold ice + lime wedge + salt',
      'Digital version: Press button for haptic shock',
      'Feel the RAS wake up',
    ],
    tab: 'somatic',
  },
  {
    id: 'grounding-rose',
    name: 'Grounding Rose',
    category: 'Somatic',
    icon: Flower2,
    description: 'Haptic anchor like counting rosary beads. Each press grounds you in the physical Now.',
    howTo: [
      'Go to Somatic tab',
      'Find the "GROUNDING ROSE" button',
      'Press repeatedly to count',
      'Every 10 presses triggers a Vagus signal',
      'Use during anxiety or dissociation',
    ],
    tab: 'somatic',
  },
  {
    id: 'brown-noise',
    name: 'Brown Noise Generator',
    category: 'Somatic',
    icon: Volume2,
    description: 'Built-in audio for focus. Occupies the under-stimulated brain without overwhelming.',
    howTo: [
      'Go to Somatic tab',
      'Find the "BROWN NOISE" button',
      'Click to toggle on/off',
      'Adjust volume with slider',
      'Use during work or when under-aroused',
    ],
    tab: 'somatic',
  },
  {
    id: 'airlock',
    name: 'Airlock Protocol',
    category: 'Somatic',
    icon: DoorOpen,
    description: 'Context-switching pressure equalization. Prevents the "bends" when moving between environments.',
    howTo: [
      'Go to Somatic tab → Airlock tab',
      'See your current context (Gaming/Social/Work/Rest/Creative)',
      'Click target context to switch',
      'Wait for pressure to equalize (progress bar)',
      'Transition completes with Vagus signal',
    ],
    tab: 'somatic',
  },
  {
    id: 'ras-monitor',
    name: 'RAS Monitor',
    category: 'Somatic',
    icon: Activity,
    description: 'Real-time display of Reticular Activating System arousal level (0-100%).',
    howTo: [
      'Go to Somatic tab → RAS Monitor tab',
      'View current arousal percentage',
      'Green zone (30-70%) = Optimal',
      'Use "Calm Down" or "Energize" buttons to adjust',
      'Quick fixes suggested based on state',
    ],
    tab: 'somatic',
  },
  {
    id: 'heavy-work',
    name: 'Heavy Work Tracker',
    category: 'Somatic',
    icon: Hammer,
    description: 'Log physical regulation activities. Earn spoons back through proprioceptive work.',
    howTo: [
      'Go to Somatic tab → Heavy Work tab',
      'Select or type activity (Push-ups, Walk, etc.)',
      'Set duration in minutes',
      'Click "Log" to record',
      'View spoon recovery (+1 per 5 minutes)',
    ],
    tab: 'somatic',
  },

  // NETWORK
  {
    id: 'heartbeat',
    name: 'Heartbeat Mesh',
    category: 'Network',
    icon: Radio,
    description: 'Peer-to-peer connection via WebRTC. Direct encrypted links between family members.',
    howTo: [
      'Go to Heartbeat tab',
      'Copy your Node ID',
      'Generate an invite code',
      'Share code with family member',
      'They enter code in their app',
      'Both confirm connection',
      'See connected nodes and their status',
    ],
    tab: 'heartbeat',
  },
  {
    id: 'tetrahedron',
    name: 'Tetrahedron Protocol',
    category: 'Network',
    icon: Box,
    description: '4-node geometry for structural stability. The minimum stable structure in 3D space.',
    howTo: [
      'Go to Tetrahedron tab',
      'View 3D visualization of your mesh',
      'See symmetry score and curvature',
      'Monitor edge health between nodes',
      'Add fourth node for full stability',
    ],
    tab: 'tetrahedron',
  },

  // MATH
  {
    id: 'math-dashboard',
    name: 'Mathematics Dashboard',
    category: 'Math',
    icon: Calculator,
    description: 'Live computation of all core equations. See the math that drives the system.',
    howTo: [
      'Go to Math tab',
      'Watch equations compute in real-time',
      'Toggle LIVE/PAUSED mode',
      'Enter sample code to analyze',
      'View: Resonance, SIC-POVM, Density, Curvature, Spoons, Impedance',
    ],
    tab: 'math',
  },

  // MODULE
  {
    id: 'module-maker',
    name: 'Module Maker',
    category: 'Modules',
    icon: Code2,
    description: 'Create custom extensions using Vibe Coding. AI translates intent into code.',
    howTo: [
      'Go to Module Maker tab',
      'Describe what you want in plain English',
      'Click "Generate Module"',
      'Review the Harmonic Linter report',
      'Check resonance score (target: 0.35)',
      'Deploy or refine as needed',
    ],
    tab: 'module-maker',
  },

  // KNOWLEDGE
  {
    id: 'story',
    name: 'The Story',
    category: 'Knowledge',
    icon: Book,
    description: '8-chapter narrative weaving together the physics, the lineage, and the love.',
    howTo: [
      'Go to The Story tab',
      'Read chapters in order',
      'Use Previous/Next buttons to navigate',
      'Chapters: Clocks, Woodshop, Race Car Brain, Vibrant Spirit, Block Universe, Fourth Node, Love, Flight',
    ],
    tab: 'story',
  },
  {
    id: 'faq',
    name: 'FAQ',
    category: 'Knowledge',
    icon: HelpCircle,
    description: '16 questions covering connection, safety, technical, and philosophy.',
    howTo: [
      'Go to FAQ tab',
      'Click any question to expand',
      'Filter by category',
      'Start with "I just want to hold my wife"',
    ],
    tab: 'faq',
  },
];

const CATEGORIES = [
  { id: 'Core', color: '#3b82f6' },
  { id: 'Safety', color: '#22c55e' },
  { id: 'Somatic', color: '#8b5cf6' },
  { id: 'Network', color: '#06b6d4' },
  { id: 'Math', color: '#f59e0b' },
  { id: 'Modules', color: '#ec4899' },
  { id: 'Knowledge', color: '#6366f1' },
];

export function FeatureShowcase() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedFeature, setExpandedFeature] = useState<string | null>('shield');

  const filteredFeatures = selectedCategory
    ? FEATURES.filter(f => f.category === selectedCategory)
    : FEATURES;

  const getCategoryColor = (category: string) => {
    return CATEGORIES.find(c => c.id === category)?.color || GOD_CONFIG.theme.text.muted;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div
        style={{
          padding: 24,
          backgroundColor: GOD_CONFIG.theme.bg.secondary,
          borderRadius: 12,
          border: `1px solid ${GOD_CONFIG.theme.border.default}`,
          textAlign: 'center',
        }}
      >
        <Star size={32} color={GOD_CONFIG.theme.text.accent} style={{ marginBottom: 12 }} />
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: GOD_CONFIG.theme.text.primary }}>
          Feature Showcase
        </h2>
        <p style={{ margin: '8px 0 0 0', fontSize: 14, color: GOD_CONFIG.theme.text.secondary }}>
          {FEATURES.length} features • Interactive how-to guides
        </p>
      </div>

      {/* Category Filter */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        justifyContent: 'center',
        padding: 12,
        backgroundColor: GOD_CONFIG.theme.bg.secondary,
        borderRadius: 8,
      }}>
        <button
          onClick={() => setSelectedCategory(null)}
          style={{
            padding: '8px 16px',
            backgroundColor: selectedCategory === null ? GOD_CONFIG.theme.text.accent : GOD_CONFIG.theme.bg.tertiary,
            border: 'none',
            borderRadius: 6,
            color: selectedCategory === null ? '#fff' : GOD_CONFIG.theme.text.muted,
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          All ({FEATURES.length})
        </button>
        {CATEGORIES.map(cat => {
          const count = FEATURES.filter(f => f.category === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: '8px 16px',
                backgroundColor: selectedCategory === cat.id ? cat.color : GOD_CONFIG.theme.bg.tertiary,
                border: 'none',
                borderRadius: 6,
                color: selectedCategory === cat.id ? '#fff' : GOD_CONFIG.theme.text.muted,
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              {cat.id} ({count})
            </button>
          );
        })}
      </div>

      {/* Feature List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filteredFeatures.map(feature => {
          const isExpanded = expandedFeature === feature.id;
          const Icon = feature.icon;
          const color = getCategoryColor(feature.category);

          return (
            <div
              key={feature.id}
              style={{
                backgroundColor: GOD_CONFIG.theme.bg.secondary,
                borderRadius: 12,
                border: `1px solid ${isExpanded ? color : GOD_CONFIG.theme.border.default}`,
                overflow: 'hidden',
              }}
            >
              {/* Header */}
              <button
                onClick={() => setExpandedFeature(isExpanded ? null : feature.id)}
                style={{
                  width: '100%',
                  padding: 16,
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  textAlign: 'left',
                }}
              >
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  backgroundColor: `${color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={20} color={color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: GOD_CONFIG.theme.text.primary,
                    }}>
                      {feature.name}
                    </span>
                    <span style={{
                      fontSize: 10,
                      padding: '2px 6px',
                      backgroundColor: `${color}20`,
                      color: color,
                      borderRadius: 4,
                    }}>
                      {feature.category}
                    </span>
                  </div>
                  <div style={{
                    fontSize: 13,
                    color: GOD_CONFIG.theme.text.secondary,
                    marginTop: 4,
                  }}>
                    {feature.description}
                  </div>
                </div>
                <ChevronRight
                  size={20}
                  color={GOD_CONFIG.theme.text.muted}
                  style={{
                    transform: isExpanded ? 'rotate(90deg)' : 'none',
                    transition: 'transform 0.2s ease',
                  }}
                />
              </button>

              {/* How-To Steps */}
              {isExpanded && (
                <div style={{
                  padding: '0 16px 16px 68px',
                  borderTop: `1px solid ${GOD_CONFIG.theme.border.default}`,
                }}>
                  <div style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: color,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginTop: 16,
                    marginBottom: 12,
                  }}>
                    How To Use
                  </div>
                  <ol style={{
                    margin: 0,
                    paddingLeft: 20,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                  }}>
                    {feature.howTo.map((step, i) => (
                      <li key={i} style={{
                        fontSize: 13,
                        color: GOD_CONFIG.theme.text.secondary,
                        lineHeight: 1.5,
                      }}>
                        {step}
                      </li>
                    ))}
                  </ol>
                  
                  {feature.tab && (
                    <div style={{ marginTop: 16 }}>
                      <button
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: '10px 16px',
                          backgroundColor: color,
                          border: 'none',
                          borderRadius: 8,
                          color: '#fff',
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        <Play size={14} />
                        Go to {feature.name}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Reference */}
      <div
        style={{
          padding: 20,
          backgroundColor: GOD_CONFIG.theme.bg.secondary,
          borderRadius: 12,
          border: `1px solid ${GOD_CONFIG.theme.border.default}`,
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 600, color: GOD_CONFIG.theme.text.primary, marginBottom: 12 }}>
          🚀 Quick Start Checklist
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
          {[
            'Process a message (Shield)',
            'Run You Are Safe protocol',
            'Try the Lime Drag',
            'Generate a response (Compose)',
            'Explore the Mathematics',
            'Read The Story',
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle2 size={14} color={GOD_CONFIG.heartbeat.statuses.green.color} />
              <span style={{ fontSize: 12, color: GOD_CONFIG.theme.text.secondary }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FeatureShowcase;



