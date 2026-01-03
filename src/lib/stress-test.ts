/**
 * STRESS TEST PAYLOAD GENERATOR
 * Simulates high-voltage incoming data to test Catcher's Mitt and Deep Processing Queue
 */

import useShieldStore from '../store/shield.store';

export interface StressTestPayload {
  readonly id: string;
  readonly label: string;
  readonly rawText: string;
  readonly expectedSpoons: number;
  readonly expectedVoltage: 'LOW' | 'MEDIUM' | 'HIGH';
  readonly expectedGenreError: boolean;
  readonly description: string;
}

export const stressTestPayloads: readonly StressTestPayload[] = [
  {
    id: 'st-001',
    label: 'High-Voltage Emotional (Poetics)',
    rawText: "WHY HAVEN'T YOU RESPONDED?? I'VE BEEN WAITING FOR HOURS AND THIS IS COMPLETELY UNACCEPTABLE!!!!",
    expectedSpoons: 4,
    expectedVoltage: 'HIGH',
    expectedGenreError: true,
    description: 'Tests Catcher\'s Mitt batching and Genre Error detection. Should trigger high voltage and emotional valence.',
  },
  {
    id: 'st-002',
    label: 'Complex Administrative (Physics)',
    rawText: 'Attached is the 40-page technical amendment regarding the isostatic rigidity requirements for the mesh. Review by EOD.',
    expectedSpoons: 5,
    expectedVoltage: 'LOW',
    expectedGenreError: false,
    description: 'Tests Spoon Costing for complex tasks. Should gate in Deep Processing Queue if status < 25%.',
  },
  {
    id: 'st-003',
    label: 'Passive-Aggressive Request',
    rawText: "I guess you're too busy to help with this. That's fine, I'll figure it out myself.",
    expectedSpoons: 3,
    expectedVoltage: 'MEDIUM',
    expectedGenreError: true,
    description: 'Tests Genre Error detection for passive-aggression. Should translate Poetics to Physics.',
  },
  {
    id: 'st-004',
    label: 'Machine Gun Effect (Rapid Fire)',
    rawText: 'Message 1\nMessage 2\nMessage 3\nMessage 4\nMessage 5',
    expectedSpoons: 2,
    expectedVoltage: 'LOW',
    expectedGenreError: false,
    description: 'Tests 60-second Catcher\'s Mitt batching. Multiple messages should batch together.',
  },
  {
    id: 'st-005',
    label: 'Urgent Deadline (High Arousal)',
    rawText: 'URGENT: This needs to be done NOW. No excuses. This is critical and cannot wait.',
    expectedSpoons: 4,
    expectedVoltage: 'HIGH',
    expectedGenreError: true,
    description: 'Tests Vacuum of Time delay. Should trigger 3-second delay before raw text reveal.',
  },
] as const;

/**
 * Inject a stress test payload into the Shield Store
 */
export function injectTestPayload(payloadId: string): void {
  const payload = stressTestPayloads.find((p) => p.id === payloadId);
  if (!payload) {
    console.error(`[STRESS TEST] Payload not found: ${payloadId}`);
    return;
  }

  console.log(`[STRESS TEST] Injecting: ${payload.label}`);
  console.log(`[STRESS TEST] Expected: ${payload.expectedSpoons} spoons, ${payload.expectedVoltage} voltage`);

  // Inject into the Shield Store
  const { ingestMessage } = useShieldStore.getState();
  ingestMessage(payload.rawText, `StressTest-${payloadId}`);
}

/**
 * Get all stress test payloads
 */
export function getAllStressTestPayloads(): readonly StressTestPayload[] {
  return stressTestPayloads;
}

/**
 * Get stress test payload by ID
 */
export function getStressTestPayload(payloadId: string): StressTestPayload | undefined {
  return stressTestPayloads.find((p) => p.id === payloadId);
}



