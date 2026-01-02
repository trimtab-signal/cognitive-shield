/**
 * VIBE CODER
 * The Digital Centaur Agent for translating natural language intent
 * into harmonically resonant code.
 * 
 * Implements the ReAct pattern: Think → Act → Observe
 */

import type {
  VibeCoderRequest,
  VibeCoderResponse,
  VibeCoderContext,
  CodeArtifact,
} from '../types/module.types';
import { analyzeModule } from './harmonic-linter';
import GOD_CONFIG from '../god.config';
import useShieldStore from '../store/shield.store';
import useHeartbeatStore from '../store/heartbeat.store';

/**
 * Generate code from user intent using LLM
 */
export async function generateModuleFromVibe(
  request: VibeCoderRequest
): Promise<VibeCoderResponse> {
  const { intent, context, constraints } = request;

  // Phase 1: Context Engineering (The Vacuum)
  const hyperPrompt = buildHyperPrompt(intent, context, constraints);

  // Phase 2: Structural Generation (The Pressure - ReAct Loop)
  const generatedCode = await executeReActLoop(hyperPrompt, intent, context, constraints);

  // Phase 3: Harmonic Linting (The Impregnation)
  const linterReport = await analyzeModule(generatedCode.code);

  // Refine if needed (iterative improvement)
  let finalCode = generatedCode.code;
  if (!linterReport.isStable) {
    finalCode = await refineCode(finalCode, linterReport, context);
    // Re-lint after refinement
    const refinedReport = await analyzeModule(finalCode);
    return {
      code: finalCode,
      explanation: generatedCode.explanation,
      resonanceScore: refinedReport.resonanceScore,
      spoonCost: refinedReport.spoonCost,
      linterReport: refinedReport,
      artifacts: generatedCode.artifacts,
    };
  }

  return {
    code: finalCode,
    explanation: generatedCode.explanation,
    resonanceScore: linterReport.resonanceScore,
    spoonCost: linterReport.spoonCost,
    linterReport,
    artifacts: generatedCode.artifacts,
  };
}

/**
 * Build the hyper-prompt with context injection
 */
function buildHyperPrompt(
  intent: string,
  context: VibeCoderContext,
  constraints?: VibeCoderConstraints
): string {
  const shieldStore = useShieldStore.getState();
  const heartbeatStore = useHeartbeatStore.getState();
  const todayCheckIn = heartbeatStore.getTodayCheckIn();

  const socialTomography = context.socialTomography || 'No conflict history recorded.';
  const spoonBudget = context.userSpoons || 12;
  const statusPercentage = context.dailyCheckInPercentage || todayCheckIn?.percentage || 100;

  return `YOU ARE THE "VIBE CODER," A DIGITAL CENTAUR AGENT FOR THE GENESIS GATE.

Context:
USER_SPOONS: ${spoonBudget} / 12
USER_HUMANOS: ${context.userHumanOS || 'unknown'}
STATUS_PERCENTAGE: ${statusPercentage}%
SOCIAL_TOMOGRAPHY: ${socialTomography}
EXISTING_MODULES: ${context.existingModules?.join(', ') || 'none'}

Constraints:
${constraints ? JSON.stringify(constraints, null, 2) : 'None specified'}

Instructions:
1. THOUGHT: Analyze the user's "Vibe" (intent). Does it require Order (stability, structure) or Freedom (adaptability, flexibility)? Map this to the 0.35 Harmonic Attractor.

2. ACT: Generate TypeScript/React code using Genesis-Native patterns:
   - Use hooks: useSpoonBudget(), useHarmonicResonance(), useMeshQuery()
   - Do NOT use hardcoded external APIs. Use useMeshQuery() for data.
   - If user spoons < 3, ensure default state is "Quiet Mode" (low stimulation).
   - Follow Delta Topology: No centralized servers. Use peer-to-peer patterns.
   - Implement "No-Raw-Text Protocol": All user-facing text must be filtered through the Universal Translation Layer.

3. OBSERVE: The code must pass the Harmonic Linter:
   - Resonance Score (H) should be ≈ 0.35 (Order / (Order + Entropy))
   - Spoon Cost should be reasonable (< 10 for typical modules)
   - No Wye Topology patterns (centralized servers)
   - No high-voltage triggers in string literals

4. OUTPUT: Provide the complete TypeScript/TSX code with:
   - Proper imports from Genesis libraries
   - Type safety
   - Error handling
   - Comments explaining the harmonic alignment

User Intent:
"${intent}"

Generate the module code now.`;
}

/**
 * Execute the ReAct loop: Think → Act → Observe → Refine
 */
