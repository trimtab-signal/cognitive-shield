/**
 * L.O.V.E. PROTOCOL - Ledger of Ontological Volume and Entropy
 * Algorithmic Economics of Care - Proof of Care Consensus Mechanism
 *
 * "Financializing emotional labor without surveillance capitalism"
 *
 * Core Components:
 * - Care Score: Σ(T_prox × Q_res) + Tasks_verified
 * - Time Proximity (T_prox): Bluetooth RSSI proximity detection
 * - Quality Resonance (Q_res): HRV synchronization at 0.1 Hz
 * - Zero-Knowledge Proofs: Bulletproofs for privacy preservation
 * - Pedersen Commitments: Data hiding while maintaining verifiability
 * - Dynamic Equity Distribution: Care-based token allocation
 */

import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex, hexToBytes, concatBytes } from '@noble/hashes/utils';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════════

/** Care event types */
export enum CareEventType {
  PROXIMITY = 'proximity',
  RESONANCE = 'resonance',
  TASK_COMPLETION = 'task_completion',
  EMOTIONAL_SUPPORT = 'emotional_support',
  PHYSICAL_CARE = 'physical_care'
}

/** Quality Resonance states */
export enum ResonanceState {
  CHAOS = 'chaos',     // High entropy, low coherence
  TURBULENT = 'turbulent', // Moderate entropy
  GREEN = 'green',     // Low entropy, high coherence (0.1 Hz HRV sync)
  FLOW = 'flow'        // Optimal resonance state
}

/** Proximity measurement via Bluetooth RSSI */
export interface ProximityMeasurement {
  /** Device ID of the care receiver */
  receiverId: string;
  /** Device ID of the caregiver */
  caregiverId: string;
  /** RSSI value in dBm (-30 to -75 for proximity) */
  rssi: number;
  /** Timestamp of measurement */
  timestamp: number;
  /** Zero-knowledge proof of proximity */
  proximityProof: ZKProof;
}

/** Quality Resonance measurement via HRV */
export interface ResonanceMeasurement {
  /** Device ID of the individual */
  deviceId: string;
  /** Heart Rate Variability in ms */
  hrv: number;
  /** Coherence frequency (target: 0.1 Hz) */
  coherenceFrequency: number;
  /** Resonance state */
  state: ResonanceState;
  /** Timestamp of measurement */
  timestamp: number;
  /** Zero-knowledge proof of coherence */
  resonanceProof: ZKProof;
}

/** Zero-Knowledge Proof structure */
export interface ZKProof {
  /** Pedersen commitment to the data */
  commitment: string; // Hex string
  /** Bulletproof range proof */
  rangeProof: string; // Hex string
  /** Public parameters for verification */
  publicParams: {
    /** Generator point g */
    g: string;
    /** Generator point h */
    h: string;
    /** Modulus p */
    p: string;
  };
}

/** Care event record */
export interface CareEvent {
  /** Unique event ID */
  id: string;
  /** Event type */
  type: CareEventType;
  /** Caregiver device ID */
  caregiverId: string;
  /** Care receiver device ID */
  receiverId: string;
  /** Time Proximity score (0-1) */
  timeProximity: number;
  /** Quality Resonance multiplier (0-2) */
  qualityResonance: number;
  /** Base care points for this event */
  basePoints: number;
  /** Calculated care score for this event */
  careScore: number;
  /** Timestamp */
  timestamp: number;
  /** ZK proofs for privacy */
  proofs: {
    proximity?: ZKProof;
    resonance?: ZKProof;
  };
  /** Verification status */
  verified: boolean;
}

/** Care score aggregation */
export interface CareScore {
  /** Caregiver ID */
  caregiverId: string;
  /** Total care score for current period */
  totalScore: number;
  /** Breakdown by event type */
  byType: Record<CareEventType, number>;
  /** Time-weighted average */
  timeWeightedAverage: number;
  /** Last updated timestamp */
  lastUpdated: number;
  /** Equity percentage in DAO */
  equityPercentage: number;
}

