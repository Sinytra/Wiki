import {NextRequest} from "next/server";
import devProjectApi from "@/lib/service/api/devProjectApi";

export async function POST(request: NextRequest, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  // Expect authorization using GitHub user token
  const auth= request.headers.get('Authorization');
  if (!auth) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const response = await devProjectApi.deployProject(params.slug, auth);
  if (!response.success) {
    return Response.json({ error: response.error }, {status: 400})
  }

  return Response.json({ message: 'Docs page cache invalidated successfully' });
}