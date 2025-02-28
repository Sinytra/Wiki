import MetaDocsPage from "@/components/meta-docs/MetaDocsPage";
import {setContextLocale} from "@/lib/locales/routing";

export default function AboutPage({params}: { params: { locale: string } }) {
  setContextLocale(params.locale);

  return (
    <MetaDocsPage name="about" locale={params.locale} />
  )
}
