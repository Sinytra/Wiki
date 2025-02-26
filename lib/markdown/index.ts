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
import ProjectRecipe from "@/components/docs/shared/game/ProjectRecipe";
import ContentLink from "@/components/docs/shared/ContentLink";
import matter from 'gray-matter';
import LinkAwareHeading from "@/components/docs/LinkAwareHeading";
import RecipeUsage from "@/components/docs/shared/game/RecipeUsage";

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

async function renderMarkdownWithMetadata(source: string): Promise<DocumentationMarkdown> {
  const {content, frontmatter} = await compileMDX({
    source,
    options: {
      mdxOptions: {
        rehypePlugins: [
          rehypeMarkdownHeadings,
          () => (tree: any) => {
            const newTree = {...tree};
            return sanitizeHastTree(newTree, {});
          }
        ]
      },
      parseFrontmatter: true
    }
  });
  return {content, metadata: frontmatter || {}};
}

async function renderDocumentationMarkdown(source: string): Promise<DocumentationMarkdown> {
  const icons = Object.keys(LucideReact)
    .filter(key => key.endsWith('Icon'))
    .reduce((obj, key) => {
      // @ts-ignore
      obj[key] = LucideReact[key];
      return obj;
    }, {});
  const components = {
    CraftingRecipe, Callout, CodeHikeCode, ModAsset, Asset, CodeTabs, ProjectRecipe, ContentLink, RecipeUsage,
    ...icons,
    h2: LinkAwareHeading
  };
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
            const newTree = {...tree};
            return sanitizeHastTree(newTree, components);
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

function sanitizeHastTree(tree: any, components: any) {
  if (mdxElemets.includes(tree.type)) {
    if (components[tree.name] !== undefined || markdownRehypeSchema.tagNames!.includes(tree.name)) {
      return tree;
    }
    return null;
  }

  let sanitized = tree;
  if (tree.tagName && !markdownRehypeSchema.tagNames!.includes(tree.tagName)) {
    return null;
  }
  if (tree.children) {
    sanitized.children = tree.children
      .map((c: any) => sanitizeHastTree(c, components))
      .filter((c: any) => c != null);
  }

  return sanitized;
}

function readFrontmatter(source: string): any {
  return matter(source).data;
}

export default {
  renderMarkdown,
  renderDocumentationMarkdown,
  readFrontmatter,
  renderMarkdownWithMetadata
};
