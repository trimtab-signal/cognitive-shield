/**
 * @license AGPLv3 - Wonky Sprout DUNA
 * 
 * FAMILY ONBOARDING - Make connection STUPID EASY
 */

import { useState } from 'react';
import { familyMesh } from '../../lib/family-mesh';
import QRCode from 'qrcode';

interface OnboardingProps {
  onComplete: () => void;
}

export function FamilyOnboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [role, setRole] = useState<'dad' | 'mom' | 'son' | 'daughter' | 'other'>('other');
  const [myId, setMyId] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string>('');

  const handleStart = async () => {
    if (!name.trim()) {
      alert('Please enter your name!');
      return;
    }

    const id = await familyMesh.initialize({
      name: name.trim(),
      role,
      voltage: 50,
      spoons: 5,
      heartbeat: 'NORMAL',
    });

    setMyId(id);

    // Generate QR code for easy sharing
    const shareData = JSON.stringify({
      type: 'phenix-family',
      id,
      name: name.trim(),
      role,
    });

    try {
      const qr = await QRCode.toDataURL(shareData, {
        width: 300,
        margin: 2,
        color: {
          dark: '#10B981',
          light: '#0F172A',
        },
      });
      setQrCode(qr);
    } catch (err) {
      console.error('QR generation failed:', err);
    }

    setStep(2);
  };

  const handleFinish = () => {
    localStorage.setItem('phenix-onboarding-complete', 'true');
    onComplete();
  };

  if (step === 1) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.95)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
          borderRadius: '24px',
          border: '2px solid #10B981',
          padding: '40px',
          maxWidth: '500px',
          width: '100%',
          boxShadow: '0 0 60px rgba(16, 185, 129, 0.3)',
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '32px',
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>💜</div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 700,
              color: '#10B981',
              margin: '0 0 12px 0',
            }}>
              Welcome to Family Shield
            </h1>
            <p style={{
              fontSize: '14px',
              color: '#94A3B8',
              margin: 0,
            }}>
              Let's connect your family, safely and sovereignly
            </p>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: '#CBD5E1',
                marginBottom: '8px',
              }}>
                What's your name?
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name..."
                autoFocus
                style={{
                  width: '100%',
                  padding: '14px',
                  background: '#0F172A',
                  border: '2px solid #334155',
                  borderRadius: '12px',
                  color: '#F3F4F6',
                  fontSize: '16px',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: '#CBD5E1',
                marginBottom: '12px',
              }}>
                Who are you in this family?
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
              }}>
                {[
                  { id: 'dad' as const, icon: '👨', label: 'Dad' },
                  { id: 'mom' as const, icon: '👩', label: 'Mom' },
                  { id: 'son' as const, icon: '👦', label: 'Son' },
                  { id: 'daughter' as const, icon: '👧', label: 'Daughter' },
                ].map(r => (
                  <button
                    key={r.id}
                    onClick={() => setRole(r.id)}
                    style={{
                      padding: '16px',
                      background: role === r.id ? '#10B98130' : '#1E293B',
                      border: `2px solid ${role === r.id ? '#10B981' : '#334155'}`,
                      borderRadius: '12px',
                      color: role === r.id ? '#10B981' : '#94A3B8',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span style={{ fontSize: '32px' }}>{r.icon}</span>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleStart}
              disabled={!name.trim()}
              style={{
                width: '100%',
                padding: '16px',
                background: name.trim()
                  ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                  : '#334155',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '16px',
                fontWeight: 700,
                cursor: name.trim() ? 'pointer' : 'not-allowed',
                marginTop: '12px',
              }}
            >
              Create My Family ID →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Share your ID
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.95)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
        borderRadius: '24px',
        border: '2px solid #10B981',
        padding: '40px',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 0 60px rgba(16, 185, 129, 0.3)',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 700,
          color: '#10B981',
          margin: '0 0 8px 0',
        }}>
          You're Connected!
        </h2>
        <p style={{
          fontSize: '14px',
          color: '#94A3B8',
          marginBottom: '32px',
        }}>
          Now share your ID with family members
        </p>

        {qrCode && (
          <div style={{
            marginBottom: '24px',
            padding: '20px',
            background: '#0F172A',
            borderRadius: '16px',
            border: '1px solid #334155',
          }}>
            <img 
              src={qrCode} 
              alt="QR Code"
              style={{
                width: '100%',
                maxWidth: '250px',
                height: 'auto',
                borderRadius: '8px',
              }}
            />
            <p style={{
              fontSize: '11px',
              color: '#64748B',
              marginTop: '12px',
              marginBottom: 0,
            }}>
              📱 Family members: Scan this with your phone camera
            </p>
          </div>
        )}

        <div
          onClick={() => {
            if (myId) {
              navigator.clipboard.writeText(myId);
              alert('ID copied! Send it to your family.');
            }
          }}
          style={{
            padding: '16px',
            background: '#334155',
            borderRadius: '12px',
            cursor: 'pointer',
            marginBottom: '24px',
            border: '2px solid #475569',
          }}
        >
          <div style={{
            fontSize: '11px',
            color: '#94A3B8',
            marginBottom: '4px',
          }}>
            YOUR FAMILY ID
          </div>
          <div style={{
            fontFamily: 'monospace',
            fontSize: '13px',
            color: '#10B981',
            fontWeight: 600,
            wordBreak: 'break-all',
          }}>
            {myId}
          </div>
          <div style={{
            fontSize: '10px',
            color: '#64748B',
            marginTop: '8px',
          }}>
            📋 Click to copy
          </div>
        </div>

        <button
          onClick={handleFinish}
          style={{
            width: '100%',
            padding: '16px',
            background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
            border: 'none',
            borderRadius: '12px',
            color: 'white',
            fontSize: '16px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Enter Family Shield →
        </button>

        <p style={{
          fontSize: '11px',
          color: '#64748B',
          marginTop: '16px',
          marginBottom: 0,
        }}>
          💡 Tip: Take a screenshot or write down your ID
        </p>
      </div>
    </div>
  );
}
