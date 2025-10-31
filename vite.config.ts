/// <reference types="vite/client" />
import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    process.env.NODE_ENV === "production"
      ? undefined
      : (visualizer({
          filename: "dist/stats.html",
          template: "treemap",
          gzipSize: true,
          brotliSize: true,
          open: false,
        }) as unknown as PluginOption),
  ].filter(Boolean),

  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "lucide-react",
      "framer-motion",
    ],
  },

  base: "/",

  server: {
    // Bind to localhost and use a single fixed port to avoid conflicts with other local tools.
    // Use Vite's default 5173 which is less likely to be occupied on Windows dev machines.
    port: 5173,
    strictPort: true,
    host: "localhost",
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
