import { visit } from 'unist-util-visit';
import { Root } from 'hast';
import type { VFile } from 'vfile';

export function rehypeCollectLinks(): (tree: Root, file: VFile) => undefined {
  return (tree, file) => {
    if (!file.data.metadata) {
      file.data.metadata = {};
    }
    const links: string[] = [];

    visit(tree, 'element', (node) => {
      if (node.tagName === 'a' && node.properties?.href != null) {
        const href = String(node.properties.href);
        if (href.startsWith('@') || href.startsWith('$') || href.startsWith('+')) {
          links.push(href);
        }
      }
    });

    file.data.metadata.links = links;
  };
}
