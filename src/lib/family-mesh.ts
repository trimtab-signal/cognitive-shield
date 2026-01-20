/**
 * @license AGPLv3 - Wonky Sprout DUNA
 * 
 * FAMILY MESH - Peer-to-Peer Family Communication
 * 
 * TRUE SOVEREIGNTY: No server needed. Direct connection between family members.
 * Each person gets a unique ID. Share IDs to connect. Messages flow through
 * the Cognitive Shield for filtering/translation.
 */

import Peer, { DataConnection } from 'peerjs';

export interface FamilyMember {
  id: string;
  name: string;
  role: 'dad' | 'mom' | 'son' | 'daughter' | 'other';
  voltage: number;
  spoons: number;
  heartbeat: string;
  lastSeen: number;
}

export interface FamilyMessage {
  id: string;
  from: string;
  to: string | 'all';
  text: string;
  translated?: {
    guardian: string;
    order: string;
    achiever: string;
    empath: string;
  };
  timestamp: number;
  filtered: boolean;
}

class FamilyMeshService {
  private peer: Peer | null = null;
  private connections: Map<string, DataConnection> = new Map();
  private myId: string | null = null;
  private myProfile: FamilyMember | null = null;
  private messageHandlers: ((message: FamilyMessage) => void)[] = [];
  private memberHandlers: ((members: FamilyMember[]) => void)[] = [];
  private knownMembers: Map<string, FamilyMember> = new Map();

