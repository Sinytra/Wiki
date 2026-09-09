import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import platforms from '@repo/shared/platforms';
import { DEFAULT_DOCS_VERSION, DEFAULT_LOCALE } from '@repo/shared/constants';
import { Frontmatter } from '@sinytra/wiki-api-types';
import markdown from '@repo/markdown';
import { getProcessURL } from '@/lib/utils';
import service from '@/lib/service';
import { ProjectContext } from '@repo/shared/types/service';
import { OpenGraphFont, renderOpenGraphImage } from '@/components/og/OpenGraphImage';

export const runtime = 'nodejs';

const FONTS = {
  Inter: 'Inter_28pt-Bold.ttf',
  SourceCodePro: 'SourceCodePro-Medium.ttf'
};

async function getFonts(): Promise<OpenGraphFont[]> {
  return await Promise.all(
    Object.entries(FONTS).map(async ([name, file]): Promise<OpenGraphFont> => {
      const resp = await fetch(`${getProcessURL()}/static/${file}`);
      if (!resp.ok) {
        throw new Error(`Failed to load font ${file}: ${resp.status}`);
      }
      return { name, data: await resp.arrayBuffer(), style: 'normal' };
    })
  );
}

async function createInlineImage(url?: string | null): Promise<string | null> {
  if (!url) {
    return null;
  }
  try {
    const resp = await fetch(url);
    if (!resp.ok) {
      return null;
    }
    const buffer = await sharp(Buffer.from(await resp.arrayBuffer()))
      .png()
      .toBuffer();
    return `data:image/png;base64,${buffer.toString('base64')}`;
  } catch (e) {
    console.error('Failed to load OG image asset', url, e);
    return null;
  }
}

async function getPageIcon(frontmatter: Frontmatter, ctx: ProjectContext): Promise<string | null> {
  const asset = frontmatter.icon
    ? await service.getAsset(frontmatter.icon, ctx)
    : frontmatter.id?.[0]
      ? await service.getItemAsset(frontmatter.id[0], ctx)
      : null;
  return createInlineImage(asset?.src);
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const slug = searchParams.get('slug');
  if (!slug) {
    return NextResponse.json({ error: 'Missing slug parameter' }, { status: 400 });
  }

  const locale = searchParams.get('locale') || DEFAULT_LOCALE;
  const version = searchParams.get('version') || DEFAULT_DOCS_VERSION;
  const ctx: ProjectContext = { id: slug, version, locale };

  const project = await service.getProject(ctx);
  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }
  const platformProject = await platforms.getPlatformProjectOrNull(project);
  if (!platformProject) {
    return NextResponse.json({ error: 'Platform project not found' }, { status: 404 });
  }

  const [fonts, projectIcon] = await Promise.all([getFonts(), createInlineImage(platformProject.icon_url)]);

  const path = searchParams.get('path');
  const id = searchParams.get('id');

  // Project overview
  if (!id && !path) {
    return renderOpenGraphImage(
      {
        title: platformProject.name,
        description: platformProject.summary,
        icon: projectIcon
      },
      fonts
    );
  }

  // Docs or content page
  const page = id
    ? await service.getProjectContentPage(id, ctx)
    : await service.getDocsPage(path!.split('/'), false, ctx);
  if (!page) {
    return NextResponse.json({ error: 'Page not found' }, { status: 404 });
  }

  const { frontmatter } = page;
  return renderOpenGraphImage(
    {
      project: { text: platformProject.name, icon: projectIcon },
      title: frontmatter.title || platformProject.name,
      description: await markdown.describeMarkdown(page.content),
      icon: await getPageIcon(frontmatter, ctx)
    },
    fonts
  );
}
