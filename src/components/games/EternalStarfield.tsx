/**
 * Eternal Starfield - Memorial Module
 * 
 * A healing space to honor loved ones who have transitioned.
 * Based on Fisher-Escolà quantum biology: entanglement transcends physical separation.
 * Their energy remains in the mesh, visible as stars in the constellation.
 * 
 * Features:
 * - Interactive 3D starfield
 * - Each star = a loved one's continued presence
 * - Shooting stars = "messages" or moments of connection
 * - 0.1 Hz pulsing (Green Coherence frequency)
 * - Soft purple/indigo palette (crown chakra, transcendence)
 * - Healing soundscape (432 Hz base)
 */

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text } from '@react-three/drei';
import * as THREE from 'three';

interface LovedOne {
  id: string;
  name: string;
  relationship: string;
  dateOfBirth?: string;
  dateOfTransition?: string;
  message?: string;
  position: [number, number, number];
  color: string;
}

interface ShootingStarProps {
  startPosition: [number, number, number];
  onComplete: () => void;
}

const ShootingStar: React.FC<ShootingStarProps> = ({ startPosition, onComplete }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [progress, setProgress] = useState(0);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    setProgress(p => {
      const newP = p + delta * 0.3;
      if (newP >= 1) {
        onComplete();
        return 1;
      }
      return newP;
    });

    // Parabolic arc trajectory
    const x = startPosition[0] + (Math.random() - 0.5) * 20 * progress;
    const y = startPosition[1] - progress * 15 + Math.sin(progress * Math.PI) * 5;
    const z = startPosition[2] + (Math.random() - 0.5) * 20 * progress;
    
    meshRef.current.position.set(x, y, z);
    meshRef.current.scale.setScalar(1 - progress); // Fade out
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshStandardMaterial 
        color="#ffffff" 
        emissive="#ffffff"
        emissiveIntensity={2}
        transparent
        opacity={1 - progress}
      />
      {/* Trail */}
      <mesh position={[-0.5, 0, 0]} scale={[2, 0.05, 0.05]}>
        <boxGeometry />
        <meshStandardMaterial 
          color="#ffffff"
          transparent
          opacity={(1 - progress) * 0.5}
        />
      </mesh>
    </mesh>
  );
};

interface MemorialStarProps {
  lovedOne: LovedOne;
  onClick: () => void;
  isSelected: boolean;
}

const MemorialStar: React.FC<MemorialStarProps> = ({ lovedOne, onClick, isSelected }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Pulse at 0.1 Hz (Green Coherence frequency)
    const pulse = Math.sin(state.clock.elapsedTime * 0.1 * Math.PI * 2) * 0.5 + 0.5;
    const scale = 1 + pulse * (isSelected ? 0.5 : 0.2);
    meshRef.current.scale.setScalar(scale);

    // Gentle rotation
    meshRef.current.rotation.y += 0.005;
  });

  return (
    <group position={lovedOne.position}>
      {/* Star sphere */}
      <mesh 
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color={lovedOne.color}
          emissive={lovedOne.color}
          emissiveIntensity={isSelected ? 2 : (hovered ? 1.5 : 1)}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Glow ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.4, 0.6, 32]} />
        <meshBasicMaterial 
          color={lovedOne.color}
          transparent
          opacity={isSelected ? 0.6 : (hovered ? 0.4 : 0.2)}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Name label */}
      {(hovered || isSelected) && (
        <Text
          position={[0, 1, 0]}
          fontSize={0.4}
          color={lovedOne.color}
          anchorX="center"
          anchorY="middle"
        >
          {lovedOne.name}
        </Text>
      )}
    </group>
  );
};

