import {ModPlatform} from "@/lib/platforms";
import metadataJsonSchema from '@/public/sinytra-wiki.schema.json';
import folderMetadataJsonSchema from '@/public/_meta.schema.json';
import {Draft, Draft2019, JsonError} from "json-schema-library";

export type ModContentType = 'block' | 'item' | 'other';

export interface FileHeading {
  depth: number;
  value: string;
  id: string;
}

export interface DocsEntryMetadata {
  title?: string;
  id?: string;
  type?: ModContentType;
  custom?: Record<string, string>;
  icon?: string;
  hide_icon?: boolean;
  hide_meta?: boolean;

  _headings?: FileHeading[];
}

export interface DocumentationProjectMetadata {
  id: string;
  platform: ModPlatform;
  slug: string;
}

export interface DocumentationFolderMetadata extends Record<string, string>{}

const metadataFileName = 'sinytra-wiki.json';

function parseMetadata(source: string): DocumentationProjectMetadata {
  const meta = JSON.parse(source);

  validateMetadataFile(meta);

  return meta as DocumentationProjectMetadata;
}

function parseFolderMetadata(source: string): DocumentationFolderMetadata {
  const meta = JSON.parse(source);

  validateFolderMetadataFile(meta);

  return meta as DocumentationFolderMetadata;
}

export class ValidationError extends Error {
  constructor(message = "",) {
    super(message);
    this.name = 'ValidationError';
  }
}

function validateMetadataFile(obj: any): boolean {
  const jsonSchema: Draft = new Draft2019(metadataJsonSchema);
  const errors: JsonError[] = jsonSchema.validate(obj);

  if (errors.length > 0) {
    console.log('found errors is metadata', errors);
    throw new ValidationError(`Error validating documentation metadata:\n${errors.map(e => `- ${e.message}`).join('\n')}`);
  }

  return true;
}

function validateFolderMetadataFile(obj: any): boolean {
  const jsonSchema: Draft = new Draft2019(folderMetadataJsonSchema);
  const errors: JsonError[] = jsonSchema.validate(obj);

  if (errors.length > 0) {
    throw new ValidationError(`Error validating folder metadata:\n${errors.map(e => `- ${e.message}`).join('\n')}`);
  }

  return true;
}

const metadata = {
  parseMetadata,
  metadataFileName,
  validateMetadataFile,
  parseFolderMetadata
};

export default metadata;