import MetaDocsPage from "@/components/meta-docs/MetaDocsPage";
import {setContextLocale} from "@/lib/locales/routing";

export default async function FormatPage({params}: { params: { locale: string } }) {
  setContextLocale(params.locale);
  return <MetaDocsPage name="devs/structure" locale={params.locale} />;
}
