import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeSanitize from 'rehype-sanitize';
import rehypeRaw from 'rehype-raw';
import { markdownRehypeSchema } from './contentFilter';
import { ReactElement } from 'react';
import remarkGfm from 'remark-gfm';
import { recmaCodeHike, remarkCodeHike } from 'codehike/mdx';
import { VFile } from 'vfile';
import { matter } from 'vfile-matter';
import { compile, run } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import { formatMarkdownError, MarkdownError } from './exception';
import { DocsEntryMetadata } from './metadata';
import { rehypeSanitizeTree, TreeSanitizerOptions } from './plugins/treeSanitizer';
import { rehypeSafeMarkdownAttributes } from './plugins/esSanitizer';
import { rehypeMarkdownHeadings } from './plugins/headings';
import { remarkMdxDisableExplicitJsx } from './plugins/inlining';
import { rehypeCollectLinks } from './plugins/collect';
import remarkHint from './plugins/hint';

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

async function renderMarkdown(content: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSanitize, markdownRehypeSchema)
    .use(rehypeStringify)
    .process(content);

  return String(file);
}

async function renderDocumentationMarkdown(
  source: string,
  includeComponents: Record<string, any>,
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
    const compiledMdx = await compile(vfile, {
      outputFormat: 'function-body',

      remarkPlugins: [
        [remarkCodeHike, chConfig],
        remarkGfm,
        [remarkMdxDisableExplicitJsx, knownComponents],
        remarkHint
      ],
      rehypePlugins: [rehypeMarkdownHeadings, rehypeSafeMarkdownAttributes, [rehypeSanitizeTree, sanitizeOptions]],
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

async function readProcessedFrontmatter(source: string) {
  try {
    const file = await unified()
      .use(remarkParse)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(() => (_, file) => matter(file, { strip: true }))
      .use(rehypeMarkdownHeadings)
      .use(rehypeCollectLinks)
      .use(rehypeStringify)
      .process(source);

    const frontmatter = file.data.matter ?? {};
    const metadata = file.data.metadata ?? {};

    return {
      ...frontmatter,
      ...metadata
    };
  } catch (e) {
    console.error('Error reading processed frontmatter', e);
    return {};
  }
}

export default {
  renderMarkdown,
  renderDocumentationMarkdown,
  readFrontmatter,
  readProcessedFrontmatter
};
