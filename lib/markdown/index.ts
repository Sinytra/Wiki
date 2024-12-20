import {unified} from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeSanitize from 'rehype-sanitize';
import rehypeRaw from "rehype-raw";

import {markdownRehypeSchema} from "./contentFilter";
import {ReactElement} from "react";
import {DocsEntryMetadata} from "@/lib/docs/metadata";
import CraftingRecipe from "@/components/docs/shared/CraftingRecipe";
import Callout from "@/components/docs/shared/Callout";
import ModAsset from "@/components/docs/shared/ModAsset";
import {compileMDX} from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeMarkdownHeadings from "@/lib/markdown/headings";
import rehypePrettyCode from "rehype-pretty-code";
import * as LucideReact from "lucide-react";
import Asset from "@/components/docs/shared/Asset";

export interface DocumentationMarkdown {
  content: ReactElement;
  metadata: DocsEntryMetadata;
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
  const icons = Object.keys(LucideReact)
    .filter(key => key.endsWith('Icon'))
    .reduce((obj, key) => {
      // @ts-ignore
      obj[key] = LucideReact[key];
      return obj;
    }, {});
  const components = {CraftingRecipe, Callout, ModAsset, Asset, ...icons};

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
            return sanitizeHastTree(newTree, sanitizer, components);
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

const mdxElemets = ['mdxJsxFlowElement', 'mdxJsxTextElement'];

function sanitizeHastTree(tree: any, sanitizer: (tree: any) => any, components: any) {
  if (tree.children) {
    tree.children = tree.children.map((c: any) => sanitizeHastTree(c, sanitizer, components));
  }

  if (mdxElemets.includes(tree.type) && (components[tree.name] !== undefined || markdownRehypeSchema.tagNames!.includes(tree.name))) {
    return tree;
  }

  return tree.children ? tree : sanitizer(tree);
}

export default {
  renderMarkdown,
  renderDocumentationMarkdown
};
