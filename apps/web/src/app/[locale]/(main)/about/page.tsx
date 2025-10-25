import MetaDocsPage from "@/components/about/MetaDocsPage";
import {setContextLocale} from "@/lib/locales/routing";

export default async function AboutPage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  setContextLocale(params.locale);

  return (
    <MetaDocsPage name="about" locale={params.locale} />
  )
}
