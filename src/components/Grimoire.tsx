/**
 * The Grimoire
 * 
 * "Any sufficiently advanced technology is indistinguishable from magic."
 * — Arthur C. Clarke
 * 
 * This is the same Cognitive Shield, the same Tetrahedron Protocol,
 * the same physics—translated into the language of the Craft.
 * 
 * For those who receive on a different frequency.
 */

import React, { useState, useEffect } from 'react';
import GOD_CONFIG from '../god.config';
import { 
  getMoonPhase, 
  getElementalVertex, 
  getTarotGuidance, 
  getAuspiciousTiming,
  type MoonPhaseData 
} from '../lib/moon-phase';

// ============================================================================
// STYLES
// ============================================================================

const styles = {
  container: {
    minHeight: '100vh',
    background: `linear-gradient(180deg, #0a0a12 0%, #1a1a2e 50%, #0a0a12 100%)`,
    color: '#e8e6e3',
    fontFamily: GOD_CONFIG.typography.body,
    padding: '2rem',
    position: 'relative' as const,
    overflow: 'hidden',
  },
  stars: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `radial-gradient(2px 2px at 20px 30px, #eee, transparent),
                 radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
                 radial-gradient(1px 1px at 90px 40px, #fff, transparent),
                 radial-gradient(2px 2px at 160px 120px, rgba(255,255,255,0.9), transparent),
                 radial-gradient(1px 1px at 230px 80px, #eee, transparent),
                 radial-gradient(2px 2px at 300px 150px, #fff, transparent),
                 radial-gradient(1px 1px at 350px 50px, rgba(255,255,255,0.7), transparent),
                 radial-gradient(2px 2px at 420px 180px, #eee, transparent),
                 radial-gradient(1px 1px at 500px 90px, #fff, transparent),
                 radial-gradient(2px 2px at 580px 200px, rgba(255,255,255,0.8), transparent)`,
    backgroundRepeat: 'repeat',
    backgroundSize: '600px 250px',
    opacity: 0.6,
    pointerEvents: 'none' as const,
    animation: 'twinkle 4s ease-in-out infinite',
  },
  content: {
    position: 'relative' as const,
    zIndex: 1,
    maxWidth: '900px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '3rem',
  },
  title: {
    fontFamily: GOD_CONFIG.typography.heading,
    fontSize: '3rem',
    background: 'linear-gradient(135deg, #c9b037 0%, #f4d35e 50%, #c9b037 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '0.5rem',
    letterSpacing: '0.2em',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.6)',
    fontStyle: 'italic',
    fontSize: '1.1rem',
  },
  moonSection: {
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.1)',
    padding: '2rem',
    marginBottom: '2rem',
    textAlign: 'center' as const,
  },
  moonEmoji: {
    fontSize: '6rem',
    display: 'block',
    marginBottom: '1rem',
    filter: 'drop-shadow(0 0 20px rgba(255,255,200,0.5))',
    animation: 'float 6s ease-in-out infinite',
  },
  moonName: {
    fontFamily: GOD_CONFIG.typography.heading,
    fontSize: '1.8rem',
    color: '#f4d35e',
    marginBottom: '0.5rem',
  },
  moonDetails: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem',
    marginTop: '1.5rem',
    textAlign: 'left' as const,
  },
  moonDetail: {
    background: 'rgba(0,0,0,0.3)',
    padding: '1rem',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  moonLabel: {
    fontSize: '0.75rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: '0.25rem',
  },
  moonValue: {
    fontSize: '1.1rem',
    color: '#e8e6e3',
  },
  guidance: {
    background: 'rgba(244,211,94,0.1)',
    borderLeft: '3px solid #f4d35e',
    padding: '1rem 1.5rem',
    marginTop: '1.5rem',
    borderRadius: '0 10px 10px 0',
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.9)',
  },
  section: {
    marginBottom: '2rem',
  },
  sectionTitle: {
    fontFamily: GOD_CONFIG.typography.heading,
    fontSize: '1.5rem',
    color: '#c9b037',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  tetrahedronContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
  },
  tetrahedronSvg: {
    maxWidth: '400px',
    width: '100%',
  },
  elementGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem',
    marginTop: '1rem',
  },
  elementCard: {
    background: 'rgba(0,0,0,0.3)',
    padding: '1.5rem',
    borderRadius: '15px',
    border: '1px solid rgba(255,255,255,0.1)',
    textAlign: 'center' as const,
    transition: 'all 0.3s ease',
  },
  elementSymbol: {
    fontSize: '2.5rem',
    marginBottom: '0.5rem',
    display: 'block',
  },
  elementName: {
    fontFamily: GOD_CONFIG.typography.heading,
    fontSize: '1.2rem',
    marginBottom: '0.25rem',
  },
  elementDirection: {
    fontSize: '0.85rem',
    color: 'rgba(255,255,255,0.5)',
  },
  tarotCard: {
    background: 'linear-gradient(135deg, rgba(30,30,50,0.9) 0%, rgba(20,20,35,0.95) 100%)',
    borderRadius: '20px',
    border: '2px solid rgba(201,176,55,0.3)',
    padding: '2rem',
    textAlign: 'center' as const,
    position: 'relative' as const,
    overflow: 'hidden',
  },
  tarotGlow: {
    position: 'absolute' as const,
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle, rgba(201,176,55,0.1) 0%, transparent 50%)',
    pointerEvents: 'none' as const,
  },
  tarotTitle: {
    fontFamily: GOD_CONFIG.typography.heading,
    fontSize: '2rem',
    color: '#f4d35e',
    marginBottom: '1rem',
    position: 'relative' as const,
  },
  tarotMeaning: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: '1.1rem',
    marginBottom: '1.5rem',
    lineHeight: 1.6,
    position: 'relative' as const,
  },
  tarotAdvice: {
    background: 'rgba(0,0,0,0.4)',
    padding: '1.5rem',
    borderRadius: '10px',
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.9)',
    position: 'relative' as const,
  },
  ancestorSection: {
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.08)',
    padding: '2rem',
  },
  ancestorGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginTop: '1rem',
  },
  ancestorCard: {
    background: 'rgba(0,0,0,0.3)',
    padding: '1.5rem',
    borderRadius: '15px',
    border: '1px solid rgba(201,176,55,0.2)',
  },
  ancestorName: {
    fontFamily: GOD_CONFIG.typography.heading,
    fontSize: '1.3rem',
    color: '#f4d35e',
    marginBottom: '0.5rem',
  },
  ancestorRole: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '0.9rem',
    marginBottom: '0.75rem',
  },
  ancestorQuote: {
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.8)',
    borderLeft: '2px solid rgba(201,176,55,0.5)',
    paddingLeft: '1rem',
  },
  spellSection: {
    background: 'linear-gradient(135deg, rgba(40,20,60,0.5) 0%, rgba(20,10,40,0.5) 100%)',
    borderRadius: '20px',
    border: '1px solid rgba(150,100,200,0.2)',
    padding: '2rem',
  },
  spellCard: {
    background: 'rgba(0,0,0,0.3)',
    padding: '1.5rem',
    borderRadius: '15px',
    marginBottom: '1rem',
    border: '1px solid rgba(150,100,200,0.1)',
  },
  spellName: {
    fontFamily: GOD_CONFIG.typography.heading,
    fontSize: '1.2rem',
    color: '#b794f6',
    marginBottom: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  spellDescription: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '0.95rem',
    lineHeight: 1.6,
  },
  incantation: {
    fontFamily: 'Georgia, serif',
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.9)',
    background: 'rgba(0,0,0,0.4)',
    padding: '1.5rem',
    borderRadius: '10px',
    textAlign: 'center' as const,
    lineHeight: 2,
    marginTop: '1rem',
    border: '1px solid rgba(150,100,200,0.2)',
  },
  timingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginTop: '1rem',
  },
  timingCard: {
    background: 'rgba(0,0,0,0.3)',
    padding: '1rem',
    borderRadius: '10px',
    textAlign: 'center' as const,
    border: '1px solid rgba(255,255,255,0.05)',
  },
  timingLabel: {
    fontSize: '0.75rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: '0.5rem',
  },
  timingValue: {
    fontFamily: GOD_CONFIG.typography.heading,
    fontSize: '1rem',
    color: '#f4d35e',
  },
  divider: {
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(201,176,55,0.3), transparent)',
    margin: '2rem 0',
  },
  footer: {
    textAlign: 'center' as const,
    marginTop: '3rem',
    padding: '2rem',
    color: 'rgba(255,255,255,0.4)',
    fontStyle: 'italic',
  },
};

