// Relational Stabilizer
// Implements relational stabilization protocols using VPI communication

export interface RelationalContext {
  relationshipId: string;
  participants: string[];
  dialect: string;
  impedance: number;
  stability: number; // 0-1, where 1 is fully stable
  lastInteraction: Date;
  pattern: InteractionPattern[];
}

export interface InteractionPattern {
  timestamp: Date;
  type: 'communication' | 'conflict' | 'resolution' | 'withdrawal' | 'connection';
  impedance: number;
  success: boolean;
  notes?: string;
}

export interface StabilizationStrategy {
  id: string;
  name: string;
  description: string;
  conditions: StabilizationCondition[];
  actions: StabilizationAction[];
  expectedOutcome: string;
}

export interface StabilizationCondition {
  metric: 'impedance' | 'stability' | 'communication-frequency' | 'conflict-rate';
  operator: '>' | '<' | '=' | '>=' | '<=';
  value: number;
  duration?: number; // minutes
}

export interface StabilizationAction {
  type: 'dialect-translation' | 'impedance-matching' | 'pattern-interruption' | 'safety-protocol';
  targetDialect?: string;
  message?: string;
  delay?: number; // seconds
}

export interface StabilizationReport {
  relationshipId: string;
  overallStability: number;
  recommendedActions: StabilizationAction[];
  riskFactors: string[];
  successProbability: number;
  timeline: StabilizationEvent[];
}

export interface StabilizationEvent {
  timestamp: Date;
  event: string;
  impact: number; // -1 to 1
  notes?: string;
}

export class RelationalStabilizer {
  private contexts: Map<string, RelationalContext> = new Map();
  private strategies: StabilizationStrategy[] = [];
  private stabilizationHistory: Map<string, StabilizationEvent[]> = new Map();

  constructor() {
    this.initializeStrategies();
  }

  /**
   * Register a relationship context
   */
  registerRelationship(
    relationshipId: string,
    participants: string[],
    initialDialect: string = 'engineering'
  ): RelationalContext {
    const context: RelationalContext = {
      relationshipId,
      participants,
      dialect: initialDialect,
      impedance: 0.5,
      stability: 0.5,
      lastInteraction: new Date(),
      pattern: []
    };

    this.contexts.set(relationshipId, context);
    this.stabilizationHistory.set(relationshipId, []);

    return context;
  }

  /**
   * Record interaction and update stability metrics
   */
  recordInteraction(
    relationshipId: string,
    type: InteractionPattern['type'],
    impedance: number,
    success: boolean,
    notes?: string
  ): void {
    const context = this.contexts.get(relationshipId);
    if (!context) return;

    const pattern: InteractionPattern = {
      timestamp: new Date(),
      type,
      impedance,
      success,
      notes
    };

    context.pattern.push(pattern);
    context.lastInteraction = new Date();

    // Update impedance (exponential moving average)
    const alpha = 0.3;
    context.impedance = alpha * impedance + (1 - alpha) * context.impedance;

    // Update stability based on interaction success
    this.updateStability(context, pattern);

    // Keep only last 50 interactions for memory efficiency
    if (context.pattern.length > 50) {
      context.pattern = context.pattern.slice(-50);
    }
  }

  /**
   * Generate stabilization report
   */
  generateReport(relationshipId: string): StabilizationReport {
    const context = this.contexts.get(relationshipId);
    if (!context) {
      throw new Error(`Relationship ${relationshipId} not found`);
    }

    const recommendedActions = this.determineActions(context);
    const riskFactors = this.identifyRisks(context);
    const successProbability = this.calculateSuccessProbability(context, recommendedActions);

    return {
      relationshipId,
      overallStability: context.stability,
      recommendedActions,
      riskFactors,
      successProbability,
      timeline: this.stabilizationHistory.get(relationshipId) || []
    };
  }

