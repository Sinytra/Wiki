import { factorySpace } from 'micromark-factory-space';
import { markdownLineEnding, markdownSpace } from 'micromark-util-character';
import { SKIP, visit } from 'unist-util-visit';
import type { Code, Effects, Extension, State, TokenizeContext } from 'micromark-util-types';
import type { CompileContext, Extension as FromMarkdownExtension, Token } from 'mdast-util-from-markdown';
import type { Options as ToMarkdownExtension } from 'mdast-util-to-markdown';
import type { Data, Node, Root } from 'mdast';
import type { Processor, Transformer } from 'unified';

const leftBrace = 123;
const rightBrace = 125;
const hashtag = 35;
const hyphen = 45;
const underscore = 95;

const MAX_ID_SIZE = 999;
const KNOWN_FLAGS = ['clear'];
const FLAG_STYLES: Record<string, string> = {
  clear: 'clear: both'
};

export interface HeadingAttributes extends Node {
  type: 'headingAttributes';
  id?: string;
  flags: string[];
  raw: string;
}

export default function remarkHeadingAttributes(this: Processor): Transformer<Root> {
  const data = this.data();

  (data.micromarkExtensions ??= []).push(headingAttributesSyntax(KNOWN_FLAGS));
  (data.fromMarkdownExtensions ??= []).push(headingAttributesFromMarkdown());
  (data.toMarkdownExtensions ??= []).push(headingAttributesToMarkdown());

  return function transformer(tree, file) {
    visit(tree, 'headingAttributes', (node, index, parent) => {
      if (!parent || typeof index !== 'number') {
        return;
      }

      if (parent.type !== 'heading' || index !== parent.children.length - 1) {
        file.message(
          'Heading attributes must be placed at the end of a heading',
          node.position,
          'remark-heading-attributes:misplaced'
        );
        parent.children.splice(index, 1, { type: 'text', value: node.raw });
        return [SKIP, index + 1];
      }

      parent.children.splice(index, 1);

      const previous = parent.children[index - 1];
      if (previous?.type === 'text') {
        previous.value = previous.value.replace(/[ \t]+$/, '');
      }

      const properties: Record<string, unknown> = ((parent.data ??= {} as Data).hProperties ??= {});
      if (node.id !== undefined) {
        properties.id = node.id;
      }

      const styles = node.flags.map((flag) => FLAG_STYLES[flag]).filter((style) => style !== undefined);
      if (styles.length > 0) {
        properties.style = [properties.style, ...styles].filter(Boolean).join('; ');
      }

      return [SKIP, index];
    });
  };
}

function isIdentifierCode(code: Code): code is number {
  return (
    code !== null &&
    ((code > 47 && code < 58) || // 0-9
      (code > 64 && code < 91) || // A-Z
      (code > 96 && code < 123) || // a-z
      code === hyphen ||
      code === underscore)
  );
}

export function headingAttributesSyntax(flags: string[] = KNOWN_FLAGS): Extension {
  function tokenizeHeadingAttributes(this: TokenizeContext, effects: Effects, ok: State, nok: State): State {
    return createHeadingAttributesTokenizer(effects, ok, nok, flags);
  }

  return {
    text: { [leftBrace]: { name: 'headingAttributes', tokenize: tokenizeHeadingAttributes } }
  };
}

