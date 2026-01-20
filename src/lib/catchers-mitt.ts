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
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║   THE CATCHER'S MITT                                                       ║
 * ║   60-Second Message Buffering & Voltage Protection                         ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 * 
 * Implements strategic latency to protect against "Machine Gun Effect" of
 * rapid-fire notifications that trigger amygdala hijack responses.
 * 
 * The Mitt catches high-voltage messages and holds them in a buffer,
 * allowing the prefrontal cortex time to prepare for engagement.
 */

// Spiral Dynamics color types (matches gensync-matrix)
export type SpiralColor = 'beige' | 'purple' | 'red' | 'blue' | 'orange' | 'green' | 'yellow' | 'turquoise';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

export interface BufferedMessage {
  id: string;
  content: string;
  sender: string;
  receivedAt: number;
  releaseAt: number;
  voltage: number;            // 0-100 emotional intensity
  entropy: number;            // 0-1 informational chaos
  toxicity: number;           // 0-1 harmful content score
  spiralColor: SpiralColor;   // Sender's detected vMEME
  status: 'buffered' | 'released' | 'filtered' | 'escalated';
  sanitizedContent?: string;  // LLM-rewritten version
  metadata: MessageMetadata;
}

export interface MessageMetadata {
  channel: 'email' | 'sms' | 'mesh' | 'direct';
  priority: 'low' | 'normal' | 'high' | 'emergency';
  threadId?: string;
  attachments: number;
  replyTo?: string;
}

export interface VoltageThresholds {
  /** Below this = green, auto-release */
  green: number;
  /** Yellow = buffer for full period */
  yellow: number;
  /** Red = require sanitization before release */
  red: number;
  /** Critical = escalate to guardian/trusted node */
  critical: number;
}

export interface MittConfig {
  /** Buffer duration in milliseconds (default: 60000) */
  bufferDuration: number;
  /** Voltage thresholds for triage */
  thresholds: VoltageThresholds;
  /** Maximum messages in buffer */
  maxBufferSize: number;
  /** Enable auto-sanitization for red+ messages */
  autoSanitize: boolean;
  /** Trusted senders that bypass buffer */
  whitelist: string[];
  /** Blocked senders that auto-filter */
  blacklist: string[];
}

export interface MittState {
  buffer: BufferedMessage[];
  released: BufferedMessage[];
  filtered: BufferedMessage[];
  stats: MittStats;
}

export interface MittStats {
  totalReceived: number;
  totalReleased: number;
  totalFiltered: number;
  averageVoltage: number;
  peakVoltage: number;
  voltageHistory: number[];
}

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const DEFAULT_CONFIG: MittConfig = {
  bufferDuration: 60000, // 60 seconds
  thresholds: {
    green: 30,    // Calm, friendly
    yellow: 50,   // Neutral, slightly stressed
    red: 70,      // Hostile, angry
    critical: 90, // Threatening, dangerous
  },
  maxBufferSize: 100,
  autoSanitize: true,
  whitelist: [],
  blacklist: [],
};

// ═══════════════════════════════════════════════════════════════════════════
// VOLTAGE ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Analyze message voltage (emotional intensity)
 * Combines multiple signals for holistic assessment
 */
export function analyzeVoltage(content: string): {
  voltage: number;
  entropy: number;
  toxicity: number;
} {
  const normalized = content.toLowerCase();
  
  // Voltage indicators (emotional intensity)
  const capsRatio = (content.match(/[A-Z]/g) || []).length / content.length;
  const exclamationCount = (content.match(/!/g) || []).length;
  const questionCount = (content.match(/\?{2,}/g) || []).length;
  const ellipsisCount = (content.match(/\.{3,}/g) || []).length;
  
  // High-voltage words (ellipsis indicates hesitation/passive-aggression)
  const voltageWords = [
    'angry', 'furious', 'hate', 'stupid', 'idiot', 'never', 'always',
    'wrong', 'fault', 'blame', 'disgusting', 'pathetic', 'worthless',
    'disappointed', 'unbelievable', 'ridiculous', 'terrible', 'horrible'
  ];
  
  const voltageWordCount = voltageWords.reduce((count, word) => 
    count + (normalized.includes(word) ? 1 : 0), 0
  );
  
  // Calculate base voltage
  let voltage = 20; // Baseline
  voltage += capsRatio * 30;
  voltage += exclamationCount * 5;
  voltage += questionCount * 10;
  voltage += voltageWordCount * 8;
  voltage += ellipsisCount * 3; // Passive-aggression indicator
  voltage = Math.min(100, Math.max(0, voltage));
  
  // Entropy (informational chaos)
  const wordCount = content.split(/\s+/).length;
  const uniqueWords = new Set(normalized.split(/\s+/)).size;
  const entropy = wordCount > 0 ? uniqueWords / wordCount : 0;
  
  // Toxicity (harmful content)
  const toxicPatterns = [
    /\b(kill|die|hurt|destroy)\b/i,
    /\b(stupid|dumb|idiot|moron)\b/i,
    /\b(hate|despise|loathe)\b/i,
    /\b(never.*again)\b/i,
    /\b(your fault|blame you)\b/i,
  ];
  
  const toxicMatches = toxicPatterns.reduce((count, pattern) =>
    count + (pattern.test(content) ? 1 : 0), 0
  );
  
  const toxicity = Math.min(1, toxicMatches / 5);
  
  return { voltage, entropy, toxicity };
}

