/**
 * TETRAHEDRON SERVICE
 * Implements the G.O.D. Protocol geometric constraints
 * Enforces K4 topology and provides coherence monitoring
 */

import type { TetrahedronGroup, TetrahedronHeartbeat } from '../types/heartbeat.types';

export class TetrahedronService {
  private static instance: TetrahedronService;
  private tetrahedrons: Map<string, TetrahedronGroup> = new Map();

  // Coherence monitoring (simplified for web - would use device sensors in hardware)
  private accelerometerHistory: number[] = [];
  private readonly WINDOW_SIZE = 50;

  private constructor() {}

  static getInstance(): TetrahedronService {
    if (!TetrahedronService.instance) {
      TetrahedronService.instance = new TetrahedronService();
    }
    return TetrahedronService.instance;
  }

  /**
   * Register a new tetrahedron (K4 group)
   * Enforces exactly 4 members as per G.O.D. Constitution
   */
  registerTetrahedron(memberIds: [string, string, string, string]): TetrahedronGroup {
    if (memberIds.length !== 4) {
      throw new Error('Tetrahedron must have exactly 4 members (K4 topology)');
    }

    // Sort for consistent hashing
    const sortedMembers = [...memberIds].sort() as [string, string, string, string];
    const tetrahedronId = this.generateTetrahedronId(sortedMembers);

    if (this.tetrahedrons.has(tetrahedronId)) {
      throw new Error('Tetrahedron already exists');
    }

    const tetrahedron: TetrahedronGroup = {
      id: tetrahedronId,
      members: sortedMembers,
      created: Date.now(),
      isActive: true
    };

    this.tetrahedrons.set(tetrahedronId, tetrahedron);
    return tetrahedron;
  }

  /**
   * Check if a node is a member of any tetrahedron
   */
  isMemberOfAnyTetrahedron(nodeId: string): boolean {
    for (const tetra of this.tetrahedrons.values()) {
      if (tetra.members.includes(nodeId)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Get all tetrahedrons a node belongs to
   */
  getNodeTetrahedrons(nodeId: string): TetrahedronGroup[] {
    return Array.from(this.tetrahedrons.values())
      .filter(tetra => tetra.members.includes(nodeId));
  }

  /**
   * Generate deterministic tetrahedron ID from member IDs
   */
  private generateTetrahedronId(members: [string, string, string, string]): string {
    const sorted = [...members].sort();
    return btoa(sorted.join(',')).replace(/=/g, '');
  }

  /**
   * Calculate Fisher-Escola coherence score (simplified for web)
   * In hardware implementation, this would use accelerometer data
   */
  calculateNeuralEntropy(): number {
    if (this.accelerometerHistory.length < this.WINDOW_SIZE) {
      return 50; // Calibrating
    }

    // Calculate mean
    const sum = this.accelerometerHistory.reduce((a, b) => a + b, 0);
    const mean = sum / this.accelerometerHistory.length;

    // Calculate standard deviation (simplified variance)
    const sqSum = this.accelerometerHistory.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0);
    const stdev = Math.sqrt(sqSum / this.accelerometerHistory.length);

    // Map to coherence score (0-100)
    // Low variance (< 0.05) = Frozen/Depression (0-20)
    // High variance (> 0.5) = Panic/Chaos (80-100)
    // Medium variance = Flow State (40-60)

    if (stdev < 0.05) return Math.max(0, stdev * 400); // 0-20
    if (stdev > 0.5) return 100; // Max chaos
    return 20 + ((stdev - 0.05) / 0.45) * 60; // 20-80
  }

  /**
   * Add accelerometer sample (simulated in web, real in hardware)
   */
  addAccelerometerSample(x: number, y: number, z: number): void {
    // Calculate magnitude (simplified for web - would use real sensor data)
    const magnitude = Math.sqrt(x * x + y * y + z * z);

    if (this.accelerometerHistory.length >= this.WINDOW_SIZE) {
      this.accelerometerHistory.shift();
    }
    this.accelerometerHistory.push(magnitude);
  }

  /**
   * Generate tetrahedron heartbeat payload
   */
  generateHeartbeat(senderId: string, tetrahedronId: string): TetrahedronHeartbeat {
    const entropy = this.calculateNeuralEntropy();

    // Simulate status flags (would be real in hardware)
    const spoonCount = Math.floor(Math.random() * 4) as 0 | 1 | 2 | 3;
    const panicMode = entropy > 90;
    const silentMode = entropy < 10;

    return {
      senderId,
      timestampDelta: 0, // Would be real delta in hardware
      statusFlags: {
        spoonCount,
        panicMode,
        silentMode
      },
      batteryVoltage: Math.floor(180 + Math.random() * 76), // 180-255 (3.5V-4.2V range)
      neuralEntropy: entropy
    };
  }

  /**
   * Get all active tetrahedrons
   */
  getActiveTetrahedrons(): TetrahedronGroup[] {
    return Array.from(this.tetrahedrons.values()).filter(t => t.isActive);
  }

  /**
   * Check if tetrahedron topology is maintained (no node in too many groups)
   */
  validateTopology(): { valid: boolean; violations: string[] } {
    const violations: string[] = [];
    const nodeGroups = new Map<string, string[]>();

    // Count group memberships per node
    for (const tetra of this.tetrahedrons.values()) {
      for (const memberId of tetra.members) {
        if (!nodeGroups.has(memberId)) {
          nodeGroups.set(memberId, []);
        }
        nodeGroups.get(memberId)!.push(tetra.id);
      }
    }

    // Check for violations (should be exactly 1 group per node in pure K4 topology)
    for (const [nodeId, groups] of nodeGroups.entries()) {
      if (groups.length > 1) {
        violations.push(`Node ${nodeId} belongs to ${groups.length} tetrahedrons: ${groups.join(', ')}`);
      }
    }

    return {
      valid: violations.length === 0,
      violations
    };
  }
}

export default TetrahedronService;