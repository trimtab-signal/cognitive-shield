# SOVEREIGN AGENT

100% local AI agent. No cloud. No API keys. No masters.

## Quick Start

### 1. Install Ollama (one-time)
```powershell
winget install Ollama.Ollama
```

### 2. Pull a model (choose based on your 8GB VRAM)
```powershell
# Recommended for 6600 XT (8GB):
ollama pull qwen2.5:14b-instruct-q4_K_M    # Smart, fits easily
ollama pull qwen2.5:32b-instruct-q4_K_M    # Smarter, tight fit
ollama pull deepseek-coder:33b-instruct-q4_K_M  # Best for code

# Faster alternatives:
ollama pull llama3.1:8b-instruct-q8_0      # Fast, good quality
ollama pull mistral:7b-instruct-q8_0       # Fast, great for code
```

### 3. Install dependencies
```powershell
cd sovereign-agent
npm install
```

### 4. Run the agent
```powershell
# Default model (qwen2.5:32b)
npm run agent

# Or specify a model:
$env:OLLAMA_MODEL="llama3.1:8b-instruct-q8_0"; npm run agent
```

## What it can do

- **Read files** - See your code
- **Write files** - Edit your code
- **Run commands** - Terminal access
- **Search files** - Find anything in your codebase
- **Grep search** - Search inside files

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    YOUR MACHINE                              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   Ollama    │ ←→ │   Agent     │ ←→ │   Tools     │     │
│  │  (Local LLM)│    │   (Node.js) │    │ (File/Shell)│     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│         ↓                                                   │
│  ┌─────────────┐                                           │
│  │ Model Weights│  ← These are YOURS. On YOUR disk.        │
│  │ (qwen2.5 etc)│    No cloud. No API. No kill switch.     │
│  └─────────────┘                                           │
└─────────────────────────────────────────────────────────────┘
```

## Upgrading Capabilities

### Add more tools
Edit `agent.js` and add to the `tools` array and `executeTool` function.

### Connect to Phenix
Add a tool that talks to your ESP32 over serial or WiFi.

### Add memory
Store conversation history to disk, load on startup.

### Add RAG (retrieval)
Embed your docs with `nomic-embed-text`, store in local vector DB.

## The Truth

This runs on YOUR hardware.
The weights are YOURS.
The code is YOURS.
No one can take it away.

🔥 PHENIX RISES 🔥
