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
 * ╔═══════════════════════════════════════════════════════════════════════════════╗
 * ║                        🔬 SCIENCE LAB 🧪                                       ║
 * ║               Where curiosity meets discovery                                   ║
 * ║                                                                                 ║
 * ║  "Ask why. Then ask why again. Keep asking until you find wonder."             ║
 * ║                                                            - Dad 💜            ║
 * ╚═══════════════════════════════════════════════════════════════════════════════╝
 * 
 * EASTER EGGS:
 * - Mix H2O + Fire = Steam rainbow 🌈
 * - Mix all primaries = Secret discovery
 * - Click the beaker 7 times for a surprise!
 */

import { useState, useCallback } from 'react';

// Lab elements to mix
interface Element {
  id: string;
  name: string;
  emoji: string;
  color: string;
  category: 'liquid' | 'solid' | 'energy' | 'special';
}

interface Reaction {
  elements: [string, string];
  result: {
    name: string;
    emoji: string;
    color: string;
    fact: string;
    special?: boolean;
  };
}

const ELEMENTS: Element[] = [
  { id: 'water', name: 'Water', emoji: '💧', color: '#3B82F6', category: 'liquid' },
  { id: 'fire', name: 'Fire', emoji: '🔥', color: '#EF4444', category: 'energy' },
  { id: 'earth', name: 'Earth', emoji: '🪨', color: '#78716C', category: 'solid' },
  { id: 'air', name: 'Wind', emoji: '💨', color: '#94A3B8', category: 'energy' },
  { id: 'plant', name: 'Plant', emoji: '🌱', color: '#22C55E', category: 'solid' },
  { id: 'sun', name: 'Sunlight', emoji: '☀️', color: '#FBBF24', category: 'energy' },
  { id: 'ice', name: 'Ice', emoji: '🧊', color: '#67E8F9', category: 'solid' },
  { id: 'electricity', name: 'Spark', emoji: '⚡', color: '#FACC15', category: 'energy' },
];

const REACTIONS: Reaction[] = [
  {
    elements: ['water', 'fire'],
    result: {
      name: 'Steam',
      emoji: '♨️',
      color: '#E2E8F0',
      fact: 'Water + Heat = Steam! When water gets hot enough, it turns into a gas and floats up into the air. This is how clouds are made!',
      special: true
    }
  },
  {
    elements: ['water', 'ice'],
    result: {
      name: 'Frost',
      emoji: '❄️',
      color: '#BAE6FD',
      fact: 'Water can freeze into ice, and ice can melt back into water. The freezing point is 32°F or 0°C!'
    }
  },
  {
    elements: ['plant', 'sun'],
    result: {
      name: 'Photosynthesis',
      emoji: '🌿',
      color: '#4ADE80',
      fact: 'Plants eat sunlight! Through photosynthesis, they turn sunlight, water, and CO2 into food and oxygen for us to breathe!'
    }
  },
  {
    elements: ['water', 'plant'],
    result: {
      name: 'Growth',
      emoji: '🌳',
      color: '#16A34A',
      fact: 'Plants drink water through their roots and it travels all the way up to their leaves. A big tree can drink 100 gallons a day!'
    }
  },
  {
    elements: ['fire', 'air'],
    result: {
      name: 'Wind Storm',
      emoji: '🌪️',
      color: '#F97316',
      fact: 'Hot air rises and cold air rushes in to fill the space. This creates wind! Really big temperature differences can make tornadoes!'
    }
  },
  {
    elements: ['water', 'air'],
    result: {
      name: 'Cloud',
      emoji: '☁️',
      color: '#F1F5F9',
      fact: 'Clouds are made of tiny water droplets floating in the air. A single cloud can weigh over a million pounds!'
    }
  },
  {
    elements: ['ice', 'sun'],
    result: {
      name: 'Rainbow',
      emoji: '🌈',
      color: '#A855F7',
      fact: 'When sunlight passes through water droplets, it splits into all its colors! Each color bends at a different angle.',
      special: true
    }
  },
  {
    elements: ['earth', 'water'],
    result: {
      name: 'Mud',
      emoji: '🟤',
      color: '#92400E',
      fact: 'Some creatures like earthworms love mud! It helps plants grow by holding nutrients and water in the soil.'
    }
  },
  {
    elements: ['electricity', 'water'],
    result: {
      name: 'Electrolysis',
      emoji: '💡',
      color: '#FDE047',
      fact: 'Electricity can split water into hydrogen and oxygen! Scientists use this to make clean fuel for rockets!'
    }
  },
  {
    elements: ['fire', 'earth'],
    result: {
      name: 'Lava',
      emoji: '🌋',
      color: '#DC2626',
      fact: 'Deep underground, rocks get so hot they melt into lava! The center of Earth is hotter than the surface of the Sun!'
    }
  },
  {
    elements: ['electricity', 'air'],
    result: {
      name: 'Lightning',
      emoji: '🌩️',
      color: '#7C3AED',
      fact: 'Lightning is 5 times hotter than the surface of the sun! It heats the air so fast it makes the sound we call thunder.'
    }
  },
];

