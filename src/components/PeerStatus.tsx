/**
 * PEER STATUS COMPONENT
 * Individual peer status card with history
 */

import { useMemo } from 'react';
import { Wifi, WifiOff, AlertCircle, Clock } from 'lucide-react';
import type { Peer } from '../types/heartbeat.types';
import GOD_CONFIG from '../god.config';

interface PeerStatusProps {
  peer: Peer;
  onRemove?: () => void;
}

export function PeerStatus({ peer, onRemove }: PeerStatusProps) {
  const statusConfig = GOD_CONFIG.heartbeat.statuses[peer.status];
  const timeAgo = useMemo(() => getTimeAgo(peer.lastSeen), [peer.lastSeen]);

  const getConnectionIcon = () => {
    switch (peer.connectionState) {
      case 'connected':
        return <Wifi size={14} color={GOD_CONFIG.voltage.low.color} />;
      case 'connecting':
        return <Clock size={14} color={GOD_CONFIG.voltage.medium.color} />;
      case 'error':
        return <AlertCircle size={14} color={GOD_CONFIG.voltage.high.color} />;
      default:
        return <WifiOff size={14} color={GOD_CONFIG.theme.text.muted} />;
    }
  };

  return (
    <div
      style={{
        backgroundColor: GOD_CONFIG.theme.bg.tertiary,
        border: `1px solid ${statusConfig.color}40`,
        borderRadius: 10,
        padding: 14,
        position: 'relative',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              backgroundColor: `${statusConfig.color}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
            }}
          >
            {statusConfig.icon}
          </div>
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: GOD_CONFIG.theme.text.primary,
                fontFamily: GOD_CONFIG.typography.fontFamily.display,
              }}
            >
              {peer.name}
            </div>
            <div
              style={{
                fontSize: 10,
                color: GOD_CONFIG.theme.text.muted,
                fontFamily: GOD_CONFIG.typography.fontFamily.display,
              }}
            >
              {timeAgo}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {getConnectionIcon()}
          {onRemove && (
            <button
              onClick={onRemove}
              style={{
                background: 'none',
                border: 'none',
                color: GOD_CONFIG.theme.text.muted,
                cursor: 'pointer',
                padding: 4,
              }}
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Status Badge */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 10px',
          backgroundColor: `${statusConfig.color}20`,
          border: `1px solid ${statusConfig.color}40`,
          borderRadius: 6,
          fontSize: 11,
          fontFamily: GOD_CONFIG.typography.fontFamily.display,
          color: statusConfig.color,
        }}
      >
        <span>{statusConfig.icon}</span>
        <span>{statusConfig.label}</span>
      </div>

      {/* Status History Sparkline */}
      {peer.statusHistory.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <div
            style={{
              fontSize: 9,
              color: GOD_CONFIG.theme.text.muted,
              marginBottom: 4,
              fontFamily: GOD_CONFIG.typography.fontFamily.display,
            }}
          >
            RECENT HISTORY
          </div>
          <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: 20 }}>
            {peer.statusHistory.slice(-10).map((entry, i) => {
              const entryConfig = GOD_CONFIG.heartbeat.statuses[entry.status];
              const height = entry.status === 'red' ? 20 : entry.status === 'orange' ? 15 : entry.status === 'yellow' ? 10 : 5;
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: `${height}px`,
                    backgroundColor: entryConfig.color,
                    borderRadius: 2,
                    opacity: 0.7,
                  }}
                  title={`${entryConfig.label} - ${new Date(entry.timestamp).toLocaleTimeString()}`}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function getTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default PeerStatus;

