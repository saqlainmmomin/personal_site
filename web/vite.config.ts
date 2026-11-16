import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

// vercel.json sets cleanUrls, so /projects serves projects.html there; mirror that in dev and preview.
const pages = ['/projects', '/yozora']
const cleanUrls = (): Plugin => {
  const rewrite = (req: { url?: string }) => {
    const p = req.url?.split('?')[0]
    if (p && pages.includes(p)) req.url = `${p}.html`
  }
  return {
    name: 'clean-urls',
    configureServer: (s) => void s.middlewares.use((req, _res, next) => (rewrite(req), next())),
    configurePreviewServer: (s) => void s.middlewares.use((req, _res, next) => (rewrite(req), next())),
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), cleanUrls()],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(import.meta.dirname, 'index.html'),
        projects: path.resolve(import.meta.dirname, 'projects.html'),
        yozora: path.resolve(import.meta.dirname, 'yozora.html'),
      },
    },
  },
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
})
