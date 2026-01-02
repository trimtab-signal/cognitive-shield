/**
 * COGNITIVE SHIELD TYPE DEFINITIONS
 * Branded types for type-level encryption per the Constitution
 */

import type { HumanOSType } from '../god.config';

// === BRANDED TYPES (Type-Level Encryption) ===

declare const EncryptedBrand: unique symbol;
declare const ProcessedBrand: unique symbol;
declare const SanitizedBrand: unique symbol;

/** Raw message that has NOT been processed - treat as hazardous */
export type RawMessage = string & { readonly [EncryptedBrand]: 'raw' };

/** Message that has been processed by the Shield */
export type ProcessedPayload = {
  readonly [ProcessedBrand]: 'processed';
  readonly bluf: string;
  readonly voltage: number;
  readonly triggers: readonly string[];
  readonly humanOS: HumanOSType;
  readonly translation: string;
  readonly why: string;
  readonly timestamp: number;
  readonly id: string;
  readonly spoons: number; // Cognitive cost (1-5)
  readonly emotionalValence: 'calm' | 'affection' | 'anxiety' | 'hostility' | 'neutral';
};

/** Response that has been sanitized for transmission */
export type SanitizedResponse = string & { readonly [SanitizedBrand]: 'sanitized' };

// === SHIELD STATE ===

export interface ShieldState {
  /** Messages waiting in the Catcher's Mitt buffer */
  readonly buffer: readonly BufferedMessage[];
  
  /** Processed payloads ready for viewing */
  readonly processed: readonly ProcessedPayload[];
  
  /** Deep Processing Queue: Gated messages for low-status days */
  readonly deepProcessingQueue: readonly ProcessedPayload[];
  
  /** Whether the Shield is actively batching */
  readonly isBatching: boolean;
  
  /** Time remaining in current batch window (ms) */
  readonly batchTimeRemaining: number;
  
  /** User's detected HumanOS (for response matching) */
  readonly userHumanOS: HumanOSType | null;
  
  /** API key for LLM provider */
  readonly apiKey: string | null;
  
  /** Selected LLM provider */
  readonly provider: LLMProvider;
  
  /** Ollama endpoint (local) */
  readonly ollamaEndpoint: string;
  
  /** Ollama model name */
  readonly ollamaModel: string;
}

export interface BufferedMessage {
  readonly id: string;
  readonly content: RawMessage;
  readonly timestamp: number;
  readonly source: string;
}

export type LLMProvider = 'openai' | 'anthropic' | 'gemini' | 'ollama';

// === SHIELD ACTIONS ===

export interface ShieldActions {
  /** Add raw message to buffer (triggers batching) */
  ingestMessage: (content: string, source?: string) => void;
  
  /** Process all buffered messages through the Shield */
  processBatch: () => Promise<void>;
  
  /** Clear a processed message */
  dismissPayload: (id: string) => void;
  
  /** Set user's HumanOS for response matching */
  setUserHumanOS: (os: HumanOSType) => void;
  
  /** Configure API key */
  setApiKey: (key: string) => void;
  
  /** Set LLM provider */
  setProvider: (provider: LLMProvider) => void;
  
  /** Set Ollama endpoint */
  setOllamaEndpoint: (endpoint: string) => void;
  
  /** Set Ollama model */
  setOllamaModel: (model: string) => void;
  
  /** Clear all state */
  reset: () => void;
  
  /** Move payload from deep processing queue to processed */
  promoteFromDeepQueue: (id: string) => void;
  
  /** Clear deep processing queue */
  clearDeepQueue: () => void;
}

// === API RESPONSE SCHEMA (Pydantic-style) ===

export interface ShieldAPIResponse {
  bluf: string;
  voltage: number;
  triggers: string[];
  humanOS: HumanOSType;
  translation: string;
  why: string;
}

// === TETRAHEDRON NODES ===

export interface TetrahedronNode {
  readonly id: 'A' | 'B' | 'C' | 'D';
  readonly label: string;
  readonly role: 'sender' | 'receiver' | 'context' | 'mediator';
}

export const TETRAHEDRON_NODES: readonly TetrahedronNode[] = Object.freeze([
  { id: 'A', label: 'Sender', role: 'sender' },
  { id: 'B', label: 'Receiver', role: 'receiver' },
  { id: 'C', label: 'Context', role: 'context' },
  { id: 'D', label: 'AI Shield', role: 'mediator' },
] as const);

