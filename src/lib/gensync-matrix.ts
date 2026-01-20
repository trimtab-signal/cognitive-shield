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
 * ║   GENSYNC TRANSLATION MATRIX                                              ║
 * ║   Universal Translator for Human Operating Systems (HumanOS / vMEMEs)     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 * 
 * "Resilience strategies fail not from lack of information, but from
 *  Cognitive Impedance Mismatch between sender and receiver."
 * 
 * The GenSync Matrix decouples the Kernel (immutable truth/physics) from
 * the Driver (variable explanation/poetics), allowing the same protocol
 * to be installed on any HumanOS without corruption.
 */

import type { HumanOS, TetrahedronPrimitive, GenSyncTranslation } from '../types/gensync.types';

// ============================================================================
// THE FIVE HUMAN OPERATING SYSTEMS (vMEMEs from Spiral Dynamics)
// ============================================================================

export const HUMAN_OS_PROFILES: Record<HumanOS, HumanOSProfile> = {
  guardian: {
    id: 'guardian',
    name: 'The Guardian',
    spiralColor: 'Purple/Red',
    coreDriver: 'Safety & Power',
    cognitiveScan: 'Friend vs. Enemy',
    resilienceProfile: 'High physical resilience; collapses under bureaucracy',
    emoji: '🛡️',
    traits: ['tribal', 'protective', 'ritualistic', 'immediate-action'],
    communicationStyle: 'Direct, visceral, honor-based',
    triggerWords: ['betray', 'outsider', 'weak', 'abandon'],
    safeWords: ['tribe', 'blood', 'protect', 'honor', 'strength'],
  },
  order: {
    id: 'order',
    name: 'The Order',
    spiralColor: 'Blue',
    coreDriver: 'Truth & Authority',
    cognitiveScan: 'Right vs. Wrong',
    resilienceProfile: 'High structural resilience; brittle against Black Swans',
    emoji: '⚖️',
    traits: ['hierarchical', 'rule-following', 'disciplined', 'institutional'],
    communicationStyle: 'Formal, procedural, duty-bound',
    triggerWords: ['chaos', 'disorder', 'disrespect', 'heresy'],
    safeWords: ['order', 'law', 'tradition', 'duty', 'righteousness'],
  },
  achiever: {
    id: 'achiever',
    name: 'The Achiever',
    spiralColor: 'Orange',
    coreDriver: 'Strategy & Success',
    cognitiveScan: 'Win vs. Lose',
    resilienceProfile: 'High adaptive resilience; prone to systemic burnout',
    emoji: '🏆',
    traits: ['competitive', 'pragmatic', 'innovative', 'results-driven'],
    communicationStyle: 'Data-driven, ROI-focused, efficiency-minded',
    triggerWords: ['failure', 'inefficiency', 'weakness', 'loser'],
    safeWords: ['success', 'profit', 'optimize', 'growth', 'winning'],
  },
  empath: {
    id: 'empath',
    name: 'The Empath',
    spiralColor: 'Green',
    coreDriver: 'Harmony & Inclusion',
    cognitiveScan: 'Inclusion vs. Exclusion',
    resilienceProfile: 'High social resilience; suffers from analysis paralysis',
    emoji: '💚',
    traits: ['collaborative', 'egalitarian', 'consensus-seeking', 'compassionate'],
    communicationStyle: 'Validating, inclusive, process-oriented',
    triggerWords: ['hierarchy', 'exclusion', 'privilege', 'oppression'],
    safeWords: ['community', 'equality', 'healing', 'together', 'voices'],
  },
  integrator: {
    id: 'integrator',
    name: 'The Integrator',
    spiralColor: 'Yellow',
    coreDriver: 'Synergy & Systems',
    cognitiveScan: 'Pattern vs. Chaos',
    resilienceProfile: 'Antifragile; adapts, learns, and reorganizes',
    emoji: '🌐',
    traits: ['systemic', 'flexible', 'meta-aware', 'complexity-embracing'],
    communicationStyle: 'Direct technical language, pattern-recognition',
    triggerWords: ['dogma', 'absolutism', 'reductionism'],
    safeWords: ['emergence', 'integration', 'complexity', 'adaptation', 'synergy'],
  },
};

// ============================================================================
// THE FOUR TETRAHEDRON PRIMITIVES
// ============================================================================

