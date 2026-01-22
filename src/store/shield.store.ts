/**
 * COGNITIVE SHIELD STATE STORE
 * Zustand store with batching logic for the Catcher's Mitt
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  ShieldState, 
  ShieldActions, 
  BufferedMessage, 
  ProcessedPayload,
  RawMessage,
  LLMProvider,
  ShieldAPIResponse 
} from '../types/shield.types';
import type { HumanOSType } from '../god.config';
import GOD_CONFIG from '../god.config';
import useHeartbeatStore from './heartbeat.store';

const generateId = () => crypto.randomUUID();

interface ShieldStore extends ShieldState, ShieldActions {}

// Timer reference for batching
let batchTimer: ReturnType<typeof setTimeout> | null = null;
let countdownInterval: ReturnType<typeof setInterval> | null = null;

const initialState: ShieldState = {
  buffer: [],
  processed: [],
  deepProcessingQueue: [],
  isBatching: false,
  batchTimeRemaining: 0,
  userHumanOS: null,
  apiKey: null,
  provider: 'ollama', // Default to local-first
  ollamaEndpoint: GOD_CONFIG.ollama.defaultEndpoint,
  ollamaModel: GOD_CONFIG.ollama.defaultModel,
};

export const useShieldStore = create<ShieldStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      ingestMessage: (content: string, source = 'unknown') => {
        // Heartbeat-driven throttling: Check daily check-in percentage
        const heartbeatStore = useHeartbeatStore.getState();
        const todayCheckIn = heartbeatStore.getTodayCheckIn();
        const statusPercentage = todayCheckIn?.percentage ?? 100; // Default to 100% if no check-in

        // If status < 25%, expand batching window or move to deep processing
        let batchingWindow = GOD_CONFIG.tetrahedron.batchingWindowMs;
        if (statusPercentage < 25) {
          // Expand window by 2x for low status
          batchingWindow = GOD_CONFIG.tetrahedron.batchingWindowMs * 2;
        } else if (statusPercentage < 50) {
          // Expand window by 1.5x for moderate status
          batchingWindow = GOD_CONFIG.tetrahedron.batchingWindowMs * 1.5;
        }

        const message: BufferedMessage = {
          id: generateId(),
          content: content as RawMessage,
          timestamp: Date.now(),
          source,
        };

        set((state) => ({
          buffer: [...state.buffer, message],
          isBatching: true,
          batchTimeRemaining: batchingWindow,
        }));

        // Clear existing timers
        if (batchTimer) clearTimeout(batchTimer);
        if (countdownInterval) clearInterval(countdownInterval);

        // Start countdown
        countdownInterval = setInterval(() => {
          set((state) => {
            const remaining = state.batchTimeRemaining - 1000;
            if (remaining <= 0) {
              if (countdownInterval) clearInterval(countdownInterval);
              return { batchTimeRemaining: 0 };
            }
            return { batchTimeRemaining: remaining };
          });
        }, 1000);

        // Set batch processing timer (with throttled window)
        batchTimer = setTimeout(() => {
          if (countdownInterval) clearInterval(countdownInterval);
          get().processBatch();
        }, batchingWindow);
      },

      processBatch: async () => {
        const { buffer, apiKey, provider, ollamaEndpoint, ollamaModel } = get();
        
        if (buffer.length === 0) {
          set({ isBatching: false, batchTimeRemaining: 0 });
          return;
        }

        // Combine buffered messages
        const combinedContent = buffer
          .map((m) => m.content)
          .join('\n---\n');

        try {
          let result: ShieldAPIResponse;

          if (provider === 'ollama') {
            // Ollama doesn't need an API key - it's local
            result = await processWithOllama(combinedContent, ollamaEndpoint, ollamaModel);
          } else if (apiKey) {
            result = await processWithLLM(combinedContent, apiKey, provider);
          } else {
            // Fallback: Local heuristic processing
            result = processLocally(combinedContent);
          }

          // Calculate spoons cost
          let spoons = 1;
          if (result.voltage > 6.6) spoons = 3;
          else if (result.voltage > 3.3) spoons = 2;
          spoons += Math.min(result.triggers.length, 2);
          spoons = Math.min(spoons, 5);

          // Determine emotional valence
          let emotionalValence: 'calm' | 'affection' | 'anxiety' | 'hostility' | 'neutral' = 'neutral';
          if (result.voltage > 6.6) emotionalValence = 'hostility';
          else if (result.voltage > 3.3) emotionalValence = 'anxiety';
          else if (/love|care|happy|joy/i.test(combinedContent)) emotionalValence = 'affection';
          else if (result.voltage < 2.0) emotionalValence = 'calm';

          const payload: ProcessedPayload = {
            ...result,
            timestamp: Date.now(),
            id: generateId(),
            spoons,
            emotionalValence,
          } as unknown as ProcessedPayload;

          // Check if message should be gated to deep processing queue
          const heartbeatStore = useHeartbeatStore.getState();
          const todayCheckIn = heartbeatStore.getTodayCheckIn();
          const statusPercentage = todayCheckIn?.percentage ?? 100;

          // Gate messages with 3+ spoons if status < 25%
          const shouldGate = statusPercentage < 25 && spoons >= 3;

          set((state) => ({
            buffer: [],
            processed: shouldGate ? state.processed : [payload, ...state.processed],
            deepProcessingQueue: shouldGate ? [payload, ...state.deepProcessingQueue] : state.deepProcessingQueue,
            isBatching: false,
            batchTimeRemaining: 0,
          }));
        } catch (error) {
          console.error('Shield processing error:', error);
          // Fallback to local processing
          const result = processLocally(combinedContent);
          
          // Calculate spoons cost (fallback)
          let spoons = 1;
          if (result.voltage > 6.6) spoons = 3;
          else if (result.voltage > 3.3) spoons = 2;
          spoons += Math.min(result.triggers.length, 2);
          spoons = Math.min(spoons, 5);

          let emotionalValence: 'calm' | 'affection' | 'anxiety' | 'hostility' | 'neutral' = 'neutral';
          if (result.voltage > 6.6) emotionalValence = 'hostility';
          else if (result.voltage > 3.3) emotionalValence = 'anxiety';
          else if (result.voltage < 2.0) emotionalValence = 'calm';

          const payload: ProcessedPayload = {
            ...result,
            timestamp: Date.now(),
            id: generateId(),
            spoons,
            emotionalValence,
          } as unknown as ProcessedPayload;

          // Check if message should be gated (fallback)
          const heartbeatStore = useHeartbeatStore.getState();
          const todayCheckIn = heartbeatStore.getTodayCheckIn();
          const statusPercentage = todayCheckIn?.percentage ?? 100;
          const shouldGate = statusPercentage < 25 && spoons >= 3;

          set((state) => ({
            buffer: [],
            processed: shouldGate ? state.processed : [payload, ...state.processed],
            deepProcessingQueue: shouldGate ? [payload, ...state.deepProcessingQueue] : state.deepProcessingQueue,
            isBatching: false,
            batchTimeRemaining: 0,
          }));
        }
      },

      dismissPayload: (id: string) => {
        set((state) => ({
          processed: state.processed.filter((p) => p.id !== id),
        }));
      },

      setUserHumanOS: (os: HumanOSType) => {
        set({ userHumanOS: os });
      },

      setApiKey: (key: string) => {
        set({ apiKey: key });
      },

      setProvider: (provider: LLMProvider) => {
        set({ provider });
      },

      setOllamaEndpoint: (endpoint: string) => {
        set({ ollamaEndpoint: endpoint });
      },

      setOllamaModel: (model: string) => {
        set({ ollamaModel: model });
      },

      reset: () => {
        if (batchTimer) clearTimeout(batchTimer);
        if (countdownInterval) clearInterval(countdownInterval);
        set(initialState);
      },

      promoteFromDeepQueue: (id: string) => {
        set((state) => {
          const payload = state.deepProcessingQueue.find((p) => p.id === id);
          if (!payload) return state;

          return {
            processed: [payload, ...state.processed],
            deepProcessingQueue: state.deepProcessingQueue.filter((p) => p.id !== id),
          };
        });
      },

      clearDeepQueue: () => {
        set({ deepProcessingQueue: [] });
      },
    }),
    {
      name: 'cognitive-shield-storage',
      partialize: (state) => ({
        userHumanOS: state.userHumanOS,
        apiKey: state.apiKey,
        provider: state.provider,
        ollamaEndpoint: state.ollamaEndpoint,
        ollamaModel: state.ollamaModel,
        processed: state.processed.slice(0, 50), // Keep last 50
      }),
    }
  )
);

// === OLLAMA PROCESSING (LOCAL-FIRST) ===

async function processWithOllama(
  content: string,
  endpoint: string,
  model: string
): Promise<ShieldAPIResponse> {
  const prompt = GOD_CONFIG.prompts.cognitiveShield + '\n\nMessage to process:\n' + content;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), GOD_CONFIG.ollama.timeout);

  try {
    const response = await fetch(`${endpoint}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
        format: 'json',
        options: {
          temperature: 0.3,
          num_predict: 1024,
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ollama error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const responseText = data.response;

    // Parse JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Failed to parse Ollama JSON response');
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Ollama request timed out - model may be loading or unavailable');
    }
    throw error;
  }
}

// === CLOUD LLM PROCESSING ===

async function processWithLLM(
  content: string,
  apiKey: string,
  provider: LLMProvider
): Promise<ShieldAPIResponse> {
  const prompt = GOD_CONFIG.prompts.cognitiveShield + '\n\nMessage to process:\n' + content;

  if (provider === 'openai') {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) throw new Error('OpenAI API error');
    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  }

  if (provider === 'anthropic') {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) throw new Error('Anthropic API error');
    const data = await response.json();
    const text = data.content[0].text;
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    throw new Error('Failed to parse Anthropic response');
  }

  if (provider === 'gemini') {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { 
            temperature: 0.3,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!response.ok) throw new Error('Gemini API error');
    const data = await response.json();
    return JSON.parse(data.candidates[0].content.parts[0].text);
  }

  throw new Error('Unknown provider');
}

// === LOCAL FALLBACK PROCESSING ===

function processLocally(content: string): ShieldAPIResponse {
  // Detect triggers
  const triggers: string[] = [];
  for (const { pattern, type } of GOD_CONFIG.triggerPatterns) {
    if (pattern.test(content)) {
      triggers.push(type);
    }
  }

  // Calculate voltage (1-10 scale as per checklist requirement)
  let voltage = 1; // Base voltage level 1
  voltage += triggers.length * 1.5; // Each trigger adds 1.5
  voltage += (content.match(/!/g) || []).length * 0.5; // Each ! adds 0.5
  voltage += (content.match(/\?/g) || []).length * 0.3; // Each ? adds 0.3
  voltage += content.toUpperCase() === content && content.length > 10 ? 3 : 0; // ALL CAPS adds 3
  voltage = Math.min(Math.max(voltage, 1), 10); // Clamp between 1-10

  // Detect HumanOS (simple heuristics)
  let humanOS: HumanOSType = 'empath';
  if (/must|should|always|duty|rule/i.test(content)) humanOS = 'order';
  else if (/efficient|result|goal|achieve|deliver/i.test(content)) humanOS = 'achiever';
  else if (/safe|protect|family|tradition|careful/i.test(content)) humanOS = 'guardian';
  else if (/system|complex|meta|overall|integrate/i.test(content)) humanOS = 'integrator';
  else if (/feel|care|together|share|support/i.test(content)) humanOS = 'empath';

  // Generate BLUF
  const sentences = content.split(/[.!?]+/).filter(Boolean);
  const bluf = sentences.length > 0 
    ? `Sender is communicating: ${sentences[0].trim().substring(0, 100)}...`
    : 'Message received (content unclear).';

  // Generate translation
  const translation = content
    .replace(/!/g, '.')
    .replace(/\?{2,}/g, '?')
    .replace(/you always/gi, 'sometimes')
    .replace(/you never/gi, 'sometimes')
    .replace(/OBVIOUSLY|CLEARLY/gi, '')
    .trim();

  // Calculate spoons
  let spoons = 1;
  if (voltage > 0.66) spoons = 3;
  else if (voltage > 0.33) spoons = 2;
  spoons += Math.min(triggers.length, 2);
  spoons = Math.min(spoons, 5);

  // Determine emotional valence
  let emotionalValence: 'calm' | 'affection' | 'anxiety' | 'hostility' | 'neutral' = 'neutral';
  if (voltage > 0.66) emotionalValence = 'hostility';
  else if (voltage > 0.33) emotionalValence = 'anxiety';
  else if (/love|care|happy|joy/i.test(content)) emotionalValence = 'affection';
  else if (voltage < 0.2) emotionalValence = 'calm';

  return {
    bluf,
    voltage,
    triggers,
    humanOS,
    translation,
    why: voltage > 5.0
      ? 'The sender appears stressed or overwhelmed. This is likely situational, not personal.'
      : 'The sender seems relatively calm. Standard communication patterns detected.',
  };
}

export default useShieldStore;

