import { ReactNode } from "react";

interface DocsMarkdownContentProps {
  children: ReactNode;
}

export default function DocsMarkdownContent({ children }: DocsMarkdownContentProps) {
  return (
    <article className="docsContentArticle prose dark:prose-invert min-w-full">
      {children}
    </article>
  );
}
