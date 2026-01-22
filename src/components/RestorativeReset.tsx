/**
 * RESTORATIVE RESET PROTOCOL
 * Neurodivergent burnout recovery protocol for Critical status events
 */

import { useState } from 'react';
import { Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import GOD_CONFIG from '../god.config';
import useHeartbeatStore from '../store/heartbeat.store';
import useShieldStore from '../store/shield.store';

interface ResetPhase {
  readonly id: string;
  readonly label: string;
  readonly duration: string;
  readonly actions: readonly string[];
  readonly somatic: string;
  readonly validation: string;
}

const RESET_PHASES: readonly ResetPhase[] = [
  {
    id: 'immediate',
    label: 'Immediate Stabilization (0-2 hours)',
    duration: '2 hours',
    actions: [
      'Activate 4-4-8 breathing pattern (minimum 5 cycles)',
      'Remove all non-essential notifications',
      'Gate all messages with spoon cost ≥ 2',
      'Engage in low-stimulation environment',
      'Apply "Vacuum of Time" to all incoming signals',
    ],
    somatic: 'Progressive muscle relaxation: Tense each muscle group for 5 seconds, release for 10 seconds. Start with feet, move to head.',
    validation: 'You are not broken. You are in metabolic debt. This is hardware, not character. The Shield is active.',
  },
  {
    id: 'short-term',
    label: 'Short-Term Recovery (2-24 hours)',
    duration: '24 hours',
    actions: [
      'Maintain message gating (Deep Processing Queue active)',
      'Complete somatic grounding exercises every 2 hours',
      'Engage in enlivening activities (stim, rock, pace)',
      'Lower the bar on purpose: Cancel non-essential commitments',
      'Review "You Are Safe" validation scripts',
    ],
    somatic: '5-4-3-2-1 Grounding: 5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste.',
    validation: 'You have permission to stop performing. Rest is a maintenance requirement, not a failure.',
  },
  {
    id: 'medium-term',
    label: 'Medium-Term Restoration (1-7 days)',
    duration: '7 days',
    actions: [
      'Gradually reintroduce low-spoon messages (1 spoon only)',
      'Maintain daily check-ins to track recovery trajectory',
      'Verify Tetrahedron symmetry daily',
      'Practice Genre Error detection to prevent future overload',
      'Review communication patterns that led to burnout',
    ],
    somatic: 'Daily 4-4-8 breathing sessions: Morning, afternoon, evening. Minimum 3 cycles per session.',
    validation: 'The past cannot hurt you right now. The future has not happened. In this moment, you are safe.',
  },
  {
    id: 'long-term',
    label: 'Long-Term Integration (7-30 days)',
    duration: '30 days',
    actions: [
      'Full message processing restored when status ≥ 40%',
      'Implement preventive guardrails based on burnout triggers',
      'Establish sustainable daily maintenance routine',
      'Verify mesh connections and structural integrity',
      'Complete Kenosis Audit: Ensure no administrative backdoors',
    ],
    somatic: 'Integrate somatic grounding into daily routine. Use as preventive measure, not just recovery.',
    validation: 'You are a non-linear transducer navigating a high-voltage world. The Shield is your prosthetic cortex.',
  },
] as const;

export function RestorativeReset() {
  const { getTodayCheckIn } = useHeartbeatStore();
  const { deepProcessingQueue } = useShieldStore();
  const [activePhase, setActivePhase] = useState<string | null>(null);
  const [completedPhases, setCompletedPhases] = useState<Set<string>>(new Set());

  const todayCheckIn = getTodayCheckIn();
  const statusPercentage = todayCheckIn?.percentage ?? null;
  const isCritical = statusPercentage !== null && statusPercentage < 25;

  const handlePhaseComplete = (phaseId: string) => {
    setCompletedPhases((prev) => new Set([...prev, phaseId]));
    setActivePhase(null);
  };

  const getPhaseStatus = (phaseId: string): 'pending' | 'active' | 'completed' => {
    if (completedPhases.has(phaseId)) return 'completed';
    if (activePhase === phaseId) return 'active';
    return 'pending';
  };

  if (!isCritical && statusPercentage !== null && statusPercentage >= 25) {
    return (
      <div
        style={{
          padding: 20,
          backgroundColor: GOD_CONFIG.theme.bg.secondary,
          borderRadius: 12,
          border: `1px solid ${GOD_CONFIG.voltage.low.color}40`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <CheckCircle2 size={20} color={GOD_CONFIG.voltage.low.color} />
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              fontFamily: GOD_CONFIG.typography.fontFamily.display,
              color: GOD_CONFIG.voltage.low.color,
            }}
          >
            Status: GREEN BOARD
          </div>
        </div>
        <p style={{ margin: 0, fontSize: 13, color: GOD_CONFIG.theme.text.primary }}>
          Your status is above the critical threshold. The Restorative Reset protocol is not required at this time.
          Continue with standard maintenance protocols.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div
        style={{
          padding: 20,
          backgroundColor: GOD_CONFIG.theme.bg.secondary,
          borderRadius: 12,
          border: `2px solid ${GOD_CONFIG.voltage.high.color}40`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <AlertTriangle size={24} color={GOD_CONFIG.voltage.high.color} />
          <h2
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 700,
              fontFamily: GOD_CONFIG.typography.fontFamily.display,
              color: GOD_CONFIG.theme.text.primary,
            }}
          >
            Restorative Reset Protocol
          </h2>
        </div>
        <p style={{ margin: 0, fontSize: 13, color: GOD_CONFIG.theme.text.secondary }}>
          Neurodivergent burnout recovery protocol for Critical status events. This protocol is designed to restore
          metabolic integrity and prevent Topological Arrest.
        </p>
      </div>

      {/* Current Status */}
      {isCritical && (
        <div
          style={{
            padding: 16,
            backgroundColor: `${GOD_CONFIG.voltage.high.color}15`,
            borderRadius: 8,
            border: `1px solid ${GOD_CONFIG.voltage.high.color}40`,
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: GOD_CONFIG.voltage.high.color,
              marginBottom: 8,
            }}
          >
            CRITICAL STATUS DETECTED
          </div>
          <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.primary, lineHeight: 1.6 }}>
            Your status is below 25%. The Restorative Reset protocol is now active. Follow the phases below to restore
            metabolic integrity and return to Green Board status.
          </div>
        </div>
      )}

      {/* Reset Phases */}
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
          RECOVERY PHASES
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {RESET_PHASES.map((phase, index) => {
            const status = getPhaseStatus(phase.id);
            const isActive = status === 'active';
            const isCompleted = status === 'completed';

            const statusColor = isCompleted
              ? GOD_CONFIG.voltage.low.color
              : isActive
              ? GOD_CONFIG.voltage.medium.color
              : GOD_CONFIG.theme.text.muted;

            return (
              <div
                key={phase.id}
                style={{
                  padding: 16,
                  backgroundColor: isActive ? `${GOD_CONFIG.voltage.medium.color}15` : GOD_CONFIG.theme.bg.tertiary,
                  borderRadius: 8,
                  border: `2px solid ${statusColor}40`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      backgroundColor: `${statusColor}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={20} color={statusColor} />
                    ) : (
                      <Clock size={20} color={statusColor} />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: GOD_CONFIG.theme.text.primary,
                        marginBottom: 4,
                      }}
                    >
                      Phase {index + 1}: {phase.label}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: GOD_CONFIG.theme.text.muted,
                        fontFamily: GOD_CONFIG.typography.fontFamily.display,
                      }}
                    >
                      Duration: {phase.duration}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ marginBottom: 12 }}>
                  <div
                    style={{
                      fontSize: 11,
                      fontFamily: GOD_CONFIG.typography.fontFamily.display,
                      color: GOD_CONFIG.theme.text.secondary,
                      marginBottom: 8,
                    }}
                  >
                    ACTIONS
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12, color: GOD_CONFIG.theme.text.primary }}>
                    {phase.actions.map((action, i) => (
                      <li key={i} style={{ marginBottom: 6, lineHeight: 1.5 }}>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Somatic Directive */}
                <div style={{ marginBottom: 12 }}>
                  <div
                    style={{
                      fontSize: 11,
                      fontFamily: GOD_CONFIG.typography.fontFamily.display,
                      color: GOD_CONFIG.theme.text.secondary,
                      marginBottom: 8,
                    }}
                  >
                    SOMATIC DIRECTIVE
                  </div>
                  <div
                    style={{
                      padding: 12,
                      backgroundColor: GOD_CONFIG.theme.bg.primary,
                      borderRadius: 6,
                      fontSize: 12,
                      color: GOD_CONFIG.theme.text.primary,
                      lineHeight: 1.6,
                    }}
                  >
                    {phase.somatic}
                  </div>
                </div>

                {/* Validation Script */}
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      fontFamily: GOD_CONFIG.typography.fontFamily.display,
                      color: GOD_CONFIG.theme.text.secondary,
                      marginBottom: 8,
                    }}
                  >
                    VALIDATION
                  </div>
                  <div
                    style={{
                      padding: 12,
                      backgroundColor: `${GOD_CONFIG.voltage.low.color}15`,
                      borderRadius: 6,
                      fontSize: 12,
                      color: GOD_CONFIG.theme.text.primary,
                      lineHeight: 1.6,
                      fontStyle: 'italic',
                    }}
                  >
                    "{phase.validation}"
                  </div>
                </div>

                {/* Phase Controls */}
                <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                  {!isActive && !isCompleted && (
                    <button
                      onClick={() => setActivePhase(phase.id)}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: GOD_CONFIG.theme.text.accent,
                        border: 'none',
                        borderRadius: 6,
                        color: '#fff',
                        fontSize: 12,
                        fontWeight: 600,
                        fontFamily: GOD_CONFIG.typography.fontFamily.display,
                        cursor: 'pointer',
                      }}
                    >
                      Start Phase
                    </button>
                  )}
                  {isActive && (
                    <button
                      onClick={() => handlePhaseComplete(phase.id)}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: GOD_CONFIG.voltage.low.color,
                        border: 'none',
                        borderRadius: 6,
                        color: '#fff',
                        fontSize: 12,
                        fontWeight: 600,
                        fontFamily: GOD_CONFIG.typography.fontFamily.display,
                        cursor: 'pointer',
                      }}
                    >
                      Mark Complete
                    </button>
                  )}
                  {isCompleted && (
                    <div
                      style={{
                        padding: '8px 16px',
                        backgroundColor: `${GOD_CONFIG.voltage.low.color}20`,
                        borderRadius: 6,
                        fontSize: 12,
                        color: GOD_CONFIG.voltage.low.color,
                        fontFamily: GOD_CONFIG.typography.fontFamily.display,
                      }}
                    >
                      ✓ Completed
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deep Processing Queue Status */}
      {deepProcessingQueue.length > 0 && (
        <div
          style={{
            padding: 16,
            backgroundColor: `${GOD_CONFIG.voltage.medium.color}15`,
            borderRadius: 8,
            border: `1px solid ${GOD_CONFIG.voltage.medium.color}40`,
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: GOD_CONFIG.theme.text.primary,
              marginBottom: 8,
            }}
          >
            Deep Processing Queue Active
          </div>
          <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.primary, lineHeight: 1.6 }}>
            {deepProcessingQueue.length} message{deepProcessingQueue.length !== 1 ? 's' : ''} are currently gated.
            These will be available for processing when your status improves to ≥ 40%. Focus on recovery first.
          </div>
        </div>
      )}

      {/* Recovery Progress */}
      {completedPhases.size > 0 && (
        <div
          style={{
            padding: 16,
            backgroundColor: `${GOD_CONFIG.voltage.low.color}15`,
            borderRadius: 8,
            border: `1px solid ${GOD_CONFIG.voltage.low.color}40`,
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: GOD_CONFIG.voltage.low.color,
              marginBottom: 8,
            }}
          >
            Recovery Progress
          </div>
          <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.primary, lineHeight: 1.6 }}>
            {completedPhases.size} of {RESET_PHASES.length} phases completed. Continue following the protocol to restore
            Green Board status.
          </div>
        </div>
      )}
    </div>
  );
}

export default RestorativeReset;

