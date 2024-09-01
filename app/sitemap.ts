import type {MetadataRoute} from 'next';
import database from "@/lib/database";

export default async function sitemap(): MetadataRoute.Sitemap {
  if (!process.env.NEXT_APP_URL) {
    return [];
  }

  const allMods = await database.getAllProjectIDs();

  return allMods.map(m => ({
    url: `${process.env.NEXT_APP_URL}/mod/${m.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly'
  }));
}