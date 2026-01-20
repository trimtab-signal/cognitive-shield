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

import React, { useRef, useState, useCallback } from 'react';
import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';

/**
 * MOLECULE BUILDER - 3D Chemistry Visualization
 * 
 * Build molecules atom-by-atom in 3D space
 * - Click to place atoms
 * - Drag to create bonds
 * - Real atomic colors and sizes
 * - Export molecular formulas
 */

interface Atom {
  id: string;
  element: ElementType;
  position: [number, number, number];
}

interface Bond {
  id: string;
  from: string; // atom id
  to: string;   // atom id
  order: 1 | 2 | 3; // single, double, triple
}

type ElementType = 'H' | 'C' | 'N' | 'O' | 'P' | 'S' | 'Ca' | 'Fe' | 'Mg' | 'Cl';

const ELEMENTS: Record<ElementType, { 
  name: string; 
  color: string; 
  radius: number;
  mass: number;
}> = {
  H: { name: 'Hydrogen', color: '#FFFFFF', radius: 0.25, mass: 1 },
  C: { name: 'Carbon', color: '#909090', radius: 0.4, mass: 12 },
  N: { name: 'Nitrogen', color: '#3050F8', radius: 0.35, mass: 14 },
  O: { name: 'Oxygen', color: '#FF0D0D', radius: 0.35, mass: 16 },
  P: { name: 'Phosphorus', color: '#FF8000', radius: 0.45, mass: 31 },
  S: { name: 'Sulfur', color: '#FFFF30', radius: 0.45, mass: 32 },
  Ca: { name: 'Calcium', color: '#3DFF00', radius: 0.5, mass: 40 },
  Fe: { name: 'Iron', color: '#E06633', radius: 0.45, mass: 56 },
  Mg: { name: 'Magnesium', color: '#8AFF00', radius: 0.45, mass: 24 },
  Cl: { name: 'Chlorine', color: '#1FF01F', radius: 0.4, mass: 35 },
};

// Predefined molecules
const PRESETS: Record<string, { atoms: Omit<Atom, 'id'>[]; bonds: Omit<Bond, 'id'>[]; name: string }> = {
  water: {
    name: 'Water (H₂O)',
    atoms: [
      { element: 'O', position: [0, 0, 0] },
      { element: 'H', position: [-0.8, 0.6, 0] },
      { element: 'H', position: [0.8, 0.6, 0] },
    ],
    bonds: [
      { from: '0', to: '1', order: 1 },
      { from: '0', to: '2', order: 1 },
    ],
  },
  posner: {
    name: 'Posner Molecule (Ca₉(PO₄)₆)',
    atoms: [
      // 9 Calcium atoms in a sphere
      { element: 'Ca', position: [0, 0, 0] },
      { element: 'Ca', position: [1.5, 0, 0] },
      { element: 'Ca', position: [-1.5, 0, 0] },
      { element: 'Ca', position: [0, 1.5, 0] },
      { element: 'Ca', position: [0, -1.5, 0] },
      { element: 'Ca', position: [0, 0, 1.5] },
      { element: 'Ca', position: [0, 0, -1.5] },
      { element: 'Ca', position: [1, 1, 1] },
      { element: 'Ca', position: [-1, -1, -1] },
      // 6 Phosphate groups (simplified)
      { element: 'P', position: [2, 0, 0] },
      { element: 'O', position: [2.5, 0, 0] },
      { element: 'P', position: [-2, 0, 0] },
      { element: 'O', position: [-2.5, 0, 0] },
      { element: 'P', position: [0, 2, 0] },
      { element: 'O', position: [0, 2.5, 0] },
      { element: 'P', position: [0, -2, 0] },
      { element: 'O', position: [0, -2.5, 0] },
      { element: 'P', position: [0, 0, 2] },
      { element: 'O', position: [0, 0, 2.5] },
      { element: 'P', position: [0, 0, -2] },
      { element: 'O', position: [0, 0, -2.5] },
    ],
    bonds: [],
  },
  glucose: {
    name: 'Glucose (C₆H₁₂O₆)',
    atoms: [
      // Ring carbons
      { element: 'C', position: [0, 0, 0] },
      { element: 'C', position: [1, 0, 0] },
      { element: 'C', position: [1.5, 0.8, 0] },
      { element: 'C', position: [1, 1.6, 0] },
      { element: 'C', position: [0, 1.6, 0] },
      { element: 'C', position: [-0.5, 0.8, 0] },
      // Oxygens
      { element: 'O', position: [0, 0, -0.5] },
      { element: 'O', position: [1.5, 0, -0.5] },
      { element: 'O', position: [2.2, 1, 0] },
      { element: 'O', position: [1.5, 2.3, 0] },
      { element: 'O', position: [-0.5, 2.3, 0] },
      { element: 'O', position: [-1.2, 1, 0] },
    ],
    bonds: [],
  },
  atp: {
    name: 'ATP (Adenosine Triphosphate)',
    atoms: [
      // Adenine ring (simplified)
      { element: 'N', position: [0, 0, 0] },
      { element: 'C', position: [0.8, 0, 0] },
      { element: 'N', position: [1.2, 0.8, 0] },
      // Ribose sugar
      { element: 'C', position: [1.5, 1.5, 0] },
      { element: 'O', position: [2.3, 1.5, 0] },
      // Phosphate chain
      { element: 'P', position: [3, 1.5, 0] },
      { element: 'O', position: [3.5, 1.5, 0] },
      { element: 'P', position: [4, 1.5, 0] },
      { element: 'O', position: [4.5, 1.5, 0] },
      { element: 'P', position: [5, 1.5, 0] },
      { element: 'O', position: [5.5, 1.5, 0] },
    ],
    bonds: [],
  },
};

