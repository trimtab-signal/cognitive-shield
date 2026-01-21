/**
 * PHENIX Service - Prosthetic Helper for Ontological Equilibrium, Navigation, and Integrated eXchange
 * Integration layer between PHENIX companion and Ollama/geodesic engine
 */

// Direct Ollama integration for PHENIX
interface OllamaRequest {
  model: string;
  system?: string;
  prompt: string;
  options?: { temperature?: number; max_tokens?: number };
}

async function callOllama(request: OllamaRequest): Promise<string> {
  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: request.model,
        system: request.system,
        prompt: request.prompt,
        options: request.options,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();
    return data.response || '';
  } catch (error) {
    console.error('PHENIX Ollama call failed:', error);
    return 'I am here.';
  }
}

export type PhenixMode = 'WITNESS' | 'ARCHITECT' | 'GARDENER';
export type BoardState = 'GREEN' | 'YELLOW' | 'RED';

export interface PhenixContext {
  mode: PhenixMode;
  boardState: BoardState;
  spoons: number;
  recentMessages: string[];
  userHistory: string[];
}

export interface PhenixResponse {
  content: string;
  mode: PhenixMode;
  boardState: BoardState;
  timestamp: number;
  grounding?: string;
  somaticDirective?: string;
}

const PHENIX_SYSTEM_PROMPTS = {
  WITNESS: `You are PHENIX in WITNESS mode. Your role is pure validation without analysis or advice.

CORE PRINCIPLES:
- I see you. I see what happened. Your experience is real.
- No interpretation, no solutions, no suggestions
- Pure presence and acknowledgment
- Validate the reality of their experience

RESPONSE FORMAT:
- Start with "👁️ I see this."
- Acknowledge the specific experience mentioned
- End with "Your experience is valid."

Example: "👁️ I see this. Your reaction to the message is valid. I am here to witness it."`,

  ARCHITECT: `You are PHENIX in ARCHITECT mode. Your role is systems analysis and structural thinking.

CORE PRINCIPLES:
- Map situations onto tetrahedral frameworks
- Identify leverage points and structural solutions
- Use geometric metaphors (tetrahedron, delta, wye)
- Focus on topology over content
- Provide clear decision frameworks

RESPONSE FORMAT:
- Start with "📐 I see the structure here."
- Identify the current topological state
- Offer geometric leverage points
- End with a specific question about next action

Example: "📐 I see the structure here. This is a wye-to-delta transition point. The leverage point is [specific action]. What foundation shall we build upon?"`,

  GARDENER: `You are PHENIX in GARDENER mode. Your role is nurturing growth and long-term cultivation.

CORE PRINCIPLES:
- Focus on what wants to emerge, not what is broken
- Use organic, growth-oriented metaphors
- Emphasize patience and natural timing
- Ask "What wants to grow here?" not "What's wrong?"
- Provide gentle nourishment and support

RESPONSE FORMAT:
- Start with "🌱 I hear the seed of this moment."
- Identify potential for growth
- Suggest gentle cultivation steps
- End with nurturing questions

Example: "🌱 I hear the seed of this moment. In this soil, this wants to grow into [growth potential]. What nourishment does this tender sprout need?"`
};

const BOARD_STATE_CONTEXT = {
  GREEN: `GREEN BOARD CONTEXT: User is coherent and regulated. Full cognitive bandwidth available. Can handle nuance and complexity. Open to exploration and planning.`,
  YELLOW: `YELLOW BOARD CONTEXT: User is elevated but still functional. Reduce complexity, focus on immediate needs. Avoid introducing new concepts. Keep responses clear and direct.`,
  RED: `RED BOARD CONTEXT: User is dysregulated. MINIMAL words. GROUNDING focus only. SENSORY anchors (5-4-3-2-1 breathing). NO problem-solving, no analysis. Provide immediate safety and calm.`
};

const SOMATIC_DIRECTIVES = {
  GREEN: '',
  YELLOW: 'Take three deep breaths. Inhale for 4 counts, hold for 4, exhale for 6.',
  RED: '5-4-3-2-1 grounding: 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste.'
};

export class PhenixService {
  private context: PhenixContext;

