/**
 * COGNITIVE HUB APPS SCRIPT - Google Workspace Integration
 * Native Google Drive cognitive processing with automated workflows
 *
 * "Google Workspace as your cognitive extension"
 */

import React, { useState, useCallback } from 'react';
import {
  FileText, Settings, Play, Calendar, Target, MessageSquare,
  Folder, Database, Zap, Shield, CheckCircle, AlertTriangle,
  ExternalLink, Code, Terminal
} from 'lucide-react';
import GOD_CONFIG from '../god.config';

interface AppsScriptFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'enabled' | 'disabled' | 'configuring';
  triggers: string[];
}

export default function CognitiveHubAppsScript() {
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'triggers' | 'deployment'>('overview');

  const features: AppsScriptFeature[] = [
    {
      id: 'voice-transcription',
      title: 'Voice Memo Transcription',
      description: 'Automatic transcription of audio files using Gemini AI with task extraction',
      icon: <MessageSquare size={16} />,
      status: 'enabled',
      triggers: ['Hourly', 'On file upload']
    },
    {
      id: 'domain-categorization',
      title: 'Domain Categorization',
      description: 'AI-powered categorization of content into specialized domains with keyword matching',
      icon: <Folder size={16} />,
      status: 'enabled',
      triggers: ['Every 15 min', 'Manual trigger']
    },
    {
      id: 'evidence-tagging',
      title: 'Evidence Level Tagging',
      description: 'Scientific evidence classification (Verified/Speculative) with color highlighting',
      icon: <CheckCircle size={16} />,
      status: 'enabled',
      triggers: ['After categorization', 'Manual']
    },
    {
      id: 'pii-detection',
      title: 'PII Detection & Redaction',
      description: 'Automatically detect and redact sensitive information with backup preservation',
      icon: <Shield size={16} />,
      status: 'enabled',
      triggers: ['On file processing', 'Manual']
    },
    {
      id: 'task-extraction',
      title: 'Task Extraction',
      description: 'Extract actionable items from text and create Google Tasks with due dates',
      icon: <Target size={16} />,
      status: 'enabled',
      triggers: ['On capture', 'Daily sync']
    },
    {
      id: 'weekly-summary',
      title: 'Weekly Summary Generation',
      description: 'Automated weekly reports with insights, trends, and action recommendations',
      icon: <Calendar size={16} />,
      status: 'enabled',
      triggers: ['Weekly (Sunday 8 AM)']
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Database },
    { id: 'features', label: 'Features', icon: Settings },
    { id: 'triggers', label: 'Automation', icon: Play },
    { id: 'deployment', label: 'Deployment', icon: Code }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'enabled': return '#22c55e';
      case 'disabled': return '#ef4444';
      case 'configuring': return '#f97316';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'enabled': return <CheckCircle size={14} style={{ color: '#22c55e' }} />;
      case 'disabled': return <AlertTriangle size={14} style={{ color: '#ef4444' }} />;
      case 'configuring': return <Settings size={14} style={{ color: '#f97316' }} />;
      default: return <AlertTriangle size={14} />;
    }
  };

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
          📊 Cognitive Hub Apps Script - Google Workspace
        </h2>
        <p style={{
          color: GOD_CONFIG.theme.text.secondary,
          fontSize: '1.1rem',
          lineHeight: '1.6'
        }}>
          Native Google Workspace cognitive processing with automated workflows, AI integration, and zero external dependencies.
          <br />
          <span style={{ fontSize: '0.9rem', color: '#22c55e' }}>
            🔒 Native Google • 🤖 Gemini AI • 📅 Automated • 📊 Analytics
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
                  padding: '0.75rem 1.5rem',
                  backgroundColor: activeTab === tab.id ? GOD_CONFIG.theme.text.accent : GOD_CONFIG.theme.bg.primary,
                  color: activeTab === tab.id ? 'white' : GOD_CONFIG.theme.text.primary,
                  border: `1px solid ${activeTab === tab.id ? GOD_CONFIG.theme.text.accent : GOD_CONFIG.theme.border.default}`,
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* System Architecture */}
            <div>
              <h4 style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                color: GOD_CONFIG.theme.text.primary,
                marginBottom: '1rem'
              }}>
                🏗️ System Architecture
              </h4>

              <div style={{
                backgroundColor: GOD_CONFIG.theme.bg.primary,
                border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                borderRadius: '8px',
                padding: '1rem'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <FileText size={18} style={{ color: '#4285f4' }} />
                    <div>
                      <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>Google Drive</div>
                      <div style={{ fontSize: '0.8rem', color: GOD_CONFIG.theme.text.secondary }}>File storage & organization</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <MessageSquare size={18} style={{ color: '#34a853' }} />
                    <div>
                      <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>Gemini AI</div>
                      <div style={{ fontSize: '0.8rem', color: GOD_CONFIG.theme.text.secondary }}>Content analysis & processing</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Database size={18} style={{ color: '#ea4335' }} />
                    <div>
                      <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>Google Sheets</div>
                      <div style={{ fontSize: '0.8rem', color: GOD_CONFIG.theme.text.secondary }}>Task tracking & analytics</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Target size={18} style={{ color: '#fbbc04' }} />
                    <div>
                      <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>Google Tasks</div>
                      <div style={{ fontSize: '0.8rem', color: GOD_CONFIG.theme.text.secondary }}>Action item management</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Code size={18} style={{ color: '#8b5cf6' }} />
                    <div>
                      <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>Apps Script</div>
                      <div style={{ fontSize: '0.8rem', color: GOD_CONFIG.theme.text.secondary }}>Automation & processing logic</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div>
              <h4 style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                color: GOD_CONFIG.theme.text.primary,
                marginBottom: '1rem'
              }}>
                📈 System Status
              </h4>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem'
              }}>
                <div style={{
                  backgroundColor: GOD_CONFIG.theme.bg.primary,
                  border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                  borderRadius: '8px',
                  padding: '1rem',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#22c55e', marginBottom: '0.25rem' }}>
                    6
                  </div>
                  <div style={{ fontSize: '0.8rem', color: GOD_CONFIG.theme.text.secondary }}>
                    Active Features
                  </div>
                </div>

                <div style={{
                  backgroundColor: GOD_CONFIG.theme.bg.primary,
                  border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                  borderRadius: '8px',
                  padding: '1rem',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#06b6d4', marginBottom: '0.25rem' }}>
                    15min
                  </div>
                  <div style={{ fontSize: '0.8rem', color: GOD_CONFIG.theme.text.secondary }}>
                    Processing Interval
                  </div>
                </div>

                <div style={{
                  backgroundColor: GOD_CONFIG.theme.bg.primary,
                  border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                  borderRadius: '8px',
                  padding: '1rem',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.25rem' }}>
                    8
                  </div>
                  <div style={{ fontSize: '0.8rem', color: GOD_CONFIG.theme.text.secondary }}>
                    Domain Categories
                  </div>
                </div>

                <div style={{
                  backgroundColor: GOD_CONFIG.theme.bg.primary,
                  border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                  borderRadius: '8px',
                  padding: '1rem',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ec4899', marginBottom: '0.25rem' }}>
                    24/7
                  </div>
                  <div style={{ fontSize: '0.8rem', color: GOD_CONFIG.theme.text.secondary }}>
                    Automated Operation
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div>
            <h4 style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              color: GOD_CONFIG.theme.text.primary,
              marginBottom: '1rem'
            }}>
              ⚙️ Feature Configuration
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {features.map((feature) => (
                <div key={feature.id} style={{
                  backgroundColor: GOD_CONFIG.theme.bg.primary,
                  border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                  borderRadius: '8px',
                  padding: '1rem'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '0.75rem'
                  }}>
                    <div style={{ color: getStatusColor(feature.status) }}>
                      {feature.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h5 style={{
                        margin: 0,
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: GOD_CONFIG.theme.text.primary
                      }}>
                        {feature.title}
                      </h5>
                      <p style={{
                        margin: '0.25rem 0 0 0',
                        fontSize: '0.85rem',
                        color: GOD_CONFIG.theme.text.secondary
                      }}>
                        {feature.description}
                      </p>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      {getStatusIcon(feature.status)}
                      <span style={{
                        fontSize: '0.8rem',
                        color: getStatusColor(feature.status),
                        textTransform: 'capitalize'
                      }}>
                        {feature.status}
                      </span>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    flexWrap: 'wrap'
                  }}>
                    {feature.triggers.map((trigger) => (
                      <span key={trigger} style={{
                        fontSize: '0.7rem',
                        padding: '0.25rem 0.5rem',
                        backgroundColor: GOD_CONFIG.theme.bg.secondary,
                        color: GOD_CONFIG.theme.text.muted,
                        borderRadius: '4px'
                      }}>
                        {trigger}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'triggers' && (
          <div>
            <h4 style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              color: GOD_CONFIG.theme.text.primary,
              marginBottom: '1rem'
            }}>
              ⏰ Automation Schedule
            </h4>

            <div style={{
              backgroundColor: GOD_CONFIG.theme.bg.primary,
              border: `1px solid ${GOD_CONFIG.theme.border.default}`,
              borderRadius: '8px',
              padding: '1.5rem'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                <div>
                  <h5 style={{
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#22c55e',
                    marginBottom: '1rem'
                  }}>
                    🕐 Real-time Processing
                  </h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.85rem' }}>File upload to _Inbox</span>
                      <span style={{ fontSize: '0.8rem', color: '#22c55e' }}>Instant</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.85rem' }}>Voice memo upload</span>
                        <span style={{ fontSize: '0.8rem', color: '#22c55e' }}>&lt;1 min</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.85rem' }}>Keep note sync</span>
                      <span style={{ fontSize: '0.8rem', color: '#22c55e' }}>Instant</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 style={{
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#06b6d4',
                    marginBottom: '1rem'
                  }}>
                    📅 Scheduled Tasks
                  </h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.85rem' }}>Inbox processing</span>
                      <span style={{ fontSize: '0.8rem', color: '#06b6d4' }}>Every 15 min</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.85rem' }}>Task sync</span>
                      <span style={{ fontSize: '0.8rem', color: '#06b6d4' }}>Every 30 min</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.85rem' }}>Voice processing</span>
                      <span style={{ fontSize: '0.8rem', color: '#06b6d4' }}>Hourly</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 style={{
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#8b5cf6',
                    marginBottom: '1rem'
                  }}>
                    📊 Batch Operations
                  </h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.85rem' }}>Full processing</span>
                      <span style={{ fontSize: '0.8rem', color: '#8b5cf6' }}>Daily 3 AM</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.85rem' }}>Weekly summary</span>
                      <span style={{ fontSize: '0.8rem', color: '#8b5cf6' }}>Sunday 8 AM</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.85rem' }}>Archive cleanup</span>
                      <span style={{ fontSize: '0.8rem', color: '#8b5cf6' }}>Monthly</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'deployment' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* Setup Instructions */}
            <div>
              <h4 style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                color: GOD_CONFIG.theme.text.primary,
                marginBottom: '1rem'
              }}>
                🚀 Quick Setup (15 minutes)
              </h4>

              <div style={{
                backgroundColor: GOD_CONFIG.theme.bg.primary,
                border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                borderRadius: '8px',
                padding: '1rem'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#22c55e', minWidth: '24px' }}>1.</span>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '500' }}>Open Apps Script</div>
                      <div style={{ fontSize: '0.8rem', color: GOD_CONFIG.theme.text.secondary }}>
                        script.google.com → New Project
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#22c55e', minWidth: '24px' }}>2.</span>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '500' }}>Paste Code</div>
                      <div style={{ fontSize: '0.8rem', color: GOD_CONFIG.theme.text.secondary }}>
                        Copy CognitiveHub.gs → Code.gs
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#22c55e', minWidth: '24px' }}>3.</span>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '500' }}>Setup Folders</div>
                      <div style={{ fontSize: '0.8rem', color: GOD_CONFIG.theme.text.secondary }}>
                        Run setupCognitiveHub()
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#22c55e', minWidth: '24px' }}>4.</span>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '500' }}>Enable Automation</div>
                      <div style={{ fontSize: '0.8rem', color: GOD_CONFIG.theme.text.secondary }}>
                        Run createAllTriggers()
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#22c55e', minWidth: '24px' }}>5.</span>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '500' }}>Add Gemini API</div>
                      <div style={{ fontSize: '0.8rem', color: GOD_CONFIG.theme.text.secondary }}>
                        makersuite.google.com → API Key
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Code Preview */}
            <div>
              <h4 style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                color: GOD_CONFIG.theme.text.primary,
                marginBottom: '1rem'
              }}>
                💻 Code Structure
              </h4>

              <div style={{
                backgroundColor: GOD_CONFIG.theme.bg.primary,
                border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                borderRadius: '8px',
                padding: '1rem',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                color: GOD_CONFIG.theme.text.primary
              }}>
                <div style={{ marginBottom: '0.5rem', color: '#22c55e' }}>
                  📁 CognitiveHub.gs
                </div>
                <div style={{ marginLeft: '1rem', marginBottom: '0.25rem' }}>
                  ├── setupCognitiveHub()
                </div>
                <div style={{ marginLeft: '1rem', marginBottom: '0.25rem' }}>
                  ├── processInbox()
                </div>
                <div style={{ marginLeft: '1rem', marginBottom: '0.25rem' }}>
                  ├── categorizeContent()
                </div>
                <div style={{ marginLeft: '1rem', marginBottom: '0.25rem' }}>
                  ├── detectPII()
                </div>
                <div style={{ marginLeft: '1rem', marginBottom: '0.25rem' }}>
                  ├── transcribeAudio()
                </div>
                <div style={{ marginLeft: '1rem', marginBottom: '0.25rem' }}>
                  └── generateWeeklySummary()
                </div>
                <div style={{ marginTop: '1rem', color: '#06b6d4' }}>
                  🔗 Integrates with:
                </div>
                <div style={{ marginLeft: '1rem', fontSize: '0.75rem' }}>
                  • Google Drive API<br/>
                  • Gemini AI API<br/>
                  • Google Tasks API<br/>
                  • Time-driven triggers
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '2rem',
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
          📊 Native Google Workspace Cognitive Processing
        </h4>
        <p style={{
          margin: '0 0 1rem 0',
          color: GOD_CONFIG.theme.text.secondary,
          fontSize: '0.9rem'
        }}>
          Your Google Drive becomes a cognitive extension. Automatic processing, AI analysis, and task management
          with zero external dependencies beyond Google's native APIs.
        </p>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <a
            href="https://script.google.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#4285f4',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Terminal size={14} />
            Open Apps Script
          </a>
          <a
            href="https://github.com/phenix-navigator/cognitive-hub-apps-script"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#24292e',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <ExternalLink size={14} />
            Source Code
          </a>
        </div>
      </div>
    </div>
  );
}