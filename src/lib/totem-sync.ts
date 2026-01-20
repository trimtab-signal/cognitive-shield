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
 * ║   TOTEM SYNC PROTOCOL                                                      ║
 * ║   4-Layer Mobile Integration Stack                                         ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 * 
 * Transforms the Wye-native mobile device into a sovereign Delta mesh node.
 * 
 * Layer 0: Physics (Inverse Square Law / BLE Proximity)
 * Layer 1: Handshake (Phenix Token / HSM-signed TOTP)
 * Layer 2: Transport (WebRTC Data Channels)
 * Layer 3: Convergence (Yjs CRDTs)
 * Layer 4: Persistence (PGLite Sovereignty)
 */

// ═══════════════════════════════════════════════════════════════════════════
// LAYER 0: PHYSICS - INVERSE SQUARE LAW
// ═══════════════════════════════════════════════════════════════════════════

export interface ProximityReading {
  rssi: number;           // Received Signal Strength Indicator (dBm)
  distance: number;       // Estimated distance in meters
  timestamp: number;      // Unix timestamp
  deviceId: string;       // BLE device identifier
  txPower: number;        // Transmitted power level
}

export interface ProximityConfig {
  /** Maximum allowed distance for valid "care tick" (meters) */
  maxDistance: number;
  /** Reference RSSI at 1 meter */
  rssiAt1m: number;
  /** Path loss exponent (2.0 = free space, 2.7-4.3 = indoor) */
  pathLossExponent: number;
  /** Minimum sustained time for valid proximity (ms) */
  minDuration: number;
}

const DEFAULT_PROXIMITY_CONFIG: ProximityConfig = {
  maxDistance: 5,          // 5 meter "nurturing radius"
  rssiAt1m: -59,           // Typical BLE RSSI at 1m
  pathLossExponent: 2.7,   // Indoor environment
  minDuration: 60000,      // 1 minute minimum
};

/**
 * Convert RSSI to distance using Log-Distance Path Loss Model
 * RSSI = -10n * log10(d) + A
 * 
 * @param rssi Received signal strength (dBm)
 * @param config Proximity configuration
 * @returns Estimated distance in meters
 */
export function rssiToDistance(
  rssi: number,
  config: ProximityConfig = DEFAULT_PROXIMITY_CONFIG
): number {
  // d = 10^((A - RSSI) / (10 * n))
  const exponent = (config.rssiAt1m - rssi) / (10 * config.pathLossExponent);
  return Math.pow(10, exponent);
}

/**
 * Check if device is within nurturing radius
 */
export function isWithinProximity(
  rssi: number,
  config: ProximityConfig = DEFAULT_PROXIMITY_CONFIG
): boolean {
  const distance = rssiToDistance(rssi, config);
  return distance <= config.maxDistance;
}

/**
 * Calculate proximity score (0-1) based on RSSI
 * Closer = higher score
 */
export function calculateProximityScore(
  rssi: number,
  config: ProximityConfig = DEFAULT_PROXIMITY_CONFIG
): number {
  const distance = rssiToDistance(rssi, config);
  if (distance >= config.maxDistance * 2) return 0;
  if (distance <= 0.5) return 1;
  
  // Inverse square falloff with normalization
  const normalized = 1 - (distance / (config.maxDistance * 2));
  return Math.max(0, Math.min(1, normalized));
}

// ═══════════════════════════════════════════════════════════════════════════
// LAYER 1: HANDSHAKE - PHENIX TOKEN
// ═══════════════════════════════════════════════════════════════════════════

export interface PhenixToken {
  /** Time-based One-Time Password */
  totp: string;
  /** Ed25519 signature from HSM */
  signature: string;
  /** Public key hash (device identity) */
  deviceHash: string;
  /** Token expiry timestamp */
  expiresAt: number;
  /** Sequence number for replay protection */
  sequence: number;
}

export interface HandshakeResult {
  success: boolean;
  token?: PhenixToken;
  sessionKey?: Uint8Array;
  error?: string;
}

/**
 * Generate TOTP using HMAC-SHA256
 * (Simplified - real implementation would use hardware HSM)
 */
export async function generateTOTP(
  secret: Uint8Array,
  timeStep: number = 30
): Promise<string> {
  const counter = Math.floor(Date.now() / 1000 / timeStep);
  const counterBytes = new Uint8Array(8);
  const view = new DataView(counterBytes.buffer);
  view.setBigUint64(0, BigInt(counter), false);
  
  const key = await crypto.subtle.importKey(
    'raw',
    secret.buffer as ArrayBuffer,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, counterBytes.buffer as ArrayBuffer);
  const hash = new Uint8Array(signature);
  
  // Dynamic truncation (RFC 6238)
  const offset = hash[hash.length - 1] & 0x0f;
  const binary = ((hash[offset] & 0x7f) << 24) |
                 ((hash[offset + 1] & 0xff) << 16) |
                 ((hash[offset + 2] & 0xff) << 8) |
                 (hash[offset + 3] & 0xff);
  
  const otp = binary % 1000000;
  return otp.toString().padStart(6, '0');
}

