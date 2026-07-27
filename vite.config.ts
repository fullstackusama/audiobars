import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  if (mode === 'library') {
    return {
      build: {
        outDir: 'dist',
        lib: {
          entry: resolve(__dirname, 'src/index.ts'),
          name: 'AudioBars',
          fileName: (format) => `audiobars.${format === 'es' ? 'mjs' : 'umd.js'}`,
        },
        rollupOptions: {
          external: ['react', 'react-dom'],
          output: {
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
            },
          },
        },
      },
    };
  }

  return {
    root: '.',
    build: {
      outDir: 'dist',
    },
  };
});
