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

import React, { useState, useEffect, useRef } from 'react';
import { useHeartbeatStore } from '../../stores/heartbeat.store';
import { MetabolismConfig } from '../../config/god.config';

export const LimeDrag: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const updateSpoons = useHeartbeatStore(state => state.updateSpoons);
  const requestRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const [position, setPosition] = useState({ x: 50, y: 50 });

  const startSession = () => {
    setIsActive(true);
    setTimeLeft(60);
    startTimeRef.current = performance.now();
    animate(performance.now());
  };

  const stopSession = () => {
    setIsActive(false);
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    // Add spoon recovery on completion (or partial?)
    // Prompt says "Spoon recovery based on activity intensity" for HeavyWork,
    // but LimeDrag "Triggers oculocardiac reflex". 
    // Let's award a small amount if completed significantly, but sticking to manual finish for now.
    // If they finish the timer:
    if (timeLeft <= 0) {
        updateSpoons(MetabolismConfig.recovery.breathing); // Using breathing value as proxy or default
    }
  };

  const animate = (time: number) => {
    if (!startTimeRef.current) startTimeRef.current = time;
    const elapsed = time - startTimeRef.current;
    const seconds = elapsed / 1000;

    // Smooth pursuit path: Horizontal Figure 8 (Infinity loop)
    // x = cos(t)
    // y = sin(2t) / 2
    // Scaled to 0-100% viewport
    
    // Slow speed: 0.2 Hz (5 seconds per loop)
    const speed = 0.2; 
    const t = seconds * speed * Math.PI * 2;

    const x = 50 + 40 * Math.cos(t);
    const y = 50 + 20 * Math.sin(2 * t);

    setPosition({ x, y });

    // Update timer
    const newTimeLeft = Math.max(0, 60 - seconds);
    setTimeLeft(newTimeLeft);

    if (newTimeLeft > 0) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      setIsActive(false);
      updateSpoons(MetabolismConfig.recovery.breathing); 
    }
  };

  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

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
          👁️ LimeDrag (Oculocardiac Reset)
        </h2>
        {isActive && (
           <span style={{ fontFamily: 'monospace', color: '#10B981' }}>
             {Math.ceil(timeLeft)}s
           </span>
        )}
      </div>

      <p style={{ fontSize: '13px', color: '#9CA3AF', margin: 0 }}>
        Follow the lime dot with your eyes. Do not move your head. 
        This triggers the oculocardiac reflex to lower heart rate.
      </p>

      {!isActive ? (
        <button
          onClick={startSession}
          style={{
            padding: '12px',
            background: '#065F46', // Dark green
            color: '#D1FAE5',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500
          }}
        >
          Start 60s Session
        </button>
      ) : (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.9)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Exit button */}
          <button 
            onClick={stopSession}
            style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'transparent',
                border: '1px solid #374151',
                color: '#9CA3AF',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer'
            }}
          >
            Stop
          </button>

          <div style={{
            position: 'absolute',
            top: `${position.y}%`,
            left: `${position.x}%`,
            width: '40px',
            height: '40px',
            background: '#84CC16', // Lime 500
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 20px #84CC16'
          }} />
          
          <div style={{
             position: 'absolute',
             bottom: '40px',
             color: '#4B5563',
             fontSize: '14px'
          }}>
             Keep head still • Follow with eyes • {Math.ceil(timeLeft)}s
          </div>
        </div>
      )}
    </div>
  );
};
