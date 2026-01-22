/**
 * SOMATIC REGULATION TOOLKIT
 * The "Race Car Brain" Maintenance System
 * 
 * "The brain is a high-performance engine that requires specific
 *  sensory inputs to maintain homeostasis."
 * 
 * Features:
 * - Lime Drag Protocol (Trigeminal Shock)
 * - Sensory Stacking (Audio + Visual + Chewing)
 * - Airlock Protocol (Context Switching)
 * - Grounding Rose (Haptic Anchor)
 * - RAS Monitor (Arousal Level)
 * - Heavy Work Tracker
 * - Brown Noise Generator
 * - Sensory Void Detection
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Headphones,
  Eye,
  Cookie,
  DoorOpen,
  Flower2,
  Activity,
  Hammer,
  Volume2,
  VolumeX,
  AlertTriangle,
  Plus,
  Minus,
  RotateCcw,
  Brain,
} from 'lucide-react';
import GOD_CONFIG from '../god.config';
import { triggerHapticPulse, triggerVagusSignal } from '../lib/haptic-feedback';

// ============================================================================
// TYPES
// ============================================================================

interface SensoryStack {
  audio: 'off' | 'transparency' | 'anc' | 'brown_noise';
  visual: 'off' | 'sunglasses' | 'blue_light' | 'dim';
  chewing: 'off' | 'ark_xt' | 'ark_soft' | 'gum' | 'ice';
}

interface HeavyWorkEntry {
  id: string;
  activity: string;
  duration: number; // minutes
  timestamp: number;
  spoonRecovery: number;
}

interface AirlockState {
  currentContext: 'gaming' | 'social' | 'work' | 'rest' | 'creative';
  targetContext: 'gaming' | 'social' | 'work' | 'rest' | 'creative' | null;
  isTransitioning: boolean;
  pressureLevel: number; // 0-100
}

type RASLevel = 'hypo' | 'optimal' | 'hyper';

// ============================================================================
// COMPONENT
// ============================================================================

export function SomaticRegulation() {
  // === STATE ===
  const [activeTab, setActiveTab] = useState<'stack' | 'airlock' | 'ras' | 'work'>('stack');
  
  // Sensory Stack
  const [sensoryStack, setSensoryStack] = useState<SensoryStack>({
    audio: 'off',
    visual: 'off',
    chewing: 'off',
  });
  
  // Grounding Rose
  const [roseCount, setRoseCount] = useState(0);
  const [isRoseActive, setIsRoseActive] = useState(false);
  
  // RAS Monitor
  const [arousalScore, setArousalScore] = useState(50);

  // Derived RAS level from arousal score
  const rasLevel: RASLevel = arousalScore < 30 ? 'hypo' : arousalScore > 70 ? 'hyper' : 'optimal';

  // Derived sensory voids based on current state
  const sensoryVoids: string[] = React.useMemo(() => {
    const voids: string[] = [];

    // Check for sensory gaps
    if (sensoryStack.audio === 'off' && sensoryStack.chewing === 'off') {
      voids.push('Low proprioceptive input - consider Heavy Work or chewing');
    }

    if (rasLevel === 'hypo' && sensoryStack.audio !== 'brown_noise') {
      voids.push('Under-aroused state - consider Lime Drag or Brown Noise');
    }

    if (rasLevel === 'hyper' && sensoryStack.visual === 'off') {
      voids.push('Over-aroused state - consider visual dampening');
    }

    return voids;
  }, [sensoryStack, rasLevel]);

  const showVoidWarning = sensoryVoids.length > 0;

  // Airlock
  const [airlock, setAirlock] = useState<AirlockState>({
    currentContext: 'rest',
    targetContext: null,
    isTransitioning: false,
    pressureLevel: 0,
  });
  
  // Heavy Work
  const [heavyWorkLog, setHeavyWorkLog] = useState<HeavyWorkEntry[]>([]);
  const [currentActivity, setCurrentActivity] = useState('');
  const [activityDuration, setActivityDuration] = useState(15);
  
  // Brown Noise
  const [isBrownNoiseOn, setIsBrownNoiseOn] = useState(false);
  const [brownNoiseVolume, setBrownNoiseVolume] = useState(50);
  const audioContextRef = useRef<AudioContext | null>(null);
  const brownNoiseNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  
  // Sensory Void Detection

  // ============================================================================
  // LIME DRAG PROTOCOL
  // ============================================================================
  
  const triggerLimeDrag = useCallback(async () => {
    // Trigeminal Shock: Ice + Lime + Salt
    // Jolts the RAS into high-alert state
    
    // Haptic feedback pattern: Sharp, then sustained
    await triggerHapticPulse('strong');
    await new Promise(r => setTimeout(r, 100));
    await triggerHapticPulse('strong');
    await new Promise(r => setTimeout(r, 100));
    await triggerHapticPulse('medium');
    
    // Update RAS level
    setArousalScore(prev => Math.min(100, prev + 30));
    setRasLevel('optimal');
    
    // Visual feedback
    const element = document.getElementById('lime-drag-button');
    if (element) {
      element.style.transform = 'scale(1.2)';
      element.style.boxShadow = '0 0 30px #00ff00';
      setTimeout(() => {
        element.style.transform = 'scale(1)';
        element.style.boxShadow = 'none';
      }, 500);
    }
  }, []);

  // ============================================================================
  // GROUNDING ROSE
  // ============================================================================
  
  const pressRose = useCallback(async () => {
    setIsRoseActive(true);
    setRoseCount(prev => prev + 1);
    
    // Haptic pulse like counting rosary beads
    await triggerHapticPulse('light');
    
    // If count reaches 10, trigger vagus signal
    if ((roseCount + 1) % 10 === 0) {
      await triggerVagusSignal();
    }
    
    setTimeout(() => setIsRoseActive(false), 200);
  }, [roseCount]);

  // ============================================================================
  // BROWN NOISE GENERATOR
  // ============================================================================
  
  const toggleBrownNoise = useCallback(() => {
    if (isBrownNoiseOn) {
      // Stop
      if (brownNoiseNodeRef.current) {
        brownNoiseNodeRef.current.stop();
        brownNoiseNodeRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      setIsBrownNoiseOn(false);
    } else {
      // Start
      const audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      audioContextRef.current = audioContext;
      
      // Create brown noise (random walk)
      const bufferSize = 2 * audioContext.sampleRate;
      const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const data = buffer.getChannelData(0);
      
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5; // Amplify
      }
      
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      
      const gainNode = audioContext.createGain();
      gainNode.gain.value = brownNoiseVolume / 100;
      gainNodeRef.current = gainNode;
      
      source.connect(gainNode);
      gainNode.connect(audioContext.destination);
      source.start();
      
      brownNoiseNodeRef.current = source;
      setIsBrownNoiseOn(true);
    }
  }, [isBrownNoiseOn, brownNoiseVolume]);
  
  // Update volume
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = brownNoiseVolume / 100;
    }
  }, [brownNoiseVolume]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (brownNoiseNodeRef.current) {
        brownNoiseNodeRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // ============================================================================
  // AIRLOCK PROTOCOL
  // ============================================================================
  
  const initiateAirlock = useCallback(async (target: AirlockState['currentContext']) => {
    if (airlock.currentContext === target) return;
    
    setAirlock(prev => ({
      ...prev,
      targetContext: target,
      isTransitioning: true,
      pressureLevel: 0,
    }));
    
    // Pressure equalization animation
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(r => setTimeout(r, 200));
      setAirlock(prev => ({ ...prev, pressureLevel: i }));
      
      // Haptic feedback at intervals
      if (i % 25 === 0) {
        await triggerHapticPulse('light');
      }
    }
    
    // Complete transition
    await triggerVagusSignal();
    setAirlock({
      currentContext: target,
      targetContext: null,
      isTransitioning: false,
      pressureLevel: 100,
    });
  }, [airlock.currentContext]);

  // ============================================================================
  // RAS MONITOR
  // ============================================================================
  
  
  const adjustArousal = (delta: number) => {
    setArousalScore(prev => Math.max(0, Math.min(100, prev + delta)));
  };

  // ============================================================================
  // HEAVY WORK TRACKER
  // ============================================================================
  
  const logHeavyWork = useCallback(() => {
    if (!currentActivity.trim()) return;
    
    const entry: HeavyWorkEntry = {
      id: Date.now().toString(),
      activity: currentActivity,
      duration: activityDuration,
      timestamp: Date.now(),
      spoonRecovery: Math.floor(activityDuration / 5), // 1 spoon per 5 min
    };
    
    setHeavyWorkLog(prev => [entry, ...prev.slice(0, 9)]); // Keep last 10
    setCurrentActivity('');
    
    // Update arousal toward optimal
    setArousalScore(prev => {
      const target = 50;
      return prev + (target - prev) * 0.3;
    });
    
    triggerHapticPulse('medium');
  }, [currentActivity, activityDuration]);

  // ============================================================================
  // SENSORY VOID DETECTION
  // ============================================================================
  

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================
  
  const getRASColor = () => {
    switch (rasLevel) {
      case 'hypo': return GOD_CONFIG.voltage.low.color;
      case 'optimal': return GOD_CONFIG.heartbeat.statuses.green.color;
      case 'hyper': return GOD_CONFIG.voltage.high.color;
    }
  };
  
  const getRASLabel = () => {
    switch (rasLevel) {
      case 'hypo': return 'Under-Aroused (The Drift)';
      case 'optimal': return 'Optimal (Flow State)';
      case 'hyper': return 'Over-Aroused (Redline)';
    }
  };
  
  const contextIcons: Record<AirlockState['currentContext'], string> = {
    gaming: '🎮',
    social: '👥',
    work: '💼',
    rest: '🌙',
    creative: '🎨',
  };

  // ============================================================================
  // RENDER
  // ============================================================================
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div
        style={{
          padding: 20,
          backgroundColor: GOD_CONFIG.theme.bg.secondary,
          borderRadius: 12,
          border: `1px solid ${GOD_CONFIG.theme.border.default}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <Brain size={24} color={GOD_CONFIG.theme.text.accent} />
          <h2
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 700,
              color: GOD_CONFIG.theme.text.primary,
              fontFamily: GOD_CONFIG.typography.fontFamily.display,
            }}
          >
            Somatic Regulation Toolkit
          </h2>
        </div>
        <p style={{ margin: 0, fontSize: 13, color: GOD_CONFIG.theme.text.secondary }}>
          The "Race Car Brain" maintenance system. Sensory regulation for the high-performance neurotype.
        </p>
      </div>

      {/* Quick Actions Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12,
        }}
      >
        {/* Lime Drag Button */}
        <button
          id="lime-drag-button"
          onClick={triggerLimeDrag}
          style={{
            padding: 16,
            backgroundColor: '#1a2e1a',
            border: `2px solid ${GOD_CONFIG.heartbeat.statuses.green.color}`,
            borderRadius: 12,
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{ fontSize: 28 }}>🍋</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: GOD_CONFIG.heartbeat.statuses.green.color }}>
            LIME DRAG
          </div>
          <div style={{ fontSize: 10, color: GOD_CONFIG.theme.text.muted }}>
            Trigeminal Shock
          </div>
        </button>

        {/* Grounding Rose */}
        <button
          onClick={pressRose}
          style={{
            padding: 16,
            backgroundColor: isRoseActive ? '#2e1a2e' : GOD_CONFIG.theme.bg.tertiary,
            border: `2px solid ${isRoseActive ? '#ff69b4' : GOD_CONFIG.theme.border.default}`,
            borderRadius: 12,
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            transition: 'all 0.2s ease',
          }}
        >
          <Flower2 size={28} color={isRoseActive ? '#ff69b4' : GOD_CONFIG.theme.text.muted} />
          <div style={{ fontSize: 12, fontWeight: 600, color: GOD_CONFIG.theme.text.primary }}>
            GROUNDING ROSE
          </div>
          <div style={{ fontSize: 14, color: GOD_CONFIG.theme.text.accent }}>
            Count: {roseCount}
          </div>
        </button>

        {/* Brown Noise Toggle */}
        <button
          onClick={toggleBrownNoise}
          style={{
            padding: 16,
            backgroundColor: isBrownNoiseOn ? '#1a1a2e' : GOD_CONFIG.theme.bg.tertiary,
            border: `2px solid ${isBrownNoiseOn ? '#6366f1' : GOD_CONFIG.theme.border.default}`,
            borderRadius: 12,
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            transition: 'all 0.2s ease',
          }}
        >
          {isBrownNoiseOn ? (
            <Volume2 size={28} color="#6366f1" />
          ) : (
            <VolumeX size={28} color={GOD_CONFIG.theme.text.muted} />
          )}
          <div style={{ fontSize: 12, fontWeight: 600, color: GOD_CONFIG.theme.text.primary }}>
            BROWN NOISE
          </div>
          <div style={{ fontSize: 10, color: isBrownNoiseOn ? '#6366f1' : GOD_CONFIG.theme.text.muted }}>
            {isBrownNoiseOn ? 'Playing' : 'Off'}
          </div>
        </button>
      </div>

      {/* Brown Noise Volume (if on) */}
      {isBrownNoiseOn && (
        <div
          style={{
            padding: 12,
            backgroundColor: GOD_CONFIG.theme.bg.tertiary,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <VolumeX size={16} color={GOD_CONFIG.theme.text.muted} />
          <input
            type="range"
            min="0"
            max="100"
            value={brownNoiseVolume}
            onChange={(e) => setBrownNoiseVolume(Number(e.target.value))}
            style={{ flex: 1 }}
          />
          <Volume2 size={16} color={GOD_CONFIG.theme.text.muted} />
          <span style={{ fontSize: 12, color: GOD_CONFIG.theme.text.muted, width: 40 }}>
            {brownNoiseVolume}%
          </span>
        </div>
      )}

      {/* Sensory Void Warning */}
      {showVoidWarning && (
        <div
          style={{
            padding: 12,
            backgroundColor: `${GOD_CONFIG.voltage.medium.color}15`,
            borderRadius: 8,
            border: `1px solid ${GOD_CONFIG.voltage.medium.color}40`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <AlertTriangle size={16} color={GOD_CONFIG.voltage.medium.color} />
            <span style={{ fontSize: 12, fontWeight: 600, color: GOD_CONFIG.voltage.medium.color }}>
              SENSORY VOID DETECTED
            </span>
          </div>
          {sensoryVoids.map((v, i) => (
            <div key={i} style={{ fontSize: 12, color: GOD_CONFIG.theme.text.secondary, marginLeft: 24 }}>
              • {v}
            </div>
          ))}
        </div>
      )}

      {/* Tab Navigation */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          padding: 4,
          backgroundColor: GOD_CONFIG.theme.bg.tertiary,
          borderRadius: 8,
        }}
      >
        {[
          { id: 'stack', label: 'Sensory Stack', icon: Headphones },
          { id: 'airlock', label: 'Airlock', icon: DoorOpen },
          { id: 'ras', label: 'RAS Monitor', icon: Activity },
          { id: 'work', label: 'Heavy Work', icon: Hammer },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as typeof activeTab)}
            style={{
              flex: 1,
              padding: '10px 12px',
              backgroundColor: activeTab === id ? GOD_CONFIG.theme.bg.secondary : 'transparent',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              color: activeTab === id ? GOD_CONFIG.theme.text.primary : GOD_CONFIG.theme.text.muted,
              fontSize: 12,
              fontWeight: activeTab === id ? 600 : 400,
            }}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div
        style={{
          padding: 20,
          backgroundColor: GOD_CONFIG.theme.bg.secondary,
          borderRadius: 12,
          border: `1px solid ${GOD_CONFIG.theme.border.default}`,
        }}
      >
        {/* SENSORY STACK TAB */}
        {activeTab === 'stack' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.muted, marginBottom: 8 }}>
              SENSORY STACKING: Audio + Visual + Proprioceptive
            </div>

            {/* Audio */}
            <div>
              <div style={{ fontSize: 11, color: GOD_CONFIG.theme.text.muted, marginBottom: 8 }}>
                <Headphones size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                AUDIO MODE
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {(['off', 'transparency', 'anc', 'brown_noise'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setSensoryStack(prev => ({ ...prev, audio: mode }))}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      backgroundColor: sensoryStack.audio === mode ? GOD_CONFIG.theme.text.accent : GOD_CONFIG.theme.bg.tertiary,
                      border: 'none',
                      borderRadius: 6,
                      color: sensoryStack.audio === mode ? '#fff' : GOD_CONFIG.theme.text.primary,
                      fontSize: 11,
                      cursor: 'pointer',
                    }}
                  >
                    {mode === 'off' ? 'Off' : mode === 'transparency' ? 'Transparent' : mode === 'anc' ? 'ANC' : 'Brown'}
                  </button>
                ))}
              </div>
            </div>

            {/* Visual */}
            <div>
              <div style={{ fontSize: 11, color: GOD_CONFIG.theme.text.muted, marginBottom: 8 }}>
                <Eye size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                VISUAL MODE
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {(['off', 'sunglasses', 'blue_light', 'dim'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setSensoryStack(prev => ({ ...prev, visual: mode }))}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      backgroundColor: sensoryStack.visual === mode ? GOD_CONFIG.theme.text.accent : GOD_CONFIG.theme.bg.tertiary,
                      border: 'none',
                      borderRadius: 6,
                      color: sensoryStack.visual === mode ? '#fff' : GOD_CONFIG.theme.text.primary,
                      fontSize: 11,
                      cursor: 'pointer',
                    }}
                  >
                    {mode === 'off' ? 'Off' : mode === 'sunglasses' ? 'Shades' : mode === 'blue_light' ? 'Blue Block' : 'Dim'}
                  </button>
                ))}
              </div>
            </div>

            {/* Chewing */}
            <div>
              <div style={{ fontSize: 11, color: GOD_CONFIG.theme.text.muted, marginBottom: 8 }}>
                <Cookie size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                CHEWING (Proprioceptive)
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {(['off', 'ark_xt', 'ark_soft', 'gum', 'ice'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setSensoryStack(prev => ({ ...prev, chewing: mode }))}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      backgroundColor: sensoryStack.chewing === mode ? GOD_CONFIG.theme.text.accent : GOD_CONFIG.theme.bg.tertiary,
                      border: 'none',
                      borderRadius: 6,
                      color: sensoryStack.chewing === mode ? '#fff' : GOD_CONFIG.theme.text.primary,
                      fontSize: 11,
                      cursor: 'pointer',
                    }}
                  >
                    {mode === 'off' ? 'Off' : mode === 'ark_xt' ? 'ARK XT' : mode === 'ark_soft' ? 'ARK Soft' : mode === 'gum' ? 'Gum' : 'Ice'}
                  </button>
                ))}
              </div>
            </div>

            {/* Stack Summary */}
            <div
              style={{
                padding: 12,
                backgroundColor: GOD_CONFIG.theme.bg.tertiary,
                borderRadius: 8,
                marginTop: 8,
              }}
            >
              <div style={{ fontSize: 11, color: GOD_CONFIG.theme.text.muted, marginBottom: 8 }}>
                CURRENT STACK
              </div>
              <div style={{ fontSize: 13, color: GOD_CONFIG.theme.text.primary }}>
                🎧 {sensoryStack.audio} | 👓 {sensoryStack.visual} | 🦷 {sensoryStack.chewing}
              </div>
            </div>
          </div>
        )}

        {/* AIRLOCK TAB */}
        {activeTab === 'airlock' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.muted, marginBottom: 8 }}>
              AIRLOCK PROTOCOL: Pressure equalization when switching contexts
            </div>

            {/* Current Context */}
            <div
              style={{
                padding: 16,
                backgroundColor: GOD_CONFIG.theme.bg.tertiary,
                borderRadius: 8,
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 11, color: GOD_CONFIG.theme.text.muted }}>CURRENT CONTEXT</div>
              <div style={{ fontSize: 32, marginTop: 8 }}>{contextIcons[airlock.currentContext]}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: GOD_CONFIG.theme.text.primary, marginTop: 4 }}>
                {airlock.currentContext.toUpperCase()}
              </div>
            </div>

            {/* Transition Progress */}
            {airlock.isTransitioning && (
              <div
                style={{
                  padding: 16,
                  backgroundColor: `${GOD_CONFIG.theme.text.accent}15`,
                  borderRadius: 8,
                  border: `1px solid ${GOD_CONFIG.theme.text.accent}40`,
                }}
              >
                <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.accent, marginBottom: 8 }}>
                  EQUALIZING PRESSURE...
                </div>
                <div
                  style={{
                    height: 8,
                    backgroundColor: GOD_CONFIG.theme.bg.tertiary,
                    borderRadius: 4,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${airlock.pressureLevel}%`,
                      backgroundColor: GOD_CONFIG.theme.text.accent,
                      transition: 'width 0.2s ease',
                    }}
                  />
                </div>
                <div style={{ fontSize: 11, color: GOD_CONFIG.theme.text.muted, marginTop: 8, textAlign: 'center' }}>
                  {airlock.currentContext} → {airlock.targetContext}
                </div>
              </div>
            )}

            {/* Context Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
              {(Object.keys(contextIcons) as AirlockState['currentContext'][]).map((ctx) => (
                <button
                  key={ctx}
                  onClick={() => initiateAirlock(ctx)}
                  disabled={airlock.isTransitioning || airlock.currentContext === ctx}
                  style={{
                    padding: 12,
                    backgroundColor: airlock.currentContext === ctx
                      ? GOD_CONFIG.theme.text.accent
                      : GOD_CONFIG.theme.bg.tertiary,
                    border: 'none',
                    borderRadius: 8,
                    cursor: airlock.isTransitioning || airlock.currentContext === ctx ? 'not-allowed' : 'pointer',
                    opacity: airlock.isTransitioning ? 0.5 : 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <span style={{ fontSize: 20 }}>{contextIcons[ctx]}</span>
                  <span style={{
                    fontSize: 10,
                    color: airlock.currentContext === ctx ? '#fff' : GOD_CONFIG.theme.text.primary,
                  }}>
                    {ctx}
                  </span>
                </button>
              ))}
            </div>

            <div style={{ fontSize: 11, color: GOD_CONFIG.theme.text.muted, fontStyle: 'italic', textAlign: 'center' }}>
              "The Airlock prevents the 'bends' when moving between high-pressure and low-pressure environments."
            </div>
          </div>
        )}

        {/* RAS MONITOR TAB */}
        {activeTab === 'ras' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.muted, marginBottom: 8 }}>
              RAS MONITOR: Reticular Activating System arousal level
            </div>

            {/* Arousal Gauge */}
            <div
              style={{
                padding: 20,
                backgroundColor: GOD_CONFIG.theme.bg.tertiary,
                borderRadius: 12,
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 48, fontWeight: 700, color: getRASColor() }}>
                {arousalScore}%
              </div>
              <div style={{ fontSize: 14, color: getRASColor(), marginTop: 8 }}>
                {getRASLabel()}
              </div>
              
              {/* Visual Gauge */}
              <div
                style={{
                  marginTop: 16,
                  height: 12,
                  backgroundColor: GOD_CONFIG.theme.bg.primary,
                  borderRadius: 6,
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                {/* Optimal zone indicator */}
                <div
                  style={{
                    position: 'absolute',
                    left: '30%',
                    width: '40%',
                    height: '100%',
                    backgroundColor: `${GOD_CONFIG.heartbeat.statuses.green.color}30`,
                  }}
                />
                {/* Current level */}
                <div
                  style={{
                    position: 'absolute',
                    left: `${arousalScore}%`,
                    width: 4,
                    height: '100%',
                    backgroundColor: getRASColor(),
                    transform: 'translateX(-50%)',
                    borderRadius: 2,
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 10, color: GOD_CONFIG.theme.text.muted }}>
                <span>Hypo (Drift)</span>
                <span>Optimal</span>
                <span>Hyper (Redline)</span>
              </div>
            </div>

            {/* Manual Adjustment */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                onClick={() => adjustArousal(-10)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: GOD_CONFIG.voltage.low.color,
                  border: 'none',
                  borderRadius: 8,
                  color: '#fff',
                  fontSize: 12,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Minus size={14} /> Calm Down
              </button>
              <button
                onClick={() => setArousalScore(50)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: GOD_CONFIG.theme.bg.tertiary,
                  border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                  borderRadius: 8,
                  color: GOD_CONFIG.theme.text.primary,
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                <RotateCcw size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                Reset
              </button>
              <button
                onClick={() => adjustArousal(10)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: GOD_CONFIG.voltage.high.color,
                  border: 'none',
                  borderRadius: 8,
                  color: '#fff',
                  fontSize: 12,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Plus size={14} /> Energize
              </button>
            </div>

            {/* Quick Fixes */}
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 11, color: GOD_CONFIG.theme.text.muted, marginBottom: 8 }}>
                QUICK FIXES
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {rasLevel === 'hypo' && (
                  <>
                    <button onClick={triggerLimeDrag} style={{ padding: '6px 12px', backgroundColor: '#1a2e1a', border: `1px solid ${GOD_CONFIG.heartbeat.statuses.green.color}`, borderRadius: 6, color: GOD_CONFIG.heartbeat.statuses.green.color, fontSize: 11, cursor: 'pointer' }}>
                      🍋 Lime Drag
                    </button>
                    <button onClick={toggleBrownNoise} style={{ padding: '6px 12px', backgroundColor: GOD_CONFIG.theme.bg.tertiary, border: `1px solid ${GOD_CONFIG.theme.border.default}`, borderRadius: 6, color: GOD_CONFIG.theme.text.primary, fontSize: 11, cursor: 'pointer' }}>
                      🔊 Brown Noise
                    </button>
                  </>
                )}
                {rasLevel === 'hyper' && (
                  <>
                    <button onClick={pressRose} style={{ padding: '6px 12px', backgroundColor: GOD_CONFIG.theme.bg.tertiary, border: `1px solid ${GOD_CONFIG.theme.border.default}`, borderRadius: 6, color: GOD_CONFIG.theme.text.primary, fontSize: 11, cursor: 'pointer' }}>
                      🌹 Grounding Rose
                    </button>
                    <button onClick={() => triggerVagusSignal()} style={{ padding: '6px 12px', backgroundColor: GOD_CONFIG.theme.bg.tertiary, border: `1px solid ${GOD_CONFIG.theme.border.default}`, borderRadius: 6, color: GOD_CONFIG.theme.text.primary, fontSize: 11, cursor: 'pointer' }}>
                      🫁 4-4-8 Breath
                    </button>
                  </>
                )}
                {rasLevel === 'optimal' && (
                  <div style={{ fontSize: 12, color: GOD_CONFIG.heartbeat.statuses.green.color }}>
                    ✓ You're in the Flow Zone
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* HEAVY WORK TAB */}
        {activeTab === 'work' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.muted, marginBottom: 8 }}>
              HEAVY WORK TRACKER: Log physical regulation activities
            </div>

            {/* Quick Activities */}
            <div>
              <div style={{ fontSize: 11, color: GOD_CONFIG.theme.text.muted, marginBottom: 8 }}>
                QUICK LOG
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['Push-ups', 'Walk', 'Stretching', 'Sawing', 'Hammering', 'Chewing', 'Cleaning', 'Gardening'].map((act) => (
                  <button
                    key={act}
                    onClick={() => setCurrentActivity(act)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: currentActivity === act ? GOD_CONFIG.theme.text.accent : GOD_CONFIG.theme.bg.tertiary,
                      border: 'none',
                      borderRadius: 6,
                      color: currentActivity === act ? '#fff' : GOD_CONFIG.theme.text.primary,
                      fontSize: 11,
                      cursor: 'pointer',
                    }}
                  >
                    {act}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration & Log */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: GOD_CONFIG.theme.text.muted, marginBottom: 4 }}>
                  ACTIVITY
                </div>
                <input
                  type="text"
                  value={currentActivity}
                  onChange={(e) => setCurrentActivity(e.target.value)}
                  placeholder="Enter activity..."
                  style={{
                    width: '100%',
                    padding: 10,
                    backgroundColor: GOD_CONFIG.theme.bg.tertiary,
                    border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                    borderRadius: 6,
                    color: GOD_CONFIG.theme.text.primary,
                    fontSize: 13,
                  }}
                />
              </div>
              <div style={{ width: 80 }}>
                <div style={{ fontSize: 11, color: GOD_CONFIG.theme.text.muted, marginBottom: 4 }}>
                  MINUTES
                </div>
                <input
                  type="number"
                  value={activityDuration}
                  onChange={(e) => setActivityDuration(Number(e.target.value))}
                  min={5}
                  max={120}
                  style={{
                    width: '100%',
                    padding: 10,
                    backgroundColor: GOD_CONFIG.theme.bg.tertiary,
                    border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                    borderRadius: 6,
                    color: GOD_CONFIG.theme.text.primary,
                    fontSize: 13,
                    textAlign: 'center',
                  }}
                />
              </div>
              <button
                onClick={logHeavyWork}
                disabled={!currentActivity.trim()}
                style={{
                  padding: '10px 16px',
                  backgroundColor: currentActivity.trim() ? GOD_CONFIG.heartbeat.statuses.green.color : GOD_CONFIG.theme.bg.tertiary,
                  border: 'none',
                  borderRadius: 6,
                  color: currentActivity.trim() ? '#fff' : GOD_CONFIG.theme.text.muted,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: currentActivity.trim() ? 'pointer' : 'not-allowed',
                }}
              >
                Log
              </button>
            </div>

            {/* Log History */}
            <div>
              <div style={{ fontSize: 11, color: GOD_CONFIG.theme.text.muted, marginBottom: 8 }}>
                RECENT WORK (Spoons Recovered)
              </div>
              {heavyWorkLog.length === 0 ? (
                <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.muted, fontStyle: 'italic' }}>
                  No activities logged yet
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {heavyWorkLog.map((entry) => (
                    <div
                      key={entry.id}
                      style={{
                        padding: 12,
                        backgroundColor: GOD_CONFIG.theme.bg.tertiary,
                        borderRadius: 8,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 13, color: GOD_CONFIG.theme.text.primary }}>
                          {entry.activity}
                        </div>
                        <div style={{ fontSize: 11, color: GOD_CONFIG.theme.text.muted }}>
                          {entry.duration} min • {new Date(entry.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                      <div style={{
                        padding: '4px 8px',
                        backgroundColor: `${GOD_CONFIG.heartbeat.statuses.green.color}20`,
                        borderRadius: 4,
                        fontSize: 12,
                        color: GOD_CONFIG.heartbeat.statuses.green.color,
                      }}>
                        +{entry.spoonRecovery} 🥄
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ fontSize: 11, color: GOD_CONFIG.theme.text.muted, fontStyle: 'italic', textAlign: 'center', marginTop: 8 }}>
              "The Woodshop is the regulation chamber. Heavy Work is the medicine."
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SomaticRegulation;



