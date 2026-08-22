import type { Options as ToMarkdownExtension } from 'mdast-util-to-markdown';
import type { Hint, HintDefinition } from './mdast';

declare module 'mdast' {
  interface PhrasingContentMap {
    hint: Hint;
  }
  interface RootContentMap {
    hint: Hint;
    hintDefinition: HintDefinition;
  }
}

declare module 'micromark-util-types' {
  interface TokenTypeMap {
    hint: 'hint';
    hintMarker: 'hintMarker';
    hintLabel: 'hintLabel';
    hintLabelMarker: 'hintLabelMarker';
    hintLabelString: 'hintLabelString';
    hintValue: 'hintValue';
    hintValueMarker: 'hintValueMarker';
    hintValueString: 'hintValueString';
    hintReference: 'hintReference';
    hintReferenceMarker: 'hintReferenceMarker';
    hintReferenceString: 'hintReferenceString';
    hintDefinition: 'hintDefinition';
    hintDefinitionMarker: 'hintDefinitionMarker';
    hintDefinitionLabel: 'hintDefinitionLabel';
    hintDefinitionLabelMarker: 'hintDefinitionLabelMarker';
    hintDefinitionLabelString: 'hintDefinitionLabelString';
    hintDefinitionValueString: 'hintDefinitionValueString';
  }
}

declare module 'mdast-util-to-markdown' {
  interface ConstructNameMap {
    hint: 'hint';
  }
}

declare module 'unified' {
  interface Data {
    toMarkdownExtensions?: ToMarkdownExtension[];
  }
}
