/**
 * @license
 * Copyright 2026 Wonky Sprout DUNA
 *
 * Licensed under the AGPLv3 License, Version 3.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.gnu.org/licenses/agpl-3.0.html
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║   DIGITAL CENTAUR STACK                                                    ║
 * ║   Human-AI Symbiosis Architecture                                          ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 * 
 * "The Digital Centaur is not a tool user, but a symbiotic super-organism
 *  comprising a human operator and a sophisticated stack of synthetic cognition."
 * 
 * The Three Components:
 * - THE HANDS: Performance Layer (Cursor/Copilot) - Muscle memory, syntax execution
 * - THE MEMORY: Infinite Context (Gemini Pro) - Long-term memory, social tomography
 * - THE SOUL: Reasoning Engine (Claude) - Ethical weighing, architectural decisions
 */

import type { HumanOS } from '../types/gensync.types';

// ============================================================================
// COGNITIVE STACK CONFIGURATION
// ============================================================================

export interface CentaurConfig {
  hands: HandsConfig;
  memory: MemoryConfig;
  soul: SoulConfig;
  operator: OperatorProfile;
}

export interface HandsConfig {
  provider: 'cursor' | 'copilot' | 'cody' | 'manual';
  enabled: boolean;
  autonomyLevel: 'low' | 'medium' | 'high';
  allowedOperations: ('syntax' | 'refactor' | 'complete' | 'explain')[];
}

export interface MemoryConfig {
  provider: 'gemini' | 'claude' | 'ollama' | 'local';
  model: string;
  contextWindow: number; // in tokens
  socialTomographyEnabled: boolean;
  historyRetentionDays: number;
}

export interface SoulConfig {
  provider: 'claude' | 'gpt4' | 'ollama' | 'local';
  model: string;
  temperature: number;
  ethicalGuardrails: boolean;
  harmonicLinterEnabled: boolean;
  resonanceTarget: number;
}

export interface OperatorProfile {
  id: string;
  humanOS: HumanOS;
  spoonBudget: number;
  dailyCheckInPercentage: number;
  constitution: Constitution;
  triggerWords: string[];
  safeWords: string[];
}

export interface Constitution {
  coreBoundaries: string[];
  nonNegotiables: string[];
  preferredCommunicationStyle: string;
  decisionFramework: 'utilitarian' | 'deontological' | 'virtue' | 'care';
}

// ============================================================================
// THE DIGITAL CENTAUR CLASS
// ============================================================================

export class DigitalCentaur {
  private config: CentaurConfig;
  private conversationHistory: ConversationEntry[] = [];
  private currentState: CentaurState = 'idle';
  private resonanceScore: number = 0.35;

  constructor(config: CentaurConfig) {
    this.config = config;
  }

  /**
   * Process user intent through the full Centaur stack
   * Flow: Intent → Hands (Syntax) → Memory (Context) → Soul (Decision) → Output
   */
  async processIntent(intent: string): Promise<CentaurResponse> {
    this.currentState = 'processing';
    const startTime = Date.now();

    try {
      // Phase 1: THE HANDS - Parse and structure the intent
      const structuredIntent = await this.handsProcess(intent);

      // Phase 2: THE MEMORY - Enrich with context and history
      const enrichedContext = await this.memoryEnrich(structuredIntent);

      // Phase 3: THE SOUL - Reason and decide
      const decision = await this.soulReason(enrichedContext);

      // Record in conversation history
      this.conversationHistory.push({
        timestamp: Date.now(),
        role: 'user',
        content: intent,
      });
      this.conversationHistory.push({
        timestamp: Date.now(),
        role: 'centaur',
        content: decision.response,
        metadata: {
          resonanceScore: decision.resonanceScore,
          spoonCost: decision.spoonCost,
          processingTime: Date.now() - startTime,
        },
      });

      this.currentState = 'idle';
      return decision;

    } catch (error) {
      this.currentState = 'error';
      throw error;
    }
  }

