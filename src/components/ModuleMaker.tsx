/**
 * MODULE MAKER
 * The Geodesic Workshop for Autopoietic Extension
 * 
 * "The Module Maker is the reproductive organ of the system."
 * - Genesis Gate Protocol
 */

import { useState, useCallback } from 'react';
import { Code2, Sparkles, CheckCircle2, XCircle, AlertTriangle, Loader2, Play, Save, Trash2 } from 'lucide-react';
import Editor from '@monaco-editor/react';
import GOD_CONFIG from '../god.config';
import { generateModuleFromVibe } from '../lib/vibe-coder';
import { analyzeModule } from '../lib/harmonic-linter';
import useShieldStore from '../store/shield.store';
import useHeartbeatStore from '../store/heartbeat.store';
import { useModuleStore } from '../store/module.store';
import type {
  VibeCoderRequest,
  VibeCoderResponse,
  ModuleMakerPhase,
  GeodesicModule,
} from '../types/module.types';

export function ModuleMaker() {
  const [phase, setPhase] = useState<ModuleMakerPhase>('idle');
  const [intent, setIntent] = useState('');
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [vibeResponse, setVibeResponse] = useState<VibeCoderResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCode, setShowCode] = useState(false); // Inverse Transparency

  const shieldStore = useShieldStore();
  const heartbeatStore = useHeartbeatStore();
  const moduleStore = useModuleStore();

  const todayCheckIn = heartbeatStore.getTodayCheckIn();
  const userSpoons = 12; // TODO: Get from actual spoon budget
  const statusPercentage = todayCheckIn?.percentage ?? 100;

  const handleVibeInput = useCallback(async () => {
    if (!intent.trim()) {
      setError('Please enter your intent.');
      return;
    }

    setPhase('context-engineering');
    setError(null);

    try {
      const request: VibeCoderRequest = {
        intent: intent.trim(),
        context: {
          userSpoons,
          userHumanOS: shieldStore.userHumanOS || 'integrator',
          dailyCheckInPercentage: statusPercentage,
          existingModules: moduleStore.installedModules.map((m) => m.id),
        },
        constraints: {
          maxSpoonCost:
            statusPercentage < 25
              ? GOD_CONFIG.moduleMaker.maxSpoonCostCritical
              : GOD_CONFIG.moduleMaker.maxSpoonCost,
        },
      };

      setPhase('generation');
      const response = await generateModuleFromVibe(request);
      setVibeResponse(response);
      setGeneratedCode(response.code);
      setPhase('review');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
      setPhase('idle');
    }
  }, [intent, userSpoons, statusPercentage, shieldStore.userHumanOS, moduleStore.installedModules]);

  const handleDeploy = useCallback(async () => {
    if (!vibeResponse || !generatedCode) {
      setError('No code to deploy.');
      return;
    }

    setPhase('deployment');
    setError(null);

    try {
      // Create module object
      const moduleId = crypto.randomUUID();
      const moduleName = extractModuleName(intent);

      const module: GeodesicModule = {
        id: moduleId,
        name: moduleName,
        description: intent,
        version: '1.0.0',
        author: heartbeatStore.myPeerId || 'local-user',
        sourceCode: generatedCode,
        manifest: {
          entryPoint: `${moduleName}.tsx`,
          dependencies: [],
          hooks: extractHooks(generatedCode),
          permissions: extractPermissions(generatedCode),
          topology: 'delta', // Must be delta for approval
          resonanceTarget: GOD_CONFIG.moduleMaker.targetResonance,
        },
        linterReport: vibeResponse.linterReport,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isInstalled: false,
        isEnabled: false,
        abdicated: false,
      };

      // Install module
      moduleStore.installModule(module);
      setPhase('complete');

      // Auto-enable if linter passed
      if (vibeResponse.linterReport.isStable) {
        moduleStore.enableModule(moduleId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Deployment failed');
      setPhase('review');
    }
  }, [vibeResponse, generatedCode, intent, heartbeatStore.myPeerId, moduleStore]);

  const handleReset = useCallback(() => {
    setPhase('idle');
    setIntent('');
    setGeneratedCode('');
    setVibeResponse(null);
    setError(null);
    setShowCode(false);
  }, []);

  const resonanceScore = vibeResponse?.resonanceScore ?? 0;
  const resonanceColor =
    Math.abs(resonanceScore - GOD_CONFIG.moduleMaker.targetResonance) <=
    GOD_CONFIG.moduleMaker.resonanceTolerance
      ? GOD_CONFIG.heartbeat.statuses.green.color
      : resonanceScore > GOD_CONFIG.moduleMaker.targetResonance
      ? GOD_CONFIG.voltage.medium.color
      : GOD_CONFIG.voltage.high.color;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        padding: 20,
        maxWidth: 1200,
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: 20,
          backgroundColor: GOD_CONFIG.theme.bg.secondary,
          borderRadius: 12,
          border: `1px solid ${GOD_CONFIG.moduleMaker.goldRelief.borderColor}`,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 24,
            fontWeight: 700,
            color: GOD_CONFIG.moduleMaker.goldRelief.textColor,
            fontFamily: GOD_CONFIG.typography.fontFamily.display,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <Code2 size={28} /> The Geodesic Workshop
        </h2>
        <p style={{ margin: '8px 0 0 0', fontSize: 14, color: GOD_CONFIG.theme.text.secondary }}>
          Autopoietic Extension via Vibe Coding. Translate your intent into harmonically resonant code.
        </p>
      </div>

      {/* Phase 1: Vibe Input (Trim Tab) */}
      {phase === 'idle' && (
        <div
          style={{
            padding: 20,
            backgroundColor: GOD_CONFIG.theme.bg.secondary,
            borderRadius: 12,
            border: `1px solid ${GOD_CONFIG.theme.border.default}`,
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontFamily: GOD_CONFIG.typography.fontFamily.display,
              color: GOD_CONFIG.theme.text.muted,
              marginBottom: 16,
            }}
          >
            TRIM TAB: THE VIBE INPUT
          </div>
          <textarea
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
            placeholder="What system do you wish to manifest? (e.g., 'Create a mood tracker that feels calm and locks down when I'm overwhelmed.')"
            style={{
              width: '100%',
              minHeight: 120,
              padding: 16,
              backgroundColor: GOD_CONFIG.theme.bg.tertiary,
              border: `1px solid ${GOD_CONFIG.theme.border.default}`,
              borderRadius: 8,
              color: GOD_CONFIG.theme.text.primary,
              fontFamily: GOD_CONFIG.typography.fontFamily.body,
              fontSize: 14,
              resize: 'vertical',
            }}
          />
          <button
            onClick={handleVibeInput}
            disabled={!intent.trim() || phase !== 'idle'}
            style={{
              marginTop: 16,
              padding: '12px 24px',
              backgroundColor: GOD_CONFIG.moduleMaker.goldRelief.accentColor,
              border: 'none',
              borderRadius: 8,
              color: '#000',
              fontSize: 14,
              fontWeight: 600,
              fontFamily: GOD_CONFIG.typography.fontFamily.display,
              cursor: intent.trim() && phase === 'idle' ? 'pointer' : 'not-allowed',
              opacity: intent.trim() && phase === 'idle' ? 1 : 0.5,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Sparkles size={16} /> Generate Module
          </button>
        </div>
      )}

      {/* Phase 2-3: Generation & Linting */}
      {(phase === 'context-engineering' || phase === 'generation' || phase === 'linting') && (
        <div
          style={{
            padding: 20,
            backgroundColor: GOD_CONFIG.theme.bg.secondary,
            borderRadius: 12,
            border: `1px solid ${GOD_CONFIG.theme.border.default}`,
            textAlign: 'center',
          }}
        >
          <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', marginBottom: 16 }} />
          <div style={{ fontSize: 16, fontWeight: 600, color: GOD_CONFIG.theme.text.primary }}>
            {phase === 'context-engineering' && 'Context Engineering (The Vacuum)...'}
            {phase === 'generation' && 'Structural Generation (The Pressure)...'}
            {phase === 'linting' && 'Harmonic Linting (The Impregnation)...'}
          </div>
          <div style={{ fontSize: 13, color: GOD_CONFIG.theme.text.secondary, marginTop: 8 }}>
            The Digital Centaur is translating your vibe into code...
          </div>
        </div>
      )}

      {/* Phase 4: Review */}
      {phase === 'review' && vibeResponse && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {/* Linter Report */}
          <div
            style={{
              padding: 20,
              backgroundColor: GOD_CONFIG.theme.bg.secondary,
              borderRadius: 12,
              border: `2px solid ${
                vibeResponse.linterReport.isStable
                  ? GOD_CONFIG.heartbeat.statuses.green.color
                  : GOD_CONFIG.voltage.high.color
              }`,
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontFamily: GOD_CONFIG.typography.fontFamily.display,
                color: GOD_CONFIG.theme.text.muted,
                marginBottom: 16,
              }}
            >
              HARMONIC LINTER REPORT
            </div>

            <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 11, color: GOD_CONFIG.theme.text.muted }}>Resonance Score</div>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: resonanceColor,
                    fontFamily: GOD_CONFIG.typography.fontFamily.display,
                  }}
                >
                  {resonanceScore.toFixed(3)}
                </div>
                <div style={{ fontSize: 11, color: GOD_CONFIG.theme.text.muted }}>
                  Target: {GOD_CONFIG.moduleMaker.targetResonance} ±{' '}
                  {GOD_CONFIG.moduleMaker.resonanceTolerance}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: GOD_CONFIG.theme.text.muted }}>Spoon Cost</div>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: GOD_CONFIG.theme.text.primary,
                  }}
                >
                  {vibeResponse.spoonCost}
                </div>
                <div style={{ fontSize: 11, color: GOD_CONFIG.theme.text.muted }}>Daily Estimate</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: GOD_CONFIG.theme.text.muted }}>Status</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  {vibeResponse.linterReport.isStable ? (
                    <CheckCircle2 size={24} color={GOD_CONFIG.heartbeat.statuses.green.color} />
                  ) : (
                    <XCircle size={24} color={GOD_CONFIG.voltage.high.color} />
                  )}
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: vibeResponse.linterReport.isStable
                        ? GOD_CONFIG.heartbeat.statuses.green.color
                        : GOD_CONFIG.voltage.high.color,
                    }}
                  >
                    {vibeResponse.linterReport.isStable ? 'STABLE' : 'VIOLATIONS'}
                  </span>
                </div>
              </div>
            </div>

            {/* Violations */}
            {vibeResponse.linterReport.violations.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: GOD_CONFIG.theme.text.primary, marginBottom: 8 }}>
                  Violations:
                </div>
                {vibeResponse.linterReport.violations.map((violation, i) => (
                  <div
                    key={i}
                    style={{
                      padding: 12,
                      backgroundColor: GOD_CONFIG.theme.bg.tertiary,
                      borderRadius: 8,
                      marginBottom: 8,
                      borderLeft: `3px solid ${
                        violation.severity === 'error'
                          ? GOD_CONFIG.voltage.high.color
                          : violation.severity === 'warning'
                          ? GOD_CONFIG.voltage.medium.color
                          : GOD_CONFIG.theme.border.default
                      }`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: GOD_CONFIG.theme.text.primary,
                        marginBottom: 4,
                      }}
                    >
                      [{violation.category.toUpperCase()}] {violation.message}
                    </div>
                    {violation.suggestion && (
                      <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.secondary }}>
                        💡 {violation.suggestion}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Code Preview (Monaco Editor - Inverse Transparency) */}
          <div
            style={{
              padding: 20,
              backgroundColor: GOD_CONFIG.moduleMaker.goldRelief.bgColor,
              borderRadius: 12,
              border: `1px solid ${GOD_CONFIG.moduleMaker.goldRelief.borderColor}`,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontFamily: GOD_CONFIG.typography.fontFamily.display,
                  color: GOD_CONFIG.moduleMaker.goldRelief.textColor,
                }}
              >
                THE TRUTH LAYER (Monaco Editor)
              </div>
              <button
                onClick={() => setShowCode(!showCode)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: GOD_CONFIG.moduleMaker.goldRelief.accentColor,
                  border: 'none',
                  borderRadius: 6,
                  color: '#000',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {showCode ? 'Hide Code' : 'Press to Reveal'}
              </button>
            </div>
            {showCode && (
              <div style={{ height: 400, borderRadius: 8, overflow: 'hidden' }}>
                <Editor
                  height="400px"
                  defaultLanguage="typescript"
                  value={generatedCode}
                  onChange={(value) => value && setGeneratedCode(value)}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 12,
                    fontFamily: 'JetBrains Mono, Fira Code, monospace',
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    readOnly: false,
                    automaticLayout: true,
                  }}
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={handleDeploy}
              disabled={!vibeResponse.linterReport.isStable}
              style={{
                flex: 1,
                padding: '12px 24px',
                backgroundColor: vibeResponse.linterReport.isStable
                  ? GOD_CONFIG.heartbeat.statuses.green.color
                  : GOD_CONFIG.theme.bg.tertiary,
                border: 'none',
                borderRadius: 8,
                color: vibeResponse.linterReport.isStable ? '#fff' : GOD_CONFIG.theme.text.muted,
                fontSize: 14,
                fontWeight: 600,
                fontFamily: GOD_CONFIG.typography.fontFamily.display,
                cursor: vibeResponse.linterReport.isStable ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <Save size={16} /> Deploy Module
            </button>
            <button
              onClick={handleReset}
              style={{
                padding: '12px 24px',
                backgroundColor: GOD_CONFIG.theme.bg.tertiary,
                border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                borderRadius: 8,
                color: GOD_CONFIG.theme.text.primary,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Trash2 size={16} /> Reset
            </button>
          </div>
        </div>
      )}

      {/* Phase 5: Complete */}
      {phase === 'complete' && (
        <div
          style={{
            padding: 20,
            backgroundColor: GOD_CONFIG.theme.bg.secondary,
            borderRadius: 12,
            border: `2px solid ${GOD_CONFIG.heartbeat.statuses.green.color}`,
            textAlign: 'center',
          }}
        >
          <CheckCircle2 size={48} color={GOD_CONFIG.heartbeat.statuses.green.color} style={{ marginBottom: 16 }} />
          <h3
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 700,
              color: GOD_CONFIG.heartbeat.statuses.green.color,
            }}
          >
            Module Deployed
          </h3>
          <p style={{ fontSize: 14, color: GOD_CONFIG.theme.text.secondary, marginTop: 8 }}>
            Your module has been installed and is ready to use.
          </p>
          <button
            onClick={handleReset}
            style={{
              marginTop: 16,
              padding: '12px 24px',
              backgroundColor: GOD_CONFIG.moduleMaker.goldRelief.accentColor,
              border: 'none',
              borderRadius: 8,
              color: '#000',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Create Another Module
          </button>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div
          style={{
            padding: 16,
            backgroundColor: `${GOD_CONFIG.voltage.high.color}15`,
            borderRadius: 8,
            border: `1px solid ${GOD_CONFIG.voltage.high.color}40`,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <AlertTriangle size={20} color={GOD_CONFIG.voltage.high.color} />
          <div style={{ fontSize: 13, color: GOD_CONFIG.theme.text.primary }}>{error}</div>
        </div>
      )}
    </div>
  );
}

function extractModuleName(intent: string): string {
  const words = intent
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .slice(0, 3);
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}

function extractHooks(code: string): string[] {
  const hooks: string[] = [];
  const hookPattern = /use\w+\(/g;
  const matches = code.match(hookPattern);
  if (matches) {
    hooks.push(...matches.map((m) => m.replace('(', '')));
  }
  return [...new Set(hooks)];
}

function extractPermissions(code: string): import('../types/module.types').ModulePermission[] {
  const permissions: import('../types/module.types').ModulePermission[] = [];
  if (/useSpoonBudget|spoon/i.test(code)) permissions.push('read:heartbeat');
  if (/useShield|shield/i.test(code)) permissions.push('read:shield');
  if (/triggerVagus|haptic/i.test(code)) permissions.push('haptic:trigger');
  if (/useMeshQuery|mesh/i.test(code)) permissions.push('mesh:query');
  return permissions;
}

export default ModuleMaker;

