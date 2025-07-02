export type GameContentType = 'block' | 'item' | 'other';

export interface FileHeading {
  depth: number;
  value: string;
  id: string;
  top?: boolean;
}

type ShortChangelogEntry = {[key: string]: string};

export type FullChangelogEntry = {
  version: string;
  date?: string;
  changes: string[];
};

export type Changelog = (ShortChangelogEntry | FullChangelogEntry)[];

// Frontmatter
export interface DocsEntryMetadata {
  title?: string;
  id?: string;
  type?: GameContentType;
  custom?: Record<string, string>;
  icon?: string;
  hide_icon?: boolean;
  hide_meta?: boolean;
  history?: Changelog;

  _headings?: FileHeading[];
}