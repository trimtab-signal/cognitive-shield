/**
 * @license AGPLv3 - Wonky Sprout DUNA
 * 
 * FAMILY CHAT - The Communication Channel
 * 
 * This IS the way you talk to your family. Not a demo. The ACTUAL channel.
 */

import { useState, useEffect, useRef } from 'react';
import { familyMesh } from '../../lib/family-mesh';
import type { FamilyMember, FamilyMessage } from '../../lib/family-mesh';
import { useShieldStore } from '../../stores/shield.store';
import { FamilyOnboarding } from './FamilyOnboarding';

export function FamilyChat() {
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [myId, setMyId] = useState<string | null>(null);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [messages, setMessages] = useState<FamilyMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [connectId, setConnectId] = useState('');
  const [showConnect, setShowConnect] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const voltage = useShieldStore(state => state.voltage);
  const spoons = 5.0; // Default energy level

  useEffect(() => {
    // Initialize on first mount
    const init = async () => {
      // Check if already initialized
      const onboardingComplete = localStorage.getItem('phenix-onboarding-complete');
      const savedId = localStorage.getItem('phenix-family-id');
      
      if (!onboardingComplete || !savedId) {
        setNeedsOnboarding(true);
        return;
      }

      setMyId(savedId);
      setInitialized(true);
    };

    init();

    // Listen for messages
    familyMesh.onMessage((msg) => {
      setMessages(prev => [...prev, msg]);
    });

    // Listen for member updates
    familyMesh.onMemberUpdate((updatedMembers) => {
      setMembers(updatedMembers);
    });

    return () => {
      // Cleanup handled by service
    };
  }, []);

  // Sync state updates to mesh
  useEffect(() => {
    if (initialized) {
      familyMesh.updateMyState({ voltage, spoons, heartbeat: 'NORMAL' });
    }
  }, [voltage, spoons, initialized]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    familyMesh.sendMessage('all', messageText, true);
    setMessageText('');
  };

  const handleConnect = () => {
    if (!connectId.trim()) return;
    
    familyMesh.connectToFamilyMember(connectId.trim());
    setConnectId('');
    setShowConnect(false);
  };

  const copyMyId = () => {
    if (myId) {
      navigator.clipboard.writeText(myId);
      alert('Your Family ID copied! Share this with your family.');
    }
  };

  if (needsOnboarding) {
    return <FamilyOnboarding onComplete={() => {
      setNeedsOnboarding(false);
      const savedId = localStorage.getItem('phenix-family-id');
      setMyId(savedId);
      setInitialized(true);
    }} />;
  }

  if (!initialized) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '14px', color: '#9CA3AF' }}>
          Initializing Family Mesh...
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: '#111827',
      borderRadius: '12px',
      border: '1px solid #374151',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        background: '#1F2937',
        borderBottom: '1px solid #374151',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
        }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#F3F4F6' }}>
            💜 Family Shield
          </h3>
          <button
            onClick={() => setShowConnect(!showConnect)}
            style={{
              padding: '6px 12px',
              background: '#3B82F6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            + Connect
          </button>
        </div>

        {/* My ID */}
        <div
          onClick={copyMyId}
          style={{
            padding: '10px',
            background: '#374151',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
            fontFamily: 'monospace',
            color: '#10B981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>Your ID: {myId}</span>
          <span style={{ color: '#9CA3AF' }}>📋 Click to copy</span>
        </div>

        {/* Connect Form */}
        {showConnect && (
          <div style={{
            marginTop: '12px',
            padding: '12px',
            background: '#374151',
            borderRadius: '6px',
          }}>
            <input
              type="text"
              value={connectId}
              onChange={(e) => setConnectId(e.target.value)}
              placeholder="Paste family member's ID..."
              style={{
                width: '100%',
                padding: '8px',
                background: '#1F2937',
                border: '1px solid #4B5563',
                borderRadius: '4px',
                color: '#F3F4F6',
                fontSize: '13px',
                marginBottom: '8px',
              }}
            />
            <button
              onClick={handleConnect}
              style={{
                width: '100%',
                padding: '8px',
                background: '#10B981',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500',
              }}
            >
              Connect to Family Member
            </button>
          </div>
        )}
      </div>

      {/* Family Members */}
      {members.length > 0 && (
        <div style={{
          padding: '12px',
          background: '#1F2937',
          borderBottom: '1px solid #374151',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
        }}>
          {members.map(member => {
            const isMe = member.id === myId;
            const voltageColor = member.voltage > 70 ? '#EF4444' : member.voltage > 40 ? '#F59E0B' : '#10B981';
            
            return (
              <div
                key={member.id}
                style={{
                  padding: '8px 12px',
                  background: isMe ? '#3B82F6' : '#374151',
                  borderRadius: '8px',
                  minWidth: '120px',
                  fontSize: '12px',
                }}
              >
                <div style={{ fontWeight: '600', color: '#F3F4F6', marginBottom: '4px' }}>
                  {member.name} {isMe && '(You)'}
                </div>
                <div style={{ color: '#9CA3AF', fontSize: '11px' }}>
                  {member.role} • {member.spoons.toFixed(1)} 🥄
                </div>
                <div style={{
                  marginTop: '4px',
                  padding: '2px 6px',
                  background: voltageColor + '20',
                  color: voltageColor,
                  borderRadius: '4px',
                  fontSize: '10px',
                  textAlign: 'center',
                }}>
                  V: {member.voltage.toFixed(0)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>
        {messages.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#6B7280',
            fontSize: '14px',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
            <div style={{ fontWeight: '600', marginBottom: '8px' }}>
              No messages yet
            </div>
            <div style={{ fontSize: '12px' }}>
              {members.length === 1 
                ? 'Connect to family members to start chatting'
                : 'Send a message to get started!'}
            </div>
          </div>
        ) : (
          messages.map(msg => {
            const isFromMe = msg.from === myId;
            const sender = members.find(m => m.id === msg.from);
            const senderName = sender?.name || 'Unknown';
            
            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isFromMe ? 'flex-end' : 'flex-start',
                }}
              >
                {!isFromMe && (
                  <div style={{
                    fontSize: '11px',
                    color: '#9CA3AF',
                    marginBottom: '4px',
                    marginLeft: '12px',
                  }}>
                    {senderName}
                  </div>
                )}
                <div style={{
                  maxWidth: '70%',
                  padding: '12px',
                  background: isFromMe ? '#3B82F6' : '#374151',
                  borderRadius: '12px',
                  color: '#F3F4F6',
                  fontSize: '14px',
                  lineHeight: '1.5',
                }}>
                  {msg.text}
                  {msg.filtered && (
                    <div style={{
                      marginTop: '8px',
                      paddingTop: '8px',
                      borderTop: '1px solid rgba(255,255,255,0.1)',
                      fontSize: '11px',
                      color: '#9CA3AF',
                    }}>
                      🛡️ Filtered
                    </div>
                  )}
                </div>
                <div style={{
                  fontSize: '10px',
                  color: '#6B7280',
                  marginTop: '4px',
                  marginLeft: isFromMe ? '0' : '12px',
                  marginRight: isFromMe ? '12px' : '0',
                }}>
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div style={{
        padding: '16px',
        background: '#1F2937',
        borderTop: '1px solid #374151',
        display: 'flex',
        gap: '12px',
      }}>
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: '12px',
            background: '#374151',
            border: '1px solid #4B5563',
            borderRadius: '8px',
            color: '#F3F4F6',
            fontSize: '14px',
          }}
        />
        <button
          onClick={handleSendMessage}
          disabled={!messageText.trim()}
          style={{
            padding: '12px 24px',
            background: messageText.trim() ? '#10B981' : '#4B5563',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: messageText.trim() ? 'pointer' : 'not-allowed',
            fontSize: '14px',
            fontWeight: '600',
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
