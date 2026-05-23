import {defineConfig} from 'eslint/config';
import {nextJsConfig} from '@repo/eslint-config/next-js';
import stylistic from '@stylistic/eslint-plugin';

export default defineConfig([
  ...nextJsConfig,
  {
    rules: {
      '@next/next/no-img-element': 'off',
    }
  },
  {
    plugins: {
      '@stylistic': stylistic
    },
    rules: {
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/quotes': ['error', 'single']
    }
  }
]);