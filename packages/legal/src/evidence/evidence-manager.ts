// Evidence Management System
// Handles evidence collection, verification, and chain of custody

import { EvidenceItem, CustodyRecord } from '../case-management/case-manager';

export interface EvidenceVerification {
  evidenceId: string;
  verified: boolean;
  verifiedBy: string;
  verifiedAt: Date;
  method: 'hash-verification' | 'notarization' | 'blockchain' | 'permaweb';
  verificationData: string; // Hash, TX ID, etc.
  confidence: number; // 0-1
}

export interface EvidencePackage {
  id: string;
  title: string;
  description: string;
  items: EvidenceItem[];
  createdAt: Date;
  sealed: boolean;
  sealHash?: string;
}

export class EvidenceManager {
  private evidence: Map<string, EvidenceItem> = new Map();
  private verifications: Map<string, EvidenceVerification[]> = new Map();
  private packages: Map<string, EvidencePackage> = new Map();

  /**
   * Add evidence item to the system
   */
  addEvidence(
    type: EvidenceItem['type'],
    title: string,
    description: string,
    custodian: string,
    fileUrl?: string
  ): EvidenceItem {
    const evidenceId = `evidence_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const evidenceItem: EvidenceItem = {
      id: evidenceId,
      type,
      title,
      date: new Date(),
      description,
      fileUrl,
      verified: false,
      chainOfCustody: [{
        custodian,
        timestamp: new Date(),
        action: 'received',
        notes: 'Initial evidence collection'
      }]
    };

    this.evidence.set(evidenceId, evidenceItem);
    return evidenceItem;
  }

  /**
   * Transfer custody of evidence
   */
  transferCustody(
    evidenceId: string,
    fromCustodian: string,
    toCustodian: string,
    notes?: string
  ): boolean {
    const evidence = this.evidence.get(evidenceId);
    if (!evidence) return false;

    // Verify current custodian
    const lastRecord = evidence.chainOfCustody[evidence.chainOfCustody.length - 1];
    if (lastRecord.custodian !== fromCustodian) {
      throw new Error(`Custody transfer failed: Current custodian is ${lastRecord.custodian}, not ${fromCustodian}`);
    }

    // Add transfer record
    evidence.chainOfCustody.push({
      custodian: toCustodian,
      timestamp: new Date(),
      action: 'transferred',
      notes: notes || `Transferred from ${fromCustodian} to ${toCustodian}`
    });

    return true;
  }

  /**
   * Verify evidence using specified method
   */
  verifyEvidence(
    evidenceId: string,
    method: EvidenceVerification['method'],
    verifier: string,
    verificationData: string,
    confidence: number = 1.0
  ): boolean {
    const evidence = this.evidence.get(evidenceId);
    if (!evidence) return false;

    const verification: EvidenceVerification = {
      evidenceId,
      verified: true,
      verifiedBy: verifier,
      verifiedAt: new Date(),
      method,
      verificationData,
      confidence
    };

    // Add verification record
    const existingVerifications = this.verifications.get(evidenceId) || [];
    existingVerifications.push(verification);
    this.verifications.set(evidenceId, existingVerifications);

    // Update evidence verification status
    evidence.verified = true;

    // Add custody record
    evidence.chainOfCustody.push({
      custodian: verifier,
      timestamp: new Date(),
      action: 'archived',
      notes: `Verified using ${method}: ${verificationData}`
    });

    return true;
  }

  /**
   * Store evidence on permaweb (Arweave)
   */
  async storeOnPermaweb(
    evidenceId: string,
    arweaveTxId: string,
    custodian: string
  ): Promise<boolean> {
    const evidence = this.evidence.get(evidenceId);
    if (!evidence) return false;

    evidence.permawebTxId = arweaveTxId;

    // Add custody record
    evidence.chainOfCustody.push({
      custodian,
      timestamp: new Date(),
      action: 'permaweb-stored',
      notes: `Stored on Arweave: ${arweaveTxId}`
    });

    // Auto-verify based on permaweb storage
    return this.verifyEvidence(
      evidenceId,
      'permaweb',
      custodian,
      arweaveTxId,
      0.99 // High confidence for permaweb
    );
  }

  /**
   * Create evidence package for court filing
   */
  createEvidencePackage(
    title: string,
    description: string,
    evidenceIds: string[]
  ): EvidencePackage | null {
    // Verify all evidence exists
    const validEvidence: EvidenceItem[] = [];
    for (const id of evidenceIds) {
      const evidence = this.evidence.get(id);
      if (evidence) {
        validEvidence.push(evidence);
      }
    }

    if (validEvidence.length === 0) return null;

    const packageId = `package_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const evidencePackage: EvidencePackage = {
      id: packageId,
      title,
      description,
      items: validEvidence,
      createdAt: new Date(),
      sealed: false
    };

    this.packages.set(packageId, evidencePackage);
    return evidencePackage;
  }

