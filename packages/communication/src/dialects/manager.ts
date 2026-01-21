// Dialect Manager
// Manages communication dialects and their evolution

import { DialectDefinition, CommunicationPattern } from '../vpi/protocol';

export interface DialectEvolution {
  dialectId: string;
  version: number;
  changes: string[];
  timestamp: number;
  compatibility: string[]; // Compatible dialect versions
}

export interface DialectMetrics {
  dialectId: string;
  usageFrequency: number;
  effectiveness: number;
  adaptation: number;
  lastUsed: number;
  patterns: {
    total: number;
    effective: number;
    emerging: string[];
  };
}

export class DialectManager {
  private dialects: Map<string, DialectDefinition> = new Map();
  private evolution: Map<string, DialectEvolution[]> = new Map();
  private metrics: Map<string, DialectMetrics> = new Map();

  /**
   * Register a new dialect
   */
  registerDialect(dialect: DialectDefinition): void {
    this.dialects.set(dialect.id, dialect);

    // Initialize metrics
    this.metrics.set(dialect.id, {
      dialectId: dialect.id,
      usageFrequency: 0,
      effectiveness: 0.5,
      adaptation: 0,
      lastUsed: Date.now(),
      patterns: {
        total: dialect.patterns.length,
        effective: 0,
        emerging: []
      }
    });

    // Record evolution
    this.recordEvolution(dialect.id, `Initial dialect registration: ${dialect.name}`);
  }

  /**
   * Get dialect by ID
   */
  getDialect(dialectId: string): DialectDefinition | undefined {
    return this.dialects.get(dialectId);
  }

  /**
   * Update dialect effectiveness metrics
   */
  updateMetrics(dialectId: string, success: boolean, adaptation: number): void {
    const metrics = this.metrics.get(dialectId);
    if (!metrics) return;

    metrics.usageFrequency++;
    metrics.lastUsed = Date.now();

    // Update effectiveness (exponential moving average)
    const alpha = 0.1; // Learning rate
    metrics.effectiveness = alpha * (success ? 1 : 0) + (1 - alpha) * metrics.effectiveness;

    // Update adaptation
    metrics.adaptation = Math.max(metrics.adaptation, adaptation);

    // Update pattern effectiveness
    if (success) {
      metrics.patterns.effective = Math.min(metrics.patterns.effective + 1, metrics.patterns.total);
    }
  }

  /**
   * Evolve dialect based on usage patterns
   */
  evolveDialect(dialectId: string, newPatterns: CommunicationPattern[]): void {
    const dialect = this.dialects.get(dialectId);
    if (!dialect) return;

    // Add new patterns
    dialect.patterns.push(...newPatterns);

    // Update metrics
    const metrics = this.metrics.get(dialectId);
    if (metrics) {
      metrics.patterns.total = dialect.patterns.length;
      metrics.patterns.emerging.push(...newPatterns.map(p => p.intent));
    }

    // Record evolution
    this.recordEvolution(dialectId, `Added ${newPatterns.length} new patterns`);
  }

  /**
   * Get recommended dialect for context
   */
  recommendDialect(context: string, emotionalState?: string): string | null {
    let bestDialect: string | null = null;
    let bestScore = 0;

    for (const [dialectId, dialect] of this.dialects) {
      const metrics = this.metrics.get(dialectId);
      if (!metrics) continue;

      let score = metrics.effectiveness;

      // Context matching
      if (context && dialect.domain.toLowerCase().includes(context.toLowerCase())) {
        score += 0.2;
      }

      // Emotional state matching
      if (emotionalState) {
        const hasEmotionalPatterns = dialect.patterns.some(p =>
          Math.abs(p.emotionalValence) > 0.5
        );
        if (hasEmotionalPatterns) {
          score += 0.1;
        }
      }

      // Recency bonus
      const hoursSinceLastUse = (Date.now() - metrics.lastUsed) / (1000 * 60 * 60);
      if (hoursSinceLastUse < 24) {
        score += 0.1;
      }

      if (score > bestScore) {
        bestScore = score;
        bestDialect = dialectId;
      }
    }

    return bestDialect;
  }

  /**
   * Get dialect evolution history
   */
  getEvolutionHistory(dialectId: string): DialectEvolution[] {
    return this.evolution.get(dialectId) || [];
  }

  /**
   * Get all dialect metrics
   */
  getAllMetrics(): DialectMetrics[] {
    return Array.from(this.metrics.values());
  }

  /**
   * Merge dialects (for dialect evolution)
   */
  mergeDialects(sourceId: string, targetId: string, newName?: string): boolean {
    const source = this.dialects.get(sourceId);
    const target = this.dialects.get(targetId);

    if (!source || !target) return false;

    // Create merged dialect
    const merged: DialectDefinition = {
      id: `${targetId}-merged`,
      name: newName || `${target.name} (Enhanced)`,
      domain: target.domain,
      impedance: (source.impedance + target.impedance) / 2,
      patterns: [...target.patterns, ...source.patterns],
      translations: { ...target.translations, ...source.translations }
    };

    this.registerDialect(merged);

    // Record evolution for both dialects
    this.recordEvolution(sourceId, `Merged into ${merged.name}`);
    this.recordEvolution(targetId, `Enhanced with ${source.name} patterns`);

    return true;
  }

  /**
   * Detect emerging communication patterns
   */
  detectEmergingPatterns(text: string): CommunicationPattern[] {
    const patterns: CommunicationPattern[] = [];

    // Simple pattern detection (in practice, use ML/NLP)
    const repeatedPhrases = this.findRepeatedPhrases(text);

    for (const phrase of repeatedPhrases) {
      patterns.push({
        trigger: new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'),
        intent: 'emerging-pattern',
        emotionalValence: 0,
        impedance: 0.5,
        translation: phrase, // No translation needed for emerging patterns
        context: 'unknown'
      });
    }

    return patterns;
  }

  private recordEvolution(dialectId: string, change: string): void {
    const history = this.evolution.get(dialectId) || [];
    const version = history.length + 1;

    history.push({
      dialectId,
      version,
      changes: [change],
      timestamp: Date.now(),
      compatibility: [`v${version}`]
    });

    this.evolution.set(dialectId, history);
  }

  private findRepeatedPhrases(text: string): string[] {
    const phrases: string[] = [];
    const words = text.toLowerCase().split(/\s+/);

    // Find 2-3 word phrases that appear multiple times
    for (let length = 2; length <= 3; length++) {
      for (let i = 0; i <= words.length - length; i++) {
        const phrase = words.slice(i, i + length).join(' ');
        if (phrase.length > 10) { // Ignore very short phrases
          phrases.push(phrase);
        }
      }
    }

    // Count occurrences and return phrases that appear more than once
    const counts: Record<string, number> = {};
    for (const phrase of phrases) {
      counts[phrase] = (counts[phrase] || 0) + 1;
    }

    return Object.entries(counts)
      .filter(([, count]) => count > 1)
      .map(([phrase]) => phrase);
  }

  /**
   * Export dialect configuration
   */
  exportDialects(): Record<string, DialectDefinition> {
    return Object.fromEntries(this.dialects);
  }

  /**
   * Import dialect configuration
   */
  importDialects(dialects: Record<string, DialectDefinition>): void {
    for (const [id, dialect] of Object.entries(dialects)) {
      this.registerDialect(dialect);
    }
  }
}