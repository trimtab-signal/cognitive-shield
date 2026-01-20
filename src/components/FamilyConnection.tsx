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
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║   FAMILY CONNECTION MODE - The Delta Topology in Action                   ║
 * ║   A calm, grounding interface for when the family is together             ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 * 
 * This is the "Holding Space" interface.
 * No notifications. No voltage. Just presence.
 */

import { useState, useEffect, useCallback } from 'react';
import { GOD_CONFIG } from '../god.config';

interface FamilyMember {
  id: string;
  name: string;
  role: string;
  emoji: string;
  color: string;
  status: 'present' | 'away' | 'sleeping';
}

const FAMILY: FamilyMember[] = [
  { id: 'will', name: 'Will', role: 'Dad', emoji: '🦅', color: '#3498db', status: 'present' },
  { id: 'christyn', name: 'Christyn', role: 'Mom', emoji: '🌸', color: '#FF69B4', status: 'present' },
  { id: 'kid1', name: 'Child 1', role: 'Navigator', emoji: '⭐', color: '#f39c12', status: 'present' },
  { id: 'kid2', name: 'Child 2', role: 'Navigator', emoji: '🌙', color: '#9b59b6', status: 'present' },
];

const AFFIRMATIONS = [
  "We are a mesh network. No single point of failure.",
  "Love is the invariant parameter C. It doesn't depend on the rotation of the world.",
  "We are Delta. We are unbreakable.",
  "The bonds we build today become permanent with time and pressure.",
  "Every challenge drives the resin deeper into our cracks.",
  "We hold space for each other without needing to fix.",
  "The vacuum was scary. The flood is nourishing. The cure is forever.",
  "We are the Trim Tab. Small adjustments, massive changes.",
  "Our love is Reference Frame Independent.",
  "We are building something that cannot be seized.",
];

const GROUNDING_PROMPTS = [
  { label: "5 things you see", color: "#3498db" },
  { label: "4 things you touch", color: "#2ecc71" },
  { label: "3 things you hear", color: "#f39c12" },
  { label: "2 things you smell", color: "#9b59b6" },
  { label: "1 thing you taste", color: "#e74c3c" },
];

