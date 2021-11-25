import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default () => {
  return defineConfig({
    build: {
      outDir: 'build',
      minify: 'esbuild',
      sourcemap: true,
    },
    plugins: [react()],
  });
};
