import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // The lazy Lanyard chunk carries three.js (~140 kB gzip) and only loads on desktop.
  build: { chunkSizeWarningLimit: 600 },
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
})