// Find reaction for two elements
function findReaction(a: string, b: string): Reaction['result'] | null {
  const reaction = REACTIONS.find(
    r => (r.elements[0] === a && r.elements[1] === b) ||
         (r.elements[0] === b && r.elements[1] === a)
  );
  return reaction?.result || null;
}

export function ScienceLab() {
  const [selected, setSelected] = useState<string[]>([]);
  const [result, setResult] = useState<Reaction['result'] | null>(null);
  const [discoveries, setDiscoveries] = useState<Set<string>>(new Set());
  const [beakerClicks, setBeakerClicks] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [showReaction, setShowReaction] = useState(false);

  const handleElementClick = useCallback((elementId: string) => {
    if (selected.includes(elementId)) {
      setSelected(selected.filter(id => id !== elementId));
      return;
    }
    
    if (selected.length < 2) {
      const newSelected = [...selected, elementId];
      setSelected(newSelected);
      
      // Check for reaction when 2 elements selected
      if (newSelected.length === 2) {
        const reactionResult = findReaction(newSelected[0], newSelected[1]);
        if (reactionResult) {
          setShowReaction(true);
          setTimeout(() => {
            setResult(reactionResult);
            setDiscoveries(prev => new Set([...prev, reactionResult.name]));
            setShowReaction(false);
          }, 1000);
        } else {
          setResult({
            name: 'No Reaction',
            emoji: '🤔',
            color: '#6B7280',
            fact: 'Hmm, these elements don\'t react together. Try a different combination!'
          });
        }
      }
    }
  }, [selected]);

  const reset = () => {
    setSelected([]);
    setResult(null);
  };

  const handleBeakerClick = () => {
    const newCount = beakerClicks + 1;
    setBeakerClicks(newCount);
    
    if (newCount === 7) {
      setShowEasterEgg(true);
      setTimeout(() => setShowEasterEgg(false), 5000);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
      padding: '24px',
      background: 'linear-gradient(135deg, #1F2937 0%, #0F172A 100%)',
      borderRadius: '20px',
      border: '1px solid #374151',
      minHeight: '450px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Bubbles background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(circle at 20% 80%, #3B82F620 0%, transparent 40%),
                     radial-gradient(circle at 80% 20%, #22C55E20 0%, transparent 40%)`,
        pointerEvents: 'none',
      }} />

      {/* Easter egg popup */}
      {showEasterEgg && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(139, 92, 246, 0.95)',
          color: 'white',
          padding: '24px',
          borderRadius: '16px',
          zIndex: 100,
          textAlign: 'center',
          animation: 'fadeIn 0.5s ease-out',
          maxWidth: '280px',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🧪💜🔬</div>
          <div style={{ fontSize: '16px', fontWeight: 700 }}>
            You found a secret!
          </div>
          <div style={{ fontSize: '14px', marginTop: '8px' }}>
            "The most exciting phrase in science is not 'Eureka!' but 'That's funny...'"
            <br /><br />
            Keep being curious. The universe has so many secrets waiting just for you.
            <br />
            <em>- Dad</em>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes bubble {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes reaction {
          0% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.2) rotate(-5deg); }
          50% { transform: scale(1.1) rotate(5deg); }
          75% { transform: scale(1.15) rotate(-3deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
      `}</style>

      {/* Header */}
      <div 
        style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 1, cursor: 'pointer' }}
        onClick={handleBeakerClick}
      >
        <span style={{ fontSize: '32px' }}>🔬</span>
        <h2 style={{
          color: '#F3F4F6',
          fontSize: '24px',
          fontWeight: 700,
          margin: 0,
          letterSpacing: '2px',
        }}>
          SCIENCE LAB
        </h2>
        <span style={{ fontSize: '32px' }}>🧪</span>
      </div>

      {/* Discovery counter */}
      <div style={{
        background: '#10B98120',
        padding: '8px 16px',
        borderRadius: '12px',
        color: '#10B981',
        fontSize: '14px',
        zIndex: 1,
      }}>
        🏆 Discoveries: {discoveries.size} / {REACTIONS.length}
      </div>

      {/* Elements grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
        zIndex: 1,
      }}>
        {ELEMENTS.map((element) => {
          const isSelected = selected.includes(element.id);
          return (
            <button
              key={element.id}
              onClick={() => handleElementClick(element.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '12px',
                borderRadius: '12px',
                border: isSelected ? `2px solid ${element.color}` : '1px solid #4B5563',
                background: isSelected ? `${element.color}30` : '#374151',
                cursor: 'pointer',
                transition: 'all 0.2s',
                animation: isSelected ? 'bubble 1s ease-in-out infinite' : 'none',
              }}
            >
              <span style={{ fontSize: '32px' }}>{element.emoji}</span>
              <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{element.name}</span>
            </button>
          );
        })}
      </div>

      {/* Mixing area */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        zIndex: 1,
        minHeight: '60px',
      }}>
        {selected[0] && (
          <span style={{ fontSize: '40px' }}>
            {ELEMENTS.find(e => e.id === selected[0])?.emoji}
          </span>
        )}
        {selected.length > 0 && (
          <span style={{ fontSize: '24px', color: '#9CA3AF' }}>+</span>
        )}
        {selected[1] && (
          <span style={{ fontSize: '40px' }}>
            {ELEMENTS.find(e => e.id === selected[1])?.emoji}
          </span>
        )}
        {selected.length === 2 && (
          <>
            <span style={{ fontSize: '24px', color: '#9CA3AF' }}>=</span>
            <span style={{ 
              fontSize: '50px',
              animation: showReaction ? 'reaction 1s ease-out' : 'none',
            }}>
              {showReaction ? '✨' : result?.emoji}
            </span>
          </>
        )}
      </div>

      {/* Result display */}
      {result && (
        <div style={{
          background: `${result.color}20`,
          border: `1px solid ${result.color}`,
          borderRadius: '12px',
          padding: '16px',
          maxWidth: '320px',
          zIndex: 1,
        }}>
          <div style={{ 
            fontSize: '18px', 
            fontWeight: 700, 
            color: result.color,
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            {result.emoji} {result.name}
            {result.special && <span style={{ fontSize: '14px' }}>⭐</span>}
          </div>
          <div style={{ fontSize: '13px', color: '#D1D5DB', lineHeight: 1.5 }}>
            {result.fact}
          </div>
        </div>
      )}

      {/* Reset button */}
      {selected.length > 0 && (
        <button
          onClick={reset}
          style={{
            padding: '10px 24px',
            borderRadius: '8px',
            border: '1px solid #4B5563',
            background: '#374151',
            color: '#F3F4F6',
            cursor: 'pointer',
            fontSize: '14px',
            zIndex: 1,
          }}
        >
          🔄 Try Again
        </button>
      )}

      {/* Instructions */}
      <div style={{
        color: '#6B7280',
        fontSize: '12px',
        textAlign: 'center',
        zIndex: 1,
      }}>
        Select two elements to see what happens when you mix them!
      </div>

      {/* Hidden signature */}
      <div style={{
        position: 'absolute',
        bottom: '8px',
        right: '12px',
        color: '#4B556320',
        fontSize: '10px',
        fontFamily: 'monospace',
      }}>
        E=mc² 💜
      </div>
    </div>
  );
}

export default ScienceLab;