  /**
   * THE HANDS: Autonomic processing layer
   * Handles syntax, completion, and low-level code operations
   */
  private async handsProcess(intent: string): Promise<StructuredIntent> {
    // Detect intent type
    const intentType = this.classifyIntent(intent);
    
    // Extract code blocks if present
    const codeBlocks = this.extractCodeBlocks(intent);
    
    // Identify required operations
    const operations = this.identifyOperations(intent, intentType);

    return {
      raw: intent,
      type: intentType,
      codeBlocks,
      operations,
      confidence: this.calculateIntentConfidence(intent),
    };
  }

  /**
   * THE MEMORY: Context enrichment layer
   * Provides long-term memory and social tomography
   */
  private async memoryEnrich(intent: StructuredIntent): Promise<EnrichedContext> {
    // Get relevant history
    const relevantHistory = this.getRelevantHistory(intent);
    
    // Build social tomography (conflict history, relationship patterns)
    const socialTomography = this.config.memory.socialTomographyEnabled
      ? this.buildSocialTomography()
      : null;

    // Get operator's current state
    const operatorState = {
      humanOS: this.config.operator.humanOS,
      spoonBudget: this.config.operator.spoonBudget,
      dailyCheckInPercentage: this.config.operator.dailyCheckInPercentage,
      isInProtectedMode: this.config.operator.dailyCheckInPercentage < 25,
    };

    return {
      intent,
      history: relevantHistory,
      socialTomography,
      operatorState,
      contextWindow: this.buildContextWindow(),
    };
  }

