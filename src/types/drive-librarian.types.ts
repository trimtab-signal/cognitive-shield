/**
 * DRIVE LIBRARIAN TYPES - Type definitions for drive operations
 * Extracted to resolve import issues
 */

export interface PiiMatch {
  entityType: string;
  text: string;
  start: number;
  end: number;
  score: number;
  redactedText?: string;
}

export interface EvidenceClaim {
  text: string;
  level: 'verified' | 'supported' | 'theoretical' | 'speculative' | 'unverified';
  markersFound: string[];
  paragraphIndex: number;
  confidence: number;
}

export interface ProcessingResult {
  fileId: string;
  fileName: string;
  fileType: string;
  piiFound: PiiMatch[];
  claimsFound: EvidenceClaim[];
  category: string;
  originalBackupId?: string;
  errors: string[];
  processedAt: string;
}

export interface ProcessingStats {
  filesProcessed: number;
  piiRedacted: number;
  claimsCategorized: number;
  filesOrganized: number;
  errors: string[];
  results: ProcessingResult[];
}