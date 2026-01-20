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
 * Shield Store
 * Central nervous system for message processing
 * 
 * Manages: raw message intake, voltage assessment, HumanOS detection
 * 
 * CRITICAL: Integrates Catcher's Mitt 60-second buffer for voltage protection
 * High-voltage messages are HELD for 60 seconds before processing.
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { 
  ShieldState, 
  ShieldActions, 
  RawMessage, 
  ProcessedMessage
} from '../types';
import type { HumanOSType } from '../config/god.config';
import { analyzeMessage } from '../services/geodesic-engine';
import { HistoryService } from '../services/history.service';
import { CatchersMitt, type BufferedMessage, type VoltageStripData } from '../lib/catchers-mitt';

// ═══════════════════════════════════════════════════════════════════════════════
// GLOBAL MITT INSTANCE (singleton for message buffering)
// ═══════════════════════════════════════════════════════════════════════════════

const mitt = new CatchersMitt({
  bufferDuration: 60000, // 60 seconds - THE critical spec
  thresholds: {
    green: 30,    // Auto-release immediately
    yellow: 50,   // Buffer full duration
    red: 70,      // Require sanitization
    critical: 90, // Escalate to guardian
  },
  maxBufferSize: 50,
  autoSanitize: true,
  whitelist: [],
  blacklist: [],
});

// ═══════════════════════════════════════════════════════════════════════════════
// EXTENDED STATE WITH BUFFER
// ═══════════════════════════════════════════════════════════════════════════════

interface ExtendedShieldState extends ShieldState {
  // Buffer state
  bufferedMessages: BufferedMessage[];
  voltageStrip: VoltageStripData;
  bufferEnabled: boolean;
}

interface ExtendedShieldActions extends ShieldActions {
  // Buffer actions
  toggleBuffer: () => void;
  releaseMessage: (id: string) => void;
  filterMessage: (id: string) => void;
  whitelistSender: (sender: string) => void;
  blacklistSender: (sender: string) => void;
  getBufferedMessages: () => BufferedMessage[];
  getVoltageStrip: () => VoltageStripData;
}

interface ShieldStore extends ExtendedShieldState, ExtendedShieldActions {}

const initialState: ExtendedShieldState = {
  rawMessage: null,
  processedPayload: null,
  voltage: 0,
  curvature: 0,
  humanOS: null,
  domain: null,
  isProcessing: false,
  error: null,
  // Buffer state
  bufferedMessages: [],
  voltageStrip: { current: 0, trend: 'stable', color: 'green', label: 'Calm Waters' },
  bufferEnabled: true, // Buffer ON by default for protection
};