// Add CSS animations
const cssAnimations = `
  @keyframes twinkle {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 0.8; }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 0.8; }
    50% { opacity: 1; }
  }
`;

// ============================================================================
// COMPONENT
// ============================================================================

export const Grimoire: React.FC = () => {
  const [moon, setMoon] = useState<MoonPhaseData>(getMoonPhase());
  const [timing, setTiming] = useState(getAuspiciousTiming());
  const [systemState] = useState<'crisis' | 'transition' | 'stable' | 'growth'>('transition');
  
  useEffect(() => {
    // Update moon phase every minute
    const interval = setInterval(() => {
      setMoon(getMoonPhase());
      setTiming(getAuspiciousTiming());
    }, 60000);
    return () => clearInterval(interval);
  }, []);
  
  const tarot = getTarotGuidance(systemState);
  const elements = {
    you: getElementalVertex('you'),
    them: getElementalVertex('them'),
    context: getElementalVertex('context'),
    protocol: getElementalVertex('protocol'),
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric' 
    });
  };

  return (
    <>
      <style>{cssAnimations}</style>
      <div style={styles.container}>
        <div style={styles.stars} />
        
        <div style={styles.content}>
          {/* Header */}
          <header style={styles.header}>
            <h1 style={styles.title}>THE GRIMOIRE</h1>
            <p style={styles.subtitle}>
              Where technology becomes indistinguishable from magic
            </p>
          </header>
          
          {/* Moon Phase */}
          <section style={styles.moonSection}>
            <span style={styles.moonEmoji}>{moon.emoji}</span>
            <h2 style={styles.moonName}>{moon.phaseName}</h2>
            
            <div style={styles.moonDetails}>
              <div style={styles.moonDetail}>
                <div style={styles.moonLabel}>Illumination</div>
                <div style={styles.moonValue}>{moon.illumination}%</div>
              </div>
              <div style={styles.moonDetail}>
                <div style={styles.moonLabel}>Element</div>
                <div style={{ ...styles.moonValue, textTransform: 'capitalize' }}>
                  {moon.element}
                </div>
              </div>
              <div style={styles.moonDetail}>
                <div style={styles.moonLabel}>Energy</div>
                <div style={styles.moonValue}>{moon.energy}</div>
              </div>
              <div style={styles.moonDetail}>
                <div style={styles.moonLabel}>Days to Full</div>
                <div style={styles.moonValue}>{moon.daysUntilFull}</div>
              </div>
            </div>
            
            <div style={styles.guidance}>
              {moon.guidance}
            </div>
          </section>
          
          <div style={styles.divider} />
          
          {/* The Sacred Geometry */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>
              <span>◇</span> The Sacred Tetrahedron
            </h2>
            
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
              The tetrahedron is the first Platonic solid—the minimum structure that encloses space.
              It is the shape of stability, of fire, of the first spark of creation.
              Four vertices, four faces, six edges. Each vertex represents an element of connection.
            </p>
            
            <div style={styles.tetrahedronContainer}>
              <svg style={styles.tetrahedronSvg} viewBox="0 0 200 200">
                {/* Edges */}
                <line x1="100" y1="30" x2="40" y2="150" stroke="rgba(201,176,55,0.5)" strokeWidth="1" />
                <line x1="100" y1="30" x2="160" y2="150" stroke="rgba(201,176,55,0.5)" strokeWidth="1" />
                <line x1="100" y1="30" x2="100" y2="120" stroke="rgba(201,176,55,0.5)" strokeWidth="1" />
                <line x1="40" y1="150" x2="160" y2="150" stroke="rgba(201,176,55,0.5)" strokeWidth="1" />
                <line x1="40" y1="150" x2="100" y2="120" stroke="rgba(201,176,55,0.3)" strokeWidth="1" strokeDasharray="4,4" />
                <line x1="160" y1="150" x2="100" y2="120" stroke="rgba(201,176,55,0.3)" strokeWidth="1" strokeDasharray="4,4" />
                
                {/* Vertices */}
                <circle cx="100" cy="30" r="12" fill={elements.protocol.color} opacity="0.9" />
                <circle cx="40" cy="150" r="12" fill={elements.you.color} opacity="0.9" />
                <circle cx="160" cy="150" r="12" fill={elements.them.color} opacity="0.9" />
                <circle cx="100" cy="120" r="12" fill={elements.context.color} opacity="0.9" />
                
                {/* Labels */}
                <text x="100" y="12" textAnchor="middle" fill="#e8e6e3" fontSize="10">Air / Spirit</text>
                <text x="25" y="175" textAnchor="middle" fill="#e8e6e3" fontSize="10">Fire / Self</text>
                <text x="175" y="175" textAnchor="middle" fill="#e8e6e3" fontSize="10">Water / Other</text>
                <text x="100" y="145" textAnchor="middle" fill="#e8e6e3" fontSize="10">Earth / Ground</text>
              </svg>
            </div>
            
            <div style={styles.elementGrid}>
              {Object.entries(elements).map(([key, elem]) => (
                <div 
                  key={key} 
                  style={{
                    ...styles.elementCard,
                    borderColor: elem.color + '40',
                  }}
                >
                  <span style={{ ...styles.elementSymbol, color: elem.color }}>
                    {elem.symbol}
                  </span>
                  <div style={{ ...styles.elementName, color: elem.color }}>
                    {elem.element}
                  </div>
                  <div style={styles.elementDirection}>
                    {elem.direction} • {key.charAt(0).toUpperCase() + key.slice(1)}
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          <div style={styles.divider} />
          
          {/* Tarot Guidance */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>
              <span>✧</span> Current Arcana
            </h2>
            
            <div style={styles.tarotCard}>
              <div style={styles.tarotGlow} />
              <h3 style={styles.tarotTitle}>{tarot.card}</h3>
              <p style={styles.tarotMeaning}>{tarot.meaning}</p>
              <div style={styles.tarotAdvice}>{tarot.advice}</div>
            </div>
          </section>
          
          <div style={styles.divider} />
          
          {/* The Ancestors */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>
              <span>⚘</span> The Mighty Dead
            </h2>
            
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
              Those who came before, whose hands built sanctuaries, whose love took the form of
              objects that outlast breath. We call upon their wisdom.
            </p>
            
            <div style={styles.ancestorSection}>
              <div style={styles.ancestorGrid}>
                <div style={styles.ancestorCard}>
                  <h4 style={styles.ancestorName}>Robert</h4>
                  <div style={styles.ancestorRole}>The Builder • The Woodworker</div>
                  <p style={styles.ancestorQuote}>
                    "He showed his love by building things that would last longer than he would."
                  </p>
                </div>
                <div style={styles.ancestorCard}>
                  <h4 style={styles.ancestorName}>Marjorie</h4>
                  <div style={styles.ancestorRole}>The Keeper • The Heart</div>
                  <p style={styles.ancestorQuote}>
                    "She held the space where all the building happened. The foundation beneath the workshop."
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          <div style={styles.divider} />
          
          {/* Workings / Spells */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>
              <span>☽</span> Workings
            </h2>
            
            <div style={styles.spellSection}>
              <div style={styles.spellCard}>
                <h4 style={styles.spellName}>
                  <span>🛡️</span> The Shield of Translation
                </h4>
                <p style={styles.spellDescription}>
                  A ward that stands between raw emotion and spoken word. It catches the voltage—
                  the fear, the frustration, the static—and transmutes it into clarity.
                  What passes through carries only intention, not intensity.
                </p>
                <div style={styles.incantation}>
                  "Let my noise fall away.<br />
                  Let only care pass through.<br />
                  What I mean is what you receive."
                </div>
              </div>
              
              <div style={styles.spellCard}>
                <h4 style={styles.spellName}>
                  <span>🔗</span> The Unbroken Thread
                </h4>
                <p style={styles.spellDescription}>
                  A binding that ensures connection survives distance, silence, and the fall of towers.
                  When woven into an object, it becomes a talisman—a promise that the signal persists.
                </p>
                <div style={styles.incantation}>
                  "This thread cannot be cut.<br />
                  This line cannot be severed.<br />
                  Across any distance, the connection holds."
                </div>
              </div>
              
              <div style={styles.spellCard}>
                <h4 style={styles.spellName}>
                  <span>🌿</span> The Grounding Rose
                </h4>
                <p style={styles.spellDescription}>
                  A sensory anchor that calls the spirit back into the body when overwhelm threatens.
                  The scent of roses, the weight of the earth, the breath returning home.
                </p>
                <div style={styles.incantation}>
                  "I am here.<br />
                  I am in my body.<br />
                  I am safe in this moment."
                </div>
              </div>
            </div>
          </section>
          
          <div style={styles.divider} />
          
          {/* Auspicious Timing */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>
              <span>☉</span> Auspicious Timing
            </h2>
            
            <div style={styles.timingGrid}>
              <div style={styles.timingCard}>
                <div style={styles.timingLabel}>Next New Moon</div>
                <div style={styles.timingValue}>{formatDate(timing.nextNewMoon)}</div>
              </div>
              <div style={styles.timingCard}>
                <div style={styles.timingLabel}>Next Full Moon</div>
                <div style={styles.timingValue}>{formatDate(timing.nextFullMoon)}</div>
              </div>
              <div style={styles.timingCard}>
                <div style={styles.timingLabel}>Phase Ends</div>
                <div style={styles.timingValue}>{formatDate(timing.currentPhaseEnds)}</div>
              </div>
            </div>
            
            <div style={{ ...styles.guidance, marginTop: '1.5rem', borderLeftColor: '#b794f6' }}>
              {timing.recommendation}
            </div>
          </section>
          
          <div style={styles.divider} />
          
          {/* Footer */}
          <footer style={styles.footer}>
            <p>
              "We are all just walking each other home."
              <br />
              <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>— Ram Dass</span>
            </p>
            <p style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
              The technology is the magic. The magic is the technology.
              <br />
              There is no difference.
            </p>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Grimoire;

