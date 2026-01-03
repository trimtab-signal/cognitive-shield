# Cognitive Shield: Technical Architecture and Operations Manual

> *Generated with assistance from Gemini, based on the living codebase*
> 
> *"The Hub is offline. The Mesh is operational."*

---

## 1. Introduction: The Geodesic Imperative

### 1.1 Overview: The Universal Translation Layer

Cognitive Shield represents a fundamental paradigm shift in human-computer interaction (HCI) and interpersonal communication, specifically engineered for neurodivergent cognition. It is not merely a messaging application or a filter; it is a **Universal Translation Layer** designed to decouple the emotional velocity of incoming signals from the cognitive load required to process them. Built upon the G.O.D. Protocol (Geodesic Operations/Governance), the system operationalizes R. Buckminster Fuller's principles of synergetics and minimum structural systems to create a digital environment of "Harmonic Resonance."

In an era defined by the weaponization of information abundance and the extraction of attention capital, the neurodivergent mind often functions as a "canary in the coal mine," detecting signal volatility that neurotypical filters might ignore. The primary function of the Cognitive Shield is to act as an **impedance matching transformer** between the external world—characterized by chaotic, high-voltage emotional signals—and the internal state of the user. By interposing a processing layer governed by rigorous geometric and mathematical principles, the system allows neurodivergent individuals to navigate high-stakes communication without succumbing to "social proteopathy" (the toxic accumulation of misaligned social information) or "phase shift" collapse.

The application acts as a **sovereign digital territory**. It is strictly local-first and privacy-focused, utilizing on-device AI (Ollama) to ensure that the user's psychological data, emotional states, and private communications never leave their physical control. This "air-gapped" philosophy is not just a security feature; it is a psychological necessity, providing the "Topological Protection" required for the brain to maintain a "Mind Zone" free from external surveillance capitalism.

### 1.2 The Target User: Who is the Shield For?

While the architectural principles of the Geodesic Engine are universal, the specific tuning of the Cognitive Shield is optimized for profiles that experience standard communication protocols as hostile or draining.

- **The Neurodivergent Operator**: Specifically those with Autism Spectrum Disorder (ASD), ADHD, or sensory processing sensitivities. These individuals often face significant "cognitive overload" in standard interfaces due to a lack of customizable sensory gating. The Shield provides the "prosthetic filtering" that their biological systems may not automatically provide.

- **High-Sensitivity Processors (HSP)**: Individuals whose "Cognitive Behavioral Barrier" (CBB) requires reinforcement against rapid emotional decoherence. For these users, a "medium voltage" email can trigger a "fight, flight, or freeze" response (amygdala hijack) that derails productivity for hours. The Shield intervenes before this physiological cascade begins.

- **System Thinkers & Pattern Matchers**: Users who require structural predictability and explicit rule sets to navigate social nuance. The Shield converts implied social contracts into explicit "HumanOS" parameters, turning baffling emotional subtext into parseable data.

- **The Burned-Out Executive**: Professionals suffering from decision fatigue who need an "Augmented Executive" layer to triage information flows and preserve "strategic judgment".

### 1.3 Core Philosophy: Wye (Y) to Delta (Δ) Topology

The foundational philosophy of the Cognitive Shield is derived from electrical engineering transformations, specifically the **Wye-Delta (Y-Δ) transform**, applied metaphorically to social graph topology.

#### The Wye (Star) Topology: The Pathology of Centralization

Traditional communication often resembles a Wye connection (or Star topology). In this configuration, all stressors, signals, and demands converge on a single central point—the neutral node.

- **Electrical Analogy**: In a balanced three-phase system, the neutral point is stable. However, if the loads are unbalanced (as human emotions invariably are), the neutral point carries significant current.

- **Social Analogy**: The neurodivergent individual often acts as this "neutral point" in a family or work dynamic. They absorb the full volatility of the network. When the "social voltage" spikes (conflict, urgency, ambiguity), the central node experiences thermal overload, leading to burnout, shutdown, or what quantum consciousness theorists might call a "Massive Synchronous Global Phase Shift"—a total system collapse.

#### The Delta Topology: The Architecture of Stability

The Cognitive Shield transforms this topology into a **Delta (Δ) configuration**.

- **Electrical Analogy**: In a Delta system, loads are distributed across the phases (the edges of the triangle) rather than converging on a central point. There is no neutral line to overload. The "line voltage" is equal to the "phase voltage," but the "line current" is split, reducing the stress on any single component to 1/√3 (approximately 58%) of the original load.

