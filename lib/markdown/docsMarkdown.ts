import rehypeSanitize from "rehype-sanitize";
import {DocsEntryMetadata} from "@/lib/docs/metadata";

import {markdownRehypeSchema} from "./contentFilter";
import {compileMDX} from "next-mdx-remote/rsc";
import CraftingRecipe from "@/components/docs/shared/CraftingRecipe";
import {ReactElement} from "react";

declare module 'vfile' {
  interface DataMap {
    matter: DocsEntryMetadata
  }
}

export interface DocumentationMarkdown {
  content: ReactElement;
  metadata: DocsEntryMetadata;
}

async function renderDocumentationMarkdown(source: string): Promise<DocumentationMarkdown> {
  const components = {CraftingRecipe};

  const {content, frontmatter} = await compileMDX({
    source,
    options: {
      mdxOptions: {
        rehypePlugins: [
          [() => (tree: any) => {
            const sanitizer = rehypeSanitize(markdownRehypeSchema);
            const newTree = {...tree};
            // TODO Ensure this is safe
            // @ts-ignore
            newTree.children = newTree.children.map((c: any) => c.type === 'mdxJsxFlowElement' && components[c.name] !== undefined ? c : sanitizer(c));
            return newTree;
          }, {}]
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

const docsMarkdown = {
  renderDocumentationMarkdown
};

export default docsMarkdown;
