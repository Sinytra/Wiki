import GithubSlugger from 'github-slugger';
import {visit} from 'unist-util-visit';
import {headingRank} from 'hast-util-heading-rank';
import {toString} from 'mdast-util-to-string';
import {FileHeading} from './metadata';
import {Root} from 'hast';
import type {VFile} from 'vfile';
import {visit as visitEsTree} from 'estree-util-visit';
import type {MdxJsxAttribute, MdxJsxExpressionAttribute} from 'mdast-util-mdx-jsx';

export function rehypeMarkdownHeadings(): (tree: Root, file: VFile) => undefined {
  const slugs = new GithubSlugger();

  return (tree, file) => {
    slugs.reset();

    const headingList: FileHeading[] = [];
    visit(tree, 'element', (node, index, parent) => {
      const depth = headingRank(node);

      if (depth === 1 && !file.data.matter?.title && node.children?.length === 1) {
        const child = node.children[0];
        if (child?.type === 'text') {
          file.data.matter!.title = child.value;
          parent?.children.splice(index!, 1);
          return;
        }
      }

      if (depth && !node.properties.id) {
        const id = slugs.slug(toString(node));
        node.properties.id = id;
        const heading: FileHeading = {
          depth,
          id,
          value: toString(node, {includeImageAlt: false}),
        };

        headingList.push(heading);
      }
    });

    file.data.matter = {...file.data.matter, _headings: headingList};
  };
}

const allowedNodeTypes = [
  'Program',
  'ExpressionStatement',
  'ObjectExpression', 'ArrayExpression',
  'Property', 'Literal', 'Identifier'
];

function isAttributeAllowed(attr: MdxJsxAttribute | MdxJsxExpressionAttribute): boolean {
  if (attr.type !== 'mdxJsxAttribute') {
    return false;
  }

  if (typeof attr.value === 'object') {
    if (!attr.value?.data?.estree) {
      return false;
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

export function rehypeSafeMarkdownAttributes(): (tree: Root, file: VFile) => undefined {
  return (tree) => {
    visit(tree, ['mdxJsxFlowElement', 'mdxJsxTextElement'], (node, index, parent) => {
      let disallow = false;
      if (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') {
        if (node.attributes.some(a => !isAttributeAllowed(a))) {
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