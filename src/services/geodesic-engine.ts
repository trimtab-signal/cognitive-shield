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
 * Geodesic Engine (Node D)
 * AI-powered message analysis via local Ollama
 * 
 * Performs:
 * - Voltage assessment (emotional intensity)
 * - HumanOS detection (sender's cognitive profile)
 * - Safe summary generation (stripping emotional voltage)
 * - Fact extraction
 * - Action item identification
 */

import type { 
  RawMessage, 
  ProcessedMessage, 
  VoltageAssessment, 
  OllamaRequest,
  OllamaResponse,
  TranslationRequest,
  TranslatedMessage,
} from '../types';
import { AIConfig, HumanOSProfiles, MetabolismConfig, type HumanOSType, type DomainType, DomainConfig, type EvidenceLevel, EvidenceConfig } from '../config/god.config';

// ═══════════════════════════════════════════════════════════════════════════════
// AI API CLIENT (MULTI-PROVIDER)
// ═══════════════════════════════════════════════════════════════════════════════

async function callAI(request: OllamaRequest): Promise<string> {
  const provider = localStorage.getItem('AI_PROVIDER') || 'ollama';
  const apiKey = localStorage.getItem('AI_API_KEY') || '';

  if (provider === 'openai') {
    return callOpenAI(request, apiKey);
  } else if (provider === 'gemini') {
    return callGemini(request, apiKey);
  } else {
    return callOllama(request);
  }
}

async function callOllama(request: OllamaRequest): Promise<string> {
  const endpoint = localStorage.getItem('OLLAMA_URL') || AIConfig.endpoint;
  const response = await fetch(`${endpoint}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: request.model || AIConfig.defaultModel,
      prompt: request.prompt,
      system: request.system,
      stream: false,
      options: {
        temperature: request.options?.temperature ?? AIConfig.analysisTemperature,
        num_predict: request.options?.num_predict ?? AIConfig.maxTokens,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
  }

  const data: OllamaResponse = await response.json();
  return data.response;
}

async function callOpenAI(request: OllamaRequest, apiKey: string): Promise<string> {
  if (!apiKey) throw new Error('OpenAI API Key missing');

  const messages = [];
  if (request.system) messages.push({ role: 'system', content: request.system });
  messages.push({ role: 'user', content: request.prompt });

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o', // Default to a capable model
      messages,
      temperature: request.options?.temperature ?? 0.7,
      max_tokens: request.options?.num_predict ?? 1024,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${err}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function callGemini(request: OllamaRequest, apiKey: string): Promise<string> {
  if (!apiKey) throw new Error('Gemini API Key missing');

  // Simple prompt construction for Gemini 1.5/Pro
  const contents = [];
  if (request.system) contents.push({ role: 'user', parts: [{ text: `SYSTEM INSTRUCTION: ${request.system}` }] });
  contents.push({ role: 'user', parts: [{ text: request.prompt }] });

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature: request.options?.temperature ?? 0.7,
        maxOutputTokens: request.options?.num_predict ?? 1024,
      }
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error: ${response.status} ${err}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SYSTEM PROMPTS
// ═══════════════════════════════════════════════════════════════════════════════

const VOLTAGE_SYSTEM_PROMPT = `You are a Cognitive Shield analyzer. Your role is to assess the emotional voltage of messages to protect neurodivergent operators from cognitive overload.

Analyze the message and rate each dimension 0-10:
- emotional: Overall emotional intensity
- urgency: Time pressure implied
- ambiguity: Unclear expectations or mixed messages
- accusatory: Blame, criticism, or attack language
- complexity: Cognitive load required to process

Also identify trigger words/phrases that could cause distress.

Respond in valid JSON only:
{
  "emotional": <0-10>,
  "urgency": <0-10>,
  "ambiguity": <0-10>,
  "accusatory": <0-10>,
  "complexity": <0-10>,
  "triggers": ["list", "of", "triggers"],
  "confidence": <0-1>
}`;

const HUMANOS_SYSTEM_PROMPT = `You are a HumanOS detector. Classify the sender's cognitive operating system based on their communication style.

The profiles are:
- guardian: Uses power/protection language, tribal loyalty, fear-based
- order: Uses rules/duty language, hierarchical, procedural
- achiever: Uses success/strategy language, results-oriented, efficient
- empath: Uses feelings/harmony language, consensus-seeking, inclusive
- integrator: Uses systems/flow language, pattern-thinking, functional

Respond with ONLY the profile name (lowercase): guardian, order, achiever, empath, or integrator`;

const DOMAIN_SYSTEM_PROMPT = `You are a Domain Classifier. Classify the content into one of the following knowledge domains:

- phenix: Quantum navigation, hardware, firmware, SIC-POVM, mesh networking
- fisher: Calcium cognition, quantum biology, Fisher-Escola, neuroscience
- legal: Court filings, custody, divorce, attorneys, deadlines
- personal: Family, kids, health, journals, household
- technical: Engineering, code, software, APIs, databases

If it fits none of these specific technical/legal/family buckets, classify as "unknown".

Respond with ONLY the domain ID (lowercase): phenix, fisher, legal, personal, technical, or unknown`;

const EVIDENCE_SYSTEM_PROMPT = `You are an Evidence Analyzer. Classify the scientific/factual strength of the content based on these levels:

- verified: Peer-reviewed, replicated, meta-analysis, proven
- supported: Published research, data shows, evidence suggests
- theoretical: Mathematically sound, model predicts, in principle
- speculative: Hypothesis, proposed, may, might, possibly
- unverified: No source found, pure assertion

Respond with ONLY the level ID (lowercase): verified, supported, theoretical, speculative, or unverified`;

const SUMMARY_SYSTEM_PROMPT = `You are a Cognitive Shield translator. Create a "safe summary" of the message that:
1. Strips emotional voltage and accusatory language
2. Presents only factual information neutrally
3. Uses calm, professional tone
4. Preserves the core message/request

Also extract:
- facts: List of objective facts stated
- actionItems: List of actions requested (if any)

Respond in valid JSON:
{
  "safeSummary": "neutral summary here",
  "facts": ["fact1", "fact2"],
  "actionItems": ["action1", "action2"]
}`;

const TRANSLATION_SYSTEM_PROMPT = `You are a HumanOS translator. Translate the operator's message for the target OS.

OS Translation Guidelines:
- guardian: Use power/protection language, be direct and strong
- order: Use formal/procedural language, reference rules and standards  
- achiever: Use efficient/results language, focus on outcomes
- empath: Use warm/inclusive language, acknowledge feelings
- integrator: Use systems/functional language, explain patterns

Maintain the core message while adapting tone and vocabulary.

Respond in valid JSON:
{
  "translated": "translated message here",
  "notes": ["translation note 1", "translation note 2"],
  "changes": [
    {"from": "original phrase", "to": "translated phrase", "reason": "why changed"}
  ]
}`;

// ═══════════════════════════════════════════════════════════════════════════════
// ANALYSIS FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Assess voltage of a message
 */
async function assessVoltage(content: string): Promise<VoltageAssessment> {
  try {
    const response = await callAI({
      model: AIConfig.defaultModel,
      system: VOLTAGE_SYSTEM_PROMPT,
      prompt: `Analyze this message:\n\n${content}`,
      options: { temperature: 0.2 },
    });

    // Parse JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from voltage analysis');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    // Calculate overall score
    const breakdown = {
      emotional: parsed.emotional || 0,
      urgency: parsed.urgency || 0,
      ambiguity: parsed.ambiguity || 0,
      accusatory: parsed.accusatory || 0,
      complexity: parsed.complexity || 0,
    };

    // Weighted average with accusatory having higher weight
    const score = Math.round(
      (breakdown.emotional * 0.2 +
        breakdown.urgency * 0.15 +
        breakdown.ambiguity * 0.15 +
        breakdown.accusatory * 0.3 +
        breakdown.complexity * 0.2) * 10
    ) / 10;

    return {
      score: Math.min(10, Math.max(0, score)),
      breakdown,
      triggers: parsed.triggers || [],
      confidence: parsed.confidence || 0.8,
    };
  } catch (error) {
    console.error('Voltage assessment failed:', error);
    // Return conservative fallback
    return {
      score: 5,
      breakdown: { emotional: 5, urgency: 5, ambiguity: 5, accusatory: 5, complexity: 5 },
      triggers: [],
      confidence: 0.3,
    };
  }
}

/**
 * Detect sender's HumanOS
 */
async function detectHumanOS(content: string): Promise<HumanOSType> {
  try {
    const response = await callAI({
      model: AIConfig.defaultModel,
      system: HUMANOS_SYSTEM_PROMPT,
      prompt: `Classify this sender:\n\n${content}`,
      options: { temperature: 0.1 },
    });

    const os = response.trim().toLowerCase() as HumanOSType;
    
    // Validate response
    if (os in HumanOSProfiles) {
      return os;
    }

    // Default to achiever if unclear
    return 'achiever';
  } catch (error) {
    console.error('HumanOS detection failed:', error);
    return 'achiever';
  }
}

/**
 * Detect content Domain
 */
async function detectDomain(content: string): Promise<DomainType> {
  try {
    const response = await callAI({
      model: AIConfig.defaultModel,
      system: DOMAIN_SYSTEM_PROMPT,
      prompt: `Classify this content:\n\n${content}`,
      options: { temperature: 0.1 },
    });

    const domain = response.trim().toLowerCase() as DomainType;
    
    // Validate response
    if (domain in DomainConfig) {
      return domain;
    }

    return 'unknown';
  } catch (error) {
    console.error('Domain detection failed:', error);
    return 'unknown';
  }
}

/**
 * Assess evidence level
 */
async function assessEvidence(content: string): Promise<EvidenceLevel> {
  try {
    const response = await callAI({
      model: AIConfig.defaultModel,
      system: EVIDENCE_SYSTEM_PROMPT,
      prompt: `Classify the evidence level of this content:\n\n${content}`,
      options: { temperature: 0.1 },
    });

    const level = response.trim().toLowerCase() as EvidenceLevel;
    
    if (level in EvidenceConfig) {
      return level;
    }

    return 'unverified';
  } catch (error) {
    console.error('Evidence assessment failed:', error);
    return 'unverified';
  }
}

/**
 * Generate safe summary and extract facts
 */
async function generateSafeSummary(content: string): Promise<{
  safeSummary: string;
  facts: string[];
  actionItems: string[];
}> {
  try {
    const response = await callAI({
      model: AIConfig.defaultModel,
      system: SUMMARY_SYSTEM_PROMPT,
      prompt: `Process this message:\n\n${content}`,
      options: { temperature: 0.3 },
    });

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from summary generation');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    return {
      safeSummary: parsed.safeSummary || 'Unable to generate summary.',
      facts: parsed.facts || [],
      actionItems: parsed.actionItems || [],
    };
  } catch (error) {
    console.error('Safe summary generation failed:', error);
    return {
      safeSummary: 'Message received. Unable to generate detailed summary.',
      facts: [],
      actionItems: [],
    };
  }
}

/**
 * Calculate spoon cost for engaging with message
 */
function calculateSpoonCost(voltage: VoltageAssessment): number {
  const { score, breakdown } = voltage;
  
  // Base cost from overall voltage
  let cost = score < 3 
    ? MetabolismConfig.costs.readLowVoltage
    : score < 7
      ? MetabolismConfig.costs.readMediumVoltage
      : MetabolismConfig.costs.readHighVoltage;
  
  // Add complexity penalty
  cost += (breakdown.complexity / 10) * MetabolismConfig.costs.decisionMaking;
  
  // Add conflict exposure if accusatory
  if (breakdown.accusatory > 5) {
    cost += MetabolismConfig.costs.conflictExposure * (breakdown.accusatory / 10);
  }

  return Math.round(cost * 10) / 10;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN ANALYSIS FUNCTION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Full message analysis through the Geodesic Engine
 */
export async function analyzeMessage(raw: RawMessage): Promise<ProcessedMessage> {
  // Run analyses in parallel for speed
  const [voltage, senderOS, domain, evidence, summaryData] = await Promise.all([
    assessVoltage(raw.content),
    detectHumanOS(raw.content),
    detectDomain(raw.content),
    assessEvidence(raw.content),
    generateSafeSummary(raw.content),
  ]);

  const spoonCost = calculateSpoonCost(voltage);

  return {
    id: raw.id,
    raw,
    voltage,
    senderOS,
    domain,
    evidence,
    pii: [],
    safeSummary: summaryData.safeSummary,
    facts: summaryData.facts,
    actionItems: summaryData.actionItems,
    spoonCost,
    processedAt: new Date(),
    rawViewed: false,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// TRANSLATION FUNCTION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Translate operator's message for target HumanOS
 */
export async function translateMessage(request: TranslationRequest): Promise<TranslatedMessage> {
  const targetProfile = HumanOSProfiles[request.targetOS];
  
  const prompt = `Target OS: ${request.targetOS} (${targetProfile.name})
Target keywords: ${targetProfile.keywords.join(', ')}
Tone: ${request.tone || 'neutral'}
${request.context ? `Context: ${request.context}` : ''}

Translate this message:
${request.rawInput}`;

  try {
    const response = await callAI({
      model: AIConfig.defaultModel,
      system: TRANSLATION_SYSTEM_PROMPT,
      prompt,
      options: { temperature: AIConfig.translationTemperature },
    });

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from translation');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    // Assess voltage of translated message
    const translatedVoltage = await assessVoltage(parsed.translated);

    return {
      original: request.rawInput,
      translated: parsed.translated,
      targetOS: request.targetOS,
      notes: parsed.notes || [],
      outputVoltage: translatedVoltage.score,
      changes: parsed.changes || [],
    };
  } catch (error) {
    console.error('Translation failed:', error);
    return {
      original: request.rawInput,
      translated: request.rawInput,
      targetOS: request.targetOS,
      notes: ['Translation failed - returning original'],
      outputVoltage: 5,
      changes: [],
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// HEALTH CHECK
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Check if Ollama is available
 */
export async function checkEngineHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${AIConfig.endpoint}/api/tags`);
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Get available models
 */
export async function getAvailableModels(): Promise<string[]> {
  try {
    const response = await fetch(`${AIConfig.endpoint}/api/tags`);
    if (!response.ok) return [];
    
    const data = await response.json();
    return data.models?.map((m: { name: string }) => m.name) || [];
  } catch {
    return [];
  }
}
