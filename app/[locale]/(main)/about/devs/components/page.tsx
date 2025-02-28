import MetaDocsPage from "@/components/meta-docs/MetaDocsPage";
import {setContextLocale} from "@/lib/locales/routing";

export default async function ComponentsPage({params}: { params: { locale: string } }) {
  setContextLocale(params.locale);
  return <MetaDocsPage name="devs/components" locale={params.locale} />;
}
