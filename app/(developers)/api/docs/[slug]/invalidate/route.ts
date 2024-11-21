import {NextRequest} from "next/server";
import cacheUtil from "@/lib/cacheUtil";
import database from "@/lib/database";
import {getHttpErrorDetailsURL} from "@/lib/utils";
import {revalidatePath} from "next/cache";
import githubFacade from "@/lib/facade/githubFacade";
import service from "@/lib/service";

export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
  // Expect authorization using GitHub user token
  const auth= request.headers.get('Authorization');
  if (!auth) {
    return Response.json({ message: 'Unauthorized', details: getHttpErrorDetailsURL(401) }, { status: 401 });
  }

  const mod = await database.getProject(params.slug);
  if (mod === null) {
    return Response.json({ message: 'Not found', details: getHttpErrorDetailsURL(404) }, { status: 404 });
  }

  const parts = mod.source_repo.split('/');
  if (!(await githubFacade.verifyUserRepositoryOwnership(parts[0], parts[1], auth))) {
    return Response.json({ message: 'Verification error' }, { status: 401 });
  }

  cacheUtil.clearModCaches(params.slug);
  await service.invalidateCache(params.slug);
  revalidatePath(`/[locale]/(main)/mod/${params.slug}/[version]`, 'layout');

  return Response.json({ message: 'Docs page cache invalidated successfully' });
}