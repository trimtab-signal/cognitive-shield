/**
 * VPI PROTOCOL SERVICE - Vacuum Pressure Impregnation
 * Impedance matching algorithm for communication translation
 *
 * "The Universal Translation Layer between Engineering and Relational"
 */

import type { ProcessedPayload } from '../types/shield.types';

export interface ImpedanceMatch {
  readonly sourceDialect: 'engineering' | 'astrology' | 'cosmetology';
  readonly targetDialect: 'engineering' | 'astrology' | 'cosmetology';
  readonly originalMessage: string;
  readonly translatedMessage: string;
  readonly impedanceRatio: number; // Γ = (Z_L - Z_0)/(Z_L + Z_0)
  readonly powerTransfer: number; // 1 - Γ²
  readonly resonance: boolean; // Γ = 0 (perfect match)
  readonly confidence: number;
  readonly explanation: string;
}

export interface CommunicationImpedance {
  readonly senderImpedance: number; // Z_L (load impedance)
  readonly receiverImpedance: number; // Z_0 (characteristic impedance)
  readonly reflectionCoefficient: number; // Γ
  readonly powerTransferEfficiency: number; // 1 - |Γ|²
  readonly standingWaveRatio: number; // SWR = (1 + |Γ|) / (1 - |Γ|)
  readonly bandwidth: number; // Communication bandwidth in Hz
}

export interface DialectMapping {
  readonly engineering: string;
  readonly astrology: string;
  readonly cosmetology: string;
  readonly purpose: string;
  readonly context: string;
  readonly impedance: number; // Characteristic impedance for this concept
}

export class VPIProtocolService {
  private static instance: VPIProtocolService;

  // Dialect translation matrix - core impedance matching mappings
  private readonly translationMatrix: Record<string, DialectMapping> = {
    'floating-neutral': {
      engineering: 'Floating Neutral',
      astrology: 'Hot Roots',
      cosmetology: 'Deep Conditioning Treatment',
      purpose: 'Explains why conflict heat is burning the ends (the children/future)',
      context: 'When explaining why arguments escalate and damage relationships',
      impedance: 50 // Standard characteristic impedance
    },
    'delta-topology': {
      engineering: 'Delta Topology',
      astrology: 'Age of Aquarius',
      cosmetology: 'Network of Sovereign Strands',
      purpose: 'Reframe shift from hierarchy to network of sovereigns',
      context: 'When describing desired relationship structure',
      impedance: 75
    },
    'high-impedance': {
      engineering: 'High Impedance',
      astrology: 'Mercury Retrograde',
      cosmetology: 'Processing Time',
      purpose: 'Explains need for solitude as self-care, not abandonment',
      context: 'When needing alone time to process emotions',
      impedance: 100
    },
    'impedance-matching': {
      engineering: 'Impedance Matching',
      astrology: 'Synastry Compatibility',
      cosmetology: 'pH Balancing',
      purpose: 'Shows communication styles need alignment for healthy connection',
      context: 'When teaching communication skills',
      impedance: 50
    },
    'vacuum-of-time': {
      engineering: 'Vacuum of Time',
      astrology: 'Void of Course Moon',
      cosmetology: 'Processing Period',
      purpose: 'Explains necessary pause before decisions',
      context: 'When suggesting waiting periods before major decisions',
      impedance: 25
    },
    'trim-tab-maneuver': {
      engineering: 'Trim Tab Maneuver',
      astrology: 'Small Shift, Big Change',
      cosmetology: 'Targeted Treatment',
      purpose: 'Shows small precise changes create major improvements',
      context: 'When proposing incremental changes to relationship patterns',
      impedance: 10
    },
    'marital-bond-repair': {
      engineering: 'Marital Bond Repair',
      astrology: 'Olaplex/Bond Building',
      cosmetology: 'Disulfide Bond Reconstruction',
      purpose: 'Describes repair of permanent identity vs temporary emotion',
      context: 'When discussing relationship repair vs incompatibility',
      impedance: 90
    },
    'system-resonance': {
      engineering: 'System Resonance',
      astrology: 'Harmonic Convergence',
      cosmetology: 'Perfect Product Synergy',
      purpose: 'Explains when multiple elements work together perfectly',
      context: 'When describing successful co-parenting phases',
      impedance: 0 // Perfect resonance
    },
    'phase-drift': {
      engineering: 'Phase Drift',
      astrology: 'Planetary Misalignment',
      cosmetology: 'pH Imbalance',
      purpose: 'Shows systems out of sync causing dysfunction',
      context: 'When identifying relationship problems',
      impedance: 200
    },
    'grounding': {
      engineering: 'Grounding',
      astrology: 'Earthing',
      cosmetology: 'Clay Mask Therapy',
      purpose: 'Explains need to discharge accumulated stress/energy',
      context: 'When suggesting stress-relief activities',
      impedance: 0 // Perfect ground
    }
  };

