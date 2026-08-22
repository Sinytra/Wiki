import { decodeString } from 'micromark-util-decode-string';
import { normalizeIdentifier } from 'micromark-util-normalize-identifier';
import type { CompileContext, Extension as FromMarkdownExtension, Token } from 'mdast-util-from-markdown';
import type { Handle as ToMarkdownHandle, Options as ToMarkdownExtension } from 'mdast-util-to-markdown';
import type { Node, Parent, PhrasingContent } from 'mdast';

export interface Hint extends Parent {
  type: 'hint';
  hint: string | undefined;
  identifier: string;
  label: string;
  referenceType: 'full' | 'collapsed' | 'shortcut' | null;
  children: PhrasingContent[];
  _rawLabel?: string;
}

export interface HintDefinition extends Node {
  type: 'hintDefinition';
  identifier: string;
  label: string;
  hint: string;
}

type PeekableHandle = ToMarkdownHandle & { peek?: ToMarkdownHandle };

export function hintFromMarkdown(): FromMarkdownExtension {
  return {
    enter: {
      hint: enterHint,
      hintDefinition: enterHintDefinition
    },
    exit: {
      hint: exitHint,
      hintLabelString: exitHintLabelString,
      hintValueString: exitHintValueString,
      hintValue: exitHintValue,
      hintReference: exitHintReference,
      hintReferenceString: exitHintReferenceString,
      hintDefinition: exitHintDefinition,
      hintDefinitionLabelString: exitHintDefinitionLabelString,
      hintDefinitionValueString: exitHintDefinitionValueString
    }
  };
}

function top<Value>(stack: Value[]): Value {
  return stack[stack.length - 1]!;
}

function current<Node extends Hint | HintDefinition>(context: CompileContext): Node {
  return top(context.stack) as Node;
}

function enterHint(this: CompileContext, token: Token): undefined {
  const node: Hint = {
    type: 'hint',
    hint: undefined,
    identifier: '',
    label: '',
    referenceType: 'shortcut',
    children: []
  };

  this.enter(node, token);
}

function exitHintLabelString(this: CompileContext, token: Token): undefined {
  current<Hint>(this)._rawLabel = this.sliceSerialize(token);
}

function exitHintValueString(this: CompileContext, token: Token): undefined {
  current<Hint>(this).hint = decodeString(this.sliceSerialize(token));
}

function exitHintValue(this: CompileContext): undefined {
  const node = current<Hint>(this);
  if (node.hint === undefined) {
    node.hint = '';
  }
  node.referenceType = null;
}

function exitHintReferenceString(this: CompileContext, token: Token): undefined {
  const node = current<Hint>(this);
  const raw = this.sliceSerialize(token);
  node.label = decodeString(raw);
  node.identifier = normalizeIdentifier(raw).toLowerCase();
  node.referenceType = 'full';
}

function exitHintReference(this: CompileContext): undefined {
  const node = current<Hint>(this);
  if (node.referenceType !== 'full') {
    node.referenceType = 'collapsed';
  }
}

function exitHint(this: CompileContext, token: Token): undefined {
  const node = current<Hint>(this);
  const raw = node._rawLabel || '';
  delete node._rawLabel;

  if (node.referenceType && !node.identifier) {
    node.label = decodeString(raw);
    node.identifier = normalizeIdentifier(raw).toLowerCase();
  }

  this.exit(token);
}

function enterHintDefinition(this: CompileContext, token: Token): undefined {
  const node: HintDefinition = { type: 'hintDefinition', identifier: '', label: '', hint: '' };

  this.enter(node, token);
}

function exitHintDefinitionLabelString(this: CompileContext, token: Token): undefined {
  const node = current<HintDefinition>(this);
  const raw = this.sliceSerialize(token);
  node.label = decodeString(raw);
  node.identifier = normalizeIdentifier(raw).toLowerCase();
}

function exitHintDefinitionValueString(this: CompileContext, token: Token): undefined {
  current<HintDefinition>(this).hint = decodeString(this.sliceSerialize(token)).trim();
}

function exitHintDefinition(this: CompileContext, token: Token): undefined {
  this.exit(token);
}

export function hintToMarkdown(): ToMarkdownExtension {
  hintHandler.peek = () => '?';

  return {
    handlers: { hint: hintHandler, hintDefinition: hintDefinitionHandler },
    unsafe: [
      { character: '?', after: '\\[', inConstruct: 'phrasing' },
      { atBreak: true, character: '*', after: '\\[' }
    ]
  };
}

const hintHandler: PeekableHandle = (node: Hint, _parent, state, info) => {
  const tracker = state.createTracker(info);
  const exit = state.enter('hint');

  let value = tracker.move('?[');
  value += tracker.move(
    state.containerPhrasing(node, {
      before: value,
      after: ']',
      ...tracker.current()
    })
  );
  value += tracker.move(']');

  if (node.referenceType === 'full') {
    value += tracker.move('[' + (node.label || node.identifier) + ']');
  } else if (node.referenceType === 'collapsed') {
    value += tracker.move('[]');
  } else if (node.referenceType !== 'shortcut') {
    value += tracker.move('(' + escapeValue(node.hint || '') + ')');
  }

  exit();
  return value;
};

const hintDefinitionHandler: ToMarkdownHandle = (node: HintDefinition) => {
  return '?[' + (node.label || node.identifier) + ']: ' + node.hint;
};

function escapeValue(value: string): string {
  return value.replace(/[\\()]/g, '\\$&');
}
