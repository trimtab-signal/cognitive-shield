/**
 * HEARTBEAT PANEL
 * Main UI for status check-ins and peer mesh
 */

import { useState, useEffect } from 'react';
import {
  Heart,
  Clock,
  Users,
  Share2,
  Copy,
  Check,
  AlertTriangle,
  Download,
  Settings,
  Plus,
  X,
  Calendar,
  TrendingUp,
} from 'lucide-react';
import GOD_CONFIG from '../god.config';
import useHeartbeatStore from '../store/heartbeat.store';
import PeerStatus from './PeerStatus';
import DailyCheckIn from './DailyCheckIn';
import CheckInStatusBadge from './CheckInStatusBadge';
import CheckInHistory from './CheckInHistory';

export function HeartbeatPanel() {
  const {
    currentStatus,
    checkInInterval,
    checkInTimerRemaining,
    missedCheckIns,
    isDeadManActive,
    peers,
    connectionCode,
    escalationConfig,
    dailyCheckIn,
    checkInHistory,
    setStatus,
    checkIn,
    setCheckInInterval,
    generateConnectionCode,
    clearConnectionCode,
    addPeer,
    removePeer,
    setEscalationConfig,
    exportLog,
    exportCheckInHistory,
    getTodayCheckIn,
    initializeMesh,
    destroyMesh,
  } = useHeartbeatStore();

  const [showSettings, setShowSettings] = useState(false);
  const [showAddPeer, setShowAddPeer] = useState(false);
  const [peerCodeInput, setPeerCodeInput] = useState('');
  const [peerNameInput, setPeerNameInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [userName, setUserName] = useState(
    localStorage.getItem('heartbeat-user-name') || ''
  );
  const [showDailyCheckIn, setShowDailyCheckIn] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const statusConfig = GOD_CONFIG.heartbeat.statuses[currentStatus];
  const intervalConfig = GOD_CONFIG.heartbeat.checkInIntervals.find(
    (i) => i.id === checkInInterval
  );

  // Initialize mesh on mount
  useEffect(() => {
    initializeMesh();
    return () => {
      destroyMesh();
    };
  }, []);

  // Save user name
  useEffect(() => {
    if (userName) {
      localStorage.setItem('heartbeat-user-name', userName);
    }
  }, [userName]);

  const handleStatusChange = (status: typeof currentStatus) => {
    setStatus(status);
  };

  const handleCheckIn = () => {
    checkIn();
  };

  const handleCopyCode = async () => {
    if (connectionCode) {
      await navigator.clipboard.writeText(connectionCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAddPeer = () => {
    if (!peerCodeInput || !peerNameInput) return;

    try {
      const peerId = atob(peerCodeInput.trim());
      addPeer(peerId, peerNameInput.trim());
      setPeerCodeInput('');
      setPeerNameInput('');
      setShowAddPeer(false);
    } catch (error) {
      alert('Invalid connection code. Please check and try again.');
    }
  };

  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleExport = () => {
    const log = exportLog();
    const blob = new Blob([log], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `heartbeat-log-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* User Name Input */}
      <div
        style={{
          padding: 12,
          backgroundColor: GOD_CONFIG.theme.bg.secondary,
          borderRadius: 8,
          border: `1px solid ${GOD_CONFIG.theme.border.default}`,
        }}
      >
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Your name (for peers to see)"
          style={{
            width: '100%',
            padding: '8px 12px',
            backgroundColor: GOD_CONFIG.theme.bg.primary,
            border: `1px solid ${GOD_CONFIG.theme.border.default}`,
            borderRadius: 6,
            color: GOD_CONFIG.theme.text.primary,
            fontSize: 13,
            fontFamily: GOD_CONFIG.typography.fontFamily.body,
            outline: 'none',
          }}
        />
      </div>

      {/* Daily Check-In Badge */}
      {(() => {
        const todayCheckIn = getTodayCheckIn();
        const needsCheckIn = !todayCheckIn;
        const today = new Date().toISOString().split('T')[0];
        const lastCheckInDate = dailyCheckIn?.date;
        
        if (needsCheckIn || lastCheckInDate !== today) {
          return (
            <div
              style={{
                padding: 16,
                backgroundColor: `${GOD_CONFIG.voltage.medium.color}15`,
                borderRadius: 12,
                border: `1px solid ${GOD_CONFIG.voltage.medium.color}40`,
                marginBottom: 16,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: GOD_CONFIG.theme.text.primary,
                      marginBottom: 4,
                    }}
                  >
                    Daily Check-In Due
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: GOD_CONFIG.theme.text.muted,
                    }}
                  >
                    Complete your π-Metric resonance assessment
                  </div>
                </div>
                <button
                  onClick={() => setShowDailyCheckIn(true)}
                  style={{
                    padding: '10px 16px',
                    backgroundColor: GOD_CONFIG.voltage.medium.color,
                    border: 'none',
                    borderRadius: 6,
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: 600,
                    fontFamily: GOD_CONFIG.typography.fontFamily.display,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Calendar size={14} />
                  Start Check-In
                </button>
              </div>
            </div>
          );
        }
        return null;
      })()}

      {/* Current Status Display */}
      <div
        style={{
          padding: 24,
          backgroundColor: GOD_CONFIG.theme.bg.secondary,
          borderRadius: 12,
          border: `2px solid ${statusConfig.color}60`,
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {/* Check-In Badge */}
        {getTodayCheckIn() && (
          <div
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
            }}
          >
            <CheckInStatusBadge checkIn={getTodayCheckIn()} compact onClick={() => setShowHistory(true)} />
          </div>
        )}

        <div style={{ fontSize: 48, marginBottom: 12 }}>{statusConfig.icon}</div>
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            fontFamily: GOD_CONFIG.typography.fontFamily.display,
            color: statusConfig.color,
            marginBottom: 8,
          }}
        >
          {statusConfig.label}
        </div>
        <div
          style={{
            fontSize: 12,
            color: GOD_CONFIG.theme.text.muted,
            marginBottom: 20,
          }}
        >
          {statusConfig.meaning}
        </div>

        {/* Status Buttons */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          {Object.entries(GOD_CONFIG.heartbeat.statuses).map(([key, config]) => (
            <button
              key={key}
              onClick={() => handleStatusChange(key as typeof currentStatus)}
              style={{
                padding: '10px 16px',
                backgroundColor:
                  currentStatus === key ? `${config.color}20` : GOD_CONFIG.theme.bg.tertiary,
                border: `2px solid ${currentStatus === key ? config.color : GOD_CONFIG.theme.border.default}`,
                borderRadius: 8,
                color: currentStatus === key ? config.color : GOD_CONFIG.theme.text.muted,
                fontSize: 12,
                fontWeight: currentStatus === key ? 600 : 400,
                fontFamily: GOD_CONFIG.typography.fontFamily.display,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.2s ease',
              }}
            >
              <span>{config.icon}</span>
              <span>{config.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Dead Man's Switch Timer */}
      {isDeadManActive && intervalConfig && intervalConfig.ms > 0 && (
        <div
          style={{
            padding: 16,
            backgroundColor: GOD_CONFIG.theme.bg.secondary,
            borderRadius: 12,
            border: `1px solid ${GOD_CONFIG.theme.border.default}`,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock size={16} color={GOD_CONFIG.theme.text.accent} />
              <span
                style={{
                  fontSize: 12,
                  fontFamily: GOD_CONFIG.typography.fontFamily.display,
                  color: GOD_CONFIG.theme.text.secondary,
                }}
              >
                CHECK-IN TIMER
              </span>
            </div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                fontFamily: GOD_CONFIG.typography.fontFamily.display,
                color:
                  checkInTimerRemaining < 60000
                    ? GOD_CONFIG.voltage.high.color
                    : GOD_CONFIG.theme.text.primary,
              }}
            >
              {formatTime(checkInTimerRemaining)}
            </div>
          </div>

          {missedCheckIns > 0 && (
            <div
              style={{
                padding: 10,
                backgroundColor: `${GOD_CONFIG.voltage.medium.color}15`,
                borderRadius: 6,
                color: GOD_CONFIG.voltage.medium.color,
                fontSize: 11,
                marginBottom: 12,
              }}
            >
              ⚠️ Missed {missedCheckIns} check-in{missedCheckIns !== 1 ? 's' : ''}
            </div>
          )}

          <button
            onClick={handleCheckIn}
            style={{
              width: '100%',
              padding: '12px 20px',
              backgroundColor: GOD_CONFIG.voltage.low.color,
              border: 'none',
              borderRadius: 8,
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              fontFamily: GOD_CONFIG.typography.fontFamily.display,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <Heart size={16} />
            I'm Safe - Check In
          </button>

          {/* Interval Selector */}
          <div style={{ marginTop: 12 }}>
            <select
              value={checkInInterval}
              onChange={(e) => setCheckInInterval(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                backgroundColor: GOD_CONFIG.theme.bg.primary,
                border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                borderRadius: 6,
                color: GOD_CONFIG.theme.text.primary,
                fontSize: 12,
                fontFamily: GOD_CONFIG.typography.fontFamily.display,
                outline: 'none',
              }}
            >
              {GOD_CONFIG.heartbeat.checkInIntervals.map((interval) => (
                <option key={interval.id} value={interval.id}>
                  {interval.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Connection Code */}
      <div
        style={{
          padding: 16,
          backgroundColor: GOD_CONFIG.theme.bg.secondary,
          borderRadius: 12,
          border: `1px solid ${GOD_CONFIG.theme.border.default}`,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Share2 size={16} color={GOD_CONFIG.theme.text.accent} />
            <span
              style={{
                fontSize: 12,
                fontFamily: GOD_CONFIG.typography.fontFamily.display,
                color: GOD_CONFIG.theme.text.secondary,
              }}
            >
              CONNECTION CODE
            </span>
          </div>
          <button
            onClick={connectionCode ? clearConnectionCode : generateConnectionCode}
            style={{
              padding: '4px 10px',
              backgroundColor: GOD_CONFIG.theme.bg.tertiary,
              border: `1px solid ${GOD_CONFIG.theme.border.default}`,
              borderRadius: 4,
              color: GOD_CONFIG.theme.text.secondary,
              fontSize: 10,
              cursor: 'pointer',
            }}
          >
            {connectionCode ? 'Clear' : 'Generate'}
          </button>
        </div>

        {connectionCode && (
          <div
            style={{
              display: 'flex',
              gap: 8,
              alignItems: 'center',
            }}
          >
            <code
              style={{
                flex: 1,
                padding: '10px 12px',
                backgroundColor: GOD_CONFIG.theme.bg.primary,
                borderRadius: 6,
                fontFamily: GOD_CONFIG.typography.fontFamily.display,
                fontSize: 11,
                color: GOD_CONFIG.theme.text.primary,
                wordBreak: 'break-all',
              }}
            >
              {connectionCode}
            </code>
            <button
              onClick={handleCopyCode}
              style={{
                padding: '10px 14px',
                backgroundColor: GOD_CONFIG.theme.text.accent,
                border: 'none',
                borderRadius: 6,
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
        )}

        {!connectionCode && (
          <p
            style={{
              fontSize: 11,
              color: GOD_CONFIG.theme.text.muted,
              margin: 0,
            }}
          >
            Generate a code to share with trusted peers. They can enter it to connect.
          </p>
        )}
      </div>

      {/* Add Peer */}
      <div
        style={{
          padding: 16,
          backgroundColor: GOD_CONFIG.theme.bg.secondary,
          borderRadius: 12,
          border: `1px solid ${GOD_CONFIG.theme.border.default}`,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={16} color={GOD_CONFIG.theme.text.accent} />
            <span
              style={{
                fontSize: 12,
                fontFamily: GOD_CONFIG.typography.fontFamily.display,
                color: GOD_CONFIG.theme.text.secondary,
              }}
            >
              TRUSTED PEERS ({peers.length})
            </span>
          </div>
          <button
            onClick={() => setShowAddPeer(!showAddPeer)}
            style={{
              padding: '6px 12px',
              backgroundColor: GOD_CONFIG.theme.bg.tertiary,
              border: `1px solid ${GOD_CONFIG.theme.border.default}`,
              borderRadius: 6,
              color: GOD_CONFIG.theme.text.secondary,
              fontSize: 11,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Plus size={12} />
            Add Peer
          </button>
        </div>

        {showAddPeer && (
          <div style={{ marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input
              type="text"
              value={peerNameInput}
              onChange={(e) => setPeerNameInput(e.target.value)}
              placeholder="Peer name"
              style={{
                padding: '8px 12px',
                backgroundColor: GOD_CONFIG.theme.bg.primary,
                border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                borderRadius: 6,
                color: GOD_CONFIG.theme.text.primary,
                fontSize: 12,
                fontFamily: GOD_CONFIG.typography.fontFamily.body,
                outline: 'none',
              }}
            />
            <input
              type="text"
              value={peerCodeInput}
              onChange={(e) => setPeerCodeInput(e.target.value)}
              placeholder="Connection code"
              style={{
                padding: '8px 12px',
                backgroundColor: GOD_CONFIG.theme.bg.primary,
                border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                borderRadius: 6,
                color: GOD_CONFIG.theme.text.primary,
                fontSize: 12,
                fontFamily: GOD_CONFIG.typography.fontFamily.body,
                outline: 'none',
              }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={handleAddPeer}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  backgroundColor: GOD_CONFIG.voltage.low.color,
                  border: 'none',
                  borderRadius: 6,
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Connect
              </button>
              <button
                onClick={() => {
                  setShowAddPeer(false);
                  setPeerCodeInput('');
                  setPeerNameInput('');
                }}
                style={{
                  padding: '8px 12px',
                  backgroundColor: GOD_CONFIG.theme.bg.tertiary,
                  border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                  borderRadius: 6,
                  color: GOD_CONFIG.theme.text.muted,
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Peer List */}
        {peers.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {peers.map((peer) => (
              <PeerStatus key={peer.id} peer={peer} onRemove={() => removePeer(peer.id)} />
            ))}
          </div>
        ) : (
          <p
            style={{
              fontSize: 11,
              color: GOD_CONFIG.theme.text.muted,
              margin: 0,
              textAlign: 'center',
              padding: '20px 0',
            }}
          >
            No peers connected. Share your connection code to add trusted contacts.
          </p>
        )}
      </div>

      {/* Settings & Export */}
      <div
        style={{
          padding: 16,
          backgroundColor: GOD_CONFIG.theme.bg.secondary,
          borderRadius: 12,
          border: `1px solid ${GOD_CONFIG.theme.border.default}`,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Settings size={16} color={GOD_CONFIG.theme.text.accent} />
            <span
              style={{
                fontSize: 12,
                fontFamily: GOD_CONFIG.typography.fontFamily.display,
                color: GOD_CONFIG.theme.text.secondary,
              }}
            >
              SETTINGS
            </span>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            style={{
              padding: '4px 10px',
              backgroundColor: GOD_CONFIG.theme.bg.tertiary,
              border: `1px solid ${GOD_CONFIG.theme.border.default}`,
              borderRadius: 4,
              color: GOD_CONFIG.theme.text.secondary,
              fontSize: 10,
              cursor: 'pointer',
            }}
          >
            {showSettings ? 'Hide' : 'Show'}
          </button>
        </div>

        {showSettings && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Escalation Webhook */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 10,
                  color: GOD_CONFIG.theme.text.muted,
                  marginBottom: 4,
                  fontFamily: GOD_CONFIG.typography.fontFamily.display,
                }}
              >
                ESCALATION WEBHOOK URL
              </label>
              <input
                type="url"
                value={escalationConfig.webhookUrl || ''}
                onChange={(e) =>
                  setEscalationConfig({ webhookUrl: e.target.value, enabled: !!e.target.value })
                }
                placeholder="https://your-webhook-url.com/alert"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  backgroundColor: GOD_CONFIG.theme.bg.primary,
                  border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                  borderRadius: 6,
                  color: GOD_CONFIG.theme.text.primary,
                  fontSize: 12,
                  fontFamily: GOD_CONFIG.typography.fontFamily.body,
                  outline: 'none',
                }}
              />
              <p
                style={{
                  fontSize: 10,
                  color: GOD_CONFIG.theme.text.muted,
                  margin: '4px 0 0',
                }}
              >
                Optional: Webhook URL for emergency alerts (IFTTT, Zapier, etc.)
              </p>
            </div>

            {/* Export Log */}
            <button
              onClick={handleExport}
              style={{
                padding: '10px 16px',
                backgroundColor: GOD_CONFIG.theme.bg.tertiary,
                border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                borderRadius: 6,
                color: GOD_CONFIG.theme.text.secondary,
                fontSize: 12,
                fontFamily: GOD_CONFIG.typography.fontFamily.display,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <Download size={14} />
              Export Log (JSON)
            </button>
          </div>
        )}
      </div>

      {/* Check-In History */}
      {showHistory && (
        <div style={{ marginTop: 16 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendingUp size={16} color={GOD_CONFIG.theme.text.accent} />
              <span
                style={{
                  fontSize: 12,
                  fontFamily: GOD_CONFIG.typography.fontFamily.display,
                  color: GOD_CONFIG.theme.text.secondary,
                }}
              >
                CHECK-IN HISTORY
              </span>
            </div>
            <button
              onClick={() => setShowHistory(false)}
              style={{
                padding: '4px 10px',
                backgroundColor: GOD_CONFIG.theme.bg.tertiary,
                border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                borderRadius: 4,
                color: GOD_CONFIG.theme.text.secondary,
                fontSize: 10,
                cursor: 'pointer',
              }}
            >
              Hide
            </button>
          </div>
          <CheckInHistory
            history={checkInHistory}
            onExport={() => {
              const data = exportCheckInHistory();
              const blob = new Blob([data], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `check-in-history-${Date.now()}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          />
        </div>
      )}

      {/* Daily Check-In Modal */}
      <DailyCheckIn
        isOpen={showDailyCheckIn}
        onClose={() => setShowDailyCheckIn(false)}
        onComplete={() => {
          setShowDailyCheckIn(false);
        }}
      />
    </div>
  );
}

export default HeartbeatPanel;