/** Task verification record */
export interface TaskVerification {
  /** Task ID */
  taskId: string;
  /** Task description */
  description: string;
  /** Task difficulty multiplier */
  difficulty: number;
  /** Verification method */
  verificationMethod: 'self_report' | 'peer_verify' | 'sensor_verify';
  /** ZK proof of completion */
  completionProof: ZKProof;
  /** Timestamp */
  timestamp: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

/** Proximity detection parameters */
const PROXIMITY_CONFIG = {
  /** RSSI range for proximity detection (dBm) */
  RSSI_RANGE: { min: -75, max: -30 } as const,
  /** Target proximity distance (meters) */
  TARGET_DISTANCE: 5,
  /** Proximity score calculation */
  PROXIMITY_SCORE: (rssi: number): number => {
    const range = PROXIMITY_CONFIG.RSSI_RANGE;
    if (rssi > range.max) return 1.0; // Very close
    if (rssi < range.min) return 0.0; // Too far
    return (rssi - range.min) / (range.max - range.min);
  }
};

/** Resonance detection parameters */
const RESONANCE_CONFIG = {
  /** Target coherence frequency (Hz) */
  TARGET_FREQUENCY: 0.1,
  /** Acceptable frequency deviation (Hz) */
  FREQUENCY_TOLERANCE: 0.02,
  /** Quality resonance multiplier */
  RESONANCE_MULTIPLIER: (state: ResonanceState): number => {
    switch (state) {
      case ResonanceState.CHAOS: return 0.5;
      case ResonanceState.TURBULENT: return 0.8;
      case ResonanceState.GREEN: return 1.5; // Optimal state
      case ResonanceState.FLOW: return 2.0; // Peak performance
      default: return 1.0;
    }
  }
};

/** Care scoring parameters */
const CARE_SCORING = {
  /** Base points per event type */
  BASE_POINTS: {
    [CareEventType.PROXIMITY]: 1,
    [CareEventType.RESONANCE]: 2,
    [CareEventType.TASK_COMPLETION]: 5,
    [CareEventType.EMOTIONAL_SUPPORT]: 3,
    [CareEventType.PHYSICAL_CARE]: 4
  } as const,
  /** Time decay factor (half-life in hours) */
  TIME_DECAY_HOURS: 168, // 1 week
  /** Equity distribution smoothing factor */
  EQUITY_SMOOTHING: 0.1
};

// ═══════════════════════════════════════════════════════════════════════════════
// ZERO-KNOWLEDGE PROOF IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Simplified ZK proof implementation for range proofs
 * In production, this would use Bulletproofs library
 */
class ZKProver {
  /** Large prime modulus for Pedersen commitments */
  private static readonly P = 2n ** 256n - 2n ** 32n - 977n;

  /** Generator g */
  private static readonly G = 2n;

  /** Generator h */
  private static readonly H = 3n;

  /**
   * Generate Pedersen commitment: C = g^value * h^blinding
   */
  static generateCommitment(value: number, blinding: bigint = 0n): ZKProof {
    const valueBigInt = BigInt(value);
    const commitment = this.modPow(this.G, valueBigInt) * this.modPow(this.H, blinding) % this.P;

    return {
      commitment: commitment.toString(16).padStart(64, '0'),
      rangeProof: 'simplified_range_proof', // In production: actual Bulletproof
      publicParams: {
        g: this.G.toString(),
        h: this.H.toString(),
        p: this.P.toString()
      }
    };
  }

  /**
   * Verify range proof (simplified)
   */
  static verifyRangeProof(proof: ZKProof, min: number, max: number): boolean {
    // In production: verify the actual Bulletproof
    // For now, just check that commitment is valid hex
    try {
      hexToBytes(proof.commitment);
      return proof.commitment.length === 64;
    } catch {
      return false;
    }
  }

