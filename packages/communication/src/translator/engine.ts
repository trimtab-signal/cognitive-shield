// Communication Translation Engine
// Handles dialect translation and impedance matching

import { VPIProtocol, ImpedanceMatch, VPIAnalysis } from '../vpi/protocol';

export interface TranslationRequest {
  text: string;
  sourceDialect: string;
  targetDialect: string;
  context?: string;
  preserveIntent?: boolean;
}

export interface TranslationResult {
  original: string;
  translated: string;
  sourceDialect: string;
  targetDialect: string;
  confidence: number;
  impedanceMatch: ImpedanceMatch;
  analysis: VPIAnalysis;
  metadata: {
    processingTime: number;
    rulesApplied: number;
    intentPreserved: boolean;
  };
}

export interface DialectPair {
  source: string;
  target: string;
  translationRules: TranslationRule[];
  commonPatterns: string[];
}

export interface TranslationRule {
  pattern: RegExp;
  replacement: string;
  context?: string;
  priority: number;
  bidirectional: boolean;
}

export class TranslationEngine {
  private vpiProtocol: VPIProtocol;
  private dialectPairs: Map<string, DialectPair> = new Map();

  constructor(vpiProtocol: VPIProtocol) {
    this.vpiProtocol = vpiProtocol;
    this.initializeDialectPairs();
  }

  /**
   * Translate text between dialects
   */
  async translate(request: TranslationRequest): Promise<TranslationResult> {
    const startTime = Date.now();

    // Analyze the input first
    const analysis = this.vpiProtocol.analyze(request.text, request.context);

    // Perform impedance matching
    const impedanceMatch = this.vpiProtocol.matchImpedance(
      request.sourceDialect,
      request.targetDialect,
      request.text
    );

    // Apply translation rules
    const translated = this.applyTranslationRules(
      request.text,
      request.sourceDialect,
      request.targetDialect,
      request.context
    );

    // Calculate confidence
    const confidence = this.calculateTranslationConfidence(
      analysis,
      impedanceMatch,
      translated !== request.text
    );

    // Adapt VPI protocol based on this translation
    this.vpiProtocol.adapt(analysis);

    const processingTime = Date.now() - startTime;
    const rulesApplied = this.countAppliedRules(request.text, translated);

    return {
      original: request.text,
      translated,
      sourceDialect: request.sourceDialect,
      targetDialect: request.targetDialect,
      confidence,
      impedanceMatch,
      analysis,
      metadata: {
        processingTime,
        rulesApplied,
        intentPreserved: request.preserveIntent ? this.verifyIntentPreservation(analysis, translated) : true
      }
    };
  }

  /**
   * Get available dialect pairs
   */
  getAvailableDialectPairs(): string[] {
    return Array.from(this.dialectPairs.keys());
  }

  /**
   * Add custom translation rule
   */
  addTranslationRule(sourceDialect: string, targetDialect: string, rule: TranslationRule): void {
    const pairKey = `${sourceDialect}->${targetDialect}`;
    const pair = this.dialectPairs.get(pairKey);

    if (pair) {
      pair.translationRules.push(rule);
      pair.translationRules.sort((a, b) => b.priority - a.priority); // Higher priority first
    }
  }

  /**
   * Get translation statistics
   */
  getTranslationStats(): {
    totalPairs: number;
    totalRules: number;
    commonPatterns: Record<string, number>;
  } {
    const stats = {
      totalPairs: this.dialectPairs.size,
      totalRules: 0,
      commonPatterns: {} as Record<string, number>
    };

    for (const pair of this.dialectPairs.values()) {
      stats.totalRules += pair.translationRules.length;

      for (const pattern of pair.commonPatterns) {
        stats.commonPatterns[pattern] = (stats.commonPatterns[pattern] || 0) + 1;
      }
    }

    return stats;
  }

