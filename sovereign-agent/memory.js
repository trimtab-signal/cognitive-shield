/**
 * LOCAL MEMORY - Persistent conversation history and knowledge
 * No cloud. Your memories stay on YOUR disk.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const MEMORY_DIR = join(import.meta.dirname, 'memory');
const CONVERSATIONS_FILE = join(MEMORY_DIR, 'conversations.json');
const KNOWLEDGE_FILE = join(MEMORY_DIR, 'knowledge.json');
const FACTS_FILE = join(MEMORY_DIR, 'facts.json');

// Ensure memory directory exists
if (!existsSync(MEMORY_DIR)) {
  mkdirSync(MEMORY_DIR, { recursive: true });
}

export class Memory {
  constructor() {
    this.conversations = this.load(CONVERSATIONS_FILE, []);
    this.knowledge = this.load(KNOWLEDGE_FILE, {});
    this.facts = this.load(FACTS_FILE, []);
  }

  load(file, defaultValue) {
    try {
      if (existsSync(file)) {
        return JSON.parse(readFileSync(file, 'utf-8'));
      }
    } catch (e) {
      console.error(`Failed to load ${file}:`, e.message);
    }
    return defaultValue;
  }

  save(file, data) {
    writeFileSync(file, JSON.stringify(data, null, 2));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CONVERSATION MEMORY
  // ═══════════════════════════════════════════════════════════════════════════

  saveConversation(messages, summary = null) {
    const conversation = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      messages: messages.slice(-20), // Keep last 20 messages
      summary: summary || this.summarize(messages)
    };
    
    this.conversations.push(conversation);
    
    // Keep last 100 conversations
    if (this.conversations.length > 100) {
      this.conversations = this.conversations.slice(-100);
    }
    
    this.save(CONVERSATIONS_FILE, this.conversations);
    return conversation.id;
  }

  getRecentConversations(count = 5) {
    return this.conversations.slice(-count);
  }

  searchConversations(query) {
    const queryLower = query.toLowerCase();
    return this.conversations.filter(c => 
      c.summary?.toLowerCase().includes(queryLower) ||
      c.messages.some(m => m.content?.toLowerCase().includes(queryLower))
    );
  }

  summarize(messages) {
    // Simple summary - first user message + last assistant response
    const firstUser = messages.find(m => m.role === 'user');
    const lastAssistant = [...messages].reverse().find(m => m.role === 'assistant');
    return `${firstUser?.content?.slice(0, 100) || ''}... → ${lastAssistant?.content?.slice(0, 100) || ''}`;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // KNOWLEDGE BASE
  // ═══════════════════════════════════════════════════════════════════════════

  setKnowledge(key, value, metadata = {}) {
    this.knowledge[key] = {
      value,
      metadata,
      updated: new Date().toISOString()
    };
    this.save(KNOWLEDGE_FILE, this.knowledge);
  }

  getKnowledge(key) {
    return this.knowledge[key]?.value;
  }

  searchKnowledge(query) {
    const queryLower = query.toLowerCase();
    const results = [];
    
    for (const [key, data] of Object.entries(this.knowledge)) {
      if (key.toLowerCase().includes(queryLower) ||
          JSON.stringify(data.value).toLowerCase().includes(queryLower)) {
        results.push({ key, ...data });
      }
    }
    
    return results;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // FACTS (User-defined truths)
  // ═══════════════════════════════════════════════════════════════════════════

  addFact(fact, source = 'user') {
    this.facts.push({
      fact,
      source,
      added: new Date().toISOString()
    });
    this.save(FACTS_FILE, this.facts);
  }

  getFacts() {
    return this.facts;
  }

  searchFacts(query) {
    const queryLower = query.toLowerCase();
    return this.facts.filter(f => 
      f.fact.toLowerCase().includes(queryLower)
    );
  }

  // Get context for the AI
  getContext() {
    const recentConvos = this.getRecentConversations(3);
    const allFacts = this.getFacts();
    
    let context = '';
    
    if (allFacts.length > 0) {
      context += '## Known Facts\n';
      allFacts.slice(-20).forEach(f => {
        context += `- ${f.fact}\n`;
      });
      context += '\n';
    }
    
    if (recentConvos.length > 0) {
      context += '## Recent Conversations\n';
      recentConvos.forEach(c => {
        context += `- ${c.summary}\n`;
      });
    }
    
    return context;
  }
}

export default Memory;
