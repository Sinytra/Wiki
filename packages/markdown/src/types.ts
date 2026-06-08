import { DocsEntryMetadata, RawFrontmatter } from './metadata';

declare module 'vfile' {
  interface DataMap {
    matter: RawFrontmatter;
    metadata: DocsEntryMetadata;
  }
}
