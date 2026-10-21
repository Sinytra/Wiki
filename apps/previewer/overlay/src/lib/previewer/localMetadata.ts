import { ProjectMetadata } from '@sinytra/wiki-api-types';
import { parseProjectMetadata } from '@sinytra/wiki-wasm';

export class ValidationError extends Error {
  constructor(message = '') {
    super(message);
    this.name = 'ValidationError';
  }
}

function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

function parseMetadataFile(source: string): ProjectMetadata {
  try {
    return parseProjectMetadata(source);
  } catch (e) {
    throw new ValidationError(`Error validating documentation metadata:\n- ${errorMessage(e)}`);
  }
}

export default {
  parseMetadataFile
};