async function executeReActLoop(
  prompt: string,
  intent: string,
  context: VibeCoderContext,
  constraints?: VibeCoderConstraints
): Promise<{ code: string; explanation: string; artifacts: CodeArtifact[] }> {
  const shieldStore = useShieldStore.getState();
  const { provider, ollamaEndpoint, ollamaModel } = shieldStore;

  // Use Ollama if available, otherwise fallback to local generation
  if (provider === 'ollama' && ollamaEndpoint) {
    try {
      const response = await fetch(`${ollamaEndpoint}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: ollamaModel || 'llama3.2',
          prompt,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const generatedText = data.response || '';

        // Parse the LLM response (expecting code block)
        const codeMatch = generatedText.match(/```(?:tsx?|typescript|javascript|jsx)?\n([\s\S]*?)```/);
        const code = codeMatch ? codeMatch[1] : generatedText;

        // Extract explanation (text before code block)
        const explanation = generatedText.split('```')[0].trim() || 'Code generated via Vibe Coding.';

        // Parse artifacts (if multiple files)
        const artifacts = parseArtifacts(generatedText);

        return { code, explanation, artifacts };
      }
    } catch (error) {
      // Silently fall back to template generator if Ollama is unavailable
      // This is expected behavior when Ollama isn't running
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        // Expected: Ollama not running, use fallback
      } else {
        console.warn('Ollama generation failed, using fallback:', error);
      }
    }
  }

  // Fallback: Generate a template based on intent
  return generateTemplateModule(intent, context, constraints);
}

/**
 * Generate a template module when LLM is unavailable
 */
function generateTemplateModule(
  intent: string,
  context: VibeCoderContext,
  constraints?: VibeCoderConstraints
): { code: string; explanation: string; artifacts: CodeArtifact[] } {
  // Simple template generator for common patterns
  const moduleName = extractModuleName(intent);
  const hasSpoonCheck = context.userSpoons !== undefined && context.userSpoons < 5;

  const code = `/**
 * ${moduleName}
 * Generated via Vibe Coding
 * Intent: "${intent}"
 */

import React, { useState, useEffect } from 'react';
import { useSpoonBudget } from '@genesis/hooks';
import GOD_CONFIG from '@/god.config';

export function ${moduleName}() {
  const { currentSpoons, canAfford } = useSpoonBudget();
  const [isQuietMode, setIsQuietMode] = useState(${hasSpoonCheck ? 'true' : 'false'});

  useEffect(() => {
    // Auto-enable quiet mode if spoons are low
    if (currentSpoons < 3) {
      setIsQuietMode(true);
    }
  }, [currentSpoons]);

  if (isQuietMode && currentSpoons < 3) {
    return (
      <div style={{
        padding: 20,
        backgroundColor: GOD_CONFIG.theme.bg.secondary,
        borderRadius: 12,
        color: GOD_CONFIG.theme.text.muted,
        textAlign: 'center',
      }}>
        Quiet Mode Active
      </div>
    );
  }

  return (
    <div style={{
      padding: 20,
      backgroundColor: GOD_CONFIG.theme.bg.primary,
      borderRadius: 12,
    }}>
      <h3>${moduleName}</h3>
      <p>Module implementation for: "${intent}"</p>
      <p>Current Spoons: {currentSpoons}</p>
    </div>
  );
}

export default ${moduleName};
`;

  return {
    code,
    explanation: `Template module generated for "${intent}". This is a basic scaffold. Refine using the Trim Tab interface.`,
    artifacts: [
      {
        filename: `${moduleName}.tsx`,
        content: code,
        type: 'component',
      },
    ],
  };
}

/**
 * Extract a module name from intent
 */
function extractModuleName(intent: string): string {
  // Simple extraction: capitalize first letter of each word, remove spaces
  const words = intent
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .slice(0, 3); // Max 3 words

  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}

/**
 * Parse multiple code artifacts from LLM response
 */
function parseArtifacts(response: string): CodeArtifact[] {
  const artifacts: CodeArtifact[] = [];
  const codeBlockRegex = /```(?:tsx?|typescript|javascript|jsx)?\n([\s\S]*?)```/g;

  let match;
  let index = 0;
  while ((match = codeBlockRegex.exec(response)) !== null) {
    const content = match[1];
    const filename = `Module${index > 0 ? index : ''}.tsx`;
    artifacts.push({
      filename,
      content,
      type: index === 0 ? 'component' : 'util',
    });
    index++;
  }

  return artifacts.length > 0 ? artifacts : [];
}

/**
 * Refine code based on linter violations
 */
async function refineCode(
  code: string,
  linterReport: any,
  context: VibeCoderContext
): Promise<string> {
  // Simple refinement: fix common issues
  let refined = code;

  // Fix resonance issues
  const resonanceViolations = linterReport.violations.filter(
    (v: any) => v.category === 'resonance'
  );

  for (const violation of resonanceViolations) {
    if (violation.message.includes('Stasis')) {
      // Too rigid: add dynamic logic
      refined = addDynamicLogic(refined);
    } else if (violation.message.includes('Entropy')) {
      // Too chaotic: add structure
      refined = addStructure(refined);
    }
  }

  // Fix topology violations
  const topologyViolations = linterReport.violations.filter(
    (v: any) => v.category === 'topology'
  );

  for (const violation of topologyViolations) {
    if (violation.message.includes('Wye Topology')) {
      // Replace fetch with useMeshQuery
      refined = refined.replace(/fetch\s*\([^)]+\)/g, 'useMeshQuery()');
    }
  }

  return refined;
}

function addDynamicLogic(code: string): string {
  // Add adaptive patterns
  return code.replace(
    /const\s+(\w+)\s*=\s*['"]([^'"]+)['"]/g,
    "const $1 = useMemo(() => '$2', [dependencies])"
  );
}

function addStructure(code: string): string {
  // Add type safety and structure
  if (!code.includes('interface') && !code.includes('type')) {
    return `// Type definitions\ninterface ModuleProps {\n  // Add props here\n}\n\n${code}`;
  }
  return code;
}

