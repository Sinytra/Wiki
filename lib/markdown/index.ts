import {unified} from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeSanitize from 'rehype-sanitize';
import rehypeRaw from "rehype-raw";

import {markdownRehypeSchema} from "./contentFilter";
import sources, {DocumentationFile, DocumentationSource, RemoteDocumentationSource} from "@/lib/docs/sources";
import {ReactElement} from "react";
import {DocsEntryMetadata} from "@/lib/docs/metadata";
import CraftingRecipe from "@/components/docs/shared/CraftingRecipe";
import Callout from "@/components/docs/shared/Callout";
import ModAsset from "@/components/docs/shared/ModAsset";
import {compileMDX} from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeMarkdownHeadings from "@/lib/markdown/headings";
import rehypePrettyCode from "rehype-pretty-code";

export interface DocumentationMarkdown {
  content: ReactElement;
  metadata: DocsEntryMetadata;
}

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

async function renderDocumentationMarkdown(source: string): Promise<DocumentationMarkdown> {
  const components = {CraftingRecipe, Callout, ModAsset};

  const {content, frontmatter} = await compileMDX({
    source,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          [rehypePrettyCode, {theme: 'plastic'}],
          rehypeMarkdownHeadings,
          () => (tree: any) => {
            const sanitizer = rehypeSanitize(markdownRehypeSchema);
            const newTree = {...tree};
            // @ts-ignore
            newTree.children = newTree.children.map((c: any) => c.type === 'mdxJsxFlowElement' && (components[c.name] !== undefined || markdownRehypeSchema.tagNames!.includes(c.name)) ? c : sanitizer(c));
            return newTree;
          }
        ]
      },
      parseFrontmatter: true
    },
    components
  });

  return {
    content,
    metadata: frontmatter || {}
  };
}

async function renderDocumentationFile(source: DocumentationSource, path: string[], locale: string): Promise<RenderedFile> {
  const file = await sources.readDocsFile(source, path, locale);
  const content = await renderDocumentationMarkdown(file.content);
  const edit_url = source.type === 'github' && (source as RemoteDocumentationSource).editable ? file.edit_url : null;

  return {
    file,
    content,
    edit_url: edit_url !== null ? edit_url : undefined
  }
}

export default {
  renderMarkdown,
  renderDocumentationFile
};
