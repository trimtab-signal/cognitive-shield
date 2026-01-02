/**
 * VOLTAGE GAUGE COMPONENT
 * Visual indicator of emotional intensity
 */

import { useMemo } from 'react';
import GOD_CONFIG from '../god.config';

interface VoltageGaugeProps {
  voltage: number;
  size?: 'sm' | 'md' | 'lg';
}

export function VoltageGauge({ voltage, size = 'md' }: VoltageGaugeProps) {
  const { level, color, percentage } = useMemo(() => {
    const pct = Math.round(voltage * 100);
    if (voltage <= GOD_CONFIG.voltage.low.threshold) {
      return { level: 'LOW', color: GOD_CONFIG.voltage.low.color, percentage: pct };
    }
    if (voltage <= GOD_CONFIG.voltage.medium.threshold) {
      return { level: 'MEDIUM', color: GOD_CONFIG.voltage.medium.color, percentage: pct };
    }
    return { level: 'HIGH', color: GOD_CONFIG.voltage.high.color, percentage: pct };
  }, [voltage]);

  const dimensions = {
    sm: { width: 120, height: 8, fontSize: 10 },
    md: { width: 180, height: 12, fontSize: 12 },
    lg: { width: 240, height: 16, fontSize: 14 },
  }[size];

  return (
    <div className="voltage-gauge" style={{ width: dimensions.width }}>
      <div 
        className="gauge-label"
        style={{ 
          fontSize: dimensions.fontSize,
          color: GOD_CONFIG.theme.text.secondary,
          marginBottom: 4,
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: GOD_CONFIG.typography.fontFamily.display,
        }}
      >
        <span>VOLTAGE</span>
        <span style={{ color }}>{level} ({percentage}%)</span>
      </div>
      <div 
        className="gauge-track"
        style={{
          width: '100%',
          height: dimensions.height,
          backgroundColor: GOD_CONFIG.theme.bg.accent,
          borderRadius: dimensions.height / 2,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          className="gauge-fill"
          style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: color,
            borderRadius: dimensions.height / 2,
            transition: 'width 0.5s ease-out, background-color 0.3s ease',
            boxShadow: `0 0 ${dimensions.height}px ${color}40`,
          }}
        />
        {/* Voltage markers */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '33%',
            width: 1,
            height: '100%',
            backgroundColor: GOD_CONFIG.theme.border.default,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '66%',
            width: 1,
            height: '100%',
            backgroundColor: GOD_CONFIG.theme.border.default,
          }}
        />
      </div>
    </div>
  );
}

export default VoltageGauge;

