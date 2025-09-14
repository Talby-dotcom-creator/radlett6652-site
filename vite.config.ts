import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  optimizeDeps: {
    // keep/explore as needed; if icons fail to load during dev, try switching to `include: ['lucide-react']`
    exclude: ['lucide-react'],
  },

  // Ensure proper base URL
  base: '/',

  // Dev server
  server: {
    host: '0.0.0.0',   // allows access on your local network
    port: 3001,        // dev server port
    strictPort: true,  // fail if port 3001 is taken
    open: false
  },

  // Preview server for `vite preview`
  preview: {
    host: '0.0.0.0',
    port: 3001,
    strictPort: true
  },
})