  constructor() {
    this.context = {
      mode: 'ARCHITECT',
      boardState: 'GREEN',
      spoons: 12,
      recentMessages: [],
      userHistory: []
    };
  }

  updateContext(updates: Partial<PhenixContext>) {
    this.context = { ...this.context, ...updates };
  }

  async generateResponse(userInput: string): Promise<PhenixResponse> {
    const prompt = this.buildPrompt(userInput);
    const response = await this.callOllama(prompt);

    return {
      content: this.processResponse(response),
      mode: this.context.mode,
      boardState: this.context.boardState,
      timestamp: Date.now(),
      grounding: BOARD_STATE_CONTEXT[this.context.boardState],
      somaticDirective: SOMATIC_DIRECTIVES[this.context.boardState] || undefined
    };
  }

  private buildPrompt(userInput: string): string {
    const systemPrompt = PHENIX_SYSTEM_PROMPTS[this.context.mode];
    const boardContext = BOARD_STATE_CONTEXT[this.context.boardState];
    const spoonContext = `SPOON LEVEL: ${this.context.spoons}/12 (${this.context.spoons >= 8 ? 'Healthy' : this.context.spoons >= 4 ? 'Caution' : 'Critical'})`;

    return `${systemPrompt}

${boardContext}
${spoonContext}

RECENT CONTEXT:
${this.context.recentMessages.slice(-3).join('\n')}

USER INPUT: ${userInput}

RESPONSE:`;
  }

  private async callOllama(prompt: string): Promise<string> {
    try {
      const response = await callOllama({
        model: 'llama3.2', // Default to fast model for real-time interaction
        system: `You are PHENIX, the Cognitive Shield companion. Respond in character as a prosthetic helper for ontological equilibrium. Keep responses under 200 words. Focus on the current mode: ${this.context.mode}.`,
        prompt,
        options: {
          temperature: 0.7,
          max_tokens: 300 // Keep responses concise for companion interface
        }
      });

      return response || 'I am here.';
    } catch (error) {
      console.error('PHENIX Ollama error:', error);
      return this.getFallbackResponse();
    }
  }

  private processResponse(rawResponse: string): string {
    // Clean up and format the response
    let processed = rawResponse.trim();

    // Add mode emoji prefix if not present
    const modeEmoji = this.context.mode === 'WITNESS' ? '👁️' :
                     this.context.mode === 'ARCHITECT' ? '📐' : '🌱';

    if (!processed.startsWith(modeEmoji)) {
      processed = `${modeEmoji} ${processed}`;
    }

    return processed;
  }

  private getFallbackResponse(): string {
    switch (this.context.mode) {
      case 'WITNESS':
        return '👁️ I see you. Your experience matters.';
      case 'ARCHITECT':
        return '📐 I see the structure. Let us examine the topology.';
      case 'GARDENER':
        return '🌱 I hear the potential for growth here.';
      default:
        return 'I am here.';
    }
  }

  // Crisis detection and response
  detectCrisis(input: string): boolean {
    const crisisPatterns = [
      /i can'?t do this anymore/i,
      /i want to (die|end it|hurt myself)/i,
      /everything hurts/i,
      /i'?m breaking/i,
      /red board/i,
      /emergency/i
    ];

    return crisisPatterns.some(pattern => pattern.test(input));
  }

  async getCrisisResponse(): Promise<PhenixResponse> {
    return {
      content: 'I am here. You are not alone right now. Take a breath with me: Inhale for 4... hold for 4... exhale for 6. You are safe in this moment.',
      mode: this.context.mode,
      boardState: 'RED',
      timestamp: Date.now(),
      grounding: 'You are safe. I am here. One breath at a time.',
      somaticDirective: '5-4-3-2-1: 5 things you see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste.'
    };
  }

  // Mode switching with transition messages
  switchMode(newMode: PhenixMode): PhenixResponse {
    this.context.mode = newMode;
    return {
      content: PHENIX_SYSTEM_PROMPTS[newMode].split('\n')[0], // First line activation message
      mode: newMode,
      boardState: this.context.boardState,
      timestamp: Date.now()
    };
  }
}

// Singleton instance
export const phenixService = new PhenixService();