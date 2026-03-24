import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  const basePath = env.VITE_BASE_PATH || '/';
  return {
    base: basePath,
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.AI_API_KEY': JSON.stringify(env.AI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // Respect DISABLE_HMR for environments where file watch is limited.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