  async initialize(profile: Omit<FamilyMember, 'id' | 'lastSeen'>) {
    // Generate a memorable family ID (not random hash)
    const familyPrefix = 'phenix';
    const timestamp = Date.now().toString(36).slice(-4);
    const random = Math.random().toString(36).slice(2, 6);
    this.myId = `${familyPrefix}-${profile.role}-${timestamp}${random}`;

    this.myProfile = {
      ...profile,
      id: this.myId,
      lastSeen: Date.now(),
    };

    // Initialize PeerJS with free public server
    this.peer = new Peer(this.myId, {
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ]
      }
    });

    this.peer.on('open', (id) => {
      console.log(`[FamilyMesh] Connected as: ${id}`);
      this.myId = id;
      this.broadcastPresence();
    });

    this.peer.on('connection', (conn) => {
      this.handleIncomingConnection(conn);
    });

    this.peer.on('error', (err) => {
      console.error('[FamilyMesh] Error:', err);
    });

    // Save my ID to localStorage so family can find me
    localStorage.setItem('phenix-family-id', this.myId);
    localStorage.setItem('phenix-family-profile', JSON.stringify(this.myProfile));

    return this.myId;
  }

  private handleIncomingConnection(conn: DataConnection): void {
    console.log(`[FamilyMesh] Incoming connection from: ${conn.peer}`);
    
    conn.on('open', () => {
      this.connections.set(conn.peer, conn);
      console.log(`[FamilyMesh] Connection established with: ${conn.peer}`);
      
      // Send my profile
      conn.send({
        type: 'presence',
        profile: this.myProfile,
      });
    });

    conn.on('data', (data: unknown) => {
      this.handleData(conn.peer, data);
    });

    conn.on('close', () => {
      this.connections.delete(conn.peer);
      this.knownMembers.delete(conn.peer);
      this.notifyMemberUpdate();
    });
  }

  async connectToFamilyMember(theirId: string) {
    if (!this.peer || this.connections.has(theirId)) {
      return;
    }

    console.log(`[FamilyMesh] Connecting to: ${theirId}`);
    const conn = this.peer.connect(theirId);

    conn.on('open', () => {
      this.connections.set(theirId, conn);
      console.log(`[FamilyMesh] Connected to: ${theirId}`);
      
      // Send my profile
      conn.send({
        type: 'presence',
        profile: this.myProfile,
      });
    });

    conn.on('data', (data: unknown) => {
      this.handleData(theirId, data);
    });

    conn.on('close', () => {
      this.connections.delete(theirId);
      this.knownMembers.delete(theirId);
      this.notifyMemberUpdate();
    });
  }

  private handleData(fromId: string, data: unknown): void {
    console.log(`[FamilyMesh] Data from ${fromId}:`, data);

    const payload = data as Record<string, unknown>;
    
    switch (payload.type) {
      case 'presence': {
        const profile = payload.profile as FamilyMember;
        this.knownMembers.set(fromId, {
          ...profile,
          lastSeen: Date.now(),
        });
        this.notifyMemberUpdate();
        break;
      }

      case 'message': {
        const message = payload.message as FamilyMessage;
        this.notifyMessageReceived(message);
        break;
      }

      case 'state_update': {
        const member = this.knownMembers.get(fromId);
        const state = payload.state as Partial<Pick<FamilyMember, 'voltage' | 'spoons' | 'heartbeat'>>;
        if (member) {
          Object.assign(member, state, { lastSeen: Date.now() });
          this.notifyMemberUpdate();
        }
        break;
      }
    }
  }

  sendMessage(to: string | 'all', text: string, filtered = true) {
    if (!this.myId || !this.myProfile) return;

    const message: FamilyMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      from: this.myId,
      to,
      text,
      timestamp: Date.now(),
      filtered,
    };

    // If filtered, generate translations using GenSync
    if (filtered) {
      message.translated = this.generateTranslations(text);
    }

    if (to === 'all') {
      // Broadcast to all connections
      this.connections.forEach((conn) => {
        conn.send({
          type: 'message',
          message,
        });
      });
    } else {
      // Send to specific person
      const conn = this.connections.get(to);
      if (conn) {
        conn.send({
          type: 'message',
          message,
        });
      }
    }

    // Also notify locally so sender sees their message
    this.notifyMessageReceived(message);
  }

  private generateTranslations(text: string) {
    // Simplified GenSync translations
    // In production, this would call the full GenSync AI
    return {
      guardian: `[Protective] ${text}`,
      order: `[Formal] ${text}`,
      achiever: `[Strategic] ${text}`,
      empath: `[Caring] ${text}`,
    };
  }

  updateMyState(updates: Partial<Pick<FamilyMember, 'voltage' | 'spoons' | 'heartbeat'>>) {
    if (!this.myProfile) return;

    Object.assign(this.myProfile, updates, { lastSeen: Date.now() });

    // Broadcast state update to all connections
    this.connections.forEach((conn) => {
      conn.send({
        type: 'state_update',
        state: updates,
      });
    });
  }

  private broadcastPresence() {
    this.connections.forEach((conn) => {
      conn.send({
        type: 'presence',
        profile: this.myProfile,
      });
    });
  }

  onMessage(handler: (message: FamilyMessage) => void) {
    this.messageHandlers.push(handler);
  }

  onMemberUpdate(handler: (members: FamilyMember[]) => void) {
    this.memberHandlers.push(handler);
  }

  private notifyMessageReceived(message: FamilyMessage) {
    this.messageHandlers.forEach(h => h(message));
  }

  private notifyMemberUpdate() {
    const members = Array.from(this.knownMembers.values());
    if (this.myProfile) {
      members.unshift(this.myProfile); // Add self first
    }
    this.memberHandlers.forEach(h => h(members));
  }

  getMyId(): string | null {
    return this.myId;
  }

  getConnectedMembers(): FamilyMember[] {
    return Array.from(this.knownMembers.values());
  }

  getAllMembers(): FamilyMember[] {
    const members = this.getConnectedMembers();
    if (this.myProfile) {
      return [this.myProfile, ...members];
    }
    return members;
  }

  disconnect() {
    this.connections.forEach(conn => conn.close());
    this.connections.clear();
    this.peer?.destroy();
  }
}

// Singleton instance
export const familyMesh = new FamilyMeshService();
