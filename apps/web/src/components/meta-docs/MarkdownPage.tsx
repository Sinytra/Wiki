import {setContextLocale} from "@/lib/locales/routing";
import {notFound} from "next/navigation";
import {MDXProps} from "mdx/types";
import {JSX} from "react";

export default async function MarkdownPage({ content: Content }: { content: (props: MDXProps) => JSX.Element }) {
  setContextLocale('en');

  try {
    return <Content />;
  } catch {
    notFound();
  }
}