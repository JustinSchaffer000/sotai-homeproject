/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupVitest.ts',
  },
  plugins: [react(), tsconfigPaths()],
});
