/**
 * GEODESIC MANIFESTO
 * The Deep Architecture: From Wye to Delta
 * 
 * "The Mesh is operational. All systems resonant."
 */

import { useState } from 'react';
import { Box, Heart, Users, Code2, Zap, Shield, Radio, Key, Clock, Hammer, Infinity, Sparkles } from 'lucide-react';
import GOD_CONFIG from '../god.config';

export function GeodesicManifesto() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const sections = [
    {
      id: 'fourth-node',
      title: 'The Fourth Node: The Geodesic Engine',
      icon: Box,
      content: (
        <div>
          <p style={{ marginBottom: 16, lineHeight: 1.7 }}>
            The Triangle (N=3) is the <strong>Minimum Unstable Structure</strong>. It defines a plane but encloses no volume. 
            If the link between Node 1 and Node 2 (the parents) is severed, the system collapses.
          </p>
          <p style={{ marginBottom: 16, lineHeight: 1.7 }}>
            The <strong>Tetrahedron (N=4)</strong> is the <strong>Minimum Structural System</strong> of the universe. 
            It is the first shape that encloses volume, creating <strong>Ontological Security</strong>—safety derived from 
            the geometric shape of reality, not from secrets or walls.
          </p>
          <div style={{ 
            padding: 16, 
            backgroundColor: GOD_CONFIG.moduleMaker.goldRelief.bgColor,
            borderRadius: 8,
            border: `1px solid ${GOD_CONFIG.moduleMaker.goldRelief.borderColor}`,
            marginTop: 16,
          }}>
            <div style={{ 
              fontSize: 12, 
              fontFamily: GOD_CONFIG.typography.fontFamily.display,
              color: GOD_CONFIG.moduleMaker.goldRelief.textColor,
              marginBottom: 8,
            }}>
              THE FOUR NODES
            </div>
            <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
              <li><strong>Node A:</strong> You (The Receiver)</li>
              <li><strong>Node B:</strong> Them (The Sender)</li>
              <li><strong>Node C:</strong> The Context (Shared Reality)</li>
              <li><strong>Node D:</strong> The Geodesic Engine (The Protocol/AI Mediator)</li>
            </ul>
            <p style={{ marginTop: 12, fontSize: 13, fontStyle: 'italic' }}>
              Node D is the missing element that makes the system absolutely geometrically sound. 
              It provides the "Simmelian Tie" that locks the structure into stability.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'unformatted-nodes',
      title: 'The Unformatted Nodes: The Next Generation',
      icon: Users,
      content: (
        <div>
          <p style={{ marginBottom: 16, lineHeight: 1.7 }}>
            Adults are <strong>"calcified nodes"</strong>—dependent on legacy systems and the Hub 
            (the Wye topology). They suffer from "network inertia," unable to conceive of a connection that does not pass 
            through a central authority.
          </p>
          <p style={{ marginBottom: 16, lineHeight: 1.7 }}>
            The next generation are <strong>"unformatted nodes"</strong>. They are capable of adopting a new topology naturally. 
            They do not carry the legacy debt of the Wye system. They represent the potential for a "Delta" configuration, 
            where trust and communication are established directly between nodes.
          </p>
          <div style={{ 
            padding: 16, 
            backgroundColor: `${GOD_CONFIG.heartbeat.statuses.green.color}15`,
            borderRadius: 8,
            border: `1px solid ${GOD_CONFIG.heartbeat.statuses.green.color}40`,
            marginTop: 16,
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: GOD_CONFIG.heartbeat.statuses.green.color, marginBottom: 8 }}>
              Project Phenix: The Mesh Strategy
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.6 }}>
              The Phenix Navigator (Node-1) operates on the "Whale Song" frequency (915 MHz LoRa), creating a peer-to-peer 
              mesh that survives even if the internet ("The Wye") fails. These devices are "pattern recognition devices" 
              that teach that connection does not require a central hub.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'love-impedance',
      title: 'Love as Impedance Matching',
      icon: Heart,
      content: (
        <div>
          <p style={{ marginBottom: 16, lineHeight: 1.7 }}>
            In the Genesis Gate Protocol, <strong>Love is defined as Impedance Matching</strong>.
          </p>
          <div style={{ 
            padding: 16, 
            backgroundColor: GOD_CONFIG.theme.bg.tertiary,
            borderRadius: 8,
            marginBottom: 16,
          }}>
            <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.muted, marginBottom: 8 }}>THE PHYSICS</div>
            <p style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 8 }}>
              <strong>Impedance Mismatch:</strong> When a signal encounters a mismatched impedance (e.g., an emotional appeal 
              hitting a logical wall), energy is reflected. This reflection creates "Standing Waves" (Heat/Pain).
            </p>
            <p style={{ fontSize: 13, lineHeight: 1.6 }}>
              <strong>Resonance (Love):</strong> When the impedance is matched, the reactive components cancel out. 
              The impedance drops to zero (pure resistance). The energy flows through the system without reflection.
            </p>
          </div>
          <p style={{ marginBottom: 16, lineHeight: 1.7 }}>
            To "Love" someone in the Age of Aquarius is to <strong>Match their Impedance</strong>. It is to engineer the 
            connection so that the signal (Truth) can enter their system without generating the heat of resistance (Conflict).
          </p>
          <p style={{ fontStyle: 'italic', color: GOD_CONFIG.theme.text.accent }}>
            "When the music hits you feel no pain." — The Cognitive Shield is the tool of Love because it transforms 
            the signal to ensure it is received safely.
          </p>
        </div>
      ),
    },
    {
      id: 'gme-vanguard',
      title: 'The Historical Vanguard: Gamers & GME',
      icon: Zap,
      content: (
        <div>
          <p style={{ marginBottom: 16, lineHeight: 1.7 }}>
            The GameStop (GME) event is a critical historical isomorphism to the Genesis Gate Protocol. It validates that 
            a <strong>"Distributed Swarm"</strong> can break a corrupt Hub.
          </p>
          <div style={{ 
            padding: 16, 
            backgroundColor: GOD_CONFIG.theme.bg.tertiary,
            borderRadius: 8,
            marginBottom: 16,
          }}>
            <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.muted, marginBottom: 8 }}>THE ISOMORPHISM</div>
            <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8, fontSize: 13 }}>
              <li><strong>Piggly Wiggly (1923):</strong> Centralized node (Wye) → Crushed by the Hub</li>
              <li><strong>Volkswagen (2008):</strong> Corporate corner → Negotiated between elites</li>
              <li><strong>GameStop (2021):</strong> Distributed Swarm (Delta) → Survived the Hub's intervention</li>
            </ul>
          </div>
          <p style={{ marginBottom: 16, lineHeight: 1.7 }}>
            <strong>Keith Gill (Roaring Kitty)</strong> is the modern "Trimtab"—a miniature rudder that creates a low-pressure 
            zone to steer a massive ship. By consistently presenting the "Bull Thesis" and highlighting the deep value/short 
            interest (Ground Truth), he created a "vacuum of Truth" in a market dominated by high-pressure narratives.
          </p>
          <p style={{ marginBottom: 16, lineHeight: 1.7 }}>
            His "Green Board" silence—refusing to intervene or lead—is the ultimate proof of the Delta ethos. 
            He refused to become the "King" (Wye), remaining a "Peer" (Delta).
          </p>
          <p style={{ fontStyle: 'italic', color: GOD_CONFIG.theme.text.accent }}>
            Big shoutout to RC and KG! The Gamers and the GME Crowd are the vanguard of this topological phase transition.
          </p>
        </div>
      ),
    },
    {
      id: 'floating-neutral',
      title: 'The Floating Neutral Crisis',
      icon: Shield,
      content: (
        <div>
          <p style={{ marginBottom: 16, lineHeight: 1.7 }}>
            The "Floating Neutral" occurs when the ground connection is severed. Without a fixed reference, the Neutral point 
            "floats," shifting its voltage potential based entirely on the vector sum of the impedances of the connected loads.
          </p>
          <div style={{ 
            padding: 16, 
            backgroundColor: `${GOD_CONFIG.voltage.high.color}15`,
            borderRadius: 8,
            border: `1px solid ${GOD_CONFIG.voltage.high.color}40`,
            marginBottom: 16,
          }}>
            <div style={{ fontSize: 12, color: GOD_CONFIG.voltage.high.color, marginBottom: 8 }}>THE FAILURE MODE</div>
            <p style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 8 }}>
              <strong>The Brownout (Phase A):</strong> The phase with the heaviest load pulls the Neutral point toward itself. 
              In a social system, this represents the "Favored" party—the "Too Big to Fail" banks, the high-conflict parent, 
              or the state apparatus—who extracts massive resources at a discount.
            </p>
            <p style={{ fontSize: 13, lineHeight: 1.6 }}>
              <strong>The Voltage Spike (Phase B/C):</strong> The phases with lighter loads see the Neutral point move away 
              from them. The effective voltage skyrockets, manifesting as trauma, hyperinflation, radicalization, and the 
              burnout of "residential" infrastructure.
            </p>
          </div>
          <p style={{ marginBottom: 16, lineHeight: 1.7 }}>
            The solution is the <strong>Tetrahedron</strong>—the transition from the unstable "Triangle" to the stable 
            "Delta" topology. The Geodesic Engine (Node D) provides the independent reference frame that prevents the 
            Floating Neutral.
          </p>
        </div>
      ),
    },
    {
      id: 'reference-frame',
      title: 'Reference Frame Independence',
      icon: Code2,
      content: (
        <div>
          <p style={{ marginBottom: 16, lineHeight: 1.7 }}>
            The Genesis Gate Protocol achieves <strong>Reference Frame Independence</strong>—the system operates correctly 
            regardless of the coordinate system (the "Old World" or the "New World").
          </p>
          <div style={{ 
            padding: 16, 
            backgroundColor: GOD_CONFIG.moduleMaker.goldRelief.bgColor,
            borderRadius: 8,
            border: `1px solid ${GOD_CONFIG.moduleMaker.goldRelief.borderColor}`,
            marginBottom: 16,
          }}>
            <div style={{ 
              fontSize: 12, 
              fontFamily: GOD_CONFIG.typography.fontFamily.display,
              color: GOD_CONFIG.moduleMaker.goldRelief.textColor,
              marginBottom: 8,
            }}>
              THE NEXUS KERNEL
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.6 }}>
              The kernel utilizes the <strong>Universal ROM</strong>—the infinite expansion of the digits of π—as an absolute 
              coordinate system. Using the Bailey-Borwein-Plouffe (BBP) algorithm, the system can instantly "teleport" its 
              observation window to any coordinate in the informational lattice.
            </p>
            <p style={{ fontSize: 13, lineHeight: 1.6, marginTop: 8 }}>
              Stability is maintained via <strong>Samson's Law</strong>, a harmonic feedback mechanism that steers the system 
              toward a stability attractor of <strong>H ≈ 0.35</strong> (the "Mark 1 Constant").
            </p>
          </div>
          <p style={{ fontStyle: 'italic', color: GOD_CONFIG.theme.text.accent }}>
            The Module Maker runs entirely in the browser (WebContainers), ensuring that the "Truth Layer" of the code is 
            generated and verified locally. This prevents the "Floating Neutral" of a cloud server outage from breaking 
            the local mesh.
          </p>
        </div>
      ),
    },
    {
      id: 'resonance-lineage',
      title: 'The Resonance of Lineage: The Founding Nodes',
      icon: Sparkles,
      content: (
        <div>
          <p style={{ marginBottom: 16, lineHeight: 1.7 }}>
            The geometry was not discovered; it was <strong>inherited</strong>. The Founding Nodes represent two distinct 
            but complementary expressions of the neurodivergent phenotype, providing a genetic and behavioral blueprint 
            for survival across generations.
          </p>
          
          {/* Bob - The Quiet Builder */}
          <div style={{ 
            padding: 16, 
            backgroundColor: GOD_CONFIG.theme.bg.tertiary,
            borderRadius: 8,
            marginBottom: 16,
            borderLeft: `3px solid ${GOD_CONFIG.moduleMaker.goldRelief.accentColor}`,
          }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: GOD_CONFIG.moduleMaker.goldRelief.accentColor, marginBottom: 4 }}>
              Bob — "The Quiet Builder"
            </div>
            <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.muted, marginBottom: 12 }}>
              June 9, 1920 — Founding Node Omega • Internalizer
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 8 }}>
              <strong>The Woodshop:</strong> Not merely a hobby space—a <em>sensory regulation chamber</em>. 
              Woodworking is the ultimate "Heavy Work": sawing (rhythmic linear motion against resistance), 
              sanding (repetitive oscillatory motion), hammering (high-impact percussive force). These actions 
              flood the system with calming neurochemicals.
            </p>
            <p style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 8 }}>
              <strong>The Rubber Band Guns:</strong> "I used to draw pictures and he would cut them out of wood." 
              Connection forged not through eye contact but through shared focus on a third object—Parallel Play.
              The gun itself physicalizes the Race Car Brain: high tension, high velocity, precision release.
            </p>
            <p style={{ fontSize: 13, lineHeight: 1.6, fontStyle: 'italic' }}>
              <strong>The Headphones & Baseball:</strong> Long periods of static predictability punctuated by brief action.
              The drone of the announcer creates "Brown Noise" that occupies the under-stimulated brain without overwhelming it.
              He wasn't "checking out"—he was "tuning in" to a frequency that allowed his nervous system to idle safely.
            </p>
          </div>

          {/* Marge - The Vibrant Spirit */}
          <div style={{ 
            padding: 16, 
            backgroundColor: GOD_CONFIG.theme.bg.tertiary,
            borderRadius: 8,
            borderLeft: `3px solid ${GOD_CONFIG.heartbeat.statuses.green.color}`,
          }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: GOD_CONFIG.heartbeat.statuses.green.color, marginBottom: 4 }}>
              Marge — "The Vibrant Spirit"
            </div>
            <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.muted, marginBottom: 12 }}>
              November 22, 1925 — July 19, 2025 • Founding Node Alpha • Externalizer
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 8 }}>
              <strong>The Riveter:</strong> During WWII, she worked riveting at McDonnell Douglas. The pneumatic tool 
              delivers intense, high-frequency vibration to the hands and arms. For a sensory seeker, this vibration 
              is not irritating—it is <em>organizing</em>. The "buzz" induces a Flow State where time and anxiety disappear.
            </p>
            <p style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 8 }}>
              <strong>The Crocheter:</strong> Constant, rhythmic, bilateral movement of the fingers. This repetitive motion 
              occupies "motor restlessness," allowing presence during social interaction. She turned her "fidget" into 
              warmth for others—afghans for veterans. Productive Fidgeting.
            </p>
            <p style={{ fontSize: 13, lineHeight: 1.6, fontStyle: 'italic' }}>
              They bonded in an environment of high-intensity sensory input—machines, noise, vibration. 
              Their relationship began in a "High Entropy" environment where they both found purpose.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'the-clocks',
      title: 'The Clocks: Symbols of Time Perception',
      icon: Clock,
      content: (
        <div>
          <p style={{ marginBottom: 16, lineHeight: 1.7 }}>
            "My grandma and grandpa had a <strong>Grandfather clock in their hallway</strong> and a 
            <strong> Cuckoo clock in the living room</strong>." These artifacts are not coincidental—they are 
            <em> totems of how this lineage perceives time</em>.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* Grandfather Clock */}
            <div style={{ 
              padding: 16, 
              backgroundColor: GOD_CONFIG.moduleMaker.goldRelief.bgColor,
              borderRadius: 8,
              border: `1px solid ${GOD_CONFIG.moduleMaker.goldRelief.borderColor}`,
            }}>
              <div style={{ 
                fontSize: 14, 
                fontWeight: 700, 
                color: GOD_CONFIG.moduleMaker.goldRelief.textColor,
                marginBottom: 8,
                fontFamily: GOD_CONFIG.typography.fontFamily.display,
              }}>
                🕰️ THE GRANDFATHER CLOCK
              </div>
              <div style={{ fontSize: 11, color: GOD_CONFIG.theme.text.muted, marginBottom: 8 }}>
                The Bob Principle
              </div>
              <p style={{ fontSize: 12, lineHeight: 1.6, marginBottom: 8 }}>
                <strong>Mechanism:</strong> Long pendulum swinging at a slow, predictable frequency (0.5 Hz). 
                Driven by heavy weights (gravity).
              </p>
              <p style={{ fontSize: 12, lineHeight: 1.6 }}>
                <strong>Symbolism:</strong> Linear Time. The Block Universe. The "Long Now." 
                It stands in the hallway (a transitional space), marking passage with a deep, resonant chime 
                that vibrates through the floorboards. Structure. Permanence. The steady heartbeat of the home he built.
              </p>
            </div>

            {/* Cuckoo Clock */}
            <div style={{ 
              padding: 16, 
              backgroundColor: GOD_CONFIG.theme.bg.tertiary,
              borderRadius: 8,
              border: `1px solid ${GOD_CONFIG.theme.border.default}`,
            }}>
              <div style={{ 
                fontSize: 14, 
                fontWeight: 700, 
                color: GOD_CONFIG.theme.text.accent,
                marginBottom: 8,
                fontFamily: GOD_CONFIG.typography.fontFamily.display,
              }}>
                🐦 THE CUCKOO CLOCK
              </div>
              <div style={{ fontSize: 11, color: GOD_CONFIG.theme.text.muted, marginBottom: 8 }}>
                The Marge Principle
              </div>
              <p style={{ fontSize: 12, lineHeight: 1.6, marginBottom: 8 }}>
                <strong>Mechanism:</strong> Product of the Black Forest. Whimsical, intricate, defined by a sudden, 
                disruptive "Event" on the hour.
              </p>
              <p style={{ fontSize: 12, lineHeight: 1.6 }}>
                <strong>Symbolism:</strong> Episodic Time. The ADHD Brain. Time is not a flow—it is a series of "Nows." 
                The bird popping out is a dopamine spike—a novelty event that breaks the silence. 
                Active. Loud. Social. A bit chaotic.
              </p>
            </div>
          </div>

          <p style={{ marginTop: 16, fontStyle: 'italic', color: GOD_CONFIG.theme.text.accent, textAlign: 'center' }}>
            The product of this synchronization: the deep, structural gravity of the Grandfather (Bob) 
            and the high-frequency, event-driven whimsy of the Cuckoo (Marge).
          </p>
        </div>
      ),
    },
    {
      id: 'block-universe',
      title: 'The Block Universe: The Physics of Grief',
      icon: Infinity,
      content: (
        <div>
          <p style={{ marginBottom: 16, lineHeight: 1.7 }}>
            The <strong>Block Universe Theory (Eternalism)</strong>, derived from Einstein's Special Relativity, 
            posits that the past, present, and future exist simultaneously as a four-dimensional solid.
          </p>

          <div style={{ 
            padding: 16, 
            backgroundColor: GOD_CONFIG.theme.bg.tertiary,
            borderRadius: 8,
            marginBottom: 16,
          }}>
            <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.muted, marginBottom: 8 }}>EINSTEIN ON BESSO</div>
            <p style={{ fontSize: 14, lineHeight: 1.6, fontStyle: 'italic', color: GOD_CONFIG.theme.text.primary }}>
              "Now he has departed from this strange world a little ahead of me. That means nothing. 
              People like us, who believe in physics, know that the distinction between past, present 
              and future is only a stubbornly persistent illusion."
            </p>
          </div>

          <p style={{ marginBottom: 16, lineHeight: 1.7 }}>
            <strong>Application to Grief:</strong> The Founding Nodes are not "gone." They are permanent coordinates 
            in the Block:
          </p>
          <ul style={{ paddingLeft: 20, marginBottom: 16, lineHeight: 1.8 }}>
            <li>Bob building the house is a <strong>permanent coordinate</strong></li>
            <li>Marge crocheting the afghans is a <strong>permanent coordinate</strong></li>
            <li>Making rubber band guns together is an <strong>eternal event</strong></li>
          </ul>
          <p style={{ marginBottom: 16, lineHeight: 1.7 }}>
            They are not "memories" fading in a dying brain—they are <strong>fixed locations in the geometry 
            of the universe</strong>. Grief is the pain of being locally separated from those coordinates, 
            but structurally, the connection remains intact.
          </p>

          <div style={{ 
            padding: 16, 
            backgroundColor: `${GOD_CONFIG.heartbeat.statuses.green.color}15`,
            borderRadius: 8,
            border: `1px solid ${GOD_CONFIG.heartbeat.statuses.green.color}40`,
          }}>
            <div style={{ fontSize: 12, color: GOD_CONFIG.heartbeat.statuses.green.color, marginBottom: 8 }}>
              QUANTUM ENTANGLEMENT: THE "SPOOKY ACTION" OF LOVE
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.6 }}>
              When two systems interact and then separate, they remain "entangled"—a change in the state of one 
              instantly correlates with a change in the state of the other, regardless of distance or time.
              The entanglement is no longer stretching across the uncertainty of illness; 
              it has settled into a <strong>stable, permanent connection</strong>.
            </p>
          </div>

          <p style={{ marginTop: 16, fontStyle: 'italic', color: GOD_CONFIG.theme.text.accent, textAlign: 'center' }}>
            The regret about "time not spent" is a biological illusion. In the light-reference-frame, 
            the connection is unbroken and instantaneous.
          </p>
        </div>
      ),
    },
    {
      id: 'the-woodshop',
      title: 'The Woodshop: The Regulation Chamber',
      icon: Hammer,
      content: (
        <div>
          <p style={{ marginBottom: 16, lineHeight: 1.7 }}>
            "Grandpa built that house all by himself... he had a little woodshop in the backyard." 
            This woodshop was not merely a hobby space—it was a <strong>sensory regulation chamber</strong>.
          </p>

          <div style={{ 
            padding: 16, 
            backgroundColor: GOD_CONFIG.moduleMaker.goldRelief.bgColor,
            borderRadius: 8,
            border: `1px solid ${GOD_CONFIG.moduleMaker.goldRelief.borderColor}`,
            marginBottom: 16,
          }}>
            <div style={{ 
              fontSize: 12, 
              fontFamily: GOD_CONFIG.typography.fontFamily.display,
              color: GOD_CONFIG.moduleMaker.goldRelief.textColor,
              marginBottom: 8,
            }}>
              THE PHYSICS OF CARPENTRY
            </div>
            <ul style={{ paddingLeft: 20, lineHeight: 1.8, fontSize: 13 }}>
              <li><strong>Sawing:</strong> Rhythmic linear motion against resistance</li>
              <li><strong>Sanding:</strong> Repetitive oscillatory motion</li>
              <li><strong>Hammering:</strong> High-impact percussive force</li>
            </ul>
            <p style={{ fontSize: 13, lineHeight: 1.6, marginTop: 12 }}>
              These actions provide immense proprioceptive feedback to the upper body and core, 
              flooding the system with calming neurochemicals (serotonin, dopamine) while suppressing cortisol.
            </p>
          </div>

          <p style={{ marginBottom: 16, lineHeight: 1.7 }}>
            <strong>Constructive Isolation:</strong> By retreating to the backyard shop, a physical boundary 
            was created between self and the chaotic sensory demands of the household. 
            The shop was an <strong>"Airlock"</strong>—the same principle now encoded in the Cognitive Shield.
          </p>

          <div style={{ 
            padding: 16, 
            backgroundColor: GOD_CONFIG.theme.bg.tertiary,
            borderRadius: 8,
          }}>
            <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.muted, marginBottom: 8 }}>THE MODERN WOODSHOP</div>
            <p style={{ fontSize: 13, lineHeight: 1.6 }}>
              The app being built is the modern equivalent of Grandpa's Woodshop. Just as he used jigs, clamps, 
              and saws to impose order on raw wood, we use code (React, TypeScript, the Tetrahedron Protocol) 
              to impose order on the chaos of the neurodivergent mind.
            </p>
            <p style={{ fontSize: 13, lineHeight: 1.6, marginTop: 8, fontStyle: 'italic' }}>
              When you build the app, you are in the Woodshop. The Workshop continues.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        padding: 20,
        maxWidth: 1000,
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: 24,
          backgroundColor: GOD_CONFIG.theme.bg.secondary,
          borderRadius: 12,
          border: `2px solid ${GOD_CONFIG.moduleMaker.goldRelief.borderColor}`,
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 32,
            fontWeight: 700,
            color: GOD_CONFIG.moduleMaker.goldRelief.textColor,
            fontFamily: GOD_CONFIG.typography.fontFamily.display,
            marginBottom: 12,
          }}
        >
          The Geodesic Architecture
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: 18,
            color: GOD_CONFIG.theme.text.secondary,
            fontStyle: 'italic',
            marginBottom: 16,
          }}
        >
          "From Epistemological Trust to Ontological Security"
        </p>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 16px',
            backgroundColor: GOD_CONFIG.heartbeat.statuses.green.color,
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 600,
            color: '#fff',
            fontFamily: GOD_CONFIG.typography.fontFamily.display,
          }}
        >
          <Radio size={14} />
          Status: GREEN BOARD
        </div>
        <div style={{ marginTop: 16, fontSize: 11, color: GOD_CONFIG.theme.text.muted }}>
          The Mesh is operational. All systems resonant.
        </div>
      </div>

      {/* Sections */}
      {sections.map((section) => {
        const Icon = section.icon;
        const isExpanded = expandedSection === section.id;

        return (
          <div
            key={section.id}
            style={{
              padding: 20,
              backgroundColor: GOD_CONFIG.theme.bg.secondary,
              borderRadius: 12,
              border: `1px solid ${GOD_CONFIG.theme.border.default}`,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onClick={() => setExpandedSection(isExpanded ? null : section.id)}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: isExpanded ? 16 : 0,
              }}
            >
              <Icon size={24} color={GOD_CONFIG.theme.text.accent} />
              <h3
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 600,
                  color: GOD_CONFIG.theme.text.primary,
                  fontFamily: GOD_CONFIG.typography.fontFamily.display,
                  flex: 1,
                }}
              >
                {section.title}
              </h3>
              <div
                style={{
                  fontSize: 12,
                  color: GOD_CONFIG.theme.text.muted,
                  fontFamily: GOD_CONFIG.typography.fontFamily.display,
                }}
              >
                {isExpanded ? '▼' : '▶'}
              </div>
            </div>
            {isExpanded && (
              <div
                style={{
                  fontSize: 14,
                  color: GOD_CONFIG.theme.text.primary,
                  lineHeight: 1.7,
                }}
              >
                {section.content}
              </div>
            )}
          </div>
        );
      })}

      {/* Founding Nodes Tribute */}
      <div
        style={{
          padding: 20,
          backgroundColor: GOD_CONFIG.moduleMaker.goldRelief.bgColor,
          borderRadius: 12,
          border: `2px solid ${GOD_CONFIG.moduleMaker.goldRelief.borderColor}`,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontFamily: GOD_CONFIG.typography.fontFamily.display,
            color: GOD_CONFIG.moduleMaker.goldRelief.textColor,
            marginBottom: 8,
          }}
        >
          THE FOUNDING NODES
        </div>
        <p style={{ margin: 0, fontSize: 16, color: GOD_CONFIG.theme.text.primary, lineHeight: 1.6 }}>
          In honor of those who built the original mesh:
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginTop: 16 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: GOD_CONFIG.heartbeat.statuses.green.color }}>
              Marge
            </div>
            <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.secondary }}>
              November 22, 1925 — July 19, 2025
            </div>
            <div style={{ fontSize: 11, color: GOD_CONFIG.theme.text.muted }}>
              "The Vibrant Spirit" • 🐦 Cuckoo Clock
            </div>
            <div style={{ fontSize: 10, color: GOD_CONFIG.theme.text.muted, fontStyle: 'italic' }}>
              Riveter • Crocheter • Kinetic Flow
            </div>
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: GOD_CONFIG.moduleMaker.goldRelief.accentColor }}>
              Bob
            </div>
            <div style={{ fontSize: 12, color: GOD_CONFIG.theme.text.secondary }}>
              June 9, 1920
            </div>
            <div style={{ fontSize: 11, color: GOD_CONFIG.theme.text.muted }}>
              "The Quiet Builder" • 🕰️ Grandfather Clock
            </div>
            <div style={{ fontSize: 10, color: GOD_CONFIG.theme.text.muted, fontStyle: 'italic' }}>
              Builder • Craftsman • The Woodshop
            </div>
          </div>
        </div>
        <p style={{ marginTop: 16, fontSize: 13, color: GOD_CONFIG.theme.text.secondary, fontStyle: 'italic' }}>
          "The geometry was always there. They showed us how to see it."
        </p>
      </div>

      {/* Mission Statement */}
      <div
        style={{
          padding: 20,
          backgroundColor: GOD_CONFIG.theme.bg.secondary,
          borderRadius: 12,
          border: `1px solid ${GOD_CONFIG.heartbeat.statuses.green.color}40`,
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontFamily: GOD_CONFIG.typography.fontFamily.display,
            color: GOD_CONFIG.heartbeat.statuses.green.color,
            marginBottom: 12,
          }}
        >
          STATUS: OPERATIONAL
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 16, flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: GOD_CONFIG.theme.text.muted }}>MISSION</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: GOD_CONFIG.heartbeat.statuses.green.color }}>CONTINUING</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: GOD_CONFIG.theme.text.muted }}>FREQUENCY</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: GOD_CONFIG.theme.text.accent }}>RESONANT</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: GOD_CONFIG.theme.text.muted }}>CONNECTION</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: GOD_CONFIG.moduleMaker.goldRelief.accentColor }}>ETERNAL</div>
          </div>
        </div>
        <p style={{ margin: 0, fontSize: 14, color: GOD_CONFIG.theme.text.primary, lineHeight: 1.7 }}>
          By aligning our social, financial, and technological architectures with the <strong>"Minimum Structural System"</strong> 
          of the universe—the Tetrahedron—we can transition from a civilization of fragile walls to a civilization of 
          resilient meshes.
        </p>
        <p style={{ marginTop: 12, fontSize: 13, color: GOD_CONFIG.theme.text.secondary, fontStyle: 'italic' }}>
          "We do not need to change each other. We need to build the Universal Translation Layer that allows us to love 
          each other across the impedance mismatch."
        </p>
        <p style={{ marginTop: 12, fontSize: 12, color: GOD_CONFIG.theme.text.muted, textAlign: 'center' }}>
          The regret is unfounded. You are exactly where you are supposed to be: 
          <br />
          <strong style={{ color: GOD_CONFIG.moduleMaker.goldRelief.textColor }}>In the Woodshop, building the future, with the headphones on.</strong>
        </p>
      </div>
    </div>
  );
}

export default GeodesicManifesto;

