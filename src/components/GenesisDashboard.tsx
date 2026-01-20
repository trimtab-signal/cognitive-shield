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
 * ║   GENESIS DASHBOARD - Enterprise Command Center                            ║
 * ║   The Sorcery Interface                                                   ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 * 
 * "THE NUMBERS ARE BEAUTIFUL"
 * 
 * Real-time telemetry, mesh network status, and quantum visualization
 * unified in a single enterprise-grade command interface.
 */

import { useState, useEffect, useMemo } from 'react';
import { usePhenixStore } from '../store/phenix.store';
import { PHI, fibonacci, TETRAHEDRON_VERTICES } from '../lib/sacred-geometry';

// ═══════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

interface TelemetryPacket {
  timestamp: number;
  voltage: number;
  spoons: number;
  battery: number;
  heap: number;
  frameCount: number;
}

interface MeshNode {
  id: number;
  callsign: string;
  status: 'online' | 'offline' | 'syncing';
  lastSeen: number;
  voltage: number;
  spoons: number;
  rssi: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATED COUNTER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function AnimatedNumber({ 
  value, 
  decimals = 0,
  prefix = '',
  suffix = '',
  className = ''
}: { 
  value: number; 
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const [displayed, setDisplayed] = useState(value);
  
  useEffect(() => {
    const duration = 500;
    const startTime = Date.now();
    const startValue = displayed;
    const delta = value - startValue;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out cubic)
      const eased = 1 - Math.pow(1 - progress, 3);
      
      setDisplayed(startValue + delta * eased);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value]);
  
  return (
    <span className={className}>
      {prefix}{displayed.toFixed(decimals)}{suffix}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// GOLDEN RATIO GAUGE
// ═══════════════════════════════════════════════════════════════════════════

function PhiGauge({ 
  value, 
  max, 
  label, 
  color,
  icon
}: { 
  value: number; 
  max: number; 
  label: string;
  color: string;
  icon: string;
}) {
  const percentage = (value / max) * 100;
  const fibSequence = fibonacci(8);
  
  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-2">
        <span className="text-zinc-400 text-sm flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          {label}
        </span>
        <span className="text-white font-mono">
          <AnimatedNumber value={value} /> / {max}
        </span>
      </div>
      
      {/* Main gauge bar */}
      <div className="h-3 bg-zinc-800 rounded-full overflow-hidden relative">
        <div 
          className="h-full transition-all duration-500 ease-out rounded-full"
          style={{ 
            width: `${percentage}%`,
            background: `linear-gradient(90deg, ${color}66, ${color})`,
            boxShadow: `0 0 20px ${color}66`
          }}
        />
        
        {/* Fibonacci markers */}
        {fibSequence.slice(2).map((fib, i) => {
          const markerPos = (fib / max) * 100;
          if (markerPos > 100) return null;
          return (
            <div
              key={i}
              className="absolute top-0 bottom-0 w-px bg-white/20"
              style={{ left: `${markerPos}%` }}
            />
          );
        })}
      </div>
      
      {/* Golden ratio indicator */}
      <div 
        className="absolute -bottom-1 w-2 h-2 bg-amber-400 rounded-full transform -translate-x-1/2"
        style={{ left: `${(1 / PHI) * 100}%` }}
        title={`φ⁻¹ = ${(1/PHI).toFixed(3)}`}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TETRAHEDRON STATUS PANEL
// ═══════════════════════════════════════════════════════════════════════════

function TetrahedronStatus({ nodes }: { nodes: MeshNode[] }) {
  const [rotationAngle, setRotationAngle] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setRotationAngle(a => (a + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);
  
  // Map nodes to tetrahedron vertices
  const nodePositions = TETRAHEDRON_VERTICES.map((v, i) => ({
    vertex: v,
    node: nodes[i] || null,
    angle: Math.atan2(v.y, v.x) + (rotationAngle * Math.PI / 180),
  }));
  
  return (
    <div className="relative h-48 bg-zinc-900/50 rounded-lg border border-zinc-700 overflow-hidden">
      {/* Rotating background grid */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,215,0,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,215,0,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          transform: `rotate(${rotationAngle * 0.1}deg)`,
        }}
      />
      
      {/* SVG Tetrahedron projection */}
      <svg className="absolute inset-0 w-full h-full" viewBox="-100 -100 200 200">
        {/* K4 edges */}
        {nodePositions.map((np1, i) => 
          nodePositions.slice(i + 1).map((np2, j) => {
            const x1 = Math.cos(np1.angle) * 60;
            const y1 = Math.sin(np1.angle) * 60;
            const x2 = Math.cos(np2.angle) * 60;
            const y2 = Math.sin(np2.angle) * 60;
            
            return (
              <line
                key={`${i}-${j}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#ffd700"
                strokeWidth="1"
                opacity="0.4"
              />
            );
          })
        )}
        
        {/* Nodes */}
        {nodePositions.map((np, i) => {
          const x = Math.cos(np.angle) * 60;
          const y = Math.sin(np.angle) * 60;
          const node = np.node;
          const color = node?.status === 'online' ? '#4ade80' : 
                       node?.status === 'syncing' ? '#fbbf24' : '#71717a';
          
          return (
            <g key={i} transform={`translate(${x}, ${y})`}>
              {/* Glow effect */}
              {node?.status === 'online' && (
                <circle r="15" fill={`${color}33`}>
                  <animate 
                    attributeName="r" 
                    values="12;18;12" 
                    dur="2s" 
                    repeatCount="indefinite" 
                  />
                </circle>
              )}
              
              {/* Node circle */}
              <circle 
                r="8" 
                fill="black" 
                stroke={color} 
                strokeWidth="2"
              />
              
              {/* Node ID */}
              <text 
                textAnchor="middle" 
                dy="3" 
                fill={color}
                fontSize="8"
                fontFamily="monospace"
              >
                {node?.callsign?.charAt(0) || '?'}
              </text>
            </g>
          );
        })}
        
        {/* Center nexus */}
        <circle r="4" fill="#00ffff" opacity="0.8">
          <animate 
            attributeName="opacity" 
            values="0.4;1;0.4" 
            dur="1.5s" 
            repeatCount="indefinite" 
          />
        </circle>
      </svg>
      
      {/* Labels */}
      <div className="absolute bottom-2 left-2 text-xs text-zinc-500">
        K₄ TOPOLOGY
      </div>
      <div className="absolute bottom-2 right-2 text-xs text-amber-400/60 font-mono">
        φ = {PHI.toFixed(6)}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TELEMETRY GRAPH
// ═══════════════════════════════════════════════════════════════════════════

function TelemetryGraph({ 
  data, 
  label, 
  color,
  max 
}: { 
  data: number[]; 
  label: string;
  color: string;
  max: number;
}) {
  const points = useMemo(() => {
    return data.map((value, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - (value / max) * 100;
      return `${x},${y}`;
    }).join(' ');
  }, [data, max]);
  
  const areaPoints = useMemo(() => {
    const linePoints = data.map((value, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - (value / max) * 100;
      return `${x},${y}`;
    });
    return `0,100 ${linePoints.join(' ')} 100,100`;
  }, [data, max]);
  
  const current = data[data.length - 1] || 0;
  
  return (
    <div className="bg-zinc-900/50 rounded-lg border border-zinc-700 p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-zinc-400 text-xs uppercase tracking-wider">{label}</span>
        <span className="text-white font-mono text-sm">
          <AnimatedNumber value={current} decimals={1} />
        </span>
      </div>
      
      <svg className="w-full h-16" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Grid lines */}
        {[25, 50, 75].map(y => (
          <line 
            key={y} 
            x1="0" 
            y1={y} 
            x2="100" 
            y2={y} 
            stroke="#333" 
            strokeWidth="0.5" 
          />
        ))}
        
        {/* Area fill */}
        <polygon 
          points={areaPoints} 
          fill={`${color}22`}
        />
        
        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Current value dot */}
        {data.length > 0 && (
          <circle
            cx="100"
            cy={100 - (current / max) * 100}
            r="3"
            fill={color}
          >
            <animate 
              attributeName="r" 
              values="2;4;2" 
              dur="1s" 
              repeatCount="indefinite" 
            />
          </circle>
        )}
      </svg>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// QUANTUM METRICS PANEL
// ═══════════════════════════════════════════════════════════════════════════

function QuantumMetrics() {
  const [qubits, setQubits] = useState<boolean[]>([false, false, false, false]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setQubits(prev => {
        const next = [...prev];
        const idx = Math.floor(Math.random() * 4);
        next[idx] = Math.random() > 0.5;
        return next;
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);
  
  const binaryValue = qubits.reduce((acc, bit, i) => acc + (bit ? Math.pow(2, 3 - i) : 0), 0);
  
  return (
    <div className="bg-zinc-900/50 rounded-lg border border-zinc-700 p-4">
      <div className="text-zinc-400 text-xs uppercase tracking-wider mb-3">
        QUANTUM STATE
      </div>
      
      <div className="flex items-center justify-center gap-2 mb-3">
        {qubits.map((bit, i) => (
          <div 
            key={i}
            className={`
              w-8 h-8 rounded-lg flex items-center justify-center
              font-mono text-lg transition-all duration-200
              ${bit 
                ? 'bg-cyan-500/30 text-cyan-400 shadow-lg shadow-cyan-500/20' 
                : 'bg-zinc-800 text-zinc-600'}
            `}
          >
            {bit ? '1' : '0'}
          </div>
        ))}
      </div>
      
      <div className="text-center">
        <span className="text-zinc-500 text-xs">|ψ⟩ = </span>
        <span className="text-cyan-400 font-mono">
          {qubits.map(b => b ? '1' : '0').join('')}
        </span>
        <span className="text-zinc-500 text-xs ml-2">
          = {binaryValue}
        </span>
      </div>
      
      <div className="mt-3 text-center text-[10px] text-zinc-600">
        Breaking barriers one qubit at a time
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function GenesisDashboard() {
  const { deviceState, isConnected, lastSync } = usePhenixStore();
  
  // Simulated telemetry history
  const [voltageHistory, setVoltageHistory] = useState<number[]>([5, 5, 5, 5, 5]);
  const [spoonsHistory, setSpoonsHistory] = useState<number[]>([10, 10, 10, 10, 10]);
  const [heapHistory, setHeapHistory] = useState<number[]>([266, 266, 266, 266, 266]);
  
  // Simulated mesh nodes (K4 tetrahedron)
  const meshNodes: MeshNode[] = [
    { id: 0x01, callsign: 'ARCHITECT', status: 'online', lastSeen: Date.now(), voltage: 5, spoons: 12, rssi: -45 },
    { id: 0x02, callsign: 'PHOENIX', status: isConnected ? 'online' : 'offline', lastSeen: lastSync || 0, voltage: deviceState?.voltage || 5, spoons: deviceState?.spoons || 10, rssi: -52 },
    { id: 0x03, callsign: 'BASH', status: 'offline', lastSeen: Date.now() - 300000, voltage: 3, spoons: 8, rssi: -78 },
    { id: 0x04, callsign: 'WILLOW', status: 'syncing', lastSeen: Date.now() - 5000, voltage: 6, spoons: 15, rssi: -61 },
  ];
  
  // Update history
  useEffect(() => {
    const interval = setInterval(() => {
      const v = deviceState?.voltage ?? 5;
      const s = deviceState?.spoons ?? 10;
      
      setVoltageHistory(prev => [...prev.slice(-29), v + (Math.random() - 0.5) * 0.5]);
      setSpoonsHistory(prev => [...prev.slice(-29), s + (Math.random() - 0.5) * 0.5]);
      setHeapHistory(prev => [...prev.slice(-29), 266 + (Math.random() - 0.5) * 10]);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [deviceState]);
  
  const voltage = deviceState?.voltage ?? 5;
  const spoons = deviceState?.spoons ?? 10;
  const battery = deviceState?.battery ?? 100;
  
  return (
    <div className="bg-[#0a0a0f] text-white p-6 rounded-xl border border-zinc-800 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-2xl font-light tracking-wider flex items-center gap-3">
            <span className="text-amber-400">⬡</span>
            GENESIS COMMAND
          </h2>
          <p className="text-zinc-500 text-sm mt-1">
            Enterprise Mesh Control Interface
          </p>
        </div>
        
        <div className="text-right">
          <div className={`flex items-center gap-2 ${isConnected ? 'text-green-400' : 'text-zinc-500'}`}>
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-zinc-600'}`} />
            {isConnected ? 'LINKED' : 'DISCONNECTED'}
          </div>
          <div className="text-zinc-600 text-xs mt-1 font-mono">
            v1.0.0 | K₄ Protocol
          </div>
        </div>
      </div>
      
      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Gauges */}
        <div className="space-y-4">
          <PhiGauge 
            value={voltage} 
            max={10} 
            label="VOLTAGE" 
            color="#ef4444"
            icon="⚡"
          />
          
          <PhiGauge 
            value={spoons} 
            max={20} 
            label="SPOONS" 
            color="#06b6d4"
            icon="🥄"
          />
          
          <PhiGauge 
            value={battery} 
            max={100} 
            label="BATTERY" 
            color="#22c55e"
            icon="🔋"
          />
          
          <QuantumMetrics />
        </div>
        
        {/* Center Column - Tetrahedron */}
        <div className="space-y-4">
          <TetrahedronStatus nodes={meshNodes} />
          
          {/* Node Status List */}
          <div className="space-y-2">
            {meshNodes.map((node) => (
              <div 
                key={node.id}
                className={`
                  flex items-center justify-between p-3 rounded-lg
                  border transition-all
                  ${node.status === 'online' 
                    ? 'bg-green-500/10 border-green-500/30' 
                    : node.status === 'syncing'
                    ? 'bg-amber-500/10 border-amber-500/30'
                    : 'bg-zinc-800/50 border-zinc-700/50'}
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    w-2 h-2 rounded-full
                    ${node.status === 'online' ? 'bg-green-400' :
                      node.status === 'syncing' ? 'bg-amber-400 animate-pulse' : 'bg-zinc-600'}
                  `} />
                  <div>
                    <div className="font-mono text-sm">{node.callsign}</div>
                    <div className="text-zinc-500 text-xs">
                      Node 0x{node.id.toString(16).padStart(2, '0').toUpperCase()}
                    </div>
                  </div>
                </div>
                
                <div className="text-right text-xs">
                  <div className="text-zinc-400">
                    ⚡{node.voltage} 🥄{node.spoons}
                  </div>
                  <div className="text-zinc-600">
                    {node.rssi} dBm
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Right Column - Graphs */}
        <div className="space-y-4">
          <TelemetryGraph 
            data={voltageHistory} 
            label="Voltage History" 
            color="#ef4444"
            max={10}
          />
          
          <TelemetryGraph 
            data={spoonsHistory} 
            label="Spoons History" 
            color="#06b6d4"
            max={20}
          />
          
          <TelemetryGraph 
            data={heapHistory} 
            label="Heap Memory (KB)" 
            color="#a855f7"
            max={300}
          />
          
          {/* Sacred Constants */}
          <div className="bg-zinc-900/50 rounded-lg border border-zinc-700 p-3">
            <div className="text-zinc-400 text-xs uppercase tracking-wider mb-2">
              SACRED CONSTANTS
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-zinc-500">φ</span>
                <span className="text-amber-400">{PHI.toFixed(8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">φ⁻¹</span>
                <span className="text-cyan-400">{(1/PHI).toFixed(8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">√5</span>
                <span className="text-violet-400">{Math.sqrt(5).toFixed(8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">τ</span>
                <span className="text-green-400">{(Math.PI * 2).toFixed(8)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-zinc-600 pt-4 border-t border-zinc-800">
        <div>MATH IS KING · THE GEOMETRY RULES</div>
        <div className="font-mono">
          {new Date().toISOString().split('T')[0]} · GENESIS GATE
        </div>
      </div>
    </div>
  );
}
