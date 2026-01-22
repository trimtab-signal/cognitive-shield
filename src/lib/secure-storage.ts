/**
 * SECURE STORAGE - Encrypted Client-Side Data Management
 * Replaces insecure localStorage with WebCrypto API encryption
 */

import { Buffer } from 'buffer/';

// Encryption key management
class SecureStorage {
  private static instance: SecureStorage;
  private encryptionKey: CryptoKey | null = null;

  private constructor() {}

  static getInstance(): SecureStorage {
    if (!SecureStorage.instance) {
      SecureStorage.instance = new SecureStorage();
    }
    return SecureStorage.instance;
  }

  // Initialize encryption key from password
  async initializeKey(password: string): Promise<void> {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );

    this.encryptionKey = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode('cognitive-shield-salt'),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  // Encrypt and store data
  async setItem(key: string, value: any): Promise<void> {
    if (!this.encryptionKey) {
      throw new Error('SecureStorage not initialized. Call initializeKey() first.');
    }

    const data = JSON.stringify(value);
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);

    const iv = crypto.getRandomValues(new Uint8Array(12));

    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      this.encryptionKey,
      dataBuffer
    );

    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);

    // Store as base64
    const base64Data = Buffer.from(combined).toString('base64');
    localStorage.setItem(`secure_${key}`, base64Data);
  }

  // Retrieve and decrypt data
  async getItem(key: string): Promise<any | null> {
    if (!this.encryptionKey) {
      throw new Error('SecureStorage not initialized. Call initializeKey() first.');
    }

    const base64Data = localStorage.getItem(`secure_${key}`);
    if (!base64Data) return null;

    try {
      const combined = Buffer.from(base64Data, 'base64');
      const iv = combined.slice(0, 12);
      const encrypted = combined.slice(12);

      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        this.encryptionKey,
        encrypted
      );

      const decoder = new TextDecoder();
      const data = decoder.decode(decrypted);
      return JSON.parse(data);
    } catch (error) {
      console.error('Failed to decrypt data:', error);
      return null;
    }
  }

  // Remove encrypted item
  removeItem(key: string): void {
    localStorage.removeItem(`secure_${key}`);
  }

  // Clear all secure storage
  clear(): void {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('secure_'));
    keys.forEach(key => localStorage.removeItem(key));
  }
}

// Legacy insecure localStorage wrapper for non-sensitive data
export const insecureStorage = {
  setItem: (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key: string) => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  },
  removeItem: (key: string) => {
    localStorage.removeItem(key);
  }
};

export const secureStorage = SecureStorage.getInstance();

// Initialize with a default key for demo purposes
// In production, this would be user-provided or derived from authentication
secureStorage.initializeKey('cognitive-shield-default-key').catch(console.error);