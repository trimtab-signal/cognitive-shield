/**
 * COGNITIVE HUB OSS - Open-Source Implementation
 * Full-stack Python cognitive architecture with web interface
 *
 * "The complete sovereign cognitive processing stack"
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  Code, Server, Database, Globe, Terminal, FileText,
  Play, Pause, RotateCcw, Settings, Download, ExternalLink,
  Cpu, MemoryStick, HardDrive, Network, Shield, Zap, Mic
} from 'lucide-react';
import GOD_CONFIG from '../god.config';

interface SystemStatus {
  voiceTranscription: boolean;
  llmProvider: string;
  database: boolean;
  webInterface: boolean;
  processingQueue: number;
  uptime: string;
}

interface HubMessage {
  id: string;
  timestamp: string;
  source: 'voice' | 'capture' | 'task' | 'auto';
  content: string;
  domain?: string;
  evidenceLevel?: string;
  processed: boolean;
}

export default function CognitiveHubOSS() {
  const [isRunning, setIsRunning] = useState(false);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    voiceTranscription: true,
    llmProvider: 'Ollama (Llama 2 7B)',
    database: true,
    webInterface: true,
    processingQueue: 0,
    uptime: '00:00:00'
  });

  const [messages, setMessages] = useState<HubMessage[]>([
    {
      id: '1',
      timestamp: new Date().toISOString(),
      source: 'capture',
      content: 'Meeting notes: Discussed quantum coherence implementation with ESP32-S3',
      domain: 'Technical',
      evidenceLevel: 'supported',
      processed: true
    },
    {
      id: '2',
      timestamp: new Date().toISOString(),
      source: 'voice',
      content: 'Voice memo: Hypothesis about time synchronization using firefly algorithms',
      domain: 'Research',
      evidenceLevel: 'speculative',
      processed: true
    },
    {
      id: '3',
      timestamp: new Date().toISOString(),
      source: 'task',
      content: 'TODO: Implement PII detection for document processing',
      domain: 'Technical',
      processed: false
    }
  ]);

  const [activeTab, setActiveTab] = useState<'overview' | 'processing' | 'deployment' | 'api'>('overview');
  const [captureText, setCaptureText] = useState('');
  const captureRef = useRef<HTMLTextAreaElement>(null);

  const handleQuickCapture = useCallback(() => {
    if (!captureText.trim()) return;

    const message: HubMessage = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      source: 'capture',
      content: captureText,
      processed: false
    };

    setMessages(prev => [message, ...prev]);
    setCaptureText('');

    // Simulate processing
    setTimeout(() => {
      setMessages(prev => prev.map(msg =>
        msg.id === message.id
          ? { ...msg, processed: true, domain: 'Personal', evidenceLevel: 'unverified' }
          : msg
      ));
    }, 2000);
  }, [captureText]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Server },
    { id: 'processing', label: 'Processing', icon: Brain },
    { id: 'deployment', label: 'Deployment', icon: Settings },
    { id: 'api', label: 'API', icon: Code }
  ];

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'voice': return <Mic size={14} />;
      case 'capture': return <FileText size={14} />;
      case 'task': return <Target size={14} />;
      case 'auto': return <Zap size={14} />;
      default: return <FileText size={14} />;
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'voice': return '#8b5cf6';
      case 'capture': return '#06b6d4';
      case 'task': return '#22c55e';
      case 'auto': return '#ec4899';
      default: return '#6b7280';
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
          🐍 Cognitive Hub OSS - Python Implementation
        </h2>
        <p style={{
          color: GOD_CONFIG.theme.text.secondary,
          fontSize: '1.1rem',
          lineHeight: '1.6'
        }}>
          Full-stack sovereign cognitive processing with Python backend, web interface, and local AI integration.
          <br />
          <span style={{ fontSize: '0.9rem', color: '#22c55e' }}>
            🔒 Privacy-first • 🤖 AI-powered • 🌐 Web interface • 📊 Database-backed
          </span>
        </p>
      </div>

      {/* System Status */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{
          fontSize: '1.1rem',
          fontWeight: '600',
          color: GOD_CONFIG.theme.text.primary,
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Server size={16} />
          System Status
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <div style={{
            padding: '1rem',
            backgroundColor: GOD_CONFIG.theme.bg.primary,
            borderRadius: '8px',
            border: `1px solid ${GOD_CONFIG.theme.border.default}`
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.5rem'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: systemStatus.voiceTranscription ? '#22c55e' : '#ef4444'
              }} />
              <span style={{ fontWeight: '500', fontSize: '0.9rem' }}>Voice Transcription</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: GOD_CONFIG.theme.text.secondary }}>
              OpenAI Whisper (local)
            </div>
          </div>

          <div style={{
            padding: '1rem',
            backgroundColor: GOD_CONFIG.theme.bg.primary,
            borderRadius: '8px',
            border: `1px solid ${GOD_CONFIG.theme.border.default}`
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.5rem'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: systemStatus.llmProvider ? '#22c55e' : '#ef4444'
              }} />
              <span style={{ fontWeight: '500', fontSize: '0.9rem' }}>LLM Provider</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: GOD_CONFIG.theme.text.secondary }}>
              {systemStatus.llmProvider}
            </div>
          </div>

          <div style={{
            padding: '1rem',
            backgroundColor: GOD_CONFIG.theme.bg.primary,
            borderRadius: '8px',
            border: `1px solid ${GOD_CONFIG.theme.border.default}`
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.5rem'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: systemStatus.database ? '#22c55e' : '#ef4444'
              }} />
              <span style={{ fontWeight: '500', fontSize: '0.9rem' }}>Database</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: GOD_CONFIG.theme.text.secondary }}>
              SQLite + Full-text Search
            </div>
          </div>

          <div style={{
            padding: '1rem',
            backgroundColor: GOD_CONFIG.theme.bg.primary,
            borderRadius: '8px',
            border: `1px solid ${GOD_CONFIG.theme.border.default}`
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.5rem'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: systemStatus.webInterface ? '#22c55e' : '#ef4444'
              }} />
              <span style={{ fontWeight: '500', fontSize: '0.9rem' }}>Web Interface</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: GOD_CONFIG.theme.text.secondary }}>
              Flask + React (Local)
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div style={{
          marginTop: '1rem',
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center'
        }}>
          <button
            onClick={() => setIsRunning(!isRunning)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: isRunning ? '#ef4444' : '#22c55e',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {isRunning ? <Pause size={14} /> : <Play size={14} />}
            {isRunning ? 'Stop' : 'Start'} Hub
          </button>

          <button
            onClick={() => setSystemStatus(prev => ({ ...prev, processingQueue: 0 }))}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: GOD_CONFIG.theme.bg.primary,
              color: GOD_CONFIG.theme.text.primary,
              border: `1px solid ${GOD_CONFIG.theme.border.default}`,
              borderRadius: '6px',
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            Clear Queue ({systemStatus.processingQueue})
          </button>
        </div>
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
            {/* Architecture Overview */}
            <div>
              <h4 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: GOD_CONFIG.theme.text.primary,
                marginBottom: '1rem'
              }}>
                🏗️ Architecture
              </h4>
              <div style={{
                backgroundColor: GOD_CONFIG.theme.bg.primary,
                border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                borderRadius: '8px',
                padding: '1rem'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Globe size={16} style={{ color: '#06b6d4' }} />
                    <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Web Interface (Flask)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Cpu size={16} style={{ color: '#8b5cf6' }} />
                    <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Cognitive Processing (Python)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Database size={16} style={{ color: '#22c55e' }} />
                    <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>SQLite Database</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Network size={16} style={{ color: '#ec4899' }} />
                    <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Voice Transcription (Whisper)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Shield size={16} style={{ color: '#fbbf24' }} />
                    <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>PII Detection & Redaction</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Capture */}
            <div>
              <h4 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: GOD_CONFIG.theme.text.primary,
                marginBottom: '1rem'
              }}>
                📝 Quick Capture
              </h4>
              <div style={{
                backgroundColor: GOD_CONFIG.theme.bg.primary,
                border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                borderRadius: '8px',
                padding: '1rem'
              }}>
                <textarea
                  ref={captureRef}
                  value={captureText}
                  onChange={(e) => setCaptureText(e.target.value)}
                  placeholder="Type or dictate your thoughts, tasks, or notes..."
                  style={{
                    width: '100%',
                    minHeight: '80px',
                    padding: '0.75rem',
                    backgroundColor: GOD_CONFIG.theme.bg.secondary,
                    border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                    borderRadius: '6px',
                    color: GOD_CONFIG.theme.text.primary,
                    fontSize: '0.9rem',
                    resize: 'vertical'
                  }}
                />
                <button
                  onClick={handleQuickCapture}
                  disabled={!captureText.trim()}
                  style={{
                    marginTop: '0.5rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: captureText.trim() ? GOD_CONFIG.theme.text.accent : GOD_CONFIG.theme.bg.tertiary,
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    cursor: captureText.trim() ? 'pointer' : 'not-allowed'
                  }}
                >
                  Capture
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'processing' && (
          <div>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: GOD_CONFIG.theme.text.primary,
              marginBottom: '1rem'
            }}>
              🧠 Processing Pipeline
            </h4>

            <div style={{
              backgroundColor: GOD_CONFIG.theme.bg.primary,
              border: `1px solid ${GOD_CONFIG.theme.border.default}`,
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <div style={{
                maxHeight: '400px',
                overflowY: 'auto'
              }}>
                {messages.map((message) => (
                  <div key={message.id} style={{
                    padding: '1rem',
                    borderBottom: `1px solid ${GOD_CONFIG.theme.border.default}`,
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'flex-start'
                  }}>
                    <div style={{
                      color: getSourceColor(message.source),
                      flexShrink: 0
                    }}>
                      {getSourceIcon(message.source)}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '0.9rem',
                        color: GOD_CONFIG.theme.text.primary,
                        marginBottom: '0.25rem'
                      }}>
                        {message.content}
                      </div>

                      <div style={{
                        display: 'flex',
                        gap: '0.5rem',
                        alignItems: 'center',
                        flexWrap: 'wrap'
                      }}>
                        <span style={{
                          fontSize: '0.75rem',
                          color: GOD_CONFIG.theme.text.muted
                        }}>
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>

                        {message.domain && (
                          <span style={{
                            fontSize: '0.75rem',
                            backgroundColor: '#06b6d4',
                            color: 'white',
                            padding: '0.125rem 0.5rem',
                            borderRadius: '10px'
                          }}>
                            {message.domain}
                          </span>
                        )}

                        {message.evidenceLevel && (
                          <span style={{
                            fontSize: '0.75rem',
                            backgroundColor: '#22c55e',
                            color: 'white',
                            padding: '0.125rem 0.5rem',
                            borderRadius: '10px'
                          }}>
                            {message.evidenceLevel}
                          </span>
                        )}

                        <span style={{
                          fontSize: '0.75rem',
                          color: message.processed ? '#22c55e' : '#f97316'
                        }}>
                          {message.processed ? '✓ Processed' : '⏳ Processing'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'deployment' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* Installation */}
            <div>
              <h4 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: GOD_CONFIG.theme.text.primary,
                marginBottom: '1rem'
              }}>
                🚀 Installation
              </h4>

              <div style={{
                backgroundColor: GOD_CONFIG.theme.bg.primary,
                border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                borderRadius: '8px',
                padding: '1rem'
              }}>
                <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: GOD_CONFIG.theme.text.primary }}>
                  <div style={{ marginBottom: '0.5rem' }}>git clone https://github.com/phenix-navigator/cognitive-hub-oss</div>
                  <div style={{ marginBottom: '0.5rem' }}>cd cognitive-hub-oss</div>
                  <div style={{ marginBottom: '0.5rem' }}>pip install -r requirements.txt</div>
                  <div style={{ marginBottom: '0.5rem' }}>python -m spacy download en_core_web_lg</div>
                  <div style={{ marginBottom: '0.5rem' }}>./scripts/install.sh</div>
                  <div>python -m cognitive_hub</div>
                </div>
              </div>
            </div>

            {/* System Requirements */}
            <div>
              <h4 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: GOD_CONFIG.theme.text.primary,
                marginBottom: '1rem'
              }}>
                💻 System Requirements
              </h4>

              <div style={{
                backgroundColor: GOD_CONFIG.theme.bg.primary,
                border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                borderRadius: '8px',
                padding: '1rem'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.9rem' }}>Python</span>
                    <span style={{ fontSize: '0.9rem', color: '#22c55e' }}>3.8+</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.9rem' }}>RAM</span>
                    <span style={{ fontSize: '0.9rem', color: '#22c55e' }}>4GB+</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.9rem' }}>Storage</span>
                    <span style={{ fontSize: '0.9rem', color: '#22c55e' }}>2GB</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.9rem' }}>OS</span>
                    <span style={{ fontSize: '0.9rem', color: '#22c55e' }}>Linux/Mac/Windows</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'api' && (
          <div>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: GOD_CONFIG.theme.text.primary,
              marginBottom: '1rem'
            }}>
              🔌 API Endpoints
            </h4>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1rem'
            }}>
              <div style={{
                backgroundColor: GOD_CONFIG.theme.bg.primary,
                border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                borderRadius: '8px',
                padding: '1rem'
              }}>
                <div style={{
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  color: '#22c55e',
                  marginBottom: '0.5rem'
                }}>
                  POST /api/capture
                </div>
                <div style={{
                  fontSize: '0.8rem',
                  color: GOD_CONFIG.theme.text.secondary,
                  marginBottom: '0.5rem'
                }}>
                  Capture new information
                </div>
                <div style={{
                  fontFamily: 'monospace',
                  fontSize: '0.7rem',
                  backgroundColor: GOD_CONFIG.theme.bg.secondary,
                  padding: '0.5rem',
                  borderRadius: '4px'
                }}>
                  {"{ \"text\": \"content\", \"category\": \"thought\" }"}
                </div>
              </div>

              <div style={{
                backgroundColor: GOD_CONFIG.theme.bg.primary,
                border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                borderRadius: '8px',
                padding: '1rem'
              }}>
                <div style={{
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  color: '#06b6d4',
                  marginBottom: '0.5rem'
                }}>
                  GET /api/status
                </div>
                <div style={{
                  fontSize: '0.8rem',
                  color: GOD_CONFIG.theme.text.secondary,
                  marginBottom: '0.5rem'
                }}>
                  Get system status
                </div>
                <div style={{
                  fontFamily: 'monospace',
                  fontSize: '0.7rem',
                  backgroundColor: GOD_CONFIG.theme.bg.secondary,
                  padding: '0.5rem',
                  borderRadius: '4px'
                }}>
                  {"{ \"processing\": true, \"queue\": 0 }"}
                </div>
              </div>

              <div style={{
                backgroundColor: GOD_CONFIG.theme.bg.primary,
                border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                borderRadius: '8px',
                padding: '1rem'
              }}>
                <div style={{
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  color: '#8b5cf6',
                  marginBottom: '0.5rem'
                }}>
                  POST /api/task
                </div>
                <div style={{
                  fontSize: '0.8rem',
                  color: GOD_CONFIG.theme.text.secondary,
                  marginBottom: '0.5rem'
                }}>
                  Create new task
                </div>
                <div style={{
                  fontFamily: 'monospace',
                  fontSize: '0.7rem',
                  backgroundColor: GOD_CONFIG.theme.bg.secondary,
                  padding: '0.5rem',
                  borderRadius: '4px'
                }}>
                  {"{ \"title\": \"task\", \"priority\": \"high\" }"}
                </div>
              </div>

              <div style={{
                backgroundColor: GOD_CONFIG.theme.bg.primary,
                border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                borderRadius: '8px',
                padding: '1rem'
              }}>
                <div style={{
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  color: '#ec4899',
                  marginBottom: '0.5rem'
                }}>
                  POST /api/process
                </div>
                <div style={{
                  fontSize: '0.8rem',
                  color: GOD_CONFIG.theme.text.secondary,
                  marginBottom: '0.5rem'
                }}>
                  Trigger processing
                </div>
                <div style={{
                  fontFamily: 'monospace',
                  fontSize: '0.7rem',
                  backgroundColor: GOD_CONFIG.theme.bg.secondary,
                  padding: '0.5rem',
                  borderRadius: '4px'
                }}>
                  {"{ \"force\": false }"}
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
          🐍 Open-Source Cognitive Hub
        </h4>
        <p style={{
          margin: '0 0 1rem 0',
          color: GOD_CONFIG.theme.text.secondary,
          fontSize: '0.9rem'
        }}>
          Complete sovereign cognitive processing stack with Python backend, web interface, and local AI.
          No external dependencies - runs entirely on your hardware.
        </p>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <a
            href="https://github.com/phenix-navigator/cognitive-hub-oss"
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
            GitHub Repository
          </a>
          <button
            onClick={() => window.open('/docs/cognitive-hub-oss', '_blank')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: GOD_CONFIG.theme.text.accent,
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Download size={14} />
            Installation Guide
          </button>
        </div>
      </div>
    </div>
  );
}