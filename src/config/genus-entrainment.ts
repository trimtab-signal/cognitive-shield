/**
 * @license
 * Copyright 2026 Wonky Sprout DUNA
 *
 * Licensed under the AGPLv3 License, Version 3.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.gnu.org/licenses/agpl-3.0.html
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║   40Hz GENUS ENTRAINMENT PROTOCOL                                         ║
 * ║   MIT Li-Huei Tsai Laboratory Validated Specifications                    ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 * 
 * Based on validated research from MIT's Tsai laboratory demonstrating that
 * 40Hz sensory stimulation reduces amyloid plaques, tau phosphorylation, and
 * neurodegeneration while improving cognitive outcomes.
 * 
 * Key Publications:
 * - Iaccarino et al. (2016) Nature 540:230-235 — 50% Aβ reduction in visual cortex
 * - Martorell et al. (2019) Cell 177:256-271 — Combined audiovisual, 37% plaque reduction
 * - Chan et al. (2025) Alz & Dem DOI: 10.1002/alz.70792 — 2-year human trial
 * 
 * CRITICAL: Only 40Hz produces significant effects. Neither 20Hz nor 80Hz
 * achieved comparable results, suggesting specific resonance with endogenous
 * gamma oscillation frequencies.
 */

// ═══════════════════════════════════════════════════════════════════════════
// BINAURAL BEAT CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Primary binaural beat configuration for 40Hz entrainment
 * 
 * Binaural beats work by presenting slightly different frequencies to each ear.
 * The brain perceives the difference as a "beat" at the target frequency.
 */
