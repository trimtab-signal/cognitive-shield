// Cryptographic utilities for MASTER_PROJECT

import { sha256, sha512 } from '@noble/hashes/sha256';
import { randomBytes } from 'crypto';

// Generate cryptographically secure random bytes
export function generateSecureRandom(length: number = 32): Uint8Array {
  return randomBytes(length);
}

// Hash functions
export function hashSHA256(data: Uint8Array): Uint8Array {
  return sha256(data);
}

export function hashSHA512(data: Uint8Array): Uint8Array {
  return sha512(data);
}

// Convert hash to hex string
export function hashToHex(hash: Uint8Array): string {
  return Array.from(hash)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Generate a deterministic hash from string input
export function hashString(input: string): string {
  const data = new TextEncoder().encode(input);
  return hashToHex(hashSHA256(data));
}

// Generate a nonce for cryptographic operations
export function generateNonce(length: number = 16): string {
  return hashToHex(generateSecureRandom(length));
}

// Simple XOR encryption/decryption (for basic obfuscation only)
// NOT for secure encryption - use proper crypto libraries
export function xorEncrypt(data: Uint8Array, key: Uint8Array): Uint8Array {
  const result = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) {
    result[i] = data[i] ^ key[i % key.length];
  }
  return result;
}

export function xorDecrypt(data: Uint8Array, key: Uint8Array): Uint8Array {
  return xorEncrypt(data, key); // XOR is symmetric
}

// Generate a key from password using simple PBKDF2-like derivation
// In production, use proper PBKDF2 or Argon2
export function deriveKey(password: string, salt: Uint8Array, iterations: number = 10000): Uint8Array {
  let key = new TextEncoder().encode(password);
  key = new Uint8Array([...key, ...salt]);

  for (let i = 0; i < iterations; i++) {
    key = hashSHA256(key);
  }

  return key.slice(0, 32); // Return first 32 bytes as key
}

// Timing-safe comparison to prevent timing attacks
export function timingSafeEquals(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a[i] ^ b[i];
  }

  return result === 0;
}

// Generate a session token
export function generateSessionToken(): string {
  const randomPart = generateSecureRandom(16);
  const timestamp = new Uint8Array(8);
  const now = Date.now();
  for (let i = 0; i < 8; i++) {
    timestamp[i] = (now >> (i * 8)) & 0xff;
  }

  const combined = new Uint8Array([...randomPart, ...timestamp]);
  return hashToHex(hashSHA256(combined));
}

// Validate session token format (basic check)
export function isValidSessionToken(token: string): boolean {
  // Check if it's a valid hex string of expected length (64 chars for SHA256)
  return /^[a-f0-9]{64}$/i.test(token);
}

// Generate a unique identifier
export function generateUUID(): string {
  const randomPart = generateSecureRandom(16);
  // Set version (4) and variant bits according to RFC 4122
  randomPart[6] = (randomPart[6] & 0x0f) | 0x40; // Version 4
  randomPart[8] = (randomPart[8] & 0x3f) | 0x80; // Variant 10

  const hex = Array.from(randomPart)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

// Key rotation utilities
export interface KeyRotation {
  currentKey: Uint8Array;
  previousKeys: Uint8Array[];
  rotationInterval: number; // milliseconds
  lastRotation: number;
}

export function shouldRotateKey(rotation: KeyRotation): boolean {
  return Date.now() - rotation.lastRotation > rotation.rotationInterval;
}

export function rotateKey(rotation: KeyRotation): KeyRotation {
  const newKey = generateSecureRandom(32);
  return {
    currentKey: newKey,
    previousKeys: [rotation.currentKey, ...rotation.previousKeys.slice(0, 4)], // Keep last 5 keys
    rotationInterval: rotation.rotationInterval,
    lastRotation: Date.now(),
  };
}

// Zero out sensitive data from memory
export function zeroize(data: Uint8Array): void {
  for (let i = 0; i < data.length; i++) {
    data[i] = 0;
  }
}

// Secure key storage (in-memory only - for demo purposes)
// In production, use proper key management systems
class SecureKeyStore {
  private keys: Map<string, Uint8Array> = new Map();

  store(keyId: string, key: Uint8Array): void {
    this.keys.set(keyId, new Uint8Array(key)); // Copy to prevent external modification
  }

  retrieve(keyId: string): Uint8Array | undefined {
    const key = this.keys.get(keyId);
    return key ? new Uint8Array(key) : undefined; // Return copy
  }

  delete(keyId: string): boolean {
    const key = this.keys.get(keyId);
    if (key) {
      zeroize(key);
      return this.keys.delete(keyId);
    }
    return false;
  }

  clear(): void {
    for (const key of this.keys.values()) {
      zeroize(key);
    }
    this.keys.clear();
  }
}

export const secureKeyStore = new SecureKeyStore();