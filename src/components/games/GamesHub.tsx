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

import React, { useState } from 'react';
import { BubblePop } from './BubblePop';
import { BreathingOrb } from './BreathingOrb';
import { PatternTap } from './PatternTap';
import { ColorSort } from './ColorSort';
import { Jitterbug } from './Jitterbug';
import { MathWizard } from './MathWizard';
import { ScienceLab } from './ScienceLab';
import { ArtCanvas } from './ArtCanvas';
import { PoetryPad } from './PoetryPad';
import { MusicMaker } from './MusicMaker';
import { DeltaProtocol } from './DeltaProtocol';
import EternalStarfield from './EternalStarfield';
import GrandfatherClock from './GrandfatherClock';
import { useSpoons } from '../../stores/heartbeat.store';

interface GameInfo {
  id: string;
  name: string;
  emoji: string;
  description: string;
  energy: 'low' | 'medium' | 'high';
  component: React.FC;
}

const GAMES: GameInfo[] = [
  {
    id: 'bubbles',
    name: 'Bubble Pop',
    emoji: '🫧',
    description: 'Pop bubbles at your own pace. No rush, no score.',
    energy: 'low',
    component: BubblePop
  },
  {
    id: 'breathing',
    name: 'Breathing Orb',
    emoji: '🌬️',
    description: 'Follow the orb to breathe. 4 seconds in, 4 out.',
    energy: 'low',
    component: BreathingOrb
  },
  {
    id: 'pattern',
    name: 'Pattern Tap',
    emoji: '🎹',
    description: 'Watch and repeat. No wrong answers, just try again.',
    energy: 'medium',
    component: PatternTap
  },
  {
    id: 'colorsort',
    name: 'Color Sort',
    emoji: '🎨',
    description: 'Match colors to buckets. Create order from chaos.',
    energy: 'medium',
    component: ColorSort
  },
  {
    id: 'jitterbug',
    name: 'Jitterbug',
    emoji: '🕺',
    description: 'Rhythmic movement prompts. Shake it off to shake it out!',
    energy: 'high',
    component: Jitterbug
  },
  {
    id: 'mathwizard',
    name: 'Math Wizard',
    emoji: '🧙‍♂️',
    description: 'Number puzzles for young wizards. Type 1618 for a surprise!',
    energy: 'medium',
    component: MathWizard
  },
  {
    id: 'sciencelab',
    name: 'Science Lab',
    emoji: '🔬',
    description: 'Mix elements and discover reactions. What will you create?',
    energy: 'medium',
    component: ScienceLab
  },
  {
    id: 'artcanvas',
    name: 'Art Canvas',
    emoji: '🎨',
    description: 'Draw, paint, and stamp. Every line tells a story!',
    energy: 'low',
    component: ArtCanvas
  },
  {
    id: 'poetrypad',
    name: 'Poetry Pad',
    emoji: '📝',
    description: 'Write poems with fun prompts. Words become magic!',
    energy: 'low',
    component: PoetryPad
  },
  {
    id: 'musicmaker',
    name: 'Music Maker',
    emoji: '🎵',
    description: 'Play piano, drums, and effects! Create your own melody!',
    energy: 'medium',
    component: MusicMaker
  },
  {
    id: 'deltaprotocol',
    name: 'Delta Protocol',
    emoji: '🜂',
    description: 'Build your first Tetrahedron! Connect without assimilation.',
    energy: 'medium',
    component: DeltaProtocol
  },
  {
    id: 'eternalstarfield',
    name: 'Eternal Starfield',
    emoji: '✨',
    description: 'Honor loved ones. Their energy remains in the quantum mesh.',
    energy: 'low',
    component: EternalStarfield
  },
  {
    id: 'grandfatherclock',
    name: "Grandfather's Clock",
    emoji: '⏰',
    description: 'Time travel through cosmic moments. 1925 → 2026.',
    energy: 'low',
    component: GrandfatherClock
  }
];

