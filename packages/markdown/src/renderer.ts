import { Pluggable, unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeSanitize from 'rehype-sanitize';
import rehypeRaw from 'rehype-raw';
import { markdownRehypeSchema } from './contentFilter';
import { ReactElement } from 'react';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';
import { recmaCodeHike, remarkCodeHike } from 'codehike/mdx';
import { VFile } from 'vfile';
import { matter } from 'vfile-matter';
import { compile, run } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import { formatMarkdownError, MarkdownError } from './exception';
import { DocsEntryMetadata } from './metadata';
import { rehypeSanitizeTree, TreeSanitizerOptions } from './plugins/sanitize/treeSanitizer';
import { rehypeSafeMarkdownAttributes } from './plugins/sanitize/esSanitizer';
import { rehypeSanitizeStyles } from './plugins/sanitize/styleSanitizer';
import { rehypeMarkdownHeadings } from './plugins/headings';
import { remarkMdxDisableExplicitJsx } from './plugins/inlining';
import { rehypeCollectLinks } from './plugins/collect';
import remarkHint from './plugins/hint';
import remarkHeadingAttributes from './plugins/headingAttributes';
import remarkElementAttributes from './plugins/elementAttributes';
import remarkAlert from './plugins/alert';

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
  return lines
    .map((line) => {
      if (count < 2 && line.startsWith('---')) {
        count++;
        return line.trimEnd();
      }
      return line;
    })
    .join('\n');
}

async function renderCommonMarkdown(content: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSanitize, markdownRehypeSchema)
    .use(rehypeSanitizeStyles)
    .use(rehypeStringify)
    .process(content);

  return String(file);
}

async function renderDocumentationMarkdown(
  source: string,
  includeComponents: Record<string, any>,
  inline: boolean,
  patcher?: ComponentPatcher
): Promise<DocumentationMarkdown> {
  const LucideReact = await import('lucide-react');
  const icons = Object.keys(LucideReact)
    .filter((key) => key.endsWith('Icon'))
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
    components: { code: 'CodeHikeCode' }
  };

  const cleanSource = cleanFrontmatter(source);

  const vfile = new VFile(cleanSource);
  matter(vfile, { strip: true });

  try {
    const knownComponents = Object.keys(components);
    const sanitizeOptions: TreeSanitizerOptions = { components, schema: markdownRehypeSchema };
    const rehypePlugins: Pluggable[] = [
      rehypeSafeMarkdownAttributes,
      [rehypeSanitizeTree, sanitizeOptions],
      rehypeSanitizeStyles
    ];
    if (!inline) {
      rehypePlugins.unshift(rehypeMarkdownHeadings);
    }

    const compiledMdx = await compile(vfile, {
      outputFormat: 'function-body',

      remarkPlugins: [
        [remarkCodeHike, chConfig],
        remarkAlert,
        remarkGfm,
        [remarkMdxDisableExplicitJsx, knownComponents],
        remarkHint,
        remarkHeadingAttributes,
        remarkElementAttributes
      ],
      rehypePlugins,
      recmaPlugins: [[recmaCodeHike, chConfig]]
    });

    const metadata = compiledMdx.data.metadata ?? {};

    const { default: MDXContent } = await run(compiledMdx, {
      ...runtime,
      baseUrl: import.meta.url
    });

    return {
      content: MDXContent({ components }),
      metadata
    };
  } catch (error: any) {
    throw new MarkdownError('MDX compilation failed', formatMarkdownError(error));
  }
}

function readFrontmatter(source: string): any {
  const vfile = new VFile(source);
  matter(vfile, { strip: true });
  return vfile.data.matter ?? {};
}

async function readProcessedFrontmatter(source: string): Promise<DocsEntryMetadata> {
  const vfile = new VFile(cleanFrontmatter(source));
  matter(vfile, { strip: true });

  const frontmatter = vfile.data.matter ?? {};

  const processor = unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(remarkHeadingAttributes)
    .use(remarkElementAttributes)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeMarkdownHeadings)
    .use(rehypeCollectLinks)
    .use(rehypeStringify);

  try {
    const file = await processor.process(vfile);
    const metadata = file.data.metadata ?? {};

    return {
      ...frontmatter,
      ...metadata
    };
  } catch (e) {
    console.error('Error reading processed frontmatter', e);
  }

  return frontmatter;
}

export default {
  renderCommonMarkdown,
  renderDocumentationMarkdown,
  readFrontmatter,
  readProcessedFrontmatter
};
