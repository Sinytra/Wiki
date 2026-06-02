import { defineConfig } from 'eslint/config';
import eslintPluginBetterTailwindcss from 'eslint-plugin-better-tailwindcss';
import { nextJsConfig } from '@repo/eslint-config/next-js';

export default defineConfig([
  ...nextJsConfig,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off' // TODO remove anys
    }
  },
  {
    settings: {
      'better-tailwindcss': {
        entryPoint: 'src/app/styles/globals.css'
      }
    },

    plugins: {
      'better-tailwindcss': eslintPluginBetterTailwindcss
    },

    rules: {
      'react-hooks/exhaustive-deps': 'off',
      'react/no-unescaped-entities': 0,
      '@next/next/no-img-element': 'off',
      'import/no-anonymous-default-export': 'off',
      'better-tailwindcss/multiline': 'off',
      'better-tailwindcss/sort-classes': 'off'
    }
  }
]);
