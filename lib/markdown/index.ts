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
import {recmaCodeHike, remarkCodeHike} from "codehike/mdx";
import * as LucideReact from "lucide-react";
import Asset from "@/components/docs/shared/Asset";
import CodeTabs from "@/components/docs/shared/CodeTabs";
import CodeHikeCode from "@/components/util/CodeHikeCode";

export interface DocumentationMarkdown {
  content: ReactElement;
  metadata: DocsEntryMetadata;
}

function cleanFrontmatter(input: string) {
  const lines = input.split('\n');
  if (lines.length < 1 || !lines[0].startsWith('---')) {
    return input;
  }

  let count = 0;
  return lines.map(line => {
    if (count < 2 && line.startsWith('---')) {
      count++;
      return line.trimEnd();
    }
    return line;
  }).join('\n');
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
  const components = {CraftingRecipe, Callout, CodeHikeCode, ModAsset, Asset, CodeTabs, ...icons};
  const chConfig = {
    components: { code: "CodeHikeCode" },
  }

  const cleanSource = cleanFrontmatter(source);

  const {content, frontmatter} = await compileMDX({
    source: cleanSource,
    options: {
      mdxOptions: {
        remarkPlugins: [[remarkCodeHike, chConfig], remarkGfm],
        rehypePlugins: [
          rehypeMarkdownHeadings,
          () => (tree: any) => {
            const sanitizer = rehypeSanitize(markdownRehypeSchema);
            const newTree = {...tree};
            return sanitizeHastTree(newTree, sanitizer, components);
          }
        ],
        recmaPlugins: [[recmaCodeHike, chConfig]]
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
  if (mdxElemets.includes(tree.type) && (components[tree.name] !== undefined || markdownRehypeSchema.tagNames!.includes(tree.name))) {
    return tree;
  }

  let sanitized = sanitizer(tree);
  if (tree.children) {
    sanitized.children = tree.children.map((c: any) => sanitizeHastTree(c, sanitizer, components));
  }

  return sanitized;
}

export default {
  renderMarkdown,
  renderDocumentationMarkdown
};
