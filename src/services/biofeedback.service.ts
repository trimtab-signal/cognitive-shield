/**
 * BIOFEEDBACK SERVICE
 * Advanced physiological monitoring for consciousness resonance
 * Integrates multiple sensor modalities for coherence calculation
 */

export interface BiofeedbackData {
  timestamp: number;

  // Cardiovascular
  heartRate: number;           // BPM
  heartRateVariability: number; // ms
  bloodPressure?: { systolic: number; diastolic: number };

  // Respiratory
  breathingRate: number;       // breaths per minute
  breathingDepth: number;      // 0-1 scale
  respiratorySinusArrhythmia: number; // coherence measure

  // Electrodermal
  skinConductance: number;     // microsiemens
  skinConductanceResponse: number; // SCR amplitude

  // Neurological (simulated)
  brainwaveCoherence: number;  // 0-100 alpha/theta coherence
  alphaPower: number;          // EEG alpha band power
  thetaPower: number;          // EEG theta band power

  // Movement
  accelerometer: { x: number; y: number; z: number };
  gyroscope?: { x: number; y: number; z: number };

  // Environmental
  ambientLight?: number;       // lux
  ambientNoise?: number;       // dB
  ambientTemperature?: number; // °C
}

export interface CoherenceMetrics {
  overallCoherence: number;     // 0-100 composite score
  physiologicalSync: number;    // 0-100 autonomic nervous system
  neurologicalFlow: number;     // 0-100 brain state coherence
  behavioralStability: number;  // 0-100 movement patterns
  environmentalHarmony: number; // 0-100 context alignment

  // Advanced metrics
  resonanceFrequency: number;   // Hz, dominant coherence frequency
  entropyIndex: number;         // 0-100 system complexity
  fractalDimension: number;     // 0-2, signal complexity measure
}

export class BiofeedbackService {
  private static instance: BiofeedbackService;
  private dataHistory: BiofeedbackData[] = [];
  private readonly MAX_HISTORY = 300; // 5 minutes at 1Hz
  private coherenceHistory: CoherenceMetrics[] = [];
  private listeners: Array<(data: BiofeedbackData, coherence: CoherenceMetrics) => void> = [];

  private constructor() {
    this.initializeSimulatedSensors();
  }

  static getInstance(): BiofeedbackService {
    if (!BiofeedbackService.instance) {
      BiofeedbackService.instance = new BiofeedbackService();
    }
    return BiofeedbackService.instance;
  }

  private initializeSimulatedSensors() {
    // Simulate real-time sensor data collection
    setInterval(() => {
      const data = this.generateSimulatedData();
      this.addDataPoint(data);
    }, 1000); // 1Hz sampling rate
  }

  private generateSimulatedData(): BiofeedbackData {
    const now = Date.now();

    // Base values with natural variation
    const baseHeartRate = 72 + Math.sin(now / 30000) * 8; // Circadian rhythm
    const breathingRate = 12 + Math.sin(now / 25000) * 2; // Respiratory rhythm

    // Add coherence-based modulation (would be real sensor data)
    const coherenceModulation = Math.sin(now / 15000) * 0.3; // Simulated coherence effect

    return {
      timestamp: now,
      heartRate: baseHeartRate + (Math.random() - 0.5) * 4 + coherenceModulation * 10,
      heartRateVariability: 45 + Math.random() * 20 + coherenceModulation * 15,
      breathingRate: breathingRate + (Math.random() - 0.5) * 1,
      breathingDepth: 0.6 + Math.random() * 0.3 + coherenceModulation * 0.2,
      respiratorySinusArrhythmia: 65 + Math.random() * 20 + coherenceModulation * 15,
      skinConductance: 2.0 + Math.random() * 1.5 + coherenceModulation * 1,
      skinConductanceResponse: 0.3 + Math.random() * 0.4 + coherenceModulation * 0.3,
      brainwaveCoherence: 45 + Math.random() * 30 + coherenceModulation * 20,
      alphaPower: 25 + Math.random() * 15 + coherenceModulation * 10,
      thetaPower: 20 + Math.random() * 12 + coherenceModulation * 8,
      accelerometer: {
        x: (Math.random() - 0.5) * 0.2 + coherenceModulation * 0.1,
        y: (Math.random() - 0.5) * 0.2 + coherenceModulation * 0.1,
        z: 9.8 + (Math.random() - 0.5) * 0.1 + coherenceModulation * 0.05
      },
      ambientLight: 300 + Math.random() * 200,
      ambientNoise: 35 + Math.random() * 15,
      ambientTemperature: 22 + Math.random() * 3
    };
  }

  private addDataPoint(data: BiofeedbackData) {
    this.dataHistory.push(data);

    // Maintain history size
    if (this.dataHistory.length > this.MAX_HISTORY) {
      this.dataHistory.shift();
    }

    // Calculate coherence metrics
    const coherence = this.calculateCoherenceMetrics();

    // Store coherence history
    this.coherenceHistory.push(coherence);
    if (this.coherenceHistory.length > this.MAX_HISTORY) {
      this.coherenceHistory.shift();
    }

    // Notify listeners
    this.listeners.forEach(listener => listener(data, coherence));
  }

