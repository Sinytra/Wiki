import service from '@/lib/service';
import { getCanonicalLocalePrefix } from '@/lib/seo';
import { plainTextError, plainTextNotFound, rawPageResponse } from '@/lib/discovery/rawPage';
import { ProjectRouteParams } from '@repo/shared/types/routes';
import { docsHomepagePath } from '@/lib/discovery/navigation';

export async function GET(request: Request, props: { params: Promise<ProjectRouteParams> }) {
  const params = await props.params;
  const { slug, version, locale } = params;
  const ctx = { id: slug, version, locale };

  let project;
  let page;
  try {
    project = await service.getProject(ctx);
    page = await service.getDocsIndexPage(ctx);
  } catch (e) {
    return plainTextError(`Failed to read the documentation homepage of project '${slug}'.`, e);
  }

  if (!project || !page) {
    return plainTextNotFound(
      `Project '${slug}' has no documentation homepage for version '${version}' in locale '${locale}'.`
    );
  }

  return rawPageResponse(
    page,
    (prefix) => docsHomepagePath({ ...params, locale: prefix }),
    params,
    getCanonicalLocalePrefix(locale, project.locales)
  );
}
