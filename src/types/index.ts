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
 * Cognitive Shield Type Definitions
 * The structural contracts for the Tetrahedron Protocol
 */

import type { HumanOSType, HeartbeatStatus, DomainType, EvidenceLevel } from '../config/god.config';

// ═══════════════════════════════════════════════════════════════════════════════
// MESSAGE TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/** Raw incoming message before processing */
export interface RawMessage {
  id: string;
  source: 'email' | 'text' | 'chat' | 'manual' | 'navigator';
  sender: string;
  content: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

/** Voltage assessment from AI analysis */
export interface VoltageAssessment {
  /** Overall voltage (0-10) */
  score: number;
  
  /** Breakdown by category */
  breakdown: {
    emotional: number;      // Emotional intensity
    urgency: number;        // Time pressure
    ambiguity: number;      // Unclear expectations
    accusatory: number;     // Blame/attack language
    complexity: number;     // Cognitive load required
  };
  
  /** Detected triggers */
  triggers: string[];
  
  /** Confidence in assessment (0-1) */
  confidence: number;
}

/** Processed message with Shield analysis */
export interface ProcessedMessage {
  id: string;
  raw: RawMessage;
  
  /** Voltage assessment */
  voltage: VoltageAssessment;
  
  /** Detected HumanOS of sender */
  senderOS: HumanOSType;

  /** Detected Knowledge Domain */
  domain: DomainType;

  /** Detected Evidence Level */
  evidence: EvidenceLevel;

  /** Detected PII Types */
  pii: string[];
  
  /** Safe summary (stripped of emotional voltage) */
  safeSummary: string;
  
  /** Key facts extracted */
  facts: string[];
  
  /** Action items (if any) */
  actionItems: string[];
  
  /** Spoon cost to fully engage */
  spoonCost: number;
  
  /** Processing timestamp */
  processedAt: Date;
  
  /** Has the operator viewed the raw content? */
  rawViewed: boolean;
}

/** Message in the Catcher's Mitt buffer */
export interface BufferedMessage {
  message: ProcessedMessage;
  bufferedAt: Date;
  releaseAt: Date;
  priority: 'low' | 'medium' | 'high' | 'bypass';
}

// ═══════════════════════════════════════════════════════════════════════════════
// OPERATOR STATE (Node A)
// ═══════════════════════════════════════════════════════════════════════════════

/** Current operator status */
export interface OperatorState {
  /** Current spoon count */
  spoons: number;
  
  /** Maximum spoons (may vary by day) */
  maxSpoons: number;
  
  /** Heartbeat status */
  heartbeat: HeartbeatStatus;
  
  /** Heartbeat percentage (0-100) */
  heartbeatPercent: number;
  
  /** Is deep processing lock active? */
  deepProcessingLock: boolean;
  
  /** Last check-in timestamp */
  lastCheckIn: Date;
  
