import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@master-project/core': path.resolve(__dirname, '../core/src'),
      '@master-project/communication': path.resolve(__dirname, '../communication/src'),
      '@master-project/permaweb': path.resolve(__dirname, '../permaweb/src'),
      '@master-project/legal': path.resolve(__dirname, '../legal/src'),
      '@master-project/economics': path.resolve(__dirname, '../economics/src'),
    },
  },
  server: {
    host: true,
    port: 3000,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})