- **The Solution**: The Shield distributes the cognitive load across a 4-node geometric structure (The Tetrahedron). No single node bears the full weight of the interaction. The user (Node A) is never directly connected to the stressor (Node B). The signal must pass through Context (Node C) and the AI Engine (Node D). This geometric buffering ensures that the emotional "current" is stepped down before it touches the user's perception.

> *"We do not need to change each other. We need to build the Universal Translation Layer that allows us to love each other across the impedance mismatch."*

---

## 2. Quick Start Guide

This section outlines the initialization sequence for the Cognitive Shield. As a local-first application, setup requires ensuring your "node" (computer) is prepared to host the Geodesic Engine.

### 2.1 Prerequisites & Installation

The Shield runs on a standard React/TypeScript stack but relies on a local LLM for its intelligence.

**System Requirements:**
- **OS**: macOS (Apple Silicon recommended for AI speed), Linux, or Windows (WSL2).
- **RAM**: Minimum 8GB, 16GB+ recommended for smooth 8-bit quantization of Llama-3.
- **Storage**: ~10GB free space for model weights and vector logs.

**Step 1: Clone and Install**

```bash
# Clone the repository
git clone https://github.com/trimtab-signal/cognitive-shield.git

# Navigate to the directory
cd cognitive-shield

# Install Node dependencies
npm install
```

**Step 2: Initialize Environment**

Create a `.env.local` file:

```bash
# Allow local browser access to the AI API
OLLAMA_ORIGINS="http://localhost:3000"

# Enable Vibe Coding module (Creator Mode)
VIBE_CODER_ENABLED=true

# Set default resonance target (Mark 1 Attractor)
HARMONIC_TARGET=0.35
```

### 2.2 Setting Up Ollama (The Geodesic Engine)

The "brain" of Node D is Ollama, a tool for running LLMs locally.

