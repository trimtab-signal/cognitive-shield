/**
 * @license
 * Copyright 2026 Wonky Sprout DUNA
 *
 * Licensed under the AGPLv3 License, Version 3.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.gnu.org/licenses/agpl-3.0.html
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Message Display Component
 * Safe presentation of processed messages
 * 
 * Features:
 * - Shows safe summary first (no raw text)
 * - Progressive disclosure for raw content
 * - HumanOS badge
 * - Spoon cost indicator
 * - Action items and facts extraction
 */

import { useState, useCallback } from 'react';
import type { MessageDisplayProps, ProcessedMessage } from '../../types';
import { VoltageIndicator, VoltageBadge, VoltageBreakdown } from '../ui/VoltageIndicator';
import { HumanOSProfiles, DomainConfig } from '../../config/god.config';
import { useHeartbeatStore } from '../../stores/heartbeat.store';

// ═══════════════════════════════════════════════════════════════════════════════
// DOMAIN BADGE
// ═══════════════════════════════════════════════════════════════════════════════

function DomainBadge({ domain }: { domain: ProcessedMessage['domain'] }) {
  if (!domain || domain === 'unknown') return null;
  const config = DomainConfig[domain];
  
  // Colors mapped from ARCHITECTURE.md (approximate)
  const colorMap: Record<string, string> = {
    phenix: '#7B68EE', // Medium Slate Blue
    fisher: '#4CAF50', // Green
    legal: '#F44336',  // Red
    personal: '#2196F3', // Blue
    technical: '#FF9800', // Orange
  };

  const color = colorMap[domain] || '#6B7280';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '11px',
        fontWeight: 500,
        background: `${color}20`,
        color: color,
        border: `1px solid ${color}40`,
        marginLeft: '4px'
      }}
      title={`Domain: ${config.name}`}
    >
      📁 {config.name}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// HUMANOS BADGE
// ═══════════════════════════════════════════════════════════════════════════════

function HumanOSBadge({ os }: { os: ProcessedMessage['senderOS'] }) {
  const profile = HumanOSProfiles[os];
  
  const colorMap: Record<string, string> = {
    guardian: '#DC2626',  // Red
    order: '#2563EB',     // Blue
    achiever: '#EA580C',  // Orange
    empath: '#16A34A',    // Green
    integrator: '#CA8A04', // Yellow
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '11px',
        fontWeight: 500,
        background: `${colorMap[os]}20`,
        color: colorMap[os],
        border: `1px solid ${colorMap[os]}40`,
      }}
      title={`${profile.name}: ${profile.coreTheme}`}
    >
      {profile.spiralColor} • {profile.name}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SPOON COST INDICATOR
// ═══════════════════════════════════════════════════════════════════════════════