  private static modPow(base: bigint, exp: bigint): bigint {
    let result = 1n;
    base = base % this.P;
    while (exp > 0n) {
      if (exp % 2n === 1n) {
        result = (result * base) % this.P;
      }
      base = (base * base) % this.P;
      exp /= 2n;
    }
    return result;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// L.O.V.E. PROTOCOL CORE IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * L.O.V.E. Protocol - Main implementation class
 */
export class LoveProtocol {
  private careEvents: Map<string, CareEvent[]> = new Map();
  private careScores: Map<string, CareScore> = new Map();
  private taskVerifications: TaskVerification[] = [];

  /**
   * Record a proximity-based care event
   */
  recordProximityEvent(measurement: ProximityMeasurement): CareEvent {
    // Verify proximity proof
    const proximityValid = ZKProver.verifyRangeProof(
      measurement.proximityProof,
      PROXIMITY_CONFIG.RSSI_RANGE.min,
      PROXIMITY_CONFIG.RSSI_RANGE.max
    );

    if (!proximityValid) {
      throw new Error('Invalid proximity proof');
    }

    // Calculate care score
    const timeProximity = PROXIMITY_CONFIG.PROXIMITY_SCORE(measurement.rssi);
    const qualityResonance = 1.0; // Base resonance for proximity
    const basePoints = CARE_SCORING.BASE_POINTS[CareEventType.PROXIMITY];
    const careScore = timeProximity * qualityResonance * basePoints;

    const event: CareEvent = {
      id: this.generateEventId(),
      type: CareEventType.PROXIMITY,
      caregiverId: measurement.caregiverId,
      receiverId: measurement.receiverId,
      timeProximity,
      qualityResonance,
      basePoints,
      careScore,
      timestamp: measurement.timestamp,
      proofs: { proximity: measurement.proximityProof },
      verified: true
    };

    this.storeCareEvent(event);
    this.updateCareScore(event.caregiverId);

    return event;
  }

  /**
   * Record a resonance-based care event
   */
  recordResonanceEvent(measurement: ResonanceMeasurement): CareEvent {
    // Verify resonance proof
    const resonanceValid = ZKProver.verifyRangeProof(
      measurement.resonanceProof,
      0, // Min HRV (simplified)
      200 // Max HRV (simplified)
    );

    if (!resonanceValid) {
      throw new Error('Invalid resonance proof');
    }

    // Calculate quality resonance multiplier
    const qualityResonance = RESONANCE_CONFIG.RESONANCE_MULTIPLIER(measurement.state);
    const timeProximity = 1.0; // Resonance is always "present"
    const basePoints = CARE_SCORING.BASE_POINTS[CareEventType.RESONANCE];
    const careScore = timeProximity * qualityResonance * basePoints;

    const event: CareEvent = {
      id: this.generateEventId(),
      type: CareEventType.RESONANCE,
      caregiverId: measurement.deviceId,
      receiverId: measurement.deviceId, // Self-measurement
      timeProximity,
      qualityResonance,
      basePoints,
      careScore,
      timestamp: measurement.timestamp,
      proofs: { resonance: measurement.resonanceProof },
      verified: true
    };

    this.storeCareEvent(event);
    this.updateCareScore(event.caregiverId);

    return event;
  }

  /**
   * Record task completion with verification
   */
  recordTaskCompletion(
    caregiverId: string,
    receiverId: string,
    task: TaskVerification
  ): CareEvent {
    // Verify task completion proof
    const taskValid = ZKProver.verifyRangeProof(
      task.completionProof,
      0, // Min difficulty (simplified)
      10 // Max difficulty (simplified)
    );

    if (!taskValid) {
      throw new Error('Invalid task completion proof');
    }

    this.taskVerifications.push(task);

    const basePoints = CARE_SCORING.BASE_POINTS[CareEventType.TASK_COMPLETION];
    const careScore = basePoints * task.difficulty;

    const event: CareEvent = {
      id: this.generateEventId(),
      type: CareEventType.TASK_COMPLETION,
      caregiverId,
      receiverId,
      timeProximity: 1.0,
      qualityResonance: 1.0,
      basePoints,
      careScore,
      timestamp: task.timestamp,
      proofs: {}, // Task proofs stored separately
      verified: true
    };

    this.storeCareEvent(event);
    this.updateCareScore(caregiverId);

    return event;
  }

  /**
   * Get care score for a caregiver
   */
  getCareScore(caregiverId: string): CareScore {
    return this.careScores.get(caregiverId) || this.initializeCareScore(caregiverId);
  }

  /**
   * Calculate equity distribution based on care scores
   */
  calculateEquityDistribution(): Record<string, number> {
    const allScores = Array.from(this.careScores.values());
    const totalScore = allScores.reduce((sum, score) => sum + score.totalScore, 0);

    if (totalScore === 0) return {};

    const distribution: Record<string, number> = {};
    for (const score of allScores) {
      distribution[score.caregiverId] = score.totalScore / totalScore;
    }

    return distribution;
  }

  /**
   * Generate zero-knowledge proof for proximity measurement
   */
  static generateProximityProof(rssi: number): ZKProof {
    return ZKProver.generateCommitment(rssi);
  }

  /**
   * Generate zero-knowledge proof for resonance measurement
   */
  static generateResonanceProof(hrv: number): ZKProof {
    return ZKProver.generateCommitment(hrv);
  }

  /**
   * Verify care event proofs
   */
  verifyCareEvent(event: CareEvent): boolean {
    // Verify proximity proof if present
    if (event.proofs.proximity) {
      const proximityValid = ZKProver.verifyRangeProof(
        event.proofs.proximity,
        PROXIMITY_CONFIG.RSSI_RANGE.min,
        PROXIMITY_CONFIG.RSSI_RANGE.max
      );
      if (!proximityValid) return false;
    }

    // Verify resonance proof if present
    if (event.proofs.resonance) {
      const resonanceValid = ZKProver.verifyRangeProof(
        event.proofs.resonance,
        0, 200 // Simplified HRV range
      );
      if (!resonanceValid) return false;
    }

    return true;
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // PRIVATE METHODS
  // ═══════════════════════════════════════════════════════════════════════════════

  private generateEventId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `care_${timestamp}_${random}`;
  }

  private storeCareEvent(event: CareEvent): void {
    if (!this.careEvents.has(event.caregiverId)) {
      this.careEvents.set(event.caregiverId, []);
    }
    this.careEvents.get(event.caregiverId)!.push(event);
  }

  private updateCareScore(caregiverId: string): void {
    const events = this.careEvents.get(caregiverId) || [];
    const now = Date.now();

    // Calculate time-weighted scores
    const timeWeightedScores = events.map(event => {
      const ageHours = (now - event.timestamp) / (1000 * 60 * 60);
      const decayFactor = Math.exp(-ageHours / CARE_SCORING.TIME_DECAY_HOURS);
      return event.careScore * decayFactor;
    });

    const totalScore = timeWeightedScores.reduce((sum, score) => sum + score, 0);
    const timeWeightedAverage = totalScore / Math.max(events.length, 1);

    // Calculate breakdown by type
    const byType: Record<CareEventType, number> = {
      [CareEventType.PROXIMITY]: 0,
      [CareEventType.RESONANCE]: 0,
      [CareEventType.TASK_COMPLETION]: 0,
      [CareEventType.EMOTIONAL_SUPPORT]: 0,
      [CareEventType.PHYSICAL_CARE]: 0
    };

    events.forEach(event => {
      byType[event.type] += event.careScore;
    });

    // Calculate equity percentage (smoothed)
    const existingScore = this.careScores.get(caregiverId);
    const smoothingFactor = CARE_SCORING.EQUITY_SMOOTHING;
    const equityPercentage = existingScore
      ? existingScore.equityPercentage * (1 - smoothingFactor) + (totalScore / 1000) * smoothingFactor
      : totalScore / 1000;

    this.careScores.set(caregiverId, {
      caregiverId,
      totalScore,
      byType,
      timeWeightedAverage,
      lastUpdated: now,
      equityPercentage: Math.min(equityPercentage, 1.0) // Cap at 100%
    });
  }

  private initializeCareScore(caregiverId: string): CareScore {
    return {
      caregiverId,
      totalScore: 0,
      byType: {
        [CareEventType.PROXIMITY]: 0,
        [CareEventType.RESONANCE]: 0,
        [CareEventType.TASK_COMPLETION]: 0,
        [CareEventType.EMOTIONAL_SUPPORT]: 0,
        [CareEventType.PHYSICAL_CARE]: 0
      },
      timeWeightedAverage: 0,
      lastUpdated: Date.now(),
      equityPercentage: 0
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTED FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Create a new L.O.V.E. Protocol instance
 */
export function createLoveProtocol(): LoveProtocol {
  return new LoveProtocol();
}

/**
 * Calculate care score from components
 */
export function calculateCareScore(
  timeProximity: number,
  qualityResonance: number,
  basePoints: number
): number {
  return timeProximity * qualityResonance * basePoints;
}

/**
 * Get resonance state from HRV measurement
 */
export function getResonanceState(
  hrv: number,
  coherenceFrequency: number
): ResonanceState {
  const frequencyDiff = Math.abs(coherenceFrequency - RESONANCE_CONFIG.TARGET_FREQUENCY);

  if (hrv < 20) return ResonanceState.CHAOS;
  if (frequencyDiff > RESONANCE_CONFIG.FREQUENCY_TOLERANCE * 2) return ResonanceState.CHAOS;
  if (frequencyDiff > RESONANCE_CONFIG.FREQUENCY_TOLERANCE) return ResonanceState.TURBULENT;
  if (hrv > 80 && frequencyDiff < RESONANCE_CONFIG.FREQUENCY_TOLERANCE / 2) return ResonanceState.FLOW;

  return ResonanceState.GREEN;
}

/**
 * Validate care event data
 */
export function validateCareEvent(event: CareEvent): boolean {
  // Basic validation
  if (!event.id || !event.caregiverId || !event.receiverId) return false;
  if (event.timeProximity < 0 || event.timeProximity > 1) return false;
  if (event.qualityResonance < 0 || event.qualityResonance > 2) return false;
  if (event.careScore < 0) return false;

  // Verify calculated score matches components
  const expectedScore = calculateCareScore(
    event.timeProximity,
    event.qualityResonance,
    event.basePoints
  );

  return Math.abs(event.careScore - expectedScore) < 0.001;
}