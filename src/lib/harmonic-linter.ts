/**
 * HARMONIC LINTER
 * Enforces the 0.35 Attractor and Neuro-Metabolic Budgeting
 * 
 * This is the "Legislative Branch" of the Governance-as-Code system.
 * It checks for "Metaphysical Errors" beyond syntax.
 */

import type {
  HarmonicLinterReport,
  LinterViolation,
  HarmonicMetrics,
  SpoonCostEntry,
} from '../types/module.types';

// Spoon cost taxonomy (from spec)
const SPOON_COST_MAP: Record<string, number> = {
  sendText: 1,
  sendAudio: 2,
  startVideoCall: 4,
  pollNetwork: 10, // High penalty for polling
  setInterval: 5, // Polling pattern
  setTimeout: 1, // Single delayed action
  fetch: 2, // Network request
  addEventListener: 1, // Event handler
  useSpoonBudget: 0, // Reading is free
  triggerVagusSignal: 0.5, // Somatic grounding
};

// Loop multiplier (entropy amplification)
const LOOP_MULTIPLIER = 5;

// Target resonance (Mark 1 Constant)
const TARGET_RESONANCE = 0.35;
const RESONANCE_TOLERANCE = 0.05;

/**
 * Analyze a module's source code for harmonic compliance
 */
export async function analyzeModule(code: string): Promise<HarmonicLinterReport> {
  const violations: LinterViolation[] = [];
  const spoonMap: SpoonCostEntry[] = [];

  // 1. Neuro-Metabolic Audit (Spoon Cost)
  const spoonCost = calculateSpoonCost(code, spoonMap, violations);

  // 2. Harmonic Resonance Calculation
  const metrics = calculateHarmonicMetrics(code);
  const resonanceScore = calculateResonance(metrics);

  // Check resonance against target
  const resonanceDeviation = Math.abs(resonanceScore - TARGET_RESONANCE);
  if (resonanceDeviation > RESONANCE_TOLERANCE) {
    if (resonanceScore > TARGET_RESONANCE + RESONANCE_TOLERANCE) {
      violations.push({
        severity: 'warning',
        category: 'resonance',
        message: `Harmonic Dissonance: Stasis Detected (H = ${resonanceScore.toFixed(3)}). Code is too rigid or over-engineered.`,
        suggestion: 'Inject Freedom: Use dynamic types, adaptive logic, or reduce boilerplate.',
      });
    } else if (resonanceScore < TARGET_RESONANCE - RESONANCE_TOLERANCE) {
      violations.push({
        severity: 'warning',
        category: 'resonance',
        message: `Harmonic Dissonance: Entropy Detected (H = ${resonanceScore.toFixed(3)}). Code is unstructured or unpredictable.`,
        suggestion: 'Inject Order: Refactor into smaller components, add strict typing, or reduce complexity.',
      });
    }
  }

  // 3. Topology Check (Floating Neutral Defense)
  if (detectsCentralServer(code)) {
    violations.push({
      severity: 'error',
      category: 'topology',
      message: 'Critical Error: Wye Topology Detected. Module depends on a centralized server.',
      suggestion: 'Use Mesh Resolution: Replace with useMeshQuery() or peer-to-peer patterns.',
    });
  }

  // 4. Voltage Clamping Check
  const voltageViolations = detectHighVoltageTriggers(code);
  violations.push(...voltageViolations);

  // 5. Security Check (Capability Leakage)
  const securityViolations = detectCapabilityLeakage(code);
  violations.push(...securityViolations);

  const isStable = violations.filter((v) => v.severity === 'error').length === 0;

  return {
    spoonCost,
    resonanceScore,
    isStable,
    violations,
    metrics,
    timestamp: Date.now(),
  };
}

/**
 * Calculate spoon cost by analyzing function calls and patterns
 */
