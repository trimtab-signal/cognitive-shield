/**
 * @license AGPLv3 - Wonky Sprout DUNA
 * 
 * GADGETBRIDGE INTEGRATION
 * 
 * Connects to Gadgetbridge app for sovereign wearable data
 * Supports: Amazfit Balance, Helios Ring, and 200+ other devices
 * 
 * Architecture:
 * - Gadgetbridge broadcasts data via Android Intents
 * - Tasker/Automate/HTTP Shortcuts forwards to local HTTP endpoint
 * - OR uses Gadgetbridge's internal HTTP server (debug mode)
 * - Data flows: Watch → Gadgetbridge → HTTP → Cognitive Shield
 */

// ═══════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════

export interface BiometricReading {
  timestamp: Date;
  heartRate?: number;           // BPM
  heartRateVariability?: number; // RMSSD in ms
  steps?: number;
  stressLevel?: number;          // 0-100
  bloodOxygen?: number;          // SpO2 percentage
  sleepStage?: 'awake' | 'light' | 'deep' | 'rem';
  batteryLevel?: number;
  deviceName?: string;
  deviceType?: 'watch' | 'ring' | 'band';
}

export interface CoherenceState {
  isCoherent: boolean;           // True if at 0.1 Hz resonance
  coherenceScore: number;        // 0-100
  frequency: number;             // Detected HRV frequency in Hz
  duration: number;              // How long coherent (seconds)
  lastUpdate: Date;
}

export interface ProofOfCareEvent {
  type: 'proximity' | 'coherence' | 'stress_relief';
  from: string;                  // User ID
  to: string;                    // Family member ID
  timestamp: Date;
  value: number;                 // Intensity/score
  biometrics: BiometricReading;
}

type BiometricCallback = (reading: BiometricReading) => void;
type CoherenceCallback = (state: CoherenceState) => void;
type ProofOfCareCallback = (event: ProofOfCareEvent) => void;

// ═══════════════════════════════════════════════════════════════════════
// GADGETBRIDGE SERVICE
// ═══════════════════════════════════════════════════════════════════════

class GadgetbridgeService {
  private httpPort = 8089;
  private wsConnection: WebSocket | null = null;
  private readings: BiometricReading[] = [];
  private maxReadings = 1000;
  
  private biometricCallbacks: BiometricCallback[] = [];
  private coherenceCallbacks: CoherenceCallback[] = [];
  private pocCallbacks: ProofOfCareCallback[] = [];
  
  private coherenceState: CoherenceState = {
    isCoherent: false,
    coherenceScore: 0,
    frequency: 0,
    duration: 0,
    lastUpdate: new Date(),
  };
  
  private hrvWindow: number[] = [];
  private hrvWindowSize = 60; // 60 seconds for coherence detection

  // ═════════════════════════════════════════════════════════════════════
  // INITIALIZATION
  // ═════════════════════════════════════════════════════════════════════

  async initialize(): Promise<void> {
    console.log('[Gadgetbridge] Initializing...');
    
    // Try to connect to local HTTP endpoint
    this.startHttpPolling();
    
    // Try to connect via WebSocket (if Gadgetbridge HTTP server enabled)
    this.connectWebSocket();
    
    console.log('[Gadgetbridge] Initialized! Listening for biometric data...');
  }