  /**
   * Seal evidence package (create immutable hash)
   */
  sealEvidencePackage(packageId: string): string | null {
    const evidencePackage = this.packages.get(packageId);
    if (!evidencePackage || evidencePackage.sealed) return null;

    // Create package manifest
    const manifest = {
      id: evidencePackage.id,
      title: evidencePackage.title,
      description: evidencePackage.description,
      createdAt: evidencePackage.createdAt.toISOString(),
      evidenceIds: evidencePackage.items.map(e => e.id),
      evidenceHashes: evidencePackage.items.map(e => this.calculateEvidenceHash(e))
    };

    // Calculate seal hash (simplified - would use proper crypto in production)
    const manifestString = JSON.stringify(manifest);
    const sealHash = this.simpleHash(manifestString);

    evidencePackage.sealed = true;
    evidencePackage.sealHash = sealHash;

    return sealHash;
  }

  /**
   * Get evidence by ID
   */
  getEvidence(evidenceId: string): EvidenceItem | undefined {
    return this.evidence.get(evidenceId);
  }

  /**
   * Get all evidence for a case
   */
  getEvidenceForCase(caseId: string): EvidenceItem[] {
    return Array.from(this.evidence.values()).filter(e =>
      e.description.includes(caseId) || e.title.includes(caseId)
    );
  }

  /**
   * Get verification history for evidence
   */
  getVerificationHistory(evidenceId: string): EvidenceVerification[] {
    return this.verifications.get(evidenceId) || [];
  }

  /**
   * Generate chain of custody report
   */
  generateChainOfCustodyReport(evidenceId: string): string | null {
    const evidence = this.evidence.get(evidenceId);
    if (!evidence) return null;

    const report = `
CHAIN OF CUSTODY REPORT
======================

Evidence ID: ${evidence.id}
Title: ${evidence.title}
Type: ${evidence.type}
Date: ${evidence.date.toDateString()}
Description: ${evidence.description}

CUSTODY HISTORY:
${evidence.chainOfCustody.map((record, index) => {
  return `${index + 1}. ${record.timestamp.toISOString()} - ${record.action.toUpperCase()}
     Custodian: ${record.custodian}
     ${record.notes ? `Notes: ${record.notes}` : ''}
     `;
}).join('\n')}

Verification Status: ${evidence.verified ? 'VERIFIED' : 'PENDING'}
Permaweb TX ID: ${evidence.permawebTxId || 'N/A'}

======================
Generated: ${new Date().toISOString()}
    `;

    return report.trim();
  }

  /**
   * Calculate simple hash for evidence integrity (production would use crypto hash)
   */
  private calculateEvidenceHash(evidence: EvidenceItem): string {
    const data = `${evidence.id}${evidence.title}${evidence.description}${evidence.date.toISOString()}`;
    return this.simpleHash(data);
  }

  /**
   * Simple hash function for demonstration (use proper crypto in production)
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
   * Get evidence statistics
   */
  getEvidenceStatistics(): {
    total: number;
    verified: number;
    permaweb: number;
    byType: Record<string, number>;
  } {
    const allEvidence = Array.from(this.evidence.values());

    return {
      total: allEvidence.length,
      verified: allEvidence.filter(e => e.verified).length,
      permaweb: allEvidence.filter(e => e.permawebTxId).length,
      byType: allEvidence.reduce((acc, e) => {
        acc[e.type] = (acc[e.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }
}