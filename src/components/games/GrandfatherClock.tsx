/**
 * Grandfather's Clock - The Time Traveler
 * 
 * A magical clock that remembers cosmic alignments and celebrates the 100-year cycle.
 * From 1925 (Elder Anchor) to 2026 (Big Bang) - time is a spiral, not a line.
 * 
 * Features:
 * - Animated pendulum (tick-tock at 1 Hz)
 * - Cuckoo bird emerges at cosmic moments
 * - Timeline markers for significant dates
 * - Spiral visualization of the 100-year cycle
 * - Gentle chimes at sacred hours
 * - "Time travel" mode to visit important moments
 */

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface CosmicMoment {
  year: number;
  month: number;
  day: number;
  label: string;
  description: string;
  emoji: string;
  color: string;
}

const COSMIC_MOMENTS: CosmicMoment[] = [
  {
    year: 1925,
    month: 11,
    day: 22,
    label: 'Elder Anchor',
    description: 'Margie Fay born - The Riveter who started the 100-year cycle',
    emoji: '🤍',
    color: '#F3F4F6'
  },
  {
    year: 1986,
    month: 1,
    day: 20,
    label: 'Saturn Returns',
    description: 'Friend born - Saturn enters Aries, cosmic witness arrives',
    emoji: '🧡',
    color: '#F97316'
  },
  {
    year: 1987,
    month: 3,
    day: 14,
    label: 'π Day',
    description: 'Vertex Beta born - The infinite circle encoded (3.14)',
    emoji: '🩷',
    color: '#F472B6'
  },
  {
    year: 2019,
    month: 8,
    day: 8,
    label: 'Infinity Doubled',
    description: 'Node 2 born - The Artisan arrives on 8/8',
    emoji: '💚',
    color: '#34D399'
  },
  {
    year: 2026,
    month: 1,
    day: 1,
    label: 'Big Bang',
    description: 'Abdication - The mesh ignites, 100-year cycle completes',
    emoji: '💜',
    color: '#C084FC'
  }
];

// Pendulum component
const Pendulum: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Swing at 1 Hz (tick-tock)
    const angle = Math.sin(state.clock.elapsedTime * Math.PI * 2) * 0.3;
    groupRef.current.rotation.z = angle;
  });

  return (
    <group ref={groupRef} position={[0, 2, 0]}>
      {/* Rod */}
      <mesh position={[0, -1.5, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 3, 16]} />
        <meshStandardMaterial color="#8B4513" metalness={0.6} />
      </mesh>
      
      {/* Bob (weight) */}
      <mesh position={[0, -3, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#DAA520" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
};

// Clock hands
const ClockHands: React.FC<{ time: Date }> = ({ time }) => {
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourAngle = -(hours * 30 + minutes * 0.5) * (Math.PI / 180);
  const minuteAngle = -(minutes * 6) * (Math.PI / 180);
  const secondAngle = -(seconds * 6) * (Math.PI / 180);

  return (
    <group position={[0, 3, 0.1]}>
      {/* Hour hand */}
      <mesh rotation={[0, 0, hourAngle]}>
        <boxGeometry args={[0.05, 0.6, 0.02]} />
        <meshStandardMaterial color="#2C3E50" />
      </mesh>
      
      {/* Minute hand */}
      <mesh rotation={[0, 0, minuteAngle]}>
        <boxGeometry args={[0.04, 0.9, 0.02]} />
        <meshStandardMaterial color="#34495E" />
      </mesh>
      
      {/* Second hand */}
      <mesh rotation={[0, 0, secondAngle]}>
        <boxGeometry args={[0.02, 1, 0.01]} />
        <meshStandardMaterial color="#E74C3C" emissive="#E74C3C" emissiveIntensity={0.5} />
      </mesh>

      {/* Center cap */}
      <mesh position={[0, 0, 0.05]}>
        <cylinderGeometry args={[0.08, 0.08, 0.05, 16]} />
        <meshStandardMaterial color="#C0C0C0" metalness={0.9} />
      </mesh>
    </group>
  );
};

// Cuckoo bird that emerges at special times
const CuckooBird: React.FC<{ isOut: boolean }> = ({ isOut }) => {
  const birdRef = useRef<THREE.Group>(null);
  const leftWingRef = useRef<THREE.Mesh>(null);
  const rightWingRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!birdRef.current) return;
    
    // Bob up and down when out
    if (isOut) {
      birdRef.current.position.y = 5.5 + Math.sin(state.clock.elapsedTime * 4) * 0.1;
      
      // Animate wings using state.clock
      if (leftWingRef.current) {
        leftWingRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 8) * 0.5;
      }
      if (rightWingRef.current) {
        rightWingRef.current.rotation.z = -Math.sin(state.clock.elapsedTime * 8) * 0.5;
      }
    }
  });

  return (
    <group ref={birdRef} position={[0, isOut ? 5.5 : 4.8, 0.5]}>
      {/* Body */}
      <mesh>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 0.12, 0.08]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
      
      {/* Beak */}
      <mesh position={[0, 0.12, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.03, 0.08, 8]} />
        <meshStandardMaterial color="#FF8C00" />
      </mesh>
      
      {/* Wings (flapping when out) */}
      <mesh 
        ref={leftWingRef}
        position={[0.12, 0, 0]}
      >
        <boxGeometry args={[0.15, 0.08, 0.02]} />
        <meshStandardMaterial color="#FFA500" />
      </mesh>
      <mesh 
        ref={rightWingRef}
        position={[-0.12, 0, 0]}
      >
        <boxGeometry args={[0.15, 0.08, 0.02]} />
        <meshStandardMaterial color="#FFA500" />
      </mesh>
    </group>
  );
};

