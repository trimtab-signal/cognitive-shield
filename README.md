# 🛡️ Cognitive Shield

**The Universal Translation Layer for Cognitive Resonance**

> "We do not need to change each other. We need to build the Universal Translation Layer that allows us to love each other across the impedance mismatch."

---

## 🎯 What Is This?

Cognitive Shield is a communication tool designed for **neurodivergent minds** navigating high-conflict situations. It transforms high-voltage emotional signals into forms that can be received without burning the receiver.

**Core Philosophy:**
- 🔺 **Delta Topology** - Peer-to-peer mesh, no central authority
- ⚡ **Voltage Regulation** - Transform accusations into needs
- 🥄 **Spoon Budgeting** - Respect metabolic limits
- 🎯 **0.35 Attractor** - Balance between order and chaos

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/your-repo/cognitive-shield.git
cd cognitive-shield

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 📱 Features Overview

### Core Shield
| Feature | Description |
|---------|-------------|
| **Message Processing** | Analyzes incoming text for voltage, genre, and emotional valence |
| **Voltage Gauge** | Visual indicator of emotional intensity (1-10 scale) |
| **Genre Detection** | Identifies "Physics" (facts) vs "Poetics" (feelings) |
| **Response Composer** | AI-assisted response generation with tone control |
| **Deep Processing Queue** | High-voltage messages held for later processing |

### Safety Protocols
| Feature | Description |
|---------|-------------|
| **You Are Safe** | 4-node validation protocol before high-stakes communication |
| **Grounding Rose** | Haptic anchor - press to ground in physical Now |
| **Lime Drag** | Trigeminal nerve activation (ice + lime + salt) |
| **Airlock Protocol** | Context-switching pressure equalization |
| **Brown Noise** | Built-in audio generator for nervous system regulation |

### Somatic Regulation
| Feature | Description |
|---------|-------------|
| **RAS Monitor** | Reticular Activating System arousal display |
| **Sensory Stacking** | Audio + Visual + Chewing combination tracker |
| **Heavy Work Tracker** | Log physical regulation activities |
| **Sensory Void Detection** | Automatic gap detection with suggestions |

### Network & Connection
| Feature | Description |
|---------|-------------|
| **Heartbeat Mesh** | PeerJS-based peer-to-peer connection |
| **Tetrahedron Protocol** | 4-node geometry for structural stability |
| **First Light Verification** | Initial connection validation |
| **Mesh Maintenance** | Edge health monitoring |

### Mathematics Dashboard
| Feature | Description |
|---------|-------------|
| **Harmonic Resonance** | H = V/(V+E) targeting 0.35 |
| **SIC-POVM Verification** | Quantum state overlap validation |
| **Density Matrix** | ρ = Σ(3pₖ - ½)Πₖ reconstruction |
| **Ollivier-Ricci Curvature** | κ for network topology health |
| **Spoon Cost Calculator** | Metabolic budget analysis |
| **Impedance Matching** | Γ = (Z_L - Z_0)/(Z_L + Z_0) for "love" |

### Module System
| Feature | Description |
|---------|-------------|
| **Module Maker** | Vibe Coding interface for creating extensions |
| **Harmonic Linter** | Validates code against 0.35 attractor |
| **Module Manager** | Enable/disable/uninstall modules |
| **Abdication Ceremony** | Destroy update keys (trustless deployment) |

---

## 🧭 Tab Navigation Guide

Each tab displays a **computed status symbol** based on real system state:

| Tab | Symbol | Meaning |
|-----|--------|---------|
| Shield | `Σn` | Sum of processed messages |
| Compose | `Δ`/`○` | Draft pending / Ready |
| Safe | `♥` | Heartbeat (pulses) |
| Heartbeat | `κn` | Curvature + nodes |
| Tetrahedron | `△%` | Symmetry score |
| Maintenance | `Ω` | Impedance |
| Somatic | `μn` | RAS arousal level |
| Math | `∞` | Live computation |
| Modules | `Σn/n` | Enabled/Total |
| Manifesto | `⏚` | Grounded |

---

## 🔧 Configuration

All configuration lives in `src/god.config.ts`:

```typescript
import GOD_CONFIG from './god.config';

// Access theme colors
GOD_CONFIG.theme.bg.primary    // Background
GOD_CONFIG.theme.text.accent   // Accent color

// Access voltage thresholds
GOD_CONFIG.voltage.low.max     // 3
GOD_CONFIG.voltage.medium.max  // 6
GOD_CONFIG.voltage.high.max    // 10

// Access typography
GOD_CONFIG.typography.fontFamily.display  // 'JetBrains Mono'
```

---

## 🤖 LLM Integration

