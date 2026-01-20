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

/**
 * ╔═══════════════════════════════════════════════════════════════════════════════╗
 * ║                            🕺 THE JITTERBUG 💃                                 ║
 * ║                 Rhythmic Grounding Through Playful Movement                    ║
 * ║                                                                                 ║
 * ║  "Sometimes you gotta shake it off to shake it out."                           ║
 * ╚═══════════════════════════════════════════════════════════════════════════════╝
 * 
 * SOMATIC SCIENCE:
 * - Rhythmic bilateral movement activates cerebellum (coordination)
 * - Fast/slow alternation triggers vagal tone regulation
 * - Randomized patterns prevent dissociation (stay present)
 * - φ-tempo (golden ratio timing) for natural entrainment
 * 
 * THERAPEUTIC MECHANISM:
 * - Bilateral stimulation (like EMDR) processes stuck emotions
 * - Whole-body engagement grounds in present moment
 * - Success/fail is impossible - just keep moving!
 */

import { useState, useEffect, useCallback, useRef } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const PHI = 1.618033988749895;
const BASE_BPM = 120; // Classic swing tempo

// Movement types with emoji representation
const MOVES = [
  { emoji: '👆', name: 'REACH UP', color: '#F59E0B' },
  { emoji: '👇', name: 'TOUCH DOWN', color: '#10B981' },
  { emoji: '👈', name: 'LEFT', color: '#3B82F6' },
  { emoji: '👉', name: 'RIGHT', color: '#EC4899' },
  { emoji: '🔄', name: 'SPIN', color: '#8B5CF6' },
  { emoji: '⭐', name: 'JAZZ HANDS', color: '#F97316' },
  { emoji: '🦶', name: 'STOMP', color: '#EF4444' },
  { emoji: '👏', name: 'CLAP', color: '#06B6D4' },
];

