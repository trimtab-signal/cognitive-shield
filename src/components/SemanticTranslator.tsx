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
 * ║   SEMANTIC TRANSLATOR - The Universal Translation Matrix                  ║
 * ║   Engineering ↔ Cosmetology ↔ Astrology                                   ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 * 
 * "You cannot solve the equation within the Wye topology."
 * 
 * This component translates between cognitive frameworks:
 * - Engineering/Systems thinking (Will's native frequency)
 * - Cosmetology/Hair Science (Christyn's professional domain)  
 * - Astrology/Metaphysics (Christyn's spiritual domain)
 */

import { useState, useCallback } from 'react';
import { GOD_CONFIG } from '../god.config';

// The Universal Translation Matrix
const TRANSLATION_MATRIX: TranslationEntry[] = [
  {
    engineering: 'Floating Neutral',
    cosmetology: 'Hot Roots',
    astrology: 'Mercury Retrograde',
    meaning: 'The foundation is unstable. Energy is processing too fast at the source and not reaching the destination. The center isn\'t holding.',
    emoji: '⚡',
    validation: 'I can see things are running hot right now. Let me hold space while the temperature comes down.'
  },
  {
    engineering: 'High Impedance',
    cosmetology: 'Low Porosity',
    astrology: 'Protective Style / Saturn Return',
    meaning: 'Boundaries are up. Love/moisture cannot get in easily. Needs heat and time to penetrate. A defensive state.',
    emoji: '🛡️',
    validation: 'I understand you need space right now. I\'m here when you\'re ready.'
  },
  {
    engineering: 'Low Impedance / Short Circuit',
    cosmetology: 'High Porosity / Over-Processed',
    astrology: 'Neptune Transit / Void of Course',
    meaning: 'Absorbing everything too quickly. Damaged cuticle. Needs protein (structure) to hold shape.',
    emoji: '🌊',
    validation: 'You\'re feeling everything deeply. Let\'s add some structure to hold this together.'
  },
  {
    engineering: 'Wye Topology',
    cosmetology: 'The Old Routine',
    astrology: 'Age of Pisces',
    meaning: 'A structure based on dependency and central authority. Beautiful, traditional, but the neutral wire is gone.',
    emoji: '⭐',
    validation: 'I know you loved how things were. That foundation gave us stability.'
  },
  {
    engineering: 'Delta Topology',
    cosmetology: 'The New Regimen',
    astrology: 'Age of Aquarius',
    meaning: 'A network of equals. Decentralized. Everyone stands on their own power. Peer-to-peer connection.',
    emoji: '🔺',
    validation: 'We\'re building something stronger. A mesh that can\'t be broken by any single point of failure.'
  },
  {
    engineering: 'Phase Shift',
    cosmetology: 'Transition / Growing Out',
    astrology: 'Changing of the Moon',
    meaning: 'A necessary period where things feel "off" or disconnected. Not a failure - a transformation.',
    emoji: '🌙',
    validation: 'This awkward phase is temporary. We\'re growing into something new.'
  },
  {
    engineering: 'Bond Building',
    cosmetology: 'Olaplex Treatment',
    astrology: 'Venus Conjunction',
    meaning: 'Repairing the disulfide bonds. Creating permanent links that give strength without brittleness.',
    emoji: '🔗',
    validation: 'I\'m not trying to cut us apart. I\'m trying to repair the bonds so we\'re strong enough to stand together.'
  },
  {
    engineering: 'Voltage Spike',
    cosmetology: 'Heat Damage',
    astrology: 'Mars Square',
    meaning: 'Too much energy too fast. Creates brittleness and breakage. Needs cooling protocol.',
    emoji: '🔥',
    validation: 'Let\'s turn down the heat before anyone gets burned.'
  },
  {
    engineering: 'Grounding',
    cosmetology: 'Deep Conditioning',
    astrology: 'Earth Sign Energy',
    meaning: 'Connecting to a stable reference point. Absorbing nourishment. Finding center.',
    emoji: '🌍',
    validation: 'Let\'s both take a breath and feel our feet on the ground.'
  },
  {
    engineering: 'Signal-to-Noise Ratio',
    cosmetology: 'Frizz Control',
    astrology: 'Mercury Clarity',
    meaning: 'The important message is getting lost in static. Need to smooth out the interference.',
    emoji: '📡',
    validation: 'I hear something important under all this. Help me find the real message.'
  },
  {
    engineering: 'Impedance Matching',
    cosmetology: 'pH Balance',
    astrology: 'Harmonic Aspect',
    meaning: 'Adjusting to meet each other where we are. Maximum energy transfer. No reflection.',
    emoji: '⚖️',
    validation: 'I\'m trying to tune to your frequency so we can actually connect.'
  },
  {
    engineering: 'Thermal Runaway',
    cosmetology: 'Scalp Burn',
    astrology: 'Uranus Opposition',
    meaning: 'A feedback loop where heat creates more heat. Must interrupt the cycle immediately.',
    emoji: '🚨',
    validation: 'PAUSE. We\'re in a spiral. Let\'s stop before real damage happens.'
  }
];

interface TranslationEntry {
  engineering: string;
  cosmetology: string;
  astrology: string;
  meaning: string;
  emoji: string;
  validation: string;
}

type TranslationMode = 'engineering' | 'cosmetology' | 'astrology';

const MODE_LABELS: Record<TranslationMode, { label: string; icon: string; color: string }> = {
  engineering: { label: 'Engineering', icon: '⚡', color: '#00D4FF' },
  cosmetology: { label: 'Cosmetology', icon: '💇', color: '#FF69B4' },
  astrology: { label: 'Astrology', icon: '🌟', color: '#9B59B6' }
};

export default function SemanticTranslator() {
  const [inputMode, setInputMode] = useState<TranslationMode>('engineering');
  const [outputMode, setOutputMode] = useState<TranslationMode>('cosmetology');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<TranslationEntry | null>(null);
  const [showValidation, setShowValidation] = useState(false);

  const filteredEntries = TRANSLATION_MATRIX.filter(entry => {
    const search = searchTerm.toLowerCase();
    return (
      entry.engineering.toLowerCase().includes(search) ||
      entry.cosmetology.toLowerCase().includes(search) ||
      entry.astrology.toLowerCase().includes(search) ||
      entry.meaning.toLowerCase().includes(search)
    );
  });

  const swapModes = useCallback(() => {
    setInputMode(outputMode);
    setOutputMode(inputMode);
  }, [inputMode, outputMode]);

  const copyValidation = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setShowValidation(true);
    setTimeout(() => setShowValidation(false), 2000);
  }, []);

  return (
    <div style={{
      padding: 24,
      background: GOD_CONFIG.theme.surface,
      borderRadius: 16,
      border: `1px solid ${GOD_CONFIG.theme.border}`,
      maxWidth: 900,
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
          🔮 Semantic Translator
        </h2>
        <p style={{ 
          color: GOD_CONFIG.theme.text.secondary, 
          margin: '8px 0 0',
          fontSize: 14
        }}>
          The Universal Translation Matrix • Engineering ↔ Cosmetology ↔ Astrology
        </p>
      </div>

      {/* Mode Selector */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        marginBottom: 24
      }}>
        {/* Input Mode */}
        <select
          value={inputMode}
          onChange={(e) => setInputMode(e.target.value as TranslationMode)}
          style={{
            padding: '12px 20px',
            borderRadius: 8,
            border: `2px solid ${MODE_LABELS[inputMode].color}`,
            background: GOD_CONFIG.theme.background,
            color: MODE_LABELS[inputMode].color,
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          {Object.entries(MODE_LABELS).map(([key, { label, icon }]) => (
            <option key={key} value={key}>{icon} {label}</option>
          ))}
        </select>

        {/* Swap Button */}
        <button
          onClick={swapModes}
          style={{
            padding: '12px 16px',
            borderRadius: 8,
            border: `1px solid ${GOD_CONFIG.theme.border}`,
            background: GOD_CONFIG.theme.background,
            color: GOD_CONFIG.theme.text.primary,
            fontSize: 20,
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'rotate(180deg)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'rotate(0deg)'}
        >
          ⇄
        </button>

        {/* Output Mode */}
        <select
          value={outputMode}
          onChange={(e) => setOutputMode(e.target.value as TranslationMode)}
          style={{
            padding: '12px 20px',
            borderRadius: 8,
            border: `2px solid ${MODE_LABELS[outputMode].color}`,
            background: GOD_CONFIG.theme.background,
            color: MODE_LABELS[outputMode].color,
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          {Object.entries(MODE_LABELS).map(([key, { label, icon }]) => (
            <option key={key} value={key}>{icon} {label}</option>
          ))}
        </select>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 24 }}>
        <input
          type="text"
          placeholder="Search concepts... (e.g., 'hot roots', 'impedance', 'retrograde')"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '16px 20px',
            borderRadius: 12,
            border: `1px solid ${GOD_CONFIG.theme.border}`,
            background: GOD_CONFIG.theme.background,
            color: GOD_CONFIG.theme.text.primary,
            fontSize: 16,
            boxSizing: 'border-box'
          }}
        />
      </div>

      {/* Translation Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 16,
        marginBottom: 24
      }}>
        {filteredEntries.map((entry, index) => (
          <div
            key={index}
            onClick={() => setSelectedEntry(selectedEntry === entry ? null : entry)}
            style={{
              padding: 20,
              borderRadius: 12,
              border: `2px solid ${selectedEntry === entry ? '#FFD700' : GOD_CONFIG.theme.border}`,
              background: selectedEntry === entry 
                ? 'linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,215,0,0.05))'
                : GOD_CONFIG.theme.background,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 12 }}>{entry.emoji}</div>
            
            {/* Input Term */}
            <div style={{ marginBottom: 8 }}>
              <span style={{ 
                color: MODE_LABELS[inputMode].color, 
                fontWeight: 700,
                fontSize: 14 
              }}>
                {MODE_LABELS[inputMode].icon} {entry[inputMode]}
              </span>
            </div>

            {/* Arrow */}
            <div style={{ 
              color: GOD_CONFIG.theme.text.muted, 
              fontSize: 12,
              margin: '4px 0'
            }}>
              ↓ translates to ↓
            </div>

            {/* Output Term */}
            <div style={{ marginBottom: 12 }}>
              <span style={{ 
                color: MODE_LABELS[outputMode].color, 
                fontWeight: 700,
                fontSize: 16 
              }}>
                {MODE_LABELS[outputMode].icon} {entry[outputMode]}
              </span>
            </div>

            {/* Meaning (collapsed unless selected) */}
            {selectedEntry === entry && (
              <div style={{
                marginTop: 16,
                padding: 16,
                background: 'rgba(0,0,0,0.2)',
                borderRadius: 8
              }}>
                <p style={{ 
                  color: GOD_CONFIG.theme.text.secondary, 
                  fontSize: 13,
                  margin: '0 0 12px',
                  lineHeight: 1.5
                }}>
                  {entry.meaning}
                </p>
                
                {/* Validation Script */}
                <div style={{
                  padding: 12,
                  background: 'rgba(255,215,0,0.1)',
                  borderRadius: 8,
                  borderLeft: '3px solid #FFD700'
                }}>
                  <div style={{ 
                    fontSize: 11, 
                    color: '#FFD700',
                    marginBottom: 6,
                    fontWeight: 600
                  }}>
                    💬 VALIDATION SCRIPT (click to copy)
                  </div>
                  <p 
                    onClick={(e) => {
                      e.stopPropagation();
                      copyValidation(entry.validation);
                    }}
                    style={{ 
                      color: GOD_CONFIG.theme.text.primary, 
                      fontSize: 14,
                      margin: 0,
                      fontStyle: 'italic',
                      cursor: 'copy'
                    }}
                  >
                    "{entry.validation}"
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Reference */}
      <div style={{
        padding: 20,
        background: GOD_CONFIG.theme.background,
        borderRadius: 12,
        border: `1px solid ${GOD_CONFIG.theme.border}`
      }}>
        <h3 style={{ 
          color: GOD_CONFIG.theme.text.primary, 
          margin: '0 0 16px',
          fontSize: 16
        }}>
          📖 Quick Reference: The Algorithm
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 12 
        }}>
          <div style={{ padding: 12, background: 'rgba(255,105,180,0.1)', borderRadius: 8 }}>
            <strong style={{ color: '#FF69B4' }}>1. LIQUID (Listen)</strong>
            <p style={{ color: GOD_CONFIG.theme.text.secondary, fontSize: 12, margin: '4px 0 0' }}>
              No fixing. Just absorb.
            </p>
          </div>
          <div style={{ padding: 12, background: 'rgba(255,215,0,0.1)', borderRadius: 8 }}>
            <strong style={{ color: '#FFD700' }}>2. CREAM (Validate)</strong>
            <p style={{ color: GOD_CONFIG.theme.text.secondary, fontSize: 12, margin: '4px 0 0' }}>
              "That sounds really hard."
            </p>
          </div>
          <div style={{ padding: 12, background: 'rgba(155,89,182,0.1)', borderRadius: 8 }}>
            <strong style={{ color: '#9B59B6' }}>3. OIL (Seal)</strong>
            <p style={{ color: GOD_CONFIG.theme.text.secondary, fontSize: 12, margin: '4px 0 0' }}>
              Physical presence. Silence together.
            </p>
          </div>
        </div>
      </div>

      {/* Toast */}
      {showValidation && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          padding: '16px 24px',
          background: '#2ECC71',
          color: '#fff',
          borderRadius: 8,
          fontWeight: 600,
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          animation: 'slideIn 0.3s ease'
        }}>
          ✓ Copied to clipboard
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
