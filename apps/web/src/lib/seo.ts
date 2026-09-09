import { Metadata } from 'next';
import locales, { DEFAULT_LOCALE_CODE } from '@repo/shared/locales';
import { ProjectRouteParams } from '@repo/shared/types/routes';
import { ProjectData } from '@sinytra/wiki-api-types';
import { rawPagePath } from '@/lib/discovery/rawPage';

export const SITE_NAME = 'Modded Minecraft Wiki';
export const SITE_DESCRIPTION = 'The Wiki for all of Modded Minecraft. Presented by Sinytra.';
export const OG_IMAGE_SIZE = { width: 1200, height: 630 };

export type LocalizedPath = (prefix: string) => string;

export interface PageMetadataOptions {
  locale: string;
  path: LocalizedPath;
  languages?: string[];
  markdown?: boolean;
  image?: string;
  description?: string;
}

export function pageMetadata({ locale, path, languages, markdown, image, description }: PageMetadataOptions): Metadata {
  const canonical = path(locale);

  const langs = languages === undefined ? locales.getAvailableLocales() : resolveLanguages(languages);
  const hreflang: Record<string, string> = {};
  for (const lang of langs) {
    hreflang[lang.internal] = path(lang.prefix);
  }
  const defaultLang = locales.getForCode(DEFAULT_LOCALE_CODE);
  if (Object.keys(hreflang).length > 0 && defaultLang) {
    hreflang['x-default'] = path(defaultLang.prefix);
  }

  return {
    ...(description ? { description } : {}),
    alternates: {
      canonical,
      ...(Object.keys(hreflang).length > 0 ? { languages: hreflang } : {}),
      ...(markdown ? { types: { 'text/markdown': rawPagePath(canonical) } } : {})
    },
    openGraph: {
      siteName: SITE_NAME,
      type: 'website',
      url: canonical,
      ...(image ? { images: [{ url: image, ...OG_IMAGE_SIZE }] } : {})
    }
  };
}

export type ProjectPageMetadataOptions = Omit<PageMetadataOptions, 'locale' | 'languages' | 'image'> & {
  // OG image query params
  image?: Record<string, string>;
};

export function projectPageMetadata(
  project: ProjectData,
  params: ProjectRouteParams,
  { image, ...options }: ProjectPageMetadataOptions
): Metadata {
  return pageMetadata({
    locale: params.locale,
    languages: project.locales,
    image: projectOgImage(params, image),
    ...options
  });
}

function projectOgImage(params: ProjectRouteParams, extra: Record<string, string> = {}): string {
  const query = new URLSearchParams({ slug: params.slug, locale: params.locale, version: params.version, ...extra });
  return `/api/og?${query}`;
}

function resolveLanguages(codes: string[]) {
  const all = new Set([DEFAULT_LOCALE_CODE, ...codes]);
  return [...all].map((code) => locales.getForCode(code)).filter((l) => l != null);
}
