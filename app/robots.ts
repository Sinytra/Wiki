import type { MetadataRoute } from 'next';
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dev/', '/report/'],
    },
    sitemap: process.env.NEXT_APP_URL ? `${process.env.NEXT_APP_URL}/sitemap.xml` : undefined,
  }
}