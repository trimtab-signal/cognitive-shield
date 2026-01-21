/**
 * DRIVE LIBRARIAN INTEGRATION - Cognitive Shield
 * Advanced PII detection, redaction, and evidence categorization
 *
 * "Privacy by design, intelligence by analysis"
 */

import { PiiDetector } from '../lib/pii-detector';
import { EvidenceCategorizer } from '../lib/evidence-categorizer';
import { DocumentProcessor } from '../lib/document-processor';

// Simple Google Drive service interface for now
interface GoogleDriveService {
  getFile(fileId: string): Promise<any>;
  findOrCreateFolder(name: string): Promise<string>;
  copyFile(fileId: string, newName: string, parentId: string): Promise<string>;
  listFiles(folderId: string, recursive?: boolean): Promise<any[]>;
  updateDocument(docId: string, requests: any[]): Promise<void>;
  createDocument(title: string, parentId?: string): Promise<string>;
}

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

/**
 * Drive Librarian Service - Advanced document processing with PII protection and evidence analysis
 */
export class DriveLibrarianService {
  private driveService: GoogleDriveService | null;
  private piiDetector: PiiDetector;
  private evidenceCategorizer: EvidenceCategorizer;
  private documentProcessor: DocumentProcessor;

  constructor(driveService?: GoogleDriveService) {
    this.driveService = driveService || null;
    this.piiDetector = new PiiDetector();
    this.evidenceCategorizer = new EvidenceCategorizer();
    this.documentProcessor = new DocumentProcessor();
  }

  /**
   * Process a batch of documents with full librarian functionality
   */
  async processBatch(fileIds: string[]): Promise<ProcessingStats> {
    const stats: ProcessingStats = {
      filesProcessed: 0,
      piiRedacted: 0,
      claimsCategorized: 0,
      filesOrganized: 0,
      errors: [],
      results: []
    };

    console.log(`[Drive Librarian] Processing ${fileIds.length} files...`);

    for (const fileId of fileIds) {
      try {
        const result = await this.processFile(fileId);
        stats.results.push(result);
        stats.filesProcessed++;
        stats.piiRedacted += result.piiFound.length;
        stats.claimsCategorized += result.claimsFound.length;

        if (result.category !== 'Miscellaneous') {
          stats.filesOrganized++;
        }
      } catch (error) {
        const errorMsg = `Failed to process ${fileId}: ${error.message}`;
        console.error(`[Drive Librarian] ${errorMsg}`);
        stats.errors.push(errorMsg);
      }
    }

    console.log(`[Drive Librarian] Processing complete:`, {
      processed: stats.filesProcessed,
      piiFound: stats.piiRedacted,
      claimsFound: stats.claimsCategorized,
      organized: stats.filesOrganized,
      errors: stats.errors.length
    });

    return stats;
  }

  /**
   * Process a single file with full librarian analysis
   */
  async processFile(fileId: string): Promise<ProcessingResult> {
    const file = await this.driveService.getFile(fileId);
    const result: ProcessingResult = {
      fileId,
      fileName: file.name,
      fileType: file.mimeType,
      piiFound: [],
      claimsFound: [],
      category: 'Miscellaneous',
      errors: [],
      processedAt: new Date().toISOString()
    };

    try {
      console.log(`[Drive Librarian] Processing: ${file.name}`);

      // Extract text content based on file type
      const textContent = await this.extractTextContent(file);

      if (!textContent) {
        result.errors.push('Could not extract text content');
        return result;
      }

      // Detect PII
      result.piiFound = await this.piiDetector.detect(textContent);

      // If PII found, create backup and redact
      if (result.piiFound.length > 0) {
        result.originalBackupId = await this.createBackup(file);
        await this.redactDocument(file, result.piiFound);
      }

      // Extract and categorize evidence claims
      result.claimsFound = await this.evidenceCategorizer.extractClaims(textContent);

      // Apply evidence highlighting
      if (result.claimsFound.length > 0) {
        await this.highlightEvidence(file, result.claimsFound);
      }

      // Categorize file
      result.category = await this.categorizeFile(file, textContent, result.claimsFound);

    } catch (error) {
      result.errors.push(error.message);
    }

    return result;
  }

  /**
   * Extract text content from various file types
   */
  private async extractTextContent(file: any): Promise<string | null> {
    const mimeType = file.mimeType;

    if (mimeType === 'application/vnd.google-apps.document') {
      return await this.documentProcessor.extractGoogleDocText(file.id);
    } else if (mimeType === 'application/vnd.google-apps.spreadsheet') {
      return await this.documentProcessor.extractGoogleSheetText(file.id);
    } else if (mimeType === 'application/vnd.google-apps.presentation') {
      return await this.documentProcessor.extractGoogleSlidesText(file.id);
    } else if (mimeType.startsWith('text/')) {
      return await this.documentProcessor.extractPlainText(file.id);
    } else if (mimeType === 'application/pdf') {
      return await this.documentProcessor.extractPdfText(file.id);
    }

    return null;
  }

