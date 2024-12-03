import metadataJsonSchema from '@/public/sinytra-wiki.schema.json';
import folderMetadataJsonSchema from '@/public/_meta.schema.json';
import {Draft, Draft2019, JsonError} from "json-schema-library";

export type GameContentType = 'block' | 'item' | 'other';

export interface FileHeading {
  depth: number;
  value: string;
  id: string;
}

// Frontmatter
export interface DocsEntryMetadata {
  title?: string;
  id?: string;
  type?: GameContentType;
  custom?: Record<string, string>;
  icon?: string;
  hide_icon?: boolean;
  hide_meta?: boolean;

  _headings?: FileHeading[];
}

// _meta.json
export interface RawDocumentationFolderMetadata extends Record<string, string | DocumentationFolderMetadataEntry> {}

export interface DocumentationFolderMetadata extends Record<string, DocumentationFolderMetadataEntry> {}

export interface DocumentationFolderMetadataEntry {
  name: string;
  icon?: string;
}

function parseFolderMetadata(source: string): DocumentationFolderMetadata {
  const meta = JSON.parse(source);

  validateFolderMetadataFile(meta);

  const validated = meta as RawDocumentationFolderMetadata;
  return Object.keys(validated)
    .reduce((obj, key) => {
      const value = validated[key];
      // @ts-ignore
      obj[key] = typeof value === 'object' ? value : {name: value};
      return obj;
    }, {});
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

export default {
  validateMetadataFile,
  parseFolderMetadata
};