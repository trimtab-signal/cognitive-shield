/**
 * MODULE DASHBOARD
 * The Living Gallery of Autopoietic Extensions
 * 
 * "The system creates itself through collective contribution."
 * 
 * This is where modules come ALIVE.
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Package, Play, Pause, RefreshCw, Download, Upload, Share2, 
  Maximize2, Minimize2, X, Check, AlertTriangle, Sparkles,
  Copy, ExternalLink, Heart
} from 'lucide-react';
import GOD_CONFIG from '../god.config';
import { useModuleStore } from '../store/module.store';
import type { GeodesicModule } from '../types/module.types';

// Simple React component renderer via iframe
function ModuleRenderer({ module, isExpanded, onToggleExpand }: { 
  module: GeodesicModule; 
  isExpanded: boolean;
  onToggleExpand: () => void;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Generate standalone HTML that runs the module
  const moduleHTML = useMemo(() => {
    // Wrap the module code in a self-contained React app
    const wrappedCode = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${module.name}</title>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { 
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: ${GOD_CONFIG.theme.bg.tertiary};
      color: ${GOD_CONFIG.theme.text.primary};
      padding: 16px;
      min-height: 100vh;
    }
    button {
      background: ${GOD_CONFIG.theme.text.accent};
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s;
    }
    button:hover { opacity: 0.9; transform: translateY(-1px); }
    button:active { transform: translateY(0); }
    input, textarea {
      background: ${GOD_CONFIG.theme.bg.secondary};
      border: 1px solid ${GOD_CONFIG.theme.border.default};
      color: ${GOD_CONFIG.theme.text.primary};
      padding: 10px 12px;
      border-radius: 6px;
      font-size: 14px;
      width: 100%;
    }
    input:focus, textarea:focus {
      outline: none;
      border-color: ${GOD_CONFIG.theme.text.accent};
    }
    h1, h2, h3 { color: ${GOD_CONFIG.theme.text.primary}; margin-bottom: 12px; }
    p { color: ${GOD_CONFIG.theme.text.secondary}; line-height: 1.6; }
    .card {
      background: ${GOD_CONFIG.theme.bg.secondary};
      border: 1px solid ${GOD_CONFIG.theme.border.default};
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 12px;
    }
    .success { color: ${GOD_CONFIG.heartbeat.statuses.green.color}; }
    .warning { color: ${GOD_CONFIG.voltage.medium.color}; }
    .error { color: ${GOD_CONFIG.voltage.high.color}; }
    .flex { display: flex; gap: 8px; align-items: center; }
    .flex-col { display: flex; flex-direction: column; gap: 8px; }
    .mb-2 { margin-bottom: 8px; }
    .mb-4 { margin-bottom: 16px; }
    .text-sm { font-size: 12px; }
    .text-muted { color: ${GOD_CONFIG.theme.text.muted}; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    // Provide simple hooks for modules to use
    const useLocalStorage = (key, initialValue) => {
      const [value, setValue] = React.useState(() => {
        try {
          const item = localStorage.getItem('module-' + key);
          return item ? JSON.parse(item) : initialValue;
        } catch { return initialValue; }
      });
      
      React.useEffect(() => {
        localStorage.setItem('module-' + key, JSON.stringify(value));
      }, [key, value]);
      
      return [value, setValue];
    };

    const useSpoonBudget = () => {
      // Simulated spoon budget - in real integration would connect to main app
      const [spoons, setSpoons] = useLocalStorage('spoons', 12);
      return { spoons, setSpoons, useSpoon: () => setSpoons(s => Math.max(0, s - 1)) };
    };

    // Simple module component wrapper
    ${module.sourceCode}

    // Find the default export or first component
    const ModuleComponent = typeof exports !== 'undefined' && exports.default 
      ? exports.default 
      : (() => {
          // Try to find the component in the code
          const match = \`${module.sourceCode.replace(/`/g, '\\`')}\`.match(/(?:const|function)\\s+(\\w+).*?(?:React\\.FC|=>|\\{)/);
          if (match && window[match[1]]) return window[match[1]];
          return () => <div className="card"><p>Module loaded! Add a default export to render content.</p></div>;
        })();

    // Render
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <React.StrictMode>
        <ModuleComponent />
      </React.StrictMode>
    );
  </script>
</body>
</html>`;

    return wrappedCode;
  }, [module]);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    // Small delay to show loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [module.id]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setError('Failed to load module');
    setIsLoading(false);
  };

  return (
    <div
      style={{
        backgroundColor: GOD_CONFIG.theme.bg.secondary,
        borderRadius: 12,
        border: `1px solid ${module.isEnabled ? GOD_CONFIG.heartbeat.statuses.green.color + '40' : GOD_CONFIG.theme.border.default}`,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Module Header */}
      <div
        style={{
          padding: '12px 16px',
          backgroundColor: GOD_CONFIG.theme.bg.tertiary,
          borderBottom: `1px solid ${GOD_CONFIG.theme.border.default}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: module.isEnabled 
                ? GOD_CONFIG.heartbeat.statuses.green.color 
                : GOD_CONFIG.theme.text.muted,
            }}
          />
          <span style={{ 
            fontWeight: 600, 
            color: GOD_CONFIG.theme.text.primary,
            fontSize: 14,
          }}>
            {module.name}
          </span>
          <span style={{ 
            fontSize: 11, 
            color: GOD_CONFIG.theme.text.muted,
            backgroundColor: GOD_CONFIG.theme.bg.primary,
            padding: '2px 8px',
            borderRadius: 10,
          }}>
            v{module.version}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={onToggleExpand}
            style={{
              padding: 6,
              backgroundColor: 'transparent',
              border: `1px solid ${GOD_CONFIG.theme.border.default}`,
              borderRadius: 6,
              color: GOD_CONFIG.theme.text.primary,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            title={isExpanded ? 'Minimize' : 'Expand'}
          >
            {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* Module Content */}
      <div style={{ 
        position: 'relative',
        height: isExpanded ? 400 : 200,
        transition: 'height 0.3s ease',
      }}>
        {isLoading && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: GOD_CONFIG.theme.bg.tertiary,
              zIndex: 10,
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <Sparkles 
                size={24} 
                color={GOD_CONFIG.theme.text.accent}
                style={{ animation: 'spin 2s linear infinite' }}
              />
              <div style={{ 
                marginTop: 8, 
                fontSize: 12, 
                color: GOD_CONFIG.theme.text.muted 
              }}>
                Loading module...
              </div>
            </div>
          </div>
        )}

        {error && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: GOD_CONFIG.theme.bg.tertiary,
              zIndex: 10,
            }}
          >
            <div style={{ textAlign: 'center', color: GOD_CONFIG.voltage.high.color }}>
              <AlertTriangle size={24} />
              <div style={{ marginTop: 8, fontSize: 12 }}>{error}</div>
            </div>
          </div>
        )}

        <iframe
          ref={iframeRef}
          srcDoc={moduleHTML}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          sandbox="allow-scripts allow-same-origin"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            backgroundColor: GOD_CONFIG.theme.bg.tertiary,
          }}
          title={module.name}
        />
      </div>
    </div>
  );
}

// Module sharing/export functionality
function ModuleSharePanel({ module, onClose }: { module: GeodesicModule; onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  const exportData = useMemo(() => {
    return JSON.stringify({
      _type: 'cognitive-shield-module',
      _version: '1.0',
      module: {
        name: module.name,
        description: module.description,
        version: module.version,
        sourceCode: module.sourceCode,
        manifest: module.manifest,
        linterReport: module.linterReport,
      }
    }, null, 2);
  }, [module]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(exportData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${module.name.toLowerCase().replace(/\s+/g, '-')}.module.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: GOD_CONFIG.theme.bg.primary,
          borderRadius: 16,
          border: `1px solid ${GOD_CONFIG.theme.border.default}`,
          maxWidth: 600,
          width: '100%',
          maxHeight: '80vh',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: 20,
            borderBottom: `1px solid ${GOD_CONFIG.theme.border.default}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h3 style={{ 
              margin: 0, 
              fontSize: 18, 
              fontWeight: 700,
              color: GOD_CONFIG.theme.text.primary,
              fontFamily: GOD_CONFIG.typography.fontFamily.display,
            }}>
              Share Module
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: 12, color: GOD_CONFIG.theme.text.muted }}>
              Export "{module.name}" to share with others
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: 8,
              backgroundColor: 'transparent',
              border: 'none',
              color: GOD_CONFIG.theme.text.muted,
              cursor: 'pointer',
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: 20 }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            <button
              onClick={handleCopy}
              style={{
                flex: 1,
                padding: '12px 20px',
                backgroundColor: copied ? GOD_CONFIG.heartbeat.statuses.green.color : GOD_CONFIG.theme.text.accent,
                border: 'none',
                borderRadius: 8,
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
            <button
              onClick={handleDownload}
              style={{
                flex: 1,
                padding: '12px 20px',
                backgroundColor: GOD_CONFIG.theme.bg.secondary,
                border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                borderRadius: 8,
                color: GOD_CONFIG.theme.text.primary,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <Download size={16} />
              Download .json
            </button>
          </div>

          <div
            style={{
              backgroundColor: GOD_CONFIG.theme.bg.tertiary,
              borderRadius: 8,
              padding: 16,
              maxHeight: 300,
              overflow: 'auto',
            }}
          >
            <pre
              style={{
                margin: 0,
                fontSize: 11,
                fontFamily: 'JetBrains Mono, monospace',
                color: GOD_CONFIG.theme.text.secondary,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {exportData}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

// Import module functionality
function ModuleImportPanel({ onClose, onImport }: { onClose: () => void; onImport: (module: GeodesicModule) => void }) {
  const [importText, setImportText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleImport = () => {
    try {
      const data = JSON.parse(importText);
      
      if (data._type !== 'cognitive-shield-module') {
        throw new Error('Invalid module format');
      }

      const newModule: GeodesicModule = {
        id: crypto.randomUUID(),
        name: data.module.name,
        description: data.module.description,
        version: data.module.version,
        author: 'imported',
        sourceCode: data.module.sourceCode,
        manifest: data.module.manifest,
        linterReport: data.module.linterReport,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isInstalled: true,
        isEnabled: false,
        abdicated: false,
      };

      onImport(newModule);
      setSuccess(true);
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse module');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImportText(event.target?.result as string);
        setError(null);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: GOD_CONFIG.theme.bg.primary,
          borderRadius: 16,
          border: `1px solid ${GOD_CONFIG.theme.border.default}`,
          maxWidth: 600,
          width: '100%',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: 20,
            borderBottom: `1px solid ${GOD_CONFIG.theme.border.default}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h3 style={{ 
              margin: 0, 
              fontSize: 18, 
              fontWeight: 700,
              color: GOD_CONFIG.theme.text.primary,
              fontFamily: GOD_CONFIG.typography.fontFamily.display,
            }}>
              Import Module
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: 12, color: GOD_CONFIG.theme.text.muted }}>
              Add a module shared by the community
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: 8,
              backgroundColor: 'transparent',
              border: 'none',
              color: GOD_CONFIG.theme.text.muted,
              cursor: 'pointer',
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: 20 }}>
          {success ? (
            <div
              style={{
                textAlign: 'center',
                padding: 40,
                color: GOD_CONFIG.heartbeat.statuses.green.color,
              }}
            >
              <Check size={48} />
              <div style={{ marginTop: 12, fontSize: 16, fontWeight: 600 }}>
                Module Imported!
              </div>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    display: 'block',
                    padding: '12px 20px',
                    backgroundColor: GOD_CONFIG.theme.bg.secondary,
                    border: `2px dashed ${GOD_CONFIG.theme.border.default}`,
                    borderRadius: 8,
                    textAlign: 'center',
                    cursor: 'pointer',
                    color: GOD_CONFIG.theme.text.secondary,
                    fontSize: 14,
                  }}
                >
                  <Upload size={20} style={{ marginBottom: 8 }} />
                  <div>Drop a .module.json file or click to browse</div>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>

              <div style={{ 
                textAlign: 'center', 
                fontSize: 12, 
                color: GOD_CONFIG.theme.text.muted,
                marginBottom: 16,
              }}>
                — or paste JSON below —
              </div>

              <textarea
                value={importText}
                onChange={(e) => { setImportText(e.target.value); setError(null); }}
                placeholder='{"_type": "cognitive-shield-module", ...}'
                style={{
                  width: '100%',
                  height: 150,
                  padding: 12,
                  backgroundColor: GOD_CONFIG.theme.bg.tertiary,
                  border: `1px solid ${error ? GOD_CONFIG.voltage.high.color : GOD_CONFIG.theme.border.default}`,
                  borderRadius: 8,
                  color: GOD_CONFIG.theme.text.primary,
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 11,
                  resize: 'vertical',
                }}
              />

              {error && (
                <div style={{ 
                  marginTop: 8, 
                  fontSize: 12, 
                  color: GOD_CONFIG.voltage.high.color,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}>
                  <AlertTriangle size={14} />
                  {error}
                </div>
              )}

              <button
                onClick={handleImport}
                disabled={!importText.trim()}
                style={{
                  width: '100%',
                  marginTop: 16,
                  padding: '12px 20px',
                  backgroundColor: importText.trim() ? GOD_CONFIG.heartbeat.statuses.green.color : GOD_CONFIG.theme.bg.tertiary,
                  border: 'none',
                  borderRadius: 8,
                  color: importText.trim() ? '#fff' : GOD_CONFIG.theme.text.muted,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: importText.trim() ? 'pointer' : 'not-allowed',
                }}
              >
                Import Module
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Main Dashboard Component
export function ModuleDashboard() {
  const { installedModules, enabledModuleIds, installModule, enableModule } = useModuleStore();
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [shareModule, setShareModule] = useState<GeodesicModule | null>(null);
  const [showImport, setShowImport] = useState(false);

  const enabledModules = useMemo(
    () => installedModules.filter(m => enabledModuleIds.includes(m.id)),
    [installedModules, enabledModuleIds]
  );

  const toggleExpand = (moduleId: string) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  };

  const handleImport = (module: GeodesicModule) => {
    installModule(module);
  };

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div
        style={{
          padding: 24,
          backgroundColor: GOD_CONFIG.theme.bg.secondary,
          borderRadius: 16,
          border: `2px solid ${GOD_CONFIG.theme.text.accent}40`,
          marginBottom: 24,
          background: `linear-gradient(135deg, ${GOD_CONFIG.theme.bg.secondary} 0%, ${GOD_CONFIG.theme.bg.tertiary} 100%)`,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 28,
                fontWeight: 700,
                color: GOD_CONFIG.theme.text.primary,
                fontFamily: GOD_CONFIG.typography.fontFamily.display,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <Package size={32} color={GOD_CONFIG.theme.text.accent} />
              My Modules
            </h2>
            <p style={{ margin: '8px 0 0 0', fontSize: 14, color: GOD_CONFIG.theme.text.secondary, maxWidth: 500 }}>
              Your living collection of autopoietic extensions. Each module is a gift from the mesh — 
              use them, share them, grow them.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => setShowImport(true)}
              style={{
                padding: '10px 20px',
                backgroundColor: GOD_CONFIG.theme.bg.tertiary,
                border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                borderRadius: 8,
                color: GOD_CONFIG.theme.text.primary,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Upload size={16} />
              Import
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 24, marginTop: 20 }}>
          <div>
            <div style={{ fontSize: 11, color: GOD_CONFIG.theme.text.muted, textTransform: 'uppercase', letterSpacing: 1 }}>
              Installed
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: GOD_CONFIG.theme.text.primary }}>
              {installedModules.length}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: GOD_CONFIG.theme.text.muted, textTransform: 'uppercase', letterSpacing: 1 }}>
              Active
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: GOD_CONFIG.heartbeat.statuses.green.color }}>
              {enabledModules.length}
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {enabledModules.length === 0 && (
        <div
          style={{
            padding: 60,
            backgroundColor: GOD_CONFIG.theme.bg.secondary,
            borderRadius: 16,
            border: `2px dashed ${GOD_CONFIG.theme.border.default}`,
            textAlign: 'center',
          }}
        >
          <Sparkles size={48} color={GOD_CONFIG.theme.text.muted} style={{ marginBottom: 16 }} />
          <h3 style={{ 
            margin: 0, 
            fontSize: 20, 
            fontWeight: 600, 
            color: GOD_CONFIG.theme.text.primary,
            marginBottom: 8,
          }}>
            No Active Modules
          </h3>
          <p style={{ 
            margin: 0, 
            fontSize: 14, 
            color: GOD_CONFIG.theme.text.secondary,
            maxWidth: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: 20,
          }}>
            Create a module in the Module Maker, or import one from the community. 
            Then enable it in the Module Manager to see it here.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button
              onClick={() => setShowImport(true)}
              style={{
                padding: '12px 24px',
                backgroundColor: GOD_CONFIG.theme.text.accent,
                border: 'none',
                borderRadius: 8,
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Upload size={16} />
              Import Module
            </button>
          </div>
        </div>
      )}

      {/* Module Grid */}
      {enabledModules.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: 20,
          }}
        >
          {enabledModules.map((module) => (
            <div key={module.id} style={{ position: 'relative' }}>
              <ModuleRenderer
                module={module}
                isExpanded={expandedModules.has(module.id)}
                onToggleExpand={() => toggleExpand(module.id)}
              />
              <button
                onClick={() => setShareModule(module)}
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 52,
                  padding: 6,
                  backgroundColor: GOD_CONFIG.theme.bg.secondary,
                  border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                  borderRadius: 6,
                  color: GOD_CONFIG.theme.text.muted,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
                title="Share module"
              >
                <Share2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Community Note */}
      <div
        style={{
          marginTop: 32,
          padding: 20,
          backgroundColor: `${GOD_CONFIG.heartbeat.statuses.green.color}10`,
          borderRadius: 12,
          border: `1px solid ${GOD_CONFIG.heartbeat.statuses.green.color}30`,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <Heart size={24} color={GOD_CONFIG.heartbeat.statuses.green.color} />
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: GOD_CONFIG.theme.text.primary, marginBottom: 4 }}>
            Built by the Community, for the Community
          </div>
          <div style={{ fontSize: 13, color: GOD_CONFIG.theme.text.secondary }}>
            Every module you create and share helps someone else. That's the mesh in action.
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {shareModule && (
        <ModuleSharePanel module={shareModule} onClose={() => setShareModule(null)} />
      )}

      {/* Import Modal */}
      {showImport && (
        <ModuleImportPanel onClose={() => setShowImport(false)} onImport={handleImport} />
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default ModuleDashboard;