  /** Current stress indicators */
  stressIndicators: {
    physicalTension: number;  // 0-10
    mentalLoad: number;       // 0-10
    emotionalState: number;   // 0-10
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// TRANSLATION TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/** Translation request for outgoing messages */
export interface TranslationRequest {
  /** Raw operator input */
  rawInput: string;
  
  /** Target HumanOS */
  targetOS: HumanOSType;
  
  /** Context from conversation */
  context?: string;
  
  /** Desired tone */
  tone?: 'neutral' | 'warm' | 'firm' | 'formal';
}

/** Translated message ready for sending */
export interface TranslatedMessage {
  /** Original input */
  original: string;
  
  /** Translated output */
  translated: string;
  
  /** Target OS */
  targetOS: HumanOSType;
  
  /** Translation notes (for operator review) */
  notes: string[];
  
  /** Voltage of translated message (should be lower) */
  outputVoltage: number;
  
  /** Key changes made */
  changes: {
    from: string;
    to: string;
    reason: string;
  }[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATOR INTEGRATION TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/** Quantum state telemetry from Navigator */
export interface QuantumState {
  /** Bloch sphere vector */
  vector: [number, number, number];
  
  /** Fidelity score */
  fidelity: number;
  
  /** Timestamp */
  timestamp: Date;
  
  /** Source node ID */
  nodeId: string;
}

/** Quantum anomaly alert */
export interface QuantumAnomaly {
  type: 'drift' | 'decoherence' | 'interference' | 'unknown';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  quantumState: QuantumState;
  timestamp: Date;
}

/** Mesh network node status */
export interface MeshNode {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'degraded';
  lastHeartbeat: Date;
  trustScore: number;
  quantumState?: QuantumState;
}

/** Tetrahedron visualization data */
export interface TetrahedronVisualization {
  nodes: {
    A: { position: [number, number, number]; label: string; status: string };
    B: { position: [number, number, number]; label: string; status: string };
    C: { position: [number, number, number]; label: string; status: string };
    D: { position: [number, number, number]; label: string; status: string };
  };
  edges: {
    from: 'A' | 'B' | 'C' | 'D';
    to: 'A' | 'B' | 'C' | 'D';
    strength: number;
    status: 'healthy' | 'stressed' | 'broken';
  }[];
  overallHealth: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SOMATIC REGULATION TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/** Somatic protocol types */
export type SomaticProtocol = 'limeDrag' | 'rose' | 'heavyWork' | 'youAreSafe';

/** Protocol session */
export interface SomaticSession {
  protocol: SomaticProtocol;
  startedAt: Date;
  completedAt?: Date;
  duration: number; // seconds
  spoonRecovery: number;
  notes?: string;
}

/** Lime Drag configuration */
export interface LimeDragConfig {
  /** Duration in seconds */
  duration: number;
  /** Visual element to track */
  trackingElement: 'circle' | 'line' | 'figure8';
  /** Speed (pixels per second) */
  speed: number;
}

/** Rose Protocol configuration */
export interface RoseConfig {
  /** Number of spiral iterations */
  iterations: number;
  /** Breathing pattern */
  breathPattern: {
    inhale: number;  // seconds
    hold: number;    // seconds
    exhale: number;  // seconds
  };
}

/** Heavy Work log entry */
export interface HeavyWorkEntry {
  activity: string;
  duration: number; // minutes
  intensity: 'light' | 'moderate' | 'heavy';
  timestamp: Date;
  spoonRecovery: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// STORE TYPES (Zustand)
// ═══════════════════════════════════════════════════════════════════════════════

/** Shield store state */
export interface ShieldState {
  /** Current raw message being processed */
  rawMessage: RawMessage | null;
  
  /** Processed message with analysis */
  processedPayload: ProcessedMessage | null;
  
  /** Current voltage (quick access) */
  voltage: number;
  
  /** Ollivier-Ricci curvature of message */
  curvature: number;
  
  /** Detected HumanOS */
  humanOS: HumanOSType | null;

  /** Detected Domain */
  domain: DomainType | null;
  
  /** Is processing in progress? */
  isProcessing: boolean;
  
  /** Error state */
  error: string | null;
}

/** Shield store actions */
export interface ShieldActions {
  /** Submit raw message for processing */
  submitMessage: (message: RawMessage) => Promise<void>;
  
  /** Clear current message */
  clearMessage: () => void;
  
  /** Mark raw as viewed */
  markRawViewed: () => void;
  
  /** Reset error */
  clearError: () => void;
}

/** Heartbeat store state */
export interface HeartbeatState {
  operator: OperatorState;
}

/** Heartbeat store actions */
export interface HeartbeatActions {
  /** Update spoon count */
  updateSpoons: (delta: number) => void;
  
  /** Set spoons to specific value */
  setSpoons: (value: number) => void;
  
  /** Perform heartbeat check-in */
  checkIn: (status: Partial<OperatorState>) => void;
  
  /** Toggle deep processing lock */
  toggleDeepProcessingLock: (locked: boolean) => void;
  
  /** Update stress indicators */
  updateStress: (indicators: Partial<OperatorState['stressIndicators']>) => void;
}

/** Buffer store state */
export interface BufferState {
  /** Messages in the Catcher's Mitt */
  buffer: BufferedMessage[];
  
  /** Is batch processing active? */
  isBatching: boolean;
}

/** Buffer store actions */
export interface BufferActions {
  /** Add message to buffer */
  addToBuffer: (message: ProcessedMessage) => void;
  
  /** Release message from buffer */
  releaseMessage: (id: string) => void;
  
  /** Get ready messages (past release time) */
  getReadyMessages: () => BufferedMessage[];
  
  /** Clear all buffers */
  clearBuffer: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════════
// AI SERVICE TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/** Ollama API request */
export interface OllamaRequest {
  model: string;
  prompt: string;
  system?: string;
  stream?: boolean;
  options?: {
    temperature?: number;
    num_predict?: number;
  };
}

/** Ollama API response */
export interface OllamaResponse {
  model: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  eval_count?: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// UI COMPONENT PROPS
// ═══════════════════════════════════════════════════════════════════════════════

/** Common accessibility props */
export interface A11yProps {
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-live'?: 'polite' | 'assertive' | 'off';
  role?: string;
}

/** Message display props */
export interface MessageDisplayProps {
  message: ProcessedMessage;
  showRaw?: boolean;
  onRevealRaw?: () => void;
  compact?: boolean;
}

/** Voltage indicator props */
export interface VoltageIndicatorProps {
  voltage: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
}

/** Tetrahedron props */
export interface TetrahedronProps {
  visualization: TetrahedronVisualization;
  interactive?: boolean;
  onNodeClick?: (node: 'A' | 'B' | 'C' | 'D') => void;
  size?: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/** Deep partial for nested optional properties */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/** Extract keys of a certain type */
export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

/** Make specific keys required */
export type RequireKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;
