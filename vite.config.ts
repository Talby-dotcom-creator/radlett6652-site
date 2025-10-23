export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: "dist/stats.html",
      template: "treemap",
      gzipSize: true,
      brotliSize: true,
      open: false,
    }) as unknown as PluginOption,
  ],

  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "lucide-react",
      "framer-motion",
    ],
  },

  // ✅ Always use an absolute base for Netlify/production
  base: "/",

  server: {
    port: 3001,
    strictPort: true,
    host: "0.0.0.0",
  },

  build: {
    sourcemap: false,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("react-router")) return "router";
          if (id.includes("@supabase")) return "supabase";
          if (id.includes("lucide-react")) return "icons";
          if (id.includes("lodash")) return "lodash";
          return "vendor";
        },
      },
    },
  },
});
