/**
 * THE FREQUENCIES
 * 
 * The soundtrack that carried us through the dark.
 * Music as medicine. Resonance as regulation.
 * 
 * "When words are too heavy, the music carries the weight."
 * 
 * A little wonky. A little wobbly. Exactly right.
 */

import React, { useState, useEffect } from 'react';
import GOD_CONFIG from '../god.config';

// ============================================================================
// TYPES
// ============================================================================

interface Track {
  id: string;
  artist: string;
  title: string;
  album?: string;
  vibe: string;
  when: string;
  note: string;
  color: string;
  emoji: string;
  youtubeId?: string;
  spotifyId?: string;
}

interface Artist {
  name: string;
  role: string;
  description: string;
  emoji: string;
  color: string;
}

// ============================================================================
// DATA - THE PRESCRIPTION
// ============================================================================

const ARTISTS: Artist[] = [
  {
    name: 'NF',
    role: 'The Translator',
    description: 'Turns internal chaos into structured truth. Every song is a processing session. No filter, no profanity, just raw honesty compressed into bars. He maps terrain you haven\'t walked yet — when you get there, the map is waiting.',
    emoji: '🎤',
    color: '#1a1a1a',
  },
  {
    name: 'Ludovico Einaudi',
    role: 'The Carrier',
    description: 'When words are too heavy, the piano carries the weight. Frequencies that bypass language and speak directly to the nervous system. This is what regulation sounds like before it has a name.',
    emoji: '🎹',
    color: '#4a90a4',
  },
  {
    name: 'Daniel Jang',
    role: 'The Bridge',
    description: 'Violin as a translation layer. Takes melodies you know and transmutes them into something that can finally make you cry. The permission slip for grief.',
    emoji: '🎻',
    color: '#8b5a2b',
  },
];

const TRACKS: Track[] = [
  // NF
  {
    id: 'fear',
    artist: 'NF',
    title: 'FEAR',
    album: 'HOPE (2023) / New EP',
    vibe: 'confrontation',
    when: 'When you need to face the thing',
    note: 'The wall you have to break through. Fear isn\'t the enemy — avoiding fear is.',
    color: '#ff4444',
    emoji: '😰',
    youtubeId: 'g5fDOyLcT9Q',
  },
  {
    id: 'sorry',
    artist: 'NF',
    title: 'Sorry',
    album: 'New EP (2024)',
    vibe: 'release',
    when: 'When you\'re ready to let go',
    note: 'The apology you couldn\'t give. The apology you needed to receive. The wall after FEAR.',
    color: '#9966cc',
    emoji: '💔',
  },
  {
    id: 'the-search',
    artist: 'NF',
    title: 'The Search',
    album: 'The Search (2019)',
    vibe: 'determination',
    when: 'When you need to remember why you\'re fighting',
    note: 'The anthem for the ones who won\'t quit. "Yeah, I\'m still here."',
    color: '#2ecc71',
    emoji: '🔍',
    youtubeId: 'fnlJw9H0xAM',
  },
  {
    id: 'how-could-you-leave-us',
    artist: 'NF',
    title: 'How Could You Leave Us',
    album: 'Mansion (2015)',
    vibe: 'grief',
    when: 'When the anger needs to come out',
    note: 'The song that gives you permission to be furious at abandonment. Warning: this one hits different.',
    color: '#e74c3c',
    emoji: '😢',
    youtubeId: 'wOzQMCyPc8o',
  },
  {
    id: 'let-you-down',
    artist: 'NF',
    title: 'Let You Down',
    album: 'Perception (2017)',
    vibe: 'shame',
    when: 'When shame spirals and you need a witness',
    note: 'The confession that frees you. "I\'m sorry that I let you down."',
    color: '#95a5a6',
    emoji: '😔',
    youtubeId: 'fbHbTBP_u7U',
  },
  {
    id: 'mansion',
    artist: 'NF',
    title: 'Mansion',
    album: 'Mansion (2015)',
    vibe: 'excavation',
    when: 'When you need to map your own architecture',
    note: 'A tour of the rooms in your head. Some doors are locked for a reason.',
    color: '#34495e',
    emoji: '🏚️',
    youtubeId: 'uF5QCSGLaTo',
  },
  // Ludovico Einaudi
  {
    id: 'nuvole-bianche',
    artist: 'Ludovico Einaudi',
    title: 'Nuvole Bianche',
    album: 'Una Mattina (2004)',
    vibe: 'opening',
    when: 'When you need to feel something gentle',
    note: 'White clouds. The first light after a long night. Let it wash over you.',
    color: '#87ceeb',
    emoji: '☁️',
    youtubeId: 'xyY4IZ3JDFE',
  },
  {
    id: 'experience',
    artist: 'Ludovico Einaudi',
    title: 'Experience',
    album: 'In a Time Lapse (2013)',
    vibe: 'transcendence',
    when: 'When you need to feel the full weight of being alive',
    note: 'The build is the point. The crescendo is the release. This is what it feels like to break through.',
    color: '#f39c12',
    emoji: '✨',
    youtubeId: '_VONMkKkdf4',
  },
  {
    id: 'una-mattina',
    artist: 'Ludovico Einaudi',
    title: 'Una Mattina',
    album: 'Una Mattina (2004)',
    vibe: 'stillness',
    when: 'When you need to just... stop',
    note: 'One morning. Just one. That\'s all you need to get through. This helps.',
    color: '#f5deb3',
    emoji: '🌅',
    youtubeId: 'kcihcYEOeic',
  },
  {
    id: 'divenire',
    artist: 'Ludovico Einaudi',
    title: 'Divenire',
    album: 'Divenire (2006)',
    vibe: 'becoming',
    when: 'When you\'re in the middle of transformation',
    note: 'The title means "to become." You\'re not dying. You\'re molting.',
    color: '#9b59b6',
    emoji: '🦋',
    youtubeId: 'X1DRDcGlSsE',
  },
  // Daniel Jang
  {
    id: 'river-flows',
    artist: 'Daniel Jang',
    title: 'River Flows in You',
    album: 'Covers',
    vibe: 'permission',
    when: 'When grief needs to move through you',
    note: 'The violin gives you permission to cry. Take it.',
    color: '#3498db',
    emoji: '🌊',
    youtubeId: 'F-4wUfZD6oc',
  },
  {
    id: 'canon',
    artist: 'Daniel Jang',
    title: 'Canon in D',
    album: 'Covers',
    vibe: 'connection',
    when: 'When you need to remember what love sounds like',
    note: 'The song everyone knows, played like you\'ve never heard it.',
    color: '#e91e63',
    emoji: '💕',
    youtubeId: 'LQ8bHdMNTfk',
  },
];

