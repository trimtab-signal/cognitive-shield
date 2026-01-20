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
 * ║   GENESIS GATE LIBRARY INDEX                                               ║
 * ║   Unified Export for Cognitive Shield Systems                              ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

// ═══════════════════════════════════════════════════════════════════════════
// GENSYNC TRANSLATION MATRIX
// ═══════════════════════════════════════════════════════════════════════════

export {
  HUMAN_OS_PROFILES,
  TETRAHEDRON_PRIMITIVES,
  GENSYNC_MATRIX,
  translateBetweenOS,
  getTranslation,
  getAllTranslationsForPrimitive,
  detectHumanOS,
  type HumanOSProfile,
  type PrimitiveDefinition,
  type TranslatedMessage,
  type HumanOSDetection,
} from './gensync-matrix';

// ═══════════════════════════════════════════════════════════════════════════
// DIGITAL CENTAUR STACK
// ═══════════════════════════════════════════════════════════════════════════

export {
  DigitalCentaur,
  type CentaurConfig,
  type CentaurState,
} from './digital-centaur';

// ═══════════════════════════════════════════════════════════════════════════
// TOTEM SYNC PROTOCOL (4-Layer Mobile Stack)
// ═══════════════════════════════════════════════════════════════════════════

export {
  TotemSync,
  rssiToDistance,
  isWithinProximity,
  calculateProximityScore,
  generateTOTP,
  verifyPhenixToken,
  createP2PConnection,
  createDataChannel,
  createGCounter,
  incrementGCounter,
  getGCounterValue,
  mergeGCounters,
  createLWWRegister,
  updateLWWRegister,
  mergeLWWRegisters,
  SovereignVault,
  bytesToHex,
  type ProximityReading,
  type ProximityConfig,
  type PhenixToken,
  type HandshakeResult,
  type P2PChannelConfig,
  type P2PConnection,
  type GCounter,
  type LWWRegister,
  type CareEvent,
  type TotemSyncState,
} from './totem-sync';

// ═══════════════════════════════════════════════════════════════════════════
// CATCHER'S MITT (60-Second Message Buffering)
// ═══════════════════════════════════════════════════════════════════════════

export {
  CatchersMitt,
  analyzeVoltage,
  detectSpiralColor,
  getVoltageStrip,
  type BufferedMessage,
  type MessageMetadata,
  type VoltageThresholds,
  type MittConfig,
  type MittState,
  type MittStats,
  type VoltageStripData,
  type SpiralColor,
} from './catchers-mitt';

// ═══════════════════════════════════════════════════════════════════════════
// WEBCONTAINER RUNTIME (Sandboxed Code Execution)
// ═══════════════════════════════════════════════════════════════════════════

export { WebContainerRuntime } from './webcontainer-runtime';
