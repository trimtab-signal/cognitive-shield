/**
 * TONE METER
 * Detects emotional tone and triggers Genre Error detection
 */

import type { ProcessedPayload } from '../types/shield.types';
import GOD_CONFIG from '../god.config';

export type ToneLevel = 'calm' | 'affection' | 'anxiety' | 'hostility';

export interface ToneAnalysis {
  readonly level: ToneLevel;
  readonly intensity: number; // 0-1
  readonly genreError: boolean; // True if Physics/Poetics mismatch detected
  readonly genreErrorType?: 'physics-poetics' | 'high-low-arousal' | 'cognitive-impedance';
  readonly message: string; // Validation script message
}

/**
 * Analyze tone from processed payload
 */
export function analyzeTone(payload: ProcessedPayload): ToneAnalysis {
  const voltage = payload.voltage;
  const emotionalValence = payload.emotionalValence;

  // Determine tone level (using 1-10 voltage scale)
  let level: ToneLevel = 'calm';
  if (voltage > 6.6 || emotionalValence === 'hostility') {
    level = 'hostility';
  } else if (voltage > 3.3 || emotionalValence === 'anxiety') {
    level = 'anxiety';
  } else if (emotionalValence === 'affection') {
    level = 'affection';
  }

  // Detect Genre Error (using 1-10 voltage scale)
  // High-arousal hostility vs low-arousal technical data = mismatch
  const genreError =
    (voltage > 6.6 && payload.humanOS === 'order') || // High emotion + Order OS = Physics/Poetics mismatch
    (voltage < 2.0 && payload.humanOS === 'empath') || // Low emotion + Empath OS = potential mismatch
    (voltage > 5.0 && payload.triggers.length === 0); // High voltage but no triggers = cognitive impedance

  let genreErrorType: ToneAnalysis['genreErrorType'] = undefined;
  let message = '';

  if (genreError) {
    if (voltage > 6.6 && payload.humanOS === 'order') {
      genreErrorType = 'physics-poetics';
      message = 'A Genre Error has been detected. You are speaking Physics; the sender is speaking Poetics. The disconnect is bidirectional—the Double Empathy Problem. Neither party is "wrong."';
    } else if (voltage < 2.0 && payload.humanOS === 'empath') {
      genreErrorType = 'high-low-arousal';
      message = 'A Genre Error has been detected. The sender is operating in low-arousal mode (Physics) while you are in high-arousal mode (Poetics). This is a cognitive impedance mismatch, not a personal attack.';
    } else {
      genreErrorType = 'cognitive-impedance';
      message = 'A Genre Error has been detected. Cognitive Impedance Mismatch detected. The Kernel of truth was rejected because the Driver was incompatible. This is a protocol error, not a personal attack.';
    }
  }

  return {
    level,
    intensity: voltage,
    genreError,
    genreErrorType,
    message,
  };
}

/**
 * Get color for tone level (Plutchik-aligned)
 */
export function getToneColor(level: ToneLevel): string {
  return GOD_CONFIG.emotionalValence[level]?.color || GOD_CONFIG.theme.text.muted;
}

