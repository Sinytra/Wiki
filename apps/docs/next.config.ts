import nextra from 'nextra';
import {locales, defaultLocale} from '@/lang';

const withNextra = nextra({
  defaultShowCopyCode: true,
  unstable_shouldAddLocaleToLinks: true
});

const nextConfig = withNextra({
  output: 'export',
  images: {
    unoptimized: true
  },
  i18n: {
    locales,
    defaultLocale
  }
});

export default nextConfig;
