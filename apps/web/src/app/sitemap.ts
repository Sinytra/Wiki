import type {MetadataRoute} from 'next';
import {DEFAULT_DOCS_VERSION} from "@repo/shared/constants";
import projectApi from "@/lib/service/api/projectApi";
import locales from "@repo/lang/locales";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!process.env.NEXT_PUBLIC_NEXT_APP_URL) {
    return [];
  }

  const allProjects = await projectApi.getAllProjectIDs();
  if (!allProjects.success) {
    return [];
  }

  const languageKeys = locales.getLanguagePaths().filter(l => l !== 'en');

  return allProjects.data.map(id => {
    const languages: any = {};
    languageKeys.forEach(l => {
      languages[l] = `${process.env.NEXT_PUBLIC_NEXT_APP_URL}/${l}/project/${id}`;
    });

    // TODO Update for SEO
    return {
      url: `${process.env.NEXT_PUBLIC_NEXT_APP_URL}/en/project/${id}/${DEFAULT_DOCS_VERSION}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      alternates: {
        languages
      }
    };
  });
}