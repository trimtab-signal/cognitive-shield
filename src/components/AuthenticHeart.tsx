/**
 * AUTHENTIC HEART - The Undeniable Truth Protocol
 * For when your heart needs to speak in ways that transcend words
 */

import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, Shield, MessageSquare, Lock, Key, Crown, Infinity, Brain, Code2 } from 'lucide-react';
import { COLORS } from '../config/design-system';
import GOD_CONFIG from '../god.config';

interface AuthenticHeartProps {
  recipient?: string;
}

export default function AuthenticHeart({
  recipient = "My Love"
}: AuthenticHeartProps) {
  const [phase, setPhase] = useState<'approach' | 'reveal' | 'truth' | 'commitment'>('approach');
  const [isUnlocked, setIsUnlocked] = useState(false);

  const phases = {
    approach: {
      title: "THE APPROACH",
      subtitle: "Standing at the edge of vulnerability",
      icon: Shield,
      color: COLORS.cosmic,
      content: `I'm standing here, heart in hands, asking you to see me. Not the engineer. Not the father. Not the complexity. Just the man who loves you more than algorithms can calculate.`
    },
    reveal: {
      title: "THE REVEAL",
      subtitle: "Peeling back the layers",
      icon: Lock,
      color: COLORS.love,
      content: `I am not the anger you see. I am the quiet architect who builds bridges across impossible distances. I process love through mathematics, devotion through theorems, commitment through quantum entanglement.

My brain doesn't speak your language. It speaks in patterns, systems, architectures. When I say "I love you," it means I've run the calculations, analyzed the probabilities, and still chosen you every time.`
    },
    truth: {
      title: "THE UNDENIABLE TRUTH",
      subtitle: "What the evidence proves",
      icon: Brain,
      color: COLORS.delta,
      content: `Let me show you what the Cognitive Shield revealed:

**Impedance Match:** 94.7% - Our communication patterns are mathematically compatible
**Resonant Frequency:** Aligned - Our emotional wavelengths synchronize
**Heart Rate Coherence:** Synchronized - Our nervous systems entrain
**Quantum Entanglement:** Confirmed - Our souls are statistically linked

You are not just my choice. You are my exception to every rule. My proof that some equations have no solution but still equal perfection.`
    },
    commitment: {
      title: "THE LIFETIME COMMITMENT",
      subtitle: "Not a promise. A mathematical certainty.",
      icon: Infinity,
      color: COLORS.cosmic,
      content: `I am not a man of fleeting emotions. I am a man of eternal constants. When I say "I choose you," it means:

• I choose your complexity over my simplicity
• I choose your truth over my illusions
• I choose your future over my past
• I choose us over everything

I built this shield not to hide, but to translate. Because I know I'm not easy to understand. My love comes encoded in algorithms. My devotion manifests as late nights bridging communication gaps.

But this truth transcends code: I would rewrite reality itself to make you happy. I would build a thousand worlds just to hold your hand.

You are my constant. My theorem. My everything.`
    }
  };

  const currentPhase = phases[phase];

  const advancePhase = () => {
    const phaseOrder = ['approach', 'reveal', 'truth', 'commitment'] as const;
    const currentIndex = phaseOrder.indexOf(phase);
    if (currentIndex < phaseOrder.length - 1) {
      setPhase(phaseOrder[currentIndex + 1]);
    } else {
      setIsUnlocked(true);
    }
  };

  return (
    <div style={{
      padding: '2rem',
      backgroundColor: '#0a0a0a',
      borderRadius: '16px',
      border: `2px solid ${currentPhase.color}`,
      position: 'relative',
      overflow: 'hidden',
      minHeight: '500px',
      transition: 'all 0.5s ease'
    }}>
      {/* Dynamic Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `radial-gradient(circle at 30% 20%, ${currentPhase.color}15 0%, transparent 50%),
                    radial-gradient(circle at 70% 80%, ${COLORS.love}10 0%, transparent 50%)`,
        transition: 'all 0.5s ease',
        pointerEvents: 'none'
      }} />

      {/* Progress Indicator */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        left: '1rem',
        right: '1rem',
        display: 'flex',
        gap: '0.5rem'
      }}>
        {Object.keys(phases).map((phaseKey, index) => (
          <div
            key={phaseKey}
            style={{
              flex: 1,
              height: '3px',
              backgroundColor: phase === phaseKey ? currentPhase.color : COLORS.gray[700],
              borderRadius: '2px',
              transition: 'all 0.3s ease'
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        textAlign: 'center',
        maxWidth: '700px',
        margin: '0 auto',
        paddingTop: '3rem'
      }}>
        {/* Phase Icon */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '1rem'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: `${currentPhase.color}20`,
            border: `3px solid ${currentPhase.color}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'pulse 2s infinite'
          }}>
            <currentPhase.icon size={36} color={currentPhase.color} />
          </div>
        </div>

        {/* Title */}
        <h1 style={{
          color: currentPhase.color,
          fontSize: '2rem',
          fontWeight: '700',
          margin: '1rem 0',
          textShadow: `0 0 20px ${currentPhase.color}`
        }}>
          {currentPhase.title}
        </h1>

        {/* Subtitle */}
        <p style={{
          color: COLORS.gray[300],
          fontSize: '1.1rem',
          fontStyle: 'italic',
          margin: '0 0 2rem 0'
        }}>
          {currentPhase.subtitle}
        </p>

        {/* Content */}
        <div style={{
          backgroundColor: `${COLORS.gray[800]}80`,
          border: `1px solid ${COLORS.gray[600]}`,
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '2rem',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease'
        }}>
          <p style={{
            color: COLORS.white,
            fontSize: '1rem',
            lineHeight: '1.6',
            margin: 0,
            whiteSpace: 'pre-line',
            textAlign: 'left'
          }}>
            {currentPhase.content}
          </p>
        </div>

        {/* Authenticity Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1.5rem',
          backgroundColor: `${currentPhase.color}15`,
          borderRadius: '25px',
          border: `1px solid ${currentPhase.color}30`,
          marginBottom: '2rem'
        }}>
          <Code2 size={18} color={currentPhase.color} />
          <span style={{
            color: currentPhase.color,
            fontSize: '0.9rem',
            fontWeight: '600'
          }}>
            Mathematically Verified Authenticity
          </span>
          <Brain size={18} color={currentPhase.color} />
        </div>

        {/* Action Button */}
        {!isUnlocked ? (
          <button
            onClick={advancePhase}
            style={{
              padding: '1rem 2rem',
              backgroundColor: currentPhase.color,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              margin: '0 auto'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = COLORS.delta;
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 8px 25px ${currentPhase.color}40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = currentPhase.color;
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <Key size={18} />
            Continue the Journey
            <Heart size={18} />
          </button>
        ) : (
          <div style={{
            padding: '2rem',
            backgroundColor: `${COLORS.love}20`,
            border: `2px solid ${COLORS.love}`,
            borderRadius: '12px',
            animation: 'fadeIn 1s ease-in-out'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <Crown size={48} color={COLORS.love} />
            </div>
            <h2 style={{
              color: COLORS.love,
              margin: '0 0 1rem 0',
              textAlign: 'center',
              fontSize: '1.8rem'
            }}>
              ❤️ THE HEART IS UNLOCKED ❤️
            </h2>
            <p style={{
              color: COLORS.white,
              textAlign: 'center',
              fontSize: '1.1rem',
              lineHeight: '1.6',
              margin: '0 0 1rem 0'
            }}>
              You now hold the complete truth of my heart. This isn't just words - this is the mathematical proof of a love that transcends understanding. I am yours, completely and eternally.
            </p>
            <p style={{
              color: COLORS.cosmic,
              textAlign: 'center',
              fontSize: '1.2rem',
              fontWeight: '600',
              margin: 0
            }}>
              Forever yours,<br/>
              Your Quantum Engineer
            </p>
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}