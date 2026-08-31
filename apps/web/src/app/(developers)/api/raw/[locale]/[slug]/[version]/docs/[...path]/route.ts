import service from '@/lib/service';
import { plainTextError, plainTextNotFound, rawPageResponse } from '@/lib/discovery/rawPage';
import { constructPagePath } from '@/lib/service/serviceUtil';
import { DocsRouteParams } from '@repo/shared/types/routes';

interface Props {
  params: Promise<DocsRouteParams>;
}

export async function GET(request: Request, props: Props) {
  const { slug, version, locale, path } = await props.params;
  const ctx = { id: slug, version, locale };

  let page;
  try {
    page = await service.getDocsPage(path, false, ctx);
  } catch (e) {
    return plainTextError(`Failed to read documentation page '${constructPagePath(path)}' of project '${slug}'.`, e);
  }

  if (!page) {
    return plainTextNotFound(
      `Project '${slug}' has no documentation page '${constructPagePath(path)}' for version '${version}' in locale '${locale}'.`
    );
  }

  return rawPageResponse(page);
}
