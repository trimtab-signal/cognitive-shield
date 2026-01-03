/**
 * NERD LAB - The Playground for Pattern Matchers
 * 
 * "The universe is not only queerer than we suppose, 
 *  but queerer than we CAN suppose." - J.B.S. Haldane
 * 
 * A collection of nerdy tools for the cognitively adventurous.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import GOD_CONFIG from '../god.config';

// === TOOL DEFINITIONS ===
type LabTool = 'fractal' | 'life' | 'stim' | 'pi' | 'morse' | 'dice' | 'prime' | 'spectrum';

interface ToolMeta {
  id: LabTool;
  name: string;
  icon: string;
  description: string;
}

const TOOLS: ToolMeta[] = [
  { id: 'fractal', name: 'Fractal Explorer', icon: '🌀', description: 'Infinite zoom into the Mandelbrot set' },
  { id: 'life', name: 'Game of Life', icon: '🧬', description: "Conway's cellular automata" },
  { id: 'stim', name: 'Stim Board', icon: '🎮', description: 'Satisfying digital fidgets' },
  { id: 'pi', name: 'Pi Explorer', icon: '🔢', description: 'Search patterns in π' },
  { id: 'morse', name: 'Morse Code', icon: '📡', description: 'Encode/decode messages' },
  { id: 'dice', name: 'Dice Roller', icon: '🎲', description: 'D4 to D100 for tabletop games' },
  { id: 'prime', name: 'Prime Spiral', icon: '🌌', description: 'Ulam spiral visualization' },
  { id: 'spectrum', name: 'Spectrum', icon: '📊', description: 'Real-time audio visualization' },
];

// === FRACTAL EXPLORER ===
function FractalExplorer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(200);
  const [centerX, setCenterX] = useState(-0.5);
  const [centerY, setCenterY] = useState(0);
  const [maxIter, setMaxIter] = useState(100);
  const [colorScheme, setColorScheme] = useState<'fire' | 'ocean' | 'psychedelic'>('fire');

  const renderFractal = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.createImageData(width, height);

    for (let px = 0; px < width; px++) {
      for (let py = 0; py < height; py++) {
        const x0 = (px - width / 2) / zoom + centerX;
        const y0 = (py - height / 2) / zoom + centerY;

        let x = 0;
        let y = 0;
        let iter = 0;

        while (x * x + y * y <= 4 && iter < maxIter) {
          const xTemp = x * x - y * y + x0;
          y = 2 * x * y + y0;
          x = xTemp;
          iter++;
        }

        const idx = (py * width + px) * 4;
        
        if (iter === maxIter) {
          imageData.data[idx] = 0;
          imageData.data[idx + 1] = 0;
          imageData.data[idx + 2] = 0;
        } else {
          const t = iter / maxIter;
          let r, g, b;
          
          switch (colorScheme) {
            case 'fire':
              r = Math.floor(255 * Math.min(1, t * 3));
              g = Math.floor(255 * Math.max(0, Math.min(1, t * 3 - 1)));
              b = Math.floor(255 * Math.max(0, t * 3 - 2));
              break;
            case 'ocean':
              r = Math.floor(255 * t * t);
              g = Math.floor(255 * t);
              b = Math.floor(255 * Math.sqrt(t));
              break;
            case 'psychedelic':
              r = Math.floor(127.5 * (1 + Math.sin(t * 10)));
              g = Math.floor(127.5 * (1 + Math.sin(t * 10 + 2)));
              b = Math.floor(127.5 * (1 + Math.sin(t * 10 + 4)));
              break;
          }
          
          imageData.data[idx] = r;
          imageData.data[idx + 1] = g;
          imageData.data[idx + 2] = b;
        }
        imageData.data[idx + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }, [zoom, centerX, centerY, maxIter, colorScheme]);

  useEffect(() => {
    renderFractal();
  }, [renderFractal]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newCenterX = (x - canvas.width / 2) / zoom + centerX;
    const newCenterY = (y - canvas.height / 2) / zoom + centerY;
    
    setCenterX(newCenterX);
    setCenterY(newCenterY);
    setZoom(zoom * 2);
  };

  return (
    <div>
      <canvas 
        ref={canvasRef} 
        width={400} 
        height={300}
        onClick={handleCanvasClick}
        style={{ 
          cursor: 'zoom-in',
          borderRadius: '0.5rem',
          display: 'block',
          margin: '0 auto',
        }}
      />
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button onClick={() => { setZoom(200); setCenterX(-0.5); setCenterY(0); }} style={btnStyle}>
          Reset
        </button>
        <button onClick={() => setZoom(z => z * 0.5)} style={btnStyle}>Zoom Out</button>
        <select 
          value={colorScheme} 
          onChange={(e) => setColorScheme(e.target.value as typeof colorScheme)}
          style={{ ...btnStyle, cursor: 'pointer' }}
        >
          <option value="fire">🔥 Fire</option>
          <option value="ocean">🌊 Ocean</option>
          <option value="psychedelic">🌈 Psychedelic</option>
        </select>
        <input 
          type="range" 
          min="50" 
          max="500" 
          value={maxIter}
          onChange={(e) => setMaxIter(parseInt(e.target.value))}
          style={{ width: '100px' }}
        />
        <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Detail: {maxIter}</span>
      </div>
      <p style={{ textAlign: 'center', fontSize: '0.8rem', opacity: 0.6, marginTop: '0.5rem' }}>
        Click to zoom in. Zoom: {zoom.toFixed(0)}x | Center: ({centerX.toFixed(4)}, {centerY.toFixed(4)})
      </p>
    </div>
  );
}

// === GAME OF LIFE ===
function GameOfLife() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [grid, setGrid] = useState<boolean[][]>(() => {
    const rows = 40;
    const cols = 60;
    return Array(rows).fill(null).map(() => 
      Array(cols).fill(null).map(() => Math.random() > 0.7)
    );
  });
  const [running, setRunning] = useState(false);
  const [generation, setGeneration] = useState(0);
  const runningRef = useRef(running);
  runningRef.current = running;

  const rows = grid.length;
  const cols = grid[0].length;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) return;

    setGrid(g => {
      const newGrid = g.map((row, i) =>
        row.map((cell, j) => {
          let neighbors = 0;
          for (let di = -1; di <= 1; di++) {
            for (let dj = -1; dj <= 1; dj++) {
              if (di === 0 && dj === 0) continue;
              const ni = (i + di + rows) % rows;
              const nj = (j + dj + cols) % cols;
              if (g[ni][nj]) neighbors++;
            }
          }
          if (cell) return neighbors === 2 || neighbors === 3;
          return neighbors === 3;
        })
      );
      return newGrid;
    });
    setGeneration(g => g + 1);
    setTimeout(runSimulation, 100);
  }, [rows, cols]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = 8;
    canvas.width = cols * cellSize;
    canvas.height = rows * cellSize;

    ctx.fillStyle = GOD_CONFIG.theme.bg.primary;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    grid.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell) {
          ctx.fillStyle = '#4ade80';
          ctx.fillRect(j * cellSize, i * cellSize, cellSize - 1, cellSize - 1);
        }
      });
    });
  }, [grid, rows, cols]);

  const randomize = () => {
    setGrid(Array(rows).fill(null).map(() => 
      Array(cols).fill(null).map(() => Math.random() > 0.7)
    ));
    setGeneration(0);
  };

  const clear = () => {
    setGrid(Array(rows).fill(null).map(() => Array(cols).fill(false)));
    setGeneration(0);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cellSize = 8;
    const j = Math.floor(x / cellSize);
    const i = Math.floor(y / cellSize);
    if (i >= 0 && i < rows && j >= 0 && j < cols) {
      setGrid(g => {
        const newGrid = g.map(row => [...row]);
        newGrid[i][j] = !newGrid[i][j];
        return newGrid;
      });
    }
  };

  return (
    <div>
      <canvas 
        ref={canvasRef}
        onClick={handleCanvasClick}
        style={{ 
          borderRadius: '0.5rem',
          display: 'block',
          margin: '0 auto',
          cursor: 'crosshair',
        }}
      />
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button 
          onClick={() => { setRunning(!running); if (!running) { runningRef.current = true; runSimulation(); } }}
          style={{ ...btnStyle, background: running ? '#ef4444' : '#22c55e' }}
        >
          {running ? '⏹ Stop' : '▶ Start'}
        </button>
        <button onClick={randomize} style={btnStyle}>🎲 Random</button>
        <button onClick={clear} style={btnStyle}>🗑️ Clear</button>
      </div>
      <p style={{ textAlign: 'center', fontSize: '0.9rem', marginTop: '0.5rem' }}>
        Generation: <strong>{generation}</strong> | Click cells to toggle
      </p>
    </div>
  );
}

// === STIM BOARD ===
function StimBoard() {
  const [bubbles, setBubbles] = useState<boolean[]>(Array(49).fill(false));
  const [sliderVal, setSliderVal] = useState(50);
  const [clickCount, setClickCount] = useState(0);
  const [toggles, setToggles] = useState([false, false, false, false]);

  const popBubble = (idx: number) => {
    if (!bubbles[idx]) {
      setBubbles(b => { const n = [...b]; n[idx] = true; return n; });
      setClickCount(c => c + 1);
      // Play pop sound
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 400 + Math.random() * 200;
      gain.gain.value = 0.1;
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.stop(ctx.currentTime + 0.1);
    }
  };

  const resetBubbles = () => {
    setBubbles(Array(49).fill(false));
    setClickCount(0);
  };

  return (
    <div>
      {/* Bubble Wrap */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>🫧 Bubble Wrap</h4>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(7, 1fr)', 
          gap: '4px',
          maxWidth: '280px',
          margin: '0 auto',
        }}>
          {bubbles.map((popped, idx) => (
            <button
              key={idx}
              onClick={() => popBubble(idx)}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: 'none',
                background: popped 
                  ? 'rgba(100,100,100,0.3)' 
                  : 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%)',
                boxShadow: popped 
                  ? 'inset 0 2px 4px rgba(0,0,0,0.3)' 
                  : '0 4px 6px rgba(59,130,246,0.4), inset 0 -2px 4px rgba(0,0,0,0.2)',
                cursor: popped ? 'default' : 'pointer',
                transform: popped ? 'scale(0.9)' : 'scale(1)',
                transition: 'all 0.1s ease',
              }}
            />
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Popped: {clickCount}/49</span>
          {clickCount === 49 && (
            <button onClick={resetBubbles} style={{ ...btnStyle, marginLeft: '1rem', fontSize: '0.8rem' }}>
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Satisfying Slider */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>🎚️ Satisfying Slider</h4>
        <input
          type="range"
          min="0"
          max="100"
          value={sliderVal}
          onChange={(e) => setSliderVal(parseInt(e.target.value))}
          style={{ width: '100%', accentColor: '#8b5cf6' }}
        />
        <div style={{ 
          textAlign: 'center', 
          fontFamily: 'monospace', 
          fontSize: '1.5rem',
          color: `hsl(${sliderVal * 2.4}, 70%, 60%)`,
        }}>
          {sliderVal}
        </div>
      </div>

      {/* Toggle Switches */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>🔘 Clicky Toggles</h4>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          {toggles.map((on, idx) => (
            <button
              key={idx}
              onClick={() => {
                setToggles(t => { const n = [...t]; n[idx] = !n[idx]; return n; });
                // Click sound
                const ctx = new AudioContext();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.frequency.value = on ? 300 : 500;
                osc.type = 'square';
                gain.gain.value = 0.05;
                osc.start();
                osc.stop(ctx.currentTime + 0.05);
              }}
              style={{
                width: '60px',
                height: '30px',
                borderRadius: '15px',
                border: 'none',
                background: on ? '#22c55e' : '#374151',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background 0.2s ease',
              }}
            >
              <div style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                background: '#fff',
                position: 'absolute',
                top: '2px',
                left: on ? '32px' : '2px',
                transition: 'left 0.2s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }} />
            </button>
          ))}
        </div>
      </div>

      {/* Counter */}
      <div>
        <h4 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>🔢 Satisfying Counter</h4>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={() => setClickCount(c => Math.max(0, c - 1))}
            style={{ ...btnStyle, fontSize: '1.5rem', width: '50px' }}
          >
            −
          </button>
          <div style={{ 
            fontSize: '3rem', 
            fontFamily: 'monospace',
            minWidth: '100px',
            textAlign: 'center',
            color: '#f59e0b',
          }}>
            {clickCount}
          </div>
          <button 
            onClick={() => setClickCount(c => c + 1)}
            style={{ ...btnStyle, fontSize: '1.5rem', width: '50px' }}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

// === PI EXPLORER ===
const PI_DIGITS = '14159265358979323846264338327950288419716939937510582097494459230781640628620899862803482534211706798214808651328230664709384460955058223172535940812848111745028410270193852110555964462294895493038196442881097566593344612847564823378678316527120190914564856692346034861045432664821339360726024914127372458700660631558817488152092096282925409171536436789259036001133053054882046652138414695194151160943305727036575959195309218611738193261179310511854807446237996274956735188575272489122793818301194912';

function PiExplorer() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<{ position: number; context: string }[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});

  useEffect(() => {
    // Calculate digit frequency
    const freq: Record<string, number> = {};
    for (const d of PI_DIGITS) {
      freq[d] = (freq[d] || 0) + 1;
    }
    setStats(freq);
  }, []);

  const search = () => {
    if (!searchTerm) return;
    const positions: { position: number; context: string }[] = [];
    let idx = PI_DIGITS.indexOf(searchTerm);
    while (idx !== -1) {
      const start = Math.max(0, idx - 5);
      const end = Math.min(PI_DIGITS.length, idx + searchTerm.length + 5);
      const context = PI_DIGITS.substring(start, end);
      positions.push({ position: idx + 2, context }); // +2 for "3."
      idx = PI_DIGITS.indexOf(searchTerm, idx + 1);
    }
    setResults(positions);
  };

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <span style={{ fontSize: '3rem', fontFamily: 'serif' }}>π</span>
        <span style={{ fontSize: '1.5rem', opacity: 0.7 }}> = 3.{PI_DIGITS.substring(0, 50)}...</span>
      </div>
      
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1rem' }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value.replace(/[^0-9]/g, ''))}
          placeholder="Search for a number..."
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(0,0,0,0.3)',
            color: '#fff',
            fontSize: '1rem',
            width: '200px',
          }}
        />
        <button onClick={search} style={btnStyle}>🔍 Search</button>
      </div>

      {results.length > 0 && (
        <div style={{ 
          background: 'rgba(0,0,0,0.3)', 
          padding: '1rem', 
          borderRadius: '0.5rem',
          marginBottom: '1rem',
        }}>
          <strong>Found {results.length} occurrence(s):</strong>
          <div style={{ maxHeight: '150px', overflowY: 'auto', marginTop: '0.5rem' }}>
            {results.slice(0, 10).map((r, i) => (
              <div key={i} style={{ fontFamily: 'monospace', fontSize: '0.9rem', margin: '0.25rem 0' }}>
                Position {r.position}: ...{r.context.replace(searchTerm, `[${searchTerm}]`)}...
              </div>
            ))}
            {results.length > 10 && <div style={{ opacity: 0.6 }}>...and {results.length - 10} more</div>}
          </div>
        </div>
      )}

      <div style={{ marginTop: '1rem' }}>
        <h4 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Digit Frequency (first 500 digits)</h4>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {Object.entries(stats).sort(([a], [b]) => a.localeCompare(b)).map(([digit, count]) => (
            <div key={digit} style={{ 
              textAlign: 'center',
              padding: '0.5rem',
              background: 'rgba(100,100,255,0.2)',
              borderRadius: '0.25rem',
              minWidth: '40px',
            }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{digit}</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// === MORSE CODE ===
const MORSE_CODE: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
  '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
  '8': '---..', '9': '----.', ' ': '/',
};

const MORSE_REVERSE: Record<string, string> = Object.fromEntries(
  Object.entries(MORSE_CODE).map(([k, v]) => [v, k])
);

function MorseCode() {
  const [text, setText] = useState('');
  const [morse, setMorse] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  const textToMorse = (input: string) => {
    return input.toUpperCase().split('').map(c => MORSE_CODE[c] || '').join(' ');
  };

  const morseToText = (input: string) => {
    return input.split(' ').map(m => MORSE_REVERSE[m] || '').join('');
  };

  const handleTextChange = (value: string) => {
    setText(value);
    setMorse(textToMorse(value));
  };

  const handleMorseChange = (value: string) => {
    setMorse(value);
    setText(morseToText(value));
  };

  const playMorse = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 600;
    gain.gain.value = 0;
    osc.start();

    const dit = 0.1;
    const dah = dit * 3;
    const gap = dit;
    const letterGap = dit * 3;
    const wordGap = dit * 7;

    let time = ctx.currentTime;
    for (const char of morse) {
      if (char === '.') {
        gain.gain.setValueAtTime(0.2, time);
        gain.gain.setValueAtTime(0, time + dit);
        time += dit + gap;
      } else if (char === '-') {
        gain.gain.setValueAtTime(0.2, time);
        gain.gain.setValueAtTime(0, time + dah);
        time += dah + gap;
      } else if (char === ' ') {
        time += letterGap;
      } else if (char === '/') {
        time += wordGap;
      }
    }

    await new Promise(resolve => setTimeout(resolve, (time - ctx.currentTime) * 1000 + 100));
    osc.stop();
    setIsPlaying(false);
  };

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.25rem', opacity: 0.7 }}>Text:</label>
        <input
          type="text"
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="Type your message..."
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(0,0,0,0.3)',
            color: '#fff',
            fontSize: '1rem',
          }}
        />
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.25rem', opacity: 0.7 }}>Morse Code:</label>
        <input
          type="text"
          value={morse}
          onChange={(e) => handleMorseChange(e.target.value)}
          placeholder=".- -... -.-."
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(0,0,0,0.3)',
            color: '#4ade80',
            fontSize: '1.2rem',
            fontFamily: 'monospace',
            letterSpacing: '2px',
          }}
        />
      </div>

      <button 
        onClick={playMorse} 
        disabled={isPlaying || !morse}
        style={{ ...btnStyle, width: '100%', opacity: isPlaying ? 0.5 : 1 }}
      >
        {isPlaying ? '🔊 Playing...' : '▶ Play Morse Code'}
      </button>

      <div style={{ 
        marginTop: '1rem', 
        fontSize: '0.8rem', 
        opacity: 0.6,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))',
        gap: '0.25rem',
      }}>
        {Object.entries(MORSE_CODE).slice(0, 26).map(([letter, code]) => (
          <div key={letter} style={{ fontFamily: 'monospace' }}>
            {letter}: {code}
          </div>
        ))}
      </div>
    </div>
  );
}

