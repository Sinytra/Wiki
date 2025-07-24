import MetaDocsPage from "@/components/meta-docs/MetaDocsPage";
import {setContextLocale} from "@/lib/locales/routing";

export default async function DevsSubpathPage(props: { params: Promise<{ locale: string; path: string[] }> }) {
  const params = await props.params;
  setContextLocale(params.locale);
  return <MetaDocsPage name={`devs/${params.path.join('/')}`} locale={params.locale} />;
}