export const TETRAHEDRON_PRIMITIVES: Record<TetrahedronPrimitive, PrimitiveDefinition> = {
  frequency: {
    id: 'frequency',
    name: 'Frequency / Stability',
    symbol: '~',
    description: 'The stable system rhythm/heartbeat. Establishes temporal coherence.',
    physicsLayer: 'Oscillation rate, phase-locking, Hz',
    metaphysicalLayer: 'The pulse of life, the heartbeat of connection',
  },
  paralleling: {
    id: 'paralleling',
    name: 'Paralleling / Redundancy',
    symbol: '∥',
    description: 'Load sharing via the Equalizer Bar to prevent Motoring (parasitic load).',
    physicsLayer: 'Kirchhoff\'s Current Law, impedance matching, load distribution',
    metaphysicalLayer: 'Mutual support, burden-sharing, solidarity',
  },
  binary: {
    id: 'binary',
    name: 'Binary Logic / The Cut',
    symbol: '⊻',
    description: 'Reduce entropy through deterministic decision-making.',
    physicsLayer: 'Boolean algebra, state reduction, wavefront collapse',
    metaphysicalLayer: 'Boundaries, yes/no, the power of the clear decision',
  },
  tetrahedron: {
    id: 'tetrahedron',
    name: 'The Tetrahedron',
    symbol: '△',
    description: 'The minimum 4-node structural stability. Encloses volume.',
    physicsLayer: 'Isostatic rigidity, synergetic geometry, tensegrity',
    metaphysicalLayer: 'The sacred shape, the foundation, the mesh of trust',
  },
};

// ============================================================================
// THE TRANSLATION MATRIX
// ============================================================================

export const GENSYNC_MATRIX: GenSyncTranslation[] = [
  // PRIMITIVE A: Frequency/Stability
  {
    primitive: 'frequency',
    humanOS: 'guardian',
    driver: 'The Drumbeat / Ritual',
    metaphor: 'The heartbeat is the sound of the tribe surviving.',
    explanation: 'We do this at dawn to keep the spirits (chaos) at bay.',
    validation: 'I feel the rhythm. We drum together.',
  },
  {
    primitive: 'frequency',
    humanOS: 'order',
    driver: 'The Schedule / Discipline',
    metaphor: 'Frequency is the enforcement of the Law.',
    explanation: 'We operate at 60 Hz because it is the Standard.',
    validation: 'The schedule is sacred. Deviation is disorder.',
  },
  {
    primitive: 'frequency',
    humanOS: 'achiever',
    driver: 'The Cadence / Throughput',
    metaphor: 'Stable frequency minimizes downtime and maximizes ROI.',
    explanation: 'Consistent pulse equals peak performance.',
    validation: 'Show me the metrics. Optimize the cycle.',
  },
  {
    primitive: 'frequency',
    humanOS: 'empath',
    driver: 'The Vibe / Resonance',
    metaphor: 'The feeling of being on the same wavelength.',
    explanation: 'We tune in to each other to heal the collective.',
    validation: 'I feel your frequency. Let\'s harmonize.',
  },
  {
    primitive: 'frequency',
    humanOS: 'integrator',
    driver: 'Oscillation',
    metaphor: 'No metaphor needed. Direct mechanics.',
    explanation: 'Grid stability requires phase-locked oscillators within tolerance.',
    validation: 'The phase error is within bounds. System stable.',
  },

  // PRIMITIVE B: Paralleling/Redundancy
  {
    primitive: 'paralleling',
    humanOS: 'guardian',
    driver: 'Blood Brotherhood',
    metaphor: 'The Equalizer Bar is the blood pact.',
    explanation: 'If you bleed, I bleed. It prevents the strong from eating the weak.',
    validation: 'We are bound. Your load is my load.',
  },
  {
    primitive: 'paralleling',
    humanOS: 'order',
    driver: 'Chain of Command',
    metaphor: 'The regulation that binds all ranks to the mission.',
    explanation: 'It ensures the General and the Private are part of the same grid.',
    validation: 'Each node performs its duty. The chain holds.',
  },
  {
    primitive: 'paralleling',
    humanOS: 'achiever',
    driver: 'Strategic Alliance',
    metaphor: 'A hedge against market volatility.',
    explanation: 'We share the load to scale the enterprise and reduce risk.',
    validation: 'The portfolio is diversified. Exposure managed.',
  },
  {
    primitive: 'paralleling',
    humanOS: 'empath',
    driver: 'Solidarity',
    metaphor: 'The mechanism of social justice.',
    explanation: 'It ensures high-energy members support low-energy members without judgment.',
    validation: 'We carry each other. No one is left behind.',
  },
  {
    primitive: 'paralleling',
    humanOS: 'integrator',
    driver: 'Load Balancing',
    metaphor: 'Structural necessity for non-zero-sum games.',
    explanation: 'Prevents parasitic load (motoring) from destroying the network.',
    validation: 'Load distribution optimal. No motoring detected.',
  },

  // PRIMITIVE C: Binary Logic / The Cut
  {
    primitive: 'binary',
    humanOS: 'guardian',
    driver: 'Taboo',
    metaphor: 'Nuance is dangerous in survival mode.',
    explanation: 'The "Cut" is a protective spell. Do not touch the third rail.',
    validation: 'This is forbidden. The ancestors know.',
  },
  {
    primitive: 'binary',
    humanOS: 'order',
    driver: 'The Command / The Rule',
    metaphor: 'Moral clarity between Obedience and Sin.',
    explanation: 'The distinction between Right and Wrong is absolute.',
    validation: 'The rule is clear. There is no gray area.',
  },
  {
    primitive: 'binary',
    humanOS: 'achiever',
    driver: 'The Bottom Line',
    metaphor: 'A tool to cut through analysis paralysis.',
    explanation: 'Binary logic drives execution and profit.',
    validation: 'Ship it or kill it. No middle ground.',
  },
  {
    primitive: 'binary',
    humanOS: 'empath',
    driver: 'Boundaries',
    metaphor: 'An act of protecting the community\'s energy.',
    explanation: 'Saying No to this is saying Yes to us.',
    validation: 'This boundary protects our space. It is loving.',
  },
  {
    primitive: 'binary',
    humanOS: 'integrator',
    driver: 'State Reduction',
    metaphor: 'A temporary functional tool.',
    explanation: 'Used to navigate complexity and reduce entropy (quantum collapse).',
    validation: 'State collapsed for operational clarity. Context preserved.',
  },

  // PRIMITIVE D: The Tetrahedron
  {
    primitive: 'tetrahedron',
    humanOS: 'guardian',
    driver: 'The Totem',
    metaphor: 'Sacred geometry of protection.',
    explanation: 'The stability comes from the spirits of the Four Winds.',
    validation: 'The Four protect us. The center holds.',
  },
  {
    primitive: 'tetrahedron',
    humanOS: 'order',
    driver: 'The Cornerstone',
    metaphor: 'The unshakeable rock of the institution.',
    explanation: 'The structure upon which the institution is built.',
    validation: 'The foundation is laid. The building stands.',
  },
  {
    primitive: 'tetrahedron',
    humanOS: 'achiever',
    driver: 'The Pyramid',
    metaphor: 'An org chart engineered for vertical growth.',
    explanation: 'The base provides stability for the peak to reach high.',
    validation: 'Structural integrity verified. Scale is possible.',
  },
  {
    primitive: 'tetrahedron',
    humanOS: 'empath',
    driver: 'The Circle of Trust',
    metaphor: 'Four spheres close-packed, each touching each.',
    explanation: 'A community where every node touches every other node.',
    validation: 'Everyone is connected. No one is at the periphery.',
  },
  {
    primitive: 'tetrahedron',
    humanOS: 'integrator',
    driver: 'Synergetic Unit',
    metaphor: 'Fuller\'s minimum structural system.',
    explanation: 'The simplest enclosure of space. Balance of tension and compression.',
    validation: 'Tensegrity achieved. Isostatic and resilient.',
  },
];

