import {unified} from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeSanitize from 'rehype-sanitize';
import rehypeRaw from 'rehype-raw';
import {markdownRehypeSchema} from './contentFilter';
import {ReactElement} from 'react';
import remarkGfm from 'remark-gfm';
import rehypeMarkdownHeadings from './headings';
import {recmaCodeHike, remarkCodeHike} from 'codehike/mdx';
import * as LucideReact from 'lucide-react';
import {VFile} from 'vfile';
import {matter} from 'vfile-matter';
import {compile, run} from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import { MarkdownError, formatMarkdownError } from './exception';
import { DocsEntryMetadata } from './metadata';

export interface DocumentationMarkdown {
  content: ReactElement<any>;
  metadata: DocsEntryMetadata;
}

export type ComponentPatcher = (components: Record<string, any>) => Record<string, any>;

function cleanFrontmatter(input: string) {
  const lines = input.split('\n');
  if (lines.length < 1 || !lines[0]!.startsWith('---')) {
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

async function renderDocumentationMarkdown(
  source: string, includeComponents: Record<string, any>, patcher?: ComponentPatcher
): Promise<DocumentationMarkdown> {
  const icons = Object.keys(LucideReact)
    .filter(key => key.endsWith('Icon'))
    .reduce((obj, key) => {
      // @ts-expect-error assign icons
      obj[key] = LucideReact[key];
      return obj;
    }, {});
  let components: Record<string, any> = {
    ...icons,
    ...includeComponents
  };
  if (patcher) {
    components = patcher(components);
  }
  const chConfig = {
    components: {code: 'CodeHikeCode'},
  };

  const cleanSource = cleanFrontmatter(source);

  const vfile = new VFile(cleanSource);
  matter(vfile, {strip: true});

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

    const frontmatter = compiledMdx.data.matter ?? {};

    const {default: MDXContent} = await run(compiledMdx, {
      ...runtime,
      baseUrl: import.meta.url,
    });

    return {
      content: MDXContent({components}),
      metadata: frontmatter
    };
  } catch (error: any) {
    throw new MarkdownError('MDX compilation failed', formatMarkdownError(error));
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

  const sanitized = tree;
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
