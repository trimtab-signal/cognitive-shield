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
 * G.O.D. Protocol Configuration
 * Geodesic Operations/Governance - The Constitution of the Shield
 * 
 * Aligned with Phenix Navigator v4.1 Tri-State Topology
 */

// ═══════════════════════════════════════════════════════════════════════════════
// UNIVERSAL CONSTANTS (The Physics)
// ═══════════════════════════════════════════════════════════════════════════════

/** Mark 1 Attractor - The sweet spot of existence (π/9) */
export const MARK_1_ATTRACTOR = 0.34906585;

/** Crypto Engine hardware constant (from Navigator firmware) */
export const CRYPTO_ENGINE = 0xab1c5ed5;

/** Phase drift threshold before correction triggers */
export const PHASE_DRIFT_THRESHOLD = 0.05;

/** Gamma frequency for neural synchrony (Hz) */
export const GAMMA_FREQUENCY = 40;

/** Carrier frequency for binaural beats (Hz) - tuned to A=432 */
export const CARRIER_FREQUENCY = 432;

/** SIC-POVM overlap constant |⟨ψᵢ|ψⱼ⟩|² = 1/3 */
export const SIC_POVM_OVERLAP = 1 / 3;

/** Open Delta threshold - 57.7% capacity (1/√3) */
export const OPEN_DELTA_THRESHOLD = 0.577;

// ═══════════════════════════════════════════════════════════════════════════════
// TETRAHEDRON PROTOCOL (The Geometry)
// ═══════════════════════════════════════════════════════════════════════════════

