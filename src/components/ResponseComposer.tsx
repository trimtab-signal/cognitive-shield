/**
 * RESPONSE COMPOSER COMPONENT
 * Sanitized response generation with impedance matching
 */

import { useState, useEffect, useCallback } from 'react';
import { Send, Wand2, Loader2, Save, Bookmark, Settings, RotateCcw, History } from 'lucide-react';
import GOD_CONFIG, { type HumanOSType } from '../god.config';
import useShieldStore from '../store/shield.store';
import HumanOSBadge from './HumanOSBadge';

interface ResponseComposerProps {
  targetHumanOS?: HumanOSType;
  contextMessage?: string; // Original message to respond to
  voltage?: number; // Voltage level of incoming message
}

interface SavedDraft {
  id: string;
  title: string;
  content: string;
  targetOS: HumanOSType;
  tone: number;
  createdAt: number;
  contextMessage?: string;
}

export function ResponseComposer({ targetHumanOS, contextMessage, voltage }: ResponseComposerProps) {
  const [draft, setDraft] = useState('');
  const [sanitized, setSanitized] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedOS, setSelectedOS] = useState<HumanOSType>(targetHumanOS || 'empath');
  const [toneLevel, setToneLevel] = useState(5); // 1-10 scale
  const [savedDrafts, setSavedDrafts] = useState<SavedDraft[]>([]);
  const [showDrafts, setShowDrafts] = useState(false);
  const [draftTitle, setDraftTitle] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const { apiKey, provider, ollamaEndpoint, ollamaModel } = useShieldStore();

  // Load saved drafts on mount
  useEffect(() => {
    const stored = localStorage.getItem('response-composer-drafts');
    if (stored) {
      try {
        setSavedDrafts(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to load saved drafts:', error);
      }
    }
  }, []);

  // Save drafts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('response-composer-drafts', JSON.stringify(savedDrafts));
  }, [savedDrafts]);

  // Auto-populate context if provided
  useEffect(() => {
    if (contextMessage && !draft) {
      // Generate initial response suggestion based on context
      setDraft(`Regarding: "${contextMessage.substring(0, 100)}${contextMessage.length > 100 ? '...' : ''}"`);
    }
  }, [contextMessage, draft]);

  const handleSanitize = async () => {
    if (!draft.trim()) return;

    setIsProcessing(true);

    try {
      if (provider === 'ollama') {
        const result = await sanitizeWithOllama(draft, selectedOS, toneLevel, ollamaEndpoint, ollamaModel, contextMessage, voltage);
        setSanitized(result);
      } else if (apiKey) {
        const result = await sanitizeWithLLM(draft, selectedOS, toneLevel, apiKey, provider, contextMessage, voltage);
        setSanitized(result);
      } else {
        // Local fallback
        setSanitized(sanitizeLocally(draft, selectedOS, toneLevel));
      }
    } catch (error) {
      console.error('Sanitize error:', error);
      setSanitized(sanitizeLocally(draft, selectedOS, toneLevel));
    } finally {
      setIsProcessing(false);
    }
  };

  const saveDraft = useCallback(() => {
    if (!draft.trim()) return;

    const newDraft: SavedDraft = {
      id: `draft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: draftTitle || `Draft ${new Date().toLocaleDateString()}`,
      content: draft,
      targetOS: selectedOS,
      tone: toneLevel,
      createdAt: Date.now(),
      contextMessage
    };

    setSavedDrafts(prev => [newDraft, ...prev]);
    setDraftTitle('');
    alert('Draft saved successfully!');
  }, [draft, draftTitle, selectedOS, toneLevel, contextMessage]);

  const loadDraft = useCallback((savedDraft: SavedDraft) => {
    setDraft(savedDraft.content);
    setSelectedOS(savedDraft.targetOS);
    setToneLevel(savedDraft.tone);
    setDraftTitle(savedDraft.title);
    setShowDrafts(false);
  }, []);

  const deleteDraft = useCallback((draftId: string) => {
    setSavedDrafts(prev => prev.filter(d => d.id !== draftId));
  }, []);

  const clearAll = useCallback(() => {
    setDraft('');
    setSanitized('');
    setDraftTitle('');
    setToneLevel(5);
  }, []);

  const handleCopy = async () => {
    if (sanitized) {
      await navigator.clipboard.writeText(sanitized);
    }
  };

  const humanOSOptions = Object.entries(GOD_CONFIG.humanOS) as [HumanOSType, typeof GOD_CONFIG.humanOS[HumanOSType]][];

  return (
    <div 
      style={{
        backgroundColor: GOD_CONFIG.theme.bg.secondary,
        border: `1px solid ${GOD_CONFIG.theme.border.default}`,
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
      }}
    >
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 8,
        marginBottom: 16,
      }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            backgroundColor: GOD_CONFIG.theme.bg.accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Wand2 size={18} color={GOD_CONFIG.theme.text.accent} />
        </div>
        <div>
          <div style={{ 
            color: GOD_CONFIG.theme.text.primary,
            fontSize: 14,
            fontWeight: 600,
            fontFamily: GOD_CONFIG.typography.fontFamily.display,
          }}>
            RESPONSE SANITIZER
          </div>
          <div style={{ 
            color: GOD_CONFIG.theme.text.muted,
            fontSize: 11,
          }}>
            Match your response to their HumanOS
          </div>
        </div>
      </div>

      {/* Context Display */}
      {contextMessage && (
        <div style={{
          marginBottom: 16,
          padding: 12,
          backgroundColor: `${GOD_CONFIG.voltage.medium.color}10`,
          border: `1px solid ${GOD_CONFIG.voltage.medium.color}30`,
          borderRadius: 8,
        }}>
          <div style={{
            color: GOD_CONFIG.theme.text.secondary,
            fontSize: 10,
            marginBottom: 4,
            fontFamily: GOD_CONFIG.typography.fontFamily.display,
            textTransform: 'uppercase',
          }}>
            💬 CONTEXT MESSAGE
          </div>
          <div style={{
            color: GOD_CONFIG.theme.text.primary,
            fontSize: 12,
            lineHeight: 1.4,
            fontStyle: 'italic',
          }}>
            "{contextMessage.length > 150 ? `${contextMessage.substring(0, 150)}...` : contextMessage}"
          </div>
          {voltage && (
            <div style={{
              marginTop: 8,
              fontSize: 10,
              color: voltage > 5 ? GOD_CONFIG.voltage.high.color : GOD_CONFIG.voltage.low.color,
            }}>
              Voltage: {voltage}/10 • {voltage > 5 ? 'High Energy' : 'Low Energy'}
            </div>
          )}
        </div>
      )}

      {/* Target HumanOS Selection */}
      <div style={{ marginBottom: 16 }}>
        <div style={{
          color: GOD_CONFIG.theme.text.secondary,
          fontSize: 11,
          marginBottom: 8,
          fontFamily: GOD_CONFIG.typography.fontFamily.display,
        }}>
          TARGET RECEIVER OS
        </div>
        <div style={{
          display: 'flex',
          gap: 6,
          flexWrap: 'wrap',
        }}>
          {humanOSOptions.map(([key, os]) => (
            <button
              key={key}
              onClick={() => setSelectedOS(key)}
              style={{
                padding: '6px 12px',
                backgroundColor: selectedOS === key
                  ? `${os.color}20`
                  : GOD_CONFIG.theme.bg.tertiary,
                border: `1px solid ${selectedOS === key
                  ? os.color
                  : GOD_CONFIG.theme.border.default}`,
                borderRadius: 6,
                color: selectedOS === key
                  ? os.color
                  : GOD_CONFIG.theme.text.muted,
                fontSize: 11,
                fontFamily: GOD_CONFIG.typography.fontFamily.display,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                transition: 'all 0.2s ease',
              }}
            >
              <span>{os.icon}</span>
              <span>{os.name.replace('The ', '')}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Settings Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        style={{
          width: '100%',
          padding: '8px 12px',
          backgroundColor: GOD_CONFIG.theme.bg.tertiary,
          border: `1px solid ${GOD_CONFIG.theme.border.default}`,
          borderRadius: 6,
          color: GOD_CONFIG.theme.text.secondary,
          fontSize: 11,
          fontFamily: GOD_CONFIG.typography.fontFamily.display,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          marginBottom: 16,
        }}
      >
        <Settings size={14} />
        {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
      </button>

      {/* Advanced Settings */}
      {showAdvanced && (
        <div style={{
          marginBottom: 16,
          padding: 16,
          backgroundColor: GOD_CONFIG.theme.bg.tertiary,
          borderRadius: 8,
          border: `1px solid ${GOD_CONFIG.theme.border.default}`,
        }}>
          {/* Tone Control */}
          <div style={{ marginBottom: 16 }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
            }}>
              <div style={{
                color: GOD_CONFIG.theme.text.secondary,
                fontSize: 11,
                fontFamily: GOD_CONFIG.typography.fontFamily.display,
              }}>
                RESPONSE TONE LEVEL
              </div>
              <div style={{
                color: GOD_CONFIG.theme.text.primary,
                fontSize: 12,
                fontWeight: 600,
              }}>
                {toneLevel}/10 • {toneLevel <= 3 ? 'Soft' : toneLevel <= 7 ? 'Balanced' : 'Direct'}
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={toneLevel}
              onChange={(e) => setToneLevel(Number(e.target.value))}
              style={{
                width: '100%',
                height: 6,
                borderRadius: 3,
                background: `linear-gradient(to right, ${GOD_CONFIG.emotionalValence.calm.color}, ${GOD_CONFIG.voltage.medium.color}, ${GOD_CONFIG.voltage.high.color})`,
                outline: 'none',
                cursor: 'pointer',
              }}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 4,
            }}>
              <span style={{
                fontSize: 9,
                color: GOD_CONFIG.theme.text.muted,
              }}>
                Gentle
              </span>
              <span style={{
                fontSize: 9,
                color: GOD_CONFIG.theme.text.muted,
              }}>
                Direct
              </span>
            </div>
          </div>

          {/* Draft Title */}
          <div>
            <label style={{
              color: GOD_CONFIG.theme.text.secondary,
              fontSize: 11,
              fontFamily: GOD_CONFIG.typography.fontFamily.display,
              display: 'block',
              marginBottom: 6,
            }}>
              DRAFT TITLE (Optional)
            </label>
            <input
              type="text"
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              placeholder="Give this draft a name..."
              style={{
                width: '100%',
                padding: '8px 12px',
                backgroundColor: GOD_CONFIG.theme.bg.primary,
                border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                borderRadius: 6,
                color: GOD_CONFIG.theme.text.primary,
                fontSize: 12,
                fontFamily: GOD_CONFIG.typography.fontFamily.body,
                outline: 'none',
              }}
            />
          </div>
        </div>
      )}

      {/* Draft Management */}
      <div style={{
        display: 'flex',
        gap: 8,
        marginBottom: 16,
      }}>
        <button
          onClick={saveDraft}
          disabled={!draft.trim()}
          style={{
            flex: 1,
            padding: '8px 12px',
            backgroundColor: draft.trim() ? GOD_CONFIG.theme.bg.accent : GOD_CONFIG.theme.bg.tertiary,
            border: `1px solid ${GOD_CONFIG.theme.border.default}`,
            borderRadius: 6,
            color: draft.trim() ? GOD_CONFIG.theme.text.primary : GOD_CONFIG.theme.text.muted,
            fontSize: 11,
            fontFamily: GOD_CONFIG.typography.fontFamily.display,
            cursor: draft.trim() ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
          }}
        >
          <Save size={12} />
          Save Draft
        </button>

        <button
          onClick={() => setShowDrafts(!showDrafts)}
          style={{
            padding: '8px 12px',
            backgroundColor: GOD_CONFIG.theme.bg.tertiary,
            border: `1px solid ${GOD_CONFIG.theme.border.default}`,
            borderRadius: 6,
            color: GOD_CONFIG.theme.text.secondary,
            fontSize: 11,
            fontFamily: GOD_CONFIG.typography.fontFamily.display,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <History size={12} />
          {savedDrafts.length}
        </button>

        <button
          onClick={clearAll}
          style={{
            padding: '8px 12px',
            backgroundColor: GOD_CONFIG.theme.bg.tertiary,
            border: `1px solid ${GOD_CONFIG.theme.border.default}`,
            borderRadius: 6,
            color: GOD_CONFIG.theme.text.muted,
            fontSize: 11,
            fontFamily: GOD_CONFIG.typography.fontFamily.display,
            cursor: 'pointer',
          }}
        >
          <RotateCcw size={12} />
        </button>
      </div>

      {/* Saved Drafts */}
      {showDrafts && (
        <div style={{
          marginBottom: 16,
          padding: 16,
          backgroundColor: GOD_CONFIG.theme.bg.tertiary,
          borderRadius: 8,
          border: `1px solid ${GOD_CONFIG.theme.border.default}`,
          maxHeight: 200,
          overflowY: 'auto',
        }}>
          <div style={{
            color: GOD_CONFIG.theme.text.secondary,
            fontSize: 11,
            marginBottom: 12,
            fontFamily: GOD_CONFIG.typography.fontFamily.display,
          }}>
            SAVED DRAFTS ({savedDrafts.length})
          </div>

          {savedDrafts.length === 0 ? (
            <div style={{
              color: GOD_CONFIG.theme.text.muted,
              fontSize: 12,
              textAlign: 'center',
              padding: 20,
            }}>
              No saved drafts yet
            </div>
          ) : (
            savedDrafts.map((savedDraft) => (
              <div
                key={savedDraft.id}
                style={{
                  padding: 12,
                  backgroundColor: GOD_CONFIG.theme.bg.primary,
                  borderRadius: 6,
                  marginBottom: 8,
                  border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 8,
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      color: GOD_CONFIG.theme.text.primary,
                      fontSize: 12,
                      fontWeight: 600,
                      marginBottom: 2,
                    }}>
                      {savedDraft.title}
                    </div>
                    <div style={{
                      color: GOD_CONFIG.theme.text.muted,
                      fontSize: 10,
                    }}>
                      {new Date(savedDraft.createdAt).toLocaleDateString()} •
                      {GOD_CONFIG.humanOS[savedDraft.targetOS].name} •
                      Tone: {savedDraft.tone}/10
                    </div>
                  </div>
                  <button
                    onClick={() => deleteDraft(savedDraft.id)}
                    style={{
                      padding: 4,
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: GOD_CONFIG.theme.text.muted,
                      cursor: 'pointer',
                      borderRadius: 3,
                    }}
                  >
                    ×
                  </button>
                </div>

                <div style={{
                  color: GOD_CONFIG.theme.text.secondary,
                  fontSize: 11,
                  marginBottom: 8,
                  lineHeight: 1.4,
                }}>
                  {savedDraft.content.length > 100
                    ? `${savedDraft.content.substring(0, 100)}...`
                    : savedDraft.content
                  }
                </div>

                <button
                  onClick={() => loadDraft(savedDraft)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: GOD_CONFIG.theme.bg.accent,
                    border: 'none',
                    borderRadius: 4,
                    color: GOD_CONFIG.theme.text.primary,
                    fontSize: 10,
                    fontFamily: GOD_CONFIG.typography.fontFamily.display,
                    cursor: 'pointer',
                  }}
                >
                  Load Draft
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Draft Input */}
      <div style={{ marginBottom: 12 }}>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type your raw draft response here. Include all your feelings - we'll smooth out the edges..."
          rows={4}
          style={{
            width: '100%',
            padding: 14,
            backgroundColor: GOD_CONFIG.theme.bg.primary,
            border: `1px solid ${GOD_CONFIG.theme.border.default}`,
            borderRadius: 8,
            color: GOD_CONFIG.theme.text.primary,
            fontSize: 14,
            fontFamily: GOD_CONFIG.typography.fontFamily.body,
            resize: 'vertical',
            minHeight: 100,
            outline: 'none',
            lineHeight: 1.6,
          }}
        />
      </div>

      {/* Sanitize Button */}
      <button
        onClick={handleSanitize}
        disabled={!draft.trim() || isProcessing}
        style={{
          width: '100%',
          padding: '12px 20px',
          backgroundColor: draft.trim() && !isProcessing
            ? GOD_CONFIG.theme.bg.accent 
            : GOD_CONFIG.theme.bg.tertiary,
          border: `1px solid ${GOD_CONFIG.theme.border.accent}`,
          borderRadius: 8,
          color: draft.trim() && !isProcessing
            ? GOD_CONFIG.theme.text.primary 
            : GOD_CONFIG.theme.text.muted,
          fontSize: 13,
          fontWeight: 600,
          fontFamily: GOD_CONFIG.typography.fontFamily.display,
          cursor: draft.trim() && !isProcessing ? 'pointer' : 'not-allowed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          transition: 'all 0.2s ease',
          marginBottom: 16,
        }}
      >
        {isProcessing ? (
          <>
            <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
            Matching Impedance...
          </>
        ) : (
          <>
            <Wand2 size={16} />
            Sanitize for {GOD_CONFIG.humanOS[selectedOS].name}
          </>
        )}
      </button>

      {/* Sanitized Output */}
      {sanitized && (
        <div
          style={{
            backgroundColor: `${GOD_CONFIG.theme.text.accent}10`,
            border: `1px solid ${GOD_CONFIG.theme.text.accent}30`,
            borderRadius: 8,
            padding: 16,
          }}
        >
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
          }}>
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <span style={{ 
                color: GOD_CONFIG.theme.text.accent,
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontFamily: GOD_CONFIG.typography.fontFamily.display,
              }}>
                ✓ IMPEDANCE MATCHED
              </span>
              <HumanOSBadge osType={selectedOS} />
            </div>
          </div>

          <div style={{ 
            color: GOD_CONFIG.theme.text.primary,
            fontSize: 14,
            lineHeight: 1.6,
            marginBottom: 12,
            fontFamily: GOD_CONFIG.typography.fontFamily.body,
          }}>
            {sanitized}
          </div>

          <button
            onClick={handleCopy}
            style={{
              padding: '8px 16px',
              backgroundColor: GOD_CONFIG.theme.text.accent,
              border: 'none',
              borderRadius: 6,
              color: '#fff',
              fontSize: 12,
              fontWeight: 600,
              fontFamily: GOD_CONFIG.typography.fontFamily.display,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Send size={14} />
            Copy to Clipboard
          </button>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Ollama Sanitization (Local)
async function sanitizeWithOllama(
  draft: string,
  targetOS: HumanOSType,
  toneLevel: number,
  endpoint: string,
  model: string,
  contextMessage?: string,
  voltage?: number
): Promise<string> {
  const os = GOD_CONFIG.humanOS[targetOS];
  let prompt = GOD_CONFIG.prompts.sanitizeResponse
    .replace('{humanOS}', `${os.name} (${os.coreImperative})`)
    .replace('{draft}', draft);

  // Add tone control
  const toneDescriptions = {
    1: 'extremely gentle and soft',
    2: 'very gentle and considerate',
    3: 'gentle and understanding',
    4: 'mildly gentle',
    5: 'balanced and neutral',
    6: 'moderately direct',
    7: 'direct and clear',
    8: 'very direct and assertive',
    9: 'strongly assertive',
    10: 'extremely direct and forceful'
  };

  prompt += `\n\nTone Level: ${toneLevel}/10 - Make the response ${toneDescriptions[toneLevel as keyof typeof toneDescriptions]}.`;

  // Add context awareness
  if (contextMessage) {
    prompt += `\n\nOriginal message context: "${contextMessage}"`;
  }

  if (voltage) {
    prompt += `\n\nIncoming message voltage: ${voltage}/10 (${voltage > 5 ? 'high energy' : 'low energy'})`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), GOD_CONFIG.ollama.timeout);

  try {
    const response = await fetch(`${endpoint}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
        options: {
          temperature: 0.4,
          num_predict: 512,
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.status}`);
    }

    const data = await response.json();
    return data.response.trim();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// Cloud LLM Sanitization
async function sanitizeWithLLM(
  draft: string,
  targetOS: HumanOSType,
  toneLevel: number,
  apiKey: string,
  provider: string,
  contextMessage?: string,
  voltage?: number
): Promise<string> {
  const os = GOD_CONFIG.humanOS[targetOS];
  let prompt = GOD_CONFIG.prompts.sanitizeResponse
    .replace('{humanOS}', `${os.name} (${os.coreImperative})`)
    .replace('{draft}', draft);

  // Add tone control
  const toneDescriptions = {
    1: 'extremely gentle and soft',
    2: 'very gentle and considerate',
    3: 'gentle and understanding',
    4: 'mildly gentle',
    5: 'balanced and neutral',
    6: 'moderately direct',
    7: 'direct and clear',
    8: 'very direct and assertive',
    9: 'strongly assertive',
    10: 'extremely direct and forceful'
  };

  prompt += `\n\nTone Level: ${toneLevel}/10 - Make the response ${toneDescriptions[toneLevel as keyof typeof toneDescriptions]}.`;

  // Add context awareness
  if (contextMessage) {
    prompt += `\n\nOriginal message context: "${contextMessage}"`;
  }

  if (voltage) {
    prompt += `\n\nIncoming message voltage: ${voltage}/10 (${voltage > 5 ? 'high energy' : 'low energy'})`;
  }

  if (provider === 'openai') {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4,
      }),
    });
    const data = await response.json();
    return data.choices[0].message.content;
  }

  if (provider === 'anthropic') {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    const data = await response.json();
    return data.content[0].text;
  }

  if (provider === 'gemini') {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.4 },
        }),
      }
    );
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }

  throw new Error('Unknown provider');
}

// Local fallback sanitization
function sanitizeLocally(draft: string, targetOS: HumanOSType, toneLevel: number = 5): string {
  let sanitized = draft;

  // Apply tone-based transformations
  if (toneLevel <= 3) {
    // Very gentle tone
    sanitized = sanitized.replace(/!+/g, '.');
    sanitized = sanitized.replace(/\b(you|You)\b/g, 'you');
    sanitized = sanitized.replace(/\b(I|i)\b/g, 'I');
    sanitized = sanitized.replace(/\b(don't|Don't)\b/g, 'do not');
    sanitized = sanitized.replace(/\b(can't|Can't)\b/g, 'cannot');

    // Add softening words
    if (!sanitized.match(/\b(please|thank you|I appreciate|I understand)\b/i)) {
      sanitized = `I wanted to share this gently: ${sanitized}`;
    }
  } else if (toneLevel <= 7) {
    // Balanced tone
    sanitized = sanitized.replace(/!{2,}/g, '!');
    sanitized = sanitized.replace(/\?{2,}/g, '?');

    // Moderate softening
    sanitized = sanitized.replace(/\byou always\b/gi, 'you often');
    sanitized = sanitized.replace(/\byou never\b/gi, 'you rarely');
    sanitized = sanitized.replace(/\bI always\b/gi, 'I usually');
  } else {
    // Direct/assertive tone
    // Keep original intensity but clean up excessive markers
    sanitized = sanitized.replace(/!{3,}/g, '!!');
    sanitized = sanitized.replace(/\?{3,}/g, '??');

    // Remove some softening but keep core message
    sanitized = sanitized.replace(/\bmaybe\b/gi, '');
    sanitized = sanitized.replace(/\bperhaps\b/gi, '');
    sanitized = sanitized.replace(/\bkinda\b/gi, '');
    sanitized = sanitized.replace(/\bsorta\b/gi, '');
  }

  // Remove hostility markers (regardless of tone)
  sanitized = sanitized.replace(/\bobviously\b/gi, '');
  sanitized = sanitized.replace(/\bclearly\b/gi, '');
  sanitized = sanitized.replace(/\bduh\b/gi, '');
  sanitized = sanitized.replace(/\bidiot\b/gi, '');
  sanitized = sanitized.replace(/\bstupid\b/gi, '');

  // Add OS-specific framing
  if (targetOS === 'guardian') {
    sanitized = `I want to make sure we're on the same page about something important: ${sanitized}`;
  } else if (targetOS === 'order') {
    sanitized = `For clarity and to ensure we're aligned: ${sanitized}`;
  } else if (targetOS === 'achiever') {
    sanitized = `To help us move forward efficiently: ${sanitized}`;
  } else if (targetOS === 'empath') {
    sanitized = `I care about how we communicate, and I wanted to share: ${sanitized}`;
  } else if (targetOS === 'integrator') {
    sanitized = `Looking at the bigger picture here: ${sanitized}`;
  }

  return sanitized.trim();
}

export default ResponseComposer;

