/**
 * @license
 * Copyright 2026 Wonky Sprout DUNA
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/**
 * Element Information Database
 * Educational content for each element
 */

export interface ElementInfo {
  symbol: string;
  name: string;
  atomicNumber: number;
  mass: number;
  color: string;
  radius: number;
  category: string;
  description: string;
  funFacts: string[];
  whereFound: string;
  uses: string[];
  discovered: string;
}

export const ELEMENT_DATA: Record<string, ElementInfo> = {
  H: {
    symbol: 'H',
    name: 'Hydrogen',
    atomicNumber: 1,
    mass: 1,
    color: '#FFFFFF',
    radius: 0.25,
    category: 'Nonmetal',
    description: 'The lightest and most abundant element in the universe. Found in water and all living things.',
    funFacts: [
      'Makes up 75% of all matter in the universe!',
      'Powers the Sun through fusion',
      'Your body is about 10% hydrogen by weight',
      'Burns with an invisible flame',
    ],
    whereFound: 'Water (H₂O), all organic molecules, stars, gas clouds',
    uses: [
      'Rocket fuel',
      'Making ammonia for fertilizer',
      'Fuel cells for clean energy',
      'Hydrogenating oils in food',
    ],
    discovered: '1766 by Henry Cavendish',
  },
  
  C: {
    symbol: 'C',
    name: 'Carbon',
    atomicNumber: 6,
    mass: 12,
    color: '#909090',
    radius: 0.4,
    category: 'Nonmetal',
    description: 'The backbone of all life on Earth. Can form millions of different molecules.',
    funFacts: [
      'Every living thing contains carbon!',
      'Forms diamonds and graphite (pencil lead)',
      'Can bond with itself to make long chains',
      'Makes up only 0.025% of Earth\'s crust',
    ],
    whereFound: 'All living things, fossil fuels, diamonds, graphite, CO₂ in air',
    uses: [
      'Steel production',
      'Plastics and synthetic materials',
      'Carbon fiber (strong and light)',
      'Pencils, activated charcoal filters',
    ],
    discovered: 'Ancient (known since prehistoric times)',
  },
  
  N: {
    symbol: 'N',
    name: 'Nitrogen',
    atomicNumber: 7,
    mass: 14,
    color: '#3050F8',
    radius: 0.35,
    category: 'Nonmetal',
    description: 'Makes up 78% of Earth\'s atmosphere. Essential for proteins and DNA.',
    funFacts: [
      'The air you breathe is mostly nitrogen!',
      'Lightning converts nitrogen into fertilizer',
      'Liquid nitrogen is super cold: -196°C',
      'All proteins contain nitrogen',
    ],
    whereFound: 'Air (78%), proteins, DNA, fertilizers, explosives',
    uses: [
      'Fertilizers for growing food',
      'Preserving food (freezing)',
      'Making ammonia and nitric acid',
      'Inflating tires and airbags',
    ],
    discovered: '1772 by Daniel Rutherford',
  },
  
  O: {
    symbol: 'O',
    name: 'Oxygen',
    atomicNumber: 8,
    mass: 16,
    color: '#FF0D0D',
    radius: 0.35,
    category: 'Nonmetal',
    description: 'Essential for breathing and burning. The third most abundant element in the universe.',
    funFacts: [
      'You need it to stay alive!',
      'Makes up 21% of the air',
      'About 65% of your body is oxygen',
      'Produced by plants during photosynthesis',
    ],
    whereFound: 'Air (21%), water (H₂O), rocks, all living things',
    uses: [
      'Breathing (respiration)',
      'Hospitals (oxygen therapy)',
      'Rocket oxidizer',
      'Water treatment',
    ],
    discovered: '1774 by Joseph Priestley',
  },
  
  P: {
    symbol: 'P',
    name: 'Phosphorus',
    atomicNumber: 15,
    mass: 31,
    color: '#FF8000',
    radius: 0.45,
    category: 'Nonmetal',
    description: 'Essential for energy (ATP) and bones. Glows in the dark!',
    funFacts: [
      'Its name means "light bearer" - it glows!',
      'Your bones and teeth are mostly calcium phosphate',
      'ATP (energy molecule) has 3 phosphorus atoms',
      'Was discovered in urine!',
    ],
    whereFound: 'Bones, teeth, DNA, ATP (energy molecule), matches',
    uses: [
      'Fertilizers (helps plants grow)',
      'Matches and fireworks',
      'Detergents',
      'Food additives (sodas)',
    ],
    discovered: '1669 by Hennig Brand (from urine!)',
  },
  
  S: {
    symbol: 'S',
    name: 'Sulfur',
    atomicNumber: 16,
    mass: 32,
    color: '#FFFF30',
    radius: 0.45,
    category: 'Nonmetal',
    description: 'Yellow powder that smells like rotten eggs. Important for proteins.',
    funFacts: [
      'Found near volcanoes',
      'Makes the "rotten egg" smell',
      'Burns with a blue flame',
      'Ancient people used it as medicine',
    ],
    whereFound: 'Volcanoes, hot springs, proteins, garlic, onions',
    uses: [
      'Making sulfuric acid (most produced chemical!)',
      'Gunpowder',
      'Rubber (vulcanization)',
      'Fertilizers and fungicides',
    ],
    discovered: 'Ancient (known since prehistoric times)',
  },
  
  Ca: {
    symbol: 'Ca',
    name: 'Calcium',
    atomicNumber: 20,
    mass: 40,
    color: '#3DFF00',
    radius: 0.5,
    category: 'Alkaline Earth Metal',
    description: 'Makes your bones and teeth strong. Essential for muscle contraction.',
    funFacts: [
      'Your body has about 1kg of calcium!',
      'Makes bones and teeth hard',
      'Milk is a good source of calcium',
      'Needed for your heart to beat',
    ],
    whereFound: 'Bones, teeth, milk, cheese, limestone, marble',
    uses: [
      'Dietary supplement',
      'Cement and mortar',
      'Antacids (Tums)',
      'Alloys and steel',
    ],
    discovered: '1808 by Sir Humphry Davy',
  },
  
  Fe: {
    symbol: 'Fe',
    name: 'Iron',
    atomicNumber: 26,
    mass: 56,
    color: '#E06633',
    radius: 0.45,
    category: 'Transition Metal',
    description: 'The most common element on Earth. Makes blood red and steel strong.',
    funFacts: [
      'Your blood is red because of iron!',
      'Earth\'s core is mostly iron',
      'Most abundant element on Earth (by mass)',
      'Rusts when it meets water and oxygen',
    ],
    whereFound: 'Blood (hemoglobin), Earth\'s core, steel, rust',
    uses: [
      'Steel (buildings, cars, tools)',
      'Hemoglobin (carries oxygen in blood)',
      'Magnets',
      'Cast iron cookware',
    ],
    discovered: 'Ancient (used since ~5000 BC)',
  },
  
  Mg: {
    symbol: 'Mg',
    name: 'Magnesium',
    atomicNumber: 12,
    mass: 24,
    color: '#8AFF00',
    radius: 0.45,
    category: 'Alkaline Earth Metal',
    description: 'Burns with a brilliant white light. Essential for plants (chlorophyll).',
    funFacts: [
      'At the heart of every chlorophyll molecule!',
      'Burns so bright it can damage your eyes',
      'Used in fireworks for white sparkles',
      'Your body needs it for 300+ reactions',
    ],
    whereFound: 'Chlorophyll (makes plants green), seawater, Epsom salts',
    uses: [
      'Fireworks and flares (bright white light)',
      'Lightweight alloys (cars, planes)',
      'Dietary supplement',
      'Antacids',
    ],
    discovered: '1808 by Sir Humphry Davy',
  },
  
  Cl: {
    symbol: 'Cl',
    name: 'Chlorine',
    atomicNumber: 17,
    mass: 35,
    color: '#1FF01F',
    radius: 0.4,
    category: 'Halogen',
    description: 'Greenish gas that kills germs. Found in table salt (NaCl).',
    funFacts: [
      'Makes swimming pools smell "clean"',
      'Table salt is sodium + chlorine!',
      'Was used as a weapon in WWI (poison gas)',
      'Kills bacteria in drinking water',
    ],
    whereFound: 'Table salt (NaCl), bleach, PVC plastic, pool water',
    uses: [
      'Disinfecting water',
      'Bleach for cleaning',
      'Making PVC plastic',
      'Table salt (with sodium)',
    ],
    discovered: '1774 by Carl Wilhelm Scheele',
  },
};

export function getElementInfo(symbol: string): ElementInfo | null {
  return ELEMENT_DATA[symbol] || null;
}

export function getRandomFact(symbol: string): string | null {
  const info = getElementInfo(symbol);
  if (!info || info.funFacts.length === 0) return null;
  return info.funFacts[Math.floor(Math.random() * info.funFacts.length)];
}
