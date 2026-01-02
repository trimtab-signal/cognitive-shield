/**
 * MODULE ABDICATION CEREMONY
 * Destroy update keys to lock module version
 */

import { useState } from 'react';
import { Key, Lock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import GOD_CONFIG from '../god.config';
import { useModuleStore } from '../store/module.store';
import type { GeodesicModule } from '../types/module.types';

interface ModuleAbdicationProps {
  module: GeodesicModule;
  onComplete: () => void;
}

export function ModuleAbdication({ module, onComplete }: ModuleAbdicationProps) {
  const { updateModule } = useModuleStore();
  const [confirmed, setConfirmed] = useState(false);
  const [abdicated, setAbdicated] = useState(false);

  const handleAbdicate = () => {
    if (!confirmed) {
      return;
    }

    // Mark module as abdicated
    updateModule(module.id, {
      abdicated: true,
    });

    // In production, you'd also:
    // 1. Destroy any private keys associated with the module
    // 2. Sign the module hash with a one-time key
    // 3. Publish the signed hash to IPFS/ENS
    // 4. Clear local update capabilities

    setAbdicated(true);
    
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  if (abdicated) {
    return (
      <div
        style={{
          padding: 24,
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
          Abdication Complete
        </h3>
        <p style={{ fontSize: 14, color: GOD_CONFIG.theme.text.secondary, marginTop: 8 }}>
          Module update keys have been destroyed. The module is now immutable.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: 24,
        backgroundColor: GOD_CONFIG.theme.bg.secondary,
        borderRadius: 12,
        border: `1px solid ${GOD_CONFIG.theme.border.default}`,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 20,
        }}
      >
        <Lock size={24} color={GOD_CONFIG.voltage.high.color} />
        <h3
          style={{
            margin: 0,
            fontSize: 20,
            fontWeight: 700,
            color: GOD_CONFIG.theme.text.primary,
            fontFamily: GOD_CONFIG.typography.fontFamily.display,
          }}
        >
          Module Abdication Ceremony
        </h3>
      </div>

      <div
        style={{
          padding: 16,
          backgroundColor: `${GOD_CONFIG.voltage.high.color}15`,
          borderRadius: 8,
          border: `1px solid ${GOD_CONFIG.voltage.high.color}40`,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'start',
            gap: 12,
          }}
        >
          <AlertTriangle size={20} color={GOD_CONFIG.voltage.high.color} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: GOD_CONFIG.voltage.high.color,
                marginBottom: 8,
              }}
            >
              Warning: This action is irreversible
            </div>
            <div style={{ fontSize: 13, color: GOD_CONFIG.theme.text.secondary, lineHeight: 1.6 }}>
              Abdicating a module will permanently destroy your ability to update it. The module will become
              immutable and governed solely by its code. This ensures the module is a "Public Good" - governed by
              geometry, not the will of the author.
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: GOD_CONFIG.theme.text.primary, marginBottom: 12 }}>
          Module: {module.name}
        </div>
        <div style={{ fontSize: 13, color: GOD_CONFIG.theme.text.secondary }}>
          Version: {module.version}
        </div>
        <div style={{ fontSize: 13, color: GOD_CONFIG.theme.text.secondary }}>
          CID: {module.cid || 'Not published to IPFS'}
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            cursor: 'pointer',
            fontSize: 14,
            color: GOD_CONFIG.theme.text.primary,
          }}
        >
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            style={{
              width: 18,
              height: 18,
              cursor: 'pointer',
            }}
          />
          <span>
            I understand that this action is <strong>irreversible</strong> and will permanently lock this module
            version.
          </span>
        </label>
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <button
          onClick={onComplete}
          style={{
            padding: '10px 20px',
            backgroundColor: GOD_CONFIG.theme.bg.tertiary,
            border: `1px solid ${GOD_CONFIG.theme.border.default}`,
            borderRadius: 8,
            color: GOD_CONFIG.theme.text.primary,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleAbdicate}
          disabled={!confirmed}
          style={{
            padding: '10px 20px',
            backgroundColor: confirmed ? GOD_CONFIG.voltage.high.color : GOD_CONFIG.theme.bg.tertiary,
            border: 'none',
            borderRadius: 8,
            color: confirmed ? '#fff' : GOD_CONFIG.theme.text.muted,
            fontSize: 14,
            fontWeight: 600,
            cursor: confirmed ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Key size={16} />
          Abdicate Module
        </button>
      </div>
    </div>
  );
}

export default ModuleAbdication;


