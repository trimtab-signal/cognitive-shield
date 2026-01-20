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
 * ║   SYSTEMS PANEL                                                           ║
 * ║   Display All Genesis Gate Validated Systems                              ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from 'react';
import { GPIO_ALLOCATION, RF_PROPAGATION, MESH_PROTOCOL_COMPARISON, DEVICE_INFO, getGPIOStatus } from '../../config/phenix-hardware';
import { GENUS_PROTOCOL } from '../../config/genus-entrainment';
import { GENSYNC_PROMPTS, VMEME_COLORS, type HumanOSType } from '../../config/gensync-prompts';
import { analyzeVoltage, getVoltageStrip } from '../../lib/catchers-mitt';

type SystemTab = 'hardware' | 'entrainment' | 'gensync' | 'buffer' | 'totem';

export function SystemsPanel() {
  const [activeSystem, setActiveSystem] = useState<SystemTab>('hardware');
  
  const systems = [
    { id: 'hardware', label: '🔧 Hardware', icon: '📡' },
    { id: 'entrainment', label: '🧠 40Hz GENUS', icon: '🧠' },
    { id: 'gensync', label: '🌀 GenSync', icon: '🌀' },
    { id: 'buffer', label: '🧤 Mitt', icon: '🧤' },
    { id: 'totem', label: '📱 Totem', icon: '📱' },
  ] as const;

  return (
    <div style={{ minHeight: '100%' }}>
      {/* System Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '20px',
        flexWrap: 'wrap',
      }}>
        {systems.map(sys => (
          <button
            key={sys.id}
            onClick={() => setActiveSystem(sys.id as SystemTab)}
            style={{
              padding: '8px 16px',
              background: activeSystem === sys.id ? '#00B4D8' : '#1F2937',
              border: '1px solid',
              borderColor: activeSystem === sys.id ? '#00B4D8' : '#374151',
              borderRadius: '8px',
              color: activeSystem === sys.id ? '#000' : '#9CA3AF',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            {sys.label}
          </button>
        ))}
      </div>

      {/* System Content */}
      {activeSystem === 'hardware' && <HardwarePanel />}
      {activeSystem === 'entrainment' && <EntrainmentPanel />}
      {activeSystem === 'gensync' && <GenSyncPanel />}
      {activeSystem === 'buffer' && <BufferPanel />}
      {activeSystem === 'totem' && <TotemPanel />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// HARDWARE PANEL - ESP32-S3 GPIO & RF Config
// ═══════════════════════════════════════════════════════════════════════════

function HardwarePanel() {
  const [selectedPin, setSelectedPin] = useState<number | null>(null);
  
  return (
    <div>
      <SectionHeader 
        title="Phenix Phantom Hardware" 
        subtitle={`${DEVICE_INFO.board} • ${DEVICE_INFO.processor}`}
      />
      
      {/* Device Info */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        marginBottom: '24px',
      }}>
        <InfoCard label="RF Module" value={DEVICE_INFO.rfModule} />
        <InfoCard label="Band" value={DEVICE_INFO.rfBand} />
        <InfoCard label="Link Budget" value={DEVICE_INFO.rfLinkBudget} />
      </div>

      {/* GPIO Pin Map */}
      <SubsectionHeader title="GPIO Allocation Map" />
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(8, 1fr)',
        gap: '6px',
        marginBottom: '16px',
      }}>
        {Array.from({ length: 48 }, (_, i) => i + 1).map(pin => {
          const status = getGPIOStatus(pin);
          const isSelected = selectedPin === pin;
          let bgColor = '#374151';
          
          if (status.includes('FORBIDDEN')) bgColor = '#7F1D1D';
          else if (status.includes('LCD')) bgColor = '#1E3A5F';
          else if (status.includes('I2C')) bgColor = '#3B0764';
          else if (status.includes('LoRa')) bgColor = '#14532D';
          else if (status.includes('AVAILABLE')) bgColor = '#064E3B';
          else if (status.includes('CAUTION')) bgColor = '#78350F';
          
          return (
            <button
              key={pin}
              onClick={() => setSelectedPin(isSelected ? null : pin)}
              style={{
                padding: '8px 4px',
                background: bgColor,
                border: isSelected ? '2px solid #00B4D8' : '1px solid #4B5563',
                borderRadius: '4px',
                color: '#E5E7EB',
                fontSize: '11px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              {pin}
            </button>
          );
        })}
      </div>
      
      {selectedPin !== null && (
        <div style={{
          padding: '12px',
          background: '#1F2937',
          borderRadius: '8px',
          border: '1px solid #374151',
          marginBottom: '16px',
        }}>
          <strong>GPIO {selectedPin}:</strong> {getGPIOStatus(selectedPin)}
        </div>
      )}

      {/* LoRa Recommended Pins */}
      <SubsectionHeader title="Recommended LoRa SX1262 Mapping" />
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '8px',
        marginBottom: '24px',
      }}>
        <InfoCard label="MISO" value={`GPIO ${GPIO_ALLOCATION.LORA_SX1262.MISO}`} />
        <InfoCard label="MOSI" value={`GPIO ${GPIO_ALLOCATION.LORA_SX1262.MOSI}`} />
        <InfoCard label="CLK" value={`GPIO ${GPIO_ALLOCATION.LORA_SX1262.CLK}`} />
        <InfoCard label="CS" value={`GPIO ${GPIO_ALLOCATION.LORA_SX1262.NSS_CS}`} />
      </div>

      {/* RF Propagation */}
      <SubsectionHeader title="RF Propagation: 915 MHz Advantage" />
      <p style={{ color: '#9CA3AF', fontSize: '13px', marginBottom: '12px' }}>
        {RF_PROPAGATION.recommendation}
      </p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '8px',
      }}>
        {Object.entries(RF_PROPAGATION.pathLoss).map(([distance, data]) => (
          <div key={distance} style={{
            padding: '12px',
            background: '#1F2937',
            borderRadius: '8px',
            border: '1px solid #374151',
          }}>
            <div style={{ color: '#9CA3AF', fontSize: '11px' }}>{distance}</div>
            <div style={{ color: '#10B981', fontSize: '16px', fontWeight: 600 }}>
              +{data.advantage} dB
            </div>
          </div>
        ))}
      </div>

      {/* Mesh Protocol Comparison */}
      <SubsectionHeader title="Mesh Protocol: Reticulum vs Meshtastic" />
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
      }}>
        <ProtocolCard 
          name="Reticulum (Recommended)" 
          data={MESH_PROTOCOL_COMPARISON.reticulum}
          recommended
        />
        <ProtocolCard 
          name="Meshtastic" 
          data={MESH_PROTOCOL_COMPARISON.meshtastic}
        />
      </div>
    </div>
  );
}

