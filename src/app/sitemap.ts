import type {MetadataRoute} from 'next';
import available from "@/lib/locales/available";
import {DEFAULT_DOCS_VERSION} from "@repo/shared/constants";
import projectApi from "@/lib/service/api/projectApi";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!process.env.NEXT_PUBLIC_NEXT_APP_URL) {
    return [];
  }

  const allProjects = await projectApi.getAllProjectIDs();
  if (!allProjects.success) {
    return [];
  }

  const languageKeys = available.getLanguagePaths().filter(l => l !== 'en');

  return allProjects.data.map(id => {
    let languages: any = {};
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