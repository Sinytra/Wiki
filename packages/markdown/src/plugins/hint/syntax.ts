import { factorySpace } from 'micromark-factory-space';
import { markdownLineEnding, markdownSpace } from 'micromark-util-character';
import { classifyCharacter } from 'micromark-util-classify-character';
import type { Code, Effects, Extension, State, TokenizeContext } from 'micromark-util-types';

const questionMark = 63;
const leftBracket = 91;
const rightBracket = 93;
const leftParen = 40;
const rightParen = 41;
const backslash = 92;
const colon = 58;

const maxLabelSize = 999;

export function hintSyntax(): Extension {
  function tokenizeHint(this: TokenizeContext, effects: Effects, ok: State, nok: State): State {
    return createHintTokenizer(effects, ok, nok, this);
  }

  return {
    text: { [questionMark]: { name: 'hint', tokenize: tokenizeHint } },
    flow: { [questionMark]: { name: 'hintDefinition', tokenize: tokenizeHintDefinition } }
  };
}

function createHintTokenizer(effects: Effects, ok: State, nok: State, self: TokenizeContext): State {
  let size = 0;
  let seen = false;
  let balance = 0;

  return start;

  function start(code: Code): State | undefined {
    if (!classifyCharacter(self.previous)) {
      return nok(code);
    }
    effects.enter('hint');
    effects.enter('hintMarker');
    effects.consume(code);
    effects.exit('hintMarker');
    return labelBefore;
  }

  function labelBefore(code: Code): State | undefined {
    if (code !== leftBracket) {
      return nok(code);
    }
    effects.enter('hintLabel');
    effects.enter('hintLabelMarker');
    effects.consume(code);
    effects.exit('hintLabelMarker');
    return labelStart;
  }

  function labelStart(code: Code): State | undefined {
    if (code === rightBracket) {
      return nok(code);
    }
    effects.enter('hintLabelString');
    effects.enter('chunkText', { contentType: 'text' });
    return label(code);
  }

  function label(code: Code): State | undefined {
    if (code === null || markdownLineEnding(code) || code === leftBracket || size > maxLabelSize) {
      return nok(code);
    }

    if (code === rightBracket) {
      if (!seen) {
        return nok(code);
      }
      effects.exit('chunkText');
      effects.exit('hintLabelString');
      effects.enter('hintLabelMarker');
      effects.consume(code);
      effects.exit('hintLabelMarker');
      effects.exit('hintLabel');
      return afterLabel;
    }

    effects.consume(code);
    if (!seen) {
      seen = !markdownSpace(code);
    }
    size++;
    return code === backslash ? labelEscape : label;
  }

  function labelEscape(code: Code): State | undefined {
    if (code === leftBracket || code === backslash || code === rightBracket) {
      effects.consume(code);
      size++;
      return label;
    }
    return label(code);
  }

  function afterLabel(code: Code): State | undefined {
    if (code === leftParen) {
      return valueBefore(code);
    }
    if (code === leftBracket) {
      return referenceBefore(code);
    }
    return done(code);
  }

  function valueBefore(code: Code): State | undefined {
    effects.enter('hintValue');
    effects.enter('hintValueMarker');
    effects.consume(code);
    effects.exit('hintValueMarker');
    return valueStart;
  }

  function valueStart(code: Code): State | undefined {
    if (code === rightParen) return valueEnd(code);
    effects.enter('hintValueString');
    return value(code);
  }

  function value(code: Code): State | undefined {
    if (code === null || markdownLineEnding(code)) {
      return nok(code);
    }

    if (code === rightParen && balance === 0) {
      effects.exit('hintValueString');
      return valueEnd(code);
    }

    if (code === leftParen) {
      balance++;
    } else if (code === rightParen) {
      balance--;
    }

    effects.consume(code);
    return code === backslash ? valueEscape : value;
  }

  function valueEscape(code: Code): State | undefined {
    if (code === leftParen || code === rightParen || code === backslash) {
      effects.consume(code);
      return value;
    }
    return value(code);
  }

  function valueEnd(code: Code): State | undefined {
    effects.enter('hintValueMarker');
    effects.consume(code);
    effects.exit('hintValueMarker');
    effects.exit('hintValue');
    return done;
  }

  function referenceBefore(code: Code): State | undefined {
    effects.enter('hintReference');
    effects.enter('hintReferenceMarker');
    effects.consume(code);
    effects.exit('hintReferenceMarker');
    return referenceStart;
  }

  function referenceStart(code: Code): State | undefined {
    if (code === rightBracket) {
      return referenceEnd(code);
    }
    effects.enter('hintReferenceString');
    size = 0;
    return reference(code);
  }

  function reference(code: Code): State | undefined {
    if (code === null || markdownLineEnding(code) || code === leftBracket || size > maxLabelSize) {
      return nok(code);
    }

    if (code === rightBracket) {
      effects.exit('hintReferenceString');
      return referenceEnd(code);
    }

    effects.consume(code);
    size++;
    return code === backslash ? referenceEscape : reference;
  }

  function referenceEscape(code: Code): State | undefined {
    if (code === leftBracket || code === backslash || code === rightBracket) {
      effects.consume(code);
      size++;
      return reference;
    }
    return reference(code);
  }

  function referenceEnd(code: Code): State | undefined {
    effects.enter('hintReferenceMarker');
    effects.consume(code);
    effects.exit('hintReferenceMarker');
    effects.exit('hintReference');
    return done;
  }

  function done(code: Code): State | undefined {
    effects.exit('hint');
    return ok(code);
  }
}