  static getInstance(): VPIProtocolService {
    if (!VPIProtocolService.instance) {
      VPIProtocolService.instance = new VPIProtocolService();
    }
    return VPIProtocolService.instance;
  }

  /**
   * Perform impedance matching translation
   */
  async translate(
    message: string,
    sourceDialect: 'engineering' | 'astrology' | 'cosmetology',
    targetDialect: 'engineering' | 'astrology' | 'cosmetology',
    payload?: ProcessedPayload
  ): Promise<ImpedanceMatch> {
    if (sourceDialect === targetDialect) {
      return {
        sourceDialect,
        targetDialect,
        originalMessage: message,
        translatedMessage: message,
        impedanceRatio: 0,
        powerTransfer: 1,
        resonance: true,
        confidence: 1.0,
        explanation: 'No translation needed - same dialect'
      };
    }

    // Find matching concept in translation matrix
    const concept = this.findMatchingConcept(message, sourceDialect);
    if (!concept) {
      // Fallback: attempt direct translation
      return this.fallbackTranslation(message, sourceDialect, targetDialect);
    }

    const mapping = this.translationMatrix[concept];
    const translatedMessage = mapping[targetDialect];

    // Calculate impedance matching
    const impedance = this.calculateImpedanceMatching(
      sourceDialect,
      targetDialect,
      mapping.impedance,
      payload
    );

    return {
      sourceDialect,
      targetDialect,
      originalMessage: message,
      translatedMessage: `${translatedMessage} - ${mapping.purpose}`,
      impedanceRatio: impedance.reflectionCoefficient,
      powerTransfer: impedance.powerTransferEfficiency,
      resonance: Math.abs(impedance.reflectionCoefficient) < 0.1,
      confidence: this.calculateConfidence(message, concept),
      explanation: `Translated from ${mapping[sourceDialect]} to ${translatedMessage} for better communication resonance`
    };
  }

  /**
   * Calculate communication impedance between sender and receiver
   */
  calculateCommunicationImpedance(
    senderDialect: 'engineering' | 'astrology' | 'cosmetology',
    receiverDialect: 'engineering' | 'astrology' | 'cosmetology',
    messageComplexity: number = 1
  ): CommunicationImpedance {
    // Characteristic impedances for each dialect
    const impedances = {
      engineering: 50,  // Balanced, technical
      astrology: 100,   // High impedance, symbolic
      cosmetology: 25   // Low impedance, practical
    };

    const senderImpedance = impedances[senderDialect];
    const receiverImpedance = impedances[receiverDialect];

    // Calculate reflection coefficient: Γ = (Z_L - Z_0)/(Z_L + Z_0)
    const reflectionCoefficient = (senderImpedance - receiverImpedance) /
                                  (senderImpedance + receiverImpedance);

    // Power transfer efficiency: 1 - |Γ|²
    const powerTransferEfficiency = 1 - Math.pow(Math.abs(reflectionCoefficient), 2);

    // Standing Wave Ratio: SWR = (1 + |Γ|) / (1 - |Γ|)
    const standingWaveRatio = (1 + Math.abs(reflectionCoefficient)) /
                              (1 - Math.abs(reflectionCoefficient));

    // Bandwidth affected by impedance mismatch
    const bandwidth = 1000000 * powerTransferEfficiency * messageComplexity; // Hz

    return {
      senderImpedance,
      receiverImpedance,
      reflectionCoefficient,
      powerTransferEfficiency,
      standingWaveRatio,
      bandwidth
    };
  }

