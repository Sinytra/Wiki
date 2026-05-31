import {ChangelogEntry, GameContentType, Infobox} from '@sinytra/wiki-api-types';

export interface FileHeading {
  depth: number;
  value: string;
  id: string;
  top?: boolean;
}

export interface RawFrontmatter {
  id?: string | string[];
  title?: string;
  icon?: string;
  infobox?: Infobox;
  type?: GameContentType | null;
  custom?: { [key in string]: string } | null;
  history?: Array<ChangelogEntry> | null;
}

export interface DocsEntryMetadata extends RawFrontmatter {
  headings?: FileHeading[];
  links?: string[];
}