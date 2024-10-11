import {unified} from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeSanitize from 'rehype-sanitize';
import rehypeRaw from "rehype-raw";

import {markdownRehypeSchema} from "./contentFilter";
import docsMarkdown, {DocumentationMarkdown} from "./docsMarkdown";
import sources, {DocumentationFile, DocumentationSource, RemoteDocumentationSource} from "@/lib/docs/sources";

interface RenderedFile {
  file: DocumentationFile;
  content: DocumentationMarkdown;
  edit_url?: string;
}

async function renderMarkdown(content: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype, {allowDangerousHtml: true})
    .use(rehypeRaw)
    .use(rehypeSanitize, markdownRehypeSchema)
    .use(rehypeStringify)
    .process(content);

  return String(file);
}

async function renderDocumentationFile(source: DocumentationSource, path: string[], locale: string): Promise<RenderedFile> {
  const file = await sources.readDocsFile(source, path, locale);
  const content = await markdown.renderDocumentationMarkdown(file.content);
  const edit_url = source.type === 'github' && (source as RemoteDocumentationSource).editable ? file.edit_url : null;

  return {
    file,
    content,
    edit_url: edit_url !== null ? edit_url : undefined
  }
}

const markdown = {
  renderMarkdown,
  renderDocumentationFile,
  ...docsMarkdown
};

export default markdown;