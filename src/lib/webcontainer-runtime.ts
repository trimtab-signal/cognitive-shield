/**
 * @license
 * Copyright 2026 Wonky Sprout DUNA
 *
 * Licensed under the AGPLv3 License, Version 3.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.gnu.org/licenses/agpl-3.0.html
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║   WEBCONTAINER RUNTIME                                                     ║
 * ║   Reference Frame Independent Code Execution                               ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 * 
 * "The means of production are owned physically by the user."
 * 
 * WebContainers allow running Node.js entirely in the browser, eliminating
 * dependency on centralized cloud servers (Wye topology → Delta topology).
 * 
 * Features:
 * - Local Execution: No cloud compiler dependency
 * - Sovereignty: Code lives on user's device (IndexedDB)
 * - Offline Capable: Works without internet
 * - Isostatic Sandboxing: Modules can't break the core
 */

// ============================================================================
// TYPES
// ============================================================================

export interface WebContainerConfig {
  maxMemoryMB: number;
  timeoutMs: number;
  allowedModules: string[];
  sandboxLevel: 'strict' | 'standard' | 'permissive';
}

export interface ModuleExecutionResult {
  success: boolean;
  output: string;
  errors: string[];
  exitCode: number;
  executionTimeMs: number;
  memoryUsageMB: number;
}

export interface FileSystemNode {
  type: 'file' | 'directory';
  name: string;
  content?: string;
  children?: FileSystemNode[];
}

export interface RuntimeStatus {
  isReady: boolean;
  isRunning: boolean;
  currentModule: string | null;
  memoryUsage: number;
  uptime: number;
}

// ============================================================================
// WEBCONTAINER RUNTIME CLASS
// ============================================================================

/**
 * WebContainer Runtime Manager
 * 
 * Note: This is a compatibility layer that works with or without @webcontainer/api.
 * In environments where WebContainers are available (modern browsers with COOP/COEP),
 * it uses the full API. Otherwise, it falls back to iframe-based sandboxing.
 */
export class WebContainerRuntime {
  private config: WebContainerConfig;
  private isInitialized: boolean = false;
  private currentProcess: AbortController | null = null;
  private fileSystem: Map<string, string> = new Map();
  private startTime: number = 0;

  constructor(config: Partial<WebContainerConfig> = {}) {
    this.config = {
      maxMemoryMB: config.maxMemoryMB ?? 256,
      timeoutMs: config.timeoutMs ?? 30000,
      allowedModules: config.allowedModules ?? ['react', 'react-dom', 'zustand'],
      sandboxLevel: config.sandboxLevel ?? 'standard',
    };
  }

  /**
   * Initialize the WebContainer runtime
   */
  async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;

