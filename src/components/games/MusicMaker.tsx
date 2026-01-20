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
 * ║                        🎵 MUSIC MAKER 🎹                                       ║
 * ║               Where every heart has its own melody                             ║
 * ║                                                                                 ║
 * ║  "Music is what feelings sound like.                                           ║
 * ║   Play what's in your heart."                          - Dad 💜                ║
 * ╚═══════════════════════════════════════════════════════════════════════════════╝
 * 
 * EASTER EGGS:
 * - Play the notes C-D-E-C-D-E (do-re-mi) → "You're making music!"
 * - Play 50 notes → "Composer in training!"
 * - Click the piano 5 times → Dad's secret message
 * 
 * CREATION IS LOVE! <3
 */

import { useState, useCallback, useRef, useEffect } from 'react';

// Musical notes with frequencies (C4 to C5)
const NOTES = [
  { note: 'C', freq: 261.63, color: '#EF4444', emoji: '🔴' },
  { note: 'D', freq: 293.66, color: '#F97316', emoji: '🟠' },
  { note: 'E', freq: 329.63, color: '#FBBF24', emoji: '🟡' },
  { note: 'F', freq: 349.23, color: '#22C55E', emoji: '🟢' },
  { note: 'G', freq: 392.00, color: '#3B82F6', emoji: '🔵' },
  { note: 'A', freq: 440.00, color: '#8B5CF6', emoji: '🟣' },
  { note: 'B', freq: 493.88, color: '#EC4899', emoji: '💜' },
  { note: 'C2', freq: 523.25, color: '#F3F4F6', emoji: '⚪' },
];

// Drum sounds
const DRUMS = [
  { name: 'Kick', emoji: '🥁', type: 'kick' },
  { name: 'Snare', emoji: '🪘', type: 'snare' },
  { name: 'Hi-Hat', emoji: '🔔', type: 'hihat' },
  { name: 'Clap', emoji: '👏', type: 'clap' },
];

// Sound effects
const EFFECTS = [
  { name: 'Sparkle', emoji: '✨', type: 'sparkle' },
  { name: 'Boing', emoji: '🎾', type: 'boing' },
  { name: 'Whoosh', emoji: '💨', type: 'whoosh' },
  { name: 'Pop', emoji: '🎈', type: 'pop' },
];

