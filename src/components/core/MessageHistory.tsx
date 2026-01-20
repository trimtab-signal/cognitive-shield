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

import React, { useEffect, useState } from 'react';
import { HistoryService, type HistoryFilter } from '../../services/history.service';
import type { ProcessedMessage } from '../../types';
import { VoltageBadge } from '../ui/VoltageIndicator';

export const MessageHistory: React.FC = () => {
  const [messages, setMessages] = useState<ProcessedMessage[]>([]);
  const [filter, setFilter] = useState<HistoryFilter>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadHistory();
  }, [filter]);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const data = await HistoryService.getMessages(filter);
      setMessages(data);
    } catch (error) {
      console.error('Failed to load history', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const json = await HistoryService.exportHistory();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `shield-history-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed', error);
    }
  };

  return (
    <div style={{
      background: '#1F2937',
      borderRadius: '12px',
      border: '1px solid #374151',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      height: '600px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#F3F4F6', margin: 0 }}>
          Message History
        </h2>
        <button
          onClick={handleExport}
          style={{
            padding: '8px 12px',
            background: '#374151',
            border: '1px solid #4B5563',
            borderRadius: '6px',
            color: '#D1D5DB',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Export JSON
        </button>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          placeholder="Search content..."
          value={filter.searchText || ''}
          onChange={(e) => setFilter({ ...filter, searchText: e.target.value })}
          style={{
            flex: 1,
            padding: '8px',
            background: '#111827',
            border: '1px solid #374151',
            borderRadius: '6px',
            color: '#F3F4F6'
          }}
        />
      </div>

      <div style={{ 
        flex: 1, 
        overflowY: 'auto',
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px' 
      }}>
        {isLoading ? (
          <div style={{ color: '#9CA3AF', textAlign: 'center', padding: '20px' }}>Loading...</div>
        ) : messages.length === 0 ? (
          <div style={{ color: '#9CA3AF', textAlign: 'center', padding: '20px' }}>No messages found.</div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} style={{
              background: '#111827',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #374151'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: '#9CA3AF' }}>
                  {new Date(msg.processedAt).toLocaleString()}
                </span>
                <VoltageBadge voltage={msg.voltage.score} />
              </div>
              <div style={{ fontWeight: 600, color: '#E5E7EB', marginBottom: '4px' }}>
                {msg.raw.sender} ({msg.senderOS})
              </div>
              <div style={{ fontSize: '14px', color: '#D1D5DB', marginBottom: '8px' }}>
                {msg.safeSummary}
              </div>
              {msg.rawViewed && (
                <div style={{ 
                  fontSize: '12px', 
                  color: '#9CA3AF', 
                  paddingTop: '8px', 
                  borderTop: '1px solid #374151' 
                }}>
                  Raw viewed
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
