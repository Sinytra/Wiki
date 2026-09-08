import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ComponentType } from 'react';
import locales from '@repo/shared/locales';
import { pageMetadata } from '@/lib/seo';
import { DEFAULT_LOCALE } from '@repo/shared/constants';
import { getTranslations } from 'next-intl/server';

type LocalizedMetaPage = 'about' | 'help';
type MetaDocsPage = LocalizedMetaPage | 'tos' | 'privacy' | 'security';

function isLocalized(name: MetaDocsPage): name is LocalizedMetaPage {
  return name === 'about' || name === 'help';
}

async function getContents(name: LocalizedMetaPage, locale: string): Promise<ComponentType | null> {
  try {
    return (await import(`../../docs/${name}/${locale}.mdx`)).default;
  } catch {
    return null;
  }
}

async function getAvailableLanguages(name: LocalizedMetaPage): Promise<string[]> {
  const codes = await Promise.all(
    locales.getAvailableLocales().map(async (lang) => ((await getContents(name, lang.prefix)) ? lang.code : null))
  );
  return codes.filter((code) => code != null);
}

export async function metaDocsMetadata(name: MetaDocsPage, locale: string): Promise<Metadata> {
  const t = await getTranslations('MetaDocsNavigation');
  const languages = isLocalized(name) ? await getAvailableLanguages(name) : [];

  return {
    title: t(name),
    ...pageMetadata({
      locale,
      path: (prefix) => `/${prefix}/about${name === 'about' ? '' : `/${name}`}`,
      languages
    })
  };
}

export default async function MetaDocsPage({ name, locale }: { name: LocalizedMetaPage; locale: string }) {
  const Content = (await getContents(name, locale)) ?? (await getContents(name, DEFAULT_LOCALE));
  if (!Content) {
    notFound();
  }
  return <Content />;
}
