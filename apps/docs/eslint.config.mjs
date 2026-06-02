import {defineConfig} from 'eslint/config';
import {nextJsConfig} from '@repo/eslint-config/next-js';

export default defineConfig([
  ...nextJsConfig,
  {
    rules: {
      '@next/next/no-img-element': 'off',
    }
  }
]);