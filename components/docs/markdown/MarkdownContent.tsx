import markdown from "@/lib/markdown";

export interface Props {
  content: string;
}

export default async function MarkdownContent({content}: Props) {
  const htmlContent = await markdown.renderMarkdown(content);

  return (
    <article className="prose !max-w-3xl prose-h2:mt-8 dark:prose-invert">
      <div dangerouslySetInnerHTML={({__html: htmlContent})} />
    </article>
  );
}