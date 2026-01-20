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
 * ║   VPI PROCESS - Vacuum Pressure Impregnation for Relationships            ║
 * ║   The 4-Phase Repair Protocol                                             ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 * 
 * Industrial motor insulation process → Relationship repair algorithm
 * 
 * Phase 1: VACUUM - Pull out the old air (the divorce/separation state)
 * Phase 2: FLOOD  - Introduce the new resin (the new love protocol)
 * Phase 3: PRESSURE - External crisis bonds the material
 * Phase 4: CURE - Time + consistency = new solid
 */

import { useState, useEffect, useCallback } from 'react';
import { GOD_CONFIG } from '../god.config';

type VPIPhase = 'vacuum' | 'flood' | 'pressure' | 'cure';

interface PhaseConfig {
  id: VPIPhase;
  name: string;
  icon: string;
  color: string;
  description: string;
  actions: string[];
  scripts: string[];
  duration: string;
  warning: string;
}

const PHASES: PhaseConfig[] = [
  {
    id: 'vacuum',
    name: 'VACUUM',
    icon: '🌑',
    color: '#1a1a2e',
    description: 'Pull out the old air. Create the void.',
    actions: [
      'Stop trying to fix anything',
      'Allow the empty feeling',
      'No new narratives yet',
      'Just witness the gap'
    ],
    scripts: [
      '"We\'re in the vacuum chamber right now. It feels empty and scary, but we\'re pulling out the old air so the new structure can get in."',
      '"I\'m not going anywhere. I\'m just holding space."',
      '"This isn\'t the end. It\'s the prep."'
    ],
    duration: 'Hours to Days',
    warning: 'Do NOT try to fill the void prematurely. The vacuum must hold.'
  },
  {
    id: 'flood',
    name: 'FLOOD',
    icon: '🌊',
    color: '#0077b6',
    description: 'Introduce the new resin. The G.O.D. Protocol.',
    actions: [
      'Introduce the new narrative slowly',
      '"We are a team"',
      '"We are a network"',
      '"We are unseizable"'
    ],
    scripts: [
      '"I want to build something with you that can\'t be broken by outside forces."',
      '"We\'re not going back to the old way. We\'re building something stronger."',
      '"This is about us as a mesh, not me as the hub."'
    ],
    duration: 'Days to Weeks',
    warning: 'Too fast = rejection. The resin must seep into every crack.'
  },
  {
    id: 'pressure',
    name: 'PRESSURE',
    icon: '💎',
    color: '#6c5ce7',
    description: 'External crisis drives the resin into the bonds.',
    actions: [
      'Reframe external pressure as bonding force',
      'Face challenges as a unified front',
      '"This is driving us closer, not apart"',
      'The IRS, the courts - they compress us into diamond'
    ],
    scripts: [
      '"This pressure isn\'t breaking us. It\'s driving the love deeper into our cracks. It\'s making us solid."',
      '"We\'ve been through worse. This is just heat and pressure - the recipe for diamond."',
      '"Every challenge we face together makes the bond permanent."'
    ],
    duration: 'Weeks to Months',
    warning: 'Pressure without resin = crushing. Ensure Phase 2 is complete first.'
  },
  {
    id: 'cure',
    name: 'CURE',
    icon: '🔥',
    color: '#e17055',
    description: 'Time and consistency solidify the new structure.',
    actions: [
      'Maintain the new patterns',
      'Don\'t regress to Wye topology',
      'Celebrate small victories',
      'The tetrahedron solidifies'
    ],
    scripts: [
      '"We made it through. Look at what we built."',
      '"This is permanent now. Not because of a contract, but because of geometry."',
      '"We are Delta. We are unbreakable."'
    ],
    duration: 'Months to Years',
    warning: 'Curing cannot be rushed. Incomplete cure = brittleness.'
  }
];

