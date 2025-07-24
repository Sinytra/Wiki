import MetaDocsPage from "@/components/meta-docs/MetaDocsPage";
import {setContextLocale} from "@/lib/locales/routing";

export default async function DevsPage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  setContextLocale(params.locale);
  return <MetaDocsPage name="devs" locale={params.locale} />;
}
