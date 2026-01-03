/**
 * Moon Phase Calculator
 * 
 * The Moon has been humanity's first clock, first calendar, first connection
 * to cycles beyond the self. This module calculates lunar phase and provides
 * guidance for ritual timing.
 * 
 * "As above, so below. As within, so without."
 */

export interface MoonPhaseData {
  phase: MoonPhase;
  phaseName: string;
  illumination: number; // 0-100
  emoji: string;
  element: 'fire' | 'water' | 'earth' | 'air';
  energy: string;
  guidance: string;
  daysUntilFull: number;
  daysUntilNew: number;
}

export type MoonPhase = 
  | 'new'
  | 'waxing-crescent'
  | 'first-quarter'
  | 'waxing-gibbous'
  | 'full'
  | 'waning-gibbous'
  | 'third-quarter'
  | 'waning-crescent';

const LUNAR_CYCLE = 29.53059; // days
const KNOWN_NEW_MOON = new Date('2024-01-11T11:57:00Z').getTime(); // Known new moon

/**
 * Calculate the current moon phase
 */
export function getMoonPhase(date: Date = new Date()): MoonPhaseData {
  const now = date.getTime();
  const daysSinceKnown = (now - KNOWN_NEW_MOON) / (1000 * 60 * 60 * 24);
  const cyclePosition = ((daysSinceKnown % LUNAR_CYCLE) + LUNAR_CYCLE) % LUNAR_CYCLE;
  const phasePercent = cyclePosition / LUNAR_CYCLE;
  
  // Calculate illumination (0 at new, 100 at full, back to 0)
  const illumination = Math.round(
    phasePercent <= 0.5 
      ? phasePercent * 2 * 100 
      : (1 - phasePercent) * 2 * 100
  );
  
  // Days until full (around day 14.76) and new (day 0/29.53)
  const daysUntilFull = cyclePosition <= LUNAR_CYCLE / 2 
    ? (LUNAR_CYCLE / 2) - cyclePosition 
    : LUNAR_CYCLE - cyclePosition + (LUNAR_CYCLE / 2);
  const daysUntilNew = LUNAR_CYCLE - cyclePosition;
  
  // Determine phase
  let phase: MoonPhase;
  let phaseName: string;
  let emoji: string;
  let element: 'fire' | 'water' | 'earth' | 'air';
  let energy: string;
  let guidance: string;
  
  if (phasePercent < 0.0625) {
    phase = 'new';
    phaseName = 'New Moon';
    emoji = '🌑';
    element = 'earth';
    energy = 'Void / Potential';
    guidance = 'Set intentions. Plant seeds in darkness. Begin new workings.';
  } else if (phasePercent < 0.1875) {
    phase = 'waxing-crescent';
    phaseName = 'Waxing Crescent';
    emoji = '🌒';
    element = 'fire';
    energy = 'Emergence / Hope';
    guidance = 'Take first steps. Build momentum. Trust the process.';
  } else if (phasePercent < 0.3125) {
    phase = 'first-quarter';
    phaseName = 'First Quarter';
    emoji = '🌓';
    element = 'fire';
    energy = 'Action / Challenge';
    guidance = 'Push through resistance. Make decisions. Assert boundaries.';
  } else if (phasePercent < 0.4375) {
    phase = 'waxing-gibbous';
    phaseName = 'Waxing Gibbous';
    emoji = '🌔';
    element = 'air';
    energy = 'Refinement / Patience';
    guidance = 'Adjust course. Perfect the work. Trust timing.';
  } else if (phasePercent < 0.5625) {
    phase = 'full';
    phaseName = 'Full Moon';
    emoji = '🌕';
    element = 'water';
    energy = 'Illumination / Manifestation';
    guidance = 'See clearly. Release what no longer serves. Celebrate completion.';
  } else if (phasePercent < 0.6875) {
    phase = 'waning-gibbous';
    phaseName = 'Waning Gibbous';
    emoji = '🌖';
    element = 'water';
    energy = 'Gratitude / Sharing';
    guidance = 'Give thanks. Teach what you\'ve learned. Distribute blessings.';
  } else if (phasePercent < 0.8125) {
    phase = 'third-quarter';
    phaseName = 'Third Quarter';
    emoji = '🌗';
    element = 'earth';
    energy = 'Release / Forgiveness';
    guidance = 'Let go. Forgive self and others. Clear space for the new.';
  } else {
    phase = 'waning-crescent';
    phaseName = 'Waning Crescent';
    emoji = '🌘';
    element = 'earth';
    energy = 'Rest / Surrender';
    guidance = 'Rest deeply. Surrender control. Trust the void before rebirth.';
  }
  
  return {
    phase,
    phaseName,
    illumination,
    emoji,
    element,
    energy,
    guidance,
    daysUntilFull: Math.round(daysUntilFull * 10) / 10,
    daysUntilNew: Math.round(daysUntilNew * 10) / 10,
  };
}

