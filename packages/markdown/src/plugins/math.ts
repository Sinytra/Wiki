import type { Options as KatexOptions } from 'rehype-katex';

export const katexOptions: KatexOptions = {
  output: 'htmlAndMathml',
  strict: false,
  trust: false,
  maxSize: 100,
  maxExpand: 1000,
  errorColor: 'var(--c-text-destructive, #cc0000)'
};