function calculateSpoonCost(
  code: string,
  spoonMap: SpoonCostEntry[],
  violations: LinterViolation[]
): number {
  let totalCost = 0;
  const lines = code.split('\n');

  // Detect loops (for, while, map, forEach, etc.)
  const loopPatterns = [
    /for\s*\(/g,
    /while\s*\(/g,
    /\.map\s*\(/g,
    /\.forEach\s*\(/g,
    /\.filter\s*\(/g,
    /\.reduce\s*\(/g,
  ];

  let inLoop = false;
  let loopDepth = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // Detect loop start
    for (const pattern of loopPatterns) {
      if (pattern.test(line)) {
        inLoop = true;
        loopDepth++;
        break;
      }
    }

    // Detect loop end (simplified: closing brace)
    if (inLoop && line.trim() === '}') {
      loopDepth--;
      if (loopDepth === 0) {
        inLoop = false;
      }
    }

    // Check for spoon-cost functions
    for (const [funcName, baseCost] of Object.entries(SPOON_COST_MAP)) {
      const regex = new RegExp(`\\b${funcName}\\s*\\(`, 'g');
      if (regex.test(line)) {
        const cost = inLoop ? baseCost * LOOP_MULTIPLIER : baseCost;
        totalCost += cost;

        spoonMap.push({
          functionName: funcName,
          cost,
          context: inLoop ? `in loop (line ${lineNum})` : `line ${lineNum}`,
        });

        // Warn if high-cost function in loop
        if (inLoop && baseCost >= 2) {
          violations.push({
            severity: 'warning',
            category: 'spoon',
            message: `High spoon cost in loop: ${funcName} (${cost} spoons)`,
            line: lineNum,
            suggestion: 'Consider debouncing, caching, or moving outside the loop.',
          });
        }
      }
    }
  }

  // Check for polling patterns (setInterval without cleanup)
  if (/setInterval\s*\(/.test(code) && !/clearInterval/.test(code)) {
    violations.push({
      severity: 'error',
      category: 'spoon',
      message: 'Spoon Vampire Detected: setInterval without cleanup will drain resources.',
      suggestion: 'Always store interval ID and clear it in cleanup/useEffect return.',
    });
    totalCost += 50; // Severe penalty
  }

  return totalCost;
}

/**
 * Calculate Halstead Volume and Shannon Entropy
 */
function calculateHarmonicMetrics(code: string): HarmonicMetrics {
  // Simplified Halstead Volume calculation
  // In production, use a proper AST parser like @typescript-eslint/parser

  // Count operators (+, -, *, /, =, ==, ===, &&, ||, etc.)
  const operatorPattern = /[+\-*/=<>!&|?:;{}[\](),.]/g;
  const operators = code.match(operatorPattern) || [];
  const uniqueOperators = new Set(operators);

  // Count operands (identifiers, literals)
  const identifierPattern = /\b[a-zA-Z_$][a-zA-Z0-9_$]*\b/g;
  const identifiers = code.match(identifierPattern) || [];
  const uniqueIdentifiers = new Set(identifiers);

  // Halstead Volume = (N1 + N2) * log2(n1 + n2)
  // Where N1 = total operators, N2 = total operands
  // n1 = unique operators, n2 = unique operands
  const N1 = operators.length;
  const N2 = identifiers.length;
  const n1 = uniqueOperators.size;
  const n2 = uniqueIdentifiers.size;

  const halsteadVolume = (N1 + N2) * Math.log2(n1 + n2 || 1);

  // Shannon Entropy (simplified: based on character distribution)
  const charFreq: Record<string, number> = {};
  for (const char of code) {
    charFreq[char] = (charFreq[char] || 0) + 1;
  }

  let shannonEntropy = 0;
  const totalChars = code.length;
  for (const freq of Object.values(charFreq)) {
    const probability = freq / totalChars;
    if (probability > 0) {
      shannonEntropy -= probability * Math.log2(probability);
    }
  }

  // Cyclomatic Complexity (simplified: count decision points)
  const decisionPatterns = [
    /\bif\s*\(/g,
    /\belse\s*if\s*\(/g,
    /\bswitch\s*\(/g,
    /\bcase\s+/g,
    /\bwhile\s*\(/g,
    /\bfor\s*\(/g,
    /\?\s*.*\s*:/g, // Ternary
    /\|\|/g, // Logical OR
    /&&/g, // Logical AND
  ];

  let cyclomaticComplexity = 1; // Base complexity
  for (const pattern of decisionPatterns) {
    const matches = code.match(pattern);
    if (matches) {
      cyclomaticComplexity += matches.length;
    }
  }

  return {
    halsteadVolume,
    shannonEntropy,
    cyclomaticComplexity,
    spoonMap: [],
  };
}

/**
 * Calculate Harmonic Resonance: H = Order / (Order + Entropy)
 */
function calculateResonance(metrics: HarmonicMetrics): number {
  // Normalize Halstead Volume to compatible scale
  const order = metrics.halsteadVolume / 1000; // Normalize to ~0-1 range
  const entropy = metrics.shannonEntropy / 10; // Normalize to ~0-1 range

  const totalSystemEnergy = order + entropy;
  if (totalSystemEnergy === 0) return 0;

  const resonance = order / totalSystemEnergy;

  // Clamp to [0, 1]
  return Math.max(0, Math.min(1, resonance));
}

/**
 * Detect centralized server dependencies (Wye Topology)
 */
function detectsCentralServer(code: string): boolean {
  // Patterns that indicate centralized dependency
  const wyePatterns = [
    /fetch\s*\(\s*['"](https?:\/\/[^'"]+)['"]/g, // External HTTP(S) URLs
    /axios\s*\.(get|post|put|delete)/g, // Axios calls
    /\.get\s*\(\s*['"](https?:\/\/[^'"]+)['"]/g, // jQuery-style
    /new\s+WebSocket\s*\(\s*['"](wss?:\/\/[^'"]+)['"]/g, // External WebSocket
  ];

  // Allow localhost and mesh patterns
  const allowedPatterns = [
    /localhost/,
    /127\.0\.0\.1/,
    /useMeshQuery/,
    /mesh\./,
    /peer\./,
  ];

  for (const pattern of wyePatterns) {
    const matches = code.match(pattern);
    if (matches) {
      // Check if any match is NOT in allowed patterns
      const hasForbidden = matches.some((match) => {
        return !allowedPatterns.some((allowed) => allowed.test(match));
      });

      if (hasForbidden) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Detect high-voltage triggers in string literals and UI text
 */
function detectHighVoltageTriggers(code: string): LinterViolation[] {
  const violations: LinterViolation[] = [];

  // High-voltage words (from spec)
  const voltageTriggers = [
    'rage',
    'loathing',
    'hate',
    'kill',
    'destroy',
    'stupid',
    'idiot',
    'worthless',
  ];

  const stringLiteralPattern = /(['"`])((?:\\.|(?!\1)[^\\])*)\1/g;
  let match;

  while ((match = stringLiteralPattern.exec(code)) !== null) {
    const content = match[2];
    const lineNum = code.substring(0, match.index).split('\n').length;

    for (const trigger of voltageTriggers) {
      if (content.toLowerCase().includes(trigger)) {
        violations.push({
          severity: 'warning',
          category: 'voltage',
          message: `High-voltage trigger detected: "${trigger}" in string literal`,
          line: lineNum,
          suggestion: 'Filter through Universal Translation Layer. Use Shield processing for user-facing text.',
        });
      }
    }
  }

  return violations;
}

/**
 * Detect capability leakage (security violations)
 */
function detectCapabilityLeakage(code: string): LinterViolation[] {
  const violations: LinterViolation[] = [];

  // Dangerous patterns that could leak capabilities
  const dangerousPatterns = [
    {
      pattern: /eval\s*\(/g,
      message: 'eval() detected: Code injection risk',
      suggestion: 'Never use eval(). Use structured data parsing instead.',
    },
    {
      pattern: /Function\s*\(/g,
      message: 'Function constructor detected: Code injection risk',
      suggestion: 'Use arrow functions or function declarations instead.',
    },
    {
      pattern: /innerHTML\s*=/g,
      message: 'innerHTML assignment detected: XSS risk',
      suggestion: 'Use React or textContent for safe rendering.',
    },
    {
      pattern: /document\.cookie\s*=/g,
      message: 'Direct cookie manipulation detected: Security risk',
      suggestion: 'Use secure cookie APIs or state management.',
    },
  ];

  for (const { pattern, message, suggestion } of dangerousPatterns) {
    if (pattern.test(code)) {
      const lineNum = code.split('\n').findIndex((line) => pattern.test(line)) + 1;
      violations.push({
        severity: 'error',
        category: 'security',
        message,
        line: lineNum,
        suggestion,
      });
    }
  }

  return violations;
}


