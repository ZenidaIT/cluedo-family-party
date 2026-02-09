import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

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
    rollupOptions: {
      output: {
        manualChunks(id) {
            if (id.includes('node_modules')) {
                if (id.includes('firebase')) {
                    return 'firebase';
                }
                return 'vendor';
            }
        }
      }
    }
  }
})
