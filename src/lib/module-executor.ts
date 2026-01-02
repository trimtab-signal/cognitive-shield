/**
 * MODULE EXECUTOR
 * Runtime for executing user-generated modules
 * 
 * Implements dynamic component loading and execution
 */

import React from 'react';
import type { ComponentType } from 'react';
import type { GeodesicModule } from '../types/module.types';

/**
 * Execute a module by dynamically creating a React component
 * This is a simplified version - in production, you'd use proper code evaluation
 * with sandboxing (WASM/WASI or iframe isolation)
 */
export function createModuleComponent(module: GeodesicModule): ComponentType {
  // For now, we'll create a wrapper component that displays the module info
  // In production, you'd compile the source code and execute it safely
  
  return function ModuleWrapper() {
    return React.createElement(
      'div',
      {
        style: {
          padding: 20,
          backgroundColor: '#141416',
          borderRadius: 12,
          border: '1px solid #27272a',
          fontFamily: 'system-ui, sans-serif',
        },
      },
      React.createElement('h3', { style: { margin: '0 0 12px 0', fontSize: 18, fontWeight: 600, color: '#fafafa' } }, module.name),
      React.createElement('p', { style: { margin: '0 0 16px 0', fontSize: 14, color: '#a1a1aa' } }, module.description),
      React.createElement(
        'div',
        { style: { padding: 16, backgroundColor: '#1c1c1f', borderRadius: 8, marginBottom: 16 } },
        React.createElement('div', { style: { fontSize: 12, color: '#71717a', marginBottom: 8 } }, 'Module Source'),
        React.createElement('pre', { style: { margin: 0, fontSize: 11, fontFamily: 'monospace', color: '#a1a1aa', overflow: 'auto', maxHeight: 300 } }, module.sourceCode)
      ),
      React.createElement(
        'div',
        { style: { fontSize: 12, color: '#71717a' } },
        React.createElement('div', null, `Status: ${module.isEnabled ? 'Enabled' : 'Disabled'}`),
        React.createElement('div', null, `Resonance: ${module.linterReport.resonanceScore.toFixed(3)}`),
        React.createElement('div', null, `Spoon Cost: ${module.linterReport.spoonCost}`)
      ),
      React.createElement(
        'div',
        { style: { marginTop: 16, padding: 12, backgroundColor: '#1a1a1a', borderRadius: 8 } },
        React.createElement('div', { style: { fontSize: 11, color: '#71717a', marginBottom: 4 } }, 'Note'),
        React.createElement('div', { style: { fontSize: 12, color: '#a1a1aa' } }, 'Full module execution requires WASM/WASI sandbox or iframe isolation. This is a preview.')
      )
    );
  };
}

/**
 * Validate module before execution
 */
export function validateModuleForExecution(module: GeodesicModule): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!module.linterReport.isStable) {
    errors.push('Module has linter violations');
  }

  if (module.linterReport.spoonCost > 10) {
    errors.push('Module spoon cost exceeds threshold');
  }

  if (module.manifest.topology !== 'delta') {
    errors.push('Module uses Wye topology (centralized)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get all enabled modules ready for execution
 */
export function getExecutableModules(modules: GeodesicModule[]): GeodesicModule[] {
  return modules.filter((m) => {
    const validation = validateModuleForExecution(m);
    return m.isEnabled && validation.valid;
  });
}

