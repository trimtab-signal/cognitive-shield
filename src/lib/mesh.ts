/**
 * PEER-TO-PEER MESH NETWORK
 * WebRTC-based mesh for Heartbeat Protocol
 * Uses PeerJS for signaling (free public relay)
 */

import Peer from 'peerjs';
import type { MeshMessage, Peer as PeerType, TetrahedronGroup, TetrahedronHeartbeat } from '../types/heartbeat.types';
import GOD_CONFIG from '../god.config';

// PeerJS DataConnection - use the connection object type from peer.connect()
// The connection returned by peer.connect() and received in peer.on('connection')
type DataConnection = ReturnType<Peer['connect']>;

export interface MeshCallbacks {
  onPeerConnected: (peer: PeerType) => void;
  onPeerDisconnected: (peerId: string) => void;
  onMessage: (message: MeshMessage) => void;
  onError: (error: Error) => void;
}

export class MeshNetwork {
  private peer: Peer | null = null;
  private connections: Map<string, DataConnection> = new Map();
  private callbacks: MeshCallbacks;
  private reconnectTimers: Map<string, ReturnType<typeof setTimeout>> = new Map();
  private broadcastInterval: ReturnType<typeof setInterval> | null = null;

  // Tetrahedron Protocol Extensions
  private tetrahedronGroups: Map<string, TetrahedronGroup> = new Map();
  private myTetrahedrons: Set<string> = new Set(); // Tetrahedron IDs I belong to
  private heartbeatHistory: Map<string, TetrahedronHeartbeat[]> = new Map();

  constructor(callbacks: MeshCallbacks) {
    this.callbacks = callbacks;
  }

