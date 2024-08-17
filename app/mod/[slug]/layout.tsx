import {redirect, RedirectType} from "next/navigation";
import sources from "@/lib/docs/sources";

export default async function ModLayout({children, params}: Readonly<{
  children: React.ReactNode;
  params: { slug: string }
}>) {
  try {
    await sources.getProjectSource(params.slug);

    return <>{children}</>;
  } catch (e) {
    redirect('/', RedirectType.replace);
  }
}