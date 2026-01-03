/**
 * THE BREATH ENGINE
 * Sacred Geometry Breathing Pacer with Coherence Tracking
 * 
 * "The breath is the bridge between the voluntary and involuntary
 *  nervous system. Master the breath, master the state."
 * 
 * This implements the Triadic Kernel through respiratory rhythm:
 * - INHALE (Driver): Perturbation, gathering energy
 * - HOLD (Clock): Stillness, the reference frequency  
 * - EXHALE (Tension): Release, resolution, grounding
 * 
 * The 4-7-8 pattern maps to the Tetrahedron:
 * - 4 nodes (4 count inhale)
 * - 7 edges mapped to awareness (7 count hold)
 * - 8 faces of dual tetrahedra (8 count exhale)
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import GOD_CONFIG from '../god.config';

// === BREATHING PATTERNS ===
interface BreathPattern {
  id: string;
  name: string;
  description: string;
  inhale: number;
  hold: number;
  exhale: number;
  holdAfter?: number;
  color: string;
  spoonRestoration: number;
}

const PATTERNS: BreathPattern[] = [
  {
    id: 'resonance',
    name: 'Resonance (4-7-8)',
    description: 'The classic. Activates parasympathetic response. Maps to Tetrahedron.',
    inhale: 4,
    hold: 7,
    exhale: 8,
    color: '#6366f1',
    spoonRestoration: 2,
  },
  {
    id: 'box',
    name: 'Box Breathing (4-4-4-4)',
    description: 'Navy SEAL technique. Equal phases. Stability under pressure.',
    inhale: 4,
    hold: 4,
    exhale: 4,
    holdAfter: 4,
    color: '#0ea5e9',
    spoonRestoration: 1.5,
  },
  {
    id: 'coherence',
    name: 'Cardiac Coherence (5-5)',
    description: '6 breaths per minute. Synchronizes heart rate variability.',
    inhale: 5,
    hold: 0,
    exhale: 5,
    color: '#22c55e',
    spoonRestoration: 1,
  },
  {
    id: 'calming',
    name: 'Deep Calm (4-7-11)',
    description: 'Extended exhale. Maximum vagal tone activation.',
    inhale: 4,
    hold: 7,
    exhale: 11,
    color: '#8b5cf6',
    spoonRestoration: 2.5,
  },
  {
    id: 'energize',
    name: 'Energize (4-4-6)',
    description: 'Slightly shorter. Good for morning or low energy.',
    inhale: 4,
    hold: 4,
    exhale: 6,
    color: '#f59e0b',
    spoonRestoration: 0.5,
  },
  {
    id: 'phi',
    name: 'Golden Ratio (5-8-13)',
    description: 'Fibonacci sequence. Nature\'s rhythm. Deep entrainment.',
    inhale: 5,
    hold: 8,
    exhale: 13,
    color: '#ec4899',
    spoonRestoration: 3,
  },
];

// === PHASE TYPES ===
type Phase = 'inhale' | 'hold' | 'exhale' | 'holdAfter' | 'ready';

const PHASE_LABELS: Record<Phase, string> = {
  ready: 'Ready',
  inhale: 'Inhale',
  hold: 'Hold',
  exhale: 'Exhale',
  holdAfter: 'Hold',
};

const PHASE_INSTRUCTIONS: Record<Phase, string> = {
  ready: 'Press Start when ready',
  inhale: 'Breathe in through your nose',
  hold: 'Hold gently, no strain',
  exhale: 'Release slowly through your mouth',
  holdAfter: 'Rest in the stillness',
};

// === SACRED GEOMETRY COMPONENT ===
function SacredGeometry({ 
  phase, 
  progress, 
  color 
}: { 
  phase: Phase; 
  progress: number;
  color: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const PHI = GOD_CONFIG.physics?.triad?.PHI || 1.618033988749;
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Clear
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, width, height);
    
    // Calculate size based on phase
    let baseSize = 80;
    let targetSize = 80;
    
    switch (phase) {
      case 'inhale':
        targetSize = 140;
        break;
      case 'hold':
      case 'holdAfter':
        targetSize = phase === 'hold' ? 140 : 80;
        break;
      case 'exhale':
        targetSize = 80;
        break;
      case 'ready':
        targetSize = 100;
        break;
    }
    
    // Interpolate size
    if (phase === 'inhale') {
      baseSize = 80 + (140 - 80) * progress;
    } else if (phase === 'exhale') {
      baseSize = 140 - (140 - 80) * progress;
    } else if (phase === 'hold') {
      baseSize = 140;
    } else if (phase === 'holdAfter') {
      baseSize = 80;
    } else {
      baseSize = 100 + Math.sin(Date.now() / 1000) * 10;
    }
    
    // Draw outer glow
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, baseSize * 1.5);
    gradient.addColorStop(0, `${color}40`);
    gradient.addColorStop(0.5, `${color}20`);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, baseSize * 1.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw the Flower of Life pattern (simplified)
    ctx.strokeStyle = `${color}60`;
    ctx.lineWidth = 1;
    
    const petalCount = 6;
    const petalRadius = baseSize * 0.4;
    
    for (let i = 0; i < petalCount; i++) {
      const angle = (i / petalCount) * Math.PI * 2;
      const px = centerX + Math.cos(angle) * petalRadius;
      const py = centerY + Math.sin(angle) * petalRadius;
      
      ctx.beginPath();
      ctx.arc(px, py, petalRadius, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // Central circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, petalRadius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Draw the main breathing circle
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, centerY, baseSize, 0, Math.PI * 2);
    ctx.stroke();
    
    // Draw inner pulsing core
    const coreSize = baseSize * 0.3;
    const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, coreSize);
    coreGradient.addColorStop(0, color);
    coreGradient.addColorStop(0.7, `${color}80`);
    coreGradient.addColorStop(1, 'transparent');
    ctx.fillStyle = coreGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, coreSize, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw progress arc
    if (phase !== 'ready') {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseSize + 15, -Math.PI / 2, -Math.PI / 2 + progress * Math.PI * 2);
      ctx.stroke();
    }
    
    // Draw tetrahedron vertices (4 points)
    const tetraRadius = baseSize * 0.6;
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 - Math.PI / 2;
      const tx = centerX + Math.cos(angle) * tetraRadius;
      const ty = centerY + Math.sin(angle) * tetraRadius;
      
      ctx.beginPath();
      ctx.arc(tx, ty, 4, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Connect tetrahedron vertices
    ctx.strokeStyle = `${color}80`;
    ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
      for (let j = i + 1; j < 4; j++) {
        const angle1 = (i / 4) * Math.PI * 2 - Math.PI / 2;
        const angle2 = (j / 4) * Math.PI * 2 - Math.PI / 2;
        const x1 = centerX + Math.cos(angle1) * tetraRadius;
        const y1 = centerY + Math.sin(angle1) * tetraRadius;
        const x2 = centerX + Math.cos(angle2) * tetraRadius;
        const y2 = centerY + Math.sin(angle2) * tetraRadius;
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    }
    
  }, [phase, progress, color, PHI]);
  
  return (
    <canvas 
      ref={canvasRef}
      width={350}
      height={350}
      style={{
        display: 'block',
        margin: '0 auto',
      }}
    />
  );
}

// === COHERENCE METER ===
function CoherenceMeter({ value }: { value: number }) {
  const MARK_1 = GOD_CONFIG.physics?.MARK_1_ATTRACTOR || 0.35;
  const deviation = Math.abs(value - MARK_1);
  const coherencePercent = Math.max(0, 100 - deviation * 200);
  
  return (
    <div style={{
      background: 'rgba(0,0,0,0.3)',
      borderRadius: '0.5rem',
      padding: '1rem',
      marginTop: '1rem',
      maxWidth: '400px',
      margin: '1rem auto 0 auto',
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        marginBottom: '0.5rem',
        fontSize: '0.9rem',
      }}>
        <span>Coherence</span>
        <span style={{ 
          color: coherencePercent > 80 ? '#4ade80' : coherencePercent > 50 ? '#fbbf24' : '#ef4444',
          fontWeight: 'bold',
        }}>
          {coherencePercent.toFixed(0)}%
        </span>
      </div>
      <div style={{
        height: '8px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '4px',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${coherencePercent}%`,
          background: coherencePercent > 80 
            ? 'linear-gradient(90deg, #22c55e, #4ade80)' 
            : coherencePercent > 50 
              ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
              : 'linear-gradient(90deg, #dc2626, #ef4444)',
          borderRadius: '4px',
          transition: 'width 0.3s ease',
        }} />
      </div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        marginTop: '0.25rem',
        fontSize: '0.7rem',
        opacity: 0.6,
      }}>
        <span>Chaos</span>
        <span>Mark 1 (0.35)</span>
        <span>Order</span>
      </div>
    </div>
  );
}

// === MAIN COMPONENT ===
export default function BreathEngine() {
  const [selectedPattern, setSelectedPattern] = useState<BreathPattern>(PATTERNS[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<Phase>('ready');
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [coherence, setCoherence] = useState(0.2);
  const [audioEnabled, setAudioEnabled] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const CARRIER = GOD_CONFIG.physics?.CARRIER_FREQUENCY || 432;
  
  // Initialize audio
  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
      gainRef.current = audioContextRef.current.createGain();
      gainRef.current.gain.value = 0;
      gainRef.current.connect(audioContextRef.current.destination);
    }
  }, []);
  
  // Play tone for phase
  const playTone = useCallback((frequency: number, duration: number) => {
    if (!audioEnabled || !audioContextRef.current || !gainRef.current) return;
    
    const osc = audioContextRef.current.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = frequency;
    osc.connect(gainRef.current);
    
    const now = audioContextRef.current.currentTime;
    gainRef.current.gain.setValueAtTime(0, now);
    gainRef.current.gain.linearRampToValueAtTime(0.15, now + 0.1);
    gainRef.current.gain.linearRampToValueAtTime(0.1, now + duration - 0.1);
    gainRef.current.gain.linearRampToValueAtTime(0, now + duration);
    
    osc.start(now);
    osc.stop(now + duration);
  }, [audioEnabled]);
  
  // Run a single breath cycle
  const runCycle = useCallback(() => {
    const pattern = selectedPattern;
    const phases: { phase: Phase; duration: number }[] = [
      { phase: 'inhale', duration: pattern.inhale },
      { phase: 'hold', duration: pattern.hold },
      { phase: 'exhale', duration: pattern.exhale },
    ];
    
    if (pattern.holdAfter) {
      phases.push({ phase: 'holdAfter', duration: pattern.holdAfter });
    }
    
    let currentPhaseIndex = 0;
    let phaseStartTime = Date.now();
    
    const tick = () => {
      if (currentPhaseIndex >= phases.length) {
        // Cycle complete
        setCycleCount(c => c + 1);
        setCoherence(c => Math.min(0.35, c + 0.02)); // Approach Mark 1
        currentPhaseIndex = 0;
        phaseStartTime = Date.now();
      }
      
      const currentPhase = phases[currentPhaseIndex];
      const elapsed = (Date.now() - phaseStartTime) / 1000;
      const progress = Math.min(1, elapsed / currentPhase.duration);
      
      setPhase(currentPhase.phase);
      setPhaseProgress(progress);
      
      // Play tone at phase start
      if (progress < 0.05 && audioEnabled) {
        const freq = currentPhase.phase === 'inhale' ? CARRIER 
          : currentPhase.phase === 'exhale' ? CARRIER * 0.75 
          : CARRIER * 0.5;
        playTone(freq, 0.3);
      }
      
      if (progress >= 1) {
        currentPhaseIndex++;
        phaseStartTime = Date.now();
      }
      
      timerRef.current = setTimeout(tick, 50);
    };
    
    tick();
  }, [selectedPattern, audioEnabled, CARRIER, playTone]);
  
  // Start/stop
  const toggleRunning = useCallback(() => {
    if (isRunning) {
      // Stop
      if (timerRef.current) clearTimeout(timerRef.current);
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
      setIsRunning(false);
      setPhase('ready');
      setPhaseProgress(0);
    } else {
      // Start
      initAudio();
      setIsRunning(true);
      setCycleCount(0);
      setSessionDuration(0);
      setCoherence(0.2);
      
      sessionTimerRef.current = setInterval(() => {
        setSessionDuration(d => d + 1);
      }, 1000);
      
      runCycle();
    }
  }, [isRunning, initAudio, runCycle]);
  
  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);
  
  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate spoons restored
  const spoonsRestored = (cycleCount * selectedPattern.spoonRestoration).toFixed(1);
  
  return (
    <div style={{
      padding: '2rem',
      background: `linear-gradient(135deg, ${selectedPattern.color}20 0%, #0a0a1a 100%)`,
      borderRadius: '1rem',
      color: '#e0e0e0',
      minHeight: '100%',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ 
          fontSize: '2rem', 
          marginBottom: '0.5rem',
          fontFamily: GOD_CONFIG.fonts?.display || 'Georgia, serif',
        }}>
          🌬️ The Breath Engine
        </h2>
        <p style={{ opacity: 0.7, fontStyle: 'italic' }}>
          "Master the breath, master the state."
        </p>
      </div>

      {/* Pattern Selector */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0.75rem',
        marginBottom: '1.5rem',
        maxWidth: '600px',
        margin: '0 auto 1.5rem auto',
      }}>
        {PATTERNS.map(pattern => (
          <button
            key={pattern.id}
            onClick={() => !isRunning && setSelectedPattern(pattern)}
            disabled={isRunning}
            style={{
              padding: '1rem',
              background: selectedPattern.id === pattern.id 
                ? pattern.color 
                : 'rgba(255,255,255,0.05)',
              border: selectedPattern.id === pattern.id 
                ? '2px solid rgba(255,255,255,0.5)' 
                : '1px solid rgba(255,255,255,0.1)',
              borderRadius: '0.5rem',
              color: '#fff',
              cursor: isRunning ? 'not-allowed' : 'pointer',
              textAlign: 'center',
              opacity: isRunning && selectedPattern.id !== pattern.id ? 0.5 : 1,
              transition: 'all 0.2s ease',
              minHeight: '70px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div style={{ fontWeight: 'bold', fontSize: '0.85rem', lineHeight: 1.3 }}>{pattern.name}</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '0.25rem' }}>
              +{pattern.spoonRestoration} 🥄
            </div>
          </button>
        ))}
      </div>

      {/* Pattern Description */}
      <div style={{
        background: 'rgba(0,0,0,0.3)',
        padding: '1rem',
        borderRadius: '0.5rem',
        marginBottom: '1.5rem',
        textAlign: 'center',
        fontSize: '0.9rem',
        maxWidth: '500px',
        margin: '0 auto 1.5rem auto',
      }}>
        {selectedPattern.description}
      </div>

      {/* Sacred Geometry Visualization */}
      <SacredGeometry 
        phase={phase} 
        progress={phaseProgress}
        color={selectedPattern.color}
      />

      {/* Phase Display */}
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <div style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold',
          color: selectedPattern.color,
          marginBottom: '0.25rem',
        }}>
          {PHASE_LABELS[phase]}
        </div>
        <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>
          {PHASE_INSTRUCTIONS[phase]}
        </div>
      </div>

      {/* Controls */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '1rem',
        marginTop: '1.5rem',
      }}>
        <button
          onClick={toggleRunning}
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            border: 'none',
            background: isRunning 
              ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
              : `linear-gradient(135deg, ${selectedPattern.color} 0%, ${selectedPattern.color}cc 100%)`,
            color: '#fff',
            fontSize: '2rem',
            cursor: 'pointer',
            boxShadow: `0 0 30px ${isRunning ? 'rgba(239,68,68,0.5)' : selectedPattern.color}50`,
            transition: 'all 0.3s ease',
          }}
        >
          {isRunning ? '⏹' : '▶'}
        </button>
      </div>

      {/* Audio Toggle */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        gap: '0.5rem',
        marginTop: '1rem',
        fontSize: '0.9rem',
      }}>
        <span style={{ opacity: 0.7 }}>Audio Cues ({CARRIER} Hz)</span>
        <button
          onClick={() => { initAudio(); setAudioEnabled(!audioEnabled); }}
          style={{
            width: '50px',
            height: '26px',
            borderRadius: '13px',
            border: 'none',
            background: audioEnabled ? '#22c55e' : '#374151',
            position: 'relative',
            cursor: 'pointer',
          }}
        >
          <div style={{
            width: '22px',
            height: '22px',
            borderRadius: '50%',
            background: '#fff',
            position: 'absolute',
            top: '2px',
            left: audioEnabled ? '26px' : '2px',
            transition: 'left 0.2s ease',
          }} />
        </button>
      </div>

      {/* Stats */}
      {(isRunning || cycleCount > 0) && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          marginTop: '1.5rem',
          background: 'rgba(0,0,0,0.3)',
          padding: '1rem',
          borderRadius: '0.5rem',
          maxWidth: '400px',
          margin: '1.5rem auto 0 auto',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>Cycles</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{cycleCount}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>Duration</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{formatTime(sessionDuration)}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>Spoons</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4ade80' }}>+{spoonsRestored} 🥄</div>
          </div>
        </div>
      )}

      {/* Coherence Meter */}
      {(isRunning || cycleCount > 0) && (
        <CoherenceMeter value={coherence} />
      )}

      {/* Physics Note */}
      <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        background: 'rgba(100,100,255,0.1)',
        border: '1px solid rgba(100,100,255,0.2)',
        borderRadius: '0.5rem',
        fontSize: '0.85rem',
        maxWidth: '500px',
        margin: '1.5rem auto 0 auto',
      }}>
        <strong>🔬 The Physics:</strong>
        <br /><br />
        The <strong>Triadic Kernel</strong> maps to breath:
        <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
          <li><strong>Inhale (Driver)</strong>: Perturbation. Gathering energy. Sympathetic activation.</li>
          <li><strong>Hold (Clock)</strong>: Stillness. The reference frequency. CO₂ tolerance.</li>
          <li><strong>Exhale (Tension)</strong>: Release. Resolution. Parasympathetic dominance.</li>
        </ul>
        Extended exhales activate the <strong>Vagus Nerve</strong>, lowering heart rate and approaching 
        the <strong>Mark 1 Attractor</strong> (H ≈ 0.35)—the "sweet spot" between chaos and order.
      </div>
    </div>
  );
}

