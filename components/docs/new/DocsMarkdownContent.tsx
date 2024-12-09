import { ReactNode } from "react";

interface DocsMarkdownContentProps {
  children: ReactNode;
}

export default function DocsMarkdownContent({ children }: DocsMarkdownContentProps) {
  return (
    <div className="prose dark:prose-invert min-w-full">
      {children}
    </div>
  );
}
