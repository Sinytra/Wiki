import MetaDocsPage from "@/components/meta-docs/MetaDocsPage";

export default async function FormatPage({params}: { params: { locale: string } }) {
  return <MetaDocsPage name="format" locale={params.locale} />;
}
