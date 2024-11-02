import type { MetadataRoute } from 'next';
import available from "@/lib/locales/available";
 
export default function robots(): MetadataRoute.Robots {
  const languages = available.getLanguagePaths()
  const disallow = ['/dev/', '/report/', ...languages.flatMap(l => [`/${l}/dev/`, `/${l}/report/`])];

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: disallow,
    },
    sitemap: process.env.NEXT_APP_URL ? `${process.env.NEXT_APP_URL}/sitemap.xml` : undefined,
  }
}