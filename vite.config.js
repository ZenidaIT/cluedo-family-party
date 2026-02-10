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
    emptyOutDir: true,
    // Removed manualChunks to prevent potential React duplication/loading issues (Invalid Hook Call)
  },
});
