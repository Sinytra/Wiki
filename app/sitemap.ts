import type {MetadataRoute} from 'next';
import available from "@/lib/locales/available";
import remoteServiceApi from "@/lib/service/remoteServiceApi";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!process.env.NEXT_APP_URL) {
    return [];
  }

  const allMods = await remoteServiceApi.getAllProjectIDs();
  const languageKeys = available.getLanguagePaths().filter(l => l !== 'en');

  return allMods.map(id => {
    let languages: any = {};
    languageKeys.forEach(l => {
      languages[l] = `${process.env.NEXT_APP_URL}/${l}/mod/${id}`;
    });

    return {
      url: `${process.env.NEXT_APP_URL}/en/mod/${id}/docs`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      alternates: {
        languages
      }
    };
  });
}