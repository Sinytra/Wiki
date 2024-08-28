import {ModPlatform} from "@/lib/platforms";

export type ModContentType = 'block' | 'item' | 'other'; 

export interface DocsEntryMetadata {
  title?: string;
  id?: string;
  type?: ModContentType;
  custom?: Record<string, string>;
  icon?: string;
  hide_icon?: boolean;
}

export interface DocumentationProjectMetadata {
  id: string;
  platform: ModPlatform;
  slug: string;
}

const metadataFileName = 'sinytra-wiki.json';

function parseMetadata(source: string): DocumentationProjectMetadata {
  const meta = JSON.parse(source);
  // TODO Verify metadata
  return meta as DocumentationProjectMetadata;
}

const metadata = {
  parseMetadata,
  metadataFileName
};

export default metadata;