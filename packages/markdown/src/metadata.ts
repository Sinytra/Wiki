import { ChangelogEntry, GameContentType, InfoboxTab, InvItem } from '@sinytra/wiki-api-types';

export interface FileHeading {
  depth: number;
  value: string;
  id: string;
  top?: boolean;
}

export interface RawInfobox {
  title: string | null;
  tabs?: Array<InfoboxTab> | null;
  inventory?: Array<string | InvItem> | null;
  display?: Array<string> | null;
}

export interface RawFrontmatter {
  id?: string | string[];
  title?: string;
  icon?: string;
  ref?: string | null;
  infobox?: RawInfobox;
  type?: GameContentType | null;
  custom?: { [key in string]: string } | null;
  history?: Array<ChangelogEntry> | null;
}

export interface DocsEntryMetadata extends RawFrontmatter {
  headings?: FileHeading[];
  links?: string[];
}
