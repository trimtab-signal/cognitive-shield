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
 * ║   GENSYNC TRANSLATOR UI                                                    ║
 * ║   Universal Translation Matrix Interface                                   ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 * 
 * Translate messages between Human Operating Systems (HumanOS / vMEMEs)
 * and explore the Tetrahedron Protocol primitives.
 */

import { useState, useCallback } from 'react';
import GOD_CONFIG from '../god.config';
import {
  HUMAN_OS_PROFILES,
  TETRAHEDRON_PRIMITIVES,
  translateBetweenOS,
  detectHumanOS,
  getTranslation,
  type HumanOSProfile,
  type TranslatedMessage,
  type HumanOSDetection,
} from '../lib/gensync-matrix';
import type { HumanOS, TetrahedronPrimitive } from '../types/gensync.types';

type ViewMode = 'translator' | 'matrix' | 'detector';

export default function GenSyncTranslator() {
  const [viewMode, setViewMode] = useState<ViewMode>('translator');
  const [inputText, setInputText] = useState('');
  const [sourceOS, setSourceOS] = useState<HumanOS>('integrator');
  const [targetOS, setTargetOS] = useState<HumanOS>('empath');
  const [translatedResult, setTranslatedResult] = useState<TranslatedMessage | null>(null);
  const [detectionResult, setDetectionResult] = useState<HumanOSDetection | null>(null);
  const [selectedPrimitive, setSelectedPrimitive] = useState<TetrahedronPrimitive>('frequency');

  const handleTranslate = useCallback(() => {
    if (!inputText.trim()) return;
    const result = translateBetweenOS(inputText, sourceOS, targetOS);
    setTranslatedResult(result);
  }, [inputText, sourceOS, targetOS]);

  const handleDetect = useCallback(() => {
    if (!inputText.trim()) return;
    const result = detectHumanOS(inputText);
    setDetectionResult(result);
  }, [inputText]);

  const swapOS = useCallback(() => {
    const temp = sourceOS;
    setSourceOS(targetOS);
    setTargetOS(temp);
    setTranslatedResult(null);
  }, [sourceOS, targetOS]);

  const renderOSBadge = (os: HumanOS, profile: HumanOSProfile) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 12px',
        backgroundColor: GOD_CONFIG.theme.bg.tertiary,
        borderRadius: 8,
        border: `1px solid ${GOD_CONFIG.theme.border.default}`,
      }}
    >
      <span style={{ fontSize: 20 }}>{profile.emoji}</span>
      <div>
        <div style={{ fontWeight: 600, fontSize: 13, color: GOD_CONFIG.theme.text.primary }}>
          {profile.name}
        </div>
        <div style={{ fontSize: 11, color: GOD_CONFIG.theme.text.muted }}>
          {profile.spiralColor} • {profile.coreDriver}
        </div>
      </div>
    </div>
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        padding: 20,
        maxWidth: 1000,
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: 20,
          backgroundColor: GOD_CONFIG.theme.bg.secondary,
          borderRadius: 12,
          border: `1px solid ${GOD_CONFIG.theme.border.default}`,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 24,
            fontWeight: 700,
            color: GOD_CONFIG.theme.text.primary,
            fontFamily: GOD_CONFIG.typography.fontFamily.display,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          🔮 GenSync Translator
        </h2>
        <p style={{ margin: '8px 0 0 0', fontSize: 14, color: GOD_CONFIG.theme.text.secondary }}>
          Universal Translation Matrix for Human Operating Systems
        </p>
      </div>

      {/* Mode Tabs */}
      <div style={{ display: 'flex', gap: 8 }}>
        {(['translator', 'matrix', 'detector'] as ViewMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            style={{
              flex: 1,
              padding: '12px 16px',
              backgroundColor: viewMode === mode ? GOD_CONFIG.theme.bg.tertiary : 'transparent',
              border: `1px solid ${viewMode === mode ? GOD_CONFIG.theme.border.default : 'transparent'}`,
              borderRadius: 8,
              color: viewMode === mode ? GOD_CONFIG.theme.text.primary : GOD_CONFIG.theme.text.muted,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {mode === 'translator' && '🔄 '}
            {mode === 'matrix' && '📊 '}
            {mode === 'detector' && '🔍 '}
            {mode}
          </button>
        ))}
      </div>

      {/* Translator View */}
      {viewMode === 'translator' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* OS Selection */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, color: GOD_CONFIG.theme.text.muted, display: 'block', marginBottom: 8 }}>
                FROM (Source OS)
              </label>
              <select
                value={sourceOS}
                onChange={(e) => {
                  setSourceOS(e.target.value as HumanOS);
                  setTranslatedResult(null);
                }}
                title="Select source Human Operating System"
                aria-label="Select source Human Operating System"
                style={{
                  width: '100%',
                  padding: 12,
                  backgroundColor: GOD_CONFIG.theme.bg.tertiary,
                  border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                  borderRadius: 8,
                  color: GOD_CONFIG.theme.text.primary,
                  fontSize: 14,
                }}
              >
                {Object.values(HUMAN_OS_PROFILES).map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.emoji} {profile.name} ({profile.spiralColor})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={swapOS}
              style={{
                padding: '12px 16px',
                backgroundColor: GOD_CONFIG.theme.bg.tertiary,
                border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                borderRadius: 8,
                color: GOD_CONFIG.theme.text.primary,
                fontSize: 18,
                cursor: 'pointer',
                marginTop: 20,
              }}
            >
              ⇄
            </button>

            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, color: GOD_CONFIG.theme.text.muted, display: 'block', marginBottom: 8 }}>
                TO (Target OS)
              </label>
              <select
                value={targetOS}
                onChange={(e) => {
                  setTargetOS(e.target.value as HumanOS);
                  setTranslatedResult(null);
                }}
                title="Select target Human Operating System"
                aria-label="Select target Human Operating System"
                style={{
                  width: '100%',
                  padding: 12,
                  backgroundColor: GOD_CONFIG.theme.bg.tertiary,
                  border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                  borderRadius: 8,
                  color: GOD_CONFIG.theme.text.primary,
                  fontSize: 14,
                }}
              >
                {Object.values(HUMAN_OS_PROFILES).map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.emoji} {profile.name} ({profile.spiralColor})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* OS Profiles Display */}
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: 1 }}>{renderOSBadge(sourceOS, HUMAN_OS_PROFILES[sourceOS])}</div>
            <div style={{ flex: 1 }}>{renderOSBadge(targetOS, HUMAN_OS_PROFILES[targetOS])}</div>
          </div>

          {/* Input */}
          <div>
            <label style={{ fontSize: 12, color: GOD_CONFIG.theme.text.muted, display: 'block', marginBottom: 8 }}>
              MESSAGE TO TRANSLATE
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter a message to translate between Human Operating Systems..."
              style={{
                width: '100%',
                minHeight: 100,
                padding: 16,
                backgroundColor: GOD_CONFIG.theme.bg.tertiary,
                border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                borderRadius: 8,
                color: GOD_CONFIG.theme.text.primary,
                fontSize: 14,
                resize: 'vertical',
              }}
            />
          </div>

          <button
            onClick={handleTranslate}
            disabled={!inputText.trim()}
            style={{
              padding: '14px 24px',
              backgroundColor: inputText.trim() ? '#FFD700' : GOD_CONFIG.theme.bg.tertiary,
              border: 'none',
              borderRadius: 8,
              color: inputText.trim() ? '#000' : GOD_CONFIG.theme.text.muted,
              fontSize: 14,
              fontWeight: 600,
              cursor: inputText.trim() ? 'pointer' : 'not-allowed',
            }}
          >
            🔮 Translate
          </button>

          {/* Result */}
          {translatedResult && (
            <div
              style={{
                padding: 20,
                backgroundColor: GOD_CONFIG.theme.bg.secondary,
                borderRadius: 12,
                border: `2px solid #FFD700`,
              }}
            >
              <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.muted, marginBottom: 8 }}>
                TRANSLATED MESSAGE
              </div>
              <div
                style={{
                  fontSize: 16,
                  color: GOD_CONFIG.theme.text.primary,
                  lineHeight: 1.6,
                  padding: 16,
                  backgroundColor: GOD_CONFIG.theme.bg.tertiary,
                  borderRadius: 8,
                }}
              >
                "{translatedResult.translated}"
              </div>

              {translatedResult.adaptations.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.muted, marginBottom: 8 }}>
                    ADAPTATIONS MADE
                  </div>
                  {translatedResult.adaptations.map((adaptation, i) => (
                    <div
                      key={i}
                      style={{
                        fontSize: 13,
                        color: GOD_CONFIG.theme.text.secondary,
                        padding: '6px 0',
                        borderBottom: `1px solid ${GOD_CONFIG.theme.border.default}`,
                      }}
                    >
                      • {adaptation}
                    </div>
                  ))}
                </div>
              )}

              <div style={{ marginTop: 16, fontSize: 12, color: GOD_CONFIG.theme.text.muted }}>
                Confidence: {(translatedResult.confidence * 100).toFixed(0)}%
              </div>
            </div>
          )}
        </div>
      )}

      {/* Matrix View */}
      {viewMode === 'matrix' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Primitive Selector */}
          <div>
            <label style={{ fontSize: 12, color: GOD_CONFIG.theme.text.muted, display: 'block', marginBottom: 8 }}>
              TETRAHEDRON PRIMITIVE
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              {Object.values(TETRAHEDRON_PRIMITIVES).map((primitive) => (
                <button
                  key={primitive.id}
                  onClick={() => setSelectedPrimitive(primitive.id)}
                  style={{
                    flex: 1,
                    padding: '12px 8px',
                    backgroundColor: selectedPrimitive === primitive.id ? '#FFD700' : GOD_CONFIG.theme.bg.tertiary,
                    border: `1px solid ${selectedPrimitive === primitive.id ? '#FFD700' : GOD_CONFIG.theme.border.default}`,
                    borderRadius: 8,
                    color: selectedPrimitive === primitive.id ? '#000' : GOD_CONFIG.theme.text.primary,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 18 }}>{primitive.symbol}</div>
                  <div>{primitive.name.split(' / ')[0]}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Primitive Description */}
          <div
            style={{
              padding: 16,
              backgroundColor: GOD_CONFIG.theme.bg.tertiary,
              borderRadius: 8,
              border: `1px solid ${GOD_CONFIG.theme.border.default}`,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600, color: GOD_CONFIG.theme.text.primary }}>
              {TETRAHEDRON_PRIMITIVES[selectedPrimitive].name}
            </div>
            <div style={{ fontSize: 13, color: GOD_CONFIG.theme.text.secondary, marginTop: 4 }}>
              {TETRAHEDRON_PRIMITIVES[selectedPrimitive].description}
            </div>
            <div style={{ fontSize: 11, color: GOD_CONFIG.theme.text.muted, marginTop: 8 }}>
              Physics: {TETRAHEDRON_PRIMITIVES[selectedPrimitive].physicsLayer}
            </div>
          </div>

          {/* Translation Matrix */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 12,
            }}
          >
            {Object.values(HUMAN_OS_PROFILES).map((profile) => {
              const translation = getTranslation(selectedPrimitive, profile.id);
              if (!translation) return null;

              return (
                <div
                  key={profile.id}
                  style={{
                    padding: 16,
                    backgroundColor: GOD_CONFIG.theme.bg.secondary,
                    borderRadius: 12,
                    border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <span style={{ fontSize: 24 }}>{profile.emoji}</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: GOD_CONFIG.theme.text.primary }}>
                        {profile.name}
                      </div>
                      <div style={{ fontSize: 11, color: GOD_CONFIG.theme.text.muted }}>
                        {profile.spiralColor}
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.muted, marginBottom: 4 }}>
                    DRIVER
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#FFD700', marginBottom: 12 }}>
                    {translation.driver}
                  </div>

                  <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.muted, marginBottom: 4 }}>
                    METAPHOR
                  </div>
                  <div style={{ fontSize: 13, color: GOD_CONFIG.theme.text.secondary, marginBottom: 12, fontStyle: 'italic' }}>
                    "{translation.metaphor}"
                  </div>

                  <div
                    style={{
                      padding: 12,
                      backgroundColor: 'rgba(255, 215, 0, 0.1)',
                      borderRadius: 8,
                      borderLeft: '3px solid #FFD700',
                    }}
                  >
                    <div style={{ fontSize: 10, color: '#FFD700', marginBottom: 4 }}>
                      VALIDATION SCRIPT
                    </div>
                    <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.primary }}>
                      "{translation.validation}"
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Detector View */}
      {viewMode === 'detector' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, color: GOD_CONFIG.theme.text.muted, display: 'block', marginBottom: 8 }}>
              TEXT TO ANALYZE
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text to detect the speaker's likely Human Operating System..."
              style={{
                width: '100%',
                minHeight: 120,
                padding: 16,
                backgroundColor: GOD_CONFIG.theme.bg.tertiary,
                border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                borderRadius: 8,
                color: GOD_CONFIG.theme.text.primary,
                fontSize: 14,
                resize: 'vertical',
              }}
            />
          </div>

          <button
            onClick={handleDetect}
            disabled={!inputText.trim()}
            style={{
              padding: '14px 24px',
              backgroundColor: inputText.trim() ? '#9B59B6' : GOD_CONFIG.theme.bg.tertiary,
              border: 'none',
              borderRadius: 8,
              color: inputText.trim() ? '#fff' : GOD_CONFIG.theme.text.muted,
              fontSize: 14,
              fontWeight: 600,
              cursor: inputText.trim() ? 'pointer' : 'not-allowed',
            }}
          >
            🔍 Detect HumanOS
          </button>

          {detectionResult && (
            <div
              style={{
                padding: 20,
                backgroundColor: GOD_CONFIG.theme.bg.secondary,
                borderRadius: 12,
                border: `2px solid #9B59B6`,
              }}
            >
              <div style={{ display: 'flex', gap: 20 }}>
                {/* Primary OS */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.muted, marginBottom: 8 }}>
                    PRIMARY DETECTION
                  </div>
                  <div
                    style={{
                      padding: 16,
                      backgroundColor: GOD_CONFIG.theme.bg.tertiary,
                      borderRadius: 8,
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: 48 }}>{HUMAN_OS_PROFILES[detectionResult.primary].emoji}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: GOD_CONFIG.theme.text.primary, marginTop: 8 }}>
                      {HUMAN_OS_PROFILES[detectionResult.primary].name}
                    </div>
                    <div style={{ fontSize: 13, color: GOD_CONFIG.theme.text.secondary }}>
                      {HUMAN_OS_PROFILES[detectionResult.primary].spiralColor}
                    </div>
                    <div style={{ fontSize: 12, color: '#9B59B6', marginTop: 8 }}>
                      Score: {detectionResult.primaryScore}
                    </div>
                  </div>
                </div>

                {/* Secondary OS */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.muted, marginBottom: 8 }}>
                    SECONDARY TRAIT
                  </div>
                  <div
                    style={{
                      padding: 16,
                      backgroundColor: GOD_CONFIG.theme.bg.tertiary,
                      borderRadius: 8,
                      textAlign: 'center',
                      opacity: 0.7,
                    }}
                  >
                    <div style={{ fontSize: 32 }}>{HUMAN_OS_PROFILES[detectionResult.secondary].emoji}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: GOD_CONFIG.theme.text.primary, marginTop: 8 }}>
                      {HUMAN_OS_PROFILES[detectionResult.secondary].name}
                    </div>
                    <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.muted }}>
                      Score: {detectionResult.secondaryScore}
                    </div>
                  </div>
                </div>
              </div>

              {/* All Scores */}
              <div style={{ marginTop: 20 }}>
                <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.muted, marginBottom: 8 }}>
                  ALL SCORES
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {Object.entries(detectionResult.allScores).map(([os, score]) => (
                    <div
                      key={os}
                      style={{
                        flex: 1,
                        padding: 8,
                        backgroundColor: GOD_CONFIG.theme.bg.tertiary,
                        borderRadius: 6,
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: 16 }}>{HUMAN_OS_PROFILES[os as HumanOS].emoji}</div>
                      <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.secondary }}>{score}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