export const useShieldStore = create<ShieldStore>()(
  devtools(
    persist(
      (set, get) => {
        // Wire up mitt release callback to process messages
        mitt.onMessageRelease(async (bufferedMsg) => {
          const { bufferEnabled } = get();
          if (!bufferEnabled) return;
          
          // Convert BufferedMessage to RawMessage and process
          // Map mitt channels to RawMessage source types
          const channelMap: Record<string, 'email' | 'text' | 'chat' | 'manual'> = {
            email: 'email',
            sms: 'text',
            mesh: 'chat',
            direct: 'manual',
          };
          
          const rawMessage: RawMessage = {
            id: bufferedMsg.id,
            source: channelMap[bufferedMsg.metadata.channel] || 'manual',
            sender: bufferedMsg.sender,
            content: bufferedMsg.sanitizedContent || bufferedMsg.content,
            timestamp: new Date(bufferedMsg.receivedAt),
          };
          
          // Process through geodesic engine
          try {
            const processed = await analyzeMessage(rawMessage);
            
            set({
              processedPayload: processed,
              voltage: processed.voltage.score,
              humanOS: processed.senderOS,
              domain: processed.domain,
              isProcessing: false,
              bufferedMessages: mitt.getBuffered(),
              voltageStrip: mitt.getVoltageStrip(),
            });
            
            HistoryService.saveMessage(processed).catch(console.error);
          } catch (error) {
            console.error('[Shield] Failed to process released message:', error);
          }
        });

        return {
          ...initialState,

          /**
           * Submit raw message - NOW GOES THROUGH CATCHER'S MITT FIRST
           */
          submitMessage: async (message: RawMessage) => {
            const { bufferEnabled } = get();
            
            set({ 
              rawMessage: message, 
              isProcessing: true, 
              error: null 
            });

            if (bufferEnabled) {
              // ROUTE THROUGH CATCHER'S MITT
              const buffered = mitt.catch(
                message.content,
                message.sender,
                {
                  channel: message.source as 'email' | 'sms' | 'mesh' | 'direct',
                  priority: 'normal',
                }
              );
              
              // Update buffer state
              set({
                bufferedMessages: mitt.getBuffered(),
                voltageStrip: mitt.getVoltageStrip(),
                voltage: buffered.voltage,
              });
              
              // If immediately released (low voltage), process now
              if (buffered.status === 'released') {
                try {
                  const processed = await analyzeMessage(message);
                  
                  set({
                    processedPayload: processed,
                    voltage: processed.voltage.score,
                    humanOS: processed.senderOS,
                    domain: processed.domain,
                    isProcessing: false,
                  });

                  HistoryService.saveMessage(processed).catch(console.error);
                  const curvature = calculateCurvature(processed);
                  set({ curvature });
                } catch (error) {
                  set({ 
                    isProcessing: false, 
                    error: error instanceof Error ? error.message : 'Analysis failed' 
                  });
                }
              } else {
                // Message is buffered - waiting for release
                set({ 
                  isProcessing: false,
                  // Show user the message is in buffer
                });
                console.log(`[Shield] Message buffered. Voltage: ${buffered.voltage}. Release in ${Math.ceil((buffered.releaseAt - Date.now()) / 1000)}s`);
              }
            } else {
              // Buffer disabled - process immediately (legacy behavior)
              try {
                const processed = await analyzeMessage(message);
                
                set({
                  processedPayload: processed,
                  voltage: processed.voltage.score,
                  humanOS: processed.senderOS,
                  domain: processed.domain,
                  isProcessing: false,
                });

                HistoryService.saveMessage(processed).catch(console.error);
                const curvature = calculateCurvature(processed);
                set({ curvature });
              } catch (error) {
                set({ 
                  isProcessing: false, 
                  error: error instanceof Error ? error.message : 'Analysis failed' 
                });
              }
            }
          },

          /**
           * Toggle buffer on/off
           */
          toggleBuffer: () => {
            const current = get().bufferEnabled;
            set({ bufferEnabled: !current });
            console.log(`[Shield] Buffer ${!current ? 'ENABLED' : 'DISABLED'}`);
          },

          /**
           * Manually release a buffered message
           */
          releaseMessage: (id: string) => {
            mitt.release(id);
            set({
              bufferedMessages: mitt.getBuffered(),
              voltageStrip: mitt.getVoltageStrip(),
            });
          },

          /**
           * Filter (discard) a buffered message
           */
          filterMessage: (id: string) => {
            mitt.filter(id);
            set({
              bufferedMessages: mitt.getBuffered(),
              voltageStrip: mitt.getVoltageStrip(),
            });
          },

          /**
           * Add sender to whitelist (bypass buffer)
           */
          whitelistSender: (sender: string) => {
            mitt.whitelist(sender);
          },

          /**
           * Add sender to blacklist (auto-filter)
           */
          blacklistSender: (sender: string) => {
            mitt.blacklist(sender);
          },

          /**
           * Get current buffered messages
           */
          getBufferedMessages: () => mitt.getBuffered(),

          /**
           * Get voltage strip data
           */
          getVoltageStrip: () => mitt.getVoltageStrip(),

          /**
           * Clear current message and reset state
           */
          clearMessage: () => {
            set({
              rawMessage: null,
              processedPayload: null,
              voltage: 0,
              curvature: 0,
              humanOS: null,
              domain: null,
              error: null,
            });
          },

          /**
           * Mark that the operator has viewed the raw content
           */
          markRawViewed: () => {
            const { processedPayload } = get();
            if (processedPayload) {
              set({
                processedPayload: {
                  ...processedPayload,
                  rawViewed: true,
                },
              });
            }
          },

          /**
           * Clear error state
           */
          clearError: () => {
            set({ error: null });
          },
        };
      },
      {
        name: 'cognitive-shield-store',
        partialize: (state) => ({
          // Only persist non-sensitive data
          voltage: state.voltage,
          humanOS: state.humanOS,
          domain: state.domain,
          bufferEnabled: state.bufferEnabled,
        }),
      }
    ),
    { name: 'ShieldStore' }
  )
);

/**
 * Calculate Ollivier-Ricci curvature for the message
 * 
 * Positive curvature = "echo chamber" (over-smoothing)
 * Negative curvature = "bottleneck" (over-squashing)
 * Near zero = balanced information flow
 */
function calculateCurvature(message: ProcessedMessage): number {
  const { voltage, senderOS } = message;
  
  // Base curvature from voltage (high voltage = negative curvature)
  let curvature = 0.5 - (voltage.score / 20);
  
  // Adjust for OS mismatch (more mismatch = more negative)
  const osMismatchPenalty: Record<HumanOSType, number> = {
    guardian: 0.1,
    order: 0.05,
    achiever: 0.08,
    empath: 0.03,
    integrator: 0,
  };
  
  curvature -= osMismatchPenalty[senderOS] || 0;
  
  return Math.max(-1, Math.min(1, curvature));
}

// ═══════════════════════════════════════════════════════════════════════════════
// SELECTOR HOOKS
// ═══════════════════════════════════════════════════════════════════════════════

/** Get current voltage level */
export const useVoltage = () => useShieldStore((state) => state.voltage);

/** Get processing status */
export const useIsProcessing = () => useShieldStore((state) => state.isProcessing);

/** Get processed message */
export const useProcessedMessage = () => useShieldStore((state) => state.processedPayload);

/** Get detected HumanOS */
export const useDetectedOS = () => useShieldStore((state) => state.humanOS);

/** Get detected Domain */
export const useDetectedDomain = () => useShieldStore((state) => state.domain);

/** Get safe summary (if available) */
export const useSafeSummary = () => 
  useShieldStore((state) => state.processedPayload?.safeSummary ?? null);

/** Check if message is high voltage */
export const useIsHighVoltage = () => 
  useShieldStore((state) => state.voltage >= 7);

/** Get curvature for network health display */
export const useCurvature = () => useShieldStore((state) => state.curvature);

/** Get buffered messages */
export const useBufferedMessages = () => useShieldStore((state) => state.bufferedMessages);

/** Get voltage strip data */
export const useVoltageStrip = () => useShieldStore((state) => state.voltageStrip);

/** Get buffer enabled status */
export const useBufferEnabled = () => useShieldStore((state) => state.bufferEnabled);