function ProtocolCard({ name, data, recommended }: { 
  name: string; 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any; 
  recommended?: boolean 
}) {
  return (
    <div style={{
      padding: '16px',
      background: recommended ? '#064E3B' : '#1F2937',
      borderRadius: '12px',
      border: `1px solid ${recommended ? '#10B981' : '#374151'}`,
    }}>
      <h4 style={{ 
        color: recommended ? '#10B981' : '#E5E7EB', 
        marginBottom: '12px',
        fontSize: '14px',
      }}>
        {name}
      </h4>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '12px' }}>
        <li style={{ marginBottom: '4px' }}>
          <span style={{ color: '#9CA3AF' }}>Forward Secrecy:</span>{' '}
          <span style={{ color: '#E5E7EB' }}>{data.forwardSecrecy}</span>
        </li>
        <li style={{ marginBottom: '4px' }}>
          <span style={{ color: '#9CA3AF' }}>Anonymity:</span>{' '}
          <span style={{ color: data.initiatorAnonymity ? '#10B981' : '#EF4444' }}>
            {data.initiatorAnonymity ? '✓ Yes' : '✗ No'}
          </span>
        </li>
        <li>
          <span style={{ color: '#9CA3AF' }}>Sovereignty:</span>{' '}
          <span style={{ color: '#F59E0B' }}>{data.sovereignty}</span>
        </li>
      </ul>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 40Hz GENUS ENTRAINMENT PANEL