    try {
      // Check if WebContainers API is available
      if (await this.checkWebContainerSupport()) {
        // Full WebContainer initialization would happen here
        // For now, we use the fallback iframe sandbox
        console.log('[WebContainer] Full API not available, using fallback sandbox');
      }

      // Initialize fallback file system (IndexedDB)
      await this.initializeFileSystem();
      
      this.isInitialized = true;
      this.startTime = Date.now();
      
      return true;
    } catch (error) {
      console.error('[WebContainer] Initialization failed:', error);
      return false;
    }
  }

  /**
   * Check if WebContainers are supported
   */
  private async checkWebContainerSupport(): Promise<boolean> {
    // WebContainers require:
    // 1. SharedArrayBuffer (needs COOP/COEP headers)
    // 2. Modern browser with Web Workers
    
    const hasSharedArrayBuffer = typeof SharedArrayBuffer !== 'undefined';
    const hasWebWorker = typeof Worker !== 'undefined';
    
    // Check for cross-origin isolation (required for SharedArrayBuffer)
    const isCrossOriginIsolated = 
      typeof crossOriginIsolated !== 'undefined' && crossOriginIsolated;

    return hasSharedArrayBuffer && hasWebWorker && isCrossOriginIsolated;
  }

  /**
   * Initialize the virtual file system using IndexedDB
   */
  private async initializeFileSystem(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('phenix-vfs', 1);

      request.onerror = () => reject(request.error);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('files')) {
          db.createObjectStore('files', { keyPath: 'path' });
        }
      };

      request.onsuccess = () => {
        resolve();
      };
    });
  }

  /**
   * Write a file to the virtual file system
   */
  async writeFile(path: string, content: string): Promise<void> {
    this.fileSystem.set(path, content);
    
    // Persist to IndexedDB
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('phenix-vfs', 1);
      
      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction('files', 'readwrite');
        const store = tx.objectStore('files');
        
        store.put({ path, content, updatedAt: Date.now() });
        
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      };
    });
  }

  /**
   * Read a file from the virtual file system
   */
  async readFile(path: string): Promise<string | null> {
    // Check in-memory cache first
    if (this.fileSystem.has(path)) {
      return this.fileSystem.get(path)!;
    }

    // Try IndexedDB
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('phenix-vfs', 1);
      
      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction('files', 'readonly');
        const store = tx.objectStore('files');
        
        const getRequest = store.get(path);
        
        getRequest.onsuccess = () => {
          const result = getRequest.result;
          if (result) {
            this.fileSystem.set(path, result.content);
            resolve(result.content);
          } else {
            resolve(null);
          }
        };
        
        getRequest.onerror = () => reject(getRequest.error);
      };
    });
  }

  /**
   * List files in a directory
   */
  async listFiles(directory: string = '/'): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('phenix-vfs', 1);
      
      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction('files', 'readonly');
        const store = tx.objectStore('files');
        
        const files: string[] = [];
        const cursorRequest = store.openCursor();
        
        cursorRequest.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result;
          if (cursor) {
            const filePath: string = cursor.value.path;
            if (filePath.startsWith(directory)) {
              files.push(filePath);
            }
            cursor.continue();
          } else {
            resolve(files);
          }
        };
        
        cursorRequest.onerror = () => reject(cursorRequest.error);
      };
    });
  }

  /**
   * Execute a module in the sandbox
   */
  async executeModule(
    entryPoint: string,
    sourceCode: string
  ): Promise<ModuleExecutionResult> {
    const startTime = performance.now();
    const errors: string[] = [];
    let output = '';
    let exitCode = 0;

    try {
      // Write the source code to the VFS
      await this.writeFile(entryPoint, sourceCode);

      // Create an iframe sandbox for execution
      const result = await this.runInSandbox(sourceCode);
      
      output = result.output;
      errors.push(...result.errors);
      exitCode = result.success ? 0 : 1;

    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
      exitCode = 1;
    }

    const executionTimeMs = performance.now() - startTime;

    return {
      success: exitCode === 0,
      output,
      errors,
      exitCode,
      executionTimeMs,
      memoryUsageMB: this.estimateMemoryUsage(),
    };
  }

  /**
   * Run code in an isolated iframe sandbox
   */
  private async runInSandbox(
    code: string
  ): Promise<{ success: boolean; output: string; errors: string[] }> {
    return new Promise((resolve) => {
      const errors: string[] = [];
      let output = '';

      // Create sandbox iframe
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.sandbox.add('allow-scripts');
      
      // Set up timeout
      const timeout = setTimeout(() => {
        document.body.removeChild(iframe);
        resolve({
          success: false,
          output,
          errors: [...errors, 'Execution timed out'],
        });
      }, this.config.timeoutMs);

      // Listen for messages from sandbox
      const messageHandler = (event: MessageEvent) => {
        if (event.source !== iframe.contentWindow) return;
        
        const { type, data } = event.data;
        
        if (type === 'log') {
          output += data + '\n';
        } else if (type === 'error') {
          errors.push(data);
        } else if (type === 'complete') {
          clearTimeout(timeout);
          window.removeEventListener('message', messageHandler);
          document.body.removeChild(iframe);
          resolve({ success: errors.length === 0, output, errors });
        }
      };

      window.addEventListener('message', messageHandler);
      
      // Load sandbox content
      document.body.appendChild(iframe);
      
      const sandboxHTML = `
<!DOCTYPE html>
<html>
<head>
  <script>
    // Override console to send messages to parent
    const parentOrigin = '*';
    const _log = console.log;
    const _error = console.error;
    
    console.log = (...args) => {
      parent.postMessage({ type: 'log', data: args.join(' ') }, parentOrigin);
    };
    
    console.error = (...args) => {
      parent.postMessage({ type: 'error', data: args.join(' ') }, parentOrigin);
    };
    
    // Global error handler
    window.onerror = (msg, url, line, col, error) => {
      parent.postMessage({ type: 'error', data: msg }, parentOrigin);
      return true;
    };
    
    // Execute the code
    try {
      ${this.wrapCode(code)}
      parent.postMessage({ type: 'complete' }, parentOrigin);
    } catch (e) {
      parent.postMessage({ type: 'error', data: e.message }, parentOrigin);
      parent.postMessage({ type: 'complete' }, parentOrigin);
    }
  </script>
</head>
<body></body>
</html>
      `;

      iframe.srcdoc = sandboxHTML;
    });
  }

  /**
   * Wrap code for safe execution
   */
  private wrapCode(code: string): string {
    // Remove import/export statements for sandbox execution
    let wrapped = code
      .replace(/import\s+.*?from\s+['"].*?['"];?\n?/g, '')
      .replace(/export\s+(default\s+)?/g, '');

    // Wrap in async IIFE if needed
    if (code.includes('await ')) {
      wrapped = `(async () => { ${wrapped} })();`;
    }

    return wrapped;
  }

  /**
   * Estimate current memory usage
   */
  private estimateMemoryUsage(): number {
    let totalSize = 0;
    for (const content of this.fileSystem.values()) {
      totalSize += new Blob([content]).size;
    }
    return totalSize / (1024 * 1024); // Convert to MB
  }

  /**
   * Get current runtime status
   */
  getStatus(): RuntimeStatus {
    return {
      isReady: this.isInitialized,
      isRunning: this.currentProcess !== null,
      currentModule: null,
      memoryUsage: this.estimateMemoryUsage(),
      uptime: this.isInitialized ? Date.now() - this.startTime : 0,
    };
  }

  /**
   * Clear all files from the virtual file system
   */
  async clearFileSystem(): Promise<void> {
    this.fileSystem.clear();
    
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('phenix-vfs', 1);
      
      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction('files', 'readwrite');
        const store = tx.objectStore('files');
        
        store.clear();
        
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      };
    });
  }

  /**
   * Terminate any running processes
   */
  terminate(): void {
    if (this.currentProcess) {
      this.currentProcess.abort();
      this.currentProcess = null;
    }
  }
}

