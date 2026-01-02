/**
 * MESSAGE INPUT COMPONENT
 * Air-gapped input for raw messages
 */

import { useState, useRef } from 'react';
import { Send, ShieldCheck, Clipboard } from 'lucide-react';
import GOD_CONFIG from '../god.config';
import useShieldStore from '../store/shield.store';

export function MessageInput() {
  const [message, setMessage] = useState('');
  const [source, setSource] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const ingestMessage = useShieldStore((s) => s.ingestMessage);

  const handleSubmit = () => {
    if (!message.trim()) return;
    ingestMessage(message.trim(), source.trim() || 'Manual Input');
    setMessage('');
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setMessage(text);
      textareaRef.current?.focus();
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div 
      className="message-input"
      style={{
        backgroundColor: GOD_CONFIG.theme.bg.secondary,
        border: `1px solid ${GOD_CONFIG.theme.border.default}`,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
      }}
    >
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 8,
        marginBottom: 12,
      }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: GOD_CONFIG.theme.gradient.shield,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ShieldCheck size={18} color="#fff" />
        </div>
        <div>
          <div style={{ 
            color: GOD_CONFIG.theme.text.primary,
            fontSize: 14,
            fontWeight: 600,
            fontFamily: GOD_CONFIG.typography.fontFamily.display,
          }}>
            AIR GAP INTAKE
          </div>
          <div style={{ 
            color: GOD_CONFIG.theme.text.muted,
            fontSize: 11,
          }}>
            Paste or type the message to be processed
          </div>
        </div>
      </div>

      {/* Source input */}
      <div style={{ marginBottom: 12 }}>
        <input
          type="text"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="Source (e.g., 'Partner', 'Boss', 'Friend')"
          style={{
            width: '100%',
            padding: '10px 14px',
            backgroundColor: GOD_CONFIG.theme.bg.tertiary,
            border: `1px solid ${GOD_CONFIG.theme.border.default}`,
            borderRadius: 6,
            color: GOD_CONFIG.theme.text.primary,
            fontSize: 13,
            fontFamily: GOD_CONFIG.typography.fontFamily.body,
            outline: 'none',
          }}
        />
      </div>

      {/* Message textarea */}
      <div style={{ position: 'relative', marginBottom: 12 }}>
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste the raw message here. DO NOT read it first - let the Shield process it for you..."
          rows={5}
          style={{
            width: '100%',
            padding: '14px',
            paddingRight: 50,
            backgroundColor: GOD_CONFIG.theme.bg.primary,
            border: `1px solid ${GOD_CONFIG.theme.border.default}`,
            borderRadius: 8,
            color: GOD_CONFIG.theme.text.primary,
            fontSize: 14,
            fontFamily: GOD_CONFIG.typography.fontFamily.body,
            resize: 'vertical',
            minHeight: 120,
            outline: 'none',
            lineHeight: 1.6,
          }}
        />
        
        {/* Paste button */}
        <button
          onClick={handlePaste}
          title="Paste from clipboard"
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            padding: 8,
            backgroundColor: GOD_CONFIG.theme.bg.tertiary,
            border: `1px solid ${GOD_CONFIG.theme.border.default}`,
            borderRadius: 6,
            color: GOD_CONFIG.theme.text.muted,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <Clipboard size={16} />
        </button>
      </div>

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={!message.trim()}
        style={{
          width: '100%',
          padding: '12px 20px',
          background: message.trim() 
            ? GOD_CONFIG.theme.gradient.shield 
            : GOD_CONFIG.theme.bg.tertiary,
          border: 'none',
          borderRadius: 8,
          color: message.trim() 
            ? '#fff' 
            : GOD_CONFIG.theme.text.muted,
          fontSize: 14,
          fontWeight: 600,
          fontFamily: GOD_CONFIG.typography.fontFamily.display,
          cursor: message.trim() ? 'pointer' : 'not-allowed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          transition: 'all 0.2s ease',
        }}
      >
        <Send size={16} />
        INGEST TO SHIELD
        <span style={{ 
          fontSize: 11, 
          opacity: 0.7,
          fontWeight: 400,
        }}>
          (Ctrl+Enter)
        </span>
      </button>

      {/* Tip */}
      <div style={{ 
        marginTop: 12,
        padding: 10,
        backgroundColor: GOD_CONFIG.theme.bg.tertiary,
        borderRadius: 6,
        color: GOD_CONFIG.theme.text.muted,
        fontSize: 11,
        lineHeight: 1.5,
      }}>
        💡 <strong>Pro Tip:</strong> Copy messages without reading them. 
        The Shield will process and summarize, letting you engage your 
        prefrontal cortex before your amygdala hijacks the response.
      </div>
    </div>
  );
}

export default MessageInput;

