/**
 * PROCESSED PAYLOAD CARD
 * Displays a processed message with progressive disclosure
 * Enhanced with Spoons costing and Plutchik emotional valence
 */

import { useState, useMemo, useEffect } from 'react';
import { Eye, EyeOff, X, AlertTriangle, MessageCircle, Battery, Heart, Clock } from 'lucide-react';
import type { ProcessedPayload } from '../types/shield.types';
import GOD_CONFIG from '../god.config';
import VoltageGauge from './VoltageGauge';
import HumanOSBadge from './HumanOSBadge';
import { triggerHapticPulse } from '../lib/haptic-feedback';

interface ProcessedPayloadCardProps {
  payload: ProcessedPayload;
  rawContent?: string;
  onDismiss: () => void;
  onNeedSupport?: (payload: ProcessedPayload) => void;
}

export function ProcessedPayloadCard({ 
  payload, 
  rawContent,
  onDismiss,
  onNeedSupport,
}: ProcessedPayloadCardProps) {
  const [showRaw, setShowRaw] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [vacuumActive, setVacuumActive] = useState(false);
  const [vacuumCountdown, setVacuumCountdown] = useState(0);

  // Vacuum of Time countdown
  useEffect(() => {
    if (vacuumActive && vacuumCountdown > 0) {
      const timer = setInterval(() => {
        setVacuumCountdown((prev) => {
          if (prev <= 1) {
            setVacuumActive(false);
            setShowRaw(true);
            triggerHapticPulse('medium');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [vacuumActive, vacuumCountdown]);

  const timeAgo = getTimeAgo(payload.timestamp);

  // Calculate Spoons cost based on voltage and triggers
  const spoonsCost = useMemo(() => {
    let cost = 1; // Base cost
    if (payload.voltage > 0.66) cost += 2;
    else if (payload.voltage > 0.33) cost += 1;
    cost += Math.min(payload.triggers.length, 2); // Max +2 for triggers
    return Math.min(cost, 5); // Cap at 5
  }, [payload.voltage, payload.triggers]);

  // Determine emotional valence color based on voltage
  const getValenceColor = () => {
    if (payload.voltage <= 0.2) return GOD_CONFIG.emotionalValence.calm.color;
    if (payload.voltage <= 0.4) return GOD_CONFIG.emotionalValence.affection.color;
    if (payload.voltage <= 0.6) return GOD_CONFIG.emotionalValence.anxiety.color;
    return GOD_CONFIG.emotionalValence.hostility.color;
  };

  const valenceColor = getValenceColor();

  return (
    <div 
      className="payload-card"
      style={{
        backgroundColor: GOD_CONFIG.theme.bg.secondary,
        border: `1px solid ${GOD_CONFIG.theme.border.default}`,
        borderRadius: 12,
        padding: 20,
        position: 'relative',
        fontFamily: GOD_CONFIG.typography.fontFamily.body,
        borderTop: `3px solid ${valenceColor}`,
      }}
    >
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div 
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              background: GOD_CONFIG.theme.gradient.shield,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
            }}
          >
            🛡️
          </div>
          <div>
            <div style={{ 
              color: GOD_CONFIG.theme.text.primary,
              fontWeight: 600,
              fontSize: 14,
            }}>
              Shield Analysis
            </div>
            <div style={{ 
              color: GOD_CONFIG.theme.text.muted,
              fontSize: 11,
            }}>
              {timeAgo}
            </div>
          </div>
        </div>
        
        <button
          onClick={onDismiss}
          style={{
            background: 'none',
            border: 'none',
            color: GOD_CONFIG.theme.text.muted,
            cursor: 'pointer',
            padding: 4,
          }}
        >
          <X size={18} />
        </button>
      </div>

      {/* BLUF Summary */}
      <div 
        style={{
          backgroundColor: GOD_CONFIG.theme.bg.tertiary,
          borderRadius: 8,
          padding: 16,
          marginBottom: 16,
          borderLeft: `3px solid ${GOD_CONFIG.theme.text.accent}`,
        }}
      >
        <div style={{ 
          color: GOD_CONFIG.theme.text.muted,
          fontSize: 10,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: 6,
          fontFamily: GOD_CONFIG.typography.fontFamily.display,
        }}>
          BLUF (Bottom Line Up Front)
        </div>
        <div style={{ 
          color: GOD_CONFIG.theme.text.primary,
          fontSize: 15,
          lineHeight: 1.5,
        }}>
          {payload.bluf}
        </div>
      </div>

      {/* Voltage, HumanOS & Spoons Row */}
      <div style={{ 
        display: 'flex', 
        gap: 12, 
        marginBottom: 16,
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        <VoltageGauge voltage={payload.voltage} size="md" />
        <HumanOSBadge osType={payload.humanOS} />
        
        {/* Spoons Cost */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            backgroundColor: spoonsCost >= 4 
              ? `${GOD_CONFIG.voltage.high.color}15` 
              : GOD_CONFIG.theme.bg.tertiary,
            border: `1px solid ${spoonsCost >= 4 
              ? GOD_CONFIG.voltage.high.color 
              : GOD_CONFIG.theme.border.default}`,
            borderRadius: 8,
          }}
        >
          <Battery 
            size={14} 
            color={spoonsCost >= 4 
              ? GOD_CONFIG.voltage.high.color 
              : spoonsCost >= 2 
                ? GOD_CONFIG.voltage.medium.color 
                : GOD_CONFIG.voltage.low.color} 
          />
          <span 
            style={{
              fontSize: 11,
              fontFamily: GOD_CONFIG.typography.fontFamily.display,
              color: spoonsCost >= 4 
                ? GOD_CONFIG.voltage.high.color 
                : GOD_CONFIG.theme.text.secondary,
            }}
          >
            {spoonsCost} {spoonsCost === 1 ? 'Spoon' : 'Spoons'}
          </span>
        </div>
      </div>

      {/* Triggers */}
      {payload.triggers.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 6,
            color: GOD_CONFIG.voltage.high.color,
            fontSize: 11,
            marginBottom: 8,
            fontFamily: GOD_CONFIG.typography.fontFamily.display,
          }}>
            <AlertTriangle size={14} />
            <span>TRIGGERS DETECTED</span>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {payload.triggers.map((trigger, i) => (
              <span
                key={i}
                style={{
                  padding: '4px 10px',
                  backgroundColor: `${GOD_CONFIG.voltage.high.color}20`,
                  color: GOD_CONFIG.voltage.high.color,
                  borderRadius: 4,
                  fontSize: 11,
                  fontFamily: GOD_CONFIG.typography.fontFamily.display,
                }}
              >
                {trigger}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* The Why */}
      <div 
        style={{
          backgroundColor: GOD_CONFIG.theme.bg.accent,
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
        }}
      >
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 6,
          color: GOD_CONFIG.theme.text.secondary,
          fontSize: 11,
          marginBottom: 4,
          fontFamily: GOD_CONFIG.typography.fontFamily.display,
        }}>
          <MessageCircle size={12} />
          <span>THE WHY</span>
        </div>
        <div style={{ 
          color: GOD_CONFIG.theme.text.primary,
          fontSize: 13,
          fontStyle: 'italic',
        }}>
          {payload.why}
        </div>
      </div>

      {/* Progressive Disclosure Buttons */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          onClick={() => setShowTranslation(!showTranslation)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 14px',
            backgroundColor: showTranslation 
              ? GOD_CONFIG.theme.text.accent 
              : GOD_CONFIG.theme.bg.tertiary,
            color: showTranslation 
              ? GOD_CONFIG.theme.bg.primary 
              : GOD_CONFIG.theme.text.secondary,
            border: `1px solid ${GOD_CONFIG.theme.border.default}`,
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 12,
            fontFamily: GOD_CONFIG.typography.fontFamily.display,
            transition: 'all 0.2s ease',
          }}
        >
          {showTranslation ? <EyeOff size={14} /> : <Eye size={14} />}
          {showTranslation ? 'Hide' : 'View'} Translation
        </button>

        {rawContent && (
          <button
            onClick={() => {
              if (!showRaw && vacuumCountdown === 0) {
                // Start Vacuum of Time (3-second delay)
                setVacuumActive(true);
                setVacuumCountdown(3);
                triggerHapticPulse('light');
              } else if (vacuumCountdown === 0) {
                setShowRaw(!showRaw);
              }
            }}
            disabled={vacuumActive && vacuumCountdown > 0}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              backgroundColor: showRaw 
                ? GOD_CONFIG.voltage.high.color 
                : vacuumActive && vacuumCountdown > 0
                ? GOD_CONFIG.theme.bg.accent
                : GOD_CONFIG.theme.bg.tertiary,
              color: showRaw 
                ? '#fff' 
                : vacuumActive && vacuumCountdown > 0
                ? GOD_CONFIG.theme.text.accent
                : GOD_CONFIG.theme.text.muted,
              border: `1px solid ${showRaw ? GOD_CONFIG.voltage.high.color : GOD_CONFIG.theme.border.default}`,
              borderRadius: 6,
              cursor: vacuumActive && vacuumCountdown > 0 ? 'not-allowed' : 'pointer',
              fontSize: 12,
              fontFamily: GOD_CONFIG.typography.fontFamily.display,
              transition: 'all 0.2s ease',
              opacity: vacuumActive && vacuumCountdown > 0 ? 0.7 : 1,
            }}
          >
            {vacuumActive && vacuumCountdown > 0 ? (
              <>
                <Clock size={14} />
                Pulling Vacuum... {vacuumCountdown}s
              </>
            ) : (
              <>
                <AlertTriangle size={14} />
                {showRaw ? 'Hide' : 'Reveal'} Raw (⚠️ Unfiltered)
              </>
            )}
          </button>
        )}

        {/* Need Support Button - visible for high voltage messages */}
        {payload.voltage > 0.5 && onNeedSupport && (
          <button
            onClick={() => onNeedSupport?.(payload)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              backgroundColor: `${GOD_CONFIG.emotionalValence.calm.color}15`,
              color: GOD_CONFIG.emotionalValence.calm.color,
              border: `1px solid ${GOD_CONFIG.emotionalValence.calm.color}40`,
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 12,
              fontFamily: GOD_CONFIG.typography.fontFamily.display,
              transition: 'all 0.2s ease',
              marginLeft: 'auto',
            }}
          >
            <Heart size={14} />
            Need Support?
          </button>
        )}
      </div>

      {/* Translation Content */}
      {showTranslation && (
        <div 
          style={{
            marginTop: 16,
            padding: 16,
            backgroundColor: `${GOD_CONFIG.theme.text.accent}10`,
            border: `1px solid ${GOD_CONFIG.theme.text.accent}30`,
            borderRadius: 8,
          }}
        >
          <div style={{ 
            color: GOD_CONFIG.theme.text.accent,
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: 8,
            fontFamily: GOD_CONFIG.typography.fontFamily.display,
          }}>
            🔄 TRANSLATED (Voltage Removed)
          </div>
          <div style={{ 
            color: GOD_CONFIG.theme.text.primary,
            fontSize: 14,
            lineHeight: 1.6,
          }}>
            {payload.translation}
          </div>
        </div>
      )}

      {/* Raw Content (with warning) */}
      {showRaw && rawContent && (
        <div 
          style={{
            marginTop: 16,
            padding: 16,
            backgroundColor: `${GOD_CONFIG.voltage.high.color}10`,
            border: `1px solid ${GOD_CONFIG.voltage.high.color}40`,
            borderRadius: 8,
          }}
        >
          <div style={{ 
            color: GOD_CONFIG.voltage.high.color,
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: 8,
            fontFamily: GOD_CONFIG.typography.fontFamily.display,
          }}>
            ⚠️ RAW MESSAGE (Unprocessed)
          </div>
          <div style={{ 
            color: GOD_CONFIG.theme.text.secondary,
            fontSize: 14,
            lineHeight: 1.6,
            fontFamily: GOD_CONFIG.typography.fontFamily.display,
          }}>
            {rawContent}
          </div>
        </div>
      )}
    </div>
  );
}

function getTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default ProcessedPayloadCard;

