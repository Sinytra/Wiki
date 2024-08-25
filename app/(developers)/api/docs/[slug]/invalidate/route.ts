import {NextRequest} from "next/server";
import cacheUtil from "@/lib/cacheUtil";
import database from "@/lib/database";
import {getHttpErrorDetailsURL} from "@/lib/utils";
import verification from "@/lib/forms/verification";

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

  if (!(await verification.verifyProjectOwnership(mod, auth))) {
    return Response.json({ message: 'Verification error' }, { status: 401 });
  }

  cacheUtil.clearModCaches(params.slug);

  return Response.json({ message: 'Docs page cache invalidated successfully' });
}