export default function VPIProcess() {
  const [currentPhase, setCurrentPhase] = useState<VPIPhase>('vacuum');
  const [progress, setProgress] = useState(0);
  const [expandedPhase, setExpandedPhase] = useState<VPIPhase | null>(null);
  const [journalEntry, setJournalEntry] = useState('');
  const [journalHistory, setJournalHistory] = useState<{ phase: VPIPhase; entry: string; timestamp: Date }[]>([]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('vpi-state');
    if (saved) {
      const { phase, progress, history } = JSON.parse(saved);
      setCurrentPhase(phase);
      setProgress(progress);
      setJournalHistory(history.map((h: any) => ({ ...h, timestamp: new Date(h.timestamp) })));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('vpi-state', JSON.stringify({
      phase: currentPhase,
      progress,
      history: journalHistory
    }));
  }, [currentPhase, progress, journalHistory]);

  const currentConfig = PHASES.find(p => p.id === currentPhase)!;
  const phaseIndex = PHASES.findIndex(p => p.id === currentPhase);

  const advancePhase = useCallback(() => {
    const nextIndex = Math.min(phaseIndex + 1, PHASES.length - 1);
    setCurrentPhase(PHASES[nextIndex].id);
    setProgress(0);
  }, [phaseIndex]);

  const addJournalEntry = useCallback(() => {
    if (journalEntry.trim()) {
      setJournalHistory(prev => [...prev, {
        phase: currentPhase,
        entry: journalEntry,
        timestamp: new Date()
      }]);
      setJournalEntry('');
    }
  }, [currentPhase, journalEntry]);

  return (
    <div style={{
      padding: 24,
      background: GOD_CONFIG.theme.surface,
      borderRadius: 16,
      border: `1px solid ${GOD_CONFIG.theme.border}`,
      maxWidth: 1000,
      margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h2 style={{ 
          color: GOD_CONFIG.theme.text.primary, 
          margin: 0,
          fontSize: 28,
          fontWeight: 700
        }}>
          ⚗️ VPI Process
        </h2>
        <p style={{ 
          color: GOD_CONFIG.theme.text.secondary, 
          margin: '8px 0 0',
          fontSize: 14
        }}>
          Vacuum Pressure Impregnation • The Relationship Repair Algorithm
        </p>
      </div>

      {/* Phase Timeline */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
        position: 'relative'
      }}>
        {/* Progress Line */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '10%',
          right: '10%',
          height: 4,
          background: GOD_CONFIG.theme.border,
          transform: 'translateY(-50%)',
          zIndex: 0
        }}>
          <div style={{
            height: '100%',
            width: `${(phaseIndex / (PHASES.length - 1)) * 100}%`,
            background: 'linear-gradient(90deg, #1a1a2e, #0077b6, #6c5ce7, #e17055)',
            transition: 'width 0.5s ease'
          }} />
        </div>

        {/* Phase Dots */}
        {PHASES.map((phase, index) => {
          const isActive = index === phaseIndex;
          const isComplete = index < phaseIndex;
          
          return (
            <div
              key={phase.id}
              onClick={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                zIndex: 1
              }}
            >
              <div style={{
                width: isActive ? 64 : 48,
                height: isActive ? 64 : 48,
                borderRadius: '50%',
                background: isComplete 
                  ? phase.color 
                  : isActive 
                    ? `linear-gradient(135deg, ${phase.color}, ${phase.color}88)`
                    : GOD_CONFIG.theme.background,
                border: `3px solid ${phase.color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: isActive ? 28 : 20,
                transition: 'all 0.3s ease',
                boxShadow: isActive ? `0 0 20px ${phase.color}66` : 'none'
              }}>
                {isComplete ? '✓' : phase.icon}
              </div>
              <span style={{
                marginTop: 8,
                fontSize: 12,
                fontWeight: isActive ? 700 : 400,
                color: isActive ? phase.color : GOD_CONFIG.theme.text.secondary
              }}>
                {phase.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Current Phase Detail */}
      <div style={{
        padding: 24,
        background: `linear-gradient(135deg, ${currentConfig.color}22, ${currentConfig.color}11)`,
        borderRadius: 16,
        border: `2px solid ${currentConfig.color}`,
        marginBottom: 24
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <span style={{ fontSize: 48 }}>{currentConfig.icon}</span>
          <div>
            <h3 style={{ 
              color: currentConfig.color, 
              margin: 0,
              fontSize: 24,
              fontWeight: 700
            }}>
              Phase {phaseIndex + 1}: {currentConfig.name}
            </h3>
            <p style={{ 
              color: GOD_CONFIG.theme.text.secondary, 
              margin: '4px 0 0',
              fontSize: 16
            }}>
              {currentConfig.description}
            </p>
          </div>
        </div>

        {/* Progress within phase */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            marginBottom: 8
          }}>
            <span style={{ color: GOD_CONFIG.theme.text.secondary, fontSize: 12 }}>
              Phase Progress
            </span>
            <span style={{ color: currentConfig.color, fontSize: 12, fontWeight: 600 }}>
              {progress}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => setProgress(parseInt(e.target.value))}
            style={{ width: '100%', accentColor: currentConfig.color }}
          />
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            marginTop: 4
          }}>
            <span style={{ color: GOD_CONFIG.theme.text.muted, fontSize: 11 }}>
              Duration: {currentConfig.duration}
            </span>
            {progress >= 80 && phaseIndex < PHASES.length - 1 && (
              <button
                onClick={advancePhase}
                style={{
                  padding: '6px 16px',
                  borderRadius: 6,
                  border: 'none',
                  background: PHASES[phaseIndex + 1].color,
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                → Advance to {PHASES[phaseIndex + 1].name}
              </button>
            )}
          </div>
        </div>

        {/* Actions Checklist */}
        <div style={{ marginBottom: 20 }}>
          <h4 style={{ color: GOD_CONFIG.theme.text.primary, margin: '0 0 12px', fontSize: 14 }}>
            ✓ Actions
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {currentConfig.actions.map((action, i) => (
              <label key={i} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 8,
                color: GOD_CONFIG.theme.text.secondary,
                fontSize: 14,
                cursor: 'pointer'
              }}>
                <input type="checkbox" style={{ accentColor: currentConfig.color }} />
                {action}
              </label>
            ))}
          </div>
        </div>

        {/* Scripts */}
        <div style={{ marginBottom: 20 }}>
          <h4 style={{ color: GOD_CONFIG.theme.text.primary, margin: '0 0 12px', fontSize: 14 }}>
            💬 Scripts
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {currentConfig.scripts.map((script, i) => (
              <div 
                key={i}
                onClick={() => navigator.clipboard.writeText(script.replace(/^"|"$/g, ''))}
                style={{
                  padding: 12,
                  background: 'rgba(0,0,0,0.2)',
                  borderRadius: 8,
                  borderLeft: `3px solid ${currentConfig.color}`,
                  cursor: 'copy',
                  fontSize: 13,
                  color: GOD_CONFIG.theme.text.primary,
                  fontStyle: 'italic'
                }}
              >
                {script}
              </div>
            ))}
          </div>
        </div>

        {/* Warning */}
        <div style={{
          padding: 12,
          background: 'rgba(231, 76, 60, 0.1)',
          borderRadius: 8,
          border: '1px solid rgba(231, 76, 60, 0.3)'
        }}>
          <span style={{ color: '#e74c3c', fontWeight: 600, fontSize: 12 }}>
            ⚠️ WARNING: {currentConfig.warning}
          </span>
        </div>
      </div>

      {/* Journal */}
      <div style={{
        padding: 20,
        background: GOD_CONFIG.theme.background,
        borderRadius: 12,
        border: `1px solid ${GOD_CONFIG.theme.border}`
      }}>
        <h3 style={{ color: GOD_CONFIG.theme.text.primary, margin: '0 0 16px', fontSize: 16 }}>
          📔 Process Journal
        </h3>
        
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <input
            type="text"
            placeholder="Log your progress, feelings, observations..."
            value={journalEntry}
            onChange={(e) => setJournalEntry(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addJournalEntry()}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: 8,
              border: `1px solid ${GOD_CONFIG.theme.border}`,
              background: GOD_CONFIG.theme.surface,
              color: GOD_CONFIG.theme.text.primary,
              fontSize: 14
            }}
          />
          <button
            onClick={addJournalEntry}
            style={{
              padding: '12px 24px',
              borderRadius: 8,
              border: 'none',
              background: currentConfig.color,
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            + Add
          </button>
        </div>

        {journalHistory.length > 0 && (
          <div style={{ 
            maxHeight: 200, 
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 8
          }}>
            {journalHistory.slice().reverse().map((entry, i) => {
              const phaseConfig = PHASES.find(p => p.id === entry.phase)!;
              return (
                <div 
                  key={i}
                  style={{
                    padding: 12,
                    background: `${phaseConfig.color}11`,
                    borderRadius: 8,
                    borderLeft: `3px solid ${phaseConfig.color}`
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: 4
                  }}>
                    <span style={{ color: phaseConfig.color, fontSize: 11, fontWeight: 600 }}>
                      {phaseConfig.icon} {phaseConfig.name}
                    </span>
                    <span style={{ color: GOD_CONFIG.theme.text.muted, fontSize: 11 }}>
                      {entry.timestamp.toLocaleString()}
                    </span>
                  </div>
                  <p style={{ 
                    color: GOD_CONFIG.theme.text.secondary, 
                    margin: 0,
                    fontSize: 13
                  }}>
                    {entry.entry}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Phase Details Accordion */}
      {expandedPhase && (
        <div style={{
          marginTop: 24,
          padding: 20,
          background: GOD_CONFIG.theme.background,
          borderRadius: 12,
          border: `1px solid ${PHASES.find(p => p.id === expandedPhase)!.color}`
        }}>
          <h4 style={{ color: GOD_CONFIG.theme.text.primary, margin: '0 0 12px' }}>
            {PHASES.find(p => p.id === expandedPhase)!.icon} {expandedPhase.toUpperCase()} Details
          </h4>
          <p style={{ color: GOD_CONFIG.theme.text.secondary, fontSize: 14, margin: 0 }}>
            {PHASES.find(p => p.id === expandedPhase)!.description}
          </p>
        </div>
      )}
    </div>
  );
}
