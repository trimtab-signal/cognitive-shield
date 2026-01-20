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
 * ║   PHENIX PROTOCOL - Hardware Bridge to Cognitive Shield                   ║
 * ║   WSTP (Whale Song Transport Protocol) Implementation                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 * 
 * MATH IS KING. THE GEOMETRY RULES.
 * 
 * Matches: phenix/src/shield_protocol.h
 * 
 * WSTP Binary Schema:
 * - Telemetry packets: 2 bytes (bit-packed voltage, spoons, flags)
 * - Text packets: Shoco-compressed + encrypted
 * - Max LoRa payload: 50 bytes @ SF12/915MHz ("Whale Song" bandwidth)
 */

// WebSerial API types (Chrome-only experimental)

// ═══════════════════════════════════════════════════════════════════════════
// PROTOCOL CONSTANTS - Must match Phenix firmware
// ═══════════════════════════════════════════════════════════════════════════

export const SHIELD_PROTOCOL_VERSION = '1.0.0';
export const SHIELD_BAUD_RATE = 115200;
export const WSTP_MAX_PAYLOAD = 50; // Whale Song limit (bytes)

// ═══════════════════════════════════════════════════════════════════════════
// COMMAND TYPES - Sync with shield_protocol.h
// ═══════════════════════════════════════════════════════════════════════════

export const ShieldCommandType = {
  SET_VOLTAGE: 'SET_VOLTAGE',
  SET_SPOONS: 'SET_SPOONS',
  ENTER_GROUNDING: 'ENTER_GROUNDING',
  EXIT_GROUNDING: 'EXIT_GROUNDING',
  TRIGGER_HAPTIC: 'TRIGGER_HAPTIC',
  SET_LED_PATTERN: 'SET_LED_PATTERN',
  SYNC_STATE: 'SYNC_STATE',
  MESH_BROADCAST: 'MESH_BROADCAST',
  PING: 'PING',
} as const;

export type ShieldCommandType = typeof ShieldCommandType[keyof typeof ShieldCommandType];

export type HapticType = 'click' | 'detent' | 'success' | 'error';
export type LEDPattern = 'off' | 'pulse' | 'rainbow' | 'alert' | 'party';

// ═══════════════════════════════════════════════════════════════════════════
// STATE STRUCTURE - Extended with sensor data
// ═══════════════════════════════════════════════════════════════════════════

export interface PhenixState {
  nodeId: number;         // 0x01-0xFF
  callsign: string;       // Max 16 chars
  name: string;           // Max 32 chars
  role: string;           // Max 16 chars
  voltage: number;        // 1-10
  spoons: number;         // 0-20
  mode: PhenixMode;
  screen: PhenixScreen;
  battery: number;        // 0-100
  meshConnected: boolean;
  encoderDelta?: number;  // Rotary encoder change since last update
  
