import type { Node as UnistNode } from 'unist';
import { visit } from 'unist-util-visit';

// Fixes https://github.com/mdx-js/mdx/issues/821
// Adapted from https://github.com/iAdramelk/remark-mdx-disable-explicit-jsx
export function remarkMdxDisableExplicitJsx(keys: string[]) {
  const test = (node: any) => {
    return node.name && keys.includes(node.name);
  };
  return (tree: UnistNode) => {
    visit(tree, test, function (node) {
      delete (node.data as any)._mdxExplicitJsx;
      delete (node.data as any)._xdmExplicitJsx;
    });
  };
}
