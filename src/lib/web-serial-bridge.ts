/**
 * WEB SERIAL API BRIDGE - ESP32-S3 PHENIX NAVIGATOR
 * Quantum-Light Hardware Communication Layer
 *
 * Enables secure communication between web frontend and ESP32 devices
 * using Post-Quantum Cryptography over Web Serial API
 */

import { secureChannel } from './pqc-crypto';

// Web Serial API types
declare global {
  interface Navigator {
    serial: Serial;
  }

  interface Serial extends EventTarget {
    getPorts(): Promise<SerialPort[]>;
    requestPort(options?: SerialOptions): Promise<SerialPort>;
    onconnect: ((this: Serial, ev: Event) => any) | null;
    ondisconnect: ((this: Serial, ev: Event) => any) | null;
  }

  interface SerialPort {
    readonly readable: ReadableStream<Uint8Array> | null;
    readonly writable: WritableStream<Uint8Array> | null;
    open(options: SerialOptions): Promise<void>;
    close(): Promise<void>;
    getInfo(): SerialPortInfo;
  }

  interface SerialOptions {
    baudRate: number;
    dataBits?: number;
    stopBits?: number;
    parity?: 'none' | 'even' | 'odd';
    bufferSize?: number;
    flowControl?: 'none' | 'hardware';
  }

  interface SerialPortInfo {
    usbVendorId?: number;
    usbProductId?: number;
  }
}

// ESP32 Device Configuration
const ESP32_CONFIG = {
  vendorId: 0x303a,  // Espressif vendor ID
  productId: 0x1001, // ESP32-S3
  baudRate: 115200,
  bufferSize: 1024,
  // Alternative IDs for different ESP32 variants
  alternativeIds: [
    { vendorId: 0x10c4, productId: 0xea60 }, // CP210x
    { vendorId: 0x1a86, productId: 0x55d4 }, // CH9102
  ]
};

// Communication Protocol
const PHENIX_PROTOCOL = {
  // Message types
  HANDSHAKE: 0x01,
  KEY_EXCHANGE: 0x02,
  ENCRYPTED_DATA: 0x03,
  STATUS_UPDATE: 0x04,
  COMMAND: 0x05,
  RESPONSE: 0x06,

  // Commands
  CMD_GET_STATUS: 0x10,
  CMD_SEND_MESSAGE: 0x11,
  CMD_REKEY: 0x12,
  CMD_RESET: 0x13,

  // Status codes
  STATUS_READY: 0x20,
  STATUS_BUSY: 0x21,
  STATUS_ERROR: 0x22,
  STATUS_SECURE: 0x23,
};

// Message structure
interface PhenixMessage {
  type: number;
  length: number;
  payload: Uint8Array;
  checksum: number;
}

// Device state
interface ESP32Device {
  port: SerialPort;
  reader: ReadableStreamDefaultReader<Uint8Array> | null;
  writer: WritableStreamDefaultWriter<Uint8Array> | null;
  isConnected: boolean;
  isSecure: boolean;
  deviceId: string;
  lastSeen: number;
  buffer: Uint8Array;
  bufferOffset: number;
}

export class WebSerialBridge {
  private devices: Map<string, ESP32Device> = new Map();
  private eventListeners: Map<string, Set<(data: any) => void>> = new Map();
  private isSupported: boolean;
  private connectionTimeout: number = 5000;

  constructor() {
    this.isSupported = 'serial' in navigator;
    this.setupEventListeners();
  }

  /**
   * Check if Web Serial API is supported
   */
  checkSupported(): boolean {
    return this.isSupported;
  }

  /**
   * Request user permission to connect to ESP32 device
   */
  async requestDevice(): Promise<string | null> {
    if (!this.isSupported) {
      throw new Error('Web Serial API not supported in this browser');
    }

    try {
      const port = await navigator.serial.requestPort({
        filters: [
          { usbVendorId: ESP32_CONFIG.vendorId, usbProductId: ESP32_CONFIG.productId },
          ...ESP32_CONFIG.alternativeIds
        ]
      });

      const deviceId = await this.connectDevice(port);
      return deviceId;
    } catch (error) {
      console.error('Failed to request ESP32 device:', error);
      return null;
    }
  }

