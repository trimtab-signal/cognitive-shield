import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Listen on all interfaces for Tailscale Funnel
    port: 5173,
    allowedHosts: [
      'dicktater-fundip.tail377c92.ts.net',
      'dicktater-fundip.tailscale.ts.net',
      '.tailscale.ts.net', // Allow all Tailscale domains
      '.ts.net', // Allow all Tailscale subdomains
    ],
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Resource-Policy': 'cross-origin',
    },
  },
  build: {
    rollupOptions: {
      // Externalize native platform packages (only used in Tauri/Capacitor builds)
      external: [
        '@tauri-apps/api',
        '@tauri-apps/api/core',
        '@tauri-apps/api/window',
        '@capacitor/haptics',
        '@capacitor/local-notifications',
        '@capacitor/clipboard',
        '@capacitor/filesystem',
      ],
      output: {
        manualChunks: {
          'three': ['three', '@react-three/fiber', '@react-three/drei'],
          'peerjs': ['peerjs'],
          'zustand': ['zustand'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
