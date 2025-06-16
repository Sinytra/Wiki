import MetaDocsPage from "@/components/meta-docs/MetaDocsPage";
import {setContextLocale} from "@/lib/locales/routing";

export default async function DevsSubpathPage({params}: { params: { locale: string; path: string[] } }) {
  setContextLocale(params.locale);
  return <MetaDocsPage name={`devs/${params.path.join('/')}`} locale={params.locale} />;
}
