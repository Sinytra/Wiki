import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { VFile } from 'vfile';
import { matter } from 'vfile-matter';
import { EXIT, SKIP, visit } from 'unist-util-visit';
import type { Nodes, Paragraph, Root } from 'mdast';
import remarkHint from './plugins/hint';
import remarkAlert from './plugins/alert';
import { cleanFrontmatter } from './util';

const TEXT_NODES = [
  'heading',
  'code',
  'math',
  'html',
  'yaml',
  'mdxjsEsm',
  'mdxFlowExpression',
  'definition',
  'footnoteDefinition',
  'thematicBreak'
];
const ALL_NODES = [...TEXT_NODES, 'blockquote', 'list', 'table'];

function isSecondary(node: Nodes, skip: string[]): boolean {
  return (
    skip.includes(node.type) || (skip === ALL_NODES && node.type === 'mdxJsxFlowElement' && node.name === 'Callout')
  );
}

export async function describeMarkdown(source: string, maxLength = 160): Promise<string | undefined> {
  let tree: Root;
  try {
    const processor = unified()
      .use(remarkParse)
      .use(remarkMdx)
      .use(remarkGfm)
      .use(remarkMath)
      .use(remarkHint)
      .use(remarkAlert, { componentName: 'Callout' });

    const file = new VFile(cleanFrontmatter(source));
    matter(file, { strip: true });

    tree = await processor.run(processor.parse(file), file);
  } catch {
    return undefined;
  }

  const text = findParagraphText(tree, ALL_NODES) ?? findParagraphText(tree, TEXT_NODES);
  return text ? truncate(text, maxLength) : undefined;
}

function findParagraphText(tree: Root, skip: string[]): string | undefined {
  let found: string | undefined;

  visit(tree, (node) => {
    if (isSecondary(node, skip)) {
      return SKIP;
    }

    if (node.type === 'paragraph') {
      const text = nodeToText(node as Paragraph)
        .replace(/\s+/g, ' ')
        .trim();
      if (text) {
        found = text;
        return EXIT;
      }

      return SKIP;
    }
  });

  return found;
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  const cut = text.slice(0, maxLength - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > maxLength / 2 ? cut.slice(0, lastSpace) : cut).replace(/[,;:.\s]+$/, '') + '...';
}

function nodeToText(node: Nodes): string {
  switch (node.type) {
    case 'text':
    case 'inlineCode':
      return node.value;
    case 'inlineMath':
      return node.value;
    case 'break':
      return ' ';
    case 'image':
    case 'imageReference':
    case 'html':
    case 'footnoteReference':
    case 'mdxTextExpression':
    case 'mdxFlowExpression':
    case 'mdxjsEsm':
      return '';
    default:
      return 'children' in node ? node.children.map(nodeToText).join('') : '';
  }
}
