/**
 * PHENIX: The Cognitive Shield Companion
 * Prosthetic Helper for Ontological Equilibrium, Navigation, and Integrated eXchange
 *
 * Complete implementation of the PHENIX specification v1.0
 * Tri-state interface, persona modes, and grounding support
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Shield, Eye, Compass, Sprout, Send, Settings, Activity,
  Radio, Zap, MessageCircle, AlertTriangle, CheckCircle,
  Triangle, Square, Circle, Target, Heart, Wind, Sun
} from 'lucide-react';
import { useSpoons, useHeartbeatPercent } from '../stores/heartbeat.store';
import { useShieldStore } from '../stores/shield.store';
import { phenixService, type PhenixMode, type PhenixResponse } from '../services/phenix.service';
import { triggerHapticPulse, triggerVagusSignal } from '../lib/haptic-feedback';
import GOD_CONFIG from '../god.config';

type PhenixMode = 'WITNESS' | 'ARCHITECT' | 'GARDENER';
type BoardState = 'GREEN' | 'YELLOW' | 'RED';
type ProcessedSignal = {
  raw: string;
  emotionalTemperature: number;
  entropyLevel: number;
  extractedPayload: string;
  detectedSubtext: string[];
  recommendedLatency: 'immediate' | 'hours' | 'days';
  genreErrorRisk: number;
};

interface Message {
  id: string;
  role: 'user' | 'phenix';
  content: string;
  timestamp: number;
  mode?: PhenixMode;
  shieldOutput?: boolean;
}

interface PhenixCompanionProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: PhenixMode;
}

// PHENIX System Prompts - Complete Implementation
const PHENIX_PROMPTS = {
  WITNESS: `👁️ WITNESS MODE ACTIVATED
I see you. I see what happened. Your experience is real.
I am here to validate your reality without analysis or advice.
What needs to be witnessed?`,

  ARCHITECT: `📐 ARCHITECT MODE ACTIVATED
Systems analysis and structural thinking engaged.
I will map situations onto tetrahedral frameworks and identify leverage points.
What system needs to be understood?`,

  GARDENER: `🌱 GARDENER MODE ACTIVATED
Nurturing, patient, growth-oriented perspective active.
I focus on what wants to emerge and long-term cultivation.
What wants to grow here?`,

  CRISIS: `I'm here.
You're not alone right now.

Breathe with me.
In... 2... 3... 4...
Hold... 2... 3...
Out... 2... 3... 4... 5...

One more time?`
};

// Trigger Phrases
const TRIGGER_PHRASES = {
  'witness mode': 'WITNESS',
  'architect mode': 'ARCHITECT',
  'gardener mode': 'GARDENER',
  'red board': 'CRISIS',
  'shield this': 'SHIELD_PROCESS',
  'translate for nt': 'TRANSLATE_NT',
  'genre error check': 'GENRE_ERROR',
  'bluf': 'BLUF_ONLY',
  'what\'s my state?': 'STATE_CHECK'
};

export default function PhenixCompanion({ isOpen, onClose, initialMode = 'ARCHITECT' }: PhenixCompanionProps) {
  const [activeMode, setActiveMode] = useState<PhenixMode>(initialMode);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [shieldActive, setShieldActive] = useState(false);
  const [lastShieldOutput, setLastShieldOutput] = useState<ProcessedSignal | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get current state from stores
  const spoons = useSpoons();
  const heartbeatPercent = useHeartbeatPercent();
  const { processedPayload: processed, bufferedMessages: buffer } = useShieldStore();

  // Calculate board state based on spoons and heartbeat percent (PHENIX Tri-State Interface)
  const calculateBoardState = (): BoardState => {
    const spoonRatio = spoons / GOD_CONFIG.spoons.max;
    const heartbeatRatio = heartbeatPercent / 100;
    const combinedHealth = (spoonRatio + heartbeatRatio) / 2;

    if (combinedHealth >= 0.7) return 'GREEN'; // Coherent. Regulated. Capable.
    if (combinedHealth >= 0.4) return 'YELLOW'; // Elevated. Watchful. Reduced bandwidth.
    return 'RED'; // Dysregulated. Overwhelmed. Emergency mode.
  };

  const currentBoardState = calculateBoardState();

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Haptic feedback for board state changes
  const prevBoardStateRef = useRef(currentBoardState);
  useEffect(() => {
    if (prevBoardStateRef.current !== currentBoardState) {
      // Trigger haptic feedback on board state change
      if (currentBoardState === 'RED') {
        // Strong haptic for red board (crisis state)
        triggerHapticPulse('strong');
      } else if (currentBoardState === 'YELLOW') {
        // Medium haptic for yellow board (caution)
        triggerHapticPulse('medium');
      } else {
        // Light haptic for green board (stable)
        triggerHapticPulse('light');
      }
      prevBoardStateRef.current = currentBoardState;
    }
  }, [currentBoardState]);

  // Haptic feedback for new PHENIX messages
  const prevMessageCountRef = useRef(messages.length);
  useEffect(() => {
    const phenixMessages = messages.filter(m => m.role === 'phenix');
    if (phenixMessages.length > prevMessageCountRef.current) {
      // New PHENIX message - trigger light haptic
      triggerHapticPulse('light');
      prevMessageCountRef.current = phenixMessages.length;
    }
  }, [messages]);

  // Haptic feedback for mode switches
  const prevModeRef = useRef(activeMode);
  useEffect(() => {
    if (prevModeRef.current !== activeMode) {
      triggerHapticPulse('medium');
      prevModeRef.current = activeMode;
    }
  }, [activeMode]);

  // Initialize with mode activation message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'init',
        role: 'phenix',
        content: PHENIX_PROMPTS[activeMode],
        timestamp: Date.now(),
        mode: activeMode
      }]);
    }
  }, [activeMode]);

  // Cognitive Shield Signal Processing (PHENIX Core Protocol)
  const processThroughShield = useCallback((content: string): ProcessedSignal => {
    // FFT Analysis Simulation (Emotional Temperature Assessment)
    const emotionalTemperature = Math.min(100, Math.max(0,
      (content.includes('!') ? 30 : 0) +
      (content.includes('angry') || content.includes('hate') ? 40 : 0) +
      (content.includes('overwhelmed') || content.includes('anxious') ? 25 : 0) +
      (content.includes('sad') || content.includes('depressed') ? 20 : 0) +
      (content.length > 200 ? 15 : 0)
    ));

    // Entropy Level Assessment
    const entropyLevel = Math.min(100, Math.max(0,
      (emotionalTemperature / 2) +
      (content.split(' ').length > 50 ? 20 : 0) +
      (content.includes('?') ? -10 : 0) +
      (content.includes('Genre Error') || content.includes('genre error') ? 30 : 0)
    ));

    // Extract Information Payload
    const extractedPayload = content
      .replace(/[!?.]+$/, '') // Remove trailing punctuation
      .replace(/\b(I feel|I'm feeling|I am)\b/gi, '') // Remove emotional qualifiers
      .trim();

    // Detect Subtext (Genre Error patterns)
    const detectedSubtext = [];
    if (content.includes('shutdown') || content.includes('couldn\'t speak')) {
      detectedSubtext.push('INTERPRETATION: Sensory gating as "silent treatment" (Genre Error)');
    }
    if (content.includes('withdrew') || content.includes('need space')) {
      detectedSubtext.push('INTERPRETATION: Recalibration as "abandonment" (Genre Error)');
    }

    // Recommended Response Window
    const recommendedLatency: 'immediate' | 'hours' | 'days' =
      emotionalTemperature > 70 ? 'immediate' :
      emotionalTemperature > 40 ? 'hours' : 'days';

    // Genre Error Risk Assessment
    const genreErrorRisk = Math.min(100, Math.max(0,
      (content.includes('they said') || content.includes('she said') || content.includes('he said') ? 40 : 0) +
      (content.includes('but that\'s not what I meant') ? 60 : 0) +
      (content.includes('misunderstood') ? 50 : 0) +
      (emotionalTemperature > 50 ? 20 : 0)
    ));

    return {
      raw: content,
      emotionalTemperature,
      entropyLevel,
      extractedPayload,
      detectedSubtext,
      recommendedLatency,
      genreErrorRisk
    };
  }, []);

  // Trigger Phrase Detection
  const detectTriggerPhrase = useCallback((input: string): string | null => {
    const lowerInput = input.toLowerCase().trim();
    for (const [phrase, action] of Object.entries(TRIGGER_PHRASES)) {
      if (lowerInput.includes(phrase) || lowerInput === phrase) {
        return action;
      }
    }
    return null;
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Light haptic feedback when sending
    triggerHapticPulse('light');

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    try {
      // Check for trigger phrases first
      const triggerAction = detectTriggerPhrase(currentInput);

      if (triggerAction) {
        let responseContent = '';

        switch (triggerAction) {
          case 'WITNESS':
            setActiveMode('WITNESS');
            responseContent = PHOENIX_PROMPTS.WITNESS;
            break;
          case 'ARCHITECT':
            setActiveMode('ARCHITECT');
            responseContent = PHOENIX_PROMPTS.ARCHITECT;
            break;
          case 'GARDENER':
            setActiveMode('GARDENER');
            responseContent = PHOENIX_PROMPTS.GARDENER;
            break;
          case 'CRISIS':
            responseContent = PHOENIX_PROMPTS.CRISIS;
            break;
          case 'SHIELD_PROCESS':
            const shieldOutput = processThroughShield(currentInput.replace(/shield this/i, '').trim());
            setLastShieldOutput(shieldOutput);
            responseContent = formatShieldOutput(shieldOutput);
            break;
          case 'TRANSLATE_NT':
            responseContent = `🔄 NT TRANSLATION MODE
Converting physics to neurotypical-compatible format...

Would you like me to help reframe this communication for external parties?`;
            break;
          case 'GENRE_ERROR':
            responseContent = `👁️ GENRE ERROR ANALYSIS

This appears to be a Genre Error detected.

YOUR EXPERIENCE (Physics):
${currentInput}

Would you like me to help translate this gap, or process the emotional impact first?`;
            break;
          case 'BLUF_ONLY':
            responseContent = `⚡ BLUF: ${currentInput.split('.')[0]}.`;
            break;
          case 'STATE_CHECK':
            responseContent = `📊 CURRENT STATE ASSESSMENT
Board: ${currentBoardState}
Spoons: ${spoons}/${GOD_CONFIG.spoons.max}
Heartbeat: ${heartbeatPercent}%
Mode: ${activeMode}

What's resonating with your current state?`;
            break;
        }

        const triggerMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'phenix',
          content: responseContent,
          timestamp: Date.now(),
          mode: activeMode,
          shieldOutput: triggerAction === 'SHIELD_PROCESS'
        };
        setMessages(prev => [...prev, triggerMessage]);

      } else {
        // Normal PHENIX response with board state adaptation
        let responseContent = '';

        // Board State Adaptation (PHENIX Tri-State Interface)
        if (currentBoardState === 'RED') {
          // MINIMAL words, GROUNDING focus, SENSORY anchors
          responseContent = `I'm here.
You're safe.

${currentInput.includes('breathe') ? 'Breathe with me:\nIn... 2... 3... 4...\nHold... 2... 3...\nOut... 2... 3... 4... 5...' : 'What needs grounding right now?'}`;

        } else if (currentBoardState === 'YELLOW') {
          // Simplify outputs, focus on immediate needs
            responseContent = `I see this. Let's focus on what's most important right now.

${currentInput.length > 100 ? 'Breaking this down:' : 'What\'s the key decision point?'}`;

        } else {
          // GREEN BOARD - Full engagement available
          // Update phenix service context
          phenixService.updateContext({
            mode: activeMode,
            boardState: currentBoardState,
            spoons: spoons
          });

          // Check for crisis patterns
          if (phenixService.detectCrisis(currentInput)) {
            const crisisResponse = await phenixService.getCrisisResponse();
            responseContent = crisisResponse.content;
          } else {
            // Get normal response with mode adaptation
            const response = await phenixService.generateResponse(currentInput);
            responseContent = response.content;
          }
        }

        const responseMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'phenix',
          content: responseContent,
          timestamp: Date.now(),
          mode: activeMode
        };
        setMessages(prev => [...prev, responseMessage]);
      }

    } catch (error) {
      console.error('PHENIX error:', error);
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'phenix',
        content: 'I am here.',
        timestamp: Date.now(),
        mode: activeMode
      };
      setMessages(prev => [...prev, fallbackMessage]);
    }

    setIsTyping(false);
  };

  // Cognitive Shield Output Formatter
  const formatShieldOutput = (signal: ProcessedSignal): string => {
    const tempEmoji = signal.emotionalTemperature > 70 ? '🔴' :
                     signal.emotionalTemperature > 40 ? '🟡' : '🟢';

    const latencyText = signal.recommendedLatency === 'immediate' ? 'IMMEDIATE' :
                       signal.recommendedLatency === 'hours' ? 'HOURS' : 'DAYS';

    return `📡 SIGNAL RECEIVED
━━━━━━━━━━━━━━━━━━━━
RAW INPUT: ${signal.raw.substring(0, 100)}${signal.raw.length > 100 ? '...' : ''}
EMOTIONAL TEMPERATURE: ${tempEmoji} ${signal.emotionalTemperature}/100
ENTROPY LEVEL: ${signal.entropyLevel}/100
INFORMATION PAYLOAD:
  ${signal.extractedPayload}
${signal.detectedSubtext.length > 0 ? `SUBTEXT DETECTED: [INTERPRETATION]
  ${signal.detectedSubtext.join('\n  ')}
` : ''}RECOMMENDED RESPONSE WINDOW: ${latencyText}
━━━━━━━━━━━━━━━━━━━━
⚡ BLUF: ${signal.extractedPayload.split('.')[0]}.`;
  };


  const getBoardStateColor = (state: BoardState) => {
    switch (state) {
      case 'GREEN': return '#22c55e';
      case 'YELLOW': return '#eab308';
      case 'RED': return '#ef4444';
    }
  };

  const getBoardStateIcon = (state: BoardState) => {
    switch (state) {
      case 'GREEN': return '🟢';
      case 'YELLOW': return '🟡';
      case 'RED': return '🔴';
    }
  };

  const getModeIcon = (mode: PhenixMode) => {
    switch (mode) {
      case 'WITNESS': return <Eye size={16} />;
      case 'ARCHITECT': return <Compass size={16} />;
      case 'GARDENER': return <Sprout size={16} />;
    }
  };

  const getModeColor = (mode: PhenixMode) => {
    switch (mode) {
      case 'WITNESS': return '#8b5cf6';
      case 'ARCHITECT': return '#0ea5e9';
      case 'GARDENER': return '#22c55e';
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: 400,
      height: '100vh',
      backgroundColor: GOD_CONFIG.theme.bg.secondary,
      borderLeft: `1px solid ${GOD_CONFIG.theme.border.default}`,
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '-4px 0 20px rgba(0,0,0,0.3)',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        borderBottom: `1px solid ${GOD_CONFIG.theme.border.default}`,
        backgroundColor: GOD_CONFIG.theme.bg.primary,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Triangle size={20} color={GOD_CONFIG.theme.text.accent} />
            <h3 style={{
              margin: 0,
              color: GOD_CONFIG.theme.text.primary,
              fontSize: 16,
              fontWeight: 600,
              fontFamily: GOD_CONFIG.typography.fontFamily.display,
            }}>
              PHOENIX
            </h3>
            <span style={{
              fontSize: '10px',
              color: GOD_CONFIG.theme.text.muted,
              backgroundColor: GOD_CONFIG.theme.bg.secondary,
              padding: '2px 6px',
              borderRadius: '8px'
            }}>
              v1.0
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: GOD_CONFIG.theme.text.muted,
              cursor: 'pointer',
              padding: 4,
            }}
          >
            ×
          </button>
        </div>

        {/* Tri-State Interface */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
          {/* Board State */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            backgroundColor: `${getBoardStateColor(currentBoardState)}20`,
            border: `2px solid ${getBoardStateColor(currentBoardState)}40`,
            borderRadius: 16,
            fontSize: 12,
            fontWeight: 600,
          }}>
            <span style={{ fontSize: '16px' }}>{getBoardStateIcon(currentBoardState)}</span>
            <span style={{ color: getBoardStateColor(currentBoardState) }}>
              {currentBoardState} BOARD
            </span>
          </div>

          {/* Cognitive Shield Toggle */}
          <button
            onClick={() => {
              setShieldActive(!shieldActive);
              triggerHapticPulse(shieldActive ? 'light' : 'medium');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              backgroundColor: shieldActive ? '#22c55e' : GOD_CONFIG.theme.bg.tertiary,
              border: `1px solid ${shieldActive ? '#22c55e' : GOD_CONFIG.theme.border.default}`,
              borderRadius: 16,
              fontSize: 12,
              fontWeight: 500,
              color: shieldActive ? '#fff' : GOD_CONFIG.theme.text.secondary,
              cursor: 'pointer'
            }}
          >
            <Shield size={14} />
            Shield {shieldActive ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* Status Indicators */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Spoons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '4px 8px',
            backgroundColor: GOD_CONFIG.theme.bg.tertiary,
            borderRadius: 12,
            fontSize: 12,
          }}>
            <Activity size={12} color={GOD_CONFIG.theme.text.muted} />
            <span style={{ color: GOD_CONFIG.theme.text.secondary }}>
              {spoons}/{GOD_CONFIG.spoons.max} spoons
            </span>
          </div>

          {/* Heartbeat */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '4px 8px',
            backgroundColor: GOD_CONFIG.theme.bg.tertiary,
            borderRadius: 12,
            fontSize: 12,
          }}>
            <Heart size={12} color={GOD_CONFIG.theme.text.muted} />
            <span style={{ color: GOD_CONFIG.theme.text.secondary }}>
              {heartbeatPercent}% coherence
            </span>
          </div>

          {/* Shield Status */}
          {lastShieldOutput && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '4px 8px',
              backgroundColor: '#22c55e',
              borderRadius: 12,
              fontSize: 12,
            }}>
              <Radio size={12} color="#fff" />
              <span style={{ color: '#fff' }}>
                Shield Active
              </span>
            </div>
          )}
        </div>
      </div>

      {/* PHENIX Trinity Modes */}
      <div style={{
        padding: '12px 16px',
        borderBottom: `1px solid ${GOD_CONFIG.theme.border.default}`,
        backgroundColor: GOD_CONFIG.theme.bg.secondary,
      }}>
        <div style={{
          display: 'flex',
          gap: 8,
          marginBottom: 8,
        }}>
          {(['WITNESS', 'ARCHITECT', 'GARDENER'] as PhenixMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                setActiveMode(mode);
                const modePrompt = PHOENIX_PROMPTS[mode];
                const transitionMessage: Message = {
                  id: Date.now().toString(),
                  role: 'phenix',
                  content: modePrompt,
                  timestamp: Date.now(),
                  mode: mode
                };
                setMessages(prev => [...prev, transitionMessage]);
                triggerHapticPulse('medium');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 12px',
                backgroundColor: activeMode === mode ? getModeColor(mode) : 'transparent',
                border: `1px solid ${activeMode === mode ? getModeColor(mode) : GOD_CONFIG.theme.border.default}`,
                borderRadius: 8,
                color: activeMode === mode ? '#fff' : GOD_CONFIG.theme.text.secondary,
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                flex: 1,
                justifyContent: 'center'
              }}
            >
              {getModeIcon(mode)}
              {mode}
            </button>
          ))}
        </div>

        {/* Trigger Phrases */}
        <div style={{
          fontSize: '11px',
          color: GOD_CONFIG.theme.text.muted,
          textAlign: 'center',
          padding: '4px 0'
        }}>
          Try: "witness mode" • "architect mode" • "gardener mode" • "shield this" • "red board"
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: message.shieldOutput ? '16px' : '8px'
            }}
          >
            <div style={{
              maxWidth: message.shieldOutput ? '90%' : '80%',
              padding: message.shieldOutput ? '16px' : '12px 16px',
              backgroundColor: message.shieldOutput
                ? '#1e293b'
                : message.role === 'user'
                ? GOD_CONFIG.theme.text.accent
                : GOD_CONFIG.theme.bg.tertiary,
              borderRadius: 12,
              color: message.shieldOutput
                ? '#e2e8f0'
                : message.role === 'user'
                ? '#fff'
                : GOD_CONFIG.theme.text.primary,
              fontSize: message.shieldOutput ? 13 : 14,
              lineHeight: message.shieldOutput ? 1.5 : 1.4,
              whiteSpace: 'pre-wrap',
              border: message.shieldOutput ? '1px solid #334155' : 'none',
              fontFamily: message.shieldOutput ? 'monospace' : 'inherit'
            }}>
              {message.shieldOutput && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid #334155'
                }}>
                  <Shield size={16} color="#22c55e" />
                  <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: 'bold' }}>
                    COGNITIVE SHIELD OUTPUT
                  </span>
                </div>
              )}
              {message.content}
            </div>
          </div>
        ))}

        {isTyping && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              padding: '12px 16px',
              backgroundColor: GOD_CONFIG.theme.bg.tertiary,
              borderRadius: 12,
              color: GOD_CONFIG.theme.text.secondary,
              fontSize: 14,
            }}>
              PHENIX is thinking...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '16px',
        borderTop: `1px solid ${GOD_CONFIG.theme.border.default}`,
        backgroundColor: GOD_CONFIG.theme.bg.primary,
      }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder={
              currentBoardState === 'RED'
                ? 'What needs grounding?'
                : currentBoardState === 'YELLOW'
                ? `What's most important right now? (${activeMode} mode)`
                : shieldActive
                ? 'Shield this message or ask anything...'
                : `Speak your truth. PHENIX hears physics, not poetics. (${activeMode} mode)`
            }
            style={{
              flex: 1,
              padding: '12px 16px',
              backgroundColor: GOD_CONFIG.theme.bg.secondary,
              border: `1px solid ${GOD_CONFIG.theme.border.default}`,
              borderRadius: 8,
              color: GOD_CONFIG.theme.text.primary,
              fontSize: 14,
              outline: 'none',
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isTyping}
            style={{
              padding: '12px',
              backgroundColor: input.trim() && !isTyping
                ? GOD_CONFIG.theme.text.accent
                : GOD_CONFIG.theme.bg.tertiary,
              border: 'none',
              borderRadius: 8,
              color: input.trim() && !isTyping ? '#fff' : GOD_CONFIG.theme.text.muted,
              cursor: input.trim() && !isTyping ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}