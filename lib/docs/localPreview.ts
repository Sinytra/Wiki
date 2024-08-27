import {NextRequest, NextResponse} from "next/server";

function isEnabled(): boolean {
  return process.env.ENABLE_LOCAL_PREVIEW === 'true';
}

function previewMiddleware(request: NextRequest, response: NextResponse): NextResponse | null {
  const path = request.nextUrl.pathname;
  if (!path.startsWith('/preview') && !path.startsWith('/mod')) {
    return NextResponse.redirect(new URL('/preview', request.url), { status: 307 });
  }
  return null;
}

const localPreview = {
  isEnabled,
  previewMiddleware
};

export default localPreview;