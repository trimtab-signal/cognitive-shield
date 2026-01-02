/**
 * DAILY CHECK-IN TYPE DEFINITIONS
 * Local-only personal well-being assessment with π-Metric scoring
 */

import type { HeartbeatStatus } from './heartbeat.types';

export type CheckInCategory = 'energy' | 'sensory' | 'emotional' | 'social' | 'burnout';

export interface CheckInQuestion {
  readonly id: string;
  readonly category: CheckInCategory;
  readonly label: string;
  readonly description?: string;
  readonly min: number;
  readonly max: number;
  readonly type: 'slider' | 'number';
  readonly weight?: number; // For future use, not used in π-Metric
}

export interface CheckInResponse {
  readonly questionId: string;
  readonly value: number;
  readonly normalized: number; // 0-1 range
}

export interface DailyCheckIn {
  readonly id: string;
  readonly timestamp: number;
  readonly date: string; // YYYY-MM-DD format
  readonly responses: readonly CheckInResponse[];
  readonly percentage: number; // 0-100
  readonly resonance: number; // 0-1, raw resonance score
  readonly status: HeartbeatStatus; // Derived from percentage
}

export interface CheckInHistory {
  readonly entries: readonly DailyCheckIn[];
  readonly averagePercentage: number;
  readonly trend: 'improving' | 'stable' | 'declining';
}