// Intensity levels
const INTENSITIES = ['chill', 'groove', 'swing', 'jive'] as const;
type Intensity = typeof INTENSITIES[number];

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface JitterbugProps {
  onComplete?: (moves: number) => void;
  initialIntensity?: Intensity;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function Jitterbug({ onComplete, initialIntensity = 'groove' }: JitterbugProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [intensity, setIntensity] = useState<Intensity>(initialIntensity);
  const [currentMove, setCurrentMove] = useState(MOVES[0]);
  const [nextMove, setNextMove] = useState(MOVES[1]);
  const [moveCount, setMoveCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showPulse, setShowPulse] = useState(false);
  const [tempo, setTempo] = useState(BASE_BPM);
  const timerRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Calculate interval based on intensity
  const getInterval = useCallback(() => {
    const baseInterval = 60000 / tempo; // ms per beat
    const multipliers: Record<Intensity, number> = {
      chill: 2,
      groove: 1,
      swing: PHI / 2,
      jive: 0.5,
    };
    return baseInterval * multipliers[intensity];
  }, [tempo, intensity]);

  // Generate next random move
  const nextRandomMove = useCallback(() => {
    const available = MOVES.filter(m => m.emoji !== currentMove.emoji);
    return available[Math.floor(Math.random() * available.length)];
  }, [currentMove]);

  // Play a simple beat sound
  const playBeat = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    const ctx = audioContextRef.current;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    // Different sounds for different intensities
    const freqs: Record<Intensity, number> = {
      chill: 220,
      groove: 330,
      swing: 440,
      jive: 550,
    };
    
    osc.frequency.value = freqs[intensity];
    osc.type = 'triangle';
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }, [intensity]);

  // Advance to next move
  const advanceMove = useCallback(() => {
    setCurrentMove(nextMove);
    setNextMove(nextRandomMove());
    setMoveCount(prev => prev + 1);
    setStreak(prev => prev + 1);
    setShowPulse(true);
    setTimeout(() => setShowPulse(false), 200);
    
    try {
      playBeat();
    } catch {
      // Audio context blocked, that's fine
    }
  }, [nextMove, nextRandomMove, playBeat]);

  // Main game loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(advanceMove, getInterval());
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [isPlaying, advanceMove, getInterval]);

  // Start/Stop
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      setMoveCount(0);
      setStreak(0);
    } else {
      onComplete?.(moveCount);
    }
  };

  // Intensity change
  const cycleIntensity = () => {
    const idx = INTENSITIES.indexOf(intensity);
    const nextIdx = (idx + 1) % INTENSITIES.length;
    setIntensity(INTENSITIES[nextIdx]);
    
    // Adjust tempo with intensity
    const tempos: Record<Intensity, number> = {
      chill: 80,
      groove: 120,
      swing: Math.round(120 * PHI),
      jive: 180,
    };
    setTempo(tempos[INTENSITIES[nextIdx]]);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
      padding: '24px',
      background: 'linear-gradient(135deg, #1F2937 0%, #111827 100%)',
      borderRadius: '20px',
      border: '1px solid #374151',
      minHeight: '400px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background dancing lines */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: isPlaying ? 0.1 : 0.05,
        background: `repeating-linear-gradient(
          45deg,
          transparent,
          transparent 10px,
          ${currentMove.color}20 10px,
          ${currentMove.color}20 20px
        )`,
        animation: isPlaying ? 'dance 0.5s linear infinite' : 'none',
      }} />
      
      <style>{`
        @keyframes dance {
          from { transform: translateX(0); }
          to { transform: translateX(20px); }
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        zIndex: 1,
      }}>
        <span style={{ fontSize: '32px' }}>🕺</span>
        <h2 style={{
          color: '#F3F4F6',
          fontSize: '24px',
          fontWeight: 700,
          margin: 0,
          letterSpacing: '2px',
        }}>
          JITTERBUG
        </h2>
        <span style={{ fontSize: '32px' }}>💃</span>
      </div>

      {/* Intensity Selector */}
      <button
        onClick={cycleIntensity}
        style={{
          background: '#374151',
          border: '1px solid #4B5563',
          borderRadius: '12px',
          padding: '8px 16px',
          color: '#F3F4F6',
          cursor: 'pointer',
          fontSize: '14px',
          zIndex: 1,
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}
      >
        {intensity} {
          intensity === 'chill' ? '🐢' :
          intensity === 'groove' ? '🎵' :
          intensity === 'swing' ? '🎷' : '⚡'
        } | {tempo} BPM
      </button>

      {/* Current Move Display */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        marginTop: '20px',
        zIndex: 1,
      }}>
        <div style={{ color: '#9CA3AF', fontSize: '14px' }}>
          {isPlaying ? 'DO THIS:' : 'Ready?'}
        </div>
        
        <div style={{
          fontSize: isPlaying ? '120px' : '80px',
          lineHeight: 1,
          filter: `drop-shadow(0 0 30px ${currentMove.color})`,
          animation: showPulse ? 'pulse 0.2s ease-out' : (isPlaying ? 'bounce 0.5s ease-in-out infinite' : 'none'),
          transition: 'font-size 0.3s ease',
        }}>
          {currentMove.emoji}
        </div>
        
        <div style={{
          color: currentMove.color,
          fontSize: '24px',
          fontWeight: 700,
          letterSpacing: '2px',
        }}>
          {currentMove.name}
        </div>
      </div>

      {/* Next Up Preview */}
      {isPlaying && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          background: '#1F293780',
          borderRadius: '8px',
          zIndex: 1,
        }}>
          <span style={{ color: '#6B7280', fontSize: '12px' }}>NEXT:</span>
          <span style={{ fontSize: '24px' }}>{nextMove.emoji}</span>
        </div>
      )}

      {/* Stats */}
      <div style={{
        display: 'flex',
        gap: '24px',
        marginTop: 'auto',
        zIndex: 1,
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#F59E0B', fontSize: '32px', fontWeight: 700 }}>
            {moveCount}
          </div>
          <div style={{ color: '#9CA3AF', fontSize: '12px' }}>MOVES</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#10B981', fontSize: '32px', fontWeight: 700 }}>
            {streak}
          </div>
          <div style={{ color: '#9CA3AF', fontSize: '12px' }}>STREAK</div>
        </div>
      </div>

      {/* Play/Stop Button */}
      <button
        onClick={togglePlay}
        style={{
          background: isPlaying 
            ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
            : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          border: 'none',
          borderRadius: '50%',
          width: '80px',
          height: '80px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
          boxShadow: isPlaying 
            ? '0 0 40px #EF444480'
            : '0 0 40px #10B98180',
          transition: 'all 0.3s ease',
          zIndex: 1,
        }}
      >
        {isPlaying ? '⏹️' : '▶️'}
      </button>

      {/* Instructions */}
      <div style={{
        color: '#6B7280',
        fontSize: '12px',
        textAlign: 'center',
        maxWidth: '280px',
        zIndex: 1,
      }}>
        {isPlaying 
          ? "Just move! Follow the prompts or freestyle - there's no wrong way! 🎉"
          : "Rhythmic bilateral movement helps process emotions and ground in the present moment."
        }
      </div>

      {/* φ signature */}
      <div style={{
        position: 'absolute',
        bottom: '8px',
        right: '12px',
        color: '#4B556340',
        fontSize: '10px',
        fontFamily: 'monospace',
      }}>
        φ-rhythm: {(60 / tempo * 1000).toFixed(0)}ms
      </div>
    </div>
  );
}

export default Jitterbug;