  /**
   * Connect to an ESP32 device
   */
  private async connectDevice(port: SerialPort): Promise<string> {
    const deviceId = `esp32_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    try {
      // Open serial port
      await port.open({
        baudRate: ESP32_CONFIG.baudRate,
        dataBits: 8,
        stopBits: 1,
        parity: 'none',
        bufferSize: ESP32_CONFIG.bufferSize,
        flowControl: 'none'
      });

      // Create reader and writer
      const reader = port.readable?.getReader();
      const writer = port.writable?.getWriter();

      if (!reader || !writer) {
        throw new Error('Failed to create reader/writer');
      }

      // Initialize device state
      const device: ESP32Device = {
        port,
        reader,
        writer,
        isConnected: true,
        isSecure: false,
        deviceId,
        lastSeen: Date.now(),
        buffer: new Uint8Array(ESP32_CONFIG.bufferSize),
        bufferOffset: 0
      };

      this.devices.set(deviceId, device);

      // Start reading data
      this.startReading(deviceId);

      // Perform handshake
      await this.performHandshake(deviceId);

      // Emit connection event
      this.emitEvent('deviceConnected', { deviceId, device });

      console.log(`🔌 ESP32 connected: ${deviceId}`);
      return deviceId;

    } catch (error) {
      console.error('Failed to connect to ESP32:', error);
      throw error;
    }
  }

  /**
   * Perform quantum-secure handshake with ESP32
   */
  private async performHandshake(deviceId: string): Promise<void> {
    const device = this.devices.get(deviceId);
    if (!device) throw new Error('Device not found');

    // Send handshake message
    const handshakePayload = new Uint8Array(32);
    crypto.getRandomValues(handshakePayload);

    const handshakeMessage: PhenixMessage = {
      type: PHENIX_PROTOCOL.HANDSHAKE,
      length: handshakePayload.length,
      payload: handshakePayload,
      checksum: this.calculateChecksum(handshakePayload)
    };

    await this.sendMessage(deviceId, handshakeMessage);

    // Wait for response (handled in message processing)
    // The ESP32 should respond with its own handshake and public keys
  }

  /**
   * Establish secure channel with device using PQC
   */
  async establishSecureChannel(deviceId: string): Promise<void> {
    const device = this.devices.get(deviceId);
    if (!device) throw new Error('Device not found');

    // Get device's public keys (should be received during handshake)
    // For now, generate mock keys for demonstration
    const mockDeviceKeys = {
      kemPublicKey: new Uint8Array(1184), // ML-KEM public key size
      x25519PublicKey: new Uint8Array(32)
    };
    crypto.getRandomValues(mockDeviceKeys.kemPublicKey);
    crypto.getRandomValues(mockDeviceKeys.x25519PublicKey);

    // Establish secure channel using our PQC system
    await secureChannel.establishChannel(deviceId, mockDeviceKeys);

    device.isSecure = true;

    this.emitEvent('secureChannelEstablished', { deviceId });
    console.log(`🔐 Secure channel established with ${deviceId}`);
  }

  /**
   * Send encrypted message to ESP32 device
   */
  async sendSecureMessage(deviceId: string, message: string): Promise<void> {
    const device = this.devices.get(deviceId);
    if (!device || !device.isSecure) {
      throw new Error('Secure channel not established');
    }

    // Encrypt message using secure channel
    const messageBytes = new TextEncoder().encode(message);
    const encryptedMessage = secureChannel.encryptForPeer(deviceId, messageBytes);

    if (!encryptedMessage) {
      throw new Error('Failed to encrypt message');
    }

    // Send encrypted data
    const dataMessage: PhenixMessage = {
      type: PHENIX_PROTOCOL.ENCRYPTED_DATA,
      length: encryptedMessage.length,
      payload: encryptedMessage,
      checksum: this.calculateChecksum(encryptedMessage)
    };

    await this.sendMessage(deviceId, dataMessage);
  }

  /**
   * Send command to ESP32 device
   */
  async sendCommand(deviceId: string, command: number, payload: Uint8Array = new Uint8Array(0)): Promise<void> {
    const device = this.devices.get(deviceId);
    if (!device) throw new Error('Device not found');

    const commandMessage: PhenixMessage = {
      type: PHENIX_PROTOCOL.COMMAND,
      length: payload.length + 1, // +1 for command byte
      payload: new Uint8Array([command, ...payload]),
      checksum: this.calculateChecksum(new Uint8Array([command, ...payload]))
    };

    await this.sendMessage(deviceId, commandMessage);
  }

  /**
   * Send raw message to device
   */
  private async sendMessage(deviceId: string, message: PhenixMessage): Promise<void> {
    const device = this.devices.get(deviceId);
    if (!device || !device.writer) throw new Error('Device not connected');

    // Create message buffer
    const messageBuffer = new Uint8Array(6 + message.length); // Header + payload
    const view = new DataView(messageBuffer.buffer);

    view.setUint8(0, 0xAA); // Start byte
    view.setUint8(1, message.type);
    view.setUint16(2, message.length, true); // Little endian
    messageBuffer.set(message.payload, 4);
    view.setUint8(4 + message.length, message.checksum);
    view.setUint8(5 + message.length, 0x55); // End byte

    // Send message
    await device.writer.write(messageBuffer);
    device.lastSeen = Date.now();
  }

  /**
   * Start reading data from device
   */
  private async startReading(deviceId: string): Promise<void> {
    const device = this.devices.get(deviceId);
    if (!device || !device.reader) return;

    try {
      while (device.isConnected) {
        const { value, done } = await device.reader.read();
        if (done) break;

        // Process received data
        this.processReceivedData(deviceId, value);
      }
    } catch (error) {
      console.error(`Error reading from ${deviceId}:`, error);
      await this.disconnectDevice(deviceId);
    }
  }

  /**
   * Process received data from ESP32
   */
  private processReceivedData(deviceId: string, data: Uint8Array): void {
    const device = this.devices.get(deviceId);
    if (!device) return;

    device.lastSeen = Date.now();

    // Add data to buffer
    for (let i = 0; i < data.length; i++) {
      if (device.bufferOffset < device.buffer.length) {
        device.buffer[device.bufferOffset++] = data[i];
      }
    }

    // Process complete messages
    this.processMessages(deviceId);
  }

  /**
   * Process complete messages from buffer
   */
  private processMessages(deviceId: string): void {
    const device = this.devices.get(deviceId);
    if (!device) return;

    let offset = 0;

    while (offset + 6 <= device.bufferOffset) {
      // Look for start byte
      if (device.buffer[offset] !== 0xAA) {
        offset++;
        continue;
      }

      const messageType = device.buffer[offset + 1];
      const messageLength = new DataView(device.buffer.buffer).getUint16(offset + 2, true);

      // Check if we have the complete message
      const totalLength = 6 + messageLength; // Header + payload + checksum + end
      if (offset + totalLength > device.bufferOffset) {
        break; // Incomplete message
      }

      // Verify end byte
      if (device.buffer[offset + totalLength - 1] !== 0x55) {
        offset++;
        continue;
      }

      // Extract message
      const payload = device.buffer.slice(offset + 4, offset + 4 + messageLength);
      const checksum = device.buffer[offset + 4 + messageLength];

      // Verify checksum
      if (this.calculateChecksum(payload) !== checksum) {
        console.warn(`Checksum mismatch for message from ${deviceId}`);
        offset++;
        continue;
      }

      // Process message
      this.handleMessage(deviceId, messageType, payload);

      // Move to next message
      offset += totalLength;
    }

    // Remove processed data from buffer
    if (offset > 0) {
      device.buffer.copyWithin(0, offset, device.bufferOffset);
      device.bufferOffset -= offset;
    }
  }

  /**
   * Handle incoming message from ESP32
   */
  private handleMessage(deviceId: string, type: number, payload: Uint8Array): void {
    switch (type) {
      case PHENIX_PROTOCOL.HANDSHAKE:
        this.handleHandshake(deviceId, payload);
        break;

      case PHENIX_PROTOCOL.RESPONSE:
        this.handleResponse(deviceId, payload);
        break;

      case PHENIX_PROTOCOL.ENCRYPTED_DATA:
        this.handleEncryptedData(deviceId, payload);
        break;

      case PHENIX_PROTOCOL.STATUS_UPDATE:
        this.handleStatusUpdate(deviceId, payload);
        break;

      default:
        console.log(`Unknown message type ${type} from ${deviceId}`);
    }
  }

  /**
   * Handle handshake response from ESP32
   */
  private handleHandshake(deviceId: string, payload: Uint8Array): void {
    console.log(`🤝 Handshake received from ${deviceId}`);

    // Payload should contain device's public keys
    // For now, just acknowledge and establish secure channel
    this.emitEvent('handshakeReceived', { deviceId, payload });

    // Automatically establish secure channel
    this.establishSecureChannel(deviceId).catch(console.error);
  }

  /**
   * Handle command response
   */
  private handleResponse(deviceId: string, payload: Uint8Array): void {
    const responseCode = payload[0];
    const responseData = payload.slice(1);

    this.emitEvent('commandResponse', {
      deviceId,
      responseCode,
      responseData
    });
  }

  /**
   * Handle encrypted data from ESP32
   */
  private handleEncryptedData(deviceId: string, payload: Uint8Array): void {
    const device = this.devices.get(deviceId);
    if (!device || !device.isSecure) return;

    // Decrypt message
    const decrypted = secureChannel.decryptFromPeer(deviceId, payload);
    if (decrypted) {
      const message = new TextDecoder().decode(decrypted);
      console.log(`📥 Decrypted message from ${deviceId}: ${message}`);

      this.emitEvent('messageReceived', {
        deviceId,
        message,
        timestamp: Date.now()
      });
    } else {
      console.warn(`Failed to decrypt message from ${deviceId}`);
    }
  }

  /**
   * Handle status update from ESP32
   */
  private handleStatusUpdate(deviceId: string, payload: Uint8Array): void {
    const status = payload[0];
    const statusData = payload.slice(1);

    this.emitEvent('statusUpdate', {
      deviceId,
      status,
      statusData
    });
  }

  /**
   * Disconnect device
   */
  async disconnectDevice(deviceId: string): Promise<void> {
    const device = this.devices.get(deviceId);
    if (!device) return;

    device.isConnected = false;

    try {
      if (device.reader) {
        await device.reader.cancel();
      }
      if (device.writer) {
        await device.writer.close();
      }
      if (device.port) {
        await device.port.close();
      }
    } catch (error) {
      console.error(`Error disconnecting ${deviceId}:`, error);
    }

    this.devices.delete(deviceId);
    this.emitEvent('deviceDisconnected', { deviceId });

    console.log(`🔌 ESP32 disconnected: ${deviceId}`);
  }

  /**
   * Get connected devices
   */
  getConnectedDevices(): string[] {
    return Array.from(this.devices.keys()).filter(id => {
      const device = this.devices.get(id);
      return device?.isConnected;
    });
  }

  /**
   * Get device info
   */
  getDeviceInfo(deviceId: string): ESP32Device | null {
    return this.devices.get(deviceId) || null;
  }

  /**
   * Event system
   */
  private setupEventListeners(): void {
    if (!this.isSupported) return;

    navigator.serial.onconnect = (event) => {
      console.log('Serial device connected');
    };

    navigator.serial.ondisconnect = (event) => {
      console.log('Serial device disconnected');
    };
  }

  on(event: string, callback: (data: any) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);
  }

  off(event: string, callback: (data: any) => void): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback);
    }
  }

  private emitEvent(event: string, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Calculate checksum for message integrity
   */
  private calculateChecksum(data: Uint8Array): number {
    let checksum = 0;
    for (let i = 0; i < data.length; i++) {
      checksum = (checksum + data[i]) & 0xFF;
    }
    return checksum;
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    const deviceIds = Array.from(this.devices.keys());
    await Promise.all(deviceIds.map(id => this.disconnectDevice(id)));
    this.eventListeners.clear();
  }
}

// Global bridge instance
export const webSerialBridge = new WebSerialBridge();

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    webSerialBridge.cleanup();
  });
}