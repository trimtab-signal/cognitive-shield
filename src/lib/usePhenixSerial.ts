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

import { useState, useEffect, useCallback, useRef } from 'react';
import { create } from 'zustand';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface PhenixState {
  nodeId: number;
  callsign: string;
  name: string;
  role: string;
  voltage: number;
  spoons: number;
  mode: string;
  screen: string;
  battery: number;
  meshConnected: boolean;
  encoderDelta: number;
}

interface SerialStore {
  isConnected: boolean;
  port: SerialPort | null;
  state: PhenixState;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  sendCommand: (type: string, payload: any) => Promise<void>;
  updateState: (partial: Partial<PhenixState>) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// STORE
// ═══════════════════════════════════════════════════════════════════════════

export const useSerialStore = create<SerialStore>((set, get) => ({
  isConnected: false,
  port: null,
  state: {
    nodeId: 0,
    callsign: "WAITING",
    name: "Unknown",
    role: "Observer",
    voltage: 5,
    spoons: 10,
    mode: "normal",
    screen: "dashboard",
    battery: 0,
    meshConnected: false,
    encoderDelta: 0,
  },

  connect: async () => {
    try {
      if (!navigator.serial) {
        alert("Web Serial API not supported in this browser.");
        return;
      }

      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 115200 });

      set({ isConnected: true, port });

      // Start reading loop
      readLoop(port, get().updateState);
    } catch (err) {
      console.error("Failed to connect:", err);
    }
  },

  disconnect: async () => {
    const { port } = get();
    if (port) {
      await port.close();
      set({ isConnected: false, port: null });
    }
  },

  sendCommand: async (type, payload) => {
    const { port } = get();
    if (!port || !port.writable) return;

    const writer = port.writable.getWriter();
    const data = JSON.stringify({ type, payload }) + "\n";
    await writer.write(new TextEncoder().encode(data));
    writer.releaseLock();
  },

  updateState: (partial) => {
    set((s) => ({ state: { ...s.state, ...partial } }));
  },
}));

// ═══════════════════════════════════════════════════════════════════════════
// READER LOOP
// ═══════════════════════════════════════════════════════════════════════════

async function readLoop(port: SerialPort, updateState: (s: Partial<PhenixState>) => void) {
  const reader = port.readable?.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  if (!reader) return;

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || ""; // Keep incomplete line

      for (const line of lines) {
        if (line.trim().startsWith("{")) {
          try {
            const json = JSON.parse(line);
            updateState(json);
          } catch (e) {
            // Ignore invalid JSON (debug logs, etc.)
          }
        }
      }
    }
  } catch (err) {
    console.error("Read error:", err);
  } finally {
    reader.releaseLock();
  }
}
