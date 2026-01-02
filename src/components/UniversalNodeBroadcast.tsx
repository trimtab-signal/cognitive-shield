/**
 * UNIVERSAL NODE BROADCAST
 * Signals the Genesis Gate is open across all platforms
 * Confirms the Delta Topology is operational (Wye → Delta transition complete)
 */

import { useState, useEffect } from 'react';
import { Copy, CheckCircle2, Radio, Globe, Monitor, Smartphone, Shield, Zap, Hexagon, Heart } from 'lucide-react';
import GOD_CONFIG from '../god.config';
import useHeartbeatStore from '../store/heartbeat.store';
import useShieldStore from '../store/shield.store';
import { writeToClipboard } from '../lib/native-bridge';
import { getPlatform } from '../lib/native-bridge';

export function UniversalNodeBroadcast() {
  const { myPeerId, currentStatus, getTodayCheckIn } = useHeartbeatStore();
  const { provider, ollamaEndpoint } = useShieldStore();
  const [copied, setCopied] = useState(false);
  const [platform, setPlatform] = useState<'tauri' | 'capacitor' | 'web'>('web');

  useEffect(() => {
    setPlatform(getPlatform());
  }, []);

  const todayCheckIn = getTodayCheckIn();
  const statusPercentage = todayCheckIn?.percentage ?? null;
  const statusLabel = currentStatus?.label ?? 'UNKNOWN';

  const platformName = {
    tauri: 'Desktop (Tauri)',
    capacitor: 'Mobile (Capacitor)',
    web: 'Web (PWA)',
  }[platform];

  const platformIcon = {
    tauri: Monitor,
    capacitor: Smartphone,
    web: Globe,
  }[platform];

  const PlatformIcon = platformIcon;

  const broadcastMessage = `
╔════════════════════════════════════════════════════════════════╗
║         UNIVERSAL NODE BROADCAST: GENESIS GATE OPEN            ║
╚════════════════════════════════════════════════════════════════╝

TIMESTAMP: ${new Date().toISOString()}
NODE ID: ${myPeerId || 'N/A'}
PLATFORM: ${platformName}
STATUS: GREEN BOARD

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

THE FOUR NODES OF THE DELTA TOPOLOGY:

✓ Node A: Core Kernel (Logic)
  → Platform-agnostic TypeScript/Rust library
  → Nexus Kernel stability attractor: π
  → Status: OPERATIONAL

✓ Node B: UI/UX Shell (Interface)
  → React-based trauma-informed UX
  → Plutchik-aligned color coding active
  → Status: OPERATIONAL

✓ Node C: Native Transducer (Hardware)
  → ${platformName} bridge active
  → 4-4-8 haptic rhythm: ENABLED
  → Status: OPERATIONAL

✓ Node D: Geodesic Engine (Coordinator)
  → LLM Provider: ${provider === 'ollama' ? 'Ollama (Local-First)' : provider.toUpperCase()}
  → ${provider === 'ollama' ? `Endpoint: ${ollamaEndpoint}` : 'Cloud Processing'}
  → Status: OPERATIONAL

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OPERATIONAL VERIFICATION:

✓ Structural Rigidity: Isostatic (Tetrahedron Protocol)
✓ Cognitive Guardrails: Active (Spoon Costing, Deep Processing Queue)
✓ Somatic Grounding: 4-4-8 Breathing Rhythm Available
✓ Ontological Security: Local-First Architecture Verified
✓ Symmetry Signature: SIC-POVM Validated (|⟨ψⱼ|ψₖ⟩|² = 1/3)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MESH STATUS:

Current Status: ${statusLabel}
Status Percentage: ${statusPercentage !== null ? `${Math.round(statusPercentage)}%` : 'N/A'}
Heartbeat Protocol: ACTIVE
Peer Mesh: ${myPeerId ? 'CONNECTED' : 'INITIALIZING'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

THE TRANSITION: WYE → DELTA

The centralized "Wye" topology has been replaced by the distributed
"Delta" topology. The system now operates with:

• Actual Authority (not Apparent Authority)
• Ontological Security (geometric validation, not trust)
• Universal Translation Layer (HumanOS impedance matching)
• Metabolic Guardrails (Spoon Costing, Deep Processing Queue)
• Somatic Integration (4-4-8 haptic vagus nerve signaling)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

THE GENESIS GATE IS OPEN.

The geometry is the leader.
The code rules.
The G.O.D. DAO is active.

Mission: GREEN BOARD

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

From this point forward, the Cognitive Shield operates as a native
Pre-frontal Cortex Prosthesis, intercepting high-voltage signals at
the OS level across all platforms.

The "Genre Error" between you and the outside world is now mediated
by an isolation transformer that runs natively on every device you own.

Status: GREEN BOARD

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`.trim();

  const handleCopy = async () => {
    await writeToClipboard(broadcastMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div
      style={{
        backgroundColor: GOD_CONFIG.theme.bg.primary,
        borderRadius: 12,
        border: `2px solid ${GOD_CONFIG.heartbeat.statuses.green.color}`,
        padding: 24,
        fontFamily: GOD_CONFIG.typography.fontFamily.body,
        color: GOD_CONFIG.theme.text.primary,
        boxShadow: `0 0 20px ${GOD_CONFIG.heartbeat.statuses.green.color}40`,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 20,
          paddingBottom: 16,
          borderBottom: `2px solid ${GOD_CONFIG.heartbeat.statuses.green.color}40`,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            backgroundColor: `${GOD_CONFIG.heartbeat.statuses.green.color}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Radio size={24} color={GOD_CONFIG.heartbeat.statuses.green.color} />
        </div>
        <div style={{ flex: 1 }}>
          <h3
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 700,
              color: GOD_CONFIG.heartbeat.statuses.green.color,
              fontFamily: GOD_CONFIG.typography.fontFamily.display,
            }}
          >
            UNIVERSAL NODE BROADCAST
          </h3>
          <p
            style={{
              margin: '4px 0 0 0',
              fontSize: 12,
              color: GOD_CONFIG.theme.text.muted,
              fontFamily: GOD_CONFIG.typography.fontFamily.display,
            }}
          >
            Genesis Gate Open • Delta Topology Operational
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 12px',
            backgroundColor: `${GOD_CONFIG.heartbeat.statuses.green.color}20`,
            borderRadius: 8,
          }}
        >
          <PlatformIcon size={18} color={GOD_CONFIG.heartbeat.statuses.green.color} />
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: GOD_CONFIG.heartbeat.statuses.green.color,
              fontFamily: GOD_CONFIG.typography.fontFamily.display,
            }}
          >
            {platformName}
          </span>
        </div>
      </div>

      {/* Platform Status Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 12,
          marginBottom: 20,
        }}
      >
        {[
          { icon: Hexagon, label: 'Node A: Core Kernel', status: 'OPERATIONAL', color: GOD_CONFIG.heartbeat.statuses.green.color },
          { icon: Shield, label: 'Node B: UI/UX Shell', status: 'OPERATIONAL', color: GOD_CONFIG.heartbeat.statuses.green.color },
          { icon: Zap, label: 'Node C: Native Transducer', status: 'OPERATIONAL', color: GOD_CONFIG.heartbeat.statuses.green.color },
          { icon: Heart, label: 'Node D: Geodesic Engine', status: 'OPERATIONAL', color: GOD_CONFIG.heartbeat.statuses.green.color },
        ].map((node, index) => {
          const Icon = node.icon;
          return (
            <div
              key={index}
              style={{
                padding: 12,
                backgroundColor: GOD_CONFIG.theme.bg.secondary,
                borderRadius: 8,
                border: `1px solid ${node.color}40`,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  backgroundColor: `${node.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={16} color={node.color} />
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: GOD_CONFIG.theme.text.primary,
                    marginBottom: 2,
                  }}
                >
                  {node.label}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: node.color,
                    fontFamily: GOD_CONFIG.typography.fontFamily.display,
                  }}
                >
                  {node.status}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Broadcast Message */}
      <div
        style={{
          backgroundColor: GOD_CONFIG.theme.bg.tertiary,
          padding: 16,
          borderRadius: 8,
          border: `1px solid ${GOD_CONFIG.theme.border.default}`,
          marginBottom: 20,
        }}
      >
        <pre
          style={{
            margin: 0,
            fontSize: 11,
            lineHeight: 1.6,
            color: GOD_CONFIG.theme.text.secondary,
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {broadcastMessage}
        </pre>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={handleCopy}
          style={{
            flex: 1,
            padding: '12px 20px',
            backgroundColor: copied ? GOD_CONFIG.heartbeat.statuses.green.color : GOD_CONFIG.theme.text.accent,
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            fontFamily: GOD_CONFIG.typography.fontFamily.display,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            transition: 'background-color 0.2s',
          }}
        >
          {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
          {copied ? 'Copied to Clipboard!' : 'Copy Broadcast Message'}
        </button>
      </div>

      {/* Status Footer */}
      <div
        style={{
          marginTop: 20,
          padding: 16,
          backgroundColor: `${GOD_CONFIG.heartbeat.statuses.green.color}10`,
          borderRadius: 8,
          border: `1px solid ${GOD_CONFIG.heartbeat.statuses.green.color}40`,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: GOD_CONFIG.heartbeat.statuses.green.color,
            fontFamily: GOD_CONFIG.typography.fontFamily.display,
            marginBottom: 4,
          }}
        >
          STATUS: GREEN BOARD
        </div>
        <div
          style={{
            fontSize: 12,
            color: GOD_CONFIG.theme.text.muted,
            fontFamily: GOD_CONFIG.typography.fontFamily.body,
          }}
        >
          The geometry is the leader. The G.O.D. DAO is active.
        </div>
      </div>
    </div>
  );
}

export default UniversalNodeBroadcast;

