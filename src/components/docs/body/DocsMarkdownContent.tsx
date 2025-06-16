import { ReactNode } from "react";

interface DocsMarkdownContentProps {
  children: ReactNode;
}

export default function DocsMarkdownContent({ children }: DocsMarkdownContentProps) {
  return (
    <article className="docsContentArticle prose min-w-full dark:prose-invert">
      {children}
    </article>
  );
}
