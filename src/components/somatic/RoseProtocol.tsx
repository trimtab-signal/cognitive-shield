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

export const RoseProtocol: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [timer, setTimer] = useState(0);
  const updateSpoons = useHeartbeatStore(state => state.updateSpoons);
  const requestRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const cycleStartTimeRef = useRef<number>(0);
  
  // 4-7-8 Breathing
  const INHALE_DURATION = 4000;
  const HOLD_DURATION = 7000;
  const EXHALE_DURATION = 8000;
  const CYCLE_DURATION = INHALE_DURATION + HOLD_DURATION + EXHALE_DURATION;

  const startSession = () => {
    setIsActive(true);
    setPhase('inhale');
    startTimeRef.current = performance.now();
    cycleStartTimeRef.current = performance.now();
    animate(performance.now());
  };

  const stopSession = () => {
    setIsActive(false);
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    // Award recovery if at least one full cycle completed
    updateSpoons(MetabolismConfig.recovery.breathing); 
  };

  const animate = (time: number) => {
    if (!cycleStartTimeRef.current) cycleStartTimeRef.current = time;
    const elapsedInCycle = time - cycleStartTimeRef.current;
    
    let currentPhase: 'inhale' | 'hold' | 'exhale' = 'inhale';
    if (elapsedInCycle < INHALE_DURATION) {
      currentPhase = 'inhale';
      setTimer(Math.ceil((INHALE_DURATION - elapsedInCycle) / 1000));
    } else if (elapsedInCycle < INHALE_DURATION + HOLD_DURATION) {
      currentPhase = 'hold';
      setTimer(Math.ceil((INHALE_DURATION + HOLD_DURATION - elapsedInCycle) / 1000));
    } else if (elapsedInCycle < CYCLE_DURATION) {
      currentPhase = 'exhale';
      setTimer(Math.ceil((CYCLE_DURATION - elapsedInCycle) / 1000));
    } else {
      // New Cycle
      cycleStartTimeRef.current = time;
      currentPhase = 'inhale';
    }

    setPhase(currentPhase);
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // Visualizing the spiral/breathing circle
  // We can use a CSS transform scale based on phase
  const getScale = () => {
    if (phase === 'inhale') return 1.5; // Expand
    if (phase === 'hold') return 1.5;   // Stay expanded
    if (phase === 'exhale') return 1.0; // Contract
    return 1.0;
  };

  const getDuration = () => {
    if (phase === 'inhale') return `${INHALE_DURATION}ms`;
    if (phase === 'hold') return '0ms'; // No transition during hold (stay same)
    if (phase === 'exhale') return `${EXHALE_DURATION}ms`;
    return '0ms';
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
          🌹 Rose Protocol (4-7-8)
        </h2>
      </div>

      <p style={{ fontSize: '13px', color: '#9CA3AF', margin: 0 }}>
        Breathe in for 4, hold for 7, exhale for 8. 
        Follow the spiral to regulate your nervous system.
      </p>

      {!isActive ? (
        <button
          onClick={startSession}
          style={{
            padding: '12px',
            background: '#BE185D', // Pink/Rose
            color: '#FCE7F3',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500
          }}
        >
          Start Breathing Session
        </button>
      ) : (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.95)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
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
            End Session
          </button>

          {/* Breathing Circle/Spiral Visualization */}
          <div style={{
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'conic-gradient(from 0deg, #BE185D, #DB2777, #F472B6, #BE185D)',
            transition: `transform ${getDuration()} ease-in-out`,
            transform: `scale(${getScale()})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 50px rgba(190, 24, 93, 0.3)',
            opacity: 0.8
          }}>
            {/* Inner Spiral Mockup (SVG) */}
            <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ animation: 'spin 20s linear infinite' }}>
               <path d="M50 50 L50 10 A40 40 0 0 1 90 50 A40 40 0 0 1 50 90 A40 40 0 0 1 10 50 A40 40 0 0 1 50 10" 
                     fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
               <path d="M50 50 L50 20 A30 30 0 0 1 80 50 A30 30 0 0 1 50 80 A30 30 0 0 1 20 50 A30 30 0 0 1 50 20" 
                     fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
            </svg>
          </div>

          <div style={{ marginTop: '60px', textAlign: 'center' }}>
            <h1 style={{ 
              fontSize: '48px', 
              color: '#FCE7F3', 
              marginBottom: '10px',
              fontVariantNumeric: 'tabular-nums'
            }}>
              {phase === 'inhale' ? 'Inhale' : phase === 'hold' ? 'Hold' : 'Exhale'}
            </h1>
            <div style={{ fontSize: '24px', color: '#BE185D' }}>{timer}</div>
          </div>
          
          <style>{`
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          `}</style>
        </div>
      )}
    </div>
  );
};
