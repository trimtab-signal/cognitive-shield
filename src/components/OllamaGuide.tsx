/**
 * OLLAMA GUIDE - Simple, Friendly Introduction
 * Helps users understand Ollama without technical fear
 */

import { useState } from 'react';
import { HelpCircle, Download, Terminal, MessageSquare, Zap, Shield, X, CheckCircle2 } from 'lucide-react';
import GOD_CONFIG from '../god.config';

interface OllamaGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OllamaGuide({ isOpen, onClose }: OllamaGuideProps) {
  const [activeSection, setActiveSection] = useState<'intro' | 'why' | 'how' | 'terms' | 'requirements'>('intro');

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(10, 10, 11, 0.95)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        overflowY: 'auto',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 700,
          maxHeight: '90vh',
          backgroundColor: GOD_CONFIG.theme.bg.secondary,
          borderRadius: 16,
          border: `1px solid ${GOD_CONFIG.theme.border.default}`,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            background: `linear-gradient(135deg, ${GOD_CONFIG.emotionalValence.calm.color}20 0%, ${GOD_CONFIG.theme.bg.secondary} 100%)`,
            borderBottom: `1px solid ${GOD_CONFIG.theme.border.default}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                backgroundColor: `${GOD_CONFIG.emotionalValence.calm.color}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <HelpCircle size={24} color={GOD_CONFIG.emotionalValence.calm.color} />
            </div>
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 20,
                  fontWeight: 700,
                  fontFamily: GOD_CONFIG.typography.fontFamily.display,
                  color: GOD_CONFIG.theme.text.primary,
                }}
              >
                What is Ollama?
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  color: GOD_CONFIG.emotionalValence.calm.color,
                  fontFamily: GOD_CONFIG.typography.fontFamily.display,
                }}
              >
                A friendly guide (no tech jargon, we promise)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: GOD_CONFIG.theme.text.muted,
              cursor: 'pointer',
              padding: 8,
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div
          style={{
            padding: '12px 24px',
            borderBottom: `1px solid ${GOD_CONFIG.theme.border.default}`,
            display: 'flex',
            gap: 8,
            overflowX: 'auto',
          }}
        >
          {[
            { id: 'intro' as const, label: 'Intro', icon: MessageSquare },
            { id: 'why' as const, label: 'Why Use It?', icon: Shield },
            { id: 'how' as const, label: 'How to Start', icon: Download },
            { id: 'terms' as const, label: 'Key Terms', icon: HelpCircle },
            { id: 'requirements' as const, label: 'Requirements', icon: Zap },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              style={{
                padding: '8px 14px',
                backgroundColor: activeSection === id 
                  ? GOD_CONFIG.theme.bg.accent 
                  : 'transparent',
                border: `1px solid ${activeSection === id 
                  ? GOD_CONFIG.theme.border.accent 
                  : GOD_CONFIG.theme.border.default}`,
                borderRadius: 6,
                color: activeSection === id 
                  ? GOD_CONFIG.theme.text.primary 
                  : GOD_CONFIG.theme.text.muted,
                fontSize: 12,
                fontFamily: GOD_CONFIG.typography.fontFamily.display,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                whiteSpace: 'nowrap',
              }}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 24,
          }}
        >
          {activeSection === 'intro' && (
            <div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  fontFamily: GOD_CONFIG.typography.fontFamily.display,
                  color: GOD_CONFIG.theme.text.primary,
                  marginBottom: 16,
                }}
              >
                Think of Ollama as the "App Store" for AI
              </div>
              <p
                style={{
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: GOD_CONFIG.theme.text.secondary,
                  marginBottom: 20,
                }}
              >
                Ollama is like the "App Store" or "User Interface" that lets you run powerful AI models 
                (like ChatGPT) directly on your own computer, rather than over the internet.
              </p>
              <div
                style={{
                  padding: 16,
                  backgroundColor: GOD_CONFIG.theme.bg.tertiary,
                  borderRadius: 8,
                  borderLeft: `3px solid ${GOD_CONFIG.emotionalValence.calm.color}`,
                  marginBottom: 20,
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: GOD_CONFIG.theme.text.primary,
                  }}
                >
                  <strong style={{ color: GOD_CONFIG.emotionalValence.calm.color }}>
                    Normally:
                  </strong>{' '}
                  When you use AI, your data is sent to a big company's server.
                </p>
                <p
                  style={{
                    margin: '12px 0 0',
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: GOD_CONFIG.theme.text.primary,
                  }}
                >
                  <strong style={{ color: GOD_CONFIG.voltage.low.color }}>
                    With Ollama:
                  </strong>{' '}
                  Everything stays on your machine. It's private, free, and works offline.
                </p>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: 12,
                  backgroundColor: `${GOD_CONFIG.voltage.low.color}15`,
                  borderRadius: 8,
                  marginTop: 20,
                }}
              >
                <CheckCircle2 size={16} color={GOD_CONFIG.voltage.low.color} />
                <span
                  style={{
                    fontSize: 13,
                    color: GOD_CONFIG.theme.text.primary,
                  }}
                >
                  <strong>No subscription fees.</strong> No data collection. No internet required after setup.
                </span>
              </div>
            </div>
          )}

          {activeSection === 'why' && (
            <div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  fontFamily: GOD_CONFIG.typography.fontFamily.display,
                  color: GOD_CONFIG.theme.text.primary,
                  marginBottom: 20,
                }}
              >
                Why do people use it?
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  {
                    icon: '🔒',
                    title: 'Privacy',
                    description: 'Your conversations never leave your computer. No one can see them.',
                    color: GOD_CONFIG.voltage.low.color,
                  },
                  {
                    icon: '💰',
                    title: 'Cost',
                    description: 'Completely free to use. No monthly subscription, no usage limits.',
                    color: GOD_CONFIG.voltage.low.color,
                  },
                  {
                    icon: '🎨',
                    title: 'Customization',
                    description: 'Download different AI "personalities" for coding, writing, or analysis.',
                    color: GOD_CONFIG.voltage.medium.color,
                  },
                  {
                    icon: '⚡',
                    title: 'Speed',
                    description: 'Responds quickly without needing Wi-Fi (if you have a decent computer).',
                    color: GOD_CONFIG.voltage.medium.color,
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    style={{
                      padding: 16,
                      backgroundColor: GOD_CONFIG.theme.bg.tertiary,
                      borderRadius: 8,
                      border: `1px solid ${item.color}30`,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                      <span style={{ fontSize: 24 }}>{item.icon}</span>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 600,
                          color: item.color,
                          fontFamily: GOD_CONFIG.typography.fontFamily.display,
                        }}
                      >
                        {item.title}
                      </div>
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 14,
                        lineHeight: 1.6,
                        color: GOD_CONFIG.theme.text.secondary,
                      }}
                    >
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'how' && (
            <div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  fontFamily: GOD_CONFIG.typography.fontFamily.display,
                  color: GOD_CONFIG.theme.text.primary,
                  marginBottom: 20,
                }}
              >
                How to Get Started
              </div>
              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: GOD_CONFIG.theme.text.secondary,
                  marginBottom: 24,
                }}
              >
                Getting Ollama running is surprisingly easy—it's no longer just for "tech geniuses."
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {[
                  {
                    step: 1,
                    title: 'Download',
                    icon: Download,
                    description: 'Go to ollama.com and download the app for Mac, Windows, or Linux.',
                    action: 'Just like installing any other program.',
                  },
                  {
                    step: 2,
                    title: 'Install',
                    icon: CheckCircle2,
                    description: 'Run the installer like any other program.',
                    action: 'Double-click and follow the prompts.',
                  },
                  {
                    step: 3,
                    title: 'The "Black Box" (Terminal)',
                    icon: Terminal,
                    description: 'This is the only "scary" part, but it\'s actually simple.',
                    action: (
                      <div style={{ marginTop: 8 }}>
                        <p style={{ margin: '0 0 8px', fontSize: 13, color: GOD_CONFIG.theme.text.muted }}>
                          Open your computer's <strong>Terminal</strong> (Mac/Linux) or <strong>Command Prompt</strong> (Windows) and type:
                        </p>
                        <code
                          style={{
                            display: 'block',
                            padding: '12px 16px',
                            backgroundColor: GOD_CONFIG.theme.bg.primary,
                            borderRadius: 6,
                            fontFamily: GOD_CONFIG.typography.fontFamily.display,
                            fontSize: 13,
                            color: GOD_CONFIG.voltage.low.color,
                            border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                          }}
                        >
                          ollama run llama3
                        </code>
                        <p style={{ margin: '8px 0 0', fontSize: 12, color: GOD_CONFIG.theme.text.muted }}>
                          Hit Enter. It will download the AI "brain" (this might take a few minutes).
                        </p>
                      </div>
                    ),
                  },
                  {
                    step: 4,
                    title: 'Chat',
                    icon: MessageSquare,
                    description: 'Once it downloads, you can start typing questions right there in that window.',
                    action: 'That\'s it! You\'re chatting with AI on your own computer.',
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    style={{
                      padding: 16,
                      backgroundColor: GOD_CONFIG.theme.bg.tertiary,
                      borderRadius: 8,
                      border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          backgroundColor: `${GOD_CONFIG.theme.text.accent}20`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <item.icon size={18} color={GOD_CONFIG.theme.text.accent} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: GOD_CONFIG.theme.text.accent,
                            fontFamily: GOD_CONFIG.typography.fontFamily.display,
                            marginBottom: 4,
                          }}
                        >
                          STEP {item.step}: {item.title}
                        </div>
                        <p
                          style={{
                            margin: '0 0 8px',
                            fontSize: 14,
                            lineHeight: 1.6,
                            color: GOD_CONFIG.theme.text.secondary,
                          }}
                        >
                          {item.description}
                        </p>
                        {typeof item.action === 'string' ? (
                          <p
                            style={{
                              margin: 0,
                              fontSize: 13,
                              fontStyle: 'italic',
                              color: GOD_CONFIG.theme.text.muted,
                            }}
                          >
                            {item.action}
                          </p>
                        ) : (
                          item.action
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: 24,
                  padding: 16,
                  backgroundColor: `${GOD_CONFIG.emotionalValence.calm.color}15`,
                  borderRadius: 8,
                  borderLeft: `3px solid ${GOD_CONFIG.emotionalValence.calm.color}`,
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: GOD_CONFIG.theme.text.primary,
                  }}
                >
                  <strong style={{ color: GOD_CONFIG.emotionalValence.calm.color }}>
                    Note:
                  </strong>{' '}
                  Ollama itself is a "command-line" tool (text on a black background). If you prefer a 
                  pretty interface that looks like ChatGPT, many people pair Ollama with a "frontend" 
                  like <strong>WebUI</strong> or <strong>AnythingLLM</strong>.
                </p>
              </div>
            </div>
          )}

          {activeSection === 'terms' && (
            <div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  fontFamily: GOD_CONFIG.typography.fontFamily.display,
                  color: GOD_CONFIG.theme.text.primary,
                  marginBottom: 20,
                }}
              >
                Key Terms You'll Hear
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  {
                    term: 'Local LLM',
                    meaning: 'An AI "Large Language Model" running on your hardware, not the cloud.',
                  },
                  {
                    term: 'Parameters',
                    meaning: 'The size of the AI\'s brain (e.g., 8B, 70B). Higher numbers are smarter but require a more powerful computer.',
                  },
                  {
                    term: 'GPU',
                    meaning: 'Your computer\'s graphics card. Ollama uses this to "think" faster.',
                  },
                  {
                    term: 'Model',
                    meaning: 'The specific "brain" you download (like Llama 3, Mistral, or Gemma).',
                  },
                ].map((item) => (
                  <div
                    key={item.term}
                    style={{
                      padding: 14,
                      backgroundColor: GOD_CONFIG.theme.bg.tertiary,
                      borderRadius: 8,
                      border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: GOD_CONFIG.theme.text.accent,
                        fontFamily: GOD_CONFIG.typography.fontFamily.display,
                        marginBottom: 6,
                      }}
                    >
                      {item.term}
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 13,
                        lineHeight: 1.6,
                        color: GOD_CONFIG.theme.text.secondary,
                      }}
                    >
                      {item.meaning}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'requirements' && (
            <div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  fontFamily: GOD_CONFIG.typography.fontFamily.display,
                  color: GOD_CONFIG.theme.text.primary,
                  marginBottom: 20,
                }}
              >
                Do you have the right "gear"?
              </div>
              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: GOD_CONFIG.theme.text.secondary,
                  marginBottom: 24,
                }}
              >
                Because the AI is running on your hardware, your computer needs some muscle.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  {
                    level: 'Minimum',
                    ram: '8GB',
                    description: 'It will be slow, but it works.',
                    color: GOD_CONFIG.voltage.medium.color,
                    icon: '⚠️',
                  },
                  {
                    level: 'Sweet Spot',
                    ram: '16GB to 32GB',
                    description: 'Or an Apple M1/M2/M3 chip. This is where it really shines.',
                    color: GOD_CONFIG.voltage.low.color,
                    icon: '✅',
                  },
                  {
                    level: 'Pro',
                    ram: 'Dedicated GPU',
                    description: 'An NVIDIA graphics card with lots of VRAM. Lightning fast.',
                    color: GOD_CONFIG.voltage.low.color,
                    icon: '🚀',
                  },
                ].map((item) => (
                  <div
                    key={item.level}
                    style={{
                      padding: 16,
                      backgroundColor: GOD_CONFIG.theme.bg.tertiary,
                      borderRadius: 8,
                      border: `2px solid ${item.color}40`,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                      <span style={{ fontSize: 24 }}>{item.icon}</span>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 600,
                          color: item.color,
                          fontFamily: GOD_CONFIG.typography.fontFamily.display,
                        }}
                      >
                        The "{item.level}"
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: GOD_CONFIG.theme.text.secondary,
                        marginBottom: 4,
                      }}
                    >
                      <strong>{item.ram}</strong> of RAM
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 13,
                        lineHeight: 1.6,
                        color: GOD_CONFIG.theme.text.muted,
                      }}
                    >
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: 24,
                  padding: 16,
                  backgroundColor: `${GOD_CONFIG.emotionalValence.calm.color}15`,
                  borderRadius: 8,
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: GOD_CONFIG.theme.text.primary,
                  }}
                >
                  <strong style={{ color: GOD_CONFIG.emotionalValence.calm.color }}>
                    Not sure?
                  </strong>{' '}
                  Try it anyway! Ollama will tell you if your computer can handle it. Most modern 
                  computers (2018+) can run at least the smaller models.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: `1px solid ${GOD_CONFIG.theme.border.default}`,
            backgroundColor: GOD_CONFIG.theme.bg.tertiary,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <a
            href="https://ollama.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '10px 16px',
              backgroundColor: GOD_CONFIG.voltage.low.color,
              borderRadius: 6,
              color: '#fff',
              fontSize: 13,
              fontWeight: 600,
              fontFamily: GOD_CONFIG.typography.fontFamily.display,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Download size={14} />
            Download Ollama
          </a>
          <button
            onClick={onClose}
            style={{
              padding: '10px 16px',
              backgroundColor: GOD_CONFIG.theme.bg.accent,
              border: `1px solid ${GOD_CONFIG.theme.border.default}`,
              borderRadius: 6,
              color: GOD_CONFIG.theme.text.secondary,
              fontSize: 13,
              fontFamily: GOD_CONFIG.typography.fontFamily.display,
              cursor: 'pointer',
            }}
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
}

export default OllamaGuide;

