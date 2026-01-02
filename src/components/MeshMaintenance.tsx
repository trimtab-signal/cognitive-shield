/**
 * MESH MAINTENANCE SCHEDULE
 * Proactive protocol to maintain Green Board status and prevent Topological Arrest
 */

import { useState, useMemo } from 'react';
import { Calendar, TrendingUp, AlertTriangle, CheckCircle2, Clock, Activity, Shield } from 'lucide-react';
import GOD_CONFIG from '../god.config';
import useHeartbeatStore from '../store/heartbeat.store';
import { DailyCheckIn } from './DailyCheckIn';
import RestorativeReset from './RestorativeReset';

interface MaintenanceAction {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly priority: 'critical' | 'high' | 'medium' | 'low';
  readonly category: 'check-in' | 'somatic' | 'social' | 'metabolic' | 'structural';
  readonly timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'anytime';
}

const MAINTENANCE_ACTIONS: readonly MaintenanceAction[] = [
  {
    id: 'daily-check-in',
    label: 'Daily Check-In',
    description: 'Complete your daily status assessment to calculate π-Metric resonance',
    priority: 'critical',
    category: 'check-in',
    timeOfDay: 'morning',
  },
  {
    id: 'tetrahedron-verify',
    label: 'Tetrahedron Symmetry Check',
    description: 'Verify SIC-POVM symmetry and Ollivier-Ricci Curvature',
    priority: 'high',
    category: 'structural',
    timeOfDay: 'anytime',
  },
  {
    id: 'somatic-grounding',
    label: 'Somatic Grounding (4-4-8)',
    description: 'Activate vagus nerve signal to break frozen stillness',
    priority: 'high',
    category: 'somatic',
    timeOfDay: 'anytime',
  },
  {
    id: 'deep-queue-review',
    label: 'Review Deep Processing Queue',
    description: 'Check gated messages when status improves',
    priority: 'medium',
    category: 'metabolic',
    timeOfDay: 'afternoon',
  },
  {
    id: 'heartbeat-sync',
    label: 'Heartbeat Status Update',
    description: 'Update your safety status for the mesh',
    priority: 'medium',
    category: 'social',
    timeOfDay: 'anytime',
  },
] as const;

interface TrendAnalysis {
  readonly direction: 'improving' | 'stable' | 'declining' | 'critical';
  readonly message: string;
  readonly recommendation: string;
  readonly color: string;
}