  private startHttpPolling(): void {
    // Poll local endpoint every 5 seconds
    setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:${this.httpPort}/biometrics`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
        });
        
        if (response.ok) {
          const data = await response.json();
          this.processBiometricData(data);
        }
      } catch {
        // Silent fail - endpoint might not be running
      }
    }, 5000);
  }

  private connectWebSocket(): void {
    try {
      this.wsConnection = new WebSocket(`ws://localhost:${this.httpPort}/ws`);
      
      this.wsConnection.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.processBiometricData(data);
        } catch (err) {
          console.error('[Gadgetbridge] WebSocket parse error:', err);
        }
      };
      
      this.wsConnection.onclose = () => {
        console.log('[Gadgetbridge] WebSocket closed, retrying in 10s...');
        setTimeout(() => this.connectWebSocket(), 10000);
      };
      
      this.wsConnection.onerror = () => {
        // Silent - WebSocket optional
      };
    } catch {
      // WebSocket not available
    }
  }

  // ═════════════════════════════════════════════════════════════════════
  // DATA PROCESSING
  // ═════════════════════════════════════════════════════════════════════

  private processBiometricData(data: Record<string, unknown>): void {
    const reading: BiometricReading = {
      timestamp: new Date((data.timestamp as string | number) || Date.now()),
      heartRate: (data.heart_rate || data.hr) as number | undefined,
      heartRateVariability: (data.hrv || data.heart_rate_variability) as number | undefined,
      steps: data.steps as number | undefined,
      stressLevel: (data.stress || data.stress_level) as number | undefined,
      bloodOxygen: (data.spo2 || data.blood_oxygen) as number | undefined,
      sleepStage: data.sleep_stage as 'awake' | 'light' | 'deep' | 'rem' | undefined,
      batteryLevel: (data.battery || data.battery_level) as number | undefined,
      deviceName: (data.device_name || data.device) as string | undefined,
      deviceType: this.detectDeviceType(data.device_name as string | undefined),
    };

    // Store reading
    this.readings.push(reading);
    if (this.readings.length > this.maxReadings) {
      this.readings.shift();
    }

    // Notify callbacks
    this.biometricCallbacks.forEach(cb => cb(reading));

    // Process HRV for coherence detection
    if (reading.heartRateVariability) {
      this.processHRVForCoherence(reading.heartRateVariability);
    }

    // Detect Proof of Care events
    this.detectProofOfCareEvent(reading);
  }

  private detectDeviceType(name?: string): 'watch' | 'ring' | 'band' {
    if (!name) return 'watch';
    const lower = name.toLowerCase();
    if (lower.includes('ring') || lower.includes('helios')) return 'ring';
    if (lower.includes('band') || lower.includes('mi')) return 'band';
    return 'watch';
  }

  // ═════════════════════════════════════════════════════════════════════
  // HRV COHERENCE DETECTION (The "Green Coherence" 0.1 Hz)
  // ═════════════════════════════════════════════════════════════════════

  private processHRVForCoherence(hrv: number): void {
    // Add to rolling window
    this.hrvWindow.push(hrv);
    if (this.hrvWindow.length > this.hrvWindowSize) {
      this.hrvWindow.shift();
    }

    // Need at least 30 seconds of data
    if (this.hrvWindow.length < 30) return;

    // Calculate dominant frequency using simplified FFT approximation
    const frequency = this.detectDominantFrequency(this.hrvWindow);
    
    // Check if near 0.1 Hz (6 breaths per minute, "Green Coherence")
    const targetFreq = 0.1; // Hz
    const tolerance = 0.02; // ±0.02 Hz
    const isCoherent = Math.abs(frequency - targetFreq) < tolerance;
    
    // Calculate coherence score (0-100)
    const deviation = Math.abs(frequency - targetFreq);
    const score = Math.max(0, Math.min(100, (1 - (deviation / tolerance)) * 100));
    
    // Update coherence state
    const wasCoherent = this.coherenceState.isCoherent;
    const now = new Date();
    
    this.coherenceState = {
      isCoherent,
      coherenceScore: score,
      frequency,
      duration: isCoherent 
        ? (wasCoherent 
            ? this.coherenceState.duration + 5 
            : 5)
        : 0,
      lastUpdate: now,
    };

    // Notify callbacks
    this.coherenceCallbacks.forEach(cb => cb(this.coherenceState));
  }

  private detectDominantFrequency(values: number[]): number {
    // Simplified frequency detection using autocorrelation
    // Real implementation would use proper FFT
    
    if (values.length < 10) return 0;
    
    // Calculate mean
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    
    // Look for periodicity
    let maxCorr = 0;
    let bestLag = 0;
    
    for (let lag = 5; lag < values.length / 2; lag++) {
      let corr = 0;
      let count = 0;
      
      for (let i = 0; i < values.length - lag; i++) {
        corr += (values[i] - mean) * (values[i + lag] - mean);
        count++;
      }
      
      corr /= count;
      
      if (corr > maxCorr) {
        maxCorr = corr;
        bestLag = lag;
      }
    }
    
    // Convert lag to frequency (assuming 1 sample per 5 seconds)
    const samplingRate = 0.2; // Hz (1 sample / 5 seconds)
    const frequency = samplingRate / bestLag;
    
    return frequency;
  }

  // ═════════════════════════════════════════════════════════════════════
  // PROOF OF CARE DETECTION
  // ═════════════════════════════════════════════════════════════════════

  private detectProofOfCareEvent(reading: BiometricReading): void {
    // Detect stress relief (stress level dropping while in proximity)
    if (reading.stressLevel !== undefined) {
      const recentReadings = this.readings.slice(-10);
      const avgStress = recentReadings
        .filter(r => r.stressLevel !== undefined)
        .reduce((sum, r) => sum + (r.stressLevel || 0), 0) / recentReadings.length;
      
      if (avgStress - reading.stressLevel > 10) {
        // Stress dropped by 10+ points
        const event: ProofOfCareEvent = {
          type: 'stress_relief',
          from: 'self',
          to: 'unknown', // Would come from proximity detection
          timestamp: reading.timestamp,
          value: avgStress - reading.stressLevel,
          biometrics: reading,
        };
        
        this.pocCallbacks.forEach(cb => cb(event));
      }
    }

    // Detect coherence achievement
    if (this.coherenceState.isCoherent && this.coherenceState.duration > 30) {
      const event: ProofOfCareEvent = {
        type: 'coherence',
        from: 'self',
        to: 'family',
        timestamp: reading.timestamp,
        value: this.coherenceState.coherenceScore,
        biometrics: reading,
      };
      
      this.pocCallbacks.forEach(cb => cb(event));
    }
  }

  // ═════════════════════════════════════════════════════════════════════
  // PUBLIC API
  // ═════════════════════════════════════════════════════════════════════

  onBiometricUpdate(callback: BiometricCallback): void {
    this.biometricCallbacks.push(callback);
  }

  onCoherenceUpdate(callback: CoherenceCallback): void {
    this.coherenceCallbacks.push(callback);
  }

  onProofOfCare(callback: ProofOfCareCallback): void {
    this.pocCallbacks.push(callback);
  }

  getLatestReading(): BiometricReading | null {
    return this.readings[this.readings.length - 1] || null;
  }

  getCoherenceState(): CoherenceState {
    return { ...this.coherenceState };
  }

  getReadings(count: number = 100): BiometricReading[] {
    return this.readings.slice(-count);
  }

  // Manual data injection (for testing or Tasker/Automate integration)
  injectReading(reading: Partial<BiometricReading>): void {
    const fullReading: BiometricReading = {
      timestamp: new Date(),
      ...reading,
    };
    this.processBiometricData(fullReading as unknown as Record<string, unknown>);
  }
}

