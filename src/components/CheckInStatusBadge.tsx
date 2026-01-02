/**
 * CHECK-IN STATUS BADGE
 * Displays π-Metric percentage with resonance level
 */

import { useMemo } from 'react';
import { Info } from 'lucide-react';
import type { DailyCheckIn } from '../types/checkin.types';
import GOD_CONFIG from '../god.config';
import { getResonanceLevel, getResonanceDescription } from '../lib/checkin-scoring';

interface CheckInStatusBadgeProps {
  checkIn: DailyCheckIn | null;
  onClick?: () => void;
  compact?: boolean;
}

export function CheckInStatusBadge({ checkIn, onClick, compact = false }: CheckInStatusBadgeProps) {
  const { color, icon } = useMemo(() => {
    if (!checkIn) {
      return {
        color: GOD_CONFIG.theme.text.muted,
        icon: '—',
      };
    }

    const thresholds = GOD_CONFIG.dailyCheckIn.thresholds;
    if (checkIn.percentage >= thresholds.high) {
      return {
        color: GOD_CONFIG.heartbeat.statuses.green.color,
        icon: '💚',
      };
    }
    if (checkIn.percentage >= thresholds.moderate) {
      return {
        color: GOD_CONFIG.heartbeat.statuses.yellow.color,
        icon: '💛',
      };
    }
    if (checkIn.percentage >= thresholds.low) {
      return {
        color: GOD_CONFIG.heartbeat.statuses.orange.color,
        icon: '🧡',
      };
    }
    return {
      color: GOD_CONFIG.heartbeat.statuses.red.color,
      icon: '🆘',
    };
  }, [checkIn]);

  const resonanceLevel = checkIn ? getResonanceLevel(checkIn.percentage) : null;
  const description = checkIn ? getResonanceDescription(checkIn.percentage) : null;

  if (compact) {
    return (
      <div
        onClick={onClick}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 10px',
          backgroundColor: `${color}20`,
          border: `1px solid ${color}40`,
          borderRadius: 6,
          fontSize: 11,
          fontFamily: GOD_CONFIG.typography.fontFamily.display,
          color: color,
          cursor: onClick ? 'pointer' : 'default',
        }}
        title={description || 'Click to view check-in details'}
      >
        <span>{icon}</span>
        <span>{checkIn ? `${Math.round(checkIn.percentage)}%` : '—'}</span>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      style={{
        padding: 12,
        backgroundColor: GOD_CONFIG.theme.bg.tertiary,
        border: `1px solid ${color}40`,
        borderRadius: 8,
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>{icon}</span>
          <div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                fontFamily: GOD_CONFIG.typography.fontFamily.display,
                color: color,
              }}
            >
              {checkIn ? `${Math.round(checkIn.percentage)}%` : '—'}
            </div>
            <div
              style={{
                fontSize: 10,
                color: GOD_CONFIG.theme.text.muted,
                fontFamily: GOD_CONFIG.typography.fontFamily.display,
              }}
            >
              {resonanceLevel || 'No check-in today'}
            </div>
          </div>
        </div>
        {onClick && (
          <Info size={14} color={GOD_CONFIG.theme.text.muted} />
        )}
      </div>

      {description && (
        <p
          style={{
            margin: 0,
            fontSize: 11,
            lineHeight: 1.5,
            color: GOD_CONFIG.theme.text.secondary,
            fontStyle: 'italic',
          }}
        >
          {description}
        </p>
      )}

      {checkIn && (
        <div
          style={{
            marginTop: 8,
            fontSize: 9,
            color: GOD_CONFIG.theme.text.muted,
            fontFamily: GOD_CONFIG.typography.fontFamily.display,
          }}
        >
          Calculated via π-Metric (Truth Formula)
        </div>
      )}
    </div>
  );
}

export default CheckInStatusBadge;