  /**
   * Apply stabilization action
   */
  async applyAction(
    relationshipId: string,
    action: StabilizationAction
  ): Promise<boolean> {
    const context = this.contexts.get(relationshipId);
    if (!context) return false;

    // Record the stabilization attempt
    const event: StabilizationEvent = {
      timestamp: new Date(),
      event: `Applied ${action.type} action`,
      impact: 0, // Will be updated based on outcome
      notes: action.message
    };

    const history = this.stabilizationHistory.get(relationshipId) || [];
    history.push(event);
    this.stabilizationHistory.set(relationshipId, history);

    // Simulate action delay if specified
    if (action.delay) {
      await new Promise(resolve => setTimeout(resolve, action.delay * 1000));
    }

    // Update context based on action
    if (action.type === 'dialect-translation' && action.targetDialect) {
      context.dialect = action.targetDialect;
      event.impact = 0.2; // Positive impact for dialect change
    }

    return true;
  }

  /**
   * Get relationship health metrics
   */
  getHealthMetrics(relationshipId: string): {
    stability: number;
    impedance: number;
    communicationFrequency: number;
    conflictRate: number;
    lastInteractionHours: number;
  } | null {
    const context = this.contexts.get(relationshipId);
    if (!context) return null;

    const now = new Date();
    const lastInteractionHours = (now.getTime() - context.lastInteraction.getTime()) / (1000 * 60 * 60);

    // Calculate communication frequency (interactions per day)
    const recentInteractions = context.pattern.filter(p =>
      (now.getTime() - p.timestamp.getTime()) < (7 * 24 * 60 * 60 * 1000) // Last 7 days
    ).length;
    const communicationFrequency = recentInteractions / 7;

    // Calculate conflict rate
    const conflicts = context.pattern.filter(p => p.type === 'conflict').length;
    const totalInteractions = context.pattern.length;
    const conflictRate = totalInteractions > 0 ? conflicts / totalInteractions : 0;

    return {
      stability: context.stability,
      impedance: context.impedance,
      communicationFrequency,
      conflictRate,
      lastInteractionHours
    };
  }

  private initializeStrategies(): void {
    this.strategies = [
      {
        id: 'high-impedance-recovery',
        name: 'High Impedance Recovery',
        description: 'Recover from high impedance communication breakdown',
        conditions: [
          { metric: 'impedance', operator: '>', value: 0.8, duration: 60 }
        ],
        actions: [
          {
            type: 'dialect-translation',
            targetDialect: 'cosmetology',
            message: 'Switching to cosmetology dialect for better reception'
          },
          {
            type: 'safety-protocol',
            message: 'Initiating safety protocol - reducing communication frequency',
            delay: 300 // 5 minutes
          }
        ],
        expectedOutcome: 'Reduced impedance and improved communication reception'
      },

      {
        id: 'conflict-resolution',
        name: 'Conflict Resolution Protocol',
        description: 'Address conflict patterns before they destabilize',
        conditions: [
          { metric: 'conflict-rate', operator: '>', value: 0.3 },
          { metric: 'stability', operator: '<', value: 0.4 }
        ],
        actions: [
          {
            type: 'dialect-translation',
            targetDialect: 'astrology',
            message: 'Translating conflict to astrological framework'
          },
          {
            type: 'pattern-interruption',
            message: 'Interrupting conflict pattern with grounding exercise'
          }
        ],
        expectedOutcome: 'Conflict resolution and stability recovery'
      },

      {
        id: 'withdrawal-response',
        name: 'Withdrawal Response Protocol',
        description: 'Respond appropriately to withdrawal patterns',
        conditions: [
          { metric: 'communication-frequency', operator: '<', value: 0.5 },
          { metric: 'impedance', operator: '>', value: 0.7 }
        ],
        actions: [
          {
            type: 'impedance-matching',
            message: 'Matching withdrawal impedance - respecting space'
          },
          {
            type: 'safety-protocol',
            message: 'Maintaining connection signal without pressure',
            delay: 3600 // 1 hour
          }
        ],
        expectedOutcome: 'Maintained connection during withdrawal period'
      }
    ];
  }

