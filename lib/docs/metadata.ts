export type ModContentType = 'block' | 'item' | 'other'; 

export interface DocsEntryMetadata {
  title?: string;
  id?: string;
  type?: ModContentType;
  custom?: Record<string, string>;
}