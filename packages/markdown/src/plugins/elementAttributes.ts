import { factorySpace } from 'micromark-factory-space';
import { markdownLineEnding, markdownSpace } from 'micromark-util-character';
import { decodeString } from 'micromark-util-decode-string';
import { SKIP, visit } from 'unist-util-visit';
import type { Code, Effects, Extension, State, TokenizeContext } from 'micromark-util-types';
import type { CompileContext, Extension as FromMarkdownExtension, Token } from 'mdast-util-from-markdown';
import type { Options as ToMarkdownExtension } from 'mdast-util-to-markdown';
import type {
  MdxJsxAttribute,
  MdxJsxAttributeValueExpression,
  MdxJsxFlowElement,
  MdxJsxTextElement
} from 'mdast-util-mdx-jsx';
import type { Data, Node, Nodes, Root } from 'mdast';
import type { ObjectExpression, Property } from 'estree';
import type { Processor, Transformer } from 'unified';

const leftBrace = 123;
const rightBrace = 125;
const equalSign = 61;
const quotationMark = 34;
const apostrophe = 39;
const backslash = 92;
const rightParen = 41;
const rightBracket = 93;
const hyphen = 45;
const underscore = 95;
const colon = 58;

const MAX_NAME_SIZE = 999;
const MAX_VALUE_SIZE = 9999;

const FLAG_CLASSES: Record<string, string> = {
  right: 'img-right',
  center: 'img-center'
};

const KNOWN_FLAGS = Object.keys(FLAG_CLASSES);
const TARGET_NODE_TYPES = ['image', 'imageReference', 'link', 'linkReference', 'mdxJsxTextElement'];

const NON_NEGATIVE_INT = /^\d+$/;

const IMAGE_ATTRIBUTES: Record<string, RegExp> = {
  width: NON_NEGATIVE_INT,
  height: NON_NEGATIVE_INT
};

const HTML_ATTRIBUTES: Record<string, Record<string, RegExp>> = {
  image: IMAGE_ATTRIBUTES,
  imageReference: IMAGE_ATTRIBUTES
};

export interface ElementAttributes extends Node {
  type: 'elementAttributes';
  declarations: Record<string, string>;
  flags: string[];
  raw: string;
}

export default function remarkElementAttributes(this: Processor): Transformer<Root> {
  const data = this.data();

  (data.micromarkExtensions ??= []).push(elementAttributesSyntax(KNOWN_FLAGS));
  (data.fromMarkdownExtensions ??= []).push(elementAttributesFromMarkdown());
  (data.toMarkdownExtensions ??= []).push(elementAttributesToMarkdown());

  return function transformer(tree, file) {
    visit(tree, 'elementAttributes', (node, index, parent) => {
      if (!parent || typeof index !== 'number') {
        return;
      }

      const previous = index > 0 ? parent.children[index - 1] : undefined;
      if (!previous || !TARGET_NODE_TYPES.includes(previous.type)) {
        file.message(
          'Element attributes must directly follow an image, link or hint',
          node.position,
          'remark-element-attributes:misplaced'
        );
        parent.children.splice(index, 1, { type: 'text', value: node.raw });
        return [SKIP, index + 1];
      }

      parent.children.splice(index, 1);

      const classes = flagClasses(node.flags);

      if (previous.type === 'mdxJsxTextElement') {
        applyJsxAttributes(previous, node.declarations, classes);
      } else {
        const attributes: Record<string, string> = {};
        const declarations: Record<string, string> = {};
        const supported = HTML_ATTRIBUTES[previous.type] ?? {};

        for (const [property, value] of Object.entries(node.declarations)) {
          const target = supported[property]?.test(value) ? attributes : declarations;
          target[property] = value;
        }

        applyHastProperties(previous, attributes, declarations, classes);
      }

      return [SKIP, index];
    });

    visit(tree, ['mdxJsxFlowElement', 'mdxJsxTextElement'], (node) => {
      const element = node as MdxJsxFlowElement | MdxJsxTextElement;
      if (!element.name || !/^[a-z]/.test(element.name)) {
        return;
      }

      const flags = element.attributes.filter(
        (attribute) =>
          attribute.type === 'mdxJsxAttribute' && attribute.value === null && FLAG_CLASSES[attribute.name] !== undefined
      ) as MdxJsxAttribute[];

      if (flags.length === 0) {
        return;
      }

      element.attributes = element.attributes.filter((attribute) => !flags.includes(attribute as MdxJsxAttribute));
      applyJsxAttributes(element, {}, flagClasses(flags.map((flag) => flag.name)));
    });
  };
}

