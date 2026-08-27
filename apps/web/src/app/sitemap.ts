import type { MetadataRoute } from 'next';
import { DEFAULT_DOCS_VERSION } from '@repo/shared/constants';
import projectApi from '@/lib/service/api/projectApi';
import locales from '@repo/shared/locales';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!process.env.NEXT_PUBLIC_NEXT_APP_URL) {
    return [];
  }

  const allProjects = await projectApi.getAllProjects();
  if (!allProjects.success) {
    return [];
  }

  return allProjects.data.map((brief) => {
    const { id, locales: langs } = brief;

    const languages: any = {};
    langs
      .map((l) => locales.getForCode(l))
      .filter((l) => l != null)
      .forEach((l) => {
        languages[l.internal] = `${process.env.NEXT_PUBLIC_NEXT_APP_URL}/${l.prefix}/project/${id}`;
      });

    return {
      url: `${process.env.NEXT_PUBLIC_NEXT_APP_URL}/en/project/${id}/${DEFAULT_DOCS_VERSION}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      alternates: {
        languages
      }
    };
  });
}
