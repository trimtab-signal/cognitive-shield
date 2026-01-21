/**
 * COGNITIVE SHIELD LIBRARY - The Universal Knowledge Repository
 * Access to all integrated research, tools, and analyses
 *
 * "Where knowledge meets capability - the complete cognitive toolkit"
 */

import React, { useState, useMemo } from 'react';
import {
  Library, Search, Filter, BookOpen, Shield, Zap, Brain, Clock,
  Database, Globe, Cpu, Network, FileText, Code2, Gamepad2,
  ChevronRight, Star, ExternalLink, Download, Eye
} from 'lucide-react';
import GOD_CONFIG from '../god.config';
import CognitiveHubOSS from './CognitiveHubOSS';
import CognitiveHubAppsScript from './CognitiveHubAppsScript';
import CognitiveShieldUnstoppable from './CognitiveShieldUnstoppable';

interface LibraryItem {
  id: string;
  title: string;
  description: string;
  category: 'research' | 'tool' | 'analysis' | 'demo' | 'integration';
  tags: string[];
  icon: React.ReactNode;
  component?: React.ComponentType;
  externalUrl?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimatedTime: string;
  lastUpdated: string;
  status: 'available' | 'beta' | 'coming-soon';
  prerequisites?: string[];
}

const LIBRARY_ITEMS: LibraryItem[] = [
  // Research & Analysis
  {
    id: 'time-infrastructure',
    title: 'The Floating Neutral: Time Infrastructure Analysis',
    description: 'Comprehensive analysis of centralized time vulnerabilities, Byzantine fault-tolerant solutions, and mesh topology resilience for temporal coordination.',
    category: 'research',
    tags: ['time', 'infrastructure', 'security', 'byzantine', 'mesh'],
    icon: <Clock size={20} />,
    component: React.lazy(() => import('./TimeInfrastructureAnalysis')),
    difficulty: 'advanced',
    estimatedTime: '45 min read',
    lastUpdated: '2026-01-19',
    status: 'available'
  },
  {
    id: 'drive-librarian-research',
    title: 'Drive Librarian: Privacy & Intelligence Framework',
    description: 'Advanced PII detection, evidence categorization, and document organization system with cryptographic security guarantees.',
    category: 'research',
    tags: ['privacy', 'PII', 'evidence', 'cryptography', 'NLP'],
    icon: <Shield size={20} />,
    difficulty: 'intermediate',
    estimatedTime: '30 min read',
    lastUpdated: '2026-01-19',
    status: 'available',
    externalUrl: 'https://github.com/phenix-navigator/drive-librarian'
  },
  {
    id: 'cognitive-hub-architecture',
    title: 'Cognitive Hub: Brain-Inspired Information Flow',
    description: 'Isomorphic architecture mirroring human cognition with capture, processing, storage, synthesis, and output layers.',
    category: 'research',
    tags: ['cognition', 'architecture', 'brain', 'information-flow'],
    icon: <Brain size={20} />,
    difficulty: 'advanced',
    estimatedTime: '40 min read',
    lastUpdated: '2026-01-19',
    status: 'available',
    externalUrl: 'https://github.com/phenix-navigator/cognitive-hub-oss'
  },

  // Tools & Demos
  {
    id: 'drive-librarian-demo',
    title: 'Drive Librarian Interactive Demo',
    description: 'Live demonstration of PII detection, evidence categorization, and document processing with sample files.',
    category: 'demo',
    tags: ['demo', 'PII', 'evidence', 'interactive'],
    icon: <Shield size={20} />,
    component: React.lazy(() => import('./DriveLibrarianDemo')),
    difficulty: 'beginner',
    estimatedTime: '15 min demo',
    lastUpdated: '2026-01-19',
    status: 'available'
  },
  {
    id: 'cognitive-hub-demo',
    title: 'Cognitive Hub Live Simulation',
    description: 'Interactive brain-inspired information processing with capture, analysis, and synthesis pipeline visualization.',
    category: 'demo',
    tags: ['demo', 'cognition', 'interactive', 'pipeline'],
    icon: <Brain size={20} />,
    component: React.lazy(() => import('./CognitiveHubDemo')),
    difficulty: 'beginner',
    estimatedTime: '20 min demo',
    lastUpdated: '2026-01-19',
    status: 'available'
  },
  {
    id: 'perfect-onboarding',
    title: 'Perfect Onboarding Experience',
    description: '7-step guided tour through quantum development with interactive 3D visualizations and progressive disclosure.',
    category: 'demo',
    tags: ['onboarding', 'tutorial', '3D', 'quantum'],
    icon: <Star size={20} />,
    component: React.lazy(() => import('./PerfectOnboarding')),
    difficulty: 'beginner',
    estimatedTime: '15 min tour',
    lastUpdated: '2026-01-19',
    status: 'available'
  },

  // Core System Components
  {
    id: 'tetrahedron-protocol',
    title: 'Tetrahedron Protocol & Quantum Primitives',
    description: 'Complete quantum development environment with SIC-POVM simulation, Fisher-Escolà physics, and tetrahedral mathematics.',
    category: 'tool',
    tags: ['quantum', 'tetrahedron', 'physics', 'simulation'],
    icon: <Zap size={20} />,
    component: React.lazy(() => import('./TetrahedronProtocol')),
    difficulty: 'intermediate',
    estimatedTime: 'Variable',
    lastUpdated: '2026-01-19',
    status: 'available'
  },
  {
    id: 'coherence-quest',
    title: 'Coherence Quest: Quantum Biology Game',
    description: 'Interactive quantum physics game teaching molecular coherence through gameplay and real-time physics simulation.',
    category: 'tool',
    tags: ['game', 'quantum', 'biology', 'physics'],
    icon: <Gamepad2 size={20} />,
    component: React.lazy(() => import('./CoherenceQuest')),
    difficulty: 'beginner',
    estimatedTime: 'Variable',
    lastUpdated: '2026-01-19',
    status: 'available'
  },

  // Integrations
  {
    id: 'webcontainer-ide',
    title: 'WebContainer IDE',
    description: 'Browser-based Node.js runtime with quantum project templates, package management, and live preview.',
    category: 'integration',
    tags: ['IDE', 'Node.js', 'browser', 'development'],
    icon: <Code2 size={20} />,
    component: React.lazy(() => import('./WebContainerIDE')),
    difficulty: 'intermediate',
    estimatedTime: 'Variable',
    lastUpdated: '2026-01-19',
    status: 'available'
  },
  {
    id: 'godot-wasm-studio',
    title: 'Godot WASM Game Development Studio',
    description: 'Browser-based Godot engine with WebAssembly compilation, quantum game templates, and live preview.',
    category: 'integration',
    tags: ['Godot', 'WebAssembly', 'games', '3D'],
    icon: <Gamepad2 size={20} />,
    component: React.lazy(() => import('./GodotWASMStudio')),
    difficulty: 'advanced',
    estimatedTime: 'Variable',
    lastUpdated: '2026-01-19',
    status: 'available'
  },
  {
    id: 'luanti-voxel-studio',
    title: 'Luanti Voxel World Builder',
    description: 'Quantum-enhanced voxel world engine with entanglement mechanics, coherence fields, and multiplayer support.',
    category: 'integration',
    tags: ['voxel', 'world-building', 'quantum', 'multiplayer'],
    icon: <Database size={20} />,
    component: React.lazy(() => import('./LuantiVoxelStudio')),
    difficulty: 'intermediate',
    estimatedTime: 'Variable',
    lastUpdated: '2026-01-19',
    status: 'available'
  },

  // Advanced Analysis
  {
    id: 'jitterbug-visualizer',
    title: 'Jitterbug Entropy Visualization',
    description: '7 GLSL shaders visualizing quantum entropy states: Crimson Chaos, Azure Turbulence, Emerald Harmony, and more.',
    category: 'analysis',
    tags: ['visualization', 'entropy', 'GLSL', 'shaders'],
    icon: <Eye size={20} />,
    component: React.lazy(() => import('./JitterbugVisualizer')),
    difficulty: 'advanced',
    estimatedTime: 'Variable',
    lastUpdated: '2026-01-19',
    status: 'available'
  },
  {
    id: 'quantum-entanglement-demo',
    title: 'Quantum Entanglement Bridge',
    description: 'Real-time cross-tab quantum entanglement visualization with SIC-POVM mathematics and measurement effects.',
    category: 'analysis',
    tags: ['quantum', 'entanglement', 'real-time', 'visualization'],
    icon: <Network size={20} />,
    component: React.lazy(() => import('./QuantumEntanglementDemo')),
    difficulty: 'intermediate',
    estimatedTime: 'Variable',
    lastUpdated: '2026-01-19',
    status: 'available'
  },
  {
    id: 'cognitive-hub-oss',
    title: 'Cognitive Hub OSS - Python Implementation',
    description: 'Full-stack sovereign cognitive processing with Python backend, Flask web interface, SQLite database, and local AI integration.',
    category: 'integration',
    tags: ['python', 'flask', 'sqlite', 'sovereign', 'ai'],
    icon: <Code2 size={20} />,
    component: React.lazy(() => import('./CognitiveHubOSS')),
    difficulty: 'advanced',
    estimatedTime: 'Variable',
    lastUpdated: '2026-01-19',
    status: 'available',
    externalUrl: 'https://github.com/phenix-navigator/cognitive-hub-oss'
  },
  {
    id: 'cognitive-hub-apps-script',
    title: 'Cognitive Hub Apps Script - Google Workspace',
    description: 'Native Google Workspace cognitive processing with Gemini AI, automated workflows, PII detection, and task management.',
    category: 'integration',
    tags: ['google', 'apps-script', 'gemini', 'workspace', 'automation'],
    icon: <Database size={20} />,
    component: React.lazy(() => import('./CognitiveHubAppsScript')),
    difficulty: 'intermediate',
    estimatedTime: '15 min setup',
    lastUpdated: '2026-01-19',
    status: 'available',
    externalUrl: 'https://github.com/phenix-navigator/cognitive-hub-apps-script'
  },
  {
    id: 'cognitive-shield-unstoppable',
    title: 'Cognitive Shield Unstoppable - Resilient Sovereign Network',
    description: 'Distributed, self-healing, energy-independent cognitive infrastructure with mesh networking, quantum security, and autonomous operation.',
    category: 'integration',
    tags: ['unstoppable', 'resilient', 'sovereign', 'mesh', 'energy', 'autonomous'],
    icon: <Infinity size={20} />,
    component: React.lazy(() => import('./CognitiveShieldUnstoppable')),
    difficulty: 'expert',
    estimatedTime: 'Variable',
    lastUpdated: '2026-01-19',
    status: 'available'
  }
];

