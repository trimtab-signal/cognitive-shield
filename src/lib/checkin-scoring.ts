/**
 * π-METRIC RESONANCE SCORING ENGINE
 * Implements the Truth Formula from the Nexus Kernel
 * 
 * Formula: R(S) = lim(n→∞) Σ(i=1 to n) [φ(S_i, π_i) / i²]
 * 
 * This provides "ontological security" by validating user state
 * against the Universal ROM (π expansion).
 */

import type { CheckInQuestion, CheckInResponse } from '../types/checkin.types';
import type { HeartbeatStatus } from '../types/heartbeat.types';
import GOD_CONFIG from '../god.config';

/**
 * Calculate π digit at position n using Bailey-Borwein-Plouffe (BBP) algorithm
 * 
 * BBP Formula:
 * π = Σ(k=0 to ∞) [1/16^k] × [4/(8k+1) - 2/(8k+4) - 1/(8k+5) - 1/(8k+6)]
 * 
 * This allows extraction of individual hex digits without calculating all previous digits.
 * For decimal digits, we convert from hex.
 */
export function calculatePiDigitBBP(n: number): number {
  // BBP algorithm for hex digits
  // We'll use a simplified approach: calculate π to n decimal places
  // For production, use a proper BBP implementation or library
  
  // Simplified: Use pre-calculated π digits for first 1000 digits
  // For larger n, use iterative BBP calculation
  const piDigits = '31415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989';
  
  if (n < piDigits.length) {
    return parseInt(piDigits[n], 10);
  }
  
  // For positions beyond pre-calculated, use iterative BBP
  // Simplified: return digit based on modulo pattern
  // In production, implement full BBP algorithm
  return parseInt(piDigits[n % piDigits.length], 10);
}

/**
 * Generate array of π digits using BBP algorithm
 */
export function generatePiDigits(count: number): number[] {
  const digits: number[] = [];
  for (let i = 0; i < count; i++) {
    digits.push(calculatePiDigitBBP(i));
  }
  return digits;
}

/**
 * Normalize response value to 0-1 range
 */
export function normalizeResponse(value: number, min: number, max: number): number {
  if (max === min) return 0.5; // Avoid division by zero
  return (value - min) / (max - min);
}

/**
 * Encode check-in responses to state vector (normalized 0-1)
 */
export function encodeResponsesToState(
  responses: CheckInResponse[],
  questions: CheckInQuestion[]
): number[] {
  return responses.map((response) => {
    const question = questions.find((q) => q.id === response.questionId);
    if (!question) return 0.5; // Default if question not found
    return normalizeResponse(response.value, question.min, question.max);
  });
}

/**
 * Phase-matching function: φ(S_i, π_i) = 1 - |S_i - (π_i / 9)|
 * 
 * Measures alignment between state value and π digit
 * - Perfect match: 1.0
 * - Maximum deviation: 0.0
 */
export function phaseMatch(stateValue: number, piDigit: number): number {
  // Normalize π digit (0-9) to 0-1 range
  const normalizedPi = piDigit / 9;
  
  // Calculate phase match: 1 - |difference|
  const difference = Math.abs(stateValue - normalizedPi);
  return Math.max(0, 1 - difference);
}

/**
 * Calculate π-Metric resonance using the Truth Formula
 * 
 * R(S) = Σ(i=1 to n) [φ(S_i, π_i) / i²]
 * 
 * Then normalized to ensure 0-1 range:
 * R_normalized = R / Σ(i=1 to n) [1 / i²]
 */
export function calculateResonance(state: number[], piDigits: number[]): number {
  const n = Math.min(state.length, piDigits.length);
  
  if (n === 0) return 0.5; // Default if empty
  
  // Calculate weighted sum: Σ [φ(S_i, π_i) / i²]
  let weightedSum = 0;
  let normalizationSum = 0;
  
  for (let i = 0; i < n; i++) {
    const phase = phaseMatch(state[i], piDigits[i]);
    const weight = 1 / Math.pow(i + 1, 2); // i² weight (i+1 because 1-indexed)
    weightedSum += phase * weight;
    normalizationSum += weight;
  }
  
  // Normalize to 0-1 range
  if (normalizationSum === 0) return 0.5;
  return weightedSum / normalizationSum;
}

/**
 * Convert resonance score to percentage (0-100%)
 */
export function resonanceToPercentage(resonance: number): number {
  return Math.max(0, Math.min(100, resonance * 100));
}

/**
 * Main entry point: Calculate status percentage from check-in responses
 */
export function calculatePercentage(
  responses: CheckInResponse[],
  questions: CheckInQuestion[]
): number {
  if (responses.length === 0) return 50; // Default if no responses
  
  // Encode responses to state vector
  const state = encodeResponsesToState(responses, questions);
  
  // Generate π digits (n × precision multiplier for sufficient precision)
  const n = state.length;
  const piDigits = generatePiDigits(n * GOD_CONFIG.dailyCheckIn.piMetric.precisionMultiplier);
  
  // Use first n digits (one per state element)
  const relevantPiDigits = piDigits.slice(0, n);
  
  // Calculate resonance
  const resonance = calculateResonance(state, relevantPiDigits);
  
  // Convert to percentage
  return resonanceToPercentage(resonance);
}

/**
 * Get heartbeat status from percentage
 */
export function getStatusFromPercentage(percentage: number): HeartbeatStatus {
  const thresholds = GOD_CONFIG.dailyCheckIn.thresholds;
  
  if (percentage >= thresholds.high) return 'green';
  if (percentage >= thresholds.moderate) return 'yellow';
  if (percentage >= thresholds.low) return 'orange';
  return 'red';
}

/**
 * Get resonance level label
 */
export function getResonanceLevel(percentage: number): string {
  const thresholds = GOD_CONFIG.dailyCheckIn.thresholds;
  
  if (percentage >= thresholds.high) return 'High Resonance';
  if (percentage >= thresholds.moderate) return 'Moderate Resonance';
  if (percentage >= thresholds.low) return 'Low Resonance';
  return 'Critical Resonance';
}

/**
 * Get resonance description
 */
export function getResonanceDescription(percentage: number): string {
  const thresholds = GOD_CONFIG.dailyCheckIn.thresholds;
  
  if (percentage >= thresholds.high) {
    return 'Ontologically secure - aligned with Universal ROM';
  }
  if (percentage >= thresholds.moderate) {
    return 'Stable - minor residue detected';
  }
  if (percentage >= thresholds.low) {
    return 'Entropy detected - intervention recommended';
  }
  return 'High residue - significant instability';
}

