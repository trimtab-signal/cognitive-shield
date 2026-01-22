/**
 * MODULE REPOSITORY - Global Cognitive Shield Module Ecosystem
 * Upload, discover, and install community-created modules
 *
 * "Where sovereignty meets collaboration - the decentralized module marketplace"
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Package, Upload, Download, Search, Filter, Star, Users,
  Code, FileText, Settings, Play, Heart, Share, Tag,
  TrendingUp, Calendar, User, Globe, Lock, Unlock,
  CheckCircle, AlertTriangle, Info, ExternalLink, Infinity
} from 'lucide-react';
import GOD_CONFIG from '../god.config';
import { moduleRegistry } from '../services/module-registry.service';

// Module metadata interfaces - exported for service use
export interface ModuleMetadata {
  id: string;
  name: string;
  version: string;
  description: string;
  author: {
    name: string;
    id: string;
    avatar?: string;
  };
  category: 'tool' | 'game' | 'analysis' | 'integration' | 'utility' | 'experimental';
  tags: string[];
  license: string;
  dependencies: string[];
  compatibility: {
    cognitiveShieldVersion: string;
    browserSupport: string[];
    hardwareRequirements?: string[];
  };
  stats: {
    downloads: number;
    rating: number;
    reviews: number;
    favorites: number;
  };
  screenshots?: string[];
  documentation?: string;
  repository?: string;
  createdAt: string;
  updatedAt: string;
  isVerified: boolean;
  isOfficial: boolean;
}

export interface ModuleVersion {
  version: string;
  releaseNotes: string;
  downloadUrl: string;
  fileSize: number;
  checksum: string;
  releasedAt: string;
}

export default function ModuleRepository() {
  const [activeTab, setActiveTab] = useState<'browse' | 'upload' | 'installed' | 'favorites'>('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'downloads' | 'rating' | 'recent' | 'trending'>('downloads');
  const [modules, setModules] = useState<ModuleMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState<ModuleMetadata | null>(null);
  const [uploadModal, setUploadModal] = useState(false);

  // Module data from registry service

  // Calculate categories dynamically from loaded modules
  const categories = React.useMemo(() => [
    { id: 'all', label: 'All Modules', count: modules.length },
    { id: 'tool', label: 'Tools', count: modules.filter(m => m.category === 'tool').length },
    { id: 'game', label: 'Games', count: modules.filter(m => m.category === 'game').length },
    { id: 'analysis', label: 'Analysis', count: modules.filter(m => m.category === 'analysis').length },
    { id: 'integration', label: 'Integrations', count: modules.filter(m => m.category === 'integration').length },
    { id: 'utility', label: 'Utilities', count: modules.filter(m => m.category === 'utility').length },
    { id: 'experimental', label: 'Experimental', count: modules.filter(m => m.category === 'experimental').length }
  ], [modules]);

  // Load modules on component mount and when filters change
  useEffect(() => {
    const loadModules = async () => {
      setLoading(true);
      try {
        const fetchedModules = await moduleRegistry.getModules({
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          search: searchQuery || undefined,
          sortBy: sortBy,
          limit: 50
        });
        setModules(fetchedModules);
      } catch (error) {
        console.error('Failed to load modules:', error);
        // Fallback to empty array
        setModules([]);
      }
      setLoading(false);
    };

    loadModules();
  }, [selectedCategory, searchQuery, sortBy]);

  // Modules are already filtered by the service
  const filteredModules = modules;

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      tool: '#0ea5e9',
      game: '#22c55e',
      analysis: '#8b5cf6',
      integration: '#ec4899',
      utility: '#f97316',
      experimental: '#6b7280'
    };
    return colors[category] || '#6b7280';
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        fill={i < Math.floor(rating) ? '#fbbf24' : 'none'}
        color={i < Math.floor(rating) ? '#fbbf24' : '#d1d5db'}
      />
    ));
  };

  const tabs = [
    { id: 'browse', label: 'Browse', icon: Package },
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'installed', label: 'Installed', icon: Download },
    { id: 'favorites', label: 'Favorites', icon: Heart }
  ];

  if (selectedModule) {
    return (
      <ModuleDetailView
        module={selectedModule}
        onBack={() => setSelectedModule(null)}
        onInstall={() => {
          // Handle installation logic here
          console.log('Installing module:', selectedModule.name);
        }}
      />
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
          📦 Module Repository
        </h2>
        <p style={{
          color: GOD_CONFIG.theme.text.secondary,
          fontSize: '1.1rem',
          lineHeight: '1.6'
        }}>
          Discover, share, and install community-created modules for the Cognitive Shield ecosystem.
          <br />
          <span style={{ fontSize: '0.9rem', color: '#22c55e' }}>
            🔓 Decentralized • 🤝 Collaborative • ⚡ Sovereign • 🌟 Community-Driven
          </span>
        </p>
      </div>

      {/* Tab Navigation */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          display: 'flex',
          gap: '0.25rem',
          marginBottom: '1.5rem'
        }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: activeTab === tab.id ? GOD_CONFIG.theme.text.accent : 'transparent',
                  border: `1px solid ${activeTab === tab.id ? GOD_CONFIG.theme.text.accent : GOD_CONFIG.theme.border.default}`,
                  borderRadius: '8px',
                  color: activeTab === tab.id ? '#fff' : GOD_CONFIG.theme.text.primary,
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search and Filters */}
        {activeTab === 'browse' && (
          <div style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            marginBottom: '1rem',
            flexWrap: 'wrap'
          }}>
            {/* Search */}
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
                placeholder="Search modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: GOD_CONFIG.theme.bg.primary,
                border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                borderRadius: '8px',
                color: GOD_CONFIG.theme.text.primary,
                fontSize: '0.9rem'
              }}
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.label} ({cat.count})
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: GOD_CONFIG.theme.bg.primary,
                border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                borderRadius: '8px',
                color: GOD_CONFIG.theme.text.primary,
                fontSize: '0.9rem'
              }}
            >
              <option value="downloads">Most Downloads</option>
              <option value="rating">Highest Rated</option>
              <option value="recent">Recently Updated</option>
              <option value="trending">Trending</option>
            </select>
          </div>
        )}
      </div>

      {/* Content */}
      {activeTab === 'browse' && (
        <div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '1.5rem'
          }}>
            {loading ? (
              // Loading state
              Array.from({ length: 8 }, (_, i) => (
                <div key={i} style={{
                  backgroundColor: GOD_CONFIG.theme.bg.primary,
                  border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                  borderRadius: '8px',
                  padding: '1.5rem',
                  height: '200px'
                }}>
                  <div style={{
                    backgroundColor: GOD_CONFIG.theme.bg.secondary,
                    height: '20px',
                    borderRadius: '4px',
                    marginBottom: '1rem',
                    animation: 'pulse 2s infinite'
                  }} />
                  <div style={{
                    backgroundColor: GOD_CONFIG.theme.bg.secondary,
                    height: '60px',
                    borderRadius: '4px',
                    animation: 'pulse 2s infinite'
                  }} />
                </div>
              ))
            ) : (
              filteredModules.map((module) => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  onClick={() => setSelectedModule(module)}
                />
              ))
            )}
          </div>

          {!loading && filteredModules.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              color: GOD_CONFIG.theme.text.muted
            }}>
              <Package size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <h3 style={{ marginBottom: '0.5rem', color: GOD_CONFIG.theme.text.secondary }}>
                No modules found
              </h3>
              <p>Try adjusting your search terms or filters</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'upload' && (
        <UploadModuleView onUpload={() => setUploadModal(false)} />
      )}

      {activeTab === 'installed' && (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          color: GOD_CONFIG.theme.text.muted
        }}>
          <Download size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <h3 style={{ marginBottom: '0.5rem', color: GOD_CONFIG.theme.text.secondary }}>
            Installed Modules
          </h3>
          <p>Module installation system coming soon</p>
        </div>
      )}

      {activeTab === 'favorites' && (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          color: GOD_CONFIG.theme.text.muted
        }}>
          <Heart size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <h3 style={{ marginBottom: '0.5rem', color: GOD_CONFIG.theme.text.secondary }}>
            Favorite Modules
          </h3>
          <p>Favorites system coming soon</p>
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
          🌐 Cognitive Shield Module Ecosystem
        </h4>
        <p style={{
          margin: '0 0 1rem 0',
          color: GOD_CONFIG.theme.text.secondary,
          fontSize: '0.9rem'
        }}>
          A decentralized marketplace for sovereign tools. Upload your creations, discover innovations,
          and build the future together.
        </p>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <div style={{
            fontSize: '0.8rem',
            color: '#22c55e',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Globe size={14} />
            Decentralized
          </div>
          <div style={{
            fontSize: '0.8rem',
            color: '#8b5cf6',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Users size={14} />
            Community-Driven
          </div>
          <div style={{
            fontSize: '0.8rem',
            color: '#ec4899',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Lock size={14} />
            Sovereign
          </div>
          <div style={{
            fontSize: '0.8rem',
            color: '#fbbf24',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Infinity size={14} />
            Open-Source
          </div>
        </div>
      </div>
    </div>
  );
}

// Module Card Component
interface ModuleCardProps {
  module: ModuleMetadata;
  onClick: () => void;
}

function ModuleCard({ module, onClick }: ModuleCardProps) {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      tool: '#0ea5e9',
      game: '#22c55e',
      analysis: '#8b5cf6',
      integration: '#ec4899',
      utility: '#f97316',
      experimental: '#6b7280'
    };
    return colors[category] || '#6b7280';
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        fill={i < Math.floor(rating) ? '#fbbf24' : 'none'}
        color={i < Math.floor(rating) ? '#fbbf24' : '#d1d5db'}
      />
    ));
  };

  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: GOD_CONFIG.theme.bg.primary,
        border: `1px solid ${GOD_CONFIG.theme.border.default}`,
        borderRadius: '8px',
        padding: '1.5rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = getCategoryColor(module.category);
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = GOD_CONFIG.theme.border.default;
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Badges */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        display: 'flex',
        gap: '0.5rem'
      }}>
        {module.isOfficial && (
          <span style={{
            backgroundColor: '#22c55e',
            color: 'white',
            padding: '0.125rem 0.5rem',
            borderRadius: '10px',
            fontSize: '0.7rem',
            fontWeight: '500'
          }}>
            Official
          </span>
        )}
        {module.isVerified && (
          <CheckCircle size={16} color="#22c55e" />
        )}
      </div>

      {/* Header */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '0.5rem'
        }}>
          <Package size={24} color={getCategoryColor(module.category)} />
          <div>
            <h3 style={{
              margin: 0,
              fontSize: '1.1rem',
              fontWeight: '600',
              color: GOD_CONFIG.theme.text.primary
            }}>
              {module.name}
            </h3>
            <p style={{
              margin: '0.25rem 0 0 0',
              fontSize: '0.8rem',
              color: GOD_CONFIG.theme.text.secondary
            }}>
              v{module.version} • {module.author.name}
            </p>
          </div>
        </div>

        <p style={{
          margin: 0,
          fontSize: '0.9rem',
          color: GOD_CONFIG.theme.text.secondary,
          lineHeight: '1.4'
        }}>
          {module.description.length > 120
            ? `${module.description.substring(0, 120)}...`
            : module.description
          }
        </p>
      </div>

      {/* Tags */}
      <div style={{
        display: 'flex',
        gap: '0.25rem',
        flexWrap: 'wrap',
        marginBottom: '1rem'
      }}>
        <span style={{
          fontSize: '0.7rem',
          padding: '0.125rem 0.5rem',
          backgroundColor: `${getCategoryColor(module.category)}20`,
          color: getCategoryColor(module.category),
          borderRadius: '10px',
          fontWeight: '500',
          textTransform: 'capitalize'
        }}>
          {module.category}
        </span>
        {module.tags.slice(0, 2).map((tag) => (
          <span key={tag} style={{
            fontSize: '0.7rem',
            padding: '0.125rem 0.5rem',
            backgroundColor: GOD_CONFIG.theme.bg.secondary,
            color: GOD_CONFIG.theme.text.muted,
            borderRadius: '10px',
            fontWeight: '500'
          }}>
            #{tag}
          </span>
        ))}
        {module.tags.length > 2 && (
          <span style={{
            fontSize: '0.7rem',
            padding: '0.125rem 0.5rem',
            backgroundColor: GOD_CONFIG.theme.bg.secondary,
            color: GOD_CONFIG.theme.text.muted,
            borderRadius: '10px',
            fontWeight: '500'
          }}>
            +{module.tags.length - 2}
          </span>
        )}
      </div>

      {/* Stats */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.8rem',
        color: GOD_CONFIG.theme.text.muted
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Download size={12} />
          {module.stats.downloads.toLocaleString()}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.125rem' }}>
          {getRatingStars(module.stats.rating)}
          <span style={{ marginLeft: '0.25rem' }}>
            {module.stats.rating} ({module.stats.reviews})
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Heart size={12} />
          {module.stats.favorites}
        </div>
      </div>
    </div>
  );
}

