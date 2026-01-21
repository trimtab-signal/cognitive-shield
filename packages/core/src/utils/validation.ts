// Validation utilities for MASTER_PROJECT

import { z } from 'zod';

// Zod schemas for validation
export const TetrahedronNodeSchema = z.object({
  id: z.string(),
  position: z.tuple([z.number(), z.number(), z.number()]),
  connections: z.array(z.string()),
  state: z.enum(['stable', 'convergent', 'divergent', 'neutral']),
});

export const QuantumStateSchema = z.object({
  amplitude: z.number().min(0).max(1),
  phase: z.number().min(0).max(2 * Math.PI),
  coherence: z.number().min(0).max(1),
  entropy: z.number().min(0),
});

export const MessagePayloadSchema = z.object({
  id: z.string(),
  content: z.string(),
  timestamp: z.number(),
  voltage: z.number().min(0).max(1),
  humanOS: z.enum(['guardian', 'order', 'achiever', 'empath', 'integrator']),
  triggers: z.array(z.string()),
});

export const ShieldResponseSchema = z.object({
  bluf: z.string(),
  voltage: z.number().min(0).max(1),
  triggers: z.array(z.string()),
  humanOS: z.string(),
  translation: z.string(),
  why: z.string(),
});

// Validation functions
export function validateTetrahedronNode(data: unknown): boolean {
  try {
    TetrahedronNodeSchema.parse(data);
    return true;
  } catch {
    return false;
  }
}

export function validateQuantumState(data: unknown): boolean {
  try {
    QuantumStateSchema.parse(data);
    return true;
  } catch {
    return false;
  }
}

export function validateMessagePayload(data: unknown): boolean {
  try {
    MessagePayloadSchema.parse(data);
    return true;
  } catch {
    return false;
  }
}

export function validateShieldResponse(data: unknown): boolean {
  try {
    ShieldResponseSchema.parse(data);
    return true;
  } catch {
    return false;
  }
}

// Constitutional Violation Error
export class ConstitutionalViolationError extends Error {
  constructor(violation: string, component?: string) {
    super(`GOD Protocol Violation: ${violation}${component ? ` in ${component}` : ''}`);
    this.name = 'ConstitutionalViolationError';
  }
}

// Validation helpers
export function assertTetrahedronConstraint(nodeCount: number): void {
  if (nodeCount !== 4) {
    throw new ConstitutionalViolationError(
      `Tetrahedron must have exactly 4 vertices, got ${nodeCount}`,
      'TetrahedronProtocol'
    );
  }
}

export function assertNoPlaintextStrings(content: string, context: string): void {
  // This is a simplified check - in practice, you'd want more sophisticated
  // detection of potentially sensitive content
  if (content.includes('password') || content.includes('secret')) {
    throw new ConstitutionalViolationError(
      'Detected potential plaintext sensitive content',
      context
    );
  }
}

export function assertResonanceCompliance(value: number, context: string): void {
  const MARK_1_ATTRACTOR = 0.34906585;
  const tolerance = 0.05;

  if (Math.abs(value - MARK_1_ATTRACTOR) > tolerance) {
    console.warn(`Resonance value ${value} deviates from Mark 1 Attractor ${MARK_1_ATTRACTOR} in ${context}`);
  }
}

// Type guards
export function isValidHumanOSType(value: string): value is 'guardian' | 'order' | 'achiever' | 'empath' | 'integrator' {
  return ['guardian', 'order', 'achiever', 'empath', 'integrator'].includes(value);
}

export function isValidVoltageLevel(value: string): value is 'low' | 'medium' | 'high' {
  return ['low', 'medium', 'high'].includes(value);
}

// Sanitization utilities
export function sanitizeInput(input: string): string {
  // Basic input sanitization - remove potential script tags, etc.
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
}

export function validateCoherence(value: number): boolean {
  return value >= 0 && value <= 1;
}

export function validateEntropy(value: number): boolean {
  return value >= 0; // Entropy can theoretically be infinite
}