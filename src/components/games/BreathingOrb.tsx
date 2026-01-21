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
import { CosmicTheme } from '../../config/cosmic-theme';
import { useHeartbeatStore } from '../../stores/heartbeat.store';

type Phase = 'inhale' | 'hold1' | 'exhale' | 'hold2';

const PHASES: { name: Phase; duration: number; instruction: string; color: string }[] = [
  { name: 'inhale', duration: 4000, instruction: 'Breathe in...', color: '#60A5FA' },
  { name: 'hold1', duration: 4000, instruction: 'Hold...', color: '#C084FC' },
  { name: 'exhale', duration: 4000, instruction: 'Breathe out...', color: '#34D399' },
  { name: 'hold2', duration: 4000, instruction: 'Hold...', color: '#FBBF24' },
];

/**
 * BREATHING ORB - Box breathing guide for self-regulation
 * 
 * Why this works:
 * - Visual pacing removes guesswork
 * - Predictable 4-4-4-4 cycle creates safety
 * - Orb expansion matches breath naturally
 * - No sudden sounds or movements
 * - Completing cycles earns spoons
 */
export const BreathingOrb: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const updateSpoons = useHeartbeatStore(state => state.updateSpoons);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentPhase = PHASES[phaseIndex];

  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
      return;
    }

    // Progress bar update (smooth)
    progressRef.current = setInterval(() => {
      setProgress(p => Math.min(p + 2, 100));
    }, currentPhase.duration / 50);

    // Phase transition
    intervalRef.current = setTimeout(() => {
      setProgress(0);
      const nextIndex = (phaseIndex + 1) % PHASES.length;
      setPhaseIndex(nextIndex);
      
      // Complete cycle when returning to inhale
      if (nextIndex === 0) {
        setCyclesCompleted(prev => {
          const newCount = prev + 1;
          // Every 3 cycles = spoon reward
          if (newCount % 3 === 0) {
            updateSpoons(1.0);
            setShowReward(true);
            setTimeout(() => setShowReward(false), 2000);
          }
          return newCount;
        });
      }
    }, currentPhase.duration);

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [isActive, phaseIndex, currentPhase.duration, updateSpoons]);

  const toggleBreathing = () => {
    if (isActive) {
      setIsActive(false);
      setPhaseIndex(0);
      setProgress(0);
    } else {
      setIsActive(true);
    }
  };

  // Calculate orb size based on phase
  const getOrbScale = () => {
    if (!isActive) return 1;
    const progressFraction = progress / 100;
    
    switch (currentPhase.name) {
      case 'inhale':
        return 1 + (progressFraction * 0.5); // Grow from 1 to 1.5
      case 'hold1':
        return 1.5; // Stay big
      case 'exhale':
        return 1.5 - (progressFraction * 0.5); // Shrink from 1.5 to 1
      case 'hold2':
        return 1; // Stay small
      default:
        return 1;
    }
  };

  return (
    <div style={{
      background: CosmicTheme.cardGradient,
      borderRadius: CosmicTheme.cardRadius,
      padding: CosmicTheme.cardPadding,
      border: `1px solid ${CosmicTheme.colors.delta}`,
      height: '400px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: CosmicTheme.cosmicGlow,
    }}>
      {/* Header */}
      <div style={{ 
        width: '100%',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '12px'
      }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#F3F4F6', margin: 0 }}>
          🌬️ Breathing Orb
        </h2>
        <div style={{ 
          background: '#C084FC20', 
          color: '#C084FC', 
          padding: '4px 12px', 
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: 600
        }}>
          {cyclesCompleted} cycles
        </div>
      </div>

      <p style={{ 
        fontSize: '13px', 
        color: '#9CA3AF', 
        margin: '0 0 20px 0',
        textAlign: 'center'
      }}>
        Follow the orb with your breath. 4 seconds each phase.
      </p>

      {/* Breathing Orb */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px'
      }}>
        <div
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: `radial-gradient(circle at 30% 30%, ${currentPhase.color}40, ${currentPhase.color}90)`,
            boxShadow: isActive 
              ? `0 0 60px ${currentPhase.color}60, 0 0 100px ${currentPhase.color}30`
              : '0 0 30px rgba(96, 165, 250, 0.3)',
            transform: `scale(${getOrbScale()})`,
            transition: 'transform 0.1s linear, background 0.5s ease, box-shadow 0.5s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isActive && (
            <span style={{
              color: '#fff',
              fontSize: '32px',
              fontWeight: 300,
              textShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}>
              {Math.ceil((100 - progress) / 25)}
            </span>
          )}
        </div>

        {/* Instruction */}
        <div style={{
          fontSize: '20px',
          color: currentPhase.color,
          fontWeight: 500,
          minHeight: '30px',
          transition: 'color 0.5s ease'
        }}>
          {isActive ? currentPhase.instruction : 'Tap to begin'}
        </div>

        {/* Progress bar */}
        {isActive && (
          <div style={{
            width: '200px',
            height: '4px',
            background: '#374151',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              background: currentPhase.color,
              transition: 'width 0.08s linear'
            }} />
          </div>
        )}
      </div>

      {/* Start/Stop button */}
      <button
        onClick={toggleBreathing}
        style={{
          padding: '12px 32px',
          fontSize: '16px',
          fontWeight: 600,
          background: isActive ? '#EF444420' : '#10B98120',
          color: isActive ? '#EF4444' : '#10B981',
          border: `1px solid ${isActive ? '#EF4444' : '#10B981'}`,
          borderRadius: '12px',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
      >
        {isActive ? 'Stop' : 'Start Breathing'}
      </button>

      {/* Reward overlay */}
      {showReward && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#10B98140',
          padding: '16px 32px',
          borderRadius: '12px',
          color: '#10B981',
          fontSize: '18px',
          fontWeight: 600,
          animation: 'fadeIn 0.3s ease-out',
          zIndex: 100
        }}>
          🌟 +1 spoon restored 🌟
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
    </div>
  );
};