/**
 * Get the elemental correspondence for a vertex of the Tetrahedron
 */
export function getElementalVertex(vertex: 'you' | 'them' | 'context' | 'protocol'): {
  element: string;
  symbol: string;
  direction: string;
  color: string;
} {
  const correspondences = {
    you: {
      element: 'Fire',
      symbol: '🜂',
      direction: 'South',
      color: '#ff6b35',
    },
    them: {
      element: 'Water',
      symbol: '🜄',
      direction: 'West', 
      color: '#4ecdc4',
    },
    context: {
      element: 'Earth',
      symbol: '🜃',
      direction: 'North',
      color: '#95d5b2',
    },
    protocol: {
      element: 'Air',
      symbol: '🜁',
      direction: 'East',
      color: '#f4d35e',
    },
  };
  
  return correspondences[vertex];
}

/**
 * Get tarot correspondence for current system state
 */
export function getTarotGuidance(systemState: 'crisis' | 'transition' | 'stable' | 'growth'): {
  card: string;
  meaning: string;
  advice: string;
} {
  const cards = {
    crisis: {
      card: 'XVI — The Tower',
      meaning: 'Sudden change. Structures falling. Liberation through destruction.',
      advice: 'Do not resist the fall. The Tower clears what was built on false foundations. What remains is true.',
    },
    transition: {
      card: 'XIII — Death',
      meaning: 'Transformation. Endings that enable beginnings. The chrysalis.',
      advice: 'You are not dying. You are molting. The old skin must fall for the new form to emerge.',
    },
    stable: {
      card: 'XVII — The Star',
      meaning: 'Hope. Healing. Guidance in darkness. The light that remains when all else is gone.',
      advice: 'Pour your waters freely. You are a vessel, not a reservoir. Trust flows through you.',
    },
    growth: {
      card: 'XXI — The World',
      meaning: 'Completion. Integration. The dance at the center of the mandala.',
      advice: 'You have completed a cycle. Pause to honor it before beginning the next spiral.',
    },
  };
  
  return cards[systemState];
}

/**
 * Calculate auspicious timing for rituals
 */
export function getAuspiciousTiming(): {
  nextNewMoon: Date;
  nextFullMoon: Date;
  currentPhaseEnds: Date;
  recommendation: string;
} {
  const now = new Date();
  const moon = getMoonPhase(now);
  
  // Calculate next new and full moons
  const msPerDay = 1000 * 60 * 60 * 24;
  const nextNewMoon = new Date(now.getTime() + moon.daysUntilNew * msPerDay);
  const nextFullMoon = new Date(now.getTime() + moon.daysUntilFull * msPerDay);
  
  // Current phase ends (each phase is ~3.69 days)
  const phaseDuration = LUNAR_CYCLE / 8;
  const daysIntoPhase = (moon.daysUntilNew % phaseDuration);
  const daysUntilPhaseEnd = phaseDuration - daysIntoPhase;
  const currentPhaseEnds = new Date(now.getTime() + daysUntilPhaseEnd * msPerDay);
  
  // Generate recommendation based on current phase
  let recommendation: string;
  switch (moon.phase) {
    case 'new':
      recommendation = 'Optimal time for setting intentions and beginning new workings. The void is fertile.';
      break;
    case 'waxing-crescent':
    case 'first-quarter':
    case 'waxing-gibbous':
      recommendation = 'Moon is waxing (growing). Good for building, attracting, and increasing. Work with momentum.';
      break;
    case 'full':
      recommendation = 'Peak illumination. Optimal for manifestation, divination, and releasing what no longer serves.';
      break;
    case 'waning-gibbous':
    case 'third-quarter':
    case 'waning-crescent':
      recommendation = 'Moon is waning (diminishing). Good for releasing, banishing, and clearing. Work with the tide out.';
      break;
    default:
      recommendation = 'Trust your intuition.';
  }
  
  return {
    nextNewMoon,
    nextFullMoon,
    currentPhaseEnds,
    recommendation,
  };
}

