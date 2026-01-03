/**
 * SONIC SHIELD - The Audio Layer of the Geodesic Engine
 * 
 * "When the music hits you, you feel no pain." - Bob Marley
 * 
 * This is impedance matching for the nervous system.
 * Low frequencies ground. High frequencies alert. The right frequency HEALS.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import GOD_CONFIG from '../god.config';

// === FREQUENCY CONSTANTS (Hz) ===
const FREQUENCIES = {
  // Binaural beat targets (difference between L/R channels)
  delta: 2,      // Deep sleep, healing (0.5-4 Hz)
  theta: 6,      // Meditation, creativity (4-8 Hz)
  alpha: 10,     // Relaxed focus (8-12 Hz)
  beta: 18,      // Active thinking (12-30 Hz)
  gamma: 40,     // Peak awareness (30-100 Hz)
  
  // Base carrier frequency
  carrier: 200,  // Hz - comfortable mid-range
  
  // Solfeggio frequencies (ancient healing tones)
  solfeggio: {
    ut: 396,     // Liberating guilt and fear
    re: 417,     // Undoing situations, facilitating change
    mi: 528,     // Transformation, miracles (DNA repair frequency)
    fa: 639,     // Connecting, relationships
    sol: 741,    // Awakening intuition
    la: 852,     // Returning to spiritual order
  },
  
  // The "Whale Song" frequency - 915 MHz scaled to audible
  // 915 MHz / 2^20 ≈ 872 Hz (scaled down 20 octaves)
  whaleSong: 872,
} as const;

// === AMBIENT SOUNDSCAPE DEFINITIONS ===
interface Soundscape {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  // Oscillator config
  oscillators: Array<{
    type: OscillatorType;
    frequency: number;
    gain: number;
    detune?: number;
  }>;
  // Noise config
  noise?: {
    type: 'brown' | 'pink' | 'white';
    gain: number;
  };
  // Filter config
  filter?: {
    type: BiquadFilterType;
    frequency: number;
    Q?: number;
  };
}

const SOUNDSCAPES: Soundscape[] = [
  {
    id: 'deep-ocean',
    name: 'Deep Ocean',
    icon: '🌊',
    description: 'The pressure of the deep. Grounding. Safe.',
    color: '#1a3a5c',
    oscillators: [
      { type: 'sine', frequency: 60, gain: 0.15 },
      { type: 'sine', frequency: 90, gain: 0.1 },
    ],
    noise: { type: 'brown', gain: 0.4 },
    filter: { type: 'lowpass', frequency: 400, Q: 1 },
  },
  {
    id: 'rain-on-metal',
    name: 'Rain on Metal Roof',
    icon: '🌧️',
    description: 'The stim of randomness. Pattern in chaos.',
    color: '#4a5568',
    oscillators: [],
    noise: { type: 'pink', gain: 0.5 },
    filter: { type: 'bandpass', frequency: 2000, Q: 0.5 },
  },
  {
    id: 'womb-tone',
    name: 'Womb Tone',
    icon: '🫀',
    description: '60 Hz hum. The first sound you ever heard.',
    color: '#742a2a',
    oscillators: [
      { type: 'sine', frequency: 60, gain: 0.3 },
      { type: 'sine', frequency: 120, gain: 0.15 },
      { type: 'sine', frequency: 180, gain: 0.05 },
    ],
    noise: { type: 'brown', gain: 0.2 },
    filter: { type: 'lowpass', frequency: 200 },
  },
  {
    id: 'whale-song',
    name: 'Whale Song',
    icon: '🐋',
    description: '915 MHz scaled to audible. The mesh frequency.',
    color: '#1e3a5f',
    oscillators: [
      { type: 'sine', frequency: FREQUENCIES.whaleSong, gain: 0.15 },
      { type: 'sine', frequency: FREQUENCIES.whaleSong * 0.5, gain: 0.2 },
      { type: 'triangle', frequency: FREQUENCIES.whaleSong * 0.25, gain: 0.1 },
    ],
    noise: { type: 'brown', gain: 0.15 },
    filter: { type: 'lowpass', frequency: 1000 },
  },
  {
    id: 'crystalline',
    name: 'Crystalline',
    icon: '💎',
    description: '528 Hz - The miracle tone. DNA resonance.',
    color: '#5b21b6',
    oscillators: [
      { type: 'sine', frequency: FREQUENCIES.solfeggio.mi, gain: 0.2 },
      { type: 'sine', frequency: FREQUENCIES.solfeggio.mi * 2, gain: 0.1 },
      { type: 'triangle', frequency: FREQUENCIES.solfeggio.mi * 0.5, gain: 0.15 },
    ],
    filter: { type: 'highpass', frequency: 200 },
  },
  {
    id: 'forest-floor',
    name: 'Forest Floor',
    icon: '🌲',
    description: 'Layered frequencies. Biodiversity of sound.',
    color: '#1e3a2f',
    oscillators: [
      { type: 'sine', frequency: 174, gain: 0.1 },  // Earth frequency
      { type: 'triangle', frequency: 285, gain: 0.08 },
    ],
    noise: { type: 'pink', gain: 0.3 },
    filter: { type: 'lowpass', frequency: 800 },
  },
];

// === BINAURAL BEAT PRESETS ===
interface BinauralPreset {
  id: string;
  name: string;
  icon: string;
  description: string;
  targetFreq: number;
  color: string;
  spoonCost: number;  // Negative = restores spoons
}

const BINAURAL_PRESETS: BinauralPreset[] = [
  {
    id: 'deep-rest',
    name: 'Deep Rest',
    icon: '😴',
    description: 'Delta waves (2 Hz). Healing sleep.',
    targetFreq: FREQUENCIES.delta,
    color: '#1a1a2e',
    spoonCost: -2,  // Restores 2 spoons
  },
  {
    id: 'meditation',
    name: 'Meditation',
    icon: '🧘',
    description: 'Theta waves (6 Hz). The space between thoughts.',
    targetFreq: FREQUENCIES.theta,
    color: '#16213e',
    spoonCost: -1.5,
  },
  {
    id: 'flow-state',
    name: 'Flow State',
    icon: '🌊',
    description: 'Alpha waves (10 Hz). Relaxed focus.',
    targetFreq: FREQUENCIES.alpha,
    color: '#0f3460',
    spoonCost: -1,
  },
  {
    id: 'active-mind',
    name: 'Active Mind',
    icon: '⚡',
    description: 'Beta waves (18 Hz). Engaged thinking.',
    targetFreq: FREQUENCIES.beta,
    color: '#e94560',
    spoonCost: 0.5,  // Costs spoons (stimulating)
  },
  {
    id: 'peak-awareness',
    name: 'Peak Awareness',
    icon: '✨',
    description: 'Gamma waves (40 Hz). Maximum coherence.',
    targetFreq: FREQUENCIES.gamma,
    color: '#ff6b6b',
    spoonCost: 1,
  },
];

// === NOISE GENERATOR ===
function createNoiseBuffer(
  audioContext: AudioContext,
  type: 'white' | 'pink' | 'brown'
): AudioBuffer {
  const bufferSize = audioContext.sampleRate * 2; // 2 seconds
  const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const data = buffer.getChannelData(0);

  let lastOut = 0;
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;

    switch (type) {
      case 'white':
        data[i] = white;
        break;
      case 'pink':
        // Pink noise algorithm (Paul Kellet's refined method)
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
        break;
      case 'brown':
        // Brown noise (integrated white noise)
        lastOut = (lastOut + (0.02 * white)) / 1.02;
        data[i] = lastOut * 3.5;
        break;
    }
  }

  return buffer;
}

// === MAIN COMPONENT ===
export default function SonicShield() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [activeMode, setActiveMode] = useState<'soundscape' | 'binaural'>('soundscape');
  const [selectedSoundscape, setSelectedSoundscape] = useState<string>('deep-ocean');
  const [selectedBinaural, setSelectedBinaural] = useState<string>('flow-state');
  const [sessionDuration, setSessionDuration] = useState(0);
  const [visualizerData, setVisualizerData] = useState<number[]>(new Array(32).fill(0));

  // Audio context and nodes
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();
  const sessionTimerRef = useRef<NodeJS.Timeout>();

  // Initialize audio context
  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
      masterGainRef.current = audioContextRef.current.createGain();
      masterGainRef.current.gain.value = volume;
      
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 64;
      
      masterGainRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
    }
    return audioContextRef.current;
  }, [volume]);

  // Clean up audio nodes
  const stopAllAudio = useCallback(() => {
    oscillatorsRef.current.forEach(osc => {
      try { osc.stop(); } catch {}
    });
    oscillatorsRef.current = [];

    if (noiseSourceRef.current) {
      try { noiseSourceRef.current.stop(); } catch {}
      noiseSourceRef.current = null;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (sessionTimerRef.current) {
      clearInterval(sessionTimerRef.current);
    }
  }, []);

  // Play soundscape
  const playSoundscape = useCallback((soundscape: Soundscape) => {
    const ctx = initAudio();
    stopAllAudio();

    // Create oscillators
    soundscape.oscillators.forEach(oscConfig => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = oscConfig.type;
      osc.frequency.value = oscConfig.frequency;
      if (oscConfig.detune) osc.detune.value = oscConfig.detune;
      
      gain.gain.value = oscConfig.gain;
      
      osc.connect(gain);
      
      // Apply filter if configured
      if (soundscape.filter) {
        const filter = ctx.createBiquadFilter();
        filter.type = soundscape.filter.type;
        filter.frequency.value = soundscape.filter.frequency;
        if (soundscape.filter.Q) filter.Q.value = soundscape.filter.Q;
        gain.connect(filter);
        filter.connect(masterGainRef.current!);
      } else {
        gain.connect(masterGainRef.current!);
      }
      
      osc.start();
      oscillatorsRef.current.push(osc);
    });

    // Create noise if configured
    if (soundscape.noise) {
      const noiseBuffer = createNoiseBuffer(ctx, soundscape.noise.type);
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;
      
      const noiseGain = ctx.createGain();
      noiseGain.gain.value = soundscape.noise.gain;
      
      noiseSource.connect(noiseGain);
      
      if (soundscape.filter) {
        const filter = ctx.createBiquadFilter();
        filter.type = soundscape.filter.type;
        filter.frequency.value = soundscape.filter.frequency;
        if (soundscape.filter.Q) filter.Q.value = soundscape.filter.Q;
        noiseGain.connect(filter);
        filter.connect(masterGainRef.current!);
      } else {
        noiseGain.connect(masterGainRef.current!);
      }
      
      noiseSource.start();
      noiseSourceRef.current = noiseSource;
    }
  }, [initAudio, stopAllAudio]);

  // Play binaural beat
  const playBinaural = useCallback((preset: BinauralPreset) => {
    const ctx = initAudio();
    stopAllAudio();

    const carrier = FREQUENCIES.carrier;
    const beatFreq = preset.targetFreq;

    // Left channel: carrier frequency
    const leftOsc = ctx.createOscillator();
    const leftGain = ctx.createGain();
    const leftPanner = ctx.createStereoPanner();
    
    leftOsc.type = 'sine';
    leftOsc.frequency.value = carrier;
    leftGain.gain.value = 0.3;
    leftPanner.pan.value = -1;
    
    leftOsc.connect(leftGain);
    leftGain.connect(leftPanner);
    leftPanner.connect(masterGainRef.current!);
    leftOsc.start();
    oscillatorsRef.current.push(leftOsc);

    // Right channel: carrier + beat frequency
    const rightOsc = ctx.createOscillator();
    const rightGain = ctx.createGain();
    const rightPanner = ctx.createStereoPanner();
    
    rightOsc.type = 'sine';
    rightOsc.frequency.value = carrier + beatFreq;
    rightGain.gain.value = 0.3;
    rightPanner.pan.value = 1;
    
    rightOsc.connect(rightGain);
    rightGain.connect(rightPanner);
    rightPanner.connect(masterGainRef.current!);
    rightOsc.start();
    oscillatorsRef.current.push(rightOsc);

    // Add subtle background pad
    const padOsc = ctx.createOscillator();
    const padGain = ctx.createGain();
    padOsc.type = 'triangle';
    padOsc.frequency.value = carrier / 2;
    padGain.gain.value = 0.1;
    padOsc.connect(padGain);
    padGain.connect(masterGainRef.current!);
    padOsc.start();
    oscillatorsRef.current.push(padOsc);
  }, [initAudio, stopAllAudio]);

  // Visualizer update
  const updateVisualizer = useCallback(() => {
    if (analyserRef.current && isPlaying) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      setVisualizerData(Array.from(dataArray));
      animationFrameRef.current = requestAnimationFrame(updateVisualizer);
    }
  }, [isPlaying]);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      stopAllAudio();
      setIsPlaying(false);
      setSessionDuration(0);
    } else {
      if (activeMode === 'soundscape') {
        const soundscape = SOUNDSCAPES.find(s => s.id === selectedSoundscape);
        if (soundscape) playSoundscape(soundscape);
      } else {
        const preset = BINAURAL_PRESETS.find(p => p.id === selectedBinaural);
        if (preset) playBinaural(preset);
      }
      setIsPlaying(true);
      
      // Start session timer
      sessionTimerRef.current = setInterval(() => {
        setSessionDuration(prev => prev + 1);
      }, 1000);
    }
  }, [isPlaying, activeMode, selectedSoundscape, selectedBinaural, playSoundscape, playBinaural, stopAllAudio]);

  // Update volume
  useEffect(() => {
    if (masterGainRef.current) {
      masterGainRef.current.gain.value = volume;
    }
  }, [volume]);

  // Start visualizer when playing
  useEffect(() => {
    if (isPlaying) {
      updateVisualizer();
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, updateVisualizer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllAudio();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [stopAllAudio]);

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentSoundscape = SOUNDSCAPES.find(s => s.id === selectedSoundscape);
  const currentBinaural = BINAURAL_PRESETS.find(p => p.id === selectedBinaural);
  const currentColor = activeMode === 'soundscape' 
    ? currentSoundscape?.color 
    : currentBinaural?.color;

  return (
    <div style={{
      padding: '2rem',
      background: `linear-gradient(135deg, ${currentColor || GOD_CONFIG.theme.bg.tertiary}20 0%, ${GOD_CONFIG.theme.bg.primary} 100%)`,
      borderRadius: '1rem',
      color: GOD_CONFIG.theme.text.primary,
      fontFamily: GOD_CONFIG.typography.fontFamily.body,
      minHeight: '100%',
      transition: 'background 1s ease',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ 
          fontSize: '2rem', 
          marginBottom: '0.5rem',
          fontFamily: GOD_CONFIG.typography.fontFamily.display,
          color: GOD_CONFIG.theme.text.primary,
        }}>
          🎵 Sonic Shield
        </h2>
        <p style={{ color: GOD_CONFIG.theme.text.secondary, fontStyle: 'italic' }}>
          "When the music hits you, you feel no pain."
        </p>
      </div>

      {/* Visualizer */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        height: '100px',
        gap: '2px',
        marginBottom: '2rem',
        padding: '1rem',
        background: GOD_CONFIG.theme.bg.secondary,
        border: `1px solid ${GOD_CONFIG.theme.border.default}`,
        borderRadius: '0.5rem',
      }}>
        {visualizerData.map((value, i) => (
          <div
            key={i}
            style={{
              width: '8px',
              height: `${Math.max(2, (value / 255) * 100)}%`,
              background: `linear-gradient(to top, ${currentColor || '#4a9eff'}, #ffffff)`,
              borderRadius: '2px',
              transition: 'height 0.05s ease',
              opacity: isPlaying ? 1 : 0.2,
            }}
          />
        ))}
      </div>

      {/* Mode Selector */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <button
          onClick={() => setActiveMode('soundscape')}
          style={{
            padding: '0.75rem 1.5rem',
            background: activeMode === 'soundscape' ? GOD_CONFIG.theme.bg.accent : GOD_CONFIG.theme.bg.secondary,
            border: activeMode === 'soundscape' ? `1px solid ${GOD_CONFIG.theme.border.accent}` : `1px solid ${GOD_CONFIG.theme.border.default}`,
            borderRadius: '2rem',
            color: GOD_CONFIG.theme.text.primary,
            cursor: 'pointer',
            fontWeight: activeMode === 'soundscape' ? 'bold' : 'normal',
            fontFamily: GOD_CONFIG.typography.fontFamily.body,
            transition: 'all 0.3s ease',
          }}
        >
          🌊 Soundscapes
        </button>
        <button
          onClick={() => setActiveMode('binaural')}
          style={{
            padding: '0.75rem 1.5rem',
            background: activeMode === 'binaural' ? GOD_CONFIG.theme.bg.accent : GOD_CONFIG.theme.bg.secondary,
            border: activeMode === 'binaural' ? `1px solid ${GOD_CONFIG.theme.border.accent}` : `1px solid ${GOD_CONFIG.theme.border.default}`,
            borderRadius: '2rem',
            color: GOD_CONFIG.theme.text.primary,
            cursor: 'pointer',
            fontWeight: activeMode === 'binaural' ? 'bold' : 'normal',
            fontFamily: GOD_CONFIG.typography.fontFamily.body,
            transition: 'all 0.3s ease',
          }}
        >
          🧠 Binaural Beats
        </button>
      </div>

      {/* Soundscape Selector */}
      {activeMode === 'soundscape' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}>
          {SOUNDSCAPES.map(soundscape => (
            <button
              key={soundscape.id}
              onClick={() => {
                setSelectedSoundscape(soundscape.id);
                if (isPlaying) {
                  playSoundscape(soundscape);
                }
              }}
              style={{
                padding: '1rem',
                background: selectedSoundscape === soundscape.id 
                  ? soundscape.color 
                  : GOD_CONFIG.theme.bg.secondary,
                border: selectedSoundscape === soundscape.id 
                  ? `2px solid ${GOD_CONFIG.theme.border.accent}` 
                  : `1px solid ${GOD_CONFIG.theme.border.default}`,
                borderRadius: '0.75rem',
                color: GOD_CONFIG.theme.text.primary,
                cursor: 'pointer',
                textAlign: 'center',
                fontFamily: GOD_CONFIG.typography.fontFamily.body,
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                {soundscape.icon}
              </div>
              <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                {soundscape.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: GOD_CONFIG.theme.text.muted }}>
                {soundscape.description}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Binaural Selector */}
      {activeMode === 'binaural' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}>
          {BINAURAL_PRESETS.map(preset => (
            <button
              key={preset.id}
              onClick={() => {
                setSelectedBinaural(preset.id);
                if (isPlaying) {
                  playBinaural(preset);
                }
              }}
              style={{
                padding: '1rem',
                background: selectedBinaural === preset.id 
                  ? preset.color 
                  : GOD_CONFIG.theme.bg.secondary,
                border: selectedBinaural === preset.id 
                  ? `2px solid ${GOD_CONFIG.theme.border.accent}` 
                  : `1px solid ${GOD_CONFIG.theme.border.default}`,
                borderRadius: '0.75rem',
                color: GOD_CONFIG.theme.text.primary,
                cursor: 'pointer',
                textAlign: 'center',
                fontFamily: GOD_CONFIG.typography.fontFamily.body,
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                {preset.icon}
              </div>
              <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                {preset.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: GOD_CONFIG.theme.text.muted }}>
                {preset.description}
              </div>
              <div style={{ 
                fontSize: '0.7rem', 
                marginTop: '0.5rem',
                color: preset.spoonCost < 0 ? '#4ade80' : '#fbbf24',
              }}>
                {preset.spoonCost < 0 ? `+${Math.abs(preset.spoonCost)} 🥄` : `${preset.spoonCost} 🥄`}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Headphones Warning for Binaural */}
      {activeMode === 'binaural' && (
        <div style={{
          background: '#fbbf2415',
          border: '1px solid #fbbf2440',
          borderRadius: '0.5rem',
          padding: '0.75rem',
          marginBottom: '1.5rem',
          textAlign: 'center',
          fontSize: '0.9rem',
          color: GOD_CONFIG.theme.text.secondary,
        }}>
          🎧 <strong style={{ color: GOD_CONFIG.theme.text.primary }}>Headphones required</strong> for binaural beats to work. 
          The effect comes from the difference between left and right channels.
        </div>
      )}

      {/* Play Controls */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
      }}>
        {/* Big Play Button */}
        <button
          onClick={togglePlay}
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: isPlaying 
              ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
              : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            border: 'none',
            color: '#fff',
            fontSize: '2.5rem',
            cursor: 'pointer',
            boxShadow: isPlaying 
              ? '0 0 30px rgba(239,68,68,0.5)'
              : '0 0 30px rgba(34,197,94,0.5)',
            transition: 'all 0.3s ease',
          }}
        >
          {isPlaying ? '⏹' : '▶'}
        </button>

        {/* Session Timer */}
        {isPlaying && (
          <div style={{
            fontSize: '1.5rem',
            fontFamily: 'monospace',
            color: '#4ade80',
          }}>
            {formatDuration(sessionDuration)}
          </div>
        )}

        {/* Volume Control */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          width: '100%',
          maxWidth: '300px',
        }}>
          <span style={{ fontSize: '1.2rem' }}>🔈</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            style={{
              flex: 1,
              accentColor: currentColor || '#4a9eff',
            }}
          />
          <span style={{ fontSize: '1.2rem' }}>🔊</span>
        </div>

        {/* Volume percentage */}
        <div style={{ 
          fontSize: '0.9rem', 
          opacity: 0.6,
          fontFamily: 'monospace',
        }}>
          {Math.round(volume * 100)}%
        </div>
      </div>

      {/* Current Selection Info */}
      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        background: GOD_CONFIG.theme.bg.secondary,
        border: `1px solid ${GOD_CONFIG.theme.border.default}`,
        borderRadius: '0.5rem',
        textAlign: 'center',
      }}>
        <div style={{ color: GOD_CONFIG.theme.text.muted, marginBottom: '0.5rem' }}>
          Now {isPlaying ? 'Playing' : 'Selected'}:
        </div>
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: GOD_CONFIG.theme.text.primary }}>
          {activeMode === 'soundscape' 
            ? `${currentSoundscape?.icon} ${currentSoundscape?.name}`
            : `${currentBinaural?.icon} ${currentBinaural?.name}`
          }
        </div>
        <div style={{ fontSize: '0.9rem', color: GOD_CONFIG.theme.text.secondary, marginTop: '0.25rem' }}>
          {activeMode === 'soundscape' 
            ? currentSoundscape?.description
            : currentBinaural?.description
          }
        </div>
      </div>

      {/* Physics Note */}
      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        background: `${GOD_CONFIG.theme.text.accent}10`,
        border: `1px solid ${GOD_CONFIG.theme.text.accent}30`,
        borderRadius: '0.5rem',
        fontSize: '0.85rem',
        color: GOD_CONFIG.theme.text.secondary,
      }}>
        <strong>🔬 The Physics:</strong>
        <br /><br />
        {activeMode === 'soundscape' ? (
          <>
            Soundscapes use <strong>frequency layering</strong> and <strong>colored noise</strong> to create 
            immersive audio environments. Brown noise emphasizes low frequencies (grounding), 
            pink noise has equal energy per octave (natural), and white noise is flat (masking).
          </>
        ) : (
          <>
            Binaural beats work through <strong>frequency following response</strong>. When two 
            slightly different tones are played in each ear, your brain perceives a third 
            "beat" at the difference frequency. A 200Hz left + 210Hz right = 10Hz alpha wave entrainment.
          </>
        )}
      </div>
    </div>
  );
}

