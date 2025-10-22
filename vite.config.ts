// vite.config.ts
import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

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
    // Explicitly include core libs so Vite can pre-bundle them and avoid
    // the "Could not auto-determine entry point" warning. Only include
    // packages that are actually in package.json.
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "lucide-react",
      "framer-motion",
    ],
  },

  // Use a relative base only for production builds. During dev we must keep
  // the base as "/" so the dev server serves module files with correct
  // MIME types (avoids returning index.html for module requests).
  base: process.env.NODE_ENV === "production" ? "./" : "/",

  server: {
    port: 3001,
    strictPort: true,
    host: "0.0.0.0",
    // Do not hard-code `hmr.port` here; letting HMR use the same server port
    // avoids mismatches when starting Vite on a different CLI port.
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
