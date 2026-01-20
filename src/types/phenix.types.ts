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
 * PHENIX HARDWARE TYPES
 * Type definitions for Phenix Navigator hardware integration
 * 
 * MATH IS KING. THE GEOMETRY RULES.
 */

// ═══════════════════════════════════════════════════════════════════════════
// PHENIX STATE (from firmware)
// ═══════════════════════════════════════════════════════════════════════════

export interface PhenixState {
  nodeId: number;         // 0x01-0xFF
  callsign: string;       // Max 16 chars (e.g., "ARCHITECT")
  name: string;           // Max 32 chars (e.g., "Will")
  role: string;           // Max 16 chars (e.g., "Builder")
  voltage: number;        // 1-10 (emotional intensity)
  spoons: number;         // 0-20 (cognitive energy)
  mode: PhenixMode;
  screen: PhenixScreen;
  battery: number;        // 0-100%
  meshConnected: boolean;
}

export type PhenixMode = 
  | 'normal' 
  | 'grounding' 
  | 'breathing' 
  | 'heavy_work' 
  | 'language' 
  | 'delta';

export type PhenixScreen = 
  | 'dashboard' 
  | 'wifi' 
  | 'draw' 
  | 'info' 
  | 'dev' 
  | 'delta' 
  | 'settings';

// ═══════════════════════════════════════════════════════════════════════════
// WSTP (Whale Song Transport Protocol) - Binary for LoRa
// ═══════════════════════════════════════════════════════════════════════════

export interface WstpTelemetry {
  voltage: number;       // 0-15 (4 bits)
  spoons: number;        // 0-31 (5 bits)
  emergency: boolean;    // SOS flag
  grounding: boolean;    // In grounding mode
  meshConnected: boolean;// Mesh status
  batteryQuad: number;   // 0-7 (battery quadrant)
}

export type WstpPacketType = 
  | 'heartbeat'
  | 'text'
  | 'emergency'
  | 'ack'
  | 'ping'
  | 'pong'
  | 'k4_handshake'
  | 'k4_verify';

// ═══════════════════════════════════════════════════════════════════════════
// COMMAND TYPES (WebSerial JSON)
// ═══════════════════════════════════════════════════════════════════════════

export type ShieldCommandType =
  | 'SET_VOLTAGE'
  | 'SET_SPOONS'
  | 'ENTER_GROUNDING'
  | 'EXIT_GROUNDING'
  | 'TRIGGER_HAPTIC'
  | 'SET_LED_PATTERN'
  | 'SYNC_STATE'
  | 'MESH_BROADCAST'
  | 'PING';

export type HapticType = 'click' | 'detent' | 'success' | 'error';
export type LEDPattern = 'off' | 'pulse' | 'rainbow' | 'alert' | 'party';

export interface PhenixCommand {
  type: ShieldCommandType;
  payload?: Record<string, unknown>;
}

// ═══════════════════════════════════════════════════════════════════════════
// K4 TETRAHEDRON TOPOLOGY
// ═══════════════════════════════════════════════════════════════════════════

export const K4_NODE_COUNT = 4;

export interface TetrahedronNode {
  nodeId: number;
  callsign: string;
  name: string;
  role: string;
  isCore: boolean;
}

export interface K4Keyring {
  nodeIds: number[];
  verified: boolean;
}

// Core tetrahedron members (immutable)
export const CORE_TETRAHEDRON: TetrahedronNode[] = [
  { nodeId: 0x01, callsign: 'ARCHITECT', name: 'Will', role: 'Builder', isCore: true },
  { nodeId: 0x02, callsign: 'PHOENIX', name: 'Christyn', role: 'Rising', isCore: true },
  { nodeId: 0x03, callsign: 'BASH', name: 'Bash', role: 'Wonky Sprout', isCore: true },
  { nodeId: 0x04, callsign: 'WILLOW', name: 'Willow', role: 'Wonky Sprout', isCore: true },
];

// ═══════════════════════════════════════════════════════════════════════════
// CONNECTION STATE
// ═══════════════════════════════════════════════════════════════════════════

export interface PhenixConnectionState {
  isConnected: boolean;
  isConnecting: boolean;
  connectionError: string | null;
  lastSync: number | null;
}

// ═══════════════════════════════════════════════════════════════════════════
// BRIDGE CALLBACKS
// ═══════════════════════════════════════════════════════════════════════════

export interface PhenixBridgeCallbacks {
  onStateUpdate: (state: PhenixState) => void;
  onConnected: () => void;
  onDisconnected: () => void;
  onError: (error: Error) => void;
}