  private calculateCoherenceMetrics(): CoherenceMetrics {
    if (this.dataHistory.length < 10) {
      return {
        overallCoherence: 50,
        physiologicalSync: 50,
        neurologicalFlow: 50,
        behavioralStability: 50,
        environmentalHarmony: 50,
        resonanceFrequency: 0.1,
        entropyIndex: 50,
        fractalDimension: 1.5
      };
    }

    const recent = this.dataHistory.slice(-30); // Last 30 seconds

    // Physiological synchronization (heart/breathing coherence)
    const heartRates = recent.map(d => d.heartRate);
    const breathingRates = recent.map(d => d.breathingRate);
    const physiologicalSync = this.calculateCrossCorrelation(heartRates, breathingRates);

    // Neurological flow (alpha/theta balance)
    const alphaPowers = recent.map(d => d.alphaPower);
    const thetaPowers = recent.map(d => d.thetaPower);
    const neurologicalFlow = this.calculateCoherence(alphaPowers, thetaPowers);

    // Behavioral stability (movement consistency)
    const movementMagnitudes = recent.map(d =>
      Math.sqrt(d.accelerometer.x ** 2 + d.accelerometer.y ** 2 + d.accelerometer.z ** 2)
    );
    const behavioralStability = 100 - (this.calculateVariance(movementMagnitudes) * 50);

    // Environmental harmony (contextual alignment)
    const environmentalHarmony = this.calculateEnvironmentalHarmony(recent);

    // Overall coherence (weighted average)
    const overallCoherence = Math.round(
      physiologicalSync * 0.3 +
      neurologicalFlow * 0.3 +
      behavioralStability * 0.2 +
      environmentalHarmony * 0.2
    );

    // Advanced metrics
    const resonanceFrequency = this.calculateDominantFrequency(recent.map(d => d.heartRate));
    const entropyIndex = this.calculateEntropy(recent.map(d => d.skinConductance));
    const fractalDimension = this.calculateFractalDimension(recent.map(d => d.brainwaveCoherence));

    return {
      overallCoherence: Math.max(0, Math.min(100, overallCoherence)),
      physiologicalSync: Math.max(0, Math.min(100, physiologicalSync)),
      neurologicalFlow: Math.max(0, Math.min(100, neurologicalFlow)),
      behavioralStability: Math.max(0, Math.min(100, behavioralStability)),
      environmentalHarmony: Math.max(0, Math.min(100, environmentalHarmony)),
      resonanceFrequency,
      entropyIndex: Math.max(0, Math.min(100, entropyIndex)),
      fractalDimension: Math.max(1, Math.min(2, fractalDimension))
    };
  }

  private calculateCrossCorrelation(arr1: number[], arr2: number[]): number {
    const n = Math.min(arr1.length, arr2.length);
    if (n < 5) return 50;

    const mean1 = arr1.reduce((a, b) => a + b) / n;
    const mean2 = arr2.reduce((a, b) => a + b) / n;

    let numerator = 0;
    let sumSq1 = 0;
    let sumSq2 = 0;

    for (let i = 0; i < n; i++) {
      const diff1 = arr1[i] - mean1;
      const diff2 = arr2[i] - mean2;
      numerator += diff1 * diff2;
      sumSq1 += diff1 * diff1;
      sumSq2 += diff2 * diff2;
    }

    const denominator = Math.sqrt(sumSq1 * sumSq2);
    const correlation = denominator === 0 ? 0 : numerator / denominator;

    // Convert to 0-100 scale
    return Math.round((correlation + 1) * 50);
  }

  private calculateCoherence(arr1: number[], arr2: number[]): number {
    // Simplified coherence calculation
    const correlation = this.calculateCrossCorrelation(arr1, arr2);
    const variance1 = this.calculateVariance(arr1);
    const variance2 = this.calculateVariance(arr2);

    // Coherence is correlation weighted by signal stability
    const stability = 100 - Math.min(100, (variance1 + variance2) * 25);
    return Math.round((correlation * 0.7) + (stability * 0.3));
  }

  private calculateVariance(arr: number[]): number {
    const mean = arr.reduce((a, b) => a + b) / arr.length;
    const squaredDiffs = arr.map(x => (x - mean) ** 2);
    return squaredDiffs.reduce((a, b) => a + b) / arr.length;
  }

  private calculateEnvironmentalHarmony(recent: BiofeedbackData[]): number {
    // Environmental harmony based on optimal ranges
    let harmony = 0;
    let count = 0;

    recent.forEach(data => {
      if (data.ambientLight !== undefined) {
        // Optimal light: 200-500 lux
        const lightOptimal = Math.max(0, 100 - Math.abs(data.ambientLight - 350) / 3.5);
        harmony += lightOptimal;
        count++;
      }

      if (data.ambientNoise !== undefined) {
        // Optimal noise: 30-50 dB
        const noiseOptimal = Math.max(0, 100 - Math.abs(data.ambientNoise - 40) * 2);
        harmony += noiseOptimal;
        count++;
      }

      if (data.ambientTemperature !== undefined) {
        // Optimal temp: 20-25°C
        const tempOptimal = Math.max(0, 100 - Math.abs(data.ambientTemperature - 22.5) * 8);
        harmony += tempOptimal;
        count++;
      }
    });

    return count > 0 ? Math.round(harmony / count) : 50;
  }

