// VPI (Variable Phase Impedance) Communication Protocol
// Implements impedance matching for human communication

export interface VPIConfig {
  enabled: boolean;
  dialects: Record<string, DialectDefinition>;
  impedanceMatching: boolean;
  activeDialect: string;
  adaptationRate: number; // How quickly to adapt to new patterns
}

export interface DialectDefinition {
  id: string;
  name: string;
  domain: 'engineering' | 'astrology' | 'cosmetology' | 'psychology' | 'legal';
  impedance: number; // 0-1, where 0 is high impedance (resistant to change)
  patterns: CommunicationPattern[];
  translations: Record<string, string>;
}

export interface CommunicationPattern {
  trigger: RegExp;
  intent: string;
  emotionalValence: number; // -1 to 1
  impedance: number;
  translation: string;
  context: string;
}

export interface VPIAnalysis {
  input: string;
  detectedDialect: string;
  impedance: number;
  emotionalValence: number;
  intent: string;
  translation: string;
  confidence: number;
  recommendations: string[];
}

export interface ImpedanceMatch {
  sourceDialect: string;
  targetDialect: string;
  originalMessage: string;
  translatedMessage: string;
  impedanceDelta: number;
  successProbability: number;
}

export class VPIProtocol {
  private config: VPIConfig;
  private dialectHistory: Map<string, number> = new Map();
  private adaptationMemory: Map<string, number> = new Map();

  constructor(config: VPIConfig) {
    this.config = config;
  }

  /**
   * Analyze incoming communication using VPI
   */
  analyze(input: string, context?: string): VPIAnalysis {
    const patterns = this.getAllPatterns();

    let bestMatch: CommunicationPattern | null = null;
    let highestConfidence = 0;
    let detectedDialect = this.config.activeDialect;

    // Analyze against all patterns
    for (const pattern of patterns) {
      const match = input.match(pattern.trigger);
      if (match) {
        const confidence = this.calculateMatchConfidence(input, pattern, context);

        if (confidence > highestConfidence) {
          highestConfidence = confidence;
          bestMatch = pattern;
          detectedDialect = this.findDialectForPattern(pattern);
        }
      }
    }

    if (!bestMatch) {
      // Default analysis for unmatched input
      return {
        input,
        detectedDialect: 'unknown',
        impedance: 0.5,
        emotionalValence: 0,
        intent: 'unknown',
        translation: input,
        confidence: 0.1,
        recommendations: ['Continue monitoring for pattern emergence']
      };
    }

    const impedance = this.calculateImpedance(bestMatch, context);
    const recommendations = this.generateRecommendations(bestMatch, impedance, detectedDialect);

    return {
      input,
      detectedDialect,
      impedance,
      emotionalValence: bestMatch.emotionalValence,
      intent: bestMatch.intent,
      translation: bestMatch.translation,
      confidence: highestConfidence,
      recommendations
    };
  }

  /**
   * Perform impedance matching between dialects
   */
  matchImpedance(sourceDialect: string, targetDialect: string, message: string): ImpedanceMatch {
    const source = this.config.dialects[sourceDialect];
    const target = this.config.dialects[targetDialect];

    if (!source || !target) {
      throw new Error(`Unknown dialect: ${!source ? sourceDialect : targetDialect}`);
    }

    let translatedMessage = message;
    let impedanceDelta = Math.abs(source.impedance - target.impedance);

    // Apply translations
    for (const [pattern, translation] of Object.entries(source.translations)) {
      const targetTranslation = target.translations[pattern];
      if (targetTranslation) {
        translatedMessage = translatedMessage.replace(
          new RegExp(pattern, 'gi'),
          targetTranslation
        );
      }
    }

    // Calculate success probability
    const successProbability = Math.max(0, 1 - impedanceDelta);

    return {
      sourceDialect,
      targetDialect,
      originalMessage: message,
      translatedMessage,
      impedanceDelta,
      successProbability
    };
  }

  /**
   * Adapt protocol based on communication history
   */
  adapt(analysis: VPIAnalysis): void {
    // Update dialect usage frequency
    const current = this.dialectHistory.get(analysis.detectedDialect) || 0;
    this.dialectHistory.set(analysis.detectedDialect, current + 1);

    // Update adaptation memory
    const key = `${analysis.intent}:${analysis.emotionalValence}`;
    const currentAdaptation = this.adaptationMemory.get(key) || 0;
    const newAdaptation = currentAdaptation + (analysis.confidence * this.config.adaptationRate);
    this.adaptationMemory.set(key, Math.min(newAdaptation, 1.0));

    // Auto-switch active dialect if needed
    this.updateActiveDialect();
  }

