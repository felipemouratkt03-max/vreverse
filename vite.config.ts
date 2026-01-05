import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {
      API_KEY: JSON.stringify(process.env.API_KEY)
    }
  },
  build: {
    // This ensures that .htaccess and other root files are copied if they are not specifically excluded
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  }
});