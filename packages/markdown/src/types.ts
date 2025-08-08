import {DocsEntryMetadata} from './metadata';

declare module 'vfile' {
  interface DataMap {
    matter: DocsEntryMetadata;
  }
}