### Option 1: Local (Ollama)
```bash
# Install Ollama
# https://ollama.ai

# Pull a model
ollama pull llama3.2

# Start server
ollama serve

# Configure in app: Settings → LLM Provider → Ollama
# Endpoint: http://localhost:11434
```

### Option 2: Cloud (OpenAI/Anthropic/Google)
1. Go to Settings tab
2. Select provider (OpenAI, Anthropic, or Gemini)
3. Enter your API key
4. Select model

---

## 📐 The Mathematics

### Harmonic Resonance (0.35 Attractor)
```
H = V_Halstead / (V_Halstead + E_Shannon)

Where:
- V_Halstead = (N1 + N2) × log₂(n1 + n2)  [Code complexity]
- E_Shannon = -Σ p(x) × log₂(p(x))        [Entropy]

Target: H ≈ 0.35 (Edge of Chaos)
- H > 0.40 = Stasis (too rigid)
- H < 0.30 = Chaos (too unstructured)
```

### Ollivier-Ricci Curvature
```
κ(x,y) = 1 - W₁(μₓ, μᵧ) / d(x,y)

- κ > 0: Convergent (trust/gravity well)
- κ < 0: Divergent (entropy spike)
- κ ≈ 0: Neutral
```

### Love as Impedance Matching
```
Γ = (Z_L - Z_0) / (Z_L + Z_0)

- Γ = 0: Perfect match (resonance/love)
- Γ = 1: Total mismatch (reflection/conflict)

Power transferred = 1 - Γ²
```

---

## 🏗️ Architecture

```
cognitive-shield/
├── src/
│   ├── components/          # React components
│   │   ├── MessageInput.tsx       # Text input with batching
│   │   ├── ProcessedPayloadCard.tsx # Message display
│   │   ├── VoltageGauge.tsx       # Visual voltage meter
│   │   ├── ResponseComposer.tsx   # AI response generation
│   │   ├── YouAreSafe.tsx         # Safety protocol
│   │   ├── SomaticRegulation.tsx  # Race Car Brain toolkit
│   │   ├── MathematicsDashboard.tsx # Live equations
│   │   ├── TheStory.tsx           # Narrative chapters
│   │   ├── FAQ.tsx                # Q&A
│   │   └── ...
│   ├── lib/                 # Core logic
│   │   ├── shield.ts             # Message processing
│   │   ├── llm.ts                # LLM integration
│   │   ├── tetrahedron-math.ts   # Quantum geometry
│   │   ├── harmonic-linter.ts    # Code analysis
│   │   ├── tab-status.ts         # Dynamic status computation
│   │   └── ...
│   ├── store/               # Zustand state management
│   │   ├── shield.store.ts       # Message state
│   │   └── module.store.ts       # Module state
│   ├── types/               # TypeScript definitions
│   └── god.config.ts        # Central configuration
├── public/
└── package.json
```

---

## 🎨 Design Philosophy

### No Dark Patterns
- ❌ No infinite scroll
- ❌ No vanity metrics (likes, followers)
- ❌ No engagement optimization
- ❌ No data harvesting

### Accessibility First
- ✅ High contrast mode support
- ✅ Reduced motion support
- ✅ Screen reader compatible
- ✅ Haptic feedback

### Privacy by Design
- ✅ Local-first data storage
- ✅ End-to-end encryption
- ✅ Zero knowledge architecture
- ✅ No analytics trackers

---

## 📖 The Story

This app is dedicated to:

**Robert James Katen** (1920–2009) - The Grandfather Clock  
**Margie Fay Katen** (1925–2025) - The Cuckoo Clock

Read the full story in the "The Story" tab.

---

## 🔑 Key Concepts

### Spoon Theory
Limited daily energy. Every task costs "spoons." When you're out, you're out.

### The Tetrahedron
Minimum stable 3D structure. 4 nodes, 6 edges. If one edge fails, 5 remain.

### Floating Neutral
When the central hub loses ground, voltage fluctuates wildly. The mesh prevents this.

### Impedance Matching
Love = engineering your signal so it can be received without burning.

---

## 📜 License

Built under the G.O.D. Protocol (Geodesic Operations Decentralized)

**Core Principles:**
1. The code rules, not the creator
2. No backdoors, no super-admin
3. Privacy over engagement
4. Resilience over convenience

---

## 🙏 Acknowledgments

- Buckminster Fuller (Synergetics, Trim Tab)
- Christine Miserandino (Spoon Theory)
- The neurodivergent community
- Everyone building tools for connection instead of extraction

---

**Status: GREEN BOARD**  
**Frequency: RESONANT**  
**Connection: ETERNAL**

*"In the Woodshop, building the future, with the headphones on."*
