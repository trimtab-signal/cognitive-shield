/**
 * VOICE INTERFACE - Local speech recognition and synthesis
 * Uses Whisper for STT and system TTS
 * No cloud. Your voice stays on YOUR machine.
 */

import { spawn, execSync } from 'child_process';
import { writeFileSync, unlinkSync, existsSync } from 'fs';
import { join } from 'path';

const TEMP_DIR = join(import.meta.dirname, 'temp');

export class VoiceInterface {
  constructor() {
    this.recording = false;
    this.whisperModel = 'base.en'; // Can use: tiny, base, small, medium, large
  }

  // Check if whisper is available (pip install openai-whisper)
  checkWhisper() {
    try {
      // Try direct whisper command
      execSync('whisper --help', { stdio: 'ignore' });
      return true;
    } catch {
      try {
        // Try ESP-IDF Python environment
        execSync('C:\\Espressif\\python_env\\idf5.5_py3.11_env\\Scripts\\whisper.exe --help', { stdio: 'ignore' });
        return true;
      } catch {
        try {
          // Try python -m whisper
          execSync('python -m whisper --help', { stdio: 'ignore' });
          return true;
        } catch {
          return false;
        }
      }
    }
  }
  
  // Get the whisper command path
  getWhisperCommand() {
    try {
      execSync('whisper --help', { stdio: 'ignore' });
      return 'whisper';
    } catch {
      try {
        execSync('C:\\Espressif\\python_env\\idf5.5_py3.11_env\\Scripts\\whisper.exe --help', { stdio: 'ignore' });
        return 'C:\\Espressif\\python_env\\idf5.5_py3.11_env\\Scripts\\whisper.exe';
      } catch {
        return 'python -m whisper';
      }
    }
  }

  // Record audio from microphone (Windows)
  async recordAudio(durationSeconds = 5) {
    const outputPath = join(TEMP_DIR, `recording_${Date.now()}.wav`);
    
    return new Promise((resolve, reject) => {
      // Use PowerShell to record audio
      const ps = spawn('powershell', [
        '-Command',
        `
        Add-Type -AssemblyName System.Speech
        $audioPath = "${outputPath.replace(/\\/g, '\\\\')}"
        
        # Use NAudio or SoX for recording
        # Fallback: Use Windows Sound Recorder
        Start-Process -FilePath "SoundRecorder" -ArgumentList "/FILE $audioPath /DURATION ${durationSeconds}000" -Wait
        `
      ]);

      ps.on('close', (code) => {
        if (code === 0 && existsSync(outputPath)) {
          resolve(outputPath);
        } else {
          reject(new Error('Failed to record audio'));
        }
      });
    });
  }

  // Transcribe audio using Whisper (local)
  async transcribe(audioPath) {
    return new Promise((resolve, reject) => {
      // Using whisper.cpp or openai-whisper
      const whisper = spawn('whisper', [
        audioPath,
        '--model', this.whisperModel,
        '--output_format', 'txt',
        '--language', 'en'
      ]);

      let output = '';
      whisper.stdout.on('data', (data) => {
        output += data.toString();
      });

      whisper.on('close', (code) => {
        // Clean up audio file
        try { unlinkSync(audioPath); } catch {}
        
        if (code === 0) {
          resolve(output.trim());
        } else {
          reject(new Error('Whisper transcription failed'));
        }
      });
    });
  }

  // Alternative: Use Windows Speech Recognition
  async transcribeWindows(audioPath) {
    return new Promise((resolve, reject) => {
      const ps = spawn('powershell', [
        '-Command',
        `
        Add-Type -AssemblyName System.Speech
        $recognizer = New-Object System.Speech.Recognition.SpeechRecognitionEngine
        $recognizer.SetInputToWaveFile("${audioPath.replace(/\\/g, '\\\\')}")
        $recognizer.LoadGrammar((New-Object System.Speech.Recognition.DictationGrammar))
        
        try {
            $result = $recognizer.Recognize()
            if ($result) {
                Write-Output $result.Text
            }
        } finally {
            $recognizer.Dispose()
        }
        `
      ]);

      let output = '';
      ps.stdout.on('data', (data) => {
        output += data.toString();
      });

      ps.on('close', () => {
        resolve(output.trim());
      });
    });
  }

  // Speak text using Windows TTS
  async speak(text) {
    return new Promise((resolve) => {
      const ps = spawn('powershell', [
        '-Command',
        `
        Add-Type -AssemblyName System.Speech
        $synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
        $synth.Rate = 1
        $synth.Speak("${text.replace(/"/g, '\\"').replace(/\n/g, ' ')}")
        $synth.Dispose()
        `
      ]);

      ps.on('close', () => {
        resolve();
      });
    });
  }

  // Quick speak (non-blocking)
  speakAsync(text) {
    spawn('powershell', [
      '-Command',
      `Add-Type -AssemblyName System.Speech; (New-Object System.Speech.Synthesis.SpeechSynthesizer).Speak("${text.replace(/"/g, '\\"').replace(/\n/g, ' ')}")`
    ], { detached: true, stdio: 'ignore' });
  }

  // List available voices
  listVoices() {
    try {
      const output = execSync(`
        powershell -Command "Add-Type -AssemblyName System.Speech; (New-Object System.Speech.Synthesis.SpeechSynthesizer).GetInstalledVoices() | ForEach-Object { $_.VoiceInfo.Name }"
      `, { encoding: 'utf-8' });
      return output.trim().split('\n');
    } catch {
      return [];
    }
  }
}

// Simpler alternative using edge-tts (Microsoft voices, runs locally)
export class EdgeTTS {
  async speak(text, voice = 'en-US-AriaNeural') {
    return new Promise((resolve, reject) => {
      const outputPath = join(TEMP_DIR, `tts_${Date.now()}.mp3`);
      
      const process = spawn('edge-tts', [
        '--voice', voice,
        '--text', text,
        '--write-media', outputPath
      ]);

      process.on('close', (code) => {
        if (code === 0) {
          // Play the audio
          spawn('powershell', [
            '-Command',
            `(New-Object Media.SoundPlayer "${outputPath}").PlaySync()`
          ]).on('close', () => {
            try { unlinkSync(outputPath); } catch {}
            resolve();
          });
        } else {
          reject(new Error('TTS failed'));
        }
      });
    });
  }
}

export default VoiceInterface;
