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
import { CosmicTheme } from '../../config/cosmic-theme';
import { useHeartbeatStore } from '../../stores/heartbeat.store';

interface ColorItem {
  id: number;
  color: string;
  sorted: boolean;
}

interface Bucket {
  color: string;
  name: string;
  items: ColorItem[];
}

const BUCKET_COLORS = [
  { color: '#FF6B9D', name: 'Pink' },
  { color: '#60A5FA', name: 'Blue' },
  { color: '#34D399', name: 'Green' },
  { color: '#FBBF24', name: 'Yellow' },
];

/**
 * COLOR SORT - Drag-free sorting game for organization satisfaction
 * 
 * Why this works:
 * - Tapping is easier than dragging for many kids
 * - Clear color matching (no ambiguity)
 * - Satisfying "drop" animation
 * - Creates order from chaos (regulating)
 * - No wrong answers - items just don't go in wrong bucket
 * - Completing a set earns spoons
 */
export const ColorSort: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<ColorItem | null>(null);
  const [unsortedItems, setUnsortedItems] = useState<ColorItem[]>([]);
  const [buckets, setBuckets] = useState<Bucket[]>(
    BUCKET_COLORS.map(b => ({ ...b, items: [] }))
  );
  const [roundsCompleted, setRoundsCompleted] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const updateSpoons = useHeartbeatStore(state => state.updateSpoons);

  // Generate new items to sort
  const generateItems = useCallback(() => {
    const items: ColorItem[] = [];
    let id = 0;
    BUCKET_COLORS.forEach(bucket => {
      // 2-3 items per color
      const count = Math.floor(Math.random() * 2) + 2;
      for (let i = 0; i < count; i++) {
        items.push({ id: id++, color: bucket.color, sorted: false });
      }
    });
    // Shuffle
    return items.sort(() => Math.random() - 0.5);
  }, []);

  // Start new round
  const startRound = useCallback(() => {
    setUnsortedItems(generateItems());
    setBuckets(BUCKET_COLORS.map(b => ({ ...b, items: [] })));
    setSelectedItem(null);
  }, [generateItems]);

  // Select an item
  const handleItemClick = useCallback((item: ColorItem) => {
    setSelectedItem(item);
  }, []);

  // Try to place in bucket
  const handleBucketClick = useCallback((bucketIndex: number) => {
    if (!selectedItem) return;

    const bucket = buckets[bucketIndex];
    
    // Check if colors match
    if (bucket.color === selectedItem.color) {
      // Success! Move item to bucket
      setBuckets(prev => prev.map((b, i) => 
        i === bucketIndex 
          ? { ...b, items: [...b.items, selectedItem] }
          : b
      ));
      setUnsortedItems(prev => prev.filter(i => i.id !== selectedItem.id));
      setSelectedItem(null);

      // Check if round complete
      setTimeout(() => {
        setUnsortedItems(current => {
          if (current.length === 0) {
            setRoundsCompleted(prev => {
              const newCount = prev + 1;
              if (newCount % 2 === 0) {
                updateSpoons(0.5);
                setShowReward(true);
                setTimeout(() => setShowReward(false), 2000);
              }
              return newCount;
            });
          }
          return current;
        });
      }, 100);
    } else {
      // Wrong bucket - gentle shake feedback
      setSelectedItem(null);
    }
  }, [selectedItem, buckets, updateSpoons]);

  const isGameActive = unsortedItems.length > 0;
  const isRoundComplete = roundsCompleted > 0 && unsortedItems.length === 0;

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
          🎨 Color Sort
        </h2>
        <div style={{ 
          background: '#C084FC20', 
          color: '#C084FC', 
          padding: '4px 12px', 
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: 600
        }}>
          {roundsCompleted} rounds
        </div>
      </div>

      <p style={{ 
        fontSize: '13px', 
        color: '#9CA3AF', 
        margin: '0 0 12px 0',
        textAlign: 'center'
      }}>
        {!isGameActive 
          ? (isRoundComplete ? '✨ All sorted! Tap for another round.' : 'Tap an item, then tap its matching bucket.')
          : (selectedItem ? 'Now tap the matching bucket!' : 'Tap a colored circle to pick it up.')
        }
      </p>

      {/* Items to sort */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '10px',
        minHeight: '80px',
        padding: '10px',
        background: '#111827',
        borderRadius: '12px',
        marginBottom: '16px'
      }}>
        {unsortedItems.map(item => (
          <button
            key={item.id}
            onClick={() => handleItemClick(item)}
            aria-label={`Color item ${item.id}`}
            title="Tap to select"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: selectedItem?.id === item.id ? '3px solid #fff' : 'none',
              background: item.color,
              cursor: 'pointer',
              transform: selectedItem?.id === item.id ? 'scale(1.2)' : 'scale(1)',
              transition: 'all 0.2s ease-out',
              boxShadow: selectedItem?.id === item.id 
                ? `0 0 20px ${item.color}` 
                : 'none'
            }}
          />
        ))}
        {unsortedItems.length === 0 && !isRoundComplete && (
          <div style={{ color: '#6B7280', fontSize: '14px' }}>
            Tap "New Round" to start
          </div>
        )}
      </div>

      {/* Buckets */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '8px',
        flex: 1
      }}>
        {buckets.map((bucket, i) => (
          <button
            key={bucket.color}
            onClick={() => handleBucketClick(i)}
            aria-label={`${bucket.name} bucket`}
            title={`${bucket.name} bucket`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-end',
              padding: '8px',
              background: `${bucket.color}15`,
              border: `2px dashed ${bucket.color}50`,
              borderRadius: '12px',
              cursor: selectedItem ? 'pointer' : 'default',
              transition: 'all 0.2s',
              opacity: selectedItem && selectedItem.color !== bucket.color ? 0.5 : 1
            }}
          >
            {/* Sorted items in bucket */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '4px',
              marginBottom: '8px'
            }}>
              {bucket.items.map(item => (
                <div
                  key={item.id}
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: item.color
                  }}
                />
              ))}
            </div>
            <div style={{
              fontSize: '12px',
              color: bucket.color,
              fontWeight: 600
            }}>
              {bucket.name}
            </div>
          </button>
        ))}
      </div>

      {/* Start/New Round button */}
      {!isGameActive && (
        <button
          onClick={startRound}
          style={{
            marginTop: '12px',
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: 600,
            background: '#10B98120',
            color: '#10B981',
            border: '1px solid #10B981',
            borderRadius: '12px',
            cursor: 'pointer',
            alignSelf: 'center'
          }}
        >
          {roundsCompleted === 0 ? 'Start Sorting' : 'New Round'}
        </button>
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
