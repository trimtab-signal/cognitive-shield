/**
 * QUANTUM ENTANGLEMENT BRIDGE - REAL-TIME QUANTUM STATE SYNCHRONIZATION
 * Magical demonstration of quantum-like correlations across browser instances
 *
 * Creates entangled quantum states that synchronize instantly across multiple tabs/windows
 * using WebRTC peer-to-peer communication and SIC-POVM measurement principles
 */

// Local implementation for demo purposes
function performSICPOVMMeasurement(quantumState: { theta: number; phi: number; purity: number }) {
  // Simplified SIC-POVM measurement for demo
  const outcome = Math.floor(Math.random() * 4); // 4 possible outcomes for tetrahedron
  const probability = quantumState.purity * 0.25 + (1 - quantumState.purity) * (1/4);
  return { outcome, probability };
}

// Define SIC-POVM state locally
interface SICPOVMState {
  theta: number;
  phi: number;
  purity: number;
  measurement?: number;
  timestamp?: number;
}

// Entanglement session management
interface EntanglementSession {
  sessionId: string;
  peerId: string;
  entangledStates: Map<string, SICPOVMState>;
  correlationMatrix: Map<string, Map<string, number>>;
  measurementHistory: Array<{
    particleId: string;
    measurement: number;
    timestamp: number;
    correlatedUpdates: string[];
  }>;
  isActive: boolean;
}

// WebRTC signaling and P2P communication
interface SignalingMessage {
  type: 'offer' | 'answer' | 'ice-candidate' | 'entanglement-sync' | 'measurement-event';
  from: string;
  to: string;
  sessionId: string;
  payload: any;
  timestamp: number;
}

export class QuantumEntanglementBridge {
  private sessions: Map<string, EntanglementSession> = new Map();
  private peers: Map<string, RTCPeerConnection> = new Map();
  private dataChannels: Map<string, RTCDataChannel> = new Map();
  private localPeerId: string;
  private signalingServer: WebSocket | null = null;
  private eventListeners: Map<string, Set<(data: any) => void>> = new Map();

  // Quantum entanglement parameters
  private readonly ENTANGLEMENT_STRENGTH = 0.95; // How strongly states are correlated
  private readonly MEASUREMENT_PRECISION = 0.001; // Precision of quantum measurements
  private readonly CORRELATION_DECAY = 0.999; // How correlations decay over time

  constructor() {
    this.localPeerId = this.generatePeerId();
    this.setupSignalingServer();
  }

  /**
   * Generate unique peer identifier
   */
  private generatePeerId(): string {
    return `quantum_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Setup WebSocket signaling server for P2P connection establishment
   */
  private setupSignalingServer(): void {
    // For demo purposes, we'll use a simple WebSocket echo server
    // In production, this would connect to a real signaling server
    try {
      this.signalingServer = new WebSocket('wss://echo.websocket.org');

      this.signalingServer.onopen = () => {
        console.log('🔗 Quantum signaling server connected');
        this.emitEvent('signalingConnected', {});
      };

      this.signalingServer.onmessage = (event) => {
        try {
          const message: SignalingMessage = JSON.parse(event.data);
          this.handleSignalingMessage(message);
        } catch (error) {
          console.warn('Invalid signaling message:', error);
        }
      };

      this.signalingServer.onclose = () => {
        console.log('🔌 Quantum signaling server disconnected');
        this.emitEvent('signalingDisconnected', {});
      };

    } catch (error) {
      console.warn('Signaling server connection failed, using local-only mode');
      this.emitEvent('signalingFailed', { error });
    }
  }

  /**
   * Create a new quantum entanglement session
   */
  async createEntanglementSession(particleIds: string[]): Promise<string> {
    const sessionId = `entanglement_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const session: EntanglementSession = {
      sessionId,
      peerId: this.localPeerId,
      entangledStates: new Map(),
      correlationMatrix: new Map(),
      measurementHistory: [],
      isActive: true
    };

    // Initialize entangled states for each particle
    for (const particleId of particleIds) {
      const initialState = this.generateEntangledState(particleId, particleIds);
      session.entangledStates.set(particleId, initialState);

      // Initialize correlation matrix
      session.correlationMatrix.set(particleId, new Map());
      for (const otherId of particleIds) {
        const correlation = particleId === otherId ? 1.0 :
          this.ENTANGLEMENT_STRENGTH * (1 - Math.abs(particleIds.indexOf(particleId) - particleIds.indexOf(otherId)) / particleIds.length);
        session.correlationMatrix.get(particleId)!.set(otherId, correlation);
      }
    }

    this.sessions.set(sessionId, session);

    // Broadcast session creation
    this.broadcastSignalingMessage({
      type: 'entanglement-sync',
      from: this.localPeerId,
      to: 'all',
      sessionId,
      payload: {
        action: 'session-created',
        particleIds,
        initialStates: Object.fromEntries(session.entangledStates)
      },
      timestamp: Date.now()
    });

    console.log(`✨ Created quantum entanglement session: ${sessionId}`);
    this.emitEvent('sessionCreated', { sessionId, particleIds });

    return sessionId;
  }

