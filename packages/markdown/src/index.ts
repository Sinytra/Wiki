import renderer from './renderer';
export {MarkdownError} from './exception';
export type {ComponentPatcher, DocumentationMarkdown} from './renderer';
export * from './metadata';

const markdown = renderer;

export default markdown;