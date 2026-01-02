/**
 * HEARTBEAT PROTOCOL TYPE DEFINITIONS
 * Status check-in system with peer mesh and dead man's switch
 */

import type { GOD_CONFIG } from '../god.config';

export type HeartbeatStatus = 'green' | 'yellow' | 'orange' | 'red';

export interface Peer {
  readonly id: string; // PeerJS peer ID
  readonly name: string; // Display name
  readonly publicKey?: string; // For encryption (future)
  readonly lastSeen: number; // Timestamp
  readonly status: HeartbeatStatus;
  readonly statusHistory: readonly HeartbeatEntry[];
  readonly connectionState: 'connecting' | 'connected' | 'disconnected' | 'error';
}

export interface HeartbeatEntry {
  readonly timestamp: number;
  readonly status: HeartbeatStatus;
  readonly note?: string;
  readonly location?: string; // If user permits
}

export interface EscalationConfig {
  readonly enabled: boolean;
  readonly webhookUrl?: string;
  readonly emergencyContact?: {
    readonly name: string;
    readonly email?: string;
    readonly phone?: string;
  };
  readonly includeLocation: boolean;
}

export interface HeartbeatState {
  readonly currentStatus: HeartbeatStatus;
  readonly lastCheckIn: number | null;
  readonly checkInInterval: string; // ID from checkInIntervals
  readonly checkInTimerRemaining: number; // ms
  readonly missedCheckIns: number;
  readonly isDeadManActive: boolean;
  readonly personalLog: readonly HeartbeatEntry[];
  readonly peers: readonly Peer[];
  readonly myPeerId: string | null;
  readonly connectionCode: string | null; // Base64 encoded peer ID for sharing
  readonly escalationConfig: EscalationConfig;
  // Daily Check-In (π-Metric)
  readonly dailyCheckIn: import('./checkin.types').DailyCheckIn | null; // Today's check-in
  readonly checkInHistory: readonly import('./checkin.types').DailyCheckIn[]; // Past entries
}

export interface HeartbeatActions {
  setStatus: (status: HeartbeatStatus, note?: string) => void;
  checkIn: (note?: string) => void;
  setCheckInInterval: (intervalId: string) => void;
  startDeadManTimer: () => void;
  addPeer: (peerId: string, name: string) => void;
  removePeer: (peerId: string) => void;
  updatePeerStatus: (peerId: string, status: HeartbeatStatus) => void;
  updatePeerConnectionState: (peerId: string, state: Peer['connectionState']) => void;
  setEscalationConfig: (config: Partial<EscalationConfig>) => void;
  generateConnectionCode: () => void;
  clearConnectionCode: () => void;
  resetDeadMan: () => void;
  exportLog: () => string; // Returns JSON string
  initializeMesh: () => Promise<void>;
  destroyMesh: () => void;
  // Daily Check-In Actions
  submitDailyCheckIn: (responses: import('./checkin.types').CheckInResponse[]) => void;
  getTodayCheckIn: () => import('./checkin.types').DailyCheckIn | null;
  exportCheckInHistory: () => string; // Returns JSON string
}

export interface MeshMessage {
  readonly type: 'status' | 'ping' | 'pong' | 'handshake';
  readonly from: string; // Peer ID
  readonly timestamp: number;
  readonly payload?: {
    readonly status?: HeartbeatStatus;
    readonly name?: string;
    readonly note?: string;
  };
}

export interface EscalationPayload {
  readonly userId: string;
  readonly userName: string;
  readonly status: HeartbeatStatus;
  readonly lastCheckIn: number | null;
  readonly missedCheckIns: number;
  readonly timestamp: number;
  readonly location?: string;
  readonly note?: string;
}

