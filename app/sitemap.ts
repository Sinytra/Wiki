import type {MetadataRoute} from 'next';
import database from "../lib/base/database";
import available from "@/lib/locales/available";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!process.env.NEXT_APP_URL) {
    return [];
  }

  const allMods = await database.getAllProjectIDs();
  const languageKeys = Object.keys(available.getAvailableLocales()).filter(l => l !== 'en');

  return allMods.map(m => {
    let languages: any = {};
    languageKeys.forEach(l => {
      languages[l] = `${process.env.NEXT_APP_URL}/${l}/mod/${m.id}`;
    });

    return {
      url: `${process.env.NEXT_APP_URL}/en/mod/${m.id}/docs`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      alternates: {
        languages
      }
    };
  });
}