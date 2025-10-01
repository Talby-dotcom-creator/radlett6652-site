// vite.config.ts
import { defineConfig, type PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      template: 'treemap',
      gzipSize: true,
      brotliSize: true,
      open: false,
    }) as unknown as PluginOption,
  ],

  // If you still want to exclude lucide from optimizeDeps, keep this block.
  // Otherwise you can delete optimizeDeps entirely.
  optimizeDeps: {
    // include: ['react-quill'], // ❌ we moved to Tiptap; keep removed
    exclude: ['lucide-react'],
  },

  base: '/',

  server: {
    host: '0.0.0.0',
    port: 3001,
    strictPort: true,
    open: false,
  },

  preview: {
    host: '0.0.0.0',
    port: 3001,
    strictPort: true,
  },

  build: {
    sourcemap: false,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('react') || id.includes('scheduler')) return 'react'
          if (id.includes('react-router')) return 'router'
          if (id.includes('@supabase')) return 'supabase'
          if (id.includes('lucide-react')) return 'icons'
          if (id.includes('lodash')) return 'lodash'
          return 'vendor'
        },
      },
    },
  },
})