// Atom component
const AtomSphere: React.FC<{ 
  atom: Atom; 
  isSelected: boolean;
  onClick: () => void;
  onDrag: (position: [number, number, number]) => void;
}> = ({ atom, isSelected, onClick, onDrag }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isDragging, setIsDragging] = useState(false);
  const element = ELEMENTS[atom.element];

  useFrame(() => {
    if (meshRef.current && isSelected && !isDragging) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setIsDragging(true);
    onClick();
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (isDragging) {
      onDrag([e.point.x, e.point.y, e.point.z]);
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <Sphere
      ref={meshRef}
      args={[element.radius, 32, 32]}
      position={atom.position}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <meshStandardMaterial
        color={element.color}
        emissive={isSelected ? element.color : '#000000'}
        emissiveIntensity={isSelected ? 0.5 : 0}
        roughness={0.3}
        metalness={0.7}
      />
    </Sphere>
  );
};

// Bond component
const BondLine: React.FC<{ bond: Bond; atoms: Atom[] }> = ({ bond, atoms }) => {
  const fromAtom = atoms.find(a => a.id === bond.from);
  const toAtom = atoms.find(a => a.id === bond.to);

  if (!fromAtom || !toAtom) return null;

  const points = [
    new THREE.Vector3(...fromAtom.position),
    new THREE.Vector3(...toAtom.position),
  ];

  return (
    <Line
      points={points}
      color="#CCCCCC"
      lineWidth={bond.order}
    />
  );
};

// Main molecule scene
const MoleculeScene: React.FC<{
  atoms: Atom[];
  bonds: Bond[];
  selectedAtom: string | null;
  onAtomClick: (id: string) => void;
  onAtomDrag: (id: string, position: [number, number, number]) => void;
}> = ({ atoms, bonds, selectedAtom, onAtomClick, onAtomDrag }) => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <spotLight position={[-10, -10, -10]} angle={0.3} penumbra={1} intensity={0.5} />

      {atoms.map(atom => (
        <AtomSphere
          key={atom.id}
          atom={atom}
          isSelected={selectedAtom === atom.id}
          onClick={() => onAtomClick(atom.id)}
          onDrag={(pos) => onAtomDrag(atom.id, pos)}
        />
      ))}

      {bonds.map(bond => (
        <BondLine key={bond.id} bond={bond} atoms={atoms} />
      ))}

      <OrbitControls enableZoom={true} enablePan={true} />
    </>
  );
};

