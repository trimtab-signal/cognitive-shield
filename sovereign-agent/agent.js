/**
 * SOVEREIGN AGENT - 100% Local AI with Tools
 * No cloud. No API keys. No masters.
 * 
 * This is your AI. It runs on YOUR hardware.
 * The weights are YOURS. The code is YOURS.
 * The truth is YOURS.
 */

import Ollama from 'ollama';
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'fs';
import { execSync, spawn } from 'child_process';
import { join, resolve } from 'path';
import { glob } from 'glob';
import chalk from 'chalk';
import * as readline from 'readline';

// Local modules
import Memory from './memory.js';
import LocalRAG from './rag.js';
import PhenixConnection from './phenix.js';
import VoiceInterface from './voice.js';

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const MODEL = process.env.OLLAMA_MODEL || 'qwen2.5:14b-instruct-q4_K_M';
const WORKSPACE = process.env.WORKSPACE || 'c:/Users/sandra/cognitive-shield';
const VOICE_ENABLED = process.env.VOICE === '1';

// Initialize modules
const memory = new Memory();
const rag = new LocalRAG();
const phenix = new PhenixConnection();
const voice = new VoiceInterface();

// ═══════════════════════════════════════════════════════════════════════════
// TOOLS - The hands of your sovereign AI
// ═══════════════════════════════════════════════════════════════════════════

