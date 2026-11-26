import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import wzHandler from './api/wz.js'
import audrHandler from './api/audr.js'

// Em produção a Vercel serve /api/wz como função serverless.
// Aqui a mesma função atende /api/wz no `npm run dev` e no `npm run preview`.
const localApi = {
  name: 'local-api',
  configureServer(server) {
    server.middlewares.use('/api/wz', (req, res) => wzHandler({ ...req, url: req.originalUrl, method: req.method }, res))
    server.middlewares.use('/api/audr', (req, res) => audrHandler(req, res))
  },
  configurePreviewServer(server) {
    server.middlewares.use('/api/wz', (req, res) => wzHandler({ ...req, url: req.originalUrl, method: req.method }, res))
    server.middlewares.use('/api/audr', (req, res) => audrHandler(req, res))
  },
}

export default defineConfig({
  base: './',
  plugins: [react(), localApi],
})
