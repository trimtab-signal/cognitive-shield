/**
 * HAPTIC FEEDBACK
 * Vagus nerve signaling via 4-4-8 breathing rhythm
 * Uses native bridge for platform-specific vibration
 */

import { triggerNativeHaptic } from './native-bridge';

/**
 * Trigger haptic vibration pattern for 4-4-8 breathing
 * 
 * Pattern:
 * - 4 seconds: Vibrate (inhale signal)
 * - 4 seconds: Pause (hold)
 * - 8 seconds: Vibrate (exhale signal)
 * 
 * Repeats for specified number of cycles
 */
export async function triggerVagusSignal(cycles: number = 5): Promise<void> {
  const pattern = [4, 4, 8]; // Seconds for native APIs
  
  for (let i = 0; i < cycles; i++) {
    await triggerNativeHaptic(pattern);
    
    // Brief pause between cycles
    if (i < cycles - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

/**
 * Trigger single haptic pulse (for button feedback)
 */
export async function triggerHapticPulse(intensity: 'light' | 'medium' | 'strong' = 'medium'): Promise<void> {
  const patterns = {
    light: [0.1], // 100ms
    medium: [0.2], // 200ms
    strong: [0.5], // 500ms
  };

  await triggerNativeHaptic(patterns[intensity]);
}