  /**
   * Get relational stabilization recommendations
   */
  getStabilizationRecommendations(situation: string): string[] {
    const recommendations: string[] = [];

    // Engineering to Astrology translation
    if (situation.includes('conflict') || situation.includes('floating neutral')) {
      recommendations.push('Translate "floating neutral" as "hot roots" - explains why conflict creates instability');
      recommendations.push('Frame Delta Topology as "Age of Aquarius" - network sovereignty over hierarchy');
    }

    // Engineering to Cosmetology translation
    if (situation.includes('withdrawal') || situation.includes('solitude')) {
      recommendations.push('Translate high impedance as "deep conditioning" - explains need for self-care');
      recommendations.push('Frame bond repair as "Olaplex/Bond Building" - disulfide vs hydrogen bond metaphor');
    }

    // General stabilization
    recommendations.push('Maintain dialect consistency to build trust');
    recommendations.push('Use impedance matching to reduce communication friction');
    recommendations.push('Monitor for dialect drift and recalibrate as needed');

    return recommendations;
  }

  private getAllPatterns(): CommunicationPattern[] {
    const patterns: CommunicationPattern[] = [];

    for (const dialect of Object.values(this.config.dialects)) {
      patterns.push(...dialect.patterns);
    }

    return patterns;
  }

  private findDialectForPattern(pattern: CommunicationPattern): string {
    for (const [dialectId, dialect] of Object.entries(this.config.dialects)) {
      if (dialect.patterns.includes(pattern)) {
        return dialectId;
      }
    }
    return 'unknown';
  }

  private calculateMatchConfidence(
    input: string,
    pattern: CommunicationPattern,
    context?: string
  ): number {
    let confidence = 0.5; // Base confidence

    // Exact match gets high confidence
    if (pattern.trigger.test(input)) {
      confidence += 0.3;
    }

    // Context matching
    if (context && pattern.context.toLowerCase().includes(context.toLowerCase())) {
      confidence += 0.2;
    }

    // Adaptation memory boost
    const key = `${pattern.intent}:${pattern.emotionalValence}`;
    const adaptation = this.adaptationMemory.get(key) || 0;
    confidence += adaptation * 0.1;

    return Math.min(confidence, 1.0);
  }

  private calculateImpedance(pattern: CommunicationPattern, context?: string): number {
    let impedance = pattern.impedance;

    // Context can modify impedance
    if (context === 'crisis') {
      impedance = Math.max(impedance, 0.8); // High impedance in crisis
    } else if (context === 'intimate') {
      impedance = Math.min(impedance, 0.3); // Lower impedance in intimate settings
    }

    return impedance;
  }

  private generateRecommendations(
    pattern: CommunicationPattern,
    impedance: number,
    dialect: string
  ): string[] {
    const recommendations: string[] = [];

    if (impedance > 0.7) {
      recommendations.push('High impedance detected - consider dialect translation for better reception');
    }

    if (pattern.emotionalValence < -0.5) {
      recommendations.push('Negative valence detected - prioritize emotional safety protocols');
    }

    if (dialect !== this.config.activeDialect) {
      recommendations.push(`Dialect shift to ${dialect} recommended for optimal communication`);
    }

    if (pattern.intent === 'conflict') {
      recommendations.push('Apply relational stabilization: translate engineering concepts to native dialect');
    }

    return recommendations;
  }

  private updateActiveDialect(): void {
    let mostUsed = this.config.activeDialect;
    let maxUsage = 0;

    for (const [dialect, usage] of this.dialectHistory) {
      if (usage > maxUsage) {
        maxUsage = usage;
        mostUsed = dialect;
      }
    }

    if (mostUsed !== this.config.activeDialect) {
      console.log(`VPI: Switching active dialect from ${this.config.activeDialect} to ${mostUsed}`);
      this.config.activeDialect = mostUsed;
    }
  }

  /**
   * Get protocol statistics
   */
  getStatistics(): {
    activeDialect: string;
    dialectUsage: Record<string, number>;
    adaptationMemory: Record<string, number>;
    totalAnalyses: number;
  } {
    return {
      activeDialect: this.config.activeDialect,
      dialectUsage: Object.fromEntries(this.dialectHistory),
      adaptationMemory: Object.fromEntries(this.adaptationMemory),
      totalAnalyses: Array.from(this.adaptationMemory.values()).reduce((a, b) => a + b, 0)
    };
  }
}