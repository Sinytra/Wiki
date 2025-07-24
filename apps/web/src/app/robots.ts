import type { MetadataRoute } from 'next';
import locales from "@repo/lang/locales";
 
export default function robots(): MetadataRoute.Robots {
  const languages = locales.getLanguagePaths()
  const disallow = ['/dev/', '/report/', ...languages.flatMap(l => [`/${l}/dev/`, `/${l}/report/`])];

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: disallow,
    },
    sitemap: process.env.NEXT_PUBLIC_NEXT_APP_URL ? `${process.env.NEXT_PUBLIC_NEXT_APP_URL}/sitemap.xml` : undefined,
  }
}