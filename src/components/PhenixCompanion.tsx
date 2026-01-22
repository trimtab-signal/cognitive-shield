/**
 * PHENIX: The Cognitive Shield Companion
 * Prosthetic Helper for Ontological Equilibrium, Navigation, and Integrated eXchange
 *
 * Tri-state monitoring, persona modes, and grounding support
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Shield, Eye, Compass, Sprout, Send, MessageCircle } from 'lucide-react';
import { useHeartbeatStore } from '../stores/heartbeat.store';
import { useShieldStore } from '../stores/shield.store';
import GOD_CONFIG from '../god.config';

type PhenixMode = 'WITNESS' | 'ARCHITECT' | 'GARDENER';
type BoardState = 'GREEN' | 'YELLOW' | 'RED';

interface Message {
  id: string;
  role: 'user' | 'phenix';
  content: string;
  timestamp: number;
  mode?: PhenixMode;
}

interface PhenixCompanionProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: PhenixMode;
}

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
What wants to grow here?`
};

export default function PhenixCompanion({ isOpen, onClose, initialMode = 'ARCHITECT' }: PhenixCompanionProps) {
  const [activeMode, setActiveMode] = useState<PhenixMode>(initialMode);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initTimestampRef = useRef<number>();

  // Get current state from stores
  const { spoons } = useHeartbeatStore();
  const { processed } = useShieldStore();

  // Calculate board state based on spoons and processed messages
  const calculateBoardState = (): BoardState => {
    if (spoons >= GOD_CONFIG.spoons.thresholds.healthy) return 'GREEN';
    if (spoons >= GOD_CONFIG.spoons.thresholds.caution) return 'YELLOW';
    return 'RED';
  };

  const currentBoardState = calculateBoardState();

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize messages if empty
  React.useEffect(() => {
    if (messages.length === 0 && !initTimestampRef.current) {
      initTimestampRef.current = Date.now();
      setMessages([{
        id: 'init',
        role: 'phenix' as const,
        content: PHENIX_PROMPTS[activeMode],
        timestamp: initTimestampRef.current,
        mode: activeMode
      }]);
    }
  }, [messages.length, activeMode, setMessages]);

  const generatePhenixResponse = (userInput: string, mode: PhenixMode, boardState: BoardState): string => {
    // This would integrate with Ollama - for now, provide template responses
    switch (mode) {
      case 'WITNESS':
        return `👁️ I see this. Your experience of "${userInput}" is valid. I am here to witness it without interpretation or advice.`;

      case 'ARCHITECT':
        return `📐 I see the structure here. This appears to be a ${boardState.toLowerCase()} board situation. The tetrahedral framework suggests [system analysis]. What leverage point shall we examine?`;

      case 'GARDENER':
        return `🌱 I hear the seed of this moment. In the ${boardState.toLowerCase()} soil, this wants to grow into [growth potential]. What nourishment does this need?`;

      default:
        return 'I am here.';
    }
  };

  const sendMessage = useCallback(async () => {
    if (!input.trim()) return;

    const now = Date.now();
    const userMessage: Message = {
      id: now.toString(),
      role: 'user',
      content: input,
      timestamp: now
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response (replace with actual Ollama integration)
    setTimeout(() => {
      const phenixResponse = generatePhenixResponse(input, activeMode, currentBoardState);
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'phenix',
        content: phenixResponse,
        timestamp: Date.now(),
        mode: activeMode
      };

      setMessages(prev => [...prev, responseMessage]);
      setIsTyping(false);
    }, 1000);
  }, [input, activeMode, currentBoardState]);

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
            <Shield size={20} color={GOD_CONFIG.theme.text.accent} />
            <h3 style={{
              margin: 0,
              color: GOD_CONFIG.theme.text.primary,
              fontSize: 16,
              fontWeight: 600,
              fontFamily: GOD_CONFIG.typography.fontFamily.display,
            }}>
              PHENIX
            </h3>
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

        {/* Status Indicators */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Board State */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 8px',
            backgroundColor: `${getBoardStateColor(currentBoardState)}20`,
            border: `1px solid ${getBoardStateColor(currentBoardState)}40`,
            borderRadius: 12,
            fontSize: 12,
          }}>
            <span>{getBoardStateIcon(currentBoardState)}</span>
            <span style={{ color: getBoardStateColor(currentBoardState), fontWeight: 500 }}>
              {currentBoardState} BOARD
            </span>
          </div>

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
              {spoons} spoons
            </span>
          </div>

          {/* Messages */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '4px 8px',
            backgroundColor: GOD_CONFIG.theme.bg.tertiary,
            borderRadius: 12,
            fontSize: 12,
          }}>
            <MessageCircle size={12} color={GOD_CONFIG.theme.text.muted} />
            <span style={{ color: GOD_CONFIG.theme.text.secondary }}>
              {processed.length} processed
            </span>
          </div>
        </div>
      </div>

      {/* Mode Selector */}
      <div style={{
        padding: '12px 16px',
        borderBottom: `1px solid ${GOD_CONFIG.theme.border.default}`,
        display: 'flex',
        gap: 8,
      }}>
        {(['WITNESS', 'ARCHITECT', 'GARDENER'] as PhenixMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => setActiveMode(mode)}
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
            }}
          >
            {getModeIcon(mode)}
            {mode}
          </button>
        ))}
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
            }}
          >
            <div style={{
              maxWidth: '80%',
              padding: '12px 16px',
              backgroundColor: message.role === 'user'
                ? GOD_CONFIG.theme.text.accent
                : GOD_CONFIG.theme.bg.tertiary,
              borderRadius: 12,
              color: message.role === 'user'
                ? '#fff'
                : GOD_CONFIG.theme.text.primary,
              fontSize: 14,
              lineHeight: 1.4,
              whiteSpace: 'pre-wrap',
            }}>
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
            placeholder={`Speak to PHENIX in ${activeMode} mode...`}
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