import MetaDocsPage, { metaDocsMetadata } from '@/components/about/MetaDocsPage';
import { setContextLocale } from '@/lib/locales/routing';
import { Metadata } from 'next';
import { LocaleRouteParams } from '@repo/shared/types/routes';

export async function generateMetadata(props: { params: Promise<LocaleRouteParams> }): Promise<Metadata> {
  const { locale } = await props.params;
  setContextLocale(locale);

  return metaDocsMetadata('about', locale);
}

export default async function AboutPage(props: { params: Promise<LocaleRouteParams> }) {
  const params = await props.params;
  setContextLocale(params.locale);

  return <MetaDocsPage name="about" locale={params.locale} />;
}