function tokenizeHintDefinition(effects: Effects, ok: State, nok: State): State {
  let size = 0;
  let seen = false;

  return start;

  function start(code: Code): State | undefined {
    if (code !== questionMark) {
      return nok(code);
    }
    effects.enter('hintDefinition');
    effects.enter('hintDefinitionMarker');
    effects.consume(code);
    effects.exit('hintDefinitionMarker');
    return labelBefore;
  }

  function labelBefore(code: Code): State | undefined {
    if (code !== leftBracket) {
      return nok(code);
    }
    effects.enter('hintDefinitionLabel');
    effects.enter('hintDefinitionLabelMarker');
    effects.consume(code);
    effects.exit('hintDefinitionLabelMarker');
    return labelStart;
  }

  function labelStart(code: Code): State | undefined {
    if (code === rightBracket) {
      return nok(code);
    }
    effects.enter('hintDefinitionLabelString');
    return label(code);
  }

  function label(code: Code): State | undefined {
    if (code === null || markdownLineEnding(code) || code === leftBracket || size > maxLabelSize) {
      return nok(code);
    }

    if (code === rightBracket) {
      if (!seen) {
        return nok(code);
      }
      effects.exit('hintDefinitionLabelString');
      effects.enter('hintDefinitionLabelMarker');
      effects.consume(code);
      effects.exit('hintDefinitionLabelMarker');
      effects.exit('hintDefinitionLabel');
      return afterLabel;
    }

    effects.consume(code);
    if (!seen) {
      seen = !markdownSpace(code);
    }
    size++;
    return code === backslash ? labelEscape : label;
  }

  function labelEscape(code: Code): State | undefined {
    if (code === leftBracket || code === backslash || code === rightBracket) {
      effects.consume(code);
      size++;
      return label;
    }
    return label(code);
  }

  function afterLabel(code: Code): State | undefined {
    if (code !== colon) {
      return nok(code);
    }
    effects.enter('hintDefinitionMarker');
    effects.consume(code);
    effects.exit('hintDefinitionMarker');
    return factorySpace(effects, valueStart, 'whitespace');
  }

  function valueStart(code: Code): State | undefined {
    if (code === null || markdownLineEnding(code)) {
      return nok(code);
    }
    effects.enter('hintDefinitionValueString');
    return value(code);
  }

  function value(code: Code): State | undefined {
    if (code === null || markdownLineEnding(code)) {
      effects.exit('hintDefinitionValueString');
      effects.exit('hintDefinition');
      return ok(code);
    }
    effects.consume(code);
    return code === backslash ? valueEscape : value;
  }

  function valueEscape(code: Code): State | undefined {
    if (code === null || markdownLineEnding(code)) {
      return value(code);
    }
    effects.consume(code);
    return value;
  }
}
