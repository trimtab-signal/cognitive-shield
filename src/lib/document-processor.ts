/**
 * DOCUMENT PROCESSOR - Google Drive Document Operations
 * Handles extraction, redaction, and manipulation of Google Workspace documents
 *
 * "From raw content to structured knowledge"
 */

import { PiiMatch, EvidenceClaim } from '../services/drive-librarian.service';

// Simple Google Drive service interface
interface GoogleDriveService {
  getFile(fileId: string): Promise<any>;
  findOrCreateFolder(name: string): Promise<string>;
  copyFile(fileId: string, newName: string, parentId: string): Promise<string>;
  listFiles(folderId: string, recursive?: boolean): Promise<any[]>;
  updateDocument(docId: string, requests: any[]): Promise<void>;
  createDocument(title: string, parentId?: string): Promise<string>;
  getSpreadsheet(sheetId: string): Promise<any>;
  getSheetValues(sheetId: string, range: string): Promise<any>;
  getPresentation(slidesId: string): Promise<any>;
  downloadFile(fileId: string): Promise<Buffer>;
  exportFile(fileId: string, mimeType: string): Promise<any>;
}

export class DocumentProcessor {
  private driveService: GoogleDriveService | null;

  constructor(driveService?: GoogleDriveService) {
    this.driveService = driveService || null;
  }

  /**
   * Extract text content from Google Doc
   */
  async extractGoogleDocText(docId: string): Promise<string> {
    try {
      const doc = await this.driveService.getDocument(docId);
      return doc.body.content
        .filter(item => item.paragraph)
        .map(item => item.paragraph.elements
          .filter(el => el.textRun)
          .map(el => el.textRun.content)
          .join('')
        )
        .join('\n');
    } catch (error) {
      console.error('Error extracting Google Doc text:', error);
      return '';
    }
  }

  /**
   * Extract text content from Google Sheet
   */
  async extractGoogleSheetText(sheetId: string): Promise<string> {
    try {
      const spreadsheet = await this.driveService.getSpreadsheet(sheetId);
      let text = '';

      for (const sheet of spreadsheet.sheets) {
        const sheetName = sheet.properties.title;
        text += `Sheet: ${sheetName}\n`;

        const sheetData = await this.driveService.getSheetValues(sheetId, sheetName);
        for (const row of sheetData.values || []) {
          text += row.join('\t') + '\n';
        }
        text += '\n';
      }

      return text;
    } catch (error) {
      console.error('Error extracting Google Sheet text:', error);
      return '';
    }
  }

  /**
   * Extract text content from Google Slides
   */
  async extractGoogleSlidesText(slidesId: string): Promise<string> {
    try {
      const presentation = await this.driveService.getPresentation(slidesId);
      let text = '';

      for (const slide of presentation.slides) {
        text += 'Slide:\n';

        for (const element of slide.pageElements || []) {
          if (element.shape?.text?.textElements) {
            for (const textElement of element.shape.text.textElements) {
              if (textElement.textRun?.content) {
                text += textElement.textRun.content;
              }
            }
          }
        }

        text += '\n\n';
      }

      return text;
    } catch (error) {
      console.error('Error extracting Google Slides text:', error);
      return '';
    }
  }

  /**
   * Extract plain text from file
   */
  async extractPlainText(fileId: string): Promise<string> {
    try {
      const content = await this.driveService.downloadFile(fileId);
      return content.toString('utf-8');
    } catch (error) {
      console.error('Error extracting plain text:', error);
      return '';
    }
  }

  /**
   * Extract text from PDF (placeholder - would need PDF parsing library)
   */
  async extractPdfText(fileId: string): Promise<string> {
    // This would require a PDF parsing library like pdf-parse
    // For now, return a note that PDF processing requires additional setup
    console.warn('PDF text extraction not implemented - requires pdf-parse library');
    return '[PDF content extraction not available]';
  }

