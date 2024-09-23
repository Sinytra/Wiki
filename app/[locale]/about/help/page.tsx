import MetaDocsPage from "@/components/meta-docs/MetaDocsPage";

export default async function HelpPage({params}: { params: { locale: string } }) {
  return <MetaDocsPage name="help" locale={params.locale} />;
}
