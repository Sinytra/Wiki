import type {MetadataRoute} from 'next';
import available from "@/lib/locales/available";
import remoteServiceApi from "@/lib/service/remoteServiceApi";
import {DEFAULT_DOCS_VERSION} from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!process.env.NEXT_PUBLIC_NEXT_APP_URL) {
    return [];
  }

  const allProjects = await remoteServiceApi.getAllProjectIDs();
  if ('error' in allProjects) {
    return [];
  }

  const languageKeys = available.getLanguagePaths().filter(l => l !== 'en');

  return allProjects.map(id => {
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