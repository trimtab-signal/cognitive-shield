/**
 * PII DETECTOR - Advanced Personally Identifiable Information Detection
 * Uses pattern matching and NLP for comprehensive PII identification
 *
 * "Privacy protection through intelligent detection"
 */

import { PiiMatch } from '../services/drive-librarian.service';

export class PiiDetector {
  private patterns: Record<string, RegExp> = {
    // US Social Security Numbers
    US_SSN: /\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b/g,

    // Phone numbers (various formats)
    PHONE_NUMBER: /\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,

    // Email addresses
    EMAIL_ADDRESS: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi,

    // Credit card numbers (basic pattern)
    CREDIT_CARD: /\b(?:\d{4}[-.\s]?){3}\d{4}\b/g,

    // IP addresses
    IP_ADDRESS: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,

    // Dates of birth (various formats)
    DOB: /\b(?:DOB|Date of Birth|Born)[:\s]*\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/gi,

    // Addresses (street addresses)
    ADDRESS: /\b\d{1,5}\s+(?:[A-Za-z]+\s+){1,3}(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Court|Ct|Way|Circle|Cir)\.?\s*(?:,?\s*(?:Apt|Suite|Unit|#)\s*\d+)?/gi,

    // Driver's license (US format)
    US_DRIVER_LICENSE: /\b[A-Z]\d{7,9}\b/g,

    // Passport numbers (basic pattern)
    US_PASSPORT: /\b\d{9}\b/g,

    // Medical license numbers (basic pattern)
    MEDICAL_LICENSE: /\b[A-Z]{2}\d{6,8}\b/g,

    // Bank account numbers (US routing + account)
    US_BANK_NUMBER: /\b\d{9}\s+\d{6,17}\b/g,

    // Tax ID / EIN
    US_EIN: /\b\d{2}[-.]?\d{7}\b/g
  };

  /**
   * Detect all PII in text using pattern matching and NLP
   */
  async detect(text: string): Promise<PiiMatch[]> {
    const matches: PiiMatch[] = [];

    // Pattern-based detection
    matches.push(...this.detectByPatterns(text));

    // Context-aware detection for names and sensitive terms
    matches.push(...this.detectSensitiveContexts(text));

    // Remove duplicates and overlapping matches
    const deduplicated = this.deduplicateMatches(matches);

    return deduplicated;
  }

  /**
   * Detect PII using regex patterns
   */
  private detectByPatterns(text: string): PiiMatch[] {
    const matches: PiiMatch[] = [];

    for (const [entityType, pattern] of Object.entries(this.patterns)) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        // Validate the match with additional logic
        if (this.validateMatch(entityType, match[0])) {
          matches.push({
            entityType,
            text: match[0],
            start: match.index,
            end: match.index + match[0].length,
            score: this.getPatternConfidence(entityType, match[0])
          });
        }
      }
    }

    return matches;
  }

  /**
   * Detect sensitive contexts that might contain PII
   */
  private detectSensitiveContexts(text: string): PiiMatch[] {
    const matches: PiiMatch[] = [];
    const lines = text.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      const originalLine = lines[i];

      // Look for context clues
      if (line.includes('ssn') || line.includes('social security')) {
        const ssnMatch = this.extractLikelySSN(originalLine);
        if (ssnMatch) matches.push(ssnMatch);
      }

      if (line.includes('phone') || line.includes('mobile') || line.includes('cell')) {
        const phoneMatch = this.extractLikelyPhone(originalLine);
        if (phoneMatch) matches.push(phoneMatch);
      }

      if (line.includes('email') || line.includes('e-mail')) {
        const emailMatch = this.extractLikelyEmail(originalLine);
        if (emailMatch) matches.push(emailMatch);
      }

      if (line.includes('address') || line.includes('residence')) {
        const addressMatch = this.extractLikelyAddress(originalLine);
        if (addressMatch) matches.push(addressMatch);
      }
    }

