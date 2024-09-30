import MetaDocsPage from "@/components/meta-docs/MetaDocsPage";
import {setContextLocale} from "@/lib/locales/routing";

export default async function PublishingPage({params}: { params: { locale: string } }) {
  setContextLocale(params.locale);
  return <MetaDocsPage name="publishing" locale={params.locale} />;
}
