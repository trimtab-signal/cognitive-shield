/**
 * HEARTBEAT STORE
 * Zustand store with dead man's switch timer logic
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  HeartbeatState,
  HeartbeatActions,
  HeartbeatStatus,
  Peer,
  HeartbeatEntry,
  EscalationConfig,
} from '../types/heartbeat.types';
import type { CheckInResponse, DailyCheckIn } from '../types/checkin.types';
import GOD_CONFIG from '../god.config';
import { MeshNetwork } from '../lib/mesh';
import { sendEscalationWebhook, shouldEscalate } from '../lib/escalation';
import {
  calculatePercentage,
  getStatusFromPercentage,
} from '../lib/checkin-scoring';

interface HeartbeatStore extends HeartbeatState, HeartbeatActions {
  mesh: MeshNetwork | null;
}

const generateId = () => crypto.randomUUID();

// Timer references
let checkInTimer: ReturnType<typeof setTimeout> | null = null;
let countdownInterval: ReturnType<typeof setInterval> | null = null;
let notificationPermission: NotificationPermission = 'default';

// Request notification permission
if (typeof window !== 'undefined' && 'Notification' in window) {
  Notification.requestPermission().then((permission) => {
    notificationPermission = permission;
  });
}

const initialState: HeartbeatState = {
  currentStatus: 'green',
  lastCheckIn: null,
  checkInInterval: GOD_CONFIG.heartbeat.defaultInterval,
  checkInTimerRemaining: 0,
  missedCheckIns: 0,
  isDeadManActive: false,
  personalLog: [],
  peers: [],
  myPeerId: null,
  connectionCode: null,
  escalationConfig: {
    enabled: false,
    includeLocation: false,
  },
  dailyCheckIn: null,
  checkInHistory: [],
};

export const useHeartbeatStore = create<HeartbeatStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      mesh: null,

      initializeMesh: async () => {
        const { myPeerId } = get();
        if (get().mesh) {
          get().mesh!.destroy();
        }

        const mesh = new MeshNetwork({
          onPeerConnected: (peer) => {
            set((state) => ({
              peers: [...state.peers.filter((p) => p.id !== peer.id), peer],
            }));
          },
          onPeerDisconnected: (peerId) => {
            set((state) => ({
              peers: state.peers.map((p) =>
                p.id === peerId
                  ? { ...p, connectionState: 'disconnected' as const }
                  : p
              ),
            }));
          },
          onMessage: (message) => {
            if (message.type === 'status' && message.payload) {
              const peerId = message.from;
              set((state) => ({
                peers: state.peers.map((p) =>
                  p.id === peerId
                    ? {
                        ...p,
                        status: message.payload!.status!,
                        lastSeen: message.timestamp,
                        statusHistory: [
                          ...p.statusHistory,
                          {
                            timestamp: message.timestamp,
                            status: message.payload!.status!,
                            note: message.payload!.note,
                          },
                        ].slice(-50), // Keep last 50 entries
                      }
                    : p
                ),
              }));
            }
          },
          onError: (error) => {
            console.error('[Heartbeat] Mesh error:', error);
            // Don't let mesh errors crash the app - they're non-critical
            set({ meshStatus: 'disconnected' });
          },
        });

        try {
          // Generate a truly unique peer ID to avoid conflicts
          // Include session-specific data for maximum uniqueness
          const sessionId = btoa(Math.random().toString()).substr(10, 10);
          const timestamp = Date.now();
          const uniquePeerId = myPeerId || `cs-${timestamp}-${sessionId}-${Math.random().toString(36).substr(2, 6)}`;
          console.log('[Heartbeat] Generating unique peer ID:', uniquePeerId);
          const peerId = await mesh.initialize(uniquePeerId);
          set({ mesh, myPeerId: peerId });
        } catch (error) {
          console.error('[Heartbeat] Failed to initialize mesh:', error);
        }
      },

      destroyMesh: () => {
        const { mesh } = get();
        if (mesh) {
          mesh.destroy();
          set({ mesh: null });
        }
      },

      setStatus: (status: HeartbeatStatus, note?: string) => {
        const entry: HeartbeatEntry = {
          timestamp: Date.now(),
          status,
          note,
        };

        set((state) => ({
          currentStatus: status,
          personalLog: [entry, ...state.personalLog].slice(0, 1000), // Keep last 1000
        }));

        // Broadcast to mesh
        const { mesh, myPeerId } = get();
        if (mesh && myPeerId) {
          const userName = localStorage.getItem('heartbeat-user-name') || 'User';
          mesh.broadcastStatus(status, userName, note);
        }

        // Reset dead man on status change
        get().checkIn();
      },

      checkIn: (note?: string) => {
        const now = Date.now();
        const entry: HeartbeatEntry = {
          timestamp: now,
          status: get().currentStatus,
          note,
        };

        set((state) => ({
          lastCheckIn: now,
          missedCheckIns: 0,
          isDeadManActive: false,
          personalLog: [entry, ...state.personalLog].slice(0, 1000),
        }));

        // Reset timer
        get().startDeadManTimer();

        // Broadcast status
        const { mesh, myPeerId, currentStatus } = get();
        if (mesh && myPeerId) {
          const userName = localStorage.getItem('heartbeat-user-name') || 'User';
          mesh.broadcastStatus(currentStatus, userName, note);
        }
      },

      setCheckInInterval: (intervalId: string) => {
        set({ checkInInterval: intervalId });
        get().startDeadManTimer();
      },

      startDeadManTimer: () => {
        // Clear existing timers
        if (checkInTimer) clearTimeout(checkInTimer);
        if (countdownInterval) clearInterval(countdownInterval);

        const interval = GOD_CONFIG.heartbeat.checkInIntervals.find(
          (i) => i.id === get().checkInInterval
        );

        if (!interval || interval.ms === 0) {
          set({ checkInTimerRemaining: 0, isDeadManActive: false });
          return;
        }

        set({
          checkInTimerRemaining: interval.ms,
          isDeadManActive: true,
        });

        // Start countdown
        countdownInterval = setInterval(() => {
          set((state) => {
            const remaining = state.checkInTimerRemaining - 1000;
            if (remaining <= 0) {
              // Timer expired - missed check-in
              get().handleMissedCheckIn();
              return { checkInTimerRemaining: 0 };
            }
            return { checkInTimerRemaining: remaining };
          });
        }, 1000);

        // Set expiration timer
        checkInTimer = setTimeout(() => {
          get().handleMissedCheckIn();
        }, interval.ms);
      },

      handleMissedCheckIn: () => {
        const { missedCheckIns, currentStatus } = get();
        const newMissed = missedCheckIns + 1;

        set({ missedCheckIns: newMissed });

        // Show notification
        if (notificationPermission === 'granted') {
          new Notification('Cognitive Shield - Check-In Reminder', {
            body: `You missed a check-in. Please confirm you're safe.`,
            icon: '/favicon.ico',
            tag: 'heartbeat-checkin',
          });
        }

        // Check escalation thresholds
        const thresholds = GOD_CONFIG.heartbeat.escalationThresholds;

        if (newMissed === thresholds.firstMiss) {
          // First miss - local alert only
          console.warn('[Heartbeat] First missed check-in');
        } else if (newMissed === thresholds.secondMiss) {
          // Second miss - broadcast to mesh
          const { mesh, myPeerId } = get();
          if (mesh && myPeerId) {
            const userName = localStorage.getItem('heartbeat-user-name') || 'User';
            mesh.broadcastStatus('orange', userName, 'Missed check-in');
          }
        } else if (newMissed >= thresholds.thirdMiss || shouldEscalate(currentStatus, newMissed)) {
          // Third miss or status-based escalation - trigger webhook
          get().triggerEscalation();
        }

        // Restart timer
        get().startDeadManTimer();
      },

      triggerEscalation: async () => {
        const {
          currentStatus,
          lastCheckIn,
          missedCheckIns,
          escalationConfig,
        } = get();

        if (!escalationConfig.enabled || !escalationConfig.webhookUrl) {
          return;
        }

        const userName = localStorage.getItem('heartbeat-user-name') || 'Unknown';
        const payload = {
          userId: get().myPeerId || 'unknown',
          userName,
          status: currentStatus,
          lastCheckIn,
          missedCheckIns,
          timestamp: Date.now(),
          note: `Missed ${missedCheckIns} check-ins`,
        };

        await sendEscalationWebhook(escalationConfig.webhookUrl, payload);
      },

      addPeer: (peerId: string, name: string) => {
        const peer: Peer = {
          id: peerId,
          name,
          lastSeen: Date.now(),
          status: 'green',
          statusHistory: [],
          connectionState: 'connecting',
        };

        set((state) => ({
          peers: [...state.peers.filter((p) => p.id !== peerId), peer],
        }));

        // Connect via mesh
        const { mesh } = get();
        if (mesh) {
          const myName = localStorage.getItem('heartbeat-user-name') || 'User';
          mesh.connectToPeer(peerId, myName).catch((error) => {
            console.error('[Heartbeat] Failed to connect to peer:', error);
            set((state) => ({
              peers: state.peers.map((p) =>
                p.id === peerId ? { ...p, connectionState: 'error' as const } : p
              ),
            }));
          });
        }
      },

      removePeer: (peerId: string) => {
        const { mesh } = get();
        if (mesh) {
          mesh.disconnectPeer(peerId);
        }

        set((state) => ({
          peers: state.peers.filter((p) => p.id !== peerId),
        }));
      },

      updatePeerStatus: (peerId: string, status: HeartbeatStatus) => {
        set((state) => ({
          peers: state.peers.map((p) =>
            p.id === peerId ? { ...p, status, lastSeen: Date.now() } : p
          ),
        }));
      },

      updatePeerConnectionState: (peerId: string, _state: Peer['connectionState']) => {
        set((state) => ({
          peers: state.peers.map((p) => (p.id === peerId ? { ...p, connectionState: state as Peer['connectionState'] } : p)),
        }));
      },

      setEscalationConfig: (config: Partial<EscalationConfig>) => {
        set((state) => ({
          escalationConfig: { ...state.escalationConfig, ...config },
        }));
      },

      generateConnectionCode: () => {
        const { myPeerId } = get();
        if (myPeerId) {
          const code = btoa(myPeerId);
          set({ connectionCode: code });
        }
      },

      clearConnectionCode: () => {
        set({ connectionCode: null });
      },

      resetDeadMan: () => {
        if (checkInTimer) clearTimeout(checkInTimer);
        if (countdownInterval) clearInterval(countdownInterval);
        set({
          missedCheckIns: 0,
          isDeadManActive: false,
          checkInTimerRemaining: 0,
        });
        get().startDeadManTimer();
      },

      exportLog: () => {
        const { personalLog } = get();
        return JSON.stringify(personalLog, null, 2);
      },

      // Daily Check-In Actions
      submitDailyCheckIn: (responses: CheckInResponse[]) => {
        const questions = GOD_CONFIG.dailyCheckIn.questions;
        const percentage = calculatePercentage(responses, [...questions]);
        const status = getStatusFromPercentage(percentage);
        
        // Calculate resonance (for storage)
        const state = responses.map((r) => {
          const q = questions.find((q) => q.id === r.questionId);
          return q ? (r.value - q.min) / (q.max - q.min) : 0.5;
        });
        const piDigits = Array.from({ length: state.length * 10 }, (_, i) => {
          const piStr = '31415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989';
          return parseInt(piStr[i % piStr.length], 10);
        });
        const resonance = state.reduce((sum, s, i) => {
          const piNorm = piDigits[i] / 9;
          const phase = 1 - Math.abs(s - piNorm);
          return sum + (phase / Math.pow(i + 1, 2));
        }, 0) / state.reduce((sum, _, i) => sum + (1 / Math.pow(i + 1, 2)), 0);

        const now = Date.now();
        const date = new Date(now).toISOString().split('T')[0]; // YYYY-MM-DD

        const checkIn: DailyCheckIn = {
          id: generateId(),
          timestamp: now,
          date,
          responses,
          percentage,
          resonance,
          status,
        };

        set((state) => {
          // Remove today's existing check-in if any
          const today = new Date().toISOString().split('T')[0];
          const filteredHistory = state.checkInHistory.filter((c) => c.date !== today);
          
          return {
            dailyCheckIn: checkIn,
            checkInHistory: [checkIn, ...filteredHistory].slice(0, 365), // Keep last 365 days
          };
        });
      },

      getTodayCheckIn: () => {
        const { dailyCheckIn } = get();
        if (!dailyCheckIn) return null;
        
        const today = new Date().toISOString().split('T')[0];
        if (dailyCheckIn.date === today) {
          return dailyCheckIn;
        }
        return null;
      },

      exportCheckInHistory: () => {
        const { checkInHistory } = get();
        return JSON.stringify(checkInHistory, null, 2);
      },
    }),
    {
      name: 'cognitive-shield-heartbeat',
      partialize: (state) => ({
        currentStatus: state.currentStatus,
        lastCheckIn: state.lastCheckIn,
        checkInInterval: state.checkInInterval,
        personalLog: state.personalLog.slice(0, 100), // Keep last 100 in storage
        escalationConfig: state.escalationConfig,
        myPeerId: state.myPeerId,
        dailyCheckIn: state.dailyCheckIn,
        checkInHistory: state.checkInHistory.slice(0, 90), // Keep last 90 days in storage
      }),
    }
  )
);

// Initialize mesh and start timer on store creation
if (typeof window !== 'undefined') {
  const store = useHeartbeatStore.getState();
  if (!store.mesh) {
    store.initializeMesh();
  }
  // Start dead man timer if interval is set
  if (store.checkInInterval && store.checkInInterval !== 'off') {
    store.startDeadManTimer();
  }
}

export default useHeartbeatStore;

