/**
 * LOCAL RAG - Retrieval Augmented Generation with local embeddings
 * Uses Ollama's nomic-embed-text for embeddings
 * No cloud. Your documents stay on YOUR disk.
 */

import Ollama from 'ollama';
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, mkdirSync } from 'fs';
import { join, extname, relative } from 'path';
import { glob } from 'glob';

const EMBED_MODEL = 'nomic-embed-text';
const INDEX_DIR = join(import.meta.dirname, 'index');
const INDEX_FILE = join(INDEX_DIR, 'embeddings.json');

// Ensure index directory exists
if (!existsSync(INDEX_DIR)) {
  mkdirSync(INDEX_DIR, { recursive: true });
}

export class LocalRAG {
  constructor() {
    this.ollama = new Ollama.Ollama();
    this.index = this.loadIndex();
  }

  loadIndex() {
    try {
      if (existsSync(INDEX_FILE)) {
        return JSON.parse(readFileSync(INDEX_FILE, 'utf-8'));
      }
    } catch (e) {
      console.error('Failed to load index:', e.message);
    }
    return { documents: [], embeddings: [] };
  }

  saveIndex() {
    writeFileSync(INDEX_FILE, JSON.stringify(this.index, null, 2));
  }

  // Get embedding for text
  async embed(text) {
    const response = await this.ollama.embeddings({
      model: EMBED_MODEL,
      prompt: text
    });
    return response.embedding;
  }

  // Cosine similarity between two vectors
  cosineSimilarity(a, b) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  // Index a single document
  async indexDocument(filePath, content) {
    // Split into chunks (simple paragraph-based chunking)
    const chunks = this.chunkText(content, 500);
    
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const embedding = await embed(chunk);
      
      this.index.documents.push({
        path: filePath,
        chunk: i,
        content: chunk,
        indexed: new Date().toISOString()
      });
      this.index.embeddings.push(embedding);
    }
    
    this.saveIndex();
    return chunks.length;
  }

  // Chunk text into smaller pieces
  chunkText(text, maxChars = 500) {
    const chunks = [];
    const paragraphs = text.split(/\n\n+/);
    let currentChunk = '';
    
    for (const para of paragraphs) {
      if (currentChunk.length + para.length > maxChars && currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = '';
      }
      currentChunk += para + '\n\n';
    }
    
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }
    
    return chunks;
  }

  // Index a directory of documents
  async indexDirectory(dirPath, patterns = ['**/*.md', '**/*.txt', '**/*.ts', '**/*.js']) {
    console.log(`📚 Indexing ${dirPath}...`);
    
    const files = [];
    for (const pattern of patterns) {
      const matches = glob.sync(pattern, { 
        cwd: dirPath, 
        nodir: true,
        ignore: ['**/node_modules/**', '**/dist/**', '**/.git/**']
      });
      files.push(...matches);
    }
    
    let totalChunks = 0;
    
    for (const file of files) {
      const fullPath = join(dirPath, file);
      try {
        const content = readFileSync(fullPath, 'utf-8');
        const chunks = this.chunkText(content, 500);
        
        for (let i = 0; i < chunks.length; i++) {
          const chunk = chunks[i];
          const embedding = await this.embed(chunk);
          
          this.index.documents.push({
            path: file,
            chunk: i,
            content: chunk,
            indexed: new Date().toISOString()
          });
          this.index.embeddings.push(embedding);
          totalChunks++;
        }
        
        console.log(`  ✓ ${file} (${chunks.length} chunks)`);
      } catch (e) {
        console.error(`  ✗ ${file}: ${e.message}`);
      }
    }
    
    this.saveIndex();
    console.log(`📚 Indexed ${totalChunks} chunks from ${files.length} files`);
    return totalChunks;
  }

  // Search for relevant documents
  async search(query, topK = 5) {
    if (this.index.documents.length === 0) {
      return [];
    }
    
    const queryEmbedding = await this.embed(query);
    
    // Calculate similarities
    const similarities = this.index.embeddings.map((emb, i) => ({
      index: i,
      score: this.cosineSimilarity(queryEmbedding, emb)
    }));
    
    // Sort by similarity and get top K
    similarities.sort((a, b) => b.score - a.score);
    const topResults = similarities.slice(0, topK);
    
    return topResults.map(r => ({
      ...this.index.documents[r.index],
      score: r.score
    }));
  }

  // Get context for a query
  async getContext(query, maxChars = 3000) {
    const results = await this.search(query, 10);
    
    let context = '';
    for (const result of results) {
      if (context.length + result.content.length > maxChars) break;
      context += `### ${result.path}\n${result.content}\n\n`;
    }
    
    return context;
  }

  // Clear the index
  clearIndex() {
    this.index = { documents: [], embeddings: [] };
    this.saveIndex();
  }
}

export default LocalRAG;
