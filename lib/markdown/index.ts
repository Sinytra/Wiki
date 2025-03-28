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
import remarkGfm from "remark-gfm";
import rehypeMarkdownHeadings from "@/lib/markdown/headings";
import {recmaCodeHike, remarkCodeHike} from "codehike/mdx";
import * as LucideReact from "lucide-react";
import Asset from "@/components/docs/shared/Asset";
import CodeTabs from "@/components/docs/shared/CodeTabs";
import CodeHikeCode from "@/components/util/CodeHikeCode";
import {VFile} from 'vfile';
import {matter} from 'vfile-matter';
import {compile, run} from "@mdx-js/mdx";
import * as runtime from 'react/jsx-runtime';
import ContentLink from "@/components/docs/shared/ContentLink";
import ProjectRecipe from "@/components/docs/shared/game/ProjectRecipe";
import RecipeUsage from "@/components/docs/shared/game/RecipeUsage";
import LinkAwareHeading from "@/components/docs/LinkAwareHeading";

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
  const components = {
    CraftingRecipe, Callout, CodeHikeCode, ModAsset, Asset, CodeTabs, ProjectRecipe, ContentLink, RecipeUsage,
    ...icons,
    h2: LinkAwareHeading
  };
  const chConfig = {
    components: {code: 'CodeHikeCode'},
  }

  const cleanSource = cleanFrontmatter(source);

  const vfile = new VFile(cleanSource);
  matter(vfile, {strip: true});

  const frontmatter = vfile.data.matter ?? {};

  try {
    const compiledMdx = await compile(vfile, {
      outputFormat: 'function-body',

      remarkPlugins: [[remarkCodeHike, chConfig], remarkGfm],
      rehypePlugins: [
        rehypeMarkdownHeadings,
        () => (tree: any) => {
          const newTree = {...tree};
          return sanitizeHastTree(newTree, components);
        }
      ],
      recmaPlugins: [[recmaCodeHike, chConfig]]
    });

    // @ts-ignore
    const {default: MDXContent} = await run(compiledMdx, {
      ...runtime,
      baseUrl: import.meta.url,
    });

    return {
      content: MDXContent({components}),
      metadata: frontmatter
    };
  } catch (error: any) {
    console.error('MDX Compilation error:', error);
    throw new Error('MDX compilation failed');
  }
}

const mdxElemets = ['mdxJsxFlowElement', 'mdxJsxTextElement'];

function sanitizeHastTree(tree: any, components: any) {
  if (mdxElemets.includes(tree.type)) {
    if (components[tree.name] !== undefined) {
      return tree;
    }
    if (!tree.name || !markdownRehypeSchema.tagNames!.includes(tree.name)) {
      return null;
    }
  } else {
    if (tree.tagName && !markdownRehypeSchema.tagNames!.includes(tree.tagName)) {
      return null;
    }
  }

  let sanitized = tree;
  if (tree.children) {
    sanitized.children = tree.children
      .map((c: any) => sanitizeHastTree(c, components))
      .filter((c: any) => c != null);
  }
  return sanitized;
}

function readFrontmatter(source: string): any {
  const vfile = new VFile(source);
  matter(vfile, {strip: true});
  return vfile.data.matter ?? {};
}

export default {
  renderMarkdown,
  renderDocumentationMarkdown,
  readFrontmatter
};