// ═══════════════════════════════════════════════════════════════════════════

function EntrainmentPanel() {
  const [isPlaying, setIsPlaying] = useState(false);
  
  return (
    <div>
      <SectionHeader 
        title="40Hz GENUS Entrainment Protocol" 
        subtitle="MIT Li-Huei Tsai Laboratory Validated"
      />
      
      <div style={{
        padding: '20px',
        background: 'linear-gradient(135deg, #1E3A5F 0%, #0F172A 100%)',
        borderRadius: '16px',
        border: '1px solid #00B4D8',
        marginBottom: '24px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🧠</div>
        <h3 style={{ color: '#00B4D8', fontSize: '24px', marginBottom: '8px' }}>
          40 Hz Gamma Entrainment
        </h3>
        <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '20px' }}>
          Binaural: {GENUS_PROTOCOL.binaural.primary.leftEar}Hz / {GENUS_PROTOCOL.binaural.primary.rightEar}Hz
        </p>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          style={{
            padding: '16px 48px',
            background: isPlaying ? '#EF4444' : '#10B981',
            border: 'none',
            borderRadius: '12px',
            color: '#FFF',
            fontSize: '18px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {isPlaying ? '⏹ Stop Session' : '▶ Start Session'}
        </button>
      </div>

      {/* Session Config */}
      <SubsectionHeader title="Session Protocol" />
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        marginBottom: '24px',
      }}>
        <InfoCard 
          label="Duration" 
          value={`${GENUS_PROTOCOL.session.duration.optimal} min`} 
        />
        <InfoCard 
          label="Fade Ramp" 
          value={`${GENUS_PROTOCOL.session.ramp.fadeIn}s`} 
        />
        <InfoCard 
          label="Volume" 
          value={`${GENUS_PROTOCOL.session.volume.recommended.min}-${GENUS_PROTOCOL.session.volume.recommended.max} dB`} 
        />
      </div>

      {/* Quantum Biology */}
      <SubsectionHeader title="Quantum Biology Connection (Fisher-Escolà)" />
      <div style={{
        padding: '16px',
        background: '#1F2937',
        borderRadius: '12px',
        border: '1px solid #374151',
        marginBottom: '16px',
      }}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
          <div style={{
            padding: '8px 12px',
            background: '#7C3AED20',
            borderRadius: '6px',
            color: '#A78BFA',
            fontSize: '12px',
          }}>
            DOI: {GENUS_PROTOCOL.quantumBiology.validation.doi}
          </div>
          <div style={{
            padding: '8px 12px',
            background: '#10B98120',
            borderRadius: '6px',
            color: '#10B981',
            fontSize: '12px',
          }}>
            PNAS 2025
          </div>
        </div>
        <p style={{ color: '#E5E7EB', fontSize: '13px', lineHeight: 1.6 }}>
          <strong>Posner Molecule ({GENUS_PROTOCOL.quantumBiology.posnerMolecule.formula}):</strong>{' '}
          {GENUS_PROTOCOL.quantumBiology.posnerMolecule.description}
        </p>
        <p style={{ color: '#9CA3AF', fontSize: '12px', marginTop: '8px' }}>
          <strong>Finding:</strong> {GENUS_PROTOCOL.quantumBiology.validation.finding}
        </p>
      </div>

      {/* HRV Coherence */}
      <SubsectionHeader title="Green Coherence (HRV 0.1 Hz)" />
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
      }}>
        <InfoCard 
          label="Breathing Rate" 
          value={`${GENUS_PROTOCOL.hrvCoherence.breathingProtocol.rate} breaths/min`} 
        />
        <InfoCard 
          label="Inhale/Exhale" 
          value={`${GENUS_PROTOCOL.hrvCoherence.breathingProtocol.inhale}s / ${GENUS_PROTOCOL.hrvCoherence.breathingProtocol.exhale}s`} 
        />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// GENSYNC MATRIX PANEL
// ═══════════════════════════════════════════════════════════════════════════

