import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: [
      '.amazonaws.com',
      'localhost',
      '13.124.195.254'
    ],
    watch: {
      usePolling: true
    }
  }
})

