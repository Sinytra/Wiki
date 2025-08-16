import metadataJsonSchema from './schemas/sinytra-wiki.schema.json';
import folderMetadataJsonSchema from './schemas/_meta.schema.json';
import {compileSchema, JsonSchema, SchemaNode, JsonError} from 'json-schema-library';

// _meta.json
export type RawDocumentationFolderMetadata = Record<string, string | DocumentationFolderMetadataEntry>;

export type DocumentationFolderMetadata = Record<string, DocumentationFolderMetadataEntry>;

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
      // @ts-expect-error assign
      obj[key] = typeof value === 'object' ? value : {name: value};
      return obj;
    }, {});
}

export class ValidationError extends Error {
  constructor(message = '',) {
    super(message);
    this.name = 'ValidationError';
  }
}

function validateMetadataFile(obj: any): boolean {
  const errors: JsonError[] = validateJsonSchema(metadataJsonSchema, obj);

  if (errors.length > 0) {
    throw new ValidationError(`Error validating documentation metadata:\n${errors.map(e => `- ${e.message}`).join('\n')}`);
  }

  return true;
}

function validateFolderMetadataFile(obj: any): boolean {
  const errors = validateJsonSchema(folderMetadataJsonSchema, obj);

  if (errors.length > 0) {
    throw new ValidationError(`Error validating folder metadata:\n${errors.map(e => `- ${e.message}`).join('\n')}`);
  }

  return true;
}

function validateJsonSchema(rawSchema: JsonSchema, data: unknown): JsonError[] {
  const schema: SchemaNode = compileSchema(rawSchema);
  const { valid, errors } = schema.validate(data);
  return valid ? [] : errors;
}

export default {
  validateMetadataFile,
  parseFolderMetadata
};