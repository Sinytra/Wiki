import {notFound} from "next/navigation";

export default async function MetaDocsPage({name, locale}: { name: string; locale: string }) {
  try {
    const Content = (await import(`../../../docs/${name}/${locale}.mdx`)).default;
    return <Content/>;
  } catch (error) {
    
  }

  try {
    const Content = (await import(`../../../docs/${name}/en.mdx`)).default;
    return <Content/>;
  } catch (e) {
    notFound();
  }
}