/**
 * FAMILY CONSTELLATION
 * 
 * An interactive night sky where each family member is a star.
 * Kids can draw connections, add wishes, and build their own constellation.
 * 
 * The Tetrahedron Protocol, disguised as play.
 * 
 * "Even when we're apart, we're still connected in the same sky."
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import GOD_CONFIG from '../god.config';

// ============================================================================
// TYPES
// ============================================================================

interface FamilyStar {
  id: string;
  name: string;
  emoji: string;
  x: number;
  y: number;
  size: number;
  color: string;
  wish?: string;
  isCustom?: boolean;
}

interface Connection {
  from: string;
  to: string;
}

interface ShootingStar {
  id: number;
  x: number;
  y: number;
  angle: number;
  speed: number;
  opacity: number;
}

// ============================================================================
// DEFAULT FAMILY
// ============================================================================

const DEFAULT_FAMILY: FamilyStar[] = [
  { id: 'dad', name: 'Dad', emoji: '👨', x: 30, y: 30, size: 24, color: '#4ecdc4' },
  { id: 'mom', name: 'Mom', emoji: '👩', x: 70, y: 30, size: 24, color: '#ff6b9d' },
  { id: 'kid1', name: 'Child 1', emoji: '⭐', x: 40, y: 60, size: 20, color: '#f4d35e' },
  { id: 'kid2', name: 'Child 2', emoji: '⭐', x: 60, y: 60, size: 20, color: '#f4d35e' },
];

// ============================================================================
// STYLES
// ============================================================================

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #0a0a1a 0%, #1a1a3a 50%, #0a0a1a 100%)',
    position: 'relative' as const,
    overflow: 'hidden',
    fontFamily: GOD_CONFIG.typography.body,
  },
  starsBackground: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(1px 1px at 10% 10%, white, transparent),
      radial-gradient(1px 1px at 20% 40%, white, transparent),
      radial-gradient(1px 1px at 30% 20%, rgba(255,255,255,0.8), transparent),
      radial-gradient(1px 1px at 40% 70%, white, transparent),
      radial-gradient(1px 1px at 50% 30%, rgba(255,255,255,0.6), transparent),
      radial-gradient(1px 1px at 60% 80%, white, transparent),
      radial-gradient(1px 1px at 70% 50%, rgba(255,255,255,0.7), transparent),
      radial-gradient(1px 1px at 80% 20%, white, transparent),
      radial-gradient(1px 1px at 90% 60%, rgba(255,255,255,0.9), transparent),
      radial-gradient(1px 1px at 15% 85%, white, transparent),
      radial-gradient(1px 1px at 25% 55%, rgba(255,255,255,0.5), transparent),
      radial-gradient(1px 1px at 35% 95%, white, transparent),
      radial-gradient(1px 1px at 45% 15%, rgba(255,255,255,0.8), transparent),
      radial-gradient(1px 1px at 55% 45%, white, transparent),
      radial-gradient(1px 1px at 65% 75%, rgba(255,255,255,0.6), transparent),
      radial-gradient(1px 1px at 75% 35%, white, transparent),
      radial-gradient(1px 1px at 85% 65%, rgba(255,255,255,0.7), transparent),
      radial-gradient(1px 1px at 95% 25%, white, transparent),
      radial-gradient(2px 2px at 5% 50%, rgba(255,255,200,0.8), transparent),
      radial-gradient(2px 2px at 95% 90%, rgba(200,220,255,0.8), transparent)
    `,
    animation: 'twinkle 4s ease-in-out infinite alternate',
  },
  header: {
    position: 'relative' as const,
    zIndex: 10,
    textAlign: 'center' as const,
    padding: '2rem',
  },
  title: {
    fontFamily: GOD_CONFIG.typography.heading,
    fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
    background: 'linear-gradient(135deg, #f4d35e 0%, #fff 50%, #f4d35e 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '1rem',
  },
  canvas: {
    position: 'relative' as const,
    width: '100%',
    height: '60vh',
    minHeight: '400px',
    touchAction: 'none',
  },
  star: {
    position: 'absolute' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
    userSelect: 'none' as const,
  },
  starEmoji: {
    fontSize: '2rem',
    filter: 'drop-shadow(0 0 10px currentColor)',
    animation: 'pulse 2s ease-in-out infinite',
  },
  starName: {
    marginTop: '4px',
    fontSize: '0.85rem',
    color: 'white',
    textShadow: '0 0 10px rgba(0,0,0,0.8)',
    fontWeight: 500,
  },
  controls: {
    position: 'relative' as const,
    zIndex: 10,
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
    alignItems: 'center',
  },
  buttonRow: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '0.75rem',
    justifyContent: 'center',
  },
  button: {
    padding: '12px 24px',
    borderRadius: '25px',
    border: 'none',
    fontFamily: GOD_CONFIG.typography.body,
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  primaryButton: {
    background: 'linear-gradient(135deg, #f4d35e 0%, #c9b037 100%)',
    color: '#1a1a2e',
    fontWeight: 600,
  },
  secondaryButton: {
    background: 'rgba(255,255,255,0.1)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  connectingLine: {
    position: 'absolute' as const,
    pointerEvents: 'none' as const,
    zIndex: 1,
  },
  wishInput: {
    background: 'rgba(0,0,0,0.5)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '15px',
    padding: '1rem',
    color: 'white',
    fontFamily: GOD_CONFIG.typography.body,
    fontSize: '1rem',
    width: '100%',
    maxWidth: '300px',
    textAlign: 'center' as const,
  },
  modal: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    padding: '1rem',
  },
  modalContent: {
    background: 'linear-gradient(135deg, #1a1a3a 0%, #2a2a4a 100%)',
    borderRadius: '20px',
    padding: '2rem',
    maxWidth: '400px',
    width: '100%',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  modalTitle: {
    fontFamily: GOD_CONFIG.typography.heading,
    fontSize: '1.5rem',
    color: '#f4d35e',
    marginBottom: '1rem',
    textAlign: 'center' as const,
  },
  shootingStar: {
    position: 'absolute' as const,
    width: '100px',
    height: '2px',
    background: 'linear-gradient(90deg, white, transparent)',
    borderRadius: '2px',
    pointerEvents: 'none' as const,
  },
  wishDisplay: {
    marginTop: '4px',
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.7)',
    fontStyle: 'italic',
    maxWidth: '100px',
    textAlign: 'center' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  message: {
    background: 'rgba(244,211,94,0.1)',
    border: '1px solid rgba(244,211,94,0.3)',
    borderRadius: '15px',
    padding: '1rem 1.5rem',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center' as const,
    maxWidth: '500px',
    lineHeight: 1.6,
  },
  instructions: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '0.9rem',
    textAlign: 'center' as const,
    maxWidth: '400px',
  },
};

const cssAnimations = `
  @keyframes twinkle {
    0% { opacity: 0.7; }
    100% { opacity: 1; }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
  
  @keyframes shoot {
    0% { transform: translateX(0) translateY(0); opacity: 1; }
    100% { transform: translateX(200px) translateY(100px); opacity: 0; }
  }
`;

// ============================================================================
// COMPONENT
// ============================================================================

export const FamilyConstellation: React.FC = () => {
  const [family, setFamily] = useState<FamilyStar[]>(DEFAULT_FAMILY);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedStar, setSelectedStar] = useState<string | null>(null);
  const [connectMode, setConnectMode] = useState(false);
  const [showWishModal, setShowWishModal] = useState(false);
  const [wishTarget, setWishTarget] = useState<string | null>(null);
  const [wishText, setWishText] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStarName, setNewStarName] = useState('');
  const [newStarEmoji, setNewStarEmoji] = useState('⭐');
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);
  const [constellationName, setConstellationName] = useState('Our Family');
  const canvasRef = useRef<HTMLDivElement>(null);

  // Shooting stars effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newStar: ShootingStar = {
          id: Date.now(),
          x: Math.random() * 80,
          y: Math.random() * 40,
          angle: 30 + Math.random() * 30,
          speed: 2 + Math.random() * 2,
          opacity: 1,
        };
        setShootingStars(prev => [...prev, newStar]);
        
        // Remove after animation
        setTimeout(() => {
          setShootingStars(prev => prev.filter(s => s.id !== newStar.id));
        }, 1000);
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  // Load saved constellation
  useEffect(() => {
    const saved = localStorage.getItem('familyConstellation');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.family) setFamily(data.family);
        if (data.connections) setConnections(data.connections);
        if (data.name) setConstellationName(data.name);
      } catch (e) {
        console.error('Failed to load constellation:', e);
      }
    }
  }, []);

  // Save constellation
  const saveConstellation = useCallback(() => {
    localStorage.setItem('familyConstellation', JSON.stringify({
      family,
      connections,
      name: constellationName,
      savedAt: new Date().toISOString(),
    }));
  }, [family, connections, constellationName]);

  useEffect(() => {
    saveConstellation();
  }, [family, connections, constellationName, saveConstellation]);

  // Handle star click
  const handleStarClick = (starId: string) => {
    if (connectMode) {
      if (selectedStar && selectedStar !== starId) {
        // Check if connection already exists
        const exists = connections.some(
          c => (c.from === selectedStar && c.to === starId) ||
               (c.from === starId && c.to === selectedStar)
        );
        
        if (!exists) {
          setConnections(prev => [...prev, { from: selectedStar, to: starId }]);
        }
        setSelectedStar(null);
      } else {
        setSelectedStar(starId);
      }
    } else {
      // Open wish modal
      setWishTarget(starId);
      const star = family.find(s => s.id === starId);
      setWishText(star?.wish || '');
      setShowWishModal(true);
    }
  };

  // Add wish to star
  const addWish = () => {
    if (wishTarget) {
      setFamily(prev => prev.map(star => 
        star.id === wishTarget ? { ...star, wish: wishText } : star
      ));
      setShowWishModal(false);
      setWishTarget(null);
      setWishText('');
    }
  };

  // Add new star
  const addStar = () => {
    if (newStarName.trim()) {
      const newStar: FamilyStar = {
        id: `custom-${Date.now()}`,
        name: newStarName.trim(),
        emoji: newStarEmoji || '⭐',
        x: 20 + Math.random() * 60,
        y: 20 + Math.random() * 60,
        size: 18,
        color: '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'),
        isCustom: true,
      };
      setFamily(prev => [...prev, newStar]);
      setShowAddModal(false);
      setNewStarName('');
      setNewStarEmoji('⭐');
    }
  };

  // Remove connection
  const removeLastConnection = () => {
    setConnections(prev => prev.slice(0, -1));
  };

  // Clear all connections
  const clearConnections = () => {
    setConnections([]);
  };

  // Get star position
  const getStarPosition = (starId: string) => {
    const star = family.find(s => s.id === starId);
    if (!star) return null;
    return { x: star.x, y: star.y };
  };

  // Render connection lines
  const renderConnections = () => {
    return connections.map((conn, index) => {
      const from = getStarPosition(conn.from);
      const to = getStarPosition(conn.to);
      if (!from || !to) return null;

      const fromStar = family.find(s => s.id === conn.from);
      const toStar = family.find(s => s.id === conn.to);
      
      // Calculate gradient color
      const gradientId = `gradient-${index}`;
      
      return (
        <svg
          key={`${conn.from}-${conn.to}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={fromStar?.color || 'white'} stopOpacity="0.8" />
              <stop offset="100%" stopColor={toStar?.color || 'white'} stopOpacity="0.8" />
            </linearGradient>
          </defs>
          <line
            x1={`${from.x}%`}
            y1={`${from.y}%`}
            x2={`${to.x}%`}
            y2={`${to.y}%`}
            stroke={`url(#${gradientId})`}
            strokeWidth="2"
            strokeLinecap="round"
            style={{
              filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.5))',
            }}
          />
        </svg>
      );
    });
  };

  // Count total wishes
  const wishCount = family.filter(s => s.wish).length;
  
  // Is constellation complete (all stars connected)?
  const isComplete = family.length >= 2 && connections.length >= family.length - 1;

  return (
    <>
      <style>{cssAnimations}</style>
      <div style={styles.container}>
        <div style={styles.starsBackground} />
        
        {/* Shooting Stars */}
        {shootingStars.map(star => (
          <div
            key={star.id}
            style={{
              ...styles.shootingStar,
              left: `${star.x}%`,
              top: `${star.y}%`,
              transform: `rotate(${star.angle}deg)`,
              animation: 'shoot 1s linear forwards',
            }}
          />
        ))}
        
        {/* Header */}
        <header style={styles.header}>
          <h1 style={styles.title}>✨ {constellationName} ✨</h1>
          <p style={styles.subtitle}>
            {isComplete 
              ? "Your constellation is complete! You're all connected."
              : "Tap stars to add wishes • Connect mode to draw lines"}
          </p>
        </header>
        
        {/* Canvas */}
        <div ref={canvasRef} style={styles.canvas}>
          {renderConnections()}
          
          {family.map(star => (
            <div
              key={star.id}
              onClick={() => handleStarClick(star.id)}
              style={{
                ...styles.star,
                left: `${star.x}%`,
                top: `${star.y}%`,
                transform: `translate(-50%, -50%) ${selectedStar === star.id ? 'scale(1.3)' : 'scale(1)'}`,
                zIndex: selectedStar === star.id ? 10 : 2,
              }}
            >
              <span 
                style={{
                  ...styles.starEmoji,
                  fontSize: `${star.size}px`,
                  color: star.color,
                }}
              >
                {star.emoji}
              </span>
              <span style={styles.starName}>{star.name}</span>
              {star.wish && (
                <span style={styles.wishDisplay}>"{star.wish}"</span>
              )}
            </div>
          ))}
        </div>
        
        {/* Controls */}
        <div style={styles.controls}>
          <div style={styles.buttonRow}>
            <button
              onClick={() => {
                setConnectMode(!connectMode);
                setSelectedStar(null);
              }}
              style={{
                ...styles.button,
                ...(connectMode ? styles.primaryButton : styles.secondaryButton),
              }}
            >
              {connectMode ? '🔗 Connecting...' : '🔗 Connect Stars'}
            </button>
            
            <button
              onClick={() => setShowAddModal(true)}
              style={{ ...styles.button, ...styles.secondaryButton }}
            >
              ➕ Add Star
            </button>
            
            {connections.length > 0 && (
              <button
                onClick={removeLastConnection}
                style={{ ...styles.button, ...styles.secondaryButton }}
              >
                ↩️ Undo
              </button>
            )}
          </div>
          
          <p style={styles.instructions}>
            {connectMode 
              ? "Tap two stars to connect them with a line"
              : "Tap a star to add a wish or message"}
          </p>
          
          {isComplete && (
            <div style={styles.message}>
              🌟 <strong>Your constellation is complete!</strong><br />
              No matter how far apart the stars are,<br />
              they're always connected in the same sky.
            </div>
          )}
          
          {wishCount > 0 && (
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
              ✨ {wishCount} wish{wishCount !== 1 ? 'es' : ''} in the stars
            </p>
          )}
        </div>
        
        {/* Wish Modal */}
        {showWishModal && (
          <div style={styles.modal} onClick={() => setShowWishModal(false)}>
            <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
              <h3 style={styles.modalTitle}>
                Make a Wish ✨
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1rem', textAlign: 'center' }}>
                Add a wish or message to {family.find(s => s.id === wishTarget)?.name}'s star
              </p>
              <input
                type="text"
                value={wishText}
                onChange={e => setWishText(e.target.value)}
                placeholder="I wish..."
                style={styles.wishInput}
                autoFocus
                maxLength={50}
              />
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'center' }}>
                <button
                  onClick={addWish}
                  style={{ ...styles.button, ...styles.primaryButton }}
                >
                  ✨ Add Wish
                </button>
                <button
                  onClick={() => setShowWishModal(false)}
                  style={{ ...styles.button, ...styles.secondaryButton }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Add Star Modal */}
        {showAddModal && (
          <div style={styles.modal} onClick={() => setShowAddModal(false)}>
            <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
              <h3 style={styles.modalTitle}>
                Add a Star ⭐
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1rem', textAlign: 'center' }}>
                Add someone new to your constellation
              </p>
              <input
                type="text"
                value={newStarName}
                onChange={e => setNewStarName(e.target.value)}
                placeholder="Name"
                style={{ ...styles.wishInput, marginBottom: '1rem' }}
                autoFocus
                maxLength={20}
              />
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {['⭐', '🌟', '💫', '✨', '🌙', '☀️', '💜', '💙', '💚', '🐱', '🐶', '🦋', '🌸', '🎮', '⚽'].map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => setNewStarEmoji(emoji)}
                    style={{
                      padding: '8px',
                      fontSize: '1.5rem',
                      background: newStarEmoji === emoji ? 'rgba(244,211,94,0.3)' : 'rgba(255,255,255,0.1)',
                      border: newStarEmoji === emoji ? '2px solid #f4d35e' : '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '10px',
                      cursor: 'pointer',
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', justifyContent: 'center' }}>
                <button
                  onClick={addStar}
                  style={{ ...styles.button, ...styles.primaryButton }}
                  disabled={!newStarName.trim()}
                >
                  ⭐ Add Star
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  style={{ ...styles.button, ...styles.secondaryButton }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FamilyConstellation;