  /**
   * Execute VPI Protocol communication sequence
   * 1. Pull Vacuum - Cease arguments and defenses
   * 2. Flood with Resin - Use validation/empathy to seal anxiety
   * 3. Cure - Allow external pressure to harden boundaries
   */
  async executeVPIProtocol(
    communicationContext: {
      senderDialect: 'engineering' | 'astrology' | 'cosmetology';
      receiverDialect: 'engineering' | 'astrology' | 'cosmetology';
      emotionalVoltage: number; // 1-10 scale
      relationshipContext: 'conflict' | 'healing' | 'structure' | 'general';
    }
  ): Promise<{
    sequence: string[];
    recommendedDialect: 'engineering' | 'astrology' | 'cosmetology';
    impedanceMatch: CommunicationImpedance;
    successProbability: number;
  }> {
    const { senderDialect, receiverDialect, emotionalVoltage, relationshipContext } = communicationContext;

    // Determine optimal communication dialect based on context
    const recommendedDialect = this.determineOptimalDialect(
      senderDialect,
      receiverDialect,
      emotionalVoltage,
      relationshipContext
    );

    // Calculate impedance matching
    const impedanceMatch = this.calculateCommunicationImpedance(
      senderDialect,
      recommendedDialect,
      emotionalVoltage / 10 // Normalize to 0-1 for complexity
    );

    // Generate VPI sequence
    const sequence = this.generateVPISequence(
      emotionalVoltage,
      relationshipContext,
      impedanceMatch.powerTransferEfficiency
    );

    // Calculate success probability
    const successProbability = this.calculateSuccessProbability(
      impedanceMatch,
      emotionalVoltage,
      relationshipContext
    );

    return {
      sequence,
      recommendedDialect,
      impedanceMatch,
      successProbability
    };
  }

  /**
   * Get available translation mappings
   */
  getTranslationMappings(): DialectMapping[] {
    return Object.values(this.translationMatrix);
  }

  // Private helper methods

  private findMatchingConcept(message: string, sourceDialect: string): string | null {
    const lowerMessage = message.toLowerCase();

    for (const [key, mapping] of Object.entries(this.translationMatrix)) {
      const sourceTerm = mapping[sourceDialect].toLowerCase();
      if (lowerMessage.includes(sourceTerm) ||
          sourceTerm.includes(lowerMessage) ||
          this.calculateSemanticSimilarity(lowerMessage, sourceTerm) > 0.7) {
        return key;
      }
    }

    return null;
  }

  private calculateSemanticSimilarity(text1: string, text2: string): number {
    // Simple word overlap similarity (in production, use embeddings)
    const words1 = text1.toLowerCase().split(/\s+/);
    const words2 = text2.toLowerCase().split(/\s+/);

    const intersection = words1.filter(word => words2.includes(word));
    const union = [...new Set([...words1, ...words2])];

    return intersection.length / union.length;
  }

  private fallbackTranslation(
    message: string,
    sourceDialect: string,
    targetDialect: string
  ): ImpedanceMatch {
    // Simple fallback translation based on dialect characteristics
    let translatedMessage = message;

    if (sourceDialect === 'engineering' && targetDialect === 'astrology') {
      translatedMessage = `"${message}" - In cosmic terms, this represents an energetic alignment seeking harmony`;
    } else if (sourceDialect === 'engineering' && targetDialect === 'cosmetology') {
      translatedMessage = `"${message}" - This is like a treatment that restores balance and health to the system`;
    } else if (sourceDialect === 'astrology' && targetDialect === 'engineering') {
      translatedMessage = `"${message}" - Translating to technical terms: this represents system optimization and efficiency`;
    }
    // Add more fallback translations as needed

    return {
      sourceDialect,
      targetDialect,
      originalMessage: message,
      translatedMessage,
      impedanceRatio: 0.5, // Moderate mismatch
      powerTransfer: 0.75,
      resonance: false,
      confidence: 0.6,
      explanation: 'Fallback translation - limited confidence'
    };
  }