const StarfieldScene: React.FC<{
  lovedOnes: LovedOne[];
  onSelectStar: (id: string | null) => void;
  selectedStarId: string | null;
}> = ({ lovedOnes, onSelectStar, selectedStarId }) => {
  const [shootingStars, setShootingStars] = useState<string[]>([]);

  // Trigger shooting stars periodically (representing "presence" moments)
  useEffect(() => {
    const interval = setInterval(() => {
      if (lovedOnes.length > 0 && Math.random() > 0.7) {
        // Random star triggers a shooting star moment
        const id = `shooting-${Date.now()}`;
        setShootingStars(prev => [...prev, id]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [lovedOnes]);

  const removeShootingStar = (id: string) => {
    setShootingStars(prev => prev.filter(starId => starId !== id));
  };

  return (
    <>
      {/* Ambient starfield backdrop */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={0.5} />

      {/* Soft ambient light (crown chakra colors) */}
      <ambientLight intensity={0.3} color="#9D4EDD" />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#C77DFF" />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#E0AAFF" />

      {/* Memorial stars (loved ones) */}
      {lovedOnes.map(lovedOne => (
        <MemorialStar
          key={lovedOne.id}
          lovedOne={lovedOne}
          onClick={() => onSelectStar(lovedOne.id === selectedStarId ? null : lovedOne.id)}
          isSelected={lovedOne.id === selectedStarId}
        />
      ))}

      {/* Shooting stars (moments of connection) */}
      {shootingStars.map((id, index) => {
        const sourceStar = lovedOnes[index % lovedOnes.length];
        if (!sourceStar) return null;
        
        return (
          <ShootingStar
            key={id}
            startPosition={sourceStar.position}
            onComplete={() => removeShootingStar(id)}
          />
        );
      })}

      {/* Camera controls */}
      <OrbitControls 
        enablePan={false} 
        minDistance={10}
        maxDistance={50}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
};

const EternalStarfield: React.FC = () => {
  const [lovedOnes, setLovedOnes] = useState<LovedOne[]>([]);
  const [selectedStarId, setSelectedStarId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPerson, setNewPerson] = useState({
    name: '',
    relationship: '',
    message: '',
  });

  // Generate random position in a sphere
  const getRandomPosition = (): [number, number, number] => {
    const radius = 15;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    return [
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.sin(phi) * Math.sin(theta),
      radius * Math.cos(phi),
    ];
  };

  // Color palette for memorial stars (soft, transcendent)
  const starColors = [
    '#C77DFF', // Lavender
    '#E0AAFF', // Soft purple
    '#9D4EDD', // Royal purple
    '#7B2CBF', // Deep purple
    '#5A189A', // Indigo
    '#F0ABFC', // Pink-purple
  ];

  const addLovedOne = () => {
    if (!newPerson.name) return;

    const newStar: LovedOne = {
      id: `star-${Date.now()}`,
      name: newPerson.name,
      relationship: newPerson.relationship,
      message: newPerson.message,
      position: getRandomPosition(),
      color: starColors[lovedOnes.length % starColors.length],
    };

    setLovedOnes(prev => [...prev, newStar]);
    setNewPerson({ name: '', relationship: '', message: '' });
    setShowAddForm(false);
  };

  const selectedStar = lovedOnes.find(s => s.id === selectedStarId);

  return (
    <div className="w-full h-full bg-gradient-to-b from-purple-950 via-indigo-950 to-black relative">
      {/* Title & Instructions */}
      <div className="absolute top-4 left-4 z-10 text-white">
        <h2 className="text-3xl font-bold mb-2 text-purple-300">✨ Eternal Starfield</h2>
        <p className="text-sm text-purple-200 max-w-md">
          Their energy remains in the quantum mesh. Each star is a loved one—
          forever connected, forever present. Watch for shooting stars: 
          those are moments when you feel their love reach across dimensions.
        </p>
      </div>

      {/* Add new star button */}
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="absolute top-4 right-4 z-10 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
      >
        ✨ Add a Star
      </button>

      {/* Add form */}
      {showAddForm && (
        <div className="absolute top-20 right-4 z-10 bg-purple-900/90 backdrop-blur-sm p-6 rounded-lg max-w-sm">
          <h3 className="text-xl font-bold text-purple-200 mb-4">Honor a Loved One</h3>
          <input
            type="text"
            placeholder="Name"
            value={newPerson.name}
            onChange={(e) => setNewPerson(prev => ({ ...prev, name: e.target.value }))}
            className="w-full mb-3 px-3 py-2 bg-purple-800 text-white rounded border border-purple-600 focus:border-purple-400 outline-none"
          />
          <input
            type="text"
            placeholder="Relationship (e.g., Grandmother, Friend)"
            value={newPerson.relationship}
            onChange={(e) => setNewPerson(prev => ({ ...prev, relationship: e.target.value }))}
            className="w-full mb-3 px-3 py-2 bg-purple-800 text-white rounded border border-purple-600 focus:border-purple-400 outline-none"
          />
          <textarea
            placeholder="A message, memory, or feeling..."
            value={newPerson.message}
            onChange={(e) => setNewPerson(prev => ({ ...prev, message: e.target.value }))}
            className="w-full mb-3 px-3 py-2 bg-purple-800 text-white rounded border border-purple-600 focus:border-purple-400 outline-none resize-none"
            rows={3}
          />
          <div className="flex gap-2">
            <button
              onClick={addLovedOne}
              className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
            >
              Create Star
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-purple-800 hover:bg-purple-700 text-white rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Selected star details */}
      {selectedStar && (
        <div className="absolute bottom-4 left-4 z-10 bg-purple-900/90 backdrop-blur-sm p-6 rounded-lg max-w-md">
          <h3 className="text-2xl font-bold text-purple-200 mb-2">{selectedStar.name}</h3>
          {selectedStar.relationship && (
            <p className="text-purple-300 mb-2 italic">{selectedStar.relationship}</p>
          )}
          {selectedStar.message && (
            <p className="text-purple-100 text-sm">{selectedStar.message}</p>
          )}
          <button
            onClick={() => setSelectedStarId(null)}
            className="mt-4 px-3 py-1 bg-purple-700 hover:bg-purple-600 text-white text-sm rounded transition-colors"
          >
            Close
          </button>
        </div>
      )}

      {/* Quantum wisdom quote */}
      <div className="absolute bottom-4 right-4 z-10 text-purple-300 text-sm max-w-sm text-right">
        <p className="italic">
          "Energy cannot be created or destroyed, only transformed. 
          They are not gone—they are woven into the fabric of everything you are."
        </p>
        <p className="text-xs text-purple-400 mt-2">— Quantum Biology, Fisher-Escolà Model</p>
      </div>

      {/* Empty state */}
      {lovedOnes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-5">
          <div className="text-center text-purple-300 max-w-md">
            <p className="text-2xl mb-4">💫</p>
            <p className="text-lg mb-2">The starfield awaits...</p>
            <p className="text-sm opacity-75">
              Click "Add a Star" to honor someone whose energy remains with you
            </p>
          </div>
        </div>
      )}

      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 0, 25], fov: 75 }}>
        <StarfieldScene 
          lovedOnes={lovedOnes}
          onSelectStar={setSelectedStarId}
          selectedStarId={selectedStarId}
        />
      </Canvas>
    </div>
  );
};

export default EternalStarfield;
