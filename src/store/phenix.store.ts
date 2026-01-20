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
 * PHENIX HARDWARE STORE
 * Zustand store for Phenix Navigator hardware connection
 * 
 * MATH IS KING. THE GEOMETRY RULES.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  PhenixBridge,
  createPhenixBridge,
  type PhenixState,
  type HapticType,
  type LEDPattern,
  CORE_TETRAHEDRON,
  validateK4Topology,
} from '../lib/phenix-protocol';

// ═══════════════════════════════════════════════════════════════════════════
// STATE INTERFACE
// ═══════════════════════════════════════════════════════════════════════════

interface PhenixStoreState {
  // Connection status
  isConnected: boolean;
  isConnecting: boolean;
  connectionError: string | null;
  
  // Device state (from Phenix hardware)
  deviceState: PhenixState | null;
  
  // Last sync timestamp
  lastSync: number | null;
  
  // K4 topology status
  tetrahedronValid: boolean;
}

interface PhenixStoreActions {
  // Connection management
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  
  // State sync
  syncState: () => Promise<void>;
  
  // Commands
  setVoltage: (voltage: number) => Promise<void>;
  setSpoons: (spoons: number) => Promise<void>;
  enterGrounding: () => Promise<void>;
  exitGrounding: () => Promise<void>;
  triggerHaptic: (type: HapticType) => Promise<void>;
  setLEDPattern: (pattern: LEDPattern) => Promise<void>;
  broadcastMesh: (message: string) => Promise<void>;
  
  // Internal
  _updateDeviceState: (state: PhenixState) => void;
  _setConnected: (connected: boolean) => void;
  _setError: (error: string | null) => void;
}

type PhenixStore = PhenixStoreState & PhenixStoreActions;

// ═══════════════════════════════════════════════════════════════════════════
// BRIDGE SINGLETON
// ═══════════════════════════════════════════════════════════════════════════

let bridge: PhenixBridge | null = null;

// ═══════════════════════════════════════════════════════════════════════════
// STORE IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════════════

const initialState: PhenixStoreState = {
  isConnected: false,
  isConnecting: false,
  connectionError: null,
  deviceState: null,
  lastSync: null,
  tetrahedronValid: validateK4Topology(CORE_TETRAHEDRON),
};

export const usePhenixStore = create<PhenixStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      connect: async () => {
        if (get().isConnected || get().isConnecting) return;
        
        set({ isConnecting: true, connectionError: null });

        try {
          // Check WebSerial support
          if (!PhenixBridge.isSupported()) {
            throw new Error(
              'WebSerial not supported. Use Chrome, Edge, or Opera on desktop.'
            );
          }

          // Create bridge with callbacks
          bridge = createPhenixBridge({
            onStateUpdate: (state) => {
              get()._updateDeviceState(state);
            },
            onConnected: () => {
              get()._setConnected(true);
            },
            onDisconnected: () => {
              get()._setConnected(false);
            },
            onError: (error) => {
              get()._setError(error.message);
            },
          });

          await bridge.connect();
          
          set({ isConnecting: false });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Connection failed';
          set({ 
            isConnecting: false, 
            connectionError: message,
          });
          throw error;
        }
      },

      disconnect: async () => {
        if (bridge) {
          await bridge.disconnect();
          bridge = null;
        }
        set({ isConnected: false, deviceState: null });
      },

      syncState: async () => {
        if (!bridge?.isConnected()) {
          throw new Error('Not connected to Phenix');
        }
        
        const { deviceState } = get();
        if (deviceState) {
          await bridge.syncState(deviceState);
        }
      },

      setVoltage: async (voltage: number) => {
        if (!bridge?.isConnected()) {
          throw new Error('Not connected to Phenix');
        }
        await bridge.setVoltage(voltage);
      },

      setSpoons: async (spoons: number) => {
        if (!bridge?.isConnected()) {
          throw new Error('Not connected to Phenix');
        }
        await bridge.setSpoons(spoons);
      },

      enterGrounding: async () => {
        if (!bridge?.isConnected()) {
          throw new Error('Not connected to Phenix');
        }
        await bridge.enterGrounding();
      },

      exitGrounding: async () => {
        if (!bridge?.isConnected()) {
          throw new Error('Not connected to Phenix');
        }
        await bridge.exitGrounding();
      },

      triggerHaptic: async (type: HapticType) => {
        if (!bridge?.isConnected()) {
          throw new Error('Not connected to Phenix');
        }
        await bridge.triggerHaptic(type);
      },

      setLEDPattern: async (pattern: LEDPattern) => {
        if (!bridge?.isConnected()) {
          throw new Error('Not connected to Phenix');
        }
        await bridge.setLEDPattern(pattern);
      },

      broadcastMesh: async (message: string) => {
        if (!bridge?.isConnected()) {
          throw new Error('Not connected to Phenix');
        }
        await bridge.broadcastMesh(message);
      },

      // Internal actions
      _updateDeviceState: (state: PhenixState) => {
        set({ 
          deviceState: state, 
          lastSync: Date.now(),
        });
      },

      _setConnected: (connected: boolean) => {
        set({ 
          isConnected: connected,
          isConnecting: false,
        });
      },

      _setError: (error: string | null) => {
        set({ connectionError: error });
      },
    }),
    {
      name: 'phenix-hardware',
      partialize: (state) => ({
        // Only persist connection settings, not volatile state
        tetrahedronValid: state.tetrahedronValid,
      }),
    }
  )
);

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export default usePhenixStore;
