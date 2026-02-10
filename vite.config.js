import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
  },
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 1000, // Increased limit slightly
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("firebase")) {
              return "firebase-vendor";
            }
            if (
              id.includes("react") ||
              id.includes("react-dom") ||
              id.includes("react-router-dom")
            ) {
              return "react-vendor";
            }
            if (
              id.includes("lucide-react") ||
              id.includes("sweetalert2") ||
              id.includes("@dnd-kit")
            ) {
              return "ui-vendor";
            }
          }
        },
      },
    },
  },
});
