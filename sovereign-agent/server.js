/**
 * PHENIX VOICE SERVER - Bridge ESP32 to Local AI
 * 
 * Receives audio from Phenix Navigator → Whisper → Ollama → Response
 * 100% LOCAL. No cloud. Your voice never leaves your machine.
 * 
 * 🔥 PHENIX RISES 🔥
 */

import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { writeFileSync, unlinkSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { execSync, spawn } from 'child_process';
import { Ollama } from 'ollama';
import chalk from 'chalk';

// Local modules
import Memory from './memory.js';
import VoiceInterface from './voice.js';

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const PORT = process.env.PORT || 8765;
const MODEL = process.env.OLLAMA_MODEL || 'gemma2';
const TEMP_DIR = join(import.meta.dirname, 'temp');

// Ensure temp directory exists
if (!existsSync(TEMP_DIR)) {
  mkdirSync(TEMP_DIR, { recursive: true });
}

// Initialize
const memory = new Memory();
const voice = new VoiceInterface();
const ollama = new Ollama();

// Express app
const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.raw({ type: 'application/octet-stream', limit: '50mb' }));
app.use(express.raw({ type: 'audio/*', limit: '50mb' }));

// ═══════════════════════════════════════════════════════════════════════════
// HEALTH CHECK
// ═══════════════════════════════════════════════════════════════════════════

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'phenix-voice-server',
    model: MODEL,
    whisper: voice.checkWhisper() ? 'available' : 'not installed',
    timestamp: new Date().toISOString()
  });
});

