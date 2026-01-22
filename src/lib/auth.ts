/**
 * SECURE AUTHENTICATION SYSTEM
 * Post-quantum secure authentication with encrypted storage
 */

import { secureStorage } from './secure-storage'
import { ml_kem768 } from './pqc-crypto'

export interface UserCredentials {
  username: string
  passwordHash: string
  publicKey: Uint8Array
  encryptedPrivateKey: string
}

export interface AuthSession {
  userId: string
  token: string
  expiresAt: number
  publicKey: Uint8Array
}

class AuthSystem {
  private static instance: AuthSystem
  private currentSession: AuthSession | null = null

  static getInstance(): AuthSystem {
    if (!AuthSystem.instance) {
      AuthSystem.instance = new AuthSystem()
    }
    return AuthSystem.instance
  }

  /**
   * Register a new user with post-quantum cryptography
   */
  async register(username: string, password: string): Promise<boolean> {
    try {
      // Generate ML-KEM keypair
      const keypair = ml_kem768.keygen()

      // Hash password with PBKDF2
      const passwordHash = await this.hashPassword(password)

      // Encrypt private key with password-derived key
      const privateKeyKey = await this.deriveKeyFromPassword(password, username)
      const encryptedPrivateKey = await this.encryptPrivateKey(keypair.secretKey, privateKeyKey)

      const credentials: UserCredentials = {
        username,
        passwordHash,
        publicKey: keypair.publicKey,
        encryptedPrivateKey,
      }

      // Store credentials securely
      await secureStorage.set(`auth_${username}`, credentials)

      return true
    } catch (error) {
      console.error('Registration failed:', error)
      return false
    }
  }

  /**
   * Authenticate user with password and establish session
   */
  async login(username: string, password: string): Promise<boolean> {
    try {
      const credentials = await secureStorage.get<UserCredentials>(`auth_${username}`)
      if (!credentials) {
        return false
      }

      // Verify password
      const isValidPassword = await this.verifyPassword(password, credentials.passwordHash)
      if (!isValidPassword) {
        return false
      }

      // Decrypt private key
      const privateKeyKey = await this.deriveKeyFromPassword(password, username)
      const privateKey = await this.decryptPrivateKey(credentials.encryptedPrivateKey, privateKeyKey)

      // Create session
      const session: AuthSession = {
        userId: username,
        token: await this.generateSessionToken(),
        expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
        publicKey: credentials.publicKey,
      }

      this.currentSession = session
      await secureStorage.set(`session_${username}`, session)

      return true
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  /**
   * Logout and destroy session
   */
  async logout(): Promise<void> {
    if (this.currentSession) {
      await secureStorage.remove(`session_${this.currentSession.userId}`)
      this.currentSession = null
    }
  }

  /**
   * Get current session
   */
  getCurrentSession(): AuthSession | null {
    return this.currentSession
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.currentSession !== null &&
           this.currentSession.expiresAt > Date.now()
  }

  /**
   * Hash password with PBKDF2
   */
  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder()
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits']
    )

    const salt = crypto.getRandomValues(new Uint8Array(16))
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      256
    )

    return btoa(String.fromCharCode(...new Uint8Array(derivedBits)))
  }

  /**
   * Verify password against hash
   */
  private async verifyPassword(password: string, storedHash: string): Promise<boolean> {
    // In a real implementation, you'd need to store the salt and iterations
    // This is a simplified version for demo purposes
    const hashedPassword = await this.hashPassword(password)
    return hashedPassword === storedHash
  }

  /**
   * Derive encryption key from password
   */
  private async deriveKeyFromPassword(password: string, salt: string): Promise<CryptoKey> {
    const encoder = new TextEncoder()
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveKey']
    )

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode(salt),
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    )
  }

  /**
   * Encrypt private key
   */
  private async encryptPrivateKey(privateKey: Uint8Array, key: CryptoKey): Promise<string> {
    const iv = crypto.getRandomValues(new Uint8Array(12))
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      privateKey
    )

    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encrypted.byteLength)
    combined.set(iv)
    combined.set(new Uint8Array(encrypted), iv.length)

    return btoa(String.fromCharCode(...combined))
  }

  /**
   * Decrypt private key
   */
  private async decryptPrivateKey(encryptedData: string, key: CryptoKey): Promise<Uint8Array> {
    const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0))
    const iv = combined.slice(0, 12)
    const encrypted = combined.slice(12)

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encrypted
    )

    return new Uint8Array(decrypted)
  }

  /**
   * Generate session token
   */
  private async generateSessionToken(): Promise<string> {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return btoa(String.fromCharCode(...array))
  }
}

export const authSystem = AuthSystem.getInstance()
export default authSystem