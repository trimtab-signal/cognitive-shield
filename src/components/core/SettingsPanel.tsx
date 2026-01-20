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

import React, { useState, useEffect } from 'react';
import { navigatorService } from '../../services/navigator.service';
import { HistoryService } from '../../services/history.service';
import { useHeartbeatStore } from '../../stores/heartbeat.store';
import { NavigatorConfig } from '../../config/god.config';

type AIProvider = 'ollama' | 'openai' | 'gemini';

export const SettingsPanel: React.FC = () => {
  const [navigatorUrl, setNavigatorUrl] = useState('');
  const [aiProvider, setAiProvider] = useState<AIProvider>('ollama');
  const [ollamaUrl, setOllamaUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const setSpoons = useHeartbeatStore(state => state.setSpoons);
  const maxSpoons = useHeartbeatStore(state => state.operator.maxSpoons);
  
  useEffect(() => {
    setNavigatorUrl(localStorage.getItem('NAVIGATOR_URL') || NavigatorConfig.telemetryEndpoint);
    setAiProvider((localStorage.getItem('AI_PROVIDER') as AIProvider) || 'ollama');
    setOllamaUrl(localStorage.getItem('OLLAMA_URL') || 'http://localhost:11434');
    setApiKey(localStorage.getItem('AI_API_KEY') || '');
  }, []);

  const handleSave = () => {
    localStorage.setItem('NAVIGATOR_URL', navigatorUrl);
    localStorage.setItem('AI_PROVIDER', aiProvider);
    localStorage.setItem('OLLAMA_URL', ollamaUrl);
    localStorage.setItem('AI_API_KEY', apiKey);
    
    // Trigger reconnection
    navigatorService.disconnect();
    setTimeout(() => navigatorService.connect(), 500);
    
    alert('Settings saved. Navigator reconnecting...');
  };

  const simulateAnomaly = () => {
    navigatorService.simulateAnomaly();
    alert('Simulated Anomaly Injected');
  };

  const clearHistory = async () => {
    if (window.confirm('Delete all message history? This cannot be undone.')) {
        await HistoryService.clearHistory();
        alert('History cleared');
    }
  };

  const handleResetSpoons = () => {
    setSpoons(maxSpoons);
    alert('Spoons reset to full capacity');
  };

  return (
    <div style={{
      background: '#1F2937',
      borderRadius: '12px',
      border: '1px solid #374151',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      height: '100%',
      overflowY: 'auto'
    }}>
      <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#F3F4F6', margin: 0 }}>
        Settings & Developer Tools
      </h2>

      {/* Configuration */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '14px', color: '#9CA3AF', textTransform: 'uppercase', margin: 0 }}>
          System Configuration
        </h3>
        
        <div>
          <label style={{ display: 'block', fontSize: '12px', color: '#D1D5DB', marginBottom: '8px' }}>
            Navigator Endpoint (WebSocket)
          </label>
          <input
            type="text"
            value={navigatorUrl}
            onChange={(e) => setNavigatorUrl(e.target.value)}
            placeholder="wss://wye.phenix.local/quantum"
            style={{
              width: '100%',
              padding: '10px',
              background: '#111827',
              border: '1px solid #374151',
              borderRadius: '6px',
              color: '#F3F4F6',
              fontFamily: 'monospace'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', color: '#D1D5DB', marginBottom: '8px' }}>
            AI Provider
          </label>
          <select
            aria-label="AI Provider"
            value={aiProvider}
            onChange={(e) => setAiProvider(e.target.value as AIProvider)}
            style={{
              width: '100%',
              padding: '10px',
              background: '#111827',
              border: '1px solid #374151',
              borderRadius: '6px',
              color: '#F3F4F6',
              fontFamily: 'sans-serif'
            }}
          >
            <option value="ollama">Ollama (Local - Recommended)</option>
            <option value="openai">OpenAI (Cloud - High Privacy Risk)</option>
            <option value="gemini">Gemini (Cloud - High Privacy Risk)</option>
          </select>
        </div>

        {aiProvider === 'ollama' ? (
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#D1D5DB', marginBottom: '8px' }}>
              Ollama Endpoint
            </label>
            <input
              type="text"
              value={ollamaUrl}
              onChange={(e) => setOllamaUrl(e.target.value)}
              placeholder="http://localhost:11434"
              style={{
                width: '100%',
                padding: '10px',
                background: '#111827',
                border: '1px solid #374151',
                borderRadius: '6px',
                color: '#F3F4F6',
                fontFamily: 'monospace'
              }}
            />
          </div>
        ) : (
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#D1D5DB', marginBottom: '8px' }}>
              API Key ({aiProvider.toUpperCase()})
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              style={{
                width: '100%',
                padding: '10px',
                background: '#111827',
                border: '1px solid #374151',
                borderRadius: '6px',
                color: '#F3F4F6',
                fontFamily: 'monospace'
              }}
            />
            <div style={{ 
              marginTop: '8px', 
              padding: '12px', 
              background: '#7F1D1D20', 
              border: '1px solid #7F1D1D',
              borderRadius: '6px',
              color: '#FCA5A5',
              fontSize: '12px'
            }}>
              <strong>⚠️ PRIVACY WARNING:</strong> You are sending data to a third-party cloud provider. 
              This breaks the local-first privacy model. Only use this if you trust {aiProvider.toUpperCase()} with your data.
            </div>
          </div>
        )}

        <button
          onClick={handleSave}
          style={{
            padding: '10px',
            background: '#2563EB',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 500,
            width: 'fit-content'
          }}
        >
          Save Configuration
        </button>
      </section>

      <div style={{ height: '1px', background: '#374151' }} />

      {/* Developer Tools */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '14px', color: '#9CA3AF', textTransform: 'uppercase', margin: 0 }}>
          Developer Tools
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
          <button
            onClick={simulateAnomaly}
            style={{
              padding: '12px',
              background: '#374151',
              border: '1px solid #EF4444',
              color: '#EF4444',
              borderRadius: '6px',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            ⚠️ Simulate Anomaly
          </button>

          <button
            onClick={handleResetSpoons}
            style={{
              padding: '12px',
              background: '#374151',
              border: '1px solid #10B981',
              color: '#10B981',
              borderRadius: '6px',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            🥄 Reset Spoons
          </button>

          <button
            onClick={clearHistory}
            style={{
              padding: '12px',
              background: '#374151',
              border: '1px solid #F59E0B',
              color: '#F59E0B',
              borderRadius: '6px',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            🗑️ Clear History
          </button>
        </div>
      </section>
    </div>
  );
};
