import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000 * 1000, // Adjust the limit as needed, e.g., 1 MB
  },
});
