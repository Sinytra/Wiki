import { visit, SKIP } from 'unist-util-visit';
import { hintSyntax } from './syntax';
import { hintFromMarkdown, hintToMarkdown } from './mdast';
import type { Root } from 'mdast';
import type { MdxJsxAttribute, MdxJsxTextElement } from 'mdast-util-mdx-jsx';
import type { Processor, Transformer } from 'unified';
import './types';

export interface HintOptions {
  componentName?: string;
  propName?: string;
  onMissing?: 'unwrap' | 'keep';
  output?: 'hast' | 'mdx';
}

export default function remarkHint(this: Processor, options: HintOptions = {}): Transformer<Root> {
  const { componentName = 'hint', propName = 'hint', onMissing = 'unwrap' } = options;

  const data = this.data();

  (data.micromarkExtensions ??= []).push(hintSyntax());
  (data.fromMarkdownExtensions ??= []).push(hintFromMarkdown());
  (data.toMarkdownExtensions ??= []).push(hintToMarkdown());

  return function transformer(tree, file) {
    const definitions = new Map<string, string>();

    visit(tree, 'hintDefinition', (node, index, parent) => {
      if (!definitions.has(node.identifier)) {
        definitions.set(node.identifier, node.hint);
      }
      if (parent && typeof index === 'number') {
        parent.children.splice(index, 1);
        return [SKIP, index];
      }
    });

    visit(tree, 'definition', (node) => {
      if (definitions.has(node.identifier)) {
        return;
      }
      const value = node.title || undefined;
      if (value !== undefined) {
        definitions.set(node.identifier, value);
      }
    });

    visit(tree, 'hint', (node, index, parent) => {
      let hint = node.hint;

      if (hint === undefined) {
        hint = definitions.get(node.identifier);

        if (hint === undefined) {
          file.message('Unknown hint reference ' + node.identifier, node.position, 'remark-hint:missing-definition');

          if (onMissing === 'unwrap' && parent && typeof index === 'number') {
            parent.children.splice(index, 1, ...node.children);
            return [SKIP, index];
          }

          hint = '';
        }
      }

      node.hint = hint;

      const properties: Record<string, string> = { [propName]: hint };
      const element = node as unknown as MdxJsxTextElement;
      element.type = 'mdxJsxTextElement';
      element.name = componentName;
      element.attributes = Object.entries(properties).map(
        ([name, value]): MdxJsxAttribute => ({
          type: 'mdxJsxAttribute',
          name,
          value
        })
      );
    });
  };
}
