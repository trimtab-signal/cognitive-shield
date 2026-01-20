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
 * Heartbeat Panel Component
 * Operator status check-in and monitoring
 * 
 * Features:
 * - Spoon slider for current capacity
 * - Status indicators (green/yellow/orange/red)
 * - Deep processing lock toggle
 * - Stress indicator inputs
 */

import { useCallback } from 'react';
import { useHeartbeatStore } from '../../stores/heartbeat.store';
import { HeartbeatConfig, MetabolismConfig } from '../../config/god.config';
import type { HeartbeatStatus } from '../../config/god.config';

// ═══════════════════════════════════════════════════════════════════════════════
// STATUS DISPLAY
// ═══════════════════════════════════════════════════════════════════════════════

function StatusDisplay({ status, percent }: { status: HeartbeatStatus; percent: number }) {
  const color = HeartbeatConfig.colors[status];
  
  const statusMessages: Record<HeartbeatStatus, string> = {
    green: 'Systems Nominal - Full capability',
    yellow: 'Conservation Mode - Reduced animations',
    orange: 'Defensive Mode - Expanded buffer',
    red: 'Deep Processing Lock - Input disabled',
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px',
        background: `${color}10`,
        borderRadius: '8px',
        border: `1px solid ${color}40`,
      }}
      role="status"
      aria-live="polite"
    >
      {/* Pulsing indicator */}
      <div
        style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          background: color,
          animation: status !== 'red' ? 'pulse 2s ease-in-out infinite' : 'none',
        }}
      />
      
      <div style={{ flex: 1 }}>
        <div style={{ 
          fontSize: '18px', 
          fontWeight: 600, 
          color: color,
          marginBottom: '4px',
        }}>
          {percent.toFixed(0)}% - {status.toUpperCase()}
        </div>
        <div style={{ fontSize: '13px', color: '#9CA3AF' }}>
          {statusMessages[status]}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SPOON SLIDER
// ═══════════════════════════════════════════════════════════════════════════════

function SpoonSlider({ 
  value, 
  max, 
  onChange 
}: { 
  value: number; 
  max: number; 
  onChange: (value: number) => void;
}) {
  const percent = (value / max) * 100;
  
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        marginBottom: '8px',
      }}>
        <label 
          htmlFor="spoon-slider"
          style={{ fontSize: '14px', color: '#D1D5DB' }}
        >
          Current Spoons
        </label>
        <span style={{ 
          fontSize: '14px', 
          fontWeight: 600, 
          color: '#F3F4F6' 
        }}>
          {value.toFixed(1)} / {max}
        </span>
      </div>
      
      {/* Visual spoons */}
      <div style={{ 
        display: 'flex', 
        gap: '4px', 
        marginBottom: '8px',
        flexWrap: 'wrap',
      }}>
        {Array.from({ length: Math.ceil(max) }, (_, i) => {
          const isFilled = i < Math.floor(value);
          const isPartial = i === Math.floor(value) && value % 1 > 0;
          
          return (
            <span
              key={i}
              style={{
                fontSize: '20px',
                opacity: isFilled ? 1 : isPartial ? 0.5 : 0.2,
                filter: isFilled || isPartial ? 'none' : 'grayscale(1)',
              }}
              role="img"
              aria-hidden="true"
            >
              🥄
            </span>
          );
        })}
      </div>
      
      {/* Slider */}
      <input
        id="spoon-slider"
        type="range"
        min={0}
        max={max}
        step={0.5}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{
          width: '100%',
          height: '8px',
          borderRadius: '4px',
          appearance: 'none',
          background: `linear-gradient(to right, #10B981 0%, #10B981 ${percent}%, #374151 ${percent}%, #374151 100%)`,
          cursor: 'pointer',
        }}
        aria-label={`Set spoon count to ${value}`}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STRESS INDICATORS
// ═══════════════════════════════════════════════════════════════════════════════

interface StressSliderProps {
  label: string;
  icon: string;
  value: number;
  onChange: (value: number) => void;
}

