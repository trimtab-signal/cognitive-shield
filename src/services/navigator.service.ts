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
 * Navigator Service
 * Integration bridge to Phenix Navigator v4.1
 * 
 * Handles:
 * - WebSocket connection to quantum telemetry stream
 * - QUANTUM_STATE event processing
 * - QUANTUM_ANOMALY alert routing (bypasses Catcher's Mitt)
 * - Mesh heartbeat monitoring
 * - Tetrahedron trust geometry visualization data
 */

import type { 
  QuantumState, 
  QuantumAnomaly, 
  MeshNode, 
  TetrahedronVisualization,
  RawMessage,
} from '../types';
import { NavigatorConfig, SIC_POVM_OVERLAP } from '../config/god.config';

// ═══════════════════════════════════════════════════════════════════════════════
// EVENT TYPES
// ═══════════════════════════════════════════════════════════════════════════════

type NavigatorEventType = 
  | 'quantum_state'
  | 'quantum_anomaly'
  | 'mesh_heartbeat'
  | 'node_joined'
  | 'node_left'
  | 'connection_lost'
  | 'connection_restored';

interface NavigatorEvent {
  type: NavigatorEventType;
  payload: unknown;
  timestamp: Date;
}

type NavigatorEventHandler = (event: NavigatorEvent) => void;

// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATOR SERVICE CLASS
// ═══════════════════════════════════════════════════════════════════════════════

class NavigatorService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private handlers: Map<NavigatorEventType, NavigatorEventHandler[]> = new Map();
  private meshNodes: Map<string, MeshNode> = new Map();
  private latestQuantumState: QuantumState | null = null;
  private latestAnomaly: QuantumAnomaly | null = null;
  private isConnected = false;

  /**
   * Connect to Navigator telemetry stream
   */
  async connect(): Promise<boolean> {
    const endpoint = localStorage.getItem('NAVIGATOR_URL') || NavigatorConfig.telemetryEndpoint;
    
    return new Promise((resolve) => {
      try {
        this.ws = new WebSocket(endpoint);

        this.ws.onopen = () => {
          console.log('[Navigator] Connected to telemetry stream');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.emit('connection_restored', {});
          resolve(true);
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(event.data);
        };

        this.ws.onclose = () => {
          console.log('[Navigator] Connection closed');
          this.isConnected = false;
          this.emit('connection_lost', {});
          this.attemptReconnect();
        };

        this.ws.onerror = (error) => {
          console.error('[Navigator] WebSocket error:', error);
          resolve(false);
        };

      } catch (error) {
        console.error('[Navigator] Failed to connect:', error);
        resolve(false);
      }
    });
  }

  /**
   * Disconnect from Navigator
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
  }

  /**
   * Register event handler
   */
  on(eventType: NavigatorEventType, handler: NavigatorEventHandler): void {
    const existing = this.handlers.get(eventType) || [];
    this.handlers.set(eventType, [...existing, handler]);
  }

  /**
   * Remove event handler
   */
  off(eventType: NavigatorEventType, handler: NavigatorEventHandler): void {
    const existing = this.handlers.get(eventType) || [];
    this.handlers.set(eventType, existing.filter(h => h !== handler));
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  /**
   * Get latest quantum state
   */
  getLatestQuantumState(): QuantumState | null {
    return this.latestQuantumState;
  }

  /**
   * Get latest anomaly
   */
  getLatestAnomaly(): QuantumAnomaly | null {
    return this.latestAnomaly;
  }

  /**
   * Get all mesh nodes
   */
  getMeshNodes(): MeshNode[] {
    return Array.from(this.meshNodes.values());
  }

  /**
   * DEV: Simulate an anomaly for testing
   */
  simulateAnomaly(): void {
    const anomaly: QuantumAnomaly = {
      type: 'drift',
      severity: 'high',
      description: 'Simulated quantum drift event for testing purposes.',
      timestamp: new Date(),
      quantumState: {
        vector: [0.1, 0.1, 0.1], // Fixed vector type mismatch
        fidelity: 0.4,
        timestamp: new Date(),
        nodeId: 'simulated'
      }
    };
    this.handleQuantumAnomaly(anomaly);
  }

  /**
   * Get tetrahedron visualization data
   */
  getTetrahedronVisualization(): TetrahedronVisualization {
    const nodes = this.getMeshNodes();
    
    // Map real nodes to tetrahedron positions
    // Node positions form a regular tetrahedron
    const positions = {
      A: [0, 1, 0] as [number, number, number],           // Self (top)
      B: [0.943, -0.333, 0] as [number, number, number],  // Other (front-right)
      C: [-0.471, -0.333, 0.816] as [number, number, number], // Context (back-left)
      D: [-0.471, -0.333, -0.816] as [number, number, number], // Engine (back-right)
    };

    // Build edges with health status
    const edges: TetrahedronVisualization['edges'] = [];
    const nodeIds: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
    
    for (let i = 0; i < nodeIds.length; i++) {
      for (let j = i + 1; j < nodeIds.length; j++) {
        const strength = this.calculateEdgeStrength(nodeIds[i], nodeIds[j], nodes);
        edges.push({
          from: nodeIds[i],
          to: nodeIds[j],
          strength,
          status: strength > 0.7 ? 'healthy' : strength > 0.3 ? 'stressed' : 'broken',
        });
      }
    }

    // Calculate overall health
    const overallHealth = edges.reduce((sum, e) => sum + e.strength, 0) / edges.length;

    return {
      nodes: {
        A: { position: positions.A, label: 'Self', status: 'online' },
        B: { position: positions.B, label: 'Other', status: nodes.length > 0 ? 'online' : 'offline' },
        C: { position: positions.C, label: 'Context', status: 'online' },
        D: { position: positions.D, label: 'Engine', status: this.isConnected ? 'online' : 'offline' },
      },
      edges,
      overallHealth,
    };
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // PRIVATE METHODS
  // ═════════════════════════════════════════════════════════════════════════════

  private handleMessage(data: string): void {
    try {
      const message = JSON.parse(data);
      const eventType = message.type as NavigatorEventType;
      
      switch (eventType) {
        case 'quantum_state':
          this.handleQuantumState(message.payload);
          break;
        case 'quantum_anomaly':
          this.handleQuantumAnomaly(message.payload);
          break;
        case 'mesh_heartbeat':
          this.handleMeshHeartbeat(message.payload);
          break;
        case 'node_joined':
          this.handleNodeJoined(message.payload);
          break;
        case 'node_left':
          this.handleNodeLeft(message.payload);
          break;
      }

      this.emit(eventType, message.payload);
    } catch (error) {
      console.error('[Navigator] Failed to parse message:', error);
    }
  }

  private handleQuantumState(payload: unknown): void {
    const state = payload as QuantumState;
    state.timestamp = new Date();
    this.latestQuantumState = state;
    
    // Validate SIC-POVM geometry
    const fidelity = state.fidelity;
    if (fidelity < SIC_POVM_OVERLAP * 0.9) {
      console.warn('[Navigator] Quantum fidelity below SIC-POVM threshold');
    }
  }

  private handleQuantumAnomaly(payload: unknown): void {
    const anomaly = payload as QuantumAnomaly;
    anomaly.timestamp = new Date();
    this.latestAnomaly = anomaly;
    
    // CRITICAL: Quantum anomalies bypass the Catcher's Mitt
    // Convert to RawMessage for immediate Shield processing
    const urgentMessage: RawMessage = {
      id: `anomaly-${Date.now()}`,
      source: 'navigator',
      sender: 'Phenix Navigator',
      content: `⚠️ QUANTUM ANOMALY DETECTED\n\nType: ${anomaly.type}\nSeverity: ${anomaly.severity}\n\n${anomaly.description}`,
      timestamp: anomaly.timestamp,
      metadata: {
        bypass: true, // Flag for Catcher's Mitt bypass
        anomaly,
      },
    };

    // Emit special event for Shield to pick up
    this.emit('quantum_anomaly', { message: urgentMessage, anomaly });
  }

  private handleMeshHeartbeat(payload: unknown): void {
    const nodes = payload as MeshNode[];
    nodes.forEach(node => {
      node.lastHeartbeat = new Date();
      this.meshNodes.set(node.id, node);
    });
  }

  private handleNodeJoined(payload: unknown): void {
    const node = payload as MeshNode;
    node.lastHeartbeat = new Date();
    this.meshNodes.set(node.id, node);
    console.log(`[Navigator] Node joined: ${node.name}`);
  }

  private handleNodeLeft(payload: unknown): void {
    const node = payload as { id: string };
    this.meshNodes.delete(node.id);
    console.log(`[Navigator] Node left: ${node.id}`);
  }

  private emit(eventType: NavigatorEventType, payload: unknown): void {
    const handlers = this.handlers.get(eventType) || [];
    const event: NavigatorEvent = {
      type: eventType,
      payload,
      timestamp: new Date(),
    };
    handlers.forEach(handler => handler(event));
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[Navigator] Max reconnect attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`[Navigator] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      this.connect();
    }, delay);
  }

  private calculateEdgeStrength(
    from: 'A' | 'B' | 'C' | 'D', 
    to: 'A' | 'B' | 'C' | 'D',
    nodes: MeshNode[]
  ): number {
    // Base strength
    let strength = 0.5;

    // Node A (Self) is always present
    // Node D (Engine) strength based on connection
    if ((from === 'D' || to === 'D') && this.isConnected) {
      strength += 0.3;
    }

    // Node B (Other) strength based on mesh nodes
    if ((from === 'B' || to === 'B') && nodes.length > 0) {
      const avgTrust = nodes.reduce((sum, n) => sum + n.trustScore, 0) / nodes.length;
      strength += avgTrust * 0.3;
    }

    // Quantum fidelity affects all edges
    if (this.latestQuantumState) {
      strength += (this.latestQuantumState.fidelity - 0.5) * 0.4;
    }

    return Math.max(0, Math.min(1, strength));
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLETON EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export const navigatorService = new NavigatorService();

// ═══════════════════════════════════════════════════════════════════════════════
// REACT HOOK
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from 'react';

export function useNavigator() {
  const [isConnected, setIsConnected] = useState(false);
  const [quantumState, setQuantumState] = useState<QuantumState | null>(null);
  const [lastAnomaly, setLastAnomaly] = useState<QuantumAnomaly | null>(null);
  const [meshNodes, setMeshNodes] = useState<MeshNode[]>([]);
  const [tetrahedron, setTetrahedron] = useState<TetrahedronVisualization | null>(null);

  const connect = useCallback(async () => {
    const success = await navigatorService.connect();
    setIsConnected(success);
    return success;
  }, []);

  const disconnect = useCallback(() => {
    navigatorService.disconnect();
    setIsConnected(false);
  }, []);

  useEffect(() => {
    // Set up event handlers
    const handleQuantumState = () => {
      setQuantumState(navigatorService.getLatestQuantumState());
      setTetrahedron(navigatorService.getTetrahedronVisualization());
    };

    const handleAnomaly = () => {
      setLastAnomaly(navigatorService.getLatestAnomaly());
    };

    const handleMeshUpdate = () => {
      setMeshNodes(navigatorService.getMeshNodes());
      setTetrahedron(navigatorService.getTetrahedronVisualization());
    };

    const handleConnectionChange = () => {
      setIsConnected(navigatorService.getConnectionStatus());
    };

    navigatorService.on('quantum_state', handleQuantumState);
    navigatorService.on('quantum_anomaly', handleAnomaly);
    navigatorService.on('mesh_heartbeat', handleMeshUpdate);
    navigatorService.on('node_joined', handleMeshUpdate);
    navigatorService.on('node_left', handleMeshUpdate);
    navigatorService.on('connection_restored', handleConnectionChange);
    navigatorService.on('connection_lost', handleConnectionChange);

    return () => {
      navigatorService.off('quantum_state', handleQuantumState);
      navigatorService.off('quantum_anomaly', handleAnomaly);
      navigatorService.off('mesh_heartbeat', handleMeshUpdate);
      navigatorService.off('node_joined', handleMeshUpdate);
      navigatorService.off('node_left', handleMeshUpdate);
      navigatorService.off('connection_restored', handleConnectionChange);
      navigatorService.off('connection_lost', handleConnectionChange);
    };
  }, []);

  return {
    isConnected,
    quantumState,
    lastAnomaly,
    meshNodes,
    tetrahedron,
    connect,
    disconnect,
  };
}
