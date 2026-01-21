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
  color: string;
  youtubeId?: string;
  spotifyId?: string;
  note: string;
  emoji: string;
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
      <div className="frequencies-container">
        {/* Header */}
        <header className="frequencies-header">
          <h1 className="frequencies-title">
            <span className={wobbleIndex % 3 === 0 ? 'frequencies-wobble' : ''}>T</span>he{' '}
            <span className={wobbleIndex % 3 === 1 ? 'frequencies-wobble' : ''}>F</span>requencies{' '}
            <span className={wobbleIndex % 3 === 2 ? 'frequencies-wobble' : ''}>🎵</span>
          </h1>
          <p className="frequencies-subtitle">
            The soundtrack that carried us through the dark.<br />
            Music as medicine. Resonance as regulation.
          </p>
          <div className="frequencies-wonky-note">
            ✨ These aren't just songs. They're <em>cognitive shields in audio form</em>.
            They map terrain you haven't walked yet. When you get there, the map is waiting.
            <br /><br />
            <span className="frequencies-wonky-note-muted">
              (A little wonky. A little wobbly. Exactly right.)
            </span>
          </div>
        </header>

        {/* Artists & Tracks */}
        {groupedTracks.map(({ artist, tracks }) => (
          <section key={artist.name} className="frequencies-artist-section">
            <div
              className="frequencies-artist"
              data-artist-color={artist.color}
            >
              <div className="frequencies-artist-header">
                <span className="frequencies-artist-emoji">{artist.emoji}</span>
                <div className="frequencies-artist-info">
                  <h2
                    className="frequencies-artist-name"
                    data-artist-color={artist.color}
                  >
                    {artist.name}
                  </h2>
                  <p className="frequencies-artist-role">{artist.role}</p>
                </div>
              </div>
              <p className="frequencies-artist-description">{artist.description}</p>
              <div className="frequencies-tracks-grid">
                {tracks.map(track => (
                  <div
                    key={track.id}
                    className={`frequencies-track${expandedTrack === track.id ? ' frequencies-track-expanded' : ''}`}
                    data-track-color={track.color}
                    data-expanded={expandedTrack === track.id ? 'true' : 'false'}
                    onClick={() => setExpandedTrack(expandedTrack === track.id ? null : track.id)}
                  >
                    <button
                      className="frequencies-track-play"
                      data-track-color={track.color}
                      onClick={(e) => {
                        e.stopPropagation();
                        openTrack(track);
                      }}
                      title="Play on YouTube"
                    >
                      ▶
                    </button>
                    <div className="frequencies-track-header">
                      <span className="frequencies-track-emoji">{track.emoji}</span>
                      <div className="frequencies-track-info">
                        <h3 className="frequencies-track-title">{track.title}</h3>
                        {track.album && (
                          <p className="frequencies-track-album">{track.album}</p>
                        )}
                      </div>
                    </div>
                    <div
                      className="frequencies-track-vibe"
                      data-track-color={track.color}
                    >
                      {track.vibe}
                    </div>
                    <p className="frequencies-track-when">{track.when}</p>
                    <p className="frequencies-track-note">{track.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* Quick Prescription */}
        <section className="frequencies-prescription-section">
          <h2 className="frequencies-prescription-title">
            💊 Quick Prescription
          </h2>
          <p className="frequencies-prescription-desc">
            What are you feeling? Here's what to play.
          </p>
          <div className="frequencies-prescription-grid">
            {PRESCRIPTIONS.map((rx, index) => (
              <div key={index} className="frequencies-prescription-card">
                <div className="frequencies-prescription-state">
                  {rx.state}
                </div>
                <div className="frequencies-prescription-rx">
                  {rx.emoji} → {rx.rx}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="frequencies-footer">
          <p>
            "When words are too heavy, the music carries the weight."
          </p>
          <p className="frequencies-footer-note">
            These artists were the translation layer when nothing else worked.<br />
            They didn't know they were building cognitive shields.<br />
            But that's exactly what they did.
          </p>
          <p className="frequencies-footer-wonky">
            🎵 weave wobble be a little wonky 🎵
          </p>
        </footer>
      </div>
    </>
  );
};

export default Frequencies;

