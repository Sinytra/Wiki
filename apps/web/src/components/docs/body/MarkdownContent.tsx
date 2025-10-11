export interface Props {
  content: string;
}

export function RenderedMarkdownContent({ htmlContent }: { htmlContent: string; }) {
  return (
    <article className="docsContentArticle prose w-full max-w-full dark:prose-invert prose-h2:mt-8">
      <div className="[&>_:first-child]:mt-0!" dangerouslySetInnerHTML={({__html: htmlContent})} />
    </article>
  );
}