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
import { SPACING, GRID_GAP, CARD_PADDING, SECTION_GAP, COLORS, FONT_SIZES } from '../../config/design-system';
import { CosmicTheme } from '../../config/cosmic-theme';
// Cosmic sparkle particle effect
const CosmicSparkles: React.FC = () => (
  <div style={{
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 5,
    overflow: 'hidden',
  }}>
    {[...Array(24)].map((_, i) => (
      <div key={i} style={{
        position: 'absolute',
        top: `${Math.random() * 90 + 5}%`,
        left: `${Math.random() * 90 + 5}%`,
        width: `${Math.random() * 3 + 2}px`,
        height: `${Math.random() * 3 + 2}px`,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${CosmicTheme.colors.love} 0%, ${CosmicTheme.colors.cosmic} 80%, #fff0 100%)`,
        opacity: Math.random() * 0.7 + 0.3,
        boxShadow: `0 0 ${Math.random() * 16 + 8}px ${CosmicTheme.colors.cosmic}`,
        animation: `sparkle-pop ${Math.random() * 2 + 1.5}s infinite ease-in-out`,
      }} />
    ))}
    <style>{`
      @keyframes sparkle-pop {
        0%, 100% { transform: scale(1); opacity: 0.5; }
        50% { transform: scale(1.3); opacity: 1; }
      }
    `}</style>
  </div>
);
// Animated floating cosmic tetrahedron
const FloatingTetrahedron: React.FC = () => (
  <div style={{
    position: 'absolute',
    top: 32,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 10,
    pointerEvents: 'none',
    animation: 'float-tetra 6s ease-in-out infinite',
  }}>
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <polygon points="32,8 56,56 8,56" fill={CosmicTheme.colors.cosmic} opacity="0.7" />
      <polygon points="32,8 56,56 32,32" fill={CosmicTheme.colors.delta} opacity="0.5" />
      <polygon points="32,8 8,56 32,32" fill={CosmicTheme.colors.love} opacity="0.5" />
      <polygon points="8,56 56,56 32,32" fill={CosmicTheme.colors.unity} opacity="0.4" />
      <circle cx="32" cy="32" r="6" fill={CosmicTheme.colors.aries} opacity="0.7" />
    </svg>
    <style>{`
      @keyframes float-tetra {
        0%, 100% { transform: translateX(-50%) translateY(0) scale(1); }
        50% { transform: translateX(-50%) translateY(-16px) scale(1.08); }
      }
    `}</style>
  </div>
);
// Animated cosmic starfield background
const StarfieldBG: React.FC = () => (
  <div style={{
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
    pointerEvents: 'none',
    overflow: 'hidden',
  }}>
    {[...Array(64)].map((_, i) => (
      <div key={i} style={{
        position: 'absolute',
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        width: `${Math.random() * 2 + 1}px`,
        height: `${Math.random() * 2 + 1}px`,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${COLORS.cosmic} 0%, #fff0 100%)`,
        opacity: Math.random() * 0.7 + 0.3,
        boxShadow: `0 0 ${Math.random() * 12 + 8}px ${COLORS.cosmic}`,
        animation: `star-twinkle ${Math.random() * 3 + 2}s infinite ease-in-out`,
      }} />
    ))}
    <style>{`
      @keyframes star-twinkle {
        0%, 100% { opacity: 0.5; }
        50% { opacity: 1; }
      }
    `}</style>
  </div>
);
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
        <CosmicSparkles />
      <FloatingTetrahedron />
    return (
      <div style={{
        background: CosmicTheme.backgroundGradient,
        borderRadius: CosmicTheme.cardRadius,
        padding: CosmicTheme.cardPadding,
        border: `1px solid ${CosmicTheme.colors.delta}`,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: CosmicTheme.cosmicGlow,
      }}>
        <StarfieldBG />
        {/* Cosmic Ratio Overlay */}
        <div style={{
          {...CosmicTheme.ratioOverlay.style}
        >
          <span style={CosmicTheme.ratioOverlay.style}>
            {CosmicTheme.ratioOverlay.text}
          </span>
        </div>
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: CosmicTheme.gridGap,
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
