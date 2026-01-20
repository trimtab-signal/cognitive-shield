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
 * ║                          🎨 ART CANVAS 🖌️                                      ║
 * ║                  Where every line tells a story                                ║
 * ║                                                                                 ║
 * ║  "You are the artist of your own life. Don't hand the paintbrush              ║
 * ║   to anyone else."                                      - Dad 💜               ║
 * ╚═══════════════════════════════════════════════════════════════════════════════╝
 * 
 * EASTER EGGS:
 * - Draw a heart shape → special animation
 * - Use all 8 colors → "Rainbow Artist" badge
 * - Fill the canvas completely → secret message
 */

import { useRef, useState, useEffect, useCallback } from 'react';

// Rainbow color palette
const COLORS = [
  { name: 'Ruby', color: '#EF4444', emoji: '❤️' },
  { name: 'Sunset', color: '#F97316', emoji: '🧡' },
  { name: 'Sunshine', color: '#FBBF24', emoji: '💛' },
  { name: 'Forest', color: '#22C55E', emoji: '💚' },
  { name: 'Ocean', color: '#3B82F6', emoji: '💙' },
  { name: 'Lavender', color: '#8B5CF6', emoji: '💜' },
  { name: 'Cotton Candy', color: '#EC4899', emoji: '🩷' },
  { name: 'Starlight', color: '#F3F4F6', emoji: '🤍' },
];

const BRUSH_SIZES = [4, 8, 16, 24, 40];

// Cute stamps
const STAMPS = ['⭐', '🌸', '🦋', '🌈', '💖', '✨', '🌺', '🐱'];

