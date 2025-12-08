import locales from "@repo/shared/locales";
import {time} from "@repo/shared/constants";

interface CrowdinResponse<T> {
  data: T
}

interface CrowdinTranslationResponse<T> {
  data: T
}

interface CrowdinLanguageData {
  translationProgress: number
}

async function getCrowdinTranslationStatus(lang: string): Promise<number> {
  if (process.env.CROWDIN_PROJECT_ID && process.env.CROWDIN_API_KEY) {
    try {
      const crowdinLangId = locales.getCrowdinLanguageId(lang)!;
      const resp = await fetch(`https://api.crowdin.com/api/v2/projects/${process.env.CROWDIN_PROJECT_ID}/languages/progress?languageIds=${crowdinLangId}`, {
        headers: {
          Authorization: `Bearer ${process.env.CROWDIN_API_KEY}`
        },
        cache: 'force-cache',
        next: {
          revalidate: time.ONE_MONTH
        }
      });
      if (resp.ok) {
        const data = await resp.json() as CrowdinResponse<CrowdinTranslationResponse<CrowdinLanguageData>[]>;
        if (data.data.length > 0) {
          return data.data[0]!.data.translationProgress;
        }
      } else {
        console.error('Error response getting crowdin translation status', await resp.text());
      }
    } catch (err) {
      console.error(`Error getting crowdin translation status for ${lang}`, err);
    }
  }
  return 0;
}

export default {
  getCrowdinTranslationStatus
}