1. **Download Ollama**: Visit [ollama.com](https://ollama.com) or run:
   ```bash
   curl -fsSL https://ollama.com/install.sh | sh
   ```

2. **Pull the Core Model**:
   ```bash
   ollama pull llama3
   ```

3. **Start the Engine**:
   ```bash
   ollama serve
   ```

### 2.3 First Run: The Pre-Launch Sequence

1. **Launch the Interface**:
   ```bash
   npm run dev
   ```

2. **Navigate**: Open your browser to `http://localhost:3000`

3. **Calibration**: Complete the PreLaunchSequence:
   - Step A: "Check Geometry" - Verify 3D Tetrahedron rendering
   - Step B: "Ping Geodesic Engine" - Test Ollama connection
   - Step C: "Baseline Somatics" - Breathe with the visual guide

Once all checks pass: **"The Hub is offline. The Mesh is operational."**

---

## 3. User Guide: Operations

### 3.1 The Daily Heartbeat Check-in

Before processing any external signals, calibrate your internal node (Node A).

1. **The Interface**: The HeartbeatPanel presents a slider (0-100%)
2. **The Assessment**: Reflect on your "Spoons" (metabolic energy)
3. **System Adaptation**:
   - **> 80% (Green)**: Systems Nominal - Full capability
   - **50-80% (Yellow)**: Conservation Mode - Reduced animations
   - **25-50% (Orange)**: Defensive Mode - Expanded buffer
   - **< 25% (Red)**: Deep Processing Lock - Input disabled

### 3.2 Processing Messages: The Shield Workflow

1. **Ingestion**: Raw text enters via MessageInput
2. **Interception**: CatchersMitt buffers while Node D analyzes
3. **Analysis**: Voltage (0-10), Spoon Cost, HumanOS profile
4. **Presentation**: Safe messages display; high-voltage shows warning
5. **Translation**: Strips accusatory tone, presents information neutrally

### 3.3 Somatic Regulation Tools

- **Lime Drag**: Trigeminal nerve reset via sensory input
- **Grounding Rose**: 5-4-3-2-1 technique with 4-7-8 breathing
- **Heavy Work Tracker**: Log proprioceptive activities to restore Spoons

### 3.4 Creating Modules: The Vibe Coder

1. Open ModuleMaker
2. Describe your intent in natural language
3. Generate code via local LLM
4. Abdicate when stable (lock the module)

---

## 4. Architecture Reference

### 4.1 Component Hierarchy

```
App.tsx
├── GeodesicManifesto.tsx       // The Constitution
├── HeartbeatPanel.tsx          // Node A Controller
└── TetrahedronProtocol.tsx     // The 3D Layout
    ├── NodeA (You)
    │   ├── SomaticRegulation.tsx
    │   └── YouAreSafe.tsx
    ├── NodeB (Them)
    │   ├── MessageInput.tsx
    │   └── CatchersMitt.tsx
    ├── NodeC (Context)
    │   └── CalibrationReport.tsx
    └── NodeD (AI)
        ├── GeodesicEngine.ts
        └── ResponseComposer.tsx
```

### 4.2 State Management (Zustand Stores)

**shield.store.ts** - Central nervous system:
- `rawMessage`, `voltage`, `curvature`, `processedPayload`, `humanOS`

**heartbeat.store.ts** - Biological monitor:
- `currentSpoons`, `heartbeatStatus`, `deepProcessingLock`

**module.store.ts** - Extension registry:
- `activeModules`, `abdicatedModules`

### 4.3 Data Flow

```
Raw Input → shield.store → GeodesicEngine → Ollama → Analysis → CatchersMitt
```

---

## 5. Configuration Reference

### 5.1 god.config.ts

```typescript
export const GodConfig = {
  theme: {
    mode: 'system',
    contrast: 'high',
    primaryColor: '#00B4D8',
    dangerColor: '#FF6B6B',
  },
  geometry: {
    resonanceTarget: 0.35,
    maxVoltage: 10,
    nodes: 4,
  },
  metabolism: {
    maxSpoons: 12,
    costs: {
      readLowVoltage: 0.5,
      readHighVoltage: 2,
      replySimple: 1,
      replyComplex: 3,
      contextSwitch: 1.5,
    },
  },
  gating: {
    autoQueueVoltage: 7,
    heartbeatLockout: 25,
  },
  ai: {
    defaultModel: 'llama3',
    temperature: 0.3,
  }
};
```

---

## 6. Mathematical Foundation

### 6.1 The Tetrahedron Protocol

The tetrahedron is the "minimum structural system" - four nodes required to enclose volume and maintain structural integrity.

### 6.2 SIC-POVM Symmetry

Ensures unbiased translation with equal overlap (1/3) between:
- User's interpretation
- Sender's intent  
- AI's analysis

### 6.3 Harmonic Resonance (0.35 Attractor)

Target stability coefficient:
- **< 0.2**: Passivity, over-smoothing
- **> 0.5**: Aggression, high entropy
- **≈ 0.35**: Balanced, regulated

### 6.4 Ollivier-Ricci Curvature

- **Positive (+)**: Echo chamber (over-smoothing)
- **Negative (-)**: Bottleneck (over-squashing)

### 6.5 Spoon Theory

```
Cost = (Voltage × Complexity) + ContextSwitchPenalty
```

---

## 7. Module Development Guide

### 7.1 Vibe Coding Workflow

1. Describe in natural language
2. LLM generates React code
3. Hot load into runtime
4. Refine via conversation

### 7.2 Harmonic Linter Rules

- Aesthetic consistency with theme
- No infinite loops
- ARIA accessibility labels required

### 7.3 The Abdication Process

1. **Creator Mode**: Full write access
2. **Stabilization**: 7 days without edits
3. **Abdication**: Code becomes read-only infrastructure

---

## 8. Troubleshooting

### 8.1 Ollama Connection Issues

```bash
# Verify running
curl http://localhost:11434

# Fix CORS
OLLAMA_ORIGINS="*" ollama serve
```

### 8.2 Build Errors

```bash
# Heap overflow
export NODE_OPTIONS="--max-old-space-size=4096"
```

### 8.3 "Brain Rot" Loop

The Inertia Breaker triggers a Pattern Interrupt after 15 minutes without message processing.

---

## 9. Glossary

| Term | Definition |
|------|------------|
| **Abdication Principle** | Voluntarily surrendering admin control to code/geometry |
| **Catcher's Mitt** | Input buffer preventing immediate emotional impact |
| **Deep Processing Queue** | Secure storage for high-voltage messages |
| **Geodesic Engine** | AI processing layer (Node D) |
| **Harmonic Resonance** | Target stability ratio (0.35) |
| **HumanOS** | Communication style taxonomy |
| **Impedance Matching** | Making incompatible systems compatible |
| **Lime Drag** | Trigeminal nerve reset tool |
| **Ollivier-Ricci Curvature** | Graph "flatness" metric |
| **SIC-POVM** | Unbiased measurement standard |
| **Spoon Theory** | Metabolic resource framework |
| **Tetrahedron Protocol** | 4-node geometric architecture |
| **Trimtab Signal** | High-leverage steering signal |
| **Vibe Coding** | AI-assisted natural language development |

---

> *"The geometry is the leader. The code rules. The G.O.D. DAO is active."*

