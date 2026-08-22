import { Root } from 'hast';
import { Schema } from 'hast-util-sanitize';

export interface TreeSanitizerOptions {
  components: Record<string, any>;
  schema: Schema;
}

const mdxElemets = ['mdxJsxFlowElement', 'mdxJsxTextElement'];

function sanitizeHastTree(tree: any, options: TreeSanitizerOptions) {
  const { components, schema } = options;

  if (mdxElemets.includes(tree.type)) {
    if (components[tree.name] !== undefined) {
      return tree;
    }
    if (!tree.name || !schema.tagNames!.includes(tree.name)) {
      return null;
    }
  } else {
    if (tree.tagName && !schema.tagNames!.includes(tree.tagName)) {
      return null;
    }
  }

  const sanitized = tree;
  if (tree.children) {
    sanitized.children = tree.children.map((c: any) => sanitizeHastTree(c, options)).filter((c: any) => c != null);
  }
  return sanitized;
}

export function rehypeSanitizeTree(options: TreeSanitizerOptions) {
  return (tree: Root) => {
    const newTree = { ...tree };
    return sanitizeHastTree(newTree, options);
  };
}
