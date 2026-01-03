/**
 * MODULE SANDBOX
 * WASM/WASI (Inner Hull) and Iframe (Outer Hull) isolation
 * 
 * Implements the "Double-Hull Defense" strategy
 */

import type { GeodesicModule, ModuleExecutionContext } from '../types/module.types';

/**
 * Create an iframe sandbox for module UI (Outer Hull)
 */
export function createIframeSandbox(
  module: GeodesicModule,
  containerId: string
): Promise<ModuleExecutionContext> {
  return new Promise((resolve, reject) => {
    const container = document.getElementById(containerId);
    if (!container) {
      reject(new Error(`Container ${containerId} not found`));
      return;
    }

    const iframe = document.createElement('iframe');
    iframe.id = `module-${module.id}`;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.sandbox.add('allow-scripts', 'allow-same-origin');
    // Explicitly deny dangerous capabilities
    // iframe.sandbox does NOT include: allow-forms, allow-popups, allow-top-navigation

    // Create message channel for communication
    const channel = new MessageChannel();

    // Set up message handler
    channel.port1.onmessage = (event) => {
      // Handle messages from module
      const { type, payload } = event.data;
      if (type === 'module-ready') {
        resolve({
          moduleId: module.id,
          iframeId: iframe.id,
          messageChannel: channel,
        });
      }
    };

    // Inject module code into iframe
    iframe.onload = () => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!iframeDoc) {
          reject(new Error('Cannot access iframe document'));
          return;
        }

        // Create isolated HTML document
        iframeDoc.open();
        iframeDoc.write(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: system-ui, sans-serif;
      background: #0a0a0b;
      color: #fafafa;
    }
  </style>
</head>
<body>
  <div id="module-root"></div>
  <script type="module">
    // Module execution context
    const moduleCode = ${JSON.stringify(module.sourceCode)};
    
    // Post message to parent when ready
    window.parent.postMessage({ type: 'module-ready', moduleId: '${module.id}' }, '*');
    
    // TODO: Execute module code safely here
    // For now, just display a placeholder
    document.getElementById('module-root').innerHTML = '<div style="padding: 20px; background: #141416; border-radius: 8px;"><h3>${module.name}</h3><p>${module.description}</p><p style="font-size: 12px; color: #71717a;">Module execution requires full WASM/WASI implementation.</p></div>';
  </script>
</body>
</html>
        `);
        iframeDoc.close();
      } catch (error) {
        reject(error);
      }
    };

    container.appendChild(iframe);
  });
}

/**
 * Destroy iframe sandbox
 */
export function destroyIframeSandbox(moduleId: string): void {
  const iframe = document.getElementById(`module-${moduleId}`) as HTMLIFrameElement;
  if (iframe) {
    iframe.remove();
  }
}

/**
 * Compile module to WASM (Inner Hull)
 * This is a placeholder - full implementation would use a WASM compiler
 */
export async function compileToWASM(module: GeodesicModule): Promise<WebAssembly.Module> {
  // Placeholder: In production, you'd use a TypeScript-to-WASM compiler
  // or compile the module source to WASM bytecode
  
  throw new Error('WASM compilation not yet implemented. Use iframe sandbox for now.');
}

/**
 * Create WASM instance for module execution
 */
export async function createWASMInstance(
  module: GeodesicModule
): Promise<WebAssembly.Instance> {
  // Placeholder: In production, you'd compile and instantiate the WASM module
  
  throw new Error('WASM instantiation not yet implemented. Use iframe sandbox for now.');
}