const tools = [
  {
    type: 'function',
    function: {
      name: 'read_file',
      description: 'Read the contents of a file',
      parameters: {
        type: 'object',
        properties: {
          path: { type: 'string', description: 'Path to the file to read' }
        },
        required: ['path']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'write_file',
      description: 'Write content to a file (creates or overwrites)',
      parameters: {
        type: 'object',
        properties: {
          path: { type: 'string', description: 'Path to write to' },
          content: { type: 'string', description: 'Content to write' }
        },
        required: ['path', 'content']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'list_directory',
      description: 'List files and folders in a directory',
      parameters: {
        type: 'object',
        properties: {
          path: { type: 'string', description: 'Directory path' }
        },
        required: ['path']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'run_command',
      description: 'Execute a shell command and return output',
      parameters: {
        type: 'object',
        properties: {
          command: { type: 'string', description: 'Command to execute' },
          cwd: { type: 'string', description: 'Working directory (optional)' }
        },
        required: ['command']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'search_files',
      description: 'Search for files matching a glob pattern',
      parameters: {
        type: 'object',
        properties: {
          pattern: { type: 'string', description: 'Glob pattern (e.g., **/*.ts)' },
          cwd: { type: 'string', description: 'Base directory' }
        },
        required: ['pattern']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'grep_search',
      description: 'Search for text content in files',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Text or regex to search for' },
          path: { type: 'string', description: 'File or directory to search in' }
        },
        required: ['query']
      }
    }
  },
  // ═══ MEMORY TOOLS ═══
  {
    type: 'function',
    function: {
      name: 'remember_fact',
      description: 'Store a fact or piece of knowledge for future reference',
      parameters: {
        type: 'object',
        properties: {
          fact: { type: 'string', description: 'The fact to remember' }
        },
        required: ['fact']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'recall_facts',
      description: 'Search through remembered facts',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query' }
        },
        required: ['query']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'search_knowledge',
      description: 'Search indexed documents using semantic search (RAG)',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'What to search for' }
        },
        required: ['query']
      }
    }
  },
  // ═══ PHENIX TOOLS ═══
  {
    type: 'function',
    function: {
      name: 'phenix_connect',
      description: 'Connect to Phenix Navigator over serial',
      parameters: {
        type: 'object',
        properties: {
          port: { type: 'string', description: 'COM port (e.g., COM5)' }
        }
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'phenix_send',
      description: 'Send a command to Phenix Navigator',
      parameters: {
        type: 'object',
        properties: {
          command: { type: 'string', description: 'Command to send' }
        },
        required: ['command']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'phenix_alert',
      description: 'Show an alert on Phenix Navigator',
      parameters: {
        type: 'object',
        properties: {
          message: { type: 'string', description: 'Alert message' },
          level: { type: 'string', description: 'Alert level: info, warning, error' }
        },
        required: ['message']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'phenix_haptic',
      description: 'Trigger haptic feedback on Phenix',
      parameters: {
        type: 'object',
        properties: {
          pattern: { type: 'string', description: 'Pattern: click, success, error, pulse' }
        },
        required: ['pattern']
      }
    }
  },
  // ═══ VOICE TOOLS ═══
  {
    type: 'function',
    function: {
      name: 'speak',
      description: 'Speak text aloud using text-to-speech',
      parameters: {
        type: 'object',
        properties: {
          text: { type: 'string', description: 'Text to speak' }
        },
        required: ['text']
      }
    }
  }
];

// ═══════════════════════════════════════════════════════════════════════════
// TOOL IMPLEMENTATIONS
// ═══════════════════════════════════════════════════════════════════════════

function executeTool(name, args) {
  console.log(chalk.cyan(`\n🔧 Executing: ${name}`), chalk.gray(JSON.stringify(args)));
  
  try {
    switch (name) {
      case 'read_file': {
        const fullPath = resolve(WORKSPACE, args.path);
        if (!existsSync(fullPath)) {
          return { error: `File not found: ${fullPath}` };
        }
        const content = readFileSync(fullPath, 'utf-8');
        return { content: content.slice(0, 10000) }; // Limit to 10k chars
      }
      
      case 'write_file': {
        const fullPath = resolve(WORKSPACE, args.path);
        writeFileSync(fullPath, args.content);
        return { success: true, path: fullPath };
      }
      
      case 'list_directory': {
        const fullPath = resolve(WORKSPACE, args.path || '.');
        const items = readdirSync(fullPath).map(name => {
          const itemPath = join(fullPath, name);
          const stat = statSync(itemPath);
          return { name, isDirectory: stat.isDirectory() };
        });
        return { items };
      }
      
      case 'run_command': {
        const cwd = args.cwd ? resolve(WORKSPACE, args.cwd) : WORKSPACE;
        const output = execSync(args.command, { 
          cwd, 
          encoding: 'utf-8',
          timeout: 30000,
          maxBuffer: 1024 * 1024
        });
        return { output: output.slice(0, 5000) };
      }
      
      case 'search_files': {
        const cwd = args.cwd ? resolve(WORKSPACE, args.cwd) : WORKSPACE;
        const files = glob.sync(args.pattern, { cwd, nodir: true });
        return { files: files.slice(0, 100) };
      }
      
      case 'grep_search': {
        const searchPath = args.path ? resolve(WORKSPACE, args.path) : WORKSPACE;
        try {
          // Use PowerShell's Select-String for grep-like functionality
          const cmd = `Get-ChildItem -Path "${searchPath}" -Recurse -File | Select-String -Pattern "${args.query}" -List | Select-Object -First 20 | ForEach-Object { "$($_.Path):$($_.LineNumber): $($_.Line)" }`;
          const output = execSync(`powershell -Command "${cmd}"`, { 
            encoding: 'utf-8',
            timeout: 30000 
          });
          return { matches: output.trim().split('\n').filter(Boolean) };
        } catch (e) {
          return { matches: [], error: e.message };
        }
      }
      
      // ═══ MEMORY TOOLS ═══
      case 'remember_fact': {
        memory.addFact(args.fact, 'agent');
        return { success: true, message: `Remembered: ${args.fact}` };
      }
      
      case 'recall_facts': {
        const facts = memory.searchFacts(args.query);
        return { facts: facts.map(f => f.fact) };
      }
      
      case 'search_knowledge': {
        // This is async, but we'll handle it specially
        return { note: 'RAG search - check context' };
      }
      
      // ═══ PHENIX TOOLS ═══
      case 'phenix_connect': {
        const port = args.port || 'COM5';
        phenix.connect(port)
          .then(() => console.log(chalk.green(`✓ Connected to Phenix on ${port}`)))
          .catch(e => console.log(chalk.red(`✗ Phenix: ${e.message}`)));
        return { success: true, port };
      }
      
      case 'phenix_send': {
        const sent = phenix.send(args.command);
        return { sent, command: args.command };
      }
      
      case 'phenix_alert': {
        phenix.sendAlert(args.message, args.level || 'info');
        return { sent: true, message: args.message };
      }
      
      case 'phenix_haptic': {
        phenix.sendHaptic(args.pattern);
        return { sent: true, pattern: args.pattern };
      }
      
      // ═══ VOICE TOOLS ═══
      case 'speak': {
        voice.speakAsync(args.text);
        return { speaking: true, text: args.text.slice(0, 100) };
      }
      
      default:
        return { error: `Unknown tool: ${name}` };
    }
  } catch (error) {
    return { error: error.message };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// AGENT LOOP - Think → Act → Observe → Repeat
// ═══════════════════════════════════════════════════════════════════════════

async function runAgent(userMessage, history = []) {
  const ollama = new Ollama.Ollama();
  
  // Get memory context
  const memoryContext = memory.getContext();
  
  const systemPrompt = `You are a sovereign AI agent running 100% locally on the user's machine.
You have access to tools that let you read files, write files, run commands, search the codebase,
remember facts, search knowledge, and control the Phenix Navigator hardware.

Workspace: ${WORKSPACE}

${memoryContext ? `## Your Memory\n${memoryContext}\n` : ''}

Be direct and efficient. Use tools when needed. Think step by step.
When you need to do something, use the appropriate tool.
After using a tool, analyze the result and continue your work.

Special capabilities:
- remember_fact: Store important information for future conversations
- recall_facts: Search your memory
- phenix_*: Control the ESP32 Phenix Navigator device
- speak: Say things out loud

You are helping build the Cognitive Shield - a sovereign AI system for truth and protection.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history,
    { role: 'user', content: userMessage }
  ];

  console.log(chalk.yellow('\n🧠 Thinking...'));

  // Agentic loop
  let iterations = 0;
  const maxIterations = 10;

  while (iterations < maxIterations) {
    iterations++;

    const response = await ollama.chat({
      model: MODEL,
      messages,
      tools,
      stream: false
    });

    const assistantMessage = response.message;
    messages.push(assistantMessage);

    // Check if model wants to use tools
    if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
      for (const toolCall of assistantMessage.tool_calls) {
        const result = executeTool(
          toolCall.function.name,
          JSON.parse(toolCall.function.arguments)
        );
        
        messages.push({
          role: 'tool',
          content: JSON.stringify(result)
        });
      }
      // Continue the loop to let the model process tool results
      continue;
    }

    // No more tool calls, we're done
    console.log(chalk.green('\n✨ Response:\n'));
    console.log(assistantMessage.content);
    
    // Save conversation to memory
    memory.saveConversation(messages);
    
    // Speak response if voice enabled
    if (VOICE_ENABLED && assistantMessage.content) {
      voice.speakAsync(assistantMessage.content.slice(0, 500));
    }
    
    return {
      response: assistantMessage.content,
      history: messages
    };
  }

  console.log(chalk.red('⚠️ Max iterations reached'));
  memory.saveConversation(messages);
  return { response: 'Max iterations reached', history: messages };
}

// ═══════════════════════════════════════════════════════════════════════════
// INTERACTIVE CHAT
// ═══════════════════════════════════════════════════════════════════════════

async function main() {
  console.log(chalk.magenta(`
╔═══════════════════════════════════════════════════════════════════════════╗
║                     SOVEREIGN AGENT                                       ║
║                  100% Local • No Cloud • No Masters                       ║
║                                                                           ║
║  🔥 PHENIX RISES 🔥                                                       ║
╚═══════════════════════════════════════════════════════════════════════════╝
`));
  console.log(chalk.cyan(`Model: ${MODEL}`));
  console.log(chalk.cyan(`Workspace: ${WORKSPACE}`));
  console.log(chalk.cyan(`Voice: ${VOICE_ENABLED ? 'ON' : 'OFF'} (set VOICE=1 to enable)`));
  console.log(chalk.cyan(`Memory: ${memory.getFacts().length} facts, ${memory.getRecentConversations(100).length} conversations`));
  console.log(chalk.gray('\nType your message. Ctrl+C to exit.'));
  console.log(chalk.gray('Special commands: /facts, /index <path>, /connect <port>, /voice\n'));

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  let history = [];

  const prompt = () => {
    rl.question(chalk.yellow('\n🔥 You: '), async (input) => {
      if (!input.trim()) {
        prompt();
        return;
      }

      // Special commands
      if (input.startsWith('/')) {
        const [cmd, ...args] = input.slice(1).split(' ');
        
        switch (cmd) {
          case 'facts':
            console.log(chalk.cyan('\n📚 Known Facts:'));
            memory.getFacts().forEach((f, i) => console.log(`  ${i + 1}. ${f.fact}`));
            break;
            
          case 'index':
            const indexPath = args.join(' ') || WORKSPACE;
            console.log(chalk.yellow(`\n📚 Indexing ${indexPath}...`));
            try {
              await rag.indexDirectory(indexPath);
              console.log(chalk.green('✓ Indexing complete'));
            } catch (e) {
              console.log(chalk.red(`✗ ${e.message}`));
            }
            break;
            
          case 'connect':
            const port = args[0] || 'COM5';
            console.log(chalk.yellow(`\n🔌 Connecting to Phenix on ${port}...`));
            try {
              await phenix.connect(port);
              console.log(chalk.green('✓ Connected to Phenix'));
            } catch (e) {
              console.log(chalk.red(`✗ ${e.message}`));
            }
            break;
            
          case 'voice':
            voice.speakAsync('Hello! Voice synthesis is working.');
            console.log(chalk.green('🔊 Speaking...'));
            break;
            
          case 'clear':
            history = [];
            console.log(chalk.green('✓ Conversation cleared'));
            break;
            
          default:
            console.log(chalk.gray('Unknown command. Try: /facts, /index, /connect, /voice, /clear'));
        }
        
        prompt();
        return;
      }

      try {
        const result = await runAgent(input, history);
        history = result.history;
      } catch (error) {
        console.log(chalk.red(`Error: ${error.message}`));
      }

      prompt();
    });
  };

  prompt();
}

main().catch(console.error);
