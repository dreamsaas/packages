// rollup.config.js
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'build',
    format: 'cjs',
    sourcemap: true
  },
  external: ['react', 'react-dom'],
  plugins: [
    typescript({
      exclude: ['**/__tests__/**', '**/stories/**', '*.spec.tsx', '*.stories.tsx'],
      clean: true
    })
  ]
};
