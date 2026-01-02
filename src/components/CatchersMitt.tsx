/**
 * CATCHER'S MITT COMPONENT
 * 60-second batching buffer visualization
 */

import { useEffect, useState } from 'react';
import { Loader2, Inbox, Zap } from 'lucide-react';
import GOD_CONFIG from '../god.config';
import useShieldStore from '../store/shield.store';

export function CatchersMitt() {
  const { buffer, isBatching, batchTimeRemaining, processBatch } = useShieldStore();
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (buffer.length > 0) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 500);
      return () => clearTimeout(timer);
    }
  }, [buffer.length]);

  const secondsRemaining = Math.ceil(batchTimeRemaining / 1000);
  const progress = isBatching 
    ? ((60000 - batchTimeRemaining) / 60000) * 100 // 60-second Catcher's Mitt
    : 0;

  if (!isBatching && buffer.length === 0) {
    return null;
  }

  return (
    <div 
      className="catchers-mitt"
      style={{
        backgroundColor: GOD_CONFIG.theme.bg.secondary,
        border: `1px solid ${GOD_CONFIG.theme.border.default}`,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        animation: pulse ? 'pulse 0.5s ease-out' : undefined,
      }}
    >
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              backgroundColor: GOD_CONFIG.theme.bg.tertiary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Inbox size={18} color={GOD_CONFIG.theme.text.accent} />
          </div>
          <div>
            <div style={{ 
              color: GOD_CONFIG.theme.text.primary,
              fontSize: 13,
              fontWeight: 600,
              fontFamily: GOD_CONFIG.typography.fontFamily.display,
            }}>
              CATCHER'S MITT
            </div>
            <div style={{ 
              color: GOD_CONFIG.theme.text.muted,
              fontSize: 11,
            }}>
              Buffering incoming signals...
            </div>
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 8,
        }}>
          <div
            style={{
              padding: '4px 10px',
              backgroundColor: GOD_CONFIG.theme.bg.accent,
              borderRadius: 6,
              color: GOD_CONFIG.theme.text.primary,
              fontSize: 12,
              fontFamily: GOD_CONFIG.typography.fontFamily.display,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Zap size={12} />
            {buffer.length} message{buffer.length !== 1 ? 's' : ''}
          </div>

          {isBatching && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 10px',
                backgroundColor: GOD_CONFIG.theme.bg.tertiary,
                borderRadius: 6,
                color: GOD_CONFIG.theme.text.accent,
                fontSize: 12,
                fontFamily: GOD_CONFIG.typography.fontFamily.display,
              }}
            >
              <Loader2 
                size={12} 
                style={{ animation: 'spin 1s linear infinite' }} 
              />
              {secondsRemaining}s
            </div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: '100%',
          height: 4,
          backgroundColor: GOD_CONFIG.theme.bg.accent,
          borderRadius: 2,
          overflow: 'hidden',
          marginBottom: 12,
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            background: GOD_CONFIG.theme.gradient.shield,
            borderRadius: 2,
            transition: 'width 0.5s linear',
          }}
        />
      </div>

      {/* Manual process button */}
      <button
        onClick={() => processBatch()}
        style={{
          width: '100%',
          padding: '10px 16px',
          backgroundColor: GOD_CONFIG.theme.bg.tertiary,
          border: `1px solid ${GOD_CONFIG.theme.border.hover}`,
          borderRadius: 6,
          color: GOD_CONFIG.theme.text.secondary,
          fontSize: 12,
          fontFamily: GOD_CONFIG.typography.fontFamily.display,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = GOD_CONFIG.theme.bg.accent;
          e.currentTarget.style.color = GOD_CONFIG.theme.text.primary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = GOD_CONFIG.theme.bg.tertiary;
          e.currentTarget.style.color = GOD_CONFIG.theme.text.secondary;
        }}
      >
        🛡️ Process Now (Skip Timer)
      </button>
    </div>
  );
}

export default CatchersMitt;

