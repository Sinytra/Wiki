import service from '@/lib/service';
import { plainTextError, plainTextNotFound, rawPageResponse } from '@/lib/discovery/rawPage';
import { ContentRouteParams } from '@repo/shared/types/routes';

interface Props {
  params: Promise<ContentRouteParams>;
}

export async function GET(request: Request, props: Props) {
  const { slug, version, locale, id: encodedId } = await props.params;
  const ctx = { id: slug, version, locale };
  const ref = decodeURIComponent(encodedId);

  let page;
  try {
    page = await service.getProjectContentPage(ref, ctx);
  } catch (e) {
    return plainTextError(`Failed to read game content page '${ref}' of project '${slug}'.`, e);
  }

  if (!page) {
    return plainTextNotFound(
      `Project '${slug}' has no game content page '${ref}' for version '${version}' in locale '${locale}'.`
    );
  }

  return rawPageResponse(page);
}
