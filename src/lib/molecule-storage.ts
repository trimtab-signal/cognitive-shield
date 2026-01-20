/**
 * @license
 * Copyright 2026 Wonky Sprout DUNA
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/**
 * Molecule Storage Service
 * Handles saving, loading, and sharing molecules
 */

interface SavedMolecule {
  id: string;
  name: string;
  formula: string;
  atoms: Array<{ element: string; position: [number, number, number] }>;
  bonds: Array<{ from: string; to: string; order: number }>;
  createdAt: number;
  thumbnail?: string;
}

const STORAGE_KEY = 'cognitive-shield-molecules';

export class MoleculeStorage {
  static save(molecule: Omit<SavedMolecule, 'id' | 'createdAt'>): string {
    const molecules = this.getAll();
    const id = `mol-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const savedMolecule: SavedMolecule = {
      ...molecule,
      id,
      createdAt: Date.now(),
    };
    
    molecules.push(savedMolecule);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(molecules));
    return id;
  }

  static getAll(): SavedMolecule[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static getById(id: string): SavedMolecule | null {
    const molecules = this.getAll();
    return molecules.find(m => m.id === id) || null;
  }

  static delete(id: string): void {
    const molecules = this.getAll().filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(molecules));
  }

  static update(id: string, updates: Partial<SavedMolecule>): void {
    const molecules = this.getAll();
    const index = molecules.findIndex(m => m.id === id);
    if (index !== -1) {
      molecules[index] = { ...molecules[index], ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(molecules));
    }
  }

  static encodeToURL(molecule: Pick<SavedMolecule, 'atoms' | 'bonds' | 'name'>): string {
    const data = JSON.stringify(molecule);
    const encoded = btoa(data);
    return `${window.location.origin}${window.location.pathname}?molecule=${encodeURIComponent(encoded)}`;
  }

  static decodeFromURL(): Pick<SavedMolecule, 'atoms' | 'bonds' | 'name'> | null {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('molecule');
    if (!encoded) return null;
    
    try {
      const decoded = atob(decodeURIComponent(encoded));
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  }

  static exportToJSON(molecule: SavedMolecule): string {
    return JSON.stringify(molecule, null, 2);
  }

  static exportToPDB(molecule: SavedMolecule): string {
    // PDB format for chemistry software
    let pdb = 'HEADER    MOLECULE CREATED WITH COGNITIVE SHIELD\n';
    pdb += `TITLE     ${molecule.name}\n`;
    pdb += `REMARK    FORMULA: ${molecule.formula}\n`;
    pdb += `REMARK    CREATED: ${new Date(molecule.createdAt).toISOString()}\n`;
    
    molecule.atoms.forEach((atom, i) => {
      const [x, y, z] = atom.position;
      pdb += `ATOM  ${(i + 1).toString().padStart(5)}  ${atom.element.padEnd(3)} MOL     1    `;
      pdb += `${x.toFixed(3).padStart(8)}${y.toFixed(3).padStart(8)}${z.toFixed(3).padStart(8)}`;
      pdb += `  1.00  0.00           ${atom.element.padStart(2)}\n`;
    });
    
    molecule.bonds.forEach(bond => {
      const fromIdx = molecule.atoms.findIndex((_, i) => `atom-${i}` === bond.from);
      const toIdx = molecule.atoms.findIndex((_, i) => `atom-${i}` === bond.to);
      if (fromIdx >= 0 && toIdx >= 0) {
        pdb += `CONECT${(fromIdx + 1).toString().padStart(5)}${(toIdx + 1).toString().padStart(5)}\n`;
      }
    });
    
    pdb += 'END\n';
    return pdb;
  }
}

// Achievement System
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
}

const ACHIEVEMENTS_KEY = 'cognitive-shield-achievements';

export const ACHIEVEMENT_DEFINITIONS: Omit<Achievement, 'unlocked'>[] = [
  { id: 'first_molecule', name: 'First Creation', description: 'Built your first molecule', icon: '⚗️' },
  { id: 'water', name: 'H₂O Master', description: 'Successfully built water', icon: '💧' },
  { id: 'five_molecules', name: 'Chemist', description: 'Created 5 different molecules', icon: '🧪' },
  { id: 'ten_molecules', name: 'Molecular Architect', description: 'Created 10 molecules', icon: '🏗️' },
  { id: 'all_elements', name: 'Element Explorer', description: 'Used all 10 elements', icon: '📊' },
  { id: 'complex_molecule', name: 'Complex Builder', description: 'Built a molecule with 15+ atoms', icon: '🌟' },
  { id: 'perfect_water', name: 'Perfect Structure', description: 'Built water with correct bond angles', icon: '✨' },
  { id: 'shared_molecule', name: 'Sharing is Caring', description: 'Shared your first molecule', icon: '🔗' },
  { id: 'daily_builder', name: 'Daily Chemist', description: 'Built molecules on 3 different days', icon: '📅' },
  { id: 'speed_builder', name: 'Speed Demon', description: 'Built a molecule in under 30 seconds', icon: '⚡' },
];

export class AchievementSystem {
  static getAll(): Achievement[] {
    const data = localStorage.getItem(ACHIEVEMENTS_KEY);
    const saved: Record<string, { unlockedAt: number }> = data ? JSON.parse(data) : {};
    
    return ACHIEVEMENT_DEFINITIONS.map(def => ({
      ...def,
      unlocked: !!saved[def.id],
      unlockedAt: saved[def.id]?.unlockedAt,
    }));
  }

  static unlock(achievementId: string): boolean {
    const data = localStorage.getItem(ACHIEVEMENTS_KEY);
    const saved: Record<string, { unlockedAt: number }> = data ? JSON.parse(data) : {};
    
    if (saved[achievementId]) return false; // Already unlocked
    
    saved[achievementId] = { unlockedAt: Date.now() };
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(saved));
    return true; // Newly unlocked
  }

  static check(context: {
    moleculeCount: number;
    atoms: Array<{ element: string }>;
    bonds: Array<unknown>;
    elementsUsed: Set<string>;
    formula: string;
  }): string[] {
    const newlyUnlocked: string[] = [];

    // First molecule
    if (context.moleculeCount === 1 && this.unlock('first_molecule')) {
      newlyUnlocked.push('first_molecule');
    }

    // Water
    if (context.formula === 'H2O' && this.unlock('water')) {
      newlyUnlocked.push('water');
    }

    // Five molecules
    if (context.moleculeCount >= 5 && this.unlock('five_molecules')) {
      newlyUnlocked.push('five_molecules');
    }

    // Ten molecules
    if (context.moleculeCount >= 10 && this.unlock('ten_molecules')) {
      newlyUnlocked.push('ten_molecules');
    }

    // All elements
    if (context.elementsUsed.size >= 10 && this.unlock('all_elements')) {
      newlyUnlocked.push('all_elements');
    }

    // Complex molecule
    if (context.atoms.length >= 15 && this.unlock('complex_molecule')) {
      newlyUnlocked.push('complex_molecule');
    }

    return newlyUnlocked;
  }
}

// Statistics
interface Stats {
  totalMolecules: number;
  totalAtoms: number;
  totalBonds: number;
  elementsUsed: string[];
  firstMoleculeDate: number;
  lastMoleculeDate: number;
  buildingSessions: number;
}

const STATS_KEY = 'cognitive-shield-stats';

export class StatsTracker {
  static get(): Stats {
    const data = localStorage.getItem(STATS_KEY);
    return data ? JSON.parse(data) : {
      totalMolecules: 0,
      totalAtoms: 0,
      totalBonds: 0,
      elementsUsed: [],
      firstMoleculeDate: 0,
      lastMoleculeDate: 0,
      buildingSessions: 0,
    };
  }

  static update(molecule: { atoms: Array<{ element: string }>; bonds: Array<unknown> }): void {
    const stats = this.get();
    const now = Date.now();

    stats.totalMolecules++;
    stats.totalAtoms += molecule.atoms.length;
    stats.totalBonds += molecule.bonds.length;

    const newElements = molecule.atoms.map(a => a.element).filter(e => !stats.elementsUsed.includes(e));
    stats.elementsUsed.push(...newElements);

    if (stats.firstMoleculeDate === 0) {
      stats.firstMoleculeDate = now;
    }
    stats.lastMoleculeDate = now;

    // Check if new session (more than 1 hour since last)
    if (now - stats.lastMoleculeDate > 3600000) {
      stats.buildingSessions++;
    }

    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  }
}