  /**
   * Initialize the mesh network with a peer ID
   */
  async initialize(peerId?: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        this.peer = new Peer(peerId, {
          host: '0.peerjs.com',
          port: 443,
          path: '/',
          secure: true,
        });

        this.peer.on('open', (id) => {
          console.log('[Mesh] Connected with peer ID:', id);
          this.startStatusBroadcast();
          resolve(id);
        });

        this.peer.on('connection', (conn) => {
          this.handleConnection(conn);
        });

        this.peer.on('error', (err) => {
          console.error('[Mesh] Peer error:', err);
          this.callbacks.onError(err);
          // Auto-reconnect on certain errors
          if (err.type === 'network' || err.type === 'server-error') {
            setTimeout(() => {
              if (this.peer?.destroyed) {
                this.initialize(peerId).catch(reject);
              }
            }, GOD_CONFIG.heartbeat.peerReconnectDelay);
          }
        });

        this.peer.on('disconnected', () => {
          console.warn('[Mesh] Disconnected from signaling server');
          // Attempt to reconnect
          if (!this.peer?.destroyed) {
            this.peer.reconnect();
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Connect to a peer using their connection code
   */
  async connectToPeer(peerId: string, myName: string): Promise<void> {
    if (!this.peer || this.peer.destroyed) {
      throw new Error('Mesh not initialized');
    }

    if (this.connections.has(peerId)) {
      console.log('[Mesh] Already connected to', peerId);
      return;
    }

    try {
      const conn = this.peer.connect(peerId, {
        reliable: true,
      });

      conn.on('open', () => {
        console.log('[Mesh] Connected to peer:', peerId);
        this.connections.set(peerId, conn);
        this.setupConnectionHandlers(conn, peerId);
        
        // Send handshake with our name
        this.sendMessage(peerId, {
          type: 'handshake',
          from: this.peer!.id!,
          timestamp: Date.now(),
          payload: { name: myName },
        });
      });

      conn.on('error', (err) => {
        console.error('[Mesh] Connection error:', err);
        this.cleanupConnection(peerId);
      });
    } catch (error) {
      console.error('[Mesh] Failed to connect:', error);
      throw error;
    }
  }

  /**
   * Handle incoming connection
   */
  private handleConnection(conn: DataConnection) {
    const peerId = conn.peer;
    
    if (this.connections.has(peerId)) {
      conn.close();
      return;
    }

    this.connections.set(peerId, conn);
    this.setupConnectionHandlers(conn, peerId);
  }

  /**
   * Setup message handlers for a connection
   */
  private setupConnectionHandlers(conn: DataConnection, peerId: string) {
    conn.on('data', (data) => {
      try {
        const message = data as MeshMessage;

        // Tetrahedron Protocol: Filter messages based on topology
        if (!this.shouldRelayMessage(message)) {
          console.log('[Mesh] Dropping message outside tetrahedron scope:', message.type, 'from:', peerId);
          return;
        }

        this.handleMessage(message, peerId);
      } catch (error) {
        console.error('[Mesh] Failed to parse message:', error);
      }
    });

    conn.on('close', () => {
      console.log('[Mesh] Connection closed:', peerId);
      this.cleanupConnection(peerId);
      this.callbacks.onPeerDisconnected(peerId);
    });

    conn.on('error', (err) => {
      console.error('[Mesh] Connection error:', err);
      this.cleanupConnection(peerId);
    });
  }

  /**
   * Handle incoming message
   */
  private handleMessage(message: MeshMessage, fromPeerId: string) {
    if (message.type === 'ping') {
      // Respond to ping
      this.sendMessage(fromPeerId, {
        type: 'pong',
        from: this.peer!.id!,
        timestamp: Date.now(),
      });
    } else if (message.type === 'handshake') {
      // New peer connected
      this.callbacks.onPeerConnected({
        id: fromPeerId,
        name: message.payload?.name || 'Unknown',
        lastSeen: Date.now(),
        status: 'green',
        statusHistory: [],
        connectionState: 'connected',
      });
    } else if (message.type === 'tetrahedron-heartbeat') {
      // Handle Tetrahedron heartbeat
      const heartbeat = message.payload?.heartbeat;
      if (heartbeat && message.tetrahedronId) {
        this.handleTetrahedronHeartbeat(message.tetrahedronId, heartbeat, fromPeerId);
      }
    } else {
      // Forward to callback
      this.callbacks.onMessage(message);
    }
  }

  /**
   * Handle Tetrahedron heartbeat messages
   */
  private handleTetrahedronHeartbeat(tetrahedronId: string, heartbeat: TetrahedronHeartbeat, fromPeerId: string) {
    // Store heartbeat in history
    if (!this.heartbeatHistory.has(tetrahedronId)) {
      this.heartbeatHistory.set(tetrahedronId, []);
    }

    const history = this.heartbeatHistory.get(tetrahedronId)!;
    history.push(heartbeat);

    // Keep only recent history (last 100 heartbeats)
    if (history.length > 100) {
      history.shift();
    }

    // Check for critical conditions
    if (heartbeat.statusFlags.panicMode) {
      console.warn('[Tetrahedron] Panic mode detected from:', fromPeerId);
      // Could trigger haptic alert or notification
    }

    if (heartbeat.neuralEntropy > 80) {
      console.warn('[Tetrahedron] High neural entropy from:', fromPeerId, heartbeat.neuralEntropy);
    }

    // Update peer status based on heartbeat
    this.callbacks.onMessage({
      type: 'tetrahedron-heartbeat',
      from: fromPeerId,
      timestamp: Date.now(),
      tetrahedronId,
      payload: { heartbeat }
    });
  }

  // Tetrahedron Protocol Methods

  /**
   * Check if a peer is a member of any of my tetrahedrons (Simmelian Tie)
   */
  isTetrahedronMember(peerId: string): boolean {
    for (const tetraId of this.myTetrahedrons) {
      const tetra = this.tetrahedronGroups.get(tetraId);
      if (tetra && tetra.members.includes(peerId)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Determine if message should be relayed based on Tetrahedron topology
   */
  shouldRelayMessage(message: MeshMessage): boolean {
    // Always relay if no tetrahedron scoping (public messages)
    if (!message.tetrahedronId) return true;

    // Only relay if I'm a member of this tetrahedron
    return this.myTetrahedrons.has(message.tetrahedronId);
  }

  /**
   * Register a tetrahedron group I belong to
   */
  registerTetrahedron(tetrahedron: TetrahedronGroup): void {
    this.tetrahedronGroups.set(tetrahedron.id, tetrahedron);
    if (tetrahedron.members.includes(this.peer?.id || '')) {
      this.myTetrahedrons.add(tetrahedron.id);
    }
  }

  /**
   * Send tetrahedron-scoped heartbeat
   */
  sendTetrahedronHeartbeat(heartbeat: TetrahedronHeartbeat, tetrahedronId: string): void {
    const message: MeshMessage = {
      type: 'tetrahedron-heartbeat',
      from: this.peer?.id || '',
      timestamp: Date.now(),
      tetrahedronId,
      payload: { heartbeat }
    };

    // Send to all tetrahedron members
    const tetra = this.tetrahedronGroups.get(tetrahedronId);
    if (tetra) {
      tetra.members.forEach(peerId => {
        if (peerId !== this.peer?.id) {
          this.sendMessage(peerId, message);
        }
      });
    }

    // Store in history
    if (!this.heartbeatHistory.has(tetrahedronId)) {
      this.heartbeatHistory.set(tetrahedronId, []);
    }
    this.heartbeatHistory.get(tetrahedronId)!.push(heartbeat);
  }

  /**
   * Send message to a specific peer
   */
  sendMessage(peerId: string, message: MeshMessage): boolean {
    const conn = this.connections.get(peerId);
    if (!conn || conn.open === false) {
      console.warn('[Mesh] Cannot send - not connected to', peerId);
      return false;
    }

    try {
      conn.send(message);
      return true;
    } catch (error) {
      console.error('[Mesh] Failed to send message:', error);
      return false;
    }
  }

  /**
   * Broadcast status to all connected peers
   */
  broadcastStatus(status: string, name: string, note?: string): void {
    const message: MeshMessage = {
      type: 'status',
      from: this.peer!.id!,
      timestamp: Date.now(),
      payload: {
        status: status as any,
        name,
        note,
      },
    };

    for (const peerId of this.connections.keys()) {
      this.sendMessage(peerId, message);
    }
  }

  /**
   * Start periodic status broadcast
   */
  private startStatusBroadcast(): void {
    if (this.broadcastInterval) {
      clearInterval(this.broadcastInterval);
    }

    this.broadcastInterval = setInterval(() => {
      // Ping all peers to check connectivity
      for (const peerId of this.connections.keys()) {
        this.sendMessage(peerId, {
          type: 'ping',
          from: this.peer!.id!,
          timestamp: Date.now(),
        });
      }
    }, GOD_CONFIG.heartbeat.statusBroadcastInterval);
  }

  /**
   * Cleanup connection
   */
  private cleanupConnection(peerId: string): void {
    const conn = this.connections.get(peerId);
    if (conn) {
      conn.close();
      this.connections.delete(peerId);
    }

    const timer = this.reconnectTimers.get(peerId);
    if (timer) {
      clearTimeout(timer);
      this.reconnectTimers.delete(peerId);
    }
  }

  /**
   * Disconnect from a peer
   */
  disconnectPeer(peerId: string): void {
    this.cleanupConnection(peerId);
  }

  /**
   * Get all connected peer IDs
   */
  getConnectedPeers(): string[] {
    return Array.from(this.connections.keys());
  }

  /**
   * Check if connected to a peer
   */
  isConnected(peerId: string): boolean {
    const conn = this.connections.get(peerId);
    return conn !== undefined && conn.open === true;
  }

  /**
   * Destroy the mesh network
   */
  destroy(): void {
    if (this.broadcastInterval) {
      clearInterval(this.broadcastInterval);
      this.broadcastInterval = null;
    }

    for (const peerId of this.connections.keys()) {
      this.cleanupConnection(peerId);
    }

    if (this.peer && !this.peer.destroyed) {
      this.peer.destroy();
    }

    this.peer = null;
  }

  /**
   * Get current peer ID
   */
  getPeerId(): string | null {
    return this.peer?.id || null;
  }
}