export default function FamilyConnection() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathCount, setBreathCount] = useState(0);
  const [showGrounding, setShowGrounding] = useState(false);
  const [affirmationIndex, setAffirmationIndex] = useState(0);
  const [phenixConnected, setPhenixConnected] = useState(false);
  const [familyStatus, setFamilyStatus] = useState(FAMILY);

  // Update time
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Breathing animation
  useEffect(() => {
    const breathCycle = () => {
      // 4 seconds inhale
      setBreathPhase('inhale');
      setTimeout(() => {
        // 4 seconds hold
        setBreathPhase('hold');
        setTimeout(() => {
          // 8 seconds exhale
          setBreathPhase('exhale');
          setBreathCount(c => c + 1);
        }, 4000);
      }, 4000);
    };
    
    breathCycle();
    const interval = setInterval(breathCycle, 16000); // Full cycle: 4+4+8 = 16s
    return () => clearInterval(interval);
  }, []);

  // Rotate affirmations
  useEffect(() => {
    const interval = setInterval(() => {
      setAffirmationIndex(i => (i + 1) % AFFIRMATIONS.length);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Check Phenix connection
  useEffect(() => {
    // @ts-ignore - WebSerial API
    if (navigator.serial) {
      // @ts-ignore
      navigator.serial.getPorts().then((ports: any[]) => {
        setPhenixConnected(ports.length > 0);
      });
    }
  }, []);

  const toggleMemberStatus = useCallback((id: string) => {
    setFamilyStatus(prev => prev.map(m => 
      m.id === id 
        ? { ...m, status: m.status === 'present' ? 'away' : 'present' }
        : m
    ));
  }, []);

  const presentCount = familyStatus.filter(m => m.status === 'present').length;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0a0a1a 0%, #1a1a2e 50%, #16213e 100%)',
      padding: 32,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* Time Display */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ 
          fontSize: 64, 
          fontWeight: 200, 
          color: '#fff',
          fontFamily: 'monospace',
          letterSpacing: 4
        }}>
          {currentTime.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          })}
        </div>
        <div style={{ 
          fontSize: 16, 
          color: 'rgba(255,255,255,0.5)',
          marginTop: 8
        }}>
          {currentTime.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric',
            year: 'numeric'
          })}
        </div>
      </div>

      {/* Delta Constellation */}
      <div style={{
        position: 'relative',
        width: 300,
        height: 260,
        marginBottom: 32
      }}>
        {/* Triangle Lines */}
        <svg 
          viewBox="0 0 300 260" 
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0,
            width: '100%',
            height: '100%'
          }}
        >
          {/* Triangle connecting top 3 */}
          <path
            d="M 150 30 L 50 200 L 250 200 Z"
            fill="none"
            stroke="rgba(255,215,0,0.3)"
            strokeWidth="2"
            strokeDasharray={presentCount >= 3 ? "0" : "5,5"}
          />
          {/* Connection to center */}
          {presentCount === 4 && (
            <>
              <line x1="150" y1="30" x2="150" y2="130" stroke="rgba(255,215,0,0.2)" strokeWidth="1" />
              <line x1="50" y1="200" x2="150" y2="130" stroke="rgba(255,215,0,0.2)" strokeWidth="1" />
              <line x1="250" y1="200" x2="150" y2="130" stroke="rgba(255,215,0,0.2)" strokeWidth="1" />
            </>
          )}
        </svg>

        {/* Family Nodes */}
        {familyStatus.map((member, index) => {
          // Position in triangle + center
          const positions = [
            { x: 150, y: 30 },   // Top
            { x: 50, y: 200 },   // Bottom left
            { x: 250, y: 200 },  // Bottom right
            { x: 150, y: 130 },  // Center
          ];
          const pos = positions[index];
          
          return (
            <div
              key={member.id}
              onClick={() => toggleMemberStatus(member.id)}
              style={{
                position: 'absolute',
                left: pos.x - 30,
                top: pos.y - 30,
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: member.status === 'present' 
                  ? `linear-gradient(135deg, ${member.color}, ${member.color}88)`
                  : 'rgba(255,255,255,0.1)',
                border: `3px solid ${member.status === 'present' ? member.color : 'rgba(255,255,255,0.2)'}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: member.status === 'present' 
                  ? `0 0 20px ${member.color}44`
                  : 'none',
                opacity: member.status === 'present' ? 1 : 0.5
              }}
            >
              <span style={{ fontSize: 24 }}>{member.emoji}</span>
            </div>
          );
        })}
      </div>

      {/* Family Status */}
      <div style={{
        display: 'flex',
        gap: 16,
        marginBottom: 32
      }}>
        {familyStatus.map(member => (
          <div 
            key={member.id}
            style={{
              textAlign: 'center',
              opacity: member.status === 'present' ? 1 : 0.4
            }}
          >
            <div style={{ 
              color: member.color, 
              fontSize: 12, 
              fontWeight: 600 
            }}>
              {member.name}
            </div>
            <div style={{ 
              color: 'rgba(255,255,255,0.5)', 
              fontSize: 10 
            }}>
              {member.status === 'present' ? '● Here' : '○ Away'}
            </div>
          </div>
        ))}
      </div>

      {/* Breathing Circle */}
      <div style={{
        width: 200,
        height: 200,
        borderRadius: '50%',
        background: `radial-gradient(circle, 
          ${breathPhase === 'inhale' ? 'rgba(52,152,219,0.3)' : 
            breathPhase === 'hold' ? 'rgba(155,89,182,0.3)' : 
            'rgba(46,204,113,0.3)'} 0%, 
          transparent 70%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
        transition: 'all 1s ease',
        transform: breathPhase === 'inhale' ? 'scale(1.2)' : 
                   breathPhase === 'hold' ? 'scale(1.2)' : 'scale(0.9)',
        border: `2px solid ${
          breathPhase === 'inhale' ? '#3498db' : 
          breathPhase === 'hold' ? '#9b59b6' : '#2ecc71'
        }44`
      }}>
        <div style={{ 
          fontSize: 24, 
          color: '#fff', 
          textTransform: 'uppercase',
          letterSpacing: 4,
          fontWeight: 200
        }}>
          {breathPhase}
        </div>
        <div style={{ 
          fontSize: 14, 
          color: 'rgba(255,255,255,0.5)',
          marginTop: 8
        }}>
          {breathPhase === 'inhale' ? '4 seconds' : 
           breathPhase === 'hold' ? '4 seconds' : '8 seconds'}
        </div>
        <div style={{
          marginTop: 16,
          fontSize: 12,
          color: 'rgba(255,255,255,0.3)'
        }}>
          Breath #{breathCount + 1}
        </div>
      </div>

      {/* Affirmation */}
      <div style={{
        maxWidth: 500,
        textAlign: 'center',
        marginBottom: 32,
        padding: '20px 32px',
        background: 'rgba(255,215,0,0.05)',
        borderRadius: 16,
        border: '1px solid rgba(255,215,0,0.2)'
      }}>
        <p style={{
          color: '#FFD700',
          fontSize: 18,
          fontStyle: 'italic',
          margin: 0,
          lineHeight: 1.6
        }}>
          "{AFFIRMATIONS[affirmationIndex]}"
        </p>
      </div>

      {/* 5-4-3-2-1 Grounding */}
      <button
        onClick={() => setShowGrounding(!showGrounding)}
        style={{
          padding: '12px 24px',
          borderRadius: 24,
          border: '1px solid rgba(255,255,255,0.2)',
          background: showGrounding ? 'rgba(255,255,255,0.1)' : 'transparent',
          color: '#fff',
          fontSize: 14,
          cursor: 'pointer',
          marginBottom: 16
        }}
      >
        {showGrounding ? '✓ Grounding Active' : '🌍 5-4-3-2-1 Grounding'}
      </button>

      {showGrounding && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          justifyContent: 'center',
          maxWidth: 600
        }}>
          {GROUNDING_PROMPTS.map((prompt, i) => (
            <div
              key={i}
              style={{
                padding: '12px 20px',
                borderRadius: 12,
                background: `${prompt.color}22`,
                border: `1px solid ${prompt.color}44`,
                color: prompt.color,
                fontSize: 14
              }}
            >
              {prompt.label}
            </div>
          ))}
        </div>
      )}

      {/* Phenix Status */}
      <div style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        padding: '12px 20px',
        borderRadius: 12,
        background: phenixConnected ? 'rgba(46,204,113,0.1)' : 'rgba(231,76,60,0.1)',
        border: `1px solid ${phenixConnected ? '#2ecc71' : '#e74c3c'}44`,
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }}>
        <div style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: phenixConnected ? '#2ecc71' : '#e74c3c',
          animation: phenixConnected ? 'pulse 2s infinite' : 'none'
        }} />
        <span style={{ 
          color: phenixConnected ? '#2ecc71' : '#e74c3c',
          fontSize: 12,
          fontWeight: 600
        }}>
          🔥 Phenix {phenixConnected ? 'Connected' : 'Offline'}
        </span>
      </div>

      {/* Safe Zone Indicator */}
      <div style={{
        position: 'fixed',
        bottom: 24,
        left: 24,
        padding: '12px 20px',
        borderRadius: 12,
        background: 'rgba(52,152,219,0.1)',
        border: '1px solid rgba(52,152,219,0.3)',
        color: '#3498db',
        fontSize: 12,
        fontWeight: 600
      }}>
        🛡️ SAFE ZONE • No Notifications
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