function createHeadingAttributesTokenizer(effects: Effects, ok: State, nok: State, flags: string[]): State {
  let size = 0;
  let buffer = '';
  let seenId = false;

  return start;

  function start(code: Code): State | undefined {
    if (code !== leftBrace) {
      return nok(code);
    }
    effects.enter('headingAttributes');
    effects.enter('headingAttributesMarker');
    effects.consume(code);
    effects.exit('headingAttributesMarker');
    return attributeStart;
  }

  function attributeStart(code: Code): State | undefined {
    size = 0;
    buffer = '';

    if (code === hashtag) {
      if (seenId) {
        return nok(code);
      }
      seenId = true;
      effects.enter('headingAttributesId');
      effects.enter('headingAttributesIdMarker');
      effects.consume(code);
      effects.exit('headingAttributesIdMarker');
      effects.enter('headingAttributesIdValue');
      return identifier;
    }

    if (isIdentifierCode(code)) {
      effects.enter('headingAttributesFlag');
      return flag(code);
    }

    return nok(code);
  }

  function identifier(code: Code): State | undefined {
    if (isIdentifierCode(code) && size < MAX_ID_SIZE) {
      effects.consume(code);
      size++;
      return identifier;
    }

    if (size === 0 || (code !== rightBrace && !markdownSpace(code))) {
      return nok(code);
    }

    effects.exit('headingAttributesIdValue');
    effects.exit('headingAttributesId');
    return afterAttribute(code);
  }

  function flag(code: Code): State | undefined {
    if (isIdentifierCode(code) && size < MAX_ID_SIZE) {
      effects.consume(code);
      buffer += String.fromCharCode(code);
      size++;
      return flag;
    }

    if (!flags.includes(buffer) || (code !== rightBrace && !markdownSpace(code))) {
      return nok(code);
    }

    effects.exit('headingAttributesFlag');
    return afterAttribute(code);
  }

  function afterAttribute(code: Code): State | undefined {
    if (markdownSpace(code)) {
      return factorySpace(effects, attributeStart, 'whitespace')(code);
    }
    if (code === rightBrace) {
      effects.enter('headingAttributesMarker');
      effects.consume(code);
      effects.exit('headingAttributesMarker');
      return afterClose;
    }
    return nok(code);
  }

  function afterClose(code: Code): State | undefined {
    if (markdownSpace(code)) {
      return factorySpace(effects, afterClose, 'whitespace')(code);
    }

    if (code !== null && !markdownLineEnding(code)) {
      return nok(code);
    }

    effects.exit('headingAttributes');
    return ok(code);
  }
}

export function headingAttributesFromMarkdown(): FromMarkdownExtension {
  return {
    enter: {
      headingAttributes: enterHeadingAttributes
    },
    exit: {
      headingAttributesIdValue: exitHeadingAttributesIdValue,
      headingAttributesFlag: exitHeadingAttributesFlag,
      headingAttributes: exitHeadingAttributes
    }
  };
}

function current(context: CompileContext): HeadingAttributes {
  return context.stack[context.stack.length - 1] as unknown as HeadingAttributes;
}

function enterHeadingAttributes(this: CompileContext, token: Token): undefined {
  const node: HeadingAttributes = { type: 'headingAttributes', flags: [], raw: '' };

  this.enter(node as never, token);
}

function exitHeadingAttributesIdValue(this: CompileContext, token: Token): undefined {
  current(this).id = this.sliceSerialize(token);
}

function exitHeadingAttributesFlag(this: CompileContext, token: Token): undefined {
  current(this).flags.push(this.sliceSerialize(token));
}

function exitHeadingAttributes(this: CompileContext, token: Token): undefined {
  current(this).raw = this.sliceSerialize(token);

  this.exit(token);
}

export function headingAttributesToMarkdown(): ToMarkdownExtension {
  return {
    handlers: {
      headingAttributes: (node: HeadingAttributes) => {
        const parts = node.id === undefined ? [] : ['#' + node.id];
        return '{' + [...parts, ...node.flags].join(' ') + '}';
      }
    }
  };
}

declare module 'mdast' {
  interface PhrasingContentMap {
    headingAttributes: HeadingAttributes;
  }
  interface RootContentMap {
    headingAttributes: HeadingAttributes;
  }
}

declare module 'micromark-util-types' {
  interface TokenTypeMap {
    headingAttributes: 'headingAttributes';
    headingAttributesMarker: 'headingAttributesMarker';
    headingAttributesId: 'headingAttributesId';
    headingAttributesIdMarker: 'headingAttributesIdMarker';
    headingAttributesIdValue: 'headingAttributesIdValue';
    headingAttributesFlag: 'headingAttributesFlag';
  }
}

declare module 'mdast-util-to-markdown' {
  interface ConstructNameMap {
    headingAttributes: 'headingAttributes';
  }
}