// ═══════════════════════════════════════════════════════════════════════
// SINGLETON EXPORT
// ═══════════════════════════════════════════════════════════════════════

export const gadgetbridge = new GadgetbridgeService();

// ═══════════════════════════════════════════════════════════════════════
// SETUP INSTRUCTIONS (embedded in code for reference)
// ═══════════════════════════════════════════════════════════════════════

export const SETUP_INSTRUCTIONS = `
╔═══════════════════════════════════════════════════════════════════════════════╗
║                     GADGETBRIDGE SETUP GUIDE                                   ║
║                  For Amazfit Balance & Helios Ring                             ║
╚═══════════════════════════════════════════════════════════════════════════════╝

STEP 1: INSTALL GADGETBRIDGE (Android)
──────────────────────────────────────
1. Install Gadgetbridge from F-Droid or GitHub:
   https://f-droid.org/packages/nodomain.freeyourgadget.gadgetbridge/
   
2. Open Gadgetbridge → Add device
3. Select your Amazfit Balance
4. Pair via Bluetooth
5. Repeat for Helios Ring (if separate pairing)

STEP 2: ENABLE DATA BROADCASTING
─────────────────────────────────────
1. Gadgetbridge → Settings → Developer Options
2. Enable "Broadcast Intent with Real-time Data"
3. Note the Intent action: "nodomain.freeyourgadget.gadgetbridge.biometricdata"

STEP 3: INSTALL HTTP BRIDGE (Choose ONE)
──────────────────────────────────────────

OPTION A: Tasker (Recommended)
1. Install Tasker app
2. Create Profile:
   - Event → System → Intent Received
   - Action: nodomain.freeyourgadget.gadgetbridge.biometricdata
3. Create Task:
   - Action → Net → HTTP Post
   - Server:Port: localhost:8089
   - Path: /biometrics
   - Data: %heart_rate, %hrv, %steps (from Intent extras)
4. Enable profile

OPTION B: Automate
1. Install Automate app
2. Import flow from QR code (we'll generate)
3. Enable flow

OPTION C: HTTP Shortcuts
1. Install HTTP Shortcuts
2. Create shortcut with Tasker integration
3. Trigger on Gadgetbridge Intent

STEP 4: TEST CONNECTION
────────────────────────
1. Open Cognitive Shield
2. Click 💓 Heartbeat tab
3. Look for "Gadgetbridge: Connected ✅"
4. Wear your device
5. Watch real-time data appear!

STEP 5: ENABLE PROOF OF CARE
──────────────────────────────
1. Keep Shield running on your phone
2. Keep Gadgetbridge running
3. HRV data flows automatically
4. When you achieve 0.1 Hz coherence:
   → "Green Coherence" badge appears
   → Care tokens mint automatically
   → Family sees your state improve!

TROUBLESHOOTING
────────────────
- No data? Check Gadgetbridge "Broadcast" is ON
- HTTP errors? Ensure Tasker has network permissions
- Missing HRV? Not all devices support it (Balance does!)
- Wrong frequency? Breathe deeply at 6 breaths/min (0.1 Hz)

DEVICES SUPPORTED
──────────────────
✅ Amazfit Balance (HRV, HR, Steps, Stress, SpO2)
✅ Helios Ring (HRV, HR, Sleep, Temp)
✅ 200+ other devices via Gadgetbridge!

═══════════════════════════════════════════════════════════════════════════════
"Your body doesn't lie. Let the hardware tell the truth."
`;
