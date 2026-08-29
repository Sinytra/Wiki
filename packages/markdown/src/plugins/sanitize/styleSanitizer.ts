import { visit } from 'unist-util-visit';
import { allowedStyleProperties } from '../../contentFilter';
import type { Element, Root } from 'hast';
import type { MdxJsxAttribute, MdxJsxAttributeValueExpression } from 'mdast-util-mdx-jsx';
import type { Property } from 'estree';

export interface StyleSanitizerOptions {
  properties?: string[];
}

const INVALID_VALUES = /url\s*\(|expression\s*\(|image-set\s*\(|javascript:|@import|<\/?[a-z]/i;

export function rehypeSanitizeStyles(options: StyleSanitizerOptions = {}) {
  const allowed = new Set(options.properties ?? allowedStyleProperties);

  return (tree: Root): undefined => {
    visit(tree, 'element', (node: Element) => {
      const style = node.properties?.style;
      if (typeof style !== 'string') {
        return;
      }

      const sanitized = sanitizeStyleString(style, allowed);
      if (sanitized) {
        node.properties.style = sanitized;
      } else {
        delete node.properties.style;
      }
    });

    visit(tree, ['mdxJsxFlowElement', 'mdxJsxTextElement'], (node: any) => {
      const attributes: MdxJsxAttribute[] = (node.attributes ?? []).filter(
        (attribute: MdxJsxAttribute) => attribute.type === 'mdxJsxAttribute' && attribute.name === 'style'
      );

      for (const attribute of attributes) {
        if (typeof attribute.value === 'string') {
          attribute.value = sanitizeStyleString(attribute.value, allowed);
        } else if (typeof attribute.value === 'object' && attribute.value !== null) {
          sanitizeStyleExpression(attribute.value, allowed);
        }
      }
    });
  };
}

function sanitizeStyleString(style: string, allowed: Set<string>): string {
  return style
    .split(';')
    .map((declaration) => {
      const separator = declaration.indexOf(':');
      if (separator < 0) {
        return undefined;
      }

      const property = declaration.slice(0, separator);
      const value = declaration.slice(separator + 1).trim();

      return isAllowedDeclaration(property, value, allowed) ? normalizeProperty(property) + ': ' + value : undefined;
    })
    .filter((declaration): declaration is string => declaration !== undefined)
    .join('; ');
}

function sanitizeStyleExpression(expression: MdxJsxAttributeValueExpression, allowed: Set<string>): undefined {
  const statement = expression.data?.estree?.body[0];
  if (statement?.type !== 'ExpressionStatement' || statement.expression.type !== 'ObjectExpression') {
    return;
  }

  const style: Record<string, string> = {};
  statement.expression.properties = statement.expression.properties.filter((property): property is Property => {
    if (property.type !== 'Property') {
      return false;
    }

    const key = property.key.type === 'Literal' ? property.key.value : null;
    const value = property.value.type === 'Literal' ? property.value.value : null;
    if (typeof key !== 'string' || typeof value !== 'string' || !isAllowedDeclaration(key, value, allowed)) {
      return false;
    }

    style[key] = value;
    return true;
  });

  expression.value = JSON.stringify(style);
}

function isAllowedDeclaration(property: string, value: string, allowed: Set<string>): boolean {
  return value.trim().length > 0 && !INVALID_VALUES.test(value) && allowed.has(normalizeProperty(property));
}

function normalizeProperty(property: string): string {
  return property
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();
}