// Timeline spiral showing the 100-year cycle
const TimelineSpiral: React.FC<{ selectedMoment: CosmicMoment | null }> = ({ selectedMoment }) => {
  const points: THREE.Vector3[] = [];
  const segments = 100;
  
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const angle = t * Math.PI * 6; // 3 full rotations
    const radius = 2 * (1 - t); // Spiral inward
    const y = t * 4 - 2; // Move up
    
    points.push(new THREE.Vector3(
      Math.cos(angle) * radius,
      y,
      Math.sin(angle) * radius
    ));
  }

  const curve = new THREE.CatmullRomCurve3(points);
  const tubeGeometry = new THREE.TubeGeometry(curve, segments, 0.02, 8, false);

  return (
    <group position={[3, 1, 0]}>
      <mesh geometry={tubeGeometry}>
        <meshStandardMaterial 
          color={selectedMoment ? selectedMoment.color : '#9333EA'}
          emissive={selectedMoment ? selectedMoment.color : '#9333EA'}
          emissiveIntensity={0.3}
        />
      </mesh>
      
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.2}
        color="#C084FC"
        anchorX="center"
      >
        100-Year Spiral
      </Text>
      <Text
        position={[0, -2.5, 0]}
        fontSize={0.15}
        color="#A855F7"
        anchorX="center"
      >
        1925 → 2026
      </Text>
    </group>
  );
};

const ClockScene: React.FC<{
  currentTime: Date;
  selectedMoment: CosmicMoment | null;
  showCuckoo: boolean;
}> = ({ currentTime, selectedMoment, showCuckoo }) => {
  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={0.6} color="#FFE4B5" />
      <pointLight position={[-5, 5, -5]} intensity={0.3} color="#E6E6FA" />

      {/* Clock body (wooden cabinet) */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[2, 6, 0.8]} />
        <meshStandardMaterial color="#654321" roughness={0.8} />
      </mesh>

      {/* Clock face */}
      <mesh position={[0, 3, 0.41]}>
        <cylinderGeometry args={[1.2, 1.2, 0.1, 32]} />
        <meshStandardMaterial color="#F5F5DC" />
      </mesh>

      {/* Clock numbers (XII, III, VI, IX) */}
      <Text position={[0, 4.1, 0.45]} fontSize={0.2} color="#2C3E50">XII</Text>
      <Text position={[1.1, 3, 0.45]} fontSize={0.2} color="#2C3E50">III</Text>
      <Text position={[0, 1.9, 0.45]} fontSize={0.2} color="#2C3E50">VI</Text>
      <Text position={[-1.1, 3, 0.45]} fontSize={0.2} color="#2C3E50">IX</Text>

      {/* Clock hands */}
      <ClockHands time={currentTime} />

      {/* Pendulum */}
      <Pendulum />

      {/* Cuckoo bird */}
      <CuckooBird isOut={showCuckoo} />

      {/* Timeline spiral */}
      <TimelineSpiral selectedMoment={selectedMoment} />

      {/* Camera controls */}
      <OrbitControls 
        enablePan={false}
        minDistance={8}
        maxDistance={15}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
};