/**
 * GAMES HUB - Central hub for neurodivergent-friendly games
 * 
 * Design principles:
 * - All games earn spoons (reward regulation)
 * - No failure states (safety)
 * - Energy indicators help with spoon management
 * - Easy to exit and switch games
 * - Visual consistency across all games
 */
export const GamesHub: React.FC = () => {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const spoons = useSpoons();

  const selectedGame = GAMES.find(g => g.id === activeGame);

  // Show game selector if no active game
  if (!activeGame) {
    return (
      <div style={{
        background: '#1F2937',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #374151',
      }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <div>
            <h2 style={{ 
              fontSize: '20px', 
              fontWeight: 600, 
              color: '#F3F4F6', 
              margin: '0 0 4px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              🎮 Regulation Games
            </h2>
            <p style={{ fontSize: '13px', color: '#9CA3AF', margin: 0 }}>
              Play to restore spoons. No scores, no pressure.
            </p>
          </div>
          <div style={{ 
            background: '#10B98120', 
            color: '#10B981', 
            padding: '8px 16px', 
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: 600
          }}>
            🥄 {spoons.toFixed(1)} spoons
          </div>
        </div>

        {/* Energy level legend */}
        <div style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '20px',
          padding: '12px',
          background: '#111827',
          borderRadius: '8px'
        }}>
          <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
            Energy needed:
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span style={{ fontSize: '12px', color: '#34D399' }}>● Low</span>
            <span style={{ fontSize: '12px', color: '#FBBF24' }}>● Medium</span>
            <span style={{ fontSize: '12px', color: '#F87171' }}>● High</span>
          </div>
        </div>

        {/* Game cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(var(--grid-min), var(--grid-max)))',
          gap: 'var(--space-md)',
          maxWidth: '100%'
        }}>
          {GAMES.map(game => (
            <button
              key={game.id}
              onClick={() => setActiveGame(game.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '16px',
                background: '#374151',
                border: '1px solid #4B5563',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'left'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#4B5563';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#374151';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                marginBottom: '8px',
                width: '100%',
                justifyContent: 'space-between'
              }}>
                <span style={{ fontSize: '28px' }}>{game.emoji}</span>
                <span style={{ 
                  width: '10px', 
                  height: '10px', 
                  borderRadius: '50%',
                  background: game.energy === 'low' ? '#34D399' : 
                             game.energy === 'medium' ? '#FBBF24' : '#F87171'
                }} />
              </div>
              <div style={{ 
                fontSize: '16px', 
                fontWeight: 600, 
                color: '#F3F4F6',
                marginBottom: '4px'
              }}>
                {game.name}
              </div>
              <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
                {game.description}
              </div>
            </button>
          ))}
        </div>

        {/* Tip */}
        <div style={{
          marginTop: '20px',
          padding: '12px 16px',
          background: '#C084FC15',
          borderRadius: '8px',
          borderLeft: '3px solid #C084FC'
        }}>
          <p style={{ fontSize: '13px', color: '#C084FC', margin: 0 }}>
            💡 <strong>Tip:</strong> Start with low-energy games when you're tired. 
            All games restore spoons - there's no wrong choice.
          </p>
        </div>
      </div>
    );
  }

  // Show active game with back button
  const GameComponent = selectedGame?.component || BubblePop;

  return (
    <div style={{ position: 'relative' }}>
      {/* Back button */}
      <button
        onClick={() => setActiveGame(null)}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          zIndex: 200,
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: 500,
          background: '#37415190',
          backdropFilter: 'blur(8px)',
          color: '#F3F4F6',
          border: '1px solid #4B5563',
          borderRadius: '8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          transition: 'all 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.background = '#4B5563'}
        onMouseOut={(e) => e.currentTarget.style.background = '#37415190'}
      >
        ← All Games
      </button>
      
      <GameComponent />
    </div>
  );
};

// Export individual games for direct use
export { BubblePop, BreathingOrb, PatternTap, ColorSort, Jitterbug, MathWizard, ScienceLab, ArtCanvas, PoetryPad, MusicMaker, DeltaProtocol, EternalStarfield, GrandfatherClock };
