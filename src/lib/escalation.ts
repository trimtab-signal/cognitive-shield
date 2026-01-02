/**
 * ESCALATION LAYER
 * Webhook-based emergency alert system
 */

import type { EscalationPayload, HeartbeatStatus } from '../types/heartbeat.types';
import GOD_CONFIG from '../god.config';

export interface EscalationResult {
  success: boolean;
  error?: string;
  timestamp: number;
}

/**
 * Send escalation webhook
 */
export async function sendEscalationWebhook(
  webhookUrl: string,
  payload: EscalationPayload
): Promise<EscalationResult> {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...payload,
        source: 'Cognitive Shield',
        version: GOD_CONFIG.version,
      }),
    });

    if (!response.ok) {
      throw new Error(`Webhook returned ${response.status}: ${response.statusText}`);
    }

    return {
      success: true,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('[Escalation] Webhook failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: Date.now(),
    };
  }
}

/**
 * Format escalation message for human-readable alerts
 */
export function formatEscalationMessage(payload: EscalationPayload): string {
  const statusConfig = GOD_CONFIG.heartbeat.statuses[payload.status];
  const lastCheckIn = payload.lastCheckIn
    ? new Date(payload.lastCheckIn).toLocaleString()
    : 'Never';

  return `
🚨 COGNITIVE SHIELD ESCALATION ALERT

User: ${payload.userName}
Status: ${statusConfig.label} (${statusConfig.meaning})
Last Check-In: ${lastCheckIn}
Missed Check-Ins: ${payload.missedCheckIns}
Timestamp: ${new Date(payload.timestamp).toLocaleString()}
${payload.location ? `Location: ${payload.location}` : ''}
${payload.note ? `Note: ${payload.note}` : ''}

This is an automated alert from the Cognitive Shield Heartbeat Protocol.
If you receive this, the user may need support or intervention.
`.trim();
}

/**
 * Determine if escalation should trigger based on status and missed check-ins
 */
export function shouldEscalate(
  status: HeartbeatStatus,
  missedCheckIns: number
): boolean {
  const statusConfig = GOD_CONFIG.heartbeat.statuses[status];

  if (!statusConfig.autoEscalate) {
    return false;
  }

  if (status === 'red') {
    // SOS - escalate immediately
    return true;
  }

  if (status === 'orange') {
    // Need support - escalate after threshold
    return missedCheckIns >= (statusConfig.escalateAfterMissed || 2);
  }

  // Check general thresholds
  const thresholds = GOD_CONFIG.heartbeat.escalationThresholds;
  return missedCheckIns >= thresholds.thirdMiss;
}

/**
 * Get escalation urgency level
 */
export function getEscalationUrgency(
  status: HeartbeatStatus,
  missedCheckIns: number
): 'low' | 'medium' | 'high' | 'critical' {
  if (status === 'red') return 'critical';
  if (status === 'orange' && missedCheckIns >= 2) return 'high';
  if (missedCheckIns >= 3) return 'high';
  if (missedCheckIns >= 2) return 'medium';
  return 'low';
}