export function ArtCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState(COLORS[4].color);
  const [brushSize, setBrushSize] = useState(8);
  const [mode, setMode] = useState<'draw' | 'erase' | 'stamp'>('draw');
  const [selectedStamp, setSelectedStamp] = useState('⭐');
  const [usedColors, setUsedColors] = useState<Set<string>>(new Set());
  const [showRainbowArtist, setShowRainbowArtist] = useState(false);
  const [strokeCount, setStrokeCount] = useState(0);
  const [showSecret, setShowSecret] = useState(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);

  // Initialize canvas with white background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = '#1F2937';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  // Check for rainbow artist achievement
  useEffect(() => {
    if (usedColors.size === COLORS.length && !showRainbowArtist) {
      setShowRainbowArtist(true);
      setTimeout(() => setShowRainbowArtist(false), 3000);
    }
  }, [usedColors, showRainbowArtist]);

  // Check for lots of strokes
  useEffect(() => {
    if (strokeCount === 100 && !showSecret) {
      setShowSecret(true);
      setTimeout(() => setShowSecret(false), 5000);
    }
  }, [strokeCount, showSecret]);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    
    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    }
    
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const coords = getCoordinates(e);
    if (!coords) return;
    
    setIsDrawing(true);
    lastPoint.current = coords;
    
    if (mode === 'stamp') {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!ctx) return;
      
      ctx.font = `${brushSize * 2}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(selectedStamp, coords.x, coords.y);
    }
  }, [mode, brushSize, selectedStamp]);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || mode === 'stamp') return;
    
    const coords = getCoordinates(e);
    if (!coords || !lastPoint.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    
    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(coords.x, coords.y);
    ctx.strokeStyle = mode === 'erase' ? '#1F2937' : color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    
    lastPoint.current = coords;
    
    if (mode === 'draw') {
      setUsedColors(prev => new Set([...prev, color]));
    }
  }, [isDrawing, mode, color, brushSize]);

  const stopDrawing = useCallback(() => {
    if (isDrawing) {
      setStrokeCount(prev => prev + 1);
    }
    setIsDrawing(false);
    lastPoint.current = null;
  }, [isDrawing]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;
    
    ctx.fillStyle = '#1F2937';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setUsedColors(new Set());
    setStrokeCount(0);
  };

  const saveDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = 'my-masterpiece.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
      padding: '20px',
      background: 'linear-gradient(135deg, #1F2937 0%, #111827 100%)',
      borderRadius: '20px',
      border: '1px solid #374151',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Rainbow artist achievement */}
      {showRainbowArtist && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 50%, #3B82F6 100%)',
          padding: '24px',
          borderRadius: '16px',
          zIndex: 100,
          textAlign: 'center',
          animation: 'fadeIn 0.5s ease-out',
        }}>
          <div style={{ fontSize: '48px' }}>🌈✨🎨</div>
          <div style={{ color: 'white', fontSize: '18px', fontWeight: 700 }}>
            Rainbow Artist!
          </div>
          <div style={{ color: 'white', fontSize: '14px' }}>
            You used all the colors!
          </div>
        </div>
      )}

      {/* Secret message */}
      {showSecret && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(139, 92, 246, 0.95)',
          padding: '24px',
          borderRadius: '16px',
          zIndex: 100,
          textAlign: 'center',
          animation: 'fadeIn 0.5s ease-out',
          maxWidth: '280px',
        }}>
          <div style={{ fontSize: '48px' }}>🎨💜🖼️</div>
          <div style={{ color: 'white', fontSize: '16px', fontWeight: 700 }}>
            100 strokes of genius!
          </div>
          <div style={{ color: 'white', fontSize: '14px', marginTop: '8px' }}>
            "Every artist was first an amateur. What matters is that you keep creating."
            <br /><br />
            I'm proud of everything you make.
            <br /><em>- Dad</em>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '28px' }}>🎨</span>
        <h2 style={{
          color: '#F3F4F6',
          fontSize: '22px',
          fontWeight: 700,
          margin: 0,
          letterSpacing: '2px',
        }}>
          ART CANVAS
        </h2>
        <span style={{ fontSize: '28px' }}>🖌️</span>
      </div>

      {/* Color palette */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {COLORS.map((c) => (
          <button
            key={c.name}
            onClick={() => { setColor(c.color); setMode('draw'); }}
            title={c.name}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: color === c.color && mode === 'draw' ? '3px solid white' : '2px solid #4B5563',
              background: c.color,
              cursor: 'pointer',
              transition: 'transform 0.2s',
              transform: color === c.color && mode === 'draw' ? 'scale(1.2)' : 'scale(1)',
            }}
          />
        ))}
      </div>

      {/* Brush size */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ color: '#9CA3AF', fontSize: '12px' }}>Size:</span>
        {BRUSH_SIZES.map((size) => (
          <button
            key={size}
            onClick={() => setBrushSize(size)}
            style={{
              width: Math.min(size + 16, 40),
              height: Math.min(size + 16, 40),
              borderRadius: '50%',
              border: brushSize === size ? '2px solid #8B5CF6' : '1px solid #4B5563',
              background: brushSize === size ? '#8B5CF620' : '#374151',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{
              width: size / 2,
              height: size / 2,
              borderRadius: '50%',
              background: '#F3F4F6',
            }} />
          </button>
        ))}
      </div>

      {/* Tools */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => setMode('draw')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: mode === 'draw' ? '2px solid #22C55E' : '1px solid #4B5563',
            background: mode === 'draw' ? '#22C55E20' : '#374151',
            color: '#F3F4F6',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          ✏️ Draw
        </button>
        <button
          onClick={() => setMode('erase')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: mode === 'erase' ? '2px solid #F59E0B' : '1px solid #4B5563',
            background: mode === 'erase' ? '#F59E0B20' : '#374151',
            color: '#F3F4F6',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          🧽 Erase
        </button>
        <button
          onClick={() => setMode('stamp')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: mode === 'stamp' ? '2px solid #EC4899' : '1px solid #4B5563',
            background: mode === 'stamp' ? '#EC489920' : '#374151',
            color: '#F3F4F6',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          {selectedStamp} Stamp
        </button>
      </div>

      {/* Stamp selector */}
      {mode === 'stamp' && (
        <div style={{ display: 'flex', gap: '8px' }}>
          {STAMPS.map((stamp) => (
            <button
              key={stamp}
              onClick={() => setSelectedStamp(stamp)}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                border: selectedStamp === stamp ? '2px solid #EC4899' : '1px solid #4B5563',
                background: selectedStamp === stamp ? '#EC489920' : '#374151',
                fontSize: '20px',
                cursor: 'pointer',
              }}
            >
              {stamp}
            </button>
          ))}
        </div>
      )}

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={320}
        height={240}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        style={{
          borderRadius: '12px',
          border: '2px solid #4B5563',
          cursor: mode === 'erase' ? 'crosshair' : mode === 'stamp' ? 'copy' : 'crosshair',
          touchAction: 'none',
        }}
      />

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={clearCanvas}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: '1px solid #EF4444',
            background: '#EF444420',
            color: '#EF4444',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          🗑️ Clear
        </button>
        <button
          onClick={saveDrawing}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: '1px solid #22C55E',
            background: '#22C55E20',
            color: '#22C55E',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          💾 Save
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#6B7280' }}>
        <span>Colors: {usedColors.size}/{COLORS.length}</span>
        <span>Strokes: {strokeCount}</span>
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
        🎨💜
      </div>
    </div>
  );
}

export default ArtCanvas;
