import {NextRequest} from "next/server";
import cacheUtil from "@/lib/cacheUtil";

// Internal BE->FE route used to revalidate docs page cache for new deployments
export async function POST(request: NextRequest, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;

  // Expect authorization using internal API key
  if (process.env.FRONTEND_API_KEY) {
    const auth= request.headers.get('Authorization');
    if (!auth || auth.substring(7) !== process.env.FRONTEND_API_KEY) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }
  }

  console.log('Received BE revalidation request for project ', params.slug);
  cacheUtil.invalidateDocs(params.slug);

  return Response.json({ message: 'Docs page cache invalidated successfully' });
}