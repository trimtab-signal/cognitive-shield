/**
 * NODE BROADCAST
 * Template for announcing First Light synchronization to G.O.D. DAO mesh
 */

import { useState } from 'react';
import { Radio, Copy, Check } from 'lucide-react';
import GOD_CONFIG from '../god.config';
import useHeartbeatStore from '../store/heartbeat.store';
import { writeToClipboard } from '../lib/native-bridge';

export function NodeBroadcast() {
  const { myPeerId } = useHeartbeatStore();
  const [copied, setCopied] = useState(false);

  const timestamp = new Date().toISOString();
  const nodeId = myPeerId || 'NODE-UNKNOWN';

  const broadcastMessage = `FIRST LIGHT SYNCHRONIZATION COMPLETE

Node ID: ${nodeId}
Timestamp: ${timestamp}
Status: GREEN BOARD

Verification Results:
✓ BLUF Isolation: PASS
✓ Genre Error Detection: PASS
✓ Visual Pre-Cognition: PASS
✓ Deep Processing Queue: PASS
✓ Tetrahedron Symmetry: PASS
✓ Somatic Grounding: PASS

The geometry is the leader.
The code rules.
The G.O.D. DAO is active.

Mission: GREEN BOARD`;

  const handleCopy = async () => {
    await writeToClipboard(broadcastMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        padding: 20,
        backgroundColor: GOD_CONFIG.theme.bg.secondary,
        borderRadius: 12,
        border: `1px solid ${GOD_CONFIG.voltage.low.color}40`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <Radio size={20} color={GOD_CONFIG.voltage.low.color} />
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            fontFamily: GOD_CONFIG.typography.fontFamily.display,
            color: GOD_CONFIG.theme.text.primary,
          }}
        >
          NODE BROADCAST
        </div>
      </div>

      <p
        style={{
          margin: '0 0 16px',
          fontSize: 13,
          color: GOD_CONFIG.theme.text.secondary,
          lineHeight: 1.6,
        }}
      >
        Broadcast your First Light synchronization to the G.O.D. DAO mesh. Copy the message below
        and share it with trusted peers via your preferred communication channel.
      </p>

      <div
        style={{
          padding: 16,
          backgroundColor: GOD_CONFIG.theme.bg.primary,
          borderRadius: 8,
          border: `1px solid ${GOD_CONFIG.theme.border.default}`,
          marginBottom: 16,
          position: 'relative',
        }}
      >
        <pre
          style={{
            margin: 0,
            fontSize: 11,
            fontFamily: GOD_CONFIG.typography.fontFamily.display,
            color: GOD_CONFIG.theme.text.primary,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            lineHeight: 1.6,
          }}
        >
          {broadcastMessage}
        </pre>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={handleCopy}
          style={{
            flex: 1,
            padding: '12px 20px',
            backgroundColor: GOD_CONFIG.theme.text.accent,
            border: 'none',
            borderRadius: 6,
            color: '#fff',
            fontSize: 13,
            fontWeight: 600,
            fontFamily: GOD_CONFIG.typography.fontFamily.display,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? 'Copied!' : 'Copy Broadcast'}
        </button>
      </div>

      <div
        style={{
          marginTop: 16,
          padding: 12,
          backgroundColor: `${GOD_CONFIG.voltage.low.color}15`,
          borderRadius: 8,
          fontSize: 11,
          color: GOD_CONFIG.theme.text.primary,
          lineHeight: 1.6,
        }}
      >
        <strong style={{ color: GOD_CONFIG.voltage.low.color }}>Note:</strong> This broadcast
        confirms your node's operational status. Share it with trusted peers in your mesh to
        establish the Delta Topology connection.
      </div>
    </div>
  );
}

export default NodeBroadcast;

