import {NextRequest, NextResponse} from "next/server";
import {ImageResponse} from "next/og";
import platforms, {PlatformProject} from "@/lib/platforms";
import sharp from "sharp";
import {getProcessURL} from "@/lib/utils";
import {AssetLocation} from "@/lib/assets";
import service from "@/lib/service";
import {DEFAULT_DOCS_VERSION, DEFAULT_LOCALE} from "@/lib/constants";
import matter from "gray-matter";
import {DocsEntryMetadata} from "@/lib/docs/metadata";

export const runtime = 'nodejs';

const size = {
  width: 1200,
  height: 630
}

interface DocsPathCoords {
  locale: string;
  slug: string;
  version: string;
  path?: string;
}

async function getFont() {
  const fonts = {
    'Inter': 'Inter_28pt-Bold.ttf',
    'SourceCodePro': 'SourceCodePro-Medium.ttf'
  };

  return Promise.all(Object.entries(fonts).map(async e => {
    const resp = await fetch(`${getProcessURL()}/static/${e[1]}`);
    const data = await resp.arrayBuffer();

    return {
      name: e[0],
      data: data,
      style: 'normal'
    }
  }));
}

function PagePath({locale, slug, version, path}: DocsPathCoords) {
  const fullPath = `/${locale === 'en' ? '' : locale + '/'}project/${slug}/${version}${path ? '/' + path : ''}`;

  return (
    <span style={{
      marginTop: 'auto',
      width: '100%',
      alignSelf: 'flex-start',
      fontSize: '1.8rem',
      color: '#EBEBF599',
      fontFamily: 'monospace, SourceCodePro',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      flexShrink: 0
    }}>
      {fullPath}
    </span>
  );
}

function WikiHeader() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      width: '100%',
      alignItems: 'center'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center',
        marginRight: '4rem',
        marginLeft: '4rem'
      }}>
        <span style={{fontSize: '4.2rem'}}>Modded Minecraft Wiki</span>

        <img src="https://sinytra.org/logo.png" width={120} height={120} alt="Sinytra logo"/>
      </div>

      <hr style={{
        height: '1px',
        border: '2px solid #EBEBF599',
        width: '100%',
        marginTop: '1rem',
        marginBottom: '2rem'
      }}/>
    </div>
  )
}

async function projectPageImage(coords: DocsPathCoords, project: PlatformProject, fonts: any) {
  const getImageBase64 = async (url: string) => {
    const resp = await fetch(url);
    const buf = await resp.arrayBuffer();

    const buffer = await sharp(buf).toFormat('png').toBuffer()
    return {
      url: `data:image/png;base64,${buffer.toString('base64')}`,
    };
  };

  const acualUrl = project.icon_url.endsWith('.webp') ? (await getImageBase64(project.icon_url)).url : project.icon_url;

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: '#1b1b1f',
          color: '#fffff5db',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: '2rem',
          paddingLeft: '3.5rem',
          paddingRight: '3.5rem',
        }}
      >
        <WikiHeader/>

        <div style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '80%',
          height: '60%',
          gap: '1rem'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            overflow: 'hidden',
            width: '100%'
          }}>
            <span style={{
              fontSize: '3.5rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '49rem'
            }}>
              {project.name}
            </span>
            <span style={{
              color: '#EBEBF599',
              fontSize: '2.5rem',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              maxHeight: '15.5rem'
            }}>
              {project.summary}
            </span>
          </div>

          <div style={{display: 'flex', alignSelf: 'flex-end', flexDirection: 'row'}}>
            <img src={acualUrl} width={196} height={196} alt={project.name}/>
          </div>
        </div>

        <PagePath {...coords}/>
      </div>
    ),
    {
      ...size,
      fonts
    }
  );
}

function docsEntryPageResponse(coords: DocsPathCoords, project: string, title: string, iconUrl: AssetLocation | null, fonts: any) {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: '#1b1b1f',
          color: '#fffff5db',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '2rem',
          paddingLeft: '3.5rem',
          paddingRight: '3.5rem'
        }}
      >
        <WikiHeader/>

        <div style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          paddingBottom: '14rem'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '75%',
            gap: '1rem',
            overflow: 'hidden'
          }}>
            <span style={{
              fontSize: '3.5rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '60rem'
            }}>
              {title}
            </span>
            <span style={{
              color: '#EBEBF599',
              fontSize: '2.5rem',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              maxHeight: '12rem'
            }}>
              {project}
            </span>
          </div>

          <div style={{display: 'flex', alignSelf: 'flex-end', flexDirection: 'row'}}>
            {iconUrl && <img src={iconUrl.src} width={196} height={196} alt={title}/>}
          </div>
        </div>

        <PagePath {...coords}/>
      </div>
    ),
    {
      ...size,
      fonts
    }
  );
}

export async function GET(req: NextRequest) {
  const {searchParams} = req.nextUrl;
  const slug = searchParams.get('slug');
  if (!slug) {
    return NextResponse.json({'error': 'Missing slug parameter'}, {status: 400})
  }

  const fonts = await getFont();
  const locale = searchParams.get('locale') || DEFAULT_LOCALE;
  const version = searchParams.get('version') || DEFAULT_DOCS_VERSION;

  const coords: DocsPathCoords = {locale, slug, version};

  const pathVal = searchParams.get('path');
  if (!pathVal) {
    const project = await service.getProject(slug);
    if (!project) {
      return NextResponse.error();
    }
    const platformProject = await platforms.getPlatformProject(project.platform, project.slug);
    return projectPageImage(coords, platformProject, fonts);
  }

  const path = pathVal.split('/');
  const page = await service.getDocsPage(slug, path, version, locale);
  if (!page) {
    return NextResponse.error();
  }

  const project = await platforms.getPlatformProject(page.project.platform, page.project.slug);
  const metadata = matter(page.content).data as DocsEntryMetadata;

  const iconUrl: AssetLocation | null = metadata.hide_icon === true || !metadata.icon && !metadata.id ? null : await service.getAsset(slug, (metadata.icon || metadata.id)!, version);

  return docsEntryPageResponse({...coords, path: pathVal}, project.name, metadata.title || 'Document', iconUrl, fonts);
}