export function MeshMaintenance() {
  const { checkInHistory, getTodayCheckIn, currentStatus } = useHeartbeatStore();
  const [showCheckIn, setShowCheckIn] = useState(false);

  const todayCheckIn = getTodayCheckIn();
  const statusPercentage = todayCheckIn?.percentage ?? null;

  // Analyze 7-day trend
  const trendAnalysis = useMemo((): TrendAnalysis => {
    const recent = checkInHistory.slice(0, 7);
    if (recent.length < 2) {
      return {
        direction: 'stable',
        message: 'Insufficient data for trend analysis',
        recommendation: 'Complete daily check-ins to build trend data',
        color: GOD_CONFIG.theme.text.muted,
      };
    }

    const percentages = recent.map((ci) => ci.percentage);
    const avg = percentages.reduce((a, b) => a + b, 0) / percentages.length;
    const latest = percentages[0];
    const previous = percentages[1] || latest;

    const delta = latest - previous;
    const trend = delta > 5 ? 'improving' : delta < -5 ? 'declining' : 'stable';

    if (avg < 25) {
      return {
        direction: 'critical',
        message: 'Status consistently below 25% - Metabolic debt detected',
        recommendation: 'Prioritize rest, somatic grounding, and reduce cognitive load',
        color: GOD_CONFIG.voltage.high.color,
      };
    } else if (avg < 40) {
      return {
        direction: 'declining',
        message: 'Status below 40% - Approaching critical threshold',
        recommendation: 'Increase somatic interventions and review Deep Processing Queue',
        color: GOD_CONFIG.voltage.medium.color,
      };
    } else if (trend === 'improving') {
      return {
        direction: 'improving',
        message: `Status improving (+${delta.toFixed(1)}%) - Green Board trajectory`,
        recommendation: 'Maintain current protocols and continue daily check-ins',
        color: GOD_CONFIG.voltage.low.color,
      };
    } else if (trend === 'declining') {
      return {
        direction: 'declining',
        message: `Status declining (${delta.toFixed(1)}%) - Intervention recommended`,
        recommendation: 'Activate somatic grounding and review metabolic guardrails',
        color: GOD_CONFIG.voltage.medium.color,
      };
    } else {
      return {
        direction: 'stable',
        message: `Status stable (${latest.toFixed(0)}%) - Maintaining Green Board`,
        recommendation: 'Continue current maintenance schedule',
        color: GOD_CONFIG.voltage.low.color,
      };
    }
  }, [checkInHistory]);

  // Calculate next check-in due
  const nextCheckInDue = useMemo(() => {
    if (todayCheckIn) {
      const now = Date.now();
      const lastCheckIn = todayCheckIn.timestamp;
      const hoursSince = (now - lastCheckIn) / (1000 * 60 * 60);
      if (hoursSince < 24) {
        const hoursRemaining = 24 - hoursSince;
        return { hours: Math.floor(hoursRemaining), minutes: Math.floor((hoursRemaining % 1) * 60) };
      }
    }
    return null;
  }, [todayCheckIn]);

  // Get priority actions based on status
  const priorityActions = useMemo(() => {
    if (statusPercentage === null) {
      return MAINTENANCE_ACTIONS.filter((a) => a.id === 'daily-check-in');
    } else if (statusPercentage < 25) {
      return MAINTENANCE_ACTIONS.filter((a) => a.priority === 'critical' || a.priority === 'high');
    } else if (statusPercentage < 40) {
      return MAINTENANCE_ACTIONS.filter((a) => a.priority !== 'low');
    } else {
      return MAINTENANCE_ACTIONS;
    }
  }, [statusPercentage]);

  const getStatusColor = (percentage: number | null): string => {
    if (percentage === null) return GOD_CONFIG.theme.text.muted;
    if (percentage >= 80) return GOD_CONFIG.voltage.low.color;
    if (percentage >= 60) return GOD_CONFIG.voltage.low.color;
    if (percentage >= 40) return GOD_CONFIG.voltage.medium.color;
    if (percentage >= 25) return GOD_CONFIG.voltage.medium.color;
    return GOD_CONFIG.voltage.high.color;
  };

  const getStatusLabel = (percentage: number | null): string => {
    if (percentage === null) return 'Not Checked In';
    if (percentage >= 80) return 'High Resonance';
    if (percentage >= 60) return 'Moderate Resonance';
    if (percentage >= 40) return 'Low Resonance';
    if (percentage >= 25) return 'Critical';
    return 'Emergency';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div
        style={{
          padding: 20,
          backgroundColor: GOD_CONFIG.theme.bg.secondary,
          borderRadius: 12,
          border: `1px solid ${GOD_CONFIG.theme.border.default}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <Activity size={24} color={GOD_CONFIG.theme.text.accent} />
          <h2
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 700,
              fontFamily: GOD_CONFIG.typography.fontFamily.display,
              color: GOD_CONFIG.theme.text.primary,
            }}
          >
            Mesh Maintenance Schedule
          </h2>
        </div>
        <p style={{ margin: 0, fontSize: 13, color: GOD_CONFIG.theme.text.secondary }}>
          Proactive protocol to maintain Green Board status and prevent Topological Arrest
        </p>
      </div>

      {/* Current Status */}
      <div
        style={{
          padding: 20,
          backgroundColor: GOD_CONFIG.theme.bg.secondary,
          borderRadius: 12,
          border: `2px solid ${getStatusColor(statusPercentage)}40`,
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontFamily: GOD_CONFIG.typography.fontFamily.display,
            color: GOD_CONFIG.theme.text.secondary,
            marginBottom: 12,
          }}
        >
          CURRENT STATUS
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 700,
                fontFamily: GOD_CONFIG.typography.fontFamily.display,
                color: getStatusColor(statusPercentage),
                marginBottom: 4,
              }}
            >
              {statusPercentage !== null ? `${Math.round(statusPercentage)}%` : '—'}
            </div>
            <div
              style={{
                fontSize: 13,
                color: GOD_CONFIG.theme.text.secondary,
              }}
            >
              {getStatusLabel(statusPercentage)}
            </div>
          </div>

          {statusPercentage !== null && (
            <div
              style={{
                padding: '12px 16px',
                backgroundColor: `${getStatusColor(statusPercentage)}15`,
                borderRadius: 8,
                border: `1px solid ${getStatusColor(statusPercentage)}40`,
              }}
            >
              <div style={{ fontSize: 11, color: GOD_CONFIG.theme.text.muted, marginBottom: 4 }}>
                Status
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: getStatusColor(statusPercentage),
                }}
              >
                {statusPercentage >= 40 ? 'GREEN BOARD' : statusPercentage >= 25 ? 'CAUTION' : 'CRITICAL'}
              </div>
            </div>
          )}
        </div>

        {nextCheckInDue && (
          <div
            style={{
              padding: 12,
              backgroundColor: GOD_CONFIG.theme.bg.tertiary,
              borderRadius: 8,
              fontSize: 12,
              color: GOD_CONFIG.theme.text.primary,
            }}
          >
            <Clock size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
            Next check-in due in {nextCheckInDue.hours}h {nextCheckInDue.minutes}m
          </div>
        )}

        {!todayCheckIn && (
          <button
            onClick={() => setShowCheckIn(true)}
            style={{
              width: '100%',
              padding: '12px 20px',
              backgroundColor: GOD_CONFIG.theme.text.accent,
              border: 'none',
              borderRadius: 6,
              color: '#fff',
              fontSize: 13,
              fontWeight: 600,
              fontFamily: GOD_CONFIG.typography.fontFamily.display,
              cursor: 'pointer',
              marginTop: 12,
            }}
          >
            Complete Daily Check-In
          </button>
        )}
      </div>

      {/* Restorative Reset Protocol - Show when Critical */}
      {statusPercentage !== null && statusPercentage < 25 && (
        <div>
          <RestorativeReset />
        </div>
      )}

      {/* Trend Analysis */}
      <div
        style={{
          padding: 20,
          backgroundColor: GOD_CONFIG.theme.bg.secondary,
          borderRadius: 12,
          border: `1px solid ${trendAnalysis.color}40`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <TrendingUp size={18} color={trendAnalysis.color} />
          <div
            style={{
              fontSize: 12,
              fontFamily: GOD_CONFIG.typography.fontFamily.display,
              color: GOD_CONFIG.theme.text.secondary,
            }}
          >
            7-DAY TREND ANALYSIS
          </div>
        </div>

        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: trendAnalysis.color,
            marginBottom: 8,
          }}
        >
          {trendAnalysis.message}
        </div>

        <div
          style={{
            fontSize: 13,
            color: GOD_CONFIG.theme.text.primary,
            lineHeight: 1.6,
          }}
        >
          <strong>Recommendation:</strong> {trendAnalysis.recommendation}
        </div>
      </div>

      {/* Priority Actions */}
      <div
        style={{
          padding: 20,
          backgroundColor: GOD_CONFIG.theme.bg.secondary,
          borderRadius: 12,
          border: `1px solid ${GOD_CONFIG.theme.border.default}`,
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontFamily: GOD_CONFIG.typography.fontFamily.display,
            color: GOD_CONFIG.theme.text.secondary,
            marginBottom: 16,
          }}
        >
          PRIORITY ACTIONS
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {priorityActions.map((action) => {
            const priorityColor =
              action.priority === 'critical'
                ? GOD_CONFIG.voltage.high.color
                : action.priority === 'high'
                ? GOD_CONFIG.voltage.medium.color
                : GOD_CONFIG.theme.text.muted;

            return (
              <div
                key={action.id}
                style={{
                  padding: 14,
                  backgroundColor: GOD_CONFIG.theme.bg.tertiary,
                  borderRadius: 8,
                  border: `1px solid ${priorityColor}40`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      backgroundColor: `${priorityColor}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {action.category === 'check-in' && <Calendar size={16} color={priorityColor} />}
                    {action.category === 'somatic' && <Activity size={16} color={priorityColor} />}
                    {action.category === 'structural' && <CheckCircle2 size={16} color={priorityColor} />}
                    {action.category === 'metabolic' && <AlertTriangle size={16} color={priorityColor} />}
                    {action.category === 'social' && <Activity size={16} color={priorityColor} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: GOD_CONFIG.theme.text.primary,
                        marginBottom: 4,
                      }}
                    >
                      {action.label}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: GOD_CONFIG.theme.text.muted,
                        lineHeight: 1.5,
                        marginBottom: 8,
                      }}
                    >
                      {action.description}
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <span
                        style={{
                          padding: '4px 8px',
                          backgroundColor: `${priorityColor}15`,
                          borderRadius: 4,
                          fontSize: 10,
                          color: priorityColor,
                          fontFamily: GOD_CONFIG.typography.fontFamily.display,
                        }}
                      >
                        {action.priority.toUpperCase()}
                      </span>
                      {action.timeOfDay && (
                        <span
                          style={{
                            padding: '4px 8px',
                            backgroundColor: GOD_CONFIG.theme.bg.primary,
                            borderRadius: 4,
                            fontSize: 10,
                            color: GOD_CONFIG.theme.text.muted,
                            fontFamily: GOD_CONFIG.typography.fontFamily.display,
                          }}
                        >
                          {action.timeOfDay}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Status-Based Action Triggers */}
      <div
        style={{
          padding: 20,
          backgroundColor: GOD_CONFIG.theme.bg.secondary,
          borderRadius: 12,
          border: `1px solid ${GOD_CONFIG.theme.border.default}`,
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontFamily: GOD_CONFIG.typography.fontFamily.display,
            color: GOD_CONFIG.theme.text.secondary,
            marginBottom: 16,
          }}
        >
          STATUS-BASED ACTION PROTOCOLS
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: 12,
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: GOD_CONFIG.theme.bg.tertiary,
                  borderBottom: `2px solid ${GOD_CONFIG.theme.border.default}`,
                }}
              >
                <th
                  style={{
                    padding: '10px 12px',
                    textAlign: 'left',
                    fontFamily: GOD_CONFIG.typography.fontFamily.display,
                    fontWeight: 600,
                    color: GOD_CONFIG.theme.text.primary,
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    padding: '10px 12px',
                    textAlign: 'left',
                    fontFamily: GOD_CONFIG.typography.fontFamily.display,
                    fontWeight: 600,
                    color: GOD_CONFIG.theme.text.primary,
                  }}
                >
                  Trigger
                </th>
                <th
                  style={{
                    padding: '10px 12px',
                    textAlign: 'left',
                    fontFamily: GOD_CONFIG.typography.fontFamily.display,
                    fontWeight: 600,
                    color: GOD_CONFIG.theme.text.primary,
                  }}
                >
                  Action Protocol
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                style={{
                  backgroundColor: `${GOD_CONFIG.voltage.high.color}15`,
                  borderBottom: `1px solid ${GOD_CONFIG.theme.border.default}`,
                }}
              >
                <td
                  style={{
                    padding: '12px',
                    fontWeight: 600,
                    color: GOD_CONFIG.voltage.high.color,
                  }}
                >
                  Critical (&lt;25%)
                </td>
                <td style={{ padding: '12px', color: GOD_CONFIG.theme.text.primary }}>
                  Alert Orange
                </td>
                <td style={{ padding: '12px', color: GOD_CONFIG.theme.text.primary }}>
                  Gate all non-essential data; 2x Catcher's Mitt window; Mandatory Rest.
                </td>
              </tr>
              <tr
                style={{
                  backgroundColor: `${GOD_CONFIG.voltage.medium.color}15`,
                  borderBottom: `1px solid ${GOD_CONFIG.theme.border.default}`,
                }}
              >
                <td
                  style={{
                    padding: '12px',
                    fontWeight: 600,
                    color: GOD_CONFIG.voltage.medium.color,
                  }}
                >
                  Warning (26-50%)
                </td>
                <td style={{ padding: '12px', color: GOD_CONFIG.theme.text.primary }}>
                  Muted Orange
                </td>
                <td style={{ padding: '12px', color: GOD_CONFIG.theme.text.primary }}>
                  Throttled notifications; suggest 20-minute processing break; Sensory Grounding.
                </td>
              </tr>
              <tr
                style={{
                  backgroundColor: `${GOD_CONFIG.voltage.low.color}15`,
                  borderBottom: `1px solid ${GOD_CONFIG.theme.border.default}`,
                }}
              >
                <td
                  style={{
                    padding: '12px',
                    fontWeight: 600,
                    color: GOD_CONFIG.voltage.low.color,
                  }}
                >
                  Green Board (&gt;50%)
                </td>
                <td style={{ padding: '12px', color: GOD_CONFIG.theme.text.primary }}>
                  Soft Blue
                </td>
                <td style={{ padding: '12px', color: GOD_CONFIG.theme.text.primary }}>
                  Standard Protocol; standard mission operations continue.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Daily Protocol Section */}
      <div
        style={{
          padding: 20,
          backgroundColor: GOD_CONFIG.theme.bg.secondary,
          borderRadius: 12,
          border: `1px solid ${GOD_CONFIG.theme.border.default}`,
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontFamily: GOD_CONFIG.typography.fontFamily.display,
            color: GOD_CONFIG.theme.text.secondary,
            marginBottom: 16,
          }}
        >
          DAILY PROTOCOL
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div
            style={{
              padding: 12,
              backgroundColor: GOD_CONFIG.theme.bg.tertiary,
              borderRadius: 8,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: GOD_CONFIG.theme.text.primary,
                marginBottom: 4,
              }}
            >
              Somatic Check-in
            </div>
            <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.muted }}>
              Complete the 5-question diagnostic to calculate your Status Percentage (π)
            </div>
          </div>

          <div
            style={{
              padding: 12,
              backgroundColor: GOD_CONFIG.theme.bg.tertiary,
              borderRadius: 8,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: GOD_CONFIG.theme.text.primary,
                marginBottom: 4,
              }}
            >
              Voltage Check
            </div>
            <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.muted }}>
              Review the Shield's urgency scores and Spoon costs for the day's tasks
            </div>
          </div>

          <div
            style={{
              padding: 12,
              backgroundColor: GOD_CONFIG.theme.bg.tertiary,
              borderRadius: 8,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: GOD_CONFIG.theme.text.primary,
                marginBottom: 4,
              }}
            >
              Vacuum of Time
            </div>
            <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.muted }}>
              Apply the 3-second mandatory delay to all high-stakes notifications to shift to System 2 thinking
            </div>
          </div>

          <div
            style={{
              padding: 12,
              backgroundColor: GOD_CONFIG.theme.bg.tertiary,
              borderRadius: 8,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: GOD_CONFIG.theme.text.primary,
                marginBottom: 4,
              }}
            >
              Somatic Release
            </div>
            <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.muted }}>
              Execute at least one 4-4-8 breathing cycle to signal safety to the vagus nerve and prevent "Frozen
              Stillness"
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Protocol Section */}
      <div
        style={{
          padding: 20,
          backgroundColor: GOD_CONFIG.theme.bg.secondary,
          borderRadius: 12,
          border: `1px solid ${GOD_CONFIG.theme.border.default}`,
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontFamily: GOD_CONFIG.typography.fontFamily.display,
            color: GOD_CONFIG.theme.text.secondary,
            marginBottom: 16,
          }}
        >
          WEEKLY PROTOCOL
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div
            style={{
              padding: 12,
              backgroundColor: GOD_CONFIG.theme.bg.tertiary,
              borderRadius: 8,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: GOD_CONFIG.theme.text.primary,
                marginBottom: 4,
              }}
            >
              Trend Review
            </div>
            <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.muted }}>
              Analyze your 7-day π trend. If "Declining" or "Critical," the Shield automatically expands the Catcher's
              Mitt window
            </div>
          </div>

          <div
            style={{
              padding: 12,
              backgroundColor: GOD_CONFIG.theme.bg.tertiary,
              borderRadius: 8,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: GOD_CONFIG.theme.text.primary,
                marginBottom: 4,
              }}
            >
              Deep Processing Review
            </div>
            <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.muted }}>
              Process all messages gated in the Deep Processing Queue during low-resonance states
            </div>
          </div>

          <div
            style={{
              padding: 12,
              backgroundColor: GOD_CONFIG.theme.bg.tertiary,
              borderRadius: 8,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: GOD_CONFIG.theme.text.primary,
                marginBottom: 4,
              }}
            >
              Geometric Verification
            </div>
            <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.muted }}>
              Inspect the Tetrahedron for isostatic rigidity and verify the SIC-POVM symmetry (κ)
            </div>
          </div>

          <div
            style={{
              padding: 12,
              backgroundColor: GOD_CONFIG.theme.bg.tertiary,
              borderRadius: 8,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: GOD_CONFIG.theme.text.primary,
                marginBottom: 4,
              }}
            >
              Genre Error Audit
            </div>
            <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.muted }}>
              Review communication friction points to ensure you are not "Speaking Physics" to a "Poet" without the
              translation layer
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Protocol Section */}
      <div
        style={{
          padding: 20,
          backgroundColor: GOD_CONFIG.theme.bg.secondary,
          borderRadius: 12,
          border: `1px solid ${GOD_CONFIG.theme.border.default}`,
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontFamily: GOD_CONFIG.typography.fontFamily.display,
            color: GOD_CONFIG.theme.text.secondary,
            marginBottom: 16,
          }}
        >
          MONTHLY PROTOCOL
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div
            style={{
              padding: 12,
              backgroundColor: GOD_CONFIG.theme.bg.tertiary,
              borderRadius: 8,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: GOD_CONFIG.theme.text.primary,
                marginBottom: 4,
              }}
            >
              Kenosis Audit
            </div>
            <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.muted }}>
              Verify that administrative keys remain destroyed and that power is decentralized via the G.O.D. DAO
            </div>
          </div>

          <div
            style={{
              padding: 12,
              backgroundColor: GOD_CONFIG.theme.bg.tertiary,
              borderRadius: 8,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: GOD_CONFIG.theme.text.primary,
                marginBottom: 4,
              }}
            >
              Coordinate Check
            </div>
            <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.muted }}>
              Teleport the observation window to a new coordinate in the Universal ROM lattice to ensure stability via
              Samson's Law
            </div>
          </div>

          <div
            style={{
              padding: 12,
              backgroundColor: GOD_CONFIG.theme.bg.tertiary,
              borderRadius: 8,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: GOD_CONFIG.theme.text.primary,
                marginBottom: 4,
              }}
            >
              Mesh Verification
            </div>
            <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.muted }}>
              Test the Phenix Navigator peer-to-peer connection to ensure the mesh survives if the "Wye" fails
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Calendar View */}
      {checkInHistory.length > 0 && (
        <div
          style={{
            padding: 20,
            backgroundColor: GOD_CONFIG.theme.bg.secondary,
            borderRadius: 12,
            border: `1px solid ${GOD_CONFIG.theme.border.default}`,
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontFamily: GOD_CONFIG.typography.fontFamily.display,
              color: GOD_CONFIG.theme.text.secondary,
              marginBottom: 16,
            }}
          >
            7-DAY STATUS HISTORY
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {checkInHistory.slice(0, 7).map((checkIn, index) => {
              const date = new Date(checkIn.timestamp);
              const isToday = checkIn.date === todayCheckIn?.date;
              const color = getStatusColor(checkIn.percentage);

              return (
                <div
                  key={checkIn.timestamp}
                  style={{
                    padding: 12,
                    backgroundColor: GOD_CONFIG.theme.bg.tertiary,
                    borderRadius: 8,
                    border: isToday ? `2px solid ${color}40` : `1px solid ${GOD_CONFIG.theme.border.default}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: GOD_CONFIG.theme.text.primary,
                        marginBottom: 2,
                      }}
                    >
                      {isToday ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: GOD_CONFIG.theme.text.muted,
                      }}
                    >
                      {checkIn.status.label}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      fontFamily: GOD_CONFIG.typography.fontFamily.display,
                      color: color,
                    }}
                  >
                    {Math.round(checkIn.percentage)}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Daily Check-In Modal */}
      {showCheckIn && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 20,
          }}
        >
          <div
            style={{
              backgroundColor: GOD_CONFIG.theme.bg.primary,
              borderRadius: 12,
              maxWidth: 600,
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
            }}
          >
            <DailyCheckIn
              onComplete={() => {
                setShowCheckIn(false);
              }}
              onClose={() => setShowCheckIn(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default MeshMaintenance;

