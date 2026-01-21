/**
 * LUANTI VOXEL STUDIO - QUANTUM VOXEL WORLD BUILDER
 * Complete voxel world creation with quantum mechanics integration
 *
 * Build Minecraft-like worlds with coherence effects, entanglement mechanics,
 * and real-time quantum state visualization
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';
import { luantiWorldEngine, type LuantiWASMInstance } from '../lib/luanti-world-engine';
import GOD_CONFIG from '../god.config';

// Voxel block types
const VOXEL_TYPES = {
  air: { color: '#87CEEB', name: 'Air' },
  stone: { color: '#808080', name: 'Stone' },
  dirt: { color: '#8B4513', name: 'Dirt' },
  grass: { color: '#228B22', name: 'Grass' },
  wood: { color: '#8B4513', name: 'Wood' },
  leaves: { color: '#32CD32', name: 'Leaves' },
  water: { color: '#4169E1', name: 'Water', transparent: true },
  quantum_crystal: { color: '#9370DB', name: 'Quantum Crystal', emissive: true },
  entangled_block: { color: '#FF1493', name: 'Entangled Block', emissive: true },
  coherence_core: { color: '#00FF7F', name: 'Coherence Core', emissive: true },
  resonance_crystal: { color: '#FFD700', name: 'Resonance Crystal', emissive: true }
};

// World dimensions
const WORLD_SIZE = 32;
const WORLD_HEIGHT = 16;

interface VoxelData {
  [key: string]: string; // position string -> voxel type
}

interface QuantumPlayer {
  name: string;
  position: { x: number; y: number; z: number };
  coherence: number;
  blocksPlaced: number;
  connected: boolean;
}

export default function LuantiVoxelStudio() {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // World state
  const [worldInstance, setWorldInstance] = useState<LuantiWASMInstance | null>(null);
  const [isWorldRunning, setIsWorldRunning] = useState(false);
  const [voxelData, setVoxelData] = useState<VoxelData>({});
  const [selectedVoxelType, setSelectedVoxelType] = useState('stone');
  const [players, setPlayers] = useState<Map<string, QuantumPlayer>>(new Map());
  const [worldStats, setWorldStats] = useState<any>(null);

  // Interaction state
  const [isPlacing, setIsPlacing] = useState(false);
  const [hoveredVoxel, setHoveredVoxel] = useState<string | null>(null);
  const [showQuantumEffects, setShowQuantumEffects] = useState(true);
  const [entangledBlocks, setEntangledBlocks] = useState<Map<string, string>>(new Map());

  // UI state
  const [activeTab, setActiveTab] = useState<'world' | 'players' | 'quantum' | 'blocks'>('world');
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  // Initialize Luanti engine
  useEffect(() => {
    const handleReady = () => {
      setIsReady(true);
      setIsLoading(false);
      console.log('🧱 Luanti Voxel Studio ready!');
    };

    const handleError = (data: any) => {
      setError(data.error);
      setIsLoading(false);
    };

    const handleWorldCreated = (data: any) => {
      console.log('🌍 Quantum voxel world created:', data.name);
      // Generate initial world
      generateInitialWorld();
    };

    const handleServerStarted = (data: any) => {
      setWorldInstance(data.instance);
      console.log('🚀 Quantum voxel server started');
    };

    const handleWorldRunning = (data: any) => {
      setIsWorldRunning(true);
      console.log('🏃 Quantum world is running');
    };

    const handleWorldUpdate = (data: any) => {
      // Update world state
      setWorldStats({
        players: data.worldData.players.size,
        entangledBlocks: data.worldData.entangledBlocks.size,
        quantumFields: data.worldData.quantumFields.length,
        averageCoherence: Array.from(data.worldData.players.values())
          .reduce((sum: number, p: any) => sum + p.coherence, 0) / data.worldData.players.size,
        totalBlocksPlaced: Array.from(data.worldData.players.values())
          .reduce((sum: number, p: any) => sum + p.blocksPlaced, 0)
      });

      // Update entangled blocks
      setEntangledBlocks(data.worldData.entangledBlocks);

      // Update players
      setPlayers(data.worldData.players);
    };

    const handlePlayerConnected = (data: any) => {
      console.log(`👤 Player ${data.player} connected`);
    };

    const handleBlockPlaced = (data: any) => {
      // Update voxel data
      const posKey = `${data.position.x}_${data.position.y}_${data.position.z}`;
      setVoxelData(prev => ({
        ...prev,
        [posKey]: data.blockType
      }));

      // Trigger quantum effects
      if (data.coherence > 0.7) {
        // High coherence - show entangled effect
        console.log(`✨ Quantum entangled block placed at ${posKey}`);
      } else if (data.coherence < 0.3) {
        // Low coherence - show decoherence effect
        console.log(`💥 Decoherence event at ${posKey}`);
      }
    };

    const handleEntangledBlockPlaced = (data: any) => {
      console.log(`🔗 Entangled blocks created: ${JSON.stringify(data.position)} ↔ ${JSON.stringify(data.entangledPosition)}`);
    };

    luantiWorldEngine.on('ready', handleReady);
    luantiWorldEngine.on('error', handleError);
    luantiWorldEngine.on('worldCreated', handleWorldCreated);
    luantiWorldEngine.on('serverStarted', handleServerStarted);
    luantiWorldEngine.on('worldRunning', handleWorldRunning);
    luantiWorldEngine.on('worldUpdate', handleWorldUpdate);
    luantiWorldEngine.on('playerConnected', handlePlayerConnected);
    luantiWorldEngine.on('blockPlaced', handleBlockPlaced);
    luantiWorldEngine.on('entangledBlockPlaced', handleEntangledBlockPlaced);

    // Check if already ready
    if (luantiWorldEngine.isReady) {
      handleReady();
    }

    return () => {
      luantiWorldEngine.off('ready', handleReady);
      luantiWorldEngine.off('error', handleError);
      luantiWorldEngine.off('worldCreated', handleWorldCreated);
      luantiWorldEngine.off('serverStarted', handleServerStarted);
      luantiWorldEngine.off('worldRunning', handleWorldRunning);
      luantiWorldEngine.off('worldUpdate', handleWorldUpdate);
      luantiWorldEngine.off('playerConnected', handlePlayerConnected);
      luantiWorldEngine.off('blockPlaced', handleBlockPlaced);
      luantiWorldEngine.off('entangledBlockPlaced', handleEntangledBlockPlaced);
    };
  }, []);

  // Generate initial world
  const generateInitialWorld = useCallback(() => {
    const newVoxelData: VoxelData = {};

    // Generate terrain
    for (let x = 0; x < WORLD_SIZE; x++) {
      for (let z = 0; z < WORLD_SIZE; z++) {
        const height = Math.floor(Math.random() * 4) + 8;

        for (let y = 0; y < height; y++) {
          let voxelType = 'stone';

          if (y === height - 1) {
            voxelType = Math.random() > 0.3 ? 'grass' : 'dirt';
          } else if (y > height - 4) {
            voxelType = 'dirt';
          }

          // Add some quantum crystals randomly
          if (Math.random() < 0.01) {
            voxelType = 'quantum_crystal';
          }

          newVoxelData[`${x}_${y}_${z}`] = voxelType;
        }
      }
    }

    // Add some trees
    for (let i = 0; i < 10; i++) {
      const x = Math.floor(Math.random() * (WORLD_SIZE - 4)) + 2;
      const z = Math.floor(Math.random() * (WORLD_SIZE - 4)) + 2;
      const height = Math.floor(Math.random() * 4) + 8;

      // Tree trunk
      for (let y = height; y < height + 4; y++) {
        newVoxelData[`${x}_${y}_${z}`] = 'wood';
      }

      // Leaves
      for (let dx = -2; dx <= 2; dx++) {
        for (let dy = 0; dy <= 2; dy++) {
          for (let dz = -2; dz <= 2; dz++) {
            if (Math.abs(dx) + Math.abs(dy) + Math.abs(dz) <= 3) {
              const leafX = x + dx;
              const leafZ = z + dz;
              const leafY = height + 4 + dy;

              if (leafX >= 0 && leafX < WORLD_SIZE && leafZ >= 0 && leafZ < WORLD_SIZE &&
                  leafY >= 0 && leafY < WORLD_HEIGHT) {
                newVoxelData[`${leafX}_${leafY}_${leafZ}`] = 'leaves';
              }
            }
          }
        }
      }
    }

    setVoxelData(newVoxelData);
  }, []);

  // Create new world
  const createNewWorld = async () => {
    try {
      await luantiWorldEngine.createQuantumWorld();
      await luantiWorldEngine.startQuantumServer();

      // Add some test players
      const testPlayers = ['QuantumBuilder', 'CoherenceMiner', 'VoxelExplorer'];
      for (const playerName of testPlayers) {
        await luantiWorldEngine.connectPlayer({
          name: playerName,
          position: {
            x: (Math.random() - 0.5) * 20,
            y: 10,
            z: (Math.random() - 0.5) * 20
          },
          coherence: 0.3 + Math.random() * 0.5
        });
      }

    } catch (error) {
      console.error('Failed to create world:', error);
      setError('Failed to create quantum world');
    }
  };

  // Handle voxel placement
  const handleVoxelClick = useCallback((position: [number, number, number], isRightClick: boolean) => {
    if (!isWorldRunning) return;

    const [x, y, z] = position;
    const posKey = `${x}_${y}_${z}`;

    if (isRightClick) {
      // Remove voxel
      setVoxelData(prev => {
        const newData = { ...prev };
        delete newData[posKey];
        return newData;
      });

      // Notify engine
      luantiWorldEngine.placeQuantumBlock({ x, y, z }, 'air', 'Player');

    } else {
      // Place voxel
      setVoxelData(prev => ({
        ...prev,
        [posKey]: selectedVoxelType
      }));

      // Notify engine
      luantiWorldEngine.placeQuantumBlock({ x, y, z }, selectedVoxelType, 'Player');

      // Update player coherence randomly (simulating player actions)
      const coherence = 0.2 + Math.random() * 0.7;
      luantiWorldEngine.updatePlayerQuantumState('Player', coherence, { x: x + 5, y: y + 2, z: z + 5 });
    }

    setIsPlacing(true);
    setTimeout(() => setIsPlacing(false), 100);
  }, [isWorldRunning, selectedVoxelType]);

  // Add some test entangled blocks
  const addTestEntangledBlocks = () => {
    if (!isWorldRunning) return;

    const positions = [
      [10, 8, 10],
      [20, 8, 20],
      [5, 8, 25],
      [25, 8, 5]
    ];

    positions.forEach(([x, y, z]) => {
      setVoxelData(prev => ({
        ...prev,
        [`${x}_${y}_${z}`]: 'entangled_block'
      }));
    });

    console.log('🔗 Test entangled blocks added');
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '400px',
        color: GOD_CONFIG.theme.text.primary
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🧱</div>
          <div style={{ fontSize: '18px', marginBottom: '10px' }}>Initializing Luanti Voxel Studio</div>
          <div style={{ fontSize: '14px', color: GOD_CONFIG.theme.text.secondary }}>
            Setting up quantum voxel world engine...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '24px',
        backgroundColor: GOD_CONFIG.theme.bg.secondary,
        borderRadius: '12px',
        textAlign: 'center',
        color: '#ef4444'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>❌</div>
        <div style={{ fontSize: '18px', marginBottom: '10px' }}>Luanti Voxel Error</div>
        <div style={{ fontSize: '14px' }}>{error}</div>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Reload Studio
        </button>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      height: '800px',
      backgroundColor: GOD_CONFIG.theme.bg.secondary,
      borderRadius: '12px',
      overflow: 'hidden',
      fontSize: '14px',
      color: GOD_CONFIG.theme.text.primary
    }}>
      {/* Sidebar */}
      <div style={{
        width: '280px',
        backgroundColor: GOD_CONFIG.theme.bg.primary,
        borderRight: `1px solid ${GOD_CONFIG.theme.border.default}`,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px',
          borderBottom: `1px solid ${GOD_CONFIG.theme.border.default}`
        }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#8b5cf6' }}>🧱 Luanti Voxel Studio</h3>

          {!isWorldRunning ? (
            <button
              onClick={createNewWorld}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#8b5cf6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              🌍 Create Quantum World
            </button>
          ) : (
            <div style={{ fontSize: '12px', color: '#22c55e' }}>
              ✅ Quantum World Active
            </div>
          )}
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: `1px solid ${GOD_CONFIG.theme.border.default}`
        }}>
          {[
            { id: 'world', label: '🌍 World', icon: '🌍' },
            { id: 'players', label: '👥 Players', icon: '👥' },
            { id: 'quantum', label: '⚛️ Quantum', icon: '⚛️' },
            { id: 'blocks', label: '🧱 Blocks', icon: '🧱' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                flex: 1,
                padding: '10px',
                background: activeTab === tab.id ? GOD_CONFIG.theme.bg.secondary : 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? `2px solid ${GOD_CONFIG.theme.text.accent}` : 'none',
                color: activeTab === tab.id ? GOD_CONFIG.theme.text.accent : GOD_CONFIG.theme.text.primary,
                cursor: 'pointer',
                fontSize: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label.split(' ')[1]}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          {activeTab === 'world' && (
            <div>
              <h4 style={{ margin: '0 0 12px 0' }}>World Stats</h4>
              {worldStats ? (
                <div style={{ fontSize: '12px', lineHeight: '1.6' }}>
                  <div>Players: {worldStats.players}</div>
                  <div>Blocks Placed: {worldStats.totalBlocksPlaced}</div>
                  <div>Entangled Blocks: {worldStats.entangledBlocks}</div>
                  <div>Quantum Fields: {worldStats.quantumFields}</div>
                  <div>Avg Coherence: {(worldStats.averageCoherence * 100).toFixed(1)}%</div>
                </div>
              ) : (
                <div style={{ color: GOD_CONFIG.theme.text.secondary, fontSize: '12px' }}>
                  Create a world to see stats
                </div>
              )}

              <div style={{ marginTop: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px' }}>
                  <input
                    type="checkbox"
                    checked={showQuantumEffects}
                    onChange={(e) => setShowQuantumEffects(e.target.checked)}
                  />
                  {' '}Show Quantum Effects
                </label>

                {isWorldRunning && (
                  <button
                    onClick={addTestEntangledBlocks}
                    style={{
                      width: '100%',
                      padding: '8px',
                      backgroundColor: '#ff1493',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      marginTop: '8px'
                    }}
                  >
                    🔗 Add Entangled Blocks
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'players' && (
            <div>
              <h4 style={{ margin: '0 0 12px 0' }}>Quantum Players</h4>
              {players.size > 0 ? (
                Array.from(players.entries()).map(([name, player]) => (
                  <div
                    key={name}
                    onClick={() => setSelectedPlayer(name)}
                    style={{
                      padding: '8px',
                      margin: '4px 0',
                      borderRadius: '4px',
                      backgroundColor: selectedPlayer === name ? '#8b5cf620' : 'transparent',
                      border: `1px solid ${selectedPlayer === name ? '#8b5cf6' : 'transparent'}`,
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{name}</div>
                    <div style={{ fontSize: '11px', color: GOD_CONFIG.theme.text.secondary }}>
                      Coherence: {(player.coherence * 100).toFixed(1)}% | Blocks: {player.blocksPlaced}
                    </div>
                    <div style={{
                      width: '100%',
                      height: '4px',
                      backgroundColor: '#333',
                      borderRadius: '2px',
                      marginTop: '4px'
                    }}>
                      <div style={{
                        width: `${player.coherence * 100}%`,
                        height: '100%',
                        backgroundColor: player.coherence > 0.6 ? '#22c55e' :
                                       player.coherence > 0.3 ? '#eab308' : '#ef4444',
                        borderRadius: '2px'
                      }} />
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ color: GOD_CONFIG.theme.text.secondary, fontSize: '12px' }}>
                  No players connected
                </div>
              )}
            </div>
          )}

          {activeTab === 'quantum' && (
            <div>
              <h4 style={{ margin: '0 0 12px 0' }}>Quantum Fields</h4>
              <div style={{ fontSize: '12px', lineHeight: '1.6' }}>
                <div>🌌 <strong>Coherence:</strong> Player actions affect quantum stability</div>
                <div>🔗 <strong>Entanglement:</strong> Linked blocks across space</div>
                <div>✨ <strong>Resonance:</strong> Amplifies quantum effects</div>
                <div>💥 <strong>Decoherence:</strong> Entropy increases with low coherence</div>
              </div>

              {selectedPlayer && players.has(selectedPlayer) && (
                <div style={{ marginTop: '16px' }}>
                  <h5 style={{ margin: '0 0 8px 0', fontSize: '12px' }}>
                    {selectedPlayer}'s Quantum State
                  </h5>
                  <div style={{ fontSize: '11px' }}>
                    <div>Position: {JSON.stringify(players.get(selectedPlayer)?.position)}</div>
                    <div>Coherence: {(players.get(selectedPlayer)?.coherence || 0 * 100).toFixed(1)}%</div>
                    <div>Connected: {players.get(selectedPlayer)?.connected ? '✅' : '❌'}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'blocks' && (
            <div>
              <h4 style={{ margin: '0 0 12px 0' }}>Block Palette</h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '8px'
              }}>
                {Object.entries(VOXEL_TYPES).map(([type, info]) => (
                  <button
                    key={type}
                    onClick={() => setSelectedVoxelType(type)}
                    style={{
                      padding: '8px',
                      backgroundColor: selectedVoxelType === type ? '#8b5cf620' : 'transparent',
                      border: `2px solid ${selectedVoxelType === type ? '#8b5cf6' : GOD_CONFIG.theme.border.default}`,
                      borderRadius: '4px',
                      cursor: 'pointer',
                      textAlign: 'center',
                      fontSize: '11px'
                    }}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: info.color,
                      borderRadius: '2px',
                      margin: '0 auto 4px',
                      border: info.emissive ? '1px solid #fff' : 'none',
                      boxShadow: info.emissive ? '0 0 4px rgba(255,255,255,0.5)' : 'none'
                    }} />
                    {info.name}
                  </button>
                ))}
              </div>

              <div style={{ marginTop: '16px', fontSize: '11px', color: GOD_CONFIG.theme.text.secondary }}>
                <strong>Controls:</strong><br />
                • Left click: Place block<br />
                • Right click: Remove block<br />
                • High coherence = quantum effects
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3D World View */}
      <div style={{ flex: 1, position: 'relative' }}>
        <Canvas camera={{ position: [WORLD_SIZE / 2, WORLD_SIZE / 2, WORLD_SIZE * 1.5], fov: 60 }}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 10]} intensity={0.8} />

          {/* Voxel World */}
          <VoxelWorld
            voxelData={voxelData}
            onVoxelClick={handleVoxelClick}
            hoveredVoxel={hoveredVoxel}
            setHoveredVoxel={setHoveredVoxel}
            entangledBlocks={entangledBlocks}
            players={players}
            showQuantumEffects={showQuantumEffects}
          />

          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        </Canvas>

        {/* UI Overlay */}
        {isPlacing && (
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            fontSize: '12px'
          }}>
            🏗️ Placing {VOXEL_TYPES[selectedVoxelType as keyof typeof VOXEL_TYPES]?.name || selectedVoxelType}...
          </div>
        )}

        {/* Instructions */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          right: '20px',
          backgroundColor: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '15px',
          borderRadius: '10px',
          fontSize: '12px'
        }}>
          <strong>🧱 Quantum Voxel World:</strong> Build with coherence mechanics |
          <span style={{ color: '#22c55e' }}>High coherence = quantum effects</span> |
          <span style={{ color: '#ef4444' }}>Low coherence = decoherence</span> |
          🔗 Entangled blocks link across space
        </div>
      </div>
    </div>
  );
}

// 3D Voxel World Component
function VoxelWorld({
  voxelData,
  onVoxelClick,
  hoveredVoxel,
  setHoveredVoxel,
  entangledBlocks,
  players,
  showQuantumEffects
}: {
  voxelData: VoxelData;
  onVoxelClick: (position: [number, number, number], isRightClick: boolean) => void;
  hoveredVoxel: string | null;
  setHoveredVoxel: (key: string | null) => void;
  entangledBlocks: Map<string, string>;
  players: Map<string, QuantumPlayer>;
  showQuantumEffects: boolean;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const entangledLinesRef = useRef<THREE.Group>(null);

  // Generate voxel instances
  useEffect(() => {
    if (!meshRef.current) return;

    const matrix = new THREE.Matrix4();
    let instanceIndex = 0;

    // Clear previous instances
    Object.keys(voxelData).forEach(key => {
      const [x, y, z] = key.split('_').map(Number);
      const voxelType = voxelData[key];

      if (voxelType !== 'air') {
        matrix.setPosition(x, y, z);
        meshRef.current!.setMatrixAt(instanceIndex, matrix);
        instanceIndex++;
      }
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    meshRef.current.count = instanceIndex;
  }, [voxelData]);

  // Update entangled lines
  useEffect(() => {
    if (!entangledLinesRef.current) return;

    // Clear previous lines
    while (entangledLinesRef.current.children.length > 0) {
      entangledLinesRef.current.remove(entangledLinesRef.current.children[0]);
    }

    // Add entangled connections
    entangledBlocks.forEach((pos2Str, pos1Str) => {
      const [x1, y1, z1] = pos1Str.split('_').map(Number);
      const [x2, y2, z2] = pos2Str.split('_').map(Number);

      // Create line geometry
      const points = [
        new THREE.Vector3(x1 + 0.5, y1 + 0.5, z1 + 0.5),
        new THREE.Vector3(x2 + 0.5, y2 + 0.5, z2 + 0.5)
      ];

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: '#ff1493',
        transparent: true,
        opacity: 0.6
      });

      const line = new THREE.Line(geometry, material);
      entangledLinesRef.current.add(line);
    });
  }, [entangledBlocks]);

  return (
    <group>
      {/* Voxel instances */}
      <instancedMesh ref={meshRef} args={[undefined, undefined, 10000]}>
        <boxGeometry args={[0.98, 0.98, 0.98]} />
        <meshStandardMaterial />
      </instancedMesh>

      {/* Entangled connection lines */}
      <group ref={entangledLinesRef} />

      {/* Players */}
      {Array.from(players.entries()).map(([name, player]) => (
        <QuantumPlayer
          key={name}
          name={name}
          position={[player.position.x, player.position.y, player.position.z]}
          coherence={player.coherence}
        />
      ))}

      {/* Quantum effects */}
      {showQuantumEffects && (
        <QuantumEffects entangledBlocks={entangledBlocks} />
      )}
    </group>
  );
}

// Quantum Player Component
function QuantumPlayer({ name, position, coherence }: {
  name: string;
  position: [number, number, number];
  coherence: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;

      // Coherence-based color and glow
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      if (coherence > 0.6) {
        material.emissive.setHex(0x22c55e);
        material.emissiveIntensity = coherence * 0.5;
      } else if (coherence > 0.3) {
        material.emissive.setHex(0xeab308);
        material.emissiveIntensity = coherence * 0.3;
      } else {
        material.emissive.setHex(0xef4444);
        material.emissiveIntensity = coherence * 0.2;
      }
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <capsuleGeometry args={[0.3, 0.6, 4, 8]} />
        <meshStandardMaterial
          color={coherence > 0.6 ? '#22c55e' : coherence > 0.3 ? '#eab308' : '#ef4444'}
          emissive="#000000"
          emissiveIntensity={0}
        />
      </mesh>

      {/* Player name label */}
      <Html position={[0, 1.5, 0]}>
        <div style={{
          backgroundColor: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '2px 6px',
          borderRadius: '3px',
          fontSize: '10px',
          whiteSpace: 'nowrap'
        }}>
          {name}: {(coherence * 100).toFixed(0)}%
        </div>
      </Html>
    </group>
  );
}

// Quantum Effects Component
function QuantumEffects({ entangledBlocks }: { entangledBlocks: Map<string, string> }) {
  const effectsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (effectsRef.current) {
      // Animate quantum particles around entangled blocks
      effectsRef.current.children.forEach((child, index) => {
        const time = state.clock.elapsedTime;
        child.position.y += Math.sin(time * 2 + index) * 0.01;
        child.rotation.y += 0.02;

        // Pulsing scale
        const scale = 1 + Math.sin(time * 3 + index) * 0.2;
        child.scale.setScalar(scale);
      });
    }
  });

  // Generate quantum particles around entangled blocks
  const quantumParticles = [];
  entangledBlocks.forEach((pos2Str, pos1Str) => {
    const [x1, y1, z1] = pos1Str.split('_').map(Number);
    const [x2, y2, z2] = pos2Str.split('_').map(Number);

    // Add particles around each entangled block
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2;
      quantumParticles.push({
        position: [
          x1 + 0.5 + Math.cos(angle) * 1.5,
          y1 + 1.5 + Math.sin(i * 1.5) * 0.5,
          z1 + 0.5 + Math.sin(angle) * 1.5
        ] as [number, number, number]
      });
    }
  });

  return (
    <group ref={effectsRef}>
      {quantumParticles.map((particle, i) => (
        <mesh key={`quantum-${i}`} position={particle.position}>
          <sphereGeometry args={[0.05, 6, 6]} />
          <meshBasicMaterial
            color="#8b5cf6"
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
    </group>
  );
}