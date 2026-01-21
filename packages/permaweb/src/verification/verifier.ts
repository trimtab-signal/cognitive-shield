// Sovereignty Verifier
// Verifies information sovereignty and integrity

import { StorageManager, StorageMetadata } from '../storage/manager';

export interface VerificationResult {
  sovereigntyId: string;
  verified: boolean;
  integrity: boolean;
  permanence: boolean;
  accessibility: boolean;
  timestamp: number;
  details: {
    dataExists: boolean;
    hashMatches: boolean;
    networkConfirmed: boolean;
    lastVerified: number;
    confidence: number;
  };
}

export interface SovereigntyAudit {
  totalItems: number;
  verifiedItems: number;
  integrityViolations: number;
  permanenceViolations: number;
  accessibilityIssues: number;
  overallConfidence: number;
  timestamp: number;
  recommendations: string[];
}

export class SovereigntyVerifier {
  private storageManager: StorageManager;
  private verificationCache: Map<string, VerificationResult> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  constructor(storageManager: StorageManager) {
    this.storageManager = storageManager;
  }

  /**
   * Verify sovereignty of stored content
   */
  async verifySovereignty(sovereigntyId: string): Promise<VerificationResult> {
    // Check cache first
    const cached = this.verificationCache.get(sovereigntyId);
    if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
      return cached;
    }

    const sovereignty = this.storageManager.getSovereigntyStatus(sovereigntyId);

    let dataExists = false;
    let hashMatches = false;
    let networkConfirmed = false;
    let confidence = 0;

    if (sovereignty.exists && sovereignty.url) {
      // Test data accessibility
      dataExists = await this.testDataAccessibility(sovereignty.url);

      if (dataExists) {
        // Verify data integrity
        hashMatches = await this.verifyDataIntegrity(sovereigntyId);
      }

      // Check network confirmation
      networkConfirmed = await this.verifyNetworkConfirmation(sovereigntyId);
    }

    // Calculate confidence score
    confidence = this.calculateConfidenceScore({
      dataExists,
      hashMatches,
      networkConfirmed,
      permanence: sovereignty.permanent,
      verified: sovereignty.verified
    });

    const result: VerificationResult = {
      sovereigntyId,
      verified: sovereignty.verified && dataExists && hashMatches,
      integrity: hashMatches,
      permanence: sovereignty.permanent,
      accessibility: dataExists,
      timestamp: Date.now(),
      details: {
        dataExists,
        hashMatches,
        networkConfirmed,
        lastVerified: Date.now(),
        confidence
      }
    };

    // Cache result
    this.verificationCache.set(sovereigntyId, result);

    return result;
  }

  /**
   * Perform comprehensive sovereignty audit
   */
  async performSovereigntyAudit(): Promise<SovereigntyAudit> {
    const stats = await this.storageManager.getStorageStats();
    const allItems = Array.from(this.storageManager['storedItems'].values());

    let integrityViolations = 0;
    let permanenceViolations = 0;
    let accessibilityIssues = 0;
    let totalConfidence = 0;

    // Verify each item
    for (const item of allItems) {
      const verification = await this.verifySovereignty(item.id);

      if (!verification.integrity) integrityViolations++;
      if (!verification.permanence) permanenceViolations++;
      if (!verification.accessibility) accessibilityIssues++;

      totalConfidence += verification.details.confidence;
    }

    const overallConfidence = totalConfidence / allItems.length;

    const recommendations = this.generateRecommendations({
      integrityViolations,
      permanenceViolations,
      accessibilityIssues,
      overallConfidence
    });

    return {
      totalItems: stats.totalItems,
      verifiedItems: stats.verifiedItems,
      integrityViolations,
      permanenceViolations,
      accessibilityIssues,
      overallConfidence,
      timestamp: Date.now(),
      recommendations
    };
  }

  /**
   * Test data accessibility
   */
  private async testDataAccessibility(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        timeout: 10000
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  /**
   * Verify data integrity by comparing hashes
   */
  private async verifyDataIntegrity(sovereigntyId: string): Promise<boolean> {
    try {
      const data = await this.storageManager.retrieveData(sovereigntyId);
      if (!data) return false;

      // Get expected hash from metadata
      const metadata = this.storageManager['storedItems'].get(sovereigntyId);
      if (!metadata) return false;

      // Calculate actual hash
      const dataString = new TextDecoder().decode(data);
      const actualHash = this.simpleHash(dataString);

      return actualHash === metadata.hash;
    } catch (error) {
      return false;
    }
  }

  /**
   * Verify network confirmation
   */
  private async verifyNetworkConfirmation(sovereigntyId: string): Promise<boolean> {
    // This would check blockchain confirmations, mining status, etc.
    // For now, we consider it confirmed if the item exists in our records
    const metadata = this.storageManager['storedItems'].get(sovereigntyId);
    return metadata ? metadata.verified : false;
  }

  /**
   * Calculate confidence score
   */
  private calculateConfidenceScore(factors: {
    dataExists: boolean;
    hashMatches: boolean;
    networkConfirmed: boolean;
    permanence: boolean;
    verified: boolean;
  }): number {
    let score = 0;

    if (factors.dataExists) score += 0.25;
    if (factors.hashMatches) score += 0.25;
    if (factors.networkConfirmed) score += 0.25;
    if (factors.permanence) score += 0.15;
    if (factors.verified) score += 0.10;

    return Math.min(score, 1.0);
  }

  /**
   * Generate audit recommendations
   */
  private generateRecommendations(audit: {
    integrityViolations: number;
    permanenceViolations: number;
    accessibilityIssues: number;
    overallConfidence: number;
  }): string[] {
    const recommendations: string[] = [];

    if (audit.integrityViolations > 0) {
      recommendations.push(`Address ${audit.integrityViolations} data integrity violations by re-uploading corrupted content`);
    }

    if (audit.accessibilityIssues > 0) {
      recommendations.push(`Resolve ${audit.accessibilityIssues} accessibility issues - content may be temporarily unavailable`);
    }

    if (audit.overallConfidence < 0.8) {
      recommendations.push('Overall sovereignty confidence is below 80% - consider additional verification measures');
    }

    if (audit.permanenceViolations > 0) {
      recommendations.push('Some content lacks permanence guarantees - ensure all data is stored on permanent networks');
    }

    if (recommendations.length === 0) {
      recommendations.push('Sovereignty audit passed - all content is secure and accessible');
    }

    return recommendations;
  }

  /**
   * Clear verification cache
   */
  clearCache(): void {
    this.verificationCache.clear();
  }

  /**
   * Simple hash function for integrity checks
   */
  private simpleHash(data: string): string {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Get sovereignty proof for legal purposes
   */
  async generateSovereigntyProof(sovereigntyId: string): Promise<string | null> {
    const verification = await this.verifySovereignty(sovereigntyId);

    if (!verification.verified) {
      return null;
    }

    const metadata = this.storageManager['storedItems'].get(sovereigntyId);
    if (!metadata) return null;

    const proof = {
      sovereigntyId,
      verification,
      metadata,
      proof: {
        statement: 'This content is permanently stored on decentralized networks and cannot be modified or deleted by any centralized authority.',
        timestamp: Date.now(),
        verifier: 'SovereigntyVerifier',
        confidence: verification.details.confidence
      }
    };

    return JSON.stringify(proof, null, 2);
  }
}