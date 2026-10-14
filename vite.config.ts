import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves the site at /ReliefHub/; keep '/' for local dev,
  // Firebase Hosting, Vercel, Netlify or a custom domain.
  base: process.env.VITE_BASE_PATH ?? '/',
  server: {
    port: 5173,
    host: true,
  },
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 1200,
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
