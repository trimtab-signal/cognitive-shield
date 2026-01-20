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
 * ║   HOT ROOTS DETECTOR - Real-Time Voltage Analysis                         ║
 * ║   "The roots are burning hot. Apply coolant before processing."           ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { useState, useEffect, useCallback } from 'react';

export interface HotRootsState {
  isHot: boolean;
  temperature: number; // 0-100 (100 = thermal runaway)
  phase: 'cool' | 'warm' | 'hot' | 'burning';
  recommendation: string;
  cooldownRemaining: number; // seconds
}

// Voltage keywords that indicate "hot roots"
const HIGH_VOLTAGE_PATTERNS = [
  // Absolutisms
  /\balways\b/i, /\bnever\b/i, /\beveryone\b/i, /\bno one\b/i,
  // Character attacks
  /\byou are\b.*\b(terrible|horrible|awful|worst|selfish|lazy|stupid|crazy)\b/i,
  // Guilt triggers
  /\bif you really\b/i, /\bif you loved\b/i, /\byou should\b/i, /\byou must\b/i,
  // Demands
  /\bright now\b/i, /\bimmediately\b/i, /\bor else\b/i,
  // ALL CAPS (shouting)
  /[A-Z]{5,}/,
  // Multiple exclamation/question marks
  /[!?]{2,}/,
  // Threats
  /\bi'm done\b/i, /\bi'm leaving\b/i, /\bdivorce\b/i, /\blawyer\b/i,
  // Dismissals
  /\bwhatever\b/i, /\bfine\b/i, /\bi don't care\b/i,
];

const COOLING_PATTERNS = [
  // Softeners
  /\bI feel\b/i, /\bI think\b/i, /\bmaybe\b/i, /\bperhaps\b/i,
  // Connection attempts
  /\blove you\b/i, /\bmiss you\b/i, /\bthank you\b/i,
  // Repair attempts
  /\bsorry\b/i, /\bapologize\b/i, /\bmy fault\b/i,
  // Questions (not demands)
  /\bcan we\b/i, /\bwould you\b/i, /\bcould we\b/i,
];

export function analyzeVoltage(text: string): number {
  let voltage = 0;
  
  // Check high voltage patterns
  for (const pattern of HIGH_VOLTAGE_PATTERNS) {
    if (pattern.test(text)) {
      voltage += 15;
    }
  }
  
  // Check cooling patterns
  for (const pattern of COOLING_PATTERNS) {
    if (pattern.test(text)) {
      voltage -= 10;
    }
  }
  
  // Length modifier - very short messages can be terse
  if (text.length < 20 && text.includes('!')) {
    voltage += 10;
  }
  
  // Very long messages might indicate dumping
  if (text.length > 500) {
    voltage += 5;
  }
  
  // Clamp to 0-100
  return Math.max(0, Math.min(100, voltage));
}

export function getPhase(temperature: number): 'cool' | 'warm' | 'hot' | 'burning' {
  if (temperature < 25) return 'cool';
  if (temperature < 50) return 'warm';
  if (temperature < 75) return 'hot';
  return 'burning';
}

export function getRecommendation(phase: 'cool' | 'warm' | 'hot' | 'burning'): string {
  switch (phase) {
    case 'cool':
      return 'Safe to process. Low voltage detected.';
    case 'warm':
      return 'Proceed with caution. Engage "Liquid" (listening) first.';
    case 'hot':
      return '⚠️ HOT ROOTS DETECTED. Apply coolant. Do not respond yet.';
    case 'burning':
      return '🚨 THERMAL RUNAWAY. Full stop. Engage circuit breaker. Wait 24 hours.';
  }
}

export function getCooldownTime(phase: 'cool' | 'warm' | 'hot' | 'burning'): number {
  switch (phase) {
    case 'cool': return 0;
    case 'warm': return 60; // 1 minute
    case 'hot': return 300; // 5 minutes
    case 'burning': return 86400; // 24 hours
  }
}

export function useHotRootsDetector() {
  const [state, setState] = useState<HotRootsState>({
    isHot: false,
    temperature: 0,
    phase: 'cool',
    recommendation: getRecommendation('cool'),
    cooldownRemaining: 0
  });
  
  const [cooldownEnd, setCooldownEnd] = useState<Date | null>(null);

  // Countdown timer
  useEffect(() => {
    if (!cooldownEnd) return;
    
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((cooldownEnd.getTime() - Date.now()) / 1000));
      setState(prev => ({ ...prev, cooldownRemaining: remaining }));
      
      if (remaining <= 0) {
        setCooldownEnd(null);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [cooldownEnd]);

  const analyze = useCallback((text: string) => {
    const temperature = analyzeVoltage(text);
    const phase = getPhase(temperature);
    const recommendation = getRecommendation(phase);
    const cooldownTime = getCooldownTime(phase);
    
    if (cooldownTime > 0) {
      setCooldownEnd(new Date(Date.now() + cooldownTime * 1000));
    }
    
    setState({
      isHot: phase === 'hot' || phase === 'burning',
      temperature,
      phase,
      recommendation,
      cooldownRemaining: cooldownTime
    });
    
    return { temperature, phase, recommendation };
  }, []);

  const reset = useCallback(() => {
    setState({
      isHot: false,
      temperature: 0,
      phase: 'cool',
      recommendation: getRecommendation('cool'),
      cooldownRemaining: 0
    });
    setCooldownEnd(null);
  }, []);

  return { state, analyze, reset };
}

// Color mapping for UI
export function getTemperatureColor(phase: 'cool' | 'warm' | 'hot' | 'burning'): string {
  switch (phase) {
    case 'cool': return '#3498db';
    case 'warm': return '#f39c12';
    case 'hot': return '#e74c3c';
    case 'burning': return '#8e44ad';
  }
}

export default useHotRootsDetector;
