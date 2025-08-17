import MetaDocsPage from "@/components/meta-docs/MetaDocsPage";
import {setContextLocale} from "@/lib/locales/routing";
import {LocaleRouteParams} from "@repo/shared/types/routes";

export default async function HelpPage(props: { params: Promise<LocaleRouteParams> }) {
  const params = await props.params;
  setContextLocale(params.locale);
  return <MetaDocsPage name="help" locale={params.locale} />;
}