function StressSlider({ label, icon, value, onChange }: StressSliderProps) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '4px',
      }}>
        <label style={{ 
          fontSize: '12px', 
          color: '#9CA3AF',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}>
          <span>{icon}</span>
          {label}
        </label>
        <span style={{ fontSize: '12px', color: '#D1D5DB' }}>
          {value}/10
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={10}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        style={{
          width: '100%',
          height: '6px',
          borderRadius: '3px',
          appearance: 'none',
          background: '#374151',
          cursor: 'pointer',
        }}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// QUICK ACTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function QuickActions({ onRecovery }: { onRecovery: (amount: number) => void }) {
  const recoveryActions = [
    { label: '☕ Take a break', amount: MetabolismConfig.recovery.breathing },
    { label: '🏋️ Heavy work', amount: MetabolismConfig.recovery.heavyWork },
    { label: '😴 Power nap', amount: MetabolismConfig.recovery.nap },
  ];

  return (
    <div style={{ marginTop: '16px' }}>
      <div style={{ 
        fontSize: '12px', 
        color: '#9CA3AF', 
        marginBottom: '8px',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}>
        Quick Recovery
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {recoveryActions.map(({ label, amount }) => (
          <button
            key={label}
            onClick={() => onRecovery(amount)}
            style={{
              padding: '8px 12px',
              background: '#374151',
              border: 'none',
              borderRadius: '6px',
              color: '#D1D5DB',
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#4B5563'}
            onMouseOut={(e) => e.currentTarget.style.background = '#374151'}
          >
            {label} (+{amount})
          </button>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function HeartbeatPanel() {
  const operator = useHeartbeatStore(state => state.operator);
  const setSpoons = useHeartbeatStore(state => state.setSpoons);
  const updateSpoons = useHeartbeatStore(state => state.updateSpoons);
  const updateStress = useHeartbeatStore(state => state.updateStress);
  const toggleDeepProcessingLock = useHeartbeatStore(state => state.toggleDeepProcessingLock);

  const handleRecovery = useCallback((amount: number) => {
    updateSpoons(amount);
  }, [updateSpoons]);

  return (
    <div
      style={{
        background: '#1F2937',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid #374151',
      }}
    >
      <h2 style={{ 
        fontSize: '16px', 
        fontWeight: 600, 
        color: '#F3F4F6',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        💓 Heartbeat Check-In
      </h2>

      {/* Status display */}
      <StatusDisplay 
        status={operator.heartbeat} 
        percent={operator.heartbeatPercent} 
      />

      {/* Spoon slider */}
      <div style={{ marginTop: '20px' }}>
        <SpoonSlider 
          value={operator.spoons}
          max={operator.maxSpoons}
          onChange={setSpoons}
        />
      </div>

      {/* Stress indicators */}
      <div style={{ marginTop: '20px' }}>
        <div style={{ 
          fontSize: '12px', 
          color: '#9CA3AF', 
          marginBottom: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          Stress Indicators
        </div>
        
        <StressSlider
          label="Physical Tension"
          icon="💪"
          value={operator.stressIndicators.physicalTension}
          onChange={(v) => updateStress({ physicalTension: v })}
        />
        <StressSlider
          label="Mental Load"
          icon="🧠"
          value={operator.stressIndicators.mentalLoad}
          onChange={(v) => updateStress({ mentalLoad: v })}
        />
        <StressSlider
          label="Emotional State"
          icon="💭"
          value={operator.stressIndicators.emotionalState}
          onChange={(v) => updateStress({ emotionalState: v })}
        />
      </div>

      {/* Deep processing lock */}
      <div style={{ 
        marginTop: '20px',
        padding: '12px',
        background: operator.deepProcessingLock ? '#7F1D1D20' : '#374151',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ 
            fontSize: '13px', 
            color: operator.deepProcessingLock ? '#FCA5A5' : '#D1D5DB',
            fontWeight: 500,
          }}>
            🔒 Deep Processing Lock
          </div>
          <div style={{ fontSize: '11px', color: '#9CA3AF' }}>
            Blocks new high-voltage messages
          </div>
        </div>
        <button
          onClick={() => toggleDeepProcessingLock(!operator.deepProcessingLock)}
          style={{
            padding: '6px 12px',
            background: operator.deepProcessingLock ? '#DC2626' : '#374151',
            border: '1px solid',
            borderColor: operator.deepProcessingLock ? '#DC2626' : '#4B5563',
            borderRadius: '6px',
            color: '#FFFFFF',
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          {operator.deepProcessingLock ? 'Unlock' : 'Lock'}
        </button>
      </div>

      {/* Quick recovery actions */}
      <QuickActions onRecovery={handleRecovery} />

      {/* Last check-in */}
      <div style={{ 
        marginTop: '16px', 
        fontSize: '11px', 
        color: '#6B7280',
        textAlign: 'center',
      }}>
        Last check-in: {operator.lastCheckIn.toLocaleTimeString()}
      </div>

      {/* CSS for pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}

export default HeartbeatPanel;
