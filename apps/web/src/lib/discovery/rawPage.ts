import { ProjectPage } from '@sinytra/wiki-api-types';

export const RAW_PAGE_SUFFIX = '.txt';

export function plainTextResponse(body: string, status: number = 200): Response {
  return new Response(body, {
    status,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  });
}

export function plainTextNotFound(message: string): Response {
  return plainTextResponse(`${message}\n`, 404);
}

export function plainTextError(message: string, error: unknown): Response {
  console.error(message, error);
  return plainTextResponse(`${message}\n`, 500);
}

export function rawPageResponse(page: ProjectPage): Response {
  return plainTextResponse(page.content);
}