// ============================================================================
// TRANSLATION ENGINE
// ============================================================================

/**
 * Translate a message from one HumanOS to another
 */
export function translateBetweenOS(
  message: string,
  sourceOS: HumanOS,
  targetOS: HumanOS
): TranslatedMessage {
  const targetProfile = HUMAN_OS_PROFILES[targetOS];

  if (sourceOS === targetOS) {
    return {
      original: message,
      translated: message,
      sourceOS,
      targetOS,
      adaptations: [],
      confidence: 1.0,
    };
  }

  const adaptations: string[] = [];
  let translated = message;

  // Replace trigger words with safe equivalents
  for (const trigger of targetProfile.triggerWords) {
    const regex = new RegExp(`\\b${trigger}\\b`, 'gi');
    if (regex.test(translated)) {
      // Find a safe word replacement
      const safeReplacement = findSafeReplacement(trigger, targetProfile);
      translated = translated.replace(regex, safeReplacement);
      adaptations.push(`Replaced "${trigger}" with "${safeReplacement}" for ${targetOS} compatibility`);
    }
  }

  // Inject safe words for rapport
  if (adaptations.length === 0) {
    // Add a rapport-building prefix based on target OS
    const rapportPrefix = getRapportPrefix(targetOS);
    if (rapportPrefix) {
      translated = `${rapportPrefix} ${translated}`;
      adaptations.push(`Added rapport prefix for ${targetOS}`);
    }
  }

  return {
    original: message,
    translated,
    sourceOS,
    targetOS,
    adaptations,
    confidence: calculateConfidence(message, translated, adaptations.length),
  };
}

/**
 * Get the translation for a primitive in a specific HumanOS
 */
