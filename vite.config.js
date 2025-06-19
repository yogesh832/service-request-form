import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './', // ✅ ensures relative paths for assets during Vercel build
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000, // ✅ avoids large chunk warnings
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react')) {
            return 'react-vendor'; // ✅ separate chunk for React
          }
          if (id.includes('node_modules')) {
            return 'vendor'; // ✅ separate chunk for other libs
          }
        },
      },
    },
  },
});