function flagClasses(flags: string[]): string[] {
  return flags.flatMap((flag) => (FLAG_CLASSES[flag] ?? '').split(/\s+/)).filter(Boolean);
}

function applyHastProperties(
  node: Nodes,
  attributes: Record<string, string>,
  declarations: Record<string, string>,
  classes: string[]
): undefined {
  const properties: Record<string, unknown> = ((node.data ??= {} as Data).hProperties ??= {});

  Object.assign(properties, attributes);

  const style = serializeStyle(declarations);
  if (style) {
    const existing = typeof properties.style === 'string' ? properties.style.replace(/;\s*$/, '') : '';
    properties.style = [existing, style].filter(Boolean).join('; ');
  }

  if (classes.length > 0) {
    const existing = properties.className;
    const current = Array.isArray(existing) ? existing : typeof existing === 'string' ? existing.split(/\s+/) : [];
    properties.className = [...current.filter(Boolean), ...classes];
  }
}

function applyJsxAttributes(
  element: MdxJsxFlowElement | MdxJsxTextElement,
  declarations: Record<string, string>,
  classes: string[]
): undefined {
  const style = Object.entries(declarations).reduce<Record<string, string>>((object, [property, value]) => {
    object[toStyleObjectKey(property)] = value;
    return object;
  }, {});

  const existing = findJsxAttribute(element, 'style');
  if (Object.keys(style).length > 0) {
    element.attributes = element.attributes.filter((attribute) => attribute !== existing);
    element.attributes.push({
      type: 'mdxJsxAttribute',
      name: 'style',
      value: styleObjectExpression({ ...readStyleObject(existing), ...style })
    });
  }

  if (classes.length > 0) {
    const className = findJsxAttribute(element, 'className');
    const current = typeof className?.value === 'string' ? className.value.split(/\s+/).filter(Boolean) : [];
    const value = [...current, ...classes].join(' ');

    if (className) {
      className.value = value;
    } else {
      element.attributes.push({ type: 'mdxJsxAttribute', name: 'className', value });
    }
  }
}

function findJsxAttribute(element: MdxJsxFlowElement | MdxJsxTextElement, name: string): MdxJsxAttribute | undefined {
  return element.attributes.find(
    (attribute): attribute is MdxJsxAttribute => attribute.type === 'mdxJsxAttribute' && attribute.name === name
  );
}

function serializeStyle(declarations: Record<string, string>): string {
  return Object.entries(declarations)
    .map(([property, value]) => property + ': ' + value)
    .join('; ');
}

function toStyleObjectKey(property: string): string {
  if (property.startsWith('--')) {
    return property;
  }
  return property.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
}

function readStyleObject(attribute: MdxJsxAttribute | undefined): Record<string, string> {
  const expression = attribute?.value;
  if (typeof expression !== 'object' || expression === null) {
    return {};
  }

  const statement = expression.data?.estree?.body[0];
  if (statement?.type !== 'ExpressionStatement' || statement.expression.type !== 'ObjectExpression') {
    return {};
  }

  const style: Record<string, string> = {};
  for (const property of statement.expression.properties) {
    if (property.type !== 'Property') {
      continue;
    }
    const key = property.key.type === 'Literal' ? property.key.value : null;
    if (typeof key === 'string' && property.value.type === 'Literal' && typeof property.value.value === 'string') {
      style[key] = property.value.value;
    }
  }
  return style;
}

