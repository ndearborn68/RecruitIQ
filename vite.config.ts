import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Listen on all IPv4 addresses
    port: 5173,
    strictPort: false, // If 5173 is taken, try next available port
    open: true, // Automatically open browser
    hmr: {
      overlay: true, // Show error overlay
    },
  },
})
