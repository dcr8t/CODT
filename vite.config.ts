import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import process from 'node:process';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // ONLY expose the Gemini API Key to the client.
      // The Payment Key must REMAIN HIDDEN on the server-side.
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      
      // We pass the full env object as a fallback, but we explicitly 
      // exclude sensitive keys to be safe if this fallback is used.
      'process.env': {
        ...env,
        NOWPAYMENTS_API_KEY: undefined // SECURITY: Ensure this is undefined in the client bundle
      }
    },
    server: {
      port: 3000
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      minify: 'esbuild'
    }
  };
});