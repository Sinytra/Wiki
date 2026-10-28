import service from '@/lib/service';
import { getCanonicalLocalePrefix } from '@/lib/seo';
import { plainTextError, plainTextNotFound, rawPageResponse } from '@/lib/discovery/rawPage';
import { constructPagePath } from '@/lib/service/serviceUtil';
import { DocsRouteParams } from '@repo/shared/types/routes';
import { docsPagePath } from '@/lib/discovery/navigation';

interface Props {
  params: Promise<DocsRouteParams>;
}

export async function GET(request: Request, props: Props) {
  const params = await props.params;
  const { slug, version, locale, path } = params;
  const ctx = { id: slug, version, locale };

  let project;
  let page;
  try {
    project = await service.getProject(ctx);
    page = await service.getDocsPage(path, false, ctx);
  } catch (e) {
    return plainTextError(`Failed to read documentation page '${constructPagePath(path)}' of project '${slug}'.`, e);
  }

  if (!project || !page) {
    return plainTextNotFound(
      `Project '${slug}' has no documentation page '${constructPagePath(path)}' for version '${version}' in locale '${locale}'.`
    );
  }

  return rawPageResponse(
    page,
    (prefix) => docsPagePath({ ...params, locale: prefix }, path),
    params,
    getCanonicalLocalePrefix(locale, project.locales)
  );
}
