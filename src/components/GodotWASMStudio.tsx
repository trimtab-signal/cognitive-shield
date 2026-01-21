/**
 * GODOT WASM STUDIO - SOVEREIGN GAME DEVELOPMENT ENVIRONMENT
 * Complete Godot game engine integration via WebAssembly
 *
 * Create, edit, and run Godot games directly in the browser
 * without external dependencies or cloud services
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { godotWASMRuntime, type GodotWASMInstance } from '../lib/godot-wasm-engine';
import GOD_CONFIG from '../god.config';

// Godot project file types
const GODOT_FILE_TYPES = {
  '.gd': 'GDScript',
  '.tscn': 'Scene',
  '.tres': 'Resource',
  '.godot': 'Project',
  '.png': 'Texture',
  '.wav': 'Audio',
  '.obj': 'Model',
  '.mtl': 'Material'
};

// Godot scene node types
const GODOT_NODE_TYPES = {
  'Node3D': { icon: '📦', color: '#8b5cf6' },
  'CharacterBody3D': { icon: '🏃', color: '#22c55e' },
  'MeshInstance3D': { icon: '🔺', color: '#3b82f6' },
  'Camera3D': { icon: '📷', color: '#f59e0b' },
  'DirectionalLight3D': { icon: '☀️', color: '#eab308' },
  'Control': { icon: '🎛️', color: '#ec4899' },
  'Label': { icon: '📝', color: '#6b7280' },
  'Button': { icon: '🔘', color: '#22c55e' }
};

interface GodotProject {
  name: string;
  files: GodotFile[];
  scenes: GodotScene[];
  currentScene: string | null;
  isExported: boolean;
  exportUrl: string | null;
}

interface GodotFile {
  name: string;
  path: string;
  type: string;
  content: string;
  isModified: boolean;
}

interface GodotScene {
  name: string;
  path: string;
  nodes: SceneNode[];
}

interface SceneNode {
  name: string;
  type: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  children: SceneNode[];
}

export default function GodotWASMStudio() {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Project state
  const [project, setProject] = useState<GodotProject | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState('');
  const [isFileDirty, setIsFileDirty] = useState(false);

  // Game runtime
  const [gameInstance, setGameInstance] = useState<GodotWASMInstance | null>(null);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [gameStats, setGameStats] = useState({
    coherence: 0.35,
    energy: 100,
    score: 0,
    frame: 0
  });

  // UI state
  const [activeTab, setActiveTab] = useState<'editor' | 'scene' | 'preview' | 'export'>('editor');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const gameCanvasRef = useRef<HTMLDivElement>(null);

  // Initialize Godot runtime
  useEffect(() => {
    const handleReady = () => {
      setIsReady(true);
      setIsLoading(false);
      console.log('🎮 Godot WASM Studio ready!');
    };

    const handleError = (data: any) => {
      setError(data.error);
      setIsLoading(false);
    };

    const handleProjectCreated = (data: any) => {
      // Create initial project structure
      const initialProject: GodotProject = {
        name: data.name,
        files: [
          { name: 'project.godot', path: 'project.godot', type: 'Project', content: getTemplateContent('project.godot'), isModified: false },
          { name: 'main.tscn', path: 'scenes/main.tscn', type: 'Scene', content: getTemplateContent('scenes/main.tscn'), isModified: false },
          { name: 'player.gd', path: 'scripts/player.gd', type: 'GDScript', content: getTemplateContent('scripts/player.gd'), isModified: false },
          { name: 'quantum_field.gd', path: 'scripts/quantum_field.gd', type: 'GDScript', content: getTemplateContent('scripts/quantum_field.gd'), isModified: false }
        ],
        scenes: [
          {
            name: 'Main',
            path: 'scenes/main.tscn',
            nodes: [
              { name: 'Ground', type: 'MeshInstance3D', position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1], children: [] },
              { name: 'Player', type: 'CharacterBody3D', position: [0, 1, 0], rotation: [0, 0, 0], scale: [1, 1, 1], children: [] },
              { name: 'QuantumField', type: 'Node3D', position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1], children: [] }
            ]
          }
        ],
        currentScene: 'scenes/main.tscn',
        isExported: false,
        exportUrl: null
      };

      setProject(initialProject);
      console.log('📁 Quantum game project created');
    };

    const handleGameLoaded = (data: any) => {
      setGameInstance(data.instance);
      console.log('🎮 Game loaded successfully');
    };

    const handleGameStarted = () => {
      setIsGameRunning(true);
      console.log('▶️ Game started');
    };

    const handleGameUpdate = (data: any) => {
      setGameStats({
        coherence: data.coherence,
        energy: data.energy,
        score: data.score,
        frame: data.frame
      });
    };

    const handleGameEnded = () => {
      setIsGameRunning(false);
      console.log('⏹️ Game ended');
    };

    godotWASMRuntime.on('ready', handleReady);
    godotWASMRuntime.on('error', handleError);
    godotWASMRuntime.on('projectCreated', handleProjectCreated);
    godotWASMRuntime.on('gameLoaded', handleGameLoaded);
    godotWASMRuntime.on('gameStarted', handleGameStarted);
    godotWASMRuntime.on('gameUpdate', handleGameUpdate);
    godotWASMRuntime.on('gameEnded', handleGameEnded);

    // Check if already ready
    if (godotWASMRuntime.isReady) {
      handleReady();
    }

    return () => {
      godotWASMRuntime.off('ready', handleReady);
      godotWASMRuntime.off('error', handleError);
      godotWASMRuntime.off('projectCreated', handleProjectCreated);
      godotWASMRuntime.off('gameLoaded', handleGameLoaded);
      godotWASMRuntime.off('gameStarted', handleGameStarted);
      godotWASMRuntime.off('gameUpdate', handleGameUpdate);
      godotWASMRuntime.off('gameEnded', handleGameEnded);
    };
  }, []);

  // Template content helper
  const getTemplateContent = (filename: string): string => {
    const templates: Record<string, string> = {
      'project.godot': `[application]
config/name="Quantum Game"
config/description="A quantum-enhanced Godot game"
run/main_scene="res://scenes/main.tscn"`,
      'scenes/main.tscn': `[gd_scene load_steps=4 format=3]
[ext_resource type="Script" path="res://scripts/player.gd" id="1"]
[sub_resource type="BoxMesh" id="BoxMesh"]
[node name="Main" type="Node3D"]
[node name="Ground" type="MeshInstance3D" parent="."]`,
      'scripts/player.gd': `extends CharacterBody3D

var coherence = 0.35
var quantum_energy = 100.0

func _ready():
    pass

func _physics_process(delta):
    # Movement code here
    pass`,
      'scripts/quantum_field.gd': `extends Node3D

func _ready():
    # Initialize quantum field
    pass`
    };
    return templates[filename] || '';
  };

  // Create new project
  const createNewProject = async () => {
    try {
      await godotWASMRuntime.createQuantumGame();
    } catch (error) {
      console.error('Failed to create project:', error);
      setError('Failed to create project');
    }
  };

  // Load file
  const loadFile = useCallback((filePath: string) => {
    if (!project) return;

    const file = project.files.find(f => f.path === filePath);
    if (file) {
      setFileContent(file.content);
      setSelectedFile(filePath);
      setIsFileDirty(false);
    }
  }, [project]);

  // Save file
  const saveFile = useCallback(() => {
    if (!project || !selectedFile) return;

    const updatedFiles = project.files.map(file =>
      file.path === selectedFile
        ? { ...file, content: fileContent, isModified: false }
        : file
    );

    setProject({ ...project, files: updatedFiles });
    setIsFileDirty(false);
    console.log(`💾 Saved ${selectedFile}`);
  }, [project, selectedFile, fileContent]);

  // Run game
  const runGame = async () => {
    if (!project) return;

    try {
      const instance = await godotWASMRuntime.loadGame(project);
      setGameInstance(instance);
    } catch (error) {
      console.error('Failed to run game:', error);
      setError('Failed to run game');
    }
  };

  // Stop game
  const stopGame = () => {
    godotWASMRuntime.stopGame();
  };

  // Export to WASM
  const exportToWASM = async () => {
    if (!project) return;

    try {
      const exportUrl = await godotWASMRuntime.exportToWASM();
      setProject({ ...project, isExported: true, exportUrl });
      console.log('📦 Game exported to WebAssembly');
    } catch (error) {
      console.error('Failed to export:', error);
      setError('Failed to export game');
    }
  };

  // Get file icon
  const getFileIcon = (filename: string) => {
    const ext = filename.substring(filename.lastIndexOf('.'));
    return GODOT_FILE_TYPES[ext as keyof typeof GODOT_FILE_TYPES] || '📄';
  };

  // Get node icon and color
  const getNodeStyle = (type: string) => {
    const nodeType = GODOT_NODE_TYPES[type as keyof typeof GODOT_NODE_TYPES];
    return nodeType || { icon: '📦', color: '#6b7280' };
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
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎮</div>
          <div style={{ fontSize: '18px', marginBottom: '10px' }}>Initializing Godot WASM Studio</div>
          <div style={{ fontSize: '14px', color: GOD_CONFIG.theme.text.secondary }}>
            Setting up sovereign game development environment...
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
        <div style={{ fontSize: '18px', marginBottom: '10px' }}>Godot WASM Error</div>
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
        width: sidebarCollapsed ? '50px' : '250px',
        backgroundColor: GOD_CONFIG.theme.bg.primary,
        borderRight: `1px solid ${GOD_CONFIG.theme.border.default}`,
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s ease'
      }}>
        {/* Sidebar Header */}
        <div style={{
          padding: '16px',
          borderBottom: `1px solid ${GOD_CONFIG.theme.border.default}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {!sidebarCollapsed && (
            <div>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>🎮 Godot</div>
              <div style={{ fontSize: '12px', color: GOD_CONFIG.theme.text.secondary }}>
                {project?.name || 'No Project'}
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{
              background: 'none',
              border: 'none',
              color: GOD_CONFIG.theme.text.secondary,
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            {sidebarCollapsed ? '▶' : '◀'}
          </button>
        </div>

        {/* Project Actions */}
        {!sidebarCollapsed && (
          <div style={{
            padding: '16px',
            borderBottom: `1px solid ${GOD_CONFIG.theme.border.default}`
          }}>
            {!project ? (
              <button
                onClick={createNewProject}
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
                🎮 New Quantum Game
              </button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  onClick={runGame}
                  disabled={isGameRunning}
                  style={{
                    padding: '8px',
                    backgroundColor: isGameRunning ? '#6b7280' : '#22c55e',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: isGameRunning ? 'not-allowed' : 'pointer',
                    fontSize: '12px'
                  }}
                >
                  {isGameRunning ? '⏸' : '▶'} Run Game
                </button>
                {isGameRunning && (
                  <button
                    onClick={stopGame}
                    style={{
                      padding: '8px',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    ⏹ Stop
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* File Tree */}
        {project && (
          <div style={{ flex: 1, overflowY: 'auto', padding: sidebarCollapsed ? '8px' : '0' }}>
            {!sidebarCollapsed && (
              <div style={{
                padding: '8px 16px',
                fontSize: '12px',
                fontWeight: 'bold',
                color: GOD_CONFIG.theme.text.secondary,
                borderBottom: `1px solid ${GOD_CONFIG.theme.border.default}`
              }}>
                📁 Files
              </div>
            )}
            {project.files.map(file => (
              <div
                key={file.path}
                style={{
                  padding: sidebarCollapsed ? '8px' : '8px 16px',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  margin: '2px 8px',
                  backgroundColor: selectedFile === file.path ? GOD_CONFIG.theme.text.accent + '20' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: sidebarCollapsed ? '12px' : '14px'
                }}
                onClick={() => loadFile(file.path)}
                title={sidebarCollapsed ? file.name : undefined}
              >
                <span>{getFileIcon(file.name)}</span>
                {!sidebarCollapsed && (
                  <>
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {file.name}
                    </span>
                    {file.isModified && <span style={{ color: '#eab308' }}>●</span>}
                  </>
                )}
              </div>
            ))}

            {!sidebarCollapsed && project.scenes.length > 0 && (
              <>
                <div style={{
                  padding: '8px 16px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: GOD_CONFIG.theme.text.secondary,
                  borderTop: `1px solid ${GOD_CONFIG.theme.border.default}`,
                  borderBottom: `1px solid ${GOD_CONFIG.theme.border.default}`
                }}>
                  🎭 Scenes
                </div>
                {project.scenes.map(scene => (
                  <div
                    key={scene.path}
                    style={{
                      padding: '8px 16px',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      margin: '2px 8px',
                      backgroundColor: project.currentScene === scene.path ? '#22c55e20' : 'transparent'
                    }}
                    onClick={() => setProject({ ...project, currentScene: scene.path })}
                  >
                    🎭 {scene.name}
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Tabs */}
        <div style={{
          display: 'flex',
          backgroundColor: GOD_CONFIG.theme.bg.primary,
          borderBottom: `1px solid ${GOD_CONFIG.theme.border.default}`
        }}>
          {[
            { id: 'editor', label: '📝 Script Editor', icon: '📝' },
            { id: 'scene', label: '🎭 Scene Graph', icon: '🎭' },
            { id: 'preview', label: '🎮 Game Preview', icon: '🎮' },
            { id: 'export', label: '📦 Export', icon: '📦' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '12px 20px',
                background: activeTab === tab.id ? GOD_CONFIG.theme.bg.secondary : 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? `2px solid ${GOD_CONFIG.theme.text.accent}` : 'none',
                color: activeTab === tab.id ? GOD_CONFIG.theme.text.accent : GOD_CONFIG.theme.text.primary,
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {/* Script Editor */}
          {activeTab === 'editor' && (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* File Header */}
              <div style={{
                padding: '12px 20px',
                backgroundColor: GOD_CONFIG.theme.bg.primary,
                borderBottom: `1px solid ${GOD_CONFIG.theme.border.default}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '16px' }}>
                    {selectedFile ? getFileIcon(selectedFile.split('/').pop() || '') : '📝'}
                  </span>
                  <span style={{ fontWeight: '500' }}>
                    {selectedFile?.split('/').pop() || 'No file selected'}
                  </span>
                  {selectedFile && (
                    <span style={{
                      fontSize: '12px',
                      color: GOD_CONFIG.theme.text.secondary,
                      backgroundColor: GOD_CONFIG.theme.bg.secondary,
                      padding: '2px 8px',
                      borderRadius: '12px'
                    }}>
                      {GODOT_FILE_TYPES[selectedFile.substring(selectedFile.lastIndexOf('.')) as keyof typeof GODOT_FILE_TYPES] || 'Unknown'}
                    </span>
                  )}
                </div>
                {selectedFile && (
                  <button
                    onClick={saveFile}
                    disabled={!isFileDirty}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: isFileDirty ? '#22c55e' : '#6b7280',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: isFileDirty ? 'pointer' : 'not-allowed',
                      fontSize: '12px'
                    }}
                  >
                    💾 Save
                  </button>
                )}
              </div>

              {/* Code Editor */}
              <textarea
                value={fileContent}
                onChange={(e) => {
                  setFileContent(e.target.value);
                  setIsFileDirty(true);
                }}
                placeholder={selectedFile ? undefined : "Select a Godot script or scene file to start editing..."}
                style={{
                  flex: 1,
                  padding: '20px',
                  backgroundColor: GOD_CONFIG.theme.bg.primary,
                  border: 'none',
                  color: GOD_CONFIG.theme.text.primary,
                  fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  resize: 'none',
                  outline: 'none'
                }}
              />
            </div>
          )}

          {/* Scene Graph */}
          {activeTab === 'scene' && (
            <div style={{ height: '100%', padding: '20px', overflowY: 'auto' }}>
              <h3 style={{ margin: '0 0 20px 0' }}>🎭 Scene Graph</h3>

              {project?.currentScene && project.scenes.find(s => s.path === project.currentScene) ? (
                <SceneGraph
                  scene={project.scenes.find(s => s.path === project.currentScene)!}
                  onNodeSelect={(node) => console.log('Selected node:', node)}
                />
              ) : (
                <div style={{
                  textAlign: 'center',
                  color: GOD_CONFIG.theme.text.secondary,
                  padding: '40px'
                }}>
                  Select a scene to view the node hierarchy
                </div>
              )}
            </div>
          )}

          {/* Game Preview */}
          {activeTab === 'preview' && (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* Game Controls */}
              <div style={{
                padding: '16px',
                backgroundColor: GOD_CONFIG.theme.bg.primary,
                borderBottom: `1px solid ${GOD_CONFIG.theme.border.default}`,
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <button
                  onClick={runGame}
                  disabled={!project || isGameRunning}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: isGameRunning ? '#6b7280' : '#22c55e',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: (!project || isGameRunning) ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isGameRunning ? '⏸ Running' : '▶ Run Game'}
                </button>

                {isGameRunning && (
                  <button
                    onClick={stopGame}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    ⏹ Stop
                  </button>
                )}

                {/* Game Stats */}
                {isGameRunning && (
                  <div style={{
                    marginLeft: 'auto',
                    display: 'flex',
                    gap: '16px',
                    fontSize: '12px'
                  }}>
                    <span>Coherence: {gameStats.coherence.toFixed(3)}</span>
                    <span>Energy: {gameStats.energy.toFixed(1)}</span>
                    <span>Score: {gameStats.score}</span>
                    <span>Frame: {gameStats.frame}</span>
                  </div>
                )}
              </div>

              {/* Game Canvas */}
              <div
                ref={gameCanvasRef}
                style={{
                  flex: 1,
                  backgroundColor: '#000011',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                {gameInstance ? (
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {gameInstance.canvas}
                  </div>
                ) : (
                  <div style={{
                    textAlign: 'center',
                    color: GOD_CONFIG.theme.text.secondary
                  }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎮</div>
                    <div>Run your Godot game to see the preview</div>
                    <div style={{ fontSize: '12px', marginTop: '10px' }}>
                      WASD to move • Mouse to look • Space to jump • Q for quantum power
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Export */}
          {activeTab === 'export' && (
            <div style={{ height: '100%', padding: '20px', overflowY: 'auto' }}>
              <h3 style={{ margin: '0 0 20px 0' }}>📦 Export to WebAssembly</h3>

              <div style={{
                backgroundColor: GOD_CONFIG.theme.bg.primary,
                border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                borderRadius: '8px',
                padding: '20px'
              }}>
                <h4 style={{ margin: '0 0 16px 0' }}>WebAssembly Export</h4>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Platform:</strong> HTML5/WebAssembly
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Resolution:</strong> 1280x720 (configurable)
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Compression:</strong> Enabled
                  </div>
                  <div>
                    <strong>Quantum Features:</strong> Integrated
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                  <button
                    onClick={exportToWASM}
                    disabled={!project}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: project ? '#8b5cf6' : '#6b7280',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: project ? 'pointer' : 'not-allowed',
                      fontSize: '14px'
                    }}
                  >
                    📦 Export to WASM
                  </button>

                  {project?.exportUrl && (
                    <a
                      href={project.exportUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '12px 24px',
                        backgroundColor: '#22c55e',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        display: 'inline-block'
                      }}
                    >
                      🌐 Open Exported Game
                    </a>
                  )}
                </div>

                {project?.isExported && (
                  <div style={{
                    padding: '12px',
                    backgroundColor: '#22c55e20',
                    border: '1px solid #22c55e',
                    borderRadius: '4px',
                    color: '#22c55e'
                  }}>
                    ✅ Game successfully exported to WebAssembly!
                  </div>
                )}

                <div style={{
                  marginTop: '20px',
                  padding: '12px',
                  backgroundColor: GOD_CONFIG.theme.bg.secondary,
                  borderRadius: '4px',
                  fontSize: '12px'
                }}>
                  <strong>Export Details:</strong><br />
                  • Runs in any modern web browser<br />
                  • No installation required<br />
                  • Includes quantum coherence mechanics<br />
                  • WebAssembly performance optimizations
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Scene Graph Component
function SceneGraph({ scene, onNodeSelect }: {
  scene: any;
  onNodeSelect: (node: any) => void;
}) {
  const renderNode = (node: any, depth = 0) => {
    const style = GODOT_NODE_TYPES[node.type as keyof typeof GODOT_NODE_TYPES] ||
                  { icon: '📦', color: '#6b7280' };

    return (
      <div key={node.name}>
        <div
          style={{
            padding: '4px 8px',
            paddingLeft: `${8 + depth * 16}px`,
            cursor: 'pointer',
            borderRadius: '4px',
            margin: '2px 0',
            backgroundColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px'
          }}
          onClick={() => onNodeSelect(node)}
        >
          <span style={{ color: style.color }}>{style.icon}</span>
          <span>{node.name}</span>
          <span style={{
            color: '#6b7280',
            fontSize: '11px',
            marginLeft: 'auto'
          }}>
            {node.type}
          </span>
        </div>
        {node.children && node.children.map((child: any) => renderNode(child, depth + 1))}
      </div>
    );
  };

  return (
    <div style={{
      backgroundColor: GOD_CONFIG.theme.bg.primary,
      border: `1px solid ${GOD_CONFIG.theme.border.default}`,
      borderRadius: '4px',
      padding: '12px'
    }}>
      {scene.nodes.map((node: any) => renderNode(node))}
    </div>
  );
}