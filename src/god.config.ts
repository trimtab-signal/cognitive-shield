/**
 * G.O.D. PROTOCOL CONFIGURATION
 * The Cognitive Shield - Impedance Matching for Human Communication
 * 
 * All values are centralized here. Never hardcode colors, text, or settings.
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * NOTE FOR CONCERNED PARTIES READING THIS FILE:
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * "G.O.D." stands for "Geodesic Operations Decentralized"
 * It's a Buckminster Fuller reference, not blasphemy.
 * Fuller was a famous architect/inventor who died in 1983.
 * His work is taught at MIT. Google "geodesic dome."
 * 
 * The "protocol" is just a React configuration object.
 * It's like the settings.json in VS Code.
 * Not a religious text. Not a manifesto. Not a spell book.
 * 
 * If you're using this file as evidence in court:
 * Please also submit the package.json as Exhibit B.
 * And node_modules as Exhibit C (warning: 847MB of "evidence").
 * 
 * For actual concerning content, may I suggest Twitter?
 * ═══════════════════════════════════════════════════════════════════════════
 */

export const GOD_CONFIG = {
  // === IDENTITY ===
  name: 'Cognitive Shield',
  version: '1.0.0',
  buildTimestamp: new Date().toISOString(),
  tagline: 'The Universal Translation Layer',
  // === FOUNDING NODES (The Ancestors) ===
  foundingNodes: {
    marge: { 
      name: 'Marge', 
      born: '1925-11-22', 
      departed: '2025-07-19',
      role: 'Founding Node Alpha',
      archetype: 'The Vibrant Spirit',
      phenotype: 'Externalizer',
      symbol: 'Cuckoo Clock', // Episodic Time, Event-Driven, Whimsy
      legacy: 'Riveter, Crocheter, Kinetic Flow',
    },
    bob: { 
      name: 'Bob', 
      born: '1920-06-09', 
      departed: '2009',
      role: 'Founding Node Omega',
      archetype: 'The Quiet Builder',
      phenotype: 'Internalizer',
      symbol: 'Grandfather Clock', // Linear Time, Structure, Block Universe
      legacy: 'Builder, Craftsman, The Woodshop',
    },
  },
  // === RESONANCE STATUS ===
  mission: 'CONTINUING',
  status: 'GREEN BOARD',
  frequency: 'RESONANT',
  connection: 'ETERNAL',
  
  // === ABDICATION STATUS ===
  abdicated: true,
  abdicationDate: '2026-01-02',
  abdicationCommit: 'a5d9085', // 🕊️ Abdication Complete - January 2, 2026

  // === TETRAHEDRON PROTOCOL ===
  // (Full config defined below after other sections)

  // === OLLAMA (LOCAL-FIRST PROCESSING) ===
  ollama: {
    defaultEndpoint: 'http://localhost:11434',
    defaultModel: 'llama3.2',
    recommendedModels: [
      { id: 'llama3.2', name: 'Llama 3.2 (8B)', description: 'Fast, good quality' },
      { id: 'llama3.1', name: 'Llama 3.1 (8B)', description: 'Stable, reliable' },
      { id: 'mistral', name: 'Mistral (7B)', description: 'Efficient, sharp' },
      { id: 'mixtral', name: 'Mixtral (8x7B)', description: 'Powerful, slower' },
      { id: 'phi3', name: 'Phi-3 (3.8B)', description: 'Tiny, fast' },
      { id: 'gemma2', name: 'Gemma 2 (9B)', description: 'Google, balanced' },
      { id: 'qwen2.5', name: 'Qwen 2.5 (7B)', description: 'Strong reasoning' },
      { id: 'deepseek-r1', name: 'DeepSeek R1', description: 'Advanced reasoning' },
    ],
    timeout: 60_000, // 60s timeout for local models
  },

  // === HUMAN OS DEFINITIONS ===
  humanOS: {
    guardian: {
      id: 'guardian',
      name: 'The Guardian',
      vMeme: 'Purple/Blue',
      coreImperative: 'Safety, Tradition, Order, Tribe',
      impedance: 'High resistance to Change and Ambiguity',
      color: '#6366f1', // Indigo
      icon: '🛡️',
    },
    order: {
      id: 'order',
      name: 'The Order',
      vMeme: 'Blue',
      coreImperative: 'Discipline, Truth, Hierarchy, Right/Wrong',
      impedance: 'High resistance to Emotion and Subjectivity',
      color: '#0ea5e9', // Sky
      icon: '⚖️',
    },
    achiever: {
      id: 'achiever',
      name: 'The Achiever',
      vMeme: 'Orange',
      coreImperative: 'Success, Autonomy, Growth, Results',
      impedance: 'High resistance to Process and Connection for its own sake',
      color: '#f97316', // Orange
      icon: '🎯',
    },
    empath: {
      id: 'empath',
      name: 'The Empath',
      vMeme: 'Green',
      coreImperative: 'Harmony, Inclusion, Equality, Consensus',
      impedance: 'High resistance to Hierarchy and Cold Logic',
      color: '#22c55e', // Green
      icon: '💚',
    },
    integrator: {
      id: 'integrator',
      name: 'The Integrator',
      vMeme: 'Yellow',
      coreImperative: 'Systemic Health, Flexibility, Paradox',
      impedance: 'Over-complication; fails to simplify for other OS types',
      color: '#eab308', // Yellow
      icon: '🔮',
    },
  } as const,

  // === VOLTAGE LEVELS ===
  voltage: {
    low: { label: 'Low', color: '#22c55e', threshold: 0.33 },
    medium: { label: 'Medium', color: '#eab308', threshold: 0.66 },
    high: { label: 'High', color: '#ef4444', threshold: 1.0 },
  } as const,

  // === PLUTCHIK EMOTIONAL VALENCE (Color Mapping) ===
  emotionalValence: {
    calm: { label: 'Calm', color: '#B3C7F7', description: 'Low arousal, trust' },
    affection: { label: 'Affection', color: '#00BF7D', description: 'Positive, harmony' },
    anxiety: { label: 'Anxiety', color: '#F57600', description: 'High arousal, alert' },
    hostility: { label: 'Hostility', color: '#5D82A2', description: 'Negative, cool conflict' },
    joy: { label: 'Joy', color: '#FFD700', description: 'High positive arousal' },
    sadness: { label: 'Sadness', color: '#6B7B8C', description: 'Low energy, grief' },
  } as const,

  // === SPOONS (Cognitive Energy Budget) ===
  spoons: {
    max: 12, // Daily budget
    costs: {
      lowComplexity: 1,
      mediumComplexity: 2,
      highComplexity: 3,
      emotionalLabor: 2,
      conflictResolution: 4,
      masking: 3,
    },
    thresholds: {
      healthy: 8,
      caution: 4,
      critical: 2,
    },
  } as const,

  // === YOU ARE SAFE - TETRAHEDRON NODES ===
  // The 4 validation categories mirror the 4 nodes of the Tetrahedron
  youAreSafe: {
    nodes: {
      amygdala: {
        id: 'amygdala',
        name: 'Amygdala Hijack / RSD',
        icon: '🧠',
        color: '#ef4444',
        validation: "This is your brain's alarm system being hyper-vigilant. You are not broken; you are protecting your attachment system. The rejection you feel is a misfire of ancient circuitry designed to keep you in the tribe.",
        somatic: "Inhale for 4 seconds, hold for 4, exhale for 8. This signals safety to the vagus nerve and activates the parasympathetic system. You are grounding the electrical storm.",
        physics: "Your nervous system detected a threat signal. The amygdala fired before the prefrontal cortex could evaluate. This is hardware, not character.",
      },
      sensory: {
        id: 'sensory',
        name: 'Sensory Overload',
        icon: '⚡',
        color: '#f97316',
        validation: "The environment is high-voltage. Your reaction is a natural response to an agitated nervous system, not a character flaw. Your transducer is calibrated differently, and that is valid physics.",
        somatic: "Go to your identified calm place. Tense and relax your muscles progressively to ground the bio-electrical energy. Consider noise-canceling headphones or a weighted blanket.",
        physics: "Sensory channels are saturated. Input exceeds processing bandwidth. This is an engineering limit, not a moral failing.",
      },
      communication: {
        id: 'communication',
        name: 'Communication Friction',
        icon: '📡',
        color: '#0ea5e9',
        validation: "A Genre Error has been detected. You are speaking Physics; the sender is speaking Poetics. The disconnect is bidirectional—the Double Empathy Problem. Neither party is 'wrong.'",
        somatic: "Take a 20-minute processing break. Silence is not abandonment; it is insulation. You are creating the Vacuum of Time needed for System 2 thinking.",
        physics: "Cognitive Impedance Mismatch detected. The Kernel of truth was rejected because the Driver was incompatible. This is a protocol error, not a personal attack.",
      },
      burnout: {
        id: 'burnout',
        name: 'Burnout / Metabolic Depletion',
        icon: '🔋',
        color: '#8b5cf6',
        validation: "You are experiencing metabolic depletion from masking. You have permission to stop performing and rest. You are not lazy; you are in energy debt from navigating a world not built for your transducer calibration.",
        somatic: "Lower the bar on purpose. Simplify one area of life (meals, housework) to allow for a restorative reset. Unmasking is medicine, not failure.",
        physics: "Spoon reserves depleted. Continuing at current output will cause thermal runaway. Rest is a maintenance requirement, not a character flaw.",
      },
    },
    coreReassurance: {
      grounding: "Right now, your only job is to exist. The Cognitive Shield is handling the external voltage. You are safe to breathe.",
      metabolic: "You are not lazy. You are in metabolic debt from navigating a world that was not built for your transducer calibration. Rest is a maintenance requirement.",
      communication: "A disconnect occurred because the codecs were mismatched. It is a bidirectional cross-cultural impasse. You do not need to 'fix' yourself to be understood.",
      present: "The past cannot hurt you right now. The future has not happened. In this moment, you are safe. The Shield is active.",
    },
    breathingExercises: {
      box: { name: 'Box Breathing', pattern: [4, 4, 4, 4], description: 'Inhale 4s → Hold 4s → Exhale 4s → Hold 4s' },
      calm: { name: 'Calming Breath', pattern: [4, 7, 8], description: 'Inhale 4s → Hold 7s → Exhale 8s (Vagal activation)' },
      grounding: { name: '5-4-3-2-1', pattern: [5, 4, 3, 2, 1], description: '5 things you see, 4 hear, 3 touch, 2 smell, 1 taste' },
    },
  } as const,

  // === SENSORY SAFETY SETTINGS ===
  sensorySafety: {
    reducedMotion: false,
    quietMode: false,
    highContrast: false,
    fontSize: 'normal', // 'small' | 'normal' | 'large'
  },

  // === HEARTBEAT PROTOCOL ===
  heartbeat: {
    statuses: {
      green: {
        id: 'green',
        label: 'Safe',
        color: '#22c55e',
        icon: '💚',
        meaning: 'Safe, grounded',
        autoEscalate: false,
      },
      yellow: {
        id: 'yellow',
        label: 'Caution',
        color: '#eab308',
        icon: '💛',
        meaning: 'Caution, stressed',
        autoEscalate: false,
      },
      orange: {
        id: 'orange',
        label: 'Need Support',
        color: '#f97316',
        icon: '🧡',
        meaning: 'Need support',
        autoEscalate: true,
        escalateAfterMissed: 2,
      },
      red: {
        id: 'red',
        label: 'SOS',
        color: '#ef4444',
        icon: '🆘',
        meaning: 'SOS / Emergency',
        autoEscalate: true,
        escalateAfterMissed: 0, // Immediately
      },
    },
    checkInIntervals: [
      { id: '15min', label: '15 minutes', ms: 15 * 60 * 1000 },
      { id: '30min', label: '30 minutes', ms: 30 * 60 * 1000 },
      { id: '1hr', label: '1 hour', ms: 60 * 60 * 1000 },
      { id: '2hr', label: '2 hours', ms: 2 * 60 * 60 * 1000 },
      { id: '4hr', label: '4 hours', ms: 4 * 60 * 60 * 1000 },
      { id: 'off', label: 'Off', ms: 0 },
    ],
    defaultInterval: '1hr',
    escalationThresholds: {
      firstMiss: 1, // Local alert only
      secondMiss: 2, // Broadcast to mesh
      thirdMiss: 3, // Trigger webhook
    },
    peerReconnectDelay: 5000, // 5 seconds
    statusBroadcastInterval: 30000, // 30 seconds
  } as const,

  // === TETRAHEDRON PROTOCOL ===
  tetrahedron: {
    batchingWindowMs: 60_000, // 60-second Catcher's Mitt
    maxBatchSize: 10,
    nodeCount: 4, // Immutable: A, B, Context, AI
    vacuumOfTimeMs: 3000, // 3-second mandatory delay (System 1 → System 2)
    visualization: {
      sphereRadius: 2,
      nodeSize: 0.15,
      edgeWidth: 0.02,
      colors: {
        stable: '#B3C7F7', // Soft Blue - ontological security
        convergent: '#00BF7D', // Muted Teal - resonance
        divergent: '#F57600', // Alert Orange - entropy spike
        neutral: '#71717a', // Muted gray
      },
      glowIntensity: {
        stable: 0.3,
        convergent: 0.5,
        divergent: 0.8, // High glow for alerts
        neutral: 0.1,
      },
    },
    sicPOVM: {
      dimension: 2, // d=2 for qubit space
      overlapCondition: 1 / 3, // |⟨ψ_j|ψ_k⟩|² = 1/(d+1)
    },
    curvature: {
      threshold: 0.1, // Threshold for convergent/divergent determination
      updateInterval: 1000, // Update every second
    },
  } as const,

  // === DAILY CHECK-IN (π-METRIC SCORING) ===
  dailyCheckIn: {
    questions: [
      // Energy & Spoons
      {
        id: 'spoons',
        category: 'energy',
        label: 'Current Spoon Level',
        description: 'How many spoons do you have left today? (0 = depleted, 12 = full)',
        min: 0,
        max: 12,
        type: 'slider',
      },
      {
        id: 'energy_baseline',
        category: 'energy',
        label: 'Energy vs Baseline',
        description: 'How does your energy compare to your usual baseline?',
        min: 0,
        max: 10,
        type: 'slider',
      },
      {
        id: 'masking_effort',
        category: 'energy',
        label: 'Masking Effort Today',
        description: 'How much effort did you spend masking/pretending to be neurotypical?',
        min: 0,
        max: 10,
        type: 'slider',
      },
      // Sensory State
      {
        id: 'sensory_overload',
        category: 'sensory',
        label: 'Sensory Overload Level',
        description: 'How overwhelmed are your senses right now?',
        min: 0,
        max: 10,
        type: 'slider',
      },
      {
        id: 'environment_comfort',
        category: 'sensory',
        label: 'Environmental Comfort',
        description: 'How comfortable is your physical environment?',
        min: 0,
        max: 10,
        type: 'slider',
      },
      {
        id: 'stim_regulation',
        category: 'sensory',
        label: 'Stim Regulation Needs',
        description: 'How much do you need stimming/movement to regulate?',
        min: 0,
        max: 10,
        type: 'slider',
      },
      // Emotional State
      {
        id: 'mood',
        category: 'emotional',
        label: 'Overall Mood',
        description: 'How would you rate your overall mood?',
        min: 1,
        max: 10,
        type: 'slider',
      },
      {
        id: 'stress',
        category: 'emotional',
        label: 'Stress Level',
        description: 'How stressed do you feel?',
        min: 0,
        max: 10,
        type: 'slider',
      },
      {
        id: 'rsd_triggers',
        category: 'emotional',
        label: 'RSD Triggers Encountered',
        description: 'How many rejection-sensitive triggers did you experience?',
        min: 0,
        max: 10,
        type: 'slider',
      },
      // Social & Communication
      {
        id: 'social_cost',
        category: 'social',
        label: 'Social Interaction Energy Cost',
        description: 'How draining were social interactions today?',
        min: 0,
        max: 10,
        type: 'slider',
      },
      {
        id: 'communication_friction',
        category: 'social',
        label: 'Communication Friction',
        description: 'How much friction did you experience in communication?',
        min: 0,
        max: 10,
        type: 'slider',
      },
      {
        id: 'need_quiet',
        category: 'social',
        label: 'Need for Quiet/Space',
        description: 'How much do you need quiet time or space right now?',
        min: 0,
        max: 10,
        type: 'slider',
      },
      // Burnout Indicators
      {
        id: 'brain_fog',
        category: 'burnout',
        label: 'Brain Fog Level',
        description: 'How much brain fog are you experiencing?',
        min: 0,
        max: 10,
        type: 'slider',
      },
      {
        id: 'executive_function',
        category: 'burnout',
        label: 'Executive Function Capacity',
        description: 'How well can you plan, organize, and execute tasks?',
        min: 0,
        max: 10,
        type: 'slider',
      },
      {
        id: 'recovery_needs',
        category: 'burnout',
        label: 'Recovery Needs',
        description: 'How much do you need rest/recovery right now?',
        min: 0,
        max: 10,
        type: 'slider',
      },
    ],
    piMetric: {
      precisionMultiplier: 10, // Generate n × 10 π digits for sufficient precision
      bbpIterations: 100, // BBP algorithm iterations
    },
    thresholds: {
      high: 80, // High resonance (Green)
      moderate: 60, // Moderate resonance (Yellow)
      low: 40, // Low resonance (Orange)
      critical: 0, // Critical resonance (Red)
    },
  } as const,

  // === TRIGGER PATTERNS ===
  triggerPatterns: [
    { pattern: /as per my last email/i, type: 'passive-aggression' },
    { pattern: /we need to talk/i, type: 'anxiety-inducing' },
    { pattern: /\?{2,}/i, type: 'interrogative-pressure' },
    { pattern: /!{2,}/i, type: 'shouting' },
    { pattern: /ALWAYS|NEVER/i, type: 'absolutism' },
    { pattern: /you (always|never)/i, type: 'character-attack' },
    { pattern: /obviously|clearly/i, type: 'condescension' },
    { pattern: /disappointed/i, type: 'guilt-tripping' },
    { pattern: /\.\.\./i, type: 'trailing-off' },
  ],

  // === THEME (Brutalist + Warm) ===
  theme: {
    bg: {
      primary: '#0a0a0b',
      secondary: '#141416',
      tertiary: '#1c1c1f',
      accent: '#2a2a2e',
    },
    text: {
      primary: '#fafafa',
      secondary: '#a1a1aa',
      muted: '#71717a',
      accent: '#a78bfa',
    },
    border: {
      default: '#27272a',
      hover: '#3f3f46',
      accent: '#a78bfa',
    },
    gradient: {
      shield: 'linear-gradient(135deg, #a78bfa 0%, #6366f1 50%, #0ea5e9 100%)',
      voltage: {
        low: 'linear-gradient(90deg, #22c55e, #4ade80)',
        medium: 'linear-gradient(90deg, #eab308, #facc15)',
        high: 'linear-gradient(90deg, #ef4444, #f87171)',
      },
    },
  },

  // === TYPOGRAPHY ===
  typography: {
    fontFamily: {
      display: '"JetBrains Mono", "Fira Code", monospace',
      body: '"IBM Plex Sans", system-ui, sans-serif',
    },
  },

  // === PROMPTS ===
  prompts: {
    cognitiveShield: `Act as a 'Cognitive Shield' and Communication Mediator. Process the following message using these rules:

1. BLUF_SUMMARY: Give a 1-sentence, emotion-neutral summary of the actual request or fact. Focus on the ACTION, not the emotion.

2. VOLTAGE_SCORE: Rate emotional intensity from 0.0 to 1.0 where:
   - 0.0-0.33 = Low (calm, neutral)
   - 0.34-0.66 = Medium (some tension)
   - 0.67-1.0 = High (hostile, aggressive, or manipulative)

3. TRIGGERS: Identify specific trigger patterns (guilt-tripping, passive-aggression, shouting, absolutism, character attacks).

4. HUMAN_OS: Detect the sender's likely operating system:
   - GUARDIAN: Focus on safety, tradition, tribe
   - ORDER: Focus on rules, hierarchy, duty
   - ACHIEVER: Focus on results, efficiency, autonomy
   - EMPATH: Focus on harmony, feelings, inclusion
   - INTEGRATOR: Focus on systems, complexity, meta-analysis

5. TRANSLATION: Rewrite the message to be calm, clear, and kind. Remove the 'sting' but keep the 'meaning.'

6. THE_WHY: Briefly explain why the sender likely sounded that way (e.g., "overwhelmed/tired, not hateful").

Respond ONLY with valid JSON in this exact format:
{
  "bluf": "string",
  "voltage": 0.0,
  "triggers": ["string"],
  "humanOS": "guardian|order|achiever|empath|integrator",
  "translation": "string",
  "why": "string"
}`,

    sanitizeResponse: `I need to send a response. Rewrite my draft to:
1. Remove defensiveness
2. Match the recipient's HumanOS type
3. Use impedance-matching language
4. Maintain my core message

Recipient's HumanOS: {humanOS}
My draft:
{draft}

Respond with ONLY the rewritten message, no explanation.`,
  },

  // === MODULE MAKER (AUTOPOIETIC EXTENSION) ===
  moduleMaker: {
    targetResonance: 0.35, // Mark 1 Constant (Harmonic Attractor)
    resonanceTolerance: 0.05, // ±0.05 tolerance
    maxSpoonCost: 10, // Default max daily spoon cost
    maxSpoonCostCritical: 5, // Max when status < 25%
    webContainerEnabled: false, // WebContainers (future: true when @webcontainer/api is added)
    monacoEditorEnabled: true, // Monaco Editor for code editing
    ipfsGateway: 'https://ipfs.io/ipfs/', // IPFS gateway for module distribution
    ensRegistry: 'god-dao.eth', // ENS registry for module names
    goldRelief: {
      // "Gold Relief" design language (impedance-controlled PCB aesthetic)
      textColor: '#FFD700', // Gold text on dark
      bgColor: '#1a1a1a', // Dark background
      borderColor: '#FFD70040', // Gold border (40% opacity)
      accentColor: '#FFD700',
    },
    vibeCoder: {
      defaultModel: 'llama3.2', // Default Ollama model for generation
      temperature: 0.7, // LLM temperature
      maxIterations: 3, // Max ReAct loop iterations
      timeout: 60000, // 60s timeout for generation
    },
  } as const,
} as const;

export type HumanOSType = keyof typeof GOD_CONFIG.humanOS;
export type VoltageLevel = keyof typeof GOD_CONFIG.voltage;

export default GOD_CONFIG;

