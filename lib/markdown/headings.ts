import GithubSlugger from 'github-slugger';
import {visit} from "unist-util-visit";
import {headingRank} from "hast-util-heading-rank";
import {toString} from "mdast-util-to-string";
import {FileHeading} from "@/lib/docs/metadata";

export default function rehypeMarkdownHeadings() {
  const slugs = new GithubSlugger();

  return (tree: any, file: any) => {
    slugs.reset();

    const headingList: FileHeading[] = [];
    visit(tree, 'element', (node: any) => {
      const depth = headingRank(node);
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

    // @ts-ignore
    file.data.matter = {...file.data.matter, _headings: headingList};
  }
}