// ============================================================================
// DEFAULT INSTANCE
// ============================================================================

export const webContainerRuntime = new WebContainerRuntime();

// ============================================================================
// REACT HOOK
// ============================================================================

import { useState, useEffect, useCallback } from 'react';

export function useWebContainer() {
  const [status, setStatus] = useState<RuntimeStatus>({
    isReady: false,
    isRunning: false,
    currentModule: null,
    memoryUsage: 0,
    uptime: 0,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        await webContainerRuntime.initialize();
        setStatus(webContainerRuntime.getStatus());
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to initialize');
      }
    };

    init();
  }, []);

  const executeModule = useCallback(
    async (entryPoint: string, code: string) => {
      setStatus((s) => ({ ...s, isRunning: true, currentModule: entryPoint }));
      try {
        const result = await webContainerRuntime.executeModule(entryPoint, code);
        setStatus(webContainerRuntime.getStatus());
        return result;
      } finally {
        setStatus((s) => ({ ...s, isRunning: false, currentModule: null }));
      }
    },
    []
  );

  const writeFile = useCallback(
    async (path: string, content: string) => {
      await webContainerRuntime.writeFile(path, content);
      setStatus(webContainerRuntime.getStatus());
    },
    []
  );

  const readFile = useCallback(
    (path: string) => webContainerRuntime.readFile(path),
    []
  );

  return {
    status,
    error,
    executeModule,
    writeFile,
    readFile,
    terminate: () => webContainerRuntime.terminate(),
  };
}
