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

import React, { useState } from 'react';
import { HumanOSProfiles, type HumanOSType } from '../../config/god.config';
import { translateMessage } from '../../services/geodesic-engine';
import { VoltageBadge } from '../ui/VoltageIndicator';
import { useHeartbeatStore } from '../../stores/heartbeat.store';
import { MetabolismConfig } from '../../config/god.config';

interface TranslationComposerProps {
  initialText?: string;
  initialTarget?: HumanOSType;
  onClose?: () => void;
}

export const TranslationComposer: React.FC<TranslationComposerProps> = ({ 
  initialText = '', 
  initialTarget = 'guardian',
  onClose 
}) => {
  const [rawInput, setRawInput] = useState(initialText);
  const [targetOS, setTargetOS] = useState<HumanOSType>(initialTarget);
  const [translatedData, setTranslatedData] = useState<any>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  
  const updateSpoons = useHeartbeatStore(state => state.updateSpoons);

  const handleTranslate = async () => {
    if (!rawInput.trim()) return;
    
    setIsTranslating(true);
    // Cost for complex reply
    updateSpoons(-MetabolismConfig.costs.replyComplex);
    
    try {
      const result = await translateMessage({
        rawInput,
        targetOS,
      });
      setTranslatedData(result);
    } catch (error) {
      console.error('Translation failed', error);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div style={{
      background: '#1F2937',
      borderRadius: '12px',
      border: '1px solid #374151',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      maxHeight: '800px',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #374151',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#111827'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#F3F4F6', margin: 0 }}>
          Translation Composer
        </h2>
        {onClose && (
          <button 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#9CA3AF',
              cursor: 'pointer',
              fontSize: '20px'
            }}
          >
            ×
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Pane: Input */}
        <div style={{
          flex: 1,
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          borderRight: '1px solid #374151'
        }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#9CA3AF', marginBottom: '8px' }}>
              TARGET HUMAN OS
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '8px' }}>
              {(Object.values(HumanOSProfiles) as any[]).map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => setTargetOS(profile.id)}
                  style={{
                    padding: '8px',
                    borderRadius: '6px',
                    border: `1px solid ${targetOS === profile.id ? profile.spiralColor : '#374151'}`,
                    background: targetOS === profile.id ? `${profile.spiralColor}20` : '#374151',
                    color: '#F3F4F6',
                    cursor: 'pointer',
                    fontSize: '12px',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontWeight: 600 }}>{profile.name}</div>
                  <div style={{ fontSize: '10px', opacity: 0.7 }}>{profile.coreTheme}</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#9CA3AF', marginBottom: '8px' }}>
              YOUR DRAFT (RAW)
            </label>
            <textarea
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              placeholder="Type your response here..."
              style={{
                flex: 1,
                width: '100%',
                background: '#111827',
                border: '1px solid #374151',
                borderRadius: '8px',
                padding: '12px',
                color: '#F3F4F6',
                fontFamily: 'inherit',
                resize: 'none',
                minHeight: '200px'
              }}
            />
          </div>

          <button
            onClick={handleTranslate}
            disabled={isTranslating || !rawInput.trim()}
            style={{
              padding: '12px',
              background: isTranslating ? '#4B5563' : '#2563EB',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: isTranslating || !rawInput.trim() ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {isTranslating ? 'Translating...' : 'Translate Message'}
          </button>
        </div>

        {/* Right Pane: Output */}
        <div style={{
          flex: 1,
          padding: '20px',
          background: '#111827',
          overflowY: 'auto'
        }}>
          {translatedData ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '12px', color: '#9CA3AF' }}>
                    TRANSLATED OUTPUT
                  </label>
                  <VoltageBadge voltage={translatedData.outputVoltage} />
                </div>
                <div style={{
                  background: '#1F2937',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid #374151',
                  color: '#F3F4F6',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap'
                }}>
                  {translatedData.translated}
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <button
                    onClick={() => navigator.clipboard.writeText(translatedData.translated)}
                    style={{
                      padding: '6px 12px',
                      background: '#374151',
                      border: '1px solid #4B5563',
                      borderRadius: '4px',
                      color: '#D1D5DB',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Copy to Clipboard
                  </button>
                </div>
              </div>

              {translatedData.changes && translatedData.changes.length > 0 && (
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#9CA3AF', marginBottom: '8px' }}>
                    CHANGES MADE
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {translatedData.changes.map((change: any, i: number) => (
                      <div key={i} style={{
                        padding: '10px',
                        background: '#1F2937',
                        borderRadius: '6px',
                        fontSize: '13px'
                      }}>
                        <div style={{ color: '#F87171', textDecoration: 'line-through', marginBottom: '4px' }}>
                          {change.from}
                        </div>
                        <div style={{ color: '#34D399', fontWeight: 500, marginBottom: '4px' }}>
                          {change.to}
                        </div>
                        <div style={{ color: '#9CA3AF', fontSize: '11px', fontStyle: 'italic' }}>
                          Why: {change.reason}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {translatedData.notes && translatedData.notes.length > 0 && (
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#9CA3AF', marginBottom: '8px' }}>
                    NOTES
                  </label>
                  <ul style={{ 
                    margin: 0, 
                    paddingLeft: '20px', 
                    color: '#D1D5DB', 
                    fontSize: '13px' 
                  }}>
                    {translatedData.notes.map((note: string, i: number) => (
                      <li key={i}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#4B5563',
              textAlign: 'center',
              padding: '20px'
            }}>
              <div>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛡️</div>
                <p>Select a target HumanOS and translate your message to ensure safe reception.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
