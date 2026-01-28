import { defineConfig } from 'vite';
import { resolve } from 'path';

// Vite config for Chrome Extension MV3
export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        'background/service-worker': resolve(__dirname, 'src/background/service-worker.ts'),
        'popup/popup': resolve(__dirname, 'src/popup/popup.html'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // MV3 requires no code splitting for service worker
    target: 'esnext',
    minify: false, // Keep readable for auditing
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  // Prevent external imports that would violate MV3 CSP
  optimizeDeps: {
    exclude: [],
  },
});
