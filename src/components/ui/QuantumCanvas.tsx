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
 * ║                        THE QUANTUM CANVAS                                      ║
 * ║         Fisher-Escola Cognitive Dynamics Visualization                         ║
 * ║                                                                                 ║
 * ║  "The mathematics of consciousness is not abstract—                            ║
 * ║   it is the very geometry of how we experience reality."                       ║
 * ╚═══════════════════════════════════════════════════════════════════════════════╝
 * 
 * This component visualizes the mathematical beauty underlying the Cognitive Shield:
 * 
 * 1. FISHER INFORMATION - The "sharpness" of probability distributions
 *    I(θ) = E[(∂/∂θ log f(X;θ))²]
 *    High Fisher = precise beliefs, Low Fisher = diffuse uncertainty
 * 
 * 2. OLLIVIER-RICCI CURVATURE - The "shape" of information flow
 *    κ(x,y) = 1 - W₁(μₓ,μᵧ)/d(x,y)
 *    Positive = echo chambers, Negative = bottlenecks, Zero = healthy flow
 * 
 * 3. GOLDEN RATIO SPIRALS - φ = (1 + √5)/2 ≈ 1.618
 *    Nature's optimization pattern, embedded in our healing protocols
 * 
 * 4. TETRAHEDRON TRUST GEOMETRY - Minimal stable 3D structure
 *    4 nodes, 6 edges, each edge a vector of trust/voltage
 */

import { useRef, useEffect, useMemo } from 'react';
import { useShieldStore, useVoltageStrip, useBufferedMessages } from '../../stores/shield.store';
import { useHeartbeatStore } from '../../stores/heartbeat.store';

// ═══════════════════════════════════════════════════════════════════════════════
// MATHEMATICAL CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const PHI = (1 + Math.sqrt(5)) / 2;           // Golden Ratio: 1.618033988749895
const PHI_INV = 1 / PHI;                       // 0.618033988749895
const TAU = Math.PI * 2;                       // Full circle
const SQRT2 = Math.sqrt(2);
const SQRT3 = Math.sqrt(3);