export const TetrahedronConfig = {
  /** Minimum nodes for structural stability */
  minNodes: 4,
  
  /** Node designations */
  nodes: {
    A: 'self',      // The Operator (You)
    B: 'other',     // The Counterparty (Them)
    C: 'context',   // The Shared Reality (Constitution)
    D: 'engine',    // The AI (Geodesic Engine)
  },
  
  /** Edge count for K₄ complete graph */
  edges: 6,
  
  /** Triangulated faces */
  faces: 4,
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// DOMAIN CONFIGURATION (The Knowledge Graph)
// ═══════════════════════════════════════════════════════════════════════════════

export type DomainType = 'phenix' | 'fisher' | 'legal' | 'personal' | 'technical' | 'unknown';

export interface DomainProfile {
  id: DomainType;
  name: string;
  folder: string;
  keywords: string[];
}

export const DomainConfig: Record<DomainType, DomainProfile> = {
  phenix: {
    id: 'phenix',
    name: 'Phenix Navigator',
    folder: 'Phenix Navigator/',
    keywords: ['quantum', 'mesh', 'esp32', 'sic-povm', 'navigator', 'hardware', 'qkd'],
  },
  fisher: {
    id: 'fisher',
    name: 'Fisher-Escola',
    folder: 'Fisher-Escola Research/',
    keywords: ['calcium', 'cognition', 'quantum biology', 'fisher', 'escola', 'mitochondria'],
  },
  legal: {
    id: 'legal',
    name: 'Legal Strategy',
    folder: 'Legal-Court/',
    keywords: ['court', 'filing', 'deadline', 'custody', 'lawyer', 'motion', 'judge'],
  },
  personal: {
    id: 'personal',
    name: 'Personal/Family',
    folder: 'Personal-Family/',
    keywords: ['family', 'kids', 'health', 'journal', 'schedule', 'school'],
  },
  technical: {
    id: 'technical',
    name: 'Engineering',
    folder: 'Technical-Engineering/',
    keywords: ['code', 'git', 'react', 'python', 'docker', 'api', 'database'],
  },
  unknown: {
    id: 'unknown',
    name: 'Uncategorized',
    folder: '_Inbox/',
    keywords: [],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// EVIDENCE LEVELS (The Truthiness)
// ═══════════════════════════════════════════════════════════════════════════════

export type EvidenceLevel = 'verified' | 'supported' | 'theoretical' | 'speculative' | 'unverified';

export const EvidenceConfig: Record<EvidenceLevel, { label: string; color: string; keywords: string[] }> = {
  verified: {
    label: 'VERIFIED',
    color: '#10B981', // Green
    keywords: ['peer-reviewed', 'replicated', 'meta-analysis', 'proven', 'demonstrated', 'validated', 'clinical trial'],
  },
  supported: {
    label: 'SUPPORTED',
    color: '#F59E0B', // Yellow
    keywords: ['published', 'study found', 'research shows', 'evidence suggests', 'data shows', 'observed'],
  },
  theoretical: {
    label: 'THEORETICAL',
    color: '#3B82F6', // Blue
    keywords: ['mathematically', 'in principle', 'theoretically', 'model predicts', 'simulation', 'derivation'],
  },
  speculative: {
    label: 'SPECULATIVE',
    color: '#EF4444', // Red
    keywords: ['hypothesis', 'proposed', 'may', 'might', 'could', 'possibly', 'preliminary', 'suggests'],
  },
  unverified: {
    label: 'UNVERIFIED',
    color: '#6B7280', // Gray
    keywords: [],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// HUMAN OS PROFILES (The Translation Targets)
// ═══════════════════════════════════════════════════════════════════════════════

export type HumanOSType = 'guardian' | 'order' | 'achiever' | 'empath' | 'integrator';

export interface HumanOSProfile {
  id: HumanOSType;
  name: string;
  spiralColor: string;
  gravesCode: string;
  coreTheme: string;
  cognitiveDriver: string;
  impedance: string;
  trigger: string;
  keywords: string[];
}

export const HumanOSProfiles: Record<HumanOSType, HumanOSProfile> = {
  guardian: {
    id: 'guardian',
    name: 'The Guardian',
    spiralColor: 'Purple/Red',
    gravesCode: 'B-O / C-P',
    coreTheme: 'Safety & Power',
    cognitiveDriver: 'Fear / Desire',
    impedance: 'High resistance to Change',
    trigger: 'Disruption',
    keywords: ['power', 'pack', 'respect', 'forbidden', 'protect', 'territory'],
  },
  order: {
    id: 'order',
    name: 'The Order',
    spiralColor: 'Blue',
    gravesCode: 'D-Q',
    coreTheme: 'Truth & Order',
    cognitiveDriver: 'Guilt / Duty',
    impedance: 'High resistance to Emotion',
    trigger: 'Chaos/Drama',
    keywords: ['rules', 'duty', 'standard', 'correct', 'proper', 'procedure'],
  },
  achiever: {
    id: 'achiever',
    name: 'The Achiever',
    spiralColor: 'Orange',
    gravesCode: 'E-R',
    coreTheme: 'Strategy & Success',
    cognitiveDriver: 'Autonomy / Greed',
    impedance: 'High resistance to Inefficiency',
    trigger: 'Wasting Time',
    keywords: ['win', 'profit', 'fast', 'strategy', 'results', 'bottom line'],
  },
  empath: {
    id: 'empath',
    name: 'The Empath',
    spiralColor: 'Green',
    gravesCode: 'F-S',
    coreTheme: 'Community & Harmony',
    cognitiveDriver: 'Affiliation / Sensitivity',
    impedance: 'High resistance to Hierarchy',
    trigger: 'Cruelty/Coldness',
    keywords: ['vibe', 'community', 'feelings', 'together', 'harmony', 'inclusive'],
  },
  integrator: {
    id: 'integrator',
    name: 'The Integrator',
    spiralColor: 'Yellow',
    gravesCode: 'G-T',
    coreTheme: 'Synergy & Systems',
    cognitiveDriver: 'Existence / Knowing',
    impedance: 'High resistance to Simplicity',
    trigger: 'Reductionism',
    keywords: ['system', 'flow', 'design', 'function', 'pattern', 'integrate'],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// SPOON THEORY (Metabolic Economics)
// ═══════════════════════════════════════════════════════════════════════════════

export const MetabolismConfig = {
  /** Maximum daily spoons */
  maxSpoons: 12,
  
  /** Spoon costs for various actions */
  costs: {
    readLowVoltage: 0.5,
    readMediumVoltage: 1,
    readHighVoltage: 2,
    replySimple: 1,
    replyComplex: 3,
    contextSwitch: 1.5,
    conflictExposure: 2.5,
    decisionMaking: 1,
  },
  
  /** Recovery rates */
  recovery: {
    sleep: 8,        // Full night
    nap: 2,          // 20 min power nap
    heavyWork: 1,    // Proprioceptive regulation
    breathing: 0.5,  // 4-7-8 cycle
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// VOLTAGE ASSESSMENT (Signal Classification)
// ═══════════════════════════════════════════════════════════════════════════════

export const VoltageConfig = {
  /** Maximum voltage on the scale */
  maxVoltage: 10,
  
  /** Thresholds for automatic actions */
  thresholds: {
    /** Auto-queue for later (Catcher's Mitt holds) */
    autoQueue: 7,
    /** Require confirmation before viewing */
    confirmRequired: 5,
    /** Safe to view directly */
    safeView: 3,
  },
  
  /** Buffer timing */
  catchersMitt: {
    /** Minimum buffer time (ms) */
    minBuffer: 60000, // 60 seconds
    /** Batch window for consolidation */
    batchWindow: 300000, // 5 minutes
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// HEARTBEAT PROTOCOL (Operator Status)
// ═══════════════════════════════════════════════════════════════════════════════

export type HeartbeatStatus = 'green' | 'yellow' | 'orange' | 'red';

export const HeartbeatConfig = {
  /** Status thresholds (percentage) */
  thresholds: {
    green: 80,   // Systems nominal
    yellow: 50,  // Conservation mode
    orange: 25,  // Defensive mode
    red: 0,      // Deep processing lock
  },
  
  /** Deep processing lockout threshold */
  lockoutThreshold: 25,
  
  /** Status colors for UI */
  colors: {
    green: '#10B981',
    yellow: '#F59E0B',
    orange: '#F97316',
    red: '#EF4444',
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATOR INTEGRATION (Bridge to Hardware)
// ═══════════════════════════════════════════════════════════════════════════════

export const NavigatorConfig = {
  /** WebSocket endpoint for quantum telemetry */
  telemetryEndpoint: 'wss://wye.phenix.local/quantum',
  
  /** Event types from Navigator v4.1 */
  eventTypes: {
    QUANTUM_STATE: 'quantum_state',
    QUANTUM_ANOMALY: 'quantum_anomaly',
    MESH_HEARTBEAT: 'mesh_heartbeat',
    NODE_JOINED: 'node_joined',
    NODE_LEFT: 'node_left',
  },
  
  /** Bypass voltage stripping for these events */
  bypassEvents: ['quantum_anomaly'],
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// AI ENGINE (Local LLM Configuration)
// ═══════════════════════════════════════════════════════════════════════════════

export const AIConfig = {
  /** Ollama endpoint */
  endpoint: 'http://localhost:11434',
  
  /** Default model */
  defaultModel: 'llama3',
  
  /** Temperature for analysis (lower = more deterministic) */
  analysisTemperature: 0.3,
  
  /** Temperature for translation (slightly higher for natural language) */
  translationTemperature: 0.5,
  
  /** Max tokens for responses */
  maxTokens: 1024,
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// THEME CONFIGURATION (Neurodivergent-First Design)
// ═══════════════════════════════════════════════════════════════════════════════

export const ThemeConfig = {
  mode: 'system' as 'light' | 'dark' | 'system',
  
  /** High contrast for accessibility */
  contrast: 'high' as 'normal' | 'high',
  
  /** Reduced motion preference */
  reducedMotion: true,
  
  /** Color palette */
  colors: {
    primary: '#00B4D8',      // Calm cyan
    secondary: '#7C3AED',    // Purple (connection)
    success: '#10B981',      // Green (safe)
    warning: '#F59E0B',      // Amber (caution)
    danger: '#EF4444',       // Red (high voltage)
    neutral: '#6B7280',      // Gray
    background: {
      light: '#FFFFFF',
      dark: '#1F2937',
    },
    surface: {
      light: '#F3F4F6',
      dark: '#374151',
    },
  },
  
  /** Typography */
  fonts: {
    primary: 'Inter, system-ui, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT UNIFIED CONFIG
// ═══════════════════════════════════════════════════════════════════════════════

export const GodConfig = {
  constants: {
    MARK_1_ATTRACTOR,
    CRYPTO_ENGINE,
    PHASE_DRIFT_THRESHOLD,
    GAMMA_FREQUENCY,
    CARRIER_FREQUENCY,
    SIC_POVM_OVERLAP,
    OPEN_DELTA_THRESHOLD,
  },
  tetrahedron: TetrahedronConfig,
  domains: DomainConfig,
  evidence: EvidenceConfig,
  humanOS: HumanOSProfiles,
  metabolism: MetabolismConfig,
  voltage: VoltageConfig,
  heartbeat: HeartbeatConfig,
  navigator: NavigatorConfig,
  ai: AIConfig,
  theme: ThemeConfig,
} as const;

export default GodConfig;