  private updateStability(context: RelationalContext, latestPattern: InteractionPattern): void {
    // Stability is influenced by:
    // - Success rate of interactions
    // - Impedance levels (lower is better)
    // - Pattern consistency
    // - Time since last interaction

    const recentPatterns = context.pattern.slice(-10); // Last 10 interactions
    const successRate = recentPatterns.filter(p => p.success).length / recentPatterns.length;

    // Impedance factor (lower impedance = higher stability contribution)
    const impedanceFactor = 1 - context.impedance;

    // Pattern consistency (lower variance = higher stability)
    const avgImpedance = recentPatterns.reduce((sum, p) => sum + p.impedance, 0) / recentPatterns.length;
    const variance = recentPatterns.reduce((sum, p) => sum + Math.pow(p.impedance - avgImpedance, 2), 0) / recentPatterns.length;
    const consistencyFactor = Math.max(0, 1 - variance);

    // Time factor (more recent interactions = higher stability)
    const now = Date.now();
    const avgTimeDiff = recentPatterns.reduce((sum, p) => sum + (now - p.timestamp.getTime()), 0) / recentPatterns.length;
    const timeFactor = Math.max(0, 1 - (avgTimeDiff / (24 * 60 * 60 * 1000))); // Normalize to 24 hours

    // Weighted combination
    context.stability = (
      successRate * 0.4 +
      impedanceFactor * 0.3 +
      consistencyFactor * 0.2 +
      timeFactor * 0.1
    );

    // Ensure bounds
    context.stability = Math.max(0, Math.min(1, context.stability));
  }

  private determineActions(context: RelationalContext): StabilizationAction[] {
    const actions: StabilizationAction[] = [];

    for (const strategy of this.strategies) {
      if (this.meetsConditions(context, strategy.conditions)) {
        actions.push(...strategy.actions);
      }
    }

    return actions;
  }

  private meetsConditions(context: RelationalContext, conditions: StabilizationCondition[]): boolean {
    for (const condition of conditions) {
      const value = this.getMetricValue(context, condition.metric);

      let meets = false;
      switch (condition.operator) {
        case '>': meets = value > condition.value; break;
        case '<': meets = value < condition.value; break;
        case '=': meets = value === condition.value; break;
        case '>=': meets = value >= condition.value; break;
        case '<=': meets = value <= condition.value; break;
      }

      if (!meets) return false;
    }

    return true;
  }

  private getMetricValue(context: RelationalContext, metric: string): number {
    switch (metric) {
      case 'impedance': return context.impedance;
      case 'stability': return context.stability;
      case 'communication-frequency': {
        const now = new Date();
        const recent = context.pattern.filter(p =>
          (now.getTime() - p.timestamp.getTime()) < (24 * 60 * 60 * 1000)
        ).length;
        return recent / 24; // Per hour
      }
      case 'conflict-rate': {
        const conflicts = context.pattern.filter(p => p.type === 'conflict').length;
        return context.pattern.length > 0 ? conflicts / context.pattern.length : 0;
      }
      default: return 0;
    }
  }

  private identifyRisks(context: RelationalContext): string[] {
    const risks: string[] = [];

    if (context.impedance > 0.8) {
      risks.push('High impedance: Communication reception severely compromised');
    }

    if (context.stability < 0.3) {
      risks.push('Low stability: Relationship at risk of breakdown');
    }

    const recentConflicts = context.pattern
      .slice(-5)
      .filter(p => p.type === 'conflict').length;

    if (recentConflicts >= 3) {
      risks.push('High conflict frequency: Pattern escalation detected');
    }

    const hoursSinceLastInteraction = (Date.now() - context.lastInteraction.getTime()) / (1000 * 60 * 60);
    if (hoursSinceLastInteraction > 72) {
      risks.push('Extended silence: Connection signal weakening');
    }

    return risks;
  }

  private calculateSuccessProbability(
    context: RelationalContext,
    actions: StabilizationAction[]
  ): number {
    let probability = 0.5; // Base probability

    // Stability contributes positively
    probability += context.stability * 0.2;

    // Each action increases probability
    probability += Math.min(actions.length * 0.1, 0.3);

    // Recent success history
    const recentSuccess = context.pattern
      .slice(-5)
      .filter(p => p.success).length / 5;

    probability += recentSuccess * 0.2;

    return Math.min(probability, 1.0);
  }
}