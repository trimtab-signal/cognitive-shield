/**
 * COGNITIVE HUB DEMO - Brain-Inspired Information Flow
 * Capture → Process → Store → Synthesize → Output
 *
 * "Your brain, but for information"
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Brain, MessageSquare, Database, Lightbulb, FileText, ArrowRight,
  Mic, Calendar, Target, CheckCircle2, Clock, Zap, Layers
} from 'lucide-react';
import GOD_CONFIG from '../god.config';

interface HubMessage {
  id: string;
  content: string;
  timestamp: Date;
  category: 'thought' | 'task' | 'note' | 'question';
  processed: boolean;
  domain?: string;
  evidenceLevel?: 'verified' | 'supported' | 'theoretical' | 'speculative';
}

const SAMPLE_INPUTS = [
  "I need to research quantum coherence in biological systems - peer-reviewed studies only",
  "Meeting notes: Discussed ESP32-S3 integration, need to implement LoRa mesh network",
  "TODO: Contact vendor about quantum hardware specs, email: vendor@tech.com phone: 555-0123",
  "Hypothesis: Time synchronization could be improved with firefly algorithms",
  "Clinical trial shows 35% improvement in cognitive function with quantum coherence therapy",
  "Legal note: Contract signed with EIN 12-3456789, requires NDA compliance"
];

export default function CognitiveHubDemo() {
  const [messages, setMessages] = useState<HubMessage[]>([]);
  const [currentStep, setCurrentStep] = useState<'capture' | 'process' | 'store' | 'synthesize' | 'output'>('capture');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const steps = [
    { id: 'capture', label: 'Capture', icon: MessageSquare, color: '#8b5cf6' },
    { id: 'process', label: 'Process', icon: Brain, color: '#06b6d4' },
    { id: 'store', label: 'Store', icon: Database, color: '#22c55e' },
    { id: 'synthesize', label: 'Synthesize', icon: Lightbulb, color: '#ec4899' },
    { id: 'output', label: 'Output', icon: FileText, color: '#fbbf24' }
  ];

  const addMessage = useCallback((content: string, category: HubMessage['category'] = 'thought') => {
    const message: HubMessage = {
      id: Date.now().toString(),
      content,
      timestamp: new Date(),
      category,
      processed: false
    };
    setMessages(prev => [...prev, message]);
    return message;
  }, []);

  const processMessage = useCallback(async (messageId: string) => {
    setIsProcessing(true);
    setProcessingProgress(0);

    // Simulate processing pipeline
    const steps = ['capture', 'process', 'store', 'synthesize', 'output'];
    const delays = [500, 1000, 800, 1200, 600];

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(steps[i] as any);
      setProcessingProgress((i + 1) / steps.length * 100);

      await new Promise(resolve => setTimeout(resolve, delays[i]));
    }

    // Update message with processing results
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        // Mock processing results
        let domain = 'Miscellaneous';
        let evidenceLevel: HubMessage['evidenceLevel'];

        if (msg.content.includes('quantum') || msg.content.includes('ESP32')) {
          domain = 'Technical';
        } else if (msg.content.includes('clinical') || msg.content.includes('trial')) {
          domain = 'Research';
          evidenceLevel = 'verified';
        } else if (msg.content.includes('meeting') || msg.content.includes('discuss')) {
          domain = 'Personal';
        } else if (msg.content.includes('contract') || msg.content.includes('legal')) {
          domain = 'Legal';
        }

        if (msg.content.includes('hypothesis') || msg.content.includes('could')) {
          evidenceLevel = 'speculative';
        } else if (msg.content.includes('study') || msg.content.includes('research')) {
          evidenceLevel = 'supported';
        }

        return {
          ...msg,
          processed: true,
          domain,
          evidenceLevel
        };
      }
      return msg;
    }));

    setIsProcessing(false);
    setProcessingProgress(0);
    setCurrentStep('capture');
  }, []);

  const handleQuickInput = useCallback((input: string) => {
    const category: HubMessage['category'] =
      input.includes('TODO') ? 'task' :
      input.includes('meeting') || input.includes('notes') ? 'note' :
      input.includes('?') ? 'question' : 'thought';

    addMessage(input, category);
  }, [addMessage]);

  const handleCustomInput = useCallback(() => {
    const content = inputRef.current?.value?.trim();
    if (content) {
      const category: HubMessage['category'] =
        content.includes('TODO') || content.includes('need to') ? 'task' :
        content.includes('meeting') || content.includes('notes') ? 'note' :
        content.includes('?') ? 'question' : 'thought';

      addMessage(content, category);
      if (inputRef.current) inputRef.current.value = '';
    }
  }, [addMessage]);

  const getStepColor = (stepId: string) => {
    return steps.find(s => s.id === stepId)?.color || '#6b7280';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'task': return <Target size={16} />;
      case 'note': return <FileText size={16} />;
      case 'question': return <Lightbulb size={16} />;
      default: return <MessageSquare size={16} />;
    }
  };

  const getEvidenceColor = (level?: string) => {
    const colors: Record<string, string> = {
      verified: '#C6EFCE',
      supported: '#FFEB9C',
      theoretical: '#B4C6E7',
      speculative: '#F4CCCC'
    };
    return colors[level || ''] || 'transparent';
  };

  const getDomainColor = (domain?: string) => {
    const colors: Record<string, string> = {
      Technical: '#06b6d4',
      Research: '#22c55e',
      Personal: '#8b5cf6',
      Legal: '#ef4444',
      Miscellaneous: '#6b7280'
    };
    return colors[domain || 'Miscellaneous'];
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
          fontSize: '1.5rem',
          fontWeight: 'bold',
          background: GOD_CONFIG.theme.gradient.shield,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '0.5rem'
        }}>
          🧠 Cognitive Hub - Brain-Inspired Information Flow
        </h2>
        <p style={{
          color: GOD_CONFIG.theme.text.secondary,
          lineHeight: '1.6'
        }}>
          Capture thoughts like your brain: Sensory input → Working memory → Pattern matching →
          Long-term storage → Association → Action. But for information.
        </p>
      </div>

      {/* Processing Pipeline Visualization */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{
          fontSize: '1.1rem',
          fontWeight: '600',
          color: GOD_CONFIG.theme.text.primary,
          marginBottom: '1rem'
        }}>
          🌀 Information Processing Pipeline
        </h3>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem'
        }}>
          {steps.map((step, index) => {
            const isActive = currentStep === step.id;
            const isCompleted = steps.findIndex(s => s.id === currentStep) > index;

            return (
              <React.Fragment key={step.id}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '1rem',
                  borderRadius: '8px',
                  backgroundColor: isActive ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                  border: `2px solid ${isActive ? step.color : isCompleted ? '#22c55e' : GOD_CONFIG.theme.border.default}`,
                  transition: 'all 0.3s ease'
                }}>
                  <step.icon
                    size={24}
                    style={{
                      color: isActive ? step.color : isCompleted ? '#22c55e' : GOD_CONFIG.theme.text.muted
                    }}
                  />
                  <span style={{
                    fontSize: '0.8rem',
                    fontWeight: '500',
                    color: isActive ? step.color : GOD_CONFIG.theme.text.primary,
                    textAlign: 'center'
                  }}>
                    {step.label}
                  </span>
                  {isProcessing && isActive && (
                    <div style={{
                      width: '40px',
                      height: '3px',
                      backgroundColor: GOD_CONFIG.theme.bg.primary,
                      borderRadius: '2px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: step.color,
                        animation: 'pulse 1s ease-in-out infinite'
                      }} />
                    </div>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight
                    size={16}
                    style={{
                      color: GOD_CONFIG.theme.text.muted,
                      flexShrink: 0
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Progress Bar */}
        {isProcessing && (
          <div style={{
            width: '100%',
            height: '6px',
            backgroundColor: GOD_CONFIG.theme.bg.primary,
            borderRadius: '3px',
            overflow: 'hidden',
            marginTop: '1rem'
          }}>
            <div style={{
              width: `${processingProgress}%`,
              height: '100%',
              background: GOD_CONFIG.theme.gradient.shield,
              borderRadius: '3px',
              transition: 'width 0.3s ease'
            }} />
          </div>
        )}
      </div>

      {/* Input Section */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{
          fontSize: '1.1rem',
          fontWeight: '600',
          color: GOD_CONFIG.theme.text.primary,
          marginBottom: '1rem'
        }}>
          📝 Quick Capture (Like Your Brain's Sensory Input)
        </h3>

        {/* Quick Input Buttons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '0.5rem',
          marginBottom: '1rem'
        }}>
          {SAMPLE_INPUTS.map((input, index) => (
            <button
              key={index}
              onClick={() => handleQuickInput(input)}
              disabled={isProcessing}
              style={{
                padding: '0.75rem',
                backgroundColor: GOD_CONFIG.theme.bg.primary,
                border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                borderRadius: '6px',
                color: GOD_CONFIG.theme.text.primary,
                fontSize: '0.8rem',
                textAlign: 'left',
                cursor: isProcessing ? 'not-allowed' : 'pointer',
                opacity: isProcessing ? 0.6 : 1,
                transition: 'all 0.2s ease',
                lineHeight: '1.4'
              }}
              onMouseEnter={(e) => {
                if (!isProcessing) {
                  e.currentTarget.style.borderColor = GOD_CONFIG.theme.text.accent;
                  e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isProcessing) {
                  e.currentTarget.style.borderColor = GOD_CONFIG.theme.border.default;
                  e.currentTarget.style.backgroundColor = GOD_CONFIG.theme.bg.primary;
                }
              }}
            >
              {input.length > 80 ? input.substring(0, 80) + '...' : input}
            </button>
          ))}
        </div>

        {/* Custom Input */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'flex-end'
        }}>
          <div style={{ flex: 1 }}>
            <textarea
              ref={inputRef}
              placeholder="Or type your own thought/task/note/question..."
              style={{
                width: '100%',
                minHeight: '80px',
                padding: '0.75rem',
                backgroundColor: GOD_CONFIG.theme.bg.primary,
                border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                borderRadius: '6px',
                color: GOD_CONFIG.theme.text.primary,
                fontSize: '0.9rem',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
              disabled={isProcessing}
            />
          </div>
          <button
            onClick={handleCustomInput}
            disabled={isProcessing}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: isProcessing ? GOD_CONFIG.theme.bg.tertiary : GOD_CONFIG.theme.text.accent,
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Zap size={16} />
            Capture
          </button>
        </div>
      </div>

      {/* Messages Display */}
      {messages.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: '600',
            color: GOD_CONFIG.theme.text.primary,
            marginBottom: '1rem'
          }}>
            💭 Thought Stream
          </h3>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            maxHeight: '400px',
            overflowY: 'auto'
          }}>
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  padding: '1rem',
                  backgroundColor: GOD_CONFIG.theme.bg.primary,
                  borderRadius: '8px',
                  border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                  position: 'relative'
                }}
              >
                {/* Message Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem'
                }}>
                  {getCategoryIcon(message.category)}
                  <span style={{
                    fontSize: '0.8rem',
                    fontWeight: '500',
                    color: GOD_CONFIG.theme.text.primary,
                    textTransform: 'uppercase'
                  }}>
                    {message.category}
                  </span>
                  <span style={{
                    fontSize: '0.75rem',
                    color: GOD_CONFIG.theme.text.muted
                  }}>
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                  {!message.processed && (
                    <button
                      onClick={() => processMessage(message.id)}
                      disabled={isProcessing}
                      style={{
                        marginLeft: 'auto',
                        padding: '0.25rem 0.5rem',
                        backgroundColor: isProcessing ? GOD_CONFIG.theme.bg.tertiary : '#22c55e',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        cursor: isProcessing ? 'not-allowed' : 'pointer'
                      }}
                    >
                      Process
                    </button>
                  )}
                </div>

                {/* Message Content */}
                <p style={{
                  margin: '0 0 0.5rem 0',
                  color: GOD_CONFIG.theme.text.primary,
                  lineHeight: '1.5'
                }}>
                  {message.content}
                </p>

                {/* Processing Results */}
                {message.processed && (
                  <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    flexWrap: 'wrap',
                    marginTop: '0.5rem'
                  }}>
                    {message.domain && (
                      <span style={{
                        fontSize: '0.75rem',
                        backgroundColor: getDomainColor(message.domain),
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '3px',
                        fontWeight: '500'
                      }}>
                        📁 {message.domain}
                      </span>
                    )}
                    {message.evidenceLevel && (
                      <span style={{
                        fontSize: '0.75rem',
                        backgroundColor: getEvidenceColor(message.evidenceLevel),
                        color: GOD_CONFIG.theme.text.primary,
                        padding: '0.25rem 0.5rem',
                        borderRadius: '3px',
                        fontWeight: '500'
                      }}>
                        🔬 {message.evidenceLevel}
                      </span>
                    )}
                  </div>
                )}

                {/* Processing Animation */}
                {isProcessing && currentStep !== 'capture' && (
                  <div style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    width: '20px',
                    height: '20px',
                    border: `2px solid ${getStepColor(currentStep)}`,
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Architecture Explanation */}
      <div style={{
        backgroundColor: GOD_CONFIG.theme.bg.primary,
        border: `1px solid ${GOD_CONFIG.theme.border.default}`,
        borderRadius: '8px',
        padding: '1.5rem'
      }}>
        <h4 style={{
          margin: '0 0 1rem 0',
          fontSize: '1rem',
          fontWeight: '600',
          color: GOD_CONFIG.theme.text.primary
        }}>
          🧠 How It Works (Brain-Inspired)
        </h4>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.5rem'
            }}>
              <MessageSquare size={16} style={{ color: '#8b5cf6' }} />
              <span style={{
                fontWeight: '600',
                color: GOD_CONFIG.theme.text.primary,
                fontSize: '0.9rem'
              }}>
                Capture Layer
              </span>
            </div>
            <p style={{
              fontSize: '0.8rem',
              color: GOD_CONFIG.theme.text.secondary,
              margin: 0,
              lineHeight: '1.4'
            }}>
              Like sensory input - frictionless capture from any source
            </p>
          </div>

          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.5rem'
            }}>
              <Brain size={16} style={{ color: '#06b6d4' }} />
              <span style={{
                fontWeight: '600',
                color: GOD_CONFIG.theme.text.primary,
                fontSize: '0.9rem'
              }}>
                Processing Layer
              </span>
            </div>
            <p style={{
              fontSize: '0.8rem',
              color: GOD_CONFIG.theme.text.secondary,
              margin: 0,
              lineHeight: '1.4'
            }}>
              Pattern matching with AI - categorizes and understands
            </p>
          </div>

          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.5rem'
            }}>
              <Database size={16} style={{ color: '#22c55e' }} />
              <span style={{
                fontWeight: '600',
                color: GOD_CONFIG.theme.text.primary,
                fontSize: '0.9rem'
              }}>
                Storage Layer
              </span>
            </div>
            <p style={{
              fontSize: '0.8rem',
              color: GOD_CONFIG.theme.text.secondary,
              margin: 0,
              lineHeight: '1.4'
            }}>
              Domain-organized knowledge base with evidence levels
            </p>
          </div>

          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.5rem'
            }}>
              <Lightbulb size={16} style={{ color: '#ec4899' }} />
              <span style={{
                fontWeight: '600',
                color: GOD_CONFIG.theme.text.primary,
                fontSize: '0.9rem'
              }}>
                Synthesis Layer
              </span>
            </div>
            <p style={{
              fontSize: '0.8rem',
              color: GOD_CONFIG.theme.text.secondary,
              margin: 0,
              lineHeight: '1.4'
            }}>
              Cross-domain connections and insights
            </p>
          </div>

          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.5rem'
            }}>
              <FileText size={16} style={{ color: '#fbbf24' }} />
              <span style={{
                fontWeight: '600',
                color: GOD_CONFIG.theme.text.primary,
                fontSize: '0.9rem'
              }}>
                Output Layer
              </span>
            </div>
            <p style={{
              fontSize: '0.8rem',
              color: GOD_CONFIG.theme.text.secondary,
              margin: 0,
              lineHeight: '1.4'
            }}>
              Actionable results and generated content
            </p>
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}