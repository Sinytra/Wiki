import {NextRequest} from "next/server";
import {getHttpErrorDetailsURL} from "@/lib/utils";
import remoteServiceApi from "@/lib/service/remoteServiceApi";

export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
  // Expect authorization using GitHub user token
  const auth= request.headers.get('Authorization');
  if (!auth) {
    return Response.json({ message: 'Unauthorized', details: getHttpErrorDetailsURL(401) }, { status: 401 });
  }

  const response = await remoteServiceApi.revalidateProject(params.slug, auth);
  if ('error' in response) {
    return Response.json({ error: response.error }, {status: 400})
  }

  return Response.json({ message: 'Docs page cache invalidated successfully' });
}