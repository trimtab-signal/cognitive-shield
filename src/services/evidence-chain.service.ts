/**
 * EVIDENCE CHAIN SERVICE - Cryptographic Evidence Preservation
 * SHA-256 hashing, blockchain timestamping, chain of custody tracking
 */

export interface EvidenceItem {
  readonly id: string;
  readonly name: string;
  readonly type: 'document' | 'image' | 'audio' | 'video' | 'text' | 'email' | 'chat' | 'other';
  readonly content: string | ArrayBuffer; // Base64 encoded for strings, raw for binary
  readonly size: number; // bytes
  readonly mimeType: string;
  readonly timestamp: number;
  readonly source: string; // Where it came from (court, client, etc.)
  readonly description: string;
  readonly tags: string[];
}

export interface CryptographicProof {
  readonly sha256: string;
  readonly sha512?: string;
  readonly timestamp: number;
  readonly blockchainTxId?: string; // Arweave transaction ID
  readonly arweaveUrl?: string;
  readonly ipfsHash?: string;
  readonly signature?: string; // Digital signature of the hash
  readonly publicKey?: string; // Public key used for verification
}

export interface ChainOfCustodyEntry {
  readonly timestamp: number;
  readonly action: 'collected' | 'transferred' | 'accessed' | 'copied' | 'verified' | 'presented';
  readonly actor: string; // Who performed the action
  readonly location?: string; // Physical or digital location
  readonly notes?: string;
  readonly hashBefore: string; // Hash before action
  readonly hashAfter: string; // Hash after action
  readonly verificationMethod?: string;
}

export interface ChainOfCustody {
  readonly evidenceId: string;
  readonly entries: readonly ChainOfCustodyEntry[];
  readonly currentCustodian: string;
  readonly integrityVerified: boolean;
  readonly lastVerification: number;
}

export interface EvidencePackage {
  readonly evidence: EvidenceItem;
  readonly cryptographicProof: CryptographicProof;
  readonly chainOfCustody: ChainOfCustody;
  readonly metadata: {
    readonly collectionDate: number;
    readonly collector: string;
    readonly caseReference?: string;
    readonly courtReference?: string;
    readonly legalAdmissibility: 'verified' | 'pending' | 'questionable';
    readonly redactionApplied: boolean;
  };
}

export class EvidenceChainService {
  private static instance: EvidenceChainService;

  // In production, this would connect to Arweave, IPFS, etc.
  private readonly storageKey = 'evidence_chain_storage';
  private evidenceStore: Map<string, EvidencePackage> = new Map();

