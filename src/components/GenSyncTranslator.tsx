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
import './GenSyncTranslator.css';
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
    <div className="gensync-badge">
      <span className="gensync-badge-emoji">{profile.emoji}</span>
      <div>
        <div className="gensync-badge-title">{profile.name}</div>
        <div className="gensync-badge-desc">{profile.spiralColor} • {profile.coreDriver}</div>
      </div>
    </div>
  );

  return (
    <div className="gensync-flex-col gensync-translator-root">
      {/* Header */}
      <div className="gensync-section">
        <h2 className="gensync-section-title">🔮 GenSync Translator</h2>
        <p className="gensync-section-desc">Universal Translation Matrix for Human Operating Systems</p>
      </div>

      {/* Mode Tabs */}
      <div className="gensync-flex">
        {(['translator', 'matrix', 'detector'] as ViewMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`gensync-btn${viewMode === mode ? ' gensync-btn-active' : ''}`}
            data-mode={mode}
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
        <div className="gensync-flex-col">
          {/* OS Selection */}
          <div className="gensync-flex-row">
            <div className="gensync-os-badge-flex">
              <label className="gensync-label">FROM (Source OS)</label>
              <select
                value={sourceOS}
                onChange={(e) => {
                  setSourceOS(e.target.value as HumanOS);
                  setTranslatedResult(null);
                }}
                title="Select source Human Operating System"
                aria-label="Select source Human Operating System"
                className="gensync-select"
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
              className="gensync-btn gensync-swap-btn"
            >
              ⇄
            </button>

            <div className="gensync-os-badge-flex">
              <label className="gensync-label">TO (Target OS)</label>
              <select
                value={targetOS}
                onChange={(e) => {
                  setTargetOS(e.target.value as HumanOS);
                  setTranslatedResult(null);
                }}
                title="Select target Human Operating System"
                aria-label="Select target Human Operating System"
                className="gensync-select"
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
          <div className="gensync-flex-row gensync-os-badges-row">
            <div className="gensync-os-badge-flex">{renderOSBadge(sourceOS, HUMAN_OS_PROFILES[sourceOS])}</div>
            <div className="gensync-os-badge-flex">{renderOSBadge(targetOS, HUMAN_OS_PROFILES[targetOS])}</div>
          </div>

          {/* Input */}
          <div>
            <label className="gensync-label">MESSAGE TO TRANSLATE</label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter a message to translate between Human Operating Systems..."
              className="gensync-textarea gensync-message-textarea"
            />
          </div>

          <button
            onClick={handleTranslate}
            disabled={!inputText.trim()}
            className={`gensync-btn gensync-translate-btn${inputText.trim() ? '' : ' gensync-btn-disabled'}`}
          >
            🔮 Translate
          </button>

          {/* Result */}
          {translatedResult && (
            <div className="gensync-translate-result">
              <div className="gensync-muted">TRANSLATED MESSAGE</div>
              <div className="gensync-translate-message">"{translatedResult.translated}"</div>

              {translatedResult.adaptations.length > 0 && (
                <div className="gensync-translate-adaptations">
                  <div className="gensync-muted">ADAPTATIONS MADE</div>
                  {translatedResult.adaptations.map((adaptation, i) => (
                    <div key={i} className="gensync-translate-adaptation">• {adaptation}</div>
                  ))}
                </div>
              )}

              <div className="gensync-translate-confidence">
                Confidence: {(translatedResult.confidence * 100).toFixed(0)}%
              </div>
            </div>
          )}
        </div>
      )}

      {/* Matrix View */}
      {viewMode === 'matrix' && (
        <div className="gensync-flex-col gensync-matrix-root">
          {/* Primitive Selector */}
          <div>
            <label className="gensync-label">TETRAHEDRON PRIMITIVE</label>
            <div className="gensync-flex gensync-matrix-primitive-row">
              {Object.values(TETRAHEDRON_PRIMITIVES).map((primitive) => (
                <button
                  key={primitive.id}
                  onClick={() => setSelectedPrimitive(primitive.id)}
                  className={`gensync-btn gensync-matrix-primitive-btn${selectedPrimitive === primitive.id ? ' gensync-matrix-primitive-btn-active' : ''}`}
                >
                  <div className="gensync-matrix-primitive-symbol">{primitive.symbol}</div>
                  <div>{primitive.name.split(' / ')[0]}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Primitive Description */}
          <div className="gensync-matrix-primitive-desc">
            <div className="gensync-matrix-primitive-title">{TETRAHEDRON_PRIMITIVES[selectedPrimitive].name}</div>
            <div className="gensync-matrix-primitive-description">{TETRAHEDRON_PRIMITIVES[selectedPrimitive].description}</div>
            <div className="gensync-matrix-primitive-physics">Physics: {TETRAHEDRON_PRIMITIVES[selectedPrimitive].physicsLayer}</div>
          </div>

          {/* Translation Matrix */}
          <div className="gensync-matrix-grid">
            {Object.values(HUMAN_OS_PROFILES).map((profile) => {
              const translation = getTranslation(selectedPrimitive, profile.id);
              if (!translation) return null;

              return (
                <div key={profile.id} className="gensync-matrix-profile">
                  <div className="gensync-matrix-profile-header">
                    <span className="gensync-matrix-profile-emoji">{profile.emoji}</span>
                    <div>
                      <div className="gensync-matrix-profile-title">{profile.name}</div>
                      <div className="gensync-matrix-profile-spiral">{profile.spiralColor}</div>
                    </div>
                  </div>
                  <div className="gensync-matrix-profile-label">DRIVER</div>
                  <div className="gensync-matrix-profile-driver">{translation.driver}</div>
                  <div className="gensync-matrix-profile-label">METAPHOR</div>
                  <div className="gensync-matrix-profile-metaphor">"{translation.metaphor}"</div>
                  <div className="gensync-matrix-profile-validation">
                    <div className="gensync-matrix-profile-validation-label">VALIDATION SCRIPT</div>
                    <div className="gensync-matrix-profile-validation-script">"{translation.validation}"</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Detector View */}
      {viewMode === 'detector' && (
        <div className="gensync-flex-col gensync-detector-root">
          <div>
            <label className="gensync-label">TEXT TO ANALYZE</label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text to detect the speaker's likely Human Operating System..."
              className="gensync-textarea gensync-detector-textarea"
            />
          </div>

          <button
            onClick={handleDetect}
            disabled={!inputText.trim()}
            className={`gensync-btn gensync-detect-btn${inputText.trim() ? '' : ' gensync-btn-disabled'}`}
          >
            🔍 Detect HumanOS
          </button>

          {detectionResult && (
            <div className="gensync-detect-result">
              <div className="gensync-detect-flex">
                {/* Primary OS */}
                <div className="gensync-detect-primary">
                  <div className="gensync-muted">PRIMARY DETECTION</div>
                  <div className="gensync-detect-primary-box">
                    <div className="gensync-detect-primary-emoji">{HUMAN_OS_PROFILES[detectionResult.primary].emoji}</div>
                    <div className="gensync-detect-primary-title">{HUMAN_OS_PROFILES[detectionResult.primary].name}</div>
                    <div className="gensync-detect-primary-spiral">{HUMAN_OS_PROFILES[detectionResult.primary].spiralColor}</div>
                    <div className="gensync-detect-primary-score">Score: {detectionResult.primaryScore}</div>
                  </div>
                </div>
                {/* Secondary OS */}
                <div className="gensync-detect-secondary">
                  <div className="gensync-muted">SECONDARY TRAIT</div>
                  <div className="gensync-detect-secondary-box">
                    <div className="gensync-detect-secondary-emoji">{HUMAN_OS_PROFILES[detectionResult.secondary].emoji}</div>
                    <div className="gensync-detect-secondary-title">{HUMAN_OS_PROFILES[detectionResult.secondary].name}</div>
                    <div className="gensync-detect-secondary-score">Score: {detectionResult.secondaryScore}</div>
                  </div>
                </div>
              </div>
              {/* All Scores */}
              <div className="gensync-detect-all-scores">
                <div className="gensync-muted">ALL SCORES</div>
                <div className="gensync-detect-all-scores-flex">
                  {Object.entries(detectionResult.allScores).map(([os, score]) => (
                    <div key={os} className="gensync-detect-score-box">
                      <div className="gensync-detect-score-emoji">{HUMAN_OS_PROFILES[os as HumanOS].emoji}</div>
                      <div className="gensync-detect-score-value">{score}</div>
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
