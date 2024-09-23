import MetaDocsPage from "@/components/meta-docs/MetaDocsPage";

export default async function AboutPage({params}: { params: { locale: string } }) {
  return <MetaDocsPage name="about" locale={params.locale} />;
}