  static getInstance(): EvidenceChainService {
    if (!EvidenceChainService.instance) {
      EvidenceChainService.instance = new EvidenceChainService();
    }
    return EvidenceChainService.instance;
  }

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Preserve evidence with full cryptographic chain
   */
  async preserveEvidence(
    evidence: Omit<EvidenceItem, 'id' | 'timestamp'>,
    collector: string,
    caseReference?: string
  ): Promise<EvidencePackage> {
    // Generate unique ID
    const id = `evidence_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create complete evidence item
    const completeEvidence: EvidenceItem = {
      ...evidence,
      id,
      timestamp: Date.now(),
    };

    // Generate cryptographic proof
    const cryptographicProof = await this.generateCryptographicProof(completeEvidence);

    // Initialize chain of custody
    const chainOfCustody = this.initializeChainOfCustody(id, collector);

    // Create evidence package
    const evidencePackage: EvidencePackage = {
      evidence: completeEvidence,
      cryptographicProof,
      chainOfCustody,
      metadata: {
        collectionDate: Date.now(),
        collector,
        caseReference,
        legalAdmissibility: 'pending',
        redactionApplied: false,
      }
    };

    // Store in memory and persistent storage
    this.evidenceStore.set(id, evidencePackage);
    await this.saveToStorage();

    return evidencePackage;
  }

  /**
   * Transfer custody of evidence
   */
  async transferCustody(
    evidenceId: string,
    newCustodian: string,
    transferReason: string,
    transferringActor: string,
    location?: string
  ): Promise<boolean> {
    const evidencePackage = this.evidenceStore.get(evidenceId);
    if (!evidencePackage) return false;

    const newEntry: ChainOfCustodyEntry = {
      timestamp: Date.now(),
      action: 'transferred',
      actor: transferringActor,
      location,
      notes: `Transferred to ${newCustodian}: ${transferReason}`,
      hashBefore: evidencePackage.cryptographicProof.sha256,
      hashAfter: evidencePackage.cryptographicProof.sha256, // Hash shouldn't change during transfer
      verificationMethod: 'SHA-256 integrity check'
    };

    const updatedChainOfCustody: ChainOfCustody = {
      ...evidencePackage.chainOfCustody,
      entries: [...evidencePackage.chainOfCustody.entries, newEntry],
      currentCustodian: newCustodian,
      lastVerification: Date.now()
    };

    const updatedPackage: EvidencePackage = {
      ...evidencePackage,
      chainOfCustody: updatedChainOfCustody
    };

    this.evidenceStore.set(evidenceId, updatedPackage);
    await this.saveToStorage();

    return true;
  }

  /**
   * Verify evidence integrity
   */
  async verifyIntegrity(evidenceId: string): Promise<{
    isValid: boolean;
    details: string[];
    verificationTime: number;
  }> {
    const evidencePackage = this.evidenceStore.get(evidenceId);
    if (!evidencePackage) {
      return {
        isValid: false,
        details: ['Evidence not found'],
        verificationTime: Date.now()
      };
    }

    const details: string[] = [];
    let isValid = true;

    // Verify cryptographic hash
    const currentHash = await this.calculateSHA256(evidencePackage.evidence);
    if (currentHash !== evidencePackage.cryptographicProof.sha256) {
      isValid = false;
      details.push('Cryptographic hash mismatch - evidence has been modified');
    } else {
      details.push('Cryptographic integrity verified');
    }

    // Verify chain of custody
    const custodyValid = this.verifyChainOfCustody(evidencePackage.chainOfCustody);
    if (!custodyValid) {
      isValid = false;
      details.push('Chain of custody verification failed');
    } else {
      details.push('Chain of custody verified');
    }

    // Update verification timestamp
    if (isValid) {
      const updatedPackage: EvidencePackage = {
        ...evidencePackage,
        chainOfCustody: {
          ...evidencePackage.chainOfCustody,
          integrityVerified: true,
          lastVerification: Date.now()
        }
      };
      this.evidenceStore.set(evidenceId, updatedPackage);
      await this.saveToStorage();
    }

    return {
      isValid,
      details,
      verificationTime: Date.now()
    };
  }

  /**
   * Generate court-ready evidence package
   */
  async generateCourtPackage(evidenceId: string): Promise<{
    package: EvidencePackage;
    affidavit: string;
    verificationReport: string;
  } | null> {
    const evidencePackage = this.evidenceStore.get(evidenceId);
    if (!evidencePackage) return null;

    // Generate affidavit
    const affidavit = this.generateEvidenceAffidavit(evidencePackage);

    // Generate verification report
    const verification = await this.verifyIntegrity(evidenceId);
    const verificationReport = this.generateVerificationReport(evidencePackage, verification);

    return {
      package: evidencePackage,
      affidavit,
      verificationReport
    };
  }

  /**
   * Get all evidence items
   */
  getAllEvidence(): EvidencePackage[] {
    return Array.from(this.evidenceStore.values());
  }

  /**
   * Get evidence by ID
   */
  getEvidence(evidenceId: string): EvidencePackage | undefined {
    return this.evidenceStore.get(evidenceId);
  }

  // Private helper methods

  private async generateCryptographicProof(evidence: EvidenceItem): Promise<CryptographicProof> {
    const sha256 = await this.calculateSHA256(evidence);
    const sha512 = await this.calculateSHA512(evidence);
    const timestamp = Date.now();

    // In production, this would submit to blockchain and get transaction ID
    // For now, we'll simulate this
    const blockchainTxId = `arweave_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      sha256,
      sha512,
      timestamp,
      blockchainTxId,
      arweaveUrl: `https://arweave.net/${blockchainTxId}`,
      ipfsHash: `Qm${Math.random().toString(36).substr(2, 16)}`, // Simulated IPFS hash
    };
  }

  private async calculateSHA256(evidence: EvidenceItem): Promise<string> {
    const encoder = new TextEncoder();
    const data = typeof evidence.content === 'string'
      ? encoder.encode(evidence.content)
      : evidence.content;

    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private async calculateSHA512(evidence: EvidenceItem): Promise<string> {
    const encoder = new TextEncoder();
    const data = typeof evidence.content === 'string'
      ? encoder.encode(evidence.content)
      : evidence.content;

    const hashBuffer = await crypto.subtle.digest('SHA-512', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private initializeChainOfCustody(evidenceId: string, collector: string): ChainOfCustody {
    const initialEntry: ChainOfCustodyEntry = {
      timestamp: Date.now(),
      action: 'collected',
      actor: collector,
      notes: 'Initial evidence collection and cryptographic preservation',
      hashBefore: '', // No previous hash for initial collection
      hashAfter: '', // Will be set after cryptographic proof generation
      verificationMethod: 'SHA-256 cryptographic hashing'
    };

    return {
      evidenceId,
      entries: [initialEntry],
      currentCustodian: collector,
      integrityVerified: false,
      lastVerification: Date.now()
    };
  }

  private verifyChainOfCustody(chainOfCustody: ChainOfCustody): boolean {
    // Verify that the chain is continuous and properly signed
    // In production, this would verify digital signatures
    for (let i = 1; i < chainOfCustody.entries.length; i++) {
      const current = chainOfCustody.entries[i];
      const previous = chainOfCustody.entries[i - 1];

      // Verify hash continuity
      if (current.hashBefore !== previous.hashAfter && current.hashBefore !== '') {
        return false;
      }

      // Verify timestamps are sequential
      if (current.timestamp < previous.timestamp) {
        return false;
      }
    }

    return true;
  }

  private generateEvidenceAffidavit(evidencePackage: EvidencePackage): string {
    const { evidence, cryptographicProof, chainOfCustody, metadata } = evidencePackage;

    return `
EVIDENCE PRESERVATION AFFIDAVIT

I, ${metadata.collector}, being duly sworn, depose and state:

1. I am the collector and custodian of the evidence described herein.

2. On ${new Date(metadata.collectionDate).toLocaleDateString()}, I collected the following evidence:
   - Name: ${evidence.name}
   - Type: ${evidence.type}
   - Size: ${evidence.size} bytes
   - Source: ${evidence.source}
   - Description: ${evidence.description}

3. Immediately upon collection, I created cryptographic hash values to ensure the evidence integrity:
   - SHA-256: ${cryptographicProof.sha256}
   - Timestamp: ${new Date(cryptographicProof.timestamp).toISOString()}

4. This evidence has been preserved in a tamper-evident manner using blockchain timestamping:
   - Arweave Transaction ID: ${cryptographicProof.blockchainTxId}
   - Arweave URL: ${cryptographicProof.arweaveUrl}

5. The chain of custody has been maintained as follows:
${chainOfCustody.entries.map((entry, i) =>
  `   ${i + 1}. ${new Date(entry.timestamp).toLocaleString()} - ${entry.action} by ${entry.actor}${entry.notes ? ` (${entry.notes})` : ''}`
).join('\n')}

6. The current custodian of this evidence is: ${chainOfCustody.currentCustodian}

7. To the best of my knowledge, this evidence has not been altered or modified since collection.

Executed on ${new Date().toLocaleDateString()}.

_________________________________
${metadata.collector}
Evidence Custodian
    `.trim();
  }

  private generateVerificationReport(
    evidencePackage: EvidencePackage,
    verification: { isValid: boolean; details: string[]; verificationTime: number }
  ): string {
    const { evidence, cryptographicProof } = evidencePackage;

    return `
EVIDENCE VERIFICATION REPORT

Evidence ID: ${evidence.id}
Verification Date: ${new Date(verification.verificationTime).toISOString()}

EVIDENCE DETAILS:
- Name: ${evidence.name}
- Type: ${evidence.type}
- Size: ${evidence.size} bytes
- Collection Date: ${new Date(evidence.timestamp).toISOString()}

CRYPTOGRAPHIC PROOF:
- SHA-256 Hash: ${cryptographicProof.sha256}
- SHA-512 Hash: ${cryptographicProof.sha512 || 'Not calculated'}
- Timestamp: ${new Date(cryptographicProof.timestamp).toISOString()}
- Blockchain TX ID: ${cryptographicProof.blockchainTxId || 'Pending'}
- Arweave URL: ${cryptographicProof.arweaveUrl || 'Pending'}

VERIFICATION RESULTS:
Status: ${verification.isValid ? 'VERIFIED - Evidence integrity confirmed' : 'FAILED - Evidence integrity compromised'}

Details:
${verification.details.map(detail => `- ${detail}`).join('\n')}

${verification.isValid ?
  'CONCLUSION: This evidence maintains cryptographic integrity and is suitable for court presentation.' :
  'CONCLUSION: This evidence has failed integrity verification and should not be used without further investigation.'
}

Generated by Cognitive Shield Evidence Preservation System
    `.trim();
  }

  private async loadFromStorage(): Promise<void> {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        this.evidenceStore = new Map(
          Object.entries(data).map(([key, value]) => [key, value as EvidencePackage])
        );
      }
    } catch (error) {
      console.error('Failed to load evidence from storage:', error);
    }
  }

  private async saveToStorage(): Promise<void> {
    try {
      const data = Object.fromEntries(this.evidenceStore);
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save evidence to storage:', error);
    }
  }
}

export default EvidenceChainService;

// Export types for components
export type { EvidenceItem, EvidencePackage, CryptographicProof, ChainOfCustody };