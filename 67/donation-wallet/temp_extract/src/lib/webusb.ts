/**
 * WebUSB Integration for Phenix Navigator
 * The Hardware Root of Trust - Built with Love
 * 
 * "The private key NEVER leaves the ESP32.
 *  The browser builds the transaction, the hardware signs it.
 *  Physics cannot lie."
 */

import type { 
  HexString, 
  PhenixCommand, 
  PhenixDeviceInfo, 
  UnsignedTransaction,
  ECDSASignature,
  NavigatorStatus 
} from '../types';

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

/** Espressif USB Vendor ID */
const ESPRESSIF_VID = 0x303A;

/** Phenix Navigator Product ID (custom) */
const PHENIX_PID = 0x1001;

/** Command codes matching ESP32 firmware */
const CMD = {
  GET_INFO: 0x01,
  SIGN_TX: 0x02,
  SIGN_MSG: 0x03,
  GET_ADDRESS: 0x04,
} as const;

/** Response status codes */
const STATUS = {
  OK: 0x00,
  ERROR: 0x01,
  USER_REJECTED: 0x02,
  LOCKED: 0x03,
  TIMEOUT: 0x04,
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// PHENIX NAVIGATOR CLASS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * WebUSB interface to Phenix Navigator hardware wallet
 * 
 * This is the "House of Lords" in the bi-cameral security model.
 * It holds ultimate veto power over transactions.
 */
export class PhenixNavigator {
  private device: USBDevice | null = null;
  private info: PhenixDeviceInfo | null = null;
  
  /**
   * Check if WebUSB is supported in this browser
   */
  static isSupported(): boolean {
    return 'usb' in navigator;
  }
  
  /**
   * Request access to a Phenix Navigator device
   * Shows browser permission dialog to user
   */
  async connect(): Promise<NavigatorStatus> {
    if (!PhenixNavigator.isSupported()) {
      return {
        connected: false,
        device: null,
        info: null,
        lastError: 'WebUSB not supported in this browser',
      };
    }
    
    try {
      // Request device with Phenix filter
      this.device = await navigator.usb.requestDevice({
        filters: [
          { vendorId: ESPRESSIF_VID, productId: PHENIX_PID },
          { vendorId: ESPRESSIF_VID }, // Fallback for development
        ],
      });
      
      // Open device
      await this.device.open();
      
      // Select configuration (usually 1)
      if (this.device.configuration === null) {
        await this.device.selectConfiguration(1);
      }
      
      // Claim interface (usually 0 for CDC/HID)
      await this.device.claimInterface(0);
      
      // Get device info
      this.info = await this.getDeviceInfo();
      
      return {
        connected: true,
        device: this.device,
        info: this.info,
        lastError: null,
      };
    } catch (error) {
      return {
        connected: false,
        device: null,
        info: null,
        lastError: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
  
  /**
   * Disconnect from the device
   */
  async disconnect(): Promise<void> {
    if (this.device) {
      try {
        await this.device.releaseInterface(0);
        await this.device.close();
      } catch {
        // Ignore errors on disconnect
      }
      this.device = null;
      this.info = null;
    }
  }
  
  /**
   * Get device information
   */
  private async getDeviceInfo(): Promise<PhenixDeviceInfo> {
    const response = await this.sendCommand(CMD.GET_INFO, new Uint8Array(0));
    
    // Parse response
    const decoder = new TextDecoder();
    const data = JSON.parse(decoder.decode(response));
    
    return {
      version: data.version || '0.0.0',
      serial: data.serial || 'unknown',
      publicKey: data.publicKey || '0x',
      locked: data.locked || false,
    };
  }
  
  /**
   * Sign a transaction on the hardware
   * 
   * The device will:
   * 1. Parse and display transaction details
   * 2. Wait for physical button confirmation
   * 3. Return signature (r, s, v)
   * 
   * @param tx - Unsigned transaction
   * @returns ECDSA signature
   */
  async signTransaction(tx: UnsignedTransaction): Promise<ECDSASignature> {
    if (!this.device || !this.info) {
      throw new Error('Device not connected');
    }
    
    if (this.info.locked) {
      throw new Error('Device is locked');
    }
    
    // Serialize transaction for hardware
    const txData = this.serializeTransaction(tx);
    
    // Send to device
    const response = await this.sendCommand(CMD.SIGN_TX, txData);
    
    // Parse signature response
    return this.parseSignature(response);
  }
  
  /**
   * Sign a message (EIP-191)
   * Used for proving ownership or authentication
   * 
   * @param message - Message to sign
   * @returns ECDSA signature
   */
  async signMessage(message: string): Promise<ECDSASignature> {
    if (!this.device || !this.info) {
      throw new Error('Device not connected');
    }
    
    if (this.info.locked) {
      throw new Error('Device is locked');
    }
    
    // Encode message
    const encoder = new TextEncoder();
    const messageData = encoder.encode(message);
    
    // Send to device
    const response = await this.sendCommand(CMD.SIGN_MSG, messageData);
    
    // Parse signature response
    return this.parseSignature(response);
  }
  
  /**
   * Get an address for a specific BIP-44 path
   * 
   * @param path - BIP-44 derivation path
   * @returns Ethereum address
   */
  async getAddress(path: string = "m/44'/60'/0'/0/0"): Promise<HexString> {
    if (!this.device) {
      throw new Error('Device not connected');
    }
    
    const encoder = new TextEncoder();
    const pathData = encoder.encode(path);
    
    const response = await this.sendCommand(CMD.GET_ADDRESS, pathData);
    
    const decoder = new TextDecoder();
    const data = JSON.parse(decoder.decode(response));
    
    return data.address as HexString;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // PRIVATE METHODS
  // ═══════════════════════════════════════════════════════════════════════════════
  
  /**
   * Send a command to the device and wait for response
   */
  private async sendCommand(cmd: number, data: Uint8Array): Promise<Uint8Array> {
    if (!this.device) {
      throw new Error('Device not connected');
    }
    
    // Build command packet
    // Format: [CMD (1 byte)] [LENGTH (2 bytes, little-endian)] [DATA]
    const packet = new Uint8Array(3 + data.length);
    packet[0] = cmd;
    packet[1] = data.length & 0xFF;
    packet[2] = (data.length >> 8) & 0xFF;
    packet.set(data, 3);
    
    // Send to device (endpoint 1)
    await this.device.transferOut(1, packet);
    
    // Wait for response (endpoint 1, max 1024 bytes)
    // Timeout after 60 seconds (user needs time to confirm)
    const result = await Promise.race([
      this.device.transferIn(1, 1024),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Device timeout')), 60000)
      ),
    ]);
    
    // Parse response
    if (!result.data) {
      throw new Error('No data received from device');
    }
    
    const responseData = new Uint8Array(result.data.buffer);
    
    // Check status byte
    const status = responseData[0];
    if (status === STATUS.USER_REJECTED) {
      throw new Error('User rejected on device');
    } else if (status === STATUS.LOCKED) {
      throw new Error('Device is locked');
    } else if (status === STATUS.TIMEOUT) {
      throw new Error('Device timeout');
    } else if (status !== STATUS.OK) {
      throw new Error(`Device error: ${status}`);
    }
    
    // Return data without status byte
    return responseData.slice(1);
  }
  
  /**
   * Serialize a transaction for the device
   * Uses JSON for simplicity (device parses and displays)
   */
  private serializeTransaction(tx: UnsignedTransaction): Uint8Array {
    const txObject = {
      to: tx.to,
      value: tx.value.toString(),
      data: tx.data,
      nonce: tx.nonce,
      gasLimit: tx.gasLimit.toString(),
      maxFeePerGas: tx.maxFeePerGas.toString(),
      maxPriorityFeePerGas: tx.maxPriorityFeePerGas.toString(),
      chainId: tx.chainId,
    };
    
    const encoder = new TextEncoder();
    return encoder.encode(JSON.stringify(txObject));
  }
  
  /**
   * Parse a signature response from the device
   */
  private parseSignature(data: Uint8Array): ECDSASignature {
    // Format: r (32 bytes) + s (32 bytes) + v (1 byte)
    if (data.length < 65) {
      throw new Error('Invalid signature length');
    }
    
    const r = data.slice(0, 32);
    const s = data.slice(32, 64);
    const v = data[64];
    
    return {
      r: ('0x' + Array.from(r).map(b => b.toString(16).padStart(2, '0')).join('')) as HexString,
      s: ('0x' + Array.from(s).map(b => b.toString(16).padStart(2, '0')).join('')) as HexString,
      v,
    };
  }
  
  /**
   * Get current status
   */
  getStatus(): NavigatorStatus {
    return {
      connected: this.device !== null,
      device: this.device,
      info: this.info,
      lastError: null,
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLETON INSTANCE
// ═══════════════════════════════════════════════════════════════════════════════

/** Global navigator instance */
export const phenixNavigator = new PhenixNavigator();