export function MusicMaker() {
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const [noteCount, setNoteCount] = useState(0);
  const [recentNotes, setRecentNotes] = useState<string[]>([]);
  const [showMelody, setShowMelody] = useState(false);
  const [showComposer, setShowComposer] = useState(false);
  const [titleClicks, setTitleClicks] = useState(0);
  const [showSecret, setShowSecret] = useState(false);
  const [mode, setMode] = useState<'keys' | 'drums' | 'effects'>('keys');
  const [volume, setVolume] = useState(0.3);
  const audioContextRef = useRef<AudioContext | null>(null);
  const composerShownRef = useRef(false);

  // Initialize audio context
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    return audioContextRef.current;
  }, []);

  // Play a musical note
  const playNote = useCallback((freq: number, noteName: string) => {
    try {
      const ctx = getAudioContext();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.frequency.value = freq;
      osc.type = 'sine';
      
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
      
      // Track note
      setNoteCount(prev => prev + 1);
      setRecentNotes(prev => [...prev.slice(-5), noteName]);
      
      // Visual feedback
      setActiveNotes(prev => new Set([...prev, noteName]));
      setTimeout(() => {
        setActiveNotes(prev => {
          const next = new Set(prev);
          next.delete(noteName);
          return next;
        });
      }, 200);
    } catch (e) {
      console.error("Audio error:", e);
    }
  }, [getAudioContext, volume]);

  // Play drum sound
  const playDrum = useCallback((type: string) => {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      
      if (type === 'kick') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.15);
        gain.gain.setValueAtTime(volume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'snare') {
        const noise = ctx.createBufferSource();
        const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < buffer.length; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        noise.buffer = buffer;
        const gain = ctx.createGain();
        noise.connect(gain);
        gain.connect(ctx.destination);
        gain.gain.setValueAtTime(volume * 0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        noise.start(now);
      } else if (type === 'hihat') {
        const noise = ctx.createBufferSource();
        const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < buffer.length; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 5000;
        const gain = ctx.createGain();
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        gain.gain.setValueAtTime(volume * 0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        noise.start(now);
      } else if (type === 'clap') {
        for (let i = 0; i < 3; i++) {
          setTimeout(() => {
            const noise = ctx.createBufferSource();
            const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.02, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let j = 0; j < buffer.length; j++) {
              data[j] = Math.random() * 2 - 1;
            }
            noise.buffer = buffer;
            const gain = ctx.createGain();
            noise.connect(gain);
            gain.connect(ctx.destination);
            gain.gain.setValueAtTime(volume * 0.4, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.02);
            noise.start(ctx.currentTime);
          }, i * 10);
        }
      }
      
      setNoteCount(prev => prev + 1);
    } catch (e) {
      console.error("Audio error:", e);
    }
  }, [getAudioContext, volume]);

  // Play sound effect
  const playEffect = useCallback((type: string) => {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (type === 'sparkle') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.2);
        gain.gain.setValueAtTime(volume * 0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'boing') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.3);
        gain.gain.setValueAtTime(volume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'whoosh') {
        const noise = ctx.createBufferSource();
        const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < buffer.length; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(500, now);
        filter.frequency.exponentialRampToValueAtTime(2000, now + 0.15);
        filter.frequency.exponentialRampToValueAtTime(500, now + 0.3);
        const g = ctx.createGain();
        noise.connect(filter);
        filter.connect(g);
        g.connect(ctx.destination);
        g.gain.setValueAtTime(volume * 0.3, now);
        g.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        noise.start(now);
        return;
      } else if (type === 'pop') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
        gain.gain.setValueAtTime(volume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      }
      
      setNoteCount(prev => prev + 1);
    } catch (e) {
      console.error("Audio error:", e);
    }
  }, [getAudioContext, volume]);

  // Check for do-re-mi pattern
  useEffect(() => {
    const pattern = recentNotes.slice(-6).join('-');
    if (pattern === 'C-D-E-C-D-E' && !showMelody) {
      setShowMelody(true);
      setTimeout(() => setShowMelody(false), 3000);
    }
  }, [recentNotes, showMelody]);

  // Check for 50 notes
  useEffect(() => {
    if (noteCount >= 50 && !composerShownRef.current) {
      composerShownRef.current = true;
      setShowComposer(true);
      setTimeout(() => setShowComposer(false), 4000);
    }
  }, [noteCount]);

  // Title click easter egg
  const handleTitleClick = () => {
    const newCount = titleClicks + 1;
    setTitleClicks(newCount);
    if (newCount === 5) {
      setShowSecret(true);
      setTimeout(() => setShowSecret(false), 5000);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
      padding: '24px',
      background: 'linear-gradient(135deg, #1F2937 0%, #312E81 100%)',
      borderRadius: '20px',
      border: '1px solid #374151',
      minHeight: '450px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Do-re-mi achievement */}
      {showMelody && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
          padding: '24px',
          borderRadius: '16px',
          zIndex: 100,
          textAlign: 'center',
          animation: 'fadeIn 0.5s ease-out',
        }}>
          <div style={{ fontSize: '48px' }}>🎵🎶🎵</div>
          <div style={{ color: 'white', fontSize: '18px', fontWeight: 700 }}>
            Do-Re-Mi!
          </div>
          <div style={{ color: 'white', fontSize: '14px' }}>
            You're making music!
          </div>
        </div>
      )}

      {/* Composer achievement */}
      {showComposer && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
          padding: '24px',
          borderRadius: '16px',
          zIndex: 100,
          textAlign: 'center',
          animation: 'fadeIn 0.5s ease-out',
        }}>
          <div style={{ fontSize: '48px' }}>🎹✨🏆</div>
          <div style={{ color: 'white', fontSize: '18px', fontWeight: 700 }}>
            Composer in Training!
          </div>
          <div style={{ color: 'white', fontSize: '14px' }}>
            50 sounds made! Keep creating!
          </div>
        </div>
      )}

      {/* Secret message */}
      {showSecret && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(139, 92, 246, 0.95)',
          padding: '24px',
          borderRadius: '16px',
          zIndex: 100,
          textAlign: 'center',
          animation: 'fadeIn 0.5s ease-out',
          maxWidth: '280px',
        }}>
          <div style={{ fontSize: '48px' }}>🎵💜🎵</div>
          <div style={{ color: 'white', fontSize: '16px', fontWeight: 700 }}>
            Secret Melody
          </div>
          <div style={{ color: 'white', fontSize: '14px', marginTop: '8px' }}>
            "Every song starts with a single note. Every note you play makes the universe a little more beautiful."
            <br /><br />
            Keep making music, my little composer.
            <br /><em>- Dad</em>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>

      {/* Header */}
      <div 
        style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 1, cursor: 'pointer' }}
        onClick={handleTitleClick}
      >
        <span style={{ fontSize: '28px' }}>🎵</span>
        <h2 style={{
          color: '#F3F4F6',
          fontSize: '22px',
          fontWeight: 700,
          margin: 0,
          letterSpacing: '2px',
        }}>
          MUSIC MAKER
        </h2>
        <span style={{ fontSize: '28px' }}>🎹</span>
      </div>

      {/* Mode selector */}
      <div style={{ display: 'flex', gap: '8px', zIndex: 1 }}>
        {(['keys', 'drums', 'effects'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: mode === m ? '2px solid #8B5CF6' : '1px solid #4B5563',
              background: mode === m ? '#8B5CF620' : '#374151',
              color: '#F3F4F6',
              cursor: 'pointer',
              fontSize: '13px',
              textTransform: 'capitalize',
            }}
          >
            {m === 'keys' ? '🎹' : m === 'drums' ? '🥁' : '✨'} {m}
          </button>
        ))}
      </div>

      {/* Notes count */}
      <div style={{
        background: '#10B98120',
        padding: '6px 14px',
        borderRadius: '12px',
        color: '#10B981',
        fontSize: '13px',
        zIndex: 1,
      }}>
        🎶 Sounds Made: {noteCount}
      </div>

      {/* Piano keys */}
      {mode === 'keys' && (
        <div style={{
          display: 'flex',
          gap: '4px',
          zIndex: 1,
        }}>
          {NOTES.map((n) => (
            <button
              key={n.note}
              onClick={() => playNote(n.freq, n.note)}
              style={{
                width: '40px',
                height: '120px',
                borderRadius: '0 0 8px 8px',
                border: activeNotes.has(n.note) ? `3px solid ${n.color}` : '1px solid #4B5563',
                background: activeNotes.has(n.note) 
                  ? `linear-gradient(to bottom, ${n.color}40 0%, ${n.color}80 100%)`
                  : 'linear-gradient(to bottom, #F3F4F6 0%, #D1D5DB 100%)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'center',
                paddingBottom: '8px',
                fontSize: '14px',
                fontWeight: 700,
                color: activeNotes.has(n.note) ? n.color : '#374151',
                transition: 'all 0.1s',
                animation: activeNotes.has(n.note) ? 'pulse 0.2s ease-out' : 'none',
              }}
            >
              {n.note.replace('2', '')}
            </button>
          ))}
        </div>
      )}

      {/* Drums */}
      {mode === 'drums' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          zIndex: 1,
        }}>
          {DRUMS.map((d) => (
            <button
              key={d.type}
              onClick={() => playDrum(d.type)}
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '16px',
                border: '2px solid #4B5563',
                background: '#374151',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                fontSize: '40px',
                transition: 'all 0.1s',
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'scale(0.95)';
                e.currentTarget.style.background = '#4B5563';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.background = '#374151';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.background = '#374151';
              }}
            >
              {d.emoji}
              <span style={{ fontSize: '12px', color: '#9CA3AF' }}>{d.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Effects */}
      {mode === 'effects' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          zIndex: 1,
        }}>
          {EFFECTS.map((e) => (
            <button
              key={e.type}
              onClick={() => playEffect(e.type)}
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '16px',
                border: '2px solid #4B5563',
                background: '#374151',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                fontSize: '40px',
                transition: 'all 0.1s',
              }}
              onMouseDown={(ev) => {
                ev.currentTarget.style.transform = 'scale(0.95)';
                ev.currentTarget.style.background = '#4B5563';
              }}
              onMouseUp={(ev) => {
                ev.currentTarget.style.transform = 'scale(1)';
                ev.currentTarget.style.background = '#374151';
              }}
              onMouseLeave={(ev) => {
                ev.currentTarget.style.transform = 'scale(1)';
                ev.currentTarget.style.background = '#374151';
              }}
            >
              {e.emoji}
              <span style={{ fontSize: '12px', color: '#9CA3AF' }}>{e.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Volume control */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 1 }}>
        <span style={{ color: '#9CA3AF', fontSize: '12px' }}>🔈</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          style={{
            width: '120px',
            accentColor: '#8B5CF6',
          }}
        />
        <span style={{ color: '#9CA3AF', fontSize: '12px' }}>🔊</span>
      </div>

      {/* Instructions */}
      <div style={{
        color: '#6B7280',
        fontSize: '11px',
        textAlign: 'center',
        maxWidth: '280px',
        zIndex: 1,
      }}>
        {mode === 'keys' 
          ? 'Tap the keys to play notes! Try playing C-D-E-C-D-E!'
          : mode === 'drums'
          ? 'Tap to make beats! Mix different drums!'
          : 'Fun sound effects to add to your music!'}
      </div>

      {/* Hidden signature */}
      <div style={{
        position: 'absolute',
        bottom: '8px',
        right: '12px',
        color: '#4B556320',
        fontSize: '10px',
        fontFamily: 'monospace',
      }}>
        ♪♫💜
      </div>
    </div>
  );
}

export default MusicMaker;