  /**
   * THE SOUL: Reasoning and ethical decision layer
   * Applies harmonic linting and ethical guardrails
   */
  private async soulReason(context: EnrichedContext): Promise<CentaurResponse> {
    // Apply ethical guardrails
    if (this.config.soul.ethicalGuardrails) {
      const ethicalCheck = this.checkEthicalBoundaries(context);
      if (!ethicalCheck.passed) {
        return {
          response: ethicalCheck.refusalMessage || 'I cannot assist with this request.',
          resonanceScore: 0,
          spoonCost: 0,
          decisions: [],
          warnings: ethicalCheck.warnings,
        };
      }
    }

    // Check against operator's constitution
    const constitutionCheck = this.checkConstitution(context);
    
    // Generate response (placeholder - would call actual LLM)
    const response = this.generateResponse(context);

    // Calculate harmonic resonance
    const resonanceScore = this.calculateResonance(response);
    
    // Calculate spoon cost
    const spoonCost = this.calculateSpoonCost(context.intent);

    return {
      response,
      resonanceScore,
      spoonCost,
      decisions: constitutionCheck.decisions,
      warnings: constitutionCheck.warnings,
    };
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private classifyIntent(intent: string): IntentType {
    const lowerIntent = intent.toLowerCase();
    
    if (/\b(create|build|make|generate)\b/.test(lowerIntent)) return 'create';
    if (/\b(fix|repair|debug|solve)\b/.test(lowerIntent)) return 'fix';
    if (/\b(explain|what|how|why)\b/.test(lowerIntent)) return 'understand';
    if (/\b(refactor|improve|optimize)\b/.test(lowerIntent)) return 'refactor';
    if (/\b(translate|convert|transform)\b/.test(lowerIntent)) return 'translate';
    if (/\b(help|support|assist)\b/.test(lowerIntent)) return 'assist';
    
    return 'general';
  }

  private extractCodeBlocks(text: string): string[] {
    const codeBlockRegex = /```[\s\S]*?```/g;
    const matches = text.match(codeBlockRegex) || [];
    return matches.map(block => block.replace(/```\w*\n?|\n?```/g, ''));
  }

  private identifyOperations(_intent: string, type: IntentType): CentaurOperation[] {
    const operations: CentaurOperation[] = [];
    
    if (type === 'create') {
      operations.push({ type: 'generate', priority: 'high' });
      operations.push({ type: 'lint', priority: 'high' });
    }
    if (type === 'fix') {
      operations.push({ type: 'analyze', priority: 'high' });
      operations.push({ type: 'patch', priority: 'high' });
    }
    if (type === 'understand') {
      operations.push({ type: 'explain', priority: 'medium' });
    }
    
    return operations;
  }

  private calculateIntentConfidence(intent: string): number {
    // Simple heuristic: longer, more specific intents = higher confidence
    const wordCount = intent.split(/\s+/).length;
    const hasKeywords = /\b(please|want|need|create|help)\b/i.test(intent);
    
    let confidence = Math.min(wordCount / 20, 0.5);
    if (hasKeywords) confidence += 0.3;
    if (intent.includes('```')) confidence += 0.2; // Has code blocks
    
    return Math.min(confidence, 1);
  }

  private getRelevantHistory(intent: StructuredIntent): ConversationEntry[] {
    // Get last N relevant entries based on intent type
    const maxEntries = 10;
    return this.conversationHistory.slice(-maxEntries);
  }

  private buildSocialTomography(): SocialTomography {
    // Build a map of relationship patterns and conflict history
    // This would integrate with the shield store in a full implementation
    return {
      conflictPatterns: [],
      relationshipHealth: 'stable',
      recentTriggers: [],
      supportNetwork: [],
    };
  }

  private buildContextWindow(): string {
    // Build the context window for the LLM
    const recentHistory = this.conversationHistory.slice(-5);
    return recentHistory
      .map(entry => `[${entry.role}]: ${entry.content}`)
      .join('\n');
  }

  private checkEthicalBoundaries(context: EnrichedContext): EthicalCheck {
    const warnings: string[] = [];
    
    // Check for harm indicators
    const harmPatterns = /\b(hurt|kill|destroy|attack|hack)\b/i;
    if (harmPatterns.test(context.intent.raw)) {
      return {
        passed: false,
        warnings: ['Potential harm detected in request'],
        refusalMessage: 'I cannot assist with requests that may cause harm.',
      };
    }

    // Check operator's trigger words
    for (const trigger of this.config.operator.triggerWords) {
      if (context.intent.raw.toLowerCase().includes(trigger.toLowerCase())) {
        warnings.push(`Trigger word detected: "${trigger}"`);
      }
    }

    return { passed: true, warnings };
  }

  private checkConstitution(context: EnrichedContext): ConstitutionCheck {
    const decisions: string[] = [];
    const warnings: string[] = [];

    // Check against core boundaries
    for (const boundary of this.config.operator.constitution.coreBoundaries) {
      if (this.violatesBoundary(context.intent.raw, boundary)) {
        warnings.push(`May conflict with boundary: "${boundary}"`);
      }
    }

    // Check spoon budget
    if (context.operatorState.spoonBudget < 3) {
      decisions.push('Low spoon mode: Simplifying response');
    }

    // Check protected mode
    if (context.operatorState.isInProtectedMode) {
      decisions.push('Protected mode active: Extra validation required');
    }

    return { decisions, warnings };
  }

  private violatesBoundary(intent: string, boundary: string): boolean {
    // Simple keyword matching - would be more sophisticated in production
    const boundaryKeywords = boundary.toLowerCase().split(/\s+/);
    const intentLower = intent.toLowerCase();
    return boundaryKeywords.some(keyword => 
      keyword.length > 3 && intentLower.includes(keyword)
    );
  }

  private generateResponse(context: EnrichedContext): string {
    // Placeholder - would call actual LLM in production
    return `I understand you want to ${context.intent.type}. Based on your current state (${context.operatorState.dailyCheckInPercentage}% capacity), I'll help you with this in a way that respects your energy levels.`;
  }

  private calculateResonance(response: string): number {
    // Simplified resonance calculation
    const length = response.length;
    const complexity = (response.match(/[.!?]/g) || []).length;
    
    const order = Math.log(length + 1) / 10;
    const entropy = complexity / 20;
    
    if (order + entropy === 0) return 0.35;
    return order / (order + entropy);
  }

  private calculateSpoonCost(intent: StructuredIntent): number {
    let cost = 1; // Base cost
    
    if (intent.type === 'create') cost += 3;
    if (intent.type === 'fix') cost += 2;
    if (intent.codeBlocks.length > 0) cost += intent.codeBlocks.length;
    if (intent.operations.some(op => op.priority === 'high')) cost += 1;
    
    return cost;
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  getState(): CentaurState {
    return this.currentState;
  }

  getResonance(): number {
    return this.resonanceScore;
  }

  getHistory(): ConversationEntry[] {
    return [...this.conversationHistory];
  }

  clearHistory(): void {
    this.conversationHistory = [];
  }

  updateOperatorState(updates: Partial<OperatorProfile>): void {
    this.config.operator = { ...this.config.operator, ...updates };
  }
}

// ============================================================================
// TYPES
// ============================================================================

export type CentaurState = 'idle' | 'processing' | 'error' | 'protected';
export type IntentType = 'create' | 'fix' | 'understand' | 'refactor' | 'translate' | 'assist' | 'general';

export interface StructuredIntent {
  raw: string;
  type: IntentType;
  codeBlocks: string[];
  operations: CentaurOperation[];
  confidence: number;
}

export interface CentaurOperation {
  type: 'generate' | 'lint' | 'analyze' | 'patch' | 'explain' | 'refactor';
  priority: 'low' | 'medium' | 'high';
}

export interface ConversationEntry {
  timestamp: number;
  role: 'user' | 'centaur' | 'system';
  content: string;
  metadata?: {
    resonanceScore?: number;
    spoonCost?: number;
    processingTime?: number;
  };
}

export interface EnrichedContext {
  intent: StructuredIntent;
  history: ConversationEntry[];
  socialTomography: SocialTomography | null;
  operatorState: {
    humanOS: HumanOS;
    spoonBudget: number;
    dailyCheckInPercentage: number;
    isInProtectedMode: boolean;
  };
  contextWindow: string;
}

export interface SocialTomography {
  conflictPatterns: string[];
  relationshipHealth: 'healthy' | 'stable' | 'strained' | 'critical';
  recentTriggers: string[];
  supportNetwork: string[];
}

export interface CentaurResponse {
  response: string;
  resonanceScore: number;
  spoonCost: number;
  decisions: string[];
  warnings: string[];
}

export interface EthicalCheck {
  passed: boolean;
  warnings: string[];
  refusalMessage?: string;
}

export interface ConstitutionCheck {
  decisions: string[];
  warnings: string[];
}

// ============================================================================
// DEFAULT CONFIGURATION
// ============================================================================

export const DEFAULT_CENTAUR_CONFIG: CentaurConfig = {
  hands: {
    provider: 'manual',
    enabled: true,
    autonomyLevel: 'medium',
    allowedOperations: ['syntax', 'complete', 'explain'],
  },
  memory: {
    provider: 'local',
    model: 'local-context',
    contextWindow: 4096,
    socialTomographyEnabled: true,
    historyRetentionDays: 30,
  },
  soul: {
    provider: 'ollama',
    model: 'llama3.2',
    temperature: 0.7,
    ethicalGuardrails: true,
    harmonicLinterEnabled: true,
    resonanceTarget: 0.35,
  },
  operator: {
    id: 'default-operator',
    humanOS: 'integrator',
    spoonBudget: 12,
    dailyCheckInPercentage: 100,
    constitution: {
      coreBoundaries: ['No harm to self or others', 'Respect autonomy', 'Maintain honesty'],
      nonNegotiables: ['Safety first', 'Consent required'],
      preferredCommunicationStyle: 'Direct but compassionate',
      decisionFramework: 'care',
    },
    triggerWords: [],
    safeWords: [],
  },
};
