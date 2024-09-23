import MetaDocsPage from "@/components/meta-docs/MetaDocsPage";

export default async function PublishingPage({params}: { params: { locale: string } }) {
  return <MetaDocsPage name="publishing" locale={params.locale} />;
}