  /**
   * Create backup of original file before redaction
   */
  private async createBackup(file: any): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = `${file.name}_ORIGINAL_${timestamp}`;

    // Create backup in _Redacted_Originals folder
    const backupFolderId = await this.ensureBackupFolder();
    const backupId = await this.driveService.copyFile(file.id, backupName, backupFolderId);

    console.log(`[Drive Librarian] Created backup: ${backupName}`);
    return backupId;
  }

  /**
   * Redact PII from document
   */
  private async redactDocument(file: any, piiMatches: PiiMatch[]): Promise<void> {
    const mimeType = file.mimeType;

    if (mimeType === 'application/vnd.google-apps.document') {
      await this.documentProcessor.redactGoogleDoc(file.id, piiMatches);
    } else if (mimeType === 'application/vnd.google-apps.spreadsheet') {
      await this.documentProcessor.redactGoogleSheet(file.id, piiMatches);
    } else if (mimeType === 'application/vnd.google-apps.presentation') {
      await this.documentProcessor.redactGoogleSlides(file.id, piiMatches);
    }

    console.log(`[Drive Librarian] Redacted ${piiMatches.length} PII instances`);
  }

  /**
   * Highlight evidence claims in document
   */
  private async highlightEvidence(file: any, claims: EvidenceClaim[]): Promise<void> {
    if (file.mimeType === 'application/vnd.google-apps.document') {
      await this.documentProcessor.highlightEvidenceClaims(file.id, claims);
    }
  }

  /**
   * Categorize file based on content and claims
   */
  private async categorizeFile(file: any, content: string, claims: EvidenceClaim[]): Promise<string> {
    return await this.documentProcessor.categorizeByContent(file, content, claims);
  }

  /**
   * Ensure backup folder exists
   */
  private async ensureBackupFolder(): Promise<string> {
    return await this.driveService.findOrCreateFolder('_Redacted_Originals');
  }

  /**
   * Generate processing report
   */
  async generateReport(stats: ProcessingStats): Promise<string> {
    const reportName = `Librarian_Report_${new Date().toISOString().split('T')[0]}`;
    const reportContent = this.buildReportContent(stats);

    const reportsFolderId = await this.driveService.findOrCreateFolder('_Validation_Reports');
    const docId = await this.documentProcessor.createReportDocument(reportName, reportContent, reportsFolderId);

    return docId;
  }

  /**
   * Build report content
   */
  private buildReportContent(stats: ProcessingStats): string {
    let content = '# Drive Librarian Processing Report\n\n';
    content += `Generated: ${new Date().toISOString()}\n\n`;

    content += '## Summary\n\n';
    content += `Files Processed: ${stats.filesProcessed}\n`;
    content += `PII Instances Redacted: ${stats.piiRedacted}\n`;
    content += `Claims Categorized: ${stats.claimsCategorized}\n`;
    content += `Files Organized: ${stats.filesOrganized}\n`;
    content += `Errors: ${stats.errors.length}\n\n`;

    if (stats.results.length > 0) {
      content += '## File Details\n\n';
      for (const result of stats.results) {
        content += `### ${result.fileName}\n`;
        content += `Category: ${result.category}\n`;
        content += `PII Found: ${result.piiFound.length}\n`;
        content += `Claims: ${result.claimsFound.length}\n`;
        if (result.originalBackupId) {
          content += `Backup ID: ${result.originalBackupId}\n`;
        }
        if (result.errors.length > 0) {
          content += `Errors: ${result.errors.join(', ')}\n`;
        }
        content += '\n';
      }
    }

    return content;
  }

  /**
   * Restore file from backup
   */
  async restoreFromBackup(originalFileName: string): Promise<string | null> {
    const backupFolderId = await this.ensureBackupFolder();
    const backups = await this.driveService.listFiles(backupFolderId);

    // Find most recent backup matching the original name
    const matchingBackups = backups
      .filter(f => f.name.includes(originalFileName) && f.name.includes('_ORIGINAL_'))
      .sort((a, b) => new Date(b.modifiedTime).getTime() - new Date(a.modifiedTime).getTime());

    if (matchingBackups.length === 0) {
      return null;
    }

    const latestBackup = matchingBackups[0];
    const restoredName = `${originalFileName}_RESTORED`;

    const restoredId = await this.driveService.copyFile(latestBackup.id, restoredName);
    console.log(`[Drive Librarian] Restored: ${restoredName}`);

    return restoredId;
  }

  /**
   * Get status and statistics
   */
  async getStatus(): Promise<{
    totalFiles: number;
    totalBackups: number;
    recentProcessing: ProcessingStats[];
  }> {
    const rootFolderId = await this.driveService.getRootFolderId();
    const allFiles = await this.driveService.listFiles(rootFolderId, true);

    const backupFolderId = await this.ensureBackupFolder();
    const backups = await this.driveService.listFiles(backupFolderId);

    return {
      totalFiles: allFiles.length,
      totalBackups: backups.length,
      recentProcessing: [] // Would need to be stored/persisted
    };
  }
}