function styleObjectExpression(style: Record<string, string>): MdxJsxAttributeValueExpression {
  const properties = Object.entries(style).map(([key, value]): Property => ({
    type: 'Property',
    method: false,
    shorthand: false,
    computed: false,
    kind: 'init',
    key: { type: 'Literal', value: key },
    value: { type: 'Literal', value }
  }));
  const expression: ObjectExpression = { type: 'ObjectExpression', properties };

  return {
    type: 'mdxJsxAttributeValueExpression',
    value: JSON.stringify(style),
    data: {
      estree: {
        type: 'Program',
        sourceType: 'module',
        comments: [],
        body: [{ type: 'ExpressionStatement', expression }]
      }
    }
  };
}

function isNameCode(code: Code): code is number {
  return (
    code !== null &&
    ((code > 47 && code < 58) || // 0-9
      (code > 64 && code < 91) || // A-Z
      (code > 96 && code < 123) || // a-z
      code === hyphen ||
      code === underscore ||
      code === colon)
  );
}

export function elementAttributesSyntax(flags: string[] = KNOWN_FLAGS): Extension {
  function tokenizeElementAttributes(this: TokenizeContext, effects: Effects, ok: State, nok: State): State {
    return createElementAttributesTokenizer(effects, ok, nok, this, flags);
  }

  return {
    text: { [leftBrace]: { name: 'elementAttributes', tokenize: tokenizeElementAttributes } }
  };
}

function createElementAttributesTokenizer(
  effects: Effects,
  ok: State,
  nok: State,
  self: TokenizeContext,
  flags: string[]
): State {
  let size = 0;
  let buffer = '';
  let quote = 0;

  return start;

  function start(code: Code): State | undefined {
    if (code !== leftBrace || (self.previous !== rightParen && self.previous !== rightBracket)) {
      return nok(code);
    }
    effects.enter('elementAttributes');
    effects.enter('elementAttributesMarker');
    effects.consume(code);
    effects.exit('elementAttributesMarker');
    return attributeStart;
  }

  function attributeStart(code: Code): State | undefined {
    size = 0;
    buffer = '';

    if (!isNameCode(code)) {
      return nok(code);
    }

    effects.enter('elementAttributesName');
    return name(code);
  }

  function name(code: Code): State | undefined {
    if (isNameCode(code) && size < MAX_NAME_SIZE) {
      effects.consume(code);
      buffer += String.fromCharCode(code);
      size++;
      return name;
    }

    if (code === equalSign) {
      effects.exit('elementAttributesName');
      effects.enter('elementAttributesValueMarker');
      effects.consume(code);
      effects.exit('elementAttributesValueMarker');
      size = 0;
      return valueStart;
    }

    if (!flags.includes(buffer) || (code !== rightBrace && !markdownSpace(code))) {
      return nok(code);
    }

    effects.exit('elementAttributesName');
    return afterAttribute(code);
  }

  function valueStart(code: Code): State | undefined {
    if (code === quotationMark || code === apostrophe) {
      quote = code;
      effects.enter('elementAttributesValue');
      effects.enter('elementAttributesValueMarker');
      effects.consume(code);
      effects.exit('elementAttributesValueMarker');
      effects.enter('elementAttributesValueString');
      return quotedValue;
    }

    if (code === null || markdownLineEnding(code) || markdownSpace(code) || code === rightBrace) {
      return nok(code);
    }

    effects.enter('elementAttributesValue');
    effects.enter('elementAttributesValueString');
    return value(code);
  }

  function value(code: Code): State | undefined {
    if (code === null || markdownLineEnding(code) || markdownSpace(code) || code === rightBrace) {
      effects.exit('elementAttributesValueString');
      effects.exit('elementAttributesValue');
      return afterAttribute(code);
    }

    if (size >= MAX_VALUE_SIZE) {
      return nok(code);
    }

    effects.consume(code);
    size++;
    return code === backslash ? valueEscape : value;
  }

  function valueEscape(code: Code): State | undefined {
    if (code === backslash || code === rightBrace || code === quotationMark || code === apostrophe) {
      effects.consume(code);
      size++;
      return value;
    }
    return value(code);
  }

  function quotedValue(code: Code): State | undefined {
    if (code === null || markdownLineEnding(code) || size >= MAX_VALUE_SIZE) {
      return nok(code);
    }

    if (code === quote) {
      effects.exit('elementAttributesValueString');
      effects.enter('elementAttributesValueMarker');
      effects.consume(code);
      effects.exit('elementAttributesValueMarker');
      effects.exit('elementAttributesValue');
      return afterAttribute;
    }

    effects.consume(code);
    size++;
    return code === backslash ? quotedValueEscape : quotedValue;
  }

  function quotedValueEscape(code: Code): State | undefined {
    if (code === backslash || code === quote) {
      effects.consume(code);
      size++;
      return quotedValue;
    }
    return quotedValue(code);
  }

  function afterAttribute(code: Code): State | undefined {
    if (markdownSpace(code)) {
      return factorySpace(effects, attributeStart, 'whitespace')(code);
    }
    if (code === rightBrace) {
      effects.enter('elementAttributesMarker');
      effects.consume(code);
      effects.exit('elementAttributesMarker');
      effects.exit('elementAttributes');
      return ok;
    }
    return nok(code);
  }
}

