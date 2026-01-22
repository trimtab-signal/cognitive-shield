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

import React, { useState, useCallback } from 'react';
import { CosmicTheme } from '../../config/design-tokens';
import { useHeartbeatStore } from '../../stores/heartbeat.store';

interface Tile {
  id: number;
  color: string;
  isLit: boolean;
}

const TILE_COLORS = ['#FF6B9D', '#60A5FA', '#34D399', '#FBBF24'];

/**
 * PATTERN TAP - Simon-like memory game with no failure penalty
 * 
 * Why this works:
 * - Clear visual/audio feedback for each tap
 * - Patterns start very simple (1-2 items)
 * - No time pressure - take as long as needed
 * - "Wrong" taps just show the pattern again
 * - Builds working memory gently
 * - Earns spoons for completion (not perfection)
 */
export const PatternTap: React.FC = () => {
  const [tiles, setTiles] = useState<Tile[]>(
    TILE_COLORS.map((color, i) => ({ id: i, color, isLit: false }))
  );
  const [pattern, setPattern] = useState<number[]>([]);
  const [playerPattern, setPlayerPattern] = useState<number[]>([]);
  const [isShowingPattern, setIsShowingPattern] = useState(false);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [level, setLevel] = useState(0);
  const [message, setMessage] = useState('Tap Start to play');
  const [showReward, setShowReward] = useState(false);
  const updateSpoons = useHeartbeatStore(state => state.updateSpoons);

  // Light up a tile temporarily
  const flashTile = useCallback((tileId: number, duration = 400) => {
    setTiles(prev => prev.map(t => 
      t.id === tileId ? { ...t, isLit: true } : t
    ));
    setTimeout(() => {
      setTiles(prev => prev.map(t => 
        t.id === tileId ? { ...t, isLit: false } : t
      ));
    }, duration);
  }, []);

  // Show the pattern to memorize
  const showPattern = useCallback(async (pat: number[]) => {
    setIsShowingPattern(true);
    setIsPlayerTurn(false);
    setMessage('Watch the pattern...');
    
    await new Promise(r => setTimeout(r, 500));
    
    for (let i = 0; i < pat.length; i++) {
      flashTile(pat[i], 500);
      await new Promise(r => setTimeout(r, 700));
    }
    
    setIsShowingPattern(false);
    setIsPlayerTurn(true);
    setPlayerPattern([]);
    setMessage('Your turn! Tap the same pattern.');
  }, [flashTile]);

  // Start new game
  const startGame = useCallback(() => {
    const firstTile = Math.floor(Math.random() * 4);
    const newPattern = [firstTile];
    setPattern(newPattern);
    setLevel(1);
    showPattern(newPattern);
  }, [showPattern]);

  // Add to pattern for next level
  const nextLevel = useCallback(() => {
    const nextTile = Math.floor(Math.random() * 4);
    const newPattern = [...pattern, nextTile];
    setPattern(newPattern);
    setLevel(prev => prev + 1);
    setTimeout(() => showPattern(newPattern), 1000);
  }, [pattern, showPattern]);

  // Handle player tap
  const handleTap = useCallback((tileId: number) => {
    if (!isPlayerTurn || isShowingPattern) return;

    flashTile(tileId, 300);
    
    const newPlayerPattern = [...playerPattern, tileId];
    setPlayerPattern(newPlayerPattern);

    const currentIndex = newPlayerPattern.length - 1;
    
    // Check if this tap matches
    if (pattern[currentIndex] !== tileId) {
      // Wrong! But that's okay - just show it again
      setMessage("Let's try that again! Watch carefully...");
      setIsPlayerTurn(false);
      setTimeout(() => showPattern(pattern), 1500);
      return;
    }

    // Check if pattern complete
    if (newPlayerPattern.length === pattern.length) {
      // Success!
      setIsPlayerTurn(false);
      setMessage('🎉 Great job!');
      
      // Award spoons every 3 levels
      if ((level) % 3 === 0) {
        updateSpoons(0.5);
        setShowReward(true);
        setTimeout(() => setShowReward(false), 2000);
      }
      
      // Next level
      setTimeout(nextLevel, 1500);
    }
  }, [isPlayerTurn, isShowingPattern, playerPattern, pattern, flashTile, showPattern, level, nextLevel, updateSpoons]);

  return (
    <div style={{
      background: CosmicTheme.cardGradient,
      borderRadius: CosmicTheme.cardRadius,
      padding: CosmicTheme.cardPadding,
      border: `1px solid ${CosmicTheme.colors.delta}`,
      height: '400px',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: CosmicTheme.cosmicGlow,
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '12px'
      }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#F3F4F6', margin: 0 }}>
          🎹 Pattern Tap
        </h2>
        <div style={{ 
          background: '#FBBF2420', 
          color: '#FBBF24', 
          padding: '4px 12px', 
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: 600
        }}>
          Level {level}
        </div>
      </div>

      <p style={{ 
        fontSize: '13px', 
        color: '#9CA3AF', 
        margin: '0 0 16px 0',
        textAlign: 'center'
      }}>
        {message}
      </p>

      {/* Game grid */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
        padding: '20px',
        maxWidth: '280px',
        margin: '0 auto'
      }}>
        {tiles.map(tile => (
          <button
            key={tile.id}
            onClick={() => handleTap(tile.id)}
            disabled={!isPlayerTurn}
            aria-label={`Tile ${tile.id + 1}`}
            title={`Tile ${tile.id + 1}`}
            style={{
              aspectRatio: '1',
              borderRadius: '16px',
              border: 'none',
              background: tile.isLit 
                ? tile.color 
                : `${tile.color}30`,
              boxShadow: tile.isLit 
                ? `0 0 30px ${tile.color}, 0 0 60px ${tile.color}50`
                : 'none',
              cursor: isPlayerTurn ? 'pointer' : 'default',
              transition: 'all 0.15s ease-out',
              transform: tile.isLit ? 'scale(1.05)' : 'scale(1)'
            }}
          />
        ))}
      </div>

      {/* Start button */}
      {level === 0 && (
        <button
          onClick={startGame}
          style={{
            padding: '12px 32px',
            fontSize: '16px',
            fontWeight: 600,
            background: '#10B98120',
            color: '#10B981',
            border: '1px solid #10B981',
            borderRadius: '12px',
            cursor: 'pointer',
            margin: '0 auto'
          }}
        >
          Start Game
        </button>
      )}

      {/* Progress indicator */}
      {level > 0 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '12px'
        }}>
          {pattern.map((_, i) => (
            <div
              key={i}
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: i < playerPattern.length ? '#10B981' : '#374151',
                transition: 'background 0.2s'
              }}
            />
          ))}
        </div>
      )}

      {/* Reward overlay */}
      {showReward && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#10B98140',
          padding: '16px 32px',
          borderRadius: '12px',
          color: '#10B981',
          fontSize: '18px',
          fontWeight: 600,
          zIndex: 100
        }}>
          ✨ +0.5 spoons ✨
        </div>
      )}
    </div>
  );
};