/**
 * Detect sender's Spiral Dynamics vMEME from message
 */
export function detectSpiralColor(content: string): SpiralColor {
  const lower = content.toLowerCase();
  
  // Purple (tribal/safety) patterns
  if (/\b(we've always|tradition|family|ancestors|protect)\b/.test(lower)) {
    return 'purple';
  }
  
  // Red (power/dominance) patterns
  if (/\b(i want|give me|now|immediately|do it|or else)\b/.test(lower)) {
    return 'red';
  }
  
  // Blue (order/authority) patterns
  if (/\b(rules|policy|procedure|supposed to|should|duty)\b/.test(lower)) {
    return 'blue';
  }
  
  // Orange (achievement) patterns
  if (/\b(success|winning|best|optimize|efficient|results)\b/.test(lower)) {
    return 'orange';
  }
  
  // Green (harmony) patterns
  if (/\b(feelings|community|together|share|inclusive|consensus)\b/.test(lower)) {
    return 'green';
  }
  
  // Yellow (integrative) patterns
  if (/\b(systems|perspective|complexity|flow|natural|functional)\b/.test(lower)) {
    return 'yellow';
  }
  
  // Default to blue (most common in formal communication)
  return 'blue';
}

// ═══════════════════════════════════════════════════════════════════════════
// VOLTAGE STRIP VISUALIZATION
// ═══════════════════════════════════════════════════════════════════════════

export interface VoltageStripData {
  current: number;
  trend: 'rising' | 'stable' | 'falling';
  color: 'green' | 'yellow' | 'orange' | 'red';
  label: string;
}

export function getVoltageStrip(
  voltage: number,
  history: number[] = []
): VoltageStripData {
  // Determine color based on voltage
  let color: VoltageStripData['color'];
  let label: string;
  
  if (voltage < 30) {
    color = 'green';
    label = 'Calm Waters';
  } else if (voltage < 50) {
    color = 'yellow';
    label = 'Slight Turbulence';
  } else if (voltage < 70) {
    color = 'orange';
    label = 'High Alert';
  } else {
    color = 'red';
    label = 'Storm Warning';
  }
  
  // Determine trend
  let trend: VoltageStripData['trend'] = 'stable';
  if (history.length >= 3) {
    const recent = history.slice(-3);
    const avg1 = (recent[0] + recent[1]) / 2;
    const avg2 = (recent[1] + recent[2]) / 2;
    
    if (avg2 > avg1 + 5) trend = 'rising';
    else if (avg2 < avg1 - 5) trend = 'falling';
  }
  
  return { current: voltage, trend, color, label };
}

// ═══════════════════════════════════════════════════════════════════════════
// CATCHER'S MITT CLASS
// ═══════════════════════════════════════════════════════════════════════════

export class CatchersMitt {
  private config: MittConfig;
  private state: MittState;
  private releaseTimer: ReturnType<typeof setInterval> | null = null;
  private onRelease?: (message: BufferedMessage) => void;
  private onFilter?: (message: BufferedMessage) => void;

  constructor(config?: Partial<MittConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.state = {
      buffer: [],
      released: [],
      filtered: [],
      stats: {
        totalReceived: 0,
        totalReleased: 0,
        totalFiltered: 0,
        averageVoltage: 0,
        peakVoltage: 0,
        voltageHistory: [],
      },
    };
    
    // Start release timer
    this.startReleaseTimer();
  }

  /**
   * Catch an incoming message
   */
  catch(
    content: string,
    sender: string,
    metadata: Partial<MessageMetadata> = {}
  ): BufferedMessage {
    const now = Date.now();
    const analysis = analyzeVoltage(content);
    
    const message: BufferedMessage = {
      id: crypto.randomUUID(),
      content,
      sender,
      receivedAt: now,
      releaseAt: now + this.config.bufferDuration,
      voltage: analysis.voltage,
      entropy: analysis.entropy,
      toxicity: analysis.toxicity,
      spiralColor: detectSpiralColor(content),
      status: 'buffered',
      metadata: {
        channel: 'direct',
        priority: 'normal',
        attachments: 0,
        ...metadata,
      },
    };
    
    // Update stats
    this.updateStats(analysis.voltage);
    
    // Check whitelist (bypass buffer)
    if (this.config.whitelist.includes(sender)) {
      message.status = 'released';
      message.releaseAt = now;
      this.state.released.push(message);
      this.state.stats.totalReleased++;
      this.onRelease?.(message);
      return message;
    }
    
    // Check blacklist (auto-filter)
    if (this.config.blacklist.includes(sender)) {
      message.status = 'filtered';
      this.state.filtered.push(message);
      this.state.stats.totalFiltered++;
      this.onFilter?.(message);
      return message;
    }
    
    // Triage based on voltage
    if (analysis.voltage < this.config.thresholds.green) {
      // Green: Release immediately
      message.status = 'released';
      message.releaseAt = now;
      this.state.released.push(message);
      this.state.stats.totalReleased++;
      this.onRelease?.(message);
    } else if (analysis.voltage >= this.config.thresholds.critical) {
      // Critical: Escalate to guardian
      message.status = 'escalated';
      this.state.buffer.push(message);
    } else {
      // Yellow/Red: Buffer for strategic latency
      this.state.buffer.push(message);
      
      // Enforce buffer size limit
      if (this.state.buffer.length > this.config.maxBufferSize) {
        const oldest = this.state.buffer.shift();
        if (oldest) {
          oldest.status = 'released';
          this.state.released.push(oldest);
          this.state.stats.totalReleased++;
          this.onRelease?.(oldest);
        }
      }
    }
    
    return message;
  }

  /**
   * Process buffered messages for release
   */
  private processBuffer(): void {
    const now = Date.now();
    const toRelease: BufferedMessage[] = [];
    
    this.state.buffer = this.state.buffer.filter(msg => {
      if (msg.status === 'escalated') {
        return true; // Keep escalated messages
      }
      
      if (now >= msg.releaseAt) {
        toRelease.push(msg);
        return false;
      }
      return true;
    });
    
    for (const message of toRelease) {
      message.status = 'released';
      this.state.released.push(message);
      this.state.stats.totalReleased++;
      this.onRelease?.(message);
    }
  }

  /**
   * Start automatic release timer
   */
  private startReleaseTimer(): void {
    if (this.releaseTimer) return;
    
    this.releaseTimer = setInterval(() => {
      this.processBuffer();
    }, 1000);
  }

  /**
   * Stop the release timer
   */
  stop(): void {
    if (this.releaseTimer) {
      clearInterval(this.releaseTimer);
      this.releaseTimer = null;
    }
  }

  /**
   * Update voltage statistics
   */
  private updateStats(voltage: number): void {
    const stats = this.state.stats;
    stats.totalReceived++;
    stats.voltageHistory.push(voltage);
    
    // Keep only last 100 readings
    if (stats.voltageHistory.length > 100) {
      stats.voltageHistory.shift();
    }
    
    // Update average
    stats.averageVoltage = stats.voltageHistory.reduce((a, b) => a + b, 0) / 
                          stats.voltageHistory.length;
    
    // Update peak
    if (voltage > stats.peakVoltage) {
      stats.peakVoltage = voltage;
    }
  }

  /**
   * Set release callback
   */
  onMessageRelease(callback: (message: BufferedMessage) => void): void {
    this.onRelease = callback;
  }

  /**
   * Set filter callback
   */
  onMessageFilter(callback: (message: BufferedMessage) => void): void {
    this.onFilter = callback;
  }

  /**
   * Add sender to whitelist
   */
  whitelist(sender: string): void {
    if (!this.config.whitelist.includes(sender)) {
      this.config.whitelist.push(sender);
    }
  }

  /**
   * Add sender to blacklist
   */
  blacklist(sender: string): void {
    if (!this.config.blacklist.includes(sender)) {
      this.config.blacklist.push(sender);
    }
  }

  /**
   * Get current state
   */
  getState(): MittState {
    return this.state;
  }

  /**
   * Get voltage strip data
   */
  getVoltageStrip(): VoltageStripData {
    return getVoltageStrip(
      this.state.stats.averageVoltage,
      this.state.stats.voltageHistory
    );
  }

  /**
   * Get buffered messages
   */
  getBuffered(): BufferedMessage[] {
    return [...this.state.buffer];
  }

  /**
   * Manually release a message
   */
  release(messageId: string): BufferedMessage | null {
    const index = this.state.buffer.findIndex(m => m.id === messageId);
    if (index === -1) return null;
    
    const message = this.state.buffer.splice(index, 1)[0];
    message.status = 'released';
    this.state.released.push(message);
    this.state.stats.totalReleased++;
    this.onRelease?.(message);
    
    return message;
  }

  /**
   * Manually filter a message
   */
  filter(messageId: string): BufferedMessage | null {
    const index = this.state.buffer.findIndex(m => m.id === messageId);
    if (index === -1) return null;
    
    const message = this.state.buffer.splice(index, 1)[0];
    message.status = 'filtered';
    this.state.filtered.push(message);
    this.state.stats.totalFiltered++;
    this.onFilter?.(message);
    
    return message;
  }
}

export default CatchersMitt;
