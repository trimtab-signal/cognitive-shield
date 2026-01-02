/**
 * CHECK-IN HISTORY
 * Calendar view and trends for daily check-ins
 */

import { useMemo } from 'react';
import { Calendar, TrendingUp, TrendingDown, Minus, Download } from 'lucide-react';
import type { DailyCheckIn } from '../types/checkin.types';
import GOD_CONFIG from '../god.config';

interface CheckInHistoryProps {
  history: readonly DailyCheckIn[];
  onExport?: () => void;
}

export function CheckInHistory({ history, onExport }: CheckInHistoryProps) {
  const { average, trend, last7Days } = useMemo(() => {
    if (history.length === 0) {
      return { average: 0, trend: 'stable' as const, last7Days: [] };
    }

    const avg = history.reduce((sum, c) => sum + c.percentage, 0) / history.length;
    
    // Calculate trend
    const recent = history.slice(0, 7);
    const older = history.slice(7, 14);
    let trendDirection: 'improving' | 'stable' | 'declining' = 'stable';
    if (recent.length > 0 && older.length > 0) {
      const recentAvg = recent.reduce((s, c) => s + c.percentage, 0) / recent.length;
      const olderAvg = older.reduce((s, c) => s + c.percentage, 0) / older.length;
      const diff = recentAvg - olderAvg;
      if (diff > 5) trendDirection = 'improving';
      else if (diff < -5) trendDirection = 'declining';
    }

    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

    return {
      average: avg,
      trend: trendDirection,
      last7Days: history.filter((c) => c.timestamp >= sevenDaysAgo),
    };
  }, [history]);

  const getColorForPercentage = (pct: number) => {
    const thresholds = GOD_CONFIG.dailyCheckIn.thresholds;
    if (pct >= thresholds.high) return GOD_CONFIG.heartbeat.statuses.green.color;
    if (pct >= thresholds.moderate) return GOD_CONFIG.heartbeat.statuses.yellow.color;
    if (pct >= thresholds.low) return GOD_CONFIG.heartbeat.statuses.orange.color;
    return GOD_CONFIG.heartbeat.statuses.red.color;
  };

  return (
    <div
      style={{
        padding: 20,
        backgroundColor: GOD_CONFIG.theme.bg.secondary,
        borderRadius: 12,
        border: `1px solid ${GOD_CONFIG.theme.border.default}`,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Calendar size={16} color={GOD_CONFIG.theme.text.accent} />
          <span
            style={{
              fontSize: 12,
              fontFamily: GOD_CONFIG.typography.fontFamily.display,
              color: GOD_CONFIG.theme.text.secondary,
            }}
          >
            CHECK-IN HISTORY
          </span>
        </div>
        {onExport && (
          <button
            onClick={onExport}
            style={{
              padding: '6px 12px',
              backgroundColor: GOD_CONFIG.theme.bg.tertiary,
              border: `1px solid ${GOD_CONFIG.theme.border.default}`,
              borderRadius: 6,
              color: GOD_CONFIG.theme.text.secondary,
              fontSize: 11,
              fontFamily: GOD_CONFIG.typography.fontFamily.display,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Download size={12} />
            Export
          </button>
        )}
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            padding: 12,
            backgroundColor: GOD_CONFIG.theme.bg.tertiary,
            borderRadius: 8,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
              fontFamily: GOD_CONFIG.typography.fontFamily.display,
              color: GOD_CONFIG.theme.text.accent,
            }}
          >
            {history.length}
          </div>
          <div
            style={{
              fontSize: 10,
              color: GOD_CONFIG.theme.text.muted,
              marginTop: 4,
            }}
          >
            Total Entries
          </div>
        </div>

        <div
          style={{
            padding: 12,
            backgroundColor: GOD_CONFIG.theme.bg.tertiary,
            borderRadius: 8,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
              fontFamily: GOD_CONFIG.typography.fontFamily.display,
              color: getColorForPercentage(average),
            }}
          >
            {Math.round(average)}%
          </div>
          <div
            style={{
              fontSize: 10,
              color: GOD_CONFIG.theme.text.muted,
              marginTop: 4,
            }}
          >
            Average
          </div>
        </div>

        <div
          style={{
            padding: 12,
            backgroundColor: GOD_CONFIG.theme.bg.tertiary,
            borderRadius: 8,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
          }}
        >
          {trend === 'improving' ? (
            <TrendingUp size={20} color={GOD_CONFIG.voltage.low.color} />
          ) : trend === 'declining' ? (
            <TrendingDown size={20} color={GOD_CONFIG.voltage.high.color} />
          ) : (
            <Minus size={20} color={GOD_CONFIG.theme.text.muted} />
          )}
          <div
            style={{
              fontSize: 10,
              color: GOD_CONFIG.theme.text.muted,
              textTransform: 'capitalize',
            }}
          >
            {trend}
          </div>
        </div>
      </div>

      {/* Trend Graph - Last 7 Days */}
      {last7Days.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              fontSize: 11,
              color: GOD_CONFIG.theme.text.muted,
              marginBottom: 12,
              fontFamily: GOD_CONFIG.typography.fontFamily.display,
            }}
            >
            LAST 7 DAYS
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: 4,
              height: 60,
            }}
          >
            {last7Days.slice(0, 7).map((entry, i) => {
              const height = (entry.percentage / 100) * 60;
              return (
                <div
                  key={entry.id}
                  style={{
                    flex: 1,
                    height: `${height}px`,
                    minHeight: 4,
                    backgroundColor: getColorForPercentage(entry.percentage),
                    borderRadius: '4px 4px 0 0',
                    position: 'relative',
                    cursor: 'pointer',
                  }}
                  title={`${new Date(entry.timestamp).toLocaleDateString()}: ${Math.round(entry.percentage)}%`}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Entries */}
      {history.length > 0 && (
        <div>
          <div
            style={{
              fontSize: 11,
              color: GOD_CONFIG.theme.text.muted,
              marginBottom: 12,
              fontFamily: GOD_CONFIG.typography.fontFamily.display,
            }}
          >
            RECENT ENTRIES
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {history.slice(0, 5).map((entry) => (
              <div
                key={entry.id}
                style={{
                  padding: 12,
                  backgroundColor: GOD_CONFIG.theme.bg.tertiary,
                  borderRadius: 8,
                  border: `1px solid ${getColorForPercentage(entry.percentage)}40`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: GOD_CONFIG.theme.text.primary,
                        marginBottom: 4,
                      }}
                    >
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: GOD_CONFIG.theme.text.muted,
                      }}
                    >
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      fontFamily: GOD_CONFIG.typography.fontFamily.display,
                      color: getColorForPercentage(entry.percentage),
                    }}
                  >
                    {Math.round(entry.percentage)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {history.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: GOD_CONFIG.theme.text.muted,
          }}
        >
          <Calendar size={32} style={{ marginBottom: 12, opacity: 0.5 }} />
          <p style={{ margin: 0, fontSize: 13 }}>
            No check-in history yet.
          </p>
          <p style={{ margin: '8px 0 0', fontSize: 11 }}>
            Complete your first daily check-in to see trends here.
          </p>
        </div>
      )}
    </div>
  );
}

export default CheckInHistory;