export function getTranslation(
  primitive: TetrahedronPrimitive,
  humanOS: HumanOS
): GenSyncTranslation | undefined {
  return GENSYNC_MATRIX.find(
    (t) => t.primitive === primitive && t.humanOS === humanOS
  );
}

/**
 * Get all translations for a primitive across all HumanOS types
 */
export function getAllTranslationsForPrimitive(
  primitive: TetrahedronPrimitive
): GenSyncTranslation[] {
  return GENSYNC_MATRIX.filter((t) => t.primitive === primitive);
}

/**
 * Detect the likely HumanOS of a speaker based on their language
 */
export function detectHumanOS(text: string): HumanOSDetection {
  const scores: Record<HumanOS, number> = {
    guardian: 0,
    order: 0,
    achiever: 0,
    empath: 0,
    integrator: 0,
  };

  const lowerText = text.toLowerCase();

  for (const [os, profile] of Object.entries(HUMAN_OS_PROFILES)) {
    // Score based on safe words
    for (const word of profile.safeWords) {
      if (lowerText.includes(word)) {
        scores[os as HumanOS] += 2;
      }
    }

    // Score based on trigger words (negative - they avoid these)
    for (const word of profile.triggerWords) {
      if (lowerText.includes(word)) {
        scores[os as HumanOS] -= 1;
      }
    }

    // Score based on traits in communication style
    const styleWords = profile.communicationStyle.toLowerCase().split(/\W+/);
    for (const word of styleWords) {
      if (word.length > 4 && lowerText.includes(word)) {
        scores[os as HumanOS] += 1;
      }
    }
  }

  // Find the highest scoring OS
  const entries = Object.entries(scores) as [HumanOS, number][];
  entries.sort((a, b) => b[1] - a[1]);

  const primary = entries[0];
  const secondary = entries[1];

  return {
    primary: primary[0],
    primaryScore: primary[1],
    secondary: secondary[0],
    secondaryScore: secondary[1],
    allScores: scores,
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function findSafeReplacement(trigger: string, _profile: HumanOSProfile): string {
  // Simple mapping - in production this would use semantic similarity
  // Profile parameter reserved for future context-aware replacement logic
  const replacements: Record<string, string> = {
    // Guardian replacements
    betray: 'challenge',
    outsider: 'newcomer',
    weak: 'learning',
    abandon: 'transition',
    // Order replacements
    chaos: 'change',
    disorder: 'flux',
    disrespect: 'misunderstanding',
    heresy: 'different perspective',
    // Achiever replacements
    failure: 'learning opportunity',
    inefficiency: 'room for optimization',
    weakness: 'growth area',
    loser: 'early-stage competitor',
    // Empath replacements
    hierarchy: 'structure',
    exclusion: 'boundary',
    privilege: 'advantage',
    oppression: 'systemic friction',
    // Integrator replacements
    dogma: 'fixed belief',
    absolutism: 'certainty',
    reductionism: 'simplification',
  };

  return replacements[trigger.toLowerCase()] || trigger;
}

function getRapportPrefix(os: HumanOS): string {
  const prefixes: Record<HumanOS, string> = {
    guardian: 'Brother/Sister,',
    order: 'For the record,',
    achiever: 'Bottom line:',
    empath: 'I want to honor what you\'re feeling.',
    integrator: 'Let me map this out:',
  };
  return prefixes[os];
}

function calculateConfidence(
  original: string,
  translated: string,
  adaptationCount: number
): number {
  const lengthRatio = Math.min(original.length, translated.length) / 
                      Math.max(original.length, translated.length);
  const adaptationPenalty = Math.max(0, 1 - adaptationCount * 0.1);
  return lengthRatio * adaptationPenalty;
}

// ============================================================================
// TYPES
// ============================================================================

export interface HumanOSProfile {
  id: HumanOS;
  name: string;
  spiralColor: string;
  coreDriver: string;
  cognitiveScan: string;
  resilienceProfile: string;
  emoji: string;
  traits: string[];
  communicationStyle: string;
  triggerWords: string[];
  safeWords: string[];
}

export interface PrimitiveDefinition {
  id: TetrahedronPrimitive;
  name: string;
  symbol: string;
  description: string;
  physicsLayer: string;
  metaphysicalLayer: string;
}

export interface TranslatedMessage {
  original: string;
  translated: string;
  sourceOS: HumanOS;
  targetOS: HumanOS;
  adaptations: string[];
  confidence: number;
}

export interface HumanOSDetection {
  primary: HumanOS;
  primaryScore: number;
  secondary: HumanOS;
  secondaryScore: number;
  allScores: Record<HumanOS, number>;
}
