import MarkdownPage from '@/components/about/MarkdownPage';
import Content from './content.mdx';
import { Metadata } from 'next';
import { LocaleRouteParams } from '@repo/shared/types/routes';
import { metaDocsMetadata } from '@/components/about/MetaDocsPage';
import { setContextLocale } from '@/lib/locales/routing';

export async function generateMetadata(props: { params: Promise<LocaleRouteParams> }): Promise<Metadata> {
  const { locale } = await props.params;
  setContextLocale(locale);

  return metaDocsMetadata('privacy', locale);
}

export default function PrivacyPage() {
  return <MarkdownPage content={Content} />;
}