function GenSyncPanel() {
  const [selectedOS, setSelectedOS] = useState<HumanOSType>('guardian');
  const osTypes: Exclude<HumanOSType, 'integrator'>[] = ['guardian', 'order', 'achiever', 'empath'];
  
  const osLabels: Record<typeof osTypes[number], { emoji: string; color: string; name: string }> = {
    guardian: { emoji: '🛡️', color: '#EF4444', name: 'Guardian (Red/Purple)' },
    order: { emoji: '⚖️', color: '#3B82F6', name: 'Order (Blue)' },
    achiever: { emoji: '🏆', color: '#F97316', name: 'Achiever (Orange)' },
    empath: { emoji: '💚', color: '#10B981', name: 'Empath (Green)' },
  };

  return (
    <div>
      <SectionHeader 
        title="GenSync Translation Matrix" 
        subtitle="Spiral Dynamics Communication Prompts"
      />

      {/* vMEME Color Legend */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '20px',
        flexWrap: 'wrap',
      }}>
        {Object.entries(VMEME_COLORS).map(([color, data]) => (
          <div key={color} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            background: '#1F2937',
            borderRadius: '20px',
            fontSize: '11px',
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: data.hex,
            }} />
            <span style={{ color: '#9CA3AF' }}>{data.name}</span>
          </div>
        ))}
      </div>

      {/* OS Selector */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
        marginBottom: '20px',
      }}>
        {osTypes.map(os => {
          const info = osLabels[os];
          const isSelected = selectedOS === os;
          
          return (
            <button
              key={os}
              onClick={() => setSelectedOS(os)}
              style={{
                padding: '16px',
                background: isSelected ? `${info.color}20` : '#1F2937',
                border: `2px solid ${isSelected ? info.color : '#374151'}`,
                borderRadius: '12px',
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{info.emoji}</div>
              <div style={{ color: info.color, fontSize: '12px', fontWeight: 600 }}>
                {info.name}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected OS Prompt */}
      {selectedOS !== 'integrator' && (
        <div style={{
          padding: '20px',
          background: '#1F2937',
          borderRadius: '12px',
          border: '1px solid #374151',
        }}>
          <h4 style={{ 
            color: osLabels[selectedOS as keyof typeof osLabels].color, 
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            {osLabels[selectedOS as keyof typeof osLabels].emoji}
            {osLabels[selectedOS as keyof typeof osLabels].name} System Prompt
          </h4>
          <pre style={{
            background: '#111827',
            padding: '16px',
            borderRadius: '8px',
            overflow: 'auto',
            maxHeight: '400px',
            fontSize: '12px',
            lineHeight: 1.6,
            color: '#E5E7EB',
            whiteSpace: 'pre-wrap',
          }}>
            {GENSYNC_PROMPTS[selectedOS as keyof typeof GENSYNC_PROMPTS]}
          </pre>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CATCHER'S MITT BUFFER PANEL
// ═══════════════════════════════════════════════════════════════════════════

function BufferPanel() {
  const [testMessage, setTestMessage] = useState('');
  const [analysis, setAnalysis] = useState<ReturnType<typeof analyzeVoltage> | null>(null);
  const [voltageStrip, setVoltageStrip] = useState<ReturnType<typeof getVoltageStrip> | null>(null);

  const handleAnalyze = () => {
    if (!testMessage) return;
    const result = analyzeVoltage(testMessage);
    setAnalysis(result);
    setVoltageStrip(getVoltageStrip(result.voltage));
  };

  return (
    <div>
      <SectionHeader 
        title="Catcher's Mitt" 
        subtitle="60-Second Message Buffering & Voltage Protection"
      />

      {/* Voltage Strip Demo */}
      {voltageStrip && (
        <div style={{
          padding: '20px',
          background: 'linear-gradient(135deg, #1F2937 0%, #111827 100%)',
          borderRadius: '16px',
          border: `2px solid ${
            voltageStrip.color === 'green' ? '#10B981' :
            voltageStrip.color === 'yellow' ? '#F59E0B' :
            voltageStrip.color === 'orange' ? '#F97316' : '#EF4444'
          }`,
          marginBottom: '24px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ 
                fontSize: '48px', 
                fontWeight: 700,
                color: voltageStrip.color === 'green' ? '#10B981' :
                       voltageStrip.color === 'yellow' ? '#F59E0B' :
                       voltageStrip.color === 'orange' ? '#F97316' : '#EF4444'
              }}>
                {Math.round(voltageStrip.current)}V
              </div>
              <div style={{ color: '#9CA3AF', fontSize: '14px' }}>
                {voltageStrip.label}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#6B7280', fontSize: '12px' }}>Trend</div>
              <div style={{ fontSize: '24px' }}>
                {voltageStrip.trend === 'rising' ? '📈' : 
                 voltageStrip.trend === 'falling' ? '📉' : '➡️'}
              </div>
            </div>
          </div>
          
          {/* Voltage Bar */}
          <div style={{
            height: '8px',
            background: '#374151',
            borderRadius: '4px',
            overflow: 'hidden',
            marginTop: '16px',
          }}>
            <div style={{
              height: '100%',
              width: `${voltageStrip.current}%`,
              background: `linear-gradient(90deg, #10B981, #F59E0B, #EF4444)`,
              borderRadius: '4px',
              transition: 'width 0.3s ease',
            }} />
          </div>
        </div>
      )}

      {/* Analysis Details */}
      {analysis && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          marginBottom: '24px',
        }}>
          <InfoCard label="Voltage" value={`${Math.round(analysis.voltage)}%`} />
          <InfoCard label="Entropy" value={`${(analysis.entropy * 100).toFixed(1)}%`} />
          <InfoCard label="Toxicity" value={`${(analysis.toxicity * 100).toFixed(1)}%`} />
        </div>
      )}

      {/* Test Input */}
      <SubsectionHeader title="Test Voltage Analysis" />
      <textarea
        value={testMessage}
        onChange={(e) => setTestMessage(e.target.value)}
        placeholder="Paste a message to analyze its emotional voltage..."
        style={{
          width: '100%',
          padding: '16px',
          background: '#1F2937',
          border: '1px solid #374151',
          borderRadius: '8px',
          color: '#E5E7EB',
          fontSize: '14px',
          minHeight: '120px',
          resize: 'vertical',
          marginBottom: '12px',
        }}
      />
      <button
        onClick={handleAnalyze}
        disabled={!testMessage}
        style={{
          width: '100%',
          padding: '12px',
          background: testMessage ? '#00B4D8' : '#374151',
          border: 'none',
          borderRadius: '8px',
          color: '#FFF',
          fontSize: '14px',
          fontWeight: 500,
          cursor: testMessage ? 'pointer' : 'not-allowed',
        }}
      >
        ⚡ Analyze Voltage
      </button>

      {/* Buffer Thresholds */}
      <SubsectionHeader title="Buffer Thresholds" />
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
      }}>
        <ThresholdCard level="Green" threshold={30} color="#10B981" action="Auto-release" />
        <ThresholdCard level="Yellow" threshold={50} color="#F59E0B" action="Buffer 60s" />
        <ThresholdCard level="Red" threshold={70} color="#F97316" action="Sanitize" />
        <ThresholdCard level="Critical" threshold={90} color="#EF4444" action="Escalate" />
      </div>
    </div>
  );
}

function ThresholdCard({ level, threshold, color, action }: {
  level: string;
  threshold: number;
  color: string;
  action: string;
}) {
  return (
    <div style={{
      padding: '16px',
      background: `${color}10`,
      border: `1px solid ${color}40`,
      borderRadius: '12px',
      textAlign: 'center',
    }}>
      <div style={{ color, fontSize: '24px', fontWeight: 700 }}>{threshold}</div>
      <div style={{ color, fontSize: '12px', fontWeight: 600 }}>{level}</div>
      <div style={{ color: '#9CA3AF', fontSize: '11px', marginTop: '4px' }}>{action}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TOTEM SYNC PANEL
// ═══════════════════════════════════════════════════════════════════════════

function TotemPanel() {
  return (
    <div>
      <SectionHeader 
        title="Totem Sync Protocol" 
        subtitle="4-Layer Mobile Mesh Integration Stack"
      />

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px',
      }}>
        <LayerCard 
          layer={0}
          name="Physics"
          subtitle="Inverse Square Law / BLE Proximity"
          description="RSSI-to-distance conversion using Log-Distance Path Loss Model"
          color="#F97316"
        />
        <LayerCard 
          layer={1}
          name="Handshake"
          subtitle="Phenix Token / HSM-signed TOTP"
          description="Cryptographic authentication with Ed25519 signatures"
          color="#3B82F6"
        />
        <LayerCard 
          layer={2}
          name="Transport"
          subtitle="WebRTC Data Channels"
          description="P2P encrypted communication with DTLS"
          color="#10B981"
        />
        <LayerCard 
          layer={3}
          name="Convergence"
          subtitle="Yjs CRDTs"
          description="Conflict-free replicated data types for mesh sync"
          color="#7C3AED"
        />
      </div>

      <div style={{ marginTop: '24px' }}>
        <LayerCard 
          layer={4}
          name="Persistence"
          subtitle="PGLite Sovereignty"
          description="Local-first sovereign data vault with Care Events, Proximity Logs, and Token storage"
          color="#00B4D8"
          fullWidth
        />
      </div>

      {/* Care Score Formula */}
      <SubsectionHeader title="Proof of Care Formula" />
      <div style={{
        padding: '20px',
        background: '#1F2937',
        borderRadius: '12px',
        border: '1px solid #374151',
        textAlign: 'center',
      }}>
        <code style={{
          fontSize: '18px',
          color: '#10B981',
          fontFamily: 'monospace',
        }}>
          Care_Score = Σ(T_prox × Q_res) + Tasks_verified
        </code>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          marginTop: '20px',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#00B4D8', fontWeight: 600 }}>T_prox</div>
            <div style={{ color: '#9CA3AF', fontSize: '12px' }}>Time Proximity (BLE hours)</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#10B981', fontWeight: 600 }}>Q_res</div>
            <div style={{ color: '#9CA3AF', fontSize: '12px' }}>Quality Resonance (HRV sync)</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#F59E0B', fontWeight: 600 }}>Tasks_verified</div>
            <div style={{ color: '#9CA3AF', fontSize: '12px' }}>Phenix-signed actions</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LayerCard({ layer, name, subtitle, description, color, fullWidth }: {
  layer: number;
  name: string;
  subtitle: string;
  description: string;
  color: string;
  fullWidth?: boolean;
}) {
  return (
    <div style={{
      padding: '20px',
      background: `${color}10`,
      border: `1px solid ${color}40`,
      borderRadius: '12px',
      gridColumn: fullWidth ? '1 / -1' : undefined,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '8px',
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFF',
          fontWeight: 700,
        }}>
          {layer}
        </div>
        <div>
          <div style={{ color, fontWeight: 600 }}>{name}</div>
          <div style={{ color: '#9CA3AF', fontSize: '12px' }}>{subtitle}</div>
        </div>
      </div>
      <p style={{ color: '#E5E7EB', fontSize: '13px', margin: 0 }}>{description}</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <h2 style={{ fontSize: '22px', color: '#F3F4F6', marginBottom: '4px' }}>{title}</h2>
      <p style={{ color: '#9CA3AF', fontSize: '14px', margin: 0 }}>{subtitle}</p>
    </div>
  );
}

function SubsectionHeader({ title }: { title: string }) {
  return (
    <h3 style={{ 
      fontSize: '14px', 
      color: '#9CA3AF', 
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      marginTop: '24px',
      marginBottom: '12px',
    }}>
      {title}
    </h3>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      padding: '12px',
      background: '#1F2937',
      borderRadius: '8px',
      border: '1px solid #374151',
    }}>
      <div style={{ color: '#9CA3AF', fontSize: '11px', marginBottom: '4px' }}>{label}</div>
      <div style={{ color: '#E5E7EB', fontSize: '14px', fontWeight: 500 }}>{value}</div>
    </div>
  );
}

export default SystemsPanel;
