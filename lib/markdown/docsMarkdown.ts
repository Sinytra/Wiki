import {unified} from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import remarkFrontmatter from "remark-frontmatter";
import {matter} from "vfile-matter";
import {DocsEntryMetadata} from "@/lib/docs/metadata";

import {markdownRehypeSchema} from "./contentFilter";

declare module 'vfile' {
  interface DataMap {
    matter: DocsEntryMetadata
  }
}

export interface DocumentationMarkdown {
  content: string;
  metadata: DocsEntryMetadata;
}

async function renderDocumentationMarkdown(content: string): Promise<DocumentationMarkdown> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype, {allowDangerousHtml: true})
    .use(rehypeRaw)
    .use(rehypeSanitize, markdownRehypeSchema)
    .use(rehypeStringify)
    .use(remarkFrontmatter, ['yaml'])
    .use(() => (_, file) => matter(file))
    .process(content);

  return {
    content: String(file),
    metadata: file.data.matter || {}
  };
}

export default {
  renderDocumentationMarkdown
}