// Module Detail View Component
interface ModuleDetailViewProps {
  module: ModuleMetadata;
  onBack: () => void;
  onInstall: () => void;
}

function ModuleDetailView({ module, onBack, onInstall }: ModuleDetailViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'versions' | 'reviews'>('overview');

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      tool: '#0ea5e9',
      game: '#22c55e',
      analysis: '#8b5cf6',
      integration: '#ec4899',
      utility: '#f97316',
      experimental: '#6b7280'
    };
    return colors[category] || '#6b7280';
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        fill={i < Math.floor(rating) ? '#fbbf24' : 'none'}
        color={i < Math.floor(rating) ? '#fbbf24' : '#d1d5db'}
      />
    ));
  };

  return (
    <div style={{
      padding: '2rem',
      backgroundColor: GOD_CONFIG.theme.bg.secondary,
      borderRadius: '12px',
      border: `1px solid ${GOD_CONFIG.theme.border.default}`
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <button
          onClick={onBack}
          style={{
            padding: '0.5rem',
            backgroundColor: 'transparent',
            border: 'none',
            color: GOD_CONFIG.theme.text.secondary,
            cursor: 'pointer',
            borderRadius: '4px'
          }}
        >
          ← Back to Repository
        </button>
        <div style={{ flex: 1 }} />
        <button
          onClick={onInstall}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: GOD_CONFIG.theme.text.accent,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Download size={16} />
          Install Module
        </button>
      </div>

      {/* Module Header */}
      <div style={{
        display: 'flex',
        gap: '2rem',
        marginBottom: '2rem',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: 1 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <Package size={32} color={getCategoryColor(module.category)} />
            <div>
              <h1 style={{
                margin: 0,
                fontSize: '2rem',
                fontWeight: 'bold',
                color: GOD_CONFIG.theme.text.primary
              }}>
                {module.name}
              </h1>
              <p style={{
                margin: '0.25rem 0 0 0',
                fontSize: '1rem',
                color: GOD_CONFIG.theme.text.secondary
              }}>
                v{module.version} • {module.license}
              </p>
            </div>
          </div>

          <p style={{
            margin: '0 0 1rem 0',
            fontSize: '1.1rem',
            color: GOD_CONFIG.theme.text.secondary,
            lineHeight: '1.6'
          }}>
            {module.description}
          </p>

          {/* Author */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1rem'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: GOD_CONFIG.theme.bg.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem'
            }}>
              {module.author.avatar || '👤'}
            </div>
            <div>
              <p style={{
                margin: 0,
                fontSize: '0.9rem',
                fontWeight: '500',
                color: GOD_CONFIG.theme.text.primary
              }}>
                {module.author.name}
              </p>
              <p style={{
                margin: '0.125rem 0 0 0',
                fontSize: '0.8rem',
                color: GOD_CONFIG.theme.text.secondary
              }}>
                @{module.author.id}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex',
            gap: '2rem',
            flexWrap: 'wrap'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: GOD_CONFIG.theme.text.primary
              }}>
                {module.stats.downloads.toLocaleString()}
              </div>
              <div style={{
                fontSize: '0.8rem',
                color: GOD_CONFIG.theme.text.secondary
              }}>
                Downloads
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.25rem',
                marginBottom: '0.25rem'
              }}>
                {getRatingStars(module.stats.rating)}
                <span style={{
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  color: GOD_CONFIG.theme.text.primary
                }}>
                  {module.stats.rating}
                </span>
              </div>
              <div style={{
                fontSize: '0.8rem',
                color: GOD_CONFIG.theme.text.secondary
              }}>
                {module.stats.reviews} reviews
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: GOD_CONFIG.theme.text.primary
              }}>
                {module.stats.favorites}
              </div>
              <div style={{
                fontSize: '0.8rem',
                color: GOD_CONFIG.theme.text.secondary
              }}>
                Favorites
              </div>
            </div>
          </div>
        </div>

        {/* Screenshots */}
        {module.screenshots && module.screenshots.length > 0 && (
          <div style={{ flex: 1, minWidth: '300px' }}>
            <h3 style={{
              margin: '0 0 1rem 0',
              fontSize: '1.1rem',
              color: GOD_CONFIG.theme.text.primary
            }}>
              Screenshots
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '0.5rem'
            }}>
              {module.screenshots.slice(0, 4).map((screenshot, index) => (
                <div key={index} style={{
                  width: '120px',
                  height: '80px',
                  backgroundColor: GOD_CONFIG.theme.bg.primary,
                  border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  color: GOD_CONFIG.theme.text.secondary
                }}>
                  📸 {index + 1}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          display: 'flex',
          gap: '0.25rem'
        }}>
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'versions', label: 'Versions' },
            { id: 'reviews', label: 'Reviews' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: activeTab === tab.id ? GOD_CONFIG.theme.text.accent : 'transparent',
                border: `1px solid ${activeTab === tab.id ? GOD_CONFIG.theme.text.accent : GOD_CONFIG.theme.border.default}`,
                borderRadius: '8px',
                color: activeTab === tab.id ? '#fff' : GOD_CONFIG.theme.text.primary,
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2rem'
        }}>
          {/* Dependencies */}
          <div>
            <h3 style={{
              margin: '0 0 1rem 0',
              fontSize: '1.1rem',
              color: GOD_CONFIG.theme.text.primary
            }}>
              Dependencies
            </h3>
            <div style={{
              backgroundColor: GOD_CONFIG.theme.bg.primary,
              border: `1px solid ${GOD_CONFIG.theme.border.default}`,
              borderRadius: '8px',
              padding: '1rem'
            }}>
              {module.dependencies.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {module.dependencies.map((dep) => (
                    <div key={dep} style={{
                      padding: '0.5rem',
                      backgroundColor: GOD_CONFIG.theme.bg.secondary,
                      borderRadius: '4px',
                      fontSize: '0.9rem',
                      color: GOD_CONFIG.theme.text.primary
                    }}>
                      {dep}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{
                  margin: 0,
                  color: GOD_CONFIG.theme.text.secondary,
                  fontStyle: 'italic'
                }}>
                  No dependencies required
                </p>
              )}
            </div>
          </div>

          {/* Compatibility */}
          <div>
            <h3 style={{
              margin: '0 0 1rem 0',
              fontSize: '1.1rem',
              color: GOD_CONFIG.theme.text.primary
            }}>
              Compatibility
            </h3>
            <div style={{
              backgroundColor: GOD_CONFIG.theme.bg.primary,
              border: `1px solid ${GOD_CONFIG.theme.border.default}`,
              borderRadius: '8px',
              padding: '1rem'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <span style={{
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    color: GOD_CONFIG.theme.text.primary
                  }}>
                    Cognitive Shield:
                  </span>
                  <span style={{
                    marginLeft: '0.5rem',
                    fontSize: '0.9rem',
                    color: module.compatibility.cognitiveShieldVersion.includes('>=') ? '#22c55e' : '#f97316'
                  }}>
                    {module.compatibility.cognitiveShieldVersion}
                  </span>
                </div>
                <div>
                  <span style={{
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    color: GOD_CONFIG.theme.text.primary
                  }}>
                    Browsers:
                  </span>
                  <div style={{
                    marginTop: '0.25rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.25rem'
                  }}>
                    {module.compatibility.browserSupport.map((browser) => (
                      <span key={browser} style={{
                        fontSize: '0.8rem',
                        padding: '0.125rem 0.5rem',
                        backgroundColor: GOD_CONFIG.theme.bg.secondary,
                        color: GOD_CONFIG.theme.text.secondary,
                        borderRadius: '10px'
                      }}>
                        {browser}
                      </span>
                    ))}
                  </div>
                </div>
                {module.compatibility.hardwareRequirements && (
                  <div>
                    <span style={{
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      color: GOD_CONFIG.theme.text.primary
                    }}>
                      Hardware:
                    </span>
                    <div style={{
                      marginTop: '0.25rem',
                      fontSize: '0.8rem',
                      color: GOD_CONFIG.theme.text.secondary
                    }}>
                      {module.compatibility.hardwareRequirements.join(', ')}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'versions' && (
        <div>
          <h3 style={{
            margin: '0 0 1rem 0',
            fontSize: '1.1rem',
            color: GOD_CONFIG.theme.text.primary
          }}>
            Version History
          </h3>
          <div style={{
            backgroundColor: GOD_CONFIG.theme.bg.primary,
            border: `1px solid ${GOD_CONFIG.theme.border.default}`,
            borderRadius: '8px',
            padding: '1rem'
          }}>
            <p style={{
              margin: 0,
              color: GOD_CONFIG.theme.text.secondary,
              fontStyle: 'italic'
            }}>
              Version history and changelogs coming soon
            </p>
          </div>
        </div>
      )}

      {activeTab === 'reviews' && (
        <div>
          <h3 style={{
            margin: '0 0 1rem 0',
            fontSize: '1.1rem',
            color: GOD_CONFIG.theme.text.primary
          }}>
            Community Reviews
          </h3>
          <div style={{
            backgroundColor: GOD_CONFIG.theme.bg.primary,
            border: `1px solid ${GOD_CONFIG.theme.border.default}`,
            borderRadius: '8px',
            padding: '1rem'
          }}>
            <p style={{
              margin: 0,
              color: GOD_CONFIG.theme.text.secondary,
              fontStyle: 'italic'
            }}>
              Review system and ratings coming soon
            </p>
          </div>
        </div>
      )}

      {/* Links */}
      {(module.documentation || module.repository) && (
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: GOD_CONFIG.theme.bg.primary,
          border: `1px solid ${GOD_CONFIG.theme.border.default}`,
          borderRadius: '8px'
        }}>
          <h3 style={{
            margin: '0 0 1rem 0',
            fontSize: '1.1rem',
            color: GOD_CONFIG.theme.text.primary
          }}>
            Links
          </h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {module.documentation && (
              <a
                href={module.documentation}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: GOD_CONFIG.theme.bg.secondary,
                  color: GOD_CONFIG.theme.text.primary,
                  textDecoration: 'none',
                  borderRadius: '6px',
                  fontSize: '0.9rem'
                }}
              >
                <FileText size={16} />
                Documentation
              </a>
            )}
            {module.repository && (
              <a
                href={module.repository}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: GOD_CONFIG.theme.bg.secondary,
                  color: GOD_CONFIG.theme.text.primary,
                  textDecoration: 'none',
                  borderRadius: '6px',
                  fontSize: '0.9rem'
                }}
              >
                <ExternalLink size={16} />
                Source Code
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Upload Module View Component
function UploadModuleView({ onUpload }: { onUpload: () => void }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '4rem 2rem',
      color: GOD_CONFIG.theme.text.muted
    }}>
      <Upload size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
      <h3 style={{ marginBottom: '0.5rem', color: GOD_CONFIG.theme.text.secondary }}>
        Upload Module
      </h3>
      <p>Module upload system coming soon</p>
      <p style={{ fontSize: '0.9rem', marginTop: '1rem' }}>
        Share your Cognitive Shield creations with the community
      </p>
    </div>
  );
}