  /**
   * Generate an entangled quantum state
   */
  private generateEntangledState(particleId: string, allParticleIds: string[]): SICPOVMState {
    // Create a SIC-POVM state with quantum correlations
    const baseMeasurement = performSICPOVMMeasurement();

    // Apply entanglement correlations
    const entangledState: SICPOVMState = {
      ...baseMeasurement,
      particleId,
      entanglementGroup: allParticleIds,
      correlationStrength: this.ENTANGLEMENT_STRENGTH,
      lastMeasurement: Date.now(),
      coherence: 0.95 + Math.random() * 0.05, // High coherence for entangled states
      phase: Math.random() * 2 * Math.PI
    };

    return entangledState;
  }

  /**
   * Perform a quantum measurement on an entangled particle
   */
  async measureEntangledParticle(sessionId: string, particleId: string): Promise<SICPOVMState> {
    const session = this.sessions.get(sessionId);
    if (!session || !session.isActive) {
      throw new Error('Invalid or inactive entanglement session');
    }

    // Perform local measurement
    const measurement = performSICPOVMMeasurement();
    const entangledState: SICPOVMState = {
      ...measurement,
      particleId,
      entanglementGroup: Array.from(session.entangledStates.keys()),
      correlationStrength: this.ENTANGLEMENT_STRENGTH,
      lastMeasurement: Date.now(),
      coherence: measurement.coherence,
      phase: measurement.phase
    };

    // Update local state
    session.entangledStates.set(particleId, entangledState);

    // Record measurement in history
    session.measurementHistory.push({
      particleId,
      measurement: measurement.measurement,
      timestamp: Date.now(),
      correlatedUpdates: []
    });

    // Propagate entanglement to correlated particles
    await this.propagateEntanglement(sessionId, particleId, entangledState);

    // Broadcast measurement event
    this.broadcastSignalingMessage({
      type: 'measurement-event',
      from: this.localPeerId,
      to: 'all',
      sessionId,
      payload: {
        particleId,
        measurement: entangledState,
        sessionId
      },
      timestamp: Date.now()
    });

    console.log(`🔬 Measured entangled particle ${particleId} in session ${sessionId}`);
    this.emitEvent('measurementPerformed', { sessionId, particleId, measurement: entangledState });

    return entangledState;
  }

  /**
   * Propagate quantum entanglement correlations
   */
  private async propagateEntanglement(sessionId: string, sourceParticleId: string, sourceState: SICPOVMState): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const correlatedUpdates: string[] = [];

    // Update correlated particles based on quantum entanglement principles
    for (const [particleId, correlationMap] of session.correlationMatrix) {
      if (particleId === sourceParticleId) continue;

      const correlation = correlationMap.get(sourceParticleId) || 0;
      if (correlation < 0.1) continue; // Skip weakly correlated particles

      // Apply quantum correlation (simplified EPR paradox demonstration)
      const currentState = session.entangledStates.get(particleId);
      if (currentState) {
        // In a real quantum system, measuring one entangled particle
        // would instantly determine the state of the correlated particle
        const correlatedState: SICPOVMState = {
          ...currentState,
          // Apply anti-correlation for demonstration (like spin entanglement)
          measurement: (sourceState.measurement + Math.PI) % (2 * Math.PI),
          phase: (sourceState.phase + Math.PI) % (2 * Math.PI),
          correlationStrength: correlation,
          entangledWith: sourceParticleId,
          entanglementTime: Date.now(),
          // Maintain high coherence for entangled states
          coherence: Math.max(currentState.coherence * 0.98, 0.85)
        };

        session.entangledStates.set(particleId, correlatedState);
        correlatedUpdates.push(particleId);

        // Trigger visual update
        this.emitEvent('entanglementPropagated', {
          sessionId,
          sourceParticle: sourceParticleId,
          targetParticle: particleId,
          correlation,
          updatedState: correlatedState
        });
      }
    }