  private calculateDominantFrequency(arr: number[]): number {
    // Simplified frequency analysis (would use FFT in real implementation)
    if (arr.length < 10) return 0.1;

    // Count zero crossings as proxy for frequency
    let crossings = 0;
    const mean = arr.reduce((a, b) => a + b) / arr.length;

    for (let i = 1; i < arr.length; i++) {
      if ((arr[i-1] - mean) * (arr[i] - mean) < 0) {
        crossings++;
      }
    }

    // Estimate frequency (crossings per second)
    const frequency = (crossings / 2) / (arr.length / 60); // Convert to Hz
    return Math.max(0.05, Math.min(3.0, frequency)); // Clamp to reasonable range
  }

  private calculateEntropy(arr: number[]): number {
    if (arr.length < 5) return 50;

    // Simple entropy calculation using binning
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    const bins = 10;
    const binSize = (max - min) / bins;
    const counts = new Array(bins).fill(0);

    arr.forEach(value => {
      const bin = Math.min(bins - 1, Math.floor((value - min) / binSize));
      counts[bin]++;
    });

    // Calculate Shannon entropy
    let entropy = 0;
    const total = arr.length;

    counts.forEach(count => {
      if (count > 0) {
        const p = count / total;
        entropy -= p * Math.log2(p);
      }
    });

    // Normalize to 0-100 scale
    const maxEntropy = Math.log2(bins);
    return Math.round((entropy / maxEntropy) * 100);
  }

  private calculateFractalDimension(arr: number[]): number {
    if (arr.length < 20) return 1.5;

    // Simplified fractal dimension using box counting method
    // This is a proxy - real implementation would use proper fractal analysis
    const variances = [];
    const scales = [2, 4, 8, 16];

    scales.forEach(scale => {
      const segments = [];
      for (let i = 0; i < arr.length; i += scale) {
        segments.push(arr.slice(i, i + scale));
      }

      const segmentVariances = segments.map(segment =>
        this.calculateVariance(segment)
      );

      variances.push(Math.log(this.calculateVariance(segmentVariances)));
    });

    // Simple linear regression to estimate slope (fractal dimension)
    // This is simplified - real implementation would use proper regression
    const slope = (variances[variances.length - 1] - variances[0]) /
                  (Math.log(scales[scales.length - 1]) - Math.log(scales[0]));

    return Math.max(1.0, Math.min(2.0, 2 + slope)); // Normalize to reasonable range
  }

  // Public API
  getLatestData(): BiofeedbackData | null {
    return this.dataHistory.length > 0 ? this.dataHistory[this.dataHistory.length - 1] : null;
  }

  getLatestCoherence(): CoherenceMetrics | null {
    return this.coherenceHistory.length > 0 ? this.coherenceHistory[this.coherenceHistory.length - 1] : null;
  }

  getDataHistory(count: number = 60): BiofeedbackData[] {
    return this.dataHistory.slice(-count);
  }

  getCoherenceHistory(count: number = 60): CoherenceMetrics[] {
    return this.coherenceHistory.slice(-count);
  }

  addDataListener(callback: (data: BiofeedbackData, coherence: CoherenceMetrics) => void): () => void {
    this.listeners.push(callback);
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Meditation/breathing guidance
  getBreathingGuidance(): { inhale: number; exhale: number; hold: number } {
    const coherence = this.getLatestCoherence();
    if (!coherence) return { inhale: 4, exhale: 6, hold: 2 };

    // Adjust breathing based on coherence
    const baseRate = 12; // breaths per minute
    const coherenceAdjustment = (coherence.overallCoherence - 50) / 50; // -1 to 1
    const adjustedRate = baseRate * (1 + coherenceAdjustment * 0.2);

    // Convert to 4-7-8 breathing pattern
    const cycleTime = 60 / adjustedRate;
    return {
      inhale: Math.round(cycleTime * 0.3),
      exhale: Math.round(cycleTime * 0.5),
      hold: Math.round(cycleTime * 0.2)
    };
  }

  // Resonance training suggestions
  getResonanceSuggestions(): string[] {
    const coherence = this.getLatestCoherence();
    if (!coherence) return ['Focus on deep, rhythmic breathing'];

    const suggestions = [];

    if (coherence.physiologicalSync < 60) {
      suggestions.push('Synchronize your breathing with your heartbeat');
    }

    if (coherence.neurologicalFlow < 60) {
      suggestions.push('Try to maintain a calm, focused mind state');
    }

    if (coherence.behavioralStability < 60) {
      suggestions.push('Minimize physical movement for better coherence');
    }

    if (coherence.environmentalHarmony < 60) {
      suggestions.push('Find a quieter, more comfortable environment');
    }

    if (suggestions.length === 0) {
      suggestions.push('Excellent coherence! Try to maintain this state.');
    }

    return suggestions;
  }
}

export default BiofeedbackService;