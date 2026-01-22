/**
 * SETTINGS PANEL COMPONENT
 * API configuration, Ollama setup, and HumanOS selection
 */

import { useState, useEffect } from 'react';
import { Settings, Brain, Eye, EyeOff, Check, Server, Cpu, AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';
import GOD_CONFIG, { type HumanOSType } from '../god.config';
import useShieldStore from '../store/shield.store';
import type { LLMProvider } from '../types/shield.types';
import OllamaGuide from './OllamaGuide';

type OllamaStatus = 'checking' | 'online' | 'offline' | 'error';

export function SettingsPanel() {
  const { 
    apiKey, 
    provider, 
    userHumanOS, 
    ollamaEndpoint,
    ollamaModel,
    setApiKey, 
    setProvider, 
    setUserHumanOS,
    setOllamaEndpoint,
    setOllamaModel,
  } = useShieldStore();
  
  const [isOpen, setIsOpen] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey || '');
  const [tempEndpoint, setTempEndpoint] = useState(ollamaEndpoint);
  const [ollamaStatus, setOllamaStatus] = useState<OllamaStatus>('checking');
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [showOllamaGuide, setShowOllamaGuide] = useState(false);

  const checkOllamaConnection = async () => {
    setOllamaStatus('checking');
    try {
      const response = await fetch(`${ollamaEndpoint}/api/tags`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        const data = await response.json();
        const models = data.models?.map((m: { name: string }) => m.name.split(':')[0]) || [];
        setAvailableModels([...new Set(models)] as string[]);
        setOllamaStatus('online');
      } else {
        setOllamaStatus('error');
      }
    } catch (error) {
      console.warn('Ollama connection check failed (this is expected if Ollama is not running):', error);
      setOllamaStatus('offline');
    }
  };

  // Check Ollama connection on mount and when endpoint changes
  useEffect(() => {
    if (provider === 'ollama') {
      checkOllamaConnection();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider, ollamaEndpoint]);

  const handleSaveKey = () => {
    setApiKey(tempKey);
  };

  const handleSaveEndpoint = () => {
    setOllamaEndpoint(tempEndpoint);
  };

  const providers: { id: LLMProvider; name: string; icon: string; local?: boolean }[] = [
    { id: 'ollama', name: 'Ollama', icon: '🦙', local: true },
    { id: 'openai', name: 'OpenAI', icon: '🟢' },
    { id: 'anthropic', name: 'Claude', icon: '🟣' },
    { id: 'gemini', name: 'Gemini', icon: '🔵' },
  ];

  const humanOSOptions = Object.entries(GOD_CONFIG.humanOS) as [HumanOSType, typeof GOD_CONFIG.humanOS[HumanOSType]][];

  const getStatusColor = () => {
    switch (ollamaStatus) {
      case 'online': return GOD_CONFIG.voltage.low.color;
      case 'offline': return GOD_CONFIG.voltage.high.color;
      case 'error': return GOD_CONFIG.voltage.medium.color;
      default: return GOD_CONFIG.theme.text.muted;
    }
  };

  const getStatusIcon = () => {
    switch (ollamaStatus) {
      case 'online': return <CheckCircle2 size={12} />;
      case 'offline': 
      case 'error': return <AlertCircle size={12} />;
      default: return <Server size={12} style={{ animation: 'spin 1s linear infinite' }} />;
    }
  };

  return (
    <div style={{ marginBottom: 16 }}>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 16px',
          backgroundColor: isOpen 
            ? GOD_CONFIG.theme.bg.accent 
            : GOD_CONFIG.theme.bg.secondary,
          border: `1px solid ${GOD_CONFIG.theme.border.default}`,
          borderRadius: 8,
          color: GOD_CONFIG.theme.text.secondary,
          fontSize: 13,
          fontFamily: GOD_CONFIG.typography.fontFamily.display,
          cursor: 'pointer',
          width: '100%',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
        }}
      >
        <Settings size={16} />
        {isOpen ? 'Hide Settings' : 'Configure Shield'}
        {provider === 'ollama' && (
          <span style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 4,
            marginLeft: 8,
            color: getStatusColor(),
          }}>
            {getStatusIcon()}
            <span style={{ fontSize: 10 }}>
              {ollamaStatus === 'online' ? 'Local' : ollamaStatus}
            </span>
          </span>
        )}
      </button>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Settings panel */}
      {isOpen && (
        <div
          style={{
            marginTop: 12,
            backgroundColor: GOD_CONFIG.theme.bg.secondary,
            border: `1px solid ${GOD_CONFIG.theme.border.default}`,
            borderRadius: 12,
            padding: 20,
          }}
        >
          {/* Provider Section */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 8,
              marginBottom: 12,
            }}>
              <Cpu size={16} color={GOD_CONFIG.theme.text.accent} />
              <span style={{ 
                color: GOD_CONFIG.theme.text.primary,
                fontSize: 13,
                fontWeight: 600,
                fontFamily: GOD_CONFIG.typography.fontFamily.display,
              }}>
                AI PROVIDER
              </span>
            </div>

            {/* Provider selection */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 8, 
              marginBottom: 12,
            }}>
              {providers.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setProvider(p.id)}
                  style={{
                    padding: '10px 8px',
                    backgroundColor: provider === p.id 
                      ? GOD_CONFIG.theme.bg.accent 
                      : GOD_CONFIG.theme.bg.tertiary,
                    border: `1px solid ${provider === p.id 
                      ? GOD_CONFIG.theme.border.accent 
                      : GOD_CONFIG.theme.border.default}`,
                    borderRadius: 6,
                    color: provider === p.id 
                      ? GOD_CONFIG.theme.text.primary 
                      : GOD_CONFIG.theme.text.muted,
                    fontSize: 11,
                    fontFamily: GOD_CONFIG.typography.fontFamily.display,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 4,
                    transition: 'all 0.2s ease',
                    position: 'relative',
                  }}
                >
                  <span style={{ fontSize: 18 }}>{p.icon}</span>
                  <span>{p.name}</span>
                  {provider === p.id && (
                    <Check 
                      size={10} 
                      style={{ 
                        position: 'absolute', 
                        top: 4, 
                        right: 4,
                        color: GOD_CONFIG.theme.text.accent,
                      }} 
                    />
                  )}
                  {p.local && (
                    <span style={{
                      position: 'absolute',
                      bottom: 4,
                      right: 4,
                      fontSize: 8,
                      padding: '1px 4px',
                      backgroundColor: GOD_CONFIG.voltage.low.color + '30',
                      color: GOD_CONFIG.voltage.low.color,
                      borderRadius: 3,
                    }}>
                      LOCAL
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Ollama Configuration */}
            {provider === 'ollama' && (
              <div 
                style={{
                  padding: 16,
                  backgroundColor: GOD_CONFIG.theme.bg.tertiary,
                  borderRadius: 8,
                  border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  marginBottom: 12,
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 8,
                  }}>
                    <Server size={14} color={GOD_CONFIG.theme.text.accent} />
                    <span style={{ 
                      color: GOD_CONFIG.theme.text.primary,
                      fontSize: 12,
                      fontWeight: 600,
                      fontFamily: GOD_CONFIG.typography.fontFamily.display,
                    }}>
                      OLLAMA CONFIGURATION
                    </span>
                  </div>
                  <button
                    onClick={() => setShowOllamaGuide(true)}
                    style={{
                      padding: '4px 10px',
                      backgroundColor: `${GOD_CONFIG.emotionalValence.calm.color}15`,
                      border: `1px solid ${GOD_CONFIG.emotionalValence.calm.color}40`,
                      borderRadius: 4,
                      color: GOD_CONFIG.emotionalValence.calm.color,
                      fontSize: 10,
                      fontFamily: GOD_CONFIG.typography.fontFamily.display,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <HelpCircle size={12} />
                    What is Ollama?
                  </button>
                </div>
                
                {/* Status indicator */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 12,
                }}>
                  <span style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    marginLeft: 'auto',
                    color: getStatusColor(),
                    fontSize: 11,
                  }}>
                    {getStatusIcon()}
                    {ollamaStatus === 'checking' ? 'Checking...' : 
                     ollamaStatus === 'online' ? 'Connected' : 
                     ollamaStatus === 'offline' ? 'Not running' : 'Error'}
                  </span>
                </div>

                {/* Endpoint input */}
                <div style={{ marginBottom: 12 }}>
                  <label style={{ 
                    display: 'block',
                    color: GOD_CONFIG.theme.text.muted,
                    fontSize: 10,
                    marginBottom: 4,
                    fontFamily: GOD_CONFIG.typography.fontFamily.display,
                  }}>
                    ENDPOINT URL
                  </label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      type="text"
                      value={tempEndpoint}
                      onChange={(e) => setTempEndpoint(e.target.value)}
                      placeholder="http://localhost:11434"
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        backgroundColor: GOD_CONFIG.theme.bg.primary,
                        border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                        borderRadius: 6,
                        color: GOD_CONFIG.theme.text.primary,
                        fontSize: 12,
                        fontFamily: GOD_CONFIG.typography.fontFamily.display,
                        outline: 'none',
                      }}
                    />
                    <button
                      onClick={handleSaveEndpoint}
                      style={{
                        padding: '10px 16px',
                        backgroundColor: GOD_CONFIG.theme.text.accent,
                        border: 'none',
                        borderRadius: 6,
                        color: '#fff',
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontFamily: GOD_CONFIG.typography.fontFamily.display,
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={checkOllamaConnection}
                      style={{
                        padding: '10px 16px',
                        backgroundColor: GOD_CONFIG.theme.bg.accent,
                        border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                        borderRadius: 6,
                        color: GOD_CONFIG.theme.text.secondary,
                        fontSize: 11,
                        cursor: 'pointer',
                        fontFamily: GOD_CONFIG.typography.fontFamily.display,
                      }}
                    >
                      Test
                    </button>
                  </div>
                </div>

                {/* Model selection */}
                <div>
                  <label style={{ 
                    display: 'block',
                    color: GOD_CONFIG.theme.text.muted,
                    fontSize: 10,
                    marginBottom: 4,
                    fontFamily: GOD_CONFIG.typography.fontFamily.display,
                  }}>
                    MODEL
                  </label>
                  
                  {ollamaStatus === 'online' && availableModels.length > 0 ? (
                    <div style={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: 6,
                    }}>
                      {availableModels.map((model) => (
                        <button
                          key={model}
                          onClick={() => setOllamaModel(model)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: ollamaModel === model 
                              ? GOD_CONFIG.theme.text.accent + '20'
                              : GOD_CONFIG.theme.bg.primary,
                            border: `1px solid ${ollamaModel === model 
                              ? GOD_CONFIG.theme.text.accent 
                              : GOD_CONFIG.theme.border.default}`,
                            borderRadius: 4,
                            color: ollamaModel === model 
                              ? GOD_CONFIG.theme.text.accent 
                              : GOD_CONFIG.theme.text.secondary,
                            fontSize: 11,
                            fontFamily: GOD_CONFIG.typography.fontFamily.display,
                            cursor: 'pointer',
                          }}
                        >
                          {model}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div>
                      <select
                        value={ollamaModel}
                        onChange={(e) => setOllamaModel(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          backgroundColor: GOD_CONFIG.theme.bg.primary,
                          border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                          borderRadius: 6,
                          color: GOD_CONFIG.theme.text.primary,
                          fontSize: 12,
                          fontFamily: GOD_CONFIG.typography.fontFamily.display,
                          outline: 'none',
                        }}
                      >
                        {GOD_CONFIG.ollama.recommendedModels.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} - {m.description}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Help text */}
                {ollamaStatus === 'offline' && (
                  <div style={{ 
                    marginTop: 12,
                    padding: 12,
                    backgroundColor: GOD_CONFIG.voltage.high.color + '15',
                    borderRadius: 6,
                    color: GOD_CONFIG.voltage.high.color,
                    fontSize: 11,
                    lineHeight: 1.5,
                  }}>
                    <strong>Ollama not detected.</strong> Make sure Ollama is running:
                    <div style={{ 
                      marginTop: 8,
                      padding: 8,
                      backgroundColor: GOD_CONFIG.theme.bg.primary,
                      borderRadius: 4,
                      fontFamily: GOD_CONFIG.typography.fontFamily.display,
                      color: GOD_CONFIG.theme.text.secondary,
                    }}>
                      ollama serve
                    </div>
                    <div style={{ marginTop: 8 }}>
                      Then pull a model: <code style={{ 
                        backgroundColor: GOD_CONFIG.theme.bg.primary,
                        padding: '2px 6px',
                        borderRadius: 3,
                      }}>ollama pull llama3.2</code>
                    </div>
                  </div>
                )}

                {ollamaStatus === 'online' && (
                  <div style={{ 
                    marginTop: 12,
                    fontSize: 11,
                    color: GOD_CONFIG.voltage.low.color,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}>
                    <CheckCircle2 size={12} />
                    <span>
                      <strong>Privacy First:</strong> All processing happens locally. No data leaves your machine.
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Cloud Provider API Key input */}
            {provider !== 'ollama' && (
              <>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={tempKey}
                    onChange={(e) => setTempKey(e.target.value)}
                    placeholder={`Enter your ${providers.find(p => p.id === provider)?.name} API key`}
                    style={{
                      width: '100%',
                      padding: '12px 80px 12px 14px',
                      backgroundColor: GOD_CONFIG.theme.bg.primary,
                      border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                      borderRadius: 6,
                      color: GOD_CONFIG.theme.text.primary,
                      fontSize: 13,
                      fontFamily: GOD_CONFIG.typography.fontFamily.display,
                      outline: 'none',
                    }}
                  />
                  <div style={{ 
                    position: 'absolute', 
                    right: 8, 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    display: 'flex',
                    gap: 4,
                  }}>
                    <button
                      onClick={() => setShowKey(!showKey)}
                      style={{
                        padding: 6,
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: GOD_CONFIG.theme.text.muted,
                        cursor: 'pointer',
                      }}
                    >
                      {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button
                      onClick={handleSaveKey}
                      style={{
                        padding: '4px 10px',
                        backgroundColor: GOD_CONFIG.theme.text.accent,
                        border: 'none',
                        borderRadius: 4,
                        color: '#fff',
                        fontSize: 11,
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>

                {/* Status */}
                <div style={{ 
                  marginTop: 8,
                  fontSize: 11,
                  color: apiKey 
                    ? GOD_CONFIG.voltage.low.color 
                    : GOD_CONFIG.theme.text.muted,
                }}>
                  {apiKey 
                    ? '✓ API key configured - using cloud AI analysis' 
                    : '⚠ No API key - using local heuristic processing (less accurate)'}
                </div>
              </>
            )}
          </div>

          {/* HumanOS Selection */}
          <div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 8,
              marginBottom: 12,
            }}>
              <Brain size={16} color={GOD_CONFIG.theme.text.accent} />
              <span style={{ 
                color: GOD_CONFIG.theme.text.primary,
                fontSize: 13,
                fontWeight: 600,
                fontFamily: GOD_CONFIG.typography.fontFamily.display,
              }}>
                YOUR HUMAN OS
              </span>
              <span style={{ 
                color: GOD_CONFIG.theme.text.muted,
                fontSize: 11,
              }}>
                (for response matching)
              </span>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: 8,
            }}>
              {humanOSOptions.map(([key, os]) => (
                <button
                  key={key}
                  onClick={() => setUserHumanOS(key)}
                  style={{
                    padding: '12px',
                    backgroundColor: userHumanOS === key 
                      ? `${os.color}20` 
                      : GOD_CONFIG.theme.bg.tertiary,
                    border: `1px solid ${userHumanOS === key 
                      ? os.color 
                      : GOD_CONFIG.theme.border.default}`,
                    borderRadius: 8,
                    color: userHumanOS === key 
                      ? os.color 
                      : GOD_CONFIG.theme.text.muted,
                    fontSize: 12,
                    fontFamily: GOD_CONFIG.typography.fontFamily.display,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 6,
                    marginBottom: 4,
                  }}>
                    <span>{os.icon}</span>
                    <span style={{ fontWeight: 600 }}>{os.name}</span>
                  </div>
                  <div style={{ 
                    fontSize: 10, 
                    opacity: 0.7,
                    lineHeight: 1.3,
                  }}>
                    {os.coreImperative.split(',')[0]}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Ollama Guide Modal */}
      <OllamaGuide isOpen={showOllamaGuide} onClose={() => setShowOllamaGuide(false)} />
    </div>
  );
}

export default SettingsPanel;