    // Update measurement history
    const lastMeasurement = session.measurementHistory[session.measurementHistory.length - 1];
    if (lastMeasurement) {
      lastMeasurement.correlatedUpdates = correlatedUpdates;
    }
  }

  /**
   * Join an existing entanglement session
   */
  async joinEntanglementSession(sessionId: string, remotePeerId: string): Promise<void> {
    // Create WebRTC peer connection
    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });

    this.peers.set(remotePeerId, peerConnection);

    // Create data channel for quantum state synchronization
    const dataChannel = peerConnection.createDataChannel(`quantum-entanglement-${sessionId}`, {
      ordered: true,
      maxPacketLifeTime: 3000
    });

    this.dataChannels.set(remotePeerId, dataChannel);

    // Setup data channel handlers
    dataChannel.onopen = () => {
      console.log(`🔗 Quantum data channel opened with ${remotePeerId}`);
      this.emitEvent('peerConnected', { peerId: remotePeerId, sessionId });
    };

    dataChannel.onmessage = (event) => {
      this.handlePeerMessage(remotePeerId, sessionId, event.data);
    };

    dataChannel.onclose = () => {
      console.log(`🔌 Quantum data channel closed with ${remotePeerId}`);
      this.emitEvent('peerDisconnected', { peerId: remotePeerId, sessionId });
    };

    // Setup ICE candidate handling
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendSignalingMessage(remotePeerId, {
          type: 'ice-candidate',
          from: this.localPeerId,
          to: remotePeerId,
          sessionId,
          payload: event.candidate,
          timestamp: Date.now()
        });
      }
    };

    // Create offer
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    this.sendSignalingMessage(remotePeerId, {
      type: 'offer',
      from: this.localPeerId,
      to: remotePeerId,
      sessionId,
      payload: offer,
      timestamp: Date.now()
    });
  }

  /**
   * Handle incoming signaling messages
   */
  private async handleSignalingMessage(message: SignalingMessage): Promise<void> {
    switch (message.type) {
      case 'offer':
        await this.handleOffer(message);
        break;
      case 'answer':
        await this.handleAnswer(message);
        break;
      case 'ice-candidate':
        await this.handleIceCandidate(message);
        break;
      case 'entanglement-sync':
        this.handleEntanglementSync(message);
        break;
      case 'measurement-event':
        this.handleMeasurementEvent(message);
        break;
    }
  }

  /**
   * Handle WebRTC offer
   */
  private async handleOffer(message: SignalingMessage): Promise<void> {
    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
      ]
    });

    this.peers.set(message.from, peerConnection);

    peerConnection.ondatachannel = (event) => {
      const dataChannel = event.channel;
      this.dataChannels.set(message.from, dataChannel);

      dataChannel.onopen = () => {
        console.log(`🔗 Quantum data channel opened with ${message.from}`);
        this.emitEvent('peerConnected', { peerId: message.from, sessionId: message.sessionId });
      };

      dataChannel.onmessage = (event) => {
        this.handlePeerMessage(message.from, message.sessionId, event.data);
      };
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendSignalingMessage(message.from, {
          type: 'ice-candidate',
          from: this.localPeerId,
          to: message.from,
          sessionId: message.sessionId,
          payload: event.candidate,
          timestamp: Date.now()
        });
      }
    };

    await peerConnection.setRemoteDescription(message.payload);
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    this.sendSignalingMessage(message.from, {
      type: 'answer',
      from: this.localPeerId,
      to: message.from,
      sessionId: message.sessionId,
      payload: answer,
      timestamp: Date.now()
    });
  }

  /**
   * Handle WebRTC answer
   */
  private async handleAnswer(message: SignalingMessage): Promise<void> {
    const peerConnection = this.peers.get(message.from);
    if (peerConnection) {
      await peerConnection.setRemoteDescription(message.payload);
    }
  }

  /**
   * Handle ICE candidate
   */
  private async handleIceCandidate(message: SignalingMessage): Promise<void> {
    const peerConnection = this.peers.get(message.from);
    if (peerConnection) {
      await peerConnection.addIceCandidate(message.payload);
    }
  }

  /**
   * Handle entanglement synchronization
   */
  private handleEntanglementSync(message: SignalingMessage): void {
    const { action, particleIds, initialStates } = message.payload;

    if (action === 'session-created') {
      // Join the entanglement session
      const session: EntanglementSession = {
        sessionId: message.sessionId,
        peerId: message.from,
        entangledStates: new Map(Object.entries(initialStates)),
        correlationMatrix: new Map(),
        measurementHistory: [],
        isActive: true
      };

      // Initialize correlation matrix
      for (const particleId of particleIds) {
        session.correlationMatrix.set(particleId, new Map());
        for (const otherId of particleIds) {
          const correlation = particleId === otherId ? 1.0 : this.ENTANGLEMENT_STRENGTH;
          session.correlationMatrix.get(particleId)!.set(otherId, correlation);
        }
      }

      this.sessions.set(message.sessionId, session);

      console.log(`✨ Joined quantum entanglement session: ${message.sessionId}`);
      this.emitEvent('sessionJoined', { sessionId: message.sessionId, particleIds });
    }
  }

  /**
   * Handle remote measurement event
   */
  private handleMeasurementEvent(message: SignalingMessage): void {
    const { particleId, measurement, sessionId } = message.payload;
    const session = this.sessions.get(sessionId);

    if (session) {
      // Update local state with remote measurement
      session.entangledStates.set(particleId, measurement);

      // Propagate correlations locally
      this.propagateEntanglement(sessionId, particleId, measurement);

      console.log(`🔄 Remote measurement received for particle ${particleId}`);
      this.emitEvent('remoteMeasurement', { sessionId, particleId, measurement });
    }
  }

  /**
   * Handle peer-to-peer messages
   */
  private handlePeerMessage(peerId: string, sessionId: string, data: string): void {
    try {
      const message = JSON.parse(data);
      this.emitEvent('peerMessage', { peerId, sessionId, message });
    } catch (error) {
      console.warn('Invalid peer message:', error);
    }
  }

  /**
   * Send signaling message
   */
  private sendSignalingMessage(to: string, message: SignalingMessage): void {
    if (this.signalingServer && this.signalingServer.readyState === WebSocket.OPEN) {
      this.signalingServer.send(JSON.stringify(message));
    } else {
      // Fallback: use local broadcast (for same-origin tabs)
      this.broadcastToLocalTabs(message);
    }
  }

  /**
   * Broadcast signaling message
   */
  private broadcastSignalingMessage(message: SignalingMessage): void {
    if (this.signalingServer && this.signalingServer.readyState === WebSocket.OPEN) {
      this.signalingServer.send(JSON.stringify(message));
    }
    // Also broadcast locally for multi-tab scenarios
    this.broadcastToLocalTabs(message);
  }

  /**
   * Broadcast to other browser tabs/windows (same origin)
   */
  private broadcastToLocalTabs(message: SignalingMessage): void {
    // Use BroadcastChannel API for same-origin communication
    if ('BroadcastChannel' in window) {
      const channel = new BroadcastChannel('quantum-entanglement');
      channel.postMessage(message);
      channel.close();
    }

    // Also use localStorage for broader compatibility
    const messageKey = `quantum_entanglement_${Date.now()}`;
    localStorage.setItem(messageKey, JSON.stringify(message));

    // Clean up old messages
    setTimeout(() => localStorage.removeItem(messageKey), 1000);
  }

  /**
   * Listen for local tab broadcasts
   */
  private setupLocalBroadcastListener(): void {
    if ('BroadcastChannel' in window) {
      const channel = new BroadcastChannel('quantum-entanglement');
      channel.onmessage = (event) => {
        this.handleSignalingMessage(event.data);
      };
    }

    // Listen for localStorage changes
    window.addEventListener('storage', (event) => {
      if (event.key && event.key.startsWith('quantum_entanglement_')) {
        try {
          const message = JSON.parse(event.newValue || '{}');
          this.handleSignalingMessage(message);
        } catch (error) {
          // Ignore invalid messages
        }
      }
    });
  }

  /**
   * Get session information
   */
  getSession(sessionId: string): EntanglementSession | null {
    return this.sessions.get(sessionId) || null;
  }

  /**
   * Get all active sessions
   */
  getActiveSessions(): string[] {
    return Array.from(this.sessions.keys()).filter(id => {
      const session = this.sessions.get(id);
      return session?.isActive;
    });
  }

  /**
   * Get entangled state for a particle
   */
  getEntangledState(sessionId: string, particleId: string): SICPOVMState | null {
    const session = this.sessions.get(sessionId);
    return session?.entangledStates.get(particleId) || null;
  }

  /**
   * End entanglement session
   */
  endSession(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.isActive = false;

      // Close peer connections
      for (const [peerId, peerConnection] of this.peers) {
        peerConnection.close();
      }

      // Close data channels
      for (const [peerId, dataChannel] of this.dataChannels) {
        dataChannel.close();
      }

      this.peers.clear();
      this.dataChannels.clear();

      console.log(`🔚 Ended quantum entanglement session: ${sessionId}`);
      this.emitEvent('sessionEnded', { sessionId });
    }
  }

  /**
   * Event system
   */
  on(event: string, callback: (data: any) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);
  }

  off(event: string, callback: (data: any) => void): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback);
    }
  }

  private emitEvent(event: string, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in quantum entanglement event listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Initialize the bridge
   */
  initialize(): void {
    this.setupLocalBroadcastListener();
    console.log('✨ Quantum Entanglement Bridge initialized');
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    // End all sessions
    for (const sessionId of this.getActiveSessions()) {
      this.endSession(sessionId);
    }

    // Close signaling connection
    if (this.signalingServer) {
      this.signalingServer.close();
    }

    this.eventListeners.clear();
    console.log('🧹 Quantum Entanglement Bridge cleaned up');
  }
}

// Global bridge instance
export const quantumEntanglementBridge = new QuantumEntanglementBridge();

// Initialize on creation
quantumEntanglementBridge.initialize();

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    quantumEntanglementBridge.cleanup();
  });
}