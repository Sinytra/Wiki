import type {MetadataRoute} from 'next';
import available from "@/lib/locales/available";
import remoteServiceApi from "@/lib/service/remoteServiceApi";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!process.env.NEXT_APP_URL) {
    return [];
  }

  const allProjects = await remoteServiceApi.getAllProjectIDs();
  const languageKeys = available.getLanguagePaths().filter(l => l !== 'en');

  return allProjects.map(id => {
    let languages: any = {};
    languageKeys.forEach(l => {
      languages[l] = `${process.env.NEXT_APP_URL}/${l}/project/${id}`;
    });

    return {
      url: `${process.env.NEXT_APP_URL}/en/project/${id}/docs`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      alternates: {
        languages
      }
    };
  });
}