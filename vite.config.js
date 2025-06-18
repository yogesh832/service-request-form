import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000, // ✔️ Avoid warnings for larger chunks
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react')) {
            return 'react-vendor'; // ✔️ React-related code in one chunk
          }
          if (id.includes('node_modules')) {
            return 'vendor'; // ✔️ All other third-party code in another
          }
        }
      }
    }
  }
});