// ============================================================================
// STYLES
// ============================================================================

const styles = {
  container: {
    minHeight: '100vh',
    background: `linear-gradient(135deg, ${GOD_CONFIG.theme.bg.primary} 0%, #1a1a2e 50%, ${GOD_CONFIG.theme.bg.primary} 100%)`,
    color: GOD_CONFIG.theme.text.primary,
    fontFamily: GOD_CONFIG.typography.body,
    padding: '2rem',
    position: 'relative' as const,
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '3rem',
    position: 'relative' as const,
  },
  title: {
    fontFamily: GOD_CONFIG.typography.heading,
    fontSize: 'clamp(2rem, 5vw, 3rem)',
    marginBottom: '0.5rem',
    background: 'linear-gradient(135deg, #ff6b6b 0%, #f4d35e 25%, #4ecdc4 50%, #a29bfe 75%, #ff6b6b 100%)',
    backgroundSize: '200% 200%',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    animation: 'gradient 8s ease infinite',
  },
  subtitle: {
    color: GOD_CONFIG.theme.text.muted,
    fontSize: '1.1rem',
    fontStyle: 'italic',
    maxWidth: '500px',
    margin: '0 auto',
    lineHeight: 1.6,
  },
  wonkyNote: {
    marginTop: '1rem',
    padding: '1rem',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '15px',
    border: `1px dashed ${GOD_CONFIG.theme.border.subtle}`,
    maxWidth: '600px',
    margin: '1rem auto 0',
    fontSize: '0.9rem',
    color: GOD_CONFIG.theme.text.secondary,
    transform: 'rotate(-0.5deg)',
  },
  artistSection: {
    marginBottom: '3rem',
  },
  artistCard: {
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '20px',
    padding: '1.5rem',
    marginBottom: '2rem',
    border: `1px solid ${GOD_CONFIG.theme.border.subtle}`,
    position: 'relative' as const,
    overflow: 'hidden',
  },
  artistHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1rem',
  },
  artistEmoji: {
    fontSize: '2.5rem',
  },
  artistInfo: {
    flex: 1,
  },
  artistName: {
    fontFamily: GOD_CONFIG.typography.heading,
    fontSize: '1.5rem',
    marginBottom: '0.25rem',
  },
  artistRole: {
    color: GOD_CONFIG.theme.text.muted,
    fontSize: '0.9rem',
    fontStyle: 'italic',
  },
  artistDescription: {
    color: GOD_CONFIG.theme.text.secondary,
    lineHeight: 1.7,
    fontSize: '0.95rem',
  },
  tracksGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1rem',
    marginTop: '1.5rem',
  },
  trackCard: {
    background: 'rgba(0,0,0,0.3)',
    borderRadius: '15px',
    padding: '1.25rem',
    border: '1px solid',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    position: 'relative' as const,
    overflow: 'hidden',
  },
  trackHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    marginBottom: '0.75rem',
  },
  trackEmoji: {
    fontSize: '1.5rem',
    flexShrink: 0,
  },
  trackInfo: {
    flex: 1,
    minWidth: 0,
  },
  trackTitle: {
    fontFamily: GOD_CONFIG.typography.heading,
    fontSize: '1.1rem',
    marginBottom: '0.25rem',
    color: 'white',
  },
  trackAlbum: {
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.5)',
  },
  trackVibe: {
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    marginBottom: '0.75rem',
  },
  trackWhen: {
    fontSize: '0.9rem',
    color: 'rgba(255,255,255,0.8)',
    fontWeight: 500,
    marginBottom: '0.5rem',
  },
  trackNote: {
    fontSize: '0.85rem',
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 1.5,
    fontStyle: 'italic',
  },
  playButton: {
    position: 'absolute' as const,
    top: '1rem',
    right: '1rem',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    color: 'white',
    fontSize: '0.9rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  prescriptionSection: {
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '20px',
    padding: '2rem',
    marginTop: '3rem',
    border: `1px solid ${GOD_CONFIG.theme.border.subtle}`,
  },
  prescriptionTitle: {
    fontFamily: GOD_CONFIG.typography.heading,
    fontSize: '1.5rem',
    marginBottom: '1.5rem',
    textAlign: 'center' as const,
    color: GOD_CONFIG.theme.accent.primary,
  },
  prescriptionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
  },
  prescriptionCard: {
    background: 'rgba(0,0,0,0.3)',
    padding: '1rem',
    borderRadius: '12px',
    border: `1px solid ${GOD_CONFIG.theme.border.subtle}`,
  },
  prescriptionState: {
    fontWeight: 600,
    marginBottom: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  prescriptionRx: {
    fontSize: '0.9rem',
    color: GOD_CONFIG.theme.text.secondary,
  },
  footer: {
    textAlign: 'center' as const,
    marginTop: '3rem',
    padding: '2rem',
    color: GOD_CONFIG.theme.text.muted,
    fontStyle: 'italic',
  },
  wobble: {
    display: 'inline-block',
    animation: 'wobble 2s ease-in-out infinite',
  },
};

