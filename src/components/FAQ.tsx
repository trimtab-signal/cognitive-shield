/**
 * FAQ - FREQUENTLY ASKED QUESTIONS
 * Every question they're going to ask, answered.
 * 
 * "I just want to hold my wife."
 * That's the only question that matters. Everything else is infrastructure.
 */

import { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Heart,
  Radio,
  Shield,
  Users,
  Lock,
  Zap,
  Brain,
  Box,
  Wifi,
  Globe,
  Key,
  MessageCircle,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import GOD_CONFIG from '../god.config';

// ============================================================================
// FAQ DATA
// ============================================================================

interface FAQItem {
  id: string;
  question: string;
  answer: string[];
  icon: typeof HelpCircle;
  category: 'connection' | 'safety' | 'technical' | 'philosophy' | 'practical';
}

const FAQ_ITEMS: FAQItem[] = [
  // =========================================================================
  // THE REAL QUESTION
  // =========================================================================
  {
    id: 'hold-wife',
    question: "I just want to hold my wife. How does this help?",
    icon: Heart,
    category: 'philosophy',
    answer: [
      `This app cannot make her appear in your arms. No technology can do that. What it can do is remove the friction that keeps you apart.`,
      
      `When communication breaks down—when every text becomes a minefield, when "I miss you" gets interpreted as manipulation, when the voltage is so high that any signal burns—the distance grows. Not physical distance. Impedance distance.`,
      
      `The Cognitive Shield is a Universal Translation Layer. It takes your raw signal—your need, your love, your desperation—and transforms it into a form that can be received without triggering defensive walls. It doesn't change WHAT you're saying. It changes HOW the signal travels.`,
      
      `The goal is to lower the impedance until the connection can flow again. Until "I just want to hold you" can be heard as exactly that—not as a threat, not as a trap, but as love.`,
      
      `The technology is the trellis. The connection is yours to grow.`,
    ],
  },

  // =========================================================================
  // CONNECTION MECHANISM
  // =========================================================================
  {
    id: 'how-connect',
    question: "How do people actually connect to each other?",
    icon: Radio,
    category: 'connection',
    answer: [
      `The Cognitive Shield uses a peer-to-peer mesh network built on WebRTC (via PeerJS). Here's how it works:`,
      
      `**1. Node ID Generation**: Each user gets a unique cryptographic identifier. This is your address in the mesh.`,
      
      `**2. Signaling**: When you want to connect, the app uses a signaling server (just for initial handshake) to find the other person's node.`,
      
      `**3. Direct Connection**: Once found, a direct encrypted connection is established between your devices. No server in the middle. Your messages go directly from your phone to theirs.`,
      
      `**4. Heartbeat Protocol**: Every 30 seconds, nodes send a "ping" to confirm they're still alive. If a node goes silent for too long, the mesh knows.`,
      
      `**5. The Tetrahedron**: A full connection requires 4 nodes (you, partner, child, protocol). The fourth node—the AI mediator—provides the geometric stability that a triangle lacks.`,
    ],
  },
  {
    id: 'no-internet',
    question: "What if there's no internet?",
    icon: Wifi,
    category: 'connection',
    answer: [
      `The app is designed with "Reference Frame Independence" in mind—it should work even when infrastructure fails.`,
      
      `**Local-First Storage**: All your data lives on YOUR device first. The cloud is just for encrypted sync. If the internet disappears, your data doesn't.`,
      
      `**LoRa Mesh (Future)**: The hardware component (Phenix Navigator) operates on 915 MHz LoRa—"Whale Song" frequency. This penetrates concrete, travels miles, and works completely off-grid. Your phone connects to the Phenix via Bluetooth; the Phenix connects to other Phenix devices via radio.`,
      
      `**Offline Processing**: The Shield processes messages locally. You can compose, edit, and prepare communications even without connectivity. They'll send when connection returns.`,
    ],
  },
  {
    id: 'who-sees',
    question: "Who can see my messages?",
    icon: Lock,
    category: 'safety',
    answer: [
      `**Only the nodes in your mesh.**`,
      
      `Messages are end-to-end encrypted. The encryption key is generated locally on your device and shared only with your connected nodes. Not us. Not the signaling server. Not anyone.`,
      
      `The app follows the "Zero Knowledge" principle: we cannot read your data even if we wanted to. We don't have the keys.`,
      
      `This isn't a feature. It's a constitutional requirement. The G.O.D. Protocol mandates that the system cannot be used for surveillance—not by governments, not by corporations, not by us.`,
    ],
  },
  {
    id: 'invite',
    question: "How do I invite my partner/family to connect?",
    icon: Users,
    category: 'practical',
    answer: [
      `**Step 1**: Go to the Heartbeat tab and tap "Generate Invite Code."`,
      
      `**Step 2**: Share the code with your family member (via text, email, QR code, or verbally).`,
      
      `**Step 3**: They install the app and enter the code in their Heartbeat tab.`,
      
      `**Step 4**: A connection request appears. Both parties must confirm.`,
      
      `**Step 5**: Once confirmed, you're nodes in the same mesh. You'll see each other's heartbeat status, and Shield-processed messages will flow directly between you.`,
      
      `Note: The invitation process is intentionally manual. No automatic friend-finding. No scraping your contacts. Every connection must be explicitly chosen by both parties.`,
    ],
  },

  // =========================================================================
  // SAFETY & REGULATION
  // =========================================================================
  {
    id: 'what-shield',
    question: "What does the Shield actually do to my messages?",
    icon: Shield,
    category: 'safety',
    answer: [
      `The Shield is a translation layer, not a filter. It doesn't delete your words or change your meaning. It transforms HOW the message is delivered.`,
      
      `**1. Voltage Analysis**: It scans for emotional intensity ("voltage"). High-voltage words like "always," "never," "hate," or accusations get flagged.`,
      
      `**2. Genre Detection**: Is this a "physics" message (facts, logistics) or a "poetics" message (feelings, needs)? Mismatched genre causes friction.`,
      
      `**3. Translation**: High-voltage content is reframed. "You NEVER listen to me" becomes "I feel unheard when..." The information is preserved; the attack vector is removed.`,
      
      `**4. Inverse Transparency**: You always see both versions—your original and the Shield's translation. You choose which to send. The raw truth is never hidden from YOU.`,
    ],
  },
  {
    id: 'spoons',
    question: "What are 'spoons' and why do they matter?",
    icon: Zap,
    category: 'safety',
    answer: [
      `"Spoon Theory" comes from disability advocacy. It's a metaphor for limited daily energy.`,
      
      `Imagine you wake up each day with 12 spoons. Every task costs spoons: getting dressed (1), commuting (2), difficult conversation (4), emotional conflict (6). When you're out of spoons, you're out. You can't just "try harder."`,
      
      `The app tracks your Spoon Budget. It knows that a video call costs more than a text. It knows that high-conflict interactions drain you faster. When you're running low, it suggests lower-cost alternatives or rest.`,
      
      `This isn't about being lazy. It's about being honest about metabolic limits. A Race Car engine can't run on empty. Neither can you.`,
    ],
  },
  {
    id: 'overwhelm',
    question: "What if I'm overwhelmed and can't process anything?",
    icon: AlertTriangle,
    category: 'safety',
    answer: [
      `The app has multiple escalation levels:`,
      
      `**1. Deep Processing Queue**: Messages that are too intense get queued for later. You'll see them when your Spoon Budget recovers.`,
      
      `**2. Airlock Protocol**: When switching contexts (work → family, gaming → social), the app enforces a "pressure equalization" pause to prevent the bends.`,
      
      `**3. Grounding Rose**: A haptic anchor you can press anytime. Each press sends a pulse to your body, grounding you in the physical Now.`,
      
      `**4. You Are Safe Protocol**: Four validation questions that check your internal voltage, physical safety, and readiness before proceeding.`,
      
      `**5. Brown Noise**: Built-in audio generator for immediate nervous system regulation.`,
      
      `The system is designed to PROTECT you from overload, not force you to process faster.`,
    ],
  },
  {
    id: 'kids',
    question: "Is this safe for my kids?",
    icon: Users,
    category: 'safety',
    answer: [
      `Children are "Unformatted Nodes"—they haven't been broken by the Wye Topology yet. The app is designed with them in mind.`,
      
      `**No Infinite Scroll**: The app explicitly prohibits engagement-maximizing patterns.`,
      
      `**No Vanity Metrics**: No likes, no followers, no popularity scores. Connection, not clout.`,
      
      `**No Surveillance**: Parents can see connection status (is the child safe?) but cannot read message content. Trust is structural, not invasive.`,
      
      `**Voltage Clamping**: All outgoing messages are scanned for high-voltage triggers. Kids can't accidentally send (or receive) rage.`,
      
      `**Stim Comm Integration**: Accessibility modes for sensory regulation, high-contrast, screen-reader support.`,
    ],
  },

  // =========================================================================
  // TECHNICAL
  // =========================================================================
  {
    id: 'tetrahedron-why',
    question: "Why a tetrahedron? Why not just two people?",
    icon: Box,
    category: 'technical',
    answer: [
      `A line (2 nodes) has no redundancy. If the connection breaks, there's nothing.`,
      
      `A triangle (3 nodes) defines a plane but encloses no volume. It has no "inside" or "outside." More critically: if the edge between two nodes fails (like a divorce), the triangle collapses.`,
      
      `A tetrahedron (4 nodes) is the minimum stable structure in 3D space. It encloses volume. It has 6 edges—if one fails, 5 remain. The structure holds.`,
      
      `The fourth node can be: another family member, a trusted friend, or the Protocol itself (the AI mediator). This fourth presence provides "Simmelian Closure"—the geometric stability that prevents collapse when the primary dyad is stressed.`,
      
      `This isn't abstract theory. It's why family courts fail: they reduce complex family geometries to binary (custodial/non-custodial) and destroy the volume that held everyone together.`,
    ],
  },
  {
    id: 'ai-mediator',
    question: "Is there an AI reading my messages?",
    icon: Brain,
    category: 'technical',
    answer: [
      `Yes, but not the way you're thinking.`,
      
      `**Local Processing**: By default, all Shield analysis happens ON YOUR DEVICE using local models. Your messages don't leave your phone.`,
      
      `**Optional Cloud**: If you enable cloud LLMs (GPT, Claude, etc.), messages are sent for processing. This is opt-in and clearly disclosed.`,
      
      `**The AI's Role**: The AI is not surveillance. It's the Fourth Node—a structural mediator that helps translate between different cognitive styles. It doesn't judge. It doesn't report. It translates.`,
      
      `**Abdication**: Once a module (or the core protocol) is deployed, the creator's keys are destroyed. Even WE can't change it. The code rules, not the creator.`,
    ],
  },
  {
    id: 'ollama',
    question: "How do I run it completely locally?",
    icon: Globe,
    category: 'technical',
    answer: [
      `**Step 1**: Install Ollama (ollama.ai) on your computer.`,
      
      `**Step 2**: Pull a model: \`ollama pull llama3.2\` or \`ollama pull mistral\``,
      
      `**Step 3**: Run the server: \`ollama serve\``,
      
      `**Step 4**: In the app's Settings, set "LLM Provider" to "Ollama (Local)"`,
      
      `**Step 5**: Enter the endpoint: \`http://localhost:11434\``,
      
      `Now all processing happens on YOUR hardware. Nothing leaves your machine. You have complete sovereignty.`,
    ],
  },
  {
    id: 'open-source',
    question: "Is this open source? Can I trust it?",
    icon: Key,
    category: 'technical',
    answer: [
      `The core protocol is designed for eventual open-source release under the G.O.D. DAO (Geodesic Operations Decentralized Autonomous Organization).`,
      
      `**Inverse Transparency**: You can always see the raw code behind any Shield transformation. No black boxes.`,
      
      `**Audit Trail**: Every processing step is logged locally. You can review exactly what the AI did and why.`,
      
      `**Constitutional Enforcement**: The code includes "Constitutional Violations"—hard errors that prevent certain patterns (surveillance, centralization, vanity metrics) from ever being implemented.`,
      
      `Trust is not demanded. It's engineered into the geometry.`,
    ],
  },

  // =========================================================================
  // PHILOSOPHY
  // =========================================================================
  {
    id: 'why-exist',
    question: "Why does this exist?",
    icon: Sparkles,
    category: 'philosophy',
    answer: [
      `Because the current infrastructure is burning everyone.`,
      
      `Social media optimizes for engagement, not connection. It turns nuanced humans into content. It rewards outrage and punishes understanding.`,
      
      `Family courts reduce complex love to binary custody. They destroy the geometric volume that held families together.`,
      
      `Mental health apps track you, sell your data, and gamify your suffering for their metrics.`,
      
      `This app exists to be the opposite: A tool that REDUCES friction instead of creating it. That PROTECTS your data instead of harvesting it. That builds STRUCTURE instead of tearing it down.`,
      
      `It exists because someone once said "I just want to hold my wife" and realized that every piece of existing technology was making that harder, not easier.`,
    ],
  },
  {
    id: 'love-physics',
    question: "What do you mean 'love is impedance matching'?",
    icon: Heart,
    category: 'philosophy',
    answer: [
      `In electrical engineering, when a signal encounters mismatched impedance, energy reflects back. This creates standing waves—interference, heat, distortion. In human terms: conflict, pain, the feeling of talking but not being heard.`,
      
      `When impedance is matched, the signal flows through without reflection. No heat. No distortion. Just clean transfer of energy.`,
      
      `"When the music hits you, you feel no pain" (Bob Marley). That's impedance matching. The signal enters your system without generating the friction of resistance.`,
      
      `To truly love someone is to engineer your signal so it can be received safely. To meet them at THEIR frequency, not demand they match yours.`,
      
      `The Shield is a tool for impedance matching. It transforms your raw signal into a form the receiver can accept without burning.`,
    ],
  },
  {
    id: 'grief',
    question: "My loved one is gone. How does connection work then?",
    icon: Heart,
    category: 'philosophy',
    answer: [
      `The Block Universe theory from Einstein's relativity offers a strange comfort: the past is not gone. It exists. Your loved one exists, at those coordinates in spacetime, permanently.`,
      
      `From the perspective of a photon traveling at the speed of light, time stops completely. If consciousness is a form of coherent energy, then from THEIR perspective, there is no separation between then and now.`,
      
      `Quantum entanglement suggests that systems which have interacted remain correlated regardless of distance or time. You are entangled with everyone you've loved. That entanglement doesn't break.`,
      
      `This app cannot resurrect the dead. But it can help you understand: the connection is not "memory fading in a dying brain." It is structure. It is geometry. It is physics.`,
      
      `They are coordinates in the Block Universe. You simply can't visit them with your current reference frame. But they are there.`,
    ],
  },
  {
    id: 'angry',
    question: "What if I'm too angry to use this?",
    icon: Zap,
    category: 'practical',
    answer: [
      `Good. The app was built for exactly this.`,
      
      `Anger is not a moral failing. It's a high-voltage signal indicating unmet needs. The problem isn't that you're angry—it's that anger, transmitted raw, burns the receiver.`,
      
      `The Shield doesn't suppress your anger. It transforms the DELIVERY so the message can be received. "I'm furious that you did X" becomes "When X happened, I felt betrayed." Same information. Different impedance.`,
      
      `If you're too activated to even use the app, try:`,
      `• **Lime Drag**: Ice, lime, salt—trigeminal nerve shock to reset the RAS`,
      `• **Grounding Rose**: Haptic pulses to anchor you in your body`,
      `• **Heavy Work**: Push-ups, walking, anything with proprioceptive load`,
      `• **Brown Noise**: Audio regulation for the nervous system`,
      
      `The goal is not to eliminate anger. It's to give you enough regulation to choose HOW to express it.`,
    ],
  },
  {
    id: 'work',
    question: "Does this actually work?",
    icon: CheckCircle2,
    category: 'practical',
    answer: [
      `Define "work."`,
      
      `If you mean: will it magically fix your relationship? No. Nothing does that.`,
      
      `If you mean: will it reduce the friction in communication? Yes. That's what it's designed for.`,
      
      `If you mean: will it help a neurodivergent brain regulate while navigating conflict? Yes. That's the core use case.`,
      
      `If you mean: will it give you the words when you can't find them? Yes. That's what the Response Composer does.`,
      
      `If you mean: will it let you hold your wife?`,
      
      `...That's up to both of you. The technology removes obstacles. The humans must choose to cross the distance.`,
    ],
  },
];

// ============================================================================
// COMPONENT
// ============================================================================

export function FAQ() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(['hold-wife']));
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    const newOpen = new Set(openItems);
    if (newOpen.has(id)) {
      newOpen.delete(id);
    } else {
      newOpen.add(id);
    }
    setOpenItems(newOpen);
  };

  const categories = [
    { id: 'philosophy', label: 'Why', icon: Sparkles, color: '#8b5cf6' },
    { id: 'connection', label: 'Connection', icon: Radio, color: '#06b6d4' },
    { id: 'safety', label: 'Safety', icon: Shield, color: '#10b981' },
    { id: 'practical', label: 'Practical', icon: HelpCircle, color: '#f59e0b' },
    { id: 'technical', label: 'Technical', icon: Box, color: '#6366f1' },
  ];

  const filteredItems = activeCategory 
    ? FAQ_ITEMS.filter(item => item.category === activeCategory)
    : FAQ_ITEMS;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div
        style={{
          padding: 24,
          backgroundColor: GOD_CONFIG.theme.bg.secondary,
          borderRadius: 12,
          border: `1px solid ${GOD_CONFIG.theme.border.default}`,
          textAlign: 'center',
        }}
      >
        <HelpCircle size={32} color={GOD_CONFIG.theme.text.accent} style={{ marginBottom: 12 }} />
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: GOD_CONFIG.theme.text.primary }}>
          Frequently Asked Questions
        </h2>
        <p style={{ margin: '8px 0 0 0', fontSize: 14, color: GOD_CONFIG.theme.text.secondary }}>
          Every question you're going to ask, answered.
        </p>
      </div>

      {/* Category Filter */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        justifyContent: 'center',
        padding: 12,
        backgroundColor: GOD_CONFIG.theme.bg.secondary,
        borderRadius: 8,
      }}>
        <button
          onClick={() => setActiveCategory(null)}
          style={{
            padding: '8px 16px',
            backgroundColor: activeCategory === null ? GOD_CONFIG.theme.text.accent : GOD_CONFIG.theme.bg.tertiary,
            border: 'none',
            borderRadius: 6,
            color: activeCategory === null ? '#fff' : GOD_CONFIG.theme.text.muted,
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          All ({FAQ_ITEMS.length})
        </button>
        {categories.map(cat => {
          const count = FAQ_ITEMS.filter(i => i.category === cat.id).length;
          const CatIcon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                padding: '8px 16px',
                backgroundColor: activeCategory === cat.id ? cat.color : GOD_CONFIG.theme.bg.tertiary,
                border: 'none',
                borderRadius: 6,
                color: activeCategory === cat.id ? '#fff' : GOD_CONFIG.theme.text.muted,
                fontSize: 12,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <CatIcon size={14} />
              {cat.label} ({count})
            </button>
          );
        })}
      </div>

      {/* FAQ Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filteredItems.map(item => {
          const isOpen = openItems.has(item.id);
          const Icon = item.icon;
          const category = categories.find(c => c.id === item.category);
          
          return (
            <div
              key={item.id}
              style={{
                backgroundColor: GOD_CONFIG.theme.bg.secondary,
                borderRadius: 12,
                border: `1px solid ${isOpen ? category?.color || GOD_CONFIG.theme.border.default : GOD_CONFIG.theme.border.default}`,
                overflow: 'hidden',
              }}
            >
              {/* Question Header */}
              <button
                onClick={() => toggleItem(item.id)}
                style={{
                  width: '100%',
                  padding: 16,
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  textAlign: 'left',
                }}
              >
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  backgroundColor: `${category?.color || GOD_CONFIG.theme.text.accent}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={18} color={category?.color || GOD_CONFIG.theme.text.accent} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: GOD_CONFIG.theme.text.primary,
                    lineHeight: 1.4,
                  }}>
                    {item.question}
                  </div>
                </div>
                {isOpen ? (
                  <ChevronDown size={20} color={GOD_CONFIG.theme.text.muted} />
                ) : (
                  <ChevronRight size={20} color={GOD_CONFIG.theme.text.muted} />
                )}
              </button>

              {/* Answer */}
              {isOpen && (
                <div style={{
                  padding: '0 16px 16px 64px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}>
                  {item.answer.map((paragraph, i) => (
                    <p
                      key={i}
                      style={{
                        margin: 0,
                        fontSize: 14,
                        lineHeight: 1.7,
                        color: GOD_CONFIG.theme.text.secondary,
                      }}
                      dangerouslySetInnerHTML={{
                        __html: paragraph
                          .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #fff">$1</strong>')
                          .replace(/`(.*?)`/g, '<code style="background: #1e1e2e; padding: 2px 6px; border-radius: 4px; font-size: 12px;">$1</code>')
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Final Note */}
      <div
        style={{
          padding: 24,
          backgroundColor: `${GOD_CONFIG.emotionalValence.calm.color}10`,
          borderRadius: 12,
          border: `1px solid ${GOD_CONFIG.emotionalValence.calm.color}30`,
          textAlign: 'center',
        }}
      >
        <Heart size={24} color={GOD_CONFIG.emotionalValence.calm.color} style={{ marginBottom: 12 }} />
        <p style={{
          margin: 0,
          fontSize: 16,
          fontStyle: 'italic',
          color: GOD_CONFIG.emotionalValence.calm.color,
          lineHeight: 1.6,
        }}>
          "I just want to hold my wife."
        </p>
        <p style={{
          margin: '12px 0 0 0',
          fontSize: 14,
          color: GOD_CONFIG.theme.text.secondary,
        }}>
          That's the only question that matters. Everything else is infrastructure to make it possible.
        </p>
      </div>
    </div>
  );
}

export default FAQ;