export default function CognitiveShieldLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);

  const categories = [
    { id: 'all', label: 'All Items', count: LIBRARY_ITEMS.length },
    { id: 'research', label: 'Research', count: LIBRARY_ITEMS.filter(i => i.category === 'research').length },
    { id: 'tool', label: 'Tools', count: LIBRARY_ITEMS.filter(i => i.category === 'tool').length },
    { id: 'demo', label: 'Demos', count: LIBRARY_ITEMS.filter(i => i.category === 'demo').length },
    { id: 'analysis', label: 'Analysis', count: LIBRARY_ITEMS.filter(i => i.category === 'analysis').length },
    { id: 'integration', label: 'Integrations', count: LIBRARY_ITEMS.filter(i => i.category === 'integration').length }
  ];

  const difficulties = [
    { id: 'all', label: 'All Levels' },
    { id: 'beginner', label: 'Beginner' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'advanced', label: 'Advanced' },
    { id: 'expert', label: 'Expert' }
  ];

  const filteredItems = useMemo(() => {
    return LIBRARY_ITEMS.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || item.difficulty === selectedDifficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [searchTerm, selectedCategory, selectedDifficulty]);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      research: '#8b5cf6',
      tool: '#06b6d4',
      demo: '#22c55e',
      analysis: '#ec4899',
      integration: '#fbbf24'
    };
    return colors[category] || '#6b7280';
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      beginner: '#22c55e',
      intermediate: '#eab308',
      advanced: '#f97316',
      expert: '#ef4444'
    };
    return colors[difficulty] || '#6b7280';
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, any> = {
      available: { bg: '#f0fdf4', color: '#16a34a', text: 'Available' },
      beta: { bg: '#fefce8', color: '#ca8a04', text: 'Beta' },
      'coming-soon': { bg: '#f3f4f6', color: '#6b7280', text: 'Coming Soon' }
    };
    const style = styles[status] || styles.available;

    return (
      <span style={{
        backgroundColor: style.bg,
        color: style.color,
        padding: '0.125rem 0.5rem',
        borderRadius: '12px',
        fontSize: '0.75rem',
        fontWeight: '500'
      }}>
        {style.text}
      </span>
    );
  };

  if (selectedItem?.component) {
    const Component = selectedItem.component;
    return (
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1rem',
          padding: '1rem',
          backgroundColor: GOD_CONFIG.theme.bg.secondary,
          borderRadius: '8px'
        }}>
          <button
            onClick={() => setSelectedItem(null)}
            style={{
              padding: '0.5rem',
              backgroundColor: 'transparent',
              border: 'none',
              color: GOD_CONFIG.theme.text.secondary,
              cursor: 'pointer',
              borderRadius: '4px'
            }}
          >
            ← Back to Library
          </button>
          <div style={{ color: getCategoryColor(selectedItem.category) }}>
            {selectedItem.icon}
          </div>
          <div>
            <h3 style={{
              margin: 0,
              color: GOD_CONFIG.theme.text.primary,
              fontSize: '1.1rem'
            }}>
              {selectedItem.title}
            </h3>
            <p style={{
              margin: '0.25rem 0 0 0',
              color: GOD_CONFIG.theme.text.secondary,
              fontSize: '0.9rem'
            }}>
              {selectedItem.description}
            </p>
          </div>
        </div>

        <React.Suspense fallback={
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '4rem',
            color: GOD_CONFIG.theme.text.secondary
          }}>
            Loading {selectedItem.title}...
          </div>
        }>
          <Component />
        </React.Suspense>
      </div>
    );
  }

  return (
    <div style={{
      padding: '2rem',
      backgroundColor: GOD_CONFIG.theme.bg.secondary,
      borderRadius: '12px',
      border: `1px solid ${GOD_CONFIG.theme.border.default}`
    }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{
          fontSize: '1.8rem',
          fontWeight: 'bold',
          background: GOD_CONFIG.theme.gradient.shield,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '0.5rem'
        }}>
          📚 Cognitive Shield Library
        </h2>
        <p style={{
          color: GOD_CONFIG.theme.text.secondary,
          fontSize: '1.1rem',
          lineHeight: '1.6'
        }}>
          The complete repository of research, tools, analyses, and integrations.
          Where knowledge meets capability in the sovereign development ecosystem.
        </p>
      </div>

      {/* Search and Filters */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '1.5rem',
          alignItems: 'center'
        }}>
          <div style={{
            position: 'relative',
            flex: 1,
            maxWidth: '400px'
          }}>
            <Search size={16} style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: GOD_CONFIG.theme.text.muted
            }} />
            <input
              type="text"
              placeholder="Search library..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.5rem',
                backgroundColor: GOD_CONFIG.theme.bg.primary,
                border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                borderRadius: '8px',
                color: GOD_CONFIG.theme.text.primary,
                fontSize: '0.9rem'
              }}
            />
          </div>
        </div>

        {/* Category Filters */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1rem',
          flexWrap: 'wrap'
        }}>
          {categories.map(({ id, label, count }) => (
            <button
              key={id}
              onClick={() => setSelectedCategory(id)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: selectedCategory === id ? getCategoryColor(id) : GOD_CONFIG.theme.bg.primary,
                color: selectedCategory === id ? 'white' : GOD_CONFIG.theme.text.primary,
                border: `1px solid ${selectedCategory === id ? getCategoryColor(id) : GOD_CONFIG.theme.border.default}`,
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {label}
              <span style={{
                backgroundColor: selectedCategory === id ? 'rgba(255,255,255,0.2)' : GOD_CONFIG.theme.bg.secondary,
                color: selectedCategory === id ? 'white' : GOD_CONFIG.theme.text.muted,
                padding: '0.125rem 0.375rem',
                borderRadius: '8px',
                fontSize: '0.75rem'
              }}>
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* Difficulty Filters */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap'
        }}>
          {difficulties.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setSelectedDifficulty(id)}
              style={{
                padding: '0.375rem 0.75rem',
                backgroundColor: selectedDifficulty === id ? getDifficultyColor(id) : GOD_CONFIG.theme.bg.primary,
                color: selectedDifficulty === id ? 'white' : GOD_CONFIG.theme.text.primary,
                border: `1px solid ${selectedDifficulty === id ? getDifficultyColor(id) : GOD_CONFIG.theme.border.default}`,
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div style={{
        marginBottom: '1.5rem',
        color: GOD_CONFIG.theme.text.secondary,
        fontSize: '0.9rem'
      }}>
        Showing {filteredItems.length} of {LIBRARY_ITEMS.length} items
      </div>

      {/* Library Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '1.5rem'
      }}>
        {filteredItems.map((item) => (
          <div
            key={item.id}
            style={{
              backgroundColor: GOD_CONFIG.theme.bg.primary,
              border: `1px solid ${GOD_CONFIG.theme.border.default}`,
              borderRadius: '8px',
              padding: '1.5rem',
              cursor: item.component || item.externalUrl ? 'pointer' : 'default',
              transition: 'all 0.2s ease',
              position: 'relative'
            }}
            onClick={() => {
              if (item.component) {
                setSelectedItem(item);
              } else if (item.externalUrl) {
                window.open(item.externalUrl, '_blank');
              }
            }}
            onMouseEnter={(e) => {
              if (item.component || item.externalUrl) {
                e.currentTarget.style.borderColor = getCategoryColor(item.category);
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (item.component || item.externalUrl) {
                e.currentTarget.style.borderColor = GOD_CONFIG.theme.border.default;
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            {/* Status Badge */}
            <div style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem'
            }}>
              {getStatusBadge(item.status)}
            </div>

            {/* Icon and Title */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1rem'
            }}>
              <div style={{
                color: getCategoryColor(item.category),
                backgroundColor: `${getCategoryColor(item.category)}15`,
                padding: '0.5rem',
                borderRadius: '6px'
              }}>
                {item.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{
                  margin: '0 0 0.25rem 0',
                  color: GOD_CONFIG.theme.text.primary,
                  fontSize: '1rem',
                  fontWeight: '600',
                  lineHeight: '1.3'
                }}>
                  {item.title}
                </h3>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  flexWrap: 'wrap'
                }}>
                  <span style={{
                    fontSize: '0.75rem',
                    padding: '0.125rem 0.5rem',
                    backgroundColor: `${getCategoryColor(item.category)}15`,
                    color: getCategoryColor(item.category),
                    borderRadius: '10px',
                    fontWeight: '500',
                    textTransform: 'capitalize'
                  }}>
                    {item.category}
                  </span>
                  <span style={{
                    fontSize: '0.75rem',
                    padding: '0.125rem 0.5rem',
                    backgroundColor: `${getDifficultyColor(item.difficulty)}15`,
                    color: getDifficultyColor(item.difficulty),
                    borderRadius: '10px',
                    fontWeight: '500'
                  }}>
                    {item.difficulty}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p style={{
              margin: '0 0 1rem 0',
              color: GOD_CONFIG.theme.text.secondary,
              fontSize: '0.9rem',
              lineHeight: '1.5'
            }}>
              {item.description}
            </p>

            {/* Tags */}
            <div style={{
              display: 'flex',
              gap: '0.25rem',
              flexWrap: 'wrap',
              marginBottom: '1rem'
            }}>
              {item.tags.slice(0, 4).map((tag) => (
                <span key={tag} style={{
                  fontSize: '0.7rem',
                  padding: '0.125rem 0.375rem',
                  backgroundColor: GOD_CONFIG.theme.bg.secondary,
                  color: GOD_CONFIG.theme.text.muted,
                  borderRadius: '6px',
                  fontWeight: '500'
                }}>
                  #{tag}
                </span>
              ))}
              {item.tags.length > 4 && (
                <span style={{
                  fontSize: '0.7rem',
                  padding: '0.125rem 0.375rem',
                  backgroundColor: GOD_CONFIG.theme.bg.secondary,
                  color: GOD_CONFIG.theme.text.muted,
                  borderRadius: '6px',
                  fontWeight: '500'
                }}>
                  +{item.tags.length - 4} more
                </span>
              )}
            </div>

            {/* Metadata */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.8rem',
              color: GOD_CONFIG.theme.text.muted
            }}>
              <span>{item.estimatedTime}</span>
              <span>Updated {item.lastUpdated}</span>
            </div>

            {/* Action Button */}
            {(item.component || item.externalUrl) && (
              <div style={{
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: `1px solid ${GOD_CONFIG.theme.border.default}`
              }}>
                <button style={{
                  width: '100%',
                  padding: '0.5rem',
                  backgroundColor: getCategoryColor(item.category),
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}>
                  {item.component ? (
                    <>
                      <Eye size={14} />
                      Open Demo
                    </>
                  ) : (
                    <>
                      <ExternalLink size={14} />
                      View Source
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          color: GOD_CONFIG.theme.text.muted
        }}>
          <Library size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <h3 style={{ marginBottom: '0.5rem', color: GOD_CONFIG.theme.text.secondary }}>
            No items found
          </h3>
          <p>Try adjusting your search terms or filters</p>
        </div>
      )}

      {/* Footer */}
      <div style={{
        marginTop: '3rem',
        padding: '1.5rem',
        backgroundColor: GOD_CONFIG.theme.bg.primary,
        border: `1px solid ${GOD_CONFIG.theme.border.default}`,
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h4 style={{
          margin: '0 0 1rem 0',
          color: GOD_CONFIG.theme.text.primary,
          fontSize: '1rem'
        }}>
          🧠 The Cognitive Shield Ecosystem
        </h4>
        <p style={{
          margin: '0',
          color: GOD_CONFIG.theme.text.secondary,
          fontSize: '0.9rem',
          lineHeight: '1.5'
        }}>
          <strong>Research → Tools → Integration → Sovereignty</strong><br />
          Every component designed for maximum resilience, privacy, and capability.
          Built for the quantum development revolution.
        </p>
        <div style={{
          marginTop: '1rem',
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <span style={{
            fontSize: '0.8rem',
            color: '#8b5cf6',
            fontWeight: '500'
          }}>
            🔒 Privacy-First Architecture
          </span>
          <span style={{
            fontSize: '0.8rem',
            color: '#22c55e',
            fontWeight: '500'
          }}>
            ⚡ Zero-Trust Security
          </span>
          <span style={{
            fontSize: '0.8rem',
            color: '#ec4899',
            fontWeight: '500'
          }}>
            🧬 Quantum-Ready Systems
          </span>
          <span style={{
            fontSize: '0.8rem',
            color: '#fbbf24',
            fontWeight: '500'
          }}>
            🌐 Sovereign Infrastructure
          </span>
        </div>
      </div>
    </div>
  );
}