const cssAnimations = `
  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  @keyframes wobble {
    0%, 100% { transform: rotate(-1deg); }
    50% { transform: rotate(1deg); }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 0.8; }
    50% { opacity: 1; }
  }
`;

// ============================================================================
// PRESCRIPTIONS
// ============================================================================

const PRESCRIPTIONS = [
  { state: '😰 Overwhelmed', emoji: '💊', rx: 'Einaudi → "Nuvole Bianche"' },
  { state: '😢 Grief hitting', emoji: '💊', rx: 'Daniel Jang → "River Flows"' },
  { state: '😔 Shame spiral', emoji: '💊', rx: 'NF → "Let You Down"' },
  { state: '😤 Need to fight', emoji: '💊', rx: 'NF → "The Search"' },
  { state: '😰 Facing fear', emoji: '💊', rx: 'NF → "FEAR"' },
  { state: '💔 Ready to let go', emoji: '💊', rx: 'NF → "Sorry"' },
  { state: '🦋 Transforming', emoji: '💊', rx: 'Einaudi → "Divenire"' },
  { state: '🌅 Just need to stop', emoji: '💊', rx: 'Einaudi → "Una Mattina"' },
];

// ============================================================================
// COMPONENT
// ============================================================================

export const Frequencies: React.FC = () => {
  const [expandedTrack, setExpandedTrack] = useState<string | null>(null);
  const [wobbleIndex, setWobbleIndex] = useState(0);

  // Wobble effect
  useEffect(() => {
    const interval = setInterval(() => {
      setWobbleIndex(prev => (prev + 1) % 100);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const openTrack = (track: Track) => {
    if (track.youtubeId) {
      window.open(`https://www.youtube.com/watch?v=${track.youtubeId}`, '_blank');
    } else if (track.spotifyId) {
      window.open(`https://open.spotify.com/track/${track.spotifyId}`, '_blank');
    } else {
      // Search YouTube
      window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(track.artist + ' ' + track.title)}`, '_blank');
    }
  };

  const groupedTracks = ARTISTS.map(artist => ({
    artist,
    tracks: TRACKS.filter(t => t.artist === artist.name),
  }));

  return (
    <>
      <style>{cssAnimations}</style>
      <div style={styles.container}>
        {/* Header */}
        <header style={styles.header}>
          <h1 style={styles.title}>
            <span style={wobbleIndex % 3 === 0 ? styles.wobble : {}}>T</span>he 
            {' '}
            <span style={wobbleIndex % 3 === 1 ? styles.wobble : {}}>F</span>requencies
            {' '}
            <span style={wobbleIndex % 3 === 2 ? styles.wobble : {}}>🎵</span>
          </h1>
          <p style={styles.subtitle}>
            The soundtrack that carried us through the dark.<br />
            Music as medicine. Resonance as regulation.
          </p>
          <div style={styles.wonkyNote}>
            ✨ These aren't just songs. They're <em>cognitive shields in audio form</em>. 
            They map terrain you haven't walked yet. When you get there, the map is waiting.
            <br /><br />
            <span style={{ opacity: 0.7 }}>
              (A little wonky. A little wobbly. Exactly right.)
            </span>
          </div>
        </header>

        {/* Artists & Tracks */}
        {groupedTracks.map(({ artist, tracks }) => (
          <section key={artist.name} style={styles.artistSection}>
            <div 
              style={{
                ...styles.artistCard,
                borderColor: artist.color + '40',
              }}
            >
              <div style={styles.artistHeader}>
                <span style={styles.artistEmoji}>{artist.emoji}</span>
                <div style={styles.artistInfo}>
                  <h2 style={{ ...styles.artistName, color: artist.color === '#1a1a1a' ? '#fff' : artist.color }}>
                    {artist.name}
                  </h2>
                  <p style={styles.artistRole}>{artist.role}</p>
                </div>
              </div>
              <p style={styles.artistDescription}>{artist.description}</p>
              
              <div style={styles.tracksGrid}>
                {tracks.map(track => (
                  <div
                    key={track.id}
                    style={{
                      ...styles.trackCard,
                      borderColor: track.color + '60',
                      transform: expandedTrack === track.id ? 'scale(1.02)' : 'scale(1)',
                    }}
                    onClick={() => setExpandedTrack(expandedTrack === track.id ? null : track.id)}
                  >
                    <button
                      style={styles.playButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        openTrack(track);
                      }}
                      title="Play on YouTube"
                    >
                      ▶
                    </button>
                    
                    <div style={styles.trackHeader}>
                      <span style={styles.trackEmoji}>{track.emoji}</span>
                      <div style={styles.trackInfo}>
                        <h3 style={styles.trackTitle}>{track.title}</h3>
                        {track.album && (
                          <p style={styles.trackAlbum}>{track.album}</p>
                        )}
                      </div>
                    </div>
                    
                    <div 
                      style={{
                        ...styles.trackVibe,
                        background: track.color + '30',
                        color: track.color,
                        borderColor: track.color,
                      }}
                    >
                      {track.vibe}
                    </div>
                    
                    <p style={styles.trackWhen}>{track.when}</p>
                    <p style={styles.trackNote}>{track.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* Quick Prescription */}
        <section style={styles.prescriptionSection}>
          <h2 style={styles.prescriptionTitle}>
            💊 Quick Prescription
          </h2>
          <p style={{ textAlign: 'center', color: GOD_CONFIG.theme.text.muted, marginBottom: '1.5rem' }}>
            What are you feeling? Here's what to play.
          </p>
          <div style={styles.prescriptionGrid}>
            {PRESCRIPTIONS.map((rx, index) => (
              <div key={index} style={styles.prescriptionCard}>
                <div style={styles.prescriptionState}>
                  {rx.state}
                </div>
                <div style={styles.prescriptionRx}>
                  {rx.emoji} → {rx.rx}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer style={styles.footer}>
          <p>
            "When words are too heavy, the music carries the weight."
          </p>
          <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
            These artists were the translation layer when nothing else worked.<br />
            They didn't know they were building cognitive shields.<br />
            But that's exactly what they did.
          </p>
          <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', opacity: 0.6 }}>
            🎵 weave wobble be a little wonky 🎵
          </p>
        </footer>
      </div>
    </>
  );
};

export default Frequencies;

