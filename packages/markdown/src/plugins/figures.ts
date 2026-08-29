import { visit } from 'unist-util-visit';
import type { Data, Image, ImageReference, Paragraph, PhrasingContent, Root } from 'mdast';
import type { Properties } from 'hast';
import type { Transformer } from 'unified';

const IMAGE_TYPES = ['image', 'imageReference'];
const FIGURE_PROPERTIES = ['style', 'className'];

/**
 * Automatically transforms markdown images with alt text into figures
 */
export default function remarkFigures(): Transformer<Root> {
  return function transformer(tree) {
    visit(tree, 'paragraph', (node: Paragraph) => {
      const [image, ...rest] = node.children;
      if (rest.length > 0 || !image || !IMAGE_TYPES.includes(image.type)) {
        return;
      }

      const caption = (image as Image | ImageReference).alt;
      if (!caption) {
        return;
      }

      const children: PhrasingContent[] = [
        image,
        { type: 'emphasis', data: { hName: 'figcaption' }, children: [{ type: 'text', value: caption }] }
      ];

      node.data = { ...node.data, hName: 'figure', hProperties: liftProperties(image) };
      node.children = children;
    });
  };
}

function liftProperties(image: PhrasingContent): Properties {
  const properties = (image.data as Data | undefined)?.hProperties;
  const lifted: Properties = {};

  if (!properties) {
    return lifted;
  }

  for (const name of FIGURE_PROPERTIES) {
    if (properties[name] !== undefined) {
      lifted[name] = properties[name];
      delete properties[name];
    }
  }
  return lifted;
}
