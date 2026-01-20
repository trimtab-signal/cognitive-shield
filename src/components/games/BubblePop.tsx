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

import React, { useState, useEffect, useCallback } from 'react';
import { useHeartbeatStore } from '../../stores/heartbeat.store';
// Use updateSpoons from store to add/remove spoons

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  popped: boolean;
}

const COLORS = ['#FF6B9D', '#C084FC', '#60A5FA', '#34D399', '#FBBF24', '#F87171'];

/**
 * BUBBLE POP - Neurodivergent-friendly calming game
 * 
 * Why this works:
 * - Predictable cause/effect (tap → satisfying pop)
 * - No failure states - you can't lose
 * - Gentle visual stimulation
 * - Proprioceptive feedback through touch
 * - Earns spoons through regulated play
 */
export const BubblePop: React.FC = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [poppedCount, setPoppedCount] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const updateSpoons = useHeartbeatStore(state => state.updateSpoons);

  // Spawn bubbles gently
  useEffect(() => {
    const interval = setInterval(() => {
      if (bubbles.filter(b => !b.popped).length < 8) {
        const newBubble: Bubble = {
          id: Date.now() + Math.random(),
          x: Math.random() * 80 + 10,
          y: Math.random() * 70 + 15,
          size: Math.random() * 30 + 40,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          popped: false
        };
        setBubbles(prev => [...prev.slice(-20), newBubble]);
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [bubbles]);

  const popBubble = useCallback((id: number) => {
    setBubbles(prev => prev.map(b => 
      b.id === id ? { ...b, popped: true } : b
    ));
    setPoppedCount(prev => {
      const newCount = prev + 1;
      // Every 10 pops = small spoon recovery
      if (newCount % 10 === 0) {
        updateSpoons(0.5);
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 1500);
      }
      return newCount;
    });
  }, [updateSpoons]);

  // Clean up old popped bubbles
  useEffect(() => {
    const cleanup = setInterval(() => {
      setBubbles(prev => prev.filter(b => !b.popped || Date.now() - b.id < 500));
    }, 1000);
    return () => clearInterval(cleanup);
  }, []);

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1F2937 0%, #111827 100%)',
      borderRadius: '16px',
      padding: '20px',
      border: '1px solid #374151',
      height: '400px',
      position: 'relative',
      overflow: 'hidden',
      userSelect: 'none'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '12px',
        position: 'relative',
        zIndex: 10
      }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#F3F4F6', margin: 0 }}>
          🫧 Bubble Pop
        </h2>
        <div style={{ 
          background: '#10B98120', 
          color: '#10B981', 
          padding: '4px 12px', 
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: 600
        }}>
          {poppedCount} popped
        </div>
      </div>

      <p style={{ 
        fontSize: '13px', 
        color: '#9CA3AF', 
        margin: '0 0 12px 0',
        position: 'relative',
        zIndex: 10
      }}>
        Tap the bubbles. No rush. No score. Just pop. 🫧
      </p>

      {/* Bubble area */}
      <div style={{
        position: 'absolute',
        top: '80px',
        left: '0',
        right: '0',
        bottom: '0',
        cursor: 'pointer'
      }}>
        {bubbles.map(bubble => (
          <div
            key={bubble.id}
            onClick={() => !bubble.popped && popBubble(bubble.id)}
            style={{
              position: 'absolute',
              left: `${bubble.x}%`,
              top: `${bubble.y}%`,
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              borderRadius: '50%',
              background: bubble.popped 
                ? 'transparent' 
                : `radial-gradient(circle at 30% 30%, ${bubble.color}40, ${bubble.color}90)`,
              border: bubble.popped ? 'none' : `2px solid ${bubble.color}`,
              transform: bubble.popped ? 'scale(1.5)' : 'scale(1)',
              opacity: bubble.popped ? 0 : 1,
              transition: 'all 0.3s ease-out',
              cursor: 'pointer',
              boxShadow: bubble.popped ? 'none' : `0 0 20px ${bubble.color}40`,
              animation: bubble.popped ? 'none' : 'float 3s ease-in-out infinite'
            }}
          />
        ))}
      </div>

      {/* Celebration overlay */}
      {showCelebration && (
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
          animation: 'pulse 0.5s ease-out',
          zIndex: 100
        }}>
          ✨ +0.5 spoons ✨
        </div>
      )}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse {
          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
          50% { transform: translate(-50%, -50%) scale(1.1); }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
