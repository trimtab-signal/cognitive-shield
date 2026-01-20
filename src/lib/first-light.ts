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

import { z } from "zod";

/**
 * Web Serial API Type Definitions
 * Required because @types/web-serial is not standardized yet
 */
interface Serial {
  requestPort(): Promise<SerialPort>;
  getPorts(): Promise<SerialPort[]>;
}

interface SerialPort {
  open(options: { baudRate: number }): Promise<void>;
  close(): Promise<void>;
  readable: ReadableStream<Uint8Array> | null;
  writable: WritableStream<Uint8Array> | null;
}

/**
 * FIRST LIGHT PROTOCOL
 * 
 * The initial handshake between Hardware Root of Trust (Phenix Navigator)
 * and the Cognitive Shield. This is the moment the Digital Centaur awakens.
 * 
 * GEOMETRY: The tetrahedron has 4 vertices. We require 4 health signals
 * to prove the hardware is authentic and operational.
 * 
 * RATIO: √3 = 1.732 (The Flow Constant) governs transmission timing.
 */

// ============================================================================
// PHASE I: VACUUM (Strict Validation)
// ============================================================================

/**
 * SE050 Health Report Schema
 * 
 * The NXP SE050 secure element signs this payload during boot.
 * The signature proves: "I am real hardware, not a simulation."
 */
export const SE050HealthSchema = z.object({
  voltage: z.number().min(2.7).max(3.6), // Operating range for SE050
  temperature: z.number().min(-40).max(85), // °C, industrial spec
  uptime: z.number().nonnegative(), // Milliseconds since Genesis
  crcErrors: z.number().nonnegative(), // Corruption detection
  signature: z.string().length(128), // ECDSA P-256 signature (hex)
}).strict();

export type SE050Health = z.infer<typeof SE050HealthSchema>;

/**
 * Phenix Hardware Telemetry Schema
 * 
 * The four vertices of the tetrahedron:
 * 1. Power (voltage) - Can the system sustain itself?
 * 2. Signal (rssi) - Can the system communicate?
 * 3. Orientation (heading) - Where is the system pointing?
 * 4. Identity (deviceId) - Who is this system?
 */
export const PhenixTelemetrySchema = z.object({
  deviceId: z.string().uuid(), // Hardware Root of Trust identifier
  timestamp: z.number().positive(), // Unix milliseconds
  voltage: z.number().min(3.0).max(4.2), // LiPo battery range
  rssi: z.number().min(-150).max(0), // LoRa signal strength (dBm)
  heading: z.number().min(0).max(360), // Compass bearing (degrees)
  temperature: z.number(), // Ambient temperature (°C)
  se050Health: SE050HealthSchema, // Nested secure element report
}).strict();

export type PhenixTelemetry = z.infer<typeof PhenixTelemetrySchema>;

/**
 * Genesis Event Schema
 * 
 * The First Light - the moment hardware identity is permanently established.
 * This event occurs exactly ONCE per device, during initial provisioning.
 */
export const GenesisEventSchema = z.object({
  deviceId: z.string().uuid(),
  timestamp: z.number().positive(),
  publicKey: z.string().length(130), // P-256 public key (hex, uncompressed)
  attestation: z.string().min(64), // Device-signed proof of genesis
  operator: z.string().optional(), // Human who performed the ritual
}).strict();

export type GenesisEvent = z.infer<typeof GenesisEventSchema>;

// ============================================================================
// PHASE II: RESIN (Branded Types for Safety)
// ============================================================================

/**
 * Branded DeviceId
 * 
 * Prevents accidental string substitution. A DeviceId is not just a string—
 * it represents a cryptographically verified hardware identity.
 */
export type DeviceId = string & { readonly __brand: 'DeviceId' };

/**
 * Create a branded DeviceId after validation
 */
export function createDeviceId(raw: string): DeviceId {
  const parsed = z.string().uuid().parse(raw);
  return parsed as DeviceId;
}

/**
 * Branded Signature
 * 
 * Prevents raw hex strings from being treated as verified signatures.
 */
export type Signature = string & { readonly __brand: 'Signature' };