  /**
   * Redact PII from Google Doc using Docs API
   */
  async redactGoogleDoc(docId: string, piiMatches: PiiMatch[]): Promise<void> {
    if (piiMatches.length === 0) return;

    const requests = [];

    for (const match of piiMatches) {
      requests.push({
        replaceAllText: {
          containsText: {
            text: match.text,
            matchCase: true
          },
          replaceText: match.redactedText || `[${match.entityType}-REDACTED]`
        }
      });
    }

    await this.driveService.updateDocument(docId, requests);

    // Add redaction notice
    const noticeRequest = {
      insertText: {
        location: { index: 1 },
        text: `\n⚠️ PII REDACTED: ${piiMatches.length} item(s) redacted on ${new Date().toLocaleDateString()}\n\n`
      }
    };

    await this.driveService.updateDocument(docId, [noticeRequest]);
  }

  /**
   * Redact PII from Google Sheet (placeholder - complex implementation)
   */
  async redactGoogleSheet(sheetId: string, piiMatches: PiiMatch[]): Promise<void> {
    // Sheet redaction is more complex due to cell-based structure
    // Would require parsing cell contents and updating specific cells
    console.warn('Google Sheet PII redaction not fully implemented');
  }

  /**
   * Redact PII from Google Slides (placeholder - complex implementation)
   */
  async redactGoogleSlides(slidesId: string, piiMatches: PiiMatch[]): Promise<void> {
    // Slides redaction requires updating text elements on each slide
    console.warn('Google Slides PII redaction not fully implemented');
  }

  /**
   * Highlight evidence claims in Google Doc
   */
  async highlightEvidenceClaims(docId: string, claims: EvidenceClaim[]): Promise<void> {
    if (claims.length === 0) return;

    const requests = [];

    for (const claim of claims) {
      // Find the text in the document and apply background color
      const color = this.getEvidenceColor(claim.level);

      requests.push({
        updateTextStyle: {
          range: {
            startIndex: this.findTextPosition(docId, claim.text),
            endIndex: this.findTextPosition(docId, claim.text) + claim.text.length
          },
          textStyle: {
            backgroundColor: {
              color: {
                rgbColor: this.hexToRgb(color)
              }
            }
          },
          fields: 'backgroundColor'
        }
      });
    }

    if (requests.length > 0) {
      await this.driveService.updateDocument(docId, requests);
    }
  }

  /**
   * Find position of text in document (simplified)
   */
  private findTextPosition(docId: string, searchText: string): number {
    // This is a simplified implementation
    // In practice, you'd need to search through the document structure
    return 1; // Placeholder
  }

