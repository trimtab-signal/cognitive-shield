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
 * GenSync Translation Matrix Types
 * Universal Translator for Human Operating Systems (HumanOS / vMEMEs)
 */

// The Five Human Operating Systems (Spiral Dynamics vMEMEs)
export type HumanOS = 'guardian' | 'order' | 'achiever' | 'empath' | 'integrator';

// The Four Tetrahedron Protocol Primitives
export type TetrahedronPrimitive = 'frequency' | 'paralleling' | 'binary' | 'tetrahedron';

// Translation entry mapping a primitive to a HumanOS
export interface GenSyncTranslation {
  primitive: TetrahedronPrimitive;
  humanOS: HumanOS;
  driver: string;       // The metaphor/label for this OS
  metaphor: string;     // How this OS conceptualizes the primitive
  explanation: string;  // Plain language explanation
  validation: string;   // Validation script for rapport
}

// Voltage classification for emotional intensity
export type VoltageLevel = 'low' | 'medium' | 'high' | 'critical';

// Message processing result
export interface ProcessedMessage {
  original: string;
  sanitized: string;
  voltageLevel: VoltageLevel;
  detectedOS: HumanOS;
  translations: GenSyncTranslation[];
  suggestedResponse: string;
  validationScript: string;
}

// VPI Process stages (Vacuum, Pressure, Impregnation)
export interface VPIResult {
  vacuum: {
    emotionalTriggers: string[];
    removed: string[];
    sanitized: string;
  };
  pressure: {
    constitutionCheck: boolean;
    boundaries: string[];
    physicsExtracted: string;
  };
  impregnation: {
    translatedMessage: string;
    actionRequired: string | null;
    responseTemplate: string;
  };
}

// Air Gap configuration for the Cognitive Shield
export interface AirGapConfig {
  enabled: boolean;
  autoProcess: boolean;
  highVoltageSources: string[]; // Email addresses, phone numbers, etc.
  trustedSources: string[];
  defaultVoltage: VoltageLevel;
}

// Cognitive Shield session state
export interface CognitiveShieldSession {
  id: string;
  startedAt: number;
  currentVoltage: VoltageLevel;
  processedMessages: number;
  airGapActive: boolean;
  lastVPIResult: VPIResult | null;
}
