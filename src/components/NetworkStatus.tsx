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

import { useEffect, useState } from 'react';
import { Wifi, WifiOff, AlertCircle, Cloud, CloudOff } from 'lucide-react';
import GOD_CONFIG from '../god.config';

/**
 * Global Network Status Indicator
 * Shows mesh (peer) and LLM/API connectivity at a glance
 */
export default function NetworkStatus() {
  const [online, setOnline] = useState(true);
  const [llmStatus, setLlmStatus] = useState<'ok' | 'error' | 'offline'>('ok');

  // Listen for browser online/offline events
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    update();
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  // Optionally, poll LLM/API endpoint for status
  useEffect(() => {
    let cancelled = false;
    async function checkLLM() {
      try {
        // Replace with actual endpoint if needed
        const res = await fetch('/api/llm-status', { method: 'GET' });
        if (!cancelled) setLlmStatus(res.ok ? 'ok' : 'error');
      } catch {
        if (!cancelled) setLlmStatus('offline');
      }
    }
    checkLLM();
    const interval = setInterval(checkLLM, 15000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '0.5rem 1rem',
      background: GOD_CONFIG.theme.bg.secondary,
      border: `1px solid ${GOD_CONFIG.theme.border.default}`,
      borderRadius: 8,
      fontSize: '1rem',
      color: GOD_CONFIG.theme.text.primary,
      marginBottom: 8,
      width: 'fit-content',
      boxShadow: '0 2px 8px #0001',
    }}>
      {/* Mesh/Network */}
      {online ? <Wifi size={18} color={GOD_CONFIG.voltage.low.color} /> : <WifiOff size={18} color={GOD_CONFIG.voltage.high.color} />}
      <span style={{ fontWeight: 500 }}>{online ? 'Online' : 'Offline'}</span>
      {/* LLM/API */}
      {llmStatus === 'ok' && <Cloud size={18} color={GOD_CONFIG.voltage.low.color} />}
      {llmStatus === 'error' && <AlertCircle size={18} color={GOD_CONFIG.voltage.medium.color} />}
      {llmStatus === 'offline' && <CloudOff size={18} color={GOD_CONFIG.voltage.high.color} />}
      <span style={{ fontWeight: 500 }}>
        {llmStatus === 'ok' ? 'AI Connected' : llmStatus === 'error' ? 'AI Error' : 'AI Offline'}
      </span>
    </div>
  );
}