// === DICE ROLLER ===
function DiceRoller() {
  const [results, setResults] = useState<{ die: string; value: number }[]>([]);
  const [total, setTotal] = useState(0);
  const [rolling, setRolling] = useState(false);

  const dice = [
    { name: 'D4', sides: 4, color: '#ef4444' },
    { name: 'D6', sides: 6, color: '#f59e0b' },
    { name: 'D8', sides: 8, color: '#22c55e' },
    { name: 'D10', sides: 10, color: '#3b82f6' },
    { name: 'D12', sides: 12, color: '#8b5cf6' },
    { name: 'D20', sides: 20, color: '#ec4899' },
    { name: 'D100', sides: 100, color: '#6366f1' },
  ];

  const roll = async (sides: number, name: string) => {
    setRolling(true);
    
    // Animate rolling
    for (let i = 0; i < 10; i++) {
      const tempValue = Math.floor(Math.random() * sides) + 1;
      setResults([{ die: name, value: tempValue }]);
      await new Promise(r => setTimeout(r, 50));
    }
    
    const value = Math.floor(Math.random() * sides) + 1;
    setResults(prev => [...prev.slice(-9), { die: name, value }]);
    setTotal(prev => prev + value);
    setRolling(false);
  };

  const clearResults = () => {
    setResults([]);
    setTotal(0);
  };

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginBottom: '1rem' }}>
        {dice.map(d => (
          <button
            key={d.name}
            onClick={() => roll(d.sides, d.name)}
            disabled={rolling}
            style={{
              ...btnStyle,
              background: d.color,
              minWidth: '60px',
              fontSize: '1rem',
              fontWeight: 'bold',
            }}
          >
            {d.name}
          </button>
        ))}
      </div>

      {results.length > 0 && (
        <div style={{ 
          background: 'rgba(0,0,0,0.3)', 
          padding: '1rem', 
          borderRadius: '0.5rem',
          marginBottom: '1rem',
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
            {results.map((r, i) => (
              <div key={i} style={{
                padding: '0.5rem 1rem',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '0.5rem',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{r.die}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{r.value}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '1.2rem' }}>
            Total: <strong style={{ color: '#4ade80' }}>{total}</strong>
          </div>
          <button onClick={clearResults} style={{ ...btnStyle, width: '100%', marginTop: '0.5rem' }}>
            Clear
          </button>
        </div>
      )}

      <p style={{ textAlign: 'center', fontSize: '0.8rem', opacity: 0.6 }}>
        Click a die to roll. Results are cumulative.
      </p>
    </div>
  );
}

// === PRIME SPIRAL (Ulam) ===
function PrimeSpiral() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState(200);

  const isPrime = (n: number): boolean => {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
    for (let i = 3; i <= Math.sqrt(n); i += 2) {
      if (n % i === 0) return false;
    }
    return true;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 300;
    const height = 300;
    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = GOD_CONFIG.theme.bg.primary;
    ctx.fillRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const scale = width / size;

    // Direction vectors: right, up, left, down
    const dx = [1, 0, -1, 0];
    const dy = [0, -1, 0, 1];

    let x = 0, y = 0;
    let dir = 0;
    let stepsInDir = 1;
    let stepsTaken = 0;
    let turnsAtCurrentSteps = 0;

    for (let n = 1; n <= size * size; n++) {
      if (isPrime(n)) {
        const px = centerX + x * scale;
        const py = centerY + y * scale;
        ctx.fillStyle = `hsl(${(n / (size * size)) * 360}, 70%, 60%)`;
        ctx.fillRect(px, py, Math.max(1, scale - 0.5), Math.max(1, scale - 0.5));
      }

      x += dx[dir];
      y += dy[dir];
      stepsTaken++;

      if (stepsTaken === stepsInDir) {
        stepsTaken = 0;
        dir = (dir + 1) % 4;
        turnsAtCurrentSteps++;
        if (turnsAtCurrentSteps === 2) {
          turnsAtCurrentSteps = 0;
          stepsInDir++;
        }
      }
    }
  }, [size]);

  return (
    <div>
      <canvas 
        ref={canvasRef}
        style={{ 
          borderRadius: '0.5rem',
          display: 'block',
          margin: '0 auto',
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem', justifyContent: 'center' }}>
        <span>Size:</span>
        <input
          type="range"
          min="50"
          max="400"
          value={size}
          onChange={(e) => setSize(parseInt(e.target.value))}
          style={{ width: '150px' }}
        />
        <span>{size}×{size}</span>
      </div>
      <p style={{ textAlign: 'center', fontSize: '0.8rem', opacity: 0.6, marginTop: '0.5rem' }}>
        The Ulam Spiral: Prime numbers form diagonal patterns. Why?
      </p>
    </div>
  );
}

// === SPECTRUM ANALYZER ===
function SpectrumAnalyzer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isListening, setIsListening] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number>();

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      setIsListening(true);
      draw();
    } catch (err) {
      console.error('Microphone access denied:', err);
      alert('Microphone access is required for this feature.');
    }
  };

  const stopListening = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (audioContextRef.current) audioContextRef.current.close();
    setIsListening(false);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    ctx.fillStyle = 'rgba(10, 10, 26, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 2.5;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const barHeight = (dataArray[i] / 255) * canvas.height;
      const hue = (i / bufferLength) * 360;
      ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      x += barWidth + 1;
    }

    animationRef.current = requestAnimationFrame(draw);
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  return (
    <div>
      <canvas 
        ref={canvasRef}
        width={400}
        height={200}
        style={{ 
          borderRadius: '0.5rem',
          display: 'block',
          margin: '0 auto',
          background: GOD_CONFIG.theme.bg.primary,
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
        <button
          onClick={isListening ? stopListening : startListening}
          style={{
            ...btnStyle,
            background: isListening ? '#ef4444' : '#22c55e',
          }}
        >
          {isListening ? '⏹ Stop' : '🎤 Start Listening'}
        </button>
      </div>
      <p style={{ textAlign: 'center', fontSize: '0.8rem', opacity: 0.6, marginTop: '0.5rem' }}>
        Real-time audio visualization from your microphone.
      </p>
    </div>
  );
}

// === SHARED STYLES ===
const btnStyle: React.CSSProperties = {
  padding: '0.5rem 1rem',
  borderRadius: '0.5rem',
  border: `1px solid ${GOD_CONFIG.theme.border.default}`,
  background: GOD_CONFIG.theme.bg.tertiary,
  color: GOD_CONFIG.theme.text.primary,
  cursor: 'pointer',
  fontSize: '0.9rem',
  fontFamily: GOD_CONFIG.typography.fontFamily.body,
  transition: 'all 0.2s ease',
};

// === MAIN COMPONENT ===
export default function NerdLab() {
  const [activeTool, setActiveTool] = useState<LabTool>('fractal');

  const renderTool = () => {
    switch (activeTool) {
      case 'fractal': return <FractalExplorer />;
      case 'life': return <GameOfLife />;
      case 'stim': return <StimBoard />;
      case 'pi': return <PiExplorer />;
      case 'morse': return <MorseCode />;
      case 'dice': return <DiceRoller />;
      case 'prime': return <PrimeSpiral />;
      case 'spectrum': return <SpectrumAnalyzer />;
    }
  };

  const currentTool = TOOLS.find(t => t.id === activeTool);

  return (
    <div style={{
      padding: '2rem',
      background: `linear-gradient(135deg, ${GOD_CONFIG.theme.bg.tertiary} 0%, ${GOD_CONFIG.theme.bg.primary} 100%)`,
      borderRadius: '1rem',
      color: GOD_CONFIG.theme.text.primary,
      fontFamily: GOD_CONFIG.typography.fontFamily.body,
      minHeight: '100%',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ 
          fontSize: '2rem', 
          marginBottom: '0.5rem',
          fontFamily: GOD_CONFIG.typography.fontFamily.display,
          color: GOD_CONFIG.theme.text.primary,
        }}>
          🧪 Nerd Lab
        </h2>
        <p style={{ color: GOD_CONFIG.theme.text.secondary, fontStyle: 'italic' }}>
          "The universe is not only queerer than we suppose, but queerer than we CAN suppose."
        </p>
      </div>

      {/* Tool Selector */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        justifyContent: 'center',
        marginBottom: '2rem',
      }}>
        {TOOLS.map(tool => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '2rem',
              border: activeTool === tool.id ? `2px solid ${GOD_CONFIG.theme.text.accent}` : `1px solid ${GOD_CONFIG.theme.border.default}`,
              background: activeTool === tool.id ? `${GOD_CONFIG.theme.text.accent}20` : GOD_CONFIG.theme.bg.secondary,
              color: activeTool === tool.id ? GOD_CONFIG.theme.text.accent : GOD_CONFIG.theme.text.primary,
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontFamily: GOD_CONFIG.typography.fontFamily.body,
              transition: 'all 0.2s ease',
            }}
          >
            {tool.icon} {tool.name}
          </button>
        ))}
      </div>

      {/* Current Tool Description */}
      <div style={{
        textAlign: 'center',
        marginBottom: '1.5rem',
        padding: '0.75rem',
        background: `${GOD_CONFIG.theme.text.accent}10`,
        border: `1px solid ${GOD_CONFIG.theme.text.accent}30`,
        borderRadius: '0.5rem',
        color: GOD_CONFIG.theme.text.secondary,
      }}>
        <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>{currentTool?.icon}</span>
        <strong style={{ color: GOD_CONFIG.theme.text.primary }}>{currentTool?.name}</strong>: {currentTool?.description}
      </div>

      {/* Tool Content */}
      <div style={{
        background: GOD_CONFIG.theme.bg.secondary,
        border: `1px solid ${GOD_CONFIG.theme.border.default}`,
        padding: '1.5rem',
        borderRadius: '0.75rem',
      }}>
        {renderTool()}
      </div>
    </div>
  );
}

