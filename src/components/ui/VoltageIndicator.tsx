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
 * Voltage Indicator Component
 * Visual representation of message emotional intensity
 * 
 * Uses a thermometer/gauge metaphor with color gradients
 * Designed for quick visual assessment without cognitive load
 */

import { useMemo } from 'react';
import type { VoltageIndicatorProps } from '../../types';
import { VoltageConfig, HeartbeatConfig } from '../../config/god.config';

// ═══════════════════════════════════════════════════════════════════════════════
// VOLTAGE LABEL MAPPING
// ═══════════════════════════════════════════════════════════════════════════════

const voltageLabels: Record<number, string> = {
  0: 'Calm',
  1: 'Neutral',
  2: 'Mild',
  3: 'Moderate',
  4: 'Elevated',
  5: 'Charged',
  6: 'Tense',
  7: 'High',
  8: 'Intense',
  9: 'Critical',
  10: 'Extreme',
};

function getVoltageLabel(voltage: number): string {
  const rounded = Math.round(voltage);
  return voltageLabels[Math.min(10, Math.max(0, rounded))] || 'Unknown';
}

function getVoltageColor(voltage: number): string {
  if (voltage <= VoltageConfig.thresholds.safeView) {
    return HeartbeatConfig.colors.green;
  }
  if (voltage <= VoltageConfig.thresholds.confirmRequired) {
    return HeartbeatConfig.colors.yellow;
  }
  if (voltage < VoltageConfig.thresholds.autoQueue) {
    return HeartbeatConfig.colors.orange;
  }
  return HeartbeatConfig.colors.red;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SIZE CONFIGURATIONS
// ═══════════════════════════════════════════════════════════════════════════════

const sizeConfig = {
  sm: {
    width: 80,
    height: 24,
    fontSize: '12px',
    borderRadius: '4px',
    padding: '2px 8px',
  },
  md: {
    width: 120,
    height: 32,
    fontSize: '14px',
    borderRadius: '6px',
    padding: '4px 12px',
  },
  lg: {
    width: 160,
    height: 40,
    fontSize: '16px',
    borderRadius: '8px',
    padding: '6px 16px',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function VoltageIndicator({
  voltage,
  size = 'md',
  showLabel = true,
  animated = true,
}: VoltageIndicatorProps) {
  const config = sizeConfig[size];
  const color = useMemo(() => getVoltageColor(voltage), [voltage]);
  const label = useMemo(() => getVoltageLabel(voltage), [voltage]);
  const percentage = (voltage / VoltageConfig.maxVoltage) * 100;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
      }}
      role="meter"
      aria-valuenow={voltage}
      aria-valuemin={0}
      aria-valuemax={VoltageConfig.maxVoltage}
      aria-label={`Voltage level: ${voltage} out of ${VoltageConfig.maxVoltage} (${label})`}
    >
      {/* Gauge bar */}
      <div
        style={{
          width: config.width,
          height: config.height,
          background: '#374151',
          borderRadius: config.borderRadius,
          overflow: 'hidden',
          position: 'relative',
          border: '1px solid #4B5563',
        }}
      >
        {/* Fill */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: `${percentage}%`,
            background: `linear-gradient(90deg, ${HeartbeatConfig.colors.green} 0%, ${HeartbeatConfig.colors.yellow} 50%, ${HeartbeatConfig.colors.red} 100%)`,
            backgroundSize: `${config.width}px 100%`,
            backgroundPosition: 'left',
            transition: animated ? 'width 0.5s ease-out' : 'none',
          }}
        />
        
        {/* Threshold markers */}
        <div
          style={{
            position: 'absolute',
            left: `${(VoltageConfig.thresholds.safeView / VoltageConfig.maxVoltage) * 100}%`,
            top: 0,
            bottom: 0,
            width: '1px',
            background: 'rgba(255, 255, 255, 0.3)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: `${(VoltageConfig.thresholds.confirmRequired / VoltageConfig.maxVoltage) * 100}%`,
            top: 0,
            bottom: 0,
            width: '1px',
            background: 'rgba(255, 255, 255, 0.3)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: `${(VoltageConfig.thresholds.autoQueue / VoltageConfig.maxVoltage) * 100}%`,
            top: 0,
            bottom: 0,
            width: '1px',
            background: 'rgba(255, 255, 255, 0.3)',
          }}
        />
        
        {/* Value overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontSize: config.fontSize,
            fontWeight: 600,
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
          }}
        >
          {voltage.toFixed(1)}
        </div>
      </div>

      {/* Label */}
      {showLabel && (
        <span
          style={{
            fontSize: config.fontSize,
            fontWeight: 500,
            color: color,
            minWidth: '60px',
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPACT BADGE VERSION
// ═══════════════════════════════════════════════════════════════════════════════

export function VoltageBadge({ voltage }: { voltage: number }) {
  const color = getVoltageColor(voltage);
  const label = getVoltageLabel(voltage);

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '2px 8px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: 500,
        background: `${color}20`,
        color: color,
        border: `1px solid ${color}40`,
      }}
      role="status"
      aria-label={`Voltage: ${label}`}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: color,
        }}
      />
      {voltage.toFixed(1)} - {label}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DETAILED BREAKDOWN VERSION
// ═══════════════════════════════════════════════════════════════════════════════

interface VoltageBreakdownProps {
  breakdown: {
    emotional: number;
    urgency: number;
    ambiguity: number;
    accusatory: number;
    complexity: number;
  };
}

export function VoltageBreakdown({ breakdown }: VoltageBreakdownProps) {
  const categories = [
    { key: 'emotional', label: 'Emotional', icon: '💭' },
    { key: 'urgency', label: 'Urgency', icon: '⏱️' },
    { key: 'ambiguity', label: 'Ambiguity', icon: '❓' },
    { key: 'accusatory', label: 'Accusatory', icon: '⚡' },
    { key: 'complexity', label: 'Complexity', icon: '🧩' },
  ] as const;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        padding: '12px',
        background: '#1F2937',
        borderRadius: '8px',
      }}
      role="group"
      aria-label="Voltage breakdown by category"
    >
      {categories.map(({ key, label, icon }) => {
        const value = breakdown[key];
        const color = getVoltageColor(value);
        
        return (
          <div
            key={key}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ width: '24px', textAlign: 'center' }}>{icon}</span>
            <span style={{ 
              width: '80px', 
              fontSize: '12px', 
              color: '#9CA3AF' 
            }}>
              {label}
            </span>
            <div
              style={{
                flex: 1,
                height: '8px',
                background: '#374151',
                borderRadius: '4px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${(value / 10) * 100}%`,
                  background: color,
                  transition: 'width 0.3s ease-out',
                }}
              />
            </div>
            <span style={{ 
              width: '30px', 
              fontSize: '12px', 
              color: color,
              textAlign: 'right',
            }}>
              {value.toFixed(1)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default VoltageIndicator;
