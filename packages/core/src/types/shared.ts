// Shared types across MASTER_PROJECT components

export interface TetrahedronNode {
  id: string;
  position: [number, number, number];
  connections: string[];
  state: 'stable' | 'convergent' | 'divergent' | 'neutral';
}

export interface QuantumState {
  amplitude: number;
  phase: number;
  coherence: number;
  entropy: number;
}

export interface MessagePayload {
  id: string;
  content: string;
  timestamp: number;
  voltage: number;
  humanOS: HumanOSType;
  triggers: string[];
}

export interface ShieldResponse {
  bluf: string;
  voltage: number;
  triggers: string[];
  humanOS: string;
  translation: string;
  why: string;
}

export interface HeartbeatStatus {
  id: 'green' | 'yellow' | 'orange' | 'red';
  label: string;
  color: string;
  icon: string;
  meaning: string;
  autoEscalate: boolean;
  escalateAfterMissed?: number;
}

export interface SpoonBudget {
  max: number;
  current: number;
  costs: Record<string, number>;
  thresholds: Record<string, number>;
}

export interface FisherEscolaPhysics {
  mark1Attractor: number;
  phaseDriftThreshold: number;
  gammaFrequency: number;
  posnerMolecule: {
    formula: string;
    phosphorusSpin: number;
    coherenceHours: number;
  };
}

export interface SICPOVMMeasurement {
  dimension: number;
  overlapCondition: number;
  measurementResult: number[];
  fidelity: number;
}

export interface TetrahedronProtocol {
  batchingWindowMs: number;
  maxBatchSize: number;
  nodeCount: number;
  vacuumOfTimeMs: number;
  sicPOVM: SICPOVMMeasurement;
  curvature: {
    threshold: number;
    updateInterval: number;
  };
}

// Import types from GOD_CONFIG
export type HumanOSType = 'guardian' | 'order' | 'achiever' | 'empath' | 'integrator';
export type VoltageLevel = 'low' | 'medium' | 'high';

// Component-specific interfaces
export interface ComponentHealth {
  name: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  lastCheck: number;
  metrics: Record<string, any>;
}

export interface MeshNode {
  id: string;
  publicKey: string;
  endpoint: string;
  lastSeen: number;
  status: 'online' | 'offline' | 'unknown';
}

export interface EncryptedBlob {
  data: Uint8Array;
  salt: Uint8Array;
  iv: Uint8Array;
  algorithm: string;
}

export interface ProofOfCare {
  provider: string;
  recipient: string;
  timestamp: number;
  careType: string;
  evidence: string[];
  verification: string;
}

export interface GenSyncTranslation {
  engineering: string;
  astrology: string;
  cosmetology: string;
  purpose: string;
}

// Legal interfaces
export interface AdamsChallenge {
  enabled: boolean;
  court: string;
  jurisdiction: string;
  motions: AdamsMotion[];
}

export interface AdamsMotion {
  id: string;
  type: 'vacate-void-judgment' | 'safe-harbor-letter' | 'bar-complaint';
  status: 'draft' | 'filed' | 'resolved';
  timestamp: number;
}

// Permaweb interfaces
export interface ArweaveTransaction {
  id: string;
  owner: string;
  tags: Record<string, string>;
  data: Uint8Array;
  timestamp: number;
}

export interface InformationSovereignty {
  arweave: {
    gateway: string;
    bundlr: string;
  };
  enabled: boolean;
  documents: ArweaveTransaction[];
}

// VPI Protocol interfaces
export interface VPICommunication {
  enabled: boolean;
  dialects: Record<string, string>;
  impedanceMatching: boolean;
  activeDialect: string;
}

export interface ImpedanceMatch {
  sourceDialect: string;
  targetDialect: string;
  translation: string;
  confidence: number;
}