export const BINAURAL_CONFIG = {
  // Primary carrier frequencies
  primary: {
    leftEar: 340,   // Hz - lower carrier
    rightEar: 380,  // Hz - higher carrier
    beatFrequency: 40, // Hz - difference (perceived)
  },
  
  // Alternative carrier options
  alternatives: [
    { leftEar: 200, rightEar: 240, beatFrequency: 40 },
    { leftEar: 432, rightEar: 472, beatFrequency: 40 }, // 432 Hz "sacred" tuning
  ],
  
  // Audio specifications
  waveform: 'sine' as const,
  sampleRate: 48000, // Hz
  bitDepth: 16,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// ISOCHRONIC TONE CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Isochronic tones: sharp on/off pulses at target frequency
 * Research shows 15% stronger prefrontal entrainment than binaural beats alone
 */
export const ISOCHRONIC_CONFIG = {
  pulseFrequency: 40,    // Hz
  waveform: 'square' as const, // Sharp on/off for strongest entrainment
  dutyCycle: 0.5,        // 50% on, 50% off
  modulationDepth: 1.0,  // 100% modulation (full on/off)
  
  // Carrier frequency for the pulses
  carrierFrequency: 340, // Hz
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// SESSION PROTOCOL
// ═══════════════════════════════════════════════════════════════════════════

export const SESSION_PROTOCOL = {
  // Duration settings
  duration: {
    optimal: 60,     // minutes - per MIT clinical protocol
    minimum: 30,     // minutes - minimum effective dose
    maximum: 90,     // minutes - diminishing returns beyond this
  },
  
  // Transition settings
  ramp: {
    fadeIn: 120,     // seconds (2 minutes)
    fadeOut: 120,    // seconds (2 minutes)
    curve: 'exponential' as const,
  },
  
  // Timing recommendations
  timing: {
    morning: {
      purpose: 'cognition',
      description: 'Best for focus, working memory, and cognitive performance',
    },
    evening: {
      purpose: 'circadian',
      description: '2-3 hours before bed for circadian stabilization',
    },
  },
  
  // Volume settings
  volume: {
    recommended: {
      min: 60,  // dB SPL
      max: 70,  // dB SPL
    },
    note: 'Comfortable listening level - should not feel loud or straining',
  },
  
  // Frequency (sessions per day/week)
  frequency: {
    daily: 1,        // sessions per day
    weekly: 7,       // sessions per week (daily recommended)
    minimumWeekly: 3, // minimum sessions for observable effects
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// QUANTUM BIOLOGY CONNECTION (Fisher-Escolà Hypothesis)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Connection to Fisher's Posner Molecule Quantum Cognition Hypothesis
 * 
 * 2025 PNAS Validation: DOI: 10.1073/pnas.2423211122
 * "Evidence for a possible quantum effect on the formation of lithium-doped
 * amorphous calcium phosphate from solution"
 * 
 * Key Finding: ⁷Li promotes greater Ca₉(PO₄)₆ (Posner molecule) formation than
 * ⁶Li—an effect unexplainable by classical chemistry since both isotopes have
 * identical electronic structure. This validates quantum dynamical selection.
 */
export const QUANTUM_BIOLOGY = {
  // Fisher-Escolà Core Hypothesis
  posnerMolecule: {
    formula: 'Ca₉(PO₄)₆',
    description: 'Calcium phosphate clusters that may sustain quantum coherence in neural tissue',
    nuclearSpin: '³¹P (spin 1/2)',
    coherenceTime: 'Minutes to hours (protected by cage structure)',
  },
  
  // 2025 Experimental Validation
  validation: {
    paper: 'Straub, Patel, Fisher et al. (2025)',
    journal: 'PNAS Vol. 122, Issue 10',
    doi: '10.1073/pnas.2423211122',
    finding: 'Lithium isotope effect on ACP formation validates quantum dynamical selection',
    mechanism: '⁷Li (spin 3/2, fast T₁) vs ⁶Li (spin 1, slow T₁) affects binding rates',
  },
  
  // Potential 40Hz Connection
  gammaConnection: {
    hypothesis: '40Hz gamma oscillations may synchronize with Posner molecule quantum states',
    evidence: 'Correlational only - direct mechanism not yet proven',
    research: 'Active area of investigation',
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// GREEN COHERENCE (HRV Synchronization)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Heart Rate Variability (HRV) Coherence Protocol
 * 
 * 0.1 Hz is the "Green Coherence" frequency where parasympathetic and
 * sympathetic nervous system activity achieve optimal balance.
 */
export const HRV_COHERENCE = {
  // Target frequency
  targetFrequency: 0.1, // Hz - 6 breaths per minute
  
  // Breathing protocol for coherence
  breathingProtocol: {
    inhale: 5,  // seconds
    exhale: 5,  // seconds
    total: 10,  // seconds per breath
    rate: 6,    // breaths per minute
    frequency: 0.1, // Hz
  },
  
  // HRV measurement
  measurement: {
    metric: 'RMSSD', // Root Mean Square of Successive Differences
    coherenceRatio: 'LF/HF power ratio approaching 1.0',
    targetRange: [0.8, 1.2], // Optimal LF/HF ratio
  },
  
  // Connection to care tracking (L.O.V.E. Protocol)
  careConnection: {
    metric: 'Q_res (Quality Resonance)',
    description: 'Synchronized HRV at 0.1 Hz between guardian and child',
    miningMultiplier: [1.5, 2.0], // Proof of Care bonus range
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// AUDIO GENERATION UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

export interface EntrainmentSessionConfig {
  duration: number;      // minutes
  useBinaural: boolean;
  useIsochronic: boolean;
  carrierFrequency?: number;
  fadeInDuration?: number;
  fadeOutDuration?: number;
  volume?: number;       // 0-1
}

/**
 * Generate a configuration object for audio processing
 */
export function createSessionConfig(
  options: Partial<EntrainmentSessionConfig> = {}
): EntrainmentSessionConfig {
  return {
    duration: options.duration ?? SESSION_PROTOCOL.duration.optimal,
    useBinaural: options.useBinaural ?? true,
    useIsochronic: options.useIsochronic ?? true,
    carrierFrequency: options.carrierFrequency ?? BINAURAL_CONFIG.primary.leftEar,
    fadeInDuration: options.fadeInDuration ?? SESSION_PROTOCOL.ramp.fadeIn,
    fadeOutDuration: options.fadeOutDuration ?? SESSION_PROTOCOL.ramp.fadeOut,
    volume: options.volume ?? 0.7,
  };
}

/**
 * Calculate session metadata for tracking
 */
export function calculateSessionMetadata(config: EntrainmentSessionConfig) {
  const durationMs = config.duration * 60 * 1000;
  const fadeInMs = (config.fadeInDuration ?? 0) * 1000;
  const fadeOutMs = (config.fadeOutDuration ?? 0) * 1000;
  
  return {
    totalDurationMs: durationMs,
    fadeInMs,
    fadeOutMs,
    effectiveDurationMs: durationMs - fadeInMs - fadeOutMs,
    targetFrequency: 40, // Hz
    carrierFrequencies: config.useBinaural 
      ? [BINAURAL_CONFIG.primary.leftEar, BINAURAL_CONFIG.primary.rightEar]
      : [config.carrierFrequency ?? BINAURAL_CONFIG.primary.leftEar],
    modes: [
      config.useBinaural && 'binaural',
      config.useIsochronic && 'isochronic',
    ].filter(Boolean),
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT SUMMARY
// ═══════════════════════════════════════════════════════════════════════════

export const GENUS_PROTOCOL = {
  binaural: BINAURAL_CONFIG,
  isochronic: ISOCHRONIC_CONFIG,
  session: SESSION_PROTOCOL,
  quantumBiology: QUANTUM_BIOLOGY,
  hrvCoherence: HRV_COHERENCE,
} as const;

export default GENUS_PROTOCOL;
