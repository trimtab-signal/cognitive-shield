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

import React from 'react';
import { useHeartbeatStore } from '../../stores/heartbeat.store';

interface Activity {
  id: string;
  name: string;
  emoji: string;
  recovery: number;
  description: string;
}

const ACTIVITIES: Activity[] = [
  { id: 'wall_pushes', name: 'Wall Pushes', emoji: '🧱', recovery: 1.0, description: 'Push against a wall with full force for 20s' },
  { id: 'weighted_blanket', name: 'Weighted Blanket', emoji: '🛌', recovery: 1.5, description: '15 mins under pressure' },
  { id: 'walking', name: 'Walking', emoji: '🚶', recovery: 2.0, description: '10 min brisk walk outside' },
  { id: 'plank', name: 'Plank', emoji: '💪', recovery: 1.5, description: 'Hold as long as possible' },
  { id: 'jumping_jacks', name: 'Jumping Jacks', emoji: '🤸', recovery: 1.0, description: '20 reps to reset state' },
];

export const HeavyWork: React.FC = () => {
  const updateSpoons = useHeartbeatStore(state => state.updateSpoons);

  const logActivity = (activity: Activity) => {
    updateSpoons(activity.recovery);
    // Could add a toast or visual feedback here
  };

  return (
    <div style={{
      background: '#1F2937',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid #374151',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#F3F4F6', margin: 0 }}>
          🏋️ Heavy Work (Proprioception)
        </h2>
      </div>

      <p style={{ fontSize: '13px', color: '#9CA3AF', margin: 0 }}>
        Log physical activities to regain spoons through proprioceptive feedback.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
        {ACTIVITIES.map((activity) => (
          <button
            key={activity.id}
            onClick={() => logActivity(activity)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px',
              background: '#374151',
              border: '1px solid #4B5563',
              borderRadius: '8px',
              color: '#F3F4F6',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#4B5563'}
            onMouseOut={(e) => e.currentTarget.style.background = '#374151'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>{activity.emoji}</span>
              <div>
                <div style={{ fontWeight: 500 }}>{activity.name}</div>
                <div style={{ fontSize: '11px', color: '#9CA3AF' }}>{activity.description}</div>
              </div>
            </div>
            <div style={{ 
              background: '#10B98120', 
              color: '#10B981', 
              padding: '4px 8px', 
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 600
            }}>
              +{activity.recovery}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