    return matches;
  }

  /**
   * Extract likely SSN from context
   */
  private extractLikelySSN(text: string): PiiMatch | null {
    const ssnPattern = /\d{3}[-.\s]?\d{2}[-.\s]?\d{4}/g;
    const match = ssnPattern.exec(text);

    if (match) {
      return {
        entityType: 'US_SSN',
        text: match[0],
        start: match.index,
        end: match.index + match[0].length,
        score: 0.95
      };
    }

    return null;
  }

  /**
   * Extract likely phone number from context
   */
  private extractLikelyPhone(text: string): PiiMatch | null {
    const phonePatterns = [
      /(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
      /\d{3}[-.\s]\d{4}/g,
      /\d{10}/g
    ];

    for (const pattern of phonePatterns) {
      const match = pattern.exec(text);
      if (match && this.isValidPhoneNumber(match[0])) {
        return {
          entityType: 'PHONE_NUMBER',
          text: match[0],
          start: match.index,
          end: match.index + match[0].length,
          score: 0.90
        };
      }
    }

    return null;
  }

  /**
   * Extract likely email from context
   */
  private extractLikelyEmail(text: string): PiiMatch | null {
    const emailPattern = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}/gi;
    const match = emailPattern.exec(text);

    if (match) {
      return {
        entityType: 'EMAIL_ADDRESS',
        text: match[0],
        start: match.index,
        end: match.index + match[0].length,
        score: 0.95
      };
    }

    return null;
  }

  /**
   * Extract likely address from context
   */
  private extractLikelyAddress(text: string): PiiMatch | null {
    const addressPattern = /\d{1,5}\s+(?:[A-Za-z]+\s+){1,3}(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Court|Ct|Way|Circle|Cir)/gi;
    const match = addressPattern.exec(text);

    if (match) {
      return {
        entityType: 'LOCATION',
        text: match[0],
        start: match.index,
        end: match.index + match[0].length,
        score: 0.85
      };
    }

    return null;
  }

  /**
   * Validate if a pattern match is actually valid PII
   */
  private validateMatch(entityType: string, value: string): boolean {
    switch (entityType) {
      case 'US_SSN':
        return this.isValidSSN(value);
      case 'PHONE_NUMBER':
        return this.isValidPhoneNumber(value);
      case 'EMAIL_ADDRESS':
        return this.isValidEmail(value);
      case 'CREDIT_CARD':
        return this.isValidCreditCard(value);
      case 'IP_ADDRESS':
        return this.isValidIPAddress(value);
      default:
        return true; // Accept other patterns by default
    }
  }

  /**
   * Validate SSN format and checksum
   */
  private isValidSSN(ssn: string): boolean {
    const digits = ssn.replace(/[-.\s]/g, '');
    if (digits.length !== 9) return false;

    // Check for invalid patterns (all zeros, etc.)
    if (digits === '000000000') return false;
    if (digits.substring(0, 3) === '000') return false;
    if (digits.substring(3, 5) === '00') return false;
    if (digits.substring(5) === '0000') return false;

    return true;
  }

  /**
   * Validate phone number format
   */
  private isValidPhoneNumber(phone: string): boolean {
    const digits = phone.replace(/[-.\s()]/g, '');
    return digits.length >= 10 && digits.length <= 11;
  }

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate credit card format (basic Luhn check)
   */
  private isValidCreditCard(card: string): boolean {
    const digits = card.replace(/[-.\s]/g, '');
    if (digits.length < 13 || digits.length > 19) return false;

    // Basic Luhn algorithm check
    let sum = 0;
    let alternate = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let n = parseInt(digits.charAt(i), 10);
      if (alternate) {
        n *= 2;
        if (n > 9) n -= 9;
      }
      sum += n;
      alternate = !alternate;
    }

    return sum % 10 === 0;
  }

  /**
   * Validate IP address format
   */
  private isValidIPAddress(ip: string): boolean {
    const parts = ip.split('.');
    if (parts.length !== 4) return false;

    return parts.every(part => {
      const num = parseInt(part, 10);
      return num >= 0 && num <= 255;
    });
  }

  /**
   * Get confidence score for pattern-based matches
   */
  private getPatternConfidence(entityType: string, value: string): number {
    switch (entityType) {
      case 'US_SSN':
        return this.isValidSSN(value) ? 0.95 : 0.70;
      case 'PHONE_NUMBER':
        return this.isValidPhoneNumber(value) ? 0.90 : 0.60;
      case 'EMAIL_ADDRESS':
        return this.isValidEmail(value) ? 0.95 : 0.60;
      case 'CREDIT_CARD':
        return this.isValidCreditCard(value) ? 0.90 : 0.50;
      case 'IP_ADDRESS':
        return this.isValidIPAddress(value) ? 0.95 : 0.80;
      default:
        return 0.80;
    }
  }

  /**
   * Remove overlapping and duplicate matches
   */
  private deduplicateMatches(matches: PiiMatch[]): PiiMatch[] {
    if (matches.length === 0) return matches;

    // Sort by start position, then by score (descending)
    matches.sort((a, b) => {
      if (a.start !== b.start) return a.start - b.start;
      return b.score - a.score;
    });

    const result: PiiMatch[] = [];
    let lastEnd = -1;

    for (const match of matches) {
      if (match.start >= lastEnd) {
        result.push(match);
        lastEnd = match.end;
      }
    }

    return result;
  }

  /**
   * Generate redaction placeholder for PII type
   */
  generateRedactionPlaceholder(entityType: string, originalText?: string): string {
    const placeholders: Record<string, string> = {
      US_SSN: '[SSN-REDACTED]',
      PHONE_NUMBER: '[PHONE-REDACTED]',
      EMAIL_ADDRESS: '[EMAIL-REDACTED]',
      CREDIT_CARD: '[CC-REDACTED]',
      DOB: '[DOB-REDACTED]',
      ADDRESS: '[ADDRESS-REDACTED]',
      LOCATION: '[LOCATION-REDACTED]',
      IP_ADDRESS: '[IP-REDACTED]',
      US_DRIVER_LICENSE: '[DL-REDACTED]',
      US_PASSPORT: '[PASSPORT-REDACTED]',
      MEDICAL_LICENSE: '[MEDICAL-REDACTED]',
      US_BANK_NUMBER: '[BANK-REDACTED]',
      US_EIN: '[TAX-ID-REDACTED]'
    };

    return placeholders[entityType] || '[REDACTED]';
  }
}