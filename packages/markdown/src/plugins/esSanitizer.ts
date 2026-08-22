import { visit as visitEsTree } from 'estree-util-visit';
import type { MdxJsxAttribute, MdxJsxExpressionAttribute } from 'mdast-util-mdx-jsx';
import { visit } from 'unist-util-visit';
import { Root } from 'hast';

const allowedNodeTypes = [
  'Program',
  'ExpressionStatement',
  'ObjectExpression',
  'ArrayExpression',
  'Property',
  'Literal',
  'Identifier'
];

function isAttributeAllowed(attr: MdxJsxAttribute | MdxJsxExpressionAttribute): boolean {
  if (attr.type !== 'mdxJsxAttribute') {
    return false;
  }

  if (typeof attr.value === 'object') {
    if (!attr.value?.data?.estree) {
      return attr.value == null;
    }

    let disallow = false;
    visitEsTree(attr.value.data.estree, (node) => {
      if (!allowedNodeTypes.includes(node.type)) {
        disallow = true;
      }
    });
    if (disallow) {
      return false;
    }
  }

  return true;
}

export function rehypeSafeMarkdownAttributes(): (tree: Root) => undefined {
  return (tree) => {
    visit(tree, ['mdxJsxFlowElement', 'mdxJsxTextElement'], (node, index, parent) => {
      let disallow = false;
      if (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') {
        if (node.attributes.some((a) => !isAttributeAllowed(a))) {
          disallow = true;
        }
      } else {
        disallow = true;
      }

      if (disallow) {
        parent?.children.splice(index!, 1);
      }
    });
  };
}