  /**
   * Convert hex color to RGB
   */
  private hexToRgb(hex: string): { red: number, green: number, blue: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      red: parseInt(result[1], 16) / 255,
      green: parseInt(result[2], 16) / 255,
      blue: parseInt(result[3], 16) / 255
    } : { red: 0, green: 0, blue: 0 };
  }

  /**
   * Get color for evidence level
   */
  private getEvidenceColor(level: string): string {
    const colors: Record<string, string> = {
      verified: "#C6EFCE",      // Green
      supported: "#FFEB9C",     // Yellow
      theoretical: "#B4C6E7",   // Blue
      speculative: "#F4CCCC",   // Pink
      unverified: "#D9D9D9"     // Gray
    };
    return colors[level] || colors.unverified;
  }

  /**
   * Categorize file based on content and metadata
   */
  async categorizeByContent(
    file: any,
    content: string,
    claims: EvidenceClaim[]
  ): Promise<string> {
    const fileName = file.name.toLowerCase();
    const lowerContent = content.toLowerCase();

    // Define categorization rules
    const categories = {
      Research: [
        'research', 'study', 'analysis', 'investigation', 'findings',
        'clinical', 'trial', 'experiment', 'hypothesis'
      ],
      Protocols: [
        'protocol', 'procedure', 'methodology', 'framework', 'checklist',
        'workflow', 'clinical', 'experiment', 'guidelines'
      ],
      Technical: [
        'technical', 'engineering', 'hardware', 'software', 'code',
        'implementation', 'specification', 'architecture', 'quantum',
        'algorithm', 'system', 'infrastructure'
      ],
      Legal: [
        'legal', 'court', 'custody', 'contract', 'agreement',
        'filing', 'motion', 'attorney', 'proceeding', 'lawsuit'
      ],
      Personal: [
        'personal', 'journal', 'diary', 'reflection', 'memoir',
        'family', 'private', 'confidential'
      ],
      Financial: [
        'financial', 'budget', 'invoice', 'expense', 'tax',
        'accounting', 'payment', 'salary'
      ]
    };

    // Check filename first
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => fileName.includes(keyword))) {
        return category;
      }
    }

    // Check content
    for (const [category, keywords] of Object.entries(categories)) {
      const matches = keywords.filter(keyword => lowerContent.includes(keyword));
      if (matches.length >= 2) { // Multiple keyword matches
        return category;
      }
    }

    // Check evidence claims for categorization hints
    const claimText = claims.map(c => c.text).join(' ').toLowerCase();
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => claimText.includes(keyword))) {
        return category;
      }
    }

    return 'Miscellaneous';
  }

  /**
   * Create a report document
   */
  async createReportDocument(
    title: string,
    content: string,
    folderId: string
  ): Promise<string> {
    const docId = await this.driveService.createDocument(title, folderId);

    const requests = [{
      insertText: {
        location: { index: 1 },
        text: content
      }
    }];

    await this.driveService.updateDocument(docId, requests);
    return docId;
  }

  /**
   * Extract document metadata
   */
  async getDocumentMetadata(docId: string): Promise<{
    title: string;
    created: string;
    modified: string;
    owner: string;
    size: number;
    mimeType: string;
  }> {
    const file = await this.driveService.getFile(docId);

    return {
      title: file.name,
      created: file.createdTime,
      modified: file.modifiedTime,
      owner: file.owners?.[0]?.displayName || 'Unknown',
      size: parseInt(file.size || '0'),
      mimeType: file.mimeType
    };
  }

  /**
   * Check document for data loss prevention patterns
   */
  checkDataLossPrevention(content: string): {
    hasSensitiveContent: boolean;
    riskLevel: 'low' | 'medium' | 'high';
    flags: string[];
  } {
    const flags: string[] = [];
    const lowerContent = content.toLowerCase();

    // High-risk patterns
    const highRiskPatterns = [
      /\b(password|passwd|pwd)\s*[:=]\s*\w+/gi,
      /\b(api[_-]?key|secret[_-]?key)\s*[:=]\s*\w+/gi,
      /\b(private[_-]?key|secret[_-]?key)\s*[:=]\s*\w+/gi,
      /\b(token|bearer)\s*[:=]\s*\w+/gi
    ];

    // Medium-risk patterns
    const mediumRiskPatterns = [
      /\b(ssn|social[_-]?security)\s*\d+/gi,
      /\b(credit[_-]?card|cc)\s*\d+/gi,
      /\b(bank[_-]?account)\s*\d+/gi
    ];

    // Check high-risk
    for (const pattern of highRiskPatterns) {
      if (pattern.test(lowerContent)) {
        flags.push('High-risk credential detected');
        break;
      }
    }

    // Check medium-risk
    for (const pattern of mediumRiskPatterns) {
      if (pattern.test(lowerContent)) {
        flags.push('Medium-risk PII detected');
        break;
      }
    }

    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (flags.some(f => f.includes('High-risk'))) {
      riskLevel = 'high';
    } else if (flags.some(f => f.includes('Medium-risk'))) {
      riskLevel = 'medium';
    }

    return {
      hasSensitiveContent: flags.length > 0,
      riskLevel,
      flags
    };
  }
}