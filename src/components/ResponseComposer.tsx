/**
 * RESPONSE COMPOSER COMPONENT
 * Sanitized response generation with impedance matching
 */

import { useState } from 'react';
import { Send, Wand2, Loader2 } from 'lucide-react';
import GOD_CONFIG, { type HumanOSType } from '../god.config';
import useShieldStore from '../store/shield.store';
import HumanOSBadge from './HumanOSBadge';

interface ResponseComposerProps {
  targetHumanOS?: HumanOSType;
}

export function ResponseComposer({ targetHumanOS }: ResponseComposerProps) {
  const [draft, setDraft] = useState('');
  const [sanitized, setSanitized] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedOS, setSelectedOS] = useState<HumanOSType>(targetHumanOS || 'empath');
  const { apiKey, provider, ollamaEndpoint, ollamaModel } = useShieldStore();

  const handleSanitize = async () => {
    if (!draft.trim()) return;
    
    setIsProcessing(true);
    
    try {
      if (provider === 'ollama') {
        const result = await sanitizeWithOllama(draft, selectedOS, ollamaEndpoint, ollamaModel);
        setSanitized(result);
      } else if (apiKey) {
        const result = await sanitizeWithLLM(draft, selectedOS, apiKey, provider);
        setSanitized(result);
      } else {
        // Local fallback
        setSanitized(sanitizeLocally(draft, selectedOS));
      }
    } catch (error) {
      console.error('Sanitize error:', error);
      setSanitized(sanitizeLocally(draft, selectedOS));
    } finally {
      setIsProcessing(false);
    }
  };

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
  endpoint: string,
  model: string
): Promise<string> {
  const os = GOD_CONFIG.humanOS[targetOS];
  const prompt = GOD_CONFIG.prompts.sanitizeResponse
    .replace('{humanOS}', `${os.name} (${os.coreImperative})`)
    .replace('{draft}', draft);

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
  apiKey: string,
  provider: string
): Promise<string> {
  const os = GOD_CONFIG.humanOS[targetOS];
  const prompt = GOD_CONFIG.prompts.sanitizeResponse
    .replace('{humanOS}', `${os.name} (${os.coreImperative})`)
    .replace('{draft}', draft);

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
function sanitizeLocally(draft: string, targetOS: HumanOSType): string {
  let sanitized = draft;

  // Remove excessive punctuation
  sanitized = sanitized.replace(/!{2,}/g, '.');
  sanitized = sanitized.replace(/\?{2,}/g, '?');
  
  // Soften absolutes
  sanitized = sanitized.replace(/\byou always\b/gi, 'sometimes you');
  sanitized = sanitized.replace(/\byou never\b/gi, 'sometimes you don\'t');
  sanitized = sanitized.replace(/\bI always\b/gi, 'I often');
  
  // Remove hostility markers
  sanitized = sanitized.replace(/\bobviously\b/gi, '');
  sanitized = sanitized.replace(/\bclearly\b/gi, '');
  
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

