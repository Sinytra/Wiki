import markdown from "@/lib/markdown";

export interface Props {
  content: string;
}

export default async function MarkdownContent({content}: Props) {
  const htmlContent = await markdown.renderMarkdown(content);

  return (
    <div className="prose dark:prose-invert">
      <div dangerouslySetInnerHTML={({__html: htmlContent})} />
    </div>
  );
}