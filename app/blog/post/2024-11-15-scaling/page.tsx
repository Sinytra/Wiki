import {setContextLocale} from "@/lib/locales/routing";
import {notFound} from "next/navigation";

export default async function IntroductionPostPage() {
  setContextLocale('en');

  try {
    const Content = (await import(`./post.mdx`)).default;
    return <Content/>;
  } catch (e) {
    notFound();
  }
}
