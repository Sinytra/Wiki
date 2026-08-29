import { visit } from 'unist-util-visit';
import { toString } from 'mdast-util-to-string';
import type { Blockquote, PhrasingContent, Root } from 'mdast';
import type { MdxJsxAttribute, MdxJsxFlowElement } from 'mdast-util-mdx-jsx';
import type { Transformer } from 'unified';

// See also: alertVariants in alert.tsx
export const ALERT_TYPES = ['note', 'tip', 'important', 'warning', 'caution'] as const;

export type AlertType = (typeof ALERT_TYPES)[number];

const ALERT_REGEX = new RegExp(`^\\[!(${ALERT_TYPES.join('|')})]([+-]?)[ \\t]*`, 'i');

export interface AlertOptions {
  componentName?: string;
}

interface Alert {
  type: AlertType;
  collapsible: boolean;
  collapsed: boolean;
  title: string;
}

export default function remarkAlert(options: AlertOptions = {}): Transformer<Root> {
  const { componentName = 'Callout' } = options;

  return function transformer(tree) {
    visit(tree, 'blockquote', (node) => {
      const alert = parseAlert(node);
      if (!alert) {
        return;
      }

      const attributes: MdxJsxAttribute[] = [{ type: 'mdxJsxAttribute', name: 'variant', value: alert.type }];
      if (alert.title) {
        attributes.push({ type: 'mdxJsxAttribute', name: 'title', value: alert.title });
      }
      if (alert.collapsible) {
        attributes.push({ type: 'mdxJsxAttribute', name: 'collapsible', value: null });
      }
      if (alert.collapsed) {
        attributes.push({ type: 'mdxJsxAttribute', name: 'collapsed', value: null });
      }

      const element = node as unknown as MdxJsxFlowElement;
      element.type = 'mdxJsxFlowElement';
      element.name = componentName;
      element.attributes = attributes;
    });
  };
}

function parseAlert(node: Blockquote): Alert | undefined {
  const paragraph = node.children[0];
  if (paragraph?.type !== 'paragraph') {
    return;
  }

  const first = paragraph.children[0];
  if (first?.type !== 'text') {
    return;
  }

  const match = ALERT_REGEX.exec(first.value);
  if (!match) {
    return;
  }

  const title: PhrasingContent[] = [];
  let body: PhrasingContent[] = [];

  const rest = first.value.slice(match[0].length);
  const lineEnd = rest.indexOf('\n');

  if (lineEnd !== -1) {
    title.push({ type: 'text', value: rest.slice(0, lineEnd) });
    body = [{ type: 'text', value: rest.slice(lineEnd + 1) }, ...paragraph.children.slice(1)];
  } else {
    if (rest) {
      title.push({ type: 'text', value: rest });
    }
    for (let i = 1; i < paragraph.children.length; i++) {
      const child = paragraph.children[i]!;

      if (child.type === 'break') {
        body = paragraph.children.slice(i + 1);
        break;
      }

      if (child.type === 'text') {
        const at = child.value.indexOf('\n');
        if (at !== -1) {
          title.push({ type: 'text', value: child.value.slice(0, at) });
          body = [{ type: 'text', value: child.value.slice(at + 1) }, ...paragraph.children.slice(i + 1)];
          break;
        }
      }

      title.push(child);
    }
  }

  const leading = body[0];
  if (leading?.type === 'text') {
    leading.value = leading.value.replace(/^\s+/, '');
    if (!leading.value) {
      body.shift();
    }
  }

  if (body.length > 0) {
    paragraph.children = body;
  } else {
    node.children.shift();
  }

  const marker = match[2];
  return {
    type: match[1]!.toLowerCase() as AlertType,
    collapsible: marker === '+' || marker === '-',
    collapsed: marker === '-',
    title: toString(title).trim()
  };
}
