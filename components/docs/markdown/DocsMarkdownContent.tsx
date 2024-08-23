import {ReactElement} from "react";

export interface Props {
  content: ReactElement;
}

export default async function DocsMarkdownContent({content}: Props) {
  return (
    <article className="prose !max-w-3xl prose-h2:mt-8 dark:prose-invert prose-h2:border-b prose-h2:border-neutral-700 prose-h2:pb-3 prose-h2:mb-4">
      {content}
    </article>
  );
}
