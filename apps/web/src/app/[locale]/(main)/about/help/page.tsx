import MetaDocsPage, { metaDocsMetadata } from '@/components/about/MetaDocsPage';
import { setContextLocale } from '@/lib/locales/routing';
import { LocaleRouteParams } from '@repo/shared/types/routes';
import { Metadata } from 'next';

export async function generateMetadata(props: { params: Promise<LocaleRouteParams> }): Promise<Metadata> {
  const { locale } = await props.params;
  setContextLocale(locale);

  return metaDocsMetadata('help', locale);
}

export default async function HelpPage(props: { params: Promise<LocaleRouteParams> }) {
  const params = await props.params;
  setContextLocale(params.locale);
  return <MetaDocsPage name="help" locale={params.locale} />;
}