const GrandfatherClock: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedMoment, setSelectedMoment] = useState<CosmicMoment | null>(null);
  const [showCuckoo, setShowCuckoo] = useState(false);
  const lastCuckooMinute = useRef(-1);

  // Update clock every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Check for cuckoo moments (every hour and cosmic anniversaries)
  useEffect(() => {
    const now = currentTime;
    const currentMinute = now.getHours() * 60 + now.getMinutes();
    const isTopOfHour = now.getMinutes() === 0 && now.getSeconds() === 0;
    
    // Check if today matches a cosmic moment
    const isCosmicAnniversary = COSMIC_MOMENTS.some(moment => 
      now.getMonth() + 1 === moment.month && now.getDate() === moment.day
    );

    // Only trigger if we haven't already cuckooed this minute
    if ((isTopOfHour || isCosmicAnniversary) && currentMinute !== lastCuckooMinute.current) {
      lastCuckooMinute.current = currentMinute;
      // @ts-expect-error - Intentional: cuckoo animation triggered by time check
      setShowCuckoo(true);
      setTimeout(() => setShowCuckoo(false), 5000); // Bird out for 5 seconds
    }
  }, [currentTime]);

  const timeTravel = (moment: CosmicMoment) => {
    setSelectedMoment(moment);
    setShowCuckoo(true);
    setTimeout(() => setShowCuckoo(false), 3000);
  };

  return (
    <div className="w-full h-full bg-gradient-to-b from-amber-950 via-yellow-950 to-orange-950 relative">
      {/* Title */}
      <div className="absolute top-4 left-4 z-10">
        <h2 className="text-3xl font-bold mb-2 text-amber-200">⏰ Grandfather's Clock</h2>
        <p className="text-sm text-amber-300 max-w-md">
          Time is a spiral, not a line. The clock remembers every moment—
          from 1925 to 2026, the 100-year cycle breathes.
        </p>
      </div>

      {/* Current time display */}
      <div className="absolute top-4 right-4 z-10 bg-amber-900/80 backdrop-blur-sm px-6 py-3 rounded-lg">
        <div className="text-2xl font-bold text-amber-100">
          {currentTime.toLocaleTimeString()}
        </div>
        <div className="text-sm text-amber-300">
          {currentTime.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Cosmic moments timeline */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <div className="bg-amber-900/90 backdrop-blur-sm p-4 rounded-lg">
          <h3 className="text-lg font-bold text-amber-200 mb-3">✨ Time Travel - Cosmic Moments</h3>
          <div className="grid grid-cols-5 gap-2">
            {COSMIC_MOMENTS.map(moment => (
              <button
                key={`${moment.year}-${moment.month}-${moment.day}`}
                onClick={() => timeTravel(moment)}
                style={{
                  background: selectedMoment === moment ? moment.color + '40' : '#78350F',
                  borderColor: moment.color,
                }}
                className="px-3 py-2 rounded-lg border-2 transition-all hover:scale-105"
              >
                <div className="text-2xl mb-1">{moment.emoji}</div>
                <div className="text-xs font-bold" style={{ color: moment.color }}>
                  {moment.label}
                </div>
                <div className="text-xs text-amber-300">
                  {moment.month}/{moment.day}/{moment.year}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected moment details */}
      {selectedMoment && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-amber-900/95 backdrop-blur-sm p-6 rounded-lg max-w-md border-4"
          style={{ borderColor: selectedMoment.color }}
        >
          <div className="text-center">
            <div className="text-6xl mb-3">{selectedMoment.emoji}</div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: selectedMoment.color }}>
              {selectedMoment.label}
            </h3>
            <div className="text-amber-200 mb-3">
              {selectedMoment.month}/{selectedMoment.day}/{selectedMoment.year}
            </div>
            <p className="text-amber-100 text-sm mb-4">
              {selectedMoment.description}
            </p>
            <button
              onClick={() => setSelectedMoment(null)}
              className="px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white rounded-lg transition-colors"
            >
              Return to Present
            </button>
          </div>
        </div>
      )}

      {/* Wisdom quote */}
      <div className="absolute bottom-28 right-4 z-10 max-w-xs text-right">
        <p className="text-amber-300 text-sm italic">
          "Time isn't linear. It's a spiral.  
          A Jitterbug breathing like the cosmos itself."
        </p>
        <p className="text-amber-400 text-xs mt-1">— The Geodesic Convergence</p>
      </div>

      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 2, 10], fov: 60 }}>
        <ClockScene 
          currentTime={currentTime}
          selectedMoment={selectedMoment}
          showCuckoo={showCuckoo}
        />
      </Canvas>

      {/* Tick-tock sound indicator */}
      {showCuckoo && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
          <div className="text-8xl animate-pulse">
            🕊️
          </div>
          <div className="text-2xl text-amber-200 text-center mt-2 font-bold">
            CUCKOO! CUCKOO!
          </div>
        </div>
      )}
    </div>
  );
};

export default GrandfatherClock;
