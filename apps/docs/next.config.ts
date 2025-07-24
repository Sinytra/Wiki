import nextra from 'nextra'

const withNextra = nextra({
  defaultShowCopyCode: true,
  contentDirBasePath: '/',
  unstable_shouldAddLocaleToLinks: true
});

const nextConfig = withNextra({
  i18n: {
    locales: ['en'],
    defaultLocale: 'en'
  }
});

export default nextConfig
