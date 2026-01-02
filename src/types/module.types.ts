/**
 * MODULE MAKER TYPES
 * Types for the Genesis Gate Module Maker (Autopoietic Extension System)
 */

export interface GeodesicModule {
  readonly id: string; // UUID
  readonly name: string; // Human-readable name
  readonly description: string;
  readonly version: string; // Semantic version
  readonly author: string; // User's peer ID or ENS name
  readonly cid?: string; // IPFS Content Identifier
  readonly ensName?: string; // e.g., "module-name.god-dao.eth"
  readonly sourceCode: string; // TypeScript/TSX source
  readonly bundle?: string; // Compiled WASM/JS bundle
  readonly manifest: ModuleManifest;
  readonly linterReport: HarmonicLinterReport;
  readonly createdAt: number;
  readonly updatedAt: number;
  readonly isInstalled: boolean;
  readonly isEnabled: boolean;
  readonly abdicated: boolean; // Creator has destroyed update keys
}

export interface ModuleManifest {
  readonly entryPoint: string; // e.g., "Module.tsx"
  readonly dependencies: readonly string[]; // npm packages
  readonly hooks: readonly string[]; // Genesis hooks used (e.g., "useSpoonBudget")
  readonly permissions: readonly ModulePermission[]; // Capabilities requested
  readonly topology: 'delta' | 'wye'; // Must be 'delta' for approval
  readonly resonanceTarget: number; // Target H value (default 0.35)
}

export type ModulePermission =
  | 'read:heartbeat'
  | 'read:shield'
  | 'write:shield'
  | 'read:checkin'
  | 'haptic:trigger'
  | 'mesh:query'
  | 'mesh:broadcast';

export interface HarmonicLinterReport {
  readonly spoonCost: number; // Estimated daily spoon consumption
  readonly resonanceScore: number; // H value (0-1)
  readonly isStable: boolean; // Passes all checks
  readonly violations: readonly LinterViolation[];
  readonly metrics: HarmonicMetrics;
  readonly timestamp: number;
}

export interface LinterViolation {
  readonly severity: 'error' | 'warning' | 'info';
  readonly category: 'spoon' | 'resonance' | 'topology' | 'voltage' | 'security';
  readonly message: string;
  readonly line?: number;
  readonly column?: number;
  readonly suggestion?: string;
}

export interface HarmonicMetrics {
  readonly halsteadVolume: number; // Information Volume (Order)
  readonly shannonEntropy: number; // Information Entropy (Chaos)
  readonly cyclomaticComplexity: number; // Logic branching
  readonly spoonMap: readonly SpoonCostEntry[];
}

export interface SpoonCostEntry {
  readonly functionName: string;
  readonly cost: number;
  readonly context: string; // e.g., "in loop", "async"
}

export interface VibeCoderRequest {
  readonly intent: string; // User's natural language request
  readonly context: VibeCoderContext;
  readonly constraints?: VibeCoderConstraints;
}

export interface VibeCoderContext {
  readonly userSpoons: number; // Current spoon budget
  readonly userHumanOS: string; // User's HumanOS type
  readonly socialTomography?: string; // Conflict history, relationships
  readonly existingModules: readonly string[]; // IDs of installed modules
  readonly dailyCheckInPercentage?: number; // Current status
}

export interface VibeCoderConstraints {
  readonly maxSpoonCost?: number;
  readonly minResonance?: number;
  readonly maxResonance?: number;
  readonly requiredPermissions?: readonly ModulePermission[];
  readonly forbiddenPatterns?: readonly string[]; // e.g., "setInterval", "fetch('http://"
}

export interface VibeCoderResponse {
  readonly code: string; // Generated TypeScript/TSX
  readonly explanation: string; // Why this code was generated
  readonly resonanceScore: number; // Predicted H value
  readonly spoonCost: number; // Predicted spoon cost
  readonly linterReport: HarmonicLinterReport;
  readonly artifacts: readonly CodeArtifact[];
}

export interface CodeArtifact {
  readonly filename: string;
  readonly content: string;
  readonly type: 'component' | 'hook' | 'util' | 'type' | 'config';
}

export interface ModuleStore {
  readonly installedModules: readonly GeodesicModule[];
  readonly enabledModuleIds: readonly string[];
  readonly activeModuleContext: ModuleExecutionContext | null;
}

export interface ModuleExecutionContext {
  readonly moduleId: string;
  readonly iframeId: string; // Sandboxed iframe for UI
  readonly wasmInstance?: WebAssembly.Instance; // WASM sandbox for logic
  readonly messageChannel: MessageChannel; // postMessage bridge
}

export type ModuleMakerPhase =
  | 'idle'
  | 'vibe-input' // User entering intent
  | 'context-engineering' // Vacuum phase
  | 'generation' // Pressure phase (ReAct loop)
  | 'linting' // Impregnation phase
  | 'review' // User reviewing generated code
  | 'deployment' // Building and deploying
  | 'complete';


