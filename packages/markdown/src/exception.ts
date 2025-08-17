import {VFileMessage} from 'vfile-message';

export class MarkdownError extends Error {
  constructor(message = '', public details: string) {
    super(message);
    this.name = 'MarkdownError';
  }
}

export function formatMarkdownError(error: any): string {
  if (error instanceof VFileMessage) {
    return error.name + ': ' + error.message;
  }

  return error.toString();
}