app.get('/status', (req, res) => {
  res.json({
    coherence: 0.5,  // Placeholder - will be sent from Phenix
    mesh_peers: 0,
    privacy_mode: 'local_only'
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// VOICE PROCESSING ENDPOINT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * POST /voice
 * Receives raw audio data (16-bit PCM, mono, 24kHz)
 * Returns: { transcription, response }
 */
app.post('/voice', async (req, res) => {
  const startTime = Date.now();
  console.log(chalk.cyan('\n🎤 Voice data received from Phenix'));
  console.log(chalk.gray(`  Content-Type: ${req.headers['content-type']}`));
  console.log(chalk.gray(`  Body type: ${typeof req.body}, isBuffer: ${Buffer.isBuffer(req.body)}`));
  
  try {
    let audioData;
    
    // Handle different content types
    if (req.is('application/json')) {
      // Base64 encoded audio
      audioData = Buffer.from(req.body.audio, 'base64');
      console.log(chalk.gray(`  Format: base64, ${audioData.length} bytes`));
    } else if (Buffer.isBuffer(req.body)) {
      // Raw binary audio
      audioData = req.body;
      console.log(chalk.gray(`  Format: raw PCM buffer, ${audioData.length} bytes`));
    } else {
      // Try to convert to buffer
      console.log(chalk.yellow(`  Warning: Body is not a buffer, trying conversion...`));
      audioData = Buffer.from(req.body || []);
      console.log(chalk.gray(`  Converted to buffer: ${audioData.length} bytes`));
    }
    
    if (!audioData || audioData.length < 1000) {
      console.log(chalk.red(`  Error: Audio too short (${audioData?.length || 0} bytes)`));
      return res.json({ 
        error: 'Audio too short',
        transcription: '',
        response: "I didn't catch that. Please try again."
      });
    }
    
    // Save as WAV file for Whisper
    const wavPath = join(TEMP_DIR, `phenix_${Date.now()}.wav`);
    const wavBuffer = createWavFile(audioData, 24000, 16, 1);
    writeFileSync(wavPath, wavBuffer);
    console.log(chalk.gray(`  Saved: ${wavPath}`));
    
    // Run Whisper transcription
    console.log(chalk.yellow('  📝 Transcribing with Whisper...'));
    let transcription;
    
    if (voice.checkWhisper()) {
      transcription = await transcribeWithWhisper(wavPath);
    } else {
      // Fallback to Windows Speech Recognition
      console.log(chalk.gray('  (Using Windows Speech Recognition - install whisper.cpp for better results)'));
      transcription = await voice.transcribeWindows(wavPath);
    }
    
    // Clean up audio file
    try { unlinkSync(wavPath); } catch {}
    
    if (!transcription || transcription.trim().length === 0) {
      return res.json({
        transcription: '',
        response: "I couldn't understand that. Please speak clearly.",
        elapsed_ms: Date.now() - startTime
      });
    }
    
    console.log(chalk.green(`  ✓ Transcription: "${transcription}"`));
    
    // Get AI response via Ollama
    console.log(chalk.yellow('  🧠 Getting AI response...'));
    const response = await getAIResponse(transcription);
    console.log(chalk.green(`  ✓ Response: "${response.slice(0, 100)}..."`));
    
    const elapsed = Date.now() - startTime;
    console.log(chalk.cyan(`  ⏱️ Total time: ${elapsed}ms`));
    
    res.json({
      transcription,
      response,
      elapsed_ms: elapsed
    });
    
  } catch (error) {
    console.error(chalk.red(`  ✗ Error: ${error.message}`));
    res.status(500).json({
      error: error.message,
      transcription: '',
      response: "Sorry, something went wrong. Please try again."
    });
  }
});

/**
 * POST /text
 * Text-only query (no voice)
 */
app.post('/text', async (req, res) => {
  const { text, coherence } = req.body;
  console.log(chalk.cyan(`\n📝 Text query: "${text}" (coherence: ${coherence || 'N/A'})`));
  
  try {
    const response = await getAIResponse(text, coherence);
    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /speak
 * Text-to-speech (plays on the server/computer)
 */
app.post('/speak', async (req, res) => {
  const { text } = req.body;
  console.log(chalk.cyan(`\n🔊 Speaking: "${text.slice(0, 50)}..."`));
  
  voice.speakAsync(text);
  res.json({ success: true });
});

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Transcribe audio using Whisper
 */
async function transcribeWithWhisper(wavPath) {
  return new Promise((resolve, reject) => {
    // Use the whisper command from ESP-IDF Python environment
    const whisperCmd = 'C:\\Espressif\\python_env\\idf5.5_py3.11_env\\Scripts\\whisper.exe';
    console.log(chalk.gray(`  Using: ${whisperCmd}`));
    
    const whisper = spawn(whisperCmd, [
      wavPath,
      '--model', 'base.en',
      '--output_format', 'txt',
      '--language', 'en',
      '--fp16', 'False'
    ]);
    
    let output = '';
    let stderr = '';
    
    whisper.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    whisper.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    whisper.on('close', (code) => {
      if (code === 0) {
        // Parse the output - Whisper outputs the transcription
        const lines = output.trim().split('\n');
        const transcription = lines.filter(l => !l.startsWith('[') && l.trim()).join(' ');
        resolve(transcription.trim());
      } else {
        // Try to extract any transcription from stderr (whisper.cpp format)
        const match = stderr.match(/\] (.+)/);
        if (match) {
          resolve(match[1].trim());
        } else {
          reject(new Error(`Whisper failed: ${stderr}`));
        }
      }
    });
  });
}

/**
 * Get AI response via Ollama (local LLM)
 */
async function getAIResponse(userMessage, coherence = 0.5) {
  // Get memory context
  const memoryContext = memory.getContext();
  
  const systemPrompt = `You are a voice assistant running on the Phenix Navigator device.
You are 100% local - no cloud, no API keys, no surveillance.

The user is speaking to you through a handheld ESP32 device with a touchscreen.
Their current coherence level is ${(coherence * 100).toFixed(0)}%.

Guidelines:
- Keep responses SHORT and conversational (1-3 sentences max)
- Be warm but concise - this is a voice interface
- If coherence is low (<30%), be extra gentle and grounding
- If coherence is high (>70%), be playful and encouraging
- Reference the mesh network and Phenix device when relevant

${memoryContext ? `Known facts:\n${memoryContext}\n` : ''}

You are the Cognitive Shield - protecting the user's mind from noise.`;

  try {
    const response = await ollama.chat({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      stream: false
    });
    
    // Save to memory
    memory.addFact(`User said: "${userMessage}" | I responded: "${response.message.content.slice(0, 100)}"`, 'conversation');
    
    return response.message.content;
  } catch (error) {
    console.error(chalk.red(`Ollama error: ${error.message}`));
    return "I'm having trouble thinking right now. Is Ollama running?";
  }
}

/**
 * Create a WAV file from raw PCM data
 */
function createWavFile(pcmData, sampleRate = 24000, bitsPerSample = 16, channels = 1) {
  const dataSize = pcmData.length;
  const wavSize = 44 + dataSize;
  const buffer = Buffer.alloc(wavSize);
  
  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(wavSize - 8, 4);
  buffer.write('WAVE', 8);
  
  // fmt chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);  // Chunk size
  buffer.writeUInt16LE(1, 20);   // Audio format (PCM)
  buffer.writeUInt16LE(channels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * channels * bitsPerSample / 8, 28);  // Byte rate
  buffer.writeUInt16LE(channels * bitsPerSample / 8, 32);  // Block align
  buffer.writeUInt16LE(bitsPerSample, 34);
  
  // data chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);
  pcmData.copy(buffer, 44);
  
  return buffer;
}

// ═══════════════════════════════════════════════════════════════════════════
// WEBSOCKET FOR REAL-TIME (Optional future enhancement)
// ═══════════════════════════════════════════════════════════════════════════

const server = createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws) => {
  console.log(chalk.green('🔌 Phenix connected via WebSocket'));
  
  ws.on('message', async (data) => {
    try {
      const msg = JSON.parse(data.toString());
      
      if (msg.type === 'coherence') {
        // Update coherence status
        console.log(chalk.gray(`  Coherence: ${(msg.value * 100).toFixed(0)}%`));
      } else if (msg.type === 'voice') {
        // Process voice
        const audioBuffer = Buffer.from(msg.audio, 'base64');
        // ... same processing as HTTP endpoint
      }
    } catch (e) {
      console.error('WS error:', e.message);
    }
  });
  
  ws.on('close', () => {
    console.log(chalk.yellow('🔌 Phenix disconnected'));
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// START SERVER
// ═══════════════════════════════════════════════════════════════════════════

server.listen(PORT, '0.0.0.0', () => {
  console.log(chalk.magenta(`
╔═══════════════════════════════════════════════════════════════════════════╗
║                    PHENIX VOICE SERVER                                    ║
║                 100% Local • No Cloud • No Masters                        ║
╚═══════════════════════════════════════════════════════════════════════════╝
`));
  console.log(chalk.cyan(`🌐 HTTP:      http://localhost:${PORT}`));
  console.log(chalk.cyan(`🔌 WebSocket: ws://localhost:${PORT}/ws`));
  console.log(chalk.cyan(`🧠 Model:     ${MODEL}`));
  console.log(chalk.cyan(`🎤 Whisper:   ${voice.checkWhisper() ? 'Available' : 'Not installed (using Windows STT)'}`));
  console.log(chalk.gray('\nEndpoints:'));
  console.log(chalk.gray('  POST /voice  - Send audio data, get AI response'));
  console.log(chalk.gray('  POST /text   - Send text query, get AI response'));
  console.log(chalk.gray('  POST /speak  - Text-to-speech on server'));
  console.log(chalk.gray('  GET  /health - Server status'));
  console.log(chalk.yellow('\n🔥 Waiting for Phenix...'));
});