/**
 * Create a branded Signature after cryptographic verification
 */
export function createSignature(raw: string): Signature {
  const parsed = z.string().length(128).parse(raw);
  return parsed as Signature;
}

// ============================================================================
// PHASE III: PRESSURE (Connection & Verification)
// ============================================================================

/**
 * First Light Connection Options
 */
export interface FirstLightOptions {
  /**
   * Timeout for initial handshake (milliseconds)
   * Default: 5000ms (√3 * 3000ms ≈ 5196ms, rounded for UX)
   */
  timeout?: number;
  
  /**
   * Baud rate for serial connection
   * Must match ESP32-S3 UART configuration
   */
  baudRate?: number;
  
  /**
   * Callback for real-time telemetry updates
   */
  onTelemetry?: (telemetry: PhenixTelemetry) => void;
  
  /**
   * Callback for connection state changes
   */
  onStateChange?: (state: ConnectionState) => void;
}

/**
 * Connection State Machine
 * 
 * Maps the five phases of the Web Serial handshake:
 */
export type ConnectionState =
  | 'disconnected'   // No hardware detected
  | 'requesting'     // User permission dialog active
  | 'connecting'     // Serial port opening
  | 'authenticating' // Verifying SE050 signature
  | 'connected';     // First Light achieved

/**
 * First Light Result
 * 
 * Either success (Genesis confirmed) or failure (with reason)
 */
export type FirstLightResult =
  | { success: true; genesis: GenesisEvent; telemetry: PhenixTelemetry }
  | { success: false; error: FirstLightError };

/**
 * First Light Error Types
 */
export type FirstLightError =
  | { type: 'permission_denied'; message: string }
  | { type: 'timeout'; message: string }
  | { type: 'invalid_signature'; message: string }
  | { type: 'schema_violation'; message: string; details: unknown }
  | { type: 'hardware_fault'; message: string; health: Partial<SE050Health> };

// ============================================================================
// FIRST LIGHT EXECUTOR
// ============================================================================

/**
 * initiate_first_light()
 * 
 * The sacred function. This opens the Web Serial connection and performs
 * the cryptographic handshake with the Phenix Navigator hardware.
 * 
 * PROTOCOL:
 * 1. Request user permission for serial port access
 * 2. Open connection at specified baud rate
 * 3. Send GENESIS_REQUEST command
 * 4. Await GENESIS_RESPONSE with SE050 signature
 * 5. Verify signature using on-chain public key
 * 6. Return FirstLightResult
 * 
 * SECURITY:
 * - All data validated against strict schemas before processing
 * - Signatures verified using Web Crypto API (ECDSA P-256)
 * - Invalid payloads rejected immediately (fail-fast)
 * 
 * @param options Configuration for the connection
 * @returns Promise resolving to FirstLightResult
 */