function SpoonCostIndicator({ cost, currentSpoons }: { cost: number; currentSpoons: number }) {
  const canAfford = currentSpoons >= cost;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '4px 8px',
        background: canAfford ? '#064E3B' : '#7F1D1D',
        borderRadius: '4px',
        fontSize: '12px',
      }}
      role="status"
      aria-label={`Spoon cost: ${cost}. ${canAfford ? 'You can handle this.' : 'This may be too demanding right now.'}`}
    >
      <span>🥄</span>
      <span style={{ color: canAfford ? '#6EE7B7' : '#FCA5A5' }}>
        Cost: {cost.toFixed(1)} / {currentSpoons.toFixed(1)} available
      </span>
      {!canAfford && (
        <span style={{ color: '#FCA5A5', fontWeight: 600 }}>⚠️</span>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// REVEAL BUTTON
// ═══════════════════════════════════════════════════════════════════════════════

interface RevealButtonProps {
  voltage: number;
  onReveal: () => void;
  revealed: boolean;
}

function RevealButton({ voltage, onReveal, revealed }: RevealButtonProps) {
  const [confirmStep, setConfirmStep] = useState(0);
  
  const handleClick = useCallback(() => {
    if (voltage >= 7) {
      // High voltage requires confirmation
      if (confirmStep < 2) {
        setConfirmStep(prev => prev + 1);
        return;
      }
    }
    onReveal();
  }, [voltage, confirmStep, onReveal]);

  if (revealed) {
    return (
      <button
        style={{
          padding: '8px 16px',
          background: '#374151',
          border: 'none',
          borderRadius: '6px',
          color: '#9CA3AF',
          fontSize: '12px',
          cursor: 'pointer',
        }}
        onClick={() => setConfirmStep(0)}
        disabled
      >
        ✓ Raw content visible
      </button>
    );
  }

  const buttonText = voltage >= 7
    ? confirmStep === 0 
      ? '⚠️ View Raw (High Voltage)'
      : confirmStep === 1
        ? 'Are you sure? Click again to confirm'
        : 'Final confirmation - View raw'
    : 'View original message';

  const buttonColor = voltage >= 7
    ? confirmStep === 0 ? '#B91C1C' : '#DC2626'
    : '#4B5563';

  return (
    <button
      style={{
        padding: '8px 16px',
        background: buttonColor,
        border: 'none',
        borderRadius: '6px',
        color: '#FFFFFF',
        fontSize: '12px',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'background 0.2s',
      }}
      onClick={handleClick}
      aria-label={buttonText}
    >
      {buttonText}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function MessageDisplay({ 
  message, 
  showRaw = false,
  onRevealRaw,
  compact = false 
}: MessageDisplayProps) {
  const [localShowRaw, setLocalShowRaw] = useState(showRaw);
  const currentSpoons = useHeartbeatStore(state => state.operator.spoons);

  const handleReveal = useCallback(() => {
    setLocalShowRaw(true);
    onRevealRaw?.();
  }, [onRevealRaw]);

  const { safeSummary, facts, actionItems, voltage, senderOS, spoonCost, raw } = message;

  return (
    <article
      style={{
        background: '#1F2937',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #374151',
      }}
      aria-label="Processed message"
    >
      {/* Header */}
      <header
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 16px',
          background: '#111827',
          borderBottom: '1px solid #374151',
        }}
      >
        <span style={{ fontWeight: 500, color: '#F3F4F6' }}>
          From: {raw.sender}
        </span>
        <HumanOSBadge os={senderOS} />
        <DomainBadge domain={message.domain} />
        <span style={{ marginLeft: 'auto' }}>
          <VoltageBadge voltage={voltage.score} />
        </span>
      </header>

      {/* Body */}
      <div style={{ padding: '16px' }}>
        {/* Voltage indicator */}
        {!compact && (
          <div style={{ marginBottom: '16px' }}>
            <VoltageIndicator voltage={voltage.score} size="md" />
          </div>
        )}

        {/* Spoon cost */}
        <div style={{ marginBottom: '16px' }}>
          <SpoonCostIndicator cost={spoonCost} currentSpoons={currentSpoons} />
        </div>

        {/* Safe Summary */}
        <section style={{ marginBottom: '16px' }}>
          <h3 style={{ 
            fontSize: '12px', 
            color: '#9CA3AF', 
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            Safe Summary
          </h3>
          <p style={{ 
            color: '#F3F4F6', 
            lineHeight: 1.6,
            padding: '12px',
            background: '#374151',
            borderRadius: '6px',
            margin: 0,
          }}>
            {safeSummary}
          </p>
        </section>

        {/* Facts */}
        {facts.length > 0 && (
          <section style={{ marginBottom: '16px' }}>
            <h3 style={{ 
              fontSize: '12px', 
              color: '#9CA3AF', 
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Key Facts
            </h3>
            <ul style={{ 
              margin: 0, 
              paddingLeft: '20px',
              color: '#D1D5DB',
            }}>
              {facts.map((fact, i) => (
                <li key={i} style={{ marginBottom: '4px' }}>{fact}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Action Items */}
        {actionItems.length > 0 && (
          <section style={{ marginBottom: '16px' }}>
            <h3 style={{ 
              fontSize: '12px', 
              color: '#9CA3AF', 
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Action Items
            </h3>
            <ul style={{ 
              margin: 0, 
              paddingLeft: '20px',
              color: '#FCD34D',
            }}>
              {actionItems.map((item, i) => (
                <li key={i} style={{ marginBottom: '4px' }}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Voltage Breakdown (collapsible) */}
        {!compact && (
          <details style={{ marginBottom: '16px' }}>
            <summary style={{ 
              cursor: 'pointer', 
              color: '#9CA3AF',
              fontSize: '12px',
              marginBottom: '8px',
            }}>
              View voltage breakdown
            </summary>
            <VoltageBreakdown breakdown={voltage.breakdown} />
          </details>
        )}

        {/* Triggers warning */}
        {voltage.triggers.length > 0 && (
          <section style={{ 
            marginBottom: '16px',
            padding: '12px',
            background: '#7F1D1D20',
            border: '1px solid #7F1D1D',
            borderRadius: '6px',
          }}>
            <h3 style={{ 
              fontSize: '12px', 
              color: '#FCA5A5', 
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}>
              ⚠️ Detected Triggers
            </h3>
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '4px' 
            }}>
              {voltage.triggers.map((trigger, i) => (
                <span
                  key={i}
                  style={{
                    padding: '2px 6px',
                    background: '#7F1D1D',
                    borderRadius: '4px',
                    fontSize: '11px',
                    color: '#FCA5A5',
                  }}
                >
                  {trigger}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Raw content (progressive disclosure) */}
        <section>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '8px',
          }}>
            <h3 style={{ 
              fontSize: '12px', 
              color: '#9CA3AF', 
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              margin: 0,
            }}>
              Original Message
            </h3>
            <RevealButton 
              voltage={voltage.score}
              onReveal={handleReveal}
              revealed={localShowRaw}
            />
          </div>
          
          {localShowRaw && (
            <div
              style={{
                padding: '12px',
                background: voltage.score >= 7 ? '#7F1D1D20' : '#37415180',
                border: `1px solid ${voltage.score >= 7 ? '#7F1D1D' : '#4B5563'}`,
                borderRadius: '6px',
                color: '#E5E7EB',
                whiteSpace: 'pre-wrap',
                fontFamily: 'monospace',
                fontSize: '13px',
                lineHeight: 1.5,
              }}
            >
              {raw.content}
            </div>
          )}
        </section>
      </div>

      {/* Footer */}
      <footer
        style={{
          padding: '8px 16px',
          background: '#111827',
          borderTop: '1px solid #374151',
          fontSize: '11px',
          color: '#6B7280',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>Received: {new Date(raw.timestamp).toLocaleString()}</span>
        <span>Processed: {new Date(message.processedAt).toLocaleString()}</span>
      </footer>
    </article>
  );
}

export default MessageDisplay;