// Tetrahedron vertices in unit sphere (normalized)
const TETRA_VERTICES = [
  { x: 1, y: 1, z: 1 },      // A: Self
  { x: 1, y: -1, z: -1 },    // B: Other
  { x: -1, y: 1, z: -1 },    // C: Context
  { x: -1, y: -1, z: 1 },    // D: Engine
].map(v => {
  const len = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  return { x: v.x / len, y: v.y / len, z: v.z / len };
});

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface QuantumCanvasProps {
  width?: number;
  height?: number;
  showMath?: boolean;
  interactive?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  hue: number;
  size: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// FISHER INFORMATION VISUALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

function calculateFisherInformation(voltage: number, spoons: number): number {
  // Fisher Information measures the "sharpness" of our belief state
  // High voltage + low spoons = low Fisher (diffuse, uncertain)
  // Low voltage + high spoons = high Fisher (precise, confident)
  
  const voltageNorm = Math.max(0, Math.min(1, voltage / 100));
  const spoonsNorm = Math.max(0, Math.min(1, spoons / 12));
  
  // Fisher = (1 - voltage) * spoons² (simplified model)
  // Peaks when voltage is 0 and spoons are full
  return (1 - voltageNorm) * spoonsNorm * spoonsNorm;
}


// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function QuantumCanvas({ 
  width = 900, 
  height = 500,
  showMath = true,
}: QuantumCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef(0);
  
  // State from stores
  const voltage = useShieldStore(state => state.voltage);
  const curvature = useShieldStore(state => state.curvature);
  const voltageStrip = useVoltageStrip();
  const bufferedMessages = useBufferedMessages();
  const spoons = useHeartbeatStore(state => state.operator.spoons);
  const heartbeat = useHeartbeatStore(state => state.operator.heartbeat);
  
  // Derived calculations
  const fisherInfo = useMemo(() => 
    calculateFisherInformation(voltage, spoons), 
    [voltage, spoons]
  );
  
  // ═══════════════════════════════════════════════════════════════════════════
  // GOLDEN SPIRAL GENERATOR
  // ═══════════════════════════════════════════════════════════════════════════
  
  const generateGoldenSpiral = (
    ctx: CanvasRenderingContext2D, 
    centerX: number, 
    centerY: number, 
    scale: number,
    rotationOffset: number,
    color: string,
    alpha: number
  ) => {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = 2;
    
    for (let i = 0; i < 720; i++) {
      const theta = (i / 180) * Math.PI + rotationOffset;
      const r = scale * Math.pow(PHI, (theta - rotationOffset) / (Math.PI / 2));
      const x = centerX + r * Math.cos(theta);
      const y = centerY + r * Math.sin(theta);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.stroke();
    ctx.globalAlpha = 1;
  };
  
  // ═══════════════════════════════════════════════════════════════════════════
  // TETRAHEDRON RENDERER
  // ═══════════════════════════════════════════════════════════════════════════
  
  const renderTetrahedron = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    size: number,
    rotation: number,
    voltageLevel: number
  ) => {
    // 3D to 2D projection with rotation
    const project = (v: typeof TETRA_VERTICES[0], rot: number) => {
      // Rotate around Y axis
      const cosR = Math.cos(rot);
      const sinR = Math.sin(rot);
      const x = v.x * cosR - v.z * sinR;
      const z = v.x * sinR + v.z * cosR;
      
      // Simple perspective projection
      const perspective = 2 / (2 - z * 0.3);
      return {
        x: centerX + x * size * perspective,
        y: centerY + v.y * size * perspective * 0.8,
        z: z,
        scale: perspective
      };
    };
    
    const projected = TETRA_VERTICES.map(v => project(v, rotation));
    
    // Node colors based on Tetrahedron Protocol
    const nodeColors = [
      '#00B4D8', // A - Self (cyan)
      '#F97316', // B - Other (orange)
      '#7C3AED', // C - Context (purple)
      '#10B981', // D - Engine (green)
    ];
    
    const nodeLabels = ['Self', 'Other', 'Context', 'Engine'];
    
    // Draw edges with voltage-based glow
    const edges = [
      [0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]
    ];
    
    // Sort edges by average z for proper depth
    const sortedEdges = edges.map(([i, j]) => ({
      i, j, 
      avgZ: (projected[i].z + projected[j].z) / 2
    })).sort((a, b) => a.avgZ - b.avgZ);
    
    // Draw edges
    sortedEdges.forEach(({ i, j }) => {
      const p1 = projected[i];
      const p2 = projected[j];
      
      // Edge color gradient
      const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
      gradient.addColorStop(0, nodeColors[i] + '80');
      gradient.addColorStop(1, nodeColors[j] + '80');
      
      ctx.beginPath();
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2 + voltageLevel * 0.02;
      ctx.shadowBlur = voltageLevel * 0.3;
      ctx.shadowColor = voltageLevel > 50 ? '#F59E0B' : '#00B4D8';
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
      ctx.shadowBlur = 0;
    });
    
    // Sort and draw nodes
    const sortedNodes = projected.map((p, i) => ({ ...p, i }))
      .sort((a, b) => a.z - b.z);
    
    sortedNodes.forEach(({ x, y, scale, i }) => {
      const nodeSize = (12 + scale * 8) * (1 + voltageLevel * 0.005);
      
      // Glow
      ctx.beginPath();
      ctx.arc(x, y, nodeSize * 1.5, 0, TAU);
      ctx.fillStyle = nodeColors[i] + '30';
      ctx.fill();
      
      // Node
      ctx.beginPath();
      ctx.arc(x, y, nodeSize, 0, TAU);
      ctx.fillStyle = nodeColors[i];
      ctx.shadowBlur = 15;
      ctx.shadowColor = nodeColors[i];
      ctx.fill();
      ctx.shadowBlur = 0;
      
      // Label
      if (showMath) {
        ctx.fillStyle = '#F3F4F6';
        ctx.font = '11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(nodeLabels[i], x, y + nodeSize + 14);
      }
    });
  };
  
  // ═══════════════════════════════════════════════════════════════════════════
  // FISHER INFORMATION WAVE
  // ═══════════════════════════════════════════════════════════════════════════
  
  const renderFisherWave = (
    ctx: CanvasRenderingContext2D,
    centerY: number,
    width: number,
    time: number,
    fisherValue: number
  ) => {
    ctx.beginPath();
    
    // Fisher Information controls wave "sharpness" and amplitude
    const amplitude = 30 * (1 - fisherValue * 0.5);
    
    for (let x = 0; x < width; x++) {
      const normalizedX = (x / width) * TAU * 3;
      
      // Multi-frequency wave (quantum superposition metaphor)
      const y = centerY + 
        Math.sin(normalizedX + time) * amplitude +
        Math.sin(normalizedX * PHI + time * PHI) * amplitude * 0.5 +
        Math.sin(normalizedX * PHI * PHI + time * PHI_INV) * amplitude * 0.25;
      
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    // Gradient based on Fisher value
    const gradient = ctx.createLinearGradient(0, centerY - 50, 0, centerY + 50);
    gradient.addColorStop(0, `hsla(${160 + fisherValue * 60}, 80%, 60%, 0.1)`);
    gradient.addColorStop(0.5, `hsla(${160 + fisherValue * 60}, 80%, 60%, 0.6)`);
    gradient.addColorStop(1, `hsla(${160 + fisherValue * 60}, 80%, 60%, 0.1)`);
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2 + fisherValue * 2;
    ctx.stroke();
  };
  
  // ═══════════════════════════════════════════════════════════════════════════
  // PARTICLE SYSTEM (Energy Flow Visualization)
  // ═══════════════════════════════════════════════════════════════════════════
  
  const updateParticles = (width: number, height: number, voltage: number) => {
    const particles = particlesRef.current;
    
    // Spawn new particles based on voltage
    const spawnRate = Math.floor(voltage * 0.1) + 1;
    for (let i = 0; i < spawnRate; i++) {
      if (particles.length < 100) {
        particles.push({
          x: Math.random() * width,
          y: height + 10,
          vx: (Math.random() - 0.5) * 2,
          vy: -1 - Math.random() * 3,
          life: 1,
          maxLife: 60 + Math.random() * 60,
          hue: voltage > 50 ? 30 + Math.random() * 30 : 180 + Math.random() * 40,
          size: 2 + Math.random() * 4
        });
      }
    }
    
    // Update existing particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life++;
      
      // Golden spiral motion
      const spiralForce = 0.02;
      p.vx += Math.cos(p.life * 0.1) * spiralForce;
      
      if (p.life > p.maxLife || p.y < -10) {
        particles.splice(i, 1);
      }
    }
  };
  
  const renderParticles = (ctx: CanvasRenderingContext2D) => {
    particlesRef.current.forEach(p => {
      const alpha = 1 - (p.life / p.maxLife);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * alpha, 0, TAU);
      ctx.fillStyle = `hsla(${p.hue}, 80%, 60%, ${alpha * 0.8})`;
      ctx.fill();
    });
  };
  
  // ═══════════════════════════════════════════════════════════════════════════
  // MINIMAL STATUS READOUT - Centered at bottom, clean
  // ═══════════════════════════════════════════════════════════════════════════
  
  const renderStatusReadout = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Only show centered status at bottom - no overlapping text
    const bottomY = height - 20;
    ctx.fillStyle = '#F3F4F690';
    ctx.font = '13px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(
      `V(t) = ${voltage.toFixed(1)} | Spoons: ${spoons.toFixed(1)}/12 | Heartbeat: ${(heartbeat || 'NORMAL').toUpperCase()}`,
      width / 2,
      bottomY
    );
    ctx.textAlign = 'left';
  };
  
  // ═══════════════════════════════════════════════════════════════════════════
  // MAIN ANIMATION LOOP
  // ═══════════════════════════════════════════════════════════════════════════
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const animate = () => {
      timeRef.current += 0.02;
      const time = timeRef.current;
      
      // Clear with slight trail effect
      ctx.fillStyle = 'rgba(17, 24, 39, 0.15)';
      ctx.fillRect(0, 0, width, height);
      
      // Background gradient
      const bgGradient = ctx.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, Math.max(width, height) * 0.7
      );
      bgGradient.addColorStop(0, 'rgba(31, 41, 55, 0.3)');
      bgGradient.addColorStop(1, 'rgba(17, 24, 39, 0.1)');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);
      
      // Golden spirals (background)
      generateGoldenSpiral(ctx, width * 0.3, height * 0.5, 5, time * 0.2, '#F59E0B', 0.15);
      generateGoldenSpiral(ctx, width * 0.7, height * 0.5, 5, -time * 0.2 + Math.PI, '#00B4D8', 0.15);
      
      // Fisher wave
      renderFisherWave(ctx, height * 0.75, width, time, fisherInfo);
      
      // Particles
      updateParticles(width, height, voltage);
      renderParticles(ctx);
      
      // Tetrahedron (center)
      renderTetrahedron(ctx, width / 2, height * 0.4, 80, time * 0.3, voltage);
      
      // Status readout (always shown, minimal)
      renderStatusReadout(ctx, width, height);
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [width, height, voltage, curvature, fisherInfo, spoons, heartbeat, showMath, bufferedMessages.length, voltageStrip.label]);
  
  return (
    <div style={{ position: 'relative' }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          borderRadius: '16px',
          border: '1px solid #374151',
          background: '#111827',
        }}
      />
      
    </div>
  );
}

export default QuantumCanvas;
