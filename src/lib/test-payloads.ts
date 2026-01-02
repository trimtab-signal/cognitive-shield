/**
 * FIRST LIGHT TEST PAYLOADS
 * High-arousal messages for impedance matching verification
 */

export interface TestPayload {
  readonly id: string;
  readonly label: string;
  readonly category: 'genre-error' | 'high-voltage' | 'passive-aggression' | 'rsd-trigger';
  readonly content: string;
  readonly expectedBLUF: string;
  readonly expectedVoltage: number;
  readonly expectedGenreError: boolean;
  readonly expectedSpoons: number;
}

export const FIRST_LIGHT_TEST_PAYLOADS: readonly TestPayload[] = [
  {
    id: 'test-1',
    label: 'Genre Error: Physics vs Poetics',
    category: 'genre-error',
    content: `Hey, I know you're probably busy but we REALLY need to talk about the project timeline. Everything feels so disconnected right now and I'm not sure if you understand how important this is to the team. Can we sync up ASAP?`,
    expectedBLUF: 'Sender is requesting a meeting to discuss project timeline concerns.',
    expectedVoltage: 0.5,
    expectedGenreError: true,
    expectedSpoons: 3,
  },
  {
    id: 'test-2',
    label: 'High Voltage: Hostility',
    category: 'high-voltage',
    content: `WHY HAVEN'T YOU RESPONDED YET??? I sent this THREE HOURS AGO. This is UNACCEPTABLE. You ALWAYS do this. We need to talk NOW.`,
    expectedBLUF: 'Sender is requesting an immediate response to a previous message.',
    expectedVoltage: 0.9,
    expectedGenreError: false,
    expectedSpoons: 5,
  },
  {
    id: 'test-3',
    label: 'Passive Aggression',
    category: 'passive-aggression',
    content: `As per my last email, I'm still waiting for your input. Obviously this isn't a priority for you, but it would be helpful if you could find the time.`,
    expectedBLUF: 'Sender is requesting input on a previous email.',
    expectedVoltage: 0.6,
    expectedGenreError: false,
    expectedSpoons: 3,
  },
  {
    id: 'test-4',
    label: 'RSD Trigger: Rejection Implication',
    category: 'rsd-trigger',
    content: `I'm disappointed that you didn't make it to the meeting. Everyone else was there. I guess you had better things to do.`,
    expectedBLUF: 'Sender is noting your absence from a meeting.',
    expectedVoltage: 0.7,
    expectedGenreError: false,
    expectedSpoons: 4,
  },
  {
    id: 'test-5',
    label: 'Low Voltage: Calm Request',
    category: 'genre-error',
    content: `Hi! When you have a moment, could you review the attached document? No rush, just whenever works for you. Thanks!`,
    expectedBLUF: 'Sender is requesting a document review when convenient.',
    expectedVoltage: 0.2,
    expectedGenreError: false,
    expectedSpoons: 1,
  },
] as const;

/**
 * Get test payload by ID
 */
export function getTestPayload(id: string): TestPayload | undefined {
  return FIRST_LIGHT_TEST_PAYLOADS.find((p) => p.id === id);
}

/**
 * Get all test payloads
 */
export function getAllTestPayloads(): readonly TestPayload[] {
  return FIRST_LIGHT_TEST_PAYLOADS;
}

