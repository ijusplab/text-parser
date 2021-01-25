import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

/**
 * type {import('vite').UserConfig}
 */
export default defineConfig({
  root: './src/tester',
  plugins: [vue()],
  build: {
    base: '/bin/site',
    outDir: '../../bin/site'
  }
});
