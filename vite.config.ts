import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.glb'],
  resolve: {
    alias: {
      '@react-three/fiber': path.resolve(__dirname, '.deps/node_modules/@react-three/fiber'),
      '@react-three/drei': path.resolve(__dirname, '.deps/node_modules/@react-three/drei'),
      '@react-three/rapier': path.resolve(__dirname, '.deps/node_modules/@react-three/rapier'),
      meshline: path.resolve(__dirname, '.deps/node_modules/meshline'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