  private calculateImpedanceMatching(
    sourceDialect: string,
    targetDialect: string,
    conceptImpedance: number,
    payload?: ProcessedPayload
  ): CommunicationImpedance {
    // Adjust impedance based on message voltage/triggers
    let adjustedImpedance = conceptImpedance;

    if (payload) {
      // Higher voltage = higher impedance mismatch potential
      adjustedImpedance *= (1 + payload.voltage / 20);
      // More triggers = more complex communication
      adjustedImpedance *= (1 + payload.triggers.length / 10);
    }

    return this.calculateCommunicationImpedance(sourceDialect, targetDialect, adjustedImpedance / 100);
  }

  private calculateConfidence(message: string, concept: string): number {
    const mapping = this.translationMatrix[concept];
    const sourceTerm = mapping[mapping.sourceDialect].toLowerCase();

    // Confidence based on term matching and context relevance
    let confidence = 0.5;

    if (message.toLowerCase().includes(sourceTerm)) {
      confidence += 0.3;
    }

    if (message.length > sourceTerm.length * 2) {
      confidence += 0.2; // Longer messages with matching terms = higher confidence
    }

    return Math.min(confidence, 1.0);
  }

  private determineOptimalDialect(
    senderDialect: string,
    receiverDialect: string,
    emotionalVoltage: number,
    context: string
  ): 'engineering' | 'astrology' | 'cosmetology' {
    // High emotional voltage (>6) → Use receiver's dialect for de-escalation
    if (emotionalVoltage > 6) {
      return receiverDialect;
    }

    // Conflict context → Use neutral dialect (cosmetology)
    if (context === 'conflict') {
      return 'cosmetology';
    }

    // Healing context → Use receiver's dialect
    if (context === 'healing') {
      return receiverDialect;
    }

    // Structure context → Use engineering for clarity
    if (context === 'structure') {
      return 'engineering';
    }

    // Default: use receiver's dialect
    return receiverDialect;
  }

  private generateVPISequence(
    emotionalVoltage: number,
    context: string,
    powerTransferEfficiency: number
  ): string[] {
    const sequence: string[] = [];

    // Phase 1: Pull Vacuum - Duration based on emotional voltage
    const vacuumDuration = Math.max(3, emotionalVoltage / 3); // 3-3.3 seconds
    sequence.push(`1. Pull Vacuum (${vacuumDuration.toFixed(1)}s): Cease all arguments and defenses. Create low-pressure zone.`);

    // Phase 2: Flood with Resin - Empathy based on context
    if (context === 'conflict') {
      sequence.push('2. Flood with Resin: Validate their feelings first. "I can see why this hurts you."');
    } else if (context === 'healing') {
      sequence.push('2. Flood with Resin: Use empathy oil. "I know this has been hard for you."');
    } else {
      sequence.push('2. Flood with Resin: Apply validation. "Your feelings are valid and important."');
    }

    // Phase 3: Cure - Allow natural pressure
    if (powerTransferEfficiency > 0.8) {
      sequence.push('3. Cure: Allow natural conversation flow. Impedance matched - communication will flow.');
    } else {
      sequence.push('3. Cure: Use translated concepts to bridge gap. Monitor for resonance indicators.');
    }

    return sequence;
  }

  private calculateSuccessProbability(
    impedance: CommunicationImpedance,
    emotionalVoltage: number,
    context: string
  ): number {
    let probability = impedance.powerTransferEfficiency;

    // Emotional voltage reduces success probability
    probability *= (1 - emotionalVoltage / 20);

    // Context modifiers
    if (context === 'healing') probability *= 1.2;
    if (context === 'conflict') probability *= 0.8;
    if (context === 'structure') probability *= 1.1;

    return Math.max(0, Math.min(probability, 1));
  }
}

export default VPIProtocolService;