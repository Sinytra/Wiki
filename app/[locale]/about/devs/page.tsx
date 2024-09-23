import MetaDocsPage from "@/components/meta-docs/MetaDocsPage";

export default async function DevsPage({params}: { params: { locale: string } }) {
  return <MetaDocsPage name="devs" locale={params.locale} />;
}