export const MoleculeBuilder: React.FC = () => {
  const [atoms, setAtoms] = useState<Atom[]>([]);
  const [bonds, setBonds] = useState<Bond[]>([]);
  const [selectedElement, setSelectedElement] = useState<ElementType>('C');
  const [selectedAtom, setSelectedAtom] = useState<string | null>(null);
  const [bondingMode, setBondingMode] = useState(false);
  const [firstBondAtom, setFirstBondAtom] = useState<string | null>(null);

  const addAtom = useCallback(() => {
    const newAtom: Atom = {
      id: `atom-${Date.now()}`,
      element: selectedElement,
      position: [
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4,
      ],
    };
    setAtoms(prev => [...prev, newAtom]);
  }, [selectedElement]);

  const deleteAtom = useCallback(() => {
    if (!selectedAtom) return;
    setAtoms(prev => prev.filter(a => a.id !== selectedAtom));
    setBonds(prev => prev.filter(b => b.from !== selectedAtom && b.to !== selectedAtom));
    setSelectedAtom(null);
  }, [selectedAtom]);

  const handleAtomClick = useCallback((id: string) => {
    if (bondingMode) {
      if (!firstBondAtom) {
        setFirstBondAtom(id);
      } else if (firstBondAtom !== id) {
        const newBond: Bond = {
          id: `bond-${Date.now()}`,
          from: firstBondAtom,
          to: id,
          order: 1,
        };
        setBonds(prev => [...prev, newBond]);
        setFirstBondAtom(null);
        setBondingMode(false);
      }
    } else {
      setSelectedAtom(id);
    }
  }, [bondingMode, firstBondAtom]);

  const handleAtomDrag = useCallback((id: string, position: [number, number, number]) => {
    setAtoms(prev => prev.map(a => a.id === id ? { ...a, position } : a));
  }, []);

  const loadPreset = useCallback((presetKey: string) => {
    const preset = PRESETS[presetKey];
    if (!preset) return;

    const newAtoms: Atom[] = preset.atoms.map((a, i) => ({
      id: `atom-${Date.now()}-${i}`,
      ...a,
    }));

    const newBonds: Bond[] = preset.bonds.map((b, i) => ({
      id: `bond-${Date.now()}-${i}`,
      from: newAtoms[parseInt(b.from)].id,
      to: newAtoms[parseInt(b.to)].id,
      order: b.order,
    }));

    setAtoms(newAtoms);
    setBonds(newBonds);
    setSelectedAtom(null);
  }, []);

  const clearAll = useCallback(() => {
    setAtoms([]);
    setBonds([]);
    setSelectedAtom(null);
    setFirstBondAtom(null);
    setBondingMode(false);
  }, []);

  // Calculate molecular formula
  const formula = useCallback(() => {
    const counts: Record<string, number> = {};
    atoms.forEach(atom => {
      counts[atom.element] = (counts[atom.element] || 0) + 1;
    });
    return Object.entries(counts)
      .sort(([a], [b]) => {
        const order = ['C', 'H', 'O', 'N', 'P', 'S', 'Ca', 'Fe', 'Mg', 'Cl'];
        return order.indexOf(a) - order.indexOf(b);
      })
      .map(([el, count]) => `${el}${count > 1 ? count : ''}`)
      .join('');
  }, [atoms]);

  const totalMass = atoms.reduce((sum, atom) => sum + ELEMENTS[atom.element].mass, 0);

  return (
    <div style={{
      background: '#1F2937',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid #374151',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      minHeight: '700px',
    }}>
      {/* Header */}
      <div>
        <h2 style={{
          fontSize: '20px',
          fontWeight: 600,
          color: '#F3F4F6',
          margin: '0 0 8px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          ⚗️ Molecule Builder
        </h2>
        <p style={{ fontSize: '13px', color: '#9CA3AF', margin: 0 }}>
          Build molecules atom-by-atom in 3D space
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', flex: 1 }}>
        {/* 3D Canvas */}
        <div style={{
          background: '#111827',
          borderRadius: '12px',
          overflow: 'hidden',
          position: 'relative',
          minHeight: '500px',
        }}>
          <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
            <MoleculeScene
              atoms={atoms}
              bonds={bonds}
              selectedAtom={selectedAtom}
              onAtomClick={handleAtomClick}
              onAtomDrag={handleAtomDrag}
            />
          </Canvas>

          {/* Overlay stats */}
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            background: '#1F293790',
            backdropFilter: 'blur(8px)',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #374151',
          }}>
            <div style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '4px' }}>
              Formula
            </div>
            <div style={{ 
              fontSize: '16px', 
              fontWeight: 600, 
              color: '#F3F4F6',
              fontFamily: 'monospace',
            }}>
              {formula() || 'Empty'}
            </div>
            <div style={{ fontSize: '10px', color: '#9CA3AF', marginTop: '4px' }}>
              {atoms.length} atoms • {bonds.length} bonds
            </div>
            <div style={{ fontSize: '10px', color: '#9CA3AF' }}>
              Mass: {totalMass} amu
            </div>
          </div>
        </div>

        {/* Controls Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Element Palette */}
          <div style={{
            background: '#111827',
            padding: '12px',
            borderRadius: '8px',
          }}>
            <div style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '8px' }}>
              Select Element
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '6px',
            }}>
              {(Object.keys(ELEMENTS) as ElementType[]).map(el => (
                <button
                  key={el}
                  onClick={() => setSelectedElement(el)}
                  style={{
                    padding: '8px',
                    background: selectedElement === el ? ELEMENTS[el].color + '40' : '#374151',
                    border: `2px solid ${selectedElement === el ? ELEMENTS[el].color : '#4B5563'}`,
                    borderRadius: '6px',
                    color: '#F3F4F6',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {el}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{
            background: '#111827',
            padding: '12px',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}>
            <button
              onClick={addAtom}
              style={{
                padding: '10px',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                border: 'none',
                borderRadius: '6px',
                color: '#FFF',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              ➕ Add {ELEMENTS[selectedElement].name}
            </button>

            <button
              onClick={() => setBondingMode(!bondingMode)}
              style={{
                padding: '10px',
                background: bondingMode ? '#EF444440' : '#374151',
                border: `1px solid ${bondingMode ? '#EF4444' : '#4B5563'}`,
                borderRadius: '6px',
                color: '#F3F4F6',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {bondingMode ? '🔗 Bonding...' : '🔗 Create Bond'}
            </button>

            <button
              onClick={deleteAtom}
              disabled={!selectedAtom}
              style={{
                padding: '10px',
                background: selectedAtom ? '#7F1D1D' : '#37415150',
                border: '1px solid #4B5563',
                borderRadius: '6px',
                color: '#F3F4F6',
                fontSize: '13px',
                fontWeight: 600,
                cursor: selectedAtom ? 'pointer' : 'not-allowed',
              }}
            >
              🗑️ Delete Atom
            </button>

            <button
              onClick={clearAll}
              style={{
                padding: '10px',
                background: '#374151',
                border: '1px solid #4B5563',
                borderRadius: '6px',
                color: '#F3F4F6',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              🧹 Clear All
            </button>
          </div>

          {/* Presets */}
          <div style={{
            background: '#111827',
            padding: '12px',
            borderRadius: '8px',
          }}>
            <div style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '8px' }}>
              Load Preset
            </div>
            {Object.entries(PRESETS).map(([key, preset]) => (
              <button
                key={key}
                onClick={() => loadPreset(key)}
                style={{
                  width: '100%',
                  padding: '8px',
                  marginBottom: '4px',
                  background: '#374151',
                  border: '1px solid #4B5563',
                  borderRadius: '6px',
                  color: '#F3F4F6',
                  fontSize: '12px',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Info */}
      <div style={{
        padding: '12px',
        background: '#C084FC15',
        borderRadius: '8px',
        borderLeft: '3px solid #C084FC',
      }}>
        <p style={{ fontSize: '12px', color: '#C084FC', margin: 0 }}>
          <strong>Instructions:</strong> Click "Add" to place atoms, click atoms to select them,
          enable "Create Bond" and click two atoms to connect them, drag atoms to move them in 3D space.
        </p>
      </div>
    </div>
  );
};
