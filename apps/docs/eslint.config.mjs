import {defineConfig} from 'eslint/config';
import {nextJsConfig} from '@repo/eslint-config/next-js';
import stylistic from '@stylistic/eslint-plugin';

export default defineConfig([
    ...nextJsConfig,
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