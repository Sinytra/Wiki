import type { MetadataRoute } from 'next';
import { DEFAULT_DOCS_VERSION, DEFAULT_LOCALE } from '@repo/shared/constants';
import projectApi from '@/lib/service/api/projectApi';
import locales, { DEFAULT_LOCALE_CODE, Language } from '@repo/shared/locales';
import { LocalizedPath } from '@/lib/seo';

type SitemapEntry = MetadataRoute.Sitemap[number];

function sitemapEntry(
  path: LocalizedPath,
  langs: Language[],
  options: Pick<SitemapEntry, 'changeFrequency' | 'priority' | 'lastModified'>
): SitemapEntry {
  const base = process.env.NEXT_PUBLIC_NEXT_APP_URL!;

  const languages: Record<string, string> = {};
  for (const lang of langs) {
    languages[lang.internal] = base + path(lang.prefix);
  }
  if (langs.length > 0) {
    languages['x-default'] = base + path(DEFAULT_LOCALE);
  }

  return {
    url: base + path(DEFAULT_LOCALE),
    ...options,
    alternates: { languages }
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!process.env.NEXT_PUBLIC_NEXT_APP_URL) {
    return [];
  }

  const allLangs = locales.getAvailableLocales();
  const entries: MetadataRoute.Sitemap = [
    sitemapEntry((prefix) => `/${prefix}`, allLangs, { changeFrequency: 'weekly', priority: 1 }),
    sitemapEntry((prefix) => `/${prefix}/browse`, allLangs, { changeFrequency: 'daily', priority: 0.8 }),
    sitemapEntry((prefix) => `/${prefix}/about`, allLangs, { changeFrequency: 'monthly', priority: 0.5 }),
    sitemapEntry((prefix) => `/${prefix}/about/help`, allLangs, { changeFrequency: 'monthly', priority: 0.5 })
  ];

  const allProjects = await projectApi.getAllProjects();
  if (!allProjects.success) {
    return entries;
  }

  for (const { id, locales: codes } of allProjects.data) {
    const langs = [...new Set([DEFAULT_LOCALE_CODE, ...codes])]
      .map((code) => locales.getForCode(code))
      .filter((l) => l != null);

    entries.push(
      sitemapEntry((prefix) => `/${prefix}/project/${id}/${DEFAULT_DOCS_VERSION}`, langs, {
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7
      })
    );
  }

  return entries;
}