  private initializeDialectPairs(): void {
    // Engineering to Astrology
    this.dialectPairs.set('engineering->astrology', {
      source: 'engineering',
      target: 'astrology',
      translationRules: [
        {
          pattern: /floating neutral/gi,
          replacement: 'hot roots',
          context: 'conflict',
          priority: 10,
          bidirectional: false
        },
        {
          pattern: /delta topology/gi,
          replacement: 'Age of Aquarius',
          context: 'system-change',
          priority: 9,
          bidirectional: false
        },
        {
          pattern: /impedance mismatch/gi,
          replacement: 'planetary misalignment',
          context: 'communication',
          priority: 8,
          bidirectional: false
        }
      ],
      commonPatterns: ['conflict-resolution', 'system-change', 'communication']
    });

    // Engineering to Cosmetology
    this.dialectPairs.set('engineering->cosmetology', {
      source: 'engineering',
      target: 'cosmetology',
      translationRules: [
        {
          pattern: /high impedance/gi,
          replacement: 'deep conditioning treatment',
          context: 'self-care',
          priority: 10,
          bidirectional: false
        },
        {
          pattern: /low impedance/gi,
          replacement: 'relaxed, porous hair',
          context: 'receptivity',
          priority: 9,
          bidirectional: false
        },
        {
          pattern: /bond repair/gi,
          replacement: 'Olaplex bond building',
          context: 'relationship',
          priority: 8,
          bidirectional: false
        },
        {
          pattern: /disulfide bonds/gi,
          replacement: 'permanent bonds',
          context: 'commitment',
          priority: 7,
          bidirectional: false
        },
        {
          pattern: /hydrogen bonds/gi,
          replacement: 'temporary bonds',
          context: 'flexibility',
          priority: 7,
          bidirectional: false
        }
      ],
      commonPatterns: ['self-care', 'relationships', 'commitment']
    });

    // Astrology to Cosmetology
    this.dialectPairs.set('astrology->cosmetology', {
      source: 'astrology',
      target: 'cosmetology',
      translationRules: [
        {
          pattern: /saturn return/gi,
          replacement: 'growing out your roots',
          context: 'maturation',
          priority: 9,
          bidirectional: false
        },
        {
          pattern: /mercury retrograde/gi,
          replacement: 'communication breakdown',
          context: 'miscommunication',
          priority: 8,
          bidirectional: false
        }
      ],
      commonPatterns: ['life-transitions', 'communication']
    });
  }

  private applyTranslationRules(
    text: string,
    sourceDialect: string,
    targetDialect: string,
    context?: string
  ): string {
    const pairKey = `${sourceDialect}->${targetDialect}`;
    const pair = this.dialectPairs.get(pairKey);

    if (!pair) {
      return text; // No translation rules available
    }

    let translated = text;

    // Apply rules in priority order
    for (const rule of pair.translationRules) {
      // Check context match if specified
      if (rule.context && context && !context.includes(rule.context)) {
        continue;
      }

      translated = translated.replace(rule.pattern, rule.replacement);
    }

    return translated;
  }

  private calculateTranslationConfidence(
    analysis: VPIAnalysis,
    impedanceMatch: ImpedanceMatch,
    wasTranslated: boolean
  ): number {
    let confidence = 0.5; // Base confidence

    // Analysis confidence contributes
    confidence += analysis.confidence * 0.2;

    // Impedance match success contributes
    confidence += impedanceMatch.successProbability * 0.3;

    // Translation occurred
    if (wasTranslated) {
      confidence += 0.2;
    }

    // Dialect compatibility
    if (analysis.detectedDialect === impedanceMatch.sourceDialect) {
      confidence += 0.1;
    }

    return Math.min(confidence, 1.0);
  }

  private countAppliedRules(original: string, translated: string): number {
    // Simple count of differences (could be more sophisticated)
    const originalWords = original.split(/\s+/);
    const translatedWords = translated.split(/\s+/);

    let changes = 0;
    for (let i = 0; i < Math.min(originalWords.length, translatedWords.length); i++) {
      if (originalWords[i] !== translatedWords[i]) {
        changes++;
      }
    }

    return changes;
  }

  private verifyIntentPreservation(analysis: VPIAnalysis, translated: string): boolean {
    // Simplified intent preservation check
    // In practice, this would use NLP to verify semantic similarity
    const originalIntent = analysis.intent.toLowerCase();
    const translatedIntent = this.extractIntentFromText(translated).toLowerCase();

    return originalIntent === translatedIntent ||
           translatedIntent.includes(originalIntent) ||
           originalIntent.includes(translatedIntent);
  }

  private extractIntentFromText(text: string): string {
    // Very simplified intent extraction
    // In practice, use NLP libraries
    const lowerText = text.toLowerCase();

    if (lowerText.includes('conflict') || lowerText.includes('fight')) {
      return 'conflict';
    }
    if (lowerText.includes('love') || lowerText.includes('care')) {
      return 'connection';
    }
    if (lowerText.includes('withdraw') || lowerText.includes('alone')) {
      return 'self-care';
    }

    return 'general';
  }
}