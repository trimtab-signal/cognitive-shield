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
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║   PHENIX HARDWARE PANEL - The "Psychic Link" UI                            ║
 * ║   WebSerial bridge to Phenix Navigator hardware                           ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 * 
 * MATH IS KING. THE GEOMETRY RULES.
 */

import { useState, useMemo, useEffect } from 'react';
import { usePhenixStore } from '../store/phenix.store';
import { PhenixBridge, CORE_TETRAHEDRON, type LEDPattern } from '../lib/phenix-protocol';

export default function PhenixHardwarePanel() {
  const {
    isConnected,
    isConnecting,
    connectionError,
    deviceState,
    lastSync,
    tetrahedronValid,
    connect,
    disconnect,
    setVoltage,
    setSpoons,
    enterGrounding,
    exitGrounding,
    triggerHaptic,
    setLEDPattern,
  } = usePhenixStore();

  const [ledPattern, setLedPatternLocal] = useState<LEDPattern>('pulse');
  const [currentTime, setCurrentTime] = useState(() => Date.now());

  const webSerialSupported = PhenixBridge.isSupported();

  // Update current time every second for sync display
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Format last sync time (pure computation)
  const lastSyncFormatted = useMemo(() => {
    if (!lastSync) return 'Never';
    const diff = currentTime - lastSync;
    if (diff < 1000) return 'Just now';
    if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
    return `${Math.floor(diff / 60000)}m ago`;
  }, [lastSync, currentTime]);

  return (
    <div className="bg-[#141416] border border-zinc-800 rounded-lg p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-mono text-white flex items-center gap-2">
          <span className="text-2xl">📡</span>
          Phenix Hardware
        </h3>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <span className="flex items-center gap-1.5 text-green-400 text-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Connected
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-zinc-500 text-sm">
              <span className="w-2 h-2 bg-zinc-600 rounded-full" />
              Disconnected
            </span>
          )}
        </div>
      </div>

      {/* WebSerial Support Check */}
      {!webSerialSupported && (
        <div className="bg-red-900/30 border border-red-700 rounded p-3 text-red-300 text-sm">
          <strong>WebSerial not supported.</strong>
          <p className="text-red-400 mt-1">
            Use Chrome, Edge, or Opera on desktop to connect to Phenix hardware.
          </p>
        </div>
      )}

      {/* Connection Error */}
      {connectionError && (
        <div className="bg-orange-900/30 border border-orange-700 rounded p-3 text-orange-300 text-sm">
          <strong>Connection Error:</strong> {connectionError}
        </div>
      )}

      {/* Connect/Disconnect Button */}
      <div className="flex gap-2">
        {!isConnected ? (
          <button
            onClick={() => connect()}
            disabled={!webSerialSupported || isConnecting}
            className="flex-1 bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-700 
                       disabled:text-zinc-500 text-white font-mono py-2 px-4 rounded
                       transition-colors"
          >
            {isConnecting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⟳</span> Connecting...
              </span>
            ) : (
              '🔗 Connect to Phenix'
            )}
          </button>
        ) : (
          <button
            onClick={() => disconnect()}
            className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white font-mono 
                       py-2 px-4 rounded transition-colors"
          >
            ⛓️‍💥 Disconnect
          </button>
        )}
      </div>

      {/* K4 Topology Status */}
      <div className="bg-zinc-900/50 rounded p-3 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-400">K₄ Topology</span>
          <span className={tetrahedronValid ? 'text-green-400' : 'text-red-400'}>
            {tetrahedronValid ? '✓ Valid (4 nodes)' : '✗ Invalid'}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {CORE_TETRAHEDRON.map((node) => (
            <div
              key={node.nodeId}
              className="bg-zinc-800 rounded px-2 py-1 flex items-center justify-between"
            >
              <span className="text-zinc-300">{node.callsign}</span>
              <span className="text-zinc-500">0x{node.nodeId.toString(16).padStart(2, '0')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Device State (when connected) */}
      {isConnected && deviceState && (
        <div className="space-y-3">
          {/* Device Identity */}
          <div className="bg-zinc-900/50 rounded p-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-zinc-500">Callsign</span>
                <p className="text-white font-mono">{deviceState.callsign}</p>
              </div>
              <div>
                <span className="text-zinc-500">Name</span>
                <p className="text-white">{deviceState.name}</p>
              </div>
              <div>
                <span className="text-zinc-500">Role</span>
                <p className="text-violet-400">{deviceState.role}</p>
              </div>
              <div>
                <span className="text-zinc-500">Node ID</span>
                <p className="text-cyan-400 font-mono">0x{deviceState.nodeId.toString(16).padStart(2, '0')}</p>
              </div>
            </div>
          </div>

          {/* Telemetry */}
          <div className="bg-zinc-900/50 rounded p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 text-sm">Last Sync</span>
              <span className="text-zinc-500 text-sm">{lastSyncFormatted}</span>
            </div>

            {/* Battery */}
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-zinc-400">🔋 Battery</span>
                <span className={
                  deviceState.battery > 50 ? 'text-green-400' :
                  deviceState.battery > 20 ? 'text-yellow-400' : 'text-red-400'
                }>
                  {deviceState.battery}%
                </span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    deviceState.battery > 50 ? 'bg-green-500' :
                    deviceState.battery > 20 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${deviceState.battery}%` }}
                />
              </div>
            </div>

            {/* Voltage */}
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <label htmlFor="phenix-voltage" className="text-zinc-400">⚡ Voltage</label>
                <span className={
                  deviceState.voltage <= 3 ? 'text-green-400' :
                  deviceState.voltage <= 6 ? 'text-yellow-400' : 'text-red-400'
                }>
                  {deviceState.voltage}/10
                </span>
              </div>
              <input
                id="phenix-voltage"
                type="range"
                min="1"
                max="10"
                value={deviceState.voltage}
                onChange={(e) => setVoltage(Number(e.target.value))}
                className="w-full accent-violet-500"
                title="Adjust voltage level (1-10)"
              />
            </div>

            {/* Spoons */}
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <label htmlFor="phenix-spoons" className="text-zinc-400">🥄 Spoons</label>
                <span className={
                  deviceState.spoons >= 8 ? 'text-green-400' :
                  deviceState.spoons >= 4 ? 'text-yellow-400' : 'text-red-400'
                }>
                  {deviceState.spoons}/20
                </span>
              </div>
              <input
                id="phenix-spoons"
                type="range"
                min="0"
                max="20"
                value={deviceState.spoons}
                onChange={(e) => setSpoons(Number(e.target.value))}
                className="w-full accent-cyan-500"
                title="Adjust spoons level (0-20)"
              />
            </div>

            {/* Mode & Screen */}
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-zinc-500">Mode</span>
                <p className="text-violet-400 capitalize">{deviceState.mode}</p>
              </div>
              <div>
                <span className="text-zinc-500">Screen</span>
                <p className="text-cyan-400 capitalize">{deviceState.screen}</p>
              </div>
            </div>

            {/* Mesh Status */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-400">📶 Mesh</span>
              <span className={deviceState.meshConnected ? 'text-green-400' : 'text-zinc-500'}>
                {deviceState.meshConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <p className="text-zinc-500 text-xs uppercase tracking-wider">Quick Actions</p>
            
            {/* Grounding */}
            <div className="flex gap-2">
              <button
                onClick={() => enterGrounding()}
                className="flex-1 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-600 
                           text-blue-300 font-mono py-2 px-3 rounded text-sm transition-colors"
              >
                🧘 Enter Grounding
              </button>
              <button
                onClick={() => exitGrounding()}
                className="flex-1 bg-zinc-700/50 hover:bg-zinc-700 border border-zinc-600 
                           text-zinc-300 font-mono py-2 px-3 rounded text-sm transition-colors"
              >
                ⬆️ Exit Grounding
              </button>
            </div>

            {/* Haptics */}
            <div className="flex gap-2">
              <button
                onClick={() => triggerHaptic('click')}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-1 px-2 
                           rounded text-xs transition-colors"
              >
                Click
              </button>
              <button
                onClick={() => triggerHaptic('detent')}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-1 px-2 
                           rounded text-xs transition-colors"
              >
                Detent
              </button>
              <button
                onClick={() => triggerHaptic('success')}
                className="flex-1 bg-green-800/50 hover:bg-green-700/50 text-green-300 py-1 px-2 
                           rounded text-xs transition-colors"
              >
                Success
              </button>
              <button
                onClick={() => triggerHaptic('error')}
                className="flex-1 bg-red-800/50 hover:bg-red-700/50 text-red-300 py-1 px-2 
                           rounded text-xs transition-colors"
              >
                Error
              </button>
            </div>

            {/* LED Pattern */}
            <div className="flex gap-2 items-center">
              <select
                value={ledPattern}
                onChange={(e) => setLedPatternLocal(e.target.value as LEDPattern)}
                title="Select LED pattern"
                className="flex-1 bg-zinc-800 border border-zinc-700 text-white 
                           py-1 px-2 rounded text-sm"
              >
                <option value="off">LED: Off</option>
                <option value="pulse">LED: Pulse</option>
                <option value="rainbow">LED: Rainbow</option>
                <option value="alert">LED: Alert</option>
                <option value="party">LED: Party</option>
              </select>
              <button
                onClick={() => setLEDPattern(ledPattern)}
                className="bg-amber-600/30 hover:bg-amber-600/50 border border-amber-600 
                           text-amber-300 font-mono py-1 px-3 rounded text-sm transition-colors"
              >
                Set
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Not Connected State */}
      {!isConnected && (
        <div className="text-center py-4">
          <p className="text-zinc-500 text-sm">
            Connect your Phenix Navigator via USB to enable hardware sync.
          </p>
          <p className="text-zinc-600 text-xs mt-2">
            The "Psychic Link" synchronizes voltage, spoons, and mode between
            the hardware device and the Cognitive Shield.
          </p>
        </div>
      )}
    </div>
  );
}
