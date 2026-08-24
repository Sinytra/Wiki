import GithubSlugger from 'github-slugger';
import { visit } from 'unist-util-visit';
import { headingRank } from 'hast-util-heading-rank';
import { toString } from 'mdast-util-to-string';
import { DocsEntryMetadata, FileHeading } from '../metadata';
import { Root } from 'hast';
import type { VFile } from 'vfile';

export function rehypeMarkdownHeadings(): (tree: Root, file: VFile) => undefined {
  const slugs = new GithubSlugger();

  return (tree, file) => {
    slugs.reset();

    const metadata: DocsEntryMetadata = {};

    const headingList: FileHeading[] = [];
    let foundTitle = false;
    visit(tree, 'element', (node, index, parent) => {
      const depth = headingRank(node);

      if (depth === 1 && node.children?.length === 1) {
        const child = node.children[0];
        if (child?.type === 'text') {
          // First H1 gets used as title
          if (!foundTitle) {
            metadata.title = child.value;
            parent?.children.splice(index!, 1);
            foundTitle = true;
          }
          // Remaining H1 headings will be changed to H2
          else {
            node.tagName = 'h2';
          }
          return;
        }
      }

      if (depth && !node.properties.id) {
        const id = slugs.slug(toString(node));
        node.properties.id = id;
        const heading: FileHeading = {
          depth,
          id,
          value: toString(node, { includeImageAlt: false })
        };

        headingList.push(heading);
      }
    });

    metadata.headings = headingList;
    file.data.metadata = metadata;
  };
}
