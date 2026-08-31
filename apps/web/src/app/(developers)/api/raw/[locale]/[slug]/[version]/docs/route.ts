import service from '@/lib/service';
import { plainTextError, plainTextNotFound, rawPageResponse } from '@/lib/discovery/rawPage';
import { ProjectRouteParams } from '@repo/shared/types/routes';

export async function GET(request: Request, props: { params: Promise<ProjectRouteParams> }) {
  const { slug, version, locale } = await props.params;
  const ctx = { id: slug, version, locale };

  let page;
  try {
    page = await service.getDocsIndexPage(ctx);
  } catch (e) {
    return plainTextError(`Failed to read the documentation homepage of project '${slug}'.`, e);
  }

  if (!page) {
    return plainTextNotFound(
      `Project '${slug}' has no documentation homepage for version '${version}' in locale '${locale}'.`
    );
  }

  return rawPageResponse(page);
}
