export interface Props {
  htmlContent: string;
}

export default async function DocsMarkdownContent({htmlContent}: Props) {
  return (
    <article className="prose !max-w-3xl prose-h2:mt-8 dark:prose-invert prose-h2:border-b prose-h2:border-neutral-700 prose-h2:pb-3 prose-h2:mb-4">
      <div className="[&>_:first-child]:!mt-0" dangerouslySetInnerHTML={({__html: htmlContent})} />
    </article>
  );
}
