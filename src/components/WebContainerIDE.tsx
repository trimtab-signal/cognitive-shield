/**
 * WEBCONTAINER IDE - SOVEREIGN DEVELOPMENT ENVIRONMENT
 * Complete Node.js development environment running in the browser
 *
 * Features quantum-secure development with ML-KEM cryptography
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { webContainerManager } from '../lib/webcontainer-manager';
import GOD_CONFIG from '../god.config';

// File types for syntax highlighting
const FILE_TYPES = {
  '.js': 'javascript',
  '.ts': 'typescript',
  '.json': 'json',
  '.md': 'markdown',
  '.html': 'html',
  '.css': 'css',
  '.py': 'python',
  '.sh': 'bash',
  '.yml': 'yaml',
  '.yaml': 'yaml'
};

// File icons
const FILE_ICONS = {
  '.js': '🟨',
  '.ts': '🔷',
  '.json': '📄',
  '.md': '📝',
  '.html': '🌐',
  '.css': '🎨',
  '.py': '🐍',
  '.sh': '⚡',
  'dir': '📁',
  'file': '📄'
};

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
}

interface CommandHistory {
  id: string;
  command: string;
  output: string[];
  timestamp: number;
  status: 'running' | 'completed' | 'error';
}

export default function WebContainerIDE() {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // File system
  const [files, setFiles] = useState<FileNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [isFileDirty, setIsFileDirty] = useState(false);

  // Terminal
  const [command, setCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<CommandHistory[]>([]);
  const [isCommandRunning, setIsCommandRunning] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminalInputRef = useRef<HTMLInputElement>(null);

  // Server
  const [serverUrl, setServerUrl] = useState('');
  const [isServerRunning, setIsServerRunning] = useState(false);

  // UI state
  const [activeTab, setActiveTab] = useState<'editor' | 'terminal' | 'preview' | 'packages'>('editor');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Initialize WebContainer
  useEffect(() => {
    const handleReady = () => {
      setIsReady(true);
      setIsLoading(false);
      loadFileTree();
      console.log('🎉 WebContainer IDE ready!');
    };

    const handleError = (data: any) => {
      setError(data.error);
      setIsLoading(false);
    };

    const handleCommandOutput = (data: any) => {
      setCommandHistory(prev => prev.map(cmd =>
        cmd.id === data.commandId
          ? { ...cmd, output: [...cmd.output, data.output] }
          : cmd
      ));
    };

    const handleCommandCompleted = (data: any) => {
      setCommandHistory(prev => prev.map(cmd =>
        cmd.id === data.commandId
          ? { ...cmd, status: data.exitCode === 0 ? 'completed' : 'error' }
          : cmd
      ));
      setIsCommandRunning(false);
    };

    const handleCommandError = (data: any) => {
      setCommandHistory(prev => prev.map(cmd =>
        cmd.id === data.commandId
          ? { ...cmd, status: 'error', output: [...cmd.output, `Error: ${data.error}`] }
          : cmd
      ));
      setIsCommandRunning(false);
    };

    webContainerManager.on('ready', handleReady);
    webContainerManager.on('error', handleError);
    webContainerManager.on('commandOutput', handleCommandOutput);
    webContainerManager.on('commandCompleted', handleCommandCompleted);
    webContainerManager.on('commandError', handleCommandError);

    // Check if already ready
    if (webContainerManager.isReady()) {
      handleReady();
    }

    return () => {
      webContainerManager.off('ready', handleReady);
      webContainerManager.off('error', handleError);
      webContainerManager.off('commandOutput', handleCommandOutput);
      webContainerManager.off('commandCompleted', handleCommandCompleted);
      webContainerManager.off('commandError', handleCommandError);
    };
  }, []);

  // Load file tree
  const loadFileTree = async () => {
    try {
      const fileList = await webContainerManager.listDirectory();
      const fileNodes: FileNode[] = await Promise.all(
        fileList.map(async (name) => {
          try {
            const stats = await webContainerManager.listDirectory(name);
            return {
              name,
              path: name,
              type: 'directory' as const,
              children: stats.map(childName => ({
                name: childName,
                path: `${name}/${childName}`,
                type: 'file' as const
              }))
            };
          } catch {
            return {
              name,
              path: name,
              type: 'file' as const
            };
          }
        })
      );
      setFiles(fileNodes);
    } catch (error) {
      console.error('Failed to load file tree:', error);
    }
  };

  // Load file content
  const loadFile = async (filePath: string) => {
    try {
      const content = await webContainerManager.readFile(filePath);
      setFileContent(content);
      setSelectedFile(filePath);
      setIsFileDirty(false);
    } catch (error) {
      console.error('Failed to load file:', error);
      setError(`Failed to load file: ${filePath}`);
    }
  };

  // Save file
  const saveFile = async () => {
    if (!selectedFile) return;

    try {
      await webContainerManager.writeFile(selectedFile, fileContent);
      setIsFileDirty(false);
      console.log(`💾 Saved ${selectedFile}`);
    } catch (error) {
      console.error('Failed to save file:', error);
      setError(`Failed to save file: ${selectedFile}`);
    }
  };

  // Execute command
  const executeCommand = async (cmd: string) => {
    if (!cmd.trim()) return;

    setIsCommandRunning(true);
    setCommand('');

    try {
      await webContainerManager.executeCommand(cmd.split(' ')[0], cmd.split(' ').slice(1));
    } catch (error) {
      console.error('Command execution failed:', error);
      setIsCommandRunning(false);
    }
  };

  // Quick actions
  const startDevServer = async () => {
    try {
      await webContainerManager.startDevServer();
      setIsServerRunning(true);
      setTimeout(() => {
        const url = webContainerManager.getServerUrl();
        if (url) setServerUrl(url);
      }, 2000);
    } catch (error) {
      console.error('Failed to start dev server:', error);
    }
  };

  const startProdServer = async () => {
    try {
      await webContainerManager.startServer();
      setIsServerRunning(true);
      setTimeout(() => {
        const url = webContainerManager.getServerUrl();
        if (url) setServerUrl(url);
      }, 2000);
    } catch (error) {
      console.error('Failed to start server:', error);
    }
  };

  const runTests = async () => {
    try {
      await webContainerManager.runTests();
    } catch (error) {
      console.error('Failed to run tests:', error);
    }
  };

  const installPackage = async (packageName: string) => {
    if (!packageName.trim()) return;

    try {
      await webContainerManager.installPackage(packageName);
      loadFileTree(); // Refresh file tree in case package.json changed
    } catch (error) {
      console.error('Failed to install package:', error);
    }
  };

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commandHistory]);

  // Focus terminal input
  useEffect(() => {
    if (activeTab === 'terminal' && terminalInputRef.current) {
      terminalInputRef.current.focus();
    }
  }, [activeTab]);

  const getFileIcon = (fileName: string, type: 'file' | 'directory') => {
    if (type === 'directory') return FILE_ICONS.dir;

    const ext = fileName.substring(fileName.lastIndexOf('.'));
    return FILE_ICONS[ext] || FILE_ICONS.file;
  };

  const getFileType = (fileName: string) => {
    const ext = fileName.substring(fileName.lastIndexOf('.'));
    return FILE_TYPES[ext] || 'text';
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
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🚀</div>
          <div style={{ fontSize: '18px', marginBottom: '10px' }}>Initializing Sovereign IDE</div>
          <div style={{ fontSize: '14px', color: GOD_CONFIG.theme.text.secondary }}>
            Setting up WebContainer environment...
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
        <div style={{ fontSize: '18px', marginBottom: '10px' }}>WebContainer Error</div>
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
          Reload IDE
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
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>📁 Files</div>
              <div style={{ fontSize: '12px', color: GOD_CONFIG.theme.text.secondary }}>
                Quantum Project
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

        {/* File Tree */}
        <div style={{ flex: 1, overflowY: 'auto', padding: sidebarCollapsed ? '8px' : '0' }}>
          {sidebarCollapsed ? (
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              📁
            </div>
          ) : (
            files.map(file => (
              <div
                key={file.path}
                style={{
                  padding: '8px 16px',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  margin: '2px 8px',
                  backgroundColor: selectedFile === file.path ? GOD_CONFIG.theme.text.accent + '20' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onClick={() => file.type === 'file' && loadFile(file.path)}
              >
                <span>{getFileIcon(file.name, file.type)}</span>
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {file.name}
                </span>
                {selectedFile === file.path && isFileDirty && (
                  <span style={{ color: '#eab308' }}>●</span>
                )}
              </div>
            ))
          )}
        </div>

        {/* Quick Actions */}
        {!sidebarCollapsed && (
          <div style={{
            padding: '16px',
            borderTop: `1px solid ${GOD_CONFIG.theme.border.default}`
          }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>⚡ Quick Actions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <button
                onClick={startDevServer}
                disabled={!isReady}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#22c55e',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                🚀 Dev Server
              </button>
              <button
                onClick={runTests}
                disabled={!isReady}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#8b5cf6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                🧪 Run Tests
              </button>
            </div>
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
            { id: 'editor', label: '📝 Editor', icon: '📝' },
            { id: 'terminal', label: '⚡ Terminal', icon: '⚡' },
            { id: 'preview', label: '🌐 Preview', icon: '🌐' },
            { id: 'packages', label: '📦 Packages', icon: '📦' }
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
          {/* Editor Tab */}
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
                    {selectedFile ? getFileIcon(selectedFile.split('/').pop() || '', 'file') : '📝'}
                  </span>
                  <span style={{ fontWeight: '500' }}>
                    {selectedFile || 'No file selected'}
                  </span>
                  {selectedFile && (
                    <span style={{
                      fontSize: '12px',
                      color: GOD_CONFIG.theme.text.secondary,
                      backgroundColor: GOD_CONFIG.theme.bg.secondary,
                      padding: '2px 8px',
                      borderRadius: '12px'
                    }}>
                      {getFileType(selectedFile)}
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
                placeholder={selectedFile ? undefined : "Select a file from the sidebar to start editing..."}
                style={{
                  flex: 1,
                  padding: '20px',
                  backgroundColor: GOD_CONFIG.theme.bg.primary,
                  border: 'none',
                  color: GOD_CONFIG.theme.text.primary,
                  fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  resize: 'none',
                  outline: 'none'
                }}
              />
            </div>
          )}

          {/* Terminal Tab */}
          {activeTab === 'terminal' && (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* Terminal Output */}
              <div
                ref={terminalRef}
                style={{
                  flex: 1,
                  padding: '16px',
                  backgroundColor: '#000',
                  color: '#0f0',
                  fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                  fontSize: '14px',
                  overflowY: 'auto',
                  whiteSpace: 'pre-wrap'
                }}
              >
                {commandHistory.map(cmd => (
                  <div key={cmd.id} style={{ marginBottom: '8px' }}>
                    <div style={{ color: '#0ff' }}>
                      $ {cmd.command}
                    </div>
                    {cmd.output.map((line, i) => (
                      <div key={i} style={{ color: cmd.status === 'error' ? '#f00' : '#0f0' }}>
                        {line}
                      </div>
                    ))}
                    {cmd.status === 'running' && (
                      <div style={{ color: '#ff0' }}>⏳ Running...</div>
                    )}
                  </div>
                ))}
                {commandHistory.length === 0 && (
                  <div style={{ color: '#666' }}>
                    Welcome to WebContainer Terminal! 🚀
                    <br />
                    Type commands to interact with your quantum project.
                    <br />
                    Try: npm start, npm test, ls, cat package.json
                  </div>
                )}
              </div>

              {/* Terminal Input */}
              <div style={{
                padding: '12px 16px',
                backgroundColor: GOD_CONFIG.theme.bg.primary,
                borderTop: `1px solid ${GOD_CONFIG.theme.border.default}`,
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span style={{ color: '#0f0', fontFamily: 'monospace' }}>$</span>
                <input
                  ref={terminalInputRef}
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !isCommandRunning) {
                      executeCommand(command);
                    }
                  }}
                  disabled={isCommandRunning}
                  placeholder={isCommandRunning ? "Command running..." : "Type a command..."}
                  style={{
                    flex: 1,
                    padding: '8px',
                    backgroundColor: 'transparent',
                    border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                    borderRadius: '4px',
                    color: GOD_CONFIG.theme.text.primary,
                    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={() => executeCommand(command)}
                  disabled={isCommandRunning || !command.trim()}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: isCommandRunning ? '#6b7280' : '#22c55e',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: isCommandRunning || !command.trim() ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isCommandRunning ? '⏳' : '▶'}
                </button>
              </div>
            </div>
          )}

          {/* Preview Tab */}
          {activeTab === 'preview' && (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* Preview Controls */}
              <div style={{
                padding: '16px',
                backgroundColor: GOD_CONFIG.theme.bg.primary,
                borderBottom: `1px solid ${GOD_CONFIG.theme.border.default}`,
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <button
                  onClick={startProdServer}
                  disabled={!isReady}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#22c55e',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  🚀 Start Server
                </button>
                {serverUrl && (
                  <a
                    href={serverUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '4px'
                    }}
                  >
                    🌐 Open in New Tab
                  </a>
                )}
                <span style={{ color: GOD_CONFIG.theme.text.secondary }}>
                  {serverUrl ? `Server: ${serverUrl}` : 'Server not running'}
                </span>
              </div>

              {/* Preview Frame */}
              <div style={{ flex: 1, position: 'relative' }}>
                {serverUrl ? (
                  <iframe
                    src={serverUrl}
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none'
                    }}
                    title="WebContainer Preview"
                  />
                ) : (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: GOD_CONFIG.theme.text.secondary
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '48px', marginBottom: '20px' }}>🌐</div>
                      <div>Start the server to preview your application</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Packages Tab */}
          {activeTab === 'packages' && (
            <div style={{ height: '100%', padding: '20px', overflowY: 'auto' }}>
              <h3 style={{ margin: '0 0 20px 0' }}>📦 Package Manager</h3>

              {/* Install Package */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ margin: '0 0 12px 0' }}>Install Package</h4>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Package name (e.g., express, lodash)"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        installPackage((e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                    style={{
                      flex: 1,
                      padding: '8px',
                      border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                      borderRadius: '4px',
                      backgroundColor: GOD_CONFIG.theme.bg.primary,
                      color: GOD_CONFIG.theme.text.primary
                    }}
                  />
                  <button
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      installPackage(input.value);
                      input.value = '';
                    }}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#22c55e',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    📦 Install
                  </button>
                </div>
              </div>

              {/* Current Packages */}
              <div>
                <h4 style={{ margin: '0 0 12px 0' }}>Current Packages</h4>
                <div style={{
                  backgroundColor: GOD_CONFIG.theme.bg.primary,
                  border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                  borderRadius: '4px',
                  padding: '16px',
                  fontFamily: 'monospace',
                  fontSize: '12px'
                }}>
                  <div><strong>@noble/post-quantum:</strong> ^0.1.0 (ML-KEM-768)</div>
                  <div><strong>express:</strong> ^4.18.2 (Web server)</div>
                  <div><strong>ws:</strong> ^8.13.0 (WebSocket support)</div>
                </div>
              </div>

              {/* Package Info */}
              <div style={{ marginTop: '24px' }}>
                <h4 style={{ margin: '0 0 12px 0' }}>Package Information</h4>
                <div style={{
                  backgroundColor: GOD_CONFIG.theme.bg.primary,
                  border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                  borderRadius: '4px',
                  padding: '16px',
                  fontSize: '14px'
                }}>
                  <p><strong>ML-KEM-768:</strong> Post-quantum key encapsulation providing security against quantum computers.</p>
                  <p><strong>Express:</strong> Fast, unopinionated web framework for Node.js.</p>
                  <p><strong>WebSocket:</strong> Real-time communication protocol for live updates.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}