  // Extended sensor data for visualization
  accelerometer?: {
    x: number;  // Raw IMU values (-8192 to 8192 typical)
    y: number;
    z: number;
  };
  touch?: {
    active: boolean;
    x: number;  // Screen coords (0-480)
    y: number;  // Screen coords (0-320)
  };
  wifi?: {
    connected: boolean;
    rssi: number;     // dBm (-30 to -90)
    networks: number; // Scanned networks count
  };
  rtc?: {
    timestamp: number;
    formatted: string;
  };
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
// WSTP BIT-PACKED TELEMETRY (2 bytes)
// ═══════════════════════════════════════════════════════════════════════════
// 
// Byte layout for "Whale Song" efficiency:
// ┌─────────────────────────────────────────────────────────────────┐
// │ Bits 0-3   │ voltage (4 bits, 0-15, we use 1-10)               │
// │ Bits 4-8   │ spoons (5 bits, 0-31, we use 0-20)                │
// │ Bit 9      │ emergency flag                                     │
// │ Bit 10     │ grounding active                                   │
// │ Bit 11     │ mesh connected                                     │
// │ Bits 12-15 │ reserved (future: battery quadrant)               │
// └─────────────────────────────────────────────────────────────────┘

export interface TelemetryPacket {
  voltage: number;
  spoons: number;
  emergency: boolean;
  grounding: boolean;
  meshConnected: boolean;
}

export function encodeTelemetry(packet: TelemetryPacket): Uint8Array {
  let packed = 0;
  packed |= (packet.voltage & 0x0F);           // 4 bits
  packed |= (packet.spoons & 0x1F) << 4;       // 5 bits
  packed |= (packet.emergency ? 1 : 0) << 9;   // 1 bit
  packed |= (packet.grounding ? 1 : 0) << 10;  // 1 bit
  packed |= (packet.meshConnected ? 1 : 0) << 11; // 1 bit
  
  return new Uint8Array([
    packed & 0xFF,
    (packed >> 8) & 0xFF,
  ]);
}

export function decodeTelemetry(data: Uint8Array): TelemetryPacket {
  const packed = data[0] | (data[1] << 8);
  
  return {
    voltage: packed & 0x0F,
    spoons: (packed >> 4) & 0x1F,
    emergency: !!(packed & (1 << 9)),
    grounding: !!(packed & (1 << 10)),
    meshConnected: !!(packed & (1 << 11)),
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// WEBSERIAL BRIDGE - The "Psychic Link"
// ═══════════════════════════════════════════════════════════════════════════

export interface PhenixBridgeCallbacks {
  onStateUpdate: (state: PhenixState) => void;
  onConnected: () => void;
  onDisconnected: () => void;
  onError: (error: Error) => void;
}

export class PhenixBridge {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private port: any = null;
  private reader: ReadableStreamDefaultReader<string> | null = null;
  private writer: WritableStreamDefaultWriter<Uint8Array> | null = null;
  private callbacks: PhenixBridgeCallbacks;
  private connected = false;
  private buffer = '';
  private pingInterval: ReturnType<typeof setInterval> | null = null;

  constructor(callbacks: PhenixBridgeCallbacks) {
    this.callbacks = callbacks;
  }

  /**
   * Check if WebSerial is supported
   */
  static isSupported(): boolean {
    return 'serial' in navigator;
  }

  /**
   * Connect to Phenix Navigator via WebSerial
   */
  async connect(): Promise<void> {
    if (!PhenixBridge.isSupported()) {
      throw new Error('WebSerial not supported in this browser');
    }

    try {
      // Request port with ESP32-S3 USB filter
      // @ts-expect-error - WebSerial API not in all TS libs
      this.port = await navigator.serial.requestPort({
        filters: [
          { usbVendorId: 0x303A }, // Espressif ESP32-S3 VID
          { usbVendorId: 0x10C4 }, // Silicon Labs (common USB-UART)
          { usbVendorId: 0x1A86 }, // CH340 (cheap USB-UART)
        ],
      });

      await this.port.open({ baudRate: SHIELD_BAUD_RATE });

      // Set up text decoder stream
      const textDecoder = new TextDecoderStream();
      // Store promise for cleanup (intentionally not awaited)
      void this.port.readable!.pipeTo(textDecoder.writable);
      this.reader = textDecoder.readable.getReader();

      // Set up writer
      this.writer = this.port.writable!.getWriter();

      this.connected = true;
      this.callbacks.onConnected();

      // Start reading
      this.readLoop();

      // Start ping interval
      this.pingInterval = setInterval(() => {
        if (this.connected) {
          this.sendCommand({ type: ShieldCommandType.PING });
        }
      }, 5000);

      console.log('[Phenix] Connected via WebSerial');
    } catch (error) {
      this.callbacks.onError(error as Error);
      throw error;
    }
  }

  /**
   * Disconnect from Phenix
   */
  async disconnect(): Promise<void> {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }

    if (this.reader) {
      await this.reader.cancel();
      this.reader = null;
    }

    if (this.writer) {
      await this.writer.close();
      this.writer = null;
    }

    if (this.port) {
      await this.port.close();
      this.port = null;
    }

    this.connected = false;
    this.callbacks.onDisconnected();
    console.log('[Phenix] Disconnected');
  }

  /**
   * Check connection status
   */
  isConnected(): boolean {
    return this.connected;
  }

  /**
   * Read incoming data from Phenix
   */
  private async readLoop(): Promise<void> {
    while (this.reader && this.connected) {
      try {
        const { value, done } = await this.reader.read();
        if (done) break;

        this.buffer += value;

        // Process complete lines
        let newlineIndex;
        while ((newlineIndex = this.buffer.indexOf('\n')) !== -1) {
          const line = this.buffer.substring(0, newlineIndex).trim();
          this.buffer = this.buffer.substring(newlineIndex + 1);

          if (line) {
            this.processLine(line);
          }
        }
      } catch (error) {
        if (this.connected) {
          console.error('[Phenix] Read error:', error);
          this.callbacks.onError(error as Error);
        }
        break;
      }
    }

    if (this.connected) {
      this.connected = false;
      this.callbacks.onDisconnected();
    }
  }

  /**
   * Process incoming line from Phenix (JSON or tagged format)
   * 
   * Supports:
   * - JSON: {"voltage": 5, "spoons": 10, ...}
   * - Tagged: [TAG] data (e.g., [ACCEL] X=144 Y=333 Z=-8194)
   */
  private processLine(line: string): void {
    // Try JSON first
    if (line.startsWith('{')) {
      try {
        const state = JSON.parse(line) as PhenixState;
        this.callbacks.onStateUpdate(state);
        return;
      } catch {
        // Not valid JSON, continue to tag parsing
      }
    }
    
    // Parse tagged format from Phenix firmware
    this.parseTaggedLine(line);
  }

  /**
   * Parse tagged serial output from Phenix firmware
   * Format: [TAG] data
   */
  private parseTaggedLine(line: string): void {
    // Build incremental state updates
    const update = this.buildStateUpdate(line);
    if (update) {
      // Merge with existing state
      const currentState = this.lastKnownState || this.createDefaultState();
      const newState = { ...currentState, ...update };
      this.lastKnownState = newState;
      this.callbacks.onStateUpdate(newState);
    }
  }

  private lastKnownState: PhenixState | null = null;

  private createDefaultState(): PhenixState {
    return {
      nodeId: 0x01,
      callsign: 'PHENIX',
      name: 'Navigator',
      role: 'Node',
      voltage: 5,
      spoons: 10,
      mode: 'normal',
      screen: 'dashboard',
      battery: 100,
      meshConnected: false,
    };
  }

  /**
   * Parse tagged line into partial state update
   */
  private buildStateUpdate(line: string): Partial<PhenixState> | null {
    // [ARCHITECT] F=750 H=266K S=0 T=Y R=1 BAT=100% W=off
    if (line.includes('[ARCHITECT]') || line.includes('BAT=')) {
      const batMatch = line.match(/BAT=(\d+)%/);
      const wifiMatch = line.match(/W=(on|off)/i);
      const freqMatch = line.match(/F=(\d+)/);
      
      return {
        battery: batMatch ? parseInt(batMatch[1]) : undefined,
        wifi: {
          connected: wifiMatch ? wifiMatch[1].toLowerCase() === 'on' : false,
          rssi: -70,
          networks: 0,
        },
        voltage: freqMatch ? Math.min(10, Math.floor(parseInt(freqMatch[1]) / 100)) : undefined,
      };
    }
    
    // [ACCEL] X=144 Y=333 Z=-8194
    if (line.includes('[ACCEL]')) {
      const match = line.match(/X=(-?\d+)\s+Y=(-?\d+)\s+Z=(-?\d+)/);
      if (match) {
        return {
          accelerometer: {
            x: parseInt(match[1]),
            y: parseInt(match[2]),
            z: parseInt(match[3]),
          },
        };
      }
    }
    
    // [T] 236,187 (touch)
    if (line.includes('[T]')) {
      const match = line.match(/\[T\]\s*(\d+),(\d+)/);
      if (match) {
        return {
          touch: {
            active: true,
            x: parseInt(match[1]),
            y: parseInt(match[2]),
          },
        };
      }
    }
    
    // Touch release (no coords)
    if (line.includes('[T] released') || line.includes('[T] idle')) {
      return {
        touch: {
          active: false,
          x: 0,
          y: 0,
        },
      };
    }
    
    // [OK] 7 networks (WiFi scan)
    if (line.includes('[OK]') && line.includes('networks')) {
      const match = line.match(/(\d+)\s+networks/);
      if (match) {
        return {
          wifi: {
            connected: true,
            rssi: -50,
            networks: parseInt(match[1]),
          },
        };
      }
    }
    
    // [RTC] timestamp
    if (line.includes('[RTC]')) {
      return {
        rtc: {
          timestamp: Date.now(),
          formatted: line.replace('[RTC]', '').trim(),
        },
      };
    }
    
    // [MODE] breathing / grounding / normal
    if (line.includes('[MODE]')) {
      const mode = line.toLowerCase();
      if (mode.includes('breathing')) return { mode: 'breathing' };
      if (mode.includes('grounding')) return { mode: 'grounding' };
      if (mode.includes('heavy')) return { mode: 'heavy_work' };
      if (mode.includes('delta')) return { mode: 'delta' };
      return { mode: 'normal' };
    }
    
    // [APP] Clock opened / Dashboard / etc
    if (line.includes('[APP]')) {
      const screen = line.toLowerCase();
      if (screen.includes('clock') || screen.includes('dashboard')) return { screen: 'dashboard' };
      if (screen.includes('wifi')) return { screen: 'wifi' };
      if (screen.includes('draw')) return { screen: 'draw' };
      if (screen.includes('info')) return { screen: 'info' };
      if (screen.includes('dev')) return { screen: 'dev' };
      if (screen.includes('delta')) return { screen: 'delta' };
    }
    
    // Debug output - just log it
    console.debug('[Phenix]', line);
    return null;
  }

  /**
   * Send command to Phenix
   */
  async sendCommand(command: PhenixCommand): Promise<void> {
    if (!this.writer || !this.connected) {
      throw new Error('Not connected to Phenix');
    }

    const json = JSON.stringify(command) + '\n';
    const encoder = new TextEncoder();
    await this.writer.write(encoder.encode(json));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // HIGH-LEVEL API
  // ═══════════════════════════════════════════════════════════════════════════

  async setVoltage(voltage: number): Promise<void> {
    await this.sendCommand({
      type: ShieldCommandType.SET_VOLTAGE,
      payload: { voltage: Math.max(1, Math.min(10, voltage)) },
    });
  }

  async setSpoons(spoons: number): Promise<void> {
    await this.sendCommand({
      type: ShieldCommandType.SET_SPOONS,
      payload: { spoons: Math.max(0, Math.min(20, spoons)) },
    });
  }

  async enterGrounding(): Promise<void> {
    await this.sendCommand({ type: ShieldCommandType.ENTER_GROUNDING });
  }

  async exitGrounding(): Promise<void> {
    await this.sendCommand({ type: ShieldCommandType.EXIT_GROUNDING });
  }

  async triggerHaptic(type: HapticType): Promise<void> {
    await this.sendCommand({
      type: ShieldCommandType.TRIGGER_HAPTIC,
      payload: { type },
    });
  }

  async setLEDPattern(pattern: LEDPattern): Promise<void> {
    await this.sendCommand({
      type: ShieldCommandType.SET_LED_PATTERN,
      payload: { pattern },
    });
  }

  async syncState(state: Partial<PhenixState>): Promise<void> {
    await this.sendCommand({
      type: ShieldCommandType.SYNC_STATE,
      payload: state,
    });
  }

  async broadcastMesh(message: string): Promise<void> {
    await this.sendCommand({
      type: ShieldCommandType.MESH_BROADCAST,
      payload: { message },
    });
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// COMMAND TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type PhenixCommand =
  | { type: typeof ShieldCommandType.SET_VOLTAGE; payload: { voltage: number } }
  | { type: typeof ShieldCommandType.SET_SPOONS; payload: { spoons: number } }
  | { type: typeof ShieldCommandType.ENTER_GROUNDING }
  | { type: typeof ShieldCommandType.EXIT_GROUNDING }
  | { type: typeof ShieldCommandType.TRIGGER_HAPTIC; payload: { type: HapticType } }
  | { type: typeof ShieldCommandType.SET_LED_PATTERN; payload: { pattern: LEDPattern } }
  | { type: typeof ShieldCommandType.SYNC_STATE; payload: Partial<PhenixState> }
  | { type: typeof ShieldCommandType.MESH_BROADCAST; payload: { message: string } }
  | { type: typeof ShieldCommandType.PING };

// ═══════════════════════════════════════════════════════════════════════════
// K4 TETRAHEDRON TOPOLOGY ENFORCEMENT
// ═══════════════════════════════════════════════════════════════════════════
// Math is King: Groups must be exactly 4 nodes (K₄ complete graph)

export const K4_NODE_COUNT = 4;

export interface TetrahedronNode {
  nodeId: number;
  callsign: string;
  name: string;
  role: string;
  isCore: boolean;
}

export const CORE_TETRAHEDRON: TetrahedronNode[] = [
  { nodeId: 0x01, callsign: 'ARCHITECT', name: 'Will', role: 'Builder', isCore: true },
  { nodeId: 0x02, callsign: 'PHOENIX', name: 'Christyn', role: 'Rising', isCore: true },
  { nodeId: 0x03, callsign: 'BASH', name: 'Bash', role: 'Wonky Sprout', isCore: true },
  { nodeId: 0x04, callsign: 'WILLOW', name: 'Willow', role: 'Wonky Sprout', isCore: true },
];

/**
 * Validate K₄ topology - exactly 4 nodes, all connected
 */
export function validateK4Topology(nodes: TetrahedronNode[]): boolean {
  if (nodes.length !== K4_NODE_COUNT) {
    console.error(`[K4] Invalid node count: ${nodes.length}, expected ${K4_NODE_COUNT}`);
    return false;
  }
  
  // Verify unique node IDs
  const ids = new Set(nodes.map(n => n.nodeId));
  if (ids.size !== K4_NODE_COUNT) {
    console.error('[K4] Duplicate node IDs detected');
    return false;
  }
  
  return true;
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT DEFAULT INSTANCE FACTORY
// ═══════════════════════════════════════════════════════════════════════════

export function createPhenixBridge(callbacks: PhenixBridgeCallbacks): PhenixBridge {
  return new PhenixBridge(callbacks);
}

export default PhenixBridge;
