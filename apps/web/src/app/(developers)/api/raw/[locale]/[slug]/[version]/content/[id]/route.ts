import service from '@/lib/service';
import { getCanonicalLocalePrefix } from '@/lib/seo';
import { plainTextError, plainTextNotFound, rawPageResponse } from '@/lib/discovery/rawPage';
import { ContentRouteParams } from '@repo/shared/types/routes';
import { contentPagePath } from '@/lib/discovery/navigation';

interface Props {
  params: Promise<ContentRouteParams>;
}

export async function GET(request: Request, props: Props) {
  const params = await props.params;
  const { slug, version, locale, id: encodedId } = params;
  const ctx = { id: slug, version, locale };
  const ref = decodeURIComponent(encodedId);

  let project;
  let page;
  try {
    project = await service.getProject(ctx);
    page = await service.getProjectContentPage(ref, ctx);
  } catch (e) {
    return plainTextError(`Failed to read game content page '${ref}' of project '${slug}'.`, e);
  }

  if (!project || !page) {
    return plainTextNotFound(
      `Project '${slug}' has no game content page '${ref}' for version '${version}' in locale '${locale}'.`
    );
  }

  return rawPageResponse(
    page,
    (prefix) => contentPagePath({ ...params, locale: prefix }, ref),
    params,
    getCanonicalLocalePrefix(locale, project.locales)
  );
}
