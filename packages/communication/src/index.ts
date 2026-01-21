// Communication Exports
export { VPIProtocol } from './vpi/protocol';
export type {
  VPIConfig,
  DialectDefinition,
  CommunicationPattern,
  VPIAnalysis,
  ImpedanceMatch
} from './vpi/protocol';

export { TranslationEngine } from './translator/engine';
export type { TranslationRequest, TranslationResult } from './translator/engine';

export { DialectManager } from './dialects/manager';
export type { DialectEvolution, DialectMetrics } from './dialects/manager';

export { RelationalStabilizer } from './stabilizer/relational';
export type {
  RelationalContext,
  StabilizationStrategy,
  StabilizationReport
} from './stabilizer/relational';