export function elementAttributesFromMarkdown(): FromMarkdownExtension {
  return {
    enter: {
      elementAttributes: enterElementAttributes
    },
    exit: {
      elementAttributesName: exitElementAttributesName,
      elementAttributesValueString: exitElementAttributesValueString,
      elementAttributes: exitElementAttributes
    }
  };
}

type PendingElementAttributes = ElementAttributes & { _name?: string };

function current(context: CompileContext): PendingElementAttributes {
  return context.stack[context.stack.length - 1] as unknown as PendingElementAttributes;
}

function flushPendingFlag(node: PendingElementAttributes): undefined {
  if (node._name !== undefined) {
    node.flags.push(node._name);
    node._name = undefined;
  }
}

function enterElementAttributes(this: CompileContext, token: Token): undefined {
  const node: ElementAttributes = { type: 'elementAttributes', declarations: {}, flags: [], raw: '' };

  this.enter(node as never, token);
}

function exitElementAttributesName(this: CompileContext, token: Token): undefined {
  const node = current(this);
  flushPendingFlag(node);
  node._name = this.sliceSerialize(token);
}

function exitElementAttributesValueString(this: CompileContext, token: Token): undefined {
  const node = current(this);
  if (node._name !== undefined) {
    node.declarations[node._name] = decodeString(this.sliceSerialize(token));
    node._name = undefined;
  }
}

function exitElementAttributes(this: CompileContext, token: Token): undefined {
  const node = current(this);
  flushPendingFlag(node);
  delete node._name;
  node.raw = this.sliceSerialize(token);

  this.exit(token);
}

export function elementAttributesToMarkdown(): ToMarkdownExtension {
  return {
    handlers: {
      elementAttributes: (node: ElementAttributes) => {
        const declarations = Object.entries(node.declarations).map(
          ([property, value]) => property + '=' + escapeValue(value)
        );
        return '{' + [...declarations, ...node.flags].join(' ') + '}';
      }
    }
  };
}

function escapeValue(value: string): string {
  const escaped = value.replace(/[\\}"']/g, '\\$&');
  return /[ \t]/.test(escaped) ? '"' + escaped + '"' : escaped;
}

declare module 'mdast' {
  interface PhrasingContentMap {
    elementAttributes: ElementAttributes;
  }
  interface RootContentMap {
    elementAttributes: ElementAttributes;
  }
}

declare module 'micromark-util-types' {
  interface TokenTypeMap {
    elementAttributes: 'elementAttributes';
    elementAttributesMarker: 'elementAttributesMarker';
    elementAttributesName: 'elementAttributesName';
    elementAttributesValue: 'elementAttributesValue';
    elementAttributesValueMarker: 'elementAttributesValueMarker';
    elementAttributesValueString: 'elementAttributesValueString';
  }
}

declare module 'mdast-util-to-markdown' {
  interface ConstructNameMap {
    elementAttributes: 'elementAttributes';
  }
}
