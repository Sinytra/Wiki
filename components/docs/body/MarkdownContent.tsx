import markdown from "@repo/markdown";

export interface Props {
  content: string;
}

export default async function MarkdownContent({content}: Props) {
  const htmlContent = await markdown.renderMarkdown(content);

  return (
    <article className="docsContentArticle prose w-full max-w-full dark:prose-invert prose-h2:mt-8">
      <div className="[&>_:first-child]:mt-0!" dangerouslySetInnerHTML={({__html: htmlContent})} />
    </article>
  );
}