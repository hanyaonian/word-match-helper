import typescript from '@rollup/plugin-typescript';
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    open: '/demo/index.html?log=all',
  },
  build: {
    target: 'es2018',
    minify: false,
    rollupOptions: {
      input: resolve(__dirname, 'src/index.ts'),
      output: {
        dir: 'dist',
        format: 'umd',
        name: 'WordMatcher',
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      },
      /** @see link https://rollupjs.org/guide/en/#preserveentrysignatures */
      preserveEntrySignatures: 'strict',
      plugins: [
        typescript({ tsconfig: './tsconfig.json' }),
      ]
    }
  },
})