/**
 * Verify a Phenix Token
 */
export async function verifyPhenixToken(
  token: PhenixToken,
  publicKey: Uint8Array
): Promise<boolean> {
  // Check expiry
  if (Date.now() > token.expiresAt) {
    return false;
  }
  
  // Verify signature (simplified - real impl uses Ed25519)
  const message = `${token.totp}:${token.deviceHash}:${token.expiresAt}:${token.sequence}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  
  try {
    const key = await crypto.subtle.importKey(
      'raw',
      publicKey.buffer as ArrayBuffer,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    
    const signatureBytes = hexToBytes(token.signature);
    return await crypto.subtle.verify('HMAC', key, signatureBytes.buffer as ArrayBuffer, data);
  } catch {
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// LAYER 2: TRANSPORT - WEBRTC DATA CHANNELS
// ═══════════════════════════════════════════════════════════════════════════

export interface P2PChannelConfig {
  /** ICE servers for NAT traversal */
  iceServers: RTCIceServer[];
  /** Enable DTLS encryption */
  dtlsEnabled: boolean;
  /** Channel label */
  label: string;
  /** Ordered delivery */
  ordered: boolean;
  /** Max retransmits (0 for unreliable) */
  maxRetransmits?: number;
}

export interface P2PConnection {
  id: string;
  state: 'connecting' | 'connected' | 'disconnected' | 'failed';
  channel: RTCDataChannel | null;
  peer: RTCPeerConnection | null;
  lastActivity: number;
}

const DEFAULT_P2P_CONFIG: P2PChannelConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
  dtlsEnabled: true,
  label: 'phenix-sync',
  ordered: true,
  maxRetransmits: 3,
};

/**
 * Create a P2P connection using WebRTC
 */
export function createP2PConnection(
  config: P2PChannelConfig = DEFAULT_P2P_CONFIG
): RTCPeerConnection {
  return new RTCPeerConnection({
    iceServers: config.iceServers,
  });
}

/**
 * Create a data channel for mesh communication
 */
export function createDataChannel(
  connection: RTCPeerConnection,
  config: P2PChannelConfig = DEFAULT_P2P_CONFIG
): RTCDataChannel {
  return connection.createDataChannel(config.label, {
    ordered: config.ordered,
    maxRetransmits: config.maxRetransmits,
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// LAYER 3: CONVERGENCE - CRDT STATE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Simple G-Counter CRDT for care tracking
 * (Real implementation would use Yjs)
 */
export interface GCounter {
  id: string;
  counts: Map<string, number>;
}

export function createGCounter(id: string): GCounter {
  return {
    id,
    counts: new Map(),
  };
}

export function incrementGCounter(counter: GCounter, nodeId: string): void {
  const current = counter.counts.get(nodeId) || 0;
  counter.counts.set(nodeId, current + 1);
}

export function getGCounterValue(counter: GCounter): number {
  let total = 0;
  for (const count of counter.counts.values()) {
    total += count;
  }
  return total;
}

export function mergeGCounters(a: GCounter, b: GCounter): GCounter {
  const merged: GCounter = {
    id: a.id,
    counts: new Map(a.counts),
  };
  
  for (const [nodeId, count] of b.counts) {
    const current = merged.counts.get(nodeId) || 0;
    merged.counts.set(nodeId, Math.max(current, count));
  }
  
  return merged;
}

/**
 * LWW-Register (Last Writer Wins) for care session state
 */
export interface LWWRegister<T> {
  value: T;
  timestamp: number;
  nodeId: string;
}

export function createLWWRegister<T>(
  value: T,
  nodeId: string
): LWWRegister<T> {
  return {
    value,
    timestamp: Date.now(),
    nodeId,
  };
}

export function updateLWWRegister<T>(
  register: LWWRegister<T>,
  value: T,
  nodeId: string
): LWWRegister<T> {
  return {
    value,
    timestamp: Date.now(),
    nodeId,
  };
}

export function mergeLWWRegisters<T>(
  a: LWWRegister<T>,
  b: LWWRegister<T>
): LWWRegister<T> {
  if (a.timestamp > b.timestamp) return a;
  if (b.timestamp > a.timestamp) return b;
  // Tie-breaker: use node ID
  return a.nodeId > b.nodeId ? a : b;
}

// ═══════════════════════════════════════════════════════════════════════════
// LAYER 4: PERSISTENCE - SOVEREIGN VAULT
// ═══════════════════════════════════════════════════════════════════════════

export interface VaultSchema {
  careEvents: CareEvent[];
  proximityLogs: ProximityLog[];
  tokens: StoredToken[];
  syncState: SyncState;
}

export interface CareEvent {
  id: string;
  timestamp: number;
  guardianId: string;
  childId: string;
  duration: number;        // milliseconds
  proximityScore: number;  // 0-1
  resonanceScore: number;  // 0-1 (Q_res)
  verified: boolean;
}

export interface ProximityLog {
  id: string;
  timestamp: number;
  deviceId: string;
  rssi: number;
  distance: number;
}

export interface StoredToken {
  id: string;
  deviceHash: string;
  publicKey: string;
  createdAt: number;
  lastUsed: number;
}

export interface SyncState {
  lastSync: number;
  vectorClock: Map<string, number>;
  pendingOps: string[];
}

/**
 * In-memory Vault (production would use PGLite/IndexedDB)
 */
export class SovereignVault {
  private data: VaultSchema = {
    careEvents: [],
    proximityLogs: [],
    tokens: [],
    syncState: {
      lastSync: 0,
      vectorClock: new Map(),
      pendingOps: [],
    },
  };

  async addCareEvent(event: CareEvent): Promise<void> {
    this.data.careEvents.push(event);
    this.data.syncState.pendingOps.push(`care:${event.id}`);
  }

  async getCareEvents(
    since?: number,
    guardianId?: string
  ): Promise<CareEvent[]> {
    return this.data.careEvents.filter(e => {
      if (since && e.timestamp < since) return false;
      if (guardianId && e.guardianId !== guardianId) return false;
      return true;
    });
  }

  async addProximityLog(log: ProximityLog): Promise<void> {
    this.data.proximityLogs.push(log);
  }

  async getProximityLogs(deviceId: string, limit: number = 100): Promise<ProximityLog[]> {
    return this.data.proximityLogs
      .filter(l => l.deviceId === deviceId)
      .slice(-limit);
  }

  async calculateCareScore(guardianId: string, since?: number): Promise<number> {
    const events = await this.getCareEvents(since, guardianId);
    
    if (events.length === 0) return 0;
    
    // Care_Score = Σ(T_prox × Q_res) + Tasks_verified
    let score = 0;
    for (const event of events) {
      const tProx = (event.duration / 3600000) * event.proximityScore; // Hours × proximity
      const qRes = event.resonanceScore;
      score += tProx * qRes;
      if (event.verified) score += 1; // Verified task bonus
    }
    
    return score;
  }

  async export(): Promise<VaultSchema> {
    return JSON.parse(JSON.stringify(this.data));
  }

  async import(data: VaultSchema): Promise<void> {
    this.data = data;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// TOTEM SYNC ORCHESTRATOR
// ═══════════════════════════════════════════════════════════════════════════

export interface TotemSyncState {
  layer0: { proximity: ProximityReading | null; score: number };
  layer1: { authenticated: boolean; token: PhenixToken | null };
  layer2: { connected: boolean; peers: string[] };
  layer3: { synced: boolean; version: number };
  layer4: { vault: SovereignVault };
}

export class TotemSync {
  private state: TotemSyncState;
  private config: ProximityConfig;
  
  constructor(config?: Partial<ProximityConfig>) {
    this.config = { ...DEFAULT_PROXIMITY_CONFIG, ...config };
    this.state = {
      layer0: { proximity: null, score: 0 },
      layer1: { authenticated: false, token: null },
      layer2: { connected: false, peers: [] },
      layer3: { synced: false, version: 0 },
      layer4: { vault: new SovereignVault() },
    };
  }

  /**
   * Process BLE proximity reading
   */
  async processProximity(reading: ProximityReading): Promise<void> {
    const score = calculateProximityScore(reading.rssi, this.config);
    this.state.layer0 = { proximity: reading, score };
  }

  /**
   * Authenticate with Phenix token
   */
  async authenticate(token: PhenixToken, publicKey: Uint8Array): Promise<boolean> {
    const valid = await verifyPhenixToken(token, publicKey);
    if (valid) {
      this.state.layer1 = { authenticated: true, token };
    }
    return valid;
  }

  /**
   * Record a care event
   */
  async recordCareEvent(
    guardianId: string,
    childId: string,
    duration: number,
    resonanceScore: number
  ): Promise<CareEvent> {
    const event: CareEvent = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      guardianId,
      childId,
      duration,
      proximityScore: this.state.layer0.score,
      resonanceScore,
      verified: this.state.layer1.authenticated,
    };
    
    await this.state.layer4.vault.addCareEvent(event);
    return event;
  }

  /**
   * Get current care score for a guardian
   */
  async getCareScore(guardianId: string): Promise<number> {
    return this.state.layer4.vault.calculateCareScore(guardianId);
  }

  /**
   * Get full sync state
   */
  getState(): TotemSyncState {
    return this.state;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export default TotemSync;