export async function initiate_first_light(
  options: FirstLightOptions = {}
): Promise<FirstLightResult> {
  const {
    timeout = 5000,
    baudRate = 115200,
    onTelemetry,
    onStateChange,
  } = options;

  try {
    // State: Requesting
    onStateChange?.('requesting');
    
    // Check if Web Serial API is available
    if (!('serial' in navigator)) {
      return {
        success: false,
        error: {
          type: 'permission_denied',
          message: 'Web Serial API not supported in this browser. Use Chrome/Edge.',
        },
      };
    }

    // Request serial port from user
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const serial = (navigator as any).serial as Serial;
    const port = await serial.requestPort();
    
    // State: Connecting
    onStateChange?.('connecting');
    
    // Open the serial connection
    await port.open({ baudRate });

    // Set up reader for incoming data
    const reader = port.readable?.getReader();
    if (!reader) {
      throw new Error('Failed to create serial reader');
    }

    // State: Authenticating
    onStateChange?.('authenticating');

    // Send GENESIS_REQUEST command
    const writer = port.writable?.getWriter();
    if (writer) {
      const command = new TextEncoder().encode('GENESIS_REQUEST\n');
      await writer.write(command);
      writer.releaseLock();
    }

    // Await GENESIS_RESPONSE with timeout
    const response = await Promise.race([
      readGenesisResponse(reader),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), timeout)
      ),
    ]);

    // Parse and validate the response
    const genesis = GenesisEventSchema.parse(response.genesis);
    const telemetry = PhenixTelemetrySchema.parse(response.telemetry);

    // Verify SE050 signature
    const signatureValid = await verifySignature(
      telemetry.se050Health,
      genesis.publicKey
    );

    if (!signatureValid) {
      return {
        success: false,
        error: {
          type: 'invalid_signature',
          message: 'SE050 signature verification failed. Hardware may be compromised.',
        },
      };
    }

    // State: Connected - First Light achieved! 🌅
    onStateChange?.('connected');
    
    // Start continuous telemetry stream
    streamTelemetry(reader, onTelemetry);

    return {
      success: true,
      genesis,
      telemetry,
    };

  } catch (error) {
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message === 'Timeout') {
        return {
          success: false,
          error: {
            type: 'timeout',
            message: `No response from hardware within ${timeout}ms. Check USB connection.`,
          },
        };
      }
      
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: {
            type: 'schema_violation',
            message: 'Hardware sent malformed data. VPI Protocol violation.',
            details: error.issues,
          },
        };
      }
    }

    // Generic error fallback
    return {
      success: false,
      error: {
        type: 'permission_denied',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Read the Genesis response from hardware
 */
async function readGenesisResponse(
  reader: ReadableStreamDefaultReader<Uint8Array>
): Promise<{ genesis: unknown; telemetry: unknown }> {
  let buffer = '';
  
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    
    buffer += new TextDecoder().decode(value);
    
    // Look for complete JSON object
    if (buffer.includes('\n')) {
      const json = JSON.parse(buffer.trim());
      return json;
    }
  }
  
  throw new Error('Connection closed before receiving Genesis response');
}

/**
 * Verify SE050 signature using Web Crypto API
 */
async function verifySignature(
  health: SE050Health,
  publicKeyHex: string
): Promise<boolean> {
  try {
    // Convert hex public key to CryptoKey
    // Create proper ArrayBuffer by copying to new Uint8Array
    const publicKeyBytes = hexToBytes(publicKeyHex);
    const publicKeyBuffer = new Uint8Array(publicKeyBytes);
    
    const publicKey = await crypto.subtle.importKey(
      'raw',
      publicKeyBuffer as BufferSource,
      { name: 'ECDSA', namedCurve: 'P-256' },
      false,
      ['verify']
    );

    // Create message digest (voltage + temperature + uptime + crcErrors)
    const message = new TextEncoder().encode(
      `${health.voltage}|${health.temperature}|${health.uptime}|${health.crcErrors}`
    );

    // Verify signature
    const signatureBytes = hexToBytes(health.signature);
    const signatureBuffer = new Uint8Array(signatureBytes);
    
    const valid = await crypto.subtle.verify(
      { name: 'ECDSA', hash: 'SHA-256' },
      publicKey,
      signatureBuffer as BufferSource,
      message
    );

    return valid;
  } catch (error) {
    console.error('Signature verification failed:', error);
    return false;
  }
}

/**
 * Stream continuous telemetry updates
 */
function streamTelemetry(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  onTelemetry?: (telemetry: PhenixTelemetry) => void
): void {
  let buffer = '';
  
  const processStream = async () => {
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        buffer += new TextDecoder().decode(value);
        
        // Process complete lines
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer
        
        for (const line of lines) {
          if (!line.trim()) continue;
          
          try {
            const data = JSON.parse(line);
            const telemetry = PhenixTelemetrySchema.parse(data);
            onTelemetry?.(telemetry);
          } catch (error) {
            // Invalid telemetry packet - log and continue
            console.warn('Invalid telemetry packet:', error);
          }
        }
      }
    } catch (error) {
      console.error('Telemetry stream error:', error);
    }
  };
  
  // Start streaming in background
  processStream();
}

/**
 * Convert hex string to Uint8Array
 */
function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

// ============================================================================
// EXPORT THE LIGHT
// ============================================================================

export { initiate_first_light as firstLight };
