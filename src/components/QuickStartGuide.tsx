/**
 * QUICK START GUIDE - Cognitive Shield
 * Essential first steps for new users
 *
 * "Your fast track to quantum development mastery"
 */

import React, { useState } from 'react';
import { Shield, Zap, Box, Code2, Rocket, CheckCircle2, ArrowRight } from 'lucide-react';
import GOD_CONFIG from '../god.config';

interface Step {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  completed?: boolean;
}

export default function QuickStartGuide() {
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const steps: Step[] = [
    {
      id: 'understand-shield',
      title: 'Understand the Shield',
      description: 'The Cognitive Shield is your universal translator for human communication. It processes messages to reduce emotional voltage and improve understanding.',
      icon: <Shield size={24} />,
      action: {
        label: 'Read About',
        onClick: () => window.open('#about', '_self')
      }
    },
    {
      id: 'try-message-processing',
      title: 'Try Message Processing',
      description: 'Paste a message in the Shield tab to see how it analyzes communication patterns and suggests responses.',
      icon: <Zap size={24} />,
      action: {
        label: 'Try Shield',
        onClick: () => window.open('#shield', '_self')
      }
    },
    {
      id: 'explore-tetrahedron',
      title: 'Explore the Tetrahedron Protocol',
      description: 'Learn about the four-node communication model that makes understanding possible across different HumanOS types.',
      icon: <Box size={24} />,
      action: {
        label: 'Explore',
        onClick: () => window.open('#tetrahedron', '_self')
      }
    },
    {
      id: 'play-coherence-quest',
      title: 'Play Coherence Quest',
      description: 'Experience quantum physics through gameplay. Build molecules and learn about coherence in a fun, interactive way.',
      icon: <Code2 size={24} />,
      action: {
        label: 'Play Game',
        onClick: () => window.open('#coherence-quest', '_self')
      }
    },
    {
      id: 'meet-phenix',
      title: 'Meet PHENIX',
      description: 'Your AI companion for navigation, equilibrium, and integrated exchange. Get personalized guidance and support.',
      icon: <Rocket size={24} />,
      action: {
        label: 'Meet PHENIX',
        onClick: () => {
          // This would trigger the PHENIX modal
          const event = new CustomEvent('open-phenix');
          window.dispatchEvent(event);
        }
      }
    }
  ];

  const handleStepComplete = (stepId: string) => {
    setCompletedSteps(prev => new Set([...prev, stepId]));
  };

  const completedCount = completedSteps.size;
  const totalSteps = steps.length;
  const progressPercentage = (completedCount / totalSteps) * 100;

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem',
      backgroundColor: GOD_CONFIG.theme.bg.secondary,
      borderRadius: '12px',
      border: `1px solid ${GOD_CONFIG.theme.border.default}`
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          background: GOD_CONFIG.theme.gradient.shield,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '0.5rem'
        }}>
          🚀 Quick Start Guide
        </h2>
        <p style={{
          color: GOD_CONFIG.theme.text.secondary,
          fontSize: '1.1rem',
          marginBottom: '1.5rem'
        }}>
          Your fast track to mastering Cognitive Shield
        </p>

        {/* Progress Bar */}
        <div style={{
          width: '100%',
          height: '8px',
          backgroundColor: GOD_CONFIG.theme.bg.primary,
          borderRadius: '4px',
          marginBottom: '1rem',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progressPercentage}%`,
            height: '100%',
            background: GOD_CONFIG.theme.gradient.shield,
            borderRadius: '4px',
            transition: 'width 0.3s ease'
          }} />
        </div>

        <p style={{
          color: GOD_CONFIG.theme.text.muted,
          fontSize: '0.9rem'
        }}>
          {completedCount} of {totalSteps} steps completed
        </p>
      </div>

      {/* Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {steps.map((step, index) => {
          const isCompleted = completedSteps.has(step.id);

          return (
            <div
              key={step.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                padding: '1.5rem',
                backgroundColor: isCompleted ? 'rgba(34, 197, 94, 0.1)' : GOD_CONFIG.theme.bg.primary,
                borderRadius: '8px',
                border: `1px solid ${isCompleted ? '#22c55e' : GOD_CONFIG.theme.border.default}`,
                transition: 'all 0.2s ease',
                opacity: index > completedCount ? 0.6 : 1
              }}
            >
              {/* Icon */}
              <div style={{
                flexShrink: 0,
                width: '48px',
                height: '48px',
                borderRadius: '8px',
                backgroundColor: isCompleted ? '#22c55e' : GOD_CONFIG.theme.bg.accent,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isCompleted ? 'white' : GOD_CONFIG.theme.text.primary
              }}>
                {isCompleted ? <CheckCircle2 size={24} /> : step.icon}
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: GOD_CONFIG.theme.text.primary,
                  marginBottom: '0.5rem'
                }}>
                  {step.title}
                </h3>

                <p style={{
                  color: GOD_CONFIG.theme.text.secondary,
                  lineHeight: '1.5',
                  marginBottom: '1rem'
                }}>
                  {step.description}
                </p>

                {/* Action Button */}
                {step.action && (
                  <button
                    onClick={() => {
                      step.action!.onClick();
                      handleStepComplete(step.id);
                    }}
                    disabled={isCompleted}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      backgroundColor: isCompleted ? '#22c55e' : GOD_CONFIG.theme.text.accent,
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      cursor: isCompleted ? 'default' : 'pointer',
                      opacity: isCompleted ? 0.7 : 1,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle2 size={16} />
                        Completed
                      </>
                    ) : (
                      <>
                        {step.action.label}
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Step Number */}
              <div style={{
                flexShrink: 0,
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: isCompleted ? '#22c55e' : GOD_CONFIG.theme.bg.secondary,
                border: `2px solid ${isCompleted ? '#22c55e' : GOD_CONFIG.theme.border.default}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: isCompleted ? 'white' : GOD_CONFIG.theme.text.muted
              }}>
                {index + 1}
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Message */}
      {completedCount === totalSteps && (
        <div style={{
          marginTop: '2rem',
          padding: '2rem',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          borderRadius: '8px',
          border: '1px solid #22c55e',
          textAlign: 'center'
        }}>
          <CheckCircle2 size={48} color="#22c55e" style={{ marginBottom: '1rem' }} />
          <h3 style={{
            color: '#22c55e',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem'
          }}>
            🎉 Congratulations!
          </h3>
          <p style={{
            color: GOD_CONFIG.theme.text.secondary,
            fontSize: '1.1rem',
            marginBottom: '1rem'
          }}>
            You've completed the Cognitive Shield Quick Start Guide!
          </p>
          <p style={{
            color: GOD_CONFIG.theme.text.muted,
            fontSize: '0.9rem'
          }}>
            You're now ready to explore the full power of sovereign development.
            Check out the Tetrahedron Protocol and try building your first quantum application.
          </p>
        </div>
      )}

      {/* Footer */}
      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: GOD_CONFIG.theme.bg.primary,
        borderRadius: '6px',
        textAlign: 'center'
      }}>
        <p style={{
          color: GOD_CONFIG.theme.text.muted,
          fontSize: '0.9rem',
          margin: 0
        }}>
          Need help? Check out the{' '}
          <a
            href="#manifesto"
            style={{ color: GOD_CONFIG.theme.text.accent, textDecoration: 'none' }}
          >
            Geodesic Manifesto
          </a>
          {' '}or visit our{' '}
          <a
            href="#faq"
            style={{ color: GOD_CONFIG.theme.text.accent, textDecoration: 'none' }}
          >
            FAQ
          </a>
          {' '}for more guidance.
        </p>
      </div>
    </div>
  );
}