import GithubSlugger from 'github-slugger';
import {visit} from 'unist-util-visit';
import {headingRank} from 'hast-util-heading-rank';
import {toString} from 'mdast-util-to-string';
import {FileHeading} from './metadata';
import type {Root} from 'hast';
import type {VFile} from 'vfile';

export default function rehypeMarkdownHeadings(): (tree: Root, file: VFile) => undefined {
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